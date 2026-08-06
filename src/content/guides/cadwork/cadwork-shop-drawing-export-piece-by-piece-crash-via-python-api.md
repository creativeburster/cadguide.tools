---
title: "CADwork Shop Drawing Export Piece by Piece Crash via Python API"
excerpt: "CADwork Shop Drawing Export Piece by Piece Crash via Python API: symptoms, root causes, and step-by-step fixes, verified against official documentation and community reports."
category: "manufacturing"
softwareSlug: "cadwork"
keyword: "CADwork shop drawing export piece by piece crash Python API BTLx 2.3 beta CAM compatibility BTL Joiner incomplete calculation roof framing DXF CNC export losing attributes BTLx migration NC-Hops export version selection machine menu"
slug: "cadwork-shop-drawing-export-piece-by-piece-crash-via-python-api"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://github.com/cwapi3d/cwapi3dpython/issues/255"
  - "https://kb.cadwork.ch/en/news/manual/1819/export-of-machine-data"
  - "https://kb.cadwork.ch/en/news/manual/1871/export-of-machine-data"
---

# CADwork Shop Drawing Export Piece by Piece Crash via Python API, BTLx 2.3 Beta Version Compatibility with CAM Systems, BTL Joiner Incomplete Machine Calculation for Roof Framing Parts, DXF CNC Export Losing Attributes and Relationships vs BTLx, and NC-Hops Export BTLx Version Selection in 2025: API Crash Fix Update, CAM Version Verification, Operation Check Flags, BTLx Migration, and Machine Menu Navigation

CADwork produces errors from Python API export crashes, BTLx version compatibility, BTL Joiner calculation gaps, DXF export data loss, and NC-Hops version selection. This guide covers the 5 most common CADwork problems with diagnostic steps and community-verified fixes from cadwork KB and GitHub issues.

## 1. Shop Drawing Export Piece by Piece Crash via Python API

### Symptom

Using the Python API function `sd.export_piece_by_piece_with_clipboard()` to export shop drawings piece by piece causes CADwork to crash. The crash occurs intermittently — sometimes it works, sometimes it crashes. No progress bar or visual output is shown during the export, unlike the manual export command which shows progress. The issue occurs in CADwork V2025.

### Root Cause

The Python API function `export_piece_by_piece_with_clipboard` has a stability issue in CADwork V2025 that causes intermittent crashes. The function doesn't display a progress bar because the API doesn't automatically provide visual feedback — the user must set up progress reporting separately. The crash is caused by an internal bug in the shop drawing export routine when called via the API, which doesn't handle certain edge cases that the manual export command handles gracefully. "Crash is reported at cadwork 3d."

### Fix

1. **Update to the latest CADwork V2025**:
   - The crash has been fixed in a later V2025 update
   - Update to version 258 or later
   - Check for updates in CADwork

2. **Add progress bar manually**:
   - Use the built-in progress bar:
   ```python
   import utility_controller as uc
   uc.show_progress_bar()
   for i in range(0, 100):
       uc.update_progress_bar(i)
   uc.hide_progress_bar()
   ```
   - Or use PyQt for custom progress bars

3. **Use manual export as workaround**:
   - If the API continues to crash
   - Use the manual export command instead

4. **Export in smaller batches**:
   - Instead of exporting all elements at once
   - Export in smaller batches
   - To reduce the chance of a crash
   - From large data processing

5. **Wrap in try-except for error handling**:
   - Add Python error handling
   - Around the export function
   - To catch and log errors
   - Without crashing CADwork

6. **Report crashes with reproduction steps**:
   - If the crash persists after updating
   - Report to cadwork support
   - With the Python script
   - And the elements being exported

7. **Check element validity before export**:
   - Verify all element IDs are valid
   - Before calling the export function
   - Invalid or deleted element IDs
   - May cause the crash

### Community Report

> "I am having an issue with the export piece by piece with clipboard of the shop drawing controller, sometimes it crashes Cadwork, and on top of that, it doesn't show the progress or anything. If you want to show some progress bar, you have to set it up yourself. Crash is reported at cadwork 3d. Issue is fixed - please update cadwork 3d v2025."

