---
title: "STAAD.Pro Foundation Design: Isolated Footings, Combined Footings, and Mat Foundations"
excerpt: "A guide to foundation design using STAAD.Pro and STAAD Foundation Advanced covering isolated spread footings, combined footings, strap footings, mat foundation analysis, soil-structure interaction, and bearing capacity checks."
category: "workflow"
softwareSlug: "staad-pro"
keyword: "staad pro foundation design"
slug: "staad-pro-foundation-design-isolated-combined-mat-foundations"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://docs.bentley.com/LiveContent/web/STAAD.Foundation%20Advanced%20Help-v8i/en/GUID-FOUNDATION.html"
  - "https://www.bentley.com/software/staad-foundation-advanced/"
---

# STAAD.Pro Foundation Design: Isolated Footings, Combined Footings, and Mat Foundations

Foundation design is where a lot of engineers get nervous. The soil-structure interaction, the geotechnical report, the bearing capacity checks — there's a lot riding on getting it right. STAAD.Pro with STAAD Foundation Advanced (SFA) handles isolated footings, combined footings, pile caps, and mat foundations. Let us walk you through the workflow we use.

## Exporting Reactions from STAAD.Pro

### Preparing the Structural Model

Before foundation design:
1. Complete the STAAD.Pro analysis
2. Verify support reactions are reasonable:
   - Check for uplift (tension) reactions
   - Check for excessive eccentricity
   - Verify load combinations include all foundation-critical cases
3. Include service load combinations (unfactored) for bearing pressure checks
4. Include strength load combinations (factored) for structural design of the footing

### Exporting Reactions

1. In STAAD.Pro: Post-processing > Reactions
2. File > Export > Foundation Reactions
3. Select:
   - **Load cases**: All service and strength combinations
   - **Format**: STAAD Foundation Advanced (.sfa)
4. The reaction file contains:
   - Node number
   - FX, FY, FZ (forces)
   - MX, MY, MZ (moments)
   - For each load case

## STAAD Foundation Advanced Setup

### Creating a New Project

1. Open STAAD Foundation Advanced
2. File > New Project
3. Set:
   - **Project name**: e.g., "Office Building Foundation"
   - **Unit system**: Metric (kN, m, mm) or Imperial (kip, ft, in)
   - **Design code**: ACI 318, IS 456, EN 1992-1-1, or BS 8110

### Soil Parameters

1. Project > Soil Profile
2. Set:
   - **Soil type**: Sand, clay, or rock
   - **Bearing capacity (qa)**: Allowable bearing pressure (e.g., 200 kN/m²)
   - **Subgrade modulus (ks)**: e.g., 25,000 kN/m³ (medium soil)
   - **Groundwater table depth**: e.g., 3.0m below surface
   - **Soil layers**: Define multiple layers if applicable

### Importing Reactions

1. File > Import > STAAD.Pro Reactions
2. Select the .sfa file exported from STAAD.Pro
3. Reactions appear at each support node
4. Verify reaction values match STAAD.Pro output

## Isolated Footing Design

### Creating a Spread Footing

1. Design > Isolated Footing
2. Select the support node (column location)
3. Set footing parameters:
   - **Footing type**: Square, rectangular, or circular
   - **Initial dimensions**: e.g., 2.0m × 2.0m × 0.5m thick
   - **Depth below ground**: e.g., 1.5m
   - **Column dimensions**: e.g., 400mm × 400mm
   - **Concrete strength**: f'c = 30 MPa
   - **Rebar grade**: fy = 420 MPa
   - **Clear cover**: 75mm

### Bearing Pressure Check

1. STAAD calculates bearing pressure for each load combination:
   - **Uniform pressure**: P/A (for concentric load)
   - **Trapezoidal pressure**: P/A ± M/Z (for eccentric load)
2. Check against allowable bearing capacity:
   - Maximum pressure ≤ qa (allowable)
   - Minimum pressure ≥ 0 (no uplift)
3. If pressure exceeds qa: increase footing dimensions
4. If uplift occurs: increase footing size or add tie beams

### One-Way Shear Check

1. STAAD checks shear at distance d from column face:
   - **Critical section**: d away from column face (d = effective depth)
   - **Shear demand**: Vu = bearing pressure × tributary area
   - **Shear capacity**: φVc = φ × 0.17 × √f'c × b × d
   - **Check**: Vu ≤ φVc
2. If check fails: increase footing depth

### Two-Way Shear (Punching Shear) Check

1. STAAD checks punching shear at perimeter d/2 from column face:
   - **Critical perimeter**: bo = 2 × (c + d) for square column
   - **Shear demand**: Vu = bearing pressure × (footing area − punching area)
   - **Shear capacity**: φVc = φ × 0.33 × √f'c × bo × d
   - **Check**: Vu ≤ φVc
2. If check fails: increase footing depth

### Flexural Reinforcement

1. STAAD calculates:
   - **Moment**: Mu = bearing pressure × cantilever length² / 2
   - **Required steel**: As = Mu / (0.87 × fy × d)
   - **Minimum steel**: As,min = max(1.4/fy × b × d, 0.0018 × b × d)
2. Select bars:
   - **Bar size**: #16, #20, #25
   - **Spacing**: Calculated from As and bar area
   - **Both directions**: Reinforcement in X and Y

### Footing Output

| Parameter | Value |
|-----------|-------|
| Dimensions | 2.5m × 2.5m × 0.6m |
| Bearing pressure (max) | 185 kN/m² < 200 kN/m² ✓ |
| One-way shear | Vu=320 < φVc=415 ✓ |
| Two-way shear | Vu=580 < φVc=720 ✓ |
| Reinforcement | #16 @ 150mm both ways |
| Bar count | 17 bars each way |

## Combined Footing Design

