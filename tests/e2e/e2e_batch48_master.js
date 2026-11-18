/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 48 Master E2E Suite (#236-#240, skipping onshape-shortcuts-sheet):
 * 236. online-step-to-obj-gltf-converter
 * 237. online-step-to-stl-slicer-helper
 * 238. orifice-flow-calculator
 * 239. paint-coverage-calculator
 * 240. paint-quantity-calculator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B48_TERMS = [
  'CloudReferralClient',
  'Best Online',
  'ISO/ASTM 52900',
  'AIA CAD Layer Guidelines',
  'ISO 19650',
  'Crane Technical Paper No. 410',
  'ASME B31.3',
  'ANSI/HI 9.6.1',
  'ACI 318-19',
  'Eurocode 2',
  'IBC 2024',
  'ASCE 7-22',
  'ADA 2010',
  '9.9',
];

function parseNumeric(text) {
  const cleaned = String(text || '').replace(/,/g, '').trim();
  const m = cleaned.match(/[+-]?\d+(?:\.\d+)?/);
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

  // 236. online-step-to-obj-gltf-converter
  {
    const label = '236 online-step-to-obj-gltf-converter';
    await openToolPage(page, `${BASE_URL}/toolbox/online-step-to-obj-gltf-converter`, '[data-testid="input-radius"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B48_TERMS, label);

    approx(await main.locator('[data-testid="out-segments"]').innerText(), 50, `${label} default segments`);
    approx(await main.locator('[data-testid="out-actual-err"]').innerText(), 0.049334, `${label} default actual err`);
    approx(await main.locator('[data-testid="out-gltf-bytes"]').innerText(), 1720000, `${label} default gltf bytes`);
    approx(await main.locator('[data-testid="out-gltf-mb"]').innerText(), 1.6403, `${label} default gltf mb`);

    await main.locator('[data-testid="preset-fine-precision"]').click();
    approx(await main.locator('[data-testid="out-segments"]').innerText(), 158, `${label} fine segments`);
    approx(await main.locator('[data-testid="out-actual-err"]').innerText(), 0.004942, `${label} fine actual err`);
    approx(await main.locator('[data-testid="out-gltf-bytes"]').innerText(), 6240000, `${label} fine gltf bytes`);

    await main.locator('[data-testid="input-chord"]').fill('25');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} chord >= R`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-segments"]').innerText(), 50, `${label} reset`);

    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('Binary glTF Buffer Bytes,1720000,bytes'), `${label} CSV missing bytes`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 237. online-step-to-stl-slicer-helper
  {
    const label = '237 online-step-to-stl-slicer-helper';
    await openToolPage(page, `${BASE_URL}/toolbox/online-step-to-stl-slicer-helper`, '[data-testid="input-radius"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B48_TERMS, label);

    approx(await main.locator('[data-testid="out-segments"]').innerText(), 71, `${label} default segments`);
    approx(await main.locator('[data-testid="out-cusp"]').innerText(), 0.141421, `${label} default cusp`);
    approx(await main.locator('[data-testid="out-stl-bytes"]').innerText(), 1000084, `${label} default bytes`);
    approx(await main.locator('[data-testid="out-stl-mb"]').innerText(), 0.9538, `${label} default mb`);

    await main.locator('[data-testid="preset-sla-fine"]').click();
    approx(await main.locator('[data-testid="out-segments"]').innerText(), 141, `${label} sla segments`);
    approx(await main.locator('[data-testid="out-cusp"]').innerText(), 0.043301, `${label} sla cusp`);
    approx(await main.locator('[data-testid="out-stl-bytes"]').innerText(), 4000084, `${label} sla bytes`);

    await main.locator('[data-testid="input-slope"]').fill('90');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} slope >= 90`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-segments"]').innerText(), 71, `${label} reset`);

    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('Binary STL File Bytes,1000084,bytes'), `${label} CSV missing STL bytes`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 238. orifice-flow-calculator
  {
    const label = '238 orifice-flow-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/orifice-flow-calculator`, '[data-testid="input-pipe-dia"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B48_TERMS, label);

    approx(await main.locator('[data-testid="out-flow-ls"]').innerText(), 5.6224, `${label} default Q`);
    approx(await main.locator('[data-testid="out-mass-kgs"]').innerText(), 5.6224, `${label} default mDot`);
    approx(await main.locator('[data-testid="out-velocity"]').innerText(), 0.7159, `${label} default v`);
    approx(await main.locator('[data-testid="out-beta"]').innerText(), 0.5, `${label} default beta`);

    await main.locator('[data-testid="preset-air-duct"]').click();
    approx(await main.locator('[data-testid="out-flow-ls"]').innerText(), 477.3366, `${label} air Q`);
    approx(await main.locator('[data-testid="out-mass-kgs"]').innerText(), 0.5728, `${label} air mDot`);
    approx(await main.locator('[data-testid="out-velocity"]').innerText(), 15.1941, `${label} air v`);
    approx(await main.locator('[data-testid="out-beta"]').innerText(), 0.6, `${label} air beta`);

    await main.locator('[data-testid="input-orifice-dia"]').fill('200');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} d >= D`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-flow-ls"]').innerText(), 5.6224, `${label} reset`);

    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('Diameter Ratio Beta,0.500000,ratio'), `${label} CSV missing beta`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 239. paint-coverage-calculator
  {
    const label = '239 paint-coverage-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/paint-coverage-calculator`, '[data-testid="input-area"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B48_TERMS, label);

    approx(await main.locator('[data-testid="out-spread"]').innerText(), 10.0, `${label} default spread`);
    approx(await main.locator('[data-testid="out-wft"]').innerText(), 100.0, `${label} default wft`);
    approx(await main.locator('[data-testid="out-total-liters"]').innerText(), 22.0, `${label} default liters`);
    approx(await main.locator('[data-testid="out-cost"]').innerText(), 330.0, `${label} default cost`);

    await main.locator('[data-testid="preset-epoxy-steel"]').click();
    approx(await main.locator('[data-testid="out-spread"]').innerText(), 5.2, `${label} epoxy spread`);
    approx(await main.locator('[data-testid="out-wft"]').innerText(), 192.3077, `${label} epoxy wft`);
    approx(await main.locator('[data-testid="out-total-liters"]').innerText(), 115.385, `${label} epoxy liters`);
    approx(await main.locator('[data-testid="out-cost"]').innerText(), 3230.77, `${label} epoxy cost`);

    await main.locator('[data-testid="input-vs"]').fill('101');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} VS > 100`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-cost"]').innerText(), 330.0, `${label} reset`);

    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('Estimated Cost,330.00,USD'), `${label} CSV missing cost`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 240. paint-quantity-calculator
  {
    const label = '240 paint-quantity-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/paint-quantity-calculator`, '[data-testid="input-gross"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B48_TERMS, label);

    approx(await main.locator('[data-testid="out-net-area"]').innerText(), 50.0, `${label} default net area`);
    approx(await main.locator('[data-testid="out-liters"]').innerText(), 10.5, `${label} default liters`);
    approx(await main.locator('[data-testid="out-cans"]').innerText(), 3, `${label} default cans`);

    await main.locator('[data-testid="preset-large-hall"]').click();
    approx(await main.locator('[data-testid="out-net-area"]').innerText(), 280.0, `${label} hall net area`);
    approx(await main.locator('[data-testid="out-liters"]').innerText(), 55.0, `${label} hall liters`);
    approx(await main.locator('[data-testid="out-cans"]').innerText(), 3, `${label} hall cans`);

    await main.locator('[data-testid="input-openings"]').fill('320');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} openings >= gross`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-liters"]').innerText(), 10.5, `${label} reset`);

    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('Containers Needed,3,cans'), `${label} CSV missing cans`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  await browser.close();
  assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
  assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
  assert.strictEqual(failedRequests.length, 0, `Failed requests: ${failedRequests.join('; ')}`);
  console.log('ALL BATCH 48 E2E TESTS PASSED!');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
