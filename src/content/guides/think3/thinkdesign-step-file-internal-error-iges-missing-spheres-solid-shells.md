---
title: "ThinkDesign STEP File Internal Error, IGES Missing Spheres, Solid Shells Inverted Normals"
excerpt: "ThinkDesign STEP File Internal Error, IGES Missing Spheres, Solid Shells Inverted Normals: symptoms, root causes, and step-by-step fixes, verified against DPT release notes and community forums."
category: "troubleshooting"
softwareSlug: "think3"
keyword: "ThinkDesign think3 STEP file internal error IGES missing spheres solid shells inverted normals GBG raster file never ending process .d shared groups import TDXchange converter 2024.1 SP2 DPT release notes neutral format CATIA V5 conversion"
slug: "thinkdesign-step-file-internal-error-iges-missing-spheres-solid-shells"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-03"
sources:
---

# ThinkDesign STEP File Internal Error, IGES Missing Spheres, Solid Shells Inverted Normals, GBG Raster File Never Ending Process, and .d Shared Groups Import Issues: 2024.1 SP2 Fixes, TDXchange Converter Configuration, and Neutral Format Best Practices

ThinkDesign's STEP import, IGES import, solid shell normals, raster file processing, and .d format import produce errors from internal converter bugs, sphere geometry handling, normal direction issues, raster processing loops, and shared group incompatibilities. This guide covers the 5 most common ThinkDesign problems with diagnostic steps and community-verified fixes from DPT release notes and community forums.

## 1. STEP File Internal Error on Load

### Symptom

When loading a STEP file in ThinkDesign, an "Internal error when loading a STEP file" message appears. The file doesn't open. The error may occur with specific STEP files but not others. Some STEP files cause ThinkDesign to close entirely — "TD closes when opening a STEP file."

### Root Cause

The STEP file converter in ThinkDesign had bugs that caused internal errors when processing certain STEP file structures. STEP files from different CAD systems may use different implementation details (AP203, AP214, AP242) that the converter doesn't handle correctly. "Internal error when loading a STEP file" and "TD closes when opening a STEP file" were both fixed in ThinkDesign 2024.1 SP2. The converter couldn't handle specific geometric constructs in the STEP files, causing an unhandled exception.

### Fix

1. **Update to ThinkDesign 2024.1 SP2 or later**:
   - Install the latest service pack
   - These specific STEP import crashes are fixed

2. **Use an alternative STEP format**:
   - If the file still won't load after update
   - Try re-exporting the STEP file from the source CAD
   - Use a different STEP AP (AP203 vs AP214 vs AP242)
   - Some APs are better supported than others

3. **Use IGES as an intermediate format**:
   - If STEP import continues to fail
   - Export from the source CAD as IGES
   - Import the IGES file into ThinkDesign
   - Note: IGES may have its own issues (see Problem 2)

4. **Simplify the STEP file**:
   - If the file is very complex
   - Simplify it in the source CAD
   - Remove unnecessary features
   - Export a simplified STEP file

5. **Check STEP file integrity**:
   - Open the STEP file in a STEP viewer
   - Verify the file is valid
   - If the viewer can't open it, the file may be corrupt
   - Re-export from the source CAD

6. **Use TDXchange Reader for proprietary formats**:
   - If STEP fails, try importing the native format
   - TDXchange may handle the geometry better

7. **Contact DPT support**:
   - If the STEP file still fails after updating
   - Contact DPT support
   - Provide the STEP file
   - Report the specific error message

### Community Report

> "Several issues concerning the following topics have been fixed in version 2024.1 SP2: Fixed 'Internal error when loading a STEP file'. Fixed 'TD closes when opening a STEP file'. The converter TDXchange Reader enables the import into ThinkDesign of the latest and most popular proprietary 3D formats such as Catia v5, ProE, Parasolid and others."

## 2. IGES Model Missing Spheres on Import

### Symptom

When importing an IGES model into ThinkDesign, spheres are missing from the imported geometry. The IGES file contains sphere entities (type 158) that don't appear in the ThinkDesign model. Other geometry imports correctly, but spheres are absent.

### Root Cause

"Fixed 'Missing spheres in loading an IGES model'" in ThinkDesign 2024.1 SP2. The IGES converter in ThinkDesign didn't properly handle IGES sphere entities (type 158). The sphere entity definition in IGES uses a center point and radius, but the converter failed to create the corresponding sphere geometry in ThinkDesign. This resulted in spheres being silently dropped during import — no error message, just missing geometry.

### Fix

1. **Update to ThinkDesign 2024.1 SP2 or later**:
   - Install the latest service pack
   - Spheres are now correctly imported from IGES

2. **Verify imported geometry**:
   - After updating, re-import the IGES file
   - Check that all spheres are present
   - Compare with the original model
   - Verify sphere positions and sizes

3. **Use STEP as alternative**:
   - If IGES sphere import still has issues
   - Export from the source CAD as STEP
   - STEP handles spheres differently
   - May preserve sphere geometry better

