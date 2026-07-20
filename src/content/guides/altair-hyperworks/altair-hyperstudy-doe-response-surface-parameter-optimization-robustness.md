---
title: "Altair HyperStudy: Design of Experiments, Response Surfaces, and Parameter Optimization"
excerpt: "How to use Altair HyperStudy for design exploration — covering Design of Experiments (DOE) setup, response surface methodology, parameter optimization, stochastic studies for robustness, and linking HyperStudy with OptiStruct for automated design iteration."
category: "workflow"
softwareSlug: "altair-hyperworks"
keyword: "altair hyperstudy doe response surface parameter optimization robustness"
slug: "altair-hyperstudy-doe-response-surface-parameter-optimization-robustness"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-07-09"
sources:
  - "https://2026.help.altair.com/2026/hwdesktop/hwx/topics/pre_processing/meshing/batchmesher_criteria_parameter_best_practices_r.htm"
  - "https://www.help.altair.com/2021/hwdesktop/hm/topics/pre_processing/meshing/solid_mesh_optimization_t.htm"
---

# Altair HyperStudy: Design of Experiments, Response Surfaces, and Parameter Optimization

HyperStudy is Altair's design exploration tool. It sits on top of your FEA solver and systematically varies design parameters to find the best combination. Instead of changing one parameter at a time and re-running, HyperStudy runs a designed set of experiments and builds a mathematical model of the design's behavior. We've used HyperStudy to optimize everything from bracket thickness to full suspension geometry. Here's our workflow.

## What HyperStudy Does

HyperStudy provides:
- **Design of Experiments (DOE)**: Systematically sample the design space
- **Response Surface Methodology (RSM)**: Build mathematical surrogate models
- **Optimization**: Find the best parameter combination
- **Stochastic studies**: Assess robustness and reliability
- **Sensitivity analysis**: Identify which parameters matter most

## Why Use HyperStudy Instead of Manual Iteration

Manual iteration: Change one parameter, re-run, check result, repeat. Problems:
- **Slow**: Each iteration takes minutes to hours
- **One-at-a-time**: Can't find interactions between parameters
- **No guarantee of finding the optimum**: You might miss the best combination
- **No robustness assessment**: Don't know how sensitive the design is to variations

HyperStudy: Run a designed set of experiments, build a surrogate model, optimize. Benefits:
- **Efficient**: DOE explores the design space with minimal runs
- **Interactions**: Captures parameter interactions
- **Finds the optimum**: Mathematical optimization finds the best combination
- **Robustness**: Stochastic studies assess sensitivity to variations

## Step 1: Define the Model

1. Open HyperStudy.
2. Create a new study.
3. **Register the solver**: Select OptiStruct (or any supported solver).
4. **Define the model**:
   - **Input file**: The solver input file (.fem for OptiStruct)
   - **Output file**: The result file (.h3d, .out)
   - **Working directory**: Where HyperStudy runs each analysis
5. HyperStudy will modify the input file for each design point.

## Step 2: Define Design Variables

Design variables are the parameters HyperStudy will vary:

1. Go to **Define Models** → **Parameters**.
2. Add design variables from the input file:
   - **Property dimensions**: Shell thickness, beam cross-section, solid dimensions
   - **Material properties**: Young's modulus, yield strength, density
   - **Load magnitudes**: Force, pressure, temperature
   - **Geometry parameters**: Dimensions that parametrize the geometry
3. For each design variable:
   - **Lower bound**: Minimum value
   - **Upper bound**: Maximum value
   - **Initial value**: Starting point (usually the nominal design)
   - **Variable type**: Continuous (any value) or discrete (specific values)

### Design Variable Best Practices

- **Choose meaningful variables** — only vary parameters that affect the objective
- **Set realistic bounds** — don't allow physically impossible values
- **Limit the number of variables** — more than 10-15 variables makes DOE expensive
- **Use discrete variables for standard sizes** — e.g., shell thickness from standard gauge

## Step 3: Define Output Responses

Output responses are the quantities HyperStudy will track:

