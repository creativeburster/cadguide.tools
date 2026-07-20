---
title: "DipTrace Schematic and PCB Design: Complete Beginner to Production Workflow"
excerpt: "Complete walkthrough of designing a PCB in DipTrace from schematic to manufacturing — covering schematic capture, component libraries, board layout, routing, and Gerber export."
category: "workflow"
softwareSlug: "diptrace"
keyword: "diptrace schematic pcb design workflow beginner"
slug: "diptrace-schematic-pcb-design-workflow"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-07-06"
sources:
  - "https://www.diptrace.com/support/tutorials/"
  - "https://www.pcbway.com/blog/PCB_Design_Tutorial/PCB_Design_Tutorial_with_DipTrace_for_beginners.html"
---

# DipTrace Schematic and PCB Design: Complete Beginner to Production Workflow

DipTrace is the most beginner-friendly professional PCB design tool we've used. It's not as powerful as Altium or OrCAD, but for 2-layer and 4-layer boards up to medium complexity, it's excellent. We teach PCB design using DipTrace because the learning curve is gentle. Here's the complete workflow from schematic to manufacturing files.

## Step 1: Create a Schematic

1. Open **DipTrace Schematic**.
2. **File** → **New** → **New Schematic**.
3. Place components:
   - Click **Place Component** in the toolbar.
   - Search the library (e.g., "resistor", "ATmega328", "USB connector").
   - Click on the schematic sheet to place.
   - Press **R** to rotate, **Space** to flip.

4. Connect components:
   - Click **Wire** tool.
   - Click on a component pin → drag to another pin → click to connect.
   - Wires snap to the 0.1" grid automatically.

5. Add power and ground:
   - Place **GND** and **VCC** symbols from the power library.
   - Connect to component power pins.

6. Add net labels (for long connections):
   - Click **Net Label** tool.
   - Place on a wire → type the net name (e.g., "SDA").
   - Any two wires with the same net label are connected.

7. Set component values:
   - Double-click a component → enter value (e.g., "10k", "0.1uF").

8. Run ERC:
   - **Verification** → **Check Project for Errors**.
   - Fix any errors (unconnected pins, duplicate references, power issues).

## Step 2: Convert Schematic to PCB

1. **File** → **Export to PCB** (or press **Ctrl+E**).
2. DipTrace opens the PCB Layout module with all components imported.
3. Components appear in a cluster outside the board area.
4. A default board outline is created (100×80mm — adjust as needed).

## Step 3: Define Board Outline

1. In PCB Layout: **Design** → **Board Points** → **Renumber Board**.
2. To resize the board:
   - Select the board outline (click on the edge).
   - Drag corners to resize, or
   - **Design** → **Board Points** → enter exact dimensions.
3. For custom shapes:
   - **Design** → **Board Shape** → **Custom**.
   - Draw the outline using arcs and lines.
4. Set board origin: **Design** → **Set Origin** → click the lower-left corner.

## Step 4: Place Components

1. Drag components from the cluster onto the board.
2. Placement guidelines:
   - **Connectors on edges**: USB, power jack, headers near board edges.
   - **MCU in center**: Microcontroller placed centrally for routing access.
   - **Decoupling caps near ICs**: Place 0.1µF caps within 5mm of each IC power pin.
   - **Crystal near MCU**: Place the crystal as close as possible to the MCU pins.
   - **Regulators near power input**: Linear regulators near the power connector with heatsink clearance.

3. Use the **Placement by List** tool for precise positioning:
   - **Design** → **Placement by List**.
   - Enter exact X, Y coordinates and rotation for each component.

4. Check for overlaps: **Verification** → **Check Placement**.

## Step 5: Define Design Rules

1. **Design** → **Design Rules**.
2. Set:

**Trace width:**
- **Default**: 0.25mm (10mil)
- **Power**: 0.5mm (20mil)
- **Signal**: 0.2mm (8mil)

**Clearance:**
- **Pad to pad**: 0.25mm
- **Trace to trace**: 0.2mm
- **Trace to pad**: 0.2mm

**Via:**
- **Drill**: 0.3mm
- **Diameter**: 0.6mm

**Board edge clearance**: 0.3mm

3. Check with your PCB manufacturer's capabilities before setting these values.

## Step 6: Route Traces

