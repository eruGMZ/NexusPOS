import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const rendererSrc = resolve(root, 'src', 'renderer');
const webOut = resolve(root, 'www');
const chartSrc = resolve(root, 'node_modules', 'chart.js', 'dist', 'chart.umd.js');
const chartVendor = resolve(rendererSrc, 'vendor', 'chart.umd.js');

if (!existsSync(chartSrc)) {
  console.error('No se encontro Chart.js en node_modules. Ejecuta npm install primero.');
  process.exit(1);
}

mkdirSync(resolve(rendererSrc, 'vendor'), { recursive: true });
cpSync(chartSrc, chartVendor);

if (existsSync(webOut)) {
  rmSync(webOut, { recursive: true, force: true });
}

cpSync(rendererSrc, webOut, { recursive: true });

console.log('Web lista para Capacitor en /www');
