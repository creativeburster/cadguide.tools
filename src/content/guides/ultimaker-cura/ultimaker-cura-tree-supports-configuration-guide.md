---
title: "UltiMaker Cura Tree Supports: Configuration, Branch Settings, and When to Use Them"
excerpt: "Cura's tree supports generate branching structures that reduce material waste and model scarring compared to standard grid supports. I cover the key branch settings — maximum angle, diameter, branch density, and collision resolution — plus when tree supports outperform normal supports and how to use the new Xmas tree variant."
category: "workflow"
softwareSlug: "ultimaker-cura"
keyword: "UltiMaker Cura tree supports configuration branch settings guide"
slug: "ultimaker-cura-tree-supports-configuration-guide"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://support.makerbot.com/s/article/1667417606331"
  - "https://3dsearch.app/blog/how-to-use-tree-supports"
  - "https://ultimaker.com/learn/special-alpha-new-xmas-tree-supports-for-ultimaker-cura/"
  - "https://store.anycubic.com/blogs/3d-printing-guides/how-to-use-tree-supports-in-cura"
---

# UltiMaker Cura Tree Supports: Configuration, Branch Settings, and When to Use Them

I've used Cura's tree supports extensively for miniature printing, organic models, and parts with complex overhangs. Cura was the first major slicer to implement tree supports, and its implementation remains one of the most configurable. This guide covers the key branch settings — the difference between supports that peel off cleanly and supports that fuse to your model or collapse mid-print.

## What Are Tree Supports?

Unlike normal supports that build a solid grid directly below overhangs, tree supports grow branching structures from the build plate that reach upward and outward toward the areas needing support. The branches can angle around model features, minimizing contact with the model surface.

Cura's official documentation describes them: "Tree support creates branches that grow around your 3D model. The benefits of this alternative include reduced print time and less scarring of the model."

The trade-off is longer slicing time — the tree support algorithm is computationally intensive, especially for complex models.

## Enabling Tree Supports

In Cura, enable tree supports via:
1. Switch to **Custom** print settings (not Recommended)
2. Open the **Support** category
3. Set **Support Structure** to **Tree**

Once enabled, a new set of tree-specific parameters appears.

## Key Tree Support Settings

### Support Placement

- **Touching Buildplate**: Supports only grow from the build plate upward. No supports rest on the model surface. This produces fewer supports, saves material, and leaves no marks on vertical surfaces.
- **Everywhere**: Supports can rest on the model surface as well as the build plate. Necessary for models with internal cavities or overhangs that can't be reached from the build plate.

I start with "Touching Buildplate" and switch to "Everywhere" only if the preview shows unsupported overhangs.

### Branch Diameter

Controls the thickness of individual branches. Default is around **2 mm** for a 0.4 mm nozzle. Thicker branches are more stable but leave larger contact marks. Thinner branches save material but may snap.

- **Miniatures**: 1.5-2 mm
- **Medium models**: 2-3 mm
- **Large/heavy models**: 3-5 mm

### Branch Diameter Angle

Controls how quickly branches thicken toward the base. Default is **5°**. Higher values create wider, sturdier trunks. Lower values maintain a more uniform diameter.

- **0°**: Constant diameter — looks like columns, less stable
- **3-5°**: Good balance for most models
- **7-10°**: Wide base, very stable but uses more material

### Maximum Branch Angle

The maximum angle branches can deviate from vertical. Default is **50°** in Cura (note: this is measured from vertical, not from horizontal). Higher values allow branches to reach further sideways but are less stable.

Cura's documentation states: "An overhang angle of 40° is considered reliable." I keep this at **40-50°** for most prints.

### Preferred Branch Angle

The angle branches use when they don't need to avoid the model. Lower values mean more vertical (more stable) growth; higher values allow faster merging of branches.

### Branch Density

Controls how dense the support structure is at the tips of branches. Higher values produce better overhang quality but make supports harder to remove. I use the default for most prints and increase it for models with critical overhang surfaces.

### Tip Diameter

The diameter at the very tip of each branch where it contacts the model. Smaller tips leave less scarring but provide less support. Default is around 0.8-1 mm.

### Collision Resolution

Controls how accurately the tree avoids the model. Lower values are more accurate but slower to slice. Default is **0.15 mm**. I keep the default — the slicing time increase from lower values is rarely worth the marginal improvement.

### Limit Branch Reach

When enabled, limits how far each branch travels from the point it supports. This makes supports sturdier but generates more branches, increasing material usage and print time.

## The New Xmas Tree Supports

UltiMaker released a special alpha version of Cura (5.3.0 Alpha) with improved tree supports developed by community contributor Thomas Rahm. UltiMaker's announcement states: "These new tree supports use significantly less filament than our current version. Where our current tree supports have a tendency to merge multiple branches into one larger branch, these trees have a different shape and have more smaller branches that are able to reach tricky corners."

Key improvements:
- **Less filament usage** — smaller, more numerous branches instead of merged trunks
- **Easier removal** — branches release from the model more cleanly
- **Less scarring** — smaller contact points
- **Faster slicing** — multi-threaded slicing computation
- **New settings**: Preferred Branch Angle, Maximum Branch Angle, Diameter Increase to Model, Minimum Height to Model, Limit Branch Reach, Rest Preference

These improved tree supports have been integrated into recent stable releases of Cura. If you're running Cura 5.4+, you already have them.

## Support Interface Settings

Regardless of support type (tree or normal), the support interface is critical for overhang quality:

- **Support Interface**: Enable this to add dense layers at the top of the supports where they contact the model
- **Support Interface Density**: 50-70% works well. Higher density improves overhang quality but makes supports harder to remove
- **Support Interface Thickness**: 1-2 layers is sufficient for most cases
- **Support Z Distance**: Equal to one layer height (0.1-0.2 mm). This gap is what allows you to remove supports from the model

## When to Use Tree vs Normal Supports

| Scenario | Recommended Support |
| --- | --- |
| Figurine / miniature | Tree |
| Flat shelf overhang | Normal |
| Internal cavity | Normal (or tree with "Everywhere") |
| Organic sculpture | Tree |
| Quick prototype | Normal (faster to slice) |
| Minimal post-processing | Tree |
| Large heavy overhang | Normal (more stable) |

## Common Issues

### Branches Collapse During Print

- Increase branch diameter to 3-4 mm
- Reduce maximum branch angle to 30-40°
- Increase branch diameter angle to 7-10° for wider bases
- Ensure adequate bed adhesion — a branch that detaches from the bed ruins the print

### Support Fuses to Model

- Increase support Z distance to 0.2-0.3 mm
- Reduce support interface density to 40%
- Reduce tip diameter to 0.6-0.8 mm
- Check filament temperature — too hot makes supports stick

### Slicing Takes Very Long

Tree supports are computationally expensive. For complex models, slicing can take several minutes. To speed up:
- Increase collision resolution to 0.2-0.3 mm
- Use "Touching Buildplate" instead of "Everywhere"
- Reduce branch density

### Tree Supports Don't Reach Overhang

- Increase maximum branch angle to 50-60°
- Switch from "Touching Buildplate" to "Everywhere"
- Use support painting (per-model settings) to manually add supports in specific areas

## Summary

Cura's tree supports are excellent for organic models, miniatures, and any print where support removal and surface finish matter more than slicing speed. The key settings are branch diameter (2-3 mm for most models), maximum branch angle (40-50° for reliability), and support placement (start with "Touching Buildplate"). The improved Xmas tree supports in Cura 5.4+ offer significant material savings and easier removal. For large flat overhangs or quick prototypes where slicing speed matters, normal supports remain the better choice.
