---
title: "Simcenter STAR-CCM+ Meshing Pipeline: Surface Mesh, Polyhedral Mesh, and Prism Layers"
excerpt: "Generate high-quality CFD meshes in Simcenter STAR-CCM+: prepare CAD geometry with surface repair, create surface meshes, generate polyhedral volume meshes with prism boundary layers, and validate mesh quality."
category: "workflow"
softwareSlug: "simcenter-star-ccm"
keyword: "simcenter star-ccm+ meshing pipeline polyhedral prism layer"
slug: "simcenter-star-ccm-meshing-pipeline-surface-polyhedral-prism-layers"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-13"
sources:
  - "https://www.siemens.com/en-us/products/simcenter/fluids-thermal-simulation/star-ccm/"
  - "https://community.sw.siemens.com/s/article/A-new-user-s-guide-to-STAR-CCM-simulation-Part-3-5-Meshing"
---

# Simcenter STAR-CCM+ Meshing Pipeline: Surface Mesh, Polyhedral Mesh, and Prism Layers

Meshing is the most time-consuming part of CFD setup, and mesh quality determines result accuracy. Simcenter STAR-CCM+ has one of the most robust meshing pipelines in commercial CFD — its polyhedral mesher produces high-quality cells with minimal user intervention. I'll walk through the complete meshing workflow.

## STAR-CCM+ Meshing Overview

The meshing pipeline in STAR-CCM+ follows these stages:

1. **Geometry import and surface repair** — clean up CAD surfaces
2. **Surface mesh generation** — create 2D mesh on all surfaces
3. **Volume mesh generation** — fill the flow domain with 3D cells
4. **Prism layer generation** — add boundary layer cells near walls
5. **Mesh quality validation** — check for poor cells

Each stage is controlled by mesh operations and meshers that you configure in the simulation tree.

## Step 1: Geometry Import and Surface Repair

### Importing CAD Geometry

1. **File > Import > Surface Mesh** or **Part**
2. Supported formats: STEP, IGES, Parasolid, STL, JT
3. After import, the geometry appears in the 3D view
4. Check for:
   - **Free edges** — gaps in the surface
   - **Non-manifold edges** — edges shared by more than two faces
   - **Pierced faces** — self-intersecting surfaces
   - **Duplicate faces** — overlapping surfaces

### Surface Repair

1. Right-click the geometry part > **Repair Surface**
2. Use the surface repair tools:
   - **Find Free Edges** — highlights gaps
   - **Find Pierced Faces** — highlights intersections
   - **Find Non-manifold Edges** — highlights topology issues
   - **Merge Faces** — combine adjacent faces
   - **Fill Holes** — close gaps
   - **Delete Faces** — remove unwanted features
3. Fix all issues before proceeding — the mesher requires a clean surface

### Surface Preparation

1. **Create parts** for each boundary type (inlet, outlet, wall, symmetry)
2. **Assign part surfaces** to the appropriate boundary
3. **Create a domain** — the fluid volume enclosed by the surfaces
4. **Create a block** — the background mesh region

## Step 2: Mesh Operations Setup

### Creating a Mesh Operation

1. Right-click **Mesh** in the simulation tree > **New Mesh Operation**
2. Choose the mesh operation type:
   - **Automated Mesh** — all-in-one pipeline
   - **Surface Mesh** — surface mesh only
   - **Volume Mesh** — volume mesh from existing surface mesh
   - **Polyhedral Mesher** — generates polyhedral cells
   - **Trimmer** — generates trimmed hexahedral cells

### Automated Mesh Operation

The Automated Mesh operation combines all stages:

1. Right-click **Mesh** > **New Mesh Operation** > **Automated Mesh**
2. Select the parts to mesh
3. Choose meshers:
   - **Surface Remesher** — regenerates the surface mesh
   - **Polyhedral Mesher** — generates polyhedral volume mesh
   - **Prism Layer Mesher** — adds boundary layers
4. Configure each mesher's settings

## Step 3: Surface Mesh Configuration

### Surface Remesher Settings

1. In the mesh operation, expand **Meshers** > **Surface Remesher**
2. Key settings:
   - **Target Surface Size** — base element size on surfaces
   - **Minimum Surface Size** — smallest element size (for fine features)
   - **Number of Prism Layers** — not applicable here (set in prism layer mesher)
   - **Surface Growth Rate** — how fast elements grow from small to large areas
3. Use **Custom Surface Size** for specific surfaces:
   - **Inlet/outlet** — coarser mesh
   - **Walls** — finer mesh for boundary layer
   - **Small features** — refined mesh to capture geometry

### Surface Quality

