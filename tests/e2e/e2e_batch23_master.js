// Batch 23 E2E Master Script: Tools 111-115
// 111. embodied-carbon-calculator
// 112. energy-unit-converter
// 113. engineering-unit-converter
// 114. euler-bernoulli-beam-calculator
// 115. excavation-volume-calculator

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
  assert(/^[\x00-\x7F]*$/.test(text), `${label}: non-ASCII characters detected`);
}

async function readDownloadText(download) {
  const p = await download.path();
  return fs.readFileSync(p, 'utf8');
}

async function assertNoNan(mainLoc, label) {
  const txt = await mainLoc.innerText();
  assert(!/\bNaN\b|\bInfinity\b|\bundefined\b/.test(txt), `${label}: found NaN/Infinity/undefined in main`);
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

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  try {
    // =========================================================================
    // 111. embodied-carbon-calculator
    // Hand calc (default):
    //   850*320 + 85*1400 + 45*1800 + 650*65 = 272000 + 119000 + 81000 + 42250 = 514250 kg = 514.25 tCO2e
    //   intensity = 514250 / 2500 = 205.70 kgCO2e/m2
    //   concreteShare = 272000 / 514250 * 100 = 52.8926% -> 52.89
    // SCM preset (concEf=190, rebarEf=950, steelEf=1200, glazingEf=55):
    //   850*190 + 85*950 + 45*1200 + 650*55 = 161500 + 80750 + 54000 + 35750 = 332000 kg = 332.00 tCO2e
    //   intensity = 332000 / 2500 = 132.80 kgCO2e/m2
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/embodied-carbon-calculator`, '[data-testid="input-gfa"]');
    await page.waitForSelector('[data-testid="result-total-tonnes"]');
    let main = page.getByRole('main').last();
    await assertNoNan(main, '111-default');

    approx(await main.locator('[data-testid="result-total-tonnes"]').innerText(), 514.25, '111 default total tCO2e');
    approx(await main.locator('[data-testid="result-total-kg"]').innerText(), 514250, '111 default total kgCO2e');
    approx(await main.locator('[data-testid="result-intensity"]').innerText(), 205.7, '111 default intensity');
    approx(await main.locator('[data-testid="result-concrete-tonnes"]').innerText(), 272.0, '111 default concrete t');
    approx(await main.locator('[data-testid="result-concrete-share"]').innerText(), 52.89, '111 default concrete share');

    // Negative assertion for removed unverified standards
    const text111 = await main.innerText();
    for (const bad of ['EN 15978', 'RICS', 'RIBA 2030', 'ACI 318', 'Eurocode 2', 'ADA 2010']) {
      assert(!text111.includes(bad), `111: should not contain removed reference "${bad}"`);
    }

    // Preset branch check
    await main.locator('[data-testid="preset-low-carbon-scm"]').click();
    approx(await main.locator('[data-testid="result-total-tonnes"]').innerText(), 332.0, '111 scm preset total');
    approx(await main.locator('[data-testid="result-intensity"]').innerText(), 132.8, '111 scm preset intensity');

    // Clipboard reject must not show Copied
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: () => Promise.reject(new Error('denied')) },
        configurable: true,
      });
    });
    await main.locator('[data-testid="btn-copy"]').click();
    assert(!(await main.locator('[data-testid="btn-copy"]').innerText()).includes('Copied'), '111: clipboard reject showed Copied');

    // CSV download check
    const [dl111] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download"]').click(),
    ]);
    const csv111 = await readDownloadText(dl111);
    assertAscii(csv111, '111 csv');
    assert(csv111.includes('"Total Embodied Carbon","332.00","tCO2e"'), '111 csv total mismatch');

    // Empty / invalid input
    await main.locator('[data-testid="input-gfa"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-total-tonnes"]').innerText()).trim(), '—', '111 empty gfa');
    await assertNoNan(main, '111-empty');
    console.log('[PASS] 111 embodied-carbon-calculator');

    // =========================================================================
    // 112. energy-unit-converter
    // Hand calc (default): 1 kWh = 3.6e6 J -> BTU_IT = 3.6e6 / 1055.05585262 = 3412.141633 BTU
    // Modified: 2 MJ -> kcal = 2e6 / 4184 = 477.99713 kcal
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/energy-unit-converter`, '[data-testid="input-value"]');
    await page.waitForSelector('[data-testid="result-converted"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '112-default');

    approx(await main.locator('[data-testid="result-converted"]').innerText(), 3412.1416, '112 default kWh->BTU');
    approx(await main.locator('[data-testid="result-joules"]').innerText(), 3600000, '112 default joules');

    // Options check
    const opts112 = await main.locator('[data-testid="select-from"] option').allInnerTexts();
    assert(opts112.some((o) => o.includes('Electronvolt')) && opts112.some((o) => o.includes('Foot-Pound')), '112 missing expected options');

    // Removed standards check
    const text112 = await main.innerText();
    for (const bad of ['ISO 80000-1', 'BIPM SI Brochure']) {
      assert(!text112.includes(bad), `112: should not contain "${bad}"`);
    }

    // Swap test: 1 BTU -> kWh = 1055.05585262 / 3.6e6 = 0.000293071
    await main.locator('[data-testid="btn-swap"]').click();
    approx(await main.locator('[data-testid="result-converted"]').innerText(), 0.000293, '112 swap BTU->kWh');

    // Modified conversion: 2 MJ -> kcal
    await main.locator('[data-testid="input-value"]').fill('2');
    await main.locator('[data-testid="select-from"]').selectOption('mj');
    await main.locator('[data-testid="select-to"]').selectOption('kcal');
    approx(await main.locator('[data-testid="result-converted"]').innerText(), 477.9971, '112 2 MJ->kcal');

    const [dl112] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download"]').click(),
    ]);
    const csv112 = await readDownloadText(dl112);
    assertAscii(csv112, '112 csv');
    assert(csv112.includes('"SI Base Equivalent","2.0000e+6","J"') || csv112.includes('2000000'), '112 csv joules');

    await main.locator('[data-testid="input-value"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-converted"]').innerText()).trim(), '—', '112 empty input');
    await assertNoNan(main, '112-empty');
    console.log('[PASS] 112 energy-unit-converter');

    // =========================================================================
    // 113. engineering-unit-converter
    // Hand calc (default): 1000 mm -> ft = 1.0 / 0.3048 = 3.280840 ft
    // Modified (force): 1000 N -> lbf = 1000 / 4.4482216152605 = 224.808943 lbf
    // Temperature error check: -300 deg C (< absolute zero) -> '—'
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/engineering-unit-converter`, '[data-testid="input-value"]');
    await page.waitForSelector('[data-testid="result-converted"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '113-default');

    approx(await main.locator('[data-testid="result-converted"]').innerText(), 3.2808, '113 default 1000mm->ft');
    approx(await main.locator('[data-testid="matrix-m"]').innerText(), 1.0, '113 matrix m');

    await main.locator('[data-testid="cat-force"]').click();
    await main.locator('[data-testid="input-value"]').fill('1000');
    await main.locator('[data-testid="select-from"]').selectOption('n');
    await main.locator('[data-testid="select-to"]').selectOption('lbf');
    approx(await main.locator('[data-testid="result-converted"]').innerText(), 224.8089, '113 1000N->lbf');

    const [dl113] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download"]').click(),
    ]);
    const csv113 = await readDownloadText(dl113);
    assertAscii(csv113, '113 csv');
    assert(csv113.includes('"Category","force"'), '113 csv category');

    // Below absolute zero check
    await main.locator('[data-testid="cat-temperature"]').click();
    await main.locator('[data-testid="input-value"]').fill('-300');
    assert.strictEqual((await main.locator('[data-testid="result-converted"]').innerText()).trim(), '—', '113 temp < 0K');
    await assertNoNan(main, '113-invalid-temp');
    console.log('[PASS] 113 engineering-unit-converter');

    // =========================================================================
    // 114. euler-bernoulli-beam-calculator
    // Hand calc (default): P=20 kN, a=2 m, L=6 m, E=200 GPa, I=5000 cm4, x=3 m
    //   EI = 200e9 * 5000e-8 = 1e7 N*m2
    //   b = 4 m -> RA = 20*4/6 = 13.3333 kN, RB = 20*2/6 = 6.6667 kN, Mmax = 20*2*4/6 = 26.6667 kN*m
    //   x=3 > a=2 (xRev=3): y = 20000*2*3*(36-4-9)/(6*6*1e7)*1000 = 120000*23/3.6e8*1000 = 7.66667 mm
    //   theta = -20000*2*(36-4-27)/3.6e8 = -200000/3.6e8 = -0.00055556 rad
    //   ymax = 20000*2*(32^1.5)/(9*sqrt(3)*6*1e7)*1000 = 7.74159 mm
    // Symmetric branch (a=3, x=3): theta(3) = 0 rad, y(3)=ymax = P*L^3/(48*EI)*1000 = 20000*216/(48*1e7)*1000 = 9.0000 mm
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/euler-bernoulli-beam-calculator`, '[data-testid="input-p"]');
    await page.waitForSelector('[data-testid="result-deflection"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '114-default');

    approx(await main.locator('[data-testid="result-deflection"]').innerText(), 7.6667, '114 default y(3)');
    approx(await main.locator('[data-testid="result-ymax"]').innerText(), 7.7416, '114 default ymax');
    approx(await main.locator('[data-testid="result-slope"]').innerText(), -0.000556, '114 default slope');
    approx(await main.locator('[data-testid="result-ra"]').innerText(), 13.333, '114 default RA');
    approx(await main.locator('[data-testid="result-rb"]').innerText(), 6.667, '114 default RB');
    approx(await main.locator('[data-testid="result-mmax"]').innerText(), 26.667, '114 default Mmax');

    const text114 = await main.innerText();
    for (const bad of ['AWS D1.1', 'ISO 5817', 'ASME B30', 'AISC 360-22']) {
      assert(!text114.includes(bad), `114: should not contain "${bad}"`);
    }

    await main.locator('[data-testid="preset-midspan"]').click();
    approx(await main.locator('[data-testid="result-deflection"]').innerText(), 9.0, '114 midspan y');
    approx(await main.locator('[data-testid="result-ymax"]').innerText(), 9.0, '114 midspan ymax');
    approx(await main.locator('[data-testid="result-slope"]').innerText(), 0.0, '114 midspan slope=0');

    const [dl114] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download"]').click(),
    ]);
    const csv114 = await readDownloadText(dl114);
    assertAscii(csv114, '114 csv');
    assert(csv114.includes('"Deflection at x","9.0000","mm"'), '114 csv midspan');

    // Invalid boundary a >= L
    await main.locator('[data-testid="input-a"]').fill('7');
    assert.strictEqual((await main.locator('[data-testid="result-deflection"]').innerText()).trim(), '—', '114 invalid a>=L');
    await assertNoNan(main, '114-invalid');
    console.log('[PASS] 114 euler-bernoulli-beam-calculator');

    // =========================================================================
    // 115. excavation-volume-calculator
    // Hand calc (default): L=50, W=1, D=2, slope=0, swell=25%, cap=15, cost=120
    //   V_bank = 100.00 m3, V_loose = 125.00 m3, loads = ceil(125/15) = 9, cost = 1080.00 USD
    // Sloped preset (slope=0.5): topL=52, topW=3 -> A_t=156, A_b=50, A_m=51*2=102
    //   V_bank = (2/6)*(50 + 156 + 408) = 204.6667 m3, V_loose = 255.8333 m3, loads=18, cost=2160.00 USD
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/excavation-volume-calculator`, '[data-testid="input-length"]');
    await page.waitForSelector('[data-testid="result-bank-volume"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '115-default');

    approx(await main.locator('[data-testid="result-bank-volume"]').innerText(), 100.0, '115 default bank vol');
    approx(await main.locator('[data-testid="result-loose-volume"]').innerText(), 125.0, '115 default loose vol');
    approx(await main.locator('[data-testid="result-loads"]').innerText(), 9, '115 default loads');
    approx(await main.locator('[data-testid="result-cost"]').innerText(), 1080.0, '115 default cost');

    const text115 = await main.innerText();
    for (const bad of ['Eurocode 7', 'FHWA', 'ASTM D1557', 'AASHTO Green Book']) {
      assert(!text115.includes(bad), `115: should not contain "${bad}"`);
    }

    await main.locator('[data-testid="preset-sloped-pit"]').click();
    approx(await main.locator('[data-testid="result-bank-volume"]').innerText(), 204.67, '115 sloped bank vol');
    approx(await main.locator('[data-testid="result-loose-volume"]').innerText(), 255.83, '115 sloped loose vol');
    approx(await main.locator('[data-testid="result-loads"]').innerText(), 18, '115 sloped loads');
    approx(await main.locator('[data-testid="result-cost"]').innerText(), 2160.0, '115 sloped cost');

    const [dl115] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download"]').click(),
    ]);
    const csv115 = await readDownloadText(dl115);
    assertAscii(csv115, '115 csv');
    assert(csv115.includes('"Bank Excavation Volume","204.67","m3"'), '115 csv bank vol');

    await main.locator('[data-testid="input-depth"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-bank-volume"]').innerText()).trim(), '—', '115 empty depth');
    await assertNoNan(main, '115-empty');
    console.log('[PASS] 115 excavation-volume-calculator');
  } catch (err) {
    console.error('[FAIL]', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
