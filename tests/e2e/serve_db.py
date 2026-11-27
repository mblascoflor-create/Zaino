#!/usr/bin/env python3
"""serve_db.py — sirve los estáticos de site/ Y la base de datos simulada compartida.

    python3 serve_db.py [--port 8765] [--dir site] [--verbose]

Endpoints (todos aceptan ?ns=<nombre> para tener bases de datos separadas):
    GET    /__db                 -> {epoch, v, docs, leases}   (estado completo)
    GET    /__db?since=V&epoch=E -> {epoch, v, unchanged:true} si nada cambió
    POST   /__db  {"ops":[...]}  -> aplica operaciones en orden y devuelve el estado + "results"
    DELETE /__db                 -> vacía la base de datos

Operaciones (las mismas que aplica mock-claude.js en modo localStorage):
    {"t":"set","path":..,"data":{..}}  {"t":"update","path":..,"data":{..}}  {"t":"delete","path":..}
    {"t":"acquire","path":..,"holder":..,"ttlMs":..,"data"?:{..}}  {"t":"seed","docs":{ruta:cuerpo}}
    {"t":"reset"}

El estado vive en memoria: se pierde al parar el servidor. `epoch` cambia en cada arranque
para que los clientes detecten el reinicio.
"""
import argparse
import copy
import json
import os
import sys
import threading
import time
import uuid
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlsplit

HERE = os.path.dirname(os.path.abspath(__file__))
MAX_DOC_BYTES = 256 * 1024
MAX_DEPTH = 32


def _is_obj(x):
    return isinstance(x, dict)


def _merge(target, patch):
    """update(): objetos anidados se fusionan; lo demás (arrays incluidos) reemplaza."""
    for k, v in patch.items():
        if _is_obj(v) and _is_obj(target.get(k)):
            _merge(target[k], v)
        else:
            target[k] = copy.deepcopy(v)
    return target


def _depth(x):
    if isinstance(x, dict):
        return 1 + max((_depth(v) for v in x.values()), default=0)
    if isinstance(x, list):
        return 1 + max((_depth(v) for v in x), default=0)
    return 0


def _body_problem(body):
    if not _is_obj(body):
        return "document body must be a plain JSON object (not an array, scalar or null)"
    size = len(json.dumps(body, ensure_ascii=False, separators=(",", ":")).encode("utf-8"))
    if size > MAX_DOC_BYTES:
        return f"document exceeds 256 KiB serialized ({size} bytes)"
    if _depth(body) > MAX_DEPTH:
        return "document is more than 32 levels deep"
    return None


