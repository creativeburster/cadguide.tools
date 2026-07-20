---
title: "MSC Nastran Nonlinear Analysis: Contact, Material Nonlinearity, and Large Deformation"
excerpt: "Run nonlinear FEA in MSC Nastran SOL 400: define contact pairs, nonlinear material models, large deformation analysis, and convergence troubleshooting for plastic deformation and assembly simulation."
category: "workflow"
softwareSlug: "msc-nastran"
keyword: "msc nastran nonlinear analysis contact material large deformation"
slug: "msc-nastran-nonlinear-analysis-contact-material-large-deformation"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://simulatemore.mscsoftware.com/fundamentals-of-dynamic-analysis-msc-nastran/"
  - "https://www.cadence.com/en_US/home/tools/msc-software/msc-nastran.html"
---

# MSC Nastran Nonlinear Analysis: Contact, Material Nonlinearity, and Large Deformation

Nonlinear analysis in MSC Nastran (SOL 400) handles problems that linear analysis can't: contact between parts, plastic deformation, large displacements, and nonlinear materials. These analyses are more complex to set up and slower to run, but they're essential for realistic structural simulation.

## When to Use Nonlinear Analysis

Use SOL 400 when any of the following conditions apply:

- **Contact** — parts touch and separate during loading
- **Plastic deformation** — stresses exceed the yield point
- **Large deformation** — displacements are significant relative to the structure size
- **Nonlinear materials** — hyperelastic (rubber), creep, or temperature-dependent properties
- **Assembly simulation** — press-fit, bolt preload, gasket sealing
- **Post-buckling** — behavior beyond the buckling point

If none of these apply, use linear analysis (SOL 101) — it's faster and simpler.

## Contact Modeling

### Defining Contact Pairs

1. **Identify contact surfaces** — the surfaces that will touch
2. **Create contact pairs** using BCTABLE:
   - **Master surface** — typically the stiffer or coarser surface
   - **Slave surface** — typically the softer or finer surface
   - **Friction coefficient** — 0.0 (frictionless) to 0.6 (rough)
3. **Contact algorithm** — MSC Nastran uses the segment-to-segment method:
   - **Sliding** — small sliding contact (BSLIDE)
   - **Large sliding** — significant relative motion (BGADD)
4. **Contact parameters**:
   - **Penalty stiffness** — controls penetration; too high causes convergence issues, too low allows excessive penetration
   - **Penalty stiffness factor** — typically 0.1-1.0
   - **Friction model** — Coulomb friction with stick-slip

### Contact Setup Steps

1. Define **contact surfaces** (BCTABLE) on the elements
2. Define **contact pairs** (BGADD/BSLIDE) linking master and slave
3. Set **contact parameters** (BCTABLE) — friction, stiffness
4. Apply **contact output requests** — contact pressure, gap distance, sliding distance

### Common Contact Issues

**Excessive Penetration** — the slave surface penetrates the master surface too deeply.

**Fix:** Increase penalty stiffness, or refine the mesh on the slave surface.

**Convergence Problems at Contact Initiation** — the solver struggles when contact is first established.

**Fix:** Use a smaller time/load step near the point of contact initiation. Add a small initial contact pressure to avoid the sudden contact onset.

**Sticking/Slipping Oscillation** — nodes alternate between stick and slip, causing oscillation.

**Fix:** Reduce the friction coefficient slightly, or use a regularized friction model with a smooth transition.

## Material Nonlinearity

### Elastoplastic Materials

1. **Define the stress-strain curve** using MATS1:
   - **Yield point** — stress at which plastic deformation begins
   - **Hardening rule** — isotropic (symmetric), kinematic (Bauschinger effect), or combined
   - **Plastic stress-strain data** — tabular data of plastic stress vs. plastic strain
2. **Material model selection**:
   - **Bilinear** — elastic-perfectly-plastic or elastic-linear-hardening
   - **Multilinear** — piecewise linear stress-strain curve
   - **Johnson-Cook** — strain-rate and temperature dependent (for impact)

