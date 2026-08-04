---
title: "Magics STL Repair and Support Generation Errors"
excerpt: "Magics STL Repair and Support Generation Errors: symptoms, root causes, and step-by-step fixes, verified against Materialise Support and Magics Tutorials."
category: "printing"
softwareSlug: "magics"
keyword: "Magics STL repair bad edges inverted normals AutoFix manual repair thickened support empty slices non-solid support 28.03 update regeneration BREP fillet failure convergent body errors manual edge fix import hang Select Orientation dialog bug settings disable tree support incorrect generation close-to-platform surface angle adjustment"
slug: "magics-stl-repair-and-support-generation-errors"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-03"
sources:
  - "https://help.materialise.com/magics-known-issues/known-issues-magics"
  - "https://help.materialise.com/magics-known-issues/thickened-supports-might-create-open-contours-and-empty-slices"
  - "https://www.materialise.com/en/academy/industrial/magics/video-tutorials/master-basic-stl-file-repair"
---

# Magics STL Repair and Support Generation Errors: Bad Edges and Inverted Normals from STL Import Requiring AutoFix and Manual Repair, Thickened Support Empty Slices from Non-Solid Support Requiring 28.03 Update and Regeneration, BREP Fillet Failure from Convergent Body Errors Requiring Manual Edge Fix, Import Hang from Select Orientation Dialog Bug Requiring Settings Disable, and Tree Support Incorrect Generation from Close-to-Platform Surface Requiring Angle Adjustment

Magics' STL repair, support generation, BREP operations, import handling, and tree support produce errors from mesh defects, non-solid supports, convergent body issues, dialog bugs, and close-to-platform geometry. This guide covers the 5 most common Magics problems with diagnostic steps and community-verified fixes from Materialise Support and Magics Tutorials.

## 1. Bad Edges and Inverted Normals from STL Import

### Symptom

Imported STL files have multiple errors: bad edges, near bad edges, inverted normals, holes, intersecting triangles, overlapping triangles, and noise shells. The Part Fixing Info tab shows multiple error categories. The part is not printable in its current state.

### Root Cause

STL files from various CAD systems or 3D scans contain geometric errors. Bad edges occur when triangle edges don't match between adjacent triangles. Inverted normals happen when triangle winding order is inconsistent. Holes are missing triangles in the mesh. Noise shells are disconnected small mesh fragments. These are inherent limitations of the STL format and result from geometry simplification during export.

### Fix

1. **Use AutoFix for automatic repair**:
   - "Click 'AutoFix' in the 'Fix' ribbon"
   - "Refresh Part Fixing Info again to confirm that most errors have been fixed"
   - Select the part
   - Click Part Fixing Info tab > Refresh
   - Click AutoFix in the Fix ribbon
   - Check remaining errors

2. **Use semi-automatic fixing (Follow)**:
   - "Click the 'Follow' button to automatically fix each step"
   - "Until the remaining errors can no longer be fixed"
   - This steps through each error category
   - Fixes what it can automatically

3. **Fix inverted normals manually**:
   - "Click the Invert Normals icon in the Fix menu"
   - "Select the Mark Triangle icon and choose the triangles to invert"
   - Or use the semi-automatic wrench icon to fix all inverted normals
   - "If no triangles are marked, this function will invert all triangles"

4. **Fix bad edges by stitching**:
   - "Set the desired number of stitching Iterations and click Stitch"
   - "Review the stitching tolerance, which Magics estimates automatically"
   - "Adjust the Max gap size if necessary"
   - Navigate to Near Bad Edges page

5. **Fix holes manually**:
   - "For irregular holes: select the Freedom icon, click Fill hole mode"
   - "For curved holes: select the Ruled icon, choose User defined"
   - "For complex triangular holes: select Create triangle function"
   - "For planar holes: select the Planar icon, click Fill hole mode"

6. **Fix noise shells**:
   - "Select the noise shell, and press the Delete key"
   - "The first is typically the main model"
   - "The second likely has few triangles and is therefore a noise shell"
   - Navigate to the Shell page in the fixing pop-up

7. **Fix intersecting triangles**:
   - "Try filtering sharp triangles by clicking Collapse"
   - "Navigate to the Triangle page in the fixing pop-up"
   - Use semi-automatic fixing tools to remove extra noise shells
   - Manually adjust triangle positions with Move Part Points

### Community Report

> "Common STL file errors include bad edges, near bad edges, inverted normals, holes, intersecting triangles and overlapping triangles. AutoFix in the Fix ribbon fixes most errors automatically. For manual fixing: use Invert Normals for flipped triangles, Stitch for bad edges, Fill hole mode for holes, Delete for noise shells, and Collapse for intersecting triangles. Check the Advice section in Part Fixing Info for suggestions."

## 2. Thickened Support Empty Slices from Non-Solid Support

### Symptom

After thickening non-solid supports, empty slices appear in the support structure during slicing. The thickened support creates open contours. This happens with specific Build Processors: Concept Laser 1.2, Sodick 1.0, Additive Industries 2.6. The supports are not properly sliced, leading to missing support material in the build.

