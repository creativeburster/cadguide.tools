---
title: "FreeCAD Assembly and Topological Naming Errors"
excerpt: "FreeCAD Assembly and Topological Naming Errors: symptoms, root causes, and step-by-step fixes, verified against FreeCAD Forum and GitHub Issues."
category: "troubleshooting"
softwareSlug: "freecad"
keyword: "FreeCAD invalid shape name topological naming problem TNP reference reassignment sketcher invalid input toponaming bug Windows weekly build stable bundle face edge IDs change after recompute fillet rectangle hole attachment editor assembly joints break part modification joint recreation crash selecting sketch update"
slug: "freecad-assembly-and-topological-naming-errors"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-02"
sources:
---

# FreeCAD Assembly and Topological Naming Errors: Invalid Shape Name from Topological Naming Problem Requiring Reference Reassignment, Sketcher Invalid Input from Toponaming Bug on Windows Weekly Build Requiring Stable Bundle, Face Edge IDs Change After Recompute from Fillet on Rectangle with Hole Requiring Attachment Editor Fix, Assembly Joints Break After Part Modification Requiring Joint Recreation, and Crash on Selecting Sketch from Invalid Shape Name Edge Requiring Update

FreeCAD's assembly references, sketcher stability, topological naming, joint persistence, and shape selection produce errors from TNP, build-specific bugs, fillet operations, part modifications, and edge naming. This guide covers the 5 most common FreeCAD problems with diagnostic steps and community-verified fixes from FreeCAD Forum and GitHub Issues.

## 1. Invalid Shape Name from Topological Naming Problem

### Symptom

After making a small change on a part in a FreeCAD assembly, error: "Assembly: Invalid shape name ?Face1." Cannot create new joints. Cannot automatically reset positions via recalculation button. The assembly is basically trash — must delete all joints and reassemble. Even opening a previously working assembly the next day triggers the error without any changes.

### Root Cause

"I think the difficulty you have is related to the Topological Naming Problem (TNP). When you change/modify your model, the CAD software needs to update the naming structure along the composition chain. Ideally that should work, in reality it does not 100%." FreeCAD's topological naming assigns names to faces, edges, and vertices based on how they're created. When a model is modified (especially an earlier part in the workflow), these names change, breaking references in assemblies and constraints. "Although FreeCAD 1.0 was a major improvement," TNP still occurs in certain scenarios.

### Fix

1. **Reassign references using the attachment editor**:
   - Open the broken constraint or joint
   - Use the attachment editor to select the new face/edge name
   - Reassign all broken references

2. **Use master sketches as references**:
   - Create a master sketch that defines key geometry
   - Attach other sketches to the master sketch, not to faces
   - This reduces TNP exposure

3. **Avoid attaching sketches to faces**:
   - Attach sketches to planes with offsets instead
   - Use datum planes for sketch attachment
   - Datum planes are more stable than face references

4. **Keep models broken down in simple bodies**:
   - Avoid complex single-body parts
   - Use Std.Part as an Assembly Container for static assemblies
   - Use Assembly WBs for kinematic analysis only

5. **Try alternative Assembly workbenches**:
   - But they may have better recovery tools
   - Test which works best for your workflow

6. **Copy working directory before critical changes**:
   - This is a workaround, not a fix
   - But it prevents losing work to TNP

### Community Report

> "After making a small change on a part I get the error 'Assembly: Invalid shape name ?Face1' in my assemblies. I cannot create new joints and cannot automatically reset all positions. The assembly is basically trash. Yesterday I created an assembly and everything was totally fine. Today I opened it and the error occurs — even without any changes. This is related to the Topological Naming Problem (TNP). You might rectify lost references by reassigning new face names."

## 2. Sketcher Invalid Input from Toponaming Bug on Windows Weekly Build

### Symptom

Using FreeCAD weekly build on Windows. Adding geometry to existing sketches breaks them. On new sketches, only the first geometries added in a single command work — any further additions break the sketch. Error: "Invalid input" in report view. Elements become non-visible in the 3D view after closing the sketch. Extruding a face of a cube fails.

### Root Cause

"Sketcher appears to be completely broken on the latest Windows weekly — seems to be a problem with the toponaming stuff." This is a build-specific bug in the Windows weekly build from the main FreeCAD repository. The bug is related to the topological naming implementation in the sketcher. The FreeCAD-Bundle releases (a different build pipeline) do not have this bug. "This bug is present on the new weekly build from FreeCAD/FreeCAD releases. I built one at FreeCAD/FreeCAD-Bundle/releases and that one does not have the bug."

### Fix

