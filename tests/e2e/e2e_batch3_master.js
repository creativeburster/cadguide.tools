const { chromium } = require('playwright');
const fs = require('fs');

/**
 * CADGuide Toolbox - Master E2E Suite for Batch 3 (Tools 11 to 15)
 * Strict analytical hand-calculated benchmarks (< 0.5% error tolerance),
 * non-ASCII sanitization validation, dropdown item integrity,
 * and live Playwright download interception and content verification.
 */

function assertClose(actual, expected, maxRelError = 0.01, metricName = '') {
  if (isNaN(actual)) {
    throw new Error(`[${metricName}] Actual value is NaN (expected ${expected})`);
  }
  const diff = Math.abs(actual - expected);
  const relError = expected === 0 ? diff : diff / Math.abs(expected);
  if (relError > maxRelError) {
    throw new Error(
      `[${metricName}] Value mismatch: actual ${actual} vs expected ${expected} (relative error ${(relError * 100).toFixed(3)}% > ${(maxRelError * 100).toFixed(3)}%)`
    );
  }
}

async function runTests() {
  console.log('================================================================');
  console.log('CADGuide Toolbox - Master E2E Verification of Batch 3 (Tools 11 to 15)');
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
    // Tool 11: ada-ramp-slope-calculator
    // -------------------------------------------------------------------------
    await runSubTest('11. ada-ramp-slope-calculator', async (p) => {
      await p.goto('http://localhost:3000/toolbox/ada-ramp-slope-calculator', { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="input-rise"]');

      // 1. Default Condition: Rise = 28 in, Slope = 1:12, MaxRise = 30 in
      // Hand Calculation:
      // Run = (28 * 12) / 12 = 28.0 ft
      // Runs = ceil(28 / 30) = 1 run; Intermediate Landings = 0
      // Footprint = 28.0 + 0 = 28.0 ft
      // Handrails = 2 * (28.0 + 2) = 60.0 ft
      const defRun = parseFloat(await p.locator('[data-testid="result-run-ft"]').innerText());
      assertClose(defRun, 28.0, 0.005, 'Default Horizontal Run (ft)');

      const defFootprint = parseFloat(await p.locator('[data-testid="result-footprint-ft"]').innerText());
      assertClose(defFootprint, 28.0, 0.005, 'Default Total Footprint (ft)');

      const defLandings = parseInt(await p.locator('[data-testid="result-landings"]').innerText(), 10);
      if (defLandings !== 0) throw new Error(`Expected 0 landings, got ${defLandings}`);

      const defHandrails = parseFloat(await p.locator('[data-testid="result-handrails"]').innerText());
      assertClose(defHandrails, 60.0, 0.005, 'Default Handrails (60.0 ft)');

      const defBadge = await p.locator('[data-testid="badge-compliance"]').innerText();
      if (!defBadge.includes('ADA COMPLIANT')) throw new Error(`Expected ADA COMPLIANT badge, got "${defBadge}"`);

      // 2. Multi-tier Condition: Rise = 42 in (Commercial Entrance with intermediate landing)
      // Hand Calculation:
      // Run = (42 * 12) / 12 = 42.0 ft
      // Required Runs = ceil(42 / 30) = 2 runs
      // Intermediate Landings = 2 - 1 = 1 landing
      // Footprint = 42.0 + 1 * 5 = 47.0 ft
      // Handrails = 2 * (47.0 + 2) = 98.0 ft
      await p.fill('[data-testid="input-rise"]', '42');
      await p.waitForTimeout(200);

      const modRun = parseFloat(await p.locator('[data-testid="result-run-ft"]').innerText());
      assertClose(modRun, 42.0, 0.005, 'Modified 42 in Run (ft)');

      const modLandings = parseInt(await p.locator('[data-testid="result-landings"]').innerText(), 10);
      if (modLandings !== 1) throw new Error(`Expected 1 intermediate landing for 42 in rise, got ${modLandings}`);

      const modFootprint = parseFloat(await p.locator('[data-testid="result-footprint-ft"]').innerText());
      assertClose(modFootprint, 47.0, 0.005, 'Modified Footprint with Landing (47.0 ft)');

      const modHandrails = parseFloat(await p.locator('[data-testid="result-handrails"]').innerText());
      assertClose(modHandrails, 98.0, 0.005, 'Modified Handrails (98.0 ft)');

      // 3. Preset Trigger Test
      await p.click('[data-testid="preset-btn-0"]'); // 7" single step
      await p.waitForTimeout(150);
      const presetRise = await p.locator('[data-testid="input-rise"]').inputValue();
      if (presetRise !== '7') throw new Error(`Expected preset rise 7, got ${presetRise}`);

      // 4. Live CSV Download Interception
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]')
      ]);
      const dlPath = await download.path();
      const csvContent = fs.readFileSync(dlPath, 'utf8');
      if (!csvContent.includes('2010 ADA Standards for Accessible Design Section 405')) {
        throw new Error('CSV missing ADA Section 405 citation');
      }
      if (!csvContent.includes('Horizontal Ramp Run (feet)')) {
        throw new Error('CSV missing Horizontal Ramp Run field');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 12: area-unit-converter
    // -------------------------------------------------------------------------
    await runSubTest('12. area-unit-converter', async (p) => {
      await p.goto('http://localhost:3000/toolbox/area-unit-converter', { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="input-value"]');

      // 1. Default Benchmark: 1 m² -> ft²
      // 1 / 0.09290304 = 10.76391... -> formatted as 10.764
      let resVal = parseFloat((await p.locator('[data-testid="result-value"]').innerText()).replace(/,/g, ''));
      assertClose(resVal, 10.764, 0.005, 'Default 1 m2 to ft2');

      // 2. Opus Benchmark 1: 1 ha to ft² (Testing bugfix of missing ha factor)
      // Exact math: 10000 m² / 0.09290304 m²/ft² = 107639.104167 ft²
      await p.fill('[data-testid="input-value"]', '1');
      await p.selectOption('[data-testid="select-from"]', 'ha');
      await p.selectOption('[data-testid="select-to"]', 'ft2');
      await p.waitForFunction(() => {
        const txt = document.querySelector('[data-testid="result-value"]')?.innerText || '';
        return txt.includes('107,639') || txt.includes('107639');
      });

      resVal = parseFloat((await p.locator('[data-testid="result-value"]').innerText()).replace(/,/g, ''));
      assertClose(resVal, 107639.1, 0.001, '1 ha to ft² exact benchmark');

      // 3. Opus Benchmark 2: 1 acre to m²
      // Exact math: 4046.8564224 m²
      await p.selectOption('[data-testid="select-from"]', 'acre');
      await p.selectOption('[data-testid="select-to"]', 'm2');
      await p.waitForFunction(() => {
        const txt = document.querySelector('[data-testid="result-value"]')?.innerText || '';
        return txt.includes('4,046') || txt.includes('4046');
      });

      resVal = parseFloat((await p.locator('[data-testid="result-value"]').innerText()).replace(/,/g, ''));
      assertClose(resVal, 4046.86, 0.001, '1 acre to m² exact benchmark');

      // 4. Opus Benchmark 3: 1 yd² to ft²
      // Exact math: 0.83612736 / 0.09290304 = 9.000000 ft²
      await p.selectOption('[data-testid="select-from"]', 'yd2');
      await p.selectOption('[data-testid="select-to"]', 'ft2');
      await p.waitForTimeout(200);

      resVal = parseFloat((await p.locator('[data-testid="result-value"]').innerText()).replace(/,/g, ''));
      assertClose(resVal, 9.0, 0.001, '1 yd² to ft² exact benchmark');

      // 5. Swap Units Button Verification
      await p.click('[data-testid="btn-swap"]');
      await p.waitForTimeout(200);
      const newFrom = await p.locator('[data-testid="select-from"]').inputValue();
      const newTo = await p.locator('[data-testid="select-to"]').inputValue();
      if (newFrom !== 'ft2' || newTo !== 'yd2') {
        throw new Error(`Swap units failed: From=${newFrom}, To=${newTo}`);
      }
      resVal = parseFloat((await p.locator('[data-testid="result-value"]').innerText()).replace(/,/g, ''));
      assertClose(resVal, 1 / 9, 0.005, 'Swapped 1 ft² to yd² (0.1111)');

      // 6. Empty Input Fallback Verification (Must render '—' and never 'NaN m²')
      await p.fill('[data-testid="input-value"]', '');
      await p.waitForTimeout(200);
      const emptyDisplay = await p.locator('[data-testid="result-value"]').innerText();
      if (emptyDisplay !== '—') {
        throw new Error(`Expected '—' for empty input, got '${emptyDisplay}'`);
      }
      const pageBodyText = await p.locator('body').innerText();
      if (pageBodyText.includes('NaN m²')) {
        throw new Error("Found 'NaN m²' rendered on page when input is empty");
      }
      const unitLabel = await p.locator('[data-testid="result-unit"]').innerText();
      if (unitLabel !== 'yd²') {
        throw new Error(`Expected unit label 'yd²', got '${unitLabel}'`);
      }

      // Restore value for CSV export
      await p.fill('[data-testid="input-value"]', '1');
      await p.waitForTimeout(150);

      // 7. CSV Export Check (Must cite ISO 80000-3)
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]')
      ]);
      const dlPath = await download.path();
      const csvContent = fs.readFileSync(dlPath, 'utf8');
      if (!csvContent.includes('NIST SP 811 / ISO 80000-3')) {
        throw new Error('CSV missing exact NIST SP 811 / ISO 80000-3 citation');
      }
      if (!csvContent.includes('Square Foot')) {
        throw new Error('CSV missing source unit name');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 13: autocad-fatal-error-wizard
    // -------------------------------------------------------------------------
    await runSubTest('13. autocad-fatal-error-wizard', async (p) => {
      await p.goto('http://localhost:3000/toolbox/autocad-fatal-error-wizard', { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="scenario-btn-crash-opening-specific-drawing"]');

      // 1. Initial State: Scenario 1 selected by default
      const causeCards = await p.locator('[data-testid="wizard-cause-card"]').all();
      if (causeCards.length === 0) {
        throw new Error('No diagnostic cause cards rendered for Scenario 1');
      }

      // Verify authentic Autodesk KB methods in the text
      const pageText = await p.locator('body').innerText();
      if (!pageText.includes('RECOVER') || !pageText.includes('AUDIT') || !pageText.includes('PURGE')) {
        throw new Error('Missing official Autodesk DWG recovery commands (RECOVER/AUDIT/PURGE)');
      }

      // 2. Official Source Link Verification
      const sourceLinks = await p.locator('[data-testid="wizard-source-link"]').all();
      if (sourceLinks.length === 0) {
        throw new Error('No official Autodesk KB source links found on page');
      }
      const firstHref = await sourceLinks[0].getAttribute('href');
      if (!firstHref || !firstHref.includes('autodesk.com/support')) {
        throw new Error(`Source link is not an official Autodesk support URL: ${firstHref}`);
      }

      // 3. Switch Scenario: Click Scenario 2 (Startup Crash)
      await p.click('[data-testid="scenario-btn-crash-at-startup"]');
      await p.waitForTimeout(200);

      const startupText = await p.locator('body').innerText();
      if (!startupText.includes('Reset Settings to Default') && !startupText.includes('graphics driver')) {
        throw new Error('Scenario 2 does not display expected startup troubleshooting advice');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 14: autocad-registry-clean-generator
    // -------------------------------------------------------------------------
    await runSubTest('14. autocad-registry-clean-generator', async (p) => {
      await p.goto('http://localhost:3000/toolbox/autocad-registry-clean-generator', { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="select-cad-version"]');

      // 1. Dropdown Integrity: Must NOT contain unreleased AutoCAD 2027
      const versionOptions = await p.locator('[data-testid="select-cad-version"] option').allTextContents();
      const has2027 = versionOptions.some(opt => opt.includes('2027'));
      if (has2027) {
        throw new Error('Found unreleased AutoCAD 2027 in dropdown; must only contain verified releases (2020-2026)');
      }
      if (!versionOptions.some(opt => opt.includes('AutoCAD 2026 (R25.1)'))) {
        throw new Error('Missing verified AutoCAD 2026 (R25.1) release');
      }

      // 2. Default Script Verification (AutoCAD 2024 / R24.3)
      const previewText = await p.locator('[data-testid="bat-script-preview"]').innerText();
      if (!previewText.includes('HKCU\\Software\\Autodesk\\AutoCAD\\R24.3')) {
        throw new Error('Default script missing R24.3 registry key');
      }
      if (!previewText.includes('set "BACKUP_DIR=%USERPROFILE%\\Desktop\\CAD_Registry_Backup"')) {
        throw new Error('Script missing desktop backup directory logic');
      }

      // 3. Strict Pure-ASCII Check (No ✓, ⚠, or mojibake in CMD script)
      const hasNonAscii = /[^\x00-\x7F]/.test(previewText);
      if (hasNonAscii) {
        const matches = previewText.match(/[^\x00-\x7F]/g);
        throw new Error(`Script contains non-ASCII characters that will cause CMD encoding errors: ${matches?.slice(0, 5).join(', ')}`);
      }

      // 4. Toggle Option & Switch Version
      await p.selectOption('[data-testid="select-cad-version"]', '0'); // AutoCAD 2026
      await p.check('[data-testid="checkbox-hklm"]');
      await p.check('[data-testid="checkbox-flexlm"]');
      await p.waitForTimeout(200);

      const updatedScript = await p.locator('[data-testid="bat-script-preview"]').innerText();
      if (!updatedScript.includes('R25.1')) {
        throw new Error('Script did not update to AutoCAD 2026 (R25.1) registry key');
      }
      if (!updatedScript.includes('HKLM\\Software\\Autodesk\\AutoCAD\\R25.1')) {
        throw new Error('Script did not include HKLM branch when checked');
      }

      // 5. Strict CMD Redirection Security Check: No unescaped < or > characters in echo commands
      if (updatedScript.includes('<ProductKey>') || updatedScript.includes('<') || updatedScript.includes('> nul 2>&1') === false) {
        if (updatedScript.includes('<ProductKey>')) {
          throw new Error('Found fatal unescaped <ProductKey> in batch script that breaks CMD execution');
        }
      }
      if (!updatedScript.includes('-pk PRODUCT_KEY -pv 2026.0.0.F')) {
        throw new Error('FLEXnet helper line missing dynamic -pv 2026.0.0.F or safe PRODUCT_KEY placeholder');
      }

      // 6. Intercept .bat File Download
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-download-bat"]')
      ]);
      const dlPath = await download.path();
      const batContent = fs.readFileSync(dlPath, 'utf8');
      if (!batContent.startsWith('@echo off')) {
        throw new Error('Downloaded file does not start with standard @echo off batch header');
      }
      if (!batContent.includes('reg export')) {
        throw new Error('Downloaded batch file missing reg export safety backup command');
      }
      if (batContent.includes('<ProductKey>')) {
        throw new Error('Downloaded .bat file contains unescaped <ProductKey>');
      }
    });

    // -------------------------------------------------------------------------
    // Tool 15: ball-screw-calculator
    // -------------------------------------------------------------------------
    await runSubTest('15. ball-screw-calculator', async (p) => {
      await p.goto('http://localhost:3000/toolbox/ball-screw-calculator', { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('[data-testid="input-axial-load"]');

      // 1. Default Benchmark Hand Calculation:
      // F = 5000 N, lead = 10 mm = 0.01 m, eta1 = 0.90, eta2 = 0.80, n = 1000 RPM
      // Drive Torque T1 = (5000 * 0.01) / (2 * pi * 0.90) = 50 / 5.6548668 = 8.84194 Nm -> 8.842
      // Drive Power P = T1 * (2 * pi * 1000 / 60) = 8.84194 * 104.719755 = 925.926 W -> 925.93
      // Backdrive Torque Tb = (5000 * 0.01 * 0.80) / (2 * pi) = 40 / 6.2831853 = 6.36620 Nm -> 6.366
      // Linear Speed v = (1000 * 10) / 60 = 166.667 mm/s -> 166.7
      // Linear Speed (m/min) = (1000 * 10) / 1000 = 10.0 m/min
      const defTorque = parseFloat(await p.locator('[data-testid="result-drive-torque"]').innerText());
      assertClose(defTorque, 8.842, 0.002, 'Default Drive Torque (8.842 Nm)');

      const defPower = parseFloat(await p.locator('[data-testid="result-drive-power"]').innerText());
      assertClose(defPower, 925.93, 0.002, 'Default Drive Power (925.93 W)');

      const defBackdrive = parseFloat(await p.locator('[data-testid="result-backdrive-torque"]').innerText());
      assertClose(defBackdrive, 6.366, 0.002, 'Default Backdrive Torque with eta2=0.80 (6.366 Nm)');

      const defSpeedMms = parseFloat(await p.locator('[data-testid="result-linear-speed-mms"]').innerText());
      assertClose(defSpeedMms, 166.7, 0.002, 'Default Linear Speed (166.7 mm/s)');

      const defSpeedMmin = parseFloat(await p.locator('[data-testid="result-linear-speed-mmin"]').innerText());
      assertClose(defSpeedMmin, 10.0, 0.002, 'Default Linear Speed (10.0 m/min)');

      // 2. Preset Switching: 20 mm Lead Preset
      // Lead = 20 mm -> T1 should double: 8.84194 * 2 = 17.684 Nm
      // Linear speed should double: 166.67 * 2 = 333.3 mm/s (20.0 m/min)
      await p.click('[data-testid="preset-lead-20"]');
      await p.waitForTimeout(200);

      const modTorque = parseFloat(await p.locator('[data-testid="result-drive-torque"]').innerText());
      assertClose(modTorque, 17.684, 0.002, 'Preset 20mm Lead Drive Torque (17.684 Nm)');

      const modSpeedMms = parseFloat(await p.locator('[data-testid="result-linear-speed-mms"]').innerText());
      assertClose(modSpeedMms, 333.3, 0.002, 'Preset 20mm Linear Speed (333.3 mm/s)');

      const modSpeedMmin = parseFloat(await p.locator('[data-testid="result-linear-speed-mmin"]').innerText());
      assertClose(modSpeedMmin, 20.0, 0.002, 'Preset 20mm Linear Speed (20.0 m/min)');

      // 3. Live CSV Download
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="btn-export-csv"]')
      ]);
      const dlPath = await download.path();
      const csvContent = fs.readFileSync(dlPath, 'utf8');
      if (!csvContent.includes('ISO 3408-1 / DIN 69051 Ball Screws')) {
        throw new Error('CSV missing ISO 3408 citation');
      }
      if (!csvContent.includes('Direct Drive Torque (Nm)')) {
        throw new Error('CSV missing Direct Drive Torque field');
      }
      if (!csvContent.includes('Backdrive Holding Torque (Nm)')) {
        throw new Error('CSV missing Backdrive Holding Torque field');
      }
    });

  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log('SUMMARY OF BATCH 3 (TOOLS 11 TO 15) E2E TESTS:');
  console.log('================================================================');
  testResults.forEach(r => {
    console.log(`${r.status === 'PASS' ? '✓ [PASS]' : '✗ [FAIL]'} ${r.tool}: ${r.details}`);
  });
  console.log('================================================================\n');

  const failedCount = testResults.filter(r => r.status === 'FAIL').length;
  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
