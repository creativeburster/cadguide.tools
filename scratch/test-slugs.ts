import { tools } from '../src/lib/data';
const candidates = [
  'nanocad', 'nanocad-free', 'qcad', 'solidedge', 'rhino', 'rhino-3d', 'sketchup',
  'spaceclaim', 'autocad-lt', 'fusion-360', 'altium-designer', 'kicad', 'proteus',
  'orcad', 'easyeda', 'pads', 'fritzing', 'openscad', 'tinkercad', 'bambu-studio',
  'prusaslicer', 'ultimaker-cura', 'zwcad', 'draftsight', 'librecad', 'freecad',
  'onshape', 'solidworks', 'catia', 'siemens-nx'
];
console.log("Candidate check:");
candidates.forEach(c => {
  const match = tools.find(t => t.slug === c);
  console.log(`- ${c}: ${match ? 'EXISTS (' + match.name + ')' : 'MISSING'}`);
});
