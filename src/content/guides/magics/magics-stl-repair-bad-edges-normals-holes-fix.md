---
title: "Materialise Magics STL Repair: Fixing Bad Edges, Inverted Normals, Holes, and Intersecting Triangles"
excerpt: "STL files exported from CAD often contain mesh errors that cause 3D print failures. We cover Magics' three-tier repair workflow — AutoFix, semi-automatic Follow, and manual triangle editing — with specific steps for each error type from Materialise's official tutorials."
category: "workflow"
softwareSlug: "magics"
keyword: "Materialise Magics STL repair bad edges inverted normals holes fix mesh"
slug: "magics-stl-repair-bad-edges-normals-holes-fix"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-07-30"
sources:
  - "https://www.materialise.com/en/academy/industrial/magics/video-tutorials/master-basic-stl-file-repair"
  - "https://www.materialise.com/en/academy/industrial/magics/video-tutorials/fix-geometry-errors-manual-tools"
  - "https://www.materialise.com/en/inspiration/articles/5-basic-3d-model-repair-functions"
---

# Materialise Magics STL Repair: Fixing Bad Edges, Inverted Normals, Holes, and Intersecting Triangles

When a CAD model is exported to STL, the tessellation process introduces mesh errors: bad edges, inverted normals, holes, intersecting triangles, and overlapping triangles. Materialise Magics provides a three-tier repair workflow — automatic, semi-automatic, and manual — to resolve these errors and produce a watertight, printable mesh.

## Step 0: Diagnose with Part Fixing Info

Before fixing anything, assess the damage:

1. Select the part in the viewport
2. Open the **Part Fixing Info** tab (right-side panel)
3. Click the **Refresh** button (circular arrow icon) to scan for errors
4. Review the error list — each row shows the error type and count

The **Advice** section below the error list suggests which tool to use next.

## Tier 1: AutoFix (Automatic Repair)

For most parts, AutoFix resolves the majority of errors in one pass:

1. Select the part
2. Click **AutoFix** in the **Fix** ribbon
3. Magics runs through all error categories automatically
4. Click **Refresh** in Part Fixing Info to confirm remaining errors

If AutoFix resolves everything, the part is printable. If errors remain, proceed to semi-automatic mode.

## Tier 2: Semi-Automatic Follow Mode

The **Follow** button in the Part Fixing Info tab steps through each error category sequentially, applying the recommended fix and advancing to the next:

1. Click **Follow** (wrench icon in Part Fixing Info)
2. Magics fixes the first error category and moves to the next
3. Continue clicking **Follow** until no more errors can be auto-resolved
4. Any remaining errors require manual intervention

## Tier 3: Manual Repair by Error Type

### Inverted Normals

Normals facing the wrong direction cause the 3D printer to misinterpret inside/outside surfaces.

1. Click the **Invert Normals** icon in the Fix menu
2. If no triangles are marked, the function inverts **all** triangles in the part
3. To invert specific triangles: select **Mark Triangle** in the bottom panel, click the offending triangles, then click **Invert**

### Near Bad Edges (Stitching)

Bad edges occur where adjacent triangles don't share a common edge, creating gaps in the mesh.

1. Navigate to the **Near Bad Edges** page (cube icon with orange-highlighted corner)
2. Set the number of **Stitching Iterations** (start with default)
3. Review the **stitching tolerance** that Magics estimates automatically
4. Adjust **Max gap size** if needed for larger gaps
5. Click **Stitch** to perform the operation

### Holes

Holes are missing triangles that break the watertight property of the mesh.

1. Navigate to the **Hole** tab in the fixing pop-up
2. For **planar holes**: select the **Planar** icon → **Fill hole mode** → select the hole contour
3. For **irregular holes**: select the **Freedom** icon → **Fill hole mode** → select the contour
4. For **curved holes**: select the **Ruled** icon → **User defined** → click the pencil icon to define a direction → **Fill hole mode** → select the contour
5. For **complex triangular holes**: use **Create triangle** to build single triangles manually
6. For **holes with two separate contours**: check **Treat as one hole** → **Fill hole mode** → select both contours
7. After filling, click **Unify** in the Triangle tab to remove unnecessary triangles and clean up the geometry

### Intersecting Triangles

Triangles that cross through each other confuse the slicer about what is solid material.

1. Navigate to the **Triangle** page in the fixing pop-up
2. Try clicking **Collapse** to filter sharp triangles and merge them
3. If extra noise shells appear after fixing, use the semi-automatic **Shells** tool (wrench icon in the Shells row of Part Fixing Info) to remove them
4. For stubborn intersections, use **Mark** on the Overlapping Triangles section, then **Move Part Points** to drag vertices to correct positions

### Noise Shells

Noise shells are tiny disconnected mesh fragments that clutter the model.

1. Navigate to the **Shell** page in the fixing pop-up
2. The first shell in the list is typically the main model
3. Shells with very few triangles are likely noise — select them and press **Delete**
4. Re-run Part Fixing Info to confirm the noise shells are gone

## Post-Repair Validation

After all errors are resolved:

1. **Refresh Part Fixing Info** — all error counts should show 0
2. **Analyze → Show Naked Edges** — confirms the mesh is watertight (2-manifold)
3. **Check wall thickness** — use the Wall Thickness analysis tool; 1 in 5 3D printing bureau orders are cancelled due to incorrect wall thickness
4. **Polygon reduction** — if the file is large, reduce triangle count to speed up slicing without losing geometric fidelity
5. **Rescale** — STL files don't contain unit information; verify the model is at the correct scale before printing

## When to Use NURBS Booleans Instead of Mesh Booleans

Magics can perform Boolean operations on either triangle meshes or NURBS surfaces. NURBS Booleans produce better mesh quality but may fail on certain surface intersection types. If NURBS Booleans fail, switch to mesh Booleans and accept potentially lower mesh quality. Adjusting the **chord tolerance** can also help — coarser tolerance may cause failures, while finer tolerance slows computation.
