---
title: "Siemens Femap FEA Pre-Processing: Mesh Generation, Element Quality, and Analysis Setup"
excerpt: "Set up FEA models in Siemens Femap: import CAD geometry, generate mesh with appropriate element types, check mesh quality, apply boundary conditions, and configure analysis for NX Nastran."
category: "workflow"
softwareSlug: "femap"
keyword: "siemens femap fea mesh generation element quality analysis setup"
slug: "siemens-femap-fea-mesh-generation-element-quality-analysis-setup"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-13"
sources:
  - "https://www.siemens.com/en-us/products/simcenter/simulation-test/finite-element-pre-post-processing/"
  - "https://www.siemens.com/en-us/products/simcenter/mechanical-simulation/femap/"
---

# Siemens Femap FEA Pre-Processing: Mesh Generation, Element Quality, and Analysis Setup

Femap is Siemens' CAD-independent FEA pre- and post-processor. It works with multiple solvers (NX Nastran, MSC Nastran, ANSYS, Abaqus) but is most commonly paired with NX Nastran. The pre-processing workflow — from CAD import to analysis-ready model — determines the quality of your results. I'll walk through each step.

## Step 1: CAD Import and Cleanup

### Importing Geometry

Femap supports multiple CAD formats:

1. **File > Import > Geometry**
2. Supported formats:
   - **STEP (AP203/AP214)** — most reliable for solid models
   - **IGES** — older but widely supported
   - **Parasolid** — native Siemens format, best fidelity
   - **SolidWorks, CATIA, NX, Creo** — direct import with plugin
3. Verify the imported geometry:
   - Check for missing faces or surfaces
   - Look for sliver faces (very thin surfaces that create bad mesh)
   - Verify dimensions and units

### Geometry Cleanup

Before meshing, clean up the geometry:

1. **Remove features** that don't affect analysis:
   - Small fillets and chamfers (unless stress concentration is important)
   - Logo text and decorative features
   - Fastener holes (if not critical to the analysis)
2. **Repair surfaces**:
   - Merge adjacent surfaces (Surface > Stitch)
   - Fix gaps and overlaps
   - Remove duplicate surfaces
3. **Create midsurfaces** for thin-walled parts:
   - Mesh > Midsurface > Automatic
   - Extract the mid-surface between two parallel faces
   - Ideal for sheet metal and thin walls

## Step 2: Mesh Generation

### Element Types

Choose the right element type for your geometry:

| Element Type | Shape | Use Case |
|---|---|---|
| CHEXA | Hexahedral (brick) | Solid parts, regular geometry |
| CTETRA | Tetrahedral | Solid parts, complex geometry |
| CQUAD4 | Quadrilateral shell | Thin walls, sheet metal |
| CTRIA3 | Triangular shell | Transition areas, irregular surfaces |
| CBAR | Beam | Frame structures, trusses |
| CBEAM | Beam (with shear) | Beams with significant shear |
| CELAS | Spring | Fasteners, connections |

### Meshing Strategy

#### Solid Meshing (Tetrahedral)

1. **Mesh > Mesh Control > Solid**
2. Set element size:
   - **Default size** — 2-5mm for small parts, 10-20mm for large structures
   - **Curvature-based sizing** — smaller elements on curved surfaces
3. **Mesh > Mesh Geometry > Solid**
4. Femap generates the tetrahedral mesh automatically
5. Use **refinement** on specific surfaces or edges for better detail capture

#### Solid Meshing (Hexahedral)

Hex meshing gives better results but requires more setup:

1. **Decompose the solid** into meshable blocks
2. **Mesh each block** with a hex mesh
3. Use **Mesh > Mesh Geometry > Solid (Hex)** for automatic hex meshing
4. Manual hex meshing gives the most control but is time-consuming

#### Shell Meshing

For thin-walled parts:

1. **Extract midsurfaces** from the solid
2. **Mesh > Mesh Control > Surface**
3. Set element size based on wall thickness (typically 3-5× thickness)
4. **Mesh > Mesh Geometry > Surface**
5. Femap generates quadrilateral shell elements

#### Beam Meshing

For frame structures:

