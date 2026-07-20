---
title: "Simplify3D Custom Printer Profiles and FFF Settings Tuning Guide"
excerpt: "Simplify3D's FFF Settings window gives access to over 100 process parameters across Layer, Additions, Infill, Support, Speed, Temperature, and Advanced tabs. I cover creating custom printer profiles, tuning key settings for different materials, and using the Configuration Assistant for printer setup."
category: "workflow"
softwareSlug: "simplify3d"
keyword: "Simplify3D custom printer profile FFF settings configuration assistant tuning"
slug: "simplify3d-custom-printer-profiles-fff-settings-tuning"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-22"
sources:
  - "https://www.simplify3d.com/resources/articles/different-settings-for-different-regions-of-a-model/"
  - "https://forum.simplify3d.com/viewtopic.php?t=9674"
  - "https://www.simplify3d.com/resources/articles/adding-and-modifying-support-structures/"
---

# Simplify3D Custom Printer Profiles and FFF Settings Tuning Guide

I've configured Simplify3D for over 30 different printer models, from stock Prusas to heavily modified custom builds. The FFF (Fused Filament Fabrication) Settings window is the heart of Simplify3D's power — it exposes over 100 parameters that control every aspect of the print process. Understanding how to create and tune custom profiles is essential for getting the best results from any printer.

## Profiles vs. Processes

Before diving into settings, it's critical to understand the distinction:

- **Profile**: A complete set of printer-specific settings (bed size, firmware type, extruder count, nozzle diameter). Stored in the profile dropdown.
- **Process**: An application of settings to a specific model or model region. Based on a profile but can be modified independently.

A Simplify3D forum contributor explains: "Profiles are entire sets of settings meant for a printer. A process is an application of those settings to your model(s)/regions. For the most part you're always editing a process. This means your stock profile is saved safely for you."

- **Update Profile**: Saves current process settings as the new default for that profile
- **Save as New Profile**: Creates a new profile based on current process settings

## Using the Configuration Assistant

For initial printer setup:

1. Go to **Help → Configuration Assistant**
2. Select your printer manufacturer and model
3. The assistant downloads and installs the appropriate profile
4. This sets bed size, firmware type, extruder count, and default temperatures
5. Always start with the stock profile before making custom changes

If your printer isn't listed:
1. Choose a similar printer as a starting point
2. Manually adjust bed dimensions in the **G-Code** tab
3. Set the correct firmware type (RepRap, MakerBot, BFB, etc.)
4. Configure extruder count and nozzle diameter

## FFF Settings Window Overview

The FFF Settings window has 7 main tabs:

### Layer Tab

- **Layer Height**: Primary quality setting. 0.1mm for fine detail, 0.2mm for standard, 0.3mm for fast drafts
- **First Layer Height**: Usually 150-200% of layer height for better adhesion
- **First Layer Width**: 150-200% for wider, squished first layer
- **Primary Extruder**: Which extruder prints perimeters and solid layers

### Additions Tab

- **Skirt**: Prints an outline around the model to prime the nozzle
- **Brim**: Attached to the model base for better adhesion
- **Raft**: Prints a separate base under the model for warping prevention
- **Prime Pillar**: Purges inactive extruder in dual extrusion setups
- **Ooze Shield**: Catches oozing from inactive extruder

### Infill Tab

- **Interior Fill Percentage**: 0-100% (15-25% typical, 50%+ for structural parts)
- **Interior Fill Pattern**: Grid, lines, triangles, hexagonal, concentric, fast honeycomb, high density
- **Infill Extruder**: Which extruder prints infill (can differ from primary)
- **Infill/Perimeter Overlap**: 10-25% — higher values reduce gaps between infill and walls

### Support Tab

- **Generate Support Material**: Enable/disable supports
- **Overhang Angle**: 45° default, lower for more supports, higher for fewer
- **Support Infill Percentage**: 10-20% typical
- **Support Extruder**: Which extruder prints supports
- **Upper/Lower Vertical Separation Layers**: Gap between support and part
- **Horizontal Offset from Part**: Side-to-side gap between support and part
- **Dense Support Layers**: Solid layers at the top of supports

### Speed Tab

