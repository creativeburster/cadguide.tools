---
title: "MatrixGold Jewelry Design Essentials: Builders, Dynamic Commands, and Ring Modeling"
excerpt: "MatrixGold's builders and dynamic commands streamline jewelry CAD design on the Rhino platform. We cover the ring rail system, profile placer, gem setting tools, and the parametric builder workflow for creating production-ready jewelry models."
category: "workflow"
softwareSlug: "matrixgold"
keyword: "MatrixGold jewelry design builders dynamic commands ring modeling profile placer"
slug: "matrixgold-jewelry-design-builders-dynamic-commands-ring-modeling"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-06-22"
sources:
  - "https://www.udemy.com/course/matrixgold-essentials-for-jewelers-video-training-course/"
  - "https://matrixgoldbook.com/product/designing-jewelry-with-matrixgold/"
  - "https://www.coursehero.com/file/161703770/MatrixGold2019TrainingGuidepdf/"
---

# MatrixGold Jewelry Design Essentials: Builders, Dynamic Commands, and Ring Modeling

We've designed hundreds of jewelry pieces in MatrixGold, from simple solitaire rings to complex pave necklaces. MatrixGold is built on Rhino 3D and adds jewelry-specific tools — builders, dynamic commands, and gem setting utilities — that dramatically speed up the design process compared to raw Rhino modeling. Understanding the builder system and dynamic commands is the foundation of efficient MatrixGold workflow.

## MatrixGold vs. Rhino

MatrixGold is a jewelry-specific plugin for Rhino. It provides:
- **Builders**: Parametric tools for common jewelry elements (rings, shanks, prongs, bezels)
- **Dynamic Commands**: Tools that update automatically when parameters change
- **Gem Library**: Accurate gemstone models with proper cuts and proportions
- **Gem Setting Tools**: Automated prong placement, channel creation, pave tools
- **Rendering**: Built-in rendering for metal and gem materials
- **Production Reports**: Metal weight, gem reports, and technical drawings

As the MatrixGold training guide describes: "MatrixGold has been developed specially for jewelry designing and is very easy to learn and work with. Also, it is the one of the best computer-aided-design programs for jewelry design."

## The Ring Rail System

### Creating a Ring Rail

The ring rail is the foundation of most ring designs in MatrixGold:

1. Click **Ring Rail** in the MatrixGold toolbar
2. Choose the ring profile type:
   - **Round**: Standard circular band
   - **Flat**: Flat band profile
   - **Half-round**: D-shaped cross-section
   - **Knife-edge**: Sharp-edged profile
3. Set parameters:
   - **Ring size**: US (1-13), UK (A-Z), or diameter in mm
   - **Profile width**: Width of the band in mm
   - **Profile thickness**: Thickness of the band in mm
4. Click to create the ring rail
5. The ring rail appears as a swept profile around a circle

### Modifying the Ring Rail

1. Select the ring rail
2. The **History** panel shows all parameters
3. Change any parameter and the ring updates automatically
4. This is the power of MatrixGold's dynamic/parametric system — no need to redraw

### Outside Ring Rail vs. Cathedral Ring Rail

- **Outside Ring Rail**: Creates the outer surface of the ring band
- **Cathedral Ring Rail**: Creates a ring with cathedral-style sides that sweep upward toward the center stone
- Both are parametric — adjust size and profile after creation

## Profile Placer

The Profile Placer sweeps a 2D profile along a rail curve:

1. Draw a 2D profile (cross-section shape) using Rhino curves
2. Draw a rail curve (the path to sweep along)
3. Click **Profile Placer**
4. Select the profile, then select the rail
5. MatrixGold sweeps the profile along the rail
6. The result is a 3D solid

### Common Profile Placer Uses

- **Ring shanks**: Sweep a half-round profile along a circular rail
- **Bails**: Sweep a profile along a curved path for pendant bails
- **Chain links**: Sweep profiles along link-shaped rails
- **Decorative elements**: Sweep ornamental profiles along curved paths

### Activate Auto Sweep

When using Profile Placer with the **Activate Auto Sweep** option:
1. The sweep updates automatically when the profile or rail is modified
2. This maintains parametric control over the swept shape
3. Useful for iterative design — adjust the profile and see results immediately

## Gem Setting Tools

### Gem on Curve

1. Draw a curve on the ring or jewelry surface
2. Click **Gem on Curve**
3. Select the curve
4. Choose the gem type (round brilliant, princess, marquise, etc.)
5. Set gem size (e.g., 2mm, 3mm, 4mm)
6. Set spacing between gems
7. MatrixGold places gems along the curve at the specified spacing