4. **Replace missing spheres manually**:
   - If you can't update ThinkDesign
   - Note the sphere centers and radii from the source CAD
   - Create spheres manually in ThinkDesign
   - Position them at the correct locations

5. **Use native format import**:
   - If the source CAD is CATIA V5, SolidWorks, etc.
   - Use TDXchange Reader to import the native format
   - Native formats preserve sphere geometry
   - Avoid IGES conversion issues

6. **Check IGES file for sphere entities**:
   - Open the IGES file in a text editor
   - Search for entity type 158 (sphere)
   - If absent, the source CAD didn't export spheres
   - Re-export with sphere entities enabled

### Community Report

> "Fixed 'Missing spheres in loading an IGES model' in version 2024.1 SP2. The converter TDXchange Reader, which you can purchase separately, offers a further extended set of possibilities, it enables the import into ThinkDesign of the latest and most popular proprietary 3D formats."

## 3. Solid Shells with Inverted Normals

### Symptom

After importing a model into ThinkDesign, solid shells have inverted normals. The surface normals point inward instead of outward. This causes rendering issues (surfaces appear dark or inside-out) and can affect Boolean operations, offset operations, and toolpath generation.

### Root Cause

"Fixed 'Solid Shells with Inverted Normals'" in ThinkDesign 2024.1 SP2. When importing models from neutral formats (STEP, IGES), the normal direction of surface shells may be inconsistent. Different CAD systems use different conventions for normal direction. The converter didn't always correctly orient normals, especially for complex shell geometries with multiple surfaces. Inverted normals cause the solid to appear inside-out and can break downstream operations.

### Fix

1. **Update to ThinkDesign 2024.1 SP2 or later**:
   - Install the latest service pack
   - Normals are now correctly oriented on import

2. **Flip normals manually**:
   - If you can't update or the issue persists
   - Select the affected surfaces
   - Use the flip normals command
   - This reverses the normal direction

3. **Use the solid repair tools**:
   - ThinkDesign has solid repair tools
   - Check the solid for errors
   - Repair inverted normals
   - Verify the solid is valid

4. **Re-export from source with correct normals**:
   - In the source CAD system
   - Check and fix normal directions
   - Ensure all normals point outward
   - Re-export to STEP or IGES

5. **Use native format import**:
   - Native formats preserve normal direction
   - Use TDXchange Reader for CATIA V5, SolidWorks, etc.
   - This avoids the normal inversion issue
   - Normals are correctly oriented

6. **Check for non-manifold geometry**:
   - Inverted normals may indicate non-manifold geometry
   - Use the geometry checker
   - Fix non-manifold edges
   - This may resolve the normal issue

7. **Verify after Boolean operations**:
   - Boolean operations can invert normals
   - After any Boolean, check normals
   - Use the analysis tools
   - Fix any inverted normals

### Community Report

> "Fixed 'Solid Shells with Inverted Normals' in version 2024.1 SP2. ThinkDesign Tooling offers libraries of 3D components and the most popular commercial catalogs. The management of files in various CAD formats of varying quality levels is one of the most challenging tasks for mould makers."

## 4. GBG Raster File Never Ending Process

### Symptom

When opening a GBG raster file in ThinkDesign, the process never ends. The loading progress bar continues indefinitely. ThinkDesign becomes unresponsive. The only way to stop it is to force-close the application.

### Root Cause

"Fixed 'Never ending process opening a GBG raster file'" in ThinkDesign 2024.1 SP2. The GBG (Draftmaker) raster file reader had a bug that caused an infinite loop when processing certain GBG files. The raster file parser entered a loop that never terminated, making ThinkDesign unresponsive. GBG is a proprietary Draftmaker format, and certain file structures triggered the infinite loop.

### Fix

1. **Update to ThinkDesign 2024.1 SP2 or later**:
   - Install the latest service pack
   - The infinite loop is fixed

2. **Convert GBG to a standard format**:
   - If you can't update
   - Convert the GBG file to a standard raster format
   - Use a file conversion tool
   - Import the converted file instead

3. **Check GBG file integrity**:
   - The GBG file may be corrupt
   - Try opening a different GBG file
   - If other GBG files open, the specific file may be corrupt
   - Re-create the GBG file

4. **Use Draftmaker to re-save**:
   - If you have access to Draftmaker
   - Open the GBG file in Draftmaker
   - Re-save it
   - Try importing the re-saved file

5. **Force-close and report**:
   - If ThinkDesign hangs on a GBG file
   - Force-close the application
   - Don't try to open that GBG file again
   - Report the file to DPT support

6. **Use alternative raster formats**:
   - ThinkDesign supports various raster formats
   - Convert the raster image to TIFF, PNG, or JPG
   - Import the alternative format
   - Avoid GBG if possible

### Community Report

> "Fixed 'Never ending process opening a GBG raster file' in version 2024.1 SP2. ThinkDesign Tooling provides 2D translators for DWG, DXF, IGES formats and GBG Draftmaker, besides 3D translators for the formats IGES, STEP, STL, VDA, VRML, WaveFront, IV."

## 5. .d Shared Groups Import Issues

### Symptom

