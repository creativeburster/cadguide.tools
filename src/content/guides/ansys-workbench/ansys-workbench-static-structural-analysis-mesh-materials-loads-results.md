---
title: "ANSYS Workbench Static Structural Analysis: Mesh, Materials, Loads, and Result Interpretation"
excerpt: "ANSYS Workbench's static structural module performs FEA stress analysis on 3D models. I cover the project schematic, material assignment, mesh generation, boundary conditions, load application, and stress result interpretation for engineering validation."
category: "workflow"
softwareSlug: "ansys-workbench"
keyword: "ANSYS Workbench static structural analysis mesh materials loads boundary conditions stress result interpretation FEA"
slug: "ansys-workbench-static-structural-analysis-mesh-materials-loads-results"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-06-29"
sources:
  - "https://ansyshelp.ansys.com/account/secured?returnurl=/Views/Secured/corp/v242/en/wb_wb/wb_wb.html"
  - "https://ansyshelp.ansys.com/public/Views/Secured/corp/v252/en/wb_sim/ds_static_mechanical_analysis_type.html"

---

# ANSYS Workbench Static Structural Analysis: Mesh, Materials, Loads, and Result Interpretation

I've run thousands of static structural analyses in ANSYS Workbench for mechanical components across industries. ANSYS is the gold standard for finite element analysis — its solvers are among the most accurate and reliable in the industry. Workbench provides the integrated environment that connects CAD geometry, meshing, boundary conditions, solving, and post-processing into a single workflow.

## Workbench Overview

ANSYS Workbench is the project-level interface that connects analysis systems:
- **Static Structural**: Stress analysis under static loads
- **Modal**: Natural frequency analysis
- **Thermal**: Steady-state or transient heat transfer
- **Harmonic**: Dynamic response to harmonic excitation
- **Transient Structural**: Time-dependent stress analysis
- **Buckling**: Linear buckling analysis
- **Topology Optimization**: Generative design for weight reduction

## The Project Schematic

### Creating a New Project

1. Open ANSYS Workbench
2. The **Project Schematic** is the main workspace
3. Drag an analysis system from the **Toolbox**:
   - **Static Structural** from the Analysis Systems section
4. The system appears as a column of cells:
   - **Engineering Data**: Materials
   - **Geometry**: CAD model
   - **Model/Set-up**: Meshing and boundary conditions
   - **Solution**: Results
5. Each cell shows its status:
   - **Green check**: Complete
   - **Yellow lightning**: Needs update
   - **Red**: Error

### Importing Geometry

1. Right-click the **Geometry** cell
2. Select **Import Geometry** → **Browse**
3. Select a CAD file:
   - **Native formats**: SolidWorks, Creo, NX, CATIA, Inventor
   - **Neutral formats**: STEP, IGES, Parasolid
4. The geometry appears in the Geometry cell
5. Alternatively, use **SpaceClaim** or **DesignModeler** to create or modify geometry

## Engineering Data (Materials)

### Assigning Materials

1. Double-click the **Engineering Data** cell
2. The Engineering Data interface opens
3. Select materials from the library:
   - **Structural Steel**: Default material (E=200 GPa, ν=0.3, σy=250 MPa)
   - **Aluminum Alloy**: E=71 GPa, ν=0.33, σy=280 MPa
   - **Stainless Steel**: E=193 GPa, ν=0.3, σy=207 MPa
   - **Titanium**: E=110 GPa, ν=0.31, σy=880 MPa
4. Click **Add** to add materials to the project
5. Or create a custom material:
   - **Young's modulus (E)**: Stiffness
   - **Poisson's ratio (ν)**: Lateral contraction
   - **Density**: Mass per volume
   - **Yield strength**: Plastic deformation onset
   - **Tensile strength**: Ultimate strength
6. Close Engineering Data when done

### Material Properties for Common Metals

| Material | E (GPa) | ν | Density (kg/m³) | Yield (MPa) | UTS (MPa) |
|----------|---------|---|-----------------|-------------|-----------|
| Structural Steel | 200 | 0.3 | 7850 | 250 | 460 |
| Aluminum 6061-T6 | 71 | 0.33 | 2700 | 280 | 310 |
| Stainless 304 | 193 | 0.3 | 8000 | 207 | 586 |
| Titanium Ti-6Al-4V | 110 | 0.31 | 4430 | 880 | 950 |
| Copper | 110 | 0.34 | 8900 | 70 | 220 |

## Meshing

### Opening the Mesh Editor

1. Double-click the **Model** cell
2. ANSYS Mechanical opens with the mesh editor
3. The geometry appears in the graphics window
4. The tree shows: Geometry, Coordinate Systems, Mesh, Connections

### Mesh Generation

1. Click **Mesh** in the tree
2. Set mesh parameters:
   - **Element size**: Default or specified (e.g., 2mm)
   - **Relevance Center**: Fine, medium, or coarse
   - **Smoothing**: Low, medium, or high
   - **Transition**: Slow or fast
3. Right-click **Mesh** → **Generate Mesh**
4. The mesh is generated automatically
5. Check mesh statistics:
   - **Number of elements**: Total element count
   - **Number of nodes**: Total node count
   - **Mesh metrics**: Element quality, aspect ratio, skewness

