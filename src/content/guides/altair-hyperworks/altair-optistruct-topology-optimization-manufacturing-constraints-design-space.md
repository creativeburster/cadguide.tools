---
title: "Altair OptiStruct: Topology Optimization Setup, Manufacturing Constraints, and Results Interpretation"
excerpt: "How to set up topology optimization in Altair OptiStruct — covering design space definition, load and boundary condition setup, manufacturing constraints (draw direction, symmetry, member size), and interpreting optimization results for design guidance."
category: "workflow"
softwareSlug: "altair-hyperworks"
keyword: "altair optistruct topology optimization manufacturing constraints design space"
slug: "altair-optistruct-topology-optimization-manufacturing-constraints-design-space"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-07-09"
sources:
  - "https://2026.help.altair.com/2026/hwdesktop/hwx/topics/pre_processing/meshing/batchmesher_criteria_parameter_best_practices_r.htm"
  - "https://www.help.altair.com/2021/hwdesktop/hm/topics/pre_processing/meshing/solid_mesh_optimization_t.htm"
---

# Altair OptiStruct: Topology Optimization Setup, Manufacturing Constraints, and Results Interpretation

Topology optimization is where FEA meets design creativity. Instead of analyzing a given design, you tell the solver what the design needs to do, and it finds the optimal material distribution. OptiStruct is one of the best topology optimization solvers I've used. But the results are only as good as your setup — garbage in, garbage out. Here's my complete workflow.

## What Topology Optimization Does

Topology optimization determines the optimal material distribution within a design space to:
- **Minimize mass** while meeting performance targets
- **Maximize stiffness** (minimize compliance) for a given mass target
- **Maximize natural frequency** for a given mass target
- **Meet stress constraints** while minimizing mass

The result is a material layout that looks organic but is mathematically optimal.

## Step 1: Define the Design Space

The design space is the volume within which the optimizer can add or remove material:

1. In HyperMesh, create a **PSOLID** property for the design space.
2. Assign the design space property to the components that represent the designable volume.
3. Create a **non-design space** for components that must remain:
   - **Mounting interfaces**: Bolt holes, mounting pads
   - **Load application points**: Where forces are applied
   - **Boundary condition points**: Where constraints are applied
   - **Existing interfaces**: Connection points to other parts

### Design Space Best Practices

- **Maximize the design space** — give the optimizer freedom to find the best layout
- **Exclude non-designable regions** — bolt holes, mounting surfaces, load points
- **Keep the design space connected** — disconnected regions can't transfer loads
- **Use realistic boundaries** — don't extend the design space into areas where material can't exist

## Step 2: Set Up the FEA Model

Before optimization, set up a valid FEA analysis:

1. **Material**: Define the material (Young's modulus, Poisson's ratio, density)
2. **Properties**: Assign PSOLID (3D) or PSHELL (2D) properties
3. **Loads**: Apply the design loads:
   - **Forces**: At load application points
   - **Pressure**: On surfaces
   - **Thermal loads**: Temperature gradients
4. **Boundary conditions**: Apply constraints:
   - **Fixed supports**: At mounting points
   - **Symmetry**: If using a symmetric model
   - **Contact**: If the part contacts other components
5. **Load cases**: Define all relevant load cases:
   - **Operating loads**: Normal operating conditions
   - **Extreme loads**: Worst-case loading
   - **Multiple load cases**: OptiStruct can optimize for multiple load cases simultaneously

### FEA Model Quality

- **Mesh quality**: The mesh must be good enough for accurate stress analysis
- **Element size**: Fine enough to capture the optimization features (typically 2-5mm for automotive parts)
- **Element type**: Tetra (first-order) is common for topology optimization
- **Mesh density in design space**: Uniform mesh density gives better optimization results

## Step 3: Define the Optimization Problem

1. Go to **Optimization** → **Topology**.
2. Define the **objective**:
   - **Minimize compliance** (maximize stiffness) — most common
   - **Minimize mass** — for weight-critical designs
   - **Maximize frequency** — for vibration-critical designs
3. Define the **design variable**:
   - **Property**: Select the PSOLID property of the design space
   - **Volume fraction**: The target material fraction (e.g., 0.3 = use 30% of the design space)
4. Define **constraints**:
   - **Volume fraction**: If the objective is compliance, constrain the volume fraction
   - **Displacement**: Limit displacement at specific nodes
   - **Stress**: Limit stress in the design space
   - **Frequency**: Limit the first natural frequency

### Common Optimization Setups

**Stiffness-to-weight ratio (most common)**:
- **Objective**: Minimize compliance
- **Constraint**: Volume fraction ≤ 0.3
- **Result**: Stiffest possible design using 30% of the design space

**Weight minimization**:
- **Objective**: Minimize volume (mass)
- **Constraint**: Compliance ≤ specified value
- **Result**: Lightest design that meets the stiffness target

**Frequency maximization**:
- **Objective**: Maximize first natural frequency
- **Constraint**: Volume fraction ≤ 0.3
- **Result**: Design with the highest possible first natural frequency

## Step 4: Add Manufacturing Constraints

Without manufacturing constraints, topology optimization produces organic shapes that can't be manufactured. Manufacturing constraints ensure the result is feasible:

### Draw Direction Constraint

Ensures the part can be removed from a mold (casting) or die:

1. Go to **Optimization** → **Manufacturing** → **Draw Direction**.
2. Select the draw direction:
   - **Single die**: One draw direction (e.g., Z-axis)
   - **Split die**: Two draw directions (e.g., +Z and -Z)
   - **Obstacle**: Define a region the draw direction must avoid
