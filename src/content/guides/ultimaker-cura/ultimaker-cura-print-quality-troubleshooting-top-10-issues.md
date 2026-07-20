---
title: "UltiMaker Cura Print Quality Troubleshooting: Top 10 Issues and Fixes"
excerpt: "From warping and elephant foot to under-extrusion and layer shifting, I cover the 10 most common Cura print quality issues with their root causes and specific settings adjustments to fix them. Each issue includes diagnosis steps and recommended Cura settings changes."
category: "troubleshooting"
softwareSlug: "ultimaker-cura"
keyword: "UltiMaker Cura print quality troubleshooting warping under-extrusion layer shifting"
slug: "ultimaker-cura-print-quality-troubleshooting-top-10-issues"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-06-22"
sources:
  - "https://support.ultimaker.com/s/article/1667337578307"
  - "https://support.ultimaker.com/s/article/1667411336660"
  - "https://support.ultimaker.com/s/article/1667411002588"
  - "https://support.makerbot.com/s/article/1667417606331"
---

# UltiMaker Cura Print Quality Troubleshooting: Top 10 Issues and Fixes

After years of helping people troubleshoot 3D print failures, I've found that almost every print quality issue maps to one of ten common problems. Each has specific root causes and Cura settings that can fix them. I'll cover diagnosis, cause, and solution for each.

## 1. Warping (Corners Lifting from Bed)

**Symptoms**: One or more corners of the print lift off the build plate, creating a curved base.

**Root causes**: Uneven cooling causes the plastic to contract. The corners cool faster than the center and pull upward.

**Cura settings fixes**:
- **Build Plate Adhesion Type**: Set to **Brim** (5-10 mm) or **Raft**
- **Initial Layer Temperature**: Increase bed temp by 5-10°C for the first layer
- **Initial Layer Height**: Increase to 0.2-0.3 mm for better adhesion
- **Initial Layer Flow**: Increase to 105-110% for better squish against the bed
- **Initial Layer Speed**: Reduce to 20-30 mm/s

**Non-Cura fixes**:
- Clean the build plate with isopropyl alcohol
- Use a textured PEI sheet for PLA
- Enclose the printer for ABS/ASA
- Apply glue stick or adhesion promoter

## 2. Elephant's Foot (Widened First Layer)

**Symptoms**: The first layer is wider than the rest of the print, creating a lip at the base.

**Root causes**: The first layer is pressed too hard against the build plate, causing the plastic to spread outward.

**Cura settings fixes**:
- **Initial Layer Horizontal Expansion**: Set to **-0.5 mm** (negative value compensates for the spread)
- **Initial Layer Flow**: Reduce to 95-100%
- **Initial Layer Height**: Reduce to 0.15 mm (thinner first layer spreads less)
- **Build Plate Temperature**: Reduce by 5°C (lower bed temp = less softening of the first layer)

**Non-Cura fixes**:
- Increase Z-offset slightly
- Level the bed with more gap at the first layer

## 3. Stringing (Thin Threads Between Parts)

**Symptoms**: Thin strings of plastic between separated parts of the model or between models on the build plate.

**Root causes**: Filament oozing from the nozzle during travel moves due to insufficient retraction or excessive temperature.

**Cura settings fixes**:
- **Retraction Distance**: Increase by 0.5 mm increments (direct drive: 1-2 mm, Bowden: 4-6 mm)
- **Retraction Speed**: 35-50 mm/s
- **Combing Mode**: Set to **Not in Skin**
- **Printing Temperature**: Reduce by 5°C
- **Travel Speed**: Increase to 150-200 mm/s (faster travel = less time for ooze)

**Non-Cura fixes**:
- Dry your filament (moisture causes stringing-like symptoms)
- Replace worn nozzles

## 4. Under-Extrusion (Gaps, Thin Layers)

**Symptoms**: Gaps in the print, thin or missing layers, rough surface texture, weak parts.

**Root causes**: Not enough filament being extruded. Can be caused by clogged nozzle, extruder issues, or incorrect flow settings.

**Cura settings fixes**:
- **Flow**: Increase to 105-110% (temporary fix — calibrate flow rate properly)
- **Printing Temperature**: Increase by 5-10°C (hotter plastic flows more easily)
- **Print Speed**: Reduce to 40-50 mm/s (slower printing = more time for extrusion)
- **Retraction Distance**: Reduce excessive retraction (can cause filament grinding and under-extrusion)
- **Maximum Volumetric Speed**: Check if this is limiting your extrusion rate

**Non-Cura fixes**:
- Clean or replace clogged nozzle
- Check extruder gear for wear or slipping
- Calibrate E-steps
- Dry filament (wet filament under-extrudes)

## 5. Over-Extrusion (Rough Surfaces, Dimensional Inaccuracy)

**Symptoms**: Rough top surfaces, parts that are too thick, material buildup on surfaces.

**Root causes**: Too much filament being extruded.

**Cura settings fixes**:
- **Flow**: Reduce to 95-98%
- **Printing Temperature**: Reduce by 5°C
- **Line Width**: Verify it matches your nozzle diameter (0.4 mm nozzle → 0.4 mm line width)

**Non-Cura fixes**:
- Calibrate E-steps
- Measure filament diameter with calipers (may vary from nominal 1.75 mm)

