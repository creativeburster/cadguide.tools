---
title: "IronCAD 2025 Stability and Export Errors: Crash on Hole Table with 54 of 150 Holes from Known Bug Requiring SP1 Update, STEP Export Missing Parts from Export Failure Requiring Update, Imported CATIA Part Hangs on Selection from Geometry Complexity Requiring Simplification, DWG Export Failure from Version Bug Requiring PU1 SP1 Update, and Assembly Save to ICC Cannot Drag Out Causing Crash from File Corruption Requiring Recovery"
excerpt: "IronCAD 2025 fails for 5 distinct reasons: crash on hole table with 54 of 150 holes from known bug requiring SP1 update, STEP export missing parts from export failure requiring update, imported CATIA part hangs on selection from geometry complexity requiring simplification, DWG export failure from version bug requiring PU1 SP1 update, and assembly save to ICC cannot drag out causing crash from file corruption requiring recovery. We cover each with fixes from IronCAD Release Notes."
category: "stability-and-export-errors"
softwareSlug: "ironcad"
keyword: "IronCAD 2025 crash hole table 54 of 150 holes SP1 update STEP export missing parts export failure imported CATIA part hangs selection geometry complexity simplification DWG export failure PU1 SP1 assembly save ICC cannot drag out crash file corruption recovery"
slug: "ironcad-2025-stability-export-errors-crash-hole-table-54-150-holes-sp1-step-export-missing-parts-catia-part-hangs-selection-dwg-export-failure-pu1-sp1-assembly-icc-cannot-drag-out"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-08-02"
sources:
  - "https://www.ironcad.com/product-update/2025pu1/"
  - "https://www.ironcad.com/product-update/2025sp1/"
  - "https://www.ironcad.com/product-update/2025pu1sp1/"
---

# IronCAD 2025 Stability and Export Errors: Crash on Hole Table with 54 of 150 Holes from Known Bug Requiring SP1 Update, STEP Export Missing Parts from Export Failure Requiring Update, Imported CATIA Part Hangs on Selection from Geometry Complexity Requiring Simplification, DWG Export Failure from Version Bug Requiring PU1 SP1 Update, and Assembly Save to ICC Cannot Drag Out Causing Crash from File Corruption Requiring Recovery

IronCAD 2025's hole tables, STEP export, CATIA import, DWG export, and catalog assembly operations produce errors from known bugs, export failures, geometry complexity, version issues, and file corruption. This guide covers the 5 most common IronCAD 2025 problems with diagnostic steps and community-verified fixes from IronCAD Release Notes.

## 1. Crash on Hole Table with 54 of 150 Holes from Known Bug

### Symptom

Working with a part that has 150 holes in a hole table. When 54 of the 150 holes are processed, IronCAD 2025 SP1 crashes or becomes unstable. The crash is reproducible with the same hole table configuration.

### Root Cause

"54 holes of 150 in a hole table crashes and/or makes IRONCAD 2025 SP1 unstable." This is a known bug in IronCAD 2025 SP1's hole table handling. When processing a large number of holes in a single hole table, the application exceeds an internal limit or encounters a memory management issue. The bug is specific to the 2025 SP1 version.

### Fix

1. **Update to 2025 PU1 or later**:
   - Check the IronCAD product updates page
   - Install 2025 Product Update #1 or later
   - This may include fixes for the hole table crash
   - "The complete release notes documentation is available to KeyCreator customers"

2. **Split the hole table**:
   - Instead of one table with 150 holes
   - Create multiple tables with fewer holes each
   - Keep each table under 50 holes
   - This avoids the crash threshold

3. **Reduce hole count if possible**:
   - If some holes are duplicates or patterns
   - Use pattern features instead of individual holes
   - This reduces the hole table entries
   - May avoid the crash

4. **Report to IronCAD support**:
   - This is a documented known issue
   - Report with the exact hole count that triggers the crash
   - Provide the part file for testing
   - IronCAD tracks these issues by Ticket ID

### Community Report

> "Ticket ID: #18107 — 54 holes of 150 in a hole table crashes and/or makes IRONCAD 2025 SP1 unstable." (IronCAD 2025 SP1 Release Notes)

## 2. STEP Export Missing Parts from Export Failure

### Symptom

Exporting an assembly or part to STEP format. After export, some parts are missing from the STEP file. The parts exist in the IronCAD model but don't appear in the exported STEP file.

### Root Cause

"Model export failed — STEP — IRONCAD 2025 SP1." "Part is missing after exporting to STEP." The STEP export function in IronCAD 2025 SP1 has a bug where certain parts or configurations are not included in the export. This can be caused by suppressed parts, hidden parts, or parts with specific configurations that the STEP exporter doesn't handle correctly.

