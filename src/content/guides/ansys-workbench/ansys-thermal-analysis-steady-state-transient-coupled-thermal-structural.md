---
title: "ANSYS Thermal Analysis: Steady-State, Transient, and Coupled Thermal-Structural Simulation"
excerpt: "A guide to thermal analysis in ANSYS Workbench covering steady-state and transient heat transfer, conduction convection radiation modeling, thermal contact resistance, and coupled thermal-structural analysis for thermal stress."
category: "workflow"
softwareSlug: "ansys-workbench"
keyword: "ansys thermal analysis"
slug: "ansys-thermal-analysis-steady-state-transient-coupled-thermal-structural"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://ansyshelp.ansys.com/"

---

# ANSYS Thermal Analysis: Steady-State, Transient, and Coupled Thermal-Structural Simulation

Thermal analysis is one of those things that seems simple until you actually do it. I learned that the hard way on an electronics cooling project where I forgot to account for thermal contact resistance at a TIM interface — my temperature predictions were off by 30°C. Let me share what I've picked up running steady-state, transient, and coupled thermal-structural analyses in ANSYS Workbench.

## Steady-State Thermal Analysis

### Setup

1. Drag "Steady-State Thermal" to Project Schematic
2. Import geometry
3. Define materials in Engineering Data:
   - **Thermal conductivity (k)**: In W/m·°C
   - **Density (ρ)**: In kg/m³
   - **Specific heat (Cp)**: In J/kg·°C (for transient only)

### Common Materials

| Material | k (W/m·°C) | ρ (kg/m³) | Cp (J/kg·°C) |
|----------|-----------|-----------|-------------|
| Aluminum 6061 | 167 | 2700 | 896 |
| Copper | 386 | 8960 | 385 |
| Steel 1018 | 51.9 | 7870 | 486 |
| Stainless 304 | 16.2 | 8000 | 500 |
| Silicon | 149 | 2329 | 700 |
| FR4 (PCB) | 0.3 | 1850 | 1300 |
| Air | 0.026 | 1.225 | 1005 |
| Water | 0.6 | 998 | 4182 |

### Boundary Conditions

#### Temperature
1. Insert > Temperature
2. Select faces or bodies
3. Set temperature: In °C or K
4. Use as fixed temperature boundary (Dirichlet)

#### Heat Flux
1. Insert > Heat Flux
2. Select faces
3. Set: In W/m²
4. Uniform or tabular data

#### Heat Flow (Power)
1. Insert > Heat Flow (Internal Heat Generation)
2. Select faces or bodies
3. Set: In W
4. For electronic components: e.g., CPU = 95W

#### Convection
1. Insert > Convection
2. Select faces
3. Set:
   - **Film coefficient (h)**: In W/m²·°C
   - **Ambient temperature**: In °C
4. Typical film coefficients:

| Condition | h (W/m²·°C) |
|-----------|-------------|
| Natural convection (air) | 5-25 |
| Forced convection (air) | 25-250 |
| Natural convection (water) | 50-1000 |
| Forced convection (water) | 500-10000 |
| Boiling water | 2500-50000 |
| Condensation | 5000-100000 |

#### Radiation
1. Insert > Radiation
2. Select faces
3. Set:
   - **Emissivity (ε)**: 0-1 (0 = perfect reflector, 1 = perfect emitter)
   - **Ambient temperature**: In °C
4. Typical emissivity:

| Surface | Emissivity |
|---------|-----------|
| Polished aluminum | 0.05 |
| Oxidized aluminum | 0.15 |
| Black anodized aluminum | 0.85 |
| Painted surface | 0.90 |
| Black body | 1.00 |

5. For radiation between surfaces:
   - Insert > Radiation > Surface-to-Surface
   - Define enclosure (group of radiating faces)

#### Insulated (Adiabatic)
1. Default condition: No heat transfer
2. No explicit boundary condition needed

### Thermal Contact

1. Insert > Contact (thermal)
2. Set thermal conductance:
   - **Perfect contact**: High conductance (k = 10⁶ W/m²·°C)
   - **Realistic contact**: k = 1000-10000 W/m²·°C
   - **Air gap**: k = 5-25 W/m²·°C (natural convection)
   - **Thermal interface material (TIM)**: k = 200-1000 W/m²·°C

### Solution

1. Solve
2. Results:
   - **Temperature distribution**: Contour plot
   - **Total heat flux**: Magnitude and direction
   - **Directional heat flux**: In X, Y, or Z
   - **Temperature probes**: At specific points

## Transient Thermal Analysis

### Setup

1. Drag "Transient Thermal" to Project Schematic
2. Import geometry and materials (same as steady-state)
3. Set:
   - **Initial temperature**: Uniform (e.g., 25°C) or from steady-state
   - **End time**: Total simulation time (e.g., 3600 seconds)
   - **Time step**: Δt (e.g., 1 second for fast, 60 seconds for slow)

### Time Step Selection

- **Fourier number**: Fo = α × Δt / L² < 0.5 for stability
- **α**: Thermal diffusivity = k / (ρ × Cp)
- **L**: Characteristic length (element size)
- Example: Steel, L = 1mm
  - α = 51.9 / (7870 × 486) = 1.36×10⁻⁵ m²/s
  - Δt < 0.5 × (0.001)² / 1.36×10⁻⁵ = 0.037 seconds

### Time-Dependent Boundary Conditions

