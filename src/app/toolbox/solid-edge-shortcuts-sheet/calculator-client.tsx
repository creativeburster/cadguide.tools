'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "sketch",
    "name": "✏️ Sketching"
  },
  {
    "id": "features",
    "name": "🧊 Features"
  },
  {
    "id": "view",
    "name": "🔍 View"
  },
  {
    "id": "assembly",
    "name": "🔩 Assembly"
  },
  {
    "id": "system",
    "name": "💻 File & System"
  }
];

const SHORTCUTS = [
  {
    "keys": "Ctrl+S",
    "command": "SAVE",
    "category": "system",
    "description": "Save"
  },
  {
    "keys": "Ctrl+Z",
    "command": "UNDO",
    "category": "system",
    "description": "Undo"
  },
  {
    "keys": "Ctrl+Y",
    "command": "REDO",
    "category": "system",
    "description": "Redo"
  },
  {
    "keys": "Ctrl+N",
    "command": "NEW",
    "category": "system",
    "description": "New"
  },
  {
    "keys": "Ctrl+O",
    "command": "OPEN",
    "category": "system",
    "description": "Open"
  },
  {
    "keys": "Ctrl+F4",
    "command": "CLOSE",
    "category": "system",
    "description": "Close"
  },
  {
    "keys": "Alt+F4",
    "command": "EXIT",
    "category": "system",
    "description": "Exit"
  },
  {
    "keys": "Ctrl+F1",
    "command": "SHOW/HIDE COMMAND RIBBON",
    "category": "system",
    "description": "Show/Hide Command Ribbon"
  },
  {
    "keys": "Ctrl+T",
    "command": "TOP VIEW",
    "category": "view",
    "description": "Top View"
  },
  {
    "keys": "Ctrl+B",
    "command": "BOTTOM VIEW",
    "category": "view",
    "description": "Bottom View"
  },
  {
    "keys": "Ctrl+F",
    "command": "FRONT VIEW",
    "category": "view",
    "description": "Front View"
  },
  {
    "keys": "Ctrl+K",
    "command": "BACK VIEW",
    "category": "view",
    "description": "Back View"
  },
  {
    "keys": "Ctrl+R",
    "command": "RIGHT VIEW",
    "category": "view",
    "description": "Right View"
  },
  {
    "keys": "Ctrl+L",
    "command": "LEFT VIEW",
    "category": "view",
    "description": "Left View"
  },
  {
    "keys": "Ctrl+I",
    "command": "ISOMETRIC VIEW",
    "category": "view",
    "description": "Isometric View"
  },
  {
    "keys": "Alt+F5",
    "command": "PREVIOUS VIEW",
    "category": "view",
    "description": "Previous View"
  },
  {
    "keys": "Ctrl+F6",
    "command": "NEXT VIEW",
    "category": "view",
    "description": "Next View"
  },
  {
    "keys": "Ctrl+Up Arrow",
    "command": "ZOOM IN",
    "category": "view",
    "description": "Zoom In"
  },
  {
    "keys": "Ctrl+Down Arrow",
    "command": "ZOOM OUT",
    "category": "view",
    "description": "Zoom Out"
  },
  {
    "keys": "Ctrl+Shift+RMB (hold)",
    "command": "PAN",
    "category": "view",
    "description": "Pan"
  },
  {
    "keys": "Alt+RMB",
    "command": "FIT (ZOOM TO FIT)",
    "category": "view",
    "description": "Fit (Zoom to Fit)"
  },
  {
    "keys": "Ctrl+RMB (hold)",
    "command": "ZOOM IN/OUT",
    "category": "view",
    "description": "Zoom In/Out"
  },
  {
    "keys": "Ctrl+H",
    "command": "SKETCH VIEW (ORIENT NORMAL TO SKETCH PLANE)",
    "category": "sketch",
    "description": "Sketch View (Orient Normal to Sketch Plane)"
  },
  {
    "keys": "Alt (hold)",
    "command": "SUSPEND INTELLISKETCH (SKETCH)",
    "category": "sketch",
    "description": "Suspend IntelliSketch (Sketch)"
  },
  {
    "keys": "L",
    "command": "LINE COMMAND: SWITCH ARC MODE TO LINE MODE",
    "category": "sketch",
    "description": "Line Command: Switch Arc Mode to Line Mode"
  },
  {
    "keys": "A",
    "command": "LINE COMMAND: SWITCH LINE MODE TO ARC MODE",
    "category": "sketch",
    "description": "Line Command: Switch Line Mode to Arc Mode"
  },
  {
    "keys": "Shift (while drawing line)",
    "command": "LOCK ANGLE TO 15 DEGREE INCREMENTS",
    "category": "sketch",
    "description": "Lock Angle to 15 Degree Increments"
  },
  {
    "keys": "S",
    "command": "LINE COMMAND: SYMMETRIC LINE MODE",
    "category": "sketch",
    "description": "Line Command: Symmetric Line Mode"
  },
  {
    "keys": "Shift (while drawing rectangle)",
    "command": "CREATE SQUARE INSTEAD OF RECTANGLE",
    "category": "sketch",
    "description": "Create Square Instead of Rectangle"
  },
  {
    "keys": "Ctrl+Click element",
    "command": "EXTEND TO SPECIFIED ELEMENT",
    "category": "system",
    "description": "Extend to Specified Element"
  },
  {
    "keys": "Shift (during Extend)",
    "command": "TOGGLE SYMMETRIC EXTEND",
    "category": "system",
    "description": "Toggle Symmetric Extend"
  },
  {
    "keys": "Spacebar (during Extrude)",
    "command": "ADD/REMOVE MATERIAL",
    "category": "features",
    "description": "Add/Remove Material"
  },
  {
    "keys": "Ctrl (during Move/Rotate/Mirror)",
    "command": "COPY ELEMENT",
    "category": "view",
    "description": "Copy Element"
  },
  {
    "keys": "Ctrl+Spacebar",
    "command": "SWITCH FACE/PART PRIORITY MODE (ASSEMBLY)",
    "category": "assembly",
    "description": "Switch Face/Part Priority Mode (Assembly)"
  },
  {
    "keys": "Shift+Spacebar",
    "command": "INVOKE SELECTION MANAGER",
    "category": "system",
    "description": "Invoke Selection Manager"
  },
  {
    "keys": "Esc",
    "command": "DROP SELECT SET",
    "category": "system",
    "description": "Drop Select Set"
  }
];

const TIPS = [
  {
    "title": "Spacebar is the workhorse",
    "content": "In sketch, Spacebar applies the closed profile as an extrude (with Add/Remove material options); in assembly, Ctrl+Spacebar toggles face-vs-part selection priority."
  },
  {
    "title": "Customize missing keys",
    "content": "Circle, trim, and revolve have no default single-key shortcuts — assign your own via the Customize dialog (Ribbon keyboard customization)."
  }
];

export default function SheetClient() {
  return (
    <ShortcutCheatsheetClient
      title="Solid Edge"
      subtitle="Default Solid Edge shortcuts from Siemens official blog reference tables. Circle/trim/revolve have no default single keys — use Ribbon Alt-tips or customize them."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
