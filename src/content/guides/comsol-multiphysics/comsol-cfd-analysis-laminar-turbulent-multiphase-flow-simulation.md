---
title: "COMSOL CFD Analysis: Laminar, Turbulent, and Multiphase Flow Simulation"
excerpt: "A guide to CFD analysis in COMSOL covering laminar and turbulent flow modeling, turbulence models (k-ε, k-ω, SST), multiphase flow, porous media flow, and conjugate heat transfer for internal and external flow problems."
category: "workflow"
softwareSlug: "comsol-multiphysics"
keyword: "comsol cfd analysis"
slug: "comsol-cfd-analysis-laminar-turbulent-multiphase-flow-simulation"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.comsol.com/cfd-module"
  - "https://doc.comsol.com/"
---

# COMSOL CFD Analysis: Laminar, Turbulent, and Multiphase Flow Simulation

I'll be upfront — COMSOL isn't my first choice for pure CFD work. If I'm doing a complex external aerodynamics simulation, I'll reach for Fluent. But when I need CFD coupled with other physics — like conjugate heat transfer or fluid-structure interaction — COMSOL is hard to beat. The fact that everything shares one mesh and one solver makes coupled problems so much easier. Here's how I approach CFD in COMSOL.

## Flow Physics Selection

### Laminar Flow

1. Add Physics > Fluid Flow > Laminar Flow
2. Use when:
   - **Reynolds number** Re = ρ × U × L / μ < 2300 (internal pipe flow)
   - Low velocity, small scale, or viscous fluid
3. Governing equations:
   - Navier-Stokes: ρ(∂u/∂t + u·∇u) = -∇p + μ∇²u + F
   - Continuity: ∇·(ρu) = 0
4. Solver: Direct (PARDISO) or iterative (GMRES)

### Turbulent Flow

1. Add Physics > Fluid Flow > Turbulent Flow
2. Select turbulence model:

| Model | Best For | Wall Treatment |
|-------|----------|----------------|
| k-ε | General purpose, internal flows | Wall functions (y+ > 30) |
| k-ω | Wall-bounded flows, adverse pressure gradient | Low-Re (y+ < 1) |
| SST | Best overall, separation, external aerodynamics | Low-Re (y+ < 1) |
| Spalart-Allmaras | Aerodynamics, external flows | Wall functions (y+ > 30) |
| Realizable k-ε | Jets, rotating flows | Wall functions (y+ > 30) |
| L-VEL | Internal flows, electronics cooling | Automatic (y+ independent) |

3. Reynolds number check:
   - Re > 4000: Turbulent (use turbulence model)
   - 2300 < Re < 4000: Transitional (use turbulence model with care)

### Creeping Flow (Stokes)

1. Add Physics > Fluid Flow > Creeping Flow
2. Use when Re < 1 (microfluidics, porous media, slow flow)
3. Neglects inertial terms: 0 = -∇p + μ∇²u
4. Faster than full Navier-Stokes

## Boundary Conditions

### Inlet

1. **Velocity**: Specify velocity vector (u, v, w)
2. **Mass flow rate**: Specify mass flow (kg/s)
3. **Pressure**: Specify static pressure (with flow direction)
4. **Fully developed flow**: Parabolic profile (laminar) or power-law (turbulent)

### Outlet

1. **Pressure**: Specify static pressure (common: 0 Pa gauge)
2. **Mass flow rate**: Specify outflow
3. **Outflow**: Zero-gradient (Neumann) — use with caution
4. **Normal stress**: Specify stress (for free jets)

### Wall

1. **No-slip wall**: u = 0 at wall (standard)
2. **Sliding wall**: Wall moves with specified velocity (rotating, moving)
3. **Slip wall**: Zero shear (free-slip, inviscid limit)
4. **Leaking wall**: Mass transfer through wall (porous)

### Symmetry

1. **Symmetry plane**: Reduces computational domain
2. Zero normal velocity, zero tangential shear
3. Use for geometric symmetry with symmetric flow

## Meshing for CFD

### Mesh Requirements

1. **Near-wall mesh**: Inflation layers for boundary layer
   - y+ < 1: For k-ω, SST (low-Re models)
   - y+ > 30: For k-ε with wall functions
2. **Bulk flow**: Reasonable element size (not too coarse)
3. **Transition**: Smooth transition from inflation to bulk (growth ratio < 1.2)

### Inflation Layers

1. Mesh > Boundary Layers > Add boundary layer
2. Select wall boundaries
3. Set:
   - **Number of layers**: 10-15 (typical)
   - **First layer thickness**: Based on y+ target
   - **Growth ratio**: 1.15-1.2
4. y+ calculation:
   - For y+ = 1: y₁ = μ / (ρ × uτ), uτ = √(τw/ρ)
   - Estimate τw from flat plate: τw ≈ 0.0225 × ρ × U² × Re^(-1/4)

### Mesh Quality

1. Check:
   - **Skewness**: < 0.7 (COMSOL mesh statistics)
   - **Aspect ratio**: < 100 (acceptable for inflation)
   - **Element quality**: > 0.1 (minimum)
2. Refine in:
   - Recirculation zones
   - Separation points
   - Wake regions
   - Near geometry features (corners, edges)

## Conjugate Heat Transfer

### Setup

1. Add Physics:
   - **Fluid Flow**: Laminar or Turbulent Flow
   - **Heat Transfer in Solids and Fluids**
2. Add Multiphysics > Heat Transfer in Flow:
   - Couples velocity field to heat transfer (advection)
   - Couples temperature to fluid properties (if temperature-dependent)
3. Applications:
   - **Heat exchanger**: Hot fluid → wall → cold fluid
   - **Electronics cooling**: Air flow over heated components
   - **Engine cooling**: Coolant through engine block

