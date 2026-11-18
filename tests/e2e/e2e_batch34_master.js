/* eslint-disable @typescript-eslint/no-require-imports */
// Batch 34 E2E Master Script: Tools 166-170
// 166. horsepower-torque-calculator
// 167. hot-water-circulation-calculator
// 168. hvac-load-room-calculator
// 169. hydraulic-cylinder-force-calculator
// 170. hydrostatic-pressure-calculator

const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

function approx(actualStr, expected, label) {
  const cleaned = String(actualStr).replace(/,/g, '').trim();
  const actual = Number(cleaned);
  assert(!Number.isNaN(actual) && Number.isFinite(actual), `${label}: expected finite number, got "${actualStr}"`);
  const tol = Math.max(1e-6, Math.abs(expected) * 0.001);
  assert(
    Math.abs(actual - expected) <= tol,
    `${label}: expected ${expected} (+/-${tol}), got ${actual}`
  );
}

function assertAscii(text, label) {
  assert(/^[\x00-\x7F]*$/.test(text), `${label}: non-ASCII detected`);
}

async function readDownloadText(download) {
  const p = await download.path();
  return fs.readFileSync(p, 'utf8');
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

async function verifyNegativeTerms(page, forbiddenTerms, label) {
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
    assert(!scopedText.includes(term), `${label}: found forbidden term "${term}"`);
  }
}

async function assertNoNan(mainLoc, label) {
  const txt = await mainLoc.innerText();
  assert(!/\bNaN\b|\bInfinity\b|\bundefined\b/.test(txt), `${label}: found NaN/Infinity/undefined`);
}

async function assertZeroNumberInputs(mainLoc, label) {
  const count = await mainLoc.locator('input[type="number"]').count();
  assert.strictEqual(count, 0, `${label}: expected 0 input[type="number"], found ${count}`);
}

async function assertClipboardRejectSafe(page, mainLoc, label) {
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: () => Promise.reject(new Error('Clipboard blocked')),
      },
    });
  });
  await mainLoc.locator('[data-testid="btn-copy"]').click();
  await page.waitForTimeout(50);
  const copyTxt = await mainLoc.locator('[data-testid="btn-copy"]').innerText();
  assert(!/Copied/i.test(copyTxt), `${label}: btn-copy must not show Copied on rejection`);
}

