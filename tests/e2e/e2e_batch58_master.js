/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 58 Master E2E Suite (skips revit-shortcuts-sheet, rhino-shortcuts-sheet):
 * 1. revit-worksharing-wizard
 * 2. reynolds-number-calculator
 * 3. rigid-pavement-calculator
 * 4. rolling-force-calculator
 * 5. roof-drain-size-calculator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B58_TERMS = [
  'ISO 10303-21',
  'ISO 16739-1',
  'ISO/ASTM 52900',
  'AIA CAD',
  'ISO 19650',
  'Crane Technical Paper No. 410',
  'ASME B31.3',
  'ANSI/HI 9.6.1',
  'ISO 4413',
  'PCA Method',
  'PCA design',
  'AASHTO 1993',
  'AASHTO Green Book',
  'Eurocode 7',
  'FHWA Geotechnical',
  'ASTM D1557',
  'ASME Y14.5',
  'DIN 6935',
  'ISO 286',
  'ISO 2768',
  'IPC Chapter 11',
  'ASPE ROOF',
  '(IBC)',
  'ACI 318',
  'Eurocode 2',
  'ASCE 7',
  'ADA 2010',
];

function parseNumeric(text) {
  const cleaned = String(text || '').replace(/,/g, '').trim();
  const m = cleaned.match(/[+-]?\d+(?:\.\d+)?/);
  assert(m, `Expected numeric value in "${text}"`);
  return parseFloat(m[0]);
}

function approx(actualText, expected, label) {
  const actual = parseNumeric(actualText);
  const diff = Math.abs(actual - expected);
  const bound = Math.max(Math.abs(expected) * TOL, 1e-4);
  assert(diff <= bound, `${label}: expected ${expected} (+/-${bound}), got ${actual}`);
}

async function assertNoNan(main, label) {
  const body = await main.innerText();
  assert(!/\bNaN\b|\bInfinity\b/i.test(body), `${label}: contains NaN/Infinity`);
}

function assertAscii(text, label) {
  for (let i = 0; i < text.length; i++) {
    assert(text.charCodeAt(i) <= 127, `${label}: non-ASCII char code ${text.charCodeAt(i)} at index ${i}`);
  }
}

async function readDownloadText(download) {
  const p = await download.path();
  return fs.readFileSync(p, 'utf8');
}

async function openToolPage(page, url, waitSelector) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector(waitSelector, { timeout: 15000 });
  await page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      return Object.keys(el).some((k) => k.startsWith('__reactProps$') || k.startsWith('__reactFiber$'));
    },
    waitSelector,
    { timeout: 15000 }
  );
}

