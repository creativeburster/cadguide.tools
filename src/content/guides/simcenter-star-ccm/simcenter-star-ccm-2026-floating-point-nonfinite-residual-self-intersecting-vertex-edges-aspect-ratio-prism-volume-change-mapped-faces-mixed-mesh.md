---
title: "Simcenter STAR-CCM+ 2026 Floating Point Error Non-Finite Residual in Continuity from Segregated Flow Solver, Self-Intersecting Surface Mesh Error from Vertex with Too Many Edges, High Aspect Ratio Cells from Prism Layer Causing Coupled Solver Divergence, Volume Change Less Than 10e-2 at Prism-to-Core Transition, and Mapped Faces Mesh Generation Failed from Mixed Mesh: Field Function Denominator Check, Vertex Split, Prism Layer Parameter Adjustment, Surface Growth Rate Reduction, and Interface Density Increase"
excerpt: "Simcenter STAR-CCM+ fails for 5 distinct reasons: floating point error non-finite residual in continuity from segregated flow solver requiring field function denominator check, self-intersecting surface mesh error from vertex with too many edges requiring vertex split, high aspect ratio cells from prism layer causing coupled solver divergence requiring prism layer parameter adjustment, volume change less than 10e-2 at prism-to-core transition requiring surface growth rate reduction, and mapped faces mesh generation failed from mixed mesh requiring interface density increase. We cover each with fixes from Siemens community."
category: "troubleshooting"
softwareSlug: "simcenter-star-ccm"
keyword: "Simcenter STAR-CCM+ 2026 floating point error non-finite residual continuity segregated flow solver self-intersecting surface mesh vertex too many edges high aspect ratio cells prism layer coupled solver divergence volume change 10e-2 prism core transition mapped faces mesh generation failed mixed mesh"
slug: "simcenter-star-ccm-2026-floating-point-nonfinite-residual-self-intersecting-vertex-edges-aspect-ratio-prism-volume-change-mapped-faces-mixed-mesh"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-04"
sources:
  - "https://community.sw.siemens.com/s/article/Mesh-Requirements-for-good-convergence"
  - "https://community.sw.siemens.com/s/question/0D5Vb00000duTTzKAM/how-to-identify-root-cause-of-floating-point-error-nonfinite-residual-in-continuity-in-starccm"
  - "https://community.sw.siemens.com/s/question/0D5Vb00000jCadxKAC/original-surface-is-selfintersecting-mesh-error"
---

# Simcenter STAR-CCM+ 2026 Floating Point Error Non-Finite Residual in Continuity from Segregated Flow Solver, Self-Intersecting Surface Mesh Error from Vertex with Too Many Edges, High Aspect Ratio Cells from Prism Layer Causing Coupled Solver Divergence, Volume Change Less Than 10e-2 at Prism-to-Core Transition, and Mapped Faces Mesh Generation Failed from Mixed Mesh: Field Function Denominator Check, Vertex Split, Prism Layer Parameter Adjustment, Surface Growth Rate Reduction, and Interface Density Increase

Simcenter STAR-CCM+ produces errors from floating point exceptions, self-intersecting surfaces, high aspect ratios, volume change, and mixed mesh. This guide covers the 5 most common STAR-CCM+ problems with diagnostic steps and community-verified fixes from Siemens community.

## 1. Floating Point Error Non-Finite Residual in Continuity from Segregated Flow Solver

### Symptom

During a multiphase simulation, the error "A floating point error has occurred. A non-finite residual (Continuity) was added by star.segregatedflow.SegregatedFlowSolver" appears. Typical causes include overflow, underflow, or division by zero. The simulation involves complex interface dynamics with two-phase sloshing.

### Root Cause

"Typical causes are overflow, underflow, or a division by zero. Check expressions and Field Functions - verify that none of their denominators become 0 or are very close to 0. Check Boundary Conditions, Initial Conditions, and Reference Values. Ensure you're not using a velocity inlet with supersonic speed with the Segregated Solver." The floating point error occurs when the Segregated Flow Solver encounters a division by zero or numerical overflow. This can be caused by field functions with zero denominators, unphysical initial conditions, extreme gradients, or property discontinuities.

### Fix

1. **Check field function denominators**:
   - "Check expressions and Field Functions"
   - "Verify that none of their denominators"
   - "Become 0 or are very close to 0"
   - Check denominators

2. **Check boundary and initial conditions**:
   - "Check Boundary Conditions, Initial Conditions"
   - "And Reference Values"
   - "(especially gravity vector direction)"
   - Check conditions

