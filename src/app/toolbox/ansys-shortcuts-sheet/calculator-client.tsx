'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'general', name: '⚙️ General' },
  { id: 'view', name: '👁️ View' },
  { id: 'model', name: '🔧 Model Setup' },
  { id: 'post', name: '📊 Post-Processing' },
];

const SHORTCUTS = [
  // General
  { keys: 'Ctrl + S', command: 'Save Project', category: 'general', description: 'Save the current Workbench project.' },
  { keys: 'Ctrl + N', command: 'New Project', category: 'general', description: 'Create a new project in Workbench.' },
  { keys: 'Ctrl + O', command: 'Open Project', category: 'general', description: 'Open an existing project.' },
  { keys: 'Ctrl + Z', command: 'Undo', category: 'general', description: 'Undo the last action.' },
  { keys: 'Ctrl + Y', command: 'Redo', category: 'general', description: 'Redo the last undone action.' },
  { keys: 'Ctrl + C', command: 'Copy', category: 'general', description: 'Copy selected items.' },
  { keys: 'Ctrl + V', command: 'Paste', category: 'general', description: 'Paste copied items.' },
  { keys: 'Ctrl + A', command: 'Select All', category: 'general', description: 'Select all items in the current view.' },
  { keys: 'Delete', command: 'Delete', category: 'general', description: 'Delete selected items.' },
  { keys: 'F1', command: 'Help', category: 'general', description: 'Open ANSYS help documentation.' },
  { keys: 'F5', command: 'Update', category: 'general', description: 'Update the selected cell or system.' },
  { keys: 'F2', command: 'Rename', category: 'general', description: 'Rename the selected item.' },
  { keys: 'Esc', command: 'Cancel', category: 'general', description: 'Cancel the current operation.' },
  { keys: 'Ctrl + Shift + I', command: 'Import', category: 'general', description: 'Import geometry from external CAD.' },
  { keys: 'Ctrl + Shift + E', command: 'Export', category: 'general', description: 'Export geometry or results.' },

  // View
  { keys: 'Ctrl + Shift + F', command: 'Fit All', category: 'view', description: 'Zoom to fit all geometry in the viewport.' },
  { keys: 'Ctrl + Shift + Z', category: 'view', command: 'Zoom to Selection', description: 'Zoom to fit the selected entities.' },
  { keys: 'Ctrl + Shift + V', command: 'Isometric View', category: 'view', description: 'Switch to isometric view.' },
  { keys: 'Ctrl + Shift + X', command: 'Front View', category: 'view', description: 'Switch to front view.' },
  { keys: 'Ctrl + Shift + Y', command: 'Top View', category: 'view', description: 'Switch to top view.' },
  { keys: 'Ctrl + Shift + C', command: 'Wireframe', category: 'view', description: 'Toggle wireframe display mode.' },
  { keys: 'Ctrl + Shift + S', command: 'Shaded', category: 'view', description: 'Toggle shaded display mode.' },
  { keys: 'Ctrl + Shift + E', command: 'Edges', category: 'view', description: 'Toggle edge display in shaded mode.' },
  { keys: 'Ctrl + Shift + H', command: 'Hide Selected', category: 'view', description: 'Hide the selected bodies or faces.' },
  { keys: 'Ctrl + Shift + U', command: 'Show All', category: 'view', description: 'Show all hidden bodies and faces.' },

  // Model Setup
  { keys: 'Ctrl + Shift + M', command: 'Mesh', category: 'model', description: 'Generate or update the mesh.' },
  { keys: 'Ctrl + Shift + B', command: 'Boundary Conditions', category: 'model', description: 'Open boundary condition tools.' },
  { keys: 'Ctrl + Shift + L', command: 'Loads', category: 'model', description: 'Open load application tools.' },
  { keys: 'Ctrl + Shift + R', command: 'Solve', category: 'model', description: 'Start the solver for the current analysis.' },
  { keys: 'Ctrl + Shift + N', command: 'Named Selection', category: 'model', description: 'Create a named selection from selected entities.' },
  { keys: 'Ctrl + Shift + G', command: 'Geometry Update', category: 'model', description: 'Update geometry from the CAD model.' },

  // Post-Processing
  { keys: 'Ctrl + Shift + T', command: 'Total Deformation', category: 'post', description: 'Insert a total deformation result.' },
  { keys: 'Ctrl + Shift + S', command: 'Stress', category: 'post', description: 'Insert an equivalent (von Mises) stress result.' },
  { keys: 'Ctrl + Shift + A', command: 'Animate', category: 'post', description: 'Play result animation.' },
  { keys: 'Ctrl + Shift + P', command: 'Probe', category: 'post', description: 'Activate the probe tool for result values.' },
  { keys: 'Ctrl + Shift + D', command: 'Contours', category: 'post', description: 'Toggle contour display for results.' },
  { keys: 'Ctrl + Shift + W', command: 'Wireframe Results', category: 'post', description: 'Toggle wireframe overlay on results.' },
];

const TIPS = [
  {
    title: 'Customize hotkeys in the Customize dialog',
    content: 'ANSYS Mechanical allows full hotkey customization. Go to Tools > Customize > Keyboard to view and reassign all shortcuts. You can also import and export key assignment files for team consistency.'
  },
  {
    title: 'F5 updates cells in Workbench',
    content: 'In the ANSYS Workbench project schematic, press F5 to update a selected cell (e.g., re-mesh after geometry changes). Right-click a cell and select Update for the same action. This is the most frequently used shortcut in FEA workflows.'
  },
];

export default function AnsysShortcutsClient() {
  return (
    <ShortcutCheatsheetClient
      title="ANSYS Mechanical"
      subtitle="Searchable reference for ANSYS Mechanical hotkeys covering model navigation, geometry, mesh, boundary conditions, and post-processing."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
