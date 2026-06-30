---
title: "Abaqus Nonlinear FEA: Plasticity, Large Deformation, and Solver Convergence"
excerpt: "A guide to nonlinear finite element analysis in Abaqus/Standard covering material plasticity, geometric nonlinearity, Newton-Raphson iteration, convergence control, stabilization, and troubleshooting common nonlinear analysis issues."
category: "workflow"
softwareSlug: "abaqus"
keyword: "abaqus nonlinear fea"
slug: "abaqus-nonlinear-fea-plasticity-large-deformation-convergence"
author: "CADGuide Technical Editorial"
readTime: "13 min read"
date: "2026-06-30"
sources:
  - "https://www.3ds.com/products/simulia/abaqus"
  - "https://help.3ds.com/2024/English/DSSIMULIA_Established/SIMACAEGENRefMap/simacaegen-c-doc.htm"
---

# Abaqus Nonlinear FEA: Plasticity, Large Deformation, and Solver Convergence

Nonlinear FEA is essential when materials yield, deformations are large, or contact changes during loading. Abaqus/Standard is one of the most robust implicit nonlinear solvers. This guide covers the complete nonlinear analysis workflow.

## Nonlinearity Sources

### Material Nonlinearity
- **Plasticity**: Permanent deformation after yield
- **Creep**: Time-dependent deformation under constant load
- **Hyperelasticity**: Large elastic deformation (rubber)
- **Viscoelasticity**: Rate-dependent elastic behavior

### Geometric Nonlinearity
- **Large deformation**: Shape changes significantly affect stiffness
- **Large rotation**: Elements rotate significantly
- **Buckling**: Sudden change in deformation mode
- **Contact changes**: New contacts form or existing contacts separate

### Boundary Nonlinearity
- **Contact**: Stiffness changes as bodies contact/separate
- **Follower forces**: Load direction changes with deformation

## Setting Up Nonlinear Analysis

### Step Definition

1. Module: Step
2. Create Step > Static, General (NLGEOM)
3. Set:
   - **Nlgeom**: ON (enables large deformation)
   - **Time period**: 1.0 (pseudo-time for static)
   - **Incrementation**:
     - **Initial**: 0.01 (start small)
     - **Minimum**: 1×10⁻⁵ (cutback limit)
     - **Maximum**: 0.1 (largest allowed increment)
   - **Max increments**: 100-1000

### Material Plasticity

1. Module: Property
2. Create Material:
   - **Elastic**: Young's modulus (E) and Poisson's ratio (ν)
   - **Plastic**: Yield stress vs. plastic strain table

#### Plasticity Data (True Stress - True Strain)

| Plastic Strain | Yield Stress (MPa) |
|----------------|-------------------|
| 0.000 | 250 |
| 0.005 | 280 |
| 0.010 | 310 |
| 0.020 | 350 |
| 0.050 | 420 |
| 0.100 | 480 |
| 0.200 | 530 |
| 0.500 | 600 |

**Important**: Abaqus requires true stress and true strain (not engineering). Convert:
- **True stress**: σtrue = σeng × (1 + εeng)
- **True strain**: εtrue = ln(1 + εeng)

### Hardening Models

1. **Isotropic hardening**: Yield surface expands uniformly
   - Use for monotonic loading
   - Simple, stable
2. **Kinematic hardening**: Yield surface translates
   - Use for cyclic loading
   - Bauschinger effect (yield in compression after tension)
3. **Combined hardening**: Both expand and translate
   - Use for complex cyclic loading
   - Most realistic for low-cycle fatigue

### Hyperelasticity (Rubber)

1. Create Material > Mechanical > Hyperelastic
2. Select model:
   - **Mooney-Rivlin**: 2-parameter (N=1), good for moderate strain
   - **Ogden**: N=3, best for large strain (up to 700%)
   - **Yeoh**: 3-parameter, good for filled rubber
   - **Arruda-Boyce**: Good for polymers
