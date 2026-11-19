/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 61 Master E2E Suite:
 * 1. settlement-calculator
 * 2. shaft-critical-speed-calculator
 * 3. shaft-diameter-calculator
 * 4. shaft-torsion-stress-calculator
 * 5. sheet-cutting-layout-calculator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B61_TERMS = [
  'Eurocode 7',
  'EN 1997',
  'FHWA',
  'ASTM D1557',
  'ASTM D2487',
  'AASHTO',
  'ASME B106.1M',
  'DIN 6885',
  'ISO 773',
  'ISO 1940',
  'ISO 286-1',
  'ASME Y14.5',
  'DIN 6935',
  'ISO 2768',
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

async function verifyNoBannedAndNoNumberInput(page, terms, label) {
  const typeCount = await page.locator('input[type="number"], input[type="range"]').count();
  assert.strictEqual(typeCount, 0, `${label}: found input[type="number"] or input[type="range"]`);
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
    assert(!scopedText.includes(term), `${label}: banned term found -> "${term}"`);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));

  try {
    // 1. settlement-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/settlement-calculator`, '[data-testid="input-q"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B61_TERMS, 'settlement-calculator');
    approx(await page.locator('[data-testid="output-settlement"]').innerText(), 10.192, 'settlement default');
    await page.fill('[data-testid="input-q"]', '300');
    await page.fill('[data-testid="input-b"]', '3');
    await page.fill('[data-testid="input-v"]', '0.25');
    await page.fill('[data-testid="input-e"]', '30');
    await page.fill('[data-testid="input-iw"]', '0.82');
    approx(await page.locator('[data-testid="output-settlement"]').innerText(), 23.0625, 'settlement modified');
    const [dl1] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv1 = await readDownloadText(dl1);
    assertAscii(csv1, 'settlement csv');
    assert(csv1.includes('23.062500'), 'settlement csv value');
    await page.fill('[data-testid="input-q"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(page.locator('main').last(), 'settlement empty');
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-settlement"]').innerText(), 10.192, 'settlement reset');
    console.log('[PASS] 1. settlement-calculator');

    // 2. shaft-critical-speed-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/shaft-critical-speed-calculator`, '[data-testid="input-k"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B61_TERMS, 'shaft-critical-speed-calculator');
    approx(await page.locator('[data-testid="output-nc"]').innerText(), 1350.474474, 'crit speed default Nc');
    approx(await page.locator('[data-testid="output-fn"]').innerText(), 22.507908, 'crit speed default fn');
    approx(await page.locator('[data-testid="output-deflection"]').innerText(), 0.490332, 'crit speed default deflection');
    await page.fill('[data-testid="input-k"]', '250000');
    await page.fill('[data-testid="input-m"]', '10');
    approx(await page.locator('[data-testid="output-nc"]').innerText(), 1509.876363, 'crit speed mod Nc');
    approx(await page.locator('[data-testid="output-fn"]').innerText(), 25.164606, 'crit speed mod fn');
    const [dl2] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv2 = await readDownloadText(dl2);
    assertAscii(csv2, 'crit speed csv');
    assert(csv2.includes('1509.876'), 'crit speed csv value');
    await page.fill('[data-testid="input-k"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(page.locator('main').last(), 'crit speed empty');
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-nc"]').innerText(), 1350.474474, 'crit speed reset');
    console.log('[PASS] 2. shaft-critical-speed-calculator');

    // 3. shaft-diameter-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/shaft-diameter-calculator`, '[data-testid="input-torque"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B61_TERMS, 'shaft-diameter-calculator');
    approx(await page.locator('[data-testid="output-d-solid"]').innerText(), 39.929454, 'shaft dia default solid');
    approx(await page.locator('[data-testid="output-d-keyed"]').innerText(), 43.948051, 'shaft dia default keyed');
    approx(await page.locator('[data-testid="output-d-ceil"]').innerText(), 44, 'shaft dia default ceil');
    await page.fill('[data-testid="input-torque"]', '1000');
    await page.fill('[data-testid="input-tau"]', '50');
    await page.fill('[data-testid="input-kw"]', '0.80');
    approx(await page.locator('[data-testid="output-d-solid"]').innerText(), 46.701773, 'shaft dia mod solid');
    approx(await page.locator('[data-testid="output-d-keyed"]').innerText(), 50.307960, 'shaft dia mod keyed');
    approx(await page.locator('[data-testid="output-d-ceil"]').innerText(), 51, 'shaft dia mod ceil');
    const [dl3] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv3 = await readDownloadText(dl3);
    assertAscii(csv3, 'shaft dia csv');
    assert(csv3.includes('50.307960'), 'shaft dia csv value');
    await page.fill('[data-testid="input-torque"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(page.locator('main').last(), 'shaft dia empty');
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-d-keyed"]').innerText(), 43.948051, 'shaft dia reset');
    console.log('[PASS] 3. shaft-diameter-calculator');

    // 4. shaft-torsion-stress-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/shaft-torsion-stress-calculator`, '[data-testid="input-outer-dia"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B61_TERMS, 'shaft-torsion-stress-calculator');
    approx(await page.locator('[data-testid="output-j"]').innerText(), 251327.4, 'torsion default J');
    approx(await page.locator('[data-testid="output-shear"]').innerText(), 7.958, 'torsion default shear');
    approx(await page.locator('[data-testid="output-twist"]').innerText(), 0.1480, 'torsion default twist');
    approx(await page.locator('[data-testid="output-sf"]').innerText(), 18.138, 'torsion default SF');
    await page.click('[data-testid="type-hollow"]');
    await page.fill('[data-testid="input-outer-dia"]', '50');
    await page.fill('[data-testid="input-inner-dia"]', '30');
    await page.fill('[data-testid="input-length"]', '1000');
    await page.click('[data-testid="mode-power"]');
    await page.fill('[data-testid="input-power"]', '15');
    await page.fill('[data-testid="input-rpm"]', '1500');
    approx(await page.locator('[data-testid="output-torque"]').innerText(), 95.493, 'torsion mod T');
    approx(await page.locator('[data-testid="output-j"]').innerText(), 534070.8, 'torsion mod J');
    approx(await page.locator('[data-testid="output-shear"]').innerText(), 4.470, 'torsion mod shear');
    approx(await page.locator('[data-testid="output-twist"]').innerText(), 0.1330, 'torsion mod twist');
    approx(await page.locator('[data-testid="output-sf"]').innerText(), 32.290, 'torsion mod SF');
    const [dl4] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv4 = await readDownloadText(dl4);
    assertAscii(csv4, 'torsion csv');
    assert(csv4.includes('4.470052'), 'torsion csv shear');
    await page.fill('[data-testid="input-outer-dia"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(page.locator('main').last(), 'torsion empty');
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-shear"]').innerText(), 7.958, 'torsion reset');
    console.log('[PASS] 4. shaft-torsion-stress-calculator');

    // 5. sheet-cutting-layout-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/sheet-cutting-layout-calculator`, '[data-testid="input-sheet-width"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B61_TERMS, 'sheet-cutting-layout-calculator');
    approx(await page.locator('[data-testid="output-nr"]').innerText(), 4, 'sheet 2d default nr');
    approx(await page.locator('[data-testid="output-nc"]').innerText(), 6, 'sheet 2d default nc');
    approx(await page.locator('[data-testid="output-total-parts"]').innerText(), 24, 'sheet 2d default N');
    approx(await page.locator('[data-testid="output-utilization"]').innerText(), 72.0, 'sheet 2d default util');
    approx(await page.locator('[data-testid="output-rot-total"]').innerText(), 27, 'sheet 2d default rotN');
    approx(await page.locator('[data-testid="output-rot-util"]').innerText(), 81.0, 'sheet 2d default rotUtil');
    await page.click('[data-testid="preset-1220x2440"]');
    approx(await page.locator('[data-testid="output-nr"]').innerText(), 4, 'sheet 2d preset nr');
    approx(await page.locator('[data-testid="output-nc"]').innerText(), 5, 'sheet 2d preset nc');
    approx(await page.locator('[data-testid="output-total-parts"]').innerText(), 20, 'sheet 2d preset N');
    approx(await page.locator('[data-testid="output-utilization"]').innerText(), 84.655, 'sheet 2d preset util');
    const [dl5a] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv5a = await readDownloadText(dl5a);
    assertAscii(csv5a, 'sheet 2d csv');
    assert(csv5a.includes('84.655'), 'sheet 2d csv util');
    await page.fill('[data-testid="input-sheet-width"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(page.locator('main').last(), 'sheet 2d empty');
    await page.click('[data-testid="btn-reset-sheet"]');
    approx(await page.locator('[data-testid="output-total-parts"]').innerText(), 24, 'sheet 2d reset');

    // Switch to 1D Bar mode
    await page.click('[data-testid="tab-1d-bar"]');
    await page.waitForSelector('[data-testid="output-total-bars"]');
    approx(await page.locator('[data-testid="output-total-bars"]').innerText(), 4, 'sheet 1d default bars');
    approx(await page.locator('[data-testid="output-bar-pieces"]').innerText(), 18, 'sheet 1d default pieces');
    approx(await page.locator('[data-testid="output-bar-yield"]').innerText(), 82.5, 'sheet 1d default yield');
    const [dl5b] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-bar-csv-btn"]'),
    ]);
    const csv5b = await readDownloadText(dl5b);
    assertAscii(csv5b, 'sheet 1d csv');
    assert(csv5b.includes('Bar 1'), 'sheet 1d csv bar');
    console.log('[PASS] 5. sheet-cutting-layout-calculator');

    assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
    assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
    console.log('BATCH 61 ALL 5 TOOLS PASSED');
  } finally {
    await context.close();
    await browser.close();
  }
})();
