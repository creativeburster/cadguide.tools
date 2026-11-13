/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * CADGuide.tools Toolbox - Master E2E Verification Suite for Batch 15 (Tools 71 to 75)
 *
 * Validates:
 * 71. column-buckling-calculator (Ideal Euler Pe/Fe + squash load Py + AISC 360 Ch. E Fcr/phi*Pn, theoretical vs recommended K, CSV/clipboard, negative template check)
 * 72. composite-section-calculator (Transformed section n=E2/E1, neutral axis y_bar, parallel-axis theorem It, restored stress sigma2=n*M*c2/It, CSV/clipboard, negative check)
 * 73. concrete-mix-design-calculator (ACI absolute volume method, sum(V)=1.0000 m3, Pavement Interactive preset, overflow warning, input defenses, CSV, negative check)
 * 74. concrete-slab-calculator (ACI 318M Table 7.3.1.1 l/20,l/24,l/28,l/10*(0.4+fy/700), Whitney flexural design & ACI 318-19 7.6.1.1 As_min=0.0018*b*h, CSV, negative check)
 * 75. concrete-slab-volume-calculator (Rectangular & Circular geometry, waste factor, editable bag weight/yield + Quikrete 1101 presets, input defenses, CSV, negative check)
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
    throw new Error(`[${context}] Downloaded script/file contains non-ASCII characters!`);
  }
}

