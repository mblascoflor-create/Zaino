"""Recorre la app entera con varios grupos de perfiles muy distintos, cada miembro en su "móvil".
Uso: python3 test/run_groups.py [g1 g2 g3 ...]   (capturas en shots/<grupo>-*.png, informe en shots/report.json)"""
import sys, json, time, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import harness as Hn
from playwright.sync_api import sync_playwright

GROUPS = {
  'g1': {'desc':'Fiesteros de playa, sin coche, presupuesto ajustado, julio', 'jefe':'Ana',
         'crear':{'ocasion':'cumple','titulo':'Verano sin padres','integrantes':['Pol','Leo','Iria'],'destModo':'no','fModo':'mes','mes':7,'dias':5,'pres':250,'obs':['Nadie conduce','Queremos salir de fiesta']},
         'perfiles':{
           'Ana':{'origen':('es','Barcelona'),'playa':'cala','momento':'agua','andar':'medio','dieta':['nada'],'capricho':'barco','agobio':'madrugones','paisaje':['mar'],'calor':'playa','noche':'fiesta','intereses':['playa','fiesta','gastronomia'],'ritmo':3,'madrugar':'no','dormir':'hostel','comida':'street','presupuesto':'justo','nota':'Bañarnos en una cala'},
           'Pol':{'origen':('es','Madrid'),'playa':'lido','ciudad':'barrios','momento':'fiesta','andar':'poco','dieta':['nada'],'capricho':'nada','agobio':'gastar','paisaje':['mar','ciudad'],'calor':'playa','noche':'fiesta','intereses':['fiesta','playa'],'ritmo':3,'madrugar':'no','dormir':'hostel','comida':'street','presupuesto':'ok'},
           'Leo':{'origen':('es','Barcelona'),'playa':'barco','momento':'agua','andar':'medio','dieta':['sin_pescado'],'capricho':'barco','agobio':'prisas','paisaje':['mar'],'calor':'playa','noche':'fiesta','intereses':['agua','playa'],'ritmo':2,'madrugar':'no','dormir':'piso','comida':'street','presupuesto':'ok'},
           'Iria':{'origen':('es','Santiago'),'playa':'cala','momento':'atardecer','andar':'mucho','dieta':['vegetariano'],'capricho':'cena','agobio':'turistadas','paisaje':['mar'],'calor':'playa','noche':'aperitivo','intereses':['postal','gastronomia'],'ritmo':2,'madrugar':'si','dormir':'hostel','comida':'trattoria','presupuesto':'justo'}}},
  'g2': {'desc':'Erasmus en Bolonia, montaña en invierno, con coche, fechas fijas', 'jefe':'Mar',
         'crear':{'ocasion':'erasmus','titulo':'','integrantes':['Iker','Sara'],'destModo':'no','fModo':'fijas','inicio':'2027-02-12','fin':'2027-02-16','pres':600,'obs':['Nada de madrugar']},
         'perfiles':{
           'Mar':{'origen':('it','Bolonia'),'nieveAct':'raquetas','momento':'cumbre','andar':'mucho','dieta':['nada'],'capricho':'experiencia','agobio':'nada','paisaje':['montana'],'nieve':'si','noche':'calma','intereses':['naturaleza','aventura','postal'],'ritmo':3,'madrugar':'si','coche':'conduzco','dormir':'hotel','comida':'trattoria','presupuesto':'ok'},
           'Iker':{'origen':('it','Bolonia'),'nieveAct':'esqui','momento':'cumbre','andar':'mucho','dieta':['nada'],'capricho':'experiencia','agobio':'prisas','paisaje':['montana'],'nieve':'si','noche':'calma','intereses':['aventura','naturaleza'],'ritmo':3,'madrugar':'si','coche':'conduzco','dormir':'hotel','comida':'trattoria','presupuesto':'estirar'},
           'Sara':{'origen':('it','Milán'),'nieveAct':'relax','momento':'cena','andar':'poco','dieta':['sin_gluten'],'capricho':'cena','agobio':'coche','paisaje':['montana','campo'],'nieve':'si','noche':'aperitivo','intereses':['naturaleza','gastronomia'],'ritmo':2,'madrugar':'si','coche':'carnet','dormir':'hotel','comida':'trattoria','presupuesto':'ok'}}},
  'g3': {'desc':'Destino fijado (Sicilia), septiembre, 2 personas, swipe de planes, conducen', 'jefe':'Lucía',
         'crear':{'titulo':'Sicilia con Marta','integrantes':['Marta'],'destModo':'uno','destinos':['sicilia'],'fModo':'abierto','pres':0,'obs':[]},
         'perfiles':{
           'Lucía':{'origen':('es','Valencia'),'playa':'cala','ciudad':'mercados','momento':'atardecer','andar':'medio','dieta':['nada'],'capricho':'barco','agobio':'turistadas','meses':[9,10],'dias':5,'noche':'aperitivo','coche':'conduzco','swipe':'ruurlrrlrlrl','ritmo':2,'madrugar':'si','dormir':'piso','comida':'cocinar','presupuestoCifra':450,'nota':''},
           'Marta':{'origen':('es','Sevilla'),'playa':'lido','ciudad':'museos','momento':'ruinas','andar':'poco','dieta':['sin_alcohol'],'capricho':'experiencia','agobio':'coche','meses':[9],'dias':7,'noche':'calma','coche':'carnet','swipe':'lrlrlurrlrll','ritmo':1,'madrugar':'no','dormir':'piso','comida':'street','presupuestoCifra':380}}},
  'g4': {'desc':'Cultura sin destino, abril, presupuesto medio, Valencia y Sevilla, vegetariana', 'jefe':'Lu',
         'crear':{'titulo':'Puente de abril','integrantes':['Mo','Dani','Eva'],'destModo':'varios','destinos':['roma','toscana','emilia-romana-gastronomica'],'fModo':'mes','mes':4,'dias':4,'pres':400,'obs':['Hay vegetarianos']},
         'perfiles':{
           'Lu':{'origen':('es','Valencia'),'ciudad':'museos','momento':'ruinas','andar':'medio','dieta':['vegetariano'],'capricho':'experiencia','agobio':'prisas','swipe':'rrlurl','paisaje':['ciudad'],'noche':'aperitivo','intereses':['cultura','gastronomia'],'ritmo':2,'madrugar':'si','coche':'no','dormir':'piso','comida':'trattoria','presupuesto':'ok'},
           'Mo':{'origen':('es','Sevilla'),'ciudad':'barrios','momento':'atardecer','andar':'mucho','dieta':['nada'],'capricho':'nada','agobio':'gastar','swipe':'lrrlru','paisaje':['ciudad','campo'],'noche':'aperitivo','intereses':['cultura','postal'],'ritmo':1,'madrugar':'si','coche':'no','dormir':'piso','comida':'cocinar','presupuesto':'justo'},
           'Dani':{'origen':('es','Valencia'),'ciudad':'barrios','momento':'cumbre','andar':'mucho','dieta':['nada'],'capricho':'cena','agobio':'turistadas','swipe':'llrrur','paisaje':['campo'],'noche':'calma','intereses':['cultura','naturaleza'],'ritmo':2,'madrugar':'si','coche':'carnet','dormir':'piso','comida':'trattoria','presupuesto':'ok'},
           'Eva':{'origen':('es','Madrid'),'ciudad':'mercados','momento':'fiesta','andar':'poco','dieta':['vegetariano','sin_gluten'],'capricho':'cena','agobio':'madrugones','swipe':'rlrlrl','paisaje':['ciudad'],'noche':'fiesta','intereses':['gastronomia','fiesta'],'ritmo':2,'madrugar':'no','coche':'no','dormir':'hostel','comida':'street','presupuesto':'ok'}}},
}

