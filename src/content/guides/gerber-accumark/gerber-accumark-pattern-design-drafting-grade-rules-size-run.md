---
title: "Gerber AccuMark Pattern Design: Drafting, Grade Rules, and Size Run Management"
excerpt: "Gerber AccuMark's pattern design tools handle 2D drafting, grade rule tables, and size run management for apparel production. I cover the drafting workspace, grade rule setup, pattern piece parameters, and the AccuMark data structure for organized production pattern management."
category: "workflow"
softwareSlug: "gerber-accumark"
keyword: "Gerber AccuMark pattern design drafting grade rules size run management apparel production"
slug: "gerber-accumark-pattern-design-drafting-grade-rules-size-run"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-29"
sources:
  - "https://www.gerbertechnology.com/accumark/"
  - "https://www.gerbertechnology.com/accumark-3d/"

---

# Gerber AccuMark Pattern Design: Drafting, Grade Rules, and Size Run Management

I've used Gerber AccuMark in apparel production environments handling hundreds of styles per season. AccuMark is the industry standard pattern making system in the Americas, with decades of development behind it. The system's strength lies in its structured data management — every pattern, grade, and marker is organized in a database that scales from a single style to thousands of styles across multiple seasons.

## AccuMark Overview

Gerber's product page describes AccuMark: "Gerber AccuMark is a powerful pattern design, grading, and marker making software that integrates with Gerber cutting machines and YuniquePLM for complete apparel production management."

AccuMark consists of integrated modules:
- **Pattern Design System (PDS)**: 2D pattern drafting and modification
- **Grade Rule Table**: Size grading with grade rules
- **Marker Making**: Nesting and cut file generation
- **AccuMark 3D**: 3D virtual sampling (separate add-on)
- **AccuMark MTM**: Made-to-measure pattern generation
- **YuniquePLM**: Product lifecycle management

## AccuMark Data Structure

### Storage Areas

AccuMark organizes data in a hierarchical structure:

1. **Storage Area**: The top-level directory (e.g., "Fall 2025 Production")
2. **Orders**: Individual style orders within the storage area
3. **Pattern Pieces**: Individual pattern pieces within orders
4. **Grade Rule Tables**: Grade rules associated with patterns
5. **Markers**: Nesting layouts for cutting

### Creating a Storage Area

1. Open **AccuMark Explorer**
2. Right-click → **New Storage Area**
3. Name the storage area (e.g., "Fall2025_Production")
4. Create subdirectories as needed:
   - By season: Fall2025, Spring2026
   - By category: Tops, Bottoms, Dresses
   - By brand: BrandA, BrandB

### Importing and Creating Patterns

1. **New Pattern**: Create from scratch in PDS
2. **Import DXF**: Import patterns from other CAD systems (Optitex, Lectra)
3. **Import from AccuMark 3D**: Import patterns designed in 3D

## Pattern Design System (PDS)

### The PDS Workspace

1. Open **PDS** (Pattern Design System)
2. The workspace shows:
   - **Pattern pieces**: Displayed in the center
   - **Toolbar**: Drafting and editing tools
   - **Property panel**: Piece properties and measurements
   - **Layer panel**: Manage pattern layers
3. Set the unit system (inches or centimeters)

### Drafting Tools

**Point Tools**:
- **Add Point**: Add a point on a line or curve
- **Move Point**: Reposition an existing point
- **Delete Point**: Remove a point from a line

**Line Tools**:
- **Line**: Draw a straight line between two points
- **Curve**: Draw a Bezier curve
- **Internal Line**: Draw a line inside a pattern piece (darts, pleats)

**Pattern Tools**:
- **Create Piece**: Define a closed shape as a pattern piece
- **Modify Piece**: Edit the outline of an existing piece
- **Seam Allowance**: Add or modify seam allowance on edges
- **Notch**: Add notches for seam matching
- **Drill Mark**: Add drill marks for construction points

### Pattern Piece Parameters

1. Double-click a pattern piece to open parameters:
   - **Piece name**: e.g., "FRONT BODY", "BACK SLEEVE"
   - **Piece description**: Additional information
   - **Quantity**: Number to cut (1 for symmetric, 2 for pairs)
   - **Symmetry**: Cut on fold or not
   - **Grainline**: Direction of fabric grain
   - **Rotation allowance**: How much the piece can rotate in marker making
   - **Flip allowance**: Whether the piece can be flipped

### Dart Creation

1. Draw two internal lines from the dart point to the dart opening
2. Select both lines
3. Right-click → **Create Dart**
4. Set the dart intake (width)
5. The dart appears as a triangular fold in the pattern
6. Darts can be:
   - **Open**: Cut as a separate wedge (for production)
   - **Closed**: Folded in the pattern (for 3D simulation)

### Seam Allowance

