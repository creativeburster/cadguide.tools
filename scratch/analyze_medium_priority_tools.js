#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'lib', 'data');

const files = ['c1.ts', 'c2.ts', 'c3.ts', 'c4.ts', 'c5.ts', 'c6.ts', 'c7.ts'];

// 高优先级工具（已完成）
const HIGH_PRIORITY_TOOLS = [
  'autocad', 'autocad-lt', 'civil-3d', 'revit', 'inventor', 'fusion-360',
  '3ds-max', 'maya', 'navisworks', 'solidworks', 'catia', 'siemens-nx',
  'solidedge', 'blender', 'freecad', 'openscad', 'rhino-3d', 'sketchup',
  'bricsys-bricscad', 'enscape', 'lumion', 'twinmotion', 'v-ray', 'keyshot',
  'archicad', 'tekla-structures', 'microstation', 'mastercam', 'powermill',
  'ultimaker-cura', 'prusaslicer', 'simplify3d', 'tinkercad', 'onshape',
  'shapr3d', 'draftsight', 'zwcad', 'nanocad'
];

// 中高优先级工具（知名工具，应该核实）
const MEDIUM_HIGH_PRIORITY_TOOLS = [
  // CAE
  'ansys', 'ansys-mechanical', 'ansys-fluent', 'comsol-multiphysics', 'abaqus',
  'simcenter-star-ccm', 'nastran', 'ls-dyna', 'hyperworks',
  
  // CAM
  'solidcam', 'featurecam', 'hypermill', 'edgecam', 'worknc', 'cimatron',
  'gibbscam', 'camworks', 'delcam',
  
  // EDA/Electronics
  'altium-designer', 'eagle', 'pads-professional', 'orcad', 'allegro',
  'proteus', 'kicad', 'easyeda', 'autotronic',
  
  // BIM
  'vectorworks', 'allplan', 'archiCAD', 'bim360', 'glodon',
  
  // Rendering
  'corona-renderer', 'octane-render', 'redshift', 'arnold',
  
  // 其他知名MCAD
  'ironcad', 'alibre-design', 'cimatron', 'topsolid', 'hypermill',
  
  // 电气CAD
  'eplan', 'seeelectrical', 'elcad', 'aufbau',
  
  // 土木工程
  'midas-gen', 'midas-civil', 'sap2000', 'etabs', 'staad-pro',
  'etabs', 'csicol', 'robot-structural',
  
  // 制造/钣金
  'radan', 'lantek', 'truetube', 'pytha',
  
  // PCB
  'circuitmaker', 'pulsonix', 'pcad',
  
  // 3D扫描/逆向
  'geomagic', 'polyworks', 'atlas',
  
  // 3D打印
  'soliworks', 'magics', 'netfabb', 'materialise',
  
  // 其他专业
  'zbrush', 'substance-painter', 'marvelous-designer', 'clo-3d',
  'lectra', 'gerber', 'impact', 'cass',
  
  // 云CAD/协作
  'autodesk-bim360', ' BIM360', 'construction-cloud',
  
  // 数据管理
  'teamcenter', 'windchill', 'enovia', 'agile',
  
  // 仿真
  'moldflow', 'moldex3d', 'polyflow', 'afos',
  
  // 建筑 MEP
  'magi-cad', 'revit-mep', 'hevacomp',
  
  // 家具设计
  'cadwork', 'cadpro', 'alphacam', 'kdv',
  
  // 景观
  'autocad-civil', 'civil-3d', 'inroads', 'geopak',
  
  // 海洋船舶
  // 'shipconstructor', 'foran', ' aveva',
  
  // 其他专业
  'caxa', 'zw3d', 'SINOVATION', 'alibre',
  'corelcad', 'progecad', 'qcad', 'librecad',
  'meshlab', 'cloudcompare', 'pointfuse',
  
  // 机械分析
  'cosmos', 'simulation', 'nastran',
  
  // 管道
  'autopipe', 'caesar-ii', 'pipesim', 'survey',
  
  // 电气系统
  'electrical', 'ecscad', 'schem',
  
  // 液压/气动
  'hydraulics', 'pneumatics', 'fluid',
  
  // 数控
  'ncplot', 'edgemaster', 'sprut',
  
  // 模具
  'dmu', 'molddesigner', '祭器',
];

console.log('=== 中优先级工具分析 ===\n');

// 读取所有工具
let allTools = [];

for (const f of files) {
  const filePath = path.join(DATA_DIR, f);
  const src = fs.readFileSync(filePath, 'utf8');
  
  // 提取工具信息
  const slugMatch = src.match(/slug:\s*"([^"]+)"/g);
  const nameMatch = src.match(/name:\s*"([^"]+)"/g);
  const versionMatch = src.match(/version:\s*"([^"]+)"/g);
  const lastUpdatedMatch = src.match(/last_updated:\s*"([^"]+)"/g);
  
  if (slugMatch) {
    slugMatch.forEach((match, idx) => {
      const slug = match.match(/"([^"]+)"/)[1];
      const name = nameMatch && nameMatch[idx] ? nameMatch[idx].match(/"([^"]+)"/)[1] : slug;
      const hasVersion = versionMatch && versionMatch[idx];
      const hasLastUpdated = lastUpdatedMatch && lastUpdatedMatch[idx];
      
      allTools.push({
        slug,
        name,
        hasVersion: !!hasVersion,
        hasLastUpdated: !!hasLastUpdated,
        isHighPriority: HIGH_PRIORITY_TOOLS.includes(slug),
        isMediumHighPriority: MEDIUM_HIGH_PRIORITY_TOOLS.some(t => 
          slug.includes(t.toLowerCase()) || t.toLowerCase().includes(slug)
        )
      });
    });
  }
}

