---
title: "Altium Designer Copper Pour Best Practices: Avoiding Disconnected Islands and Thermal Relief Issues"
excerpt: "Copper pours look simple but cause subtle manufacturing and signal integrity problems. I cover the pour settings, clearance rules, and verification steps I use to avoid disconnected islands, thermal relief failures, and plane noise."
category: "deployment"
softwareSlug: "altium-designer"
keyword: "Altium Designer copper pour best practices thermal relief"
slug: "altium-designer-copper-pour-best-practices"
author: "PCB Design Engineer"
readTime: "8 min"
date: "2025-06-18"
sources:
  - "https://www.reddit.com/r/Altium/comments/1amw2d9/problem_with_updating_pcb/"
  - "https://www.reddit.com/r/Altium/comments/1hfjumq/i_am_having_a_problem_with_my_pcb_design/"
---

# Altium Designer Copper Pour Best Practices: Avoiding Disconnected Islands and Thermal Relief Issues

A Reddit user in r/Altium reported problems with updating their PCB — a common complaint that often traces back to copper pour issues. Copper pours are one of Altium's most useful features for EMI reduction and thermal management, but they're also the source of many subtle problems that don't show up until the board is manufactured. I've dealt with disconnected copper islands that caused antenna effects, thermal relief connections that failed during reflow, and plane splits that created signal integrity nightmares. Here's how to use copper pours correctly and avoid the problems I've encountered.

## When to Use Copper Pours

Copper pours serve three main purposes:

1. **Ground plane extension**: Filling unused areas with GND-connected copper reduces EMI and provides a low-impedance return path
2. **Thermal management**: Large copper areas dissipate heat from power components
3. **EMI shielding**: Pours on outer layers can shield sensitive analog signals from digital noise

Don't pour copper just because it looks good. Every pour needs to be connected to a net (usually GND), and unconnected copper causes more problems than it solves.

## Setting Up a Copper Pour

1. **Place → Copper Pour** (or use the shortcut: **P+G**)
2. Draw the outline of the pour area
3. When you finish the outline, the **Properties** panel appears
4. Set the following properties:

### Essential Settings

- **Net**: Always assign a net (typically GND). Never leave it as "No Net"
- **Layer**: Select the appropriate layer (Top, Bottom, or internal plane)
- **Pour Over**: Choose "Same Net" for GND pour over GND traces, or "All Same Net Objects" for more complete pouring

### Advanced Settings

- **Remove Dead Copper**: **Always enable this** — it removes isolated copper islands that have no connection to the net
- **Pour Style**: 
  - **Solid**: Creates a solid copper area (best for ground planes and thermal management)
  - **Hatched**: Creates a hatched pattern (useful for flex PCBs or when you need reduced copper adhesion)
- **Backoff**: The distance the pour maintains from objects on other nets (controlled by clearance rules)

## Clearance Rules for Copper Pours

Copper pours follow the same clearance rules as other objects, but you may want specific rules for pour-to-pad clearance:

1. **Design → Rules → Electrical → Clearance**
2. Create a rule for pour-to-pad clearance:
   - Query: `InPolygon and OnLayer('Top Layer') and InNet('GND')` for the first object
   - Query: `IsPad` for the second object
   - Set clearance to 0.2mm (8mil) for standard designs, 0.15mm (6mil) for dense designs

### Separate Rules for Power Pads

For power pads that should connect directly to the pour (not through thermal reliefs):

1. Create a clearance rule with query: `InPolygon and IsPad and InNet('GND')`
2. Set clearance to 0 (direct connection)
3. This overrides the thermal relief setting for GND pads

## Thermal Relief Settings

Thermal reliefs are the spoke-style connections between a pad and a copper pour. They make soldering easier by reducing heat transfer from the pad to the pour, but they also increase electrical resistance.

### Configuring Thermal Reliefs

1. In the copper pour Properties, click **Thermals**
2. **Connect Style**: 
   - **Spoke Connect**: Creates 2 or 4 spoke connections (best for soldering)
   - **Direct Connect**: Solid copper connection (best for high-current and thermal pads)
   - **No Connect**: Pad is isolated from the pour (use for non-GND pads in a GND pour)
