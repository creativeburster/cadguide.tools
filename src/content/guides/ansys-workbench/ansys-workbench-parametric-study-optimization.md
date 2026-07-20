---
title: "Ansys Workbench Parametric Study: Design Exploration and Optimization Workflow"
excerpt: "Running a parametric study in Ansys Workbench lets you explore design space without manually re-running each configuration. We cover the setup, design points, and response surface optimization we use for design exploration."
category: "deployment"
softwareSlug: "ansys-workbench"
keyword: "Ansys Workbench parametric study design optimization"
slug: "ansys-workbench-parametric-study-optimization"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-06-18"
sources:
  - "https://forum.ansys.com/forums/topic/convergence-issue-in-non-linear-problem/"
  - "https://forum.ansys.com/forums/topic/convergence-issues-with-material-model-changes/"
---

# Ansys Workbench Parametric Study: Design Exploration and Optimization Workflow

We use parametric studies in Ansys Workbench for nearly every design optimization project. Whether we're optimizing a bracket for minimum weight with a stress constraint, or finding the optimal wall thickness for a pressure vessel, the parametric workflow lets us explore the design space systematically instead of guessing. We'll walk through the complete workflow we use, from setting up parameters to generating response surfaces and finding optimal designs.

## Setting Up Parameters

Parameters in Ansys Workbench are divided into **Input Parameters** (design variables you control) and **Output Parameters** (results you want to monitor or optimize).

### Input Parameters

Input parameters come from your CAD model or your Ansys Mechanical setup:

1. **CAD Parameters**: In SpaceClaim or DesignModeler, mark dimensions as parameters:
   - Right-click a dimension → **Parameter**
   - The dimension appears in the Workbench parameter pane with a checkbox (P)
   - Examples: wall thickness, fillet radius, hole diameter, beam length