1. Select an edge or the entire piece
2. Right-click → **Seam Allowance**
3. Set the allowance width:
   - 3/8" (1cm) for standard seams
   - 5/8" (1.5cm) for heavy fabrics
   - 1/4" (0.6cm) for lightweight fabrics
4. Different edges can have different allowances
5. Edges on the fold have zero allowance

## Grade Rule Tables

### Creating a Grade Rule Table

1. In AccuMark Explorer, right-click → **New Grade Rule Table**
2. Name the grade rule table (e.g., "Womens_Tops_S-M-L-XL")
3. Define the size range:
   - Sizes: S, M, L, XL (or numeric: 2, 4, 6, 8, 10, 12)
   - Base size: M (or size 6)
4. The grade rule table defines how each point on the pattern moves between sizes

### Grade Rule Types

- **X-Y Grade**: Horizontal and vertical movement per size
- **Radial Grade**: Movement along a radial direction from a reference point
- **Angle Grade**: Movement at a specified angle
- **Offset Grade**: Movement relative to another grade point

### Applying Grade Rules

1. Open the pattern in PDS
2. Select a point on the pattern
3. Assign a grade rule from the grade rule table
4. The grade rule defines how that point moves for each size
5. Repeat for all key pattern points:
   - Corner points (outline corners)
   - Dart points
   - Notch points
   - Internal line endpoints

### Grade Rule Values

For a typical women's top (base size M):
- **Chest grade**: +1.5cm per size (S to M to L to XL)
- **Length grade**: +1cm per size
- **Sleeve length grade**: +0.75cm per size
- **Neck width grade**: +0.3cm per size
- **Shoulder grade**: +0.5cm per size

### Viewing Graded Patterns

1. In PDS, select **View Grade**
2. All sizes are displayed simultaneously (nested view)
3. Each size is shown in a different color
4. Check for:
   - Consistent grade increments
   - No distorted shapes at extreme sizes
   - Seam lengths match between sizes
5. Switch to individual size view to check each size

## Size Run Management

### Size Table Setup

1. Go to **Size Table** (Window → Size Table)
2. Define sizes and body measurements:
   - Size, chest, waist, hip, shoulder, arm length, body length
3. Link the size table to the grade rule table
4. The size table is used for:
   - Grade rule calculation
   - 3D avatar sizing
   - Measurement verification

### Multi-Size Markers

1. When creating markers, select multiple sizes:
   - Example: 1xS, 2xM, 2xL, 1xXL = 6 garments per marker
2. AccuMark nests all graded sizes on one marker
3. This maximizes fabric efficiency by combining different sizes

## DXF Import and Export

### Importing DXF-AAMA Files

1. In AccuMark Explorer, right-click → **Import → DXF**
2. Select the DXF-AAMA file
3. AccuMark imports:
   - Pattern piece outlines
   - Internal lines (darts, pleats)
   - Notches and drill marks
   - Grainline direction
   - Piece names and annotations
4. Verify imported pieces match the original

### Exporting DXF-AAMA Files

1. Select the pattern pieces to export
2. Right-click → **Export → DXF**
3. Choose format: DXF-AAMA
4. Select individual size or nested grading
5. The DXF file is compatible with:
   - Lectra Modaris
   - Optitex
   - Most CAD cutting systems

## Common Issues

### Grade Rules Produce Distorted Sizes

- Check grade rule values for consistency
- Verify that all corresponding points have matching grade rules
- Check for missing grade rules on some points
- Test the extreme sizes (smallest and largest) for distortion

### Seam Lengths Don't Match After Grading

- Use the **Seam Match** tool to identify mismatches
- Adjust grade rules to equalize seam lengths
- Check that corresponding seam endpoints have compatible grade rules

### DXF Import Missing Information

- Ensure the file is DXF-AAMA format (not standard DXF)
- Check that all layers are included in the export
- Verify piece names use Latin characters
- Check for unsupported entities in the DXF file

### Pattern Pieces Lost in Storage Area

- Use AccuMark Explorer's search function
- Check if pieces are in a different storage area
- Verify the order name is correct
- Use the **Find** function with piece name or order name

## Summary

Gerber AccuMark's pattern design system handles 2D drafting, grade rules, and size run management for apparel production. Organize data in storage areas with orders and pattern pieces. Draft patterns using PDS tools (point, line, curve, internal line), add seam allowances and darts, and define piece parameters (quantity, grainline, symmetry). Create grade rule tables with X-Y grade values for each pattern point, and verify graded sizes in nested view. Set up the size table with body measurements for each size. Import and export DXF-AAMA files for interoperability with other CAD systems. The most common issues — grade distortion, seam mismatches, and DXF import errors — are addressed by checking grade rule consistency, using the Seam Match tool, and verifying DXF-AAMA format compliance. AccuMark's structured data management makes it ideal for large-scale production with hundreds of styles per season.