3. The optimizer ensures no material creates undercuts in the draw direction.

### Extrusion Constraint

Ensures the part has a constant cross-section (for extruded profiles):

1. Go to **Optimization** → **Manufacturing** → **Extrusion**.
2. Define the extrusion direction.
3. The optimizer creates a constant cross-section along the extrusion direction.

### Symmetry Constraint

Ensures the optimized design is symmetric:

1. Go to **Optimization** → **Manufacturing** → **Symmetry**.
2. Select the symmetry type:
   - **1-plane**: Mirror about one plane
   - **2-plane**: Mirror about two planes
   - **3-plane**: Mirror about three planes (octant symmetry)
   - **Cyclic**: Rotational symmetry (e.g., 6-fold for a 60° segment)
3. Select the symmetry plane(s) or axis.
4. The optimizer creates a symmetric material distribution.

### Member Size Constraint

Controls the minimum and maximum member size in the optimized design:

1. Go to **Optimization** → **Manufacturing** → **Member Size**.
2. Set:
   - **Minimum member size**: No feature smaller than this (prevents thin slivers)
   - **Maximum member size**: No feature larger than this (prevents solid chunks)
3. Typical values:
   - **Minimum**: 2-3x the element size
   - **Maximum**: 5-10x the element size

### Pattern Repetition

For designs with repeated features (e.g., wheel spokes, blade rows):

1. Go to **Optimization** → **Manufacturing** → **Pattern Repetition**.
2. Define the master and slave regions.
3. The optimizer creates identical features in each region.

## Step 5: Run the Optimization

1. Go to **Analysis** → **OptiStruct**.
2. Set the number of iterations:
   - **Default**: 30-50 iterations (sufficient for most problems)
   - **Complex problems**: 50-100 iterations
3. Click **Run**.
4. OptiStruct iteratively removes and redistributes material:
   - Each iteration adjusts the material density (0 to 1) in each element
   - Elements with density near 0 are removed
   - Elements with density near 1 are retained
   - Elements with intermediate density (0.3-0.7) are in transition zones
5. The optimization converges when the objective stops changing significantly.

### Convergence Check

- **Objective change**: Should be < 1% between last iterations
- **Constraint violation**: Should be < 1%
- **Density distribution**: Should be mostly 0 or 1 (few intermediate values)

## Step 6: Interpret the Results

1. Load the optimization results in HyperView.
2. Display the **element density** contour:
   - **Density = 1**: Material retained (solid)
   - **Density = 0**: Material removed (void)
   - **Density 0.3-0.7**: Transition zone (needs interpretation)
3. Set the **density threshold**:
   - **0.3**: Shows the full material layout (including transition zones)
   - **0.5**: Shows the core structure (recommended for design interpretation)
   - **0.7**: Shows only the most critical material (conservative)

### Reading the Optimized Design

- **Solid regions (density > 0.7)**: These are the primary load paths — must be retained
- **Transition regions (0.3-0.7)**: These are secondary — may be retained or simplified
- **Void regions (< 0.3)**: These can be removed — no structural function

### Design Interpretation

The optimized topology is not a final design — it's a design guide:

1. **Identify the primary load paths** — the solid regions show where material is needed
2. **Simplify the organic shape** — smooth the contours for manufacturing
3. **Add manufacturing features** — fillets, draft angles, machining allowances
4. **Create a CAD model** — reconstruct the optimized shape in CAD
5. **Verify with FEA** — analyze the reconstructed design to confirm performance

## Step 7: Export and Reconstruct

### Export the Optimized Geometry

1. In HyperView, set the density threshold to 0.3-0.5.
2. Export the remaining elements as:
   - **STL**: For 3D printing or visual reference
   - **STEP/IGES**: For CAD reconstruction (requires surface fitting)
   - **OSSmooth**: Altair's tool for smoothing topology optimization results

### Using OSSmooth

1. Launch OSSmooth from HyperMesh.
2. Input the optimization result file (.sh file).
3. Set the density threshold (0.3-0.5).
4. Configure smoothing:
   - **Smooth level**: Low (preserves features) to High (smoother surface)
   - **Feature preservation**: Preserve sharp edges and boundaries
5. Generate the smoothed geometry.
6. Export as STEP or IGES for CAD reconstruction.

### CAD Reconstruction

1. Import the smoothed geometry into CAD (SolidWorks, CATIA, etc.).
2. Create parametric features based on the optimized topology:
   - **Extrusions**: For main structural members
   - **Lofts**: For transition regions
   - **Fillets**: Add manufacturing fillets
3. Add non-design features:
   - **Bolt holes**: At mounting interfaces
   - **Machining allowances**: At mating surfaces
   - **Draft angles**: For cast parts
4. Verify the reconstructed design with FEA.

## Best Practices

- **Maximize the design space** — give the optimizer freedom to find the best layout
- **Use manufacturing constraints** — without them, results can't be manufactured
- **Set appropriate member size** — prevents thin slivers and solid chunks
- **Use multiple load cases** — optimize for all relevant loading conditions
- **Set the density threshold at 0.3-0.5** — shows the core structure
- **Don't use the optimized topology directly** — reconstruct in CAD with manufacturing features
- **Verify the reconstructed design** — run FEA on the final CAD model
- **Iterate if needed** — if the reconstructed design doesn't meet targets, re-optimize with adjusted constraints
- **Document the optimization setup** — record objective, constraints, and manufacturing constraints
- **Start simple and add complexity** — run a basic optimization first, then add manufacturing constraints
