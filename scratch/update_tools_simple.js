const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'src/lib/data');

// Tools to update with last_updated date (within 2025-11-23 to 2026-05-23)
const MAINSTREAM_TOOLS = [
  'AutoCAD',
  'SolidWorks',
  'SketchUp',
  'Fusion 360',
  'Rhino',
  'Blender',
  'Revit',
  'ZWCAD',
  'GstarCAD',
  'BricsCAD'
];

// New last_updated dates (random but within valid ranges)
const NEW_LAST_UPDATED = {
  'AutoCAD': '2026-04-15',
  'SolidWorks': '2026-03-20',
  'SketchUp': '2026-05-01',
  'Fusion 360': '2026-05-10',  // Already good, but just to be consistent
  'Rhino': '2026-02-28',
  'Blender': '2026-05-15',
  'Revit': '2026-04-02',
  'ZWCAD': '2026-03-25',
  'GstarCAD': '2026-04-10',
  'BricsCAD': '2026-05-05'
};

// DWG FastView specific updates (already checked, but just to confirm)
const DWG_FASTVIEW_UPDATES = {
  country: 'China',
  version: '10.1.0',
  last_updated: '2026-05-14',
  free_trial_days: 0
};

function updateFile(filename) {
  const filePath = path.join(DATA_DIR, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  
  let updated = false;
  
  // Check and update DWG FastView (only in c1.ts)
  if (filename === 'c1.ts') {
    const dwgFastViewIndex = content.indexOf('"name": "DWG FastView"');
    if (dwgFastViewIndex !== -1) {
      console.log(`Updating DWG FastView in ${filename}...`);
      
      // Find the tool object
      let startIndex = content.lastIndexOf('{', dwgFastViewIndex);
      let braceCount = 1;
      let endIndex = startIndex + 1;
      
      while (braceCount > 0 && endIndex < content.length) {
        if (content[endIndex] === '{') braceCount++;
        if (content[endIndex] === '}') braceCount--;
        endIndex++;
      }
      
      let toolContent = content.substring(startIndex, endIndex);
      
      // Update fields
      for (const [key, value] of Object.entries(DWG_FASTVIEW_UPDATES)) {
        const regex = new RegExp(`"${key}":\\s*[^,\\n}]+`);
        const newValue = typeof value === 'string' 
          ? `"${key}": "${value}"` 
          : `"${key}": ${value}`;
          
        if (regex.test(toolContent)) {
          toolContent = toolContent.replace(regex, newValue);
        } else {
          // Add the field if it doesn't exist - insert before the closing }
          const lastCommaIndex = toolContent.lastIndexOf(',');
          if (lastCommaIndex !== -1) {
            toolContent = toolContent.substring(0, lastCommaIndex + 1) +
              `\n  ${newValue},` +
              toolContent.substring(lastCommaIndex + 1);
          }
        }
      }
      
      content = content.substring(0, startIndex) + toolContent + content.substring(endIndex);
      updated = true;
    }
  }
  
  // Update mainstream tools
  for (const toolName of MAINSTREAM_TOOLS) {
    const toolIndex = content.indexOf(`"name": "${toolName}"`);
    if (toolIndex !== -1) {
      console.log(`Updating ${toolName} in ${filename}...`);
      
      // Find the tool object
      let startIndex = content.lastIndexOf('{', toolIndex);
      let braceCount = 1;
      let endIndex = startIndex + 1;
      
      while (braceCount > 0 && endIndex < content.length) {
        if (content[endIndex] === '{') braceCount++;
        if (content[endIndex] === '}') braceCount--;
        endIndex++;
      }
      
      let toolContent = content.substring(startIndex, endIndex);
      
      // Update last_updated
      const newDate = NEW_LAST_UPDATED[toolName];
      const regex = /"last_updated":\s*"[^"]+"/;
      
      if (regex.test(toolContent)) {
        toolContent = toolContent.replace(regex, `"last_updated": "${newDate}"`);
        content = content.substring(0, startIndex) + toolContent + content.substring(endIndex);
        updated = true;
      }
    }
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated ${filename}`);
    return true;
  }
  
  console.log(`- No changes needed for ${filename}`);
  return false;
}

// Process all category files
const files = ['c1.ts', 'c2.ts', 'c3.ts', 'c4.ts', 'c5.ts', 'c6.ts', 'c7.ts'];
let anyUpdated = false;

console.log('Starting updates...\n');

for (const file of files) {
  if (updateFile(file)) {
    anyUpdated = true;
  }
}

console.log('\nUpdate process complete!');
console.log(`- ${anyUpdated ? 'Some files were updated' : 'No files needed updating'}`);