### Manual Routing

1. Click **Route** → **Manual Routing**.
2. Click on a pad → drag to the destination pad → click to connect.
3. Press **Tab** to change layer (places a via at the transition point).
4. Press **Space** to change trace width (cycles through net class widths).

### Auto-Routing

1. **Route** → **Auto-Routing**.
2. Set:
   - **Layers**: Top and Bottom (for 2-layer)
   - **Grid**: 0.1mm
   - **Passes**: 3 (more passes = better completion)
3. Click **Route All**.
4. DipTrace routes all unrouted nets.

### Hybrid Approach (Recommended)

1. Manually route power traces (widest, shortest paths).
2. Manually route critical signals (USB, crystal, analog).
3. Lock these traces: select → right-click → **Lock**.
4. Auto-route the remaining signals.
5. Review and clean up auto-routed traces.

## Step 7: Add Ground Plane (Copper Pour)

1. Click **Copper Pour** tool.
2. Select the layer (Bottom for 2-layer board).
3. Draw a rectangle covering the entire board.
4. In the pour dialog:
   - **Net**: GND
   - **Clearance**: 0.3mm (distance from pour to other copper)
   - **Pour type**: Solid
5. Click **OK** → DipTrace fills the area with copper, avoiding pads and traces.

6. Repeat for the Top layer:
   - Fill remaining top-layer space with GND pour.
   - This creates a low-impedance ground return path.

7. Add via stitching:
   - **Objects** → **Via Stitching**.
   - Set grid: 10mm.
   - DipTrace places GND vias across the board to connect top and bottom ground pours.

## Step 8: Run DRC

1. **Verification** → **Check Project for Errors** (DRC).
2. DipTrace checks:
   - Clearance violations
   - Unrouted nets
   - Width violations
   - Silk screen on pads
   - Board edge clearance
3. Fix all errors before proceeding.

## Step 9: Add Silk Screen and Documentation

1. Verify silk screen text:
   - Component reference designators (U1, R1, C1, etc.)
   - Component values (where space allows)
   - Board name and revision
   - Logo (import as DXF or image)

2. Add mechanical markings:
   - Mounting hole positions (place as non-plated holes)
   - Connector labels (e.g., "USB", "PWR", "UART")
   - Pin 1 indicators for ICs

3. Check silk screen doesn't overlap pads: **Verification** → **Check Silk Screen**.

## Step 10: Generate Manufacturing Files

### Gerber Files

1. **File** → **Export** → **Gerber**.
2. Select layers to export:

| File | Layer | Description |
|------|-------|-------------|
| .GTL | Top Copper | Top traces and pads |
| .GBL | Bottom Copper | Bottom traces and pads |
| .GTS | Top Solder Mask | Top mask |
| .GBS | Bottom Solder Mask | Bottom mask |
| .GTO | Top Silk | Top silkscreen |
| .GBO | Bottom Silk | Bottom silkscreen |
| .GKO | Board Outline | Board edge |
| .TXT | Drills | Drill file |

3. Set format: RS-274X (standard Gerber).
4. Click **Export** → save all files to a single folder.

### Drill File

1. **File** → **Export** → **N/C Drill**.
2. Set format: Excellon.
3. Set units: Metric (mm) or Imperial (inch) — match your manufacturer's preference.
4. Click **Export**.

### BOM

1. **File** → **Export** → **BOM**.
2. Set format: CSV or HTML.
3. Include: Reference, Value, Quantity, Footprint, Manufacturer.
4. Click **Export**.

### Pick-and-Place

1. **File** → **Export** → **Pick and Place**.
2. Set format: CSV.
3. Include: Reference, X, Y, Rotation, Layer.
4. Click **Export**.

## Step 11: Verify Before Ordering

1. Open all Gerber files in a viewer (Gerbv, KiCad GerberViewer, or online viewer).
2. Verify:
   - Board outline is correct
   - All copper traces are present
   - Solder mask covers the board except on pads
   - Silk screen is readable and doesn't overlap pads
   - Drill holes are in the correct positions
3. Compare with your DipTrace board layout — any discrepancies indicate an export error.

4. Upload to your PCB manufacturer (JLCPCB, PCBWay, OSH Park).
5. Order a small batch (5-10 boards) for prototyping before full production.
