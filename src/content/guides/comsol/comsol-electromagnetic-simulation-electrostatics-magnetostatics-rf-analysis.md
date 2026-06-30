---
title: "COMSOL Electromagnetic Simulation: Electrostatics, Magnetostatics, and RF Analysis"
excerpt: "A guide to electromagnetic simulation in COMSOL covering electrostatic field analysis, magnetostatic modeling, induction and eddy currents, RF wave propagation, antenna design, and electromagnetic-thermal coupling for devices."
category: "workflow"
softwareSlug: "comsol"
keyword: "comsol electromagnetic simulation"
slug: "comsol-electromagnetic-simulation-electrostatics-magnetostatics-rf-analysis"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.comsol.com/acdc-module"
  - "https://www.comsol.com/rf-module"
---

# COMSOL Electromagnetic Simulation: Electrostatics, Magnetostatics, and RF Analysis

Electromagnetic simulation is one of those areas where COMSOL really stands out. I've used it for everything from capacitor design to RF antenna work, and the fact that I can couple electromagnetic results directly with thermal and structural physics in the same model is a huge time-saver. Let me walk you through how I approach EM simulation in COMSOL, from DC electrostatics to high-frequency RF.

## Electrostatics

### Setup

1. Add Physics > AC/DC > Electrostatics
2. Governing equation:
   - ∇·(ε₀εr∇V) = -ρv
   - V: Electric potential (V)
   - ε₀: Vacuum permittivity (8.854×10⁻¹² F/m)
   - εr: Relative permittivity (dimensionless)
   - ρv: Volume charge density (C/m³)
3. Materials:
   - **Dielectric**: εr (e.g., air = 1, glass = 4.2, FR4 = 4.5)
   - **Conductor**: Treated as boundary (equipotential surface)

### Boundary Conditions

1. **Electric potential**: V = specified value (e.g., 10V on electrode)
2. **Ground**: V = 0 (reference)
3. **Surface charge density**: σs (C/m²) on boundary
4. **Electric displacement**: Dn = specified (charge on surface)
5. **Zero charge**: Dn = 0 (default, no surface charge)
6. **Continuity**: At dielectric interface (automatic)

### Results

1. **Electric potential**: V (V) — contour plot
2. **Electric field**: E = -∇V (V/m) — vector or magnitude
3. **Electric displacement**: D = ε₀εrE (C/m²)
4. **Capacitance**: C = Q/V (integrate charge on electrode)
5. **Energy**: W = 0.5 × ∫ ε₀εr|E|² dV (J)
6. **Force**: Maxwell stress tensor on surface

### Applications

- **Capacitor design**: Calculate capacitance, field distribution
- **Insulator design**: Check for dielectric breakdown (E > Ebreakdown)
- **High-voltage equipment**: Field grading, corona analysis
- **MEMS**: Electrostatic actuation (comb drive, parallel plate)

## Magnetostatics

### Setup

