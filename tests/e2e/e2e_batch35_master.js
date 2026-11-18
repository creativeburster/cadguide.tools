/* eslint-disable @typescript-eslint/no-require-imports */
// Batch 35 E2E Master Script: Tools 171-175
// 171. ifc-element-quantity-calculator
// 172. ifc-entity-counter
// 173. impact-force-calculator
// 174. imperial-thread-reference
// 175. inductor-reactance-calculator

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
    const mains = document.querySelectorAll('main'); const mainEl = mains[mains.length - 1];
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

const BANNED_B35_TERMS = [
  'ISO/ASTM 52900',
  'BPVC',
  'EN 13906',
  'FKM Analytical',
  'VDI 2230',
  'ISO 898-1',
  'ISO 273',
  'ASME B18.2.8',
  'ASHRAE',
  'SMACNA',
  'ISO 6946',
  'Clearance Holes',
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

  // 171. ifc-element-quantity-calculator
  {
    const label = '171 ifc-element-quantity-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/ifc-element-quantity-calculator`, '[data-testid="input-dim1"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B35_TERMS, label);

    approx(await main.locator('[data-testid="result-volume"]').innerText(), 14.4, `${label} default vol`);
    approx(await main.locator('[data-testid="result-formwork"]').innerText(), 144, `${label} default area`);
    approx(await main.locator('[data-testid="result-concrete-mass"]').innerText(), 34560, `${label} default conc`);
    approx(await main.locator('[data-testid="result-rebar-mass"]').innerText(), 1584, `${label} default rebar`);

    await main.locator('[data-testid="preset-rc-column"]').click();
    approx(await main.locator('[data-testid="result-volume"]').innerText(), 3.84, `${label} col vol`);
    approx(await main.locator('[data-testid="result-formwork"]').innerText(), 38.4, `${label} col area`);
    approx(await main.locator('[data-testid="result-concrete-mass"]').innerText(), 9216, `${label} col conc`);
    approx(await main.locator('[data-testid="result-rebar-mass"]').innerText(), 576, `${label} col rebar`);

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download"]').click(),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('total_volume,3.840000,m3'), `${label} csv total_volume`);

    await main.locator('[data-testid="input-qty"]').fill('2.5');
    assert.strictEqual((await main.locator('[data-testid="result-volume"]').innerText()).trim(), '—', `${label} float qty invalid`);
    assert(await main.locator('[data-testid="validation-error"]').isVisible(), `${label} validation error`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-volume"]').innerText(), 14.4, `${label} reset vol`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 172. ifc-entity-counter
  {
    const label = '172 ifc-entity-counter';
    await openToolPage(page, `${BASE_URL}/toolbox/ifc-entity-counter`, '[data-testid="input-min-count"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B35_TERMS, label);

    approx(await main.locator('[data-testid="result-total"]').innerText(), 12, `${label} default total`);
    approx(await main.locator('[data-testid="result-unique"]').innerText(), 8, `${label} default unique`);
    assert.strictEqual((await main.locator('[data-testid="result-spatial"]').innerText()).trim(), '4/4', `${label} default spatial`);
    assert.strictEqual((await main.locator('[data-testid="result-schema"]').innerText()).trim(), 'IFC4', `${label} default schema`);

    await main.locator('[data-testid="preset-structural-ifc"]').click();
    approx(await main.locator('[data-testid="result-total"]').innerText(), 9, `${label} struct total`);
    approx(await main.locator('[data-testid="result-unique"]').innerText(), 7, `${label} struct unique`);
    assert.strictEqual((await main.locator('[data-testid="result-schema"]').innerText()).trim(), 'IFC4X3_ADD2', `${label} struct schema`);

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download"]').click(),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('IFCBEAM,2,IFC4X3_ADD2'), `${label} csv ifcbeam`);

    await main.locator('[data-testid="input-min-count"]').fill('abc');
    assert.strictEqual((await main.locator('[data-testid="result-total"]').innerText()).trim(), '—', `${label} invalid minCount`);
    await main.locator('[data-testid="input-min-count"]').fill('1');
    await main.locator('[data-testid="input-ifc-text"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-total"]').innerText()).trim(), '—', `${label} empty ifc`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-total"]').innerText(), 12, `${label} reset total`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 173. impact-force-calculator
  {
    const label = '173 impact-force-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/impact-force-calculator`, '[data-testid="input-mass"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B35_TERMS, label);

    approx(await main.locator('[data-testid="result-force-kn"]').innerText(), 40.207265, `${label} default force kn`);
    approx(await main.locator('[data-testid="result-force-n"]').innerText(), 40207.265, `${label} default force n`);
    approx(await main.locator('[data-testid="result-velocity"]').innerText(), 6.263114, `${label} default vel`);
    approx(await main.locator('[data-testid="result-energy"]').innerText(), 1961.33, `${label} default energy`);
    approx(await main.locator('[data-testid="result-decel-g"]').innerText(), 40, `${label} default decel`);

    await main.locator('[data-testid="preset-package-foam"]').click();
    approx(await main.locator('[data-testid="result-force-kn"]').innerText(), 4.560092, `${label} foam force kn`);
    approx(await main.locator('[data-testid="result-velocity"]').innerText(), 4.851387, `${label} foam vel`);
    approx(await main.locator('[data-testid="result-energy"]').innerText(), 176.5197, `${label} foam energy`);

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download"]').click(),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('average_impact_force_kn,4.5601,kN'), `${label} csv force_kn`);

    await main.locator('[data-testid="input-stop-dist"]').fill('0');
    assert.strictEqual((await main.locator('[data-testid="result-force-kn"]').innerText()).trim(), '—', `${label} zero d`);
    await main.locator('[data-testid="input-mass"]').fill('abc');
    assert.strictEqual((await main.locator('[data-testid="result-energy"]').innerText()).trim(), '—', `${label} invalid mass`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-force-kn"]').innerText(), 40.207265, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 174. imperial-thread-reference
  {
    const label = '174 imperial-thread-reference';
    await openToolPage(page, `${BASE_URL}/toolbox/imperial-thread-reference`, '[data-testid="input-search"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B35_TERMS, label);

    approx(await main.locator('[data-testid="result-count"]').innerText(), 47, `${label} total rows`);

    await main.locator('[data-testid="preset-12-28"]').click();
    approx(await main.locator('[data-testid="result-count"]').innerText(), 1, `${label} #12-28 count`);
    assert.strictEqual((await main.locator('[data-testid="result-top-designation"]').innerText()).trim(), '#12-28', `${label} #12-28 match`);
    assert.strictEqual((await main.locator('[data-testid="result-top-drill"]').innerText()).trim(), '#14', `${label} #12-28 drill`);
    approx(await main.locator('[data-testid="result-top-major-mm"]').innerText(), 5.4864, `${label} #12-28 major mm`);

    await main.locator('[data-testid="preset-0-80"]').click();
    assert.strictEqual((await main.locator('[data-testid="result-top-designation"]').innerText()).trim(), '#0-80', `${label} #0-80 match`);
    assert.strictEqual((await main.locator('[data-testid="result-top-drill"]').innerText()).trim(), '3/64"', `${label} #0-80 drill`);

    await main.locator('[data-testid="filter-unc"]').click();
    approx(await main.locator('[data-testid="result-count"]').innerText(), 0, `${label} #0 has no UNC`);
    assert.strictEqual((await main.locator('[data-testid="result-top-designation"]').innerText()).trim(), '—', `${label} empty match dash`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-count"]').innerText(), 47, `${label} reset count`);

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download"]').click(),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('#12-28,UNF,0.2160,5.4864,28,0.035714,0.9071,#14,.182'), `${label} csv #12-28`);
    assert(csv.includes('1/4-20,UNC,0.2500,6.3500,20,0.050000,1.2700,#7,.201'), `${label} csv 1/4-20`);

    await assertNoNan(main, label);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 175. inductor-reactance-calculator
  {
    const label = '175 inductor-reactance-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/inductor-reactance-calculator`, '[data-testid="input-inductance"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B35_TERMS, label);

    approx(await main.locator('[data-testid="result-xl"]').innerText(), 62.831853, `${label} default xl`);
    approx(await main.locator('[data-testid="result-z"]').innerText(), 62.881569, `${label} default z`);
    approx(await main.locator('[data-testid="result-phase"]').innerText(), 87.721475, `${label} default phase`);
    approx(await main.locator('[data-testid="result-tau"]').innerText(), 4, `${label} default tau`);
    approx(await main.locator('[data-testid="result-q"]').innerText(), 25.132741, `${label} default q`);
    approx(await main.locator('[data-testid="result-fr"]').innerText(), 159.154943, `${label} default fr`);
    approx(await main.locator('[data-testid="result-current"]').innerText(), 190.834932, `${label} default current`);

    await main.locator('[data-testid="preset-buck-100uh"]').click();
    approx(await main.locator('[data-testid="result-xl"]').innerText(), 157.079633, `${label} buck xl`);
    approx(await main.locator('[data-testid="result-fr"]').innerText(), 3183.098862, `${label} buck fr`);

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download"]').click(),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('inductive_reactance_xl,157.0796,Ohm'), `${label} csv xl`);

    await main.locator('[data-testid="input-frequency"]').fill('-10');
    assert.strictEqual((await main.locator('[data-testid="result-xl"]').innerText()).trim(), '—', `${label} neg freq`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-xl"]').innerText(), 62.831853, `${label} reset xl`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join(' | ')}`);
  assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join(' | ')}`);
  assert.strictEqual(failedRequests.length, 0, `HTTP >=400 requests: ${failedRequests.join(' | ')}`);

  await browser.close();
  console.log('ALL BATCH 35 E2E ASSERTIONS PASSED');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
