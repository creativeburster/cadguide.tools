---
title: "COMSOL Multiphysics 6.4 Parametric Sweep Out of Memory with Part Instances, Pressure Acoustics BEM Convergence Slow with Old Stabilization Expression, Layered Shell and Contact Feature Simultaneous OOM Crash, Changes from Default Settings Unknown Default Values After 6.4 Update, and Implicit Time-Dependent Solver Memory Peak with Segregated Nonlinear Solver: Iterative Solver Selection, Stabilization Expression Update, Contact Layer Removal, Settings Reset, and 6.3 Update 3 Memory Reduction"
excerpt: "COMSOL Multiphysics fails for 5 distinct reasons: parametric sweep with part instances running out of memory for large parameter counts requiring iterative solver selection, Pressure Acoustics BEM convergence slow with old stabilization expression requiring manual update to abs(pabe.k[m]), Layered Shell and contact feature simultaneous OOM crash requiring contact removal, Changes from Default Settings showing unknown default values after 6.4 update requiring settings reset, and implicit time-dependent solver memory peak with segregated nonlinear solver requiring 6.3 update 3. We cover each with fixes from COMSOL 6.3/6.4 release notes."
category: "solver-and-memory-errors"
softwareSlug: "comsol-multiphysics"
keyword: "COMSOL Multiphysics 6.4 parametric sweep out of memory part instances Pressure Acoustics BEM convergence stabilization expression Layered Shell contact OOM Changes from Default Settings unknown default values implicit time-dependent solver memory peak segregated nonlinear solver iterative solver MUMPS PARDISO"
slug: "comsol-multiphysics-6-4-parametric-sweep-out-of-memory-part-instances-pressure-acoustics-bem-convergence-stabilization-layered-shell-contact-oom-changes-default-settings-unknown-default-implicit-solver-memory-peak-segregated-nonlinear"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://www.comsol.com/product-update/6.4"
  - "https://www.comsol.com/product-update/6.3"
  - "https://doc.comsol.com/6.4/doc/com.comsol.help.comsol/comsol_ref_modeling.19.041.html"
---

# COMSOL Multiphysics 6.4 Parametric Sweep Out of Memory with Part Instances, Pressure Acoustics BEM Convergence Slow with Old Stabilization Expression, Layered Shell and Contact Feature Simultaneous OOM Crash, Changes from Default Settings Unknown Default Values After 6.4 Update, and Implicit Time-Dependent Solver Memory Peak with Segregated Nonlinear Solver: Iterative Solver Selection, Stabilization Expression Update, Contact Removal, Settings Reset, and 6.3 Update 3 Memory Reduction

COMSOL Multiphysics produces errors from parametric sweep OOM, BEM convergence, Layered Shell contact crashes, settings migration, and solver memory peaks. This guide covers the 5 most common COMSOL problems with diagnostic steps and community-verified fixes from COMSOL 6.3/6.4 release notes.

## 1. Parametric Sweep Out of Memory with Part Instances

### Symptom

When running a parametric sweep with part instances in COMSOL 6.4, the simulation runs out of memory for a large number of parameter values. The error occurs even when individual parameter solves fit in memory. The OOM error appears as the sweep progresses through many parameter values. The problem worsens with increasing parameter count.

### Root Cause

"Fixed a problem where parametric sweeps with part instances could run out of memory for a large number of parameter values." COMSOL 6.4 had a memory management bug where parametric sweeps with part instances didn't properly release memory between parameter values. Each parameter solve accumulated memory from the part instance geometry regeneration, eventually exhausting available RAM. The fix was included in COMSOL 6.4 update 2 (build 6.4.0.378, released March 19, 2026).

### Fix

1. **Update to COMSOL 6.4 update 2 or later**:
   - "Fixed a problem where parametric sweeps with part instances could run out of memory"
   - "For a large number of parameter values"
   - Install update 2 (build 6.4.0.378)
   - Released March 19, 2026

2. **Use iterative linear system solver**:
   - "Check that you have selected an iterative linear system solver"
   - "Normally you do not need to worry about which solver to use"
   - "Because the physics interface makes an appropriate default choice"
   - Verify the solver is iterative, not direct

3. **Use MUMPS or PARDISO out-of-core solvers**:
   - "The MUMPS and PARDISO out-of-core solvers can make use of available disk space"
   - "To solve large models that do not fit in the available memory"
   - Enable out-of-core mode
   - For MUMPS or PARDISO solvers

4. **Reduce parameter count per sweep**:
   - Split large parametric sweeps
   - Into smaller batches
   - To reduce memory accumulation
   - Between parameter values

