---
title: "SAP2000 Structural Analysis: Modeling, Section Properties, and Linear Static Analysis"
excerpt: "A beginner guide to SAP2000 covering model creation with grids, section and material assignment, support conditions, load case definition, linear static analysis execution, and result interpretation for building structures."
category: "workflow"
softwareSlug: "sap2000"
keyword: "sap2000 structural analysis"
slug: "sap2000-structural-analysis-modeling-section-properties-linear-static"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://docs.csiamerica.com/help/sap2000/"
  - "https://www.csiamerica.com/products/sap2000"
---

# SAP2000 Structural Analysis: Modeling, Section Properties, and Linear Static Analysis

SAP2000 is CSI (Computers and Structures, Inc.)'s general-purpose structural analysis software, used for buildings, bridges, and special structures. Its intuitive interface and powerful analysis engine make it popular worldwide. This guide covers the complete workflow from model creation to result interpretation.

## Model Creation

### Grid Setup

1. File > New Model
2. Choose grid system:
   - **Cartesian**: Regular X-Y grid (most buildings)
   - **Cylindrical**: Radial grid (circular structures)
   - **3D grid**: Multi-level grid for complex structures
3. Set grid dimensions:
   - **X-grid**: Column spacing (e.g., 5m, 5m, 5m)
   - **Y-grid**: Column spacing (e.g., 6m, 6m)
   - **Z-grid**: Floor elevations (e.g., 0, 3.5m, 7.0m, 10.5m)
4. Set number of grid lines in each direction
5. Click "OK" to create the grid

### Quick Templates

SAP2000 provides templates for common structures:
- **3D frame**: Multi-story building frame
- **2D frame**: Plane frame (elevation)
- **Truss**: Triangulated truss structure
- **Beam**: Simple beam
- **Wall**: Shear wall
- **Slab**: Flat slab structure

For a typical building, use the 3D frame template:
1. Set number of stories, bays in X, bays in Y
2. Set story heights and bay widths
3. SAP2000 generates the complete frame automatically

### Adding Elements

#### Joints (Nodes)

1. Draw > Draw Joint
2. Click on grid intersections to place joints
3. Or enter coordinates manually

#### Frame Elements (Beams/Columns)

1. Draw > Draw Frame Element
3. Click two joints to create a frame element
3. Set section property before drawing:
   - Select from drop-down in the properties panel
4. For multiple elements: Draw > Quick Draw Frame
   - Click grid lines to place elements automatically

#### Area Elements (Slabs/Walls)

1. Draw > Draw Area Element
2. Click four joints to create a quadrilateral area
3. Set section property (slab thickness, wall thickness)
4. For quick slabs: Draw > Quick Draw Area
   - Click inside a bay to fill it with an area element

## Section Properties

### Frame Sections

1. Define > Section Properties > Frame Sections
2. Add new section:
   - **Concrete Rectangular**: Width × Depth (e.g., 300 × 600mm)
   - **Concrete Circular**: Diameter (e.g., 500mm)
   - **Steel W-Shape**: Select from AISC database (e.g., W12x50)
   - **Steel HSS**: Select from database (e.g., HSS 4×4×1/4)
   - **Custom**: Define any cross-section shape
3. Set material for each section:
   - Concrete: f'c = 30 MPa, Ec = 25,000 MPa
   - Steel: fy = 345 MPa, Es = 200,000 MPa

### Area Sections

1. Define > Section Properties > Area Sections
2. Add new section:
   - **Concrete Slab**: Thickness (e.g., 200mm)
   - **Concrete Wall**: Thickness (e.g., 250mm)
   - **Deck**: Composite metal deck profile
3. Set material

### Material Properties

1. Define > Materials
2. Add materials:
   - **Concrete 30**: f'c = 30 MPa, Ec = 24,870 MPa, density = 25 kN/m³, ν = 0.20
   - **Steel A992**: fy = 345 MPa, Es = 200,000 MPa, density = 78.5 kN/m³, ν = 0.30
   - **Rebar Grade 420**: fy = 420 MPa
3. Materials are assigned to sections, which are assigned to elements

## Supports

### Assigning Supports

1. Select joints (support locations)
2. Assign > Joint > Restraints
3. Choose restraint type:
   - **Fixed**: All 6 DOF restrained (U1, U2, U3, R1, R2, R3)
   - **Pinned**: 3 translations restrained, rotations free
   - **Roller**: 1 or 2 translations restrained
   - **Spring**: Elastic support with specified stiffness
4. For typical building foundations: Pinned (no moment transfer to foundation)

## Loading

### Load Patterns

1. Define > Load Patterns
2. Create patterns:
   - **DEAD**: Self-weight multiplier = 1 (auto-calculates member weight)
   - **SDL**: Superimposed dead load (finishes, partitions, MEP)
   - **LIVE**: Live load (occupancy)
   - **WIND X**: Wind in X direction
   - **WIND Y**: Wind in Y direction
   - **QUAKE X**: Seismic in X direction
   - **QUAKE Y**: Seismic in Y direction
3. Set type: Dead, Live, Wind, Quake, Snow, Temperature

### Assigning Loads

#### Nodal Loads

1. Select joints
2. Assign > Joint Loads > Forces
3. Enter FX, FY, FZ, MX, MY, MZ
4. Select load pattern

#### Frame Loads (Distributed)

1. Select frame elements
2. Assign > Frame Loads > Distributed
3. Set:
   - **Direction**: Gravity (Global Z), or local axes
   - **Type**: Uniform or trapezoidal
   - **Value**: e.g., 10 kN/m
   - **Load pattern**: SDL or LIVE

#### Area Loads

