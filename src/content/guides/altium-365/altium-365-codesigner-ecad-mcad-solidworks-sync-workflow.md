---
title: "Altium 365 ECAD-MCAD CoDesigner: PCB-to-SolidWorks Sync Workflow"
excerpt: "Set up Altium 365 CoDesigner to synchronize PCB designs between Altium Designer and MCAD tools like SolidWorks, Inventor, and PTC Creo for collaborative board-mechanical design."
category: "workflow"
softwareSlug: "altium-365"
keyword: "altium 365 codesigner ecad mcad solidworks sync"
slug: "altium-365-codesigner-ecad-mcad-solidworks-sync-workflow"
author: "CADGuide Tools Editorial Team"
readTime: "9 min read"
date: "2026-07-13"
sources:
  - "https://resources.altium.com/p/getting-started-for-PCB-design-engineers"
  - "https://www.altium.com/documentation/altium-365/workspace"
---

# Altium 365 ECAD-MCAD CoDesigner: PCB-to-SolidWorks Sync Workflow

ECAD-MCAD collaboration is one of the most common sources of late-stage PCB redesign. Board shape updates get missed, component placement drifts, and mechanical constraints like keepouts or height limits don't make it back to the layout until it's too late. Altium 365's CoDesigner feature solves this by synchronizing PCB designs between Altium Designer and MCAD tools through the Workspace.

## How CoDesigner Works

CoDesigner uses the Altium 365 Workspace as an intermediary between ECAD and MCAD. Instead of exporting files back and forth, both sides push and pull design snapshots through the Workspace:

1. **ECAD pushes** a design snapshot to the Workspace
2. **MCAD pulls** the snapshot and imports it as a board assembly
3. **MCAD makes changes** (board shape, mounting holes, placement-critical components)
4. **MCAD pushes** the changes back to the Workspace
5. **ECAD pulls** and reviews the change list, selectively accepting updates

This structured exchange means both teams always work from the same evolving design intent, with a clear audit trail of who changed what.

## Supported MCAD Tools

CoDesigner supports integration with:

- SolidWorks
- Autodesk Inventor
- PTC Creo
- Siemens NX

Each MCAD tool requires a corresponding CoDesigner plugin installed on the mechanical engineer's machine.

## Initial Setup

### On the ECAD Side (Altium Designer)

1. Open Altium Designer and sign in to your Altium 365 Workspace
2. Open the CoDesigner panel from the Panels menu
3. The panel connects to the Workspace automatically

### On the MCAD Side

1. Install the CoDesigner plugin for your MCAD tool
2. Sign in to the same Altium 365 Workspace
3. Open the CoDesigner panel within the MCAD application

Both sides must be connected to the same Workspace and the same project.

## Typical Workflow

### Pushing from ECAD to MCAD

When the PCB layout is ready for mechanical review:

1. In Altium Designer, open the CoDesigner panel
2. Click **Push** to send the current design state to the Workspace
3. The MCAD engineer receives a notification that a new snapshot is available
4. In the MCAD tool, the CoDesigner panel shows the pending update
5. The MCAD engineer clicks **Pull** to import the board as a native assembly

The imported assembly includes the board outline, component footprints as 3D bodies, and mounting holes.

### Making Mechanical Changes in MCAD

The MCAD engineer can modify:

- **Board shape and outline** — cutouts, notches, curved edges
- **Mounting features** — holes, standoffs, brackets
- **Placement-critical components** — connectors, LEDs, switches that must align with enclosure features

After making changes, the MCAD engineer clicks **Push** in the CoDesigner panel to send the modifications back.

### Reviewing Changes in ECAD

When the MCAD engineer pushes changes, Altium Designer shows a Change List in the CoDesigner panel. Each change is listed individually:

- Board outline modified (with before/after comparison)
- Mounting hole added at location X, Y
- Component U15 moved from (X1, Y1) to (X2, Y2)

The ECAD engineer can selectively accept or reject each change. Accepted changes are applied to the PCB layout directly.

## Common Issues

### Component 3D Body Mismatches

If a component's 3D body in Altium Designer doesn't match what the MCAD tool expects, the imported assembly may have incorrect geometry. Ensure all components have accurate 3D models in the Altium library.

### Board Shape Not Updating

If the MCAD engineer modifies the board shape but ECAD doesn't see the change, check that the CoDesigner panel is set to show all pending changes. Sometimes a refresh is needed.

### Version Conflicts

If both sides make changes simultaneously, the Workspace handles this through its revision system. The first push creates a new revision, and the second push creates a conflict that must be resolved manually.

## Best Practices

- **Establish a push/pull cadence** — don't let changes accumulate
- **Use comments in the CoDesigner panel** to explain why changes were made
- **Lock placement-critical components** in Altium Designer so MCAD can't move them accidentally
- **Define keepout areas** in ECAD before pushing so MCAD knows where components can't go
- **Review the change list carefully** — accepting all changes blindly can break the layout
