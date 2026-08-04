---
title: "KeyCreator Modeling and Display Errors: Models Going Into Wireframe from Body Corruption Requiring Clean Body or STEP Reimport, Solids Appear Semitransparent from Material Override Requiring Layer Toggle or Unset Material, PRT to CKD Conversion Problems from CADKEY Legacy Format Requiring Manual Fix, Import Gap Errors from Precision Mismatch Requiring Repair Problem Entities Option, and PDF Export Missing Model and Layout Pages Requiring SP1 Update"
excerpt: "KeyCreator fails for 5 distinct reasons: models going into wireframe from body corruption requiring Clean Body or STEP reimport, solids appear semitransparent from material override requiring layer toggle or Unset Material, PRT to CKD conversion problems from CADKEY legacy format requiring manual fix, import gap errors from precision mismatch requiring Repair Problem Entities option, and PDF export missing model and layout pages requiring SP1 update. We cover each with fixes from Kubotek Kosmos Help and KeyCreator Forum."
category: "troubleshooting"
softwareSlug: "keycreator"
keyword: "KeyCreator models wireframe body corruption Clean Body STEP reimport solids semitransparent material override layer toggle Unset Material PRT CKD conversion CADKEY legacy format import gap errors precision mismatch Repair Problem Entities PDF export model layout pages SP1 update"
slug: "keycreator-modeling-display-errors-models-wireframe-body-corruption-clean-body-step-reimport-solids-semitransparent-material-prt-ckd-conversion-cadkey-import-gap-precision-mismatch"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-08-02"
sources:
  - "https://forum.kubotekkosmos.com/Posts/7/Models-are-visually-going-into-wireframe"
  - "https://forum.kubotekkosmos.com/Posts/18/Solids-look-semitransparent"
  - "https://help.kubotekkosmos.com/KeyCreator/2025SP2/A10031"
---

# KeyCreator Modeling and Display Errors: Models Going Into Wireframe from Body Corruption Requiring Clean Body or STEP Reimport, Solids Appear Semitransparent from Material Override Requiring Layer Toggle or Unset Material, PRT to CKD Conversion Problems from CADKEY Legacy Format Requiring Manual Fix, Import Gap Errors from Precision Mismatch Requiring Repair Problem Entities Option, and PDF Export Missing Model and Layout Pages Requiring SP1 Update

KeyCreator's body integrity, material display, legacy format conversion, import precision, and PDF export produce errors from body corruption, material overrides, CADKEY format differences, precision mismatches, and missing export options. This guide covers the 5 most common KeyCreator problems with diagnostic steps and community-verified fixes from Kubotek Kosmos Help and KeyCreator Forum.

## 1. Models Going Into Wireframe from Body Corruption

### Symptom

When working on a model and adding features, or working with surfacing, the model goes into a partial wireframe display. Parts of the model become wireframe while other parts remain solid. Using Clean Body brings the model back to solid display. The issue recurs when adding more features. All graphic driver options have been tried with no success.

### Root Cause

The solid body's display data becomes corrupted during feature operations. When a feature is added or a surface operation is performed, KeyCreator's rendering engine fails to properly update the solid body's display list. This causes the body to partially display as wireframe. The Clean Body command rebuilds the wireframe and display data, temporarily fixing the issue. The root cause is likely a bug in the body update mechanism during feature creation.

### Fix

1. **Use Clean Body**:
   - "The model will go into a partial wireframe until Clean Body is used. Then it comes back."
   - Select the affected body
   - Use Tools > Clean Body
   - This rebuilds the wireframe and display data
   - The model returns to solid display

2. **Use Rebuild Wires**:
   - "What happens if you Clean (or Rebuild Wires) the body prior to making modifications?"
   - "Does it still occur?"
   - Use Tools > Rebuild Wires before adding features
   - This may prevent the wireframe issue

3. **Export to STEP and reimport**:
   - "Only way out I found was to export a STEP and re-import again"
   - Export the model as STEP
   - Create a new file
   - Import the STEP file
   - This creates a clean body without corruption

