---
title: "Simplify3D Print Quality Troubleshooting: Top 10 Issues and Fixes"
excerpt: "Simplify3D's print quality troubleshooting guide covers warping, stringing, poor adhesion, layer shifting, and surface defects. I cover the top 10 most common print quality issues, their root causes, and the specific Simplify3D settings to adjust for each problem."
category: "troubleshooting"
softwareSlug: "simplify3d"
keyword: "Simplify3D print quality troubleshooting warping stringing layer shifting adhesion"
slug: "simplify3d-print-quality-troubleshooting-top-10-issues"
author: "CAD IT Admin"
readTime: "12 min"
date: "2025-06-22"
sources:
  - "https://www.simplify3d.com/resources/print-quality-troubleshooting/"
  - "https://www.simplify3d.com/resources/print-quality-troubleshooting/warping/"
  - "https://www.simplify3d.com/resources/print-quality-troubleshooting/poor-surface-above-supports/"
  - "https://www.sovol3d.com/blogs/news/how-to-fix-3d-printing-stringing-cleaner-prints-guide"
---

# Simplify3D Print Quality Troubleshooting: Top 10 Issues and Fixes

I've spent years dialing in Simplify3D settings across dozens of printer types and materials. The print quality issues I see most often have specific root causes and corresponding settings adjustments. Here are the top 10 issues and how to fix them in Simplify3D.

## 1. Warping

**Symptoms**: Corners curl up and separate from the build plate.

**Root causes**: Uneven cooling, poor bed adhesion, no enclosure for high-temp materials.

**Fixes in Simplify3D**:
- Enable **Raft** (Additions tab) — provides a larger adhesion surface
- Increase **First Layer Temperature** by 5-10°C
- Increase **First Layer Width** to 150-200% (Extrusion tab)
- Reduce **First Layer Speed** to 20-30% (Speed tab)
- Enable **Heated Bed** and set 5-10°C above standard for first layer
- For ABS: use an enclosure and set bed to 100-110°C

Simplify3D's documentation notes: "As you start printing larger models, you may start to notice that even though the first few layers of your part successfully adhered to the bed, later on the part begins to curl and deform."

## 2. Stringing

**Symptoms**: Fine threads of plastic between separated parts of the model.

**Root causes**: Nozzle oozing during travel moves, wet filament, high temperature.

**Fixes in Simplify3D**:
- Enable **Retraction** (Extrusion tab) — 1-5mm for direct drive, 3-7mm for Bowden
- Set **Retraction Speed** to 30-60 mm/s
- Reduce **Extruder Temperature** by 5-10°C
- Enable **Wipe While Retracting** (Extrusion tab)
- Set **Travel Speed** to 150+ mm/s (Speed tab)
- Dry your filament — wet filament causes steam that exacerbates stringing

## 3. Poor Bed Adhesion

**Symptoms**: First layer doesn't stick, prints peel off mid-print.

**Root causes**: Incorrect first layer height, bed not level, wrong bed temperature.

**Fixes in Simplify3D**:
- Set **First Layer Height** to 0.2-0.3mm (thicker = more squish)
- Increase **First Layer Width** to 150-200%
- Reduce **First Layer Speed** to 20-30%
- Increase **Heated Bed Temperature** by 5-10°C
- Enable **Skirt** or **Brim** (Additions tab) to prime the nozzle and add adhesion
- Ensure bed is properly leveled before printing

## 4. Layer Shifting

**Symptoms**: Layers are misaligned horizontally, creating a staircase effect.

**Root causes**: Printer mechanics (loose belts, skipped steps), high print speed, sudden direction changes.

**Fixes in Simplify3D**:
- Reduce **Printing Speed** (Speed tab) — especially for outer perimeters
- Enable **Z-Hop** (Additions tab) — lifts nozzle during travel to avoid catching on parts
- Check printer belts and pulleys for mechanical issues
- Reduce **X/Y Jerk** settings if available in the G-Code tab
- For high-speed prints: reduce acceleration in the printer's firmware settings

## 5. Poor Surface Above Supports

**Symptoms**: Rough, scarred surface on areas that were printed over support material.

**Root causes**: Supports too close to part, insufficient separation layers, low support density.

**Fixes in Simplify3D**:
- Increase **Upper Vertical Separation Layers** to 2-3 (Support tab)
- Increase **Horizontal Offset** to 0.3-0.4mm
- Increase **Support Infill Percentage** to 30-50%
- Add **Dense Support Layers** (1-3 solid layers at support top)
- Reduce **Layer Height** for the section above supports
- Use soluble support material (PVA) with a dual extruder setup

