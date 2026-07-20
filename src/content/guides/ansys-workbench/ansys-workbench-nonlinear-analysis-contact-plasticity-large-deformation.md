---
title: "ANSYS Workbench Nonlinear Analysis: Contact, Plasticity, and Large Deformation Setup"
excerpt: "ANSYS Workbench's nonlinear analysis handles contact nonlinearity, material plasticity, and large deformation. We cover nonlinear setup, contact types, plastic material models, Newton-Raphson convergence, and troubleshooting common nonlinear convergence issues."
category: "workflow"
softwareSlug: "ansys-workbench"
keyword: "ANSYS Workbench nonlinear analysis contact plasticity large deformation Newton-Raphson convergence troubleshooting setup"
slug: "ansys-workbench-nonlinear-analysis-contact-plasticity-large-deformation"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-29"
sources:
  - "https://ansyshelp.ansys.com/account/secured?returnurl=/Views/Secured/corp/v242/en/wb_wb/wb_wb.html"
  - "https://ansyshelp.ansys.com/public/Views/Secured/corp/v252/en/wb_sim/ds_static_mechanical_analysis_type.html"

---

# ANSYS Workbench Nonlinear Analysis: Contact, Plasticity, and Large Deformation Setup

We've run complex nonlinear analyses in ANSYS for metal forming, rubber seals, bolted joints, and crashworthiness. Nonlinear analysis is where ANSYS separates from basic FEA tools — it handles geometric nonlinearity (large deformation), material nonlinearity (plasticity, hyperelasticity), and contact nonlinearity (changing contact status). Understanding nonlinear setup and convergence control is essential for getting accurate results when linear assumptions don't apply.

## What Makes an Analysis Nonlinear?

An analysis is nonlinear when the relationship between load and displacement is not proportional. Three sources of nonlinearity:

1. **Geometric nonlinearity**: Large deformation changes the geometry significantly — stiffness changes as the part deforms
2. **Material nonlinearity**: Stress-strain relationship is not linear — plasticity, creep, hyperelasticity
3. **Contact nonlinearity**: Contact status changes during loading — surfaces come into or out of contact

### When to Use Nonlinear Analysis

- **Large deformation**: Displacement > 1/20 of the characteristic dimension
- **Plastic deformation**: Stress exceeds yield strength
- **Contact changes**: Surfaces that separate or come together during loading
- **Rubber or polymer components**: Hyperelastic material behavior
- **Buckling and post-buckling**: Load path changes after instability
- **Metal forming**: Large plastic deformation
- **Bolted joints**: Preload and contact changes

## Enabling Nonlinear Analysis

### Turning On Large Deflection

1. Click **Analysis Settings** in the tree
2. Set **Large Deflection** to **On**
3. This activates geometric nonlinearity (updated Lagrangian formulation)
4. The solver updates the geometry at each substep
5. Essential for:
   - Large displacement (> 5% of dimension)
   - Large rotation
   - Snap-through buckling
   - Membrane stiffening (thin structures)

### Auto Time Stepping

1. In **Analysis Settings**, set:
   - **Auto Time Stepping**: On
   - **Number of Steps**: 1 (or more for multi-step)
   - **Step End Time**: 1.0 (normalized)
   - **Initial Substeps**: 10
   - **Minimum Substeps**: 1
   - **Maximum Substeps**: 100
2. The solver automatically adjusts substep size based on convergence
3. If convergence is easy, substeps increase (faster)
4. If convergence is difficult, substeps decrease (slower but more stable)

## Contact Nonlinearity

### Contact Types

**Bonded**:
- No separation, no sliding
- Linear contact (no nonlinearity)
- Use for: Welded joints, glued parts, fully constrained interfaces

**No Separation**:
- No separation, but sliding allowed
- Linear frictionless sliding
- Use for: Parts that stay in contact but can slide

**Frictionless**:
- Can separate and slide freely
- No friction
- Nonlinear (contact status changes)
- Use for: Simple contact without friction

**Rough**:
- Can separate but no sliding (infinite friction)
- Nonlinear
- Use for: High-friction contact

**Frictional**:
- Can separate, sliding with friction coefficient
- Nonlinear (most realistic)
- Use for: Most real-world contact (bolts, bearings, supports)

