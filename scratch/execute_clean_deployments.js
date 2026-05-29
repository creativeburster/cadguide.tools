const fs = require('fs');
const { exec } = require('child_process');

function execPromise(cmd) {
  return new Promise((resolve) => {
    exec(cmd, (err, stdout, stderr) => {
      resolve({ err, stdout, stderr });
    });
  });
}

async function main() {
  const jsonFile = 'scratch/deployments_to_clean.json';
  if (!fs.existsSync(jsonFile)) {
    console.log(`Error: candidate file ${jsonFile} not found.`);
    return;
  }

  const list = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
  console.log(`Loaded ${list.length} candidate deployments to delete.`);

  if (list.length === 0) {
    console.log('No deployments match the filter. Nothing to delete.');
    return;
  }

  const CONCURRENCY = 5;
  console.log(`Starting bulk delete with concurrency = ${CONCURRENCY}...\n`);

  let completed = 0;
  const total = list.length;
  
  // A simple async queue worker
  async function worker(q) {
    while (q.length > 0) {
      const item = q.shift();
      if (!item) continue;
      
      const cmd = `npx vercel rm "${item.url}" -y`;
      const start = Date.now();
      const { err } = await execPromise(cmd);
      const duration = ((Date.now() - start) / 1000).toFixed(1);
      
      completed++;
      if (err) {
        console.log(`[${completed}/${total}] ❌ Failed to remove [Age: ${item.age}] ${item.url} (${duration}s)`);
      } else {
        console.log(`[${completed}/${total}] ✅ Removed successfully [Age: ${item.age}] ${item.url} (${duration}s)`);
      }
    }
  }

  // Copy list to queue
  const queue = [...list];
  const workers = [];
  for (let i = 0; i < Math.min(CONCURRENCY, queue.length); i++) {
    workers.push(worker(queue));
  }

  await Promise.all(workers);

  console.log(`\n🎉 Bulk delete complete! Total deleted: ${completed}/${total}`);
}

main();
