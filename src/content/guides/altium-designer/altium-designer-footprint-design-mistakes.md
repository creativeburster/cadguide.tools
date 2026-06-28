---
title: "Altium Designer Footprint Design: Common Mistakes and How to Fix Them"
excerpt: "Bad footprints cause soldering failures, DRC errors, and board re-spins. I cover the footprint design mistakes I see most often — from pad size errors to courtyard overlaps — with real examples and fixes."
category: "deployment"
softwareSlug: "altium-designer"
keyword: "Altium Designer footprint design mistakes pad size"
slug: "altium-designer-footprint-design-mistakes"
author: "PCB Design Engineer"
readTime: "9 min"
date: "2025-06-16"
sources:
  - "https://www.reddit.com/r/Altium/comments/1jlwc53/common_mistakes_in_pcb_footprint_design_and_how/"
  - "https://www.reddit.com/r/Altium/comments/1hfjumq/i_am_having_a_problem_with_my_pcb_design/"
---

# Altium Designer Footprint Design: Common Mistakes and How to Fix Them

A Reddit post in r/Altium about common footprint mistakes caught my attention because it described mistakes I've made myself and seen others make repeatedly. The user mentioned that PCB drawing files look nice and convey information clearly to the PCB fab, but they cautioned against making them too early in the design process because assembly images put reference designators in the wrong place. This is just one of many footprint mistakes that can cause real manufacturing problems. After designing PCBs for eight years and reviewing hundreds of designs from junior engineers, I've compiled a list of the most common and impactful footprint mistakes.

## Mistake 1: Incorrect Pad Sizes

This is the most common and most damaging mistake. A pad that's too small won't solder reliably; a pad that's too large can cause short circuits or tombstoning.

### The Right Way to Size Pads

For through-hole components:
- **Pad diameter** = lead diameter + 0.25mm (minimum) to + 0.35mm (preferred)
- **Hole diameter** = lead diameter + 0.15mm (minimum) to + 0.25mm (preferred)
- Example: For a 0.8mm lead, use a 1.0mm hole and a 1.6mm pad

For SMD components:
- **Pad width** = component pad width + 0.1mm to 0.2mm per side
- **Pad length** = component pad length + 0.3mm to 0.5mm (to allow for fillet formation)
- Example: For a 0603 resistor (0.35mm x 0.5mm pads), use 0.55mm x 0.8mm PCB pads

### How to Verify

