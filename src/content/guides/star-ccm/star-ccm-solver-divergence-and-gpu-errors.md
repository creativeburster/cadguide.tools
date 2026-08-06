---
title: "STAR-CCM+ Solver Divergence and GPU Errors"
excerpt: "STAR-CCM+ Solver Divergence and GPU Errors: symptoms, root causes, and step-by-step fixes, verified against Siemens Community Forum."
category: "troubleshooting"
softwareSlug: "simcenter-star-ccm"
keyword: "STAR-CCM+ AMG solver diverged ARM Linux platform-specific bug supported OS migration segregated species solver NaN residuals bad external fluid region geometry part-based meshing floating point error non-finite residual continuity division by zero bad boundary conditions systematic debugging GPU acceleration calculation stuck unsupported segregated flow LES models CPU mode AMG solver divergence first iteration grid sequencing AMG tuning"
slug: "star-ccm-solver-divergence-and-gpu-errors"
author: "CADGuide Tools Editorial Team"
readTime: "13 min"
date: "2025-08-03"
sources:
  - "https://community.sw.siemens.com/s/question/0D5Vb00000iCYZkKAO/amg-solver-diverge-version-25022506-on-arm-and-linux"
  - "https://community.sw.siemens.com/s/question/0D5Vb00000MVvygKAD/why-is-my-starccm-segregated-species-solver-returning-nan-residuals-and-diverging-immediately-despite-valid-mesh-and-double-precision"
  - "https://community.sw.siemens.com/s/question/0D5Vb00000duTTzKAM/how-to-identify-root-cause-of-floating-point-error-nonfinite-residual-in-continuity-in-starccm"
---

# STAR-CCM+ Solver Divergence and GPU Errors: AMG Solver Diverged on ARM Linux from Platform-Specific Bug Requiring Supported OS Migration, Segregated Species Solver NaN Residuals from Bad External Fluid Region Geometry Requiring Part-Based Meshing, Floating Point Error Non-Finite Residual in Continuity from Division by Zero or Bad Boundary Conditions Requiring Systematic Debugging, GPU Acceleration Calculation Stuck from Unsupported Segregated Flow and LES Models Requiring CPU Mode, and AMG Solver Divergence at First Iteration from Grid Sequencing Transition Requiring AMG Tuning

STAR-CCM+'s AMG solver, segregated species model, floating point calculations, GPU acceleration, and grid sequencing transitions produce errors from platform-specific bugs, geometry creation issues, division by zero, unsupported GPU models, and AMG parameter tuning. This guide covers the 5 most common STAR-CCM+ problems with diagnostic steps and community-verified fixes from Siemens Community Forum.

## 1. AMG Solver Diverged on ARM Linux from Platform-Specific Bug

### Symptom

Running STAR-CCM+ 2502-2506 on HPC (AWS EC2 with ARM using Amazon Linux 2023), the AMG solver diverges. The error appears: "WARNING: Ap = 0 on multigrid level 8, nRows = 408, blockSize = 1. AMG coarsening halted. Error: AMG solver diverged. AMG exit reason: Diverged due to exceeding divergence tolerance. Relative residual: nan." Simulations that worked perfectly fine in the past now fail. The error works on Windows but not on Linux. Mesh diagnostics show nothing worrying.

### Root Cause

The AMG solver divergence on ARM/Linux is a platform-specific bug in STAR-CCM+ versions 2502-2506. The AMG (Algebraic Multi-Grid) coarsening algorithm fails on ARM architecture with Amazon Linux 2023, producing "Ap = 0" warnings and NaN residuals. The bug was introduced in version 2502 and persists through 2506. While Amazon Linux 2023 is listed as a certified platform for Linux ARM64, the AMG solver has a compatibility issue that causes divergence on this specific platform. The same simulation runs correctly on Windows.

### Fix

1. **Switch to a supported ARM platform**:
   - Migrate to RHEL 8.7 for ARM
   - Test if the divergence resolves

2. **Run on Windows instead**:
   - If possible, run on Windows
   - The AMG solver works correctly on Windows
   - Use Windows HPC for critical simulations

3. **Provide a non-confidential SIM to reproduce**:
   - Create a simplified version of the simulation
   - Remove confidential geometry
   - Share on the Siemens forum for debugging

4. **Roll back to version 2410**:
   - Version 2410 didn't have this bug
   - Roll back to 2410
   - Wait for a fix in a future version

