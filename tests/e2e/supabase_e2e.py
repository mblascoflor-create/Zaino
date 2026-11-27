"""La app de verdad en modo servidor (Supabase) contra el Supabase simulado: Postgres real con las
migraciones y RLS, sesiones anónimas, funciones motor y zaino-ia tal cual, varios móviles.
Uso: python3 tests/e2e/supabase_e2e.py"""
import sys, os, json, time, re, subprocess, urllib.request
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import harness as Hn
import run_groups as RG
from playwright.sync_api import sync_playwright

PUERTO = 54330; Hn.PORT = PUERTO
URL = 'http://127.0.0.1:%d/index.html' % PUERTO
RES = []
def cifra(txt, n): return re.search(r'(^|[^0-9.])%s([^0-9]|$)' % n, txt) is not None
def ok(c, m, x=''):
    RES.append({'ok': bool(c), 'prueba': m, 'detalle': str(x)[:300]}); print(('✓ ' if c else '✗ ') + m + (('  · ' + str(x)[:160]) if x else ''))
def sql(q, params=None):
    req = urllib.request.Request('http://127.0.0.1:%d/__sql' % PUERTO, data=json.dumps({'sql': q, 'params': params or []}).encode(), method='POST', headers={'content-type': 'application/json'})
    return json.loads(urllib.request.urlopen(req).read())
def dispositivo(b, n):
    ctx, pg = Hn.device(b, n); ctx.add_init_script("try{localStorage.removeItem('__mocksync__')}catch(e){}"); return ctx, pg
def esperar(pg, cond, t=12):
    fin = time.time() + t
    while time.time() < fin:
        try:
            if cond(): return True
        except Exception: pass
        pg.wait_for_timeout(400)
    return False

G = {'jefe': 'Ana', 'crear': {'ocasion': 'porque', 'titulo': 'Prueba servidor', 'integrantes': ['Pol'], 'destModo': 'no', 'fModo': 'mes', 'mes': 9, 'dias': 3, 'pres': 350, 'obs': []}}
P = {'Ana': {'origen': ('es', 'Madrid'), 'prioridades': ['cultura', 'gastronomia'], 'innegociable': 'nada', 'clima': 'templado', 'noche': 'aperitivo', 'presIdeal': 450, 'presMax': 1275},
     'Pol': {'origen': ('es', 'Valencia'), 'prioridades': ['playa', 'gastronomia'], 'innegociable': 'nada', 'clima': 'calor', 'noche': 'fiesta', 'presIdeal': 350, 'presMax': 1325}}

