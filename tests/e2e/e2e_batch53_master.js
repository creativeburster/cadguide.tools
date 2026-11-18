/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 53 Master E2E Suite (skips progecad-shortcuts-sheet per ledger rule):
 * 1. power-unit-converter
 * 2. press-fit-calculator
 * 3. pressure-unit-converter
 * 4. pressure-vessel-thickness-calculator
 * 5. psychrometric-calculator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B53_TERMS = [
  'NIST Special Publication 811',
  'ISO 286-1',
  'ASME Y14.5',
  'DIN 6935',
  'ISO 2768',
  'BPVC',
  'SA-516',
  'EN 13906',
  'ASTM E8',
  'FKM Analytical',
  'ASHRAE',
  'SMACNA',
  'ISO 6946',
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
    // 1. power-unit-converter
    await openToolPage(page, `${BASE_URL}/toolbox/power-unit-converter`, '[data-testid="input-value"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B53_TERMS, 'power-unit-converter');
    approx(await page.locator('[data-testid="res-converted"]').innerText(), 13.410221, 'power 10kW->hp');
    approx(await page.locator('[data-testid="unit-ps"]').innerText(), 13.596216, 'power 10kW->PS');
    approx(await page.locator('[data-testid="unit-tr"]').innerText(), 2.843451, 'power 10kW->TR');
    await page.fill('[data-testid="input-value"]', '20');
    approx(await page.locator('[data-testid="res-converted"]').innerText(), 26.820442, 'power 20kW->hp');
    const [dl1] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    assertAscii(await readDownloadText(dl1), 'power CSV');
    await page.fill('[data-testid="input-value"]', '-5');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'power invalid');
    console.log('[PASS] power-unit-converter');

    // 2. press-fit-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/press-fit-calculator`, '[data-testid="input-delta"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B53_TERMS, 'press-fit-calculator');
    approx(await page.locator('[data-testid="res-pressure"]').innerText(), 69.1358, 'press-fit default p');
    approx(await page.locator('[data-testid="res-force"]').innerText(), 65.1590, 'press-fit default F');
    approx(await page.locator('[data-testid="res-torque"]').innerText(), 1628.9740, 'press-fit default T');
    await page.fill('[data-testid="input-delta"]', '0.10');
    approx(await page.locator('[data-testid="res-pressure"]').innerText(), 138.2716, 'press-fit 0.10mm p');
    const [dl2] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    assertAscii(await readDownloadText(dl2), 'press-fit CSV');
    await page.fill('[data-testid="input-do"]', '40'); // Do <= d
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'press-fit invalid');
    console.log('[PASS] press-fit-calculator');

    // 3. pressure-unit-converter
    await openToolPage(page, `${BASE_URL}/toolbox/pressure-unit-converter`, '[data-testid="input-value"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B53_TERMS, 'pressure-unit-converter');
    approx(await page.locator('[data-testid="res-converted"]').innerText(), 14.503774, 'pressure 1bar->psi');
    approx(await page.locator('[data-testid="unit-atm"]').innerText(), 0.986923, 'pressure 1bar->atm');
    approx(await page.locator('[data-testid="unit-torr"]').innerText(), 750.0617, 'pressure 1bar->torr');
    await page.fill('[data-testid="input-value"]', '2');
    approx(await page.locator('[data-testid="res-converted"]').innerText(), 29.007548, 'pressure 2bar->psi');
    const [dl3] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    assertAscii(await readDownloadText(dl3), 'pressure CSV');
    await page.fill('[data-testid="input-value"]', '');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'pressure invalid');
    console.log('[PASS] pressure-unit-converter');

    // 4. pressure-vessel-thickness-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/pressure-vessel-thickness-calculator`, '[data-testid="input-pressure"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B53_TERMS, 'pressure-vessel');
    approx(await page.locator('[data-testid="res-t-thin"]').innerText(), 5.1232, 'vessel default t_thin');
    approx(await page.locator('[data-testid="res-t-lame"]').innerText(), 5.1364, 'vessel default t_lame');
    approx(await page.locator('[data-testid="res-hoop"]').innerText(), 76.9231, 'vessel default hoop');
    await page.fill('[data-testid="input-pressure"]', '2.0');
    approx(await page.locator('[data-testid="res-hoop"]').innerText(), 153.8462, 'vessel P=2 MPa hoop');
    const [dl4] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    assertAscii(await readDownloadText(dl4), 'vessel CSV');
    await page.fill('[data-testid="input-eta"]', '1.2');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'vessel invalid');
    console.log('[PASS] pressure-vessel-thickness-calculator');

    // 5. psychrometric-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/psychrometric-calculator`, '[data-testid="input-tdb"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B53_TERMS, 'psychrometric');
    approx(await page.locator('[data-testid="res-w"]').innerText(), 12.4995, 'psych default W');
    approx(await page.locator('[data-testid="res-h"]').innerText(), 56.9925, 'psych default h');
    approx(await page.locator('[data-testid="res-rh"]').innerText(), 63.0160, 'psych default RH');
    approx(await page.locator('[data-testid="res-tdp"]').innerText(), 17.4700, 'psych default Tdp');
    await page.fill('[data-testid="input-twb"]', '25'); // saturated air
    approx(await page.locator('[data-testid="res-rh"]').innerText(), 100.0, 'psych saturated RH');
    const [dl5] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    assertAscii(await readDownloadText(dl5), 'psych CSV');
    await page.fill('[data-testid="input-twb"]', '30'); // Twb > Tdb invalid
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'psych invalid');
    console.log('[PASS] psychrometric-calculator');

    assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
    assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
    console.log('ALL BATCH 53 E2E TESTS PASSED!');
  } finally {
    await browser.close();
  }
})();
