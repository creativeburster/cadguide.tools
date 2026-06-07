const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src/app/toolbox');
const destDir = path.join(__dirname, '../src/app/guides');

const cheatsheetSlugs = [
  'shortcuts',
  'solidworks-shortcuts-sheet',
  'rhino-shortcuts-sheet',
  'revit-shortcuts-sheet',
  'sketchup-shortcuts-sheet',
  'inventor-shortcuts-sheet',
  'microstation-shortcuts-sheet',
  'archicad-shortcuts-sheet',
  'catia-shortcuts-sheet',
  'creo-shortcuts-sheet',
  'freecad-shortcuts-sheet',
  'fusion360-shortcuts-sheet',
  'draftsight-shortcuts-sheet',
  'bricscad-shortcuts-sheet',
  'vectorworks-shortcuts-sheet',
  'autocad-vs-gstarcad-shortcuts',
  'autocad-vs-zwcad-shortcuts'
];

cheatsheetSlugs.forEach(slug => {
  const oldPath = path.join(srcDir, slug);
  const newPath = path.join(destDir, slug);

  if (fs.existsSync(oldPath)) {
    console.log(`Moving ${slug}...`);
    // Ensure destination parent dir exists
    if (!fs.existsSync(newPath)) {
      fs.mkdirSync(newPath, { recursive: true });
    }
    
    // Move files in directory
    const files = fs.readdirSync(oldPath);
    files.forEach(file => {
      const fOld = path.join(oldPath, file);
      const fNew = path.join(newPath, file);
      fs.renameSync(fOld, fNew);
    });

    // Remove old directory
    fs.rmdirSync(oldPath);

    // Update page.tsx in the new path
    const pageFile = path.join(newPath, 'page.tsx');
    if (fs.existsSync(pageFile)) {
      let content = fs.readFileSync(pageFile, 'utf8');
      
      // Replace path
      content = content.replace(new RegExp(`/toolbox/${slug}`, 'g'), `/guides/${slug}`);
      
      // Update breadcrumb parent
      content = content.replace("name: 'Toolbox', path: '/toolbox'", "name: 'Guides', path: '/guides'");
      content = content.replace('name: "Toolbox", path: "/toolbox"', 'name: "Guides", path: "/guides"');
      
      fs.writeFileSync(pageFile, content, 'utf8');
      console.log(`Updated page.tsx for ${slug}`);
    }
  } else {
    console.log(`Source not found for ${slug}`);
  }
});

console.log('Cheatsheet migration completed successfully.');
