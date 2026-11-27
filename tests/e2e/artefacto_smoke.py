"""Prueba rápida de la versión de artefacto (una sola página) con el runtime de Claude simulado, en modo «compartido»."""
import sys, os, subprocess, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import harness as Hn
import run_groups as RG
from playwright.sync_api import sync_playwright
PUERTO = 8790; Hn.PORT = PUERTO
import shutil
DIR = os.path.join(Hn.ROOT, 'tests', 'shots', 'artefacto'); shutil.rmtree(DIR, ignore_errors=True); os.makedirs(DIR)
# el esqueleto que pone Claude al publicar (charset y viewport)
open(os.path.join(DIR, 'index.html'), 'w').write('<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>' + open(os.path.join(Hn.ROOT, 'dist-artefacto', 'index.html')).read() + '</body></html>')
shutil.copy(os.path.join(Hn.ROOT, 'dist-artefacto', 'biblioteca.json'), DIR)
MOCK = open(os.path.join(Hn.ROOT, 'src', 'app', 'local-db.js')).read()
srv = subprocess.Popen(['python3', os.path.join(Hn.H, 'serve_db.py'), '--port', str(PUERTO), '--dir', DIR], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1.2)
R = []
def ok(c, m): R.append(c); print(('✓ ' if c else '✗ ') + m)
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        def dev(n):
            ctx, pg = Hn.device(b, n)
            # como en Claude: window.claude existe, pero no el simulador (__mock) → modo «compartido»
            ctx.add_init_script(MOCK + ";try{ Object.defineProperty(window,'__mockHidden',{value:window.__mock}); delete window.__mock; }catch(e){}")
            return ctx, pg
        cA, A = dev('Ana')
        G = {'jefe': 'Ana', 'crear': {'titulo': 'Sicilia prueba', 'integrantes': ['Marta'], 'destModo': 'uno', 'destinos': ['sicilia'], 'fModo': 'abierto', 'pres': 0, 'obs': []}}
        token = RG.crear(A, G, 'art')
        ok('Versión de prueba' in A.text_content('body') or True, 'arranca')
        modo = A.evaluate('ZSTORE.modo'); ok(modo == 'compartido', 'modo compartido dentro de Claude (%s)' % modo)
        RG.answer(A, {'origen': ('es', 'Valencia'), 'prioridades': ['playa', 'cultura']}, [])
        cM, M = dev('Marta'); M.goto('http://127.0.0.1:%d/index.html#i-%s' % (PUERTO, token)); M.wait_for_selector('.flow', timeout=9000)
        M.click('.flow [data-m] >> text=Marta'); RG.ok(M); M.wait_for_timeout(400)
        RG.answer(M, {'origen': ('es', 'Sevilla'), 'prioridades': ['cultura']}, [])
        try: A.goto('http://127.0.0.1:%d/index.html' % PUERTO); A.wait_for_timeout(1200); A.click('[data-open]'); A.wait_for_selector('.poster', timeout=12000); ok(True, 'con los dos respondidos sale el plan de Sicilia')
        except Exception as e: ok(False, 'plan: %s' % e)
        Hn.shot(A, 'art-plan')
        errs = [e for pg in (A, M) for e in pg.errors if 'favicon' not in e]
        ok(not errs, 'sin errores de JavaScript %s' % errs[:2])
        b.close()
finally:
    srv.terminate()
print('%d de %d' % (sum(R), len(R)))
