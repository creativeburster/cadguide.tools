'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'general', name: '⚙️ General' },
  { id: 'viewport', name: '👁️ Viewport' },
  { id: 'select', name: '🖱️ Selection' },
  { id: 'model', name: '📐 Modeling' },
  { id: 'animate', name: '🎬 Animation' },
  { id: 'render', name: '🖼️ Render' },
];

const SHORTCUTS = [
  // General
  { keys: 'Ctrl + N', command: 'New Scene', category: 'general', description: 'Create a new scene.' },
  { keys: 'Ctrl + O', command: 'Open File', category: 'general', description: 'Open an existing file.' },
  { keys: 'Ctrl + S', command: 'Save File', category: 'general', description: 'Save the current file.' },
  { keys: 'Ctrl + Z', command: 'Undo Scene', category: 'general', description: 'Undo the last scene operation.' },
  { keys: 'Ctrl + Y', command: 'Redo Scene', category: 'general', description: 'Redo the last undone scene operation.' },
  { keys: 'Ctrl + V', command: 'Clone', category: 'general', description: 'Clone selected objects (copy, instance, or reference).' },
  { keys: 'Ctrl + X', command: 'Expert Mode', category: 'general', description: 'Toggle expert mode (hides all UI panels).' },
  { keys: 'X', command: 'Search All Actions', category: 'general', description: 'Open the search dialog for all actions.' },
  { keys: 'F1', command: 'Help', category: 'general', description: 'Open 3ds Max help.' },
  { keys: 'F12', command: 'Transform Type-In', category: 'general', description: 'Open the transform type-in dialog for precise values.' },
  { keys: 'Spacebar', command: 'Selection Lock', category: 'general', description: 'Toggle selection lock.' },
  { keys: 'M', command: 'Material Editor', category: 'general', description: 'Toggle the Material Editor (SME or compact).' },
  { keys: 'H', command: 'Select by Name', category: 'general', description: 'Open the Select by Name dialog.' },
  { keys: '8', command: 'Environment Dialog', category: 'general', description: 'Toggle the Environment and Effects dialog.' },

  // Viewport
  { keys: 'Alt + W', command: 'Maximize Viewport', category: 'viewport', description: 'Toggle maximize viewport.' },
  { keys: 'T', command: 'Top View', category: 'viewport', description: 'Switch to top viewport.' },
  { keys: 'B', command: 'Bottom View', category: 'viewport', description: 'Switch to bottom viewport.' },
  { keys: 'F', command: 'Front View', category: 'viewport', description: 'Switch to front viewport.' },
  { keys: 'L', command: 'Left View', category: 'viewport', description: 'Switch to left viewport.' },
  { keys: 'P', command: 'Perspective View', category: 'viewport', description: 'Switch to perspective (user) viewport.' },
  { keys: 'C', command: 'Camera View', category: 'viewport', description: 'Switch to camera viewport.' },
  { keys: 'U', command: 'Isometric User View', category: 'viewport', description: 'Switch to isometric user view.' },
  { keys: 'Ctrl + R', command: 'Arc Rotate', category: 'viewport', description: 'Enter arc rotate view mode.' },
  { keys: 'Ctrl + P', command: 'Pan View', category: 'viewport', description: 'Pan the viewport.' },
  { keys: 'Alt + X', command: 'See-Through Toggle', category: 'viewport', description: 'Toggle see-through (x-ray) display.' },
  { keys: 'G', command: 'Hide Grids', category: 'viewport', description: 'Toggle grid display.' },
  { keys: 'F3', command: 'Wireframe/Smooth Toggle', category: 'viewport', description: 'Toggle between wireframe and smooth+highlights.' },
  { keys: 'F4', command: 'Edged Faces Toggle', category: 'viewport', description: 'Toggle edged faces display in shaded mode.' },
  { keys: 'D', command: 'Disable Viewport', category: 'viewport', description: 'Disable the active viewport (skip rendering).' },
  { keys: '7', command: 'Viewport Statistics', category: 'viewport', description: 'Toggle viewport statistics (polygon count, FPS).' },

  // Selection
  { keys: 'Ctrl + A', command: 'Select All', category: 'select', description: 'Select all objects.' },
  { keys: 'Ctrl + D', command: 'Select None', category: 'select', description: 'Deselect all objects.' },
  { keys: 'Ctrl + I', command: 'Select Invert', category: 'select', description: 'Invert the current selection.' },
  { keys: 'W', command: 'Select and Move', category: 'select', description: 'Activate the move transform tool.' },
  { keys: 'E', command: 'Select and Rotate', category: 'select', description: 'Activate the rotate transform tool.' },
  { keys: 'R', command: 'Select and Scale', category: 'select', description: 'Activate the scale transform tool.' },
  { keys: 'Alt + A', command: 'Align', category: 'select', description: 'Open the align dialog for selected objects.' },
  { keys: 'Shift + A', command: 'Quick Align', category: 'select', description: 'Quick align selected objects to target.' },
  { keys: 'S', command: 'Snaps Toggle', category: 'select', description: 'Toggle snapping on/off.' },
  { keys: 'A', command: 'Angle Snap', category: 'select', description: 'Toggle angle snap.' },

  // Modeling (Editable Poly)
  { keys: '1', command: 'Vertex Level', category: 'model', description: 'Go to vertex sub-object level.' },
  { keys: '2', command: 'Edge Level', category: 'model', description: 'Go to edge sub-object level.' },
  { keys: '3', command: 'Border Level', category: 'model', description: 'Go to border sub-object level.' },
  { keys: '4', command: 'Polygon Level', category: 'model', description: 'Go to polygon sub-object level.' },
  { keys: '5', command: 'Element Level', category: 'model', description: 'Go to element sub-object level.' },
  { keys: '6', command: 'Object Level', category: 'model', description: 'Exit sub-object level to object level.' },
  { keys: 'Insert', command: 'Cycle Sub-Object', category: 'model', description: 'Cycle through sub-object levels.' },
  { keys: 'Ctrl + B', command: 'Sub-Object Toggle', category: 'model', description: 'Toggle sub-object selection mode.' },
  { keys: 'F2', command: 'Shade Selected Faces', category: 'model', description: 'Toggle shading of selected faces.' },
  { keys: 'F8', command: 'Restrict Plane Cycle', category: 'model', description: 'Cycle through transform plane restrictions.' },

  // Animation
  { keys: 'N', command: 'Auto Key', category: 'animate', description: 'Toggle auto key animation mode.' },
  { keys: "'", command: 'Set Key Mode', category: 'animate', description: 'Toggle set key mode.' },
  { keys: 'K', command: 'Set Keys', category: 'animate', description: 'Set keyframes for selected objects.' },
  { keys: '/', command: 'Play Animation', category: 'animate', description: 'Play/pause animation playback.' },
  { keys: ',', command: 'Backup Time One Unit', category: 'animate', description: 'Move one frame backward.' },
  { keys: '.', command: 'Forward Time One Unit', category: 'animate', description: 'Move one frame forward.' },
  { keys: 'Home', command: 'Go to Start Frame', category: 'animate', description: 'Jump to the first frame.' },
  { keys: 'End', command: 'Go to End Frame', category: 'animate', description: 'Jump to the last frame.' },

  // Render
  { keys: 'F9', command: 'Render Last', category: 'render', description: 'Render using the last used settings.' },
  { keys: 'F10', command: 'Render Scene Dialog', category: 'render', description: 'Open the render scene dialog.' },
  { keys: 'Shift + Q', command: 'Quick Render', category: 'render', description: 'Quick render the current viewport.' },
  { keys: 'Shift + F', command: 'Show Safeframes', category: 'render', description: 'Toggle safeframes display in viewport.' },
  { keys: '0', command: 'Render to Texture', category: 'render', description: 'Open the Render to Texture dialog.' },
  { keys: 'Ctrl + L', command: 'Default Lighting', category: 'render', description: 'Toggle default lighting in viewport.' },
];

const TIPS = [
  {
    title: 'Keyboard Shortcut Override Toggle',
    content: '3ds Max has context-sensitive shortcut groups (Main UI, Editable Poly, UVW Unwrap, etc.) that can conflict. Use the Keyboard Shortcut Override Toggle button on the Main Toolbar to switch between main UI only and context-sensitive overrides.'
  },
  {
    title: 'Customize hotkeys via the Hotkey Editor',
    content: 'Go to Customize > Customize User Interface > Keyboard to assign or reassign any hotkey. You can save and load keyboard shortcut sets as .kbdx files for different workflows or to share with your team.'
  },
];

export default function MaxShortcutsClient() {
  return (
    <ShortcutCheatsheetClient
      title="3ds Max"
      subtitle="Complete reference for Autodesk 3ds Max hotkeys covering viewport navigation, selection, modeling, animation, and rendering workflows."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
