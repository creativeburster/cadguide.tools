---
title: "PrusaSlicer Pressure Advance and Input Shaping Calibration Guide"
excerpt: "Pressure advance (PA) and input shaping are the two calibration settings that most dramatically improve print quality on modern 3D printers. I cover how to calibrate PA in PrusaSlicer, configure input shaping for Klipper and Prusa firmware, and troubleshoot common issues like bulging corners and ringing artifacts."
category: "workflow"
softwareSlug: "prusaslicer"
keyword: "PrusaSlicer pressure advance input shaping calibration Klipper"
slug: "prusaslicer-pressure-advance-input-shaping-calibration"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-22"
sources:
  - "https://help.prusa3d.com/article/linear-advance_2252"
  - "https://garethky.github.io/PrusaSlicerPressureAdvanceCalibration/"
  - "https://www.printables.com/model/641490-prusa-slicer-pressure-advance-test"
  - "https://forum.prusa3d.com/forum/prusaslicer/where-do-i-input-pressure-advance-values-in-prusa-slicer/"
  - "https://wiki.visionminer.com/en/home/22IDEX/all/PressureAdvance"
---

# PrusaSlicer Pressure Advance and Input Shaping Calibration Guide

I manage a fleet of 3D printers ranging from Prusa MK4s to custom Voron builds, and the two settings that consistently make the biggest quality difference are pressure advance (PA) and input shaping. Both address artifacts that stem from the physics of extruding plastic through a moving nozzle — but they tackle different problems. Pressure advance fixes bulging corners and inconsistent extrusion at direction changes, while input shaping eliminates ringing and ghosting caused by printer vibration.

## Understanding Pressure Advance

When your printer's nozzle moves and changes direction, the pressure inside the Bowden tube or direct drive extruder doesn't change instantly. At the start of a move, pressure is too low (under-extrusion). At the end of a move, pressure is too high (over-extrusion, causing bulging corners). Pressure advance — also called Linear Advance on older Marlin firmware — compensates by advancing extrusion at the start of moves and retracting at the end.

Prusa's official documentation states: "Linear Advance is an advanced calibration for MK3-family and MK2-family printers. It is replaced by Pressure Advance on MK4-family, XL, MINI/+ from firmware 5.0.0, and successive printer models."

The result of proper PA calibration:
- Sharp, clean corners without bulging
- Consistent extrusion at the start and end of each line
- Reduced stringing in some cases
- Better top surface quality

## How to Calibrate Pressure Advance in PrusaSlicer

### Step 1: Determine Your Firmware's PA Support

- **Prusa firmware 5.0+** (MK4, XL, MINI+, CORE One): Uses Pressure Advance natively. Set the value directly in PrusaSlicer's filament settings.
- **Prusa firmware 4.x** (MK3, MK3S+): Uses Linear Advance (K-factor). Set in PrusaSlicer under Filament Settings → Advanced → Pressure advance (labeled as Linear Advance in older versions).
- **Klipper**: Uses Pressure Advance. Set in your `printer.cfg` with `pressure_advance: 0.04` (example value). PrusaSlicer doesn't need to know — Klipper handles it in firmware.
- **Marlin**: Uses Linear Advance. Set via G-code `M900 K0.22` or in PrusaSlicer's custom G-code.

### Step 2: Run a Calibration Test

I use the PrusaSlicer Pressure Advance Test by gareth.ky on Printables. This test generates a pattern that varies the PA value across a single print, so you can read the optimal value directly from the printed result.

1. Download the test model from Printables (model ID 641490)
2. Open the included 3MF project file in PrusaSlicer — it has the correct settings pre-configured
3. Select your printer and filament profile
4. Slice and print

The test prints lines at different PA values. You're looking for the most consistent line width with no bulging at the start or end of each segment.

### Step 3: Read the Results

After printing, examine the test pattern:
- **PA too low**: Bulging at the start of each line, thin at the end
- **PA too high**: Thin at the start, bulging at the end
- **PA just right**: Consistent width throughout each line

The test pattern labels each segment with its PA value, so you can read the optimal value directly.

### Step 4: Enter the Value in PrusaSlicer

For Prusa firmware 5.0+ printers:
- Go to **Filament Settings → Advanced**
- Find **Pressure advance** (not Linear Advance)
- Enter your calibrated value (typically 0.02-0.06 for direct drive, 0.04-0.08 for Bowden)

