---
title: "Browzwear VStitcher Pattern Making: 2D Drafting, Blocks, and Tech Pack Export"
excerpt: "VStitcher's 2D pattern making tools support drafting from scratch, importing DXF-AAMA files, and using 3D CAD blocks. I cover the pattern drafting workflow, grading across size runs, POM measurements, and exporting production-ready tech packs and patterns for manufacturers."
category: "workflow"
softwareSlug: "browzwear"
keyword: "Browzwear VStitcher pattern making 2D drafting blocks tech pack grading export"
slug: "browzwear-vstitcher-pattern-making-2d-drafting-tech-pack-export"
author: "CAD IT Admin"
readTime: "11 min"
date: "2025-06-22"
sources:
  - "https://browzwear.com/products/v-stitcher"
  - "https://browzwear.com/blog/introducing-the-latest-3d-block-library"
  - "https://university.browzwear.com/vs-201-styling-simulation"
  - "https://help.browzwear.com/en/articles/13065178-release-notes-vstitcher-2025-1-1"
---

# Browzwear VStitcher Pattern Making: 2D Drafting, Blocks, and Tech Pack Export

I've used VStitcher's pattern making tools for both original design and production pattern preparation. The 2D pattern environment in VStitcher mirrors traditional flat pattern making — you draft pattern pieces, add seam allowances, place notches, and define grainlines — but with the advantage of real-time 3D simulation to verify fit and drape as you work.

## Pattern Creation Methods

### Method 1: Drafting from Scratch

1. Open the **2D Pattern** window
2. Use the **Polygon** tool to create pattern shapes
3. Use the **Rectangle** tool for simple rectangular pieces
4. Add internal lines for darts, pleats, and details
5. Use the **Edit Pattern** tool to refine shapes and curves
6. Add seam allowances to all edges
7. Place notches at matching points

### Method 2: Using 3D CAD Blocks

Browzwear provides a 3D CAD block library:

Browzwear's blog states: "Use our 3D CAD block library as a starting point for your designs. The 3D CAD Block Library, from swimwear to outerwear, is now available to all VStitcher and Lotta users."

1. Open the **Block Library**
2. Browse by garment type (bodice, sleeve, pant, skirt, swimwear, outerwear)
3. Select a block that matches your target garment
4. The block loads with pre-configured patterns and stitching
5. Modify the block:
   - Adjust dimensions
   - Change neckline, hemline, or silhouette
   - Add or remove design elements
6. The 3D simulation updates in real-time as you modify

### Method 3: Importing DXF-AAMA Files

For working with existing CAD patterns:
1. File → Import → DXF
2. Select the DXF-AAMA file
3. VStitcher imports pattern pieces with all points, notches, and internal lines
4. Pattern pieces appear in the 2D window
5. Stitch the pieces together and simulate

This is essential for collaborating with traditional pattern makers who use Gerber, Lectra, or Optitex systems.

## Pattern Drafting Tools

### Polygon Tool

1. Click points to define the pattern shape
2. **Ctrl + click** for curved (Bezier) points
3. Click the starting point to close the pattern
4. The pattern piece is created

### Edit Pattern Tool

1. Select points, lines, or the entire pattern
2. Drag to move elements
3. Right-click for context menu options:
   - Add Point
   - Edit Curve Point
   - Split Line
   - Delete Point

### Internal Lines

1. Use the **Internal Line** tool
2. Draw lines within an existing pattern piece
3. Internal lines can be used for:
   - Darts (sew the internal line to itself)
   - Pleats (sew adjacent internal lines together)
   - Cut lines (split the pattern into separate pieces)
   - Reference lines for stitching

### Seam Allowance

1. Select a pattern edge
2. Right-click → **Add Seam Allowance**
3. Set the allowance width (typically 1-1.5cm for garments)
4. Seam allowance appears as an extension of the pattern edge
5. Different edges can have different allowances

### Grainline

