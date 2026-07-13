---
title: "MicroStation DWG Compatibility: Import Export Issues, Line Weight Mapping, and Font Substitution"
excerpt: "MicroStation DWG import and export produce wrong line weights, missing fonts, and shifted geometry. I cover the DWG save-as settings, line weight mapping tables, and font configuration that ensure clean DWG round-trips."
category: "troubleshooting"
softwareSlug: "microstation"
keyword: "MicroStation DWG import export line weight font compatibility"
slug: "microstation-dwg-import-export-line-weight-font-fix"
author: "CAD IT Admin"
readTime: "8 min"
date: "2025-06-24"
sources:
  - "https://www.bentley.com/software/microstation/"
  - "https://www.bentley.com/en/products/product-line/microstation"
---

# MicroStation DWG Compatibility: Import Export Issues, Line Weight Mapping, and Font Substitution

Axiom's list of 10 MicroStation problems includes DWG compatibility issues. MicroStation can natively open and save DWG files, but the translation between MicroStation's DGN format and AutoCAD's DWG format is not always perfect. Users report wrong line weights, missing fonts, shifted geometry, and lost element properties when exchanging files with AutoCAD users.

## Problem 1: Wrong Line Weights After DWG Export

MicroStation uses numbered line weights (0-31) while AutoCAD uses line weight values in millimeters or inches. The mapping between these systems is the most common source of DWG compatibility issues.

### Fix: Configure Line Weight Mapping

1. Go to **Workspace → Preferences → DWG**
2. Click **Line Weight Mapping**
3. The mapping table shows MicroStation weights (0-31) mapped to DWG line weights
4. Default mapping:
   - Weight 0 → 0.00mm
   - Weight 1 → 0.05mm
   - Weight 2 → 0.09mm
   - Weight 3 → 0.13mm
   - ... and so on
5. Adjust the mapping to match your project standards
6. Save the mapping as a configuration file for reuse

### Using Line Weight by Level

1. In the Level Manager, set line weights per level
2. When exporting to DWG, the level line weights are preserved
3. This is more reliable than relying on element-level line weights
4. AutoCAD users will see the correct line weights when they open the DWG

## Problem 2: Missing or Substituted Fonts

MicroStation and AutoCAD use different font systems. When a MicroStation file uses a font that AutoCAD doesn't have (or vice versa), the text displays with a substituted font.

### Fix: Configure Font Substitution Table

1. Go to **Workspace → Configuration → Text Styles**
2. Check the font assignments for each text style
3. For DWG compatibility, use fonts that exist in both MicroStation and AutoCAD:
   - **Arial**: Available in both systems
   - **Times New Roman**: Available in both systems
   - **Simplex**: Available in both systems (SHX font in AutoCAD)
   - **Romans**: Available in both systems (SHX font in AutoCAD)
4. Avoid MicroStation-specific fonts (like Engineering Font) for DWG exchange

### Using SHX Fonts