For Klipper:
- Enter the value in your `printer.cfg` file
- PrusaSlicer doesn't need the value — Klipper applies it in firmware

For Marlin with Linear Advance:
- Go to **Printer Settings → Custom G-code → Start G-code**
- Add `M900 K[your_value]` to the start G-code
- Alternatively, set it in Filament Settings → Advanced if your Marlin build supports it

## Understanding Input Shaping

Input shaping is a control technique that reduces vibrations in the printer's motion system. When the printer's toolhead accelerates and decelerates, the heavy moving mass excites mechanical resonances in the frame, belts, and gantry. These vibrations manifest as ringing (also called ghosting or echoing) — visible repeating patterns on the print surface, especially at corners.

Input shaping works by modifying the acceleration commands to cancel out these resonances. The printer measures (or you manually measure) the resonant frequencies of the X and Y axes, and the firmware applies a filter that suppresses vibrations at those frequencies.

## Configuring Input Shaping

### For Klipper

Klipper has the most mature input shaping implementation:

1. **Measure resonances** using an ADXL345 accelerometer:
   - Connect the ADXL345 to your control board
   - Run `SHAPER_CALIBRATE` in Klipper's console
   - Klipper will automatically measure and recommend the best shaper type and frequency

2. **Or measure manually** without an accelerometer:
   - Print a ringing test pattern (a small square with sharp corners)
   - Measure the distance between ringing artifacts with calipers
   - Calculate the resonant frequency: `freq = printing_speed / (ringing_distance * 2)`
   - Enter the value in `printer.cfg` under `[input_shaper]`

3. **Configure in PrusaSlicer**:
   - Go to **Printer Settings → Custom G-code**
   - In the Start G-code, ensure Klipper's input shaper is activated (it's on by default once configured)
   - Set **Maximum print speed** and **Maximum acceleration** to values appropriate for your shaper

### For Prusa Firmware 5.0+

Prusa's implementation is automatic on supported printers:
- The printer performs a self-test during setup that measures resonances
- Input shaping is enabled by default after the self-test
- In PrusaSlicer, select the correct printer profile (e.g., "Original Prusa MK4") and the input shaper settings are pre-configured
- You can adjust the **Maximum print speed** in Print Settings to take advantage of the higher acceleration enabled by input shaping

### For Marlin (with Input Shaping Support)

Some Marlin builds (like Marlin 2.1.2+) support input shaping:
- Configure via `M593` G-code
- Set the shaper type and frequency in your printer's configuration
- In PrusaSlicer, increase the acceleration limits in Printer Settings → Machine limits

## Common Issues

### PA Value Doesn't Improve Print Quality

This usually means the PA value is wrong or the printer has excessive mechanical play. Check:
- Belt tension (loose belts cause artifacts that look like PA issues)
- Extruder gear condition (worn or dirty gears cause inconsistent extrusion)
- Hotend temperature (too cold causes under-extrusion that PA can't fix)

### Ringing Persists After Input Shaping

The resonant frequency may have changed. Re-run the calibration. Common causes:
- Changed belt tension
- Added or removed weight from the toolhead (new fan, different hotend)
- Changed print speed or acceleration settings

### PrusaSlicer Doesn't Show Pressure Advance Setting

The PrusaSlicer forum has many threads on this. The setting appears only when:
- You select a printer profile that supports PA (Prusa MK4, XL, MINI+, CORE One)
- Or you enable "Advanced" settings visibility in PrusaSlicer's preferences
- For older printers, look for "Linear Advance" instead

## Recommended Starting Values

Based on my experience across multiple printer types:

- **Direct drive extruders**: PA 0.02-0.06
- **Bowden extruders (short tube)**: PA 0.04-0.08
- **Bowden extruders (long tube, 500mm+)**: PA 0.08-0.15
- **Input shaping frequency**: Typically 30-60 Hz for X axis, 30-50 Hz for Y axis on most Cartesian/CoreXY printers

Vision Miner's documentation notes: "We provide well-tested default values in our PrusaSlicer profiles (optimized for a 0.4 mm nozzle), factors like nozzle diameter and filament moisture content can necessitate adjustments for optimal results."

## Summary

Pressure advance and input shaping are the two most impactful calibrations you can perform. PA fixes extrusion consistency at direction changes, and input shaping fixes vibration artifacts. Both require test prints and careful reading of results, but the quality improvement is immediately visible. I recommend calibrating PA first (it's simpler and doesn't require hardware), then input shaping (which may require an accelerometer for best results on Klipper).
