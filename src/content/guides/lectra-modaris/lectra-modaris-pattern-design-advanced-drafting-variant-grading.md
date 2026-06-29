---
title: "Lectra Modaris Pattern Design: Advanced Drafting, Variant Management, and Size Grading"
excerpt: "Lectra Modaris provides advanced pattern drafting with variant management and sophisticated size grading for fashion production. I cover the drafting workspace, variant system, grade point management, and the Modaris data structure for organized pattern development."
category: "workflow"
softwareSlug: "lectra-modaris"
keyword: "Lectra Modaris pattern design advanced drafting variant management size grading fashion production"
slug: "lectra-modaris-pattern-design-advanced-drafting-variant-grading"
author: "CAD IT Admin"
readTime: "11 min"
date: "2025-06-29"
sources:
  - "https://www.lectra.com/en/modaris"
  - "https://www.lectra.com/en/3d-prototyping"
  - "https://www.lectra.com/en/cutting"
---

# Lectra Modaris Pattern Design: Advanced Drafting, Variant Management, and Size Grading

I've used Lectra Modaris in European fashion houses producing luxury and high-end garments. Modaris is the most sophisticated pattern making system of the "big three" apparel CAD platforms — it excels at complex pattern constructions, made-to-measure, and variant management. The learning curve is steeper than Optitex or Gerber, but the depth of control is unmatched for advanced pattern engineering.

## Modaris Overview

Lectra's product page describes Modaris: "Lectra's pattern making solution enables fashion companies to develop patterns, grade sizes, and manage variants efficiently across collections."

Modaris consists of integrated modules:
- **Modaris Classic**: 2D pattern drafting and grading
- **Modaris Expert**: Advanced pattern with variant management and MTM
- **3D Prototyping**: 3D virtual sampling (separate add-on)
- **Lectra Cut**: Marker making and cut file generation
- **Lectra PLM**: Product lifecycle management (Kaledo, Gallery)

## The Modaris Workspace

### Interface Overview

1. **Pattern window**: Displays pattern pieces
2. **Toolbar**: Drafting and editing tools
3. **Properties panel**: Piece properties and measurements
4. **Variant panel**: Manage pattern variants
5. **Size panel**: Switch between sizes

### Setting Up a New Model

1. File → New Model
2. Set the model parameters:
   - **Model name**: e.g., "DRESS_A001"
   - **Base size**: e.g., 38 (European) or 8 (US)
   - **Size range**: e.g., 32-44 (European) or 0-14 (US)
   - **Unit system**: Centimeters (European standard)
3. The model is the container for all pattern pieces and variants

## Pattern Drafting

### Drafting Tools

**Point Tools**:
- **Point on Line**: Add a point at a specific position on a line
- **Point on Curve**: Add a point on a Bezier curve
- **Point Offset**: Create a point at an offset from an existing point
- **Intersection Point**: Create a point at the intersection of two lines

**Line Tools**:
- **Line**: Straight line between two points
- **Curve**: Bezier curve with control points
- **Parallel Line**: Line parallel to an existing line at a specified distance
- **Perpendicular Line**: Line perpendicular to an existing line

**Piece Tools**:
- **Create Piece**: Define a closed shape as a pattern piece
- **Modify Outline**: Edit the outline of an existing piece
- **Split Piece**: Divide a piece into two pieces
- **Merge Pieces**: Combine two pieces into one

### Pattern Piece Properties

1. Double-click a piece to open properties:
   - **Piece name**: e.g., "CORPS_DEVANT" (front body)
   - **Quantity**: Number to cut (1 for symmetric, 2 for pairs)
   - **Symmetry**: Cut on fold or not
   - **Grainline**: Fabric grain direction
   - **Notches**: Match points for sewing
   - **Internal lines**: Darts, pleats, cut lines
   - **Drill marks**: Construction position marks
   - **Seam allowance**: Per-edge or global

### Dart Creation and Manipulation

Modaris excels at dart manipulation — a key capability for advanced pattern making:

1. **Create a dart**: Draw two internal lines from the dart point to the opening
2. **Pivot a dart**: Rotate the dart to a new position while preserving the dart intake
3. **Close a dart**: Close the dart and transfer the fullness elsewhere
4. **Split a dart**: Divide one dart into two or more smaller darts
5. **Convert to ease**: Convert dart intake into eased fullness

These operations are non-destructive — Modaris tracks the dart history, allowing you to revert or modify dart positions at any time.

## Variant Management

### What Are Variants?

