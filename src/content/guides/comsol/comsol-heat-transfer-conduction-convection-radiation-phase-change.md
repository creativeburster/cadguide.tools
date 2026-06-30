---
title: "COMSOL Heat Transfer: Conduction, Convection, Radiation, and Phase Change"
excerpt: "A guide to heat transfer analysis in COMSOL covering conductive heat transfer, convective cooling with fluid flow coupling, radiation exchange between surfaces, phase change modeling with enthalpy method, and thermal management for electronics."
category: "workflow"
softwareSlug: "comsol"
keyword: "comsol heat transfer analysis"
slug: "comsol-heat-transfer-conduction-convection-radiation-phase-change"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.comsol.com/heat-transfer-module"
  - "https://doc.comsol.com/"
---

# COMSOL Heat Transfer: Conduction, Convection, Radiation, and Phase Change

COMSOL's Heat Transfer Module provides comprehensive thermal simulation — conduction in solids, convection with fluid coupling, radiation between surfaces, and phase change (melting/solidification). This guide covers the complete heat transfer workflow.

## Heat Transfer Modes

### Conduction

1. Add Physics > Heat Transfer > Heat Transfer in Solids
2. Governing equation:
   - ρ × Cp × ∂T/∂t = ∇·(k∇T) + Q
   - k: Thermal conductivity (W/m·K)
   - ρ: Density (kg/m³)
   - Cp: Specific heat (J/kg·K)
   - Q: Volumetric heat source (W/m³)
3. Material properties:

| Material | k (W/m·K) | ρ (kg/m³) | Cp (J/kg·K) |
|----------|-----------|-----------|-------------|
| Aluminum | 167 | 2700 | 896 |
| Copper | 386 | 8960 | 385 |
| Steel | 51.9 | 7870 | 486 |
| Stainless 304 | 16.2 | 8000 | 500 |
| Silicon | 149 | 2329 | 700 |
| FR4 | 0.3 | 1850 | 1300 |
| Air | 0.026 | 1.225 | 1005 |
| Water | 0.6 | 998 | 4182 |
| Glass | 1.0 | 2500 | 840 |

### Convection

1. **Forced convection**: Couple with CFD (fluid flow)
   - Add Multiphysics > Heat Transfer in Flow
   - Fluid carries heat: ρ × Cp × u · ∇T
2. **Natural convection**: Buoyancy-driven flow
   - Add Multiphysics > Nonisothermal Flow
   - Boussinesq approximation: ρ = ρ₀(1 - β(T - T₀))
   - β: Thermal expansion coefficient
3. **External convection (simplified)**: No CFD needed
   - Boundary condition: h × (T - T_amb)
   - h: Heat transfer coefficient (W/m²·K)

### Radiation

1. Add Physics > Heat Transfer > Radiation in Participating Media (for absorbing media) or Surface-to-Surface Radiation (for opaque surfaces)
2. Surface-to-surface radiation:
   - **Emissivity**: ε (0 to 1)
   - **Ambient temperature**: T_amb
   - **View factors**: Automatically calculated by COMSOL
3. Stefan-Boltzmann law:
   - qrad = ε × σ × (T⁴ - T_amb⁴)
   - σ = 5.67×10⁻⁸ W/m²·K⁴

#### Typical Emissivities

| Surface | Emissivity |
|---------|-----------|
| Polished aluminum | 0.05 |
| Anodized aluminum | 0.85 |
| Oxidized steel | 0.80 |
| Painted surface | 0.90 |
| Black body | 1.00 |
| Glass | 0.92 |

4. For high temperatures (> 300°C): Radiation is significant
5. For low temperatures (< 100°C): Natural convection usually dominates

## Boundary Conditions

### Temperature (Dirichlet)

1. Boundary condition: T = specified value
2. Use for: Known temperature surface (e.g., cooling water at 20°C)

### Heat Flux (Neumann)

1. Boundary condition: -n·(-k∇T) = q0
2. q0: Specified heat flux (W/m²)
3. Use for: Known heat input (e.g., solar radiation, laser heating)

### Convective Cooling (Robin)

1. Boundary condition: -n·(-k∇T) = h × (T - T_amb)
2. h: Heat transfer coefficient (W/m²·K)
3. T_amb: Ambient temperature

