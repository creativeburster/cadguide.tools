'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'general', name: '⚙️ General' },
  { id: 'sketch', name: '✏️ Sketch' },
  { id: 'part', name: '🔧 Part Studio' },
  { id: 'assembly', name: '🔗 Assembly' },
  { id: 'view', name: '👁️ 3D View' },
  { id: 'drawing', name: '📐 Drawing' },
];

const SHORTCUTS = [
  // General
  { keys: 'Shift + ?', command: 'Keyboard Shortcuts List', category: 'general', description: 'Toggle the keyboard shortcuts list open/closed.' },
  { keys: 'Ctrl + Z', command: 'Undo', category: 'general', description: 'Undo the last action.' },
  { keys: 'Ctrl + Y', command: 'Redo', category: 'general', description: 'Redo the last undone action.' },
  { keys: 'Delete', command: 'Delete Selection', category: 'general', description: 'Delete the selected object.' },
  { keys: 'Space', command: 'Clear Selection', category: 'general', description: 'Clear the current selection.' },
  { keys: 'Esc', command: 'Cancel Command', category: 'general', description: 'Cancel the active command.' },
  { keys: 'Enter', command: 'Accept Command', category: 'general', description: 'Accept and complete the current command.' },
  { keys: 'Shift + Enter', command: 'Accept and Repeat', category: 'general', description: 'Accept the command and immediately repeat it.' },
  { keys: 'S', command: 'Shortcut Toolbars', category: 'general', description: 'Open the shortcut toolbar at cursor position.' },
  { keys: 'Shift + N', command: 'Rename Selection', category: 'general', description: 'Rename the selected feature, part, or sketch.' },

  // Sketch
  { keys: 'L', command: 'Line', category: 'sketch', description: 'Draw a line in the active sketch.' },
  { keys: 'G', command: 'Corner Rectangle', category: 'sketch', description: 'Draw a corner rectangle.' },
  { keys: 'R', command: 'Center Point Rectangle', category: 'sketch', description: 'Draw a rectangle from center point.' },
  { keys: 'C', command: 'Center Point Circle', category: 'sketch', description: 'Draw a circle from center point.' },
  { keys: 'A', command: '3-Point Arc', category: 'sketch', description: 'Draw an arc using three points.' },
  { keys: 'Shift + F', command: 'Fillet', category: 'sketch', description: 'Create a fillet on sketch corners.' },
  { keys: 'M', command: 'Trim', category: 'sketch', description: 'Trim sketch entities.' },
  { keys: 'X', command: 'Extend', category: 'sketch', description: 'Extend sketch entities.' },
  { keys: 'O', command: 'Offset', category: 'sketch', description: 'Offset sketch entities.' },
  { keys: 'U', command: 'Use/Convert', category: 'sketch', description: 'Use or convert existing edges into the sketch.' },
  { keys: 'D', command: 'Dimension', category: 'sketch', description: 'Add a dimension to sketch entities.' },
  { keys: 'I', command: 'Coincident', category: 'sketch', description: 'Apply a coincident constraint.' },
  { keys: 'B', command: 'Parallel', category: 'sketch', description: 'Apply a parallel constraint.' },
  { keys: 'T', command: 'Tangent', category: 'sketch', description: 'Apply a tangent constraint.' },
  { keys: 'H', command: 'Horizontal', category: 'sketch', description: 'Apply a horizontal constraint.' },
  { keys: 'V', command: 'Vertical', category: 'sketch', description: 'Apply a vertical constraint.' },
  { keys: 'E', command: 'Equal', category: 'sketch', description: 'Apply an equal-length constraint.' },
  { keys: 'Q', command: 'Toggle Construction', category: 'sketch', description: 'Toggle selected entity between construction and real geometry.' },

  // Part Studio
  { keys: 'Shift + S', command: 'Sketch', category: 'part', description: 'Start a new sketch on a selected plane or face.' },
  { keys: 'Shift + E', command: 'Extrude', category: 'part', description: 'Extrude a sketch profile or face.' },
  { keys: 'Shift + F', command: 'Fillet', category: 'part', description: 'Create a fillet on selected edges.' },
  { keys: 'Ctrl + M', command: 'Mate Connector', category: 'part', description: 'Create a mate connector.' },

  // Assembly
  { keys: 'Ctrl + C', command: 'Copy', category: 'assembly', description: 'Copy selected part or sub-assembly.' },
  { keys: 'Ctrl + V', command: 'Paste', category: 'assembly', description: 'Paste copied part or sub-assembly.' },
  { keys: 'M', command: 'Mate', category: 'assembly', description: 'Create a mate between components.' },
  { keys: 'Ctrl + M', command: 'Mate Connector', category: 'assembly', description: 'Create a mate connector.' },
  { keys: 'I', command: 'Insert', category: 'assembly', description: 'Open the Insert dialog to add parts.' },
  { keys: 'J', command: 'Hide/Show Mates', category: 'assembly', description: 'Toggle visibility of mate connectors.' },
  { keys: 'K', command: 'Hide/Show Mate Connectors', category: 'assembly', description: 'Toggle visibility of mate connectors.' },

  // 3D View
  { keys: 'Shift + 1', command: 'Front View', category: 'view', description: 'Switch to front view.' },
  { keys: 'Shift + 2', command: 'Back View', category: 'view', description: 'Switch to back view.' },
  { keys: 'Shift + 3', command: 'Left View', category: 'view', description: 'Switch to left view.' },
  { keys: 'Shift + 4', command: 'Right View', category: 'view', description: 'Switch to right view.' },
  { keys: 'Shift + 5', command: 'Top View', category: 'view', description: 'Switch to top view.' },
  { keys: 'Shift + 6', command: 'Bottom View', category: 'view', description: 'Switch to bottom view.' },
  { keys: 'Shift + 7', command: 'Isometric View', category: 'view', description: 'Switch to isometric view.' },
  { keys: 'Shift + I', command: 'View Normal To', category: 'view', description: 'Align view normal to selected plane or face.' },
  { keys: 'Shift + Z', command: 'Zoom In', category: 'view', description: 'Zoom in (Z alone zooms out).' },
  { keys: 'F', command: 'Zoom to Fit', category: 'view', description: 'Zoom to fit all geometry in view.' },
  { keys: 'W', command: 'Zoom to Window', category: 'view', description: 'Zoom to a window selection area.' },

  // Drawing
  { keys: 'P', command: 'Projected View', category: 'drawing', description: 'Create a projected drawing view.' },
  { keys: 'D', command: 'Linear Dimension', category: 'drawing', description: 'Add a linear dimension.' },
  { keys: 'Shift + R', command: 'Radial Dimension', category: 'drawing', description: 'Add a radial dimension.' },
  { keys: 'Shift + D', command: 'Diameter Dimension', category: 'drawing', description: 'Add a diameter dimension.' },
  { keys: 'N', command: 'Note', category: 'drawing', description: 'Add a text note to the drawing.' },
  { keys: 'Ctrl + Q', command: 'Update Drawing', category: 'drawing', description: 'Update the drawing to reflect model changes.' },
];

const TIPS = [
  {
    title: 'Press Shift+? to see all shortcuts in-app',
    content: 'Onshape has a built-in keyboard shortcut overlay. Press Shift+? at any time to see context-sensitive shortcuts for your current environment (Part Studio, Assembly, Drawing, etc.).'
  },
  {
    title: 'Sketch shortcuts are single-key for speed',
    content: 'In sketch mode, single keys map to tools: L for Line, C for Circle, D for Dimension, etc. Constraint shortcuts are also single-key: T for Tangent, I for Coincident, H for Horizontal. This makes sketching extremely fast once memorized.'
  },
];

export default function OnshapeShortcutsClient() {
  return (
    <ShortcutCheatsheetClient
      title="Onshape"
      subtitle="Searchable reference for Onshape keyboard shortcuts covering Part Studio, assembly, sketch, drawing, and 3D view navigation."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
