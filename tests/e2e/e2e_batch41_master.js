/* eslint-disable @typescript-eslint/no-require-imports */
// Batch 41 E2E Master Script: Tools #201-#205 (skipped mathcad-shortcuts-sheet, matlab-shortcuts-sheet, microstation-shortcuts-sheet)
// 201. material-properties-reference (moved from e2e_batch40_master.js)
// 202. milling-mrr-calculator
// 203. missing-font-shx-resolver
// 204. missing-regapp-cleaner-batch
// 205. mohr-circle-calculator
// Also verifies carry-over check on mat-foundation-stress-calculator Engineering ToolBox density link.

const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

function approx(actualStr, expected, label) {
  const cleaned = String(actualStr).replace(/,/g, '').trim();
  const actual = Number(cleaned);
  assert(!Number.isNaN(actual) && Number.isFinite(actual), `${label}: expected finite number, got "${actualStr}"`);
  const tol = Math.max(1e-6, Math.abs(expected) * 0.001);
  assert(Math.abs(actual - expected) <= tol, `${label}: expected ${expected} (+/-${tol}), got ${actual}`);
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

const BANNED_B41_TERMS = [
  'ISO 286-1',
  'ASME Y14.5',
  'DIN 6935',
  'ISO 2768',
  'NIST Special Publication 811',
  'ISO 80000-1',
  'BIPM SI Brochure',
  'NFPA 70',
  'IEC 60364',
  'IEEE Std 1584',
  'IPC-2221',
  'ASME Boiler',
  'EN 13906',
  'ASTM E8',
  'FKM Analytical',
  'shrink drawing size 80%',
  'Simulate Expected Size Reduction',
  'AutoCAD 2027',
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

  // Carry-over link verification on #199 mat-foundation-stress-calculator
  {
    const label = '199-link mat-foundation-stress-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/mat-foundation-stress-calculator`, '[data-testid="input-load"]');
    const main = page.getByRole('main').last();
    const link = main.locator('a[href="https://www.engineeringtoolbox.com/concrete-properties-d_1223.html"]');
    assert.strictEqual(await link.count(), 1, `${label}: missing Engineering ToolBox link`);
    console.log(`[PASS] ${label}`);
  }

  // 201. material-properties-reference
  {
    const label = '201 material-properties-reference';
    await openToolPage(page, `${BASE_URL}/toolbox/material-properties-reference`, '[data-testid="input-search"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B41_TERMS, label);

    approx(await main.locator('[data-testid="result-count"]').innerText(), 14, `${label} total 14 grades`);
    await main.locator('[data-testid="preset-6061"]').click();
    approx(await main.locator('[data-testid="result-count"]').innerText(), 1, `${label} 6061 count`);
    assert.strictEqual((await main.locator('[data-testid="result-top-grade"]').innerText()).trim(), 'Aluminum 6061', `${label} 6061 grade`);
    approx(await main.locator('[data-testid="result-top-density"]').innerText(), 2.7, `${label} 6061 rho`);
    approx(await main.locator('[data-testid="result-top-modulus"]').innerText(), 68, `${label} 6061 E`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-count"]').innerText(), 14, `${label} reset`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('ASTM A36 Structural Steel,steel,7.8,250,400-550,200,0.26,11.7'), `${label} csv A36`);
    assert(csv.includes('Titanium Ti-6Al-4V,titanium,4.429,880,900-950,104-113,0.31-0.37,8.6'), `${label} csv Ti64`);
    await assertNoNan(main, label);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 202. milling-mrr-calculator
  {
    const label = '202 milling-mrr-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/milling-mrr-calculator`, '[data-testid="input-d"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B41_TERMS, label);

    // Hand calc default: D=10, Z=3, Vc=500, fz=0.10, ae=8, ap=2, L=100, kc=800
    // n = 500000 / (pi * 10) = 15915.4943 RPM
    // vf = 15915.4943 * 0.10 * 3 = 4774.6483 mm/min
    // MRR = 8 * 2 * 4774.6483 / 1000 = 76.3944 cm3/min
    // tc = 60 * 100 / 4774.6483 = 1.2566 s
    // Pc = 8 * 2 * 4774.6483 * 800 / 60e6 = 1.01859 kW
    approx(await main.locator('[data-testid="result-rpm"]').innerText(), 15915.4943, `${label} def rpm`);
    approx(await main.locator('[data-testid="result-feed"]').innerText(), 4774.6483, `${label} def vf`);
    approx(await main.locator('[data-testid="result-mrr"]').innerText(), 76.3944, `${label} def mrr`);
    approx(await main.locator('[data-testid="result-time"]').innerText(), 1.2566, `${label} def tc`);
    approx(await main.locator('[data-testid="result-power"]').innerText(), 1.01859, `${label} def pc`);

    // Preset steel-pocket: D=12, Z=4, Vc=160, fz=0.06, ae=6, ap=1.5, L=150, kc=2100
    // n = 160000 / (pi * 12) = 4244.1318 RPM
    // vf = 4244.1318 * 0.06 * 4 = 1018.5916 mm/min
    // MRR = 6 * 1.5 * 1018.5916 / 1000 = 9.1673 cm3/min
    // tc = 60 * 150 / 1018.5916 = 8.8357 s
    // Pc = 6 * 1.5 * 1018.5916 * 2100 / 60e6 = 0.32086 kW
    await main.locator('[data-testid="preset-steel-pocket"]').click();
    approx(await main.locator('[data-testid="result-rpm"]').innerText(), 4244.1318, `${label} steel rpm`);
    approx(await main.locator('[data-testid="result-feed"]').innerText(), 1018.5916, `${label} steel vf`);
    approx(await main.locator('[data-testid="result-mrr"]').innerText(), 9.1673, `${label} steel mrr`);
    approx(await main.locator('[data-testid="result-time"]').innerText(), 8.8357, `${label} steel tc`);
    approx(await main.locator('[data-testid="result-power"]').innerText(), 0.32086, `${label} steel pc`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('mrr_q,9.1673,cm3/min'), `${label} csv mrr`);
    assert(csv.includes('net_cutting_power_pc,0.32086,kW'), `${label} csv pc`);

    // Boundary check: ae > D must reject cleanly
    await main.locator('[data-testid="input-ae"]').fill('15');
    assert.strictEqual((await main.locator('[data-testid="result-mrr"]').innerText()).trim(), '—', `${label} ae>D dash`);
    assert((await main.locator('[data-testid="badge-status"]').innerText()).toUpperCase().includes('AE > D'), `${label} ae>D badge`);
    await main.locator('[data-testid="input-d"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-mrr"]').innerText()).trim(), '—', `${label} empty dash`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-mrr"]').innerText(), 76.3944, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 203. missing-font-shx-resolver
  {
    const label = '203 missing-font-shx-resolver';
    await openToolPage(page, `${BASE_URL}/toolbox/missing-font-shx-resolver`, '[data-testid="input-fontalt"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B41_TERMS, label);

    approx(await main.locator('[data-testid="result-mapped-count"]').innerText(), 4, `${label} def mapped count`);
    approx(await main.locator('[data-testid="result-catalog-count"]').innerText(), 7, `${label} def catalog count`);
    assert.strictEqual((await main.locator('[data-testid="result-fontalt"]').innerText()).trim(), 'simplex.shx', `${label} def fontalt`);

    await main.locator('[data-testid="preset-romanc-sample"]').click();
    approx(await main.locator('[data-testid="result-mapped-count"]').innerText(), 1, `${label} romanc mapped`);
    approx(await main.locator('[data-testid="result-catalog-count"]').innerText(), 1, `${label} romanc catalog`);
    const fmpPreview = await main.locator('[data-testid="preview-fmp"]').innerText();
    assert(fmpPreview.includes('romanc.shx;times.ttf'), `${label} romanc preview`);

    const [dlFmp] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const fmpTxt = await readDownloadText(dlFmp);
    assertAscii(fmpTxt, `${label} fmp ascii`);
    assert(fmpTxt.includes('romanc.shx;times.ttf'), `${label} fmp download`);

    const [dlScr] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download-scr"]').click()]);
    const scrTxt = await readDownloadText(dlScr);
    assertAscii(scrTxt, `${label} scr ascii`);
    assert(scrTxt.includes('FONTALT simplex.shx'), `${label} scr download`);

    await main.locator('[data-testid="input-missing-list"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-mapped-count"]').innerText()).trim(), '—', `${label} empty list dash`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-mapped-count"]').innerText(), 4, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 204. missing-regapp-cleaner-batch
  {
    const label = '204 missing-regapp-cleaner-batch';
    await openToolPage(page, `${BASE_URL}/toolbox/missing-regapp-cleaner-batch`, '[data-testid="preset-bloated"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B41_TERMS, label);

    approx(await main.locator('[data-testid="result-appid-total"]').innerText(), 4, `${label} def total APPIDs`);
    approx(await main.locator('[data-testid="result-non-acad"]').innerText(), 3, `${label} def non-ACAD`);
    approx(await main.locator('[data-testid="result-layers"]').innerText(), 2, `${label} def layers`);
    approx(await main.locator('[data-testid="result-entities"]').innerText(), 1, `${label} def entities`);

    await main.locator('[data-testid="preset-clean"]').click();
    approx(await main.locator('[data-testid="result-appid-total"]').innerText(), 1, `${label} clean total`);
    approx(await main.locator('[data-testid="result-non-acad"]').innerText(), 0, `${label} clean non-ACAD`);
    assert((await main.locator('[data-testid="badge-status"]').innerText()).includes('CLEAN'), `${label} clean badge`);

    const [dlScr] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const scrTxt = await readDownloadText(dlScr);
    assertAscii(scrTxt, `${label} scr ascii`);
    assert(scrTxt.includes('-PURGE') && scrTxt.includes('AUDITCTL') && scrTxt.includes('AUDIT'), `${label} scr commands`);

    const [dlLisp] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download-lisp"]').click()]);
    const lispTxt = await readDownloadText(dlLisp);
    assertAscii(lispTxt, `${label} lisp ascii`);
    assert(lispTxt.includes('(command "-PURGE" "R" "*" "N")'), `${label} lisp purge R`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-non-acad"]').innerText(), 3, `${label} reset`);
    await assertNoNan(main, label);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 205. mohr-circle-calculator
  {
    const label = '205 mohr-circle-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/mohr-circle-calculator`, '[data-testid="input-sx"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B41_TERMS, label);

    // Hand calc default: sx=80, sy=20, txy=30
    // savg = 50, R = sqrt(30^2 + 30^2) = 42.426407
    // s1 = 92.4264, s2 = 7.5736, tmax = 42.4264, theta_p = 22.500, svm = 88.8819
    approx(await main.locator('[data-testid="result-s1"]').innerText(), 92.4264, `${label} def s1`);
    approx(await main.locator('[data-testid="result-s2"]').innerText(), 7.5736, `${label} def s2`);
    approx(await main.locator('[data-testid="result-tmax"]').innerText(), 42.4264, `${label} def tmax`);
    approx(await main.locator('[data-testid="result-theta"]').innerText(), 22.5, `${label} def theta`);
    approx(await main.locator('[data-testid="result-savg"]').innerText(), 50.0, `${label} def savg`);
    approx(await main.locator('[data-testid="result-vm"]').innerText(), 88.8819, `${label} def vm`);

    // Preset compression-tension: sx=-40, sy=60, txy=-25
    // savg = 10, R = sqrt((-50)^2 + (-25)^2) = sqrt(3125) = 55.9017
    // s1 = 65.9017, s2 = -45.9017, theta = 0.5*atan2(-50, -100)*180/pi = -76.7175
    await main.locator('[data-testid="preset-compression-tension"]').click();
    approx(await main.locator('[data-testid="result-s1"]').innerText(), 65.9017, `${label} comp s1`);
    approx(await main.locator('[data-testid="result-s2"]').innerText(), -45.9017, `${label} comp s2`);
    approx(await main.locator('[data-testid="result-tmax"]').innerText(), 55.9017, `${label} comp tmax`);
    approx(await main.locator('[data-testid="result-theta"]').innerText(), -76.7175, `${label} comp theta`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('principal_stress_1,65.9017,MPa'), `${label} csv s1`);
    assert(csv.includes('principal_stress_2,-45.9017,MPa'), `${label} csv s2`);

    await main.locator('[data-testid="input-sx"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-s1"]').innerText()).trim(), '—', `${label} empty dash`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-s1"]').innerText(), 92.4264, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join(' | ')}`);
  assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join(' | ')}`);
  assert.strictEqual(failedRequests.length, 0, `HTTP >=400 requests: ${failedRequests.join(' | ')}`);

  await browser.close();
  console.log('ALL BATCH 41 E2E ASSERTIONS PASSED');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
