const fs = require('fs');
const path = require('path');
const https = require('https');

const TOOLBOX_DIR = path.join(__dirname, '../src/app/toolbox');

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

// Extract Chinese text chunks
function getChineseChunks(content) {
  const chunks = new Set();
  const lines = content.split('\n');
  for (const line of lines) {
    // Matches contiguous Chinese character blocks, allowing spaces, brackets, punctuation inside
    const matches = line.match(/[\u4e00-\u9fa5]+[^\u4e00-\u9fa5\r\n]*[\u4e00-\u9fa5]*/g);
    if (matches) {
      for (const m of matches) {
        const clean = m.trim();
        if (clean && /[\u4e00-\u9fa5]/.test(clean)) {
          chunks.add(clean);
        }
      }
    }
  }
  return Array.from(chunks);
}

// Google translate HTTP helper
function translateBatch(batch) {
  return new Promise((resolve, reject) => {
    const textToTranslate = batch.join('\n');
    const encoded = encodeURIComponent(textToTranslate);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=${encoded}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const translations = parsed[0].map(item => item[0]);
          // Merge translations because API might split lines
          const fullTranslation = translations.join('');
          const results = fullTranslation.split('\n').map(t => t.trim());
          resolve(results);
        } catch (err) {
          reject(new Error(`Failed to parse translation response: ${err.message}. Raw data: ${data}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function run() {
  console.log('Scanning files...');
  const files = scanDir(TOOLBOX_DIR);
  const allChineseStrings = new Set();
  const fileChineseMap = new Map();

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const chunks = getChineseChunks(content);
    if (chunks.length > 0) {
      fileChineseMap.set(file, chunks);
      chunks.forEach(str => allChineseStrings.add(str));
    }
  }

  const uniqueStrings = Array.from(allChineseStrings).sort((a, b) => b.length - a.length);
  console.log(`Found ${uniqueStrings.length} unique Chinese strings across ${fileChineseMap.size} files.`);

  if (uniqueStrings.length === 0) {
    console.log('No Chinese characters found.');
    return;
  }

  // Translate in batches of 50 to avoid URL length limit
  const batchSize = 40;
  const translationMap = {};
  
  console.log(`Translating in batches of ${batchSize}...`);
  for (let i = 0; i < uniqueStrings.length; i += batchSize) {
    const batch = uniqueStrings.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1} / ${Math.ceil(uniqueStrings.length / batchSize)}...`);
    
    let retries = 3;
    let success = false;
    while (retries > 0 && !success) {
      try {
        const translated = await translateBatch(batch);
        
        // Map original -> translation
        batch.forEach((orig, idx) => {
          let trans = translated[idx] || orig;
          
          // Clean up common translation artifacts
          trans = trans.replace(/\\"/g, '"');
          trans = trans.replace(/\\'/g, "'");
          trans = trans.replace(/&quot;/g, '"');
          trans = trans.replace(/&#39;/g, "'");
          
          translationMap[orig] = trans;
        });
        
        success = true;
      } catch (err) {
        console.error(`Error translating batch: ${err.message}. Retrying...`);
        retries--;
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    
    if (!success) {
      console.error('Failed to translate batch after retries. Aborting.');
      process.exit(1);
    }
    
    // Safety delay
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('Translation complete. Writing updates back to files...');
  let updatedFilesCount = 0;

  for (const [file, chunks] of fileChineseMap.entries()) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    
    // Sort chunks by length descending so we don't accidentally replace substrings first
    const sortedChunks = [...chunks].sort((a, b) => b.length - a.length);
    
    for (const chunk of sortedChunks) {
      const translation = translationMap[chunk];
      if (translation && translation !== chunk) {
        // Escape regex special chars
        const escaped = chunk.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(escaped, 'g');
        content = content.replace(regex, translation);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated: ${path.relative(TOOLBOX_DIR, file)}`);
      updatedFilesCount++;
    }
  }

  console.log(`Successfully updated ${updatedFilesCount} files!`);
}

run().catch(err => {
  console.error('Fatal execution error:', err);
});
