const fs = require('fs');
const path = require('path');

// 收集所有具有 generateStaticParams 的路由文件
const pageFiles = [
  'src/app/alternatives/[slug]/page.tsx',
  'src/app/best/feature/[slug]/page.tsx',
  'src/app/best/[slug]/page.tsx',
  'src/app/compare/[pair]/page.tsx',
  'src/app/file-formats/[slug]/page.tsx',
  'src/app/for/[slug]/page.tsx',
  'src/app/guides/[slug]/page.tsx',
  'src/app/platforms/[slug]/page.tsx',
  'src/app/pricing/[slug]/page.tsx',
  'src/app/sectors/[slug]/page.tsx',
  'src/app/toolbox/[slug]/page.tsx',
  'src/app/tools/[slug]/page.tsx'
];

// 写入一个临时的 tsx 执行脚本，直接在真实 Node 环境中 import 这些函数并计算它们返回的 params.length
const runnerContent = `
import { tools } from '../src/lib/data';
import { TOOLBOX_DATA } from '../src/lib/toolbox-data';

// 导入所有的 generateStaticParams 并捕获
import { generateStaticParams as altParams } from '../src/app/alternatives/[slug]/page.tsx';
import { generateStaticParams as bestFeatureParams } from '../src/app/best/feature/[slug]/page.tsx';
import { generateStaticParams as bestParams } from '../src/app/best/[slug]/page.tsx';
import { generateStaticParams as compareParams } from '../src/app/compare/[pair]/page.tsx';
import { generateStaticParams as fileFormatsParams } from '../src/app/file-formats/[slug]/page.tsx';
import { generateStaticParams as forParams } from '../src/app/for/[slug]/page.tsx';
import { generateStaticParams as guidesParams } from '../src/app/guides/[slug]/page.tsx';
import { generateStaticParams as platformsParams } from '../src/app/platforms/[slug]/page.tsx';
import { generateStaticParams as pricingParams } from '../src/app/pricing/[slug]/page.tsx';
import { generateStaticParams as sectorsParams } from '../src/app/sectors/[slug]/page.tsx';
import { generateStaticParams as toolboxParams } from '../src/app/toolbox/[slug]/page.tsx';
import { generateStaticParams as toolsParams } from '../src/app/tools/[slug]/page.tsx';

async function main() {
  const list = [
    { name: 'alternatives', fn: altParams },
    { name: 'best/feature', fn: bestFeatureParams },
    { name: 'best', fn: bestParams },
    { name: 'compare', fn: compareParams },
    { name: 'file-formats', fn: fileFormatsParams },
    { name: 'for', fn: forParams },
    { name: 'guides', fn: guidesParams },
    { name: 'platforms', fn: platformsParams },
    { name: 'pricing', fn: pricingParams },
    { name: 'sectors', fn: sectorsParams },
    { name: 'toolbox-placeholder', fn: toolboxParams },
    { name: 'tools', fn: toolsParams }
  ];

  const results = {};
  let total = 0;

  for (const item of list) {
    try {
      const p = await item.fn();
      results[item.name] = p.length;
      total += p.length;
    } catch (err) {
      results[item.name] = 'ERROR: ' + err.message;
    }
  }

  // 加上物理目录中的物理页面（如 /toolbox 目录下的 70 个独立页面）
  // 还有主站根目录和非动态子目录下的 page.tsx（首页、/about 等约 20 个）
  results['toolbox-physical-folders'] = 70;
  total += 70;

  results['base-and-static-pages'] = 22; // 首页、/tools 等静态路由
  total += 22;

  console.log(JSON.stringify({ breakdown: results, totalDynamicAndPhysicalPages: total }, null, 2));
}

main().catch(console.error);
`;

fs.writeFileSync('./scratch/run_count_static.ts', runnerContent, 'utf8');
console.log('Static pages runner written.');
