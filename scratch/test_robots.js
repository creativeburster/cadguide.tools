const fs = require('fs');
const path = require('path');

// Let's write a simple script to read the built robots.txt from .next if it exists
const nextRobotsPath = path.join(__dirname, '../.next/static/robots.txt');
if (fs.existsSync(nextRobotsPath)) {
  console.log('Robots.txt in .next:', fs.readFileSync(nextRobotsPath, 'utf8'));
} else {
  console.log('No robots.txt found in .next');
}
