---
title: "Ansys Mesh Quality Metrics: Element Distortion Diagnosis and Fix Guide"
excerpt: "Poor mesh quality gives you wrong answers without any warning. I cover the quality metrics I check on every analysis, the thresholds I use, and the meshing techniques that fix distorted elements."
category: "performance"
softwareSlug: "ansys"
keyword: "Ansys mesh quality element distortion metrics"
slug: "ansys-mesh-quality-element-distortion-diagnosis"
author: "FEA Analyst"
readTime: "10 min"
date: "2025-06-16"
sources:
  - "https://forum.ansys.com/forums/topic/convergence-issue-in-non-linear-problem/"
  - "https://forum.ansys.com/forums/topic/convergence-problems-in-static-structural-analysis-with-friction-contact/"
---

# Ansys Mesh Quality Metrics: Element Distortion Diagnosis and Fix Guide

I learned the importance of mesh quality the hard way. Early in my FEA career, I ran a stress analysis on a bracket with a coarse mesh and got a maximum stress of 85 MPa — well below the material's yield strength. My senior engineer asked me to refine the mesh and re-run. The refined mesh gave 340 MPa — above yield. The coarse mesh had missed a stress concentration entirely because the elements were too distorted to capture the stress gradient. That experience taught me that mesh quality isn't just about convergence — it's about getting the right answer.

## Why Mesh Quality Matters

FEA elements approximate the displacement field within each element using shape functions. These shape functions assume a certain element geometry — a hex element should be roughly cubic, a tet element should be roughly equilateral. When elements are distorted (squashed, skewed, or have high aspect ratios), the shape functions become less accurate, and the computed stresses and strains are wrong.

The dangerous thing is that the solver usually doesn't warn you about poor mesh quality. It runs to completion, produces results, and the results look plausible. But they're wrong.

## Key Mesh Quality Metrics

### Element Quality

This is a composite metric that combines several quality measures into a single number. It ranges from 0 (worst) to 1 (best).

- **> 0.7**: Excellent — suitable for any analysis
- **0.3 - 0.7**: Acceptable — suitable for most analyses, but check other metrics
- **0.1 - 0.3**: Poor — may give inaccurate results, especially in stress concentration areas
- **< 0.1**: Unacceptable — the element is severely distorted and will give wrong results

### Aspect Ratio

The ratio of the longest edge to the shortest edge. For hex elements, it's the ratio of the longest to shortest dimension.

- **< 3**: Good
- **3 - 10**: Acceptable for regions away from stress concentrations
- **> 10**: Poor — the element is too elongated
- **> 20**: Unacceptable

### Jacobian Ratio

Measures how much the element deviates from its ideal shape. A Jacobian ratio of 1.0 means the element is perfectly shaped. Values less than 0.5 indicate significant distortion.

- **> 0.7**: Good
- **0.5 - 0.7**: Acceptable
- **< 0.5**: Poor — may cause convergence problems
- **< 0**: Invalid — the element is inverted (inside-out)

### Skewness

Measures how much the element's angles deviate from the ideal angle (90° for hex, 60° for tet).

- **< 0.4**: Excellent
- **0.4 - 0.6**: Good
- **0.6 - 0.85**: Acceptable
- **> 0.85**: Poor
- **> 0.95**: Unacceptable

### Warping Factor

Measures how much a quadrilateral face deviates from being planar. Only applies to hex and pyramid elements.

- **< 0.1**: Good
- **0.1 - 0.4**: Acceptable
- **> 0.4**: Poor — the element is twisted

## Checking Mesh Quality in Ansys Mechanical

1. Select the **Mesh** branch in the tree
2. In the Properties, go to **Quality**
3. Set **Mesh Metric** to the metric you want to visualize
4. The mesh display will color elements by quality
5. Click on the histogram to see the distribution of quality values
6. Red elements are the worst — focus your fixes on those

### My Standard Quality Check

For every analysis, I check these metrics:

1. **Element Quality**: Min value > 0.1, average > 0.5
2. **Aspect Ratio**: Max value < 20
3. **Jacobian Ratio**: Min value > 0.5
4. **Skewness**: Max value < 0.85

