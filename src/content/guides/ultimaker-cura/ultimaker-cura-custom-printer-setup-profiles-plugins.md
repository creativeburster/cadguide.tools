---
title: "UltiMaker Cura Custom Printer Setup: Non-UltiMaker Printers, Profile Management, and Configuration"
excerpt: "Cura works with any FDM printer, not just UltiMaker hardware. We cover adding custom printers, configuring bed size and extruder settings, managing print profiles, and the most useful marketplace plugins for extending Cura's functionality."
category: "workflow"
softwareSlug: "ultimaker-cura"
keyword: "UltiMaker Cura custom printer profile non-UltiMaker setup configuration"
slug: "ultimaker-cura-custom-printer-setup-profiles-plugins"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://support.ultimaker.com/s/article/1667411318431"
  - "https://support.makerbot.com/s/article/1667411286867"
  - "https://github.com/Ultimaker/Cura/wiki/Adding-new-machine-profiles-to-Cura"
  - "https://www.selfcad.com/blog/best-cura-plugins"
---

# UltiMaker Cura Custom Printer Setup: Non-UltiMaker Printers, Profile Management, and Configuration

We use Cura with printers from five different manufacturers, and while it's designed for UltiMaker hardware, it works well with any FDM printer once you understand the profile system. Cura's marketplace and plugin ecosystem also make it more extensible than PrusaSlicer or Bambu Studio.

## Adding a Custom Printer

### Step 1: Add the Printer

1. Open Cura and click **Add Printer** (or Settings → Printer → Add Printer)
2. Select **Non-UltiMaker Printer** → **Custom** → **Custom FFF Printer**
3. Name it after your printer (e.g., "Voron 2.4 350mm")

### Step 2: Configure Machine Settings

**Printer tab:**
- **Printer type**: FFF (Fused Filament Fabrication) or delta
- **X/Y/Z width**: Your printer's build volume in mm
- **Build plate shape**: Rectangular or Circular
- **Origin at center**: No for most Cartesian/CoreXY, Yes for delta

**Extruder tab:**
- **Nozzle size**: 0.4 mm (standard), 0.6 mm, 0.8 mm
- **Compatible material diameter**: 1.75 mm (standard) or 2.85 mm
- **Number of extruders**: 1 for single-extruder, 2+ for multi-extruder or AMS/MMU setups

### Step 3: Configure Start/End G-code

The default G-code in Cura's custom printer profile is generic. You need to replace it with your printer's specific initialization sequence.

**Example Start G-code for a Klipper printer:**
```
START_PRINT BED_TEMP={material_bed_temperature_layer_0} EXTRUDER_TEMP={material_print_temperature_layer_0}
```

**Example End G-code:**
```
END_PRINT
```

Cura uses placeholder variables like `{material_bed_temperature_layer_0}` that are replaced with actual values during slicing. The full list of available placeholders is in Cura's documentation.

### Step 4: Configure Print Settings

After adding the printer, Cura displays recommended print profiles. For custom printers, these are generic and need tuning:

1. Switch to **Custom** settings view
2. Configure **Layer Height** (0.2 mm is a good starting point)
3. Set **Print Speed** (50-100 mm/s for most printers)
4. Configure **Retraction** settings based on your extruder type
5. Set **Bed Temperature** and **Printing Temperature** for your filament

## Managing Print Profiles

Cura's profile system can be confusing. Here's how it works:

### Profile Hierarchy

Cura uses a three-tier profile system:
1. **Quality profile**: Layer height and general print quality settings
2. **Material profile**: Temperature, retraction, and flow settings specific to the filament
3. **Printer profile**: Machine-specific settings like bed size and G-code

These three combine to produce the final print settings. Changing one layer doesn't affect the others.

### Creating Custom Profiles

1. Configure all settings to your liking
2. Go to **Preferences → Profiles** (or Ctrl+J)
3. Click **Create Profile from Current Settings**
4. Name the profile and select which settings to include
5. The profile appears in your profile list for future use

Cura's documentation notes: "Managing your profiles can be done in the Profiles tab of the Preferences menu."

### Importing and Exporting Profiles

- **Export**: Right-click a profile in the profile list → Export
- **Import**: Preferences → Profiles → Import
- Profiles are stored as .curaprofile files

### Profile Storage Location

On Windows, Cura profiles are stored in:
```
%APPDATA%\cura\<version>\
```

This directory contains all printer definitions, material profiles, and quality profiles. You can back up this directory or copy it to another machine.

## Useful Cura Plugins

Cura's marketplace is one of its biggest advantages over other slicers. Here are the plugins we consider essential:

### Settings Guide
Provides hover-over explanations for every setting in Cura. Essential for understanding what each parameter does without leaving the slicer. UltiMaker themselves recommend this plugin.

### Mesh Tools
Adds mesh manipulation tools including:
- Measure distances between points on the model
- Split model into parts
- Align models to the bed
- Rotate models precisely

### Cura Backups
Syncs your profiles and settings to UltiMaker's cloud. Useful if you work across multiple machines or want a backup of your configuration.

### Auto Orientation
Automatically orients models to minimize support material. Wraps the MeshLab orientation algorithm to find the optimal rotation for each model.

### Print Calibration
Generates calibration patterns directly in Cura — temperature towers, retraction tests, flow rate calibration. Saves you from downloading separate test models.

### Change Resolution
Allows you to adjust the mesh resolution of imported models directly in Cura. Useful for high-poly models that are slowing down slicing.

### Custom Supports
Adds the ability to paint custom support areas directly on the model, similar to PrusaSlicer's support painting tool. This is particularly useful for models where auto-generated supports are too aggressive or not aggressive enough.

### Post Processing Scripts
Allows you to modify G-code after slicing. Common uses:
- Add pause commands at specific layers for filament changes
- Modify retraction settings in the G-code
- Add custom G-code commands at specific points

## Tips for Non-UltiMaker Printers

1. **Start with a known-good profile**: If your printer manufacturer provides Cura profiles, use those as a starting point rather than configuring from scratch
2. **Calibrate E-steps first**: Ensure your extruder is pushing the correct amount of filament before tuning flow rate
3. **Test with a calibration cube**: Print a simple 20mm cube to verify dimensional accuracy and surface quality
4. **Save profiles per filament**: Create a profile for each filament type/brand — PLA, PETG, ABS, and TPU all need different settings
5. **Use the marketplace**: Install Settings Guide and Custom Supports plugins — they significantly improve the Cura experience

## Cura vs Other Slicers for Non-UltiMaker Printers

Cura has the largest plugin ecosystem and the most extensive marketplace among open-source slicers. However, for specific printer brands:
- **Prusa printers**: PrusaSlicer is better integrated
- **Bambu printers**: Bambu Studio is required for AMS features
- **Voron/custom CoreXY**: OrcaSlicer has better built-in calibration tools

Cura's strength is its flexibility — it works with more printer models than any other slicer and has the most extensive plugin ecosystem.

## Summary

Cura works well with non-UltiMaker printers through its custom printer system. The key steps are adding a custom printer, configuring bed size and G-code, and creating tuned print profiles for each filament. Install the Settings Guide plugin for in-slicer documentation, Custom Supports for manual support painting, and Print Calibration for built-in calibration patterns. Cura's marketplace and plugin ecosystem give it an advantage over other slicers for users who work with multiple printer brands.
