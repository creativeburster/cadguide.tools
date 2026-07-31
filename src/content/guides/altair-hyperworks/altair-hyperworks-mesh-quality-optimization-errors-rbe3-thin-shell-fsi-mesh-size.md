---
title: "Altair HyperWorks Mesh Quality and Optimization Errors: ERROR #173 Element Quality Check, Mesh Distortion During Shape Optimization, RBE3 Rotational DOF Warning #340, Thin Shell Singularity #1265, and FSI Mesh Size Mismatch"
excerpt: "Altair HyperWorks fails for 6 distinct reasons: ERROR #173 during element quality check, mesh distortion terminating shape optimization, RBE3 with rotational DOF producing bad load distribution, thin PSHELL with bending properties causing matrix singularity, FSI analysis crashing when fluid mesh is coarser than structural mesh, and CELAS misalignment producing poor rigid body modes. We cover each with fixes from Altair community and OptiStruct documentation."
category: "mesh-quality-and-optimization-errors"
softwareSlug: "altair-hyperworks"
keyword: "Altair HyperWorks HyperMesh ERROR 173 element quality check mesh distortion shape optimization RBE3 rotational DOF thin PSHELL singularity FSI mesh size CELAS"
slug: "altair-hyperworks-mesh-quality-optimization-errors-rbe3-thin-shell-fsi-mesh-size"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://community.altair.com/discussion/22446/error-173-and-errors-during-element-quality-check"
  - "https://2023.help.altair.com/2023/hwsolvers/os/topics/solvers/os/modeling_errors_os_r.htm"
  - "https://community.altair.com/discussion/62801/errors-in-fluid-structure-interaction-analysis-using-hypermeshcfd-2024-and-optistruct-2024"
---

# Altair HyperWorks Mesh Quality and Optimization Errors: ERROR #173 Element Quality Check, Mesh Distortion During Shape Optimization, RBE3 Rotational DOF Warning #340, Thin Shell Singularity #1265, and FSI Mesh Size Mismatch

Altair HyperWorks (HyperMesh + OptiStruct) produces structured error and warning codes, but the documentation doesn't always explain what to fix. ERROR #173 halts runs during element quality checks. Shape optimization terminates from mesh distortion. RBE3 elements with rotational DOF produce bad load distribution. Thin shell elements with bending properties cause matrix singularities. FSI analysis crashes when fluid and structural mesh sizes don't match. This guide covers each error with diagnostic steps and verified fixes.

## 1. ERROR #173: Element Quality Check Failure

### Symptom

OptiStruct run terminates with ERROR #173 during element quality check. The run stops before the solver begins.

### Root Cause

One or more elements fail the quality check criteria (Jacobian, tet collapse, skew, aspect ratio). The solver refuses to proceed with elements that would produce inaccurate results.

### Diagnosis

1. **Check the .out file** — lists which elements failed quality check
2. **Check the _err.grid file** — contains only the failed elements for visual inspection
3. **Check element Jacobian** — elements with negative or near-zero Jacobian are the problem
4. **Identify the problem area** — unmask failed elements with attached elements to see the location

### Fix

1. **Remesh the problem area** — improve element quality at the identified location
2. **Use PARAM, CHECKEL, NO** — disables element quality check (use with caution):
   - Only works if the quality issue is minor (small skew, slight aspect ratio)
   - Does NOT work for severe cell squish or tet collapse where a tetra element is squeezed to shell
   - May produce inaccurate results
3. **Use the REMESH option in OptiControls**:
   - Go to Optimization → OptiControls → Activate REMESH
   - During optimization, when element quality fails, REMESH activates re-meshing internally
   - After remeshing, optimization continues based on the remeshed model
   - Note: Significantly increases computation time (can extend 18-hour runs to 60+ hours)

## 2. Mesh Distortion During Shape Optimization

### Symptom

Shape optimization runs for several iterations, then terminates with "Excessive mesh distortion" error. The objective function (minimize static stress) with mass constraint was progressing normally.

### Root Cause

During shape optimization, the solver moves grid points based on design variables. Some grid points don't move while adjacent ones do, creating distorted elements. The distortion accumulates over iterations until element quality checks fail.

### Fix

1. **Use GRIDCON control card** (Grid Control):
   - Controls how grid points move during optimization
   - Ensures neighboring points move together
   - Refer to the OptiStruct help files for configuration options

2. **Activate REMESH in OptiControls**:
   - Go to Optimization → OptiControls → Activate REMESH
   - Automatically remeshes when element quality degrades
   - Optimization continues on the remeshed model

3. **Check element Jacobian before optimization**:
   - Identify elements with marginal quality
   - Fix these before starting optimization — they'll fail first during shape changes
   - 12 elements with Jacobian problems in the shape area will cause the termination

4. **Reduce move limits** — smaller design variable changes per iteration reduce distortion

5. **Use smooth shape perturbation vectors** — ensure design variables produce smooth geometry changes, not localized jumps

## 3. RBE3 Rotational DOF: Warning #340

### Warning Message

```
*** WARNING #340
RBE3 element 6300346 has nonzero weight at rotational (456) dofs
of independent grids. This practice may result in undesirable
load distribution - use with caution.
```

### Root Cause

RBE3 elements with 123456 DOF coupling at independent grid points can produce unexpected results. The rotational DOF (4, 5, 6) weights on independent nodes create load distribution problems because rotational DOF on RBE3 independent nodes doesn't behave like translational DOF.

### Fix

1. **Use only 123 DOF on independent grids** — remove rotational DOF weights
2. **Use at least 3 non-co-linear grid points** with 123 DOF on the independent grid
3. **Warning #341** appears if only 2 nodes are used:
   ```
   *** WARNING #341
   RBE3 element 10159308 has only two nodes.
   This practice may result in undesirable load distribution.
   ```
