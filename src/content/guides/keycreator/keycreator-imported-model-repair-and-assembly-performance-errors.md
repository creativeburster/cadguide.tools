---
title: "KeyCreator Imported Model Repair and Assembly Performance Errors"
excerpt: "KeyCreator Imported Model Repair and Assembly Performance Errors: symptoms, root causes, and step-by-step fixes, verified against Kubotek Kosmos documentation."
category: "performance"
softwareSlug: "keycreator"
keyword: "KeyCreator imported solids gap errors precision differences Repair Problem Entities Boolean operations fail face-face intersection Diagnose Solids automatic healing solids semitransparent Boolean applied materials Unset Material layer toggle large assembly performance multi-process reading file cache blend chamfer complex edges non-tangent tangency highlighting"
slug: "keycreator-imported-model-repair-and-assembly-performance-errors"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://help.kubotekkosmos.com/keycreator/2024SP1/A10024"
  - "https://help.kubotekkosmos.com/keycreator/2024SP1/107894"
  - "https://forum.kubotekkosmos.com/Posts/18/Solids-look-semitransparent"
---

# KeyCreator Imported Model Repair and Assembly Performance Errors: Imported Solids Show Gap Errors from Precision Differences Requiring Repair Problem Entities, Boolean Operations Fail from Face-Face Intersection Errors Requiring Diagnose Solids, Solids Appear Semitransparent After Boolean from Applied Materials Requiring Unset Material, Large Assembly Performance from Multi-Process Reading and File Cache, and Blend Chamfer Complex Edges Fail from Non-Tangent Edge Sets Requiring Tangency Highlighting

KeyCreator's imported model handling, Boolean operations, material display, and assembly performance produce errors from precision differences, face intersections, and material inheritance. This guide covers the 5 most common KeyCreator problems with diagnostic steps and community-verified fixes from Kubotek Kosmos documentation.

## 1. Imported Solids Show Gap Errors from Precision Differences

### Symptom

Importing STEP, IGES, or Parasolid X_T files into KeyCreator. The imported solids show gap errors, tiny edges, silver faces, and badly defined spline surfaces. Boolean operations on these solids fail unexpectedly. The model looks correct visually but has internal geometric errors.

### Root Cause

KeyCreator uses a higher precision modeling environment than many other CAD systems. When less precise entities from other systems are translated into KeyCreator, the translated entities show gap errors from the precision difference. Duplicate or overlapping vertices, tiny edges, and silver faces are common artifacts of CAD translation. Badly defined spline surfaces may not meet KeyCreator's continuity requirements.

### Fix

1. **Enable Repair Problem Entities on import**:
   - "It is strongly recommended that you select this option"
   - "It corrects problems in the file being translated"
   - In the import dialog, click Options > Common Import Options
   - Check "Repair Problem Entities"

2. **What Repair Problem Entities fixes**:
   - "Elimination of duplicate or overlapping vertices, tiny edges and silver faces"
   - "Repairing of badly defined spline surfaces"
   - "Simplifying spline faces and edges to analytic definitions"
   - "Corrects the difference in precision between the entities in the file and KeyCreator by tolerizing the translated entities"

3. **Import with geometric tolerance data**:
   - Enable "geometric tolerance data" in import options
   - This preserves PMI/MBD tolerance information
   - KeyCreator 2024 improved MBD support

4. **Use Diagnose Solids after import**:
   - "This function performs a diagnosis of the selected solids and sheet bodies"
   - "Useful if you have imported a file from another system and wish to verify the integrity"
   - Run Diagnose Solids on all imported bodies
   - Check for face-face intersections and discontinuities

5. **Use Make Tolerant Geometry**:
   - After diagnosis, "elect to Make Tolerant Geometry"
   - This adjusts geometry to within KeyCreator's tolerance
   - Prevents Boolean operation failures

6. **Check curve and surface continuity**:
   - "Check Curve and Surface Geometry for Discontinuities"
   - "The ACIS modeling kernel that KeyCreator uses prefers G2 continuous curves and surfaces"
   - "Will allow G1 continuity at the knots of curves and surfaces"
   - Fix discontinuities before Boolean operations

