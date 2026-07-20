---
title: "Simplify3D Dual Extrusion Setup: Multi-Color, Soluble Supports, and Ooze Control"
excerpt: "Simplify3D's Dual Extrusion Wizard and per-feature extruder assignment let you print multi-color parts and use soluble support material. We cover the Dual Extrusion Wizard, assigning extruders to specific features, ooze shield and prime pillar configuration, and troubleshooting dual extrusion issues."
category: "workflow"
softwareSlug: "simplify3d"
keyword: "Simplify3D dual extrusion multi-color soluble support ooze shield prime pillar"
slug: "simplify3d-dual-extrusion-multi-color-soluble-support-ooze-control"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-22"
sources:
  - "https://www.simplify3d.com/resources/articles/printing-with-multiple-extruders/"
  - "https://forum.simplify3d.com/viewtopic.php?t=9674"
  - "https://www.simplify3d.com/resources/print-quality-troubleshooting/poor-surface-above-supports/"
---

# Simplify3D Dual Extrusion Setup: Multi-Color, Soluble Supports, and Ooze Control

We've configured dual extrusion setups in Simplify3D for multi-color prints, soluble support workflows, and multi-material parts. The software offers two distinct approaches — the Dual Extrusion Wizard for multi-model prints and per-feature extruder assignment for single-model prints — and understanding when to use each is key to successful dual extrusion printing.

## Two Approaches to Dual Extrusion

### Approach 1: Dual Extrusion Wizard (Multiple Models)

Use this when you want to print two different models in different colors:
1. Import both models into Simplify3D
2. Go to **Tools → Dual Extrusion Wizard**
3. Assign each model to a different extruder
4. The wizard creates separate processes for each model

### Approach 2: Per-Feature Extruder Assignment (Single Model)

Use this when you want different extruders for different parts of a single model (e.g., soluble supports):
1. Open **Edit Process Settings**
2. Set **Auto-Configure Extruders** to "Both Extruders"
3. Assign extruders to specific features in the Layer, Additions, Infill, and Support tabs

Simplify3D's documentation explains: "This workflow is different from the Dual Extrusion Wizard, as it only requires one Process."

## Setting Up Per-Feature Extruder Assignment

### Step 1: Configure Auto-Settings

1. Click **Edit Process Settings**
2. Set **Auto-Configure Extruders** to "Both Extruders"
3. Select the appropriate material combination in **Auto-Configure for Material** (e.g., PLA + PVA)
4. This ensures both extruders are heated and primed at the start

### Step 2: Assign Extruders to Features

Click **Show Advanced** to see all tabs, then assign extruders:

**Layer tab**:
- **Primary Extruder**: Used for perimeters and outer solid layers
- **Infill Extruder**: Used for internal infill

**Additions tab**:
- **Skirt Extruder**
- **Prime Pillar Extruder**
- **Raft Extruder**
- **Ooze Shield Extruder**

**Infill tab**:
- **Infill Extruder**: Can be different from the primary extruder

**Support tab**:
- **Support Extruder**: Which extruder prints support structures
- **Dense Support Extruder**: Which extruder prints dense support layers

### Step 3: Print

Click **Prepare to Print** and the software generates G-code that switches between extruders as needed.

## Ooze Control

When printing with two extruders, the inactive extruder continues to ooze filament while the other is printing. Simplify3D offers two tools to manage this:

### Prime Pillar

- Prints a small solid pillar at the start of each layer
- The inactive extruder extrudes material onto the prime pillar before switching to the active print
- This purges any oozed filament and ensures clean extrusion when the extruder activates
- Enable in the **Additions** tab

### Ooze Shield

- Prints a thin shell around the entire model
- The inactive extruder deposits oozed filament onto the shield instead of the model
- The shield is removed after printing
- Enable in the **Additions** tab
- Particularly useful for models with complex geometry where the prime pillar alone isn't sufficient

## Multi-Color Printing with the Dual Extrusion Wizard

### Step 1: Import Models

1. Import the first model (e.g., a logo's base)
2. Import the second model (e.g., the logo's text)
3. Position them so they align in the 3D view

### Step 2: Run the Wizard

1. Go to **Tools → Dual Extrusion Wizard**
2. Select the first model and assign it to Extruder 1
3. Select the second model and assign it to Extruder 2
4. The wizard creates two processes, one for each model/extruder

### Step 3: Configure Settings

1. Double-click each process to edit settings
2. Set the correct temperature for each material
3. Enable prime pillar or ooze shield in the Additions tab
4. Click **Prepare to Print** and select all processes

## Printing with 3+ Extruders

For printers with three or more extruders:

1. Create a separate process for each extruder
2. For each process:
   - Click **Select Models** to choose which models use this process
   - Set **Auto-Configure Extruders** to "All Extruders"
   - Set the **Primary Extruder** in the Layer tab
   - Set the **Infill Extruder** in the Infill tab
   - Set the **Support Extruder** in the Support tab
3. Click **Prepare to Print** and select all processes

## Common Dual Extrusion Issues

### Warning: Process Not Configured for Number of Extruders

Simplify3D's forum explains: "This warning is generally caused by having the Auto-Configure for Extruder choice set to a single extruder instead of the 'Both Extruders' pre-configuration."

Fix: Change Auto-Configure Extruders to "Both Extruders" (or "All Extruders" for 3+).

### Colors Bleed into Each Other

- Enable **Prime Pillar** to purge the inactive extruder
- Enable **Ooze Shield** to catch oozing filament
- Increase the **Wipe Shield Distance** from the part
- Reduce nozzle temperature slightly to reduce oozing

### Soluble Supports Don't Dissolve Cleanly

- Ensure the support extruder temperature matches the soluble material's requirements
- PVA typically prints at 180-200°C; HIPS at 230-240°C
- Check that the support infill isn't too dense (10-20% is usually sufficient)
- Increase Horizontal Offset to 0.1mm for better separation

### Nozzle Collision During Extruder Switch

- Check that the **G-Code** tab includes proper tool change commands
- Verify the printer's firmware supports the T0/T1 tool change commands
- Add a Z-lift before tool changes in the **G-Code** tab

## Material Combinations

Common dual extrusion material combinations in Simplify3D:

| Primary | Support | Notes |
|---------|---------|-------|
| PLA | PVA | Water-soluble, most popular combination |
| PLA | HIPS | Dissolved in limonene, cheaper than PVA |
| ABS | HIPS | Both dissolve in limonene |
| PETG | PVA | Water-soluble supports for PETG parts |
| PLA | PLA (different color) | Multi-color prints, same material |

## Summary

Simplify3D offers two dual extrusion workflows: the Dual Extrusion Wizard for multi-model multi-color prints, and per-feature extruder assignment for single-model prints with soluble supports. For soluble supports, set Auto-Configure Extruders to "Both Extruders", then assign the support extruder in the Support tab. Always enable prime pillar and/or ooze shield to manage oozing from the inactive extruder. The most common issue — the "process not configured" warning — is fixed by changing the Auto-Configure Extruders setting from single to "Both Extruders". For multi-color prints, use the Dual Extrusion Wizard to assign each model to a different extruder, then select all processes when preparing to print.

Dual extrusion adds complexity but enables capabilities impossible with single extrusion: water-soluble supports for complex geometry, multi-color prints for prototypes and educational models, and multi-material parts combining rigid and flexible filaments. The key to success is managing the inactive extruder — without prime pillar or ooze shield, oozing filament contaminates the print. Start with a simple two-color test print before attempting complex multi-material parts, and always verify that both extruder temperatures are correct for the chosen material combination.
