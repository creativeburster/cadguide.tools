---
title: "Abaqus Composite Material Analysis: Laminate Modeling, Damage, and Progressive Failure"
excerpt: "A guide to composite material analysis in Abaqus covering laminate layup definition, shell and continuum shell elements, Hashin damage initiation, progressive failure analysis, and delamination modeling for aerospace and automotive composites."
category: "workflow"
softwareSlug: "abaqus"
keyword: "abaqus composite material analysis"
slug: "abaqus-composite-material-analysis-laminate-damage-progressive-failure"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.3ds.com/products/simulia/abaqus"
  - "https://help.3ds.com/2024/English/DSSIMULIA_Established/SIMACAEGENRefMap/simacaegen-c-doc.htm"
---

# Abaqus Composite Material Analysis: Laminate Modeling, Damage, and Progressive Failure

I started working with composites about eight years ago, and honestly, the learning curve was steeper than I expected. The orthotropic material properties, the ply angles, the layup sequence — get any of those wrong and your analysis is meaningless. But once it clicks, Abaqus handles composites really well. Let me walk you through how I set up laminate definitions, run progressive failure with Hashin damage, and model delamination.

## Composite Laminate Definition

### Material Properties

1. Module: Property > Create Material
2. Type: Elastic > Engineering Constants (orthotropic)
3. Set ply properties (e.g., carbon fiber/epoxy):

| Property | Value |
|----------|-------|
| E1 (fiber direction) | 135 GPa |
| E2 (transverse) | 9.5 GPa |
| E3 (thickness) | 9.5 GPa |
| ν12 | 0.30 |
| ν13 | 0.30 |
| ν23 | 0.45 |
| G12 | 5.0 GPa |
| G13 | 5.0 GPa |
| G23 | 3.0 GPa |
| Density | 1580 kg/m³ |

4. Strength properties (for damage):
   - **Xt**: Tensile strength in fiber direction (1500 MPa)
   - **Xc**: Compressive strength in fiber direction (1200 MPa)
   - **Yt**: Transverse tensile strength (50 MPa)
   - **Yc**: Transverse compressive strength (250 MPa)
   - **SL**: Shear strength (80 MPa)
   - **St**: Transverse shear strength (80 MPa)

### Composite Layup

1. Module: Property > Composite Layup
2. Define:
   - **Layup name**: e.g., "Skin_Layup"
   - **Element type**: Shell or Continuum Shell
   - **Layup orientation**: 
     - **Reference direction**: 0° fiber direction
     - **Additional rotation**: Per ply angle
3. Plies:

| Ply # | Material | Thickness (mm) | Angle (°) |
|-------|----------|---------------|----------|
| 1 | CFRP_UD | 0.125 | 0 |
| 2 | CFRP_UD | 0.125 | 45 |
| 3 | CFRP_UD | 0.125 | -45 |
| 4 | CFRP_UD | 0.125 | 90 |
| 5 | CFRP_UD | 0.125 | 90 |
| 6 | CFRP_UD | 0.125 | -45 |
| 7 | CFRP_UD | 0.125 | 45 |
| 8 | CFRP_UD | 0.125 | 0 |

4. Total thickness: 8 × 0.125 = 1.0mm
5. Layup: [0/45/-45/90]s (symmetric)

## Element Selection

### Shell Elements

| Element | Type | Use |
|---------|------|-----|
| S4R | 4-node, reduced | General composite shells (default) |
| S8R | 8-node, reduced | Higher accuracy (curved geometry) |
| S4 | 4-node, full | When hourglass is problematic |

- **Advantages**: Fast, efficient, good for thin laminates
- **Limitations**: Constant shear through thickness, no edge effects
- **Output**: Per-ply stresses and strains

### Continuum Shell Elements

| Element | Type | Use |
|---------|------|-----|
| SC8R | 8-node, reduced | 3D composite shells (default) |
| SC6R | 6-node (wedge) | Transition geometry |

