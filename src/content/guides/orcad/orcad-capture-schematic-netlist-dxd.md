---
title: "OrCAD Capture Schematic Design: Netlist Generation and DxD Integration"
excerpt: "How to use OrCAD Capture for professional schematic design — covering part libraries, hierarchical design, DRC configuration, and netlist export for PCB layout tools."
category: "workflow"
softwareSlug: "orcad"
keyword: "orcad capture schematic netlist dxd integration"
slug: "orcad-capture-schematic-netlist-dxd"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://resources.pcb.cadence.com/orcad-x-constraint-management-guide"
  - "https://medium.com/@lisa_8645/orcad-pcb-design-tutorial-for-2026-00e73c411310"
---

# OrCAD Capture Schematic Design: Netlist Generation and DxD Integration

OrCAD Capture is the schematic entry tool in Cadence's PCB design flow. We've used it for years in professional PCB design. It's more structured than Eagle — stricter library management, better hierarchical design, and tighter integration with OrCAD PCB Professional. Here's how to use it effectively.

## Project Setup

1. **File** → **New** → **Project**.
2. Select project type:
   - **PC Board Project**: Schematic + PCB layout (full flow)
   - **Analog/Mixed Signal**: Schematic + PSpice simulation
   - **Programmable Logic**: Schematic + FPGA synthesis
3. Name the project and select a location.
4. Capture creates a project file (.opj) with a default schematic page.

## Library Management

### Using Built-In Libraries

OrCAD ships with extensive component libraries:

1. In the project manager, right-click **Library** → **Add Library**.
2. Browse to `C:\Cadence\OrCAD_2026\tools\capture\library\`.
3. Key libraries:
   - `discrete.olb` — Resistors, capacitors, diodes, transistors
   - `connector.olb` — Headers, USB, D-Sub, custom connectors
   - `microchip.olb` — Microchip PIC microcontrollers
   - `ti.olb` — Texas Instruments ICs
   - `analog_dev.olb` — Analog Devices components

### Creating Custom Libraries

1. **File** → **New** → **Library**.
2. Save as `company-parts.olb`.
3. Right-click the library → **New Part**.
4. Define the part:
   - **Name**: Part number (e.g., `MCP23017-E/SO`)
   - **Part reference**: U? (auto-incrementing reference)
   - **Number of pins**: Match the IC pin count
   - **Package type**: DIP, SOIC, QFP, etc.

5. Design the part symbol:
   - Draw the body outline
   - Place pins with correct numbers and names
   - Set pin types (Input, Output, Bidirectional, Power)

6. Add packaging information:
   - Right-click the part → **User Properties** → add `PCB Footprint` = `SOIC16-300`
   - This footprint name must match a footprint in your PCB layout library

## Hierarchical Design

### Creating Hierarchical Blocks

1. In the root schematic: **Place** → **Hierarchical Block**.
2. Draw a block on the schematic.
3. Name the block (e.g., "Power Supply").
4. Double-click the block to enter the sub-schematic.
5. Design the sub-circuit.

### Adding Hierarchical Ports

1. In the sub-schematic: **Place** → **Hierarchical Port**.
2. Select port type:
   - **PORTBOTH-L**: Bidirectional, left-side
   - **PORTINPUT-L**: Input, left-side
   - **PORTOUTPUT-R**: Output, right-side
3. Name the port (e.g., `VCC_3V3`, `GND`, `SDA`).
4. The port appears on the hierarchical block in the parent schematic.
5. Connect wires to the port in the parent schematic.

### Flat Design (Alternative)

For designs that don't need hierarchy, use flat multi-page schematics:
1. Right-click the schematic folder → **New Page**.
2. Each page is independent — signals connect via off-page connectors.
3. **Place** → **Off-Page Connector** → name it (e.g., `SDA`).
4. Off-page connectors with the same name on different pages are connected.

## Design Rule Check (DRC)

### Configuring DRC

1. **Options** → **Design Rules**.
2. Set rules:
   - **Check pin types**: Warn if output pins are connected together
   - **Check unconnected pins**: Warn about unused pins
   - **Check power connections**: Warn if power pins lack a driving source
   - **Check duplicate references**: Error if two parts have the same reference designator

### Running DRC

1. **Tools** → **Design Rules Check**.
2. Select scope: **Entire design** or **Current page**.
3. Click **OK**.
4. Capture generates a DRC report listing all warnings and errors.
5. Fix all errors before generating the netlist.

## Netlist Generation

### For OrCAD PCB Professional

1. **Tools** → **Create Netlist**.
2. Select **Allegro** tab (for OrCAD PCB Professional / Allegro PCB Editor).
3. Set:
   - **Output file**: `board.net` (or project name)
   - **Create PCB board file**: Check if creating a new board
   - **User properties**: Select which properties to pass to the PCB tool
4. Click **OK**.
5. The netlist opens in OrCAD PCB Professional with all components and net connections.

### For Other PCB Tools

OrCAD Capture can generate netlists for other layout tools:
- **Altium Designer**: Select **Altium** tab
- **PADS**: Select **PADS** tab
- **Mentor Graphics**: Select **Mentor** tab
- **Generic SPICE**: Select **SPICE** tab (for simulation)

## Component Properties for Manufacturing

Add these properties to each component for complete documentation:

1. Select a component → right-click → **Edit Properties**.
2. Add properties:
   - **Part Number**: Manufacturer part number
   - **Manufacturer**: Company name
   - **Value**: Component value (e.g., "10k", "0.1uF")
   - **Tolerance**: e.g., "1%", "5%"
   - **Voltage Rating**: For capacitors (e.g., "16V")
   - **PCB Footprint**: Must match the footprint library name
   - **Description**: Brief description for BOM

3. These properties flow into the BOM and pick-and-place files.

## BOM Generation

1. **Tools** → **Bill of Materials**.
2. Configure:
   - **Output format**: CSV, HTML, or Excel
   - **Group by**: Part Number (consolidates identical parts)
   - **Include properties**: Part Number, Manufacturer, Value, Quantity, Footprint
3. Click **OK**.
4. The BOM lists all components grouped by part number with quantities.

## Best Practices

1. **Use consistent naming**: Follow your company's naming convention for parts, nets, and references.
2. **Keep libraries organized**: One custom library per project or per component category. Don't mix unrelated parts.
3. **Run DRC frequently**: After every major schematic change, run DRC to catch errors early.
4. **Document design decisions**: Add notes to the schematic using **Place** → **Note** to explain non-obvious design choices.
5. **Use power symbols consistently**: Use the same GND and VCC symbols throughout the design. Mixing different ground symbols can cause net connection issues.
6. **Version control**: OrCAD project files are binary — use a version control system that handles binary files (Git LFS, SVN, or PDM).
