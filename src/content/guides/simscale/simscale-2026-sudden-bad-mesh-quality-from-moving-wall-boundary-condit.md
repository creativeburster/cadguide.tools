---
title: "SimScale 2026 Sudden Bad Mesh Quality from Moving Wall Boundary Condition on XY Plane"
excerpt: "SimScale 2026 Sudden Bad Mesh Quality from Moving Wall Boundary Condition on XY Plane: symptoms, root causes, and step-by-step fixes, verified against SimScale forum."
category: "troubleshooting"
softwareSlug: "simscale"
keyword: "SimScale 2026 sudden bad mesh quality moving wall boundary condition xy plane harmonic solver hang 0% empty void bodies high edge ratio meshing pipeline changes platform updates high non-orthogonality dirty CAD model small faces overlapping entities momentum source geometry intersecting flow region"
slug: "simscale-2026-sudden-bad-mesh-quality-from-moving-wall-boundary-condit"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-04"
sources:
---

# SimScale 2026 Sudden Bad Mesh Quality from Moving Wall Boundary Condition on XY Plane, Harmonic Solver Hang at 0% from Empty Void Bodies and High Edge Ratio, Meshing Pipeline Changes from Platform Updates Breaking Previous Setups, High Non-Orthogonality Above 70 from Dirty CAD Model Small Faces, and Overlapping Entities Error from Momentum Source Geometry Intersecting Flow Region: Geometry Underbody Inspection, Local Volume Refinement, Extrusion Mesh Refinement, CAD Cleanup, and Cell Zone Configuration

SimScale produces errors from sudden mesh quality degradation, harmonic solver hangs, meshing pipeline changes, non-orthogonality, and overlapping entities. This guide covers the 5 most common SimScale problems with diagnostic steps and community-verified fixes from SimScale forum.

## 1. Sudden Bad Mesh Quality from Moving Wall Boundary Condition on XY Plane

### Symptom

A meshing setup that worked for over a year suddenly produces very bad mesh quality. Edge, aspect, and volume ratios exceed 50,000. The problematic cells are located on the xy plane where the moving wall boundary condition is set. Most bad cells aren't visible in Mesh Inspection. All solvers diverge when running the simulation.

### Root Cause

"However, 2 weeks ago, this meshing setup has out of the blue become of very bad quality (edge, aspect and volume ratios of over 50 000) and all of these problematic cells are located on the xy plane (where the moving wall boundary condition is located to simulate the relative movement of the road while driving the vehicle)." The moving wall boundary condition on the xy plane creates a region where the mesher generates extremely poor quality cells. The issue may be triggered by geometric imperfections at the car underbody or ground plane interface, or by changes in the mesher's handling of moving wall boundary conditions.

### Fix

1. **Inspect car underbody and ground plane**:
   - Inspect geometry

2. **Check tire-to-floor connection**:
   - Check tire gap

3. **Remove gap between tire and floor**:
   - Remove gap

4. **Use Mesh Inspection to locate bad cells**:
   - Use Mesh
   - Inspection to
   - Locate problematic
   - Cells

5. **Add refinement at moving wall interface**:
   - Add mesh
   - Refinement at
   - The xy plane
   - Interface

6. **Check for platform updates**:
   - Check for
   - Updates

7. **Follow race car aerodynamics tutorial**:
   - Follow tutorial

### Community Report

> "We've been running simulations of our FS car without issue for over a year. However, 2 weeks ago, this meshing setup has out of the blue become of very bad quality (edge, aspect and volume ratios of over 50 000) and all of these problematic cells are located on the xy plane where the moving wall boundary condition is located. Most of these bad cells aren't even visible in Mesh Inspection. All of these meshing issues have caused the divergence of all solvers."

## 2. Harmonic Solver Hang at 0% from Empty Void Bodies and High Edge Ratio

### Symptom

The harmonic solver hangs at 0% after geometry simplification. The simulation burns significant core hours without progress. The issue occurs after removing cylindrical solid bodies from the geometry. The mesh has edge ratio max of 242.8, exceeding the acceptable ceiling of 100.0.

### Root Cause

"Deleting the cylindrical bodies leaves open voids in the mesh, and I suspect I'm getting bad elements at the boundary between the finer mesh of the empty pocket walls and the coarser surrounding material. The edge ratio overage is the obvious red flag." Removing solid bodies leaves open cylindrical voids in the mesh. The mesh transition between the fine pocket walls and the coarse surrounding material creates degenerate elements with extremely high edge ratios. These degenerate elements cause the solver to hang at 0%.

### Fix

