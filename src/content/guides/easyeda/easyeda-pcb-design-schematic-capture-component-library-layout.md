---
title: "EasyEDA PCB Design: Schematic Capture, Component Library, and PCB Layout Workflow"
excerpt: "How to design PCBs in EasyEDA — covering schematic creation, component library management, footprint assignment, PCB layout routing, design rule checks, and Gerber export for manufacturing."
category: "workflow"
softwareSlug: "easyeda"
keyword: "easyeda pcb design schematic capture component library layout routing"
slug: "easyeda-pcb-design-schematic-capture-component-library-layout"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-07-09"
sources:
  - "https://docs.easyeda.com/en/PCB/Gerber-Generate/index.html"
  - "https://prodocs.easyeda.com/en/pcb/export-pcb-fabrication-file-gerber/"
---

# EasyEDA PCB Design: Schematic Capture, Component Library, and PCB Layout Workflow

EasyEDA is the most accessible PCB design tool we've used. It runs in the browser, has a massive online component library, and integrates directly with JLCPCB for manufacturing. We've designed dozens of boards in EasyEDA — from simple Arduino shields to 4-layer IoT devices. It's not as powerful as Altium or KiCad for complex designs, but for most hobbyist and small-team projects, it's more than enough. Here's our complete workflow.

## EasyEDA Versions

### EasyEDA Standard (Free)
- Browser-based schematic and PCB editor
- 2-layer PCB support
- Online component library
- Gerber export
- No offline mode

### EasyEDA Pro (Subscription)
- Browser and desktop app
- Up to 32-layer PCB support
- Advanced routing (differential pairs, length matching)
- Custom Gerber configuration
- 3D PCB viewer
- Team collaboration

This guide covers both versions, noting differences where relevant.

## Step 1: Create a New Project

1. Go to `easyeda.com` and log in.
2. Click **New Project** → **PCB Project**.
3. Name the project and add a description.
4. The project includes:
   - **Schematic**: Circuit diagram
   - **PCB**: Board layout
   - **BOM**: Bill of materials
   - **Gerber**: Manufacturing files (generated later)

## Step 2: Create the Schematic

### Place Components

1. Open the schematic editor.
2. Click **Library** → **Search** to find components:
   - Search by part number (e.g., "STM32F103C8T6")
   - Search by keyword (e.g., "100nF capacitor 0805")
   - Browse categories (resistors, capacitors, ICs, connectors)
3. Click a component to place it on the schematic.
4. Press **R** to rotate, **Space** to flip.
5. Continue placing all components.

### Component Library Sources

EasyEDA's library has three sources:

1. **EasyEDA Library**: Official components maintained by EasyEDA — most reliable
2. **User Library**: Components created by other users — verify before using
3. **JLCPCB Parts**: Components available for JLCPCB SMT assembly — includes LCSC part numbers

### Using JLCPCB Parts

For JLCPCB assembly:
1. Search for components with **LCSC part numbers**.
2. These components are stocked by JLCPCB and can be assembled directly.
3. Using LCSC parts eliminates the need for component sourcing.
4. Check the "Extended" badge — these are in stock and ready for assembly.

### Wire the Schematic

1. Click **Wire** (or press **W**).
2. Click on component pins to connect them.
3. Use **Net Labels** for connections across the schematic:
   - Press **N** to add a net label
   - Name the net (e.g., "VCC", "GND", "SDA")
   - Connect pins with the same net label
4. Use **Bus** connections for parallel signals:
   - Draw a bus line
   - Connect individual wires to the bus
   - Use bus entries to label each wire

### Power and Ground

1. Add **VCC** and **GND** symbols from the library.
2. Connect all power pins to VCC and all ground pins to GND.
3. For multi-voltage designs, use specific labels (e.g., "3V3", "5V", "12V").

### Annotation

1. Click **Annotate** to automatically assign reference designators (R1, R2, C1, U1, etc.).
2. Or manually assign by double-clicking the reference designator.

## Step 3: Assign Footprints

