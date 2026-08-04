---
title: "Simcenter STAR-CCM+ Mesh Divergence and Floating Point Errors"
excerpt: "Simcenter STAR-CCM+ Mesh Divergence and Floating Point Errors: symptoms, root causes, and step-by-step fixes, verified against Siemens Community forums."
category: "troubleshooting"
softwareSlug: "simcenter-star-ccm"
keyword: "STAR-CCM+ non-converging residuals tetrahedral polyhedral trimmed mesh floating point error division by zero field function negative volume NaN residuals boolean subtraction detach part-based meshing AMG solver divergence first iteration grid sequencing bad cells interface cell size mismatch twisted CAD topology"
slug: "simcenter-star-ccm-mesh-divergence-and-floating-point-errors"
author: "CADGuide Tools Editorial Team"
readTime: "14 min"
date: "2025-07-31"
sources:
  - "https://community.sw.siemens.com/s/question/0D54O00007lYiGySAK/nonconverging-residuals-due-to-poor-mesh"
  - "https://community.sw.siemens.com/s/question/0D5Vb00000duTTzKAM/how-to-identify-root-cause-of-floating-point-error-nonfinite-residual-in-continuity-in-starccm"
  - "https://community.sw.siemens.com/s/question/0D5Vb00000MVvygKAD/why-is-my-starccm-segregated-species-solver-returning-nan-residuals-and-diverging-immediately-despite-valid-mesh-and-double-precision"
---

# Simcenter STAR-CCM+ Mesh Divergence and Floating Point Errors: Non-Converging Residuals from Tetrahedral Mesh Requiring Polyhedral or Trimmed, Floating Point Error from Division by Zero in Field Functions and Bad Cells, NaN Residuals from External Fluid Region Boolean Subtraction and Detach, AMG Solver Divergence at First Iteration from Grid Sequencing, and Bad Cells at Interfaces from Cell Size Mismatch and Twisted CAD Topology

STAR-CCM+ simulations diverge from mesh quality issues, field function errors, geometry creation problems, and solver configuration. This guide covers the 5 most common STAR-CCM+ problems with diagnostic steps and community-verified fixes from Siemens Community forums.

## 1. Non-Converging Residuals from Tetrahedral Mesh

### Symptom

Residuals are not converging — far from it. The mesh appears decent visually, but STAR-CCM+ struggles to connect the mesh to the symmetry plane. The simulation is for a simple undertray on a Formula Student car.

### Root Cause

Tetrahedral meshes are not recommended for flow simulations in STAR-CCM+. Tetrahedral cells have only 4 faces, and at corners where three walls meet, the tetrahedron can't properly represent the flow. Polyhedral cells have ~12 faces, leading to faster and more accurate information transmission through cell faces.

### Why Polyhedral is Better

- Polyhedral cells have on average ~12 faces vs. 4 for tetrahedra
- Information in finite volume codes lies at cell centroids and propagates through faces
- More faces = faster and more accurate information transmission
- Other CFD codes that allow tetras use a dual mesh (poly mesh) in the background
- STAR-CCM+'s polyhedral conversion is more complex than simple tetrahedra accumulation

### Concrete Example

At a box corner where three walls meet:
- **Tetrahedra**: One tet in the corner with 3 faces on walls. The 4th face must have no flow through it — probably incorrect.
- **Polyhedra**: Multiple faces can properly represent the corner flow geometry.

### Fix

1. **Switch to polyhedral or trimmed mesh**:
   - "Do not use tetrahedral meshes in Simcenter STAR-CCM+ for flow simulations. Please choose either poly or trim meshes."
   - Polyhedral mesh: better for complex geometry
   - Trimmed mesh: better for structured domains

2. **Start with tutorials**:
   - "A good idea would be to try first with the tutorials before embarking on more complex simulations"
   - Tutorials provide mesh best practices
   - Foundation Tutorials → Geometry Parts → Creating the Main Fluid Volume

3. **Check mesh quality diagnostics**:
   - Run mesh diagnostics before starting the simulation
   - Check face validity, volume change, skewness
   - Fix any cells that fail quality checks

