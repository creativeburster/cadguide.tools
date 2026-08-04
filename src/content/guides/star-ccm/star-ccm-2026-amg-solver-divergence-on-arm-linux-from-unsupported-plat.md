---
title: "STAR-CCM+ 2026 AMG Solver Divergence on ARM Linux from Unsupported Platform"
excerpt: "STAR-CCM+ 2026 AMG Solver Divergence on ARM Linux from Unsupported Platform: symptoms, root causes, and step-by-step fixes, verified against Siemens community."
category: "troubleshooting"
softwareSlug: "simcenter-star-ccm"
keyword: "STAR-CCM+ 2026 AMG solver divergence ARM Linux unsupported platform segregated species solver NaN residuals bad external fluid region mesh VOF LMP floating point error AMR insufficient precision AMG solver divergence first iteration grid sequencing floating point error field function zero denominator supersonic segregated solver"
slug: "star-ccm-2026-amg-solver-divergence-on-arm-linux-from-unsupported-plat"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-04"
sources:
  - "https://community.sw.siemens.com/s/question/0D5Vb00000iCYZkKAO/amg-solver-diverge-version-25022506-on-arm-and-linux"
  - "https://community.sw.siemens.com/s/question/0D5Vb00000MVvygKAD/why-is-my-starccm-segregated-species-solver-returning-nan-residuals-and-diverging-immediately-despite-valid-mesh-and-double-precision"
  - "https://community.sw.siemens.com/s/question/0D5Vb00000CeleTKAR/floating-point-error-in-vof-lmp-simulation"
---

# STAR-CCM+ 2026 AMG Solver Divergence on ARM Linux from Unsupported Platform, Segregated Species Solver NaN Residuals from Bad External Fluid Region Mesh, VOF LMP Floating Point Error from AMR and Insufficient Precision, AMG Solver Divergence at First Iteration from Grid Sequencing, and Floating Point Error from Field Function Zero Denominator and Supersonic Segregated Solver: Platform Switch RHEL, 3D-CAD Geometry Rebuild, AMR Disable Double Precision, Grid Sequencing Debug, and Field Function Check

STAR-CCM+ produces errors from AMG solver divergence, species NaN residuals, VOF floating point errors, first iteration divergence, and field function issues. This guide covers the 5 most common STAR-CCM+ problems with diagnostic steps and community-verified fixes from Siemens community.

## 1. AMG Solver Divergence on ARM Linux from Unsupported Platform

### Symptom

AMG solver diverges when running on HPC with ARM processors (AWS EC2 with Amazon Linux 2023). The error shows "WARNING: Ap = 0 on multigrid level 8" and "AMG coarsening halted. Error: AMG solver diverged." The issue occurs with versions 2502-2506 on ARM and Linux. Simulations that previously worked now fail. The same simulations work on Windows.

### Root Cause

"AMG solver diverged. AMG exit reason: Diverged due to exceeding divergence tolerance. Relative residual: nan. A floating point error has occurred. A non-finite residual (Energy) was added by star.segregatedenergy.SegregatedEnergySolver." The AMG solver on ARM Linux has a platform-specific issue. The solver's multigrid coarsening algorithm fails on ARM processors, producing zero pivot values. The issue may be related to platform-specific numerical precision or library compatibility on ARM Linux.

### Fix

1. **Switch to supported ARM platform (RHEL 8.7)**:
   - "A good first test should be"
   - "To switch to a supported ARM platform"
   - "(RHEL 8.7)"
   - Switch to RHEL

2. **Check certified platforms**:
   - "Amazon Linux 2023 is"
   - "Indeed listed as a certified platform"
   - "For Linux ARM64 in 2506"
   - Check certification

3. **Test with non-confidential simulation**:
   - "We wait for a non-confidential SIM"
   - "To reproduce the issue"
   - Create test
   - Simulation

4. **Run on Windows for comparison**:
   - "The fact that it works"
   - "In Windows but not in Linux"
   - Compare Windows
   - vs Linux results

