const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function runCommand(cmd) {
  try {
    const tempFile = path.join(__dirname, 'temp_list.txt');
    execSync(`${cmd} > "${tempFile}" 2>&1`, { stdio: 'ignore' });
    if (fs.existsSync(tempFile)) {
      const data = fs.readFileSync(tempFile, 'utf8');
      try {
        fs.unlinkSync(tempFile);
      } catch (e) {}
      return data;
    }
    return '';
  } catch (err) {
    return '';
  }
}

function parseDeployments(output) {
  const lines = output.split('\n');
  const list = [];
  let nextToken = null;

  for (let line of lines) {
    // Look for next page token
    // e.g. "> To display the next page, run `vercel ls --next 1779694710509`"
    if (line.includes('vercel ls --next') || line.includes('vercel list --next')) {
      const match = line.match(/--next\s+(\d+)/);
      if (match) {
        nextToken = match[1];
      }
    }

    // Parse data lines
    // Columns look like: Age  Project  Deployment  Status  Environment  Duration  Username
    // Example: "  5h      willpostpony-2665s-projects/cadguide.tools     https://cadguidetools-p0xecpb0t-willpostpony-2665s-projects.vercel.app     ● Ready      Production      1m           willpostpony-2665"
    // Regex matching url and age
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 3 && parts[2].startsWith('https://')) {
      const age = parts[0];
      const project = parts[1];
      const url = parts[2];
      const status = parts[3];
      const env = parts[4];
      list.push({ age, project, url, status, env });
    }
  }

  return { list, nextToken };
}

function shouldDelete(age) {
  // age could be e.g. "5h", "2d", "3d", "4d", "1w", "2m", "1y", etc.
  const match = age.match(/^(\d+)([hdwy])/) || age.match(/^(\d+)m/);
  if (!match) {
    // If we can't parse it, but it starts with w, m, y, or d >= 3, delete
    if (age.endsWith('w') || age.endsWith('m') || age.endsWith('y')) return true;
    return false;
  }
  const value = parseInt(match[1], 10);
  const unit = age.slice(-1);

  if (unit === 'h') return false; // hours are < 24h
  if (unit === 'd') {
    return value >= 3; // Delete if 3 days or more
  }
  // Weeks, months, years are definitely > 72 hours
  if (unit === 'w' || unit === 'm' || unit === 'y') return true;

  return false;
}

function main() {
  console.log('Scanning all Vercel deployments...');
  let currentToken = null;
  let allDeps = [];
  let page = 1;

  while (true) {
    const cmd = currentToken ? `npx vercel list --next ${currentToken}` : 'npx vercel list';
    console.log(`Fetching page ${page}...`);
    const output = runCommand(cmd);
    if (!output) {
      console.log('No output returned or reached the end.');
      break;
    }

    const { list, nextToken } = parseDeployments(output);
    console.log(`Found ${list.length} deployments on page ${page}.`);
    allDeps = allDeps.concat(list);

    if (!nextToken || nextToken === currentToken) {
      break;
    }
    currentToken = nextToken;
    page++;
  }

  console.log(`\nScan complete! Found total of ${allDeps.length} deployments.`);
  
  const toDelete = allDeps.filter(d => shouldDelete(d.age));
  const toKeep = allDeps.filter(d => !shouldDelete(d.age));

  console.log(`\n=== Deployments to KEEP (< 72 hours) [Total: ${toKeep.length}] ===`);
  toKeep.forEach(d => {
    console.log(`- [Keep] [Age: ${d.age}] [Env: ${d.env}] ${d.url}`);
  });

  console.log(`\n=== Deployments to DELETE (>= 72 hours / 3 days) [Total: ${toDelete.length}] ===`);
  toDelete.forEach(d => {
    console.log(`- [Delete] [Age: ${d.age}] [Env: ${d.env}] ${d.url}`);
  });

  // Save the list of deployments to delete to a JSON file so we can read it in the next step
  fs.writeFileSync('scratch/deployments_to_clean.json', JSON.stringify(toDelete, null, 2));
  console.log('\nSaved delete candidate list to scratch/deployments_to_clean.json');
}

main();
