---
title: "OpenFOAM Solver Convergence and FSI Errors: Floating Point Exception from leastSquaresVectors Mesh Motion in FSI Requiring preCICE 3.3.0 Update, Residuals Suddenly Explode After Convergence from Mesh Quality or Boundary Conditions Requiring Mesh Refinement, FSI Simulation Crash from Interface Decomposition Splitting Coupling Boundary Requiring Decomposition Avoidance, Solid Solver Relative Residuals Not Converging from Under-Relaxation Factor Requiring BC and Rheology Verification, and chtMultiRegionFoam Steady State Not Stopping from Transient Solver Misunderstanding Requiring localEuler or chtMultiRegionSimpleFoam"
excerpt: "OpenFOAM fails for 5 distinct reasons: floating point exception from leastSquaresVectors mesh motion in FSI requiring preCICE 3.3.0 update, residuals suddenly explode after convergence from mesh quality or boundary conditions requiring mesh refinement, FSI simulation crash from interface decomposition splitting coupling boundary requiring decomposition avoidance, solid solver relative residuals not converging from under-relaxation factor requiring BC and rheology verification, and chtMultiRegionFoam steady state not stopping from transient solver misunderstanding requiring localEuler or chtMultiRegionSimpleFoam. We cover each with fixes from CFD Online Forums and preCICE Forum."
category: "solver-convergence-and-fsi-errors"
softwareSlug: "openfoam"
keyword: "OpenFOAM floating point exception leastSquaresVectors mesh motion FSI preCICE 3.3.0 update residuals explode convergence mesh quality boundary conditions mesh refinement FSI simulation crash interface decomposition splitting coupling boundary decomposition avoidance solid solver relative residuals not converging under-relaxation factor BC rheology verification chtMultiRegionFoam steady state not stopping transient solver localEuler chtMultiRegionSimpleFoam"
slug: "openfoam-solver-convergence-fsi-errors-floating-point-exception-leastsquaresvectors-mesh-motion-residuals-explode-fsi-simulation-crash-interface-decomposition-solid-solver"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-03"
sources:
  - "https://precice.discourse.group/t/elastic-tube-3d-tutorial-fails-with-openfoam-v2406/2469"
  - "https://www.cfd-online.com/Forums/openfoam-solving/227276-residuals-suddenly-explode-aerodynamics.html"
  - "https://precice.discourse.group/t/openfoam-calculix-fsi-simulation-crashes-at-5s-help-needed/2549"
---

# OpenFOAM Solver Convergence and FSI Errors: Floating Point Exception from leastSquaresVectors Mesh Motion in FSI Requiring preCICE 3.3.0 Update, Residuals Suddenly Explode After Convergence from Mesh Quality or Boundary Conditions Requiring Mesh Refinement, FSI Simulation Crash from Interface Decomposition Splitting Coupling Boundary Requiring Decomposition Avoidance, Solid Solver Relative Residuals Not Converging from Under-Relaxation Factor Requiring BC and Rheology Verification, and chtMultiRegionFoam Steady State Not Stopping from Transient Solver Misunderstanding Requiring localEuler or chtMultiRegionSimpleFoam

OpenFOAM's mesh motion, residual convergence, FSI coupling, solid solver, and multi-region solvers produce errors from floating-point exceptions, residual explosion, interface decomposition, under-relaxation, and steady-state misunderstandings. This guide covers the 5 most common OpenFOAM problems with diagnostic steps and community-verified fixes from CFD Online Forums and preCICE Forum.

## 1. Floating Point Exception from leastSquaresVectors Mesh Motion in FSI

### Symptom

Running the elastic-tube-3D tutorial with OpenFOAM v2406 or v2412. The OpenFOAM solver diverges early in the simulation. Exploding pressure residuals and eventually a floating-point exception related to mesh motion. Stack trace shows: Foam::leastSquaresVectors::calcLeastSquaresVectors() → Foam::leastSquaresVectors::movePoints() → Foam::fvMesh::movePoints() → Foam::dynamicMotionSolverFvMesh::update(). The simulation crashes with "Floating point exception (core dumped)."

### Root Cause