4. **Use RBE2 instead of RBE3** when rigid connection is needed — RBE2 with 123 DOF is more stable

## 4. Thin Shell Singularity: Warning #1265

### Warning Message

```
*** WARNING #1265
PSHELL 10003383 has thickness 0.0201 or less and bending properties
defined. This can lead to matrix singularities, causing message 153.
If this element is intended to be only a membrane element,
please leave MID2 and MID3 blank on the PSHELL data.
```

### Root Cause

Very thin plate elements (0.001 thickness or less) on surfaces of solid elements produce near singularities when both bending (MID2) and shear (MID3) properties are specified. The bending stiffness becomes negligible compared to membrane stiffness, creating numerical singularities.

### Fix

1. **Leave MID2 and MID3 blank** on the PSHELL data for thin skin elements
   - This makes the element membrane-only (no bending)
   - Eliminates the singularity
2. **Do NOT connect CBEAM or CBAR to membrane-only skin elements** — this causes mechanisms
   - Use **RBE2 elements** instead with 123 DOFs specified
3. **Use solid elements** for thin regions if bending is important
4. **Increase thickness** if physically reasonable

## 5. FSI Analysis: Mesh Size Mismatch Between Fluid and Structural Domains

### Error Message

```
External Code via CCI: *** ASSERTION in Function File <iopSocket.c>
Line <612> External Code via CCI: *** TCP socket write error; No error
Abort(-5) on node 0 (rank 0 in comm 0):
application called MPI_Abort(MPI_COMM_WORLD, -5) - process 0

**** ABORTING RUN DUE TO UNEXPECTED ERROR CONDITION ****
Timeout ALARM Timeout ALARM
```

### Root Cause

In Fluid-Structure Interaction (FSI) analysis using HyperMeshCFD and OptiStruct, the TCP socket error means one solver stopped and closed the connection. The AcuSolve log shows "severe mesh distortion errors" at the end of the first time step.

The root cause is **mesh size mismatch at the FSI interface**: the fluid mesh elements are larger than the structural mesh elements at the exchange surface, causing interpolation errors and mesh distortion.

### Key Finding

The same analysis ran without error in version 2022.3 but fails in 2024. The fix was to make the **fluid element mesh smaller than the structural element mesh** at the exchange surface.

### Fix

1. **Refine the fluid mesh** at the FSI interface — fluid elements should be smaller than structural elements
2. **Use a multiplier function** on the External Code command:
   - Set to **linear type** — starts at 0, goes to 1 over the first 20 time steps
   - Slowly passes fluid forces, letting the flow converge better
   - A constant value of 1 may overwhelm the structural solver at startup
3. **Reduce time step size** — smaller time increments reduce per-step deformation
4. **Check dimension consistency** — ensure fluid and structural models use consistent units
5. **Verify the exchange surface** — the FSI interface mesh must be compatible on both sides

## 6. CELAS Misalignment: Poor Rigid Body Modes

### Symptom

GROUNDCHECK fails. Rigid body strain energies are non-zero for CELAS elements. The model has poor rigid body modes.

### Diagnosis

Run **GROUNDCHECK** — it catches misaligned CELAS elements and lists elements with non-zero rigid body strain energies:

```
These elements can cause GROUNDCHECK to FAIL
CELAS elements in this list are probably misaligned.
Elem no: 1 type: CELAS1
Six rigid mode energies and ratios:
energy - 0.000E+00 0.000E+00 0.000E+00 0.000E+00 0.000E+00 0.000E+00
ratio - 0.000E+00 0.000E+00 0.000E+00 0.000E+00 0.000E+00 4.000E+00
```

### Root Cause

CELAS elements between two non-coincident points produce poor rigid body modes because they don't properly account for the offset between the connection points.

### Fix

1. **Use CBUSH elements instead of CELAS** — CBUSH properly handles non-coincident points
2. **Verify CELAS alignment** — ensure CELAS elements connect coincident grid points
3. **Check CELAS coordinate system** — Field 9 (CID) must be specified with 0 (zero) or the appropriate local coordinate system
4. **Run GROUNDCHECK** before analysis — identifies all elements causing rigid body mode problems

## 7. Additional Modeling Errors

### Welding with MPC Equations

Do NOT use welding methods that use MPC equations — they produce very poor rigid body modes. Use rigid elements instead.

### Torsion Through Ball Joint

When representing torsion motion through a ball joint connection (e.g., intermediate shaft to steering column) using MPC equations, remove the rigid body reaction from the MPC equations. Otherwise, the model will have poor rigid body modes.

### Extra Rigid Body Modes from RBE3

Do NOT use RBE3 with 123456 DOF on the dependent GRID to only 1 or 2 GRID points with 123456 DOF on the independent points. This can produce extra rigid body modes.

## Best Practices

1. **Check element quality before running** — fix marginal Jacobian elements before optimization
2. **Use REMESH in OptiControls** for shape optimization — prevents mesh distortion termination
3. **Use only 123 DOF on RBE3 independent grids** — rotational DOF causes bad load distribution
4. **Leave MID2/MID3 blank for thin shells** — prevents matrix singularity
5. **Don't connect beams to membrane-only shells** — causes mechanisms; use RBE2 instead
6. **Make fluid mesh smaller than structural mesh at FSI interface** — prevents TCP socket crash
7. **Use linear multiplier function for FSI** — ramp up forces gradually
8. **Use CBUSH instead of CELAS** for non-coincident connections — prevents poor rigid body modes
9. **Run GROUNDCHECK before analysis** — catches modeling errors early
10. **Don't use MPC welding** — use rigid elements for better rigid body modes