### Gem on Ring Rail

1. Select a ring rail
2. Click **Gem on Ring Rail**
3. Choose gem type and size
4. Set the number of gems or spacing
5. Gems are placed on the ring rail automatically
6. The gems follow the ring's curvature

### Gem on Surface

1. Select a surface
2. Click **Gem on Surface**
3. Choose gem type and size
4. Click on the surface where you want gems
5. Or define a grid pattern for pave setting

### Prong Placer

1. After placing gems, click **Prong Placer**
2. Select a gem
3. Choose prong type:
   - **Round prongs**: Standard round prongs
   - **V-prongs**: V-shaped prongs for marquise/pear gems
   - **Bezel**: Bezel setting around the gem
4. Set prong size and height
5. Set number of prongs (4, 6, 8 for round gems)
6. MatrixGold generates prongs at the correct positions around the gem

### Prong on Surface

For placing prongs on a surface (not associated with a specific gem):
1. Click **Prong on Surface**
2. Select the surface
3. Click where you want the prong
4. Set prong parameters

## Gem Cutter

The Gem Cutter removes material from the metal to create seats for gems:

1. Place gems on the model
2. Click **Gem Cutter**
3. Select the gems
4. Select the metal body
5. MatrixGold cuts the gem seats into the metal
6. The gems sit properly in their settings

## Channel Cutter

For channel-set stones:
1. Place gems in a row using Gem on Curve
2. Click **Channel Cutter**
3. Select the gems
4. Select the metal body
5. MatrixGold cuts a channel into the metal for the gems
6. The channel walls hold the gems in place

## Boolean Operations

MatrixGold uses Rhino's Boolean tools for combining and cutting solids:

- **Boolean Union**: Combine two solids into one
- **Boolean Difference**: Subtract one solid from another
- **Boolean Intersection**: Keep only the overlapping volume

### Typical Boolean Workflow

1. Create the ring shank (using Ring Rail)
2. Create the head/prongs (using Prong Placer)
3. Create a gallery (under the stone) if needed
4. **Boolean Union** the shank, head, and gallery
5. Place gems and use **Gem Cutter** to cut seats
6. The result is a single solid ready for 3D printing

## Smart Curve

Smart Curve is a MatrixGold tool for creating smooth curves with control points:

1. Click **Smart Curve**
2. Click points to define the curve
3. The curve automatically smooths between points
4. Use control point editing to refine
5. Smart Curves can be used as rails for Profile Placer or paths for Gem on Curve

## Dynamic Mirror

For symmetrical designs:
1. Create one half of the design
2. Click **Dynamic Mirror**
3. Select the mirror plane
4. MatrixGold creates a mirrored copy
5. Changes to the original update the mirror automatically

## Common Modeling Workflow: Solitaire Ring

1. **Ring Rail**: Create a size 6 round ring rail, 2.5mm wide, 1.5mm thick
2. **Gem on Ring Rail**: Place a 6mm round brilliant at the top center
3. **Prong Placer**: Add 4 round prongs around the gem
4. **Gem Cutter**: Cut the gem seat into the prongs
5. **Boolean Union**: Combine the ring rail and prongs
6. **Gallery**: Add a gallery (open work under the gem) if desired
7. **Check**: Verify the model with Show Edges (no naked edges)
8. **Export**: Export as STL for 3D printing

## Common Modeling Workflow: Pave Ring

1. **Ring Rail**: Create the base ring
2. **Gem on Surface**: Place gems in a grid pattern on the ring top
3. **Prong Placer**: Add small prongs for each gem
4. **Gem Cutter**: Cut seats for all gems
5. **Boolean Union**: Combine all elements
6. **Check**: Verify no naked edges
7. **Export**: Export as STL

## Summary

MatrixGold's builder system and dynamic commands are the foundation of efficient jewelry CAD design. Start with the Ring Rail for ring designs, then use Profile Placer for custom shank shapes. Place gems using Gem on Curve, Gem on Ring Rail, or Gem on Surface. Add prongs with Prong Placer, cut seats with Gem Cutter, and create channels with Channel Cutter. Use Boolean Union to combine all elements into a single solid. The parametric nature of MatrixGold means you can adjust parameters at any time and the model updates automatically. Always check for naked edges before exporting, and use the metal weight and gem report tools for production documentation.
