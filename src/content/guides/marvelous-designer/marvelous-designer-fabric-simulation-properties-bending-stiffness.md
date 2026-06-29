---
title: "Marvelous Designer Fabric Simulation Properties: Bending, Stiffness, and Wrinkle Control"
excerpt: "Marvelous Designer's fabric simulation properties control how cloth behaves during simulation. I cover the key physical properties — bending, shear, stretch, density, and pressure — with practical recommendations for different fabric types from silk to denim, and how to tune them for realistic wrinkling."
category: "workflow"
softwareSlug: "marvelous-designer"
keyword: "Marvelous Designer fabric simulation properties bending stiffness wrinkling"
slug: "marvelous-designer-fabric-simulation-properties-bending-stiffness"
author: "CAD IT Admin"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://support.marvelousdesigner.com/hc/en-us/articles/47358125463321-Simulation-Properties"
  - "https://support.marvelousdesigner.com/hc/en-us/articles/47358432358809-FABRIC-PHYSICAL-PROPERTIES-Adjust-Bending-Weft-Warp"
  - "https://polycount.com/discussion/218320/marvelous-designer"
---

# Marvelous Designer Fabric Simulation Properties: Bending, Stiffness, and Wrinkle Control

I've spent years creating digital garments for game characters and cinematic renders, and Marvelous Designer's fabric simulation properties are the single most important factor in achieving realistic cloth behavior. The difference between a garment that looks like stiff cardboard and one that drapes like real fabric comes down to understanding and tuning these physical properties.

## Understanding Fabric Physical Properties

Marvelous Designer assigns physical properties to each fabric in your garment. These properties determine how the fabric behaves during simulation — how it drapes, wrinkles, stretches, and responds to gravity and collision.

The properties are organized into categories accessible via the **Property Editor** when a pattern piece is selected in the 2D window. Each property can be set independently for the warp (along the fabric length) and weft (across the fabric width) directions, simulating the anisotropic behavior of real woven fabrics.

## Key Physical Properties

### Bending (Weft/Warp)

This is the most important property for controlling fabric stiffness. Marvelous Designer's documentation states: "Use Bending intensity which is the resistant against being bent, to adjust the stiffness of fabric. The higher the value, the stiffer the fabric."

Bending controls how easily the fabric folds and creases:
- **Low bending (10-50)**: Soft, flowing fabrics like silk and chiffon. Lots of small wrinkles and folds
- **Medium bending (50-150)**: Everyday fabrics like cotton and linen. Moderate wrinkling
- **High bending (150-500)**: Stiff fabrics like denim and canvas. Few, large folds
- **Very high bending (500+)**: Rigid materials like leather and heavy wool. Minimal folding

I always set bending separately for warp and weft when I want realistic fabric behavior. Real fabrics often have different stiffness along the grain vs. across it.

### Shear (Weft/Warp)

Shear controls how much the fabric deforms when the warp and weft threads slide against each other. This is what allows fabric to conform to curved surfaces like shoulders and hips.

- **Low shear**: Fabric resists diagonal deformation — stiff, doesn't drape well
- **High shear**: Fabric deforms easily diagonally — flows over curves naturally

For most garments, I keep shear moderate (50-100). Too high and the fabric looks rubbery; too low and it won't conform to the body.

### Stretch (Weft/Warp)

Controls how much the fabric elongates under tension. This is critical for fitted garments and stretch fabrics.

- **Non-stretch fabrics (silk, cotton, denim)**: Stretch at 0-5
- **Slight stretch (wool, some blends)**: Stretch at 10-30
- **Stretch fabrics (jersey, spandex blend)**: Stretch at 50-100
- **High stretch (swimwear, activewear)**: Stretch at 100+

### Density

The weight of the fabric per unit area. This affects how gravity influences the fabric during simulation.

- **Light fabrics (silk, chiffon)**: 10-30 g/m²
- **Medium fabrics (cotton, linen)**: 100-200 g/m²
- **Heavy fabrics (denim, wool coat)**: 300-500 g/m²

Higher density fabrics fall faster and create longer, heavier folds. Lower density fabrics float and create more numerous, smaller folds.

### Pressure

