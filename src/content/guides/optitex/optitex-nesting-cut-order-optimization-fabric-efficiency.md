---
title: "Optitex Nesting and Cut Order Optimization: Maximizing Fabric Efficiency for Production"
excerpt: "Optitex's nesting engine and cut order optimization tools maximize fabric utilization and minimize cutting time. I cover automatic vs manual nesting, cut order planning, fabric matching for stripes and patterns, and efficiency reporting for apparel production."
category: "workflow"
softwareSlug: "optitex"
keyword: "Optitex nesting cut order optimization fabric efficiency marker making production apparel"
slug: "optitex-nesting-cut-order-optimization-fabric-efficiency"
author: "CAD IT Admin"
readTime: "10 min"
date: "2025-06-29"
sources:
  - "https://help.optitex.com/"
  - "https://www.optitex.com/marker-nesting/"
---

# Optitex Nesting and Cut Order Optimization: Maximizing Fabric Efficiency for Production

I've optimized markers and cut orders in Optitex for production runs of 500 to 50,000 garments. Fabric is typically 40-70% of a garment's cost, so even a 2-3% improvement in marker efficiency translates to significant savings at scale. Optitex's nesting engine and cut order tools are designed to squeeze maximum utilization from every meter of fabric while maintaining production efficiency.

## Nesting Fundamentals

### What Is Nesting?

Nesting (also called marker making) is the process of arranging pattern pieces on a fabric panel to minimize waste. The "marker" is the final arrangement that gets sent to the cutting machine.

### Key Metrics

- **Marker efficiency**: Percentage of fabric area covered by pattern pieces (higher = less waste)
- **Marker length**: Total fabric length used for one marker lay
- **Fabric width**: The usable width of the fabric (typically 140-160cm for apparel)
- **Cut order**: The sequence in which markers are cut (affects production scheduling)

### Target Efficiency by Garment Type

| Garment Type | Typical Efficiency | Excellent Efficiency |
|-------------|-------------------|---------------------|
| T-shirts (knits) | 85-90% | 92-95% |
| Woven shirts | 80-85% | 88-90% |
| Pants/jeans | 78-83% | 85-88% |
| Jackets/coats | 75-80% | 82-85% |
| Dresses | 78-83% | 85-88% |
| Underwear (small pieces) | 82-87% | 90-92% |

## Automatic Nesting

### Running Automatic Nesting

1. Open the **Marker** module
2. Set fabric parameters:
   - **Fabric width**: Net usable width (exclude selvedges)
   - **Fabric type**: Solid, stripe, plaid, or one-way design
   - **Grainline tolerance**: How much pieces can deviate from grain
3. Select sizes and quantities:
   - Example: 1xS, 2xM, 2xL, 1xXL (6 garments per marker)
4. Click **Auto Nest**
5. Optitex arranges all pieces on the marker automatically
6. The algorithm optimizes for maximum efficiency

### Automatic Nesting Settings

- **Nesting time**: How long the algorithm runs (longer = better results, up to diminishing returns)
- **Allow rotation**: Whether pieces can be rotated (depends on fabric type)
- **Allow flip**: Whether pieces can be flipped (depends on fabric symmetry)
- **Grainline tolerance**: 0° for strict grain, up to 5° for relaxed grain
- **Piece spacing**: Minimum distance between pieces (typically 0 for automatic cutting, 2-5mm for manual cutting)

### Improving Automatic Nesting Results

1. Run multiple iterations with different settings
2. Try different size combinations
3. Use the **Optimize** function after initial nesting
4. Lock well-placed pieces and re-nest the remaining pieces
5. Compare efficiency across multiple attempts

## Manual Nesting

### When to Use Manual Nesting

- Automatic nesting efficiency is below target
- Complex fabric matching (stripes, plaids, patterns)
- Asymmetric pieces that the algorithm handles poorly
- Small-batch production where every centimeter counts
- Fabric with directional designs (one-way print)

### Manual Nesting Techniques

1. **Start with large pieces**: Place the biggest pieces first
2. **Fill gaps with small pieces**: Nest small pieces (collars, cuffs, pockets) in gaps
3. **Align similar shapes**: Place pieces with matching curves together
4. **Use piece rotation**: Rotate pieces within grainline tolerance to fit better
5. **Mirror pieces**: If fabric allows, mirror pieces to share long edges
6. **Nest sleeves together**: Sleeves often nest efficiently in pairs
7. **Check grainlines**: Verify all pieces are within grain tolerance

### Manual Nesting Workflow

1. Run automatic nesting first for a baseline
2. Note the efficiency percentage
3. Switch to manual mode
4. Drag pieces to reposition
5. Use the **Rotate** tool for piece rotation
6. Use the **Flip** tool for piece mirroring
7. Watch the efficiency counter as you adjust
8. Aim to beat the automatic efficiency by 1-3%

## Cut Order Optimization

### What Is Cut Order Planning?

Cut order planning determines:
- **Which sizes go on which marker**: Group sizes for maximum efficiency
- **How many lays to cut**: Number of fabric layers per marker
- **Cutting sequence**: Which markers are cut in what order

