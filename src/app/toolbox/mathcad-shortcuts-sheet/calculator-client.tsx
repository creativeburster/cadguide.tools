'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'math', name: '🔢 Math Entry' },
  { id: 'edit', name: '📝 Editing' },
  { id: 'plot', name: '📊 Plotting' },
  { id: 'system', name: '⚙️ Worksheet' },
];

const SHORTCUTS = [
  // Math Entry
  { keys: ':', command: 'Definition', category: 'math', description: 'Define a variable or function (:=).' },
  { keys: '=', command: 'Evaluation', category: 'math', description: 'Evaluate and display the result of an expression.' },
  { keys: 'Ctrl + =', command: 'Boolean Equal', category: 'math', description: 'Insert a Boolean equality operator (= with bold).' },
  { keys: 'Ctrl + Shift + .', command: 'Global Definition', category: 'math', description: 'Define a variable globally (≡).' },
  { keys: 'Ctrl + L', command: 'Literal Subscript', category: 'math', description: 'Add a literal subscript to a variable name.' },
  { keys: '[', command: 'Subscript', category: 'math', description: 'Add a matrix/vector subscript.' },
  { keys: 'Ctrl + Shift + ^', command: 'Superscript', category: 'math', description: 'Add a superscript (exponent).' },
  { keys: 'Ctrl + /', command: 'Division', category: 'math', description: 'Insert a division bar (fraction).' },
  { keys: 'Ctrl + *', command: 'Square Root', category: 'math', description: 'Insert a square root symbol.' },
  { keys: 'Ctrl + Shift + 1', command: 'Nth Root', category: 'math', description: 'Insert an nth root operator.' },
  { keys: 'Ctrl + Shift + 4', command: 'Summation', category: 'math', description: 'Insert a summation operator.' },
  { keys: 'Ctrl + Shift + 3', command: 'Product', category: 'math', description: 'Insert a product operator.' },
  { keys: 'Ctrl + Shift + 5', command: 'Derivative', category: 'math', description: 'Insert a derivative operator.' },
  { keys: 'Ctrl + .', command: 'Symbolic Evaluation', category: 'math', description: 'Evaluate an expression symbolically (→).' },
  { keys: 'Ctrl + Shift + .', command: 'Symbolic with Modifier', category: 'math', description: 'Evaluate symbolically with keyword modifiers.' },

  // Editing
  { keys: 'Ctrl + Z', command: 'Undo', category: 'edit', description: 'Undo the last action.' },
  { keys: 'Ctrl + Y', command: 'Redo', category: 'edit', description: 'Redo the last undone action.' },
  { keys: 'Ctrl + C', command: 'Copy', category: 'edit', description: 'Copy the selected region.' },
  { keys: 'Ctrl + V', command: 'Paste', category: 'edit', description: 'Paste the copied region.' },
  { keys: 'Ctrl + X', command: 'Cut', category: 'edit', description: 'Cut the selected region.' },
  { keys: 'Ctrl + A', command: 'Select All', category: 'edit', description: 'Select all regions in the worksheet.' },
  { keys: 'Ctrl + G', command: 'Greek Letter', category: 'edit', description: 'Convert the preceding letter to its Greek equivalent.' },
  { keys: 'Ctrl + Shift + P', command: 'Pi Constant', category: 'edit', description: 'Insert the constant π.' },
  { keys: 'Ctrl + M', command: 'Matrix', category: 'edit', description: 'Insert a matrix or vector template.' },
  { keys: 'Ctrl + Shift + M', command: 'Matrix with Placeholder', category: 'edit', description: 'Insert a matrix with size dialog.' },
  { keys: 'Space', command: 'Expand Selection', category: 'edit', description: 'Expand the selection to include the next operator.' },
  { keys: 'Shift + Space', command: 'Shrink Selection', category: 'edit', description: 'Shrink the selection by one operator level.' },
  { keys: 'Ctrl + Enter', command: 'Line Break', category: 'edit', description: 'Insert a line break within a math region.' },
  { keys: 'Delete', command: 'Delete Region', category: 'edit', description: 'Delete the selected region.' },

  // Plotting
  { keys: 'Ctrl + Shift + 2', command: 'XY Plot', category: 'plot', description: 'Insert an XY (2D) plot region.' },
  { keys: 'Ctrl + Shift + 6', command: 'Contour Plot', category: 'plot', description: 'Insert a contour plot region.' },
  { keys: 'Ctrl + Shift + 7', command: '3D Plot', category: 'plot', description: 'Insert a 3D plot region.' },
  { keys: 'Ctrl + Shift + 8', command: 'Surface Plot', category: 'plot', description: 'Insert a surface plot region.' },

  // Worksheet Management
  { keys: 'Ctrl + S', command: 'Save', category: 'system', description: 'Save the current worksheet.' },
  { keys: 'Ctrl + O', command: 'Open', category: 'system', description: 'Open an existing worksheet.' },
  { keys: 'Ctrl + N', command: 'New', category: 'system', description: 'Create a new worksheet.' },
  { keys: 'Ctrl + P', command: 'Print', category: 'system', description: 'Open the print dialog.' },
  { keys: 'Ctrl + Shift + N', command: 'New Math Region', category: 'system', description: 'Insert a new math region at cursor.' },
  { keys: 'Ctrl + Shift + T', command: 'Text Region', category: 'system', description: 'Insert a text region for annotations.' },
  { keys: 'Ctrl + Shift + H', command: 'Header/Footer', category: 'system', description: 'Open the header and footer settings.' },
  { keys: 'F1', command: 'Help', category: 'system', description: 'Open PTC Mathcad help.' },
  { keys: 'Ctrl + F', command: 'Find', category: 'system', description: 'Open the find and replace dialog.' },
];

const TIPS = [
  {
    title: 'Use Ctrl+G for Greek letters instantly',
    content: 'Type any Latin letter and press Ctrl+G to convert it to its Greek equivalent. For example, type "a" then Ctrl+G to get α, or "w" then Ctrl+G to get ω. This is the fastest way to enter Greek variables in engineering calculations.'
  },
  {
    title: 'Space bar expands math selection intelligently',
    content: 'In Mathcad, the Space bar expands the current selection to include the next operator in the expression. This is essential for editing complex formulas — press Space repeatedly until the desired part of the expression is selected, then apply operations.'
  },
];

export default function MathcadShortcutsClient() {
  return (
    <ShortcutCheatsheetClient
      title="PTC Mathcad"
      subtitle="Searchable reference for PTC Mathcad Prime keyboard shortcuts covering math entry, editing, plotting, and worksheet management."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