- **Default Printing Speed**: 40-80 mm/s typical
- **Outline Speed**: Usually 50% of default for better surface quality
- **Infill Speed**: Can be faster than outlines (100-150% of default)
- **First Layer Speed**: 20-30% of default for adhesion
- **Travel Speed**: 150-200 mm/s for non-extrusion moves
- **Bridging Speed**: Faster for bridging over gaps

### Temperature Tab

- **Extruder Temperature**: Material-dependent (PLA 190-220°C, ABS 230-250°C, PETG 220-250°C)
- **Heated Bed Temperature**: PLA 50-60°C, ABS 100-110°C, PETG 70-80°C
- **First Layer Temperature**: Usually 5-10°C higher for better adhesion

### Advanced Tab

- **Start/Stop Printing at Height**: Defines Z-range for multi-process printing
- **Filament Diameter**: Must match actual filament measurement
- **Extrusion Multiplier**: Fine-tunes flow rate (0.90-1.05 range)
- **Retraction Distance**: 1-5mm direct drive, 3-7mm Bowden
- **Retraction Speed**: 30-60 mm/s
- **Coasting**: Stops extrusion before perimeter end to reduce blobs

## Material-Specific Settings

### PLA
- Temperature: 190-220°C
- Bed: 50-60°C (or unheated with blue tape)
- Retraction: 1-3mm (direct drive), 3-5mm (Bowden)
- Fan: 100% after first layer
- Print speed: 40-80 mm/s

### ABS
- Temperature: 230-250°C
- Bed: 100-110°C
- Retraction: 2-4mm (direct drive), 4-6mm (Bowden)
- Fan: off or very low (enclosure required)
- Print speed: 40-60 mm/s
- Always use raft or brim for warping prevention

### PETG
- Temperature: 220-250°C
- Bed: 70-80°C
- Retraction: 3-5mm (direct drive), 5-7mm (Bowden) — PETG is stringy
- Fan: 30-50% after first layer
- Print speed: 30-60 mm/s
- Reduce extrusion multiplier to 0.95 to prevent over-extrusion

### TPU (Flexible)
- Temperature: 220-240°C
- Bed: 50-60°C
- Retraction: 0-1mm (minimize to prevent jamming)
- Fan: 100%
- Print speed: 20-30 mm/s (slow is essential)
- Disable retraction or set very low distance

## Creating a Custom Profile

1. Start with the closest stock profile (Configuration Assistant)
2. Create a new process based on that profile
3. Adjust settings for your specific printer/material:
   - Set correct filament diameter (measure with calipers)
   - Tune extrusion multiplier (print a 1-wall cube, measure wall thickness)
   - Set retraction distance (reduce stringing test)
   - Adjust temperatures for your material
4. Test print a calibration model (e.g., 3D Benchy)
5. Once satisfied: click **Save as New Profile**
6. Name it descriptively (e.g., "Prusa MK3 - PLA - 0.2mm - Tuned")

## Common Tuning Issues

### Extrusion Multiplier Calibration

1. Print a single-wall hollow cube (0% infill, 1 perimeter, no top)
2. Measure wall thickness with calipers
3. Target = your nozzle diameter (e.g., 0.4mm)
4. If wall is 0.45mm: multiplier = 0.4/0.45 × current = reduce by ~10%
5. If wall is 0.35mm: multiplier = 0.4/0.35 × current = increase by ~14%

### Temperature Tower

1. Use the multi-process feature to print different sections at different temperatures
2. Start 10°C below recommended, increase by 5°C each section
3. Evaluate: best layer adhesion, least stringing, best overhang performance
4. Set the winning temperature as your default

## Summary

Simplify3D's FFF Settings window provides over 100 parameters for print customization. Start with the Configuration Assistant to get a stock profile, then create processes to tune settings without modifying the original profile. The key settings to tune for any new material are: extruder temperature, bed temperature, retraction distance, extrusion multiplier, and print speed. Always calibrate the extrusion multiplier by printing a single-wall cube and measuring the actual wall thickness. Save tuned settings as new profiles for reuse. The distinction between profiles (printer defaults) and processes (model-specific settings) is fundamental — edit processes, not profiles, unless you want to change the defaults for all future prints.