- **Advantages**: 3D stress state, better edge effects, through-thickness stress
- **Limitations**: Slower than shell, more elements
- **Use when**: Through-thickness stress is important, thick laminates

### Solid Elements (3D)

| Element | Type | Use |
|---------|------|-----|
| C3D8R | Hex, reduced | Each ply as a solid layer |
| C3D20R | Hex, quadratic | High accuracy (expensive) |

- **Advantages**: Full 3D stress, delamination between plies
- **Limitations**: Very expensive (many elements for many plies)
- **Use when**: Detailed delamination, thick composites, impact

## Damage Initiation (Hashin)

### Hashin Damage Criteria

1. Property > Material > Damage > Hashin Damage
2. Four failure modes:

#### Fiber Tension (σ11 > 0)
- (σ11/Xt)² + α × (τ12/SL)² + α × (τ13/ST)² ≥ 1
- α: Shear contribution factor (typically 1.0)

#### Fiber Compression (σ11 < 0)
- (σ11/Xc)² ≥ 1

#### Matrix Tension (σ22 > 0)
- (σ22/Yt)² + (τ12/SL)² + (τ13/ST)² ≥ 1

#### Matrix Compression (σ22 < 0)
- (σ22/Yc)² + (τ12/SL)² + (τ13/ST)² ≥ 1

3. Set parameters:
   - **Xt, Xc**: Fiber tensile/compressive strength
   - **Yt, Yc**: Matrix tensile/compressive strength
   - **SL, ST**: Shear strengths
   - **α**: Shear contribution factor (1.0 default)

### Damage Evolution

1. After initiation, damage evolves:
   - **Type**: Energy (fracture energy per unit area)
   - **Gft, Gfc**: Fiber tensile/compressive fracture energy
   - **Gmt, Gmc**: Matrix tensile/compressive fracture energy
   - **Softening**: Linear or exponential

2. Typical fracture energies (CFRP):

| Mode | G (mJ/mm²) |
|------|-----------|
| Fiber tension (Gft) | 90 |
| Fiber compression (Gfc) | 80 |
| Matrix tension (Gmt) | 0.5 |
| Matrix compression (Gmc) | 1.5 |

3. Damage variable (0 to 1):
   - **0**: No damage (intact)
   - **1**: Fully damaged (no load capacity)
   - Stiffness degrades: Cdamaged = C × (1 - d)

## Progressive Failure Analysis

### Setup

1. Step > Static, General (NLGEOM ON)
2. Apply load incrementally
3. Abaqus:
   - Monitors each ply at each integration point
   - When Hashin criterion is met: damage initiates
   - Stiffness degrades per damage evolution law
   - Load redistributes to undamaged material
   - Damage may propagate to adjacent elements
4. Element deletion:
   - When damage variable = 1: element loses all stiffness
   - Element can be deleted from analysis (visualize as removed)

### Results

1. **Damage variables**:
   - **HSNFTCRT**: Fiber tension damage initiation criterion
   - **HSNFCCRT**: Fiber compression criterion
   - **HSNMTCRT**: Matrix tension criterion
   - **HSNMCCRT**: Matrix compression criterion
   - **DV**: Damage variable (0 to 1)
2. **Failed elements**: Where DV > 0.99
3. **Stress redistribution**: Load path changes as damage progresses
4. **Load-displacement curve**: Shows stiffness loss and peak load

### Typical Progressive Failure Sequence

1. **First-ply failure**: Matrix cracking in 90° plies (transverse tension)
2. **Damage propagation**: Matrix cracking spreads to adjacent 90° plies
3. **Fiber failure**: When stress redistributes to 0° plies, fiber tension may exceed Xt
4. **Final failure**: Fiber fracture in 0° plies → laminate fails

## Delamination Modeling

### Cohesive Zone for Delamination

1. Insert cohesive elements between plies:
   - **COH3D8**: 3D cohesive element
   - **Thickness**: 0.001-0.01mm (or zero-thickness)
