const fs = require('fs');
const path = require('path');

// Mock types and imports by reading the generated js from the build or parsing the TS files
// We can just parse the TS files using TS-Node or Node since they are ES Modules, but since it's easier, we can read c1.ts to c7.ts as raw text and parse them.
// Wait! Let's write a quick script that reads and parses c1.ts to c7.ts.

function parseToolsFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parts = content.split(/\bid:\s*"/);
  const tools = [];
  
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const idEnd = part.indexOf('"');
    const id = part.substring(0, idEnd);
    
    const getField = (fieldName) => {
      const regex = new RegExp(`\\b${fieldName}:\\s*"([^"]*)"`);
      const match = part.match(regex);
      if (match) return match[1];
      
      const regex2 = new RegExp(`\\b${fieldName}:\\s*'([^']*)'`);
      const match2 = part.match(regex2);
      if (match2) return match2[1];
      
      const regex3 = new RegExp(`\\b${fieldName}:\\s*\`([^\`]*)\``);
      const match3 = part.match(regex3);
      if (match3) return match3[1];
      
      return '';
    };

    const getArrayField = (fieldName) => {
      const regex = new RegExp(`\\b${fieldName}:\\s*\\[([^\\]]*)\\]`);
      const match = part.match(regex);
      if (match) {
        const arrContent = match[1];
        const strRegex = /["']([^"']+)["']/g;
        const items = [];
        let m;
        while ((m = strRegex.exec(arrContent)) !== null) {
          items.push(m[1]);
        }
        return items;
      }
      return [];
    };

    const name = getField('name');
    const slug = getField('slug');
    const short_desc = getField('short_desc');
    const description = getField('description');
    const category_id = getField('category_id');
    const industries = getArrayField('industries');
    const core_features = getArrayField('core_features');
    const score = parseFloat(getField('score')) || 4.0;
    
    tools.push({
      id, name, slug, short_desc, description, category_id, industries, core_features, score
    });
  }
  return tools;
}

const dataDir = path.join(__dirname, '../src/lib/data');
const allTools = [];
for (let i = 1; i <= 7; i++) {
  const filePath = path.join(dataDir, `c${i}.ts`);
  if (fs.existsSync(filePath)) {
    allTools.push(...parseToolsFromFile(filePath));
  }
}

console.log(`Loaded ${allTools.length} tools.`);