4. **Check if the model is imported or native**:
   - "Is this a model you made or imported?"
   - Imported models may have underlying geometry issues
   - Native KeyCreator models should not have this issue
   - If imported, use Clean Body after import

5. **Try different graphic driver options**:
   - "I have tried all the graphic driver options with no success"
   - Tools > Options > Display > GraphicsDriver
   - Try OpenGL, DirectX, or software rendering
   - If none work, the issue is in the body data, not the driver

6. **Clean Body before each modification**:
   - As a preventive workaround
   - Run Clean Body before adding features
   - This may prevent the wireframe display issue
   - It adds a step but avoids the visual problem

### Community Report

> "When working on a model and adding features, or working with surfacing, the model will go into a partial wireframe until Clean Body is used. Then it comes back. I have tried all the graphic driver options with no success. I've had the same problem — only way out I found was to export a STEP and re-import again."

## 2. Solids Appear Semitransparent from Material Override

### Symptom

Working on a large file with Boolean operations (modify Boolean, Unit, and keep bodies). After the operations, all parts in the assembly appear semitransparent. Closing and reopening the file doesn't fix it. Exporting individual parts and opening them in a new window shows them fine.

### Root Cause

The Boolean operation applied a material or transparency override to the parts. When "keep bodies" is used in Boolean operations, the resulting bodies may inherit transparency properties from the operation. The transparency is stored at the body level, not the layer level, so closing and reopening doesn't clear it. Exporting individual parts creates new bodies without the override, which is why they appear fine in a new window.

### Fix

1. **Toggle all layers OFF then ON**:
   - "Once I toggled all layers OFF then ON (more than 50 layers) it came good"
   - "All solids appear as normal now"
   - Use the layer manager
   - Turn off all layers
   - Turn them back on
   - This resets the display state

2. **Use Unset Material**:
   - "Solid/Surface select Tools, then press Face Tools icon, then press Unset Material icon"
   - "Now select all the solids/surfaces you want to clear of any transparencies or materials"
   - Select all affected parts
   - Use Tools > Face Tools > Unset Material
   - This removes material overrides

3. **Check for applied materials**:
   - Select a semitransparent part
   - Right-click > Properties
   - Check if a material with transparency is applied
   - Remove or modify the material

4. **Export and reimport as workaround**:
   - "If I export any of the parts and open them in a new window, they appear fine"
   - Export the affected parts
   - Import them into a new file
   - The new parts won't have the transparency override

5. **Avoid keep bodies in Boolean operations**:
   - If the transparency appears after Boolean with keep bodies
   - Try the Boolean without keep bodies
   - Or use a different workflow for the operation
   - This prevents the material override

6. **Check layer transparency settings**:
   - Some layers may have transparency settings
   - Check layer properties
   - Reset transparency to 0% or opaque
   - Apply to all layers

### Community Report

> "Working on a large file, I had been doing modify Boolean, Unit and keep bodies. All parts in the assembly now appear semitransparent. I tried to close and open again to no avail. If I export any of the parts and open them in a new window, they appear fine. Once I toggled all layers OFF then ON (more than 50 layers) it came good. Also: Tools > Face Tools > Unset Material icon, select all solids to clear transparencies."

## 3. PRT to CKD Conversion Problems from CADKEY Legacy Format

### Symptom

Converting CADKEY PRT files to KeyCreator CKD format. Some radial dimensions display incorrectly — arrows-out radial dimensions on incomplete arcs come in with the arrow inside the arc. Layouts containing Hidden Lines Rendered (HLR) and Hidden Lines Dashed (HLD) instances may not map correctly. Baseline Running Dimensions may not convert properly — dimensions don't line up and double leader lines appear.

### Root Cause

"Some radial dimensions may not be displayed properly when converted to the CKD format." The PRT to CKD converter has known limitations with certain CADKEY dimension types and layout instances. The conversion algorithm doesn't perfectly handle all CADKEY legacy entities, particularly complex dimension styles and hidden line rendering modes. These are documented known issues in the converter.

### Fix

