"""Escenarios de grupo en el navegador (modo prueba con base de datos compartida entre "móviles").
Uso: python3 tests/e2e/escenarios.py      → informe en tests/shots/escenarios.json"""
import sys, os, json, time, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import harness as Hn
import run_groups as RG
from playwright.sync_api import sync_playwright

URL = 'http://127.0.0.1:%d/index.html' % Hn.PORT
RES = []
def ok(c, m, x=''):
    RES.append({'ok': bool(c), 'prueba': m, 'detalle': str(x)[:300]}); print(('✓ ' if c else '✗ ') + m + (('  · ' + str(x)[:160]) if x else ''))

G = {'jefe': 'Ana', 'crear': {'ocasion': 'porque', 'titulo': 'Prueba escenarios', 'integrantes': ['Pol', 'Leo'], 'destModo': 'no', 'fModo': 'mes', 'mes': 6, 'dias': 4, 'pres': 400, 'obs': []}}
P = {'Ana': {'origen': ('es', 'Madrid'), 'prioridades': ['playa', 'gastronomia', 'postal'], 'innegociable': 'nada', 'clima': 'calor', 'noche': 'aperitivo', 'presIdeal': 450, 'presMax': 600},
     'Pol': {'origen': ('es', 'Barcelona'), 'prioridades': ['fiesta', 'playa'], 'innegociable': 'nada', 'clima': 'calor', 'noche': 'fiesta', 'presIdeal': 300, 'presMax': 380},
     'Leo': {'origen': ('es', 'Madrid'), 'prioridades': ['cultura', 'gastronomia'], 'innegociable': 'nada', 'clima': 'templado', 'noche': 'calma', 'presIdeal': 400, 'presMax': 500}}

def entrar(b, token, nombre, nuevo=False):
    ctx, pg = Hn.device(b, nombre); pg.goto(URL + '#i-' + token); pg.wait_for_selector('.flow', timeout=9000); pg.wait_for_timeout(300)
    if nuevo: pg.fill('#i-nuevo', nombre)
    else: pg.click('.flow [data-m] >> text=%s' % nombre)
    RG.ok(pg); pg.wait_for_timeout(500)
    return ctx, pg

def abrir(pg, code):
    pg.goto(URL); pg.wait_for_timeout(900)
    if pg.locator('[data-open="%s"]' % code).count(): pg.click('[data-open="%s"]' % code)
    pg.wait_for_timeout(1200)

