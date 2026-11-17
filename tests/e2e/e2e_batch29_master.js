// Batch 29 E2E Master Script: Tools 141-145
// 141. gear-module-pitch-calculator
// 142. gear-ratio-belt-calculator
// 143. gear-ratio-bike-calculator
// 144. gear-ratio-speed-calculator
// 145. generator-sizing-calculator

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
    // 141. gear-module-pitch-calculator
    // Default (module=2.5, z=32): m=2.5000, DP=10.1600, p_mm=7.8540, CP_in=0.3092, d=80.00 mm (3.1496 in)
    // Mode DP (DP=8, z=24): m=3.1750, d_in=3.0000 in, d_mm=76.20 mm
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/gear-module-pitch-calculator`, '[data-testid="input-pitch-val"]');
    let main = page.getByRole('main').last();
    await assertNoNan(main, '141-default');

    approx(await main.locator('[data-testid="result-module"]').innerText(), 2.5, '141 default m');
    approx(await main.locator('[data-testid="result-dp"]').innerText(), 10.16, '141 default DP');
    approx(await main.locator('[data-testid="result-cp-mm"]').innerText(), 7.854, '141 default p_mm');
    approx(await main.locator('[data-testid="result-cp-in"]').innerText(), 0.3092, '141 default CP_in');
    approx(await main.locator('[data-testid="result-dia-mm"]').innerText(), 80.0, '141 default d_mm');
    approx(await main.locator('[data-testid="result-dia-in"]').innerText(), 3.1496, '141 default d_in');
    await verifyNegativeTerms(page, ['ISO 4183', 'ISO 606', 'ASME B29.1', 'ISO 3408'], '141 neg');

    await main.locator('[data-testid="mode-dp"]').click();
    await main.locator('[data-testid="input-pitch-val"]').fill('8');
    await main.locator('[data-testid="input-teeth"]').fill('24');
    approx(await main.locator('[data-testid="result-module"]').innerText(), 3.175, '141 dp=8 m');
    approx(await main.locator('[data-testid="result-dia-in"]').innerText(), 3.0, '141 dp=8 d_in');
    approx(await main.locator('[data-testid="result-dia-mm"]').innerText(), 76.2, '141 dp=8 d_mm');

    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: () => Promise.reject(new Error('denied')) },
        configurable: true,
      });
    });
    await main.locator('[data-testid="btn-copy"]').click();
    assert(!(await main.locator('[data-testid="btn-copy"]').innerText()).includes('Copied'), '141 clipboard reject');

    const [dl141] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv141 = await readDownloadText(dl141);
    assertAscii(csv141, '141 csv');
    assert(csv141.includes('"Metric Module m","3.1750","mm"'), '141 csv m');

    await main.locator('[data-testid="input-teeth"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-dia-mm"]').innerText()).trim(), '—', '141 empty teeth');
    await assertNoNan(main, '141-empty');
    console.log('[PASS] 141 gear-module-pitch-calculator');

    // =========================================================================
    // 142. gear-ratio-belt-calculator
    // Default: D1=100, D2=300, C=500, n1=1800
    //   i=3.000, n2=600.00 RPM, v=9.425 m/s, wrap=156.93 deg, L_exact=1648.39 mm, L_approx=1648.32 mm
    // Interference: C=150 <= (100+300)/2 = 200 -> error & '—'
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/gear-ratio-belt-calculator`, '[data-testid="input-d1"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '142-default');

    approx(await main.locator('[data-testid="result-ratio"]').innerText(), 3.0, '142 default i');
    approx(await main.locator('[data-testid="result-n2"]').innerText(), 600.0, '142 default n2');
    approx(await main.locator('[data-testid="result-speed"]').innerText(), 9.425, '142 default v');
    approx(await main.locator('[data-testid="result-wrap"]').innerText(), 156.93, '142 default wrap');
    approx(await main.locator('[data-testid="result-len-exact"]').innerText(), 1648.39, '142 default L_exact');
    approx(await main.locator('[data-testid="result-len-approx"]').innerText(), 1648.32, '142 default L_approx');
    await verifyNegativeTerms(page, ['ISO 6336', 'AGMA 2001-D04', 'ISO 606', 'ASME B29.1', 'ISO 3408'], '142 neg');

    const [dl142] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv142 = await readDownloadText(dl142);
    assertAscii(csv142, '142 csv');
    assert(csv142.includes('"Exact Open-Belt Length L_exact","1648.39","mm"'), '142 csv L_exact');

    await main.locator('[data-testid="input-c"]').fill('150'); // invalid C <= (D1+D2)/2
    assert.strictEqual((await main.locator('[data-testid="result-len-exact"]').innerText()).trim(), '—', '142 interference');
    assert((await main.locator('[data-testid="error-banner"]').isVisible()), '142 interference banner');
    await assertNoNan(main, '142-invalid');
    console.log('[PASS] 142 gear-ratio-belt-calculator');

    // =========================================================================
    // 143. gear-ratio-bike-calculator
    // Default: 52/11, Dw=672 mm, Lc=172.5 mm, 90 RPM
    //   ratio=4.7273, dev=9.980 m, gearInches=125.08 in, gain=9.208, speed=53.89 km/h (33.49 mph)
    // Modified (cog=28): ratio=1.8571, dev=3.921 m, speed=21.17 km/h
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/gear-ratio-bike-calculator`, '[data-testid="input-chainring"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '143-default');

    approx(await main.locator('[data-testid="result-ratio"]').innerText(), 4.7273, '143 default ratio');
    approx(await main.locator('[data-testid="result-dev"]').innerText(), 9.98, '143 default dev');
    approx(await main.locator('[data-testid="result-gear-inches"]').innerText(), 125.08, '143 default GI');
    approx(await main.locator('[data-testid="result-gain"]').innerText(), 9.208, '143 default gain');
    approx(await main.locator('[data-testid="result-speed-kmh"]').innerText(), 53.89, '143 default kmh');
    approx(await main.locator('[data-testid="result-speed-mph"]').innerText(), 33.49, '143 default mph');
    await verifyNegativeTerms(page, ['ISO 6336', 'ISO 4183', 'RMA IP-20', 'ISO 3408'], '143 neg');

    await main.locator('[data-testid="input-cog"]').fill('28');
    approx(await main.locator('[data-testid="result-ratio"]').innerText(), 1.8571, '143 cog=28 ratio');
    approx(await main.locator('[data-testid="result-dev"]').innerText(), 3.921, '143 cog=28 dev');
    approx(await main.locator('[data-testid="result-speed-kmh"]').innerText(), 21.17, '143 cog=28 kmh');

    const [dl143] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv143 = await readDownloadText(dl143);
    assertAscii(csv143, '143 csv');
    assert(csv143.includes('"Road Speed (km/h)","21.17","km/h"'), '143 csv speed');

    await main.locator('[data-testid="input-cog"]').fill('0');
    assert.strictEqual((await main.locator('[data-testid="result-ratio"]').innerText()).trim(), '—', '143 zero cog');
    await assertNoNan(main, '143-empty');
    console.log('[PASS] 143 gear-ratio-bike-calculator');

    // =========================================================================
    // 144. gear-ratio-speed-calculator
    // Default (spur): z1=20, z2=60, m=2.0, n_in=1800, T_in=50, eta=98%
    //   i=3.000, n_out=600.00 RPM, T_out=147.00 N*m, a=80.00 mm, Pin=9.425 kW, Pout=9.236 kW
    // Planetary (zs=18, zr=54): i=4.000, n_out=450.00 RPM, T_out=196.00 N*m, zp=18.0
    // Invalid planetary (zr <= zs): returns '—'
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/gear-ratio-speed-calculator`, '[data-testid="input-rpm"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '144-default');

    approx(await main.locator('[data-testid="result-ratio"]').innerText(), 3.0, '144 spur i');
    approx(await main.locator('[data-testid="result-rpm"]').innerText(), 600.0, '144 spur n_out');
    approx(await main.locator('[data-testid="result-torque"]').innerText(), 147.0, '144 spur T_out');
    approx(await main.locator('[data-testid="result-center"]').innerText(), 80.0, '144 spur center');
    approx(await main.locator('[data-testid="result-pin"]').innerText(), 9.425, '144 spur Pin');
    approx(await main.locator('[data-testid="result-pout"]').innerText(), 9.236, '144 spur Pout');
    await verifyNegativeTerms(page, ['ISO 4183', 'ISO 606', 'ASME B29.1', 'ISO 3408', "{gearType === 'spur'", 'Helical'], '144 neg');

    await main.locator('[data-testid="mode-planetary"]').click();
    approx(await main.locator('[data-testid="result-ratio"]').innerText(), 4.0, '144 planetary i');
    approx(await main.locator('[data-testid="result-rpm"]').innerText(), 450.0, '144 planetary n_out');
    approx(await main.locator('[data-testid="result-torque"]').innerText(), 196.0, '144 planetary T_out');
    approx(await main.locator('[data-testid="result-planet"]').innerText(), 18.0, '144 planetary zp');

    const [dl144] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv144 = await readDownloadText(dl144);
    assertAscii(csv144, '144 csv');
    assert(csv144.includes('"Output Torque T_out","196.00","N*m"'), '144 csv torque');

    await main.locator('[data-testid="input-ring"]').fill('16'); // zr <= zs invalid
    assert.strictEqual((await main.locator('[data-testid="result-ratio"]').innerText()).trim(), '—', '144 invalid zr<=zs');
    await assertNoNan(main, '144-invalid');
    console.log('[PASS] 144 gear-ratio-speed-calculator');

    // =========================================================================
    // 145. generator-sizing-calculator
    // Default: P_conn=80 kW, DF=0.70, margin=20%, PF=0.80, V_LL=400 V, eta=0.92
    //   P_demand=56.00 kW, P_req=67.20 kW, S_req=84.00 kVA, I_line=121.24 A, P_shaft=73.04 kW
    // Modified (kw=120): P_demand=84.00, P_req=100.80, S_req=126.00
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/generator-sizing-calculator`, '[data-testid="input-kw"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '145-default');

    approx(await main.locator('[data-testid="result-pdemand"]').innerText(), 56.0, '145 default P_demand');
    approx(await main.locator('[data-testid="result-preq"]').innerText(), 67.2, '145 default P_req');
    approx(await main.locator('[data-testid="result-kva"]').innerText(), 84.0, '145 default S_req');
    approx(await main.locator('[data-testid="result-current"]').innerText(), 121.24, '145 default I_line');
    approx(await main.locator('[data-testid="result-shaft"]').innerText(), 73.04, '145 default P_shaft');
    await verifyNegativeTerms(page, ['IEC 60909', 'IEEE Std 1584', 'IPC-2221', 'IPC-2152', 'starting method'], '145 neg');

    await main.locator('[data-testid="input-kw"]').fill('120');
    approx(await main.locator('[data-testid="result-kva"]').innerText(), 126.0, '145 kw=120 S_req');

    const [dl145] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv145 = await readDownloadText(dl145);
    assertAscii(csv145, '145 csv');
    assert(csv145.includes('"Required Apparent Power S_req","126.00","kVA"'), '145 csv S_req');

    await main.locator('[data-testid="input-pf"]').fill('1.2'); // invalid PF > 1
    assert.strictEqual((await main.locator('[data-testid="result-kva"]').innerText()).trim(), '—', '145 invalid PF');
    await assertNoNan(main, '145-invalid');
    console.log('[PASS] 145 generator-sizing-calculator');
  } catch (err) {
    console.error('[FAIL]', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
