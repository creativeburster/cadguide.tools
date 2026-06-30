---
title: "STAAD.Pro Structural Analysis: Modeling, Loading, and Steel-Concrete Design Workflow"
excerpt: "A comprehensive guide to STAAD.Pro for structural analysis covering model creation, section and material assignment, load definition (dead, live, wind, seismic), analysis execution, and steel/concrete code design per AISC and ACI."
category: "workflow"
softwareSlug: "staad-pro"
keyword: "staad pro structural analysis"
slug: "staad-pro-structural-analysis-modeling-loading-steel-concrete-design"
author: "CADGuide Technical Editorial"
readTime: "14 min read"
date: "2026-06-30"
sources:
  - "https://docs.bentley.com/LiveContent/web/STAAD.Pro%20Help-v28/en/GUID-FC527CAB-C22D-4DA0-8E8B-9A3F4B9F4F4B.html"
  - "https://www.bentley.com/software/staad/"
---

# STAAD.Pro Structural Analysis: Modeling, Loading, and Steel-Concrete Design Workflow

STAAD.Pro has been my workhorse for structural analysis on industrial and commercial projects for years. It supports over 90 design codes and handles everything from a simple beam to a complex 3D frame. The learning curve can be steep if you're coming from a GUI-first tool, but once you understand the workflow, it's efficient and reliable. Let me walk you through the full process from model creation to code-based design.

## Model Creation

### Starting a New Model

1. File > New Model
2. Select:
   - **Space frame**: 3D structure with beams, columns, braces
   - **Plane frame**: 2D structure (elevation)
   - **Truss**: Triangulated members (axial only)
   - **Floor**: Horizontal slab structure
3. Set units: Metric (kN, m, mm) or Imperial (kip, ft, in)
4. Set default material: Steel (A36, A572) or Concrete (C25/30, C30/37)

### Node Creation

Nodes (joints) are the foundation of the model:

1. Geometry > Add Node
2. Enter coordinates (X, Y, Z)
3. Or use the grid:
   - Set grid spacing (e.g., 3m in X, 3m in Z, 3.5m in Y)
   - Click grid intersections to place nodes
4. For regular grids, use Geometry > Add Beam > Multi-linear:
   - Enter node coordinates sequentially
   - STAAD creates nodes and connects them with members

### Member Creation

1. Geometry > Add Beam
2. Click two nodes to create a member between them
3. Or use Connect Beams:
   - Select multiple nodes
   - STAAD connects them sequentially
4. For trusses, use Geometry > Add Truss:
   - Define top chord, bottom chord, and web members

### Section Assignment

1. Select members
2. Property > Section Database
3. Choose section type:
   - **Steel**: W-shapes (AISC), I-shapes (European), HSS, angles, channels
   - **Concrete**: Rectangular, circular, custom
   - **Timber**: Dimensional lumber, glulam
4. Select specific section (e.g., W12x26, ISMB 300, 300×300mm)
5. Click "Assign"

### Material Assignment

1. Select members
2. Property > Material
3. Choose material:
   - **Steel**: A36 (fy=250 MPa), A572 Gr50 (fy=345 MPa), A992 (fy=345 MPa)
   - **Concrete**: C25/30, C30/37, C35/45 (specify fck and density)
   - **Timber**: Specify grade and properties
4. Set:
   - **Young's modulus (E)**: Auto-calculated from grade
   - **Density**: 7850 kg/m³ (steel), 2500 kg/m³ (concrete)
   - **Thermal coefficient**: 12×10⁻⁶/°C (steel), 10×10⁻⁶/°C (concrete)

### Supports

1. Select nodes
2. Support > Create
3. Choose support type:
   - **Fixed**: All 6 DOF restrained (translation + rotation)
   - **Pinned**: 3 translation DOF restrained, rotation free
   - **Roller**: 1 or 2 translation DOF restrained
   - **Spring**: Elastic support with specified stiffness
4. For foundations, typically use Pinned (no moment transfer) or Fixed (moment transfer)

## Loading

### Load Cases