### Mesh Refinement Methods

**Body Sizing**:
1. Right-click **Mesh** → **Insert** → **Sizing**
2. Select a body (part)
3. Set the element size for that body
4. Use for: Different parts needing different mesh densities

**Face Sizing**:
1. Right-click **Mesh** → **Insert** → **Face Sizing**
2. Select a face
3. Set the element size on that face
4. Use for: Refining mesh on critical faces (load application areas, stress concentrations)

**Edge Sizing**:
1. Right-click **Mesh** → **Insert** → **Edge Sizing**
2. Select an edge
3. Set the element size or number of divisions
4. Use for: Refining mesh along edges (fillets, holes)

**Refinement**:
1. Right-click **Mesh** → **Insert** → **Refinement**
2. Select a face, edge, or vertex
3. Set the refinement level (1-3)
4. Use for: Local refinement without changing global mesh

**Inflation Layers**:
1. Right-click **Mesh** → **Insert** → **Inflation**
2. Select a boundary face
3. Set inflation layers:
   - **First layer thickness**: Thickness of the first layer
   - **Number of layers**: Typically 5-15
   - **Growth rate**: 1.1-1.3
4. Use for: Boundary layer meshing (fluid dynamics, contact stresses)

### Mesh Quality Check

1. Click **Mesh** in the tree
2. In the **Quality** section, check:
   - **Element Quality**: Should be > 0.1 for most elements
   - **Aspect Ratio**: Should be < 10 for most elements
   - **Skewness**: Should be < 0.85
   - **Orthogonal Quality**: Should be > 0.2
3. Use mesh metric plots to visualize quality distribution
4. Refine the mesh if quality is poor

## Boundary Conditions

### Fixed Support

1. Right-click **Static Structural** in the tree → **Insert** → **Fixed Support**
2. Select a face, edge, or vertex
3. The selected geometry is fully constrained (all 6 DOF locked)
4. Use for: Bolted faces, welded joints, grounded components

### Displacement

1. Right-click → **Insert** → **Displacement**
2. Select a face, edge, or vertex
3. Set displacement components:
   - **X, Y, Z**: Free, 0 (fixed), or specified value
   - **Normal to face**: Constrain normal to the selected face
   - **Tabular data**: Vary displacement by time or position
4. Use for: Symmetry constraints, prescribed displacements, roller supports

### Cylindrical Support

1. Right-click → **Insert** → **Cylindrical Support**
2. Select a cylindrical surface
3. Set constraints in cylindrical coordinates:
   - **Radial**: Fixed or free
   - **Axial**: Fixed or free
   - **Tangential**: Fixed or free
4. Use for: Bearing surfaces, pipe supports, shaft constraints

### Remote Displacement

1. Right-click → **Insert** → **Remote Displacement**
2. Select a face or edge
3. Set a remote point (the point where displacement is applied)
4. Set displacement and rotation at the remote point
5. Use for: Applying loads at a point not on the geometry (e.g., center of mass)

### Symmetry

1. Right-click → **Insert** → **Symmetry** → **Symmetry Region**
2. Select the symmetry plane (face)
3. The symmetry constraint:
   - Fixes displacement normal to the symmetry plane
   - Allows free displacement in the plane
4. Use for: Reducing model size for symmetric geometry and loading

## Loads

### Force

1. Right-click **Static Structural** → **Insert** → **Force**
2. Select a face, edge, or vertex
3. Set the force:
   - **Vector**: Components (X, Y, Z) or magnitude and direction
   - **Normal**: Force normal to the selected face
   - **Components**: Separate X, Y, Z values
4. Click **Apply**
5. Use for: Applied loads, contact forces, actuator forces

### Pressure

1. Right-click → **Insert** → **Pressure**
2. Select a face
3. Set the pressure:
   - **Magnitude**: Force per unit area (e.g., 10 MPa)
   - **Direction**: Normal to face (default) or vector
   - **Hydrostatic**: Varying pressure (e.g., fluid pressure with depth)
4. Use for: Internal pressure, fluid pressure, contact pressure

### Moment

1. Right-click → **Insert** → **Moment**
2. Select a face or edge
3. Set the moment:
   - **Vector**: Components or magnitude and direction
   - **Applied to**: Face or edge
4. Use for: Torque loads, bending moments

### Standard Earth Gravity

1. Right-click → **Insert** → **Standard Earth Gravity**
2. Set the direction:
   - **X, Y, or Z**: Direction of gravity
   - **Magnitude**: 9.81 m/s² (standard)
3. The gravity load is applied to all bodies based on mass
4. Use for: Weight loads, self-weight analysis

### Temperature

1. Right-click → **Insert** → **Temperature**
2. Select a body or face
3. Set the temperature value
4. The thermal expansion creates thermal stress
5. Use for: Thermal stress analysis, combined thermal-structural

### Bearing Load

1. Right-click → **Insert** → **Bearing Load**
2. Select a cylindrical surface
3. Set the bearing force magnitude and direction
4. The load is distributed as a sinusoidal pressure (Hertzian distribution)
5. Use for: Bearing loads on holes, pin loads on shafts

