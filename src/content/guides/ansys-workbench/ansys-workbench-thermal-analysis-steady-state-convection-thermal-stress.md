---
title: "ANSYS Workbench Thermal Analysis: Steady-State Heat Transfer, Convection, and Thermal Stress"
excerpt: "ANSYS Workbench's thermal analysis tools calculate temperature distribution and heat flux in components. We cover steady-state thermal setup, convection and radiation boundary conditions, thermal contact, coupled thermal-structural analysis, and result interpretation."
category: "workflow"
softwareSlug: "ansys-workbench"
keyword: "ANSYS Workbench thermal analysis steady-state heat transfer convection radiation thermal stress coupled structural temperature"
slug: "ansys-workbench-thermal-analysis-steady-state-convection-thermal-stress"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-29"
sources:
  - "https://ansyshelp.ansys.com/account/secured?returnurl=/Views/Secured/corp/v242/en/wb_wb/wb_wb.html"
  - "https://ansyshelp.ansys.com/public/Views/Secured/corp/v252/en/wb_sim/ds_static_mechanical_analysis_type.html"

---

# ANSYS Workbench Thermal Analysis: Steady-State Heat Transfer, Convection, and Thermal Stress

We've run thermal analyses in ANSYS for electronics cooling, engine components, heat exchangers, and building thermal performance. Thermal analysis is critical for any product that generates or is exposed to heat — from circuit boards to turbine blades. ANSYS Workbench provides both steady-state and transient thermal analysis, with the ability to couple thermal results to structural analysis for thermal stress evaluation.

## Thermal Analysis Overview

ANSYS Workbench thermal analysis types:
- **Steady-State Thermal**: Temperature distribution at equilibrium (no time dependence)
- **Transient Thermal**: Temperature changes over time
- **Thermal-Electric**: Joule heating from electrical current
- **Coupled Thermal-Structural**: Thermal expansion stress

## Steady-State Thermal Setup

### Creating a Steady-State Thermal System

1. In Workbench, drag **Steady-State Thermal** from the Toolbox
2. The system appears with cells:
   - **Engineering Data**: Materials with thermal properties
   - **Geometry**: CAD model
   - **Model**: Mesh and boundary conditions
   - **Solution**: Results

### Material Thermal Properties

1. Double-click **Engineering Data**
2. For thermal analysis, each material needs:
   - **Thermal conductivity (k)**: Heat conduction rate (W/m·K)
     - Aluminum: 150-230 W/m·K
     - Steel: 50 W/m·K
     - Copper: 400 W/m·K
     - Air: 0.026 W/m·K
     - Plastic: 0.1-0.5 W/m·K
   - **Density (ρ)**: Mass per volume (kg/m³)
   - **Specific heat (cp)**: Heat capacity (J/kg·K)
     - Aluminum: 900 J/kg·K
     - Steel: 460 J/kg·K
     - Copper: 385 J/kg·K
3. For coupled thermal-structural, also need:
   - **Coefficient of thermal expansion (α)**: Expansion per degree (1/K or 1/°C)
     - Aluminum: 23×10⁻⁶ /K
     - Steel: 12×10⁻⁶ /K
     - Copper: 17×10⁻⁶ /K

### Mesh Setup

1. Double-click the **Model** cell
2. Generate the mesh
3. Thermal mesh considerations:
   - **Through-thickness**: For thin walls, use at least 3 elements through the thickness
   - **High gradient areas**: Refine mesh near heat sources and boundaries
   - **Contact interfaces**: Refine mesh at thermal contact interfaces
   - **Inflation layers**: Use for convection boundaries (steep temperature gradient near surface)

## Thermal Boundary Conditions

### Temperature

1. Right-click **Steady-State Thermal** → **Insert** → **Temperature**
2. Select a face, edge, or body
3. Set the temperature value (°C or K)
4. Use for:
   - Known surface temperatures (e.g., 100°C hot face)
   - Fixed temperature boundaries (e.g., cooling water at 20°C)
   - Ambient temperature on a face

### Heat Flux