**Asymmetric**:
- One-sided contact (one body is target, other is contact)
- Nonlinear
- Use for: Specific contact scenarios

### Contact Setup

1. In the **Connections** branch, contacts are auto-detected
2. Right-click a contact → **Edit**
3. Set:
   - **Contact type**: Bonded, Frictionless, Frictional, etc.
   - **Friction coefficient**: For frictional contact (e.g., 0.2 for steel-on-steel)
   - **Behavior**: Symmetric or Asymmetric
   - **Detection method**: Nodal, Gauss point, or Nodal-Projection
   - **Pinball region**: Radius within which contact is detected
4. For difficult contact:
   - Increase the pinball region
   - Use symmetric behavior
   - Use nodal-projection detection (more accurate)

### Contact Troubleshooting

- **Contact not detected**: Increase pinball region
- **Contact oscillation**: Use stabilization (contact stabilization damping)
- **Penetration**: Use normal stiffness factor (increase to 1.0 or higher)
- **Sliding issues**: Use updated stiffness

## Material Plasticity

### Bilinear Isotropic Hardening

1. In Engineering Data, add a material model:
   - **Bilinear Isotropic Hardening**
   - **Yield strength**: e.g., 250 MPa
   - **Tangent modulus**: e.g., 1000 MPa (slope after yield)
2. The material behaves linearly until yield, then linearly with the tangent modulus
3. Simple but adequate for many applications

### Multilinear Isotropic Hardening

1. Add **Multilinear Isotropic Hardening**
2. Enter stress-strain data points:
   - (0, 0)
   - (0.00125, 250) — yield point
   - (0.00375, 350)
   - (0.0075, 450)
   - (0.015, 550)
3. The material follows the specified stress-strain curve
4. More accurate than bilinear for real material behavior

### Multilinear Kinematic Hardening

1. Add **Multilinear Kinematic Hardening**
2. Enter stress-strain data (same as isotropic)
3. Kinematic hardening accounts for the Bauschinger effect:
   - After yielding in tension, the compressive yield strength decreases
   - Important for cyclic loading
4. Use for: Cyclic loading, low-cycle fatigue, reverse loading

### Chaboche Combined Hardening

1. Add **Chaboche Combined Hardening**
2. Combines isotropic and kinematic hardening
3. Parameters:
   - **Yield strength**: Initial yield
   - **Isotropic parameters**: C1, C2, C3 (hardening constants)
   - **Kinematic parameters**: C1, γ1, C2, γ2, etc.
4. Most accurate for cyclic plasticity
5. Use for: High-cycle fatigue, ratcheting, complex cyclic loading

### Hyperelasticity (Rubber)

1. Add a hyperelastic model:
   - **Mooney-Rivlin**: 2-parameter or 9-parameter
   - **Ogden**: N-parameter model
   - **Yeoh**: 3-parameter
   - **Arruda-Boyce**: 8-parameter
2. Enter material parameters from test data:
   - **Uniaxial test data**: Stress-strain in tension
   - **Biaxial test data**: Stress-strain in biaxial tension
   - **Shear test data**: Stress-strain in shear
3. Use for: Rubber seals, elastomer components, gaskets, tires

## Newton-Raphson Convergence

### How Nonlinear Solving Works

1. The load is applied in increments (substeps)
2. At each substep, the solver iterates:
   - **Predictor**: Estimate the displacement based on current stiffness
   - **Residual**: Calculate the force imbalance (applied - internal)
   - **Corrector**: Adjust the displacement to reduce the residual
   - **Convergence check**: Is the residual within tolerance?
3. If converged: Move to the next substep
4. If not converged: Iterate again (up to maximum iterations)
5. If maximum iterations reached without convergence: Substep is bisected (reduced)

### Convergence Controls

1. In **Analysis Settings**:
   - **Force convergence**: Default tolerance 0.5%
   - **Displacement convergence**: Optional
   - **Moment convergence**: Optional
2. If convergence is difficult:
   - **Reduce initial substeps**: Smaller load increments
   - **Increase maximum substeps**: Allow more increments
   - **Relax convergence tolerance**: Increase to 1% (less strict)
   - **Add stabilization**: Energy dissipation to stabilize unstable behavior

