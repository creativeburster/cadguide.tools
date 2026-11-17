/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * CADGuide.tools Toolbox - Master E2E Verification Suite for Batch 16 (Tools 76 to 80)
 * (Explicitly skips route hub directory src/app/toolbox/convert)
 *
 * Validates:
 * 76. concrete-volume-mix-calculator (IS 456:2000 M5-M20 + 1.54 dry volume + 1440 kg/m3 cement + NIST SP 811 ft3/yd3, column M20 branch, input defenses, CSV/clipboard, negative check)
 * 77. concurrent-vs-named-breakeven-calculator (FlexLM floating pool sizing & break-even ceiling, + /embed/concurrent-vs-named-breakeven-calculator smoke, CSV/clipboard, negative check)
 * 78. contour-interval-calculator (Topographic contour lines, index interval, ground/sheet spacing, crowding warning, CSV/clipboard, negative check)
 * 79. cooling-load-calculator (Moist-air hs=cp*rho*q*dT & hl=rho*hwe*q*dw with m3/h->m3/s, CFM branch, dw=0 allowed, CSV/clipboard, negative check)
 * 80. cooling-tower-sizing-calculator (SPX cooling tower heat rejection flow, Range/Approach, Evap 0.0008/degF, Drift 0.0002, Blowdown/(COC-1), thermo warning, CSV/clipboard, negative check)
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
    // 76. concrete-volume-mix-calculator
    // =========================================================================
    console.log('Testing 76: concrete-volume-mix-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/concrete-volume-mix-calculator`, '[data-testid="input-length"]');

    // Default: Slab 5x4x0.15, Count=1, Waste=5% -> wet=3.150 m3 (111.24 ft3, 4.12 yd3)
    // Dry = 3.15*1.54 = 4.851 m3; M15 (1:2:4, sum=7) -> cement=(4.851/7)*1440 = 997.92 kg -> 19.96 bags (buy 20)
    // sand=(4.851*2/7)*1600 = 2217.60 kg; agg=(4.851*4/7)*1450 = 4019.40 kg; water=997.92*0.5=498.96 L
    assertClose(await readLeadingNumber(page, 'result-wet-volume'), 3.15, 0.001, '76 default wet vol');
    assertClose(await readLeadingNumber(page, 'result-cement-bags'), 19.96, 0.001, '76 default cement bags');
    assertClose(await readLeadingNumber(page, 'result-cement-mass'), 997.92, 0.001, '76 default cement kg');
    assertClose(await readLeadingNumber(page, 'result-sand-kg'), 2217.6, 0.001, '76 default sand kg');
    assertClose(await readLeadingNumber(page, 'result-agg-kg'), 4019.4, 0.001, '76 default agg kg');
    assertClose(await readLeadingNumber(page, 'result-water-l'), 498.96, 0.001, '76 default water L');

    // Preset Column M20: 2 columns x pi*(0.2^2)*3.0 * 1.05 = 0.79168 -> 0.792 m3
    // Dry = 0.791681*1.54 = 1.219189; M20 (1:1.5:3, sum=5.5) -> cement = 1.219189/5.5*1440 = 319.2059 -> 6.38 bags
    await page.click('[data-testid="preset-column-m20"]');
    assertClose(await readLeadingNumber(page, 'result-wet-volume'), 0.792, 0.001, '76 column preset wet vol');
    assertClose(await readLeadingNumber(page, 'result-cement-bags'), 6.38, 0.001, '76 column preset bags');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['order_wet_volume,3.1500', 'cement_mass,997.92'], '76');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '76');

    for (const badVal of ['', 'abc', '5m', '0']) {
      await page.fill('[data-testid="input-length"]', badVal);
      assertEqual((await page.locator('[data-testid="result-wet-volume"]').innerText()).trim(), '—', `76 bad L="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `76 bad L="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['ADA 2010', 'IBC 2024', 'ASCE 7-22', 'Eurocode 2'], '76 negative');
    passCount++;
    console.log('[PASS] 76. concrete-volume-mix-calculator');

    // =========================================================================
    // 77. concurrent-vs-named-breakeven-calculator
    // =========================================================================
    console.log('Testing 77: concurrent-vs-named-breakeven-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/concurrent-vs-named-breakeven-calculator`, '[data-testid="input-users"]');

    // Default: 50 users, 40% peak -> C = 20; Named = 93250; Conc = 56000; Savings = 37250; Breakeven = 4662.50
    assertClose(await readLeadingNumber(page, 'result-conc-seats'), 20, 0.001, '77 default C');
    assertClose(await readLeadingNumber(page, 'result-named-total'), 93250, 0.001, '77 default named');
    assertClose(await readLeadingNumber(page, 'result-conc-total'), 56000, 0.001, '77 default conc');
    assertClose(await readLeadingNumber(page, 'result-savings'), 37250, 0.001, '77 default savings');
    assertClose(await readLeadingNumber(page, 'result-breakeven-price'), 4662.5, 0.001, '77 default breakeven');

    // Preset 20 users / 80% peak -> C=16; Named=20*1500=30000; Conc=16*2800=44800 -> Named wins by $14,800
    await page.click('[data-testid="preset-heavy-80"]');
    assertClose(await readLeadingNumber(page, 'result-conc-seats'), 16, 0.001, '77 heavy80 C');
    assertClose(await readLeadingNumber(page, 'result-savings'), 14800, 0.001, '77 heavy80 savings');
    const winnerTxt = await page.locator('[data-testid="result-winner"]').innerText();
    if (!winnerTxt.includes('Named-user')) {
      throw new Error(`[77 winner branch] Expected Named-user win at 80% peak, got: ${winnerTxt}`);
    }

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['required_concurrent_seats,20', 'breakeven_concurrent_price,4662.50'], '77');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '77');

    for (const badVal of ['', 'abc', '50u', '12.5', '0']) {
      await page.fill('[data-testid="input-users"]', badVal);
      assertEqual((await page.locator('[data-testid="result-named-total"]').innerText()).trim(), '—', `77 bad users="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `77 bad users="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['ISO 10303-21', 'ISO 16739-1', 'ISO/ASTM 52900', 'ActiveHoursPerDay'], '77 negative');

    // Smoke-check /embed/concurrent-vs-named-breakeven-calculator route compatibility
    await openToolPage(page, `${BASE_URL}/embed/concurrent-vs-named-breakeven-calculator`, '[data-testid="input-users"]');
    assertClose(await readLeadingNumber(page, 'result-conc-seats'), 20, 0.001, '77 embed route');

    passCount++;
    console.log('[PASS] 77. concurrent-vs-named-breakeven-calculator');

    // =========================================================================
    // 78. contour-interval-calculator
    // =========================================================================
    console.log('Testing 78: contour-interval-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/contour-interval-calculator`, '[data-testid="input-scale"]');

    // Default: Scale 1:1000, dH=50 m, CI=1.0 m, Slope=10%, Index=5x
    // Lines = 51, Index CI = 5.00 m, Ground spacing = 10.00 m, Sheet spacing = 10.00 mm
    assertClose(await readLeadingNumber(page, 'result-lines'), 51, 0.001, '78 default lines');
    assertClose(await readLeadingNumber(page, 'result-index-ci'), 5.0, 0.001, '78 default index CI');
    assertClose(await readLeadingNumber(page, 'result-ground-spacing'), 10.0, 0.001, '78 default ground spacing');
    assertClose(await readLeadingNumber(page, 'result-map-spacing'), 10.0, 0.001, '78 default map spacing');

    // Change to CI=0.5 m, Scale=1:5000, Slope=25% -> Ground = 0.5/0.25 = 2.00 m -> Sheet = 2000/5000 = 0.40 mm (<0.5 triggers crowding warning)
    await page.click('[data-testid="preset-ci-0.5"]');
    await page.fill('[data-testid="input-scale"]', '5000');
    await page.fill('[data-testid="input-slope"]', '25');
    assertClose(await readLeadingNumber(page, 'result-lines'), 101, 0.001, '78 crowded lines');
    assertClose(await readLeadingNumber(page, 'result-ground-spacing'), 2.0, 0.001, '78 crowded ground spacing');
    assertClose(await readLeadingNumber(page, 'result-map-spacing'), 0.4, 0.001, '78 crowded map spacing');
    await page.waitForSelector('[data-testid="crowding-warning"]');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['contour_lines,51', 'map_spacing,10.000'], '78');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '78');

    for (const badVal of ['', 'abc', '100m', '0']) {
      await page.fill('[data-testid="input-ci"]', badVal);
      assertEqual((await page.locator('[data-testid="result-lines"]').innerText()).trim(), '—', `78 bad CI="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `78 bad CI="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['Eurocode 7', 'ASTM D1557', 'AASHTO Green Book', 'scale_factor'], '78 negative');
    passCount++;
    console.log('[PASS] 78. contour-interval-calculator');

    // =========================================================================
    // 79. cooling-load-calculator
    // =========================================================================
    console.log('Testing 79: cooling-load-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/cooling-load-calculator`, '[data-testid="input-airflow"]');

    // Default: 2000 m3/h (0.555556 m3/s), dT=10 C, dw=2 g/kg, rho=1.202, cp=1.006, hwe=2454
    // Qs = 6.72 kW, Ql = 3.28 kW, Qt = 10.00 kW, Tons = 2.84 RT
    assertClose(await readLeadingNumber(page, 'result-sensible'), 6.72, 0.002, '79 default Qs');
    assertClose(await readLeadingNumber(page, 'result-latent'), 3.28, 0.002, '79 default Ql');
    assertClose(await readLeadingNumber(page, 'result-total'), 10.0, 0.001, '79 default Qt');
    assertClose(await readLeadingNumber(page, 'result-tons'), 2.84, 0.002, '79 default RT');

    // Switch to 1000 CFM (= 0.4719474432 m3/s), dw=0 -> Qs = 1.202*0.4719474432*1.006*10 = 5.7068 kW, Ql = 0.00 kW
    await page.selectOption('[data-testid="select-flow-unit"]', 'cfm');
    await page.fill('[data-testid="input-airflow"]', '1000');
    await page.fill('[data-testid="input-dw"]', '0');
    assertClose(await readLeadingNumber(page, 'result-sensible'), 5.71, 0.002, '79 CFM Qs');
    assertClose(await readLeadingNumber(page, 'result-latent'), 0.0, 0.001, '79 dw=0 Ql');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['sensible_load,6.7178', 'total_load,9.9953'], '79');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '79');

    for (const badVal of ['', 'abc', '2000m3h', '0']) {
      await page.fill('[data-testid="input-airflow"]', badVal);
      assertEqual((await page.locator('[data-testid="result-total"]').innerText()).trim(), '—', `79 bad flow="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `79 bad flow="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['SMACNA', 'ISO 6946', 'QS = 1.23*Q*dT'], '79 negative');
    passCount++;
    console.log('[PASS] 79. cooling-load-calculator');

    // =========================================================================
    // 80. cooling-tower-sizing-calculator
    // =========================================================================
    console.log('Testing 80: cooling-tower-sizing-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/cooling-tower-sizing-calculator`, '[data-testid="input-tons"]');

    // Default: 250 RT, HRF=1.25 -> Q_rej=1099.0165 kW; EWT=35, LWT=30, WBT=26 (Range=5.0, App=4.0), COC=3
    // Flow = 189.03 m3/h; Evap = 1.3610 m3/h; Drift = 0.0378; Blowdown = 0.6427; Makeup = 2.0416 m3/h
    assertClose(await readLeadingNumber(page, 'result-flow-m3h'), 189.03, 0.001, '80 default flow m3h');
    assertClose(await readLeadingNumber(page, 'result-range'), 5.0, 0.001, '80 default range');
    assertClose(await readLeadingNumber(page, 'result-approach'), 4.0, 0.001, '80 default approach');
    assertClose(await readLeadingNumber(page, 'result-evap'), 1.361, 0.001, '80 default evap');
    assertClose(await readLeadingNumber(page, 'result-makeup'), 2.0416, 0.001, '80 default makeup');

    // Thermodynamic violation branch: set LWT <= WBT (e.g. LWT=25 vs WBT=26) -> warning & '—'
    await page.fill('[data-testid="input-lwt"]', '25');
    await page.waitForSelector('[data-testid="thermo-warning"]');
    assertEqual((await page.locator('[data-testid="result-flow-m3h"]').innerText()).trim(), '—', '80 LWT<=WBT must be dash');

    await page.click('[data-testid="reset-button"]');
    // Change COC=5 -> Blowdown = 1.36104/4 - 0.03781 = 0.30245 -> Makeup = 1.7013 m3/h
    await page.fill('[data-testid="input-coc"]', '5');
    assertClose(await readLeadingNumber(page, 'result-makeup'), 1.7013, 0.001, '80 COC=5 makeup');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['condenser_flow_m3h,189.0329', 'total_makeup_water,2.0416'], '80');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '80');

    for (const badVal of ['', 'abc', '250RT', '0']) {
      await page.fill('[data-testid="input-tons"]', badVal);
      assertEqual((await page.locator('[data-testid="result-flow-m3h"]').innerText()).trim(), '—', `80 bad tons="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `80 bad tons="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['SMACNA', 'ISO 6946', 'ASHRAE Standard 62.1'], '80 negative');
    passCount++;
    console.log('[PASS] 80. cooling-tower-sizing-calculator');

    console.log(`\nALL ${passCount}/5 BATCH 16 CHECKS PASSED.`);
  } finally {
    await browser.close();
  }
}

runTests().catch((err) => {
  console.error('\n[FAIL]', err);
  process.exit(1);
});
