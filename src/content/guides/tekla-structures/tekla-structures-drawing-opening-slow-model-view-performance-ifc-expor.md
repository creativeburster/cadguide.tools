---
title: "Tekla Structures Drawing Opening Slow, Model View Performance, IFC Export UDA Inheritance"
excerpt: "Tekla Structures Drawing Opening Slow, Model View Performance, IFC Export UDA Inheritance: symptoms, root causes, and step-by-step fixes, verified against Trimble User Assistance."
category: "performance"
softwareSlug: "tekla-structures"
keyword: "Tekla Structures drawing opening slow object-level settings internal lines advanced options XS_DRAW_CAST_UNIT_INTERNAL_LINES XS_HIDDEN_REMOVE_DOUBLE_LINES model view performance part instancing IFC export UDA inheritance XSR_DISABLE_ASSEMBLY_UDA_INHERITANCE component nesting circular reference crash SP13 storing modifying large object slowness 2025 SP1"
slug: "tekla-structures-drawing-opening-slow-model-view-performance-ifc-expor"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
---

# Tekla Structures Drawing Opening Slow, Model View Performance, IFC Export UDA Inheritance, Component Nesting Crash, and Storing Modifying Large Object Slowness: Advanced Options Tuning, Model History Collection, Graphics Driver Update, and Service Pack Fixes

Tekla Structures' drawing opening, model view navigation, IFC export, component nesting, and object storing/modifying produce errors from excessive internal lines, repetitive geometry rendering, UDA inheritance issues, circular component references, and performance regressions. This guide covers the 5 most common Tekla Structures problems with diagnostic steps and community-verified fixes from Trimble User Assistance.

## 1. Drawing Opening Takes 20 Minutes from Object-Level Settings

### Symptom

A Tekla Structures drawing takes around 20 minutes to open. The project has several object-level settings. The drawing contains many lines, many of which are hidden behind other lines due to high view depth. Navigation within the drawing is also slow after opening.

### Root Cause

"Drawing speed can be affected by how many lines are shown on a drawing. Lines can be hidden behind other lines if a view depth is set too high." When the view depth is high, Tekla Structures renders many internal lines that are hidden behind other lines but still computed. Object-level settings add per-object line visibility rules, increasing the computation. The advanced options `XS_DRAW_CAST_UNIT_INTERNAL_LINES`, `XS_DRAW_CAST_PHASE_INTERNAL_LINES`, and `XS_HIDDEN_REMOVE_DOUBLE_LINES` control how internal and hidden lines are processed. Incorrect values cause excessive line computation during drawing opening.

### Fix

1. **Set advanced options to reduce line computation**:
   - Go to File > Settings > Advanced options
   - Set `XS_DRAW_CAST_UNIT_INTERNAL_LINES=FALSE` (default is TRUE)
   - Set `XS_DRAW_CAST_PHASE_INTERNAL_LINES=FALSE` (default is TRUE)
   - Set `XS_HIDDEN_REMOVE_DOUBLE_LINES=TRUE` (default is FALSE)
   - These reduce the number of internal lines computed

2. **Reduce view depth in drawings**:
   - Open the drawing view properties
   - Reduce the view depth to the minimum needed
   - This reduces hidden line computation

3. **Simplify object-level settings**:
   - Review the object-level settings on the drawing
   - Remove unnecessary settings
   - Combine similar settings
   - Reduce the number of per-object overrides

4. **Update to the latest service pack**:
   - Each service pack includes performance improvements
   - Drawing opening speed is improved in recent versions

5. **Use Autosave to prevent data loss**:
   - Set autosave interval in File > Settings > Options > General settings > Autosave
   - This doesn't fix the speed but prevents data loss during long waits

6. **Remove reference models if views are slow**:
   - Reference models add to the view computation load
   - Detach unnecessary reference models
   - Use lightweight reference models

### Community Report

