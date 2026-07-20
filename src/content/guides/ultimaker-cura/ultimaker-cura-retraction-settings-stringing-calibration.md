---
title: "UltiMaker Cura Retraction Settings: Eliminating Stringing and Oozing with Proper Calibration"
excerpt: "Stringing is the most common print quality issue, and Cura's retraction settings are the primary tool for fixing it. We cover retraction distance, speed, combing mode, and the calibration workflow using retraction test towers — with specific starting values for direct drive and Bowden extruders."
category: "troubleshooting"
softwareSlug: "ultimaker-cura"
keyword: "UltiMaker Cura retraction settings stringing calibration tuning"
slug: "ultimaker-cura-retraction-settings-stringing-calibration"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://support.ultimaker.com/s/article/1667411336660"
  - "https://support.ultimaker.com/s/article/1667337578307"
  - "https://www.wevolver.com/article/cura-retraction-settings"
  - "https://3dx.info/eliminate-stringing-advanced-retraction-settings-in-cura-and-prusaslicer-explained-for-clean-prints/"
  - "https://www.3dprinterstuff.com/workshop/retraction-settings-explained"
---

# UltiMaker Cura Retraction Settings: Eliminating Stringing and Oozing with Proper Calibration

We've helped dozens of people troubleshoot stringing issues, and in almost every case the root cause is either retraction settings that aren't tuned for the specific filament, or a temperature that's too high. Cura has excellent retraction controls, but they're hidden in the advanced settings and many users never venture beyond the defaults.

## What Causes Stringing?

When the print head moves between two separate parts of the print (a "travel move"), the nozzle crosses open air. Without retraction, molten filament oozes out during that travel, leaving thin strings behind. Retraction pulls the filament backward inside the hotend, creating negative pressure that prevents ooze.

Cura's official documentation explains: "Retraction is used at the places in a print where the printer has to do a travel move between two printed parts. Without retraction, extruded material will hang between the parts."

## Enabling and Finding Retraction Settings

Retraction is enabled by default for UltiMaker printers. To access the settings:
1. Switch to **Custom** print settings
2. Open the **Travel** category
3. Ensure **Enable Retraction** is checked

For non-UltiMaker printers, you may need to enable all settings via **Preferences → Configure Cura → Setting Visibility** and set to **Advanced** or **Expert**.

## Key Retraction Settings

### Retraction Distance

The most important setting. This is how far the filament is pulled back during a travel move, measured in millimeters.

**Starting values by extruder type:**
- **Direct drive**: 0.5-2.0 mm (start at 1.0 mm)
- **Bowden (short tube, <200mm)**: 3-5 mm (start at 4 mm)
- **Bowden (long tube, 200-500mm)**: 5-8 mm (start at 6 mm)
- **Bowden (very long, >500mm)**: 8-15 mm (start at 10 mm)

Too much retraction distance causes filament grinding, heat creep, and can pull the filament completely out of the hotend. Too little leaves stringing.

### Retraction Speed

How fast the filament is retracted and re-primed. Measured in mm/s.

**Starting values:**
- **Direct drive**: 25-45 mm/s (start at 35)
- **Bowden**: 40-60 mm/s (start at 50)

Faster retractions minimize oozing but can grind the filament. Slower retractions are gentler but may not prevent ooze effectively.

### Retraction Minimum Travel

The minimum distance the print head must travel before a retraction is triggered. Default is **1.5 mm**. Setting this too low causes excessive retractions in a small area, which can grind the filament. Setting it too high allows stringing on short travel moves.

### Maximum Retraction Count

Limits the number of retractions within a window of filament (defined by Minimum Extrusion Distance Window). Default is **10**. This prevents grinding the same section of filament repeatedly. For models with many small holes (like voronoi patterns), you may need to increase this.

### Combing Mode

Combing keeps the nozzle within the model boundary during travel moves instead of crossing open air. This is one of the most effective stringing prevention tools because it reduces the need for retractions entirely.

Options:
- **Off**: No combing — all travel moves are direct
- **All**: Comb within the entire model — may leave visible travel scars on top surfaces
- **Not in Skin**: Comb everywhere except top/bottom layers — our default choice
- **Within Infill**: Comb only within infill areas — safest option, no visible scarring

