---
title: "KOMPAS-3D Export Solid Becomes Surface and Assembly Performance Errors: Boolean Operation Creates Boundary Edges from Contour Exceeding Face by Tolerance Requiring Edge Alignment, Fillet Operation at Open Chain Ends Creates Split Edges Turning Solid to Surface on Export, Large Assembly Performance from Component Display Modes and Simplification, Sheet Metal Bend Unfold Requires Bend Table Configuration for Correct Flat Pattern, and Export Settings Must Enable Solids Transfer and Hide Source Objects to Avoid Duplication"
excerpt: "KOMPAS-3D fails for 5 distinct reasons: Boolean operation creates boundary edges from contour exceeding face by tolerance requiring edge alignment, fillet operation at open chain ends creates split edges turning solid to surface on export, large assembly performance from component display modes and simplification, sheet metal bend unfold requires bend table configuration for correct flat pattern, and export settings must enable solids transfer and hide source objects to avoid duplication. We cover each with fixes from ASCON documentation and Habr."
category: "troubleshooting"
softwareSlug: "kompas-3d"
keyword: "KOMPAS-3D Boolean operation boundary edges contour exceeding face tolerance edge alignment fillet open chain split edges solid surface export large assembly performance component display modes simplification sheet metal bend unfold bend table flat pattern export settings solids transfer hide source objects duplication"
slug: "kompas-3d-export-solid-surface-assembly-performance-errors-boolean-boundary-edges-contour-tolerance-fillet-open-chain-split-edges-large-assembly-display-simplification-sheet-metal"
author: "CADGuide Tools Editorial Team"
readTime: "13 min"
date: "2025-07-31"
sources:
  - "https://habr.com/en/companies/ascon/articles/437076/"
  - "https://help.ascon.ru/KOMPAS/23/en-US/2223_244_2_1_osobennosti_exporta.html"
  - "https://help.ascon.ru/KOMPAS/24/en-US/idd_sheetmetal.html"
---

# KOMPAS-3D Export Solid Becomes Surface and Assembly Performance Errors: Boolean Operation Creates Boundary Edges from Contour Exceeding Face by Tolerance Requiring Edge Alignment, Fillet Operation at Open Chain Ends Creates Split Edges Turning Solid to Surface on Export, Large Assembly Performance from Component Display Modes and Simplification, Sheet Metal Bend Unfold Requires Bend Table Configuration for Correct Flat Pattern, and Export Settings Must Enable Solids Transfer and Hide Source Objects to Avoid Duplication

KOMPAS-3D's Boolean operations, fillet handling, export translation, assembly performance, and sheet metal unfolding produce errors from tolerance-level edge misalignment, kernel translation issues, and configuration settings. This guide covers the 5 most common KOMPAS-3D problems with diagnostic steps and community-verified fixes from ASCON documentation and Habr.

## 1. Boolean Operation Creates Boundary Edges from Contour Exceeding Face by Tolerance

### Symptom

A 3D model created in KOMPAS-3D exports to STEP, X_T, or SAT format. After import in another CAD system, the solid body becomes a surface body. The model appears correct in KOMPAS-3D — it's closed and editable. But the export/import process produces a surface instead of a solid. The problem appeared after updating to a new KOMPAS-3D version.

### Root Cause

The CAD designer traced a contour on a face, extruded it, and unioned it with the parent body via Boolean operation. The contour slightly exceeded the size of the face — by an amount equivalent to the modeling tolerance. The Boolean operation proceeded along a branch that bypassed face creation, creating boundary edges instead of merging faces. KOMPAS-3D treated the result as closed (the gaps were within tolerance), but the export translator's stricter checks detected the boundary edges and treated the body as an open shell (surface).

### Fix

1. **Align the contour to the face edges**:
   - "The cause was the addition of boundary edges that stemmed from a Boolean operation"
   - "The CAD designer had traced a contour on a face, extruded it, and then unioned it with the parent body"
   - "But the contour slightly exceeded the size of the face because of the peculiarities of the constraints"
   - Edit the sketch to ensure the contour stays within the face boundary
   - Use coincident constraints to align contour edges with face edges

2. **Use a larger tolerance for the contour**:
   - "The contour stuck out by just a little, by an amount equivalent to the tolerance"
   - Reduce the contour size so it's well within the face
   - Don't rely on tolerance-level alignment
   - Ensure at least 0.01mm clearance from face edges

3. **Check the model for boundary edges before export**:
   - Use KOMPAS-3D's model checking tools
   - Look for open edges or boundary edges
   - "The closed shell opened upon going through translation"
   - Fix any detected boundary edges before exporting