> "I am working on a project with several Object-level settings and it takes around 20 minutes to open the drawing. Drawing speed can be affected by how many lines are shown on a drawing. Lines can be hidden behind other lines if a view depth is set to high. Set XS_DRAW_CAST_UNIT_INTERNAL_LINES=FALSE, XS_DRAW_CAST_PHASE_INTERNAL_LINES=FALSE, XS_HIDDEN_REMOVE_DOUBLE_LINES=TRUE."

## 2. Model View Performance Slow from Repetitive Geometry

### Symptom

Model view opening is slow when there is a large number of repetitive steel parts, precast parts, and item geometries. Navigating in the model view consumes excessive memory. Zooming and panning are laggy. The model becomes unresponsive with many similar parts.

### Root Cause

Before Tekla Structures 2024, each repetitive part geometry was rendered independently, even when parts shared identical geometry. This meant the GPU had to process each instance separately, consuming excessive memory and CPU. "Model view rendering now uses part geometry instancing to speed up the view opening and navigation in the view" (TTSD-59522, 2024 fix). Without instancing, 10,000 identical beams required 10,000 separate geometry uploads to the GPU. With instancing, the geometry is uploaded once and instanced 10,000 times.

### Fix

1. **Update to Tekla Structures 2024 or later**:
   - Install the latest version

2. **Disable model history collection**:
   - Go to File > Settings > Advanced options
   - Set `XS_COLLECT_MODEL_HISTORY=FALSE`
   - This stops automatic collection of model history, saving memory

3. **Update graphics card drivers**:
   - Visit the graphics card manufacturer's website
   - Install the latest driver
   - In some cases, downgrading the driver helps

4. **Avoid high contrast mode**:
   - Use the standard Windows theme
   - High contrast affects rendering performance

5. **Use lightweight representations**:
   - For large models, use lightweight part representations
   - Reduce the level of detail in model views
   - Use area selection to limit visible parts
   - Hide unnecessary parts

6. **Be aware of navigation memory consumption**:
   - Even with instancing, navigation uses memory
   - Work in smaller areas of the model
   - Close views when not needed

7. **Meet hardware recommendations**:
   - Check RAM, GPU, and CPU requirements
   - Upgrade hardware if below recommendations

### Community Report

> "Model view rendering now uses part geometry instancing to speed up the view opening and navigation in the view. This speeds up the model view opening considerably when there is a large number of repetitive steel part, precast part, and item geometries in the model view. Also, there is significant memory save on the initial view opening. However, navigating in the model still consumes more memory if there are a lot of geometry instances to be rendered."

## 3. IFC Export UDA Inheritance Errors from Missing Assembly Values

### Symptom

When exporting to IFC4, user-defined attribute (UDA) values that were inherited from the assembly main part were not written to assembly objects. The IFC4 export is missing UDA values that should be inherited from the main part. The IFC2x3 export works differently, causing inconsistency.

### Root Cause

"Previously, the user-defined attribute values that were inherited from the assembly main part were not written to assembly objects in the IFC4 export." The IFC4 export had a bug where UDA inheritance from the main part to the assembly was not implemented. In IFC2x3, this inheritance worked correctly. The inconsistency between IFC2x3 and IFC4 export caused confusion. In Tekla Structures 2025, this was fixed: "When you fetch the UDA from the assembly, and the UDA has no value or has the default value, Tekla Structures tries to fetch the value from the assembly main part."

### Fix

1. **Update to Tekla Structures 2025 or later**:
   - Install Tekla Structures 2025
   - The IFC4 export now correctly inherits UDAs

2. **Configure XSR_DISABLE_ASSEMBLY_UDA_INHERITANCE**:
   - Set to `FALSE` (default): UDA is inherited from the main part
   - Set to `TRUE`: UDA is left empty or uses assembly level's default value
   - Choose based on your project requirements

3. **Set UDAs at the assembly level**:
   - To avoid inheritance issues
   - Set UDAs directly on the assembly
   - Not just on the main part
   - This ensures the UDA is always exported