1. Insert > Convection (or Heat Flux, Temperature)
2. Set to "Tabular Data"
3. Enter time-value pairs:
   - t=0: h=10 W/m²·°C
   - t=60: h=10 W/m²·°C
   - t=61: h=50 W/m²·°C (fan turns on)
   - t=3600: h=50 W/m²·°C

### Results

1. Temperature at specific times:
   - t=10s: Early transient
   - t=100s: Mid transient
   - t=3600s: Near steady-state
2. Temperature vs. time at probe points:
   - Insert > Temperature Probe
   - Select vertex or face
   - Plot temperature history
3. Maximum temperature vs. time:
   - Track peak temperature over time
   - Identify when steady-state is reached

## Coupled Thermal-Structural Analysis

### Setup

1. Drag "Static Structural" to Project Schematic
2. Share Engineering Data and Model with Thermal analysis
3. Or use "Thermal-Stress" analysis system (pre-linked)
4. Link Solution from Steady-State Thermal to Setup of Static Structural

### Thermal Load Import

1. In Static Structural > Setup
2. Insert > Thermal Load > Imported Temperature
3. The temperature field from thermal analysis is applied as a load
4. Thermal strain: εth = α × (T - Tref)
   - α: Coefficient of thermal expansion (CTE)
   - Tref: Reference temperature (stress-free temperature)

### Material CTE

| Material | α (×10⁻⁶/°C) |
|----------|-------------|
| Aluminum 6061 | 23.6 |
| Copper | 16.5 |
| Steel 1018 | 11.7 |
| Stainless 304 | 17.3 |
| Titanium Ti-6Al-4V | 9.1 |
| Invar 36 | 1.3 (low expansion) |
| Glass | 5.0 |

### Combined Loading

1. Apply mechanical loads (force, pressure) in addition to thermal
2. Example: Pressure vessel with internal pressure and temperature:
   - Internal pressure: 10 MPa
   - Internal temperature: 200°C
   - External temperature: 25°C
3. Total stress = mechanical stress + thermal stress

### Results

1. **Total deformation**: From mechanical + thermal expansion
2. **Equivalent stress (von Mises)**: Combined stress
3. **Thermal strain**: εth = α × ΔT
4. **Mechanical strain**: Total strain - thermal strain
5. **Safety factor**: Must account for temperature-dependent material properties

## Electronics Cooling Application

### PCB Thermal Analysis

1. Import PCB geometry (PCB + components)
2. Assign materials:
   - **PCB**: FR4 (k = 0.3 W/m·°C, anisotropic)
   - **Components**: Silicon (k = 149), copper traces (k = 386)
   - **Solder**: SAC305 (k = 58)
3. Apply heat loads:
   - **CPU**: 95W
   - **GPU**: 150W
   - **Memory**: 10W per module
4. Apply convection:
   - **Natural**: h = 10 W/m²·°C (passive cooling)
   - **Forced**: h = 50 W/m²·°C (fan cooling)
5. Results:
   - **Junction temperature**: Must be < 100°C (typical limit)
   - **PCB temperature**: Must be < 105°C (glass transition)
   - **Hotspot identification**: For heatsink placement

### Heat Sink Design

1. Model heat sink (base + fins)
2. Apply:
   - **Heat flow**: From component (e.g., 95W)
   - **Convection**: On fin surfaces (h = 50 W/m²·°C for forced air)
3. Optimize:
   - **Fin count**: More fins = more surface area but less flow
   - **Fin height**: Taller = more area but less efficient
   - **Fin thickness**: Thicker = more conduction but less flow
4. Target: Base temperature < 80°C for CPU application

## Verification Checklist

- [ ] Material thermal properties are correct (k, ρ, Cp)
- [ ] Boundary conditions cover all surfaces (no adiabatic by accident)
- [ ] Film coefficients are realistic for the flow condition
- [ ] Radiation is included for high-temperature surfaces (> 300°C)
- [ ] Thermal contact conductance is specified at interfaces
- [ ] Mesh is refined near heat sources and temperature gradients
- [ ] Steady-state solution is independent of initial conditions
- [ ] Transient time step satisfies Fourier number criterion
- [ ] Temperature results are physically reasonable
- [ ] Thermal stress accounts for CTE mismatch

## Common Thermal Issues

### Unrealistic Temperatures

**Symptom**: Temperature exceeds material limits or ambient conditions.
**Fix**: Check heat loads (W vs. W/m²), verify boundary conditions, ensure all surfaces have convection or radiation.

### Slow Transient Convergence

**Symptom**: Transient takes very long to reach steady-state.
**Fix**: Increase time step (if stable), use larger elements (if accuracy permits), or start from steady-state estimate.

### Thermal Contact Problem

**Symptom**: Temperature jump at contact interface.
**Fix**: Adjust thermal contact conductance. Add thermal interface material (TIM). Ensure contact pressure is sufficient.

### CTE Mismatch Failure

**Symptom**: High thermal stress at material interfaces.
**Fix**: Use materials with similar CTE. Add compliance (flexible joints). Use adhesives with low modulus. Reduce temperature gradient.

## Wrapping Up

Looking back at the thermal analyses I've run over the years, the ones that went wrong almost always came down to the same things: unrealistic convection coefficients, missing thermal contact resistance, or forgetting radiation on high-temperature surfaces. Get your material properties right, be honest about your boundary conditions, and always refine the mesh near heat sources. Do that, and your temperature predictions will be close enough to make good design decisions — whether you're cooling a CPU or designing a heat exchanger.