### Stabilization

For unstable behavior (snap-through, snap-back, buckling):

1. In **Analysis Settings** → **Controls**
2. Set **Stabilization**:
   - **Off**: No stabilization
   - **Constant**: Constant damping throughout
   - **Reduced**: Damping that reduces over time
   - **Adaptive**: Automatically adjusted damping
3. Stabilization adds artificial damping to prevent divergence
4. Check that stabilization energy is < 5% of strain energy (artificial damping shouldn't dominate)

## Troubleshooting Nonlinear Convergence

### Analysis Diverges Immediately

- Check boundary conditions (insufficient constraints)
- Verify contact setup (initial gap too large)
- Check material model (invalid parameters)
- Try starting with a linear analysis (turn off large deflection)
- Apply loads gradually (more substeps)

### Analysis Converges Then Diverges

- Check for contact status changes (sudden separation)
- Look for material instability (negative tangent modulus)
- Check for buckling (geometric instability)
- Add stabilization
- Reduce substep size

### Analysis Is Very Slow

- Reduce the number of contact pairs
- Use symmetric contact behavior (faster than asymmetric)
- Coarsen the mesh in non-critical areas
- Use iterative solver instead of direct
- Reduce the number of substeps (if convergence allows)

### Contact Not Detected

- Increase the pinball region
- Check that the contact and target surfaces are correct
- Verify the initial gap distance
- Use auto-offset to close initial gaps
- Check contact detection method

### Excessive Penetration

- Increase normal stiffness (normal stiffness factor = 1.0 or higher)
- Use nodal-projection detection method
- Refine the mesh at the contact interface
- Reduce substep size (slower contact transition)
- Use symmetric contact behavior

### Material Doesn't Yield

- Check yield strength value (is it in the correct units?)
- Verify the stress-strain curve data
- Check that the material model is assigned to the correct body
- Ensure large deflection is on (if needed for the material model)
- Check if the load is large enough to cause yielding

## Post-Processing Nonlinear Results

### Plastic Strain

1. Right-click **Solution** → **Insert** → **Strain** → **Equivalent Plastic**
2. Plastic strain shows permanent deformation:
   - **0**: No plastic deformation (elastic only)
   - **> 0**: Plastic deformation has occurred
3. Check plastic strain distribution:
   - Where has yielding occurred?
   - How much plastic strain?
   - Is it acceptable for the application?

### Stress in Plastic Region

1. Check **Equivalent Stress** (Von Mises)
2. If stress > yield strength, the material has yielded
3. The stress-strain relationship is now on the plastic curve
4. Check if the stress is within the ultimate strength

### Contact Status

1. Right-click the contact → **Insert** → **Contact Tool**
2. Check:
   - **Status**: Sticking, sliding, near-field, far-field
   - **Pressure**: Contact pressure distribution
   - **Gap**: Gap distance between surfaces
   - **Frictional stress**: Shear stress at the interface

### Reaction Forces

1. Right-click **Solution** → **Insert** → **Probe** → **Force Reaction**
2. Select a constraint (fixed support, displacement)
3. The reaction force at that constraint is displayed
4. Verify that reaction forces balance the applied loads

## Summary

ANSYS Workbench's nonlinear analysis handles geometric, material, and contact nonlinearity for realistic engineering simulation. Enable large deflection for geometric nonlinearity. Set up contact types (bonded, frictionless, frictional) with appropriate pinball region and stiffness. Define plastic material models (bilinear, multilinear, Chaboche) based on the material behavior. Use auto time stepping with sufficient substeps for convergence. Control Newton-Raphson convergence with force tolerance and stabilization for unstable behavior. Troubleshoot convergence issues by checking constraints, contact setup, material parameters, and substep size. Post-process with plastic strain (permanent deformation), contact status (sticking/sliding), and reaction forces. The most common issues — divergence, slow convergence, contact problems, and excessive penetration — are addressed by reducing substep size, increasing pinball region, adjusting normal stiffness, and adding stabilization. Nonlinear analysis is essential for any application where linear assumptions don't hold.
