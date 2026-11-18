/* eslint-disable @typescript-eslint/no-require-imports */
// Batch 31 E2E Master Script: Tools 151-155
// 151. ground-anchor-capacity-calculator
// 152. grounding-grid-calculator
// 153. gyroscope-precession-calculator
// 154. gyroscopic-couple-calculator
// 155. hardness-converter
// (Skipped gstarcad-shortcuts-sheet per TOOLBOX_STANDARD.md *-shortcuts-sheet exclusion rule)

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
    // 151. ground-anchor-capacity-calculator
    // Default: Db=150mm, Lb=8.0m, tau=140kPa, FS=2.0, strand=150kN
    //   perimeter = pi*0.15 = 0.471239m -> 0.471
    //   area = 0.471239*8 = 3.769911m2 -> 3.770
    //   tUlt = 3.769911*140 = 527.7876kN -> 527.8
    //   tAllow = 527.7876/2.0 = 263.8938kN -> 263.9
    //   strands = ceil(263.8938/150) = 2
    // Preset soft-clay-short (130, 3.5, 80, 2.0, 150):
    //   tUlt = pi*0.13*3.5*80 = 114.354 -> 114.4, tAllow = 57.177 -> 57.2, strands = 1, WARNING
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/ground-anchor-capacity-calculator`, '[data-testid="input-db"]');
    let main = page.getByRole('main').last();
    await assertNoNan(main, '151-default');

    approx(await main.locator('[data-testid="result-tallow"]').innerText(), 263.9, '151 default tallow');
    approx(await main.locator('[data-testid="result-tult"]').innerText(), 527.8, '151 default tult');
    approx(await main.locator('[data-testid="result-strands"]').innerText(), 2, '151 default strands');
    approx(await main.locator('[data-testid="result-area"]').innerText(), 3.77, '151 default area');
    approx(await main.locator('[data-testid="result-perimeter"]').innerText(), 0.471, '151 default perim');
    assert((await main.locator('[data-testid="result-status"]').innerText()).includes('SATISFIED'), '151 default status');
    await verifyNegativeTerms(
      page,
      ['FHWA-IF-99-015', 'BS EN 1537', 'NIST Special Publication 811', 'BIPM SI Brochure'],
      '151 neg'
    );

    await main.locator('[data-testid="preset-soft-clay-short"]').click();
    approx(await main.locator('[data-testid="result-tallow"]').innerText(), 57.2, '151 preset tallow');
    approx(await main.locator('[data-testid="result-tult"]').innerText(), 114.4, '151 preset tult');
    approx(await main.locator('[data-testid="result-strands"]').innerText(), 1, '151 preset strands');
    assert((await main.locator('[data-testid="result-status"]').innerText()).includes('WARNING'), '151 preset warn');

    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: () => Promise.reject(new Error('denied')) },
        configurable: true,
      });
    });
    await main.locator('[data-testid="btn-copy"]').click();
    assert(!(await main.locator('[data-testid="btn-copy"]').innerText()).includes('Copied'), '151 clipboard reject');

    const [dl151] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv151 = await readDownloadText(dl151);
    assertAscii(csv151, '151 csv');
    assert(csv151.includes('"Allowable Design Tension T_allow","57.1770","kN"'), '151 csv tallow');

    await main.locator('[data-testid="input-db"]').fill('150mm');
    assert.strictEqual((await main.locator('[data-testid="result-tallow"]').innerText()).trim(), '—', '151 invalid suffix');
    await main.locator('[data-testid="input-db"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-tallow"]').innerText()).trim(), '—', '151 empty');
    await assertNoNan(main, '151-invalid');
    console.log('[PASS] 151 ground-anchor-capacity-calculator');

    // =========================================================================
    // 152. grounding-grid-calculator
    // Default: rho=100, L=40, W=30, h=0.8, Lt=380
    //   area = 1200 m2, req = sqrt(1200/pi) = 19.54 m, density = 380/1200 = 0.317 m/m2
    //   Rg = 100*(1/380 + (1/sqrt(24000))*(1 + 1/(1 + 0.8*sqrt(20/1200)))) = 1.4937 ohm -> 1.49
    // Preset dense-grid: rho=50, L=50, W=40, h=0.8, Lt=900
    //   area = 2000 m2, req = 25.23 m, density = 0.450, Rg = 0.5370 ohm -> 0.54 (WITHIN 1.0 OHM TARGET)
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/grounding-grid-calculator`, '[data-testid="input-rho"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '152-default');

    approx(await main.locator('[data-testid="result-rg"]').innerText(), 1.49, '152 default rg');
    approx(await main.locator('[data-testid="result-area"]').innerText(), 1200, '152 default area');
    approx(await main.locator('[data-testid="result-req"]').innerText(), 19.54, '152 default req');
    approx(await main.locator('[data-testid="result-density"]').innerText(), 0.317, '152 default density');
    assert((await main.locator('[data-testid="result-status"]').innerText()).includes('EXCEEDS 1.0 OHM'), '152 default status');
    await verifyNegativeTerms(
      page,
      ['IEEE Std 80', 'IEEE 80', 'NFPA 70', 'IEC 60364', 'IEC 60909', 'IEEE Std 1584', 'IPC-2221', 'IPC-2152'],
      '152 neg'
    );

    const [dl152Def] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv152Def = await readDownloadText(dl152Def);
    assertAscii(csv152Def, '152 csv def');
    assert(csv152Def.includes('"Ground Grid Resistance R_g","1.4937","ohm"'), '152 csv def precise rg');

    await main.locator('[data-testid="preset-dense-grid"]').click();
    approx(await main.locator('[data-testid="result-rg"]').innerText(), 0.54, '152 dense rg');
    approx(await main.locator('[data-testid="result-area"]').innerText(), 2000, '152 dense area');
    assert((await main.locator('[data-testid="result-status"]').innerText()).includes('WITHIN 1.0 OHM'), '152 dense pass');

    await main.locator('[data-testid="input-lt"]').fill('0');
    assert.strictEqual((await main.locator('[data-testid="result-rg"]').innerText()).trim(), '—', '152 lt=0');
    await main.locator('[data-testid="input-lt"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-rg"]').innerText()).trim(), '—', '152 empty');
    await assertNoNan(main, '152-invalid');
    console.log('[PASS] 152 grounding-grid-calculator');

    // =========================================================================
    // 153. gyroscope-precession-calculator
    // Default: n=3000 RPM, I=0.02 kg-m2, T=0.5 Nm
    //   ws = 100*pi = 314.1593 rad/s, H = 6.2832 N-m-s
    //   Op = 0.5 / (0.02*100*pi) = 0.079577 rad/s = 4.559 deg/s = 0.7599 RPM
    // Preset high-torque (1500, 0.05, 1.2):
    //   H = 7.8540, Op = 0.152789 rad/s = 8.754 deg/s = 1.4592 RPM
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/gyroscope-precession-calculator`, '[data-testid="input-spin"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '153-default');

    approx(await main.locator('[data-testid="result-op-rad"]').innerText(), 0.079577, '153 default op rad');
    approx(await main.locator('[data-testid="result-op-deg"]').innerText(), 4.559, '153 default op deg');
    approx(await main.locator('[data-testid="result-op-rpm"]').innerText(), 0.7599, '153 default op rpm');
    approx(await main.locator('[data-testid="result-momentum"]').innerText(), 6.2832, '153 default H');
    await verifyNegativeTerms(page, ['NIST Special Publication 811', 'BIPM SI Brochure', 'ASME Y14.5'], '153 neg');

    await main.locator('[data-testid="preset-high-torque"]').click();
    approx(await main.locator('[data-testid="result-op-rad"]').innerText(), 0.152789, '153 preset op rad');
    approx(await main.locator('[data-testid="result-op-deg"]').innerText(), 8.754, '153 preset op deg');
    approx(await main.locator('[data-testid="result-momentum"]').innerText(), 7.854, '153 preset H');

    const [dl153] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv153 = await readDownloadText(dl153);
    assertAscii(csv153, '153 csv');
    assert(csv153.includes('"Precession Angular Velocity Omega_p","0.152789","rad/s"'), '153 csv op');

    await main.locator('[data-testid="input-spin"]').fill('0');
    assert.strictEqual((await main.locator('[data-testid="result-op-rad"]').innerText()).trim(), '—', '153 spin=0');
    await main.locator('[data-testid="input-spin"]').fill('abc');
    assert.strictEqual((await main.locator('[data-testid="result-op-rad"]').innerText()).trim(), '—', '153 abc');
    await assertNoNan(main, '153-invalid');
    console.log('[PASS] 153 gyroscope-precession-calculator');

    // =========================================================================
    // 154. gyroscopic-couple-calculator
    // Default: I=0.5, ns=3000 RPM, np=60 RPM, span=0.4 m
    //   ws = 314.16 rad/s, wp = 6.283 rad/s
    //   C = 0.5*100*pi*2*pi = 100*pi^2 = 986.96 Nm, Fb = 986.96044/0.4 = 2467.40 N
    // Preset marine-stabilizer (4.0, 1800, 15, 0.8):
    //   C = 4*60*pi*0.5*pi = 1184.35 Nm, Fb = 1480.44 N
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/gyroscopic-couple-calculator`, '[data-testid="input-inertia"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '154-default');

    approx(await main.locator('[data-testid="result-couple"]').innerText(), 986.96, '154 default couple');
    approx(await main.locator('[data-testid="result-bearing-force"]').innerText(), 2467.4, '154 default Fb');
    approx(await main.locator('[data-testid="result-ws"]').innerText(), 314.16, '154 default ws');
    approx(await main.locator('[data-testid="result-wp"]').innerText(), 6.283, '154 default wp');
    await verifyNegativeTerms(page, ['NIST Special Publication 811', 'BIPM SI Brochure', 'ASME Y14.5'], '154 neg');

    await main.locator('[data-testid="preset-marine-stabilizer"]').click();
    approx(await main.locator('[data-testid="result-couple"]').innerText(), 1184.35, '154 preset couple');
    approx(await main.locator('[data-testid="result-bearing-force"]').innerText(), 1480.44, '154 preset Fb');

    const [dl154] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv154 = await readDownloadText(dl154);
    assertAscii(csv154, '154 csv');
    assert(csv154.includes('"Gyroscopic Couple C","1184.3525","Nm"'), '154 csv couple');

    await main.locator('[data-testid="input-inertia"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-couple"]').innerText()).trim(), '—', '154 empty');
    await assertNoNan(main, '154-invalid');
    console.log('[PASS] 154 gyroscopic-couple-calculator');

    // =========================================================================
    // 155. hardness-converter
    // Default (HRC=45): HB=427.0, HV=460.0, HRC=45.0, HRB=115.0, HLD=677.0
    // Preset hrc60 (HRC=60): HB=601.0, HV=746.0, HRC=60.0, HRB=—, HLD=776.0
    // Preset hrb88 (HRB=88): HB=175.0, HV=174.0, HRC=9.0, HRB=88.0, HLD=449.0
    // Interpolated HRC=26 (mid 25..27): HB=253.5, HV=254.0, HRB=101.5, HLD=534.5
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/hardness-converter`, '[data-testid="input-value"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '155-default');

    approx(await main.locator('[data-testid="result-hrc"]').innerText(), 45.0, '155 default hrc');
    approx(await main.locator('[data-testid="result-hv"]').innerText(), 460.0, '155 default hv');
    approx(await main.locator('[data-testid="result-hb"]').innerText(), 427.0, '155 default hb');
    approx(await main.locator('[data-testid="result-hrb"]').innerText(), 115.0, '155 default hrb');
    approx(await main.locator('[data-testid="result-hld"]').innerText(), 677.0, '155 default hld');
    await verifyNegativeTerms(
      page,
      ['BPVC', 'EN 13906', 'ASTM E8', 'ISO 6892-1', 'FKM Analytical', '3.45'],
      '155 neg'
    );

    await main.locator('[data-testid="preset-hrc60"]').click();
    approx(await main.locator('[data-testid="result-hv"]').innerText(), 746.0, '155 hrc60 hv');
    approx(await main.locator('[data-testid="result-hb"]').innerText(), 601.0, '155 hrc60 hb');
    assert.strictEqual((await main.locator('[data-testid="result-hrb"]').innerText()).trim(), '—', '155 hrc60 hrb N/A');

    await main.locator('[data-testid="preset-hrb88"]').click();
    approx(await main.locator('[data-testid="result-hb"]').innerText(), 175.0, '155 hrb88 hb');
    approx(await main.locator('[data-testid="result-hv"]').innerText(), 174.0, '155 hrb88 hv');
    approx(await main.locator('[data-testid="result-hrc"]').innerText(), 9.0, '155 hrb88 hrc');

    await main.locator('[data-testid="btn-scale-hrc"]').click();
    await main.locator('[data-testid="input-value"]').fill('26');
    approx(await main.locator('[data-testid="result-hb"]').innerText(), 253.5, '155 interp 26 hrc->hb');
    approx(await main.locator('[data-testid="result-hv"]').innerText(), 254.0, '155 interp 26 hrc->hv');

    const [dl155] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv155 = await readDownloadText(dl155);
    assertAscii(csv155, '155 csv');
    assert(csv155.includes('"Brinell (HB)","253.50","HB"'), '155 csv hb');

    await main.locator('[data-testid="input-value"]').fill('80');
    assert.strictEqual((await main.locator('[data-testid="result-hv"]').innerText()).trim(), '—', '155 out-of-range 80');
    assert(await main.locator('[data-testid="validation-error"]').isVisible(), '155 range warning visible');
    await main.locator('[data-testid="input-value"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-hv"]').innerText()).trim(), '—', '155 empty');
    await assertNoNan(main, '155-invalid');
    console.log('[PASS] 155 hardness-converter');

    console.log('BATCH 31 ALL 5 TOOLS PASSED');
  } finally {
    await browser.close();
  }
})();
