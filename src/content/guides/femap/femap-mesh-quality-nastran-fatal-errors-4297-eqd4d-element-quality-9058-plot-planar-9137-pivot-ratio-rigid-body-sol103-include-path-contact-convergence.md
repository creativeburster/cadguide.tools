---
title: "Siemens Femap Mesh Quality and Nastran Fatal Errors: 4297 EQD4D Mesh Distortion from Failed Quad Elements Found via Element Quality Check, Fatal 9058 from Plot Planar 2D Triangular Elements Not Exported to Nastran, Fatal 9137 Plate Bonding and Pivot Ratio from Rigid Body Motion and Unconstrained Parts, Crash on Analyze from Nested INCLUDE File Path Errors, and Contact Non-Convergence from Curved Surfaces Requiring Increased Iterations"
excerpt: "Femap fails for 5 distinct reasons: 4297 EQD4D errors from distorted quad elements found via Tools > Check > Element Quality with Nastran tab, fatal 9058 from plot planar elements not exported to solver requiring 3D solid mesh, fatal 9137 and pivot ratio from rigid body motion requiring SOL 103 normal modes analysis to identify mechanisms, crash on analyze from incorrect nested INCLUDE file paths producing empty .DAT, and contact non-convergence from curved surfaces requiring iteration increase from 20 to 45. We cover each with fixes from Siemens Community forums."
category: "troubleshooting"
softwareSlug: "femap"
keyword: "Femap 4297 EQD4D distorted quad element quality check Nastran fatal 9058 plot planar 2D triangular elements 3D solid mesh fatal 9137 pivot ratio rigid body motion SOL 103 INCLUDE file path contact convergence curved surfaces iterations"
slug: "femap-mesh-quality-nastran-fatal-errors-4297-eqd4d-element-quality-9058-plot-planar-9137-pivot-ratio-rigid-body-sol103-include-path-contact-convergence"
author: "CADGuide Tools Editorial Team"
readTime: "14 min"
date: "2025-07-31"
sources:
  - "https://community.sw.siemens.com/s/question/0D54O000061xoO5SAI/suggested-workflow-for-meshing-errors"
  - "https://community.sw.siemens.com/s/question/0D54O000061xkl0SAA/error-9058"
  - "https://community.sw.siemens.com/s/question/0D5Vb00000cryYgKAI/plate-element-bonding-error-fatal-message-9137-and-pivot-ratio-issue"
---

# Siemens Femap Mesh Quality and Nastran Fatal Errors: 4297 EQD4D Mesh Distortion from Failed Quad Elements Found via Element Quality Check, Fatal 9058 from Plot Planar 2D Triangular Elements Not Exported to Nastran, Fatal 9137 Plate Bonding and Pivot Ratio from Rigid Body Motion and Unconstrained Parts, Crash on Analyze from Nested INCLUDE File Path Errors, and Contact Non-Convergence from Curved Surfaces Requiring Increased Iterations

Femap with NX Nastran produces mesh quality errors, fatal solver messages, and crashes from modeling issues, incorrect element types, and file path problems. This guide covers the 5 most common Femap problems with diagnostic steps and community-verified fixes from Siemens Community forums.

## 1. 4297 EQD4D Mesh Distortion Errors

### Error Message

```
4297 (EQD4D) errors — element distortion warnings
```

### Symptom

After running a simulation, a large number of 4297 (EQD4D) errors appear. The user needs to find the listed elements and correct the mesh to make them more rectangular. Currently finding them by manually typing element numbers into Window → Show Elements.

### Root Cause

Quad elements (CQUAD4) have excessive distortion — internal angles too far from 90 degrees, aspect ratios too high, or Jacobian values exceeding Nastran limits. The mesh was generated but quality is insufficient for the solver.

### Fix

1. **Use Tools → Check → Element Quality**:
   - Select all elements → click OK
   - Click the Nastran tab
   - Turn off all checks except "Quad IAMax > Value"
   - Set the value to the desired threshold
   - Check "Details To Data Table" under Options
   - The Data Table populates with element IDs and values that fail

2. **Use the Data Table to locate bad elements**:
   - Click "Show When Selected" in the Data Table
   - This pinpoints where the failing elements are on the model
   - No need to manually type element numbers

