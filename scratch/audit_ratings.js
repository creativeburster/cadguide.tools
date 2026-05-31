const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const categories = {
  c1: '2D CAD',
  c2: '3D Modeling',
  c3: 'BIM',
  c4: 'Viewer',
  c5: 'CAE/CAM',
  c6: 'EDA',
  c7: 'Specialized'
};

const dataDir = path.join(__dirname, '../src/lib/data');
const files = ['c1.ts', 'c2.ts', 'c3.ts', 'c4.ts', 'c5.ts', 'c6.ts', 'c7.ts'];

async function main() {
  console.log('Starting ratings URL audit...\n');
  const ratingUrls = [];

  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');

    // NAIVE TS PARSING:
    // Let's extract tool name and its external ratings URL
    // We can split the content into individual tool objects
    const toolsRaw = content.split(/\{\s*id\s*:\s*["']/);
    
    toolsRaw.slice(1).forEach(toolBlock => {
      // Find the name
      const nameMatch = toolBlock.match(/name\s*:\s*["']([^"']+)["']/);
      const toolName = nameMatch ? nameMatch[1] : 'Unknown';

      // Find the external_ratings array block
      // e.g., external_ratings: [ { source: '...', url: '...' } ]
      const ratingsBlockMatch = toolBlock.match(/external_ratings\s*:\s*\[([\s\S]*?)\]/);
      if (ratingsBlockMatch) {
        const ratingsArrayContent = ratingsBlockMatch[1];
        // Match individual rating objects e.g. { source: '...', url: '...' }
        const ratingObjMatches = ratingsArrayContent.match(/\{\s*[\s\S]*?\}\s*,?/g) || [];
        
        ratingObjMatches.forEach(ratingObjStr => {
          const sourceMatch = ratingObjStr.match(/source\s*:\s*["']([^"']+)["']/);
          const urlMatch = ratingObjStr.match(/url\s*:\s*["']([^"']+)["']/);
          
          if (urlMatch && urlMatch[1]) {
            const url = urlMatch[1];
            const source = sourceMatch ? sourceMatch[1] : 'Unknown';
            ratingUrls.push({
              toolName,
              category: file.replace('.ts', '').toUpperCase(),
              source,
              url
            });
          }
        });
      }
    });
  });

  console.log(`Found ${ratingUrls.length} total rating URLs in the database.`);

  // De-duplicate URLs for testing efficiency
  const uniqueUrls = [];
  const seen = new Set();
  ratingUrls.forEach(item => {
    if (!seen.has(item.url)) {
      seen.add(item.url);
      uniqueUrls.push(item);
    }
  });

  console.log(`Unique URLs to test: ${uniqueUrls.length}\n`);

  console.log('Testing connection to unique URLs (concurrency = 5)...');
  const results = [];
  let count = 0;
  
  // Custom fetch function with Chrome headers
  async function testUrl(item) {
    const start = Date.now();
    try {
      // Use standard fetch with timeout (e.g. 8 seconds) and simulated browser user agent
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(item.url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: controller.signal
      }).catch(async (e) => {
        // Fallback to GET if HEAD method is blocked
        const getController = new AbortController();
        const getTimeoutId = setTimeout(() => getController.abort(), 8000);
        return await fetch(item.url, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          signal: getController.signal
        });
      });

      clearTimeout(timeoutId);
      const status = response.status;
      results.push({ ...item, status, duration: Date.now() - start, success: status >= 200 && status < 400 });
    } catch (err) {
      // Check if it was aborted
      const isTimeout = err.name === 'AbortError';
      results.push({ 
        ...item, 
        status: isTimeout ? 'TIMEOUT' : 'ERROR', 
        error: err.message, 
        duration: Date.now() - start, 
        success: false 
      });
    }
  }

  // Batch process
  const batchSize = 5;
  for (let i = 0; i < uniqueUrls.length; i += batchSize) {
    const batch = uniqueUrls.slice(i, i + batchSize);
    await Promise.all(batch.map(item => testUrl(item)));
    count += batch.length;
    console.log(`Audited: ${count}/${uniqueUrls.length}...`);
  }

  console.log('\nAudit complete!\n');

  // Group by status
  const successList = results.filter(r => r.success);
  const deadList = results.filter(r => r.status === 404);
  const forbiddenList = results.filter(r => r.status === 403 || r.status === 503);
  const timeoutList = results.filter(r => r.status === 'TIMEOUT');
  const otherErrorList = results.filter(r => !r.success && r.status !== 404 && r.status !== 403 && r.status !== 503 && r.status !== 'TIMEOUT');

  console.log(`=== AUDIT SUMMARY ===`);
  console.log(`- Total Tested: ${results.length}`);
  console.log(`- Accessible (2xx/3xx): ${successList.length}`);
  console.log(`- Dead Links (404 Not Found): ${deadList.length}`);
  console.log(`- WAF Blocked (403/503 - likely anti-bot): ${forbiddenList.length}`);
  console.log(`- Timed Out: ${timeoutList.length}`);
  console.log(`- Other Failures: ${otherErrorList.length}`);
  console.log();

  if (deadList.length > 0) {
    console.log('=== CONFIRMED DEAD LINKS (404) ===');
    deadList.forEach(r => {
      console.log(`- [${r.toolName}] [${r.source}] URL: ${r.url}`);
    });
    console.log();
  }

  if (otherErrorList.length > 0) {
    console.log('=== SUSPECTED BROKEN/ERROR LINKS ===');
    otherErrorList.forEach(r => {
      console.log(`- [${r.toolName}] [${r.source}] Status: ${r.status} | URL: ${r.url} (Err: ${r.error || 'N/A'})`);
    });
    console.log();
  }

  // Write full audit result to json
  fs.writeFileSync('scratch/ratings_audit_report.json', JSON.stringify({
    summary: {
      total: results.length,
      accessible: successList.length,
      dead_404: deadList.length,
      blocked_403_503: forbiddenList.length,
      timeout: timeoutList.length,
      other_errors: otherErrorList.length
    },
    dead_links: deadList,
    error_links: otherErrorList,
    all_results: results
  }, null, 2));

  console.log('Full report written to scratch/ratings_audit_report.json');
}

main();