1. Go to **Define Models** → **Responses**.
2. Add responses from the output file:
   - **Mass**: Total model mass
   - **Max stress**: Maximum von Mises stress
   - **Max displacement**: Maximum displacement magnitude
   - **First frequency**: First natural frequency
   - **Compliance**: Total strain energy
3. For each response:
   - **Type**: Scalar (single value) or vector (multiple values)
   - **Extraction**: How to read the value from the output file

### Common Response Definitions

- **Mass**: Read from the OptiStruct .out file
- **Max stress**: Read from the .h3d file — maximum von Mises stress
- **Max displacement**: Read from the .h3d file — maximum displacement magnitude
- **Frequency**: Read from the .out file — first natural frequency

## Step 4: Run a Design of Experiments (DOE)

DOE samples the design space systematically:

1. Go to **DOE** → **Add Matrix**.
2. Select the DOE method:
   - **Full Factorial**: Every combination of variable levels — most thorough but expensive
   - **Fractional Factorial**: Subset of full factorial — efficient for many variables
   - **Latin Hypercube Sampling (LHS)**: Space-filling design — good for continuous variables
   - **Hammersley**: Low-discrepancy sequence — efficient space filling
   - **Box-Behnken**: For response surface fitting — fewer runs than full factorial
3. Set the number of runs:
   - **Full Factorial**: 2^n (n = number of variables) — 10 variables = 1024 runs
   - **LHS**: Typically 10-20 × number of variables
   - **Hammersley**: Typically 10-20 × number of variables
4. Click **Run**.
5. HyperStudy executes each run:
   - Modifies the input file with the DOE parameter values
   - Runs the solver
   - Extracts the response values
   - Stores results in a matrix

### DOE Method Selection

| Method | Variables | Runs | Best For |
|---|---|---|---|
| Full Factorial | < 5 | 2^n | Thorough exploration |
| LHS | 5-20 | 10-20 × n | Continuous variables |
| Hammersley | 5-20 | 10-20 × n | Space-filling |
| Box-Behnken | 3-10 | 2n² + 2n + 1 | Response surface fitting |

### DOE Results

After the DOE completes:
1. **Review the run matrix**: Each row is a design point with variable values and responses
2. **Identify trends**: Which variables increase/decrease each response
3. **Find the best design point**: The run with the best objective value
4. **Identify interactions**: Variables that affect each other's influence

## Step 5: Build a Response Surface

A response surface is a mathematical model that approximates the relationship between design variables and responses:

1. Go to **Fit** → **Add Fit**.
2. Select the DOE matrix as input.
3. Choose the fit method:
   - **Least Squares Regression**: Simple polynomial fit — fast but limited
   - **Kriging**: Gaussian process — accurate but expensive
   - **Radial Basis Function (RBF)**: Good balance of accuracy and speed
   - **Moving Least Squares**: Adaptive — good for nonlinear responses
4. Set the polynomial order (for regression):
   - **Linear**: First-order — captures main effects
   - **Quadratic**: Second-order — captures interactions and curvature
   - **Cubic**: Third-order — captures complex curvature
5. Click **Run** to build the response surface.

### Response Surface Quality

1. Check the **R² value**: 
   - **> 0.95**: Excellent fit
   - **0.85-0.95**: Good fit
   - **< 0.85**: Poor fit — try a different method or add more DOE points
2. Check **residuals**: Difference between actual and predicted values
   - **Small residuals**: Good fit
   - **Large residuals**: Poor fit in certain regions
3. **Cross-validation**: Remove some DOE points, rebuild the fit, and check predictions
   - If predictions are good, the fit is robust
   - If predictions are poor, the fit is over-fitted

### Using the Response Surface

Once built, the response surface allows:
- **Instant evaluation**: Predict responses for any variable combination without running the solver
- **Optimization**: Run optimization on the response surface (fast — no solver runs)
- **Sensitivity**: Calculate derivatives analytically
- **Visualization**: Plot response vs. variables (2D, 3D, contour)

