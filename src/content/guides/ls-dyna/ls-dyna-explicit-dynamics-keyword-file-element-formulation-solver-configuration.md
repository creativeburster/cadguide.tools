---
title: "LS-DYNA Explicit Dynamics: Keyword File Setup, Element Formulation, and Solver Configuration"
excerpt: "A guide to LS-DYNA explicit dynamics covering keyword file structure, element types (shell, solid, beam), material models, contact definition, time step control, and energy balance verification for high-speed dynamic simulation."
category: "workflow"
softwareSlug: "ls-dyna"
keyword: "ls-dyna explicit dynamics"
slug: "ls-dyna-explicit-dynamics-keyword-file-element-formulation-solver-configuration"
author: "CADGuide Technical Editorial"
readTime: "13 min read"
date: "2026-06-30"
sources:
  - "https://lsdyna.ansys.com/manuals/"
  - "https://www.dynasupport.com/howtos"
---

# LS-DYNA Explicit Dynamics: Keyword File Setup, Element Formulation, and Solver Configuration

LS-DYNA was the first explicit dynamics solver I ever used, and honestly, the keyword file format intimidated me at first. It's just text — no GUI, no tree structure, just cards and parameters. But once I learned the key cards, it became second nature. Let me walk you through the workflow I use for setting up LS-DYNA models, from element formulation to energy balance checks.

## LS-DYNA Workflow

### Overview

1. **Pre-processing**: LS-PrePost or external pre-processor (HyperMesh, ANSA)
2. **Keyword file**: Text file (.k) containing all model definition
3. **Solver**: LS-DYNA executable (SMP or MPP)
4. **Post-processing**: LS-PrePost for results visualization

### Keyword File Structure

The LS-DYNA keyword file is organized by keywords (cards):

```
*KEYWORD
*TITLE
Model title
*CONTROL_TERMINATION
   0.1         0         0         0         0         0
*CONTROL_TIMESTEP
   0.0       0.9         0         0         0         0
*DATABASE_GLSTAT
   0.001
*DATABASE_BINARY_D3PLOT
   0.005
*END
```

## Mesh and Elements

### Shell Elements

1. *ELEMENT_SHELL
2. Element formulation (ELFORM):
   - **2**: Belytschko-Tsay (default, fast, good for most)
   - **5**: S/R Hughes-Liu (improved warping, slower)
   - **10**: Belytschko-Wong-Chiang (better for warped geometry)
   - **16**: Fully integrated shell (no hourglass, slower)
3. Section properties (*SECTION_SHELL):
   - **Thickness**: t (mm)
   - **Integration points**: 3-5 through thickness (5 recommended for plasticity)
   - **ELFORM**: 2 (default)

### Solid Elements

1. *ELEMENT_SOLID
2. Element formulation (ELFORM):
   - **1**: Constant stress (1-point integration, default, fast)
   - **2**: Fully integrated (S/R, no hourglass, slower)
   - **10**: Tetrahedron (1-point, for complex geometry)
   - **13**: Tetrahedron (10-node, quadratic, accurate but slow)
3. Section properties (*SECTION_SOLID):
   - **ELFORM**: 1 (default for most)

### Beam Elements

1. *ELEMENT_BEAM
2. Element formulation (ELFORM):
   - **1**: Hughes-Liu (default, good for large rotation)
   - **2**: Belytschko-Schwer (resultant beam)
   - **3**: Truss (axial only)
3. Section properties (*SECTION_BEAM):
   - **Cross-section**: Rectangular, circular, or custom
   - **Integration**: Through section

### Hourglass Control

1. Reduced integration elements (ELFORM 1, 2) have hourglass modes
2. *CONTROL_HOURGLASS:
   - **IHQ**: Hourglass control type
     - 1: Flanagan-Belytschko (stiffness, default)
     - 2: Flanagan-Belytschko (viscous)
     - 4: Flanagan-Belytschko (stiffness, enhanced)
     - 5: Type 5 (orthogonal stiffness)
   - **QH**: Hourglass coefficient (0.1 default, 0.05 for more accuracy)
3. Check: Hourglass energy < 5% of internal energy

## Material Models

### Elastic