Each schematic component needs a PCB footprint:

1. Double-click a component in the schematic.
2. Check the **Footprint** field:
   - If a footprint is assigned, verify it's correct
   - If no footprint, click **Change** and select one
3. For common components (resistors, capacitors), footprints are pre-assigned.
4. For ICs, verify the footprint matches the package (SOIC-8, QFP-32, QFN-32, etc.).

### Footprint Verification

- **Check pin count**: Schematic pins = Footprint pins
- **Check pin spacing**: Match the datasheet (e.g., 1.27mm for SOIC, 0.5mm for QFP)
- **Check pad size**: Pads should be slightly larger than pins
- **Check package outline**: Matches the physical component

### Custom Footprints

If a footprint doesn't exist:

1. Go to **Library** → **Footprint** → **New**.
2. Draw the footprint:
   - Place pads with correct dimensions and spacing
   - Draw the silkscreen outline
   - Add reference designator and value text
3. Save the footprint to your personal library.
4. Assign it to the schematic component.

## Step 4: Convert Schematic to PCB

1. In the schematic editor, click **Design** → **Update PCB**.
2. EasyEDA creates a new PCB document with all components placed.
3. Components are initially placed in a cluster — arrange them on the board.

### Board Outline

1. Draw the board outline:
   - Click **Board Outline** → **Rectangle** or **Custom**.
   - Set the board dimensions.
2. For custom shapes, draw lines and arcs to create the outline.

## Step 5: Component Placement

Good placement is 80% of PCB design. A well-placed board is easy to route; a poorly placed board is a nightmare.

### Placement Guidelines

1. **Place connectors first** — USB, power, headers on board edges
2. **Place main ICs next** — microcontroller, power regulator in the center
3. **Place support components near their ICs** — decoupling capacitors next to power pins
4. **Group related components** — keep the power section together, the RF section together
5. **Avoid crossing signal paths** — if signals must cross, route one on another layer

### Decoupling Capacitors

Place decoupling capacitors as close as possible to IC power pins:
- **100nF**: Within 5mm of each power pin
- **10µF**: Near the voltage regulator
- **1µF**: For high-frequency noise on sensitive ICs

### Thermal Considerations

- **Power regulators**: Place away from sensitive components, near the board edge for heat dissipation
- **High-current traces**: Leave space for wide traces or copper pours
- **Hot components**: Don't cluster heat-generating components together

## Step 6: Route the PCB

### Layer Setup

For a 2-layer board:
- **Top layer**: Signal routing and component pads
- **Bottom layer**: Signal routing and ground plane

For a 4-layer board:
- **Top layer**: Signal routing
- **Layer 2**: Ground plane (solid copper)
- **Layer 3**: Power plane (solid copper)
- **Bottom layer**: Signal routing

### Routing Process

1. Start with **critical signals first**:
   - High-speed signals (USB, SPI, I2C)
   - Differential pairs (USB D+/D-, CAN)
   - Analog signals (ADC inputs, sensor signals)
2. Route **power traces** with appropriate width:
   - 1A: 0.3mm minimum
   - 2A: 0.6mm minimum
   - 5A: 1.5mm minimum
3. Route **general signals**:
   - 0.15-0.25mm width for most signals
   - 0.2mm spacing between traces
4. Add **copper pours** for ground:
   - Pour on the bottom layer (or layer 2 for 4-layer boards)
   - Connect to GND net
   - Set clearance to 0.2mm from other nets

### Via Usage

- **Standard via**: 0.3mm drill, 0.6mm pad — for most signals
- **Power via**: 0.4mm drill, 0.8mm pad — for power traces
- **Via stitching**: Add multiple vias for ground connections between layers

### Differential Pair Routing

For USB, CAN, Ethernet:

1. In EasyEDA Pro, define differential pairs in the schematic:
   - Assign net classes (e.g., "USB_DP", "USB_DM")
