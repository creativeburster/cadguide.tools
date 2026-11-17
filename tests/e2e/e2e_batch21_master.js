/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * CADGuide.tools Toolbox - Master E2E Verification Suite for Batch 21 (Tools 101 to 105)
 *
 * Hand-calculated double-precision assertions (0.1% relative tolerance):
 * 101. drilling-time-calculator:
 *      Default: d=10, L=25, theta=118 (through), app=2, fn=0.20, n=800, kc=2000
 *      -> l_tip = 10/(2*tan(59deg)) = 3.0043 mm; L_tot = 30.0043 mm
 *      -> vf = 160.00 mm/min; Vc = pi*10*800/1000 = 25.133 m/min
 *      -> tm = 60*30.0043/160 = 11.252 s; Pc = 0.4189 kW; Mc = 5.000 N*m
 *      Branch: stainless-135 (blind, d=12, L=40, app=2, fn=0.15, n=1000, kc=2500) -> vf=150.00, tm=16.800 s, Pc=0.7069, Mc=6.750
 * 102. drywall-quantity-calculator:
 *      Default: gross=100, open=0, 1.2x2.4, waste=10%, screws=32/sheet, comp=0.45 kg/m2
 *      -> netA=100.00, reqA=110, sheetA=2.88 -> sheets=ceil(110/2.88)=39, screws=1248, comp=49.50 kg
 *      Alt: 120 m2 - 12 m2 openings, 1.2x3.0, 15%, 40/sheet, 0.50 -> sheets=35, screws=1400, comp=62.10 kg
 * 103. duct-pressure-loss-calculator:
 *      Default: Q=2000 m3/h, D=300 mm, L=20 m, k=0.15 mm, sumK=2.0, rho=1.204, nu=1.516e-5
 *      -> v=7.860 m/s, Re=155531, Colebrook lambda=0.01928, friction=47.797 Pa, fitting=74.373 Pa, total=122.170 Pa
 *      Alt: Q=3600, D=400, L=30, k=0.015, sumK=3.5 -> v=7.958 m/s, lambda=0.01580, total=178.597 Pa
 * 104. duct-size-friction-loss-calculator:
 *      Default Round: Q=1500, D=300, k=0.15 -> v=5.895 m/s, De=300.00, Dh=300.0, lambda=0.01992, dP/m=1.3891 Pa/m
 *      Rect (500x300, Q=2500): A=0.1500, De=419.98 mm (Huebscher), Dh=375.0 mm, v=4.630 m/s, lambda=0.01953, dP/m=0.6720 Pa/m
 * 105. duct-sizing-calculator:
 *      Default Circ: Q=1800, v=5.0, k=0.15 -> A=0.1000 m2, D=356.82 mm, Colebrook dP/m=0.8246 Pa/m
 *      Rect: AR=1.5, step=50 -> 350 x 300 mm, De=353.96 mm, actual v=4.762 m/s, dP/m=0.8505 Pa/m
 */

const { chromium } = require('playwright');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';

function assertClose(actual, expected, maxRelError = 0.001, context = '') {
  if (!Number.isFinite(actual)) {
    throw new Error(`[${context}] Expected finite number ${expected}, got ${actual}`);
  }
  const diff = Math.abs(actual - expected);
  const relError = expected === 0 ? diff : diff / Math.abs(expected);
  if (relError > maxRelError) {
    throw new Error(
      `[${context}] Value mismatch: actual ${actual} vs expected ${expected} (relative error ${(relError * 100).toFixed(4)}% > ${(maxRelError * 100).toFixed(4)}%)`
    );
  }
}

function assertEqual(actual, expected, context = '') {
  if (actual !== expected) {
    throw new Error(`[${context}] Expected "${expected}", got "${actual}"`);
  }
}

function assertPureAscii(text, context = '') {
  if (!/^[\x00-\x7F]*$/.test(text)) {
    throw new Error(`[${context}] Downloaded file contains non-ASCII characters!`);
  }
}

async function verifyNoNaNOrInfinity(page, context) {
  const text = await page.innerText('body');
  if (text.includes('NaN')) throw new Error(`[${context}] Found NaN text on page!`);
  if (text.includes('Infinity')) throw new Error(`[${context}] Found Infinity text on page!`);
}