4. **Verify symmetry plane connection**:
   - If the mesh doesn't connect to the symmetry plane, check the boundary conditions
   - Ensure the symmetry plane is properly assigned
   - Check for gaps between the mesh and the symmetry plane

### Community Report

> "Do not use tetrahedral meshes in Simcenter STAR-CCM+ for flow simulations. Please choose either poly or trim meshes. Polyhedral cells have on average ~12 faces which leads to faster transmission of information."

## 2. Floating Point Error from Division by Zero and Bad Cells

### Error Message

```
A floating point error has occurred.
A non-finite residual (Continuity) was added by star.segregatedflow.SegregatedFlowSolver.
Typical causes are overflow, underflow, or a division by zero.
```

### Symptom

During a multiphase simulation (two-phase sloshing with parahydrogen and vapor), a floating point error occurs. The continuity residual becomes non-finite. The error points to overflow, underflow, or division by zero.

### Root Cause

Multiple potential causes:
- Field functions with denominators that become 0 or near-0
- Unphysical initial conditions
- Extreme gradients or property discontinuities
- Bad cells with negative volume
- Incorrect boundary conditions (e.g., supersonic velocity inlet with segregated solver)
- Time step too large for transient simulations

### Fix

1. **Check expressions and field functions**:
   - Verify that no denominators become 0 or near-0
   - Check all field functions for potential division by zero
   - Add safeguards: `if(abs(denominator) < 1e-10, 1e-10, denominator)`

2. **Check boundary and initial conditions**:
   - Verify all boundary conditions are physically correct
   - Check initial conditions for unphysical values
   - Check reference values, especially gravity vector direction
   - Don't use velocity inlet with supersonic speed and segregated solver

3. **Check mesh for bad cells**:
   - Run mesh diagnostics
   - Look for cells with negative volume
   - Check face validity — should be 100%
   - Check volume change ratios

4. **Check time step for transient simulations**:
   - If transient, verify the time step isn't too large
   - Use CFL (Courant-Friedrichs-Lewy) condition to estimate max time step
   - Reduce time step by 50% and retry

5. **Check simulation log for warnings**:
   - Review the simulation log for warning messages
   - Warnings often precede the floating point error
   - Address warnings before they become errors

6. **Monitor residual plots**:
   - Watch residual and monitor plots during simulation
   - Rapid residual growth indicates divergence
   - Stop the simulation if residuals grow rapidly
   - Rerun and monitor solution development in Scenes to locate problematic regions

7. **Use the Support Center article**:
   - "Some practical steps to understand the reason of a divergence or a floating point exception (FPE)"
   - Available on Siemens Support Center

### Community Report

> "There is no clear procedure for troubleshooting such errors. Check expressions and field functions for denominators that become 0. Check boundary conditions, initial conditions, and reference values. Check the mesh for bad cells, especially those with negative volume."

## 3. NaN Residuals from External Fluid Region Boolean Subtraction and Detach

### Error Message

```
A non-finite residual was added by star.segregatedspecies.SegregatedSpeciesSolver
AMG solver halted on multigrid level 1
```

### Symptom

Simulating diffusion through a biosensor using the segregated species model. Immediate divergence with NaN residuals for all species. Mesh diagnostics show valid mesh with 100% face validity and no negative volumes. Double precision is enabled.

### Root Cause

The external fluid region was created incorrectly. The user created a block around the sensor, used boolean subtraction to make a sensor-shaped hole, then detached the region and deleted the original block. This workflow doesn't align with STAR-CCM+'s part-based meshing approach. The detachment creates inconsistent geometry and mesh.

### Fix

1. **Use part-based meshing — don't detach and delete**:
   - "The meshing approach in Simcenter STAR-CCM+ is based on Part-Based meshing. There should be no need for detaching and deleting."
   - Create a volume and subtract the sensor
   - Use the resulting subtracted part as the external region
   - Perform an imprint to set up contacts for interfaces