2. Route as a pair — both traces routed together with consistent spacing
3. Set the trace width and spacing based on impedance requirements:
   - USB 90Ω: 0.2mm width, 0.15mm spacing (on standard 1.6mm FR4)
4. Length-match the pairs if required.

## Step 7: Design Rule Check (DRC)

Before generating Gerber files:

1. Click **Design** → **Design Rule Check (DRC)**.
2. Configure rules:
   - **Clearance**: Minimum distance between traces and pads (typically 0.2mm)
   - **Track width**: Minimum trace width (typically 0.15mm)
   - **Hole size**: Minimum drill size (typically 0.3mm)
   - **Annular ring**: Minimum copper around holes (typically 0.15mm)
3. Run the DRC.
4. Fix all errors:
   - **Clearance violations**: Move traces or pads
   - **Width violations**: Widen traces
   - **Unrouted nets**: Route the missing connections

### DRC Best Practices

- **Run DRC after major routing changes** — don't wait until the end
- **Fix all errors** — don't ignore any DRC violations
- **Check for flying wires** — unrouted connections that will cause board failure
- **Verify copper pour connectivity** — ensure ground pour is connected to GND

## Step 8: Generate Gerber Files

1. Click **File** → **Generate PCB Fabrication File (Gerber)**.
2. EasyEDA checks for flying wires (unrouted connections).
3. If flying wires are found:
   - Click **Yes** to locate and fix them
   - Or click **No** to export anyway (not recommended)
4. The Gerber file is generated as a ZIP archive containing:
   - **Copper layers**: Top, bottom, inner layers
   - **Solder mask layers**: Top and bottom
   - **Silkscreen layers**: Top and bottom
   - **Drill file**: Plated and non-plated holes
   - **Board outline**: Board cutout

### Gerber Verification

Before sending to the manufacturer:

1. Use the **Gerber Viewer** in EasyEDA to preview.
2. Check:
   - All copper layers are present
   - Drill holes align with pads
   - Silkscreen is readable
   - Board outline is correct
3. Use a local Gerber viewer (Gerbv, CAM350) for additional verification.

### Gerber Export Errors

**"Export failed — integer 4, decimal 5 is too small"**:
- The canvas origin has shifted far from the PCB
- Fix: Reset the canvas origin using **Canvas Origin** → **By Cursor**, then click the lower-left corner of the PCB
- Or: Find and delete off-canvas elements in the Object panel

**Missing pads in Gerber**:
- Known issue with solid regions overlapping pads
- Fix: Remove solid regions that overlap pads, replace with traces
- Always verify Gerbers with a viewer before ordering

## Step 9: Order PCB

1. In EasyEDA, click **Order PCB**.
2. The Gerber file is uploaded to JLCPCB (or your chosen manufacturer).
3. Configure:
   - **Quantity**: Number of boards
   - **Layers**: 2, 4, 6, etc.
   - **Thickness**: 1.6mm (standard), 0.8mm, 2.0mm
   - **Copper weight**: 1oz (standard), 2oz (high current)
   - **Surface finish**: HASL (standard), ENIG (gold)
   - **Solder mask color**: Green, blue, black, red, white, purple
4. Review the cost and place the order.

### JLCPCB Assembly

For SMT assembly:
1. Click **Order SMT Assembly**.
2. Upload the BOM and pick-and-place file.
3. Select components from LCSC stock.
4. JLCPCB assembles the components on the board.
5. This is the fastest path from design to assembled board.

## Best Practices

- **Use LCSC part numbers** — ensures components are available for JLCPCB assembly
- **Run DRC frequently** — catch errors early, not at the end
- **Verify Gerbers before ordering** — use the Gerber viewer
- **Place decoupling caps close to ICs** — critical for reliable operation
- **Use copper pours for ground** — reduces noise and improves signal integrity
- **Route critical signals first** — high-speed and analog signals need priority
- **Check footprints against datasheets** — wrong footprints are the #1 cause of board failure
- **Keep trace widths appropriate for current** — undersized traces overheat
- **Document the design** — add notes on the schematic for future reference
