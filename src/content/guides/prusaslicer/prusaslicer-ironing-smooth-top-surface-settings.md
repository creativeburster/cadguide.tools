---
title: "PrusaSlicer Ironing: Smooth Top Surfaces with Settings Tuning and Material Selection"
excerpt: "Ironing in PrusaSlicer smooths flat top surfaces by running the nozzle over them at reduced flow rate after the final layer. I cover the three ironing modes, flow rate and speed tuning, material compatibility, and the common issues like scarring and poor adhesion that plague ironed surfaces."
category: "workflow"
softwareSlug: "prusaslicer"
keyword: "PrusaSlicer ironing smooth top surface settings flow rate"
slug: "prusaslicer-ironing-smooth-top-surface-settings"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-06-22"
sources:
  - "https://blog.prusa3d.com/make-top-surfaces-super-smooth-ironing-prusaslicer-2-3-beta_41506/"
  - "https://help.prusa3d.com/article/ironing_177488"
  - "https://forum.prusa3d.com/forum/prusaslicer/okay-any-examples-of-ironing-improving-prints/"
  - "https://www.reddit.com/r/prusa3d/comments/wu906f/issues_with_using_prusa_slicer_ironing_setting/"
---

# PrusaSlicer Ironing: Smooth Top Surfaces with Settings Tuning and Material Selection

I print a lot of functional parts that need smooth flat top surfaces — enclosure panels, jigs, brackets, and nameplates. PrusaSlicer's ironing feature, introduced in version 2.3, is the most effective way to achieve a near-injection-molded finish on flat top layers. But ironing is finicky — the wrong flow rate, speed, or material choice can leave you with scarring, poor adhesion, or a surface that looks worse than no ironing at all.

## What Is Ironing?

Prusa's official blog describes ironing as a process that "smooths flat top surfaces by running a special second infill phase at the same height as the top layer, during which a small amount of material is extruded."

When ironing is enabled, after the printer completes the top layer, the nozzle makes a second pass over the flat areas at a reduced flow rate and slower speed. The hot nozzle remelts the top layer slightly and pushes the extruded material into the gaps between toolpath lines, creating a smooth surface.

The result is a top surface that looks significantly smoother than a standard top layer — the visible toolpath lines are greatly reduced or eliminated entirely.

## Enabling Ironing

In PrusaSlicer, ironing is found under **Print Settings → Layers and perimeters → Ironing**:

1. Check **Enable ironing**
2. Choose an ironing mode (see below)
3. Configure flow rate, speed, and spacing

## Ironing Modes

PrusaSlicer offers three ironing modes:

### All Top Surfaces

Ironing is applied to every flat top surface on the model. This is the most aggressive option and works well for simple parts with large flat tops. However, it can be slow for complex models with many small top surfaces.

### Top Surfaces Only

Ironing is applied only to the highest top surface on the model. Lower top surfaces (like internal shelves or stepped features) are not ironed. This is my default choice for most prints — it gives the best visual result on the most visible surface without wasting time on hidden areas.

### No Ironing

Ironing is disabled. This is the default state.

## Key Settings

### Ironing Flow Rate

This is the most critical setting. It controls how much material is extruded during the ironing pass, expressed as a percentage of normal extrusion. Default is **10%**.

- **Too low (< 5%)**: The nozzle doesn't deposit enough material to fill the gaps. The surface may look burnished but not truly smooth.
- **Too high (> 20%)**: Excess material builds up on the surface, creating ridges and blobs. The surface can look worse than no ironing.
- **Optimal range**: 10-15% for most PLA, 8-12% for PETG, 5-10% for ABS/ASA

A Prusa forum user reports: "Flow rate 40%, ironing speed 50mm/sec, top layers increased to 8." This is an aggressive setting that works for some filaments but will cause issues with others. I recommend starting at 10% and adjusting in 2% increments.

### Ironing Speed

How fast the nozzle moves during the ironing pass. Default is **20 mm/s** (which is 50% of the default print speed).

- **Too fast (> 30 mm/s)**: The nozzle doesn't have enough time to remelt and smooth the surface. Results are marginal.
- **Too slow (< 10 mm/s)**: The nozzle dwells too long, causing heat buildup that can warp the surface or cause PETG to stick to the nozzle.
- **Optimal range**: 15-25 mm/s for most materials

