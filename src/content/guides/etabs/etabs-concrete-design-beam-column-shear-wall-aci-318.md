---
title: "ETABS Concrete Design: Beam, Column, and Shear Wall Design per ACI 318"
excerpt: "ETABS concrete design tools design beams, columns, and shear walls per ACI 318. I cover design preferences, beam flexural and shear design, column interaction diagrams, shear wall design, and design output interpretation for reinforced concrete buildings."
category: "workflow"
softwareSlug: "etabs"
keyword: "ETABS concrete design beam column shear wall ACI 318 flexural shear interaction diagram reinforced concrete design output"
slug: "etabs-concrete-design-beam-column-shear-wall-aci-318"
author: "CAD IT Admin"
readTime: "11 min"
date: "2025-06-29"
sources:
  - "https://www.csiamerica.com/products/etabs"
  - "https://www.csiamerica.com/support/learn"

---

# ETABS Concrete Design: Beam, Column, and Shear Wall Design per ACI 318

I've designed reinforced concrete buildings in ETABS for residential, commercial, and institutional projects. ETABS's concrete design module automates the design of beams, columns, and shear walls per ACI 318, generating reinforcement requirements and interaction diagrams. Understanding the design preferences, output interpretation, and code requirements is essential for producing safe and economical concrete designs.

## Concrete Design Overview

ETABS concrete design includes:
- **Beam design**: Flexural reinforcement (top and bottom), shear reinforcement (stirrups)
- **Column design**: Axial-flexural interaction, shear reinforcement, confinement
- **Shear wall design**: Flexural reinforcement, shear reinforcement, boundary elements
- **Slab design**: One-way and two-way slab reinforcement (limited in ETABS — use SAFE for detailed slab design)

## Design Preferences

### Setting Up ACI 318 Design

1. Go to **Design** → **Concrete Frame Design** → **View/Revise Preferences**
2. Set design code:
   - **Design code**: ACI 318-19 (or ACI 318-14, ACI 318-11)
