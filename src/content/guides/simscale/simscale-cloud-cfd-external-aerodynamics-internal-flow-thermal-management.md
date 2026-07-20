---
title: "SimScale Cloud CFD: External Aerodynamics, Internal Flow, and Thermal Management"
excerpt: "A guide to cloud-based CFD analysis in SimScale covering external aerodynamics (drag, lift), internal flow (pipes, valves, HVAC), conjugate heat transfer, turbulence modeling, and leveraging cloud computing for simulation without local hardware."
category: "workflow"
softwareSlug: "simscale"
keyword: "simscale cloud cfd analysis"
slug: "simscale-cloud-cfd-external-aerodynamics-internal-flow-thermal-management"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://docs.simscale.com/"
  - "https://www.simscale.com/physics/cfd/"

---

# SimScale Cloud CFD: External Aerodynamics, Internal Flow, and Thermal Management

I started using SimScale about three years ago when I didn't have access to a workstation and needed to run a CFD analysis on a heat sink. The fact that I could do it from my laptop in a coffee shop felt almost too good to be true. It's not a replacement for Fluent or CFX in every scenario, but for a lot of common CFD problems, it gets the job done. Let me walk you through how I use it.

## Cloud CFD Advantages

### No Local Hardware

1. **No workstation needed**: Run simulations from any laptop
2. **No software installation**: Web browser access
3. **Cloud HPC**: Up to 96 cores per simulation
4. **No IT maintenance**: No license servers, no updates
5. **Pay per use**: No annual license commitment

### Workflow

1. **Import CAD**: Upload STEP, IGES, or native CAD
2. **Mesh**: Automatic or manual meshing on cloud
3. **Setup**: Define physics, boundary conditions in browser
4. **Solve**: Run on cloud HPC (parallel)
5. **Post-process**: Results visualization in browser
6. **Share**: Send results link to colleagues

## External Aerodynamics

### Setup

1. Create project > Import CAD (vehicle, building, wing)
2. Create flow region:
   - **Enclosure**: Box around object
   - **Upstream**: 5× characteristic length
   - **Downstream**: 10-15× length (for wake)
   - **Lateral**: 5-10× length
3. Subtract object from enclosure (fluid domain)

### Mesh

1. SimScale auto-mesh:
   - **Mesh type**: Hex dominant (external aero) or tetrahedral
   - **Fineness**: 1-10 (5 = moderate, 8 = fine)
   - **Feature refinement**: On object surface
   - **Region refinement**: Around object and in wake
2. Boundary layer:
   - **Layers**: 5-10 (for y+ resolution)
   - **First layer thickness**: Based on y+ target
   - **Growth ratio**: 1.2
3. Check:
   - **Mesh quality**: Orthogonal quality > 0.1
   - **y+**: < 1 for SST k-ω, 30-300 for k-ε with wall functions

### Physics

1. Analysis type: **Incompressible** (low-speed, Ma < 0.3) or **Compressible** (high-speed, Ma > 0.3)
2. Fluid: Air (ρ = 1.225 kg/m³, μ = 1.79×10⁻⁵ Pa·s)
3. Turbulence model:
   - **k-ω SST**: Best for external aero (wall-bounded, separation)
   - **k-ε**: General purpose (with wall functions)
4. Boundary conditions:
   - **Inlet**: Velocity (e.g., 30 m/s = 108 km/h)
   - **Outlet**: Pressure (0 Pa gauge)
   - **Object**: No-slip wall
   - **Top/sides**: Slip wall (or symmetry)
   - **Bottom**: Moving wall (ground, same velocity as inlet)

### Results

1. **Drag coefficient**: Cd = 2 × Fdrag / (ρ × U² × A)
   - Typical car: Cd = 0.25-0.35
   - Truck: Cd = 0.6-0.8
2. **Lift coefficient**: Cl = 2 × Flift / (ρ × U² × A)
   - Race car: Cl = -1 to -3 (downforce)
   - Passenger car: Cl = -0.1 to 0.2
3. **Pressure distribution**: On object surface
4. **Velocity field**: Around object
5. **Streamlines**: Flow path visualization
6. **Wake structure**: Recirculation zones

## Internal Flow

### Pipe and Duct Flow

1. Import CAD (pipe, valve, duct, manifold)
2. Extract internal fluid volume:
   - Use SimScale "Flow Region Extraction" (automatic)
   - Or import pre-extracted fluid volume
3. Mesh:
   - **Fineness**: 5-7 (moderate to fine)
   - **Inflation layers**: At pipe walls
   - **Refinement**: At valves, bends, junctions
4. Physics:
   - **Incompressible**: Water or air at low speed
   - **Inlet**: Mass flow or velocity
   - **Outlet**: Pressure
   - **Walls**: No-slip
5. Results:
   - **Pressure drop**: ΔP = Pin - Pout
   - **Velocity distribution**: At cross-sections
   - **Flow separation**: At bends and expansions
   - **Mass flow balance**: Inlet = outlet

### Valve Analysis

1. Geometry: Valve body, ball/disc, seat
2. Fluid volume: Internal passage through valve
3. Boundary conditions:
   - **Inlet**: Pressure or mass flow
   - **Outlet**: Pressure
   - **Valve position**: Fully open, partially open, closed
