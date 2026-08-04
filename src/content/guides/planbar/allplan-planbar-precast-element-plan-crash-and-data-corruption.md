---
title: "Allplan Planbar Precast Element Plan Crash and Data Corruption"
excerpt: "Allplan Planbar Precast Element Plan Crash and Data Corruption: symptoms, root causes, and step-by-step fixes, verified against Allplan Community forums."
category: "troubleshooting"
softwareSlug: "planbar"
keyword: "Planbar BT_ASSERT_RELEASE NA_Data_NmKtLayoutCatCell element plan crash data corruption precast drawing file associative view view-and-section conflict rebar extrusion single line 3D plane assemblying group bending machine out-of-element bars"
slug: "allplan-planbar-precast-element-plan-crash-and-data-corruption"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://campus.allplan.com/de/forum/themen/topic/topics/cad-engineering/planbar-error.html"
  - "https://connect.allplan.com/de/forum/themen/topic/topics/cad-engineering/aec-2023-data-getting-corrupt-over-and-over-again.html"
  - "https://connect.allplan.com/forum/topics/topic/topics/cad-engineering/different-types-of-view-must-not-to-gather-or-loaded-together.html"
---

# Allplan Planbar Precast Element Plan Crash and Data Corruption: BT_ASSERT_RELEASE Crash in Element Plan from NmKtLayoutCatCell, Data Corruption in Precast Projects from Drawing File Inconsistency, Associative View and View-and-Section Conflict in Pre-2023 Versions, Rebar Extrusion Crash from Single-Line Shape Without 3D Plane, and Assemblying Group for Bending Machine Export and Out-of-Element Bars