## 2. BTLx 2.3 Beta Version Compatibility with CAM Systems

### Symptom

After upgrading to CADwork 2025, BTLx 2.3 is available as a new export version. However, the CAM software or machine used for further processing doesn't support BTLx 2.3. Exporting in BTLx 2.3 produces files that the CAM system can't read or processes incorrectly. The BTLx 2.3 version is currently in beta.

### Root Cause

"With Version 2025 the latest BTLx 2.3 interface version has been added under Export > Machine > BTL export. Attention: This version is currently in the beta phase and will be officially released on www.design2machine.com in the near future." BTLx 2.3 is a new version with additional features (fastener attributes, PatternContourType for acoustic surfaces) that older CAM systems don't support. The beta status means the format may still change before final release. CAM systems need to be updated to support BTLx 2.3.

### Fix

1. **Verify CAM system supports BTLx 2.3**:
   - Contact your CAM software provider
   - To verify BTLx 2.3 support

2. **Use BTLx 2.1 or earlier for compatibility**:
   - If your CAM system doesn't support BTLx 2.3
   - Use BTLx 2.1 or an earlier version
   - For export until CAM support is available
   - The earlier versions are stable

3. **Check BTLx 2.3 new features**.

4. **Use BTLx 2.3 for fastener differentiation**:
   - If your CAM system supports BTLx 2.3
   - Use it for projects that require
   - Detailed fastener differentiation
   - Or acoustic surface descriptions

5. **Check design2machine.com for updates**:
   - Monitor the design2machine website
   - For the official BTLx 2.3 release
   - And CAM system compatibility updates

6. **Use process groups for X-Fix fasteners**:
   - Use process groups as a workaround
   - For fasteners not yet supported in BTLx

7. **Download the free BTL viewer**:
   - Use the BTL viewer to verify exports

### Community Report

> "With Version 2025 the latest BTLx 2.3 interface version has been added. Attention: This version is currently in the beta phase and will be officially released on www.design2machine.com in the near future. Please check whether your CAM software or machine used for further processing supports this version, before exporting in this new BTL version. The attributes for fasteners have been completed, so that it is only with this version that a differentiation between fasteners makes sense."

## 3. BTL Joiner Incomplete Machine Calculation for Roof Framing Parts

### Symptom

When using the BTL Joiner machine export (Machine > BTL General > BTL Joiner), parts from the roof framing area are incompletely calculated in the BTL Joiner machine control. The operation check flags these parts as faulty. Specific operations like Birdsmouth are not recognized because they are not permitted in the BTL Joiner configuration.

### Root Cause

"The configuration is sufficient for classic 3-axis operations (groove/rebate, angle cuts, rip cuts, laps, and drillings rotated at most about the C-axis, etc.) as commonly found in furniture making. Parts, for example from the roof framing area, are incompletely calculated in the BTL Joiner machine control and flagged as faulty by the operation check." BTL Joiner is designed for simple 3-axis furniture-making operations, not complex roof framing operations. The Birdsmouth operation is not in the permitted operation list for BTL Joiner. While it could be recognized as a lap, the inclined nature of the lap makes it invalid for BTL Joiner.

### Fix

1. **Use full BTL/BTLx export for roof framing**:
   - BTL Joiner is not suitable for roof framing parts
   - Use the full BTL or BTLx export
   - Under Export > Machine > BTL export
   - For parts with complex operations

2. **Check operation check flags**:
   - Review the operation check output
   - To identify which operations
   - Are not supported by BTL Joiner

3. **Understand BTL Joiner limitations**.

4. **Use BTL Joiner only for furniture parts**:
   - BTL Joiner is licensed separately
   - From the DXF for CNC export
   - Use it only for furniture-making parts
   - With simple 3-axis operations

5. **Recognize Birdsmouth limitation**:
   - Use full BTL export for parts with Birdsmouth

