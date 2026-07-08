---
title: "COMSOL Optimization and Parametric Sweep: Design Studies and Sensitivity Analysis"
excerpt: "A guide to optimization in COMSOL covering parametric sweeps, optimization module with gradient-free and gradient-based methods, topology optimization for structural and thermal design, and sensitivity analysis for design exploration."
category: "workflow"
softwareSlug: "comsol-multiphysics"
keyword: "comsol optimization parametric sweep"
slug: "comsol-optimization-parametric-sweep-design-studies-sensitivity-analysis"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.comsol.com/optimization-module"
  - "https://doc.comsol.com/"
---

# COMSOL Optimization and Parametric Sweep: Design Studies and Sensitivity Analysis

Optimization in COMSOL is something I've grown to appreciate more over time. At first, I only used parametric sweeps — just running the same model with different parameter values and picking the best result. But once I started using the Optimization Module with SNOPT and MMA, I realized how much faster it is to let the solver find the optimum for me. Let me walk you through how I approach design studies, optimization, and topology optimization in COMSOL.

## Parametric Sweep

### Setup

1. Study > Parametric Sweep
2. Add parameters:
   - **Geometry parameters**: thickness, radius, length
   - **Material parameters**: conductivity, permittivity
   - **Boundary condition parameters**: load, voltage, temperature
3. Define sweep:
   - **Parameter values**: List (1, 5, 10, 20) or Range (range(1, 1, 20))
   - **Multiple parameters**: Combined or individual sweep
4. Run:
   - COMSOL solves for each parameter combination
   - Results stored for all cases

### Combined vs. Individual Sweep

1. **Combined**: All combinations (full factorial)
   - 3 parameters × 5 values each = 125 runs
   - Comprehensive but expensive
2. **Individual**: One at a time
   - 3 parameters × 5 values each = 15 runs
   - Fast but misses interactions

### Results Comparison

1. In Results:
   - Select parameter value from dropdown
   - Compare contour plots between cases
   - Plot output vs. parameter (1D graph)
   - Surface plot (2 parameters vs. 1 output)
2. Example:
   - **X-axis**: Fin thickness (1-5mm)
   - **Y-axis**: Number of fins (5-20)
   - **Color**: Maximum temperature

## Optimization Module

### Optimization Study

1. Study > Optimization
2. Define:
   - **Objective function**: Minimize or maximize
   - **Control variables**: Parameters to optimize
   - **Constraints**: Inequality or equality constraints
3. Set bounds:
   - **Lower bound**: Minimum value for each control variable
   - **Upper bound**: Maximum value

### Optimization Methods

#### Gradient-Free Methods

1. **Nelder-Mead** (Simplex):
   - No gradient needed
   - Good for non-smooth objectives
   - Slower convergence
   - Use for: Discrete parameters, noisy objectives
2. **Coordinate Search**:
   - Searches one parameter at a time
   - Simple, robust
   - Use for: Small number of parameters (< 5)
3. **Monte Carlo**:
   - Random sampling
   - Good for global search
   - Use for: Finding starting point for local optimization

#### Gradient-Based Methods

1. **SNOPT** (Sparse Nonlinear OPTimizer):
   - Sequential quadratic programming
   - Fast convergence for smooth objectives
   - Handles large-scale problems
   - Use for: Continuous parameters, smooth objectives
2. **MMA** (Method of Moving Asymptotes):
   - Good for topology optimization
   - Handles many design variables
   - Use for: Topology and shape optimization
3. **Levenberg-Marquardt**:
   - For least-squares problems
   - Use for: Curve fitting, parameter estimation

### Objective Function Types

1. **Minimize mass**:
   - Objective: ∫ ρ dV (total mass)
   - Constraint: σmax ≤ σallow
2. **Minimize maximum stress**:
   - Objective: max(σvon Mises)
   - Constraint: mass ≤ mass_limit
3. **Minimize temperature**:
   - Objective: max(T)
   - Constraint: mass ≤ mass_limit
4. **Maximize stiffness** (minimize compliance):
   - Objective: ∫ F·u dA (external work)
   - Constraint: mass ≤ mass_limit
5. **Match target response**:
   - Objective: Σ(Ti - Ttarget)² (least squares)
   - No constraint (or bounds on parameters)

### Constraint Types

1. **Inequality**: g(x) ≤ gmax
   - Example: σmax ≤ 250 MPa
2. **Equality**: h(x) = htarget
   - Example: First frequency = 100 Hz
3. **Bounds**: xmin ≤ x ≤ xmax
   - Example: 1mm ≤ thickness ≤ 10mm

## Topology Optimization

### Structural Topology Optimization

1. Add Physics > Solid Mechanics
2. Add Deformed Geometry > Optimization > Topology Optimization
3. Define:
   - **Design variable**: ρe (element density, 0 to 1)
   - **Objective**: Minimize compliance (maximize stiffness)
   - **Constraint**: Volume fraction ≤ 0.4 (40% of original)
   - **Filter**: Helmholtz filter (minimum member size)
4. Material interpolation (SIMP):
   - E(ρ) = ρ^p × E0
   - p: Penalty factor (typically 3)
   - ρ = 0: Void (no material)
   - ρ = 1: Solid (full material)
5. Manufacturing constraints:
   - **Minimum member size**: 3-5 elements
   - **Extrusion constraint**: For extruded parts
   - **Symmetry**: About specified plane
   - **Demold direction**: No undercuts