#### Typical Heat Transfer Coefficients

| Condition | h (W/m²·K) |
|-----------|-----------|
| Natural convection (air) | 5-25 |
| Forced convection (air, fan) | 25-250 |
| Natural convection (water) | 50-1000 |
| Forced convection (water) | 500-10000 |
| Boiling water | 2500-50000 |
| Condensation | 5000-100000 |
| Heat pipe | 5000-200000 |

### Thermal Insulation

1. Boundary condition: -n·(-k∇T) = 0
2. No heat transfer across boundary
3. Default for external boundaries (can be changed)

### Periodic Boundary

1. For repeating geometries (heat exchanger channels)
2. Source and destination boundaries paired
3. Temperature pattern repeats

## Heat Sources

### Volumetric Heat Source

1. Domain setting: Q (W/m³)
2. Applications:
   - **Electronic component**: CPU = 95W / volume
   - **Joule heating**: Q = J²/σ (from electric currents)
   - **Induction heating**: Q = Peddy (from magnetic fields)
   - **Chemical reaction**: Q = ΔH × reaction rate

### Boundary Heat Source

1. Boundary setting: qs (W/m²)
2. Applications:
   - **Laser heating**: Laser flux on surface
   - **Friction heating**: Sliding contact
   - **Solar radiation**: Heat flux from sun

### Point Heat Source

1. Point setting: Qp (W)
2. Applications:
   - **Hot spot**: Localized heat generation
   - **Wire connection**: Resistance heating at contact

## Phase Change (Melting/Solidification)

### Enthalpy Method

1. Add Physics > Heat Transfer > Heat Transfer in Solids and Fluids
2. Enable phase change:
   - Material > Phase Change Material
3. Set:
   - **Phase change temperature**: Tm (e.g., 0°C for ice, 232°C for solder)
   - **Latent heat**: L (J/kg)
   - **Transition interval**: ΔT (e.g., 1-5K, for numerical stability)
4. COMSOL uses apparent heat capacity:
   - Cp,apparent = Cp + L / ΔT (within transition interval)
   - Smooth transition from solid to liquid

### Material Properties (Phase Change)

1. Define properties for each phase:
   - **Solid**: k_s, ρ_s, Cp_s
   - **Liquid**: k_l, ρ_l, Cp_l
2. COMSOL interpolates within transition interval
3. For natural convection in melt:
   - Add Nonisothermal Flow multiphysics
   - Liquid phase flows, solid phase is stationary

### Applications

- **PCM thermal storage**: Melting stores heat, solidification releases
- **Solder melting**: Reflow soldering profile
- **Metal casting**: Solidification and shrinkage
- **Ice melting**: Phase change for cold storage
- **Freeze drying**: Sublimation (solid to gas)

## Thermal Contact Resistance

### Setup

1. At contact interface between two solids:
   - Boundary condition: Thermal Contact Resistance
2. Set:
   - **Contact conductance**: hc (W/m²·K)
   - Typical values:
     - **Perfect contact**: hc = 10⁶ W/m²·K
     - **Dry contact (metal-metal)**: 1000-10000 W/m²·K
     - **With TIM (thermal interface material)**: 5000-50000 W/m²·K
     - **Air gap**: 5-25 W/m²·K

### Thermal Interface Materials

| TIM Type | Conductivity (W/m·K) | Thickness (mm) |
|----------|---------------------|----------------|
| Thermal grease | 1-3 | 0.05-0.1 |
| Thermal pad | 1-6 | 0.5-1.0 |
| Phase change material | 0.5-2 | 0.05-0.1 |
| Solder (TIM) | 50-58 | 0.1-0.2 |
| Silver epoxy | 10-50 | 0.05-0.1 |

## Electronics Thermal Management

### PCB Thermal Analysis

1. Geometry:
   - PCB (FR4): 1.6mm thick
   - Copper traces: 35μm thick
   - Components: Silicon die, mold compound, solder
2. Materials:
   - **FR4**: k = 0.3 W/m·K (in-plane: 0.8 with copper)
   - **Copper**: k = 386 W/m·K
   - **Silicon**: k = 149 W/m·K
   - **Solder (SAC305)**: k = 58 W/m·K
