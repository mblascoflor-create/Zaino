#!/usr/bin/env python3
"""Valida un archivo de zona contra el esquema v2. Uso: validate_zone.py zonas/<id>.json [...]"""
import json, sys, re, os

TIPOS = {"cultura","gastronomia","naturaleza","playa","fiesta","aventura","bienestar","compras","postal","agua","musica"}
PERFIL = ["mar","montana","ciudad","campo","fiesta","calma","cultura","gastronomia","naturaleza","playa","aventura","postal"]
COSTE = {"gratis","bajo","medio","alto"}
URL = re.compile(r"^https://[^\s]+$")
PROHIBIDO = re.compile(r"\b(IA|algoritmo|inteligencia artificial)\b", re.I)

def check(path):
    errs, warns = [], []
    def E(m): errs.append(m)
    def W(m): warns.append(m)
    try:
        z = json.load(open(path, encoding="utf-8"))
    except Exception as e:
        return [f"JSON inválido: {e}"], []
    fid = os.path.basename(path)[:-5]
    if z.get("id") != fid: E(f"id '{z.get('id')}' no coincide con el nombre de archivo '{fid}'")
    for k in ["nombre","nombre_corto","lema","descripcion","perfil","nivel_precio","nivel_precio_nota","meses",
              "calor_verano","nieve_invierno","coche","bases","llegar","moverse","actividades","comida","noche",
              "alojamiento","eventos","notas_honestas"]:
        if k not in z: E(f"falta la clave '{k}'")
    if errs: return errs, warns
    if len(z["nombre_corto"]) > 14: E("nombre_corto > 14 caracteres")
    if len(z["lema"]) > 42: E("lema > 42 caracteres")
    for k in PERFIL:
        v = z["perfil"].get(k)
        if not isinstance(v, int) or not 0 <= v <= 3: E(f"perfil.{k} debe ser entero 0-3")
    if z["nivel_precio"] not in {"bajo","medio","alto"}: E("nivel_precio inválido")
    m = z["meses"]
    for k in ["ideales","aceptables","evitar"]:
        if not isinstance(m.get(k), list) or any((not isinstance(x,int)) or x<1 or x>12 for x in m.get(k,[])): E(f"meses.{k} debe ser lista de 1-12")
    if not m.get("ideales"): E("meses.ideales vacío")
    if z["calor_verano"] not in {"suave","alto","extremo"}: E("calor_verano inválido")
    if not isinstance(z["nieve_invierno"], bool): E("nieve_invierno debe ser booleano")
    c = z["coche"]
    if c.get("necesidad") not in {"imprescindible","util","innecesario"}: E("coche.necesidad inválido")
    if not c.get("nota"): E("coche.nota vacío")
    for o in c.get("operadores", []):
        if not URL.match(o.get("enlace","")): E(f"coche.operadores: enlace inválido en {o.get('nombre')}")
    bases = z["bases"]
    if len(bases) < 2: E("hacen falta ≥2 bases")
    bids = set()
    for b in bases:
        for k in ["id","nombre","por_que","sin_coche","ambiente","maps"]:
            if k not in b: E(f"base {b.get('id')}: falta '{k}'")
        if b.get("ambiente") not in {"fiesta","mixto","calma"}: E(f"base {b.get('id')}: ambiente inválido")
        if not URL.match(b.get("maps","")): E(f"base {b.get('id')}: maps inválido")
        bids.add(b.get("id"))
    if bases and not bases[0].get("sin_coche"): W("la primera base debería ser apta sin coche")
    ll = z["llegar"]
    aer = ll.get("aeropuertos", [])
    if not aer: E("llegar.aeropuertos vacío")
    for a in aer:
        if not re.match(r"^[A-Z]{3}$", a.get("iata","")): E(f"aeropuerto: IATA inválido '{a.get('iata')}'")
        for k in ["nombre","ciudad","a_la_base"]:
            if not a.get(k): E(f"aeropuerto {a.get('iata')}: falta '{k}'")
    for k in ["desde_espana","desde_italia"]:
        if not ll.get(k): E(f"llegar.{k} vacío")
    for r in ll.get("rutas_directas", []):
        if not (re.match(r"^[A-Z]{3}$", r.get("origen_iata","")) and re.match(r"^[A-Z]{3}$", r.get("destino_iata",""))): E("ruta directa con IATA inválido")
        if not URL.match(r.get("fuente","")): E(f"ruta directa {r.get('origen')} sin fuente")
    mv = z["moverse"]
    if not mv.get("resumen"): E("moverse.resumen vacío")
    for k in ["tren","bus","camper"]:
        if k not in mv: E(f"moverse.{k} falta (usa null si no aplica)")
        elif mv[k] is not None and not URL.match(mv[k].get("enlace","")): E(f"moverse.{k}.enlace inválido")
    if not isinstance(mv.get("ferry"), list): E("moverse.ferry debe ser lista ([] si no aplica)")
    else:
        for f in mv["ferry"]:
            if not URL.match(f.get("enlace","")): E("moverse.ferry: enlace inválido")
    acts = z["actividades"]
    if len(acts) < 14: E(f"solo {len(acts)} actividades (mínimo 14)")
    ids = set(); tipos = set()
    for a in acts:
        aid = a.get("id")
        if not aid or not re.match(r"^[a-z0-9-]+$", aid): E(f"actividad con id inválido: {aid}")
        if aid in ids: E(f"actividad duplicada: {aid}")
        ids.add(aid)
        for k in ["nombre","donde","base","tipo","duracion","momento","coste","requiere_coche","requiere_reserva","esfuerzo","ambiente","descripcion","enlace","enlace_tipo","maps","fuente"]:
            if k not in a or a[k] in ("", None): E(f"actividad {aid}: falta '{k}'")
        if a.get("base") not in bids: E(f"actividad {aid}: base '{a.get('base')}' no existe en bases")
        if a.get("tipo") not in TIPOS: E(f"actividad {aid}: tipo inválido '{a.get('tipo')}'")
        for t in a.get("tipos_extra", []):
            if t not in TIPOS: E(f"actividad {aid}: tipos_extra inválido '{t}'")
        if a.get("duracion") not in {"2h","medio_dia","dia_completo"}: E(f"actividad {aid}: duracion inválida")
        if a.get("momento") not in {"manana","tarde","noche","cualquiera"}: E(f"actividad {aid}: momento inválido")
        if a.get("coste") not in COSTE: E(f"actividad {aid}: coste inválido")
        if a.get("esfuerzo") not in {"bajo","medio","alto"}: E(f"actividad {aid}: esfuerzo inválido")
        if a.get("ambiente") not in {"social","tranquilo","mixto"}: E(f"actividad {aid}: ambiente inválido")
        if a.get("enlace_tipo") not in {"oficial","reserva","mapa"}: E(f"actividad {aid}: enlace_tipo inválido")
        for k in ["enlace","maps","fuente"]:
            if not URL.match(str(a.get(k,""))): E(f"actividad {aid}: {k} no es una URL https")
        if not str(a.get("maps","")).startswith("https://www.google.com/maps/search/?api=1&query="): E(f"actividad {aid}: maps no sigue el patrón seguro")
        if not isinstance(a.get("requiere_coche"), bool) or not isinstance(a.get("requiere_reserva"), bool): E(f"actividad {aid}: booleanos inválidos")
        if "meses" in a and (not isinstance(a["meses"], list) or any(not isinstance(x,int) or x<1 or x>12 for x in a["meses"])): E(f"actividad {aid}: meses inválido")
        if len(a.get("descripcion","")) > 220: W(f"actividad {aid}: descripcion larga ({len(a['descripcion'])})")
        tipos.add(a.get("tipo"))
    if sum(1 for a in acts if a.get("requiere_coche") is False) < 6: E("hacen falta ≥6 actividades sin coche")
    if sum(1 for a in acts if a.get("coste") in {"gratis","bajo"}) < 4: E("hacen falta ≥4 actividades gratis/bajo")
    if sum(1 for a in acts if a.get("momento") == "noche") < 2: E("hacen falta ≥2 actividades de noche")
    if sum(1 for a in acts if a.get("duracion") == "dia_completo") < 1: E("hace falta ≥1 actividad de día completo")
    if len(tipos) < 5: E(f"solo {len(tipos)} tipos distintos de actividad (mínimo 5)")
    com = z["comida"]
    if len(com) < 6: E(f"solo {len(com)} comida (mínimo 6)")
    for x in com:
        for k in ["plato","que_es","estilo","coste","donde_probarlo","maps","fuente"]:
            if not x.get(k): E(f"comida {x.get('plato')}: falta '{k}'")
        if x.get("estilo") not in {"street","trattoria","mercado","dulce","bebida"}: E(f"comida {x.get('plato')}: estilo inválido")
        if x.get("coste") not in {"bajo","medio","alto"}: E(f"comida {x.get('plato')}: coste inválido")
        for k in ["maps","fuente"]:
            if not URL.match(str(x.get(k,""))): E(f"comida {x.get('plato')}: {k} no es URL https")
    no = z["noche"]
    if len(no) < 2: E("hacen falta ≥2 zonas de noche")
    for x in no:
        for k in ["zona","base","plan","descripcion","maps","fuente"]:
            if not x.get(k): E(f"noche {x.get('zona')}: falta '{k}'")
        if x.get("base") not in bids: E(f"noche {x.get('zona')}: base inexistente")
        if x.get("plan") not in {"aperitivo","copas","fiesta"}: E(f"noche {x.get('zona')}: plan inválido")
    al = z["alojamiento"]
    if len(al) < 4: E("hacen falta ≥4 alojamientos")
    for x in al:
        if x.get("tipo") not in {"hostel","apartamento","hotel","agriturismo","rifugio","camping","bnb"}: E(f"alojamiento: tipo inválido '{x.get('tipo')}'")
        if x.get("base") not in bids: E(f"alojamiento {x.get('tipo')}: base inexistente '{x.get('base')}'")
        if x.get("coste") not in {"bajo","medio","alto"}: E("alojamiento: coste inválido")
        if not x.get("para"): E("alojamiento: falta 'para'")
        if not x.get("enlaces"): E("alojamiento: sin enlaces")
        for l in x.get("enlaces", []):
            if not URL.match(l.get("url","")) or not l.get("sitio"): E("alojamiento: enlace inválido")
    ev = z["eventos"]
    if len(ev) < 3: E("hacen falta ≥3 eventos recurrentes")
    for x in ev:
        for k in ["nombre","donde","cuando","meses","descripcion","enlace","fuente"]:
            if not x.get(k): E(f"evento {x.get('nombre')}: falta '{k}'")
        if "proxima_fecha" not in x: E(f"evento {x.get('nombre')}: falta proxima_fecha (null si no hay)")
        elif x["proxima_fecha"] is not None:
            if not re.match(r"^20(26-1[12]|2[78]-\d\d)-\d\d$", x["proxima_fecha"]): E(f"evento {x.get('nombre')}: proxima_fecha debe ser futura AAAA-MM-DD o null")
        for k in ["enlace","fuente"]:
            if not URL.match(str(x.get(k,""))): E(f"evento {x.get('nombre')}: {k} no es URL https")
    raw = json.dumps(z, ensure_ascii=False)
    # 'IA' en mayúsculas como palabra suelta, 'algoritmo', etc.
    if re.search(r"(?<![A-Za-zÁÉÍÓÚáéíóúñ])IA(?![A-Za-zÁÉÍÓÚáéíóúñ])", raw) or re.search(r"algoritmo|inteligencia artificial", raw, re.I):
        E("contiene palabras prohibidas (IA / algoritmo)")
    if "utm_" in raw or "aid=" in raw or "affiliate" in raw.lower(): W("posible parámetro de afiliado/seguimiento en un enlace")
    if "http://" in raw: E("hay enlaces http:// (usa https)")
    return errs, warns

if __name__ == "__main__":
    bad = 0
    for p in sys.argv[1:]:
        errs, warns = check(p)
        name = os.path.basename(p)
        if errs:
            bad += 1
            print(f"✗ {name}: {len(errs)} errores")
            for e in errs: print("   -", e)
        else:
            z = json.load(open(p, encoding="utf-8"))
            print(f"✓ {name}: OK — {len(z['actividades'])} actividades, {len(z['comida'])} comida, {len(z['noche'])} noche, {len(z['alojamiento'])} alojamiento, {len(z['eventos'])} eventos")
        for w in warns: print("   (aviso)", w)
    sys.exit(1 if bad else 0)
