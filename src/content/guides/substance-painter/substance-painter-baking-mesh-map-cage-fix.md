---
title: "Substance Painter Baking Issues: Mesh Map Errors, Cage Setup, and High-to-Low Poly Workflow"
excerpt: "Substance Painter baking produces artifacts, missing maps, or incorrect normals due to mismatched high/low poly geometry, incorrect cage settings, or naming convention errors. We cover the baking workflow, naming conventions, and the cage calibration that produces clean bakes."
category: "troubleshooting"
softwareSlug: "substance-painter"
keyword: "Substance Painter baking mesh map error cage normal fix"
slug: "substance-painter-baking-mesh-map-cage-fix"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-24"
sources:
  - "https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/technical-support/performance-guidelines/gpu-drivers"
  - "https://cypaint.com/article/how-to-keep-substance-painter-files-low"
---

# Substance Painter Baking Issues: Mesh Map Errors, Cage Setup, and High-to-Low Poly Workflow

Baking is the foundation of every Substance Painter project — if the mesh maps (ambient occlusion, curvature, normal, position, thickness) are wrong, every texture you paint on top of them will look wrong. We've debugged baking issues for game studios and product visualization teams, and the problems almost always come down to three things: naming conventions, cage configuration, and high/low poly mesh preparation.

## Understanding the Baking Pipeline

Substance Painter bakes mesh maps by casting rays from a low-poly mesh to a high-poly mesh. The high-poly mesh provides the detail, and the low-poly mesh provides the UV coordinates. The result is a set of 2D texture maps that capture the high-poly detail in the low-poly mesh's UV space.

**Required inputs**:
- **Low-poly mesh**: With clean UVs and proper naming
- **High-poly mesh**: Detailed geometry, no UVs required
- **Cage** (optional but recommended): Controls the ray casting distance

**Output maps**:
- **Normal map**: Surface detail from high-poly to low-poly
- **Ambient Occlusion (AO)**: Contact shadows
- **Curvature**: Convex/concave surface information
- **Position**: World-space position data
- **Thickness**: Surface thickness data

## Issue 1: Naming Convention Errors

Substance Painter uses naming conventions to match high-poly meshes to low-poly meshes. If the names don't follow the convention, Painter can't match them and the bake fails or produces incorrect results.

**The naming convention**:
- Low-poly mesh: `mesh_name`
- High-poly mesh: `mesh_name_high` (or `mesh_name_hp`)
- Example: `barrel` (low) and `barrel_high` (high)

**For multiple high-poly meshes per low-poly mesh**:
- `barrel_high` → matches to `barrel`
- `barrel_handle_high` → also matches to `barrel` (Painter matches by prefix before `_high`)

**Common naming mistakes**:
1. **Different base names**: Low-poly is `barrel` but high-poly is `barrel_v2_high` — Painter can't match them
2. **Missing _high suffix**: High-poly mesh is just named `barrel_detail` — Painter doesn't recognize it as a high-poly mesh
3. **Extra spaces or special characters**: `barrel _high` (space before _high) — Painter's matching is exact
4. **Case sensitivity**: `Barrel_high` vs `barrel` — Painter is case-sensitive on some systems

**The fix**: Before importing into Substance Painter, verify the naming in your 3D application (Blender, Maya, 3ds Max). Rename meshes to follow the convention exactly. We use a checklist:
- Every low-poly mesh has a clean name (no suffix)
- Every high-poly mesh has the same name + `_high` suffix
- No spaces, no special characters, consistent case

## Issue 2: Cage Configuration

The cage controls how far rays travel from the low-poly mesh to find the high-poly mesh. If the cage is too small, rays don't reach the high-poly and you get missing detail. If the cage is too large, rays overshoot and pick up detail from adjacent surfaces, creating artifacts.

**Symptoms of incorrect cage**:
- **Cage too small**: Normal map has gaps or missing detail in concave areas
- **Cage too large**: Normal map shows detail from adjacent surfaces bleeding across UV seams
- **Cage uneven**: Some areas bake correctly while others have artifacts