3. Heat sources:
   - **CPU**: 95W (0.5W/mm² for 14mm die)
   - **GPU**: 150W
   - **Memory**: 10W per module
4. Cooling:
   - **Natural convection**: h = 10 W/m²·K
   - **Forced convection (fan)**: h = 50 W/m²·K
   - **Heat sink**: Add fins (aluminum, k = 167)
5. Results:
   - **Junction temperature**: Tj < 100°C (typical limit)
   - **Case temperature**: Tc < 85°C
   - **PCB temperature**: < 105°C (Tg of FR4)
   - **Thermal resistance**: Rth = (Tj - T_amb) / P (K/W)

### Heat Sink Design

1. Geometry:
   - **Base**: 50×50×5mm aluminum
   - **Fins**: 20 fins, 50mm tall, 1.5mm thick, 2mm spacing
2. Cooling:
   - **Forced air**: 5 m/s flow rate
   - h = 50-100 W/m²·K (from CFD or empirical)
3. Optimization:
   - **Fin count**: More = more area, but less flow between fins
   - **Fin height**: Taller = more area, but less efficient at tip
   - **Fin thickness**: Thicker = more conduction, but less flow area
4. Target: Rth < 0.5 K/W for CPU cooling

## Transient Thermal Analysis

### Setup

1. Study > Time Dependent
2. Set:
   - **Time range**: range(0, Δt, T_end)
   - **Time step**: Based on Fourier number
3. Fourier number: Fo = α × Δt / L²
   - α = k / (ρ × Cp) (thermal diffusivity)
   - L: Characteristic length (element size)
   - Fo < 0.5 for stability (implicit: no strict limit, but for accuracy)

### Thermal Cycle

1. For electronics reliability:
   - **Power cycling**: On/off cycles
   - **Ambient cycling**: Temperature swings
2. Set heat source as function of time:
   - t=0-3600s: Q = 95W (on)
   - t=3600-7200s: Q = 0W (off)
   - Repeat for N cycles
3. Results:
   - **Temperature history**: At junction, case, board
   - **Thermal time constant**: τ = Rth × Cth (first-order response)
   - **Steady-state**: After 3-5 time constants

## Post-Processing

### Temperature Distribution

1. **Surface plot**: Color contour on 3D geometry
2. **Slice plot**: 2D cross-section
3. **Isosurface**: 3D surface at specific temperature
4. **Maximum temperature**: Global evaluation

### Heat Flux

1. **Arrow plot**: Direction of heat flow
2. **Magnitude**: |q| = k × |∇T|
3. **Through boundary**: ∫(-k∇T)·n dA (total heat flow in W)

### Thermal Resistance

1. Rth = (T_hot - T_cold) / Q
2. Evaluate at specific points:
   - **Junction-to-ambient**: Rth_ja = (Tj - T_amb) / P
   - **Junction-to-case**: Rth_jc = (Tj - Tc) / P
   - **Case-to-ambient**: Rth_ca = (Tc - T_amb) / P

## Verification Checklist

- [ ] Material thermal properties are correct (k, ρ, Cp)
- [ ] All boundary surfaces have appropriate thermal conditions
- [ ] Heat sources match actual power dissipation
- [ ] Heat transfer coefficients are realistic for the flow condition
- [ ] Radiation is included for high-temperature surfaces
- [ ] Thermal contact resistance is specified at interfaces
- [ ] Mesh is refined near heat sources and temperature gradients
- [ ] Transient time step satisfies Fourier number criterion
- [ ] Steady-state results are independent of initial conditions
- [ ] Temperature results are physically reasonable

## Conclusion

COMSOL's Heat Transfer Module provides comprehensive thermal simulation: conduction in solids with temperature-dependent properties, convection coupled with CFD, surface-to-surface radiation with automatic view factors, phase change with enthalpy method, and thermal contact resistance at interfaces. The key advantage is native multiphysics coupling — heat transfer couples seamlessly with fluid flow, electromagnetics, and structural mechanics. The key to reliable thermal analysis is accurate material properties (especially anisotropic PCB conductivity), realistic boundary conditions (heat transfer coefficients and emissivity), proper thermal contact modeling, and mesh refinement near heat sources. By following this workflow, engineers can predict temperatures, design cooling solutions, and evaluate thermal management for electronics, heat exchangers, and phase change applications.