1. Loading > Load Cases
2. Create load cases:
   - **Case 1**: Dead Load (self-weight + superimposed)
   - **Case 2**: Live Load (occupancy)
   - **Case 3**: Wind Load (X direction)
   - **Case 4**: Wind Load (Z direction)
   - **Case 5**: Seismic Load (X direction)
   - **Case 6**: Seismic Load (Z direction)
   - **Case 7**: Temperature Load

### Self-Weight (Dead Load)

1. Select Dead Load case
2. Loading > Self Weight
3. Set direction: Y (vertical) and factor: -1 (downward)
4. STAAD automatically calculates member self-weight from section and material

### Superimposed Dead Load

1. Select Dead Load case
2. Loading > Member Load > Distributed
3. Set:
   - **Direction**: Y (global vertical)
   - **Type**: Uniform
   - **Value**: e.g., 5 kN/m (floor finish, partitions, MEP)
4. Select members to apply

### Live Load

1. Select Live Load case
2. Loading > Member Load > Distributed
3. Set:
   - **Value**: e.g., 2.5 kN/m² × tributary width = 7.5 kN/m
   - Or use Floor Load: Loading > Floor Load
   - Set pressure: 2.5 kN/m²
   - Select the floor area (one-way or two-way load distribution)

### Wind Load

1. Select Wind Load case
2. Loading > Wind Load
3. Set:
   - **Wind code**: ASCE 7, IS 875, EN 1991-1-4, or BS 6399
   - **Basic wind speed**: e.g., 45 m/s
   - **Exposure category**: B, C, or D
   - **Wind direction**: X or Z
4. STAAD automatically generates wind pressure at each elevation
5. Apply to cladding members or node loads

### Seismic Load

1. Select Seismic Load case
2. Loading > Seismic Load
3. Set:
   - **Seismic code**: ASCE 7, IS 1893, EN 1998-1, or UBC
   - **Seismic zone/PGA**: e.g., Zone V (PGA=0.36g)
   - **Soil type**: Hard, medium, soft
   - **Response reduction factor (R)**: e.g., 5 (special steel frame)
   - **Importance factor (I)**: 1.0 (standard), 1.25 (essential)
4. STAAD calculates the base shear and distributes it vertically

### Load Combinations

1. Loading > Load Combinations
2. Create combinations per code:

#### ASD Combinations
- **Combo 1**: 1.0 DL + 1.0 LL
- **Combo 2**: 1.0 DL + 1.0 WL
- **Combo 3**: 1.0 DL + 1.0 SL
- **Combo 4**: 1.0 DL + 0.75 LL + 0.75 WL

#### LRFD Combinations
- **Combo 1**: 1.4 DL
- **Combo 2**: 1.2 DL + 1.6 LL
- **Combo 3**: 1.2 DL + 1.0 WL + 0.5 LL
- **Combo 4**: 1.2 DL + 1.0 SL + 0.5 LL
- **Combo 5**: 0.9 DL + 1.0 WL

## Analysis

### Running Analysis

1. Analysis > Run Analysis
2. STAAD performs:
   - **Stiffness matrix assembly**
   - **Load vector generation**
   - **Displacement calculation**
   - **Member force calculation**
3. Analysis types:
   - **Linear Static**: Default for most buildings
   - **Nonlinear**: For P-Delta effects, cable structures
   - **Dynamic**: For seismic response spectrum analysis
   - **Pushover**: For performance-based seismic design

### P-Delta Analysis

For tall buildings or slender structures:
1. Analysis > Analysis Type > Nonlinear
2. Enable P-Delta: check "Include P-Delta"
3. STAAD iterates:
   - First-order analysis → displacements
   - Apply secondary moments from displaced geometry
   - Re-analyze with updated geometry
   - Iterate until convergence

### Response Spectrum Analysis (Seismic)

1. Define response spectrum:
   - Loading > Response Spectrum
   - Select code spectrum (ASCE 7, IS 1893)
   - Set damping ratio (typically 5%)
2. Create seismic load case using response spectrum
3. Run dynamic analysis
4. STAAD calculates modal shapes, frequencies, and modal responses
5. Combine modal responses (SRSS or CQC method)

### Reviewing Results