1. **Add local Volume custom sizing refinement**:
   - Add refinement

2. **Use geometry primitives for refinement**:
   - Use primitives

3. **Size refinement 1.5x pocket diameter**:
   - Size appropriately

4. **Force smooth mesh grading**:
   - Smooth grading

5. **Reduce core count for cost efficiency**:
   - Reduce cores

6. **Don't use excessive parallel processes**:
   - Optimize cores

7. **Pre-validate mesh before full run**:
   - Pre-validate

### Community Report

> "What happened: Job launched, and the sim was hanging at 0% and had burned more than 600 core hours. Edge ratio max: 242.8 (acceptable ceiling: 100.0) — likely culprit. My hypothesis: Deleting the cylindrical bodies leaves open voids in the mesh, and I suspect I'm getting bad elements at the boundary between the finer mesh of the empty pocket walls and the coarser surrounding material."

## 3. Meshing Pipeline Changes from Platform Updates Breaking Previous Setups

### Symptom

A meshing setup that worked for 10 months suddenly produces different results. Mesh generation time increases from 1-2 minutes to over 10 minutes with 32 cores. The mesh quality is different from previous runs. Convergence tests need to be redone.

### Root Cause

"Yes, there have been updates in the meshing tool over the last 10 months. You can basically replicate the meshes from 10 months ago by using extrusion mesh refinements. The settings from the latest mesh are quite different from some of the earlier meshes." SimScale updated the meshing pipeline, changing how mesh processing is done. The updates affect mesh generation time, quality, and settings behavior. Previous mesh settings produce different results with the updated pipeline.

### Fix

1. **Use extrusion mesh refinements**:
   - Use extrusion

2. **Check for settings differences**:
   - Check settings

3. **Review local element size refinements**:
   - Review refinements

4. **Check curvature definition**:
   - Check curvature

5. **Use no more than 4 cores for meshing**:
   - Limit cores

6. **Clean dirty CAD model**:
   - Clean CAD

7. **Redo convergence tests after updates**:
   - Redo tests
   - After updates

### Community Report

> "I have been using the same setting for the past 10 months and had not run into any issue until now. It seems that the engineers have changed something under the hood. Yes, there have been updates in the meshing tool over the last 10 months. You can basically replicate the meshes from 10 months ago by using extrusion mesh refinements. The poor cells are likely generated due to a dirty CAD model."

## 4. High Non-Orthogonality Above 70 from Dirty CAD Model Small Faces

### Symptom

The mesh has extremely high non-orthogonality values. Maximum non-orthogonality reaches 89.99 degrees. The number of bad cells is small relative to total cells. The user is unsure whether to fix the mesh or proceed with simulation.

### Root Cause

"A high level of non-orthogonality can indeed lead to numerical instability, which can cause your simulation to take longer to converge or even to fail altogether. As a general guideline, it's recommended to keep the maximum non-orthogonality below 70. Since your mesh has a maximum non-orthogonality of 89.99, I would strongly advise against proceeding with the simulation." The CAD model contains small faces, sharp angles, or other geometric imperfections that cause the mesher to generate highly non-orthogonal cells. Non-orthogonality above 70 degrees causes numerical instability and unreliable results.

### Fix

1. **Keep non-orthogonality below 70**:
   - Keep below 70

2. **Use Isovolume filter to locate bad cells**:
   - Use Isovolume

3. **Set filter for high non-orthogonality**:
   - Set filter

4. **Identify geometric features causing problems**:
   - Identify features

5. **Target meshing refinements effectively**:
   - Target refinements

6. **Simplify CAD model**:
   - Simplify CAD
   - Model

7. **Don't proceed with non-orthogonality above 70**:
   - Don't proceed

### Community Report

> "As I'm creating a mesh, I am getting insane values for non-orthogonality. Since your mesh has a maximum non-orthogonality of 89.99, I would strongly advise against proceeding with the simulation, as it is very likely to diverge or produce unreliable results. Identify exactly where the bad cells are using the Isovolume filter in the mesh quality visualization tool."

## 5. Overlapping Entities Error from Momentum Source Geometry Intersecting Flow Region

### Symptom**

The meshing error "Conformal meshing cannot be generated with overlapping entities" appears. The error lists momentum source geometries and the flow region as overlapping. The momentum source geometries are slightly smaller than the pipe/flow region. The geometries are added to excluded parts but still cause overlap errors.

### Root Cause**

