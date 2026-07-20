---
title: "Altair HyperView: FEA Post-Processing, Stress Contours, and Result Interpretation"
excerpt: "How to post-process FEA results in Altair HyperView — covering stress and displacement contours, result transformations, coordinate systems, fatigue life visualization, envelope results, and creating professional reports for engineering review."
category: "workflow"
softwareSlug: "altair-hyperworks"
keyword: "altair hyperview fea post-processing stress contour result interpretation report"
slug: "altair-hyperview-fea-post-processing-stress-contour-result-interpretation"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-09"
sources:
  - "https://2026.help.altair.com/2026/hwdesktop/hwx/topics/pre_processing/meshing/batchmesher_criteria_parameter_best_practices_r.htm"
  - "https://www.help.altair.com/2021/hwdesktop/hm/topics/pre_processing/meshing/solid_mesh_optimization_t.htm"
---

# Altair HyperView: FEA Post-Processing, Stress Contours, and Result Interpretation

Running the solver is half the job. Interpreting the results is the other half — and it's the half that matters to the design team. I've seen engineers present stress contours without understanding what they mean. "The red area is bad" isn't analysis. You need to know why it's red, whether it's real, and what to do about it. Here's my guide to FEA post-processing in HyperView.

## What HyperView Does

HyperView is Altair's post-processing tool for FEA results:
- **Contour plots**: Stress, strain, displacement, temperature
- **Vector plots**: Force, moment, velocity vectors
- **Deformed shape**: Show the deformed geometry
- **Animations**: Animate the deformation over time or load steps
- **Cross-sections**: Cut through the model to see internal results
- **Query**: Probe values at specific nodes or elements
- **Reports**: Create images and reports for documentation

## Step 1: Load Results

1. Open HyperView.
2. Click **Load Model**.
3. Select the result file:
   - **OptiStruct**: .h3d, .op2, .out
   - **ANSYS**: .rst
   - **Abaqus**: .odb
   - **Nastran**: .op2, .f06
   - **LS-DYNA**: .d3plot
4. HyperView loads the model and results.
5. Select the **result type** (stress, displacement, strain, etc.).
6. Select the **load case** or **time step**.

## Step 2: Display Displacement Contours

Displacement is the first result to check — it tells you if the model is behaving correctly:

1. Go to **Contour** → **Result Type** → **Displacement**.
2. Select the component:
   - **Mag**: Total displacement magnitude
   - **X, Y, Z**: Individual direction components
3. Set the display:
   - **Scale factor**: Exaggerate the deformation for visibility (e.g., 10x, 100x)
   - **Deformed shape**: Toggle between undeformed, deformed, or both
4. Check:
   - **Maximum displacement**: Is it reasonable for the applied loads?
   - **Displacement direction**: Does the model deflect in the expected direction?
   - **Boundary conditions**: Are the constraints working? (zero displacement at supports)
   - **Symmetry**: If using symmetry, does the displacement respect the symmetry plane?

### Displacement Sanity Checks

- **Zero displacement at supports**: If supports show non-zero displacement, the constraints are wrong
- **Reasonable magnitude**: A steel bracket shouldn't deflect 100mm under a 100N load
- **Correct direction**: A vertical load should cause vertical deflection, not lateral
- **No rigid body motion**: The model shouldn't translate or rotate as a whole

## Step 3: Display Stress Contours

Stress is the primary result for design evaluation:

1. Go to **Contour** → **Result Type** → **Stress**.
2. Select the stress type:
   - **von Mises**: Combined stress — most common for ductile materials
   - **Principal (1, 2, 3)**: Maximum, middle, and minimum principal stresses
   - **Component (X, Y, Z, XY, YZ, ZX)**: Individual stress components
   - **Max Shear**: Maximum shear stress — for Tresca criterion
3. Set the contour options:
   - **Average**: Element results averaged at nodes (smoother contours)
   - **None**: Element results not averaged (shows element-to-element variation)
   - **Min/Max**: Show the minimum and maximum values

### von Mises Stress

von Mises stress is used for ductile materials (steel, aluminum, copper):
- **Yield criterion**: σ_vm ≤ σ_yield
- **If σ_vm > σ_yield**: Material yields — redesign needed
- **Safety factor**: σ_yield / σ_vm

### Principal Stresses

Principal stresses show the maximum and minimum normal stresses:
- **σ1 (maximum principal)**: Highest tensile stress — check against tensile strength
- **σ3 (minimum principal)**: Highest compressive stress — check against compressive strength
- **σ1 > 0 and σ3 < 0**: Mixed tension/compression — common in bending

### Stress Averaging

- **Averaged**: Smoother contours, but hides element-to-element variation
- **Non-averaged**: Shows discontinuities between elements — useful for checking mesh quality
- **Recommendation**: Use averaged for presentation, non-averaged for checking

## Step 4: Check Stress Concentrations

Stress concentrations occur at geometric discontinuities:

1. Identify high-stress regions:
   - **Holes and notches**: Stress concentration factor Kt = 2-3
   - **Sharp corners**: Very high Kt — add fillets
   - **Cross-section changes**: Abrupt changes create stress concentrations
   - **Contact regions**: High stress at contact interfaces
2. Evaluate the stress:
   - **Compare with material yield**: Is the stress above yield?
   - **Check the safety factor**: σ_yield / σ_max
   - **Consider fatigue**: Stress concentrations are fatigue initiation sites
