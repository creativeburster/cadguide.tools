/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * CADGuide.tools Toolbox - Master E2E Verification Suite for Batch 19 (Tools 91 to 95)
 *
 * Validates:
 * 91. damping-ratio-calculator (SDOF k/m/c, c=0 undamped, zeta=1 critical, zeta>1 overdamped displays '—' with zero NaN, rejects VDI 2230/ISO 898-1)
 * 92. deep-drawing-calculator (Cylindrical beta=1.8182, Fd=48.47 kN, Fbh=10.53 kN, Total=59.00 kN, cup height mode, D0<=d rejection, rejects DIN 8584)
 * 93. deflection-angle-calculator (Corrected UDL theta(x)=q(L^3-6Lx^2+4x^3)/(24EI) -> zero slope at midspan x=2.5m, cantilever mode, rejects old wrong formula)
 * 94. density-unit-converter (Fixed g/cm3 key match -> 7.85 = 7850 kg/m3, 490.0595 lb/ft3, 0.283599 lb/in3, Swap button, rejects 62.43 approximation)
 * 95. die-casting-pressure-calculator (Clamp=1000.00 kN, dynamic vg=40.000 m/s -> changing gate area 50->100 dynamically halves vg to 20.000 m/s, reverse mode)
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
  const cleaned = raw.replace(/[$,]/g, '');
  const m = cleaned.match(/[-+]?\d+(?:\.\d+)?/);
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
    // 91. damping-ratio-calculator
    // =========================================================================
    console.log('Testing 91: damping-ratio-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/damping-ratio-calculator`, '[data-testid="input-stiffness"]');

    // Default: k=10000, m=5, c=50 -> zeta=0.111803, fn=7.118 Hz, fd=7.073 Hz, delta=0.706914
    assertClose(await readLeadingNumber(page, 'result-zeta'), 0.111803, 0.001, '91 default zeta');
    assertClose(await readLeadingNumber(page, 'result-fn'), 7.118, 0.001, '91 default fn');
    assertClose(await readLeadingNumber(page, 'result-fd'), 7.073, 0.001, '91 default fd');
    assertClose(await readLeadingNumber(page, 'result-delta'), 0.706914, 0.001, '91 default delta');

    // Overdamped preset: k=10000, m=5, c=600 -> zeta=1.341641, fd & delta must be '—' with zero NaN
    await page.click('[data-testid="preset-overdamped"]');
    assertClose(await readLeadingNumber(page, 'result-zeta'), 1.341641, 0.001, '91 overdamped zeta');
    assertEqual((await page.locator('[data-testid="result-fd"]').innerText()).trim(), '—', '91 overdamped fd');
    assertEqual((await page.locator('[data-testid="result-delta"]').innerText()).trim(), '—', '91 overdamped delta');
    await verifyNoNaNOrInfinity(page, '91 overdamped');

    // Undamped c=0 allowed: k=10000, m=5, c=0 -> zeta=0, fd=fn=7.118 Hz
    await page.click('[data-testid="reset-button"]');
    await page.fill('[data-testid="input-damping"]', '0');
    assertClose(await readLeadingNumber(page, 'result-zeta'), 0, 0.001, '91 undamped zeta');
    assertClose(await readLeadingNumber(page, 'result-fd'), 7.118, 0.001, '91 undamped fd');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['damping_ratio_zeta,0.111803', 'log_decrement_delta,0.706914'], '91');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '91');

    for (const badVal of ['', 'abc', '10k', '0']) {
      await page.fill('[data-testid="input-stiffness"]', badVal);
      assertEqual((await page.locator('[data-testid="result-zeta"]').innerText()).trim(), '—', `91 bad k="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `91 bad k="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['VDI 2230', 'ISO 898-1', 'ASME B1.1', 'ISO 273'], '91 negative');
    passCount++;
    console.log('[PASS] 91. damping-ratio-calculator');

    // =========================================================================
    // 92. deep-drawing-calculator
    // =========================================================================
    console.log('Testing 92: deep-drawing-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/deep-drawing-calculator`, '[data-testid="input-punch-dia"]');

    // Default: d=55, D0=100, t=1.2, Rm=340, eta=1.15, pbh=2 -> beta=1.8182, Fd=48.47, Fbh=10.53, Total=59.00 kN
    assertClose(await readLeadingNumber(page, 'result-beta'), 1.8182, 0.001, '92 default beta');
    assertClose(await readLeadingNumber(page, 'result-draw-force'), 48.47, 0.001, '92 default Fd');
    assertClose(await readLeadingNumber(page, 'result-bh-force'), 10.53, 0.001, '92 default Fbh');
    assertClose(await readLeadingNumber(page, 'result-total-force'), 59.0, 0.001, '92 default Total');

    // Cup height mode with h=31.705 -> D0 ~ 100.00 mm -> beta ~ 1.8182
    await page.click('[data-testid="mode-height"]');
    assertClose(await readLeadingNumber(page, 'result-beta'), 1.8182, 0.001, '92 cup height mode beta');

    // Switch back to direct and test D0 <= d error defense (D0=50 <= d=55)
    await page.click('[data-testid="mode-direct"]');
    await page.fill('[data-testid="input-blank-dia"]', '50');
    assertEqual((await page.locator('[data-testid="result-total-force"]').innerText()).trim(), '—', '92 D0<=d rejected');
    await page.waitForSelector('[data-testid="error-banner"]');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['drawing_ratio_beta,1.8182', 'total_press_force,59.000'], '92');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '92');

    for (const badVal of ['', 'abc', '55mm', '0']) {
      await page.fill('[data-testid="input-punch-dia"]', badVal);
      assertEqual((await page.locator('[data-testid="result-beta"]').innerText()).trim(), '—', `92 bad d="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `92 bad d="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['DIN 8584', 'ISO 286-1', 'ASME Y14.5-2018', 'DIN 6935'], '92 negative');
    passCount++;
    console.log('[PASS] 92. deep-drawing-calculator');

    // =========================================================================
    // 93. deflection-angle-calculator
    // =========================================================================
    console.log('Testing 93: deflection-angle-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/deflection-angle-calculator`, '[data-testid="input-load"]');

    // Default ss-udl: q=10 kN/m, L=5, x=1.25, E=200 GPa, I=5000 cm4 -> slope=0.003581 rad, w(1.25)=5.798 mm, max=8.138 mm
    assertClose(await readLeadingNumber(page, 'result-slope'), 0.003581, 0.001, '93 default slope at x=1.25');
    assertClose(await readLeadingNumber(page, 'result-deflection-x'), 5.798, 0.001, '93 default defl at x=1.25');
    assertClose(await readLeadingNumber(page, 'result-deflection-max'), 8.138, 0.001, '93 default max defl');

    // Midspan x=2.5 m symmetry check: slope MUST be 0.000000 rad (verifying old buggy formula fix!)
    await page.fill('[data-testid="input-x"]', '2.5');
    assertClose(await readLeadingNumber(page, 'result-slope'), 0, 0.0001, '93 midspan zero slope');
    assertClose(await readLeadingNumber(page, 'result-deflection-x'), 8.138, 0.001, '93 midspan max defl');

    // Cantilever point load P=10 kN, L=5 m, x=5 m -> theta=P*L^2/(2EI) = 10000*25/(2e7) = 0.012500 rad, delta=41.667 mm
    await page.selectOption('[data-testid="select-load-case"]', 'cant-point');
    await page.fill('[data-testid="input-x"]', '5');
    assertClose(await readLeadingNumber(page, 'result-slope'), 0.0125, 0.001, '93 cantilever tip slope');
    assertClose(await readLeadingNumber(page, 'result-deflection-max'), 41.667, 0.001, '93 cantilever max defl');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['slope_at_x,0.003581,rad', 'max_deflection,8.138,mm'], '93');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '93');

    for (const badVal of ['', 'abc', '9'] ) { // x=9 > L=5 invalid
      await page.fill('[data-testid="input-x"]', badVal);
      assertEqual((await page.locator('[data-testid="result-slope"]').innerText()).trim(), '—', `93 bad x="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `93 bad x="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['AISC 360-22', 'Eurocode 3', 'AWS D1.1', 'L^2-3x^2', '0.002604'], '93 negative');
    passCount++;
    console.log('[PASS] 93. deflection-angle-calculator');

    // =========================================================================
    // 94. density-unit-converter
    // =========================================================================
    console.log('Testing 94: density-unit-converter...');
    await openToolPage(page, `${BASE_URL}/toolbox/density-unit-converter`, '[data-testid="input-value"]');

    // Default: 7.85 g/cm3 -> 7850.00 kg/m3, matrix lb/ft3 = 490.0595, lb/in3 = 0.283599
    assertClose(await readLeadingNumber(page, 'result-converted'), 7850.0, 0.001, '94 default kg/m3');
    assertClose(await readLeadingNumber(page, 'matrix-lb/ft3'), 490.0595, 0.001, '94 matrix lb/ft3');
    assertClose(await readLeadingNumber(page, 'matrix-lb/in3'), 0.283599, 0.001, '94 matrix lb/in3');

    // Swap g/cm3 <-> kg/m3 with 7.85 kg/m3 -> 0.007850 g/cm3
    await page.click('[data-testid="swap-button"]');
    assertClose(await readLeadingNumber(page, 'result-converted'), 0.00785, 0.001, '94 swapped g/cm3');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['kg/m3,kg/m', 'lb/ft3,lb/ft'], '94');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '94');

    for (const badVal of ['', 'abc', '7.85g', '-1']) {
      await page.fill('[data-testid="input-value"]', badVal);
      assertEqual((await page.locator('[data-testid="result-converted"]').innerText()).trim(), '—', `94 bad val="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `94 bad val="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['62.43 lb/ft'], '94 negative');
    passCount++;
    console.log('[PASS] 94. density-unit-converter');

    // =========================================================================
    // 95. die-casting-pressure-calculator
    // =========================================================================
    console.log('Testing 95: die-casting-pressure-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/die-casting-pressure-calculator`, '[data-testid="input-pressure"]');

    // Default: P=50 MPa, A=200 cm2, SF=1.0, V=500 cm3, Ag=50 mm2, t=250 ms -> Clamp=1000.00 kN, vg=40.000 m/s
    assertClose(await readLeadingNumber(page, 'result-clamp-kn'), 1000.0, 0.001, '95 default clamp kN');
    assertClose(await readLeadingNumber(page, 'result-vg'), 40.0, 0.001, '95 default vg');
    assertClose(await readLeadingNumber(page, 'result-fill-time'), 250.0, 0.001, '95 default t_fill');

    // Prove vg is NOT hardcoded to 40: double gate area 50->100 mm2 => vg drops 40->20 m/s; SF 1.0->1.2 => clamp 1200 kN
    await page.fill('[data-testid="input-gate-area"]', '100');
    await page.fill('[data-testid="input-clamp-sf"]', '1.2');
    assertClose(await readLeadingNumber(page, 'result-vg'), 20.0, 0.001, '95 dynamic vg @ 100 mm2');
    assertClose(await readLeadingNumber(page, 'result-clamp-kn'), 1200.0, 0.001, '95 clamp with SF=1.2');

    // Reverse mode: V=500 cm3, Ag=100 mm2, vg=40 m/s -> t_fill = 500000/(100*40) = 125.00 ms
    await page.click('[data-testid="mode-vel-to-time"]');
    assertClose(await readLeadingNumber(page, 'result-fill-time'), 125.0, 0.001, '95 reverse fill time');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['clamping_force,1000.00,kN', 'gate_velocity,40.000,m/s'], '95');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '95');

    for (const badVal of ['', 'abc', '50MPa', '0']) {
      await page.fill('[data-testid="input-pressure"]', badVal);
      assertEqual((await page.locator('[data-testid="result-clamp-kn"]').innerText()).trim(), '—', `95 bad P="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `95 bad P="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['ISO 286-1', 'ASME Y14.5-2018', 'DIN 6935'], '95 negative');
    passCount++;
    console.log('[PASS] 95. die-casting-pressure-calculator');

    console.log(`\nALL ${passCount}/5 BATCH 19 TOOL TESTS PASSED CLEANLY!`);
  } finally {
    await browser.close();
  }
}

runTests().catch((err) => {
  console.error('TEST FAILURE:', err);
  process.exit(1);
});
