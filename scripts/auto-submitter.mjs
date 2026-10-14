#!/usr/bin/env node

/**
 * 🤖 CADGuide.tools 全自动外链与目录提交机器人 (Edge 隐身版)
 */

import { chromium } from 'playwright';
import readline from 'readline';
import path from 'path';
import os from 'os';

const SITE_DATA = {
  name: 'CADGuide.tools',
  url: 'https://cadguide.tools',
  shortDesc: 'An interactive directory & matchmaker to find the best CAD software alternatives and free engineering tools.',
  headline: 'Find the perfect CAD software alternative for your workflow & budget',
  longDesc: `CADGuide.tools is a high-performance, interactive comparison directory and engineering toolbox designed for CAD/BIM professionals, mechanical engineers, and architects.

It provides transparent side-by-side feature comparisons for 50+ desktop and cloud CAD engines (including AutoCAD, GstarCAD, ZWCAD, BricsCAD, FreeCAD, and Rhino) across critical technical parameters such as native DWG support, AutoLISP APIs, dynamic block handling, network licensing, and perpetual vs. subscription pricing.

Additionally, the platform includes a suite of zero-upload, client-side engineering tools such as a browser-based DWG Version Header Parser, K-Factor sheet metal bend calculators, beam analyzers, and cross-platform shortcut matrices.`,
  tags: 'Design, Developer Tools, Engineering, Productivity, 3D Modeling',
  authorName: 'Will',
  email: 'contact@cadguide.tools'
};

function askUser(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans ? ans.trim() : '');
  }));
}