## 6. Layer Shifting (Misaligned Layers)

**Symptoms**: Layers are offset horizontally, creating a staircase effect or completely misaligned print.

**Root causes**: The X or Y axis moves unexpectedly during printing. Usually caused by skipped steps due to excessive speed, loose belts, or obstructions.

**Cura settings fixes**:
- **Print Speed**: Reduce to 40-50 mm/s
- **Acceleration**: Reduce in printer settings
- **Jerk**: Reduce to 8-12 mm/s
- **Travel Speed**: Reduce to 150 mm/s
- **Infill Density**: Reduce to lower print head forces

**Non-Cura fixes**:
- Tighten belt tension
- Check for obstructions on the axis rails
- Lubricate linear rods and bearings
- Check stepper motor current (may need to increase for heavy toolheads)
- Ensure the print cable isn't catching on anything

## 7. Poor Top Surface Quality (Rough or Gappy Top Layers)

**Symptoms**: Top surfaces are rough, have visible gaps between lines, or show infill pattern through the top layer.

**Root causes**: Insufficient top layers, low flow, or infill pattern showing through.

**Cura settings fixes**:
- **Top Layers**: Increase to 5-6 minimum (at 0.2 mm layer height)
- **Top/Bottom Line Width**: Increase slightly (0.42-0.45 mm for 0.4 mm nozzle)
- **Top Surface Skin Speed**: Reduce to 30-40 mm/s
- **Infill Density**: Increase to 20%+ (low infill can cause top layer sagging)
- **Skin Overlap**: Increase slightly to fill gaps between top layer lines
- **Ironing**: Enable for smooth flat top surfaces

**Non-Cura fixes**:
- Ensure adequate cooling (100% fan for top layers)
- Check filament is dry

## 8. Blobbing and Zits (Surface Imperfections)

**Symptoms**: Small blobs or zits on the outer surface of the print, especially at seams or after travel moves.

**Root causes**: Excess material deposited at the start of a line after a travel move, or inconsistent extrusion at seams.

**Cura settings fixes**:
- **Retraction Extra Prime Amount**: Set to 0 (or negative if available) to reduce extra material after retraction
- **Coasting**: Enable at 0.2-0.4 mm (stops extrusion slightly before the end of a line to use residual pressure)
- **Outer Wall Wipe Distance**: Set to 0.2 mm (wipes the nozzle on the printed wall)
- **Z-seam Alignment**: Set to **Sharpest Corner** or **User Specified** to hide the seam
- **Print Speed**: Reduce outer wall speed to 30-40 mm/s

**Non-Cura fixes**:
- Clean the nozzle exterior (filament buildup on the nozzle causes blobs)
- Check extruder gear for consistent feeding

## 9. Bridging Failures (Sagging Bridges)

**Symptoms**: Material sags or droops when printing across a gap without support.

**Root causes**: Filament not cooling fast enough while bridging, or incorrect bridging settings.

**Cura settings fixes**:
- **Bridge Skin Speed**: Reduce to 15-25 mm/s (slower = more time to cool)
- **Bridge Skin Flow**: Reduce to 80-90% (less material = less sagging)
- **Bridge Fan Speed**: Set to 100% (maximum cooling for bridges)
- **Bridge Wall Speed**: Reduce to 20-30 mm/s
- **Enable Bridge Settings**: Check that bridge settings are enabled in the experimental section

**Non-Cura fixes**:
- Improve part cooling fan performance
- Use supports for bridges longer than 10 mm

## 10. Pillowing (Top Layer Defects Over Infill)

**Symptoms**: The top layer shows bumps or holes corresponding to the infill pattern underneath.

**Root causes**: The top layer isn't thick enough to bridge over the gaps in the infill pattern.

**Cura settings fixes**:
- **Top Layers**: Increase to 6+ layers
- **Infill Pattern**: Switch to **Cubic** or **Gyroid** (these patterns don't create long air pockets that cause pillowing)
- **Infill Density**: Increase to 20%+ for better top layer support
- **Skin Overlap**: Increase to 15-20% to improve adhesion between top layer and infill
- **Gradual Infill**: Enable to increase infill density near the top of the print

**Non-Cura fixes**:
- Improve cooling for top layers
- Reduce print speed for top layers

## Diagnostic Workflow

When troubleshooting a print quality issue, I follow this sequence:

1. **Identify the symptom** — match it to one of the 10 issues above
2. **Check temperature first** — wrong temperature is the most common root cause
3. **Check filament dryness** — wet filament mimics many different issues
4. **Adjust one setting at a time** — changing multiple settings simultaneously makes it impossible to identify which fix worked
5. **Print a small test model** — don't waste 10 hours on a full print to test a setting change. Use a calibration cube or the specific test model for the issue
6. **Save working profiles** — once you find settings that work, save them as a named profile

## Summary

Most Cura print quality issues fall into these 10 categories. The most common root causes are incorrect temperature, wet filament, and insufficient retraction. Start with temperature (find the lowest temp that gives good layer adhesion), then dry your filament, then tune retraction. For first-layer issues, bed adhesion type (brim) and initial layer settings are the primary tools. For surface quality, focus on top layer count, outer wall speed, and combing mode. For structural issues like layer shifting, reduce speed and check belt tension.