1. Always check the component datasheet for the recommended land pattern
2. Cross-reference with IPC-7351 standards (Altium's library follows IPC-7351 by default)
3. Use calipers to measure the actual component if the datasheet is ambiguous
4. When in doubt, print the footprint at 1:1 scale on paper and place the component on it

## Mistake 2: Wrong Pad Shape

Using round pads for components that need rectangular pads, or vice versa, can cause soldering issues.

### Guidelines

- **Through-hole DIP**: Round pads are fine for standard 2.54mm pitch
- **Through-hole high-power**: Use oval or rectangular pads for better heat dissipation
- **SMD chip components**: Use rectangular pads with rounded corners (Altium's default)
- **SMD fine-pitch (QFP, QFN)**: Use rectangular pads, with the pad length extending beyond the component pad

## Mistake 3: Courtyard Overlap

The courtyard is the area reserved around a component for placement and soldering. When courtyards overlap, components may be too close together for assembly machines to place them.

### How to Check

1. In the PCB library editor, enable **View → Show Courtyard**
2. The courtyard appears as a dashed line around the component
3. In the PCB layout, go to **Design → Rules → Placement → Component Clearance**
4. Set the minimum clearance to match your assembly house's requirements (typically 0.5mm)

### Fixing Overlaps

1. Move components apart until courtyards don't overlap
2. If space is tight, reduce the courtyard size in the footprint (but check with your assembly house first)
3. For hand-soldered boards, courtyard overlap is less critical

## Mistake 4: Silkscreen on Pads

Silkscreen ink on solder pads prevents proper soldering. The solder won't wet the pad, causing unreliable connections.

### How to Check

1. In the PCB view, look for silkscreen text or lines that overlap with pads
2. Run DRC: **Tools → Design Rule Check → Manufacturing → Silk to Solder Mask Clearance**
3. Any violations will be highlighted in green

### Fixing

1. Move silkscreen text away from pads
2. If the silkscreen is part of the footprint (like pin 1 indicator), adjust it in the library
3. For reference designators, position them inside the courtyard but outside the pads

## Mistake 5: Wrong Layer Assignment

Putting pads on the wrong layer or using the wrong layer for the footprint outline.

### Common Errors

- **Pads on the silkscreen layer**: Pads should be on the Multi-Layer (for through-hole) or Top/Bottom Layer (for SMD)
- **Courtyard on the copper layer**: Courtyard should be on the Top Courtyard or Bottom Courtyard layer
- **Silkscreen on the copper layer**: Silkscreen should be on the Top Overlay or Bottom Overlay layer
- **Assembly on the silkscreen layer**: Assembly information should be on the Top Assembly or Bottom Assembly layer

### How to Verify

1. In the PCB library editor, check the layer of each object
2. Use the **Properties** panel to verify the layer assignment
3. Altium's built-in library uses the correct layers — compare your custom footprint against a similar built-in one

## Mistake 6: Missing 3D Body

A missing or incorrect 3D body doesn't affect manufacturing, but it causes problems during mechanical integration and design review.

### Adding a 3D Body

1. In the PCB library editor, go to **Place → 3D Body**
2. Choose the shape: Extruded, Cylindrical, or Spherical
3. Set the height and dimensions based on the datasheet
4. Position the 3D body aligned with the 2D pads
5. For complex shapes, import a STEP file: **Place → 3D Body → From 3D STEP File**

## Mistake 7: Not Matching Pin 1 to Schematic

The pin 1 marker on the footprint must match the pin numbering in the schematic symbol. If they don't match, the PCB will be wired incorrectly.

### How to Verify

1. In the schematic, check the pin numbers of the component
2. In the footprint, check the pad designators
3. They must match exactly — pin 1 in the schematic = pad 1 in the footprint
4. Use **Tools → Footprint Wizard** to create footprints with consistent pin numbering

## Mistake 8: Using Snap Grid Incorrectly

If the snap grid doesn't match the component pitch, pads won't align to the grid, making routing difficult.

### Guidelines

- **2.54mm pitch components**: Use a 1.27mm or 2.54mm snap grid
- **1.27mm pitch components**: Use a 0.635mm snap grid
- **0.5mm pitch components**: Use a 0.25mm or 0.5mm snap grid
- **0.4mm pitch components**: Use a 0.2mm snap grid

Set the snap grid in the PCB library editor: **View → Grids → Set Snap Grid**

## Creating a Footprint Quality Checklist

Before using any footprint in a design, verify:

- [ ] Pad sizes match datasheet recommendations
- [ ] Pad shapes are appropriate for the component type
- [ ] Pin 1 marker is present and correct
- [ ] Silkscreen doesn't overlap pads
- [ ] Courtyard is defined and doesn't overlap adjacent components
- [ ] 3D body is present and matches component dimensions
- [ ] Pin numbers match the schematic symbol
- [ ] Snap grid matches component pitch
- [ ] Layer assignments are correct
- [ ] DRC passes with the component placed

## Using Altium's Built-in Libraries

Altium Designer includes a comprehensive library of manufacturer-verified footprints. Before creating a custom footprint, check if one exists:

1. Go to **Manufacturer Part Search** panel
2. Search for the component by part number
3. If found, the footprint is manufacturer-verified and follows IPC standards
4. Only create custom footprints for components not in the library

The Reddit user's advice about PCB drawing files is worth repeating: don't make them until the board is 100% complete. Assembly drawings with incorrectly placed reference designators can cause confusion during assembly, leading to components being placed in the wrong orientation.

## Summary

Footprint mistakes are the most expensive errors in PCB design because they often aren't caught until the board is manufactured and assembled. A wrong pad size can require a full board re-spin costing thousands of dollars. Always verify footprints against datasheets, use IPC-7351 standard sizes, check for courtyard overlaps, and run DRC before finalizing the design. When in doubt, print the footprint at 1:1 scale and physically place the component on the printout — it's the simplest verification method and it catches mistakes that software checks miss.