3. Set design parameters:
   - **Reinforcement strength (Fy)**: 420 MPa (60 ksi) for Grade 60
   - **Concrete strength (f'c)**: From material definition
   - **Max reinforcement ratio**: 0.025 (beams), 0.06 (columns, total)
   - **Min reinforcement ratio**: Per ACI 318 minimums
   - **Clear cover**: 40mm (1.5") for beams, 40mm for columns (interior), 50mm (2") for exterior
   - **Shear reinforcement (Fyt)**: 420 MPa (60 ksi)
   - **Max aggregate size**: 19mm (3/4") — affects minimum spacing
4. Set design options:
   - **Use moment magnification**: For slender columns
   - **Consider P-Delta**: If P-Delta analysis was run
   - **Design for biaxial bending**: For columns
5. Click **OK**

### Design Combinations

1. Go to **Design** → **Concrete Frame Design** → **Select Design Combos**
2. ETABS auto-selects strength load combinations
3. Verify the combinations include:
   - **1.4D**: Maximum axial
   - **1.2D + 1.6L**: Maximum gravity
   - **1.2D + 1.0L + 1.0E**: Seismic combinations
   - **0.9D + 1.0E**: Uplift/seismic
   - **1.2D + 1.0L + 1.0W**: Wind combinations
   - **0.9D + 1.0W**: Uplift/wind
4. Click **OK**

## Beam Design

### Running Beam Design

1. Go to **Design** → **Concrete Frame Design** → **Start Design/Check**
2. ETABS designs all beams for the selected load combinations
3. Results are displayed on the model:
   - **Green**: Design passes (capacity > demand)
   - **Red**: Design fails (demand > capacity) — increase section or reinforcement
   - **Yellow**: Over-reinforced or warnings

### Beam Flexural Design Output

1. Select a beam
2. Right-click → **Concrete Beam Design**
3. The design output shows:
   - **Design moments**: Mu (factored moment) at each station
   - **Required reinforcement**: As (area of steel) at top and bottom
   - **Provided reinforcement**: Number and size of bars
   - **Reinforcement ratio**: ρ = As / (b × d)
   - **Minimum reinforcement**: ρmin per ACI 318
   - **Maximum reinforcement**: ρmax = 0.025 (or per code)
4. Check:
   - **Top steel**: Required at supports (negative moment)
   - **Bottom steel**: Required at midspan (positive moment)
   - **Minimum steel**: ACI 318 minimum: ρmin = max(1.4/fy, √f'c/(4×fy))
   - **Maximum steel**: ρ ≤ 0.025 for ductile beams

### Beam Shear Design Output

1. In the beam design output, check shear:
   - **Design shear**: Vu (factored shear) at each station
   - **Concrete shear capacity**: φVc = φ × 0.17 × √f'c × b × d
   - **Required stirrup area**: Av/s (area per spacing)
   - **Provided stirrups**: Bar size and spacing
   - **Minimum stirrups**: Av,min = 0.062 × √f'c × b × s / fyt
   - **Maximum spacing**: min(d/2, 600mm) for non-seismic, tighter for seismic
5. For seismic design (special moment frames):
   - **Confinement**: Closer stirrup spacing at ends (within 2h from joint)
   - **Shear capacity**: Design for shear corresponding to probable moment strength
   - **Stirrup spacing**: s ≤ min(d/4, 100mm, 8×db_longitudinal) within confinement zone

### Beam Design Summary Table

1. Display → Show Tables → Concrete Beam Design
2. The table shows for each beam:
   - **Section**: Beam section name
   - **Station**: Location along the beam
   - **Mu**: Design moment
   - **Vu**: Design shear
   - **As-top**: Required top reinforcement area
   - **As-bot**: Required bottom reinforcement area
   - **Av/s**: Required stirrup area per spacing
   - **Ratio**: Capacity/demand ratio
3. Export to Excel for review and documentation

## Column Design

### Column Interaction Diagram

1. Select a column
2. Right-click → **Concrete Column Design**
3. The interaction diagram shows:
   - **X axis**: Moment M (about one axis)
   - **Y axis**: Axial force P
   - **Capacity curve**: The P-M interaction envelope
   - **Design point**: (P, M) from the governing load combination
   - **Capacity ratios**: For each load combination
4. Check:
   - **Design point inside the curve**: Column is adequate
   - **Design point outside the curve**: Column fails — increase section or reinforcement
   - **Biaxial bending**: Check both axes (M2-2 and M3-3)

### Column Design Output

1. The column design output shows:
   - **Design axial force**: Pu (factored axial)
   - **Design moments**: Mu2 and Mu3 (biaxial)
   - **Required longitudinal reinforcement**: As,total
   - **Provided reinforcement**: Number and size of bars
   - **Reinforcement ratio**: ρg = As / Ag
   - **Minimum reinforcement**: ρmin = 0.01 (ACI 318)
   - **Maximum reinforcement**: ρmax = 0.06 (ACI 318, total)
   - **Tie spacing**: Required confinement spacing
2. For seismic design (special moment frames):
   - **Strong column-weak beam**: ΣMnc ≥ 1.2 × ΣMnb at each joint
   - **Confinement**: Closer tie spacing within confinement zone (lo/4)
   - **Transverse reinforcement**: For ductility and shear

### Column Capacity Ratio

1. The capacity ratio = Demand / Capacity
   - **< 1.0**: Column is adequate
   - **> 1.0**: Column is overstressed — increase section
2. Check the governing load combination:
   - **High axial, low moment**: Gravity governs
   - **Low axial, high moment**: Seismic or wind governs
   - **High axial, high moment**: Combined loading

## Shear Wall Design

### Running Shear Wall Design

1. Go to **Design** → **Concrete Shear Wall Design** → **Start Design/Check**
2. ETABS designs shear walls for:
   - **Flexural capacity**: In-plane bending (moment about the wall axis)
   - **Shear capacity**: In-plane shear
   - **Boundary elements**: Concentrated reinforcement at wall ends
3. Results show:
   - **Green**: Design passes
   - **Red**: Design fails — increase wall thickness or reinforcement

### Shear Wall Design Output

1. Select a wall pier (vertical segment)
2. Right-click → **Shear Wall Design**
3. The output shows:
   - **Design axial force**: Pu
   - **Design in-plane moment**: Mu
   - **Design in-plane shear**: Vu
   - **Required boundary reinforcement**: As,boundary (at each end)
   - **Required web reinforcement**: ρv (vertical) and ρh (horizontal)
   - **Boundary element requirement**: Whether boundary elements are needed per ACI 318
4. Boundary elements are required when:
   - **Stress > 0.2 × f'c**: At the wall edge under design loads
   - **Special boundary elements**: For seismic design (special shear walls)

### Shear Wall Reinforcement

1. **Vertical reinforcement**:
   - **Minimum**: ρv ≥ 0.0025 (ACI 318)
   - **Spacing**: s ≤ min(lw/3, lw, 450mm)
   - **Boundary zones**: Concentrated reinforcement at ends
2. **Horizontal reinforcement**:
   - **Minimum**: ρh ≥ 0.0025
   - **Spacing**: s ≤ min(lw/5, 450mm)
3. **Boundary elements**:
   - **Confinement**: Transverse reinforcement in boundary elements
   - **Spacing**: s ≤ min(bw/3, 100mm, 6×db_longitudinal) for seismic
   - **Length**: Extend from the wall edge for the required distance

## Design Output and Reporting

### Design Summary Tables

1. Display → Show Tables → Concrete Design
2. Available tables:
   - **Beam Design Summary**: Section, moments, reinforcement, ratio
   - **Column Design Summary**: Axial, moments, reinforcement, ratio
   - **Shear Wall Design Summary**: Forces, reinforcement, boundary elements
3. Export to Excel:
   - Right-click → Export to Excel
   - Use for design documentation and drawing preparation

### Graphical Display

1. Display → Show Design Output
2. Options:
   - **Beam reinforcement**: Show required As at top and bottom
   - **Column reinforcement**: Show required As and capacity ratio
   - **Shear wall reinforcement**: Show required reinforcement
3. Color coding:
   - **Green**: Adequate (ratio < 1.0)
   - **Yellow**: Marginal (0.85 < ratio < 1.0)
   - **Red**: Inadequate (ratio > 1.0)

## Common Issues

### Beam Fails in Flexure

- Increase the beam depth (most effective for moment capacity)
- Increase the beam width
- Use higher strength concrete (f'c)
- Use higher strength reinforcement (Fy)
- Add more reinforcement bars (check ρmax = 0.025)
- Redistribute moments (if allowed by code)

### Column Fails (Design Point Outside Interaction Diagram)

- Increase the column section (width or depth)
- Add more longitudinal reinforcement (up to ρmax = 0.06)
- Use higher strength concrete
- Use higher strength reinforcement
- Check if the column is part of a moment frame (may need larger section for ductility)

### Shear Wall Fails in Shear

- Increase the wall thickness
- Increase the horizontal reinforcement ratio
- Use higher strength concrete
- Add more shear walls to reduce the demand per wall
- Check the wall configuration (longer walls have higher shear capacity)

### Beam Fails in Shear

- Increase the beam width (increases Vc)
- Increase the stirrup area or reduce spacing
- Use higher strength concrete
- Check for deep beam behavior (span/depth < 4)

### Column Capacity Ratio Is Close to 1.0

- Consider increasing the section for safety margin
- Check if the governing load combination is correct
- Verify the load factors
- Consider moment magnification for slender columns

## Summary

ETABS concrete design automates beam, column, and shear wall design per ACI 318. Set design preferences (code, rebar strength, cover, limits) and verify design combinations. Run beam design to get required flexural reinforcement (top and bottom) and shear reinforcement (stirrups) — check against ACI minimums and maximums. Run column design to get the interaction diagram and required longitudinal reinforcement — verify the design point is inside the capacity curve. Run shear wall design to get boundary element requirements and web reinforcement — check boundary element confinement for seismic design. Review design summary tables and export to Excel for documentation. The most common issues — beam flexural failure, column failure, and shear wall shear failure — are addressed by increasing section dimensions, adding reinforcement, using higher strength materials, and adjusting the structural system. ETABS's concrete design module provides comprehensive output for producing safe and economical reinforced concrete building designs.
