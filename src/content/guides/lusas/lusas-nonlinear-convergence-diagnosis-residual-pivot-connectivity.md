---
title: "LUSAS Nonlinear Convergence Diagnosis: Residual Norm Analysis, Connectivity Verification, Pivot Warnings, and Line Search Acceleration"
excerpt: "LUSAS nonlinear FEA convergence failures stem from 12 distinct causes: excessive load increments, stiff element round-off, poor aspect ratios, slackened convergence criteria, element mechanisms, and connectivity problems. We cover the diagnostic workflow from output file analysis to residual norm behavior interpretation and line search acceleration."
category: "convergence-diagnosis"
softwareSlug: "lusas"
keyword: "LUSAS nonlinear convergence failure residual norm pivot warning connectivity line search diagnosis"
slug: "lusas-nonlinear-convergence-diagnosis-residual-pivot-connectivity"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://www.lusas.com/user_area/instruct/convergence_checklist.html"
  - "https://www.lusas.com/user_area/theory/Nonlinear_Residual_Convergence_Criterion.html"
  - "https://www.lusas.com/user_area/documentation/1036_Connectivity%20how%20to%20spot%20problems.pdf"
---

# LUSAS Nonlinear Convergence Diagnosis: Residual Norm Analysis, Connectivity Verification, Pivot Warnings, and Line Search Acceleration

Nonlinear convergence failure in LUSAS has 12 distinct root causes, each requiring a different remedy. The diagnostic workflow starts with the output file (pivot/decay warnings), proceeds through the convergence checklist, and uses residual norm behavior to narrow the cause. This guide covers the complete diagnostic process.

## The Residual Convergence Criterion

LUSAS measures convergence as the ratio of out-of-balance (residual) forces to externally applied forces:

**rdnrm = (Fext - Fint) / Fext × 100%**

Where:
- **Fext** = externally applied loads
- **Fint** = internally developed forces
- **rdnrm** = residual norm, output to the nonlinear log file

The residual norm should decrease during iteration, but the decrease is **not necessarily monotonic** — oscillating but converging behavior is typical.

### Interpreting rdnrm Behavior

| rdnrm Behavior | Likely Cause | Remedy |
|----------------|-------------|--------|
| Oscillating, not decreasing | Element mechanisms or inadequate mesh | Use fine integration rule; refine mesh |
| Decreasing then plateauing | Structure approaching collapse | Check for point load singularities; check supports |
| Decreasing very slowly | Convergence criteria too slack | Tighten criteria, especially for geometric nonlinearity |
| Decreasing then diverging | Load increment too large | Switch to automatic incrementation; reduce increment size |
| Sudden jump | Contact condition change | Establish contact equilibrium first with elastic properties |

## The 12-Point Convergence Checklist

### 1. Check the Output File

Investigate the LUSAS output file first. Look for **pivot or diagonal decay warnings** — these indicate matrix conditioning problems that must be resolved before addressing convergence directly.

### 2. Load Increment Too Large

- If using **manual nonlinear incrementation**: switch to **automatic nonlinear incrementation**
- If already using automatic: **reduce the load increment further**
- For contact analyses: the first increment is typically the most difficult as initial contact conditions are established

### 3. Insufficient Iterations

If the solution was converging slowly but needed more iterations than specified:
- **Increase the maximum iterations per increment**

### 4. Stiff Element Round-Off

Relatively stiff elements (e.g., rigid links simulated with joint or bar elements) produce:
- Numerical round-off problems
- Uncontrolled propagation of nonlinearity through the mesh

**Fix**: Reduce the stiffness by **one or two orders of magnitude** — this can significantly improve convergence rate without meaningfully affecting results.

### 5. Poor Element Aspect Ratios

Elements with aspect ratios **greater than 1:10** cause difficulties in:
- Materially nonlinear analyses (large stress gradients causing material failure)
- Geometrically nonlinear analyses (large deformations)

**Fix**: Remesh with better aspect ratios, particularly in high-stress-gradient regions.

### 6. Mesh Cracks

Ensure there are **no cracks** in the mesh — partially merged or unequivalenced nodes create discontinuities that prevent convergence.

### 7. Slackened Convergence Criteria

Slackening convergence criteria can help initial increments converge but causes problems later:
- The slackness prevents the solution from following the equilibrium path accurately
- **Use default settings** for displacement and residual norms, particularly for geometrically nonlinear analyses

### 8. Element Mechanisms

Certain elements (especially **Semiloof shell elements** in very thin, curved meshes) are prone to mechanisms excited by loading patterns.

**Fix**: Invoke the **fine integration rule** for these elements. Check the Element Reference Manual to confirm the element supports fine integration. If the problem persists, continue with fine integration and **refine the mesh further**.

### 9. Enhanced Strain Formulation Issues

Enhanced strain elements (QPM4M, HX8M, etc.) can cause numerical problems with material nonlinearity.

