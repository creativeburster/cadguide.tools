---
title: "LS-DYNA Blast and Ballistic Analysis: Explosive Loading, Penetration, and Impact Response"
excerpt: "A guide to blast and ballistic simulation in LS-DYNA covering explosive charge definition using JWL equation of state, blast wave propagation, projectile penetration with eroding contact, armor analysis, and structural response to explosive loading."
category: "workflow"
softwareSlug: "ls-dyna"
keyword: "ls-dyna blast ballistic analysis"
slug: "ls-dyna-blast-ballistic-analysis-explosive-loading-penetration-impact"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://lsdyna.ansys.com/manuals/"
  - "https://www.dynasupport.com/tutorial"
---

# LS-DYNA Blast and Ballistic Analysis: Explosive Loading, Penetration, and Impact Response

Blast and ballistic simulation is a specialized area, common in defense and protective-structures work. It's a whole different world from structural FEA — you're dealing with explosive equations of state, ALE fluid-structure coupling, and eroding contact for penetration. Let us walk you through how to set up these simulations.

## Explosive Modeling

### JWL Equation of State

1. *MAT_HIGH_EXPLOSIVE_BURN (MAT_008):
   - **RO**: Explosive density (kg/m³)
   - **D**: Detonation velocity (m/s)
   - **PCJ**: Chapman-Jouguet pressure (Pa)
2. *EOS_JWL (Jones-Wilkins-Lee):
   - **A**: JWL parameter (Pa)
   - **B**: JWL parameter (Pa)
   - **R1**: JWL parameter (dimensionless)
   - **R2**: JWL parameter (dimensionless)
   - **OMEGA**: JWL parameter (Grüneisen coefficient)
   - **E0**: Initial energy per unit volume (J/m³)

3. JWL equation:
   - P = A(1 - ω/(R1·V))e^(-R1·V) + B(1 - ω/(R2·V))e^(-R2·V) + ω·E/V
   - V: Relative volume (v/v0)

4. Common explosives:

| Explosive | ρ (kg/m³) | D (m/s) | PCJ (GPa) | A (GPa) | B (GPa) | R1 | R2 | ω |
|-----------|-----------|---------|-----------|---------|---------|-----|-----|-----|
| TNT | 1630 | 6930 | 21 | 371 | 3.23 | 4.15 | 0.95 | 0.30 |
| RDX | 1655 | 7575 | 26 | 524 | 7.68 | 4.30 | 1.10 | 0.34 |
| C-4 | 1601 | 8193 | 28 | 609 | 12.6 | 4.50 | 1.20 | 0.35 |
| PETN | 1700 | 8300 | 33 | 585 | 21.5 | 5.25 | 1.50 | 0.35 |

### Detonation Modeling

1. *INITIAL_DETONATION:
   - **X, Y, Z**: Detonation point coordinates
   - **TIME**: Detonation time (usually 0)
2. For multiple detonation points:
   - Multiple *INITIAL_DETONATION cards
   - Different detonation times for phased initiation
3. Spherical charge: Single detonation point at center
4. Cylindrical charge: Line of detonation points

### Air Modeling

1. *MAT_NULL (MAT_009):
   - **RO**: Air density (1.225 kg/m³)
2. *EOS_LINEAR_POLYNOMIAL:
   - **C0**: 0 (no initial pressure)
   - **C1**: 0 (no linear term)
   - **C2**: 0
   - **C3**: 0
   - **C4**: 0.4 (γ-1, where γ = 1.4 for air)
   - **C5**: 0.4
   - **C6**: 0
   - **E0**: 253 kPa (initial air energy)
3. Air mesh:
   - Eulerian or ALE formulation (allows material flow through mesh)
   - Element size: 5-20mm (fine enough to resolve blast wave)

### ALE (Arbitrary Lagrangian-Eulerian)

1. *SECTION_SOLID_ALE:
   - **ELFORM**: 12 (ALE single material)
   - Or 11 (ALE multi-material, for explosive + air)
2. *CONTROL_ALE:
   - **DCT**: 1 (ALE on)
   - **NADV**: 1 (advection per cycle)
   - **METH**: 2 (Van Leer advection, second-order)
3. ALE allows:
   - Explosive gas to expand through air mesh
   - Blast wave to propagate
   - No mesh distortion (Eulerian)
