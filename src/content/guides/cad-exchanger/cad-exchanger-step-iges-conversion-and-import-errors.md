---
title: "CAD Exchanger STEP IGES Conversion and Import Errors"
excerpt: "CAD Exchanger STEP IGES Conversion and Import Errors: symptoms, root causes, and step-by-step fixes, verified against CAD Exchanger docs and PrePoMax Forum."
category: "troubleshooting"
softwareSlug: "cad-exchanger"
keyword: "CAD Exchanger IGES B-Rep edge connectivity inconsistent orientations STEP format split periodic surfaces defeaturing disable round-off errors text format precision loss disappearing compound parts IGES shell import STEP conversion AutoCAD STEP export entity cannot be converted Inventor Fusion 360 intermediate processing"
slug: "cad-exchanger-step-iges-conversion-and-import-errors"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-07-31"
sources:
  - "https://cadexchanger.com/step-to-iges/"
  - "https://prepomax.discourse.group/t/error-importing-step-and-iges-files/2352"
  - "https://prepomax.discourse.group/t/disappearing-compound-part/2105"
---

# CAD Exchanger STEP IGES Conversion and Import Errors: IGES B-Rep Edge Connectivity Limitations Causing Inconsistent Orientations Requiring STEP Format Instead, Split Periodic Surfaces Option Breaking Defeaturing Requiring Disable Before Import, STEP File Round-Off Errors from Text Format Accumulating Precision Loss Requiring Binary or Tolerant Import, Disappearing Compound Parts from IGES Shell Import Requiring STEP Conversion, and AutoCAD STEP Export Entity Cannot Be Converted Requiring Inventor or Fusion 360 Intermediate Processing

CAD Exchanger's IGES limitations, surface splitting, precision handling, compound creation, and AutoCAD STEP export produce errors from format constraints, import options, numerical precision, and entity compatibility. This guide covers the 5 most common CAD Exchanger problems with diagnostic steps and community-verified fixes from CAD Exchanger docs and PrePoMax Forum.

## 1. IGES B-Rep Edge Connectivity Limitations Causing Inconsistent Orientations

### Symptom

Importing an IGES file into CAD Exchanger. The model imports but has topology issues — edges have inconsistent orientations. B-Rep geometry is not fully preserved. Downstream operations like Boolean cuts or feature recognition fail on the imported model.

### Root Cause

"The IGES format has some limitations when it comes to fully representing B-Rep geometry. While it can effectively preserve basic geometric information like points, curves, and surfaces, there are difficulties with edge connectivity information. Most CAD writers use the older and limited capabilities of representing B-Rep through bounded and trimmed surface entities. These entities cannot contain comprehensive information about the surface topology of bodies. As a result, models written in this form often have inconsistent edge orientations."

### Fix

1. **Use STEP format instead of IGES**:
   - "Newer formats, such as STEP, have been developed to support the inclusion and preservation of PMI data"
   - "These formats provide dedicated mechanisms to store and communicate PMI information"
   - STEP preserves B-Rep topology including edge connectivity
   - Always prefer STEP over IGES for B-Rep models

2. **Convert IGES to STEP before import**:
   - Use CAD Exchanger to convert IGES to STEP
   - Import the STEP file for better topology preservation
   - Or use FreeCAD to convert: import IGES, export as STEP
   - This intermediate conversion can fix some topology issues

3. **Use CAD Exchanger's IGES V2 engine**:
   - "CAD Exchanger 3.4.1 delivered the last piece in the IGES V2 puzzle"
   - The V2 IGES engine has improved conversion drivers
   - Ensure you're using CAD Exchanger 3.4.1 or later
   - The V1 engine is phased out

4. **Check for PMI data loss**:
   - "The IGES format does not have a standardized way to represent or store PMI data"
   - "When exporting a CAD model with PMI to an IGES file, this valuable information is typically lost"
   - Use STEP to preserve PMI data
   - IGES will lose all PMI information

5. **Verify model after import**:
   - After importing IGES, check the model topology
   - Use CAD Exchanger's validation tools
   - Look for inconsistent edge orientations
   - Reimport as STEP if issues are found

### Community Report

> "The IGES format has some limitations when it comes to fully representing B-Rep geometry. There are difficulties with edge connectivity information. Most CAD writers use bounded and trimmed surface entities which cannot contain comprehensive information about surface topology. Models written in this form often have inconsistent edge orientations. Newer formats, such as STEP, have been developed to support preservation of PMI data."

## 2. Split Periodic Surfaces Option Breaking Defeaturing

### Symptom

Importing STEP files from manufacturer websites. After import, defeature operations (deleting fillets, chamfers, holes) don't work. Even simple fillets and chamfers can't be deleted. The same STEP file imported without the split periodic surfaces option allows defeaturing normally.

### Root Cause

"There may be problems when using the 'split periodic surfaces' option. Disable this option and it should work." The split periodic surfaces option splits closed periodic surfaces (like cylinders) into two open surfaces. This changes the topology in a way that breaks the defeature algorithm — it can't recognize the fillet/chamfer as a removable feature because the surface boundaries have been altered.

