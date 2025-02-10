
const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  entryPoints: [path.join(__dirname, 'src', 'electron', 'preload.mts')],
  bundle: true,
  outfile: path.join(__dirname, 'dist-electron', 'preload.js'),
  platform: 'node',
  format: 'cjs',  // CommonJS format
  target: ['esnext'],
  sourcemap: true,
  external: ['fs', 'path', 'electron']
}).then(() => {
  console.log('Preload script bundled successfully as preload.js');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
