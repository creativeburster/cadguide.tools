---
title: "PrusaSlicer Profiles for Non-Prusa Printers: Voron, Bambu, Creality, and Custom Setup"
excerpt: "PrusaSlicer ships with profiles for Prusa printers, but it works with any FDM printer. We cover how to set up custom printer profiles for Voron, Creality, and other brands, work around Prusa's preset dependency system, and import community-maintained profiles for non-Prusa hardware."
category: "workflow"
softwareSlug: "prusaslicer"
keyword: "PrusaSlicer profiles non-Prusa printers Voron Bambu custom setup"
slug: "prusaslicer-profiles-non-prusa-printers-voron-custom-setup"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://docs.vorondesign.com/build/slicer/"
  - "https://www.reddit.com/r/VORONDesign/comments/1r78u6e/psa_prusaslicer_has_new_voron_profiles/"
  - "https://forum.prusa3d.com/forum/hardware-firmware-and-software-help/printer-and-print-profile-setting-linked-in-prusaslicer/"
  - "https://adpindustries.com/blog/bambu-studio-vs-orcaslicer-vs-prusaslicer/"
  - "https://3dprinting.com/software-guides/best-3d-printer-slicers/"
---

# PrusaSlicer Profiles for Non-Prusa Printers: Voron, Bambu, Creality, and Custom Setup

We run a mixed fleet of 3D printers — two Prusa MK4s, a Voron 2.4, a Bambu X1C, and a couple of modified Creality machines — and PrusaSlicer is our preferred slicer for all of them. While PrusaSlicer is developed by Prusa Research and ships with excellent profiles for Prusa hardware, it works with any FDM printer. The challenge is getting the profiles set up correctly for non-Prusa machines.

## PrusaSlicer's Built-In Non-Prusa Profiles

Starting with PrusaSlicer 2.7, the slicer ships with profiles for several non-Prusa printer brands. The Voron community was excited to discover that PrusaSlicer added official Voron profiles, as noted in a Reddit PSA on r/VORONDesign: "PSA: PrusaSlicer has new Voron profiles!"

To access these:
1. Open PrusaSlicer
2. Go to **Configuration → Configuration Wizard**
3. Select the printer brands you want profiles for
4. Complete the wizard

Currently, PrusaSlicer includes profiles for:
- **Voron Design** (Voron 2.4, Trident, Voron 0, Switchwire)
- **Creality** (Ender 3 series, CR-10 series)
- **Bambu Lab** (limited — Bambu Studio is recommended for Bambu printers)
- **Anycubic** (several models)
- **Artillery** (Sidewinder, Genius)

The Voron documentation states: "All modern mainstream slicers are able to produce high-quality prints when properly configured for your printer. The Voron community maintains a set of slicer profiles that you can use as a known good starting point for further tuning."

## Setting Up a Custom Printer Profile

For printers without built-in profiles, you need to create a custom printer configuration. Here's our process:

### Step 1: Create a Custom Printer

1. In PrusaSlicer, click **Add/Remove Printers**
2. Select **Other vendors → Custom** → **Custom FDM printer**
3. Name it after your printer (e.g., "Custom CoreXY 300mm")

### Step 2: Configure Bed Size and Shape

Go to **Printer Settings → Size and coordinates**:
- **Bed shape**: Rectangular (most printers) or Circular (delta printers)
- **Print volume**: X, Y, Z dimensions in mm
- **Origin**: Usually 0,0 (bottom-left) for Cartesian, or center for delta

### Step 3: Configure Nozzle and Extruder

Go to **Printer Settings → Extruder**:
- **Nozzle diameter**: 0.4 mm (standard), 0.6 mm, 0.8 mm, etc.
- **Extruder type**: Direct drive or Bowden
- **Retraction length**: Start with 0.4 mm for direct drive, 3-5 mm for Bowden
- **Retraction speed**: 35 mm/s is a safe starting point
- **Pressure advance**: Leave at 0 until calibrated

### Step 4: Set Machine Limits

Go to **Printer Settings → Machine limits**:
- **Max print speed**: 150 mm/s for most printers, 300+ mm/s for high-speed CoreXY
- **Max acceleration**: 3000 mm/s² for budget printers, 5000-10000 mm/s² for rigid CoreXY
- **Max travel speed**: 200-500 mm/s depending on your printer
- **Max jerk X/Y**: 10-20 mm/s