5. **Report the issue to Siemens**:
   - Open a support case
   - Provide the simulation file
   - Include the error log

6. **Check mesh diagnostics**:
   - Verify mesh quality
   - Check for negative volumes
   - Ensure mesh is valid

7. **Use a different solver setting**:
   - Try different AMG solver settings
   - Adjust coarsening parameters
   - Change the multigrid levels
   - Test if different settings avoid the bug

### Community Report

> "I am also having very similar errors when running on HPC (AWS EC2 with ARM using Amazon Linux 2023). I think the error starting to happen with version 2502 but is still happening with 2506. Simulations that worked perfectly fine in the past are now failing. WARNING: Ap = 0 on multigrid level 8. AMG coarsening halted. Error: AMG solver diverged. The fact that it works in Windows but not Linux might have something to do. A good first test should be to switch to a supported ARM platform (RHEL 8.7)."

## 2. Segregated Species Solver NaN Residuals from Bad External Fluid Region Geometry

### Symptom

Simulating diffusion of glucose and oxygen through a biosensor in STAR-CCM+ using the segregated species model. Despite ensuring all mass fractions sum to 1, the simulation results in immediate divergence in the AMG solver with NaN residuals for H2O, glucose, and oxygen. The error: "A non-finite residual was added by star.segregatedspecies.SegregatedSpeciesSolver." The AMG solver halts on multigrid level 1. Double precision is enabled. Mesh diagnostics show valid mesh with no negative volumes.

### Root Cause

"It looks to be a problem with your geometry/mesh of your External Fluid region." The external fluid region was created incorrectly using boolean subtraction and then detaching and deleting the original block. This approach doesn't follow STAR-CCM+'s Part-Based meshing methodology. "The meshing approach in Simcenter STAR-CCM+ is based on Part-Based meshing, and so there should be no need for detaching and deleting." The incorrect geometry creation leads to strange volume cells that cause the solver to produce NaN residuals. The mesh appears valid in diagnostics but has underlying geometric issues.

### Fix

1. **Rebuild the external fluid region in 3D-CAD**.

2. **Use Part-Based meshing correctly**:
   - Don't detach and delete

3. **Perform an imprint**:
   - Imprint ensures proper interfaces between regions
   - This enables correct species transport

4. **Check for isolated cells**.

5. **Start small and build up**:
   - Remove the external part first
   - Test if the simulation runs without it
   - Then add it back with correct geometry

6. **Lower relaxation factors**:
   - Reduce relaxation factors to 0.3 or lower
   - This stabilizes the solver
   - Gradually increase as the simulation stabilizes

7. **Reduce time steps**:
   - Use smaller time steps
   - This helps the solver converge
   - Gradually increase once stable

### Community Report

> "Despite ensuring that all mass fractions sum to 1, running the simulation results in immediate divergence with NaN residuals. I've taken a look at your sim file and it looks to be a problem with your geometry/mesh of your External Fluid region. The meshing approach in Simcenter STAR-CCM+ is based on Part-Based meshing, and so there should be no need for detaching and deleting. What you want to do is create a volume and subtract the sensor, then use that resulting subtracted part as your external region. You'll probably want to do an imprint too."

## 3. Floating Point Error Non-Finite Residual in Continuity from Division by Zero or Bad Boundary Conditions

### Symptom

During a multiphase simulation in STAR-CCM+, the error appears: "A floating point error has occurred. A non-finite residual (Continuity) was added by star.segregatedflow.SegregatedFlowSolver. Typical causes are overflow, underflow, or a division by zero." The simulation involves a two-phase sloshing setup with parahydrogen and vapor. The error occurs unpredictably and is difficult to trace to a specific cause.

### Root Cause

"There is no clear procedure for troubleshooting such errors, as there are many possible causes." The floating point error occurs when the continuity equation solver encounters a non-finite value (NaN or infinity). This can be caused by: (1) division by zero in expressions or field functions, (2) unphysical initial conditions, (3) extreme gradients in the solution, (4) property discontinuities at interfaces, (5) bad mesh cells with negative volumes, (6) incorrect boundary conditions (e.g., supersonic velocity with Segregated Solver), (7) time step too large for transient simulations, (8) incorrect gravity vector direction.

### Fix

1. **Check expressions and Field Functions**:
   - Review all field functions
   - Check for division operations
   - Add safeguards: `if(abs(denominator) < 1e-10, 0, numerator/denominator)`

2. **Check Boundary Conditions**:
   - Review all boundary conditions
   - Check for unphysical values

