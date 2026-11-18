/* eslint-disable @typescript-eslint/no-require-imports */
// Batch 32 E2E Master Script: Tools 156-160
// 156. harmonic-drive-calculator
// 157. heat-exchanger-calculator
// 158. heat-transfer-conduction-calculator
// 159. heat-transfer-convection-calculator
// 160. heat-treatment-time-calculator

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

const BANNED_B32_TERMS = [
  'NIST Special Publication 811',
  'ISO 80000',
  'BIPM SI Brochure',
  'ASME Y14.5',
  'TEMA',
  'PTC 12.5',
  'SMACNA',
  'ASHRAE',
  'ISO 6946',
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  try {
    // =========================================================================
    // 156. harmonic-drive-calculator
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/harmonic-drive-calculator`, '[data-testid="input-zs"]');
    let main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, '156-inputs');
    await assertNoNan(main, '156-default');
    await verifyNegativeTerms(page, BANNED_B32_TERMS, '156 neg');

    approx(await main.locator('[data-testid="result-ratio"]').innerText(), 100.0, '156 default ratio');
    approx(await main.locator('[data-testid="result-n2"]').innerText(), 30.0, '156 default n2');
    approx(await main.locator('[data-testid="result-t2"]').innerText(), 425.0, '156 default t2');
    approx(await main.locator('[data-testid="result-power"]').innerText(), 1.335, '156 default power');

    await main.locator('[data-testid="btn-config-circular"]').click();
    approx(await main.locator('[data-testid="result-ratio"]').innerText(), 101.0, '156 circular ratio');
    approx(await main.locator('[data-testid="result-n2"]').innerText(), 29.703, '156 circular n2');
    approx(await main.locator('[data-testid="result-t2"]').innerText(), 429.25, '156 circular t2');

    await main.locator('[data-testid="preset-ratio50"]').click();
    approx(await main.locator('[data-testid="result-ratio"]').innerText(), 50.0, '156 preset50 ratio');
    approx(await main.locator('[data-testid="result-n2"]').innerText(), 40.0, '156 preset50 n2');
    approx(await main.locator('[data-testid="result-t2"]').innerText(), 170.0, '156 preset50 t2');

    const [dl156] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv156 = await readDownloadText(dl156);
    assertAscii(csv156, '156 csv');
    assert(csv156.includes('"Reduction Ratio i","50.0000",":1"'), '156 csv ratio');

    await assertClipboardRejectSafe(page, main, '156 copy-reject');

    await main.locator('[data-testid="input-zs"]').fill('100');
    assert.strictEqual((await main.locator('[data-testid="result-ratio"]').innerText()).trim(), '—', '156 zs<=zf');
    assert(await main.locator('[data-testid="validation-error"]').isVisible(), '156 error visible');

    await main.locator('[data-testid="input-zs"]').fill('202.5');
    assert.strictEqual((await main.locator('[data-testid="result-ratio"]').innerText()).trim(), '—', '156 decimal teeth');

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-ratio"]').innerText(), 100.0, '156 reset');

    await main.locator('[data-testid="input-n1"]').fill('abc');
    assert.strictEqual((await main.locator('[data-testid="result-ratio"]').innerText()).trim(), '—', '156 abc');
    await main.locator('[data-testid="input-n1"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-ratio"]').innerText()).trim(), '—', '156 empty');
    await assertNoNan(main, '156-invalid');
    console.log('[PASS] 156 harmonic-drive-calculator');

    // =========================================================================
    // 157. heat-exchanger-calculator
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/heat-exchanger-calculator`, '[data-testid="input-thi"]');
    main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, '157-inputs');
    await assertNoNan(main, '157-default');
    await verifyNegativeTerms(page, BANNED_B32_TERMS, '157 neg');

    approx(await main.locator('[data-testid="result-q"]').innerText(), 250.8, '157 default Q');
    approx(await main.locator('[data-testid="result-lmtd"]').innerText(), 34.761, '157 default LMTD');
    approx(await main.locator('[data-testid="result-ua"]').innerText(), 7.215, '157 default UA');
    approx(await main.locator('[data-testid="result-area"]').innerText(), 7.215, '157 default area');

    await main.locator('[data-testid="preset-balanced"]').click();
    approx(await main.locator('[data-testid="result-lmtd"]').innerText(), 30.0, '157 balanced LMTD');
    approx(await main.locator('[data-testid="result-ua"]').innerText(), 8.36, '157 balanced UA');
    await assertNoNan(main, '157-balanced');

    const [dl157] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv157 = await readDownloadText(dl157);
    assertAscii(csv157, '157 csv');
    assert(csv157.includes('"LMTD","30.0000","degC"'), '157 csv lmtd');

    await main.locator('[data-testid="btn-arr-parallel"]').click();
    await main.locator('[data-testid="input-tho"]').fill('35');
    assert.strictEqual((await main.locator('[data-testid="result-lmtd"]').innerText()).trim(), '—', '157 temp cross');
    assert(await main.locator('[data-testid="validation-error"]').isVisible(), '157 temp cross error');

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-lmtd"]').innerText(), 34.761, '157 reset');
    await assertClipboardRejectSafe(page, main, '157 copy-reject');

    await main.locator('[data-testid="input-thi"]').fill('10mm');
    assert.strictEqual((await main.locator('[data-testid="result-q"]').innerText()).trim(), '—', '157 10mm');
    await main.locator('[data-testid="input-thi"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-q"]').innerText()).trim(), '—', '157 empty');
    await assertNoNan(main, '157-invalid');
    console.log('[PASS] 157 heat-exchanger-calculator');

    // =========================================================================
    // 158. heat-transfer-conduction-calculator
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/heat-transfer-conduction-calculator`, '[data-testid="input-k"]');
    main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, '158-inputs');
    await assertNoNan(main, '158-default');
    await verifyNegativeTerms(page, BANNED_B32_TERMS, '158 neg');

    approx(await main.locator('[data-testid="result-q"]').innerText(), 375.0, '158 default Q');
    approx(await main.locator('[data-testid="result-r-abs"]').innerText(), 0.04, '158 default R_abs');
    approx(await main.locator('[data-testid="result-flux"]').innerText(), 37.5, '158 default flux');
    approx(await main.locator('[data-testid="result-r-area"]').innerText(), 0.4, '158 default R_area');

    await main.locator('[data-testid="preset-steel-plate"]').click();
    approx(await main.locator('[data-testid="result-q"]').innerText(), 100000.0, '158 preset Q');
    approx(await main.locator('[data-testid="result-r-abs"]').innerText(), 0.0008, '158 preset R_abs');
    approx(await main.locator('[data-testid="result-flux"]').innerText(), 200000.0, '158 preset flux');

    const [dl158] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv158 = await readDownloadText(dl158);
    assertAscii(csv158, '158 csv');
    assert(csv158.includes('"Heat Transfer Rate Q","100000.0000","W"'), '158 csv Q');

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-q"]').innerText(), 375.0, '158 reset');
    await assertClipboardRejectSafe(page, main, '158 copy-reject');

    await main.locator('[data-testid="input-k"]').fill('abc');
    assert.strictEqual((await main.locator('[data-testid="result-q"]').innerText()).trim(), '—', '158 abc');
    await main.locator('[data-testid="input-k"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-q"]').innerText()).trim(), '—', '158 empty');
    await assertNoNan(main, '158-invalid');
    console.log('[PASS] 158 heat-transfer-conduction-calculator');

    // =========================================================================
    // 159. heat-transfer-convection-calculator
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/heat-transfer-convection-calculator`, '[data-testid="input-nu"]');
    main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, '159-inputs');
    await assertNoNan(main, '159-default');
    await verifyNegativeTerms(page, BANNED_B32_TERMS, '159 neg');

    approx(await main.locator('[data-testid="result-h"]').innerText(), 2.6, '159 default h');
    approx(await main.locator('[data-testid="result-q"]').innerText(), 260.0, '159 default Q');
    approx(await main.locator('[data-testid="result-flux"]').innerText(), 52.0, '159 default flux');
    approx(await main.locator('[data-testid="result-r-conv"]').innerText(), 0.076923, '159 default R_conv');

    await main.locator('[data-testid="preset-water-pipe"]').click();
    approx(await main.locator('[data-testid="result-h"]').innerText(), 1800.0, '159 preset h');
    approx(await main.locator('[data-testid="result-q"]').innerText(), 21600.0, '159 preset Q');
    approx(await main.locator('[data-testid="result-flux"]').innerText(), 27000.0, '159 preset flux');
    approx(await main.locator('[data-testid="result-r-conv"]').innerText(), 0.000694, '159 preset R_conv');

    const [dl159] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv159 = await readDownloadText(dl159);
    assertAscii(csv159, '159 csv');
    assert(csv159.includes('"Total Heat Transfer Rate Q","21600.0000","W"'), '159 csv Q');

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-q"]').innerText(), 260.0, '159 reset');
    await assertClipboardRejectSafe(page, main, '159 copy-reject');

    await main.locator('[data-testid="input-length"]').fill('0');
    assert.strictEqual((await main.locator('[data-testid="result-h"]').innerText()).trim(), '—', '159 L=0');
    await main.locator('[data-testid="input-length"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-h"]').innerText()).trim(), '—', '159 empty');
    await assertNoNan(main, '159-invalid');
    console.log('[PASS] 159 heat-transfer-convection-calculator');

    // =========================================================================
    // 160. heat-treatment-time-calculator
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/heat-treatment-time-calculator`, '[data-testid="input-thickness"]');
    main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, '160-inputs');
    await assertNoNan(main, '160-default');
    await verifyNegativeTerms(page, BANNED_B32_TERMS, '160 neg');

    approx(await main.locator('[data-testid="result-soak"]').innerText(), 60.0, '160 default soak');
    approx(await main.locator('[data-testid="result-heat"]').innerText(), 100.0, '160 default heat');
    approx(await main.locator('[data-testid="result-total"]').innerText(), 160.0, '160 default total');
    assert.strictEqual((await main.locator('[data-testid="result-cool"]').innerText()).trim(), 'Oil / Water Quench', '160 default cool');

    await main.locator('[data-testid="preset-alloy80"]').click();
    approx(await main.locator('[data-testid="result-soak"]').innerText(), 120.0, '160 preset soak');
    approx(await main.locator('[data-testid="result-heat"]').innerText(), 160.0, '160 preset heat');
    approx(await main.locator('[data-testid="result-total"]').innerText(), 280.0, '160 preset total');
    assert.strictEqual((await main.locator('[data-testid="result-cool"]').innerText()).trim(), 'Slow Furnace Cool', '160 preset cool');

    await main.locator('[data-testid="select-material"]').selectOption('aluminum');
    await main.locator('[data-testid="select-treatment"]').selectOption('tempering');
    await main.locator('[data-testid="input-thickness"]').fill('40');
    approx(await main.locator('[data-testid="result-soak"]').innerText(), 32.0, '160 custom soak');
    approx(await main.locator('[data-testid="result-heat"]').innerText(), 80.0, '160 custom heat');
    approx(await main.locator('[data-testid="result-total"]').innerText(), 112.0, '160 custom total');
    assert.strictEqual((await main.locator('[data-testid="result-cool"]').innerText()).trim(), 'Still Air Cool', '160 custom cool');

    const [dl160] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv160 = await readDownloadText(dl160);
    assertAscii(csv160, '160 csv');
    assert(csv160.includes('"Total Furnace Time","112.00","min"'), '160 csv total');

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-total"]').innerText(), 160.0, '160 reset');
    await assertClipboardRejectSafe(page, main, '160 copy-reject');

    await main.locator('[data-testid="input-thickness"]').fill('abc');
    assert.strictEqual((await main.locator('[data-testid="result-soak"]').innerText()).trim(), '—', '160 abc');
    await main.locator('[data-testid="input-thickness"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-soak"]').innerText()).trim(), '—', '160 empty');
    await assertNoNan(main, '160-invalid');
    console.log('[PASS] 160 heat-treatment-time-calculator');

    console.log('BATCH 32 ALL 5 TOOLS PASSED');
  } finally {
    await browser.close();
  }
})();