Simplify3D's troubleshooting guide recommends: "You may improve results if you lower your layer height to 0.1mm."

## 6. Under-Extrusion

**Symptoms**: Gaps in layers, thin walls, weak infill, missing material.

**Root causes**: Clogged nozzle, low extrusion multiplier, filament diameter mismatch.

**Fixes in Simplify3D**:
- Increase **Extrusion Multiplier** (Extrusion tab) — try 0.95 → 1.0 → 1.05
- Verify **Filament Diameter** matches actual measurement (caliper it)
- Increase **Extruder Temperature** by 5-10°C
- Check for partial nozzle clogs
- Ensure the extruder gear isn't slipping (tighten idler tension)

## 7. Over-Extrusion

**Symptoms**: Excess material, droopy walls, rough top surfaces, material piling up.

**Root causes**: Extrusion multiplier too high, filament diameter set too small.

**Fixes in Simplify3D**:
- Decrease **Extrusion Multiplier** — try 1.0 → 0.95 → 0.90
- Verify **Filament Diameter** with calipers (1.75mm filament often measures 1.70-1.78mm)
- Reduce **Extruder Temperature** by 5°C
- Check that **Flow Rate** isn't manually overridden in the G-Code tab

## 8. Gaps Between Infill and Perimeters

**Symptoms**: Visible gaps where infill meets the outer walls.

**Root causes**: Insufficient overlap between infill and perimeters, high infill speed.

**Fixes in Simplify3D**:
- Increase **Infill/Perimeter Overlap** (Infill tab) — try 15-25%
- Reduce **Infill Speed** (Speed tab)
- Increase **Extrusion Multiplier** slightly
- Check **Infill Pattern** — some patterns (grid) are more prone to gaps than others (gyroid)

## 9. Blobs and Zits

**Symptoms**: Small bumps of material on the outer surface, especially at layer starts.

**Root causes**: Retraction settings too aggressive or not aggressive enough, pressure buildup.

**Fixes in Simplify3D**:
- Adjust **Retraction Distance** — too much causes under-extrusion at layer start, too little causes blobs
- Enable **Coasting** (Extrusion tab) — stops extrusion slightly before the end of a perimeter
- Enable **Wipe While Retracting** — wipes the nozzle on the part during retraction
- Set **Extra Restart Distance** to 0 or a small negative value
- Reduce **Retraction Speed** if blobs appear at layer start

## 10. Elephant Foot

**Symptoms**: First layer is wider than subsequent layers, creating a flared base.

**Root causes**: First layer squished too hard, bed too hot, nozzle too close to bed.

**Fixes in Simplify3D**:
- Reduce **First Layer Width** to 100-120% (instead of 150-200%)
- Reduce **First Layer Height** slightly
- Lower **Heated Bed Temperature** by 5°C for the first layer
- Enable **Elephant Foot Compensation** if available (Advanced tab)
- Increase **First Layer Speed** slightly (too slow = more squish time)

## Quick Reference Table

| Issue | Key Setting | Tab | Typical Fix |
|-------|------------|-----|-------------|
| Warping | Raft, First Layer Temp | Additions, Layer | Enable raft, +5-10°C |
| Stringing | Retraction Distance | Extrusion | 1-5mm, enable wipe |
| Poor Adhesion | First Layer Width | Extrusion | 150-200%, slower speed |
| Layer Shifting | Print Speed, Z-Hop | Speed, Additions | Reduce speed, enable Z-hop |
| Poor Surface Above Supports | Separation Layers | Support | 2-3 layers, 0.3-0.4mm offset |
| Under-Extrusion | Extrusion Multiplier | Extrusion | Increase to 1.0-1.05 |
| Over-Extrusion | Extrusion Multiplier | Extrusion | Decrease to 0.90-0.95 |
| Infill Gaps | Infill Overlap | Infill | 15-25% overlap |
| Blobs/Zits | Coasting, Retraction | Extrusion | Enable coasting, tune retraction |
| Elephant Foot | First Layer Width | Extrusion | Reduce to 100-120% |

## Summary

Most Simplify3D print quality issues can be traced to a small number of settings. Warping is fixed with rafts and higher first-layer temperatures. Stringing requires proper retraction distance and speed. Poor surface above supports needs more separation layers and higher support density. Under/over-extrusion is almost always an extrusion multiplier or filament diameter issue. Layer shifting usually indicates mechanical problems but can be mitigated by reducing speed and enabling Z-hop. When troubleshooting, change one setting at a time and reprint a small test model to isolate the cause. Keep notes of what works for each printer/material combination — Simplify3D's profile system makes it easy to save and reuse optimized settings.
