---
title: "MagiCAD Revit Crash and IFC Export Errors: Fatal Error AccessViolationException When Checking Dataset Writing Permission in Worksharing Environment, Updating Support and Hangers in Older Project Causes Revit to Crash from Version Conflict, Wrong Friction Loss Method in Sprinkler Calculation from Hazen-Williams Instead of Darcy-Weissbach Requiring System Option Rerun, Active Storey Changes After Duct or Pipe Calculations with Multiple Drawings Open, and IFC Export Version Conflict McHpv Requiring ARX BRX File Update"
excerpt: "MagiCAD fails for 5 distinct reasons: fatal error AccessViolationException when checking dataset writing permission in worksharing environment, updating Support and Hangers in older project causes Revit to crash from version conflict, wrong friction loss method in sprinkler calculation from Hazen-Williams instead of Darcy-Weissbach requiring System option rerun, active storey changes after duct or pipe calculations with multiple drawings open, and IFC export version conflict McHpv requiring ARX BRX file update. We cover each with fixes from MagiCAD troubleshooting and Graphisoft Community."
category: "revit-crash-and-calculation-errors"
softwareSlug: "magicad"
keyword: "MagiCAD fatal error AccessViolationException dataset writing permission worksharing Support Hangers update crash version conflict wrong friction loss sprinkler Hazen-Williams Darcy-Weissbach active storey changes duct pipe calculations multiple drawings IFC export McHpv ARX BRX"
slug: "magicad-revit-crash-ifc-export-errors-accessviolation-dataset-worksharing-support-hangers-crash-friction-loss-sprinkler-hazen-williams-darcy-weissbach-active-storey-duct-pipe-ifc"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://www.magicad.com/mep-design/support-training/support/troubleshooting/"
  - "https://www.magicad.com/service-release-magicad-2025-ur-1-1-for-autocad-and-bricscad/"
  - "https://community.graphisoft.com/t5/Collaboration-with-other/Problems-with-Archicad-IFC-export-to-MagiCAD/td-p/262938"
---

# MagiCAD Revit Crash and IFC Export Errors: Fatal Error AccessViolationException When Checking Dataset Writing Permission in Worksharing Environment, Updating Support and Hangers in Older Project Causes Revit to Crash from Version Conflict, Wrong Friction Loss Method in Sprinkler Calculation from Hazen-Williams Instead of Darcy-Weissbach Requiring System Option Rerun, Active Storey Changes After Duct or Pipe Calculations with Multiple Drawings Open, and IFC Export Version Conflict McHpv Requiring ARX BRX File Update

MagiCAD's worksharing, version updates, sprinkler calculations, storey management, and IFC export produce errors from dataset permission conflicts, version incompatibilities, and calculation method bugs. This guide covers the 5 most common MagiCAD problems with diagnostic steps and community-verified fixes from MagiCAD troubleshooting and Graphisoft Community.

## 1. Fatal Error AccessViolationException When Checking Dataset Writing Permission in Worksharing

### Symptom

When working in a Revit worksharing environment with MagiCAD, opening a project causes a fatal error: "AccessViolationException when checking the dataset writing permission." The crash occurs when dataset content is opened in certain worksharing scenarios. The error prevents access to the project.

### Root Cause

MagiCAD checks dataset writing permissions when opening a project. In worksharing environments, the dataset content access can trigger an AccessViolationException when multiple users access the same dataset simultaneously or when the worksharing central file locks the dataset in a way MagiCAD doesn't handle correctly. This is a known issue in MagiCAD 2025 and later.

### Fix

1. **Update to the latest MagiCAD service release**:
   - "Fatal error happened in certain scenarios in worksharing environment when dataset content was opened"
   - Check for MagiCAD updates in the Download Portal
   - Install the latest UR (Update Release) version
   - The fix may be included in a service release

2. **Detach from central and recreate local**:
   - In Revit: File > Open > select the central file
   - Check "Detach from Central" and create a new local file
   - This may resolve the dataset permission conflict
   - Sync the new local file back to central

3. **Check dataset folder permissions**:
   - Navigate to the MagiCAD dataset folder
   - Right-click > Properties > Security
   - Ensure all users have Read access
   - Ensure the current user has Write access

