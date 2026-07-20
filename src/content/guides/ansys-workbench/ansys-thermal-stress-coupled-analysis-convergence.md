---
title: "Ansys Thermal-Stress Coupled Analysis: Preventing Convergence and Accuracy Issues"
excerpt: "Coupled thermal-stress analysis in Ansys combines two nonlinearities — temperature-dependent material and thermal expansion. We cover the setup, common convergence traps, and verification techniques we use for thermal-stress problems."
category: "troubleshooting"
softwareSlug: "ansys-workbench"
keyword: "Ansys thermal stress coupled analysis convergence"
slug: "ansys-thermal-stress-coupled-analysis-convergence"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-19"
sources:
  - "https://forum.ansys.com/forums/topic/convergence-issues-with-material-model-changes/"
  - "https://forum.ansys.com/forums/topic/convergence-error/"
---

# Ansys Thermal-Stress Coupled Analysis: Preventing Convergence and Accuracy Issues

We work in the semiconductor packaging industry, where thermal-stress analysis is critical. A typical problem: a silicon die is bonded to a copper substrate with solder, and the assembly undergoes thermal cycling from -40°C to 125°C. The different coefficients of thermal expansion (CTE) between silicon (2.6 ppm/°C), copper (17 ppm/°C), and solder (23 ppm/°C) create enormous stresses during temperature changes. Getting this analysis to converge and give accurate results requires careful setup. We've spent years learning the traps, and we'll share them here.

## Types of Thermal-Stress Analysis in Ansys

Ansys offers three approaches to thermal-stress analysis:

### 1. Sequential (Uncoupled)

Run a thermal analysis first, then map the temperature field to a structural analysis as a body load.

- **When to use**: Temperature doesn't significantly affect mechanical properties, and deformation doesn't affect heat transfer
- **Setup**: Two analysis systems in Workbench — Steady-State Thermal linked to Static Structural
- **Link**: In the structural analysis, the temperature field is imported as an imported load

### 2. Fully Coupled

Solve thermal and structural equations simultaneously in a single analysis.

