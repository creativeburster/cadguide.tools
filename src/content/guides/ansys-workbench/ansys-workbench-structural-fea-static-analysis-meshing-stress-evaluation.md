---
title: "ANSYS Workbench Structural FEA: Static Analysis, Meshing, and Stress Evaluation"
excerpt: "A guide to structural static analysis in ANSYS Workbench covering geometry import, material assignment, meshing strategies, boundary conditions, stress evaluation, and convergence verification for engineering simulations."
category: "workflow"
softwareSlug: "ansys-workbench"
keyword: "ansys workbench structural fea"
slug: "ansys-workbench-structural-fea-static-analysis-meshing-stress-evaluation"
author: "CADGuide Tools Editorial Team"
readTime: "13 min read"
date: "2026-06-30"
sources:
  - "https://ansyshelp.ansys.com/"
  - "https://innovationspace.ansys.com/knowledge/forums/topic/structural-modeling-with-ansys-workbench-mechanical/"

---

# ANSYS Workbench Structural FEA: Static Analysis, Meshing, and Stress Evaluation

We've spent years running static structural analyses in ANSYS Workbench, and we still remember how overwhelming the interface felt the first time. Once you understand the workflow though, it becomes second nature. Let us walk you through the whole process from importing geometry to evaluating stress, including the meshing strategies and convergence checks we use on every project.

## Project Setup

### Creating a Static Structural Analysis

1. Open ANSYS Workbench
2. Drag "Static Structural" from the Toolbox to the Project Schematic
3. The analysis system appears with cells:
   - **Engineering Data**: Materials
   - **Geometry**: CAD model
   - **Model**: Mesh and setup
   - **Setup**: Boundary conditions and loads
   - **Solution**: Results
   - **Results**: Post-processing

### Geometry Import

1. Right-click Geometry cell > Import Geometry > Browse
2. Select CAD file:
   - **SolidWorks**: .sldprt, .sldasm
   - **Creo**: .prt, .asm
   - **NX**: .prt
   - **STEP**: .stp, .step (recommended for neutral exchange)
   - **IGES**: .igs (legacy)
3. Or use SpaceClaim (built-in) or DesignModeler for geometry creation
4. Verify geometry:
   - Check for small faces, sliver faces, gaps
   - Use SpaceClaim > Repair > Fix small faces
   - Mid-surface thin walls for shell meshing

## Material Assignment

### Engineering Data

1. Double-click Engineering Data cell
2. Add materials from library:
   - **Structural Steel**: E = 200 GPa, ν = 0.3, σy = 250 MPa
   - **Aluminum Alloy**: E = 71 GPa, ν = 0.33, σy = 280 MPa
   - **Titanium Ti-6Al-4V**: E = 110 GPa, ν = 0.34, σy = 880 MPa
   - **Concrete**: E = 30 GPa, ν = 0.18, f'c = 30 MPa
3. For custom materials:
   - Click "Click here to add a new material"
   - Enter:
     - **Young's Modulus (E)**: In Pa or MPa
     - **Poisson's Ratio (ν)**: Dimensionless
     - **Density (ρ)**: In kg/m³
     - **Tensile Yield Strength**: In Pa or MPa
     - **Compressive Yield Strength**: For ductile materials
4. Assign material to bodies in Model

## Meshing

### Mesh Controls

1. Double-click Model cell to open Mechanical
2. Mesh > Insert > Sizing
3. Set:
   - **Element size**: Based on geometry (start with 2mm for small parts, 10mm for large)
   - **Face sizing**: On critical faces (holes, fillets, contact areas)
   - **Body sizing**: On specific bodies
4. Mesh > Insert > Method
5. Select meshing method:
   - **Hex Dominant**: For bulk solids (best quality)
   - **Tetrahedrons**: For complex geometry (most flexible)
   - **MultiZone**: For swept geometries (hex with auto-decomposition)
   - **Sweep**: For extruded shapes (hex mesh along sweep path)

### Refinement at Critical Regions

1. Insert > Refinement on faces or edges:
   - **Hole edges**: 2-3 refinement levels
   - **Fillet edges**: 1-2 refinement levels
   - **Contact regions**: 2-3 refinement levels
2. Insert > Inflation:
   - On boundary layer faces (for CFD or stress concentration)
   - **First layer thickness**: 0.1mm (typical)
   - **Number of layers**: 5-10
   - **Growth rate**: 1.2

### Mesh Quality Metrics

1. Mesh > Statistics:
   - **Elements**: Total count
   - **Nodes**: Total count
2. Quality metrics:
   - **Orthogonal Quality**: > 0.1 (acceptable), > 0.3 (good)
   - **Skewness**: < 0.85 (acceptable), < 0.5 (good)
   - **Aspect Ratio**: < 20 (acceptable), < 5 (good)
   - **Jacobian Ratio**: > 0.5 (acceptable)
3. If quality is poor:
   - Reduce element size
   - Use hex dominant method
   - Add sizing controls on poor-quality regions

### Mesh Convergence

1. Run analysis with initial mesh
2. Note maximum stress (σmax)
3. Refine mesh (reduce element size by 50%)
4. Re-run analysis
5. Compare σmax:
   - If change < 5%: Mesh is converged
   - If change > 5%: Refine further
6. Repeat until convergence

## Boundary Conditions

### Fixed Supports

1. Static Structural > Insert > Fixed Support
2. Select faces or edges to fix
3. All 6 DOF (3 translation + 3 rotation) are restrained