3. Determine if the stress is real or a numerical artifact:
   - **Real**: Geometric feature causes the concentration
   - **Numerical**: Poor mesh quality creates artificial stress
   - **Check**: Refine the mesh at the concentration — if stress increases, it's real; if it stabilizes, it's converged

### Stress Concentration Fixes

- **Add fillets**: Replace sharp corners with fillets
- **Increase wall thickness**: Thicken the high-stress region
- **Add reinforcement**: Ribs, gussets, or additional material
- **Change geometry**: Modify the feature to reduce the concentration
- **Use better material**: Higher strength material

## Step 5: Check Reaction Forces

Reaction forces verify that the loads are applied correctly:

1. Go to **Query** → **Reactions**.
2. Select the support nodes.
3. HyperView displays:
   - **Fx, Fy, Fz**: Reaction forces at each support
   - **Mx, My, Mz**: Reaction moments at each support
4. Check:
   - **Force balance**: Sum of reactions = sum of applied loads
   - **Direction**: Reactions should oppose the applied loads
   - **Magnitude**: Reasonable for the applied loads

### Reaction Force Sanity Check

If the applied load is 1000N downward and the reactions sum to 500N, something is wrong:
- **Missing constraints**: The model isn't fully constrained
- **Wrong load application**: Load applied in the wrong direction
- **Solver error**: Unlikely but possible

## Step 6: Create Cross-Sections

Cross-sections show internal stress distribution:

1. Go to **View** → **Section Cut**.
2. Define the cutting plane:
   - **Normal direction**: X, Y, or Z plane
   - **Position**: Location of the cut
3. HyperView shows the stress on the cut plane.
4. Use cross-sections to:
   - **Check internal stress**: Verify stress through the thickness
   - **Identify hidden hotspots**: High stress inside the model
   - **Verify bending stress**: Check tension/compression distribution

## Step 7: Animate Results

Animation helps visualize deformation and stress distribution:

### Static Analysis Animation

1. Go to **Animate** → **Linear**.
2. Set the number of frames (typically 10-20).
3. The animation cycles between undeformed and deformed shapes.
4. Use for:
   - **Presentations**: Shows how the part deforms
   - **Verification**: Confirm the deformation pattern is correct
   - **Communication**: Non-technical stakeholders understand animation better than static plots

### Transient Analysis Animation

1. Go to **Animate** → **Time**.
2. The animation plays through time steps.
3. Use for:
   - **Dynamic events**: Crash, drop test, vibration
   - **Time history**: See how stress evolves over time
   - **Wave propagation**: Stress wave travel through the model

## Step 8: Create Reports

Professional reports communicate results to the design team:

1. Go to **File** → **Report** → **Report Template**.
2. Create a report with:
   - **Model image**: Undeformed model with boundary conditions
   - **Displacement contour**: Maximum displacement with scale factor
   - **Stress contour**: von Mises stress with maximum value highlighted
   - **Reaction forces**: Summary table
   - **Safety factor**: Minimum safety factor and location
3. Add annotations:
   - **Title**: Analysis name and description
   - **Load case**: Applied loads and boundary conditions
   - **Material**: Material properties
   - **Mesh**: Element count and type
   - **Notes**: Key findings and recommendations
4. Export as:
   - **PowerPoint**: For presentations
   - **PDF**: For documentation
   - **HTML**: For web sharing

### Report Best Practices

- **Show the undeformed model first** — gives context
- **Use consistent color scales** — same scale across all stress plots
- **Highlight maximum values** — mark the location of maximum stress
- **Include the safety factor** — most important number for the design team
- **Add engineering recommendations** — don't just show results, interpret them

## Step 9: Interpret Results for Design

### Pass/Fail Criteria

1. **Stress**: σ_vm ≤ σ_yield / SF (safety factor, typically 1.5-2.0)
2. **Displacement**: δ ≤ δ_allowable (specified by design requirements)
3. **Buckling**: Load factor > 1.5 (for compressive loads)
4. **Fatigue life**: N > N_required (for cyclic loading)

### Common Result Issues

**Stress singularity at a point load**:
- Point loads create theoretically infinite stress
- In FEA, stress is finite but very high at the load node
- **Fix**: Distribute the load over a small area, or ignore the stress at the load node

**Stress singularity at a sharp corner**:
- Sharp re-entrant corners create stress singularities
- Stress increases as mesh is refined (never converges)
- **Fix**: Add a fillet — even a small fillet (0.5mm) eliminates the singularity

**High stress at contact interface**:
- Contact creates high local stress
- May be real (contact pressure) or numerical (penalty method)
- **Fix**: Check contact stiffness — too high creates artificial stress

**Displacement at supports is non-zero**:
- Indicates incomplete constraints
- **Fix**: Check boundary conditions — add missing constraints

## Best Practices

- **Check displacement first** — verifies the model is behaving correctly
- **Use von Mises for ductile materials** — most common failure criterion
- **Check reaction forces** — verifies load balance
- **Use non-averaged stress to check mesh quality** — discontinuities reveal bad mesh
- **Refine mesh at stress concentrations** — verify convergence
- **Create professional reports** — communicate results clearly
- **Interpret, don't just present** — explain what the results mean for the design
- **Compare with hand calculations** — verify FEA results with simple calculations
- **Document assumptions** — record mesh size, material, boundary conditions
- **Review with the design team** — FEA results inform design decisions
