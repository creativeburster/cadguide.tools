---
title: "CLO 3D Pattern Making and Grading: From First Draft to Size Run Production"
excerpt: "CLO 3D's pattern making tools mirror real-world garment construction, with added features for digital grading across size runs. I cover the Pattern Drafter tool, importing DXF-AAMA files, creating POM measurements, grading rules, and exporting production-ready patterns for manufacturers."
category: "workflow"
softwareSlug: "clo-3d"
keyword: "CLO 3D pattern making grading size run POM measurement DXF production"
slug: "clo-3d-pattern-making-grading-size-run-production"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-22"
sources:
  - "https://support.clo3d.com/hc/en-us/articles/45053653355545-Pattern-Drafter"
  - "https://learn3dfashion.com/a-comprehensive-guide-of-learning-pattern-making-with-clo-3d"
  - "https://learn3dfashion.com/pattern-making-with-clo-3d-a-beginners-guide"
  - "https://support.clo-set.com/hc/en-us/articles/45303219189785-Web-Tech-Pack-Measurement"
  - "https://support.clo3d.com/hc/en-us/community/posts/27650483158681-grading-with-a-spec-help-please"
---

# CLO 3D Pattern Making and Grading: From First Draft to Size Run Production

I've used CLO 3D to take garments from initial concept through to production-ready patterns and tech packs. The pattern making workflow in CLO mirrors real-world garment construction — you draft 2D pattern pieces, sew them together, and simulate — but the digital workflow adds powerful features like instant grading, POM measurement, and tech pack generation that don't exist in traditional pattern making.

## Pattern Creation Tools

### Pattern Drafter

CLO's Pattern Drafter is the primary tool for creating pattern pieces from measurements or flat sketches.

CLO's documentation describes it: "Easily create your first pattern within CLO, using either measurement points or your flat sketches."

To use the Pattern Drafter:
1. Go to **2D → Pattern Drafter** in the top menu
2. Choose to create from measurements or by tracing a sketch
3. Define points and lines to create the pattern shape
4. The Pattern Drafter generates a 2D pattern piece that can be sewn and simulated

### Polygon and Rectangle Tools

Like Marvelous Designer, CLO includes:
- **Polygon Tool (H)**: Create free-form shapes by clicking points
- **Rectangle Tool (S)**: Create rectangular pattern pieces
- **Internal Polygon/Line (G)**: Draw internal lines for darts, pleats, and details
- **Edit Pattern (Z)**: Modify points, lines, and curves

### DXF-AAMA Import

One of CLO's key advantages for fashion production is the ability to import industry-standard DXF-AAMA pattern files:

1. File → Import → DXF
2. Select the DXF file
3. CLO imports the pattern pieces with all points, notches, and internal lines
4. Pattern pieces appear in the 2D window ready for sewing and simulation

This is critical for working with professional pattern makers who use CAD pattern systems like Gerber AccuMark, Lectra Modaris, or Optitex.

## Creating a Garment from Scratch

### Step 1: Set Up the Size Chart

Before drafting patterns, configure your size measurements:
1. Go to the Pattern Drafter
2. Click **Add Grading** in the Pattern Drafter
3. Set up the size table for your size run (e.g., XS, S, M, L, XL)
4. Enter body measurements for each size
5. Click OK — size columns are added to the Measurement table

### Step 2: Draft the Base Size Pattern

1. Start with your base size (typically M or size 8)
2. Use the Pattern Drafter or Polygon tool to create pattern pieces
3. Add seam allowances
4. Place notches at key matching points
5. Set grainline direction for each piece

### Step 3: Sew and Simulate

1. Use Segment Sewing (N) to connect pattern pieces
2. Position pieces on the avatar using arrangement points
3. Turn on simulation to drape the garment
4. Check fit, adjust patterns, and re-simulate iteratively

### Step 4: Refine Fit

1. Identify fit issues in the 3D simulation
2. Adjust pattern dimensions in the 2D window
3. Re-simulate to verify changes
4. Check for strain points using the tension map view
5. Ensure ease allowances are correct for the garment type

## Pattern Grading

Grading is the process of creating different sizes from a base size pattern. CLO 3D's grading system is one of its most powerful production features.

### Setting Up Grading

1. In the Pattern Drafter, click **Add Grading**
2. Configure the size table with measurements for each size
3. Set the base size (the size you drafted the pattern in)
4. CLO automatically calculates grade rules between sizes

### Grade Rules

Grade rules define how much each pattern point moves between sizes. CLO supports:
- **Automatic grading**: CLO calculates grade rules based on body measurement differences
- **Manual grading**: You define specific grade rules for each point
- **Nested grading**: View all sizes simultaneously in the 2D window