### Community Report

> "It is strongly recommended that you select Repair Problem Entities. It corrects problems in the file being translated: elimination of duplicate or overlapping vertices, tiny edges and silver faces, repairing of badly defined spline surfaces, simplifying spline faces and edges to analytic definitions. When less precise entities from other systems are translated into the high precision KeyCreator modeling environment, typically the translated entities show gap errors."

## 2. Boolean Operations Fail from Face-Face Intersection Errors

### Symptom

Boolean operations (union, subtract, intersect) fail on imported solids. The error may not specify which faces are problematic. The operation silently fails or produces unexpected results. Solids that look correct visually still fail Boolean operations.

### Root Cause

Face-face intersection errors occur when non-adjacent faces in a solid intersect each other. This typically happens in solids with multiple overlapping lumps from poor CAD translation. The ACIS modeling kernel can't resolve these intersections and the Boolean operation fails. These errors are not visible in normal rendering.

### Fix

1. **Run Diagnose Solids with face-face intersection check**:
   - "Face-Face Intersection Errors — Check this option ON to check for faces that are not adjacent but still intersect"
   - "A typical case of these errors occurs in a solid that has multiple overlapping lumps"
   - "This type of error typically causes boolean operations to fail"
   - Select the solid and run Diagnose Solids

2. **Enable Attempt to Automatically Heal**:
   - "If this checkbox is enabled, KeyCreator will attempt to heal any problem entities encountered during the verification"
   - "After attempting to heal the entities, it is recommended that you elect to Re-check the Healed Geometry"
   - Enable healing in the Diagnose Solids dialog
   - Re-check after healing to verify

3. **Draw Wireframe Entities Over Problem Geometry**:
   - "If checked ON, wireframe entities are drawn over the problem areas"
   - "These entities are drawn in color #15 (white) and their line width is set to 3"
   - This visually identifies problem areas
   - Use this to locate and manually fix issues

4. **Move problem entities to separate level**:
   - "Change Problem Entities — If checked, you are prompted to move the problem entities"
   - Move problem solids to a separate level
   - This isolates them from the main model
   - Fix or recreate the problem solids

5. **Use Make Tolerant Geometry after healing**:
   - "You can also elect to Make Tolerant Geometry"
   - This adjusts geometry to within tolerance
   - Prevents future Boolean failures
   - Run after healing and re-checking

6. **Check for C0/G1/C2 continuity issues**:
   - "Two curves or surfaces meet with C0 continuity if positions at all intersection points are the same"
   - "G1 continuity requires tangents to be in the same direction and magnitude"
   - "C2/G2 continuity requires curvature to be the same"
   - Fix continuity issues before Boolean operations

### Community Report

> "Face-Face Intersection Errors — check for faces that are not adjacent but still intersect. A typical case occurs in a solid that has multiple overlapping lumps. This type of error typically causes boolean operations to fail. This option will more than likely cause the verification to take longer to process."

## 3. Solids Appear Semitransparent After Boolean from Applied Materials

### Symptom

Working on a large file. After performing Modify > Boolean > Unit and Keep Bodies, all parts in the assembly appear semitransparent. Closing and reopening the file doesn't fix the issue. Exporting individual parts and opening them in a new window shows them as normal (not transparent).

### Root Cause

The Boolean operation with "Keep Bodies" inherits face materials/colors from the cutting body. KeyCreator 2024 improved "face color/material attributes" handling, but some Boolean operations still apply transparency attributes from the tool body to the resulting body. The transparency is a material attribute applied to faces, not a display setting.

### Fix

1. **Toggle all layers OFF then ON**:
   - "Once I toggled all the layers OFF then ON (more than 50 layers) it came good"
   - "All solids appear as normal now"
   - This refreshes the display and may clear the transparency
   - Quick fix that doesn't modify geometry

2. **Use Unset Material to clear transparency**:
   - "Solid/Surface select Tools, then press Face Tools icon"
   - "Then press Unset Material icon"
   - "Select all the solids/surfaces you want to clear of any transparencies or materials"
   - This removes the applied material attributes