// Let's define the 16 sectors and see how many tools match under basic filters
const sectors = {
  cae: (t) => t.category_id === 'c5' && (
    t.industries.some(i => ['CAE', 'Simulation', 'Aerospace', 'Automotive', 'Structural'].includes(i)) ||
    t.core_features.some(f => ['FEA', 'Simulation', 'CFD', 'Thermal Analysis', 'Structural Analysis'].includes(f)) ||
    /cae|fea|finite element|simulation|cfd|multiphysics/i.test(t.name + ' ' + t.short_desc + ' ' + t.description)
  ),
  cam: (t) => t.category_id === 'c5' && (
    t.industries.some(i => ['Manufacturing', 'Machining', 'Tooling'].includes(i)) ||
    t.core_features.some(f => ['CAM', 'CNC', 'Toolpath', 'Milling', 'Turning', 'G-code'].includes(f)) ||
    /cam|cnc|toolpath|machin|milling|turning|g-code/i.test(t.name + ' ' + t.short_desc + ' ' + t.description)
  ),
  '3d-printing': (t) => (
    t.industries.some(i => ['Additive Manufacturing', '3D Printing', 'Hobbyist', 'Maker'].includes(i)) ||
    t.core_features.some(f => ['Slicing', 'Slicer', '3D Printing', 'Mesh Repair'].includes(f)) ||
    /3d print|slicer|slicing|stl|additive/i.test(t.name + ' ' + t.short_desc + ' ' + t.description)
  ),
  automotive: (t) => (
    t.industries.some(i => ['Automotive', 'Transportation', 'Vehicle'].includes(i)) ||
    /automotive|vehicle|car |body-in-white/i.test(t.name + ' ' + t.short_desc + ' ' + t.description)
  ),
  'hydraulic-geotechnical': (t) => (
    t.industries.some(i => ['Hydraulic', 'Geotechnical', 'Civil Engineering', 'Water', 'Earthworks'].includes(i)) ||
    t.core_features.some(f => ['Hydraulic', 'Geotechnical', 'Slope Stability', 'Dam'].includes(f)) ||
    /hydraulic|geotechnical|soil|slope stability|geostudio|plaxis|earthwork/i.test(t.name + ' ' + t.short_desc + ' ' + t.description)
  ),
  aerospace: (t) => (
    t.industries.some(i => ['Aerospace', 'Aviation', 'Defense'].includes(i)) ||
    /aerospace|aircraft|aviation|spacecraft|satellite/i.test(t.name + ' ' + t.short_desc + ' ' + t.description)
  ),
  'rail-transit': (t) => (
    t.industries.some(i => ['Transportation', 'Rail', 'Rail Transportation', 'Infrastructure'].includes(i)) ||
    /railway|railroad|rail transit|metro |trackwork|locomotive/i.test(t.name + ' ' + t.short_desc + ' ' + t.description)
  ),
  'medical-devices': (t) => (
    t.industries.some(i => ['Medical', 'Dental', 'Healthcare', 'Medical Devices', 'Biomedical'].includes(i)) ||
    /medical device|dental|implant|prosthetic|surgical|orthopedic|anatomical/i.test(t.name + ' ' + t.short_desc + ' ' + t.description)
  ),
  'sheet-metal': (t) => (
    t.core_features.some(f => ['Sheet Metal', 'Unfolding', 'Flat Pattern'].includes(f)) ||
    /sheet metal|sheet-metal|flat pattern|unfolding|bending|press brake/i.test(t.name + ' ' + t.short_desc + ' ' + t.description)
  ),
  'steel-structures': (t) => (
    t.industries.some(i => ['Structural Engineering', 'Steel Structures', 'Construction'].includes(i)) ||
    t.core_features.some(f => ['Steel Detailing', 'Connection Design', 'Rebar'].includes(f)) ||
    /steel structure|steel frame|structural steel|tekla structures/i.test(t.name + ' ' + t.short_desc + ' ' + t.description)
  ),
  'quantity-takeoff': (t) => (
    t.core_features.some(f => ['Quantity Takeoff', 'Estimation', 'Cost Estimating', 'Measurement'].includes(f)) ||
    /quantity takeoff|takeoff|cost estimation|take-off|measurement|estimating/i.test(t.name + ' ' + t.short_desc + ' ' + t.description)
  ),
  'piping-pipeline': (t) => (
    t.core_features.some(f => ['Piping', 'Routing', 'Cabling', 'HVAC Routing', 'Piping Design'].includes(f)) ||
    /piping|routing|wiring harness|cabling|conduit|pipeline/i.test(t.name + ' ' + t.short_desc + ' ' + t.description)
  ),
  'reverse-engineering': (t) => (
    t.core_features.some(f => ['Reverse Engineering', '3D Scanning', 'Point Cloud'].includes(f)) ||
    /reverse engineering|3d scan|point cloud|geomagic/i.test(t.name + ' ' + t.short_desc + ' ' + t.description)
  ),
  'agricultural-machinery': (t) => (
    t.industries.some(i => ['Agriculture', 'Agricultural Machinery', 'Heavy Equipment'].includes(i)) ||
    /agriculture|agricultural|tractor|combine harvester|farm machinery/i.test(t.name + ' ' + t.short_desc + ' ' + t.description)
  ),
  'woodworking-customization': (t) => (
    t.industries.some(i => ['Woodworking', 'Furniture', 'Timber Construction', 'Interior Design', 'Whole-House Customization'].includes(i)) ||
    t.core_features.some(f => ['Timber CAD', 'Cabinet Design', 'Furniture Design'].includes(f)) ||
    /woodworking|furniture|cabinet|timber|customization|panel cutting|wood design|全屋定制/i.test(t.name + ' ' + t.short_desc + ' ' + t.description)
  ),
  petrochemical: (t) => (
    t.industries.some(i => ['Oil & Gas', 'Chemical', 'Petrochemical', 'Energy', 'Process Industry'].includes(i)) ||
    /petrochemical|oil & gas|refinery|chemical plant|process piping|piping and instrumentation|p&id/i.test(t.name + ' ' + t.short_desc + ' ' + t.description)
  )
};

Object.keys(sectors).forEach(slug => {
  const matches = allTools.filter(sectors[slug]);
  console.log(`${slug}: ${matches.length} matches`);
  console.log(`  Top 3:`, matches.slice(0, 3).map(m => m.name).join(', '));
});