async function verifyNegativeTermsOnToolPage(page, forbiddenTerms, context) {
  const scopedText = await page.evaluate(() => {
    const mainEl = document.querySelector('main');
    if (!mainEl) return '';
    const clone = mainEl.cloneNode(true);
    clone
      .querySelectorAll('a[href^="/toolbox/"], a[href^="/compare/"], a[href^="/convert/"]')
      .forEach((el) => el.remove());
    return clone.textContent || '';
  });
  for (const term of forbiddenTerms) {
    if (scopedText.includes(term)) {
      throw new Error(`[${context}] Found forbidden term "${term}" inside tool page!`);
    }
  }
}

async function openToolPage(page, url, readySelector) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector(readySelector);
  await page.waitForFunction((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    return Object.keys(el).some((k) => k.startsWith('__reactProps$') || k.startsWith('__reactFiber$'));
  }, readySelector);
}

async function readLeadingNumber(page, testId) {
  const raw = (await page.locator(`[data-testid="${testId}"]`).innerText()).trim();
  const cleaned = raw.replace(/[$,]/g, '');
  const m = cleaned.match(/[-+]?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : NaN;
}

async function verifyDownloadContains(page, buttonSelector, requiredSubstrings, context) {
  const downloadPromise = page.waitForEvent('download');
  await page.click(buttonSelector);
  const download = await downloadPromise;
  const dlPath = await download.path();
  const content = fs.readFileSync(dlPath, 'utf8');
  assertPureAscii(content, `${context} download`);
  for (const sub of requiredSubstrings) {
    if (!content.includes(sub)) {
      throw new Error(`[${context}] Missing "${sub}" in downloaded file:\n${content.slice(0, 500)}`);
    }
  }
}

async function verifyRejectedClipboardDoesNotReportCopied(page, buttonSelector, context) {
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: () => Promise.reject(new Error('Clipboard blocked in test')),
      },
    });
  });
  await page.click(buttonSelector);
  const label = (await page.locator(buttonSelector).innerText()).trim();
  if (label.includes('Copied')) {
    throw new Error(`[${context}] Clipboard writeText rejected yet button falsely showed "${label}"`);
  }
}