3. Input test data or coefficients:
   - Uniaxial test data
   - Biaxial test data
   - Planar (shear) test data
4. Evaluate > Test Data:
   - Abaqus fits the model to test data
   - Check stability (no instability in strain range)

## Solver Convergence

### Newton-Raphson Method

Abaqus/Standard uses Newton-Raphson iteration:
1. Apply load increment (Δλ × Ftotal)
2. Assemble tangent stiffness matrix (Kt)
3. Solve: Kt × Δu = Δλ × Ftotal - Finternal
4. Update displacement: u = u + Δu
5. Check convergence:
   - Force residual: ‖Fresidual‖ < ‖Fref‖ × RTOL
   - Displacement correction: ‖Δu‖ < ‖u‖ × DTOL
6. If converged: proceed to next increment
7. If not converged: iterate again
8. If too many iterations: cutback (reduce increment size)

### Convergence Controls

1. Step > Incrementation:
   - **I0**: Initial increments (10-20 for smooth, 5 for difficult)
   - **IR**: Minimum increments (cutback limit)
   - **Max increments**: Total allowed
2. Step > Other > Solver Controls:
   - **Equation solver**: Direct (default) or Iterative
   - **Residual control**: RTOL = 5×10⁻³ (default)
   - **Displacement control**: DTOL = 5×10⁻³ (default)

### Automatic Stabilization

1. For unstable problems (buckling, snap-through):
   - Step > Other > Automatic Stabilization
   - **Damping factor**: 2×10⁻⁴ (typical)
   - **Continue damping**: Yes (for post-unstable)
2. Damping adds viscous force: Fdamping = c × velocity
3. Prevents sudden instability but adds artificial energy
4. Check: Artificial energy should be < 5% of strain energy

### Arc-Length (Riks) Method

1. For post-buckling analysis:
   - Step > Static, Riks
2. Set:
   - **Proportional load**: Load that scales with arc-length
   - **Initial arc-length**: 0.1 (typical)
   - **Minimum arc-length**: 1×10⁻⁵
3. Riks method follows the equilibrium path through limit points
4. Use for: Buckling, snap-through, snap-back

## Contact in Nonlinear Analysis

### General Contact

1. Module: Interaction
2. Create Interaction > Surface-to-Surface Contact (Standard)
3. Or use General Contact:
   - Interaction > General Contact
   - Automatically detects all contact pairs
4. Set:
   - **Contact formulation**: 
     - **Penalty**: Default, robust
     - **Augmented Lagrange**: More accurate, slightly slower
     - **Direct (Lagrange)**: Exact, but can oscillate
   - **Friction**: Coulomb μ (0.1 for steel-steel, 0.3 for rubber-steel)
   - **Normal behavior**: Hard (default) or soft (pressure-overclosure)

### Contact Properties

1. Interaction Property > Contact:
   - **Normal behavior**:
     - Hard contact: No penetration, no tension
     - Soft contact: Pressure-overclosure relationship
     - Exponential: For soft contact
   - **Tangential behavior**:
     - Penalty: μ (friction coefficient)
     - Static-Kinematic Exponential Decay: μs → μk
     - Rough: No slip (bonded after contact)
   - **Damping**: Contact damping for stabilization

### Contact Troubleshooting

1. **Chattering**: Contact opens and closes repeatedly
   - Fix: Add contact damping, use penalty formulation, refine mesh
2. **Penetration**: Slave nodes penetrate master surface
   - Fix: Increase penalty stiffness, use augmented Lagrange
3. **No convergence in contact**: Too many contact changes per increment
   - Fix: Reduce increment size, add stabilization, refine mesh at contact

## Output and Post-Processing

### Field Output

1. Field Output Requests:
   - **Stresses**: S (stress components), SINV (von Mises, principal)
   - **Strains**: E (total), PE (plastic), EE (elastic)
   - **Displacement**: U
   - **Contact**: CPRESS, CSHEAR, COPEN, CSLIP
