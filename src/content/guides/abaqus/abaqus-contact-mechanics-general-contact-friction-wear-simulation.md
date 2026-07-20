---
title: "Abaqus Contact Mechanics: General Contact, Friction, and Wear Simulation"
excerpt: "A guide to contact modeling in Abaqus covering general contact formulation, surface-to-surface and node-to-surface discretization, friction models, contact pressure-overclosure relationships, wear simulation with UMESHMOTION, and troubleshooting contact convergence."
category: "workflow"
softwareSlug: "abaqus"
keyword: "abaqus contact mechanics"
slug: "abaqus-contact-mechanics-general-contact-friction-wear-simulation"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.3ds.com/products/simulia/abaqus"
  - "https://help.3ds.com/2024/English/DSSIMULIA_Established/SIMACAEGENRefMap/simacaegen-c-doc.htm"
---

# Abaqus Contact Mechanics: General Contact, Friction, and Wear Simulation

Contact modeling in FEA is honestly a pain. We've spent more time debugging contact convergence issues than we care to admit. But Abaqus makes it easier than most — its general contact feature automatically detects contact pairs, which saves you from manually defining every possible interaction in a complex assembly. Let us walk you through how we set up contact, choose friction models, and deal with the common issues that drive people crazy.

## Contact Formulations

### General Contact (Abaqus/Standard)

1. Module: Interaction > Create > General Contact (Standard)
2. General contact:
   - Automatically detects all possible contact pairs
   - No need to manually define each pair
   - Uses default contact domain (all external surfaces)
3. Included domain:
   - **All with self**: All surfaces can contact themselves (self-contact)
   - **All with all**: All surfaces can contact all other surfaces
   - **Selected**: Specify which surface pairs to include/exclude
4. Advantages:
   - Simplifies setup for complex assemblies
   - Handles self-contact (e.g., folding, wrinkling)
   - Automatically handles contact changes during analysis

### Surface-to-Surface Contact

1. Module: Interaction > Create > Surface-to-Surface Contact (Standard)
2. Define:
   - **Master surface**: Stiffer or coarser mesh surface
   - **Slave surface**: Softer or finer mesh surface
3. Discretization:
   - **Node-to-Surface**: Slave nodes constrained to master surface (faster, less accurate)
   - **Surface-to-Surface**: Both surfaces considered (slower, more accurate, better stress)
4. When to use surface-to-surface instead of general:
   - Specific pair needs special properties
   - Need precise contact pressure at specific location
   - Need different friction for different pairs

### Contact Formulation

1. **Penalty method** (default):
   - Contact constraint enforced via penalty stiffness
   - Allows small penetration
   - kp = default (auto-calculated based on material stiffness)
   - Can scale: kp = 1.0 (default), 0.1 (softer), 10.0 (stiffer)
2. **Augmented Lagrange**:
   - Iteratively improves penalty enforcement
   - Reduces penetration to near zero
   - More iterations, more accurate
3. **Direct (Lagrange multiplier)**:
   - Exact contact constraint (no penetration)
   - Adds DOF to system
   - Can cause convergence issues (chattering)

## Friction Models

### Coulomb Friction

1. Interaction Property > Contact > Tangential Behavior > Penalty
2. Set friction coefficient (μ):

| Material Pair | μ (dry) | μ (lubricated) |
|---------------|---------|----------------|
| Steel-Steel | 0.15-0.30 | 0.05-0.10 |
| Steel-Aluminum | 0.20-0.35 | 0.08-0.12 |
| Steel-Brass | 0.20-0.35 | 0.10-0.15 |
| Rubber-Steel | 0.30-0.60 | 0.10-0.20 |
| Aluminum-Aluminum | 0.25-0.40 | 0.08-0.12 |
| Concrete-Steel | 0.40-0.60 | - |

3. Shear stress limit:
   - τmax = μ × p (Coulomb)
   - But: τ ≤ τlimit (shear stress limit, e.g., σy/√3)
   - Prevents unrealistic shear at high pressure

### Static-Kinematic Exponential Decay

1. For materials with different static and kinetic friction:
   - **μs**: Static friction (higher, at zero slip rate)
   - **μk**: Kinetic friction (lower, at high slip rate)
   - **Decay coefficient**: d (rate of transition)
2. μ = μk + (μs - μk) × exp(-d × γslip)
3. Use for: Brake pads, clutch plates, tire-road contact

### Rough (No Slip)

1. Tangential Behavior > Rough
2. Once contact is established, no sliding allowed
3. Equivalent to μ = ∞
4. Use for: Bolted joints (preloaded), bonded interfaces

## Normal Behavior

### Hard Contact

1. Normal Behavior > Hard Contact
2. Properties:
   - No penetration (p > 0 only when gap = 0)
   - No tension (p = 0 when gap > 0)
   - Pressure transfers only in compression
3. Default for most metal-to-metal contact

### Soft Contact

1. Normal Behavior > Soft Contact
2. Pressure-overclosure relationship:
   - **Linear**: p = k × (gap - gap0) for gap < gap0
   - **Exponential**: p = p0 × exp(-k × gap)
   - **Tabular**: Custom pressure vs. overclosure table
3. Use for:
   - Rubber seals (soft contact)
   - Foam materials (compressible)
   - Gaskets (nonlinear stiffness)

### Pressure-Overclosure Table