"This was actually a bug in the QR3 filter set as default preCICE v3.2.0, which affected this tutorial." The preCICE v3.2.0 release introduced a QR3 filter as the default coupling filter. This filter causes numerical instability in the mesh motion calculation for the elastic-tube-3D tutorial. The leastSquaresVectors gradient calculation encounters degenerate cells during mesh motion, producing NaN values. The NaN propagates through the solver, causing the floating-point exception.

### Fix

1. **Update to preCICE v3.3.0**:
   - "This was actually a bug in the QR3 filter set as default preCICE v3.2.0"
   - "Update to v3.3.0"
   - preCICE v3.3.0 fixes the QR3 filter bug
   - This is the primary fix

2. **Use preCICE v3.1.2 as fallback**:
   - "I can always run elastic-tube-3d and my pipe FSI cases without any issues using OpenFOAM-v2406 and preCICE-3.1.2"
   - If v3.3.0 is not available
   - Downgrade to preCICE v3.1.2
   - This version doesn't have the QR3 filter issue

3. **Change the coupling filter**:
   - If stuck with preCICE v3.2.0
   - Change the coupling filter from QR3 to another type
   - Edit the preCICE configuration XML
   - Set the filter to QR1 or RBF

4. **Check mesh quality before FSI**:
   - Run checkMesh on the OpenFOAM mesh
   - Ensure no degenerate cells
   - Fix mesh quality issues before running FSI
   - Degenerate cells amplify the gradient calculation errors

5. **Use different gradient scheme**:
   - Instead of leastSquares
   - Try Gauss linear for gradient calculation
   - Edit fvSchemes:
   ```
   gradSchemes
   {
     default Gauss linear;
   }
   ```
   - This may avoid the leastSquaresVectors crash

6. **Verify OpenFOAM version compatibility**:
   - "If v2412 works, v2406 should also work"
   - The issue is preCICE version, not OpenFOAM version
   - But verify both are compatible
   - Check preCICE adapter compatibility matrix

### Community Report

> "The elastic-tube-3D tutorial fails with OpenFOAM v2406. The OpenFOAM solver diverges early with exploding pressure residuals and a floating-point exception related to mesh motion. Stack trace: Foam::leastSquaresVectors::calcLeastSquaresVectors() → Foam::fvMesh::movePoints(). This was actually a bug in the QR3 filter set as default preCICE v3.2.0. Update to v3.3.0. I can always run elastic-tube-3d without issues using OpenFOAM-v2406 and preCICE-3.1.2."

## 2. Residuals Suddenly Explode After Convergence from Mesh Quality or Boundary Conditions

### Symptom

Running an Ahmed body aerodynamics simulation with simpleFoam and k-omega SST. At approximately 1800 iterations, the simulation appears to have converged. Then residuals suddenly go crazy — they explode without warning. A few iterations later, the simulation crashes. Pressure and velocity plots show non-physical values.

### Root Cause

Sudden residual explosion after apparent convergence is typically caused by: (1) mesh quality issues — high non-orthogonality or skewness that accumulates errors over time, (2) boundary condition instability — especially at outlet boundaries where reversed flow can develop, (3) turbulence model issues — k-omega SST can produce unphysical values near separation points, (4) insufficient non-orthogonal correctors, or (5) relaxation factors too high causing oscillatory behavior.

### Fix

1. **Check mesh quality**:
   - Run checkMesh
   - Look for high non-orthogonality (>70 degrees)
   - Check skewness and aspect ratio
   - Refine mesh in critical areas
   - "Mesh OK" with skewness 3.38809 may still have issues

2. **Add non-orthogonal correctors**:
   - In fvSolution:
   ```
   SIMPLE
   {
     nNonOrthogonalCorrectors 2;
   }
   ```
   - If mesh has non-orthogonality
   - Use 2-3 non-orthogonal correctors
   - This improves pressure-velocity coupling

3. **Reduce relaxation factors**:
   - Current: p 0.3, U 0.7, k 0.7, omega 0.7
   - Try lower values: p 0.1, U 0.5, k 0.3, omega 0.3
   - Lower relaxation factors slow convergence but improve stability
   - Gradually increase after stability is achieved

4. **Check boundary conditions**:
   - Verify outlet boundary condition
   - Use pressureOutlet for outlet
   - Check for reversed flow at outlet
   - Use inletOutlet for velocity at outlet if needed