3. **Check Initial Conditions and Reference Values**:
   - Verify gravity is in the correct direction
   - Check initial pressure, velocity, temperature
   - Ensure they are physical

4. **Check the mesh for bad cells**:
   - Run mesh diagnostics
   - Check for negative volumes
   - Repair or remesh bad cells

5. **Check the time step**:
   - Reduce the time step
   - Use adaptive time stepping
   - Monitor CFL number

6. **Check the simulation log for warnings**:
   - Look for warnings before the error
   - Warnings often precede the crash
   - Address warnings proactively

7. **Monitor convergence**.

8. **Read the KB article**:
   - Follow the systematic debugging steps
   - Use the Support Center resources

### Community Report

> "A floating point error has occurred. A non-finite residual (Continuity) was added by star.segregatedflow.SegregatedFlowSolver. Typical causes are overflow, underflow, or a division by zero. There is no clear procedure for troubleshooting such errors. Check expressions and Field Functions — verify that none of their denominators become 0. Check Boundary Conditions, Initial Conditions, and Reference Values. Check the mesh for bad cells. If transient — check if the time step isn't too large."

## 4. GPU Acceleration Calculation Stuck from Unsupported Segregated Flow and LES Models

### Symptom

Performing a CFD simulation of 3-Mach wall-interfered cylinder flow using STAR-CCM+ 2502. The model uses a pseudo-2D setup with symmetry plane, segregated flow model, and large eddy simulation (LES) with ideal gas. Whenever GPU acceleration is enabled, the calculation freezes. With GPU acceleration disabled, it runs normally.

### Root Cause

"GPU acceleration currently supports: Coupled flow solver (compressible/incompressible), Certain turbulence models (e.g., RANS). Segregated flow solver and LES are generally not fully supported on GPU." The GPU acceleration in STAR-CCM+ doesn't fully support the segregated flow solver and LES turbulence model. When GPU is enabled with these models, the GPU kernels for these physics are incomplete or experimental, causing the solver to hang. The calculation freezes because the GPU can't process the segregated flow or LES equations, and the solver doesn't gracefully fall back to CPU.

### Fix

1. **Disable GPU acceleration**:
   - Turn off GPU acceleration
   - Use CPU-only mode
   - The simulation will run correctly

2. **Use Coupled Flow solver instead**:
   - Switch from segregated to coupled flow solver
   - This is supported on GPU
   - May require adjusting solver settings

3. **Use RANS instead of LES**:
   - "Certain turbulence models (e.g., RANS)" are supported
   - Switch from LES to RANS (e.g., k-omega SST)
   - RANS is GPU-accelerated
   - LES is not fully supported on GPU

4. **Check GPU compatibility**:
   - Review the STAR-CCM+ GPU support documentation
   - Ensure your physics models are GPU-compatible
   - Don't enable GPU for unsupported models

5. **Use GPU for specific solvers only**:
   - Some solvers in STAR-CCM+ can use GPU
   - Others must run on CPU
   - Configure which solvers use GPU
   - Leave unsupported solvers on CPU

6. **Update STAR-CCM+**:
   - GPU support is expanding with each version
   - Check if newer versions support your models
   - Update to the latest version
   - Test GPU with your physics

7. **Contact Siemens support**:
   - If you need GPU acceleration for LES
   - Contact Siemens about GPU roadmap
   - LES GPU support may be in development
   - Use CPU in the meantime

### Community Report

> "Whenever I enable GPU acceleration, the calculation freezes—whereas it runs normally when GPU acceleration is disabled. GPU acceleration currently supports: Coupled flow solver, Certain turbulence models (e.g., RANS). Segregated flow solver and LES are generally not fully supported on GPU. If you enable GPU with these models, the solver may hang because the GPU kernels for these physics are incomplete or experimental."

## 5. AMG Solver Divergence at First Iteration from Grid Sequencing Transition

### Symptom

Running an external aerodynamics simulation at Mach 5 in STAR-CCM+. Regardless of AMG solver settings, the error consistently appears at the first iteration: "Error: AMG solver diverged. AMG exit reason: Diverged due to exceeding divergence tolerance. Relative residual: 2.883131e+04." After this initial error, the simulation proceeds normally and eventually converges with seemingly valid results. Mesh quality metrics are good, with y+ approximately 1 in the boundary layer.

### Root Cause

