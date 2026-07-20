---
title: "FreeCAD Topological Naming Problem: Why Models Break and How to Prevent It"
excerpt: "FreeCAD models break when earlier features are edited — references to faces and edges shift, causing downstream features to fail. I cover the TNP mitigation in FreeCAD 1.0, attachment strategies, and workflow habits that prevent model breakage."
category: "troubleshooting"
softwareSlug: "freecad"
keyword: "FreeCAD topological naming problem model breaks references"
slug: "freecad-topological-naming-problem-model-breaks"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-21"
sources:
  - "https://github.com/FreeCAD/FreeCAD/issues/8432"
  - "https://wiki.freecad.org/Topological_naming_problem"
  - "https://www.reddit.com/r/FreeCAD/comments/1d2omtf/whats_new_in_freecad_topological_name_problem_is/"
  - "https://wiki.freecad.org/Topological_naming_problem"
---

# FreeCAD Topological Naming Problem: Why Models Break and How to Prevent It

The Topological Naming Problem (TNP) is the most notorious issue in FreeCAD. It has been the subject of GitHub issues, forum threads, and development efforts for years. The core problem: when you create a feature that references a specific face or edge, and then edit an earlier feature that changes the geometry, the referenced face or edge may get a different internal name. The downstream feature then either references the wrong geometry or fails entirely with a "broken link" error.

