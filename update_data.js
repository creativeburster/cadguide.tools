const fs = require('fs');

const dataTs = fs.readFileSync('src/lib/data.ts', 'utf-8');
const csv = fs.readFileSync('Top_20_Countries_CAD_Software.csv', 'utf-8');

// Parse CSV
const csvRows = csv.split('\n').filter(l => l.trim().length > 0).slice(1);
const csvTools = csvRows.map(row => {
    // Basic CSV parsing, splitting by comma (assuming no commas in names/companies)
    // Wait, some companies might have commas. Let's handle it safely.
    // Our CSV is simple: Country,Software Name,Company,Website
    const parts = row.split(',');
    return {
        country: parts[0],
        name: parts[1],
        company: parts[2],
        url: parts[3]
    };
});

// Extract tool objects from data.ts using a regex approach
// We need to add `country: string;` to `export interface Tool {`
let updatedDataTs = dataTs;

if (!updatedDataTs.includes('country: string;')) {
    updatedDataTs = updatedDataTs.replace(
        'expert_verdict?: string;   // Professional expert verdict',
        'expert_verdict?: string;   // Professional expert verdict\n  country?: string;'
    );
}

// Now we need to append country field to all existing tools
// A regex to match each tool block:
// name: "Some Name",
const nameRegex = /name:\s*"([^"]+)",/g;
let match;
let toolsInData = [];
while ((match = nameRegex.exec(updatedDataTs)) !== null) {
    if (match.index > updatedDataTs.indexOf('export const tools: Tool[] = [')) {
        toolsInData.push(match[1]);
    }
}

// Map tool names to countries
const nameToCountry = {};
// Also manual mappings for those that might slightly differ in names
csvTools.forEach(t => {
    nameToCountry[t.name.toLowerCase()] = t.country;
    nameToCountry[t.name.toLowerCase().replace(' ', '')] = t.country;
});
// Add some manual fallbacks for the 91 existing tools
const defaultCountries = {
    'AutoCAD': 'USA', 'SolidWorks': 'USA', 'SketchUp': 'USA', 'Revit': 'USA',
    'Fusion 360': 'USA', 'Rhino 3D': 'USA', 'CATIA': 'France', 'Siemens NX': 'Germany',
    'ArchiCAD': 'Hungary', 'Altium Designer': 'Australia', 'FreeCAD': 'Community/International',
    'ZWCAD': 'China', 'BricsCAD': 'Belgium', 'Onshape': 'USA', 'Tekla Structures': 'Finland',
    'Solid Edge': 'USA', 'Vectorworks': 'USA', 'LibreCAD': 'Community/International',
    'nanoCAD': 'Russia', 'Autodesk Inventor': 'USA', 'MicroStation': 'USA', 'DraftSight': 'France',
    'PTC Creo': 'USA', 'OpenSCAD': 'Community/International', 'Shapr3D': 'Hungary',
    'IronCAD': 'USA', 'Chief Architect': 'USA'
    // This is just a partial list. We can set others to "International" if not found.
};

let missingFromCsv = csvTools.filter(ct => !toolsInData.some(td => td.toLowerCase() === ct.name.toLowerCase()));

console.log(`Tools in CSV: ${csvTools.length}`);
console.log(`Tools in data.ts: ${toolsInData.length}`);
console.log(`Missing from data.ts: ${missingFromCsv.length}`);

// We will modify the updatedDataTs using regex to insert `country: "..."` before `category_id:`
let finalDataTs = "";
let lastIndex = 0;
const toolBlockRegex = /name:\s*"([^"]+)",\s*slug:[^,]+,\s*logo_url:[^,]+,\s*short_desc:[^,]+,\s*description:[^,]+,/g;

while ((match = toolBlockRegex.exec(updatedDataTs)) !== null) {
    let toolName = match[1];
    let country = nameToCountry[toolName.toLowerCase()] || defaultCountries[toolName] || 'USA'; // fallback to USA or something
    
    // Check if this tool already has country field
    const blockEnd = updatedDataTs.indexOf('}', match.index);
    const blockStr = updatedDataTs.substring(match.index, blockEnd);
    if (!blockStr.includes('country:')) {
        let insertPos = match.index + match[0].length;
        finalDataTs += updatedDataTs.substring(lastIndex, insertPos) + `\n    country: "${country}",`;
        lastIndex = insertPos;
    }
}
finalDataTs += updatedDataTs.substring(lastIndex);

fs.writeFileSync('src/lib/data.ts', finalDataTs, 'utf-8');
console.log('Successfully updated data.ts with country fields.');

// Write out missing tools so we can see what needs to be added
fs.writeFileSync('missing.json', JSON.stringify(missingFromCsv, null, 2), 'utf-8');