### Fix

1. **Disable split periodic surfaces option**:
   - "Disable this option and it should work"
   - In the import settings, uncheck "Split periodic surfaces"
   - Reimport the STEP file
   - Defeaturing should work correctly

2. **Split periodic surfaces in source CAD**:
   - "I did not have problems with my models since I use Solidworks"
   - "And export the STEP files with the option to split periodic surfaces before exportation"
   - If you control the source CAD
   - Split surfaces during export instead of during import
   - This preserves defeaturing capability in the receiving software

3. **Make split a post-import feature**:
   - "Subsequently splitting the surfaces with a separate feature would be the better option"
   - Import without splitting
   - Perform defeature operations first
   - Split surfaces after defeaturing if needed

4. **Test with and without the option**:
   - Import the same file with and without splitting
   - Compare defeature results
   - Use the setting that works for your workflow
   - Default to disabled for better defeaturing

5. **Use CAD Exchanger for conversion**:
   - Use CAD Exchanger to convert the STEP file
   - Export without split periodic surfaces
   - Reimport the converted file
   - This may fix the defeature issue

### Community Report

> "There may be problems when using the 'split periodic surfaces' option. Disable this option and it should work. All imported step files could no longer be defeatured when the split periodic faces option was active — simplest fillets, chamfers and holes could not be deleted. Subsequently splitting the surfaces with a separate feature after defeaturing would be the better option."

## 3. STEP File Round-Off Errors from Text Format Precision Loss

### Symptom

STEP files imported into CAD Exchanger show small geometric discrepancies. Dimensions are slightly off. Curves and surfaces have minor deviations from the original model. The errors are small but accumulate in complex models.

### Root Cause

"The majority of STEP files are written as text files. While it allows for human readability and easy interpretation, it can introduce potential round-off errors in numerical values. These rounding errors may be negligible in most cases, but they can accumulate and impact the accuracy of the model, especially in situations where high precision is crucial."

### Fix

1. **Use binary STEP format**:
   - If the source CAD supports binary STEP export
   - Use binary format to avoid text round-off
   - Binary preserves full floating-point precision
   - Check the source CAD's STEP export options

2. **Increase precision in source CAD**:
   - In the source CAD system
   - Set the maximum precision for STEP export
   - Use the highest available decimal places
   - This minimizes round-off in the text file

3. **Use CAD Exchanger's tolerance settings**:
   - CAD Exchanger has import tolerance settings
   - Increase the tolerance to accommodate round-off
   - This allows the importer to merge nearly-coincident points
   - Set tolerance appropriate for your model scale

4. **Validate imported geometry**:
   - After import, compare key dimensions with the original
   - Use CAD Exchanger's measurement tools
   - If discrepancies are within tolerance, proceed
   - If not, re-export from source with higher precision

5. **Use STEP AP242 for best precision**:
   - STEP AP242 is the latest application protocol
   - It supports higher precision and additional data
   - Use AP242 if both source and target support it
   - It's more robust than AP203 or AP214

### Community Report

> "The majority of STEP files are written as text files. This can introduce potential round-off errors in numerical values. These rounding errors may be negligible in most cases, but they can accumulate and impact the accuracy of the model, especially where high precision is crucial."

## 4. Disappearing Compound Parts from IGES Shell Import

### Symptom

Importing an IGES file containing shell elements (surface models). Creating a compound part from multiple shell elements. After creating the compound, it's not visible — it disappears. This prevents setting up meshes or further operations on the compound.

### Root Cause

"Try with a .step file, there seems to be some issue with .igs in this case." IGES shell imports have coordinate tolerance issues that prevent compound creation. The shell elements from IGES have slightly inconsistent coordinates that cause the compound algorithm to fail silently. STEP files don't have this issue because they preserve topology better.

### Fix

1. **Use STEP format instead of IGES**:
   - "Try with a .step file, there seems to be some issue with .igs in this case"
   - "I created a step file using FreeCAD which has resolved the issue"
   - Convert the IGES to STEP before import
   - Use FreeCAD, CAD Exchanger, or another converter

2. **Export from PrePoMax to STEP and reimport**:
   - "I tried exporting all the parts into step files using PrePoMax and then importing them back and creating the compound, and it worked"
   - Export the IGES shells as STEP from within the software
   - Reimport the STEP files
   - Create the compound from the STEP-imported parts

3. **Convert IGES to STEP internally**:
   - "I do simple export an Iges file successfully loaded to Step file by feature available, then re-imported"
   - Use the software's internal conversion feature
   - Export the imported IGES as STEP
   - Reimport the STEP file

4. **Use solid models instead of shells**:
   - "A solid model (closed surface) not shown any issue related"
   - If possible, use solid models instead of shell elements
   - Solid models import more reliably from IGES
   - The compound issue is specific to shell elements from IGES

5. **Use CAD Exchanger for IGES to STEP conversion**:
   - Import the IGES into CAD Exchanger
   - Export as STEP
   - Import the STEP into the target software
   - This leverages CAD Exchanger's V2 IGES engine