2. Or use surface-based cohesive:
   - Interaction > Cohesive Behavior
   - Between ply interfaces
3. Interface properties:
   - **Normal strength (tN)**: 50-100 MPa (composite interface)
   - **Shear strength (tS, tT)**: 30-80 MPa
   - **Mode I fracture energy (GIC)**: 0.3-1.0 mJ/mm²
   - **Mode II fracture energy (GIIC)**: 1.0-3.0 mJ/mm²
4. Mixed-mode:
   - **Power law**: (GI/GIC)^α + (GII/GIIC)^α = 1
   - **BK (Benzeggagh-Kenane)**: For Mode I/II mixity

### Virtual Crack Closure Technique (VCCT)

1. Alternative to cohesive zone:
   - Interaction > VCCT
   - Calculate energy release rate at crack tip
   - Compare to critical: G ≥ GC → crack advances
2. Advantages:
   - No need for cohesive elements
   - Based on LEFM (linear elastic fracture mechanics)
   - Good for brittle delamination
3. Parameters:
   - **GIC, GIIC**: Mode I and II critical energy release rates
   - **Mixed mode**: Power law or BK

## Impact Analysis (Abaqus/Explicit)

### Low-Velocity Impact Setup

1. Step > Dynamic, Explicit
2. Impactor:
   - Rigid sphere (e.g., 16mm diameter, 2kg)
   - Initial velocity: e.g., 5 m/s (low-velocity impact)
3. Composite plate:
   - S4R or SC8R elements
   - Hashin damage enabled
   - Cohesive zone between plies (for delamination)
4. Contact:
   - General Contact (Explicit)
   - Impactor-to-plate contact
5. Duration: 2-5 ms (typical impact event)

### Impact Results

1. **Damage patterns**:
   - **Fiber damage**: On impact face (compression) and back face (tension)
   - **Matrix damage**: Spreading from impact point
   - **Delamination**: Between plies at different angles (mode II dominant)
2. **Energy absorption**:
   - By fiber fracture, matrix cracking, delamination
   - Check energy balance: KE → IE + damage + friction
3. **Barely visible impact damage (BVID)**:
   - Surface: Minimal visible damage
   - Internal: Significant delamination
   - Critical for aircraft inspection

## Post-Processing

### Per-Ply Results

1. Results > Field Output > Section Points:
   - Select ply number (1 through N)
   - View stress, strain, damage per ply
2. Through-thickness:
   - Plot stress through all plies
   - Identify which ply fails first

### Failure Envelope

1. Plot failure index vs. load:
   - Hashin criterion at each ply
   - First-ply failure load
   - Ultimate failure load
2. Compare to test data:
   - Tensile test: [0/90]s laminate
   - Compression test: [0/45/-45/90]s laminate
   - Shear test: [±45]s laminate

## Verification Checklist

- [ ] Material properties are orthotropic (E1, E2, E3, G12, G13, G23, ν12, ν13, ν23)
- [ ] Ply angles are correctly defined in composite layup
- [ ] Layup sequence matches design (symmetric, balanced, etc.)
- [ ] Element type is appropriate (shell for thin, continuum for thick)
- [ ] Hashin damage parameters match material test data
- [ ] Fracture energies (Gft, Gfc, Gmt, Gmc) are in correct units
- [ ] Damage evolution is stable (no sudden energy release)
- [ ] Delamination interface properties are correct (if modeled)
- [ ] First-ply failure load matches analytical prediction
- [ ] Ultimate failure load matches test data (if available)

## Wrapping Up

Composites analysis in Abaqus comes down to two things: getting your material properties right and choosing the right damage model. I always start with a simple [0/90]s laminate and compare first-ply failure to a hand calculation before running anything complex. If the simple case doesn't match, your properties or layup definition is wrong — no point running a full progressive failure analysis on a bad foundation. And don't forget delamination — I've seen too many composite analyses that only model in-plane damage and completely miss the out-of-plane failure that actually drives the design.