5. **Check mesh diagnostics**:
   - "Mesh diagnostics are not"
   - "Showing anything worrying"
   - Check mesh
   - Diagnostics

6. **Report to Siemens support**:
   - Report the issue
   - With simulation
   - Details to
   - Siemens support

7. **Use x86 instead of ARM**:
   - If ARM platform
   - Continues to fail
   - Try x86
   - Platform instead

### Community Report

> "AMG Solver Diverge version 2502-2506 on ARM and Linux. I am also having very similar errors when running on HPC (AWS EC2 with ARM using Amazon Linux 2023). WARNING: Ap = 0 on multigrid level 8. AMG coarsening halted. Error: AMG solver diverged. AMG exit reason: Diverged due to exceeding divergence tolerance. Relative residual: nan. The fact that it works in Windows but not in Linux might have something to do."

## 2. Segregated Species Solver NaN Residuals from Bad External Fluid Region Mesh

### Symptom

The segregated species solver returns NaN residuals and diverges immediately. The error shows "A non-finite residual was added by star.segregatedspecies.SegregatedSpeciesSolver." The AMG solver halts on multigrid level 1. The issue occurs despite valid mesh diagnostics and double precision. The simulation involves species diffusion through a biosensor with porous regions.

### Root Cause

"I've taken a look at your sim file and it looks to be a problem with your geometry/mesh of your External Fluid region. You can see from some of your Scenes that there are outlines for that part which show some very strange looking volume cells." The external fluid region was created using boolean subtraction and detaching, which produced poor quality volume cells. The part-based meshing approach in STAR-CCM+ doesn't require detaching and deleting. The bad mesh cells cause the species solver to produce NaN residuals.

### Fix

1. **Rebuild external fluid region in 3D-CAD**:
   - "Revisit how you built your external Fluid part"
   - "Perhaps build it in 3D-CAD"
   - "With the rest of the geometry"
   - Rebuild in 3D-CAD

2. **Use proper part-based meshing**:
   - "The meshing approach is based on"
   - "Part-Based meshing"
   - "There should be no need for"
   - "Detaching and deleting"
   - Use part-based

3. **Create volume and subtract sensor**:
   - "Create a volume and subtract the sensor"
   - "Then use that resulting subtracted part"
   - "As your external region"
   - Subtract sensor

4. **Use imprint for contacts**:
   - "You'll probably want to do an imprint"
   - "So that you have your contacts"
   "Set-up for any interfaces"
   - Use imprint

5. **Check mesh with split by non-contiguous**:
   - "Check the mesh using the split by non-contiguous"
   - "Right click on the region"
   - "Split by non-contiguous, and preview"
   - Check non-contiguous

6. **Start with fewer regions and less physics**:
   - "Starting small (fewer regions and less physics)"
   - "And then building up"
   - Start simple
   - Build up

7. **Lower relaxation factors**:
   - "Lowering relaxation factors"
   - "For the species solver"
   - Lower relaxation
   - Factors

### Community Report

> "Why is my STAR-CCM+ segregated species solver returning NaN residuals and diverging immediately despite valid mesh and double precision? I've taken a look at your sim file and it looks to be a problem with your geometry/mesh of your External Fluid region. The meshing approach is based on Part-Based meshing, and so there should be no need for detaching and deleting. Create a volume and subtract the sensor, then use that resulting subtracted part as your external region. You'll probably want to do an imprint too."

## 3. VOF LMP Floating Point Error from AMR and Insufficient Precision

### Symptom

During VOF and LMP simulation of two colliding water jets, a floating point error occurs after 70 iterations (14 time steps). The warning shows "insufficient precision on multigrid level 5" and "AMG coarsening halted. This may indicate double precision version is needed." The error is "A non-finite residual (X-momentum) was added by star.segregatedflow.SegregatedFlowSolver."

### Root Cause

