---
title: "Cadence Allegro PCB Editor DRC Crashes and Constraint Manager Errors: DRC Crash from Database Corruption Fixable by dbDoctor, Setup Function Crash from Graphics Driver and Window Position, Stale DRC Markers After Constraint Update Requiring DRC Update, Shape-to-Shape Spacing Constraint Not Found in Constraint Manager, and External DRC Rules from SKILL Programs and RAVEL"
excerpt: "Allegro PCB Editor fails for 5 distinct reasons: DRC crashes from database corruption fixable by dbDoctor or single-thread mode, setup functions crash from graphics drivers requiring -safe and -noopengl launch, stale DRC markers persist after constraint updates requiring manual DRC update, shape-to-shape spacing constraints are hidden in expanded Constraint Manager columns, and external DRC rules appear from SKILL programs or RAVEL without user knowledge. We cover each with fixes from Cadence Community forums."
category: "troubleshooting"
softwareSlug: "allegro-pcb"
keyword: "Cadence Allegro PCB Editor DRC crash dbDoctor database corruption single thread setup crash noopengl stale DRC markers shape-to-shape spacing constraint manager external DRC SKILL RAVEL"
slug: "allegro-pcb-drc-constraint-manager-errors-dbdoctor-single-thread-noopengl-stale-drc-shape-spacing-external-rules"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://community.cadence.com/cadence_technology_forums/pcb-design/f/pcb-design/37619/17-2-pcb-designer-crashes-every-time-drc-is-run"
  - "https://community.cadence.com/cadence_technology_forums/pcb-design/f/pcb-design/41997/pcb-editor-17-2-2016-s055-crashing-without-error"
  - "https://community.cadence.com/cadence_technology_forums/pcb-design/f/allegro-x-pcb-editor/48384/actual-value-is-meeting-the-constraint-value-but-still-seeing-the-drc-e-g-actual-value-higher-than-constraint-value-for-line-to-line-spacing-but-the-drc-is-still-present"
---

# Cadence Allegro PCB Editor DRC Crashes and Constraint Manager Errors: DRC Crash from Database Corruption Fixable by dbDoctor, Setup Function Crash from Graphics Driver and Window Position, Stale DRC Markers After Constraint Update Requiring DRC Update, Shape-to-Shape Spacing Constraint Not Found in Constraint Manager, and External DRC Rules from SKILL Programs and RAVEL

Allegro PCB Editor crashes during DRC, setup functions fail from graphics issues, and constraint manager produces confusing DRC markers. This guide covers the 5 most common Allegro PCB problems with diagnostic steps and community-verified fixes from Cadence Community forums.

## 1. DRC Crash from Database Corruption

### Symptom

PCB Editor crashes without any errors or notification when running DRC. The crash only occurs with one specific design (.brd file) — other designs work fine. The crash also locks the license file, requiring hours for the license to reset.

### Root Cause

The .brd file has internal database corruption — a divide-by-zero or null/zero value in a constraint or property field. The DRC engine encounters this invalid value and crashes.

### Fix

1. **Run dbDoctor** — the primary fix:
   - Tools → Database Check → click "Check"
   - Or run from command line: `dbdoctor <design.brd>`
   - dbDoctor reads the database, identifies broken entries, and fixes what it can
   - This is the most common fix for DRC crashes

2. **Enable single-thread DRC** — if dbDoctor doesn't fix it:
   - Setup → User Preferences
   - Expand DRC → select General
   - Check "drc_single_thread"
   - Click Apply → OK
   - Display → Status → update DRC
   - Multi-threaded DRC can trigger race conditions with corrupt data

3. **Check for zero-value properties**:
   - dbDoctor typically finds and fixes div-by-zero issues
   - Look for properties set to 0 instead of null
   - Manually check constraint values in Constraint Manager

4. **Recover from .SAV file** — if the crash saves a .SAV file:
   - The design is saved as .SAV before crashing
   - Run dbDoctor on the .SAV file
   - Rename the fixed .SAV to .brd

### Community Report

> "Have you run dbDoctor? I always run dbDoctor in these situations. My guess is that there is a div by 0 or something that needs to be corrected, and this can fix that."

> "Running dbDoctor fixed it. I wasn't exactly sure of the purpose of dbDoctor until now."

