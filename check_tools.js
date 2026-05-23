const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'src/lib/data');

const files = ['c1.ts', 'c2.ts', 'c3.ts'];

files.forEach(file => {
  console.log(`\n=== ${file} ===`);
  const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  
  // Find all tools with name, last_updated, version, country, free_trial_days
  const toolRegex = /\{[^{}]*"name":\s*"([^"]+)"[^{}]*"last_updated":\s*"([^"]+)"[^{}]*\}/g;
  let match;
  
  // Simplified check - just look for the mainstream tools
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
    'BricsCAD',
    'DWG FastView'
  ];
  
  MAINSTREAM_TOOLS.forEach(toolName => {
    const toolIndex = content.indexOf(`"name": "${toolName}"`);
    if (toolIndex !== -1) {
      // Find the tool object
      let startIndex = content.lastIndexOf('{', toolIndex);
      let braceCount = 1;
      let endIndex = startIndex + 1;
      
      while (braceCount > 0 && endIndex < content.length) {
        if (content[endIndex] === '{') braceCount++;
        if (content[endIndex] === '}') braceCount--;
        endIndex++;
      }
      
      const toolContent = content.substring(startIndex, endIndex);
      
      // Extract relevant fields
      const fields = {};
      ['country', 'version', 'last_updated', 'free_trial_days'].forEach(field => {
        const regex = new RegExp(`"${field}":\\s*([^,\\n}]+)`);
        const match = toolContent.match(regex);
        if (match) fields[field] = match[1].trim();
      });
      
      console.log(`\n${toolName}:`);
      console.log(`  country: ${fields.country}`);
      console.log(`  version: ${fields.version}`);
      console.log(`  last_updated: ${fields.last_updated}`);
      console.log(`  free_trial_days: ${fields.free_trial_days}`);
    }
  });
});