The AMG solver divergence at the first iteration occurs during the transition from grid sequencing to the full mesh. "Why does this happen specifically at the first iteration, right after grid sequencing ends?" During grid sequencing, the solver works on a coarsened mesh. When grid sequencing ends and the solver transitions to the full mesh, the AMG solver must initialize on the full resolution mesh. The initial conditions from the coarsened mesh may not be perfectly compatible with the full mesh, causing a momentary divergence. The solver then recovers and proceeds normally.

### Fix

1. **Check the KB article**:
   - Follow the debugging steps in the KB article
   - This is a known phenomenon

2. **Tune AMG solver settings**:
   - Try different AMG coarsening levels
   - Adjust the AMG tolerance
   - Change the cycle type (V-cycle, W-cycle, F-cycle)

3. **Adjust grid sequencing settings**:
   - Change the number of grid sequencing levels
   - Reduce or increase levels
   - Adjust the grid sequencing iterations
   - Test different configurations

4. **Check if results are affected**:
   - If the simulation converges normally after
   - The initial divergence may be benign
   - Verify results against known data

5. **Use a different initialization**:
   - Change the initialization method
   - Use a more gradual initialization
   - Initialize from a previous solution
   - This may avoid the initial divergence

6. **Refine the mesh**:
   - Check boundary layer cells
   - Ensure smooth transitions
   - Avoid extremely small cells

7. **Monitor the simulation**:
   - Monitor residuals after the first iteration
   - If residuals decrease normally
   - The initial divergence is likely benign

8. **Use coupled solver**:
   - If the segregated solver diverges at first iteration
   - Try the coupled solver
   - It may handle the transition better
   - Test and compare results

### Community Report

> "Regardless of how I tune the AMG solver settings, I consistently encounter the error at the first iteration: Error: AMG solver diverged. Relative residual: 2.883131e+04. Interestingly, after this initial error, the simulation proceeds normally and eventually converges with seemingly valid results. Why does this happen specifically at the first iteration, right after grid sequencing ends? A KB article may provide you with a few more ideas for further debugging: How to debug 'AMG solver diverged on first iteration'."

## 6. Additional STAR-CCM+ Issues

### Non-Finite Residual in Energy

**Issue**: "A non-finite residual (Energy) was added by star.segregatedenergy.SegregatedEnergySolver."
**Fix**: Check energy boundary conditions. Verify temperature values. Check material properties. Reduce energy relaxation factor.

### AMG Coarsening Halted

**Issue**: "WARNING: Ap = 0 on multigrid level 8. AMG coarsening halted."
**Fix**: Reduce multigrid levels. Adjust coarsening parameters. Check matrix conditioning. Use a different AMG cycle type.

### Server Error After Divergence

**Issue**: "error: Server Error" after AMG divergence.
**Fix**: Restart the simulation. Check server connection. Increase memory allocation. Reduce mesh size if memory-constrained.

### RisaSection Properties Mismatch

**Issue**: Imported section properties don't match between RisaSection and Risa-3D.
**Fix**: "Risa-3D only uses the dimensions of 1 web and 2 flanges to re-calculate all section properties." Use Tapered WF for simple shapes. Verify properties manually for complex shapes.

### Castellated Beam Freezing

**Issue**: "While optimizing castellated beam sizes, the program may have failed to correctly determine an e-max."
**Fix**: "The optimization process for certain castellated beam designs stalled during a Design All." Manually specify opening spacing. Run design for individual beams. Update to latest version.

### Web Opening Tee Buckling Display

**Issue**: "An incorrect demand/capacity ratio greater than 1.0 was listed for the opening, even if the opening passed."
**Fix**: "The design report listed the correct value." Check the design report, not the display. Update to version with fix. Report to Bentley if persistent.

## Best Practices

1. **Use supported OS platforms for HPC** — RHEL 8.7 for ARM, not Amazon Linux 2023
2. **Follow Part-Based meshing methodology** — don't detach and delete parts
3. **Use 3D-CAD for geometry creation** — ensure consistent geometry with imprints
4. **Check all field functions for division by zero** — add safeguards
5. **Verify boundary conditions are physical** — no supersonic velocity with Segregated Solver
6. **Don't enable GPU for unsupported models** — segregated flow and LES are not GPU-ready
7. **Use Coupled Flow + RANS for GPU acceleration** — these are supported
8. **Monitor residuals after first iteration** — initial AMG divergence may be benign
9. **Check the simulation log for warnings** — warnings often precede crashes
10. **Start with simple models and build up** — isolate the source of divergence
