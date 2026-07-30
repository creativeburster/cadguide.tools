---
title: "cadwork CNC Machine Data Export: BTLx 2.3 Format, CAMBIUM/Hundegger Integration, Panel Prefab Composite Layers, and Shop Drawing Crash Fixes"
excerpt: "cadwork's machine data export covers BTLx 2.3, CAMBIUM for Hundegger machines, and Weinmann panel prefab systems. We cover the USGV slot cutter Z-axis rotation fix, BTLx 2.3 fastener attributes, composite layer milling/sawing/drilling, rough part dimensioning for hip/valley rafters, and the piece-by-piece export crash fix."
category: "cnc-export"
softwareSlug: "cadwork"
keyword: "cadwork CNC export BTLx CAMBIUM Hundegger machine data panel prefab composite layer shop drawing"
slug: "cadwork-cnc-machine-data-export-btlx-cambium-hundegger-panel-prefab"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://kb.cadwork.ch/en/news/manual/1871/export-of-machine-data"
  - "https://kb.cadwork.ch/en/news/manual/1819/export-of-machine-data"
  - "https://kb.cadwork.ch/en/news/manual/1798/piece-by-piece"
---

# cadwork CNC Machine Data Export: BTLx 2.3 Format, CAMBIUM/Hundegger Integration, Panel Prefab Composite Layers, and Shop Drawing Crash Fixes

cadwork exports machine data to multiple CNC systems through BTLx, CAMBIUM, and Weinmann interfaces. Each interface has specific configuration requirements and known issues. This guide covers the BTLx 2.3 format upgrade, CAMBIUM integration for Hundegger machines, panel prefab composite layer operations, rough part dimensioning for rafters, and the piece-by-piece shop drawing export crash fix.

## BTLx Format Evolution

### From BTL to BTLx 2.3

The BTL (BauTeL) format was developed jointly by cadwork, SEMA, and LIGNOCAM since 2006 as a unified public interface for machine control. In 2015, the ASCII-based BTL was converted to XML-based BTLx.

**Version 2025** adds BTLx 2.3, which replaces BTLx 1.1 in multiple export paths:

| Export Path | BTLx Version |
|-------------|-------------|
| Export → Machine → BTL export | 2.3 (new) |
| Export → Machine → Technowood → TW-Mill M | 2.3 |
| Export → Machine → Technowood → TW-Mill C | 2.3 |
| Export → Machine → Technowood → TW-Agil | 2.3 |
| Export → Machine → Lignocam | 2.3 |
| Export → Machine → Panel prefab → Technowood TW-Mill E | 2.3 |
| Export → Machine → NC-Hops | 1.1 or 2.3 (selectable) |

**Warning**: Verify that your CAM software or machine supports BTLx 2.3 before exporting in the new format.

### BTLx 2.3 New Features

- **Completed fastener attributes**: Nails, screws, and cramps can now be differentiated — only possible with version 2.3
- **Special fastener processing**: Fastener manufacturers must supply required process operations in BTLx format
- **PatternContourType**: Describes acoustic surfaces effectively
- **Process groups in cadwork**: Used for X-Fix fasteners until manufacturer data is available

### Free BTL Viewer

A free BTL/BTLx viewer is available at www.design2machine.com, supporting both formats. It serves as a reference for CAD (writing) and CAM (reading) software manufacturers.

## CAMBIUM Integration for Hundegger Machines

### Direct Machine Selection

Export → Machine → CAMBIUM lets you choose the intended Hundegger machine directly in CAMBIUM. Depending on activated machine licenses:
- Both bars and panels can be exported
- If both beam and panel licenses are enabled, all operations are available
- Outline/Cut-out operations can be calculated for bars and panels

### Contour Metadata (CAMBIUM 2026.01.10+)

Contour operations can be supplemented with **metadata**, allowing export without assigning an explicit tool:
- Enable **Output of contour metadata** in Machine Export Dialog → Extra settings
- Supported contour types: Free contour, Saw cut contour, Milling contour, Marking line
- For Milling contour with "Complete machining" attribute = 1: creates a contour pocket exported as an extrusion body
- Tool can be specified in the Grid name field

### USGV Slot Cutter Z-Axis Rotation

**Issue**: The Universal Slot Cutter Vertical (USGV) for Hundegger K2 can rotate around the Z-axis, but the slot macro in the EKP doesn't offer Z-axis rotation. Previously, users had to create a pocket in cadwork as a workaround.

**Fix**: Slots rotated only around the Z-axis are now passed directly as a rotated lap. No error message is issued.

**Enable**: Check **Pivoting slot cutter available** in Machine Export Dialog → Slot.

### Asymmetrical Scarf Joints

**Issue**: The scarf joint process in CAMBIUM only works for symmetrical scarfs.

**Fix** (Version 2025): If an asymmetrical scarf joint is detected in cadwork, it's realized with laps and an off-cut when exporting to the BVX-2 interface.

### Log Cross-Sections with Grooves and Tongues

**Fix** (Version 2025): Cross-sections with designed grooves and tongues can be used as standard beams with finished profile. On export:
- Number of tongues, spacing, and width are transferred from user attributes
- Tongue height comes from cross-section correction on the corresponding element face

**Important**: If a standard beam with finished profile is exported as a square log, enter a **negative value** as cross-section correction for correct CAMBIUM results.

