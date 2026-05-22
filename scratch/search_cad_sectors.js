const fs = require('fs');
const path = require('path');

function parseToolsFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Split by id: "
  const parts = content.split(/\bid:\s*"/);
  const tools = [];
  
  // parts[0] is everything before the first tool id
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    
    // Extract ID
    const idEnd = part.indexOf('"');
    const id = part.substring(0, idEnd);
    
    // Helper to extract a single string field
    const getField = (fieldName) => {
      const regex = new RegExp(`\\b${fieldName}:\\s*"([^"]*)"`);
      const match = part.match(regex);
      if (match) return match[1];
      
      // Try single quotes or backticks
      const regex2 = new RegExp(`\\b${fieldName}:\\s*'([^']*)'`);
      const match2 = part.match(regex2);
      if (match2) return match2[1];
      
      const regex3 = new RegExp(`\\b${fieldName}:\\s*\`([^\`]*)\``);
      const match3 = part.match(regex3);
      if (match3) return match3[1];
      
      return '';
    };

    // Helper to extract string array
    const getArrayField = (fieldName) => {
      const regex = new RegExp(`\\b${fieldName}:\\s*\\[([^\\]]*)\\]`);
      const match = part.match(regex);
      if (match) {
        const arrContent = match[1];
        // match all double or single quoted strings inside the array
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
    
    // Extract FAQ content or other parts for general keyword search
    // Just grab the first 3000 characters of this block for overall text search
    const textSnippet = part.substring(0, 4000);

    tools.push({
      id,
      name,
      slug,
      short_desc,
      description,
      category_id,
      industries,
      core_features,
      textSnippet
    });
  }
  return tools;
}

// Load all tools from c1 to c7
const dataDir = path.join(__dirname, '../src/lib/data');
const allTools = [];
for (let i = 1; i <= 7; i++) {
  const filePath = path.join(dataDir, `c${i}.ts`);
  if (fs.existsSync(filePath)) {
    const tools = parseToolsFromFile(filePath);
    allTools.push(...tools);
  }
}

console.log(`Loaded ${allTools.length} total tools from database (text parsing).`);

// Defined sectors and matchers
const sectors = {
  cae: {
    name: 'CAE (Computer-Aided Engineering / FEA / Simulation)',
    keywords: ['cae', 'fea', 'finite element', 'simulation', 'thermal analysis', 'stress analysis', 'fluid dynamics', 'cfd', 'nastran', 'ansys', 'abaqus', 'physics', 'structural analysis', 'multiphysics'],
    categories: ['c5'],
    matches: []
  },
  cam: {
    name: 'CAM (Computer-Aided Manufacturing / CNC)',
    keywords: ['cam', 'cnc', 'toolpath', 'machining', 'milling', 'turning', 'g-code', 'manufactur', 'mill-turn', 'multi-axis', 'solidcam', 'powermill', 'mastercam', 'nesting'],
    categories: ['c5'],
    matches: []
  },
  "3d_printing": {
    name: '3D Printing (3D打印 / Additive Manufacturing)',
    keywords: ['3d print', 'additive', 'slicer', 'slicing', 'stl', 'mesh repair', 'rapid prototyping', 'stereolithography', 'fdm', 'sla', 'sls', '3d-print', 'cura', 'prusaslicer', 'magics', 'mesh repair', 'filament'],
    categories: [],
    matches: []
  },
  automotive: {
    name: 'Automotive CAD (汽车汽配CAD)',
    keywords: ['automotive', 'vehicle', 'car ', 'car-', 'transportation', 'powertrain', 'chassis', 'autopart', 'parts', 'body-in-white', 'auto industry', 'oem', 'tier-1', 'automobile'],
    categories: [],
    matches: []
  },
  hydraulic_geotechnical: {
    name: 'Hydraulic & Geotechnical CAD (水利岩土CAD)',
    keywords: ['hydraulic', 'geotechnical', 'soil', 'earthwork', 'slope stability', 'geological', 'dam ', 'water conservancy', 'hydrology', 'subsurface', 'tunnelling', 'foundation', 'pile', 'rock ', 'site design', 'plaxis', 'geostudio', 'groundwater', 'rock mechanics'],
    categories: [],
    matches: []
  },
  aerospace: {
    name: 'Aerospace (航空航天)',
    keywords: ['aerospace', 'aircraft', 'aviation', 'spacecraft', 'satellite', 'aerodynamic', 'turbine', 'rocket', 'nasa', 'defense', 'avionics'],
    categories: [],
    matches: []
  },
  rail_transit: {
    name: 'Rail Transit (轨道交通)',
    keywords: ['railway', 'railroad', 'rail transit', 'rail ', 'metro ', 'subway', 'trackwork', 'train', 'locomotive', 'alignment', 'transit system', 'transportation'],
    categories: [],
    matches: []
  },
  medical_devices: {
    name: 'Medical Devices (医疗器械)',
    keywords: ['medical', 'dental', 'implant', 'prosthetic', 'orthopedic', 'healthcare', 'surgical', 'anatomical', 'bio-compatible', 'biocompatible', 'biomedical'],
    categories: [],
    matches: []
  },
  sheet_metal: {
    name: 'Sheet Metal (钣金)',
    keywords: ['sheet metal', 'sheet-metal', 'unfolding', 'flat pattern', 'folding', 'k-factor', 'press brake', 'punching', 'nesting', 'bending', 'laser cutting', 'sheetmetal'],
    categories: [],
    matches: []
  },
  steel_structures: {
    name: 'Steel Structures (钢结构)',
    keywords: ['steel structure', 'steel frame', 'structural steel', 'detailing', 'connection design', 'tekla', 'rebar', 'reinforcement', 'truss', 'framing', 'beam', 'column', 'detailing', 'detailing steel'],
    categories: [],
    matches: []
  }
};

// Search all tools for matches
allTools.forEach(tool => {
  const fieldsToSearch = [
    tool.name,
    tool.short_desc,
    tool.description,
    ...(tool.industries || []),
    ...(tool.core_features || []),
    tool.textSnippet
  ].map(s => (s || '').toLowerCase());

  const fullText = fieldsToSearch.join(' || ');

  Object.keys(sectors).forEach(secKey => {
    const sec = sectors[secKey];
    
    // Direct category match
    let isMatch = false;
    // For CAE/CAM, category c5 is CAE/CAM
    if (secKey === 'cae' && tool.category_id === 'c5' && (fullText.includes('cae') || fullText.includes('fea') || fullText.includes('simulation') || fullText.includes('analysis') || fullText.includes('stress') || fullText.includes('fluid') || fullText.includes('thermal') || fullText.includes('ansys') || fullText.includes('nastran') || fullText.includes('abaqus'))) {
      isMatch = true;
    } else if (secKey === 'cam' && tool.category_id === 'c5' && (fullText.includes('cam') || fullText.includes('cnc') || fullText.includes('toolpath') || fullText.includes('machin') || fullText.includes('milling') || fullText.includes('turning') || fullText.includes('g-code') || fullText.includes('solidcam') || fullText.includes('powermill') || fullText.includes('mastercam'))) {
      isMatch = true;
    } else if (sec.categories.includes(tool.category_id)) {
      isMatch = true;
    } else {
      // Keyword match
      isMatch = sec.keywords.some(kw => {
        // Match exact word boundaries for short words or plain containing for long ones
        if (kw.length <= 4) {
          const regex = new RegExp(`\\b${kw}\\b`, 'i');
          return regex.test(fullText);
        }
        return fullText.includes(kw.toLowerCase());
      });
    }

    // Additional industry filtering to reduce noise on general tools
    if (isMatch) {
      sec.matches.push({
        id: tool.id,
        name: tool.name,
        slug: tool.slug,
        category_id: tool.category_id,
        industries: tool.industries || [],
        short_desc: tool.short_desc,
        core_features: tool.core_features || []
      });
    }
  });
});

// Output results
console.log('\n--- CAD SECTOR COVERAGE REPORT ---\n');
Object.keys(sectors).forEach(secKey => {
  const sec = sectors[secKey];
  console.log(`[${secKey.toUpperCase()}] ${sec.name}`);
  console.log(`  Count: ${sec.matches.length} tools matched.`);
  console.log(`  Sample Tools (up to 8):`);
  sec.matches.slice(0, 8).forEach(t => {
    console.log(`    - ${t.name} (ID: ${t.id}, Cat: ${t.category_id}, Slug: ${t.slug})`);
  });
  console.log('------------------------------------\n');
});

// Write to JSON for persistence
fs.writeFileSync(path.join(__dirname, 'sector_matches.json'), JSON.stringify(sectors, null, 2), 'utf8');
console.log('Detailed sector matches saved to scratch/sector_matches.json');