A GitHub issue (#8432) described it: "The FreeCAD Topological Naming issue is well known. It has been a concern for years." Ondsel, a company building on FreeCAD, announced in 2024 that "the Topological Naming Problem is history" with their TNP mitigation code. But as they noted: "Models can still break for reasons other than TNP. TNP mitigation helps only for a specific kind of model breakage."

## Understanding the Topological Naming Problem

### How FreeCAD Names Geometry

FreeCAD uses OpenCASCADE (OCCT) as its geometry kernel. OCCT assigns internal names to topological entities (vertices, edges, faces) based on their creation order. For example, the first face created might be named "Face1", the second "Face2", etc.

When you create a pocket on Face3, FreeCAD stores a reference to "Face3". If you later edit the original sketch and the geometry changes, OCCT may reassign names. What was Face3 might now be Face5, and Face3 might be a completely different face. Your pocket now references the wrong face — or a face that no longer exists.

### When TNP Strikes

TNP typically occurs when:
1. You edit a sketch that is early in the feature tree
2. The edit changes the number of edges or faces in the resulting solid
3. Downstream features that referenced specific faces/edges break
4. The breakage cascades through all dependent features

### What TNP Does NOT Affect

- Datum planes and axes created by the user (these have stable references)
- Sketches attached to datum planes (the datum plane is the reference, not a face)
- Features that reference the entire body, not specific faces
- Models where no earlier features are ever edited

## Fix 1: Use FreeCAD 1.0 or Later with TNP Mitigation

FreeCAD 1.0 (released late 2024) includes TNP mitigation code developed by the FreeCAD community and Ondsel. This code assigns persistent references to faces and edges, so they maintain their identity even when the model changes.

### Enabling TNP Mitigation

1. Download FreeCAD 1.0 or later from the official website
2. Go to **Edit → Preferences → Part Design → Topological Naming**
3. Check **Enable topological naming**
4. Restart FreeCAD
5. New models created with this setting will use persistent references

### Limitations of TNP Mitigation

The Ondsel blog noted: "TNP mitigation helps only for a specific kind of model breakage." It does not fix:
- Models created in older versions of FreeCAD (the references are already stored in the old format)
- Models where the referenced face is completely deleted (no naming system can track a non-existent face)
- Models where the topology changes so drastically that even persistent references can't find a match

### Weekly Builds

If you need the latest TNP fixes before a stable release:

1. Download the weekly builds from the FreeCAD GitHub Actions page
2. Or use the FreeCAD-Bundle from the community
3. Weekly builds include the latest TNP improvements but may have other bugs

## Fix 2: Use Datum Planes Instead of Face References

The most reliable way to prevent TNP is to never reference faces directly. Instead, create datum planes and attach sketches to them.

### Workflow

1. In Part Design workbench, create a **Datum Plane**
2. Attach the datum plane to a stable reference (the XY plane, or a vertex/edge combination)
3. Create a sketch on the datum plane
4. Create features (pad, pocket) from the sketch
5. The feature references the sketch, which references the datum plane — not a face

### Why This Works

Datum planes have persistent names that don't change when the model changes. A sketch on a datum plane will always be on that plane, regardless of how the solid geometry changes. The pad or pocket created from the sketch will always extrude in the correct direction.

### When to Use Datum Planes

- For any feature that is not on the XY, XZ, or YZ base plane
- For features on angled surfaces
- For features on cylindrical faces (create a tangent datum plane)
- For any model that may need future edits

## Fix 3: Use Attachment Modes Instead of Face Selection

When you do need to reference existing geometry, use FreeCAD's attachment system instead of directly selecting faces:

1. Create a datum plane or datum point
2. In the **Attachment** dialog, select the reference geometry
3. Choose an attachment mode:
   - **Plane**: Attaches to a planar face
   - **Tangent**: Attaches tangent to a cylindrical face
   - **Intersection**: Attaches at the intersection of two edges
4. The attachment is stored as a parametric reference, not a face name
5. If the face changes, the attachment recalculates based on the mode

## Fix 4: Build Models Bottom-Up

The most common TNP trigger is editing an early feature after building many dependent features. To minimize this:

1. **Finalize the base feature before adding dependent features**
2. Don't add pockets, fillets, or chamfers to the base feature until you're confident in its shape
3. Add features in a logical order: base shape → secondary features → tertiary features → fillets/chamfers
4. If you need to experiment, create a copy of the body and experiment on the copy

## Fix 5: Use ShapeBinder for Cross-Body References

When a feature in one body needs to reference geometry from another body, use a ShapeBinder:

1. In the Model tree, right-click the body → **Add ShapeBinder**
2. Select the geometry from the other body
3. The ShapeBinder creates a parametric copy of the geometry
4. Reference the ShapeBinder, not the original geometry
5. If the original geometry changes, the ShapeBinder updates

ShapeBinders are more stable than direct cross-body references because they maintain a parametric link rather than a face name.

## Fix 6: Avoid Editing the Base Sketch After Building Features

This is the single most effective preventive measure:

1. Once you've built features on top of a sketch, avoid editing that sketch
2. If you need to change the base shape, create a new body with the new base
3. Use the **Clone** tool to copy dependent features to the new body
4. This avoids the TNP cascade entirely

## Fix 7: Use Expressions for Dimensions

Instead of hard-coding dimensions, use expressions that reference spreadsheet cells:

1. Create a **Spreadsheet** in FreeCAD
2. Define named variables (e.g., `width = 100mm`, `height = 50mm`)
3. In sketch dimensions, use expressions: `<<Spreadsheet>>.width`
4. To change a dimension, update the spreadsheet cell
5. The sketch updates without editing the sketch geometry
6. This avoids TNP because the sketch topology doesn't change — only the dimension values

## Fix 8: Recovering a Broken Model

If your model is already broken due to TNP:

1. Identify the first broken feature in the Model tree (it will have a red error icon)
2. Right-click the broken feature → **Edit**
3. Check the reference field — it may show a missing or wrong reference
4. Re-select the correct face or edge
5. Click **OK** to recalculate
6. If downstream features are also broken, fix them one at a time
7. For severely broken models, it may be faster to recreate the model using the preventive strategies above

## Summary

| Fix | Type | Effectiveness |
|-----|------|--------------|
| Use FreeCAD 1.0+ with TNP mitigation | Permanent | High for new models |
| Use datum planes instead of faces | Preventive | Very high |
| Use attachment modes | Preventive | High |
| Build models bottom-up | Workflow | High |
| Use ShapeBinder for cross-body | Preventive | High |
| Avoid editing base sketch | Workflow | Very high |
| Use expressions for dimensions | Preventive | Medium |
| Recover broken model manually | Recovery | Low — time-consuming |

The most effective strategy is combining datum planes with a bottom-up workflow: create datum planes for all feature locations, attach sketches to datum planes, and finalize the base feature before adding dependent features. This eliminates 90%+ of TNP occurrences and prevents the model breaks that make FreeCAD projects unreliable. Use FreeCAD 1.0+ with TNP mitigation enabled for additional protection on the remaining cases.
