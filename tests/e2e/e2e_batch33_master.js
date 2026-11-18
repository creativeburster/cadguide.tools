/* eslint-disable @typescript-eslint/no-require-imports */
// Batch 33 E2E Master Script: Tools 161-165
// 161. helical-gear-calculator
// 162. hertz-contact-stress-calculator
// 163. hobbing-cycle-time-calculator
// 164. hole-stackup-calculator
// 165. horizontal-curve-calculator

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

const BANNED_B33_TERMS = [
  'ISO 6336',
  'AGMA',
  'ISO 4183',
  'RMA IP-20',
  'BPVC',
  'EN 13906',
  'ISO 286',
  'ASME B4.1',
  'ASME Y14.5',
  'ISO 1101',
  'Eurocode 7',
  'EN 1997-1',
  'FHWA',
  'AASHTO',
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  try {
    // =========================================================================
    // 161. helical-gear-calculator
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/helical-gear-calculator`, '[data-testid="input-mn"]');
    let main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, '161-inputs');
    await assertNoNan(main, '161-default');
    await verifyNegativeTerms(page, BANNED_B33_TERMS, '161 neg');

    approx(await main.locator('[data-testid="result-mt"]').innerText(), 2.1284, '161 default mt');
    approx(await main.locator('[data-testid="result-d"]').innerText(), 51.081, '161 default d');
    approx(await main.locator('[data-testid="result-zv"]').innerText(), 28.924, '161 default zv');
    approx(await main.locator('[data-testid="result-fa"]').innerText(), 363.97, '161 default fa');
    approx(await main.locator('[data-testid="result-fr"]').innerText(), 387.33, '161 default fr');
    approx(await main.locator('[data-testid="result-da"]').innerText(), 55.081, '161 default da');

    await main.locator('[data-testid="preset-spur-0deg"]').click();
    approx(await main.locator('[data-testid="result-mt"]').innerText(), 2.5, '161 spur mt');
    approx(await main.locator('[data-testid="result-d"]').innerText(), 50.0, '161 spur d');
    approx(await main.locator('[data-testid="result-zv"]').innerText(), 20.0, '161 spur zv');
    approx(await main.locator('[data-testid="result-fa"]').innerText(), 0.0, '161 spur fa');
    approx(await main.locator('[data-testid="result-fr"]').innerText(), 291.18, '161 spur fr');

    const [dl161] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv161 = await readDownloadText(dl161);
    assertAscii(csv161, '161 csv');
    assert(csv161.includes('"Transverse Module mt","2.500000","mm"'), '161 csv mt');

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-zv"]').innerText(), 28.924, '161 reset');
    await assertClipboardRejectSafe(page, main, '161 copy-reject');

    await main.locator('[data-testid="input-z"]').fill('24.5');
    assert.strictEqual((await main.locator('[data-testid="result-zv"]').innerText()).trim(), '—', '161 decimal z');
    await main.locator('[data-testid="input-mn"]').fill('abc');
    assert.strictEqual((await main.locator('[data-testid="result-mt"]').innerText()).trim(), '—', '161 abc');
    await main.locator('[data-testid="input-mn"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-mt"]').innerText()).trim(), '—', '161 empty');
    await assertNoNan(main, '161-invalid');
    console.log('[PASS] 161 helical-gear-calculator');

    // =========================================================================
    // 162. hertz-contact-stress-calculator
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/hertz-contact-stress-calculator`, '[data-testid="input-force"]');
    main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, '162-inputs');
    await assertNoNan(main, '162-default');
    await verifyNegativeTerms(page, BANNED_B33_TERMS, '162 neg');

    approx(await main.locator('[data-testid="result-pmax"]').innerText(), 241.45, '162 default pmax');
    approx(await main.locator('[data-testid="result-b"]').innerText(), 0.2637, '162 default b');
    approx(await main.locator('[data-testid="result-width"]').innerText(), 0.5273, '162 default width');
    approx(await main.locator('[data-testid="result-estar"]').innerText(), 109.89, '162 default Estar');

    await main.locator('[data-testid="preset-external-rollers"]').click();
    approx(await main.locator('[data-testid="result-pmax"]').innerText(), 621.43, '162 external pmax');
    approx(await main.locator('[data-testid="result-b"]').innerText(), 0.1366, '162 external b');
    approx(await main.locator('[data-testid="result-estar"]').innerText(), 113.736, '162 external Estar');

    const [dl162] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv162 = await readDownloadText(dl162);
    assertAscii(csv162, '162 csv');
    assert(csv162.includes('"Max Hertz Contact Pressure p_max","621.4253","MPa"'), '162 csv pmax');

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-pmax"]').innerText(), 241.45, '162 reset');
    await assertClipboardRejectSafe(page, main, '162 copy-reject');

    await main.locator('[data-testid="input-r2"]').fill('-10');
    assert.strictEqual((await main.locator('[data-testid="result-pmax"]').innerText()).trim(), '—', '162 invalid concave');
    await main.locator('[data-testid="input-r2"]').fill('abc');
    assert.strictEqual((await main.locator('[data-testid="result-pmax"]').innerText()).trim(), '—', '162 abc');
    await main.locator('[data-testid="input-r2"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-pmax"]').innerText()).trim(), '—', '162 empty');
    await assertNoNan(main, '162-invalid');
    console.log('[PASS] 162 hertz-contact-stress-calculator');

    // =========================================================================
    // 163. hobbing-cycle-time-calculator
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/hobbing-cycle-time-calculator`, '[data-testid="input-z"]');
    main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, '163-inputs');
    await assertNoNan(main, '163-default');
    await verifyNegativeTerms(page, BANNED_B33_TERMS, '163 neg');

    approx(await main.locator('[data-testid="result-total"]').innerText(), 10.667, '163 default total');
    approx(await main.locator('[data-testid="result-pass"]').innerText(), 5.333, '163 default pass');
    approx(await main.locator('[data-testid="result-nw"]').innerText(), 5.0, '163 default nw');
    approx(await main.locator('[data-testid="result-vf"]').innerText(), 7.5, '163 default vf');

    await main.locator('[data-testid="preset-double-start"]').click();
    approx(await main.locator('[data-testid="result-nw"]').innerText(), 10.0, '163 preset nw');
    approx(await main.locator('[data-testid="result-vf"]').innerText(), 12.0, '163 preset vf');
    approx(await main.locator('[data-testid="result-total"]').innerText(), 4.333, '163 preset total');

    const [dl163] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv163 = await readDownloadText(dl163);
    assertAscii(csv163, '163 csv');
    assert(csv163.includes('"Total Cutting Time","4.3333","min"'), '163 csv total');

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-total"]').innerText(), 10.667, '163 reset');
    await assertClipboardRejectSafe(page, main, '163 copy-reject');

    await main.locator('[data-testid="input-passes"]').fill('1.5');
    assert.strictEqual((await main.locator('[data-testid="result-total"]').innerText()).trim(), '—', '163 decimal passes');
    await main.locator('[data-testid="input-passes"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-total"]').innerText()).trim(), '—', '163 empty');
    await assertNoNan(main, '163-invalid');
    console.log('[PASS] 163 hobbing-cycle-time-calculator');

    // =========================================================================
    // 164. hole-stackup-calculator
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/hole-stackup-calculator`, '[data-testid="input-nom-clearance"]');
    main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, '164-inputs');
    await assertNoNan(main, '164-default');
    await verifyNegativeTerms(page, BANNED_B33_TERMS, '164 neg');

    approx(await main.locator('[data-testid="result-wc"]').innerText(), 0.4, '164 default wc');
    approx(await main.locator('[data-testid="result-rss"]').innerText(), 0.2121, '164 default rss');
    approx(await main.locator('[data-testid="result-min-wc"]').innerText(), 0.1, '164 default min-wc');
    approx(await main.locator('[data-testid="result-min-rss"]').innerText(), 0.2879, '164 default min-rss');
    assert((await main.locator('[data-testid="result-status"]').innerText()).includes('PASS'), '164 default PASS');

    await main.locator('[data-testid="preset-tight-rss"]').click();
    approx(await main.locator('[data-testid="result-wc"]').innerText(), 0.34, '164 tight wc');
    approx(await main.locator('[data-testid="result-rss"]').innerText(), 0.197, '164 tight rss');
    approx(await main.locator('[data-testid="result-min-wc"]').innerText(), -0.04, '164 tight min-wc');
    assert((await main.locator('[data-testid="result-status"]').innerText()).includes('WARN'), '164 tight WARN');

    const [dl164] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv164 = await readDownloadText(dl164);
    assertAscii(csv164, '164 csv');
    assert(csv164.includes('"Worst-Case Half-Stack T_WC","0.3400","mm"'), '164 csv wc');

    await main.locator('[data-testid="btn-add-tol"]').click();
    approx(await main.locator('[data-testid="result-wc"]').innerText(), 0.39, '164 added tol wc');

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-wc"]').innerText(), 0.4, '164 reset');
    await assertClipboardRejectSafe(page, main, '164 copy-reject');

    await main.locator('[data-testid="input-tol-0"]').fill('10mm');
    assert.strictEqual((await main.locator('[data-testid="result-wc"]').innerText()).trim(), '—', '164 10mm');
    await main.locator('[data-testid="input-tol-0"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-wc"]').innerText()).trim(), '—', '164 empty');
    await assertNoNan(main, '164-invalid');
    console.log('[PASS] 164 hole-stackup-calculator');

    // =========================================================================
    // 165. horizontal-curve-calculator
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/horizontal-curve-calculator`, '[data-testid="input-delta"]');
    main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, '165-inputs');
    await assertNoNan(main, '165-default');
    await verifyNegativeTerms(page, BANNED_B33_TERMS, '165 neg');

    approx(await main.locator('[data-testid="result-l"]').innerText(), 203.85, '165 default L');
    approx(await main.locator('[data-testid="result-t"]').innerText(), 105.52, '165 default T');
    approx(await main.locator('[data-testid="result-lc"]').innerText(), 200.42, '165 default LC');
    approx(await main.locator('[data-testid="result-e"]').innerText(), 16.95, '165 default E');
    approx(await main.locator('[data-testid="result-m"]').innerText(), 16.1, '165 default M');

    await main.locator('[data-testid="preset-right-angle"]').click();
    approx(await main.locator('[data-testid="result-l"]').innerText(), 235.62, '165 90deg L');
    approx(await main.locator('[data-testid="result-t"]').innerText(), 150.0, '165 90deg T');
    approx(await main.locator('[data-testid="result-lc"]').innerText(), 212.13, '165 90deg LC');
    approx(await main.locator('[data-testid="result-e"]').innerText(), 62.13, '165 90deg E');
    approx(await main.locator('[data-testid="result-m"]').innerText(), 43.93, '165 90deg M');

    const [dl165] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv165 = await readDownloadText(dl165);
    assertAscii(csv165, '165 csv');
    assert(csv165.includes('"Tangent Distance T","150.0000","m"'), '165 csv T');

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-l"]').innerText(), 203.85, '165 reset');
    await assertClipboardRejectSafe(page, main, '165 copy-reject');

    await main.locator('[data-testid="input-delta"]').fill('185');
    assert.strictEqual((await main.locator('[data-testid="result-l"]').innerText()).trim(), '—', '165 delta>180');
    await main.locator('[data-testid="input-delta"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-l"]').innerText()).trim(), '—', '165 empty');
    await assertNoNan(main, '165-invalid');
    console.log('[PASS] 165 horizontal-curve-calculator');

    console.log('BATCH 33 ALL 5 TOOLS PASSED');
  } finally {
    await browser.close();
  }
})();