5. **Use potentialFlow initialization**:
   - "potentialFlow { nNonOrthogonalCorrectors 10; }"
   - Initialize with potential flow before running the full solver
   - This provides a better initial field
   - Reduces the chance of divergence

6. **Monitor flow field**:
   - Output fields at regular intervals
   - Watch for non-physical values
   - Check velocity and pressure at the explosion point
   - Identify which region triggers the explosion

7. **Adjust solver tolerances**:
   - Current: p tolerance 1e-7, relTol 0.001
   - Try tighter relTol: 0.0001
   - Or looser tolerance: 1e-6
   - Find the balance between accuracy and stability

8. **Use GAMG for pressure**:
   - Already using GAMG for p — good
   - Check GAMG parameters: smoother, tolerance
   - Try different smoothers: DIC, GaussSeidel
   - Adjust cacheAgglomeration

### Community Report

> "I'm simulating an Ahmed body with simpleFoam and k-omega SST. At ~1800 iterations, the simulation seems to have converged; however, the residuals suddenly go crazy. A few iterations later the simulation crashed. Pressure and velocity plots show nothing good. Mesh OK with skewness 3.38809. Relaxation factors: p 0.3, U 0.7, k 0.7, omega 0.7. potentialFlow nNonOrthogonalCorrectors 10."

## 3. FSI Simulation Crash from Interface Decomposition Splitting Coupling Boundary

### Symptom

Running a 2D FSI simulation coupling OpenFOAM and CalculiX using preCICE. The simulation runs for approximately 5 seconds of physical time before CalculiX crashes. The crash coincides with localized structural distortion. The location where the initial distortion occurred coincides exactly with one of the decomposition boundaries on the coupling interface.

### Root Cause

"In my OpenFOAM setup using parallel computation, the decomposition splits the coupling interface between the fluid and structure domains. Crucially, the location where the initial structural distortion occurred coincided exactly with one of these decomposition boundaries." When OpenFOAM decomposes the domain for parallel computation, the decomposition boundary can split the FSI coupling interface. At the split, the coupling data exchange has discontinuities. These discontinuities cause force spikes in the structural solver, leading to distortion and crash.

### Fix

1. **Avoid splitting the coupling interface**:
   - "I modified my OpenFOAM decomposition to avoid splitting the coupling interface itself"
   - Use simple decomposition method
   - Ensure the coupling interface is on a single processor
   - This doubled the runtime (from 5s to 8.4s)

2. **Use hierarchical decomposition**:
   - In decomposeParDict:
   ```
   method hierarchical;
   coeffs
   {
     n (2 1 1);
     delta 0.001;
     order xyz;
   }
   ```
   - This gives more control over decomposition direction
   - Align decomposition to avoid the coupling interface

3. **Use scotch decomposition with constraints**:
   - If available, use scotch with processor constraints
   - This can preserve the coupling interface
   - May require custom scotch settings

4. **Run in serial for small cases**:
   - If the case is small enough
   - Run in serial (no decomposition)
   - This eliminates the interface splitting issue
   - But may be slower for large cases

5. **Check for force oscillations**:
   - "OpenFOAM-side forces show violent oscillations, with extreme spikes at the first iteration of every time window"
   - Monitor coupling forces at each iteration
   - If forces oscillate, the decomposition is likely the cause
   - Adjust decomposition to avoid oscillations

6. **Disable subcycling**:
   - "It is known that CalculiX / the CalculiX adapter has issues with subcycling"
   - Don't use subcycling with CalculiX
   - Set the end time in CalculiX >= preCICE max-time
   - Subcycling causes checkpointing issues

7. **Check pressure field**:
   - "The pressure at the last timestep is significantly abnormal"
   - Monitor pressure at each timestep
   - If pressure spikes before the crash
   - The fluid solver is the source of the instability

### Community Report

> "FSI simulation coupling OpenFOAM and CalculiX crashes at ~5s. The location where the initial structural distortion occurred coincided exactly with one of the decomposition boundaries on the coupling interface. I modified my OpenFOAM decomposition to avoid splitting the coupling interface — this allowed the simulation to run to 8.4 seconds. OpenFOAM-side forces show violent oscillations with extreme spikes at the first iteration. CalculiX forces oscillate but converge at the last iteration. Subcycling is known to cause issues with the CalculiX adapter."