### Hyperelastic Materials

For rubber and elastomers:

1. **Material model** — Mooney-Rivlin, Ogden, Yeoh, or Arruda-Boyce
2. **Input data** — material constants from uniaxial, biaxial, or shear tests
3. **Element type** — use lower-order elements (CHEXA) with reduced integration to avoid volumetric locking

### Creep Analysis

For time-dependent deformation at elevated temperature:

1. **Creep model** — Bailey-Norton, time-hardening, or strain-hardening
2. **Creep parameters** — from creep test data at the operating temperature
3. **Time stepping** — use logarithmic time steps for long-duration creep

## Large Deformation

### When to Enable

Enable large deformation (geometric nonlinearity) when:
- Rotations exceed 10-15 degrees
- Strains exceed 5%
- Displacements are significant relative to the structure dimensions

### Setup

1. **Set PARAM, LGDISP, 1** — enables large displacement
2. **Update the stiffness matrix** — use the updated Lagrangian formulation
3. **Use appropriate elements** — elements that handle large rotation without spurious strains
4. **Load stepping** — apply load in increments to track the nonlinear path

### Large Strain vs. Large Rotation

- **Large rotation, small strain** — common for beams and shells; most elements handle this well
- **Large strain** — significant stretching/compression; requires elements with large-strain formulation
- **Check:** verify that the element type supports the level of nonlinearity you need

## Load Stepping and Convergence

### Incremental Loading

Nonlinear analysis applies load in increments:

1. **Define load steps** using NLPARM:
   - **Number of increments** — typically 10-100
   - **Time increment strategy** — fixed, adaptive, or arc-length
2. **Convergence criteria**:
   - **Force-based** — residual force < tolerance (typically 1% of max force)
   - **Displacement-based** — displacement correction < tolerance
   - **Work-based** — combination of force and displacement
3. **Maximum iterations per step** — typically 25-50

### Arc-Length Method

For post-buckling and snap-through problems:

1. The arc-length method controls both load and displacement
2. Allows the solution to follow the nonlinear path through limit points
3. Use **PARAM, ARCLNGTH, ON** or the NLPARM arc-length option
4. Useful for:
   - Buckling analysis beyond the critical load
   - Snap-through of shallow shells
   - Material instability

### Convergence Troubleshooting

**Divergence at a specific load step** — the structure reaches a point where the solver can't find equilibrium.

**Fix:**
- Reduce the load increment size
- Switch to arc-length method
- Check for physical instability (buckling, material failure)
- Add damping to stabilize the solution

**Slow Convergence** — many iterations per step.

**Fix:**
- Increase the load increment (fewer, larger steps)
- Use a stiffer convergence criterion
- Update the stiffness matrix less frequently (use modified Newton-Raphson)

**Non-convergence at Contact** — contact onset causes convergence failure.

**Fix:**
- Use smaller load steps near contact initiation
- Reduce penalty stiffness
- Use the augmented Lagrange method instead of penalty method

## Common Issues

### Results Don't Match Test Data

- Verify material properties match the actual material (not generic values)
- Check boundary conditions — fixed vs. pinned vs. spring-supported
- Ensure mesh is fine enough in high-stress areas
- Verify contact friction coefficient is realistic

### Analysis Runs but Results Are Unphysical

- Check for excessive penetration in contact
- Verify that large deformation is enabled if displacements are large
- Check for element distortion — highly distorted elements give bad results
- Verify load direction and magnitude

## Best Practices

- **Start with linear analysis** — verify the model works before going nonlinear
- **Use incremental loading** — don't apply full load in one step
- **Monitor convergence** — check the .log file for iteration counts and warnings
- **Refine mesh in contact areas** — coarse mesh gives poor contact pressure distribution
- **Use measured material data** — generic properties give generic results
- **Validate with simple cases** — test the contact and material models on a simple problem first
- **Use the right element type** — reduced integration for large strain, full integration for bending
