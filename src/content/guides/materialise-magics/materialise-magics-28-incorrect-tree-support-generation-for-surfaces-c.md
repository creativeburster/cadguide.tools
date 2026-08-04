---
title: "Materialise Magics 28 Incorrect Tree Support Generation for Surfaces Closer Than 1mm to"
excerpt: "Materialise Magics 28 Incorrect Tree Support Generation for Surfaces Closer Than 1mm to: symptoms, root causes, and step-by-step fixes, verified against Materialise Support."
category: "printing"
softwareSlug: "magics"
keyword: "Materialise Magics 28 incorrect tree support generation surface 1mm platform regenerate not working modified surface cancelling re-trim support unresponsive freeze thickened supports empty slices Concept Laser Sodick Additive Industries migration incompatibility support parameters Magics 22 23"
slug: "materialise-magics-28-incorrect-tree-support-generation-for-surfaces-c"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
---

# Materialise Magics 28 Incorrect Tree Support Generation for Surfaces Closer Than 1mm to Platform, Regenerate Not Working for Tree Supports with Modified Surface, Cancelling Re-Trim Support on Platform Causes Unresponsive Freeze, Thickened Supports Creating Empty Slices for Concept Laser Sodick Additive Industries Build Processors, and Migration Incompatibility of Support Parameters from Magics 22 to 23 Plus: Tree Support Angle Check, Support Type Toggle, Re-Trim Avoidance, 28.03 Update, and Profile Migration Verification

Materialise Magics produces errors from tree support generation, regenerate failures, re-trim freezes, thickened support slicing, and migration issues. This guide covers the 5 most common Magics problems with diagnostic steps and community-verified fixes from Materialise Support.

## 1. Incorrect Tree Support Generation for Surfaces Closer Than 1mm to Platform

### Symptom

Tree supports are generated incorrectly for parts that have surfaces partially or fully closer than 1mm to the platform. The tree supports with angling applied don't properly support the down-facing surfaces. The supports may be misplaced, insufficient, or structurally unsound. The issue occurs specifically with tree supports when angling is applied and the part surface is near the platform.

### Root Cause

"In situations where a part that has a surface that is (partially) closer than 1mm to the platform and that is supported by trees with angling applied, can lead to incorrect tree supports being generated." The tree support generation algorithm doesn't properly handle surfaces that are very close to the platform (less than 1mm). When angling is applied to tree supports for such surfaces, the algorithm miscalculates the support geometry, leading to incorrect support structures.

### Fix

1. **Check part-to-platform distance**:
   - Check if any part surfaces
   - Are closer than 1mm
   - To the platform

2. **Disable angling for near-platform surfaces**:
   - Disable the angling option
   - For tree supports near
   - The platform surface

3. **Use block supports instead of tree supports**:
   - If tree supports are incorrect
   - Switch to block supports
   - For surfaces close
   - To the platform

4. **Raise the part slightly**:
   - Raise the part
   - So no surface is
   - Closer than 1mm
   - To the platform

5. **Manually edit tree supports**:
   - After generation
   - Manually edit the tree supports
   - To correct any
   - Incorrectly placed supports

6. **Update to the latest Magics version**:
   - Check for updates
   - That may fix the tree support
   - Generation algorithm
   - For near-platform surfaces

7. **Verify support integrity**:
   - After generation
   - Verify the tree supports
   - Are structurally sound
   - And properly placed

### Community Report

> "1146404 | Support Generation | Incorrect generation of tree supports. In situations where a part that has a surface that is (partially) closer than 1mm to the platform and that is supported by trees with angling applied, can lead to incorrect tree supports being generated."

## 2. Regenerate Not Working for Tree Supports with Modified Surface

### Symptom

After modifying a tree support surface (e.g., adding or removing triangles), clicking the 'Regenerate' button doesn't update the tree supports. The modified surface is not reflected in the regenerated supports. The supports remain in their original state despite the surface modification. The issue occurs specifically with tree supports when the support surface has been manually modified.

### Root Cause

"Modifying a support surface (e.g., adding or removing triangles) with Tree supports and using 'regenerate' button will not update the Tree supports with the modified surface. Changing to and from another support type or modifying a parameter will trigger the update of Tree supports with the modified surface." The Regenerate button doesn't properly trigger a full update of tree supports when the support surface has been modified. The regeneration logic for tree supports with modified surfaces is incomplete — it doesn't detect the surface modification and reprocess the supports.

### Fix

1. **Change support type and back**:
   - Switch to block supports and back to tree

2. **Modify a parameter to trigger update**:
   - Change any support parameter
   - To trigger the regeneration

3. **Don't use Regenerate for modified surfaces**:
   - The Regenerate button
   - Doesn't work for tree supports
   - With modified surfaces
   - Use the type toggle workaround instead

