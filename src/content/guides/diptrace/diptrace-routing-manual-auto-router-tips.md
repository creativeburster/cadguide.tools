---
title: "DipTrace Routing: Manual and Auto-Router Tips for Clean PCB Layouts"
excerpt: "How to achieve professional routing results in DipTrace — covering manual routing techniques, auto-router configuration, differential pairs, ground planes, and common routing mistakes to avoid."
category: "workflow"
softwareSlug: "diptrace"
keyword: "diptrace routing manual auto-router ground plane tips"
slug: "diptrace-routing-manual-auto-router-tips"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.diptrace.com/support/routing"
  - "https://www.diptrace.com/docs/manual/pcb-layout"
---

# DipTrace Routing: Manual and Auto-Router Tips for Clean PCB Layouts

Routing is where your schematic becomes a physical circuit. DipTrace's routing tools are basic compared to Altium or KiCad, but with the right techniques, you can produce clean, manufacturable boards. Here's what I've learned from routing 100+ DipTrace boards.

## Manual Routing

### Basic Routing

1. Click **Route Manual** in the toolbar.
2. Click on a starting pad → a trace follows your cursor.
3. Click to place a vertex (corner).
4. Click on the destination pad to complete the connection.
5. Press **Tab** to change layers (places a via at the transition).
6. Press **Space** to cycle through trace widths (from the net class).

### Trace Width Selection

DipTrace uses net classes to determine trace width. Set up net classes before routing:

1. **Design** → **Net Classes**.
2. Create classes:

| Class | Width | Use |
|-------|-------|-----|
| Power | 0.5mm | VCC, GND, power traces |
| Signal | 0.25mm | Digital signals |
| Fine | 0.15mm | Dense routing, BGA escape |

3. Assign nets to classes: select a net → right-click → **Net Class** → select.

### Routing Angles

- **45° corners**: Default and recommended. Press **Shift+Space** to toggle between 45° and 90°.
- **Avoid 90° corners**: They can cause acid traps in manufacturing and signal reflections at high frequencies.
- **Curved corners**: DipTrace doesn't support curved routing — use 45° segments to approximate curves.

### Layer Transition

When changing layers during routing:
1. Press **Tab** — DipTrace places a via at the current position.
2. The trace continues on the new layer.
3. Use the minimum number of vias — each via adds resistance, inductance, and a potential failure point.

## Auto-Router Configuration

DipTrace's built-in auto-router is adequate for simple to medium-complexity boards.

1. **Route** → **Auto-Routing**.
2. Configure:

**General tab:**
- **Grid**: 0.1mm (or 5mil) — finer grid = better routing but slower
- **Layers**: Select which layers to use (Top, Bottom for 2-layer)
- **Passes**: 3-5 (more passes = better completion but slower)

**Strategy tab:**
- **Router**: Select **Specctra** (if available) or **DipTrace Router**
- **Optimization**: Enable (router optimizes after initial routing)
- **Push traces**: Enable (router moves existing traces to make room)

**Rules tab:**
- **Min trace width**: From net classes
- **Min clearance**: From design rules
- **Via size**: From design rules

3. Click **Route All**.
4. The auto-router routes all unrouted nets.

### Auto-Router Limitations

DipTrace's auto-router has known limitations:
- **No push-and-shove**: The router can't move manually routed traces out of the way. Route manual traces first, lock them, then auto-route.
- **No differential pair awareness**: The router doesn't maintain differential pair spacing. Route differential pairs manually.
- **No length matching**: The router doesn't match trace lengths. Route length-matched signals manually.
- **Completion rate**: Typically 85-95% for medium boards. Unrouted nets need manual completion.

## Recommended Hybrid Routing Workflow

1. **Route power traces manually**: Widest traces, shortest paths, no unnecessary vias.
2. **Route differential pairs manually**: USB, Ethernet, HDMI — maintain spacing and match lengths.
3. **Route clock signals manually**: Short, direct, minimal vias.
4. **Route analog signals manually**: Keep away from digital signals and switching regulators.
5. **Lock all manually routed traces**: Select → right-click → **Lock**.
6. **Auto-route remaining signals**: Let the router handle GPIO, I2C, UART, and other non-critical nets.
7. **Review auto-routed traces**: Look for unnecessary vias, long detours, and poor layer usage.
8. **Clean up**: Reroute any auto-routed traces that look poor.

## Ground Planes (Copper Pours)

### Creating a Ground Pour

1. Click **Copper Pour** tool.
2. Select the layer (Bottom for 2-layer board).
3. Draw a rectangle covering the entire board area.
4. In the pour properties:
   - **Net**: GND
   - **Clearance**: 0.3mm (distance from pour to other copper)
   - **Pour type**: Solid (or Hatched for thermal relief)
   - **Thermal spokes**: Enable for pads (prevents heat sinking during soldering)
   - **Island removal**: Enable (removes small isolated copper areas)

5. Click **OK** — DipTrace fills the area with copper, avoiding pads and traces.

### Pour on Both Layers

For a 2-layer board, pour ground on both layers:
1. Bottom layer: Full ground pour (primary ground plane).
2. Top layer: Ground pour in remaining space (after signal routing).
3. Add via stitching: **Objects** → **Via Stitching** → set grid to 10mm → DipTrace places GND vias connecting both pours.

### Thermal Relief

For through-hole pads connected to ground pours, enable thermal relief:
- **Pad properties** → **Thermal Spokes**: Enable
- This creates 4 narrow connections instead of a full copper connection
- Prevents the pad from acting as a heat sink during soldering
- Makes soldering easier and more reliable

## Differential Pair Routing in DipTrace

DipTrace supports differential pairs:

1. **Design** → **Differential Pairs**.
2. Click **Add Pair**.
3. Select the positive net (e.g., `USB_P`) and negative net (e.g., `USB_N`).
4. Set:
   - **Trace width**: Calculated for target impedance (e.g., 0.2mm for 90Ω on 4-layer)
   - **Spacing**: Calculated for differential impedance (e.g., 0.15mm)

5. Route manually: click on one pad of the pair → DipTrace routes both traces simultaneously with the specified spacing.

6. Length matching: After routing, check both trace lengths in the **Net Properties** panel. If they differ, add a serpentine to the shorter trace using manual routing.

## Common Routing Mistakes

**Power traces too thin**: Power traces need to carry current without significant voltage drop. A 0.25mm trace carrying 1A over 100mm drops 0.12V. Use 0.5mm or wider for power.

**No ground return path**: Every signal needs a ground return path. If the ground plane is cut by traces or vias, the return current takes a long detour, causing EMI. Keep the ground plane as intact as possible.

**Decoupling caps too far from ICs**: A decoupling capacitor placed 20mm from the IC is useless at high frequencies. Place 0.1µF caps within 5mm of each IC power pin, connected with short traces.

**Vias under SMD pads**: Vias under SMD pads can wick solder through the hole during reflow, causing poor solder joints. Place vias outside the pad area, or use tented vias (solder mask over the via).

**Traces at acute angles**: Traces that meet at very sharp angles (< 30°) can cause acid traps in manufacturing. Use 45° or wider angles.