## 2. Setup Function Crash from Graphics Driver

### Symptom

Selecting certain setup functions (cross-section, constraint manager, color dialog) causes a crash: "Program has encountered a problem and must exit. The design will be saved as a .SAV file." The error suggests using dbDoctor and contacting Cadence support, but support hasn't resolved it.

### Root Cause

Graphics driver conflict or corrupt window position file. The setup dialogs trigger OpenGL rendering, and a buggy graphics driver causes a crash. The allegro.geo file stores window positions and can become corrupt.

### Fix

1. **Launch with -safe mode**:
   - Open a Command window
   - Run: `allegro -safe`
   - This disables all customization and uses safe defaults
   - If the crash doesn't occur in safe mode, the issue is customization-related

2. **Launch with -noopengl**:
   - Run: `allegro -noopengl`
   - Disables OpenGL hardware acceleration
   - If the crash stops, the graphics driver is the cause

3. **Delete the allegro.geo file**:
   - Navigate to the pcbenv folder (typically `%HOME%\pcbenv`)
   - Delete `allegro.geo` — this stores window positions
   - Corrupt window positions can cause crashes when opening dialogs
   - Allegro recreates the file with default positions on next launch

4. **Update graphics driver**:
   - Download the latest driver from NVIDIA/AMD/Intel
   - Perform a clean install
   - Restart the computer

5. **Get the latest hotfix**:
   - Cadence releases hotfixes regularly (s019, s055, s056, etc.)
   - Update to the latest hotfix for your version
   - Many crash bugs are fixed in hotfixes

6. **Run dbDoctor on the specific design**:
   - Even if the crash seems graphics-related, run dbDoctor
   - The .SAV file may have introduced new corruption

### Community Report

> "Try starting allegro from a Command window with the allegro -safe and/or allegro -noopengl options to eliminate any customisation and graphics drivers. Delete the allegro.geo file from the pcbenv folder to reset the window positions."

## 3. Stale DRC Markers After Constraint Update

### Symptom

After updating a spacing constraint in Constraint Manager, DRC markers persist even though the actual value now meets the constraint. Example: line-to-line spacing constraint set to 5mil, actual value is 7.08mil, but the DRC marker still shows. This affects multiple constraint types.

### Root Cause

The DRC database is stale — the DRC markers were generated with the old constraint values and haven't been recalculated. Simply changing the constraint value doesn't automatically update existing DRC markers.

### Fix

1. **Run DRC Update**:
   - Go to Check → "DRC Update"
   - This recalculates all DRC markers with current constraint values
   - Stale markers that no longer violate constraints will be removed

2. **Update DRC from Display Status**:
   - Display → Status → Update DRC
   - This forces a full DRC recalculation
   - More thorough than the simple DRC Update

3. **Run dbDoctor first** — if DRC Update doesn't work:
   - dbDoctor can fix DRC database corruption
   - Run dbDoctor, then update DRC

4. **Update to the latest hotfix**:
   - "Make sure you are running on the latest hotfix S019"
   - Stale DRC bugs are often fixed in hotfixes
   - Perform DBDoctor after updating

5. **Don't waive DRCs individually** — if you have too many stale DRCs:
   - Waiving one by one is not practical
   - Use DRC Update first
   - If DRC Update doesn't work, try the above steps
   - As a last resort, waive them in bulk via Tools → DRC Manager → Waive

### Community Report

> "I updated line to line spacing constraint value, and the 'Actual value' is already larger than 'Constraint value', but I am still seeing the DRC."

> "What I did was go to Check, then 'DRC update', that will update the DRC, then the errors are gone."

## 4. Shape-to-Shape Spacing Constraint Not Found

### Symptom

DRC reports "Shape to Shape Spacing" violations with a constraint value (e.g., 0.51mm) that the user cannot find or change. The user changed the spacing in Setup → Constraints → Spacing, but the DRC still uses the old value.

### Root Cause

The shape-to-shape spacing constraint is set in the Constraint Manager, not in the Setup → Constraints → Spacing dialog. The Constraint Manager has expanded columns that reveal the SHAPE_TO_SHAPE_SPACING entries, which are hidden by default.

### Fix

1. **Open Constraint Manager**:
   - Setup → Constraints → Constraint Manager
   - Or click the Constraint Manager icon

