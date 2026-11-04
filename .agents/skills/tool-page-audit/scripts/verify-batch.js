#!/usr/bin/env node
/**
 * verify-batch.js — 工具页数据批次校验器（tool-page-audit skill 的核心检查）
 *
 * 用法：
 *   node .workbuddy/skills/tool-page-audit/scripts/verify-batch.js --file src/lib/data/c1.ts
 *   node .workbuddy/skills/tool-page-audit/scripts/verify-batch.js --file src/lib/data/c1.ts --slugs autocad,zwcad
 *   node .workbuddy/skills/tool-page-audit/scripts/verify-batch.js --file src/lib/data/c1.ts --strict
 *
 * 退出码：0 = 无 ERROR；1 = 有 ERROR（--strict 下 WARN 也算失败）
 *
 * 设计原则：只做「机器可证明」的检查。事实是否与厂商一致，必须人工对官方页核。
 */

const fs = require('fs');
const path = require('path');

// ---------- args ----------
const argv = process.argv.slice(2);
const arg = (k, d) => {
  const i = argv.indexOf('--' + k);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const FILE = arg('file', '');
const SLUGS = arg('slugs', '');
const STRICT = argv.includes('--strict');
if (!FILE) {
  console.error('usage: verify-batch.js --file <data.ts> [--slugs a,b,c] [--strict]');
  process.exit(2);
}

// ---------- load ----------
const src = fs.readFileSync(FILE, 'utf8');
const m = src.match(/export const \w+\s*:\s*Tool\[\]\s*=/);
if (!m) {
  console.error('ERROR: cannot find "export const xxx: Tool[] =" in ' + FILE);
  process.exit(2);
}
const start = src.indexOf('[', m.index);
const end = src.lastIndexOf('];');
const body = src.slice(start, end + 1);

let tools;
try {
  tools = eval(body);
} catch (e) {
  console.error('ERROR: data file does not parse — ' + e.message);
  process.exit(2);
}

let target = tools;
if (SLUGS) {
  const want = new Set(SLUGS.split(',').map((s) => s.trim()).filter(Boolean));
  target = tools.filter((t) => want.has(t.slug));
  const missing = [...want].filter((s) => !tools.some((t) => t.slug === s));
  if (missing.length) console.warn('WARN: slugs not found: ' + missing.join(', '));
}

// ---------- helpers ----------
const issues = [];
const add = (t, level, code, msg) => issues.push({ slug: t ? t.slug : '(global)', level, code, msg });

const ALLOWED_PRICE = new Set([
  'Official Store',
  'Official Pricing',
  'Free',
  'Open Source',
  'Contact Sales',
  'Custom Quote',
  'Custom',
  // A discontinued product is not sold at any price. The tier must say so
  // rather than carry a placeholder that implies a purchase route exists.
  'Not for Sale',
]);

const BANNED_FIELDS = ['version', 'free_trial_days', 'last_updated'];
const HARD_PRICE = /(?:[$€£¥]\s?\d)|(?:\b\d+\s?(?:usd|eur|rmb|cny)\b)/i;
const YEAR = /\b(19|20)\d{2}\b/;

const hostOf = (u) => {
  if (!u || typeof u !== 'string') return '';
  const mm = u.match(/^https?:\/\/([^/]+)/i);
  return mm ? mm[1].toLowerCase().replace(/^www\./, '') : '';
};
const regDomain = (u) => {
  const h = hostOf(u);
  const parts = h.split('.');
  return parts.length >= 2 ? parts.slice(-2).join('.') : h;
};

// 已知的「官方产品页域名 != 官方商店域名」例外
const DOMAIN_EXCEPTIONS = new Set([
  'microstation', // bentley.com -> virtuosity.com（Bentley 官方 eStore）
]);

// 已核实的「产品域 -> 母公司 / 继任公司域」关系。
// 收购、品牌整合或公司更名后，产品页仍留在旧域，而购买 / 询价入口迁到母公司域。
// 这是正确的官方链路，不是死链或错链；但必须逐对核实，不能放宽成「任意不同域名都不报」。
// 取证来源见 references/vendor-facts.md「母公司域名 / 遗留跳转」。
const CORPORATE_DOMAIN_PAIRS = [
  ['worknc.com', 'hexagon.com'],       // WorkNC / Vero -> Hexagon
  ['surfcam.com', 'hexagon.com'],      // SURFCAM / Vero -> Hexagon
  ['alphacam.com', 'hexagon.com'],    // AlphaCAM / Vero -> Hexagon
  ['radan.com', 'hexagon.com'],       // RADAN / Vero -> Hexagon
  ['espritcam.com', 'hexagon.com'],   // DP Technology ESPRIT -> Hexagon
  ['sigmanest.com', 'sigmateksystems.com'], // 2026-10 更名 SigmaTEK（Sandvik 集团）
];
const corporatePair = (a, b) =>
  CORPORATE_DOMAIN_PAIRS.some(([from, to]) => from === a && to === b);

// ---------- per-tool checks ----------
for (const t of target) {
  // E1 required fields
  for (const k of ['id', 'name', 'slug', 'short_desc', 'description', 'category_id', 'pricing_type', 'platforms', 'official_url']) {
    if (t[k] === undefined || t[k] === null || (typeof t[k] === 'string' && !t[k].trim())) {
      add(t, 'ERROR', 'E1-required', 'missing required field: ' + k);
    }
  }

  // E2 banned volatile fields
  const rec = JSON.stringify(t);
  for (const b of BANNED_FIELDS) {
    if (new RegExp('"' + b + '"\\s*:').test(rec)) add(t, 'ERROR', 'E2-banned-field', 'banned volatile field present: ' + b);
  }

  // E3 price placeholders
  for (const tier of t.pricing_tiers || []) {
    const p = String(tier.price ?? '').trim();
    if (!p) { add(t, 'ERROR', 'E3-price-empty', 'tier "' + tier.name + '" has empty price'); continue; }
    if (HARD_PRICE.test(p)) add(t, 'ERROR', 'E3-hard-price', 'hardcoded price in tier "' + tier.name + '": ' + p);
    else if (!ALLOWED_PRICE.has(p)) add(t, 'WARN', 'E3-price-label', 'unexpected price placeholder in tier "' + tier.name + '": ' + p);
    // tier.features 同样渲染给用户，却曾被塞进写死的金额与折扣对比
    // （"save €500 vs annual renewals" / "€4,000 per workstation"）。
    // 价格/折扣一律直链官方，features 只描述「包含什么」，不出现具体金额。
    for (const ft of tier.features || []) {
      if (HARD_PRICE.test(String(ft))) add(t, 'ERROR', 'E3-hard-price-feature', 'hardcoded price in tier feature "' + tier.name + '": ' + ft);
    }
  }

  // E4 hardcoded years in user-facing copy.
  // 例外 1：已停产产品（discontinued）的日期是冻结的历史事实（停售日、最终版本、
  // 停止支持日），不会随时间漂移，反而是最有价值的准确性信息，必须允许写。
  // 例外 2：句子里写的是不可再变的公司/产品史（收购、成立、更名、最终版本），
  // 同样不随时间失效；只有「现在的价格/现在的最新版是 2025」这类才会过时。
  const FROZEN_EVENT = /acquired|acquisition|acquires|founded|merged|merger|renamed|rebranded|since|final release|last version|ended|discontinued|shut down|spun off|launched in|released in|introduced in|announced|capped at|up to Revit|onwards|and later|removed|through/i;
  const yearInFrozenEvent = (text) =>
    String(text).split(/(?<=[.!?])\s+/).every((s) => !YEAR.test(s) || FROZEN_EVENT.test(s));
  const frozenHistory = t.discontinued === true;
  const copyFields = [
    ['short_desc', t.short_desc],
    ['description', t.description],
    ['expert_verdict', t.expert_verdict],
  ];
  if (!frozenHistory) {
    for (const [k, v] of copyFields) {
      if (typeof v === 'string' && YEAR.test(v) && !yearInFrozenEvent(v)) add(t, 'WARN', 'E4-year', 'hardcoded year in ' + k);
    }
    for (const f of t.faqs || []) {
      const txt = (f.a || '') + ' ' + (f.q || '');
      if (YEAR.test(txt) && !yearInFrozenEvent(txt)) add(t, 'WARN', 'E4-year', 'hardcoded year in FAQ: ' + f.q);
    }
    // tech_specs 的标量值也渲染在 Technical Specifications 卡片里，
    // "GPU offload for select solvers (2024 R1+)" 这类版本声明会漂移。
    // 数组型（standards）与 *_url 不检查；FROZEN_EVENT 豁免冻结史实
    // （如 OpenSCAD 的 "default since 2025 nightlies"）。
    for (const [k, v] of Object.entries(t.tech_specs || {})) {
      if (typeof v !== 'string' || /url$/i.test(k)) continue;
      if (YEAR.test(v) && !yearInFrozenEvent(v)) add(t, 'WARN', 'E4-year', 'hardcoded year in tech_specs.' + k);
    }
  }

  // E5 pricing_type vs tier periods
  const periods = (t.pricing_tiers || []).map((x) => String(x.period || '').toLowerCase());
  const joined = periods.join(' | ');
  if (t.pricing_type === 'Perpetual' && /subscription/.test(joined)) {
    add(t, 'ERROR', 'E5-perpetual-vs-sub', 'pricing_type=Perpetual but a tier period mentions subscription: ' + joined);
  }
  if (t.pricing_type === 'Subscription' && /perpetual/.test(joined)) {
    add(t, 'ERROR', 'E5-sub-vs-perpetual', 'pricing_type=Subscription but a tier period mentions perpetual: ' + joined);
  }
  if (t.pricing_type === 'Free') {
    for (const tier of t.pricing_tiers || []) {
      if (!['Free', 'Open Source'].includes(String(tier.price))) {
        add(t, 'ERROR', 'E5-free', 'pricing_type=Free but tier "' + tier.name + '" price = ' + tier.price);
      }
    }
  }

  // E6 platforms vs FAQ OS answer
  const osFaq = (t.faqs || []).find((f) => /operating system/i.test(f.q || ''));
  if (osFaq && Array.isArray(t.platforms)) {
    const a = String(osFaq.a || '').toLowerCase();
    // 例外：FAQ 明确说是「另一个独立产品」（如 progeCAD 的 iCADMac），不算平台声明
    const separate = /separate|standalone product|icadmac/.test(a);
    // 例外：FAQ 明确否认某平台（"there is no macOS build" / "not available for macOS"）
    const deniesMac = /(no|not|without|never)[^.]{0,40}mac\s?os/.test(a);
    const deniesLinux = /(no|not|without|never)[^.]{0,40}linux/.test(a);
    const p = t.platforms.map((x) => String(x).toLowerCase());
    // 例外：纯浏览器产品。platforms 写 ["Web", ...] 是对的，FAQ 说「在 Windows/macOS/
    // Linux 的浏览器里都能跑」也没有错——两者不矛盾，是同一个 Web 客户端的宿主 OS。
    // 只有当 FAQ 声称有「本地安装版」跑在某 OS 上时才需要平台数组跟着写。
    const browserOnly = p.includes('web') && /browser|web app|cloud/i.test(a);
    const saysMac = /macos|mac os/.test(a) && !deniesMac;
    const saysLinux = /linux/.test(a) && !deniesLinux;
    const hasMac = p.includes('macos');
    const hasLinux = p.includes('linux');
    if (!separate && !browserOnly) {
      if (hasMac !== saysMac) {
        add(t, 'WARN', 'E6-platform', 'platforms ' + (hasMac ? 'has' : 'lacks') + ' macOS but FAQ OS answer ' + (saysMac ? 'mentions' : 'omits') + ' it');
      }
      if (hasLinux !== saysLinux) {
        add(t, 'WARN', 'E6-platform', 'platforms ' + (hasLinux ? 'has' : 'lacks') + ' Linux but FAQ OS answer ' + (saysLinux ? 'mentions' : 'omits') + ' it');
      }
    }
  }

  // E7 formats mentioned in format FAQ but absent from in/out.
  // 逐句判定：FAQ 常写「不能导入 STEP/IGES」，这是否认而非声明，不能算缺项。
  const fmtFaq = (t.faqs || []).find((f) => /file format|which formats/i.test(f.q || ''));
  if (fmtFaq) {
    const norm = (x) => String(x).toUpperCase().replace(/\s*\([^)]*\)\s*$/, '').trim();
    // 数组项常写成「输出内容 + 格式」的复合名："PDF Analysis Reports"、
    // "Stress Reports (PDF/Excel)"、"RVT (Direct Link)"、"PDF Calculation Notes"。
    // 这些名称整体不是 token，但 FAQ 里提到 PDF / RVT 是有据的。若只按整串比对
    // 会产生假阳性，逼着人把准确的描述改成光秃秃的 "PDF"。所以把复合名里
    // 出现的格式 token 也计入 known——规则适配数据，而不是削数据迁就规则。
    const FORMAT_TOKEN = /\b(DWG|DXF|DWT|DGN|DWF|STEP|IGES|SAT|IFC|RVT|RFA|SKP|STL|PDF|SVG|3DS|OBJ|FBX|3DM|IPT|SHP|HPGL|PLT|Gerber|JWW)\b/gi;
    const known = new Set();
    for (const raw of [...(t.file_formats_in || []), ...(t.file_formats_out || [])]) {
      known.add(norm(raw));
      for (const tk of String(raw).match(FORMAT_TOKEN) || []) known.add(tk.toUpperCase());
    }
    const NEG = /cannot|can't|can not|not support|doesn't|does not|no native|without|not available|unsupported|neither|plan on a converter|requires a converter|requires a plugin|different authoring platform|not an? \w+-based|no (?:native |direct |built-in )?\w[\w-]* support|not through|not a supported|rather than|is not|has been removed|no longer support|isn't|has no|there is no|no \w+ (?:import|export|reader|writer|channel)/i;
    const sentences = String(fmtFaq.a || '').split(/(?<=[.!?])\s+/);
    const missing = new Set();
    for (const s of sentences) {
      if (NEG.test(s)) continue;
      // 同时跳过 "STEP or IGES" 之外由括号说明的例外（如 "(via the ODA converter)"）
      const tokens = s.match(FORMAT_TOKEN) || [];
      for (const tk of tokens) {
        const up = tk.toUpperCase();
        // FAQ 里写成 "ACIS (.sat)" 这类「扩展名」时，数组里只要有 SAT 或 ACIS 任一种即可；
        // 数组写 "3D PDF" 时也覆盖了对 PDF 的提及。
        const alias =
          (up === 'SAT' && (known.has('SAT') || known.has('ACIS'))) ||
          (up === 'PDF' && (known.has('PDF') || known.has('3D PDF'))) ||
          (up === '3DM' && (known.has('3DM') || known.has('RHINO 3DM')));
        if (!known.has(up) && !alias) missing.add(up);
      }
    }
    if (missing.size) add(t, 'WARN', 'E7-formats', 'FAQ mentions formats not in in/out arrays: ' + [...missing].join(', '));
  }

  // E12 detailed_features 里的空话条目。
  // 这些名字曾经是批量生成时填进去的占位，横跨互不相关的厂商逐字重复
  // （"Unit & Coordinate System Calibration" 21 个工具、Team Collaboration 21 个、
  // Automated Quality & Geometry Verification 20 个）。它们要么和 `platforms`
  // 这类结构化字段重复，要么根本无法被证伪——给一个两人用的 2D 绘图软件写
  // "Automated Quality & Geometry Verification" 就是假的。
  const DF_FILLER =
    /^(?:Unit & Coordinate System Calibration|Team Collaboration & Revision Handoff|Automated Quality & Geometry Verification|Standards & Schema Validation|(?:Windows|macOS|Linux|Web)(?:\s*\/\s*(?:Windows|macOS|Linux|Web))*\s*Runtime Support)$/;
  for (const g of t.detailed_features || []) {
    if (!g.items || !g.items.length) {
      add(t, 'WARN', 'E12-df-empty', 'detailed_features group has no items: ' + g.category);
      continue;
    }
    for (const it of g.items) {
      if (DF_FILLER.test(String(it.name || ''))) {
        add(t, 'WARN', 'E12-df-filler', 'vacuous detailed_features item: ' + it.name);
      }
    }
  }

  // E9 https links
  for (const k of ['official_url', 'pricing_url', 'trial_url']) {
    if (t[k] && !/^https:\/\//i.test(t[k])) add(t, 'WARN', 'E9-https', k + ' is not https: ' + t[k]);
  }

  // E11 格式 FAQ 的模板句。
  // 全站曾出现过一句模板顶掉 60+ 个工具的情况：
  //   "X works with standard BIM interchange formats including IFC, RVT, and DWG."
  // 它把一个品类里所有工具的格式清单拉平成同一句话——几乎必然有工具被写上了
  // 自己并不支持的格式（实测 Tekla 并无原生 RVT 导入）。这类句子必须点名。
  //
  // 第二批模板是 c5/c7 的 CAE 尾巴句：
  //   "Direct CAD associative interfaces and neutral solver/exchange formats are
  //    supported depending on your licensed modules."
  // 它跟在「数组清单复述句」后面，看似留了余地，实则对求解器/前处理器/平台类产品
  // 全是假话（Fluent 根本不直接读 CAD，OpenFOAM 没有 licence modules）。
  // c5 曾有 35 处、c7 曾有 22 处。
  const BOILER =
    /works with standard (BIM|3D modeling|2D CAD|CAD viewer|CAE\s?\/\s?CAM|EDA) interchange formats/i;
  const CAE_TAIL =
    /Direct CAD associative interfaces and neutral solver\/exchange formats are supported depending on your licensed modules/i;
  // 第三类「数组清单复述」曾想用正则抓，但实测会误伤手写且准确的 FAQ
  // （caxa-cad / dds-cad / engineering-on-web 都是人写的真实清单）。
  // 真正要防的机械复述已由上面的 CAE_TAIL 覆盖——那些句子必然带着尾巴句。
  // 结论：规则只抓可判定的模板指纹，不做语言风格判断。
  for (const f of t.faqs || []) {
    const a = String(f.a || '');
    if (BOILER.test(a) || CAE_TAIL.test(a)) {
      add(t, 'WARN', 'E11-faq-template', 'format FAQ is a category boilerplate, not this product\'s own list');
      break;
    }
  }

  // E10 pricing_url should be same registrable domain as official_url
  if (t.pricing_url && t.official_url && !DOMAIN_EXCEPTIONS.has(t.slug)) {
    const a = regDomain(t.official_url);
    const b = regDomain(t.pricing_url);
    if (a && b && a !== b && !corporatePair(a, b)) add(t, 'WARN', 'E10-domain', 'pricing domain ' + b + ' != official domain ' + a);
  }
}

// ---------- cross-tool checks ----------
const dupScan = (field, getter) => {
  // 这些值是「事实相同」而非「模板复用」，不算问题
  const GENERIC = new Set(['Not published by the vendor', 'Single-threaded', 'Not applicable']);
  const map = new Map();
  for (const t of tools) {
    const v = getter(t);
    if (!v || GENERIC.has(v)) continue;
    if (!map.has(v)) map.set(v, []);
    map.get(v).push(t.slug);
  }
  for (const [v, slugs] of map) {
    if (slugs.length >= 3) add(null, 'WARN', 'E8-template-' + field, slugs.length + ' tools share ' + field + ' "' + v + '": ' + slugs.join(', '));
  }
};
dupScan('multicore', (t) => t.tech_specs && t.tech_specs.multicore);
dupScan('gpu', (t) => t.tech_specs && t.tech_specs.gpu_optimization);

// ---------- report ----------
const errs = issues.filter((i) => i.level === 'ERROR');
const warns = issues.filter((i) => i.level === 'WARN');
const byCode = {};
for (const i of issues) {
  const k = i.level + ' ' + i.code;
  byCode[k] = (byCode[k] || 0) + 1;
}

console.log('file: ' + FILE);
console.log('tools scanned: ' + target.length + ' / ' + tools.length);
console.log('ERROR=' + errs.length + '  WARN=' + warns.length);
if (Object.keys(byCode).length) {
  console.log('\nby code:');
  Object.keys(byCode).sort().forEach((k) => console.log('  ' + k + '  x' + byCode[k]));
}
if (issues.length) {
  console.log('\ndetails:');
  for (const i of issues) console.log('  [' + i.level + '] ' + i.slug + ' | ' + i.code + ' | ' + i.msg);
}
const fail = errs.length > 0 || (STRICT && warns.length > 0);
console.log('\nresult: ' + (fail ? 'FAIL' : 'PASS'));
process.exit(fail ? 1 : 0);
