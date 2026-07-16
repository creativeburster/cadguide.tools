const fs = require('fs');
const path = require('path');

const toolboxDir = path.join(__dirname, 'src', 'app', 'toolbox');

// Tools that return string values (status, cool, etc.)
const stringOutputs = ['status', 'cool'];

const dirs = fs.readdirSync(toolboxDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name !== '[slug]' && d.name !== 'shortcuts')
  .map(d => d.name);

let fixed = 0;
for (const slug of dirs) {
  const clientFile = path.join(toolboxDir, slug, 'calculator-client.tsx');
  if (!fs.existsSync(clientFile)) continue;
  
  let content = fs.readFileSync(clientFile, 'utf8');
  let modified = false;
  
  for (const out of stringOutputs) {
    // Replace formatNum(result.status) with result.status
    const pattern = `{formatNum(result.${out})}`;
    if (content.includes(pattern)) {
      content = content.replace(pattern, `{result.${out}}`);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(clientFile, content);
    fixed++;
    console.log(`Fixed: ${slug}`);
  }
}
console.log(`Total fixed: ${fixed}`);