2. **Mechanical Parameters**: In Mechanical, mark analysis settings as parameters:
   - Load magnitude (force, pressure, temperature)
   - Material properties (Young's modulus, yield strength)
   - Contact stiffness factor
   - Mesh element size

### Output Parameters

Output parameters are results from your analysis:

1. In Mechanical, right-click a result (e.g., Equivalent Stress) → **Insert → Result Item**
2. Set the result type:
   - **Maximum**: Maximum value of the result
   - **Minimum**: Minimum value of the result
3. Check the **Parameter** checkbox (P) to mark it as an output parameter
4. Common output parameters:
   - Maximum equivalent stress (von Mises)
   - Maximum total deformation
   - Maximum principal stress
   - Total mass
   - Factor of safety
   - Natural frequency (modal analysis)

## Running Design Points

Once your parameters are set up, the Workbench parameter pane shows a table of design points:

1. In the Workbench Project Schematic, click the **Parameters** checkbox
2. A **Parameter Set** appears below the analysis system
3. Double-click the **Parameter Set** to open the parameter table
4. The first row is the current design point (DP0)
5. Add additional design points by clicking in the empty rows and entering values

### Running Multiple Design Points

1. Select the design points you want to run (Ctrl+click for multiple)
2. Right-click → **Update Selected Design Points**
3. Workbench runs each design point sequentially
4. For each design point, it:
   - Updates the CAD model with new parameter values
   - Regenerates the mesh
   - Runs the analysis
   - Extracts the output parameters
5. Results appear in the parameter table

### Parallel Execution

If you have multiple CPU cores or multiple machines with Ansys installed:

1. **Tools → Options → Design Exploration → Use Remote Solve Manager**
2. Configure the remote solve settings
3. Design points will be distributed across available compute resources
4. This can reduce total solve time by 3-5x for large studies

## Design of Experiments (DOE)

Instead of manually choosing design points, use the DOE module to systematically explore the design space:

1. In the Parameter Set, click **Design of Experiments**
2. Select the DOE type:
   - **Central Composite Design (CCD)**: Good for 2-5 parameters, provides good coverage with reasonable number of runs
   - **Optimal Space-Filling Design**: Good for 5+ parameters, fills the design space evenly
   - **Box-Behnken**: Good for 3-4 parameters, fewer runs than CCD
3. Set the range for each input parameter:
   - Lower bound and upper bound
   - The range should be wide enough to explore the design space but narrow enough to avoid unrealistic configurations
4. Click **Preview** to see the number of design points
5. Click **Update** to run all design points

### DOE Results

After the DOE completes, you'll see:

1. **Design Points table**: All input and output parameter values for each run
2. **Sensitivity chart**: Shows which input parameters have the most influence on each output
3. **Correlation matrix**: Shows linear correlations between inputs and outputs
4. **Parallel chart**: Shows all design points in a parallel coordinates plot

Use the sensitivity chart to identify which parameters matter most. Parameters with low sensitivity can be fixed at their nominal value, reducing the dimensionality of the problem.

## Response Surface

The response surface is a mathematical model that approximates the relationship between input and output parameters. It lets you explore the design space without running additional analyses.

1. In the Design Exploration tab, click **Response Surface**
2. Select the response surface type:
   - **Standard Response Surface**: Uses polynomial regression (fast, good for smooth problems)
   - **Kriging**: Uses a Gaussian process model (slower, more accurate for nonlinear responses)
   - **Non-Parametric**: Uses neural networks (good for highly nonlinear responses with many parameters)
3. Click **Update** to generate the response surface
4. The response surface is built from the DOE design points — no additional solver runs are needed

### Using the Response Surface

1. **Local Chart**: Shows the effect of one input parameter on one output parameter
2. **Surface Chart**: Shows the effect of two input parameters on one output parameter (3D surface)
3. **Sensitivity**: Shows the global sensitivity of outputs to inputs
4. **Min/Max Search**: Finds the minimum and maximum of each output within the design space

## Optimization

The optimization module uses the response surface to find the optimal design:

1. In the Design Exploration tab, click **Optimization**
2. Set the optimization type:
   - **Screening**: Evaluates all points on the response surface (good for 2-5 parameters)
   - **MOGA (Multi-Objective Genetic Algorithm)**: For multi-objective optimization (e.g., minimize mass AND minimize stress)
   - **NLPQL**: For single-objective optimization with constraints
3. Define the objective:
   - Example: Minimize **Total Mass**
4. Define constraints:
   - Example: **Maximum Equivalent Stress** < 250 MPa
   - Example: **Maximum Total Deformation** < 0.5 mm
5. Click **Update** to run the optimization
6. The optimizer returns candidate designs that meet the constraints and optimize the objective

### Evaluating Candidate Designs

The optimization returns 3 candidate designs. For each:

1. Note the input parameter values and predicted output values
2. Verify the predicted outputs by running a verification analysis:
   - Right-click the candidate → **Insert as Design Point**
   - Update the design point (this runs the actual solver, not the response surface)
   - Compare the verified results with the predicted results
3. If the verified results match the predictions within 5%, the response surface is accurate
4. If they don't match, add the verified design point to the DOE and regenerate the response surface

## Practical Example: Bracket Optimization

We recently optimized a steel bracket with the following parameters:

- **Input**: Wall thickness (3-8mm), fillet radius (2-6mm), hole diameter (5-12mm)
- **Output**: Maximum stress, total mass
- **Objective**: Minimize mass
- **Constraint**: Maximum stress < 200 MPa

The DOE (Central Composite Design) generated 15 design points. The sensitivity analysis showed that wall thickness had 70% influence on stress, fillet radius had 25%, and hole diameter had 5%. We fixed the hole diameter at 8mm and re-ran with 2 parameters.

The optimization found a design with 4.2mm wall thickness, 4.8mm fillet radius, and 127g mass — a 35% weight reduction from the original design (195g) while keeping stress below 200 MPa. Verification analysis confirmed the stress was 192 MPa, within 2% of the predicted 188 MPa.

## Tips for Efficient Parametric Studies

1. **Start with a coarse mesh**: Run the DOE with a coarse mesh to explore the design space quickly. Refine the mesh only for the final verification.
2. **Fix low-sensitivity parameters**: After the first DOE, fix parameters with < 5% sensitivity to reduce the number of design points.
3. **Use realistic ranges**: Don't set parameter ranges that produce unrealistic geometry (e.g., wall thickness larger than the bracket width).
4. **Check each design point for convergence**: A failed design point (non-convergence) creates a gap in the DOE that reduces response surface accuracy.
5. **Use Kriging for nonlinear responses**: If the standard response surface gives poor accuracy, switch to Kriging — it handles nonlinearities better.

## Summary

The parametric study workflow in Ansys Workbench — DOE → Response Surface → Optimization — is a powerful tool for design exploration. It lets you find optimal designs systematically rather than by trial and error. The key steps are: define meaningful input and output parameters, run a DOE to explore the design space, build a response surface, and use the optimizer to find the best design. Always verify the optimal design with a full solver run, not just the response surface prediction.