def step_id(page):
    try: return page.get_attribute('.flow .body', 'data-step', timeout=4000)
    except Exception: return None

def wait_change(page, prev, t=4.0):
    end=time.time()+t
    while time.time()<end:
        s = None
        try:
            if page.locator('.flow').count()==0: return None
            s = page.get_attribute('.flow .body','data-step', timeout=500)
        except Exception: pass
        if s!=prev: return s
        time.sleep(0.08)
    return prev

def ok(page): page.click('#fl-ok');

def answer(page, prof, log):
    seen=0
    while True:
        st = step_id(page)
        if st is None: return
        seen+=1
        if seen>60: raise RuntimeError('demasiados pasos')
        log.append(st)
        if st=='origen':
            pais, ciudad = prof['origen']; page.click('[data-p="%s"]' % pais); time.sleep(.15); page.click('[data-c="%s"]' % ciudad)
        elif st=='meses':
            for m in prof.get('meses',[7]): page.click('.flow [data-m="%d"]' % m)
            ok(page)
        elif st=='prioridades':
            I2D={'cultura':'cultura','gastronomia':'gastronomia','naturaleza':'naturaleza','playa':'playa','aventura':'aventura','postal':'postal','compras':'ciudad','agua':'playa','fiesta':'fiesta'}
            want = prof.get('prioridades') or [I2D.get(x) for x in prof.get('intereses',[])]
            hit=0
            for v in [w for w in want if w][:3]:
                if page.locator('.flow .opt[data-v="%s"]:not(.on)' % v).count(): page.click('.flow .opt[data-v="%s"]' % v); hit+=1
            if not hit: page.click('.flow .opt >> nth=0')
            ok(page)
        elif st=='pres':
            ideal = prof.get('presIdeal', prof.get('presupuestoCifra', 400)); mx = prof.get('presMax', int(ideal*1.3))
            page.eval_on_selector('#i-pi', 'e=>{e.value=%d;e.dispatchEvent(new Event("input"))}' % ideal)
            page.eval_on_selector('#i-pm', 'e=>{e.value=%d;e.dispatchEvent(new Event("input"))}' % mx)
            ok(page)
        elif st in ('innegociable','clima','duelo1','duelo2','fechasOk') and prof.get(st):
            page.click('.flow .opt[data-v="%s"]' % prof[st])
        elif st in ('paisaje','intereses','dieta'):
            hit=0
            for v in prof.get(st,[]):
                if page.locator('.flow .opt[data-v="%s"]' % v).count(): page.click('.flow .opt[data-v="%s"]' % v); hit+=1
            if not hit: page.click('.flow .opt >> nth=0')
            ok(page)
        elif st=='swipe':
            pat = prof.get('swipe','rl')
            i=0
            while step_id(page)=='swipe' and i<20:
                c = pat[i % len(pat)]
                page.click({'r':'#sw-si','l':'#sw-no','u':'#sw-si2'}[c]); time.sleep(.32); i+=1
            continue
        elif st=='presupuestoCifra':
            v = prof.get('presupuestoCifra', 350)
            page.eval_on_selector('#i-pc', 'e=>{e.value=%d;e.dispatchEvent(new Event("input"))}' % v); ok(page)
        elif st=='nota':
            if prof.get('nota'): page.fill('#i-nota', prof['nota']); ok(page)
            else: page.click('#fl-skip')
        elif st=='base':
            page.click('.flow .opt >> nth=%d' % prof.get('base',0))
        elif st=='fin':
            shot_name = getattr(page,'_shotfin',None)
            if shot_name: Hn.shot(page, shot_name)
            ok(page)
        else:
            v = prof.get(st)
            if v is not None and not page.locator('.flow .opt[data-v="%s"]' % v).count(): v = None
            if v is None:
                page.click('.flow .opt >> nth=0')
            else:
                page.click('.flow .opt[data-v="%s"]' % v)
        wait_change(page, st)

