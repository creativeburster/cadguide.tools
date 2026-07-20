---
title: "MIDAS Gen Concrete Shear Wall Design: Meshed Walls, Pier Forces, and Boundary Elements"
excerpt: "A guide to concrete shear wall design in MIDAS Gen covering wall meshing, pier and spandrel labeling, in-plane and out-of-plane force extraction, boundary element design per ACI 318, and wall reinforcement detailing."
category: "workflow"
softwareSlug: "midas-gen"
keyword: "midas gen shear wall design"
slug: "midas-gen-concrete-shear-wall-design-meshed-walls-pier-boundary-elements"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://globalsupport.midasuser.com/"
  - "https://academy.midasuser.com/"
---

# MIDAS Gen Concrete Shear Wall Design: Meshed Walls, Pier Forces, and Boundary Elements

Shear wall design in MIDAS Gen took us a while to get comfortable with. The meshed wall approach is powerful but the workflow is different from what we were used to in ETABS. Once we understood how pier forces are extracted from the meshed model and how boundary elements are designed, it became our preferred method for seismic shear wall design. Let us walk you through it.

## Wall Modeling

### Creating Wall Elements

1. Model > Element > Wall
2. Draw the wall outline:
   - Click corner points to define the wall polygon
   - Walls are created as plate/shell elements
