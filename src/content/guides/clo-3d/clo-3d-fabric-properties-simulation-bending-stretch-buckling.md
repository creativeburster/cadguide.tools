---
title: "CLO 3D Fabric Properties and Simulation: Bending, Stretch, Buckling, and Density Tuning"
excerpt: "CLO 3D's fabric physical properties — bending, stretch, buckling, and density — determine how digital garments drape and behave. I cover each property with recommended values for common fabric types, the Fabric Kit measurement workflow, and simulation settings for production-quality results."
category: "workflow"
softwareSlug: "clo-3d"
keyword: "CLO 3D fabric properties simulation bending stretch buckling density"
slug: "clo-3d-fabric-properties-simulation-bending-stretch-buckling"
author: "CAD IT Admin"
readTime: "11 min"
date: "2025-06-22"
sources:
  - "https://support.clo3d.com/hc/en-us/articles/30201166554649-Edit-Simulation-Properties"
  - "https://support.clo3d.com/hc/en-us/articles/360041074334-Fabric-Kit-Manual"
  - "https://www.zealousxr.com/blog/clo3d-beginners-guide-fashion-designers"
  - "https://www.wearview.co/blog/clo3d-vs-marvelous-designer"
---

# CLO 3D Fabric Properties and Simulation: Bending, Stretch, Buckling, and Density Tuning

I've worked with CLO 3D across fashion collections and technical apparel design, and getting fabric properties right is the single most important factor in producing digital garments that look and behave like real fabric. CLO 3D shares its core simulation engine with Marvelous Designer, but the fashion-focused workflow and Fabric Kit integration make the property tuning process more precise and production-oriented.

## Core Fabric Physical Properties

CLO 3D's fabric properties are based on real-world textile physics. Each property can be set independently for warp (along the grain) and weft (across the grain) directions, simulating the anisotropic behavior of woven fabrics.

### Stretch

Stretch measures how much the fabric elongates under tension. CLO's documentation states: "How much the fabric stretches. The lower the number the more elastic it becomes. Most fabrics have a stretch value of 0~66."

- **Non-stretch fabrics (silk, cotton, wool)**: 0-5
- **Slight stretch (blends, some knits)**: 10-30
- **Stretch fabrics (jersey, ponte)**: 30-50
- **High stretch (swimwear, activewear)**: 50-66

Stretch is measured separately for warp and weft. Many woven fabrics have near-zero stretch in both directions, while knits stretch more in the weft (cross-grain) direction.

### Bending

Bending controls fabric stiffness — how resistant the fabric is to being folded or creased. This is the property I tune most frequently.

- **Very soft (silk chiffon, organza)**: 5-20
- **Soft (silk, lightweight cotton)**: 20-50
- **Medium (cotton poplin, linen)**: 50-100
- **Stiff (denim, wool coating)**: 100-200
- **Very stiff (canvas, heavy wool)**: 200+

CLO's Fabric Guide illustrates the difference: "Bending_10" produces a fabric that drapes with many small folds, while "Bending_70" produces a fabric with fewer, larger folds.

### Buckling

Buckling controls the shape of fabric creases. This is a unique property that distinguishes how woven and knit fabrics form wrinkles.

CLO's documentation explains:
- **Woven fabrics**: Ratio 90, Stiffness 10-20 (sharp, defined creases)
- **Knit fabrics**: Ratio 90, Stiffness 80-90 (soft, rounded creases)

Buckling stiffness determines how sharply creases form. Lower values create softer, more rounded wrinkles. Higher values create sharp, defined crease lines.

### Density

Density is the fabric's weight per unit area, measured in grams per square millimeter. The formula is:

```
Density = A / (B × C)
```

Where A is weight in grams, B is width in mm, C is length in mm.

- **Lightweight (silk, chiffon)**: 0.00001-0.00003
- **Medium (cotton, linen)**: 0.00003-0.00008
- **Heavy (denim, wool coat)**: 0.00008-0.00015

Density affects how gravity influences the fabric. Heavier fabrics fall faster with longer, heavier folds. Lighter fabrics float with more numerous, smaller folds.

## Using the CLO Fabric Kit

For production-accurate fabric properties, CLO offers a physical Fabric Kit that measures real fabric samples:

### What the Kit Measures
1. **Fabric weight and thickness**: Using a precision scale and caliper
2. **Bending strength**: Measured for weft, warp, and bias directions
3. **Stretch**: Force-distance curves using a digital force gauge

### Measurement Process

The Fabric Kit includes fabric swatches cut to 220mm × 30mm in three directions (weft, warp, bias). The bending test measures how much the swatch resists bending under its own weight. The stretch test uses a digital force gauge to measure force at each 10mm increment of stretch.

CLO's documentation recommends: "You will need a minimum of 3 sets and a maximum of 5 sets for each swatch. We recommend that you fill out all five sections as possible because when you have more measurements, data is more accurate."