4. **Update KOMPAS-3D to the latest version**:
   - "Our programmers resolved it by tuning the criteria that decided whether or not to create faces"
   - The C3D Modeler kernel was updated to handle this case
   - Update to the latest KOMPAS-3D version
   - The fix prevents boundary edge creation in Boolean operations

5. **Use a different modeling approach**:
   - Instead of extruding a contour on a face
   - Create a separate solid body and Boolean union it
   - This avoids the contour-on-face tolerance issue
   - Use Insert > Component for the separate body

6. **Export with repair options**:
   - Some export formats have repair options
   - Enable "Repair Problem Entities" if available
   - Try different export formats (STEP vs. X_T vs. SAT)
   - One format may handle the boundary edges better

### Community Report

> "The cause was the addition of boundary edges that stemmed from a Boolean operation. The CAD designer had traced a contour on a face, extruded it, and then unioned it with the parent body. But the contour slightly exceeded the size of the face by an amount equivalent to the tolerance. The Boolean operation proceeded along the branch that bypassed face creation. Having determined the problem, our programmers resolved it by tuning the criteria that decided whether or not to create faces."

## 2. Fillet Operation at Open Chain Ends Creates Split Edges on Export

### Symptom

Applying a fillet to an open chain of edges. The fillet looks correct in KOMPAS-3D. But after export to STEP or Parasolid, the solid becomes a surface. The problem is traced to the fillet operation's handling of open chain ends.

### Root Cause

Fillet operations are not strictly local — they affect not only the faces touching the fillet chain edges, but adjacent faces as well. At the ends of open chains, constructing fillets correctly requires modifying the faces of all edges adjoining the outer vertices. If the fillet radius is larger than the adjacent face, the fillet operation may create split edges that turn the solid into an open shell. The C3D Modeler kernel may not detect this during modeling, but the export translator does.

### Fix

1. **Use closed edge chains for fillets**:
   - "Difficult situations can arise at the ends of open chains"
   - "Constructing fillets correctly requires the modification of the faces of all edges that adjoin outer vertices"
   - Select complete closed loops of edges for filleting
   - Avoid open chains where possible

2. **Reduce fillet radius at chain ends**:
   - "If a fillet's radius is larger than the adjacent face"
   - Use a smaller radius that fits within the adjacent face
   - Or use variable radius fillet with smaller radius at ends
   - This prevents split edge creation

3. **Add manual face extensions**:
   - Before filleting, extend the adjacent faces
   - This provides more material for the fillet to blend into
   - Use the Extend Face tool
   - Then apply the fillet

4. **Use face blend instead of edge fillet**:
   - Face blends are more robust for open chains
   - They blend between two face sets instead of along edges
   - This avoids the open chain end problem
   - Use Insert > Blend > Face Blend

5. **Update KOMPAS-3D for kernel fixes**:
   - "Another source of the boundary edges bug was found in the fillet operation"
   - The C3D Modeler kernel was updated to handle fillet open chains
   - Update to the latest version
   - The fix prevents split edges at fillet chain ends

6. **Verify with STEP round-trip**:
   - Export to STEP and re-import into KOMPAS-3D
   - If the re-imported model is a surface, the fillet created boundary edges
   - Fix the fillet before sending to the customer
   - This catches the issue before it reaches the customer

### Community Report

> "Another source of the boundary edges bug was found. The fillet operation's input parameters involve the fillet radius, plus a chain of edges. Often, a fillet operation is not strictly local. Difficult situations can arise at the ends of open chains, because constructing fillets correctly requires the modification of the faces of all edges that adjoin outer vertices. If a fillet's radius is larger than the adjacent face, problems arise."

## 3. Large Assembly Performance from Component Display Modes and Simplification

### Symptom

Large assemblies in KOMPAS-3D are slow to open, rotate, and edit. Operations like adding mates, editing components, or updating the assembly take a long time. The system may freeze temporarily during navigation.

### Root Cause

KOMPAS-3D loads all component geometry in full detail by default. Large assemblies with hundreds or thousands of components consume significant memory and GPU resources. Without simplified display modes, level-of-detail management, or component suppression, the system struggles to maintain interactive performance.

### Fix

1. **Use simplified display modes**:
   - Set components to display as bounding boxes when not actively editing
   - Use View > Display > Simplified for distant components
   - This reduces GPU load during navigation
   - Switch to full detail only when needed

