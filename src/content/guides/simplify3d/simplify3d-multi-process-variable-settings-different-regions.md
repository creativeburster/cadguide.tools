---
title: "Simplify3D Multi-Process Printing: Variable Settings for Different Model Regions"
excerpt: "Simplify3D's Variable Settings Wizard lets you apply different process settings to different height regions of a single model. I cover the multi-process workflow, split locations, continuous printing mode, and practical use cases like changing infill density or layer height mid-print."
category: "workflow"
softwareSlug: "simplify3d"
keyword: "Simplify3D multi-process variable settings wizard different regions model"
slug: "simplify3d-multi-process-variable-settings-different-regions"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://www.simplify3d.com/resources/articles/different-settings-for-different-regions-of-a-model/"
  - "https://www.simplify3d.com/resources/articles/printing-with-multiple-extruders/"
  - "https://forum.simplify3d.com/viewtopic.php?t=9674"
---

# Simplify3D Multi-Process Printing: Variable Settings for Different Model Regions

I've used Simplify3D's multi-process feature extensively for parts that need different settings in different regions — dense infill at the base for strength, low infill at the top for speed, or fine layer heights for visible surfaces and coarse layers for hidden areas. This feature is one of Simplify3D's biggest differentiators compared to other slicers, and understanding how to use it unlocks significant quality and efficiency gains.

## What Is Multi-Process Printing?

Simplify3D's documentation explains: "Experienced users understand improving your print quality is a result of optimizing the settings that are used during the printing process. Different sections of a model may require different settings to achieve the best results. Simplify3D has a unique ability to allow customers to change literally any setting they want for different sections of a model."

Unlike most slicers that apply one set of settings to the entire model, Simplify3D lets you split the model at any Z-height and apply different process settings to each region. This means you can:

- Use **fine layer height** for visible top surfaces and **coarse layer height** for the base
- Use **high infill density** for structural regions and **low infill** for non-critical areas
- Change **print speed** for specific sections that need more detail or strength
- Use **different temperatures** for sections printed with different quality requirements
- Add or remove **support material** for specific regions only

## Using the Variable Settings Wizard

### Step 1: Create a Base Process

1. Import your model into Simplify3D
2. Create an FFF process with your default settings
3. Make sure the process is assigned to your model

### Step 2: Open the Variable Settings Wizard

1. Go to **Tools → Variable Settings Wizard**
2. Select the original process you want to use as a template
3. The wizard shows your model with a horizontal line representing the current split location

### Step 3: Define Split Locations

1. Click on the model at the Z-height where you want settings to change
2. A horizontal line appears, showing where the model will be split
3. You can add multiple split locations (e.g., at 30mm and 60mm for a 100mm model)
4. Each split creates a new process region

As Simplify3D's tutorial describes: "If our Chess Piece model is 100mm tall, but we wanted to use different settings for the top and bottom halves of the model, we would use this wizard to add a single location at 50mm where the settings would begin to change."

### Step 4: Edit Settings for Each Region

1. After the wizard completes, multiple processes appear in the process list
2. Each process is named with a suffix (e.g., "Process1-1", "Process1-2")
3. **Double-click** a process to edit its settings
4. Change any setting — layer height, infill, speed, temperature, supports, etc.
5. Click OK to save

### Step 5: Prepare to Print

1. Click **Prepare to Print**
2. A dialog appears listing all processes
3. Click **Select All** to include all processes
4. Select **Continuous printing** mode
5. Click OK to generate the G-code

Simplify3D's documentation states: "The software will automatically combine the settings for each region of your model into a single print, giving you complete control over the results."

## Verifying Process Ranges

To check which Z-height range each process covers:
1. Double-click a process to open its settings
2. Go to the **Advanced** tab
3. Check the **Start/Stop printing at height** settings
4. These values show the exact Z-range for that process

## Process Grouping

For editing settings across multiple processes simultaneously:
1. Use **Process Grouping** (Tools → Process Grouping)
2. Group processes that should share settings
3. Edit one process in the group — changes apply to all grouped processes
4. This is useful when you want the same infill but different layer heights across regions

## Practical Use Cases

### Use Case 1: Fast Base, Detailed Top

For a miniature or bust where the top needs fine detail but the base is hidden:
- **Process 1 (0-40mm)**: 0.20mm layer height, 15% infill, 60mm/s speed
- **Process 2 (40-80mm)**: 0.10mm layer height, 20% infill, 40mm/s speed
- Result: 50% faster print with fine detail where it matters

### Use Case 2: Strong Base, Light Top

For functional parts that need strength at the bottom but weight reduction at the top:
- **Process 1 (0-20mm)**: 50% infill, 3 perimeters, 220°C
- **Process 2 (20-60mm)**: 15% infill, 2 perimeters, 210°C
- Result: Strong mounting base with lightweight upper structure

### Use Case 3: Support Only Where Needed

For models that only need supports in specific regions:
- **Process 1 (0-30mm)**: Support material enabled
- **Process 2 (30-80mm)**: Support material disabled
- Result: Less support material, easier cleanup, faster print

## Common Issues

### Processes Don't Connect Properly

- Verify split locations are at clean Z-heights (not mid-layer)
- Check that all processes use the same extruder
- Ensure **Continuous printing** mode is selected in the Prepare to Print dialog

### Settings Don't Change at the Expected Height

- Check the **Start/Stop printing at height** values in the Advanced tab
- The split location in the wizard may not exactly match the layer boundary
- Adjust the start/stop heights manually if needed

### Warning: Process Not Configured for Number of Extruders

As Simplify3D's forum explains: "This warning is generally caused by having the Auto-Configure for Extruder choice set to a single extruder instead of the 'Both Extruders' pre-configuration."

Fix: Change the Auto-Configure Extruders setting to "Both Extruders" (or "All Extruders" for 3+ extruder setups).

## Profiles vs. Processes

A common source of confusion for new Simplify3D users is the distinction between profiles and processes. A forum contributor explains: "Profiles are entire sets of settings meant for a printer. A process is an application of those settings to your model(s)/regions."

- **Profile**: Printer-specific settings (bed size, firmware, extruder count)
- **Process**: Model-specific settings (layer height, infill, speed, supports)
- When you edit a process, the profile is not modified
- Use "Update Profile" only if you want to save process settings as new defaults

## Summary

Simplify3D's multi-process printing is a powerful feature that lets you apply different settings to different Z-height regions of a single model. Use the Variable Settings Wizard (Tools → Variable Settings Wizard) to define split locations, then double-click each process to customize settings for that region. Always select "Continuous printing" mode when preparing to print with multiple processes. The most common use cases are fine detail on visible surfaces with fast printing on hidden areas, strong bases with lightweight tops, and region-specific support material. Understanding the distinction between profiles (printer settings) and processes (model settings) is essential for effective multi-process workflows.
