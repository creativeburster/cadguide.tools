/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 59 Master E2E Suite:
 * 1. roof-pitch-calculator
 * 2. room-acoustics-rt60-calculator
 * 3. roundabout-capacity-calculator
 * 4. sand-casting-yield-calculator
 * 5. screw-torque-preload-calculator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B59_TERMS = [
  'ACI 318',
  'Eurocode 2',
  'IBC 2024',
  'ASCE 7',
  'ADA 2010',
  'NIST Special Publication',
  'ISO 80000',
  'BIPM SI',
  'ASME Y14.5',
  'HCM 6',
  'Highway Capacity Manual',
  'NCHRP 672',
  'FHWA',
  'ISO 286',
  'DIN 6935',
  'ISO 2768',
  'VDI 2230',
  'ISO 898',
  'ASME B1.1',
  'ISO 68-1',
  'ISO 273',
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
    // 1. roof-pitch-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/roof-pitch-calculator`, '[data-testid="input-len"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B59_TERMS, 'roof-pitch-calculator');
    approx(await page.locator('[data-testid="res-pitch"]').innerText(), 0.75, 'roof default pitch');
    approx(await page.locator('[data-testid="res-pitch12"]').innerText(), 9.0, 'roof default pitch12');
    approx(await page.locator('[data-testid="res-angle"]').innerText(), 36.87, 'roof default angle');
    approx(await page.locator('[data-testid="res-area"]').innerText(), 120.0, 'roof default area');
    approx(await page.locator('[data-testid="res-rafter"]').innerText(), 5.0, 'roof default rafter');

    await page.locator('[data-testid="input-len"]').fill('15');
    await page.locator('[data-testid="input-wid"]').fill('10');
    await page.locator('[data-testid="input-rise"]').fill('4');
    await page.locator('[data-testid="input-overhang"]').fill('0.5');
    approx(await page.locator('[data-testid="res-pitch"]').innerText(), 0.8, 'roof mod pitch');
    approx(await page.locator('[data-testid="res-angle"]').innerText(), 38.66, 'roof mod angle');
    approx(await page.locator('[data-testid="res-rafter"]').innerText(), 7.0434, 'roof mod rafter');
    approx(await page.locator('[data-testid="res-area"]').innerText(), 211.3, 'roof mod area');

    await page.locator('[data-testid="input-len"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'roof empty');
    await page.locator('[data-testid="input-len"]').fill('15');
    const [dl1] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv1 = await readDownloadText(dl1);
    assertAscii(csv1, 'roof CSV');
    assert(csv1.includes('7.0434'), 'roof CSV rafter check');
    console.log('[PASS] roof-pitch-calculator');

    // 2. room-acoustics-rt60-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/room-acoustics-rt60-calculator`, '[data-testid="input-l"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B59_TERMS, 'room-acoustics-rt60-calculator');
    approx(await page.locator('[data-testid="res-vol"]').innerText(), 240.0, 'rt60 default vol');
    approx(await page.locator('[data-testid="res-abs"]').innerText(), 19.26, 'rt60 default abs');
    approx(await page.locator('[data-testid="res-sabine"]').innerText(), 2.0075, 'rt60 default sabine');
    approx(await page.locator('[data-testid="res-eyring"]').innerText(), 1.9344, 'rt60 default eyring');

    await page.locator('[data-testid="input-l"]').fill('12');
    await page.locator('[data-testid="input-w"]').fill('10');
    await page.locator('[data-testid="input-h"]').fill('4');
    await page.locator('[data-testid="input-fa"]').fill('0.25');
    await page.locator('[data-testid="input-ca"]').fill('0.40');
    await page.locator('[data-testid="input-wa"]').fill('0.15');
    await page.locator('[data-testid="input-da"]').fill('0.10');
    await page.locator('[data-testid="input-darea"]').fill('4');
    await page.locator('[data-testid="input-wina"]').fill('0.20');
    await page.locator('[data-testid="input-winarea"]').fill('12');
    approx(await page.locator('[data-testid="res-abs"]').innerText(), 104.8, 'rt60 mod abs');
    approx(await page.locator('[data-testid="res-sabine"]').innerText(), 0.7379, 'rt60 mod sabine');
    approx(await page.locator('[data-testid="res-eyring"]').innerText(), 0.6404, 'rt60 mod eyring');

    await page.locator('[data-testid="input-l"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'rt60 empty');
    await page.locator('[data-testid="input-l"]').fill('12');
    const [dl2] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv2 = await readDownloadText(dl2);
    assertAscii(csv2, 'rt60 CSV');
    assert(csv2.includes('0.7379'), 'rt60 CSV sabine check');
    console.log('[PASS] room-acoustics-rt60-calculator');

    // 3. roundabout-capacity-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/roundabout-capacity-calculator`, '[data-testid="input-vc"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B59_TERMS, 'roundabout-capacity-calculator');
    approx(await page.locator('[data-testid="res-ce"]').innerText(), 533.77, 'rbt default ce');
    approx(await page.locator('[data-testid="res-vc"]').innerText(), 0.8993, 'rbt default vc');
    approx(await page.locator('[data-testid="res-reserve"]').innerText(), 53.77, 'rbt default reserve');

    await page.locator('[data-testid="input-vc"]').fill('600');
    await page.locator('[data-testid="input-demand"]').fill('700');
    await page.locator('[data-testid="input-a"]').fill('1420');
    await page.locator('[data-testid="input-b"]').fill('0.0009');
    approx(await page.locator('[data-testid="res-ce"]').innerText(), 827.5, 'rbt mod ce');
    approx(await page.locator('[data-testid="res-vc"]').innerText(), 0.8459, 'rbt mod vc');
    approx(await page.locator('[data-testid="res-reserve"]').innerText(), 127.5, 'rbt mod reserve');

    await page.locator('[data-testid="input-vc"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'rbt empty');
    await page.locator('[data-testid="input-vc"]').fill('600');
    const [dl3] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv3 = await readDownloadText(dl3);
    assertAscii(csv3, 'rbt CSV');
    assert(csv3.includes('827.50'), 'rbt CSV ce check');
    console.log('[PASS] roundabout-capacity-calculator');

    // 4. sand-casting-yield-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/sand-casting-yield-calculator`, '[data-testid="input-part"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B59_TERMS, 'sand-casting-yield-calculator');
    approx(await page.locator('[data-testid="res-yield"]').innerText(), 68.182, 'cast default yield');
    approx(await page.locator('[data-testid="res-pour"]').innerText(), 22.0, 'cast default pour');
    approx(await page.locator('[data-testid="res-charge"]').innerText(), 23.158, 'cast default charge');

    await page.locator('[data-testid="input-part"]').fill('12');
    await page.locator('[data-testid="input-cavities"]').fill('2');
    await page.locator('[data-testid="input-riser"]').fill('6');
    await page.locator('[data-testid="input-gating"]').fill('4');
    await page.locator('[data-testid="input-loss"]').fill('4');
    approx(await page.locator('[data-testid="res-pour"]').innerText(), 34.0, 'cast mod pour');
    approx(await page.locator('[data-testid="res-yield"]').innerText(), 70.588, 'cast mod yield');
    approx(await page.locator('[data-testid="res-charge"]').innerText(), 35.417, 'cast mod charge');

    await page.locator('[data-testid="input-part"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'cast empty');
    await page.locator('[data-testid="input-part"]').fill('12');
    const [dl4] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv4 = await readDownloadText(dl4);
    assertAscii(csv4, 'cast CSV');
    assert(csv4.includes('70.588'), 'cast CSV yield check');
    console.log('[PASS] sand-casting-yield-calculator');

    // 5. screw-torque-preload-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/screw-torque-preload-calculator`, '[data-testid="input-dia"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B59_TERMS, 'screw-torque-preload-calculator');
    approx(await page.locator('[data-testid="res-torque"]').innerText(), 72.835, 'screw default torque');
    approx(await page.locator('[data-testid="res-preload"]').innerText(), 40.464, 'screw default preload');
    approx(await page.locator('[data-testid="res-yield"]').innerText(), 53.952, 'screw default yield');

    await page.getByRole('button', { name: 'M16' }).click();
    await page.locator('[data-testid="input-yield"]').fill('900');
    await page.locator('[data-testid="input-pct"]').fill('80');
    await page.locator('[data-testid="input-k"]').fill('0.20');
    approx(await page.locator('[data-testid="res-yield"]').innerText(), 141.3, 'screw mod yield');
    approx(await page.locator('[data-testid="res-preload"]').innerText(), 113.04, 'screw mod preload');
    approx(await page.locator('[data-testid="res-torque"]').innerText(), 361.728, 'screw mod torque');
    await page.getByRole('button', { name: 'Copy' }).click();

    await page.locator('[data-testid="input-dia"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'screw empty');
    await page.locator('[data-testid="input-dia"]').fill('16');
    const [dl5] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv5 = await readDownloadText(dl5);
    assertAscii(csv5, 'screw CSV');
    assert(csv5.includes('361.7280'), 'screw CSV torque check');
    console.log('[PASS] screw-torque-preload-calculator');

    assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
    assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
    console.log('BATCH 59 E2E ALL PASSED (5/5)');
  } finally {
    await browser.close();
  }
})();