4. Coupling to Lagrangian structure:
   - *CONSTRAINED_LAGRANGE_IN_SOLID
   - Couples ALE fluid (explosive/air) to Lagrangian solid (structure)

## Blast Wave Propagation

### Blast Wave Characteristics

1. **Peak overpressure**: ΔPmax (above ambient)
   - Scaled distance: Z = R / W^(1/3)
   - R: Distance from charge (m)
   - W: Charge mass (kg TNT equivalent)
   - ΔPmax = f(Z) (from empirical curves, e.g., Kingery-Bulmash)
2. **Positive phase duration**: td (ms)
   - Duration of positive pressure
3. **Impulse**: We = ∫ΔP dt (Pa·s)
   - Area under pressure-time curve

### Scaled Distance

| Z (m/kg^(1/3)) | ΔPmax (kPa) | td (ms) | we (kPa·s) |
|----------------|------------|---------|-----------|
| 1.0 | 800 | 0.6 | 200 |
| 2.0 | 200 | 1.5 | 150 |
| 5.0 | 40 | 4.0 | 80 |
| 10.0 | 15 | 8.0 | 50 |
| 20.0 | 5 | 15.0 | 30 |

### Blast Loading on Structure

1. *LOAD_BLAST:
   - **MAT**: Explosive mass (kg TNT equivalent)
   - **XBO, YBO, ZBO**: Blast origin coordinates
   - **TBO**: Blast initiation time
2. LS-DYNA calculates:
   - Pressure on each surface facing the blast
   - Based on angle of incidence and scaled distance
   - Includes reflected pressure (for surfaces perpendicular to wave)
3. Simpler than ALE (no air mesh needed)
4. Use for: Far-field blast (structure not near charge)

## Projectile Penetration

### Projectile Setup

1. *PART: Projectile
2. Elements: *ELEMENT_SOLID (hex or tet)
3. Material: *MAT_JOHNSON_COOK (MAT_015)
   - **A**: Yield stress (e.g., 792 MPa for steel 4340)
   - **B**: Hardening (510 MPa)
   - **n**: 0.26
   - **C**: 0.014 (strain rate)
   - **m**: 1.03 (temperature)
4. *MAT_ADD_EROSION:
   - **EPSFAIL**: Failure strain (e.g., 1.5 for ductile steel)
   - Element deleted when strain exceeds limit

### Target Setup

1. *PART: Target (armor plate, concrete, composite)
2. Elements: *ELEMENT_SOLID
3. Material: Per target type:
   - **Steel armor**: *MAT_JOHNSON_COOK with erosion
   - **Concrete**: *MAT_CONCRETE_DAMAGE_REL3 (MAT_159) or *MAT_RHT
   - **Composite**: *MAT_COMPOSITE_DAMAGE (MAT_022) or *MAT_162

### Concrete Material (MAT_159)

1. *MAT_CONCRETE_DAMAGE_REL3:
   - **RO**: Density (2400 kg/m³)
   - **FPC**: Compressive strength (e.g., 40 MPa)
   - **FT**: Tensile strength (e.g., 4 MPa)
   - **GFC**: Fracture energy in compression
   - **GFT**: Fracture energy in tension
2. Features:
   - Strain rate effect (concrete is rate-dependent)
   - Damage (compression and tension)
   - Erosion (element deletion at failure)

### Eroding Contact

1. *CONTACT_ERODING_SURFACE_TO_SURFACE:
   - **SSID**: Projectile surface
   - **MSID**: Target surface
   - **FS, FD**: Friction (0.05 for steel-steel at high speed)
2. Erosion:
   - When target element fails (erosion criterion met)
   - Element is deleted
   - Contact updates to new surface (interior of target)
3. Allows projectile to penetrate through target

### Penetration Results

1. **Penetration depth**: How far projectile penetrates
   - Compare to empirical formulas (e.g., Forrestal, Li-Chen)
2. **Residual velocity**: Projectile velocity after exit (if perforation)
   - vres = vinitial - Δv (velocity loss from energy absorption)
3. **Target damage**:
   - **Crater**: Front face (spalling)
   - **Tunnel**: Penetration channel
   - **Back face**: Scabbing or perforation
4. **Energy balance**:
   - KE_projectile = IE_target + KE_projectile_residual + fracture energy

## Ballistic Limit

### V50 Calculation

