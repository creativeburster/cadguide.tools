#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'lib', 'data');

const files = ['c1.ts', 'c2.ts', 'c3.ts', 'c4.ts', 'c5.ts', 'c6.ts', 'c7.ts'];

console.log('=== 所有工具列表 ===\n');

let allTools = [];

for (const f of files) {
  const filePath = path.join(DATA_DIR, f);
  const src = fs.readFileSync(filePath, 'utf8');
  
  // 简单提取工具名称和slug
  const slugMatches = src.match(/slug:\s*"([^"]+"/g) || [];
  const nameMatches = src.match(/name:\s*"([^"]+"/g) || [];
  
  for (let i = 0; i < slugMatches.length; i++) {
    const slug = slugMatches[i].match(/"([^"]+)"/)[1];
    // 找到对应的 name
    // 简化处理，直接收集
  }
  
  // 更简单的方式：直接运行 Node 模块
}

console.log('现在让我们用一个更好的方法...\n');

const IMPORTANT_TOOLS = [
  // Autodesk 系列
  'autocad', 'autocad-lt', 'civil-3d', 'revit', 'inventor', 'fusion-360',
  '3ds-max', 'maya', 'navisworks', 'alias-autostudio', 'autodesk-dynamo',
  'autodesk-construction-cloud',
  
  // Dassault Systèmes
  'catia', 'solidworks', '3dexperience',
  
  // Siemens
  'siemens-nx', 'solidedge',
  
  // PTC
  'creo',
  
  // 其他 MCAD
  'rhino-3d', 'sketchup', 'bricsys-bricscad', 'ironcad', 'alibre-design',
  
  // 开源/免费
  'freecad', 'blender', 'openscad', 'librecad',
  
  // BIM
  'archicad', 'tekla-structures', 'vectorworks', 'microstation',
  
  // 渲染/可视化
  'enscape', 'lumion', 'twinmotion', 'v-ray', 'corona-renderer', 'keyshot',
  
  // CAE
  'ansys', 'ansys-mechanical', 'ansys-fluent', 'comsol-multiphysics',
  'abaqus', 'simcenter-star-ccm',
  
  // CAM
  'mastercam', 'powermill', 'solidcam', 'featurecam', 'hypermill',
  
  // 电气/EDA
  'altium-designer', 'eagle', 'pads-professional', 'orcad',
  
  // 3D 打印切片
  'ultimaker-cura', 'prusaslicer', 'simplify3d',
  
  // 其他知名
  'tinkercad', 'onshape', 'shapr3d', 'draftsight', 'zwcad', 'zw3d',
  'nanocad', 'progecad', 'qcad',
  
  // 更多
  'midas-civil', 'sap2000', 'etabs', 'staad-pro',
  'bluebeam-revu', 'magi-cad', 'moldflow', 'moldex3d',
  'zbrush', 'corelcad', 'meshlab', 'designspark-mechanical'
];

console.log('已确定的重要工具列表（约 80 个）：\n');

IMPORTANT_TOOLS.forEach((tool, i) => {
  console.log(`${i + 1}. ${tool}`);
});

console.log(`\n总计 ${IMPORTANT_TOOLS.length} 个重要工具需要核实。`);
