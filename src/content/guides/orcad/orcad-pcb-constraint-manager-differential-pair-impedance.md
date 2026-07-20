---
title: "OrCAD PCB Professional: Constraint Manager Setup for Differential Pairs and Impedance"
excerpt: "How to configure OrCAD's Constraint Manager for controlled impedance routing — covering layer stackup definition, differential pair setup, net class creation, and spacing rules."
category: "standards"
softwareSlug: "orcad"
keyword: "orcad pcb constraint manager differential pair impedance"
slug: "orcad-pcb-constraint-manager-differential-pair-impedance"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://resources.pcb.cadence.com/blog/2025-how-to-add-differential-pair-in-orcad-x-schematic"
  - "https://www.parallel-systems.co.uk/wp-content/uploads/2020/02/diffpair_definition.pdf"
---

# OrCAD PCB Professional: Constraint Manager Setup for Differential Pairs and Impedance

OrCAD's Constraint Manager is where you define electrical and physical rules that drive routing. Instead of hoping the designer routes differential pairs correctly, you set up constraints that enforce correct widths, spacings, and layer assignments. We set up Constraint Manager for every board we design. Here's the complete configuration.

## Opening Constraint Manager

1. In OrCAD PCB Professional: **Setup** → **Constraints** → **Constraint Manager**.
2. The Constraint Manager opens in a spreadsheet-like interface.
3. It has two main sections:
   - **Electrical Constraints**: Impedance, differential pairs, timing, crosstalk
   - **Physical Constraints**: Trace width, spacing, via definitions, layer stackup

## Step 1: Define the Layer Stackup

Before setting impedance constraints, define the board stackup:

1. In Constraint Manager: **Physical** → **Layer Stackup**.
2. Define each layer:

| Layer | Type | Material | Thickness | Dielectric |
|-------|------|----------|-----------|------------|
| Top | Conductor | Copper | 0.035mm | — |
| Dielectric 1 | Dielectric | FR-4 | 0.2mm | 4.2 |
| Inner 1 (GND) | Conductor | Copper | 0.035mm | — |
| Dielectric 2 | Dielectric | FR-4 | 0.7mm | 4.2 |
| Inner 2 (PWR) | Conductor | Copper | 0.035mm | — |
| Dielectric 3 | Dielectric | FR-4 | 0.2mm | 4.2 |
| Bottom | Conductor | Copper | 0.035mm | — |

3. The stackup determines the impedance of traces on each layer.
4. For controlled impedance, the dielectric thickness between the signal layer and the reference ground plane is the most critical parameter.

## Step 2: Set Impedance Constraints

1. In Constraint Manager: **Electrical** → **Net** → **Impedance**.
2. Create an impedance rule set:
   - **Single-ended 50Ω**: For clock signals, RF traces, high-speed single-ended
   - **Differential 90Ω**: For USB 2.0
   - **Differential 100Ω**: For Ethernet, PCIe, LVDS
   - **Differential 120Ω**: For CAN bus, RS-485

3. For each impedance target, the Constraint Manager calculates the required trace width based on the stackup:
   - 50Ω on Top (0.2mm dielectric to Inner 1): ~0.4mm trace width
   - 50Ω on Inner 2 (0.7mm dielectric to Inner 1): ~0.15mm trace width
   - 100Ω differential on Top: ~0.18mm width, ~0.15mm spacing

4. Assign nets to impedance rules:
   - Select the nets in the spreadsheet.
   - Set the impedance column to the appropriate rule.

## Step 3: Create Differential Pairs

1. In Constraint Manager: **Electrical** → **Net** → **Differential Pair**.
2. Click **Create** → **Auto Match**.
3. Constraint Manager automatically pairs nets with `_N`/`_P` or `+`/`-` suffixes.
4. For manual pairing:
   - Select two nets.
   - Right-click → **Create Differential Pair**.