If any of these thresholds are violated, I fix the mesh before running the analysis.

## Common Mesh Problems and Fixes

### Problem: High Aspect Ratio Elements

**Cause**: The mesh size is uniform, but the geometry has thin features (thin walls, narrow regions).

**Fix**:
1. Use **Body Sizing** with a size that matches the thin dimension
2. Use **Face Meshing** on thin faces to force structured meshing
3. Use **MultiZone** meshing method for extruded geometries — it creates hex elements with appropriate aspect ratios
4. For thin walls, consider using shell elements instead of solid elements

### Problem: High Skewness at Fillets

**Cause**: The fillet radius is too small relative to the mesh size, creating distorted elements at the transition.

**Fix**:
1. Add a **Face Sizing** control on the fillet face with a size of 1/3 the fillet radius
2. Use **Edge Sizing** on the fillet edge with a bias factor to concentrate elements near the fillet
3. Use **Sphere of Influence** sizing to refine the mesh locally around the fillet

### Problem: Inverted Elements (Negative Jacobian)

**Cause**: The geometry has self-intersections or the mesher created elements with reversed orientation.

**Fix**:
1. Check the geometry for self-intersections: **Tools → Fault Detection**
2. If the geometry is clean, try a different meshing method:
   - Switch from **Hex Dominant** to **Tetrahedrons**
   - Or use **MultiZone** for sweepable bodies
3. If the problem persists, simplify the geometry — remove small features that are causing the mesher to fail

### Problem: Poor Mesh at Contact Interfaces

**Cause**: The mesh sizes on the two contacting bodies don't match, creating a poor contact detection.

**Fix**:
1. Use **Contact Sizing** in the mesh controls
2. Set the element size on both sides of the contact to be similar (ratio < 3:1)
3. Use **Refinement** at the contact region with a refinement level of 1-2
4. For frictional contacts, use a finer mesh than for bonded contacts

### Problem: Poor Mesh at Stress Concentrations

**Cause**: The mesh is too coarse at holes, notches, or sharp corners where stress gradients are high.

**Fix**:
1. Use **Sphere of Influence** sizing centered on the stress concentration
2. Set the element size to 1/10 of the feature size (e.g., 0.5mm for a 5mm hole)
3. Use **Refinement** at the edge or face of the stress concentration
4. Run a mesh convergence study: refine the mesh until the maximum stress stops changing significantly (typically < 5% change between refinements)

## Mesh Convergence Study

A mesh convergence study verifies that the mesh is fine enough to give accurate results. Here's how I do it:

1. Run the analysis with the initial mesh
2. Note the maximum stress (or whatever result you're interested in)
3. Refine the mesh globally by 50% (halve the element size)
4. Re-run and note the new maximum stress
5. Calculate the percentage change: `(|new - old| / old) × 100`
6. If the change is > 5%, refine again
7. If the change is < 5%, the mesh has converged

### Local Convergence

For large models where global refinement is too expensive:

1. Refine only the region of interest (using Sphere of Influence)
2. Keep the rest of the mesh coarse
3. This is faster and uses less memory while still verifying accuracy at the critical location

## Meshing Method Selection

Ansys offers several meshing methods. Choosing the right one affects both quality and solve time:

| Method | Best For | Quality | Speed |
|--------|---------|---------|-------|
| Tetrahedrons | Complex geometry | Good | Medium |
| Hex Dominant | Bulk geometry | Good | Medium |
| MultiZone | Extruded/swept bodies | Excellent | Fast |
| Sweep | Sweepable bodies | Excellent | Fast |
| Cartesian | Regular geometry | Excellent | Fast |

For most mechanical parts, I use:
- **MultiZone** for the main body (if sweepable)
- **Tetrahedrons** for complex features
- **Sphere of Influence** refinement at stress concentrations

## Summary

Mesh quality directly affects result accuracy. Check Element Quality, Aspect Ratio, Jacobian Ratio, and Skewness on every analysis. Fix distorted elements using appropriate sizing controls, and always run a mesh convergence study at stress concentrations. The time you spend on mesh quality is trivial compared to the cost of making design decisions based on wrong results.
