---
title: "CYPECAD Foundation Design: Spread Footings, Pile Caps, and Mat Foundations per Eurocode 7"
excerpt: "A guide to foundation design in CYPECAD covering isolated and combined footings, pile cap design, mat foundation analysis, soil-structure interaction, and bearing capacity checks per Eurocode 7 (EN 1997-1)."
category: "workflow"
softwareSlug: "cypecad"
keyword: "cypecad foundation design eurocode 7"
slug: "cypecad-foundation-design-spread-footings-pile-caps-mat-eurocode-7"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://manual.cype.com/cypecad/foundations/"
  - "https://www.cype.com/en/cypecad/"
---

# CYPECAD Foundation Design: Spread Footings, Pile Caps, and Mat Foundations per Eurocode 7

Foundation design in CYPECAD is something I've come to rely on for Eurocode 7 projects. The integration with the superstructure model means you don't have to export reactions to a separate tool — everything stays in one project. I've used it for isolated footings, pile caps, and mat foundations on projects in Spain and Portugal. Let me walk you through the workflow.

## Soil Parameters

### Defining Soil Profile

1. Foundations > Soil Profile
2. Set:
   - **Bearing capacity (Rd)**: Allowable bearing pressure (e.g., 250 kN/m²)
   - **Soil type**: Sand, clay, or rock
   - **Groundwater level**: Depth below surface (e.g., 2.5m)
   - **Soil layers**: Multiple layers with different properties
3. For pile design:
   - **Shaft friction**: Per soil layer (kN/m²)
   - **End bearing**: Base resistance (kN/m²)
   - **Pile type**: Driven, bored, CFA

### Eurocode 7 Design Approaches

1. Set design approach per EN 1997-1:
   - **DA1** (UK, recommended): Combination 1 (1.35G + 1.5Q) and Combination 2 (1.0G + 1.3Q)
   - **DA2** (France): Factor actions and ground resistance
   - **DA3** (Netherlands): Factor ground properties
2. CYPECAD applies the selected approach automatically

## Isolated Footing Design

### Creating an Isolated Footing

1. Foundations > Isolated Footing
2. Select column (at base level)
3. Set:
   - **Shape**: Square, rectangular, or circular
   - **Initial dimensions**: e.g., 2.0m × 2.0m × 0.5m
   - **Depth below ground**: e.g., 1.5m
   - **Concrete**: C25/30
   - **Reinforcement**: B500S
   - **Cover**: 50mm (foundations)

### Bearing Capacity Check

1. CYPECAD calculates bearing pressure:
   - **Centric load**: p = N / (b × l)
   - **Eccentric load**: p = N/(b×l) ± 6M/(b×l²) ± 6M'/(b²×l)
2. Check per EN 1997-1:
   - **Serviceability**: p ≤ Rd (allowable bearing)
   - **No uplift**: pmin ≥ 0 (no tension on soil)
3. If pressure exceeds Rd: increase footing dimensions

### Structural Design

1. **One-way shear** (at distance d from column face):
   - Vu = p × (tributary area)
   - VRd,c = 0.18/γc × ξ × (100 × ρl × fck)^(1/3) × b × d
   - Check: Vu ≤ VRd,c
2. **Punching shear** (at perimeter d/2 from column):
   - Vu = p × (area outside punching perimeter)
   - VRd,c = 0.18/γc × ξ × (100 × ρl × fck)^(1/3) × u × d
   - Check: Vu ≤ VRd,c
3. **Flexural reinforcement**:
   - Mu = p × (cantilever length)² / 2
   - As = Mu / (fyd × z), z ≈ 0.9d
   - Minimum: As,min = max(0.26 × fctm/fyk, 0.0013) × b × d

### Footing Output

| Parameter | Value |
|-----------|-------|
| Dimensions | 2.5m × 2.5m × 0.6m |
| Bearing pressure (max) | 210 kN/m² < 250 ✓ |
| One-way shear | Vu=280 < VRd,c=350 ✓ |
| Punching shear | Vu=520 < VRd,c=680 ✓ |
| Reinforcement | Ø16 @ 150mm both ways |
| Steel weight | 85 kg |

## Combined Footing Design

### When to Use Combined Footings

- Two columns too close for separate footings
- Column at property line (eccentric loading)
- Bearing capacity insufficient for isolated footings

### Creating a Combined Footing

1. Foundations > Combined Footing
2. Select two or more columns
3. Set:
   - **Shape**: Rectangular or trapezoidal
   - **Dimensions**: Width and length
   - **Thickness**: 600-1000mm
4. CYPECAD analyzes as a beam on elastic foundation:
   - Soil modeled as Winkler springs
   - Subgrade modulus: ks (kN/m³)
   - Calculates pressure distribution, shear, and moment

### Design Checks

1. **Bearing pressure**: Uniform or trapezoidal ≤ Rd
2. **Beam shear**: At column faces
3. **Punching shear**: At each column
4. **Flexural design**: Top and bottom reinforcement
5. **Development length**: Bars must extend past critical sections

## Pile Cap Design

### Pile Definition

1. Foundations > Piles
2. Set:
   - **Pile type**: Bored, driven, or CFA
   - **Diameter**: 600mm, 800mm, 1000mm
   - **Length**: e.g., 15m
   - **Capacity**: Compression, tension, lateral
   - **Shaft friction**: Per soil layer
   - **End bearing**: Base resistance

