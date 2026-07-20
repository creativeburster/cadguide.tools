---
title: "OpenFOAM Solver Selection: Choosing the Right Solver for Incompressible, Compressible, and Multiphase Flows"
excerpt: "Select the right OpenFOAM solver for your CFD application: incompressible (simpleFoam, pisoFoam), compressible (rhoSimpleFoam, rhoCentralFoam), multiphase (interFoam), and combustion (reactingFoam) with turbulence model options."
category: "workflow"
softwareSlug: "openfoam"
keyword: "openfoam solver selection incompressible compressible multiphase"
slug: "openfoam-solver-selection-incompressible-compressible-multiphase"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://www.openfoam.com/documentation/tutorial-guide"
  - "https://doc.cfd.direct/openfoam/user-guide-v13/tutorials"
---

# OpenFOAM Solver Selection: Choosing the Right Solver for Incompressible, Compressible, and Multiphase Flows

OpenFOAM includes over 50 solvers, each designed for specific flow regimes. Choosing the wrong solver leads to inaccurate results, convergence problems, or unnecessarily long run times. I'll break down the most commonly used solvers by flow type and help you select the right one for your application.

## Incompressible Solvers

Incompressible solvers assume constant density — valid when Mach number < 0.3. They're simpler and faster than compressible solvers.

### simpleFoam

**Use for:** Steady-state incompressible flow

**Algorithm:** SIMPLE (pressure-velocity coupling)

**Applications:**
- External aerodynamics at low speed (building ventilation, vehicle drag)
- Internal flow in pipes and ducts
- HVAC analysis
- Electronic cooling (without buoyancy)

**Key features:**
- Steady-state solver — converges to a time-independent solution
- Robust and well-tested
- Supports turbulence models (RANS)
- Supports porous media and MRF (Multiple Reference Frame) for rotating equipment

**When to use:** Most steady-state incompressible problems. Start here.

### pisoFoam

**Use for:** Transient incompressible flow

**Algorithm:** PISO (Pressure Implicit with Splitting of Operators)

**Applications:**
- Unsteady flow phenomena (vortex shedding, transient mixing)
- Startup and shutdown transients
- Flow with moving boundaries

**Key features:**
- Transient solver — captures time-dependent behavior
- More computationally expensive than simpleFoam
- Better for flows with significant unsteady effects
- Supports LES and DES turbulence models

**When to use:** When you need to capture transient behavior.

### icoFoam

**Use for:** Transient incompressible laminar flow

**Algorithm:** PISO

**Applications:**
- Laminar flow problems (low Reynolds number)
- Academic benchmark cases (lid-driven cavity, backward-facing step)
- Stokes flow

**When to use:** Only for laminar flow without turbulence. For turbulent flow, use pisoFoam or simpleFoam with a turbulence model.

### potentialFoam

**Use for:** Potential flow (inviscid, irrotational)

**Applications:**
- Initial condition generation for other solvers
- Quick approximation of flow fields
- Preliminary design studies

**When to use:** As a starting point for more complex simulations, or when you need a quick inviscid solution.

## Compressible Solvers

Compressible solvers account for density variation — required when Mach number > 0.3 or when temperature variation causes significant density changes.

### rhoSimpleFoam

**Use for:** Steady-state compressible flow

**Algorithm:** SIMPLE for compressible flow

**Applications:**
- Compressible aerodynamics (transonic flow)
- Gas dynamics in piping systems
- Nozzle and diffuser analysis

**When to use:** Steady-state compressible problems.

### rhoCentralFoam

**Use for:** Transient compressible flow with shocks

**Algorithm:** Central-upwind scheme

**Applications:**
- Supersonic and hypersonic flow
- Shock wave problems
- Blast simulations
- High-speed aerodynamics

**Key features:**
- Density-based solver — better for strong shocks
- Handles shock waves without excessive numerical dissipation
- More accurate than pressure-based solvers for compressible flows with discontinuities

**When to use:** When strong shocks are present. For mild compressibility, rhoSimpleFoam may suffice.

### sonicFoam

**Use for:** Transient compressible flow (transonic)

**Algorithm:** PISO for compressible flow

**When to use:** Transonic flow with moderate shock strength. For strong shocks, prefer rhoCentralFoam.

## Multiphase Solvers

### interFoam

**Use for:** Two immiscible, incompressible fluids

**Method:** Volume of Fluid (VOF)

**Applications:**
- Free surface flows (water-air interface)
- Wave simulation
- Dam break problems
- Filling and emptying of tanks
- Ship hydrodynamics with free surface