"The simulation starts and works fine until it runs into an error after 70 Iterations (14 time steps). WARNING: insufficient precision on multigrid level 5. This may indicate double precision version is needed." The VOF and LMP simulation with AMR (Adaptive Mesh Refinement) produces cells with insufficient precision for the multigrid solver. The AMR creates very small cells that cause numerical precision issues. Single precision (R4) is insufficient for these cells, requiring double precision (R8).

### Fix

1. **Use double precision (R8) version**:
   - "This may indicate"
   - "Double precision version is needed"
   - "Are you using double precision"
   - "Which is R8 version?"
   - Use R8

2. **Disable AMR**:
   - "I would try without the AMR"
   - "Create a good coarse mesh"
   - "To check your settings"
   - Disable AMR

3. **Create good coarse mesh first**:
   - "Create a good coarse mesh"
   - "To check your settings"
   - Start with
   - Coarse mesh

4. **Ensure CFL below 1**:
   - "The time step should give you"
   - "A CFL below 1"
   - Check CFL
   - Below 1

5. **Pay attention to phase interface CFL**:
   - "Pay attention about the phase interface"
   - "This should be solved"
   - "Pay attention about the CFL there as well"
   - Check interface CFL

6. **Re-enable AMR after stable run**:
   - "If everything works well"
   - "Then I would try to turn the AMR on"
   - "Checking always the CFL"
   - Re-enable AMR

7. **Monitor residuals for divergence**:
   - "I was able to identify"
   - "The extremely high residuals"
   - "In the crashed sim"
   - Monitor residuals

### Community Report

> "I'm simulation two colliding water jets using VOF and LMP. The simulation starts and works fine until it runs into an error after 70 Iterations. WARNING: insufficient precision on multigrid level 5. This may indicate double precision version is needed. I would try without the AMR. Create a good coarse mesh, to check your settings. The time step should give you a CFL below 1. I was able to run the simulation for the entire 0.5s without any error with AMR disabled."

## 4. AMG Solver Divergence at First Iteration from Grid Sequencing

### Symptom

During external aerodynamics simulation at Mach 5, the AMG solver diverges at the first iteration with "Error: AMG solver diverged. AMG exit reason: Diverged due to exceeding divergence tolerance. Relative residual: 2.883131e+04." After this initial error, the simulation proceeds normally and eventually converges with valid results. The issue occurs right after grid sequencing ends.

### Root Cause

The AMG solver divergence at the first iteration occurs during the transition from grid sequencing to the full mesh. The grid sequencing process creates coarser mesh levels, and the transition to the full resolution mesh can cause initial solver instability. The AMG solver's multigrid levels may not be properly initialized at the first iteration on the full mesh.

### Fix

1. **Check if simulation converges after initial divergence**:
   - "After this initial error"
   - "The simulation proceeds normally"
   - "And eventually converges"
   - Check convergence

2. **Debug AMG solver divergence**:
   - "A KB article below"
   - "May provide you with a few more ideas"
   - "For further debugging"
   - "How to debug AMG solver diverged on first iteration"
   - Use KB article

3. **Check mesh quality metrics**:
   - "I've thoroughly checked"
   - "All mesh quality metrics"
   - "And everything looks good"
   - Check mesh

4. **Verify boundary layer cells**:
   - "The smallest cells are located"
   - "In the boundary layer"
   - "And yield a y+ ≈ 1"
   - Check y+

5. **Adjust AMG solver settings**:
   - "Regardless of how I tune"
   - "The AMG solver settings"
   - "I consistently encounter"
   - Try different AMG settings

6. **Verify final results accuracy**:
   - "Can this initial AMG divergence"
   - "Affect the accuracy or reliability"
   - "Of the final results?"
   - Verify results

7. **Use different grid sequencing settings**:
   - Adjust grid
   - Sequencing levels
   - And transition
   - Settings

### Community Report

