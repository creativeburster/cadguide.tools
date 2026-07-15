'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'design', name: '✏️ Design' },
  { id: 'edit', name: '🛠️ Edit' },
  { id: 'view', name: '👁️ View' },
  { id: 'select', name: '🖱️ Select' },
  { id: 'system', name: '💻 System' },
];

const SHORTCUTS = [
  // Design
  { keys: 'P', command: 'Pull', category: 'design', description: 'Pull faces, edges, or surfaces to extrude or modify geometry.' },
  { keys: 'M', command: 'Move', category: 'design', description: 'Move selected faces, edges, or objects.' },
  { keys: 'F', command: 'Fill', category: 'design', description: 'Fill selected faces or surfaces to create a solid.' },
  { keys: 'C', command: 'Combine', category: 'design', description: 'Combine target and tool bodies (merge, subtract, intersect).' },
  { keys: 'S', command: 'Sketch', category: 'design', description: 'Enter sketch mode on a selected plane or face.' },
  { keys: 'R', command: 'Rectangle', category: 'design', description: 'Draw a rectangle in sketch mode.' },
  { keys: 'C', command: 'Circle', category: 'design', description: 'Draw a circle in sketch mode.' },
  { keys: 'L', command: 'Line', category: 'design', description: 'Draw a line in sketch mode.' },
  { keys: 'A', command: 'Arc', category: 'design', description: 'Draw an arc in sketch mode.' },
  { keys: 'O', command: 'Offset', category: 'design', description: 'Offset faces, edges, or sketch curves.' },
  { keys: 'H', command: 'Hole', category: 'design', description: 'Create a hole feature.' },
  { keys: 'R', command: 'Round', category: 'design', description: 'Round selected edges (also accessible via Pull on edges).' },
  { keys: 'D', command: 'Dimension', category: 'design', description: 'Add a dimension to sketch entities.' },
  { keys: 'I', command: 'Intersect', category: 'design', description: 'Create intersecting geometry from selected bodies.' },

  // Edit
  { keys: 'Ctrl + Z', command: 'Undo', category: 'edit', description: 'Undo the last action.' },
  { keys: 'Ctrl + Y', command: 'Redo', category: 'edit', description: 'Redo the last undone action.' },
  { keys: 'Ctrl + C', command: 'Copy', category: 'edit', description: 'Copy selected objects.' },
  { keys: 'Ctrl + V', command: 'Paste', category: 'edit', description: 'Paste copied objects.' },
  { keys: 'Ctrl + X', command: 'Cut', category: 'edit', description: 'Cut selected objects.' },
  { keys: 'Delete', command: 'Delete', category: 'edit', description: 'Delete selected objects.' },
  { keys: 'Ctrl + Shift + V', command: 'Paste on Structure', category: 'edit', description: 'Paste at original coordinates.' },
  { keys: 'Ctrl + A', command: 'Select All', category: 'edit', description: 'Select all objects in the design.' },

  // View
  { keys: 'Ctrl + 1', command: 'Front View', category: 'view', description: 'Switch to front view.' },
  { keys: 'Ctrl + 2', command: 'Top View', category: 'view', description: 'Switch to top view.' },
  { keys: 'Ctrl + 3', command: 'Right View', category: 'view', description: 'Switch to right view.' },
  { keys: 'Ctrl + 4', command: 'Isometric View', category: 'view', description: 'Switch to isometric view.' },
  { keys: 'Ctrl + 5', command: 'Back View', category: 'view', description: 'Switch to back view.' },
  { keys: 'Ctrl + 6', command: 'Bottom View', category: 'view', description: 'Switch to bottom view.' },
  { keys: 'Ctrl + 7', command: 'Left View', category: 'view', description: 'Switch to left view.' },
  { keys: 'F', command: 'Zoom to Fit', category: 'view', description: 'Zoom to fit all geometry in the viewport.' },
  { keys: 'Z', command: 'Zoom In', category: 'view', description: 'Zoom in.' },
  { keys: 'Shift + Z', command: 'Zoom Out', category: 'view', description: 'Zoom out.' },
  { keys: 'Ctrl + Shift + Z', command: 'Zoom to Selection', category: 'view', description: 'Zoom to fit the selected object.' },
  { keys: 'Ctrl + D', command: 'Toggle Dimensions', category: 'view', description: 'Show/hide dimensions.' },
  { keys: 'Ctrl + H', command: 'Hide Selected', category: 'view', description: 'Hide the selected objects.' },
  { keys: 'Ctrl + Shift + H', command: 'Show All', category: 'view', description: 'Show all hidden objects.' },

  // Select
  { keys: 'Ctrl', command: 'Add to Selection', category: 'select', description: 'Hold Ctrl to add objects to the current selection.' },
  { keys: 'Shift', command: 'Remove from Selection', category: 'select', description: 'Hold Shift to remove objects from selection.' },
  { keys: 'Ctrl + Shift', command: 'Toggle Selection', category: 'select', description: 'Hold Ctrl+Shift to toggle selection state.' },
  { keys: 'Tab', command: 'Cycle Selection', category: 'select', description: 'Cycle through selectable objects under the cursor.' },

  // System
  { keys: 'Ctrl + S', command: 'Save', category: 'system', description: 'Save the current document.' },
  { keys: 'Ctrl + O', command: 'Open', category: 'system', description: 'Open a file.' },
  { keys: 'Ctrl + N', command: 'New', category: 'system', description: 'Create a new document.' },
  { keys: 'Ctrl + P', command: 'Print', category: 'system', description: 'Open the print dialog.' },
  { keys: 'Ctrl + E', command: 'Export', category: 'system', description: 'Export the design to another format.' },
  { keys: 'Ctrl + I', command: 'Import', category: 'system', description: 'Import a file into the current design.' },
  { keys: 'F1', command: 'Help', category: 'system', description: 'Open SpaceClaim help.' },
];

const TIPS = [
  {
    title: 'Pull is the universal modeling tool',
    content: 'In SpaceClaim, the Pull tool (P) does much more than extrude. It can round edges, offset faces, extend surfaces, and even revolve profiles. Master Pull and you can handle 80% of modeling tasks without switching tools.'
  },
  {
    title: 'Tab to cycle through nearby objects',
    content: 'When multiple faces or edges overlap under your cursor, press Tab to cycle through them. This is much faster than rotating the view to click from a different angle. The selection highlight updates as you cycle.'
  },
];

export default function SpaceClaimShortcutsClient() {
  return (
    <ShortcutCheatsheetClient
      title="SpaceClaim"
      subtitle="Searchable reference for Ansys SpaceClaim keyboard shortcuts covering design tools, editing, viewing, and selection workflows."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
