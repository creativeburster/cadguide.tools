/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * CADGuide.tools Toolbox - Master E2E Verification Suite for Batch 9 (Tools 41 to 45)
 *
 * Validates:
 * 41. cable-pull-tension-calculator (Euler-Eytelwein capstan tension & Southwire SW-1003229 SWP = T/R, presets, 0-deg boundary, input defenses, CSV export, negative assertions)
 * 42. cable-sizing-calculator (3-phase & 1-phase AC voltage drop, linear resistance, IEC 60228 standard section selection, input defenses, CSV export, negative assertions)
 * 43. cable-tray-fill-calculator (Circular cable cross-section, usable tray area, NEC Article 392 fill limits, integer/boundary defenses, CSV export, negative assertions)
 * 44. cad-format-compatibility-matrix (Directional Import -> Export bridge lookup, table-scoped search & filters, CSV export, negative assertions)
 * 45. cad-hatch-scale-optimizer (AutoCAD HPSCALE, ANSI31 0.125 base pitch, HPMAXLINES 100..10000000 range, unit switching, Canvas fallback, CSV export, negative assertions)
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

async function verifyNoNaNOrInfinity(page, context) {
  const text = await page.innerText('body');
  if (text.includes('NaN')) {
    throw new Error(`[${context}] Found NaN text on page!`);
  }
  if (text.includes('Infinity')) {
    throw new Error(`[${context}] Found Infinity text on page!`);
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

async function runBatch9Tests() {
  console.log('================================================================');
  console.log('CADGuide Toolbox - Master E2E Verification of Batch 9 (Tools 41 to 45)');
  console.log('================================================================');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(60000);

  const results = [];

  const runSubTest = async (name, testFn) => {
    process.stdout.write(`Testing [${name}] ... `);
    try {
      await testFn(page);
      console.log('✓ [PASS]');
      results.push({ name, status: 'PASS' });
    } catch (err) {
      console.log('✗ [FAIL]');
      console.error(`  Error: ${err.message}`);
      results.push({ name, status: 'FAIL', error: err.message });
    }
  };

  try {
    // -------------------------------------------------------------------------
    // Tool 41: cable-pull-tension-calculator
    // -------------------------------------------------------------------------
    await runSubTest('41. cable-pull-tension-calculator', async (p) => {
      await openToolPage(p, `${BASE_URL}/toolbox/cable-pull-tension-calculator`, '[data-testid="input-mass"]');

      // 1. Default Hand-Calculation (m = 4.5 kg/m, L = 120 m, mu = 0.35, theta = 90 deg, R = 0.6 m, swpMax = 7.30 kN/m)
      // Step-by-step unit derivation:
      //   Linear weight: W = 4.5 [kg/m] * 9.81 [m/s^2] = 44.145 [N/m]
      //   Straight pull tension: T_in = (44.145 [N/m] * 120 [m] * 0.35) / 1000 [N/kN] = 1854.09 / 1000 = 1.85409 [kN] -> 1.854
      //   Bend angle in radians: theta_rad = 90 * (pi / 180) = 1.5707963268 [rad]
      //   Capstan bend multiplier: M_bend = exp(0.35 * 1.5707963268) = exp(0.5497787144) = 1.7328697 [x] -> 1.733
      //   Total exit tension: T_out = 1.85409 [kN] * 1.7328697 = 3.212896 [kN] -> 3.213
      //   Sidewall bearing pressure: SWP = 3.212896 [kN] / 0.6 [m] = 5.354827 [kN/m] -> 5.355 (<= 7.30 -> 'Within Limit')
      assertClose(parseFloat(await p.innerText('[data-testid="result-tension"]')), 3.213, 0.001, 'Default Exit Tension');
      assertClose(parseFloat(await p.innerText('[data-testid="result-swp"]')), 5.355, 0.001, 'Default SWP');
      assertClose(parseFloat(await p.innerText('[data-testid="result-straight-tension"]')), 1.854, 0.001, 'Default Straight Tension');
      assertClose(parseFloat(await p.innerText('[data-testid="result-multiplier"]')), 1.733, 0.001, 'Default Bend Multiplier');
      if ((await p.innerText('[data-testid="result-status"]')).trim() !== 'Within Limit') {
        throw new Error('Expected default Cable Pull status Within Limit');
      }

      // 2. Preset 1: Dry Conduit 180 deg Sweep (m=6.0, L=100, mu=0.50, theta=180, R=0.6, swpMax=7.30)
      // Hand calc:
      //   T_in = (6.0 * 9.81 * 100 * 0.50) / 1000 = 2.943 [kN] -> 2.943
      //   M_bend = exp(0.50 * pi) = 4.81047738 -> 4.810
      //   T_out = 2.943 * 4.81047738 = 14.157235 [kN] -> 14.157
      //   SWP = 14.157235 / 0.6 = 23.59539 [kN/m] -> 23.595 ('Exceeds Limit')
      await p.click('[data-testid="preset-btn-1"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-status"]').textContent.trim() === 'Exceeds Limit');
      assertClose(parseFloat(await p.innerText('[data-testid="result-straight-tension"]')), 2.943, 0.001, 'Preset 1 Straight');
      assertClose(parseFloat(await p.innerText('[data-testid="result-multiplier"]')), 4.810, 0.001, 'Preset 1 Multiplier');
      assertClose(parseFloat(await p.innerText('[data-testid="result-tension"]')), 14.157, 0.001, 'Preset 1 Tension');
      assertClose(parseFloat(await p.innerText('[data-testid="result-swp"]')), 23.595, 0.001, 'Preset 1 SWP');

      // 3. Preset 2: Industrial Feeder Southwire 1000 lb/ft (m=8.0, L=100, mu=0.25, theta=90, R=0.9, swpMax=14.59)
      // Hand calc:
      //   T_in = (8.0 * 9.81 * 100 * 0.25) / 1000 = 1.962 [kN]
      //   M_bend = exp(0.25 * pi / 2) = 1.48097267 -> 1.481
      //   T_out = 1.962 * 1.48097267 = 2.905668 [kN] -> 2.906
      //   SWP = 2.905668 / 0.9 = 3.22852 [kN/m] -> 3.229 ('Within Limit')
      await p.click('[data-testid="preset-btn-2"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-status"]').textContent.trim() === 'Within Limit');
      assertClose(parseFloat(await p.innerText('[data-testid="result-straight-tension"]')), 1.962, 0.001, 'Preset 2 Straight');
      assertClose(parseFloat(await p.innerText('[data-testid="result-multiplier"]')), 1.481, 0.001, 'Preset 2 Multiplier');
      assertClose(parseFloat(await p.innerText('[data-testid="result-tension"]')), 2.906, 0.001, 'Preset 2 Tension');
      assertClose(parseFloat(await p.innerText('[data-testid="result-swp"]')), 3.229, 0.001, 'Preset 2 SWP');

      // 4. Zero-angle straight pull check (Reset then angle = 0 -> multiplier = 1.000, T_out = T_in = 1.854)
      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-tension"]').textContent.trim() === '3.213');
      await p.locator('[data-testid="input-angle"]').fill('0');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-multiplier"]').textContent.trim() === '1.000');
      assertClose(parseFloat(await p.innerText('[data-testid="result-tension"]')), 1.854, 0.001, 'Zero Bend Tension');
      assertClose(parseFloat(await p.innerText('[data-testid="result-swp"]')), 3.090, 0.001, 'Zero Bend SWP');

      // 5. Input Defenses on >= 2 inputs ('', 'abc', '12abc', '-1')
      const massInput = p.locator('[data-testid="input-mass"]');
      const muInput = p.locator('[data-testid="input-mu"]');

      await massInput.fill('');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-tension"]').textContent.trim() === '—');
      if ((await p.innerText('[data-testid="result-status"]')).trim() !== '—') {
        throw new Error('Cable Pull empty input must show status —');
      }
      await verifyNoNaNOrInfinity(p, 'Cable Pull empty mass');

      await massInput.fill('abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-tension"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Cable Pull abc mass');

      await massInput.fill('4.5');
      await muInput.fill('12abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-tension"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Cable Pull 12abc mu');

      await muInput.fill('-0.2');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-tension"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Cable Pull negative mu');

      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-tension"]').textContent.trim() === '3.213');

      // 6. CSV Export Verification
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="export-csv-btn"]'),
      ]);
      const csvText = fs.readFileSync(await download.path(), 'utf8');
      if (!csvText.includes('Cable_Mass_kg_m,Straight_Length_m,Friction_Coeff_mu') || !csvText.includes('Southwire')) {
        throw new Error('Cable Pull CSV missing expected headers');
      }
      if (!csvText.includes('4.5,120,0.35,90,0.6,7.30,1.854,1.733,3.213,5.355,Within Limit')) {
        throw new Error('Cable Pull CSV missing expected numerical row');
      }

      // 7. Negative Assertions
      const coreText =
        (await p.innerText('[data-testid="calculator-inputs"]')) +
        ' ' +
        (await p.innerText('[data-testid="calculator-results"]'));
      for (const banned of ['IEEE 1185', 'IEEE 576', 'IEC 60909', 'IPC-2221']) {
        if (coreText.includes(banned)) {
          throw new Error(`Cable Pull core contains removed standard '${banned}'`);
        }
      }
    });

    // -------------------------------------------------------------------------
    // Tool 42: cable-sizing-calculator
    // -------------------------------------------------------------------------
    await runSubTest('42. cable-sizing-calculator', async (p) => {
      await openToolPage(p, `${BASE_URL}/toolbox/cable-sizing-calculator`, '[data-testid="input-current"]');

      // 1. Default Hand-Calculation (3-Phase, I=60 A, L=120 m, U=400 V, cosPhi=0.85, maxDrop=3%, A=16 mm^2, rho=0.0172, X=0.08)
      // Step-by-step unit derivation:
      //   Route length in km: L_km = 120 [m] / 1000 [m/km] = 0.12 [km]
      //   Conductor resistance per km: R = (0.0172 [Ohm*mm^2/m] * 1000 [m/km]) / 16 [mm^2] = 1.075 [Ohm/km]
      //   sinPhi = sqrt(1 - 0.85^2) = sqrt(0.2775) = 0.5267826876
      //   Z_eff = 1.075 * 0.85 + 0.08 * 0.5267826876 = 0.91375 + 0.042142615 = 0.955892615 [Ohm/km]
      //   dU = sqrt(3) * 60 [A] * 0.12 [km] * 0.955892615 [Ohm/km] = 11.92071 [V] -> 11.92
      //   dU% = (11.92071 / 400) * 100 = 2.98018 [%] -> 2.98
      //   Z_allow = (400 * 0.03) / (sqrt(3) * 60 * 0.12) = 0.96225045 [Ohm/km]
      //   A_min = (17.2 * 0.85) / (0.96225045 - 0.042142615) = 14.62 / 0.92010783 = 15.8894 [mm^2] -> 15.89
      //   Next IEC 60228 section >= 15.89 mm^2: '16' ('Within Limit')
      assertClose(parseFloat(await p.innerText('[data-testid="result-vd-volts"]')), 11.92, 0.001, 'Default VD Volts');
      assertClose(parseFloat(await p.innerText('[data-testid="result-vd-pct"]')), 2.98, 0.001, 'Default VD Pct');
      assertClose(parseFloat(await p.innerText('[data-testid="result-resistance"]')), 1.075, 0.001, 'Default Resistance');
      assertClose(parseFloat(await p.innerText('[data-testid="result-min-area"]')), 15.89, 0.001, 'Default Min Area');
      if ((await p.innerText('[data-testid="result-iec-size"]')).trim() !== '16') {
        throw new Error('Expected default IEC 60228 size 16');
      }
      if ((await p.innerText('[data-testid="result-status"]')).trim() !== 'Within Limit') {
        throw new Error('Expected default Cable Sizing status Within Limit');
      }

      // 2. Preset 1: 1-Phase 230V Cu Branch (1phase, I=32, L=60, U=230, cosPhi=0.90, maxDrop=3, A=6, rho=0.0172, X=0.08)
      // Hand calc:
      //   L_km = 0.06 km, R = 17.2 / 6 = 2.86667 -> 2.867 Ohm/km, sinPhi = sqrt(0.19) = 0.43588989
      //   Z_eff = 2.866667 * 0.90 + 0.08 * 0.43588989 = 2.6148712 Ohm/km
      //   dU = 2 * 32 * 0.06 * 2.6148712 = 10.0411 V -> 10.04, dU% = 4.3657% -> 4.37 ('Exceeds Limit')
      //   Z_allow = 6.90 / 3.84 = 1.796875 -> A_min = 15.48 / (1.796875 - 0.03487119) = 8.7855 -> 8.79 -> IEC '10'
      await p.click('[data-testid="preset-btn-1"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-status"]').textContent.trim() === 'Exceeds Limit');
      assertClose(parseFloat(await p.innerText('[data-testid="result-vd-volts"]')), 10.04, 0.001, 'Preset 1 VD Volts');
      assertClose(parseFloat(await p.innerText('[data-testid="result-vd-pct"]')), 4.37, 0.001, 'Preset 1 VD Pct');
      assertClose(parseFloat(await p.innerText('[data-testid="result-resistance"]')), 2.867, 0.001, 'Preset 1 Resistance');
      assertClose(parseFloat(await p.innerText('[data-testid="result-min-area"]')), 8.79, 0.001, 'Preset 1 Min Area');
      if ((await p.innerText('[data-testid="result-iec-size"]')).trim() !== '10') {
        throw new Error('Expected Preset 1 IEC 60228 size 10');
      }

      // 3. Preset 2: 3-Phase 400V Al Feeder (3phase, I=100, L=150, U=400, cosPhi=0.85, maxDrop=5, A=50, rho=0.0282, X=0.08)
      // Hand calc:
      //   L_km = 0.15 km, R = 28.2 / 50 = 0.564 Ohm/km
      //   Z_eff = 0.564 * 0.85 + 0.042142615 = 0.5215426 Ohm/km
      //   dU = sqrt(3) * 100 * 0.15 * 0.5215426 = 13.5501 V -> 13.55, dU% = 3.3875% -> 3.39 ('Within Limit')
      //   A_min = 23.97 / (20 / 25.980762 - 0.042142615) = 32.9413 -> 32.94 -> IEC '35'
      await p.click('[data-testid="preset-btn-2"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-iec-size"]').textContent.trim() === '35');
      assertClose(parseFloat(await p.innerText('[data-testid="result-vd-volts"]')), 13.55, 0.001, 'Preset 2 VD Volts');
      assertClose(parseFloat(await p.innerText('[data-testid="result-vd-pct"]')), 3.39, 0.001, 'Preset 2 VD Pct');
      assertClose(parseFloat(await p.innerText('[data-testid="result-resistance"]')), 0.564, 0.001, 'Preset 2 Resistance');
      assertClose(parseFloat(await p.innerText('[data-testid="result-min-area"]')), 32.94, 0.001, 'Preset 2 Min Area');

      // 4. Input Defenses on >= 2 inputs ('', 'abc', '12abc', pf = '1.2' > 1)
      const curInput = p.locator('[data-testid="input-current"]');
      const pfInput = p.locator('[data-testid="input-pf"]');

      await curInput.fill('');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-vd-volts"]').textContent.trim() === '—');
      if ((await p.innerText('[data-testid="result-iec-size"]')).trim() !== '—') {
        throw new Error('Cable Sizing empty input must show IEC size —');
      }
      await verifyNoNaNOrInfinity(p, 'Cable Sizing empty current');

      await curInput.fill('abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-vd-volts"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Cable Sizing abc current');

      await curInput.fill('60');
      await pfInput.fill('12abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-vd-volts"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Cable Sizing 12abc pf');

      await pfInput.fill('1.2');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-vd-volts"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Cable Sizing pf > 1');

      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-vd-volts"]').textContent.trim() === '11.92');

      // 5. CSV Export Verification
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="export-csv-btn"]'),
      ]);
      const csvText = fs.readFileSync(await download.path(), 'utf8');
      if (!csvText.includes('Phase_System,Current_A,Length_m,Voltage_V') || !csvText.includes('IEC 60228')) {
        throw new Error('Cable Sizing CSV missing expected headers');
      }
      if (!csvText.includes('3phase,60,120,400,0.85,3,16,0.0172,0.08,1.075,11.92,2.98,15.89,16,Within Limit')) {
        throw new Error('Cable Sizing CSV missing expected numerical row');
      }

      // 6. Negative Assertions
      const coreText =
        (await p.innerText('[data-testid="calculator-inputs"]')) +
        ' ' +
        (await p.innerText('[data-testid="calculator-results"]'));
      for (const banned of ['NEC 310.16', 'IEC 60909', 'IPC-2221', 'IEEE Std 1584']) {
        if (coreText.includes(banned)) {
          throw new Error(`Cable Sizing core contains unverified/removed standard '${banned}'`);
        }
      }
    });

    // -------------------------------------------------------------------------
    // Tool 43: cable-tray-fill-calculator
    // -------------------------------------------------------------------------
    await runSubTest('43. cable-tray-fill-calculator', async (p) => {
      await openToolPage(p, `${BASE_URL}/toolbox/cable-tray-fill-calculator`, '[data-testid="input-width"]');

      // 1. Default Hand-Calculation (W=300 mm, H=100 mm, n1=8, d1=24 mm, n2=20, d2=12 mm, maxFill=40%)
      // Step-by-step unit derivation (1 cm^2 = 100 mm^2):
      //   A_tray = 300 [mm] * 100 [mm] = 30000 [mm^2] = 300.00 [cm^2]
      //   A_cables = 8 * (pi * 24^2 / 4) + 20 * (pi * 12^2 / 4)
      //            = 3619.11474 + 2261.94671 = 5881.06145 [mm^2] = 58.8106 [cm^2] -> 58.81
      //   Fill% = (5881.06145 / 30000) * 100 = 19.6035 [%] -> 19.60
      //   Remaining = 300.00 * 0.40 - 58.8106 = 120.00 - 58.8106 = 61.1894 [cm^2] -> 61.19 ('Within Limit')
      assertClose(parseFloat(await p.innerText('[data-testid="result-fill-pct"]')), 19.60, 0.001, 'Default Tray Fill Pct');
      assertClose(parseFloat(await p.innerText('[data-testid="result-cable-area"]')), 58.81, 0.001, 'Default Cable Area');
      assertClose(parseFloat(await p.innerText('[data-testid="result-tray-area"]')), 300.00, 0.001, 'Default Tray Area');
      assertClose(parseFloat(await p.innerText('[data-testid="result-remaining-area"]')), 61.19, 0.001, 'Default Remaining Area');
      if ((await p.innerText('[data-testid="result-status"]')).trim() !== 'Within Limit') {
        throw new Error('Expected default Cable Tray status Within Limit');
      }

      // 2. Preset 1: Ladder Tray Control Only 50% Limit (W=450, H=100, n1=0, d1=0, n2=120, d2=14, maxFill=50)
      // Hand calc:
      //   A_tray = 45000 mm^2 = 450.00 cm^2
      //   A_cables = 120 * (pi * 196 / 4) = 18472.5648 mm^2 = 184.7256 cm^2 -> 184.73
      //   Fill% = (18472.5648 / 45000) * 100 = 41.0501% -> 41.05
      //   Remaining = 450.00 * 0.50 - 184.7256 = 40.2744 cm^2 -> 40.27 ('Within Limit')
      await p.click('[data-testid="preset-btn-1"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-tray-area"]').textContent.trim() === '450.00');
      assertClose(parseFloat(await p.innerText('[data-testid="result-fill-pct"]')), 41.05, 0.001, 'Preset 1 Fill Pct');
      assertClose(parseFloat(await p.innerText('[data-testid="result-cable-area"]')), 184.73, 0.001, 'Preset 1 Cable Area');
      assertClose(parseFloat(await p.innerText('[data-testid="result-remaining-area"]')), 40.27, 0.001, 'Preset 1 Remaining');

      // 3. Preset 2: Overfilled 150x75 Tray (W=150, H=75, n1=10, d1=22, n2=15, d2=14, maxFill=40)
      // Hand calc:
      //   A_tray = 11250 mm^2 = 112.50 cm^2
      //   A_cables = 10 * (pi * 484 / 4) + 15 * (pi * 196 / 4) = 3801.3271 + 2309.0706 = 6110.3977 mm^2 = 61.1040 cm^2 -> 61.10
      //   Fill% = (6110.3977 / 11250) * 100 = 54.3146% -> 54.31
      //   Remaining = 112.50 * 0.40 - 61.1040 = -16.1040 cm^2 -> -16.10 ('Exceeds Limit')
      await p.click('[data-testid="preset-btn-2"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-status"]').textContent.trim() === 'Exceeds Limit');
      assertClose(parseFloat(await p.innerText('[data-testid="result-fill-pct"]')), 54.31, 0.001, 'Preset 2 Fill Pct');
      assertClose(parseFloat(await p.innerText('[data-testid="result-cable-area"]')), 61.10, 0.001, 'Preset 2 Cable Area');
      assertClose(parseFloat(await p.innerText('[data-testid="result-tray-area"]')), 112.50, 0.001, 'Preset 2 Tray Area');
      assertClose(parseFloat(await p.innerText('[data-testid="result-remaining-area"]')), -16.10, 0.001, 'Preset 2 Remaining');

      // 4. Input Defenses on >= 2 inputs ('', 'abc', '12abc', non-integer cable count '1.5')
      const wInput = p.locator('[data-testid="input-width"]');
      const n1Input = p.locator('[data-testid="input-n1"]');

      await wInput.fill('');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-fill-pct"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Tray Fill empty width');

      await wInput.fill('abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-fill-pct"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Tray Fill abc width');

      await wInput.fill('300');
      await n1Input.fill('12abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-fill-pct"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Tray Fill 12abc n1');

      await n1Input.fill('1.5');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-fill-pct"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Tray Fill non-integer n1');

      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-fill-pct"]').textContent.trim() === '19.60');

      // 5. CSV Export Verification
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="export-csv-btn"]'),
      ]);
      const csvText = fs.readFileSync(await download.path(), 'utf8');
      if (!csvText.includes('Tray_Width_mm,Tray_Depth_mm,Group1_Count') || !csvText.includes('Article 392')) {
        throw new Error('Cable Tray CSV missing expected headers');
      }
      if (!csvText.includes('300,100,8,24,20,12,40,19.60,58.81,300.00,61.19,Within Limit')) {
        throw new Error('Cable Tray CSV missing expected numerical row');
      }

      // 6. Negative Assertions
      const coreText =
        (await p.innerText('[data-testid="calculator-inputs"]')) +
        ' ' +
        (await p.innerText('[data-testid="calculator-results"]'));
      for (const banned of ['NEMA VE 2', 'IEC 60909', 'IPC-2221', 'IEEE Std 1584']) {
        if (coreText.includes(banned)) {
          throw new Error(`Cable Tray core contains removed standard '${banned}'`);
        }
      }
    });

    // -------------------------------------------------------------------------
    // Tool 44: cad-format-compatibility-matrix
    // -------------------------------------------------------------------------
    await runSubTest('44. cad-format-compatibility-matrix', async (p) => {
      await openToolPage(p, `${BASE_URL}/toolbox/cad-format-compatibility-matrix`, '[data-testid="select-source-format"]');

      // 1. Default Bridge Check: STEP (Import) -> STL (Export) => 2 tools (AutoCAD, Rhino 8), 24 total rows
      if ((await p.innerText('[data-testid="bridge-count"]')).trim() !== '2') {
        throw new Error('Expected 2 bridge tools for STEP -> STL');
      }
      if ((await p.locator('[data-testid="bridge-card-autocad"]').count()) !== 1) {
        throw new Error('Expected AutoCAD bridge card for STEP -> STL');
      }
      if ((await p.locator('[data-testid="bridge-card-rhino"]').count()) !== 1) {
        throw new Error('Expected Rhino 8 bridge card for STEP -> STL');
      }
      if ((await p.locator('[data-testid="matrix-table"] tbody tr').count()) !== 24) {
        throw new Error('Expected 24 verified matrix rows by default');
      }

      // 2. Directional Asymmetry Check: STL (Import) -> STEP (Export) => 1 tool (Rhino 8 only; AutoCAD does not import STL)
      await p.selectOption('[data-testid="select-source-format"]', 'STL');
      await p.selectOption('[data-testid="select-target-format"]', 'STEP');
      await p.waitForFunction(() => document.querySelector('[data-testid="bridge-count"]').textContent.trim() === '1');
      if ((await p.locator('[data-testid="bridge-card-autocad"]').count()) !== 0) {
        throw new Error('AutoCAD must NOT appear as a bridge for STL -> STEP');
      }
      if ((await p.locator('[data-testid="bridge-card-rhino"]').count()) !== 1) {
        throw new Error('Rhino 8 must appear as a bridge for STL -> STEP');
      }

      // 3. Zero Single-Hop Bridge Check: SAT (Import: AutoCAD only) -> 3MF (Export: Rhino 8 & OpenSCAD) => 0 tools
      await p.selectOption('[data-testid="select-source-format"]', 'SAT');
      await p.selectOption('[data-testid="select-target-format"]', '3MF');
      await p.waitForFunction(() => document.querySelector('[data-testid="bridge-count"]').textContent.trim() === '0');
      if ((await p.locator('[data-testid="bridge-empty"]').count()) !== 1) {
        throw new Error('Expected bridge-empty guidance when 0 single-hop tools exist');
      }

      // 4. Keyword Search scoped strictly to matrix-table tbody tr
      await p.locator('[data-testid="search-input"]').fill('IGESIMPORT');
      await p.waitForFunction(() => document.querySelectorAll('[data-testid="matrix-table"] tbody tr').length === 1);
      const igesRowText = await p.innerText('[data-testid="matrix-table"] tbody tr');
      if (!igesRowText.includes('AutoCAD') || !igesRowText.includes('IGES')) {
        throw new Error('Scoped table search for IGESIMPORT did not return AutoCAD IGES row');
      }

      // 5. Software & Direction Filters scoped to matrix-table tbody tr
      await p.locator('[data-testid="search-input"]').fill('');
      await p.selectOption('[data-testid="filter-software"]', 'Blender');
      await p.waitForFunction(() => document.querySelectorAll('[data-testid="matrix-table"] tbody tr').length === 4);

      await p.selectOption('[data-testid="filter-software"]', 'All');
      await p.selectOption('[data-testid="filter-direction"]', 'import-only');
      await p.waitForFunction(() => document.querySelectorAll('[data-testid="matrix-table"] tbody tr').length === 3);

      await p.selectOption('[data-testid="filter-direction"]', 'export-only');
      await p.waitForFunction(() => document.querySelectorAll('[data-testid="matrix-table"] tbody tr').length === 2);

      // 6. Reset & CSV Export Verification
      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(
        () =>
          document.querySelector('[data-testid="bridge-count"]').textContent.trim() === '2' &&
          document.querySelectorAll('[data-testid="matrix-table"] tbody tr').length === 24
      );
      await verifyNoNaNOrInfinity(p, 'Format Matrix reset');

      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="export-csv-btn"]'),
      ]);
      const csvText = fs.readFileSync(await download.path(), 'utf8');
      if (
        !csvText.includes('Software,Format,Import_Supported,Export_Supported,Command_Or_Menu_Reference,Official_Source') ||
        !csvText.includes('"AutoCAD","STEP","Yes","No"') ||
        !csvText.includes('"AutoCAD","STL","No","Yes"')
      ) {
        throw new Error('Format Matrix CSV missing expected directional entries');
      }

      // 7. Negative Assertions (unverified IFC/BIM standards & unverified software removed)
      const coreText =
        (await p.innerText('[data-testid="calculator-inputs"]')) +
        ' ' +
        (await p.innerText('[data-testid="calculator-results"]'));
      for (const banned of ['IFC', 'ISO 16739', 'ISO 19650', 'FreeCAD', 'SolidWorks']) {
        if (coreText.includes(banned)) {
          throw new Error(`Format Matrix core contains unverified item '${banned}'`);
        }
      }
    });

    // -------------------------------------------------------------------------
    // Tool 45: cad-hatch-scale-optimizer
    // -------------------------------------------------------------------------
    await runSubTest('45. cad-hatch-scale-optimizer', async (p) => {
      await openToolPage(p, `${BASE_URL}/toolbox/cad-hatch-scale-optimizer`, '[data-testid="input-plot-scale"]');

      // 1. Default Hand-Calculation (unit=mm [u=1.0], S=100, p0=0.125, d_target=2.5 mm, HPSCALE=2000, W=10000, H=10000, HPMAXLINES=100000)
      // Step-by-step unit derivation:
      //   Model-space pitch: s_model = 0.125 [units] * 2000 = 250.000 [units]
      //   Plotted paper spacing: d_paper = (250.000 [units] * 1.0 [mm/unit]) / 100 = 2.500 [mm]
      //   Recommended HPSCALE: HPSCALE_rec = (2.5 [mm] * 100) / (0.125 [units] * 1.0 [mm/unit]) = 2000.00
      //   45-deg ANSI31 line count: N_lines = ((10000 + 10000) / sqrt(2)) / 250 = 14142.1356 / 250 = 56.5685 -> 56.57 ('Optimal')
      assertClose(parseFloat(await p.innerText('[data-testid="result-rec-hpscale"]')), 2000.00, 0.001, 'Default Rec HPSCALE');
      assertClose(parseFloat(await p.innerText('[data-testid="result-paper-spacing"]')), 2.500, 0.001, 'Default Paper Spacing');
      assertClose(parseFloat(await p.innerText('[data-testid="result-model-spacing"]')), 250.000, 0.001, 'Default Model Pitch');
      assertClose(parseFloat(await p.innerText('[data-testid="result-line-count"]')), 56.57, 0.001, 'Default Line Count');
      if ((await p.innerText('[data-testid="result-status"]')).trim() !== 'Optimal') {
        throw new Error('Expected default Hatch Scale status Optimal');
      }

      // 2. Preset 1: Unscaled HPSCALE = 1 (s_model = 0.125, d_paper = 0.00125 -> 0.001, N_lines = 113137.08 > 100000 -> 'Exceeds HPMAXLINES')
      await p.click('[data-testid="preset-btn-1"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-status"]').textContent.trim() === 'Exceeds HPMAXLINES');
      assertClose(parseFloat(await p.innerText('[data-testid="result-model-spacing"]')), 0.125, 0.001, 'Preset 1 Model Pitch');
      assertClose(parseFloat(await p.innerText('[data-testid="result-paper-spacing"]')), 0.001, 0.001, 'Preset 1 Paper Spacing');
      assertClose(parseFloat(await p.innerText('[data-testid="result-line-count"]')), 113137.08, 0.001, 'Preset 1 Line Count');

      // 3. Preset 2: Imperial Inches 1:48 (u=25.4 mm/in, S=48, p0=0.125, d_target=3.175, HPSCALE=48, W=240, H=240)
      // Hand calc:
      //   s_model = 0.125 * 48 = 6.000 [in]
      //   d_paper = (6.000 * 25.4) / 48 = 152.4 / 48 = 3.175 [mm]
      //   HPSCALE_rec = (3.175 * 48) / (0.125 * 25.4) = 48.00
      //   N_lines = ((240 + 240) / sqrt(2)) / 6.0 = 56.5685 -> 56.57 ('Optimal')
      await p.click('[data-testid="preset-btn-2"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-rec-hpscale"]').textContent.trim() === '48.00');
      assertClose(parseFloat(await p.innerText('[data-testid="result-paper-spacing"]')), 3.175, 0.001, 'Preset 2 Paper Spacing');
      assertClose(parseFloat(await p.innerText('[data-testid="result-model-spacing"]')), 6.000, 0.001, 'Preset 2 Model Pitch');
      assertClose(parseFloat(await p.innerText('[data-testid="result-line-count"]')), 56.57, 0.001, 'Preset 2 Line Count');

      // 4. Unit Switch Branch: Meters (u=1000 mm/m, S=100, p0=0.125, d_target=2.5, HPSCALE=2, W=10 m, H=10 m)
      // Hand calc:
      //   HPSCALE_rec = (2.5 * 100) / (0.125 * 1000) = 250 / 125 = 2.00
      //   s_model = 0.125 * 2 = 0.250 [m], d_paper = (0.250 * 1000) / 100 = 2.500 [mm], N_lines = (20 / sqrt(2)) / 0.250 = 56.57
      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-rec-hpscale"]').textContent.trim() === '2000.00');
      await p.selectOption('[data-testid="select-unit"]', 'm');
      await p.locator('[data-testid="input-hpscale"]').fill('2');
      await p.locator('[data-testid="input-width"]').fill('10');
      await p.locator('[data-testid="input-height"]').fill('10');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-rec-hpscale"]').textContent.trim() === '2.00');
      assertClose(parseFloat(await p.innerText('[data-testid="result-model-spacing"]')), 0.250, 0.001, 'Meters Model Pitch');
      assertClose(parseFloat(await p.innerText('[data-testid="result-paper-spacing"]')), 2.500, 0.001, 'Meters Paper Spacing');
      assertClose(parseFloat(await p.innerText('[data-testid="result-line-count"]')), 56.57, 0.001, 'Meters Line Count');

      // 5. Input Defenses on >= 2 inputs ('', 'abc', '12abc', HPMAXLINES = '50' < 100 official lower limit)
      const scaleInput = p.locator('[data-testid="input-plot-scale"]');
      const maxLinesInput = p.locator('[data-testid="input-hpmaxlines"]');

      await scaleInput.fill('');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-rec-hpscale"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Hatch Scale empty plotScale');

      await scaleInput.fill('abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-rec-hpscale"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Hatch Scale abc plotScale');

      await scaleInput.fill('100');
      await maxLinesInput.fill('12abc');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-rec-hpscale"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Hatch Scale 12abc hpmaxlines');

      await maxLinesInput.fill('50');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-rec-hpscale"]').textContent.trim() === '—');
      await verifyNoNaNOrInfinity(p, 'Hatch Scale hpmaxlines < 100');

      await p.click('[data-testid="reset-btn"]');
      await p.waitForFunction(() => document.querySelector('[data-testid="result-rec-hpscale"]').textContent.trim() === '2000.00');

      // 6. CSV Export Verification
      const [download] = await Promise.all([
        p.waitForEvent('download'),
        p.click('[data-testid="export-csv-btn"]'),
      ]);
      const csvText = fs.readFileSync(await download.path(), 'utf8');
      if (!csvText.includes('Drawing_Unit,Plot_Scale_1_to_S,Base_Pitch_units') || !csvText.includes('HPMAXLINES')) {
        throw new Error('Hatch Scale CSV missing expected headers');
      }
      if (!csvText.includes('mm,100,0.125,2.5,2000,10000,10000,100000,2000.00,250.000,2.500,56.57,Optimal')) {
        throw new Error('Hatch Scale CSV missing expected numerical row');
      }

      // 7. Negative Assertions
      const coreText =
        (await p.innerText('[data-testid="calculator-inputs"]')) +
        ' ' +
        (await p.innerText('[data-testid="calculator-results"]'));
      for (const banned of ['MAXHATCH', 'AR-CONC', 'GRAVEL', 'ISO 10303-21', 'ISO 19650']) {
        if (coreText.includes(banned)) {
          throw new Error(`Hatch Scale core contains unverified/removed item '${banned}'`);
        }
      }
    });
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log('Batch 9 Verification Summary');
  console.log('================================================================');
  const failed = results.filter((r) => r.status === 'FAIL');
  for (const r of results) {
    console.log(`  [${r.status}] ${r.name}${r.error ? ' -> ' + r.error : ''}`);
  }
  if (failed.length > 0) {
    console.error(`\nTotal Failed: ${failed.length} / ${results.length}`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} tools in Batch 9 PASSED.`);
}

runBatch9Tests().catch((err) => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