def _iso(ms):
    return datetime.fromtimestamp(ms / 1000, tz=timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def _fail(code, message):
    return {"ok": False, "code": code, "message": message}


def apply_op(s, op, now_ms):
    """Aplica UNA operación al espacio `s` ({v, docs, leases}). No muta nada si falla."""
    t, path = op.get("t"), op.get("path")
    docs = s["docs"]
    if t == "set":
        nxt = copy.deepcopy(op.get("data"))
    elif t == "update":
        if path not in docs:
            return _fail("invalid_argument", f"update(): document {path} does not exist")
        if not _is_obj(op.get("data")):
            return _fail("invalid_argument", _body_problem(op.get("data")))
        nxt = _merge(copy.deepcopy(docs[path]), op["data"])
    elif t == "delete":
        docs.pop(path, None)
        s["v"] += 1
        return {"ok": True}
    elif t == "acquire":
        lease = s["leases"].get(path)
        if lease and lease["exp"] > now_ms and lease["holder"] != op.get("holder"):
            return {"ok": True, "acquired": False, "expiresAt": _iso(lease["exp"])}
        if op.get("data") is not None:
            if not _is_obj(op["data"]):
                return _fail("invalid_argument", _body_problem(op["data"]))
            nxt = _merge(copy.deepcopy(docs.get(path, {})), op["data"])
            bad = _body_problem(nxt)
            if bad:
                return _fail("invalid_argument", bad)
            docs[path] = nxt
        for p in [p for p, l in s["leases"].items() if l["exp"] <= now_ms]:
            del s["leases"][p]
        ttl = op.get("ttlMs") or 30000
        s["leases"][path] = {"holder": op.get("holder"), "exp": now_ms + ttl}
        s["v"] += 1
        return {"ok": True, "acquired": True, "version": s["v"], "holder": op.get("holder"),
                "expiresAt": _iso(now_ms + ttl)}
    elif t == "reset":
        s["docs"], s["leases"] = {}, {}
        s["v"] += 1
        return {"ok": True}
    elif t == "seed":
        for p, body in (op.get("docs") or {}).items():
            docs[p] = copy.deepcopy(body)
        s["v"] += 1
        return {"ok": True}
    else:
        return _fail("invalid_argument", f"unknown op {t}")
    bad = _body_problem(nxt)
    if bad:
        return _fail("invalid_argument", bad)
    docs[path] = nxt
    s["v"] += 1
    return {"ok": True}


class Store:
    """Estado en memoria, un espacio por `ns`."""

    def __init__(self):
        self.lock = threading.Lock()
        self.epoch = uuid.uuid4().hex[:12]
        self.spaces = {}

    def space(self, ns):
        return self.spaces.setdefault(ns, {"v": 0, "docs": {}, "leases": {}})

    def snapshot(self, ns, extra=None):
        s = self.space(ns)
        out = {"epoch": self.epoch, "v": s["v"], "docs": s["docs"], "leases": s["leases"]}
        if extra:
            out.update(extra)
        return json.dumps(out, ensure_ascii=False).encode("utf-8")


class Handler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    # --- util ---
    def _json(self, status, payload):
        body = payload if isinstance(payload, bytes) else json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self):
        # Sin caché: tras reconstruir site/ el navegador siempre ve lo último.
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def log_message(self, fmt, *args):
        if getattr(self.server, "verbose", False):
            sys.stderr.write("%s - %s\n" % (self.log_date_time_string(), fmt % args))

    def _db_request(self):
        parts = urlsplit(self.path)
        if parts.path != "/__db":
            return None
        qs = parse_qs(parts.query)
        return {k: v[0] for k, v in qs.items()}

    # --- verbos ---
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "content-type")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        q = self._db_request()
        if q is None:
            if urlsplit(self.path).path == "/favicon.ico" and not os.path.exists(
                    os.path.join(self.directory, "favicon.ico")):
                self.send_response(204)  # evita un 404 ruidoso en la consola del navegador
                self.send_header("Content-Length", "0")
                self.end_headers()
                return
            return super().do_GET()
        store = self.server.store
        ns = q.get("ns", "")
        with store.lock:
            s = store.space(ns)
            if q.get("epoch") == store.epoch and q.get("since") == str(s["v"]):
                return self._json(200, {"epoch": store.epoch, "v": s["v"], "unchanged": True})
            return self._json(200, store.snapshot(ns))

    def do_POST(self):
        q = self._db_request()
        if q is None:
            return self._json(404, {"error": "not found"})
        try:
            length = int(self.headers.get("Content-Length") or 0)
            ops = json.loads(self.rfile.read(length) or b"{}").get("ops")
            assert isinstance(ops, list)
        except Exception as e:  # cuerpo ilegible
            return self._json(400, {"error": f"bad request: {e}"})
        store = self.server.store
        ns = q.get("ns", "")
        with store.lock:
            s = store.space(ns)
            now = int(time.time() * 1000)
            results = [apply_op(s, op, now) if isinstance(op, dict) else _fail("invalid_argument", "bad op")
                       for op in ops]
            return self._json(200, store.snapshot(ns, {"results": results}))

    def do_DELETE(self):
        q = self._db_request()
        if q is None:
            return self._json(404, {"error": "not found"})
        store = self.server.store
        ns = q.get("ns", "")
        with store.lock:
            apply_op(store.space(ns), {"t": "reset"}, 0)
            return self._json(200, store.snapshot(ns))


def make_server(port=8765, directory=None, host="127.0.0.1", verbose=False):
    """Crea (sin arrancar) el servidor. port=0 elige un puerto libre."""
    directory = os.path.abspath(directory or os.path.join(HERE, "site"))

    def handler(*a, **kw):
        return Handler(*a, directory=directory, **kw)

    ThreadingHTTPServer.allow_reuse_address = True
    srv = ThreadingHTTPServer((host, port), handler)
    srv.daemon_threads = True
    srv.store = Store()
    srv.verbose = verbose
    return srv


def start_in_thread(port=0, directory=None):
    """Arranca el servidor en un hilo demonio. Devuelve (server, puerto)."""
    srv = make_server(port, directory)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, srv.server_address[1]


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--port", type=int, default=8765)
    ap.add_argument("--dir", default=os.path.join(HERE, "site"))
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--verbose", action="store_true")
    args = ap.parse_args()
    os.makedirs(args.dir, exist_ok=True)
    srv = make_server(args.port, args.dir, args.host, args.verbose)
    print(f"serve_db: http://localhost:{args.port}/  (estáticos de {args.dir}; db en /__db)", flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