### Boundary Conditions (Thermal)

1. **Temperature**: Fixed temperature at boundary
2. **Heat flux**: Specified heat flux (W/m²)
3. **Convective cooling**: h and T_ambient
4. **Thermal insulation**: No heat transfer (default for external)
5. **Continuity**: At fluid-solid interface (automatic with multiphysics)

### Results

1. **Temperature field**: In both fluid and solid
2. **Heat flux**: Direction and magnitude
3. **Nusselt number**: Nu = h × L / k (heat transfer coefficient)
4. **Streamlines**: Flow path with temperature color

## Multiphase Flow

### Level Set Method

1. Add Physics > Fluid Flow > Two-Phase Flow, Level Set
2. Tracks interface between two immiscible fluids
3. Phase field variable: φ = 0 (fluid 1), φ = 1 (fluid 2)
4. Interface: φ = 0.5
5. Applications:
   - **Droplet dynamics**: Inkjet printing, fuel injection
   - **Bubble rise**: Gas bubble in liquid
   - **Wave breaking**: Free surface flow

### Phase Field Method

1. Add Physics > Fluid Flow > Two-Phase Flow, Phase Field
2. Diffuse interface method (more physical than level set)
3. Better for:
   - **Coalescence**: Merging droplets
   - **Breakup**: Droplet splitting
   - **Contact angle**: Wetting on solid surface

### Mixture Model

1. Add Physics > Fluid Flow > Mixture Model
2. For dispersed phases (bubbles, particles in carrier fluid)
3. Faster than full two-phase (no interface tracking)
4. Applications:
   - **Slurry flow**: Particles in liquid
   - **Bubbly flow**: Gas bubbles in liquid
5. Set:
   - **Dispersed phase density**: ρd
   - **Dispersed phase diameter**: dd
   - **Slip velocity model**: Schiller-Naumann (default)

## Porous Media Flow

### Darcy's Law

1. Add Physics > Fluid Flow > Darcy's Law
2. For slow flow through porous media:
   - u = -(κ/μ) × ∇p
   - κ: Permeability (m²)
   - μ: Dynamic viscosity (Pa·s)
3. Applications:
   - **Groundwater flow**: Aquifer modeling
   - **Oil reservoir**: Petroleum extraction
   - **Filtration**: Flow through filter media

### Brinkman Equations

1. Add Physics > Fluid Flow > Brinkman Equations
2. Extends Darcy with viscous terms (for boundary effects)
3. Use when:
   - Need to resolve flow near walls
   - Transition between porous and free flow
4. Set:
   - **Permeability**: κ (matrix or scalar)
   - **Porosity**: ε (void fraction)

## Post-Processing

### Velocity

1. **Velocity magnitude**: |u| = √(ux² + uy² + uz²)
2. **Velocity vectors**: Arrow plot showing direction
3. **Streamlines**: Pathlines from inlet or specified points
4. **Velocity profile**: At cross-section (plot vs. position)

### Pressure

1. **Pressure contour**: Color plot of pressure field
2. **Pressure drop**: Δp = pinlet - poutlet
3. **Pressure coefficient**: Cp = (p - p∞) / (0.5 × ρ × U²)

### Derived Quantities

1. **Drag coefficient**: Cd = 2 × Fdrag / (ρ × U² × A)
2. **Lift coefficient**: Cl = 2 × Flift / (ρ × U² × A)
3. **Mass flow rate**: ṁ = ∫ ρ × u · n dA (at any cross-section)
4. **Reynolds number**: Re = ρ × U × L / μ
5. **Nusselt number**: Nu = h × L / k (for heat transfer)

## Solver Configuration

### Steady-State

1. Study > Stationary
2. Solver:
   - **Direct (PARDISO)**: For small to medium models (< 1M DOF)
   - **Iterative (GMRES)**: For large models (> 1M DOF)
3. For turbulent flow:
   - May need pseudo-time stepping for convergence
   - CFL-based pseudo-time step

### Transient

1. Study > Time Dependent
2. Set:
   - **Time range**: range(0, Δt, T_end)
   - **Time step**: Δt (based on CFL condition)
   - CFL = U × Δt / Δx < 1 (for stability)
3. Solver:
   - **BDF**: Backward differentiation (default, robust)
   - **Generalized alpha**: For second-order accuracy

### Convergence

1. Monitor:
   - **Residuals**: Should decrease to tolerance (10⁻³ or lower)
   - **Monitor points**: Velocity or pressure at specific point
2. If not converging:
   - Reduce relaxation factor
   - Use pseudo-time stepping
   - Refine mesh in problem areas
   - Start with simpler model (laminar) then switch to turbulent

## Verification Checklist

- [ ] Flow regime is correct (laminar vs. turbulent based on Re)
- [ ] Turbulence model is appropriate for the flow type
- [ ] y+ is in target range for the turbulence model
- [ ] Mesh is refined near walls and in recirculation zones
- [ ] Inlet and outlet boundary conditions are correct
- [ ] Mass flow balances (inlet = outlet within 1%)
- [ ] No reverse flow at outlet
- [ ] Residuals converged to tolerance
- [ ] Mesh independence verified (results don't change with refinement)
- [ ] Results are physically reasonable (compare to analytical or experimental)

## Wrapping Up

COMSOL's CFD capabilities are solid for most general flow problems, and where it really shines is when you need to couple flow with something else — heat transfer, structural mechanics, or electromagnetics. That said, for standalone CFD, make sure you pick the right turbulence model (SST k-ω for wall-bounded flows, k-ε for general internal flows) and get your y+ in the right range. I've seen too many people use k-ε with wall functions when their y+ was actually below 1 — that's the wrong setup and your results will be off. Check your y+ after every run.