4. **Use a single-user dataset access**:
   - In worksharing, designate one user as the dataset editor
   - Other users use read-only dataset access
   - This prevents simultaneous write permission checks
   - Configure in MagiCAD User Settings

5. **Contact MagiCAD support**:
   - "Fatal error: AccessViolationException when checking the dataset writing permission"
   - This is listed as a known issue on the troubleshooting page
   - Report the specific worksharing scenario to support
   - Provide the Revit version and MagiCAD version

### Community Report

> "Fatal error happened in certain scenarios in worksharing environment when dataset content was opened. Fatal error: AccessViolationException when checking the dataset writing permission." — MagiCAD Troubleshooting, known issues with MagiCAD 2025 and later.

## 2. Updating Support and Hangers in Older Project Causes Revit to Crash

### Symptom

Opening an older Revit project with MagiCAD. MagiCAD prompts to update Support & Hangers products. If the update is performed when opening the project or after the project is already open, Revit crashes. The crash happens specifically during the Support & Hangers update process.

### Root Cause

Older MagiCAD projects have Support & Hangers data in a format incompatible with newer MagiCAD versions. The update process attempts to migrate the old data to the new format, but the migration can fail and crash Revit. This is a known issue in MagiCAD 2024 for Revit. The crash occurs because the update modifies family instances that Revit can't handle during the migration.

### Fix

1. **Update MagiCAD before opening the project**:
   - "If you update the S&H products when opening the project or after the project is already open, Revit crashes"
   - Install the latest MagiCAD UR before opening the old project
   - The latest UR may have fixed the crash
   - Check the MagiCAD Download Portal

2. **Don't update Support & Hangers immediately**:
   - When prompted to update, choose "No" or "Later"
   - Open the project without updating S&H
   - Manually update S&H after the project is stable
   - Use MagiCAD > Support & Hangers > Update

3. **Remove old S&H data before update**:
   - Open the project in the old MagiCAD version
   - Delete all Support & Hangers elements
   - Save and close
   - Open in the new MagiCAD version and recreate S&H

4. **Use the MagiCAD Project Wizard**:
   - Use the Project Wizard to migrate the project
   - The wizard handles version upgrades more carefully
   - Follow the wizard steps for S&H migration
   - Check for errors after migration

5. **Contact MagiCAD support for migration assistance**:
   - "Updating Support & Hangers in older project causes Revit to crash"
   - This is listed as a known issue in MagiCAD 2024
   - Contact support with the project file
   - They may provide a manual migration procedure

### Community Report

> "If you update the S&H products when opening the project or after the project is already open, Revit crashes. Updating Support & Hangers in older project causes Revit to crash." — MagiCAD 2024 Known Issues.

## 3. Wrong Friction Loss Method in Sprinkler Calculation from Hazen-Williams Instead of Darcy-Weissbach

### Symptom

Calculating sprinkler networks in MagiCAD. The Network option for calculating sprinkler networks uses the wrong method for friction loss — Hazen-Williams instead of Darcy-Weissbach. After performing the calculation with the System option, the Network option also changes to the correct method. But when the software is closed and a new session started, the Network calculation option reverts to the wrong method. An unnecessary system is also added to the project.

### Root Cause

This is a known bug in MagiCAD 2025 UR-1 and earlier. The Network calculation option defaults to Hazen-Williams instead of Darcy-Weissbach. The System calculation option correctly uses Darcy-Weissbach and temporarily fixes the Network option, but the fix doesn't persist between sessions. The bug also creates an unnecessary system in the project during the calculation.

### Fix

1. **Update to MagiCAD 2025 UR-1.1 or later**:
   - "The Network option for calculating sprinkler networks uses the wrong method for friction loss (Hazen-Williams instead of Darcy-Weissbach)"
   - "Fixed in MagiCAD 2025 UR-1.1 for AutoCAD and BricsCAD"
   - Download from the MagiCAD Download Portal
   - Use Check for Updates in MagiCAD

2. **Use the System option instead of Network**:
   - "If the calculation is later performed with the System option, the Network option also changes to the correct method"
   - Run the calculation with the System option first
   - This temporarily fixes the Network option
   - Results will be correct for the current session