3. **Create a group of distorted elements**:
   - Check "Make Group" in the Element Quality dialog
   - Creates a group with all distorted elements
   - Use "shrink element" view to find linear (degenerate) plate elements
   - Working in a group allows focusing on a small portion of the model

4. **Set Jacobian check to 1**:
   - Tools → Check → Element Quality → Femap tab
   - Set Jacobian to 1
   - This picks up elements with internal angle greater than 180 degrees
   - Check "Make Group with Distorted Elements"

5. **Remesh the distorted areas**:
   - Once identified, remesh the areas with distorted elements
   - Use finer mesh size
   - Use quad-dominant meshing
   - Verify element quality before re-running

6. **Compare Femap and Nastran element checks**:
   - Femap's Element Check values may differ from Nastran's analysis values
   - Take one failing element and do a "Distorted Element Check"
   - Look at the values, not just the # Failed count
   - Edit the Element Check values in Femap to match Nastran's thresholds

7. **Bypass the check in analysis** (last resort):
   - You can bypass the element check within the analysis
   - But confirm the mesh is good in Femap first
   - Bypassing without fixing can produce inaccurate results

### Community Report

> "Try using Tools > Check > Element Quality. Select all elements and click OK. Click the Nastran Tab. Turn off all checks except for 'Quad IAMax > Value'. Check 'Details To Data Table' — the Data Table will propagate with the element IDs and values that fail."

## 2. Fatal 9058 from Plot Planar 2D Triangular Elements

### Error Message

```
fatal error 9058 — "solution for the residual structure and current subcase does not exist.."
```

### Symptom

New Femap user creates a model, meshes it, applies loads and constraints, saves as .modfem. Running analysis produces 1 fatal error and 3 warnings. The fatal error 9058 indicates the solution doesn't exist.

### Root Cause

The model uses only PLOT PLANAR 2D triangular elements. Plot elements are not structural — they're for visualization only. They have no stiffness and are not exported to the NX Nastran solver. The solver receives an empty mesh and can't find any structural elements to solve.

### Fix

1. **Create a valid 3D solid mesh**:
   - The current mesh is plot-only — not exported to the solver
   - Use Geometry → Solid → Cleanup to prepare the geometry
   - Then mesh with 3D solid tetrahedral elements (CTETRA)

2. **Run Solid Cleanup first**:
   - Geometry → Solid → Cleanup
   - This removes spikes, small edges, sliver faces
   - Optimizes geometry for meshing
   - Check for geometry inconsistencies

3. **Check for thin walls**:
   - The part may be a thin-walled structure, not a massive solid
   - For thin walls, use 2D plate/shell elements (CQUAD4)
   - Create midsurfaces from the thin-walled solid
   - Mesh the midsurfaces with plate elements

4. **Mix 3D solid and 2D shell elements**:
   - For parts with both thick and thin regions
   - Use 3D solids for thick areas, 2D shells for thin areas
   - Connect them with GLUE EDGE-TO-SURFACE

5. **Verify mesh is structural, not plot**:
   - Check element types in Model → Element
   - Plot elements have no material or property assigned
   - Structural elements have proper properties and materials

6. **Debug tet meshing failures**:
   - If tets fail to generate, check geometry for issues
   - Look for sliver faces, sharp internal angles, near-coincident faces
   - Use Solid Cleanup to fix these issues
   - Try coarser mesh first, then refine

### Community Report

> "Your FEMAP model is fully PLOT PLANAR based in 2-D triangular elements, this means that your FE mesh is not exported at all to the NX NASTRAN solver. You need to create a valid 3-D solid mesh."

> "Thanks for the hint, you were right. Now trying to figure out why it only creates a plot mesh when attempting to create tets."

## 3. Fatal 9137 Plate Bonding and Pivot Ratio from Rigid Body Motion

### Error Messages

```
FATAL MESSAGE 9137 (GUSER7): Plate element connectivity or geometry problem
RUN TERMINATED DUE TO EXCESSIVE PIVOT RATIOS IN MATRIX KLL
```

### Symptom

Two plate (shell) elements are bonded together, but running analysis produces fatal 9137 and excessive pivot ratio errors. Interestingly, applying constraints to the problematic node makes the simulation run successfully, but this doesn't represent real boundary conditions.

### Root Cause

The model has a mechanism (rigid body motion) — a part of the model is free to move in space. This happens when:
- Node merging was not performed between connected parts
- A GLUE connector was not correctly defined
- CROD elements (which have no rotational DOF) create articulated connections
- Contact properties allow parts to slide and separate freely