1. Select a pattern piece
2. Right-click → **Add Grainline**
3. Position the grainline arrow along the fabric grain direction
4. The grainline affects fabric property orientation (warp/weft direction)
5. Rotating the grainline also rotates the fabric's anisotropic properties

## Grading

### Setting Up the Size Run

1. Go to **Size Table** (Window → Size Table)
2. Define sizes (e.g., XS, S, M, L, XL, XXL)
3. Enter body measurements for each size:
   - Chest circumference
   - Waist circumference
   - Hip circumference
   - Shoulder width
   - Arm length
   - Leg length
4. Set the base size (typically M)

### Applying Grade Rules

1. After defining the size table, VStitcher calculates grade rules
2. Grade rules define how each pattern point moves between sizes
3. Review the graded patterns in the 2D window
4. Switch between sizes to verify each one
5. Simulate each size on the corresponding avatar to check fit

### Nested Grading

1. View all sizes simultaneously in the 2D window
2. Each size is shown in a different color
3. This helps visualize how patterns change across the size run
4. Export nested patterns for production

## Point of Measurement (POM)

### Creating POM Measurements

1. In the 2D window, select two points on a pattern
2. Right-click → **Add POM**
3. Name the measurement (e.g., "Chest", "Waist", "Sleeve Length")
4. The measurement appears in the POM list
5. POM measurements are included in the tech pack

### Key POM Measurements

**Tops**:
- Chest circumference (at bust line)
- Waist circumference
- Shoulder width
- Sleeve length (shoulder to cuff)
- Center back length
- Neck opening
- Cuff opening

**Pants**:
- Waist circumference
- Hip circumference
- Inseam length
- Outseam length
- Thigh circumference
- Leg opening

**Dresses**:
- Chest circumference
- Waist circumference
- Hip circumference
- Total length (shoulder to hem)
- Shoulder to waist

## Tech Pack Export

### Tech Pack Contents

VStitcher generates tech packs that include:
- **Flat sketches**: Front and back technical drawings
- **POM spec sheet**: All measurements with tolerances
- **Size run**: Graded measurements for all sizes
- **Bill of Materials (BOM)**: Fabric, lining, trims, hardware
- **Construction details**: Seam types, stitch specifications
- **Colorway information**: Color variants for the style

### Generating the Tech Pack

1. Ensure all POM measurements are created
2. Set up the BOM with fabric and trim information
3. Add construction notes
4. File → Export → Tech Pack
5. Choose format (PDF, Excel)
6. The tech pack is generated with all garment data

## Pattern Export

### DXF-AAMA Export

1. File → Export → DXF
2. Select pattern pieces to export
3. Choose DXF-AAMA format
4. Select individual sizes or nested grading
5. The DXF file can be imported into CAD pattern cutting systems

### Plotter Export

1. File → Export → Plot
2. Configure plotter settings
3. Send to a connected plotter or export as print file

## Common Issues

### Graded Sizes Don't Fit

- Verify body measurements in the size table
- Check that grade rules aren't too aggressive
- Simulate each size individually
- Adjust grade rules for problem areas

### Imported DXF Missing Information

- Ensure the file is DXF-AAMA format (not standard DXF)
- Check that all notches and internal lines are present
- Verify units match (mm vs. inches)

### Seam Allowance Appears Wrong

- Check that seam allowance is set per edge, not globally
- Verify the allowance direction (outward from the pattern)
- Some edges (like folds) should have zero allowance

## Summary

VStitcher's pattern making tools support three creation methods: drafting from scratch, using 3D CAD blocks, and importing DXF-AAMA files. The block library is the fastest way to start — select a block matching your garment type and modify it. Set up the size table before grading, and let VStitcher calculate grade rules automatically. Create POM measurements for the tech pack, which includes flat sketches, spec sheets, BOM, and construction details. Export patterns as DXF-AAMA for production pattern cutting, or generate a complete tech pack PDF for manufacturers. Always verify graded sizes by simulating each one on the corresponding avatar to ensure fit is maintained across the size run.
