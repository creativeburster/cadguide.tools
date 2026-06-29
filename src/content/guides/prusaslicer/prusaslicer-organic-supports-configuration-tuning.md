---
title: "PrusaSlicer Organic Supports: Configuration, Tuning, and When to Use Them"
excerpt: "Organic supports in PrusaSlicer generate tree-like branching structures that reduce material waste and print time while minimizing contact marks. I cover the key settings — branch angle, diameter, distance, and pattern — and explain when organic supports outperform traditional grid supports."
category: "workflow"
softwareSlug: "prusaslicer"
keyword: "PrusaSlicer organic supports configuration tuning settings"
slug: "prusaslicer-organic-supports-configuration-tuning"
author: "CAD IT Admin"
readTime: "9 min"
date: "2025-06-22"
sources:
  - "https://help.prusa3d.com/article/organic-supports_480131"
  - "https://clevercreations.org/prusaslicer-organic-supports-tree/"
  - "https://github.com/bambulab/BambuStudio/issues/2420"
  - "https://www.reddit.com/r/prusa3d/comments/13419bu/what_are_your_favorite_settings_for_organic/"
---

# PrusaSlicer Organic Supports: Configuration, Tuning, and When to Use Them

I've spent hundreds of hours printing miniatures, organic models, and mechanical parts with overhangs, and PrusaSlicer's Organic Supports have fundamentally changed how I approach support generation. Since their introduction in PrusaSlicer 2.6, organic supports have replaced traditional grid supports for most of my work — but they require careful configuration to get right.

## What Are Organic Supports?

PrusaSlicer's Organic Supports use an algorithm (based on Thomas Lindström's work) to generate tree-like branching structures that grow upward and outward toward the overhang areas they need to support. Unlike traditional grid or snail supports, which build a solid column directly below the overhang, organic supports branch out from a narrow base and spread toward the areas needing support.

The key advantages are:
- **Less material waste** — the branching structure uses significantly less filament than a full grid
- **Easier removal** — thinner contact points mean less scarring on the model surface
- **Shorter print time** — less material means faster prints, often 20-40% faster than grid supports for the same model
- **Less interference** — branches can route around model features instead of colliding with them

PrusaSlicer's official documentation describes them as "a type of support structure" that uses "a branching pattern to minimize the contact area with the model and reduce material usage."

## Enabling Organic Supports

In PrusaSlicer, organic supports are selected under **Print Settings → Support material → Support structure**. Choose **Organic** from the dropdown. The option appears alongside **Normal** (grid-based) and **Snail** (a hybrid approach).

Once selected, a new set of organic-specific parameters becomes available in the support settings section. These are the settings I tune most frequently.

## Key Settings for Organic Supports

### Branch Angle

This is the maximum angle at which a branch can deviate from vertical. The default is **30°**, which works well for most models. Increasing it to **40-50°** allows branches to reach further outward, which is useful for wide overhangs — but branches that lean too far can become unstable during printing.

I keep the default 30° for miniatures and organic models. For mechanical parts with wide horizontal overhangs, I increase to 40°.

### Branch Diameter

The base diameter of each branch. Default is **5 mm** for a 0.4 mm nozzle. Thicker bases are more stable but harder to remove and leave more visible marks. Thinner bases save material but can be fragile.

For small miniatures, I reduce this to **3-4 mm**. For large architectural models, I keep the default 5 mm or increase to 6 mm for stability.

### Branch Diameter at Top

This controls how thin the branch tapers before reaching the overhang. Default is **2 mm**. A thinner tip means less contact mark but less support strength. I keep the default for most prints and reduce to 1.5 mm for display models where surface quality is critical.

### Branch Distance

The distance between individual branch starting points on the build plate. Default is **1 mm**. Reducing this creates more branches (denser support) and increasing it creates fewer. For light overhangs, I increase to 2-3 mm. For heavy overhangs or steep angles, I keep 1 mm.

### Distance from Object

This is the vertical gap between the top of the support and the model surface. Default is **0.2 mm** for a 0.2 mm layer height. This is critical — too small and the support fuses to the model, too large and the overhang sags.

My rule of thumb: set this to **one layer height**. For 0.15 mm layers, use 0.15 mm. For 0.2 mm layers, use 0.2 mm.

### Pattern

The internal fill pattern of the branches. **Concentric** is the default and works well for most cases. **Rectilinear** can provide slightly stronger supports but is harder to remove.

## When to Use Organic vs Normal Supports

Organic supports excel with:
- **Organic models** (miniatures, busts, sculptures) — the branching structure follows curved surfaces naturally
- **Models with isolated overhangs** — branches can reach specific areas without covering the entire underside
- **Display models** where surface finish matters — smaller contact points mean less cleanup

Normal (grid) supports are better for:
- **Large flat overhangs** — a solid grid provides more uniform support than branches for horizontal surfaces
- **Mechanical parts** where support removal must be clean and predictable
- **Very steep overhangs** (approaching horizontal) — grid supports are more rigid

A community discussion on the Prusa forum highlights a common issue: "Organic supports sometimes overlap with the model and cause scarring on steep overhangs." This happens when the branch angle is too aggressive for the geometry. If you see this, reduce the branch angle to 25° or switch to normal supports for that specific area.

## Tuning Workflow I Use

1. **Start with defaults** — load your model, enable organic supports, and slice with default settings
2. **Preview the support structure** — use the layer view in PrusaSlicer to inspect how branches reach the overhangs
3. **Check for collisions** — look for branches that pass through the model (reduce branch angle if needed)
4. **Check contact points** — zoom in on the support-model interface and verify the gap is consistent
5. **Adjust and re-slice** — iterate on branch angle, diameter, and distance until the preview looks clean

## Common Issues and Fixes

### Branches Detaching During Print

This usually means the branch base is too small or the branch angle is too steep. Increase branch diameter to 6 mm or reduce the branch angle to 25°. Also check that your build plate adhesion is adequate — a brim or raft can help stabilize branch bases.

### Support Fused to Model

The distance from object is too small. Increase it by 0.05 mm increments until the support separates cleanly. Also ensure your filament isn't overheating — higher temperatures make supports stick more.

### Scarring on Model Surface

This is the most common complaint with organic supports. The fix is to reduce the branch diameter at top to 1.5 mm and increase the distance from object slightly. Some users on Reddit report that switching to concentric pattern also reduces scarring compared to rectilinear.

### Support Not Reaching Overhang

If branches don't reach a specific overhang area, increase the branch angle to allow more lateral reach, or add a custom support enforcer manually using PrusaSlicer's paint-on support tool.

## Comparison with Other Slicers

PrusaSlicer's organic supports are widely considered the best implementation among open-source slicers. A GitHub issue from the Bambu Studio project specifically requests "organic supports like PrusaSlicer" because Bambu Studio's tree supports "often overlap with the model and cause scarring." Cura's tree supports are similar but lack the fine-tuning parameters that PrusaSlicer exposes.

## Summary

Organic supports in PrusaSlicer are my default choice for most prints with overhangs. The key to success is understanding the branch angle, diameter, and distance settings — and iterating based on the layer preview before printing. For models where organic supports don't work well (large flat overhangs, mechanical parts), switching to normal supports is a one-click change. The time and material savings from organic supports are significant enough that I recommend trying them first on every model with support requirements.
