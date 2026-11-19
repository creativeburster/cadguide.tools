/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 63 Master E2E Suite:
 * 1. slope-stability-calculator
 * 2. smoke-exhaust-calculator
 * 3. snow-load-calculator
 * 4. soil-compaction-calculator
 * 5. solar-angle-calculator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B63_TERMS = [
  'Eurocode 7',
  'EN 1997',
  'FHWA',
  'AASHTO',
  'ASTM D1557',
  'ASTM D2487',
  'ASTM D698',
  'NFPA 92',
  'ASCE 7',
  'NIST Special Publication',
  'ISO 80000',
  'BIPM SI',
  'NFPA 70',
  'IEC 60364',
  'IEC 60909',
  'IEEE Std 1584',
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
    // 1. slope-stability-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/slope-stability-calculator`, '[data-testid="input-c"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B63_TERMS, 'slope-stability-calculator');
    approx(await page.locator('[data-testid="output-fs"]').innerText(), 1.192569, 'slope inf default FS');
    approx(await page.locator('[data-testid="output-coh"]').innerText(), 0.3849, 'slope inf default coh');
    approx(await page.locator('[data-testid="output-fric"]').innerText(), 0.807669, 'slope inf default fric');
    await page.fill('[data-testid="input-c"]', '20');
    await page.fill('[data-testid="input-gamma"]', '19');
    await page.fill('[data-testid="input-z"]', '4');
    await page.fill('[data-testid="input-beta"]', '25');
    await page.fill('[data-testid="input-phi"]', '28');
    await page.fill('[data-testid="input-ru"]', '0.1');
    approx(await page.locator('[data-testid="output-fs"]').innerText(), 1.688492, 'slope inf mod FS');
    const [dl1] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv1 = await readDownloadText(dl1);
    assertAscii(csv1, 'slope inf csv');
    assert(csv1.includes('1.688492'), 'slope inf csv value');
    await page.fill('[data-testid="input-c"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(page.locator('main').last(), 'slope inf empty');
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-fs"]').innerText(), 1.192569, 'slope inf reset');
    console.log('[PASS] 1. slope-stability-calculator');

    // 2. smoke-exhaust-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/smoke-exhaust-calculator`, '[data-testid="input-q"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B63_TERMS, 'smoke-exhaust-calculator');
    approx(await page.locator('[data-testid="output-vol-h"]').innerText(), 29105.7, 'smoke default vol_h');
    approx(await page.locator('[data-testid="output-per-fan"]').innerText(), 14552.85, 'smoke default per_fan');
    approx(await page.locator('[data-testid="output-mass"]').innerText(), 8.489, 'smoke default mass');
    await page.click('[data-testid="preset-q-5.0"]');
    await page.fill('[data-testid="input-z"]', '4.5');
    await page.fill('[data-testid="input-rho"]', '1.00');
    await page.fill('[data-testid="input-fans"]', '4');
    approx(await page.locator('[data-testid="output-vol-h"]').innerText(), 70279.7, 'smoke mod vol_h');
    approx(await page.locator('[data-testid="output-per-fan"]').innerText(), 17569.9, 'smoke mod per_fan');
    const [dl2] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv2 = await readDownloadText(dl2);
    assertAscii(csv2, 'smoke csv');
    assert(csv2.includes('70279.719'), 'smoke csv value');
    await page.fill('[data-testid="input-z"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(page.locator('main').last(), 'smoke empty');
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-vol-h"]').innerText(), 29105.7, 'smoke reset');
    console.log('[PASS] 2. smoke-exhaust-calculator');

    // 3. snow-load-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/snow-load-calculator`, '[data-testid="input-pg"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B63_TERMS, 'snow-load-calculator');
    approx(await page.locator('[data-testid="output-pf"]').innerText(), 0.7, 'snow default pf');
    approx(await page.locator('[data-testid="output-ps"]').innerText(), 0.7, 'snow default ps');
    approx(await page.locator('[data-testid="output-psf"]').innerText(), 14.62, 'snow default psf');
    await page.fill('[data-testid="input-pg"]', '2.4');
    await page.fill('[data-testid="input-ce"]', '0.9');
    await page.fill('[data-testid="input-ct"]', '1.1');
    await page.fill('[data-testid="input-is"]', '1.2');
    await page.fill('[data-testid="input-cs"]', '0.85');
    approx(await page.locator('[data-testid="output-pf"]').innerText(), 1.99584, 'snow mod pf');
    approx(await page.locator('[data-testid="output-ps"]').innerText(), 1.696464, 'snow mod ps');
    approx(await page.locator('[data-testid="output-psf"]').innerText(), 35.431, 'snow mod psf');
    const [dl3] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv3 = await readDownloadText(dl3);
    assertAscii(csv3, 'snow csv');
    assert(csv3.includes('1.696464'), 'snow csv value');
    await page.fill('[data-testid="input-pg"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(page.locator('main').last(), 'snow empty');
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-pf"]').innerText(), 0.7, 'snow reset');
    console.log('[PASS] 3. snow-load-calculator');

    // 4. soil-compaction-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/soil-compaction-calculator`, '[data-testid="input-wet"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B63_TERMS, 'soil-compaction-calculator');
    approx(await page.locator('[data-testid="output-dry"]').innerText(), 1.8655, 'compaction default dry');
    approx(await page.locator('[data-testid="output-rc"]').innerText(), 97.16, 'compaction default rc');
    approx(await page.locator('[data-testid="output-dev"]').innerText(), -0.5, 'compaction default dev');
    assert((await page.locator('[data-testid="output-status"]').innerText()).includes('PASS'), 'compaction default PASS');
    await page.fill('[data-testid="input-wet"]', '1.95');
    await page.fill('[data-testid="input-w"]', '14.5');
    await page.fill('[data-testid="input-mdd"]', '1.90');
    approx(await page.locator('[data-testid="output-dry"]').innerText(), 1.7031, 'compaction mod dry');
    approx(await page.locator('[data-testid="output-rc"]').innerText(), 89.63, 'compaction mod rc');
    approx(await page.locator('[data-testid="output-dev"]').innerText(), 2.5, 'compaction mod dev');
    assert((await page.locator('[data-testid="output-status"]').innerText()).includes('RE-ROLL'), 'compaction mod fail status');
    const [dl4] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv4 = await readDownloadText(dl4);
    assertAscii(csv4, 'compaction csv');
    assert(csv4.includes('89.634567'), 'compaction csv value');
    await page.fill('[data-testid="input-wet"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(page.locator('main').last(), 'compaction empty');
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-rc"]').innerText(), 97.16, 'compaction reset');
    console.log('[PASS] 4. soil-compaction-calculator');

    // 5. solar-angle-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/solar-angle-calculator`, '[data-testid="input-lat"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B63_TERMS, 'solar-angle-calculator');
    approx(await page.locator('[data-testid="output-elev"]').innerText(), 73.241625, 'solar default elev');
    approx(await page.locator('[data-testid="output-shadow"]').innerText(), 0.903376, 'solar default shadow');
    approx(await page.locator('[data-testid="output-az"]').innerText(), 180.0, 'solar default az');
    await page.fill('[data-testid="input-lat"]', '35');
    await page.fill('[data-testid="input-doy"]', '90');
    await page.fill('[data-testid="input-hour"]', '15');
    await page.fill('[data-testid="input-height"]', '4');
    approx(await page.locator('[data-testid="output-elev"]').innerText(), 37.899158, 'solar mod elev');
    approx(await page.locator('[data-testid="output-shadow"]').innerText(), 5.138382, 'solar mod shadow');
    approx(await page.locator('[data-testid="output-az"]').innerText(), 243.420458, 'solar mod az');
    const [dl5] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv5 = await readDownloadText(dl5);
    assertAscii(csv5, 'solar csv');
    assert(csv5.includes('5.138382'), 'solar csv value');
    await page.fill('[data-testid="input-lat"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(page.locator('main').last(), 'solar empty');
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-elev"]').innerText(), 73.242, 'solar reset');
    console.log('[PASS] 5. solar-angle-calculator');

    assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
    assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
    console.log('BATCH 63 ALL 5 TOOLS PASSED');
  } finally {
    await context.close();
    await browser.close();
  }
})();