### When to Use Combined Footings

- When two columns are too close for separate isolated footings
- When a column is at the property line (eccentric loading)
- When bearing capacity is low and footings overlap

### Creating a Combined Footing

1. Design > Combined Footing
2. Select two or more support nodes
3. Set parameters:
   - **Footing shape**: Rectangular or trapezoidal
   - **Dimensions**: Width and length (initial estimate)
   - **Thickness**: Typically 600-1000mm
4. STAAD analyzes the footing as a beam on elastic foundation:
   - Soil modeled as springs (Winkler foundation)
   - Subgrade modulus: ks (kN/m³)
   - Calculates pressure distribution, shear, and moment

### Design Checks

1. **Bearing pressure**: Uniform or trapezoidal ≤ qa
2. **Beam shear**: At column faces
3. **Punching shear**: At each column
4. **Flexural design**: Top and bottom reinforcement
5. **Development length**: Bars must extend past critical sections

## Pile Cap Design

### Creating a Pile Cap

1. Design > Pile Cap
2. Select the support node (column)
3. Set:
   - **Pile type**: Driven, bored, or CFA
   - **Pile diameter**: e.g., 600mm
   - **Pile capacity**: Axial (compression + tension), lateral
   - **Pile spacing**: Typically 3 × diameter minimum
   - **Number of piles**: 2, 3, 4, 5, 6, or more
   - **Pile cap dimensions**: Thickness, width, length

### Pile Layout

Common pile layouts:
- **2 piles**: One row (line)
- **3 piles**: Triangle
- **4 piles**: Square
- **5 piles**: Square + center
- **6 piles**: Rectangular (2×3)
- **9 piles**: Square (3×3)

### Pile Load Check

1. STAAD calculates pile loads:
   - **Axial load per pile**: P/n ± Our × x/we ± Mx × y/we
   - **Maximum pile load**: Must be ≤ pile capacity
   - **Minimum pile load**: Must be ≥ 0 (no tension) or ≤ tension capacity
2. If maximum pile load exceeds capacity:
   - Add more piles
   - Increase pile diameter
   - Adjust pile spacing

### Pile Cap Structural Design

1. **Punching shear**: At column and at individual piles
2. **Beam shear**: Between piles
3. **Flexural reinforcement**: Top and bottom mats
4. **Detailing**: Bars must anchor adequately around piles

## Mat Foundation Design

### Creating a Mat Foundation

1. Design > Mat Foundation
2. Set:
   - **Mat dimensions**: Plan area (covers entire building footprint)
   - **Thickness**: Typically 800-2000mm
   - **Soil model**: Winkler springs (ks) or soil profile
   - **Finite element mesh**: Auto-mesh or manual

### Mat Analysis

1. STAAD models the mat as a finite element plate:
   - **Plate elements**: 4-node or 8-node
   - **Mesh size**: 0.5m × 0.5m to 1.0m × 1.0m (finer near columns)
   - **Soil springs**: One spring per node (ks × tributary area)
2. Apply column loads at node locations
3. STAAD calculates:
   - **Pressure distribution**: Varies across the mat
   - **Plate moments**: Mx, Our, Mxy at each element
   - **Shear**: At column perimeters
   - **Settlement**: Differential and total

### Mat Design Checks

1. **Bearing pressure**: Maximum pressure ≤ qa at all locations
2. **Settlement**: Total and differential within tolerable limits
3. **Punching shear**: At each column location
4. **One-way shear**: At critical sections
5. **Flexural reinforcement**: Based on plate moment output

### Mat Reinforcement

1. From plate moment output:
   - **Mx**: Reinforcement in X direction
   - **Our**: Reinforcement in Y direction
   - **Top mat**: For hogging moments (near columns)
   - **Bottom mat**: For sagging moments (mid-span)
2. Calculate required As per meter:
   - As = Mu / (0.87 × fy × d)
3. Select bar size and spacing:
   - Typical: #20 @ 200mm both ways, top and bottom
   - Add extra reinforcement at column locations (high moment areas)

## Soil-Structure Interaction

### Spring Constant Calculation

1. For Winkler spring model:
   - ks = subgrade reaction modulus (kN/m³)
   - Spring stiffness = ks × tributary area per node
2. For variable soil:
   - Different ks values for different zones
   - Adjust for groundwater, soil layers, and bearing strata

### Effect on Structural Model

1. Soil flexibility affects:
   - Support settlements (differential settlement)
   - Force redistribution in the structure
   - Foundation rotations
2. For sensitive structures:
   - Export foundation stiffness back to STAAD.Pro
   - Re-analyze with flexible supports
   - Iterate until convergence

## Common Foundation Issues

### Bearing Capacity Exceeded

**Cause**: Footing too small or soil capacity overestimated.
**Fix**: Increase footing dimensions. Verify soil report. Consider deeper foundation or soil improvement.

### Excessive Settlement

**Cause**: Soft soil, heavy loads, or large footing area.
**Fix**: Increase footing depth (stiffer soil at depth), use piles, or use mat foundation to distribute load.

### Footing Uplift

**Cause**: High lateral loads (wind/seismic) causing overturning.
**Fix**: Increase footing size (more weight), add tie beams between footings, or use rock anchors.

### Differential Settlement

**Cause**: Variable soil conditions or uneven loading.
**Fix**: Use mat foundation, adjust footing sizes to equalize pressure, or use piles to a uniform bearing stratum.

## Wrapping Up

Foundation design is where the structural model meets the real world, and getting the soil parameters right is half the battle. We always get the geotechnical report in hand before starting foundation design in SFA. The workflow from STAAD to SFA is smooth — export reactions, design footings, check all failure modes. Don't skip the punching shear check on pile caps — We've seen that catch problems that bearing and flexure checks missed.