4. **Use IFC2x3 as a workaround**:
   - If you can't update to 2025
   - Use IFC2x3 export instead of IFC4
   - IFC2x3 correctly inherits UDAs from the main part
   - But note: "Rebar assemblies do not work in the IFC2x3 export"

5. **Verify IFC export after update**:
   - After updating to 2025
   - Export a test model to IFC4
   - Check that all UDAs are present
   - Compare with the IFC2x3 export

6. **Use IFC4 for rebar assemblies**:
   - This is another reason to use IFC4 after the fix

7. **Check IFC property set configuration**:
   - Update your environment to use the new location
   - Set `XS_INP` to include `\common\collaboration\ifc`
   - This ensures property sets are found

### Community Report

> "Previously, the user-defined attribute values that were inherited from the assembly main part were not written to assembly objects in the IFC4 export. This issue has now been fixed. When you fetch the UDA from the assembly, and the UDA has no value or has the default value, Tekla Structures tries to fetch the value from the assembly main part. You can disable this functionality using the advanced option XSR_DISABLE_ASSEMBLY_UDA_INHERITANCE."

## 4. Component Nesting Circular Reference Crash

### Symptom

Tekla Structures crashes when nesting specific components — adding component A inside component B and vice versa. The crash is unexpected and may happen during model saving or component creation. The model may become unstable after the crash.

### Root Cause

"An issue was fixed where nesting specific components, such as adding component A inside component B and vice versa, could cause Tekla Structures to crash." The circular nesting of components created a circular dependency that the software couldn't resolve. When component A references component B and component B references component A, the software enters an infinite loop trying to resolve the dependencies, leading to a crash. "The logic has been updated to prevent this circular behavior and ensure model stability" in 2024 SP13.

### Fix

1. **Update to Tekla Structures 2024 SP13 or later**:
   - Install 2024 SP13 or later

2. **Avoid circular component nesting**:
   - Don't add component A inside component B
   - And component B inside component A
   - This creates a circular dependency
   - Restructure the component hierarchy

3. **Use linear component nesting**:
   - Nest components in a linear hierarchy
   - Component A inside Component B inside Component C
   - Never create a cycle
   - This prevents the circular reference

4. **Check for existing circular references**:
   - If you have an existing model that crashes
   - Look for circular component nesting
   - Break the cycle by removing one nesting
   - Update to SP13+

5. **Report new crash scenarios**:
   - If you find new component nesting crashes
   - Contact Tekla support
   - Provide the model and component details
   - Report the specific nesting pattern

6. **Back up before complex nesting**:
   - Always save a backup before complex nesting
   - Use Autosave
   - If the model crashes and becomes unstable
   - Restore from backup

### Community Report

> "An issue was fixed where nesting specific components, such as adding component A inside component B and vice versa, could cause Tekla Structures to crash. The logic has been updated to prevent this circular behavior and ensure model stability."

## 5. Storing Modifying Large Object Slowness in 2025

### Symptom

In Tekla Structures 2025, storing, deleting, and modifying large numbers of model objects is slightly slower than in previous versions. Operations that were fast in 2024 are noticeably slower in 2025. The slowdown affects large models with thousands of objects.

### Root Cause

"In Tekla Structures 2025, the performance of storing, deleting, and modifying large numbers of model objects was slightly slower than in previous versions" (TTSD-68404). This was a performance regression introduced in the 2025 release. The new features and changes in 2025 inadvertently affected the performance of bulk object operations. The issue was identified and fixed in 2025 SP1.

### Fix

1. **Update to Tekla Structures 2025 SP1 or later**:
   - Install 2025 SP1 or later
   - The performance regression is resolved

2. **Use the latest service pack**:
   - Always install the latest service pack
   - Service packs include performance fixes
   - Check Tekla Downloads for the latest SP
   - Don't stay on the base release

3. **Optimize large model operations**:
   - For very large models
   - Work in smaller areas
   - Use selection filters to limit operations
   - Avoid bulk operations on the entire model