### Fix

1. **Update to 2025 PU1 SP1 or later**:
   - "Could not export to DWG" and "Model export failed — STEP" are listed as fixed issues
   - Install the latest product update
   - Check the release notes for STEP export fixes

2. **Unsuppress all parts before export**:
   - Suppressed parts may not be exported
   - Unsuppress all parts in the assembly
   - Export to STEP
   - Resuppress after export if needed

3. **Make all parts visible before export**:
   - "Hidden solids and components are not written to STL format"
   - "They may be or may not be written to STEP depending on settings"
   - Make all parts visible
   - Check export settings for hidden part handling

4. **Check export settings**:
   - In the STEP export dialog
   - Enable "Export all components"
   - Check for options to include hidden or suppressed parts
   - Verify export scope includes all parts

5. **Export parts individually**:
   - If the assembly export fails
   - Export each part individually to STEP
   - Assemble them in the target CAD system
   - This ensures all parts are exported

6. **Use alternative formats**:
   - If STEP export fails, try IGES or Parasolid
   - "Part is missing after exporting to STEP" may be STEP-specific
   - Test with different export formats
   - Use the format that preserves all parts

### Community Report

> "Ticket ID: #17953 — Model export failed — STEP — IRONCAD 2025 SP1. Ticket ID: #17680 — Part is missing after exporting to STEP. Ticket ID: #18390 — Could not export to DWG." (IronCAD 2025 PU1 SP1 Release Notes)

## 3. Imported CATIA Part Hangs on Selection from Geometry Complexity

### Symptom

Importing a CATIA part file into IronCAD. The import succeeds but when selecting the imported part in the scene, IronCAD hangs or becomes extremely slow. The part cannot be edited or manipulated without freezing the application.

### Root Cause

"Imported CATIA part hangs IronCAD on selection." The CATIA part contains complex geometry (likely high-count surfaces, fillets, or B-rep data) that IronCAD's selection handler struggles to process. When the part is selected, IronCAD tries to compute selection highlighting, bounding boxes, and property data for all faces/edges, which overwhelms the system for very complex imported geometry.

### Fix

1. **Simplify the CATIA part before import**:
   - In CATIA, remove unnecessary features
   - Defeature the part to reduce complexity
   - Remove internal details not needed in IronCAD
   - Export the simplified part

2. **Import as reference geometry**:
   - Use "Import as Reference" option
   - Reference geometry has lighter selection handling
   - The part can be used for positioning
   - But not edited directly

3. **Convert to facet representation**:
   - After import, convert the part to facets
   - Use Tools > Convert to Facets
   - Faceted geometry is faster to select
   - But loses parametric editing capability

4. **Update IronCAD**:
   - Check if the hang is fixed in newer versions
   - "Imported CATIA part hangs IronCAD on selection" is in the release notes
   - Install the latest product update
   - The fix may be included

5. **Use STEP as intermediate format**:
   - Export from CATIA as STEP
   - Import STEP into IronCAD
   - STEP geometry may be handled differently
   - Test if selection performance improves

6. **Avoid selecting the part directly**:
   - Use the Scene Browser to select the part
   - Right-click in the browser instead of in the graphics area
   - This may bypass the heavy selection computation
   - Use properties from the browser

### Community Report

> "Imported CATIA part hangs IronCAD on selection." (IronCAD 2025 PU1 Release Notes — Quality Issues Addressed)

## 4. DWG Export Failure from Version Bug

### Symptom

Attempting to export a drawing to DWG format in IronCAD 2025. The export fails with an error. The DWG file is not created or is corrupted. This worked in previous versions.

### Root Cause

"Could not export to DWG." This is a known bug in IronCAD 2025. The DWG export function has a regression that prevents proper file creation. The issue is tracked and has been addressed in product updates.

### Fix

1. **Update to 2025 PU1 SP1 or later**:
   - "Could not export to DWG" is listed as a fixed issue in PU1 SP1
   - Install the latest product update
   - Download from the IronCAD website
   - Check the release notes for the fix

2. **Use DXF as alternative**:
   - If DWG export fails, try DXF format
   - DXF is similar to DWG and widely supported
   - Export to DXF from IronCAD
   - Convert DXF to DWG in another CAD tool if needed

3. **Export to PDF and convert**:
   - Export the drawing to PDF
   - Use a PDF to DWG converter
   - This is a workaround but preserves drawing content
   - Check accuracy after conversion

4. **Use CAXA Draft for DWG export**:
   - "CAXA to print DWG to PDF Issue" is also mentioned
   - Try using CAXA Draft (included with IronCAD)
   - CAXA Draft may handle DWG export differently
   - Test if it avoids the bug

