#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const recast = require('recast');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'lib', 'data');
const b = recast.types.builders;

// 真实工具版本数据
const REAL_TOOL_DATA = {
  // Autodesk 产品
  'autocad': { version: '2027', lastUpdated: '2026-03-26' },
  'autocad-lt': { version: '2027', lastUpdated: '2026-03-26' },
  'civil-3d': { version: '2027', lastUpdated: '2026-03-26' },
  'revit': { version: '2026.4.1', lastUpdated: '2026-04-16' },
  'inventor': { version: '2026', lastUpdated: '2025-04-01' },
  'fusion-360': { version: 'v.2702.1.58', lastUpdated: '2026-04-23' },
  '3ds-max': { version: '2027', lastUpdated: '2026-03-26' },
  'maya': { version: '2027', lastUpdated: '2026-03-26' },
  'navisworks': { version: '2027', lastUpdated: '2026-03-26' },
  
  // Dassault Systèmes
  'solidworks': { version: '2026', lastUpdated: '2025-11-15' },
  'catia': { version: '3DEXPERIENCE R2026x', lastUpdated: '2026-01-15' },
  
  // Siemens
  'siemens-nx': { version: 'NX 2512', lastUpdated: '2026-01-08' },
  'solidedge': { version: '2026', lastUpdated: '2026-01-08' },
  
  // 开源工具
  'blender': { version: '5.1', lastUpdated: '2026-03-17' },
  'freecad': { version: '1.0', lastUpdated: '2025-12-10' },
  'openscad': { version: '2025.04', lastUpdated: '2025-11-15' },
  
  // 其他 MCAD
  'rhino-3d': { version: '8', lastUpdated: '2026-01-18' },
  'sketchup': { version: '2026', lastUpdated: '2025-11-05' },
  'bricsys-bricscad': { version: '29', lastUpdated: '2025-10-26' },
  
  // 渲染
  'enscape': { version: '4.0', lastUpdated: '2025-12-15' },
  'lumion': { version: '13', lastUpdated: '2025-11-20' },
  'twinmotion': { version: '2026', lastUpdated: '2026-01-05' },
  'v-ray': { version: '6.0', lastUpdated: '2026-03-10' },
  'keyshot': { version: '2025.3', lastUpdated: '2026-01-22' },
  
  // 其他
  'archicad': { version: '28', lastUpdated: '2025-09-15' },
  'tekla-structures': { version: '2026', lastUpdated: '2025-10-08' },
  'microstation': { version: '2026', lastUpdated: '2025-11-02' },
  
  // CAM
  'mastercam': { version: '2026', lastUpdated: '2025-07-03' },
  'powermill': { version: '2026', lastUpdated: '2025-08-15' },
  
  // 3D打印
  'ultimaker-cura': { version: '6.1', lastUpdated: '2026-01-25' },
  'prusaslicer': { version: '2.9.0', lastUpdated: '2025-11-10' },
  'simplify3d': { version: '5.2', lastUpdated: '2025-09-30' },
  
  // 其他
  'tinkercad': { version: 'Continuous (cloud)', lastUpdated: '2026-05-20' },
  'onshape': { version: 'Continuous (cloud)', lastUpdated: '2026-05-21' },
  'shapr3d': { version: '6.0', lastUpdated: '2026-02-12' },
  'draftsight': { version: '2025', lastUpdated: '2025-06-18' },
  'zwcad': { version: '2026', lastUpdated: '2025-12-05' },
  'nanocad': { version: '24.1', lastUpdated: '2025-08-22' },
};

const files = ['c1.ts', 'c2.ts', 'c3.ts', 'c4.ts', 'c5.ts', 'c6.ts', 'c7.ts'];
let totalUpdated = 0;

console.log('开始更新工具的真实版本和更新日期...\n');

for (const f of files) {
  console.log(`处理 ${f}...`);
  const filePath = path.join(DATA_DIR, f);
  const src = fs.readFileSync(filePath, 'utf8');
  let fileUpdated = false;
  
  const ast = recast.parse(src, {
    parser: {
      parse: (s) => parser.parse(s, { sourceType: 'module', plugins: ['typescript'], tokens: true })
    }
  });
  
  recast.types.visit(ast, {
    visitObjectExpression(p) {
      const obj = p.node;
      const props = obj.properties;
      
      // 检查是否是工具对象
      const hasId = props.some(pr => pr.type === 'ObjectProperty' && 
        ((pr.key.type === 'Identifier' && pr.key.name === 'id') || 
         (pr.key.type === 'StringLiteral' && pr.key.value === 'id')));
      
      const hasSlug = props.some(pr => pr.type === 'ObjectProperty' && 
        ((pr.key.type === 'Identifier' && pr.key.name === 'slug') || 
         (pr.key.type === 'StringLiteral' && pr.key.value === 'slug')));
      
      if (!hasId || !hasSlug) {
        this.traverse(p);
        return;
      }
      
      // 获取slug
      const slugProp = props.find(pr => pr.type === 'ObjectProperty' && 
        ((pr.key.type === 'Identifier' && pr.key.name === 'slug') || 
         (pr.key.type === 'StringLiteral' && pr.key.value === 'slug')));
      const slug = slugProp.value.value;
      
      // 检查我们是否有这个工具的真实数据
      if (REAL_TOOL_DATA[slug]) {
        console.log(`  → 找到工具: ${slug}, 更新数据...`);
        const realData = REAL_TOOL_DATA[slug];
        
        // 更新或添加lastUpdated字段
        let lastUpdatedProp = props.find(pr => pr.type === 'ObjectProperty' && 
          ((pr.key.type === 'Identifier' && pr.key.name === 'last_updated') || 
           (pr.key.type === 'StringLiteral' && pr.key.value === 'last_updated')));
        if (lastUpdatedProp) {
          lastUpdatedProp.value.value = realData.lastUpdated;
        } else {
          obj.properties.push(b.objectProperty(b.identifier('last_updated'), b.stringLiteral(realData.lastUpdated)));
        }
        
        // 更新或添加version字段
        let versionProp = props.find(pr => pr.type === 'ObjectProperty' && 
          ((pr.key.type === 'Identifier' && pr.key.name === 'version') || 
           (pr.key.type === 'StringLiteral' && pr.key.value === 'version')));
        if (versionProp) {
          versionProp.value.value = realData.version;
        } else {
          obj.properties.push(b.objectProperty(b.identifier('version'), b.stringLiteral(realData.version)));
        }
        
        fileUpdated = true;
        totalUpdated++;
      }
      
      this.traverse(p);
    }
  });
  
  if (fileUpdated) {
    const out = recast.print(ast, { quote: 'double', tabWidth: 2 }).code;
    fs.writeFileSync(filePath, out);
    console.log(`✓ ${f} 更新完成！\n`);
  } else {
    console.log(`  ${f} 没有需要更新的工具\n`);
  }
}

console.log(`\n=== 完成！共更新了 ${totalUpdated} 个工具的真实数据 ===`);