### Tangential Contour

A new contour type for profile edge processing:
- Added to tool properties under Cut/Solder → Edge processes → Profile edge
- Transfers tool geometry to the machine
- A Process group is linked to the cut element
- CAMBIUM searches for a tool with matching profiling in machine data

## Panel Prefab: Composite Layer Operations

### WALL-Master Extended Capabilities

Latest Hundegger WALL-Master panel prefab machines can mill, saw, and drill (in addition to stapling, nailing, and blown-in insulation), depending on configuration.

**cadwork Version 2026+**: CAMBIUM export extended so milling, drilling, and sawing can be output on respective composite layers:
- Individual parts with operations are written to the BVX file
- Only outlines and cut-outs of panels are processed on the WALL-Master
- CAMBIUM transfers them to respective layers in the composite structure
- Additional drilling, milling, or cuts can be created directly on layers in cadwork
- Operations are transferred to CAMBIUM in the corresponding layer

### BTL Processing Groups in Composites

BTL processing groups can generate operations directly in the composite:
- Set **Panel prefab export** for the associated cutting body under Modify → Extended settings
- Operations are created in the composite layer structure

### Composite Manager

- No longer has to be opened to check panel prefab calculation results
- Can be permanently switched off/on in Options → Representation options → Composite Manager
- When accessing composite control, the entire composite with subordinate elements and processes is displayed
- Middle mouse button M, Page up/down, or arrows scroll through elements

### Weinmann Export: Standardized Process Detection

Previously, laps/inscription/off-cuts on framework elements were set in Panel analysis settings → Extra settings. These settings didn't apply to BTL wall exports.

**Fix**: Detection of process operations on framework elements is now controlled for all panel prefab exports in the same way as BTL wall exports — via the **calculation configuration dialog**.

**Important**: If process operations on single parts are to be recognized, **production numbers must be assigned** to these elements.

### Assembly Groups (Joiner/Cabinet Maker, Version 2025)

Process operations can be created on assembled elements (doors, windows):
1. Combine individual parts into an assembly group via Individual control manager
2. Select more than one element → context menu → **Create assembly group**
3. Calculate or manually define process operations on single elements
4. Existing operations that become superfluous are deleted on request
5. Composite Manager shows relationships and process operations
6. Processes can be moved between individual elements and assembly group via drag & drop
7. Assembly group can be modified (attributes, local axes, etc.) via context menu → Modify

## Rough Part Dimensioning for Rafters

### Hip/Valley Rafter Export

New export options for rough part dimensioning (Version 2025):
- **Real part dimensioning** (traditional, unchanged)
- **Rough part dimensioning** (new) — for manual fabrication

Features:
- Fly rafters not running along roof slope can be exported
- "Hip/Valley" process type must be assigned to fly rafters
- Entrance-Exit tracing line and Tracing lines all rough part edges methods supported
- Offset/interrupted hip/valley lines displayed better with tracing points dimensioned to rough part
- Hip/valley rafters with recess for eave can be exported in full using all four rough part dimensioning methods
- All processes including markings can be exported (previously only typical hip/valley processes)

### Rafter and Jack Rafter Simplified Export

New simplified export (Version 2025):
- Based on hip/valley rafter rough part dimensioning method
- Optimized representation for production and inspection
- Minimal but necessary dimensions
- Clear, functional representation reduced to essentials
- Selectable in configuration dialog → Options tab

## Piece-by-Piece Shop Drawing Export

### Shortened Representation Control (Version 2025)

New function defines the **minimum length distance between processes** from which shortened representation is considered:
- Previously not controllable by the user
- Define value in Representation → General → Shortened representation
- **Minimum value: 100 mm**
- Distance between two processes is only shortened if it exceeds the defined length distance
- Independent setting: "Shorten parts with length processes" — if activated, elements with length processes are shortened during export

### Piece-by-Piece Export Crash Fix

**Issue**: The `export_piece_by_piece_with_clipboard` function in the Python API (cwapi3d) sometimes crashes cadwork without showing progress or any visual output.

**Fix**: Update to **cadwork 3D v2025** (latest build). The crash has been reported and fixed.

**Progress Bar**: For Python API users, set up your own progress bar:
```python
import utility_controller as uc
uc.show_progress_bar()
for i in range(0, 100):
    uc.update_progress_bar(i)
uc.hide_progress_bar()
```
Or use PyQt for a custom progress bar.

## Best Practices

1. **Verify BTLx 2.3 compatibility** with your CAM/machine before switching from 1.1
2. **Enable pivoting slot cutter** for USGV Z-axis rotation on Hundegger K2
3. **Use negative cross-section correction** when exporting standard beams with finished profile as square logs
4. **Assign production numbers** to single parts for process operation recognition in panel prefab
5. **Use calculation configuration dialog** for standardized process detection across all exports
6. **Update cadwork 3D to latest build** to fix piece-by-piece export crashes
7. **Set up progress bars** in Python scripts — the API doesn't provide built-in progress for export functions
8. **Use rough part dimensioning** for manual fabrication exports — clearer representation
9. **Check Composite Manager** for panel prefab calculation results — can be toggled off if not needed
10. **Use assembly groups** for process operations on doors, windows, and other assembled elements
