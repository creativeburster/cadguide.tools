/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * CADGuide.tools Toolbox - Master E2E Verification Suite for Batch 22 (Tools 106 to 110)
 *
 * 106. dwg-version-checker: Default AC1032 (2018-2026), simulated file AC1027 -> 2013, rejects 2027/ISO 10303-21
 * 107. dxf-watermark-layer-parser: Built-in sample AC1032 / 4 layers (1 off, 1 frozen, 1 locked), filter frozen -> 1 row DEFPOINTS, .csv & .scr pure ASCII, rejects fabricated watermark tokens
 * 108. edm-material-removal-calculator: Default MRR=86.667, duty=66.67%, fp=6.667 kHz, Ep=0.0500 J, Pavg=333.33 W, t=17.308 min; finishing preset MRR=10.000, duty=25.00%, t=60.000
 * 109. egress-width-calculator: Metric 500 m2 @ 13.9355 -> 36 occ, 2 exits, stair=274.32 mm, level=182.88 mm; Imperial 60000 ft2 @ 100 -> 600 occ, 3 exits, stair=180.00 in, level=120.00 in
 * 110. elevator-traffic-calculator: Default HC5%=12.22%, Interval=39.28 s, RTT=157.12 s, S=8.996, H=15.274; highrise HC5%=14.06%, Interval=28.44 s, RTT=170.64 s
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
    // 106. dwg-version-checker
    console.log('Testing 106: dwg-version-checker...');
    await openToolPage(page, `${BASE_URL}/toolbox/dwg-version-checker`, '[data-testid="input-header-code"]');
    assertEqual((await page.locator('[data-testid="result-code"]').innerText()).trim(), 'AC1032', '106 default code');
    assertEqual((await page.locator('[data-testid="result-released"]').innerText()).trim(), '2018', '106 default year');

    await page.click('[data-testid="btn-sample-ac1027"]');
    assertEqual((await page.locator('[data-testid="result-code"]').innerText()).trim(), 'AC1027', '106 sample code');
    assertEqual((await page.locator('[data-testid="result-released"]').innerText()).trim(), '2013', '106 sample year');

    await page.fill('[data-testid="input-header-code"]', 'BAD');
    await page.click('[data-testid="btn-lookup-code"]');
    assertEqual((await page.locator('[data-testid="result-code"]').innerText()).trim(), '—', '106 bad header');
    await verifyNoNaNOrInfinity(page, '106 bad header');

    await page.click('[data-testid="btn-code-AC1032"]');
    await verifyDownloadContains(page, '[data-testid="export-csv-button"]', ['"AC1032"', '"AC1027"', '"AC1009"'], '106 CSV');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '106');
    await verifyNegativeTermsOnToolPage(page, ['2027', 'ISO 10303-21', 'ISO 16739-1', 'ISO/ASTM 52900', 'ISO 19650'], '106 negative');
    passCount++;
    console.log('[PASS] 106. dwg-version-checker');

    // 107. dxf-watermark-layer-parser
    console.log('Testing 107: dxf-watermark-layer-parser...');
    await openToolPage(page, `${BASE_URL}/toolbox/dxf-watermark-layer-parser`, '[data-testid="input-layer-search"]');
    assertEqual((await page.locator('[data-testid="result-acadver"]').innerText()).trim(), 'AC1032', '107 default acadver');
    assertEqual((await page.locator('[data-testid="result-layer-count"]').innerText()).trim(), '4', '107 default layer count');
    assertEqual((await page.locator('[data-testid="result-flag-counts"]').innerText()).trim(), '1 / 1 / 1', '107 flag counts');

    await page.click('[data-testid="filter-frozen"]');
    const frozenText = await page.locator('[data-testid="layer-table-body"]').innerText();
    if (!frozenText.includes('DEFPOINTS') || frozenText.includes('A-WALL')) {
      throw new Error(`[107] Frozen filter failed: ${frozenText}`);
    }
    await page.click('[data-testid="filter-all"]');

    await verifyDownloadContains(page, '[data-testid="export-csv-button"]', ['"A-WALL","1","On"', '"DEFPOINTS","8","Off"'], '107 CSV');
    await verifyDownloadContains(page, '[data-testid="export-scr-button"]', ['-LAYER ON "A-WALL"', '-LAYER OFF "DEFPOINTS"'], '107 SCR');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-layer-0"]', '107');
    await verifyNegativeTermsOnToolPage(
      page,
      ['AcDbDraftingFormat', 'ACAD_ZOMBIE_REG', 'ACAD_EVALUATION_MARK', 'Wipe Educational Stamp', 'ISO 10303-21', 'ISO 16739-1'],
      '107 negative'
    );
    passCount++;
    console.log('[PASS] 107. dxf-watermark-layer-parser');

    // 108. edm-material-removal-calculator
    console.log('Testing 108: edm-material-removal-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/edm-material-removal-calculator`, '[data-testid="input-vd"]');
    assertClose(await readLeadingNumber(page, 'result-mrr'), 86.667, 0.001, '108 default mrr');
    assertClose(await readLeadingNumber(page, 'result-duty'), 66.67, 0.001, '108 default duty');
    assertClose(await readLeadingNumber(page, 'result-freq'), 6.667, 0.001, '108 default freq');
    assertClose(await readLeadingNumber(page, 'result-ep'), 0.05, 0.001, '108 default Ep');
    assertClose(await readLeadingNumber(page, 'result-power'), 333.33, 0.001, '108 default power');
    assertClose(await readLeadingNumber(page, 'result-time'), 17.308, 0.001, '108 default time');

    await page.click('[data-testid="preset-finishing"]');
    assertClose(await readLeadingNumber(page, 'result-mrr'), 10.0, 0.001, '108 alt mrr');
    assertClose(await readLeadingNumber(page, 'result-duty'), 25.0, 0.001, '108 alt duty');
    assertClose(await readLeadingNumber(page, 'result-freq'), 5.0, 0.001, '108 alt freq');
    assertClose(await readLeadingNumber(page, 'result-time'), 60.0, 0.001, '108 alt time');

    for (const bad of ['', 'abc', '0']) {
      await page.fill('[data-testid="input-ip"]', bad);
      assertEqual((await page.locator('[data-testid="result-mrr"]').innerText()).trim(), '—', `108 bad="${bad}"`);
      await verifyNoNaNOrInfinity(page, `108 bad="${bad}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyDownloadContains(page, '[data-testid="export-csv-button"]', ['"Estimated MRR","86.667","mm3/min"', '"Duty Cycle (D)","66.67","%"'], '108 CSV');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '108');
    await verifyNegativeTermsOnToolPage(page, ['NIST Special Publication 811', 'ISO 80000-1', 'BIPM', 'Surface Finish'], '108 negative');
    passCount++;
    console.log('[PASS] 108. edm-material-removal-calculator');

    // 109. egress-width-calculator
    console.log('Testing 109: egress-width-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/egress-width-calculator`, '[data-testid="input-area"]');
    assertClose(await readLeadingNumber(page, 'result-occupants'), 36, 0.001, '109 default occ');
    assertClose(await readLeadingNumber(page, 'result-min-exits'), 2, 0.001, '109 default exits');
    assertClose(await readLeadingNumber(page, 'result-stair-width'), 274.32, 0.001, '109 default stair');
    assertClose(await readLeadingNumber(page, 'result-level-width'), 182.88, 0.001, '109 default level');

    await page.click('[data-testid="btn-unit-imperial"]');
    await page.fill('[data-testid="input-area"]', '60000');
    await page.fill('[data-testid="input-olf"]', '100');
    assertClose(await readLeadingNumber(page, 'result-occupants'), 600, 0.001, '109 imp occ');
    assertClose(await readLeadingNumber(page, 'result-min-exits'), 3, 0.001, '109 imp exits');
    assertClose(await readLeadingNumber(page, 'result-stair-width'), 180.0, 0.001, '109 imp stair');
    assertClose(await readLeadingNumber(page, 'result-level-width'), 120.0, 0.001, '109 imp level');

    await page.fill('[data-testid="input-area"]', '');
    assertEqual((await page.locator('[data-testid="result-occupants"]').innerText()).trim(), '—', '109 empty');
    await verifyNoNaNOrInfinity(page, '109 empty');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadContains(page, '[data-testid="export-csv-button"]', ['"Design Occupant Load","36","persons"', '"Calculated Stair Width","274.32","mm"'], '109 CSV');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '109');
    await verifyNegativeTermsOnToolPage(page, ['NIST Special Publication 811', 'BIPM', '10.764'], '109 negative');
    passCount++;
    console.log('[PASS] 109. egress-width-calculator');

    // 110. elevator-traffic-calculator
    console.log('Testing 110: elevator-traffic-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/elevator-traffic-calculator`, '[data-testid="input-pop"]');
    assertClose(await readLeadingNumber(page, 'result-hc5-pct'), 12.22, 0.001, '110 default HC5%');
    assertClose(await readLeadingNumber(page, 'result-interval'), 39.28, 0.001, '110 default interval');
    assertClose(await readLeadingNumber(page, 'result-rtt'), 157.12, 0.001, '110 default RTT');
    assertClose(await readLeadingNumber(page, 'result-stops'), 8.996, 0.001, '110 default S');
    assertClose(await readLeadingNumber(page, 'result-reversal'), 15.274, 0.001, '110 default H');

    await page.click('[data-testid="preset-highrise"]');
    assertClose(await readLeadingNumber(page, 'result-hc5-pct'), 14.06, 0.001, '110 highrise HC5%');
    assertClose(await readLeadingNumber(page, 'result-interval'), 28.44, 0.001, '110 highrise interval');
    assertClose(await readLeadingNumber(page, 'result-rtt'), 170.64, 0.001, '110 highrise RTT');

    for (const bad of ['', 'abc', '1', '5.5']) {
      await page.fill('[data-testid="input-floors"]', bad);
      assertEqual((await page.locator('[data-testid="result-rtt"]').innerText()).trim(), '—', `110 bad floors="${bad}"`);
      await verifyNoNaNOrInfinity(page, `110 bad="${bad}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyDownloadContains(page, '[data-testid="export-csv-button"]', ['"Round Trip Time (RTT)","157.12","s"', '"Up-Peak Interval (I)","39.28","s"'], '110 CSV');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '110');
    await verifyNegativeTermsOnToolPage(page, ['Eurocode 7', 'FHWA Geotechnical', 'ASTM D1557', 'AASHTO Green Book'], '110 negative');
    passCount++;
    console.log('[PASS] 110. elevator-traffic-calculator');

    console.log(`\nSUMMARY: PASS=${passCount} FAIL=0`);
  } finally {
    await browser.close();
  }
}

runTests().catch((err) => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
