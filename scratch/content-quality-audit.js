const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const dir = 'f:/cadguide.tools/src/content/guides';
const newTools = ['staad-pro','abaqus','navisworks','gerber-accumark','lectra-modaris',
  'siemens-nx','allplan','autocad-plant-3d','comsol-multiphysics','cypecad',
  'idea-statica','midas-civil','3dexperience','actcad','alibre-design',
  'ansys-workbench','autodesk-inventor','ptc-creo','bricscad','etabs',
  'altair-hyperworks','ansys-fluent','ares-commander','autocad','autodesk-construction-cloud',
  'autodesk-robot','bimcollab','bluebeam-revu','cadworx','caesar-ii',
  'camworks','carlson-survey','chief-architect','cimatron','diptrace'];

const tools = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());

// Signals for quality assessment
const forumPatterns = [
  /forums?\.(autodesk|solidworks|ptc|altair|bricsys|bluebeam|chiefarchitect|carlsonsw|cimatron|diptrace|eng-tips|cadtutor|practicalmachinist|chieftalk|solibri|hexagonppm|graebert)\.(com|net|org)/i,
  /community\.(ptc|altair|autodesk|solidworks)\.com/i,
  /society\.solibri\.com/i,
  /cfd-online\.com/i,
  /grabcad\.com/i,
  /forum\.(cimatron|diptrace|bricsys|bluebeam)\.com/i,
  /reddit\.com\/r\//i,
  /stackoverflow\.com/i,
  /engineering\.stackexchange\.com/i,
];

const supportPatterns = [
  /support\.(autodesk|solidworks|bluebeam|altium|ptc|hexagonppm|cadence)\.com/i,
  /help\.(autodesk|solidworks|cimatron|altium|ptc|bricsys|chiefarchitect|graebert)\.com/i,
  /helpcenter\.(bimcollab|carlsonsw)\.com/i,
  /knowledge\.autodesk\.com/i,
  /ansyshelp\.ansys\.com/i,
  /docs\.(hexagonppm|autodesk)\.com/i,
  /innovationspace\.ansys\.com/i,
];

const productPagePatterns = [
  /\/products?\//i,
  /\/overview/i,
  /\/features/i,
  /\/pricing/i,
  /autodesk\.com\/products\//i,
  /altium\.com\/documentation\//i,
];

const errorSignals = [
  /error/i, /crash/i, /fail/i, /cannot/i, /can't/i, /won't/i, /unable/i,
  /missing/i, /corrupt/i, /broken/i, /freeze/i, /hang/i, /stuck/i,
  /diverge/i, /fatal/i, /access violation/i, /exception/i,
  /not working/i, /doesn't work/i, /not responding/i,
  /unexpected/i, /incorrect/i, /wrong/i, /blank/i, /gray/i, /grey/i,
];

const tutorialSignals = [
  /step.?by.?step/i, /how to (create|set up|configure|generate|export|import|design|build|model|route|draw)/i,
  /getting started/i, /setup guide/i, /walkthrough/i, /tutorial/i,
  /best practices/i, /tips and tricks/i, /optimization guide/i,
];

const comparisonSignals = [
  /vs\.?( |_) /i, /compared to/i, /comparison/i, /alternativ/i,
  /which (tool|software|is better)/i, /better than/i,
];

const results = [];

