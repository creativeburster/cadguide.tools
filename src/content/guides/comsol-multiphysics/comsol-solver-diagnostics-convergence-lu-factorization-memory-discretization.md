---
title: "COMSOL Solver Diagnostics: Non-Convergence Residual Analysis, LU Factorization Out-of-Memory, Quadratic vs Linear Discretization DOF Impact, and Mesh Refinement Strategy"
excerpt: "COMSOL Multiphysics fails to converge for 6 distinct reasons: ill-conditioned stiffness matrices from bad physics formulation, no stationary solution exists, non-unique solutions needing pressure point constraints, mesh too coarse for steep gradients, LU factorization memory exhaustion from quadratic elements, and segregated solver iteration limits. We cover each with diagnostic approaches and fixes from COMSOL knowledge base and forums."
category: "solver-diagnostics"
softwareSlug: "comsol-multiphysics"
keyword: "COMSOL solver convergence failed residual LU factorization out of memory quadratic linear discretization mesh refinement"
slug: "comsol-solver-diagnostics-convergence-lu-factorization-memory-discretization"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://www.comsol.com/support/knowledgebase/964"
  - "https://www.comsol.com/support/knowledgebase/1030"
  - "https://www.comsol.com/forum/thread/344711/out-of-memory-during-lu-factorization"
---

# COMSOL Solver Diagnostics: Non-Convergence Residual Analysis, LU Factorization Out-of-Memory, Quadratic vs Linear Discretization DOF Impact, and Mesh Refinement Strategy