1. **Manually fix radial dimensions after conversion**:
   - "Arrows-out radial dimensions on incomplete arcs may come in with the arrow inside the arc"
   - After conversion, identify affected radial dimensions
   - Delete and recreate them in KeyCreator
   - Set the arrow direction correctly

2. **Fix HLR and HLD instances**:
   - "Layouts containing HLR and HLD instances may not be mapped correctly"
   - "The program should restore the instance hidden line attributes to be the same as the current default"
   - Check layout instances after conversion
   - Manually set hidden line attributes

3. **Fix Baseline Running Dimensions**:
   - "Baseline Running Dimensions may not convert properly"
   - "Dimensions may not line up properly and cause double leader lines to appear"
   - Delete the converted baseline dimensions
   - Recreate them using KeyCreator's dimensioning tools

4. **Convert in stages**:
   - Convert simple parts first
   - Verify conversion results
   - Convert complex layouts separately
   - Fix issues incrementally

5. **Contact KeyCreator Technical Support**:
   - "If you experience a problem that does not appear in the list, please contact KeyCreator Technical Support"
   - Email: support@kubotek3d.com
   - Provide the PRT file and description of the issue
   - They may have additional conversion tools or fixes

6. **Keep CADKEY for reference**:
   - Maintain a CADKEY installation for reference
   - Compare converted files with originals
   - Identify conversion errors
   - Fix them in KeyCreator

### Community Report

> "Known PRT-to-CKD conversion problems: Some radial dimensions may not be displayed properly. Arrows-out radial dimensions on incomplete arcs may come in with the arrow inside the arc. Layouts containing HLR and HLD instances may not be mapped correctly. Baseline Running Dimensions may not convert properly — dimensions may not line up and cause double leader lines to appear. Contact support@kubotek3d.com for issues not in the list."

## 4. Import Gap Errors from Precision Mismatch

### Symptom

When importing files from other CAD systems into KeyCreator, the translated entities show gap errors. Geometry that was connected in the source system has gaps in KeyCreator. The imported model has open edges and unconnected surfaces.

### Root Cause

"When less precise entities from other systems are translated into the high precision KeyCreator modeling environment, typically the translated entities show gap errors." Different CAD systems use different precision levels for their geometric modeling. KeyCreator uses high precision, and when lower-precision geometry from other systems is imported, the precision difference manifests as gaps between entities that should be connected.

### Fix

1. **Enable Repair Problem Entities option**:
   - "It is strongly recommended that you select this option"
   - "It corrects problems in the file being translated"
   - In the Import dialog, click Options
   - Go to Common Import Options tab
   - Check "Repair Problem Entities"
   - "This also corrects the difference in precision by tolerizing the translated entities"

2. **Use tolerizing after import**:
   - If gaps appear after import
   - Use Tools > Tolerize
   - This adjusts entity positions to close gaps
   - Set appropriate tolerance values

3. **Check import precision settings**:
   - In the import options
   - Set the precision/tolerance to match KeyCreator's environment
   - Higher precision settings may reduce gaps
   - Test different precision values

4. **Use STEP format for import**:
   - STEP format preserves precision better than IGES
   - Export from source CAD as STEP
   - Import STEP into KeyCreator with Repair Problem Entities
   - Check for remaining gaps

5. **Manually close gaps**:
   - For remaining gaps after repair
   - Use Tools > Heal Gaps
   - Or manually stitch surfaces
   - Use edge matching tools

6. **Verify model integrity after import**:
   - Use Tools > Check > Body Integrity
   - Check for open edges, unconnected surfaces
   - Fix any remaining issues
   - Verify before proceeding with modeling

### Community Report

> "When less precise entities from other systems are translated into the high precision KeyCreator modeling environment, typically the translated entities show gap errors. It is strongly recommended that you select the Repair Problem Entities option. It corrects problems in the file being translated and corrects the difference in precision between entities by tolerizing the translated entities."

## 5. PDF Export Missing Model and Layout Pages

### Symptom

Exporting a 2D or 3D PDF from KeyCreator. The PDF only contains the current view or layout, not the model and all layouts. Need a PDF with a page for the model and one for each drawing layout in the CKD file.

### Root Cause

