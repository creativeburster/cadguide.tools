---
title: "Altium Designer High-Speed PCB Routing: Impedance Control and Length Matching"
excerpt: "Getting 50-ohm impedance and length matching right in Altium requires more than just setting a trace width. I cover the stackup calculator, impedance rules, and length tuning tools I use for DDR and PCIe designs."
category: "deployment"
softwareSlug: "altium-designer"
keyword: "Altium Designer high speed impedance control length matching"
slug: "altium-designer-high-speed-impedance-length-matching"
author: "PCB Design Engineer"
readTime: "11 min"
date: "2025-06-17"
sources:
  - "https://www.reddit.com/r/Altium/comments/1jlwc53/common_mistakes_in_pcb_footprint_design_and_how/"
  - "https://www.reddit.com/r/Altium/comments/1amw2d9/problem_with_updating_pcb/"
---

# Altium Designer High-Speed PCB Routing: Impedance Control and Length Matching

I design PCBs for embedded systems with DDR4 memory, PCIe Gen 3, and USB 3.2 — all of which require controlled impedance and length matching. When I first started doing high-speed design in Altium, I made every mistake in the book: I used the wrong stackup, calculated impedance by hand (and got it wrong), and tried to length-match by eyeballing trace lengths. After two board re-spins that cost my company over $15,000, I learned to do it properly. Here's the workflow I now use for every high-speed design.

## Step 1: Define Your Stackup

Controlled impedance starts with the PCB stackup. The trace width needed for 50-ohm impedance depends on the dielectric thickness, dielectric constant, and copper thickness — all of which are determined by the stackup.

### Using Altium's Layer Stack Manager

1. In the PCB editor, go to **Design → Layer Stack**
2. The Layer Stack Manager opens with a visual cross-section of your board
3. Define each layer:
   - **Material**: FR-4, Rogers RO4350B, Megtron 6, etc.
   - **Thickness**: Standard FR-4 core thicknesses are 0.1mm, 0.2mm, 0.36mm, 0.51mm, 0.76mm, 1.0mm, 1.52mm
   - **Dielectric constant (Dk)**: FR-4 is typically 4.2-4.5; check with your manufacturer for the specific material
   - **Copper weight**: 1oz (35μm) is standard; 0.5oz (18μm) for fine-pitch, 2oz (70μm) for power

### A Practical 4-Layer Stackup for 50-Ohm Routing

For most of my designs, I use this 4-layer stackup:

| Layer | Material | Thickness | Dk |
|-------|----------|-----------|-----|
| Top Copper | Copper | 0.018mm | - |
| Prepreg | FR-4 | 0.1mm | 4.3 |
| GND Plane | Copper | 0.018mm | - |
| Core | FR-4 | 0.71mm | 4.4 |
| Power Plane | Copper | 0.018mm | - |
| Prepreg | FR-4 | 0.1mm | 4.3 |
| Bottom Copper | Copper | 0.018mm | - |

With this stackup, a 0.18mm trace width on the top layer gives approximately 50-ohm single-ended impedance. But don't take my word for it — use the impedance calculator.

## Step 2: Calculate Impedance in Altium

Altium's Layer Stack Manager includes an impedance calculator.

1. In the Layer Stack Manager, click the **Impedance Calculation** button
2. Select the layer you're routing on (e.g., Top Layer)
3. Set the target impedance (e.g., 50 ohms for single-ended, 100 ohms for differential)
4. Altium calculates the required trace width

### For Differential Pairs

1. In the Impedance Calculator, select **Differential Pair** mode
2. Set the target impedance (typically 100 ohms for USB, 90 ohms for PCIe)
3. Altium calculates both the trace width and the gap between the two traces
4. Note both values — you'll need them for the routing rules

### Verifying with a Field Solver

Altium's built-in impedance calculator uses a 2D field solver, which is accurate for standard geometries. For unusual stackups (embedded microstrip, coplanar waveguide), I verify with a dedicated field solver like Saturn PCB Toolkit or Si9000.

## Step 3: Set Up Impedance Rules

Once you know the required trace width, create a width rule:

1. **Design → Rules → Routing → Width**
2. Create a new rule named "50OhmRouting"
3. Set the query to target specific nets: `InNetClass('HighSpeed')`
4. Set Min Width, Preferred Width, and Max Width all to the calculated value (e.g., 0.18mm)
5. This ensures that any trace in the HighSpeed class is automatically routed at the correct width

### For Differential Pairs

1. **Design → Rules → Routing → Differential Pairs Routing**
2. Create a new rule
3. Set the query: `InNetClass('DiffPairs')`
4. Set:
   - **Min Width**: calculated width
   - **Preferred Width**: calculated width
   - **Min Gap**: calculated gap
   - **Preferred Gap**: calculated gap

