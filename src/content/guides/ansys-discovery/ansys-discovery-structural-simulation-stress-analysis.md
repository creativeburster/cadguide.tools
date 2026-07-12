---
title: "ANSYS Discovery Structural Simulation: Real-Time Stress Analysis Setup"
excerpt: "Guide to setting up structural stress analysis in ANSYS Discovery — applying loads, constraints, and material properties, with real-time stress visualization — based on ANSYS official courses."
category: "workflow"
softwareSlug: "ansys-discovery"
keyword: "ansys discovery structural simulation stress analysis setup"
slug: "ansys-discovery-structural-simulation-stress-analysis"
author: "CADGuide Technical Editorial"
readTime: "8 min read"
date: "2026-07-12"
sources:
  - "https://innovationspace.ansys.com/knowledge/forums/topic/in-depth-structures/"
  - "https://innovationspace.ansys.com/product/structural-simulation-using-ansys-discovery/"
  - "https://innovationspace.ansys.com/courses/courses/structural-simulation-using-ansys-discovery/"
---

# ANSYS Discovery Structural Simulation: Real-Time Stress Analysis Setup

ANSYS Discovery provides real-time structural simulation that updates stress and displacement results instantly as you modify geometry or loads. This guide covers the complete setup workflow based on ANSYS's official structural simulation courses.

## Step 1: Prepare the Model

### Import Geometry
1. **File → Open** and select the CAD file (STEP, Parasolid, or native)
2. Verify the geometry is clean — no gaps, no floating faces
3. Simplify the model if needed:
   - Remove cosmetic features (logos, text)
   - Suppress small fillets that don't affect structural behavior
   - Use symmetry if the model and loads are symmetric (reduces computation)

### Assign Material
1. On the **Structure** tab, click **Material**
2. Select from the material library:
   - **Steel**: Common structural material
   - **Aluminum**: Lightweight applications
   - **Titanium**: Aerospace and medical
   - **Custom**: Define Young's modulus, Poisson's ratio, density, and yield strength
3. Assign the material to each part in the assembly

## Step 2: Set Up the Structural Simulation

### Switch to Explore Mode
1. Click the **Explore** tab
2. Select **Structural** as the simulation type

### Apply Constraints (Fixtures)
1. Click **Fixed** (or appropriate constraint type)
2. Select the faces/edges to constrain:
   - **Fixed**: No movement in any direction (e.g., mounting bolt holes)
   - **Displacement**: Allow movement in specific directions with specified limits
   - **Cylindrical**: For bearing supports (radial fixed, axial free)
3. Apply constraints to all mounting interfaces

### Apply Loads
1. Click **Force** (or appropriate load type)
2. Select the face/edge where the load is applied
3. Specify magnitude and direction:
   - **Force**: Applied force in N (specify direction vector or select a face for normal direction)
   - **Pressure**: Distributed load in Pa (force per area)
   - **Moment**: Applied torque in N·m
   - **Remote Force**: Force applied at a point not on the model (e.g., load at end of a lever arm)
   - **Acceleration**: Body load (e.g., gravity, inertial loads)
   - **Temperature**: For thermal stress analysis

4. For multiple load cases:
   - Create separate load cases for different operating conditions
   - Each load case can have different combinations of loads and constraints

### Additional Structural Analysis Types

#### Modal Analysis
1. Select **Modal** as the analysis type
2. Specify the number of modes to calculate
3. Results show natural frequencies and mode shapes
4. Use to identify resonance risks

#### Thermal Stress Analysis
1. Select **Thermal** as the analysis type
2. Apply temperature conditions (fixed temperature, heat flux, convection)
3. The solver calculates temperature distribution
4. Thermal expansion creates stresses — results show combined thermal + mechanical stress

#### Prestressed Modal
1. First run a static structural analysis
2. Then run modal analysis using the prestressed state
3. This accounts for stress stiffening (e.g., a tensioned cable has different natural frequencies than a slack one)

## Step 3: Configure Simulation Settings

1. Click **Settings** in the simulation panel
2. Key settings:
   - **Fidelity**: Low / Medium / High
   - **Solver**: GPU (Explore mode, real-time) or CPU (Refine mode, high-fidelity)
   - **Results display**: Select which results to show (stress, displacement, strain, factor of safety)

## Step 4: Run the Real-Time Simulation

1. Click **Play** to start the simulation
2. Results update in real-time as the solver runs on the GPU
3. Initial results appear within seconds
4. The solver continues to refine results over time — wait for convergence

### Interpreting Results

#### Stress (von Mises)
- **Color scale**: Blue (low stress) → Red (high stress)
- **Compare to yield strength**: Check if maximum stress exceeds the material's yield strength
- **Factor of Safety**: Discovery can display the factor of safety based on yield strength
- **Red regions**: Indicate high stress — potential failure points

#### Displacement
- Shows how much the part deforms under load
- **Exaggerated display**: Displacement is typically scaled up for visibility
- Check that displacements are within acceptable limits for your application

#### Strain
- Shows where the material is being stretched or compressed most
- Useful for identifying stress concentrations

## Step 5: Iterate on the Design

1. **Modify geometry**: Use direct editing to change dimensions, add material in high-stress areas, remove material in low-stress areas
2. **Watch results update**: Stress distribution updates in real-time
3. **Optimize**: 
   - Add fillets at sharp corners to reduce stress concentrations
   - Increase wall thickness in high-stress regions
   - Add ribs or stiffeners where needed
   - Remove material from low-stress areas to reduce weight

## Step 6: Validate with Refine Mode

1. Switch from **Explore** to **Refine** mode
2. The Refine mode uses the CPU-based ANSYS Mechanical solver
3. Configure mesh:
   - **Element size**: Finer than Explore mode
   - **Refinement**: Add mesh refinement at stress concentrations
4. Run the high-fidelity simulation
5. Compare results with Explore mode to validate

## Common Issues

### Issue: Stress Results Show Very High Values at Point Loads
- Point loads create singularities (theoretically infinite stress at a point)
- Distribute the load over a small area instead of a single point
- Use a **Remote Force** with a small contact area

### Issue: Displacement Seems Unrealistic
- Check that all constraints are properly applied
- Verify the material properties (especially Young's modulus)
- Ensure the load magnitude and direction are correct
- Check units (SI by default: N, m, Pa)

### Issue: Simulation Doesn't Start
- Check GPU compatibility (see our [GPU troubleshooting guide](/guides/ansys-discovery-gpu-cuda-requirements-troubleshooting))
- Reduce model complexity
- Increase fidelity setting

## Analysis Types Summary

| Analysis Type | What It Shows | Common Use |
|---|---|---|
| Static Structural | Stress, displacement, strain | Bracket design, housing analysis |
| Modal | Natural frequencies, mode shapes | Vibration analysis, resonance avoidance |
| Thermal | Temperature distribution | Heat sinks, thermal management |
| Thermal Stress | Combined thermal + mechanical stress | Engines, electronics cooling |
| Prestressed Modal | Frequencies under load | Tensioned structures, rotating equipment |

## Best Practices

1. **Start with coarse fidelity**: Verify setup before running high-fidelity
2. **Use symmetry**: If model and loads are symmetric, cut the model in half — reduces computation by 50%
3. **Apply realistic constraints**: Over-constraining produces artificially low stress; under-constraining produces rigid body motion
4. **Check reaction forces**: The sum of reaction forces should equal the applied loads — if not, something is wrong
5. **Validate with Refine mode**: Always validate the final design with high-fidelity simulation before production
