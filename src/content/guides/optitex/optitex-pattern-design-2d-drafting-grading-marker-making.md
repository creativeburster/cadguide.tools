---
title: "Optitex Pattern Design: 2D Drafting, Grading, and Marker Making for Production"
excerpt: "Optitex Pattern Design provides 2D pattern drafting, grading, and marker making for apparel production. We cover the drafting tools, grade rule setup, size run management, marker efficiency optimization, and export to cutting machines."
category: "workflow"
softwareSlug: "optitex"
keyword: "Optitex pattern design 2D drafting grading marker making production cutting machines"
slug: "optitex-pattern-design-2d-drafting-grading-marker-making"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-29"
sources:
  - "https://help.optitex.com/"
  - "https://www.optitex.com/pds/"
---

# Optitex Pattern Design: 2D Drafting, Grading, and Marker Making for Production

We've used Optitex Pattern Design for production pattern making on apparel lines ranging from basic t-shirts to tailored jackets. Optitex's 2D pattern module is a professional-grade pattern making system that handles drafting, grading, and marker making — the three core functions of a production pattern room. Understanding the full workflow from first pattern to cut-ready marker is essential for any apparel production operation.

## Optitex Pattern Design Overview

Optitex's product page describes it: "Optitex Pattern Design is a comprehensive 2D pattern making solution that handles drafting, modification, grading, and marker making for apparel production."

The software consists of integrated modules:
- **Pattern Design**: Drafting and modifying 2D patterns
- **Grading**: Size grading with grade rules
- **Marker Making**: Nesting pattern pieces for cutting
- **3D Simulation**: Virtual sampling (covered in a separate guide)

## Pattern Drafting

### Creating a New Pattern

1. File → New Pattern
2. Set the unit system (centimeters or inches)
3. Set the base size (e.g., M or size 38)
4. Start drafting using the drawing tools

### Drafting Tools

**Polygon Tool**:
1. Click points to define the pattern outline
2. Use curved points for smooth curves (armholes, necklines)
3. Close the polygon to complete the pattern piece
4. The pattern piece appears in the pattern window

**Line Tools**:
- **Straight Line**: Draw straight segments
- **Curve Line**: Draw Bezier curves
- **Parallel Line**: Draw a line parallel to an existing line at a specified distance
- **Perpendicular Line**: Draw a line perpendicular to an existing line

**Measurement Tools**:
- **Point-to-Point**: Measure distance between two points
- **Line Length**: Measure the length of a line segment
- **Angle**: Measure the angle between two lines

### Pattern Piece Properties

1. Double-click a pattern piece to open properties:
   - **Piece name**: e.g., "Front Body", "Sleeve", "Collar"
   - **Quantity**: Number of pieces to cut (usually 1 for symmetric, 2 for pairs)
   - **Grainline direction**: Arrow showing fabric grain alignment
   - **Symmetry**: Whether the piece is symmetric (cut on fold)
   - **Notches**: Match points for sewing
   - **Internal lines**: Darts, pleats, cut lines
   - **Drill marks**: Position marks for construction

### Seam Allowance

1. Select a pattern edge
2. Right-click → **Add Seam Allowance**
3. Set the allowance width:
   - 1cm for standard seams
   - 1.5cm for heavy fabrics
   - 0.5cm for French seams
4. Different edges can have different allowances
5. Edges on the fold have zero allowance

### Darts

1. Draw an internal line for the dart
2. Set the dart legs (two lines from the dart point to the dart opening)
3. Set the dart intake (width of the dart opening)
4. The dart can be:
   - **Open**: Cut as a separate piece (for production)
   - **Closed**: Folded in the pattern (for 3D simulation)
5. Optitex handles dart manipulation:
   - **Pivot dart**: Move dart to a new position
   - **Close dart**: Close a dart and open it elsewhere
   - **Split dart**: Divide one dart into two

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
4. Set the base size (the size the pattern was drafted in)

### Grade Rules

1. After defining the size table, Optitex calculates grade rules
2. Grade rules define how each pattern point moves between sizes
3. Review the graded patterns:
   - Switch between sizes to verify each one
   - Check that grade increments are consistent
   - Verify that all sizes maintain proper proportions
4. Manual grade rule adjustment:
   - Select a grade point
   - Adjust the grade increment for each size
   - This is needed for points that don't follow standard grading

### Grade Rule Types

- **Standard grading**: Uniform size increments based on body measurements
- **Custom grading**: Manual grade rules for specific points
- **Nested grading**: Grade rules that reference other grade rules
- **Proportional grading**: Grade based on proportional relationships

