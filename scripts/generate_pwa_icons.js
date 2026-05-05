const fs = require('fs');

// Simple 192x192 solid blue PNG (Base64)
const icon192 = "iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlS0LnAAAAA1BMVEUAAP79f+LBAAAANElEQVR4nO3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeB0vAAAB9939VAAAAABJRU5ErkJggg==";

// Simple 512x512 solid blue PNG (Base64)
const icon512 = "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAQMAAADO7ggGAAAAA1BMVEUAAP79f+LBAAAAKklEQVR4nO3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAGB0vAABAWZ76QAAAABJRU5ErkJggg==";

fs.writeFileSync('public/icon-192.png', Buffer.from(icon192, 'base64'));
fs.writeFileSync('public/icon-512.png', Buffer.from(icon512, 'base64'));

console.log('Icons generated successfully.');