3. Set wall thickness (e.g., 250mm, 300mm, 400mm)
4. Set material: Concrete C30 (f'c = 30 MPa)

### Wall Meshing

1. Mesh > Auto Mesh
2. Set mesh parameters:
   - **Mesh size**: 0.5m × 0.5m to 1.0m × 1.0m
   - **Mesh type**: Quadrilateral (preferred) or mixed
   - **Refinement**: Finer mesh at wall edges and openings
3. MIDAS Gen automatically meshes the wall into plate elements
4. Verify mesh quality:
   - No warped elements
   - No excessively small elements
   - Regular shape (aspect ratio < 4)

### Wall Openings

1. Model > Opening
2. Draw opening boundary within the wall
3. MIDAS Gen automatically:
   - Removes plate elements within the opening
   - Adjusts mesh around the opening
   - Creates lintel beam above opening (if specified)

### Pier and Spandrel Labels

1. Model > Building > Pier Label
2. Assign pier labels to vertical wall segments:
   - **Pier P1**: Left wall segment at Grid A
   - **Pier P2**: Right wall segment at Grid B
   - **Pier P3**: Center wall segment
3. Model > Building > Spandrel Label
4. Assign spandrel labels to horizontal wall segments:
   - **Spandrel S1**: Lintel over Door 1
   - **Spandrel S2**: Lintel over Window 2
5. Pier and spandrel labels group meshed elements for force extraction and design

## Wall Analysis

### In-Plane Forces

1. Results > Plate Forces
2. View in-plane forces per element:
   - **Nxx**: Axial force in horizontal direction
   - **Nyy**: Axial force in vertical direction (gravity + seismic)
   - **Nxy**: In-plane shear force
3. These are forces per unit length (kN/m)

### Out-of-Plane Forces

1. Results > Plate Forces > Out-of-Plane
2. View:
   - **Mxx**: Bending moment about X-axis
   - **Myy**: Bending moment about Y-axis
   - **Mxy**: Twisting moment
   - **Vx, Vy**: Transverse shear
3. Out-of-plane forces are typically small in shear walls but important for basement walls

### Pier Force Output

1. Results > Pier Forces
2. Select a pier label (e.g., P1)
3. View forces integrated over the pier cross-section:
   - **Axial (P)**: Total vertical force
   - **Shear (V)**: Total horizontal shear
   - **Moment (M)**: Total in-plane moment
4. These are section forces (kN and kN·m), not per-unit-length
5. Use pier forces for:
   - Boundary element design
   - Reinforcement calculation
   - Capacity ratio checking

### Spandrel Force Output

1. Results > Spandrel Forces
2. Select a spandrel label (e.g., S1)
3. View forces:
   - **Axial (P)**: Horizontal axial force
   - **Shear (V)**: Vertical shear
   - **Moment (M)**: Out-of-plane moment
4. Use spandrel forces for lintel beam design

## Wall Design

### Setting Up Wall Design

1. Design > Concrete Wall Design > Design Code
2. Select: ACI 318-19
3. Set parameters:
   - **FC**: 30 MPa
   - **FY**: 420 MPa (main bars)
   - **FYH**: 420 MPa (horizontal bars)
   - **Clear cover**: 25mm
   - **Min vertical reinforcement**: 0.0025 × Ag (per ACI 11.6.1)
   - **Min horizontal reinforcement**: 0.0025 × Ag

### Running Wall Design

1. Design > Concrete Wall Design > Run Design
2. MIDAS Gen designs each wall segment:

#### Vertical Reinforcement

- **Required area**: As = Mu / (fy × (d - a/2))
- **Minimum**: ρv ≥ 0.0025 (per ACI 11.6.1)
- **Maximum**: ρv ≤ 0.06 (per ACI 11.6.1)
- **Bar selection**: e.g., #16 @ 200mm each face (2 × 201 = 402 mm²/m, ρv = 0.0034)

#### Horizontal Reinforcement

- **Required area**: Based on shear demand
- **Minimum**: ρh ≥ 0.0025
- **Bar selection**: e.g., #12 @ 250mm each face

#### Shear Capacity

- **Concrete shear**: φVc = φ × 0.17 × αc × √f'c × Ag
  - αc = 2.0 (h/t ≤ 1.5), 0.25 (h/t ≥ 2.0), linear interpolation
- **Total shear**: φVn = φVc + φVs
- **Check**: Vu ≤ φVn

### Boundary Element Design

#### Determining If Boundary Elements Are Required

1. MIDAS Gen checks per ACI 318 18.10.6.3:
   - Calculate maximum compressive stress: σ = Pu/Ag + Mu/Z
   - If σ > 0.2 × f'c: boundary elements required
2. If required:
   - Identify the compression zone (tension on one face, compression on other)
   - Design boundary elements at the compression edge

#### Boundary Element Dimensions

1. Set boundary element dimensions:
   - **Width**: Same as wall thickness (e.g., 300mm)
   - **Length**: Sufficient to contain the compression zone
   - Typically: 300-600mm × wall thickness
2. MIDAS Gen calculates the required length based on stress distribution

#### Boundary Element Reinforcement

1. **Vertical bars**: Designed as a column
   - Total area: As = Pu/(φ × f'c × 0.85) + Mu/(φ × fy × (d - a/2))
   - Minimum: 4 #16 (for small boundary elements)
   - Typical: 8 #22 to 12 #25 (for major boundary elements)
2. **Ties (confinement)**:
   - Per ACI 18.7.5.2:
   - #10 ties at 100mm spacing within boundary element
   - Cross-ties to confine the core
   - Volumetric ratio: ρs ≥ 0.12 × f'c/fyt

### Wall Design Output

| Parameter | Value |
|-----------|-------|
| Wall thickness | 300mm |
| Pier | P1 (left wall) |
| Pu | 2500 kN (compression) |
| Mu | 3500 kN·m |
| Vu | 800 kN |
| Vertical reinforcement | #16 @ 200mm each face |
| Horizontal reinforcement | #12 @ 200mm each face |
| Boundary element required | Yes (σ > 0.2f'c) |
| Boundary element | 500 × 300mm |
| Boundary bars | 8 #22 |
| Boundary ties | #10 @ 100mm |
| Shear capacity ratio | 0.72 |
| Flexural capacity ratio | 0.85 |

## Coupling Beam Design

### Coupling Beams (Spandrels)

For walls connected by coupling beams (lintels over openings):

1. Design > Concrete Spandrel Design
2. Set:
   - **Beam type**: Coupling beam (per ACI 18.10.7)
   - **Aspect ratio**: ln/d (clear span to depth)
3. If ln/d ≥ 4: Design as a regular beam
4. If ln/d < 4 and Vu > 4√f'c × bw × d:
   - **Diagonal reinforcement required**: Two intersecting groups of diagonal bars
   - Each group: As = Vu / (2 × φ × fy × sin α)
   - α = angle of diagonal bars to horizontal
5. If ln/d < 2:
   - **Diagonal reinforcement always required**

### Coupling Beam Output

| Parameter | Value |
|-----------|-------|
| Clear span | 1500mm |
| Depth | 800mm |
| ln/d | 1.875 (< 2) |
| Vu | 450 kN |
| Design method | Diagonal reinforcement |
| Diagonal bars | 4 #25 each direction |
| Transverse reinforcement | #10 @ 100mm |

## Wall Detailing

### Vertical Reinforcement Detailing

1. **Distribution**: Uniform on each face
2. **Spacing**: Maximum 450mm per ACI 11.6.1
3. **At boundaries**: Concentrate reinforcement at wall ends
4. **Lap splices**: 
   - Tension lap: 1.4 × ld (per ACI 25.5.2)
   - Stagger splices (not more than 50% at one section)

### Horizontal Reinforcement Detailing

1. **Distribution**: Uniform on each face
2. **Spacing**: Maximum 450mm per ACI 11.6.1
3. **At floor levels**: Additional horizontal bars for force transfer
4. **Hooked ends**: Standard hooks at wall ends

### Boundary Element Detailing

1. **Vertical bars**: Concentrated at wall end
2. **Ties**: Closely spaced (100mm) for confinement
3. **Cross-ties**: To confine entire core
4. **Extension**: Boundary elements extend over height where σ > 0.2f'c
5. **Transition**: Standard tie spacing above boundary element zone

## Common Wall Design Issues

### Excessive Shear Demand

**Cause**: High seismic load or insufficient wall length.
**Fix**: Increase wall length, increase wall thickness, add more walls, or use higher strength concrete.

### Boundary Element Too Large

**Cause**: High compressive stress at wall edge.
**Fix**: Increase wall length (reduces stress), increase wall thickness, or add flanges (L-shaped or T-shaped walls).

### Coupling Beam Fail

**Cause**: High shear in short coupling beams.
**Fix**: Increase beam depth, use diagonal reinforcement, or increase wall length to reduce coupling beam span.

### Wall Cracking

**Cause**: Service-level stresses exceed concrete tensile strength.
**Fix**: Increase reinforcement ratio, add crack control reinforcement, or increase wall thickness.

## Wrapping Up

Shear wall design in MIDAS Gen took us a while to get comfortable with, but the meshed wall approach gives you much more accurate force distribution than the simple pier model. The key things we've learned: mesh fine enough for accurate results, label your piers carefully so the force output is useful, and don't skimp on boundary element design in seismic zones — that's where walls fail when they fail.