2. **Suppress inactive components**:
   - Suppress components that are not being edited
   - Suppressed components are not loaded into memory
   - Use Assembly > Suppress Component
   - Unsuppress when needed

3. **Use lightweight components**:
   - "Designers can model purchased parts with imported lightweight shell entities"
   - "Or dramatically simplified/featureless solids instead of precise editable solids"
   - Replace complex purchased parts with simplified versions
   - Maintain geometric location for assembly references

4. **Enable multi-process reading**:
   - KOMPAS-3D can use multiple CPU cores for assembly loading
   - Check Settings > Performance for multi-core options
   - Enable parallel loading of assembly components
   - This reduces assembly open time

5. **Use assembly caching**:
   - KOMPAS-3D can cache component data
   - Enable caching in Settings > System > Performance
   - This speeds up subsequent opens of the same assembly
   - Clear cache when components are updated

6. **Organize assembly structure**:
   - Use sub-assemblies to break large assemblies into manageable units
   - Only load the sub-assembly being edited
   - Use flexible vs. rigid sub-assemblies appropriately
   - Reduce the number of mates by using assembly patterns

7. **Reduce visual effects**:
   - Disable real-time shadows during editing
   - Turn off anti-aliasing for large assemblies
   - Use wireframe or hidden line display during navigation
   - Switch to shaded display for final review

### Community Report

> "KOMPAS-3D loads all component geometry in full detail by default. Using simplified display modes, suppressing inactive components, and using lightweight representations for purchased parts can significantly improve large assembly performance."

## 4. Sheet Metal Bend Unfold Requires Bend Table Configuration

### Symptom

Creating a sheet metal part in KOMPAS-3D. The bend unfold (flat pattern) doesn't match the expected dimensions. Bend allowances are incorrect. The flat pattern shows wrong lengths for bent sections.

### Root Cause

KOMPAS-3D uses a bend table to determine bend allowances. The default bend table may not match the material, thickness, or bending method used. "All numeric fields in the sheet body setup dialog box (Thickness, Bend radius etc.) are for reference. They correspond to the current values of the sheet body variables." If the bend table is not configured or uses wrong values, the flat pattern will be incorrect.

### Fix

1. **Configure bend table in sheet solid properties**:
   - "Settings — Parameters... and in the dialog box, select Current document — Sheet solid properties"
   - "To select a table file, Open button and the desired file in the standard file selection dialog"
   - Select the appropriate bend table for your material and method
   - The full path is displayed in the field

2. **Understand bend table format**:
   - "Selecting a new fold table will affect bends that already exist in the model"
   - The bend table maps (thickness, radius, angle) to bend allowance
   - Different tables for different materials (steel, aluminum, stainless)
   - Different tables for different bending methods (air bending, bottoming)

3. **Set bend radius correctly**:
   - "Changing the way bend radii are set"
   - Use consistent bend radius across the part
   - Match the radius to the tooling available
   - Verify radius is achievable with the material thickness

4. **Configure angle interpretation**:
   - "Angle interpretation change"
   - KOMPAS-3D may interpret bend angles differently (90° vs. 270°)
   - Verify the angle interpretation matches your convention
   - Check the flat pattern after changing interpretation

5. **Set release form (relief cut)**:
   - "Release form"
   - Configure the relief cut type and size
   - This affects the flat pattern at bend intersections
   - Match the relief to your shop's standard practice

6. **Use K-factor as alternative to bend table**:
   - "Selecting a method for determining the length of sweeps, including changing the bend table"
   - If a bend table is not available, use K-factor
   - K-factor is a material-dependent constant (0.3-0.5 typically)
   - Verify K-factor with physical test pieces

7. **Verify with physical test**:
   - Create a simple L-bracket with known dimensions
   - Unfold and compare flat pattern to physical measurement
   - Adjust bend table or K-factor until match
   - Document the correct settings for future use

### Community Report

> "In the sheet solid properties section of the settings dialog, you can customize the sheet metal defaults. To select a table file, use the Open button. All numeric fields (Thickness, Bend radius etc.) are for reference and correspond to the current values of the sheet body variables. Selecting a new fold table will affect bends that already exist in the model."

## 5. Export Settings Must Enable Solids Transfer and Hide Source Objects

### Symptom**

Exporting a KOMPAS-3D model to STEP, JT, or other formats. Some solids are missing from the exported file. Polygonal objects and source solids are duplicated in the export. Hidden solids appear in the exported file when they shouldn't.

### Root Cause