1. **Use the FreeCAD-Bundle weekly build**:
   - Download from: https://github.com/FreeCAD/FreeCAD-Bundle/releases/tag/weekly-builds
   - This build pipeline doesn't have the toponaming bug
   - Use this instead of the main repo weekly

2. **Use the stable release**:
   - Use FreeCAD 1.0.1 or the latest stable release
   - Stable releases are more thoroughly tested
   - The toponaming bug is in the development branch
   - Avoid weekly/dev builds for production work

3. **Use a libpack build**:
   - Build from source using libpack
   - This avoids the pixi build issue

4. **Report the bug on GitHub**:
   - File an issue at https://github.com/FreeCAD/FreeCAD/issues
   - Include OS, version, build date, and build type
   - Provide exact reproduction steps
   - Attach the error messages from the report view

5. **Workaround — add all geometry in one command**:
   - Plan your sketch geometry to minimize separate commands
   - Use polylines instead of individual lines

### Community Report

> "Sketcher is completely broken on the latest Windows weekly. Adding geometry to existing sketches breaks them. Error: 'Invalid input.' This bug is present on the new weekly build from FreeCAD/FreeCAD releases. I built one at FreeCAD/FreeCAD-Bundle/releases and that one does not have the bug. A libpack build also works correctly — seems to be a pixi specific bug."

## 3. Face Edge IDs Change After Recompute from Fillet on Rectangle with Hole

### Symptom

FreeCAD 1.0 RC2 and nightly builds. Create a rectangle, pad it. Create a sketch on the pad face, draw a circle, pocket it. Edit the first sketch, add fillets to all 4 corners and draw a circle in the center. After closing the sketch edit, the reference panel of sketch 2 shows wrong references. Topological naming error occurs.

### Root Cause

"Create a fillet on a rectangle that has a hole — this causes toponaming error." When fillets are added to a rectangle that already has a pocket (hole), the fillet operation changes the face and edge numbering. The pocket sketch's references to the original faces become invalid because the fillet created new faces and renumbered existing ones. The current topological naming mitigation doesn't handle this case correctly.

### Fix

1. **Use the attachment editor to fix references**:
   - Open the pocket sketch properties
   - Use the attachment editor to reassign the reference face
   - Select the correct face on the modified (filleted) pad

2. **Create fillets before pocket**:
   - Change the modeling order
   - Add fillets to the rectangle first
   - Then create the pocket sketch on the filleted pad
   - This avoids the renumbering issue

3. **Use datum planes instead of face references**:
   - Create a datum plane on the pad top face
   - Attach the pocket sketch to the datum plane
   - Datum planes are more stable than face references
   - Fillets won't break datum plane attachments

4. **Use the latest development build**:
   - Update to the latest nightly build
   - Check if the fix has been merged

5. **Avoid fillets on faces with existing features**:
   - Plan the modeling sequence to avoid this scenario
   - Add fillets as one of the last operations
   - Or add fillets before any face-referenced features
   - This prevents reference breakage

6. **Use Part Design body sequencing**:
   - Keep features in logical order within the body
   - Avoid editing early features after later features exist
   - If early features must be edited, expect reference issues
   - Fix references with attachment editor after editing

### Community Report

> "Topological naming error is still present in FreeCAD 1.0 RC2. Create sketch 1, draw rectangle, pad. Create sketch 2 on pad face, draw circle, pocket. Edit sketch 1, fillet all 4 corners, draw circle in center. After closing editing, the reference pane of sketch 2 will be wrong. Create a fillet on a rectangle that has a hole — this causes toponaming error. After modifying the sketch, still need to fix with attachment editor."

## 4. Assembly Joints Break After Part Modification

### Symptom

Assembly was working fine. Modified a part within the assembly — added a groove to a surface that serves as a reference for a constraint. The surface is renamed, causing the constraint to become invalid. The entire assembly breaks down. Cannot create new joints or reset positions.

### Root Cause

"I added a groove to a surface, which may serve as a reference for a constraint. Apparently, the surface is renamed, causing the constraint to become invalid." When a part is modified in a way that changes the surface topology (adding grooves, pockets, fillets), the face names change. Constraints that reference those faces by name become invalid. The entire assembly breaks because the constraint chain is disrupted.

### Fix

1. **Delete and recreate affected joints**:
   - Identify which joints reference the modified surfaces
   - Delete those joints
   - Recreate them with the new surface names

2. **Use datum geometry for constraints**:
   - Instead of constraining to faces, use datum planes or axes
   - Create datum features that are stable across modifications
   - Attach constraints to datum features
   - This prevents joint breakage from face renaming

3. **Copy working directory before modifications**:
   - This is a precautionary workaround
   - Restore if the assembly breaks