3. **Run System calculation at the start of each session**:
   - Since the fix reverts after restarting
   - At the start of each session, run a System calculation
   - Then use the Network option for subsequent calculations
   - This ensures the correct friction loss method

4. **Delete the unnecessary system**:
   - "Performing the calculation with the wrong calculation method also adds a new unnecessary system into the project"
   - After calculation, check for extra systems in the project browser
   - Delete the unnecessary system
   - This prevents confusion in system management

5. **Verify calculation results**:
   - Compare results between Hazen-Williams and Darcy-Weissbach
   - Darcy-Weissbach is more accurate for most sprinkler systems
   - If results differ significantly, use Darcy-Weissbach
   - Document the correct method for your jurisdiction

### Community Report

> "The Network option for calculating sprinkler networks uses the wrong method for friction loss (Hazen-Williams instead of Darcy-Weissbach). If the calculation is later performed with the System option, the Network option also changes to the correct method. However, when the software is closed and a new session is started, the Network calculation option reverts to the wrong method. Performing the calculation with the wrong method also adds a new unnecessary system into the project." — Fixed in MagiCAD 2025 UR-1.1.

## 4. Active Storey Changes After Duct or Pipe Calculations with Multiple Drawings Open

### Symptom

In MagiCAD for BricsCAD, running duct or pipe calculations with multiple drawings open simultaneously. After running calculations in one drawing, the active storey changes. When switching to a different drawing to continue working, drawn system elements appear on the wrong floor. The active storey is incorrect.

### Root Cause

MagiCAD for BricsCAD sometimes changes the active storey after duct or pipe calculations if multiple drawings are open at the same time. The calculation process modifies the active storey setting without restoring it. When the user switches to another drawing, the storey setting from the calculation carries over, placing elements on the wrong floor.

### Fix

1. **Update to MagiCAD 2025 UR-1.1 or later**:
   - "MagiCAD for BricsCAD sometimes changes the active storey after duct or pipe calculations if multiple drawings are open at the same time"
   - "Active storey changes after running duct or pipe calculations — Fixed in MagiCAD 2025 UR-1.1"
   - Download from the MagiCAD Download Portal

2. **Close other drawings before running calculations**:
   - If you can't update, close all other drawings
   - Keep only the drawing you're calculating open
   - Run the calculation
   - Reopen other drawings after calculation

3. **Verify active storey after calculations**:
   - After running any calculation
   - Check the active storey in the MagiCAD toolbar
   - If it changed, manually set it back to the correct storey
   - Verify elements are on the correct floor

4. **Check element placement after switching drawings**:
   - When switching between drawings
   - Verify the active storey before drawing
   - Don't assume the storey is correct after a calculation
   - Use the storey dropdown to confirm

5. **Use a single drawing workflow**:
   - Until the fix is installed
   - Work on one drawing at a time
   - Close the drawing before opening another
   - This prevents the storey carryover issue

### Community Report

> "MagiCAD for BricsCAD sometimes changes the active storey after duct or pipe calculations if multiple drawings are open at the same time. If users run calculations in one drawing and then start drawing systems in a different drawing, the active storey is wrong and the drawn system elements are not shown on the correct floor. Fixed in MagiCAD 2025 UR-1.1."

## 5. IFC Export Version Conflict McHpv Requiring ARX BRX File Update

### Symptom

When starting the IFC Export in MagiCAD, an error appears: "A Version conflict with McHpv_r24x64.arx" or "Version conflict with McHpv_V24.brx." The IFC Export may fail or produce incorrect output. The error occurs when the MagiCAD version doesn't match the ARX/BRX file version.

### Root Cause

MagiCAD uses ARX (AutoCAD Runtime Extension) or BRX (BricsCAD Runtime Extension) files for IFC Export. When MagiCAD is updated but the ARX/BRX files are not updated to match, a version conflict occurs. The McHpv file version must match the MagiCAD version. This typically happens after a partial update or when multiple MagiCAD versions are installed.

### Fix