1. Right-click → **Insert** → **Heat Flux**
2. Select a face
3. Set the heat flux value (W/m²)
4. Use for:
   - Applied heat input (e.g., solar radiation, heating element)
   - Known heat flux boundary

### Heat Flow (Total Heat)

1. Right-click → **Insert** → **Heat Flow**
2. Select a face, edge, or vertex
3. Set the total heat flow (W)
4. Use for:
   - Total power input (e.g., 100W chip)
   - Total heat generation at a point

### Internal Heat Generation

1. Right-click → **Insert** → **Internal Heat Generation**
2. Select a body
3. Set the volumetric heat generation (W/m³)
4. Use for:
   - Volumetric heating (e.g., electrical heating, nuclear heating)
   - Heat generation in a solid (e.g., chip power / chip volume)

### Convection

1. Right-click → **Insert** → **Convection**
2. Select a face
3. Set the convection coefficient (film coefficient):
   - **Natural convection (air)**: 5-25 W/m²·K
   - **Forced convection (air)**: 25-250 W/m²·K
   - **Natural convection (water)**: 50-500 W/m²·K
   - **Forced convection (water)**: 500-10000 W/m²·K
4. Set the ambient temperature (bulk fluid temperature)
5. Or use a convection correlation:
   - **Stagnant air (horizontal plate)**: Automatic calculation
   - **Stagnant air (vertical plate)**: Automatic calculation
   - **Forced convection (flat plate)**: Requires flow parameters
6. Use for: All surfaces exposed to fluid (air, water, oil)

### Radiation

1. Right-click → **Insert** → **Radiation**
2. Select a face
3. Set:
   - **Emissivity (ε)**: 0-1 (0 = perfect reflector, 1 = perfect emitter)
     - Polished metal: 0.05-0.2
     - Oxidized metal: 0.3-0.6
     - Painted surface: 0.8-0.95
     - Black body: 1.0
   - **Ambient temperature**: Surrounding temperature for radiation exchange
   - **View factor**: Optional (for enclosure radiation)
4. Use for:
   - High-temperature surfaces where radiation is significant
   - Vacuum environments (no convection, only radiation)
   - Surfaces facing the sky or a furnace

### Thermal Contact

1. In the **Connections** branch, thermal contact is automatically created
2. Set thermal contact conductance:
   - **Perfect contact**: High conductance (no thermal resistance)
   - **Realistic contact**: Depends on surface roughness, pressure, and interface material
   - **Interface material**: Thermal paste, gap pad, or air gap
3. For bonded contact (default): Thermal conductance is high (perfect thermal contact)
4. For non-bonded contact: Specify thermal conductance manually

## Solving and Results

### Running the Analysis

1. Right-click **Solution** → **Solve**
2. Steady-state thermal analysis is typically fast
3. Results show the equilibrium temperature distribution

### Temperature Distribution

1. Right-click **Solution** → **Insert** → **Temperature**
2. The temperature field is displayed:
   - **Color contour**: Red = hot, blue = cold
   - **Min/Max**: Minimum and maximum temperatures
   - **Probe**: Click any point to see the local temperature
3. Check:
   - **Maximum temperature**: Is it within material limits?
   - **Temperature gradient**: Are gradients too steep (thermal stress risk)?
   - **Hot spots**: Localized high-temperature areas

### Heat Flux

1. Right-click → **Insert** → **Total Heat Flux**
2. The heat flux vector is displayed:
   - **Magnitude**: Heat flow per unit area (W/m²)
   - **Direction**: Heat flows from hot to cold
3. Check:
   - **Maximum heat flux**: Where is heat flowing most intensely?
   - **Heat flow paths**: Is heat flowing as expected?
   - **Bottlenecks**: Areas where heat flux is concentrated (thin sections, interfaces)

### Directional Heat Flux

1. Right-click → **Insert** → **Directional Heat Flux**
2. Set the direction (X, Y, or Z)
3. Shows heat flux in a specific direction
4. Use for: Verifying heat flow direction through a specific section

### Thermal Probe