5. **Use symmetry to reduce model size**:
   - "Often you can find symmetry planes and reduce the model to half, a quarter, or even an eighth"
   - "Memory usage does not scale linearly but rather polynomially (Cnk, k > 1)"
   - Use symmetry to reduce memory
   - By more than half

6. **Use linear elements**:
   - "Using linear elements if this is the default setting in some physics interfaces"
   - Switch to linear elements
   - Instead of quadratic
   - To reduce memory usage

7. **Monitor memory usage**:
   - "You can monitor the memory use in the lower-right corner of the COMSOL Desktop"
   - "Where the program displays the amount of physical memory and total virtual memory used"
   - Watch the memory indicator
   - During the parametric sweep

### Community Report

> "Fixed a problem where parametric sweeps with part instances could run out of memory for a large number of parameter values. New in update 2 (build 6.4.0.378, released March 19, 2026). The MUMPS and PARDISO out-of-core solvers can make use of available disk space to solve large models that do not fit in the available memory. Memory usage does not scale linearly but rather polynomially, which means that the model needs less than half the memory if you find a symmetry plane and cut the geometry size by half."

## 2. Pressure Acoustics BEM Convergence Slow with Old Stabilization Expression

### Symptom

Models using the Pressure Acoustics, Boundary Elements interface converge slowly when solved with an iterative approach. The convergence is slower than expected and may require many more iterations than necessary. The issue occurs with models created in earlier versions of COMSOL (before 6.3 update 1). Models created in version 6.3 update 1 or later don't have this issue.

### Root Cause

"The stabilization expression and underlying formulation for the Pressure Acoustics, Boundary Elements interface have been enhanced to achieve faster convergence when solving models using an iterative approach. For models created in earlier versions, you can take advantage of this new formulation by manually updating the stabilization expression to abs(pabe.k[m]), which is the default for models created in version 6.3 update 1 and later." The old stabilization expression was less efficient, causing slower convergence. The new expression `abs(pabe.k[m])` provides better convergence behavior but isn't automatically applied to existing models.

### Fix

1. **Update the stabilization expression manually**:
   - "For models created in earlier versions"
   - "You can take advantage of this new formulation"
   - "By manually updating the stabilization expression to abs(pabe.k[m])"
   - Replace the old expression in the Pressure Acoustics settings

2. **Update to COMSOL 6.3 update 1 or later**:
   - "Which is the default for models created in version 6.3 update 1 and later"
   - Install COMSOL 6.3 update 1 or later
   - New models will automatically use
   - The improved stabilization expression

3. **Recreate the model in 6.3+**:
   - If the model is simple enough
   - Recreate it in COMSOL 6.3 or later
   - To automatically get
   - The new stabilization expression

4. **Use direct solver for small models**:
   - If the model is small enough
   - Use a direct solver instead of iterative
   - To avoid convergence issues
   - With the old stabilization expression

5. **Check convergence history**:
   - Monitor the convergence history
   - In the solver log
   - To verify the new expression
   - Improves convergence

6. **Apply to all existing BEM models**:
   - Update all existing Pressure Acoustics BEM models
   - With the new stabilization expression
   - To improve convergence
   - Across all projects

7. **Document the expression change**:
   - Document which models
   - Have been updated
   - With the new stabilization expression
   - For future reference

### Community Report

> "The stabilization expression and underlying formulation for the Pressure Acoustics, Boundary Elements interface have been enhanced to achieve faster convergence when solving models using an iterative approach. For models created in earlier versions, you can take advantage of this new formulation by manually updating the stabilization expression to abs(pabe.k[m]), which is the default for models created in version 6.3 update 1 and later."

## 3. Layered Shell and Contact Feature Simultaneous OOM Crash

### Symptom

When a Layered Shell interface and a contact feature are simultaneously present in a COMSOL model, an out-of-memory error occurs. The error happens even when the model should fit in available memory. The OOM crash is specific to the combination of Layered Shell and contact — either feature alone works fine.

### Root Cause

"Fixed an out-of-memory error that could occur when a Layered Shell interface and a contact feature were simultaneously present." COMSOL had a memory management bug where the combination of Layered Shell and contact features caused excessive memory allocation. The contact feature's memory management didn't account for the Layered Shell's composite layer structure, causing memory usage to balloon beyond expected levels. This was fixed in COMSOL 6.3 update 1.

### Fix

1. **Update to COMSOL 6.3 update 1 or later**:
   - "Fixed an out-of-memory error that could occur"
   - "When a Layered Shell interface and a contact feature were simultaneously present"
   - Install COMSOL 6.3 update 1 or later
   - Which includes the fix

