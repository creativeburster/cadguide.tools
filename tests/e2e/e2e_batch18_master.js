/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * CADGuide.tools Toolbox - Master E2E Verification Suite for Batch 18 (Tools 86 to 90)
 *
 * Validates:
 * 86. csv-to-dxf-converter (4-pt default CSV, skips blank/bad rows without 0-coercion, 3D TEXT group 30 != 0, pure ASCII DXF download)
 * 87. ctb-plot-style-pen-visualizer (Verified ACI 255 colors e.g. ACI 112=00A552, monochrome vs sample preset, invalid CTB error, pure ASCII CSV export, rejected clipboard)
 * 88. culvert-sizing-calculator (Manning full circular D_req=1234mm -> std 1350mm, real Q_full=5.345 m3/s != Q_design, V_full=3.73 m/s, rejects FHWA HDS-5/WEF/IPC)
 * 89. cut-fill-volume-calculator (Grid fill 3500 CCM / 3888.89 BCM borrow, cut preset 7500 BCM / 9375 LCM, Average End Area tab, rejects Eurocode 7)
 * 90. cutting-speed-calculator (Exact Vc=157.08 m/min & SFM=515.35 ft/min, reverse Target Vc->RPM tab, rejects 515.38 & ISO 286-1)
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

async function verifyDownloadContains(page, buttonSelector, requiredSubstrings, context) {
  const downloadPromise = page.waitForEvent('download');
  await page.click(buttonSelector);
  const download = await downloadPromise;
  const dlPath = await download.path();
  const content = fs.readFileSync(dlPath, 'utf8');
  assertPureAscii(content, `${context} download`);
  for (const sub of requiredSubstrings) {
    if (!content.includes(sub)) {
      throw new Error(`[${context}] Missing "${sub}" in downloaded file:\n${content.slice(0, 600)}`);
    }
  }
  return content;
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
    // 86. csv-to-dxf-converter
    // =========================================================================
    console.log('Testing 86: csv-to-dxf-converter...');
    await openToolPage(page, `${BASE_URL}/toolbox/csv-to-dxf-converter`, '[data-testid="input-csv"]');

    // Default 4 survey points: P1..P4 -> skipped=0, length = 50 + 40 + 50 = 140.007 (with Z changes: hypot(50,0,0.5)+hypot(0,40,0.2)+hypot(-50,0,-0.4) = 50.0025 + 40.0005 + 50.0016 = 140.005)
    assertEqual((await page.locator('[data-testid="result-point-count"]').innerText()).trim(), '4', '86 default point count');
    assertEqual((await page.locator('[data-testid="result-skipped-count"]').innerText()).trim(), '0', '86 default skipped');
    assertClose(await readLeadingNumber(page, 'result-length'), 140.005, 0.001, '86 default 3D length');

    // Download DXF and verify 3D TEXT z=15.500000 and POLYLINE group 70 = 8
    await verifyDownloadContains(
      page,
      '[data-testid="download-dxf-button"]',
      ['POINT', '15.500000', 'TEXT', 'POLYLINE', 'SURVEY_POINTS'],
      '86 DXF'
    );

    // Inject invalid rows: blank X / non-numeric Y should be skipped (not coerced to 0)
    await page.fill('[data-testid="input-csv"]', 'PointID,E,N,Z\nP1,10,20,5\nBAD,,30,1\nBAD2,10,abc,1\nP2,13,24,5');
    assertEqual((await page.locator('[data-testid="result-point-count"]').innerText()).trim(), '2', '86 strict skip valid=2');
    assertEqual((await page.locator('[data-testid="result-skipped-count"]').innerText()).trim(), '2', '86 strict skip count=2');
    assertClose(await readLeadingNumber(page, 'result-length'), 5.0, 0.001, '86 distance 3-4-5');

    // All invalid -> '—' and no NaN
    await page.fill('[data-testid="input-csv"]', 'PointID,E,N,Z\nBAD,abc,def,1');
    assertEqual((await page.locator('[data-testid="result-point-count"]').innerText()).trim(), '—', '86 all invalid');
    await verifyNoNaNOrInfinity(page, '86 all invalid');

    await page.click('[data-testid="reset-button"]');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '86');
    await verifyNegativeTermsOnToolPage(page, ['ISO 10303-21', 'ISO 16739-1', 'ISO/ASTM 52900', 'ISO 19650'], '86 negative');
    passCount++;
    console.log('[PASS] 86. csv-to-dxf-converter');

    // =========================================================================
    // 87. ctb-plot-style-pen-visualizer
    // =========================================================================
    console.log('Testing 87: ctb-plot-style-pen-visualizer...');
    await openToolPage(page, `${BASE_URL}/toolbox/ctb-plot-style-pen-visualizer`, '[data-testid="aci-cell-112"]');

    // Verify ACI 112 uses verified hex #00A552 (not 00A529), and default monochrome has 255 black pens
    assertEqual((await page.locator('[data-testid="stat-black-count"]').innerText()).trim(), '255', '87 default monochrome black pens');
    await page.click('[data-testid="aci-cell-112"]');
    assertEqual((await page.locator('[data-testid="selected-aci-label"]').innerText()).trim(), 'ACI Color 112', '87 select ACI 112');
    assertEqual((await page.locator('[data-testid="selected-aci-hex"]').innerText()).trim(), '#00A552', '87 ACI 112 hex');

    // Switch to Sample CAD Pen Calibration preset -> ACI 5, 8, 9 plot as object color (3 object pens, 252 black pens)
    await page.click('[data-testid="preset-sample"]');
    assertEqual((await page.locator('[data-testid="stat-black-count"]').innerText()).trim(), '252', '87 sample preset black pens');
    assertEqual((await page.locator('[data-testid="stat-object-count"]').innerText()).trim(), '3', '87 sample preset object pens');

    // Upload corrupted .ctb -> must show honest error banner (0 pens loaded)
    await page.setInputFiles('[data-testid="input-ctb-file"]', {
      name: 'corrupt.ctb',
      mimeType: 'application/octet-stream',
      buffer: Buffer.from('PIAFILEVERSION_CORRUPT_HEADER_NOT_DEFLATE'),
    });
    const statusMsg = await page.locator('[data-testid="upload-status"]').innerText();
    if (!statusMsg.includes('0 pens loaded')) {
      throw new Error(`[87 invalid ctb] Expected honest 0-pens error, got: ${statusMsg}`);
    }

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadContains(
      page,
      '[data-testid="export-csv-button"]',
      ['aci,aci_hex,plot_color_mode,lineweight_mm', '112,#00A552,black,0.25', '250,#000000,black,0.25'],
      '87 CSV'
    );
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '87');
    await verifyNegativeTermsOnToolPage(page, ['ISO 10303-21', 'ISO 16739-1', 'ISO/ASTM 52900', '.pcp'], '87 negative');
    passCount++;
    console.log('[PASS] 87. ctb-plot-style-pen-visualizer');

    // =========================================================================
    // 88. culvert-sizing-calculator
    // =========================================================================
    console.log('Testing 88: culvert-sizing-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/culvert-sizing-calculator`, '[data-testid="input-flow"]');

    // Default: Q=4.2, S=0.01, n=0.013 -> D_req=1234.0 mm -> std D=1350 mm, Q_full=5.337 m3/s, V_full=3.73 m/s, V_design=2.93 m/s
    assertClose(await readLeadingNumber(page, 'result-diameter'), 1350, 0.001, '88 default std diameter');
    assertClose(await readLeadingNumber(page, 'result-q-full'), 5.337, 0.001, '88 default Q_full');
    assertClose(await readLeadingNumber(page, 'result-v-full'), 3.73, 0.001, '88 default V_full');
    assertClose(await readLeadingNumber(page, 'result-v-design'), 2.93, 0.001, '88 default V_design');

    // Change to 2 barrels: Q_per_barrel=2.1 -> D_req=951.5 mm -> std D=1050 mm, Q_full_total = 5.461 m3/s
    await page.fill('[data-testid="input-barrels"]', '2');
    assertClose(await readLeadingNumber(page, 'result-diameter'), 1050, 0.001, '88 2-barrel std diameter');
    assertClose(await readLeadingNumber(page, 'result-q-full'), 5.461, 0.001, '88 2-barrel Q_full');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadContains(
      page,
      '[data-testid="export-csv-button"]',
      ['selected_standard_diameter,1350,mm', 'full_flow_capacity,5.3374,m3/s'],
      '88 CSV'
    );
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '88');

    for (const badVal of ['', 'abc', '4.2m', '0']) {
      await page.fill('[data-testid="input-flow"]', badVal);
      assertEqual((await page.locator('[data-testid="result-diameter"]').innerText()).trim(), '—', `88 bad Q="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `88 bad Q="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['FHWA HDS-5', 'WEF Manual', 'Metcalf', 'International Plumbing Code', '1300 mm'], '88 negative');
    passCount++;
    console.log('[PASS] 88. culvert-sizing-calculator');

    // =========================================================================
    // 89. cut-fill-volume-calculator
    // =========================================================================
    console.log('Testing 89: cut-fill-volume-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/cut-fill-volume-calculator`, '[data-testid="input-grid-area"]');

    // Default: 100 m2 * 50 * (11.2 - 10.5) = 3500.00 CCM Fill; 10% shrink -> 3888.89 BCM borrow, net = -3888.89 BCM
    assertClose(await readLeadingNumber(page, 'result-cut'), 0, 0.001, '89 default cut');
    assertClose(await readLeadingNumber(page, 'result-fill'), 3500, 0.001, '89 default fill');
    assertClose(await readLeadingNumber(page, 'result-net'), -3888.89, 0.001, '89 default net bank balance');

    // Cut preset: 100*50*(12.0-10.5) = 7500 BCM, 25% swell -> 9375 LCM
    await page.click('[data-testid="preset-cut"]');
    assertClose(await readLeadingNumber(page, 'result-cut'), 7500, 0.001, '89 cut preset');
    assertClose(await readLeadingNumber(page, 'result-net'), 7500, 0.001, '89 cut net');

    // Average End-Area tab: L=20, Cut(12,18)->300 BCM, Fill(4,6)->100 CCM (111.11 borrow) -> net = 188.89 BCM
    await page.click('[data-testid="tab-section"]');
    assertClose(await readLeadingNumber(page, 'result-cut'), 300, 0.001, '89 section cut');
    assertClose(await readLeadingNumber(page, 'result-fill'), 100, 0.001, '89 section fill');
    assertClose(await readLeadingNumber(page, 'result-net'), 188.89, 0.001, '89 section net');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadContains(
      page,
      '[data-testid="export-csv-button"]',
      ['fill_compacted_volume,3500.00,m3_CCM', 'fill_bank_equivalent,3888.89,m3_BCM'],
      '89 CSV'
    );
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '89');

    for (const badVal of ['', 'abc', '100m', '0']) {
      await page.fill('[data-testid="input-grid-area"]', badVal);
      assertEqual((await page.locator('[data-testid="result-fill"]').innerText()).trim(), '—', `89 bad area="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `89 bad area="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['Eurocode 7', 'ASTM D1557', 'AASHTO Green Book'], '89 negative');
    passCount++;
    console.log('[PASS] 89. cut-fill-volume-calculator');

    // =========================================================================
    // 90. cutting-speed-calculator
    // =========================================================================
    console.log('Testing 90: cutting-speed-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/cutting-speed-calculator`, '[data-testid="input-diameter"]');

    // Default: D=50 mm, n=1000 -> Vc=157.08 m/min, SFM=515.35 ft/min, Circ=157.08 mm
    assertClose(await readLeadingNumber(page, 'result-primary'), 157.08, 0.001, '90 default Vc');
    assertClose(await readLeadingNumber(page, 'result-sfm'), 515.35, 0.001, '90 default SFM');
    assertClose(await readLeadingNumber(page, 'result-circ'), 157.08, 0.001, '90 default circ');

    // Reverse mode: D=50 mm, Target Vc=157.08 -> n = 1000.0 RPM
    await page.click('[data-testid="tab-reverse"]');
    assertClose(await readLeadingNumber(page, 'result-primary'), 1000.0, 0.001, '90 reverse RPM');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadContains(
      page,
      '[data-testid="export-csv-button"]',
      ['cutting_speed_metric,157.080,m/min', 'cutting_speed_sfm,515.353,ft/min'],
      '90 CSV'
    );
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '90');

    for (const badVal of ['', 'abc', '50mm', '0']) {
      await page.fill('[data-testid="input-diameter"]', badVal);
      assertEqual((await page.locator('[data-testid="result-primary"]').innerText()).trim(), '—', `90 bad D="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `90 bad D="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['ISO 286-1', 'ASME Y14.5-2018', 'DIN 6935', '515.38'], '90 negative');
    passCount++;
    console.log('[PASS] 90. cutting-speed-calculator');

    console.log(`\nALL ${passCount}/5 BATCH 18 TOOL TESTS PASSED CLEANLY!`);
  } finally {
    await browser.close();
  }
}

runTests().catch((err) => {
  console.error('TEST FAILURE:', err);
  process.exit(1);
});