## 4. Solid Solver Relative Residuals Not Converging from Under-Relaxation Factor

### Symptom

Using fsiFoam with foam-extend 4.0. Setting up an FSI simulation similar to the 3dTube example. The relative residuals for the solid solver don't go beyond 0.99. The simulation doesn't progress beyond the 1st iteration. Error: "Floating point exception (core dumped)." The current FSI under-relaxation factor is huge. Different relaxation factor values don't help. checkMesh passes on both geometries.

### Root Cause

The solid solver residuals not converging indicates the displacement equations aren't reaching equilibrium. The under-relaxation factor being "huge" suggests the FSI coupling is applying too much or too little relaxation. If the under-relaxation factor is too large, the coupling updates are too aggressive, causing oscillation. If too small, convergence is too slow. The floating-point exception occurs when the displacement field becomes NaN due to the non-converged iterations.

### Fix

1. **Check displacement boundary conditions**:
   - Verify the solid boundary conditions
   - ```
   boundaryField
   {
     RUBLADEsolid
     {
       type tractionDisplacement;
       traction uniform (0 0 0);
       pressure uniform 0;
       value uniform (0 0 0);
     }
     RUHUB
     {
       type fixedDisplacement;
       value uniform (0 0 0);
     }
   }
   ```
   - Ensure tractionDisplacement is set correctly
   - Check fixedDisplacement values

2. **Verify rheology properties**:
   - "I changed it randomly, and it didn't alter the diverged results"
   - Check rheologyProperties file
   - Ensure density, Young's modulus, Poisson's ratio are correct
   - Wrong material properties cause convergence issues

3. **Reduce under-relaxation factor**:
   - "The current fsi under-relaxation factor is huge"
   - In fsiProperties:
   ```
   relaxationFactors
   {
     displacement 0.3;
   }
   ```
   - Start with 0.3 or lower
   - Gradually increase if stable

4. **Check mesh generation**:
   - "I generated it from the fluid patch using extrudeMesh command"
   - Verify the solid mesh is properly generated
   - Check mesh quality with checkMesh
   - Ensure the solid and fluid meshes are conformal at the interface

5. **Follow the 3dTube example exactly**:
   - "I followed the exact steps proposed here"
   - Use the exact same settings as the tutorial
   - Don't modify parameters until the base case works
   - Then change one parameter at a time

6. **Use consistentIcoFluid**:
   - Verify the fluid solver settings
   - consistentIcoFluid may need specific parameters
   - Check Courant Number: "mean: 7.12736e-19 max: 0.01"
   - Very low Courant number suggests the flow isn't moving

7. **Check interface mesh matching**:
   - The fluid and solid meshes must match at the interface
   - Use extrudeMesh to create matching meshes
   - Verify node positions match
   - Mismatched meshes cause coupling errors

### Community Report

> "Using fsiFoam with foam-extend 4.0. The relative residuals for solid solver does not go beyond 0.99 and I am not sure why. The error appears as 'Floating point exception (core dumped). The current fsi under-relaxation factor is huge. I have tried with different values of relaxation factors but none seem to work. checkMesh on both geometries passes all quality checks. I generated the mesh from the fluid patch using extrudeMesh command."

## 5. chtMultiRegionFoam Steady State Not Stopping from Transient Solver Misunderstanding

### Symptom

Using OpenFOAM 6 with chtMultiRegionFoam for a steady-state conjugate heat transfer case. Set residualControl to stop when converged. The convergence is reached, but chtMultiRegionFoam keeps running until endTime. The solver doesn't stop at convergence. In OpenFOAM 5, chtMultiRegionSimpleFoam worked correctly for steady state.

### Root Cause

"chtMultiRegionFoam is transient solver not steady-state as chtMultiRegionSimpleFoam. The residualControl allows to exit PIMPLE outer loops when the residual criteria are fulfilled. Then it continues with next time step." In OpenFOAM 6, chtMultiRegionSimpleFoam was removed. chtMultiRegionFoam is a transient solver — it uses PIMPLE with time stepping. residualControl only controls the inner PIMPLE loop convergence, not the overall simulation termination. The solver continues to the next time step even after convergence.

### Fix

