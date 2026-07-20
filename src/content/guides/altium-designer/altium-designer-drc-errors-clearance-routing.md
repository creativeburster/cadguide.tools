---
title: "Fixing Altium Designer DRC Errors: Common Clearance and Routing Violations"
excerpt: "Green error markers all over your PCB layout? We cover the most common Altium DRC errors we encounter in production boards, from clearance violations to unrouted nets, and how to fix each one."
category: "troubleshooting"
softwareSlug: "altium-designer"
keyword: "Altium Designer DRC errors clearance violation"
slug: "altium-designer-drc-errors-clearance-routing"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-06-15"
sources:
  - "https://www.reddit.com/r/Altium/comments/1hfjumq/i_am_having_a_problem_with_my_pcb_design/"
  - "https://www.reddit.com/r/ElectricalEngineering/comments/12i9sd4/help_with_altium_pcb_design/"
  - "https://www.reddit.com/r/Altium/comments/1jlwc53/common_mistakes_in_pcb_footprint_design_and_how/"
---

# Fixing Altium Designer DRC Errors: Common Clearance and Routing Violations

A user on r/ElectricalEngineering posted what we consider the quintessential Altium beginner question: they'd created a schematic and PCB library for a simple 8-DIP IC, but when they tried to create PCB traces, they got green symbols all over the place. Those green symbols are Altium's Design Rule Check (DRC) violation markers, and they're both the most helpful and most frustrating feature in Altium Designer. From 2-layer hobby boards to 12-layer high-speed digital boards, DRC errors trip up even experienced designers. Here's a systematic guide to the most common DRC violations and how to fix them.

## Understanding the Green Markers

The green overlay on components, pads, and traces indicates a DRC violation. Altium runs DRC checks in real-time as you route, so you see violations immediately. The specific rule being violated is shown in the **Messages** panel (**View → Panels → Messages**).

If you don't see the Messages panel, enable it now. It's essential for debugging DRC errors.

## Violation 1: Clearance Constraint

This is the most common DRC error, especially for beginners. It means two objects (pads, traces, vias, copper pours) are closer together than the minimum clearance specified in the design rules.

### Diagnosing the Violation

1. Look at the **Messages** panel for the specific message:
   - `Clearance Constraint: ... between Pad ... and Track ...`
2. Note which two objects are violating the clearance
3. The minimum clearance is shown in the message (e.g., `Gap: 5mil, Restriction: 10mil`)

### Common Causes and Fixes

**Cause**: Default clearance rule is too large for your design
- **Fix**: Go to **Design → Rules → Electrical → Clearance**
- The default clearance is typically 10mil (0.254mm). For dense designs, you may need 6mil or 4mil
- Check with your PCB manufacturer for their minimum clearance capability
- Create separate clearance rules for specific nets (e.g., 20mil for high-voltage nets, 6mil for signal nets)

**Cause**: Pad size too large for the spacing
- **Fix**: Reduce the pad size in the footprint library
- For a DIP-8 IC, the standard pad size is 1.778mm x 0.635mm with 2.54mm pitch
- If you've made the pads too large (a common mistake), they'll overlap with adjacent pads

**Cause**: Trace routing too close to pads
- **Fix**: Route with a larger clearance, or use the **Shift+R** shortcut to cycle through routing conflict resolution modes:
  - **Stop at first obstacle** (default)
  - **Walkaround obstacles**
  - **Push and shove obstacles**
  - **Ignore obstacles** (use with caution)

## Violation 2: Unrouted Net

This means a net in your schematic has no copper connection on the PCB. The airwire (thin blue line) shows where the connection should be.

### Common Causes and Fixes

**Cause**: Component not connected in the schematic
- **Fix**: Check the schematic — ensure all wires are actually connected to component pins
- In Altium, a wire that looks connected but isn't is a common issue. Zoom in to verify connections

**Cause**: Footprint pads not assigned to the correct net
- **Fix**: Double-click the pad in the PCB view → check the **Net** property
- If the net is set to "No Net", the pad won't connect to anything
- This happens when you place a component but don't update the PCB from the schematic

**Cause**: Copper pour not connected to a net
- **Fix**: Double-click the copper pour → set the **Net** property to GND (or whatever net it should be)
- Repour the pour: **Tools → Pour Manager → Repour All**