1. **Define beam properties** — cross-section, material, orientation
2. **Create beam elements** along lines or curves
3. **Define beam orientation** — the neutral axis direction

### Mesh Quality Checking

After meshing, check element quality:

1. **Mesh > Toolbox > Quality**
2. Key metrics:
   - **Aspect ratio** — ratio of longest to shortest edge; should be < 5
   - **Warpage** — out-of-plane distortion of quads; should be < 5°
   - **Skew** — angular distortion; should be < 30°
   - **Jacobian** — distortion measure; should be > 0.6
   - **Tet collapse** — for tet elements; should be > 0.3
3. **Highlight poor elements** — Femap colors elements by quality
4. **Remesh poor areas** — refine the mesh where quality is low

## Step 3: Material Properties

1. **Model > Material**
2. Define material properties:
   - **Young's modulus (E)** — in stress/strain units
   - **Poisson's ratio (ν)** — typically 0.3 for metals
   - **Density (ρ)** — for dynamic analysis
   - **Yield stress** — for nonlinear analysis
   - **Thermal conductivity** — for thermal analysis
3. Assign material to elements or properties

## Step 4: Properties

1. **Model > Property**
2. Define element properties:
   - **Shell thickness** — for shell elements
   - **Beam cross-section** — for beam elements
   - **Solid material** — for solid elements (material is assigned at property level)
3. Assign properties to elements

## Step 5: Boundary Conditions

### Constraints

1. **Model > Constraint > Nodal**
2. Fix DOFs:
   - **Fully fixed** — all 6 DOFs constrained
   - **Pinned** — only translations constrained, rotations free
   - **Sliding** — one translation free, others constrained
3. For symmetry:
   - **Symmetry** — constrain normal translation and two rotations
   - **Anti-symmetry** — constrain two translations and normal rotation

### Loads

1. **Model > Load > Nodal** — point loads
2. **Model > Load > On Surface** — pressure loads
3. **Model > Load > On Element** — distributed loads
4. **Model > Load > Body** — gravity, centrifugal, thermal
5. **Load combinations** — combine multiple load cases

## Step 6: Analysis Setup

1. **Model > Analysis**
2. Select analysis type:
   - **Static** — SOL 101 (linear static)
   - **Modal** — SOL 103 (natural frequencies)
   - **Frequency response** — SOL 111 (harmonic)
   - **Transient** — SOL 112 (time-domain)
   - **Buckling** — SOL 105
   - **Nonlinear static** — SOL 106 or SOL 400
3. Set analysis parameters:
   - **Number of modes** (for modal)
   - **Frequency range** (for frequency response)
   - **Time steps** (for transient)
4. Select output requests:
   - **Displacement** — at all nodes
   - **Stress** — at all elements
   - **Strain energy** — for optimization
   - **Reaction forces** — at constrained nodes
5. Click **Analyze** to run

## Common Issues

### Mesh Too Coarse

Stress results show jagged discontinuities or don't converge with mesh refinement.

**Fix:** Refine the mesh in high-stress areas. Use convergence testing — refine until results change by less than 5%.

### Mesh Too Fine

Analysis takes too long or runs out of memory.

**Fix:** Use coarser mesh in low-stress areas. Use submodeling — run a coarse model first, then refine specific areas.

### Constraint Problems

The model has rigid body modes or unexpected deformation.

**Fix:** Check that constraints prevent all rigid body motion (6 DOFs for 3D). Use the "Free Body Check" tool to verify.

### Wrong Element Type

Using solid elements for thin walls gives poor results due to locking.

**Fix:** Use shell elements for walls with thickness/length ratio < 1/20. Use beam elements for slender members.

## Best Practices

- **Simplify geometry before meshing** — remove unnecessary features
- **Use the right element type** — shells for thin walls, solids for thick parts, beams for frames
- **Check mesh quality** — aspect ratio, warpage, skew
- **Convergence test** — refine mesh until results stabilize
- **Use symmetry** — reduces model size by 50-75%
- **Name groups clearly** — organize nodes, elements, and loads into named groups
- **Save frequently** — Femap doesn't auto-save
- **Verify with hand calculations** — compare FEA results with simple analytical solutions for validation
