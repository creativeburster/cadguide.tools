---
title: "Eagle Board Layout: Routing Strategies for 2-Layer and 4-Layer PCBs"
excerpt: "How to route PCBs in Eagle for optimal signal integrity and manufacturability — covering layer stackup planning, ground plane strategies, differential pair routing, and via placement guidelines."
category: "workflow"
softwareSlug: "eagle"
keyword: "eagle board layout routing 2-layer 4-layer ground plane"
slug: "eagle-board-layout-routing-2layer-4layer"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://learn.sparkfun.com/tutorials/using-eagle-board-layout/all"
  - "https://resources.altium.com/p/understanding-ground-planes-your-two-layer-pcb"
---

# Eagle Board Layout: Routing Strategies for 2-Layer and 4-Layer PCBs

Routing is where the schematic becomes a physical board. Good routing makes a board that works; bad routing makes a board that picks up noise, fails EMI testing, and has signal integrity issues. I've routed hundreds of Eagle boards and these are the strategies that consistently produce working PCBs.

## 2-Layer Board Strategy

### Layer Assignment

| Layer | Purpose |
|-------|---------|
| Top | Signal routing (primary), component pads |
| Bottom | Ground plane (as much as possible), secondary signal routing |

### Routing Priority

Route in this order:
1. **Power traces** — Widest traces, shortest paths
2. **Critical signals** — High-speed, analog, differential pairs
3. **General signals** — Digital I/O, slow signals
4. **Ground fills** — Fill remaining space on both layers

### Ground Plane Strategy for 2-Layer

On a 2-layer board, the bottom layer should be mostly ground plane:

1. Route all signals on the top layer first.
2. Use the bottom layer for signal routing only when necessary (short jumps).
3. Fill the bottom layer with a ground polygon:
   - Click **Polygon** tool → draw a rectangle covering the entire board.
   - Set layer to **Bottom**.
   - Set **Isolate** to 0.3mm (clearance from other copper).
   - Set **Pour** to **Solid**.
   - Name the polygon `GND`.
4. Fill the top layer with ground polygon too:
   - Any unused top-layer space becomes ground.
   - This provides a low-impedance ground return path.

5. Add via stitching:
   - Place GND vias around the board every 10-20mm.
   - This connects top and bottom ground planes.
   - Reduces ground impedance and provides return paths for signals.

### Signal Return Paths

On a 2-layer board, every signal trace needs a return path. The ground plane on the bottom layer provides this — but only if the return path is uninterrupted:

- **Don't cut the ground plane with long traces**: A long bottom-layer trace splits the ground plane, forcing return currents to go around the gap.
- **Use jumpers instead of bottom traces**: If you must route on the bottom, keep traces short (< 10mm) to minimize ground plane disruption.
- **Add return vias near signal vias**: When a signal transitions from top to bottom, place a ground via nearby for the return current.

## 4-Layer Board Strategy

### Layer Stackup

Standard 4-layer stackup:

| Layer | Purpose |
|-------|---------|
| Top | Signal routing, component pads |
| Inner 1 (GND) | Solid ground plane (no routing) |
| Inner 2 (PWR) | Power plane (or split power planes) |
| Bottom | Signal routing, component pads |

### Advantages of 4-Layer

- **Dedicated ground plane**: Uninterrupted ground on Inner 1 — excellent signal integrity.
- **Dedicated power plane**: Low-impedance power distribution on Inner 2.
- **Signal routing on outer layers**: Both top and bottom available for routing — no ground plane conflicts.
- **EMI performance**: Much better than 2-layer due to tight coupling between signal and ground planes.

### Power Plane Design

1. Fill Inner 2 with a polygon named for your main power rail (e.g., `+3V3`).
2. For multiple voltages, split the power plane:
   - Left half: +3V3
   - Right half: +5V
   - Keep the split along a line where no signal traces cross.
3. Add decoupling capacitors near each component's power pin:
   - 0.1µF ceramic capacitor from VCC to GND, placed within 5mm of the IC.
   - 10µF bulk capacitor at the power input.

### Via Types for 4-Layer

| Via Type | Drill | Connects | Use Case |
|----------|-------|----------|----------|
| Through via | 0.3mm | All layers | General signal and power |
| Blind via | 0.2mm | Top + Inner 1 only | High-density (BGA escape) |
| Buried via | 0.2mm | Inner 1 + Inner 2 only | Internal connections (rare) |

Blind and buried vias increase manufacturing cost significantly. Use through vias unless density requires blind vias.

## Differential Pair Routing

For USB, HDMI, Ethernet, and other differential signals:

### Setting Up Differential Pairs in Eagle

1. Name the nets: `USB_N` and `USB_P` (or any pair with `_N` and `_P` suffix).
2. In the Board Editor: **Tools** → **Differential Pair Routing**.
3. Select the two nets.
4. Set parameters:
   - **Width**: Calculated for target impedance (typically 0.2mm for 90Ω on 4-layer).
   - **Spacing**: Calculated for differential impedance (typically 0.15mm).
   - **Gap**: Equal to spacing.

### Routing Rules

- **Route both traces together**: The differential pair router routes both traces simultaneously.
- **Maintain equal length**: Any length mismatch causes signal skew. Add serpentine curves to the shorter trace to match lengths.
- **Minimize vias**: Each via adds impedance discontinuity. If vias are necessary, place them symmetrically on both traces.
- **Don't split the pair around obstacles**: Route both traces on the same side of any obstacle. Splitting the pair destroys the differential coupling.
- **Keep away from other signals**: Maintain at least 3× the trace width as clearance from other nets.

## Auto-Router vs Manual Routing

### When to Use the Auto-Router

- Simple boards with mostly digital signals
- Quick prototyping where signal integrity isn't critical
- Initial routing pass to identify routing challenges

### When to Route Manually

- Power traces (auto-router doesn't prioritize width correctly)
- High-speed signals (USB, HDMI, Ethernet)
- Analog signals (sensitive to routing)
- RF signals (impedance-controlled)
- Dense BGA escape routing

### Hybrid Approach

1. Manually route all critical signals (power, differential pairs, analog).
2. Lock these traces: select → right-click → **Lock**.
3. Run the auto-router for remaining signals.
4. Review and adjust auto-routed traces as needed.

## Via Placement Guidelines

- **Minimum via spacing**: 0.5mm between via centers (check manufacturer's capabilities).
- **Don't place vias under components**: Vias under SMD pads can cause solder wicking through the via hole. Use tented vias (solder mask over via) or place vias outside component footprints.
- **Via stitching for ground**: Place ground vias every 10-20mm around the board perimeter and near signal vias.
- **Thermal vias**: For power components (regulators, MOSFETs), place 4-8 vias under the thermal pad to conduct heat to inner ground planes.

## Common Routing Mistakes

**90-degree trace corners**: Sharp 90° corners can cause acid traps in manufacturing and signal reflections at high frequencies. Use 45° corners or curved traces. Eagle's router defaults to 45° corners.

**Trace width changes mid-route**: Changing trace width creates impedance discontinuities. Keep trace width constant for the entire net (unless transitioning between net classes intentionally).

**Ground loops**: If the ground plane has cuts or gaps, return currents may form loops that pick up EMI. Keep the ground plane solid and uninterrupted.

**Decoupling capacitors too far from ICs**: A decoupling capacitor placed 20mm from the IC is ineffective at high frequencies. Place decoupling caps within 5mm of each IC's power pin, connected with short, wide traces.
