// Batch 30 E2E Master Script: Tools 146-150
// 146. glazing-wind-load-calculator
// 147. gradient-grade-calculator
// 148. grease-trap-sizing-calculator
// 149. grinding-ratio-calculator
// 150. grinding-wheel-speed-calculator

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
    // 146. glazing-wind-load-calculator
    // Default (Navier m,n=1..19): 1500x2400x10 mm, q=1.8 kPa, E=70000, nu=0.22, L/175
    //   w0=12.35 mm, sigma_max=20.45 MPa, w_allow=8.57 mm (DEFLECTION EXCEEDS LIMIT)
    // Preset 12mm: w0=7.15 mm, sigma_max=14.20 MPa (WITHIN LIMIT)
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/glazing-wind-load-calculator`, '[data-testid="input-width"]');
    let main = page.getByRole('main').last();
    await assertNoNan(main, '146-default');

    approx(await main.locator('[data-testid="result-deflection"]').innerText(), 12.35, '146 default w0');
    approx(await main.locator('[data-testid="result-stress"]').innerText(), 20.45, '146 default stress');
    approx(await main.locator('[data-testid="result-allowable"]').innerText(), 8.57, '146 default L/175');
    assert((await main.locator('[data-testid="result-defl-status"]').innerText()).includes('EXCEEDS'), '146 default exceeds');
    await verifyNegativeTerms(page, ['ASTM E1300', 'ACI 318-19', 'Eurocode 2', 'IBC 2024', 'ASCE 7-22', 'ADA 2010'], '146 neg');

    await main.locator('[data-testid="preset-12mm-l175"]').click();
    approx(await main.locator('[data-testid="result-deflection"]').innerText(), 7.15, '146 12mm w0');
    approx(await main.locator('[data-testid="result-stress"]').innerText(), 14.2, '146 12mm stress');
    assert((await main.locator('[data-testid="result-defl-status"]').innerText()).includes('WITHIN LIMIT'), '146 12mm pass');

    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: () => Promise.reject(new Error('denied')) },
        configurable: true,
      });
    });
    await main.locator('[data-testid="btn-copy"]').click();
    assert(!(await main.locator('[data-testid="btn-copy"]').innerText()).includes('Copied'), '146 clipboard reject');

    const [dl146] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv146 = await readDownloadText(dl146);
    assertAscii(csv146, '146 csv');
    assert(csv146.includes('"Center Deflection w0 (Navier)","7.15","mm"'), '146 csv w0');

    await main.locator('[data-testid="input-nu"]').fill('0.50'); // invalid nu >= 0.5
    assert.strictEqual((await main.locator('[data-testid="result-deflection"]').innerText()).trim(), '—', '146 invalid nu>=0.5');
    await assertNoNan(main, '146-invalid');
    console.log('[PASS] 146 glazing-wind-load-calculator');

    // =========================================================================
    // 147. gradient-grade-calculator
    // Default: run=100 m, rise=5 m -> grade=5.000%, perMille=50.00 mm/m, angle=2.8624 deg, slopeDist=100.1249 m, ratio=1 : 20.00
    // Modified (rise=12): grade=12.000%, angle=6.8428 deg, slopeDist=100.7174 m
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/gradient-grade-calculator`, '[data-testid="input-run"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '147-default');

    approx(await main.locator('[data-testid="result-grade"]').innerText(), 5.0, '147 default grade');
    approx(await main.locator('[data-testid="result-permille"]').innerText(), 50.0, '147 default perMille');
    approx(await main.locator('[data-testid="result-angle"]').innerText(), 2.8624, '147 default angle');
    approx(await main.locator('[data-testid="result-distance"]').innerText(), 100.1249, '147 default dist');
    assert.strictEqual((await main.locator('[data-testid="result-ratio"]').innerText()).trim(), '1 : 20.00', '147 default ratio');
    await verifyNegativeTerms(page, ['NIST Special Publication 811', 'ISO 80000-1', 'BIPM SI Brochure', 'ASME Y14.5'], '147 neg');

    await main.locator('[data-testid="input-rise"]').fill('12');
    approx(await main.locator('[data-testid="result-grade"]').innerText(), 12.0, '147 rise=12 grade');
    approx(await main.locator('[data-testid="result-angle"]').innerText(), 6.8428, '147 rise=12 angle');
    approx(await main.locator('[data-testid="result-distance"]').innerText(), 100.7174, '147 rise=12 dist');

    const [dl147] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv147 = await readDownloadText(dl147);
    assertAscii(csv147, '147 csv');
    assert(csv147.includes('"Gradient Percentage","12.000","%"'), '147 csv grade');

    await main.locator('[data-testid="input-run"]').fill('0');
    assert.strictEqual((await main.locator('[data-testid="result-grade"]').innerText()).trim(), '—', '147 zero run');
    await assertNoNan(main, '147-invalid');
    console.log('[PASS] 147 gradient-grade-calculator');

    // =========================================================================
    // 148. grease-trap-sizing-calculator
    // Default: 3x 18x18x12 in, fill=0.75, drain=1.0 min
    //   V_gal=50.49 gal, V_load=37.87 gal (143.35 L), Q_calc=37.87 GPM -> 50 GPM tier, 100 lbs
    // 2.0 min drain: Q_calc=18.94 GPM -> 20 GPM tier, 40 lbs
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/grease-trap-sizing-calculator`, '[data-testid="input-compartments"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '148-default');

    approx(await main.locator('[data-testid="result-vgal"]').innerText(), 50.49, '148 default V_gal');
    approx(await main.locator('[data-testid="result-vload"]').innerText(), 37.87, '148 default V_load');
    approx(await main.locator('[data-testid="result-vliters"]').innerText(), 143.35, '148 default V_L');
    approx(await main.locator('[data-testid="result-qcalc"]').innerText(), 37.87, '148 default Q_calc');
    approx(await main.locator('[data-testid="result-rated"]').innerText(), 50, '148 default rated 50 GPM');
    approx(await main.locator('[data-testid="result-grease"]').innerText(), 100, '148 default 100 lbs');
    await verifyNegativeTerms(
      page,
      ['PDI-G101', 'PDI G-101', 'ASME A112', 'WEF Manual', 'Metcalf & Eddy', 'ASCE/EWRI', 'International Plumbing Code'],
      '148 neg'
    );

    await main.locator('[data-testid="btn-drain-2min"]').click();
    approx(await main.locator('[data-testid="result-qcalc"]').innerText(), 18.94, '148 2min Q_calc');
    approx(await main.locator('[data-testid="result-rated"]').innerText(), 20, '148 2min rated 20 GPM');
    approx(await main.locator('[data-testid="result-grease"]').innerText(), 40, '148 2min 40 lbs');

    const [dl148] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv148 = await readDownloadText(dl148);
    assertAscii(csv148, '148 csv');
    assert(csv148.includes('"Recommended Commercial Rating","20","GPM"'), '148 csv tier');

    await main.locator('[data-testid="input-fill"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-rated"]').innerText()).trim(), '—', '148 empty fill');
    await assertNoNan(main, '148-empty');
    console.log('[PASS] 148 grease-trap-sizing-calculator');

    // =========================================================================
    // 149. grinding-ratio-calculator
    // Default: Vw=50000 mm3, Vs=500 mm3, P_net=2.5 kW, Qw=1200 mm3/min
    //   G=100.00, Qw_s=20.00 mm3/s, u=125.00 J/mm3, E_total=6250.00 kJ
    // Modified (Vs=1000): G=50.00
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/grinding-ratio-calculator`, '[data-testid="input-vw"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '149-default');

    approx(await main.locator('[data-testid="result-gratio"]').innerText(), 100.0, '149 default G');
    approx(await main.locator('[data-testid="result-u"]').innerText(), 125.0, '149 default u');
    approx(await main.locator('[data-testid="result-qws"]').innerText(), 20.0, '149 default Qw_s');
    approx(await main.locator('[data-testid="result-energy"]').innerText(), 6250.0, '149 default E_total');
    await verifyNegativeTerms(page, ['ISO 286-1', 'ASME B4.1', 'ASME Y14.5-2018', 'DIN 6935', 'ISO 2768', 'Malkin'], '149 neg');

    await main.locator('[data-testid="input-vs"]').fill('1000');
    approx(await main.locator('[data-testid="result-gratio"]').innerText(), 50.0, '149 vs=1000 G');

    const [dl149] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv149 = await readDownloadText(dl149);
    assertAscii(csv149, '149 csv');
    assert(csv149.includes('"Volumetric Grinding Ratio G = Vw/Vs","50.00","-"'), '149 csv G');

    await main.locator('[data-testid="input-vs"]').fill('0');
    assert.strictEqual((await main.locator('[data-testid="result-gratio"]').innerText()).trim(), '—', '149 zero Vs');
    await assertNoNan(main, '149-empty');
    console.log('[PASS] 149 grinding-ratio-calculator');

    // =========================================================================
    // 150. grinding-wheel-speed-calculator
    // Default: ds=200 mm, n=3000 RPM, ae=0.02 mm, vw=12000 mm/min, bd=20 mm
    //   vs=31.416 m/s, sfpm=6184.24 SFPM, Qw=4800.00 mm3/min,
    //   Qw'=4.000 mm3/(mm*s) (240.00 mm3/(mm*min)), qs=157.08
    // Modified (width=40 mm): Qw=9600.00 mm3/min, Qw' remains 4.000 mm3/(mm*s)!
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/grinding-wheel-speed-calculator`, '[data-testid="input-dia"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '150-default');

    approx(await main.locator('[data-testid="result-vs"]').innerText(), 31.416, '150 default vs');
    approx(await main.locator('[data-testid="result-sfpm"]').innerText(), 6184.24, '150 default sfpm');
    approx(await main.locator('[data-testid="result-qw"]').innerText(), 4800.0, '150 default Qw');
    approx(await main.locator('[data-testid="result-qw-prime"]').innerText(), 4.0, "150 default Qw'/s");
    approx(await main.locator('[data-testid="result-qw-prime-min"]').innerText(), 240.0, "150 default Qw'/min");
    approx(await main.locator('[data-testid="result-ratio"]').innerText(), 157.08, '150 default qs');
    await verifyNegativeTerms(page, ['ISO 286-1', 'ASME B4.1', 'ASME Y14.5-2018', 'DIN 6935', 'ISO 2768'], '150 neg');

    await main.locator('[data-testid="input-width"]').fill('40');
    approx(await main.locator('[data-testid="result-qw"]').innerText(), 9600.0, '150 bd=40 Qw');
    approx(await main.locator('[data-testid="result-qw-prime"]').innerText(), 4.0, "150 bd=40 Qw' invariant");

    const [dl150] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv150 = await readDownloadText(dl150);
    assertAscii(csv150, '150 csv');
    assert(csv150.includes('"Specific MRR Qw_prime (per s)","4.000","mm3/(mm*s)"'), "150 csv Qw'");

    await main.locator('[data-testid="input-dia"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-vs"]').innerText()).trim(), '—', '150 empty dia');
    await assertNoNan(main, '150-empty');
    console.log('[PASS] 150 grinding-wheel-speed-calculator');
  } catch (err) {
    console.error('[FAIL]', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