### Displacement Constraints

1. Insert > Displacement
2. Select faces or edges
3. Set:
   - **X**: Free, 0 (fixed), or specified value
   - **Y**: Free, 0, or specified
   - **Z**: Free, 0, or specified

### Cylindrical Supports

1. Insert > Cylindrical Support
2. Select cylindrical face
3. Set:
   - **Radial**: Fixed or free
   - **Axial**: Fixed or free
   - **Tangential**: Fixed or free

### Remote Displacements

1. Insert > Remote Displacement
2. Select faces
3. Set:
   - **Point**: Coordinates of remote point
   - **Rotation**: About X, Y, Z axes
   - **Translation**: X, Y, Z

## Loading

### Force

1. Insert > Force
2. Select faces, edges, or vertices
3. Set:
   - **Magnitude**: In N or kN
   - **Direction**: Vector or normal to face
   - **Define by**: Components or vector

### Pressure

1. Insert > Pressure
2. Select faces
3. Set:
   - **Magnitude**: In Pa or MPa
   - **Direction**: Normal to face (positive = into surface)

### Moment

1. Insert > Moment
2. Select faces or edges
3. Set:
   - **Magnitude**: In N·m or kN·m
   - **Axis**: Select edge or define vector

### Remote Force

1. Insert > Remote Force
2. Select faces
3. Set:
   - **Magnitude and direction**: Force vector
   - **Application point**: Coordinates (can be outside geometry)

### Gravity

1. Insert > Standard Earth Gravity
2. Set direction: X, Y, or Z (typically -Y for downward)
3. Magnitude: 9.81 m/s² (automatic)

### Thermal Load

1. Insert > Thermal Condition
2. Select bodies
3. Set:
   - **Temperature**: In °C or K
4. Thermal strain: εth = α × ΔT
5. Thermal stress develops if constrained

## Solution

### Running the Analysis

1. Right-click Solution > Solve
2. ANSYS solver performs:
   - Matrix assembly
   - Direct solver (sparse) or iterative solver (PCG)
   - Displacement calculation
   - Stress recovery
3. Monitor solver output:
   - **Force convergence**: Should converge in 1-3 iterations (linear)
   - **Warnings**: Check for rigid body motion or excessive distortion

### Results Evaluation

1. Insert > Stress > Equivalent (von Mises)
2. View stress contour:
   - **Maximum**: Location and value
   - **Distribution**: Color contour plot
3. Compare to material yield:
   - **σmax ≤ σy**: Design is safe (elastic)
   - **σmax > σy**: Yield occurs (need nonlinear analysis)

### Safety Factor

1. Insert > Stress Tools > Safety Factor
2. Set:
   - **Theory**: Maximum Shear Stress (Tresca) or Distortion Energy (von Mises)
   - **Yield strength**: From material
3. View safety factor contour:
   - **Minimum**: Must be > 1.0 for safe design
   - **Typical target**: > 1.5 for static, > 2.0 for dynamic

### Deformation

1. Insert > Deformation > Total
2. View:
   - **Maximum displacement**: Location and value
   - **Deformed shape**: Scaled for visibility
3. Check:
   - **Stiffness**: Is deflection within allowable?
   - **Interference**: Does deformed shape contact other parts?

### Stress Linearization

1. Insert > Stress Linearization
2. Draw a line (path) through the section of interest
3. ANSYS separates:
   - **Membrane stress**: Uniform stress across section
   - **Bending stress**: Linear variation across section
   - **Peak stress**: Nonlinear (local concentration)
4. Use for pressure vessel design per ASME BPVC

## Verification Checklist

- [ ] Geometry is clean (no sliver faces, gaps)
- [ ] Material properties are correct (E, ν, density)
- [ ] Mesh quality is acceptable (orthogonal quality > 0.1)
- [ ] Mesh is converged (stress change < 5% with refinement)
- [ ] Boundary conditions prevent rigid body motion
- [ ] Loads are applied in correct direction and magnitude
- [ ] Reaction forces balance applied loads
- [ ] Maximum stress is below yield (or plasticity is modeled)
- [ ] Safety factor > 1.0 at all locations
- [ ] Deformation is within allowable limits

## Common Issues

### Rigid Body Motion

**Symptom**: Solver fails with "insufficient constraints" or diverges.
**Fix**: Add sufficient supports to prevent all rigid body motion. Check for under-constrained parts in assemblies.

### Stress Singularity

**Symptom**: Stress increases indefinitely with mesh refinement at a sharp corner.
**Fix**: Add a small fillet radius at the corner. Use stress linearization to extract realistic stress.

### Contact Non-Convergence

**Symptom**: Solver fails to converge in contact regions.
**Fix**: Use augmented Lagrange formulation. Add contact stabilization. Refine mesh at contact.

### Excessive Memory

**Symptom**: Solver runs out of memory (RAM).
**Fix**: Reduce mesh density. Use iterative solver (PCG). Use distributed parallel solving. Increase RAM or use HPC.

## Wrapping Up

After running hundreds of static structural analyses, we can tell you that the workflow itself is straightforward. What separates a good analysis from a bad one is the stuff around the edges: making sure your mesh is actually converged (not just "looks fine"), double-checking that your boundary conditions aren't over-constraining the model, and knowing the difference between a real stress concentration and a singularity that will just keep climbing as you refine. Get those things right, and your FEA results will be something you can trust.