### Fix

1. **Run SOL 103 (Normal Modes) to identify the mechanism**:
   - Run a normal modes/eigenvalue analysis (SOL 103)
   - The animation of the first natural frequency (with a value of 0 Hz) shows where the problem is
   - 0 Hz frequency = rigid body mode = unconstrained part
   - This is the most effective diagnostic tool

2. **Use PARAM,BAILOUT,-1 for diagnosis**:
   - Add `PARAM,BAILOUT,-1` to the analysis
   - This forces Nastran to continue past errors
   - Results will be invalid but you can identify problem areas
   - Use with SOL 103 to pinpoint constraint issues

3. **Check node merging**:
   - Ensure coincident nodes between plates are merged
   - Use Tools → Check → Coincident Nodes
   - Merge nodes within a tolerance
   - Unmerged nodes create disconnected parts

4. **Use GLUE properly**:
   - GLUE edge-to-face is valid for rigid connectors
   - But use node merging for areas where stresses are critical
   - GLUE should be used in non-critical stress areas
   - For seam welds and fatigue analysis, use node merging, not GLUE

5. **Check contact properties**:
   - If all connectors have NO PENETRATION contact, bodies can slide and separate
   - This creates a mechanism — parts are free to move
   - Define a new GLUE property for connectors that should be rigid
   - Apply GLUE contact property to appropriate connectors

6. **Check for tangent continuity**:
   - Contact regions should only include tangent-continuous surfaces
   - Remove surfaces that are not tangent continuous from contact regions
   - Create separate contact regions for non-tangent surfaces

7. **Check for duplicated elements**:
   - Look for duplicated beam elements defining bolt joints
   - Check for duplicated bolt preload regions
   - Remove duplicates before running

8. **Check RBE2 constraints**:
   - Fatal 2101 "GRID POINT ILLEGALLY DEFINED IN SETS UM US"
   - This means constraints are applied to dependent nodes of RBE2 elements
   - Don't constrain dependent nodes — constrain the independent node only

### Community Report

> "Your model either is not correctly constrained or you have a rigid body motion meaning that a part of the model is free to move in the space (node merging was not performed, or a GLUE connector was not correctly defined)."

> "Run a normal modes/eigenvalue analysis (SOL 103): the animation of first natural frequency (with a value of 0 Hz) will tell you where the problem is."

## 4. Crash on Analyze from Nested INCLUDE File Path Errors

### Symptom

Femap 11.4.0 crashes right after pressing the "ANALYZE" button. The .DAT file is created but empty. The model uses nested INCLUDE statements for case control, bulk data, and executive control. Simple test models with nested INCLUDEs work fine.

### Root Cause

The file paths in nested INCLUDE statements are incorrect. The INCLUDE files reference other INCLUDE files in different directories. When the file structure doesn't match the INCLUDE paths, Nastran can't find the bulk data, producing an empty .DAT file and crashing Femap.

### Fix

1. **Verify all INCLUDE file paths**:
   - Check every INCLUDE statement for correct file paths
   - Paths are relative to the location of the referencing file
   - A file in directory A referencing a file in directory B needs the correct relative path
   - Use absolute paths if relative paths are confusing

2. **Check the file structure tree**:
   - Draw out the file structure tree
   - Verify each INCLUDE path matches the actual file location
   - The "Assembly" file (Assy_1.dat) must be correctly referenced
   - All sub-INCLUDE files must be findable from the Assembly file's location

3. **Move all files to the same directory**:
   - As a test, move all INCLUDE files to the same directory as the Femap model
   - Use simple filenames without path prefixes
   - If this works, the issue is file path related

4. **Check for empty bulk data**:
   - If the .DAT file is empty, Nastran received no bulk data
   - This means the INCLUDE chain is broken somewhere
   - Trace through each INCLUDE to find where the chain breaks

5. **Use Femap Nastran Desktop Extension**:
   - This extension removes the checksum requirement from Nastran
   - Allows running INCLUDE-based decks directly
   - Contact Siemens support for this option

6. **Contact Siemens support**:
   - If the crash persists, contact Patrick Kriengsiri at Siemens
   - They can help troubleshoot INCLUDE file issues
   - The crash may be related to checksum calculation on nested INCLUDEs

### Community Report

