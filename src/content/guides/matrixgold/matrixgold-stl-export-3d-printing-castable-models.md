---
title: "MatrixGold STL Export and 3D Printing for Jewelry: Castable Models and Rapid Prototyping"
excerpt: "Exporting castable STL files from MatrixGold requires specific mesh settings, wall thicknesses, and sprue preparation. I cover STL export settings, checking for naked edges, minimum wall thickness guidelines, and preparing models for investment casting and direct printing."
category: "workflow"
softwareSlug: "matrixgold"
keyword: "MatrixGold STL export 3D printing jewelry castable models rapid prototyping investment casting"
slug: "matrixgold-stl-export-3d-printing-castable-models"
author: "CAD IT Admin"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://matrixgoldbook.com/product/designing-jewelry-with-matrixgold/"
  - "https://www.udemy.com/course/matrixgold-essentials-for-jewelers-video-training-course/"
  - "https://www.coursehero.com/file/161703770/MatrixGold2019TrainingGuidepdf/"
---

# MatrixGold STL Export and 3D Printing for Jewelry: Castable Models and Rapid Prototyping

I've prepared hundreds of MatrixGold models for 3D printing and investment casting. Jewelry 3D printing is far more demanding than typical FDM printing — the models need to be perfectly manifold, have appropriate wall thicknesses for casting, and meet the resolution requirements of resin printers designed for castable patterns. Getting the export and preparation right determines whether the caster can successfully burn out the pattern and cast the metal.

## Pre-Export Checklist

Before exporting an STL from MatrixGold, verify:

### 1. Single Solid Body

1. Select all geometry
2. Use **Boolean Union** to combine all parts into one solid
3. If Boolean Union fails, check for:
   - Overlapping surfaces (use Show Edges to find them)
   - Non-manifold edges
   - Coplanar faces that interfere with Boolean operations
4. All elements (shank, head, prongs, gallery) must be one solid

### 2. No Naked Edges

1. Click **Show Edges**
2. Select **All Edges**
3. Check **Naked Edges**
4. Naked edges (red) indicate open seams in the mesh
5. A castable model must have zero naked edges
6. Fix naked edges by:
   - Filling holes
   - Rebuilding surfaces
   - Re-running Boolean Union after fixing geometry

### 3. No Non-Manifold Edges

1. In Show Edges, check **Non-Manifold Edges**
2. Non-manifold edges (where 3+ faces meet) cause STL errors
3. Fix by separating and recombining the geometry

### 4. Minimum Wall Thickness

| Element | Minimum Thickness | Recommended |
|---------|------------------|-------------|
| Ring shank | 0.8mm | 1.0mm+ |
| Prongs | 0.5mm | 0.8mm+ |
| Gallery rails | 0.5mm | 0.7mm+ |
| Bezel walls | 0.5mm | 0.8mm+ |
| Pendant bails | 0.6mm | 0.8mm+ |
| Chain links | 0.7mm | 1.0mm+ |
| Decorative elements | 0.4mm | 0.6mm+ |

Walls thinner than 0.4mm may not cast properly — the metal may not fill thin sections during casting.

### 5. Gem Seats

- Verify all gem seats are properly cut (using Gem Cutter)
- Seats should be 60-70% of the gem's depth
- The gem should sit level in the seat
- Remove gems from the model before exporting (export metal only)

## STL Export Settings

### Exporting the STL

1. Select the solid body (without gems)
2. File → Export → STL
3. Configure export settings:
   - **Format**: Binary STL (smaller file size)
   - **Units**: Millimeters
   - **Tolerance**: 0.001mm (fine enough for jewelry detail)
   - **Angle**: 15° (controls mesh density on curved surfaces)
   - **Density**: High (more triangles = smoother surface)
4. Click OK and save the file

### Mesh Density

Jewelry models need high mesh density for smooth curves and fine details:

- **Too few triangles**: Faceted surface, visible polygons on curves
- **Too many triangles**: Very large file, slow slicing, but smooth surface
- **Sweet spot**: 50,000-500,000 triangles for most jewelry pieces

To check mesh density:
1. After export, open the STL in a viewer
2. Zoom in on curved surfaces
3. If you can see individual facets, increase mesh density
4. If the file is over 50MB, decrease mesh density

## Preparing for Investment Casting

### Sprue Attachment

