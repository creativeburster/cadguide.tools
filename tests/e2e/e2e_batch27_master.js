// Batch 27 E2E Master Script: Tools 131-135
// 131. forging-force-calculator
// 132. friction-force-calculator
// 133. fsw-welding-calculator
// 134. gasket-seal-calculator
// 135. gas-pipe-sizing-calculator

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
    // 131. forging-force-calculator
    // Default: sigma=200 MPa, A=5000 mm2, Qf=1.2, dh=10 mm, wf=0.85
    //   F_max = 1200.00 kN, F_tf = 1200/9.80665 = 122.37 tf, W = 10.20 kJ, p_avg = 240.00 MPa
    // Modified (Qf=2.5): F_max = 2500.00 kN, W = 21.25 kJ
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/forging-force-calculator`, '[data-testid="input-sigma"]');
    let main = page.getByRole('main').last();
    await assertNoNan(main, '131-default');

    approx(await main.locator('[data-testid="result-force"]').innerText(), 1200.0, '131 default F_max');
    approx(await main.locator('[data-testid="result-tonnage"]').innerText(), 122.37, '131 default F_tf');
    approx(await main.locator('[data-testid="result-work"]').innerText(), 10.2, '131 default W');
    approx(await main.locator('[data-testid="result-pressure"]').innerText(), 240.0, '131 default p_avg');
    await verifyNegativeTerms(page, ['ISO 286-1', 'ASME B4.1', 'ASME Y14.5-2018', 'DIN 6935', 'ISO 2768'], '131 neg');

    await main.locator('[data-testid="preset-simple-die"]').click();
    approx(await main.locator('[data-testid="result-force"]').innerText(), 2500.0, '131 Qf=2.5 F_max');
    approx(await main.locator('[data-testid="result-work"]').innerText(), 21.25, '131 Qf=2.5 W');

    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: () => Promise.reject(new Error('denied')) },
        configurable: true,
      });
    });
    await main.locator('[data-testid="btn-copy"]').click();
    assert(!(await main.locator('[data-testid="btn-copy"]').innerText()).includes('Copied'), '131 clipboard reject');

    const [dl131] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv131 = await readDownloadText(dl131);
    assertAscii(csv131, '131 csv');
    assert(csv131.includes('"Maximum Forging Force F_max","2500.00","kN"'), '131 csv value');

    await main.locator('[data-testid="input-sigma"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-force"]').innerText()).trim(), '—', '131 empty force');
    await assertNoNan(main, '131-empty');
    console.log('[PASS] 131 forging-force-calculator');

    // =========================================================================
    // 132. friction-force-calculator
    // Default: m=100 kg, theta=15 deg, mu_s=0.35, mu_k=0.30, g=9.80665
    //   N = 947.25 N, Fg = 253.81 N, Fs_max = 331.54 N, Fk = 284.17 N, theta_crit = 19.29 deg -> STATIC
    // Steep 25 deg: N = 888.78 N, Fg = 414.45 N, Fs_max = 311.07 N, Fk = 266.64 N, a_net = 1.478 m/s2 -> SLIDING
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/friction-force-calculator`, '[data-testid="input-mass"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '132-default');

    approx(await main.locator('[data-testid="result-normal"]').innerText(), 947.25, '132 default N');
    approx(await main.locator('[data-testid="result-gravity"]').innerText(), 253.81, '132 default Fg');
    approx(await main.locator('[data-testid="result-static-max"]').innerText(), 331.54, '132 default Fs_max');
    approx(await main.locator('[data-testid="result-kinetic"]').innerText(), 284.17, '132 default Fk');
    approx(await main.locator('[data-testid="result-crit-angle"]').innerText(), 19.29, '132 default crit');
    assert((await main.locator('[data-testid="result-state"]').innerText()).includes('STATIC'), '132 default STATIC');
    await verifyNegativeTerms(page, ['Crane Technical Paper', 'ASME B31.3', 'ANSI/HI 9.6.1', 'ISO 4413'], '132 neg');

    await main.locator('[data-testid="input-angle"]').fill('25');
    approx(await main.locator('[data-testid="result-normal"]').innerText(), 888.78, '132 25deg N');
    approx(await main.locator('[data-testid="result-gravity"]').innerText(), 414.45, '132 25deg Fg');
    approx(await main.locator('[data-testid="result-static-max"]').innerText(), 311.07, '132 25deg Fs_max');
    approx(await main.locator('[data-testid="result-kinetic"]').innerText(), 266.64, '132 25deg Fk');
    approx(await main.locator('[data-testid="result-accel"]').innerText(), 1.478, '132 25deg a_net');
    assert((await main.locator('[data-testid="result-state"]').innerText()).includes('SLIDING'), '132 25deg SLIDING');

    const [dl132] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv132 = await readDownloadText(dl132);
    assertAscii(csv132, '132 csv');
    assert(csv132.includes('"Kinetic Friction Fk","266.64","N"'), '132 csv Fk');

    await main.locator('[data-testid="input-angle"]').fill('95'); // invalid angle >= 90
    assert.strictEqual((await main.locator('[data-testid="result-normal"]').innerText()).trim(), '—', '132 invalid angle');
    await assertNoNan(main, '132-invalid');
    console.log('[PASS] 132 friction-force-calculator');

    // =========================================================================
    // 133. fsw-welding-calculator
    // Default: M=45 N*m, n=1200 RPM, v=200 mm/min, eta=0.90
    //   P_mech = 5.655 kW, pitch = 0.1667 mm/rev, revs = 6.00 rev/mm, Q_lin = 1526.81 J/mm
    // High traverse (v=400): pitch = 0.3333 mm/rev, Q_lin = 763.41 J/mm
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/fsw-welding-calculator`, '[data-testid="input-torque"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '133-default');

    approx(await main.locator('[data-testid="result-power"]').innerText(), 5.655, '133 default P_mech');
    approx(await main.locator('[data-testid="result-pitch"]').innerText(), 0.1667, '133 default pitch');
    approx(await main.locator('[data-testid="result-revs"]').innerText(), 6.0, '133 default rev/mm');
    approx(await main.locator('[data-testid="result-heat"]').innerText(), 1526.81, '133 default Q_lin');
    await verifyNegativeTerms(page, ['AISC 360-22', 'Eurocode 3', 'AWS D1.1', 'ISO 5817', 'ASME B30', 'Aluminum Alloy (k=50)'], '133 neg');

    await main.locator('[data-testid="input-feed"]').fill('400');
    approx(await main.locator('[data-testid="result-pitch"]').innerText(), 0.3333, '133 feed=400 pitch');
    approx(await main.locator('[data-testid="result-heat"]').innerText(), 763.41, '133 feed=400 Q_lin');

    const [dl133] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv133 = await readDownloadText(dl133);
    assertAscii(csv133, '133 csv');
    assert(csv133.includes('"Linear Heat Input Q_lin","763.41","J/mm"'), '133 csv heat');

    await main.locator('[data-testid="input-eta"]').fill('1.2'); // invalid eta > 1
    assert.strictEqual((await main.locator('[data-testid="result-heat"]').innerText()).trim(), '—', '133 invalid eta');
    await assertNoNan(main, '133-invalid');
    console.log('[PASS] 133 fsw-welding-calculator');

    // =========================================================================
    // 134. gasket-seal-calculator
    // Default: Ag=5000 mm2, sigma_g=69 MPa, nb=8, d=16 mm, K=0.20
    //   W_req = 345.00 kN, F_bolt = 43.125 kN, T = 138.00 N*m, shank = 214.49 MPa
    // Modified (nb=12): F_bolt = 28.750 kN, T = 92.00 N*m
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/gasket-seal-calculator`, '[data-testid="input-area"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '134-default');

    approx(await main.locator('[data-testid="result-load"]').innerText(), 345.0, '134 default W_req');
    approx(await main.locator('[data-testid="result-bolt-force"]').innerText(), 43.125, '134 default F_bolt');
    approx(await main.locator('[data-testid="result-torque"]').innerText(), 138.0, '134 default T');
    approx(await main.locator('[data-testid="result-stress"]').innerText(), 214.49, '134 default shank stress');
    await verifyNegativeTerms(page, ['Crane Technical Paper', 'ASME B31.3', 'ANSI/HI 9.6.1', 'ISO 4413', 'k*d/2'], '134 neg');

    await main.locator('[data-testid="input-bolts"]').fill('12');
    approx(await main.locator('[data-testid="result-bolt-force"]').innerText(), 28.75, '134 nb=12 F_bolt');
    approx(await main.locator('[data-testid="result-torque"]').innerText(), 92.0, '134 nb=12 T');

    const [dl134] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv134 = await readDownloadText(dl134);
    assertAscii(csv134, '134 csv');
    assert(csv134.includes('"Torque per Bolt T","92.00","N*m"'), '134 csv torque');

    await main.locator('[data-testid="input-bolts"]').fill('8.5'); // non-integer bolt count
    assert.strictEqual((await main.locator('[data-testid="result-torque"]').innerText()).trim(), '—', '134 non-integer bolts');
    await assertNoNan(main, '134-invalid');
    console.log('[PASS] 134 gasket-seal-calculator');

    // =========================================================================
    // 135. gas-pipe-sizing-calculator
    // Default (EtB example): d=0.622 in, h=0.3 in.w.c., L=60 ft, SG=0.60, demand=30 cfh
    //   k = 0.1170, q_cap = 37.90 cfh (1.073 m3/h), util = 79.15%
    // Preset 1-1/2" Sch 40 (1.610 in): k = 1.8149, q_cap = 588.14 cfh
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/gas-pipe-sizing-calculator`, '[data-testid="input-dia"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '135-default');

    approx(await main.locator('[data-testid="result-k"]').innerText(), 0.117, '135 default k');
    approx(await main.locator('[data-testid="result-cfh"]').innerText(), 37.9, '135 default q_cap');
    approx(await main.locator('[data-testid="result-m3h"]').innerText(), 1.073, '135 default q_m3h');
    approx(await main.locator('[data-testid="result-util"]').innerText(), 79.15, '135 default util');
    assert((await main.locator('[data-testid="result-status"]').innerText()).includes('ADEQUATE'), '135 default ADEQUATE');
    await verifyNegativeTerms(
      page,
      ['IFGC', 'NFPA 54', 'Crane Technical Paper', 'ASME B31.3', 'ANSI/HI 9.6.1', 'ISO 4413'],
      '135 neg'
    );

    await main.locator('[data-testid="preset-one-half"]').click();
    approx(await main.locator('[data-testid="result-k"]').innerText(), 1.8149, '135 1-1/2" k');
    approx(await main.locator('[data-testid="result-cfh"]').innerText(), 588.14, '135 1-1/2" q_cap');

    const [dl135] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv135 = await readDownloadText(dl135);
    assertAscii(csv135, '135 csv');
    assert(csv135.includes('"Calculated Flow Capacity q_cap","588.14","cfh"'), '135 csv cap');

    await main.locator('[data-testid="input-len"]').fill('0');
    assert.strictEqual((await main.locator('[data-testid="result-cfh"]').innerText()).trim(), '—', '135 zero length');
    await assertNoNan(main, '135-empty');
    console.log('[PASS] 135 gas-pipe-sizing-calculator');
  } catch (err) {
    console.error('[FAIL]', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
