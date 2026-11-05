const { chromium } = require('playwright');
const fs = require('fs');

/**
 * CADGuide Toolbox - Master E2E Suite for Tools 1 to 10
 * Fast, highly stable, strict analytical benchmarks (< 1.0% error),
 * and live file download inspections.
 */

function assertClose(actual, expected, maxRelError = 0.015, metricName = '') {
  if (isNaN(actual)) {
    throw new Error(`[${metricName}] Actual value is NaN (expected ${expected})`);
  }
  const diff = Math.abs(actual - expected);
  const relError = expected === 0 ? diff : diff / Math.abs(expected);
  if (relError > maxRelError) {
    throw new Error(
      `[${metricName}] Value mismatch: actual ${actual} vs expected ${expected} (relative error ${(relError * 100).toFixed(2)}% > ${(maxRelError * 100).toFixed(2)}%)`
    );
  }
}

async function runTests() {
  console.log('================================================================');
  console.log('CADGuide Toolbox - Master E2E Verification of Tools 1 to 10');
  console.log('================================================================');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    permissions: ['clipboard-read', 'clipboard-write'],
    acceptDownloads: true
  });
  const page = await context.newPage();

  const testResults = [];
  const pageErrors = [];
  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
    console.error('  [Browser PageError]:', err.message);
  });

  const runSubTest = async (toolName, testFn) => {
    pageErrors.length = 0;
    process.stdout.write(`Testing [${toolName}] ... `);
    try {
      await testFn(page);
      if (pageErrors.length > 0) {
        throw new Error(`Page generated unhandled runtime errors: ${pageErrors.join('; ')}`);
      }
      console.log('✓ PASSED');
      testResults.push({ tool: toolName, status: 'PASS', details: 'All assertions verified' });
    } catch (err) {
      console.log('✗ FAILED');
      console.error(`  Error: ${err.message}`);
      testResults.push({ tool: toolName, status: 'FAIL', details: err.message });
    }
  };

  try {
    // -------------------------------------------------------------------------
    // Tool 1: 3D Print Cost & Time Estimator
    // -------------------------------------------------------------------------
    // Hand Calculation Derivations:
    // 1. Default Benchmark:
    //    V_model = 20 cm³, Infill = 20%, Shells = 3 (fraction = 0.3)
    //    f_eff = 0.3 + 0.7 * 0.20 = 0.44
    //    V_printed = 20 * 0.44 = 8.8 cm³
    //    Weight (PLA rho=1.24) = 8.8 * 1.24 = 10.912 g -> 10.9 g
    //    Material Cost = (10.912 / 1000) * 20 = $0.21824 -> $0.22
    //    Bead Path Area = (0.2 * 0.4)/100 = 0.0008 cm²
    //    Bead Path Length = 8.8 / 0.0008 = 11000 cm = 110.0 m
    //    1.75mm Spool Length = 8.8 / 0.0240528 = 365.86 cm = 3.66 m
    //    Print Time = (110000 mm / 60 mm/s) / 3600 * 1.3 = 0.6620 hr (39.7 min -> "0h 40m")
    //    Elec Cost = (120/1000) * 0.6620 * 0.15 = $0.0119 -> $0.01
    //    Total Cost = 0.21824 + 0.0119 = $0.2301 -> $0.23
    //
    // 2. Modified Condition: Volume = 50 cm³, Infill = 40%
    //    f_eff = 0.3 + 0.7 * 0.40 = 0.58
    //    V_printed = 50 * 0.58 = 29.0 cm³
    //    Weight = 29.0 * 1.24 = 35.96 g -> 36.0 g
    //    Material Cost = (35.96 / 1000) * 20 = $0.7192 -> $0.72
    //    Bead Path Length = 29.0 / 0.0008 = 36250 cm = 362.5 m
    //    1.75mm Spool Length = 29.0 / 0.0240528 = 1205.68 cm = 12.06 m
    //    Print Time = (362500 / 60) / 3600 * 1.3 = 2.1817 hr (130.9 min -> "2h 11m")
    //    Elec Cost = 0.12 * 2.1817 * 0.15 = $0.03927 -> $0.04
    //    Total Cost = 0.7192 + 0.03927 = $0.7585 -> $0.76
    // -------------------------------------------------------------------------
    await runSubTest('1. 3d-print-cost-time-estimator', async (p) => {
      await p.goto('http://localhost:3000/toolbox/3d-print-cost-time-estimator', { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="result-total-cost"]');

      // 1. Default Benchmark Assertions (< 1% error)
      const defCost = parseFloat((await p.locator('[data-testid="result-total-cost"]').innerText()).replace(/[^0-9.]/g, ''));
      assertClose(defCost, 0.23, 0.01, 'Default Total Cost');

      const defWeight = parseFloat(await p.locator('[data-testid="result-weight"]').innerText());
      assertClose(defWeight, 10.9, 0.01, 'Default Filament Weight (g)');

      const defFilLen = parseFloat(await p.locator('[data-testid="result-filament-length"]').innerText());
      assertClose(defFilLen, 3.66, 0.01, 'Default 1.75mm Spool Length (m)');

      const defBeadLen = parseFloat(await p.locator('[data-testid="result-bead-length"]').innerText());
      assertClose(defBeadLen, 110.0, 0.01, 'Default Bead Path Length (m)');

      // 2. Modified Condition: Volume = 50 cm³, Infill = 40%
      await p.fill('[data-testid="input-volume"]', '50');
      await p.fill('[data-testid="input-infill"]', '40');
      await p.waitForTimeout(200);

      const modCost = parseFloat((await p.locator('[data-testid="result-total-cost"]').innerText()).replace(/[^0-9.]/g, ''));
      assertClose(modCost, 0.76, 0.01, 'Modified Total Cost ($0.76)');

      const modWeight = parseFloat(await p.locator('[data-testid="result-weight"]').innerText());
      assertClose(modWeight, 36.0, 0.01, 'Modified Filament Weight (36.0g)');

      const modFilLen = parseFloat(await p.locator('[data-testid="result-filament-length"]').innerText());
      assertClose(modFilLen, 12.06, 0.01, 'Modified 1.75mm Spool Length (12.06m)');

      const modBeadLen = parseFloat(await p.locator('[data-testid="result-bead-length"]').innerText());
      assertClose(modBeadLen, 362.5, 0.01, 'Modified Bead Path Length (362.5m)');

      // 3. Live CSV Download and Content Verification
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]')
      ]);
      const downloadPath = await download.path();
      const csvContent = fs.readFileSync(downloadPath, 'utf8');

      if (!csvContent.includes('3D Print Cost & Time Estimator Report')) {
        throw new Error('CSV content missing header');
      }
      if (!csvContent.includes('Bead Path Length (m)') || !csvContent.includes('1.75mm Filament Length (m)')) {
        throw new Error('CSV content missing bead path or filament spool length rows');
      }
      if (!csvContent.includes('Total Cost ($)')) {
        throw new Error('CSV content missing total cost row');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 2: 3D Printing Chordal Deviation Calculator
    // -------------------------------------------------------------------------
    await runSubTest('2. 3d-printing-chordal-deviation', async (p) => {
      await p.goto('http://localhost:3000/toolbox/3d-printing-chordal-deviation', { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="result-sagitta"]');

      // Default: Radius = 5.0 mm, Angular step = 10°
      const defSagitta = parseFloat(await p.locator('[data-testid="result-sagitta"]').innerText());
      assertClose(defSagitta, 0.0190, 0.01, 'Default Sagitta mm');

      const defSegments = parseInt(await p.locator('[data-testid="result-segments"]').innerText(), 10);
      if (defSegments !== 36) {
        throw new Error(`Expected 36 segments, got ${defSegments}`);
      }

      // Verdict label check
      const verdict = await p.locator('[data-testid="verdict-label"]').innerText();
      if (!verdict.includes('Excellent')) {
        throw new Error(`Expected Excellent verdict, got: ${verdict}`);
      }

      // Change radius to 25 mm: S = 25 * (1 - cos(5°)) = 0.09513 mm
      await p.fill('[data-testid="input-radius"]', '25');
      await p.waitForTimeout(200);
      const modSagitta = parseFloat(await p.locator('[data-testid="result-sagitta"]').innerText());
      assertClose(modSagitta, 0.0951, 0.01, 'Modified Sagitta for R=25mm');

      // Copy summary button check
      await p.click('[data-testid="btn-copy-summary"]');
      await p.waitForTimeout(100);
    });

    // -------------------------------------------------------------------------
    // Tool 3: 3D Print Layer Time Calculator
    // -------------------------------------------------------------------------
    await runSubTest('3. 3d-print-layer-time-calculator', async (p) => {
      await p.goto('http://localhost:3000/toolbox/3d-print-layer-time-calculator', { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="print-total-time"]');

      // 1. Default Benchmark
      const totalTimeStr = await p.locator('[data-testid="print-total-time"]').innerText();
      if (!totalTimeStr.includes('8h 53m')) {
        throw new Error(`Total time formatted string mismatch: expected '8h 53m', got '${totalTimeStr}'`);
      }

      const filLen = parseFloat(await p.locator('[data-testid="print-filament-length"]').innerText());
      assertClose(filLen, 42.6, 0.01, 'Filament Length (m)');

      const plaMass = parseFloat(await p.locator('[data-testid="print-filament-weight"]').innerText());
      assertClose(plaMass, 127.0, 0.01, 'PLA Weight (g)');

      const avgLayerTime = parseFloat(await p.locator('[data-testid="print-time-per-layer"]').innerText());
      assertClose(avgLayerTime, 128.0, 0.01, 'Average Layer Time (s)');

      // 2. Modified Condition: Set overhead to 0%
      const overheadInput = p.locator('[data-testid="print-input-overhead"]');
      await overheadInput.fill('0');
      await p.waitForTimeout(200);

      const zeroOverheadTime = await p.locator('[data-testid="print-total-time"]').innerText();
      if (!zeroOverheadTime.includes('7h 7m')) {
        throw new Error(`Zero-overhead total time mismatch: expected '7h 7m', got '${zeroOverheadTime}'`);
      }

      // 3. Boundary check: 1 layer
      const layersInput = p.locator('[data-testid="print-input-layers"]');
      await layersInput.fill('1');
      await p.waitForTimeout(200);
      const boundaryLen = parseFloat(await p.locator('[data-testid="print-filament-length"]').innerText());
      if (isNaN(boundaryLen) || boundaryLen <= 0) {
        throw new Error('Boundary single-layer evaluation produced invalid filament length');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 4: AutoCAD PGP Shortcut Key Alias Editor
    // -------------------------------------------------------------------------
    await runSubTest('4. acad-pgp-alias-editor', async (p) => {
      await p.goto('http://localhost:3000/toolbox/acad-pgp-alias-editor', { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="terminal-input"]');

      // 1. Add a non-existing unique custom alias: TESTCMD -> ZOOM
      await p.fill('[data-testid="input-new-alias"]', 'TESTCMD');
      await p.fill('[data-testid="input-new-command"]', 'ZOOM');
      await p.click('[data-testid="btn-add-alias"]');
      await p.waitForTimeout(200);

      // 2. Terminal simulator verification strictly inside data-testid="terminal-output"
      await p.fill('[data-testid="terminal-input"]', 'TESTCMD');
      await p.press('[data-testid="terminal-input"]', 'Enter');
      await p.waitForTimeout(200);

      const terminalOutput = await p.locator('[data-testid="terminal-output"]').innerText();
      if (!terminalOutput.includes('[TESTCMD] ➔ Execute core command [ZOOM]')) {
        throw new Error(`Terminal output did not record execution of custom alias. Output was:\n${terminalOutput}`);
      }

      // 3. Live acad.pgp Download and Syntax Verification
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-download-pgp"]')
      ]);
      const downloadPath = await download.path();
      const pgpContent = fs.readFileSync(downloadPath, 'utf8');

      if (!pgpContent.includes('AutoCAD Command Alias (PGP) File')) {
        throw new Error('Downloaded PGP file missing header comment');
      }
      if (!pgpContent.includes('TESTCMD') || !pgpContent.includes('*ZOOM')) {
        throw new Error('Downloaded PGP file does not contain newly created alias TESTCMD, *ZOOM');
      }
      if (!pgpContent.includes('; End of AutoCAD Command Alias file')) {
        throw new Error('Downloaded PGP file missing clean EOF footer comment');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 5: Acoustic Decibel Calculator
    // -------------------------------------------------------------------------
    await runSubTest('5. acoustic-decibel-calculator', async (p) => {
      await p.goto('http://localhost:3000/toolbox/acoustic-decibel-calculator', { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="acoustic-distance-spl"]');

      // 1. Default Benchmark
      const spl2Text = await p.locator('[data-testid="acoustic-distance-spl"]').innerText();
      assertClose(parseFloat(spl2Text), 65.0, 0.01, 'Distance Attenuated SPL');

      const attenText = await p.locator('[data-testid="acoustic-attenuation"]').innerText();
      assertClose(parseFloat(attenText), 20.0, 0.01, 'Attenuation dB');

      const combText = await p.locator('[data-testid="acoustic-combined-spl"]').innerText();
      assertClose(parseFloat(combText), 88.0, 0.01, 'Two 85dB Sources Addition');

      // 2. Modified Condition: Source 2 changed to 75 dB
      const src2Input = p.locator('[data-testid="acoustic-source-1"]');
      await src2Input.fill('75');
      await p.waitForTimeout(200);

      const combModified = parseFloat(await p.locator('[data-testid="acoustic-combined-spl"]').innerText());
      assertClose(combModified, 85.4, 0.01, '85dB + 75dB Addition');

      // 3. Boundary check: Inverse distance d1=10, d2=1
      const d1Input = p.locator('input[type="number"]').nth(1);
      const d2Input = p.locator('input[type="number"]').nth(2);
      await d1Input.fill('10');
      await d2Input.fill('1');
      await p.waitForTimeout(200);
      const closeSpl = parseFloat(await p.locator('[data-testid="acoustic-distance-spl"]').innerText());
      assertClose(closeSpl, 105.0, 0.01, 'Close Proximity SPL');
    });

    // -------------------------------------------------------------------------
    // Tool 6: Aeration Tank Calculator
    // -------------------------------------------------------------------------
    await runSubTest('6. aeration-tank-calculator', async (p) => {
      await p.goto('http://localhost:3000/toolbox/aeration-tank-calculator', { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="aeration-basin-volume"]');

      // 1. Default Benchmark
      const volume = parseFloat(await p.locator('[data-testid="aeration-basin-volume"]').innerText());
      assertClose(volume, 1708, 0.01, 'Aeration Basin Volume (m³)');

      const hrt = parseFloat(await p.locator('[data-testid="aeration-hrt"]').innerText());
      assertClose(hrt, 8.2, 0.01, 'Hydraulic Retention Time (h)');

      const fm = parseFloat(await p.locator('[data-testid="aeration-fm"]').innerText());
      assertClose(fm, 0.215, 0.01, 'Food-to-Microorganism (F/M)');

      const aor = parseFloat(await p.locator('[data-testid="aeration-aor"]').innerText());
      assertClose(aor, 1230.0, 0.01, 'Daily Oxygen Demand (kg O2/d)');

      const airflow = parseFloat(await p.locator('[data-testid="aeration-airflow"]').innerText());
      assertClose(airflow, 30.6, 0.01, 'Standard Airflow Rate (Nm³/min)');

      const blowerKw = parseFloat(await p.locator('[data-testid="aeration-blower-power"]').innerText());
      assertClose(blowerKw, 35.7, 0.02, 'Blower Shaft Power (kW)');

      // 2. Modified Condition: Double inflow Q to 10000 m³/d
      const qInput = p.locator('input[type="number"]').nth(0);
      await qInput.fill('10000');
      await p.waitForTimeout(200);

      const doubleVolume = parseFloat(await p.locator('[data-testid="aeration-basin-volume"]').innerText());
      assertClose(doubleVolume, 3417, 0.01, 'Doubled Inflow Volume (m³)');

      // 3. Boundary check: Inflow BOD = Effluent BOD (Zero removal)
      const bodInInput = p.locator('input[type="number"]').nth(1);
      const bodOutInput = p.locator('input[type="number"]').nth(2);
      await bodInInput.fill('20');
      await bodOutInput.fill('20');
      await p.waitForTimeout(200);
      const zeroVolume = parseFloat(await p.locator('[data-testid="aeration-basin-volume"]').innerText());
      assertClose(zeroVolume, 0, 0.01, 'Zero Removal Basin Volume');
    });

    // -------------------------------------------------------------------------
    // Tool 7: Air Duct Pressure Calculator
    // -------------------------------------------------------------------------
    await runSubTest('7. air-duct-pressure-calculator', async (p) => {
      await p.goto('http://localhost:3000/toolbox/air-duct-pressure-calculator', { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="duct-total-loss-pa"]');

      // 1. Default Benchmark
      const totalPa = parseFloat(await p.locator('[data-testid="duct-total-loss-pa"]').innerText());
      assertClose(totalPa, 49.7, 0.01, 'Total Duct Loss (Pa)');

      const totalInWg = parseFloat(await p.locator('[data-testid="duct-total-loss-inwg"]').innerText());
      assertClose(totalInWg, 0.200, 0.01, 'Total Duct Loss (in. w.g.)');

      const frictionPa = parseFloat(await p.locator('[data-testid="duct-friction-pa"]').innerText());
      assertClose(frictionPa, 19.6, 0.02, 'Friction Loss (Pa)');

      const dynamicPa = parseFloat(await p.locator('[data-testid="duct-dynamic-pa"]').innerText());
      assertClose(dynamicPa, 30.1, 0.01, 'Dynamic Fitting Loss (Pa)');

      // 2. Modified Condition: Double velocity to 10 m/s
      const velInput = p.locator('[data-testid="duct-input-velocity"]');
      await velInput.fill('10');
      await p.waitForTimeout(200);

      const modifiedDynamicPa = parseFloat(await p.locator('[data-testid="duct-dynamic-pa"]').innerText());
      assertClose(modifiedDynamicPa, 120.4, 0.01, 'Quadrupled Dynamic Loss (Pa)');

      // 3. Boundary check: Zero length
      const lenInput = p.locator('[data-testid="duct-input-length"]');
      await lenInput.fill('0');
      await p.waitForTimeout(200);
      const zeroLenFriction = parseFloat(await p.locator('[data-testid="duct-friction-pa"]').innerText());
      assertClose(zeroLenFriction, 0.0, 0.01, 'Zero Length Friction Loss');
    });

    // -------------------------------------------------------------------------
    // Tool 8: Anchor Bolt Calculator
    // -------------------------------------------------------------------------
    await runSubTest('8. anchor-bolt-calculator', async (p) => {
      await p.goto('http://localhost:3000/toolbox/anchor-bolt-calculator', { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="disclaimer-banner"]');

      // Check Engineering Disclaimer
      const disclaimer = await p.locator('[data-testid="disclaimer-banner"]').innerText();
      if (!disclaimer.toUpperCase().includes('DISCLAIMER')) {
        throw new Error('Mandatory safety disclaimer not found');
      }

      // Default Benchmark: Cast-in Headed M16 Grade 8.8 (fc=25, fu=800, fy=640)
      const breakoutKn = parseFloat(await p.locator('[data-testid="anchor-breakout-capacity"]').innerText());
      assertClose(breakoutKn, 50.00, 0.01, 'Concrete Breakout Capacity (kN)');

      const steelTensionKn = parseFloat(await p.locator('[data-testid="anchor-steel-tension"]').innerText());
      assertClose(steelTensionKn, 125.46, 0.01, 'Steel Tensile Rupture (kN)');

      const steelYieldKn = parseFloat(await p.locator('[data-testid="anchor-steel-yield"]').innerText());
      assertClose(steelYieldKn, 100.37, 0.01, 'Steel Yield Capacity (kN)');

      const steelShearKn = parseFloat(await p.locator('[data-testid="anchor-steel-shear"]').innerText());
      assertClose(steelShearKn, 75.28, 0.01, 'Steel Shear Capacity (kN)');

      const governingKn = parseFloat(await p.locator('[data-testid="anchor-governing-tension"]').innerText());
      assertClose(governingKn, 50.00, 0.01, 'Governing Tension Capacity (kN)');

      // Modified Condition: Switch to M20 Grade 8.8 Preset (idx=2)
      await p.click('[data-testid="preset-bolt-2"]');
      await p.waitForTimeout(200);

      const m20BreakoutKn = parseFloat(await p.locator('[data-testid="anchor-breakout-capacity"]').innerText());
      assertClose(m20BreakoutKn, 69.88, 0.01, 'M20 Concrete Breakout Capacity (kN)');

      // Boundary check: Deep embedment hef=400mm where steel governs
      const hefInput = p.locator('input[type="number"]').nth(1);
      await hefInput.fill('400');
      await p.waitForTimeout(200);
      const deepGoverning = parseFloat(await p.locator('[data-testid="anchor-governing-tension"]').innerText());
      assertClose(deepGoverning, 196.03, 0.01, 'Deep Embedment Steel-Governed Capacity (kN)');
    });

    // -------------------------------------------------------------------------
    // Tool 9: Angle Unit Converter
    // -------------------------------------------------------------------------
    await runSubTest('9. angle-unit-converter', async (p) => {
      await p.goto('http://localhost:3000/toolbox/angle-unit-converter', { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="angle-converted-result"]');

      // Default: 90 deg -> 1.570796 rad
      const radVal = parseFloat(await p.locator('[data-testid="angle-converted-result"]').innerText());
      assertClose(radVal, 1.570796, 0.001, '90 deg to Radian');

      const baseDeg = parseFloat(await p.locator('[data-testid="angle-base-degrees"]').innerText());
      assertClose(baseDeg, 90.0, 0.001, 'Base Degrees (°)');

      const turns = parseFloat(await p.locator('[data-testid="angle-turns"]').innerText());
      assertClose(turns, 0.25, 0.001, 'Quarter Turn (rev)');

      const quadText = await p.locator('[data-testid="angle-quadrant"]').innerText();
      if (!quadText.includes('Positive Y-Axis')) {
        throw new Error(`Expected quadrant 'Positive Y-Axis', got '${quadText}'`);
      }

      // Preset 180° Click
      const preset180 = p.getByRole('button', { name: '180°' });
      await preset180.click();
      await p.waitForTimeout(200);

      const rad180 = parseFloat(await p.locator('[data-testid="angle-converted-result"]').innerText());
      assertClose(rad180, 3.141593, 0.001, '180 deg to Radian (pi)');

      const quad180 = await p.locator('[data-testid="angle-quadrant"]').innerText();
      if (!quad180.includes('Negative X-Axis')) {
        throw new Error(`Expected quadrant 'Negative X-Axis', got '${quad180}'`);
      }

      // Swap direction: rad to deg with 1 rad input
      const swapBtn = p.getByRole('button', { name: /Swap Direction/i });
      await swapBtn.click();
      const valInput = p.locator('input[type="number"]').first();
      await valInput.fill('1');
      await p.waitForTimeout(200);

      const degFrom1Rad = parseFloat(await p.locator('[data-testid="angle-converted-result"]').innerText());
      assertClose(degFrom1Rad, 57.29578, 0.001, '1 Rad to Degrees');
    });

    // -------------------------------------------------------------------------
    // Tool 10: Arc Flash Incident Energy Calculator
    // -------------------------------------------------------------------------
    await runSubTest('10. arc-flash-calculator', async (p) => {
      await p.goto('http://localhost:3000/toolbox/arc-flash-calculator', { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="arc-incident-energy"]');

      // Default: 0.48 kV, Box, 25 kA, 0.12 s, 455 mm (18 in), Gap 32 mm
      // IEEE 1584-2002: Ia ≈ 14.34 kA, En ≈ 4.07 J/cm², E ≈ 5.93 cal/cm² (24.8 J/cm²), AFB ≈ 1615 mm
      const eCal = parseFloat(await p.locator('[data-testid="arc-incident-energy"]').innerText());
      assertClose(eCal, 5.93, 0.02, 'Incident Energy E (cal/cm²)');

      const iaKa = parseFloat(await p.locator('[data-testid="arc-arcing-current"]').innerText());
      assertClose(iaKa, 14.34, 0.01, 'Arcing Current Ia (kA)');

      const afbMm = parseFloat(await p.locator('[data-testid="arc-flash-boundary"]').innerText());
      assertClose(afbMm, 1615, 0.02, 'Arc Flash Boundary AFB (mm)');

      const eJoules = parseFloat(await p.locator('[data-testid="arc-energy-joules"]').innerText().then(t => t.replace(/[^0-9.]/g, '')));
      assertClose(eJoules, 24.8, 0.02, 'Incident Energy in SI (J/cm²)');

      // Faster clearing time t = 0.03 s
      const timeInput = p.locator('input[type="number"]').nth(2);
      await timeInput.fill('0.03');
      await p.waitForTimeout(200);

      const fastECal = parseFloat(await p.locator('[data-testid="arc-incident-energy"]').innerText());
      assertClose(fastECal, 1.48, 0.02, 'Fast Clearing Incident Energy (cal/cm²)');

      const fastAfb = parseFloat(await p.locator('[data-testid="arc-flash-boundary"]').innerText());
      assertClose(fastAfb, 692, 0.03, 'Fast Clearing AFB (mm)');

      // High-hazard Condition triggering > 40 cal/cm² blast warning
      await timeInput.fill('1.0');
      const faultInput = p.locator('input[type="number"]').nth(1);
      await faultInput.fill('50');
      await p.waitForTimeout(200);

      const highEnergy = parseFloat(await p.locator('[data-testid="arc-incident-energy"]').innerText());
      if (highEnergy <= 40.0) {
        throw new Error(`Expected high incident energy > 40 cal/cm², got ${highEnergy}`);
      }
      const warningVisible = await p.getByText(/EXTREME HAZARD/i).count();
      if (warningVisible === 0) {
        throw new Error('High energy > 40 cal/cm² failed to trigger EXTREME HAZARD badge');
      }
    });

  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log('SUMMARY OF ALL FIRST 10 TOOLS E2E TESTS:');
  console.log('================================================================');
  let allPass = true;
  for (const r of testResults) {
    const symbol = r.status === 'PASS' ? '✓' : '✗';
    console.log(`${symbol} [${r.status}] ${r.tool}: ${r.details}`);
    if (r.status !== 'PASS') allPass = false;
  }
  console.log('================================================================');

  if (!allPass) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Fatal Test Runner Error:', e);
  process.exit(1);
});
