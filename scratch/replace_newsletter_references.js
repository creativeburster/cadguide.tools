const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');

function scanDir(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(scanDir(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

function run() {
  console.log('Scanning src directory...');
  const files = scanDir(SRC_DIR);
  let updatedCount = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;

    // Check if the file imports NewsletterSubscribe
    if (content.includes('NewsletterSubscribe')) {
      // 1. Replace the import statement
      const importRegex = /import\s*\{\s*NewsletterSubscribe\s*\}\s*from\s*['"][^'"]*newsletter-subscribe['"];?/g;
      if (importRegex.test(content)) {
        content = content.replace(importRegex, "import { RelatedTools } from '@/components/related-tools';");
        hasChanges = true;
      }

      // 2. Replace the JSX tag (supporting multi-line and self-closing tags)
      const jsxRegex = /<NewsletterSubscribe[\s\S]*?\/>/g;
      if (jsxRegex.test(content)) {
        content = content.replace(jsxRegex, '<RelatedTools />');
        hasChanges = true;
      }

      if (hasChanges) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Successfully migrated: ${path.relative(SRC_DIR, file)}`);
        updatedCount++;
      }
    }
  }

  console.log(`Completed replacement. Updated ${updatedCount} files.`);
}

run();