## Violation 3: Short-Circuit Constraint

This means two different nets are electrically connected (shorted) on the PCB.

### Common Causes and Fixes

**Cause**: Copper pour bridging two nets
- **Fix**: Check the copper pour settings — ensure the pour is only connected to one net
- If the pour is covering pads of different nets without proper clearance, adjust the pour clearance rule

**Cause**: Trace crossing another trace
- **Fix**: Reroute one of the traces to avoid the crossing
- Use vias to move to a different layer if needed

**Cause**: Pad overlap
- **Fix**: Check if two components have overlapping pads
- This can happen when components are placed too close together

## Violation 4: Width Constraint

This means a trace is narrower than the minimum width specified in the design rules.

### Common Causes and Fixes

**Cause**: Default width rule too large
- **Fix**: Go to **Design → Rules → Routing → Width**
- Set the minimum width to match your manufacturer's capability (typically 6mil for standard PCBs)
- Create specific width rules for power nets (e.g., 20mil for VCC, 30mil for GND)

**Cause**: Auto-router using wrong width
- **Fix**: If using the auto-router, check the routing rules in the auto-router configuration
- Specify width rules per net class

## Violation 5: Hole Size Constraint

This means a via or pad has a hole diameter smaller or larger than the design rules allow.

### Common Causes and Fixes

**Cause**: Default hole size constraint too restrictive
- **Fix**: Go to **Design → Rules → Manufacturing → Hole Size**
- Set the minimum hole size to match your manufacturer's capability (typically 0.2mm for standard PCBs)
- Set the maximum hole size to your largest component lead diameter + 0.2mm

## Violation 6: Silk to Solder Mask Clearance

This means silkscreen text or lines are too close to pads (solder mask openings).

### Common Causes and Fixes

**Cause**: Designator text overlapping pads
- **Fix**: Move the designator text away from pads
- Go to **Design → Rules → Manufacturing → Silk to Solder Mask Clearance**
- Set minimum clearance to 4mil (0.1mm)
- Or disable this rule if your manufacturer doesn't require it

## Best Practices for DRC Management

### Create a Rules Template

Don't start from scratch with every project. Create a rules template that matches your manufacturer's capabilities:

1. Set up all design rules in a reference project
2. **Design → Rules → File → Save Rules As Template**
3. In new projects: **Design → Rules → File → Load Rules from Template**

### Use Net Classes for Targeted Rules

Instead of one set of rules for everything, create net classes:

1. **Design → Classes → Add Class**
2. Create classes like "HighSpeed", "Power", "Clock", "Analog"
3. Assign nets to classes
4. Create rules that apply to specific classes (e.g., 50ohm impedance for HighSpeed, 20mil width for Power)

### Run Batch DRC Before Finalizing

Real-time DRC catches most errors, but some only show up in a full batch DRC:

1. **Tools → Design Rule Check**
2. Check **Run Online DRC** (should be on for real-time checking)
3. Click **Run Design Rule Check** for a full batch check
4. Review the generated DRC report
5. Fix all errors before generating Gerber files

### Use the PCB Inspector

The PCB Inspector (**Tools → PCB Inspector** or **F11**) lets you view and edit properties of selected objects:

1. Select a violating pad or trace
2. Open the PCB Inspector
3. Check the net, width, clearance, and other properties
4. Edit properties directly in the inspector to fix violations

## Common Footprint Mistakes

A Reddit user in r/Altium highlighted common footprint mistakes that cause DRC errors:

- **Pad size mismatch**: Using a generic footprint with pads that don't match the actual component
- **Wrong pad shape**: Using round pads for square-pin components
- **Courtyard overlap**: The component courtyard (the area reserved for the component) overlaps with adjacent components
- **Silkscreen on pads**: Silkscreen text that covers solder pads, which interferes with soldering

Always verify footprints against the manufacturer's datasheet before using them. Measure the pad spacing with calipers if possible.

## Summary

DRC errors are Altium's way of telling you that your design won't manufacture correctly. Don't ignore them — every green marker represents a potential manufacturing failure. The most common violations are clearance constraints (fix by adjusting rules or pad sizes), unrouted nets (fix by checking schematic connections), and short circuits (fix by rerouting or adjusting copper pours). Create a rules template, use net classes for targeted rules, and always run a batch DRC before generating manufacturing files.