After generating the surface mesh, check:
- **Face Quality** — should be > 0.1 (scale 0-1)
- **Face Validity** — should be 1.0 for all faces
- **Area Skewness** — should be < 0.7

## Step 4: Volume Mesh Configuration

### Polyhedral Mesher

Polyhedral cells are STAR-CCM+'s default volume mesh type:

1. Expand **Meshers** > **Polyhedral Mesher**
2. Key settings:
   - **Target Cell Size** — base volume cell size
   - **Minimum Cell Size** — smallest cells (near walls or features)
   - **Cell Growth Rate** — how fast cells grow from fine to coarse regions
3. Polyhedral cells offer:
   - Better gradient approximation than tetrahedra
   - Fewer cells needed for the same accuracy
   - Better convergence behavior

### Trimmer Mesher (Alternative)

For structured geometries, the Trimmer produces hexahedral-like cells:

1. Choose **Trimmer** instead of **Polyhedral Mesher**
2. Settings:
   - **XYZ Relative Size** — cell size as percentage of bounding box
   - **Refinement Levels** — local refinement regions
3. Trimmer is better for:
   - Simple geometries (pipes, ducts, external aero)
   - Cases where hexahedral mesh is preferred
   - Large external aerodynamics (fewer cells than polyhedral)

## Step 5: Prism Layer Configuration

Prism layers are essential for accurate wall-bounded flow:

1. Expand **Meshers** > **Prism Layer Mesher**
2. Key settings:
   - **Number of Prism Layers** — typically 5-15
   - **Prism Layer Stretching** — growth ratio between layers (typically 1.2-1.5)
   - **Prism Layer Thickness** — total thickness of all layers
3. Calculate prism layer thickness:
   - For y+ ≈ 1 (DNS/LES): first cell height ≈ (y+ × μ) / (ρ × U_τ)
   - For y+ ≈ 30 (wall functions): first cell height ≈ (y+ × μ) / (ρ × U_τ)
   - U_τ = friction velocity ≈ U_∞ × sqrt(Cf/2)

### Prism Layer Quality

Common prism layer issues:
- **High aspect ratio** — prism cells much taller than wide
- **Negative volume cells** — prism layers collapse in sharp corners
- **Poor coverage** — prism layers don't cover all wall surfaces

**Fixes:**
- Reduce the number of prism layers in tight corners
- Use **Prism Layer Core Morphing** to improve layer quality
- Enable **Thin Layer** mode for thin gaps

## Step 6: Generate and Validate the Mesh

### Generate the Mesh

1. Right-click the mesh operation > **Execute**
2. The meshing pipeline runs through all stages
3. Monitor the output for warnings and errors
4. The mesh appears in the 3D view when complete

### Mesh Quality Checks

1. Create a **Mesh Quality Report**:
   - Right-click **Mesh** > **Quality Report**
2. Key metrics:
   - **Cell Quality** — should be > 0.1 (scale 0-1)
   - **Cell Validity** — should be 1.0 for all cells
   - **Volume Skewness** — should be < 0.8
   - **Face Validity** — should be > 0.9
3. Create threshold scenes to visualize poor cells:
   - Right-click **Scenes** > **New Scene** > **Mesh**
   - Set threshold on Cell Quality to highlight cells < 0.1

### Mesh Statistics

Check the mesh statistics:
- **Total cells** — within your computational budget?
- **Minimum cell volume** — not negative or extremely small
- **Maximum cell aspect ratio** — should be < 1000
- **Maximum non-orthogonality** — should be < 70°

## Common Meshing Issues

### Surface Mesh Doesn't Conform to Geometry

The surface remesher may not capture small features. Increase the number of refinement levels or reduce the minimum surface size.

### Prism Layers Collapse in Corners

Sharp internal corners cause prism layer cells to collapse. Use:
- Fewer prism layers in corner regions
- Prism layer corner treatment (set in prism layer mesher)
- Local refinement to smooth the corner

### Mesh Too Large

- Increase base cell size
- Use fewer refinement levels
- Use the Trimmer instead of Polyhedral for structured geometries
- Use local refinement only where needed

### Poor Cell Quality

- Run the **Mesh Quality Optimizer** (available in the mesh operation)
- Increase the number of optimization iterations
- Refine the surface mesh before generating the volume mesh

## Best Practices

- **Clean geometry first** — surface repair is the most important step
- **Start coarse** — generate a coarse mesh, verify it works, then refine
- **Use local refinement** — don't refine globally; refine only where needed
- **Check mesh quality** — always review the quality report before running the solver
- **Calculate prism layer height** — use y+ calculator for correct first cell height
- **Use polyhedral mesh** for complex geometry, trimmer for simple geometry
- **Validate with a simple case** — test your meshing setup on a benchmark case first
