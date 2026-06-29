---
title: "Lumion Model Import: Missing Materials, Flipped Faces, and Revit/SketchUp Export Settings"
excerpt: "Models imported into Lumion with missing materials, flipped faces, or merged geometry are caused by incorrect export settings in Revit and SketchUp. I cover the Surface Smoothing, Geometry Optimization, and material assignment workflow that produces clean imports."
category: "troubleshooting"
softwareSlug: "lumion"
keyword: "Lumion import model missing materials Revit SketchUp export"
slug: "lumion-import-missing-materials-revit-sketchup-fix"
author: "CAD IT Admin"
readTime: "11 min"
date: "2025-06-21"
sources:
  - "https://support.lumion.com/hc/en-us/articles/360008179854-Why-are-your-Lumion-materials-missing-after-re-importing-your-model"
  - "https://support.lumion.com/hc/en-us/articles/360007745233-Model-import-guidelines-for-SketchUp"
  - "https://support.lumion.com/knowledge-base/api/v2/help_center/en-us/articles/360007787973.json"
---

# Lumion Model Import: Missing Materials, Flipped Faces, and Revit/SketchUp Export Settings

I work with architecture firms that use Revit, SketchUp, and ArchiCAD, and they all send models to Lumion for rendering. The most common complaint I hear is "My materials are missing when I import into Lumion" or "My model looks wrong — faces are flipped and everything is one material." These issues are almost always on the export side, not the Lumion side.

## Problem 1: Materials Missing After Re-importing

When you update a model and re-import it into Lumion, all your carefully assigned Lumion materials disappear. The model comes in with default materials, and you have to reassign everything.

**Root cause**: Lumion matches materials between imports using the material names from the source file. If the material names change in Revit or SketchUp between exports, Lumion can't match them to the previously assigned materials.

**Fix for Revit**:
1. Ensure all versions of Revit on all computers use the **same version of the Lumion plug-in**
2. Don't rename materials between exports — keep material names consistent
3. Use the **LiveSync** plugin instead of manual export/import — LiveSync maintains material assignments across updates
4. If materials still disappear, check the Lumion log file for material name mismatches

**Fix for SketchUp**:
1. Name materials consistently in SketchUp — the material name in SketchUp becomes the identifier in Lumion
2. Don't reorganize material folders between exports
3. Use the **Lumion LiveSync for SketchUp** plugin for real-time synchronization

## Problem 2: Flipped or Invisible Faces

Some faces of the model are invisible when viewed from certain angles in Lumion. This is a back-face culling issue — Lumion only renders the front face of each polygon.

**Root cause**: In SketchUp, faces have a front and back side. The front side is white, and the back side is blue (by default). If faces are reversed during modeling, the blue side faces outward, and Lumion renders it as invisible.

**Fix for SketchUp**:
1. Select all geometry: **Ctrl+A**
2. Right-click → **Explode** — keep exploding until the option is grayed out
3. This resets all face orientations to their default
4. Right-click → **Reverse Faces** on any remaining flipped faces
5. Export to Lumion after this cleanup

I've also seen this issue with Revit exports when the model contains custom massing elements with incorrect face orientation. The fix in Revit is to check the massing elements in a 3D view and ensure all faces point outward.

## Problem 3: All Geometry Merged Into One Material

A Revit user on the Autodesk forums reported: "When I import a model from Revit to Lumion, the model comes as a single block and when I try to define materials it all gets together as one material. A window made of glass and metal comes without separating materials."

**Root cause**: Revit's export settings are combining all elements into a single mesh with one material. This happens when the export detail level is set to Coarse and material assignments are not preserved.

**Fix for Revit export**:
1. Set the **Detail Level** to **Fine** before exporting — this preserves individual element separation
2. In the Lumion export settings (or FBX export settings):
   - Enable **Export Materials**
   - Set **Material Mode** to **Per Object** (not Per Layer)
   - Disable **Combine Elements** if the option exists
3. Assign unique materials to elements that need different treatments in Lumion — even if two elements are the same color, give them different material names so Lumion can separate them
4. For window families: ensure the glass and frame have different materials assigned in the Revit family editor, not just different sub-categories