def crear(page, G, name):
    c = G['crear']
    page.goto('http://127.0.0.1:%d/index.html' % Hn.PORT); page.wait_for_timeout(700)
    Hn.shot(page, name+'-00-inicio')
    page.click('#b-crear'); page.wait_for_selector('.flow')
    while True:
        st = step_id(page)
        if st=='yo': page.fill('#i-yo', G['jefe']);
        if st=='yo' and c['titulo']: page.fill('#i-tit', c['titulo'])
        if st=='yo': Hn.shot(page, name+'-01-crear'); ok(page)
        elif st=='integrantes':
            for n in c['integrantes']: page.fill('#i-nom', n); page.click('#b-add'); page.wait_for_timeout(120)
            Hn.shot(page, name+'-02-integrantes'); ok(page)
        elif st=='destModo': page.click('.flow .opt[data-v="%s"]' % c['destModo'])
        elif st=='destinos':
            for z in c['destinos']: page.click('[data-z="%s"]' % z)
            Hn.shot(page, name+'-03-destinos')
            if c['destModo']!='uno': ok(page)
        elif st=='fModo': page.click('.flow .opt[data-v="%s"]' % c['fModo'])
        elif st=='fechas': page.fill('#i-ini', c['inicio']); page.fill('#i-fin', c['fin']); page.dispatch_event('#i-fin','change'); ok(page)
        elif st=='mes': page.click('.flow [data-m="%d"]' % c['mes']); page.click('[data-d="%d"]' % c['dias']); ok(page)
        elif st=='ocasion': page.click('.flow .opt[data-v="%s"]' % c.get('ocasion','porque'))
        elif st=='presupuesto':
            if c['pres']: page.eval_on_selector('#i-pres','e=>{e.value=%d;e.dispatchEvent(new Event("input"))}' % c['pres'])
            else: page.check('#i-psin')
            ok(page)
        elif st=='obs':
            for o in c['obs']: page.click('[data-s="%s"]' % o)
            ok(page)
        elif st=='share':
            page.wait_for_timeout(200); Hn.shot(page, name+'-04-compartir')
            href = page.eval_on_selector('.flow a[href*="wa.me"]', 'a=>decodeURIComponent(a.href)')
            import re as _re; token = _re.search(r'#i-([a-f0-9]+)', href).group(1)
            ok(page); return token
        else:
            raise RuntimeError('paso de crear desconocido: %r' % st)
        wait_change(page, st)