As one detailed guide notes: "Combing is a strategic way to hide oozing, but it doesn't eliminate the underlying tendency to ooze if retraction is insufficient."

### Max Comb Distance With No Retract

When combing is enabled, retractions are skipped for combing moves. This setting limits how far the nozzle can travel without retracting while combing. Reducing this value forces retractions on longer combing moves, which can reduce internal stringing.

### Retraction Extra Prime Amount

Extra material extruded after a retraction to compensate for oozed material. Default is **0 mm**. Increase to 0.063-0.1 mm if you see under-extrusion at the start of lines after travel moves. This is especially useful for flexible filaments.

### Z Hop When Retracted

Lifts the nozzle during travel moves after retraction. This prevents the nozzle from hitting the print surface during travel. Default is **0 mm** (disabled). We enable it at **0.2 mm** for models with many travel moves. Keep it low — high Z-hop gives ooze more time to form strings.

## Calibration Workflow

### Step 1: Calibrate Temperature First

Before tuning retraction, ensure your temperature is correct. As one guide emphasizes: "Lowering your nozzle temp by 5°C often reduces stringing more than any retraction change."

Print a temperature tower and find the lowest temperature that still gives good layer adhesion and smooth extrusion.

### Step 2: Print a Retraction Test

Download a retraction test model (two towers with a gap between them) from Printables or Thingiverse. Print it with your current settings to establish a baseline.

### Step 3: Tune Retraction Distance

1. Start with the recommended value for your extruder type
2. Print the test at that distance
3. Increase by 0.5 mm (direct drive) or 1 mm (Bowden) for the next test
4. Keep speed constant
5. When strings disappear or reach a minimum, lock that distance

### Step 4: Tune Retraction Speed

1. With the optimal distance locked, test different speeds
2. Try 25, 35, 45, and 55 mm/s
3. Find the speed that minimizes stringing without causing filament grinding

### Step 5: Adjust Combing

Set combing to "Not in Skin" and adjust Max Comb Distance With No Retract to 10-15 mm. This should eliminate most remaining stringing.

## Material-Specific Recommendations

### PLA
- Retraction distance: 1 mm (direct drive), 4 mm (Bowden)
- Retraction speed: 35 mm/s
- Temperature: 200-210°C (lower if stringing persists)
- PLA is the least stringy material — if you're getting strings with PLA, your temperature is likely too high

### PETG
- Retraction distance: 1.5 mm (direct drive), 5-6 mm (Bowden)
- Retraction speed: 40 mm/s
- Temperature: 230-240°C
- PETG is inherently stringy — perfect retraction won't eliminate all strings. Use combing and accept minor stringing that can be cleaned up post-print

### ABS/ASA
- Retraction distance: 1 mm (direct drive), 4 mm (Bowden)
- Retraction speed: 35 mm/s
- Temperature: 240-250°C
- ABS typically strings less than PETG but requires good temperature control

### TPU (Flexible)
- Retraction distance: 0.5-1 mm (direct drive only — Bowden TPU is very difficult)
- Retraction speed: 20-25 mm/s (slow to prevent grinding)
- TPU requires minimal retraction and relies more on combing to prevent stringing

## Common Issues Beyond Retraction

If retraction tuning doesn't fix stringing, check these:

- **Temperature too high**: Drop 5°C and retest — this is the most common non-retraction cause
- **Wet filament**: Moisture causes popping and irregular extrusion that looks like stringing. Dry your filament.
- **Travel speed too low**: Faster travel gives ooze less time to deposit. Try 150-200 mm/s.
- **Worn nozzle**: A worn nozzle tip doesn't seal cleanly. Replace brass nozzles after 500+ hours.
- **Flow rate too high**: Over-extrusion means there's always excess plastic in the hotend. Calibrate flow rate.

## Summary

Stringing is primarily caused by insufficient retraction or excessive temperature. Start by calibrating temperature (find the lowest temp with good layer adhesion), then tune retraction distance using a test tower, followed by retraction speed. Enable combing mode set to "Not in Skin" to minimize the need for retractions. For direct drive extruders, 1 mm at 35 mm/s is a good starting point for PLA. For Bowden, 4-6 mm at 50 mm/s. PETG will always have some stringing — accept it and clean up post-print. Always dry filament before tuning retraction, as moisture mimics stringing symptoms.
