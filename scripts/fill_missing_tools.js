// scripts/fill_missing_tools.js
// ------------------------------------------------------------
// 自动读取 missing.json，抓取官方页面信息，生成完整的数据块，
// 并追加到 src/lib/data.ts 中的 tools 数组。
// 使用方式：在项目根目录执行 `node scripts/fill_missing_tools.js`

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // 若项目未装，请先 npm i node-fetch@2
const { JSDOM } = require('jsdom');

// ---- 目录/文件路径 ----
const DATA_TS = path.resolve(__dirname, '..', 'src', 'lib', 'data.ts');
const MISSING_JSON = path.resolve(__dirname, '..', 'new_batch.json');

// ---- 读取现有文件 ----
let dataContent = fs.readFileSync(DATA_TS, 'utf-8');
let missingList;
try {
  missingList = JSON.parse(fs.readFileSync(MISSING_JSON, 'utf-8'));
} catch (e) {
  console.error('❌ 读取 missing.json 失败：', e);
  process.exit(1);
}

// ---- 辅助函数 ----
/** 将名称转为 URL‑安全 slug（小写、连字符） */
function toSlug(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

/** 生成 logo 表达式，使用首字母或缩写 */
function logoExpr(slug) {
  const abbr = slug.split('-')[0].slice(0, 2).toUpperCase();
  return `getLogo("${abbr}")`;
}

/** 根据当前 data.ts 内容算出下一个可用的 id（tXX） */
function nextId(content) {
  const ids = [...content.matchAll(/id:\s*"t(\d+)"/g)].map(m => Number(m[1]));
  const max = ids.length ? Math.max(...ids) : 0;
  return `t${max + 1}`;
}

/** 简单提取页面 meta description（若无则返回 null） */
function extractMetaDescription(dom) {
  const meta = dom.window.document.querySelector('meta[name="description"]');
  return meta ? meta.content.trim() : null;
}

/** 从页面寻找平台信息（Windows、macOS、Linux） */
function extractPlatforms(dom) {
  const txt = dom.window.document.body.textContent.toLowerCase();
  const platforms = [];
  if (txt.includes('windows')) platforms.push('Windows');
  if (txt.includes('macos') || txt.includes('mac os') || txt.includes('mac')) platforms.push('macOS');
  if (txt.includes('linux')) platforms.push('Linux');
  return platforms.length ? platforms : ['Windows']; // 默认至少有 Windows
}

/** 生成 pricing_tiers 的占位结构（若抓不到则使用 N/A） */
function makePricingTiers() {
  return `[
    { name: "Perpetual", price: "N/A", period: "initial", features: [], is_popular: false }
  ]`;
}

/** 简单生成详细功能结构（如未抓取到则为空数组） */
function makeDetailedFeatures() {
  return `[]`;
}

/** 生成一个完整的对象字符串（保持 data.ts 的缩进） */
function buildToolObject(tool, id) {
  const slug = toSlug(tool.name);
  const logo = logoExpr(slug);
  const shortDesc = tool.shortDesc || `简要介绍 ${tool.name}。`;
  const description = tool.description || `详细介绍 ${tool.name}，由 ${tool.company} 提供。`;

  return `  {
    id: "${id}",
    name: "${tool.name}",
    slug: "${slug}",
    logo_url: ${logo},
    short_desc: "${shortDesc}",
    description: "${description}",
    pricing_tiers: ${makePricingTiers()},
    detailed_features: ${makeDetailedFeatures()},
    alternatives: [],
    country: "${tool.country}",
    category_id: "c1",
    pricing_type: "Perpetual",
    starting_price: 0,
    platforms: ${JSON.stringify(tool.platforms)},
    industries: [],
    core_features: [],
    user_scales: [],
    official_url: "${tool.url.replace(/\r/g, '')}",
    affiliate_url: null,
    score: 0,
    pros: [],
    cons: [],
    faqs: genericFaqs("${tool.name}"),
    tech_specs: { engine: "${tool.name} Engine", multicore: "N/A", gpu_optimization: "N/A", standards: [] },
    expert_verdict: "待补充专业评语。"
  },`;
}

/** 获取页面并返回 JSDOM 实例，出现错误时返回 null */
async function fetchDom(url) {
  try {
    const res = await fetch(url, { timeout: 15000 });
    if (!res.ok) return null;
    const html = await res.text();
    return new JSDOM(html);
  } catch (_) {
    return null;
  }
}

// ------------------------------------------------------------
// 主流程（异步 IIFE）
(async () => {
  console.log(`🔎 开始处理 ${missingList.length} 条缺失工具……`);

  const arrayCloseIdx = dataContent.lastIndexOf(']');
  if (arrayCloseIdx === -1) {
    console.error('❌ 未找到 tools 数组的闭合括号');
    process.exit(1);
  }

  let newBlocks = '';
  let currentContent = dataContent;

  for (const item of missingList) {
    const id = nextId(currentContent);
    console.log(`▶️ 正在处理 ${item.name} (${id})`);
    const dom = await fetchDom(item.url);
    let shortDesc = null;
    let description = null;
    let platforms = null;
    if (dom) {
      const metaDesc = extractMetaDescription(dom);
      if (metaDesc) {
        shortDesc = metaDesc.slice(0, 120).replace(/"/g, '\\"');
        description = metaDesc.replace(/"/g, '\\"');
      }
      platforms = extractPlatforms(dom);
    }
    const toolData = {
      ...item,
      shortDesc: shortDesc || `简要介绍 ${item.name}（官方站点）`,
      description: description || `详细介绍 ${item.name}（官方站点）`,
      platforms: platforms || ['Windows']
    };
    const block = buildToolObject(toolData, id);
    newBlocks += `\n${block}`;
    currentContent += block;
  }

  const before = dataContent.slice(0, arrayCloseIdx);
  const after = dataContent.slice(arrayCloseIdx);
  const finalContent = `${before}${newBlocks}\n${after}`;

  fs.writeFileSync(DATA_TS, finalContent, 'utf-8');
  console.log(`✅ 已在 data.ts 中添加 ${missingList.length} 条工具信息`);
})();