4. **Monitor performance after update**:
   - After updating to SP1
   - Test storing, deleting, and modifying operations
   - Compare with 2024 performance
   - Report any remaining issues to Tekla support

5. **Use model sharing for large projects**:
   - For very large projects
   - Use Tekla Model Sharing
   - This distributes the model across users
   - Reduces the load on individual instances

6. **Check stirrup dimensioning performance**:
   - This was also fixed (TSAC-7169)
   - Update to the latest version
   - Stirrup dimensioning speed is back to normal

### Community Report

> "In Tekla Structures 2025, the performance of storing, deleting, and modifying large numbers of model objects was slightly slower than in previous versions. This issue has now been fixed. When using the drawing dimensioning method Filter to dimension a large group of stirrups created with a rebar set, the drawing creation and update was very slow, so that Tekla Structures seemed unresponsive. This issue has now been fixed and the speed is back to normal."

## 6. Additional Tekla Structures Issues

### STEP/IGES Export Special Characters

**Issue**: "Previously, the export failed to finish the conversion if the model folder path or file name contained special characters" (2025 SP4).
**Fix**: Update to 2025 SP4. "This issue has now been fixed." Avoid special characters in paths as best practice.

### View Placement for Oversized Views

**Issue**: "Previously, these views would not move; now, they are adjusted to fit the drawing sheet as much as possible after being cloned" (2025 SP4).
**Fix**: Update to 2025 SP4. Set `XS_DRAWING_UPDATE_VIEW_PLACING=TRUE`. Views are now auto-adjusted.

### DSTV/NC Export Bending Lines

**Issue**: "When you exported a polybeam plate with cuts where the width was greater than the length, the bending lines were created in the incorrect position" (2024 SP13).
**Fix**: Update to 2024 SP13. The bending line position is now correct.

### IFC4 Export Missing Properties

**Issue**: "Some properties (Revision property, DRAWING.REVISION, DRAWING.ASSEMBLY, and DRAWING.CAST_UNIT) were not exported in the IFC4 export" (2024 SP13).
**Fix**: Update to 2024 SP13. These properties are now exported correctly.

### IFC Property Sets Custom Properties

**Issue**: "When creating property sets for the IFC export, you can now select and add also custom properties" (2024 SP13).
**Fix**: Update to 2024 SP13. Use custom properties in IFC property sets.

### Viewpoint Setting Crash

**Issue**: "In very rare cases, Tekla Structures might have unexpectedly stopped working when setting a viewpoint" (2024 SP13).
**Fix**: Update to 2024 SP13. The crash is fixed.

### IFC4.3 Bearing Support

**Issue**: "Now, the IFC4.3 export also supports IfcBearing when the Reference view or Design transfer view export type is used" (2024 SP13).
**Fix**: Update to 2024 SP13 for IFC4.3 bearing support.

## Best Practices

1. **Set advanced options for drawing speed** — `XS_DRAW_CAST_UNIT_INTERNAL_LINES=FALSE`, `XS_HIDDEN_REMOVE_DOUBLE_LINES=TRUE`
2. **Reduce view depth in drawings** — minimizes hidden line computation
3. **Update to Tekla Structures 2024+ for part geometry instancing** — speeds up model view opening
4. **Disable model history collection** — `XS_COLLECT_MODEL_HISTORY=FALSE` saves memory
5. **Keep graphics drivers updated** — but try downgrading if performance degrades
6. **Update to 2025 SP1+ for large object performance fix** — resolves storing/modifying slowness
7. **Update to 2024 SP13+ for component nesting crash fix** — prevents circular reference crashes
8. **Use IFC4 export for rebar assemblies** — IFC2x3 doesn't support rebar assemblies
9. **Configure XSR_DISABLE_ASSEMBLY_UDA_INHERITANCE** — controls UDA inheritance in IFC4
10. **Always install the latest service pack** — includes all performance and stability fixes
