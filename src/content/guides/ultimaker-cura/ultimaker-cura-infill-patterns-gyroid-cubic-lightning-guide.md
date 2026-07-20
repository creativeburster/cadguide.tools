---
title: "UltiMaker Cura Infill Patterns: Choosing Between Gyroid, Cubic, Grid, and Lightning"
excerpt: "Cura offers 14 infill patterns, each with different strength, speed, and material characteristics. We cover the practical differences between gyroid, cubic, grid, lightning, and other patterns — with recommendations for functional parts, display models, flexible prints, and high-speed production."
category: "workflow"
softwareSlug: "ultimaker-cura"
keyword: "UltiMaker Cura infill patterns gyroid cubic grid lightning comparison"
slug: "ultimaker-cura-infill-patterns-gyroid-cubic-lightning-guide"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://support.ultimaker.com/s/article/1667411002588"
  - "https://support.ultimaker.com/s/article/1667412693651"
  - "https://ultimaker.com/learn/mastering-3d-printing-infill-patterns-from-gyroid-to-lightning/"
  - "https://www.wevolver.com/article/cura-infill-patterns"
  - "https://3dprintinggeek.com/cura-infill-patterns/"
---

# UltiMaker Cura Infill Patterns: Choosing Between Gyroid, Cubic, Grid, and Lightning

We've printed hundreds of functional parts, display models, and flexible components, and choosing the right infill pattern makes a bigger difference than most people realize. The wrong pattern can waste material, add hours to print time, or produce a part that fails under load. Cura offers 14 infill patterns, and understanding their trade-offs is essential for getting the most out of your prints.

## What Is Infill?

Infill is the internal structure of a 3D printed object. Instead of printing solid, the interior is filled with a pattern that provides strength and stability while minimizing material use. The infill percentage and pattern determine the balance between strength, weight, print time, and material consumption.

Cura's documentation states: "Infill refers to the internal structure of a printed object, which is filled with a pattern or mesh to provide strength and stability while minimizing material use."

## The 14 Infill Patterns in Cura

### 2D Infill Patterns (Faster, Simpler)

**Lines**
- Type: 2D infill
- Best for: Near-solid prints (80-100% density)
- Fast to print and slice, but weak at low densities because lines only run in one direction per layer

**Zigzag**
- Type: 2D infill
- Best for: Quick visual prints
- Similar to lines but with connected endpoints, reducing retractions

**Grid**
- Type: 2D infill
- Best for: General-purpose functional parts
- Cross-hatching lines provide good vertical strength. One of the most commonly used patterns

**Triangles**
- Type: 2D infill
- Best for: Parts needing horizontal strength
- Triangular pattern provides excellent resistance to side impacts. Triangles are the most rigid polygon shape

**Tri-hexagon**
- Type: 2D infill
- Best for: Parts needing stiffness
- Combines triangles and hexagons for excellent horizontal stiffness

**Cubic**
- Type: 3D infill
- Best for: General functional parts
- 3D cubes standing on a corner. Good strength in all directions. Reduces pillowing because it doesn't create long pockets of air

**Cubic Subdivision**
- Type: 3D infill
- Best for: Large parts needing strength-to-weight optimization
- Like cubic but with larger cubes toward the center and smaller cubes near the walls. Excellent balance of strength, weight, and material usage

**Quarter Cubic**
- Type: 3D infill
- Best for: Parts with complex stress patterns
- Variation of cubic with different cube orientation

**Octet**
- Type: 3D infill
- Best for: High-strength functional parts
- Tetrahedral and octahedral structures. Very strong but material-intensive

### 3D Infill Patterns (Stronger, More Complex)

**Gyroid**
- Type: 3D infill
- Best for: Functional parts, flexible models, transparent prints
- Wavy pattern alternating directions. Near-isotropic strength (equal in all directions) but not stiff. Looks beautiful with transparent filaments. Slower to slice

**Cross**
- Type: 2D infill
- Best for: Flexible prints
- Cross-shaped pattern that allows controlled flexibility

**Cross 3D**
- Type: 3D infill
- Best for: Flexible prints needing 3D strength
- 3D version of cross pattern

**Concentric**
- Type: 2D infill
- Best for: Flexible prints, minimal material
- Concentric rings. Very flexible and uses minimal material, but weak

**Lightning**
- Type: Adaptive
- Best for: Fast visual prints, low-stress models
- Generates support-like infill only where needed to support top layers. Extremely fast and minimal material, but not suitable for functional parts

## Strength Comparison

Peer-reviewed tensile testing has shown that cubic and gyroid infills outperform grid and line infills at 20% density, while offering comparable weight and print time.

**By force direction:**
- **Vertical compression**: Grid and cubic excel at resisting top-down forces
- **Horizontal forces**: Triangles and tri-hexagon provide robust resistance to side impacts
- **Multi-directional stress**: Gyroid and cubic subdivision offer near-isotropic strength
- **Flexibility with strength**: Concentric and cross patterns

## Recommended Infill by Application

### Functional Prototypes
- **Pattern**: Gyroid or Cubic
- **Density**: 15-25%
- **Why**: Good balance of strength and material efficiency. Gyroid provides near-isotropic strength

### End-Use Parts
- **Pattern**: Triangles, Tri-hexagon, or Octet
- **Density**: 30-50%
- **Why**: Higher density and stronger patterns for durability

### Display Models
- **Pattern**: Lightning or Lines
- **Density**: 10-15%
- **Why**: Minimal material and fast printing. Lightning only generates infill where needed to support top layers

### Flexible Parts (TPU)
- **Pattern**: Gyroid, Cross, or Concentric
- **Density**: 15-30%
- **Why**: These patterns allow controlled flexibility. Gyroid is strong but not stiff, making it ideal for flexible materials

### Large Structural Components
- **Pattern**: Cubic Subdivision
- **Density**: 15-25%
- **Why**: Larger cubes in the center save material while maintaining strength near the walls

### Transparent Prints
- **Pattern**: Gyroid
- **Density**: 20-30%
- **Why**: The wavy pattern looks stunning through transparent filaments

## Infill Density Guidelines

- **0-10%**: Visual-only prints, no structural requirements
- **10-20%**: Standard for most prints — adequate strength for display models and light-duty parts
- **20-30%**: Recommended for functional parts and prototypes
- **30-50%**: End-use parts, mechanical components, high-stress applications
- **50-80%**: Heavy-duty functional parts (rarely needed)
- **80-100%**: Near-solid/solid prints — use Lines or Zigzag pattern at these densities

## Advanced Infill Settings

### Gradual Infill Steps

Increases infill density toward the top of the print. This saves material in the lower sections while providing better support for top layers. Useful for models where top surface quality is important.

### Infill Line Directions

Allows you to specify the angle of infill lines. Default is 45° and 135° (cross-hatch). For parts that need strength in a specific direction, you can align infill lines with the expected force direction.

### Infill Before Walls

Prints infill before walls. This can improve wall-to-infill adhesion but may cause infill patterns to show through the walls. We keep this disabled for display models and enabled for functional parts.

### Infill Overlap

How much the infill overlaps with the inner walls. Higher values improve adhesion but can cause surface artifacts. Default is 10-15%.

## Summary

For most functional parts, we use **gyroid at 20% density** — it provides near-isotropic strength, looks great, and prints reliably. For display models, **lightning at 10%** saves significant time and material. For flexible prints, **concentric or cross** at 20% provides controlled flexibility. For large structural parts, **cubic subdivision at 20%** optimizes material placement. The pattern matters as much as the density — choosing the right one can save hours of print time and significantly improve part performance.
