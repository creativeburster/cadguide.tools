---
title: "SimScale Cloud FEA: Static Structural, Dynamic, and Thermal Analysis"
excerpt: "A guide to cloud-based FEA in SimScale covering static structural analysis, modal and harmonic analysis, thermal stress, nonlinear material behavior, and leveraging cloud computing for structural simulation without local hardware."
category: "workflow"
softwareSlug: "simscale"
keyword: "simscale cloud fea analysis"
slug: "simscale-cloud-fea-static-structural-dynamic-thermal-analysis"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.simscale.com/product/features/fea/"
  - "https://docs.simscale.com/"
---

# SimScale Cloud FEA: Static Structural, Dynamic, and Thermal Analysis

SimScale provides cloud-based FEA — static structural, dynamic, and thermal analysis — accessible through a web browser. The underlying solver is OpenFOAM (CFD) and Code_Aster (structural). This guide covers the complete cloud FEA workflow.

## Cloud FEA Advantages

### No Local Hardware

1. **No workstation**: Run from any laptop with a browser
2. **No software install**: Web-based platform
3. **Cloud HPC**: Up to 32 cores per simulation
4. **No license server**: No FLEXlm or network license management
5. **Collaboration**: Share projects with team via URL

### Supported Analysis Types

1. **Static structural**: Linear and nonlinear
2. **Dynamic**: Modal, harmonic, transient
3. **Thermal**: Steady-state and transient
4. **Thermomechanical**: Coupled thermal-structural
5. **Fatigue**: High-cycle and low-cycle fatigue

## Static Structural Analysis

### Setup

1. Create project > Import CAD (STEP, IGES, Parasolid)
2. Assign materials:
   - **Steel**: E = 200 GPa, ν = 0.3, ρ = 7850 kg/m³, σy = 250 MPa
   - **Aluminum**: E = 71 GPa, ν = 0.33, ρ = 2700 kg/m³, σy = 280 MPa
   - **Titanium**: E = 110 GPa, ν = 0.34, ρ = 4500 kg/m³, σy = 880 MPa
   - **Custom**: Define E, ν, ρ, yield strength
3. Assign material to each body in assembly

### Mesh

1. SimScale auto-mesh:
   - **Mesh type**: Tetrahedral (default) or hex dominant
   - **Fineness**: 1-10 (5 = moderate, 8 = fine)
   - **Local refinements**: On faces, edges, or volumes
2. Mesh quality:
   - **Aspect ratio**: < 20
   - **Skewness**: < 0.8
   - **Element quality**: > 0.1
3. For stress concentrations:
   - Add face sizing on fillets, holes, notches
   - Element size: 0.5-2mm at critical regions

### Boundary Conditions

1. **Fixed support**: Select faces or edges (all 6 DOF fixed)
2. **Remote displacement**: Constraint at a remote point
3. **Cylindrical support**: On cylindrical faces (radial, axial, tangential)
4. **Symmetry**: On symmetry plane (reduces model size)

### Loads

1. **Force**: On faces, edges, or vertices (N)
2. **Pressure**: On faces (Pa) — normal to surface
3. **Moment**: On faces or edges (N·m)
4. **Gravity**: Body force (9.81 m/s² in specified direction)
5. **Remote force**: Force applied at a remote point
6. **Bearing load**: On cylindrical faces (radial pressure distribution)

### Results

1. **Equivalent stress (von Mises)**: σvm contour
   - Compare to yield: σvm < σy → safe
2. **Displacement**: Total and directional
   - Check: Within allowable deflection
3. **Safety factor**: SF = σy / σvm
   - Target: SF > 1.5 (static), > 2.0 (dynamic)
4. **Strain**: Elastic and plastic (if nonlinear)
5. **Reaction forces**: At supports (should balance loads)

## Nonlinear Analysis

### Material Nonlinearity

1. Material > Plasticity:
   - **Bilinear**: Yield stress + tangent modulus
   - **Multilinear**: Stress-strain curve (true stress vs. true strain)
