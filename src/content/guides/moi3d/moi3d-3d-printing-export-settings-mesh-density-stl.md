---
title: "MoI3D for 3D Printing: Export Settings, Mesh Density, and STL Workflow"
excerpt: "Prepare MoI3D models for 3D printing: ensure watertight solids, configure STL export mesh density, check for non-manifold geometry, and verify print readiness with correct tolerances."
category: "workflow"
softwareSlug: "moi3d"
keyword: "moi3d 3d printing STL export mesh density watertight"
slug: "moi3d-3d-printing-export-settings-mesh-density-stl"
author: "CADGuide Technical Editorial"
readTime: "9 min read"
date: "2026-07-13"
sources:
  - "https://moi3d.com/3.0/docs/moi_help.pdf"
  - "http://moi3d.com/forum/lmessages.php?msg=4865.1&webtag=MOI"
---

# MoI3D for 3D Printing: Export Settings, Mesh Density, and STL Workflow

MoI3D is excellent for designing parts for 3D printing. Its NURBS-based modeling produces precise, watertight solids that translate to clean STL files. But getting from a perfect NURBS model to a printable STL requires understanding the mesh export settings and common pitfalls.

## Why MoI3D Is Good for 3D Printing

- **NURBS solids are watertight** — closed NURBS surfaces automatically produce manifold STL files
- **Precise dimensions** — enter exact measurements for parts that need to fit
- **Boolean operations** — create complex shapes that remain solid
- **Clean STL export** — MoI3D's mesher produces high-quality triangles
- **Small file size** — efficient meshing keeps STL files manageable

## Ensuring a Watertight Solid

Before exporting, verify your model is a watertight solid:

### Check Solid Status

1. Select your model
2. Look at the properties panel (top-right)
3. It should say **"Solid"** — not "Surface" or "Joined surfaces"
4. If it says "Surface," the model has open edges and won't produce a manifold STL

### Common Causes of Non-Solid Models

1. **Open surfaces** — surfaces that don't form a closed volume
2. **Gap between surfaces** — surfaces that should meet but don't
3. **Duplicate surfaces** — overlapping surfaces confuse the mesher
4. **Self-intersecting geometry** — surfaces that pass through each other

### Fixing Non-Solid Models

1. **Join** — select all surfaces and use **Edit > Join** to connect them
2. **Check for gaps** — zoom in on edges to find gaps; use **Construct > Blend** to fill
3. **Remove duplicates** — use **Edit > Select > Select duplicates** to find and delete duplicates
4. **Fix self-intersections** — use Boolean operations to resolve intersecting surfaces
5. **Show edges** — use **View > Edge** to highlight naked (open) edges in red

## STL Export Settings

### Exporting STL

1. Select the solid to export
2. Go to **File > Export > STL**
3. The mesh settings dialog appears

### Mesh Density Settings

The key setting is the **Angle** parameter:

- **Angle** — the maximum angle between adjacent polygon normals. Smaller angles produce smoother meshes with more polygons.
- **12°** — good default for most prints
- **5°** — very smooth, for curved or organic shapes
- **1°** — extremely smooth, very large file (usually unnecessary)

### Additional Settings

- **Max polygons** — limit the total number of polygons (prevents extremely large files)
- **Min edge length** — prevents excessively small triangles
- **Max edge length** — prevents excessively large triangles
- **Output to inches/mm** — set the correct units for your printer

### Choosing the Right Density

| Part Type | Recommended Angle | Notes |
|---|---|---|
| Mechanical parts (flat faces) | 15-20° | Flat faces need few triangles |
| Curved parts (cylinders, spheres) | 8-12° | Curves need more triangles |
| Organic shapes (sculptures) | 5-8° | Smooth curves need many triangles |
| Jewelry (rings, pendants) | 5-8° | Fine detail requires smooth mesh |
| Large parts (enclosures) | 10-15° | Balance between detail and file size |

### File Size Considerations

- **Too many polygons** — large STL file, slow slicing, potential printer memory issues
- **Too few polygons** — visible facets on curved surfaces, poor print quality
- **Rule of thumb** — aim for 50,000-500,000 polygons for most parts
- **Check file size** — STL files should typically be under 50 MB

## Units and Scale

### Setting Units

1. Go to **Options > Unit system**
2. Set to **mm** (standard for 3D printing) or **inches**
3. The model dimensions display in the selected units

### Scale Issues

- **Model too small** — check that dimensions are in mm, not meters
- **Model too large** — check that you didn't model in cm when the printer expects mm
- **Verify dimensions** — use **Analyze > Distance** to measure key dimensions before exporting

## Common STL Export Issues

### Faceted Curves

Curved surfaces show visible flat segments in the print.

**Fix:** Reduce the Angle parameter (e.g., from 12° to 8°). This increases polygon count but produces smoother curves.

### Non-Manifold Edges

The STL has edges shared by more than two triangles, which confuses the slicer.

**Fix:**
- Ensure the model is a solid before exporting
- Check for duplicate surfaces
- Use **Edit > Join** to merge all surfaces into one solid

### Inverted Normals

Some triangles face inward instead of outward, causing the slicer to misinterpret the model.

**Fix:**
- MoI3D usually produces correct normals automatically
- If issues arise, use a mesh repair tool (like Netfabb or Meshmixer) to fix normals
- Check the model orientation — the "outside" should be the visible side

### Missing Triangles

The STL has holes where triangles are missing.

**Fix:**
- The model isn't a watertight solid — fix the NURBS model first
- Use **View > Edge** to find naked edges
- Join or blend the open edges

## Pre-Export Checklist

Before exporting STL:

- [ ] Model is a **solid** (check properties panel)
- [ ] **Dimensions** are correct (measure key features)
- [ ] **Units** are set to mm (or your printer's expected units)
- [ ] **No duplicate surfaces** (use Select > Duplicates)
- [ ] **No naked edges** (use View > Edge)
- [ ] **Mesh angle** is appropriate for the part type
- [ ] **File size** is reasonable (under 50 MB)

## Post-Export Verification

After exporting STL:

1. **Open in a mesh viewer** — Netfabb, Meshmixer, or your slicer
2. **Check for errors** — most tools can detect non-manifold edges, holes, and inverted normals
3. **Run auto-repair** if the tool offers it
4. **Measure the STL** — verify dimensions match the original model
5. **Check polygon count** — ensure it's within your slicer's comfortable range

## Best Practices

- **Model as solids** — always work with closed solids, not open surfaces
- **Use Boolean operations** — they maintain solid status
- **Apply fillets last** — fillets can create complex geometry that's harder to mesh
- **Export at the right density** — don't over-tessellate flat surfaces
- **Verify before printing** — always check the STL in a viewer before sending to the printer
- **Keep the MoI3D file** — if the STL has issues, fix the source model and re-export
- **Test print small versions** — print a scaled-down version to check fit before the full-size print
- **Use Meshmixer for repairs** — free tool that can fix most STL issues
