const fs = require('fs');
let content = fs.readFileSync('src/lib/data.ts', 'utf8');

const autoCadData = `    pricing_tiers: [
      { name: "Monthly", price: "255", period: "/mo", features: ["Full 2D/3D features", "Web & Mobile apps", "Support"] },
      { name: "Annual", price: "2030", period: "/yr", features: ["Save 34%", "All monthly features", "Priority Support"], is_popular: true },
      { name: "3-Year", price: "6090", period: "/3yr", features: ["Price protection", "Corporate scale", "Flex tokens"] }
    ],
    detailed_features: [
      { category: "Design", items: [{name: "2D Drafting", status: true}, {name: "3D Modeling", status: true}, {name: "Photorealistic Rendering", status: true}] },
      { category: "Interoperability", items: [{name: "Native DWG", status: true}, {name: "PDF Import/Export", status: true}, {name: "IFC Support", status: true}] },
      { category: "Customization", items: [{name: "AutoLISP", status: true}, {name: "VBA/ActiveX", status: true}, {name: "App Store", status: true}] }
    ],
    alternatives: ["bricscad", "nanocad", "draftsight"],`;

content = content.replace(/slug: "autocad",\s*logo_url: getLogo\("AC"\),\s*short_desc: "([^"]+)",\s*description: "([^"]+)",/, (match) => {
  return `${match}\n${autoCadData}`;
});

fs.writeFileSync('src/lib/data.ts', content);
console.log('AutoCAD data enriched');