### Running Topology Optimization

1. Study > Optimization
2. Set:
   - **Optimization method**: MMA (for topology)
   - **Maximum iterations**: 50-200
   - **Move limit**: 0.1 (max change per iteration)
3. Monitor:
   - **Objective**: Should decrease (compliance)
   - **Constraint**: Should converge to target (volume fraction)
   - **Design variable**: Should converge to 0 or 1 (black-white)
4. Results:
   - **Density plot**: Red = solid, blue = void
   - **Iso-surface**: At ρ = 0.5 (structural boundary)
   - **Stress**: On optimized structure

### Thermal Topology Optimization

1. Add Physics > Heat Transfer in Solids
2. Define:
   - **Design variable**: ρe (element density)
   - **Objective**: Minimize max(T) or thermal compliance
   - **Constraint**: Volume fraction ≤ 0.5
   - **Material interpolation**: k(ρ) = ρ^p × k0
3. Applications:
   - **Heat sink topology**: Optimize fin arrangement
   - **Cooling channel**: Optimize channel layout
   - **Thermal insulation**: Optimize insulation distribution

## Shape Optimization

### Setup

1. Instead of element density, optimize boundary shape
2. Define:
   - **Control variables**: Boundary point displacements
   - **Objective**: Minimize stress concentration, maximize stiffness
   - **Constraint**: Volume ≤ V0, or fixed boundary
3. Method:
   - **Free form deformation**: Control polygon deforms geometry
   - **Boundary displacement**: Move boundary nodes

### Applications

- **Fillet optimization**: Find optimal fillet radius to minimize stress concentration
- **Airfoil shape**: Optimize camber and thickness for lift/drag
- **Hole shape**: Optimize hole profile for minimum stress
- **Channel shape**: Optimize duct cross-section for minimum pressure drop

## Sensitivity Analysis

### Local Sensitivity

1. Study > Sensitivity
2. Define:
   - **Objective function**: Output of interest (e.g., max stress, max temperature)
   - **Control variables**: Input parameters
3. COMSOL calculates:
   - **d(Objective)/d(parameter)**: Sensitivity coefficient
   - Shows which parameter has most influence
4. Use:
   - Identify critical parameters (high sensitivity)
   - Identify non-critical parameters (low sensitivity, can be fixed)
   - Understand design trade-offs

### Global Sensitivity

1. Use Parametric Sweep with multiple parameters
2. Calculate:
   - **Output range**: For each parameter variation
   - **Sensitivity index**: Δoutput / Δinput (normalized)
3. Plot:
   - **Tornado chart**: Sensitivity per parameter
   - **Scatter plot**: Output vs. each parameter

## Practical Applications

### Heat Sink Optimization

1. **Parameters**: Fin height (10-50mm), fin thickness (1-5mm), fin count (5-25)
2. **Objective**: Minimize max temperature
3. **Constraint**: Total mass ≤ 200g
4. **Method**: SNOPT (gradient-based)
5. **Result**: Optimal fin height = 35mm, thickness = 2mm, count = 15
6. **Temperature reduction**: 85°C → 72°C (15% improvement)

### Electromagnetic Coil Optimization

1. **Parameters**: Coil radius (5-20mm), wire diameter (0.5-2mm), turns (10-100)
2. **Objective**: Maximize magnetic field at center
3. **Constraint**: Power ≤ 10W, volume ≤ 1000mm³
4. **Method**: SNOPT
5. **Result**: Optimal radius = 12mm, wire = 1mm, turns = 50
6. **Field increase**: 0.1T → 0.15T (50% improvement)

### Bracket Topology Optimization

1. **Design space**: 100×80×30mm block
2. **Load**: 5000N at top
3. **Constraint**: Fixed at bottom, volume ≤ 40%
4. **Objective**: Minimize compliance (maximize stiffness)
5. **Method**: MMA (topology)
6. **Result**: Organic structure with 40% volume, 60% weight reduction
7. **Verification**: Max stress = 145 MPa < yield 250 MPa

## Verification of Optimized Design

1. **Run full analysis**: On optimized geometry (not just optimization result)
2. **Check all constraints**: Stress, displacement, temperature, mass
3. **Mesh convergence**: Verify results don't change with mesh refinement
4. **Compare to original**: Ensure improvement is real
5. **Manufacturing check**: Can the optimized design be manufactured?

## Verification Checklist

- [ ] Control variables have appropriate bounds
- [ ] Objective function is well-defined and measurable
- [ ] Constraints are physically meaningful
- [ ] Optimization method matches problem type (gradient-free for non-smooth, gradient for smooth)
- [ ] Optimization converges (objective stabilizes, constraints satisfied)
- [ ] Optimized design is verified with full analysis
- [ ] Mesh independence is checked for optimized design
- [ ] Manufacturing constraints are applied (for topology)
- [ ] Sensitivity analysis identifies critical parameters
- [ ] Results are physically reasonable

## Wrapping Up

My advice for optimization in COMSOL: start with parametric sweeps before jumping into formal optimization. They're simpler, they give you a feel for how the design responds, and you can use them to find a good starting point for the optimizer. When you do use the Optimization Module, pick the right method — SNOPT for smooth problems with continuous variables, Nelder-Mead for non-smooth or noisy objectives, and MMA for topology optimization. And always run a full verification analysis on the optimized design. I've caught cases where the optimizer found a solution that technically met the constraints but had stress concentrations in places the optimization didn't check.
