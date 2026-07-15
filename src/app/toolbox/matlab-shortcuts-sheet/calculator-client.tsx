'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'editor', name: '📝 Editor' },
  { id: 'cmd', name: '💻 Command Window' },
  { id: 'nav', name: '🔍 Navigation' },
  { id: 'debug', name: '🐛 Debugging' },
  { id: 'system', name: '⚙️ System' },
];

const SHORTCUTS = [
  // Editor
  { keys: 'Ctrl + S', command: 'Save File', category: 'editor', description: 'Save the current file in the editor.' },
  { keys: 'Ctrl + Z', command: 'Undo', category: 'editor', description: 'Undo the last edit.' },
  { keys: 'Ctrl + Y', command: 'Redo', category: 'editor', description: 'Redo the last undone edit.' },
  { keys: 'Ctrl + C', command: 'Copy', category: 'editor', description: 'Copy selected text.' },
  { keys: 'Ctrl + V', command: 'Paste', category: 'editor', description: 'Paste copied text.' },
  { keys: 'Ctrl + X', command: 'Cut', category: 'editor', description: 'Cut selected text.' },
  { keys: 'Ctrl + A', command: 'Select All', category: 'editor', description: 'Select all text in the editor.' },
  { keys: 'Ctrl + F', command: 'Find', category: 'editor', description: 'Open the find/replace dialog.' },
  { keys: 'Ctrl + G', command: 'Go to Line', category: 'editor', description: 'Jump to a specific line number.' },
  { keys: 'Ctrl + R', command: 'Comment', category: 'editor', description: 'Comment the selected lines.' },
  { keys: 'Ctrl + T', command: 'Uncomment', category: 'editor', description: 'Uncomment the selected lines.' },
  { keys: 'Ctrl + I', command: 'Smart Indent', category: 'editor', description: 'Auto-indent the selected code block.' },
  { keys: 'Ctrl + D', command: 'Open Function', category: 'editor', description: 'Open the highlighted function or script file.' },
  { keys: 'Ctrl + W', command: 'Close File', category: 'editor', description: 'Close the current editor tab.' },
  { keys: 'Ctrl + O', command: 'Open File', category: 'editor', description: 'Open a file in the editor.' },
  { keys: 'Ctrl + Shift + M', command: 'New Live Script', category: 'editor', description: 'Create a new Live Script.' },
  { keys: 'Tab', command: 'Auto-complete', category: 'editor', description: 'Auto-complete function or variable name.' },

  // Command Window
  { keys: 'Enter', command: 'Execute Line', category: 'cmd', description: 'Execute the current command line.' },
  { keys: 'Shift + Enter', command: 'New Line Without Execution', category: 'cmd', description: 'Move to next line without executing.' },
  { keys: 'Esc', command: 'Clear Line', category: 'cmd', description: 'Delete the current command line content.' },
  { keys: 'Ctrl + C', command: 'Interrupt', category: 'cmd', description: 'Interrupt a running MATLAB computation.' },
  { keys: 'Up Arrow', command: 'Previous Command', category: 'cmd', description: 'Recall the previous command from history.' },
  { keys: 'Down Arrow', command: 'Next Command', category: 'cmd', description: 'Recall the next command from history.' },
  { keys: 'Ctrl + K', command: 'Delete to End', category: 'cmd', description: 'Delete from cursor to end of line.' },
  { keys: 'Home', command: 'Line Start', category: 'cmd', description: 'Move cursor to beginning of line.' },
  { keys: 'End', command: 'Line End', category: 'cmd', description: 'Move cursor to end of line.' },
  { keys: 'Ctrl + Up', command: 'Previous Word', category: 'cmd', description: 'Move cursor to previous word.' },
  { keys: 'Ctrl + Down', command: 'Next Word', category: 'cmd', description: 'Move cursor to next word.' },

  // Navigation
  { keys: 'Ctrl + 0', command: 'Command Window', category: 'nav', description: 'Move focus to the Command Window.' },
  { keys: 'Ctrl + 1', command: 'Command History', category: 'nav', description: 'Move focus to the Command History panel.' },
  { keys: 'Ctrl + 2', command: 'Files Panel', category: 'nav', description: 'Move focus to the Current Folder panel.' },
  { keys: 'Ctrl + 3', command: 'Workspace Panel', category: 'nav', description: 'Move focus to the Workspace panel.' },
  { keys: 'Ctrl + Shift + 0', command: 'Editor', category: 'nav', description: 'Move focus to the Editor.' },
  { keys: 'Ctrl + Shift + 1', command: 'Figures', category: 'nav', description: 'Move focus to Figures.' },
  { keys: 'Ctrl + Shift + 3', command: 'Variables Editor', category: 'nav', description: 'Move focus to the Variables editor.' },
  { keys: 'Ctrl + Tab', command: 'Next Tab', category: 'nav', description: 'Switch to the next open document tab.' },
  { keys: 'Ctrl + Shift + Tab', command: 'Previous Tab', category: 'nav', description: 'Switch to the previous open document tab.' },
  { keys: 'Ctrl + F6', command: 'Next Tool', category: 'nav', description: 'Move focus to the next MATLAB tool/panel.' },

  // Debugging
  { keys: 'F5', command: 'Run', category: 'debug', description: 'Run the current script or function.' },
  { keys: 'F9', command: 'Run Selection', category: 'debug', description: 'Run the highlighted code only.' },
  { keys: 'F10', command: 'Step', category: 'debug', description: 'Step to the next line (does not enter functions).' },
  { keys: 'F11', command: 'Step In', category: 'debug', description: 'Step into the current function call.' },
  { keys: 'Shift + F11', command: 'Step Out', category: 'debug', description: 'Step out of the current function.' },
  { keys: 'F12', command: 'Toggle Breakpoint', category: 'debug', description: 'Set or remove a breakpoint at the cursor line.' },
  { keys: 'Shift + F5', command: 'Stop Debug', category: 'debug', description: 'Exit debug mode and stop execution.' },

  // System
  { keys: 'Ctrl + N', command: 'New Script', category: 'system', description: 'Create a new script file.' },
  { keys: 'Ctrl + Shift + S', command: 'Settings', category: 'system', description: 'Open the MATLAB Settings window.' },
  { keys: 'Ctrl + Shift + Space', command: 'Shortcuts List', category: 'system', description: 'Display a compact list of all keyboard shortcuts.' },
  { keys: 'Alt + `', command: 'Access Keys', category: 'system', description: 'Show access keys for the current toolstrip tab.' },
  { keys: 'Shift + F10', command: 'Context Menu', category: 'system', description: 'Open the context menu (right-click equivalent).' },
];

const TIPS = [
  {
    title: 'Print a full list of your current shortcuts',
    content: 'Go to Home tab > Settings > MATLAB > Keyboard > Shortcuts, click the settings button, and select Copy to clipboard. Paste into Excel for a printable list of all your current keyboard shortcuts — useful for onboarding new team members.'
  },
  {
    title: 'Up arrow recalls command history',
    content: 'In the Command Window, press Up Arrow to scroll through previous commands. Type a few characters first, then press Up Arrow to filter by prefix — e.g., type "plot" then Up to find all previous plot commands. This is one of the fastest ways to re-run commands.'
  },
];

export default function MatlabShortcutsClient() {
  return (
    <ShortcutCheatsheetClient
      title="MATLAB"
      subtitle="Searchable reference for MATLAB keyboard shortcuts covering the editor, command window, navigation, debugging, and code execution."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