The caster needs a sprue (a channel for metal to flow into the mold). Some designers add the sprue in CAD; others let the caster add it:

**Adding Sprue in MatrixGold**:
1. Create a cylinder (2-3mm diameter) extending from the ring's heaviest section
2. The sprue should attach to the thickest part of the model
3. Boolean Union the sprue with the model
4. The sprue provides a path for metal to flow during casting

**Letting the Caster Add Sprue**:
1. Export the model without a sprue
2. The caster attaches a wax sprue manually
3. This is more common for production casting

### Castable Resin Printing

For investment casting, the STL is printed on a resin (SLA/DLP) printer using castable resin:

1. **Printer resolution**: 25-50 micron XY resolution for jewelry
2. **Layer height**: 10-25 microns for fine detail
3. **Castable resin**: Burns out cleanly with minimal ash (e.g., BlueCast X10, Phrozen TR250)
4. **Support material**: Minimal supports on non-critical surfaces
5. **Orientation**: Angle the model to minimize support marks on visible surfaces

### Direct Metal Printing

Some jewelry is printed directly in metal (SLM/DMLS):
1. **Resolution**: 20-40 microns
2. **Supports**: Required for overhangs >45°
3. **Surface finish**: Rougher than cast — requires post-processing
4. **Material**: Typically sterling silver, gold, or platinum
5. **Cost**: Higher than casting for single pieces, lower for production runs

## Common Export Issues

### STL File Has Errors

1. Run **Show Edges** → check for naked and non-manifold edges
2. Fix geometry issues before exporting
3. Use Netfabb or Meshmixer to repair the STL after export if needed
4. Re-export after fixing

### Boolean Union Fails

1. Check for overlapping surfaces
2. Try Boolean Union on pairs of objects instead of all at once
3. Use **Intersect** to find problem areas
4. Rebuild problem surfaces
5. Try **Merge** instead of Boolean Union for coplanar faces

### Model Is Too Small or Too Large

1. Verify units are set to millimeters
2. Check the model dimensions before exporting
3. A typical ring should be 18-20mm inner diameter
4. Use **Scale 1D** or **Scale 2D** to adjust if needed

### Surface Is Faceted After Printing

1. Increase STL mesh density (lower angle tolerance, higher density)
2. Use a finer layer height on the resin printer
3. Consider using anti-aliasing if the printer supports it

### Casting Fails (Incomplete Fill)

1. Check wall thickness — thin sections may not fill
2. Verify the sprue is attached to the thickest part
3. Ensure there are no internal voids in the model
4. Check that the model is solid (not hollow) unless intentionally hollow
5. Consult with the caster about sprue size and placement

## Rapid Prototyping (Non-Castable)

For design review and client approval, print in standard resin (not castable):

1. **Printer**: Any SLA/DLP resin printer
2. **Resin**: Standard grey or clear resin
3. **Layer height**: 25-50 microns (less critical than castable)
4. **Purpose**: Visual review, size checking, client approval
5. **Cost**: Much lower than castable resin
6. **Speed**: Faster printing with standard resin

## Quality Control Workflow

1. **Check geometry**: Show Edges → no naked edges, no non-manifold edges
2. **Check dimensions**: Verify ring size, gem sizes, overall dimensions
3. **Check wall thickness**: Use **Thickness Analysis** if available
4. **Boolean Union**: Combine all parts into one solid
5. **Remove gems**: Export metal body only
6. **Export STL**: Binary, high density, millimeter units
7. **Verify STL**: Open in a viewer, check for errors
8. **Print test**: Print in standard resin for visual review
9. **Client approval**: Get sign-off before castable printing
10. **Print castable**: Print in castable resin for investment casting

## Summary

Preparing MatrixGold models for 3D printing and casting requires careful pre-export checks. Verify the model is a single solid with no naked edges using Show Edges. Ensure all wall thicknesses meet minimum requirements (0.8mm for shanks, 0.5mm for prongs). Export as Binary STL with high mesh density and millimeter units. For investment casting, print on a resin printer with castable resin at 10-25 micron layer height. Add a sprue in CAD or let the caster add it manually. For design review, print in standard resin first for visual approval before committing to castable printing. The most common issues — Boolean Union failures, naked edges, and casting failures — are preventable with proper geometry checking before export. Always follow the quality control workflow: check geometry, check dimensions, check thickness, Boolean Union, remove gems, export, verify, print test, then print castable.
