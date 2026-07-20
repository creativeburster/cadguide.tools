---
title: "Abaqus/Explicit Dynamic Analysis: Crash, Drop Test, and High-Speed Impact Simulation"
excerpt: "A guide to Abaqus/Explicit for dynamic analysis covering explicit time integration, mass scaling, element formulation, contact in explicit, crash and drop test setup, and energy balance verification for high-speed events."
category: "workflow"
softwareSlug: "abaqus"
keyword: "abaqus explicit dynamic analysis"
slug: "abaqus-explicit-dynamic-analysis-crash-drop-test-impact"
author: "CADGuide Tools Editorial Team"
readTime: "13 min read"
date: "2026-06-30"
sources:
  - "https://www.3ds.com/products/simulia/abaqus"
  - "https://help.3ds.com/2024/English/DSSIMULIA_Established/SIMACAEGENRefMap/simacaegen-c-doc.htm"
---

# Abaqus/Explicit Dynamic Analysis: Crash, Drop Test, and High-Speed Impact Simulation

The first time I ran an Abaqus/Explicit simulation, I was blown away by how different it felt from Standard. No convergence errors, no Newton-Raphson iterations failing — it just runs. That's the beauty of explicit time integration. But it comes with its own challenges: tiny time steps, mass scaling, and energy balance checks. Let me walk you through how I set up explicit dynamics simulations for crash, drop tests, and impact.

## Explicit vs. Implicit

| | Abaqus/Explicit | Abaqus/Standard |
|---|---|---|
| **Time integration** | Central difference (explicit) | Newton-Raphson (implicit) |
| **Stability** | Conditionally stable (CFL limit) | Unconditionally stable |
| **Time step** | Very small (μs) | Large (any size) |
| **Iterations** | No iterations needed | Newton-Raphson iterations |
| **Convergence** | Always (no convergence issues) | May fail to converge |
| **Best for** | High-speed, complex contact, failure | Static, slow, smooth |
| **Cost** | Proportional to number of increments | Proportional to number of iterations |

## Explicit Time Integration

### Central Difference Method

1. At time t:
   - a(t) = M⁻¹ × [Fext(t) - Fint(t)]
   - v(t + Δt/2) = v(t - Δt/2) + a(t) × Δt
   - u(t + Δt) = u(t) + v(t + Δt/2) × Δt
2. No tangent stiffness matrix needed
3. No iterations required
4. Mass matrix is lumped (diagonal) → fast inversion

### Stability Condition (CFL)

1. Stable time step:
   - Δt ≤ Δtcrit = 2 / ωmax
   - ωmax: Highest natural frequency in the mesh
2. Approximation:
   - Δtcrit ≈ Le / c
   - Le: Characteristic element length
   - c: Wave speed = √(E/ρ) (elastic) or √(E/ρ) (with stiffness)
3. Example: Steel (E = 200 GPa, ρ = 7850 kg/m³)
   - c = √(200×10⁹/7850) = 5048 m/s
   - Le = 1mm: Δtcrit = 0.001/5048 = 1.98×10⁻⁷ s ≈ 0.2 μs
4. For 1 second of simulation: ~5 million increments

### Reducing Computation Time

1. **Mass scaling**: Increase mass of small elements → larger Δt
   - Target time step: e.g., 1×10⁻⁷ s
   - Mass scaling adds mass to small elements to achieve target
   - Check: Mass increase should be < 5% of total mass
   - Only for quasi-static problems (not dynamic)

2. **Time scaling**: Speed up the event
   - Real event: 100 ms → Simulated: 10 ms (10× faster)
   - Check: Kinetic energy < 5% of internal energy (quasi-static)
   - Not suitable for rate-dependent materials

3. **Selective mass scaling**: Only scale problematic elements
   - More efficient than global mass scaling
   - Preserves inertia for most of the model

## Element Selection for Explicit

| Element | Type | Use |
|---------|------|-----|
| S4R | Shell, reduced | Auto body, sheet metal (default) |
| S3 | Shell, triangular | Fill elements in complex geometry |
| C3D8R | Hex, reduced | General 3D (with hourglass control) |
| C3D6 | Wedge | Transition geometry |
| C3D4 | Tet | Complex geometry (lower accuracy) |
| T3D2 | Truss | Rebar, cables |
| B31 | Beam | Frame structures |

