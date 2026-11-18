/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 60 Master E2E Suite:
 * 1. section-modulus-calculator
 * 2. section-property-shape-calculator
 * 3. sedimentation-tank-calculator
 * 4. seismic-load-calculator
 * 5. septic-tank-calculator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B60_TERMS = [
  'ACI 318',
  'Eurocode 2',
  'Eurocode 8',
  'IBC 2024',
  'ASCE 7',
  'ADA 2010',
  'NIST Special Publication',
  'ISO 80000',
  'BIPM SI',
  'AISC 360',
  'ASTM ',
  'AWWA ',
  'EPA ',
  'ASME ',
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
  const typeCount = await page.locator('input[type="number"], input[type="range"]').count();
  assert.strictEqual(typeCount, 0, `${label}: found input[type="number"] or input[type="range"]`);
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
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  const results = [];

  try {
    // =========================================================================
    // 1. section-modulus-calculator
    // =========================================================================
    process.stdout.write('Testing [1/5] section-modulus-calculator ... ');
    await openToolPage(page, `${BASE_URL}/toolbox/section-modulus-calculator`, '[data-testid="input-b"]');
    const main1 = page.locator('main').last();
    await verifyNoBannedAndNoNumberInput(page, BANNED_B60_TERMS, 'section-modulus');
    await assertNoNan(main1, 'section-modulus default');

    assert(await main1.locator('a[href="https://en.wikipedia.org/wiki/Section_modulus"]').count() > 0, 'section-modulus wiki link');
    assert(await main1.locator('a[href="https://en.wikipedia.org/wiki/List_of_second_moments_of_area"]').count() > 0, 'section-modulus Ixx link');

    approx(await main1.getByTestId('res-area').innerText(), 20000, 'secmod def A');
    approx(await main1.getByTestId('res-ix').innerText(), 6666.67, 'secmod def Ix');
    approx(await main1.getByTestId('res-sx').innerText(), 666.67, 'secmod def Sx');
    approx(await main1.getByTestId('res-zx').innerText(), 1000.00, 'secmod def Zx');
    approx(await main1.getByTestId('res-rx').innerText(), 57.735, 'secmod def rx');
    approx(await main1.getByTestId('res-stress').innerText(), 30.000, 'secmod def stress');

    await main1.getByTestId('input-b').fill('');
    assert(await main1.getByTestId('validation-error').isVisible(), 'secmod empty validation');
    await assertNoNan(main1, 'secmod empty');
    assert(await main1.getByRole('button', { name: 'Export CSV' }).isDisabled(), 'secmod csv disabled on invalid');

    await main1.getByRole('button', { name: 'Reset' }).click();
    await main1.getByTestId('select-shape').selectOption('ibeam');
    await main1.getByTestId('input-b').fill('150');
    await main1.getByTestId('input-h').fill('300');
    await main1.getByTestId('input-tw').fill('8');
    await main1.getByTestId('input-tf').fill('12');
    await main1.getByTestId('input-moment').fill('80');

    approx(await main1.getByTestId('res-area').innerText(), 5808, 'secmod ibeam A');
    approx(await main1.getByTestId('res-ix').innerText(), 8870.92, 'secmod ibeam Ix');
    approx(await main1.getByTestId('res-sx').innerText(), 591.395, 'secmod ibeam Sx');
    approx(await main1.getByTestId('res-zx').innerText(), 670.752, 'secmod ibeam Zx');
    approx(await main1.getByTestId('res-rx').innerText(), 123.587, 'secmod ibeam rx');
    approx(await main1.getByTestId('res-stress').innerText(), 135.273, 'secmod ibeam stress');

    const [dl1] = await Promise.all([
      page.waitForEvent('download'),
      main1.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv1 = await readDownloadText(dl1);
    assertAscii(csv1, 'secmod CSV');
    assert(csv1.includes('591.395'), 'secmod CSV Sx');
    assert(csv1.includes('135.273'), 'secmod CSV stress');
    console.log('PASSED');
    results.push('[PASS] 1. section-modulus-calculator');

    // =========================================================================
    // 2. section-property-shape-calculator
    // =========================================================================
    process.stdout.write('Testing [2/5] section-property-shape-calculator ... ');
    await openToolPage(page, `${BASE_URL}/toolbox/section-property-shape-calculator`, '[data-testid="input-b"]');
    const main2 = page.locator('main').last();
    await verifyNoBannedAndNoNumberInput(page, BANNED_B60_TERMS, 'section-shape');
    await assertNoNan(main2, 'section-shape default');

    assert(await main2.locator('a[href="https://en.wikipedia.org/wiki/List_of_second_moments_of_area"]').count() > 0, 'shape wiki link');

    approx(await main2.getByTestId('res-area').innerText(), 20000, 'shape def A');
    approx(await main2.getByTestId('res-ix').innerText(), 66666667, 'shape def Ix');
    approx(await main2.getByTestId('res-sx').innerText(), 666667, 'shape def Sx');
    approx(await main2.getByTestId('res-rx').innerText(), 57.735, 'shape def rx');
    approx(await main2.getByTestId('res-ipar').innerText(), 116666667, 'shape def Ipar');

    await main2.getByTestId('input-doff').fill('');
    assert(await main2.getByTestId('validation-error').isVisible(), 'shape empty validation');
    await assertNoNan(main2, 'shape empty');
    assert(await main2.getByRole('button', { name: 'Export CSV' }).isDisabled(), 'shape csv disabled');

    await main2.getByRole('button', { name: 'Reset' }).click();
    await main2.getByTestId('select-shape').selectOption('box');
    await main2.getByTestId('input-b').fill('120');
    await main2.getByTestId('input-h').fill('240');
    await main2.getByTestId('input-t').fill('10');
    await main2.getByTestId('input-doff').fill('80');

    approx(await main2.getByTestId('res-area').innerText(), 6800, 'shape box A');
    approx(await main2.getByTestId('res-ix').innerText(), 49506667, 'shape box Ix');
    approx(await main2.getByTestId('res-sx').innerText(), 412556, 'shape box Sx');
    approx(await main2.getByTestId('res-rx').innerText(), 85.325, 'shape box rx');
    approx(await main2.getByTestId('res-ipar').innerText(), 93026667, 'shape box Ipar');

    const [dl2] = await Promise.all([
      page.waitForEvent('download'),
      main2.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv2 = await readDownloadText(dl2);
    assertAscii(csv2, 'shape CSV');
    assert(csv2.includes('93026666.7'), 'shape CSV Ipar');
    console.log('PASSED');
    results.push('[PASS] 2. section-property-shape-calculator');

    // =========================================================================
    // 3. sedimentation-tank-calculator
    // =========================================================================
    process.stdout.write('Testing [3/5] sedimentation-tank-calculator ... ');
    await openToolPage(page, `${BASE_URL}/toolbox/sedimentation-tank-calculator`, '[data-testid="input-q"]');
    const main3 = page.locator('main').last();
    await verifyNoBannedAndNoNumberInput(page, BANNED_B60_TERMS, 'sedimentation-tank');
    await assertNoNan(main3, 'sedimentation default');

    approx(await main3.getByTestId('res-area').innerText(), 375.00, 'sed def A');
    approx(await main3.getByTestId('res-dia').innerText(), 21.851, 'sed def D');
    approx(await main3.getByTestId('res-vol').innerText(), 1425.0, 'sed def V');
    approx(await main3.getByTestId('res-hrt').innerText(), 2.850, 'sed def HRT');
    approx(await main3.getByTestId('res-weir').innerText(), 174.81, 'sed def weir');

    await main3.getByTestId('input-q').fill('');
    assert(await main3.getByTestId('validation-error').isVisible(), 'sed empty validation');
    await assertNoNan(main3, 'sed empty');
    assert(await main3.getByRole('button', { name: 'Export CSV' }).isDisabled(), 'sed csv disabled');

    await main3.getByRole('button', { name: 'Reset' }).click();
    await main3.getByTestId('input-q').fill('18000');
    await main3.getByTestId('input-sor').fill('25');
    await main3.getByTestId('input-depth').fill('4.2');
    await main3.getByTestId('input-weir-max').fill('200');

    approx(await main3.getByTestId('res-area').innerText(), 720.00, 'sed mod A');
    approx(await main3.getByTestId('res-dia').innerText(), 30.278, 'sed mod D');
    approx(await main3.getByTestId('res-vol').innerText(), 3024.0, 'sed mod V');
    approx(await main3.getByTestId('res-hrt').innerText(), 4.032, 'sed mod HRT');
    approx(await main3.getByTestId('res-weir').innerText(), 189.23, 'sed mod weir');
    assert((await main3.getByTestId('res-weir-status').innerText()).includes('OK'), 'sed mod weir status');

    const [dl3] = await Promise.all([
      page.waitForEvent('download'),
      main3.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv3 = await readDownloadText(dl3);
    assertAscii(csv3, 'sed CSV');
    assert(csv3.includes('30.278'), 'sed CSV dia');
    assert(csv3.includes('189.23'), 'sed CSV weir');
    console.log('PASSED');
    results.push('[PASS] 3. sedimentation-tank-calculator');

    // =========================================================================
    // 4. seismic-load-calculator
    // =========================================================================
    process.stdout.write('Testing [4/5] seismic-load-calculator ... ');
    await openToolPage(page, `${BASE_URL}/toolbox/seismic-load-calculator`, '[data-testid="input-sa"]');
    const main4 = page.locator('main').last();
    await verifyNoBannedAndNoNumberInput(page, BANNED_B60_TERMS, 'seismic-load');
    await assertNoNan(main4, 'seismic default');

    approx(await main4.getByTestId('res-cs').innerText(), 0.1000, 'seis def Cs');
    approx(await main4.getByTestId('res-vbase').innerText(), 500.00, 'seis def Vbase');
    approx(await main4.getByTestId('res-topf').innerText(), 166.67, 'seis def topF');
    approx(await main4.getByTestId('res-mbase').innerText(), 6600.0, 'seis def Mbase');

    await main4.getByTestId('input-floors').fill('2.5');
    assert(await main4.getByTestId('validation-error').isVisible(), 'seis non-integer floors validation');
    await main4.getByTestId('input-sa').fill('');
    assert(await main4.getByTestId('validation-error').isVisible(), 'seis empty validation');
    await assertNoNan(main4, 'seis invalid');
    assert(await main4.getByRole('button', { name: 'Export CSV' }).isDisabled(), 'seis csv disabled');

    await main4.getByRole('button', { name: 'Reset' }).click();
    await main4.getByTestId('input-sa').fill('0.8');
    await main4.getByTestId('input-r').fill('4');
    await main4.getByTestId('input-ie').fill('1.25');
    await main4.getByTestId('input-weight').fill('8000');
    await main4.getByTestId('input-floors').fill('8');
    await main4.getByTestId('input-story-h').fill('3.5');
    await main4.getByTestId('input-k').fill('1.2');

    approx(await main4.getByTestId('res-cs').innerText(), 0.2500, 'seis mod Cs');
    approx(await main4.getByTestId('res-vbase').innerText(), 2000.00, 'seis mod Vbase');
    approx(await main4.getByTestId('res-topf').innerText(), 482.59, 'seis mod topF');
    approx(await main4.getByTestId('res-mbase').innerText(), 40847.48, 'seis mod Mbase');

    const [dl4] = await Promise.all([
      page.waitForEvent('download'),
      main4.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv4 = await readDownloadText(dl4);
    assertAscii(csv4, 'seismic CSV');
    assert(csv4.includes('2000.000'), 'seismic CSV Vbase');
    assert(csv4.includes('40847.48'), 'seismic CSV Mbase');
    console.log('PASSED');
    results.push('[PASS] 4. seismic-load-calculator');

    // =========================================================================
    // 5. septic-tank-calculator
    // =========================================================================
    process.stdout.write('Testing [5/5] septic-tank-calculator ... ');
    await openToolPage(page, `${BASE_URL}/toolbox/septic-tank-calculator`, '[data-testid="input-users"]');
    const main5 = page.locator('main').last();
    await verifyNoBannedAndNoNumberInput(page, BANNED_B60_TERMS, 'septic-tank');
    await assertNoNan(main5, 'septic default');

    approx(await main5.getByTestId('res-vliq').innerText(), 1.200, 'septic def Vliq');
    approx(await main5.getByTestId('res-vsludge').innerText(), 0.320, 'septic def Vsludge');
    approx(await main5.getByTestId('res-veff').innerText(), 1.520, 'septic def Veff');
    approx(await main5.getByTestId('res-vtotal').innerText(), 1.824, 'septic def Vtotal');
    approx(await main5.getByTestId('res-width').innerText(), 0.6367, 'septic def W');
    approx(await main5.getByTestId('res-length').innerText(), 1.5916, 'septic def L');

    await main5.getByTestId('input-users').fill('');
    assert(await main5.getByTestId('validation-error').isVisible(), 'septic empty validation');
    await assertNoNan(main5, 'septic empty');
    assert(await main5.getByRole('button', { name: 'Export CSV' }).isDisabled(), 'septic csv disabled');

    await main5.getByRole('button', { name: 'Reset' }).click();
    await main5.getByTestId('input-users').fill('8');
    await main5.getByTestId('input-flow').fill('180');
    await main5.getByTestId('input-td').fill('1.5');
    await main5.getByTestId('input-sludge').fill('45');
    await main5.getByTestId('input-interval').fill('3');
    await main5.getByTestId('input-freeboard').fill('25');
    await main5.getByTestId('input-depth').fill('1.6');
    await main5.getByTestId('input-lw').fill('2.5');

    approx(await main5.getByTestId('res-vliq').innerText(), 2.160, 'septic mod Vliq');
    approx(await main5.getByTestId('res-vsludge').innerText(), 1.080, 'septic mod Vsludge');
    approx(await main5.getByTestId('res-veff').innerText(), 3.240, 'septic mod Veff');
    approx(await main5.getByTestId('res-vtotal').innerText(), 4.050, 'septic mod Vtotal');
    approx(await main5.getByTestId('res-width').innerText(), 0.9000, 'septic mod W');
    approx(await main5.getByTestId('res-length').innerText(), 2.2500, 'septic mod L');

    const [dl5] = await Promise.all([
      page.waitForEvent('download'),
      main5.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv5 = await readDownloadText(dl5);
    assertAscii(csv5, 'septic CSV');
    assert(csv5.includes('4.0500'), 'septic CSV Vtotal');
    assert(csv5.includes('2.2500'), 'septic CSV length');
    console.log('PASSED');
    results.push('[PASS] 5. septic-tank-calculator');

    assert.strictEqual(consoleErrors.length, 0, `Console/Page errors detected: ${consoleErrors.join('; ')}`);
    console.log('\n=== BATCH 60 E2E SUMMARY ===');
    results.forEach((r) => console.log(r));
    process.exit(0);
  } catch (err) {
    console.error('\nFAILED:', err && err.stack ? err.stack : err);
    process.exit(1);
  } finally {
    await context.close();
    await browser.close();
  }
})();