> "The issue had to do with where my 'Assembly' include file was located, and where the other files were located with respect to it. The file structure was incorrect, so there was not any bulk data actually being created within Nastran, and the bulk data section was empty. This caused Femap to crash."

## 5. Contact Non-Convergence from Curved Surfaces

### Symptom

Linear static analysis (SOL 101) with contact doesn't converge. The .f06 file shows contact iteration warnings. The number of outer loop iterations is exceeded. Contact between curved surfaces has penetrations that don't resolve.

### Root Cause

Contact regions defined on curved surfaces are problematic. TET10 midside nodes are not properly projected onto contact surfaces, causing penetrations. The default 20 contact iterations are insufficient for curved surface contact.

### Fix

1. **Increase contact iterations**:
   - In the Contact Property, increase iterations from 20 (default) to 45
   - This allows more iterations for the contact algorithm to converge
   - Check the .f06 file for convergence status

2. **Check contact convergence in .f06**:
   - Look for "CONTACT ITERATION NUMBER" entries
   - Check "CONTACT FORCE CONVERGENCE RATIO" vs CTOL
   - If convergence ratio > CTOL, more iterations are needed
   - "NUMBER OF OUTER LOOP ITERATIONS EXCEEDED" = non-converged

3. **Fix curved surface contact regions**:
   - Only include tangent-continuous surfaces in contact regions
   - Remove non-tangent surfaces from the region
   - Create separate contact regions for non-tangent surfaces
   - Curved surfaces with discontinuities cause projection issues

4. **Check TET10 midside node projection**:
   - TET10 midside nodes may not project correctly onto curved surfaces
   - This causes penetrations in the contact check
   - Try TET4 elements (no midside nodes) as a test
   - If TET4 converges but TET10 doesn't, it's a midside node projection issue

5. **Use GLUE instead of contact for bonded interfaces**:
   - If the contact should be bonded (no sliding), use GLUE
   - GLUE doesn't require iteration
   - GLUE is more robust for curved surface connections

6. **Refine the mesh at contact interfaces**:
   - Finer mesh on curved contact surfaces improves convergence
   - Match mesh sizes between contacting surfaces
   - Avoid large element size differences across the contact interface

### Community Report

> "To assure CONTACT CONVERGENCE you need to increase the contact iterations in the CONTACT PROPERTY from 20 (default) to say 45. Contact iteration is not converged with 20 (default) — all is written in the *.f06 file."

> "You have penetrations between contacting bodies — this is a typical behaviour of meshing errors when defining contacts regions with CURVED SURFACES. Your midside nodes of TET10 elements are not projected correctly."

## 6. Additional Femap Issues

### Finding Solver-Reported Bad Elements

**Issue**: After running Nastran, the .f06 file lists elements with warnings. How to locate them on the model?
**Fix**: Extract element numbers from the .f06 file, use the Entity Selection dialog's "Paste" feature (under the Pick button) to paste the list. Or import the .log file into Excel, extract element numbers, and paste them.

### RBE2 Dependent Node Constraints

**Issue**: Fatal 2101 — "GRID POINT ILLEGALLY DEFINED IN SETS UM US"
**Fix**: Constraints are applied to dependent nodes of RBE2 elements. Don't constrain dependent nodes — only constrain the independent (master) node.

### Duplicated Bolt Preload Regions

**Issue**: Duplicated bolt preload regions cause solver errors.
**Fix**: Check for duplicated beam elements defining bolt joints. Remove duplicate preload regions. Verify correct bolt regions are selected.

## Best Practices

1. **Use Tools > Check > Element Quality before analysis** — find distorted elements with Nastran tab
2. **Check "Details To Data Table"** — populates Data Table with failing element IDs
3. **Verify element types are structural, not plot** — plot elements aren't exported to solver
4. **Run SOL 103 to find rigid body modes** — 0 Hz frequencies show unconstrained parts
5. **Use PARAM,BAILOUT,-1 for diagnosis** — forces Nastran to continue past errors
6. **Merge coincident nodes** — prevents disconnected parts and mechanisms
7. **Use node merging for critical stress areas** — GLUE for non-critical areas only
8. **Verify INCLUDE file paths** — incorrect paths cause empty .DAT and crash
9. **Increase contact iterations to 45 for curved surfaces** — default 20 is insufficient
10. **Only include tangent-continuous surfaces in contact regions** — avoids projection issues