### Hourglass Control

1. C3D8R and S4R use reduced integration → hourglass modes
2. Hourglass = zero-energy deformation (artificial, non-physical)
3. Control methods:
   - **Default**: Relax stiffness (sufficient for most)
   - **Enhanced**: More stiffness (for severe deformation)
   - **Stiffness**: Pure stiffness (most accurate, slightly slower)
4. Check: Artificial hourglass energy < 5% of internal energy

## Material Models for Dynamic

### Johnson-Cook (Metals)

1. Property > Material > Plasticity > Johnson-Cook
2. Parameters:
   - **A**: Yield stress (MPa) at reference strain rate and temperature
   - **B**: Hardening coefficient (MPa)
   - **n**: Hardening exponent
   - **C**: Strain rate coefficient
   - **m**: Temperature exponent
3. Flow stress: σ = (A + B × εp^n) × (1 + C × ln(ε̇*)) × (1 - T*^m)
4. Example (steel):
   - A = 350, B = 275, n = 0.36, C = 0.014, m = 1.03

### Material Failure

1. Property > Material > Damage > Ductile Damage
2. Set:
   - **Initiation**: Strain at failure vs. stress triaxiality and strain rate
   - **Evolution**: Damage evolution (linear or exponential)
   - **Element deletion**: Remove failed elements
3. Johnson-Cook damage:
   - εf = (D1 + D2 × exp(D3 × σ*)) × (1 + D4 × ln(ε̇*)) × (1 + D5 × T*)
4. Use for: Crash, impact, penetration

### Equation of State (Extreme Pressure)

1. For blast and hypervelocity impact:
   - Property > Material > Equation of State
   - **Mie-Grüneisen**: For metals under high pressure
   - **JWL**: For explosives
   - **Polynomial**: For general materials

## Contact in Explicit

### General Contact (Explicit)

1. Interaction > General Contact (Explicit)
2. Automatically includes all surfaces
3. Formulation:
   - **Penalty**: Default, robust
   - **Kinematic**: More accurate for contact pressure, but can lock
4. Contact domain:
   - **All with self**: All surfaces (default)
   - **All with all**: All surface pairs
5. Scale penalty stiffness:
   - Default: 1.0
   - Increase: 5-10 for stiffer contact (less penetration)
   - Decrease: 0.1 for softer contact (more stable)

### Contact in Crash

1. Self-contact is critical:
   - Parts fold and contact themselves
   - General contact handles this automatically
2. Edge-to-edge and edge-to-surface contact:
   - General contact includes all edge contacts
3. Friction:
   - μ = 0.1-0.2 (metal-to-metal in crash)
   - μ = 0.3-0.5 (rubber-to-metal)

## Drop Test Setup

### Setup

1. Step > Dynamic, Explicit
2. Set:
   - **Time period**: Duration of event (e.g., 0.01 seconds = 10 ms)
   - **Nlgeom**: ON
3. Initial conditions:
   - Predefined Field > Velocity
   - Assign to dropped object: v = -5 m/s (downward)
4. Boundary conditions:
   - Floor: Encastre (fixed)
   - Dropped object: Free (no constraints)
5. Contact:
   - General Contact (Explicit)
   - Include floor and dropped object surfaces
6. Gravity:
   - Body Force > Gravity: 9.81 m/s² in -Y

### Drop Test Results

1. Check:
   - **Peak acceleration**: At center of mass (G-level for electronics)
   - **Peak stress**: In critical components
   - **Plastic strain**: Permanent deformation
   - **Energy balance**: KE → IE + friction + hourglass
2. Typical phone drop test:
   - Drop height: 1.0m
   - Impact velocity: 4.43 m/s
   - Duration: ~5 ms
   - Peak acceleration: 500-2000G

## Crash Analysis Setup

### Vehicle Crash

1. Geometry:
   - Vehicle body (shell elements, S4R)
   - Barrier (rigid or deformable)
2. Materials:
   - Body: Steel or aluminum with Johnson-Cook
   - Failure: Ductile damage with element deletion
