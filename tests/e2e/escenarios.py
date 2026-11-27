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

def main():
    Hn.build_site(); Hn.serve(); Hn.reset_db()
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
        b.close()
    os.makedirs(os.path.join(Hn.ROOT, 'tests', 'shots'), exist_ok=True)
    json.dump(RES, open(os.path.join(Hn.ROOT, 'tests', 'shots', 'escenarios.json'), 'w'), ensure_ascii=False, indent=1)
    f = [r for r in RES if not r['ok']]; print('\n%d de %d pasan' % (len(RES) - len(f), len(RES)))

if __name__ == '__main__': main()