1. Select area elements
2. Assign > Area Loads > Uniform
3. Set:
   - **Pressure**: e.g., 2.5 kN/m²
   - **Direction**: Gravity
   - **Load pattern**: LIVE

### Self-Weight

1. Define > Load Patterns > DEAD
2. Set Self-Weight Multiplier = 1
3. SAP2000 automatically calculates member self-weight from section and material

## Load Combinations

1. Define > Load Combinations
2. Create combinations:

#### LRFD (Strength)

| Combo | DEAD | LIVE | WIND | QUAKE |
|-------|------|------|------|-------|
| 1.4D | 1.4 | - | - | - |
| 1.2D+1.6L | 1.2 | 1.6 | - | - |
| 1.2D+1.0W+0.5L | 1.2 | 0.5 | 1.0 | - |
| 1.2D+1.0E+0.5L | 1.2 | 0.5 | - | 1.0 |
| 0.9D+1.0W | 0.9 | - | 1.0 | - |
| 0.9D+1.0E | 0.9 | - | - | 1.0 |

#### ASD (Service)

| Combo | DEAD | LIVE | WIND | QUAKE |
|-------|------|------|------|-------|
| D+L | 1.0 | 1.0 | - | - |
| D+W | 1.0 | - | 1.0 | - |
| D+0.75L+0.75W | 1.0 | 0.75 | 0.75 | - |

3. Set combination type: Add, SRSS, or Absolute

## Analysis

### Running Analysis

1. Analyze > Run Analysis
2. SAP2000 performs:
   - Stiffness matrix assembly
   - Load vector generation
   - Displacement calculation
   - Member force calculation
3. Check analysis log for warnings:
   - **Warnings**: Review but usually non-critical
   - **Errors**: Must be fixed before proceeding
   - **Instability**: Check supports and member connectivity

### Analysis Types

1. **Linear Static**: Default for most buildings
   - Fast, reliable, covers most load cases
2. **Nonlinear Static**: For P-Delta effects
   - Accounts for geometric nonlinearity
   - Important for tall or slender structures
3. **Modal**: For dynamic analysis
   - Calculates natural frequencies and mode shapes
4. **Response Spectrum**: For seismic analysis
   - Uses design spectrum to calculate forces
5. **Time History**: For dynamic loads
   - Earthquake, wind, or vibration analysis

## Result Interpretation

### Displacements

1. Display > Show Deformed Shape
2. Select load case or combination
3. View deformed shape with scaling factor
4. Check maximum displacements:
   - **Vertical deflection**: L/360 (live), L/240 (total) for beams
   - **Story drift**: h/400 (wind), h/50 (seismic) per code
5. Display > Show Tables > Joint Displacements
6. Export to Excel for detailed analysis

### Member Forces

1. Display > Show Forces / Stresses > Frames
2. Select load case or combination
3. View:
   - **Axial force (P)**: Tension/compression
   - **Shear force (V2, V3)**: Shear in two directions
   - **Bending moment (M2, M3)**: Moment about two axes
   - **Torsion (T)**: Twisting moment
4. Toggle between diagram and values
5. Animate across load cases

### Reactions

1. Display > Show Reactions
2. View support reactions:
   - **Vertical reactions**: For foundation design
   - **Horizontal reactions**: For shear key or tie beam design
   - **Moment reactions**: For fixed foundations
3. Export reactions for foundation design

### Moment and Shear Diagrams

1. Select a frame element
2. Display > Show Forces / Stresses > Frames
3. View diagrams:
   - **Moment diagram**: Shows bending moment along the member
   - **Shear diagram**: Shows shear force along the member
   - **Axial diagram**: Shows axial force along the member
4. Identify critical sections (maximum values)

## Common Modeling Issues

### Instability

**Symptom**: Analysis fails with "instability" error.
**Cause**: Insufficient restraints — structure can move as a rigid body.
**Fix**: Check supports. Ensure all nodes are connected to the support system. Check for disconnected elements.

### Warning: "Joint is Too Close to Another Joint"

**Cause**: Two joints at nearly the same location.
**Fix**: Merge joints: Select > Select > Collinear Joints > Edit > Merge Joints. Set tolerance (e.g., 10mm).

### Excessive Deflection

**Cause**: Sections too small, loads too high, or incorrect units.
**Fix**: Verify units (kN vs N, m vs mm). Increase section sizes. Check load values.

### Members Not Connected

**Cause**: Frame elements drawn between joints that don't share the same coordinate.
**Fix**: Verify joint coordinates. Use "Merge Joints" to connect nearby joints. Check element connectivity in the model.

## Best Practices

1. **Start with a template** — saves time on grid and element setup
2. **Verify geometry in 3D** — check all views before analysis
3. **Use consistent units** — don't mix metric and imperial
4. **Name load patterns clearly** — "DEAD", "LIVE", "WIND_X", not "Load 1"
5. **Check reactions** — verify total vertical reaction ≈ total vertical load
6. **Review deformed shape** — if it looks wrong, the model is wrong
7. **Check for warnings** — resolve all analysis warnings
8. **Save before analysis** — SAP2000 can crash on complex models
9. **Use groups** — organize elements by floor, type, or section for easy selection
10. **Document assumptions** — note support conditions, load values, and section properties

## Conclusion

SAP2000 provides an intuitive yet powerful structural analysis workflow: grid-based model creation, comprehensive section and material libraries, flexible loading options, multiple analysis types, and detailed result visualization. The key to reliable analysis is careful model setup — correct geometry, appropriate sections, realistic loads, and proper supports. By following this workflow and verifying results at each step (deformed shape, reactions, member forces), structural engineers can confidently analyze buildings, bridges, and special structures in SAP2000.
