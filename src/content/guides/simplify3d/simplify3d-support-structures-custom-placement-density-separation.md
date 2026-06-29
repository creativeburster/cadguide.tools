---
title: "Simplify3D Support Structures: Custom Placement, Density, and Separation Settings"
excerpt: "Simplify3D's support structure tools offer manual placement, density control, and separation tuning. I cover the Customize Support Structures window, adding and removing support pillars, separation from part settings, and using a second extruder for soluble supports."
category: "workflow"
softwareSlug: "simplify3d"
keyword: "Simplify3D support structures custom placement density separation settings"
slug: "simplify3d-support-structures-custom-placement-density-separation"
author: "CAD IT Admin"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://www.simplify3d.com/resources/articles/adding-and-modifying-support-structures/"
  - "https://www.simplify3d.com/resources/print-quality-troubleshooting/poor-surface-above-supports/"
  - "https://forum.simplify3d.com/viewtopic.php?t=9674"
---

# Simplify3D Support Structures: Custom Placement, Density, and Separation Settings

I've printed thousands of models with Simplify3D, and the support structure system is one of its strongest features. Unlike many slicers that only offer automatic support generation, Simplify3D lets you manually add, remove, and customize individual support pillars — giving you precise control over where supports go and how they connect to the part.

## Enabling Support Material

1. Open your FFF process settings
2. Go to the **Support** tab
3. Check **Generate Support Material**
4. Click **Prepare to Print** to see the automatically generated supports

Simplify3D's documentation notes: "The software has already added the necessary support structures for the nose, chin, eyebrows, and ears" when printing a model with overhangs.

## The Customize Support Structures Window

For manual control over support placement:

1. Click the **Customize Support Structures** button in the toolbar
2. The 3D view switches to support editing mode
3. Automatically generated supports are shown as pillars
4. You can now add or remove individual support pillars

### Removing Unwanted Supports

1. In the Customize Support Structures window, click **Remove Supports**
2. Click on any support pillar you want to remove
3. The pillar disappears immediately
4. This is useful for supports in areas that don't actually need them

### Adding Custom Supports

1. Click **Add Supports**
2. Click on the model surface where you want a new support pillar
3. The pillar extends from the build plate to that point
4. Add as many custom pillars as needed
5. Click the button a second time when finished

## Support Structure Settings

### Automatic Placement

In the Support tab of the FFF settings:
- **Overhang Angle**: The threshold angle for support generation (default 45°). Lower values generate more supports; higher values generate fewer
- **Support Infill Percentage**: Controls support density. 10-20% is typical; higher values for heavy parts, lower for easy removal
- **Support Pattern**: Choose from grid, lines, or concentric patterns

### Separation from Part

The separation settings control how easily supports break away from the finished part. Simplify3D's documentation explains: "Creating removable support structures involves a fine balance between the amount of support provided to the model, and how easy the supports are to remove."

**Upper Vertical Separation Layers**:
- Determines how many empty layers are between the support top and the part bottom
- **0 layers**: Supports bond directly to the part (hard to remove, best surface quality)
- **1-2 layers**: Standard for same-material supports (good balance)
- **0 layers with soluble support**: Perfect — soluble material doesn't bond, so no gap needed

**Horizontal Offset from Part**:
- Controls side-to-side distance between supports and the part wall
- **0.2-0.4mm**: Standard for same-material supports
- **0.1mm**: For soluble supports (can be closer since they dissolve away)
- Increase if supports are hard to remove; decrease if surface quality above supports is poor

### Dense Support

- **Dense Support Layers**: Adds solid layers at the top of the support structure
- Useful for heavy parts that would crush normal sparse supports
- Typically 1-3 dense layers at the support top

## Using a Second Extruder for Soluble Supports

For dual-extruder printers, using a soluble material (PVA, HIPS) for supports produces the best surface quality:

1. Open **Edit Process Settings**
2. Set **Auto-Configure Extruders** to "Both Extruders"
3. Select the appropriate material combination (e.g., PLA + PVA)
4. Go to the **Support** tab
5. Change **Support Extruder** to the extruder with soluble material
6. Change **Dense Support Extruder** to the same
7. Reduce **Upper Vertical Separation Layers** to 0 (soluble supports don't bond)
8. Reduce **Horizontal Offset** to 0.1mm

Simplify3D's documentation states: "If you are using a different material for the support structures, you can frequently decrease your Upper Vertical Separation Layers to zero, and reduce your Horizontal Offset from the part to around 0.1mm."

A forum contributor adds: "You don't need to use the dual extrusion wizard if you just want to change the extruder used for supports. Just set the extruder configuration to 'Both Extruders', go to the Supports tab and change the support extruder."

## Poor Surface Quality Above Supports

If the surface above supports is rough or scarred:

1. **Increase Upper Vertical Separation Layers** to 2-3
2. **Increase Horizontal Offset** to 0.4mm
3. **Reduce layer height** for the section above supports (0.1mm instead of 0.2mm)
4. **Increase support density** — sparse supports can cause sagging
5. **Use soluble support material** if you have a dual extruder
6. **Add dense support layers** (1-3 solid layers at support top)

Simplify3D's troubleshooting guide recommends: "You may improve results if you lower your layer height to 0.1mm. This has the advantage of decreasing print time and reducing the amount of support structures required."

## Support Pillar Settings

Additional settings for fine-tuning support pillars:
- **Pillar Resolution**: Controls the size of circular support pillars (smaller = more precise but slower)
- **Pillar Size**: Diameter of individual support pillars
- **Max Overhang Angle**: Maximum angle the support pillar can deviate from vertical

## Summary

Simplify3D's support system offers both automatic generation and manual customization. Use the Customize Support Structures window to add supports where needed and remove them where they're unnecessary. The key separation settings — Upper Vertical Separation Layers (1-2 for same material, 0 for soluble) and Horizontal Offset (0.2-0.4mm for same material, 0.1mm for soluble) — control the balance between support effectiveness and ease of removal. For dual-extruder printers, using soluble support material (PVA or HIPS) eliminates surface quality issues above supports. Always check the Support tab settings for extruder assignment, infill percentage, and dense support layers before printing complex models.

The manual support editing capability is what sets Simplify3D apart from most other slicers. Being able to remove supports from areas where they're not needed saves material and post-processing time, while being able to add supports to specific overhangs that the automatic algorithm missed prevents print failures. For production printing where consistency matters, save your support settings as part of a process profile so they apply automatically to future prints of the same model. The combination of automatic generation, manual editing, and precise separation control makes Simplify3D's support system one of the most capable available for FDM 3D printing.
