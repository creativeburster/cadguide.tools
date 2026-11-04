// 复核排程器。内容会过期是常态，不是缺陷——所以把「什么时候该重核什么」变成可执行的。
//
// 分三档，按字段的挥发速度走，而不是按工具：
//   automated  每 6 个月   全站跑 verify-batch + l4-audit + 393 条外链复验（纯机器，便宜）
//   pricing    每 12 个月  重核价格字段：pricing_type / 套餐名 / 免费版与试用（LLM 判断，贵）
//   full       每 24 个月  全量重核，含格式矩阵、平台、模块归属
//
// 另有一张 watchlist：本轮实际观察到会变的（公司更名、被收购、产品重构），
// 无论档期如何，每次 automated 都要顺手看一眼。
//
// 用法：
//   node recheck.js              看当前档期与到期日
//   node recheck.js --done automated
//   node recheck.js --watchlist  打印 watchlist 的定价页，方便逐条核对

const fs = require('fs');
const path = require('path');

// scripts → tool-page-audit → skills → .workbuddy → repo root
const ROOT = path.resolve(__dirname, '../../../..');
const STATE = path.join(__dirname, '../references/verified.json');

const DEFAULTS = {
  policy: { automatedMonths: 6, pricingMonths: 12, fullMonths: 24 },
  // 全部 186 个在 2026-11-03 完成 L4 取证，三档同日起步。
  stages: { automated: '2026-11-03', pricing: '2026-11-03', full: '2026-11-03' },
  // 本轮实测会漂的：更名、并购归属调整、产品线重构、套餐改名。
  watchlist: [
    'sigmanest',            // 2026-10 SigmaNEST 公司 → SigmaTEK（Sandvik）
    'eagle',                // Autodesk EAGLE 停售
    'autodesk-netfabb',              // 2026 重组：Ultimate 退役
    'proteus-design-suite', // 套餐改名 Enterprise / Platinum / Custom
    'easyeda',              // 编辑器免费、商业使用付费
    'cypecad',              // 套餐名按产品线重排
    'topsolid',             // 六条产品线，名字带撇号易错
    'twinmotion',           // 按营收阈值判定免费
    'bimcollab',            // ZOOM Free 与 Nexus 分层
    'msc-nastran',          // Hexagon D&E → Cadence
    'msc-adams',            // 同上
    'multisim',             // NI 并入 Emerson
    'allegro-pcb',          // Cadence 产品线重组
    'orcad',                // 域名迁到 cadence.com
    'solidworks',           // 3DEXPERIENCE 套餐改名
    '3dexperience',         // 按角色订阅
    'archicad',             // 永久授权停售节点
    'vectorworks',          // 订阅/永久并行
    'altium-designer',      // IPC-2581 扩展归属
    'kicad',                // 版本节奏快
  ],
};

function load() {
  if (!fs.existsSync(STATE)) {
    fs.writeFileSync(STATE, JSON.stringify(DEFAULTS, null, 2) + '\n', 'utf8');
    return DEFAULTS;
  }
  return JSON.parse(fs.readFileSync(STATE, 'utf8'));
}

function addMonths(iso, n) {
  const d = new Date(iso + 'T00:00:00Z');
  const day = d.getUTCDate();
  d.setUTCMonth(d.getUTCMonth() + n);
  // 处理 1/31 + 1 个月这类溢出
  if (d.getUTCDate() < day) d.setUTCDate(0);
  return d.toISOString().slice(0, 10);
}

function daysBetween(a, b) {
  return Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 86400000);
}

const args = process.argv.slice(2);
const state = load();
const today = new Date().toISOString().slice(0, 10);

if (args[0] === '--done') {
  const stage = args[1];
  if (!stage || !(stage in state.stages)) {
    console.error('usage: node recheck.js --done <automated|pricing|full>');
    process.exit(1);
  }
  state.stages[stage] = today;
  fs.writeFileSync(STATE, JSON.stringify(state, null, 2) + '\n', 'utf8');
  console.log(stage + ' -> ' + today);
  process.exit(0);
}

if (args[0] === '--watchlist') {
  const DATA = path.join(ROOT, 'src/lib/data');
  const want = new Set(state.watchlist);
  for (const f of ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7']) {
    const t = fs.readFileSync(path.join(DATA, f + '.ts'), 'utf8').split('\r\n').join('\n');
    const s = t.indexOf('['), e = t.lastIndexOf(']');
    for (const x of eval('(' + t.slice(s, e + 1) + ')')) {
      if (!want.has(x.slug)) continue;
      want.delete(x.slug);
      console.log([x.slug, x.pricing_type, x.pricing_url || '(none)'].join('\t'));
    }
  }
  if (want.size) console.log('\n!! watchlist 里有不存在的 slug: ' + [...want].join(', '));
  process.exit(0);
}

const rows = [
  ['automated', state.policy.automatedMonths, 'verify-batch + l4-audit + 外链复验（纯机器）'],
  ['pricing', state.policy.pricingMonths, '价格字段：pricing_type / 套餐名 / 免费版与试用'],
  ['full', state.policy.fullMonths, '全量：含格式矩阵、平台、模块归属'],
];

console.log('复核排程   今天 ' + today);
let anyDue = false;
for (const [stage, months, desc] of rows) {
  const last = state.stages[stage];
  const due = addMonths(last, months);
  const left = daysBetween(today, due);
  const flag = left <= 0 ? 'DUE' : left <= 30 ? 'soon' : 'ok';
  if (left <= 0) anyDue = true;
  console.log(
    '  ' + stage.padEnd(10) +
    '上次 ' + last +
    '  下次 ' + due +
    '  ' + String(left).padStart(5) + ' 天  ' + flag.padEnd(5) +
    '  ' + desc
  );
}
console.log('\nwatchlist ' + state.watchlist.length + ' 个（每次 automated 顺手核）：' +
  '  node recheck.js --watchlist');
if (anyDue) process.exitCode = 2;