async function runTests() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  let passCount = 0;

  try {
    // 101. drilling-time-calculator
    console.log('Testing 101: drilling-time-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/drilling-time-calculator`, '[data-testid="input-hole-depth"]');
    assertClose(await readLeadingNumber(page, 'result-time'), 11.252, 0.001, '101 default time');
    assertClose(await readLeadingNumber(page, 'result-vf'), 160.0, 0.001, '101 default vf');
    assertClose(await readLeadingNumber(page, 'result-vc'), 25.133, 0.001, '101 default vc');
    assertClose(await readLeadingNumber(page, 'result-power'), 0.4189, 0.001, '101 default power');
    assertClose(await readLeadingNumber(page, 'result-torque'), 5.0, 0.001, '101 default torque');
    assertClose(await readLeadingNumber(page, 'result-travel'), 30.0043, 0.001, '101 default travel');

    await page.click('[data-testid="preset-stainless-135"]');
    assertClose(await readLeadingNumber(page, 'result-time'), 16.8, 0.001, '101 blind alt time');
    assertClose(await readLeadingNumber(page, 'result-vf'), 150.0, 0.001, '101 blind alt vf');
    assertClose(await readLeadingNumber(page, 'result-power'), 0.7069, 0.001, '101 blind alt power');
    assertClose(await readLeadingNumber(page, 'result-torque'), 6.75, 0.001, '101 blind alt torque');

    for (const bad of ['', 'abc', '10mm', '-5']) {
      await page.fill('[data-testid="input-hole-depth"]', bad);
      assertEqual((await page.locator('[data-testid="result-time"]').innerText()).trim(), '—', `101 bad="${bad}"`);
      await verifyNoNaNOrInfinity(page, `101 bad="${bad}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyDownloadContains(page, '[data-testid="export-csv-button"]', ['"Machining Time (tm)","11.252","s"', '"Drilling Torque (Mc)","5.000","N*m"'], '101 CSV');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '101');
    await verifyNegativeTermsOnToolPage(page, ['ISO 286-1', 'ASME B4.1', 'ASME Y14.5-2018', 'DIN 6935', 'ISO 2768'], '101 negative');
    passCount++;
    console.log('[PASS] 101. drilling-time-calculator');

    // 102. drywall-quantity-calculator
    console.log('Testing 102: drywall-quantity-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/drywall-quantity-calculator`, '[data-testid="input-gross-area"]');
    assertClose(await readLeadingNumber(page, 'result-sheets'), 39, 0.001, '102 default sheets');
    assertClose(await readLeadingNumber(page, 'result-screws'), 1248, 0.001, '102 default screws');
    assertClose(await readLeadingNumber(page, 'result-compound'), 49.5, 0.001, '102 default compound');
    assertClose(await readLeadingNumber(page, 'result-net-area'), 100.0, 0.001, '102 default net area');

    await page.click('[data-testid="preset-3m-board-openings"]');
    assertClose(await readLeadingNumber(page, 'result-sheets'), 35, 0.001, '102 alt sheets');
    assertClose(await readLeadingNumber(page, 'result-screws'), 1400, 0.001, '102 alt screws');
    assertClose(await readLeadingNumber(page, 'result-compound'), 62.1, 0.001, '102 alt compound');
    assertClose(await readLeadingNumber(page, 'result-net-area'), 108.0, 0.001, '102 alt net area');

    await page.fill('[data-testid="input-opening-area"]', '150');
    assertEqual((await page.locator('[data-testid="result-sheets"]').innerText()).trim(), '—', '102 opening>=gross');
    await page.fill('[data-testid="input-gross-area"]', '');
    assertEqual((await page.locator('[data-testid="result-sheets"]').innerText()).trim(), '—', '102 empty gross');
    await verifyNoNaNOrInfinity(page, '102 empty');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadContains(page, '[data-testid="export-csv-button"]', ['"Sheets Needed (Rounded Up)","39","sheets"', '"Total Drywall Screws","1248","pcs"'], '102 CSV');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '102');
    await verifyNegativeTermsOnToolPage(page, ['ACI 318-19', 'Eurocode 2', 'EN 1992-1-1', 'IBC 2024', 'ADA 2010'], '102 negative');
    passCount++;
    console.log('[PASS] 102. drywall-quantity-calculator');

    // 103. duct-pressure-loss-calculator
    console.log('Testing 103: duct-pressure-loss-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/duct-pressure-loss-calculator`, '[data-testid="input-airflow"]');
    assertClose(await readLeadingNumber(page, 'result-velocity'), 7.86, 0.001, '103 default velocity');
    assertClose(await readLeadingNumber(page, 'result-lambda'), 0.01928, 0.001, '103 default lambda');
    assertClose(await readLeadingNumber(page, 'result-friction-loss'), 47.797, 0.001, '103 default friction');
    assertClose(await readLeadingNumber(page, 'result-fitting-loss'), 74.373, 0.001, '103 default fitting');
    assertClose(await readLeadingNumber(page, 'result-total-loss'), 122.17, 0.001, '103 default total');

    await page.click('[data-testid="preset-smooth-pvc"]');
    assertClose(await readLeadingNumber(page, 'result-velocity'), 7.958, 0.001, '103 alt velocity');
    assertClose(await readLeadingNumber(page, 'result-lambda'), 0.0158, 0.001, '103 alt lambda');
    assertClose(await readLeadingNumber(page, 'result-total-loss'), 178.597, 0.001, '103 alt total');

    for (const bad of ['', 'abc', '0']) {
      await page.fill('[data-testid="input-diameter"]', bad);
      assertEqual((await page.locator('[data-testid="result-total-loss"]').innerText()).trim(), '—', `103 bad="${bad}"`);
      await verifyNoNaNOrInfinity(page, `103 bad="${bad}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyDownloadContains(page, '[data-testid="export-csv-button"]', ['"Total Pressure Loss","122.170","Pa"', '"Friction Factor (lambda)","0.01928"'], '103 CSV');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '103');
    await verifyNegativeTermsOnToolPage(page, ['ISO 6946', 'ASHRAE Standard 62.1'], '103 negative');
    passCount++;
    console.log('[PASS] 103. duct-pressure-loss-calculator');

    // 104. duct-size-friction-loss-calculator
    console.log('Testing 104: duct-size-friction-loss-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/duct-size-friction-loss-calculator`, '[data-testid="input-airflow"]');
    assertClose(await readLeadingNumber(page, 'result-velocity'), 5.895, 0.001, '104 round velocity');
    assertClose(await readLeadingNumber(page, 'result-dp-m'), 1.3891, 0.001, '104 round dp/m');
    assertClose(await readLeadingNumber(page, 'result-de'), 300.0, 0.001, '104 round De');
    assertClose(await readLeadingNumber(page, 'result-lambda'), 0.01992, 0.001, '104 round lambda');

    await page.click('[data-testid="btn-shape-rectangular"]');
    await page.fill('[data-testid="input-airflow"]', '2500');
    await page.fill('[data-testid="input-width"]', '500');
    await page.fill('[data-testid="input-height"]', '300');
    assertClose(await readLeadingNumber(page, 'result-de'), 419.98, 0.001, '104 rect Huebscher De');
    assertClose(await readLeadingNumber(page, 'result-dh'), 375.0, 0.001, '104 rect Dh');
    assertClose(await readLeadingNumber(page, 'result-velocity'), 4.63, 0.001, '104 rect velocity');
    assertClose(await readLeadingNumber(page, 'result-dp-m'), 0.672, 0.001, '104 rect dp/m');

    await page.fill('[data-testid="input-width"]', '');
    assertEqual((await page.locator('[data-testid="result-dp-m"]').innerText()).trim(), '—', '104 empty width');
    await verifyNoNaNOrInfinity(page, '104 empty');
    await page.click('[data-testid="reset-button"]');
    await verifyDownloadContains(page, '[data-testid="export-csv-button"]', ['"Specific Friction Loss","1.3891","Pa/m"'], '104 CSV');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '104');
    await verifyNegativeTermsOnToolPage(page, ['Crane Technical Paper', 'ASME B31.3', 'ANSI/HI 9.6.1', 'ISO 4413', 'Galvanized steel sheet'], '104 negative');
    passCount++;
    console.log('[PASS] 104. duct-size-friction-loss-calculator');

    // 105. duct-sizing-calculator
    console.log('Testing 105: duct-sizing-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/duct-sizing-calculator`, '[data-testid="input-airflow"]');
    assertClose(await readLeadingNumber(page, 'result-area'), 0.1, 0.001, '105 circ area');
    assertClose(await readLeadingNumber(page, 'result-diameter'), 356.82, 0.001, '105 circ dia');
    assertClose(await readLeadingNumber(page, 'result-friction-rate'), 0.8246, 0.001, '105 circ dp/m');

    await page.click('[data-testid="btn-shape-rectangular"]');
    assertEqual((await page.locator('[data-testid="result-rect-size"]').innerText()).trim(), '350 x 300', '105 rect size');
    assertClose(await readLeadingNumber(page, 'result-diameter'), 353.96, 0.001, '105 rect De');
    assertClose(await readLeadingNumber(page, 'result-actual-vel'), 4.762, 0.001, '105 rect actual vel');
    assertClose(await readLeadingNumber(page, 'result-friction-rate'), 0.8505, 0.001, '105 rect dp/m');

    for (const bad of ['', 'abc', '0']) {
      await page.fill('[data-testid="input-velocity"]', bad);
      assertEqual((await page.locator('[data-testid="result-friction-rate"]').innerText()).trim(), '—', `105 bad="${bad}"`);
      await verifyNoNaNOrInfinity(page, `105 bad="${bad}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyDownloadContains(page, '[data-testid="export-csv-button"]', ['"Circular Diameter","356.82","mm"', '"Specific Friction Loss","0.8246","Pa/m"'], '105 CSV');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '105');
    await verifyNegativeTermsOnToolPage(page, ['ISO 6946', 'ASHRAE Standard 62.1', '0.018'], '105 negative');
    passCount++;
    console.log('[PASS] 105. duct-sizing-calculator');

    console.log(`\nSUMMARY: PASS=${passCount} FAIL=0`);
  } finally {
    await browser.close();
  }
}

runTests().catch((err) => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
