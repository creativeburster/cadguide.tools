/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 43 Master E2E Suite (#211-#215, skipping nanocad-shortcuts-sheet & nx-shortcuts-sheet):
 * 211. natural-frequency-calculator
 * 212. notch-stress-calculator
 * 213. oee-calculator
 * 214. ohms-law-calculator
 * 215. online-3d-cad-viewer-collaborator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B43_TERMS = [
  'ASME Boiler',
  'EN 13906',
  'ASTM E8',
  'FKM Analytical',
  'SEMI E10',
  'ISO 286-1',
  'DIN 6935',
  'NFPA 70',
  'IEEE Std 1584',
  'IPC-2221',
  'ISO 16739-1',
  'ISO 19650',
  'Cloud 3D CAD/BIM Multi-User Viewer & Mockup Portal',
  'Best Cloud 3D CAD/BIM Viewers',
];

function parseNumeric(text) {
  const cleaned = String(text || '').replace(/,/g, '').trim();
  const m = cleaned.match(/-?\d+(?:\.\d+)?/);
  assert(m, `Expected numeric value in "${text}"`);
  return parseFloat(m[0]);
}

function approx(actualText, expected, label) {
  const actual = parseNumeric(actualText);
  const diff = Math.abs(actual - expected);
  const bound = Math.max(Math.abs(expected) * TOL, 1e-4);
  assert(diff <= bound, `${label}: expected ${expected} (+/-${bound}), got ${actual}`);
}

async function assertNoNan(main, label) {
  const body = await main.innerText();
  assert(!/\bNaN\b|\bInfinity\b/i.test(body), `${label}: contains NaN/Infinity`);
}

function assertAscii(text, label) {
  for (let i = 0; i < text.length; i++) {
    assert(text.charCodeAt(i) <= 127, `${label}: non-ASCII char code ${text.charCodeAt(i)} at index ${i}`);
  }
}

async function readDownloadText(download) {
  const p = await download.path();
  return fs.readFileSync(p, 'utf8');
}

async function openToolPage(page, url, waitSelector) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector(waitSelector, { timeout: 15000 });
  await page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      return Object.keys(el).some((k) => k.startsWith('__reactProps$') || k.startsWith('__reactFiber$'));
    },
    waitSelector,
    { timeout: 15000 }
  );
}

async function verifyNegativeTerms(page, terms, label) {
  const scopedText = await page.evaluate(() => {
    const mains = document.querySelectorAll('main');
    const mainEl = mains[mains.length - 1];
    if (!mainEl) return '';
    const clone = mainEl.cloneNode(true);
    clone
      .querySelectorAll('a[href^="/toolbox/"], a[href^="/compare/"], a[href^="/convert/"]')
      .forEach((el) => el.remove());
    return clone.textContent || '';
  });
  for (const term of terms) {
    assert(!scopedText.includes(term), `${label}: forbidden term "${term}" present`);
  }
}

async function assertZeroNumberInputs(main, label) {
  const cnt = await main.locator('input[type="number"]').count();
  assert.strictEqual(cnt, 0, `${label}: found ${cnt} <input type="number">`);
}

async function assertClipboardRejectSafe(page, main, label) {
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('denied')) },
    });
  });
  await main.locator('[data-testid="btn-copy"]').click();
  await page.waitForTimeout(50);
  const copyTxt = await main.locator('[data-testid="btn-copy"]').innerText();
  assert(!/Copied/i.test(copyTxt), `${label}: btn-copy must not show Copied on rejection`);
  await assertNoNan(main, `${label} clipboard-reject`);
}

