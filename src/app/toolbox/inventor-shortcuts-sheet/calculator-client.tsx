'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "sketch",
    "name": "📐 Sketching"
  },
  {
    "id": "part",
    "name": "⚙️ Part modeling"
  },
  {
    "id": "assembly",
    "name": "🔗 Assembly constraints"
  }
];
const SHORTCUTS = [
  {
    "keys": "L",
    "command": "Line (straight line)",
    "category": "sketch",
    "description": "Create 2D or 3D sketch lines. "
  },
  {
    "keys": "C",
    "command": "Center Point Circle",
    "category": "sketch",
    "description": "Draws a circle with the specified point as the center. "
  },
  {
    "keys": "D",
    "command": "Dimension (size)",
    "category": "sketch",
    "description": "Dimension-driven dimension constraints on sketch geometry. "
  },
  {
    "keys": "F",
    "command": "Fillet (rounded corners)",
    "category": "sketch",
    "description": "Create a fillet between two intersecting lines in the sketch.. "
  },
  {
    "keys": "E",
    "command": "Extrude (Stretch)",
    "category": "part",
    "description": "Extrude a closed sketch outline into a feature solid."
  },
  {
    "keys": "R",
    "command": "Revolve (Rotate)",
    "category": "part",
    "description": "Create features by rotating a 2D sketch about an axis. "
  },
  {
    "keys": "H",
    "command": "Hole (punch)",
    "category": "part",
    "description": "Quickly create threaded holes, countersunk holes, etc. at specified points on the solid surface. "
  },
  {
    "keys": "F3",
    "command": "Toggle Visibility",
    "category": "part",
    "description": "Quickly switch the visibility state of the current mouseover component. "
  },
  {
    "keys": "C",
    "command": "Constraint (constraint)",
    "category": "assembly",
    "description": "Call up the surface fitting, coaxial center and other constraint panels in the assembly environment. "
  },
  {
    "keys": "P",
    "command": "Place Component",
    "category": "assembly",
    "description": "Insert an existing 3D part from your local hard drive or library. "
  }
];
const TIPS = [
  {
    "title": "The magic of sketch annotation shortcut key D",
    "content": "Type the D command to quickly start dimensioning. If it is an arc dimension, it will automatically default to a radius dimension.; If it is two circles, it will automatically default to the center distance dimension., Extremely intelligent. "
  }
];

export default function AutodeskInventorClient() {
  return (
    <ShortcutCheatsheetClient
      title="Autodesk Inventor"
      subtitle="Quick review of 3D mechanical assembly modeling. Organized Inventor Shortcut keys for sketch constraints, part features, and large assembly constraints, Supports search and A4 printing. "
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
);
}