When importing .d files (ThinkDesign 2D format) with shared groups, the import has issues. Shared groups may not import correctly, or the import process produces errors. Some elements from shared groups are missing or misplaced after import.

### Root Cause

"Fixed 'Issues in importing .d with shared groups'" in ThinkDesign 2024.1 SP2. The .d file format is ThinkDesign's native 2D format. Shared groups in .d files allow multiple references to the same group of elements. The importer had bugs handling shared group references, causing missing or incorrect elements. Additionally, "Fixed 'Keyboard short cut setting is not imported by Configuration manager'" in SP1 — configuration import also had issues.

### Fix

1. **Update to ThinkDesign 2024.1 SP2 or later**:
   - Install the latest service pack
   - Shared groups import correctly

2. **Ungroup shared groups before import**:
   - If you can't update
   - In the source ThinkDesign
   - Ungroup all shared groups
   - Save the file
   - Import the ungrouped file

3. **Convert to DWG/DXF**:
   - If .d import continues to fail
   - Export the 2D drawing as DWG or DXF
   - Import the DWG/DXF file
   - DWG/DXF import is more robust

4. **Check shared group references**:
   - In the source file
   - Verify all shared group references are valid
   - Remove broken references
   - Re-save and import

5. **Import without shared groups**:
   - If the file has complex shared groups
   - Flatten the shared groups
   - Convert them to regular groups
   - Import the simplified file

6. **Fix keyboard shortcut import**:
   - "Fixed 'Keyboard short cut setting is not imported by Configuration manager'" (SP1)
   - Update to SP1 or later
   - Keyboard shortcuts now import correctly
   - Re-import the configuration

7. **Fix command path display**:
   - "Fixed 'Command path should be displayed for command search'" (SP1)
   - Update to SP1 or later
   - Command paths display correctly in search
   - This improves usability

### Community Report

> "Fixed 'Issues in importing .d with shared groups' in version 2024.1 SP2. Fixed 'Keyboard short cut setting is not imported by Configuration manager' and 'Command path should be displayed for command search' in SP1. ThinkDesign is now capable to READ any Autodesk Inventor version up to 2024, any Parasolid version up to v35.1, any CATIA V5 version up to V5-6R2023."

## 6. Additional ThinkDesign Issues

### Native File Format Conversion (.e2, .e3)

**Issue**: Users need to open old ThinkDesign files (.e2, .e3) in other CAD systems like SolidWorks.
**Fix**: "You need to convert them in a compatible format. You must have a paid license of ThinkDesign. Convert .e3 files to STEP and .e2 files to DWG or DXF." Or contact a studio with ThinkDesign to convert the files.

### CATIA V4/V5 Direct Interface

**Issue**: "There is a direct interface from thinkdesign to CATIA V4 and V5. Don't go through neutral formats."
**Fix**: Use the direct CATIA interface instead of STEP/IGES. Contact DPT for interface settings. Direct interface gives better data quality.

### Format Version Support Updates

**Issue**: ThinkDesign 2023.1 SP2 adds support for Inventor 2024, Parasolid v35.1, CATIA V5-6R2023.
**Fix**: Update to 2023.1 SP2 or later for latest format support. Check the release notes for supported versions. Use TDXchange Reader for proprietary formats.

### Thickness Analysis Command

**Issue**: New thickness analysis command added in 2024.1.
**Fix**: Use the thickness analysis command for mold design. Analyze wall thickness of imported models. Verify thickness meets manufacturing requirements.

### 2D .d File Import

**Issue**: "Import of 2D *.d files" improvements in 2024.1.
**Fix**: Update to 2024.1 for improved .d file import. Check shared groups and other elements. Verify imported 2D data.

### Line Width from Color Map

**Issue**: "Apply the width of the lines defined in the color map using the new option Line Width / Colors" (2023.1 SP1).
**Fix**: Use the Line Width / Colors option. Requires ThinkDesign Printer installed. Configure color-to-width mapping.

### PDF Printer Option

**Issue**: "Choose the legacy converter behaviour using the new option Use virtual PDF printer 'ThinkDesign Printer'" (2023.1 SP1).
**Fix**: Use the virtual PDF printer for PDF export. Configure the ThinkDesign Printer. Use legacy converter behavior if needed.

## Best Practices

1. **Update to ThinkDesign 2024.1 SP2** — fixes STEP, IGES, normals, GBG, and .d import issues
2. **Use TDXchange Reader for proprietary formats** — better than neutral formats for CATIA, ProE, Parasolid
3. **Use direct CATIA V4/V5 interface** — avoid neutral format conversion quality loss
4. **Verify imported geometry after import** — check for missing spheres, inverted normals
5. **Convert .e2 to DWG and .e3 to STEP** — for sharing with non-ThinkDesign users
6. **Avoid GBG raster files if possible** — use TIFF, PNG, or JPG instead
7. **Ungroup shared groups before .d import** — workaround if SP2 not installed
8. **Check STEP file AP version** — AP203, AP214, AP242 have different support levels
9. **Use the thickness analysis command** — verify wall thickness for mold design
10. **Keep ThinkDesign updated** — each service pack fixes multiple import issues