2. **Find SHAPE_TO_SHAPE_SPACING entries**:
   - Navigate to the Spacing constraint set
   - Look for the Shape To Shape column
   - **Click the small triangle in the upper row to expand columns**
   - The expanded view reveals individual shape-to-shape spacing values

3. **Set the correct value**:
   - Type the desired value (e.g., 0.25mm) in the appropriate cell
   - The expanded columns show all shape-to-shape combinations

4. **Update shapes after changing constraints**:
   - Changing the constraint resets dynamic fill
   - Shapes need to be updated: Display → Status → Update all
   - Or use Shape → Global Dynamic Parameters → Update

5. **Note: Undo is not possible** after changing spacing constraints:
   - Save the design before making constraint changes
   - If the change is wrong, manually revert the values

### Community Report

> "In the Constraint Manager, you need to find the SHAPE_TO_SHAPE_SPACING entries. To remove the value, one must expand the columns by clicking on the field with the small triangle in the upper row."

## 5. External DRC Rules from SKILL Programs and RAVEL

### Symptom

The project reports many DRC violations about "external rules." The user didn't set any external rules and isn't familiar with them. The DRC markers have "X D" characters in them.

### Root Cause

External DRCs are created by Allegro SKILL programs using the `axlDBCreateExternalDRC` function, or by RAVEL rules. These are not standard electrical or physical constraint DRCs — they come from the "External Domain." A third-party SKILL script or plugin created these DRC markers.

### Fix

1. **Identify the source of external DRCs**:
   - External DRC markers always have "X D" in the marker text
   - Check if any SKILL scripts are loaded that create DRCs
   - Check for RAVEL rules in the project

2. **Check for SKILL programs**:
   - Look in the SKILL menu or allegro.ilinit file
   - Search for `axlDBCreateExternalDRC` in SKILL files
   - Example SKILL call that creates external DRC:
     ```skill
     axlDBCreateExternalDRC('("My Spacing Line to Pin" "12" "Cadence") 1500:2000 "top", nil nil "10 MILS")
     ```

3. **Remove external DRCs**:
   - Cadence has a solution for removing external DRCs
   - Requires access to support.cadence.com
   - Look for the article on removing external DRC markers

4. **Check for third-party plugins**:
   - Some DFA (Design for Assembly) checkers create external DRCs
   - Example: "Annual Ring Size less than minimum allowed value of 6"
   - Disable the third-party plugin and recheck

5. **Manually delete DRC markers**:
   - Use the DRC Manager to find and delete external DRCs
   - Or use SKILL to delete: `axlDBDeleteExternalDRC`

### Community Report

> "External DRC's can be added via a skill program or external third party software. Those DRCs which do not come under Electrical, Physical domains etc come under External Domain. An externally defined DRC marker always has the two characters 'X D' in it."

## 6. Additional Allegro PCB Issues

### License Lock After Crash

**Issue**: Crash locks the license file, requiring hours for reset.
**Fix**: Contact the license administrator to release the license. Use `lmutil lmremove` to force-release the license.

### Cross-Section Dialog Crash

**Issue**: Cannot add layers because the cross-section dialog crashes.
**Fix**: Launch with `allegro -noopengl`, delete allegro.geo, or update to the latest hotfix.

### Color Dialog Crash

**Issue**: The color/visibility dialog crashes on open.
**Fix**: Delete allegro.geo from pcbenv folder. This resets window positions including the color dialog.

## Best Practices

1. **Run dbDoctor before contacting support** — fixes most DRC crash issues
2. **Enable drc_single_thread** — if DRC crashes persist after dbDoctor
3. **Launch with -safe or -noopengl** — to diagnose setup dialog crashes
4. **Delete allegro.geo** — resets corrupt window positions
5. **Run DRC Update after changing constraints** — removes stale DRC markers
6. **Expand Constraint Manager columns** — reveals hidden shape-to-shape spacing
7. **Save before changing constraints** — Undo doesn't work for constraint changes
8. **Check for SKILL-created external DRCs** — look for "X D" markers
9. **Keep hotfixes current** — many crash bugs are fixed in hotfixes
10. **Don't waive DRCs individually** — use DRC Update first for stale markers