1. **Reinstall or repair MagiCAD**:
   - The ARX/BRX files are installed with MagiCAD
   - Run the MagiCAD installer in Repair mode
   - This updates all ARX/BRX files to the correct version
   - Restart AutoCAD/BricsCAD after repair

2. **Remove old MagiCAD versions**:
   - Uninstall previous MagiCAD versions
   - Old ARX/BRX files may conflict with the new version
   - Use Control Panel > Programs and Features
   - Restart after uninstalling

3. **Check ARX/BRX file versions**:
   - Navigate to the MagiCAD installation folder
   - Find McHpv_r24x64.arx (AutoCAD) or McHpv_V24.brx (BricsCAD)
   - Right-click > Properties > Details tab
   - Verify the file version matches the MagiCAD version

4. **Manually copy correct ARX/BRX files**:
   - Download the latest MagiCAD installer
   - Extract the ARX/BRX files from the installer
   - Copy them to the MagiCAD installation folder
   - Overwrite the old files

5. **Check AutoCAD/BricsCAD support paths**:
   - In AutoCAD: Options > Files > Support File Search Path
   - In BricsCAD: Settings > Support Paths
   - Ensure the MagiCAD folder is in the search path
   - Remove old MagiCAD folders from the path

6. **Contact MagiCAD support**:
   - "A Version conflict with McHpv_r24x64.arx or Version conflict with McHpv_V24.brx error when starting the IFC Export"
   - This is listed as a known issue
   - Contact support with the MagiCAD version and AutoCAD/BricsCAD version
   - They can provide the correct ARX/BRX files

### Community Report

> "A Version conflict with McHpv_r24x64.arx or Version conflict with McHpv_V24.brx error when starting the IFC Export." — MagiCAD Troubleshooting, known issues.

## 6. Additional MagiCAD Issues

### Heat Loss Calculation Errors in MagiCAD Room

**Issue**: "Errors have been identified in heat loss calculations in some MagiCAD Room versions. We recommend carefully reviewing heat loss calculation results."
**Fix**: Update to the latest MagiCAD version. Manually verify heat loss results against hand calculations. Report discrepancies to MagiCAD support.

### Problems with Graphics Acceleration in AutoCAD 2027

**Issue**: "Problems with graphics acceleration in AutoCAD 2027."
**Fix**: Update MagiCAD for compatibility with AutoCAD 2027. In AutoCAD: Options > System > Graphics Performance > set to Direct3D11 or disable hardware acceleration.

### Hide Settings Reset When Autohide Is Enabled

**Issue**: "Hide settings are sometimes reset when a drawing is saved if the Autohide option is enabled."
**Fix**: "Fixed in MagiCAD 2025 UR-1.1." Disable Autohide before saving as workaround. Update to UR-1.1.

### File Locking with Autodesk Desktop Connector v16

**Issue**: "File locking problem with Autodesk Desktop Connector version 16."
**Fix**: Update Autodesk Desktop Connector to the latest version. Check MagiCAD compatibility with Desktop Connector. Contact MagiCAD support if the issue persists.

### Archicad IFC Export to MagiCAD Missing Walls

**Issue**: "My HVAC engineer keeps saying that he can't see any wall elements from Archicad IFC export."
**Fix**: In Archicad IFC export, use the "Structural Analytical Model" or "Architectural" preset. Ensure walls are exported as IfcWall elements. Verify in Solibri or IFC viewer before sending to MagiCAD. Check IFC export settings for element classification.

## Best Practices

1. **Update to the latest MagiCAD UR before reporting issues** — many fixes are in service releases
2. **Detach from central for worksharing dataset issues** — resolves permission conflicts
3. **Don't update Support & Hangers on project open** — can crash Revit; update manually after
4. **Use System option for sprinkler calculations** — corrects the Hazen-Williams bug temporarily
5. **Close other drawings before running calculations in BricsCAD** — prevents storey change
6. **Verify active storey after any calculation** — don't assume it's correct
7. **Reinstall MagiCAD for ARX/BRX version conflicts** — updates all extension files
8. **Remove old MagiCAD versions before installing new** — prevents file conflicts
9. **Use UNC paths for network dataset access** — prevents local path issues
10. **Verify IFC exports in Solibri before sending to engineers** — catches missing elements
