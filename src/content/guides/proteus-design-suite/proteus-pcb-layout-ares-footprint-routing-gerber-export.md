---
title: "Proteus PCB Layout ARES: Footprint Assignment, Routing, and Gerber Export Workflow"
excerpt: "Design PCBs in Proteus ARES from ISIS schematic: component footprint packaging, auto-routing setup, design rule checks, copper pour, and Gerber file export for fabrication."
category: "workflow"
softwareSlug: "proteus-design-suite"
keyword: "proteus pcb layout ares footprint routing gerber export"
slug: "proteus-pcb-layout-ares-footprint-routing-gerber-export"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://www.labcenter.com/tutorials/"
  - "https://www.labcenter.com/"
---

# Proteus PCB Layout ARES: Footprint Assignment, Routing, and Gerber Export Workflow

Proteus combines schematic capture (ISIS) and PCB layout (ARES) in one package. The transition from schematic to layout is seamless, but there are several configuration steps that determine whether your board will be manufacturable. I'll walk through the complete workflow from schematic to Gerber files.

## From ISIS to ARES

The PCB layout process starts in ISIS:

1. **Complete the schematic** in ISIS with all components wired
2. **Assign footprints** to every component (this is the most commonly missed step)
3. **Run the netlist check** — Tools > Netlist Compiler
4. **Launch ARES** — Tools > Netlist to ARES

ARES opens with all components placed in a pile at the center of the board area. You'll need to arrange them manually or use auto-placement.

## Footprint Assignment

Every component in ISIS needs a footprint defined in ARES. To assign footprints:

1. **Double-click a component** in ISIS to open its properties
2. **Check the PCB Package field** — if empty, the component has no footprint
3. **Click the Package button** and select the appropriate footprint from the library
4. **Verify pin mapping** — ensure schematic pins match footprint pads

Common footprint assignments:
- Resistors: `RES40` (through-hole) or `R0805` (SMD)
- Capacitors: `CAP10` (through-hole) or `C0805` (SMD)
- ICs: `DIL8`, `DIL14`, `DIL16` (through-hole) or `SO08`, `SO14` (SMD)
- Arduino: Custom footprint or `ARDUINO_UNO`

If a footprint doesn't exist, you can create one in ARES using the Library Manager.

## Board Setup

In ARES:

1. **Draw the board outline** using the 2D Graphics box tool on the Board layer
2. **Set grid units** — 0.05 inch (50 mil) for through-hole, 0.025 inch (25 mil) for SMD
3. **Configure layer stackup** — Setup > Layer Stackup, define copper, solder mask, and silkscreen layers
4. **Set design rules** — Setup > Design Rules, define:
   - Minimum track width (8 mil for standard, 6 mil for fine-pitch)
   - Minimum clearance (8 mil for standard, 6 mil for fine-pitch)
   - Minimum annular ring (6 mil)
   - Minimum drill size (0.3 mm)

## Component Placement

1. **Select components** from the pile and drag them to their positions
2. **Use the rotation tool** (R key) to orient components
3. **Place decoupling capacitors** close to IC power pins
4. **Keep connectors** on board edges
5. **Group related components** together (e.g., power supply section, microcontroller section)

Use the **Auto-Placement** tool (Tools > Auto Placer) for initial placement, then manually optimize.

## Routing

### Manual Routing

1. **Select the Track tool** (T key)
2. **Set the track width** in the toolbar (10 mil for signals, 20-30 mil for power)
3. **Click a pad** to start routing
4. **Click at corners** to change direction
5. **Click the destination pad** to complete

### Auto-Routing

1. **Tools > Auto Router**
2. **Configure routing strategy**:
   - Layer assignment (top/bottom for 2-layer boards)
   - Preferred track widths
   - Routing grid
3. **Run the router** — it routes all unrouted connections
4. **Review the results** — check for poor routing choices and manually fix

### Copper Pour

For ground planes:

1. **Select the Zone tool** (Z key)
2. **Draw a polygon** around the board area on the bottom copper layer
3. **Assign the zone to GND net**
4. **Set clearance** (10-15 mil from other nets)
5. **Pour the copper** — the zone fills automatically, avoiding pads and tracks

## Design Rule Check

Before generating Gerber files:

1. **Tools > Design Rule Check**
2. Review all violations:
   - Clearance violations
   - Unrouted nets
   - Width violations
   - Annular ring violations
3. **Fix all errors** — a board with DRC violations may not manufacture correctly

## Gerber Export

1. **Output > Gerber/Excellon Output**
2. **Select layers** to export:
   - Top copper
   - Bottom copper
   - Top solder mask
   - Bottom solder mask
   - Top silkscreen
   - Bottom silkscreen
   - Board outline
3. **Set the output format** — RS-274X (extended Gerber) is the standard
4. **Set the aperture scale** — 1:1
5. **Click OK** to generate the files

For drill files:
1. **Output > Gerber/Excellon Output > Drill**
2. Select Excellon format
3. Set units (metric or imperial based on your fabricator)

## Common Issues

### Components Not Appearing in ARES

The component has no footprint assigned in ISIS. Go back to ISIS, assign the PCB package, and re-export the netlist.

### Ratsnest Shows Unrouted Connections

Either the routing is incomplete or there's a schematic error. Check the netlist in ISIS for missing wires or incorrect connections.

### Gerber Files Missing Layers

The layer wasn't enabled in the Gerber output dialog. Re-export with all required layers selected.

### Copper Pour Not Filling

The zone may not be assigned to a net, or the clearance is too large. Check the zone properties and ensure the GND net is assigned.