async function runTests() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('response', (res) => {
    if (res.status() >= 400 && !res.url().includes('favicon')) {
      failedRequests.push(`${res.status()} ${res.url()}`);
    }
  });

  // 211. natural-frequency-calculator
  {
    const label = '211 natural-frequency-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/natural-frequency-calculator`, '[data-testid="select-mode"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B43_TERMS, label);

    // Default spring: k=10000, m=10 -> wn=31.6227766, fn=5.032921, T=0.1986918
    approx(await main.locator('[data-testid="out-fn"]').innerText(), 5.032921, `${label} default fn`);
    approx(await main.locator('[data-testid="out-wn"]').innerText(), 31.622777, `${label} default wn`);
    approx(await main.locator('[data-testid="out-period"]').innerText(), 0.198692, `${label} default T`);
    approx(await main.locator('[data-testid="out-defl"]').innerText(), 9.80665, `${label} default static defl`);

    // Cantilever: E=200 GPa, I=120 cm4, L=1.5 m, m=25 kg -> k_eq = 213333.3333, fn = 14.702104
    await main.locator('[data-testid="select-mode"]').selectOption('cantilever');
    await main.locator('[data-testid="input-modulus"]').fill('200');
    await main.locator('[data-testid="input-inertia"]').fill('120');
    await main.locator('[data-testid="input-length"]').fill('1.5');
    await main.locator('[data-testid="input-mass"]').fill('25');
    approx(await main.locator('[data-testid="out-keq"]').innerText(), 213333.3333, `${label} cantilever keq`);
    approx(await main.locator('[data-testid="out-fn"]').innerText(), 14.702104, `${label} cantilever fn`);

    // Simply supported same inputs -> k_eq = 3413333.3333, fn = 58.808415
    await main.locator('[data-testid="select-mode"]').selectOption('simply_supported');
    approx(await main.locator('[data-testid="out-keq"]').innerText(), 3413333.3333, `${label} ss keq`);
    approx(await main.locator('[data-testid="out-fn"]').innerText(), 58.808415, `${label} ss fn`);

    // Empty mass validation
    await main.locator('[data-testid="input-mass"]').fill('');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} empty mass`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-fn"]').innerText(), 5.032921, `${label} reset`);
    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('5.0329'), `${label} CSV content missing fn`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 212. notch-stress-calculator
  {
    const label = '212 notch-stress-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/notch-stress-calculator`, '[data-testid="input-nominal"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B43_TERMS, label);

    // Default: s=100, a=2, r=0.5, rho*=0.5 -> Kt=5, smax=500, q=0.5, Kf=3, seff=300
    approx(await main.locator('[data-testid="out-kt"]').innerText(), 5.0, `${label} default Kt`);
    approx(await main.locator('[data-testid="out-smax"]').innerText(), 500.0, `${label} default smax`);
    approx(await main.locator('[data-testid="out-q"]').innerText(), 0.5, `${label} default q`);
    approx(await main.locator('[data-testid="out-kf"]').innerText(), 3.0, `${label} default Kf`);

    // Asymmetric r != rho* check: s=120, a=2.25, r=0.25, rho*=1 -> Kt=7, q=1/(1+2)=0.33333, Kf=3, seff=360
    await main.locator('[data-testid="input-nominal"]').fill('120');
    await main.locator('[data-testid="input-depth"]').fill('2.25');
    await main.locator('[data-testid="input-radius"]').fill('0.25');
    await main.locator('[data-testid="input-rho-star"]').fill('1');
    approx(await main.locator('[data-testid="out-kt"]').innerText(), 7.0, `${label} asym Kt`);
    approx(await main.locator('[data-testid="out-smax"]').innerText(), 840.0, `${label} asym smax`);
    approx(await main.locator('[data-testid="out-q"]').innerText(), 0.333333, `${label} asym q`);
    approx(await main.locator('[data-testid="out-kf"]').innerText(), 3.0, `${label} asym Kf`);
    approx(await main.locator('[data-testid="out-seff"]').innerText(), 360.0, `${label} asym seff`);

    // Empty radius validation
    await main.locator('[data-testid="input-radius"]').fill('');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} empty radius`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-kt"]').innerText(), 5.0, `${label} reset`);
    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('500.000000'), `${label} CSV missing sigma_max`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 213. oee-calculator
  {
    const label = '213 oee-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/oee-calculator`, '[data-testid="input-shift-hours"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B43_TERMS, label);

    // Default: A=89.2857, P=93.3333, Q=96.6667, OEE=80.5556
    approx(await main.locator('[data-testid="out-availability"]').innerText(), 89.2857, `${label} default A`);
    approx(await main.locator('[data-testid="out-performance"]').innerText(), 93.3333, `${label} default P`);
    approx(await main.locator('[data-testid="out-quality"]').innerText(), 96.6667, `${label} default Q`);
    approx(await main.locator('[data-testid="out-oee"]').innerText(), 80.5556, `${label} default OEE`);

    // Modified: 10h, 0 breaks, 60 downtime, 15s cycle, 1800 total, 90 defects -> A=90, P=83.3333, Q=95, OEE=71.25
    await main.locator('[data-testid="input-shift-hours"]').fill('10');
    await main.locator('[data-testid="input-breaks"]').fill('0');
    await main.locator('[data-testid="input-downtime"]').fill('60');
    await main.locator('[data-testid="input-ideal-cycle"]').fill('15');
    await main.locator('[data-testid="input-total-units"]').fill('1800');
    await main.locator('[data-testid="input-defects"]').fill('90');
    approx(await main.locator('[data-testid="out-availability"]').innerText(), 90.0, `${label} mod A`);
    approx(await main.locator('[data-testid="out-performance"]').innerText(), 83.3333, `${label} mod P`);
    approx(await main.locator('[data-testid="out-quality"]').innerText(), 95.0, `${label} mod Q`);
    approx(await main.locator('[data-testid="out-oee"]').innerText(), 71.25, `${label} mod OEE`);

    // Defects > total error
    await main.locator('[data-testid="input-defects"]').fill('2000');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} defects>total`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-oee"]').innerText(), 80.5556, `${label} reset`);
    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('80.555556'), `${label} CSV missing OEE`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 214. ohms-law-calculator
  {
    const label = '214 ohms-law-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/ohms-law-calculator`, '[data-testid="select-pair"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B43_TERMS, label);

    // Default V=12, R=4 -> I=3, P=36, G=0.25
    approx(await main.locator('[data-testid="out-voltage"]').innerText(), 12.0, `${label} default V`);
    approx(await main.locator('[data-testid="out-current"]').innerText(), 3.0, `${label} default I`);
    approx(await main.locator('[data-testid="out-resistance"]').innerText(), 4.0, `${label} default R`);
    approx(await main.locator('[data-testid="out-power"]').innerText(), 36.0, `${label} default P`);
    approx(await main.locator('[data-testid="out-conductance"]').innerText(), 0.25, `${label} default G`);

    // Switch to P_R: P=500, R=20 -> I=5, V=100, G=0.05
    await main.locator('[data-testid="select-pair"]').selectOption('P_R');
    await main.locator('[data-testid="input-val1"]').fill('500');
    await main.locator('[data-testid="input-val2"]').fill('20');
    approx(await main.locator('[data-testid="out-voltage"]').innerText(), 100.0, `${label} PR V`);
    approx(await main.locator('[data-testid="out-current"]').innerText(), 5.0, `${label} PR I`);
    approx(await main.locator('[data-testid="out-conductance"]').innerText(), 0.05, `${label} PR G`);

    // Zero validation
    await main.locator('[data-testid="input-val2"]').fill('0');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} zero input`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-power"]').innerText(), 36.0, `${label} reset`);
    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('36.000000'), `${label} CSV missing Power`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 215. online-3d-cad-viewer-collaborator
  {
    const label = '215 online-3d-cad-viewer-collaborator';
    await openToolPage(page, `${BASE_URL}/toolbox/online-3d-cad-viewer-collaborator`, '[data-testid="input-cad-source"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B43_TERMS, label);

    // Default STEP AP214 sample -> 8 entities, 1 top-level MANIFOLD_SOLID_BREP node
    assert((await main.locator('[data-testid="out-format"]').innerText()).includes('ISO-10303-21'), `${label} STEP format`);
    assert((await main.locator('[data-testid="out-schema"]').innerText()).includes('AUTOMOTIVE_DESIGN'), `${label} STEP schema`);
    approx(await main.locator('[data-testid="out-primary-count"]').innerText(), 8, `${label} STEP entities`);
    approx(await main.locator('[data-testid="out-secondary-count"]').innerText(), 1, `${label} STEP solids`);

    // ASCII STL preset: 4 facets, 12 vertices, 20x10x5
    await main.locator('[data-testid="preset-stl-wedge"]').click();
    assert((await main.locator('[data-testid="out-format"]').innerText()).includes('ASCII STL'), `${label} STL format`);
    approx(await main.locator('[data-testid="out-primary-count"]').innerText(), 4, `${label} STL facets`);
    approx(await main.locator('[data-testid="out-secondary-count"]').innerText(), 12, `${label} STL verts`);
    approx(await main.locator('[data-testid="out-span-x"]').innerText(), 20.0, `${label} STL spanX`);
    approx(await main.locator('[data-testid="out-span-y"]').innerText(), 10.0, `${label} STL spanY`);
    approx(await main.locator('[data-testid="out-span-z"]').innerText(), 5.0, `${label} STL spanZ`);

    // Wavefront OBJ preset: 5 v, 6 f, 10x10x8
    await main.locator('[data-testid="preset-obj-pyramid"]').click();
    assert((await main.locator('[data-testid="out-format"]').innerText()).includes('Wavefront OBJ'), `${label} OBJ format`);
    approx(await main.locator('[data-testid="out-primary-count"]').innerText(), 5, `${label} OBJ verts`);
    approx(await main.locator('[data-testid="out-secondary-count"]').innerText(), 6, `${label} OBJ faces`);
    approx(await main.locator('[data-testid="out-span-x"]').innerText(), 10.0, `${label} OBJ spanX`);
    approx(await main.locator('[data-testid="out-span-z"]').innerText(), 8.0, `${label} OBJ spanZ`);

    // Empty text validation
    await main.locator('[data-testid="input-cad-source"]').fill('');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} empty source`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-primary-count"]').innerText(), 8, `${label} reset`);
    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('ISO-10303-21'), `${label} CSV missing STEP`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  await browser.close();
  assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
  assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
  assert.strictEqual(failedRequests.length, 0, `HTTP >=400 requests: ${failedRequests.join('; ')}`);
  console.log('ALL BATCH 43 E2E ASSERTIONS PASSED');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
