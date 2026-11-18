/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 52 Master E2E Suite:
 * 1. plumbing-fixture-count-calculator
 * 2. point-cloud-density-calculator
 * 3. polishing-time-calculator
 * 4. power-factor-calculator
 * 5. power-screw-calculator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B52_TERMS = [
  'IPC 2024',
  'Table 403.1',
  'IBC',
  'ADA',
  'NIST Special Publication 811',
  'NFPA 70',
  'IEC 60909',
  'IEEE Std 1584',
  'IPC-2221',
  'VDI 2230',
  'ISO 898-1',
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
    // 1. plumbing-fixture-count-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/plumbing-fixture-count-calculator`, '[data-testid="input-area"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B52_TERMS, 'plumbing-fixture-count');
    approx(await page.locator('[data-testid="res-total-wc"]').innerText(), 8, 'plumbing default WC');
    approx(await page.locator('[data-testid="res-occupants"]').innerText(), 267, 'plumbing default occ');
    await page.fill('[data-testid="input-area"]', '6000');
    approx(await page.locator('[data-testid="res-occupants"]').innerText(), 500, 'plumbing 6000 occ');
    // female=250 -> ceil(250/30)=9; male=250 -> ceil(250/50)=5 => total=14
    approx(await page.locator('[data-testid="res-total-wc"]').innerText(), 14, 'plumbing 6000 WC');
    const [dl1] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv1 = await readDownloadText(dl1);
    assertAscii(csv1, 'plumbing CSV');
    await page.fill('[data-testid="input-female-pct"]', '120');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'plumbing invalid');
    console.log('[PASS] plumbing-fixture-count-calculator');

    // 2. point-cloud-density-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/point-cloud-density-calculator`, '[data-testid="input-points"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B52_TERMS, 'point-cloud-density');
    approx(await page.locator('[data-testid="res-density"]').innerText(), 5000.0, 'pcd default density');
    approx(await page.locator('[data-testid="res-spacing"]').innerText(), 14.1421, 'pcd default spacing');
    approx(await page.locator('[data-testid="res-size"]').innerText(), 133.5144, 'pcd default MiB');
    await page.fill('[data-testid="input-points"]', '20000000');
    approx(await page.locator('[data-testid="res-density"]').innerText(), 20000.0, 'pcd 20M density');
    approx(await page.locator('[data-testid="res-spacing"]').innerText(), 7.0711, 'pcd 20M spacing');
    const [dl2] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    assertAscii(await readDownloadText(dl2), 'pcd CSV');
    await page.fill('[data-testid="input-area"]', '0');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'pcd invalid');
    console.log('[PASS] point-cloud-density-calculator');

    // 3. polishing-time-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/polishing-time-calculator`, '[data-testid="input-area"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B52_TERMS, 'polishing-time');
    approx(await page.locator('[data-testid="res-time-min"]').innerText(), 22.50, 'polishing default min');
    approx(await page.locator('[data-testid="res-compound"]').innerText(), 11.25, 'polishing default comp');
    await page.fill('[data-testid="input-area"]', '1000');
    approx(await page.locator('[data-testid="res-time-min"]').innerText(), 45.0, 'polishing 1000 min');
    approx(await page.locator('[data-testid="res-compound"]').innerText(), 22.5, 'polishing 1000 comp');
    const [dl3] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    assertAscii(await readDownloadText(dl3), 'polishing CSV');
    await page.fill('[data-testid="input-unit-time"]', '0');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'polishing invalid');
    console.log('[PASS] polishing-time-calculator');

    // 4. power-factor-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/power-factor-calculator`, '[data-testid="input-power"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B52_TERMS, 'power-factor');
    approx(await page.locator('[data-testid="res-qc"]').innerText(), 55.3233, 'pf default Qc');
    approx(await page.locator('[data-testid="res-s1"]').innerText(), 133.3333, 'pf default S1');
    approx(await page.locator('[data-testid="res-s2"]').innerText(), 105.2632, 'pf default S2');
    await page.fill('[data-testid="input-power"]', '200');
    approx(await page.locator('[data-testid="res-qc"]').innerText(), 110.6466, 'pf P=200 Qc');
    const [dl4] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    assertAscii(await readDownloadText(dl4), 'pf CSV');
    await page.fill('[data-testid="input-pf2"]', '0.6');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'pf invalid');
    console.log('[PASS] power-factor-calculator');

    // 5. power-screw-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/power-screw-calculator`, '[data-testid="input-load"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B52_TERMS, 'power-screw');
    approx(await page.locator('[data-testid="res-raise"]').innerText(), 11.8904, 'screw default raise');
    approx(await page.locator('[data-testid="res-lower"]').innerText(), 3.7395, 'screw default lower');
    approx(await page.locator('[data-testid="res-efficiency"]').innerText(), 33.4630, 'screw default eff');
    await page.fill('[data-testid="input-alpha"]', '0');
    approx(await page.locator('[data-testid="res-raise"]').innerText(), 11.6175, 'screw square raise');
    approx(await page.locator('[data-testid="res-lower"]').innerText(), 3.4796, 'screw square lower');
    const [dl5] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    assertAscii(await readDownloadText(dl5), 'screw CSV');
    await page.fill('[data-testid="input-alpha"]', '50');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'screw invalid');
    console.log('[PASS] power-screw-calculator');

    assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
    assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
    console.log('ALL BATCH 52 E2E TESTS PASSED!');
  } finally {
    await browser.close();
  }
})();