5. Set differential pair parameters:
   - **Coupling type**: Tight (traces run side by side) or Loose (traces separated by >3× width)
   - **Uncoupled length**: Maximum length allowed to be uncoupled (e.g., 5mm for vias and pad escapes)
   - **Min spacing**: Calculated from the differential impedance target

6. The differential pair now has:
   - **Width**: Calculated for target differential impedance
   - **Spacing**: Calculated for target differential impedance
   - **Neck width**: Reduced width for pad entry (short distance allowed)

## Step 4: Create Net Classes

1. In Constraint Manager: **Physical** → **Net** → **Physical Line Width**.
2. Create net classes:

| Class | Min Width | Max Width | Neck Width | Use Case |
|-------|-----------|-----------|------------|----------|
| Power | 0.5mm | 2.0mm | 0.3mm | Power traces |
| High Current | 0.8mm | 3.0mm | 0.5mm | >500mA traces |
| Signal | 0.15mm | 0.3mm | 0.1mm | Digital signals |
| Clock | 0.2mm | 0.3mm | 0.15mm | Clock signals (impedance-controlled) |
| Analog | 0.2mm | 0.4mm | 0.15mm | Analog signals |

3. Assign nets to classes:
   - Select nets in the spreadsheet.
   - Set the physical constraint set column.

## Step 5: Set Spacing Constraints

1. In Constraint Manager: **Physical** → **Spacing**.
2. Create spacing rule sets:

### Default Spacing

| Object | Line | Pad | Via | Shape |
|--------|------|-----|-----|-------|
| Line | 0.15mm | 0.15mm | 0.15mm | 0.15mm |
| Pad | 0.15mm | 0.15mm | 0.15mm | 0.15mm |
| Via | 0.15mm | 0.15mm | 0.15mm | 0.15mm |
| Shape | 0.15mm | 0.15mm | 0.15mm | 0.15mm |

### Power Spacing (wider clearance)

| Object | Line | Pad | Via | Shape |
|--------|------|-----|-----|-------|
| Line | 0.3mm | 0.3mm | 0.3mm | 0.3mm |

### Differential Pair Spacing

| Object | Line | Pad | Via |
|--------|------|-----|-----|
| Diff pair to other | 0.3mm | 0.3mm | 0.3mm |

3. Assign spacing rules to net classes.

## Step 6: Set Via Definitions

1. In Constraint Manager: **Physical** → **Vias**.
2. Define via types:

| Via Name | Drill | Pad | Layers | Use Case |
|----------|-------|-----|--------|----------|
| VIA-0.3 | 0.3mm | 0.6mm | All | Standard signal via |
| VIA-0.4 | 0.4mm | 0.8mm | All | Power via |
| VIA-0.2-BLIND | 0.2mm | 0.45mm | Top-Inner1 | Blind via for BGA |

3. Assign via types to net classes:
   - Power nets: VIA-0.4
   - Signal nets: VIA-0.3
   - Dense routing: VIA-0.2-BLIND

## Step 7: Verify Constraints During Routing

As you route traces in OrCAD PCB Professional, the tool continuously checks constraints:

- **Width violations**: Highlighted in real-time if a trace is too narrow.
- **Spacing violations**: Highlighted if a trace is too close to another object.
- **Differential pair violations**: Highlighted if the pair spacing or width is wrong.
- **Impedance violations**: The real-time impedance monitor shows the current impedance as you route.

This real-time feedback prevents constraint violations before they happen — you don't need to wait for a DRC run to discover problems.

## Common Constraint Manager Issues

**Impedance doesn't match target**: The stackup dielectric thickness or dielectric constant is wrong. Verify with your PCB manufacturer's stackup sheet — they provide the actual thickness and Er values.

**Differential pair spacing won't calculate**: Ensure both nets in the pair are on the same layer and the stackup is defined. The calculation requires knowing the distance to the reference plane.

**Constraints not enforced during routing**: Ensure the constraint set is assigned to the nets. In the spreadsheet, check that the constraint name appears in the appropriate column for each net.