| Overclosure (mm) | Pressure (MPa) |
|------------------|----------------|
| 0.000 | 0 |
| 0.001 | 5 |
| 0.005 | 20 |
| 0.010 | 50 |
| 0.020 | 100 |

## Contact Damping

1. Interaction Property > Contact > Damping
2. Set:
   - **Normal damping**: cn (prevents chattering)
   - **Tangential damping**: ct (prevents stick-slip oscillation)
3. Typical values:
   - cn = 0.01-1.0 (fraction of critical damping)
   - ct = 0.001-0.1
4. Damping force: Fd = c × vrel (relative velocity)
5. Use when:
   - Contact chattering occurs
   - Stick-slip oscillation
   - Contact separation instability

## Wear Simulation (UMESHMOTION)

### Setting Up Wear Analysis

1. Wear model: Archard wear law
   - Vwear = k × F × s / H
   - V: Wear volume (mm³)
   - k: Wear coefficient (dimensionless)
   - F: Normal force (N)
   - s: Sliding distance (mm)
   - H: Material hardness (MPa)

2. Implement in Abaqus:
   - Write UMESHMOTION subroutine (Fortran)
   - Calculate wear depth per increment
   - Update surface geometry (mesh motion)

3. UMESHMOTION subroutine:
   ```fortran
   SUBROUTINE UMESHMOTION(UREF,ULUMPS,COORDS,NDOF,LNODE,NNODES,
   1 JGTYPE,TIME,DTIME,UMAT,AMESH,NDIM,JSTEP,JCYCLE)
   C
   C Calculate wear depth based on contact pressure and slip
   C
   DIMENSION UREF(NDOF),ULUMPS(NNODES,NDOF),COORDS(NNODES,NDIM)
   C
   C Get contact pressure (CPRESS) and slip (CSLIP)
   C Calculate wear depth: dwear = k * p * ds / H
   C Apply to UREF(1) (normal direction)
   C
   RETURN
   END
   ```

4. Analysis setup:
   - Step > Static, General (NLGEOM ON)
   - Multiple steps: Each step = one wear cycle
   - Adaptive mesh domain: Select contact surface
   - UMESHMOTION: Specify subroutine

5. Results:
   - **Wear depth**: Contour on contact surface
   - **Geometry evolution**: Surface shape changes over cycles
   - **Pressure redistribution**: As surface wears, pressure redistributes

## Contact Output

### Field Output

1. Contact variables:
   - **CPRESS**: Contact pressure (MPa)
   - **CSHEAR**: Shear stress at contact (MPa)
   - **COPEN**: Contact opening (gap, mm)
   - **CSLIP**: Total slip distance (mm)
   - **CSTATUS**: Contact status (0=open, 1=closed)
2. View:
   - Contour on contact surface
   - Check for high pressure (may cause yielding)
   - Check for open gaps (may indicate separation)

### History Output

1. Contact force:
   - **CNAREA**: Contact area
   - **CFN**: Normal contact force
   - **CFS**: Shear contact force
2. At specific contact nodes:
   - Track pressure over time
   - Track slip over time

## Contact Troubleshooting

### Chattering (Rapid Open-Close)

**Symptom**: Contact status alternates between open and closed every increment. Solver struggles to converge.
**Fix**:
1. Add contact damping (cn = 0.1)
2. Use penalty instead of Lagrange formulation
3. Refine mesh at contact (smaller elements = smoother contact)
4. Reduce increment size

### Excessive Penetration

**Symptom**: Slave nodes penetrate master surface significantly.
**Fix**:
1. Increase penalty stiffness (kp scale factor = 10)
2. Use augmented Lagrange formulation
3. Refine slave mesh (finer mesh = less penetration)
4. Check master/slave assignment (master should be stiffer)

### No Contact Detected

**Symptom**: Bodies should be in contact but COPEN shows gap.
**Fix**:
1. Check initial geometry (are surfaces actually touching?)
2. Adjust contact domain (ensure both surfaces are included)
3. Use contact stabilization (auto-stabilize initial contact)
4. Check normal directions (surface normals should point toward each other)

### Stick-Slip Oscillation

**Symptom**: Contact alternates between stick and slip, causing noise in results.
**Fix**:
1. Add tangential damping (ct = 0.01)
2. Use smooth friction transition (static-kinetic decay)
3. Refine mesh at contact
4. Use implicit dynamic step (instead of static)

## Best Practices

1. **Mesh quality at contact**: Refine both surfaces, similar element sizes
2. **Master/slave selection**: Master = stiffer, coarser; Slave = softer, finer
3. **Initial contact**: Ensure surfaces are initially touching or very close
4. **Contact stabilization**: Use for initial contact establishment
5. **Friction**: Start with Coulomb, refine if needed
6. **Penalty stiffness**: Use default, increase if penetration is excessive
7. **Output**: Always check CPRESS, COPEN, and CSTATUS
8. **Verification**: Check that contact forces balance applied loads

## Wrapping Up

Contact is one of those things where experience really matters. We've found that starting with general contact and penalty formulation solves 80% of problems. The other 20% — chattering, penetration, stick-slip — those need contact damping, refined meshes, or a different formulation. Always check CPRESS and COPEN in your results. If you see nodes penetrating the master surface, bump up the penalty stiffness. If contact keeps opening and closing, add some damping. And if you're doing wear simulation with UMESHMOTION, test it on a simple model first — it's powerful but tricky to get right.
