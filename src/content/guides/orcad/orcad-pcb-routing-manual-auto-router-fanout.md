---
title: "OrCAD PCB Routing: Manual vs Auto-Router Strategies for Complex Boards"
excerpt: "How to balance manual and automatic routing in OrCAD PCB Professional — covering routing priorities, fanout strategies, differential pair routing, and when to trust the auto-router."
category: "workflow"
softwareSlug: "orcad"
keyword: "orcad pcb routing manual auto-router fanout"
slug: "orcad-pcb-routing-manual-auto-router-fanout"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.orcad.com/support/routing"
  - "https://forum.orcad.com/forum/routing"
---

# OrCAD PCB Routing: Manual vs Auto-Router Strategies for Complex Boards

Routing a complex PCB is part art, part science. I've routed boards with 2,000+ nets in OrCAD and developed a workflow that combines manual control for critical signals with auto-routing for bulk connections. Here's the strategy.

## Routing Priority Order

Route in this order — never skip ahead:

1. **Component fanout** — Escape routing from BGA/QFN pads to vias
2. **Power and ground** — Wide traces, short paths
3. **Differential pairs** — USB, Ethernet, HDMI, PCIe
4. **Clock signals** — Impedance-controlled, minimal vias
5. **High-speed parallel buses** — DDR, SPI, parallel RGB
6. **Analog signals** — Sensitive to routing, keep short and direct
7. **General digital signals** — GPIO, I2C, UART
8. **Power supply routing** — Regulator input/output, bulk capacitors

## Step 1: Component Fanout

Fanout is the process of routing from component pads to nearby vias, making the signals accessible on other layers.

### BGA Fanout

1. Go to **Route** → **Fanout** → **BGA**.
2. Set parameters:
   - **Via**: Select the smallest via that meets your manufacturer's capabilities (0.2mm drill for 0.8mm pitch BGA)
   - **Via placement**: **Between pads** (for 0.8mm+ pitch) or **Dog-bone** (for < 0.8mm pitch)
   - **Trace width**: 0.1mm (4mil) for BGA escape
   - **Layer**: Route on Top layer to inner via, then distribute to other layers

3. OrCAD auto-fanouts the BGA:
   - Power and ground pins get vias first (directly under the pad if using via-in-pad)
   - Signal pins get escape traces to vias between pad rows
   - The fanout distributes signals across available layers

4. Review the fanout:
   - Check that power and ground vias connect to the correct planes
   - Check that no escape traces cross each other
   - Verify via spacing meets DRC

### QFN Fanout

1. Go to **Route** → **Fanout** → **QFN**.
2. QFN pads are on the perimeter — fanout is simpler:
   - Route each pad outward to a via
   - Set via distance: 0.5-1.0mm from the pad
   - Set trace width: 0.15mm (6mil) minimum

3. For the thermal pad (center pad):
   - Place 4-8 thermal vias directly in the pad
   - Connect to ground plane
   - Set via drill: 0.3mm, pad: 0.6mm

## Step 2: Manual Route Critical Signals

### Power Traces

1. Select the **Add Connect** tool.
2. Set the net class to **Power** (width: 0.5mm).
3. Route power traces manually:
   - Shortest path from regulator to load
   - Avoid vias where possible (vias add resistance and inductance)
   - If vias are necessary, use larger power vias (0.4mm drill)
   - Add decoupling capacitors in-line (regulator → cap → load)

### Differential Pairs

1. Select the **Differential Pair** routing mode.
2. Click on one net of the pair — both traces highlight.
3. Route both traces simultaneously:
   - The router maintains the specified spacing automatically
   - If you need to change layers, both vias are placed simultaneously
   - For pad entry, the router uses "neck" mode (reduced width for short distance)

4. Length matching:
   - After routing, check the length of each trace in the pair.
   - If lengths differ by more than 5mm (for USB) or 0.5mm (for DDR):
   - Add serpentine to the shorter trace: **Route** → **Delay Tune**.
   - Set the amplitude and wavelength to achieve the required length match.

### Clock Signals

1. Route clock signals manually on the top layer (closest to ground plane).
2. Minimize vias — each via adds jitter.
3. Keep the trace as short as possible.
4. Don't route near other high-speed signals (crosstalk risk).
5. Add a ground guard trace on both sides of the clock trace (3× width away).

## Step 3: Auto-Route General Signals

After critical signals are routed and locked:

1. **Lock** all manually routed traces: select → right-click → **Lock**.
2. Go to **Route** → **Auto-Route** → **All**.
3. Configure the auto-router:
   - **Routing layers**: Top and Bottom (for 2-layer) or Top, Bottom, Inner 3 (for 4-layer)
   - **Routing grid**: 0.1mm (4mil)
   - **Maximum passes**: 20 (more passes = better completion but slower)
   - **Fanout**: Skip (already done manually)

4. Click **Route**.
5. The auto-router routes all unlocked nets.
6. Review the results:
   - **Completion rate**: Should be 95%+. If lower, there may be a placement or density issue.
   - **Unrouted nets**: Manually route the remaining connections.
   - **Quality**: Check for unnecessary vias, long traces, or poor layer usage.

## Step 4: Optimize and Clean Up

After auto-routing:

1. **Remove unnecessary vias**: Some auto-routed traces use vias where a direct connection on one layer would work. Manually reroute these.
2. **Smooth traces**: The auto-router may create jagged traces. Use **Route** → **Smooth** to clean them up.
3. **Add ground copper pours**: Fill unused areas on all signal layers with ground polygons.
4. **Via stitching**: Place ground vias every 10-20mm to connect ground planes across layers.
5. **Run DRC**: Verify no design rule violations remain.

## When to Trust the Auto-Router

**Trust it for**:
- General digital signals (GPIO, I2C, UART, SPI)
- Low-speed parallel buses
- Connector pin routing

**Don't trust it for**:
- Power traces (wrong width, too many vias)
- Differential pairs (may not maintain spacing)
- Clock signals (may add unnecessary vias)
- Analog signals (may route through noisy areas)
- DDR memory (requires precise length matching)

## Common Routing Issues

**Auto-router leaves many unrouted nets**: The board may be too dense for the current layer count. Consider:
- Adding more layers (2→4)
- Repositioning components for better routing access
- Using smaller vias and finer trace widths

**Differential pair length mismatch**: After auto-routing, check pair lengths. Use **Delay Tune** to add serpentine to the shorter trace.

**Power trace voltage drop**: Long, thin power traces cause voltage drop. Calculate: V_drop = I × R, where R = ρ × L / (W × T). For a 0.5mm wide, 100mm long, 35µm thick copper trace carrying 2A: V_drop = 0.12V. If this is too much, widen the trace or use a power plane.