def main():
    Hn.build_site()
    open(os.path.join(Hn.SITE, 'config.js'), 'w').write("window.ZAINO_CONFIG={supabaseUrl:'http://127.0.0.1:%d',supabaseAnonKey:'sb_publishable_simulada',ia:false,sondeoMs:1500};" % PUERTO)
    sim = subprocess.Popen(['deno', 'run', '-A', os.path.join(Hn.ROOT, 'tests', 'supabase_simulado.ts'), str(PUERTO)], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    try:
        for _ in range(240):
            l = sim.stdout.readline()
            if 'Supabase simulado' in l: break
        with sync_playwright() as p:
            b = p.chromium.launch()
            cA, A = dispositivo(b, 'Ana')
            A.goto(URL); A.wait_for_timeout(1500)
            ok('Modo prueba' not in A.text_content('body'), 'La app arranca en modo servidor (no sale «Modo prueba»)')
            uidA = A.evaluate("ZSTORE.uid()"); ok(uidA and ZSTORE_ok(uidA), 'Ana tiene una sesión anónima sin registrarse', uidA)
            token = RG.crear(A, G, 'sb'); code = A.evaluate("JSON.parse(localStorage.getItem('zaino.ult'))")
            fila = sql('select code, token, creador from viajes')
            ok(len(fila) == 1 and fila[0]['code'] == code and fila[0]['token'] == token, 'El viaje se crea en la base de datos con código y token', code)
            RG.answer(A, P['Ana'], [])
            ok(esperar(A, lambda: len(sql('select 1 from resultados')) == 1), 'Al responder, la función motor calcula y guarda resultados')
            # otro móvil
            cP, Pp = dispositivo(b, 'Pol'); Pp.goto(URL + '#i-' + token); Pp.wait_for_selector('.flow', timeout=15000); Pp.wait_for_timeout(300)
            ok('Ya ha entrado' in Pp.text_content('.flow'), 'La invitación enseña qué plazas están ocupadas')
            Pp.click('.flow [data-m] >> text=Pol'); RG.ok(Pp); Pp.wait_for_timeout(800)
            ok(len(sql("select 1 from miembros where miembro='m2'")) == 1, 'Pol ocupa su plaza en el servidor')
            RG.answer(Pp, P['Pol'], [])
            pub = sql('select data::text d from respuestas'); priv = sql('select data::text d from respuestas_privadas')
            ok(len(pub) == 2 and not any(cifra(r['d'], '1275') or cifra(r['d'], '1325') for r in pub) and sum('presMax' in r['d'] for r in priv) == 2, 'Los presupuestos van a la tabla privada, no a la pública')
            # RLS desde el navegador de Pol: intenta leer lo privado de Ana
            leido = Pp.evaluate("""(async()=>{ const sb = window.supabase.createClient(ZAINO_CONFIG.supabaseUrl, ZAINO_CONFIG.supabaseAnonKey, {auth:{storageKey:'zaino.sesion'}}); const r = await sb.from('respuestas_privadas').select('miembro, data'); return JSON.stringify(r.data); })()""")
            ok(not cifra(leido, '1275') and cifra(leido, '1325'), 'Desde el móvil de Pol solo se puede leer su parte privada', leido)
            ok(esperar(A, lambda: len(sql("select 1 from resultados where data->>'provisional'='false'")) == 1, 15), 'Con los dos respondidos, los resultados dejan de ser provisionales')
            res = sql('select data::text d from resultados')[0]['d']; ok(not cifra(res, '1275') and not cifra(res, '1325'), 'Los resultados guardados no tienen cifras de presupuesto')
            A.goto(URL); A.wait_for_timeout(1200); A.click('[data-open="%s"]' % code)
            ok(esperar(A, lambda: A.locator('[data-elegir]').count() > 0, 15), 'La organizadora ve las propuestas y puede elegir', A.locator('.prop h3').all_inner_texts() if A.locator('.prop h3').count() else '')
            Hn.shot(A, 'sb-01-propuestas', full=True)
            Pp.goto(URL); Pp.wait_for_timeout(1200)
            if Pp.locator('[data-open="%s"]' % code).count(): Pp.click('[data-open="%s"]' % code)
            ok(esperar(Pp, lambda: Pp.locator('[data-votar]').count() > 0, 15) and Pp.locator('[data-elegir]').count() == 0, 'Pol ve las propuestas, puede votar y no puede elegir')
            Pp.click('[data-votar] >> nth=0')
            ok(esperar(A, lambda: 'Votos: Pol' in A.text_content('body'), 15), 'El voto de Pol le llega a Ana (sondeo de respaldo, sin tiempo real)')
            A.click('[data-elegir] >> nth=0'); A.click('#b-el-si')
            ok(esperar(A, lambda: A.locator('.poster').count() == 1, 20), 'Ana elige y el servidor hace el plan')
            ok(esperar(Pp, lambda: Pp.locator('.poster').count() == 1, 15), 'A Pol le aparece el plan sin recargar')
            v = sql("select data::text d from viajes")[0]['d']; ok(not cifra(v, '1275') and not cifra(v, '1325') and '"por": "m1"' in v.replace('":"', '": "'), 'El plan guardado no lleva presupuestos y consta quién eligió')
            # editar itinerario siendo participante
            Pp.click('[data-sub="dias"]'); Pp.wait_for_timeout(600); n0 = Pp.locator('.slot').count()
            Pp.click('[data-anadir="0"]'); Pp.wait_for_timeout(400)
            if Pp.locator('[data-add-i]').count(): Pp.click('[data-add-i] >> nth=0')
            ok(esperar(Pp, lambda: Pp.locator('.slot').count() == n0 + 1, 10), 'Pol (participante) añade un plan al itinerario')
            A.click('[data-sub="dias"]'); ok(esperar(A, lambda: A.locator('.slot').count() == n0 + 1, 12), 'Ana ve el cambio de Pol')
            # lista y gastos a la vez
            for pg in (A, Pp): pg.click('[data-sub="lista"]'); pg.wait_for_timeout(500)
            A.fill('#i-li', 'Pasaporte'); Pp.fill('#i-li', 'Crema solar'); A.click('#f-li button[type=submit]'); Pp.click('#f-li button[type=submit]')
            ok(esperar(A, lambda: 'Pasaporte' in A.text_content('#app') and 'Crema solar' in A.text_content('#app'), 12), 'Lista: los dos añaden a la vez y aparecen ambos', json.dumps(sql('select data::text d from lista'))[:200] + ' | ' + ' '.join(Pp.errors[-3:]))
            A.click('[data-tab="gastos"]'); A.wait_for_timeout(700); A.click('#b-gasto'); A.fill('#g-c', 'Cena'); A.fill('#g-i', '40'); A.click('#f-g button[type=submit]')
            ok(esperar(A, lambda: len(sql('select 1 from gastos')) == 1, 8), 'El gasto se guarda en el servidor')
            Pp.click('[data-tab="gastos"]'); ok(esperar(Pp, lambda: 'Cena' in Pp.text_content('#app'), 12), 'Pol ve el gasto de Ana')
            # reservas (parche concurrente sobre el viaje)
            A.click('[data-tab="reservas"]'); A.wait_for_timeout(800)
            if A.locator('[data-st="confirmar"]').count():
                A.click('[data-st="confirmar"] >> nth=0'); A.fill('#c-n', 'XK12'); A.fill('#c-i', '90'); A.click('#f-c button[type=submit]')
                ok(esperar(A, lambda: 'XK12' in sql('select data::text d from viajes')[0]['d'], 8), 'Confirmar una reserva se guarda en el viaje')
            # seguridad del enlace
            A.click('[data-tab="viajes"]'); A.wait_for_timeout(500); A.click('[data-open="%s"]' % code); A.wait_for_timeout(800); A.click('[data-sub="grupo"]'); A.wait_for_timeout(400); A.click('#b-gg'); A.wait_for_timeout(300); A.click('#b-regen-link')
            ok(esperar(A, lambda: sql('select token from viajes')[0]['token'] != token, 8), 'La organizadora cambia el enlace')
            cZ, Z = dispositivo(b, 'Zoe'); Z.goto(URL + '#i-' + token); Z.wait_for_timeout(2500)
            ok('Esta invitación no funciona' in Z.text_content('body'), 'El enlace viejo ya no deja entrar')
            Z.goto(URL + '#v-' + code); Z.wait_for_timeout(1500); ok('Hace falta la invitación' in Z.text_content('body'), 'Saber el código no da acceso')
            # salir
            Pp.click('[data-tab="viajes"]'); Pp.wait_for_timeout(500); Pp.click('[data-open="%s"]' % code); Pp.wait_for_timeout(800); Pp.click('[data-sub="grupo"]'); Pp.wait_for_timeout(400); Pp.click('#b-gg'); Pp.wait_for_timeout(300); Pp.click('#b-salir'); Pp.click('#b-s-si')
            ok(esperar(Pp, lambda: len(sql("select 1 from miembros where miembro='m2'")) == 0 and len(sql("select 1 from respuestas_privadas where miembro='m2'")) == 0, 8), 'Pol sale del viaje y se borran sus respuestas (también las privadas)')
            errs = []
            for pg in (A, Pp, Z): errs += ['%s: %s' % (pg.name, e) for e in pg.errors if 'favicon' not in e and 'realtime' not in e.lower() and 'websocket' not in e.lower() and '503' not in e and 'GoTrueClient' not in e]
            ok(not errs, 'Sin errores de JavaScript', errs[:4])
            b.close()
    finally:
        sim.terminate()
    json.dump(RES, open(os.path.join(Hn.ROOT, 'tests', 'shots', 'supabase_e2e.json'), 'w'), ensure_ascii=False, indent=1)
    f = [r for r in RES if not r['ok']]; print('\n%d de %d pasan' % (len(RES) - len(f), len(RES)))

def ZSTORE_ok(uid): return bool(re.fullmatch(r'[0-9a-f-]{36}', uid))

if __name__ == '__main__': main()