1. **V50**: Velocity at which 50% of projectiles perforate the target
2. Run multiple simulations:
   - v = 500 m/s: Perforation → increase
   - v = 600 m/s: Perforation → increase
   - v = 700 m/s: Perforation → increase
   - v = 800 m/s: No perforation → decrease
   - v = 750 m/s: Perforation → V50 ≈ 775 m/s
3. Or use Lambert-Jonas equation:
   - vres = a × (vinitial^p - v50^p)^(1/p)
   - a, p: Empirical constants

### Armor Optimization

1. **Layered armor**: Steel + ceramic + composite
   - **Steel face**: Hard, shatters projectile
   - **Ceramic**: Hard, low density (boron carbide, silicon carbide)
   - **Composite backing**: Kevlar, UHMWPE (catches fragments)
2. **Oblique impact**: Angle increases effective thickness
   - Effective thickness = t / cos(θ)
   - θ: Impact angle from normal
3. **Perforation probability**: Lower with:
   - Thicker armor
   - Higher hardness (for steel)
   - Oblique angle
   - Ceramic layer (shatters projectile)

## Structural Blast Response

### Building Response to Blast

1. Structure: Steel frame, concrete walls, windows
2. Loading: *LOAD_BLAST (external charge)
3. Or ALE coupling (near-field, internal charge)
4. Results:
   - **Wall deformation**: Maximum displacement
   - **Column response**: Axial and bending
   - **Connection failure**: Bolt or weld failure
   - **Progressive collapse**: If critical column fails
5. Damage levels:
   - **Safe**: Elastic response (no damage)
   - **Moderate**: Plastic deformation (repairable)
   - **Severe**: Significant damage (not repairable)
   - **Collapse**: Structural failure

### Vehicle Response to IED

1. Vehicle model (military or civilian)
2. Charge: Under-vehicle IED
   - Mass: 5-50 kg TNT
   - Distance: 0.5-2m below vehicle
3. Loading: ALE (near-field) or *LOAD_BLAST (far-field)
4. Results:
   - **Floor deformation**: Upward displacement (hull deflection)
   - **Acceleration**: At seat and floor (occupant injury)
   - **Wheel/axle damage**: Detachment or deformation
   - **Energy absorption**: By vehicle structure
5. Design:
   - **V-shaped hull**: Deflects blast wave (reduces upward pressure)
   - **Energy-absorbing seat**: Reduces vertical acceleration on occupant
   - **Reinforced floor**: Thicker steel or composite armor

## Post-Processing

### Pressure Contour

1. LS-PrePost > Fcomp > Pressure
2. View blast wave propagation:
   - t=0.1ms: Initial expansion
   - t=0.5ms: Wave reaches structure
   - t=1.0ms: Wave reflects off structure
   - t=2.0ms: Wave diffracts around structure

### Damage Visualization

1. **Element deletion**: Failed elements removed from view
2. **Damage variable**: Color contour (0 = intact, 1 = failed)
3. **Crack pattern**: Path of element deletion (crack propagation)

### Energy Balance

1. *DATABASE_GLSTAT:
   - **KE**: Kinetic energy (projectile + fragments)
   - **IE**: Internal energy (deformation + damage)
   - **CE**: Contact energy (friction + sliding)
   - **HG**: Hourglass energy
2. Check:
   - KE_initial = IE + KE_residual + CE + HG
   - HG < 5% of IE

## Verification Checklist

- [ ] Explosive parameters (JWL) match the actual explosive
- [ ] Air mesh is fine enough to resolve blast wave (5-20mm)
- [ ] ALE coupling is correctly defined (fluid-structure)
- [ ] Detonation point is at correct location
- [ ] Projectile material includes strain rate and temperature effects
- [ ] Target material includes damage and erosion
- [ ] Eroding contact is used for penetration
- [ ] Element size is small enough to resolve penetration channel
- [ ] Blast pressure matches empirical data (scaled distance)
- [ ] Penetration depth matches empirical correlation
- [ ] Energy balance is satisfied
- [ ] Hourglass energy < 5% of internal energy

## Wrapping Up

Blast and ballistic simulation is one of those areas where you really need to validate against test data. The JWL parameters for your explosive need to match the actual explosive you're using — don't just grab TNT numbers and assume they work for RDX. For penetration, your mesh size in the impact zone matters enormously — We typically use 0.5-1mm elements for small caliber projectiles. And always check your energy balance. If energy isn't conserved, your results are wrong no matter how good the animation looks.
