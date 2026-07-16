const fs = require('fs');
const path = require('path');

const toolboxDir = path.join(__dirname, 'src', 'app', 'toolbox');

function toComponentName(slug) {
  return slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('') + 'Client';
}

function toPageName(slug) {
  return slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('') + 'Page';
}

// Find all tool dirs
const dirs = fs.readdirSync(toolboxDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name !== '[slug]' && d.name !== 'shortcuts')
  .map(d => d.name);

let fixed = 0;
for (const slug of dirs) {
  const dir = path.join(toolboxDir, slug);
  const pageFile = path.join(dir, 'page.tsx');
  const clientFile = path.join(dir, 'calculator-client.tsx');
  
  if (!fs.existsSync(pageFile)) continue;
  
  let pageContent = fs.readFileSync(pageFile, 'utf8');
  let clientContent = fs.existsSync(clientFile) ? fs.readFileSync(clientFile, 'utf8') : '';
  
  let compName = toComponentName(slug);
  let pageName = toPageName(slug);
  
  // Fix component names starting with a number
  if (/^[0-9]/.test(compName)) {
    compName = '_' + compName;
  }
  if (/^[0-9]/.test(pageName)) {
    pageName = '_' + pageName;
  }
  
  // Check if the import in page.tsx uses a name starting with a number
  const importMatch = pageContent.match(/import\s+(\w+)\s+from\s+'\.\/calculator-client'/);
  if (importMatch && /^[0-9]/.test(importMatch[1])) {
    pageContent = pageContent.replace(/import\s+\w+\s+from\s+'\.\/calculator-client'/, `import ${compName} from './calculator-client'`);
    pageContent = pageContent.replace(new RegExp(`export default function ${importMatch[1]}`), `export default function ${pageName}`);
    pageContent = pageContent.replace(new RegExp(`<${importMatch[1]}`, 'g'), `<${compName}`);
    fs.writeFileSync(pageFile, pageContent);
    
    // Fix client component name
    if (clientContent) {
      clientContent = clientContent.replace(/export default function \w+\(\)/, `export default function ${compName}()`);
      fs.writeFileSync(clientFile, clientContent);
    }
    fixed++;
    console.log(`Fixed: ${slug} -> ${compName}`);
  }
}
console.log(`Total fixed: ${fixed}`);
