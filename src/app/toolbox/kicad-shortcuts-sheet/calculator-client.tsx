'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "view",
    "name": "🔍 View & Grid"
  },
  {
    "id": "edit",
    "name": "🛠️ Edit & Placement"
  },
  {
    "id": "routing",
    "name": " Routing & Copper"
  },
  {
    "id": "select",
    "name": "🎯 Select & Find"
  },
  {
    "id": "system",
    "name": "💻 File & System"
  }
];

const SHORTCUTS = [
  {
    "keys": "Ctrl+Z",
    "command": "UNDO",
    "category": "edit",
    "description": "Undo"
  },
  {
    "keys": "Ctrl+Y",
    "command": "REDO",
    "category": "edit",
    "description": "Redo"
  },
  {
    "keys": "Ctrl+S",
    "command": "SAVE",
    "category": "system",
    "description": "Save"
  },
  {
    "keys": "Ctrl+Shift+S",
    "command": "SAVE AS",
    "category": "system",
    "description": "Save As"
  },
  {
    "keys": "Ctrl+A",
    "command": "SELECT ALL",
    "category": "select",
    "description": "Select All"
  },
  {
    "keys": "Ctrl+Shift+A",
    "command": "UNSELECT ALL",
    "category": "select",
    "description": "Unselect All"
  },
  {
    "keys": "U",
    "command": "SELECT/EXPAND CONNECTION",
    "category": "select",
    "description": "Select/Expand Connection"
  },
  {
    "keys": "`",
    "command": "HIGHLIGHT NET",
    "category": "select",
    "description": "Highlight Net"
  },
  {
    "keys": "Alt+`",
    "command": "TOGGLE NET HIGHLIGHT",
    "category": "select",
    "description": "Toggle Net Highlight"
  },
  {
    "keys": "~",
    "command": "CLEAR NET HIGHLIGHTING",
    "category": "select",
    "description": "Clear Net Highlighting"
  },
  {
    "keys": "M",
    "command": "MOVE",
    "category": "edit",
    "description": "Move"
  },
  {
    "keys": "Shift+M",
    "command": "MOVE EXACTLY",
    "category": "edit",
    "description": "Move Exactly"
  },
  {
    "keys": "R",
    "command": "ROTATE COUNTERCLOCKWISE",
    "category": "edit",
    "description": "Rotate Counterclockwise"
  },
  {
    "keys": "Shift+R",
    "command": "ROTATE CLOCKWISE",
    "category": "edit",
    "description": "Rotate Clockwise"
  },
  {
    "keys": "F",
    "command": "FLIP TO OPPOSITE BOARD SIDE (CHANGE SIDE)",
    "category": "routing",
    "description": "Flip to Opposite Board Side (Change Side)"
  },
  {
    "keys": "F1",
    "command": "ZOOM IN AT CURSOR",
    "category": "view",
    "description": "Zoom In at Cursor"
  },
  {
    "keys": "F2",
    "command": "ZOOM OUT AT CURSOR",
    "category": "view",
    "description": "Zoom Out at Cursor"
  },
  {
    "keys": "Home",
    "command": "ZOOM TO FIT",
    "category": "view",
    "description": "Zoom to Fit"
  },
  {
    "keys": "Ctrl+Home",
    "command": "ZOOM TO ALL OBJECTS",
    "category": "view",
    "description": "Zoom to All Objects"
  },
  {
    "keys": "N",
    "command": "SWITCH TO NEXT GRID",
    "category": "view",
    "description": "Switch to Next Grid"
  },
  {
    "keys": "Shift+N",
    "command": "SWITCH TO PREVIOUS GRID",
    "category": "view",
    "description": "Switch to Previous Grid"
  },
  {
    "keys": "X",
    "command": "ROUTE SINGLE TRACK (INTERACTIVE ROUTER)",
    "category": "routing",
    "description": "Route Single Track (Interactive Router)"
  },
  {
    "keys": "6",
    "command": "ROUTE DIFFERENTIAL PAIR",
    "category": "routing",
    "description": "Route Differential Pair"
  },
  {
    "keys": "W",
    "command": "SWITCH TRACK WIDTH TO NEXT",
    "category": "routing",
    "description": "Switch Track Width to Next"
  },
  {
    "keys": "Shift+W",
    "command": "SWITCH TRACK WIDTH TO PREVIOUS",
    "category": "routing",
    "description": "Switch Track Width to Previous"
  },
  {
    "keys": "V",
    "command": "PLACE THROUGH VIA (WHILE ROUTING)",
    "category": "routing",
    "description": "Place Through Via (while routing)"
  },
  {
    "keys": "Ctrl+Shift+X",
    "command": "PLACE VIAS",
    "category": "routing",
    "description": "Place Vias"
  },
  {
    "keys": "'",
    "command": "INCREASE VIA SIZE",
    "category": "routing",
    "description": "Increase Via Size"
  },
  {
    "keys": "B",
    "command": "FILL ALL ZONES (COPPER POUR)",
    "category": "routing",
    "description": "Fill All Zones (Copper Pour)"
  },
  {
    "keys": "Ctrl+B",
    "command": "UNFILL ALL ZONES",
    "category": "routing",
    "description": "Unfill All Zones"
  },
  {
    "keys": "Del",
    "command": "DELETE",
    "category": "edit",
    "description": "Delete"
  },
  {
    "keys": "Shift+Del",
    "command": "DELETE FULL TRACK",
    "category": "routing",
    "description": "Delete Full Track"
  },
  {
    "keys": "Alt+3",
    "command": "OPEN 3D VIEWER",
    "category": "view",
    "description": "Open 3D Viewer"
  },
  {
    "keys": "Ctrl+F",
    "command": "FIND",
    "category": "select",
    "description": "Find"
  },
  {
    "keys": "Ctrl+Shift+M",
    "command": "MEASURE TOOL",
    "category": "system",
    "description": "Measure Tool"
  },
  {
    "keys": "Ctrl+F1",
    "command": "LIST HOTKEYS",
    "category": "system",
    "description": "List Hotkeys"
  }
];

const TIPS = [
  {
    "title": "Full hotkey table in-app",
    "content": "Press Ctrl+F1 inside KiCad to open the complete, version-exact hotkey reference, and customize any action via Preferences > Hotkeys."
  },
  {
    "title": "Interactive routing keys",
    "content": "X starts interactive routing on the active layer; V adds a via while routing; the quote key selects the next routing layer."
  }
];

export default function SheetClient() {
  return (
    <ShortcutCheatsheetClient
      title="KiCad"
      subtitle="Default KiCad PCB Editor hotkeys from the official 10.0 manual Actions reference. Search, copy, and print for your daily layout workflow."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
