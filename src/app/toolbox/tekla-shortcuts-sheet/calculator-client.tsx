'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'common', name: '⚙️ Common' },
  { id: 'render', name: '🎨 Rendering' },
  { id: 'select', name: '🖱️ Selecting' },
  { id: 'view', name: '👁️ Viewing' },
  { id: 'drawings', name: '📐 Drawings' },
];

const SHORTCUTS = [
  // Common
  { keys: 'F1', command: 'Help', category: 'common', description: 'Open Tekla Structures help.' },
  { keys: 'Ctrl + O', command: 'Open Recent Models', category: 'common', description: 'Open the recent models list.' },
  { keys: 'Ctrl + N', command: 'New Model', category: 'common', description: 'Create a new model.' },
  { keys: 'Ctrl + S', command: 'Save Model', category: 'common', description: 'Save the current model.' },
  { keys: 'Ctrl + Z', command: 'Undo', category: 'common', description: 'Undo the last action.' },
  { keys: 'Ctrl + Y', command: 'Redo', category: 'common', description: 'Redo the last undone action.' },
  { keys: 'Esc', command: 'Interrupt', category: 'common', description: 'Interrupt the current command.' },
  { keys: 'Enter', command: 'Repeat Last Command', category: 'common', description: 'Repeat the last used command.' },
  { keys: 'Ctrl + K', command: 'Contextual Toolbar', category: 'common', description: 'Show/hide the contextual toolbar.' },
  { keys: 'D', command: 'Direct Modification', category: 'common', description: 'Switch direct modification on/off.' },
  { keys: 'Ctrl + Q', command: 'Quick Launch', category: 'common', description: 'Open the Quick Launch dialog.' },
  { keys: 'Ctrl + E', command: 'Advanced Options', category: 'common', description: 'Open the Advanced Options dialog.' },
  { keys: 'Ctrl + F', command: 'Applications & Components', category: 'common', description: 'Open the Applications & Components catalog.' },
  { keys: 'Ctrl + Shift + C', command: 'Keyboard Shortcuts Dialog', category: 'common', description: 'Open the keyboard shortcuts customization dialog.' },

  // Rendering
  { keys: 'Ctrl + 1', command: 'Parts Wireframe', category: 'render', description: 'Set parts to wireframe rendering.' },
  { keys: 'Ctrl + 2', command: 'Parts Shaded Wireframe', category: 'render', description: 'Set parts to shaded wireframe.' },
  { keys: 'Ctrl + 3', command: 'Parts Grayscale', category: 'render', description: 'Set parts to grayscale rendering.' },
  { keys: 'Ctrl + 4', command: 'Parts Rendered', category: 'render', description: 'Set parts to rendered (solid) mode.' },
  { keys: 'Ctrl + 5', command: 'Show Only Selected Part', category: 'render', description: 'Show only the selected part.' },
  { keys: 'Shift + 1', command: 'Components Wireframe', category: 'render', description: 'Set components to wireframe.' },
  { keys: 'Shift + 4', command: 'Components Rendered', category: 'render', description: 'Set components to rendered mode.' },

  // Selecting
  { keys: 'H', command: 'Rollover Highlight', category: 'select', description: 'Switch rollover highlight on/off.' },
  { keys: 'Ctrl + A', command: 'Select All', category: 'select', description: 'Select all objects in the model.' },
  { keys: 'Ctrl + G', command: 'Selection Filters', category: 'select', description: 'Open the selection filters dialog.' },
  { keys: 'Alt + P', command: 'Select Previous', category: 'select', description: 'Select previously selected objects.' },
  { keys: 'Shift', command: 'Add to Selection', category: 'select', description: 'Hold Shift to add objects to current selection.' },
  { keys: 'Ctrl', command: 'Toggle Selection', category: 'select', description: 'Hold Ctrl to toggle selection state.' },

  // Viewing
  { keys: 'Ctrl + I', command: 'Model Views', category: 'view', description: 'Open the model views list.' },
  { keys: 'Ctrl + P', command: '3D / Plane View', category: 'view', description: 'Switch between 3D and plane view.' },
  { keys: 'Ctrl + Tab', command: 'Switch Views', category: 'view', description: 'Switch between open views.' },
  { keys: 'Ctrl + U', command: 'Update Window', category: 'view', description: 'Update the current window.' },
  { keys: 'Ctrl + R', command: 'Rotate', category: 'view', description: 'Rotate the model using the mouse.' },
  { keys: 'Shift + Space', command: 'Rotate with Mouse', category: 'view', description: 'Rotate the model interactively.' },
  { keys: 'F11', command: 'Fullscreen', category: 'view', description: 'Toggle fullscreen mode.' },
  { keys: 'Home', command: 'Zoom Original', category: 'view', description: 'Reset zoom to original extent.' },
  { keys: 'End', command: 'Zoom Previous', category: 'view', description: 'Go to previous zoom level.' },

  // Drawings
  { keys: 'Ctrl + L', command: 'Drawing List', category: 'drawings', description: 'Open the drawing list.' },
  { keys: 'Ctrl + O', command: 'Open Drawing', category: 'drawings', description: 'Open the selected drawing.' },
  { keys: 'Shift + P', command: 'Print Drawing', category: 'drawings', description: 'Print the current drawing.' },
  { keys: 'Ctrl + Page Down', command: 'Next Drawing', category: 'drawings', description: 'Open the next drawing.' },
  { keys: 'Ctrl + Page Up', command: 'Previous Drawing', category: 'drawings', description: 'Open the previous drawing.' },
];

const TIPS = [
  {
    title: 'Customize any shortcut via Settings',
    content: 'Go to File > Settings > Keyboard shortcuts to open the customization dialog. You can assign or reassign any keyboard shortcut to commands, macros, or components. Press F1 while the dialog is open for detailed instructions.'
  },
  {
    title: 'Rendering shortcuts speed up large models',
    content: 'When working with large steel structures, use Ctrl+1 (wireframe) for maximum performance during editing, then switch to Ctrl+4 (rendered) for visual verification. The Shift+1–5 shortcuts control component rendering separately.'
  },
];

export default function TeklaShortcutsClient() {
  return (
    <ShortcutCheatsheetClient
      title="Tekla Structures"
      subtitle="Complete reference for Tekla Structures keyboard shortcuts covering common commands, rendering, selecting, snapping, viewing, and drawing workflows."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
