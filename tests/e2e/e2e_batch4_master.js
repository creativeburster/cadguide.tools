/**
 * CADGuide.tools Toolbox - Master E2E Verification Suite for Batch 4 (Tools 16 to 20)
 *
 * Validates:
 * 16. autocad-vs-gstarcad-shortcuts (Pgp alias parity, purged splat/gws/exprint/freepoly/autosort, csv export)
 * 17. autocad-vs-zwcad-shortcuts (Pgp alias parity, purged messenger/mx/datasmart, authentic smart commands, csv export)
 * 18. battery-capacity-calculator (Ah sizing, gross energy, dc current, presets including 120V, no NaN% on empty margin, csv)
 * 19. beam-deflection-structural-calculator (AISC/IBC deflection, moment, stress, Ix/Wx, real copy status, empty dimension defense)
 * 20. bearing-capacity-calculator (Terzaghi 1943 trilinear capacity, shape factors, Nc=5.7 undrained, allowable qa, safety factor, csv)
 */

const { chromium } = require('playwright');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';

function assertClose(actual, expected, maxRelError = 0.01, context = '') {
  const diff = Math.abs(actual - expected);
  const relError = expected === 0 ? diff : diff / Math.abs(expected);
  if (relError > maxRelError) {
    throw new Error(
      `[${context}] Value mismatch: actual ${actual} vs expected ${expected} (relative error ${(relError * 100).toFixed(3)}% > ${(maxRelError * 100).toFixed(3)}%)`
    );
  }
}