3. **Spoke Width**: Typically 0.3-0.5mm. Too narrow = high resistance; too wide = hard to solder
4. **Air Gap**: The gap between spokes, typically 0.3mm. Too small = soldering difficulty; too large = weak connection
5. **Number of Spokes**: 2 for small pads, 4 for larger pads

### When to Use Direct Connect

Use direct connect (no thermal relief) for:
- High-current power pads (regulators, connectors)
- Thermal pads (QFN, DFN thermal pads)
- Via connections (vias don't need thermal reliefs)

Use thermal relief for:
- Standard GND pads on through-hole components
- Any pad that will be hand-soldered

## Common Copper Pour Problems

### Problem: Disconnected Copper Islands

**Symptom**: Small areas of copper appear in the pour but aren't connected to the main pour area. These act as antennas and can cause EMI issues.

**Fix**:
1. Enable **Remove Dead Copper** in the pour properties
2. After pouring, run **Tools → Design Rule Check → Manufacturing → Net Antennae**
3. Any remaining islands will be flagged
4. Manually delete small islands that the automatic removal missed

### Problem: Pour Not Connecting to Pads

**Symptom**: GND pads inside the pour area show no connection (airwire) to the pour.

**Fix**:
1. Check that the pour's net matches the pad's net (both should be GND)
2. Check the clearance rules — if the clearance is larger than the pad-to-pad spacing, the pour can't reach the pad
3. Check the thermal relief settings — if "No Connect" is selected, the pad won't connect
4. Repour: **Tools → Pour Manager → Repour All**

### Problem: Pour Takes Too Long to Repour

**Symptom**: Every small change triggers a 30-second repour, making the design process slow.

**Fix**:
1. **Tools → Pour Manager → Repour** and uncheck "Auto Repour"
2. Make your changes, then manually repour when ready
3. Or use **Pour Manager → Flash Repour** for faster (but less complete) repouring
4. For large boards, consider using plane layers instead of pours for GND

### Problem: Thin Slivers of Copper

**Symptom**: Very thin copper slivers appear between closely-spaced pads.

**Fix**:
1. Increase the pour's backoff from pads
2. Use the **Shrink** setting in the pour properties to pull the pour back from edges
3. Run DRC to identify slivers: **Manufacturing → Min Width** rule

### Problem: Thermal Relief Connection Fails in Manufacturing

**Symptom**: During reflow soldering, GND pads don't heat up enough, resulting in cold solder joints.

**Fix**:
1. Increase the spoke width to 0.5mm or more
2. Reduce the number of spokes to 2 (less heat sinking)
3. Or switch to direct connect for problematic pads
4. Work with your assembly house — they may need a modified reflow profile for heavy copper pours

## Pour Verification Checklist

Before finalizing your design:

- [ ] All pours are assigned to a net (no "No Net" pours)
- [ ] Remove Dead Copper is enabled
- [ ] Thermal relief settings are appropriate for each pad type
- [ ] Clearance rules allow the pour to reach all GND pads
- [ ] No disconnected copper islands (run Net Antennae DRC)
- [ ] No thin copper slivers (run Min Width DRC)
- [ ] Pour connects to all intended pads (check with **3D View** or **Show Net**)
- [ ] Plane splits don't cross high-speed signals (check return paths)

## Best Practices for Multi-Layer Boards

For 4+ layer boards, use dedicated plane layers for GND and power instead of pours:

- **Layer 1 (Top)**: Signal routing + component pads
- **Layer 2**: Solid GND plane (no splits, no pours — just solid copper)
- **Layer 3**: Power plane (can be split for multiple voltage rails)
- **Layer 4 (Bottom)**: Signal routing + component pads

Solid planes provide better signal integrity and EMI performance than poured copper. Use pours on the top and bottom layers only for filling unused space around components.

If you must split a plane (e.g., for analog and digital ground), keep the split away from signal traces. If a signal must cross the split, add a stitching capacitor (0.1μF) across the split at the crossing point.

## Summary

Copper pours are powerful but require careful configuration. The three most important settings are: always assign a net, always enable Remove Dead Copper, and always configure thermal reliefs appropriately. Run DRC after pouring to catch disconnected islands, thin slivers, and unconnected pads. And for multi-layer boards, prefer solid plane layers over poured copper for ground and power distribution.