- **When to use**: Temperature affects mechanical properties (temperature-dependent Young's modulus, yield strength), or deformation affects heat transfer (contact gap changes)
- **Setup**: Single analysis system with coupled-field elements (SOLID226, SOLID227)
- **In Mechanical**: Analysis type = Static Structural with Thermal Condition

### 3. Weakly Coupled

Solve thermal and structural in alternating iterations within the same solver.

- **When to use**: Intermediate coupling — some temperature dependence but deformation doesn't significantly affect thermal behavior
- **Setup**: Available in Ansys Mechanical APDL, less common in Workbench

For most thermal-stress problems, the **sequential** approach is sufficient and more robust. We use the **fully coupled** approach only when material properties change significantly with temperature or when contact gaps change during thermal loading.

## Setting Up a Sequential Thermal-Stress Analysis

### Step 1: Thermal Analysis

1. Create a **Steady-State Thermal** system in Workbench
2. Apply thermal boundary conditions:
   - **Temperature**: Fixed temperature on specific faces
   - **Convection**: Heat transfer coefficient and ambient temperature
   - **Heat Flux**: Power input (for active components)
3. Set material thermal properties:
   - **Thermal Conductivity**: Can be temperature-dependent
   - **Specific Heat**: Only needed for transient analysis
4. Mesh the model — thermal analysis is more forgiving of mesh quality than structural
5. Solve and verify the temperature field

### Step 2: Link to Structural Analysis

1. Drag the **Solution** of the thermal analysis onto a new **Static Structural** system
2. This creates a link that imports the temperature field
3. In the structural analysis, the imported temperature appears under **Imported Loads**
4. Right-click the imported temperature → **Imported Load** → confirm it's active

### Step 3: Structural Analysis Setup

1. Apply structural boundary conditions (fixes, displacements)
2. Set material mechanical properties:
   - **Young's Modulus**: Can be temperature-dependent (enter as a table vs. temperature)
   - **Poisson's Ratio**: Usually constant
   - **Coefficient of Thermal Expansion (CTE)**: Can be temperature-dependent (secant or tangent)
   - **Yield Strength**: Can be temperature-dependent
3. Enable large deflection if deformations are significant
4. Solve

## Common Convergence Traps

### Trap 1: Temperature-Dependent Material Properties

When material properties change with temperature, the stiffness matrix changes during the analysis. This is a nonlinearity that can cause convergence failure.

**Fix**:
1. Define material properties as temperature-dependent tables
2. In Engineering Data, add a table for Young's Modulus vs. Temperature:
   - 20°C: 200 GPa
   - 100°C: 195 GPa
   - 200°C: 185 GPa
   - etc.
3. Use more substeps (100+ initial) to handle the property changes gradually
4. The solver needs small temperature increments to accurately track the property changes

### Trap 2: CTE Mismatch at Material Interfaces

When two materials with very different CTEs are bonded together, the thermal expansion creates large shear stresses at the interface. These stresses can exceed the bond strength, causing the analysis to predict failure.

**Fix**:
1. Use a fine mesh at the material interface — at least 3-5 elements through the thickness of the bond layer
2. If the bond layer (solder, adhesive) is very thin, model it with a single layer of thin elements
3. Use temperature-dependent CTE values — the CTE difference may decrease at high temperatures
4. If the bond layer yields (solder creeps at high temperature), use a plasticity model for the bond material

### Trap 3: Contact Gap Changes During Thermal Loading

Thermal expansion can close or open contact gaps. If a gap closes during the analysis, the contact state changes, which is a nonlinearity.

**Fix**:
1. Use Augmented Lagrangian contact algorithm
2. Set the pinball radius to 3x the element size — thermal expansion may move surfaces by several element sizes
3. Increase the number of substeps
4. Use **Update Stiffness: Each Iteration** for contact

### Trap 4: Creep at High Temperature

At elevated temperatures, materials (especially solder, lead, and polymers) exhibit creep — time-dependent deformation under constant stress. If you're running a transient thermal analysis, creep can cause convergence failure.

**Fix**:
1. Enable creep in the material model: **Engineering Data → Creep**
2. Select a creep model:
   - **Norton (Power Law)**: For steady-state creep
   - **Time Hardening**: For primary creep
   - **Strain Hardening**: For primary + secondary creep
3. Use small time steps — creep strain increments should be < 1% per step
4. Set **Creep Controls → Ratio** to 0.1 (limits creep strain per substep)

## Verifying Thermal-Stress Results

### Check 1: Temperature Field

Before looking at stresses, verify the temperature field is correct:

1. Compare the temperature distribution with hand calculations or known results
2. Check that the maximum and minimum temperatures match the applied boundary conditions
3. Verify temperature gradients are smooth — discontinuities indicate mesh or material property issues

### Check 2: Thermal Strain

Thermal strain should be: `ε_thermal = α × ΔT`

1. Insert a **Thermal Strain** result
2. Check the thermal strain at a point far from constraints
3. Compare with the hand calculation
4. If they don't match, the CTE or temperature field is wrong

### Check 3: Reaction Forces

At fixed boundaries, the reaction force should balance the thermal expansion force:

1. Insert a **Force Reaction** probe at the fixed support
2. The reaction force should be approximately: `F = E × α × ΔT × A` (for a constrained bar)
3. If the reaction force is zero, the thermal load isn't being applied correctly

### Check 4: Stress at Material Interfaces

1. Insert a stress result at the material interface
2. The stress should be highest at the interface (due to CTE mismatch)
3. If the stress is uniform, the CTE difference isn't being captured correctly — check that different materials are assigned to different bodies

## Practical Tips

### Use Symmetry

Thermal-stress models are often large and symmetric. Use symmetry to reduce model size:

1. If the geometry has a symmetry plane, cut the model in half
2. Apply a symmetry boundary condition on the cut face
3. This halves the number of elements and reduces solve time by 4-8x

### Use Shell Elements for Thin Layers

If the model contains thin layers (PCB traces, thin films, coatings), modeling them with solid elements creates elements with very high aspect ratios. Use shell elements instead:

1. In SpaceClaim, extract the mid-surface of the thin layer
2. In Mechanical, assign a shell body with the appropriate thickness
3. Shell elements handle thin layers much better than solid elements

### Use Submodeling for Critical Regions

For large models with critical stress regions (solder joints, wire bonds):

1. Run the full model with a coarse mesh
2. Identify the critical region
3. Create a submodel (a smaller model of just the critical region)
4. Import the displacement field from the full model as boundary conditions
5. Use a fine mesh on the submodel
6. This gives accurate stresses in the critical region without requiring a fine mesh on the entire model

## Summary

Thermal-stress analysis in Ansys requires careful attention to material properties, contact settings, and mesh quality. The most common convergence problems come from temperature-dependent material properties, CTE mismatch at interfaces, and contact gap changes. Start with the sequential approach (thermal → structural), use temperature-dependent material data, and verify results with hand calculations of thermal strain and reaction forces. For high-temperature applications, include creep in the material model and use small time steps. And always use submodeling to get accurate stresses in critical regions without making the full model impossibly large.