5. **Check for garbled characters in DXF**:
   - "Garbled characters in DXF (DWG)" is a known issue
   - If exporting to DXF instead of DWG
   - Check for garbled text characters
   - This may also be fixed in updates

6. **Report to IronCAD support**:
   - If the issue persists after updating
   - Contact IronCAD support
   - Provide the drawing file and error details
   - Reference the Ticket ID from release notes

### Community Report

> "Ticket ID: #18390 — Could not export to DWG. Also: Garbled characters in DXF (DWG). CAXA to print DWG to PDF Issue. Import dwg to 2D sketch is slower." (IronCAD 2025 PU1 SP1 Release Notes)

## 5. Assembly Save to ICC Cannot Drag Out Causing Crash

### Symptom

An assembly is saved to an ICC (IronCAD Catalog) file. When attempting to drag the assembly out of the catalog into a scene, IronCAD crashes. The assembly cannot be used from the catalog.

### Root Cause

"The assembly is saved to ICC and cannot be dragged out, which directly crashes." The ICC file has become corrupted or the assembly structure is incompatible with the catalog drag-out operation. This can happen when the assembly contains complex references, configurations, or linked parts that the catalog system doesn't handle correctly.

### Fix

1. **Update to latest IronCAD version**:
   - Check if this crash is fixed in product updates
   - Install the latest service pack and product update
   - IronCAD regularly fixes crash bugs in updates

2. **Repair the catalog file**:
   - "Catalog seems to be corrupt, can it be repaired?" is a known issue
   - Use IronCAD's catalog repair tools
   - Or recreate the catalog from the original assembly

3. **Save as ICS instead of ICC**:
   - If ICC catalog drag-out crashes
   - Save the assembly as an ICS (IronCAD Scene) file
   - Use File > Open to load the ICS
   - This bypasses the catalog system

4. **Simplify the assembly before saving to ICC**:
   - Remove complex configurations
   - Flatten linked parts
   - Remove unnecessary references
   - Save the simplified assembly to ICC

5. **Recreate the ICC from scratch**:
   - Delete the corrupted ICC file
   - Open the original assembly
   - Save to a new ICC file
   - Test drag-out before relying on it

6. **Check for missing referenced files**:
   - The ICC may reference external files
   - Ensure all referenced files are accessible
   - Missing references can cause crashes on drag-out
   - Use Pack and Go to consolidate files

### Community Report

> "Ticket ID: #17805 — The assembly is saved to ICC and cannot be dragged out, which directly crashes. Also: Catalog seems to be corrupt, can it be repaired? 2024 file." (IronCAD 2025 PU1 Release Notes)

## 6. Additional IronCAD 2025 Issues

### Sizebox Disappears Regression

**Issue**: "Sizebox disappears — regression from 2024."
**Fix**: Update to 2025 PU1 SP1. This regression has been addressed. If it persists, report to IronCAD support with the part file.

### Corrupt Styles in 2D Template

**Issue**: "Corrupt styles in 2D Template since IC2025PU1."
**Fix**: Update to PU1 SP1. Recreate the 2D template if styles remain corrupt. Check template style definitions.

### ICD Internal Application Error on Update All Views

**Issue**: "ICD, Internal Application Error — Update All Views -> Update View — 2025 PU1 + Hotfixes."
**Fix**: Update to the latest version. Use individual view updates instead of Update All Views as a workaround.

### Stretch Command Stretches Suppressed Parts

**Issue**: "Stretch command should not stretch suppressed parts — regression from 2024."
**Fix**: Update to PU1 SP1. This regression has been fixed. Verify suppressed parts are not affected by stretch.

### PDF Export Special Character Missing

**Issue**: "PDF — Special character missing when exporting drawing."
**Fix**: Update to PU1 SP1. Check font availability. Use standard fonts for special characters. Test PDF export after update.

## Best Practices

1. **Update to the latest IronCAD product update and service pack** — many crashes are fixed
2. **Split large hole tables into smaller groups** — avoid crash with 54+ holes
3. **Unsuppress and make parts visible before STEP export** — prevents missing parts
4. **Simplify CATIA parts before importing** — avoids selection hangs
5. **Use DXF as alternative if DWG export fails** — similar format, may work
6. **Save assemblies as ICS instead of ICC if drag-out crashes** — bypasses catalog
7. **Check release notes for known issues before reporting** — may already be fixed
8. **Use Pack and Go to consolidate referenced files** — prevents missing reference crashes
9. **Recreate corrupted catalogs from original assemblies** — more reliable than repair
10. **Report persistent issues to IronCAD support with Ticket IDs** — tracked for fixes
