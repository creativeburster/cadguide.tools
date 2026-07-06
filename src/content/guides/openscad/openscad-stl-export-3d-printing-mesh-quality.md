---
title: "OpenSCAD to STL Export: Optimizing Mesh Quality for 3D Printing"
excerpt: "How to configure OpenSCAD's STL export settings for optimal 3D printing results — covering $fn/$fa/$fs smoothness controls, manifold mesh verification, and slicer-compatible export settings."
category: "manufacturing"
softwareSlug: "openscad"
keyword: "openscad stl export 3d printing mesh quality"
slug: "openscad-stl-export-3d-printing-mesh-quality"
author: "CADGuide Technical Editorial"
readTime: "9 min read"
date: "2026-07-06"
sources:
  - "https://openscad.org/docs/manual/STL_Export.html"
  - "https://manual.slic3r.org/advanced/model-repair"
---

# OpenSCAD to STL Export: Optimizing Mesh Quality for 3D Printing

OpenSCAD exports STL files, but the quality of that STL depends entirely on how you configure the smoothness variables. Get it wrong and your 3D prints have faceted surfaces, visible flat spots on curves, and non-manifold errors that crash the slicer. Here's how to get it right.

## Understanding $fn, $fa, and $fs

OpenSCAD uses three special variables to control curve tessellation:

### $fn (Fragment Count)

Sets the number of facets in a full circle:
```openscad
$fn = 32;  // 32 facets per circle
cylinder(h=10, r=10);
```

Higher $fn = smoother curves but larger file size and slower rendering.

### $fa (Fragment Angle)

Sets the maximum angle between adjacent facets:
```openscad
$fa = 12;  // Maximum 12° between facets
```

12° means a minimum of 30 facets per full circle (360/12 = 30).

### $fs (Fragment Size)

Sets the maximum size of each facet (in mm):
```openscad
$fs = 2;  // Maximum 2mm per facet
```

For large circles, $fs prevents excessively long facets even if $fn is low.

### How They Interact

OpenSCAD uses the variable that produces the **highest facet count**:
- A small circle (r=5) with $fn=32: 32 facets (controlled by $fn)
- A large circle (r=100) with $fn=32: 32 facets (controlled by $fn, but facets are 19.6mm each — too large)
- Same circle with $fs=2: 314 facets (controlled by $fs, because it produces more facets than $fn)

### Recommended Settings

| Use Case | $fn | $fa | $fs | Result |
|----------|-----|-----|-----|--------|
| Draft preview | 16 | — | — | Fast, faceted |
| Functional parts | 64 | — | — | Smooth enough for most prints |
| High-detail (jewelry) | 128 | — | — | Very smooth, large file |
| Mixed sizes (recommended) | 0 | 12 | 1 | Adaptive — smooth on all sizes |

**My recommendation**: Set these at the top of your file:
```openscad
$fn = 0;    // Let $fa and $fs control
$fa = 12;   // Max 12° per facet (30 facets per circle)
$fs = 1;    // Max 1mm per facet
```

This produces smooth curves on both small and large features without excessive facet counts.

## Exporting STL

1. Press **F6** (Render) — this compiles the model to a mesh. You must render before exporting.
2. **File** → **Export** → **Export as STL**.
3. Choose:
   - **Format**: STL (binary is smaller, ASCII is human-readable)
   - The exported file contains the tessellated mesh based on current $fn/$fa/$fs settings.

**Important**: If you press F5 (Preview) instead of F6 (Render), the export will fail or produce an empty file. F5 only renders a preview — F6 builds the actual mesh.

## Verifying Mesh Quality

After exporting, verify the STL is printable:

### Check 1: Manifold (Watertight)

The STL must be a closed surface — no holes, no inside-out faces.

1. Open the STL in a mesh viewer (Meshmixer, Netfabb, or Windows 3D Builder).
2. Run the mesh analysis tool.
3. Look for:
   - **Non-manifold edges** — Edges shared by more than 2 triangles
   - **Holes** — Open boundaries in the mesh
   - **Inverted normals** — Triangles facing the wrong direction

If issues are found, repair in the mesh tool before printing.

### Check 2: File Size

A well-tessellated STL should be 1–20 MB for typical parts. If it's:
- **< 100 KB**: Too few facets — curves will be visibly faceted. Increase $fn or decrease $fs.
- **> 100 MB**: Too many facets — slicer will be slow. Decrease $fn or increase $fs.

### Check 3: Slicer Preview

1. Open the STL in your slicer (Cura, PrusaSlicer, Bambu Studio).
2. Slice the model.
3. Preview the toolpaths:
   - Curved surfaces should appear smooth (not stepped or faceted)
   - No red error indicators
   - Layer lines follow the contour correctly

## Common Export Problems

### Problem: "Nothing to export"

**Cause**: You pressed F5 (Preview) instead of F6 (Render). Preview mode doesn't build the mesh.

**Fix**: Press F6, wait for rendering to complete, then export.

### Problem: Faceted Curves in Print

**Cause**: $fn is too low, or $fs is too high for the curve size.

**Fix**: For a 10mm diameter hole, $fn=64 gives 64 facets — each facet is 0.49mm. That's smooth enough. If the hole is 50mm diameter, $fn=64 gives facets of 2.45mm — visible stepping. Use $fs=1 instead to get 157 facets.

### Problem: Slicer Reports Non-Manifold Edges

**Cause**: Boolean operations created internal faces or shared edges. This happens when difference() operations don't fully cut through the body.

**Fix**: Ensure all subtracted shapes extend beyond the body boundaries:
```openscad
// Bad: cylinder exactly matches body height
difference() {
  cube([20, 20, 10]);
  cylinder(h=10, r=3);  // Exactly 10mm — may create zero-thickness faces
}

// Good: cylinder extends beyond
difference() {
  cube([20, 20, 10]);
  cylinder(h=20, r=3, center=true);  // Extends beyond — clean cut
}
```

### Problem: STL File Too Large

**Cause**: $fn is set very high (e.g., 256) on large models.

**Fix**: Use $fa and $fs instead of $fn:
```openscad
$fa = 8;   // 45 facets per circle minimum
$fs = 0.5; // 0.5mm max facet size
```

This produces smooth curves where needed (small features) without over-tessellating large features.

## Best Practice Workflow

1. **During development**: Use low $fn (16-32) for fast preview rendering.
2. **Before export**: Set $fn=0, $fa=12, $fs=1 for adaptive smoothness.
3. **Press F6**: Full render with final quality settings.
4. **Export STL**: Binary format.
5. **Verify**: Open in mesh viewer, check manifold.
6. **Slice**: Load into slicer, preview, print.