1. **Use localEuler for steady-state behavior**:
   - "You can setup scheme for time derivative to localEuler"
   - In controlDict or fvSchemes:
   ```
   ddtSchemes
   {
     default localEuler;
   }
   ```
   - This makes the transient solver behave like steady state
   - Pseudo-transient continuation

2. **Use OpenFOAM 5 with chtMultiRegionSimpleFoam**:
   - "Another possibility is to use OpenFOAM 5 and chtMultiRegionSimpleFoam"
   - If available, use OpenFOAM 5
   - chtMultiRegionSimpleFoam is a true steady-state solver
   - It stops when converged

3. **Set endTime high enough**:
   - Since chtMultiRegionFoam is transient
   - Set endTime high enough for the solution to reach steady state
   - Monitor residuals — they should plateau
   - Manually stop when converged

4. **Use function objects for convergence check**:
   - Add a function object to monitor convergence
   - Use solverInfo or residuals function object
   - Check when residuals plateau
   - Stop the simulation manually

5. **Understand the solver type**:
   - "The official documentation of OF6 for chtMultiRegionFoam tells: Solver for steady or transient fluid flow and solid heat conduction"
   - It can do steady state with localEuler
   - But it's fundamentally a transient solver
   - residualControl controls inner loops, not termination

6. **Check wallHeatTransferCoeff**:
   - "I try the new functionality wallHeatTransferCoeff"
   - "But I see that it works only for incompressible fluids"
   - "cht is for compressible fluids"
   - This function object may not work for CHT cases
   - Use wallHeatFlux instead

### Community Report

> "OpenFOAM 6, chtMultiRegionFoam residualControl for steady state not working. chtMultiRegionFoam is transient solver not steady-state. The residualControl allows to exit PIMPLE outer loops when residual criteria are fulfilled, then continues with next time step. You can setup scheme for time derivative to localEuler. Another possibility is to use OpenFOAM 5 and chtMultiRegionSimpleFoam. Yes, it works for stationary cases, I have tested it — same results as OpenFOAM v5."

## 6. Additional OpenFOAM Issues

### Parallel FSI with preCICE

**Issue**: "I can't run the simulation in parallel on the cluster, even with decomposePar and mpirun."
**Fix**: Ensure preCICE is built with MPI support. Use correct mpirun command with preCICE. Check preCICE configuration for parallel mode. Verify decomposition doesn't split coupling interface.

### preCICE Version Compatibility

**Issue**: "After updating preCICE to 3.2.0, I have the same problem."
**Fix**: Downgrade to preCICE 3.1.2. Or update to 3.3.0. Check preCICE adapter compatibility with OpenFOAM version. Verify preCICE configuration XML is compatible.

### Courant Number Issues

**Issue**: Very low Courant number (7e-19) in FSI simulation.
**Fix**: Check velocity boundary conditions. Verify time step. Ensure the flow is actually moving. Check if the coupling is preventing flow initialization.

### Mesh Motion Solver

**Issue**: leastSquaresVectors crash during mesh motion.
**Fix**: Use Gauss linear gradient scheme. Check mesh quality. Ensure mesh is valid after motion. Use displacementLaplacian mesh motion.

### Turbulence Model Convergence

**Issue**: k-omega SST residuals oscillate.
**Fix**: Use lower relaxation for k and omega. Check y+ values. Ensure wall functions are appropriate. Use bounded schemes for turbulence.

## Best Practices

1. **Update preCICE to v3.3.0 for FSI** — fixes QR3 filter floating-point exception
2. **Use preCICE v3.1.2 as fallback** — known stable for elastic-tube-3D
3. **Check mesh quality before running simulations** — prevents residual explosion
4. **Add non-orthogonal correctors for non-orthogonal meshes** — improves pressure-velocity coupling
5. **Reduce relaxation factors for stability** — lower values prevent oscillation
6. **Avoid splitting FSI coupling interface in decomposition** — prevents force spikes
7. **Don't use subcycling with CalculiX adapter** — causes checkpointing issues
8. **Use localEuler for steady-state with chtMultiRegionFoam** — pseudo-transient continuation
9. **Use chtMultiRegionSimpleFoam in OpenFOAM 5 for true steady state** — stops at convergence
10. **Follow tutorial examples exactly before modifying** — ensures base case works