3. Spot welds:
   - Connector > Beam connector
   - Failure criterion: Force-based (e.g., 5000 N)
4. Initial velocity:
   - v = 13.4 m/s (30 mph, frontal crash)
   - v = 8.9 m/s (20 mph, side crash)
5. Duration: 100-150 ms
6. Output:
   - **Acceleration**: At B-pillar, seat cross-member
   - **Intrusion**: Door, firewall, steering column
   - **Energy absorption**: By component

### Crash Results Evaluation

1. **Acceleration pulse**: Should meet regulatory limits
   - FMVSS 208: Chest acceleration < 60G
   - Chest deflection: < 63mm
2. **Intrusion**:
   - Firewall: < 125mm (frontal)
   - Door: < 381mm (side)
3. **Energy balance**:
   - Initial KE = Final IE + Crush energy + Hourglass + Friction
   - Hourglass < 5% of IE
   - Mass scaling energy < 5% of IE

## Energy Balance Verification

### Energy Components

1. **ALLKE**: Kinetic energy
2. **ALLIE**: Internal energy (strain + plastic)
3. **ALLPD**: Plastic dissipation
4. **ALLVD**: Viscous dissipation (damping)
5. **ALLAE**: Artificial energy (hourglass)
6. **ALLWK**: External work
7. **ALLMW**: Mass scaling work (from mass scaling)

### Checks

1. **Energy conservation**: ALLWK ≈ ALLKE + ALLIE + ALLVD
2. **Hourglass**: ALLAE < 5% × ALLIE
3. **Mass scaling**: ALLMW < 5% × ALLIE
4. **Quasi-static**: ALLKE < 5% × ALLIE (for forming, slow events)
5. **Dynamic**: ALLKE is significant (for crash, impact)

## Mass Scaling

### Setting Up Mass Scaling

1. Step > Mass Scaling
2. Set:
   - **Target time increment**: 1×10⁻⁷ s (typical)
   - **Type**: 
     - **Below**: Scale elements below target dt (most common)
     - **All**: Scale all elements
   - **Frequency**: Every N increments (or initial only)
3. Check mass increase:
   - View mass scaling output
   - Total mass increase < 5% (quasi-static)
   - For dynamic: < 1% (to preserve inertia)

## Common Issues

### Excessive Hourglass Energy

**Symptom**: ALLAE > 5% of ALLIE.
**Fix**: Use enhanced hourglass control. Refine mesh. Use S4R instead of S3. Use C3D8R with stiffness hourglass.

### Mass Scaling Too Aggressive

**Symptom**: ALLMW > 5% of ALLIE, or dynamic results are wrong.
**Fix**: Reduce target time step. Use selective mass scaling. Reduce mass scaling frequency.

### Element Deletion Issues

**Symptom**: Elements delete too early or too late.
**Fix**: Adjust damage initiation criteria. Check element size (smaller elements fail at lower strain). Verify material parameters.

### Contact Penetration in Explicit

**Symptom**: Significant penetration in contact.
**Fix**: Increase penalty stiffness scale factor (5-10). Refine mesh at contact. Use kinematic contact formulation.

## Verification Checklist

- [ ] Time step is stable (check CFL condition)
- [ ] Mass scaling is appropriate (< 5% mass increase for quasi-static)
- [ ] Hourglass energy < 5% of internal energy
- [ ] Energy balance is satisfied (ALLWK ≈ ALLKE + ALLIE)
- [ ] Contact penetration is minimal
- [ ] Material failure parameters are calibrated
- [ ] Element deletion doesn't cause instability
- [ ] Duration captures the full event
- [ ] Output frequency captures key moments
- [ ] Results are mesh-independent (refine and compare)

## Wrapping Up

The thing I love about Abaqus/Explicit is that it just doesn't have convergence problems — it always runs. But that doesn't mean the results are always right. I always check the energy balance: if hourglass energy is more than 5% of internal energy, your reduced-integration elements are cheating you. If mass scaling added too much mass, your dynamic results are wrong. These two checks catch most of the bad explicit analyses I've seen. Get those right, use Johnson-Cook for high-strain-rate materials, and your crash and drop test simulations will give you data you can actually trust.
