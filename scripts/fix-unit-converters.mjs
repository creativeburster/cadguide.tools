import fs from 'fs';
import path from 'path';

const TOOLBOX_DIR = path.resolve('src/app/toolbox');

const UNIT_CONVERTERS = [
  'pressure-unit-converter',
  'viscosity-unit-converter',
  'temperature-unit-converter',
  'angle-unit-converter',
  'length-unit-converter',
  'area-unit-converter',
  'volume-unit-converter',
  'mass-unit-converter',
  'force-unit-converter',
  'energy-unit-converter',
  'power-unit-converter',
  'speed-unit-converter',
  'density-unit-converter',
  'flow-rate-unit-converter',
  'torque-unit-converter',
];

for (const slug of UNIT_CONVERTERS) {
  const file = path.join(TOOLBOX_DIR, slug, 'calculator-client.tsx');
  if (!fs.existsSync(file)) {
    console.log(`Skip ${slug}, file not found.`);
    continue;
  }

  let code = fs.readFileSync(file, 'utf8');

  // 1. 特殊修复 viscosity
  if (slug === 'viscosity-unit-converter') {
    code = code.replace("'pas':1", "'pas':1,'pa.s':1");
    code = code.replace(/from=inputs\[1\]\.toLowerCase\(\),to=inputs\[2\]\.toLowerCase\(\)/, 
      "from=(inputs[1]||'').toLowerCase().trim(),to=(inputs[2]||'').toLowerCase().trim()");
  }

  // 2. 特殊修复 temperature
  if (slug === 'temperature-unit-converter') {
    code = code.replace(
      /from=inputs\[1\],to=inputs\[2\];/,
      "from=(inputs[1]||'C').toUpperCase().trim(),to=(inputs[2]||'F').toUpperCase().trim();"
    );
  }

  // 3. 通用修复 .toLowerCase().trim()
  code = code.replace(
    /from=inputs\[1\],to=inputs\[2\];/g,
    "from=(inputs[1]||'').toLowerCase().trim(),to=(inputs[2]||'').toLowerCase().trim();"
  );

  fs.writeFileSync(file, code, 'utf8');
  console.log(`Updated formulas for ${slug}`);
}
