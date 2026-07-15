'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'draw', name: '✏️ Drawing' },
  { id: 'modify', name: '🛠️ Modify' },
  { id: 'annotate', name: '📐 Annotate' },
  { id: 'layers', name: '📋 Layers & Blocks' },
  { id: 'system', name: '💻 System & View' },
];

const SHORTCUTS = [
  // Drawing
  { keys: 'L', command: 'LINE', category: 'draw', description: 'Draw straight line segments.' },
  { keys: 'C', command: 'CIRCLE', category: 'draw', description: 'Create a circle by center and radius.' },
  { keys: 'A', command: 'ARC', category: 'draw', description: 'Create an arc using three points.' },
  { keys: 'REC', command: 'RECTANGLE', category: 'draw', description: 'Draw a rectangular polyline.' },
  { keys: 'PL', command: 'PLINE', category: 'draw', description: 'Create a 2D polyline with line and arc segments.' },
  { keys: 'POL', command: 'POLYGON', category: 'draw', description: 'Create an equilateral closed polyline (3–1024 sides).' },
  { keys: 'EL', command: 'ELLIPSE', category: 'draw', description: 'Create an ellipse or elliptical arc.' },
  { keys: 'H', command: 'HATCH', category: 'draw', description: 'Fill an enclosed area with a hatch pattern.' },
  { keys: 'SPL', command: 'SPLINE', category: 'draw', description: 'Create a smooth curve through fit points.' },
  { keys: 'ML', command: 'MLINE', category: 'draw', description: 'Draw multiple parallel lines (multiline).' },

  // Modify
  { keys: 'CO', command: 'COPY', category: 'modify', description: 'Copy selected objects to a new location.' },
  { keys: 'M', command: 'MOVE', category: 'modify', description: 'Move objects to a specified displacement.' },
  { keys: 'RO', command: 'ROTATE', category: 'modify', description: 'Rotate objects around a base point.' },
  { keys: 'SC', command: 'SCALE', category: 'modify', description: 'Enlarge or reduce objects proportionally.' },
  { keys: 'MI', command: 'MIRROR', category: 'modify', description: 'Create a mirrored copy of objects.' },
  { keys: 'O', command: 'OFFSET', category: 'modify', description: 'Create parallel copies at a specified distance.' },
  { keys: 'AR', command: 'ARRAY', category: 'modify', description: 'Create rectangular, polar, or path arrays.' },
  { keys: 'TR', command: 'TRIM', category: 'modify', description: 'Trim objects to meet cutting edges.' },
  { keys: 'EX', command: 'EXTEND', category: 'modify', description: 'Extend objects to meet boundary edges.' },
  { keys: 'F', command: 'FILLET', category: 'modify', description: 'Round and fillet the edges of objects.' },
  { keys: 'CHA', command: 'CHAMFER', category: 'modify', description: 'Bevel the edges of objects.' },
  { keys: 'BR', command: 'BREAK', category: 'modify', description: 'Break a selected object at two points.' },
  { keys: 'J', command: 'JOIN', category: 'modify', description: 'Join collinear lines or coplanar arcs into one.' },
  { keys: 'X', command: 'EXPLODE', category: 'modify', description: 'Break a compound object into component objects.' },
  { keys: 'PE', command: 'PEDIT', category: 'modify', description: 'Edit polylines and 3D polygon meshes.' },

  // Annotate
  { keys: 'D', command: 'DIMSTYLE', category: 'annotate', description: 'Create and modify dimension styles.' },
  { keys: 'DLI', command: 'DIMLINEAR', category: 'annotate', description: 'Create a linear dimension.' },
  { keys: 'DAL', command: 'DIMALIGNED', category: 'annotate', description: 'Create an aligned dimension.' },
  { keys: 'DRA', command: 'DIMRADIUS', category: 'annotate', description: 'Create a radius dimension for arcs/circles.' },
  { keys: 'DDI', command: 'DIMDIAMETER', category: 'annotate', description: 'Create a diameter dimension.' },
  { keys: 'DAN', command: 'DIMANGULAR', category: 'annotate', description: 'Create an angular dimension.' },
  { keys: 'T', command: 'MTEXT', category: 'annotate', description: 'Create multiline text.' },
  { keys: 'DT', command: 'DTEXT', category: 'annotate', description: 'Create single-line text.' },
  { keys: 'LE', command: 'QLEADER', category: 'annotate', description: 'Create a leader line with annotation.' },

  // Layers & Blocks
  { keys: 'LA', command: 'LAYER', category: 'layers', description: 'Open the Layer Properties Manager.' },
  { keys: 'LO', command: 'LAYER', category: 'layers', description: 'Lock/unlock layers via dialog.' },
  { keys: 'B', command: 'BLOCK', category: 'layers', description: 'Create a block definition from selected objects.' },
  { keys: 'I', command: 'INSERT', category: 'layers', description: 'Insert a block or drawing file.' },
  { keys: 'W', command: 'WBLOCK', category: 'layers', description: 'Write a block to an external file.' },
  { keys: 'ATT', command: 'ATTDEF', category: 'layers', description: 'Define an attribute for a block.' },
  { keys: 'BO', command: 'BOUNDARY', category: 'layers', description: 'Create a closed polyline or region from enclosed areas.' },

  // System & View
  { keys: 'Ctrl + S', command: 'SAVE', category: 'system', description: 'Save the current drawing.' },
  { keys: 'Ctrl + Shift + S', command: 'SAVEAS', category: 'system', description: 'Save the drawing under a new name.' },
  { keys: 'Ctrl + Z', command: 'UNDO', category: 'system', description: 'Reverse the last action.' },
  { keys: 'Ctrl + Y', command: 'REDO', category: 'system', description: 'Reverse the effect of UNDO.' },
  { keys: 'Ctrl + A', command: 'SELECT ALL', category: 'system', description: 'Select all objects in the drawing.' },
  { keys: 'Ctrl + 1', command: 'PROPERTIES', category: 'system', description: 'Toggle the Properties palette.' },
  { keys: 'Ctrl + 2', command: 'DESIGNCENTER', category: 'system', description: 'Toggle the DesignCenter palette.' },
  { keys: 'Ctrl + 3', command: 'TOOLPALETTES', category: 'system', description: 'Toggle the Tool Palettes window.' },
  { keys: 'Ctrl + 8', command: 'QUICKCALC', category: 'system', description: 'Toggle the QuickCalc calculator.' },
  { keys: 'Ctrl + 9', command: 'COMMAND LINE', category: 'system', description: 'Toggle the command line window.' },
  { keys: 'F1', command: 'HELP', category: 'system', description: 'Open AutoCAD help documentation.' },
  { keys: 'F2', command: 'TEXT SCREEN', category: 'system', description: 'Toggle the text window (command history).' },
  { keys: 'F3', command: 'OSNAP', category: 'system', description: 'Toggle running object snaps.' },
  { keys: 'F7', command: 'GRID', category: 'system', description: 'Toggle the grid display.' },
  { keys: 'F8', command: 'ORTHO', category: 'system', description: 'Toggle orthogonal mode.' },
  { keys: 'F9', command: 'SNAP', category: 'system', description: 'Toggle snap mode.' },
  { keys: 'F10', command: 'POLAR', category: 'system', description: 'Toggle polar tracking.' },
  { keys: 'F11', command: 'OTRACK', category: 'system', description: 'Toggle object snap tracking.' },
  { keys: 'Z', command: 'ZOOM', category: 'system', description: 'Zoom in/out of the drawing area.' },
  { keys: 'P', command: 'PAN', category: 'system', description: 'Pan the view without changing zoom.' },
  { keys: 'RE', command: 'REGEN', category: 'system', description: 'Regenerate the drawing to update display.' },
  { keys: 'OP', command: 'OPTIONS', category: 'system', description: 'Open the Options dialog for settings.' },
  { keys: 'PU', command: 'PURGE', category: 'system', description: 'Remove unused named objects from the drawing.' },
];