6. **Verify operation compatibility before export**:
   - Before using BTL Joiner
   - Check that all operations on the parts
   - Are in the permitted list
   - For BTL Joiner

7. **Use BTLx process code display in 2026**:
   - The keyword and orientation information
   - Helps identify unsupported operations

### Community Report

> "From version 2026, the BTL Joiner machine export is licensed separately from the DXF for CNC export. The configuration is sufficient for classic 3-axis operations as commonly found in furniture making. Parts from the roof framing area are incompletely calculated in the BTL Joiner machine control and flagged as faulty by the operation check. The birdsmouth is not recognized because the Birdsmouth operation is not permitted."

## 4. DXF CNC Export Losing Attributes and Relationships vs BTLx

### Symptom

When exporting machine data via DXF format for CNC, important information is lost: attributes, relationships, fastening rows, and processing details. The DXF file contains only geometric data. Laser projection software that uses DXF can't distinguish between different element types (window headers, studs, staple rows). The same data exported as BTLx contains all information.

### Root Cause

"Unfortunately, some products still exchange production-relevant data via the DXF format, where much information (attributes, relationships) present in the BTLx interface is lost." DXF is a geometric exchange format that doesn't support structured attributes, relationships, or processing metadata. BTLx (XML-based) preserves all production-relevant data including components, fastening rows, milling/sawing operations, markings, and labels. DXF reduces everything to lines and text, losing the semantic information.

### Fix

1. **Use BTLx instead of DXF for CNC export**:
   - "Much information present in the BTLx interface is lost" in DXF
   - Switch to BTLx format
   - For all CNC machine data exchange
   - To preserve attributes and relationships

2. **Use BTLx for laser projection**.

3. **Use multilingual part names**:
   - Use multilingual part names
   - For international production teams

4. **Use BTLx for panel prefab machines**.

5. **Check if machine supports BTLx**:
   - Verify that your CNC machine
   - Supports BTLx import

6. **Use BTL viewer for verification**:
   - Use the BTL viewer
   - To verify exported data before sending to production

7. **Migrate from DXF to BTLx gradually**:
   - If machines currently only support DXF
   - Plan a migration to BTLx
   - Work with machine manufacturers
   - To enable BTLx support

### Community Report

> "Unfortunately, some products still exchange production-relevant data via the DXF format, where much information (attributes, relationships) present in the BTLx interface is lost. From the BTLx file, components, fastening rows or points, milling/sawing operations, markings, labels, etc. can be selected separately in each processing layer. In the grouped view, you can laser all window headers with one selection and all staple rows with another. A free BTL viewer is available for download, supporting both BTL and BTLx formats."

## 5. NC-Hops Export BTLx Version Selection in 2025

### Symptom

In CADwork 2025, the NC-Hops export has moved to a different menu location. Users familiar with the previous version's menu structure can't find the NC-Hops export. Two BTLx interface versions can be selected for NC-Hops, but it's unclear which version to use. The Kuka export has also moved.

### Root Cause

"New for Version 25, the NC hops export is now listed in this section, while the Kuka export has been moved under Others." The machine export menu has been reorganized in CADwork 2025. NC-Hops is now listed under the CAM systems section (controlled via BTL/BTLx), rather than under the machine manufacturer section. "Two BTLx interface versions can be selected in Version 2025 for controlling the NC-Hops CAM system."

### Fix

1. **Find NC-Hops in the new menu location**:
   - Look under Export > Machine > CAM systems section
   - Not under machine manufacturers

2. **Select the correct BTLx version**:
   - Check which BTLx version
   - Your NC-Hops CAM system supports

3. **Find Kuka export under Others**:
   - If looking for Kuka export
   - Navigate to Export > Machine > Others
   - It has been moved from its previous location

4. **Use function keys for quick access**:
   - Use function keys
   - To quickly navigate to the machine export menu
   - Instead of navigating through menus

5. **Compare V30 and V2025 menu layouts**:
   - The menu structure has changed significantly
   - Compare the old and new layouts
   - To find familiar exports

