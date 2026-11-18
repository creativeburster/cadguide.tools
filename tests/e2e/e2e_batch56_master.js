/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 56 Master E2E Suite:
 * 1. rebar-development-length-calculator
 * 2. rebar-spacing-calculator
 * 3. rebar-weight-calculator
 * 4. refrigeration-cycle-calculator
 * 5. reservoir-flood-routing-calculator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B56_TERMS = [
  'ACI 318',
  'Eurocode 2',
  'EN 1992',
  'IBC 2024',
  'ASCE 7',
  'ADA 2010',
  'NIST Special Publication',
  'ISO 80000',
  'BIPM SI',
  'ASME Y14.5',
  'USBR',
  'HEC-HMS',
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
    // 1. rebar-development-length-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/rebar-development-length-calculator`, '[data-testid="input-db"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B56_TERMS, 'rebar-development-length-calculator');
    approx(await page.locator('[data-testid="res-ld"]').innerText(), 840.0, 'rebar-dev default ld');
    approx(await page.locator('[data-testid="res-ratio"]').innerText(), 42.0, 'rebar-dev default ratio');
    approx(await page.locator('[data-testid="res-ldh"]').innerText(), 588.0, 'rebar-dev default ldh');
    approx(await page.locator('[data-testid="res-lap"]').innerText(), 1092.0, 'rebar-dev default lap');

    await page.locator('[data-testid="input-db"]').fill('25');
    await page.locator('[data-testid="input-fy"]').fill('500');
    await page.locator('[data-testid="input-bond"]').fill('3.0');
    await page.locator('[data-testid="input-kpos"]').fill('1.3');
    await page.locator('[data-testid="input-kcoat"]').fill('1.2');
    approx(await page.locator('[data-testid="res-ld"]').innerText(), 1625.0, 'rebar-dev mod ld');
    approx(await page.locator('[data-testid="res-ratio"]').innerText(), 65.0, 'rebar-dev mod ratio');
    approx(await page.locator('[data-testid="res-ldh"]').innerText(), 1137.5, 'rebar-dev mod ldh');
    approx(await page.locator('[data-testid="res-lap"]').innerText(), 2112.5, 'rebar-dev mod lap');

    await page.locator('[data-testid="input-db"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'rebar-dev empty');
    await page.locator('[data-testid="input-db"]').fill('25');
    const [dl1] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv1 = await readDownloadText(dl1);
    assertAscii(csv1, 'rebar-dev CSV');
    assert(csv1.includes('1625.00'), 'rebar-dev CSV check');
    console.log('[PASS] rebar-development-length-calculator');

    // 2. rebar-spacing-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/rebar-spacing-calculator`, '[data-testid="input-len"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B56_TERMS, 'rebar-spacing-calculator');
    approx(await page.locator('[data-testid="res-count"]').innerText(), 77, 'rebar-spacing default count');
    approx(await page.locator('[data-testid="res-length"]').innerText(), 507.3, 'rebar-spacing default length');
    approx(await page.locator('[data-testid="res-weight"]').innerText(), 472.91, 'rebar-spacing default weight');
    approx(await page.locator('[data-testid="res-unit"]').innerText(), 0.8878, 'rebar-spacing default unit');

    await page.locator('[data-testid="input-len"]').fill('12');
    await page.locator('[data-testid="input-wid"]').fill('6');
    await page.locator('[data-testid="input-sx"]').fill('150');
    await page.locator('[data-testid="input-sy"]').fill('150');
    await page.locator('[data-testid="input-dia"]').fill('16');
    await page.locator('[data-testid="input-layers"]').fill('2');
    await page.locator('[data-testid="input-waste"]').fill('10');
    approx(await page.locator('[data-testid="res-count"]').innerText(), 244, 'rebar-spacing mod count');
    approx(await page.locator('[data-testid="res-length"]').innerText(), 1931.6, 'rebar-spacing mod length');
    approx(await page.locator('[data-testid="res-weight"]').innerText(), 3353.59, 'rebar-spacing mod weight');
    approx(await page.locator('[data-testid="res-unit"]').innerText(), 1.5783, 'rebar-spacing mod unit');

    await page.locator('[data-testid="input-len"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'rebar-spacing empty');
    await page.locator('[data-testid="input-len"]').fill('12');
    const [dl2] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv2 = await readDownloadText(dl2);
    assertAscii(csv2, 'rebar-spacing CSV');
    assert(csv2.includes('3353.58'), 'rebar-spacing CSV weight check');
    console.log('[PASS] rebar-spacing-calculator');

    // 3. rebar-weight-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/rebar-weight-calculator`, '[data-testid="input-dia"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B56_TERMS, 'rebar-weight-calculator');
    approx(await page.locator('[data-testid="res-unit-weight"]').innerText(), 0.8878, 'rebar-weight default unit');
    approx(await page.locator('[data-testid="res-unit-lbft"]').innerText(), 0.5966, 'rebar-weight default lbft');
    approx(await page.locator('[data-testid="res-bar-weight"]').innerText(), 10.654, 'rebar-weight default bar');
    approx(await page.locator('[data-testid="res-total-len"]').innerText(), 250.0, 'rebar-weight default len');
    approx(await page.locator('[data-testid="res-total-weight"]').innerText(), 221.95, 'rebar-weight default weight');

    await page.getByRole('button', { name: '20mm' }).click();
    await page.locator('[data-testid="input-bar-len"]').fill('9');
    await page.locator('[data-testid="input-spacing"]').fill('150');
    await page.locator('[data-testid="input-slab-w"]').fill('3');
    await page.locator('[data-testid="input-slab-l"]').fill('6');
    await page.locator('[data-testid="input-waste"]').fill('10');
    approx(await page.locator('[data-testid="res-unit-weight"]').innerText(), 2.4662, 'rebar-weight mod unit');
    approx(await page.locator('[data-testid="res-bar-weight"]').innerText(), 22.195, 'rebar-weight mod bar');
    approx(await page.locator('[data-testid="res-total-len"]').innerText(), 273.9, 'rebar-weight mod len');
    approx(await page.locator('[data-testid="res-total-weight"]').innerText(), 675.48, 'rebar-weight mod weight');

    await page.locator('[data-testid="input-dia"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'rebar-weight empty');
    await page.locator('[data-testid="input-dia"]').fill('20');
    const [dl3] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv3 = await readDownloadText(dl3);
    assertAscii(csv3, 'rebar-weight CSV');
    assert(csv3.includes('675.47'), 'rebar-weight CSV check');
    console.log('[PASS] rebar-weight-calculator');

    // 4. refrigeration-cycle-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/refrigeration-cycle-calculator`, '[data-testid="input-h1"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B56_TERMS, 'refrigeration-cycle-calculator');
    approx(await page.locator('[data-testid="res-cop"]').innerText(), 3.0, 'refrig default cop');
    approx(await page.locator('[data-testid="res-qe"]').innerText(), 150.0, 'refrig default qe');
    approx(await page.locator('[data-testid="res-wc"]').innerText(), 50.0, 'refrig default wc');
    approx(await page.locator('[data-testid="res-qe-kw"]').innerText(), 15.0, 'refrig default qekw');
    approx(await page.locator('[data-testid="res-qcond"]').innerText(), 20.0, 'refrig default qcond');

    await page.locator('[data-testid="input-h1"]').fill('410');
    await page.locator('[data-testid="input-h2s"]').fill('460');
    await page.locator('[data-testid="input-h3"]').fill('260');
    await page.locator('[data-testid="input-eta"]').fill('85');
    await page.locator('[data-testid="input-mass"]').fill('0.2');
    approx(await page.locator('[data-testid="res-cop"]').innerText(), 2.55, 'refrig mod cop');
    approx(await page.locator('[data-testid="res-qe-kw"]').innerText(), 30.0, 'refrig mod qekw');
    approx(await page.locator('[data-testid="res-wc"]').innerText(), 58.82, 'refrig mod wc');

    await page.locator('[data-testid="input-h1"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'refrig empty');
    await page.locator('[data-testid="input-h1"]').fill('410');
    const [dl4] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv4 = await readDownloadText(dl4);
    assertAscii(csv4, 'refrig CSV');
    assert(csv4.includes('2.5500'), 'refrig CSV cop check');
    console.log('[PASS] refrigeration-cycle-calculator');

    // 5. reservoir-flood-routing-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/reservoir-flood-routing-calculator`, '[data-testid="input-qin"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B56_TERMS, 'reservoir-flood-routing-calculator');
    approx(await page.locator('[data-testid="res-qout"]').innerText(), 40.47, 'routing default qout');
    approx(await page.locator('[data-testid="res-atten"]').innerText(), 73.02, 'routing default atten');
    approx(await page.locator('[data-testid="res-head"]').innerText(), 0.9603, 'routing default head');
    approx(await page.locator('[data-testid="res-storage"]').innerText(), 2.4008, 'routing default storage');

    await page.locator('[data-testid="input-qin"]').fill('240');
    await page.locator('[data-testid="input-tp"]').fill('3');
    await page.locator('[data-testid="input-tb"]').fill('10');
    await page.locator('[data-testid="input-area"]').fill('1.5');
    await page.locator('[data-testid="input-width"]').fill('25');
    await page.locator('[data-testid="input-cd"]').fill('2.10');
    approx(await page.locator('[data-testid="res-qout"]').innerText(), 108.23, 'routing mod qout');
    approx(await page.locator('[data-testid="res-atten"]').innerText(), 54.9, 'routing mod atten');
    approx(await page.locator('[data-testid="res-head"]').innerText(), 1.6198, 'routing mod head');
    approx(await page.locator('[data-testid="res-storage"]').innerText(), 2.4297, 'routing mod storage');

    await page.locator('[data-testid="input-qin"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'routing empty');
    await page.locator('[data-testid="input-qin"]').fill('240');
    const [dl5] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv5 = await readDownloadText(dl5);
    assertAscii(csv5, 'routing CSV');
    assert(csv5.includes('108.2306'), 'routing CSV qout check');
    console.log('[PASS] reservoir-flood-routing-calculator');

    assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
    assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
    console.log('BATCH 56 E2E ALL PASSED (5/5)');
  } finally {
    await browser.close();
  }
})();