3. **Check face material attributes before Boolean**:
   - Before performing Boolean with Keep Bodies
   - Check if the tool body has face materials applied
   - Remove materials from the tool body first
   - This prevents material inheritance

4. **Use Boolean without Keep Bodies**:
   - If transparency inheritance is a recurring issue
   - Use Boolean without the Keep Bodies option
   - This doesn't preserve the tool body
   - Avoids material inheritance from the tool

5. **KeyCreator 2024 improved face color handling**:
   - "Several additional functions now maintain and transfer face materials/colors to the resulting body when the cutting body includes face-based materials/color settings"
   - "This speeds modeling by eliminating the need to reapply the required face colors"
   - Update to KeyCreator 2024 for improved material handling
   - Some functions may still have the issue

6. **Export and reimport as workaround**:
   - "If I export any of the parts and open them in a new window, they appear fine"
   - Export the semitransparent parts
   - Open in a new KeyCreator window
   - Copy back into the assembly

### Community Report

> "After doing Modify Boolean, Unit and Keep Bodies, all parts in the assembly appear semitransparent. I toggled all layers OFF then ON and it came good. Also: Solid/Surface select Tools, Face Tools, Unset Material, select all solids to clear transparencies or materials."

## 4. Large Assembly Performance from Multi-Process Reading and File Cache

### Symptom

Large assemblies with many imported components (SolidWorks, STEP, IGES) are slow to open and manipulate. Assembly operations like Compare and component updates take a long time. The system has multiple CPU cores but KeyCreator doesn't seem to use them all.

### Root Cause

KeyCreator's default configuration may not enable multi-process reading for assembly operations. Additionally, imported files (e.g., .sldasm) are translated each time they're opened, which is slow. KeyCreator has a file cache feature that stores .ckd versions of imported files for faster loading, but it may not be configured or enabled.

### Fix

1. **Enable Multi-Process Reading of files**:
   - "This option allows certain functions such as the Compare and Assembly read operations to take advantage of any multiple processors"
   - "This will improve performance and decrease time to process"
   - In Options, enable "Enable Multi Process Reading of files"

2. **Configure file cache for imported files**:
   - "This function essentially links an import file type with a cached version as a .ckd file"
   - "Since the .ckd format is native to KeyCreator it will make any future loading much quicker"
   - Configure cache in Options > Misc
   - Set maximum cache size

3. **Populate cache in batch**:
   - "The Populate option allows you to preload the cache in a batch process"
   - Pre-populate the cache for commonly used imported files
   - This eliminates translation time on subsequent opens
   - Run Populate before working on the assembly

4. **Clear cache when needed**:
   - "The clear option clears the cache directory of all saved iterations of .ckd files"
   - Clear cache if imported files have been updated
   - Re-populate after clearing
   - Prevents stale cached versions

5. **Use lightweight representations for purchased parts**:
   - "Designers can model purchased parts with imported lightweight shell entities or dramatically simplified/featureless solids"
   - "Instead of the typical external part reference or precise editable solid"
   - "Maintaining an associative geometric location, the point mass/CoG will automatically update"
   - This reduces file size and improves performance

6. **Use point mass for CoG calculations**:
   - "CoG and moment of the whole assembly remain accurate without manual re-selection"
   - "After point mass components are moved"
   - Use point mass instead of full geometry for non-critical components
   - Maintains accurate mass properties

### Community Report

> "This option allows certain functions such as Compare and Assembly read operations to take advantage of multiple processors. The file cache links an import file type with a cached .ckd version, making future loading much quicker. The Populate option allows preloading the cache in a batch process."

## 5. Blend Chamfer Complex Edges Fail from Non-Tangent Edge Sets

### Symptom

Blend or chamfer operations along complex edges fail or produce unexpected results. The operation requires a contiguous smooth and tangent set of edges, but the edge selection includes non-tangent segments. It's difficult to identify where tangency breaks.

### Root Cause

Blend and chamfer operations in KeyCreator require contiguous smooth and tangent edge sets. If the edge selection includes a non-tangent segment (where adjacent edges meet at an angle), the operation fails. Identifying the exact point where tangency breaks is difficult without visual aids. Imported models are particularly prone to non-tangent edges from translation.

