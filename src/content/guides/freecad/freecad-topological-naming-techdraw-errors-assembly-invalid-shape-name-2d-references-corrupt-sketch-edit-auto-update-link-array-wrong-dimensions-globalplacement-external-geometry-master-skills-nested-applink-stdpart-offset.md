---
title: "FreeCAD Topological Naming Problem and TechDraw Dimension Errors: Assembly Invalid Shape Name from TNP Requiring Manual Reference Reassignment, TechDraw 2D References Corrupt from Sketch Edit Requiring Auto Update Disable, Link Array Objects Produce Wrong TechDraw Dimensions from Missing globalPlacement, External Geometry References Break on Previous Layer Edits from TNP, and Nested AppLink with StdPart Container Offset Renders Wrong TechDraw Position"
excerpt: "FreeCAD fails for 5 distinct reasons: Assembly Invalid Shape Name from TNP requiring manual reference reassignment, TechDraw 2D references corrupt from Sketch edit requiring Auto Update disable in Sketcher settings, Link Array objects produce wrong TechDraw dimensions from missing globalPlacement equivalent, external geometry references break on previous layer edits from TNP requiring master sketches, and nested AppLink with StdPart container offset renders wrong TechDraw position from Part::Feature::getShape. We cover each with fixes from FreeCAD Forum and GitHub."
category: "topological-naming-and-techdraw-errors"
softwareSlug: "freecad"
keyword: "FreeCAD topological naming problem TNP Assembly Invalid Shape Name TechDraw 2D references corrupt Sketch edit Auto Update disable Link Array wrong dimensions globalPlacement external geometry references break previous layer master sketches nested AppLink StdPart container offset wrong position Part Feature getShape"
slug: "freecad-topological-naming-techdraw-errors-assembly-invalid-shape-name-2d-references-corrupt-sketch-edit-auto-update-link-array-wrong-dimensions-globalplacement-external-geometry-master-skills-nested-applink-stdpart-offset"
author: "CADGuide Tools Editorial Team"
readTime: "13 min"
date: "2025-07-31"
sources:
  - "https://forum.freecad.org/viewtopic.php?t=98913"
  - "https://forum.freecad.org/viewtopic.php?style=1&t=104002"
  - "https://github.com/FreeCAD/FreeCAD/issues/13375"
---

# FreeCAD Topological Naming Problem and TechDraw Dimension Errors: Assembly Invalid Shape Name from TNP Requiring Manual Reference Reassignment, TechDraw 2D References Corrupt from Sketch Edit Requiring Auto Update Disable, Link Array Objects Produce Wrong TechDraw Dimensions from Missing globalPlacement, External Geometry References Break on Previous Layer Edits from TNP, and Nested AppLink with StdPart Container Offset Renders Wrong TechDraw Position

FreeCAD's topological naming problem, TechDraw dimensions, and assembly references produce errors from reference instability, sketch recompute conflicts, and nested link rendering. This guide covers the 5 most common FreeCAD problems with diagnostic steps and community-verified fixes from FreeCAD Forum and GitHub.

## 1. Assembly Invalid Shape Name from Topological Naming Problem

### Error Message

"Assembly: Invalid shape name 'Face1'"

### Symptom

After making a small change to a part, the error "Assembly: Invalid shape name 'Face1'" appears in assemblies. Even after undoing changes and recalculating, the error persists. The assembly is broken — can't create new joints or reset positions. Sometimes the error appears on opening a previously working assembly without any changes.

### Root Cause

The Topological Naming Problem (TNP) is FreeCAD's fundamental instability issue. When a model is modified, the internal data structure names (Face1, Edge2, Vertex3) change. References to these names in downstream features (assemblies, sketches, constraints) become invalid. FreeCAD 1.0 improved TNP mitigation but didn't fully solve it. The error persists even after undo because the reference cache is corrupted.

### Fix

1. **Understand TNP is a fundamental FreeCAD issue**:
   - "The difficulty you have is related to the Topological Naming Problem (TNP)"
   - "When you change/modify your model, references to specific faces, edges get lost and your model creates errors"
   - "FreeCAD 1.0 was a major improvement" but not a complete fix

2. **Reassign references manually**:
   - "You might be able to rectify some lost references by reassigning 'new' face names"
   - Open the assembly joint that's broken
   - Select the new face/edge that corresponds to the original reference
   - Reassign the reference in the joint properties

