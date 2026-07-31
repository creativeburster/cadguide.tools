---
title: "ANSYS Workbench Meshing and Solver Diagnostics: Mesh Failure Problematic Geometry, Shape Check Violations, Protected Topology, Solver Unit System Mismatch, Internal Solution Magnitude Limit, and CHT Convergence"
excerpt: "ANSYS Workbench fails for 6 distinct reasons: mesh generation fails on problematic geometry with sliver surfaces, shape checks reject valid meshes, protected topology constrains the mesher, solver unit system mismatch with material models, internal solution magnitude limit from under-constrained models, and CHT unphysical temperatures from poor mesh quality. We cover each with diagnostic steps and fixes from ANSYS help and community forums."
category: "meshing-and-solver-diagnostics"
softwareSlug: "ansys-workbench"
keyword: "ANSYS Workbench mesh failure solver convergence unit system mismatch internal solution magnitude limit CHT unphysical temperature shape check"
slug: "ansys-workbench-meshing-solver-diagnostics-shape-check-unit-mismatch-magnitude-limit"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://ansyshelp.ansys.com/public/Views/Secured/corp/v251/en/wb_msh/msh_troubleshoot.html"
  - "https://innovationspace.ansys.com/knowledge/forums/topic/why-do-i-get-the-following-error-an-error-occurred-inside-the-solver-module-the-reference-units-defined-for-a-material-property-does-not-match-the-solver-unit-system/"
  - "https://engineering.stackexchange.com/questions/61858/fea-ansys-conversion-issue-after-warning"
---

# ANSYS Workbench Meshing and Solver Diagnostics: Mesh Failure Problematic Geometry, Shape Check Violations, Protected Topology, Solver Unit System Mismatch, Internal Solution Magnitude Limit, and CHT Convergence

ANSYS Workbench's meshing and solving pipeline produces structured error messages, but they often don't explain what to fix. Mesh failures show "problematic geometry" without identifying the specific face. Solver errors reference "unit system mismatch" without explaining which units. The internal solution magnitude limit error doesn't indicate which node is causing the problem. This guide covers the 6 most common meshing and solver failure modes with diagnostic steps and verified fixes.

## 1. Mesh Generation Failure: Identifying Problematic Geometry

### Symptom

Mesh generation fails — either completely or partially. The mesher returns messages to the Messages window.

### Diagnosis

1. **Check the Messages window** — messages include hints explaining why meshing failed
2. **Right-click the message** → select **Show Problematic Geometry** — highlights associated entities in the Geometry window
3. **Go To > Unmeshed Bodies** — right-click the Geometry window to isolate bodies that failed to mesh
4. **Visual identification**:
   - **Failed meshes**: shaded in **maroon**
   - **Obsolete meshes**: colored **yellow**
   - **Failure location**: identified by a convergence of **white lines**
5. **Enable color by connectivity** — unmeshed face edges are marked as **red** (single connectivity)
6. **Switch to wireframe mode** — red connectivity locations are more visible

### Fix

1. **Use defeaturing controls**:
   - **Loop Removal**: removes small fillet loops that constrain the mesh
   - **Mesh Defeaturing**: removes features smaller than the defeaturing size
2. **Apply pinch controls** — removes small gaps and slivers
3. **Create virtual topologies** — combines small faces into larger meshable regions
4. **Fix the surface mesh first** — bad quality volume mesh usually results from bad surface mesh
5. **Use mesh metrics bar graph** — identify location of bad quality elements after preview

## 2. Shape Check Violations

### Symptom

Meshing fails because the mesh quality doesn't meet the defined shape check criteria. The mesher can generate the mesh but rejects it based on quality metrics.

### Fix

1. **Generate boundary mesh despite shape check violations**:
   - Set shape checking to **None** during preview
   - The boundary mesh is generated even if it would violate shape checks
   - Use mesh metrics to find bad quality elements
   - Fix the surface mesh manually

2. **Fix geometry that over-constrains mesh topology**:
   - Remove sliver surfaces
   - Merge small faces using virtual topology
   - Apply defeaturing to remove unnecessary features

3. **Adjust mesh sizing** — refine locally where quality is poor, coarsen where geometry is simple

## 3. Protected Topology Meshing Failures

### Symptom

Meshing fails when hard protected topology is set up improperly. The mesher cannot return a reasonable mesh while respecting the topology.

### Root Cause

Protected topology forces the mesher to capture specific geometric boundaries. If a protected face is a sliver or has problematic sizing, the mesher fails trying to respect it.

### Diagnosis

Enable the **Highlight** option — problematic faces are highlighted during meshing. If a face is highlighted for a long time, it indicates a meshing problem.

### Fix

1. **Remove unnecessary protected topology** — only protect faces that must be captured
2. **Adjust sizing** — the mesher may fail if sizing is incompatible with the protected topology
3. **Use soft protection instead of hard** — allows the mesher more flexibility
4. **Check for missing faces** — a missing face in a protected topology can cause failures at boundaries

## 4. Selective Meshing Failures

### Symptom

Selective meshing produces unexpected results — sweep mesh failure because source and target meshes no longer align, or a body becomes unsweepable after a mesh control change.

### Fix

1. **Disable selective meshing**: Set **Allow Selective Meshing** to **No**
2. This forces mesh control changes to **ripple through the entire part**
3. All bodies in the part are meshed together, ensuring alignment

