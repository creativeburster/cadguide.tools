// Batch 37 E2E Master Script: Tools 181-185
// 181. iso-2768-general-tolerances-reference
// 182. iso-286-limits-fits-reference
// 183. iso-metric-thread-reference
// 184. keyway-stress-calculator
// 185. k-factor-calculator

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

const BANNED_B37_TERMS = [
  'ISO 273',
  'ISO 965',
  '4H-8g',
  '6H/6g',
  'H8/g7',
  'DIN 6885',
  'ISO 773',
  'ASME B106.1M',
  'DIN 6935',
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

  // 181. iso-2768-general-tolerances-reference
  {
    const label = '181 iso-2768-general-tolerances-reference';
    await openToolPage(page, `${BASE_URL}/toolbox/iso-2768-general-tolerances-reference`, '[data-testid="input-dim"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B37_TERMS, label);

    approx(await main.locator('[data-testid="result-linear"]').innerText(), 0.2, `${label} def linear`);
    approx(await main.locator('[data-testid="result-flatness"]').innerText(), 0.1, `${label} def flat`);
    approx(await main.locator('[data-testid="result-perp"]').innerText(), 0.4, `${label} def perp`);
    assert.strictEqual((await main.locator('[data-testid="result-angular"]').innerText()).trim(), '0 deg 30 min', `${label} def ang`);

    await main.locator('[data-testid="preset-precision-5f"]').click();
    approx(await main.locator('[data-testid="result-linear"]').innerText(), 0.05, `${label} 5f linear`);
    approx(await main.locator('[data-testid="result-flatness"]').innerText(), 0.02, `${label} 5f flat`);
    approx(await main.locator('[data-testid="result-perp"]').innerText(), 0.2, `${label} 5f perp`);

    await main.locator('[data-testid="preset-welded-600c"]').click();
    approx(await main.locator('[data-testid="result-linear"]').innerText(), 2.0, `${label} 600c linear`);
    approx(await main.locator('[data-testid="result-flatness"]').innerText(), 1.2, `${label} 600c flat`);
    approx(await main.locator('[data-testid="result-perp"]').innerText(), 1.5, `${label} 600c perp`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('ISO_2768_1_Linear,> 6 to 30 mm,0.1,0.2,0.5,1'), `${label} csv 6-30`);

    await main.locator('[data-testid="input-dim"]').fill('0.2');
    assert.strictEqual((await main.locator('[data-testid="result-linear"]').innerText()).trim(), '—', `${label} <0.5 dash`);
    await main.locator('[data-testid="input-dim"]').fill('abc');
    assert.strictEqual((await main.locator('[data-testid="result-linear"]').innerText()).trim(), '—', `${label} invalid dash`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-linear"]').innerText(), 0.2, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 182. iso-286-limits-fits-reference
  {
    const label = '182 iso-286-limits-fits-reference';
    await openToolPage(page, `${BASE_URL}/toolbox/iso-286-limits-fits-reference`, '[data-testid="input-dim"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B37_TERMS, label);

    approx(await main.locator('[data-testid="result-it7"]').innerText(), 25, `${label} def IT7`);
    approx(await main.locator('[data-testid="result-it6"]').innerText(), 16, `${label} def IT6`);
    approx(await main.locator('[data-testid="result-it5"]').innerText(), 11, `${label} def IT5`);
    approx(await main.locator('[data-testid="result-fit-count"]').innerText(), 10, `${label} def fits`);

    await main.locator('[data-testid="preset-sliding-h7g6"]').click();
    approx(await main.locator('[data-testid="result-fit-count"]').innerText(), 1, `${label} h7g6 count`);
    assert((await main.innerText()).includes('H7/g6'), `${label} shows H7/g6`);

    await main.locator('[data-testid="preset-small-3mm"]').click();
    approx(await main.locator('[data-testid="result-it7"]').innerText(), 10, `${label} 2.5mm IT7`);
    approx(await main.locator('[data-testid="result-it6"]').innerText(), 6, `${label} 2.5mm IT6`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('PREFERRED_FIT,H7/g6,G7/h6,clearance'), `${label} csv H7/g6`);
    assert(csv.includes('IT_GRADE_UM,0 to 3 mm,4,6,10,14,25,40,60'), `${label} csv 0-3`);

    await main.locator('[data-testid="input-dim"]').fill('4000');
    assert.strictEqual((await main.locator('[data-testid="result-it7"]').innerText()).trim(), '—', `${label} >3150 dash`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-it7"]').innerText(), 25, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 183. iso-metric-thread-reference
  {
    const label = '183 iso-metric-thread-reference';
    await openToolPage(page, `${BASE_URL}/toolbox/iso-metric-thread-reference`, '[data-testid="input-search"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B37_TERMS, label);

    approx(await main.locator('[data-testid="result-count"]').innerText(), 44, `${label} total 44`);

    await main.locator('[data-testid="preset-m10-coarse"]').click();
    assert.strictEqual((await main.locator('[data-testid="result-top-thread"]').innerText()).trim(), 'M10x1.5', `${label} M10x1.5`);
    approx(await main.locator('[data-testid="result-top-drill"]').innerText(), 8.5, `${label} M10 drill`);

    await main.locator('[data-testid="preset-m12-fine"]').click();
    assert.strictEqual((await main.locator('[data-testid="result-top-thread"]').innerText()).trim(), 'M12x1.25', `${label} M12x1.25`);
    approx(await main.locator('[data-testid="result-top-drill"]').innerText(), 10.8, `${label} M12 fine drill`);

    await main.locator('[data-testid="input-search"]').fill('no-such-size');
    approx(await main.locator('[data-testid="result-count"]').innerText(), 0, `${label} empty filter`);
    assert.strictEqual((await main.locator('[data-testid="result-top-thread"]').innerText()).trim(), '—', `${label} empty top dash`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-count"]').innerText(), 44, `${label} reset`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('M8x1.25,Coarse,8,1.25,6.80'), `${label} csv M8x1.25`);

    await assertNoNan(main, label);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 184. keyway-stress-calculator
  {
    const label = '184 keyway-stress-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/keyway-stress-calculator`, '[data-testid="input-torque"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B37_TERMS, label);

    approx(await main.locator('[data-testid="result-force"]').innerText(), 12500, `${label} def force`);
    approx(await main.locator('[data-testid="result-shear"]').innerText(), 20.833333, `${label} def shear`);
    approx(await main.locator('[data-testid="result-bearing"]').innerText(), 62.5, `${label} def bearing`);
    approx(await main.locator('[data-testid="result-sf-shear"]').innerText(), 9.97056, `${label} def sf shear`);
    approx(await main.locator('[data-testid="result-sf-bearing"]').innerText(), 5.76, `${label} def sf bearing`);

    await main.locator('[data-testid="preset-80mm-1800nm"]').click();
    approx(await main.locator('[data-testid="result-force"]').innerText(), 45000, `${label} 80mm force`);
    approx(await main.locator('[data-testid="result-shear"]').innerText(), 22.727273, `${label} 80mm shear`);
    approx(await main.locator('[data-testid="result-bearing"]').innerText(), 71.428571, `${label} 80mm bearing`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('shear_stress_mpa,22.7273,MPa'), `${label} csv shear`);

    await main.locator('[data-testid="input-dia"]').fill('0');
    assert.strictEqual((await main.locator('[data-testid="result-shear"]').innerText()).trim(), '—', `${label} zero dia`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-shear"]').innerText(), 20.833333, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 185. k-factor-calculator
  {
    const label = '185 k-factor-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/k-factor-calculator`, '[data-testid="input-thickness"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B37_TERMS, label);

    approx(await main.locator('[data-testid="result-flat-length"]').innerText(), 96.523893, `${label} def L`);
    approx(await main.locator('[data-testid="result-ba"]').innerText(), 4.523893, `${label} def ba`);
    approx(await main.locator('[data-testid="result-bd"]').innerText(), 3.476107, `${label} def bd`);
    approx(await main.locator('[data-testid="result-os"]').innerText(), 4.0, `${label} def os`);

    await main.locator('[data-testid="preset-ss-15mm"]').click();
    approx(await main.locator('[data-testid="result-flat-length"]').innerText(), 97.036947, `${label} ss15 L`);
    approx(await main.locator('[data-testid="result-ba"]').innerText(), 4.036947, `${label} ss15 ba`);
    approx(await main.locator('[data-testid="result-bd"]').innerText(), 2.963053, `${label} ss15 bd`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('flat_pattern_length,97.0369,mm'), `${label} csv flat`);

    await main.locator('[data-testid="input-angle"]').fill('190');
    assert.strictEqual((await main.locator('[data-testid="result-flat-length"]').innerText()).trim(), '—', `${label} angle >= 180`);
    await main.locator('[data-testid="input-thickness"]').fill('abc');
    assert.strictEqual((await main.locator('[data-testid="result-ba"]').innerText()).trim(), '—', `${label} invalid T`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-flat-length"]').innerText(), 96.523893, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join(' | ')}`);
  assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join(' | ')}`);
  assert.strictEqual(failedRequests.length, 0, `HTTP >=400 requests: ${failedRequests.join(' | ')}`);

  await browser.close();
  console.log('ALL BATCH 37 E2E ASSERTIONS PASSED');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
