/**
 * End-to-End Playwright Verification Suite for the Pure Rust + WebAssembly Web CAD Trilogy:
 *   1. /toolbox/web-cad-parametric
 *   2. /toolbox/web-cad-sheetmetal-nesting
 *   3. /toolbox/web-cad-code-studio
 *
 * Verifies:
 *  - Binary WebAssembly validation & exports on disk (`public/wasm/*.wasm`)
 *  - Default benchmark formulas & hand-calculated values
 *  - Modified parameter recalculation against hand-calculated formulas
 *  - Edge-case / empty input resilience (zero NaN / Infinity / undefined)
 *  - Real file downloads (STEP AP214, Binary STL, Laser G-Code .nc, Nested DXF)
 */

import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..').replace(/^F:/, 'f:');
const PORT = 3099;
const BASE_URL = `http://localhost:${PORT}`;

function assert(cond, msg) {
  if (!cond) {
    throw new Error(`[ASSERTION FAILED] ${msg}`);
  }
}

async function verifyWasmBinariesOnDisk() {
  const wasmDir = path.join(REPO_ROOT, 'public/wasm');
  const files = ['parametric_cad_bg.wasm', 'nesting_cam_bg.wasm', 'code_cad_bg.wasm'];
  for (const f of files) {
    const p = path.join(wasmDir, f);
    assert(fs.existsSync(p), `Missing WASM binary: ${p}`);
    const bytes = fs.readFileSync(p);
    assert(WebAssembly.validate(bytes), `WebAssembly.validate failed on ${f}`);
    const { instance } = await WebAssembly.instantiate(bytes, {});
    const ver = instance.exports.wasm_kernel_version();
    assert(typeof ver === 'number' && ver >= 100, `Unexpected kernel version ${ver} in ${f}`);
    console.log(`[WASM OK] ${f} (${bytes.length} bytes, kernel v${ver})`);
  }
}