3. **Use master sketches as references**:
   - "One approach is using master sketches on which you base other sketches (like a reference)"
   - Create a master sketch with key geometry
   - Attach subsequent sketches to the master sketch, not to faces
   - Changes to the model don't break master sketch references

4. **Avoid attaching sketches to faces**:
   - "Another one to avoid attaching sketches to faces"
   - Attach sketches to planes (XY, XZ, YZ) with offsets instead
   - Plane references are stable across model changes
   - Use attachment offset to position the sketch

5. **Keep models simple and broken down**:
   - "Try to keep models broken down in simple bodies"
   - Each body should be self-contained
   - Minimize cross-body references
   - Use Std.Part as assembly container for static assemblies

6. **Consider alternative assembly workbenches**:
   - "Other Assembly WBs that are favoured over the stock Assembly WB, like A2plus or Assembly4"
   - "They are also prone to TNP issues" but may have better workarounds
   - Assembly4 uses datum references instead of face/edge references

7. **Copy the working directory before critical changes**:
   - "I will probably copy the entire working directory before every critical change"
   - "So that I can restore the original state"
   - This is a practical workaround for persistent TNP issues

### Community Report

> "After making a small change on a part I get 'Assembly: Invalid shape name Face1.' Even if I undo the changes and recalculate everything, I'm stuck. Yesterday the assembly was fine. Today, upon opening, the error occurs again even without changes. The difficulty is related to the Topological Naming Problem."

## 2. TechDraw 2D References Corrupt from Sketch Edit

### Error Message

"DVD::getDimValue - Dimension096 - 2D references are corrupt (5)"

### Symptom

While editing a sketch, huge amounts of TechDraw errors appear in the report view. Each dimension referencing the sketch generates a separate error for every line drawn or constraint changed. Errors stop when the sketch is closed. With 100+ dimensions per page, this is extremely distracting and uses significant CPU.

### Root Cause

When a sketch is in edit mode, the sketch shape temporarily disappears from the TechDraw view. TechDraw dimensions reference edges/vertices of the sketch shape. When the shape disappears (during edit), the dimensions can't find their references and report "2D references are corrupt." The Sketcher's Auto Update setting triggers recompute on every edit, causing repeated TechDraw errors.

### Fix

1. **Turn off Auto Update in Sketcher**:
   - "It is the Sketcher settings, not the TechDraw settings, that control this recompute behavior"
   - "Turn off 'Auto Update' in the Sketcher"
   - This prevents recompute during sketch editing
   - Errors stop appearing while editing

2. **Manually recompute after closing sketch**:
   - With Auto Update off:
   - "When Sketch is closed, the Sketch shape disappears from TechDraw page view"
   - "Dimensions will produce '2D references are corrupt' error"
   - "Problem is solved by manually triggering recompute all"
   - Press Ctrl+R or Edit > Refresh

3. **Disable "Show report view on warning/error"**:
   - In Preferences > General > Report view
   - Uncheck "Show report view on warning/error"
   - This hides the error messages
   - Errors still occur but don't distract

4. **Close sketch before switching to TechDraw tab**:
   - Don't switch to TechDraw page while a sketch is in edit mode
   - Close the sketch first, then switch
   - This prevents the shape disappearance issue

5. **Use SubShape Binder for complex references**:
   - "Some TechDraw Views are made from a Sketch, others are multiple Sketches combined using a Subshape Binder"
   - SubShape Binders may be more stable for TechDraw references
   - Create a SubShape Binder from the sketch, then reference the binder in TechDraw

### Community Report

> "I get huge amounts of TechDraw errors like '2D references are corrupt (5)' while a Sketch is being edited. It is the Sketcher settings, not the TechDraw settings, that control this. Turn off 'Auto Update' in the Sketcher. Problem is solved by manually triggering recompute all after closing the sketch."

## 3. Link Array Objects Produce Wrong TechDraw Dimensions

### Symptom

Creating an assembly using Link Arrays (Draft OrthoArray and Draft PolarArray). Creating a TechDraw drawing with 3D dimensions. Dimensions on Link Array objects are wrong — they show incorrect values or reference the wrong element.

### Root Cause

