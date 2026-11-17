// Batch 24 E2E Master Script: Tools 116-120
// 116. extrusion-pressure-calculator
// 117. fan-law-calculator
// 118. fatal-error-diagnostic-wizard
// 119. fatigue-life-calculator
// 120. fillet-weld-size-calculator

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
    // 116. extrusion-pressure-calculator
    // Hand calc (default): D0=100, Df=30, Lb=200, Yf=150, mu=0.10, a=0.8, b=1.2
    //   R = (100/30)^2 = 11.1111, ln(R) = 2.407946
    //   p_ideal = 150 * 2.407946 = 361.19 MPa
    //   p_ext = 150 * (0.8 + 1.2*2.407946 + 2*0.10*200/100) = 613.43 MPa
    //   F = 613.4302 * pi*10000/4 / 1000 = 4817.87 kN
    // Ideal limit preset (mu=0, a=0, b=1): p_ext = p_ideal = 361.19 MPa
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/extrusion-pressure-calculator`, '[data-testid="input-d0"]');
    let main = page.getByRole('main').last();
    await assertNoNan(main, '116-default');

    approx(await main.locator('[data-testid="result-ratio"]').innerText(), 11.1111, '116 default ratio');
    approx(await main.locator('[data-testid="result-ideal-pressure"]').innerText(), 361.19, '116 default p_ideal');
    approx(await main.locator('[data-testid="result-total-pressure"]').innerText(), 613.43, '116 default p_ext');
    approx(await main.locator('[data-testid="result-force"]').innerText(), 4817.87, '116 default force');
    await verifyNegativeTerms(page, ['ISO 286-1', 'ASME Y14.5', 'DIN 6935', 'ISO 2768'], '116 neg');

    await main.locator('[data-testid="preset-frictionless"]').click();
    approx(await main.locator('[data-testid="result-total-pressure"]').innerText(), 361.19, '116 frictionless p_ext');

    const [dl116] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv116 = await readDownloadText(dl116);
    assertAscii(csv116, '116 csv');
    assert(csv116.includes('"Total Extrusion Pressure","361.19","MPa"'), '116 csv value');

    await main.locator('[data-testid="input-df"]').fill('120');
    assert.strictEqual((await main.locator('[data-testid="result-total-pressure"]').innerText()).trim(), '—', '116 invalid df>=d0');
    await assertNoNan(main, '116-invalid');
    console.log('[PASS] 116 extrusion-pressure-calculator');

    // =========================================================================
    // 117. fan-law-calculator
    // Hand calc (default): N1=1200, N2=900, D1=600, D2=600, rho1=1.20, rho2=1.20, Q1=5, dp1=500, P1=3
    //   rN = 0.75 -> Q2 = 5*0.75 = 3.750, dp2 = 500*0.5625 = 281.25, P2 = 3*0.421875 = 1.2656 kW
    // Upscale preset (N2=1500, D2=750): rN=1.25, rD=1.25
    //   Q2 = 5 * 1.25 * 1.25^3 = 12.207, dp2 = 500 * 1.25^2 * 1.25^2 = 1220.70, P2 = 3 * 1.25^3 * 1.25^5 = 17.8814
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/fan-law-calculator`, '[data-testid="input-n1"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '117-default');

    approx(await main.locator('[data-testid="result-q2"]').innerText(), 3.75, '117 default Q2');
    approx(await main.locator('[data-testid="result-dp2"]').innerText(), 281.25, '117 default dp2');
    approx(await main.locator('[data-testid="result-p2"]').innerText(), 1.2656, '117 default P2');
    await verifyNegativeTerms(page, ['Crane Technical Paper', 'ASME B31.3', 'ANSI/HI 9.6.1', 'ISO 4413'], '117 neg');

    await main.locator('[data-testid="preset-upscale-dia"]').click();
    approx(await main.locator('[data-testid="result-q2"]').innerText(), 12.207, '117 upscale Q2');
    approx(await main.locator('[data-testid="result-dp2"]').innerText(), 1220.7, '117 upscale dp2');
    approx(await main.locator('[data-testid="result-p2"]').innerText(), 17.8814, '117 upscale P2');

    const [dl117] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv117 = await readDownloadText(dl117);
    assertAscii(csv117, '117 csv');
    assert(csv117.includes('"New Volume Flow Q2","12.207","m3/s"'), '117 csv Q2');

    await main.locator('[data-testid="input-n1"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-q2"]').innerText()).trim(), '—', '117 empty n1');
    await assertNoNan(main, '117-empty');
    console.log('[PASS] 117 fan-law-calculator');

    // =========================================================================
    // 118. fatal-error-diagnostic-wizard
    // Verifies documented commands, search filter, download, clipboard reject,
    // and removal of GSDEVICE / zh-CN / Phase 4 Registry Cleaner / /nohardware / ISO 10303-21
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/fatal-error-diagnostic-wizard`, '[data-testid="input-search"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '118-default');

    assert((await main.locator('[data-testid="result-title"]').innerText()).includes('RECOVER'), '118 default title');
    await verifyNegativeTerms(
      page,
      ['GSDEVICE', 'zh-CN', 'Phase 4 Registry Cleaner', '/nohardware', 'ISO 10303-21', 'ISO 16739-1', '52900'],
      '118 neg'
    );

    await main.locator('[data-testid="scenario-crash-recovery"]').click();
    assert((await main.locator('[data-testid="result-command"]').innerText()).includes('DRAWINGRECOVERY'), '118 scenario 3 command');

    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: () => Promise.reject(new Error('denied')) },
        configurable: true,
      });
    });
    await main.locator('[data-testid="btn-copy"]').click();
    assert(!(await main.locator('[data-testid="btn-copy"]').innerText()).includes('Copied'), '118 clipboard reject');

    const [dl118] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const txt118 = await readDownloadText(dl118);
    assertAscii(txt118, '118 txt');
    assert(txt118.includes('DRAWINGRECOVERY') && txt118.includes('.sv$'), '118 txt contents');

    await main.locator('[data-testid="input-search"]').fill('AUDIT');
    assert((await main.locator('[data-testid="result-title"]').innerText()).includes('AUDIT'), '118 filter AUDIT');
    console.log('[PASS] 118 fatal-error-diagnostic-wizard');

    // =========================================================================
    // 119. fatigue-life-calculator
    // Hand calc (default): Sut=600, Se'=300, ka=0.85, kb=0.90, f=0.85, sigmaA=280, sigmaM=50
    //   Se = 300*0.85*0.90 = 229.50 MPa, S1000 = 0.85*600 = 510.00 MPa
    //   b = -log10(510/229.5)/3 = -0.115596, a = 510^2/229.5 = 1133.3333 MPa
    //   sigma_a_eq = 280 / (1 - 50/600) = 305.4545 MPa -> N = (305.4545/1133.3333)^(1/-0.115596) = 84310 cycles
    // Runout branch: sigmaA=200, sigmaM=0 (<= Se 229.50) -> Runout (>= 1,000,000)
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/fatigue-life-calculator`, '[data-testid="input-sut"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '119-default');

    approx(await main.locator('[data-testid="result-se"]').innerText(), 229.5, '119 default Se');
    approx(await main.locator('[data-testid="result-s1000"]').innerText(), 510.0, '119 default S1000');
    approx(await main.locator('[data-testid="result-sigma-eq"]').innerText(), 305.45, '119 default sigma_eq');
    approx(await main.locator('[data-testid="result-b"]').innerText(), -0.115596, '119 default b');
    approx(await main.locator('[data-testid="result-cycles"]').innerText(), 84310, '119 default cycles');
    await verifyNegativeTerms(page, ['ASME Boiler', 'EN 13906', 'FKM Analytical', '-0.085'], '119 neg');

    await main.locator('[data-testid="input-sigma-m"]').fill('0');
    await main.locator('[data-testid="input-sigma-a"]').fill('200');
    assert((await main.locator('[data-testid="result-cycles"]').innerText()).includes('1,000,000'), '119 runout');

    const [dl119] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv119 = await readDownloadText(dl119);
    assertAscii(csv119, '119 csv');
    assert(csv119.includes('"Modified Endurance Limit Se","229.50","MPa"'), '119 csv Se');

    await main.locator('[data-testid="input-sigma-m"]').fill('650');
    assert.strictEqual((await main.locator('[data-testid="result-cycles"]').innerText()).trim(), '—', '119 invalid sigma_m >= Sut');
    await assertNoNan(main, '119-invalid');
    console.log('[PASS] 119 fatigue-life-calculator');

    // =========================================================================
    // 120. fillet-weld-size-calculator
    // Hand calc (default): w=6, Lw=200, Fexx=485, F=120 kN, phi=0.75, Omega=2.00
    //   te = 6/sqrt(2) = 4.2426 mm, tau = 120000 / (te * 200) = 141.42 MPa
    //   Rn = 0.60*485*te*200/1000 = 246.9217 kN
    //   phi*Rn = 185.19 kN (PASS), Rn/Omega = 123.46 kN (PASS)
    //   wReqLrfd = 120000/(0.75*291*200)*sqrt(2) = 3.888 mm -> 3.89 mm
    //   wReqAsd = 120000*2.00/(291*200)*sqrt(2) = 5.832 mm -> 5.83 mm
    // Overloaded preset (w=5, Lw=150, F=160): te=3.5355, phi*Rn=115.74 kN < 160 -> EXCEEDS
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/fillet-weld-size-calculator`, '[data-testid="input-w"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '120-default');

    approx(await main.locator('[data-testid="result-throat"]').innerText(), 4.2426, '120 default throat');
    approx(await main.locator('[data-testid="result-stress"]').innerText(), 141.42, '120 default stress');
    approx(await main.locator('[data-testid="result-phi-rn"]').innerText(), 185.19, '120 default phi*Rn');
    approx(await main.locator('[data-testid="result-asd-rn"]').innerText(), 123.46, '120 default Rn/Omega');
    approx(await main.locator('[data-testid="result-wreq-lrfd"]').innerText(), 3.89, '120 default wreq lrfd');
    approx(await main.locator('[data-testid="result-wreq-asd"]').innerText(), 5.83, '120 default wreq asd');
    await verifyNegativeTerms(page, ['ASME B30', 'AWS D1.1', 'Eurocode 3', 'AISC 360-22'], '120 neg');

    await main.locator('[data-testid="preset-overloaded"]').click();
    approx(await main.locator('[data-testid="result-phi-rn"]').innerText(), 115.74, '120 overloaded phiRn');
    assert((await main.locator('[data-testid="status-lrfd"]').innerText()).includes('EXCEEDS'), '120 overloaded status');

    const [dl120] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv120 = await readDownloadText(dl120);
    assertAscii(csv120, '120 csv');
    assert(csv120.includes('"Design Resistance (phi*Rn)","115.74","kN"'), '120 csv value');

    await main.locator('[data-testid="input-w"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-throat"]').innerText()).trim(), '—', '120 empty w');
    await assertNoNan(main, '120-empty');
    console.log('[PASS] 120 fillet-weld-size-calculator');
  } catch (err) {
    console.error('[FAIL]', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
