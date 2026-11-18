/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 55 Master E2E Suite:
 * 1. punching-force-calculator
 * 2. pv-inverter-sizing-calculator
 * 3. rack-pinion-calculator
 * 4. rainwater-harvesting-calculator
 * 5. reaming-dimension-calculator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B55_TERMS = [
  'ISO 286',
  'ASME B4.1',
  'ASME Y14.5',
  'ISO 1101',
  'DIN 6935',
  'ISO 2768',
  'IEC 62548',
  'IEEE Std',
  'NFPA 70',
  'NEC Article',
  'IEC 60364',
  'IEC 60909',
  'IPC-2221',
  'VDI 2230',
  'ISO 898',
  'ASME B1.1',
  'ISO 68-1',
  'ISO 273',
  'NIST Special Publication',
  'ISO 80000',
  'BIPM SI',
  "Machinery's Handbook",
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
    // 1. punching-force-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/punching-force-calculator`, '[data-testid="input-perimeter"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B55_TERMS, 'punching-force-calculator');
    approx(await page.locator('[data-testid="output-punching-force"]').innerText(), 60.0, 'punch default force');
    approx(await page.locator('[data-testid="output-press-tonnage"]').innerText(), 6.1183, 'punch default tf');
    approx(await page.locator('[data-testid="output-work-done"]').innerText(), 36.0, 'punch default work');
    approx(await page.locator('[data-testid="output-strip"]').innerText(), 4.8, 'punch default strip');
    approx(await page.locator('[data-testid="output-safe-tf"]').innerText(), 7.9538, 'punch default safe tf');

    await page.locator('[data-testid="input-perimeter"]').fill('200');
    await page.locator('[data-testid="input-thickness"]').fill('3');
    await page.locator('[data-testid="input-shear-strength"]').fill('400');
    approx(await page.locator('[data-testid="output-punching-force"]').innerText(), 240.0, 'punch mod force');
    approx(await page.locator('[data-testid="output-press-tonnage"]').innerText(), 24.4732, 'punch mod tf');
    approx(await page.locator('[data-testid="output-work-done"]').innerText(), 216.0, 'punch mod work');
    approx(await page.locator('[data-testid="output-strip"]').innerText(), 19.2, 'punch mod strip');
    approx(await page.locator('[data-testid="output-safe-tf"]').innerText(), 31.8152, 'punch mod safe tf');

    await page.locator('[data-testid="input-perimeter"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'punch empty');
    await page.locator('[data-testid="input-perimeter"]').fill('200');
    const [dl1] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv1 = await readDownloadText(dl1);
    assertAscii(csv1, 'punch CSV');
    assert(csv1.includes('240.000'), 'punch CSV force check');
    console.log('[PASS] punching-force-calculator');

    // 2. pv-inverter-sizing-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/pv-inverter-sizing-calculator`, '[data-testid="input-mod-w"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B55_TERMS, 'pv-inverter-sizing-calculator');
    approx(await page.locator('[data-testid="res-ilr"]').innerText(), 1.32, 'pv default ilr');
    approx(await page.locator('[data-testid="res-dc-kw"]').innerText(), 132.0, 'pv default dc kw');
    approx(await page.locator('[data-testid="res-voc-max"]').innerText(), 1086.64, 'pv default voc max');
    approx(await page.locator('[data-testid="res-mwh"]').innerText(), 169.88, 'pv default mwh');

    await page.locator('[data-testid="input-ns"]').fill('24');
    await page.locator('[data-testid="input-pinv"]').fill('150');
    approx(await page.locator('[data-testid="res-ilr"]').innerText(), 1.056, 'pv mod ilr');
    approx(await page.locator('[data-testid="res-dc-kw"]').innerText(), 158.4, 'pv mod dc kw');
    approx(await page.locator('[data-testid="res-voc-max"]').innerText(), 1303.96, 'pv mod voc max');
    approx(await page.locator('[data-testid="res-mwh"]').innerText(), 203.86, 'pv mod mwh');
    await page.getByRole('button', { name: 'Copy' }).click();

    await page.locator('[data-testid="input-ns"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'pv empty');
    await page.locator('[data-testid="input-ns"]').fill('24');
    const [dl2] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv2 = await readDownloadText(dl2);
    assertAscii(csv2, 'pv CSV');
    assert(csv2.includes('1.0560'), 'pv CSV ilr check');
    console.log('[PASS] pv-inverter-sizing-calculator');

    // 3. rack-pinion-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/rack-pinion-calculator`, '[data-testid="input-module"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B55_TERMS, 'rack-pinion-calculator');
    approx(await page.locator('[data-testid="res-speed"]').innerText(), 0.20944, 'rack default speed');
    approx(await page.locator('[data-testid="res-force"]').innerText(), 475.0, 'rack default force');
    approx(await page.locator('[data-testid="res-travel"]').innerText(), 125.6637, 'rack default travel');

    await page.locator('[data-testid="input-module"]').fill('3');
    await page.locator('[data-testid="input-teeth"]').fill('24');
    await page.locator('[data-testid="input-rpm"]').fill('150');
    await page.locator('[data-testid="input-torque"]').fill('18');
    await page.locator('[data-testid="input-eff"]').fill('90');
    approx(await page.locator('[data-testid="res-speed"]').innerText(), 0.565487, 'rack mod speed');
    approx(await page.locator('[data-testid="res-force"]').innerText(), 450.0, 'rack mod force');
    approx(await page.locator('[data-testid="res-travel"]').innerText(), 226.1947, 'rack mod travel');

    await page.locator('[data-testid="input-module"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'rack empty');
    await page.locator('[data-testid="input-module"]').fill('3');
    const [dl3] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv3 = await readDownloadText(dl3);
    assertAscii(csv3, 'rack CSV');
    assert(csv3.includes('450.0000'), 'rack CSV thrust check');
    console.log('[PASS] rack-pinion-calculator');

    // 4. rainwater-harvesting-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/rainwater-harvesting-calculator`, '[data-testid="input-area"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B55_TERMS, 'rainwater-harvesting-calculator');
    approx(await page.locator('[data-testid="res-annual"]').innerText(), 57.6, 'rain default annual');
    approx(await page.locator('[data-testid="res-tank"]').innerText(), 4.5, 'rain default tank');
    approx(await page.locator('[data-testid="res-daily"]').innerText(), 157.81, 'rain default daily');

    await page.locator('[data-testid="input-area"]').fill('250');
    await page.locator('[data-testid="input-rain"]').fill('1000');
    await page.locator('[data-testid="input-cr"]').fill('0.85');
    await page.locator('[data-testid="input-filter"]').fill('95');
    await page.locator('[data-testid="input-demand"]').fill('300');
    await page.locator('[data-testid="input-days"]').fill('20');
    approx(await page.locator('[data-testid="res-annual"]').innerText(), 201.875, 'rain mod annual');
    approx(await page.locator('[data-testid="res-tank"]').innerText(), 6.0, 'rain mod tank');
    approx(await page.locator('[data-testid="res-daily"]').innerText(), 553.08, 'rain mod daily');

    await page.locator('[data-testid="input-area"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'rain empty');
    await page.locator('[data-testid="input-area"]').fill('250');
    const [dl4] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv4 = await readDownloadText(dl4);
    assertAscii(csv4, 'rain CSV');
    assert(csv4.includes('201.8750'), 'rain CSV yield check');
    console.log('[PASS] rainwater-harvesting-calculator');

    // 5. reaming-dimension-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/reaming-dimension-calculator`, '[data-testid="input-dia"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B55_TERMS, 'reaming-dimension-calculator');
    approx(await page.locator('[data-testid="res-drill"]').innerText(), 19.78, 'ream default drill');
    approx(await page.locator('[data-testid="res-rpm"]').innerText(), 190.99, 'ream default rpm');
    approx(await page.locator('[data-testid="res-feed"]').innerText(), 91.67, 'ream default feed');
    approx(await page.locator('[data-testid="res-mid"]').innerText(), 20.0105, 'ream default mid');

    await page.locator('[data-testid="input-dia"]').fill('16');
    await page.locator('[data-testid="input-stock"]').fill('0.18');
    await page.locator('[data-testid="input-tol-hi"]').fill('0.018');
    await page.locator('[data-testid="input-tol-lo"]').fill('0.000');
    await page.locator('[data-testid="input-vc"]').fill('24');
    await page.locator('[data-testid="input-fz"]').fill('0.06');
    await page.locator('[data-testid="input-flutes"]').fill('6');
    approx(await page.locator('[data-testid="res-drill"]').innerText(), 15.82, 'ream mod drill');
    approx(await page.locator('[data-testid="res-rpm"]').innerText(), 477.46, 'ream mod rpm');
    approx(await page.locator('[data-testid="res-feed"]').innerText(), 171.89, 'ream mod feed');
    approx(await page.locator('[data-testid="res-mid"]').innerText(), 16.009, 'ream mod mid');

    await page.locator('[data-testid="input-dia"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'ream empty');
    await page.locator('[data-testid="input-dia"]').fill('16');
    const [dl5] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv5 = await readDownloadText(dl5);
    assertAscii(csv5, 'ream CSV');
    assert(csv5.includes('15.8200'), 'ream CSV drill check');
    console.log('[PASS] reaming-dimension-calculator');

    assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
    assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
    console.log('BATCH 55 E2E ALL PASSED (5/5)');
  } finally {
    await browser.close();
  }
})();