**Key features:**
- Tracks the interface between two fluids using the volume fraction (alpha)
- Surface tension modeling
- Dynamic mesh refinement at the interface (with interDyMFoam)

**When to use:** Any free-surface or two-fluid problem with immiscible fluids.

### multiphaseInterFoam

**Use for:** Multiple immiscible fluids (more than two)

**When to use:** When you have three or more immiscible fluids (e.g., oil-water-air).

### compressibleInterFoam

**Use for:** Two compressible, immiscible fluids

**When to use:** When both fluids are compressible (e.g., high-speed gas-liquid flow).

### reactingTwoPhaseEulerFoam

**Use for:** Two-phase flow with heat and mass transfer

**Applications:**
- Boiling and condensation
- Bubble columns
- Fluidized beds

**When to use:** When phase change or interfacial heat/mass transfer is important.

## Combustion and Reacting Flow Solvers

### reactingFoam

**Use for:** Reacting flow with combustion

**Applications:**
- Combustion chambers
- Flame simulation
- Chemical reactor analysis

**Key features:**
- Supports detailed chemical kinetics
- Multiple species transport
- Various combustion models (laminar flamelet, eddy dissipation concept)

### chemFoam

**Use for:** 0D chemical kinetics (constant volume reactor)

**When to use:** For calculating ignition delay times or homogeneous reactor chemistry.

## Heat Transfer Solvers

### buoyantSimpleFoam / buoyantPisoFoam

**Use for:** Buoyancy-driven flow with heat transfer

**Applications:**
- Natural convection
- Fire and smoke simulation
- Thermal comfort analysis
- Electronic cooling with buoyancy

**Key features:**
- Solves for temperature and includes buoyancy term
- Supports radiation models
- Can be steady-state (buoyantSimpleFoam) or transient (buoyantPisoFoam)

**When to use:** When temperature differences drive the flow (natural convection).

### chtMultiRegionSimpleFoam / chtMultiRegionFoam

**Use for:** Conjugate heat transfer (solid + fluid)

**Applications:**
- Heat exchangers
- Electronic package cooling
- Engine block thermal analysis

**Key features:**
- Solves heat transfer in both solid and fluid regions
- Couples the regions at the interface
- Supports multiple fluid and solid regions

**When to use:** When you need to simulate heat transfer between fluid and solid regions simultaneously.

## Turbulence Model Selection

All solvers support turbulence modeling through the `constant/turbulenceProperties` file:

```
simulationType  RAS;  // or LES, or laminar
```

### RANS Models

| Model | Name | Use Case |
|---|---|---|
| k-epsilon | RASModel: kEpsilon | General purpose, free shear flows |
| k-omega SST | RASModel: kOmegaSST | Wall-bounded flows, adverse pressure gradient |
| Spalart-Allmaras | RASModel: SpalartAllmaras | Aerospace external aerodynamics |
| RNG k-epsilon | RASModel: RNGkEpsilon | Moderate swirl and separation |
| Realizable k-epsilon | RASModel: realizableKE | Boundary layers with pressure gradient |

### LES Models

| Model | Name | Use Case |
|---|---|---|
| Smagorinsky | LESModel: Smagorinsky | Simple LES, isotropic flows |
| WALE | LESModel: WALE | Wall-bounded flows |
| dynamicKEqn | LESModel: dynamicKEqn | Dynamic LES, better for complex flows |

## Solver Selection Decision Tree

1. **Is the flow incompressible (Mach < 0.3)?**
   - Yes → Go to step 2
   - No → Use compressible solver (rhoSimpleFoam or rhoCentralFoam)

2. **Is the flow steady or transient?**
   - Steady → simpleFoam
   - Transient → pisoFoam

3. **Is buoyancy important?**
   - Yes → buoyantSimpleFoam or buoyantPisoFoam
   - No → simpleFoam or pisoFoam

4. **Are there multiple fluid phases?**
   - Yes → interFoam (VOF) or reactingTwoPhaseEulerFoam
   - No → standard single-phase solver

5. **Is there conjugate heat transfer (solid + fluid)?**
   - Yes → chtMultiRegionFoam
   - No → standard solver

6. **Is there combustion or chemical reaction?**
   - Yes → reactingFoam
   - No → standard solver

## Best Practices

- **Start simple** — use the simplest solver that captures your physics
- **Validate with benchmarks** — compare results with known solutions
- **Check convergence** — monitor residuals and physical quantities
- **Use appropriate turbulence model** — k-omega SST for wall-bounded, k-epsilon for general
- **Read the tutorial cases** — `$FOAM_TUTORIALS` has examples for every solver
- **Check solver documentation** — the source code comments are often the best documentation