2. Analysis type: **Static structural, nonlinear**
3. Set:
   - **Nlgeom**: ON (large deformation)
   - **Incrementation**: Automatic (auto-step) or manual
4. Results:
   - **Plastic strain**: Permanent deformation
   - **Residual stress**: After unloading
   - **Load-displacement curve**: Nonlinear response

### Contact

1. Contacts > Define contact pairs:
   - **Bonded**: Surfaces glued (no relative motion)
   - **Sliding**: Frictionless or frictional
   - **Coulomb friction**: μ (friction coefficient)
2. SimScale auto-detects contacts in assemblies
3. For nonlinear contact:
   - **Normal behavior**: Hard contact (no penetration)
   - **Tangential behavior**: Penalty (Coulomb friction)

## Modal Analysis

### Setup

1. Analysis type: **Modal analysis**
2. Define supports (same as static)
3. Set number of modes: 6-20 (typical)
4. No loads required (modal is eigenvalue analysis)

### Results

1. **Natural frequencies**: Listed in Hz
   - Mode 1: First bending
   - Mode 2: First torsional
   - Mode 3: Second bending
   - etc.
2. **Mode shapes**: Deformation pattern per mode
3. **Effective mass**: Per mode per direction
   - Sum should be > 90% of total mass
4. **Participation factor**: Importance of each mode

### Resonance Check

1. Identify excitation frequencies:
   - **Rotating equipment**: f = RPM / 60
   - **AC frequency**: 50 or 60 Hz
   - **Blade passing**: f = RPM × Nblades / 60
2. Compare to natural frequencies:
   - **Safe**: fnat / fexc > 1.5 or < 0.67
   - **Resonance risk**: Within ±20% of excitation

## Harmonic Analysis

### Setup

1. Analysis type: **Harmonic response**
2. Link to modal analysis (uses mode shapes)
3. Set:
   - **Frequency range**: 0-200 Hz (cover modes of interest)
   - **Number of intervals**: 100-500
   - **Damping ratio**: 2-5% (steel), 5-10% (bolted joints)
4. Apply harmonic load:
   - **Force**: Magnitude and direction
   - **Base excitation**: For rotating equipment

### Results

1. **Frequency response**: Amplitude vs. frequency
   - Peaks at resonance (natural frequencies)
2. **Phase response**: Phase angle vs. frequency
3. **Stress at resonance**: Maximum stress at resonant frequency
4. **Amplification factor**: Q = 1 / (2ζ) at resonance

## Thermal Analysis

### Steady-State Thermal

1. Analysis type: **Heat transfer, steady-state**
2. Materials:
   - **Thermal conductivity (k)**: W/m·K
   - **Density (ρ)**: kg/m³
   - **Specific heat (Cp)**: J/kg·K
3. Boundary conditions:
   - **Temperature**: Fixed temperature (°C)
   - **Heat flux**: W/m² on surface
   - **Heat flow**: W on surface or volume
   - **Convective heat flux**: h (W/m²·K) and T_ambient
   - **Radiation**: Emissivity and T_ambient
4. Results:
   - **Temperature distribution**: Contour plot
   - **Heat flux**: Direction and magnitude
   - **Maximum temperature**: Location and value

### Transient Thermal

1. Analysis type: **Heat transfer, transient**
2. Set:
   - **Initial temperature**: Uniform or from steady-state
   - **End time**: Total simulation time (s)
   - **Time step**: Based on Fourier number
3. Time-dependent boundary conditions:
   - **Tabular**: Time-value pairs
   - Example: Heat source turns on at t=10s, off at t=60s
4. Results:
   - **Temperature vs. time**: At probe points
   - **Temperature at specific times**: Snapshots
   - **Time to steady-state**: When temperature stabilizes

### Thermomechanical Analysis

1. Analysis type: **Thermomechanical** (coupled)
2. Setup:
   - Run thermal analysis first (steady-state or transient)
   - Import temperature field as load in structural analysis