def run(names):
    Hn.build_site(); Hn.serve(); Hn.reset_db()
    report = {}
    with sync_playwright() as p:
        b = p.chromium.launch()
        for gname in names:
            G = GROUPS[gname]; R = {'desc':G['desc'], 'errores':[]}
            ctxj, pj = Hn.device(b, G['jefe'])
            token = crear(pj, G, gname); R['token']=token; code = pj.evaluate("JSON.parse(localStorage.getItem('zaino.ult'))")
            log=[]; pj._shotfin = gname+'-05-fin'
            answer(pj, G['perfiles'][G['jefe']], log); R['pasos_'+G['jefe']]=log
            devs=[(ctxj,pj)]
            for i, n in enumerate(G['crear']['integrantes']):
                ctx, pg = Hn.device(b, n, dark=(i==0))
                pg.goto('http://127.0.0.1:%d/index.html#i-%s' % (Hn.PORT, token)); pg.wait_for_selector('.flow', timeout=8000); pg.wait_for_timeout(300)
                if i==0: Hn.shot(pg, gname+'-06-elegir-nombre')
                pg.click('.flow [data-m] >> text=%s' % n); ok(pg); pg.wait_for_timeout(250)
                if i==0:
                    # capturar algunas preguntas tal cual las ve un miembro
                    pg._shotq = True
                lg=[];
                st=step_id(pg); k=0
                answer_with_shots(pg, G['perfiles'][n], lg, gname if i==0 else None)
                R['pasos_'+n]=lg
                devs.append((ctx,pg))
            pj.wait_for_timeout(1500)
            pj.goto('http://127.0.0.1:%d/index.html' % Hn.PORT); pj.wait_for_timeout(1200)
            pj.click('[data-open="%s"]' % code); pj.wait_for_timeout(1500)
            if pj.locator('[data-elegir]').count():
                Hn.shot(pj, gname+'-09-propuestas', full=True)
                pj.emulate_media(color_scheme='dark'); pj.wait_for_timeout(300); Hn.shot(pj, gname+'-09-propuestas-oscuro', full=True); pj.emulate_media(color_scheme='light')
                R['propuestas'] = pj.evaluate("Array.from(document.querySelectorAll('.prop')).map(e=>e.querySelector('.prop-tipo').innerText+': '+e.querySelector('h3').innerText+' '+e.querySelector('.pct').innerText.replace(/\\s/g,'')+' · '+e.querySelector('.coste b').innerText)")
                pj.click('[data-votar] >> nth=0'); pj.wait_for_timeout(500)
                pj.click('[data-elegir] >> nth=0'); pj.click('#b-el-si'); pj.wait_for_selector('.poster', timeout=10000); pj.wait_for_timeout(800)
            Hn.shot(pj, gname+'-10-resumen', full=True)
            R['destino'] = pj.inner_text('.poster .d') if pj.locator('.poster .d').count() else None
            R['por_que'] = pj.inner_text('.why-list') if pj.locator('.why-list').count() else None
            for sub in ('dias','lista','grupo','tarjeta'):
                pj.click('[data-sub="%s"]' % sub); pj.wait_for_timeout(1800 if sub=='tarjeta' else 500)
                if sub=='lista':
                    if pj.locator('#b-li-all').count(): pj.click('#b-li-all'); pj.wait_for_timeout(1200)
                    pj.fill('#i-li','Comprar el regalo'); pj.click('#f-li button[type=submit]'); pj.wait_for_timeout(700)
                    if pj.locator('[data-tick]').count(): pj.click('[data-tick] >> nth=0'); pj.wait_for_timeout(500)
                    if pj.locator('[data-quien]').count(): pj.click('[data-quien] >> nth=1'); pj.wait_for_timeout(500)
                    R['lista'] = pj.locator('.chk li').count()
                Hn.shot(pj, gname+'-1%d-%s' % ({'dias':1,'lista':4,'grupo':2,'tarjeta':3}[sub], sub), full=True)
                if sub=='dias':
                    R['dias'] = []
                    for button in range(pj.locator('[data-ir-dia]').count()):
                        pj.locator('[data-ir-dia]').nth(button).click()
                        assert pj.locator('.agenda .day').count()==1
                        assert pj.locator('.agenda .day').get_attribute('id')==f'dia-{button+1}'
                        R['dias'].append(pj.locator('.agenda .day').inner_text())
                    pj.locator('[data-ir-dia]').nth(1).click()
                    if pj.locator('.slot-edit').count():
                        # «Editar parada» vive dentro de un .agenda-slot cerrado: se abre primero la parada y luego la edición
                        parada = pj.locator('.agenda-slot:has(.slot-edit)').first
                        if not parada.evaluate('el => el.open'): parada.locator(':scope > summary').click()
                        edicion = parada.locator('.slot-edit')
                        if not edicion.evaluate('el => el.open'): edicion.locator('summary').click()
                        assert pj.locator('.slot-edit[open] .ed').is_visible()
                    Hn.shot(pj, gname+'-11-dia2', full=True)
            # tarjeta a tamaño real
            try:
                data = pj.eval_on_selector('#cv','c=>c.toDataURL("image/png")')
                import base64; open(os.path.join(Hn.ROOT,'tests','shots',gname+'-card.png'),'wb').write(base64.b64decode(data.split(',')[1]))
            except Exception as e: R['errores'].append('tarjeta: %s' % e)
            try:
                with pj.expect_download(timeout=8000) as dl: pj.click('#b-save')
                R['descargas'] = [dl.value.suggested_filename]
            except Exception as e: R['errores'].append('descarga: %s' % e)
            # reservas
            pj.click('[data-tab="reservas"]'); pj.wait_for_timeout(700); Hn.shot(pj, gname+'-20-reservas', full=True)
            if pj.locator('[data-st="confirmar"]').count():
                pj.click('[data-st="confirmar"] >> nth=0'); pj.fill('#c-n','Localizador XK12'); pj.fill('#c-i','184.50'); pj.click('#f-c button[type=submit]'); pj.wait_for_timeout(900)
                Hn.shot(pj, gname+'-21-reservas-conf', full=True)
            # gastos
            pj.click('[data-tab="gastos"]'); pj.wait_for_timeout(700)
            pj.click('#b-gasto'); pj.fill('#g-c','Cena primera noche'); pj.fill('#g-i','63'); pj.click('#f-g button[type=submit]'); pj.wait_for_timeout(900)
            Hn.shot(pj, gname+'-30-gastos', full=True)
            pj.click('[data-tab="perfil"]'); pj.wait_for_timeout(500); Hn.shot(pj, gname+'-40-perfil', full=True)
            for ctx, pg in devs:
                R['errores'] += ['%s: %s' % (pg.name, e) for e in pg.errors if 'favicon' not in e]
                ctx.close()
            report[gname]=R
            print('==', gname, R.get('propuestas'), R.get('destino'), '|', (R.get('por_que') or '').replace('\n',' · '), '| errores:', len(R['errores']))
        b.close()
    json.dump(report, open(os.path.join(Hn.ROOT,'tests','shots','report.json'),'w'), ensure_ascii=False, indent=1)
    return report

def answer_with_shots(pg, prof, lg, gname):
    if not gname: return answer(pg, prof, lg)
    # captura de cada pantalla de pregunta del primer miembro
    orig = pg.click
    count=[0]
    def click_and_shot(sel, **kw):
        st = None
        try: st = pg.get_attribute('.flow .body','data-step', timeout=300)
        except Exception: pass
        if st and st not in seen:
            seen.add(st); count[0]+=1; pg.wait_for_timeout(450); Hn.shot(pg, '%s-q%02d-%s' % (gname, count[0], st))
        return orig(sel, **kw)
    seen=set()
    pg.click = click_and_shot
    try: answer(pg, prof, lg)
    finally: pg.click = orig

if __name__ == '__main__':
    run(sys.argv[1:] or list(GROUPS))