## Step 4: Create Net Classes

Organize your high-speed nets into classes for targeted rule application:

1. **Design → Classes → Add Class**
2. Create classes:
   - `DDR4_CLK` — differential clock pair
   - `DDR4_DATA` — data signals (need length matching within group)
   - `DDR4_ADDR` — address/command signals
   - `PCIe_TX` — PCIe transmit lanes
   - `PCIe_RX` — PCIe receive lanes
   - `USB3` — USB 3.2 signals
3. Assign nets to each class

## Step 5: Route with Differential Pair Support

Altium has dedicated differential pair routing:

1. Place the two traces of a differential pair close together
2. Use **Route → Differential Pair Routing**
3. Select both nets of the pair
4. Altium routes both traces simultaneously, maintaining the gap
5. Use **Shift+R** to cycle through conflict resolution modes
6. Use **Shift+G** to toggle the length gauge (shows real-time length of each trace)

### Keeping the Pair Together

- Avoid splitting the differential pair around obstacles — if you must, keep the split as short as possible
- Use vias in pairs (two vias side by side) when changing layers
- Maintain the gap consistently — even small variations affect impedance

## Step 6: Length Tuning

For DDR4 and PCIe, signals within a group must be length-matched within a tight tolerance. Altium's length tuning tool makes this manageable.

### Single-Ended Length Matching

1. **Route → Length Tuning**
2. Select the trace to tune
3. Choose the tuning pattern: **Accordion**, **Trombone**, or **Sawtooth**
4. Set the target length:
   - For DDR4 data lines: match to the longest trace in the group within ±25mil (0.635mm)
   - For PCIe lanes: match within ±5mil (0.127mm)
5. Altium adds serpentine patterns to match the length
6. Use the **Tab** key to adjust amplitude and spacing of the serpentine

### Differential Pair Skew Matching

1. **Route → Length Tuning → Differential Pair Skew**
2. Select the differential pair
3. Set the target skew (typically < 5mil for PCIe)
4. Altium adds a small serpentine to the shorter trace

### Group Length Matching

For DDR4, all 8 data lines in a byte lane must be within ±25mil of each other:

1. Route all 8 traces
2. Identify the longest trace
3. Use Length Tuning on each shorter trace to match the longest
4. Use the **PCB** panel in **Length** mode to monitor all trace lengths in real-time
5. The panel shows each trace's length and the delta from the target

## Step 7: Set Up Return Paths

High-speed signals need a solid reference plane for return current. Discontinuities in the reference plane cause signal integrity problems.

### Checking Return Paths

1. Go to **Tools → Return Path Check**
2. Altium checks that each high-speed net has a continuous reference plane
3. Violations are highlighted where the return path is broken (e.g., by a split in the ground plane)

### Fixing Return Path Issues

- Don't split ground planes under high-speed signals
- If a signal crosses a plane split, add a stitching capacitor (0.1μF) across the split to provide an AC return path
- Use stitching vias near signal vias to provide a short return path when changing layers

## Step 8: Post-Route Verification

After routing, verify signal integrity:

### Length Matching Report

1. **Reports → Length**
2. Select the net class to report
3. The report shows each trace's length, delta from target, and pass/fail status

### Impedance Verification

1. Use Altium's Signal Integrity Analysis: **Tools → Signal Integrity**
2. Set up the IBIS models for your drivers and receivers
3. Run the analysis to check for reflections, crosstalk, and ringing
4. This won't replace a full SI simulation, but it catches gross errors

## Common Mistakes

### Using Wrong Dk Value
FR-4 Dk varies by manufacturer and frequency. At 1GHz, FR-4 Dk is typically 4.2-4.4. At 10GHz, it drops to 3.8-4.0. Always use the Dk value for your operating frequency.

### Ignoring Copper Roughness
Copper surface roughness (Ra) affects high-frequency impedance. For signals above 5GHz, use the Ra value from your manufacturer's data sheet in the impedance calculation.

### Not Accounting for Etch Factor
During etching, traces become trapezoidal — the top is narrower than the bottom. This affects impedance. For traces wider than 0.15mm, the effect is small. For narrow traces, use the average of top and bottom widths.

### Length Matching Without Considering Via Length
Vias add length to a trace. A via through a 1.6mm board adds 1.6mm of length. When length matching, include via length in the total trace length. Altium's PCB panel in Length mode includes via length by default.

## Summary

High-speed PCB routing in Altium requires a systematic approach: define the stackup, calculate impedance, set up rules, route with dedicated tools, length-tune, and verify. The Layer Stack Manager's impedance calculator gives you the right trace width, the differential pair routing tools maintain the right gap, and the length tuning tools match trace lengths within tolerance. Don't skip the post-route verification — a length mismatch of 10mil can cause DDR4 training failure, and you won't know until you power up the board.
