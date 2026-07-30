---
title: "CircuitMaker Performance Limits, Part Rotation Bugs, and File Format Lock-In: What Altium Doesn't Tell You"
excerpt: "CircuitMaker is free but engineered to be impractical beyond 5,000 pads. Users report access violations, part rotation bugs, sluggish cloud commits, and no local file saves. We cover the real limitations, known bugs, and migration paths to KiCad."
category: "troubleshooting"
softwareSlug: "circuitmaker"
keyword: "CircuitMaker performance slow part rotation bug access violation file format KiCad migration"
slug: "circuitmaker-performance-limits-rotation-bugs-file-format-migration"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-07-30"
sources:
  - "https://www.altium.com/documentation/altium-circuitmaker/faqs"
  - "https://www.eevblog.com/forum/eda/altium-circuitmaker-slow-as-a-wet-week-and-part-rotating-problems/"
  - "https://electronics.stackexchange.com/questions/490205/circuitmaker-to-kicad"
---

# CircuitMaker Performance Limits, Part Rotation Bugs, and File Format Lock-In: What Altium Doesn't Tell You

CircuitMaker is Altium's free PCB design tool, built on the same engine as Altium Designer. While it offers unlimited components and nets with no hard limits, the software is **engineered to become impractical** for large designs. Community reports reveal a pattern of performance degradation, UI bugs, and cloud-only storage that creates real workflow friction.

## The 5,000-Pad Performance Wall

Per Altium's own documentation:

- **5,000 pads**: PCB Editor starts to exhibit performance degradation — routing, placing components, and polygon pours slow down progressively
- **50,000 pads**: PCB Editor becomes "virtually unusable"

There are no hard limits — CircuitMaker won't refuse to open a large design. Instead, editing functions progressively slow until the tool is impractical. This is by design: Altium positions CircuitMaker for makers and hobbyists, not professional production work.

## Bug 1: Part Rotation in PCB Editor Sends Components Off-Screen

**Symptom**: When rotating components in the PCB editor, parts don't rotate in place — they "dart off to some distant land out of view" with stretched net wires. If the component is deselected, it's lost permanently.

**Root Cause**: A known bug in the rotation logic. When multiple parts are selected, the rotation axis is the **mean point** of all selected parts rather than each part's own origin. This is documented in the CircuitMaker forum.

**Workaround**:
- Rotate parts one at a time, not in groups
- After rotation, use **Ctrl + Arrow keys** to bring the component back into view
- Do not click elsewhere after rotating — the component will be deselected and difficult to find

## Bug 2: Access Violations When Placing Vias or Deselecting Items

**Symptom**: Access violation errors appear when attempting to place vias or deselect items. The bug report submission itself fails with "503 Service Unavailable."

**Root Cause**: Memory handling bugs in the PCB editor, particularly when dealing with complex nets or after extended editing sessions.

**Workaround**:
- Save and restart CircuitMaker frequently
- Commit changes regularly (though commits themselves can be slow — see below)
- If access violations persist, simplify the design by reducing concurrent net count

## Bug 3: Sluggish Cloud Commits and No Local Saves

**Symptom**: Committing changes to the cloud takes up to minutes. Properties dialogs take 20+ seconds to open. The entire application feels sluggish even on powerful PCs with fast internet.

**Root Cause**: CircuitMaker stores all projects in the Altium 365 cloud — there are no local file copies. Every operation requires server round-trips. Users in regions far from Altium servers experience worse latency.

**Impact**:
- No offline work is possible — an internet connection is mandatory
- Projects belong to the community cloud, not the user's local machine
- File sharing outside the Altium platform is not straightforward

**Mitigation**: Use CircuitMaker during off-peak hours (community reports better performance when "most of the world sleeps"). Once schematic capture is complete, PCB layout is reportedly faster.

## Bug 4: Component Revision Conflicts in Community Vault

**Symptom**: After revising a custom part in the community vault, attempting to update the part on the schematic fails with "there is a more recent revision made by another user" — even when no other user has modified the part.

**Root Cause**: Vault synchronization delays between the local cache and the cloud server.

**Workaround**:
1. Delete the part from the schematic
2. Place the revised part fresh from the vault
3. Manually edit parameters to match the original design

This is a manual and error-prone process, particularly for designs with many custom parts.

## File Format Lock-In and Migration

CircuitMaker uses its own PCB file format (`.CMPcbDoc`). PCB documents created in other Altium products cannot be opened directly. Altium Designer PCB files can be exported to CircuitMaker format via **File → Export → CircuitMaker** in Altium Designer's PCB Editor.

### Migrating to KiCad

Users frustrated with CircuitMaker's limitations often migrate to KiCad. The community has developed conversion tools:

- **altium2kicad**: An open-source converter available at `https://github.com/thesourcerer8/altium2kicad`
- CircuitMaker's file format is similar to Altium's, so the Altium-to-KiCad converter works for most designs
- **Caveat**: Format translation is never perfect — expect to manually fix at least a few elements that don't convert cleanly

### Importing from Other Tools

CircuitMaker 2.3.0+ can import designs from:
- KiCad
- P-CAD

This makes initial migration to CircuitMaker easier, but exporting back out remains limited.

## CircuitMaker 2.3.0 Improvements

The latest release (July 2024) addressed some community complaints:

- Component search engine switched from Octopart API to **Nexar API** (faster, more secure)
- **Altium CoDesigner** integration with Autodesk Fusion 360 for PCB-to-mechanical data exchange
- Bug fixes for pad hole rendering, shortcut keys, and crash during symbol search
- Part rotation and parameter visibility fixes on part update

## Known Bug History (from Release Notes)

| Bug ID | Issue |
|--------|-------|
| 345 | Outputs could not be generated due to an error |
| 293 | Pad holes not rendered correctly in PCB Footprint Library editor |
| 295 | Shortcuts not working in schematic editor and Symbol Library editor |
| 343 | Part rotation and visibility reset upon updating to latest revisions |
| 356 | Crash during symbol search in Select Item Revision dialog |
| 292 | View Configuration button missing from View ribbon tab in footprint editor |

## Who Should Use CircuitMaker

Despite its limitations, CircuitMaker has genuine strengths:
- **Free** with no licensing or subscription
- **Same engine as Altium Designer** — professional-level schematic capture
- **16 signal layers + 16 plane layers**, unlimited PCB size
- **3D viewer** for visualizing physical layout
- **Large community component library**
- **One-click manufacturing quotes** via Altium 365

It's best suited for: quick prototypes, learning PCB design, and small-to-medium projects under 5,000 pads. For production work, Altium Designer or KiCad are more reliable choices.