Planbar (Allplan's precast CAD module) suffers from element plan crashes, data corruption, view type conflicts, and rebar API issues. This guide covers the 5 most common Planbar problems with diagnostic steps and community-verified fixes from Allplan Community forums.

## 1. BT_ASSERT_RELEASE Crash in Element Plan from NmKtLayoutCatCell

### Error Message

```
BT_ASSERT_RELEASE NA_Data_NmKtLayoutCatCell.cpp 1027
```

### Symptom

When clicking Element Plan in Planbar, the command stops and the program force-closes. The crash happens consistently when trying to generate or edit element plans for precast elements.

### Root Cause

The element plan catalog cell layout is corrupted. The `NA_Data_NmKtLayoutCatCell.cpp` file handles the layout catalog cells for element plans. A corruption in the catalog cell data triggers an assertion failure (BT_ASSERT_RELEASE) at line 1027, causing a forced shutdown.

### Fix

1. **Reset the element plan catalog**:
   - The catalog cell layout is corrupted and needs to be reset
   - Contact Allplan precast support: support.precast@Allplan.com
   - They can provide a catalog reset procedure

2. **Check the element plan template**:
   - The element plan template may reference a corrupted catalog cell
   - Try a different element plan template
   - If a different template works, the original template is corrupted

3. **Recreate the element plan from scratch**:
   - Delete the existing element plan
   - Recreate it using a fresh template
   - This bypasses the corrupted catalog cell data

4. **Update to the latest Planbar version**:
   - This crash may be fixed in newer versions
   - Check for updates and install the latest hotfix
   - BT_ASSERT_RELEASE errors are often fixed in patches

5. **Send the crash report to Allplan**:
   - Include the error message text: `BT_ASSERT_RELEASE NA_Data_NmKtLayoutCatCell.cpp 1027`
   - Include the project file and element plan configuration
   - Allplan support can diagnose the specific catalog cell causing the crash

### Community Report

> "Planbar error — I can't use element plan. After I click the element plan, the command stops and the program is force closed. Error: BT_ASSERT_RELEASE NA_Data_NmKtLayoutCatCell.cpp 1027"

## 2. Data Corruption in Precast Projects from Drawing File Inconsistency

### Symptom

Within precast projects, data goes corrupt "all of a sudden." After weeks or months of not opening different drawing files, Allplan can't open them anymore. Crashing persists. Affects 10 of 20 last projects. Users lose 3-4 hours per week recovering data.

### Specific Corruption Types

- Complete drawing files can't be opened, even after copy via project pilot, renaming, reorganizing, updating to current version
- Reinforcement goes corrupt
- Element plans lose their link to the element plan catalogue and can't be seen or exported
- Fixtures lose their link to the catalogue

### Root Cause

Drawing file data degrades over time, especially when files are not regularly opened and updated. The central model drawing files with 10-20 precast elements accumulate corruption from version updates, background drawing references, and catalog link degradation.

### Fix

1. **Maintain regular file access**:
   - Open all drawing files in a project at least monthly
   - Save and close them to trigger version updates
   - Don't leave drawing files unopened for months

2. **Use proper backup strategy**:
   - Maintain versioned backups, not just the latest
   - Keep backups from multiple points in time
   - "The ways to recover data even with proper backups is completely inconsistent"

3. **Repair drawing files**:
   - Try copying via Project Pilot
   - Try renaming the drawing file
   - Try reorganizing the drawing file
   - Try updating the drawing file manually to the current version
   - If none work, restore from a backup

4. **Fix reinforcement corruption**:
   - Delete and recreate corrupted reinforcement
   - Use the reinforcement backup if available
   - Check reinforcement labels and bar marks for consistency

5. **Fix element plan catalogue links**:
   - Re-link element plans to the catalogue
   - If element plans appear for only 0.2 seconds, the catalogue link is broken
   - Recreate the element plan from the precast element

6. **Fix fixture catalogue links**:
   - Re-link fixtures to the catalogue
   - Re-insert fixtures from the catalogue
   - Check fixture parameters for consistency

7. **Contact Allplan precast support**:
   - For persistent corruption, contact support.precast@Allplan.com
   - Provide the corrupted project files
   - They have specialized tools for data recovery

### Community Report

> "Within all my precast projects, data goes corrupt 'all of a sudden!' After weeks/months not opening different drawing files, Allplan can not open them anymore. I'm losing 3-4 hours a week recovering data."

## 3. Associative View and View-and-Section Conflict in Pre-2023

### Error Message

"Different types of views must not be gathered or loaded together"

### Symptom

Created wall models using the architectural wall tool and added reinforcement using the Reinforcement View tab (Associative View). Then added design using the iWall tool successfully. But when clicking Element Plan, the error "different types of views must not be loaded together" appears. Element plan can't be created.

### Root Cause

Until version 2022, there was a limitation: Associative Views (Reinforcement Views) and standard Views & Sections could not coexist in the same drawing file. The precast module (iWall) uses Associative Views in the background for reinforcement and element plans. Mixing them with standard Views & Sections causes the conflict.

### Fix

1. **For Planbar 2022 and earlier**:
   - Keep Associative Views and standard Views & Sections in separate drawing files
   - "You can make precast elements and Associative Views, but the other views must be placed in another drawing file"
   - All precast users should use only Associative Views until version 2022
   - Don't mix View & Section with Associative View in the same file

2. **For Planbar 2023+**:
   - Version 2023 introduced "mixmod" — allows mixing view types
   - Associative Views are no longer used for new reinforcement
   - Precast objects still use Associative Views in the background
   - Users can work with Views & Sections in the planview

3. **Fix existing mixed files**:
   - **Option 1**: Redo the reinforcement using the correct view type
   - **Option 2**: Move Views & Sections to a different drawing file
   - When switching from 2022 to 2023, all Associative Views are converted to 2D lines
   - Bars are converted to View & Section in the background

4. **Use only Associative Views for precast (pre-2023)**:
   - "Usually, all precast users use only Associative View until version 2022"
   - Don't use View & Section for precast elements
   - This avoids the conflict entirely

5. **Contact precast support**:
   - For complex cases, contact support.precast@Allplan.com
   - They can help migrate mixed files to the correct format

### Community Report

> "Until version 2022, there was a limitation to work with View & Section and Associative View in the same drawing file. The precast technology uses Associative View in background for all reinforcement and element plan."

> "Since version 2023, we have allowed the mixmod. There is no Associative View for any user, but the precast object still uses it in background."

## 4. Rebar Extrusion Crash from Single-Line Shape Without 3D Plane

### Symptom

When using the Allplan Python API to create rebar with only two points (single line) as shape input, Allplan crashes during `ExtrudeBarPlacement.Extrude()`. Adding a third point or hooks prevents the crash. The same issue occurs with `SweepBarPlacement`.

### Root Cause

A single line (two points) doesn't define a 3D plane. The extrusion algorithm needs a 3D plane to determine the cross-section orientation. With only two points, the plane is undefined, causing a crash. Adding a third point or hooks provides the additional geometric information needed to define the plane.

### Fix

1. **Add a third point to define the plane**:
   - A single line doesn't define a 3D plane
   - Add at least one more point to create a polygon
   - The polygon defines the plane for the cross-section

2. **Add hooks to the shape**:
   - Hooks provide additional geometric information
   - `shape_data.add_hook(90, AllplanReinf.HookType.eStirrup)`
   - This helps define the plane without adding a third point

3. **Use BendingShape directly instead of extrusion**:
   - For straight rebar, use `AllplanReinf.BendingShape()` directly
   - Create the bending shape with a polyline
   - Add it to the BendingShape list
   - "Using rebar extrusion for a straight rebar is like using a sledgehammer to crack a nut"

4. **Use the correct API for straight rebar**:
   - `ExtrudeBarPlacement` is for cross-sectional bars along a curve
   - For straight rebar, use `BarPlacement` or `BendingShape` directly
   - Don't use extrusion for simple straight bars

5. **Provide a polygon for the cross-section**:
   - When using `SweepBarPlacement`, provide a `Polygon2D` for the cross-section
   - The polygon defines the plane and the cross-section shape
   - A single line can't serve as a polygon

### Community Report

> "There is a problem with determining 3D plane for single line (which is impossible). If I add a third point or hooks, the script compiles. For a straight rebar, using rebar extrusion is like using a sledgehammer to crack a nut."

## 5. Assemblying Group for Bending Machine Export and Out-of-Element Bars

### Symptom

The "Assemblying Group" tool in Planbar's Engineering tab is not well understood. Users need clarification on when and how to use it.

### Root Cause

The Assemblying Group tool has two specific use cases that are not obvious from the UI: (1) grouping elements for bending machine file export, and (2) connecting bars that extend outside the precast element boundary in Planbar.

### Use Case 1: Bending Machine Export

When exporting data for a bending machine, the Assemblying Group tool groups elements so they get a separate file for the bending machine. This allows:
- Grouping specific elements together for a single bending machine file
- Organizing export files by element type, location, or production sequence
- Controlling which bars go to which bending machine

### Use Case 2: Out-of-Element Bars in Precast

In Planbar precast, bars that extend outside the precast element boundary are normally not allowed to be combined with the precast element. The Assemblying Group tool connects these out-of-element bars to the precast element. Example use case:
- Top bars of a precast beam that extend beyond the element boundary
- "The bars are in the air, so they can normally not be combined to the precast element"
- The Assemblying Group forces the connection

### How to Use

1. **Select the Assemblying Group tool** from the Engineering tab
2. **Select the precast element** that should contain the bars
3. **Select the out-of-element bars** to connect
4. **Confirm the grouping** — the bars are now associated with the element
5. **Export to bending machine** — grouped elements get separate files

### Best Practices

- Use Assemblying Group only when bars legitimately extend outside the element
- Don't use it to force incompatible geometry into an element
- Verify the element plan shows all grouped bars correctly
- Test the bending machine export with the grouped elements

### Community Report

> "This tool is used in 2 cases: (1) When you want to export data for a bending machine, you can group some elements to get a separate file. (2) In precast (Planbar), we use this tool to connect bars out of the element inside the precast element."

## 6. Additional Planbar Issues

### Slow Performance with Large Precast Projects

**Issue**: Planbar becomes slow with large precast projects containing many elements.
**Fix**: Split projects into smaller drawing files. Limit each drawing file to 10-20 precast elements. Use reference models for background drawings instead of embedding them.

### TIM Integration Data Loss

**Issue**: TIM (Tekla Integration Module) data is lost during export/import.
**Fix**: Verify TIM configuration. Check that all required attributes are mapped. Test with a single element before full project export.

### Fixture Catalog Link Loss

**Issue**: Fixtures lose their link to the catalogue after project updates.
**Fix**: Re-link fixtures to the catalogue. Re-insert fixtures from the catalogue if re-linking doesn't work. Contact precast support for persistent issues.

### Version Migration Issues

**Issue**: Upgrading from 2022 to 2023 causes data conversion problems.
**Fix**: All Associative Views are converted to 2D lines during migration. Bars are converted to View & Section in background. Test the migration on a copy of the project first.

## Best Practices

1. **Open all drawing files monthly** — prevents data corruption from inactivity
2. **Keep backups from multiple time points** — not just the latest
3. **Don't mix Associative Views and View & Section (pre-2023)** — use separate drawing files
4. **Use only Associative Views for precast (pre-2023)** — avoid View & Section entirely
5. **Don't use ExtrudeBarPlacement for straight rebar** — use BendingShape directly
6. **Add a third point or hooks for extrusion** — defines the 3D plane
7. **Use Assemblying Group for out-of-element bars** — connects bars to precast elements
8. **Use Assemblying Group for bending machine export** — groups elements into separate files
9. **Contact support.precast@Allplan.com** — for precast-specific issues
10. **Test version migrations on project copies** — before upgrading production projects
