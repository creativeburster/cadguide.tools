#!/usr/bin/env node
/**
 * 🤖 CADGuide.tools 浏览器外链提交机器人 (HTTP 控制版)
 * 复用 ~/.cadguide-edge-session 持久会话（保留历史登录态）。
 * 通过 localhost HTTP API 驱动：open / form / fill / click / shot / eval / close
 */
import { chromium } from 'playwright';
import http from 'http';
import path from 'path';
import os from 'os';
import fs from 'fs';

const PORT = Number(process.argv[2] || 8791);
const SESSION_DIR = path.join(os.homedir(), '.cadguide-edge-session');
const LOG_DIR = path.join('F:', 'cadguide.tools', 'scratch', 'submit-logs');
fs.mkdirSync(LOG_DIR, { recursive: true });

const state = { context: null, page: null };

async function contextAlive() {
  if (!state.context) return false;
  try {
    await state.context.pages();
    return true;
  } catch {
    state.context = null;
    state.page = null;
    return false;
  }
}

async function ensureBrowser() {
  if (await contextAlive()) return;
  state.context = await chromium.launchPersistentContext(SESSION_DIR, {
    channel: 'msedge',
    headless: false,
    slowMo: 40,
    viewport: { width: 1380, height: 920 },
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-first-run',
      '--no-default-browser-check'
    ],
    ignoreDefaultArgs: ['--enable-automation']
  });
  state.page = state.context.pages()[0] || (await state.context.newPage());
}

function killOverlays(page) {
  return page.evaluate(() => {
    let n = 0;
    document
      .querySelectorAll(
        '[class*="cookie" i], [id*="cookie" i], [class*="consent" i], [id*="consent" i], [class*="silktide"], #silktide-wrapper, #silktide-backdrop, [aria-label*="consent" i]'
      )
      .forEach((el) => {
        const s = getComputedStyle(el);
        if (s.position === 'fixed' || s.position === 'absolute' || el.tagName === 'DIALOG') {
          el.remove();
          n++;
        }
      });
    return n;
  }).catch(() => 0);
}

async function handle(body) {
  const a = body.action;
  if (a === 'open') {
    await ensureBrowser();
    await state.page.goto(body.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await state.page.waitForTimeout(body.ms || 1800);
    await killOverlays(state.page);
    return pageState();
  }
  if (a === 'tab') {
    await ensureBrowser();
    const p = await state.context.newPage();
    state.page = p;
    await p.goto(body.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(body.ms || 2000);
    await p.bringToFront().catch(() => {});
    await killOverlays(p);
    return pageState();
  }
  if (a === 'clickXY') {
    await ensureBrowser();
    await state.page.mouse.click(Number(body.x), Number(body.y));
    await state.page.waitForTimeout(body.ms || 800);
    return { clicked: true, x: body.x, y: body.y };
  }
  if (a === 'state') return pageState();
  if (a === 'shot') {
    const file = path.join(LOG_DIR, `${body.name || 'shot'}.png`);
    await state.page.screenshot({ path: file, fullPage: body.full !== false });
    return { file };
  }
  if (a === 'form') {
    const items = await state.page.evaluate(() => {
      const vis = (e) => !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
      return [...document.querySelectorAll('input,textarea,select,button,[role="button"],a[href*="submit" i],label')]
        .filter(vis)
        .slice(0, 120)
        .map((e) => ({
          tag: e.tagName.toLowerCase(),
          type: e.type || '',
          name: e.name || '',
          id: e.id || '',
          ph: e.placeholder || '',
          label: (e.labels && e.labels[0] ? e.labels[0].innerText : '').slice(0, 100).replace(/\n/g, ' '),
          text: (e.innerText || '').slice(0, 80).replace(/\n/g, ' '),
          val: (e.value || '').slice(0, 60),
          required: !!e.required
        }));
    });
    return { url: state.page.url(), title: await state.page.title(), items };
  }
  if (a === 'fill') {
    await state.page.locator(body.selector).first().click({ force: true, timeout: 8000 });
    await state.page.locator(body.selector).first().fill('');
    await state.page.locator(body.selector).first().fill(body.value, { timeout: 8000, force: true });
    return { filled: body.selector };
  }
  if (a === 'fillMany') {
    const done = [];
    for (const it of body.items) {
      const loc = state.page.locator(it.selector).first();
      await loc.scrollIntoViewIfNeeded({ timeout: 6000 }).catch(() => {});
      await loc.click({ force: true, timeout: 8000 }).catch(() => {});
      await loc.fill('').catch(() => {});
      await loc.fill(it.value, { timeout: 8000, force: true });
      done.push(it.selector);
    }
    return { filled: done };
  }
  if (a === 'click') {
    await killOverlays(state.page);
    await state.page.locator(body.selector).first().click({ timeout: 10000, force: body.force !== false });
    await state.page.waitForTimeout(body.ms || 2500);
    return pageState();
  }
  if (a === 'clickText') {
    await killOverlays(state.page);
    await state.page.getByText(body.text, { exact: false }).first().click({ timeout: 10000 });
    await state.page.waitForTimeout(body.ms || 2500);
    return pageState();
  }
  if (a === 'eval') {
    const result = await state.page.evaluate(body.code);
    return { result };
  }
  if (a === 'waitFor') {
    await state.page.locator(body.selector).first().waitFor({ state: 'visible', timeout: body.timeout || 15000 });
    return pageState();
  }
  if (a === 'close') {
    if (state.context) await state.context.close();
    state.context = null;
    state.page = null;
    return { closed: true };
  }
  throw new Error('unknown action: ' + a);
}

async function pageState() {
  if (!state.page) return { url: null, title: null };
  return { url: state.page.url(), title: await state.page.title() };
}

const server = http.createServer(async (req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', async () => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
      const parsed = body ? JSON.parse(body) : { action: new URL(req.url, 'http://x').searchParams.get('action') || 'state' };
      let data;
      try {
        data = await handle(parsed);
      } catch (e) {
        if (/has been closed/i.test(String(e.message || e))) {
          state.context = null;
          state.page = null;
          data = await handle(parsed); // 重开浏览器并重试一次
        } else {
          throw e;
        }
      }
      res.end(JSON.stringify({ ok: true, ...data }));
    } catch (e) {
      res.end(JSON.stringify({ ok: false, error: String(e.message || e).slice(0, 400) }));
    }
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[browser-bot] listening on http://127.0.0.1:${PORT}  session=${SESSION_DIR}`);
});