2. **Create the external fluid region in 3D-CAD**:
   - Build the external fluid part in 3D-CAD with the rest of the geometry
   - This ensures geometry consistency
   - All necessary subtractions and imprints are done in 3D-CAD
   - Then mesh the consistent geometry

3. **Follow the foundational tutorial**:
   - Home → Tutorials → Foundation Tutorials → Geometry Parts → Geometry Parts: Creating the Main Fluid Volume and Subtracting the Enclosure and Fan
   - This tutorial demonstrates the correct workflow

4. **Debug by building up incrementally**:
   - "Start small — fewer regions and less physics — then build up"
   - Remove the external part and see if the simulation runs
   - If it runs, the external part is the problem
   - Rebuild the external part correctly in 3D-CAD

5. **Check for non-contiguous regions**:
   - Use "split by non-contiguous" in the Region view
   - This identifies disconnected mesh regions
   - If the external fluid region splits into multiple parts, the geometry is inconsistent

6. **Verify interfaces**:
   - Check that all interfaces between regions are properly defined
   - Ensure imprints are done before meshing
   - Verify interface mesh matching

### Community Report

> "The meshing approach in Simcenter STAR-CCM+ is based on Part-Based meshing, and so there should be no need for detaching and deleting. Create a volume and subtract the sensor, then use that resulting subtracted part as your external region."

> "I created the external fluid region by making a block, using boolean subtraction, then detaching it and deleting the original block. I wasn't quite sure if that was the way to do it best."

## 4. AMG Solver Divergence at First Iteration from Grid Sequencing

### Error Message

```
Error: AMG solver diverged.
AMG exit reason: Diverged due to exceeding divergence tolerance.
Relative residual: 2.883131e+04
```

### Symptom

Running external aerodynamics at Mach 5. At the first iteration, right after grid sequencing ends, the AMG solver diverges. However, after this initial error, the simulation proceeds normally and eventually converges with seemingly valid results. Mesh quality metrics all look good, with y+ ≈ 1 in the boundary layer.

### Root Cause

The AMG (Algebraic Multi-Grid) solver diverges during the transition from grid sequencing to full resolution. Grid sequencing solves on coarser meshes first, then refines. The transition can cause a large residual jump that exceeds the AMG solver's divergence tolerance. This is often a transient issue that resolves as the solver adapts to the full mesh.

### Fix

1. **Check if results are affected**:
   - "After this initial error, the simulation proceeds normally and eventually converges"
   - If the simulation converges to valid results, the initial AMG divergence may be harmless
   - Compare results with a simulation that doesn't show the error

2. **Check the KB article**:
   - "How to debug 'AMG solver diverged on first iteration'"
   - Available on Siemens Support Center
   - Provides additional debugging steps

3. **Adjust AMG solver settings**:
   - Increase the AMG divergence tolerance
   - Change the AMG cycle type (V-cycle, W-cycle, F-cycle)
   - Adjust the number of pre/post-smoothing iterations
   - Reduce the number of multigrid levels

4. **Check boundary layer cells**:
   - Even with y+ ≈ 1, very small cells in the boundary layer can cause AMG issues
   - Check the cell volume ratio between boundary layer and bulk cells
   - Smooth the volume transition

5. **Disable grid sequencing**:
   - If the divergence only occurs at the grid sequencing transition
   - Try running without grid sequencing
   - This may take longer but avoids the transition issue

6. **Use coupled solver instead of segregated**:
   - For high-speed compressible flow (Mach 5), the coupled solver may be more stable
   - The coupled implicit solver handles strong shocks better
   - Switch from segregated flow to coupled flow

### Community Report

> "Regardless of how I tune the AMG solver settings, I consistently encounter AMG solver divergence at the first iteration. Interestingly, after this initial error, the simulation proceeds normally and eventually converges with seemingly valid results."

## 5. Bad Cells at Interfaces from Cell Size Mismatch and Twisted CAD Topology

### Symptom

After mesh initialization, STAR-CCM+ reports 12% bad cells in a particular region. Mesh diagnostics show 0 invalid cells before initialization. The bad cells appear only after initialization, specifically at interfaces. The CAD has heavy perforation with fine refinement.