### Root Cause

"Thickening of the non-solid support might create open contours for some geometries. This can create empty slices for supports while slicing with some Build Processors." The thickening operation on non-solid (hollow) support geometry creates open contours — edges that don't form closed loops. When the slicer processes these open contours, it can't create valid slice layers, resulting in empty slices.

### Fix

1. **Update to Magics 28.03 or later**:
   - "This issue is resolved as of Magics 28.03"
   - Update to the latest version of Magics
   - The fix prevents open contours from thickening

2. **Regenerate supports from previous versions**:
   - "If supports are imported from a previous Magics version"
   - "It is mandatory to regenerate the supports prior to slicing"
   - "Otherwise the slicing will use the imported, faulty support as input"
   - Delete old supports and regenerate in the current version

3. **Fix thickened support in Magics**:
   - "When using thickened support, set the parameters in Machine properties"
   - "To convert solid support to .stl"
   - "On exit from SG mode, check the 'planar holes' in the Part fixing info"
   - "Run the fixing"

4. **Check for planar holes after thickening**:
   - After thickening supports
   - Open Part Fixing Info
   - Check for planar holes
   - Run AutoFix on the support geometry

5. **Use solid supports instead of non-solid**:
   - If thickening non-solid supports causes issues
   - Use solid support generation
   - Solid supports don't have the open contour problem
   - Adjust support parameters accordingly

6. **Verify slices before building**:
   - After slicing, review the slice layers
   - Check for empty slices in the support area
   - If empty slices are found, regenerate supports
   - Re-slice and verify

### Community Report

> "Thickened supports might cause empty slices. This issue is resolved as of Magics 28.03. Thickening of the non-solid support might create open contours for some geometries. This can create empty slices for supports while slicing with Build Processors (Concept Laser 1.2, Sodick 1.0, Additive Industries 2.6). If supports are imported from a previous Magics version, it is mandatory to regenerate the supports prior to slicing."

## 3. BREP Fillet Failure from Convergent Body Errors

### Symptom

Applying a BREP Fillet operation on a convergent body results in an error. Some edges causing the failure are not rendered in error state — they don't show as red/highlighted, making it hard to identify which edges to fix. The fillet operation fails silently or with a generic error.

### Root Cause

"In specific cases, some edges causing failure of BREP Fillet operation are not rendered in error state." The BREP Fillet operation requires valid convergent body geometry. When certain edges have geometric issues (gaps, non-manifold connections, or topology errors), the fillet can't be computed. The bug is that these problematic edges are not visually highlighted, so the user can't easily identify which edges to fix.

### Fix

1. **Update to latest Magics version**:
   - Check if the edge rendering bug is fixed
   - "In some cases, filleting a convergent body might result in error"
   - Newer versions may properly highlight failing edges
   - Install the latest Magics update

2. **Use Part Fixing Info before BREP operations**:
   - Before applying BREP Fillet
   - Run Part Fixing Info on the convergent body
   - Fix all reported errors (bad edges, holes, normals)
   - Then retry the fillet

3. **Manually inspect edges**:
   - Since failing edges aren't highlighted
   - Visually inspect the fillet area
   - Look for gaps, non-manifold edges, or topology issues
   - Fix them manually before filleting

4. **Use AutoFix before BREP operations**:
   - Run AutoFix on the convergent body
   - This fixes most geometric errors
   - Then attempt the BREP Fillet
   - Check if the error persists

5. **Simplify the fillet**:
   - Try a smaller fillet radius
   - Or fillet one edge at a time
   - Identify which specific edge causes the failure
   - Fix that edge manually

6. **Convert to STL and re-import**:
   - Export the convergent body as STL
   - Re-import the STL
   - Run AutoFix on the imported mesh
   - Convert back to convergent body
   - Retry the fillet

### Community Report

> "Known issue: In specific cases, some edges causing failure of BREP Fillet operation are not rendered in error state. In some cases, filleting a convergent body might result in error. In some cases, a BREP Tensile bar primitive might have wrong orientation upon creation that can be adjusted manually afterwards."

## 4. Import Hang from Select Orientation Dialog Bug

### Symptom

Importing a part onto the platform causes Magics to hang indefinitely. The 'Select Orientation' dialog blocks the import process. Magics becomes unresponsive and must be force-closed. The hang happens in rare cases during part import.

### Root Cause

"In rare cases, importing part on the platform can block 'Select Orientation' dialog resulting in an infinite Magics hang." The Select Orientation dialog is triggered automatically when a part is imported. In some cases, the dialog doesn't properly initialize or display, but blocks the import thread, causing an infinite hang. The dialog is stuck in a waiting state.

### Fix

1. **Disable Select Orientation dialog in settings**:
   - "As workaround, the 'Select Orientation' dialog should be disabled in Magics settings"
   - Go to Magics Settings
   - Find the Select Orientation option
   - Disable automatic orientation dialog on import

2. **Update to Magics 28.03 or later**:
   - "Resolved in MGX 28.03"
   - The hang bug is fixed in this version
   - Update to the latest Magics
   - The dialog should work properly