## Problem 4: Surface Smoothing Issues

Curved surfaces appear faceted or jagged in Lumion after import from Revit.

**Root cause**: Revit's tessellation process converts curved surfaces into triangles. The **Surface Smoothing** slider controls how many triangles are generated — higher values produce smoother surfaces but larger files.

**Fix for Revit**:
1. In the Lumion LiveSync or export settings, find the **Surface Smoothing** slider
2. Set it to the **lowest value that still looks acceptable** — I start at 20% and increase only if curves look too faceted
3. Setting it to maximum (100%) can cause:
   - Extremely large export files (500MB+)
   - Long import times in Lumion
   - Performance issues in Lumion due to excessive polygon count
4. For Revit 25.4.0 and newer: use the **Detail Level** setting instead:
   - **Coarse**: Fewer polygons, faster export, lower quality
   - **Medium**: Balanced
   - **Fine**: Higher polygon count, smoother geometry, larger file

## Problem 5: Geometry Optimization Drawbacks

Revit's **Geometry Optimization** option reduces polygon count for specific element categories (railings, frames, structural elements). It's useful for reducing file size, but it has a side effect.

**The issue**: Geometry Optimization can produce incorrect texture mapping coordinates. If you notice stretched or misaligned textures on railings or structural elements after import, Geometry Optimization is likely the cause.

**Fix**: Disable Geometry Optimization for element categories where texture mapping is important. Only enable it when your scene generates too large a file and you need to reduce polygon count.

## Problem 6: IFC Material Merging

When exporting from Revit using IFC format, Lumion may combine multiple materials into fewer materials, resulting in incorrect material assignments.

**Fix**: In the Revit IFC export settings, disable the option to **Combine IFC surfaces** (or similar option depending on your Revit version). This preserves individual material assignments but increases file size.

**Better alternative**: Use the Lumion LiveSync plugin or direct FBX export instead of IFC. IFC is a interchange format that loses material information in translation. FBX and LiveSync preserve materials much better.

## Problem 7: SketchUp Material Color Mismatch

Materials that look correct in SketchUp appear different in Lumion — colors are shifted, or textures are at the wrong scale.

**Fix for SketchUp**:
1. In SketchUp, check the material's **Texture Size** — Lumion uses the real-world size defined in SketchUp. If the size is set incorrectly in SketchUp, it will be wrong in Lumion
2. Lumion combines surfaces that use the same material into a single mesh. If you need different material treatments for the same SketchUp material, create separate materials in SketchUp with different names
3. For color mismatch: check if SketchUp is using a color profile (sRGB vs Linear) that differs from Lumion's. Both should use sRGB

## Best Practices for Clean Imports

After years of troubleshooting import issues, I've established these rules for our studio:

1. **Use LiveSync when possible**: It maintains material assignments and updates in real-time. No manual export/import cycle.
2. **Name materials consistently**: Material names are the link between the source file and Lumion. Never rename materials between updates.
3. **Set Detail Level to Fine in Revit**: This preserves element separation and material assignments.
4. **Keep Surface Smoothing low**: Start at 20% and increase only if needed. Maximum causes performance issues.
5. **Explode everything in SketchUp**: Before exporting, Ctrl+A → Explode repeatedly until grayed out. This fixes face orientation and material separation.
6. **Assign unique materials in Revit families**: Glass and frame, wall and trim — give each a distinct material so Lumion can treat them separately.
7. **Avoid IFC for Lumion export**: Use FBX or LiveSync instead. IFC loses too much material information.
8. **Test with a small portion first**: Export a single room or building section and import to Lumion to verify materials before exporting the full project.

## Summary

Lumion import problems are almost always caused by incorrect export settings in the source application. For Revit: use Fine detail level, enable material export, keep Surface Smoothing low, and use LiveSync. For SketchUp: explode all geometry, fix face orientation, and name materials consistently. For both: avoid IFC, use FBX or LiveSync, and maintain consistent material names across updates.
