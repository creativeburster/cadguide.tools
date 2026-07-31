const fs = require('fs');
const path = require('path');
const dir = 'f:/cadguide.tools/src/content/guides';
const tools = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());
let total = 0;
const result = [];
for (const t of tools) {
  const files = fs.readdirSync(path.join(dir, t)).filter(f => f.endsWith('.md'));
  total += files.length;
  result.push({ tool: t, count: files.length, files: files });
}
result.sort((a, b) => b.count - a.count);
console.log('Tools: ' + tools.length);
console.log('Total guides: ' + total);
console.log('---');

// New guides (batch 1-7) - 35 guides
const newTools = ['staad-pro','abaqus','navisworks','gerber-accumark','lectra-modaris',
  'siemens-nx','allplan','autocad-plant-3d','comsol-multiphysics','cypecad',
  'idea-statica','midas-civil','3dexperience','actcad','alibre-design',
  'ansys-workbench','autodesk-inventor','ptc-creo','bricscad','etabs',
  'altair-hyperworks','ansys-fluent','ares-commander','autocad','autodesk-construction-cloud',
  'autodesk-robot','bimcollab','bluebeam-revu','cadworx','caesar-ii',
  'camworks','carlson-survey','chief-architect','cimatron','diptrace'];

let newCount = 0;
let oldCount = 0;
const oldGuides = [];
for (const r of result) {
  const isNew = newTools.includes(r.tool);
  const label = isNew ? 'NEW' : 'OLD';
  console.log(r.tool + ': ' + r.count + ' [' + label + ']');
  if (isNew) {
    newCount += r.count;
  } else {
    oldCount += r.count;
    oldGuides.push(r);
  }
}
console.log('---');
console.log('New (batch 1-7): ' + newCount + ' guides across ' + newTools.length + ' tools');
console.log('Old (remaining): ' + oldCount + ' guides across ' + oldGuides.length + ' tools');
console.log('Total: ' + total);
