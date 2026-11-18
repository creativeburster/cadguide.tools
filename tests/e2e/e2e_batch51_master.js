/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 51 Master E2E Suite (#251-#255 in sequential ledger):
 * 251. pipe-size-chart
 * 252. pipe-thermal-expansion-calculator
 * 253. planetary-gear-calculator
 * 254. plastic-shrinkage-calculator
 * 255. plate-bending-calculator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B51_TERMS = [
  'Crane Technical Paper No. 410',
  'ASME B31.3',
  'ANSI/HI 9.6.1',
  'ISO 4413',
  'EN 10220',
  'ISO 6336',
  'AGMA 2001',
  'RMA IP-20',
  'ISO 606',
  'ISO 3408',
  'ISO 286-1',
  'ASME Y14.5',
  'DIN 6935',
  'ISO 2768',
  'BPVC',
  'EN 13906',
  'ASTM E8',
  'FKM Analytical',
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
  const typeCount = await page.locator('input[type="number"]').count();
  assert.strictEqual(typeCount, 0, `${label}: found input[type="number"]`);
  const scopedText = await page.evaluate(() => {
    const mains = document.querySelectorAll('main');
    const mainEl = mains[mains.length - 1];
    return mainEl ? mainEl.innerText : '';
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
    // 1. pipe-size-chart
    await openToolPage(page, `${BASE_URL}/toolbox/pipe-size-chart`, '[data-testid="pipe-density"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B51_TERMS, 'pipe-size-chart');
    const row6s80 = await page.locator('[data-testid="pipe-row-6-s80"]').innerText();
    assert(row6s80.includes('146.34') && row6s80.includes('42.56'), `pipe-size-chart NPS 6 Sch 80 mismatch: ${row6s80}`);
    const row12s40 = await page.locator('[data-testid="pipe-row-12-s40"]').innerText();
    assert(row12s40.includes('303.23') && row12s40.includes('79.72'), `pipe-size-chart NPS 12 Sch 40 mismatch: ${row12s40}`);
    await page.fill('[data-testid="pipe-density"]', '2700');
    const row6s80Al = await page.locator('[data-testid="pipe-row-6-s80"]').innerText();
    assert(row6s80Al.includes('14.64'), `pipe-size-chart Al mass mismatch: ${row6s80Al}`);
    const [dl1] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv1 = await readDownloadText(dl1);
    assert(csv1.includes('NPS 6'), 'pipe-size-chart CSV missing NPS 6');
    assertAscii(csv1, 'pipe-size-chart CSV');
    await page.fill('[data-testid="pipe-density"]', '0');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'pipe-size-chart invalid');
    console.log('[PASS] pipe-size-chart');

    // 2. pipe-thermal-expansion-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/pipe-thermal-expansion-calculator`, '[data-testid="input-length"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B51_TERMS, 'pipe-thermal-expansion');
    approx(await page.locator('[data-testid="res-delta-l"]').innerText(), 11.20, 'pipe-thermal default dL');
    approx(await page.locator('[data-testid="res-thermal-stress"]').innerText(), 224.0, 'pipe-thermal default stress');
    approx(await page.locator('[data-testid="res-anchor-force"]').innerText(), 458.7147, 'pipe-thermal default force');
    approx(await page.locator('[data-testid="res-leg-length"]').innerText(), 1.6001, 'pipe-thermal default leg');
    await page.fill('[data-testid="input-length"]', '20');
    approx(await page.locator('[data-testid="res-delta-l"]').innerText(), 22.40, 'pipe-thermal L=20 dL');
    approx(await page.locator('[data-testid="res-leg-length"]').innerText(), 2.2629, 'pipe-thermal L=20 leg');
    const [dl2] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv2 = await readDownloadText(dl2);
    assertAscii(csv2, 'pipe-thermal CSV');
    assert(csv2.includes('22.4000'), 'pipe-thermal CSV missing updated deltaL');
    await page.fill('[data-testid="input-wall"]', '60');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'pipe-thermal invalid');
    console.log('[PASS] pipe-thermal-expansion-calculator');

    // 3. planetary-gear-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/planetary-gear-calculator`, '[data-testid="input-zs"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B51_TERMS, 'planetary-gear');
    approx(await page.locator('[data-testid="res-ratio"]').innerText(), 4.0, 'planetary default ratio');
    approx(await page.locator('[data-testid="res-output-rpm"]').innerText(), 375.0, 'planetary default rpm');
    await page.selectOption('[data-testid="select-config"]', 'sun-fixed');
    approx(await page.locator('[data-testid="res-ratio"]').innerText(), 80 / 60, 'planetary sun-fixed ratio');
    approx(await page.locator('[data-testid="res-output-rpm"]').innerText(), 1500 / (80 / 60), 'planetary sun-fixed rpm');
    const [dl3] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    assertAscii(await readDownloadText(dl3), 'planetary CSV');
    await page.fill('[data-testid="input-zs"]', '20.5');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'planetary invalid');
    console.log('[PASS] planetary-gear-calculator');

    // 4. plastic-shrinkage-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/plastic-shrinkage-calculator`, '[data-testid="input-part-dim"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B51_TERMS, 'plastic-shrinkage');
    approx(await page.locator('[data-testid="res-cavity-exact"]').innerText(), 100.5025, 'shrinkage default cavity');
    approx(await page.locator('[data-testid="res-shrink-mm"]').innerText(), 0.5025, 'shrinkage default delta');
    await page.fill('[data-testid="input-min-rate"]', '1.5');
    await page.fill('[data-testid="input-max-rate"]', '2.5');
    approx(await page.locator('[data-testid="res-cavity-exact"]').innerText(), 100 / 0.98, 'shrinkage 2% cavity');
    const [dl4] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    assertAscii(await readDownloadText(dl4), 'plastic-shrinkage CSV');
    await page.fill('[data-testid="input-min-rate"]', '3');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'plastic-shrinkage invalid');
    console.log('[PASS] plastic-shrinkage-calculator');

    // 5. plate-bending-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/plate-bending-calculator`, '[data-testid="input-pressure"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B51_TERMS, 'plate-bending');
    approx(await page.locator('[data-testid="res-sigma"]').innerText(), 3.5917, 'plate default square sigma');
    approx(await page.locator('[data-testid="res-deflection"]').innerText(), 0.069314, 'plate default square w');
    await page.selectOption('[data-testid="select-plate-case"]', 'circ_clamped');
    approx(await page.locator('[data-testid="res-sigma"]').innerText(), 2.34375, 'plate circ clamped sigma');
    approx(await page.locator('[data-testid="res-deflection"]').innerText(), 0.016663, 'plate circ clamped w');
    const [dl5] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    assertAscii(await readDownloadText(dl5), 'plate-bending CSV');
    await page.fill('[data-testid="input-nu"]', '0.5');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'plate-bending invalid');
    console.log('[PASS] plate-bending-calculator');

    assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
    assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
    console.log('ALL BATCH 51 E2E TESTS PASSED!');
  } finally {
    await browser.close();
  }
})();