4. Results:
   - **Flow coefficient (Cv)**: Cv = Q × √(SG / ΔP)
   - **Pressure drop**: Across valve
   - **Cavitation**: If pressure drops below vapor pressure
   - **Flow pattern**: Streamlines through valve

## Conjugate Heat Transfer (CHT)

### Setup

1. Analysis type: **Conjugate Heat Transfer**
2. Includes:
   - **Fluid flow**: Navier-Stokes (forced convection)
   - **Heat transfer in solids**: Conduction
   - **Heat transfer in fluids**: Convection + conduction
3. Materials:
   - **Solid**: k (thermal conductivity), ρ, Cp
   - **Fluid**: ρ, μ, k, Cp
4. Boundary conditions:
   - **Inlet**: Velocity + temperature
   - **Outlet**: Pressure
   - **Heat source**: Power (W) on solid component
   - **Wall (thermal)**: Temperature, heat flux, or convection
5. Results:
   - **Temperature field**: In both solid and fluid
   - **Heat flux**: Through interfaces
   - **Nusselt number**: Heat transfer effectiveness
   - **Thermal resistance**: Rth = ΔT / Q

### Electronics Cooling

1. Geometry: PCB, components, heat sink, enclosure
2. Materials:
   - **PCB**: FR4 (k = 0.3 W/m·K)
   - **Components**: Silicon (k = 149), copper (k = 386)
   - **Heat sink**: Aluminum (k = 167)
   - **Air**: k = 0.026 W/m·K
3. Heat sources:
   - **CPU**: 95W
   - **GPU**: 150W
   - **Memory**: 10W per module
4. Cooling:
   - **Forced convection**: Fan (inlet velocity = 5 m/s)
   - **Natural convection**: Buoyancy-driven (gravity)
5. Results:
   - **Junction temperature**: Must be < 100°C
   - **PCB temperature**: Must be < 105°C
   - **Heat sink efficiency**: Base temperature vs. air temperature
   - **Flow distribution**: Through heat sink fins

## Turbulence Modeling in SimScale

### Model Selection

| Model | Best For | y+ Requirement |
|-------|----------|----------------|
| k-ω SST | External aero, wall-bounded, separation | y+ < 1 |
| k-ε | Internal flows, general purpose | y+ > 30 (wall functions) |
| k-ω | Transitional, low-Re | y+ < 1 |
| LES | High accuracy, transient | y+ < 1, very fine mesh |

### y+ Check

1. After simulation, check y+ on walls:
   - **y+ < 1**: Good for SST k-ω (resolved boundary layer)
   - **30 < y+ < 300**: Good for k-ε with wall functions
   - **1 < y+ < 30**: Bad zone (neither resolved nor wall functions)
2. If y+ is wrong:
   - Adjust first layer thickness in mesh
   - Or switch turbulence model

## Cloud Computing Resources

### SimScale Hardware

1. **Community plan**: Up to 8 cores, limited mesh size
2. **Professional plan**: Up to 32 cores, larger mesh
3. **Enterprise plan**: Up to 96 cores, unlimited mesh
4. **Simulation time**:
   - 1M cells, steady, 32 cores: ~30 minutes
   - 10M cells, steady, 96 cores: ~2 hours
   - 10M cells, transient, 96 cores: ~8 hours

### Mesh Size Limits

| Plan | Max Mesh Cells | Max Cores |
|------|---------------|-----------|
| Community | 1M | 8 |
| Professional | 10M | 32 |
| Enterprise | 100M+ | 96 |

## Post-Processing in Browser

### Visualization

1. **Contour plots**: Pressure, velocity, temperature
2. **Vector plots**: Velocity arrows
3. **Streamlines**: Flow path from inlet
4. **Isosurfaces**: 3D surface at specific value
5. **Cross-sections**: Cut plane through domain
6. **Surface plots**: On object or boundary

### Data Export

1. **CSV**: Probe point data (time history)
2. **Paraview**: Full field data for offline post-processing
3. **Screenshots**: High-resolution images
4. **Reports**: Automatic PDF report generation

## Verification Checklist

- [ ] Flow regime is correct (incompressible vs. compressible)
- [ ] Fluid domain is correct (no gaps, correct volume)
- [ ] Boundary conditions match physical setup
- [ ] Mesh quality is acceptable (orthogonal quality > 0.1)
- [ ] y+ is in correct range for turbulence model
- [ ] Mass flow balances (inlet = outlet within 1%)
- [ ] No reverse flow at outlet
- [ ] Residuals converged (10⁻³ or lower for steady)
- [ ] Mesh independence verified (results don't change with refinement)
- [ ] Results are physically reasonable

## Wrapping Up

SimScale won't replace your desktop CFD setup for everything — if you need combustion models, LES, or multiphase VOF, you'll still want Fluent or CFX. But for external aerodynamics, internal flow, and conjugate heat transfer, it handles the job well. The thing I like most is that I can start a simulation, close my laptop, and check results on my phone when it's done. No workstation humming in the background, no license server to manage. Just upload, mesh, run, and share.
