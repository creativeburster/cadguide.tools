'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'draw', name: '✏️ Drawing' },
  { id: 'modify', name: '🛠️ Modify' },
  { id: 'system', name: '💻 System & View' },
];

const SHORTCUTS = [
  // Drawing
  { keys: 'L', command: 'LINE', category: 'draw', description: 'Draw straight line segments.' },
  { keys: 'C', command: 'CIRCLE', category: 'draw', description: 'Create a circle by center and radius.' },
  { keys: 'A', command: 'ARC', category: 'draw', description: 'Create an arc using three points.' },
  { keys: 'REC', command: 'RECTANGLE', category: 'draw', description: 'Draw a rectangular polyline (supports square and rotated options).' },
  { keys: 'PL', command: 'PLINE', category: 'draw', description: 'Create a 2D polyline.' },
  { keys: 'POL', command: 'POLYGON', category: 'draw', description: 'Create an equilateral closed polyline.' },
  { keys: 'EL', command: 'ELLIPSE', category: 'draw', description: 'Create an ellipse or elliptical arc.' },
  { keys: 'H', command: 'HATCH', category: 'draw', description: 'Fill an enclosed area with a hatch pattern.' },

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
  { keys: 'X', command: 'EXPLODE', category: 'modify', description: 'Break a compound object into components.' },

  // System & View
  { keys: 'Ctrl + S', command: 'SAVE', category: 'system', description: 'Save the current drawing.' },
  { keys: 'Ctrl + Z', command: 'UNDO', category: 'system', description: 'Reverse the last action.' },
  { keys: 'Ctrl + Y', command: 'REDO', category: 'system', description: 'Reverse the effect of UNDO.' },
  { keys: 'Ctrl + Q', command: 'QUIT', category: 'system', description: 'Exit progeCAD (Alt+F4 also works).' },
  { keys: 'F1', command: 'HELP', category: 'system', description: 'Open progeCAD help.' },
  { keys: 'F3', command: 'OSNAP', category: 'system', description: 'Toggle running object snaps (Ctrl+F also).' },
  { keys: 'F6', command: 'COORDS', category: 'system', description: 'Toggle coordinate display (Ctrl+D, Ctrl+I also).' },
  { keys: 'F7', command: 'GRID', category: 'system', description: 'Toggle the grid display (Ctrl+G also).' },
  { keys: 'F8', command: 'ORTHO', category: 'system', description: 'Toggle orthogonal mode (Ctrl+L also).' },
  { keys: 'F9', command: 'SNAP', category: 'system', description: 'Toggle snap mode (Ctrl+B also).' },
  { keys: 'F10', command: 'POLAR', category: 'system', description: 'Toggle polar tracking (Ctrl+U also).' },
  { keys: 'F11', command: 'OTRACK', category: 'system', description: 'Toggle object snap tracking.' },
  { keys: 'Z', command: 'ZOOM', category: 'system', description: 'Zoom in/out of the drawing area.' },
  { keys: 'P', command: 'PAN', category: 'system', description: 'Pan the view without changing zoom.' },
  { keys: 'RE', command: 'REGEN', category: 'system', description: 'Regenerate the drawing display.' },
  { keys: 'PU', command: 'PURGE', category: 'system', description: 'Remove unused named objects.' },
  { keys: 'LA', command: 'LAYER', category: 'system', description: 'Open the Layer dialog.' },
  { keys: 'B', command: 'BLOCK', category: 'system', description: 'Create a block definition.' },
  { keys: 'I', command: 'INSERT', category: 'system', description: 'Insert a block or drawing file.' },
];

const TIPS = [
  {
    title: 'Full AutoCAD alias compatibility',
    content: 'progeCAD uses the same aliases and keyboard shortcuts as AutoCAD. You can import .pgp alias files and .ick keystroke shortcut files directly via Tools > Customize User Interface. This makes migration from AutoCAD seamless.'
  },
  {
    title: 'Enhanced rectangle command',
    content: 'progeCAD adds two options to the RECTANGLE command that AutoCAD lacks: draw as square and rotate at an angle. Access these via the command prompt after typing REC.'
  },
];

export default function ProgeCADShortcutsClient() {
  return (
    <ShortcutCheatsheetClient
      title="progeCAD"
      subtitle="Searchable reference for progeCAD keyboard shortcuts, function keys, and AutoCAD-compatible command aliases for efficient 2D drafting."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      downloadAliasText={`; progeCAD Command Aliases
L,*LINE
C,*CIRCLE
A,*ARC
REC,*RECTANGLE
PL,*PLINE
POL,*POLYGON
EL,*ELLIPSE
H,*HATCH
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
X,*EXPLODE
Z,*ZOOM
P,*PAN
RE,*REGEN
PU,*PURGE
LA,*LAYER
B,*BLOCK
I,*INSERT`}
      downloadAliasFileName="progecad_aliases.ica"
    />
  );
}