These values should match your printer's actual capabilities. Setting them too high causes skipped steps and print failures; too low and you leave performance on the table.

### Step 5: Configure Custom G-code

Go to **Printer Settings → Custom G-code**:
- **Start G-code**: Include homing, bed leveling, and any printer-specific initialization
- **End G-code**: Turn off heaters, home axes, disable motors
- **Before layer change G-code**: Useful for Klipper (e.g., `SET_PRESSURE_ADVANCE ADV=0.04`)
- **Color change G-code**: If your printer supports it

## Working Around Prusa's Dependency System

One of the most common frustrations we encounter — and one that appears frequently on the Prusa forum — is PrusaSlicer's dependency system. Prusa links print profiles, filament profiles, and printer profiles together using dependencies. When you try to use a Prusa print profile with a custom printer, PrusaSlicer may refuse or show warnings.

A Prusa forum user explains: "Unfortunately, you've run into Prusa's use of dependencies. They use dependencies in their presets to link them to specific printers and filaments."

The workaround:
1. **Create a custom print profile** instead of trying to use Prusa's built-in ones
2. Go to **Print Settings**, configure everything manually
3. Save as a new profile with **File → Export → Export current profile**
4. This creates an independent profile not linked to any specific printer

Alternatively, you can edit the profile INI file directly and remove the `compatible_printers` line, then reimport it.

## Importing Community Profiles

Many communities maintain their own PrusaSlicer profiles:

### Voron Profiles
The Voron Design documentation maintains profiles at their official docs site. Download the PrusaSlicer bundle and import via **File → Import → Import config bundle**.

### Creality Profiles
PrusaSlicer includes basic Creality profiles, but the community maintains improved ones on GitHub. Search for "Creality PrusaSlicer profiles" on GitHub and look for repositories with recent commits.

### Custom CoreXY (Voron clones, Rat Rig, etc.)
Most CoreXY printer manufacturers provide PrusaSlicer profiles. Check your manufacturer's documentation or community Discord.

## PrusaSlicer vs OrcaSlicer for Non-Prusa Printers

The comparison between PrusaSlicer and OrcaSlicer for non-Prusa printers is a hot topic in the community. As one comparison article notes: "OrcaSlicer is the only slicer that provides first-class support for Bambu Lab, Voron, Creality, Prusa, and dozens of other brands. One slicer, all your printers, unified workflow."

OrcaSlicer (a Bambu Studio fork, which itself is a PrusaSlicer fork) includes:
- Built-in calibration tools (flow rate, pressure advance, temperature tower)
- More non-Prusa printer profiles out of the box
- Klipper-specific features like built-in input shaper calibration

However, PrusaSlicer has advantages:
- More transparent development process
- Organic supports (the best implementation among open-source slicers)
- More frequent stable releases
- Better documentation

A Voron community member on Reddit notes: "I stay within SuperSlicer and PrusaSlicer. But also I only own Voron printers." This reflects a common sentiment — many Voron owners prefer PrusaSlicer's interface and support quality despite OrcaSlicer's broader printer support.

## Our Recommended Setup for Mixed Fleets

If you have multiple printer brands, we recommend:
1. **PrusaSlicer** for Prusa printers and any printer where you want the best support generation
2. **Bambu Studio** for Bambu Lab printers (AMS integration is native)
3. **OrcaSlicer** if you want a single slicer for all printers and value built-in calibration tools

All three slicers share a common ancestry (PrusaSlicer → Bambu Studio → OrcaSlicer) and have similar UIs, so switching between them is straightforward.

## Summary

PrusaSlicer works well with non-Prusa printers, but requires more manual setup than using it with Prusa hardware. The key steps are creating a custom printer profile, configuring bed size and machine limits, working around the dependency system for print profiles, and importing community-maintained profiles where available. For Bambu Lab printers specifically, Bambu Studio or OrcaSlicer may be a better choice due to native AMS support. For Voron and other CoreXY printers, PrusaSlicer's built-in Voron profiles and community-maintained configurations provide an excellent starting point.