async function verifyNoNaNOrInfinity(page, context) {
  const text = await page.innerText('body');
  if (text.includes('NaN')) {
    throw new Error(`[${context}] Found NaN text on page!`);
  }
  if (text.includes('Infinity')) {
    throw new Error(`[${context}] Found Infinity text on page!`);
  }
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
  const m = raw.match(/[-+]?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : NaN;
}

async function verifyDownloadCsv(page, buttonSelector, requiredSubstrings, context) {
  const downloadPromise = page.waitForEvent('download');
  await page.click(buttonSelector);
  const download = await downloadPromise;
  const dlPath = await download.path();
  const content = fs.readFileSync(dlPath, 'utf8');
  assertPureAscii(content, `${context} CSV`);
  for (const sub of requiredSubstrings) {
    if (!content.includes(sub)) {
      throw new Error(`[${context} CSV] Missing "${sub}" in exported CSV:\n${content}`);
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
    // =========================================================================
    // 71. column-buckling-calculator
    // =========================================================================
    console.log('Testing 71: column-buckling-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/column-buckling-calculator`, '[data-testid="input-length"]');

    // Default: A36 (E=200 GPa, Fy=250 MPa), Pinned K=1.0, L=2000 mm, rect 40x60 mm
    // A = 2400 mm2, Imin = 320000 mm4, r = 11.547 mm, KL/r = 173.205, limit = 133.219
    // Pe = pi^2 * 200000 * 320000 / 2000^2 = 157.9137 kN, Fe = 65.80 MPa, Py = 600 kN
    // AISC Elastic: Fcr = 0.877*Fe = 57.70 MPa, Pn = 138.49 kN, phi*Pn = 124.64 kN
    assertClose(await readLeadingNumber(page, 'result-euler-pe'), 157.91, 0.001, '71 default Euler Pe');
    assertClose(await readLeadingNumber(page, 'result-slenderness'), 173.2, 0.001, '71 default KL/r');
    assertClose(await readLeadingNumber(page, 'result-limit'), 133.2, 0.001, '71 default AISC limit');
    assertClose(await readLeadingNumber(page, 'result-radius'), 11.55, 0.001, '71 default r');
    assertClose(await readLeadingNumber(page, 'result-aisc-phipn'), 124.64, 0.001, '71 default AISC phi*Pn');

    // Switch to Fixed-Fixed recommended K=0.65 and Cantilever recommended K=2.10, then L=1000 mm (triggers inelastic Eq. E3-2 & Euler>Py warning)
    await page.selectOption('[data-testid="select-end"]', 'fixed-fixed');
    await page.click('[data-testid="k-mode-recommended"]');
    assertEqual(await page.locator('[data-testid="input-k"]').inputValue(), '0.65', '71 Fixed-Fixed rec K');

    await page.selectOption('[data-testid="select-end"]', 'cantilever');
    assertEqual(await page.locator('[data-testid="input-k"]').inputValue(), '2.10', '71 Cantilever rec K');

    await page.selectOption('[data-testid="select-end"]', 'pinned-pinned');
    await page.fill('[data-testid="input-k"]', '1.0');
    await page.fill('[data-testid="input-length"]', '1000');
    // KL/r = 86.6025 <= 133.2 -> Inelastic: Pe = 631.65 kN (> Py=600 kN), phi*Pn = 362.85 kN
    assertClose(await readLeadingNumber(page, 'result-euler-pe'), 631.65, 0.001, '71 L=1000 Euler Pe');
    assertClose(await readLeadingNumber(page, 'result-aisc-phipn'), 362.85, 0.001, '71 L=1000 AISC phi*Pn');
    await page.waitForSelector('[data-testid="yield-warning"]');

    // Circular section d=50, L=2000, K=1.0: I = pi*50^4/64 = 306796.1576 mm4, Pe = 151.3977 -> 151.40 kN
    await page.fill('[data-testid="input-length"]', '2000');
    await page.click('[data-testid="section-circular"]');
    assertClose(await readLeadingNumber(page, 'result-euler-pe'), 151.40, 0.001, '71 circular Pe');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['Euler_Pe,157.914', 'AISC_phi_Pn,124.641'], '71');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '71');

    // Input defense: empty & invalid strings -> '—'
    for (const badVal of ['', 'abc', '12abc', '0']) {
      await page.fill('[data-testid="input-length"]', badVal);
      assertEqual((await page.locator('[data-testid="result-euler-pe"]').innerText()).trim(), '—', `71 bad L="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `71 bad L="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['AWS D1.1', 'ISO 5817', 'ASME B30', 'Johnson parabolic'], '71 negative');
    passCount++;
    console.log('[PASS] 71. column-buckling-calculator');

    // =========================================================================
    // 72. composite-section-calculator
    // =========================================================================
    console.log('Testing 72: composite-section-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/composite-section-calculator`, '[data-testid="input-e1"]');

    // Default: E1=10, b1=100, h1=200, E2=200, b2=100, h2=20, M=20 kNm
    // n = 20.000, yBar = 173.33 mm, It = 22933.33 cm4, sigma1 = 15.12 MPa, sigma2 = 81.40 MPa (with n multiplier)
    assertClose(await readLeadingNumber(page, 'result-n'), 20.0, 0.001, '72 default n');
    assertClose(await readLeadingNumber(page, 'result-ybar'), 173.33, 0.001, '72 default yBar');
    assertClose(await readLeadingNumber(page, 'result-it'), 22933.33, 0.001, '72 default It');
    assertClose(await readLeadingNumber(page, 'result-sigma1'), 15.12, 0.001, '72 default sigma1');
    assertClose(await readLeadingNumber(page, 'result-sigma2'), 81.40, 0.001, '72 default sigma2');

    // Verify sigma2 detail proves n restoration (4.07 MPa * n 20.00)
    const sigma2Detail = await page.locator('[data-testid="result-sigma2-detail"]').innerText();
    if (!sigma2Detail.includes('4.07 MPa') || !sigma2Detail.includes('20.00')) {
      throw new Error(`[72 sigma2 restoration] Missing expected 4.07 MPa * n 20.00 in detail: ${sigma2Detail}`);
    }

    // Switch preset: Concrete + Steel Flange (E1=25, b1=300, h1=150, E2=200, b2=120, h2=12, M=35)
    // Hand calc:
    // n = 8, A1=45000, A2t=8*1440=11520, y1=75, y2=156, yBar=(45000*75+11520*156)/56520 = 91.5096 mm
    // It = 300*150^3/12 + 45000*(16.5096...)^2 + 8*120*12^3/12 + 11520*(64.4904...)^2 = 144,690,564.84 mm4 = 14469.06 cm4
    // sigma1 = 35e6 * 91.5096 / 144690564.84 = 22.1358 MPa; sigma2 = 8 * 35e6 * (162 - 91.5096) / 144690564.84 = 136.4106 MPa
    await page.click('[data-testid="preset-concrete-steel"]');
    assertClose(await readLeadingNumber(page, 'result-n'), 8.0, 0.001, '72 concrete-steel n');
    assertClose(await readLeadingNumber(page, 'result-ybar'), 91.51, 0.001, '72 concrete-steel yBar');
    assertClose(await readLeadingNumber(page, 'result-it'), 14469.06, 0.001, '72 concrete-steel It');
    assertClose(await readLeadingNumber(page, 'result-sigma1'), 22.14, 0.001, '72 concrete-steel sigma1');
    assertClose(await readLeadingNumber(page, 'result-sigma2'), 136.41, 0.001, '72 concrete-steel sigma2');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['n,20.0000', 'sigma2_top_actual,81.395'], '72');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '72');

    for (const badVal of ['', 'abc', '10px', '-5']) {
      await page.fill('[data-testid="input-e2"]', badVal);
      assertEqual((await page.locator('[data-testid="result-sigma2"]').innerText()).trim(), '—', `72 bad E2="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `72 bad E2="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['AWS D1.1', 'ISO 5817', 'ASME B30', 'n = E1/E2'], '72 negative');
    passCount++;
    console.log('[PASS] 72. composite-section-calculator');

    // =========================================================================
    // 73. concrete-mix-design-calculator
    // =========================================================================
    console.log('Testing 73: concrete-mix-design-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/concrete-mix-design-calculator`, '[data-testid="input-water"]');

    // Default: water=180, w/c=0.45 -> cement=400.00, air=2.0%, coarseRatio=0.65*1600=1040.00, fine=752.28, volSum=1.0000, dens=2372.28
    assertClose(await readLeadingNumber(page, 'result-cement'), 400.0, 0.001, '73 default cement');
    assertClose(await readLeadingNumber(page, 'result-water'), 180.0, 0.001, '73 default water');
    assertClose(await readLeadingNumber(page, 'result-coarse'), 1040.0, 0.001, '73 default coarse');
    assertClose(await readLeadingNumber(page, 'result-fine'), 752.28, 0.001, '73 default fine');
    assertClose(await readLeadingNumber(page, 'result-vol-sum'), 1.0, 0.001, '73 default vol sum');
    assertClose(await readLeadingNumber(page, 'result-density'), 2372.28, 0.001, '73 default density');

    // Pavement Interactive preset: water=148, w/c=0.39, air=5.5, coarseRatio=0.71, druw=1600 -> c=379.49, ca=1136, fa=666.99
    await page.click('[data-testid="preset-pavement-air"]');
    assertClose(await readLeadingNumber(page, 'result-cement'), 379.49, 0.001, '73 pavement cement');
    assertClose(await readLeadingNumber(page, 'result-coarse'), 1136.0, 0.001, '73 pavement coarse');
    assertClose(await readLeadingNumber(page, 'result-fine'), 666.99, 0.001, '73 pavement fine');
    assertClose(await readLeadingNumber(page, 'result-vol-sum'), 1.0, 0.001, '73 pavement vol sum');

    // Volume overflow test (set water to 700 -> exceeds 1.000 m3, must warn and output '—')
    await page.fill('[data-testid="input-water"]', '700');
    await page.waitForSelector('[data-testid="volume-overflow-warning"]');
    assertEqual((await page.locator('[data-testid="result-fine"]').innerText()).trim(), '—', '73 overflow fine must be dash');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['Portland Cement,400.000', 'Total,2372.284,1.00000'], '73');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '73');

    for (const badVal of ['', 'abc', '180kg']) {
      await page.fill('[data-testid="input-water"]', badVal);
      assertEqual((await page.locator('[data-testid="result-cement"]').innerText()).trim(), '—', `73 bad water="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `73 bad water="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['ADA 2010', 'IBC 2024', 'ASCE 7-22'], '73 negative');
    passCount++;
    console.log('[PASS] 73. concrete-mix-design-calculator');

    // =========================================================================
    // 74. concrete-slab-calculator
    // =========================================================================
    console.log('Testing 74: concrete-slab-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/concrete-slab-calculator`, '[data-testid="input-span"]');

    // Default: Simply supported l/20, span=4 m, h=200 mm, cover=25 mm (d=175 mm), wu=12, C=8 -> Mu=24.00, hmin=200.0, As=369.70, phiMn=24.00
    assertClose(await readLeadingNumber(page, 'result-hmin'), 200.0, 0.001, '74 default h_min');
    assertClose(await readLeadingNumber(page, 'result-mu'), 24.0, 0.001, '74 default Mu');
    assertClose(await readLeadingNumber(page, 'result-as-design'), 369.70, 0.001, '74 default As');
    assertClose(await readLeadingNumber(page, 'result-phimn'), 24.0, 0.001, '74 default phi*Mn');

    // Switch to Cantilever (l/10, C=2), span=2 m, fy=350 MPa -> fyMod = 0.4 + 350/700 = 0.90 -> h_min = (2000/10)*0.9 = 180.0 mm
    // Mu = 12 * 2^2 / 2 = 24.00 kNm/m; ACI 318-19 7.6.1.1 As_min = 0.0018*b*h = 0.0018*1000*200 = 360.00 mm2/m
    // As_req for d=175, fy=350, fc=28, Mu=24 -> 443.64 mm2/m -> As_design = 443.64
    await page.selectOption('[data-testid="select-support"]', 'cantilever');
    await page.fill('[data-testid="input-span"]', '2');
    await page.fill('[data-testid="input-fy"]', '350');
    assertClose(await readLeadingNumber(page, 'result-hmin'), 180.0, 0.001, '74 cantilever h_min');
    assertClose(await readLeadingNumber(page, 'result-mu'), 24.0, 0.001, '74 cantilever Mu');
    assertClose(await readLeadingNumber(page, 'result-as-design'), 443.64, 0.001, '74 cantilever As_design');
    const asBreakdown = await page.locator('[data-testid="result-as-breakdown"]').innerText();
    if (!asBreakdown.includes('360.00')) {
      throw new Error(`[74 As_min check] Expected Min As 360.00 (0.0018*b*h) in breakdown: ${asBreakdown}`);
    }

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['h_min_aci318,200.00', 'As_design,369.70'], '74');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '74');

    for (const badVal of ['', 'abc', '4m', '20']) {
      // thickness=20 <= cover=25 must return '—'
      await page.fill('[data-testid="input-thickness"]', badVal);
      assertEqual((await page.locator('[data-testid="result-mu"]').innerText()).trim(), '—', `74 bad thickness="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `74 bad thickness="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(
      page,
      ['sqrt(6*M/fc)', 'subgrade modulus', 'ADA 2010', 'IBC 2024', 'ASCE 7-22'],
      '74 negative'
    );
    passCount++;
    console.log('[PASS] 74. concrete-slab-calculator');

    // =========================================================================
    // 75. concrete-slab-volume-calculator
    // =========================================================================
    console.log('Testing 75: concrete-slab-volume-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/concrete-slab-volume-calculator`, '[data-testid="input-length"]');

    // Default: rect 10x5x150mm, waste=10% -> order=8.250 m3 (net=7.500), Quikrete 80 lb (36.2kg, 17.0 L) -> 486 bags, $3888.00
    assertClose(await readLeadingNumber(page, 'result-order-vol'), 8.25, 0.001, '75 default order vol');
    assertClose(await readLeadingNumber(page, 'result-bags'), 486, 0.001, '75 default bags');
    assertClose(await readLeadingNumber(page, 'result-cost'), 3888.0, 0.001, '75 default cost');

    // Switch to Quikrete 60 lb (12.7 L), waste=0%, rect 5x3x100 -> vol=1.500 m3 = 1500 L -> ceil(1500/12.7) = 119 bags, cost = $952.00
    await page.selectOption('[data-testid="select-bag-preset"]', 'quikrete-60');
    await page.fill('[data-testid="input-waste"]', '0');
    await page.fill('[data-testid="input-length"]', '5');
    await page.fill('[data-testid="input-width"]', '3');
    await page.fill('[data-testid="input-thickness"]', '100');
    assertClose(await readLeadingNumber(page, 'result-order-vol'), 1.5, 0.001, '75 modified order vol');
    assertClose(await readLeadingNumber(page, 'result-bags'), 119, 0.001, '75 modified bags');
    assertClose(await readLeadingNumber(page, 'result-cost'), 952.0, 0.001, '75 modified cost');

    // Switch to Circular Pad D=4m, T=150mm, waste=0% -> vol = pi*4^2/4 * 0.15 = 1.88496 m3 -> area = 12.57 m2
    await page.click('[data-testid="shape-circular"]');
    await page.fill('[data-testid="input-thickness"]', '150');
    assertClose(await readLeadingNumber(page, 'result-order-vol'), 1.885, 0.001, '75 circular vol');
    assertClose(await readLeadingNumber(page, 'result-area'), 12.57, 0.001, '75 circular area');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['order_volume_m3,8.2500', 'bags_needed,486'], '75');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '75');

    for (const badVal of ['', 'abc', '10m', '-1']) {
      await page.fill('[data-testid="input-length"]', badVal);
      assertEqual((await page.locator('[data-testid="result-order-vol"]').innerText()).trim(), '—', `75 bad L="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `75 bad L="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['ADA 2010', 'IBC 2024', 'ASCE 7-22'], '75 negative');
    passCount++;
    console.log('[PASS] 75. concrete-slab-volume-calculator');

    console.log(`\nALL ${passCount}/5 BATCH 15 CHECKS PASSED.`);
  } finally {
    await browser.close();
  }
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
