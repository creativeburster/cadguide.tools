---
title: "ANSYS Fluent Heat Transfer Simulation: Conjugate Heat Transfer, Natural Convection, and Thermal Boundary Conditions"
excerpt: "How to set up heat transfer simulations in ANSYS Fluent — covering conjugate heat transfer (CHT) between solids and fluids, natural convection with buoyancy, thermal boundary conditions, and troubleshooting energy equation convergence problems."
category: "workflow"
softwareSlug: "ansys-fluent"
keyword: "ansys fluent heat transfer conjugate cht natural convection thermal boundary"
slug: "ansys-fluent-heat-transfer-conjugate-cht-natural-convection-thermal"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-07-09"
sources:
  - "https://innovationspace.ansys.com/knowledge/forums/topic/how-do-i-get-rid-of-convergence-problems-with-energy-equation-in-fluent-especially-since-r15/"
  - "https://innovationspace.ansys.com/knowledge/forums/topic/what-are-the-suggested-steps-if-i-am-having-convergence-issues-for-conjugate-heat-transfer-problems/"
---

# ANSYS Fluent Heat Transfer Simulation: Conjugate Heat Transfer, Natural Convection, and Thermal Boundary Conditions

Heat transfer simulations are where I see the most convergence problems. The energy equation is sensitive — it interacts with the flow field, turbulence model, and mesh quality in ways that momentum equations don't. Conjugate heat transfer (CHT), where you simulate both solid and fluid domains, adds another layer of complexity. Here's how to set up heat transfer simulations that converge and give accurate results.

## Types of Heat Transfer in Fluent

### Forced Convection
- Flow is driven by external means (pump, fan, wind)
- Heat transfer depends on flow velocity and turbulence
- Standard CFD setup with energy equation enabled

### Natural Convection
- Flow is driven by density differences (buoyancy)
- Requires gravity and Boussinesq approximation or full compressible flow
- Sensitive to operating pressure and temperature difference

### Conjugate Heat Transfer (CHT)
- Simulates both solid and fluid domains
- Heat conducts through solids and convects in fluids
- Requires mesh in both solid and fluid regions
- Interface between solid and fluid must be properly defined

### Radiation
- Significant at high temperatures (> 1000 K)
- Surface-to-surface radiation (S2S) or discrete ordinates (DO)
- Participating media radiation for combustion

## Step 1: Enable the Energy Equation

1. Go to **Setup** → **Models** → **Energy**.
2. Enable **Energy Equation**.
3. This activates the energy equation in the solver.
4. Without this, no heat transfer is calculated.

### When to Enable Energy

Enable the energy equation for:
- Any temperature-dependent simulation
- Heat transfer analysis (forced/natural convection, conduction, radiation)
- Compressible flow (density depends on temperature)
- Combustion (chemical reactions release heat)
- Multiphase flow with evaporation/condensation

## Step 2: Define Thermal Boundary Conditions

### Wall Thermal Conditions

For each wall, specify one of:

1. **Temperature**: Fixed wall temperature (Dirichlet condition)
   - Use when wall temperature is known (e.g., measured surface temperature)
   - Most stable for convergence

2. **Heat Flux**: Fixed heat flux (Neumann condition)
   - Use when heat input is known (e.g., electronic component power)
   - Can cause convergence issues if heat flux is high

3. **Convection**: Convective heat transfer to external environment
   - Specify external heat transfer coefficient and free stream temperature
   - Use for walls exposed to ambient air

4. **Radiation**: Radiative heat transfer to surroundings
   - Specify external emissivity and radiation temperature
   - Use for high-temperature surfaces

5. **Coupled**: Heat flux determined by the simulation (for coupled walls)
   - Used at solid-fluid interfaces in CHT
   - Heat flux is calculated from the temperature gradient on both sides

### Inlet Thermal Conditions

- **Velocity inlet**: Specify temperature
- **Pressure inlet**: Specify total temperature
- **Mass flow inlet**: Specify total temperature

### Outlet Thermal Conditions

- **Pressure outlet**: Specify backflow total temperature (used if backflow occurs)
- **Outflow**: No temperature specified (zero-gradient condition)

## Step 3: Set Up Conjugate Heat Transfer (CHT)

CHT simulates heat transfer between solid and fluid domains.

### Create Solid and Fluid Zones

1. In the mesh, ensure solid and fluid regions are separate cell zones.
2. In Fluent, go to **Setup** → **Cell Zones** → **Conditions**.
3. For each zone:
   - **Fluid zone**: Set as "Fluid", select material (air, water, etc.)
   - **Solid zone**: Set as "Solid", select material (aluminum, copper, etc.)

### Define the Solid-Fluid Interface

1. Go to **Setup** → **Mesh** → **Interfaces**.
2. If the interface was automatically detected (conformal mesh), verify it exists.
3. If not (non-conformal mesh), create a mesh interface:
   - Select the fluid-side wall
   - Select the solid-side wall
   - Create the interface
4. The interface allows heat transfer between zones without requiring matching meshes.

### Interface Thermal Conditions

At the solid-fluid interface:
- **Heat flux is continuous** — heat leaving the fluid equals heat entering the solid
- **Temperature is continuous** — fluid and solid surface temperatures match
- This is automatically handled by the "Coupled" wall thermal condition

### CHT Material Properties

For solids, define:
- **Thermal conductivity**: W/m-K (may be temperature-dependent)
- **Density**: kg/m³
- **Specific heat**: J/kg-K

For fluids, define:
- **Thermal conductivity**: W/m-K
- **Density**: kg/m³ (may use Boussinesq for natural convection)
- **Specific heat**: J/kg-K
- **Viscosity**: kg/m-s

## Step 4: Set Up Natural Convection

Natural convection requires special setup:

### Enable Gravity

1. Go to **Setup** → **Operating Conditions**.
2. Enable **Gravity**.
3. Set the gravity direction (typically -9.81 m/s² in Z or Y direction).

### Operating Pressure

1. Set **Operating Pressure** to the actual pressure (101325 Pa for atmospheric).
2. For natural convection, operating pressure is critical because density depends on pressure.

### Density Model

Choose one:

1. **Boussinesq Approximation**:
   - Density is constant except in the buoyancy term
   - Good for small temperature differences (ΔT < 20-30 K)
   - Faster convergence
   - Set **Operating Density** to the reference density
   - Set the **Thermal Expansion Coefficient** (β ≈ 1/T for ideal gases)

2. **Full Compressible** (ideal gas):
   - Density varies with temperature and pressure: ρ = P/(RT)
   - Required for large temperature differences
   - Slower convergence
   - More accurate for extreme conditions

### Turbulence Model for Natural Convection

- **k-omega SST**: Good for natural convection with mixed flow
- **RNG k-epsilon**: Good with buoyancy-enhanced production
- Enable **Buoyancy Effects** in the turbulence model settings

### Natural Convection Convergence

Natural convection is inherently unstable. Tips:
1. Use **pseudo-transient** for steady-state simulations
2. Reduce **URF for energy** to 0.5-0.8
3. Set a small **time scale factor** (0.1-0.5) for pseudo-transient
4. Monitor temperature at key points — wait for stabilization
5. May need 2000-5000 iterations for convergence

## Step 5: Solve the Energy Equation

### Energy URF

- **Default**: 1.0 (no under-relaxation)
- **For CHT**: Reduce to 0.8-0.9 if energy residuals oscillate
- **For natural convection**: Reduce to 0.5-0.8

### Energy AMG Settings

Since Fluent 15, the default AMG cycle for energy is **F-cycle**. This improves convergence for diffusion-dominated problems.

If energy residuals are problematic:
1. Go to **Solution** → **Controls** → **Advanced**.
2. For Energy:
   - **Cycle**: F-cycle (default, keep it)
   - **Termination Residual**: 0.01 (tighter than default 0.1)
   - **Max Iterations**: 200 (higher than default 100)

### Energy Residual Target

- **1e-6**: Standard target for most heat transfer problems
- **1e-8**: For high-precision heat transfer (e.g., electronic cooling)
- **Monitor temperature**: Don't rely on residuals alone — monitor actual temperatures

## Step 6: Post-Process Heat Transfer Results

### Temperature Contours

1. Go to **Results** → **Graphics** → **Contours**.
2. Select **Temperature** → **Static Temperature**.
3. Create contours on:
   - **Planes**: Cross-sections through the domain
   - **Surfaces**: Walls, inlets, outlets
   - **Iso-surfaces**: Surfaces of constant temperature

### Heat Flux

1. Go to **Results** → **Surface Integrals**.
2. Select **Wall Fluxes** → **Total Heat Transfer Rate**.
3. Report on specific walls to see heat transfer rates.

### Thermal Resistance

For electronics cooling:
1. Calculate heat transfer rate (Q) through the interface
2. Calculate temperature difference (ΔT) between junction and ambient
3. Thermal resistance R = ΔT / Q

### Nusselt Number

For heat transfer validation:
1. Nu = h × L / k (heat transfer coefficient × characteristic length / thermal conductivity)
2. Compare with empirical correlations (Dittus-Boelter, Gnielinski)

## Common Heat Transfer Problems

### Energy Equation Won't Converge

1. **Check mesh quality** — poor mesh in high-gradient regions causes problems
2. **Reduce energy URF** to 0.5-0.8
3. **Use F-cycle AMG** for energy
4. **Enable pseudo-transient** for steady-state
5. **Check boundary conditions** — non-physical temperatures cause divergence
6. **Verify material properties** — wrong thermal conductivity gives wrong results

### Temperature Results Don't Match Experiment

1. **Check turbulence model** — k-omega SST is better for heat transfer than k-epsilon
2. **Check y+** — y+ < 1 is needed for accurate near-wall temperature gradients
3. **Check boundary conditions** — is the wall temperature/heat flux correct?
4. **Check material properties** — are they temperature-dependent?
5. **Check radiation** — is radiation significant at the operating temperature?

### CHT Interface Temperature Jump

A temperature discontinuity at the solid-fluid interface indicates:
1. **Non-conformal mesh interface** — check mesh interface settings
2. **Wrong wall thermal condition** — interface walls must be "Coupled"
3. **Mesh quality at interface** — poor elements at the interface cause problems

### Natural Convection Won't Converge

1. **Use Boussinesq approximation** for small ΔT
2. **Use pseudo-transient** with small time scale factor
3. **Reduce all URFs** — pressure 0.2, momentum 0.3, energy 0.5
4. **Initialize with a small temperature difference** — don't start with extreme ΔT
5. **Check gravity direction** — wrong gravity direction gives wrong flow direction

## Best Practices

- **Enable energy equation before starting** — forgetting this is the most common mistake
- **Use k-omega SST for heat transfer** — better near-wall accuracy than k-epsilon
- **Target y+ < 1 for heat transfer** — wall functions are inaccurate for temperature gradients
- **Use Coupled wall condition at CHT interfaces** — ensures heat flux continuity
- **Use Boussinesq for small ΔT natural convection** — faster and more stable
- **Use pseudo-transient for natural convection** — dramatically improves stability
- **Monitor temperatures, not just residuals** — residuals can plateau while temperatures still change
- **Check energy balance** — heat in should equal heat out (plus any stored energy)
- **Consider radiation for high temperatures** — above 1000 K, radiation is significant
- **Document thermal BCs** — record all temperature and heat flux values for audit