**The fix — use Painter's cage settings**:
1. In the Baking dialog, go to **Cage** settings
2. Enable **Use cage**
3. Set the **Cage distance** — start with 0.05 (5% of the model's bounding box) and adjust
4. Use the **Visualize cage** option to see the cage in the viewport
5. The cage should be just large enough to encompass the high-poly mesh

**For complex models**: Use per-mesh cage settings instead of a global cage. Each mesh pair can have its own cage distance, which is essential when different parts of the model have different detail densities.

**Our approach**: We start with a global cage distance of 0.02, render a test bake, and inspect the results. If we see missing detail, we increase the cage. If we see bleeding, we decrease it. We iterate until the bake is clean.

## Issue 3: High-Poly Mesh Not Found

Substance Painter reports "No high poly mesh found" during baking.

**Causes and fixes**:
1. **Naming convention not followed**: Fix the names (see Issue 1)
2. **High-poly mesh not imported**: Import the high-poly mesh into the same Substance Painter project
3. **High-poly mesh in a different scene**: Export both low and high poly from the same 3D application file, or import them separately into Painter
4. **High-poly mesh is too far from low-poly**: The meshes need to be in the same world-space position — if the high-poly is offset, the rays won't find it

## Issue 4: Normal Map Artifacts at UV Seams

The baked normal map shows visible lines or steps at UV seam boundaries.

**Causes and fixes**:
1. **Insufficient UV padding**: The UV islands need padding (empty space around them) so the normal map has data to interpolate across seams. In your UV editor, set padding to at least 4-8 pixels at the target resolution.

2. **UV islands too close together**: If UV islands are nearly touching, the bake can bleed between them. Leave at least 4-8 pixels of space between UV islands.

3. **Different UV island scales**: If one island is much larger than another, the normal map detail appears at different scales. Normalize UV island sizes in your UV editor.

4. **Smoothing groups / hard edges**: The low-poly mesh needs correct smoothing groups. Hard edges should align with UV seams. If a hard edge is in the middle of a UV island, the normal map will have a visible seam.

**The fix for smoothing groups**: In your 3D application, set hard edges to align with UV island boundaries. This ensures the normal map compensates for the hard edge correctly. In Maya, use **Soften/Harden Edges**. In Blender, use **Edge Split** modifier or **Shade Smooth/Flat**.

## Issue 5: AO Map Too Dark or Too Light

The ambient occlusion map is either completely black or completely white.

**Fix for completely black AO**:
1. The cage is too small — rays can't escape the low-poly mesh's surface
2. Increase the cage distance
3. Check that the high-poly mesh is properly positioned around the low-poly

**Fix for completely white AO**:
1. The cage is too large — rays travel past the high-poly mesh
2. Decrease the cage distance
3. Check that the high-poly mesh actually has detail (concave areas, crevices)

**Fix for noisy AO**:
1. Increase **Anti-aliasing** in the baking settings from 2x to 4x
2. Increase **AO rays** — more rays produce smoother AO but take longer to bake

## Issue 6: Baking Takes Too Long

Baking a single mesh takes 10+ minutes.

**Fixes**:
1. **Reduce anti-aliasing**: Set to 2x instead of 4x or 8x — 2x is sufficient for most assets
2. **Reduce map resolution**: Bake at 2048 instead of 4096 — you can always re-bake at higher resolution for the final asset
3. **Disable unused maps**: If you don't need position or thickness maps, disable them
4. **Bake per texture set**: Don't bake all texture sets simultaneously — bake one at a time
5. **Close other applications**: Baking is GPU-intensive — close other GPU applications
6. **Check polygon count**: If the high-poly mesh has 10M+ polygons, baking will be slow regardless of settings. Consider decimating the high-poly mesh while preserving silhouette detail.

## Issue 7: Incorrect Curvature Map

The curvature map doesn't show the expected convex/concave information — edges are missing or areas are incorrectly marked.

**Fix**:
1. **Increase the curvature radius**: In baking settings, increase the curvature search radius — this controls how far the curvature calculation looks for convex/concave changes
2. **Check the high-poly mesh**: The curvature is calculated from the high-poly mesh's surface — if the high-poly doesn't have clear edge definition, the curvature map will be weak
3. **Use the low-poly mesh for curvature**: Some artists bake curvature from the low-poly mesh instead of the high-poly — this gives less detail but more consistent edge detection

## Best Practices for Clean Bakes

1. **Prepare meshes in the 3D application**: Clean UVs, correct naming, proper smoothing groups
2. **Position high and low poly in the same location**: They must overlap in world space
3. **Use a cage**: Always enable the cage and visualize it before baking
4. **Test bake at low resolution**: Bake at 1024 first to verify correctness, then re-bake at the target resolution
5. **Inspect all maps after baking**: Check normal, AO, and curvature for artifacts before starting to paint
6. **Keep the high-poly mesh accessible**: If you need to re-bake, you'll need the high-poly mesh — don't delete it from your 3D application project

## Summary

Substance Painter baking issues are most often caused by naming convention errors, incorrect cage settings, or UV/smoothing group misalignment. Our fix order: verify naming convention (low: `name`, high: `name_high`) → configure cage distance with visualization → ensure UV padding of 4-8 pixels → align smoothing groups with UV seams → test bake at 1024 → inspect all maps → re-bake at target resolution. The naming convention and cage configuration together fix about 70% of baking issues we encounter.
