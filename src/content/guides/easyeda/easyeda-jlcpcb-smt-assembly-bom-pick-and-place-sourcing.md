---
title: "EasyEDA JLCPCB SMT Assembly: BOM, Pick-and-Place, and Component Sourcing Workflow"
excerpt: "How to prepare EasyEDA designs for JLCPCB SMT assembly — covering LCSC component selection, BOM generation, pick-and-place file export, assembly preview, and troubleshooting common assembly order issues."
category: "workflow"
softwareSlug: "easyeda"
keyword: "easyeda jlcpcb smt assembly bom pick and place component sourcing"
slug: "easyeda-jlcpcb-smt-assembly-bom-pick-and-place-sourcing"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-09"
sources:
  - "https://prodocs.easyeda.com/en/pcb/export-pcb-fabrication-file-gerber/"
  - "https://docs.easyeda.com/en/PCB/Gerber-Generate/index.html"
---

# EasyEDA JLCPCB SMT Assembly: BOM, Pick-and-Place, and Component Sourcing Workflow

JLCPCB SMT assembly is where EasyEDA's integration shines. Instead of ordering bare boards and hand-soldering 100 components, you upload the BOM and pick-and-place file, and JLCPCB assembles the components for you. We've ordered hundreds of assembled boards through this workflow. It's fast, affordable, and reliable — when you prepare the files correctly. Here's our complete workflow.

## What JLCPCB SMT Assembly Includes

JLCPCB offers two assembly services:

