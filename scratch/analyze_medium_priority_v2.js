#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'lib', 'data');

const files = ['c1.ts', 'c2.ts', 'c3.ts', 'c4.ts', 'c5.ts', 'c6.ts', 'c7.ts'];

// 已完成的高优先级工具（34个）
const COMPLETED_TOOLS = new Set([
  'autocad', 'autocad-lt', 'civil-3d', 'revit', 'inventor', 'fusion-360',
  '3ds-max', 'maya', 'navisworks', 'solidworks', 'catia', 'siemens-nx',
  'solidedge', 'blender', 'freecad', 'openscad', 'rhino-3d', 'sketchup',
  'bricsys-bricscad', 'enscape', 'lumion', 'twinmotion', 'v-ray', 'keyshot',
  'archicad', 'tekla-structures', 'microstation', 'mastercam', 'powermill',
  'ultimaker-cura', 'prusaslicer', 'simplify3d', 'tinkercad', 'onshape',
  'shapr3d', 'draftsight', 'zwcad', 'nanocad'
]);

// 中高优先级工具列表（需要人工核实）
const MEDIUM_PRIORITY_TOOLS = [
  // CAE/仿真
  { slug: 'ansys', name: 'ANSYS', category: 'CAE' },
  { slug: 'ansys-mechanical', name: 'ANSYS Mechanical', category: 'CAE' },
  { slug: 'ansys-fluent', name: 'ANSYS Fluent', category: 'CAE' },
  { slug: 'comsol-multiphysics', name: 'COMSOL Multiphysics', category: 'CAE' },
  { slug: 'abaqus', name: 'Abaqus', category: 'CAE' },
  { slug: 'simcenter-star-ccm', name: 'Simcenter STAR-CCM+', category: 'CAE' },
  { slug: 'ls-dyna', name: 'LS-DYNA', category: 'CAE' },
  { slug: 'altair-hyperworks', name: 'Altair HyperWorks', category: 'CAE' },
  { slug: 'autodesk-netfabb', name: 'Autodesk Netfabb', category: 'CAE' },
  { slug: 'moldflow', name: 'Autodesk Moldflow', category: 'CAE' },
  { slug: 'moldex3d', name: 'Moldex3D', category: 'CAE' },
  
  // CAM
  { slug: 'solidcam', name: 'SolidCAM', category: 'CAM' },
  { slug: 'featurecam', name: 'FeatureCAM', category: 'CAM' },
  { slug: 'hypermill', name: 'hyperMILL', category: 'CAM' },
  { slug: 'edgecam', name: 'Edgecam', category: 'CAM' },
  { slug: 'worknc', name: 'WorkNC', category: 'CAM' },
  { slug: 'cimatron', name: 'Cimatron', category: 'CAM' },
  { slug: 'gibbscam', name: 'GibbsCAM', category: 'CAM' },
  { slug: 'camworks', name: 'CAMWorks', category: 'CAM' },
  { slug: 'alphacam', name: 'AlphaCAM', category: 'CAM' },
  { slug: 'radan', name: 'Radan', category: 'CAM' },
  { slug: 'lantek-expert', name: 'Lantek Expert', category: 'CAM' },
  { slug: 'pytha', name: 'PYTHA', category: 'CAM' },
  
  // EDA/PCB
  { slug: 'altium-designer', name: 'Altium Designer', category: 'EDA' },
  { slug: 'eagle', name: 'EAGLE', category: 'EDA' },
  { slug: 'pads-professional', name: 'Mentor PADS', category: 'EDA' },
  { slug: 'orcad', name: 'OrCAD', category: 'EDA' },
  { slug: 'allegro-pcb', name: 'Cadence Allegro', category: 'EDA' },
  { slug: 'proteus-design-suite', name: 'Proteus', category: 'EDA' },
  { slug: 'kicad', name: 'KiCad', category: 'EDA' },
  { slug: 'easyeda', name: 'EasyEDA', category: 'EDA' },
  { slug: 'circuitmaker', name: 'CircuitMaker', category: 'EDA' },
  { slug: 'pulsonix', name: 'Pulsonix', category: 'EDA' },
  
  // CAD/MCAD
  { slug: 'ironcad', name: 'IronCAD', category: 'MCAD' },
  { slug: 'alibre-design', name: 'Alibre Design', category: 'MCAD' },
  { slug: 'topsolid', name: 'TopSolid', category: 'MCAD' },
  { slug: 'caxa-cad', name: 'CAXA CAD', category: 'MCAD' },
  { slug: 'sinovation', name: 'SINOVATION', category: 'MCAD' },
  { slug: 'corelcad', name: 'CorelCAD', category: 'MCAD' },
  { slug: 'progecad', name: 'progeCAD', category: 'MCAD' },
  { slug: 'qcad', name: 'QCAD', category: 'MCAD' },
  { slug: 'librecad', name: 'LibreCAD', category: 'MCAD' },
  { slug: 'meshlab', name: 'MeshLab', category: 'MCAD' },
  
  // BIM/建筑
  { slug: 'vectorworks', name: 'Vectorworks', category: 'BIM' },
  { slug: 'allplan', name: 'ALLPLAN', category: 'BIM' },
  { slug: 'hicad', name: 'HiCAD', category: 'BIM' },
  { slug: 'cadwork', name: 'Cadwork', category: 'BIM' },
  
  // 渲染
  { slug: 'corona-renderer', name: 'Corona Renderer', category: 'Rendering' },
  { slug: 'octane-render', name: 'Octane Render', category: 'Rendering' },
  { slug: 'redshift', name: 'Redshift', category: 'Rendering' },
  { slug: 'arnold', name: 'Arnold', category: 'Rendering' },
  
  // 数字艺术
  { slug: 'zbrush', name: 'ZBrush', category: 'Digital Art' },
  { slug: 'substance-painter', name: 'Substance Painter', category: 'Digital Art' },
  { slug: 'marvelous-designer', name: 'Marvelous Designer', category: 'Digital Art' },
  { slug: 'clo-3d', name: 'CLO 3D', category: 'Digital Art' },
  
  // 土木工程
  { slug: 'midas-civil', name: 'Midas Civil', category: 'Civil' },
  { slug: 'midas-gen', name: 'Midas GEN', category: 'Civil' },
  { slug: 'sap2000', name: 'SAP2000', category: 'Civil' },
  { slug: 'etabs', name: 'ETABS', category: 'Civil' },
  { slug: 'staad-pro', name: 'STAAD.Pro', category: 'Civil' },
  { slug: 'autopipe', name: 'AutoPIPE', category: 'Civil' },
  { slug: 'caesar-ii', name: 'CAESAR II', category: 'Civil' },
  
  // 电气CAD
  { slug: 'eplan-electric-p8', name: 'EPLAN Electric P8', category: 'Electrical' },
  { slug: 'eplan', name: 'EPLAN', category: 'Electrical' },
  { slug: 'seeelectrical', name: 'SEE Electrical', category: 'Electrical' },
  
  // 3D打印
  { slug: 'geomagic-design-x', name: 'Geomagic Design X', category: '3D Print' },
  { slug: 'magics', name: 'Magics', category: '3D Print' },
  { slug: 'autodesk-netfabb', name: 'Netfabb', category: '3D Print' },
  
  // PLM/数据管理
  { slug: 'teamcenter', name: 'Siemens Teamcenter', category: 'PLM' },
  
  // 其他专业
  { slug: 'lectra-modaris', name: 'Lectra Modaris', category: 'Specialized' },
  { slug: 'gerber-accumark', name: 'Gerber Accumark', category: 'Specialized' },
  { slug: 'jewelcad-pro', name: 'JewelCAD Pro', category: 'Specialized' },
  { slug: 'carlson-survey', name: 'Carlson Survey', category: 'Specialized' },
];