### Pile Cap Creation

1. Foundations > Pile Cap
2. Select column
3. Set:
   - **Number of piles**: 2, 3, 4, 5, 6, 9
   - **Pile spacing**: 3 × diameter minimum
   - **Cap dimensions**: Thickness, width, length
4. CYPECAD arranges piles and designs the cap

### Pile Load Check

1. CYPECAD calculates pile loads:
   - **Axial per pile**: N/n ± My × x/I ± Mx × y/I
   - **Maximum pile load**: ≤ pile capacity
   - **Minimum pile load**: ≥ 0 (no tension) or ≤ tension capacity
2. If maximum load exceeds capacity:
   - Add more piles
   - Increase pile diameter
   - Increase pile length

### Pile Cap Structural Design

1. **Punching shear**: At column and at individual piles
2. **Beam shear**: Between piles
3. **Flexural reinforcement**: Top and bottom mats
4. **Detailing**: Bars must anchor around piles

## Mat Foundation Design

### Creating a Mat Foundation

1. Foundations > Mat Foundation
2. Set:
   - **Plan area**: Covers entire building footprint
   - **Thickness**: 800-2000mm
   - **Soil model**: Winkler springs (ks) or soil profile
   - **Mesh**: Auto-mesh or manual

### Mat Analysis

1. CYPECAD models the mat as FEM plate elements:
   - **Element type**: 4-node or 8-node plate
   - **Mesh size**: 0.5m × 0.5m to 1.0m × 1.0m
   - **Soil springs**: One per node (ks × tributary area)
2. Apply column loads at node locations
3. CYPECAD calculates:
   - **Pressure distribution**: Varies across the mat
   - **Plate moments**: Mx, My, Mxy per element
   - **Shear**: At column perimeters
   - **Settlement**: Total and differential

### Mat Design Checks

1. **Bearing pressure**: Maximum ≤ Rd at all locations
2. **Settlement**: Total and differential within tolerable limits
3. **Punching shear**: At each column
4. **One-way shear**: At critical sections
5. **Flexural reinforcement**: Based on plate moment output

### Mat Reinforcement

1. From plate moment output:
   - **Mx**: Reinforcement in X direction
   - **My**: Reinforcement in Y direction
   - **Top mat**: For hogging moments (near columns)
   - **Bottom mat**: For sagging moments (mid-span)
2. Calculate As per meter:
   - As = Mu / (fyd × z), z ≈ 0.9d
3. Select bar size and spacing:
   - Typical: Ø20 @ 200mm both ways, top and bottom
   - Extra reinforcement at column locations

## Retaining Wall Design

### Basement Walls

1. Walls > Retaining Wall
2. Set:
   - **Wall type**: Cantilever, propped, or anchored
   - **Height**: e.g., 4.0m (basement depth)
   - **Soil properties**: φ (friction angle), c (cohesion), γ (unit weight)
   - **Surcharge**: e.g., 10 kN/m² (traffic load)
   - **Water pressure**: Hydrostatic if applicable
3. CYPECAD calculates:
   - **Active earth pressure**: Ka × γ × H (Rankine or Coulomb)
   - **Surcharge pressure**: Ka × q
   - **Water pressure**: 0.5 × γw × H²
   - **Total lateral force**: E = earth + surcharge + water
4. Design checks:
   - **Overturning stability**: resisting moment / overturning moment ≥ 1.5
   - **Sliding stability**: resisting force / driving force ≥ 1.5
   - **Bearing capacity**: Under footing
   - **Structural design**: Wall stem and base reinforcement

## Foundation Drawings

### Automatic Drawing Generation

1. Drawings > Foundation Drawings
2. CYPECAD generates:
   - **Foundation plan**: Footing/pile cap layout with dimensions
   - **Footing details**: Section views with reinforcement
   - **Pile cap details**: Plan and section with bar layout
   - **Mat reinforcement plan**: Top and bottom reinforcement layout
   - **Retaining wall details**: Section with stem and base reinforcement
3. Export to DXF/DWG for CAD integration

## Common Foundation Issues

### Bearing Capacity Exceeded

**Cause**: Footing too small or soil capacity overestimated.
**Fix**: Increase footing dimensions, verify soil report, use piles, or improve soil.

### Excessive Settlement

**Cause**: Soft soil, heavy loads, or large footing area.
**Fix**: Increase footing depth, use piles to stiffer strata, or use mat foundation.

### Pile Capacity Insufficient

**Cause**: Pile too short, too small, or soil friction overestimated.
**Fix**: Increase pile length, increase diameter, add more piles, or use end-bearing piles.

### Differential Settlement

**Cause**: Variable soil or uneven loading.
**Fix**: Use mat foundation, adjust footing sizes to equalize pressure, or use piles to uniform strata.

## Wrapping Up

Foundation design in CYPECAD is efficient because it's integrated — no exporting reactions to a separate tool. The Eurocode 7 design approaches (DA1, DA2, DA3) are all supported, and the software handles the partial factor combinations for you. My advice: get the soil parameters right from the geotechnical report, and don't forget to check differential settlement — it's the thing that causes the most problems in practice.
