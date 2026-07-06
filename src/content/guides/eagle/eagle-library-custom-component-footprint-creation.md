---
title: "Eagle Library Management: Creating Custom Components and Footprints"
excerpt: "How to create custom Eagle libraries with schematic symbols and PCB footprints — covering package design, pad sizing, silk screen guidelines, and 3D model integration."
category: "workflow"
softwareSlug: "eagle"
keyword: "eagle library custom component footprint creation"
slug: "eagle-library-custom-component-footprint-creation"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://learn.sparkfun.com/tutorials/making-custom-footprints-in-eagle/all"
  - "https://www.build-electronic-circuits.com/eagle-components/"
---

# Eagle Library Management: Creating Custom Components and Footprints

Every Eagle user eventually needs a component that isn't in the default libraries. I've created hundreds of custom Eagle library parts over the years — from simple connectors to complex BGA footprints. Here's the complete process for creating reliable, manufacturing-ready custom components.

## Understanding Eagle Library Structure

An Eagle library (.lbr) file contains:

1. **Symbols** — Schematic representation (pins, graphics, text)
2. **Packages** — PCB footprint (pads, silk, outline)
3. **Devices** — Links a symbol to one or more packages (with pin-to-pad mapping)
4. **3D Packages** — Optional 3D model for visualization (Eagle 9.6+)

A device connects the schematic symbol to the physical package. One symbol can map to multiple packages (e.g., a resistor symbol maps to 0603, 0805, and 1206 packages).

## Step 1: Create a New Library

1. In Eagle Control Panel: **File** → **New** → **Library**.
2. Save with a descriptive name: `company-custom.lbr`.
3. The Library Editor opens with three tabs: **Symbols**, **Packages**, **Devices**.

## Step 2: Create the Schematic Symbol

1. Click **Symbols** tab → **New**.
2. Name the symbol (e.g., `MY-IC-16`).
3. Draw the symbol body:
   - Use the **Wire** tool to draw a rectangle (typical IC body)
   - Set grid to 0.1 inch (2.54mm) — standard schematic grid
   - Body size: 0.6×0.8 inch for a 16-pin IC

4. Add pins:
   - Click **Pin** tool.
   - Place pins around the body perimeter.
   - Pin length: 0.3 inch (standard).
   - Pin direction: Set based on function:
     - **I/O** — Bidirectional (default)
     - **In** — Input only
     - **Out** — Output only
     - **Pwr** — Power pin (VCC, GND)
     - **Pas** — Passive (resistors, capacitors)

5. Name each pin:
   - Click **Name** tool → click each pin → enter name (e.g., `VCC`, `GND`, `SDA`, `SCL`)
   - Pin names must match the component datasheet exactly

6. Add reference designator:
   - Click **Text** tool → add `>NAME` (auto-fills with reference like U1, U2)
   - Place above the symbol body

7. Add value placeholder:
   - Click **Text** tool → add `>VALUE` (auto-fills with part number)
   - Place below the symbol body

## Step 3: Create the PCB Footprint (Package)

1. Click **Packages** tab → **New**.
2. Name the package (e.g., `SOIC-16-300`).
3. Set the grid:
   - **Grid**: 0.5mm (metric) or 0.025 inch (imperial)
   - Use metric for SMD components, imperial for through-hole

4. Place pads:
   - Click **Smd** tool (for surface mount) or **Pad** tool (for through-hole).
   - For SMD pads:
     - **Pad size**: Width × Length (e.g., 0.6mm × 1.5mm for SOIC)
     - **Pad shape**: Round (default) or square (for pin 1)
     - **Layer**: tPlace (top) or bPlace (bottom)
   - For through-hole pads:
     - **Drill diameter**: Component lead diameter + 0.2mm
     - **Pad diameter**: Drill × 2 (standard) or drill + 0.5mm (minimum)

5. Position pads according to the datasheet:
   - Measure from the package center or pin 1 corner
   - Verify pin 1 is in the correct position (usually top-left for SOIC)

6. Draw the package outline (silkscreen):
   - Layer: tPlace (top silkscreen)
   - Line width: 0.15mm (minimum for most PCB manufacturers)
   - Draw the package body outline
   - Add a pin 1 indicator (dot or beveled corner)

7. Add courtyard (keep-out area):
   - Layer: tKeepout (top courtyard)
   - Draw a rectangle around the package with 0.5mm clearance
   - This prevents other components from being placed too close

8. Add reference designator:
   - Layer: tNames (top copper names)
   - Text: `>NAME`
   - Size: 0.8mm height, 0.15mm width

9. Add value:
   - Layer: tValues (top copper values)
   - Text: `>VALUE`
   - Size: 0.8mm height, 0.15mm width

## Step 4: Create the Device

1. Click **Devices** tab → **New**.
2. Name the device (e.g., `MY-IC-MCP23017`).
3. Add the symbol:
   - Click **Add** → select the symbol created in Step 2.
4. Add the package:
   - Click **New** → select the package created in Step 3.
5. Map pins to pads:
   - Click **Connect**.
   - The connect dialog shows symbol pins on the left and package pads on the right.
   - For each pin, select the corresponding pad and click **Connect**.
   - Verify all pins are mapped — unmapped pins will cause ERC errors.

6. Set device attributes:
   - Click **Attribute** → add:
     - `MANUFACTURER`: e.g., "Microchip"
     - `MPN`: e.g., "MCP23017-E/SO"
     - `DATASHEET`: URL to the datasheet

7. Save the library.

## Step 5: Add 3D Model (Eagle 9.6+)

1. In the package editor, click **3D Package**.
2. Import a 3D model:
   - **STEP file**: Import from component manufacturer
   - **OBJ file**: Create in Blender or download from 3D model sites
3. Position the 3D model:
   - Align the model origin with the package origin
   - Set rotation (usually 0° on all axes if the model is correctly oriented)
   - Set scale (1:1 if the model is in mm)

4. The 3D model appears in Eagle's 3D preview and in Fusion 360 (if linked).

## Common Footprint Design Rules

### SMD Pad Sizing

| Package Type | Pad Width | Pad Length | Pitch |
|-------------|-----------|------------|-------|
| 0402 | 0.5mm | 0.6mm | 0.5mm |
| 0603 | 0.8mm | 1.0mm | 0.8mm |
| 0805 | 1.0mm | 1.25mm | 0.8mm |
| SOIC-8 | 0.6mm | 1.5mm | 1.27mm |
| TQFP-32 | 0.3mm | 1.5mm | 0.8mm |
| QFN-24 | 0.3mm | 0.5mm | 0.5mm |

### Through-Hole Pad Sizing

| Lead Diameter | Drill | Pad Diameter |
|--------------|-------|-------------|
| 0.4mm | 0.6mm | 1.6mm |
| 0.6mm | 0.8mm | 1.8mm |
| 0.8mm | 1.0mm | 2.0mm |
| 1.0mm | 1.2mm | 2.4mm |

### Silk Screen Guidelines

- **Minimum line width**: 0.15mm (6 mil)
- **Minimum text size**: 0.8mm height
- **Don't place silk on pads**: Keep silk 0.2mm away from any pad
- **Pin 1 indicator**: Always include a dot, asterisk, or beveled corner

## Testing Your Custom Component

1. Create a test schematic with the new component.
2. Run ERC — verify no errors related to the new component.
3. Create a test board and route a simple connection.
4. Run DRC — verify no footprint errors.
5. Generate Gerber files and view in a Gerber viewer (Gerbv, KiCad GerberViewer).
6. Print the board layout at 1:1 scale and place a physical component on the printout to verify pad alignment.
