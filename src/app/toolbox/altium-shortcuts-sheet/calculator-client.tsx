'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  { id: 'general', name: '⚙️ General' },
  { id: 'schematic', name: '📐 Schematic' },
  { id: 'pcb', name: '🔌 PCB Layout' },
  { id: 'route', name: '🛤️ Routing' },
  { id: 'view', name: '👁️ View & Nav' },
];

const SHORTCUTS = [
  // General
  { keys: 'Ctrl + N', command: 'New Document', category: 'general', description: 'Create a new project or document.' },
  { keys: 'Ctrl + O', command: 'Open File', category: 'general', description: 'Open an existing file.' },
  { keys: 'Ctrl + S', command: 'Save', category: 'general', description: 'Save the current document.' },
  { keys: 'Ctrl + Shift + S', command: 'Save All', category: 'general', description: 'Save all open documents.' },
  { keys: 'Ctrl + P', command: 'Print', category: 'general', description: 'Open the print dialog.' },
  { keys: 'Ctrl + Z', command: 'Undo', category: 'general', description: 'Undo the last action.' },
  { keys: 'Ctrl + Y', command: 'Redo', category: 'general', description: 'Redo the last undone action.' },
  { keys: 'Ctrl + C', command: 'Copy', category: 'general', description: 'Copy selected objects.' },
  { keys: 'Ctrl + V', command: 'Paste', category: 'general', description: 'Paste copied objects.' },
  { keys: 'Ctrl + X', command: 'Cut', category: 'general', description: 'Cut selected objects.' },
  { keys: 'Ctrl + A', command: 'Select All', category: 'general', description: 'Select all objects in the document.' },
  { keys: 'Ctrl + Q', command: 'Close Document', category: 'general', description: 'Close the current document.' },
  { keys: 'F1', command: 'Help', category: 'general', description: 'Open Altium Designer help.' },
  { keys: 'F2', command: 'Rename', category: 'general', description: 'Rename the selected object.' },
  { keys: 'Tab', command: 'Properties', category: 'general', description: 'Open properties panel for the selected/placing object.' },

  // Schematic
  { keys: 'P + W', command: 'Place Wire', category: 'schematic', description: 'Place a wire connection in the schematic.' },
  { keys: 'P + N', command: 'Place Net Label', category: 'schematic', description: 'Place a net label on a wire or bus.' },
  { keys: 'P + B', command: 'Place Bus', category: 'schematic', description: 'Place a bus in the schematic.' },
  { keys: 'P + O', command: 'Place Power Port', category: 'schematic', description: 'Place a power or ground port symbol.' },
  { keys: 'P + P', command: 'Place Part', category: 'schematic', description: 'Place a component part from a library.' },
  { keys: 'P + J', command: 'Place Junction', category: 'schematic', description: 'Place a manual junction point.' },
  { keys: 'P + T', command: 'Place Text', category: 'schematic', description: 'Place a text string annotation.' },
  { keys: 'T + W', command: 'Wire Auto-Connect', category: 'schematic', description: 'Set wire auto-connect options.' },

  // PCB Layout
  { keys: 'P + R', command: 'Place Route', category: 'pcb', description: 'Start interactive routing of a connection.' },
  { keys: 'P + P', command: 'Place Pad', category: 'pcb', description: 'Place a pad on the PCB.' },
  { keys: 'P + V', command: 'Place Via', category: 'pcb', description: 'Place a via on the PCB.' },
  { keys: 'P + C', command: 'Place Component', category: 'pcb', description: 'Place a component on the PCB.' },
  { keys: 'P + T', command: 'Place Track', category: 'pcb', description: 'Place a track (line) segment.' },
  { keys: 'P + F', command: 'Place Fill', category: 'pcb', description: 'Place a copper fill area.' },
  { keys: 'P + R', command: 'Place Region', category: 'pcb', description: 'Place a polygon region.' },
  { keys: 'D + R', command: 'Design Rules', category: 'pcb', description: 'Open the Design Rules Checker dialog.' },
  { keys: 'D + U', command: 'Update PCB', category: 'pcb', description: 'Update PCB from schematic (import changes).' },
  { keys: 'T + D', command: 'Board Outline', category: 'pcb', description: 'Define or edit the board outline.' },

  // Routing
  { keys: 'Shift + R', command: 'Cycle Routing Mode', category: 'route', description: 'Cycle through routing modes (ignore, stop, push).' },
  { keys: 'Shift + S', command: 'Single Layer Mode', category: 'route', description: 'Toggle single-layer display mode.' },
  { keys: 'Shift + E', command: 'Snap Toggle', category: 'route', description: 'Toggle electrical snap.' },
  { keys: 'Shift + G', command: 'Guide Toggle', category: 'route', description: 'Toggle routing guide display.' },
  { keys: 'Shift + A', command: 'Add Via', category: 'route', description: 'Add a via while routing.' },
  { keys: 'Shift + Space', command: 'Cycle Corner Style', category: 'route', description: 'Cycle through corner styles (45, 90, arc, any angle).' },
  { keys: 'Space', command: 'Flip Direction', category: 'route', description: 'Flip the routing direction while placing a track.' },
  { keys: 'Backspace', command: 'Remove Last Track', category: 'route', description: 'Remove the last track segment while routing.' },
  { keys: '*', command: 'Next Layer + Via', category: 'route', description: 'Switch to next signal layer and auto-insert via.' },

  // View & Navigation
  { keys: 'Ctrl + PageDown', command: 'Fit Document', category: 'view', description: 'Zoom to fit the entire document.' },
  { keys: 'Ctrl + Shift + H', command: 'Pan', category: 'view', description: 'Enter pan mode.' },
  { keys: 'PageDown', command: 'Zoom Out', category: 'view', description: 'Zoom out.' },
  { keys: 'PageUp', command: 'Zoom In', category: 'view', description: 'Zoom in.' },
  { keys: 'End', command: 'Refresh', category: 'view', description: 'Refresh the screen display.' },
  { keys: 'Home', command: 'Center View', category: 'view', description: 'Center the view on the cursor position.' },
  { keys: 'V + D', command: 'Fit Document', category: 'view', description: 'Fit the entire document in the view.' },
  { keys: 'V + F', command: 'Fit Selected', category: 'view', description: 'Zoom to fit the selected objects.' },
  { keys: 'L', command: 'Layer Stack', category: 'view', description: 'Open the View Configuration / Layer Stack manager.' },
  { keys: 'O + B', command: 'Board Options', category: 'view', description: 'Open board options (grid, units, snap settings).' },
  { keys: 'J + L', command: 'Jump to Location', category: 'view', description: 'Jump to a specific X/Y coordinate.' },
  { keys: 'J + C', command: 'Jump to Component', category: 'view', description: 'Jump to a specific component reference.' },
];

const TIPS = [
  {
    title: 'Two-letter shortcuts are Altium\'s signature',
    content: 'Altium uses two-letter mnemonic shortcuts (e.g., P+P for Place Part, D+R for Design Rules). These are typed in sequence, not simultaneously. Watch the status bar — it shows available next letters after the first key.'
  },
  {
    title: 'Shift+R cycles routing conflict modes',
    content: 'While interactive routing, press Shift+R to cycle between Ignore Obstacles, Stop at First Obstacle, and Push Obstacles modes. This lets you handle tight board areas without leaving the routing tool.'
  },
];

export default function AltiumShortcutsClient() {
  return (
    <ShortcutCheatsheetClient
      title="Altium Designer"
      subtitle="Searchable reference for Altium Designer keyboard shortcuts covering schematic editing, PCB layout, routing, and project navigation."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
    />
  );
}