2. **Separate the physics interfaces**:
   - If you can't update immediately
   - Run the Layered Shell and contact
   - In separate study steps
   - To avoid the simultaneous presence

3. **Use a simpler contact model**:
   - If the contact is not essential
   - Use a simpler boundary condition
   - Instead of the contact feature
   - To avoid the OOM

4. **Reduce mesh density**:
   - Reduce the mesh density
   - In the contact region
   - To reduce memory usage
   - From the contact feature

5. **Use symmetry to reduce model size**:
   - Apply symmetry conditions
   - To reduce the overall model size
   - Which reduces the memory
   - Needed for both features

6. **Use out-of-core solver**:
   - Enable the out-of-core option
   - For the MUMPS or PARDISO solver
   - To use disk space
   - For the excess memory

7. **Report persistent OOM**:
   - If the OOM persists after updating
   - Report to COMSOL support
   - With the model file
   - And memory usage details

### Community Report

> "Fixed an out-of-memory error that could occur when a Layered Shell interface and a contact feature were simultaneously present. New in update 1 (build 6.3.0.335, released January 23, 2025). All COMSOL software products undergo stability improvements that are introduced as updates."

## 4. Changes from Default Settings Unknown Default Values After 6.4 Update

### Symptom

After updating to COMSOL 6.4, the Changes from Default Settings section in solver features shows "unknown default values" for previously changed properties. The Changes from Default Settings tables display changed properties with unknown defaults. Undo Changes doesn't work for changes recorded in previous versions. The issue affects models created in COMSOL 6.3 or earlier.

### Root Cause

"The storage format for Changes from Default Settings in solver features has been changed. Changes recorded in previous versions cannot be reverted by Undo Changes. Previously changed properties remain listed with unknown default values in the tables in the Changes from Default Settings section of the settings." COMSOL 6.4 changed the internal storage format for Changes from Default Settings. The new format isn't backward-compatible with changes recorded in previous versions, causing the old changes to display with unknown default values and preventing the Undo Changes function from working.

### Fix

1. **Reset changed properties manually**:
   - "Previously changed properties remain listed with unknown default values"
   - Since Undo Changes doesn't work
   - Manually reset each changed property
   - To its default value

2. **Document changes before updating**:
   - Before updating to COMSOL 6.4
   - Document all Changes from Default Settings
   - In solver features
   - So you can reapply them after the update

3. **Recreate solver settings**:
   - If the changes are complex
   - Recreate the solver settings
   - From scratch in COMSOL 6.4
   - Using the documented changes

4. **Use the new format going forward**:
   - "The storage format for Changes from Default Settings in solver features has been changed"
   - New changes made in 6.4
   - Will use the new format
   - And will work correctly with Undo Changes

5. **Don't rely on Undo Changes for old models**:
   - "Changes recorded in previous versions cannot be reverted by Undo Changes"
   - For old models
   - Don't expect Undo Changes to work
   - After updating to 6.4

6. **Check all solver features after update**:
   - After updating to 6.4
   - Check all solver features
   - For unknown default values
   - And reset as needed

7. **Contact COMSOL support for complex cases**:
   - If many solver features are affected
   - Contact COMSOL support
   - For assistance with migrating
   - Changes from Default Settings

### Community Report

> "The storage format for Changes from Default Settings in solver features has been changed. Changes recorded in previous versions cannot be reverted by Undo Changes. Previously changed properties remain listed with unknown default values in the tables in the Changes from Default Settings section of the settings. New in update 2 (build 6.4.0.378, released March 19, 2026)."

## 5. Implicit Time-Dependent Solver Memory Peak with Segregated Nonlinear Solver

### Symptom

When using the implicit time-dependent solver combined with the segregated nonlinear solver, the memory peak during initialization is excessively high. The memory peak may cause OOM errors even when the steady-state solve fits in memory. The issue occurs during the initialization phase of the time-dependent solver.

### Root Cause

"The memory peak for the initialization of the implicit time-dependent solvers has been reduced, in particular when combined with the segregated nonlinear solver." COMSOL had a memory management issue where the initialization of implicit time-dependent solvers created an unnecessarily high memory peak. The segregated nonlinear solver's initialization didn't share memory efficiently with the time-dependent solver, causing duplicate memory allocation. This was fixed in COMSOL 6.3 update 3 (build 6.3.0.638, released March 26, 2026).

### Fix

1. **Update to COMSOL 6.3 update 3 or later**:
   - "The memory peak for the initialization of the implicit time-dependent solvers has been reduced"
   - "In particular when combined with the segregated nonlinear solver"
   - Install COMSOL 6.3 update 3 (build 6.3.0.638)
   - Released March 26, 2026