4. **Modify parts outside the assembly**:
   - Open the part file separately
   - Make modifications there
   - Use datum references for any new features
   - Then update the assembly

5. **Use A2plus or Assembly4 workbenches**:
   - These may have better reference recovery
   - Test with your workflow
   - They handle TNP differently

6. **Minimize references to modifiable surfaces**:
   - When creating joints, prefer stable references
   - Use base planes, axes, or vertexes
   - Avoid referencing surfaces that might be modified later
   - Plan the assembly structure to minimize TNP exposure

### Community Report

> "The assembly also broke down when I changed a part within the assembly. I added a groove to a surface, which may serve as a reference for a constraint. Apparently, the surface is renamed, causing the constraint to become invalid. But I don't understand why this disrupts the entire assembly. I will probably copy the entire working directory before every critical change so that I can restore the original state."

## 5. Crash on Selecting Sketch from Invalid Shape Name Edge

### Symptom

FreeCAD crashes with SIGSEGV (segmentation fault) when trying to select a specific sketch. Error: "Exception TopoShapeExpansion.cpp(2036): Invalid shape name ?Edge9." The crash happens consistently when selecting the sketch.

### Root Cause

The topological naming system encounters an invalid edge name (?Edge9) that doesn't exist in the current shape. When the code tries to resolve this invalid name, it accesses a null pointer, causing a segmentation fault. This is a crash bug in the topological naming implementation that occurs when shape names become corrupted or reference non-existent elements.

### Fix

1. **Update to the latest version**:
   - Update to FreeCAD 1.0 or later
   - The crash has been fixed in recent builds

2. **Avoid selecting the problematic sketch**:
   - If the crash occurs when selecting a specific sketch
   - Don't select that sketch directly
   - Use the tree view to access it instead
   - Or use the Python console to manipulate it

3. **Recreate the problematic sketch**:
   - Delete the sketch that causes the crash
   - Recreate it from scratch
   - Use stable references (datum planes, not faces)
   - This eliminates the corrupted shape name

4. **Use the Python console for recovery**:
   - Access the sketch via Python API
   - Export the sketch geometry to a file
   - Delete the corrupted sketch
   - Import the geometry into a new sketch

5. **Report the crash on GitHub**:
   - File an issue with the crash details
   - Include the backtrace (SIGSEGV information)
   - Attach the model file if possible
   - Include FreeCAD version and OS information

6. **Keep backups of working files**:
   - Save versions frequently
   - Use FreeCAD's version control (Save As with incremental names)
   - Or use git for FreeCAD files
   - This allows recovery from crashes

### Community Report

> "If I try to select MiddleDiskPocketSketch, FreeCAD crashes with: Exception TopoShapeExpansion.cpp(2036): Invalid shape name ?Edge9. Program received signal SIGSEGV, Segmentation fault. It doesn't crash anymore with version 0.22.0dev.37819. Likely fixed by PR #14699."

## 6. Additional FreeCAD Issues

### Topological Naming Predictable vs Constant Names

**Issue**: Current topological naming uses predictable names that can change with modifications, instead of constant/immutable names.
**Fix**: "PR #17768 proposes constant naming where sub shapes obtain names only on generation and not on modification." This is a conceptual change under development. Until merged, use workarounds (datum planes, master sketches).

### Multiple Assembly Workbenches Confusion

**Issue**: FreeCAD has multiple assembly workbenches (stock Assembly, A2plus, Assembly4) with different approaches.
**Fix**: Test each for your workflow. Assembly4 uses datum-based references which may be more TNP-resistant. A2plus is popular for mechanical assemblies. Stock Assembly is improving but still has TNP issues.

### Models Break Without Changes

**Issue**: "Yesterday the assembly was OK. Today, upon opening, the error was there, even without any change."
**Fix**: This is a TNP manifestation where recompute on load changes face names. Update to latest version. Use datum references. Report persistent cases on GitHub.

## Best Practices

1. **Use datum planes instead of face references for sketches** — datum planes are TNP-resistant
2. **Create master sketches as reference geometry** — base other sketches on master, not on faces
3. **Keep models broken down in simple bodies** — reduces TNP exposure
4. **Use FreeCAD-Bundle weekly builds, not main repo weekly** — avoids pixi-specific toponaming bug
5. **Add fillets before face-referenced features** — prevents face renumbering
6. **Copy working directory before critical changes** — allows restoration
7. **Use attachment editor to fix broken references** — reassign new face names
8. **Avoid selecting sketches that cause crashes** — use tree view or Python console
9. **Update to latest stable or FreeCAD-Bundle** — many TNP crashes are fixed
10. **Plan modeling sequence to avoid editing early features** — prevents reference breakage
