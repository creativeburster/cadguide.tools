/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 50 Master E2E Suite (#246-#250):
 * 246. pile-capacity-calculator
 * 247. pile-group-efficiency-calculator
 * 248. pile-lateral-capacity-calculator
 * 249. pipe-flow-rate-calculator
 * 250. pipe-friction-head-loss
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B50_TERMS = [
  'Eurocode 7',
  'FHWA',
  'ASTM D1557',
  'AASHTO',
  'Broms',
  'ISO 281:2007',
  'ISO 76',
  'ANSI/ABMA',
  'Crane Technical Paper No. 410',
  'ASME B31.3',
  'ANSI/HI 9.6.1',
  'ISO 4413',
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

async function verifyNegativeTerms(page, terms, label) {
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
    assert(!scopedText.includes(term), `${label}: forbidden term "${term}" present`);
  }
}

async function assertZeroNumberInputs(main, label) {
  const cnt = await main.locator('input[type="number"]').count();
  assert.strictEqual(cnt, 0, `${label}: found ${cnt} <input type="number">`);
}

async function assertClipboardRejectSafe(page, main, label) {
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('denied')) },
    });
  });
  await main.locator('[data-testid="btn-copy"]').click();
  await page.waitForTimeout(50);
  const copyTxt = await main.locator('[data-testid="btn-copy"]').innerText();
  assert(!/Copied/i.test(copyTxt), `${label}: btn-copy must not show Copied on rejection`);
  await assertNoNan(main, `${label} clipboard-reject`);
}