3. **Don't use supersonic with Segregated Solver**:
   - "Ensure you're not using"
   - "A velocity inlet with supersonic speed"
   - "With the Segregated Solver"
   - Check solver compatibility

4. **Check mesh for bad cells**:
   - "Check the mesh for bad cells"
   - "(especially those with negative volume)"
   - Check for
   - Negative volume cells

5. **Check time step for transient**:
   - "If your simulation is transient"
   - "Check if the time step isn't too large"
   - Reduce time step
   - If too large

6. **Monitor residual plots**:
   - "Monitor simulation convergence"
   - "On the residual and monitor plots"
   - "Very rapid growth of residuals"
   - "Indicates diverging"
   - Monitor residuals

7. **Check simulation log for warnings**:
   - "Check the simulation log"
   - "For warnings"
   - Check log
   - For warnings

### Community Report

> "A floating point error has occurred. A non-finite residual (Continuity) was added by star.segregatedflow.SegregatedFlowSolver. Typical causes are overflow, underflow, or a division by zero. Check expressions and Field Functions - verify that none of their denominators become 0 or are very close to 0. Check Boundary Conditions, Initial Conditions, and Reference Values. Ensure you're not using a velocity inlet with supersonic speed with the Segregated Solver. Check the mesh for bad cells (especially those with negative volume)."

## 2. Self-Intersecting Surface Mesh Error from Vertex with Too Many Edges

### Symptom

When meshing a complex geometry, the error "Original surface is self-intersecting" appears. The error occurs after mesh refinement in specific regions. STAR-CCM+ reported 0 invalid faces and 0 intersecting vertices before the error. Surface Repair tool found no pierced faces, free edges, or non-manifold vertices.

### Root Cause

"I think the issue was caused by one vertex receiving too many edges from the geometry's tessellation, which likely led to the self-intersection problem." A vertex with too many connected edges from the geometry tessellation causes the surface remesher to create self-intersecting faces. The vertex becomes a singularity point where the surface mesh can't properly resolve the geometry.

### Fix

1. **Check error coordinates**:
   - "The error provided the coordinates"
   - "Of some vertices"
   - Check coordinates
   - In error message

2. **Use Surface Repair tool**:
   - "I checked them using"
   - "The Surface Repair tool"
   - "And split some of them"
   - Use Surface Repair

3. **Split vertices with too many edges**:
   - "Split some of them"
   - "And it seems to be working now"
   - Split problematic
   - Vertices

4. **Refine mesh at sharp edges**:
   - "Refine the mesh"
   - "At the sharp edge"
   - Refine at
   - Sharp edges

5. **Clear and relaunch mesh**:
   - "I cleared all the mesh"
   - "And relaunched it again"
   - Clear and
   - Relaunch mesh

6. **Check for imprint contacts**:
   - "You have parts that share an interface"
   - "And there is no contact created beforehand"
   - "An imprint to create the contacts"
   - Create imprint contacts

7. **Fine mesh for coarse intersection**:
   - "The surface mesh created is very coarse"
   - "Which causes the intersection"
   - "Fine mesh should solve the problem"
   - Use finer mesh

### Community Report

> "I'm encountering the error stating that there is a self-intersecting surface. What's confusing is that STAR-CCM+ reported 0 invalid faces and 0 intersecting vertices. I checked the coordinates using the Surface Repair tool, and split some of them, and it seems to be working now. I think the issue was caused by one vertex receiving too many edges from the geometry's tessellation, which likely led to the self-intersection problem."

## 3. High Aspect Ratio Cells from Prism Layer Causing Coupled Solver Divergence

### Symptom

The coupled solver diverges during simulation. The divergence is caused by high aspect ratio cells in the prism layer. The aspect ratio exceeds 50-75, which is the limit for the coupled solver. The issue occurs with Low Reynolds meshing approach.

### Root Cause

"When using the coupled solver, you must avoid high aspect ratio cells (higher than 50-75). A prism layer must be used on all walls. For a Low Reynolds meshing approach, a fine grid should be used in the boundary layer in order to resolve it correctly. This practice in turn means that you can have high aspect ratio cells." The Low Reynolds meshing approach creates fine prism layer cells near walls, resulting in high aspect ratios. The coupled solver is sensitive to high aspect ratios and may diverge when cells exceed 50-75.

### Fix

1. **Keep aspect ratio below 50-75 for coupled solver**:
   - "When using the coupled solver"
   - "You must avoid high aspect ratio cells"
   - "(higher than 50-75)"
   - Keep below 50-75

