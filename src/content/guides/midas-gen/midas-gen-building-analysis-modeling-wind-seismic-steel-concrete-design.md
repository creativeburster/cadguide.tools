---
title: "MIDAS Gen Building Analysis: Modeling, Wind, Seismic, and Steel-Concrete Design"
excerpt: "A comprehensive guide to MIDAS Gen for building structural analysis covering story-based modeling, automatic wind and seismic load generation per ASCE 7 and IS 1893, P-Delta analysis, and steel and concrete design per AISC and ACI."
category: "workflow"
softwareSlug: "midas-gen"
keyword: "midas gen building analysis"
slug: "midas-gen-building-analysis-modeling-wind-seismic-steel-concrete-design"
author: "CADGuide Technical Editorial"
readTime: "13 min read"
date: "2026-06-30"
sources:
  - "https://manual.midasuser.com/EN/gen/2023/"
  - "https://www.midasuser.com/products/gen"
---

# MIDAS Gen Building Analysis: Modeling, Wind, Seismic, and Steel-Concrete Design

MIDAS Gen is MIDAS IT's building structural analysis and design software, widely used in Asia and increasingly worldwide. It combines story-based modeling, automatic lateral load generation, and integrated design for steel and concrete. This guide covers the complete building analysis workflow.

## Project Setup

### Creating a New Project

1. File > New Project
2. Set unit system: Metric (kN, m, mm) or Imperial (kip, ft, in)
3. Set design code:
   - **Steel**: AISC 360, Eurocode 3, IS 800, KS, GB
   - **Concrete**: ACI 318, Eurocode 2, IS 456, KS, GB
4. Set building type: Office, residential, hospital (affects live load reduction)

### Story Definition

1. Model > Building > Story
2. Define stories:
   - **Basement**: -3.5m
   - Ground Floor**: 0.0m
   - **Level 1**: +3.5m
   - **Level 2**: +7.0m
   - **Level 3**: +10.5m
   - **Roof**: +14.0m
3. Set story height for each level
4. Stories control:
   - Floor mass calculation
   - Wind load distribution
   - Seismic load distribution
   - Story shear and drift output

## Modeling

### Grid and Nodes

1. Model > Grid
2. Set grid lines:
   - **X-direction**: 0, 5, 10, 15, 20m
   - **Y-direction**: 0, 6, 12, 18m
   - **Z-direction**: Per story definition
3. Nodes are automatically created at grid intersections
4. Add additional nodes as needed: Model > Node > Create

### Member Creation

1. Model > Element > Beam
2. Click two nodes to create a beam element
3. Or use Quick Draw:
   - Model > Element > Quick Beam
   - Click grid lines to auto-place beams
4. For columns: Model > Element > Column
   - Click a node and the column extends to the story above

### Section Assignment

1. Model > Property > Section
2. Add sections:
   - **Steel**: W-shapes (AISC), H-beams (JIS/KS), custom
   - **Concrete**: Rectangular (b × h), circular (Ø), custom
3. Assign to elements:
   - Select elements
   - Model > Property > Assign Section

### Material Assignment

1. Model > Property > Material
2. Add materials:
   - **Steel A992**: fy = 345 MPa, E = 200,000 MPa
   - **Concrete C30**: f'c = 30 MPa, E = 25,000 MPa
   - **Rebar Grade 420**: fy = 420 MPa
3. Assign to elements

### Supports

1. Model > Boundary > Support
2. Select base nodes
3. Set support type:
   - **Fixed**: All 6 DOF restrained
   - **Pinned**: 3 translations restrained
   - **Spring**: Elastic with specified stiffness

## Loading

### Self-Weight

1. Load > Self-Weight
2. Set direction: Z = -1 (downward)
3. MIDAS Gen calculates self-weight from section and material automatically

### Floor Loads

1. Load > Floor Load
2. Define floor load cases:
   - **SDL**: 5 kN/m² (superimposed dead)
   - **LIVE**: 2.5 kN/m² (office live load)
3. Select floor area (closed polygon of beams)
4. MIDAS Gen distributes floor load to supporting beams:
   - **One-way**: Tributary to two beams
   - **Two-way**: Tributary to four beams (based on aspect ratio)

### Beam Loads

1. Load > Beam Load
2. Set:
   - **Type**: Uniform or trapezoidal
   - **Direction**: Global Z (downward)
   - **Value**: e.g., 10 kN/m
3. Select beams to apply

### Wind Load (Automatic)

1. Load > Wind Load
2. Set per ASCE 7:
   - **Basic wind speed (V)**: e.g., 45 m/s
   - **Exposure category**: B, C, or D
   - **Building category**: II (standard)
   - **Wind direction**: X or Y
3. MIDAS Gen automatically:
   - Calculates wind pressure at each story height
   - Applies to the building face
   - Distributes to floor levels
   - Creates wind load cases (WX, WY)

### Seismic Load (Automatic)

1. Load > Seismic Load
2. Set per ASCE 7:
   - **SDS**: 0.6g
   - **SD1**: 0.3g
   - **Site class**: D
   - **Response modification (R)**: 5 (special steel frame)
   - **Importance factor (I)**: 1.0
   - **Seismic weight**: Dead + 0.25 × Live
3. MIDAS Gen automatically:
   - Calculates seismic mass per story
   - Calculates base shear: V = Cs × W
   - Distributes lateral force per story: Fx = V × wx × hx^k / Σ(wi × hi^k)
   - Includes accidental eccentricity (5% of building dimension)
   - Creates seismic load cases (SX, SY)