### Entering Measurements in CLO

1. Switch to **Emulator Mode** (top-right dropdown)
2. Enter the measured values for weight, thickness, bending (weft/warp/bias), and stretch
3. CLO generates a custom fabric property set based on the real fabric data
4. Save the fabric to your library for future use

CLO's documentation notes: "Applying Fabric files measured with the actual Fabric and CLO Fabric Kit gives the most realistic silhouette."

## Using the Fabric Library

If you don't have the Fabric Kit, use CLO's built-in Fabric Library:

1. Open the Fabric Library (Window → Fabric Library)
2. Browse fabrics by type (woven, knit, non-woven)
3. Hover over a fabric to see its physical properties
4. Select the fabric closest to your target material
5. Apply it to your garment

CLO's guide advises: "If there is no actual fabric, use the most similar fabric from the Library. Check the contents by placing the cursor on the fabric in the Fabric Library."

## Texture and Normal Maps

### Normal Maps

Normal maps add surface detail that simulates fabric texture (weave patterns, knit structure, surface roughness). CLO's documentation states: "Normal Map helps express the realistic uneven texture of the fabric with shadows."

CLO includes default normal maps for common fabric types. To apply:
1. Select the fabric in the Property Editor
2. Navigate to the Normal Map section
3. Browse for and open the normal map image

### Texture DPI

When editing fabric textures in external software (Photoshop, etc.), maintain consistent DPI:

CLO's guide warns: "Ensure that the DPI of the image is set after editing the texture, to the same DPI of the original scan. It can be loaded at a different scale if the DPI of the scanned texture was modified while editing."

If the original scan is 300 DPI, the edited texture must also be 300 DPI. A mismatch causes the texture to appear at the wrong scale on the garment.

### Grainline and Texture Rotation

CLO's documentation notes: "If the grainline is modified for the texture rotation, the physical properties of the garment will be changed as well." Rotating the grainline to align texture patterns also rotates the fabric's anisotropic properties (warp/weft direction), which affects how the fabric drapes.

## Simulation Settings

### Simulation Modes

CLO offers three simulation modes:
- **Normal**: Standard simulation for most garments. Balanced speed and accuracy
- **Fitting**: Higher accuracy simulation for fitted garments. Uses nonlinear simulation for more realistic results
- **GPU**: Uses GPU acceleration for faster simulation. Good for iterative design

### Particle Distance

Particle distance controls mesh resolution — the distance between vertices in the simulated mesh:
- **20-30**: High resolution, detailed wrinkles. Slow simulation
- **5-10**: Medium resolution. Good balance for most work
- **1-5**: Low resolution. Fast but minimal wrinkling

I work at particle distance 15-20 for initial design, then reduce to 5-8 for final simulation.

### Advanced Simulation Properties

CLO's simulation settings include:

- **Time Step**: Smaller values = more accurate but slower. Use defaults
- **CG Iteration Count/Residual**: Controls the conjugate gradient solver accuracy. Iteration is faster, residual is more accurate
- **Self Collision Iteration Count**: More iterations = better collision detection but slower
- **Air Damping**: Simulates air resistance on the fabric
- **Gravity**: Default is real-world gravity. Reduce for weightless effects
- **Nonlinear Simulation**: More realistic but slower. Enabled for Fitting mode

CLO recommends: "Please use the default values" for most simulation properties.

## Recommended Fabric Property Combinations

### Silk Blouse
- Stretch: 0 (warp), 0 (weft)
- Bending: 15 (warp), 15 (weft)
- Buckling: Ratio 90, Stiffness 15
- Density: 0.00002
- Shear: 50

### Cotton T-Shirt (Jersey Knit)
- Stretch: 20 (warp), 40 (weft)
- Bending: 30 (warp), 30 (weft)
- Buckling: Ratio 90, Stiffness 85
- Density: 0.00004
- Shear: 80

### Denim Jeans
- Stretch: 2 (warp), 5 (weft)
- Bending: 120 (warp), 100 (weft)
- Buckling: Ratio 90, Stiffness 15
- Density: 0.00010
- Shear: 40

### Wool Coat
- Stretch: 0 (warp), 2 (weft)
- Bending: 150 (warp), 130 (weft)
- Buckling: Ratio 90, Stiffness 20
- Density: 0.00012
- Shear: 35

## Summary

Fabric properties in CLO 3D are the foundation of realistic digital garment simulation. The four key properties — stretch, bending, buckling, and density — should be set based on real fabric data (using the Fabric Kit) or the closest match from CLO's Fabric Library. Bending is the most frequently tuned property and controls fabric stiffness. Buckling distinguishes woven (sharp creases) from knit (soft creases) behavior. Always apply normal maps for surface texture detail, and maintain consistent DPI when editing textures. For production work, use the Fabric Kit to measure real fabric samples and enter the data in Emulator Mode for the most accurate simulation results.