for (const t of tools) {
  if (newTools.includes(t)) continue;
  const tdir = path.join(dir, t);
  const files = fs.readdirSync(tdir).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const fpath = path.join(tdir, f);
    const raw = fs.readFileSync(fpath, 'utf-8');
    const { data, content } = matter(raw);
    
    const cat = data.category || 'MISSING';
    const sources = data.sources || [];
    const srcUrls = sources.join(' ');
    const contentLower = content.toLowerCase();
    const titleLower = (data.title || '').toLowerCase();
    const excerptLower = (data.excerpt || '').toLowerCase();
    const fullText = titleLower + ' ' + excerptLower + ' ' + contentLower;
    
    // Check source types
    let hasForumSrc = false;
    let hasSupportSrc = false;
    let hasProductSrc = false;
    let hasBlogSrc = false;
    
    for (const url of sources) {
      if (forumPatterns.some(p => p.test(url))) hasForumSrc = true;
      if (supportPatterns.some(p => p.test(url))) hasSupportSrc = true;
      if (productPagePatterns.some(p => p.test(url))) hasProductSrc = true;
      if (/blog|medium\.com|wordpress|\.pdf$/i.test(url)) hasBlogSrc = true;
    }
    
    // Check content signals
    let errorCount = 0;
    for (const p of errorSignals) {
      const matches = contentLower.match(new RegExp(p.source, p.flags + 'g'));
      if (matches) errorCount += matches.length;
    }
    
    let tutorialCount = 0;
    for (const p of tutorialSignals) {
      const matches = fullText.match(new RegExp(p.source, p.flags + 'g'));
      if (matches) tutorialCount += matches.length;
    }
    
    let comparisonCount = 0;
    for (const p of comparisonSignals) {
      const matches = fullText.match(new RegExp(p.source, p.flags + 'g'));
      if (matches) comparisonCount += matches.length;
    }
    
    // Check for specific error messages in content (quoted text, code blocks)
    const hasErrorCode = /error\s*(code|message|#|:)|0x[0-9a-f]+|exception at/i.test(content);
    const hasSpecificProblem = /"[^"]*(error|crash|fail|cannot|missing|corrupt|broken|freeze|stuck|diverge|fatal)[^"]*"/i.test(content);
    
    // Scoring
    let keepScore = 0;
    let rewriteScore = 0;
    let deleteScore = 0;
    const reasons = [];
    
    // Forum sources = strong signal of search-driven content
    if (hasForumSrc) { keepScore += 3; reasons.push('forum_src'); }
    
    // Support/knowledge base sources = good signal
    if (hasSupportSrc) { keepScore += 2; reasons.push('support_src'); }
    
    // Product page sources = weak signal (documentation, not user problems)
    if (hasProductSrc && !hasForumSrc && !hasSupportSrc) { 
      deleteScore += 2; 
      reasons.push('product_page_only'); 
    }
    
    // Error messages in content = problem-solving
    if (errorCount >= 5) { keepScore += 2; reasons.push('error_rich(' + errorCount + ')'); }
    else if (errorCount >= 2) { keepScore += 1; reasons.push('error_some(' + errorCount + ')'); }
    
    // Specific error codes/messages
    if (hasErrorCode) { keepScore += 1; reasons.push('error_code'); }
    if (hasSpecificProblem) { keepScore += 1; reasons.push('specific_problem'); }
    
    // Comparison content = low search value
    if (comparisonCount >= 3 && cat === 'comparison') { 
      deleteScore += 3; 
      reasons.push('comparison_heavy'); 
    }
    
    // Pure tutorial without problem context
    if (tutorialCount >= 3 && errorCount < 2 && cat === 'workflow') { 
      rewriteScore += 2; 
      reasons.push('tutorial_no_problem'); 
    }
    
    // Deployment/setup guides = usually documentation rehash
    if (cat === 'deployment' && errorCount < 3) { 
      rewriteScore += 2; 
      reasons.push('deployment_rehash'); 
    }
    
    // Category-based signals
    if (cat === 'troubleshooting' && (hasForumSrc || hasSupportSrc) && errorCount >= 3) {
      keepScore += 2;
      reasons.push('troubleshoot_real');
    }
    
    if (cat === 'workflow' && !hasForumSrc && !hasSupportSrc && errorCount < 2) {
      rewriteScore += 1;
      reasons.push('workflow_generic');
    }
    
    if (cat === 'comparison') {
      deleteScore += 1;
      reasons.push('cat_comparison');
    }
    
    if (cat === 'migration' && errorCount >= 2) {
      keepScore += 1;
      reasons.push('migration_real');
    }
    
    if (cat === 'performance' && errorCount >= 2) {
      keepScore += 1;
      reasons.push('perf_real');
    }
    
    // Content length bonus
    const contentLen = content.trim().length;
    if (contentLen > 5000) { keepScore += 1; reasons.push('long(' + contentLen + ')'); }
    if (contentLen < 1500) { deleteScore += 1; reasons.push('short(' + contentLen + ')'); }
    
    // Decision
    let decision = 'REWRITE';
    if (keepScore >= 4 && keepScore > rewriteScore && keepScore > deleteScore) decision = 'KEEP';
    else if (deleteScore >= 3 && deleteScore > keepScore) decision = 'DELETE';
    else if (rewriteScore >= 2 && rewriteScore >= deleteScore) decision = 'REWRITE';
    
    results.push({
      tool: t,
      file: f,
      cat,
      srcCount: sources.length,
      hasForumSrc,
      hasSupportSrc,
      hasProductSrc,
      errorCount,
      tutorialCount,
      comparisonCount,
      contentLen,
      keepScore,
      rewriteScore,
      deleteScore,
      decision,
      reasons: reasons.join(','),
    });
  }
}

// Summary
const keep = results.filter(r => r.decision === 'KEEP');
const rewrite = results.filter(r => r.decision === 'REWRITE');
const del = results.filter(r => r.decision === 'DELETE');

console.log('=== COMPREHENSIVE AUDIT RESULTS ===');
console.log('Total old guides: ' + results.length);
console.log('KEEP: ' + keep.length + ' (' + Math.round(keep.length/results.length*100) + '%)');
console.log('REWRITE: ' + rewrite.length + ' (' + Math.round(rewrite.length/results.length*100) + '%)');
console.log('DELETE: ' + del.length + ' (' + Math.round(del.length/results.length*100) + '%)');
console.log('');

// KEEP guides
console.log('=== KEEP (' + keep.length + ') ===');
keep.sort((a,b) => b.keepScore - a.keepScore);
for (const r of keep) {
  console.log(r.tool + '/' + r.file.substring(0,55) + ' | k:' + r.keepScore + ' | ' + r.reasons);
}
console.log('');

// DELETE guides
console.log('=== DELETE (' + del.length + ') ===');
del.sort((a,b) => b.deleteScore - a.deleteScore);
for (const r of del) {
  console.log(r.tool + '/' + r.file.substring(0,55) + ' | d:' + r.deleteScore + ' | ' + r.reasons);
}
console.log('');

// REWRITE guides
console.log('=== REWRITE (' + rewrite.length + ') ===');
rewrite.sort((a,b) => b.rewriteScore - a.rewriteScore);
for (const r of rewrite) {
  console.log(r.tool + '/' + r.file.substring(0,55) + ' | r:' + r.rewriteScore + ' | ' + r.reasons);
}
console.log('');

// Per-tool summary
console.log('=== PER-TOOL SUMMARY ===');
const toolMap = {};
for (const r of results) {
  if (!toolMap[r.tool]) toolMap[r.tool] = { keep: 0, rewrite: 0, delete: 0, total: 0 };
  toolMap[r.tool].total++;
  toolMap[r.tool][r.decision.toLowerCase()]++;
}
const toolSorted = Object.entries(toolMap).sort((a,b) => b[1].total - a[1].total);
for (const [tool, counts] of toolSorted) {
  console.log(tool + ': ' + counts.total + ' total (K:' + counts.keep + ' R:' + counts.rewrite + ' D:' + counts.delete + ')');
}
