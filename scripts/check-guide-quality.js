#!/usr/bin/env node
/**
 * Guide Quality Checker
 * Validates markdown guide files for:
 * 1. Language consistency (English only, no Chinese characters)
 * 2. Frontmatter completeness (title, excerpt, category, softwareSlug, keyword, slug, author, readTime, date, sources)
 * 3. Source link quality (must be specific URLs, not homepages)
 * 4. Content-title match (keyword from title must appear in body)
 * 5. Word count (minimum 1000 words)
 * 6. No template phrases (detect AI template patterns)
 */

const fs = require('fs');
const path = require('path');

const GUIDES_DIR = path.join(__dirname, '..', 'src', 'content', 'guides');

const REQUIRED_FRONTMATTER = [
  'title', 'excerpt', 'category', 'softwareSlug', 'keyword', 'slug', 'author', 'readTime', 'date', 'sources'
];

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

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fmText = match[1];
  const fm = {};
  
  // Simple YAML parsing for our flat structure
  const lines = fmText.split('\n');
  let currentKey = null;
  let inList = false;
  
  for (const line of lines) {
    const kvMatch = line.match(/^(\w+):\s*"?(.*?)"?$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      fm[currentKey] = kvMatch[2];
      inList = false;
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
  // Remove frontmatter
  const body = text.replace(/^---\n[\s\S]*?\n---\n/, '');
  // Remove code blocks
  const noCode = body.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  const noInline = noCode.replace(/`[^`]+`/g, '');
  // Remove markdown formatting
  const noMd = noInline.replace(/[#*_>\-|]/g, ' ');
  // Split and count
  return noMd.split(/\s+/).filter(w => w.length > 0).length;
}

function hasChinese(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(GUIDES_DIR, filePath);
  const issues = [];
  
  // 1. Frontmatter check
  const fm = extractFrontmatter(content);
  if (!fm) {
    issues.push('CRITICAL: No frontmatter found');
  } else {
    for (const key of REQUIRED_FRONTMATTER) {
      if (!fm[key]) {
        issues.push(`CRITICAL: Missing frontmatter field: ${key}`);
      }
    }
  }
  
  // 2. Language check
  if (hasChinese(content)) {
    // Find Chinese characters and their context
    const chineseMatches = content.match(/[\u4e00-\u9fff]+/g);
    if (chineseMatches) {
      issues.push(`CRITICAL: Contains Chinese characters (${chineseMatches.length} occurrences)`);
    }
  }
  
  // 3. Template phrase check
  for (const phrase of TEMPLATE_PHRASES) {
    if (content.includes(phrase)) {
      issues.push(`CRITICAL: Contains template phrase: "${phrase.substring(0, 30)}..."`);
    }
  }
  
  // 4. Word count check
  const wordCount = countWords(content);
  if (wordCount < 1000) {
    issues.push(`WARNING: Low word count: ${wordCount} (minimum 1000)`);
  }
  
  // 5. Source link quality
  if (fm && fm.sources) {
    const sources = Array.isArray(fm.sources) ? fm.sources : [fm.sources];
    for (const src of sources) {
      if (src) {
        for (const pattern of HOMEPAGE_PATTERNS) {
          if (pattern.test(src)) {
            issues.push(`WARNING: Source link is a homepage, not specific: ${src}`);
          }
        }
      }
    }
  }
  
  // 6. Content-title match (check that all keyword words appear in body)
  if (fm && fm.title && fm.keyword) {
    const body = content.replace(/^---\n[\s\S]*?\n---\n/, '').toLowerCase();
    const keyword = fm.keyword.toLowerCase();
    const keywordWords = keyword.split(/\s+/).filter(w => w.length > 2);
    const missingWords = keywordWords.filter(w => !body.includes(w));
    if (missingWords.length > 0) {
      issues.push(`WARNING: Keyword words not found in body: ${missingWords.join(', ')}`);
    }
  }
  
  // 7. Source domain match with softwareSlug
  if (fm && fm.softwareSlug && fm.sources) {
    const sources = Array.isArray(fm.sources) ? fm.sources : [fm.sources];
    const softwareDomainMap = {
      'autocad': ['autodesk.com', 'autodesk.net'],
      'revit': ['autodesk.com', 'autodesk.net'],
      'solidworks': ['solidworks.com', '3ds.com'],
      'catia': ['3ds.com'],
      'ansys': ['ansys.com'],
      'creo': ['ptc.com'],
      'freecad': ['freecad.org', 'freecadweb.org'],
      'siemens-nx': ['siemens.com', 'sw.siemens.com'],
      'rhino': ['mcneel.com', 'rhino3d.com'],
      'microstation': ['bentley.com'],
      'altium-designer': ['altium.com'],
      'openscad': ['openscad.org', 'github.com/openscad'],
    };
    const validDomains = softwareDomainMap[fm.softwareSlug] || [];
    if (validDomains.length > 0) {
      for (const src of sources) {
        if (src) {
          const matchesDomain = validDomains.some(d => src.includes(d));
          if (!matchesDomain && !src.includes('forum.') && !src.includes('community.')) {
            // Check if it's a generic forum/community link for the right brand
            const isRelevant = validDomains.some(d => {
              const brand = d.split('.')[0];
              return src.toLowerCase().includes(brand);
            });
            if (!isRelevant) {
              issues.push(`WARNING: Source domain may not match software: ${src} (expected: ${validDomains.join(' or ')})`);
            }
          }
        }
      }
    }
  }
  
  return { file: relativePath, issues, wordCount, hasFrontmatter: !!fm };
}

function main() {
  const results = [];
  
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith('.md')) {
        results.push(checkFile(fullPath));
      }
    }
  }
  
  scanDir(GUIDES_DIR);
  
  // Report
  console.log('\n=== Guide Quality Report ===\n');
  
  let totalFiles = 0;
  let cleanFiles = 0;
  let criticalIssues = 0;
  let warnings = 0;
  
  for (const result of results) {
    totalFiles++;
    const criticals = result.issues.filter(i => i.startsWith('CRITICAL'));
    const warns = result.issues.filter(i => i.startsWith('WARNING'));
    
    if (criticals.length === 0 && warns.length === 0) {
      cleanFiles++;
      console.log(`✅ ${result.file} (${result.wordCount} words)`);
    } else {
      console.log(`❌ ${result.file} (${result.wordCount} words)`);
      for (const issue of result.issues) {
        console.log(`   ${issue}`);
        if (issue.startsWith('CRITICAL')) criticalIssues++;
        else warnings++;
      }
    }
  }
  
  console.log(`\n=== Summary ===`);
  console.log(`Total files: ${totalFiles}`);
  console.log(`Clean files: ${cleanFiles}`);
  console.log(`Files with issues: ${totalFiles - cleanFiles}`);
  console.log(`Critical issues: ${criticalIssues}`);
  console.log(`Warnings: ${warnings}`);
  
  if (criticalIssues > 0) {
    process.exit(1);
  }
}

main();
