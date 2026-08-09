#!/usr/bin/env node
/**
 * fix-short-descriptions.js
 *
 * Expands toolbox-data.ts descriptions that are shorter than 70 characters
 * by appending a context-appropriate suffix derived from the tool's category
 * and existing description content.
 *
 * Usage:
 *   node scripts/fix-short-descriptions.js          # Apply fixes
 *   node scripts/fix-short-descriptions.js --dry    # Preview only
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(process.cwd(), 'src', 'lib', 'toolbox-data.ts');
const MIN_LEN = 70;
const isDryRun = process.argv.includes('--dry');

// Category-specific suffix patterns
function buildSuffix(description, title, category) {
  const d = description.trim();
  const ending = d.endsWith('.') ? '' : '.';

  // Detect common calculator verb patterns to avoid repetition
  const isConvert = /^convert between/i.test(d);
  const isCalc = /^calculate /i.test(d);

  if (isConvert) {
    return `${ending} Free online engineering unit converter.`;
  }

  switch (category) {
    case 'cheatsheet':
      return `${ending} Free printable reference for CAD engineers.`;
    case 'calculator':
      if (isCalc) {
        return `${ending} Free browser-based engineering calculator.`;
      }
      return `${ending} Free online engineering calculator.`;
    case 'converter':
      return `${ending} Runs locally in your browser, no upload needed.`;
    case 'troubleshoot':
      return `${ending} Step-by-step guided diagnostic for CAD engineers.`;
    default:
      return `${ending} Free tool for CAD and engineering professionals.`;
  }
}

function main() {
  const content = fs.readFileSync(FILE, 'utf-8');

  // Parse all description entries with their position in the file
  // We need to match multi-line context to get category too
  // Strategy: match each full tool object block to extract slug, description, category

  // Match description lines
  const descRegex = /description: '([^']+)'/g;
  
  // Build a map of line positions for category context
  const lines = content.split('\n');

  let fixCount = 0;
  let newContent = content;
  const fixes = [];

  // Find all description matches
  let match;
  const regex = /description: '([^']+)'/g;
  
  while ((match = regex.exec(content)) !== null) {
    const desc = match[1];
    if (desc.length >= MIN_LEN) continue;

    // Find the category for this tool by scanning backward from match.index
    const before = content.slice(0, match.index);
    
    // Find the last category: field before this description
    const catMatch = before.match(/.*category: '([^']+)'/s);
    const category = catMatch ? catMatch[1] : 'calculator';

    // Find the title for this tool
    const titleMatch = before.match(/.*title: '([^']+)'/s);
    const title = titleMatch ? titleMatch[1] : '';

    const suffix = buildSuffix(desc, title, category);
    const newDesc = desc + suffix;

    fixes.push({
      original: desc,
      fixed: newDesc,
      origLen: desc.length,
      newLen: newDesc.length,
      category,
    });

    fixCount++;
  }

  if (isDryRun) {
    console.log(`[DRY RUN] Found ${fixCount} short descriptions to fix:\n`);
    fixes.forEach(f => {
      console.log(`  [${f.origLen} -> ${f.newLen}] (${f.category})`);
      console.log(`  Before: ${f.original}`);
      console.log(`  After:  ${f.fixed}`);
      console.log('');
    });
    return;
  }

  // Apply all replacements (replace original description string with fixed one)
  // We do this in reverse order by match index to preserve positions
  const matches = [];
  const re2 = /description: '([^']+)'/g;
  let m2;
  while ((m2 = re2.exec(content)) !== null) {
    const desc = m2[1];
    if (desc.length >= MIN_LEN) continue;

    const before = content.slice(0, m2.index);
    const catMatch = before.match(/.*category: '([^']+)'/s);
    const category = catMatch ? catMatch[1] : 'calculator';
    const titleMatch = before.match(/.*title: '([^']+)'/s);
    const title = titleMatch ? titleMatch[1] : '';

    const suffix = buildSuffix(desc, title, category);
    matches.push({
      start: m2.index + "description: '".length,
      end: m2.index + "description: '".length + desc.length,
      original: desc,
      fixed: desc + suffix,
    });
  }

  // Apply in reverse to preserve indices
  matches.reverse();
  let result = content;
  for (const fix of matches) {
    result = result.slice(0, fix.start) + fix.fixed + result.slice(fix.end);
  }

  fs.writeFileSync(FILE, result, 'utf-8');

  console.log(`✓ Fixed ${fixCount} short descriptions in toolbox-data.ts`);
  console.log('');
  console.log('Summary of changes:');
  fixes.forEach(f => {
    console.log(`  ${f.origLen} -> ${f.newLen} chars | ${f.original.slice(0, 50)}...`);
  });
}

main();