A CLO community user asking about grading notes: "I have a size range set for sizes from 0-18. I want to grade my patterns to fit each size without needing to manually adjust specific pattern points, but by grading to fit the specified body measurements."

The answer: Use CLO's automatic grading with the size table. Set up the body measurements for each size, and CLO calculates the grade rules automatically.

### Checking Graded Sizes

1. After grading, switch between sizes in the 3D window
2. Simulate each size on the corresponding avatar
3. Check that fit is maintained across the size run
4. Adjust grade rules if any size has fit issues
5. Export nested patterns for production

## Point of Measurement (POM)

POM measurements are the industry-standard way to specify garment measurements for production.

### Creating POM Measurements

CLO-SET documentation describes: "Create POM Measurement in CLO3D. Once you create 2D POM, 3D POM will be auto-generated."

1. In the 2D window, select two points on a pattern piece
2. Right-click → Add POM
3. Name the measurement (e.g., "Chest", "Waist", "Sleeve Length")
4. The 3D POM is automatically generated
5. POM measurements appear in the tech pack

### POM List Management

- **Add POM**: Create new measurements
- **Edit POM**: Modify existing measurements
- **POM List**: View all measurements in a table
- **Grading/Base Size**: View measurements for each graded size
- Right-click a size column to Add Column, Set Base, or Delete Column

### Key POM Measurements for Common Garments

**Tops/Shirts**:
- Chest circumference
- Waist circumference
- Shoulder width
- Sleeve length
- Center back length
- Neck opening
- Cuff opening

**Pants**:
- Waist circumference
- Hip circumference
- Inseam length
- Outseam length
- Thigh circumference
- Knee circumference
- Leg opening

**Dresses**:
- Chest circumference
- Waist circumference
- Hip circumference
- Total length
- Shoulder to waist
- Armhole depth

## Tech Pack Generation

CLO 3D and CLO-SET can auto-generate tech packs from your garment data.

CLO-SET documentation states: "CLO-SET provides auto-generated Tech Pack to bring the 3D data all the way to production."

### Tech Pack Contents

A complete tech pack includes:
- **Technical flat sketch**: Front and back views
- **Spec sheet**: POM measurements with tolerances
- **Bill of Materials (BOM)**: Fabric, lining, trims, hardware
- **Construction details**: Seam types, stitch specifications
- **Callout pages**: Detailed views of specific construction elements
- **Size run**: Graded measurements for all sizes

### Exporting the Tech Pack

1. In CLO 3D, ensure all POM measurements are created
2. Set up the BOM with fabric and trim information
3. Add construction notes and callouts
4. File → Export → Tech Pack (PDF)
5. Or upload to CLO-SET for collaborative review

## Exporting Production Patterns

### DXF-AAMA Export

1. File → Export → DXF
2. Select the pattern pieces to export
3. Choose the DXF-AAMA format
4. Include all sizes (nested) or individual sizes
5. The DXF file can be imported into CAD pattern cutting systems

### Plotter Export

1. File → Export → Plot
2. Configure plotter settings (paper size, pen width)
3. Send directly to a connected plotter
4. Or export as a print-ready file

## Common Issues

### Graded Sizes Don't Fit Correctly

- Check that body measurements in the size table are correct
- Verify grade rules aren't too aggressive for the garment type
- Simulate each size individually to identify fit issues
- Adjust grade rules manually for problem areas

### POM Measurements Don't Match Between 2D and 3D

A CLO community user reports: "There is a difference between the POM in CLO3D and the one exported in the tech pack." This can happen because:
- 2D measurements are flat pattern measurements (before sewing)
- 3D measurements are taken on the simulated garment (after sewing and draping)
- The difference is the seam allowance and fabric stretch/shrinkage

Always specify whether measurements are 2D or 3D in your tech pack.

### DXF Import Loses Information

- Ensure the DXF file is in AAMA format (not standard DXF)
- Check that all pattern pieces, notches, and internal lines are present
- Verify the units match (mm vs. inches)
- Some CAD systems use proprietary DXF extensions that CLO may not fully support

## Summary

CLO 3D's pattern making and grading workflow takes garments from concept to production-ready output. The key production features are: DXF-AAMA import for working with existing CAD patterns, automatic grading with size tables, POM measurement creation for tech packs, and DXF/plotter export for manufacturing. Start by setting up the size table before drafting, create the base size pattern, then let CLO's automatic grading handle the size run. Always verify graded sizes by simulating each size on the appropriate avatar. The tech pack is auto-generated from your POM measurements and BOM data, providing manufacturers with everything they need to produce the garment.