async function verifyNoBannedAndNoNumberInput(page, terms, label) {
  const typeCount = await page.locator('input[type="number"]').count();
  assert.strictEqual(typeCount, 0, `${label}: found input[type="number"]`);
  const scopedText = await page.evaluate(() => {
    const mains = document.querySelectorAll('main');
    const mainEl = mains[mains.length - 1];
    if (!mainEl) return '';
    const clone = mainEl.cloneNode(true);
    clone
      .querySelectorAll('a[href^="/toolbox/"], a[href^="/compare/"], a[href^="/convert/"]')
      .forEach((el) => el.remove());
    return clone.textContent || '';
  });
  for (const term of terms) {
    assert(!scopedText.includes(term), `${label}: banned term found -> "${term}"`);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));

  try {
    // 1. revit-worksharing-wizard (preserves DecisionWizardClient + revitWorksharingWizard.ts)
    await openToolPage(page, `${BASE_URL}/toolbox/revit-worksharing-wizard`, '[data-testid^="scenario-btn-"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B58_TERMS, 'revit-worksharing-wizard');
    const btns = page.locator('[data-testid^="scenario-btn-"]');
    const btnCount = await btns.count();
    assert.strictEqual(btnCount, 5, `worksharing scenario count ${btnCount} !== 5`);
    // Initial state has scenario 0 selected
    assert((await page.locator('[data-testid="wizard-cause-card"]').count()) >= 1, 'worksharing initial causes');
    assert((await page.locator('[data-testid="wizard-source-link"]').count()) >= 1, 'worksharing initial source links');
    for (let i = 1; i < btnCount; i++) {
      await btns.nth(i).click();
      assert((await page.locator('[data-testid="wizard-cause-card"]').count()) >= 1, `worksharing scenario ${i} causes`);
      const href = await page.locator('[data-testid="wizard-source-link"]').first().getAttribute('href');
      assert(href && (href.startsWith('https://www.autodesk.com/') || href.startsWith('https://help.autodesk.com/')), `bad href ${href}`);
    }
    console.log('[PASS] revit-worksharing-wizard');

    // 2. reynolds-number-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/reynolds-number-calculator`, '[data-testid="input-rho"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B58_TERMS, 'reynolds-number-calculator');
    approx(await page.locator('[data-testid="res-re"]').innerText(), 99800.0, 're default Re');
    approx(await page.locator('[data-testid="res-dh"]').innerText(), 50.0, 're default dh');
    approx(await page.locator('[data-testid="res-nu"]').innerText(), 1.002, 're default nu');
    approx(await page.locator('[data-testid="res-flow"]').innerText(), 3.927, 're default flow');
    assert((await page.locator('[data-testid="res-regime"]').innerText()).includes('Turbulent'), 're default regime');

    await page.locator('[data-testid="shape-rect"]').click();
    await page.locator('[data-testid="input-rho"]').fill('1.204');
    await page.locator('[data-testid="input-mu"]').fill('0.000018');
    await page.locator('[data-testid="input-vel"]').fill('3');
    await page.locator('[data-testid="input-rw"]').fill('200');
    await page.locator('[data-testid="input-rh"]').fill('100');
    approx(await page.locator('[data-testid="res-dh"]').innerText(), 133.33, 're mod dh');
    approx(await page.locator('[data-testid="res-re"]').innerText(), 26755.56, 're mod Re');
    approx(await page.locator('[data-testid="res-flow"]').innerText(), 60.0, 're mod flow');

    await page.locator('[data-testid="input-vel"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 're empty');
    await page.locator('[data-testid="input-vel"]').fill('3');
    const [dl2] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv2 = await readDownloadText(dl2);
    assertAscii(csv2, 're CSV');
    assert(csv2.includes('26755.56'), 're CSV check');
    console.log('[PASS] reynolds-number-calculator');

    // 3. rigid-pavement-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/rigid-pavement-calculator`, '[data-testid="input-load"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B58_TERMS, 'rigid-pavement-calculator');
    approx(await page.locator('[data-testid="res-edge"]').innerText(), 2.1531, 'pave default edge');
    approx(await page.locator('[data-testid="res-interior"]').innerText(), 1.1166, 'pave default interior');
    approx(await page.locator('[data-testid="res-ell"]').innerText(), 999.76, 'pave default ell');
    approx(await page.locator('[data-testid="res-a"]').innerText(), 150.79, 'pave default a');
    approx(await page.locator('[data-testid="res-sf"]').innerText(), 2.09, 'pave default sf');

    await page.locator('[data-testid="input-load"]').fill('65');
    await page.locator('[data-testid="input-pressure"]').fill('800');
    await page.locator('[data-testid="input-thick"]').fill('220');
    await page.locator('[data-testid="input-modulus"]').fill('32000');
    await page.locator('[data-testid="input-k"]').fill('30');
    await page.locator('[data-testid="input-mr"]').fill('4.8');
    approx(await page.locator('[data-testid="res-edge"]').innerText(), 3.4873, 'pave mod edge');
    approx(await page.locator('[data-testid="res-interior"]').innerText(), 1.8416, 'pave mod interior');
    approx(await page.locator('[data-testid="res-ell"]').innerText(), 991.97, 'pave mod ell');
    approx(await page.locator('[data-testid="res-sf"]').innerText(), 1.3764, 'pave mod sf');

    await page.locator('[data-testid="input-load"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'pave empty');
    await page.locator('[data-testid="input-load"]').fill('65');
    const [dl3] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv3 = await readDownloadText(dl3);
    assertAscii(csv3, 'pave CSV');
    assert(csv3.includes('3.4873'), 'pave CSV edge check');
    console.log('[PASS] rigid-pavement-calculator');

    // 4. rolling-force-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/rolling-force-calculator`, '[data-testid="input-sigma"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B58_TERMS, 'rolling-force-calculator');
    approx(await page.locator('[data-testid="res-force"]').innerText(), 3400.0, 'roll default force');
    approx(await page.locator('[data-testid="res-lp"]').innerText(), 20.0, 'roll default lp');
    approx(await page.locator('[data-testid="res-torque"]').innerText(), 68.0, 'roll default torque');
    approx(await page.locator('[data-testid="res-power"]').innerText(), 427.26, 'roll default power');

    await page.locator('[data-testid="input-sigma"]').fill('400');
    await page.locator('[data-testid="input-r"]').fill('250');
    await page.locator('[data-testid="input-h0"]').fill('12');
    await page.locator('[data-testid="input-h1"]').fill('8');
    await page.locator('[data-testid="input-width"]').fill('600');
    await page.locator('[data-testid="input-mu"]').fill('0.10');
    await page.locator('[data-testid="input-arm"]').fill('0.45');
    await page.locator('[data-testid="input-rpm"]').fill('90');
    approx(await page.locator('[data-testid="res-lp"]').innerText(), 31.623, 'roll mod lp');
    approx(await page.locator('[data-testid="res-force"]').innerText(), 8789.47, 'roll mod force');
    approx(await page.locator('[data-testid="res-torque"]').innerText(), 250.153, 'roll mod torque');
    approx(await page.locator('[data-testid="res-power"]').innerText(), 2357.63, 'roll mod power');

    await page.locator('[data-testid="input-sigma"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'roll empty');
    await page.locator('[data-testid="input-sigma"]').fill('400');
    const [dl4] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv4 = await readDownloadText(dl4);
    assertAscii(csv4, 'roll CSV');
    assert(csv4.includes('8789.466'), 'roll CSV force check');
    console.log('[PASS] rolling-force-calculator');

    // 5. roof-drain-size-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/roof-drain-size-calculator`, '[data-testid="input-area-roof"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B58_TERMS, 'roof-drain-size-calculator');
    approx(await page.locator('[data-testid="res-drains"]').innerText(), 4, 'drain default drains');
    approx(await page.locator('[data-testid="res-q"]').innerText(), 39.583, 'drain default q');
    approx(await page.locator('[data-testid="res-aeff"]').innerText(), 1900.0, 'drain default aeff');
    approx(await page.locator('[data-testid="res-scupper"]').innerText(), 680.3, 'drain default scupper');

    await page.locator('[data-testid="input-area-roof"]').fill('3000');
    await page.locator('[data-testid="input-area-wall"]').fill('400');
    await page.locator('[data-testid="input-rain"]').fill('100');
    await page.locator('[data-testid="input-qdrain"]').fill('15');
    await page.locator('[data-testid="input-hscup"]').fill('0.15');
    approx(await page.locator('[data-testid="res-aeff"]').innerText(), 3200.0, 'drain mod aeff');
    approx(await page.locator('[data-testid="res-q"]').innerText(), 88.889, 'drain mod q');
    approx(await page.locator('[data-testid="res-drains"]').innerText(), 6, 'drain mod drains');
    approx(await page.locator('[data-testid="res-scupper"]').innerText(), 831.6, 'drain mod scupper');

    await page.locator('[data-testid="input-area-roof"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'drain empty');
    await page.locator('[data-testid="input-area-roof"]').fill('3000');
    const [dl5] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv5 = await readDownloadText(dl5);
    assertAscii(csv5, 'drain CSV');
    assert(csv5.includes('88.8889'), 'drain CSV q check');
    console.log('[PASS] roof-drain-size-calculator');

    assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
    assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
    console.log('BATCH 58 E2E ALL PASSED (5/5)');
  } finally {
    await browser.close();
  }
})();