const BANNED_B34_TERMS = [
  'ISO 80000',
  'BIPM SI Brochure',
  'ASME Y14.5',
  'ASPE',
  'Crane Technical Paper',
  'ASME B31.3',
  'ASHRAE',
  'SMACNA',
  'ISO 6946',
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  try {
    // =========================================================================
    // 166. horsepower-torque-calculator
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/horsepower-torque-calculator`, '[data-testid="input-torque"]');
    let main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, '166-inputs');
    await assertNoNan(main, '166-default');
    await verifyNegativeTerms(page, BANNED_B34_TERMS, '166 neg');

    approx(await main.locator('[data-testid="result-hp"]').innerText(), 84.259, '166 def hp');
    approx(await main.locator('[data-testid="result-kw"]').innerText(), 62.832, '166 def kw');
    approx(await main.locator('[data-testid="result-tlbft"]').innerText(), 147.51, '166 def tlbft');

    const [dl166] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv166 = await readDownloadText(dl166);
    assertAscii(csv166, '166 csv');
    assert(csv166.includes('"Mechanical Horsepower","84.2589","hp"'), '166 csv hp');

    await main.locator('[data-testid="preset-crossover-5252"]').click();
    approx(await main.locator('[data-testid="result-hp"]').innerText(), 100.0, '166 cross hp');
    approx(await main.locator('[data-testid="result-kw"]').innerText(), 74.57, '166 cross kw');
    approx(await main.locator('[data-testid="result-tnm"]').innerText(), 135.58, '166 cross tnm');

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-hp"]').innerText(), 84.259, '166 reset');
    await assertClipboardRejectSafe(page, main, '166 copy-reject');

    await main.locator('[data-testid="input-torque"]').fill('10mm');
    assert.strictEqual((await main.locator('[data-testid="result-hp"]').innerText()).trim(), '—', '166 10mm');
    await main.locator('[data-testid="input-torque"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-hp"]').innerText()).trim(), '—', '166 empty');
    await assertNoNan(main, '166-invalid');
    console.log('[PASS] 166 horsepower-torque-calculator');

    // =========================================================================
    // 167. hot-water-circulation-calculator
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/hot-water-circulation-calculator`, '[data-testid="input-length"]');
    main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, '167-inputs');
    await assertNoNan(main, '167-default');
    await verifyNegativeTerms(page, BANNED_B34_TERMS, '167 neg');

    approx(await main.locator('[data-testid="result-flow"]').innerText(), 1.75, '167 def flow');
    approx(await main.locator('[data-testid="result-heatloss"]').innerText(), 1.2, '167 def loss');
    approx(await main.locator('[data-testid="result-dt"]').innerText(), 10.0, '167 def dt');
    approx(await main.locator('[data-testid="result-head"]').innerText(), 2.63, '167 def head');

    const [dl167] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv167 = await readDownloadText(dl167);
    assertAscii(csv167, '167 csv');
    assert(csv167.includes('"Recirculation Flow Rate","1.7506","L/min"'), '167 csv flow');

    await main.locator('[data-testid="preset-long-160"]').click();
    approx(await main.locator('[data-testid="result-flow"]').innerText(), 5.84, '167 preset flow');
    approx(await main.locator('[data-testid="result-heatloss"]').innerText(), 3.2, '167 preset loss');
    approx(await main.locator('[data-testid="result-head"]').innerText(), 6.4, '167 preset head');

    await main.locator('[data-testid="input-tr"]').fill('70');
    assert.strictEqual((await main.locator('[data-testid="result-flow"]').innerText()).trim(), '—', '167 ts<=tr');
    assert(await main.locator('[data-testid="validation-error"]').isVisible(), '167 ts<=tr err');

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-flow"]').innerText(), 1.75, '167 reset');
    await assertClipboardRejectSafe(page, main, '167 copy-reject');

    await main.locator('[data-testid="input-length"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-flow"]').innerText()).trim(), '—', '167 empty');
    await assertNoNan(main, '167-invalid');
    console.log('[PASS] 167 hot-water-circulation-calculator');

    // =========================================================================
    // 168. hvac-load-room-calculator
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/hvac-load-room-calculator`, '[data-testid="input-area"]');
    main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, '168-inputs');
    await assertNoNan(main, '168-default');
    await verifyNegativeTerms(page, BANNED_B34_TERMS, '168 neg');

    approx(await main.locator('[data-testid="result-total"]').innerText(), 961.4, '168 def total');
    approx(await main.locator('[data-testid="result-density"]').innerText(), 32.05, '168 def density');
    approx(await main.locator('[data-testid="result-trans"]').innerText(), 150.0, '168 def trans');
    approx(await main.locator('[data-testid="result-internal"]').innerText(), 540.0, '168 def internal');
    approx(await main.locator('[data-testid="result-vent"]').innerText(), 271.4, '168 def vent');

    await main.locator('[data-testid="preset-conf-60"]').click();
    approx(await main.locator('[data-testid="result-total"]').innerText(), 2718.7, '168 conf total');
    approx(await main.locator('[data-testid="result-density"]').innerText(), 45.31, '168 conf density');

    const [dl168] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv168 = await readDownloadText(dl168);
    assertAscii(csv168, '168 csv');
    assert(csv168.includes('"Total Room Sensible Load","2718.7'), '168 csv total');

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-total"]').innerText(), 961.4, '168 reset');
    await assertClipboardRejectSafe(page, main, '168 copy-reject');

    await main.locator('[data-testid="input-occ"]').fill('1.5');
    assert.strictEqual((await main.locator('[data-testid="result-total"]').innerText()).trim(), '—', '168 dec occ');
    await main.locator('[data-testid="input-area"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-total"]').innerText()).trim(), '—', '168 empty');
    await assertNoNan(main, '168-invalid');
    console.log('[PASS] 168 hvac-load-room-calculator');

    // =========================================================================
    // 169. hydraulic-cylinder-force-calculator
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/hydraulic-cylinder-force-calculator`, '[data-testid="input-bore"]');
    main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, '169-inputs');
    await assertNoNan(main, '169-default');
    await verifyNegativeTerms(page, BANNED_B34_TERMS, '169 neg');

    approx(await main.locator('[data-testid="result-push"]').innerText(), 100.53, '169 def push');
    approx(await main.locator('[data-testid="result-pull"]').innerText(), 75.4, '169 def pull');
    approx(await main.locator('[data-testid="result-full-area"]').innerText(), 50.27, '169 def full area');
    approx(await main.locator('[data-testid="result-annulus-area"]').innerText(), 37.7, '169 def annulus');
    approx(await main.locator('[data-testid="result-reduction"]').innerText(), 25.0, '169 def red');

    const [dl169] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv169 = await readDownloadText(dl169);
    assertAscii(csv169, '169 csv');
    assert(csv169.includes('"Push Force","100.5310","kN"'), '169 csv push');

    await main.locator('[data-testid="preset-imperial-3in"]').click();
    approx(await main.locator('[data-testid="result-push"]').innerText(), 17671.46, '169 imp push');
    approx(await main.locator('[data-testid="result-pull"]').innerText(), 13253.59, '169 imp pull');
    approx(await main.locator('[data-testid="result-full-area"]').innerText(), 7.07, '169 imp area');

    await main.locator('[data-testid="input-rod"]').fill('3.5');
    assert.strictEqual((await main.locator('[data-testid="result-push"]').innerText()).trim(), '—', '169 rod>=bore');
    assert(await main.locator('[data-testid="validation-error"]').isVisible(), '169 rod>=bore err');

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-push"]').innerText(), 100.53, '169 reset');
    await assertClipboardRejectSafe(page, main, '169 copy-reject');

    await main.locator('[data-testid="input-bore"]').fill('abc');
    assert.strictEqual((await main.locator('[data-testid="result-push"]').innerText()).trim(), '—', '169 abc');
    await main.locator('[data-testid="input-bore"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-push"]').innerText()).trim(), '—', '169 empty');
    await assertNoNan(main, '169-invalid');
    console.log('[PASS] 169 hydraulic-cylinder-force-calculator');

    // =========================================================================
    // 170. hydrostatic-pressure-calculator
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/hydrostatic-pressure-calculator`, '[data-testid="input-rho"]');
    main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, '170-inputs');
    await assertNoNan(main, '170-default');
    await verifyNegativeTerms(page, BANNED_B34_TERMS, '170 neg');

    approx(await main.locator('[data-testid="result-pkpa"]').innerText(), 98.067, '170 def pkpa');
    approx(await main.locator('[data-testid="result-pbar"]').innerText(), 0.9807, '170 def pbar');
    approx(await main.locator('[data-testid="result-pabs"]').innerText(), 199.392, '170 def pabs');
    approx(await main.locator('[data-testid="result-force"]').innerText(), 98.067, '170 def force');

    await main.locator('[data-testid="preset-seawater-50m"]').click();
    approx(await main.locator('[data-testid="result-pkpa"]').innerText(), 502.591, '170 sea pkpa');
    approx(await main.locator('[data-testid="result-pbar"]').innerText(), 5.0259, '170 sea pbar');
    approx(await main.locator('[data-testid="result-pabs"]').innerText(), 603.916, '170 sea pabs');

    const [dl170] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv170 = await readDownloadText(dl170);
    assertAscii(csv170, '170 csv');
    assert(csv170.includes('"Gauge Hydrostatic Pressure","502.59'), '170 csv pkpa');

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-pkpa"]').innerText(), 98.067, '170 reset');
    await assertClipboardRejectSafe(page, main, '170 copy-reject');

    await main.locator('[data-testid="input-depth"]').fill('abc');
    assert.strictEqual((await main.locator('[data-testid="result-pkpa"]').innerText()).trim(), '—', '170 abc');
    await main.locator('[data-testid="input-depth"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-pkpa"]').innerText()).trim(), '—', '170 empty');
    await assertNoNan(main, '170-invalid');
    console.log('[PASS] 170 hydrostatic-pressure-calculator');

    console.log('BATCH 34 ALL 5 TOOLS PASSED');
  } finally {
    await browser.close();
  }
})();
