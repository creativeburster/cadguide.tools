/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 62 Master E2E Suite:
 * 1. sheet-metal-bend-calculator
 * 2. sheet-metal-blank-calculator
 * 3. short-circuit-current-calculator
 * 4. shortcuts
 * 5. slope-circular-stability-calculator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B62_TERMS = [
  'ISO 286-1',
  'ASME Y14.5',
  'DIN 6935',
  'ISO 2768',
  'NFPA 70',
  'IEC 60364',
  'IEC 60909',
  'IEEE Std 1584',
  'IEEE 141',
  'IPC-2221',
  'NIST Special Publication',
  'ISO 80000',
  'BIPM SI',
  'Mobile Pro',
  'QLEADER',
  'MLEADER',
  'gcad.pgp',
  'DWG FastView',
  'GstarCAD',
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
    // 1. sheet-metal-bend-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/sheet-metal-bend-calculator`, '[data-testid="input-angle"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B62_TERMS, 'sheet-metal-bend-calculator');
    approx(await page.locator('[data-testid="output-ba"]').innerText(), 8.890707, 'bend default BA');
    approx(await page.locator('[data-testid="output-ossb"]').innerText(), 7.0, 'bend default OSSB');
    approx(await page.locator('[data-testid="output-bd"]').innerText(), 5.109293, 'bend default BD');
    approx(await page.locator('[data-testid="output-fl"]').innerText(), 94.890707, 'bend default FL');
    await page.fill('[data-testid="input-angle"]', '120');
    await page.fill('[data-testid="input-radius"]', '3');
    await page.fill('[data-testid="input-thickness"]', '2.5');
    await page.fill('[data-testid="input-k"]', '0.4');
    await page.fill('[data-testid="input-l1"]', '60');
    await page.fill('[data-testid="input-l2"]', '40');
    approx(await page.locator('[data-testid="output-ba"]').innerText(), 8.37758, 'bend mod BA');
    approx(await page.locator('[data-testid="output-ossb"]').innerText(), 9.526279, 'bend mod OSSB');
    approx(await page.locator('[data-testid="output-bd"]').innerText(), 10.674978, 'bend mod BD');
    approx(await page.locator('[data-testid="output-fl"]').innerText(), 89.325022, 'bend mod FL');
    const [dl1] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv1 = await readDownloadText(dl1);
    assertAscii(csv1, 'bend csv');
    assert(csv1.includes('89.325022'), 'bend csv value');
    await page.fill('[data-testid="input-angle"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(page.locator('main').last(), 'bend empty');
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-ba"]').innerText(), 8.890707, 'bend reset');
    console.log('[PASS] 1. sheet-metal-bend-calculator');

    // 2. sheet-metal-blank-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/sheet-metal-blank-calculator`, '[data-testid="input-l1"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B62_TERMS, 'sheet-metal-blank-calculator');
    approx(await page.locator('[data-testid="output-ba"]').innerText(), 7.319911, 'blank default BA');
    approx(await page.locator('[data-testid="output-bl"]').innerText(), 77.319911, 'blank default BL');
    await page.fill('[data-testid="input-l1"]', '80');
    await page.fill('[data-testid="input-l2"]', '50');
    await page.fill('[data-testid="input-angle"]', '60');
    await page.fill('[data-testid="input-radius"]', '6');
    await page.fill('[data-testid="input-thickness"]', '3');
    await page.fill('[data-testid="input-k"]', '0.40');
    approx(await page.locator('[data-testid="output-ba"]').innerText(), 7.539822, 'blank mod BA');
    approx(await page.locator('[data-testid="output-bl"]').innerText(), 137.539822, 'blank mod BL');
    const [dl2] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv2 = await readDownloadText(dl2);
    assertAscii(csv2, 'blank csv');
    assert(csv2.includes('137.539822'), 'blank csv value');
    await page.fill('[data-testid="input-l1"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(page.locator('main').last(), 'blank empty');
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-bl"]').innerText(), 77.319911, 'blank reset');
    console.log('[PASS] 2. sheet-metal-blank-calculator');

    // 3. short-circuit-current-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/short-circuit-current-calculator`, '[data-testid="input-kva"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B62_TERMS, 'short-circuit-current-calculator');
    approx(await page.locator('[data-testid="output-isc"]').innerText(), 31.377732, 'sc default Isc');
    approx(await page.locator('[data-testid="output-ifl"]').innerText(), 1804.22, 'sc default Ifl');
    approx(await page.locator('[data-testid="output-isc-inf"]').innerText(), 32.804, 'sc default Isc_inf');
    approx(await page.locator('[data-testid="output-sc-mva"]').innerText(), 21.739, 'sc default MVA');
    await page.fill('[data-testid="input-kva"]', '2000');
    await page.fill('[data-testid="input-v"]', '480');
    await page.fill('[data-testid="input-z"]', '6.0');
    await page.fill('[data-testid="input-mva"]', '250');
    approx(await page.locator('[data-testid="output-isc"]').innerText(), 35.377, 'sc mod Isc');
    approx(await page.locator('[data-testid="output-ifl"]').innerText(), 2405.63, 'sc mod Ifl');
    approx(await page.locator('[data-testid="output-isc-inf"]').innerText(), 40.094, 'sc mod Isc_inf');
    approx(await page.locator('[data-testid="output-sc-mva"]').innerText(), 29.412, 'sc mod MVA');
    const [dl3] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv3 = await readDownloadText(dl3);
    assertAscii(csv3, 'sc csv');
    assert(csv3.includes('35.376855'), 'sc csv value');
    await page.fill('[data-testid="input-kva"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(page.locator('main').last(), 'sc empty');
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-isc"]').innerText(), 31.378, 'sc reset');
    console.log('[PASS] 3. short-circuit-current-calculator');

    // 4. shortcuts
    await openToolPage(page, `${BASE_URL}/toolbox/shortcuts`, '[data-testid="input-search"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B62_TERMS, 'shortcuts');
    const initCount = await page.locator('[data-testid="shortcut-card"]').count();
    assert.strictEqual(initCount, 43, `shortcuts expected 43 verified cards, got ${initCount}`);
    await page.fill('[data-testid="input-search"]', 'CIRCLE');
    const circleCount = await page.locator('[data-testid="shortcut-card"]').count();
    assert.strictEqual(circleCount, 1, `shortcuts search CIRCLE expected 1, got ${circleCount}`);
    assert((await page.locator('[data-testid="cards-grid"]').innerText()).includes('Draw a circle.'), 'shortcuts CIRCLE verbatim description');
    await page.fill('[data-testid="input-search"]', '');
    await page.click('[data-testid="cat-draw"]');
    const drawCount = await page.locator('[data-testid="shortcut-card"]').count();
    assert.strictEqual(drawCount, 4, `shortcuts draw category expected 4, got ${drawCount}`);
    await page.click('[data-testid="cat-all"]');
    await page.click('[data-testid="btn-view-table"]');
    await page.waitForSelector('#printable-shortcut-list table');
    const [dl4] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv4 = await readDownloadText(dl4);
    assertAscii(csv4, 'shortcuts csv');
    assert(csv4.includes('https://www.zwsoft.com/user-guide/shortcut-keys-of-zwcad'), 'shortcuts csv source url');
    assert(csv4.includes('"L","LINE",draw,"Draw a line."'), 'shortcuts csv L LINE row');
    console.log('[PASS] 4. shortcuts');

    // 5. slope-circular-stability-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/slope-circular-stability-calculator`, '[data-testid="input-h"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B62_TERMS, 'slope-circular-stability-calculator');
    approx(await page.locator('[data-testid="output-fs"]').innerText(), 2.063859, 'circular slope default FS');
    approx(await page.locator('[data-testid="output-r"]').innerText(), 12.649111, 'circular slope default R');
    approx(await page.locator('[data-testid="output-weight"]').innerText(), 1038.4, 'circular slope default weight');
    assert.strictEqual(await page.locator('[data-testid="slice-row"]').count(), 10, 'circular slope 10 slices');
    await page.fill('[data-testid="input-h"]', '10');
    await page.fill('[data-testid="input-beta"]', '35');
    await page.fill('[data-testid="input-c"]', '15');
    await page.fill('[data-testid="input-phi"]', '22');
    await page.fill('[data-testid="input-gamma"]', '18.5');
    await page.fill('[data-testid="input-xc"]', '3');
    await page.fill('[data-testid="input-yc"]', '14');
    await page.fill('[data-testid="input-ru"]', '0.2');
    approx(await page.locator('[data-testid="output-fs"]').innerText(), 1.123339, 'circular slope mod FS');
    approx(await page.locator('[data-testid="output-r"]').innerText(), 14.317821, 'circular slope mod R');
    const [dl5] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv5 = await readDownloadText(dl5);
    assertAscii(csv5, 'circular slope csv');
    assert(csv5.includes('1.123339'), 'circular slope csv FS');
    await page.fill('[data-testid="input-h"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(page.locator('main').last(), 'circular slope empty');
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-fs"]').innerText(), 2.064, 'circular slope reset');
    console.log('[PASS] 5. slope-circular-stability-calculator');

    assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
    assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
    console.log('BATCH 62 ALL 5 TOOLS PASSED');
  } finally {
    await context.close();
    await browser.close();
  }
})();