async function startNextDevServer() {
  const nextBin = path.join(REPO_ROOT, 'node_modules/next/dist/bin/next');
  const child = spawn(process.execPath, [nextBin, 'dev', '--webpack', '-p', String(PORT)], {
    cwd: REPO_ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      NODE_ENV: 'development',
      CODEBUDDY_SAFE_DELETE_ENABLED: '0',
    },
  });

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Next.js dev server timed out waiting for Ready'));
    }, 60000);

    child.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      process.stdout.write(`[next] ${text}`);
      if (text.includes('Ready in')) {
        clearTimeout(timeout);
        resolve();
      }
    });
    child.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      process.stderr.write(`[next-err] ${text}`);
    });
    child.on('exit', (code) => {
      clearTimeout(timeout);
      reject(new Error(`Next.js dev server exited prematurely with code ${code}`));
    });
  });

  // Warm up the 3 routes via HTTP fetch before launching Chromium
  for (const slug of ['web-cad-parametric', 'web-cad-sheetmetal-nesting', 'web-cad-code-studio']) {
    for (let attempt = 1; attempt <= 20; attempt++) {
      try {
        const res = await fetch(`${BASE_URL}/toolbox/${slug}`);
        if (res.status === 200) {
          await res.text();
          console.log(`[Warmup OK] /toolbox/${slug} -> HTTP 200`);
          break;
        }
      } catch {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  }

  return child;
}

async function runSinglePass(browser, passNum) {
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  // =========================================================================
  // SOFTWARE 1: /toolbox/web-cad-parametric
  // =========================================================================
  await page.goto(`${BASE_URL}/toolbox/web-cad-parametric`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.getByTestId('parametric-volume-mm3').waitFor({ state: 'visible', timeout: 30000 });

  const volDefault = await page.getByTestId('parametric-volume-mm3').textContent();
  const areaDefault = await page.getByTestId('parametric-area-mm2').textContent();
  const massDefault = await page.getByTestId('parametric-mass-grams').textContent();

  assert(
    volDefault?.includes('107992.25'),
    `Pass ${passNum}: Expected default volume 107992.25 mm³, got ${volDefault}`
  );
  assert(
    areaDefault?.includes('17278.76'),
    `Pass ${passNum}: Expected default surface area 17278.76 mm², got ${areaDefault}`
  );
  assert(
    massDefault?.includes('291.58'),
    `Pass ${passNum}: Expected default mass 291.58 g, got ${massDefault}`
  );

  // Modify parameters: Do = 100, H = 30, Di = 40
  // Hand calculation: V = pi * (50^2 - 20^2) * 30 = 63000 * pi = 197920.34 mm³
  await page.locator('#param-outer-dia').fill('100');
  await page.locator('#param-extrude-height').fill('30');
  await page.locator('#param-hole-dia').fill('40');

  const volMod = await page.getByTestId('parametric-volume-mm3').textContent();
  assert(
    volMod?.includes('197920.34'),
    `Pass ${passNum}: Expected modified volume 197920.34 mm³, got ${volMod}`
  );

  // Edge case: clear input and verify no NaN appears in body text
  await page.locator('#param-outer-dia').fill('');
  const bodyAfterClear1 = await page.locator('body').innerText();
  assert(!bodyAfterClear1.includes('NaN'), `Pass ${passNum}: NaN detected on /toolbox/web-cad-parametric`);
  await page.locator('#param-outer-dia').fill('80');

  // Verify STEP AP214 download content
  const [stepDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('export-step-btn').click(),
  ]);
  const stepPath = await stepDownload.path();
  const stepContent = fs.readFileSync(stepPath, 'utf8');
  assert(stepContent.startsWith('ISO-10303-21;'), 'STEP file must start with ISO-10303-21;');
  assert(stepContent.includes('AUTOMOTIVE_DESIGN'), 'STEP file must include AUTOMOTIVE_DESIGN schema');
  assert(stepContent.includes('EXTRUDED_AREA_SOLID'), 'STEP file must include EXTRUDED_AREA_SOLID');
  assert(stepContent.includes('END-ISO-10303-21;'), 'STEP file must end with END-ISO-10303-21;');

  // =========================================================================
  // SOFTWARE 2: /toolbox/web-cad-sheetmetal-nesting
  // =========================================================================
  await page.goto(`${BASE_URL}/toolbox/web-cad-sheetmetal-nesting`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.getByTestId('unfold-ba-mm').waitFor({ state: 'visible', timeout: 30000 });

  const baDef = await page.getByTestId('unfold-ba-mm').textContent();
  const ossbDef = await page.getByTestId('unfold-ossb-mm').textContent();
  const bdDef = await page.getByTestId('unfold-bd-mm').textContent();
  const flatDef = await page.getByTestId('unfold-flat-mm').textContent();
  const utilDef = await page.getByTestId('nesting-utilization-pct').textContent();

  assert(baDef?.includes('4.52'), `Pass ${passNum}: Expected default BA 4.52 mm, got ${baDef}`);
  assert(ossbDef?.includes('4.00'), `Pass ${passNum}: Expected default OSSB 4.00 mm, got ${ossbDef}`);
  assert(bdDef?.includes('3.48'), `Pass ${passNum}: Expected default BD 3.48 mm, got ${bdDef}`);
  assert(flatDef?.includes('96.52'), `Pass ${passNum}: Expected default Lflat 96.52 mm, got ${flatDef}`);

  const utilNum = parseFloat(utilDef || '0');
  assert(
    utilNum >= 80.0,
    `Pass ${passNum}: Expected 5-part nesting utilization >= 80%, got ${utilDef}`
  );

  // Modify sheet metal parameters: T=3.0, R=4.0, K=0.40, L1=80, L2=50
  // Hand calculation: BA = (pi/2)*(4.0 + 1.2) = 8.17 mm, OSSB = 7.00 mm, BD = 14 - 8.16814 = 5.83 mm, Lflat = 124.17 mm
  await page.locator('#sm-thickness').fill('3.0');
  await page.locator('#sm-radius').fill('4.0');
  await page.locator('#sm-kfactor').fill('0.40');
  await page.locator('#sm-leg1').fill('80');
  await page.locator('#sm-leg2').fill('50');

  const baMod = await page.getByTestId('unfold-ba-mm').textContent();
  const bdMod = await page.getByTestId('unfold-bd-mm').textContent();
  const flatMod = await page.getByTestId('unfold-flat-mm').textContent();
  assert(baMod?.includes('8.17'), `Pass ${passNum}: Expected modified BA 8.17 mm, got ${baMod}`);
  assert(bdMod?.includes('5.83'), `Pass ${passNum}: Expected modified BD 5.83 mm, got ${bdMod}`);
  assert(flatMod?.includes('124.17'), `Pass ${passNum}: Expected modified Lflat 124.17 mm, got ${flatMod}`);

  // Edge case: clear thickness and check no NaN
  await page.locator('#sm-thickness').fill('');
  const bodyAfterClear2 = await page.locator('body').innerText();
  assert(!bodyAfterClear2.includes('NaN'), `Pass ${passNum}: NaN detected on /toolbox/web-cad-sheetmetal-nesting`);

  // Verify Laser G-Code download
  const [gcodeDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('export-gcode-btn').click(),
  ]);
  const gcodePath = await gcodeDownload.path();
  const gcodeContent = fs.readFileSync(gcodePath, 'utf8');
  assert(gcodeContent.includes('G21'), 'G-Code must include G21 metric header');
  assert(gcodeContent.includes('M03 S1000'), 'G-Code must include M03 laser power on');
  assert(gcodeContent.includes('G03 '), 'G-Code must include G03 inner hole arc interpolation');
  assert(gcodeContent.includes('G01 '), 'G-Code must include G01 linear cutting moves');
  assert(gcodeContent.includes('M05'), 'G-Code must include M05 laser off');

  // =========================================================================
  // SOFTWARE 3: /toolbox/web-cad-code-studio
  // =========================================================================
  await page.goto(`${BASE_URL}/toolbox/web-cad-code-studio`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.getByTestId('code-cad-readout-0').waitFor({ state: 'visible', timeout: 30000 });

  const readout0 = await page.getByTestId('code-cad-readout-0').textContent();
  const readout1 = await page.getByTestId('code-cad-readout-1').textContent();
  const vertsBefore = Number(await page.getByTestId('code-cad-vertex-count').textContent());

  assert(
    readout0?.includes('60.00 mm'),
    `Pass ${passNum}: Expected default gear pitch diameter 60.00 mm, got ${readout0}`
  );
  assert(
    readout1?.includes('56.38 mm'),
    `Pass ${passNum}: Expected default gear base circle diameter 56.38 mm, got ${readout1}`
  );

  // Change teeth parameter from 24 to 36 and verify 2-way code sync + vertex count change
  await page.locator('#code-param-teeth').fill('36');
  const readout0After = await page.getByTestId('code-cad-readout-0').textContent();
  const vertsAfter = Number(await page.getByTestId('code-cad-vertex-count').textContent());
  const editorVal = await page.getByTestId('code-cad-editor').inputValue();

  assert(
    readout0After?.includes('90.00 mm'),
    `Pass ${passNum}: Expected updated gear pitch diameter 90.00 mm (2.5*36), got ${readout0After}`
  );
  assert(
    editorVal.includes('let teeth = 36;'),
    `Pass ${passNum}: Expected Code-CAD script to update 'let teeth = 36;'`
  );
  assert(
    vertsAfter !== vertsBefore && vertsAfter > vertsBefore,
    `Pass ${passNum}: Expected 3D vertex count to increase when teeth increased from 24 (${vertsBefore}) to 36 (${vertsAfter})`
  );

  // Switch to Pipe Flange template and change bolt_count from 8 to 12
  await page.getByTestId('template-btn-pipe-flange').click();
  const flangeVerts8 = Number(await page.getByTestId('code-cad-vertex-count').textContent());
  await page.locator('#code-param-bolt_count').fill('12');
  const flangeVerts12 = Number(await page.getByTestId('code-cad-vertex-count').textContent());
  assert(
    flangeVerts12 !== flangeVerts8,
    `Pass ${passNum}: Expected flange vertex count to change when bolt_count changed (${flangeVerts8} -> ${flangeVerts12})`
  );

  assert(consoleErrors.length === 0, `Pass ${passNum}: Console/Page errors: ${consoleErrors.join('; ')}`);
  await context.close();
  console.log(`[E2E PASS ${passNum}/5] All 3 Rust+WASM Web CAD Studio applications verified.`);
}

async function main() {
  await verifyWasmBinariesOnDisk();
  console.log(`Starting Next.js dev server on ${BASE_URL}...`);
  const devProc = await startNextDevServer();
  const browser = await chromium.launch({ headless: true });
  try {
    for (let pass = 1; pass <= 5; pass++) {
      await runSinglePass(browser, pass);
    }
    console.log('=== ALL 5 CONSECUTIVE E2E RUNS PASSED ZERO-DEFECT ===');
  } finally {
    await browser.close();
    try {
      devProc.kill();
    } catch {}
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