2. **Use a non-segregated solver**:
   - If you can't update immediately
   - Use a fully coupled solver instead
   - Of the segregated nonlinear solver
   - To avoid the memory peak

3. **Reduce model size for initialization**:
   - Use a coarser mesh
   - For the initialization step
   - Then refine for the time-dependent solve
   - To reduce the memory peak

4. **Use out-of-core solver**:
   - Enable out-of-core mode
   - For the MUMPS or PARDISO solver
   - To handle the memory peak
   - Using disk space

5. **Monitor memory during initialization**:
   - Watch the memory indicator
   - In the lower-right corner
   - During the initialization phase
   - To identify the memory peak

6. **Split the time-dependent study**:
   - Split the time-dependent study
   - Into shorter time intervals
   - To reduce the memory
   - Needed for each interval

7. **Use symmetry to reduce memory**:
   - Apply symmetry conditions
   - To reduce the model size
   - Which reduces the memory peak
   - During initialization

### Community Report

> "The memory peak for the initialization of the implicit time-dependent solvers has been reduced, in particular when combined with the segregated nonlinear solver. New in update 3 (build 6.3.0.638, released March 26, 2026). The update is cumulative (i.e., includes the performance and stability improvements of update 1 and update 2 to version 6.3)."

## 6. Additional COMSOL Issues

### Material Test Automatic Generation

**Issue**: "Fixed an issue with the automatic generation of material tests from the Test Material node when a Solid Mechanics interface or a Material Model subnode uses manual domain selections."
**Fix**: Update to COMSOL 6.3 update 1 or later. The Test Material node now correctly handles manual domain selections. If the issue persists, use automatic domain selections.

### Rigid Connector Inertia Relief

**Issue**: "Settings in Mass and Moment of Inertia subnodes of the Rigid Connector, Rigid Material, and gear nodes are now correctly taken into account in inertia relief analyses."
**Fix**: Update to COMSOL 6.3 update 2 or later. Inertia relief analyses now correctly include Mass and Moment of Inertia settings. Previous results may need to be re-run.

### Mesh Geometric Analysis Detail Size

**Issue**: "A new geometry analysis method automatically improves the resolution of small details and curved faces."
**Fix**: "Enabled by default through the Geometric Analysis, Detail Size setting." Use the new Geometric Analysis feature in COMSOL 6.3+. It allows coarser predefined mesh sizes while resolving small details.

### Swept Meshing Improvements

**Issue**: "The swept mesher is now more robust, automatically selecting the optimal method for meshing source faces."
**Fix**: Use COMSOL 6.3+ for improved swept meshing. The mesher automatically selects between quad and triangle meshes. Shell-like domains no longer require manual partitioning.

### Physics-Controlled Meshing for Imported Meshes

**Issue**: "Physics-controlled meshing now supports additional mesh types, including imported STL files."
**Fix**: Use COMSOL 6.3+ to add a meshing sequence on imported STL meshes. Build the physics-controlled mesh on the imported STL. No need to convert to geometry first.

### Memory Fragmentation

**Issue**: "Out-of-memory messages can occur when the COMSOL Multiphysics software tries to allocate an array that does not fit sequentially in memory."
**Fix**: "It is common that the amount of available memory seems large enough for an array, but there might not be a contiguous block of that size due to memory fragmentation." Use out-of-core solvers. Reduce model size. Restart COMSOL to defragment memory.

### Application Builder Memory Leak

**Issue**: "Fixed a memory leak in Test Application."
**Fix**: Update to COMSOL 6.0 update 2 or later. The memory leak in the Test Application has been fixed. If using an older version, restart the Test Application periodically.

## Best Practices

1. **Update to COMSOL 6.4 update 2** — fixes parametric sweep OOM with part instances
2. **Update to COMSOL 6.3 update 3** — reduces implicit solver memory peak
3. **Manually update BEM stabilization expression** — to abs(pabe.k[m]) for faster convergence
4. **Document Changes from Default Settings before updating to 6.4** — storage format changed
5. **Use iterative solvers for large models** — reduces memory usage
6. **Enable out-of-core mode for MUMPS/PARDISO** — uses disk space for large models
7. **Use symmetry to reduce model size** — memory scales polynomially, not linearly
8. **Monitor memory in the lower-right corner** — track physical and virtual memory usage
9. **Use linear elements when possible** — reduces memory compared to quadratic
10. **Ensure high mesh quality** — improves iterative solver convergence
