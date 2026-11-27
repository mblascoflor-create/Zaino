"""Arnés de pruebas: sitio local con el esqueleto real de publicación, base de datos simulada compartida
entre "móviles" (serve_db.py) y fuentes locales en lugar de Google Fonts."""
import os, re, json, shutil, subprocess, time, socket, urllib.parse
from playwright.sync_api import sync_playwright

H = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(H))
SITE = os.path.join(ROOT, 'dist')
FONTS = os.path.join(H, 'fonts', 'node_modules')
SKEL = ('<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>'
        ':root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}'
        'html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000}'
        'img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style></head><body>')
PORT = 8765

def build_site():
    subprocess.run(['node', os.path.join(ROOT, 'tools', 'build.mjs')], check=True, stdout=subprocess.DEVNULL)

def _up():
    s = socket.socket();
    try:
        s.connect(('127.0.0.1', PORT)); return True
    except Exception:
        return False
    finally:
        s.close()

def serve():
    if _up(): return
    subprocess.Popen(['python3', os.path.join(H, 'serve_db.py'), '--port', str(PORT), '--dir', SITE], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(50):
        if _up(): return
        time.sleep(0.1)
    raise RuntimeError('serve_db no arranca')

def reset_db(ns='default'):
    import urllib.request
    req = urllib.request.Request('http://127.0.0.1:%d/__db?ns=%s' % (PORT, ns), method='DELETE')
    try: urllib.request.urlopen(req).read()
    except Exception: pass

FONT_FILES = {
    'TikTok Sans': [('normal', '300 900', '75% 150%', '@fontsource-variable/tiktok-sans/files/tiktok-sans-latin-wdth-normal.woff2'),
                    ('normal', '300 900', '75% 150%', '@fontsource-variable/tiktok-sans/files/tiktok-sans-latin-ext-wdth-normal.woff2')],
    'Bodoni Moda': [('italic', '400 900', '100%', '@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-wght-italic.woff2'),
                    ('italic', '400 900', '100%', '@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-ext-wght-italic.woff2')],
    'IBM Plex Mono': [('normal', w, '100%', '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-%s-normal.woff2' % w) for w in ('500', '600', '700')],
}

def install_fonts(ctx):
    def css(route):
        url = route.request.url
        fams = [urllib.parse.unquote_plus(f.split(':')[0]) for f in urllib.parse.parse_qs(urllib.parse.urlsplit(url).query).get('family', [])]
        out = []
        for fam in fams:
            for style, weight, stretch, rel in FONT_FILES.get(fam, []):
                out.append("@font-face{font-family:'%s';font-style:%s;font-weight:%s;font-stretch:%s;font-display:swap;src:url(https://fonts.gstatic.com/local/%s) format('woff2');}" % (fam, style, weight, stretch, rel))
        if not os.path.isdir(FONTS):
            out = []  # El zip del proyecto puede probarse con las fuentes de sistema.
        route.fulfill(status=200, content_type='text/css', body='\n'.join(out))
    def font(route):
        rel = route.request.url.split('/local/', 1)[1]
        p = os.path.join(FONTS, rel)
        if os.path.exists(p): route.fulfill(status=200, content_type='font/woff2', body=open(p, 'rb').read())
        else: route.fulfill(status=404, body='')
    ctx.route('https://fonts.googleapis.com/**', css)
    ctx.route('https://fonts.gstatic.com/**', font)

def device(browser, name='m', mode='normal', dark=False):
    ctx = browser.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=1, is_mobile=True, has_touch=True,
                              color_scheme='dark' if dark else 'light', locale='es-ES')
    install_fonts(ctx)
    ctx.add_init_script("try{localStorage.setItem('__mocksync__','/__db');localStorage.setItem('__mockmode__','%s');}catch(e){}" % mode)
    page = ctx.new_page()
    page.set_default_timeout(9000)
    page.errors = []
    page.on('pageerror', lambda e: page.errors.append('pageerror: ' + str(e)))
    page.on('console', lambda m: page.errors.append('console.' + m.type + ': ' + m.text) if m.type in ('error', 'warning') else None)
    page.name = name
    return ctx, page

def shot(page, name, full=False):
    os.makedirs(os.path.join(ROOT, 'tests', 'shots'), exist_ok=True)
    p = os.path.join(ROOT, 'tests', 'shots', name + '.png')
    page.screenshot(path=p, full_page=full)
    return p