## 5. Solver Unit System Mismatch

### Error Message

```
An error occurred inside the SOLVER module:
The "Reference Units" defined for a material property
does not match the solver unit system
```

### Root Cause

Some material models (Anand Viscoplasticity, Creep, Viscoelastic Shift Function) have coefficients that cannot be converted between unit systems. For example, a material law with a term "C1*stress^C2" produces non-standard units that can't be converted.

### Fix

1. **Set Solver Units to match the material model's unit system**:
   - Click **Analysis Settings**
   - Under **Analysis Data Management**, set **Solver Units** to **Manual**
   - Select the unit system matching the material model (e.g., `umks` for MPa, K, s^-1)

2. **The solution must be performed in the same unit system** in which the material coefficients are defined

3. **Full list of Workbench units** is in the help documentation:
   - Mechanical User's Guide → Features → Solving Overview → Solving Units

## 6. Internal Solution Magnitude Limit Exceeded

### Error Messages

```
Error: An internal solution magnitude limit was exceeded.
(Node Number 258120, Body 3022-0010.asm, DOF UY)
Please check your Environment for inappropriate load values
or insufficient supports.

Error: The solver engine was unable to converge on a solution
for the nonlinear problem as constrained.
```

### Warning Messages

```
Warning: Solver pivot warnings or errors have been encountered.
This is usually a result of an ill conditioned matrix possibly
due to unreasonable material properties, an under constrained
model, or contact related issues.

Warning: The elapsed time exceeded the CPU time by an excessive
margin. Often indicates lack of physical memory (RAM) or
a particularly slow hard drive.
```

### Root Cause

The model is **under-constrained** — a DOF (in this case UY at node 258120) has no restraint, allowing unlimited displacement. The solver detects this as a solution magnitude exceeding the internal limit.

### Diagnosis

1. **Identify the problematic node**: Use **Named Selection** defined by **Worksheet** to add the node by ID number
2. **Right-click the error** in the Messages window → select the offending object/geometry
3. **Check the specific body** — the body name in the error message identifies which part is problematic

### Fix

1. **Add supports** — ensure the model is fully constrained in all DOFs
2. **Check contact conditions** — contact may not be established, leaving parts unconstrained
3. **Verify material properties** — unreasonable values (e.g., E = 0) cause ill-conditioning
4. **Add more RAM** — the elapsed time warning indicates memory insufficiency
5. **Use a faster hard drive** — SSD significantly improves solve times for memory-constrained models

## 7. CHT Analysis: Unphysical Temperatures and Poor Convergence

### Symptom

Conjugate Heat Transfer (CHT) analysis in CFX produces unphysically high temperatures in the solid domain. Convergence problems persist.

### Root Causes

1. **Poor mesh quality in the solid**: Minimum orthogonality angle < 10 degrees
2. **1:1 interfaces at fluid-solid boundary**: Conformal mesh can cause unphysical temperature peaks
3. **Diffusion scheme issues**: Default scheme may not be robust enough

### Fix

1. **Check mesh quality**: Use CFD-Post to isolate the location of concern, then check orthogonality angle — if < 10°, remesh
2. **Use GGI interfaces** instead of 1:1 conformal mesh for CHT cases
3. **Add inflation layers** at the fluid-solid interface to resolve temperature gradients
4. **Change diffusion scheme**: Use expert parameter:
   ```
   EXPERT PARAMETERS:
   cht diffusion scheme = 3
   END
   ```
   This uses a more robust but less accurate scheme (positive definite values)

## 8. Coupled Thermal-Structural: Zero Deformation and Stress

### Symptom

A transient thermal simulation works correctly, but the coupled structural simulation returns zero deformation and zero stress everywhere. Imported body temperature loads are visible in the setup.

### Root Cause

The imported temperature loads may not be properly linked to the structural analysis. The step settings may not match between thermal and structural analyses.

### Fix

1. **Verify step settings match** — ensure the structural analysis has the same step times as the thermal analysis
2. **Check imported load activation** — verify that imported body temperature is active for each step
3. **Ensure material properties include thermal expansion coefficient** — without it, temperature changes produce no deformation
4. **Check boundary conditions** — fixed support + frictionless support may over-constrain the model, preventing thermal expansion
5. **Verify the connection between thermal and structural** — in Workbench, ensure the thermal Solution is linked to the structural Setup

## Best Practices

1. **Always check the Messages window first** — meshing and solver messages contain diagnostic hints
2. **Use Show Problematic Geometry** — right-click meshing error messages to highlight the problem
3. **Fix surface mesh before volume mesh** — bad volume mesh usually starts with bad surface mesh
4. **Use defeaturing and virtual topology** — remove geometry features that constrain the mesher
5. **Match solver units to material model units** — some material models can't convert between unit systems
6. **Identify problematic nodes by ID** — use Named Selection with Worksheet for node-specific errors
7. **Check for under-constrained models** — the internal magnitude limit error means a DOF is free to move
8. **Use GGI interfaces for CHT** — conformal 1:1 meshes can cause unphysical temperatures
9. **Match step settings between coupled analyses** — thermal and structural steps must align
10. **Add inflation layers at fluid-solid interfaces** — resolves temperature gradients in CHT