6. **Use BTLx 2.1 for NC-Hops compatibility**:
   - If unsure which BTLx version to use
   - Start with BTLx 2.1
   - Which is more widely supported
   - By CAM systems

7. **Check NC-Hops documentation**:
   - Consult the NC-Hops CAM system documentation
   - For supported BTLx versions
   - And any specific configuration requirements
   - For the CADwork export

### Community Report

> "In the right hand menu under Export > Machine at the top under BTL export you will still find all supported versions of the BTL and BTLx interface. Followed by numerous menu items covering various machine manufacturers. The menu items under 3 are exports to CAM systems controlled via BTL/BTLx. New for Version 25, the NC hops export is now listed in this section, while the Kuka export has been moved under Others. Two BTLx interface versions can be selected in Version 2025 for controlling the NC-Hops CAM system."

## 6. Additional CADwork Issues

### BTLx Process Code Display in 2026

**Issue**: Understanding BTLx process codes in single-bar check.
**Fix**: "In version 2026, this BTLx process code is displayed in the single-bar check when a BTLx output format is selected. The keyword is followed by orientation (start/end corresponds to the first digit 4/3 in BTL) and the reference side (1-6)."

### Fastener Process Operations in BTLx 2.3

**Issue**: "Further additions have been developed for the use of fasteners that require special processing."
**Fix**: "To benefit from these descriptions, fastener manufacturers must supply the required process operations in BTLx format. Until then, process groups can be used in cadwork (e.g. for X-Fix fasteners)."

### PatternContourType for Acoustic Surfaces

**Issue**: "One new feature of the BTLx 2.3 interface is the 'PatternContourType', which can be used to describe acoustic surfaces very effectively."
**Fix**: "We will be looking at this topic in the near future and providing possible applications." Use BTLx 2.3 for acoustic surface descriptions. Watch for cadwork documentation on PatternContourType applications.

### BTL Joiner Licensing

**Issue**: "From version 2026, the BTL Joiner machine export is licensed separately from the DXF for CNC export."
**Fix**: Ensure you have the appropriate license for BTL Joiner. If you need both BTL Joiner and DXF for CNC, verify licensing covers both. Contact cadwork sales for licensing details.

### BTLx for Laser Projection

**Issue**: "The top image shows the capabilities of the laser software based on data from a DXF for a timber frame wall; the two lower images show data from a BTLx file."
**Fix**: Use BTLx for laser projection to enable flexible layer selection. DXF only shows basic geometry. BTLx allows selecting components, fastening rows, and operations separately in each processing layer.

### Python API Progress Bar

**Issue**: "It doesn't show the progress or anything (like, for example, it does when you use the manual export)."
**Fix**: "If you want to show some progress bar, you have to set it up yourself." Use `uc.show_progress_bar()`, `uc.update_progress_bar(i)`, and `uc.hide_progress_bar()`. Or set up a PyQt progress bar for custom UI.

### Machine Controller Python API

**Issue**: How to export BTL/BTLx via Python API.
**Fix**: Use `machine_controller.export_btl(btl_version, file_path)` or `machine_controller.export_btl_with_presetting(btl_version, file_path, presetting)`. For Hundegger: `export_hundegger_with_file_path_and_presetting_silent(hundeggertype, file_path, presetting)`.

## Best Practices

1. **Update to latest CADwork V2025** — fixes Python API export crashes
2. **Verify CAM supports BTLx 2.3 before export** — beta version may not be supported
3. **Use BTLx 2.1 for maximum compatibility** — until CAM systems support 2.3
4. **Don't use BTL Joiner for roof framing** — use full BTL/BTLx export instead
5. **Migrate from DXF to BTLx** — preserves attributes and relationships
6. **Use BTL viewer to verify exports** — free tool from design2machine.com
7. **Use multilingual part names** — for international production teams
8. **Find NC-Hops under CAM systems in 2025** — menu has been reorganized
9. **Use function keys for quick menu access** — faster than navigating menus
10. **Add progress bars to Python API exports** — use built-in or PyQt progress bars
