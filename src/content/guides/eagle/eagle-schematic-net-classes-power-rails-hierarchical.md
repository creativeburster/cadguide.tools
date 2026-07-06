---
title: "Eagle Schematic Design: Net Classes, Power Rails, and Hierarchical Sheets"
excerpt: "How to organize complex Eagle schematics using net classes for different signal types, proper power rail distribution, and hierarchical sheets for multi-page designs."
category: "standards"
softwareSlug: "eagle"
keyword: "eagle schematic net classes power rails hierarchical"
slug: "eagle-schematic-net-classes-power-rails-hierarchical"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.raypcb.com/schematic-drawing-tutorial-for-eagle/"
  - "https://maker.pro/custom/tutorial/autodesk-eagle-for-beginners-basics"
---

# Eagle Schematic Design: Net Classes, Power Rails, and Hierarchical Sheets

A clean schematic is the foundation of a manufacturable PCB. I've inherited Eagle projects with 200+ components on a single sheet, unlabeled nets, and power rails that made no sense. After cleaning them up, I developed these practices for organizing Eagle schematics.

## Net Classes: Routing Different Signal Types

Net classes define trace width and clearance for different signal types. Without net classes, every trace uses the default width — which is wrong for power traces (too thin) and wasteful for signal traces (too thick).

### Creating Net Classes

1. In the Schematic Editor: **Edit** → **Net Classes**.
2. Click **New** and create classes:

| Class Name | Width | Drill | Clearance | Use Case |
|-----------|-------|-------|-----------|----------|
| Power | 0.5mm | 0.4mm | 0.3mm | Power traces (VCC, GND, 3V3, 5V) |
| High | 0.4mm | 0.3mm | 0.25mm | High-current signals (>100mA) |
| Signal | 0.2mm | 0.3mm | 0.15mm | Standard digital/analog signals |
| Fine | 0.15mm | 0.25mm | 0.15mm | Dense routing (BGA escape, fine pitch) |
| USB | 0.2mm | 0.3mm | 0.15mm | USB differential pairs (with impedance control) |

### Assigning Net Classes

1. Click the **Net** tool.
2. In the toolbar, select the net class from the dropdown.
3. Draw the net — it inherits the selected class.
4. To change an existing net's class: select the net → right-click → **Properties** → change class.

### Power Net Assignment

Always assign power nets to the Power class:
1. Name the net: `GND`, `VCC`, `+3V3`, `+5V`.
2. Assign the Power net class.
3. In the board layout, these traces automatically get the wider width.

## Power Rail Distribution

### Using Power Symbols

Eagle's power symbols (GND, VCC, etc.) create implicit net connections — any two power symbols with the same name are connected without a visible wire.

1. Click **Add** → search for `GND` in the `supply1` or `supply2` library.
2. Place the GND symbol near each component's GND pin.
3. Connect the pin to the GND symbol with a short wire.
4. All GND symbols are automatically connected to the same net.

### Power Rails for Multiple Voltages

For designs with multiple power rails (e.g., 12V, 5V, 3.3V):

1. Create named power symbols:
   - `+12V` — 12V rail
   - `+5V` — 5V rail (from regulator)
   - `+3V3` — 3.3V rail (from LDO)
   - `GND` — Common ground

2. Place power symbols at regulator outputs and component power pins.
3. The schematic shows clean power distribution without long wires crossing the sheet.

### Power Flag

Eagle requires at least one power source on each power net. Without it, ERC reports "Power pin on net GND has no driving pin."

1. Add a `PWR_FLAG` symbol (from the `supply1` library) to each power net.
2. Connect it to the net.
3. This tells Eagle "this net has a power source" and clears the ERC warning.

## Hierarchical Sheets

For designs with more than 50 components, use hierarchical sheets to organize the schematic into logical blocks.

### Creating a Hierarchical Sheet

1. In the top-level schematic: click **Sheet** tool.
2. Draw a rectangle — this represents a sub-sheet.
3. Name the sheet (e.g., "Power Supply", "MCU", "Sensors").
4. Double-click the sheet to open it.
5. Design the sub-circuit in the sub-sheet.

### Connecting Sheets

Use ports to pass signals between the top-level sheet and sub-sheets:

1. In the sub-sheet: click **Port** tool → place an input/output port.
2. Name the port (e.g., `SDA`, `SCL`, `VCC_3V3`).
3. In the top-level sheet: the port appears on the sheet boundary.
4. Connect wires to the port — signals pass between sheets.

### Typical Hierarchical Organization

For a microcontroller board:

**Top-level sheet**: Shows block diagram and interconnections
- **Sub-sheet 1**: Power supply (regulators, capacitors, protection)
- **Sub-sheet 2**: Microcontroller (MCU, crystal, decoupling)
- **Sub-sheet 3**: USB interface (connector, ESD protection, termination)
- **Sub-sheet 4**: Sensors (I2C sensors, pull-ups, connectors)
- **Sub-sheet 5**: Output drivers (MOSFETs, flyback diodes, connectors)

This organization makes the schematic readable and allows multiple engineers to work on different blocks simultaneously.

## ERC (Electrical Rule Check) Best Practices

1. Run ERC after every schematic change: **Tools** → **ERC**.
2. Fix all errors before creating the board layout.
3. Common ERC issues:

**"Net has no driving pin"**: A net is connected to input pins but no output pin drives it. Check if you forgot to connect a microcontroller output or a power supply.

**"Power pin connected to non-power pin"**: A power pin (VCC, GND) is connected to a signal pin. Check if the pin direction in the library is set correctly.

**"Unconnected pin"**: A pin has no wire connected. If the pin is unused (e.g., NC pin), add an "NC" marker or connect it to a net named "N.C."

**"Multiple nets on same pin"**: Two different net names are connected to the same pin. Check for naming conflicts or accidental connections.

## Schematic Layout Best Practices

1. **Signal flow left to right**: Inputs on the left, outputs on the right.
2. **Power flow top to bottom**: Power sources at the top, ground at the bottom.
3. **Group by function**: Keep related components together (e.g., all USB components in one area).
4. **Use labels for long connections**: Instead of drawing long wires across the sheet, use net labels. Two nets with the same label are automatically connected.
5. **Add bypass capacitors near ICs**: Place 0.1µF decoupling capacitors next to each IC's power pin. This is both a schematic and PCB layout practice.
6. **Use consistent reference designators**: U for ICs, R for resistors, C for capacitors, L for inductors, D for diodes, Q for transistors, J for connectors.