### Cut Order Factors

- **Order quantities**: How many of each size are needed
- **Fabric ply limit**: Maximum fabric layers the cutter can handle (typically 50-100 for wovens, 30-50 for knits)
- **Marker length limit**: Maximum marker length the cutter supports
- **Fabric cost**: More efficient markers save more on expensive fabrics
- **Production schedule**: Urgent sizes may need to be cut first

### Optimizing Cut Order

1. Go to **Cut Order Planning** (Window → Cut Order)
2. Enter the production order:
   - Size breakdown: e.g., S=100, M=200, L=200, XL=100, XXL=50
   - Total quantity: 650 garments
3. Enter constraints:
   - Maximum ply height: 80 layers
   - Maximum marker length: 8 meters
4. Click **Optimize**
5. Optitex generates an optimal cut plan:
   - Marker 1: 1xS, 2xM, 2xL, 1xXL, 1xXXL (7 garments), 100 lays → 700 garments
   - Or: Marker 1: 2xM, 2xL (4 garments), 50 lays → 200 garments, etc.
6. The optimization minimizes:
   - Total fabric usage
   - Number of marker changes
   - Cutting time

### Cut Order Report

The cut order report includes:
- **Marker diagrams**: Visual layout of each marker
- **Ply count**: Number of fabric layers per marker
- **Fabric consumption**: Total fabric length needed
- **Cutting time estimate**: Based on marker complexity and ply count
- **Size summary**: Verification that all sizes are accounted for

## Special Fabric Nesting

### Stripe and Plaid Matching

1. Set the fabric type to **Stripe** or **Plaid**
2. Define the stripe/plaid pattern:
   - **Stripe width**: Distance between stripe repeats
   - **Plaid dimensions**: Both horizontal and vertical repeat dimensions
3. Optitex adjusts piece positions to match the pattern:
   - Pieces are positioned so stripes/plaids align across seams
   - The marker ensures that adjacent pieces have matching pattern positions
4. This typically reduces efficiency by 5-15% compared to solid fabrics
5. Use the **Match Points** tool to define critical pattern alignment points

### One-Way Designs

1. Set the fabric type to **One-Way**
2. All pieces must face the same direction (no flipping)
3. This typically reduces efficiency by 5-10%
4. Common for:
   - Velvet (directional pile)
   - Printed fabrics with directional designs
   - Fleece with directional texture

### Nap Fabrics

1. Set the fabric type to **Nap**
2. All pieces must face the same direction for consistent color
3. Similar to one-way but for texture/color consistency
4. Common for:
   - Corduroy
   - Velvet
   - Suede

## Efficiency Reporting

### Marker Report

1. Generate a marker report for each marker:
   - **Marker efficiency**: Percentage of fabric used
   - **Total marker length**: Fabric length per lay
   - **Piece count**: Total pieces on the marker
   - **Size breakdown**: Pieces per size
   - **Fabric waste**: Percentage and area of waste

### Fabric Consumption Report

1. Generate a fabric consumption report:
   - **Fabric per garment**: Total fabric / number of garments
   - **Total fabric needed**: For the entire production order
   - **Fabric cost**: Based on fabric price per meter
   - **Waste percentage**: Total waste across all markers

### Production Cost Impact

Even small efficiency improvements have large cost impacts:
- 1% efficiency improvement on 10,000 garments at $5/meter fabric = $500+ savings
- 3% efficiency improvement on 50,000 garments at $8/meter fabric = $4,000+ savings

## Common Nesting Issues

### Efficiency Is Below Target

- Try different size combinations on the marker
- Allow piece rotation if grainline permits
- Manually nest small pieces in gaps
- Consider using a different fabric width
- Run the automatic nester with longer time settings
- Create separate markers for different size groups

### Pieces Overlap on the Marker

- Check for incorrect piece boundaries
- Verify piece spacing settings
- Manually separate overlapping pieces
- Check for duplicate pieces

### Stripe/Plaid Alignment Fails

- Verify the stripe/plaid dimensions are correct
- Check that match points are properly defined
- Increase the alignment tolerance slightly
- Accept that striped/plaid fabrics will have lower efficiency

### Cut Order Has Too Many Marker Changes

- Increase the maximum ply height if the cutter allows
- Combine more sizes per marker
- Accept slightly lower efficiency for fewer marker changes
- Balance efficiency against cutting time

## Summary

Optitex's nesting and cut order tools maximize fabric efficiency for apparel production. Run automatic nesting first for a baseline, then manually optimize for 1-3% additional efficiency. Target 85-90% for knits and 80-85% for wovens. Use cut order planning to group sizes optimally and minimize marker changes. For special fabrics (stripes, plaids, one-way, nap), configure the fabric type to ensure proper pattern alignment — expect 5-15% lower efficiency for matched fabrics. Generate marker and fabric consumption reports for cost analysis. Even 1-3% efficiency improvements translate to significant savings at production scale. The most common issues — low efficiency, overlapping pieces, and pattern misalignment — are addressed by trying different size combinations, checking piece boundaries, and verifying fabric pattern dimensions.
