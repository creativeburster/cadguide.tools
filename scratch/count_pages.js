const fs = require('fs');
const path = require('path');

// 简单通过正则匹配提取 data.ts 和 guides-data.ts 以及 toolbox-data.ts 的条目数

// 1. 统计 tools
const dataContent = fs.readFileSync(path.join(__dirname, '../src/lib/data.ts'), 'utf8');
const c1 = fs.readFileSync(path.join(__dirname, '../src/lib/data/c1.ts'), 'utf8');
const c2 = fs.readFileSync(path.join(__dirname, '../src/lib/data/c2.ts'), 'utf8');
const c3 = fs.readFileSync(path.join(__dirname, '../src/lib/data/c3.ts'), 'utf8');
const c4 = fs.readFileSync(path.join(__dirname, '../src/lib/data/c4.ts'), 'utf8');
const c5 = fs.readFileSync(path.join(__dirname, '../src/lib/data/c5.ts'), 'utf8');
const c6 = fs.readFileSync(path.join(__dirname, '../src/lib/data/c6.ts'), 'utf8');
const c7 = fs.readFileSync(path.join(__dirname, '../src/lib/data/c7.ts'), 'utf8');

const allC = c1 + c2 + c3 + c4 + c5 + c6 + c7;
const toolMatches = allC.match(/id:\s*'(t\d+|ext-[^']+)'/g);
const toolCount = toolMatches ? toolMatches.length : 0;

// 2. 统计 guides
// 8个大类落地页
// 每个tool对应10篇长尾排错文章 (即 tools.length * 10)
const guideCount = toolCount * 10;

// 3. 统计 toolbox
const toolboxContent = fs.readFileSync(path.join(__dirname, '../src/lib/toolbox-data.ts'), 'utf8');
const toolboxMatches = toolboxContent.match(/slug:\s*'([^']+)'/g);
const toolboxCount = toolboxMatches ? toolboxMatches.length : 0;

console.log(JSON.stringify({
  toolCount,
  categoryLandingCount: 8,
  guideCount,
  toolboxCount,
  total: 1 + 1 + 1 + toolCount + 8 + guideCount + toolboxCount // Home + ToolsIndex + GuidesIndex + ToolsDetail + CategoryLanding + GuidesDetail + ToolboxDetail
}));
