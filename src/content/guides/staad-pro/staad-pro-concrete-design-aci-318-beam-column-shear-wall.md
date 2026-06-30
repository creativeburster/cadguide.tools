---
title: "STAAD.Pro Concrete Design: ACI 318 Beam, Column, and Shear Wall Design"
excerpt: "A guide to reinforced concrete design in STAAD.Pro covering ACI 318 code checking for beams, columns, and shear walls, reinforcement calculation, interaction diagrams, and seismic detailing per ACI 318 Chapter 18."
category: "workflow"
softwareSlug: "staad-pro"
keyword: "staad pro concrete design aci"
slug: "staad-pro-concrete-design-aci-318-beam-column-shear-wall"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://docs.bentley.com/LiveContent/web/STAAD.Pro%20Help-v28/en/GUID-CONCRETE-DESIGN.html"
  - "https://www.bentley.com/software/staad/"
---

# STAAD.Pro Concrete Design: ACI 318 Beam, Column, and Shear Wall Design

Concrete design in STAAD.Pro follows ACI 318 for reinforced concrete structures. The workflow covers beam flexural and shear design, column interaction design, and shear wall design — all with automatic reinforcement calculation and seismic detailing. This guide covers the complete concrete design process.

## ACI 318 Design Setup

### Configuring Concrete Design

1. Design > Concrete Design
2. Select code: ACI 318-19
3. Set global parameters:
   - **FC**: Concrete compressive strength (e.g., 30 MPa)
   - **FY**: Rebar yield strength (420 MPa)
   - **FYH**: Stirrup/tie yield strength (420 MPa)
   - **Clear cover**: 40mm (beams), 40mm (columns), 75mm (foundations)
   - **Max aggregate size**: 20mm
   - **Bar sizes**: #3 to #11 (metric: 10mm to 36mm)

### Member-Specific Parameters

1. Select member(s)
2. Design > Concrete > Design Parameters
3. Set per member:

| Parameter | Beams | Columns | Shear Walls |
|-----------|-------|---------|-------------|
| FC | 30 MPa | 30-40 MPa | 30 MPa |
| FY | 420 MPa | 420 MPa | 420 MPa |
| Clear cover | 40mm | 40mm | 25mm |
| Max bar | 25mm | 25mm | 15mm |
| Stirrup/tie | 10mm | 10mm | 10mm |
| Min bars | 2 | 4 (min for columns) | 2 per layer |

## Beam Design

### Flexural Reinforcement

1. Design > Concrete > Design All (or select beams only)
2. STAAD calculates for each beam:
   - **Factored moment (Mu)**: From critical load combination
   - **Required steel area (As)**: From ACI 318 equation
   - **Minimum steel (As,min)**: Per ACI 9.6.1.2
   - **Maximum steel (As,max)**: Per ACI 21.5.2 (seismic) or 0.25ρb (non-seismic)
3. Output:
   - **Required As**: mm² (top and bottom)
   - **Selected bars**: e.g., 4 #20 (top), 3 #16 (bottom)
   - **Reinforcement ratio (ρ)**: As/(b×d)

### Shear Reinforcement (Stirrups)

1. STAAD calculates:
   - **Factored shear (Vu)**: From critical load combination
   - **Concrete shear capacity (φVc)**: φ × 0.17 × √f'c × b × d
   - **Required stirrup area (Av)**: (Vu - φVc) / (φ × fy × d)
   - **Spacing (s)**: Av × fy × d / (Vu - φVc)
2. Output:
   - **Stirrup size**: e.g., #10 (10mm)
   - **Spacing at critical section**: e.g., 100mm
   - **Spacing at midspan**: e.g., 200mm
   - **Minimum spacing**: Per ACI 9.7.6.2

### Beam Design Output

For each beam, STAAD reports:

| Parameter | Value |
|-----------|-------|
| Section | 300 × 600mm |
| Mu (top) | 250 kN·m |
| Mu (bottom) | 180 kN·m |
| As required (top) | 1450 mm² |
| As required (bottom) | 980 mm² |
| Bars (top) | 4 #22 |
| Bars (bottom) | 3 #20 |
| Vu | 180 kN |
| Stirrups | #10 @ 150mm |
| Capacity ratio | 0.85 |

## Column Design

### Axial + Biaxial Bending

1. Design > Concrete > Design All (or select columns only)
2. STAAD performs:
   - **Factored loads**: Pu, Mux, Muy from critical combination
   - **Interaction diagram**: Generate P-M curve for the column section
   - **Check**: Plot (Pu, Mux, Muy) on the interaction surface
   - **Capacity ratio**: Demand/capacity based on interaction

### Interaction Diagram

1. Post-processing > Concrete > Column Interaction
2. View the interaction diagram:
   - **X-axis**: Moment (M)
   - **Y-axis**: Axial load (P)
   - **Curves**: For different reinforcement ratios (1%, 2%, 3%, 4%)
   - **Point**: Factored demand (Pu, Mu)
3. Verify that the demand point is inside the capacity curve
4. If outside: increase section size or reinforcement ratio

### Column Reinforcement

1. STAAD calculates:
   - **Longitudinal bars**: Total area required
   - **Bar arrangement**: Symmetric layout (e.g., 4 corners, 8 total)
   - **Reinforcement ratio**: ρ = As/Ag (1% to 8% per ACI)
   - **Tie spacing**: Per ACI 25.7.2
2. Output:
   - **Section**: 400 × 400mm
   - **Bars**: 8 #22 (2.4% reinforcement)
   - **Ties**: #10 @ 300mm (standard), #10 @ 100mm (confinement zone)

