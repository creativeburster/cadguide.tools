// Batch 26 E2E Master Script: Tools 126-130
// 126. flexlm-debug-log-analyzer
// 127. flexlm-error-15-debugger
// 128. flow-rate-unit-converter
// 129. flywheel-energy-calculator
// 130. force-unit-converter

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

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  try {
    // =========================================================================
    // 126. flexlm-debug-log-analyzer
    // Built-in demo log: OUT=7, IN=4, DENIED=3, Peak Concurrent=4
    // Single-event SVG test: guarantees path attribute has NO "NaN" when history.length === 1
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/flexlm-debug-log-analyzer`, '[data-testid="input-log"]');
    let main = page.getByRole('main').last();
    await assertNoNan(main, '126-default');

    approx(await main.locator('[data-testid="result-peak"]').innerText(), 4, '126 default peak');
    approx(await main.locator('[data-testid="result-out"]').innerText(), 7, '126 default out');
    approx(await main.locator('[data-testid="result-in"]').innerText(), 4, '126 default in');
    approx(await main.locator('[data-testid="result-denied"]').innerText(), 3, '126 default denied');
    await verifyNegativeTerms(page, ['ISO 10303-21', 'ISO 16739-1', '52900', '(zero data outflow))'], '126 neg');

    // Single-event SVG path must not contain NaN
    await main.locator('[data-testid="input-log"]').fill('9:01:05 (daemon) OUT: "FEAT_SINGLE" user1@WS01');
    approx(await main.locator('[data-testid="result-peak"]').innerText(), 1, '126 single peak');
    const pathD = await main.locator('[data-testid="usage-chart"] path').getAttribute('d');
    assert(pathD && !pathD.includes('NaN'), `126 single event SVG path contained NaN: "${pathD}"`);

    const [dl126] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv126 = await readDownloadText(dl126);
    assertAscii(csv126, '126 csv');
    assert(csv126.includes('"FEAT_SINGLE","1","0","0","1"'), '126 csv feature');

    await main.locator('[data-testid="btn-clear"]').click();
    assert.strictEqual((await main.locator('[data-testid="result-peak"]').innerText()).trim(), '—', '126 cleared peak');
    await assertNoNan(main, '126-cleared');
    console.log('[PASS] 126 flexlm-debug-log-analyzer');

    // =========================================================================
    // 127. flexlm-error-15-debugger
    // Verifies script generation, dynamic port/host sync, pure ASCII .ps1 download,
    // invalid port rejection, and removal of SOLIDW_LICENSE_FILE / ISO 10303-21 / non-ASCII glyphs
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/flexlm-error-15-debugger`, '[data-testid="input-host"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '127-default');

    assert((await main.locator('[data-testid="result-script"]').innerText()).includes('$MainPort = 27000'), '127 default port');
    await verifyNegativeTerms(
      page,
      ['SOLIDW_LICENSE_FILE', 'ISO 10303-21', 'ISO 16739-1', '52900', 'DNSwith', 'HKCU:\\Software\\FLEXlm'],
      '127 neg'
    );

    await main.locator('[data-testid="input-host"]').fill('lic02.corp.internal');
    await main.locator('[data-testid="input-main-port"]').fill('27100');
    const updatedScript = await main.locator('[data-testid="result-script"]').innerText();
    assert(updatedScript.includes('$ServerHost = "lic02.corp.internal"') && updatedScript.includes('$MainPort = 27100'), '127 script update');

    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: () => Promise.reject(new Error('denied')) },
        configurable: true,
      });
    });
    await main.locator('[data-testid="btn-copy"]').click();
    assert(!(await main.locator('[data-testid="btn-copy"]').innerText()).includes('Copied'), '127 clipboard reject');

    const [dl127] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const ps1Text = await readDownloadText(dl127);
    assertAscii(ps1Text, '127 ps1');
    assert(ps1Text.includes('$MainPort = 27100') && ps1Text.includes('Test-NetConnection'), '127 ps1 contents');

    await main.locator('[data-testid="input-main-port"]').fill('99999');
    assert.strictEqual((await main.locator('[data-testid="result-main-port"]').innerText()).trim(), '—', '127 invalid port');
    await assertNoNan(main, '127-invalid');
    console.log('[PASS] 127 flexlm-error-15-debugger');

    // =========================================================================
    // 128. flow-rate-unit-converter
    // Hand calc (default): 100 L/s -> GPM = 100 / (3.785411784 / 60) = 1585.0323 GPM
    // Modified: 36 m3/h -> L/s = 10.0000 L/s
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/flow-rate-unit-converter`, '[data-testid="input-value"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '128-default');

    approx(await main.locator('[data-testid="result-converted"]').innerText(), 1585.03, '128 default 100 L/s->GPM');
    approx(await main.locator('[data-testid="matrix-m3h"]').innerText(), 360.0, '128 matrix m3/h');
    await verifyNegativeTerms(page, ['ISO 80000-1', 'BIPM SI Brochure'], '128 neg');

    await main.locator('[data-testid="input-value"]').fill('36');
    await main.locator('[data-testid="select-from"]').selectOption('m3h');
    await main.locator('[data-testid="select-to"]').selectOption('ls');
    approx(await main.locator('[data-testid="result-converted"]').innerText(), 10.0, '128 36 m3/h->L/s');

    const [dl128] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv128 = await readDownloadText(dl128);
    assertAscii(csv128, '128 csv');
    assert(csv128.includes('"Base Equivalent","10.0000","L/s"'), '128 csv value');

    await main.locator('[data-testid="input-value"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-converted"]').innerText()).trim(), '—', '128 empty');
    await assertNoNan(main, '128-empty');
    console.log('[PASS] 128 flow-rate-unit-converter');

    // =========================================================================
    // 129. flywheel-energy-calculator
    // Hand calc (default solid disk): m=50, ro=0.5, ri=0, n=300, Cs=0.05
    //   w = 10*pi = 31.4159265 rad/s, I = 0.5*50*0.25 = 6.2500 kg*m2
    //   Ek = 0.5*6.25*w^2 = 3084.25 J, dE = 6.25*w^2*0.05 = 308.43 J, v_rim = 15.708 m/s
    // Annular preset (ri=0.3): I = 0.5*50*(0.25+0.09) = 8.5000 kg*m2, Ek = 4194.58 J
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/flywheel-energy-calculator`, '[data-testid="input-mass"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '129-default');

    approx(await main.locator('[data-testid="result-inertia"]').innerText(), 6.25, '129 default I');
    approx(await main.locator('[data-testid="result-ek"]').innerText(), 3084.25, '129 default Ek');
    approx(await main.locator('[data-testid="result-de"]').innerText(), 308.43, '129 default dE');
    approx(await main.locator('[data-testid="result-vrim"]').innerText(), 15.708, '129 default v_rim');
    await verifyNegativeTerms(page, ['ASME B106.1M', 'DIN 6885', 'ISO 773', 'ISO 1940-1'], '129 neg');

    await main.locator('[data-testid="preset-annular-rim"]').click();
    approx(await main.locator('[data-testid="result-inertia"]').innerText(), 8.5, '129 annular I');
    approx(await main.locator('[data-testid="result-ek"]').innerText(), 4194.58, '129 annular Ek');

    const [dl129] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv129 = await readDownloadText(dl129);
    assertAscii(csv129, '129 csv');
    assert(csv129.includes('"Moment of Inertia I","8.5000","kg*m2"'), '129 csv I');

    await main.locator('[data-testid="input-ri"]').fill('0.6'); // ri >= ro invalid
    assert.strictEqual((await main.locator('[data-testid="result-inertia"]').innerText()).trim(), '—', '129 invalid ri>=ro');
    await assertNoNan(main, '129-invalid');
    console.log('[PASS] 129 flywheel-energy-calculator');

    // =========================================================================
    // 130. force-unit-converter
    // Hand calc (default): 1000 N -> lbf = 1000 / 4.4482216152605 = 224.8089 lbf
    // Swap test: 1000 lbf -> N = 4448.22 N
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/force-unit-converter`, '[data-testid="input-value"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '130-default');

    approx(await main.locator('[data-testid="result-converted"]').innerText(), 224.8089, '130 default 1000 N->lbf');
    approx(await main.locator('[data-testid="matrix-kgf"]').innerText(), 101.9716, '130 matrix kgf');
    await verifyNegativeTerms(page, ['ISO 80000-1', 'BIPM SI Brochure', '9.807', '4.448N'], '130 neg');

    await main.locator('[data-testid="btn-swap"]').click();
    approx(await main.locator('[data-testid="result-converted"]').innerText(), 4448.22, '130 swap 1000 lbf->N');

    const [dl130] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv130 = await readDownloadText(dl130);
    assertAscii(csv130, '130 csv');
    assert(csv130.includes('"Target Force","4448.22","N"'), '130 csv target');

    await main.locator('[data-testid="input-value"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-converted"]').innerText()).trim(), '—', '130 empty');
    await assertNoNan(main, '130-empty');
    console.log('[PASS] 130 force-unit-converter');
  } catch (err) {
    console.error('[FAIL]', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