### Standard Assembly
- **Single-sided SMT**: Components on the top side only
- **Component sourcing**: From LCSC stock (JLCPCB's component subsidiary)
- **Stencil**: Included in the assembly cost
- **Solder paste**: Applied by JLCPCB
- **Reflow soldering**: JLCPCB handles the reflow profile
- **AOI inspection**: Automated optical inspection included

### Extended Assembly
- **Double-sided SMT**: Components on both sides
- **Through-hole**: Selective wave soldering or hand soldering
- **Advanced packages**: QFN, BGA, fine-pitch QFP
- **Conformal coating**: Optional

## Step 1: Design with LCSC Components

The key to smooth JLCPCB assembly is using components from LCSC stock:

1. In EasyEDA, search for components with **LCSC part numbers**.
2. Look for the **"Extended"** badge — these are in stock and ready for assembly.
3. Components without LCSC numbers may not be available for assembly.

### LCSC Component Categories

- **Basic parts**: Common components (resistors, capacitors, diodes) — no extra sourcing fee
- **Extended parts**: Specific ICs, connectors — small sourcing fee per part number
- **Out of stock**: Not available for assembly — find an alternative

### Finding LCSC Components in EasyEDA

1. In the schematic editor, search for a component (e.g., "STM32F103C8T6").
2. In the search results, look for components with:
   - **LCSC part number** (e.g., C8734)
   - **"Extended" or "Basic" badge**
   - **Stock quantity > 0**
3. Select the component with LCSC stock.
4. Place it on the schematic.

### Component Selection Tips

- **Choose Basic parts when possible** — no sourcing fee, faster turnaround
- **Check stock quantity** — if stock is low (< 100), it may sell out before your order
- **Verify the package** — the LCSC component package must match your footprint
- **Check the datasheet** — confirm the component meets your specifications
- **Have alternatives ready** — if the primary component is out of stock, have a backup

## Step 2: Complete the Schematic and PCB

Follow the normal EasyEDA workflow:

1. Complete the schematic with all LCSC components.
2. Convert to PCB and route all traces.
3. Run DRC and fix all errors.
4. Verify footprints match LCSC component packages.
5. Generate Gerber files.

### Footprint Verification for Assembly

The footprint in EasyEDA must match the component package from LCSC:

1. Check the LCSC datasheet for the exact package dimensions.
2. Compare with the EasyEDA footprint:
   - **Pad count**: Must match
   - **Pad spacing**: Must match (e.g., 0.5mm, 0.65mm, 1.27mm)
   - **Pad size**: Must be appropriate for the package
   - **Orientation**: Pin 1 must be in the correct position
3. A wrong footprint means the component won't fit — JLCPCB will flag it or assemble it wrong.

## Step 3: Generate the BOM

1. In EasyEDA, click **BOM** → **Generate BOM**.
2. The BOM includes:
   - **Reference designator**: R1, R2, U1, etc.
   - **Component value**: 10kΩ, 100nF, STM32F103C8T6
   - **Footprint**: 0805, SOIC-8, QFP-32
   - **LCSC part number**: C17414, C1589, etc.
   - **Quantity**: Number of each component
3. Review the BOM:
   - **Check LCSC numbers** — every component must have an LCSC part number
   - **Check quantities** — verify the count matches the schematic
   - **Check for missing components** — any component without an LCSC number will fail

### BOM Export Format

EasyEDA exports the BOM in CSV format compatible with JLCPCB:
- **Column headers**: Designator, Value, Footprint, LCSC Part #, Quantity
- **Encoding**: UTF-8
- **Format**: Standard CSV

### Fixing BOM Issues

**Missing LCSC part numbers**:
1. Find the component on LCSC.com.
2. Copy the LCSC part number (e.g., C17414).
3. In EasyEDA, double-click the component.
4. Add the LCSC part number to the component properties.
5. Regenerate the BOM.

**Wrong quantities**:
1. Check the schematic for duplicate or missing components.
2. Verify the annotation (R1, R2, etc.) is correct.
3. Re-annotate if needed: **Annotate** → **Reset** → **Annotate**.

## Step 4: Generate the Pick-and-Place File

1. In EasyEDA, click **File** → **Generate Pick and Place File**.
2. The file includes:
   - **Reference designator**: R1, R2, U1, etc.
   - **X coordinate**: Center of the component (mm)
   - **Y coordinate**: Center of the component (mm)
   - **Layer**: Top or Bottom
   - **Rotation**: Component rotation (degrees)
   - **Footprint**: Package name
3. Export format: CSV (JLCPCB compatible)

### Pick-and-Place Verification

1. Open the CSV file and verify:
   - All components are listed
   - Coordinates are within the board outline
   - Layer assignments are correct (Top/Bottom)
   - Rotations match the PCB layout
2. Compare with the PCB layout:
   - Check a few components manually
   - Verify X, Y coordinates match the visual position
   - Verify rotation matches the component orientation

### Common Pick-and-Place Issues

**Wrong rotation**: Component is rotated 90° or 180° from the correct orientation. Fix:
1. Check the footprint definition — pin 1 position determines rotation
2. Compare with the LCSC datasheet
3. Re-export the pick-and-place file

**Wrong layer**: Components on the bottom are listed as top (or vice versa). Fix:
1. In the PCB editor, verify component layer assignments
2. Re-export the pick-and-place file

**Missing components**: Some components don't appear in the file. Fix:
1. Check if the component has a footprint — components without footprints are excluded
2. Verify the component is placed on the PCB (not just in the schematic)

## Step 5: Place the Assembly Order

1. In EasyEDA, click **Order SMT Assembly** (or go to JLCPCB.com).
2. Upload:
   - **Gerber file**: ZIP archive from EasyEDA Gerber export
   - **BOM**: CSV file from EasyEDA BOM export
   - **Pick-and-place**: CSV file from EasyEDA P&P export
3. JLCPCB processes the files:
   - **Gerber**: Creates the PCB
   - **BOM**: Sources components from LCSC
   - **P&P**: Programs the pick-and-place machine
4. Review the assembly preview:
   - **Component positions**: Verify all components are placed correctly
   - **Component orientations**: Check rotations
   - **Missing components**: Check if any components couldn't be sourced

### Assembly Preview Check

JLCPCB shows an online preview of the assembled board:
1. **Check each component** — verify it's in the right position
2. **Check orientation** — pin 1 should be in the correct corner
3. **Check for red flags** — JLCPCB marks components with issues
4. **Approve or fix** — if there are issues, fix the files and re-upload

### Order Configuration

- **Quantity**: Number of assembled boards (minimum 2 for assembly)
- **Solder paste**: Included automatically
- **Stencil**: Optional (for hand assembly of remaining components)
- **Shipping**: Choose based on urgency

## Step 6: Handle Out-of-Stock Components

If a component is out of stock at LCSC:

1. **Find an alternative**:
   - Search LCSC for an equivalent component
   - Check the datasheet to confirm compatibility
   - Update the schematic with the new LCSC part number
   - Regenerate BOM and P&P files
2. **Use "Customer Sourced" parts** (if available):
   - Ship the components to JLCPCB
   - JLCPCB assembles them with your provided parts
   - More expensive and slower
3. **Omit the component**:
   - Leave the component off the BOM
   - Hand-solder it after receiving the assembled board
   - Works for through-hole or large-pitch SMT components

## Step 7: Receive and Inspect Assembled Boards

When the assembled boards arrive:

1. **Visual inspection**:
   - Check for solder bridges
   - Check for missing or misaligned components
   - Check for tombstoning (resistors/capacitors standing on one end)
   - Check solder joint quality
2. **Power test**:
   - Apply power with a current-limited supply
   - Check for short circuits
   - Verify current draw is within expected range
3. **Functional test**:
   - Program the microcontroller (if applicable)
   - Test basic functionality
   - Verify all subsystems work

### Common Assembly Defects

- **Solder bridges**: Excess solder between adjacent pins — fix with solder wick
- **Cold solder joints**: Dull, grainy joints — reflow with hot air
- **Tombstoning**: Small components standing up — reflow with soldering iron
- **Missing components**: Component not placed — hand-solder a replacement
- **Misaligned components**: Component shifted from pad — reflow and reposition

## Best Practices

- **Use LCSC components from the start** — don't wait until BOM generation to check availability
- **Check stock before ordering** — components can sell out between design and order
- **Verify footprints match LCSC packages** — wrong footprints cause assembly failures
- **Review the assembly preview carefully** — it's your last chance to catch errors
- **Order a small batch first** — 2-5 boards to verify before ordering 100+
- **Keep backup components** — order extra for hand-soldering replacements
- **Document the BOM** — keep a record of LCSC part numbers for reordering
- **Check for component substitutions** — JLCPCB may substitute equivalent components; verify compatibility
- **Use Basic parts when possible** — lower cost and faster turnaround than Extended parts
