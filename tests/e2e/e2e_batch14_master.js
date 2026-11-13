/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * CADGuide.tools Toolbox - Master E2E Verification Suite for Batch 14 (Tools 66 to 70)
 *
 * Validates:
 * 66. cnc-gcode-feed-calculator (Consistent with cnc-feed-rate-calculator, LinuxCNC G21/G94/G95/F/S, vc-fz & rpm-feed modes, pure-ASCII .nc & .csv downloads, input defenses)
 * 67. cnc-speeds-feeds-reference (Tungaloy catalog tables only: TungForce-Rec TR506-G, DoFeedQuad, DrillForce-Meister h_scc_509; prominent manufacturer advisory; search/filter; removed unsupported rows absent)
 * 68. coating-thickness-calculator (Exact DFT/WFT/TSR/PSR/volume formulas with loss factor, coats mass conservation, Dulux/DeFelsko/ISO 2808/ASTM D4414 alignment, input defenses, CSV)
 * 69. color-rgb-to-aci-matchbox (ezdxf/AutoCAD 2020 ACI 1-255 LUT, both CIE76 Delta-E and Euclidean RGB distance, strict 0-255 & HEX defenses, no leaked LaTeX/CTB claims, CSV)
 * 70. column-base-plate-calculator (AISC 360-22 Eq. J8-2 concrete bearing phi_c=0.65 & confinement <=2.0, AISC DG1 cantilever m/n/lambda*n' & LRFD tp with phi_b=0.90, editable lambda/clearance, A2>=A1 guard, CSV)
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

async function runTests() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  let passCount = 0;

  try {
    // =========================================================================
    // 66. cnc-gcode-feed-calculator
    // =========================================================================
    console.log('Testing 66: cnc-gcode-feed-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/cnc-gcode-feed-calculator`, '[data-testid="input-diameter"]');

    // Default: D=10, z=4, vc=200, fz=0.05, ap=2, ae=5
    // Hand calc:
    // n = 1000 * 200 / (pi * 10) = 6366.1977237 -> 6366.2 RPM (S6366)
    // f_rev = 0.05 * 4 = 0.200 mm/rev
    // Vf = 0.200 * 6366.1977237 = 1273.2395447 -> 1273.2 mm/min
    // MRR = 2 * 5 * 1273.2395447 / 1000 = 12.7323954 -> 12.73 cm3/min
    assertClose(await readLeadingNumber(page, 'result-rpm'), 6366.2, 0.001, '66 default RPM');
    assertClose(await readLeadingNumber(page, 'result-g94-feed'), 1273.2, 0.001, '66 default G94 Vf');
    assertClose(await readLeadingNumber(page, 'result-g95-feed'), 0.200, 0.001, '66 default G95 f_rev');
    assertClose(await readLeadingNumber(page, 'result-mrr'), 12.73, 0.001, '66 default MRR');
    assertEqual((await page.locator('[data-testid="result-gcode-f"]').innerText()).trim(), 'F1273.2', '66 G94 F word');

    // Switch G95 mode
    await page.click('[data-testid="feedmode-g95"]');
    assertEqual((await page.locator('[data-testid="result-gcode-f"]').innerText()).trim(), 'F0.200', '66 G95 F word');
    const previewG95 = await page.locator('[data-testid="gcode-preview"]').innerText();
    if (!previewG95.includes('G95') || !previewG95.includes('M3 S6366') || !previewG95.includes('F0.200')) {
      throw new Error(`[66 G95 preview] Missing expected G95/S6366/F0.200 in preview:\n${previewG95}`);
    }

    // Aluminum preset: D=12, z=3, vc=350, fz=0.08, ap=3, ae=6
    // Hand calc:
    // n = 350000 / (12*pi) = 9284.0383 -> 9284.0 RPM
    // f_rev = 0.08 * 3 = 0.240 mm/rev
    // Vf = 0.240 * 9284.0383 = 2228.1692 -> 2228.2 mm/min
    // MRR = 3 * 6 * 2228.1692 / 1000 = 40.1070 -> 40.11 cm3/min
    await page.click('[data-testid="preset-aluminum-pocket"]');
    assertClose(await readLeadingNumber(page, 'result-rpm'), 9284.0, 0.001, '66 aluminum RPM');
    assertClose(await readLeadingNumber(page, 'result-g94-feed'), 2228.2, 0.001, '66 aluminum Vf');
    assertClose(await readLeadingNumber(page, 'result-g95-feed'), 0.240, 0.001, '66 aluminum f_rev');
    assertClose(await readLeadingNumber(page, 'result-mrr'), 40.11, 0.001, '66 aluminum MRR');

    // Switch to rpm-feed mode: n=3000, Vf=900 (D=12, z=3, ap=3, ae=6)
    // Hand calc:
    // Vc = pi*12*3000/1000 = 113.097 -> 113.1 m/min
    // f_rev = 900 / 3000 = 0.300 mm/rev, fz = 0.100, MRR = 3*6*900/1000 = 16.20 cm3/min
    await page.click('[data-testid="mode-rpm-feed"]');
    await page.fill('[data-testid="input-rpm"]', '3000');
    await page.fill('[data-testid="input-feed"]', '900');
    assertClose(await readLeadingNumber(page, 'result-rpm'), 3000.0, 0.001, '66 rpm-feed RPM');
    assertClose(await readLeadingNumber(page, 'result-g94-feed'), 900.0, 0.001, '66 rpm-feed Vf');
    assertClose(await readLeadingNumber(page, 'result-g95-feed'), 0.300, 0.001, '66 rpm-feed f_rev');
    assertClose(await readLeadingNumber(page, 'result-mrr'), 16.20, 0.001, '66 rpm-feed MRR');

    // Download .nc & .csv
    const [ncDl] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="download-gcode"]'),
    ]);
    const ncText = fs.readFileSync(await ncDl.path(), 'utf8');
    assertPureAscii(ncText, '66 .nc pure ASCII');
    if (!ncText.includes('G21') || !ncText.includes('M3 S3000') || !ncText.includes('F900.0')) {
      throw new Error(`[66 .nc content] Unexpected content:\n${ncText}`);
    }

    const [csvDl66] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv"]'),
    ]);
    const csvText66 = fs.readFileSync(await csvDl66.path(), 'utf8');
    assertPureAscii(csvText66, '66 .csv pure ASCII');
    if (!csvText66.includes('spindle_speed_n,3000.0,RPM') || !csvText66.includes('cutting_speed_Vc,113.1,m/min')) {
      throw new Error(`[66 .csv content] Unexpected content:\n${csvText66}`);
    }

    // Input defenses on >= 2 inputs
    for (const bad of ['', 'abc', '12abc', '-5']) {
      await page.fill('[data-testid="input-diameter"]', bad);
      assertEqual((await page.locator('[data-testid="result-rpm"]').innerText()).trim(), '—', `66 bad diameter "${bad}"`);
      await verifyNoNaNOrInfinity(page, `66 bad diameter "${bad}"`);
    }
    await page.click('[data-testid="reset-button"]');
    assertClose(await readLeadingNumber(page, 'result-rpm'), 6366.2, 0.001, '66 reset RPM');

    await page.fill('[data-testid="input-ae"]', '15'); // ae > D (10)
    assertEqual((await page.locator('[data-testid="result-mrr"]').innerText()).trim(), '—', '66 ae > D guard');
    await page.fill('[data-testid="input-vc"]', '12abc');
    assertEqual((await page.locator('[data-testid="result-gcode-f"]').innerText()).trim(), '—', '66 bad vc "12abc"');
    await verifyNoNaNOrInfinity(page, '66 invalid inputs');

    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['DIN 6935', 'ISO 286-1', 'ASME Y14.5', 'Sheet Metal Cold Bending'], '66 negative');
    passCount++;
    console.log('[PASS] 66. cnc-gcode-feed-calculator');

    // =========================================================================
    // 67. cnc-speeds-feeds-reference
    // =========================================================================
    console.log('Testing 67: cnc-speeds-feeds-reference...');
    await openToolPage(page, `${BASE_URL}/toolbox/cnc-speeds-feeds-reference`, '[data-testid="manufacturer-advisory"]');

    const advisoryText = await page.locator('[data-testid="manufacturer-advisory"]').innerText();
    if (!advisoryText.includes('Typical reference values only') || !advisoryText.includes('manufacturer')) {
      throw new Error(`[67 advisory] Missing mandatory warning text: ${advisoryText}`);
    }

    // Switch to Table view
    await page.click('button:has-text("Table")');
    await page.waitForSelector('tbody tr');
    const totalRows = await page.locator('tbody tr').count();
    assertEqual(totalRows, 34, '67 total verified Tungaloy rows (12+9+10+3)');

    // Filter by TungForce-Rec category (12 rows)
    await page.click('button:has-text("Square-Shoulder Milling (TungForce-Rec)")');
    assertEqual(await page.locator('tbody tr').count(), 12, '67 TungForce-Rec count');
    const tungText = await page.locator('tbody').innerText();
    if (!tungText.includes('230-430 m/min') || !tungText.includes('650-1000 m/min')) {
      throw new Error(`[67 TungForce] Missing expected catalog values in:\n${tungText}`);
    }

    // Filter by High-Feed Milling category (9 rows)
    await page.click('button:has-text("High-Feed Milling (DoFeedQuad)")');
    assertEqual(await page.locator('tbody tr').count(), 9, '67 DoFeedQuad count');
    const hfText = await page.locator('tbody').innerText();
    if (!hfText.includes('0.5-2.0 mm/t')) {
      throw new Error(`[67 DoFeedQuad] Missing expected fz in:\n${hfText}`);
    }

    // Filter by Indexable Drilling category (10 rows)
    await page.click('button:has-text("Indexable Drilling (DrillForce-Meister)")');
    assertEqual(await page.locator('tbody tr').count(), 10, '67 DrillForce-Meister count');
    const drText = await page.locator('tbody').innerText();
    if (!drText.includes('80-140 m/min') || !drText.includes('0.2-0.55 mm/rev')) {
      throw new Error(`[67 DrillForce] Missing expected drill conditions in:\n${drText}`);
    }

    // All + Search filter
    await page.click('button:has-text("All Entries")');
    await page.fill('[data-testid="shortcut-search-input"]', 'Ti-6Al-4V');
    assertEqual(await page.locator('tbody tr').count(), 3, '67 search Ti-6Al-4V rows');
    await page.fill('[data-testid="shortcut-search-input"]', '');

    await verifyNegativeTermsOnToolPage(
      page,
      ['HSS', 'Brass', 'Acrylic', 'Delrin', 'Plastics', 'Plastic', 'DIN 6935', 'ISO 286-1'],
      '67 negative'
    );
    await verifyNoNaNOrInfinity(page, '67 reference page');
    passCount++;
    console.log('[PASS] 67. cnc-speeds-feeds-reference');

    // =========================================================================
    // 68. coating-thickness-calculator
    // =========================================================================
    console.log('Testing 68: coating-thickness-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/coating-thickness-calculator`, '[data-testid="input-dft"]');

    // Default: DFT=150 um, VS=60%, Area=100 m2, Coats=2, Loss=15%
    // Hand calc:
    // DFT/coat = 150 / 2 = 75.0 um
    // WFT/coat = 75 * 100 / 60 = 125.0 um
    // TSR = (60 * 10) / 150 = 4.00 m2/L
    // PSR = 4.00 * (1 - 0.15) = 3.40 m2/L
    // V_theo = 100 / 4.00 = 25.00 L
    // V_prac = 100 / 3.40 = 29.41176 -> 29.41 L
    assertClose(await readLeadingNumber(page, 'result-wft-coat'), 125.0, 0.001, '68 default WFT/coat');
    assertClose(await readLeadingNumber(page, 'result-total-dft'), 150.0, 0.001, '68 default Total DFT');
    assertClose(await readLeadingNumber(page, 'result-tsr'), 4.00, 0.001, '68 default TSR');
    if (!(await page.locator('[data-testid="result-psr"]').innerText()).includes('3.40 m²/L')) {
      throw new Error('68 default PSR expected 3.40 m²/L');
    }
    assertClose(await readLeadingNumber(page, 'result-prac-volume'), 29.41, 0.001, '68 default practical volume');
    if (!(await page.locator('[data-testid="result-theo-volume"]').innerText()).includes('25.00 L')) {
      throw new Error('68 default theo volume expected 25.00 L');
    }

    // Dulux PDF 125 um / 71% VS preset
    await page.click('[data-testid="preset-dulux-125"]');
    assertClose(await readLeadingNumber(page, 'result-wft-coat'), 176.1, 0.001, '68 dulux WFT');
    assertClose(await readLeadingNumber(page, 'result-tsr'), 5.68, 0.001, '68 dulux TSR');
    assertClose(await readLeadingNumber(page, 'result-prac-volume'), 9.78, 0.001, '68 dulux practical L');

    // From-volume mass conservation check: V=5 L, VS=60%, Area=50 m2, Coats=2, Loss=0% -> Total DFT = (5*60*10)/50 = 60.0 um
    await page.click('[data-testid="preset-volume-check"]');
    assertClose(await readLeadingNumber(page, 'result-total-dft'), 60.0, 0.001, '68 volume check DFT');
    await page.fill('[data-testid="input-coats"]', '4');
    // Mass conservation: changing coats from 2 to 4 keeps Total DFT = 60.0 um (per coat WFT halves to 25.0 um)
    assertClose(await readLeadingNumber(page, 'result-total-dft'), 60.0, 0.001, '68 mass conservation 4 coats');
    assertClose(await readLeadingNumber(page, 'result-wft-coat'), 25.0, 0.001, '68 4-coat WFT/coat');

    // CSV Export
    const [csvDl68] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv"]'),
    ]);
    const csvText68 = fs.readFileSync(await csvDl68.path(), 'utf8');
    assertPureAscii(csvText68, '68 csv pure ASCII');
    if (!csvText68.includes('total_dft,60.0,um') || !csvText68.includes('theoretical_spreading_rate,10.00,m2/L')) {
      throw new Error(`[68 csv content] Unexpected:\n${csvText68}`);
    }

    // Invalid input defenses on >= 2 inputs
    for (const bad of ['', 'abc', '12abc', '105']) {
      await page.fill('[data-testid="input-solids"]', bad);
      assertEqual((await page.locator('[data-testid="result-total-dft"]').innerText()).trim(), '—', `68 bad solids "${bad}"`);
      await verifyNoNaNOrInfinity(page, `68 bad solids "${bad}"`);
    }
    await page.click('[data-testid="reset-button"]');
    assertClose(await readLeadingNumber(page, 'result-wft-coat'), 125.0, 0.001, '68 reset WFT');

    await page.fill('[data-testid="input-area"]', '12abc');
    assertEqual((await page.locator('[data-testid="result-prac-volume"]').innerText()).trim(), '—', '68 bad area "12abc"');
    await page.fill('[data-testid="input-loss"]', '96'); // >= 95 invalid
    assertEqual((await page.locator('[data-testid="result-tsr"]').innerText()).trim(), '—', '68 loss >= 95');
    await verifyNoNaNOrInfinity(page, '68 invalid cleanup');

    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['1.200 um', 'DIN 6935', 'ISO 286-1', 'Sheet Metal'], '68 negative');
    passCount++;
    console.log('[PASS] 68. coating-thickness-calculator');

    // =========================================================================
    // 69. color-rgb-to-aci-matchbox
    // =========================================================================
    console.log('Testing 69: color-rgb-to-aci-matchbox...');
    await openToolPage(page, `${BASE_URL}/toolbox/color-rgb-to-aci-matchbox`, '[data-testid="input-hex"]');

    // Default #3B82F6 (59, 130, 246) -> ACI 150 (#007FFF, 0, 127, 255), dE=7.28, Euclidean=59.76
    assertEqual((await page.locator('[data-testid="result-aci-index"]').innerText()).trim(), 'ACI 150', '69 default ACI 150');
    assertEqual((await page.locator('[data-testid="result-matched-hex"]').innerText()).trim(), '#007FFF (0, 127, 255)', '69 default matched hex');
    assertClose(await readLeadingNumber(page, 'result-delta-e'), 7.28, 0.002, '69 default CIE76 dE');
    assertClose(await readLeadingNumber(page, 'result-euclidean'), 59.76, 0.001, '69 default Euclidean');

    // AutoCAD Blue #005691: CIE76 -> ACI 147 (dE=11.49), Euclidean -> ACI 144 (eu=20.12)
    await page.click('[data-testid="preset-autocad-blue"]');
    assertEqual((await page.locator('[data-testid="result-aci-index"]').innerText()).trim(), 'ACI 147', '69 AutoCAD Blue CIE76');
    assertClose(await readLeadingNumber(page, 'result-delta-e'), 11.49, 0.002, '69 AutoCAD Blue dE');

    await page.click('[data-testid="metric-euclidean"]');
    assertEqual((await page.locator('[data-testid="result-aci-index"]').innerText()).trim(), 'ACI 144', '69 AutoCAD Blue Euclidean');
    assertClose(await readLeadingNumber(page, 'result-euclidean'), 20.12, 0.001, '69 AutoCAD Blue euclid distance');

    // Manual RGB 153,153,153 -> exact ACI 253 (#999999)
    await page.fill('[data-testid="input-r"]', '153');
    await page.fill('[data-testid="input-g"]', '153');
    await page.fill('[data-testid="input-b"]', '153');
    assertEqual((await page.locator('[data-testid="result-aci-index"]').innerText()).trim(), 'ACI 253', '69 gray ACI 253');
    assertClose(await readLeadingNumber(page, 'result-euclidean'), 0.0, 0.001, '69 gray exact euclid');

    // CSV export
    const [csvDl69] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv"]'),
    ]);
    const csvText69 = fs.readFileSync(await csvDl69.path(), 'utf8');
    assertPureAscii(csvText69, '69 csv pure ASCII');
    if (!csvText69.includes('matched_aci_index,253') || !csvText69.includes('matched_hex,#999999')) {
      throw new Error(`[69 csv content] Unexpected:\n${csvText69}`);
    }

    // Input defenses on RGB and HEX
    for (const bad of ['', 'abc', '12abc', '256', '-1']) {
      await page.fill('[data-testid="input-r"]', bad);
      assertEqual((await page.locator('[data-testid="result-aci-index"]').innerText()).trim(), '—', `69 bad R "${bad}"`);
      assertEqual((await page.locator('[data-testid="result-delta-e"]').innerText()).trim(), '—', `69 bad R dE "${bad}"`);
      await verifyNoNaNOrInfinity(page, `69 bad R "${bad}"`);
    }
    await page.click('[data-testid="reset-button"]');
    assertEqual((await page.locator('[data-testid="result-aci-index"]').innerText()).trim(), 'ACI 150', '69 reset');

    await page.fill('[data-testid="input-hex"]', 'NOTHEX');
    assertEqual((await page.locator('[data-testid="result-aci-index"]').innerText()).trim(), '—', '69 bad HEX');
    await page.click('[data-testid="reset-button"]');

    await verifyNegativeTermsOnToolPage(
      page,
      ['51, 51, 51', '91, 91, 91', 'STEP AP214', 'Additive Manufacturing', 'ISO 52900', 'CTB plot styles', '\\sqrt'],
      '69 negative'
    );
    passCount++;
    console.log('[PASS] 69. color-rgb-to-aci-matchbox');

    // =========================================================================
    // 70. column-base-plate-calculator
    // =========================================================================
    console.log('Testing 70: column-base-plate-calculator...');
    await openToolPage(page, `${BASE_URL}/toolbox/column-base-plate-calculator`, '[data-testid="input-pu"]');

    // Default: Pu=1500 kN, fc=25 MPa, Fy=250 MPa, d=300, bf=300, B=400, N=400, A2=640000, lambda=1.0
    // Hand calc:
    // A1 = 160000 mm2, sqrt(A2/A1) = 2.000
    // phi_c Pp = 0.65 * 1.7 * 25 * 160000 / 1000 = 4420.00 kN
    // fpu = 1500000 / 160000 = 9.375 MPa
    // m = (400 - 0.95*300)/2 = 57.50, n = (400 - 0.8*300)/2 = 80.00, lambda*n' = 75.00 -> l = 80.00 mm
    // tp = 80 * sqrt(2*1500000 / (0.9*250*160000)) = 80 / sqrt(12) = 23.09401 -> 23.09 mm
    assertClose(await readLeadingNumber(page, 'result-tp'), 23.09, 0.001, '70 default tp');
    assertClose(await readLeadingNumber(page, 'result-phi-pp'), 4420.00, 0.001, '70 default phi_c Pp');
    assertClose(await readLeadingNumber(page, 'result-cantilever'), 80.00, 0.001, '70 default l');
    assertClose(await readLeadingNumber(page, 'result-fpu'), 9.375, 0.001, '70 default fpu');

    // Preset: Unconfined pedestal (A2 = A1 = 160000, Pu = 900)
    // phi_c Pp = 0.65 * 0.85 * 25 * 160000 / 1000 = 2210.00 kN, tp = 80*sqrt(1800000/(0.9*250*160000)) = 17.8885 -> 17.89 mm
    await page.click('[data-testid="preset-unconfined-pedestal"]');
    assertClose(await readLeadingNumber(page, 'result-phi-pp'), 2210.00, 0.001, '70 unconfined phi_c Pp');
    assertClose(await readLeadingNumber(page, 'result-fpu'), 5.625, 0.001, '70 unconfined fpu');
    assertClose(await readLeadingNumber(page, 'result-tp'), 17.89, 0.001, '70 unconfined tp');

    // Preset: W310x97 CalcSteel example (B=410, N=410, d=308, bf=305, lambda=0.7)
    // phi_c Pp = 4643.76 kN, fpu = 8.923 MPa, l = 83.00 mm, tp = 23.38 mm
    await page.click('[data-testid="preset-calcsteel-w310"]');
    assertClose(await readLeadingNumber(page, 'result-phi-pp'), 4643.76, 0.001, '70 W310 phi_c Pp');
    assertClose(await readLeadingNumber(page, 'result-fpu'), 8.923, 0.001, '70 W310 fpu');
    assertClose(await readLeadingNumber(page, 'result-cantilever'), 83.00, 0.001, '70 W310 l');
    assertClose(await readLeadingNumber(page, 'result-tp'), 23.38, 0.001, '70 W310 tp');

    // CSV Export
    const [csvDl70] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv"]'),
    ]);
    const csvText70 = fs.readFileSync(await csvDl70.path(), 'utf8');
    assertPureAscii(csvText70, '70 csv pure ASCII');
    if (!csvText70.includes('required_thickness_tp,23.38,mm') || !csvText70.includes('design_bearing_capacity_phiPp,4643.76,kN')) {
      throw new Error(`[70 csv content] Unexpected:\n${csvText70}`);
    }

    // Input defenses on >= 2 inputs + A2 < A1 guard
    await page.fill('[data-testid="input-a2"]', '100000'); // < 168100
    assertEqual((await page.locator('[data-testid="result-tp"]').innerText()).trim(), '—', '70 A2 < A1 guard');
    await verifyNoNaNOrInfinity(page, '70 A2 < A1');

    await page.click('[data-testid="reset-button"]');
    assertClose(await readLeadingNumber(page, 'result-tp'), 23.09, 0.001, '70 reset tp');

    for (const bad of ['', 'abc', '12abc', '-10']) {
      await page.fill('[data-testid="input-pu"]', bad);
      assertEqual((await page.locator('[data-testid="result-tp"]').innerText()).trim(), '—', `70 bad Pu "${bad}"`);
      await verifyNoNaNOrInfinity(page, `70 bad Pu "${bad}"`);
    }
    await page.click('[data-testid="reset-button"]');
    await page.fill('[data-testid="input-fy"]', '12abc');
    assertEqual((await page.locator('[data-testid="result-tp"]').innerText()).trim(), '—', '70 bad Fy "12abc"');

    await page.click('[data-testid="reset-button"]');
    await verifyNegativeTermsOnToolPage(page, ['Eurocode 3', 'AWS D1.1', 'ASME B30', '0.75·fy'], '70 negative');
    passCount++;
    console.log('[PASS] 70. column-base-plate-calculator');

    console.log(`\nALL BATCH 14 CHECKS PASSED (${passCount}/5 tools verified)`);
  } finally {
    await browser.close();
  }
}

runTests().catch((err) => {
  console.error('[FAIL]', err);
  process.exit(1);
});