Controls internal pressure within the garment, simulating the effect of air or padding. This is useful for puffy jackets, balloons, and inflated objects.

- **0**: No pressure (default for most garments)
- **Positive values**: Inflate the garment outward
- **Negative values**: Pull the garment inward (rarely used)

### Thickness

The physical thickness of the fabric. This affects collision detection and how layers of fabric interact.

- **Thin fabrics (silk, lining)**: 0.1-0.3 mm
- **Medium fabrics (cotton, wool)**: 0.5-1.0 mm
- **Thick fabrics (denim, coat wool)**: 1.5-3.0 mm

### Friction

Controls how much the fabric resists sliding against itself and other surfaces. High friction prevents layers from sliding (good for stacked garments); low friction allows smooth layering.

- **Smooth fabrics (silk, satin)**: Friction at 10-30
- **Medium fabrics (cotton)**: Friction at 30-50
- **Rough fabrics (wool, denim)**: Friction at 50-80

## Using Physical Property Presets

Marvelous Designer includes built-in presets for common fabric types. These are excellent starting points:

- **Silk Charmeuse**: Very low bending, high shear, low density
- **Cotton Twill**: Medium bending, medium shear, medium density
- **Denim**: High bending, low shear, high density
- **Wool Coating**: High bending, medium shear, high density
- **Leather**: Very high bending, very low shear, high density

A Polycount forum discussion notes: "I tried different material presets, but they didn't seem to have much of an effect." This is a common complaint — the presets change the properties, but if your simulation resolution is too low, the differences won't be visible.

## Simulation Resolution and Mesh Density

Fabric properties only produce visible results when the mesh density is high enough to show the wrinkles and folds they create. If your mesh is too coarse, even silk will look stiff.

- **Low resolution (1-2)**: Fast simulation, minimal wrinkling. Good for initial fitting
- **Medium resolution (3-5)**: Moderate wrinkling. Good for most production work
- **High resolution (6-8)**: Detailed wrinkling. Necessary for close-up renders
- **Very high resolution (9-10)**: Maximum detail. Very slow simulation

I work at resolution 2-3 for initial garment design and fitting, then increase to 5-7 for final simulation and export.

## Tuning Workflow

1. **Start with a preset** closest to your target fabric
2. **Simulate at low resolution** (2-3) to check overall drape and fit
3. **Adjust bending** — this is the property I tune most. Increase for stiffer fabric, decrease for softer
4. **Adjust shear** — increase if the fabric doesn't conform to curves, decrease if it looks rubbery
5. **Adjust density** — increase if the fabric looks too floaty, decrease if it's too heavy
6. **Increase simulation resolution** to 5-7 for final detail
7. **Fine-tune friction** if layer interaction isn't right

## Common Issues

### Fabric Looks Stiff and Unnatural

- Reduce bending values (both weft and warp)
- Increase shear to allow more diagonal deformation
- Increase simulation resolution
- Check that the fabric weight (density) isn't too high

### Fabric Looks Rubbery and Over-Stretched

- Reduce stretch values
- Increase bending slightly
- Reduce shear if the fabric is deforming too much diagonally

### Too Many Wrinkles

- Increase bending to make the fabric stiffer
- Increase density so gravity pulls the fabric smoother
- Reduce simulation resolution slightly

### Not Enough Wrinkles

- Decrease bending to make the fabric softer
- Decrease density so the fabric floats more
- Increase simulation resolution
- Add internal lines to create controlled wrinkling points

### Fabric Passes Through Itself (Self-Collision)

- Enable self-collision in the simulation settings
- Increase fabric thickness
- Increase collision quality in simulation settings
- Reduce simulation speed

## Summary

Fabric simulation properties are the foundation of realistic digital clothing in Marvelous Designer. The most important property is bending (stiffness) — start with a preset close to your target fabric, then tune bending up or down to control how the fabric drapes and wrinkles. Always work at low simulation resolution for initial design, then increase resolution for final detail. Set bending separately for warp and weft to achieve realistic anisotropic fabric behavior. The combination of correct physical properties and adequate simulation resolution is what separates professional-quality digital garments from stiff, unnatural cloth.