### Load Combinations

1. Load > Load Combinations
2. Auto-generate per code:
   - **Strength (LRFD)**: 1.4D, 1.2D+1.6L, 1.2D+1.0W+0.5L, etc.
   - **Service (ASD)**: D+L, D+W, D+0.75L+0.75W
   - **Seismic**: 1.2D+1.0E+0.5L, 0.9D+1.0E
3. Or create manually

## Analysis

### Running Analysis

1. Analysis > Run Analysis
2. MIDAS Gen performs:
   - Stiffness matrix assembly
   - Load vector generation
   - Displacement calculation
   - Member force calculation
3. Check analysis results for warnings

### P-Delta Analysis

1. Analysis > Analysis Control
2. Enable P-Delta:
   - **P-Delta**: Include geometric nonlinearity
   - **Iterations**: 3-5 (typically sufficient)
3. P-Delta increases:
   - Lateral displacements (secondary moments)
   - Column moments (gravity × displacement)
   - Story drift

### Modal Analysis

1. Analysis > Analysis Control > Eigenvalue
2. Set number of modes: 15-30
3. Check mass participation:
   - Cumulative ≥ 90% in X and Y
   - If not: increase modes

### Response Spectrum Analysis

1. Load > Response Spectrum
2. Define spectrum per ASCE 7
3. Create response spectrum load case
4. Set:
   - **Direction**: X or Y
   - **Modal combination**: CQC (recommended)
   - **Damping**: 5%
5. Run analysis
6. Check base shear scaling (≥ 85% of static)

## Post-Processing

### Story Shear

1. Results > Story Shear
2. View shear per story:
   - **Seismic X**: Story shear distribution
   - **Seismic Y**: Story shear distribution
   - **Wind X**: Story shear distribution
3. Verify shear decreases with height (triangular distribution)

### Story Drift

1. Results > Story Drift
2. View drift per story:
   - **Drift ratio**: Δ/h per story
   - **Allowable drift**: Per code (h/400 for wind, h/50 for seismic)
3. If drift exceeds limit:
   - Increase stiffness (larger sections, more bracing)
   - Add shear walls
   - Reduce building height

### Center of Mass and Rigidity

1. Results > Center of Mass/Rigidity
2. View per story:
   - **Center of mass (CM)**: Where the mass is concentrated
   - **Center of rigidity (CR)**: Where the lateral stiffness is concentrated
   - **Eccentricity**: Distance between CM and CR
3. Large eccentricity causes torsion:
   - Redistribute mass or stiffness
   - Add accidental eccentricity (5%)

### Member Forces

1. Results > Beam Forces
2. View:
   - **Axial (N)**: Tension/compression
   - **Shear (V)**: Shear in two directions
   - **Moment (M)**: Bending about two axes
   - **Torsion (T)**: Twisting moment
3. View as diagrams or contour plots

### Reactions

1. Results > Reactions
2. View support reactions:
   - **Vertical**: For foundation design
   - **Horizontal**: For shear key design
   - **Moments**: For fixed foundation design
3. Export to foundation design software

## Steel Design

### Setting Up Steel Design

1. Design > Steel Design > Design Code
2. Select: AISC 360-16 (LRFD or ASD)
3. Set parameters:
   - **FY**: 345 MPa (A992)
   - **Unbraced length**: Per member or per group
   - **K factor**: Calculated or manual
4. Design > Steel Design > Run Design
5. Results:
   - **Unity ratio**: Demand/capacity (≤ 1.0)
   - **Critical combination**: Which combo governs
   - **Critical check**: Which failure mode controls

### Steel Optimization

1. Design > Steel Design > Auto Design
2. Set section list for each member group:
   - Columns: W12×45 to W12×96
   - Beams: W16×26 to W24×62
3. MIDAS Gen selects the lightest section that passes all checks
4. Re-analyze with new sections
5. Re-design to verify

## Concrete Design

### Setting Up Concrete Design

1. Design > Concrete Design > Design Code
2. Select: ACI 318-19
3. Set parameters:
   - **FC**: 30 MPa
   - **FY**: 420 MPa (main bars)
   - **FYH**: 420 MPa (stirrups)
   - **Clear cover**: 40mm
4. Design > Concrete Design > Run Design

### Beam Design Output

| Parameter | Value |
|-----------|-------|
| Section | 300 × 600mm |
| Mu (top) | 250 kN·m |
| As (top) | 1450 mm² → 4 #22 |
| As (bottom) | 980 mm² → 3 #20 |
| Stirrups | #10 @ 150mm |
| Capacity ratio | 0.85 |

### Column Design Output

| Parameter | Value |
|-----------|-------|
| Section | 500 × 500mm |
| Pu | 1800 kN |
| Mux | 120 kN·m |
| Muy | 80 kN·m |
| Reinforcement | 8 #25 (1.96%) |
| Ties | #10 @ 100/300mm |
| Capacity ratio | 0.78 |

## Conclusion

MIDAS Gen provides a complete building analysis and design workflow: story-based modeling, automatic wind and seismic load generation, P-Delta analysis, response spectrum analysis, and integrated steel and concrete design. The automatic lateral load generation saves significant time compared to manual calculation, and the story-based output (shear, drift, center of mass) directly supports code compliance checks. By following this workflow, structural engineers can efficiently analyze and design buildings of any height and complexity in compliance with international design codes.