TechDraw doesn't use the unique `document#Parent.Child` identification system described in the Selection View wiki. Link Array elements have complex parent-child relationships that TechDraw can't resolve correctly. The root issue is the lack of a `globalPlacement()` equivalent for LinkElement (GitHub issue #13978). This was not fixed in FreeCAD v1.0 but was fixed in PR #18641 for later versions.

### Fix

1. **Update to FreeCAD 1.1+ (when available)**:
   - "This will not make it into v1.0"
   - "WandererFan mentioned this in PR #18641: [TD] Long and link dim refs (fix #13375)"
   - The fix was merged in December 2024
   - Use weekly builds or wait for 1.1 release

2. **Dimension the original object, not the array instance**:
   - Create dimensions on the source object (before array)
   - The array instances will have the same dimensions
   - This avoids the Link Array reference issue

3. **Use manual dimensions in TechDraw**:
   - Instead of 3D-referenced dimensions
   - Use TechDraw's manual dimension tools
   - Dimension directly on the 2D drawing view
   - These don't depend on 3D object references

4. **Explode the array for dimensioning**:
   - Use Draft > Downgrade on the array to explode it
   - Each element becomes a separate object
   - Dimension individual objects
   - Trade-off: loses parametric array relationship

5. **Use Link Array without TechDraw dimensions**:
   - If dimensions aren't critical
   - Use the Link Array for the 3D model
   - Add dimensions manually in the drawing
   - Or export to DXF and dimension in another tool

### Community Report

> "TechDraw does not use the unique identifications described in the Selection View wiki and therefore cannot deal with dimensions of link arrays. Root issue: No globalPlacement() equivalent for LinkElement #13978. This will not make it into v1.0. Fixed in PR #18641."

## 4. External Geometry References Break on Previous Layer Edits

### Symptom

When editing an existing sketch, edges containing fillets or layers using external geometry in subsequent layers get messed up. Need to go through each layer and use the attachment editor to fix sketch attachments or redo dimensions. Adding holes with external geometry references causes inconsistency when changing earlier sketches.

### Root Cause

This is a manifestation of the Topological Naming Problem. When a sketch is edited, the topology (face/edge numbering) of the resulting solid changes. Subsequent features that reference specific faces/edges via external geometry find different geometry at those names. Fillets are particularly problematic because they add new edges and faces, shifting all subsequent numbering.

### Fix

1. **Use weekly builds with TNP mitigation**:
   - "I downloaded the weekly build and the sample workflow works correctly now"
   - "I added holes with external geometry references and they remained consistent"
   - FreeCAD 1.0+ has improved TNP mitigation
   - Use the latest version or weekly builds

2. **Minimize external geometry references**:
   - "The smaller number of external references cuts down the chance of errors"
   - Use construction lines within the sketch instead of external geometry
   - Reference master sketches instead of solid faces
   - Use datum planes and axes for stable references

3. **Use attachment offset instead of face attachment**:
   - Attach sketches to datum planes with offset
   - Datum planes are stable across topology changes
   - Use PartDesign > Datum > Plane to create reference planes

4. **Put critical geometry in the first sketch**:
   - Define key dimensions in the base sketch
   - Subsequent sketches reference the base sketch
   - Changes to the base sketch propagate correctly
   - Avoid referencing features added later (fillets, chamfers)

5. **Clean up stale external geometry references**:
   - "Sketch003 still contains a stale/broken external geometry reference"
   - "Even though the current sketch constraints no longer depend on it"
   - Open the sketch, delete unused external geometry
   - Use the Sketcher tools to identify broken references

6. **Use SubShape Binders for cross-body references**:
   - Create a SubShape Binder from the face/edge
   - Reference the SubShape Binder in the sketch
   - SubShape Binders are more stable than direct external geometry

### Community Report

> "When I make an edit to an existing sketch, edges that contain fillets or layers that use external geometry in subsequent layers get messed up. I need to go through each one carefully and use the attachment editor to fix sketch attachments. You've discovered the Topological Naming Problem."

## 5. Nested AppLink with StdPart Container Offset Renders Wrong TechDraw Position

### Symptom

TechDraw renders App Links to PartDesign Bodies at wrong positions when they are contained in two layers of Std Part containers with offsets. The PartDesign bodies appear at incorrect positions or not at all in the TechDraw view. This only happens with nested AppLink objects — direct PartDesign Bodies render correctly.

### Root Cause

Three conditions must combine to trigger this bug:
1. The project structure contains at least two layers of AppLink objects (nested AppLinks)
2. The linking container (AppLink) has an offset
3. TechDraw draws only some of the contained AppLinks, not the entire container

When these conditions are met, TechDraw "forgets" to consider the offset of the skipped StdPart container. The root cause is in Part::Feature::getShape, which returns a malformed shape. TechDraw faithfully renders the malformed shape.

### Fix

1. **Use AppLinks only at the lowest level (leaf nodes)**:
   - "As a temporary workaround, one must only use AppLinks on the lowest level (i.e., in leaf nodes) for bolts, nuts, screws, etc."
   - Don't nest AppLinks inside other AppLinks
   - Use real PartDesign Bodies at intermediate levels

2. **Replace nested AppLinks with real PartDesign Bodies**:
   - "If the AppLink object is replaced by a real PartDesign Body, the TechDraw drawing is correct"
   - At intermediate container levels, use real objects instead of links
   - This eliminates the nested link issue

3. **Avoid offsets on AppLink containers**:
   - "The linking container, i.e., the AppLink, needs an offset"
   - If possible, set the AppLink offset to zero
   - Apply the offset to the contained objects instead

4. **Select the entire container in TechDraw**:
   - "The container is left out" when selecting individual AppLinks
   - Select the entire StdPart container for the TechDraw view
   - This avoids the partial selection issue

5. **Track the GitHub issue for a fix**:
   - "Fixing this is better done in App::Part or Part::Feature::getShape"
   - The issue is confirmed in FreeCAD 1.2
   - Monitor GitHub issue #21550 for progress

6. **Use exploded views instead of nested containers**:
   - Flatten the assembly structure
   - Use a single level of StdPart containers
   - Place all AppLinks at the same level
   - This avoids the nesting that triggers the bug

### Community Report

> "TechDraw renders App Links to PartDesign Bodies at wrong position if they are contained in two layers of Std Part containers with offsets. Three conditions must combine: nested AppLinks, AppLink with offset, and TechDraw draws only some contained AppLinks. As a temporary workaround, use AppLinks only at the lowest level for bolts, nuts, screws."

## 6. Additional FreeCAD Issues

### Assembly Breaks on Opening Without Changes

**Issue**: Assembly was fine yesterday, today "Invalid shape name" error appears on opening.
**Fix**: TNP-related issue. The reference cache is stale. Try recompute all (Ctrl+R). If that fails, delete and recreate the broken joints. Copy the working directory before critical changes.

### TechDraw Shape Disappears During Sketch Edit

**Issue**: Shape disappears from TechDraw page when a related sketch is in edit mode.
**Fix**: "If 'Auto Update' is turned off in Sketch edit, there are no TechDraw errors while editing. When the sketch is closed, the shape disappears and dimensions produce errors. Problem is solved by manually triggering recompute all."

### Conflicting Joints and Constraints

**Issue**: Assembly is sluggish due to conflicting joints and assembly constraints.
**Fix**: "Assembly constraints in Fusion are NOT meant to replace joints. Joints are generally faster than assembly constraints. Use joints for 90%+ of the assembly."

### Stale External Geometry Warning

**Issue**: "External geometry missing reference" warning appears even though the model works correctly.
**Fix**: Open the sketch and delete the stale external geometry reference. The warning is from a previous reference that's no longer used but hasn't been cleaned up.

## Best Practices

1. **Use master sketches for references** — avoids TNP face/edge references
2. **Attach sketches to planes with offsets** — not to faces
3. **Keep models broken down in simple bodies** — minimizes TNP impact
4. **Turn off Sketcher Auto Update** — prevents TechDraw corrupt reference errors
5. **Manually recompute after closing sketch** — restores TechDraw views
6. **Update to FreeCAD 1.1+ for Link Array dimension fix** — PR #18641
7. **Minimize external geometry references** — reduces TNP breakage
8. **Use SubShape Binders for cross-body references** — more stable
9. **Use AppLinks only at leaf nodes** — avoids nested link rendering bugs
10. **Copy working directory before critical changes** — practical TNP workaround
