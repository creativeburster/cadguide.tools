/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 54 Master E2E Suite:
 * 1. pulley-system-calculator
 * 2. pump-affinity-law-calculator
 * 3. pump-head-calculator
 * 4. pump-power-calculator
 * 5. pump-station-design-calculator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B54_TERMS = [
  'ISO 6336',
  'AGMA',
  'ISO 606',
  'ISO 3408',
  'ANSI/HI',
  'Crane Technical Paper No. 410',
  'ASME B31.3',
  'ISO 4413',
  'WEF MOP 8',
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
    // 1. pulley-system-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/pulley-system-calculator`, '[data-testid="input-load"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B54_TERMS, 'pulley-system');
    approx(await page.locator('[data-testid="res-ma"]').innerText(), 3.7663, 'pulley default MA');
    approx(await page.locator('[data-testid="res-force"]').innerText(), 265.5100, 'pulley default force');
    await page.fill('[data-testid="input-eta"]', '1');
    approx(await page.locator('[data-testid="res-ma"]').innerText(), 4.0, 'pulley ideal MA');
    approx(await page.locator('[data-testid="res-force"]').innerText(), 250.0, 'pulley ideal force');
    const [dl1] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    assertAscii(await readDownloadText(dl1), 'pulley CSV');
    await page.fill('[data-testid="input-ropes"]', '2.5');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'pulley invalid');
    console.log('[PASS] pulley-system-calculator');

    // 2. pump-affinity-law-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/pump-affinity-law-calculator`, '[data-testid="input-q1"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B54_TERMS, 'pump-affinity');
    approx(await page.locator('[data-testid="res-q2"]').innerText(), 120.6897, 'affinity speed Q2');
    approx(await page.locator('[data-testid="res-h2"]').innerText(), 43.6980, 'affinity speed H2');
    approx(await page.locator('[data-testid="res-p2"]').innerText(), 26.3695, 'affinity speed P2');
    await page.click('[data-testid="mode-similar"]');
    await page.fill('[data-testid="input-n2"]', '1450');
    approx(await page.locator('[data-testid="res-q2"]').innerText(), 133.1000, 'affinity similar D^3 Q2');
    approx(await page.locator('[data-testid="res-h2"]').innerText(), 36.3000, 'affinity similar D^2 H2');
    approx(await page.locator('[data-testid="res-p2"]').innerText(), 24.1577, 'affinity similar D^5 P2');
    const [dl2] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    assertAscii(await readDownloadText(dl2), 'affinity CSV');
    await page.fill('[data-testid="input-n1"]', '0');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'affinity invalid');
    console.log('[PASS] pump-affinity-law-calculator');

    // 3. pump-head-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/pump-head-calculator`, '[data-testid="input-flow"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B54_TERMS, 'pump-head');
    approx(await page.locator('[data-testid="res-hf"]').innerText(), 5.4423, 'pump-head default hf');
    approx(await page.locator('[data-testid="res-tdh"]').innerText(), 25.4423, 'pump-head default tdh');
    approx(await page.locator('[data-testid="res-ph"]').innerText(), 12.4752, 'pump-head default Ph');
    approx(await page.locator('[data-testid="res-pm"]').innerText(), 17.5090, 'pump-head default Pm');
    await page.fill('[data-testid="input-len"]', '200');
    approx(await page.locator('[data-testid="res-hf"]').innerText(), 10.8846, 'pump-head L=200 hf');
    const [dl3] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    assertAscii(await readDownloadText(dl3), 'pump-head CSV');
    await page.fill('[data-testid="input-etap"]', '1.5');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'pump-head invalid');
    console.log('[PASS] pump-head-calculator');

    // 4. pump-power-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/pump-power-calculator`, '[data-testid="input-flow"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B54_TERMS, 'pump-power');
    approx(await page.locator('[data-testid="res-ph"]').innerText(), 8.1722, 'pump-power default Ph');
    approx(await page.locator('[data-testid="res-ps"]').innerText(), 10.8963, 'pump-power default Ps');
    approx(await page.locator('[data-testid="res-pm"]').innerText(), 11.4698, 'pump-power default Pm');
    await page.fill('[data-testid="input-flow"]', '200');
    approx(await page.locator('[data-testid="res-ph"]').innerText(), 16.3444, 'pump-power Q=200 Ph');
    const [dl4] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    assertAscii(await readDownloadText(dl4), 'pump-power CSV');
    await page.fill('[data-testid="input-head"]', '-10');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'pump-power invalid');
    console.log('[PASS] pump-power-calculator');

    // 5. pump-station-design-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/pump-station-design-calculator`, '[data-testid="input-qpeak"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B54_TERMS, 'pump-station');
    approx(await page.locator('[data-testid="res-vmin"]').innerText(), 3.7500, 'pump-station default Vmin');
    approx(await page.locator('[data-testid="res-qpump"]').innerText(), 90.00, 'pump-station default Qpump');
    approx(await page.locator('[data-testid="res-dia"]').innerText(), 1.7841, 'pump-station default Dia');
    await page.fill('[data-testid="input-depth"]', '3');
    approx(await page.locator('[data-testid="res-area"]').innerText(), 1.2500, 'pump-station depth=3 area');
    const [dl5] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    assertAscii(await readDownloadText(dl5), 'pump-station CSV');
    await page.fill('[data-testid="input-duty"]', '0');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'pump-station invalid');
    console.log('[PASS] pump-station-design-calculator');

    assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
    assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
    console.log('ALL BATCH 54 E2E TESTS PASSED!');
  } finally {
    await browser.close();
  }
})();