// 按类别分组
const byCategory = {};
MEDIUM_PRIORITY_TOOLS.forEach(tool => {
  if (!byCategory[tool.category]) {
    byCategory[tool.category] = [];
  }
  byCategory[tool.category].push(tool);
});

console.log('=== 中优先级工具核实计划 ===\n');
console.log(`总共需要核实: ${MEDIUM_PRIORITY_TOOLS.length} 个重要工具\n`);

// 按难度分类
const difficulty = {
  easy: [],   // 大型知名厂商，容易搜索
  medium: [], // 中型厂商，有官方网站
  hard: [],   // 小众或专业工具
};

// 大型知名厂商（容易）
['ANSYS', 'Altium', 'EAGLE', 'SolidWorks', 'Siemens', 'Autodesk', 'ZBrush', 
 'Substance', 'EPLAN', 'SAP2000', 'STAAD', 'COMSOL', 'Moldflow', 'Moldex3D',
 'OrCAD', 'Allegro', 'KiCad'].forEach(name => {
  const tool = MEDIUM_PRIORITY_TOOLS.find(t => t.name.includes(name));
  if (tool) difficulty.easy.push(tool);
});

// 中等难度
['Cimatron', 'HyperMILL', 'FeatureCAM', 'GibbsCAM', 'WorkNC', 'AlphaCAM', 
 'Radan', 'Lantek', 'IronCAD', 'Alibre', 'TopSolid', 'CAXA', 'SINOVATION',
 'CorelCAD', 'QCAD', 'LibreCAD', 'MeshLab', 'Vectorworks', 'ALLPLAN', 
 'Midas', 'CAESAR', 'AutoPIPE', 'Proteus', 'EasyEDA', 'Pulsonix'].forEach(name => {
  const tool = MEDIUM_PRIORITY_TOOLS.find(t => t.name.includes(name));
  if (tool && !difficulty.easy.includes(tool)) difficulty.medium.push(tool);
});

