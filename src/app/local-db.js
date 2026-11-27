/* mock-claude.js — simulador local del runtime `window.claude.use(name)` de los Artifacts.
 *
 * Script clásico: cárgalo ANTES del script de la página. Implementa las capacidades
 * `db` (dts/db.d.ts) y `downloads` (dts/downloads.d.ts); cualquier otro nombre -> null.
 *
 * Configuración (se lee una vez, al cargar):
 *   window.__MOCK__ = "modo" | {mode, sync}   o   localStorage.__mockmode__ = "modo"
 *     modos (combinables con comas): normal | signedout | readonly | slow | nodownloads
 *   window.__MOCK_SYNC_URL__ = "/__db"        o   localStorage.__mocksync__ = "/__db"
 *     -> el estado vive en serve_db.py (compartido entre contextos/"móviles"), con
 *        sondeo cada 400 ms. Sin eso (o si el endpoint no responde) vive en
 *        localStorage["__mockdb__"] y se comparte entre pestañas por el evento `storage`.
 *
 * Helpers de test: window.__mock  { dump(), reset(), seed(obj), idle(), refresh(), ... }
 * Descargas registradas: window.__downloads
 */
(function () {
  "use strict";
  var W = window;
  if (W.__mock) return; // ya cargado

  var LS_DB = "__mockdb__";
  var MAX_DOC_BYTES = 256 * 1024, MAX_DEPTH = 32, MAX_SUBS = 64, POLL_MS = 400;

  function lsGet(k) { try { return W.localStorage.getItem(k); } catch (e) { return null; } }

  // ───────────────────────── configuración ─────────────────────────
  var cfg = W.__MOCK__;
  var modeStr = (typeof cfg === "string" ? cfg : cfg && cfg.mode) || lsGet("__mockmode__") || "normal";
  var modes = String(modeStr).split(/[\s,]+/).filter(Boolean);
  modes.forEach(function (m) {
    if (["normal", "signedout", "readonly", "slow", "nodownloads"].indexOf(m) < 0)
      console.warn("[mock-claude] modo desconocido: " + m);
  });
  function has(m) { return modes.indexOf(m) >= 0; }
  var SLOW = has("slow"), READONLY = has("readonly");

  var syncUrl = W.__MOCK_SYNC_URL__ || (cfg && typeof cfg === "object" && cfg.sync) || lsGet("__mocksync__") || null;
  if (syncUrl === true || syncUrl === "1" || syncUrl === "true") syncUrl = "/__db";

  var nativeFetch = W.fetch ? W.fetch.bind(W) : null;

  // ───────────────────────── utilidades ─────────────────────────
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  /** Latencia de una llamada: `base` ms en normal, 400-900 ms en modo slow. */
  function lat(base) { return SLOW ? 400 + Math.random() * 500 : base; }
  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function isPlain(x) {
    if (x === null || typeof x !== "object" || Array.isArray(x)) return false;
    var p = Object.getPrototypeOf(x);
    return p === Object.prototype || p === null;
  }
  function deepFreeze(x) {
    if (x && typeof x === "object" && !Object.isFrozen(x)) {
      Object.freeze(x);
      for (var k in x) deepFreeze(x[k]);
    }
    return x;
  }
  function deepEq(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b || a === null || b === null || typeof a !== "object") return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    var ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    for (var i = 0; i < ka.length; i++) {
      if (!Object.prototype.hasOwnProperty.call(b, ka[i]) || !deepEq(a[ka[i]], b[ka[i]])) return false;
    }
    return true;
  }
  function depthOf(x) {
    if (x === null || typeof x !== "object") return 0;
    var d = 0;
    for (var k in x) d = Math.max(d, depthOf(x[k]));
    return d + 1;
  }
  function byteLen(s) { return new TextEncoder().encode(s).length; }
  function dbError(code, message) { return { code: code, message: "[mock] " + message }; }
  function rejectLater(code, message) {
    return sleep(lat(8)).then(function () { throw dbError(code, message); });
  }
  /** update(): los objetos anidados se fusionan; todo lo demás (arrays incluidos) reemplaza. */
  function merge(target, patch) {
    for (var k in patch) {
      if (isPlain(patch[k]) && isPlain(target[k])) merge(target[k], patch[k]);
      else target[k] = clone(patch[k]);
    }
    return target;
  }
  /** Devuelve un mensaje si `body` no es un cuerpo de documento válido; null si lo es. */
  function bodyProblem(body) {
    if (!isPlain(body)) return "document body must be a plain JSON object (not an array, scalar or null)";
    var json;
    try { json = JSON.stringify(body); } catch (e) { return "document body is not JSON-serializable: " + e.message; }
    if (byteLen(json) > MAX_DOC_BYTES) return "document exceeds 256 KiB serialized (" + byteLen(json) + " bytes)";
    if (depthOf(body) > MAX_DEPTH) return "document is more than 32 levels deep";
    return null;
  }

  // ───────────────────────── gramática de rutas ─────────────────────────
  var SEG_RE = /^[A-Za-z0-9_\-.~:@+]+$/;
  /** Valida y lanza TypeError síncrono, como la plataforma. kind: "doc" | "collection". */
  function checkPath(path, kind, where) {
    if (typeof path !== "string")
      throw new TypeError(where + ": path must be a string, got " + (path === null ? "null" : typeof path) +
        (path && typeof path.then === "function" ? " (a Promise — await it first)" : ""));
    if (path === "") throw new TypeError(where + ": path is empty");
    if (byteLen(path) > 1000) throw new TypeError(where + ": path is longer than 1000 bytes");
    var segs = path.split("/");
    if (segs.length > 16) throw new TypeError(where + ": path has " + segs.length + " segments (max 16)");
    segs.forEach(function (s) {
      if (s === "") throw new TypeError(where + ': empty segment in "' + path + '" (leading, trailing or double slash)');
      if (s === "." || s === "..") throw new TypeError(where + ': segment "' + s + '" is not allowed');
      if (!SEG_RE.test(s)) throw new TypeError(where + ': segment "' + s + '" has characters outside letters, digits and _ - . ~ : @ +');
      if (s.length > 200) throw new TypeError(where + ": a segment is longer than 200 bytes");
    });
    var even = segs.length % 2 === 0;
    if (kind === "doc" && !even)
      throw new TypeError(where + ': a document path needs an EVEN number of segments, "' + path + '" has ' + segs.length);
    if (kind === "collection" && even)
      throw new TypeError(where + ': a collection path needs an ODD number of segments, "' + path + '" has ' + segs.length);
    return path;
  }
  function lastSeg(path) { return path.slice(path.lastIndexOf("/") + 1); }
  var ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  function autoId() {
    var out = "", rnd = new Uint8Array(20);
    crypto.getRandomValues(rnd);
    for (var i = 0; i < 20; i++) out += ID_CHARS[rnd[i] % ID_CHARS.length];
    return out;
  }

  // ───────────────────────── estado y operaciones ─────────────────────────
  // state.docs: { "col/doc": cuerpo }. Los cuerpos NUNCA se mutan in situ (se sustituyen).
  var state = { epoch: "local", v: 0, docs: {}, leases: {} };
  function normalize(s) {
    s = s || {};
    return { epoch: s.epoch || "local", v: s.v | 0, docs: s.docs || {}, leases: s.leases || {} };
  }
  function fail(code, message) { return { ok: false, code: code, message: message }; }

  /** Aplica UNA operación a `s` (misma lógica que serve_db.py). No muta nada si falla. */
  function applyOp(s, op, now) {
    var cur = s.docs[op.path], next, bad;
    switch (op.t) {
      case "set":
        next = clone(op.data);
        break;
      case "update":
        if (cur === undefined) return fail("invalid_argument", "update(): document " + op.path + " does not exist");
        next = merge(clone(cur), op.data);
        break;
      case "delete":
        delete s.docs[op.path];
        s.v++;
        return { ok: true };
      case "acquire":
        var l = s.leases[op.path];
        if (l && l.exp > now && l.holder !== op.holder)
          return { ok: true, acquired: false, expiresAt: new Date(l.exp).toISOString() };
        if (op.data) {
          next = merge(cur === undefined ? {} : clone(cur), op.data);
          bad = bodyProblem(next);
          if (bad) return fail("invalid_argument", bad);
          s.docs[op.path] = next;
        }
        for (var p in s.leases) if (s.leases[p].exp <= now) delete s.leases[p];
        s.leases[op.path] = { holder: op.holder, exp: now + op.ttlMs };
        s.v++;
        return { ok: true, acquired: true, version: s.v, holder: op.holder,
                 expiresAt: new Date(now + op.ttlMs).toISOString() };
      case "reset":
        s.docs = {}; s.leases = {}; s.v++;
        return { ok: true };
      case "seed":
        for (var k in op.docs) s.docs[k] = clone(op.docs[k]);
        s.v++;
        return { ok: true };
      default:
        return fail("invalid_argument", "unknown op " + op.t);
    }
    bad = bodyProblem(next);
    if (bad) return fail("invalid_argument", bad);
    s.docs[op.path] = next;
    s.v++;
    return { ok: true };
  }

  // --- persistencia en localStorage (modo sin servidor) ---
  var lastRaw = null, memOnly = false;
  function loadLocal() {
    if (memOnly) return false;
    var raw = lsGet(LS_DB);
    if (raw === lastRaw) return false;
    lastRaw = raw;
    try { state = normalize(raw ? JSON.parse(raw) : null); } catch (e) { state = normalize(null); }
    return true;
  }
  function saveLocal() {
    if (memOnly) return;
    try {
      var raw = JSON.stringify({ v: state.v, docs: state.docs, leases: state.leases });
      W.localStorage.setItem(LS_DB, raw);
      lastRaw = raw;
    } catch (e) {
      memOnly = true; // p.ej. cuota de localStorage (~5 MB): seguimos solo en memoria
      console.warn("[mock-claude] no se pudo guardar en localStorage (" + e.name + "); el estado queda solo en memoria");
    }
  }

  // --- sincronización con serve_db.py ---
  var syncActive = false, pollInFlight = null;
  function syncEndpoint(since) {
    var u = new URL(syncUrl, W.location.href);
    if (since) { u.searchParams.set("since", state.v); u.searchParams.set("epoch", state.epoch); }
    return u.toString();
  }
  function adopt(res) {
    if (!res || res.unchanged) return;
    if (res.epoch === state.epoch && res.v < state.v) return; // respuesta vieja
    var changed = res.epoch !== state.epoch || res.v !== state.v;
    state = normalize(res);
    if (changed) scheduleNotify();
  }
  function fetchState(since) {
    return nativeFetch(syncEndpoint(since), { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }
  function poll() {
    if (!syncActive) return Promise.resolve();
    if (!pollInFlight) {
      pollInFlight = fetchState(true).then(adopt, function () {}).then(function () { pollInFlight = null; });
    }
    return pollInFlight;
  }
  /** Asegura que `state` está al día antes de una lectura. */
  function refresh() {
    if (syncActive) return poll();
    if (loadLocal()) scheduleNotify();
    return Promise.resolve();
  }

  var ready; // se resuelve cuando el estado inicial está cargado
  if (syncUrl && nativeFetch) {
    ready = fetchState(false).then(function (res) {
      state = normalize(res);
      syncActive = true;
      setInterval(poll, POLL_MS);
    }, function (e) {
      console.warn("[mock-claude] " + syncUrl + " no responde (" + e.message + "); uso solo localStorage");
      loadLocal();
    });
  } else {
    loadLocal();
    ready = Promise.resolve();
  }
  W.addEventListener("storage", function (e) {
    if (syncActive || (e.key !== LS_DB && e.key !== null)) return;
    if (loadLocal()) scheduleNotify();
  });

  // --- escrituras: optimistas en local, confirmadas en orden FIFO ---
  var pending = []; // [{op}] escrituras propias aún sin confirmar
  var chain = Promise.resolve();

  function commit(ops) {
    if (syncActive) {
      return nativeFetch(syncEndpoint(false), {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ops: ops })
      }).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      }).then(function (res) { adopt(res); return res.results; },
              function (e) { throw dbError("unavailable", "sync server: " + e.message); });
    }
    loadLocal();
    var now = Date.now();
    var results = ops.map(function (op) { return applyOp(state, op, now); });
    saveLocal();
    return Promise.resolve(results);
  }
  function enqueue(ops) {
    var p = Promise.all([sleep(lat(10)), chain]).then(function () { return commit(ops); });
    chain = p.then(function () {}, function () {});
    return p;
  }
  /** Documentos tal y como los ve esta página: confirmados + escrituras propias pendientes. */
  function view() {
    if (!pending.length) return state.docs;
    var s = { v: 0, docs: Object.assign({}, state.docs), leases: {} };
    pending.forEach(function (e) { applyOp(s, e.op, 0); });
    return s.docs;
  }
  function hasPending(prefixOrPath, isCollection) {
    return pending.some(function (e) {
      var p = e.op.path;
      if (!isCollection) return p === prefixOrPath;
      return p.lastIndexOf(prefixOrPath + "/", 0) === 0 && p.indexOf("/", prefixOrPath.length + 1) < 0;
    });
  }
  function write(op) {
    if (op.t !== "delete") {
      var bad = bodyProblem(op.data);
      if (bad) return rejectLater("invalid_argument", op.t + "(" + op.path + "): " + bad);
      op.data = clone(op.data);
    }
    if (READONLY) return rejectLater("invalid_argument", op.t + "(" + op.path + "): this viewer cannot write (view-only)");
    if (op.t === "update" && !syncActive) {
      loadLocal();
      if (view()[op.path] === undefined)
        return rejectLater("invalid_argument", "update(): document " + op.path + " does not exist");
    }
    var entry = { op: op };
    pending.push(entry);
    scheduleNotify(); // tus propias escrituras aparecen de inmediato (hasPendingWrites: true)
    function done() {
      pending.splice(pending.indexOf(entry), 1);
      scheduleNotify(); // confirmación (o marcha atrás si falló)
    }
    return enqueue([op]).then(function (results) {
      done();
      if (!results[0].ok) throw dbError(results[0].code, results[0].message);
    }, function (e) { done(); throw e; });
  }

  // ───────────────────────── snapshots ─────────────────────────
  var jsonOf = new WeakMap();   // cuerpo -> JSON (los cuerpos no se mutan)
  var snapJson = new WeakMap(); // snapshot -> JSON de su cuerpo
  var snapCache = Object.create(null); // ruta -> {json, pend, snap}: mismo objeto si no cambió
  function toJson(body) {
    var j = jsonOf.get(body);
    if (j === undefined) { j = JSON.stringify(body); jsonOf.set(body, j); }
    return j;
  }
  function docSnap(path, docs) {
    var body = docs[path];
    var json = body === undefined ? null : toJson(body);
    var pend = pending.length ? hasPending(path, false) : false;
    var c = snapCache[path];
    if (c && c.json === json && c.pend === pend) return c.snap;
    var data = json === null ? undefined : deepFreeze(JSON.parse(json));
    var snap = Object.freeze({
      id: lastSeg(path),
      exists: json !== null,
      data: function () { return data; },
      metadata: Object.freeze({ fromCache: false, hasPendingWrites: pend })
    });
    snapJson.set(snap, json);
    snapCache[path] = { json: json, pend: pend, snap: snap };
    return snap;
  }

  // ───────────────────────── consultas ─────────────────────────
  var OPS = ["==", "!=", "<", "<=", ">", ">=", "in", "not-in", "array-contains"];
  function typeRank(v) {
    if (v === null) return 0;
    if (typeof v === "boolean") return 1;
    if (typeof v === "number") return 2;
    if (typeof v === "string") return 3;
    return Array.isArray(v) ? 4 : 5;
  }
  function cmp(a, b) {
    var ra = typeRank(a), rb = typeRank(b);
    if (ra !== rb) return ra - rb;
    if (ra >= 4) { a = JSON.stringify(a); b = JSON.stringify(b); }
    return a < b ? -1 : a > b ? 1 : 0;
  }
  function matches(data, f) {
    var v = Object.prototype.hasOwnProperty.call(data, f.field) ? data[f.field] : undefined;
    var val = f.value;
    switch (f.op) {
      case "==": return v !== undefined && deepEq(v, val);
      case "!=": return v !== undefined && !deepEq(v, val); // sin el campo: no entra (como Firestore)
      case "in": return v !== undefined && val.some(function (x) { return deepEq(v, x); });
      case "not-in": return v !== undefined && !val.some(function (x) { return deepEq(v, x); });
      case "array-contains": return Array.isArray(v) && v.some(function (x) { return deepEq(x, val); });
    }
    // desigualdades: solo entre valores del mismo tipo (número con número, texto con texto)
    if (v === undefined || v === null || val === null || typeRank(v) !== typeRank(val) || typeRank(v) > 3) return false;
    var c = cmp(v, val);
    return f.op === "<" ? c < 0 : f.op === "<=" ? c <= 0 : f.op === ">" ? c > 0 : c >= 0;
  }
  /** Las consultas mal formadas no lanzan al construirse: fallan en get() / en el callback de error. */
  function queryProblem(q) {
    if (q.filters.length > 10) return "too many filters (max 10)";
    for (var i = 0; i < q.filters.length; i++) {
      var f = q.filters[i];
      if (typeof f.field !== "string" || !f.field) return "where(): field must be a non-empty string";
      if (OPS.indexOf(f.op) < 0) return 'where(): unknown operator "' + f.op + '"';
      if (f.value === undefined) return "where(): value is undefined";
      if ((f.op === "in" || f.op === "not-in") && (!Array.isArray(f.value) || f.value.length > 30))
        return 'where(): "' + f.op + '" needs an array of at most 30 values';
    }
    if (q.orders.length > 1) return "at most one orderBy()";
    if (q.orders.length) {
      if (typeof q.orders[0].field !== "string" || !q.orders[0].field) return "orderBy(): field must be a non-empty string";
      if (q.orders[0].dir !== "asc" && q.orders[0].dir !== "desc") return 'orderBy(): dir must be "asc" or "desc"';
    }
    if (q.lim && !(Number.isInteger(q.lim.n) && q.lim.n >= 1 && q.lim.n <= 1000)) return "limit(n): n must be an integer 1-1000";
    return null;
  }
  function runQuery(q, docs) {
    var prefix = q.coll + "/", out = [];
    for (var p in docs) {
      if (p.lastIndexOf(prefix, 0) !== 0 || p.indexOf("/", prefix.length) >= 0) continue; // solo hijos directos
      var snap = docSnap(p, docs), d = snap.data();
      if (q.filters.every(function (f) { return matches(d, f); })) out.push(snap);
    }
    var byId = function (a, b) { return a.id < b.id ? -1 : a.id > b.id ? 1 : 0; };
    var o = q.orders[0];
    if (!o) out.sort(byId);
    else out.sort(function (a, b) {
      var va = a.data()[o.field], vb = b.data()[o.field];
      if (va === undefined || vb === undefined) // sin el campo: al final, en asc y en desc
        return va === vb ? byId(a, b) : va === undefined ? 1 : -1;
      var c = cmp(va, vb);
      return (o.dir === "desc" ? -c : c) || byId(a, b);
    });
    return q.lim ? out.slice(0, q.lim.n) : out;
  }
  function diffDocs(prev, list) {
    var changes = [], oldIdx = {}, newIdx = {};
    prev.forEach(function (s, i) { oldIdx[s.id] = i; });
    list.forEach(function (s, i) { newIdx[s.id] = i; });
    prev.forEach(function (s, i) {
      if (!(s.id in newIdx)) changes.push({ type: "removed", doc: s, oldIndex: i, newIndex: -1 });
    });
    list.forEach(function (s, i) {
      if (!(s.id in oldIdx)) changes.push({ type: "added", doc: s, oldIndex: -1, newIndex: i });
      else if (snapJson.get(prev[oldIdx[s.id]]) !== snapJson.get(s))
        changes.push({ type: "modified", doc: s, oldIndex: oldIdx[s.id], newIndex: i });
    });
    return changes.map(Object.freeze);
  }
  function querySnap(list, prev, pend) {
    var docs = Object.freeze(list.slice()), changes = null;
    return Object.freeze({
      docs: docs,
      size: docs.length,
      empty: docs.length === 0,
      docChanges: function () { return (changes || (changes = diffDocs(prev, list))).slice(); },
      metadata: Object.freeze({ fromCache: false, hasPendingWrites: pend })
    });
  }

  // ───────────────────────── suscripciones ─────────────────────────
  var listeners = [], notifyTimer = null;
  function scheduleNotify() {
    if (notifyTimer !== null) return;
    notifyTimer = setTimeout(function () {
      notifyTimer = null;
      listeners.slice().forEach(function (L) { if (L.alive && L.ready) deliver(L); });
    }, 0);
  }
  function callSafe(fn, arg) {
    try { fn(arg); } catch (e) { setTimeout(function () { throw e; }, 0); } // llega a `pageerror`
  }
  function deliver(L) {
    var docs = view();
    if (L.kind === "doc") {
      var s = docSnap(L.target, docs);
      if (s === L.last) return;
      L.last = s;
      callSafe(L.next, s);
      return;
    }
    var list = runQuery(L.target, docs), pend = hasPending(L.target.coll, true), prev = L.last;
    if (prev && pend === L.lastPend && prev.length === list.length &&
        prev.every(function (x, i) { return x === list[i]; })) return;
    L.last = list; L.lastPend = pend;
    callSafe(L.next, querySnap(list, prev || [], pend));
  }
  function subscribe(kind, target, next, error) {
    if (typeof next !== "function") throw new TypeError("onSnapshot(next, error?): next must be a function");
    var L = { kind: kind, target: target, next: next, alive: true, ready: false, last: null, lastPend: false };
    function unsubscribe() {
      if (!L.alive) return;
      L.alive = false;
      var i = listeners.indexOf(L);
      if (i >= 0) listeners.splice(i, 1);
    }
    var problem = kind === "query" ? queryProblem(target) : null;
    var err = problem ? dbError("invalid_argument", problem)
      : listeners.length >= MAX_SUBS ? dbError("resource_exhausted", "more than 64 active subscriptions in this view (leak? subscribing from render?)")
      : null;
    if (err) { // error terminal: el listener nace muerto
      setTimeout(function () {
        if (!L.alive) return;
        L.alive = false;
        if (typeof error === "function") callSafe(error, err);
        else if (W.reportError) W.reportError(err);
        else console.error(err);
      }, lat(5));
      return unsubscribe;
    }
    listeners.push(L);
    setTimeout(function () { // primer disparo "poco después" de suscribirse
      refresh().then(function () {
        if (!L.alive) return;
        L.ready = true;
        deliver(L);
      });
    }, lat(15));
    return unsubscribe;
  }

  // ───────────────────────── referencias ─────────────────────────
  function read(fn) {
    return sleep(lat(8)).then(refresh).then(fn);
  }
  function docRef(path) {
    return Object.freeze({
      id: lastSeg(path),
      path: path,
      get: function () { return read(function () { return docSnap(path, view()); }); },
      set: function (data) { return write({ t: "set", path: path, data: data }); },
      update: function (data) { return write({ t: "update", path: path, data: data }); },
      delete: function () { return write({ t: "delete", path: path }); },
      acquire: function (options) {
        if (!isPlain(options) || typeof options.holder !== "string" || !options.holder)
          return rejectLater("invalid_argument", "acquire({holder}): holder must be a non-empty string");
        if (options.data !== undefined && bodyProblem(options.data))
          return rejectLater("invalid_argument", "acquire(): " + bodyProblem(options.data));
        if (READONLY) return rejectLater("invalid_argument", "acquire(" + path + "): this viewer cannot write (view-only)");
        var ttl = Number(options.ttlMs) || 30000;
        ttl = Math.min(600000, Math.max(1000, ttl));
        var op = { t: "acquire", path: path, holder: options.holder, ttlMs: ttl };
        if (options.data !== undefined) op.data = clone(options.data);
        return enqueue([op]).then(function (results) {
          var r = results[0];
          if (!r.ok) throw dbError(r.code, r.message);
          scheduleNotify();
          return r.acquired
            ? { acquired: true, version: r.version, expiresAt: r.expiresAt, holder: r.holder }
            : { acquired: false, expiresAt: r.expiresAt };
        });
      },
      onSnapshot: function (next, error) { return subscribe("doc", path, next, error); },
      collection: function (sub) {
        if (typeof sub !== "string") checkPath(sub, "collection", "doc.collection()");
        return collRef(checkPath(path + "/" + sub, "collection", 'doc("' + path + '").collection("' + sub + '")'));
      }
    });
  }
  function makeQuery(q, isCollection) {
    var api = {
      where: function (field, op, value) {
        var f = { field: field, op: op, value: value === undefined ? undefined : clone(value) };
        return makeQuery({ coll: q.coll, filters: q.filters.concat([f]), orders: q.orders, lim: q.lim }, false);
      },
      orderBy: function (field, dir) {
        var o = { field: field, dir: dir === undefined ? "asc" : dir };
        return makeQuery({ coll: q.coll, filters: q.filters, orders: q.orders.concat([o]), lim: q.lim }, false);
      },
      limit: function (n) {
        return makeQuery({ coll: q.coll, filters: q.filters, orders: q.orders, lim: { n: n } }, false);
      },
      get: function () {
        var problem = queryProblem(q);
        if (problem) return rejectLater("invalid_argument", problem);
        return read(function () { return querySnap(runQuery(q, view()), [], hasPending(q.coll, true)); });
      },
      onSnapshot: function (next, error) { return subscribe("query", q, next, error); }
    };
    if (isCollection) {
      api.path = q.coll;
      api.doc = function (id) {
        if (id === undefined) return docRef(q.coll + "/" + autoId());
        if (typeof id !== "string") checkPath(id, "doc", "collection.doc()");
        return docRef(checkPath(q.coll + "/" + id, "doc", 'collection("' + q.coll + '").doc("' + id + '")'));
      };
      api.add = function (data) {
        var ref = api.doc();
        return ref.set(data).then(function () { return ref; });
      };
    }
    return Object.freeze(api);
  }
  function collRef(path) { return makeQuery({ coll: path, filters: [], orders: [], lim: null }, true); }

  var DB = Object.freeze({
    doc: function (path) { return docRef(checkPath(path, "doc", "db.doc()")); },
    collection: function (path) { return collRef(checkPath(path, "collection", "db.collection()")); }
  });

  // ───────────────────────── downloads ─────────────────────────
  var EXT_OK = ("gif png jpg jpeg webp mp4 webm txt json md " +
                "docx pptx epub csv ttf html svg pdf xlsx zip").split(" ");
  var MIME = {
    gif: "image/gif", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp",
    svg: "image/svg+xml", mp4: "video/mp4", webm: "video/webm", txt: "text/plain", json: "application/json",
    md: "text/markdown", csv: "text/csv", html: "text/html", pdf: "application/pdf", zip: "application/zip",
    ttf: "font/ttf", epub: "application/epub+zip",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  };
  var TEXT_EXT = ["txt", "json", "md", "csv", "html", "svg"];
  W.__downloads = [];
  var saveOpen = false;
  function dlError(code, message) { return { code: code, message: "[mock] " + message }; }
  function toBase64(bytes) {
    var s = "";
    for (var i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  }
  function readBytes(data) { // -> Promise<Uint8Array>
    if (typeof data === "string") return Promise.resolve(new TextEncoder().encode(data));
    if (typeof Blob !== "undefined" && data instanceof Blob) return data.arrayBuffer().then(function (b) { return new Uint8Array(b); });
    if (data instanceof ArrayBuffer) {
      var copy = new Uint8Array(data.slice(0));
      try { structuredClone(data, { transfer: [data] }); } catch (e) {} // se TRANSFIERE: queda detached
      return Promise.resolve(copy);
    }
    if (ArrayBuffer.isView(data)) return Promise.resolve(new Uint8Array(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)));
    return Promise.reject(dlError("bad_request", "data must be a string, Blob, ArrayBuffer or ArrayBufferView"));
  }
  var DOWNLOADS = Object.freeze({
    save: function (req) {
      var problem = null, ext = "";
      if (!req || typeof req !== "object") problem = dlError("bad_request", "save({filename, data}) needs an object");
      else if (typeof req.filename !== "string" || req.filename.length > 512) problem = dlError("bad_request", "filename must be a string of at most 512 chars");
      else if (req.request !== undefined) problem = dlError("request_unknown", "no export request is open in the mock");
      else {
        var m = /\.([A-Za-z0-9]+)$/.exec(req.filename.trim());
        ext = m ? m[1].toLowerCase() : "";
        if (EXT_OK.indexOf(ext) < 0) problem = dlError("rejected_extension", 'extension "' + ext + '" is missing or outside the allowlist');
        else if (saveOpen) problem = dlError("rate_limited", "a save prompt is already open");
      }
      if (problem) return sleep(lat(8)).then(function () { throw problem; });
      saveOpen = true; // un solo diálogo de guardado a la vez (first-wins)
      return readBytes(req.data).then(function (bytes) {
        if (!bytes.length) throw dlError("bad_request", "data is empty (or a detached ArrayBuffer)");
        return sleep(lat(40)).then(function () {
          if (W.__mock.downloadOutcome === "declined") throw dlError("declined", "the viewer declined (simulated)");
          var filename = req.filename.replace(/\s+/g, " ").trim();
          var rec = { filename: filename, ext: ext, mime: MIME[ext], bytes: bytes.length, at: Date.now(),
                      dataURL: "data:" + MIME[ext] + ";base64," + toBase64(bytes) };
          if (TEXT_EXT.indexOf(ext) >= 0) rec.text = new TextDecoder().decode(bytes);
          W.__downloads.push(rec);
          return { status: "saved" };
        });
      }).then(function (r) { saveOpen = false; return r; }, function (e) { saveOpen = false; throw e; });
    }
  });

  // ───────────────────────── window.claude ─────────────────────────
  var memo = {};
  W.claude = Object.freeze({
    use: function (name) {
      // Una capacidad servida devuelve SIEMPRE la misma promesa; el resto resuelve null.
      if (name === "db" && !has("signedout"))
        return memo.db || (memo.db = ready.then(function () { return sleep(lat(30)); }).then(function () { return DB; }));
      if (name === "downloads" && !has("nodownloads"))
        return memo.downloads || (memo.downloads = sleep(lat(30)).then(function () { return DOWNLOADS; }));
      return sleep(lat(30)).then(function () { return null; });
    }
  });

  // ───────────────────────── helpers de test ─────────────────────────
  function admin(op) { // se salta los modos (readonly, etc.)
    return ready.then(function () { return enqueue([op]); }).then(function () { scheduleNotify(); });
  }
  W.__mock = {
    modes: modes.slice(),
    /** URL del servidor de sincronización, o null si el estado vive en localStorage. */
    get sync() { return syncActive ? syncUrl : null; },
    ready: ready,
    /** "saved" (por defecto) o "declined" para simular que el usuario cancela la descarga. */
    downloadOutcome: "saved",
    /** Copia de todos los documentos visibles ahora: { "col/doc": cuerpo }. Síncrono. */
    dump: function () { if (!syncActive) loadLocal(); return clone(view()); },
    /** Borra todos los documentos (y leases). Promesa. */
    reset: function () { return admin({ t: "reset" }); },
    /** Escribe documentos de golpe: seed({ "viajes2/ABC123": {...}, ... }). Promesa. */
    seed: function (docs) {
      for (var p in docs) {
        checkPath(p, "doc", "__mock.seed()");
        var bad = bodyProblem(docs[p]);
        if (bad) throw new TypeError("__mock.seed(): " + p + ": " + bad);
      }
      return admin({ t: "seed", docs: clone(docs) });
    },
    /** Trae el estado más reciente (servidor o localStorage). Promesa. */
    refresh: function () { return ready.then(refresh); },
    /** Se resuelve cuando no quedan escrituras pendientes ni notificaciones por entregar. */
    idle: function () {
      return ready.then(function () { return chain; }).then(function () { return sleep(5); }).then(function () {
        return pending.length || notifyTimer !== null ? W.__mock.idle() : undefined;
      });
    },
    /** Nº de suscripciones onSnapshot vivas (útil para detectar fugas). */
    subscriptions: function () { return listeners.length; }
  };
})();