### Root Cause

Initialization also initializes interfaces in the model. If interfaces have significant differences in cell sizes on both sides, or if the physical intersection values cause the program to match cells outside the interface, bad cells appear after initialization. Additionally, twisted CAD topology (needle-shaped surfaces) near perforations creates mesh quality issues.

### Fix

1. **Match cell sizes at interfaces**:
   - "You most likely have an interface with significant differences in cell sizes on both sides"
   - Ensure similar mesh sizes on both sides of interfaces
   - Use mesh refinement controls to match sizes
   - The cell size ratio across an interface should be < 5:1

2. **Check interface type**:
   - Different mesh types at interfaces (poly and trimmed) can create bad cells
   - "Mesh elements at the interface were different (Poly and Trimmed cells) but mesh sizing was same"
   - Use the same mesh type on both sides if possible
   - Or use a conformal mesh interface

3. **Fix twisted CAD topology**:
   - "CAD surfaces connected to perforation were somewhat twisted in topology (needle shape)"
   - Clean up the CAD geometry before meshing
   - Remove or repair needle-shaped surfaces
   - Use CAD cleanup tools in 3D-CAD

4. **Use split by non-contiguous**:
   - In the Region view, use "split by non-contiguous"
   - This identifies disconnected mesh regions
   - Fix any unintended disconnections

5. **Check physical intersection values**:
   - "Your physical intersection values cause the program to match cells outside the interface"
   - Verify interface topology
   - Ensure interfaces only connect the intended regions

6. **Refine mesh at perforations**:
   - Heavy perforation requires careful mesh refinement
   - Use surface refinement on perforation edges
   - Use volumetric refinement near perforation regions
   - Balance refinement with cell quality

7. **Run mesh diagnostics after initialization**:
   - Don't rely only on pre-initialization diagnostics
   - Run diagnostics again after initialization
   - Fix bad cells that appear only after interface initialization

### Community Report

> "Initialization will also initialize interfaces in your model. You most likely have an interface with significant differences in cell sizes on both sides, and/or your physical intersection values cause the program to match cells outside the interface."

> "CAD surfaces connected to perforation were also somewhat twisted in topology (needle shape)."

## 6. Additional STAR-CCM+ Issues

### Lowering Relaxation Factors

**Issue**: Simulation diverges with default relaxation factors.
**Fix**: Lower relaxation factors for the problematic solver (e.g., species solver). Reduce by 50% from default. Gradually increase once convergence is stable.

### Volume Change Between 0.01 and 0.1

**Issue**: 4-8% of cells show volume change between 0.01 and 0.1.
**Fix**: This may be acceptable depending on the location. Check if these cells are in critical flow regions. Refine mesh in areas with large volume change.

### Supersonic Flow with Segregated Solver

**Issue**: Using velocity inlet with supersonic speed and segregated solver causes divergence.
**Fix**: Use the coupled solver for supersonic flow. The coupled implicit solver is designed for compressible high-speed flow.

### Porous Region Species Transport

**Issue**: Species transport through porous regions produces NaN residuals.
**Fix**: Check porous media properties. Verify that porosity and permeability are correct. Ensure species mass fractions sum to 1 in all regions.

## Best Practices

1. **Use polyhedral or trimmed mesh** — never tetrahedral for flow simulations
2. **Follow foundational tutorials first** — before attempting complex simulations
3. **Check field functions for division by zero** — add safeguards for near-zero denominators
4. **Use part-based meshing** — don't detach and delete geometry
5. **Create external fluid regions in 3D-CAD** — with proper subtraction and imprint
6. **Match cell sizes at interfaces** — keep ratio below 5:1
7. **Clean up twisted CAD topology** — especially near perforations and complex features
8. **Run mesh diagnostics after initialization** — not just before
9. **Start simple and build up** — fewer regions and physics first
10. **Use coupled solver for high-speed compressible flow** — segregated solver can't handle Mach 5+
