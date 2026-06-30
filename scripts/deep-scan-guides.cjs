const fs = require('fs');
const path = require('path');

const GUIDES_DIR = path.join(process.cwd(), 'src', 'content', 'guides');
const issues = [];

function extractFrontmatter(content) {
  const normalized = content.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fmText = match[1];
  const fm = {};
  let currentKey = null;
  const lines = fmText.split('\n');
  for (const line of lines) {
    const kvMatch = line.match(/^(\w+):\s*"?(.*?)"?$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      fm[currentKey] = kvMatch[2];
    } else if (line.match(/^\s+-\s+"?(.*?)"?$/)) {
      const itemMatch = line.match(/^\s+-\s+"?(.*?)"?$/);
      if (currentKey && !Array.isArray(fm[currentKey])) {
        fm[currentKey] = [fm[currentKey]];
      }
      if (currentKey) {
        fm[currentKey].push(itemMatch[1]);
      }
    }
  }
  return fm;
}

function countWords(text) {
  const normalized = text.replace(/\r\n/g, '\n');
  const body = normalized.replace(/^---\n[\s\S]*?\n---\n/, '');
  const codeBlocks = body.match(/```[\s\S]*?```/g) || [];
  const codeWords = codeBlocks.reduce((sum, block) => {
    const cleaned = block.replace(/```\w*\n?|```/g, '').replace(/[#*_>\-|]/g, ' ');
    return sum + Math.floor(cleaned.split(/\s+/).filter(w => w.length > 0).length * 0.5);
  }, 0);
  const noCode = body.replace(/```[\s\S]*?```/g, '');
  const noInline = noCode.replace(/`[^`]+`/g, '');
  const noMd = noInline.replace(/[#*_>\-|]/g, ' ');
  const proseWords = noMd.split(/\s+/).filter(w => w.length > 0).length;
  return proseWords + codeWords;
}

function hasChinese(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

const TEMPLATE_PHRASES = [
  '在进行企业级部署与深度应用开发时',
  '是保证整个 CAD/CAE 设计管线高效流转的关键',
  '本技术规程将针对这一具体的工具配置节点',
  '从系统诊断、底层配置及实操优化的角度提供官方可验证的实施方案',
  '在日常的多用户高并发协同中',
  '根据该软件在企业中的典型应用环境',
  '请严格遵循以下实操规程在本地 CAD 终端机或企业中心许可服务器上执行优化部署',
  '配置文件在上传至服务器或保存至本地 AppData 之前',
];

const HOMEPAGE_PATTERNS = [
  /^https?:\/\/[^/]+\/?$/,
  /^https?:\/\/forum\.[^/]+\/?$/,
  /^https?:\/\/community\.[^/]+\/?$/,
  /^https?:\/\/wiki\.[^/]+\/?$/,
  /^https?:\/\/[^/]+\/support\/?$/,
  /^https?:\/\/[^/]+\/support\/administration-guides\/?$/,
  /^https?:\/\/[^/]+\/support\/system-requirements\/?$/,
  /^https?:\/\/[^/]+\/support\/documentation\/?$/,
  /^https?:\/\/[^/]+\/support\/licensing\/?$/,
];

const toolDirs = fs.readdirSync(GUIDES_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

let totalGuides = 0;
let guidesWithSources = 0;
let guidesWithoutSources = 0;
let guidesWithChinese = 0;
let guidesWithTemplate = 0;
let guidesLowWord = 0;
let guidesWithHomepageSources = 0;
let guidesWithNoRealURL = 0;
const sourceDomains = {};

for (const tool of toolDirs) {
  const toolPath = path.join(GUIDES_DIR, tool);
  const files = fs.readdirSync(toolPath).filter(f => f.endsWith('.md'));
  for (const file of files) {
    totalGuides++;
    const filePath = path.join(toolPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const fm = extractFrontmatter(content);
    
    // Check Chinese
    if (hasChinese(content)) {
      guidesWithChinese++;
      issues.push(`CHINESE: ${tool}/${file}`);
    }
    
    // Check template phrases
    for (const phrase of TEMPLATE_PHRASES) {
      if (content.includes(phrase)) {
        guidesWithTemplate++;
        issues.push(`TEMPLATE: ${tool}/${file} - "${phrase.substring(0, 30)}..."`);
        break;
      }
    }
    
    // Check word count
    const wc = countWords(content);
    if (wc < 1000) {
      guidesLowWord++;
      issues.push(`LOW_WORD (${wc}): ${tool}/${file}`);
    }
    
    // Check sources
    if (fm && fm.sources) {
      const sources = Array.isArray(fm.sources) ? fm.sources : [fm.sources];
      const realSources = sources.filter(s => s && s.startsWith('http'));
      
      if (realSources.length === 0) {
        guidesWithNoRealURL++;
        issues.push(`NO_REAL_SOURCES: ${tool}/${file}`);
      } else {
        guidesWithSources++;
        
        // Check for homepage-only sources
        let allHomepage = realSources.every(s => HOMEPAGE_PATTERNS.some(p => p.test(s)));
        if (allHomepage) {
          guidesWithHomepageSources++;
          issues.push(`HOMEPAGE_ONLY_SOURCES: ${tool}/${file} - ${realSources.join(', ')}`);
        }
        
        // Track source domains
        for (const s of realSources) {
          try {
            const domain = new URL(s).hostname;
            sourceDomains[domain] = (sourceDomains[domain] || 0) + 1;
          } catch(e) {}
        }
      }
    } else {
      guidesWithoutSources++;
      issues.push(`NO_SOURCES: ${tool}/${file}`);
    }
  }
}

console.log('=== GUIDE DEEP SCAN RESULTS ===');
console.log(`Total guides: ${totalGuides}`);
console.log(`Tools covered: ${toolDirs.length}`);
console.log();
console.log(`Guides with real sources: ${guidesWithSources}`);
console.log(`Guides without sources: ${guidesWithoutSources}`);
console.log(`Guides with no real URL sources: ${guidesWithNoRealURL}`);
console.log(`Guides with homepage-only sources: ${guidesWithHomepageSources}`);
console.log(`Guides with Chinese characters: ${guidesWithChinese}`);
console.log(`Guides with template phrases: ${guidesWithTemplate}`);
console.log(`Guides with low word count (<1000): ${guidesLowWord}`);
console.log();
console.log('=== TOP SOURCE DOMAINS ===');
Object.entries(sourceDomains).sort((a,b) => b[1]-a[1]).slice(0, 20).forEach(([d,n]) => {
  console.log(`  ${d}: ${n}`);
});
console.log();
if (issues.length > 0) {
  console.log('=== ISSUES FOUND (' + issues.length + ') ===');
  issues.slice(0, 50).forEach(i => console.log('  ' + i));
  if (issues.length > 50) console.log(`  ... and ${issues.length - 50} more`);
}
