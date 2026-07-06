---
title: "Lectra Cut and Vector Cutter Integration: Marker Making, Nesting, and Automated Cutting"
excerpt: "Lectra Cut's marker making and Vector cutter integration provide end-to-end cutting workflow from pattern to cut parts. I cover automatic nesting, leather-specific nesting, cut order planning, Vector cutter setup, and production optimization for apparel manufacturing."
category: "workflow"
softwareSlug: "lectra-modaris"
keyword: "Lectra Cut Vector cutter integration marker making nesting automated cutting leather apparel manufacturing"
slug: "lectra-cut-vector-cutter-integration-marker-making-nesting"
author: "CAD IT Admin"
readTime: "10 min"
date: "2025-06-29"
sources:
  - "https://www.lectra.com/en/products/vector"
  - "https://www.lectra.com/en/products/diamino"
---

# Lectra Cut and Vector Cutter Integration: Marker Making, Nesting, and Automated Cutting

I've managed Lectra cutting operations for apparel factories producing everything from fast fashion to luxury leather goods. The Lectra Cut and Vector cutter ecosystem is one of the most advanced cutting solutions in the industry — particularly for leather nesting, where Lectra's algorithm is best-in-class. Understanding the full workflow from marker making to cut parts is essential for any operation using Lectra equipment.

## Lectra Cut Overview

Lectra's product page describes it: "Lectra's cutting solutions combine software, hardware, and services to optimize cutting operations for fashion, automotive, and furniture industries."

The cutting ecosystem includes:
- **Lectra Cut (Software)**: Marker making and cut file generation
- **Vector (Hardware)**: Multi-ply automated cutting machine
- **Mosaic (Software)**: Leather-specific nesting and cutting
- **Focus (Software)**: Cut order planning and production management

## Marker Making in Lectra Cut

### Creating a New Marker

1. Open **Lectra Cut**
2. File → New Marker
3. Set marker parameters:
   - **Fabric width**: Net usable width
   - **Marker length**: Auto or specified maximum
   - **Fabric type**: Solid, stripe, plaid, one-way, nap, leather
   - **Grainline tolerance**: How much pieces can deviate from grain
4. Import the pattern from Modaris
5. Select sizes and quantities
6. Click **Create Marker**

### Automatic Nesting

1. Click **Auto Nest**
2. Lectra Cut arranges pieces automatically
3. The algorithm optimizes for:
   - Maximum fabric utilization
   - Grainline compliance
   - Piece orientation constraints
4. Nesting quality options:
   - **Fast**: Quick baseline (30-60 seconds)
   - **Standard**: Good efficiency (2-5 minutes)
   - **High**: Maximum efficiency (10-30 minutes)
5. Review the result and efficiency percentage

### Manual Nesting

1. Switch to manual mode after auto nest
2. Drag pieces to reposition
3. Use **Rotate** for piece rotation
4. Use **Flip** for piece mirroring (if fabric allows)
5. Target: beat auto nest by 1-3%

### Efficiency Targets

| Garment Type | Typical | Excellent |
|-------------|---------|-----------|
| T-shirts (knits) | 85-90% | 92-95% |
| Woven shirts | 80-85% | 88-90% |
| Pants/jeans | 78-83% | 85-88% |
| Jackets/coats | 75-80% | 82-85% |
| Leather garments | 65-75% | 78-82% |

## Leather Nesting with Mosaic

Lectra Mosaic is the industry leader in leather nesting — a unique challenge because leather hides are irregular shapes with varying quality zones.

### Hide Import

1. Import the scanned leather hide:
   - **Scanner**: Lectra's leather scanner captures hide outline and quality zones
   - **Manual**: Draw the hide outline and mark quality zones
2. The hide appears with:
   - **Outline**: The irregular hide boundary
   - **Quality zones**: Areas marked as A-grade, B-grade, C-grade, defects
   - **Grain direction**: Leather grain orientation

### Piece Quality Requirements

1. Assign quality requirements to each pattern piece:
   - **A-grade**: Visible areas (jacket front, sleeve outer)
   - **B-grade**: Less visible areas (jacket back, under sleeve)
   - **C-grade**: Hidden areas (facing, lining, interlining)
2. Mosaic places pieces only in zones that meet their quality requirement

### Leather Nesting Algorithm

1. Click **Mosaic Auto Nest**
2. Mosaic places pieces on the hide considering:
   - Piece quality requirements vs. hide quality zones
   - Hide boundary (pieces must fit within the irregular shape)
   - Grain direction (pieces must align with leather grain)
   - Defect avoidance (pieces must not overlap defects)
