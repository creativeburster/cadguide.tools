---
title: "Altium Designer Gerber and BOM Export: Manufacturing File Generation Checklist"
excerpt: "Generating manufacturing files in Altium isn't just clicking 'Export.' we cover the Gerber, drill, pick-and-place, and BOM export settings we verify before sending a design to fabrication."
category: "deployment"
softwareSlug: "altium-designer"
keyword: "Altium Designer Gerber export BOM manufacturing files"
slug: "altium-designer-gerber-bom-export-manufacturing"
author: "CADGuide Tools Editorial Team"
readTime: "8 min"
date: "2025-06-19"
sources:
  - "https://www.reddit.com/r/Altium/comments/1jlwc53/common_mistakes_in_pcb_footprint_design_and_how/"
  - "https://www.reddit.com/r/Altium/comments/1amw2d9/problem_with_updating_pcb/"
---

# Altium Designer Gerber and BOM Export: Manufacturing File Generation Checklist

We've sent over 200 designs to PCB fabrication and assembly houses, and we've made every export mistake possible: missing drill files, wrong Gerber format, BOM with incorrect part numbers, pick-and-place files with wrong rotations. Each mistake caused a delay or a manufacturing error. After a particularly painful experience where a wrong pick-and-place rotation resulted in 500 boards with all capacitors placed backwards, we created a manufacturing file checklist that we now follow for every design. Here it is.

## Pre-Export Verification

Before generating any manufacturing files, verify the design is complete:

1. **Run full DRC**: **Tools → Design Rule Check → Run Design Rule Check**
   - Fix all errors (red markers)
   - Review all warnings (yellow markers) — some may be acceptable, but document why
2. **Check board outline**: Ensure the board outline is a closed shape on the **Mechanical 1** layer
3. **Check layer stack**: Verify the layer stack matches your manufacturer's capabilities
4. **Check all component placements**: Ensure no components are off-grid or overlapping
5. **Run a final visual check**: Toggle through each layer individually and look for anomalies

## Gerber File Export

### Settings

1. **File → Fabrication Outputs → Gerber Files**
2. In the **Gerber Setup** dialog:

