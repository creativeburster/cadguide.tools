/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 65 Master E2E Suite:
 * 1. spot-weld-calculator
 * 2. spring-design-calculator
 * 3. spring-force-rate-calculator
 * 4. stack-height-calculator
 * 5. stair-design-calculator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B65_TERMS = [
  'AWS C1.1',
  'ASME BPVC',
  'EN 13906',
  'ASTM E8',
  'FKM',
  'ASTM A228',
  'ASTM A229',
  'ASTM A313',
  'ASTM B159',
  'IBC',
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
  page.on('pageerror', (err) => {
    pageErrors.push(String(err));
  });

  // 1. spot-weld-calculator
  {
    const label = 'spot-weld-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/${label}`, '[data-testid="input-thickness"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B65_TERMS, label);
    const main = page.locator('main').last();
    await assertNoNan(main, `${label} default`);

    approx(await page.locator('[data-testid="output-dn"]').innerText(), 6.123724, `${label} def dn`);
    approx(await page.locator('[data-testid="output-area"]').innerText(), 29.452431, `${label} def area`);
    approx(await page.locator('[data-testid="output-shear"]').innerText(), 7.363108, `${label} def shear`);
    approx(await page.locator('[data-testid="output-pressure"]').innerText(), 101.859164, `${label} def pressure`);
    approx(await page.locator('[data-testid="output-spacing"]').innerText(), 48.989795, `${label} def spacing`);

    await page.fill('[data-testid="input-thickness"]', '2.0');
    await page.fill('[data-testid="input-shear"]', '300');
    await page.fill('[data-testid="input-force"]', '4.5');
    await page.fill('[data-testid="input-kn"]', '4.5');
    await page.fill('[data-testid="input-ks"]', '8.0');

    await assertNoNan(main, `${label} mod`);
    approx(await page.locator('[data-testid="output-dn"]').innerText(), 6.363961, `${label} mod dn`);
    approx(await page.locator('[data-testid="output-area"]').innerText(), 31.808626, `${label} mod area`);
    approx(await page.locator('[data-testid="output-shear"]').innerText(), 9.542588, `${label} mod shear`);
    approx(await page.locator('[data-testid="output-pressure"]').innerText(), 141.471061, `${label} mod pressure`);
    approx(await page.locator('[data-testid="output-spacing"]').innerText(), 50.911688, `${label} mod spacing`);

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('9.542588') && csv.includes('141.471061'), `${label} csv values missing`);

    await page.fill('[data-testid="input-thickness"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(main, `${label} empty`);
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-shear"]').innerText(), 7.363108, `${label} reset shear`);
    console.log(`[PASS] ${label}`);
  }

  // 2. spring-design-calculator
  {
    const label = 'spring-design-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/${label}`, '[data-testid="input-d"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B65_TERMS, label);
    const main = page.locator('main').last();
    await assertNoNan(main, `${label} default`);

    approx(await page.locator('[data-testid="output-c"]').innerText(), 6.666667, `${label} def C`);
    approx(await page.locator('[data-testid="output-k"]').innerText(), 10.036406, `${label} def k`);
    approx(await page.locator('[data-testid="output-defl"]').innerText(), 9.963726, `${label} def defl`);
    approx(await page.locator('[data-testid="output-kw"]').innerText(), 1.224603, `${label} def Kw`);
    approx(await page.locator('[data-testid="output-tau"]').innerText(), 230.994502, `${label} def tau`);

    await page.click('[data-testid="preset-stainless"]');
    await page.fill('[data-testid="input-d"]', '4');
    await page.fill('[data-testid="input-D"]', '28');
    await page.fill('[data-testid="input-N"]', '8');
    await page.fill('[data-testid="input-F"]', '250');

    await assertNoNan(main, `${label} mod`);
    approx(await page.locator('[data-testid="output-c"]').innerText(), 7.0, `${label} mod C`);
    approx(await page.locator('[data-testid="output-k"]').innerText(), 12.572886, `${label} mod k`);
    approx(await page.locator('[data-testid="output-defl"]').innerText(), 19.884058, `${label} mod defl`);
    approx(await page.locator('[data-testid="output-kw"]').innerText(), 1.212857, `${label} mod Kw`);
    approx(await page.locator('[data-testid="output-tau"]').innerText(), 337.806367, `${label} mod tau`);

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('12.572886') && csv.includes('337.806367'), `${label} csv values missing`);

    await page.fill('[data-testid="input-d"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(main, `${label} empty`);
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-k"]').innerText(), 10.036406, `${label} reset k`);
    console.log(`[PASS] ${label}`);
  }

  // 3. spring-force-rate-calculator
  {
    const label = 'spring-force-rate-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/${label}`, '[data-testid="input-d"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B65_TERMS, label);
    const main = page.locator('main').last();
    await assertNoNan(main, `${label} default`);

    approx(await page.locator('[data-testid="output-dmean"]').innerText(), 18.0, `${label} def D`);
    approx(await page.locator('[data-testid="output-index"]').innerText(), 9.0, `${label} def C`);
    approx(await page.locator('[data-testid="output-rate"]').innerText(), 2.719479, `${label} def rate`);
    approx(await page.locator('[data-testid="output-hs"]').innerText(), 24.0, `${label} def Hs`);
    approx(await page.locator('[data-testid="output-smax"]').innerText(), 56.0, `${label} def smax`);
    approx(await page.locator('[data-testid="output-force"]').innerText(), 40.792181, `${label} def force`);
    approx(await page.locator('[data-testid="output-kgf"]').innerText(), 4.159645, `${label} def kgf`);
    approx(await page.locator('[data-testid="output-tau"]').innerText(), 271.604419, `${label} def tau`);
    approx(await page.locator('[data-testid="output-ratio"]').innerText(), 41.785295, `${label} def ratio`);

    await page.click('[data-testid="preset-stainless"]');
    await page.fill('[data-testid="input-d"]', '3.0');
    await page.fill('[data-testid="input-od"]', '25.0');
    await page.fill('[data-testid="input-na"]', '8');
    await page.fill('[data-testid="input-l0"]', '90');
    await page.fill('[data-testid="input-delta"]', '20');
    await page.fill('[data-testid="input-tau-allow"]', '550');

    await assertNoNan(main, `${label} mod`);
    approx(await page.locator('[data-testid="output-dmean"]').innerText(), 22.0, `${label} mod D`);
    approx(await page.locator('[data-testid="output-rate"]').innerText(), 8.201364, `${label} mod rate`);
    approx(await page.locator('[data-testid="output-force"]').innerText(), 164.027282, `${label} mod force`);
    approx(await page.locator('[data-testid="output-kgf"]').innerText(), 16.726128, `${label} mod kgf`);
    approx(await page.locator('[data-testid="output-tau"]').innerText(), 409.187573, `${label} mod tau`);
    approx(await page.locator('[data-testid="output-ratio"]').innerText(), 74.397741, `${label} mod ratio`);

    await page.click('[data-testid="copy-btn"]');

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('164.027282') && csv.includes('16.726128'), `${label} csv values missing`);

    await page.fill('[data-testid="input-d"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(main, `${label} empty`);
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-force"]').innerText(), 40.792181, `${label} reset force`);
    console.log(`[PASS] ${label}`);
  }

  // 4. stack-height-calculator
  {
    const label = 'stack-height-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/${label}`, '[data-testid="input-dp"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B65_TERMS, label);
    const main = page.locator('main').last();
    await assertNoNan(main, `${label} default`);

    approx(await page.locator('[data-testid="output-rho-a"]').innerText(), 1.183892, `${label} def rhoA`);
    approx(await page.locator('[data-testid="output-rho-s"]').innerText(), 0.615855, `${label} def rhoS`);
    approx(await page.locator('[data-testid="output-dpm"]').innerText(), 5.570539, `${label} def dpm`);
    approx(await page.locator('[data-testid="output-height"]').innerText(), 8.975792, `${label} def height`);

    await page.fill('[data-testid="input-dp"]', '120');
    await page.fill('[data-testid="input-ts"]', '250');
    await page.fill('[data-testid="input-ta"]', '15');

    await assertNoNan(main, `${label} mod`);
    approx(await page.locator('[data-testid="output-rho-a"]').innerText(), 1.224978, `${label} mod rhoA`);
    approx(await page.locator('[data-testid="output-rho-s"]').innerText(), 0.674716, `${label} mod rhoS`);
    approx(await page.locator('[data-testid="output-dpm"]').innerText(), 5.396232, `${label} mod dpm`);
    approx(await page.locator('[data-testid="output-height"]').innerText(), 22.237738, `${label} mod height`);

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('22.237738') && csv.includes('5.396232'), `${label} csv values missing`);

    await page.fill('[data-testid="input-dp"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(main, `${label} empty`);
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-height"]').innerText(), 8.975792, `${label} reset height`);
    console.log(`[PASS] ${label}`);
  }

  // 5. stair-design-calculator
  {
    const label = 'stair-design-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/${label}`, '[data-testid="input-rise"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B65_TERMS, label);
    const main = page.locator('main').last();
    await assertNoNan(main, `${label} default`);

    approx(await page.locator('[data-testid="output-risers"]').innerText(), 16, `${label} def nR`);
    approx(await page.locator('[data-testid="output-riser-h"]').innerText(), 175, `${label} def R`);
    approx(await page.locator('[data-testid="output-treads"]').innerText(), 15, `${label} def nT`);
    approx(await page.locator('[data-testid="output-run"]').innerText(), 4200, `${label} def run`);
    approx(await page.locator('[data-testid="output-angle"]').innerText(), 32.005383, `${label} def angle`);
    approx(await page.locator('[data-testid="output-blondel"]').innerText(), 630, `${label} def blondel`);
    approx(await page.locator('[data-testid="output-stringer"]').innerText(), 5047.771786, `${label} def stringer`);

    await page.fill('[data-testid="input-rise"]', '3200');
    await page.fill('[data-testid="input-ideal-riser"]', '170');
    await page.fill('[data-testid="input-tread"]', '270');

    await assertNoNan(main, `${label} mod`);
    approx(await page.locator('[data-testid="output-risers"]').innerText(), 19, `${label} mod nR`);
    approx(await page.locator('[data-testid="output-riser-h"]').innerText(), 168.421053, `${label} mod R`);
    approx(await page.locator('[data-testid="output-treads"]').innerText(), 18, `${label} mod nT`);
    approx(await page.locator('[data-testid="output-run"]').innerText(), 4860, `${label} mod run`);
    approx(await page.locator('[data-testid="output-angle"]').innerText(), 31.955159, `${label} mod angle`);
    approx(await page.locator('[data-testid="output-blondel"]').innerText(), 606.842105, `${label} mod blondel`);
    approx(await page.locator('[data-testid="output-stringer"]').innerText(), 5818.90024, `${label} mod stringer`);

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('5818.900240') && csv.includes('606.842105'), `${label} csv values missing`);

    await page.click('[data-testid="unit-imperial"]');
    await assertNoNan(main, `${label} imperial`);

    await page.fill('[data-testid="input-rise"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(main, `${label} empty`);
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-stringer"]').innerText(), 5047.771786, `${label} reset stringer`);
    console.log(`[PASS] ${label}`);
  }

  assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
  assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);

  await browser.close();
  console.log('ALL_BATCH65_PASSED');
})();