1. Add Physics > AC/DC > Magnetic Fields, No Currents (for permanent magnets) or Magnetic Fields (for current-carrying conductors)
2. Governing equations:
   - ∇×H = J (Ampère's law)
   - ∇·B = 0 (Gauss's law for magnetism)
   - B = μ₀μrH (constitutive relation)
3. Materials:
   - **Non-magnetic**: μr = 1 (air, aluminum, copper)
   - **Ferromagnetic**: μr = 1000-10000 (iron, steel)
   - **Permanent magnet**: B-H curve or remanent flux

### Boundary Conditions

1. **Magnetic potential**: A = specified (vector potential)
2. **Magnetic insulation**: n × A = 0 (flux tangent to boundary)
3. **Surface current**: Ks (A/m) on boundary
4. **Continuity**: At material interface (automatic)

### Coil and Current Modeling

1. **Single-turn coil**: 
   - Current: I (A) through coil
   - Magnetic field: B = μ₀I/(2πr) (for long straight wire)
2. **Multi-turn coil**:
   - Number of turns: N
   - Current per turn: I
   - Total ampere-turns: NI
3. **Current density**: J = NI / Across (A/m²)

### Results

1. **Magnetic flux density**: B (T) — contour or vector
2. **Magnetic field intensity**: H (A/m)
3. **Magnetic force**: On ferromagnetic parts (Maxwell stress)
4. **Inductance**: L = NΦ/I (flux linkage per current)
5. **Energy**: W = 0.5 × ∫ B·H dV (J)

### Applications

- **Solenoid**: Field inside and outside coil
- **Permanent magnet**: Field distribution, force on nearby steel
- **Magnetic circuit**: Yoke, air gap, leakage flux
- **Motor stator**: Slot leakage, tooth flux density

## Time-Harmonic Electromagnetics (Eddy Currents)

### Setup

1. Add Physics > AC/DC > Magnetic Fields (frequency domain)
2. Governing equation:
   - ∇×(1/μ × ∇×A) = (σ + jωε) × (-jωA + Js)
   - ω = 2πf (angular frequency)
   - σ: Electrical conductivity (S/m)
3. Materials:
   - **Conductor**: σ (e.g., copper = 5.96×10⁷ S/m)
   - **Iron core**: σ + nonlinear B-H curve

### Eddy Current Effects

1. **Skin effect**: Current concentrates at surface
   - Skin depth: δ = √(2/(ωμσ))
   - At 60 Hz in copper: δ = 8.5mm
   - At 10 kHz in copper: δ = 0.66mm
2. **Proximity effect**: Current redistribution due to nearby conductors
3. **Power loss**: Peddy = ∫ J²/σ dV (W)

### Mesh for Eddy Currents

1. **Skin depth resolution**: Need 2-3 elements within δ
2. **Boundary layer mesh**: At conductor surface
3. For thin skin depth (high frequency):
   - Use **Impedance boundary condition** (surface impedance)
   - Avoids meshing inside conductor
   - Good for large conductors at high frequency

### Applications

- **Induction heating**: Eddy current loss → heat
- **Transformer**: Core losses, leakage inductance
- **Motor**: Rotor bar currents, starting torque
- **NDT**: Eddy current probe for crack detection

## RF and Microwave Simulation

### Setup

1. Add Physics > RF > Electromagnetic Waves, Frequency Domain
2. Governing equation:
   - ∇×(μr⁻¹∇×E) - k₀²(εr - jσ/(ωε₀))E = 0
   - k₀ = ω/c (free-space wave number)
3. Frequency range:
   - **RF**: 3 MHz - 300 MHz
   - **Microwave**: 300 MHz - 300 GHz
   - **mmWave**: 30 GHz - 300 GHz

### Boundary Conditions

1. **Port boundary**: Waveguide or coaxial port
   - Specify mode (TE10, TEM, etc.)
   - Input power or S-parameter calculation
2. **Perfect electric conductor (PEC)**: n × E = 0 (ideal metal)
3. **Perfect magnetic conductor (PMC)**: n × H = 0 (magnetic wall)
4. **Scattering boundary**: Absorbs outgoing waves (no reflection)
5. **Impedance boundary**: Finite conductivity surface

### S-Parameter Calculation

1. Add Port boundary at input and output
2. Set:
   - **Port type**: Rectangular, coaxial, or numeric
   - **Mode**: TE10, TEM, etc.
3. COMSOL calculates:
   - **S11**: Reflection coefficient (return loss)
   - **S21**: Transmission coefficient (insertion loss)
   - **S-parameters**: Full scattering matrix
4. Results in dB: S_dB = 20 × log10(|S|)

### Applications

- **Waveguide**: Mode propagation, cutoff frequency
- **Antenna**: Radiation pattern, gain, impedance
- **Filter**: Bandpass, bandstop, S-parameters
- **Coupler**: Directional coupler, power split
- **Resonator**: Q-factor, resonant frequency

### Antenna Analysis

1. Setup:
   - **Antenna geometry**: Patch, dipole, horn, etc.
   - **Port**: Feed (coaxial or microstrip)
   - **Far-field calculation**: On radiation boundary
2. Results:
   - **Radiation pattern**: 3D or 2D polar plot
   - **Gain**: dBi (relative to isotropic)
   - **Directivity**: D (dimensionless or dBi)
   - **Efficiency**: η = G/D
   - **Input impedance**: Zin (for matching)
   - **Bandwidth**: Frequency range for SWR < 2

## Electromagnetic-Thermal Coupling

### Joule Heating (DC)

1. Add Physics:
   - **Electric Currents**: Current and potential
   - **Heat Transfer**: Temperature field
2. Multiphysics > Electromagnetic Heating:
   - Q = J²/σ (volumetric heat generation)
3. Applications:
   - **Bus bar**: Current distribution and temperature
   - **Fuse**: Melting at overcurrent
   - **Resistor**: Power dissipation and temperature

### Induction Heating (AC)

1. Add Physics:
   - **Magnetic Fields (frequency domain)**: Eddy currents
   - **Heat Transfer**: Temperature
2. Multiphysics > Induction Heating:
   - Q = Peddy + Physteresis
3. Temperature-dependent properties:
   - σ(T): Conductivity decreases with temperature
   - μr(T): Permeability drops at Curie temperature
4. Applications:
   - **Steel heating**: Hardening, tempering
   - **Brazing**: Metal joining
   - **Semiconductor**: Crystal growth, wafer heating

### Microwave Heating

1. Add Physics:
   - **Electromagnetic Waves (RF)**: Microwave field
   - **Heat Transfer**: Temperature
2. Multiphysics > Microwave Heating:
   - Q = 0.5 × ω × ε₀ × ε'' × |E|²
   - ε'': Dielectric loss factor
3. Applications:
   - **Microwave oven**: Food heating pattern
   - **Microwave drying**: Moisture removal
   - **Plasma processing**: Microwave plasma generation

## Verification Checklist

- [ ] Material properties are correct (εr, μr, σ)
- [ ] Boundary conditions match physical setup
- [ ] Mesh resolves skin depth (for eddy current problems)
- [ ] Frequency is correct (for time-harmonic analysis)
- [ ] S-parameters are physically reasonable (|S| ≤ 1 for passive)
- [ ] Energy balance is satisfied (input = dissipated + radiated)
- [ ] Far-field pattern is correct (nulls and peaks in expected directions)
- [ ] Force calculations converge (Maxwell stress or virtual work)
- [ ] Results match analytical solution (if available)
- [ ] Mesh independence verified

## Wrapping Up

The thing about electromagnetic simulation in COMSOL is that your material properties make or break the analysis. I once spent three days trying to figure out why my eddy current results were wrong, only to realize I'd used the wrong conductivity value for the steel core. Double-check your εr, μr, and σ values before you hit solve. And if you're doing RF work, make sure your mesh resolves the wavelength — at least 5-6 elements per wavelength, or your S-parameters will be garbage. Get those basics right and COMSOL handles the rest.