### Fix

1. **Use tangency highlighting and tool tips**:
   - "Highlighting and tool tips can now help quickly point out a potential design problem during an initial review of incoming models"
   - KeyCreator 2024 added tangency highlighting
   - Use this to identify where tangency breaks
   - Select edges and watch for highlighting changes

2. **Review incoming models for tangency issues**:
   - "This improvement aids users in identifying tangency or where additional edge selections are required"
   - Before performing blend/chamfer, review edge tangency
   - Use the highlighting to find problem edges
   - Fix tangency before blending

3. **Select edges in smaller segments**:
   - Instead of selecting a long edge chain
   - Select shorter contiguous tangent segments
   - Perform blend/chamfer on each segment separately
   - This avoids non-tangent sections

4. **Fix non-tangent edges before blending**:
   - Use Edit Face or Replace Face to fix non-tangent edges
   - Create a new face that is tangent to adjacent faces
   - Then perform the blend operation
   - This ensures a contiguous tangent edge set

5. **Use Diagnose Solids to check continuity**:
   - "Check Curve and Surface Geometry for Discontinuities"
   - "G1 continuity requires tangents at all points of intersection to be in the same direction"
   - Run Diagnose Solids with continuity checks
   - Fix discontinuities before blending

6. **Use imprint faces for complex results**:
   - "The enhanced version now imprints the potentially valuable faces into the resulting body"
   - "Saving significant modeling time over other modeling methods"
   - Use imprint operations to create tangent edge sets
   - Then blend along the imprinted edges

### Community Report

> "Blend and chamfer modeling operations along complex edges require a contiguous smooth and tangent set of edges. This improvement aids users in identifying tangency or where additional edge selections are required. Highlighting and tool tips can now help quickly point out a potential design problem during an initial review of incoming models."

## 6. Additional KeyCreator Issues

### Section View Reprocessing

**Issue**: Section View reprocesses unnecessarily when non-geometric properties change.
**Fix**: "Changes to non-geometric properties of a Section View no longer automatically trigger full reprocessing." KeyCreator 2024 improved this. Non-geometric edits include format settings, text, and dimensions.

### Section View Format Settings Reset

**Issue**: Section View format settings reset to defaults after each use.
**Fix**: "KeyCreator 2024 has added an option to save format settings changes made to a specific view to become the new default in that CKD file." Enable this option to persist format settings.

### RGB Color Behavior in Trim/Split

**Issue**: RGB colors behave unexpectedly in Trim/Split functions for the mold industry.
**Fix**: "We improved their behavior in the Trim/Split functions" in KeyCreator 2024. "Several additional functions now maintain and transfer face materials/colors to the resulting body."

### MBD Tolerance Support

**Issue**: Model-Based Definition tolerance data not preserved on import.
**Fix**: KeyCreator 2024 improved "CAD translator support for Model-Based Definition (MBD) which continues to grow in use, particularly in the aerospace segment." Enable geometric tolerance data in import options.

### Updated File Format Support

**Issue**: Cannot import latest versions of CAD formats.
**Fix**: "File imports into KeyCreator 2024 have updated ten formats to support the latest versions." Check the supported format list in the release notes.

## Best Practices

1. **Always enable Repair Problem Entities on import** — fixes gaps, vertices, silver faces
2. **Run Diagnose Solids after import** — verifies integrity and identifies issues
3. **Enable Automatic Healing in Diagnose Solids** — fixes face-face intersections
4. **Use Unset Material to clear transparency** — after Boolean with Keep Bodies
5. **Toggle layers OFF/ON as quick display refresh** — may clear semitransparent display
6. **Enable Multi-Process Reading** — uses multiple CPUs for assembly operations
7. **Configure and populate file cache** — speeds up imported file loading
8. **Use lightweight representations for purchased parts** — reduces assembly size
9. **Use tangency highlighting for blend/chamfer** — identifies non-tangent edges
10. **Save Section View format settings** — KeyCreator 2024 option to persist settings