1. Post-processing > Results
2. View:
   - **Nodal displacements**: Check against deflection limits
   - **Member forces**: Axial, shear, bending moment, torsion
   - **Reactions**: Support reactions for foundation design
   - **Mode shapes**: For dynamic analysis

## Steel Design (AISC)

### Configuring Steel Design

1. Design > Steel Design
2. Select design code: AISC 360-16 (LRFD or ASD)
3. Set parameters:
   - **FY**: Yield strength (default from material)
   - **CB**: Lateral-torsional buckling factor (0.67 or calculated)
   - **UNL**: Unbraced length (default = member length)
   - **NSF**: Net section factor (1.0 for no holes)
   - **LY, LZ**: Unbraced lengths in Y and Z directions

### Running Steel Design

1. Design > Steel > Design All
2. STAAD checks each member for:
   - **Axial tension**: Yielding and rupture
   - **Axial compression**: Flexural buckling, local buckling
   - **Flexure**: Yielding, lateral-torsional buckling, local buckling
   - **Shear**: Web yielding, web crippling
   - **Combined loading**: Interaction equations (AISC H1)
3. Results show:
   - **Unity ratio**: Demand/capacity ratio (must be ≤ 1.0)
   - **Critical load combination**: Which combo governs
   - **Failure mode**: Which check controls

### Optimization

1. Design > Steel > Optimize
2. STAAD selects the lightest section that satisfies all design checks
3. Set optimization constraints:
   - **Maximum depth**: Limit for architectural reasons
   - **Available sections**: Limit to sections in stock
4. Review optimized sections and re-run analysis with new sections

## Concrete Design (ACI)

### Configuring Concrete Design

1. Design > Concrete Design
2. Select design code: ACI 318-19
3. Set parameters:
   - **FC**: Concrete compressive strength (e.g., 30 MPa)
   - **FY**: Rebar yield strength (e.g., 420 MPa)
   - **Clear cover**: 40mm (beams), 40mm (columns)
   - **Max bar size**: 25mm
   - **Stirrup size**: 10mm

### Running Concrete Design

1. Design > Concrete > Design All
2. STAAD designs:
   - **Beams**: Flexural reinforcement (top and bottom), shear reinforcement (stirrups)
   - **Columns**: Longitudinal reinforcement, tie spacing
   - **Shear walls**: Reinforcement ratio and boundary elements
3. Results show:
   - **Required steel area**: As (mm²)
   - **Bar selection**: Number and size of bars
   - **Stirrup spacing**: Required spacing (mm)
   - **Capacity ratio**: Demand/capacity (must be ≤ 1.0)

## Output and Reports

### Post-Processing Views

1. Post-processing > Beam > Forces
2. View force diagrams:
   - **Axial force**: Tension/compression along member
   - **Shear force**: V2 and V3 diagrams
   - **Bending moment**: M2 and M3 diagrams
   - **Torsion**: T diagram
3. Animate force diagrams across load cases

### Report Generation

1. Report > Report Setup
2. Select report contents:
   - **Model summary**: Nodes, members, materials
   - **Load cases**: Applied loads
   - **Analysis results**: Displacements, reactions
   - **Design results**: Unity ratios, reinforcement
3. Generate report as:
   - **PDF**: For submission
   - **Word**: For editing
   - **HTML**: For web sharing

## Common Issues

### Instability Errors

**Cause**: Insufficient supports or mechanism in the structure.
**Fix**: Check support assignments. Ensure all nodes are adequately supported. Look for members with zero stiffness (missing section assignment).

### Excessive Deflection

**Cause**: Sections too small or loads too high.
**Fix**: Increase section sizes. Check load values. Verify units (kN vs N, m vs mm).

### High Unity Ratios

**Cause**: Member capacity insufficient for applied loads.
**Fix**: Increase section size. Change grade (higher fy). Add bracing to reduce unbraced length. Redistribute loads.

## Wrapping Up

STAAD.Pro has been my reliable workhorse for years. The learning curve is real, especially if you're coming from a GUI-first tool, but once you understand the workflow — model, loads, analysis, design — it's efficient and dependable. My advice: always check your deformed shape and reaction forces before trusting any design output. If the reactions don't balance or the deformed shape looks wrong, fix the model before proceeding.
