// Batch 28 E2E Master Script: Tools 136-140
// 136. gcode-quick-reference-sheet
// 137. gdt-symbol-reference-guide
// 138. gear-force-calculator
// 139. gear-module-calculator
// 140. gear-module-calculator-2

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
    // 136. gcode-quick-reference-sheet
    // Verified LinuxCNC: 41 G-codes + 14 M-codes = 55 items
    // Excludes G09, G44, Fanuc/Haas/Siemens, Group 00..14, ISO 286-1, DIN 6935
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/gcode-quick-reference-sheet`, '[data-testid="input-search"]');
    let main = page.getByRole('main').last();
    await assertNoNan(main, '136-default');

    assert.strictEqual((await main.locator('[data-testid="result-count"]').innerText()).trim(), '55', '136 total 55 codes');
    assert((await main.locator('[data-testid="code-card-G0"]').isVisible()), '136 G0 visible');
    assert((await main.locator('[data-testid="code-card-M3"]').isVisible()), '136 M3 visible');
    await verifyNegativeTerms(
      page,
      ['G44', 'G09', 'Group 08', 'Group 01', 'Fanuc', 'Haas', 'Siemens', 'ISO 286-1', 'DIN 6935'],
      '136 neg'
    );

    await main.locator('[data-testid="input-search"]').fill('G00');
    assert((await main.locator('[data-testid="code-card-G0"]').isVisible()), '136 leading-zero search G00->G0');
    await main.locator('[data-testid="input-search"]').fill('');

    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: () => Promise.reject(new Error('denied')) },
        configurable: true,
      });
    });
    await main.locator('[data-testid="btn-copy"]').click();
    assert(!(await main.locator('[data-testid="btn-copy"]').innerText()).includes('Copied'), '136 clipboard reject');

    const [dl136] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv136 = await readDownloadText(dl136);
    assertAscii(csv136, '136 csv');
    assert(csv136.includes('"G0","Coordinated Motion at Rapid Rate"'), '136 csv G0');
    assert(!csv136.includes('G44') && !csv136.includes('G09'), '136 csv no G44/G09');
    console.log('[PASS] 136 gcode-quick-reference-sheet');

    // =========================================================================
    // 137. gdt-symbol-reference-guide
    // Default: 12 active ASME Y14.5-2018 characteristics
    // Toggle: 14 total including Removed in ASME Y14.5-2018 (Concentricity, Symmetry)
    // Excludes deprecated circled-S, ISO 286-1, DIN 6935, ISO 2768
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/gdt-symbol-reference-guide`, '[data-testid="input-search"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '137-default');

    assert.strictEqual((await main.locator('[data-testid="result-count"]').innerText()).trim(), '12', '137 default 12 active');
    assert((await main.locator('[data-testid="gdt-card-runout"]').isVisible()), '137 Runout visible');
    await verifyNegativeTerms(
      page,
      ['\u24C8', 'ASME B4.1', 'ISO 286-1', 'DIN 6935', 'ISO 2768'],
      '137 neg'
    );

    await main.locator('[data-testid="toggle-removed-2018"]').click();
    assert.strictEqual((await main.locator('[data-testid="result-count"]').innerText()).trim(), '14', '137 +2 removed total 14');
    assert((await main.locator('[data-testid="gdt-card-concentricity"]').isVisible()), '137 Concentricity shown');

    const [dl137] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv137 = await readDownloadText(dl137);
    assertAscii(csv137, '137 csv');
    assert(csv137.includes('"Concentricity"') && csv137.includes('Removed in ASME Y14.5-2018'), '137 csv 2018 note');

    await main.locator('[data-testid="cat-orientation"]').click();
    assert.strictEqual((await main.locator('[data-testid="result-count"]').innerText()).trim(), '3', '137 orientation=3');
    console.log('[PASS] 137 gdt-symbol-reference-guide');

    // =========================================================================
    // 138. gear-force-calculator
    // Default (helical): T=200 N*m, d=100 mm, alpha_n=20 deg, beta=15 deg
    //   Ft=4000.00 N, Fr=1507.24 N, Fa=1071.80 N, Fn=4406.87 N, alpha_t=20.65 deg
    // Spur (beta=0): Fa=0.00 N, Fr=1455.88 N
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/gear-force-calculator`, '[data-testid="input-torque"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '138-default');

    approx(await main.locator('[data-testid="result-ft"]').innerText(), 4000.0, '138 default Ft');
    approx(await main.locator('[data-testid="result-fr"]').innerText(), 1507.24, '138 default Fr');
    approx(await main.locator('[data-testid="result-fa"]').innerText(), 1071.8, '138 default Fa');
    approx(await main.locator('[data-testid="result-fn"]').innerText(), 4406.87, '138 default Fn');
    approx(await main.locator('[data-testid="result-alpha-t"]').innerText(), 20.65, '138 default alpha_t');
    await verifyNegativeTerms(page, ['ISO 4183', 'ISO 606', 'ASME B29.1', 'ISO 3408'], '138 neg');

    await main.locator('[data-testid="preset-spur"]').click();
    approx(await main.locator('[data-testid="result-fa"]').innerText(), 0.0, '138 spur Fa');
    approx(await main.locator('[data-testid="result-fr"]').innerText(), 1455.88, '138 spur Fr');

    const [dl138] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv138 = await readDownloadText(dl138);
    assertAscii(csv138, '138 csv');
    assert(csv138.includes('"Radial Separating Force Fr","1455.88","N"'), '138 csv Fr');

    await main.locator('[data-testid="input-dia"]').fill('0');
    assert.strictEqual((await main.locator('[data-testid="result-ft"]').innerText()).trim(), '—', '138 zero dia');
    await assertNoNan(main, '138-empty');
    console.log('[PASS] 138 gear-force-calculator');

    // =========================================================================
    // 139. gear-module-calculator
    // Default (module mode): d=48 mm, z1=24, z2=36, alpha=20 deg
    //   m=2.0000, a=60.0000, da=52.0000, df=43.0000, p=6.2832, db=45.1052
    // Solve pitchDiameter: m=2.5, z1=30 -> d=75.0000 mm
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/gear-module-calculator`, '[data-testid="input-pitch-dia"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '139-default');

    approx(await main.locator('[data-testid="result-module"]').innerText(), 2.0, '139 default m');
    approx(await main.locator('[data-testid="result-center"]').innerText(), 60.0, '139 default a');
    approx(await main.locator('[data-testid="result-tip"]').innerText(), 52.0, '139 default da');
    approx(await main.locator('[data-testid="result-root"]').innerText(), 43.0, '139 default df');
    approx(await main.locator('[data-testid="result-pitch"]').innerText(), 6.2832, '139 default p');
    approx(await main.locator('[data-testid="result-base"]').innerText(), 45.1052, '139 default db');
    await verifyNegativeTerms(page, ['DIN 880', 'DIN 780', 'dinv 780', 'ISO 54', 'ISO 4183', 'ISO 606', 'ISO 3408'], '139 neg');

    await main.locator('[data-testid="mode-pitchDiameter"]').click();
    await main.locator('[data-testid="input-module"]').fill('2.5');
    await main.locator('[data-testid="input-teeth"]').fill('30');
    approx(await main.locator('[data-testid="result-pitch-dia"]').innerText(), 75.0, '139 solve d=75');

    const [dl139] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv139 = await readDownloadText(dl139);
    assertAscii(csv139, '139 csv');
    assert(csv139.includes('"Pitch Diameter d = m*z1","75.0000","mm"'), '139 csv d');

    await main.locator('[data-testid="input-module"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-pitch-dia"]').innerText()).trim(), '—', '139 empty');
    assert.strictEqual(await main.locator('[data-testid="gear-svg"]').count(), 0, '139 no SVG when invalid');
    await assertNoNan(main, '139-empty');
    console.log('[PASS] 139 gear-module-calculator');

    // =========================================================================
    // 140. gear-module-calculator-2
    // Default: d=60 mm, z=20, alpha=20 deg
    //   m=3.0000, p=9.4248, Pd=8.4667, da=66.0000, df=52.5000, db=56.3816
    // Modified (d=100, z=25): m=4.0000, Pd=6.3500
    // =========================================================================
    await openToolPage(page, `${BASE_URL}/toolbox/gear-module-calculator-2`, '[data-testid="input-dia"]');
    main = page.getByRole('main').last();
    await assertNoNan(main, '140-default');

    approx(await main.locator('[data-testid="result-module"]').innerText(), 3.0, '140 default m');
    approx(await main.locator('[data-testid="result-circular"]').innerText(), 9.4248, '140 default p');
    approx(await main.locator('[data-testid="result-dp"]').innerText(), 8.4667, '140 default Pd');
    approx(await main.locator('[data-testid="result-tip"]').innerText(), 66.0, '140 default da');
    approx(await main.locator('[data-testid="result-root"]').innerText(), 52.5, '140 default df');
    approx(await main.locator('[data-testid="result-base"]').innerText(), 56.3816, '140 default db');
    await verifyNegativeTerms(page, ['ISO 4183', 'ISO 606', 'ASME B29.1', 'ISO 3408'], '140 neg');

    await main.locator('[data-testid="preset-m4-25t"]').click();
    approx(await main.locator('[data-testid="result-module"]').innerText(), 4.0, '140 m4-25t m');
    approx(await main.locator('[data-testid="result-dp"]').innerText(), 6.35, '140 m4-25t Pd');

    const [dl140] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv140 = await readDownloadText(dl140);
    assertAscii(csv140, '140 csv');
    assert(csv140.includes('"Diametral Pitch Pd","6.3500","1/in"'), '140 csv Pd');

    await main.locator('[data-testid="input-teeth"]').fill('0');
    assert.strictEqual((await main.locator('[data-testid="result-module"]').innerText()).trim(), '—', '140 zero teeth');
    await assertNoNan(main, '140-empty');
    console.log('[PASS] 140 gear-module-calculator-2');
  } catch (err) {
    console.error('[FAIL]', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