3. Material:
   - **CTE (α)**: Coefficient of thermal expansion (×10⁻⁶/°C)
   - **Reference temperature**: Tref (stress-free temperature)
4. Thermal strain: εth = α × (T - Tref)
5. Results:
   - **Thermal stress**: From constrained thermal expansion
   - **Total deformation**: Mechanical + thermal
   - **Combined stress**: Mechanical + thermal stress
   - **Safety factor**: Must account for temperature-dependent properties

## Fatigue Analysis

### High-Cycle Fatigue

1. Analysis type: **Fatigue** (requires static structural result)
2. Set:
   - **Fatigue theory**: Stress-life (S-N) or Strain-life (ε-N)
   - **Mean stress correction**: Goodman, Gerber, or Soderberg
   - **Loading type**: Fully reversed, mean stress, or variable amplitude
3. Material:
   - **S-N curve**: Stress amplitude vs. cycles to failure
   - **Endurance limit**: σe (for steel, σe ≈ 0.5 × σUTS)
4. Results:
   - **Fatigue life**: N (cycles to failure)
   - **Damage**: D = n/N (cumulative damage)
   - **Safety factor**: For infinite life (N > 10⁶)

### Applications

- **Bracket**: Cyclic loading (vibration)
- **Pressure vessel**: Pressure cycling
- **Shaft**: Rotating bending
- **Welded joint**: Variable amplitude loading

## Cloud Computing Performance

### Simulation Times

| Analysis | Mesh Size | Cores | Time |
|----------|-----------|-------|------|
| Static (linear) | 500K | 8 | 5-10 min |
| Static (linear) | 5M | 32 | 20-40 min |
| Static (nonlinear) | 1M | 16 | 30-60 min |
| Modal | 1M | 16 | 10-20 min |
| Thermal (steady) | 1M | 16 | 10-20 min |
| Fatigue | 500K | 8 | 5-15 min |

### Mesh Size Limits

| Plan | Max Nodes | Max Cores |
|------|-----------|-----------|
| Community | 100K | 8 |
| Professional | 5M | 32 |
| Enterprise | 50M+ | 96 |

## Post-Processing

### Visualization

1. **Contour plots**: Stress, displacement, temperature
2. **Deformed shape**: Scaled for visibility
3. **Probe points**: Value at specific location
4. **Section cuts**: Cross-section through model
5. **Animations**: Mode shapes, deformation

### Reports

1. SimScale auto-generates report:
   - **Model summary**: Geometry, materials, mesh
   - **Boundary conditions**: Loads and supports
   - **Results**: Stress, displacement, safety factor
   - **Figures**: Contour plots
2. Export as PDF for documentation

## Verification Checklist

- [ ] Material properties are correct (E, ν, ρ, yield)
- [ ] Mesh is refined at stress concentrations
- [ ] Boundary conditions prevent rigid body motion
- [ ] Loads are applied in correct direction and magnitude
- [ ] Reaction forces balance applied loads
- [ ] Maximum stress is below yield (or plasticity is modeled)
- [ ] Safety factor > 1.0 at all locations
- [ ] Deformation is within allowable limits
- [ ] Modal analysis captures 90%+ effective mass
- [ ] No resonance within ±20% of excitation frequency
- [ ] Thermal contact resistance is specified at interfaces
- [ ] Fatigue life meets design requirement

## Conclusion

SimScale provides a complete cloud-based FEA workflow — static structural, modal, harmonic, thermal, thermomechanical, and fatigue analysis — all accessible through a web browser without local hardware. The platform uses Code_Aster as the structural solver, providing industry-standard analysis capabilities. The key advantage is cloud computing — running simulations on up to 32 cores without investing in workstations or software licenses. The key to reliable cloud FEA is the same as desktop FEA: proper meshing (refined at stress concentrations), correct boundary conditions (no rigid body motion), and careful result interpretation (safety factor, deformation limits). By following this workflow, engineers can run structural simulations from anywhere, share results instantly, and scale computing resources as needed.
