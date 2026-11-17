// Batch 25 E2E Master Script: Tools 121-125
// 121. fin-efficiency-calculator
// 122. fire-hydrant-flow-calculator
// 123. fire-resistance-rating-calculator
// 124. fire-sprinkler-coverage-calculator
// 125. flexlm-concurrent-seats-queue

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
    // 121. fin-efficiency-calculator
    // Hand calc (default): L=50, t=2, w=30 mm -> Lc=0.051 m, P=0.064 m, Ac=6e-5 m2, Af=0.003264 m2
    //   k=200, h=50, dT=50 -> m=sqrt(50*0.064/(200*6e-5))=16.32993 1/m, m*Lc=0.832826
    //   eta = tanh(0.832826)/0.832826 = 81.8928% -> 81.89
    //   q_f = 0.818928 * 50 * 0.003264 * 50 = 6.6824 W -> 6.682 W
    //   eps_f = q_f / (50 * 6e-5 * 50) = 44.549 -> 44.55
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/fin-efficiency-calculator`, '[data-testid="input-length"]');
    let main = page.getByRole('main').last();
    await assertNoNan(main, '121-default');

    approx(await main.locator('[data-testid="result-efficiency"]').innerText(), 81.89, '121 default eta');
    approx(await main.locator('[data-testid="result-effectiveness"]').innerText(), 44.55, '121 default eps');
    approx(await main.locator('[data-testid="result-heat"]').innerText(), 6.682, '121 default q_f');
    approx(await main.locator('[data-testid="result-m"]').innerText(), 16.3299, '121 default m');
    await verifyNegativeTerms(page, ['TEMA', 'ASME PTC 12.5', 'Incropera'], '121 neg');

    await main.locator('[data-testid="preset-steel-tall"]').click();
    approx(await main.locator('[data-testid="result-efficiency"]').innerText(), 45.67, '121 tall steel fin eta');

    const [dl121] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv121 = await readDownloadText(dl121);
    assertAscii(csv121, '121 csv');
    assert(csv121.includes('"Fin Efficiency eta_f","45.67","%"'), '121 csv value');

    await main.locator('[data-testid="input-k"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-efficiency"]').innerText()).trim(), '—', '121 empty k');
    await assertNoNan(main, '121-empty');
    console.log('[PASS] 121 fin-efficiency-calculator');

    // =========================================================================
    // 122. fire-hydrant-flow-calculator
    // Hand calc (default): Ps=70, Pr=50, Pp=32, d=2.5, C=0.90, N=1, Ptarget=20
    //   Q = 29.83 * 0.90 * 6.25 * sqrt(32) = 949.1774 -> 949.18 GPM
    //   AFF = 949.1774 * (50/20)^0.54 = 1556.8245 -> 1556.82 GPM (98.22 L/s)
    // Square edge (C=0.80): Q = 949.1774*(8/9) = 843.713 -> 843.71 GPM, AFF = 1383.84 GPM
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/fire-hydrant-flow-calculator`, '[data-testid="input-ps"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '122-default');

    approx(await main.locator('[data-testid="result-qtest-gpm"]').innerText(), 949.18, '122 default Q_test');
    approx(await main.locator('[data-testid="result-aff-gpm"]').innerText(), 1556.82, '122 default AFF');
    approx(await main.locator('[data-testid="result-aff-lps"]').innerText(), 98.22, '122 default L/s');
    await verifyNegativeTerms(page, ['29.84', 'Class AA', 'NIST Special Publication 811', 'BIPM'], '122 neg');

    await main.locator('[data-testid="preset-square-edge"]').click();
    approx(await main.locator('[data-testid="result-qtest-gpm"]').innerText(), 843.71, '122 C=0.80 Q_test');
    approx(await main.locator('[data-testid="result-aff-gpm"]').innerText(), 1383.84, '122 C=0.80 AFF');

    const [dl122] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv122 = await readDownloadText(dl122);
    assertAscii(csv122, '122 csv');
    assert(csv122.includes('"Available Fire Flow AFF","1383.84","GPM"'), '122 csv AFF');

    await main.locator('[data-testid="input-pr"]').fill('75'); // Pr > Ps invalid
    assert.strictEqual((await main.locator('[data-testid="result-aff-gpm"]').innerText()).trim(), '—', '122 invalid Pr>=Ps');
    await assertNoNan(main, '122-invalid');
    console.log('[PASS] 122 fire-hydrant-flow-calculator');

    // =========================================================================
    // 123. fire-resistance-rating-calculator
    // Hand calc (default): Hp=1.60, As=0.0100 -> Hp/As=160.0 1/m; dp=25 mm, kp=0.12, rho=7850, cs=600
    //   tau = 0.025*7850*600 / (0.12*160) = 6132.8125 s
    //   t_crit = -6132.8125 * ln((950-538)/(950-20)) / 60 = 83.22 min
    // Target 60 min mode: dp_req = 25 * (60 / 83.2225) = 18.02 mm
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/fire-resistance-rating-calculator`, '[data-testid="input-hp"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '123-default');

    approx(await main.locator('[data-testid="result-section-factor"]').innerText(), 160.0, '123 default Hp/As');
    approx(await main.locator('[data-testid="result-tau"]').innerText(), 6132.81, '123 default tau');
    approx(await main.locator('[data-testid="result-time-min"]').innerText(), 83.22, '123 default time');
    await verifyNegativeTerms(page, ['IBC Table 601', 'UL Design', 'ASTM E119', 'NIST Special Publication 811'], '123 neg');

    await main.locator('[data-testid="preset-target-60"]').click();
    approx(await main.locator('[data-testid="result-thickness"]').innerText(), 18.02, '123 target 60min dp');

    const [dl123] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv123 = await readDownloadText(dl123);
    assertAscii(csv123, '123 csv');
    assert(csv123.includes('"Protection Thickness dp","18.02","mm"'), '123 csv dp');

    await main.locator('[data-testid="input-tc"]').fill('980'); // Tc >= Tf
    assert.strictEqual((await main.locator('[data-testid="result-thickness"]').innerText()).trim(), '—', '123 invalid Tc>=Tf');
    await assertNoNan(main, '123-invalid');
    console.log('[PASS] 123 fire-resistance-rating-calculator');

    // =========================================================================
    // 124. fire-sprinkler-coverage-calculator
    // Hand calc (default metric Light): L=30, W=20, S=4.0, B=4.0 -> area=600, cov=16.00, grid=ceil(30/4)*ceil(20/4)=8*5=40
    // Ordinary Hazard check: max spacing in metric = 4.6 m -> maxWall = 2.30 m (fixed from old wrong 3.7 m)
    // Imperial check: 100 x 60 ft, S=13 ft, B=10 ft -> area=6000 ft2, cov=130.00 ft2, grid=ceil(100/13)*ceil(60/10)=8*6=48
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/fire-sprinkler-coverage-calculator`, '[data-testid="input-length"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '124-default');

    approx(await main.locator('[data-testid="result-room-area"]').innerText(), 600.0, '124 default room area');
    approx(await main.locator('[data-testid="result-coverage"]').innerText(), 16.0, '124 default cov');
    approx(await main.locator('[data-testid="result-grid-heads"]').innerText(), 40, '124 default grid heads');
    approx(await main.locator('[data-testid="result-max-wall"]').innerText(), 2.3, '124 default max wall');
    await verifyNegativeTerms(page, ['NIST Special Publication 811', 'BIPM SI Brochure'], '124 neg');

    await main.locator('[data-testid="select-hazard"]').selectOption('ordinary');
    approx(await main.locator('[data-testid="result-max-wall"]').innerText(), 2.3, '124 ordinary max wall 4.6/2=2.3');
    assert((await main.locator('[data-testid="status-coverage"]').innerText()).includes('EXCEEDS LIMIT'), '124 ordinary 16>12.1 fails');
    assert((await main.locator('[data-testid="status-spacing"]').innerText()).includes('PASS'), '124 ordinary spacing 4.0<=4.6 passes');

    await main.locator('[data-testid="unit-imperial"]').click();
    approx(await main.locator('[data-testid="result-room-area"]').innerText(), 6000.0, '124 imperial area');
    approx(await main.locator('[data-testid="result-coverage"]').innerText(), 130.0, '124 imperial cov');
    approx(await main.locator('[data-testid="result-grid-heads"]').innerText(), 48, '124 imperial grid heads');

    const [dl124] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv124 = await readDownloadText(dl124);
    assertAscii(csv124, '124 csv');
    assert(csv124.includes('"Grid Sprinkler Count (Nx x Ny)","48","heads"'), '124 csv heads');

    await main.locator('[data-testid="input-spacing"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-coverage"]').innerText()).trim(), '—', '124 empty spacing');
    await assertNoNan(main, '124-empty');
    console.log('[PASS] 124 fire-sprinkler-coverage-calculator');

    // =========================================================================
    // 125. flexlm-concurrent-seats-queue
    // Hand calc (default): U=50, Hd=3, Hw=8, Fp=1.3, m=34 -> A=24.375 Erlangs
    //   Erlang-B P_B(34, 24.375) = 1.291%, Erlang-C P_C(34, 24.375) = 4.417%
    //   Wait = 0.04417 * 2.0 / (34 - 24.375) * 60 = 0.5507 min
    // Overloaded preset (m=20 <= A=24.375): P_C and wait must show '—', while P_B=26.156% remains valid
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/flexlm-concurrent-seats-queue`, '[data-testid="input-users"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '125-default');

    approx(await main.locator('[data-testid="result-offered-load"]').innerText(), 24.375, '125 default A');
    approx(await main.locator('[data-testid="result-pb"]').innerText(), 1.291, '125 default PB');
    approx(await main.locator('[data-testid="result-pc"]').innerText(), 4.417, '125 default PC');
    approx(await main.locator('[data-testid="result-wait"]').innerText(), 0.55, '125 default wait');
    await verifyNegativeTerms(page, ['MAX_OVERAGE_LIMIT', 'adsk_sds', 'AutoCAD (Autodesk)', 'ISO 10303-21'], '125 neg');

    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: () => Promise.reject(new Error('denied')) },
        configurable: true,
      });
    });
    await main.locator('[data-testid="btn-copy"]').click();
    assert(!(await main.locator('[data-testid="btn-copy"]').innerText()).includes('Copied'), '125 clipboard reject');

    await main.locator('[data-testid="preset-overloaded"]').click();
    assert.strictEqual((await main.locator('[data-testid="result-pc"]').innerText()).trim(), '—', '125 overload PC dash');
    assert.strictEqual((await main.locator('[data-testid="result-wait"]').innerText()).trim(), '—', '125 overload wait dash');
    approx(await main.locator('[data-testid="result-pb"]').innerText(), 26.156, '125 overload PB finite');

    const [dl125] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv125 = await readDownloadText(dl125);
    assertAscii(csv125, '125 csv');
    assert(csv125.includes('"Erlang-C Wait Prob P_C","OVERLOAD","%"'), '125 csv overload');

    await main.locator('[data-testid="input-users"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-pb"]').innerText()).trim(), '—', '125 empty users');
    await assertNoNan(main, '125-empty');
    console.log('[PASS] 125 flexlm-concurrent-seats-queue');
  } catch (err) {
    console.error('[FAIL]', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