1. If your AutoCAD collaborators use SHX fonts (like `simplex.shx`, `romans.shx`):
   - Copy the SHX files to the MicroStation font directory
   - Default location: `C:\Program Files\Bentley\MicroStation\Default\Fonts\`
   - MicroStation will use the SHX fonts directly
   - Text will display identically in both systems

### Font Substitution Table

1. Go to **Workspace → Configuration → Font Substitution**
2. Add substitution entries:
   - MicroStation font → AutoCAD font
   - Example: "Engineering" → "Arial"
3. When exporting to DWG, MicroStation substitutes the fonts automatically
4. When importing DWG, MicroStation substitutes AutoCAD fonts with available MicroStation fonts

## Problem 3: Geometry Shifted After DWG Import

### Cause: Different Coordinate Systems or Units

1. Check the design file's working units: **Settings → Design File → Working Units**
2. MicroStation uses master units and sub-units (e.g., meters and millimeters)
3. AutoCAD uses a single unit system
4. If the units don't match, geometry will be scaled incorrectly

### Fix: Set Correct Units on Import

1. When opening a DWG file: **File → Open**
2. In the Open dialog, click **DWG Options**
3. Set **Units** to match the DWG file's units
4. Common settings:
   - **Meters**: For survey and civil drawings
   - **Millimeters**: For architectural and structural drawings
   - **Inches**: For US-based architectural drawings
5. Set **Seed File** to a DGN seed file with matching units

### Fix: Check Coordinate System

1. If the DWG file is geo-referenced:
   - Go to **Tools → Geographic → Select Geographic Coordinate System**
   - Set the coordinate system to match the DWG file's coordinate system
   - MicroStation will position the geometry correctly

## Problem 4: Lost Cell Definitions After DWG Export

MicroStation cells and AutoCAD blocks are similar but not identical. Complex cells with nested elements may not export correctly.

### Fix: Use Simple Cell Definitions

1. Before exporting, simplify complex cells:
   - Remove nested cells
   - Convert shared cells to normal cells
   - Ensure each cell has a single origin point
2. Use **File → Export → DWG/DXF**
3. In the export dialog, set **Cell Library** to **Export as Blocks**
4. MicroStation cells are converted to AutoCAD blocks

### Fix: Check Cell Origins

1. Open the Cell Library: **Element → Cells**
2. For each cell, check the origin point
3. If the origin is not at the logical insertion point, edit the cell
4. AutoCAD blocks use the insertion point as the origin
5. Mismatched origins cause cells to appear at wrong positions in the DWG

## Problem 5: Line Style Mapping Issues

MicroStation line styles (custom line patterns) don't have direct equivalents in AutoCAD.

### Fix: Map Line Styles to AutoCAD Linetypes

1. Go to **Workspace → Preferences → DWG → Line Style Mapping**
2. Map each MicroStation custom line style to an AutoCAD linetype:
   - MicroStation "Center" → AutoCAD "CENTER"
   - MicroStation "Hidden" → AutoCAD "HIDDEN"
   - MicroStation "Phantom" → AutoCAD "PHANTOM"
3. For custom line styles without AutoCAD equivalents:
   - Create a matching AutoCAD .lin file
   - Or simplify to a standard linetype before export

## Problem 6: DWG File Size Too Large

### Fix: Optimize Before Export

1. Compress the DGN file: **File → Compress**
2. Purge unused levels, cells, and line styles
3. Remove unused references
4. Then export to DWG
5. The DWG file will be smaller

### Fix: Use DWG Version Appropriately

1. In the DWG Export dialog, select the DWG version:
   - **DWG 2018**: Latest, smallest file size, best compression
   - **DWG 2013**: Widely compatible, moderate file size
   - **DWG 2010**: Older AutoCAD compatibility
2. Use the oldest version that your collaborators can open
3. Newer versions have better compression

## Problem 7: Hatching and Pattern Issues

### Fix: Use AutoCAD-Compatible Hatching

1. Use pattern areas instead of complex custom patterns
2. Map MicroStation patterns to AutoCAD hatch patterns:
   - Go to **Workspace → Preferences → DWG → Pattern Mapping**
   - Map each MicroStation pattern to an AutoCAD hatch pattern
3. For custom patterns:
   - Create a matching .pat file for AutoCAD
   - Or use standard patterns (ANSI31, ANSI32, etc.)

## Problem 8: Round-Trip Fidelity

When a file goes from DGN to DWG and back to DGN, some data may be lost:

### Fix: Use DWG Workmode

1. If you know the file will be exchanged with AutoCAD users:
   - Set the file to **DWG Workmode**: **Settings → DWG Workmode**
2. In DWG Workmode, MicroStation restricts features that don't translate to DWG:
   - Only DWG-compatible line styles are available
   - Only DWG-compatible fonts are available
   - Only DWG-compatible cell definitions are allowed
3. This ensures the file can be saved as DWG without loss

## Summary

| Problem | Root Cause | Fix |
|---------|-----------|-----|
| Wrong line weights | Weight mapping mismatch | Configure line weight mapping table |
| Missing fonts | Font not available in both systems | Use common fonts, configure substitution table |
| Geometry shifted | Units or coordinate system mismatch | Set correct units on import |
| Lost cells | Complex cell definitions | Simplify cells, export as blocks |
| Line style issues | No AutoCAD equivalent | Map to standard linetypes |
| Large DWG file | Uncompressed DGN data | Compress before export, use newer DWG version |
| Hatching issues | Pattern incompatibility | Map patterns, use standard hatch patterns |
| Round-trip data loss | DGN features not in DWG | Use DWG Workmode |

For projects that require frequent DWG exchange, use DWG Workmode from the start. This ensures all elements are DWG-compatible and eliminates round-trip data loss. Configure the line weight mapping and font substitution tables once and save them as project standards.
