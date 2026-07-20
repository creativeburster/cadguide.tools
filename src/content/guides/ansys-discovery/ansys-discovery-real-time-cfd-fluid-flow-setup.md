---
title: "ANSYS Discovery Real-Time CFD: Internal Fluid Flow Simulation Setup"
excerpt: "Guide to setting up internal fluid flow simulation in ANSYS Discovery — covering fluid enclosure creation, boundary conditions, and real-time results interpretation — based on ANSYS official courses."
category: "workflow"
softwareSlug: "ansys-discovery"
keyword: "ansys discovery real-time cfd fluid flow setup"
slug: "ansys-discovery-real-time-cfd-fluid-flow-setup"
author: "CADGuide Tools Editorial Team"
readTime: "8 min read"
date: "2026-07-12"
sources:
  - "https://innovationspace.ansys.com/knowledge/forums/topic/fluid-simulation-in-ansys-discovery-in-depth-tutorial/"
  - "https://innovationspace.ansys.com/courses/courses/fluid-simulation/"
  - "https://innovationspace.ansys.com/knowledge/forums/topic/discovery-live-troubleshooting/"
---

# ANSYS Discovery Real-Time CFD: Internal Fluid Flow Simulation Setup

ANSYS Discovery enables real-time CFD simulation of internal fluid flows — pipe flow, manifold flow, valve flow, and more. The real-time solver provides instant feedback as you modify geometry, allowing rapid design iteration. This guide covers the setup workflow based on ANSYS's official fluid simulation courses and tutorials.

## Prerequisites

- **NVIDIA GPU with 8+ GB VRAM** (required for real-time Explore mode)
- **ANSYS Discovery** installed and licensed
- A 3D model with internal flow passages (imported STEP/Parasolid or native geometry)

## Step 1: Prepare the Geometry

### Import the Model
1. **File → Open** and select the CAD file (STEP, Parasolid, or native format)
2. Verify the geometry is clean — no gaps, no intersecting parts
3. If the model has thin walls, consider thickening them — the real-time solver uses voxel-based meshing, and features smaller than the voxel size may not be captured

### Identify Flow Boundaries
Identify where fluid enters and exits the model:
- **Inlet**: Where fluid enters (pipe entrance, manifold inlet)
- **Outlet**: Where fluid exits (pipe exit, nozzle tip)
- **Walls**: All solid surfaces that contain the fluid

## Step 2: Create the Fluid Enclosure

The fluid enclosure defines the volume that will be simulated as fluid.

1. On the **Prepare** tab, select the **Volume Extract** tool
2. Select the internal faces that define the flow passage
3. Inspire creates a solid volume representing the fluid region
4. Alternatively, use the **Fluid Enclosure** tool:
   - Select the inlet and outlet faces
   - Discovery automatically detects the internal volume
   - The enclosure appears as a separate part in the model tree

### Common Issue: Fluid Flowing Through Solid Walls
If the ANSYS Knowledge troubleshooting guide identifies this issue, it means the fluid enclosure is not properly sealed. Fixes:
- Ensure all openings except inlet and outlet are capped
- Thicken thin walls so the solver can resolve them
- Reduce the simulation bounds to exclude problematic areas
- Increase the fidelity setting

## Step 3: Set Up the Simulation

### Switch to Explore Mode
1. Click the **Explore** tab
2. Select **Fluid Flow** as the simulation type

### Define the Fluid Material
1. Click **Fluid Material**
2. Select from the material library:
   - **Water**: For hydraulic systems
   - **Air**: For HVAC, aerodynamics
   - **Custom**: Define density and viscosity

### Apply Boundary Conditions

#### Inlet
1. Click **Inlet**
2. Select the inlet face on the model
3. Specify the inlet condition:
   - **Velocity**: Fixed velocity (m/s) — most common for internal flow
   - **Mass Flow**: Fixed mass flow rate (kg/s)
   - **Pressure**: Fixed inlet pressure (Pa)
   - **Total Pressure**: For compressible flows

