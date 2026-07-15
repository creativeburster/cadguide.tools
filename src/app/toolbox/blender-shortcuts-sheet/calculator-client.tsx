'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'general', name: '⚙️ General' },
  { id: 'object', name: '📦 Object Mode' },
  { id: 'edit', name: '✏️ Edit Mode' },
  { id: 'view', name: '👁️ Viewport' },
  { id: 'render', name: '🎬 Render' },
];

const SHORTCUTS = [
  // General
  { keys: 'Ctrl + Z', command: 'Undo', category: 'general', description: 'Undo the last action.' },
  { keys: 'Shift + Ctrl + Z', command: 'Redo', category: 'general', description: 'Redo the last undone action.' },
  { keys: 'Ctrl + S', command: 'Save', category: 'general', description: 'Save the current blend file.' },
  { keys: 'Ctrl + O', command: 'Open', category: 'general', description: 'Open a blend file.' },
  { keys: 'Ctrl + N', command: 'New', category: 'general', description: 'Create a new scene.' },
  { keys: 'F2', command: 'Rename', category: 'general', description: 'Rename the selected object.' },
  { keys: 'F3', command: 'Search', category: 'general', description: 'Open the command search menu.' },
  { keys: 'Q', command: 'Quick Favorites', category: 'general', description: 'Open the Quick Favorites menu.' },
  { keys: 'N', command: 'Toggle Sidebar', category: 'general', description: 'Toggle the right-side properties panel.' },
  { keys: 'T', command: 'Toggle Toolbar', category: 'general', description: 'Toggle the left-side toolbar.' },

  // Object Mode
  { keys: 'G', command: 'Grab/Move', category: 'object', description: 'Move selected objects. Press G twice for edge slide in edit mode.' },
  { keys: 'R', command: 'Rotate', category: 'object', description: 'Rotate selected objects.' },
  { keys: 'S', command: 'Scale', category: 'object', description: 'Scale selected objects.' },
  { keys: 'Shift + D', command: 'Duplicate', category: 'object', description: 'Duplicate selected objects and move.' },
  { keys: 'Alt + D', command: 'Linked Duplicate', category: 'object', description: 'Create a linked duplicate (shares mesh data).' },
  { keys: 'X / Delete', command: 'Delete', category: 'object', description: 'Delete selected objects.' },
  { keys: 'Ctrl + J', command: 'Join', category: 'object', description: 'Join selected objects into one.' },
  { keys: 'Ctrl + P', command: 'Set Parent', category: 'object', description: 'Set parent relationship.' },
  { keys: 'Alt + P', command: 'Clear Parent', category: 'object', description: 'Clear parent relationship.' },
  { keys: 'M', command: 'Move to Collection', category: 'object', description: 'Move selected objects to a collection.' },
  { keys: 'Ctrl + 1', command: 'Subdivision Level 1', category: 'object', description: 'Add subdivision surface modifier (Ctrl+2 for level 2, etc.).' },
  { keys: 'A', command: 'Select All', category: 'object', description: 'Select all objects. Double-tap A to deselect all.' },
  { keys: 'B', command: 'Box Select', category: 'object', description: 'Drag a box to select objects.' },
  { keys: 'C', command: 'Circle Select', category: 'object', description: 'Brush select by clicking and dragging.' },
  { keys: 'I', command: 'Insert Keyframe', category: 'object', description: 'Insert a keyframe for the active object.' },

  // Edit Mode
  { keys: 'Tab', command: 'Toggle Edit Mode', category: 'edit', description: 'Switch between Object and Edit mode.' },
  { keys: '1', command: 'Vertex Select', category: 'edit', description: 'Switch to vertex selection mode.' },
  { keys: '2', command: 'Edge Select', category: 'edit', description: 'Switch to edge selection mode.' },
  { keys: '3', command: 'Face Select', category: 'edit', description: 'Switch to face selection mode.' },
  { keys: 'E', command: 'Extrude', category: 'edit', description: 'Extrude selected vertices, edges, or faces.' },
  { keys: 'F', command: 'Make Face/Edge', category: 'edit', description: 'Create a face from selected vertices/edges.' },
  { keys: 'I', command: 'Inset', category: 'edit', description: 'Inset selected faces inward.' },
  { keys: 'Ctrl + B', command: 'Bevel', category: 'edit', description: 'Bevel selected edges or vertices.' },
  { keys: 'Ctrl + R', command: 'Loop Cut', category: 'edit', description: 'Add a loop cut across faces.' },
  { keys: 'K', command: 'Knife Tool', category: 'edit', description: 'Cut new edges interactively.' },
  { keys: 'M', command: 'Merge', category: 'edit', description: 'Merge selected vertices (at center, at cursor, etc.).' },
  { keys: 'P', command: 'Separate', category: 'edit', description: 'Separate selected geometry into a new object.' },
  { keys: 'V', command: 'Rip', category: 'edit', description: 'Rip selected vertices apart.' },
  { keys: 'L', command: 'Select Linked', category: 'edit', description: 'Select all linked geometry under cursor.' },
  { keys: 'Ctrl + L', command: 'Select Linked All', category: 'edit', description: 'Select all linked geometry of selection.' },
  { keys: 'H', command: 'Hide', category: 'edit', description: 'Hide selected geometry.' },
  { keys: 'Alt + H', command: 'Unhide', category: 'edit', description: 'Reveal all hidden geometry.' },
  { keys: 'O', command: 'Proportional Editing', category: 'edit', description: 'Toggle proportional editing on/off.' },

  // Viewport
  { keys: 'Middle Mouse', command: 'Orbit', category: 'view', description: 'Drag to orbit the 3D viewport.' },
  { keys: 'Shift + Middle Mouse', command: 'Pan', category: 'view', description: 'Drag to pan the 3D viewport.' },
  { keys: 'Scroll Wheel', command: 'Zoom', category: 'view', description: 'Scroll to zoom in/out.' },
  { keys: '0', command: 'Camera View', category: 'view', description: 'Toggle the active camera view.' },
  { keys: '1', command: 'Front View', category: 'view', description: 'Switch to front view (Ctrl+1 for back).' },
  { keys: '3', command: 'Right View', category: 'view', description: 'Switch to right view (Ctrl+3 for left).' },
  { keys: '7', command: 'Top View', category: 'view', description: 'Switch to top view (Ctrl+7 for bottom).' },
  { keys: '5', command: 'Perspective/Ortho', category: 'view', description: 'Toggle between perspective and orthographic.' },
  { keys: 'Z', command: 'Shading Pie Menu', category: 'view', description: 'Open the shading mode pie menu.' },
  { keys: '.', command: 'Frame Selected', category: 'view', description: 'Zoom to frame the selected object(s).' },
  { keys: 'Home', command: 'Frame All', category: 'view', description: 'Zoom to fit all objects in view.' },
  { keys: '/', command: 'Local View', category: 'view', description: 'Toggle isolate view of selected object.' },
  { keys: 'F11', command: 'View Render', category: 'view', description: 'View the last rendered image.' },

  // Render
  { keys: 'F12', command: 'Render Image', category: 'render', description: 'Render the current frame as an image.' },
  { keys: 'Ctrl + F12', command: 'Render Animation', category: 'render', description: 'Render the full animation.' },
  { keys: 'Ctrl + F11', command: 'View Animation', category: 'render', description: 'Play the rendered animation.' },
];

const TIPS = [
  {
    title: 'Hotkeys change with mode',
    content: 'Blender hotkeys are context-sensitive. The same key does different things in Object vs Edit mode. For example, M moves to collection in Object mode but merges vertices in Edit mode. Always check your mode indicator at the bottom of the viewport.'
  },
  {
    title: 'Pie menus speed up navigation',
    content: 'Press Z for the shading pie menu, . for view alignment, and Shift+S for snap pie menus. Pie menus allow you to select an option by moving the mouse in a direction — much faster than clicking through menus.'
  },
];

export default function BlenderShortcutsClient() {
  return (
    <ShortcutCheatsheetClient
      title="Blender"
      subtitle="Complete reference for Blender hotkeys covering 3D viewport navigation, edit mode, object mode, modeling, and rendering."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
