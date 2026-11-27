// Empaqueta las funciones en un solo archivo cada una (para pegarlas en el editor de Supabase).
//   completo: motor.ts / zaino-ia.ts llevan el motor y la biblioteca dentro (~750 KB)
//   ligero:   motor-ligero.ts / zaino-ia-ligero.ts los descargan de la web al arrancar (necesitan el secreto ZAINO_ORIGEN)
import { build } from 'esbuild'; import path from 'node:path'; import fs from 'node:fs';
const H = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(H, 'dist-funciones'); fs.mkdirSync(OUT, { recursive: true });
const remoto = { name: 'remoto', setup(b) {
  const R = path.join(H, 'supabase/functions/_shared/remoto.ts');
  b.onResolve({ filter: /zaino-core\.mjs$/ }, () => ({ path: R }));
  b.onResolve({ filter: /biblioteca\.json$/ }, () => ({ path: 'biblioteca', namespace: 'remoto' }));
  b.onLoad({ filter: /.*/, namespace: 'remoto' }, () => ({ contents: 'export { default } from ' + JSON.stringify(R) + ';', loader: 'ts', resolveDir: path.dirname(R) }));
} };
for (const f of ['motor', 'zaino-ia']) {
  const base = { entryPoints: [path.join(H, 'supabase/functions', f, 'index.ts')], bundle: true, format: 'esm', platform: 'neutral', minify: true, legalComments: 'none', external: ['npm:*'], loader: { '.json': 'json' }, logLevel: 'warning' };
  await build({ ...base, outfile: path.join(OUT, f + '.ts') });
  await build({ ...base, outfile: path.join(OUT, f + '-ligero.ts'), plugins: [remoto] });
}
// el núcleo tal cual lo descarga la variante ligera
const nucleo = ['data.js', 'engine.js', 'compat.js', 'servidor.js'].map((x) => fs.readFileSync(path.join(H, 'src/core', x), 'utf8')).join('\n;\n');
fs.writeFileSync(path.join(OUT, 'zaino-core.js'), (await import('esbuild')).transformSync(nucleo, { minify: true, legalComments: 'none' }).code);
for (const x of fs.readdirSync(OUT)) console.log('  ' + x + ' · ' + Math.round(fs.statSync(path.join(OUT, x)).size / 1024) + ' KB');
