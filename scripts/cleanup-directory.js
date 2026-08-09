// scripts/cleanup-directory.js
// Removes deprecated/obscure tools from data/c1-c7.ts files
// Uses brace-depth tracking to find exact tool object boundaries

const fs = require('fs');
const path = require('path');

const TOOLS_TO_REMOVE = [
  'actcad', 'arcsite', 'cadian', 'cadopia', 'cadra', 'ijcad', 'medusa4', 'rootpro-cad', 'updraw', 'uvcad', 'v-nas',
  'think3', 't-flex-cad', 'varicad', 'crowncad', 'ironcad', 'keycreator',
  'bimoffice', 'eberick', 'edificius', 'edilus', 'hicad', 'tekton3d', 'renga', 'model-studio-cs',
  'beckercad', 'cadmeister', 'metacam', 'oofelie', 'sinovation', 'woodwop', 'esi-visual-environment', 'lusas', 'opencascade',
  'target-3001', 'quadcept', 'cr-8000', 'pulsonix', 'synopsys-fusion-compiler',
  'foran', 'napa', 'shipconstructor', 'icad3d-plus', 'imos-ix', 'kd-max', 'palette-cad', 'pc-schematic', 'promine', 'pytha', 'rhinogold', 'shoemaster', 'wysiwyg', 'jewelcad-pro', '3design', 'exocad', 'lectra-modaris', 'optitex', 'browzwear', 'gerber-accumark', 'cabinet-vision', 'promob', 'pconplanner', 'land-fx', '20-20-design',
];

const DATA_DIR = path.join(__dirname, '..', 'src', 'lib', 'data');

function removeToolFromFile(filePath, slugsToRemove) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const removeSet = new Set(slugsToRemove);
  const linesToRemove = new Set();

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    const slugMatch = trimmed.match(/^slug:\s*["']([^"']+)["']/);
    if (slugMatch && removeSet.has(slugMatch[1])) {
      // Find opening { — search backwards for a line that is exactly "{"
      let start = i;
      while (start > 0) {
        if (lines[start].trim() === '{') break;
        start--;
      }

      // Find closing } — search forwards tracking brace depth
      // Start from the opening { line, count { and } characters
      let end = start;
      let depth = 0;
      while (end < lines.length) {
        const t = lines[end].trim();
        // Count opening and closing braces on this line
        // We need to be careful with strings containing braces, but in these data files
        // braces only appear as object delimiters
        for (const ch of lines[end]) {
          if (ch === '{') depth++;
          else if (ch === '}') depth--;
        }
        // When depth returns to 0, we've found the closing brace
        if (depth === 0 && end > start) break;
        end++;
      }

      for (let j = start; j <= end; j++) {
        linesToRemove.add(j);
      }
      console.log(`  Removing "${slugMatch[1]}" (lines ${start + 1}-${end + 1})`);
    }
  }

  const newLines = lines.filter((_, idx) => !linesToRemove.has(idx));

  // Clean up multiple consecutive blank lines (max 1)
  const cleaned = [];
  let prevBlank = false;
  for (const line of newLines) {
    const isBlank = line.trim() === '';
    if (isBlank && prevBlank) continue;
    cleaned.push(line);
    prevBlank = isBlank;
  }

  const removedCount = lines.length - cleaned.length;
  if (removedCount > 0) {
    fs.writeFileSync(filePath, cleaned.join('\n'), 'utf8');
    console.log(`  Removed ${removedCount} lines from ${path.basename(filePath)}`);
  }
  return removedCount;
}

const files = ['c1.ts', 'c2.ts', 'c3.ts', 'c4.ts', 'c5.ts', 'c6.ts', 'c7.ts'];
let totalRemoved = 0;

for (const file of files) {
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) continue;

  const content = fs.readFileSync(filePath, 'utf8');
  const slugsInFile = [];
  for (const slug of TOOLS_TO_REMOVE) {
    const escaped = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`slug:\\s*["']${escaped}["']`).test(content)) {
      slugsInFile.push(slug);
    }
  }

  if (slugsInFile.length === 0) {
    console.log(`${file}: no tools to remove`);
    continue;
  }

  console.log(`\n${file}: removing ${slugsInFile.length} tools`);
  removeToolFromFile(filePath, slugsInFile);
  totalRemoved += slugsInFile.length;
}

console.log(`\nTotal tools removed: ${totalRemoved}`);
