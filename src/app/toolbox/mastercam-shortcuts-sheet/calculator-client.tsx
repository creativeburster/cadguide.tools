'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "view",
    "name": "🔍 View & Zoom"
  },
  {
    "id": "select",
    "name": "🎯 Selection"
  },
  {
    "id": "toolpath",
    "name": "⚙️ Toolpaths"
  },
  {
    "id": "solids",
    "name": "🧊 Solids"
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
    "keys": "Ctrl+Shift+S",
    "command": "SAVE AS",
    "category": "system",
    "description": "Save As"
  },
  {
    "keys": "Ctrl+Z",
    "command": "UNDO THE LAST EVENT",
    "category": "system",
    "description": "Undo the Last Event"
  },
  {
    "keys": "Ctrl+Y",
    "command": "REDO AN EVENT",
    "category": "system",
    "description": "Redo an Event"
  },
  {
    "keys": "Ctrl+A",
    "command": "SELECT ALL",
    "category": "select",
    "description": "Select All"
  },
  {
    "keys": "Ctrl+C",
    "command": "COPY TO CLIPBOARD",
    "category": "system",
    "description": "Copy to Clipboard"
  },
  {
    "keys": "Ctrl+X",
    "command": "CUT TO CLIPBOARD",
    "category": "system",
    "description": "Cut to Clipboard"
  },
  {
    "keys": "Ctrl+V",
    "command": "PASTE FROM CLIPBOARD",
    "category": "system",
    "description": "Paste from Clipboard"
  },
  {
    "keys": "F5",
    "command": "DELETE ENTITIES",
    "category": "system",
    "description": "Delete Entities"
  },
  {
    "keys": "F4",
    "command": "ANALYZE ENTITIES",
    "category": "system",
    "description": "Analyze Entities"
  },
  {
    "keys": "Alt+F1",
    "command": "FIT GEOMETRY TO SCREEN",
    "category": "view",
    "description": "Fit Geometry to Screen"
  },
  {
    "keys": "F1",
    "command": "ZOOM WINDOW",
    "category": "view",
    "description": "Zoom Window"
  },
  {
    "keys": "F2",
    "command": "UN-ZOOM TO PREVIOUS OR 50%",
    "category": "view",
    "description": "Un-zoom to Previous or 50%"
  },
  {
    "keys": "Alt+F2",
    "command": "UN-ZOOM 80%",
    "category": "view",
    "description": "Un-zoom 80%"
  },
  {
    "keys": "PgUp / PgDn",
    "command": "ZOOM/UN-ZOOM BY 5%",
    "category": "view",
    "description": "Zoom/Un-zoom by 5%"
  },
  {
    "keys": "Arrow Keys",
    "command": "PAN",
    "category": "view",
    "description": "Pan"
  },
  {
    "keys": "Alt+Arrow Keys",
    "command": "ROTATE VIEW",
    "category": "view",
    "description": "Rotate View"
  },
  {
    "keys": "Alt+1",
    "command": "GVIEW TOP",
    "category": "view",
    "description": "Gview Top"
  },
  {
    "keys": "Alt+2",
    "command": "GVIEW FRONT",
    "category": "view",
    "description": "Gview Front"
  },
  {
    "keys": "Alt+3",
    "command": "GVIEW BACK",
    "category": "view",
    "description": "Gview Back"
  },
  {
    "keys": "Alt+4",
    "command": "GVIEW BOTTOM",
    "category": "view",
    "description": "Gview Bottom"
  },
  {
    "keys": "Alt+5",
    "command": "GVIEW RIGHT",
    "category": "view",
    "description": "Gview Right"
  },
  {
    "keys": "Alt+6",
    "command": "GVIEW LEFT",
    "category": "view",
    "description": "Gview Left"
  },
  {
    "keys": "Alt+7",
    "command": "GVIEW ISOMETRIC",
    "category": "view",
    "description": "Gview Isometric"
  },
  {
    "keys": "Alt+P",
    "command": "GVIEW PREVIOUS PLANE",
    "category": "view",
    "description": "Gview Previous Plane"
  },
  {
    "keys": "Alt+T",
    "command": "SHOW/HIDE DISPLAYED TOOLPATHS",
    "category": "toolpath",
    "description": "Show/Hide Displayed Toolpaths"
  },
  {
    "keys": "Alt+O",
    "command": "TOOLPATHS MANAGER",
    "category": "toolpath",
    "description": "Toolpaths Manager"
  },
  {
    "keys": "Alt+I",
    "command": "SOLIDS MANAGER",
    "category": "solids",
    "description": "Solids Manager"
  },
  {
    "keys": "Alt+G",
    "command": "GRID SETTINGS",
    "category": "system",
    "description": "Grid Settings"
  },
  {
    "keys": "Alt+Z",
    "command": "LEVELS MANAGER",
    "category": "system",
    "description": "Levels Manager"
  },
  {
    "keys": "Alt+E",
    "command": "SHOW/HIDE ENTITY",
    "category": "system",
    "description": "Show/Hide Entity"
  },
  {
    "keys": "Alt+S",
    "command": "SHADING ON/OFF",
    "category": "system",
    "description": "Shading On/Off"
  },
  {
    "keys": "F9",
    "command": "SHOW/HIDE AXES",
    "category": "system",
    "description": "Show/Hide Axes"
  },
  {
    "keys": "Alt+F9",
    "command": "SHOW/HIDE GNOMONS",
    "category": "system",
    "description": "Show/Hide Gnomons"
  },
  {
    "keys": "Alt+H",
    "command": "HELP",
    "category": "system",
    "description": "Help"
  },
  {
    "keys": "Alt+F4",
    "command": "EXIT MASTERCAM",
    "category": "system",
    "description": "Exit Mastercam"
  }
];

const TIPS = [
  {
    "title": "Alt key menus",
    "content": "Most Mastercam commands are reached via Alt + letter (e.g. Alt+T toolpaths, Alt+O operations). The Quick Reference Card lists the full Alt map."
  },
  {
    "title": "Chaining has no hotkey",
    "content": "Chaining is mouse-driven: click an entity and use the chaining dialog/masks. Do not trust third-party lists that assign keys to chaining."
  }
];

export default function SheetClient() {
  return (
    <ShortcutCheatsheetClient
      title="Mastercam"
      subtitle="Function keys and Alt-combinations from the official Mastercam Quick Reference Card. Chaining is mouse-driven (no default keys) — use masks and the chaining dialog."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