3. **Import without auto-orientation**:
   - Change import settings to skip auto-orientation
   - Import the part without orientation
   - Manually orient after import
   - Use the Manual Orientation tool

4. **Force close and retry**:
   - If Magics hangs during import
   - Force close with Task Manager
   - Restart Magics
   - Disable the dialog before retrying import

5. **Check file format compatibility**:
   - The hang may be triggered by specific file types
   - Try importing a different format (STL instead of STEP)
   - If the hang only occurs with one format
   - Convert the file to a different format

6. **Check for MatConvert version issues**:
   - "Specific Inventor files may have geometrical errors"
   - "Using earlier versions of MatConvert may result in less geometrical errors"
   - "For this specific issue, we suggest to use MatConvert 10.2 or earlier"
   - Check MatConvert version in settings

### Community Report

> "Known issue: Magics hangs during import part to platform. In rare cases, importing part on the platform can block 'Select Orientation' dialog resulting in an infinite Magics hang. As workaround, the 'Select Orientation' dialog should be disabled in Magics settings. Resolved in MGX 28.03."

## 5. Tree Support Incorrect Generation from Close-to-Platform Surface

### Symptom

Tree supports are generated incorrectly for parts that have surfaces partially closer than 1mm to the build platform. The supports go through the part instead of supporting it from below. The tree support angling feature causes the incorrect generation.

### Root Cause

"In situations where a part that has a surface that is (partially) closer than 1mm to the platform and that is supported by trees with angling applied, can lead to incorrect tree supports being generated." When the part surface is very close to the platform, the tree support algorithm miscalculates the support path. The angling option causes the support tree to grow in a direction that intersects the part instead of going around it.

### Fix

1. **Disable tree angling**:
   - Turn off the angling option for tree supports
   - Use vertical tree supports instead
   - This avoids the incorrect generation
   - For parts close to the platform

2. **Increase distance from platform**:
   - Raise the part slightly above the platform
   - Use a Z-offset of at least 1.5mm
   - This prevents the close-to-platform condition
   - Regenerate tree supports

3. **Use block supports instead of tree**:
   - For surfaces close to the platform
   - Switch from tree supports to block supports
   - Block supports don't have the angling issue
   - They provide solid support from below

4. **Manually edit tree supports**:
   - After generation, review the supports
   - Check if any supports go through the part
   - Manually delete or reposition incorrect supports
   - Add manual supports where needed

5. **Check support preview before building**:
   - Always preview supports before building
   - Look for supports intersecting the part
   - Use cross-section view to check
   - Fix issues before starting the build

6. **Update Magics to latest version**:
   - Check if the tree support bug is fixed
   - "Incorrect generation of tree supports" is listed as a known issue
   - Newer versions may have improved tree support algorithms
   - Check release notes for fixes

### Community Report

> "Known issue: Incorrect generation of tree supports. In situations where a part that has a surface that is (partially) closer than 1mm to the platform and that is supported by trees with angling applied, can lead to incorrect tree supports being generated. Disabling the showing of supports can lead to supports overlapping with a part."

## 6. Additional Magics Issues

### MatConvert File Path Length

**Issue**: "Importing of files via MatConvert is not possible if the file path is longer than 256 characters."
**Fix**: Move the file to a shorter path. Use a root-level directory. Avoid deeply nested folder structures. Rename to shorter filenames.

### Thickened Non-Solid Support Intersections

**Issue**: "Thickened non-solid support may intersect or detach from the part or create open contours."
**Fix**: Update to Magics 28.03. Use solid supports. Check for intersections after thickening. Manually fix detached supports.

### Stabilization Wall Support Thickness

**Issue**: "Stabilization wall support with applied thickness will result in incorrect generation."
**Fix**: Check stabilization wall parameters. Verify thickness values. Update to latest version. Regenerate stabilization walls.

### Support Overlapping with Part

**Issue**: "Disabling the showing of supports can lead to supports overlapping with a part."
**Fix**: Keep support visibility enabled. Check for overlaps visually. Manually adjust overlapping supports. Use support collision detection.

### BREP Tensile Bar Wrong Orientation

**Issue**: "A BREP Tensile bar primitive might have wrong orientation upon creation."
**Fix**: "Can be adjusted manually afterwards." Rotate the primitive after creation. Check orientation before using in assembly.

## Best Practices

1. **Run AutoFix immediately after STL import** — fixes most mesh errors automatically
2. **Use semi-automatic Follow for remaining errors** — steps through each error category
3. **Update to Magics 28.03+ for thickened support fix** — prevents empty slices
4. **Regenerate supports from previous versions** — old supports may have faults
5. **Disable Select Orientation dialog if import hangs** — workaround for known bug
6. **Run Part Fixing Info before BREP operations** — fix errors before filleting
7. **Disable tree angling for parts close to platform** — prevents incorrect supports
8. **Keep file paths under 256 characters** — MatConvert limitation
9. **Use PLY or OBJ instead of STL for topology preservation** — STL duplicates vertices
10. **Always preview supports before building** — catch intersections and errors