### Seismic Column Detailing (ACI 318 Ch. 18)

For columns in seismic force-resisting systems:

1. **Special moment frames (SMF)**:
   - Minimum reinforcement: ρ ≥ 1%
   - Maximum reinforcement: ρ ≤ 6%
   - Confinement: Ties at 100mm spacing over height ℓo = max(h/6, 450mm, depth/4)
   - Strong-column/weak-beam: ΣMn,col ≥ 1.2 × ΣMn,beam

2. **Confinement reinforcement**:
   - Transverse reinforcement in plastic hinge regions
   - #10 ties at 100mm spacing
   - Cross-ties to confine core concrete
   - Volumetric ratio: ρs ≥ 0.12 × f'c/fyt (spiral) or equivalent rectangular

## Shear Wall Design

### Wall Modeling

1. Model shear walls as:
   - **Plate elements**: Meshed finite elements (for complex walls)
   - **Surface elements**: STAAD surface entities (simplified)
2. Assign wall thickness (e.g., 250mm)
3. Assign concrete material (f'c = 30 MPa)

### Wall Analysis Results

1. Post-processing > Plate > Forces
2. View:
   - **In-plane forces**: Nxx (axial), Nyy (vertical), Nxy (shear)
   - **Out-of-plane forces**: Mxx, Myy, Mxy (bending moments)
   - **Principal forces**: Maximum and minimum stress directions

### Wall Reinforcement Design

1. Design > Concrete > Shear Wall Design
2. STAAD designs:
   - **Vertical reinforcement**: Required area per meter (mm²/m)
   - **Horizontal reinforcement**: Required area per meter (mm²/m)
   - **Boundary elements**: If stress exceeds 0.2 × f'c, boundary elements required
3. Output:
   - **Vertical bars**: #16 @ 200mm each face (total: 2 × 1000/200 × 201 = 2010 mm²/m)
   - **Horizontal bars**: #12 @ 250mm each face
   - **Boundary elements**: 600 × 600mm with 8 #22 bars and #10 ties @ 100mm

### Boundary Element Check

1. STAAD checks if boundary elements are required:
   - Calculate maximum compressive stress: σ = N/A + M/Z
   - If σ > 0.2 × f'c: boundary elements required
2. If required:
   - Design boundary elements as columns
   - Provide confined core with closely spaced ties
   - Extend boundary elements over the height where σ > 0.2 × f'c

## Load Combinations for Concrete Design

### Strength Combinations (LRFD)

1. **Combo 1**: 1.4 × (D + F)
2. **Combo 2**: 1.2D + 1.6L + 0.5(Lr or S or R)
3. **Combo 3**: 1.2D + 1.0W + 1.0L + 0.5(Lr or S or R)
4. **Combo 4**: 1.2D + 1.0E + 1.0L + 0.2S
5. **Combo 5**: 0.9D + 1.0W
6. **Combo 6**: 0.9D + 1.0E

### Seismic Combinations (ACI 318 Ch. 18)

1. **Combo 7**: 1.2D + 1.0E + 0.5L + 0.2S
2. **Combo 8**: 0.9D + 1.0E
3. With overstrength (Ω₀):
   - **Combo 9**: 1.2D + Ω₀ × E + 0.5L + 0.2S
   - For columns, walls, and foundations

## Detailing Output

### Beam Schedule

| Mark | Section | Top Bars | Bottom Bars | Stirrups | Length |
|------|---------|----------|-------------|----------|--------|
| B1 | 300×600 | 4#22 | 3#20 | #10@150 | 6000 |
| B2 | 250×500 | 3#20 | 2#16 | #10@200 | 4500 |
| B3 | 300×600 | 4#22 | 4#22 | #10@100/200 | 6000 |

### Column Schedule

| Mark | Section | Bars | Ties | Height | Type |
|------|---------|------|------|--------|------|
| C1 | 400×400 | 8#22 | #10@100/300 | 3500 | Rectangular |
| C2 | 500×500 | 12#25 | #10@100/300 | 3500 | Rectangular |
| C3 | Ø500 | 8#22 | Spiral #10@75 | 3500 | Circular |

## Common Concrete Design Issues

### Insufficient Flexural Capacity

**Cause**: Beam section too small or reinforcement insufficient.
**Fix**: Increase section depth (most effective for moment capacity), add more bars, use higher grade steel (fy = 520 MPa).

### High Shear Demand

**Cause**: Heavy loads or long spans.
**Fix**: Increase beam width, use higher strength concrete, add shear reinforcement, consider shear friction.

### Column Capacity Exceeded

**Cause**: High axial load or biaxial moments.
**Fix**: Increase column size, increase reinforcement ratio (up to 6% for seismic), use higher strength concrete.

### Boundary Element Required

**Cause**: High compressive stress in wall edges.
**Fix**: Add boundary elements with confined reinforcement, increase wall thickness, or redistribute lateral forces.

## Conclusion

STAAD.Pro's concrete design module provides comprehensive ACI 318 code checking for beams, columns, and shear walls. The automatic reinforcement calculation, interaction diagram generation, and seismic detailing per ACI Chapter 18 cover the complete concrete design workflow. The key to efficient concrete design is selecting appropriate section sizes early (to avoid redesign), understanding the interaction between axial and flexural capacity in columns, and properly configuring boundary elements in shear walls for seismic resistance. By following this workflow, structural engineers can produce code-compliant concrete designs with detailed reinforcement output ready for construction drawings.