def regresiones(b):
    """Regresiones del informe del Tester: A1 (avatar), A3 (id de integrante), A4 (reintento), A6 (borrar mis datos)."""
    VIAJE = "{titulo:'Reg', jefe:'m1', integrantes:[{id:'m1',nombre:'Ana'},{id:'m2',nombre:'Pol'}], fechas:{modo:'mes',mes:7}, dias:4, destinos:[]}"
    def nuevo(ns, trip=VIAJE, rol='jefe'):
        Hn.reset_db()  # los «móviles» comparten la base «default»
        ctx, pg = Hn.device(b, 'Reg-' + ns); pg.goto(URL); pg.wait_for_timeout(1500)
        code = pg.evaluate("""async () => { const d = await ZSTORE.crearViaje(%s);
          localStorage.setItem('zaino.viajes', JSON.stringify([{code:d.code, miembro:'m1', nombre:'Ana', rol:'%s', titulo:'Reg'}]));
          localStorage.setItem('zaino.ult', JSON.stringify(d.code)); return d.code; }""" % (trip, rol))
        return ctx, pg, code
    def abrir_viaje(pg):
        pg.reload(); pg.wait_for_timeout(1500)
        pg.evaluate("document.querySelector('[data-open]') && document.querySelector('[data-open]').click()"); pg.wait_for_timeout(1200)
    resp = "{nombre:'Pol', done:true, %s origen:{ciudad:'Madrid',iata:'MAD',pais:'es'}, prioridades:['playa'], updatedAt:Date.now()}"
    # A1: avatar malicioso de otro miembro
    ctx, pg, code = nuevo('reg1')
    evil = 'a)"><img src=x onerror="window.__xss=(window.__xss||0)+1"><span x="'
    pg.evaluate("ZSTORE.db.doc('viajes2/%s/resp/m2').set(%s)" % (code, resp % ("avatar:%s," % json.dumps(evil))))
    abrir_viaje(pg)
    ok(pg.evaluate("window.__xss||0") == 0 and pg.locator('img[src="x"]').count() == 0, 'A1. Un avatar malicioso de otro miembro no ejecuta nada ni mete elementos')
    ok('Pol' in pg.text_content('#app') and pg.locator('.av.s').count() >= 2, 'A1. y el grupo se pinta igual (con la inicial en vez del avatar)')
    good = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBD'
    pg.evaluate("ZSTORE.db.doc('viajes2/%s/resp/m2').set(%s)" % (code, resp % ("avatar:%s," % json.dumps(good)))); pg.wait_for_timeout(1500)
    ok(pg.locator('.av.s[style*="data:image/jpeg;base64"]').count() >= 1, 'A1. Un avatar JPEG válido sí se pinta')
    ctx.close()
    # A3: id de integrante malicioso
    ctx, pg, code = nuevo('reg3', "{titulo:'Reg', jefe:'m1', integrantes:[{id:'m1',nombre:'Ana'},{id:'m2\"><img src=x onerror=\"window.__xss=(window.__xss||0)+1\">', nombre:'Pol'}], fechas:{modo:'mes',mes:7}, dias:4, destinos:[]}")
    abrir_viaje(pg)
    pg.evaluate("document.querySelector('[data-tab=gastos]').click()"); pg.wait_for_timeout(800)
    pg.evaluate("document.getElementById('b-gasto') && document.getElementById('b-gasto').click()"); pg.wait_for_timeout(800)
    ok(pg.evaluate("window.__xss||0") == 0 and pg.locator('#sheet img[src="x"], #app img[src="x"]').count() == 0, 'A3. Un id de integrante malicioso no ejecuta nada en «Añadir gasto»')
    ok(pg.locator('#g-p option').count() == 2, 'A3. y el selector «Pagó» sigue con sus dos personas', pg.locator('#g-p option').count())
    ctx.close()
    # A4: el cálculo falla y vuelve la red → se reintenta solo; si no vuelve, sale «Reintentar»
    ctx, pg, code = nuevo('reg4')
    pg.reload(); pg.wait_for_timeout(1500)
    pg.evaluate("() => {window.ZAINO_REINTENTO_MS=60; window.__calls=[]; window.__fallar=true; const orig=ZSTORE.motor; ZSTORE.motor=function(c,a,z){ window.__calls.push(a+':'+(window.__fallar?'FALLA':'ok')); return window.__fallar ? Promise.reject({message:'red caida'}) : orig.apply(ZSTORE,arguments); }; }")
    pg.evaluate("ZSTORE.db.doc('viajes2/%s/resp/m1').set({nombre:'Ana', done:true, origen:{ciudad:'Madrid',iata:'MAD',pais:'es'}, prioridades:['playa'], updatedAt:Date.now()})" % code)
    pg.evaluate("document.querySelector('[data-open]') && document.querySelector('[data-open]').click()"); pg.wait_for_timeout(900)
    pg.evaluate("window.__fallar=false"); pg.wait_for_timeout(2500)
    calls = pg.evaluate("window.__calls")
    ok(any(c == 'calcular:ok' for c in calls), 'A4. Tras fallar una vez y volver la red, la app reintenta sola el cálculo', calls)
    ok(pg.evaluate("ZSTORE.db.doc('viajes2/%s/res/actual').get().then(s=>s.exists)" % code), 'A4. y se guardan los resultados')
    ok('Calculando propuestas' not in pg.text_content('#app'), 'A4. y la pantalla ya no se queda en «Calculando propuestas…»')
    ctx.close()
    ctx, pg, code = nuevo('reg4b')
    pg.reload(); pg.wait_for_timeout(1500)
    pg.evaluate("() => {window.ZAINO_REINTENTO_MS=40; window.__calls=[]; ZSTORE.motor=function(c,a,z){ window.__calls.push(a); return Promise.reject({message:'caido'}); }; }")
    pg.evaluate("ZSTORE.db.doc('viajes2/%s/resp/m1').set({nombre:'Ana', done:true, origen:{ciudad:'Madrid',iata:'MAD',pais:'es'}, prioridades:['playa'], updatedAt:Date.now()})" % code)
    pg.evaluate("document.querySelector('[data-open]') && document.querySelector('[data-open]').click()"); pg.wait_for_timeout(3000)
    ok(pg.locator('#b-reint').count() >= 1 and len(pg.evaluate("window.__calls")) == 5, 'A4. Con la red caída del todo: 1 intento + 4 reintentos y aparece el botón «Reintentar»', pg.evaluate("window.__calls"))
    n = len(pg.evaluate("window.__calls"));     pg.evaluate("() => { ZSTORE.motor=function(c,a,z){ window.__calls.push(a+':ok'); return Promise.resolve(null); }; }")
    pg.locator('#b-reint').first.click(); pg.wait_for_timeout(600)
    ok(len(pg.evaluate("window.__calls")) > n, 'A4. Pulsar «Reintentar» vuelve a pedir el cálculo', pg.evaluate("window.__calls"))
    ctx.close()
    # A6: borrar mis datos avisa de que los viajes que organizas se borran para todos
    ctx, pg, code = nuevo('reg6')
    abrir_viaje(pg); pg.evaluate("document.querySelector('[data-tab=perfil]').click()"); pg.wait_for_timeout(500)
    pg.evaluate("document.querySelector('details.card summary') && [...document.querySelectorAll('details.card')].forEach(d=>d.open=true)")
    pg.click('#b-borrarme'); pg.wait_for_timeout(300)
    aviso = pg.text_content('#z-bm')
    ok('ENTERO' in aviso and 'todo el grupo' in aviso and pg.locator('#b-bm-si').is_disabled(), 'A6. Si organizas un viaje, avisa de que se borra entero para todos y el botón empieza bloqueado')
    pg.check('#bm-ent'); ok(not pg.locator('#b-bm-si').is_disabled(), 'A6. Hay que marcar la confirmación para poder borrar')
    ctx.close()
    ctx, pg, code = nuevo('reg6b', rol='grupo')
    abrir_viaje(pg); pg.evaluate("document.querySelector('[data-tab=perfil]').click()"); pg.wait_for_timeout(500)
    pg.evaluate("[...document.querySelectorAll('details.card')].forEach(d=>d.open=true)")
    pg.click('#b-borrarme'); pg.wait_for_timeout(300)
    ok('ENTERO' not in pg.text_content('#z-bm') and not pg.locator('#b-bm-si').is_disabled(), 'A6. Quien no organiza nada no ve el aviso extra')
    ctx.close()

    # T1: con una hoja abierta llegan cambios del grupo → aviso discreto, no se pierde lo escrito y se pinta al cerrar
    ctx, pg, code = nuevo('reg7')
    abrir_viaje(pg)
    pg.evaluate("document.querySelector('[data-tab=gastos]').click()"); pg.wait_for_timeout(800)
    pg.click('#b-gasto'); pg.wait_for_timeout(400); pg.fill('#g-c', 'Mi cena a medias')
    pg.evaluate("ZSTORE.db.collection('viajes2/%s/gastos').add({concepto:'Taxi', importe:12, pagadoPor:'m2', entre:[], ts:Date.now()})" % code); pg.wait_for_timeout(1800)
    ok('Hay cambios nuevos' in (pg.text_content('#sheet-nuevo') or '') and pg.get_attribute('#sheet-nuevo', 'role') == 'status', 'T1. Con «Añadir gasto» abierto, un gasto de otro muestra «Hay cambios nuevos» (role=status)')
    ok(pg.input_value('#g-c') == 'Mi cena a medias', 'T1. y no se pierde lo que estabas escribiendo')
    pg.evaluate("document.getElementById('sheet').dispatchEvent(new MouseEvent('click',{bubbles:true}))"); pg.wait_for_timeout(500)
    ok(pg.locator('#sheet').count() == 0 and 'Taxi' in pg.text_content('#app'), 'T1. Al cerrar la hoja se ve el gasto «Taxi» del grupo')
    pg.click('#b-gasto'); pg.wait_for_timeout(300)
    ok((pg.text_content('#sheet-nuevo') or '') == '', 'T1. Una hoja nueva empieza sin el aviso')
    ctx.close()
    # T2: sin conexión sale un banner accesible; al volver la red desaparece
    ctx, pg, code = nuevo('reg8')
    abrir_viaje(pg)
    ok(pg.locator('#red-aviso:visible').count() == 0, 'T2. Con red no hay banner de conexión')
    ctx.set_offline(True); pg.wait_for_timeout(300)
    ban = pg.locator('#red-aviso')
    ok(ban.is_visible() and 'Sin conexión' in ban.text_content() and ban.get_attribute('role') == 'status', 'T2. Sin red sale «Sin conexión — guardaremos cuando vuelva» con role=status', ban.text_content())
    bb, bx = ban.bounding_box(), pg.locator('#red-aviso .red-x').bounding_box()
    ok(bb['height'] >= 44 and bx['width'] >= 44 and bx['height'] >= 44, 'T2. El banner y su botón de ocultar miden al menos 44 px', (bb['height'], bx['width'], bx['height']))
    pg.click('#red-aviso .red-x'); pg.wait_for_timeout(200)
    ok(not ban.is_visible(), 'T2. Se puede ocultar el banner')
    ctx.set_offline(False); pg.wait_for_timeout(300); ctx.set_offline(True); pg.wait_for_timeout(300)
    ok(ban.is_visible(), 'T2. Si se vuelve a perder la red, el banner vuelve a salir')
    ctx.set_offline(False); pg.wait_for_timeout(400)
    ok(not ban.is_visible() and 'Conexión recuperada' in pg.text_content('body'), 'T2. Al volver la red el banner se va y avisa «Conexión recuperada»')
    ok(not [e for e in pg.errors if 'pageerror' in e], 'T2. Sin errores de JavaScript', pg.errors[:3])
    ctx.close()