Variants are alternative versions of a pattern within the same model. For example:
- **Variant 1**: Long sleeve version
- **Variant 2**: Short sleeve version
- **Variant 3**: Sleeveless version
- **Variant 4**: Different neckline

All variants share the same base pattern — only the differing elements change between variants.

### Creating Variants

1. Right-click the model → **New Variant**
2. Name the variant (e.g., "SHORT_SLEEVE")
3. Modify the pattern for this variant:
   - Shorten the sleeve
   - Change the neckline
   - Add or remove details
4. The base pattern remains unchanged
5. Switch between variants in the variant panel

### Variant Benefits

- **One model, multiple styles**: Manage a style family in one file
- **Shared grading**: Grade rules apply to all variants
- **Consistent base**: All variants share the same body measurements
- **Efficient development**: Create variations without redrawing the entire pattern

## Size Grading

### Grade Point System

Modaris uses a grade point system where each point on the pattern has defined grade increments:

1. Select a point on the pattern
2. Open the **Grade Point** properties
3. Set the grade increments for each size:
   - **X increment**: Horizontal movement per size
   - **Y increment**: Vertical movement per size
4. Grade increments can be:
   - **Constant**: Same increment between all sizes
   - **Variable**: Different increments between different sizes
   - **Proportional**: Based on body measurement ratios

### Grade Rule Tables

1. Create a grade rule table:
   - Define sizes (e.g., 32, 34, 36, 38, 40, 42, 44)
   - Set the base size (e.g., 38)
   - Define grade increments between sizes
2. Apply the grade rule table to the model
3. Each grade point references the grade rule table
4. Changes to the grade rule table propagate to all points

### Grading Verification

1. View all sizes simultaneously (nested grading)
2. Each size is shown in a different color
3. Check for:
   - Consistent grade increments
   - No distorted shapes at extreme sizes
   - Seam lengths match between sizes
4. Use the **Grade Check** tool to identify problems:
   - Points with missing grade rules
   - Seam length mismatches
   - Inconsistent grade directions

### Advanced Grading Features

- **Morphing grading**: Non-linear grading where the pattern shape changes between size groups (e.g., different grading for petite vs. regular vs. tall)
- **Asymmetric grading**: Different grade increments for left and right sides
- **Measurement-based grading**: Grade increments calculated from body measurement differences
- **Grade rule inheritance**: Grade rules can inherit from parent rules

## DXF Import and Export

### Importing DXF-AAMA

1. File → Import → DXF
2. Select the DXF-AAMA file
3. Modaris imports:
   - Pattern piece outlines
   - Internal lines
   - Notches and drill marks
   - Grainline direction
   - Piece names
4. Verify imported pieces match the original

### Exporting DXF-AAMA

1. Select pieces to export
2. File → Export → DXF
3. Choose DXF-AAMA format
4. Select individual size or nested grading
5. Compatible with Gerber, Optitex, and most CAD cutting systems

## Common Issues

### Variant Changes Affect Base Pattern

- Verify you're working in the correct variant
- Check that the variant is not set to "inherit all" from the base
- Use variant-specific modifications, not base modifications

### Grade Distortion at Extreme Sizes

- Check grade rule values for consistency
- Consider morphing grading for different size groups
- Test the smallest and largest sizes specifically
- Adjust grade rules for problem sizes

### Seam Lengths Don't Match After Grading

- Use the Grade Check tool to identify mismatches
- Adjust grade rules to equalize seam lengths
- Check that corresponding seam endpoints have compatible grade rules

### DXF Import Missing Pieces

- Ensure the file is DXF-AAMA format
- Check that all pieces are on the correct layers
- Verify piece names use Latin characters
- Check for unsupported entities

## Summary

Lectra Modaris provides the most advanced pattern making tools of the major apparel CAD systems. The drafting workspace offers comprehensive point, line, and piece tools with non-destructive dart manipulation. The variant system allows managing multiple style versions (long sleeve, short sleeve, sleeveless) in one model with shared grading. The grade point system supports constant, variable, and proportional grading with advanced features like morphing grading for different size groups. Use the Grade Check tool to verify seam lengths and grade consistency. Import and export DXF-AAMA files for interoperability with other CAD systems and production workflows. The most common issues — variant confusion, grade distortion, and seam mismatches — are addressed by verifying the active variant, testing extreme sizes, and using the Grade Check tool. Modaris is ideal for luxury fashion production, made-to-measure, and complex pattern constructions where maximum control is needed.