// 困难/专业
['Corona', 'Octane', 'Redshift', 'Arnold', 'Marvelous', 'CLO', 'Lectra',
 'Gerber', 'JewelCAD', 'Carlson', 'HiCAD', 'Cadwork'].forEach(name => {
  const tool = MEDIUM_PRIORITY_TOOLS.find(t => t.name.includes(name));
  if (tool && !difficulty.easy.includes(tool) && !difficulty.medium.includes(tool)) {
    difficulty.hard.push(tool);
  }
});

console.log('=== 按搜索难度分类 ===\n');

console.log('🟢 简单搜索 (知名大厂):', difficulty.easy.length, '个');
difficulty.easy.forEach(t => console.log(`   - ${t.name}`));
console.log('');

console.log('🟡 中等搜索 (中型厂商):', difficulty.medium.length, '个');
difficulty.medium.forEach(t => console.log(`   - ${t.name}`));
console.log('');

console.log('🔴 困难搜索 (小众/专业):', difficulty.hard.length, '个');
difficulty.hard.forEach(t => console.log(`   - ${t.name}`));
console.log('');

console.log('=== 预计工作量 ===\n');
const easyTime = difficulty.easy.length * 3;
const mediumTime = difficulty.medium.length * 7;
const hardTime = difficulty.hard.length * 12;
const totalTime = easyTime + mediumTime + hardTime;

console.log(`简单搜索: ${difficulty.easy.length} × 3分钟 = ${easyTime}分钟`);
console.log(`中等搜索: ${difficulty.medium.length} × 7分钟 = ${mediumTime}分钟`);
console.log(`困难搜索: ${difficulty.hard.length} × 12分钟 = ${hardTime}分钟`);
console.log(`总计: ${totalTime}分钟 (约${Math.ceil(totalTime/60)}小时)\n`);

console.log('=== 按类别分布 ===\n');
Object.entries(byCategory).forEach(([cat, tools]) => {
  console.log(`${cat}: ${tools.length}个`);
  tools.forEach(t => console.log(`   - ${t.name}`));
  console.log('');
});

console.log('=== 建议执行策略 ===\n');
console.log('1. 分批执行: 每次搜索10-15个工具');
console.log('2. 从简单到困难: 先搜索大厂，再搜索中型厂商，最后搜索专业工具');
console.log('3. 批量处理: 同一厂商的工具一起搜索');
console.log('4. 自动化: 创建脚本批量更新数据');
console.log('');
console.log('预计完成时间: 6-8小时（持续工作）');
console.log('建议分3-4次会话完成');