1. *MAT_ELASTIC (MAT_001):
   - **RO**: Density (kg/m³ or tonne/mm³)
   - **E**: Young's modulus (Pa or MPa)
   - **PR**: Poisson's ratio
2. Use for: Linear elastic materials (steel, aluminum in elastic range)

### Plastic Kinematic

1. *MAT_PLASTIC_KINEMATIC (MAT_003):
   - **RO**: Density
   - **E**: Young's modulus
   - **PR**: Poisson's ratio
   - **SIGY**: Yield stress
   - **ET**: Tangent modulus (plastic hardening)
   - **BETA**: Hardening parameter (0=kinematic, 1=isotropic)
   - **SRC**: Strain rate parameter (Cowper-Symonds)
   - **SRP**: Strain rate exponent
2. Use for: General plasticity with strain rate effects

### Johnson-Cook

1. *MAT_JOHNSON_COOK (MAT_015):
   - **A**: Yield stress
   - **B**: Hardening coefficient
   - **n**: Hardening exponent
   - **C**: Strain rate coefficient
   - **m**: Temperature exponent
   - **Tm**: Melt temperature
   - **Tr**: Room temperature
2. Flow stress: σ = (A + Bεⁿ)(1 + C ln(ε̇*))(1 - T*ᵐ)
3. Use for: High strain rate, temperature-dependent metals (crash, impact)

### Piecewise Linear Plasticity

1. *MAT_PIECEWISE_LINEAR_PLASTICITY (MAT_024):
   - **SIGY**: Initial yield stress
   - **ET**: Tangent modulus
   - **LCSS**: Load curve for stress-strain
   - **C**: Strain rate coefficient (Cowper-Symonds)
   - **P**: Strain rate exponent
2. Use for: Custom stress-strain curve with strain rate

### Failure Models

1. *MAT_ADD_EROSION:
   - **PFAIL**: Failure pressure (spallation)
   - **EPSFAIL**: Failure principal strain
   - **SIGMAX**: Maximum principal stress
   - **SIGVM**: Maximum von Mises stress
2. When criterion is met: Element is deleted from analysis
3. Use for: Fracture, tearing, fragmentation

## Contact

### Automatic Single Surface

1. *CONTACT_AUTOMATIC_SINGLE_SURFACE:
   - All surfaces can contact themselves and each other
   - Most general contact (like Abaqus general contact)
2. Parameters:
   - **SSID**: Part set ID (which parts are in contact)
   - **FS, FD**: Static and dynamic friction coefficients
   - **DC**: Optional damping
3. Use for: Crash (parts fold and contact themselves)

### Automatic Surface to Surface

1. *CONTACT_AUTOMATIC_SURFACE_TO_SURFACE:
   - Define master and slave surfaces
   - More controlled than single surface
2. Parameters:
   - **SSID**: Slave surface
   - **MSID**: Master surface
   - **FS, FD**: Friction coefficients
3. Use for: Known contact pairs (impact, forming)

### Contact Formulation

1. **Penalty method** (default):
   - Contact force = kpenalty × penetration
   - kpenalty: Auto-calculated from material stiffness
   - Can scale: SFS (slave), SFM (master)
2. **Soft constraint**:
   - For soft-on-hard contact (rubber on steel)
   - Penalty based on segment area, not material stiffness
3. **Constraint method**:
   - Lagrange multiplier (exact, but can oscillate)

### Contact Tips

1. Use *CONTACT_AUTOMATIC_SINGLE_SURFACE for crash
2. Use *CONTACT_AUTOMATIC_SURFACE_TO_SURFACE for known pairs
3. Check contact penetration in post-processing
4. If penetration is excessive: increase SFS (penalty scale factor)
5. If contact is unstable: add contact damping (DC)

## Time Step Control

### Stable Time Step

1. *CONTROL_TIMESTEP:
   - **DT2LC**: Time step scale factor (0.9 default, 0.67 for safety)
   - **TSSFAC**: Scale factor for shell/solid elements
2. Stable time step:
   - Δtcrit = Lmin / c
   - Lmin: Smallest element characteristic length
   - c: Wave speed = √(E/ρ)
3. Example: Steel, Lmin = 1mm
   - c = √(200×10⁹/7850) = 5048 m/s
   - Δtcrit = 0.001/5048 = 1.98×10⁻⁷ s ≈ 0.2 μs
