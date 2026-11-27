// Genera los iconos de la app a partir del símbolo (src/app/marca.js). Uso: node tools/iconos.cjs
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const H = path.resolve(__dirname, '..'); const vm = require('vm');
const ctx = {}; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(H, 'src/app/marca.js'), 'utf8') + ';this.MARCA=MARCA', ctx);
const M = ctx.MARCA, OUT = path.join(H, 'public/icons');
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'favicon.svg'), M.simbolo({ redondeo: 22 }));
const sinRedondeo = M.simbolo({ redondeo: 0 });
// maskable: el símbolo dentro de la zona segura (80 %) sobre fondo turquesa a sangre
const maskable = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="' + M.C.teal + '"/><g transform="translate(12 12) scale(.76)">' + M.simbolo({ fondo: false }).replace(/^<svg[^>]*>|<\/svg>$/g, '') + '</g></svg>';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const png = async (svg, size, file, transparente) => { await p.setViewportSize({ width: size, height: size });
    await p.setContent('<html><body style="margin:0;background:transparent">' + svg.replace('<svg ', '<svg width="' + size + '" height="' + size + '" ') + '</body></html>');
    await p.screenshot({ path: path.join(OUT, file), omitBackground: !!transparente, clip: { x: 0, y: 0, width: size, height: size } }); };
  await png(M.simbolo(), 192, 'icon-192.png', true);
  await png(M.simbolo(), 512, 'icon-512.png', true);
  await png(maskable, 512, 'maskable-512.png');
  await png(sinRedondeo, 180, 'apple-touch-icon.png');
  await png(M.simbolo({ redondeo: 18 }), 32, 'favicon-32.png', true);
  await b.close(); console.log('iconos ->', fs.readdirSync(OUT).join(', '));
})();