async function runTests() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('response', (res) => {
    if (res.status() >= 400 && !res.url().includes('favicon')) {
      failedRequests.push(`${res.status()} ${res.url()}`);
    }
  });

  // 246. pile-capacity-calculator
  {
    const label = '246 pile-capacity-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/pile-capacity-calculator`, '[data-testid="input-dia"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B50_TERMS, label);

    approx(await main.locator('[data-testid="out-qb"]').innerText(), 127.2345, `${label} default Qb`);
    approx(await main.locator('[data-testid="out-qs"]').innerText(), 706.8583, `${label} default Qs`);
    approx(await main.locator('[data-testid="out-qu"]').innerText(), 834.0928, `${label} default Qu`);
    approx(await main.locator('[data-testid="out-qa"]').innerText(), 333.6371, `${label} default Qa`);

    await main.locator('[data-testid="preset-large-bored-800"]').click();
    approx(await main.locator('[data-testid="out-qb"]').innerText(), 339.292, `${label} p2 Qb`);
    approx(await main.locator('[data-testid="out-qs"]').innerText(), 1696.46, `${label} p2 Qs`);
    approx(await main.locator('[data-testid="out-qu"]').innerText(), 2035.752, `${label} p2 Qu`);
    approx(await main.locator('[data-testid="out-qa"]').innerText(), 678.584, `${label} p2 Qa`);

    await main.locator('[data-testid="input-alpha"]').fill('1.2');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} invalid alpha`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-qu"]').innerText(), 834.0928, `${label} reset`);

    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('Total Ultimate Capacity Qu,834.0928,kN'), `${label} CSV missing Qu`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 247. pile-group-efficiency-calculator
  {
    const label = '247 pile-group-efficiency-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/pile-group-efficiency-calculator`, '[data-testid="input-dia"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B50_TERMS, label);

    approx(await main.locator('[data-testid="out-eta"]').innerText(), 72.689, `${label} default eta`);
    approx(await main.locator('[data-testid="out-group-cap"]').innerText(), 6214.9065, `${label} default Qgroup`);
    approx(await main.locator('[data-testid="out-ratio"]').innerText(), 3.0, `${label} default ratio`);

    await main.locator('[data-testid="preset-grid-2x4"]').click();
    approx(await main.locator('[data-testid="out-eta"]').innerText(), 74.3959, `${label} 2x4 eta`);
    approx(await main.locator('[data-testid="out-group-cap"]').innerText(), 4761.3379, `${label} 2x4 Qgroup`);

    await main.locator('[data-testid="input-spacing"]').fill('400');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} s <= D`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-group-cap"]').innerText(), 6214.9065, `${label} reset`);

    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('Group Ultimate Capacity,6214.9065,kN'), `${label} CSV missing Qgroup`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 248. pile-lateral-capacity-calculator
  {
    const label = '248 pile-lateral-capacity-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/pile-lateral-capacity-calculator`, '[data-testid="input-dia"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B50_TERMS, label);

    approx(await main.locator('[data-testid="out-hu"]').innerText(), 609.1389, `${label} default free Hu`);
    approx(await main.locator('[data-testid="out-ha"]').innerText(), 243.6556, `${label} default free Ha`);
    approx(await main.locator('[data-testid="out-mmax"]').innerText(), 1431.9572, `${label} default free Mmax`);

    await main.locator('[data-testid="head-fixed"]').click();
    approx(await main.locator('[data-testid="out-hu"]').innerText(), 2246.4, `${label} fixed Hu`);
    approx(await main.locator('[data-testid="out-ha"]').innerText(), 898.56, `${label} fixed Ha`);
    approx(await main.locator('[data-testid="out-mmax"]').innerText(), 8087.04, `${label} fixed Mmax`);

    await main.locator('[data-testid="input-len"]').fill('1.0');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} L <= 1.5D`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-hu"]').innerText(), 609.1389, `${label} reset`);

    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('Ultimate Lateral Resistance Hu,609.1389,kN'), `${label} CSV missing Hu`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 249. pipe-flow-rate-calculator
  {
    const label = '249 pipe-flow-rate-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/pipe-flow-rate-calculator`, '[data-testid="input-dia"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B50_TERMS, label);

    approx(await main.locator('[data-testid="out-qls"]').innerText(), 15.708, `${label} default Q L/s`);
    approx(await main.locator('[data-testid="out-qm3h"]').innerText(), 56.5487, `${label} default Q m3/h`);
    approx(await main.locator('[data-testid="out-f"]').innerText(), 0.022979, `${label} default f`);
    approx(await main.locator('[data-testid="out-hf100"]').innerText(), 4.6864, `${label} default hf100`);

    await main.locator('[data-testid="preset-laminar-25"]').click();
    approx(await main.locator('[data-testid="out-qls"]').innerText(), 0.0245, `${label} laminar Q L/s`);
    approx(await main.locator('[data-testid="out-f"]').innerText(), 0.051405, `${label} laminar f`);
    approx(await main.locator('[data-testid="out-hf100"]').innerText(), 0.0262, `${label} laminar hf100`);

    await main.locator('[data-testid="input-nu"]').fill('0');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} nu <= 0`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-qls"]').innerText(), 15.708, `${label} reset`);

    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('Darcy Friction Factor f,0.022979,dimensionless'), `${label} CSV missing f`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 250. pipe-friction-head-loss
  {
    const label = '250 pipe-friction-head-loss';
    await openToolPage(page, `${BASE_URL}/toolbox/pipe-friction-head-loss`, '[data-testid="input-flow"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B50_TERMS, label);

    approx(await main.locator('[data-testid="out-velocity"]').innerText(), 0.8289, `${label} hw velocity`);
    approx(await main.locator('[data-testid="out-hf"]').innerText(), 0.8556, `${label} hw hf`);
    approx(await main.locator('[data-testid="out-dp"]').innerText(), 8.3908, `${label} hw dP`);
    approx(await main.locator('[data-testid="out-unit-dp"]').innerText(), 0.083908, `${label} hw unit dP`);

    await main.locator('[data-testid="preset-dw-steel"]').click();
    approx(await main.locator('[data-testid="out-velocity"]').innerText(), 1.2732, `${label} dw velocity`);
    approx(await main.locator('[data-testid="out-hf"]').innerText(), 3.2399, `${label} dw hf`);
    approx(await main.locator('[data-testid="out-dp"]').innerText(), 31.7722, `${label} dw dP`);
    approx(await main.locator('[data-testid="out-unit-dp"]').innerText(), 0.158861, `${label} dw unit dP`);

    await main.locator('[data-testid="input-flow"]').fill('');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} empty flow`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-hf"]').innerText(), 0.8556, `${label} reset`);

    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('Friction Head Loss,0.8556,m'), `${label} CSV missing hf`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  await browser.close();
  assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
  assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
  assert.strictEqual(failedRequests.length, 0, `Failed requests: ${failedRequests.join('; ')}`);
  console.log('ALL BATCH 50 E2E TESTS PASSED!');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