4. For 100 ms simulation: ~500,000 cycles

### Mass Scaling

1. *CONTROL_TIMESTEP:
   - **DT2MS**: Mass scaling target time step
   - Positive: Add mass to elements below target dt
   - Negative: Add mass and report
2. Example: DT2MS = 1×10⁻⁷
   - All elements with dt < 1×10⁻⁷ get mass added
   - Check: Mass increase < 5% total (quasi-static)
3. *DATABASE_MASS:
   - Report mass scaling information
   - Check mass added per part

### Time Step Output

1. *DATABASE_GLSTAT:
   - Reports time step, kinetic energy, internal energy per cycle
2. Monitor:
   - **Time step**: Should be stable (not dropping significantly)
   - **If time step drops**: Element is distorting (check mesh quality)

## Output Control

### Binary Output

1. *DATABASE_BINARY_D3PLOT:
   - **DT**: Time interval between plot states (e.g., 0.005s)
   - Number of states: T_end / DT
2. d3plot files contain:
   - Deformation
   - Stress and strain
   - Element deletion (erosion)
   - Contact information

### ASCII Output

1. *DATABASE_GLSTAT:
   - Global statistics per cycle
   - Time, KE, IE, hourglass, total energy
2. *DATABASE_MATSUM:
   - Per-part energy summary
3. *DATABASE_RCFORC:
   - Resultant contact forces
4. *DATABASE_SPCFORC:
   - Reaction forces at constraints
5. *DATABASE_NODFOR:
   - Nodal forces

## Energy Balance

### Energy Components

1. **Kinetic energy (KE)**: 0.5 × Σ(m × v²)
2. **Internal energy (IE)**: Strain + plastic energy
3. **Hourglass energy (HG)**: Artificial energy from hourglass control
4. **Contact energy (CE)**: Energy from contact sliding (friction)
5. **Total energy (TE)**: KE + IE + HG + CE
6. **External work (EW)**: Work done by external forces

### Energy Checks

1. **Conservation**: TE ≈ EW (total energy = external work)
2. **Hourglass**: HG < 5% of IE
3. **Mass scaling**: Check mass increase < 5% (quasi-static)
4. **Contact energy**: CE should be reasonable (friction work)
5. If TE ≠ EW: Energy is being created or destroyed (check for errors)

## Running LS-DYNA

### SMP vs. MPP

1. **SMP (Shared Memory Parallel)**:
   - Single machine, multiple cores
   - Up to 8-16 cores
   - Simpler setup
2. **MPP (Massively Parallel Processing)**:
   - Distributed memory (cluster)
   - Hundreds to thousands of cores
   - Domain decomposition
   - Required for large models (> 1M elements)

### Command Line

```
ls-dyna_smp_d i=inputfile.k ncpu=8 memory=2G
```

Or for MPP:
```
mpirun -np 64 ls-dyna_mpp_d i=inputfile.k memory=2G
```

### Memory

1. **Memory**: Specified in words (1 word = 8 bytes on 64-bit)
2. **memory=2G**: 2 billion words = 16 GB
3. Estimate: ~1 million words per 1000 elements (varies by model)
4. If memory is insufficient: LS-DYNA reports required memory

## Verification Checklist

- [ ] Element formulation is appropriate (ELFORM 2 for shells, 1 for solids)
- [ ] Hourglass control is active (check HG energy < 5% IE)
- [ ] Material model matches material behavior (Johnson-Cook for high rate)
- [ ] Contact includes all possible contact pairs
- [ ] Time step scale factor is appropriate (0.9 default)
- [ ] Mass scaling is checked (< 5% mass increase for quasi-static)
- [ ] Energy balance is satisfied (TE ≈ EW)
- [ ] Element deletion is used appropriately (failure criteria)
- [ ] Output frequency captures key events
- [ ] Results are mesh-independent (refine and compare)

## Wrapping Up

LS-DYNA's keyword file format gives you control over everything, which is both its strength and its weakness. There's no GUI holding your hand — if you get a card wrong, the solver might run but give you bad results. The two things I check on every LS-DYNA run: hourglass energy (keep it under 5% of internal energy) and mass scaling (keep added mass under 5% for quasi-static). If either of those is too high, your results aren't trustworthy regardless of how good everything else looks.