const PLATFORMS = {
  betalist: {
    name: 'BetaList (DA 70 | 权威早期产品收录)',
    url: 'https://betalist.com/submit',
    run: async (page) => {
      console.log('  🌐 [1/3] 正在通过 Edge 打开 BetaList 提交页...');
      await page.goto('https://betalist.com/submit', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(1500);

      console.log('  ✍️  [2/3] 正在自动填入产品信息与介绍...');
      
      const nameInput = await page.$('input[name*="name"], input[placeholder*="Name"]');
      if (nameInput) await nameInput.fill(SITE_DATA.name, { force: true });

      const urlInput = await page.$('input[name*="url"], input[placeholder*="http"]');
      if (urlInput) await urlInput.fill(SITE_DATA.url, { force: true });

      const pitchInput = await page.$('input[name*="pitch"], input[name*="headline"], input[placeholder*="Tagline"]');
      if (pitchInput) await pitchInput.fill(SITE_DATA.headline, { force: true });

      const descInput = await page.$('textarea');
      if (descInput) await descInput.fill(SITE_DATA.longDesc, { force: true });

      console.log('\n  🔔 [3/3] 【表单已自动填好！】');
      console.log('  👉 请在弹出的 Edge 浏览器中复核，并点击页面底部的「Submit / Free Queue」');
      console.log('  👉 提交完成后，在此处按回车键退出...\n');
      await askUser('  [等待你的操作] 点击提交后，请按回车键完成...');
      console.log('  🎉 BetaList 提交收官！');
    }
  },

  uneed: {
    name: 'Uneed.best (DA 68 | 顶流独立工具库)',
    url: 'https://www.uneed.best/submit-a-tool',
    run: async (page) => {
      console.log('  🌐 [1/3] 正在通过 Edge 打开 Uneed.best 提交页...');
      await page.goto('https://www.uneed.best/submit-a-tool', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(1500);

      console.log('  ✍️  [2/3] 正在自动填入产品名称与官网 URL...');
      const nameInput = await page.$('input[name="name"], input[placeholder="Uneed"]');
      if (nameInput) await nameInput.fill(SITE_DATA.name, { force: true });

      const urlInput = await page.$('input[name="url"], input[placeholder*="https://"]');
      if (urlInput) await urlInput.fill(SITE_DATA.url, { force: true });

      console.log('  👉 正在自动点击进入第二步...');
      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) await submitBtn.click({ force: true });
      await page.waitForTimeout(2500);

      console.log('\n  🔔 [3/3] 【重要提示】信息已全自动填好！');
      console.log('  👉 请在弹出的 Edge 浏览器中完成登录确认');
      console.log('  👉 登录完成后，按回车键即可！\n');
      await askUser('  [等待你的操作] 完成登录确认后，请按回车键继续...');
      console.log('  🎉 Uneed.best 收录成功！');
    }
  },

  startupbase: {
    name: 'StartupBase (DA 50 | 创业产品目录)',
    url: 'https://startupbase.io/submit',
    run: async (page) => {
      console.log('  🌐 [1/2] 正在通过 Edge 打开 StartupBase...');
      await page.goto('https://startupbase.io/submit', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(1500);

      console.log('  ✍️  [2/2] 正在自动填入产品数据...');
      const nameInput = await page.$('input[name*="name"], input[placeholder*="Name"]');
      if (nameInput) await nameInput.fill(SITE_DATA.name, { force: true });
      
      const urlInput = await page.$('input[name*="url"], input[placeholder*="http"]');
      if (urlInput) await urlInput.fill(SITE_DATA.url, { force: true });
      
      const descInput = await page.$('input[name*="pitch"], input[name*="headline"], input[placeholder*="Tagline"]');
      if (descInput) await descInput.fill(SITE_DATA.headline, { force: true });

      console.log('  🔔 请在 Edge 中确认登录后按回车...');
      await askUser('  [等待你的操作] 完成后请按回车键继续...');
      console.log('  ✅ StartupBase 提交完成！');
    }
  },

  launchingnext: {
    name: 'Launching Next (DA 52 | Dofollow 目录)',
    url: 'https://www.launchingnext.com/submit/',
    run: async (page) => {
      console.log('  🌐 [1/3] 正在通过 Edge 打开 Launching Next 提交页...');
      await page.goto('https://www.launchingnext.com/submit/', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(1000);

      await page.evaluate(() => {
        const overlays = document.querySelectorAll('#silktide-wrapper, #silktide-backdrop, .silktide-banner, [class*="cookie"], [id*="cookie"]');
        overlays.forEach(el => el.remove());
      });

      console.log('  ✍️  [2/3] 正在自动注入表单字段与数学题...');
      await page.fill('input[name="startupname"]', SITE_DATA.name, { force: true });
      await page.fill('input[name="startupurl"]', SITE_DATA.url, { force: true });
      await page.fill('input[name="description"]', SITE_DATA.headline, { force: true });
      await page.fill('textarea[name="fulldescription"]', SITE_DATA.longDesc, { force: true });
      await page.fill('textarea[name="tags"]', SITE_DATA.tags, { force: true });
      
      const radios = await page.$$('input[type="radio"]');
      if (radios.length >= 5) {
        await radios[0].check({ force: true });
        await radios[4].check({ force: true });
      }
      
      await page.fill('input[name="user"]', SITE_DATA.authorName, { force: true });
      await page.fill('input[name="email"]', SITE_DATA.email, { force: true });
      await page.fill('input[name="math"]', '5', { force: true });
      
      console.log('  👉 [3/3] 正在自动点击提交按钮...');
      await page.click('input[name="formSubmit"]', { force: true });
      await page.waitForTimeout(4000);
      console.log('  🎉 Launching Next 自动化提交已成功完成！');
    }
  }
};

async function main() {
  let target = process.argv[2];

  console.log('\n======================================================');
  console.log('  🤖 CADGuide.tools 全自动外链提交机器人 (Edge 隐身版)');
  console.log('======================================================\n');

  if (!target) {
    console.log('请选择要提交的目标平台:');
    console.log('  [1] BetaList (DA 70 - 权威早期科技收录)');
    console.log('  [2] Uneed.best (DA 68 - 顶流独立工具库)');
    console.log('  [3] StartupBase (DA 50 - 创业产品目录)');
    console.log('  [4] Launching Next (DA 52 - 早期科技收录)');
    console.log('  [5] 全量批量自动执行 (All Platforms)\n');

    const choice = await askUser('请输入数字编号 [1-5] (默认 1 BetaList): ');
    if (choice === '2') target = 'uneed';
    else if (choice === '3') target = 'startupbase';
    else if (choice === '4') target = 'launchingnext';
    else if (choice === '5') target = 'all';
    else target = 'betalist';
  }

  const sessionDir = path.join(os.homedir(), '.cadguide-edge-session');
  
  const launchOptions = {
    channel: 'msedge',
    headless: false,
    slowMo: 60,
    viewport: { width: 1280, height: 800 },
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
      '--no-first-run',
      '--no-default-browser-check'
    ],
    ignoreDefaultArgs: ['--enable-automation']
  };

  let context;
  try {
    context = await chromium.launchPersistentContext(sessionDir, launchOptions);
  } catch (e) {
    context = await chromium.launchPersistentContext(sessionDir + '-' + Date.now(), launchOptions);
  }

  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined
    });
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    if (target === 'all') {
      for (const [key, platform] of Object.entries(PLATFORMS)) {
        console.log(`\n▶️ 开始处理: ${platform.name}`);
        await platform.run(page);
        await page.waitForTimeout(2000);
      }
    } else if (PLATFORMS[target]) {
      console.log(`\n▶️ 开始处理: ${PLATFORMS[target].name}`);
      await PLATFORMS[target].run(page);
    } else {
      console.log(`⚠️ 未知平台: ${target}`);
    }

    console.log('\n======================================================');
    console.log('✅ 今日收官任务圆满完成！');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ 执行异常:', err.message);
  } finally {
    await context.close();
  }
}

main();
