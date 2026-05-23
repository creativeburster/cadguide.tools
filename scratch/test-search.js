#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('=== 搜索功能调试 ===\n');

// 模拟 normalizeString
function normalizeString(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// 模拟 determineSearchMode 逻辑
function shouldSearchArticles(query, toolNames) {
  const normalizedQuery = query.toLowerCase().trim();
  
  console.log(`查询: "${query}"`);
  
  // 检查是否是精确工具名
  const isExactToolName = toolNames.some(name => {
    const normalizedName = name.toLowerCase().trim();
    return normalizedName === normalizedQuery;
  });
  
  if (isExactToolName) {
    console.log('✓ 检测到精确工具名 → 搜索工具');
    return false;
  }
  
  // 检查查询词长度
  const wordCount = normalizedQuery.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount >= 3) {
    console.log('✓ 查询词长度 ≥3 → 搜索文章');
    return true;
  }
  
  // 检查文章关键词
  const articleKeywords = [
    'best', 'top', 'free', 'open source', 'vs', 'vs.', 'versus', 'compare', 
    'comparison', 'alternative', 'alternatives', 'like', 'for', 'how to', 
    'what is', 'which', 'software', 'cad', 'viewer', 'editor', 'platform', 
    'mac', 'linux', 'web', 'windows', 'ios', 'android', 'file format', 
    'stl', 'dwg', 'step', 'ifc', 'for architect', 'for engineer', 'guide', 
    'list', 'review', 'comparing'
  ];
  
  const hasArticleKeyword = articleKeywords.some(kw => normalizedQuery.includes(kw));
  if (hasArticleKeyword) {
    console.log(`✓ 检测到文章关键词 → 搜索文章`);
    return true;
  }
  
  console.log('✓ 默认 → 搜索工具');
  return false;
}

// 模拟一些工具名
const testToolNames = [
  'AutoCAD', 'SolidWorks', 'SketchUp', 'Blender', 'Revit',
  'Fusion 360', 'Rhino 3D', 'ArchiCAD', 'Onshape', 'FreeCAD'
];

console.log('测试工具名:', testToolNames.join(', '));
console.log();

// 测试查询
const testQueries = [
  'AutoCAD',
  'SolidWorks',
  'best free CAD',
  'open source CAD',
  'CAD for mac',
  'AutoCAD vs SolidWorks',
  'DWG viewer',
  'free software',
  'Blender',
  'top 3D tools'
];

console.log('测试查询:');
console.log('─'.repeat(60));
testQueries.forEach(query => {
  const result = shouldSearchArticles(query, testToolNames);
  console.log();
});
