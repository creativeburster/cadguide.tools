/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * CADGuide.tools Toolbox - Master E2E Verification Suite for Batch 17 (Tools 81 to 85)
 *
 * Validates:
 * 81. coordinate-converter-calculator (WGS84 forward/inverse UTM projection, Sydney southern hemisphere FN=+10M, bounds checks, negative check)
 * 82. corrosion-rate-calculator (ASTM G1 mass-loss CR = K*W/(A*T_h*D), 8.76e4 & 3.45e6, coupon 25 mg / 720 h preset, unit switches, negative check)
 * 83. coupling-torque-calculator (Exact P = tau*omega -> 30000*P/(pi*n), kW/hp unit toggle, negative check rejecting 9550/ISO 1940-1)
 * 84. crane-load-calculator (Static moment equilibrium Mo/Ms/SF, tipping load & 75%/85% rated check, boom weight preset, negative check)
 * 85. crane-sling-calculator (T=(W/n)/sin(theta), single-leg WLL = T vs MBL = T*DF, <30 deg & multi-leg warnings, negative check)
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
    // 81. coordinate-converter-calculator
    // =========================================================================
    console.log('Testing 81: coordinate-converter-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/coordinate-converter-calculator`, '[data-testid="input-lat"]');

    // Default Beijing (39.9, 116.4): Zone 50N, E=448709.38 m, N=4416830.56 m
    assertEqual((await page.locator('[data-testid="result-utm-zone"]').innerText()).trim(), '50N', '81 default zone');
    assertClose(await readLeadingNumber(page, 'result-easting'), 448709.38, 0.0001, '81 default easting');
    assertClose(await readLeadingNumber(page, 'result-northing'), 4416830.56, 0.0001, '81 default northing');

    // Sync to Inverse check -> resolves back to 39.9, 116.4
    await page.click('[data-testid="sync-to-inverse-button"]');
    assertClose(await readLeadingNumber(page, 'result-inv-lat'), 39.9, 0.0001, '81 inverse lat');
    assertClose(await readLeadingNumber(page, 'result-inv-lon'), 116.4, 0.0001, '81 inverse lon');

    // Sydney preset (-33.8688, 151.2093) -> Zone 56S, E=334368.63 m, N=6250948.35 m
    await page.click('[data-testid="preset-sydney"]');
    assertEqual((await page.locator('[data-testid="result-utm-zone"]').innerText()).trim(), '56S', '81 sydney zone');
    assertClose(await readLeadingNumber(page, 'result-easting'), 334368.63, 0.0001, '81 sydney easting');
    assertClose(await readLeadingNumber(page, 'result-northing'), 6250948.35, 0.0001, '81 sydney northing');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['utm_zone,50S', 'easting,448709.3802', 'northing,4416830.5623'], '81');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '81');

    for (const badLat of ['', 'abc', '39.9n', '85', '-95']) {
      await page.fill('[data-testid="input-lat"]', badLat);
      assertEqual((await page.locator('[data-testid="result-easting"]').innerText()).trim(), '—', `81 bad lat="${badLat}"`);
      await verifyNoNaNOrInfinity(page, `81 bad lat="${badLat}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['Eurocode 7', 'ASTM D1557', 'AASHTO Green Book', '448760', '4410546'], '81 negative');
    passCount++;
    console.log('[PASS] 81. coordinate-converter-calculator');

    // =========================================================================
    // 82. corrosion-rate-calculator
    // =========================================================================
    console.log('Testing 82: corrosion-rate-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/corrosion-rate-calculator`, '[data-testid="input-mass-loss"]');

    // Default: W=0.5 g, D=7.85, A=20, T=365 days (8760 h), allow=1.5 -> CR=0.031847 mm/yr, 1.2543 mpy, life=47.10 yr
    assertClose(await readLeadingNumber(page, 'result-cr-mm'), 0.031847, 0.001, '82 default CR mm/yr');
    assertClose(await readLeadingNumber(page, 'result-cr-mpy'), 1.2543, 0.001, '82 default CR mpy');
    assertClose(await readLeadingNumber(page, 'result-penetration'), 0.031847, 0.001, '82 default penetration');
    assertClose(await readLeadingNumber(page, 'result-life'), 47.10, 0.001, '82 default remaining life');

    // Preset ASTM G1 Coupon Example: 25 mg, 20 cm2, 720 h, 7.86 g/cm3 -> 0.019349 mm/y, 0.7618 mpy
    await page.click('[data-testid="preset-astm-g1"]');
    assertClose(await readLeadingNumber(page, 'result-cr-mm'), 0.019349, 0.001, '82 ASTM G1 preset mm/yr');
    assertClose(await readLeadingNumber(page, 'result-cr-mpy'), 0.7618, 0.001, '82 ASTM G1 preset mpy');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['exposure_time,8760.00,hours', 'corrosion_rate_mm_yr,0.031847'], '82');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '82');

    for (const badVal of ['', 'abc', '0.5g', '0']) {
      await page.fill('[data-testid="input-mass-loss"]', badVal);
      assertEqual((await page.locator('[data-testid="result-cr-mm"]').innerText()).trim(), '—', `82 bad W="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `82 bad W="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['NIST Special Publication 811', 'BIPM SI Brochure', '0.000764', '1962.50'], '82 negative');
    passCount++;
    console.log('[PASS] 82. corrosion-rate-calculator');

    // =========================================================================
    // 83. coupling-torque-calculator
    // =========================================================================
    console.log('Testing 83: coupling-torque-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/coupling-torque-calculator`, '[data-testid="input-power"]');

    // Default: P=15 kW, n=1800 RPM, SF=1.5 -> omega=188.496 rad/s, Tn=79.5775 Nm, Td=119.37 Nm (1056.48 lbf*in)
    assertClose(await readLeadingNumber(page, 'result-omega'), 188.496, 0.001, '83 default omega');
    assertClose(await readLeadingNumber(page, 'result-nominal-nm'), 79.5775, 0.001, '83 default Tn');
    assertClose(await readLeadingNumber(page, 'result-design-nm'), 119.37, 0.001, '83 default Td');
    assertClose(await readLeadingNumber(page, 'result-design-lbfin'), 1056.48, 0.001, '83 default Td lbf*in');

    // Toggle unit to hp with P=20 hp (=14.913997 kW), n=1800, SF=1.5 -> Tn=79.1212 Nm, Td=118.68 Nm
    await page.click('[data-testid="power-unit-hp"]');
    await page.fill('[data-testid="input-power"]', '20');
    assertClose(await readLeadingNumber(page, 'result-nominal-nm'), 79.1212, 0.001, '83 20hp Tn');
    assertClose(await readLeadingNumber(page, 'result-design-nm'), 118.68, 0.001, '83 20hp Td');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['nominal_torque_nm,79.5775', 'design_torque_nm,119.3662'], '83');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '83');

    for (const badVal of ['', 'abc', '1800rpm', '0']) {
      await page.fill('[data-testid="input-rpm"]', badVal);
      assertEqual((await page.locator('[data-testid="result-design-nm"]').innerText()).trim(), '—', `83 bad RPM="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `83 bad RPM="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['ISO 1940-1', 'ASME B106.1M', 'DIN 6885', '79.583', '9550'], '83 negative');
    passCount++;
    console.log('[PASS] 83. coupling-torque-calculator');

    // =========================================================================
    // 84. crane-load-calculator
    // =========================================================================
    console.log('Testing 84: crane-load-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/crane-load-calculator`, '[data-testid="input-load"]');

    // Default: W=50, R=10, Wb=0, CW=200, d=3, 75% -> Mo=500, Ms=600, SF=1.200, Rated=45.00 (EXCEEDS)
    assertClose(await readLeadingNumber(page, 'result-mo'), 500.0, 0.001, '84 default Mo');
    assertClose(await readLeadingNumber(page, 'result-ms'), 600.0, 0.001, '84 default Ms');
    assertClose(await readLeadingNumber(page, 'result-sf'), 1.2, 0.001, '84 default SF');
    assertClose(await readLeadingNumber(page, 'result-rated-load'), 45.0, 0.001, '84 default rated');
    const defStatus = (await page.locator('[data-testid="result-status"]').innerText()).trim();
    if (!defStatus.includes('EXCEEDS')) {
      throw new Error(`[84 status] Expected EXCEEDS warning at SF=1.200 vs 75% limit, got: ${defStatus}`);
    }

    // Preset Outrigger 85% with CW=250 -> Ms=750, SF=1.500, W_tip=75, Rated=63.75 kN (PASS)
    await page.click('[data-testid="preset-safe-outrigger"]');
    assertClose(await readLeadingNumber(page, 'result-ms'), 750.0, 0.001, '84 outrigger Ms');
    assertClose(await readLeadingNumber(page, 'result-sf'), 1.5, 0.001, '84 outrigger SF');
    assertClose(await readLeadingNumber(page, 'result-rated-load'), 63.75, 0.001, '84 outrigger rated');
    const passStatus = (await page.locator('[data-testid="result-status"]').innerText()).trim();
    if (!passStatus.includes('PASS')) {
      throw new Error(`[84 pass status] Expected PASS at CW=250, got: ${passStatus}`);
    }

    // Preset Boom Weight: W=40, R=10, Wb=15, Rb=5, CW=250, d=3, 75% -> Mo=475, Ms=750, SF=1.579, Rated=(750-75)/10*0.75=50.625->50.63
    await page.click('[data-testid="preset-with-boom"]');
    assertClose(await readLeadingNumber(page, 'result-mo'), 475.0, 0.001, '84 boom Mo');
    assertClose(await readLeadingNumber(page, 'result-sf'), 1.579, 0.001, '84 boom SF');
    assertClose(await readLeadingNumber(page, 'result-rated-load'), 50.63, 0.001, '84 boom rated');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['overturning_moment,500.00', 'rated_stability_limit,45.00'], '84');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '84');

    for (const badVal of ['', 'abc', '50kN', '0']) {
      await page.fill('[data-testid="input-load"]', badVal);
      assertEqual((await page.locator('[data-testid="result-mo"]').innerText()).trim(), '—', `84 bad W="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `84 bad W="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['AISC 360-22', 'Eurocode 3', 'AWS D1.1', 'boom stress'], '84 negative');
    passCount++;
    console.log('[PASS] 84. crane-load-calculator');

    // =========================================================================
    // 85. crane-sling-calculator
    // =========================================================================
    console.log('Testing 85: crane-sling-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/crane-sling-calculator`, '[data-testid="input-weight"]');

    // Default: W=50 kN, legs=2, theta=60, DF=5 -> T=28.868 kN (=Required single-leg WLL), V=25.000, H=14.434, MBL=144.34 kN
    assertClose(await readLeadingNumber(page, 'result-tension'), 28.868, 0.001, '85 default T');
    assertClose(await readLeadingNumber(page, 'result-vertical'), 25.0, 0.001, '85 default V');
    assertClose(await readLeadingNumber(page, 'result-horizontal'), 14.434, 0.001, '85 default H');
    assertClose(await readLeadingNumber(page, 'result-mbl'), 144.34, 0.001, '85 default MBL');

    // Shallow angle warning (<30 deg) + uneven load warning (3 legs)
    await page.fill('[data-testid="input-legs"]', '3');
    await page.fill('[data-testid="input-angle"]', '25');
    // W=50, legs=3, theta=25 -> V=16.667, T=16.6667/sin(25)=39.437 kN, MBL=197.18 kN
    assertClose(await readLeadingNumber(page, 'result-tension'), 39.437, 0.001, '85 3-leg 25deg T');
    assertClose(await readLeadingNumber(page, 'result-mbl'), 197.18, 0.001, '85 3-leg 25deg MBL');
    await page.waitForSelector('[data-testid="warning-shallow-angle"]');
    await page.waitForSelector('[data-testid="warning-uneven-legs"]');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadCsv(page, '[data-testid="export-csv-button"]', ['required_single_leg_wll,28.868', 'minimum_breaking_load_per_leg,144.34'], '85');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '85');

    for (const badVal of ['', 'abc', '95', '0']) {
      await page.fill('[data-testid="input-angle"]', badVal);
      assertEqual((await page.locator('[data-testid="result-tension"]').innerText()).trim(), '—', `85 bad angle="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `85 bad angle="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['AISC 360-22', 'Eurocode 3', 'AWS D1.1', '173.21'], '85 negative');
    passCount++;
    console.log('[PASS] 85. crane-sling-calculator');

    console.log(`\nALL ${passCount}/5 BATCH 17 TOOL TESTS PASSED CLEANLY!`);
  } finally {
    await browser.close();
  }
}

runTests().catch((err) => {
  console.error('TEST FAILURE:', err);
  process.exit(1);
});