4. **Verify support update**:
   - After using the type toggle workaround
   - Verify the tree supports
   - Now reflect the
   - Modified surface

5. **Document the workaround**:
   - Document that Regenerate
   - Doesn't work for modified tree supports
   - And that type toggle
   - Is the workaround

6. **Use manual support editing**:
   - Instead of modifying the surface
   - And regenerating
   - Manually edit the supports
   - To achieve the desired result

7. **Report persistent regenerate issues**:
   - If the workaround doesn't work
   - Report to Materialise support
   - With the support file
   - And surface modification details

### Community Report

> "1146410 | Support Generation | Regenerate not working for tree supports with a modified surface. Modifying a support surface (e.g., adding or removing triangles) with Tree supports and using 'regenerate' button will not update the Tree supports with the modified surface. Changing to and from another support type or modifying a parameter will trigger the update of Tree supports with the modified surface."

## 3. Cancelling Re-Trim Support on Platform Causes Unresponsive Freeze

### Symptom

When cancelling the "Re-trim support on platform" operation for parts containing tree supports, Magics becomes completely unresponsive. The application freezes and doesn't recover. The user has to force-quit Magics, potentially losing unsaved work. The issue occurs specifically when cancelling the re-trim operation for parts with tree supports.

### Root Cause

"Cancelling 'Re-trim support on platform' for parts containing Tree support will cause Magics to become unresponsive." The cancel operation for "Re-trim support on platform" has a deadlock issue when tree supports are present. The cancellation process doesn't properly clean up the tree support data, causing the application to hang indefinitely.

### Fix

1. **Don't cancel Re-trim for tree supports**:
   - Avoid cancelling the re-trim operation

2. **Let the re-trim complete**:
   - Instead of cancelling
   - Let the re-trim operation
   - Complete fully
   - Even if it takes time

3. **Save before re-trim operations**:
   - Before performing
   - Any re-trim operation
   - Save your work
   - To prevent data loss

4. **Remove tree supports before re-trim**:
   - If you need to re-trim
   - Remove tree supports first
   - Then perform the re-trim
   - And re-add supports after

5. **Use a different support type**:
   - If re-trim is needed
   - Use block supports instead
   - Of tree supports
   - To avoid the freeze

6. **Force quit and restart if frozen**:
   - If Magics becomes unresponsive
   - Force quit the application
   - Restart and reload
   - From the last save

7. **Update to the latest version**:
   - Check for updates
   - That may fix the
   - Re-trim cancel issue
   - For tree supports

### Community Report

> "1157361 | Support Generation | Cancelling 'Re-trim support on platform' for parts containing Tree support will cause Magics to become unresponsive."

## 4. Thickened Supports Creating Empty Slices for Concept Laser Sodick Additive Industries

### Symptom

When using thickened supports, empty slices appear in the support structure during slicing. The issue occurs with specific Build Processors: Concept Laser 1.2, Sodick 1.0, and Additive Industries 2.6. The empty slices create gaps in the support structure that can cause build failures. The problem affects Magics 28.0, 28.01, and 28.02.

### Root Cause

"Thickening of the non-solid support might create open contours for some geometries. This can create empty slices for supports while slicing with some Build Processors (Concept Laser 1.2, Sodick 1.0, Additive Industries 2.6). The issue was resolved as of Magics 28.03." The support thickening process created open contours in the support geometry for certain part geometries. When sliced with specific Build Processors, these open contours resulted in empty slices — gaps in the support structure where no material would be deposited.

### Fix

1. **Update to Magics 28.03 or later**:
   - Update to 28.03
   - To fix the empty slices

2. **Regenerate supports from previous versions**:
   - Regenerate imported supports before slicing

3. **Use solid support conversion**:
   - Convert supports to solid STL

4. **Check planar holes after SG mode**:
   - Check for and fix planar holes

5. **Use a different Build Processor**:
   - If the issue persists
   - Try a different Build Processor
   - That may handle
   - Thickened supports better

6. **Verify slices before building**:
   - After slicing
   - Verify the slices
   - For any empty regions
   - Before starting the build

7. **Check support geometry**:
   - Before slicing
   - Check the support geometry
   - For open contours
   - That could cause empty slices

### Community Report

> "Thickened supports might cause empty slices. This issue is resolved as of Magics 28.03. Thickening of the non-solid support might create open contours for some geometries. This can create empty slices for supports while slicing with some Build Processors (Concept Laser 1.2, Sodick 1.0, Additive Industries 2.6). If supports are imported from a previous Magics version, it is mandatory to regenerate the supports prior to slicing. When using thickened support, set the parameters in Machine properties to convert solid support to .stl. On exit from SG mode, check the 'planar holes' in the Part fixing info and run the fixing."

## 5. Migration Incompatibility of Support Parameters from Magics 22 to 23 Plus

