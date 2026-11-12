/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * CADGuide.tools Toolbox - Master E2E Verification Suite for Batch 12 (Tools 56 to 60)
 *
 * Validates:
 * 56. chiller-load-calculator (Hydronic sensible cooling Q = m_dot*cp*dT, NIST SP 811 1 RT = 3.516853 kW, L/s & m3/h unit conversions, editable cp & density, presets, input defenses, CSV export, negative assertions)
 * 57. chlorine-dose-calculator (Mass-balance chlorine feed mg/L * m3/d / 1000 = kg/d, editable NaOCl available % & specific gravity SG, US EPA SWTR CT = C*T, presets, input defenses, CSV export, negative assertions)
 * 58. cloud-bim-rvt-to-ifc-converter (Honest disclosure that binary RVT cannot convert in browser, local IFC4/IFC2x3 entity audit & proxy share QA gate, binary RVT warning branch, CSV export, pure-ASCII check, negative assertions)
 * 59. cloud-cad-telemetry-blocker-wizard (Honest licensing/admin warning, verified AutoCAD REPORTERROR & desktopanalytics + PowerShell New-NetFirewallRule/Remove-NetFirewallRule for ADPClientService.exe, pure-ASCII .scr & .ps1 downloads, negative assertions)
 * 60. cloud-dwg-drawing-recovery-service (Honest offline DWG disclosure, local 6-byte AC10xx header signature inspector, official RECOVER/RECOVERALL/AUDIT/DRAWINGRECOVERY triage scenarios, pure-ASCII .scr download, negative assertions)
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
    const inputsEl = document.querySelector('[data-testid="calculator-inputs"]');
    const resultsEl = document.querySelector('[data-testid="calculator-results"]');
    const guideEl = document.querySelector('#engineering-guide');
    const chunks = [];
    for (const root of [inputsEl, resultsEl, guideEl]) {
      if (!root) continue;
      const clone = root.cloneNode(true);
      clone
        .querySelectorAll('a[href^="/toolbox/"], a[href^="/compare/"], a[href^="/convert/"]')
        .forEach((el) => el.remove());
      chunks.push(clone.textContent || '');
    }
    return chunks.join('\n');
  });
  for (const term of forbiddenTerms) {
    if (scopedText.includes(term)) {
      throw new Error(`[${context}] Found forbidden term "${term}" inside tool container!`);
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

async function readNumberTestId(page, testId) {
  const raw = (await page.locator(`[data-testid="${testId}"]`).innerText()).trim();
  return Number(raw);
}

async function readTextTestId(page, testId) {
  return (await page.locator(`[data-testid="${testId}"]`).innerText()).trim();
}

async function downloadAndReadText(page, buttonSelector) {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator(buttonSelector).click(),
  ]);
  const filePath = await download.path();
  const content = fs.readFileSync(filePath, 'utf-8');
  return { suggestedFilename: download.suggestedFilename(), content };
}

