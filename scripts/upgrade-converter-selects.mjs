import fs from 'fs';
import path from 'path';

const TOOLBOX_DIR = path.resolve('src/app/toolbox');

const CONVERTER_UNITS = {
  'pressure-unit-converter': ['pa', 'kpa', 'mpa', 'bar', 'psi', 'atm', 'mmhg', 'kgcm2'],
  'viscosity-unit-converter': ['cp', 'pas', 'pa.s', 'poise', 'lbfts', 'cst'],
  'temperature-unit-converter': ['C', 'F', 'K', 'R'],
  'angle-unit-converter': ['deg', 'rad', 'grad', 'arcmin', 'arcsec'],
  'length-unit-converter': ['m', 'mm', 'cm', 'km', 'in', 'ft', 'yd', 'mi'],
  'area-unit-converter': ['m2', 'mm2', 'cm2', 'km2', 'in2', 'ft2', 'yd2', 'acre', 'ha'],
  'volume-unit-converter': ['m3', 'l', 'ml', 'cm3', 'mm3', 'in3', 'ft3', 'gal'],
  'mass-unit-converter': ['kg', 'g', 'mg', 't', 'lb', 'oz'],
  'force-unit-converter': ['n', 'kn', 'mn', 'lbf', 'kgf', 'dyn'],
  'energy-unit-converter': ['j', 'kj', 'mj', 'kwh', 'cal', 'kcal', 'btu', 'ev'],
  'power-unit-converter': ['w', 'kw', 'mw', 'hp', 'btuh', 'ftlbs'],
  'speed-unit-converter': ['ms', 'kmh', 'mph', 'knot', 'fts'],
  'density-unit-converter': ['kgm3', 'gcm3', 'lbft3', 'lbin3'],
  'flow-rate-unit-converter': ['m3s', 'm3h', 'ls', 'lh', 'gpm', 'cfm'],
  'torque-unit-converter': ['nm', 'knm', 'lbfft', 'lbfin', 'kgfm'],
};

for (const [slug, units] of Object.entries(CONVERTER_UNITS)) {
  const file = path.join(TOOLBOX_DIR, slug, 'calculator-client.tsx');
  if (!fs.existsSync(file)) continue;

  let content = fs.readFileSync(file, 'utf8');

  const optionsJsx = units.map(u => `<option value="${u}">${u}</option>`).join('');

  // 匹配 <div key="1"> ... </div>
  const fromRegex = /<div key="1">[\s\S]*?<label[^>]*>From<\/label>[\s\S]*?<input[\s\S]*?\/>\s*<\/div>/;
  const toRegex = /<div key="2">[\s\S]*?<label[^>]*>To<\/label>[\s\S]*?<input[\s\S]*?\/>\s*<\/div>/;

  const newFromJsx = `<div key="1">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">From</label>
            <select value={inputs[1]} onChange={e => updateInput(1, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all">
              ${optionsJsx}
            </select>
          </div>`;

  const newToJsx = `<div key="2">
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">To</label>
            <select value={inputs[2]} onChange={e => updateInput(2, e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all">
              ${optionsJsx}
            </select>
          </div>`;

  if (fromRegex.test(content) && toRegex.test(content)) {
    content = content.replace(fromRegex, newFromJsx).replace(toRegex, newToJsx);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Replaced input with select in ${slug}`);
  } else {
    console.log(`Regex did not match in ${slug}`);
  }
}
