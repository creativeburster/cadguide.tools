// Batch 36 E2E Master Script: Tools 176-180 (skipped inventor-shortcuts-sheet)
// 176. injection-clamping-force-calculator
// 177. injection-molding-clamp-calculator
// 178. insulation-r-value-calculator
// 179. insulation-thickness-calculator
// 180. involute-gear-calculator

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
    const mains = document.querySelectorAll('main');
    const mainEl = mains[mains.length - 1];
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

const BANNED_B36_TERMS = [
  'ISO 294',
  'ASTM D3641',
  'ISO 6946',
  'ASHRAE',
  'SMACNA',
  'ISO 6336',
  'AGMA 2001',
];

async function runTests() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('response', (res) => {
    if (res.status() >= 400 && !res.url().includes('favicon')) {
      failedRequests.push(`${res.status()} ${res.url()}`);
    }
  });

  // 176. injection-clamping-force-calculator
  {
    const label = '176 injection-clamping-force-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/injection-clamping-force-calculator`, '[data-testid="input-area"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B36_TERMS, label);

    approx(await main.locator('[data-testid="result-total-area"]').innerText(), 552, `${label} def area`);
    approx(await main.locator('[data-testid="result-kn"]').innerText(), 2649.6, `${label} def kn`);
    approx(await main.locator('[data-testid="result-tonnes"]').innerText(), 270.184008, `${label} def tonnes`);
    approx(await main.locator('[data-testid="result-ustons"]').innerText(), 297.826888, `${label} def ustons`);

    await main.locator('[data-testid="preset-16cav-cap"]').click();
    approx(await main.locator('[data-testid="result-total-area"]').innerText(), 351.36, `${label} 16cav area`);
    approx(await main.locator('[data-testid="result-kn"]').innerText(), 1414.224, `${label} 16cav kn`);
    approx(await main.locator('[data-testid="result-tonnes"]').innerText(), 144.210714, `${label} 16cav tonnes`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('clamping_force_kn,1414.2240,kN'), `${label} csv kn`);

    await main.locator('[data-testid="input-cavities"]').fill('2.5');
    assert.strictEqual((await main.locator('[data-testid="result-tonnes"]').innerText()).trim(), '—', `${label} float cav invalid`);
    await main.locator('[data-testid="input-safety"]').fill('0.8');
    assert.strictEqual((await main.locator('[data-testid="result-kn"]').innerText()).trim(), '—', `${label} sf < 1 invalid`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-tonnes"]').innerText(), 270.184008, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 177. injection-molding-clamp-calculator
  {
    const label = '177 injection-molding-clamp-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/injection-molding-clamp-calculator`, '[data-testid="input-dim1"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B36_TERMS, label);

    approx(await main.locator('[data-testid="result-total-area"]').innerText(), 432, `${label} def area`);
    approx(await main.locator('[data-testid="result-kn"]').innerText(), 2086.56, `${label} def kn`);
    approx(await main.locator('[data-testid="result-tonnes"]').innerText(), 212.769906, `${label} def tonnes`);
    approx(await main.locator('[data-testid="result-flow-ratio"]').innerText(), 72.727273, `${label} def ratio`);

    await main.locator('[data-testid="preset-disc-gear"]').click();
    approx(await main.locator('[data-testid="result-total-area"]').innerText(), 570.199067, `${label} disc area`);
    approx(await main.locator('[data-testid="result-tonnes"]').innerText(), 254.089819, `${label} disc tonnes`);
    approx(await main.locator('[data-testid="result-flow-ratio"]').innerText(), 13.75, `${label} disc ratio`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('shape,disc,mode'), `${label} csv disc`);

    await main.locator('[data-testid="input-wall"]').fill('abc');
    assert.strictEqual((await main.locator('[data-testid="result-flow-ratio"]').innerText()).trim(), '—', `${label} invalid wall`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-tonnes"]').innerText(), 212.769906, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 178. insulation-r-value-calculator
  {
    const label = '178 insulation-r-value-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/insulation-r-value-calculator`, '[data-testid="layer-thick-0"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B36_TERMS, label);

    approx(await main.locator('[data-testid="result-r-total"]').innerText(), 3.699221, `${label} def r`);
    approx(await main.locator('[data-testid="result-u-value"]').innerText(), 0.270327, `${label} def u`);
    approx(await main.locator('[data-testid="result-r-us"]').innerText(), 21.00515, `${label} def rus`);
    approx(await main.locator('[data-testid="result-heat-flux"]').innerText(), 5.406544, `${label} def flux`);

    await main.locator('[data-testid="preset-coldroom-panel"]').click();
    approx(await main.locator('[data-testid="result-r-total"]').innerText(), 6.420024, `${label} coldroom r`);
    approx(await main.locator('[data-testid="result-u-value"]').innerText(), 0.155763, `${label} coldroom u`);
    approx(await main.locator('[data-testid="result-heat-flux"]').innerText(), 6.542032, `${label} coldroom flux`);

    await main.locator('[data-testid="btn-add-layer"]').click();
    assert(await main.locator('[data-testid="layer-thick-3"]').isVisible(), `${label} add layer 3`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('TOTAL_R_VALUE,'), `${label} csv total_r`);

    await main.locator('[data-testid="layer-k-0"]').fill('0');
    assert.strictEqual((await main.locator('[data-testid="result-r-total"]').innerText()).trim(), '—', `${label} zero k`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-r-total"]').innerText(), 3.699221, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 179. insulation-thickness-calculator
  {
    const label = '179 insulation-thickness-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/insulation-thickness-calculator`, '[data-testid="input-tpipe"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B36_TERMS, label);

    approx(await main.locator('[data-testid="result-thickness"]').innerText(), 88.424341, `${label} def thick`);
    approx(await main.locator('[data-testid="result-outer-dia"]').innerText(), 276.848683, `${label} def od`);
    approx(await main.locator('[data-testid="result-surface-temp"]').innerText(), 28.449284, `${label} def ts`);
    approx(await main.locator('[data-testid="result-heat-loss"]').innerText(), 30.0, `${label} def q`);

    await main.locator('[data-testid="preset-chilled-50mm"]').click();
    approx(await main.locator('[data-testid="result-thickness"]').innerText(), 8.431872, `${label} chilled thick`);
    approx(await main.locator('[data-testid="result-surface-temp"]').innerText(), 22.859137, `${label} chilled ts`);
    approx(await main.locator('[data-testid="result-heat-loss"]').innerText(), 12.0, `${label} chilled q`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('required_thickness_mm,8.4319,mm'), `${label} csv thick`);

    await main.locator('[data-testid="input-tamb"]').fill('7');
    assert.strictEqual((await main.locator('[data-testid="result-thickness"]').innerText()).trim(), '—', `${label} zero dT invalid`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-thickness"]').innerText(), 88.424341, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 180. involute-gear-calculator
  {
    const label = '180 involute-gear-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/involute-gear-calculator`, '[data-testid="input-module"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B36_TERMS, label);

    approx(await main.locator('[data-testid="result-cr"]').innerText(), 1.635186, `${label} def cr`);
    approx(await main.locator('[data-testid="result-db1"]').innerText(), 37.587705, `${label} def db1`);
    approx(await main.locator('[data-testid="result-db2"]').innerText(), 75.17541, `${label} def db2`);
    approx(await main.locator('[data-testid="result-d1"]').innerText(), 40, `${label} def d1`);
    approx(await main.locator('[data-testid="result-d2"]').innerText(), 80, `${label} def d2`);
    approx(await main.locator('[data-testid="result-center"]').innerText(), 60, `${label} def center`);

    await main.locator('[data-testid="preset-m15-24-36-25deg"]').click();
    approx(await main.locator('[data-testid="result-cr"]').innerText(), 1.469222, `${label} 25deg cr`);
    approx(await main.locator('[data-testid="result-db1"]').innerText(), 32.62708, `${label} 25deg db1`);
    approx(await main.locator('[data-testid="result-center"]').innerText(), 45, `${label} 25deg center`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('transverse_contact_ratio,1.4692,ratio'), `${label} csv cr`);

    await main.locator('[data-testid="input-z1"]').fill('4');
    assert.strictEqual((await main.locator('[data-testid="result-cr"]').innerText()).trim(), '—', `${label} z1 < 6 invalid`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-cr"]').innerText(), 1.635186, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join(' | ')}`);
  assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join(' | ')}`);
  assert.strictEqual(failedRequests.length, 0, `HTTP >=400 requests: ${failedRequests.join(' | ')}`);

  await browser.close();
  console.log('ALL BATCH 36 E2E ASSERTIONS PASSED');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
