export interface CADShortcut {
  shortcut: string;
  command: string;
  category: 'draw' | 'modify' | 'annotate' | 'view' | 'file' | 'mode';
  description: string;
}

export const ZWCAD_OFFICIAL_SHORTCUTS_URL = 'https://www.zwsoft.com/user-guide/shortcut-keys-of-zwcad';

/**
 * Every entry below is reproduced verbatim from the official ZWCAD User Guide:
 * https://www.zwsoft.com/user-guide/shortcut-keys-of-zwcad
 */
export const SHORTCUTS_DATA: CADShortcut[] = [
  // Single-Key Shortcut Keys (22 verified entries)
  { shortcut: 'A', command: 'ARC', category: 'draw', description: 'Draw an arc.' },
  { shortcut: 'B', command: 'BLOCK', category: 'annotate', description: 'Create a block.' },
  { shortcut: 'C', command: 'CIRCLE', category: 'draw', description: 'Draw a circle.' },
  { shortcut: 'D', command: 'DIMSTYLE', category: 'annotate', description: 'Manage dimension styles.' },
  { shortcut: 'E', command: 'ERASE', category: 'modify', description: 'Delete objects.' },
  { shortcut: 'F', command: 'FILLET', category: 'modify', description: 'Create a fillet between objects.' },
  { shortcut: 'G', command: 'GROUP', category: 'modify', description: 'Create a group.' },
  { shortcut: 'H', command: 'HATCH', category: 'draw', description: 'Create a hatch.' },
  { shortcut: 'I', command: 'INSERT', category: 'annotate', description: 'Insert a block.' },
  { shortcut: 'J', command: 'JOIN', category: 'modify', description: 'Join objects.' },
  { shortcut: 'L', command: 'LINE', category: 'draw', description: 'Draw a line.' },
  { shortcut: 'M', command: 'MOVE', category: 'modify', description: 'Move objects.' },
  { shortcut: 'O', command: 'OFFSET', category: 'modify', description: 'Offset an object.' },
  { shortcut: 'P', command: 'PAN', category: 'view', description: 'Pan view.' },
  { shortcut: 'R', command: 'REDRAW', category: 'view', description: 'Refresh display.' },
  { shortcut: 'S', command: 'STRETCH', category: 'modify', description: 'Stretch objects.' },
  { shortcut: 'T', command: 'MTEXT', category: 'annotate', description: 'Create multiline text.' },
  { shortcut: 'U', command: 'UNDO', category: 'modify', description: 'Cancel previous actions.' },
  { shortcut: 'V', command: 'VIEW', category: 'view', description: 'Manage views.' },
  { shortcut: 'W', command: 'WBLOCK', category: 'file', description: 'Save a block file.' },
  { shortcut: 'X', command: 'EXPLODE', category: 'modify', description: 'Explode objects.' },
  { shortcut: 'Z', command: 'ZOOM', category: 'view', description: 'Zoom view.' },

  // Drawing Mode & Function Keys (10 verified entries)
  { shortcut: 'F1', command: 'HELP', category: 'mode', description: 'Open help document.' },
  { shortcut: 'F2', command: 'F2', category: 'view', description: 'Open command line window.' },
  { shortcut: 'F3', command: 'F3', category: 'mode', description: 'Turn object snapping on/off.' },
  { shortcut: 'F5 / Ctrl+E', command: 'ISOPLANE', category: 'mode', description: 'Switch isometric planes.' },
  { shortcut: 'F6', command: 'F6', category: 'mode', description: 'Enable/disable real-time display of coordinates.' },
  { shortcut: 'F7 / Ctrl+G', command: 'F7 / Ctrl+G', category: 'mode', description: 'Turn grid display on/off.' },
  { shortcut: 'F8 / Ctrl+L', command: 'F8 / Ctrl+L', category: 'mode', description: 'Turn orthogonal mode on/off.' },
  { shortcut: 'F9 / Ctrl+B', command: 'F9 / Ctrl+B', category: 'mode', description: 'Turn grid snap on/off.' },
  { shortcut: 'F11', command: 'F11', category: 'mode', description: 'Turn object snap tracking on/off.' },
  { shortcut: 'F12', command: 'F12', category: 'mode', description: 'Enable/disable dynamic input.' },

  // Screen, Clipboard & File Management (8 verified entries)
  { shortcut: 'Ctrl+0', command: 'CLEANSCREENON / CLEANSCREENOFF', category: 'view', description: 'Turn full screen display on/off.' },
  { shortcut: 'Ctrl+1', command: 'PROPERTIES / PROPERTIESCLOSE', category: 'view', description: 'Open/close the Properties palette.' },
  { shortcut: 'Ctrl+9', command: 'COMMANDLINE / COMMANDLINEHIDE', category: 'view', description: 'Show/hide command window.' },
  { shortcut: 'Ctrl+Z', command: 'U', category: 'modify', description: 'Cancel the previous action.' },
  { shortcut: 'Ctrl+Y', command: 'MREDO', category: 'modify', description: 'Restore previous actions.' },
  { shortcut: 'Ctrl+C', command: 'COPYCLIP', category: 'modify', description: 'Copy to clipboard.' },
  { shortcut: 'Ctrl+V', command: 'PASTECLIP', category: 'modify', description: 'Paste from clipboard.' },
  { shortcut: 'Ctrl+S', command: 'QSAVE', category: 'file', description: 'Quick save drawing.' },
  { shortcut: 'Ctrl+N', command: 'NEW', category: 'file', description: 'Create a drawing file.' },
  { shortcut: 'Ctrl+O', command: 'OPEN', category: 'file', description: 'Open a drawing file.' },
  { shortcut: 'Ctrl+P', command: 'PLOT', category: 'file', description: 'Plot a drawing.' },
];

export const SHORTCUT_CATEGORIES = [
  { id: 'all', name: 'All Verified Shortcuts' },
  { id: 'draw', name: 'Drawing' },
  { id: 'modify', name: 'Modify & Clipboard' },
  { id: 'annotate', name: 'Blocks & Text' },
  { id: 'view', name: 'View & Palettes' },
  { id: 'mode', name: 'Drawing Modes' },
  { id: 'file', name: 'File Management' },
];