2. Save at:
   - **Every increment**: For detailed history
   - **Last increment only**: For final state (saves space)

### History Output

1. History Output Requests:
   - **Reaction force**: RF at constrained nodes
   - **Displacement**: U at specific nodes
   - **Energy**: ALLKE, ALLIE, ALLPD, ALLVD, ALLWK
   - **Contact**: CPRESS at specific contact nodes
2. History output is per-step, not per-element (lighter on storage)

### Energy Balance Check

1. For nonlinear analysis, verify energy balance:
   - **External work (ALLWK)** ≈ Internal energy (ALLIE) + Plastic dissipation (ALLPD) + Viscous dissipation (ALLVD)
2. If artificial energy (ALLVD) > 5% of ALLIE:
   - Stabilization is too high
   - Reduce damping factor
   - Results may be inaccurate

## Convergence Troubleshooting

### Common Convergence Issues

#### Issue: Too Many Cutbacks

**Symptom**: Increment size keeps reducing, analysis takes very long.
**Fix**:
1. Check contact (chattering, penetration)
2. Add automatic stabilization (damping)
3. Reduce initial increment size
4. Refine mesh in high-strain regions
5. Use mass scaling (for quasi-static)

#### Issue: No Convergence at Specific Load

**Symptom**: Analysis converges until a certain load, then fails.
**Fix**:
1. Check for material instability (negative tangent modulus)
2. Check for buckling (use Riks method)
3. Check for contact separation (add stabilization)
4. Check for excessive element distortion (remesh)

#### Issue: Excessive Element Distortion

**Symptom**: Elements become too distorted, solver fails.
**Fix**:
1. Refine mesh in high-deformation regions
2. Use reduced integration elements (C3D8R instead of C3D8)
3. Enable adaptive remeshing (Abaqus/Explicit)
4. Use ALE (Arbitrary Lagrangian-Eulerian) for large deformation

## Element Selection for Nonlinear Analysis

| Element | Type | Use |
|---------|------|-----|
| C3D8R | Hex, reduced integration | General 3D (default for nonlinear) |
| C3D8 | Hex, full integration | When hourglass is problematic |
| C3D8H | Hex, hybrid | Rubber, incompressible materials |
| C3D20R | Hex, quadratic, reduced | High accuracy (stress concentration) |
| C3D10M | Tet, modified | Complex geometry, good for contact |
| S4R | Shell, reduced | Thin walls, sheet metal |
| B31 | Beam, linear | Frame structures |

**Hourglass control**: C3D8R elements can exhibit hourglass modes (zero-energy deformation). Check artificial hourglass energy < 5% of internal energy.

## Verification Checklist

- [ ] Nlgeom is ON for large deformation
- [ ] Material plasticity uses true stress-strain data
- [ ] Hardening model matches loading type (monotonic vs. cyclic)
- [ ] Contact formulation is appropriate (penalty for general, augmented for accuracy)
- [ ] Initial increment is small (0.01-0.05)
- [ ] Automatic stabilization is used for unstable problems
- [ ] Artificial energy < 5% of internal energy
- [ ] Hourglass energy < 5% of internal energy (reduced integration)
- [ | Reaction forces balance applied loads
- [ ] No excessive element distortion
- [ ] Energy balance is satisfied

## Conclusion

Abaqus/Standard provides one of the most robust nonlinear FEA solvers available. The key to successful nonlinear analysis is understanding the sources of nonlinearity (material, geometric, contact), setting appropriate incrementation controls (small initial increments, reasonable cutback limits), using stabilization for unstable problems (automatic damping, Riks method), and carefully monitoring convergence (force residual, displacement correction, energy balance). By following this workflow and troubleshooting guide, engineers can tackle complex nonlinear problems — from plasticity and large deformation to post-buckling and contact — with confidence in the results.