## Step 6: Run Optimization

1. Go to **Optimization** → **Add Optimization**.
2. Define the optimization problem:
   - **Objective**: Minimize mass, minimize stress, maximize frequency, etc.
   - **Constraints**: Stress < allowable, displacement < limit, frequency > target
   - **Design variables**: Same as defined earlier
3. Choose the optimization method:
   - **GRSM (Global Response Surface Method)**: Builds and optimizes response surfaces — efficient for global optimization
   - **ARSM (Adaptive Response Surface Method)**: Sequential optimization with adaptive response surfaces
   - **GA (Genetic Algorithm)**: Population-based — good for discrete variables
   - **SQP (Sequential Quadratic Programming)**: Gradient-based — fast for smooth problems
4. Set the number of evaluations:
   - **GRSM**: 50-200 evaluations
   - **GA**: 100-1000 evaluations
   - **SQP**: 10-50 evaluations
5. Click **Run**.

### Optimization on Response Surface vs. Direct

**On response surface**:
- Fast — no solver runs
- Limited by response surface accuracy
- Good for initial exploration

**Direct (using solver)**:
- Slow — each evaluation runs the solver
- Accurate — no approximation
- Good for final optimization

### Optimization Results

1. **Optimal design**: The best variable combination
2. **Objective value**: The achieved objective (e.g., minimum mass)
3. **Constraint values**: All constraints satisfied
4. **Convergence history**: Objective vs. iteration — should converge

## Step 7: Run a Stochastic Study

Stochastic studies assess robustness — how the design performs with manufacturing variations:

1. Go to **Stochastic** → **Add Stochastic**.
2. Define variable distributions:
   - **Normal**: Mean and standard deviation (e.g., thickness = 2.0 ± 0.1mm)
   - **Uniform**: Min and max (e.g., E = 200-210 GPa)
   - **Lognormal**: For positive-only variables
3. Set the number of samples:
   - **Monte Carlo**: 1000-10000 samples
   - **Reliability**: 100-500 samples
4. Click **Run**.
5. HyperStudy evaluates each sample (using the response surface or direct solver).

### Stochastic Results

1. **Distribution of responses**: Histogram of mass, stress, displacement
2. **Probability of failure**: P(stress > allowable) — reliability assessment
3. **Sensitivity**: Which variables contribute most to response variability
4. **Robustness**: How much the response varies with input variations

### Why Stochastic Studies Matter

- **Manufacturing tolerance**: Real parts have dimensional variations
- **Material variability**: Material properties vary batch to batch
- **Load uncertainty**: Actual loads may differ from design loads
- **Reliability**: What percentage of parts will meet the design criteria?

## Step 8: Link HyperStudy with HyperMesh

For geometry-based optimization:

1. In HyperMesh, parametrize the geometry:
   - **Shape variables**: Define shape perturbation vectors
   - **Size variables**: Define property dimensions
2. Export the parametrized model.
3. In HyperStudy, register the HyperMesh-HyperStudy link.
4. HyperStudy modifies the geometry parameters and re-meshes for each design point.

### Shape Optimization Workflow

1. Define shape variables in HyperMesh (shape perturbation vectors)
2. Link to HyperStudy
3. Run DOE or optimization
4. For each design point:
   - HyperStudy modifies the shape variables
   - HyperMesh updates the geometry and mesh
   - OptiStruct runs the analysis
   - HyperStudy extracts responses

## Best Practices

- **Start with a DOE** — understand the design space before optimizing
- **Limit design variables to 10-15** — more variables make DOE expensive
- **Use LHS for continuous variables** — efficient space filling
- **Check response surface R²** — ensure the fit is accurate enough
- **Optimize on response surface first** — fast exploration
- **Verify with direct solver runs** — confirm the optimal design
- **Run stochastic studies for production designs** — assess robustness
- **Document the optimization setup** — record variables, bounds, objectives, constraints
- **Compare optimized design with baseline** — show improvement
- **Review with the design team** — optimization results inform design decisions