3. The algorithm is more complex than fabric nesting — it takes longer
4. Typical leather nesting efficiency: 65-82% (lower than fabric due to irregular hide shape)

### Leather-Specific Considerations

- **Hide variation**: Each hide is different — nest each hide individually
- **Thickness variation**: Leather thickness varies across the hide
- **Stretch direction**: Leather has directional stretch — align pieces accordingly
- **Color matching**: Adjacent pieces should come from the same hide for color consistency
- **Cutting sequence**: Mosaic optimizes the cutting sequence to minimize hide shifting

## Cut Order Planning with Focus

### Focus Overview

Lectra Focus is the cut order planning module that schedules markers for production:

1. Open **Lectra Focus**
2. Enter the production order:
   - Size breakdown: e.g., S=200, M=400, L=400, XL=200
   - Total quantity: 1,200 garments
3. Enter constraints:
   - **Maximum ply height**: Based on Vector cutter model (50-90 layers typical)
   - **Maximum marker length**: Based on Vector cutter size (e.g., 2m x 10m)
   - **Fabric cost**: For cost-based optimization
4. Click **Optimize**
5. Focus generates an optimal cut plan

### Cut Plan Output

- **Marker assignments**: Which sizes on which marker
- **Ply counts**: Fabric layers per marker
- **Fabric consumption**: Total fabric needed
- **Cutting time estimate**: Based on marker complexity
- **Size verification**: All sizes accounted for

## Vector Cutter Integration

### Vector Cutter Models

- **Vector Fashion**: For apparel fabrics (woven, knit, technical)
- **Vector Fashion MP**: Multi-ply high-ply cutter for large production runs
- **Vector Leather**: Specifically designed for leather cutting
- **Vector Automotive**: For automotive leather and composite materials

### Sending Markers to the Vector

1. Select the marker in Lectra Cut
2. Right-click → **Send to Vector**
3. Or: Export as cut file and transfer via network
4. The Vector receives:
   - Piece outlines
   - Notches and drill marks
   - Internal lines
   - Cut sequence (optimized to minimize knife travel)
   - Piece labels and barcodes

### Vector Cutter Setup

1. Load the fabric spread on the Vector cutting table
2. The Vector's vacuum system holds the fabric in place
3. The cutter head follows the marker paths:
   - **Cutting knife**: Cuts through all fabric plies
   - **Notch tool**: Creates notches at seam match points
   - **Drill tool**: Creates drill marks for construction
   - **Label printer**: Prints labels on each piece
4. The Vector cuts the entire marker automatically
5. Cut pieces are removed and bundled by size

### Vector Production Features

- **Continuous cutting**: The Vector can cut continuously while new spreads are loaded
- **Automatic knife sharpening**: The knife sharpens at specified intervals
- **Barcode labeling**: Each piece gets a barcode for tracking
- **Cut quality monitoring**: Sensors monitor cut quality and alert operators

## Common Issues

### Low Marker Efficiency

- Try different size combinations
- Allow piece rotation if grainline permits
- Manually nest small pieces in gaps
- Run auto nest with high-quality setting
- For leather: ensure hide quality zones are accurately marked

### Vector Cutter Stops During Cutting

- Check for fabric jams or misalignment
- Verify the knife is sharp and properly seated
- Check vacuum pressure (insufficient vacuum causes fabric shifting)
- Review the error log on the Vector control panel
- Clear the error and resume cutting

### Leather Pieces Placed on Defects

- Verify the hide scan is accurate
- Check that quality zones are properly marked
- Re-scan the hide if defects were missed
- Increase the defect avoidance margin

### Cut Pieces Have Ragged Edges

- Check knife sharpness
- Verify the knife angle is correct for the fabric type
- Reduce ply height if the knife can't cut cleanly through all layers
- Check the cutting speed (slower for difficult fabrics)

## Summary

Lectra Cut and Vector cutter integration provides a complete cutting workflow from marker making to cut parts for apparel manufacturing. Create markers with automatic or manual nesting, targeting 80-90% efficiency for fabrics and 65-82% for leather. For leather, use Mosaic with scanned hides, quality zones, and piece quality requirements — Lectra's leather nesting is the industry leader. Use Focus for cut order planning to optimize size grouping and ply counts. Send markers directly to the Vector cutter, which handles multi-ply cutting with automatic knife sharpening, notch creation, and barcode labeling. The most common issues — low efficiency, cutter stops, leather defects, and ragged edges — are addressed by optimizing size combinations, checking vacuum and knife condition, verifying hide scans, and adjusting cutting parameters. Lectra's cutting ecosystem is particularly strong for leather goods, luxury fashion, and automotive interiors, making it the preferred choice for high-end manufacturing operations.