**General Tab**:
- **Units**: Inches or Millimeters (match your manufacturer's preference — most accept both)
- **Format**: 2:5 (2 integer digits, 5 decimal digits) for inches, or 4:4 for millimeters
- we use 2:5 inches for US manufacturers and 4:4 millimeters for international manufacturers

**Layers Tab**:
- Select layers to export:
  - **Top Layer** (signal copper)
  - **Bottom Layer** (signal copper)
  - **Internal Plane 1, 2, etc.** (if applicable)
  - **Top Solder** (solder mask)
  - **Bottom Solder** (solder mask)
  - **Top Paste** (stencil)
  - **Bottom Paste** (stencil)
  - **Top Overlay** (silkscreen)
  - **Bottom Overlay** (silkscreen)
  - **Mechanical 1** (board outline)
- Do NOT select drill guide or drill drawing — these are handled by the drill file export

**Drill Drawing Tab**:
- Uncheck all — drill data comes from the separate drill file export

**Apertures Tab**:
- Check **Embedded apertures (RS274X)** — this is the standard format all manufacturers accept

**Advanced Tab**:
- **Film Size**: Leave at default
- **Leading/Trailing Zeros**: Suppress leading zeros (standard for RS274X)
- **Position on Film**: Reference to absolute origin
- **Check "Use software arcs"** if your manufacturer doesn't support arc commands

3. Click **OK** to generate the Gerber files
4. Altium creates a **Project Outputs** folder with one .gbr file per layer

### Verifying Gerber Files

Always verify Gerber files before sending them to the manufacturer:

1. Use a Gerber viewer (Gerbv, KiCad GerberViewer, or online tools like gerber-viewer.com)
2. Load all Gerber files and verify:
   - Board outline is correct
   - Copper layers match the PCB layout
   - Solder mask openings are at all pads
   - Silkscreen is readable and not on pads
   - Stencil openings match pad sizes
3. Check the file naming convention — some manufacturers require specific naming (e.g., `.GTL` for top copper, `.GBL` for bottom copper)

## Drill File Export

1. **File → Fabrication Outputs → NC Drill Files**
2. Settings:
   - **Units**: Same as Gerber (inches or millimeters)
   - **Format**: Same as Gerber (2:5 or 4:4)
   - **Leading/Trailing Zeros**: Suppress leading zeros
   - **Position**: Reference to absolute origin
   - **Optimize Change Location Commands**: Check this
3. Click **OK**
4. The drill file (.txt or .drl) is generated in the Project Outputs folder

### Verifying Drill Files

1. Open the drill file in a text editor
2. Check the tool list at the top — verify all drill sizes are present
3. Check that the total number of holes matches your expectation
4. Load the drill file in your Gerber viewer alongside the copper layers
5. Verify holes align with all through-hole pads

## Pick-and-Place File Export

This is where the most expensive mistakes happen. A wrong rotation means components are placed in the wrong orientation.

1. **File → Assembly Outputs → Generates Pick and Place Files**
2. Settings:
   - **Format**: CSV (most assembly houses accept CSV)
   - **Units**: Millimeters (standard for assembly)
   - **Include**: 
     - Designator
     - Footprint
     - Mid X, Mid Y (component center position)
     - Ref X, Ref Y (reference position)
     - Layer (Top or Bottom)
     - Rotation (in degrees)
3. Click **OK**

### Verifying Pick-and-Place

1. Open the CSV file in Excel or a text editor
2. Check:
   - All components are listed
   - No components have position 0,0 (indicates unplaced components)
   - Rotation values are reasonable (0, 90, 180, 270 for most components)
   - Layer assignment is correct (T for top, B for bottom)
3. Cross-check a few components against the PCB layout:
   - Find a component with a known orientation (e.g., an electrolytic capacitor with polarity marking)
   - Verify its rotation in the CSV matches the PCB layout
   - This is how we caught the backwards capacitor issue — the rotation was 180° off

## BOM Export

1. **Reports → Bill of Materials**
2. In the BOM dialog:
   - **File Format**: CSV or Excel
   - **Add columns**: Designator, Footprint, Quantity, Description, Manufacturer, Manufacturer Part Number, Supplier, Supplier Part Number
   - **Group by**: Check "Designator" to group identical parts
3. Click **Export**

### Verifying BOM

1. Open the BOM file
2. Check:
   - All components are listed
   - Quantities are correct (grouped by part number)
   - Manufacturer part numbers are valid (not "N/A" or "TBD")
   - No obsolete parts (check manufacturer websites for lifecycle status)
3. Cross-reference with the schematic — every component in the schematic should appear in the BOM

## ODB++ Export (Alternative to Gerber)

Some manufacturers prefer ODB++ format, which packages all manufacturing data in a single file:

1. **File → Fabrication Outputs → ODB++ Files**
2. Settings:
   - **Include all layers**: Check
   - **Include BOM**: Check
   - **Include component placements**: Check
3. Click **OK**

ODB++ is more robust than Gerber because it's a single file that can't be partially lost, and it includes all data (copper, drill, silkscreen, solder mask, stencil, component placements) in one package.

## File Packaging

When sending files to the manufacturer:

1. Create a ZIP file containing:
   - All Gerber files
   - Drill file
   - Pick-and-place file
   - BOM file
   - Board outline drawing (PDF)
   - Assembly drawing (PDF) — if available
2. Name the ZIP with the project name and revision: `ProjectName_RevA_2025-06-15.zip`
3. Include a README.txt listing all files and their purpose
4. Send the ZIP to the manufacturer and confirm receipt

## Summary

Manufacturing file export is the last step before your design becomes a physical board. A single mistake in the Gerber settings, drill file, or pick-and-place file can result in unusable boards. Always:

- Run full DRC before exporting
- Verify Gerber files in a Gerber viewer
- Check drill file tool list and hole count
- Cross-check pick-and-place rotations against the PCB layout
- Verify BOM part numbers are valid and not obsolete
- Package all files in a ZIP with a descriptive name

The 30 minutes you spend verifying manufacturing files will save you weeks of delay if a mistake is caught at the factory.
