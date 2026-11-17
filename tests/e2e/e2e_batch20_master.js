/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * CADGuide.tools Toolbox - Master E2E Verification Suite for Batch 20 (Tools 96 to 100)
 *
 * Validates:
 * 96. domestic-water-demand-calculator (WSFU piecewise lookup: 15 no-flush=17.50 GPM / 26.51 mm ID; 22.5 interp=20.40 GPM; 40 with-flush=46.00 GPM; out-of-range >50 returns '—', rejects IPC Table E103.3/ASPE/WEF)
 * 97. door-schedule-quantity-calculator (NFPA 80 Sec 6.4.3.1.1 hinges by height: 84 in->3/leaf=600 hinges; 96 in->4/leaf=800; 60 in->2/leaf=400, rejects NIST SP 811/4 per fire door)
 * 98. drag-force-calculator (Fd=363.83 N, Pd=10.915 kW, q=551.25 Pa, km/h unit toggle, rejects NIST SP 811)
 * 99. drawing-lag-performance-cleaner (Read-only ASCII DXF bloat stats: 3 APPID/2 LAYER/4 ENTITIES, toggles, pure ASCII .scr download, rejects SCALELISTEDIT/Online DXF Purger)
 * 100. drill-bit-size-chart (All 138 verified rows: #80-#1 + A-Z + 1/64"-1/2", Q->3/8-24 UNF, #7->1/4-20 UNC, closest finder 5.10->#7, pure ASCII CSV, rejects 1/2-13 UNC on Q)
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
    // =========================================================================
    // 96. domestic-water-demand-calculator
    // =========================================================================
    console.log('Testing 96: domestic-water-demand-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/domestic-water-demand-calculator`, '[data-testid="input-wsfu"]');

    // Default: without_flush WSFU=15, v=2.0 -> 17.50 GPM, 3.975 m3/h, 26.51 mm ID
    assertClose(await readLeadingNumber(page, 'result-gpm'), 17.5, 0.001, '96 default GPM');
    assertClose(await readLeadingNumber(page, 'result-m3h'), 3.975, 0.001, '96 default m3/h');
    assertClose(await readLeadingNumber(page, 'result-pipe-id'), 26.51, 0.001, '96 default pipe ID');

    // Interpolation check at WSFU=22.5 -> midpoint between (15,17.5) and (30,23.3) = 20.40 GPM
    await page.fill('[data-testid="input-wsfu"]', '22.5');
    assertClose(await readLeadingNumber(page, 'result-gpm'), 20.4, 0.001, '96 interp 22.5 WSFU');

    // Flush valve system at WSFU=40 -> midpoint between (30,42) and (50,50) = 46.00 GPM
    await page.click('[data-testid="btn-with-flush"]');
    await page.fill('[data-testid="input-wsfu"]', '40');
    assertClose(await readLeadingNumber(page, 'result-gpm'), 46.0, 0.001, '96 with-flush 40 WSFU');

    // Out of verified table range (>50) -> warning banner and '—'
    for (const badVal of ['', 'abc', '60', '3', '0']) {
      await page.fill('[data-testid="input-wsfu"]', badVal);
      assertEqual((await page.locator('[data-testid="result-gpm"]').innerText()).trim(), '—', `96 out/bad="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `96 out/bad="${badVal}"`);
    }

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadContains(page, '[data-testid="export-csv-button"]', ['peak_flow_gpm,17.500,GPM', 'min_pipe_id,26.51,mm'], '96 CSV');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '96');
    await verifyNegativeTermsOnToolPage(page, ['IPC Table E103.3', 'WEF Manual', 'Metcalf', 'ASPE'], '96 negative');
    passCount++;
    console.log('[PASS] 96. domestic-water-demand-calculator');

    // =========================================================================
    // 97. door-schedule-quantity-calculator
    // =========================================================================
    console.log('Testing 97: door-schedule-quantity-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/door-schedule-quantity-calculator`, '[data-testid="input-rooms"]');

    // Default: 40 rooms * 1.25 * 4 = 200 openings/leaves, height 84 in -> 3 hinges/leaf -> 600 hinges, 50 fire closers
    assertClose(await readLeadingNumber(page, 'result-hinges'), 600, 0.001, '97 default hinges @ 84 in');
    assertClose(await readLeadingNumber(page, 'result-fire-leaves'), 50, 0.001, '97 default fire leaves');
    assertClose(await readLeadingNumber(page, 'result-closers'), 50, 0.001, '97 default closers');

    // Height 96 in -> 4 hinges/leaf -> 800 hinges (independent of fire%)
    await page.fill('[data-testid="input-height"]', '96');
    assertClose(await readLeadingNumber(page, 'result-hinges'), 800, 0.001, '97 hinges @ 96 in');

    // Height 60 in -> 2 hinges/leaf -> 400 hinges
    await page.fill('[data-testid="input-height"]', '60');
    assertClose(await readLeadingNumber(page, 'result-hinges'), 400, 0.001, '97 hinges @ 60 in');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadContains(page, '[data-testid="export-csv-button"]', ['hinges_per_leaf_nfpa80,3', 'total_hinges,600'], '97 CSV');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '97');

    for (const badVal of ['', 'abc', '40.5', '0']) {
      await page.fill('[data-testid="input-rooms"]', badVal);
      assertEqual((await page.locator('[data-testid="result-hinges"]').innerText()).trim(), '—', `97 bad rooms="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `97 bad rooms="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['NIST Special Publication 811', 'BIPM SI Brochure', '4 per fire door', '650 hinges'], '97 negative');
    passCount++;
    console.log('[PASS] 97. door-schedule-quantity-calculator');

    // =========================================================================
    // 98. drag-force-calculator
    // =========================================================================
    console.log('Testing 98: drag-force-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/drag-force-calculator`, '[data-testid="input-density"]');

    // Default: rho=1.225, u=30, Cd=0.3, A=2.2 -> q=551.25 Pa, Fd=363.83 N, Pd=10.915 kW
    assertClose(await readLeadingNumber(page, 'result-drag-force'), 363.83, 0.001, '98 default Fd');
    assertClose(await readLeadingNumber(page, 'result-drag-power'), 10.915, 0.001, '98 default Pd');
    assertClose(await readLeadingNumber(page, 'result-dynamic-pressure'), 551.25, 0.001, '98 default q');

    // Switch velocity unit to km/h with u=108 km/h (= 30 m/s exact) -> identical Fd=363.83 N
    await page.click('[data-testid="vel-unit-km/h"]');
    await page.fill('[data-testid="input-velocity"]', '108');
    assertClose(await readLeadingNumber(page, 'result-drag-force'), 363.83, 0.001, '98 108 km/h Fd');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadContains(page, '[data-testid="export-csv-button"]', ['drag_force,363.825,N', 'drag_power_kw,10.9148,kW'], '98 CSV');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '98');

    for (const badVal of ['', 'abc', '30m/s', '-5']) {
      await page.fill('[data-testid="input-velocity"]', badVal);
      assertEqual((await page.locator('[data-testid="result-drag-force"]').innerText()).trim(), '—', `98 bad u="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `98 bad u="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['NIST Special Publication 811', 'BIPM SI Brochure', 'ISO 80000-1'], '98 negative');
    passCount++;
    console.log('[PASS] 98. drag-force-calculator');

    // =========================================================================
    // 99. drawing-lag-performance-cleaner
    // =========================================================================
    console.log('Testing 99: drawing-lag-performance-cleaner...');
    await openToolPage(page, `${BASE_URL}/toolbox/drawing-lag-performance-cleaner`, '[data-testid="stat-appid"]');

    // Default sample ASCII DXF: 3 APPIDs, 2 LAYERs, 4 ENTITIES
    assertEqual((await page.locator('[data-testid="stat-appid"]').innerText()).trim(), '3', '99 sample APPID count');
    assertEqual((await page.locator('[data-testid="stat-layers"]').innerText()).trim(), '2', '99 sample LAYER count');
    assertEqual((await page.locator('[data-testid="stat-entities"]').innerText()).trim(), '4', '99 sample ENTITY count');

    // Toggle OVERKILL on -> preview contains OVERKILL
    await page.click('[data-testid="chk-overkill"]');
    const scrPreview = await page.locator('[data-testid="script-preview"]').innerText();
    if (!scrPreview.includes('OVERKILL') || !scrPreview.includes('PURGEAECDATA')) {
      throw new Error('[99 preview] Expected OVERKILL and PURGEAECDATA in generated script');
    }

    await verifyDownloadContains(page, '[data-testid="export-scr-button"]', ['AUDITCTL', 'PURGEAECDATA', 'OVERKILL', 'PURGE'], '99 SCR');
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '99');

    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['SCALELISTEDIT', 'scale list edit', 'Online DXF Purger', 'ISO 10303-21', 'ISO 16739-1'], '99 negative');
    passCount++;
    console.log('[PASS] 99. drawing-lag-performance-cleaner');

    // =========================================================================
    // 100. drill-bit-size-chart
    // =========================================================================
    console.log('Testing 100: drill-bit-size-chart...');
    await openToolPage(page, `${BASE_URL}/toolbox/drill-bit-size-chart`, '[data-testid="input-target-hole"]');

    // Default shows all 138 verified ASME B94.11M rows; default closest target 5.10 mm -> #7 (1/4-20 UNC)
    assertEqual((await page.locator('[data-testid="result-row-count"]').innerText()).trim(), '138', '100 all row count');
    assertEqual((await page.locator('[data-testid="result-closest-size"]').innerText()).trim(), '#7', '100 closest 5.10 -> #7');

    // Verify Letter Q row shows 3/8-24 UNF (never old buggy 1/2-13 UNC!)
    const qRowText = await page.locator('[data-testid="row-Q"]').innerText();
    if (!qRowText.includes('3/8-24 UNF')) {
      throw new Error(`[100 row Q] Expected "3/8-24 UNF", got: ${qRowText}`);
    }

    // Verify 27/64" row shows 1/2-13 UNC
    const halfTapRow = await page.locator('tbody tr', { hasText: '27/64"' }).innerText();
    if (!halfTapRow.includes('1/2-13 UNC')) {
      throw new Error(`[100 row 27/64] Expected "1/2-13 UNC", got: ${halfTapRow}`);
    }

    // Search filter for "1/4-20" -> narrows down to 1 row (#7)
    await page.fill('[data-testid="input-search"]', '1/4-20');
    assertEqual((await page.locator('[data-testid="result-row-count"]').innerText()).trim(), '1', '100 search filter count');

    await page.click('[data-testid="reset-button"]');
    await verifyDownloadContains(
      page,
      '[data-testid="export-csv-button"]',
      ['#80,Number,0.0135,0.3429', 'Q,Letter,0.332,8.4328,3/8-24 UNF', '27/64",Fractional,0.421875,10.7156,1/2-13 UNC'],
      '100 CSV'
    );
    await verifyRejectedClipboardDoesNotReportCopied(page, '[data-testid="copy-summary-button"]', '100');

    for (const badVal of ['', 'abc', '5.1mm', '0']) {
      await page.fill('[data-testid="input-target-hole"]', badVal);
      assertEqual((await page.locator('[data-testid="result-closest-size"]').innerText()).trim(), '—', `100 bad target="${badVal}"`);
      await verifyNoNaNOrInfinity(page, `100 bad target="${badVal}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['NIST Special Publication 811', 'BIPM SI Brochure', 'ANSI B94.11', '38.1mm'], '100 negative');
    passCount++;
    console.log('[PASS] 100. drill-bit-size-chart');

    console.log(`\nALL ${passCount}/5 BATCH 20 TOOL TESTS PASSED CLEANLY!`);
  } finally {
    await browser.close();
  }
}

runTests().catch((err) => {
  console.error('TEST FAILURE:', err);
  process.exit(1);
});
