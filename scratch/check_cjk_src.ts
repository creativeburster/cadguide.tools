import * as fs from 'fs';
import * as path from 'path';

const hasCJK = (str: string) => /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9faf\u3400-\u4dbf]/.test(str);

function scanDirectory(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (stat.isFile() && /\.(tsx|ts|js|jsx)$/.test(file)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (hasCJK(content)) {
        console.log(`Found CJK in file: ${fullPath}`);
        // Find line numbers
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (hasCJK(line)) {
            console.log(`  Line ${idx + 1}: ${line.trim()}`);
          }
        });
      }
    }
  }
}

console.log('Scanning src directory for CJK...');
scanDirectory(path.join(__dirname, '../src'));
console.log('Scan complete.');