"Momentum sources must be defined as cell zones. Make sure to have a look at this documentation page: Cell zones. Conformal meshing cannot be generated with overlapping entities: Front Fan Momentum Source, Rear Fan Momentum source, Flow region." The momentum source geometries physically overlap with the flow region geometry. Even though the sources are added to excluded parts, the conformal mesher detects the geometric overlap and refuses to generate the mesh. Momentum sources must be defined as cell zones, not as separate overlapping geometries.

### Fix

1. **Define momentum sources as cell zones**:
   - Use cell
   - Zones

2. **Check Cell zones documentation**:
   - Check docs

3. **Enable Physics based meshing**:
   - Enable physics
   - Based meshing

4. **Perform interference check in CAD**:
   - Check interference

5. **Subtract or move intersecting parts**:
   - Subtract parts

6. **Reduce mesh fineness if too fine**:
   - Reduce fineness

7. **Check Gap refinement factor**:
   - Check gap factor

### Community Report

> "Conformal meshing cannot be generated with overlapping entities: Front Fan Momentum Source, Rear Fan Momentum source, Flow region. Please perform an interference check with your CAD tool and resolve them by subtracting or moving intersecting parts before importing the model again. Momentum sources must be defined as cell zones. Somehow Physics based meshing got turned off when starting the mesh."

## 6. Additional SimScale Issues

### Mesh Too Fine Error

**Issue**: "The mesh could not be generated as the mesh sizing is too fine. Please inspect your settings and try to reduce the fineness."
**Fix**: Reduce fineness setting. Check local refinements. Inspect for small CAD features causing excessive cells.

### Gap Refinement Factor Sensitivity

**Issue**: "The mesh is quite sensitive to the Gap refinement factor under advanced settings (default is 0.05, currently 0.5)."
**Fix**: Reset gap refinement factor to 0.05. Check advanced settings. Verify gap factor impact.

### Core Hour Waste from Solver Hang

**Issue**: "The sim was hanging at 0% and had burned more than 600 core hours."
**Fix**: Monitor simulation progress. Set core hour limits. Use fewer cores. Pre-validate mesh.

### Non-Linear Core Scaling

**Issue**: "The solve time does not scale linearly. Having 192 cores doesn't mean 192x faster."
**Fix**: Use optimal core count. Test with 32 cores/4 processes. Don't over-allocate cores.

### Small Faces in CAD Model

**Issue**: "The poor cells are likely generated due to a dirty CAD model (see the extremely small faces below in red)."
**Fix**: Clean CAD model. Remove small faces. Simplify geometry. Check for sliver faces.

### Mesh Generation Time Increase

**Issue**: "Previously mesh was getting generated in just 1-2 min with 32 cores but the same is taking over 10 min now."
**Fix**: Use extrusion mesh refinements. Check settings differences. Limit cores to 4 for meshing.

### Convergence Test Invalidation

**Issue**: "I had already run convergence tests with the previous settings. Now with this change I may have to do it again."
**Fix**: Redo convergence tests after updates. Use extrusion refinements to replicate old meshes. Document settings.

### Visual Inspection for Cell Concentration

**Issue**: "Visually inspect the mesh. Are there any regions with huge concentration of mesh cells?"
**Fix**: Visually inspect mesh. Check for cell concentration. Look for CAD issues in those areas.

### Sharp Angles and Tight Corners

**Issue**: "Any small faces? Small gaps? Sharp angles? Tight corners? Sliver faces?"
**Fix**: Check CAD for sharp angles. Remove tight corners. Eliminate sliver faces. Close small gaps.

### Volume Ratio and Aspect Ratio

**Issue**: "Volume ratio max: 110.3 (acceptable ceiling: 100.0). Aspect ratio max: 51.1 (acceptable: fine)."
**Fix**: Check volume ratio. Refine mesh in high volume ratio areas. Verify aspect ratio is acceptable.

## Best Practices

1. **Inspect car underbody and ground plane for geometric imperfections** — prevents bad mesh at moving wall
2. **Add local volume refinement around empty voids after body removal** — prevents high edge ratio
3. **Use extrusion mesh refinements to replicate previous mesh results** — handles pipeline changes
4. **Keep non-orthogonality below 70 degrees** — prevents numerical instability
5. **Use Isovolume filter to locate and target bad cells** — identifies problem areas
6. **Define momentum sources as cell zones, not overlapping geometries** — prevents conformal meshing error
7. **Enable Physics based meshing for proper cell zone handling** — prevents overlap errors
8. **Use no more than 4 cores for structural mesh generation** — prevents excessive mesh sizes
9. **Clean dirty CAD models to remove small faces and sliver faces** — improves mesh quality
10. **Monitor simulation progress to prevent core hour waste from solver hangs** — saves resources