console.log(`总工具数: ${allTools.length}\n`);

const completed = allTools.filter(t => t.isHighPriority);
const mediumHigh = allTools.filter(t => t.isMediumHighPriority && !t.isHighPriority);
const others = allTools.filter(t => !t.isHighPriority && !t.isMediumHighPriority);

console.log(`✓ 已完成 (高优先级): ${completed.length} 个工具`);
console.log(`⚡ 中高优先级 (需要核实): ${mediumHigh.length} 个工具`);
console.log(`○ 其他工具: ${others.length} 个工具\n`);

console.log('=== 中高优先级工具列表 ===\n');
mediumHigh.forEach((tool, i) => {
  console.log(`${i + 1}. ${tool.name} (${tool.slug})`);
});

console.log('\n=== 分类分析 ===\n');

// 按类别分析
const categories = {
  'CAE/仿真': mediumHigh.filter(t => 
    ['ansys', 'abaqus', 'comsol', 'nastran', 'ls-dyna', 'hyperworks', 'cosmos', 'simulation', 'star-ccm', 'moldflow', 'moldex3d'].some(k => t.slug.includes(k))
  ),
  'CAM': mediumHigh.filter(t => 
    ['solidcam', 'featurecam', 'hypermill', 'edgecam', 'worknc', 'cimatron', 'gibbscam', 'camworks', 'delcam', 'radan', 'lantek', 'pytha'].some(k => t.slug.includes(k))
  ),
  'EDA/PCB': mediumHigh.filter(t => 
    ['altium', 'eagle', 'pads', 'orcad', 'allegro', 'proteus', 'kicad', 'easyeda', 'circuitmaker', 'pulsonix', 'pcad'].some(k => t.slug.includes(k))
  ),
  'CAD/建模': mediumHigh.filter(t => 
    ['ironcad', 'alibre', 'topsolid', 'caxa', 'zw3d', 'sinovation', 'corelcad', 'progecad', 'qcad', 'librecad', 'meshlab'].some(k => t.slug.includes(k))
  ),
  'BIM/建筑': mediumHigh.filter(t => 
    ['vectorworks', 'allplan', 'bim360', 'construction-cloud', 'glodon', 'magi-cad'].some(k => t.slug.includes(k))
  ),
  '渲染/可视化': mediumHigh.filter(t => 
    ['corona', 'octane', 'redshift', 'arnold', 'v-ray'].some(k => t.slug.includes(k))
  ),
  'CAD/CAE': mediumHigh.filter(t => 
    ['zbrush', 'substance', 'marvelous', 'clo-3d', 'lectra', 'gerber'].some(k => t.slug.includes(k))
  ),
  '土木工程': mediumHigh.filter(t => 
    ['midas', 'sap2000', 'etabs', 'staad', 'robot', 'inroads', 'geopak'].some(k => t.slug.includes(k))
  ),
  '电气CAD': mediumHigh.filter(t => 
    ['eplan', 'seeelectrical', 'elcad', 'ecscad', 'schem'].some(k => t.slug.includes(k))
  ),
  '管道/压力容器': mediumHigh.filter(t => 
    ['autopipe', 'caesar', 'pipesim', 'pv-elite'].some(k => t.slug.includes(k))
  ),
};

Object.entries(categories).forEach(([cat, tools]) => {
  if (tools.length > 0) {
    console.log(`${cat}: ${tools.length} 个工具`);
    tools.forEach(t => console.log(`  - ${t.name}`));
    console.log('');
  }
});

console.log('\n=== 工作量评估 ===\n');
console.log(`中高优先级工具总数: ${mediumHigh.length}`);
console.log('预计搜索时间:');
console.log('  - 简单搜索 (大型知名厂商): 约 2-3 分钟/工具');
console.log('  - 中等搜索 (中型厂商): 约 5-8 分钟/工具');
console.log('  - 困难搜索 (小众/专业): 约 10-15 分钟/工具');
console.log('\n预计总工作量:');
console.log(`  - 30% 简单: ${Math.ceil(mediumHigh.length * 0.3)} 个 × 3 分钟 = ${Math.ceil(mediumHigh.length * 0.3 * 3)} 分钟`);
console.log(`  - 50% 中等: ${Math.ceil(mediumHigh.length * 0.5)} 个 × 6 分钟 = ${Math.ceil(mediumHigh.length * 0.5 * 6)} 分钟`);
console.log(`  - 20% 困难: ${Math.ceil(mediumHigh.length * 0.2)} 个 × 12 分钟 = ${Math.ceil(mediumHigh.length * 0.2 * 12)} 分钟`);
console.log(`  - 总计约: ${Math.ceil(mediumHigh.length * 0.3 * 3 + mediumHigh.length * 0.5 * 6 + mediumHigh.length * 0.2 * 12)} 分钟 (${Math.ceil((mediumHigh.length * 0.3 * 3 + mediumHigh.length * 0.5 * 6 + mediumHigh.length * 0.2 * 12) / 60)} 小时)`);