async function runBatch12Tests() {
  console.log('================================================================');
  console.log('CADGuide Toolbox - Master E2E Verification of Batch 12 (Tools 56 to 60)');
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
    // Tool 56: chiller-load-calculator
    // -------------------------------------------------------------------------
    await runSubTest('56. chiller-load-calculator', async (p) => {
      await openToolPage(
        p,
        `${BASE_URL}/toolbox/chiller-load-calculator`,
        '[data-testid="input-flow"]'
      );

      // Default hand-calculation (50 L/s, T_in = 12 C, T_out = 7 C, cp = 4.184 kJ/(kg*K), rho = 1.000 kg/L):
      // m_dot = 50 [L/s] * 1.000 [kg/L] = 50.000 kg/s
      // dT = 12 - 7 = 5.00 K
      // Q = 50.000 * 4.184 * 5.00 = 1046.00 kW
      // RT = 1046.00 / 3.516853 = 297.42499... -> 297.42 RT
      // Flow per RT = 50 / 297.42499... = 0.168109... -> 0.1681 L/(s*RT)
      assertClose(await readNumberTestId(p, 'result-cooling-kw'), 1046.0, 0.001, 'Chiller default Q kW');
      assertClose(await readNumberTestId(p, 'result-tonnage-rt'), 297.42, 0.001, 'Chiller default RT');
      assertClose(await readNumberTestId(p, 'result-mass-flow'), 50.0, 0.001, 'Chiller default m_dot');
      assertClose(await readNumberTestId(p, 'result-delta-t'), 5.0, 0.001, 'Chiller default dT');
      assertClose(await readNumberTestId(p, 'result-flow-per-ton'), 0.1681, 0.001, 'Chiller default flow/RT');

      // Unit switch: 180 m3/h = 50.000 L/s -> identical thermal outputs
      await p.selectOption('[data-testid="input-flow-unit"]', 'm3/h');
      await p.fill('[data-testid="input-flow"]', '180');
      assertClose(await readNumberTestId(p, 'result-cooling-kw'), 1046.0, 0.001, 'Chiller 180 m3/h Q kW');
      assertClose(await readNumberTestId(p, 'result-tonnage-rt'), 297.42, 0.001, 'Chiller 180 m3/h RT');

      // Preset 2: 30% Glycol (36 m3/h = 10.000 L/s, 10 C -> 4 C => dT = 6.00 K, cp = 3.900, rho = 1.030)
      // m_dot = 10 * 1.030 = 10.300 kg/s
      // Q = 10.300 * 3.900 * 6 = 241.02 kW
      // RT = 241.02 / 3.516853 = 68.53286... -> 68.53 RT
      // Flow per RT = 10 / 68.53286... = 0.145915... -> 0.1459 L/(s*RT)
      await p.click('[data-testid="preset-glycol-30pct"]');
      assertClose(await readNumberTestId(p, 'result-mass-flow'), 10.3, 0.001, 'Chiller glycol m_dot');
      assertClose(await readNumberTestId(p, 'result-cooling-kw'), 241.02, 0.001, 'Chiller glycol Q kW');
      assertClose(await readNumberTestId(p, 'result-tonnage-rt'), 68.53, 0.001, 'Chiller glycol RT');
      assertClose(await readNumberTestId(p, 'result-flow-per-ton'), 0.1459, 0.001, 'Chiller glycol flow/RT');

      // Preset 3: District cooling (100 L/s, 14 C -> 5.5 C => dT = 8.50 K, cp = 4.184, rho = 1.000)
      // m_dot = 100.000 kg/s, Q = 100 * 4.184 * 8.5 = 3556.40 kW
      // RT = 3556.40 / 3.516853 = 1011.24499... -> 1011.24 RT
      // Flow per RT = 100 / 1011.24499... = 0.098888... -> 0.0989 L/(s*RT)
      await p.click('[data-testid="preset-district-cooling"]');
      assertClose(await readNumberTestId(p, 'result-cooling-kw'), 3556.4, 0.001, 'Chiller district Q kW');
      assertClose(await readNumberTestId(p, 'result-tonnage-rt'), 1011.24, 0.001, 'Chiller district RT');
      assertClose(await readNumberTestId(p, 'result-flow-per-ton'), 0.0989, 0.001, 'Chiller district flow/RT');

      // Input defenses on >= 2 fields (flow and cp, plus T_in <= T_out boundary)
      for (const bad of ['', 'abc', '12abc', '-5']) {
        await p.fill('[data-testid="input-flow"]', bad);
        assertEqual(await readTextTestId(p, 'result-cooling-kw'), '—', `Chiller bad flow "${bad}"`);
        assertEqual(await readTextTestId(p, 'result-tonnage-rt'), '—', `Chiller bad flow RT "${bad}"`);
        await verifyNoNaNOrInfinity(p, `Chiller bad flow "${bad}"`);
      }
      await p.click('[data-testid="reset-button"]');
      for (const bad of ['', 'abc', '12abc', '0']) {
        await p.fill('[data-testid="input-cp"]', bad);
        assertEqual(await readTextTestId(p, 'result-cooling-kw'), '—', `Chiller bad cp "${bad}"`);
        await verifyNoNaNOrInfinity(p, `Chiller bad cp "${bad}"`);
      }

      // Boundary: T_in <= T_out must fail validation
      await p.click('[data-testid="reset-button"]');
      await p.fill('[data-testid="input-temp-in"]', '7');
      await p.fill('[data-testid="input-temp-out"]', '7');
      assertEqual(await readTextTestId(p, 'result-cooling-kw'), '—', 'Chiller zero deltaT defense');

      // Reset & CSV export check
      await p.click('[data-testid="reset-button"]');
      assertClose(await readNumberTestId(p, 'result-cooling-kw'), 1046.0, 0.001, 'Chiller after reset');
      const csv = await downloadAndReadText(p, '[data-testid="export-csv-button"]');
      assertEqual(csv.suggestedFilename, 'chiller-cooling-load-report.csv', 'Chiller CSV filename');
      if (!csv.content.includes('1046.00') || !csv.content.includes('297.42') || !csv.content.includes('3.516853')) {
        throw new Error('Chiller CSV missing expected default values or NIST SP 811 factor');
      }

      // Negative assertions for removed unrelated duct/envelope standards
      await verifyNegativeTermsOnToolPage(
        p,
        ['SMACNA', 'ISO 6946', 'ASHRAE Standard 62.1', 'ductwork aspect ratios'],
        'Chiller negative assertions'
      );
    });

    // -------------------------------------------------------------------------
    // Tool 57: chlorine-dose-calculator
    // -------------------------------------------------------------------------
    await runSubTest('57. chlorine-dose-calculator', async (p) => {
      await openToolPage(
        p,
        `${BASE_URL}/toolbox/chlorine-dose-calculator`,
        '[data-testid="input-flow"]'
      );

      // Default hand-calculation (Q = 2400 m3/d = 100 m3/h, demand = 1.8 mg/L, residual = 0.6 mg/L,
      // w_avail = 12.5%, SG = 1.18, T = 30 min):
      // C_dose = 1.8 + 0.6 = 2.40 mg/L
      // M_Cl2_day = 2400 * 2.40 / 1000 = 5.760 kg/d
      // M_Cl2_hr = 5.760 / 24 = 0.240 kg/h
      // V_sol_day = 5.760 / (1.18 * 0.125) = 5.760 / 0.1475 = 39.0508... -> 39.05 L/d
      // V_sol_hr = 39.0508... / 24 = 1.6271... -> 1.63 L/h
      // CT = 0.6 * 30 = 18.00 mg*min/L
      assertClose(await readNumberTestId(p, 'result-cl2-day'), 5.76, 0.001, 'Chlorine default kg/d');
      assertClose(await readNumberTestId(p, 'result-cl2-hr'), 0.24, 0.001, 'Chlorine default kg/h');
      assertClose(await readNumberTestId(p, 'result-total-dose'), 2.4, 0.001, 'Chlorine default C_dose');
      assertClose(await readNumberTestId(p, 'result-solution-day'), 39.05, 0.001, 'Chlorine default L/d');
      assertClose(await readNumberTestId(p, 'result-solution-hr'), 1.63, 0.001, 'Chlorine default L/h');
      assertClose(await readNumberTestId(p, 'result-ct-value'), 18.0, 0.001, 'Chlorine default CT');

      // Preset 2: Package plant (120 m3/h = 2880 m3/d, demand = 1.8, residual = 0.6, 10% NaOCl, SG = 1.15, T = 20 min)
      // M_Cl2_day = 2880 * 2.4 / 1000 = 6.912 kg/d; M_Cl2_hr = 0.288 kg/h
      // V_sol_day = 6.912 / (1.15 * 0.10) = 60.1043... -> 60.10 L/d; V_sol_hr = 2.5043... -> 2.50 L/h
      // CT = 0.6 * 20 = 12.00 mg*min/L
      await p.click('[data-testid="preset-skid-120m3h"]');
      assertClose(await readNumberTestId(p, 'result-cl2-day'), 6.912, 0.001, 'Chlorine 120m3h kg/d');
      assertClose(await readNumberTestId(p, 'result-cl2-hr'), 0.288, 0.001, 'Chlorine 120m3h kg/h');
      assertClose(await readNumberTestId(p, 'result-solution-day'), 60.1, 0.001, 'Chlorine 120m3h L/d');
      assertClose(await readNumberTestId(p, 'result-solution-hr'), 2.5, 0.001, 'Chlorine 120m3h L/h');
      assertClose(await readNumberTestId(p, 'result-ct-value'), 12.0, 0.001, 'Chlorine 120m3h CT');

      // Editable custom NaOCl strength test (e.g. degraded bleach 8.0%, SG = 1.12 on 2880 m3/d, dose 2.4 mg/L):
      // V_sol_day = 6.912 / (1.12 * 0.08) = 6.912 / 0.0896 = 77.142857 -> 77.14 L/d; V_sol_hr = 3.21428 -> 3.21 L/h
      await p.fill('[data-testid="input-strength"]', '8.0');
      await p.fill('[data-testid="input-sg"]', '1.12');
      assertClose(await readNumberTestId(p, 'result-solution-day'), 77.14, 0.001, 'Chlorine custom 8% L/d');
      assertClose(await readNumberTestId(p, 'result-solution-hr'), 3.21, 0.001, 'Chlorine custom 8% L/h');

      // Preset 3 & 4 checks
      await p.click('[data-testid="preset-small-well-500m3d"]');
      assertClose(await readNumberTestId(p, 'result-cl2-day'), 0.75, 0.001, 'Chlorine 500m3d kg/d');
      assertClose(await readNumberTestId(p, 'result-solution-day'), 13.23, 0.001, 'Chlorine 500m3d L/d');
      assertClose(await readNumberTestId(p, 'result-ct-value'), 22.5, 0.001, 'Chlorine 500m3d CT');

      await p.click('[data-testid="preset-gas-10000m3d"]');
      assertClose(await readNumberTestId(p, 'result-cl2-day'), 28.0, 0.001, 'Chlorine gas kg/d');
      assertClose(await readNumberTestId(p, 'result-ct-value'), 48.0, 0.001, 'Chlorine gas CT');

      // Input defenses on >= 2 fields (flow and editable strength %)
      for (const bad of ['', 'abc', '12abc', '0']) {
        await p.fill('[data-testid="input-flow"]', bad);
        assertEqual(await readTextTestId(p, 'result-cl2-day'), '—', `Chlorine bad flow "${bad}"`);
        await verifyNoNaNOrInfinity(p, `Chlorine bad flow "${bad}"`);
      }
      await p.click('[data-testid="reset-button"]');
      for (const bad of ['', 'abc', '12abc', '105']) {
        await p.fill('[data-testid="input-strength"]', bad);
        assertEqual(await readTextTestId(p, 'result-solution-hr'), '—', `Chlorine bad strength "${bad}"`);
        await verifyNoNaNOrInfinity(p, `Chlorine bad strength "${bad}"`);
      }

      // Reset & CSV export
      await p.click('[data-testid="reset-button"]');
      assertClose(await readNumberTestId(p, 'result-cl2-day'), 5.76, 0.001, 'Chlorine reset kg/d');
      const csv = await downloadAndReadText(p, '[data-testid="export-csv-button"]');
      assertEqual(csv.suggestedFilename, 'chlorine-dose-ct-report.csv', 'Chlorine CSV filename');
      if (!csv.content.includes('5.760') || !csv.content.includes('39.05') || !csv.content.includes('18.00')) {
        throw new Error('Chlorine CSV missing expected default outputs');
      }

      // Negative assertions for unverified/unrelated standards
      await verifyNegativeTermsOnToolPage(
        p,
        ['AWWA Standard B300', 'AWWA B300', 'WEF Manual', 'Metcalf & Eddy', 'International Plumbing Code'],
        'Chlorine negative assertions'
      );
    });

    // -------------------------------------------------------------------------
    // Tool 58: cloud-bim-rvt-to-ifc-converter
    // -------------------------------------------------------------------------
    await runSubTest('58. cloud-bim-rvt-to-ifc-converter', async (p) => {
      await openToolPage(
        p,
        `${BASE_URL}/toolbox/cloud-bim-rvt-to-ifc-converter`,
        '[data-testid="input-max-proxy"]'
      );

      // Honest disclosure check
      const banner = await readTextTestId(p, 'honest-disclosure-banner');
      if (!banner.includes('does not convert binary RVT files in the browser')) {
        throw new Error('Missing explicit non-browser RVT conversion disclosure');
      }

      // Default Sample 1 (IFC4 Arch): 4 walls, 2 slabs, 2 columns, 1 space, 1 proxy => total = 10, proxy = 10.00%, PASS
      assertEqual(await readTextTestId(p, 'result-schema'), 'IFC4', 'IFC default schema');
      assertEqual(await readTextTestId(p, 'result-total-elements'), '10', 'IFC default total elements');
      assertClose(await readNumberTestId(p, 'result-proxy-pct'), 10.0, 0.001, 'IFC default proxy %');
      assertEqual(await readTextTestId(p, 'result-walls'), '4', 'IFC default walls');
      assertEqual(await readTextTestId(p, 'result-slabs-columns'), '2 / 2', 'IFC default slabs/cols');
      assertEqual(await readTextTestId(p, 'result-spaces-proxies'), '1 / 1', 'IFC default spaces/proxies');
      if (!(await readTextTestId(p, 'result-qa-status')).includes('PASS')) {
        throw new Error('Expected QA status PASS on default IFC4 sample');
      }

      // Sample 2 (IFC2X3 Struct): 2 walls, 1 slab, 3 columns, 0 spaces, 2 proxies => total = 8, proxy = 25.00% -> REVIEW MAPPING
      await p.click('[data-testid="preset-ifc2x3-struct"]');
      assertEqual(await readTextTestId(p, 'result-schema'), 'IFC2X3', 'IFC sample 2 schema');
      assertEqual(await readTextTestId(p, 'result-total-elements'), '8', 'IFC sample 2 total elements');
      assertClose(await readNumberTestId(p, 'result-proxy-pct'), 25.0, 0.001, 'IFC sample 2 proxy %');
      if (!(await readTextTestId(p, 'result-qa-status')).includes('REVIEW MAPPING')) {
        throw new Error('Expected REVIEW MAPPING on Sample 2');
      }

      // Sample 3 (Binary RVT demo): displays binary RVT notice and '—' outputs
      await p.click('[data-testid="preset-rvt-binary-demo"]');
      const rvtNotice = await readTextTestId(p, 'rvt-binary-notice');
      if (!rvtNotice.includes('Cannot Convert in Browser')) {
        throw new Error('Expected binary RVT notice when RVT preset active');
      }
      assertEqual(await readTextTestId(p, 'result-schema'), '—', 'RVT binary schema dash');

      // Input defenses on 2 inputs
      await p.click('[data-testid="reset-button"]');
      for (const bad of ['', 'abc', '12abc', '150']) {
        await p.fill('[data-testid="input-max-proxy"]', bad);
        assertEqual(await readTextTestId(p, 'result-schema'), '—', `IFC bad maxProxy "${bad}"`);
        await verifyNoNaNOrInfinity(p, `IFC bad maxProxy "${bad}"`);
      }
      await p.click('[data-testid="reset-button"]');
      for (const bad of ['', 'abc', '12abc', '1.5']) {
        await p.fill('[data-testid="input-min-spaces"]', bad);
        assertEqual(await readTextTestId(p, 'result-schema'), '—', `IFC bad minSpaces "${bad}"`);
        await verifyNoNaNOrInfinity(p, `IFC bad minSpaces "${bad}"`);
      }

      // Reset & CSV export
      await p.click('[data-testid="reset-button"]');
      const csv = await downloadAndReadText(p, '[data-testid="export-csv-button"]');
      assertEqual(csv.suggestedFilename, 'ifc-schema-entity-audit.csv', 'IFC CSV filename');
      assertPureAscii(csv.content, 'IFC Audit CSV ASCII');
      if (!csv.content.includes('IFC4') || !csv.content.includes('10.00')) {
        throw new Error('IFC Audit CSV missing expected IFC4 or 10.00% values');
      }

      // Negative assertions (no self-assigned ratings, no utm_source, no unrelated STEP/AM standards)
      await verifyNegativeTermsOnToolPage(
        p,
        ['9.9', 'utm_source', 'ISO/ASTM 52900', 'AIA CAD Layer Guidelines', 'cad-preflight'],
        'IFC negative assertions'
      );
    });

    // -------------------------------------------------------------------------
    // Tool 59: cloud-cad-telemetry-blocker-wizard
    // -------------------------------------------------------------------------
    await runSubTest('59. cloud-cad-telemetry-blocker-wizard', async (p) => {
      await openToolPage(
        p,
        `${BASE_URL}/toolbox/cloud-cad-telemetry-blocker-wizard`,
        '[data-testid="input-workstations"]'
      );

      // Risk warning check
      const warning = await readTextTestId(p, 'licensing-risk-warning');
      if (!warning.includes('Named-User subscription sign-in') || !warning.includes('My Insights')) {
        throw new Error('Telemetry wizard missing Named-User licensing & My Insights risk warning');
      }

      // Default Preset 1 (In-app only: REPORTERROR = 0, desktopanalytics = true, ADP firewall = false, 25 seats, 2025)
      assertEqual(await readTextTestId(p, 'result-active-controls'), '2', 'Telemetry default controls');
      assertEqual(await readTextTestId(p, 'result-fleet-summary'), '25 seats (2025)', 'Telemetry default fleet');

      // Preset 2 (Enable ADPClientService.exe outbound firewall rule)
      await p.click('[data-testid="preset-restricted-firewall"]');
      assertEqual(await readTextTestId(p, 'result-active-controls'), '3', 'Telemetry firewall preset controls');
      const ps1Preview = await readTextTestId(p, 'preview-ps1');
      if (
        !ps1Preview.includes('New-NetFirewallRule') ||
        !ps1Preview.includes('-Direction Outbound') ||
        !ps1Preview.includes('ADPClientService.exe') ||
        !ps1Preview.includes('Remove-NetFirewallRule')
      ) {
        throw new Error('PowerShell preview missing verified New-NetFirewallRule / ADPClientService.exe / rollback');
      }

      // Download both .scr and .ps1 and verify pure ASCII & verified tokens
      const scrDl = await downloadAndReadText(p, '[data-testid="download-scr-button"]');
      assertEqual(scrDl.suggestedFilename, 'autocad-privacy-config.scr', 'Telemetry SCR filename');
      assertPureAscii(scrDl.content, 'Telemetry SCR pure ASCII');
      if (!scrDl.content.includes('REPORTERROR 0') || !scrDl.content.includes('desktopanalytics')) {
        throw new Error('Downloaded .scr missing REPORTERROR 0 or desktopanalytics');
      }

      const ps1Dl = await downloadAndReadText(p, '[data-testid="download-ps1-button"]');
      assertEqual(ps1Dl.suggestedFilename, 'autocad-adp-firewall.ps1', 'Telemetry PS1 filename');
      assertPureAscii(ps1Dl.content, 'Telemetry PS1 pure ASCII');
      if (!ps1Dl.content.includes('New-NetFirewallRule') || !ps1Dl.content.includes('ADPClientService.exe')) {
        throw new Error('Downloaded .ps1 missing New-NetFirewallRule or ADPClientService.exe');
      }

      // Input defenses on 2 inputs
      for (const bad of ['', 'abc', '12abc', '0']) {
        await p.fill('[data-testid="input-workstations"]', bad);
        assertEqual(await readTextTestId(p, 'result-active-controls'), '—', `Telemetry bad seats "${bad}"`);
        await verifyNoNaNOrInfinity(p, `Telemetry bad seats "${bad}"`);
      }
      await p.click('[data-testid="reset-button"]');
      for (const bad of ['', 'abc', '12abc', '1995']) {
        await p.fill('[data-testid="input-release-year"]', bad);
        assertEqual(await readTextTestId(p, 'result-active-controls'), '—', `Telemetry bad year "${bad}"`);
        await verifyNoNaNOrInfinity(p, `Telemetry bad year "${bad}"`);
      }

      // Reset check
      await p.click('[data-testid="reset-button"]');
      assertEqual(await readTextTestId(p, 'result-active-controls'), '2', 'Telemetry after reset');

      // Negative assertions for unverified executables/domains and unrelated standards
      await verifyNegativeTermsOnToolPage(
        p,
        [
          'AdpSDKWrapper.exe',
          'ase.autodesk.com',
          'analytics.autodesk.com',
          'swceip.exe',
          'BsSndRpt64.exe',
          'ISO 10303-21',
          'ISO/ASTM 52900',
          '9.9',
        ],
        'Telemetry negative assertions'
      );
    });

    // -------------------------------------------------------------------------
    // Tool 60: cloud-dwg-drawing-recovery-service
    // -------------------------------------------------------------------------
    await runSubTest('60. cloud-dwg-drawing-recovery-service', async (p) => {
      await openToolPage(
        p,
        `${BASE_URL}/toolbox/cloud-dwg-drawing-recovery-service`,
        '[data-testid="input-savetime"]'
      );

      // Honest disclosure check
      const disclosure = await readTextTestId(p, 'honest-recovery-disclosure');
      if (!disclosure.includes('does not reconstruct or repair corrupted binary DWG geometry in the browser')) {
        throw new Error('DWG recovery missing honest non-browser repair disclosure');
      }

      // Default Scenario 1: AC1032, RECOVER / RECOVERALL, SAVETIME=10, AUDITCTL=1
      assertEqual(await readTextTestId(p, 'result-header-sig'), 'AC1032', 'DWG default header sig');
      if (!(await readTextTestId(p, 'result-header-desc')).includes('AutoCAD 2018')) {
        throw new Error('Expected AutoCAD 2018 format description for AC1032');
      }
      assertEqual(
        await readTextTestId(p, 'result-primary-command'),
        'RECOVER / RECOVERALL',
        'DWG default command'
      );

      // Scenario 2: Opens with errors (AC1027 -> AUDIT + PURGE / -PURGE + -WBLOCK)
      await p.click('[data-testid="preset-opens-corrupt-ac1027"]');
      assertEqual(await readTextTestId(p, 'result-header-sig'), 'AC1027', 'DWG preset 2 header');
      assertEqual(
        await readTextTestId(p, 'result-primary-command'),
        'AUDIT + PURGE / -PURGE + -WBLOCK',
        'DWG preset 2 command'
      );

      // Scenario 3: Crash / Null header (0x000000 -> DRAWINGRECOVERY (.bak / .sv$))
      await p.click('[data-testid="preset-crash-null-header"]');
      assertEqual(await readTextTestId(p, 'result-header-sig'), '0x000000', 'DWG preset 3 header');
      assertEqual(
        await readTextTestId(p, 'result-primary-command'),
        'DRAWINGRECOVERY (.bak / .sv$)',
        'DWG preset 3 command'
      );

      // Input defenses on 2 inputs (SAVETIME and AUDITCTL)
      for (const bad of ['', 'abc', '12abc', '601', '-1']) {
        await p.fill('[data-testid="input-savetime"]', bad);
        assertEqual(await readTextTestId(p, 'result-primary-command'), '—', `DWG bad savetime "${bad}"`);
        await verifyNoNaNOrInfinity(p, `DWG bad savetime "${bad}"`);
      }
      await p.click('[data-testid="reset-button"]');
      for (const bad of ['', 'abc', '12abc', '2']) {
        await p.fill('[data-testid="input-auditctl"]', bad);
        assertEqual(await readTextTestId(p, 'result-primary-command'), '—', `DWG bad auditctl "${bad}"`);
        await verifyNoNaNOrInfinity(p, `DWG bad auditctl "${bad}"`);
      }

      // Reset & Pure-ASCII .scr download
      await p.click('[data-testid="reset-button"]');
      assertEqual(await readTextTestId(p, 'result-header-sig'), 'AC1032', 'DWG reset header');
      const scr = await downloadAndReadText(p, '[data-testid="download-scr-button"]');
      assertEqual(scr.suggestedFilename, 'autocad-audit-backup-setup.scr', 'DWG SCR filename');
      assertPureAscii(scr.content, 'DWG SCR pure ASCII');
      if (
        !scr.content.includes('ISAVEBAK 1') ||
        !scr.content.includes('SAVETIME 10') ||
        !scr.content.includes('AUDITCTL 1') ||
        !scr.content.includes('AUDIT Y')
      ) {
        throw new Error('DWG recovery .scr missing expected AutoCAD commands');
      }

      // Negative assertions
      await verifyNegativeTermsOnToolPage(
        p,
        ['9.9', 'AnyDWG', 'CADSoftTools', 'ISO 10303-21', 'ISO/ASTM 52900', 'AIA CAD Layer Guidelines'],
        'DWG recovery negative assertions'
      );
    });
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  const failed = results.filter((r) => r.status === 'FAIL');
  console.log(`Summary: ${results.length - failed.length}/${results.length} Passed`);
  if (failed.length > 0) {
    console.error('Failed tests:', failed);
    process.exit(1);
  }
  console.log('ALL BATCH 12 E2E TESTS PASSED!');
}

runBatch12Tests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