def main():
    Hn.build_site(); Hn.serve(); Hn.reset_db()
    if '--regresiones' in sys.argv:  # solo las regresiones del informe del Tester (rápido)
        with sync_playwright() as p:
            b = p.chromium.launch(); regresiones(b); b.close()
        f = [r for r in RES if not r['ok']]; print('\n%d de %d pasan' % (len(RES) - len(f), len(RES))); return
    with sync_playwright() as p:
        b = p.chromium.launch()
        cA, A = Hn.device(b, 'Ana')
        token = RG.crear(A, G, 'esc'); code = A.evaluate("JSON.parse(localStorage.getItem('zaino.ult'))")
        ok(re.fullmatch(r'[a-f0-9]{36}', token), 'Crear viaje devuelve un enlace de invitación con token largo', token[:8] + '…')
        RG.answer(A, P['Ana'], [])
        # 1. invitación falsa
        cX, X = Hn.device(b, 'Intruso'); X.goto(URL + '#i-' + 'f' * 36); X.wait_for_timeout(1200)
        ok('Esta invitación no funciona' in X.text_content('body'), 'Un enlace inventado no deja entrar ni enseña nada')
        X.goto(URL + '#v-' + code); X.wait_for_timeout(900)
        ok('Hace falta la invitación' in X.text_content('body'), 'Con solo el código del viaje no se entra')
        # 2. otro dispositivo entra con el enlace
        cP, Pp = entrar(b, token, 'Pol')
        ok(Pp.locator('.flow').count() and Pp.get_attribute('.flow .body', 'data-step') == 'origen', 'Pol entra desde otro móvil sin registrarse y empieza sus preguntas')
        # salir a medias y volver: guarda el progreso
        RG.answer_hasta = None
        Pp.click('[data-p="es"]'); Pp.click('[data-c="Barcelona"]'); Pp.wait_for_timeout(500)
        abrir(Pp, code)
        ok('Seguir con mis preguntas' in Pp.text_content('body'), 'Si sale a medias, al volver sigue por donde iba')
        Pp.click('#b-resp'); Pp.wait_for_selector('.flow'); RG.answer(Pp, P['Pol'], [])
        # 3. provisional con 2 de 3
        abrir(A, code); A.wait_for_timeout(1500)
        txt = A.text_content('body')
        ok('Provisional' in txt and A.locator('.prop').count() >= 1, 'Con 2 de 3 respuestas salen propuestas marcadas como provisionales', str(A.locator('.prop h3').all_inner_texts()))
        Hn.shot(A, 'esc-01-provisional', full=True)
        # 4. privacidad: la respuesta pública no lleva el presupuesto
        dump = A.evaluate("window.__mock.dump()")
        docs = dump.get('docs', dump)
        pub = [v for k, v in docs.items() if k.startswith('viajes2/%s/resp/' % code)]
        priv = [v for k, v in docs.items() if k.startswith('viajes2/%s/priv/' % code)]
        ok(pub and all('presMax' not in json.dumps(d) and 'presIdeal' not in json.dumps(d) for d in pub) and any('presMax' in json.dumps(d) for d in priv),
           'El presupuesto se guarda aparte (privado) y no va en las respuestas que ve el grupo')
        res = [v for k, v in docs.items() if k == 'viajes2/%s/res/actual' % code]
        ok(res and '380' not in json.dumps(res[0]) and '600' not in json.dumps(res[0]), 'Los resultados que ve el grupo no contienen cifras de presupuesto de nadie')
        # 5. alguien que no estaba en la lista entra con su nombre
        cM, M = entrar(b, token, 'Mar', nuevo=True)
        ok(M.locator('.flow').count() > 0, 'Alguien que no estaba en la lista entra escribiendo su nombre')
        M.click('.flow #fl-close') if M.locator('.flow #fl-close').count() else None
        A.wait_for_timeout(1500); abrir(A, code)
        ok('Mar' in A.text_content('body'), 'La organizadora ve a la persona nueva en el grupo', '')
        # 6. quitar a alguien (organizadora)
        A.click('#b-grupo'); A.wait_for_timeout(300); A.click('[data-quitar][data-n="Mar"]'); A.click('#b-q-si'); A.wait_for_timeout(1500)
        abrir(A, code)
        ints = [i['nombre'] for k, v in (lambda d: d.get('docs', d))(A.evaluate("window.__mock.dump()")).items() if k == 'viajes2/%s' % code for i in (v.get('data', v) if isinstance(v, dict) else {}).get('integrantes', [])]
        ok(len(ints)==3 and 'Mar' not in ints, 'La organizadora quita a alguien y desaparece del grupo', ints)
        # 7. Leo responde → ya no es provisional; Leo se va y vuelve a serlo… (probamos solo el primer paso)
        cL, L = entrar(b, token, 'Leo'); RG.answer(L, P['Leo'], [])
        abrir(A, code); A.wait_for_timeout(2000)
        ok('Con todo el grupo' in A.text_content('body'), 'Cuando responde todo el grupo, las propuestas dejan de ser provisionales')
        props = A.locator('.prop h3').all_inner_texts(); ok(len(props) >= 2 and len(set(props)) == len(props), 'Salen varias propuestas distintas', props)
        ok(A.locator('.pp .chip').count() >= 3, 'Cada propuesta enseña el % de cada persona')
        # 8. votar desde otro móvil y elegir
        abrir(Pp, code); Pp.click('[data-votar] >> nth=0'); Pp.wait_for_timeout(1200)
        abrir(A, code); ok('Votos: Pol' in A.text_content('body'), 'El voto de Pol le llega a la organizadora al momento')
        ok(Pp.locator('[data-elegir]').count() == 0, 'Solo quien organiza puede elegir el destino')
        A.click('[data-elegir] >> nth=0'); A.click('#b-el-si'); A.wait_for_selector('.poster', timeout=12000); A.wait_for_timeout(800)
        ok(A.locator('.poster').count() == 1, 'Al elegir, sale el plan para todos', A.inner_text('.poster .d'))
        try: Pp.wait_for_selector('.poster', timeout=8000); vio = True
        except Exception: vio = False
        ok(vio, 'Pol ve el plan en su móvil sin recargar la página')
        # 9. edición del itinerario + concurrencia
        A.click('[data-sub="dias"]'); Pp.click('[data-sub="dias"]'); A.wait_for_timeout(500); Pp.wait_for_timeout(500)
        antes = A.locator('.slot').count()
        A.click('[data-anadir="0"]'); A.wait_for_timeout(400)
        hay = A.locator('[data-add-i]').count()
        if hay: A.click('[data-add-i] >> nth=0'); A.wait_for_timeout(1200)
        ok(hay and A.locator('.slot').count() == antes + 1, 'Se puede añadir un plan a un día')
        Pp.wait_for_timeout(1200); ok(Pp.locator('.slot').count() == antes + 1, 'El plan añadido le aparece a Pol')
        def editar_parada(selector):
            parada = A.locator('.agenda-slot').filter(has=A.locator(selector)).first
            if not parada.evaluate('el => el.open'):
                parada.locator(':scope > summary').click()
            edicion = parada.locator('.slot-edit')
            if not edicion.evaluate('el => el.open'):
                edicion.locator('summary').click()
            edicion.locator(selector).click()
            A.wait_for_timeout(1200)

        editar_parada('[data-quitar-s]')
        ok(A.locator('.slot').count() == antes, 'Se puede quitar un plan')
        if A.locator('[data-mover$=".1"]').count():
            nombres = A.locator('.agenda-slot > summary strong')
            n0 = nombres.all_inner_texts()
            editar_parada('[data-mover$=".1"]')
            ok(nombres.all_inner_texts() != n0, 'Se puede cambiar el orden de los planes')
        for dia in A.locator('[data-ir-dia]').all():
            if A.locator('.tramo a').count():
                break
            dia.click()
        ok(A.locator('.tramo a').count() > 0, 'Los días con trayecto calculado muestran la distancia aproximada y la ruta')
        Hn.shot(A, 'esc-02-dias', full=True)
        # concurrencia: lista y gastos a la vez desde dos móviles
        for pg in (A, Pp): pg.click('[data-sub="lista"]'); pg.wait_for_timeout(400)
        A.fill('#i-li', 'Comprar adaptador'); Pp.fill('#i-li', 'Reservar cena'); A.click('#f-li button[type=submit]'); Pp.click('#f-li button[type=submit]')
        A.wait_for_timeout(2000); t = A.text_content('#app')
        ok('Comprar adaptador' in t and 'Reservar cena' in t, 'Dos personas añaden a la lista a la vez y no se pisan')
        # 10. cambiar respuestas → aviso de plan desactualizado
        abrir(L, code); L.wait_for_timeout(600)
        # Leo edita sus respuestas desde el resumen: le llevamos al flujo de preguntas
        L.evaluate("localStorage.removeItem('zaino.borrador.%s')" % code)
        abrir(A, code)
        # 11. el asistente falla: la app sigue
        A.evaluate("ZSTORE.iaActiva=true; ZSTORE.ia=function(){ return Promise.resolve({error:'ia_no_disponible'}); }")
        A.click('[data-sub="resumen"]'); A.wait_for_timeout(500)
        if A.locator('#b-ia').count():
            A.click('#b-ia'); A.fill('#i-ia', '¿Qué hacemos si llueve?'); A.click('#f-ia button[type=submit]'); A.wait_for_timeout(800)
            ok('Ahora no puedo contestar' in A.text_content('#sheet'), 'Si el asistente falla, lo dice claro y no rompe nada')
            A.evaluate("ZSTORE.ia=function(){ return Promise.resolve({disponible:true, texto:'Os propongo el museo del día 2.', propuestas:[]}); }")
            A.fill('#i-ia', 'Otra'); A.click('#f-ia button[type=submit]'); A.wait_for_timeout(800)
            ok('Os propongo el museo' in A.text_content('#sheet'), 'Cuando el asistente responde, se ve la respuesta en la conversación')
            A.keyboard.press('Escape'); A.mouse.click(5, 5); A.wait_for_timeout(300)
        else: ok(False, 'Botón «Pregúntale a Zaino» visible cuando el servidor tiene asistente')
        A.evaluate("ZSTORE.iaActiva=false"); abrir(A, code)
        ok(A.locator('#b-ia').count() == 0, 'Sin asistente configurado no aparece el botón (no se simula)')
        # 12. regenerar enlace invalida el viejo; salir del viaje
        A.click('[data-sub="grupo"]'); A.wait_for_timeout(400)
        if A.locator('#b-gg').count(): A.click('#b-gg')
        else: A.click('#b-grupo')
        A.wait_for_timeout(300); A.click('#b-regen-link'); A.wait_for_timeout(1200)
        cZ, Zp = Hn.device(b, 'Zoe'); Zp.goto(URL + '#i-' + token); Zp.wait_for_timeout(1200)
        ok('Esta invitación no funciona' in Zp.text_content('body'), 'Tras cambiar el enlace, el viejo deja de funcionar')
        abrir(Pp, code); Pp.click('[data-sub="grupo"]'); Pp.wait_for_timeout(300)
        Pp.click('#b-gg')
        Pp.wait_for_timeout(300); Pp.click('#b-salir'); Pp.click('#b-s-si'); Pp.wait_for_timeout(1200)
        ok(Pp.locator('[data-open="%s"]' % code).count() == 0, 'Quien sale del viaje deja de tenerlo en su lista')
        errs = []
        for pg in (A, Pp, L, M, X, Zp): errs += ['%s: %s' % (pg.name, e) for e in pg.errors if 'favicon' not in e]
        ok(not errs, 'Sin errores de JavaScript en ningún móvil', errs[:3])
        for c in (cA, cP, cX, cM, cL, cZ, cX): 
            try: c.close()
            except Exception: pass
        regresiones(b)
        b.close()
    os.makedirs(os.path.join(Hn.ROOT, 'tests', 'shots'), exist_ok=True)
    json.dump(RES, open(os.path.join(Hn.ROOT, 'tests', 'shots', 'escenarios.json'), 'w'), ensure_ascii=False, indent=1)
    f = [r for r in RES if not r['ok']]; print('\n%d de %d pasan' % (len(RES) - len(f), len(RES)))

if __name__ == '__main__': main()
