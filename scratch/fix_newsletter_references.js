const fs = require('fs');
const path = require('path');

const TOOLBOX_DIR = path.join(__dirname, '../src/app/toolbox');

function scanAndFix(dir) {
  let count = 0;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      count += scanAndFix(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Match <NewsletterSubscribe /> or <NewsletterSubscribe></NewsletterSubscribe> that doesn't contain variant=
      const regex = /<NewsletterSubscribe(?![^>]*?variant=)([^>]*?)(\/>|>(<\/NewsletterSubscribe>)?)/g;
      
      if (regex.test(content)) {
        content = content.replace(regex, '<NewsletterSubscribe variant="sidebar" className="mt-8 max-w-2xl mx-auto" />');
        fs.writeFileSync(fullPath, content, 'utf8');
        const relative = path.relative(path.join(__dirname, '..'), fullPath);
        console.log(`Updated newsletter reference in: ${relative}`);
        count++;
      }
    }
  }
  return count;
}

console.log('Starting newsletter reference correction...');
const total = scanAndFix(TOOLBOX_DIR);
console.log(`Successfully updated ${total} files!`);