### Symptom

When converting a 'Support library' from Magics 22 or older to a 'Support generation profile' in Magics 23 or newer, the rescaled center parameter receives a wrong value. The migrated support profiles don't generate the same supports as the original support libraries. The issue affects users upgrading from Magics 22 or older to Magics 23 or newer.

### Root Cause

"Possible migration incompatibility of support parameters from older Magics versions. When converting a 'Support library' (from Magics 22 or older) into a 'Support generation profile' (in Magics 23 or newer), the rescaled center parameter might receive a wrong value." The support parameter format changed between Magics 22 and 23. The migration converter doesn't properly handle the rescaled center parameter, assigning it an incorrect value during the conversion process.

### Fix

1. **Verify migrated support profiles**:
   - After migration
   - Verify all support parameters

2. **Check rescaled center parameter**:
   - Specifically check
   - The rescaled center parameter
   - In migrated profiles
   - For incorrect values

3. **Manually correct the rescaled center**:
   - If the value is wrong
   - Manually correct
   - The rescaled center parameter
   - In the support generation profile

4. **Recreate support profiles from scratch**:
   - If migration produces too many errors
   - Recreate the support profiles
   - From scratch in Magics 23+
   - Instead of migrating

5. **Compare support generation before and after**:
   - Generate supports with the migrated profile
   - And with the original library
   - Compare the results
   - To identify migration issues

6. **Document migration issues**:
   - Document which parameters
   - Were incorrectly migrated
   - For future reference
   - And other users

7. **Use Magics 29+ for improved migration**:
   - Update to Magics 29 or later
   - Which may have improved
   - Migration tools
   - For older support libraries

### Community Report

> "1157360 | Support Generation | Possible migration incompatibility of support parameters from older Magics versions. When converting a 'Support library' (from Magics 22 or older) into a 'Support generation profile' (in Magics 23 or newer), the rescaled center parameter might receive a wrong value."

## 6. Additional Materialise Magics Issues

### Manually Added Supports Wrong Position

**Issue**: "In some cases, manually added supports are transferred with wrong position."
**Fix**: Verify support positions after manual addition. If positions are wrong, manually adjust after transfer. Check for position offset patterns.

### No-Support Zones Ignored for Some Structures

**Issue**: "No-support zones on marked Structures (for some geometries of Structures) are ignored during e-stage generation."
**Fix**: Verify no-support zones are respected during e-stage generation. For complex structure geometries, manually verify no-support zones after generation.

### Transferred Support Uses Wrong Profile Parameters

**Issue**: "In some cases, transferred support will use profile parameters for the destination part instead of the modified parameters of the origin part."
**Fix**: After transferring supports, verify the profile parameters. Manually adjust if the destination part's default parameters were used instead of the origin part's modified parameters.

### Transferred Support Goes Through Part

**Issue**: "In some cases, transferred support is incorrectly generated on the destination part, causing support to go through part. Resolved in MGX 29.0."
**Fix**: Update to Magics 29.0 or later. Verify transferred supports don't intersect the part after transfer.

### Empty Support Surfaces from Unfinished Add Tree

**Issue**: "Empty support surfaces can remain when proceeding without finishing the 'Add tree' operation. Resolved in MGX 29.0."
**Fix**: Always finalize the Add tree operation with a right mouse button click. If empty surfaces remain, remove them manually. Update to MGX 29.0 for the fix.

### Boolean of Beam Lattice Removes No-Support Zones

**Issue**: "When executing Boolean of beam lattice and mesh, previously added beams as 'No support zone' will be removed from the 'No support zone'. Resolved in MGX 29.0."
**Fix**: Update to MGX 29.0. After Boolean operations, verify no-support zones are still intact. Re-add no-support zones if removed.

### Word Reports Empty or Unexpanded Values

**Issue**: "Word reports may generate with empty or unexpanded values."
**Fix**: Update to the latest maintenance release (28.07, 29.1.2, or 30.01). Verify report values after generation. Regenerate reports if values are empty.

## Best Practices

1. **Check part-to-platform distance before tree support generation** — surfaces closer than 1mm cause issues
2. **Use support type toggle instead of Regenerate for modified surfaces** — Regenerate doesn't update tree supports
3. **Don't cancel Re-trim for parts with tree supports** — causes unresponsive freeze
4. **Update to Magics 28.03+ for thickened support slicing** — fixes empty slices
5. **Regenerate imported supports before slicing** — prevents using faulty imported supports
6. **Verify migrated support profiles from Magics 22** — rescaled center may be wrong
7. **Convert solid support to STL in Machine properties** — prevents open contours
8. **Check planar holes after SG mode** — run fixing to resolve issues
9. **Always finalize Add tree operation** — prevents empty support surfaces
10. **Update to latest maintenance release** — fixes Word report and known issues
