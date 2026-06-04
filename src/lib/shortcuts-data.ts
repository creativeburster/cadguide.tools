export interface ShortcutItem {
  command: string;
  shortcut: string;
  category: 'draw' | 'modify' | 'annotate' | 'utility';
  description: string;
  autocad: string;
  gstarcad: string;
  zwcad: string;
  dwgfastview: string;
  notes: string;
}

export const SHORTCUT_CATEGORIES = [
  { id: 'all', name: 'All Shortcuts' },
  { id: 'draw', name: 'Draw (绘图)' },
  { id: 'modify', name: 'Modify (修改)' },
  { id: 'annotate', name: 'Annotate & Dimension (标注/文字)' },
  { id: 'utility', name: 'Utility & Tools (工具/设置)' },
] as const;

export const SHORTCUTS_DATA: ShortcutItem[] = [
  // DRAW
  {
    command: 'LINE',
    shortcut: 'L',
    category: 'draw',
    description: 'Creates straight line segments.',
    autocad: 'L',
    gstarcad: 'L',
    zwcad: 'L',
    dwgfastview: 'L (Desktop) / Draw Tool (Mobile)',
    notes: 'Universal command across all CAD systems.'
  },
  {
    command: 'CIRCLE',
    shortcut: 'C',
    category: 'draw',
    description: 'Creates a circle based on center/radius or diameter.',
    autocad: 'C',
    gstarcad: 'C',
    zwcad: 'C',
    dwgfastview: 'C (Desktop) / Draw Tool (Mobile)',
    notes: 'Supports 2P, 3P, and Ttr options.'
  },
  {
    command: 'ARC',
    shortcut: 'A',
    category: 'draw',
    description: 'Creates an arc using three points.',
    autocad: 'A',
    gstarcad: 'A',
    zwcad: 'A',
    dwgfastview: 'A (Desktop)',
    notes: 'Default option is 3-point arc.'
  },
  {
    command: 'RECTANGLE',
    shortcut: 'REC',
    category: 'draw',
    description: 'Creates a rectangular polyline.',
    autocad: 'REC',
    gstarcad: 'REC',
    zwcad: 'REC',
    dwgfastview: 'REC (Desktop) / Rectangle Tool',
    notes: 'Creates closed 2D polylines.'
  },
  {
    command: 'POLYLINE',
    shortcut: 'PL',
    category: 'draw',
    description: 'Creates a 2D polyline, a single object composed of line and arc segments.',
    autocad: 'PL',
    gstarcad: 'PL',
    zwcad: 'PL',
    dwgfastview: 'PL (Desktop)',
    notes: 'Crucial command for high-performance BIM conversion later.'
  },
  {
    command: 'POLYGON',
    shortcut: 'POL',
    category: 'draw',
    description: 'Creates an equilateral closed polyline.',
    autocad: 'POL',
    gstarcad: 'POL',
    zwcad: 'POL',
    dwgfastview: 'Supported via menu',
    notes: 'Specify number of sides (3-1024).'
  },
  {
    command: 'HATCH',
    shortcut: 'H',
    category: 'draw',
    description: 'Fills an enclosed area or selected objects with a hatch pattern.',
    autocad: 'H',
    gstarcad: 'H',
    zwcad: 'H',
    dwgfastview: 'H (View pattern only)',
    notes: 'DWG FastView mobile displays hatches but editing is limited.'
  },
  {
    command: 'ELLIPSE',
    shortcut: 'EL',
    category: 'draw',
    description: 'Creates an ellipse or an elliptical arc.',
    autocad: 'EL',
    gstarcad: 'EL',
    zwcad: 'EL',
    dwgfastview: 'EL (Desktop)',
    notes: 'Calculated using major and minor axes.'
  },

  // MODIFY
  {
    command: 'ERASE',
    shortcut: 'E',
    category: 'modify',
    description: 'Removes objects from a drawing.',
    autocad: 'E / Delete key',
    gstarcad: 'E / Delete key',
    zwcad: 'E / Delete key',
    dwgfastview: 'Delete Tool',
    notes: 'Delete key is the preferred cross-platform shortcut.'
  },
  {
    command: 'COPY',
    shortcut: 'CO / CP',
    category: 'modify',
    description: 'Copies objects a specified distance in a specified direction.',
    autocad: 'CO or CP',
    gstarcad: 'CO or CP',
    zwcad: 'CO or CP',
    dwgfastview: 'Copy Tool',
    notes: 'Both CO and CP trigger the copy command.'
  },
  {
    command: 'MIRROR',
    shortcut: 'MI',
    category: 'modify',
    description: 'Creates a mirrored copy of selected objects.',
    autocad: 'MI',
    gstarcad: 'MI',
    zwcad: 'MI',
    dwgfastview: 'MI (Desktop)',
    notes: 'Option to delete or retain original objects after mirroring.'
  },
  {
    command: 'OFFSET',
    shortcut: 'O',
    category: 'modify',
    description: 'Creates concentric circles, parallel lines, and parallel curves.',
    autocad: 'O',
    gstarcad: 'O',
    zwcad: 'O',
    dwgfastview: 'O (Desktop) / Offset (Mobile Pro)',
    notes: 'Highly utilized command in floor plan drafting.'
  },
  {
    command: 'MOVE',
    shortcut: 'M',
    category: 'modify',
    description: 'Moves objects a specified distance in a specified direction.',
    autocad: 'M',
    gstarcad: 'M',
    zwcad: 'M',
    dwgfastview: 'Move Tool',
    notes: 'Fully standardized.'
  },
  {
    command: 'ROTATE',
    shortcut: 'RO',
    category: 'modify',
    description: 'Rotates objects around a base point.',
    autocad: 'RO',
    gstarcad: 'RO',
    zwcad: 'RO',
    dwgfastview: 'RO (Desktop) / Rotate (Mobile)',
    notes: 'Supports reference angle rotations.'
  },
  {
    command: 'SCALE',
    shortcut: 'SC',
    category: 'modify',
    description: 'Enlarges or reduces selected objects, keeping the proportions.',
    autocad: 'SC',
    gstarcad: 'SC',
    zwcad: 'SC',
    dwgfastview: 'SC (Desktop)',
    notes: 'Allows scaling by a scale factor or a reference distance.'
  },
  {
    command: 'STRETCH',
    shortcut: 'S',
    category: 'modify',
    description: 'Stretches objects crossed by a selection window or polygon.',
    autocad: 'S',
    gstarcad: 'S',
    zwcad: 'S',
    dwgfastview: 'S (Desktop)',
    notes: 'Requires a crossing selection (right-to-left green window).'
  },
  {
    command: 'TRIM',
    shortcut: 'TR',
    category: 'modify',
    description: 'Trims objects to meet the edges of other objects.',
    autocad: 'TR',
    gstarcad: 'TR',
    zwcad: 'TR',
    dwgfastview: 'Trim Tool',
    notes: 'AutoCAD 2021+ defaults to Quick Mode, others use standard select-cutting-edge mode.'
  },
  {
    command: 'EXTEND',
    shortcut: 'EX',
    category: 'modify',
    description: 'Extends objects to meet the edges of other objects.',
    autocad: 'EX',
    gstarcad: 'EX',
    zwcad: 'EX',
    dwgfastview: 'Extend Tool',
    notes: 'Shares similar logic to TRIM. Shift-click while trimming extends objects.'
  },
  {
    command: 'FILLET',
    shortcut: 'F',
    category: 'modify',
    description: 'Rounds and fillets the edges of objects.',
    autocad: 'F',
    gstarcad: 'F',
    zwcad: 'F',
    dwgfastview: 'F (Desktop)',
    notes: 'Radius parameter controls fillet curve (Radius=0 cleans corners).'
  },
  {
    command: 'EXPLODE',
    shortcut: 'X',
    category: 'modify',
    description: 'Breaks a compound object into its component objects (e.g. blocks to lines).',
    autocad: 'X',
    gstarcad: 'X',
    zwcad: 'X',
    dwgfastview: 'X (Desktop) / Explode Tool',
    notes: 'Crucial for dynamic block splitting.'
  },

  // ANNOTATE
  {
    command: 'TEXT',
    shortcut: 'T / MT',
    category: 'annotate',
    description: 'Creates a multiline text object (MText).',
    autocad: 'T or MT',
    gstarcad: 'T or MT',
    zwcad: 'T or MT',
    dwgfastview: 'Text Tool',
    notes: 'Preferred over single-line text (TEXT) for modern annotation.'
  },
  {
    command: 'DIMLINEAR',
    shortcut: 'DLI',
    category: 'annotate',
    description: 'Creates a linear dimension (horizontal or vertical).',
    autocad: 'DLI',
    gstarcad: 'DLI',
    zwcad: 'DLI',
    dwgfastview: 'Measure Tool',
    notes: 'Aligned dimensions should use DAL.'
  },
  {
    command: 'DIMALIGNED',
    shortcut: 'DAL',
    category: 'annotate',
    description: 'Creates an aligned linear dimension.',
    autocad: 'DAL',
    gstarcad: 'DAL',
    zwcad: 'DAL',
    dwgfastview: 'Measure Tool',
    notes: 'Aligns the dimension line parallel to the origin points.'
  },
  {
    command: 'DIMSTYLE',
    shortcut: 'D',
    category: 'annotate',
    description: 'Creates and modifies dimension styles.',
    autocad: 'D',
    gstarcad: 'D',
    zwcad: 'D',
    dwgfastview: 'Supported via Settings',
    notes: 'Important for maintaining scale consistency in drawings.'
  },
  {
    command: 'LEADER',
    shortcut: 'LE / QLEADER',
    category: 'annotate',
    description: 'Creates a leader line that connects annotation to a feature.',
    autocad: 'LE or LEADER',
    gstarcad: 'LE',
    zwcad: 'LE',
    dwgfastview: 'Leader Tool',
    notes: 'AutoCAD defaults to MLEADER, but LE / QLEADER works universally.'
  },

  // UTILITY
  {
    command: 'MATCHPROP',
    shortcut: 'MA',
    category: 'utility',
    description: 'Applies the properties of a selected object to other objects.',
    autocad: 'MA',
    gstarcad: 'MA',
    zwcad: 'MA',
    dwgfastview: 'Format Painter',
    notes: 'Matches color, layer, linetype, scale, etc.'
  },
  {
    command: 'BLOCK',
    shortcut: 'B',
    category: 'utility',
    description: 'Creates a block definition from selected objects.',
    autocad: 'B',
    gstarcad: 'B',
    zwcad: 'B',
    dwgfastview: 'B (Desktop)',
    notes: 'Allows saving repetitive geometries into reusable symbols.'
  },
  {
    command: 'INSERT',
    shortcut: 'I',
    category: 'utility',
    description: 'Inserts a block or drawing into the current drawing.',
    autocad: 'I',
    gstarcad: 'I',
    zwcad: 'I',
    dwgfastview: 'Insert Block Tool',
    notes: 'In modern AutoCAD, triggers the block palette; in others, opens the classic dialog box.'
  },
  {
    command: 'MEASURE',
    shortcut: 'MEA / DIST',
    category: 'utility',
    description: 'Measures distance, radius, angle, area, and volume of selected objects.',
    autocad: 'MEA or DI',
    gstarcad: 'MEA or DI',
    zwcad: 'MEA or DI',
    dwgfastview: 'Measure Tool',
    notes: 'DI (DIST) is the fastest way to get simple point-to-point distances.'
  },
  {
    command: 'LAYER',
    shortcut: 'LA',
    category: 'utility',
    description: 'Manages layers and layer properties.',
    autocad: 'LA',
    gstarcad: 'LA',
    zwcad: 'LA',
    dwgfastview: 'Layer Manager',
    notes: 'Opens the layer palette/dialog control panel.'
  },
  {
    command: 'OPTIONS',
    shortcut: 'OP',
    category: 'utility',
    description: 'Customizes the program settings (files, display, drafting limits).',
    autocad: 'OP',
    gstarcad: 'OP',
    zwcad: 'OP',
    dwgfastview: 'Options Panel',
    notes: 'Opens the main configuration wizard of the desktop CAD.'
  }
];