const TIPS = [
  {
    title: 'Customize aliases via the PGP file',
    content: 'AutoCAD command aliases are stored in acad.pgp. Use the ALIASEDIT command or open the file directly to add your own shortcuts. For example, map CC to COPY to avoid conflicts with CIRCLE (C).'
  },
  {
    title: 'Function keys are your fastest toggles',
    content: 'F3 (OSNAP), F8 (ORTHO), and F10 (POLAR) are the most frequently used toggles. Memorize these three and your drafting speed will increase dramatically — no need to reach for the status bar.'
  },
];

export default function AutoCADShortcutsClient() {
  return (
    <ShortcutCheatsheetClient
      title="AutoCAD"
      subtitle="The complete reference for AutoCAD keyboard shortcuts, function keys, and command aliases. Search, copy, and print for your daily drafting workflow."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      downloadAliasText={`; AutoCAD Command Aliases
L,*LINE
C,*CIRCLE
A,*ARC
REC,*RECTANGLE
PL,*PLINE
POL,*POLYGON
EL,*ELLIPSE
H,*HATCH
SPL,*SPLINE
CO,*COPY
M,*MOVE
RO,*ROTATE
SC,*SCALE
MI,*MIRROR
O,*OFFSET
AR,*ARRAY
TR,*TRIM
EX,*EXTEND
F,*FILLET
CHA,*CHAMFER
BR,*BREAK
J,*JOIN
X,*EXPLODE
LA,*LAYER
B,*BLOCK
I,*INSERT
W,*WBLOCK
D,*DIMSTYLE
T,*MTEXT
Z,*ZOOM
P,*PAN
RE,*REGEN
PU,*PURGE
OP,*OPTIONS`}
      downloadAliasFileName="autocad_aliases.pgp"
    />
  );
}
