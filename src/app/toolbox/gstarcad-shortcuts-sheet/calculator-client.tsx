'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'draw', name: '✏️ Drawing' },
  { id: 'modify', name: '🛠️ Modify' },
  { id: 'annotate', name: '📐 Annotate' },
  { id: 'system', name: '💻 System & View' },
];

const SHORTCUTS = [
  // Drawing
  { keys: 'L', command: 'LINE', category: 'draw', description: 'Draw straight line segments.' },
  { keys: 'C', command: 'CIRCLE', category: 'draw', description: 'Create a circle by center and radius.' },
  { keys: 'A', command: 'ARC', category: 'draw', description: 'Create an arc using three points.' },
  { keys: 'REC', command: 'RECTANGLE', category: 'draw', description: 'Draw a rectangular polyline.' },
  { keys: 'PL', command: 'PLINE', category: 'draw', description: 'Create a 2D polyline.' },
  { keys: 'POL', command: 'POLYGON', category: 'draw', description: 'Create an equilateral closed polyline.' },
  { keys: 'EL', command: 'ELLIPSE', category: 'draw', description: 'Create an ellipse or elliptical arc.' },
  { keys: 'H', command: 'HATCH', category: 'draw', description: 'Fill an enclosed area with a hatch pattern.' },
  { keys: 'SPL', command: 'SPLINE', category: 'draw', description: 'Create a smooth curve through fit points.' },

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
  { keys: 'J', command: 'JOIN', category: 'modify', description: 'Join collinear lines or coplanar arcs.' },

  // Annotate
  { keys: 'D', command: 'DIMSTYLE', category: 'annotate', description: 'Create and modify dimension styles.' },
  { keys: 'DLI', command: 'DIMLINEAR', category: 'annotate', description: 'Create a linear dimension.' },
  { keys: 'DAL', command: 'DIMALIGNED', category: 'annotate', description: 'Create an aligned dimension.' },
  { keys: 'T', command: 'MTEXT', category: 'annotate', description: 'Create multiline text.' },
  { keys: 'LE', command: 'QLEADER', category: 'annotate', description: 'Create a leader line with annotation.' },

  // System & View
  { keys: 'Ctrl + S', command: 'SAVE', category: 'system', description: 'Save the current drawing.' },
  { keys: 'Ctrl + Z', command: 'UNDO', category: 'system', description: 'Reverse the last action.' },
  { keys: 'Ctrl + Y', command: 'REDO', category: 'system', description: 'Reverse the effect of UNDO.' },
  { keys: 'Ctrl + 1', command: 'PROPERTIES', category: 'system', description: 'Toggle the Properties palette.' },
  { keys: 'Ctrl + 9', command: 'COMMAND LINE', category: 'system', description: 'Toggle the command line window.' },
  { keys: 'F3', command: 'OSNAP', category: 'system', description: 'Toggle running object snaps.' },
  { keys: 'F7', command: 'GRID', category: 'system', description: 'Toggle the grid display.' },
  { keys: 'F8', command: 'ORTHO', category: 'system', description: 'Toggle orthogonal mode.' },
  { keys: 'F9', command: 'SNAP', category: 'system', description: 'Toggle snap mode.' },
  { keys: 'F10', command: 'POLAR', category: 'system', description: 'Toggle polar tracking.' },
  { keys: 'F11', command: 'OTRACK', category: 'system', description: 'Toggle object snap tracking.' },
  { keys: 'Z', command: 'ZOOM', category: 'system', description: 'Zoom in/out of the drawing area.' },
  { keys: 'P', command: 'PAN', category: 'system', description: 'Pan the view without changing zoom.' },
  { keys: 'RE', command: 'REGEN', category: 'system', description: 'Regenerate the drawing display.' },
  { keys: 'PU', command: 'PURGE', category: 'system', description: 'Remove unused named objects.' },
  { keys: 'LA', command: 'LAYER', category: 'system', description: 'Open the Layer Properties Manager.' },
  { keys: 'B', command: 'BLOCK', category: 'system', description: 'Create a block definition.' },
  { keys: 'I', command: 'INSERT', category: 'system', description: 'Insert a block or drawing file.' },
];

const TIPS = [
  {
    title: 'GstarCAD aliases match AutoCAD by default',
    content: 'GstarCAD ships with the same default command aliases as AutoCAD. Type L for LINE, C for CIRCLE, etc. You can view and customize aliases via Ribbon > Manage tab > Customize Settings panel > Edit Aliases.'
  },
  {
    title: 'Classic workspace menu shortcuts',
    content: 'In GstarCAD Classic workspace, menu items have underlined letters (e.g., New has N underlined). Press Alt + the underlined letter to quickly access menu commands without using the mouse.'
  },
];

export default function GstarCADShortcutsClient() {
  return (
    <ShortcutCheatsheetClient
      title="GstarCAD"
      subtitle="Searchable reference for GstarCAD keyboard shortcuts, function keys, and command aliases — fully compatible with AutoCAD PGP format."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      downloadAliasText={`; GstarCAD Command Aliases
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
X,*EXPLODE
J,*JOIN
D,*DIMSTYLE
T,*MTEXT
Z,*ZOOM
P,*PAN
RE,*REGEN
PU,*PURGE
LA,*LAYER
B,*BLOCK
I,*INSERT`}
      downloadAliasFileName="gstarcad_aliases.pgp"
    />
  );
}