### Ironing Spacing

The distance between ironing toolpath lines. Default is **0.1 mm**. This should be roughly half of your line width — for a 0.4 mm nozzle producing 0.45 mm lines, 0.1 mm spacing works well. Reducing spacing creates a denser ironing pattern but takes longer.

### Ironing Pattern

PrusaSlicer offers two patterns:
- **Rectilinear**: Standard back-and-forth pattern. Works well for most cases.
- **Concentric**: Follows the perimeter inward. Better for circular or organic shapes.

## Material Compatibility

Ironing works differently across filament types:

### PLA
Ironing works excellently with PLA. The material remelts easily at typical print temperatures (210-220°C) and doesn't stick to the nozzle. Most of my ironed prints are PLA.

### PETG
PETG is more challenging. It has a sticky melt that can adhere to the nozzle during ironing, leaving deposits on the surface. I reduce flow rate to 8% and speed to 15 mm/s for PETG. Some users report better results with no ironing and instead using a very slow outer perimeter speed.

### ABS/ASA
Ironing can work with ABS and ASA but requires careful temperature management. The ironing pass can cause warping if the part cools too quickly. I use 5-10% flow rate and ensure the enclosure is at temperature. Results are generally good but not as smooth as PLA.

### TPU (Flexible)
Ironing is not recommended for TPU. The flexible material deforms under the nozzle pressure, and the slow ironing speed can cause the filament to jam in the extruder.

### Specialty Filaments (Silk, Matte, Wood-fill)
Silk PLA irons beautifully — the smooth surface enhances the silk effect. Matte PLA also works well. Wood-fill can be ironed but requires higher flow rate (15-20%) because the material compresses rather than remelts.

## Common Issues

### Scarring on Ironed Surface

This is the most common complaint. The nozzle drags across the surface and leaves visible marks.

**Causes and fixes**:
- **Z-offset too low**: The nozzle is pressing too hard against the surface. Raise the Z-offset by 0.05 mm.
- **Ironing height too low**: PrusaSlicer ironing occurs at the same Z height as the top layer. If your Z-axis isn't perfectly accurate, the nozzle can drag. Ensure Z-axis calibration is correct.
- **Wrong top layer infill pattern**: A Prusa forum user discovered: "Wrong Top Layer infill" was causing their ironing issues. Use **Monotonic** infill for the top layer — it produces the most uniform surface for ironing.

### Poor Adhesion Between Ironed Layers

If you're printing an object where another part sits on top of the ironed surface, the smooth finish can reduce layer adhesion. Ironing is best for the final top layer only — don't iron internal layers.

### Inconsistent Results Across the Surface

If some areas are smooth and others are rough, the likely cause is uneven bed leveling or first layer height. Ironing amplifies any Z-axis inconsistencies. Ensure your first layer is perfectly calibrated before relying on ironing.

### PETG Sticking to Nozzle

For PETG, reduce ironing flow rate to 8% and speed to 15 mm/s. Apply a thin coat of glue stick to the nozzle tip before printing (it burns off but helps prevent sticking). Some users report that switching to a plated copper or high-temp nozzle reduces PETG adhesion.

## My Recommended Starting Point

For PLA with a 0.4 mm nozzle at 0.2 mm layer height:
- **Ironing mode**: Top surfaces only
- **Flow rate**: 10%
- **Speed**: 20 mm/s
- **Spacing**: 0.1 mm
- **Pattern**: Rectilinear
- **Top layer infill**: Monotonic
- **Top solid layers**: At least 5 (fewer top layers can cause scarring because the ironing pass has less material to work with)

A Reddit user notes: "I've not gotten good ironing out of PrusaSlicer." This is a common sentiment, but in my experience, it almost always comes down to flow rate being too high or the top layer count being too low. Start with the settings above and adjust incrementally.

## Summary

Ironing in PrusaSlicer produces excellent results on flat top surfaces when configured correctly. The key settings are flow rate (start at 10% for PLA), speed (20 mm/s), and ensuring you have enough top solid layers (minimum 5). Material selection matters — PLA is the most forgiving, PETG requires lower flow rates and careful nozzle management, and TPU should be avoided entirely. Use Monotonic top layer infill for the best ironing results, and always calibrate your Z-axis before relying on ironing for visible surfaces.