## Solving

### Running the Analysis

1. Right-click **Solution** → **Solve**
2. ANSYS solves the analysis:
   - **Linear static**: Fast (seconds to minutes)
   - **Nonlinear**: Slower (minutes to hours, depending on complexity)
3. The solver shows progress in the status bar
4. After solving, the Solution cell shows a green checkmark

### Solver Controls

1. Click **Analysis Settings** in the tree
2. Set:
   - **Number of steps**: For multi-step analyses
   - **Auto time stepping**: On or off
   - **Large deflection**: On for nonlinear (geometric nonlinearity)
   - **Solver type**: Direct (sparse) or Iterative (PCG)
3. For nonlinear analyses:
   - **Substeps**: Number of load increments
   - **Max iterations**: Per substep
   - **Convergence tolerance**: Force and displacement

## Result Interpretation

### Adding Results

1. Right-click **Solution** → **Insert** → **Stress** → **Equivalent (Von Mises)**
2. Add other results as needed:
   - **Stress > Normal**: X, Y, Z stress components
   - **Stress > Shear**: XY, YZ, XZ shear stress
   - **Stress > Principal**: Maximum, middle, minimum principal stress
   - **Stress > Equivalent**: Von Mises stress (most common)
   - **Deformation > Total**: Total displacement
   - **Deformation > Directional**: X, Y, Z displacement
   - **Strain > Equivalent**: Von Mises strain
   - **Tool > Stress Tool**: Safety factor calculations
3. Click **Evaluate All Results**
4. Results appear in the graphics window

### Von Mises Stress

- **Von Mises stress** is the most common result for ductile materials
- Compare to the material's yield strength:
  - **Below yield**: Elastic deformation — part returns to original shape
  - **Above yield**: Plastic deformation — permanent deformation
  - **Above ultimate**: Failure — part breaks
- **Safety factor**: Yield strength / Max Von Mises stress
  - **> 1.5**: Generally safe
  - **1.0-1.5**: Marginal — consider redesign
  - **< 1.0**: Unsafe — redesign required

### Displacement

- Check maximum displacement against design requirements:
  - **Stiffness-critical**: < 0.1mm for precision components
  - **General machinery**: < 1mm for structural components
  - **Building structures**: < L/360 for deflection limits
- Scale the deformation display for visualization (typically 10x-50x auto-scale)

### Principal Stresses

- **Maximum principal (σ1)**: Tensile stress — check against tensile strength
- **Minimum principal (σ3)**: Compressive stress — check against compressive strength
- **Principal stress direction**: Shows the direction of maximum stress

### Stress Concentrations

- Look for stress concentrations at:
  - **Fillets and radii**: Sharp internal corners
  - **Holes**: Around hole edges
  - **Notches and grooves**: Stress risers
  - **Cross-section changes**: Sudden transitions
- If stress is too high at a concentration:
  - Increase the fillet radius
  - Add a relief groove
  - Change the cross-section transition
  - Use a stronger material

### Probe and Charting

1. Right-click a result → **Probe**
2. Select a point, edge, or face
3. The result value at that location is displayed
4. Create charts:
   - **Stress along a path**: Plot stress along a defined path
   - **Displacement vs. position**: Plot displacement along an edge
5. These are useful for reports and documentation

## Common Issues

### Stress Singularity at Sharp Corner

- Add a fillet to the sharp corner
- The stress will converge to a finite value
- If the geometry can't be changed, use a stress linearization or nominal stress approach

### Mesh Refinement Doesn't Converge

- Check for singularities (sharp corners, point loads)
- Use mesh convergence study: halve element size, compare stress
- If stress keeps increasing, it's a singularity — not a real stress
- Consider using stress linearization for pressure vessel analysis

### Analysis Doesn't Solve

- Check that the model is properly constrained (no rigid body motion)
- Verify all loads are applied correctly
- Check for contact issues (if using contact)
- Look at the solver output for error messages
- Try a linear analysis first (turn off large deflection)

### Results Are Unreasonably High

- Check material properties (Young's modulus, yield strength)
- Verify load magnitudes and directions
- Check constraint setup (over-constraint can cause artificial stress)
- Ensure the mesh is adequate in high-stress areas
- Check units consistency (mm vs m, N vs kN)

## Summary

ANSYS Workbench's static structural analysis provides accurate FEA stress results for engineering validation. Import geometry from CAD, assign materials in Engineering Data, generate the mesh with appropriate refinement (body sizing, face sizing, inflation), and apply boundary conditions (fixed support, displacement, cylindrical support, symmetry). Apply loads (force, pressure, moment, gravity, temperature, bearing load). Solve the analysis and interpret results: compare Von Mises stress to yield strength for safety factor, check displacement against design limits, and identify stress concentrations. Run mesh convergence studies to ensure results are mesh-independent. The most common issues — singularities, convergence failures, and unreasonable results — are addressed by adding fillets, checking constraints, and verifying material properties and load magnitudes. ANSYS Workbench's integrated workflow from CAD to results makes it the industry standard for structural FEA.