### Community Report

> "I am trying to create a compound part of multiple shell elements. When I select all the shells and create the compound, it is not visible after being created. Try with a .step file, there seems to be some issue with .igs in this case. I created a step file using FreeCAD which has resolved the issue. I tried exporting all the parts into step files and then importing them back and creating the compound, and it worked."

## 5. AutoCAD STEP Export Entity Cannot Be Converted Requiring Intermediate Processing

### Symptom

Using AutoCAD 2024 to process a 3D solid model. Attempting to export as STEP using the EXPORT command. System prompts: "Entity cannot be converted." Export fails. Tried saving as lower version (2018), using RECORD to repair, CONVERTTO3DSOLID, and CHECK command — none work.

### Root Cause

AutoCAD's STEP export has limited entity support. Some 3D entities created in AutoCAD can't be directly converted to STEP format. AutoCAD's 3D modeling tools create entities that don't map cleanly to STEP's B-Rep representation. The EXPORT command in AutoCAD is not a full-featured STEP exporter.

### Fix

1. **Use Inventor or Fusion 360 for intermediate processing**:
   - "Is it recommended to use Inventor/Fusion360 for intermediate processing? — Yes, It's recommended"
   - Import the AutoCAD DWG into Inventor or Fusion 360
   - Use Inventor/Fusion 360's STEP export
   - These tools have proper STEP export engines

2. **Use AUDIT and EXPORTTOAUTOCAD**:
   - "Would you try to AUDIT your drawing then SAVE it"
   - "Then try to use EXPORTTOAUTOCAD command and see if any changes"
   - AUDIT fixes drawing errors
   - EXPORTTOAUTOCAD creates a clean drawing

3. **Use CONVERTTO3DSOLID on surfaces**:
   - "Attempt to convert some surface entities using CONVERTTO3DSOLID"
   - Convert surface entities to 3D solids
   - STEP export works better with solids than surfaces
   - Not all surfaces can be converted

4. **Use CAD Exchanger for DWG to STEP**:
   - Import the DWG into CAD Exchanger
   - Export as STEP
   - CAD Exchanger handles the conversion
   - This bypasses AutoCAD's limited STEP export

5. **Check for incompatible entities**:
   - "Are there any entities that must meet certain requirements (such as complete enclosure, smooth multi-segment surfaces)?"
   - STEP requires valid B-Rep solids
   - Surfaces must be completely enclosed
   - Remove or fix non-manifold geometry

6. **Use CHECK command to verify**:
   - "Using the CHECK command to check the model, no errors were found"
   - Even if CHECK passes, the model may have entities
   - That AutoCAD can't convert to STEP
   - Use Inventor for a more thorough check

### Community Report

> "AutoCAD 2024 STEP export failed with prompt 'Entity cannot be converted.' Is it recommended to use Inventor/Fusion360 for intermediate processing? Yes, it's recommended. Would you try to AUDIT your drawing then SAVE it then try to use EXPORTTOAUTOCAD command and see if any changes."

## 6. Additional CAD Exchanger Issues

### IGES Version V1 vs V2

**Issue**: Older CAD Exchanger versions use the V1 IGES engine with known limitations.
**Fix**: "CAD Exchanger 3.4.1 delivered the last piece in the IGES V2 puzzle. The V1 will be phased out." Update to CAD Exchanger 3.4.1 or later for the improved IGES engine.

### Large STEP File Sizes

**Issue**: "Due to their comprehensive nature, STEP files tend to contain a large amount of data, resulting in larger file sizes."
**Fix**: Use STEP compression if available. Simplify the model before export. Remove unnecessary features and details. Use binary STEP if supported.

### PMI Data Loss in IGES

**Issue**: "The IGES format does not have a standardized way to represent or store PMI data."
**Fix**: Use STEP AP242 for PMI preservation. IGES will lose all PMI data. If PMI is critical, never use IGES.

### Assembly Structure in IGES

**Issue**: IGES assembly structure may not import correctly.
**Fix**: "CAD Exchanger can import IGES format files up to version 5.3. Support includes assembly structure, names, user-defined properties, colors, layers." Use CAD Exchanger for IGES assembly import. Verify assembly structure after import.

## Best Practices

1. **Always prefer STEP over IGES for B-Rep models** — STEP preserves topology
2. **Disable split periodic surfaces for defeature workflows** — enables feature removal
3. **Split periodic surfaces in source CAD before export** — preserves defeaturing in target
4. **Use binary STEP for high precision** — avoids text round-off errors
5. **Use STEP AP242 for PMI preservation** — latest protocol with best data retention
6. **Convert IGES to STEP before creating compounds** — prevents disappearing parts
7. **Use Inventor or Fusion 360 for AutoCAD STEP export** — AutoCAD's export is limited
8. **Run AUDIT and EXPORTTOAUTOCAD before STEP export** — cleans the drawing
9. **Use CAD Exchanger V2 IGES engine (3.4.1+)** — improved conversion drivers
10. **Validate imported geometry against source dimensions** — catch precision issues