2. **Choose prism layer parameters carefully**:
   - "In order to avoid high aspect ratio cells"
   - "Choose carefully the prism layer parameters"
   - Adjust prism
   - Layer parameters

3. **Use Near Core Layer Aspect Ratio**:
   - "Use the Near Core Layer Aspect Ratio option"
   - "In the Prism layer mesher model"
   - "Set the value to for example 0.5"
   - Set NCLAR to 0.5

4. **Use Maximum Core/Prism Transition Ratio**:
   - "For Trimmer mesher"
   - "Use the option Maximum Core/Prism Transition Ratio"
   - Use transition
     - Ratio option

5. **Consider segregated solver for high aspect ratios**:
   - If aspect ratios
   - Can't be reduced
   - Consider segregated
   - Solver instead

6. **Adjust prism layer stretching**:
   - Adjust prism layer
   - Stretching ratio
   - To reduce
   - Aspect ratio

7. **Use appropriate meshing approach**:
   - Consider High Reynolds
   - Approach instead of
   - Low Reynolds
   - To reduce aspect ratios

### Community Report

> "When using the coupled solver, you must avoid high aspect ratio cells (higher than 50-75). A prism layer must be used on all walls. For a Low Reynolds meshing approach, a fine grid should be used in the boundary layer. This practice in turn means that you can have high aspect ratio cells. In order to avoid high aspect ratio cells, choose carefully the prism layer parameters. Use the Near Core Layer Aspect Ratio option in the Prism layer mesher model. Set the value to for example 0.5."

## 4. Volume Change Less Than 10e-2 at Prism-to-Core Transition

### Symptom

The mesh has volume change less than 10e-2 at the transition between prism layer and core mesh. The solver is sensitive to this mesh quality metric. The issue occurs with Low Reynolds meshing approach. The poor volume change affects convergence.

### Root Cause

"The volume change is the ratio between a cell and its biggest neighbor. In general the volume change is bigger at the transition between prism layer and core mesh when you use a Low Reynolds meshing approach. Try to avoid having a volume change less than 10e-2." The Low Reynolds approach creates fine prism layer cells that transition to larger core mesh cells. The volume ratio between these cells can be very small, causing numerical issues in the solver.

### Fix

1. **Avoid volume change less than 10e-2**:
   - "Try to avoid having"
   - "A volume change less than 10e-2"
   - Keep above 10e-2

2. **Set mesh sizes carefully on boundaries**:
   - "If you set mesh sizes that are too different"
   - "On boundaries that are close one to another"
   - "You would have to change the default values"
   - Set sizes carefully

3. **Reduce Surface Growth Rate**:
   - "Reduce the Surface Growth Rate"
   - "To improve the volume change"
   - "And the mesh quality"
   - Reduce growth rate

4. **Use Near Core Layer Aspect Ratio**:
   - "Use the Near Core Layer Aspect Ratio option"
   - "Set the value to for example 0.5"
   - Set NCLAR
   - To 0.5

5. **Use Maximum Core/Prism Transition Ratio**:
   - "For Trimmer mesher"
   - "Use Maximum Core/Prism Transition Ratio"
   - Use transition
   - Ratio

6. **Set Mesh Density for smooth transition**:
   - "Change the default values for Mesh Density"
   - "In order to get a smooth transition"
   - Adjust Mesh
   - Density

7. **Check mesh quality after generation**:
   - "After the mesh generation"
   - "The mesh must be checked"
   - "And improved according to"
   - "Quality metrics"
   - Check mesh quality

### Community Report

> "The volume change is the ratio between a cell and its biggest neighbor. In general the volume change is bigger at the transition between prism layer and core mesh when you use a Low Reynolds meshing approach. Try to avoid having a volume change less than 10e-2. If you set mesh sizes that are too different on boundaries that are close one to another, you would have to change the default values for Mesh Density. Reduce the Surface Growth Rate to improve the volume change and the mesh quality."

## 5. Mapped Faces Mesh Generation Failed from Mixed Mesh

### Symptom

The error "Creation of new nodes is not allowed on MAPPED faces. Mesh generation failed. Try again with thinner meshes" occurs when meshing a 3D model with two adjacent volumes using different mesh generators (mixed mesh).

### Root Cause

"This error occurs when meshing a 3D model having two adjacent volumes with different mesh generators, sometimes called a mixed mesh. Where a volume with a mapped mesh meets a volume with an automatic mesh, the algorithm to repair non-conformities fails, resulting in the above error." The mixed mesh creates non-conformities at the interface between mapped and automatic mesh volumes. The pyramid insertion algorithm that repairs these non-conformities fails, preventing mesh generation.