1. Right-click a result → **Probe**
2. Select a face, edge, or vertex
3. The temperature or heat flux at that location is displayed
4. Use for: Checking specific points (e.g., maximum chip temperature)

## Coupled Thermal-Structural Analysis

### Setting Up Coupled Analysis

1. In Workbench, drag **Static Structural** from the Toolbox
2. Link the **Solution** of the Steady-State Thermal to the **Setup** of the Static Structural
3. This imports the temperature field as a load in the structural analysis
4. The thermal expansion creates stress

### Structural Setup

1. Double-click the **Model** cell of the Static Structural
2. The imported temperature appears as a **Imported Temperature** load
3. Add structural boundary conditions:
   - **Fixed support**: Where the part is constrained
   - **Displacement**: If partially constrained
4. Add other loads if needed (force, pressure, gravity)
5. The total stress = mechanical stress + thermal stress

### Thermal Stress Results

1. Solve the structural analysis
2. Check:
   - **Von Mises stress**: Total stress including thermal
   - **Thermal stress component**: Stress due to temperature gradients
   - **Displacement**: Thermal expansion displacement
3. Common thermal stress issues:
   - **Bimetallic stress**: Different materials expand at different rates
   - **Hot spot stress**: Localized high temperature causes local stress
   - **Constraint stress**: Fixed boundaries prevent expansion, causing compressive stress
   - **Gradient stress**: Steep temperature gradients cause differential expansion stress

## Transient Thermal Analysis

### Setting Up Transient Analysis

1. Drag **Transient Thermal** from the Toolbox
2. Set up materials and mesh (same as steady-state)
3. In **Analysis Settings**:
   - **Step controls**: Number of steps, step end time
   - **Time integration**: On
   - **Initial temperature**: Starting temperature (e.g., 20°C ambient)
4. Apply time-varying boundary conditions:
   - **Tabular data**: Vary temperature, heat flux, or convection over time
   - **Multi-step**: Different conditions in different time steps
5. Solve

### Transient Results

1. Results show temperature at each time step
2. Animate the temperature evolution:
   - Right-click → **Animate**
   - Watch heat propagate through the structure
3. Check:
   - **Time to steady state**: How long to reach equilibrium?
   - **Maximum temperature over time**: When does the peak occur?
   - **Thermal lag**: How long does heat take to reach a specific point?

## Common Issues

### Temperature Results Are Unreasonably High

- Check heat input values (W vs kW vs MW)
- Verify convection coefficients (too low = high temperature)
- Ensure all heat-dissipating surfaces have convection applied
- Check material thermal conductivity (too low = high temperature)
- Verify the model includes all heat removal paths

### Temperature Results Are Unreasonably Low

- Check if heat sources are applied correctly
- Verify the heat flow direction (heat should flow from source to sink)
- Check for missing thermal contact resistance
- Ensure convection is not too high (overcooling)

### Thermal Stress Is Too High

- Check the coefficient of thermal expansion
- Verify the reference (stress-free) temperature
- Look for constraint points that prevent expansion
- Consider adding expansion joints or flexible mounts
- Reduce the temperature gradient (improve heat distribution)

### Convergence Issues in Transient

- Reduce the time step size
- Check for sudden changes in boundary conditions
- Verify the initial temperature is set correctly
- Increase the number of substeps

## Summary

ANSYS Workbench's thermal analysis calculates temperature distribution and heat flux for engineering components. Set up steady-state thermal with correct material properties (conductivity, density, specific heat). Apply thermal boundary conditions: temperature (known surfaces), heat flux (applied heat), heat flow (total power), internal heat generation (volumetric), convection (fluid cooling, 5-10000 W/m²·K), and radiation (high-temperature surfaces). Check temperature distribution for maximum temperature and gradients. Couple thermal to structural analysis by linking the thermal solution to a static structural setup — the temperature field becomes a load that creates thermal stress. For time-dependent analysis, use transient thermal with time-varying boundary conditions. The most common issues — unreasonable temperatures and high thermal stress — are addressed by checking heat input values, convection coefficients, material properties, and constraint points. Thermal analysis is essential for any product with heat generation or thermal exposure.