**Fix**: Revert to **standard continuum versions** of these elements if enhanced strain formulation is suspected.

### 10. Slideline Contact Problems

Contact analyses involving slidelines have multiple potential causes. Key strategy:
- **Establish contact equilibrium first** using elastic properties from the previous load increment
- Then resolve material nonlinearity
- This prevents convergence difficulties from invalid contact conditions during material nonlinear iteration

### 11. Structure Approaching Collapse

A section with nonlinear material may be close to complete collapse due to:
- **Single point supports**: associated elements can fail, removing support
- **Single point loads**: generate stress singularities that cause elements across the section to fail

**Fix**: Replace point supports/loads with distributed equivalents. For point loads, use a small patch of elements to distribute the load.

### 12. Concrete Material Model

If using the concrete material model:
- **Slacken the residual norm** to 5% (from default)
- Check if more plastic strain is developing than expected
- Verify material properties

## Connectivity Problems

### The Geometry Principle

LUSAS is a feature-based Modeller — geometry is defined first, then meshed. For proper connectivity:

- **Volumes** must share a common **surface** to be connected
- **Surfaces** must share a common **line** to be connected
- **Lines** must share a common **point** to be connected

### Detecting Connectivity Problems

1. Run analysis — connectivity issues often produce warnings about stiffness matrix condition
2. Check deformed shape — if elements appear noticeably displaced due to free body motion, connectivity or boundary conditions are wrong
3. Display free edges and non-manifold edges in the mesh

### The CAD Tolerance Problem

When importing geometry from IGES files, lines defining surface edges may not merge because:
- CAD systems use **coarser default tolerances** (e.g., 0.01)
- LUSAS default merge tolerance is **1.0E-6**
- Lines intended to be coincident may be offset by ~0.001 — outside LUSAS's merge threshold

**Fix**: Set the CAD modelling tolerance to **1.0E-6** before creating and exporting geometry. This is especially important for polylines, where curves are approximated based on the tolerance used during creation.

### Correcting Connectivity

1. **Merge coincident features**: Geometry menu → Point/Line/Surface → Make Mergeable → Merge
2. **Adjust merge tolerance**: Access via Modeller settings (default 1.0E-6)
3. **Split overlapping geometry**: When two lines overlap, splitting can resolve the conflict
4. **Re-mesh after geometry fixes**: The mesh must be regenerated to reflect corrected connectivity

## Line Search Acceleration

### When to Use Line Searches

Line searches are an iterative acceleration technique that minimizes potential energy associated with residual forces at each iterative step. They are particularly useful for:
- **Material nonlinear problems** with localised nonlinearity
- **Modified Newton-Raphson** methods (where tangent stiffness isn't reformed every iteration)
- Problems where convergence is slow but stable

### How Line Searches Work

1. After each Newton-Raphson iteration, LUSAS checks the **line search tolerance factor** (epsln) in the nonlinear log
2. If |epsln| exceeds the line search tolerance (toline), additional optimisation iterations are performed
3. These minimise the potential energy associated with residual forces
4. The added computation is usually offset by fewer overall iterations

### When NOT to Use Line Searches

- For simple problems that converge quickly — line searches add overhead without benefit
- When the solution is diverging — line searches won't fix fundamental model problems

## Nonlinear Solution Procedure

LUSAS uses the **Newton-Raphson** iterative procedure:

1. **Initial prediction**: Based on tangent stiffness (KT1), compute incremental displacement (Da1)
2. **Residual force**: Da1 doesn't generally achieve equilibrium → residual force [y(a1)] is created
3. **New tangent stiffness**: Evaluate KT2 at the new configuration
4. **Next iteration**: Use KT2 with applied load (R) and previous residual to predict Da2
5. **Repeat** until convergence criteria are satisfied

### Modified Newton-Raphson

The continual formation and inversion of the tangent stiffness matrix is expensive. Modified methods reuse the initial stiffness for multiple iterations, reducing cost but potentially slowing convergence. Line searches compensate for this slower convergence rate.

## Diagnostic Workflow Summary

1. **Check output file** for pivot/decay warnings → fix matrix conditioning first
2. **Read rdnrm behavior** in nonlinear log → identify convergence pattern
3. **Verify connectivity** → check geometry merging, CAD tolerance, free edges
4. **Check load increment size** → switch to automatic, reduce if needed
5. **Review element types** → avoid enhanced strain with material nonlinearity; use fine integration for mechanisms
6. **Check aspect ratios** → remesh if > 1:10 in critical regions
7. **Verify convergence criteria** → use defaults; don't slacken for geometric nonlinearity
8. **Consider line searches** → enable for material nonlinearity with modified Newton-Raphson
9. **Check for collapse** → replace point supports/loads with distributed equivalents
10. **For contact + material** → establish contact equilibrium first with elastic properties