#### Outlet
1. Click **Outlet**
2. Select the outlet face
3. Specify the outlet condition:
   - **Pressure**: Fixed static pressure (typically 0 Pa gauge for atmospheric outlet)
   - **Mass Flow**: For matched flow systems

#### Walls
- Walls are automatically detected from the geometry
- No additional setup needed for standard no-slip walls

### Additional Conditions
- **Temperature**: If thermal effects are important, specify inlet temperature
- **Gravity**: Enable if buoyancy effects matter (natural convection)
- **Rotation**: For rotating machinery (pumps, turbines), add rotational conditions

## Step 4: Configure Simulation Settings

1. Click **Settings** in the simulation panel
2. Key settings:
   - **Fidelity**: Low / Medium / High — higher fidelity captures finer features but requires more GPU memory
   - **Show flow trajectories**: Enable to visualize streamlines
   - **Show contours**: Enable to see pressure/velocity contours on surfaces

## Step 5: Run the Real-Time Simulation

1. Click **Play** to start the real-time simulation
2. The solver runs on the GPU and updates results in real-time
3. Results appear within seconds (not minutes or hours like traditional CFD)
4. As you modify the geometry (move faces, change dimensions), results update automatically

### Interpreting Results

#### Flow Trajectories (Streamlines)
- Show the path fluid particles take through the model
- Color-coded by velocity, pressure, or other variables
- Look for:
  - **Recirculation zones**: Where flow reverses (indicates poor design)
  - **Stagnation areas**: Where flow is nearly zero (can cause heat buildup)
  - **High-velocity regions**: May indicate restrictions or noise

#### Surface Contours
- Pressure distribution on walls
- Velocity magnitude on cross-sections
- Temperature distribution (if thermal is enabled)

#### Quantitative Results
- **Flow rate**: Verify the actual flow rate matches the design intent
- **Pressure drop**: Check the pressure difference between inlet and outlet
- **Maximum velocity**: Identify the fastest flow region

## Step 6: Iterate on the Design

The key advantage of Discovery's real-time CFD is rapid iteration:

1. **Modify the geometry**: Use direct editing tools to change dimensions, add fillets, modify passages
2. **Watch results update**: The simulation updates automatically as geometry changes
3. **Compare scenarios**: Save different design variants and compare results
4. **Optimize**: Adjust geometry to minimize pressure drop, eliminate recirculation, or achieve target flow rates

## Step 7: Transition to Refine Mode (High-Fidelity)

When the design is ready for validation:

1. Switch from **Explore** to **Refine** mode
2. The Refine mode uses CPU-based ANSYS Fluent solver
3. Configure mesh settings:
   - **Mesh size**: Finer than Explore mode
   - **Inflation layers**: Add boundary layer mesh for accurate wall treatment
4. Set convergence criteria
5. Run the high-fidelity simulation (takes minutes to hours, not real-time)
6. Compare Refine results with Explore results to validate the design

## Common Issues and Fixes

### Issue: Simulation Doesn't Start
- Check GPU memory: 8 GB recommended
- Reduce model complexity
- Reduce simulation bounds
- Run the Discovery Compatibility Utility

### Issue: Results Don't Look Realistic
- Increase fidelity setting
- Ensure boundary conditions are correct (check units, magnitudes)
- Verify the fluid enclosure is properly defined
- Check for leaks in the flow passage (gaps in geometry)

### Issue: Features Missing from Results
- The voxel size may be too large to capture small features
- Thicken walls or increase fidelity
- Reduce simulation bounds to focus on the area of interest

## Best Practices

1. **Start simple**: Begin with a coarse model and low fidelity to verify the setup, then increase fidelity
2. **One change at a time**: When iterating, change one parameter at a time to understand its effect
3. **Save scenarios**: Save each design variant as a scenario for comparison
4. **Validate with Refine mode**: Always validate the final design with high-fidelity Refine mode before production
5. **Check units**: Ensure all boundary conditions use the correct units (SI by default)