async function runMasterSuite() {
  console.log('================================================================');
  console.log('CADGuide Toolbox - Master E2E Verification of Batch 4 (Tools 16 to 20)');
  console.log('================================================================');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    acceptDownloads: true,
    permissions: ['clipboard-read', 'clipboard-write']
  });
  const page = await context.newPage();

  const results = [];

  const runSubTest = async (name, testFn) => {
    process.stdout.write(`Testing [${name}] ... `);
    try {
      await testFn(page);
      console.log('✓ PASSED');
      results.push({ name, status: 'PASS' });
    } catch (err) {
      console.log('✗ FAILED');
      console.error(`  Error: ${err.message}`);
      results.push({ name, status: 'FAIL', error: err.message });
    }
  };

  try {
    // -------------------------------------------------------------------------
    // Tool 16: autocad-vs-gstarcad-shortcuts
    // -------------------------------------------------------------------------
    await runSubTest('16. autocad-vs-gstarcad-shortcuts', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/autocad-vs-gstarcad-shortcuts`, { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="shortcut-search-input"]');

      const bodyText = await p.innerText('body');

      // 1. Verify complete elimination of fabricated or unverified commands
      const fabricatedWords = ['GSTARWORKSPACES', 'SPLAT', 'EXPRINT', 'FREEPOLY', 'AUTOSORT'];
      for (const w of fabricatedWords) {
        if (bodyText.includes(w)) {
          throw new Error(`Found fabricated or unverified command (${w}) on page!`);
        }
      }

      // 2. Verify authentic core identical aliases
      const searchInput = p.locator('[data-testid="shortcut-search-input"]');
      await searchInput.fill('LINE');
      await p.waitForTimeout(150);
      let cardText = await p.innerText('body');
      if (!cardText.includes('LINE') || !cardText.includes('Identical')) {
        throw new Error('Failed to find identical LINE shortcut');
      }

      // 3. Verify genuine GstarCAD official tools (COMPARE, AREASUM, MAGNIFIER, BCOUNT)
      await searchInput.fill('COMPARE');
      await p.waitForTimeout(150);
      cardText = await p.innerText('body');
      if (!cardText.includes('COMPARE') || !cardText.includes('Identical')) {
        throw new Error('GstarCAD native COMPARE (DWG Compare) missing from comparison table');
      }

      await searchInput.fill('AREASUM');
      await p.waitForTimeout(150);
      cardText = await p.innerText('body');
      if (!cardText.includes('AREASUM') || !cardText.includes('Different')) {
        throw new Error('GstarCAD official AREASUM missing from comparison table');
      }

      await searchInput.fill('MAGNIFIER');
      await p.waitForTimeout(150);
      cardText = await p.innerText('body');
      if (!cardText.includes('MAGNIFIER') || !cardText.includes('floating viewport lens')) {
        throw new Error('GstarCAD official MAGNIFIER missing from comparison table');
      }

      // 4. Test View Filter Toggle (Differences only)
      await searchInput.fill('');
      await p.click('[data-testid="filter-diff"]');
      await p.waitForTimeout(150);
      const diffCards = await p.locator('[data-testid="shortcut-card-item"]').all();
      if (diffCards.length === 0) {
        throw new Error('Filter Differences Only returned 0 items');
      }
      for (const card of diffCards) {
        const text = await card.innerText();
        if (text.includes('Identical')) {
          throw new Error('Filter Differences Only displayed an Identical card');
        }
      }

      // 5. Test Table View Toggle & Table Header
      await p.click('[data-testid="view-mode-table"]');
      await p.waitForTimeout(150);
      const rows = await p.locator('[data-testid="shortcut-table-row"]').all();
      if (rows.length === 0) {
        throw new Error('Table view rendered 0 rows');
      }
      const tableHeaderText = await p.innerText('thead');
      if (!tableHeaderText.includes('COMMAND / ALIAS')) {
        throw new Error(`Table header missing Command / Alias designation, got: ${tableHeaderText}`);
      }

      // 6. Test CSV Export (Switch to All first to export full dataset)
      await p.click('[data-testid="filter-all"]');
      await p.waitForTimeout(150);
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]')
      ]);
      const dlPath = await download.path();
      const csvContent = fs.readFileSync(dlPath, 'utf8');
      if (!csvContent.includes('Command / Alias') || !csvContent.includes('COMPARE') || !csvContent.includes('AREASUM')) {
        throw new Error('Exported CSV missing required shortcut comparison headers or rows');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 17: autocad-vs-zwcad-shortcuts
    // -------------------------------------------------------------------------
    await runSubTest('17. autocad-vs-zwcad-shortcuts', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/autocad-vs-zwcad-shortcuts`, { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="shortcut-search-input"]');

      const bodyText = await p.innerText('body');

      // 1. Verify complete elimination of fabricated instant messenger alias & unverified datasmart
      if (bodyText.includes('MESSENGER') || bodyText.includes('MX') || bodyText.includes('DATASMART')) {
        throw new Error('Found fabricated legacy shortcut (MX / MESSENGER / DATASMART) on ZWCAD comparison page!');
      }

      // 2. Verify authentic ZWCAD official innovations (SMARTSEL, FCMP, SMARTVOICE, SMARTPLOT, BARCODE, QRCODE)
      const searchInput = p.locator('[data-testid="shortcut-search-input"]');
      
      await searchInput.fill('SMARTSEL');
      await p.waitForTimeout(150);
      let pageText = await p.innerText('body');
      if (!pageText.includes('SMARTSEL') || !pageText.includes('QSELECT')) {
        throw new Error('ZWCAD SmartSelect comparison missing');
      }

      await searchInput.fill('FCMP');
      await p.waitForTimeout(150);
      pageText = await p.innerText('body');
      if (!pageText.includes('FCMP') || !pageText.includes('COMPARE')) {
        throw new Error('ZWCAD File Compare (FCMP) comparison missing');
      }

      await searchInput.fill('SMARTVOICE');
      await p.waitForTimeout(150);
      pageText = await p.innerText('body');
      if (!pageText.includes('SMARTVOICE') || !pageText.includes('voice')) {
        throw new Error('ZWCAD SmartVoice innovation missing');
      }

      await searchInput.fill('BARCODE');
      await p.waitForTimeout(150);
      pageText = await p.innerText('body');
      if (!pageText.includes('BARCODE') || !pageText.includes('Code 39/128')) {
        throw new Error('ZWCAD Barcode generator feature missing');
      }

      // 3. Test Filter Identical
      await searchInput.fill('');
      await p.click('[data-testid="filter-same"]');
      await p.waitForTimeout(150);
      const sameCards = await p.locator('[data-testid="shortcut-card-item"]').all();
      if (sameCards.length === 0) {
        throw new Error('Filter Identical Only returned 0 cards');
      }

      // 4. Test CSV Export (Switch back to All first)
      await p.click('[data-testid="filter-all"]');
      await p.waitForTimeout(150);
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]')
      ]);
      const dlPath = await download.path();
      const csvContent = fs.readFileSync(dlPath, 'utf8');
      if (!csvContent.includes('SMARTSEL') || !csvContent.includes('FCMP')) {
        throw new Error('ZWCAD CSV export missing authentic smart commands');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 18: battery-capacity-calculator
    // -------------------------------------------------------------------------
    await runSubTest('18. battery-capacity-calculator', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/battery-capacity-calculator`, { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="input-load-power"]');

      // 1. Default Benchmark Assertion:
      // P = 500W, t = 4h -> E_load = 2000 Wh
      // V = 48V, DoD = 0.8, Eff = 0.9 -> Base Capacity = 2000 / (48 * 0.8 * 0.9) = 57.87037... Ah -> 57.87 Ah
      // Recommended Capacity (Margin 1.10) = 57.87037 * 1.10 = 63.657... Ah -> 63.66 Ah
      // Gross Stored Energy = 57.87037 * 48 = 2777.78 Wh -> 2777.8 Wh
      // DC Discharge Current = 500 / (48 * 0.9) = 11.574... A -> 11.57 A

      const energyVal = parseFloat((await p.locator('[data-testid="res-energy-needed"]').innerText()).replace(/,/g, ''));
      assertClose(energyVal, 2000, 0.001, 'Default Load Energy Wh');

      const capVal = parseFloat((await p.locator('[data-testid="res-battery-capacity"]').innerText()).replace(/,/g, ''));
      assertClose(capVal, 57.87, 0.005, 'Default Rated Battery Capacity Ah');

      const recCapVal = parseFloat((await p.locator('[data-testid="res-recommended-capacity"]').innerText()).replace(/,/g, ''));
      assertClose(recCapVal, 63.66, 0.005, 'Default Recommended Capacity Ah with 10% Margin');

      const storedEnergy = parseFloat((await p.locator('[data-testid="res-total-stored-energy"]').innerText()).replace(/,/g, ''));
      assertClose(storedEnergy, 2777.8, 0.005, 'Default Gross Battery Energy Wh');

      const dcCurrent = parseFloat((await p.locator('[data-testid="res-dc-discharge-current"]').innerText()).replace(/,/g, ''));
      assertClose(dcCurrent, 11.57, 0.01, 'Default DC Current A');

      // 2. Interactive Voltage Quick Presets: 24V and 120V
      await p.click('[data-testid="btn-voltage-24"]');
      await p.waitForTimeout(150);
      const cap24V = parseFloat((await p.locator('[data-testid="res-battery-capacity"]').innerText()).replace(/,/g, ''));
      assertClose(cap24V, 115.74, 0.005, '24V Sized Capacity Ah');

      await p.click('[data-testid="btn-voltage-120"]');
      await p.waitForTimeout(150);
      const cap120V = parseFloat((await p.locator('[data-testid="res-battery-capacity"]').innerText()).replace(/,/g, ''));
      assertClose(cap120V, 23.15, 0.01, '120V Sized Capacity Ah');

      // Restore 48V
      await p.click('[data-testid="btn-voltage-48"]');
      await p.waitForTimeout(150);

      // 3. Chemistry Preset: LiFePO4 (DoD = 0.85)
      await p.selectOption('[data-testid="select-chemistry"]', 'lifepo4');
      await p.waitForTimeout(150);
      const dodVal = await p.locator('[data-testid="input-dod"]').inputValue();
      if (dodVal !== '0.85') {
        throw new Error(`Expected LiFePO4 to set DoD to 0.85, got ${dodVal}`);
      }

      // 4. Strict Empty Margin Defense: NO NaN% IN UI
      await p.fill('[data-testid="input-design-margin"]', '');
      await p.waitForTimeout(150);
      const cardText = await p.locator('[data-testid="res-battery-capacity"]').locator('..').locator('..').innerText();
      if (cardText.includes('NaN%') || cardText.includes('NaN')) {
        throw new Error(`Found NaN% in recommended margin display: ${cardText}`);
      }

      // 5. Empty Input Robustness (No NaN)
      await p.fill('[data-testid="input-load-power"]', '');
      await p.waitForTimeout(150);
      const emptyCap = await p.locator('[data-testid="res-battery-capacity"]').innerText();
      if (emptyCap.includes('NaN') || !emptyCap.includes('—')) {
        throw new Error(`Empty power input rendered NaN or invalid fallback: ${emptyCap}`);
      }

      // 6. Reset button
      await p.click('[data-testid="btn-reset"]');
      await p.waitForTimeout(150);
      const resetCap = parseFloat((await p.locator('[data-testid="res-battery-capacity"]').innerText()).replace(/,/g, ''));
      assertClose(resetCap, 57.87, 0.005, 'Restored defaults after Reset');

      // 7. CSV Download
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]')
      ]);
      const dlPath = await download.path();
      const csvContent = fs.readFileSync(dlPath, 'utf8');
      if (!csvContent.includes('57.87') || !csvContent.includes('Load Power (P)')) {
        throw new Error('Battery capacity CSV missing computed Ah or parameter headers');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 19: beam-deflection-structural-calculator
    // -------------------------------------------------------------------------
    await runSubTest('19. beam-deflection-structural-calculator', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/beam-deflection-structural-calculator`, { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="input-span-length"]');

      // 1. Default Benchmark Assertion:
      // Simply supported, center point load P = 10 kN (10,000 N), L = 4.0 m (4,000 mm)
      // I-beam: H = 200 mm, B = 100 mm, tf = 8 mm, tw = 6 mm
      // Ix = (100 * 200^3 - 94 * 184^3) / 12 = 17,868,885.33 mm⁴ = 1.7869e+7 mm⁴
      // Wx = Ix / 100 = 178,688.85 mm³ = 1.7869e+5 mm³
      // Max Moment M = (P * L) / 4 = (10 * 4) / 4 = 10.000 kN·m
      // Max Bending Stress σ = 10,000,000 / 178,688.85 = 55.963 MPa -> 56.0 MPa
      // Max Deflection δ = (10,000 * 4,000^3) / (48 * 200,000 * 17,868,885.33) = 3.7309 mm -> 3.73 mm
      // Safety Factor SF = 250 / 55.963 = 4.467 -> 4.47

      const momentVal = parseFloat((await p.locator('[data-testid="res-max-moment"]').innerText()).replace(/,/g, ''));
      assertClose(momentVal, 10.000, 0.005, 'Default Max Moment kN·m');

      const stressVal = parseFloat((await p.locator('[data-testid="res-max-stress"]').innerText()).replace(/,/g, ''));
      assertClose(stressVal, 56.0, 0.01, 'Default Bending Stress MPa');

      const deflVal = parseFloat((await p.locator('[data-testid="res-max-deflection"]').innerText()).replace(/,/g, ''));
      assertClose(deflVal, 3.73, 0.01, 'Default Max Deflection mm');

      const sfVal = parseFloat((await p.locator('[data-testid="res-safety-factor"]').innerText()).replace(/,/g, ''));
      assertClose(sfVal, 4.47, 0.01, 'Default Safety Factor SF');

      const ixText = await p.locator('[data-testid="res-ix"]').innerText();
      if (!ixText.includes('1.7869')) {
        throw new Error(`Ix mismatch: expected 1.7869e+7, got ${ixText}`);
      }

      const assessmentText = await p.locator('[data-testid="res-status-assessment"]').innerText();
      if (!assessmentText.includes('SAFE')) {
        throw new Error('Default benchmark beam expected to be marked SAFE');
      }

      // 2. Strict Empty Input Defense: Clearing height must yield '—' and NOT a fake 1mm calculation
      await p.fill('[data-testid="input-dim-h"]', '');
      await p.waitForTimeout(150);
      const emptyStress = await p.locator('[data-testid="res-max-stress"]').innerText();
      const emptyDefl = await p.locator('[data-testid="res-max-deflection"]').innerText();
      const emptyStatus = await p.locator('[data-testid="res-status-assessment"]').innerText();

      if (!emptyStress.includes('—') || !emptyDefl.includes('—')) {
        throw new Error(`Clearing beam height must display '—' instead of fake numbers, got stress: ${emptyStress}, defl: ${emptyDefl}`);
      }
      if (emptyStatus.includes('DANGER')) {
        throw new Error(`Clearing beam height erroneously reported DANGER instead of awaiting valid dimensions: ${emptyStatus}`);
      }

      // Restore height
      await p.fill('[data-testid="input-dim-h"]', '200');
      await p.waitForTimeout(150);

      // 3. Test Cantilever Condition (Option 2: Cantilever + End Point Load)
      // Max Moment M = P * L = 10 * 4 = 40.000 kN·m
      await p.selectOption('[data-testid="select-load-condition"]', '2');
      await p.waitForTimeout(150);
      const cantMoment = parseFloat((await p.locator('[data-testid="res-max-moment"]').innerText()).replace(/,/g, ''));
      assertClose(cantMoment, 40.000, 0.005, 'Cantilever End Load Moment kN·m');

      // 4. Test Copy Engineering Report (Permissions granted in context)
      await p.click('[data-testid="btn-copy-report"]');
      await p.waitForTimeout(150);
      const btnCopyText = await p.locator('[data-testid="btn-copy-report"]').innerText();
      if (!btnCopyText.includes('Copied')) {
        throw new Error('Copy report button did not update to Copied state with valid clipboard permissions');
      }

      // 5. Test CSV Export
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]')
      ]);
      const dlPath = await download.path();
      const csvContent = fs.readFileSync(dlPath, 'utf8');
      if (!csvContent.includes('Moment of Inertia') || !csvContent.includes('40.000')) {
        throw new Error('Beam deflection CSV missing computed cantilever moment or Ix header');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 20: bearing-capacity-calculator
    // -------------------------------------------------------------------------
    await runSubTest('20. bearing-capacity-calculator', async (p) => {
      await p.goto(`${BASE_URL}/toolbox/bearing-capacity-calculator`, { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="input-cohesion-c"]');

      // 1. Default Benchmark Assertion (Terzaghi 1943 Method):
      // Strip Footing: sc = 1.0, sq = 1.0, sg = 1.0
      // c = 20 kPa, gamma = 18 kN/m3, Df = 1.0 m, B = 2.0 m, Nc = 30, Nq = 18, Ng = 15, FS = 3.0
      // Cohesion Term = 1.0 * 20 * 30 = 600.00 kPa
      // Surcharge Term = 1.0 * 18 * 1 * 18 = 324.00 kPa
      // Width Term = 0.5 * 1.0 * 18 * 2 * 15 = 270.00 kPa
      // qu = 600 + 324 + 270 = 1194.00 kPa
      // qa = 1194 / 3 = 398.00 kPa
      // qnet = (1194 - 18 * 1) / 3 = 392.00 kPa
      // Total Force Qa = 398 * 2 = 796.00 kN/m

      const cohTerm = parseFloat((await p.locator('[data-testid="res-cohesion-term"]').innerText()).replace(/,/g, ''));
      assertClose(cohTerm, 600.0, 0.005, 'Default Cohesion Term kPa');

      const surTerm = parseFloat((await p.locator('[data-testid="res-surcharge-term"]').innerText()).replace(/,/g, ''));
      assertClose(surTerm, 324.0, 0.005, 'Default Surcharge Term kPa');

      const widthTerm = parseFloat((await p.locator('[data-testid="res-width-term"]').innerText()).replace(/,/g, ''));
      assertClose(widthTerm, 270.0, 0.005, 'Default Width Term kPa');

      const quVal = parseFloat((await p.locator('[data-testid="res-qu"]').innerText()).replace(/,/g, ''));
      assertClose(quVal, 1194.00, 0.001, 'Default Ultimate Capacity qu kPa');

      const qaVal = parseFloat((await p.locator('[data-testid="res-qa"]').innerText()).replace(/,/g, ''));
      assertClose(qaVal, 398.00, 0.001, 'Default Allowable Capacity qa kPa');

      const qnetVal = parseFloat((await p.locator('[data-testid="res-qnet"]').innerText()).replace(/,/g, ''));
      assertClose(qnetVal, 392.00, 0.001, 'Default Net Allowable Capacity qnet kPa');

      const totalForce = parseFloat((await p.locator('[data-testid="res-total-load"]').innerText()).replace(/,/g, ''));
      assertClose(totalForce, 796.0, 0.005, 'Default Total Vertical Load Qa kN/m');

      // 2. Interactive Geometry Switch: Square Footing (Terzaghi shape factors: sc=1.3, sg=0.8)
      // qu = 1.3 * 600 + 324 + 0.8 * 270 = 780 + 324 + 216 = 1320.00 kPa
      // qa = 1320 / 3 = 440.00 kPa
      await p.click('[data-testid="btn-shape-square"]');
      await p.waitForTimeout(150);

      const quSquare = parseFloat((await p.locator('[data-testid="res-qu"]').innerText()).replace(/,/g, ''));
      assertClose(quSquare, 1320.00, 0.001, 'Square Footing Ultimate Capacity qu');

      const qaSquare = parseFloat((await p.locator('[data-testid="res-qa"]').innerText()).replace(/,/g, ''));
      assertClose(qaSquare, 440.00, 0.001, 'Square Footing Allowable Capacity qa');

      // 3. Test Terzaghi Soil Preset: Soft Clay (Phi = 0 condition, strictly Nc=5.7 per Terzaghi 1943)
      await p.click('[data-testid="btn-shape-strip"]');
      await p.waitForTimeout(100);
      await p.click('[data-testid="btn-preset-soft-clay"]');
      await p.waitForTimeout(150);
      const clayNc = await p.locator('[data-testid="input-nc"]').inputValue();
      if (clayNc !== '5.7') {
        throw new Error(`Expected Soft Clay preset to populate Terzaghi 1943 Nc=5.7, got ${clayNc}`);
      }

      // Hand-calculated verification for Soft Clay (Phi = 0, Strip B=2m, Df=1m, FS=3.0):
      // c = 25 kPa, gamma = 17 kN/m3, Nc = 5.7, Nq = 1.0, Ng = 0.0
      // Cohesion Term = 1.0 * 25 * 5.7 = 142.50 kPa
      // Surcharge Term = 1.0 * 17 * 1 * 1.0 = 17.00 kPa
      // Width Term = 0.5 * 1.0 * 17 * 2 * 0 = 0.00 kPa
      // qu = 142.50 + 17.00 + 0 = 159.50 kPa
      // qa = 159.50 / 3.0 = 53.17 kPa
      // qnet = (159.50 - 17) / 3.0 = 47.50 kPa
      // Qa = 53.1666... * 2.0 = 106.3 kN/m
      const clayCohTerm = parseFloat((await p.locator('[data-testid="res-cohesion-term"]').innerText()).replace(/,/g, ''));
      assertClose(clayCohTerm, 142.5, 0.005, 'Soft Clay Cohesion Term kPa (Nc=5.7)');

      const claySurTerm = parseFloat((await p.locator('[data-testid="res-surcharge-term"]').innerText()).replace(/,/g, ''));
      assertClose(claySurTerm, 17.0, 0.005, 'Soft Clay Surcharge Term kPa (Nq=1.0)');

      const clayWidthTerm = parseFloat((await p.locator('[data-testid="res-width-term"]').innerText()).replace(/,/g, ''));
      assertClose(clayWidthTerm, 0.0, 0.005, 'Soft Clay Width Term kPa (Ng=0.0)');

      const clayQu = parseFloat((await p.locator('[data-testid="res-qu"]').innerText()).replace(/,/g, ''));
      assertClose(clayQu, 159.50, 0.001, 'Soft Clay Ultimate Capacity qu kPa');

      const clayQa = parseFloat((await p.locator('[data-testid="res-qa"]').innerText()).replace(/,/g, ''));
      assertClose(clayQa, 53.17, 0.01, 'Soft Clay Allowable Capacity qa kPa');

      const clayQnet = parseFloat((await p.locator('[data-testid="res-qnet"]').innerText()).replace(/,/g, ''));
      assertClose(clayQnet, 47.50, 0.01, 'Soft Clay Net Allowable Capacity qnet kPa');

      const clayTotalLoad = parseFloat((await p.locator('[data-testid="res-total-load"]').innerText()).replace(/,/g, ''));
      assertClose(clayTotalLoad, 106.3, 0.1, 'Soft Clay Total Allowable Vertical Load Qa kN/m');

      // 4. Empty Input Robustness (No NaN)
      await p.fill('[data-testid="input-cohesion-c"]', '');
      await p.waitForTimeout(150);
      const emptyQu = await p.locator('[data-testid="res-qu"]').innerText();
      if (emptyQu.includes('NaN') || !emptyQu.includes('—')) {
        throw new Error(`Empty cohesion input rendered NaN: ${emptyQu}`);
      }

      // 5. Reset to defaults
      await p.click('[data-testid="btn-reset"]');
      await p.waitForTimeout(150);
      const resetQu = parseFloat((await p.locator('[data-testid="res-qu"]').innerText()).replace(/,/g, ''));
      assertClose(resetQu, 1194.00, 0.001, 'Restored default qu 1194.00 after reset');

      // 6. CSV Download
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]')
      ]);
      const dlPath = await download.path();
      const csvContent = fs.readFileSync(dlPath, 'utf8');
      if (!csvContent.includes('STRIP') || !csvContent.includes('1194.00') || !csvContent.includes('398.00')) {
        throw new Error('Bearing capacity CSV missing strip footing geometry or 1194 kPa capacity');
      }
    });

  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log('SUMMARY OF BATCH 4 (TOOLS 16 TO 20) E2E TESTS:');
  console.log('================================================================');
  let passCount = 0;
  for (const r of results) {
    const mark = r.status === 'PASS' ? '✓ [PASS]' : '✗ [FAIL]';
    console.log(`${mark} ${r.name}: ${r.status === 'PASS' ? 'All assertions verified' : r.error}`);
    if (r.status === 'PASS') passCount++;
  }
  console.log('================================================================\n');

  if (passCount !== results.length) {
    process.exit(1);
  }
}

runMasterSuite().catch((err) => {
  console.error('Fatal Master Test Suite failure:', err);
  process.exit(1);
});