### Grading Verification

1. View all sizes simultaneously (nested grading view)
2. Each size is shown in a different color
3. Check for:
   - Inconsistent grade increments
   - Distorted pattern shapes at extreme sizes
   - Seam length mismatches between sizes
4. Use 3D simulation to verify fit on each size

## Marker Making

### Creating a Marker

1. Go to **Marker** module
2. Set the fabric width (e.g., 150cm for knits, 140cm for wovens)
3. Set the marker length (auto or specified)
4. Select the sizes and quantities to include:
   - Example: 1xS, 2xM, 2xL, 1xXL = 6 garments per marker
5. Click **Generate Marker**

### Automatic Nesting

1. Optitex automatically nests pattern pieces on the marker
2. The algorithm optimizes for:
   - **Maximum fabric utilization**: Minimize waste
   - **Grainline compliance**: Pieces must follow grain direction
   - **Piece orientation**: Some pieces can be rotated, others cannot
3. Typical marker efficiency:
   - **T-shirts (knits)**: 85-92% efficiency
   - **Woven shirts**: 80-88% efficiency
   - **Pants**: 78-85% efficiency
   - **Jackets**: 75-82% efficiency

### Manual Marker Adjustment

1. After automatic nesting, manually adjust:
   - Drag pieces to reposition
   - Rotate pieces (if grainline allows)
   - Flip pieces (if fabric allows)
2. Check for:
   - Pieces overlapping (not allowed)
   - Pieces off the fabric edge
   - Grainline violations
3. Optimize for higher efficiency by:
   - Grouping similar-sized pieces
   - Nesting small pieces in gaps between large pieces
   - Using the marker efficiently for the most expensive sizes

### Marker Report

1. Generate a marker report:
   - **Total marker length**: Fabric length used
   - **Marker efficiency**: Percentage of fabric used vs. waste
   - **Piece count**: Number of pieces on the marker
   - **Size breakdown**: Pieces per size
2. This report goes to the cutting room for production planning

## Export to Cutting Machines

### Cut File Export

1. File → Export → Cut File
2. Choose the format:
   - **DXF-AAMA**: Standard format for most cutting machines
   - **PLT**: Plotter format for some systems
   - **CUT**: Optitex native format
3. The cut file includes:
   - All pattern piece outlines
   - Notches and drill marks
   - Internal lines (darts, pleats)
   - Grainline direction
   - Piece labels and size information

### Cutting Machine Compatibility

Optitex exports to all major cutting systems:
- **Gerber Cutters**: GT5250, GTXL, etc.
- **Lectra Cutters**: Vector, Mosaic, etc.
- **Bullmer Cutters**: Premiumcut, etc.
- **Investronica Cutters**: InvuCut, etc.
- **Eastman Cutters**: Static and static-belt cutters
- **Spreader Integration**: Automated spreading machines

## Common Issues

### Graded Sizes Don't Fit

- Verify body measurements in the size table
- Check grade rules for inconsistent increments
- Use 3D simulation to validate each size
- Adjust grade rules for problem areas

### Marker Efficiency Is Low

- Try different size combinations on the marker
- Allow piece rotation where grainline permits
- Manually nest small pieces in gaps
- Consider using a different fabric width
- Use the automatic optimizer with different settings

### Seam Lengths Don't Match After Grading

- Check that grade rules maintain seam length relationships
- Verify that all corresponding seam endpoints have matching grade rules
- Use the seam matching tool to identify mismatches
- Adjust grade rules to equalize seam lengths

### Cut File Won't Import in Cutting Machine

- Verify the export format matches the machine (DXF-AAMA is most common)
- Check that piece names use Latin characters
- Ensure all pieces are within the marker boundary
- Verify units match the cutting machine settings

## Summary

Optitex Pattern Design handles the three core production pattern functions: drafting, grading, and marker making. Draft patterns using the Polygon and Line tools, add seam allowances and darts, and define piece properties (grainline, notches, quantity). Set up the size table before grading, and let Optitex calculate grade rules automatically — then manually adjust problem points. Create markers by selecting sizes and quantities, running automatic nesting, and manually optimizing for maximum fabric efficiency (target 80-90% for most garments). Export as DXF-AAMA for compatibility with all major cutting machines. The most common issues — poor grading fit, low marker efficiency, and seam mismatches — are addressed by verifying size table measurements, optimizing piece placement, and checking grade rule consistency.
