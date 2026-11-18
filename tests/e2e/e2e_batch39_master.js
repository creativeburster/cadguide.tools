/* eslint-disable @typescript-eslint/no-require-imports */
// Batch 39 E2E Master Script: Tools 191-195
// 191. lift-force-calculator
// 192. lighting-lux-calculator
// 193. lightning-protection-calculator
// 194. limits-and-fits-calculator
// 195. liquefaction-potential-calculator

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

const BANNED_B39_TERMS = ['NFPA 780', 'IEC 62305', 'rolling sphere', 'Eurocode 7', 'EN 1997', 'FHWA'];

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

  // 191. lift-force-calculator
  {
    const label = '191 lift-force-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/lift-force-calculator`, '[data-testid="input-vel"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B39_TERMS, label);

    approx(await main.locator('[data-testid="result-q"]').innerText(), 2205.0, `${label} def q`);
    approx(await main.locator('[data-testid="result-lift"]').innerText(), 28224.0, `${label} def lift`);
    approx(await main.locator('[data-testid="result-drag"]').innerText(), 2050.6476, `${label} def drag`);
    approx(await main.locator('[data-testid="result-ld"]').innerText(), 13.7635, `${label} def ld`);

    await main.locator('[data-testid="preset-uav-cruise"]').click();
    approx(await main.locator('[data-testid="result-lift"]').innerText(), 401.9531, `${label} uav lift`);
    approx(await main.locator('[data-testid="result-drag"]').innerText(), 20.1265, `${label} uav drag`);
    approx(await main.locator('[data-testid="result-ld"]').innerText(), 19.9713, `${label} uav ld`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('lift_force_n,401.953,N'), `${label} csv lift`);

    await main.locator('[data-testid="input-e"]').fill('1.2');
    assert.strictEqual((await main.locator('[data-testid="result-lift"]').innerText()).trim(), '—', `${label} e>1 invalid`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-lift"]').innerText(), 28224.0, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 192. lighting-lux-calculator
  {
    const label = '192 lighting-lux-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/lighting-lux-calculator`, '[data-testid="input-area"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B39_TERMS, label);

    approx(await main.locator('[data-testid="result-lux"]').innerText(), 414.72, `${label} def lux`);
    approx(await main.locator('[data-testid="result-lpd"]').innerText(), 6.4, `${label} def lpd`);
    approx(await main.locator('[data-testid="result-power"]').innerText(), 384, `${label} def power`);
    approx(await main.locator('[data-testid="result-efficacy"]').innerText(), 112.5, `${label} def eff`);

    await main.locator('[data-testid="preset-warehouse-400m2"]').click();
    approx(await main.locator('[data-testid="result-lux"]').innerText(), 367.2, `${label} wh lux`);
    approx(await main.locator('[data-testid="result-lpd"]').innerText(), 5.6, `${label} wh lpd`);
    approx(await main.locator('[data-testid="result-power"]').innerText(), 2240, `${label} wh power`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('maintained_illuminance_lux,367.200,lux'), `${label} csv lux`);

    await main.locator('[data-testid="input-count"]').fill('3.5');
    assert.strictEqual((await main.locator('[data-testid="result-lux"]').innerText()).trim(), '—', `${label} float N invalid`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-lux"]').innerText(), 414.72, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 193. lightning-protection-calculator
  {
    const label = '193 lightning-protection-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/lightning-protection-calculator`, '[data-testid="input-len"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B39_TERMS, label);

    approx(await main.locator('[data-testid="result-ae"]').innerText(), 24049.7776, `${label} def ae`);
    approx(await main.locator('[data-testid="result-nd"]').innerText(), 0.096199, `${label} def nd`);
    assert((await main.locator('[data-testid="result-status"]').innerText()).includes('EXCEEDS'), `${label} def exceeds`);

    await main.locator('[data-testid="preset-k1-low"]').click();
    approx(await main.locator('[data-testid="result-ae"]').innerText(), 1914.1593, `${label} k1 ae`);
    approx(await main.locator('[data-testid="result-nd"]').innerText(), 0.001914, `${label} k1 nd`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('expected_strikes_nd,0.001914,strikes/yr'), `${label} csv nd`);

    await main.locator('[data-testid="input-ng"]').fill('abc');
    assert.strictEqual((await main.locator('[data-testid="result-nd"]').innerText()).trim(), '—', `${label} invalid ng`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-nd"]').innerText(), 0.096199, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 194. limits-and-fits-calculator
  {
    const label = '194 limits-and-fits-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/limits-and-fits-calculator`, '[data-testid="input-dia"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B39_TERMS, label);

    assert.strictEqual((await main.locator('[data-testid="result-fit-type"]').innerText()).trim(), 'Clearance Fit', `${label} def type`);
    approx(await main.locator('[data-testid="result-max-clear"]').innerText(), 0.041, `${label} def max clear`);
    approx(await main.locator('[data-testid="result-min-clear"]').innerText(), 0.007, `${label} def min clear`);
    approx(await main.locator('[data-testid="result-hole-min"]').innerText(), 30.0, `${label} def hole min`);
    approx(await main.locator('[data-testid="result-hole-max"]').innerText(), 30.021, `${label} def hole max`);

    await main.locator('[data-testid="preset-50-h7p6"]').click();
    assert.strictEqual((await main.locator('[data-testid="result-fit-type"]').innerText()).trim(), 'Interference Fit', `${label} 50 p6 type`);
    approx(await main.locator('[data-testid="result-max-clear"]').innerText(), -0.001, `${label} 50 p6 max clear`);
    approx(await main.locator('[data-testid="result-min-clear"]').innerText(), -0.042, `${label} 50 p6 min clear`);

    await main.locator('[data-testid="preset-40-h7k6"]').click();
    assert.strictEqual((await main.locator('[data-testid="result-fit-type"]').innerText()).trim(), 'Transition Fit', `${label} 40 k6 type`);
    approx(await main.locator('[data-testid="result-max-clear"]').innerText(), 0.023, `${label} 40 k6 max clear`);
    approx(await main.locator('[data-testid="result-min-clear"]').innerText(), -0.018, `${label} 40 k6 min clear`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('max_clearance_mm,0.0230,mm'), `${label} csv max_clear`);

    await main.locator('[data-testid="input-dia"]').fill('3');
    assert.strictEqual((await main.locator('[data-testid="result-max-clear"]').innerText()).trim(), '—', `${label} D=3 out of range`);
    await main.locator('[data-testid="input-dia"]').fill('450');
    assert.strictEqual((await main.locator('[data-testid="result-max-clear"]').innerText()).trim(), '—', `${label} D=450 out of range`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-max-clear"]').innerText(), 0.041, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 195. liquefaction-potential-calculator
  {
    const label = '195 liquefaction-potential-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/liquefaction-potential-calculator`, '[data-testid="input-amax"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B39_TERMS, label);

    approx(await main.locator('[data-testid="result-fs"]').innerText(), 0.393433, `${label} def fs`);
    approx(await main.locator('[data-testid="result-csr"]').innerText(), 0.406824, `${label} def csr`);
    approx(await main.locator('[data-testid="result-crr"]').innerText(), 0.160058, `${label} def crr`);
    approx(await main.locator('[data-testid="result-msf"]').innerText(), 1.0, `${label} def msf`);

    await main.locator('[data-testid="preset-dense-m65"]').click();
    approx(await main.locator('[data-testid="result-fs"]').innerText(), 1.334288, `${label} dense fs`);
    approx(await main.locator('[data-testid="result-csr"]').innerText(), 0.261625, `${label} dense csr`);
    approx(await main.locator('[data-testid="result-crr"]').innerText(), 0.349083, `${label} dense crr`);
    approx(await main.locator('[data-testid="result-msf"]').innerText(), 1.442443, `${label} dense msf`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('factor_of_safety_fs,1.3343,ratio'), `${label} csv fs`);

    await main.locator('[data-testid="input-sveff"]').fill('200');
    assert.strictEqual((await main.locator('[data-testid="result-fs"]').innerText()).trim(), '—', `${label} eff > total invalid`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-fs"]').innerText(), 0.393433, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join(' | ')}`);
  assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join(' | ')}`);
  assert.strictEqual(failedRequests.length, 0, `HTTP >=400 requests: ${failedRequests.join(' | ')}`);

  await browser.close();
  console.log('ALL BATCH 39 E2E ASSERTIONS PASSED');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