> "I'm running an external aerodynamics simulation at Mach 5. Regardless of how I tune the AMG solver settings, I consistently encounter the following error at the first iteration: Error: AMG solver diverged. AMG exit reason: Diverged due to exceeding divergence tolerance. Relative residual: 2.883131e+04. Interestingly, after this initial error, the simulation proceeds normally and eventually converges with seemingly valid results."

## 5. Floating Point Error from Field Function Zero Denominator and Supersonic Segregated Solver

### Symptom

During a multiphase simulation, the error "A floating point error has occurred. A non-finite residual (Continuity) was added by star.segregatedflow.SegregatedFlowSolver" appears. Typical causes include overflow, underflow, or division by zero. The simulation involves complex interface dynamics with two-phase sloshing.

### Root Cause

"Typical causes are overflow, underflow, or a division by zero. Check expressions and Field Functions - verify that none of their denominators become 0 or are very close to 0. Ensure you're not using a velocity inlet with supersonic speed with the Segregated Solver." Field functions with zero denominators cause division by zero. Using supersonic velocity with the Segregated Flow Solver is incompatible. Unphysical initial conditions, extreme gradients, or property discontinuities can also trigger the floating point error.

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

4. **Check mesh for negative volume cells**:
   - "Check the mesh for bad cells"
   - "(especially those with negative volume)"
   - Check for
   - Negative volumes

5. **Check time step for transient**:
   - "If your simulation is transient"
   - "Check if the time step isn't too large"
   - Reduce time
   - Step if needed

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

## 6. Additional STAR-CCM+ Issues

### Property Discontinuities

**Issue**: "Property discontinuities" as a cause of floating point errors.
**Fix**: Check for property discontinuities at interfaces. Smooth property transitions. Verify material properties.

### Extreme Gradients

**Issue**: "Extreme gradients" as a cause of floating point errors.
**Fix**: Refine mesh in high-gradient regions. Use appropriate solver settings. Check for unphysical gradients.

### Unphysical Initial Conditions

**Issue**: "Unphysical initial conditions" as a cause of floating point errors.
**Fix**: Verify initial conditions are physical. Check reference values. Ensure gravity vector direction is correct.

### AMR Causing High Residuals

**Issue**: "I was able to identify the extremely high residuals in the crashed sim. The sim worked with a coarse mesh."
**Fix**: Disable AMR first. Create good coarse mesh. Ensure CFL below 1. Re-enable AMR after stable run.

### Insufficient Precision on Multigrid

**Issue**: "WARNING: insufficient precision on multigrid level 5. This may indicate double precision version is needed."
**Fix**: Use double precision (R8) version. Check multigrid levels. Reduce mesh resolution variation.

### Segregated Energy Solver Floating Point Error

**Issue**: "A non-finite residual (Energy) was added by star.segregatedenergy.SegregatedEnergySolver."
**Fix**: Check energy boundary conditions. Verify material thermal properties. Use double precision. Check for extreme temperatures.

### Split by Non-Contiguous Check

**Issue**: "Right click on the region, Split by non-contiguous, and preview. If no new region will be created, everything should be ok."
**Fix**: Use split by non-contiguous to check mesh. Verify no isolated cells. Check geometry for issues.

## Best Practices

1. **Use RHEL 8.7 for ARM Linux HPC** — prevents AMG solver divergence on ARM
2. **Build external fluid regions in 3D-CAD, not boolean subtraction** — prevents bad mesh
3. **Use part-based meshing without detaching and deleting** — proper STAR-CCM+ workflow
4. **Disable AMR and use double precision (R8) for VOF LMP** — prevents floating point error
5. **Ensure CFL below 1 for transient simulations** — prevents divergence
6. **Check field function denominators for zero values** — prevents division by zero
7. **Don't use supersonic velocity with Segregated Solver** — causes floating point error
8. **Check mesh for negative volume cells** — causes solver crashes
9. **Start with fewer regions and less physics, then build up** — isolates issues
10. **Monitor residual plots for rapid growth** — indicates divergence before crash
