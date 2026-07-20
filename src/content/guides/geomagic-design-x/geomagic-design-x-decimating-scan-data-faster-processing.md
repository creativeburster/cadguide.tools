---
title: "Geomagic Design X: Decimating 3D Scan Data for Faster Processing"
excerpt: "Raw 3D scans contain millions of polygons. Decimation reduces polygon count while preserving structural detail — from 1M polygons (50 MB) down to 100K (5 MB) — making downstream CAD work faster and more manageable."
category: "workflow"
softwareSlug: "geomagic-design-x"
keyword: "geomagic design x decimate 3d scan data reduce polygon file size"
slug: "geomagic-design-x-decimating-scan-data-faster-processing"
author: "CADGuide Tools Editorial Team"
readTime: "7 min read"
date: "2026-07-12"
sources:
  - "https://gomeasure3d.com/article/everything-you-need-to-know-decimating-3d-scan-data/"
  - "https://www.engineering.pitt.edu/contentassets/52314f399aba40fa86709314a569641c/geomagicdesignx2014userguide.pdf"
---

# Geomagic Design X: Decimating 3D Scan Data for Faster Processing

Raw 3D scan data typically contains millions of polygons. A single scan from a structured-light or laser scanner can produce 1–10 million triangles, resulting in file sizes of 50–500 MB. Decimation reduces the polygon count while preserving the structural integrity of the 3D model, making downstream CAD processing, 3D printing, and data management significantly more efficient.

## Why Decimate?

According to GoMeasure3D's documentation: "Raw 3D mesh is comprised of millions of polygons. You don't need all the polygons for areas of low curvature (usually flat surfaces) to maintain the structural integrity of the 3D model."

### File Size Reduction

GoMeasure3D provides concrete numbers from Geomagic Wrap:

| Stage | Polygon Count | File Size (Binary STL) |
|---|---|---|
| Raw scan | ~1,000,000 | 50 MB |
| After decimation | ~500,000 | 25 MB |
| Further decimation | ~100,000 | 5 MB |

A 90% reduction in file size (50 MB → 5 MB) with minimal loss of geometric detail.

### Benefits

1. **Faster CAD processing**: Large meshes cause lag and freezing in CAD software, especially on older computers. Decimated meshes process smoothly.
2. **Faster 3D printing**: Slicers process smaller files faster. Less processing time means fewer errors during printing.
3. **Easier data management**: As 3D scanners become more affordable, organizations accumulate vast amounts of scan data. Decimation is one way to manage storage.
4. **Web upload compatibility**: Platforms like Sketchfab have file size limits (200 MB for Pro accounts). Decimated files upload faster and fit within limits.
5. **CAM processing**: CAM software struggles with high-polygon meshes. Decimated meshes generate toolpaths faster.

## When to Decimate in the Workflow

### Before Mesh Processing
Decimate raw scan data before healing and repair — fewer polygons means faster processing for:
- Healing Wizard
- Hole filling
- Mesh smoothing
- Non-manifold repair

### After Mesh Processing (Before CAD Modeling)
Decimate the cleaned mesh before starting CAD modeling — the mesh is used as a reference, and excessive detail isn't needed for extracting sketches and features.

### Before Export
Decimate before exporting to:
- STL for 3D printing
- STEP/IGES for CAD import
- OBJ for visualization

## How to Decimate in Geomagic Design X

### Method 1: Mesh Decimation Tool
1. Go to the **Polygon** tab
2. Select **Mesh Decimation** (or **Reduce Polygons**)
3. Set parameters:
   - **Target polygon count**: Specify the desired number of polygons (e.g., 100,000)
   - **Or percentage**: Reduce to a percentage of the original (e.g., 10%)
   - **Preserve sharp edges**: Enable to maintain feature definition
   - **Preserve boundary**: Enable to maintain mesh boundaries
   - **Maximum deviation**: Set the maximum allowed deviation from the original surface (e.g., 0.05 mm)
4. Click **Apply**
5. Check the result — if too much detail was lost, undo and use a higher target

### Method 2: Global Remeshing
1. Go to the **Polygon** tab
2. Select **Global Remeshing** or **Re-wrap**
3. This creates a new mesh with uniform triangle distribution
4. Set the target edge length or polygon count
5. This is more aggressive than decimation — it rebuilds the mesh topology

### Method 3: Mesh Splitting + Selective Decimation
For models with regions of varying detail:
1. Use **Mesh Split** to separate high-detail regions from low-detail regions
2. Decimate the low-detail regions aggressively (flat surfaces)
3. Leave high-detail regions at full resolution (curved features, threads, logos)
4. Merge the regions back together

## How Much to Decimate?

The right amount of decimation depends on the downstream application:

### For Reverse Engineering (CAD Modeling)
- **Target**: 100,000–500,000 polygons
- The mesh is used as a reference for sketching and feature extraction
- Flat surfaces don't need high polygon density
- Curved surfaces need enough polygons for accurate surface fitting
- Parametric modeling tolerates more decimation than auto-surfacing

### For 3D Printing
- **Target**: 50,000–200,000 polygons
- 3D printers have limited resolution (typically 0.1–0.3 mm layer height)
- Polygons smaller than the print resolution don't improve print quality
- Check the 3D printer's minimum feature size

### For Auto Surfacing
- **Target**: 500,000–1,000,000 polygons
- Auto Surfacing fits NURBS surfaces to the mesh
- More polygons = better surface fit, but slower processing
- Per Geomagic's documentation: "The surface can only be as good as the underlying mesh"
- Don't over-decimate if you plan to use Auto Surfacing

### For Visualization / Web Upload
- **Target**: 50,000–100,000 polygons
- Web viewers and rendering software handle smaller meshes better
- Visual quality is maintained with good decimation algorithms

## Quality Verification After Decimation

After decimating, verify the mesh quality:

1. **Visual inspection**: Compare the decimated mesh to the original — look for lost features
2. **Deviation analysis**: Use **Deviation Analysis** to measure the maximum deviation between original and decimated mesh
   - Acceptable deviation: Less than the scanner's accuracy (typically 0.05–0.1 mm)
   - If deviation exceeds scanner accuracy, you've decimated too much
3. **Check critical features**: Verify that holes, threads, and sharp edges are preserved
4. **Check manifold status**: Decimation should preserve manifold geometry — run a quick mesh check

## Common Issues

### Issue: Sharp Features Lost After Decimation
- Enable **Preserve sharp edges** in the decimation settings
- Use selective decimation (split mesh, decimate only flat areas)
- Reduce the decimation amount

### Issue: Holes Appear After Decimation
- Decimation can open small holes where the mesh was thin
- Fill holes after decimation using the **Fill Holes** tool
- Or reduce the decimation amount

### Issue: Auto Surfacing Fails After Decimation
- The mesh may be too decimated for surface fitting
- Increase the polygon count target
- Use parametric modeling instead (more tolerant of low-polygon meshes)

## Best Practices

1. **Always keep a copy of the original**: Don't overwrite the raw scan — save the decimated version as a new file
2. **Decimate in stages**: 1M → 500K → 100K, checking quality at each stage
3. **Use deviation analysis**: Quantify how much the decimated mesh deviates from the original
4. **Decimate based on downstream needs**: Different applications need different polygon counts
5. **Preserve critical features**: Use selective decimation to protect important geometric details