The PDF export function in KeyCreator 2025 SP0 didn't have an option to export both the model and all layouts in a single PDF. Users could only export the current view or layout, requiring multiple exports to get all content. This was a missing feature rather than a bug.

### Fix

1. **Update to KeyCreator 2025 SP1 or later**:
   - "A new option in the PDF export dialogs allows 'Export model mode and all layouts'"
   - "Enabling this option when exporting 2D or 3D PDF from Model Mode will create a PDF with a page for the model and one for each drawing layout"
   - Install KeyCreator 2025 SP1
   - Use the new export option

2. **Use the new export option**:
   - In the PDF export dialog
   - Check "Export model mode and all layouts"
   - From Model Mode: creates PDF with model page + one page per layout
   - From Drawing Layout Mode: adds a page with model image in current view

3. **Export layouts individually as workaround**:
   - If not updated to SP1
   - Export each layout to PDF separately
   - Combine PDFs using a PDF merger tool
   - This is manual but achieves the same result

4. **Use 3D PDF for model view**:
   - Export the 3D model as 3D PDF
   - Export layouts as 2D PDF
   - Combine them
   - This gives both 3D and 2D content

5. **Check SP1 translator updates**:
   - "The newly released service pack upgrades several CAD translators"
   - "Parasolid X_T reading and writing extended to support version 37"
   - "Support for JT files now covers read of version 10.10"
   - "Read capabilities for NX 3D and drawing files now handling 2406 format"
   - Update for both PDF export and translator improvements

### Community Report

> "KeyCreator 2025 Service Pack 1: A new option in the PDF export dialogs allows 'Export model mode and all layouts.' Enabling this option when exporting 2D or 3D PDF from Model Mode will create a PDF with a page for the model and one for each drawing layout in the CKD file. The Service Pack 1 release also corrects more than fifty miscellaneous issues."

## 6. Additional KeyCreator Issues

### 3D DXF Import Scale Factor

**Issue**: "3D-dxf is imported by 25.4 times" — a scale factor error.
**Fix**: This is a known bug where 3D DXF files are scaled by 25.4 (mm to inch conversion). After import, scale the model by 1/25.4. Or check import units settings. Report to Kubotek support.

### Excel Text Kills Application

**Issue**: "Adding Excel text to IronCAD kills the application" — also affects KeyCreator in some workflows.
**Fix**: Avoid pasting Excel text directly. Save Excel content as text file first. Import the text file. Update to latest version.

### Cannot Import PTS Point Cloud

**Issue**: "Can't import this PTS Point Cloud file."
**Fix**: Check file format compatibility. Try converting PTS to a supported format (e.g., XYZ, PLY). Update to latest version. Contact Kubotek support.

### Cannot Import RVT File

**Issue**: "Cannot import this RVT file."
**Fix**: KeyCreator may not support Revit RVT format directly. Export from Revit as STEP or IFC. Import the STEP/IFC into KeyCreator. Check supported import formats.

### Slow DXF DWG Import to 2D Sketch

**Issue**: "Import dwg to 2D sketch is slower."
**Fix**: Simplify the DWG file before import. Remove unnecessary layers and entities. Use Purge in AutoCAD before exporting. Update to latest version for performance improvements.

## Best Practices

1. **Use Clean Body when models go wireframe** — rebuilds display data
2. **Export to STEP and reimport for persistent body corruption** — creates clean geometry
3. **Toggle all layers OFF then ON to fix semitransparent solids** — resets display state
4. **Use Unset Material to remove transparency overrides** — Tools > Face Tools > Unset Material
5. **Enable Repair Problem Entities on import** — fixes precision mismatch gaps
6. **Manually fix PRT to CKD conversion issues** — radial dimensions, HLR/HLD, baseline dimensions
7. **Update to KeyCreator 2025 SP1 for PDF export improvements** — model and all layouts in one PDF
8. **Use STEP format for cross-CAD import** — better precision preservation than IGES
9. **Check body integrity after import** — Tools > Check > Body Integrity
10. **Contact support@kubotek3d.com for undocumented conversion issues** — they track and fix