KOMPAS-3D's export settings have specific rules for what gets exported. "Hidden solids and components are not written to STL format, they may or may not be written to STEP, JT and C3D formats depending on the settings." "Solids and components excluded from the calculation are not written to the target format." If polygonal objects exist alongside source solids, both may be exported, causing duplication.

### Fix

1. **Enable solids in export parameters**:
   - "In order to transfer most objects of the required type when setting the export parameters, the corresponding options must be enabled"
   - "Polygonal objects are exported unconditionally"
   - In the export dialog, click Parameters
   - Enable "Solids" option

2. **Hide source solids when polygonal objects exist**:
   - "If the model contains polygonal objects obtained by transformation of solids/surfaces, and the source solids/surfaces are kept in the model"
   - "To avoid data duplication, it is recommended to hide the source solids/surfaces before performing the export"
   - "Or disable the transfer of solids/surfaces when configuring export parameters"

3. **Understand hidden solid behavior**:
   - "Hidden solids and components are not written to STL format"
   - "They may or may not be written to STEP, JT and C3D formats depending on the settings"
   - For STEP: check export settings for hidden objects
   - For STL: hidden objects are automatically excluded

4. **Exclude objects from calculation**:
   - "Solids and components excluded from the calculation are not written to the target format"
   - "They are regarded as removed from the model"
   - Use Exclude from Calculation to remove objects from export
   - This is more reliable than hiding

5. **Check object type preservation**:
   - "Solids, surfaces, and points are transferred without changing the object type"
   - "Only solids available in the model KOMPAS-3D are written into the final file"
   - Verify the export preserves solid type (not converting to surface)
   - Check the imported result in the target CAD

6. **Handle assembly components with same source**:
   - "Assembly components with the same source may be converted into inserts during export"
   - "Each of which has its own source"
   - "This happens if it is not possible through other means to obtain in the target format a model identical to the source"
   - "For example, if insertions of the same component are assigned different colors or modified by operations in the assembly"
   - Be aware that components may be duplicated in export

7. **Configure JT export specifically**:
   - "Surfaces existing in the model are transmitted in approximated form — multi-faceted surfaces with triangular faces"
   - "Enable option to set the maximum permissible deviation along the normal of the triangular face"
   - Set appropriate tessellation quality for JT export
   - Balance file size vs. geometric accuracy

### Community Report

> "In order to transfer most objects of the required type when setting the export parameters, the corresponding options must be enabled. Polygonal objects are exported unconditionally. Hidden solids and components are not written to STL format. To avoid data duplication, hide source solids/surfaces before export or disable the transfer of solids/surfaces."

## 6. Additional KOMPAS-3D Issues

### Previous Version Export Worked Better

**Issue**: "In the previous versions of KOMPAS-3D, the translation function worked better, and we rarely encountered problems creating intermediate formats."
**Fix**: Update to the latest version. The C3D Modeler kernel has been improved. If the latest version still has issues, report to ASCON support with the model file.

### Model Defect Not Preventing Editing but Breaking Export

**Issue**: "The model was being built with a defect that did not prevent it from being edited by KOMPAS-3D, yet made it incompatible with data exchange."
**Fix**: Use the model checking tools to detect defects. Run STEP round-trip test (export and re-import). Fix any detected issues before sending to customers.

### Customer Can't Use Surface Model

**Issue**: "Surfaces cannot be used to make molds, and so the customer wasn't going to be able to use the 3D model."
**Fix**: Verify export produces solid before sending to customer. Always test export/import with the target CAD system. Keep previous version of KOMPAS-3D as fallback.

### Precision-Critical Mold Design

**Issue**: "Changing the geometry was not an option, as precision was of the utmost importance."
**Fix**: When precision is critical, avoid Boolean operations with contours on faces. Use separate solid bodies for union operations. Verify model integrity before export.

## Best Practices

1. **Align contours to face edges in Boolean operations** — prevents boundary edges
2. **Don't let contours exceed face boundaries by tolerance** — causes export failures
3. **Use closed edge chains for fillets** — avoids split edges at open chain ends
4. **Reduce fillet radius at chain ends** — prevents face splitting
5. **Run STEP round-trip test before sending to customers** — catches surface conversion
6. **Update KOMPAS-3D for C3D kernel fixes** — boundary edge and fillet issues resolved
7. **Use simplified display modes for large assemblies** — improves navigation performance
8. **Suppress inactive components** — reduces memory and GPU load
9. **Configure bend table for sheet metal** — ensures correct flat pattern dimensions
10. **Hide source solids when polygonal objects exist** — prevents export duplication