### Fix

1. **Change to non-mixed mesh**:
   - "Change the mesh so"
   - "It is not a mixed mesh"
   - Use same
   - Mesh generator

2. **Increase mesh density at interface**:
   - "Increase the density of the mesh"
   - "At the interface between"
   - "The mapped and automatic mesh"
   - Increase density

3. **Change mesh algorithm**:
   - "You can also try"
   - "To change the mesh algorithm"
   - Try different
   - Mesh algorithm

4. **Use same mesh generator for all volumes**:
   - Use the same
   - Mesh generator
   - For all adjacent
   - Volumes

5. **Check interface conformity**:
   - Verify interface
   - Conformity between
   - Adjacent volumes
   - Before meshing

6. **Use pyramid insertion**:
   - "The algorithm to repair non-conformities"
   - "By inserting pyramids"
   - Verify pyramid
   - Insertion works

7. **Use thinner meshes as suggested**:
   - "Try again with thinner meshes"
   - Use thinner
   - Meshes at
   - Interface

### Community Report

> "This error occurs when meshing a 3D model having two adjacent volumes with different mesh generators, sometimes called a mixed mesh. Where a volume with a mapped mesh meets a volume with an automatic mesh, the algorithm to repair non-conformities between hexahedrons and tetrahedrons by inserting pyramids fails. To correct this, you can change the mesh so it is not a mixed mesh, or you can increase the density of the mesh at the interface between the mapped and automatic mesh."

## 6. Additional STAR-CCM+ Issues

### Chevron Cells at Sharp Edges

**Issue**: "Chevron cells are pairs of thin slender cells that share a common face whose angle is such that the line joining the cell centers does not go through the common face."
**Fix**: Refine the mesh at the sharp edge. Use prism layer controls for sharp trailing edges. Check for chevron cells in mesh quality.

### Prism Layer Retraction

**Issue**: "When two surfaces are close, the prism layer can retract and some layers can be removed."
**Fix**: Reduce Minimum Thickness Percentage. Reduce Layer Reduction Percentage. Check prism layer near close surfaces.

### Potato Chips Cells

**Issue**: "On curved surfaces with thin prism layer cells, one can get highly concave and thin cells, also called potato chips."
**Fix**: Decrease prism layer stretching ratio. Increase surface mesh density. Check for potato chips in mesh quality.

### MPI Parallelization of Surface Remeshing

**Issue**: "The new Simcenter STAR-CCM+ 2606 release addresses this challenge with MPI parallelization of surface remeshing, offering scaling up to 16 CPU cores."
**Fix**: Update to STAR-CCM+ 2606. Use MPI parallelization for surface remeshing. Up to 2.1x faster on complex models.

### Surface Mesh Quality

**Issue**: "In order to improve surface mesh quality" for overall mesh quality.
**Fix**: Check surface mesh quality metrics. Improve surface mesh before volume mesh. Use Surface Repair tool.

### Property Discontinuities

**Issue**: "Property discontinuities" as a cause of floating point errors.
**Fix**: Check for property discontinuities at interfaces. Smooth property transitions. Verify material properties.

### Extreme Gradients

**Issue**: "Extreme gradients" as a cause of floating point errors.
**Fix**: Check for extreme gradients in the solution. Refine mesh in high-gradient regions. Use appropriate solver settings.

### Rerun and Monitor for Divergence

**Issue**: "After establishing when the simulation started to diverge, you can rerun it and monitor solution development to locate problematic regions."
**Fix**: Identify divergence start time. Rerun with monitoring. Use Scenes to visualize problematic regions. Check residual plots.

## Best Practices

1. **Check field function denominators for zero values** — prevents floating point errors
2. **Don't use supersonic velocity with Segregated Solver** — causes floating point error
3. **Check mesh for negative volume cells** — causes solver crashes
4. **Keep aspect ratio below 50-75 for coupled solver** — prevents divergence
5. **Avoid volume change less than 10e-2** — use NCLAR and Surface Growth Rate
6. **Split vertices with too many edges** — prevents self-intersecting surface mesh
7. **Avoid mixed mesh at interfaces** — or increase density at interface
8. **Update to STAR-CCM+ 2606 for MPI surface remeshing** — up to 2.1x faster
9. **Monitor residual plots for rapid growth** — indicates divergence
10. **Check simulation log for warnings** — early warning of issues