COMSOL Multiphysics solver failures fall into two categories: convergence failures (the solver can't find a solution that satisfies tolerances) and memory failures (the solver runs out of RAM during matrix operations). Both have multiple root causes that require different fixes. This guide covers the diagnostic approach for each failure type with fixes from the official COMSOL knowledge base and community forums.

## 1. "Failed to Find a Solution. Returned Solution is Not Converged"

### Message

```
Failed to find a solution.
The relative residual (0.28) is greater than the relative tolerance.
Returned solution is not converged.
```

### Root Cause

The numerical conditioning of the system of equations is bad. This indicates an **unsuitable or erroneous physical formulation** of the problem, not a solver bug.

### 6 Possible Causes and Fixes

### Cause A: Highly Nonlinear Problem

**Fix**: Cancel some known nonlinearity and gently ramp it up with the parametric solver. For example, in mass transport models with fast reactions, start with a lower reaction rate and increase it parametrically.

### Cause B: No Stationary Solution Exists

**Example**: A constantly positive heat source surrounded by insulating walls — temperature increases forever and never reaches steady state.

**Fix**: Run a **time-dependent study** instead of a stationary study. This reveals what's physically happening and whether a steady state can exist.

### Cause C: Non-Unique Solutions

**Example**: Cavity flow problem — without a pressure reference point, the problem has infinite solutions (all differing by a constant pressure offset).

**Fix**: Right-click the physics interface head node → select **Pressure Point Constraint** under Points. Constrain one point to an arbitrary pressure (e.g., 0).

### Cause D: Mesh Too Coarse for Steep Gradients

**Example**: Natural convection near walls — the mesh can't resolve the boundary layer.

**Fix**: Refine the mesh **locally** where steep gradients are expected. Don't globally refine — use local mesh refinement or boundary layer meshing.

### Cause E: Ill-Conditioned Stiffness Matrix from High Aspect Ratio

**Example**: Modeling a thin shell with solid elements in structural mechanics.

**Fix**: Turn off error control in the linear solver:
1. Go to the **Direct** node in the solver sequence
2. In the **Error** section, set **Check error estimate** to **No**
3. This forces the solver to return a solution unless the stiffness matrix is singular
4. **Verify solution consistency** — compare applied load to reactions

### Cause F: Segregated Solver Iteration Limit

**Message**: `Maximum number of segregated iterations reached. Returned solution is not converged.`

**Fix**: Increase the maximum number of segregated iterations in the solver settings, or switch to a fully coupled solver if the physics are tightly coupled.

## 2. "Out of Memory During LU Factorization"

### Message

```
Failed to find a solution for the initial parameter.
Out of memory during LU factorization.
Returned solution is not converged.
Not all parameter steps returned.
```

### Root Cause

The direct solver performs LU factorization on the stiffness matrix, which requires memory proportional to the matrix size. When the model has too many degrees of freedom (DOFs) for the available RAM, LU factorization fails.

### Why Quadratic Elements Dramatically Increase Memory

A user with 1,400,000 tetrahedral elements and 4 dependent variables estimated ~1,200,000 DOFs. But the log showed:

```
Geometry shape function: Quadratic Lagrange
Physical memory: 6.36 GB
```

**The user was using second-order (quadratic) elements**, not linear. Quadratic elements dramatically increase DOF count compared to linear elements.

### DOF Estimation

| Element Order | DOF Formula (approximate) | Example (1.4M elements, 4 vars) |
|--------------|--------------------------|-------------------------------|
| Linear | 0.2 × elements × vars | ~1,120,000 |
| Quadratic | ~1.0 × elements × vars | ~5,600,000 |

**Quadratic elements can increase DOFs by 5x or more**, with proportional memory increase.

### Fix: Switch to Linear Discretization

1. Go to the **Discretization** section in the physics interface settings
2. Change from **Quadratic Lagrange** to **Linear Lagrange**
3. The user confirmed: "With linear discretization it takes about 32 GB and it completes"

### Additional Memory Reduction Strategies

1. **Use assembly meshing** (Form Assembly instead of Form Union):
   - Allows non-congruent meshes between parts
   - Particularly recommended for solid mechanics and heat transfer
   - Reduces DOF count at assembly interfaces

2. **Use swept meshing** on coils and prismatic geometries:
   - Creates structured mesh layers
   - Significantly reduces DOF count vs. tetrahedral meshing

3. **Reduce mesh density** — "The mesh may be finer than needed. You can save a lot of memory by adjusting the mesh."

4. **Use submodeling**:
   - Solve a sequence of models with different detail levels
   - Use coarse global model, then refine locally

5. **Use iterative solver instead of direct**:
   - Iterative solvers use less memory than direct (LU)
   - For 3D models with many DOFs, switch from direct to iterative
   - May require preconditioner tuning

6. **Use symmetry**:
   - If geometry is symmetric, model only half
   - Reduces DOFs by ~50%
   - Apply symmetry boundary conditions on the cut plane

7. **Predict memory requirements**:
   - Solve smaller models with same physics
   - Monitor memory and DOFs
   - Fit a second-order polynomial to predict full model memory
   - Compare with available RAM before attempting full solve

## 3. Model Stuck / Hanging During Solve

### Symptom

The simulation appears stuck — no progress, no error message. Using an i5 processor with 16 GB RAM for a model with 19,338,394 DOFs.

### Root Cause

The solver is **running out of core** — writing to hard disk when RAM is exhausted. This makes the solve extremely slow but not technically stuck.

### Fix

1. **Check if solver is writing to disk** — monitor disk activity during solve
2. **Reduce model size** — 19M DOFs on 16 GB RAM is severely undersized
3. **Use linear discretization** to reduce DOFs
4. **Use swept mesh** to reduce element count
5. **Move to a machine with more RAM** — 16 GB is insufficient for 19M DOFs
6. **Use cluster computing** if a Floating Network License is available

### Memory Rule of Thumb

- **Direct solver**: ~1 GB per 100,000 DOFs (quadratic elements)
- **Iterative solver**: ~1 GB per 500,000 DOFs
- **Always check DOFs** in the Messages window before solving

## 4. Checking Element Order

### How to Verify

1. Look at the solver log: `Geometry shape function: Quadratic Lagrange` or `Linear Lagrange`
2. Or check in the GUI: Physics interface → Discretization section → Element order
3. The DOF count is printed in the **Messages tab** when the analysis starts

### When to Use Each

| Element Order | Accuracy | Memory | Use Case |
|--------------|----------|--------|----------|
| Linear | Lower | ~5x less | Large models, initial testing, memory-constrained |
| Quadratic | Higher | ~5x more | Final results, small-to-medium models, stress concentration |

### Recommended Workflow

1. Start with **linear elements** and coarse mesh
2. Solve and verify the model runs
3. Refine mesh and observe solution change
4. Switch to **quadratic elements** for final solution
5. Compare linear vs. quadratic results to assess accuracy

## 5. Ramping Nonlinear Problems

### Strategy

For highly nonlinear problems (fast reactions, large deformation, phase change):

1. **Identify the nonlinear parameter** (reaction rate, load magnitude, etc.)
2. **Create a parametric sweep** from a low value to the target value
3. Start with a value where the problem is nearly linear
4. Use each solution as the initial condition for the next parameter value
5. Gradually increase to the full nonlinear case

### Example

For a mass transport model with fast reaction (k = 1e6):
1. Start with k = 1e2 (nearly linear)
2. Ramp: 1e2 → 1e3 → 1e4 → 1e5 → 1e6
3. Each step uses the previous solution as initial condition
4. This avoids the solver trying to resolve extreme nonlinearity in a single step

## Best Practices

1. **Check element order** before solving — quadratic elements use 5x more memory
2. **Start with linear elements** and coarse mesh — verify the model works before refining
3. **Use swept meshing** for prismatic geometries — dramatically reduces DOFs
4. **Predict memory** by solving smaller models and extrapolating
5. **Use iterative solvers** for large 3D models — less memory than direct
6. **Add Pressure Point Constraint** for flow problems — prevents non-unique solutions
7. **Ramp nonlinear parameters** — don't jump to full nonlinearity in one step
8. **Use symmetry** — model half the geometry when possible
9. **Monitor disk activity** — if the solver is "stuck," it may be writing to disk
10. **Check DOFs in Messages tab** — compare with available RAM before solving
