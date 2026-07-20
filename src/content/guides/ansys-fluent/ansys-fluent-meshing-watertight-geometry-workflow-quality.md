---
title: "ANSYS Fluent Meshing: Watertight Geometry Workflow and Mesh Quality Optimization"
excerpt: "How to use ANSYS Fluent Meshing with the Watertight Geometry workflow — covering surface mesh generation, size functions, boundary layers, volume mesh creation, and improving mesh quality metrics for convergence."
category: "workflow"
softwareSlug: "ansys-fluent"
keyword: "ansys fluent meshing watertight geometry workflow mesh quality"
slug: "ansys-fluent-meshing-watertight-geometry-workflow-quality"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-07-09"
sources:
  - "https://innovationspace.ansys.com/knowledge/forums/topic/what-are-the-suggested-steps-if-i-am-having-convergence-issues-for-conjugate-heat-transfer-problems/"
  - "https://www.reddit.com/r/CFD/comments/iczzm1/issues_with_convergence_in_ansys_fluent/"
---

# ANSYS Fluent Meshing: Watertight Geometry Workflow and Mesh Quality Optimization

Mesh quality determines whether your CFD simulation converges and whether the results are accurate. I've spent more time fixing meshes than running simulations. ANSYS Fluent Meshing with the Watertight Geometry workflow has made the process more predictable, but it's still not push-button. Here's my workflow for generating high-quality meshes that converge on the first or second try.

## Why Mesh Quality Matters

A poor mesh causes:
- **Divergence** — residuals blow up, simulation crashes
- **Slow convergence** — residuals oscillate but never settle
- **Inaccurate results** — mesh too coarse to capture flow features
- **Numerical diffusion** — skew elements smear gradients
- **y+ problems** — boundary layer mesh doesn't match turbulence model requirements

## Step 1: Prepare Geometry

The Watertight Geometry workflow requires clean, closed solid geometry.

1. Import CAD geometry into Fluent Meshing (STEP, Parasolid, or native CAD).
2. Check for geometry issues:
   - **Gaps and holes** — surfaces must form a closed volume
   - **Sliver faces** — very thin faces that create bad elements
   - **Self-intersections** — surfaces that cross each other
   - **Duplicate surfaces** — overlapping faces
3. Use **Fault Tolerant Meshing** if geometry can't be cleaned (complex assemblies with gaps).

### Geometry Cleanup Tips

- **Simplify non-critical features** — remove fillets, small holes, and logos that don't affect flow
- **Check for small gaps** — gaps smaller than the mesh size cause meshing failures
- **Merge coincident faces** — duplicate surfaces create zero-thickness regions
- **Validate watertightness** — use the geometry diagnostic tools before meshing

## Step 2: Start the Watertight Geometry Workflow

1. Open Fluent Meshing.
2. Select **Watertight Geometry Workflow**.
3. The workflow appears as a sequential tree:
   - Import CAD Geometry
   - Add Local Sizing
   - Surface Mesh
   - Boundary Layers
   - Volume Mesh

## Step 3: Configure Global Mesh Sizing

1. In the workflow, set **Min Size** and **Max Size**:
   - **Min Size**: 1/10 to 1/5 of the target element size — prevents tiny elements
   - **Max Size**: 5-10x the target element size — allows coarsening in open regions
2. Set **Growth Rate**: 1.2 (default) — controls how fast elements grow from fine to coarse regions
3. Set **Size Function Resolution**: Medium (default) — controls how aggressively the mesher refines

### Sizing Rules of Thumb

- **Target element size**: Based on the smallest flow feature you need to capture
- **Min Size**: Not too small relative to target — causes excessive cleanup
- **Max Size**: Not too small — limits coarsening in open flow regions
- **Growth Rate**: 1.15-1.3 — too low creates too many transition elements; too high creates quality issues

## Step 4: Add Local Sizing

Local sizing refines the mesh in critical regions:

1. Click **Add Local Sizing** in the workflow.
2. Create size functions for specific regions:
   - **Body of Influence (BOI)**: Refine mesh in a volume (e.g., wake region behind a bluff body)
   - **Face Size**: Control mesh size on specific faces (e.g., inlet, outlet, walls)
   - **Edge Size**: Control mesh size on specific edges
3. For each local size:
   - **Target Size**: The desired element size in that region
   - **Growth Rate**: How fast elements transition from this size to the global size

### Where to Use Local Sizing

- **Inlet and outlet**: Fine mesh for accurate flow entry/exit
- **Walls with high gradients**: Refine where separation or reattachment is expected
- **Wake regions**: BOI behind bluff bodies to capture vortex shedding
- **Small features**: Local refinement around probes, sensors, or small openings
- **Junctions**: T-junctions, Y-junctions where flow mixing occurs

## Step 5: Generate the Surface Mesh

1. Click **Surface Mesh** in the workflow.
2. Configure:
   - **Min Size**: From global sizing
   - **Max Size**: From global sizing
   - **Growth Rate**: From global sizing
   - **Quality Limit**: Set to 0.7 (orthogonal quality) — elements below this are flagged
3. Click **Generate**.
4. Review the surface mesh:
   - **Check quality**: Look for elements with orthogonal quality < 0.1
   - **Check skewness**: Look for elements with skewness > 0.85
   - **Check free edges**: Gaps in the surface mesh indicate geometry problems

### Surface Mesh Quality Targets

- **Orthogonal Quality**: > 0.3 (higher is better)
- **Skewness**: < 0.8 (lower is better)
- **Aspect Ratio**: < 20 for most applications
- **Free edges**: Zero — the mesh must be watertight

### Fixing Surface Mesh Issues

**Poor quality elements on fillets**: Increase the local size on fillet faces or reduce the global size.

**Gaps in the surface mesh**: The geometry has gaps. Return to geometry cleanup or use the **Fill Holes** tool.

**High skewness at junctions**: Add local edge sizing at the junction edges to control element size.

## Step 6: Add Boundary Layers

Boundary layers capture near-wall flow gradients and are critical for accurate wall shear stress and heat transfer.

1. Click **Boundary Layers** in the workflow.
2. Select the wall faces where boundary layers are needed.
3. Configure:
   - **Number of Layers**: 10-15 for y+ < 1 (SST k-omega), 5-8 for y+ ~ 30-300 (k-epsilon with wall functions)
   - **First Layer Height**: Based on target y+ value
   - **Growth Rate**: 1.1-1.2 (smooth transition)
   - **Transition Ratio**: 1.2 (ratio of last boundary layer to first volume mesh element)

### Calculating First Layer Height for Target y+

For a target y+ of 1:
```
y = (y+) × (nu) / (u_tau)
u_tau = sqrt(tau_w / rho)
tau_w = mu × (du/dy)_wall
```

In practice, use the y+ calculator in Fluent or online tools. Typical first layer heights:
- **External aerodynamics**: 0.01-0.1 mm for y+ ~ 1
- **Internal flows**: 0.1-0.5 mm for y+ ~ 1
- **Wall functions (y+ ~ 30-300)**: 1-10 mm

### Boundary Layer Quality Issues

**Layer collapse**: Boundary layers collapse in sharp corners. Fix by:
- Reducing the number of layers in corner regions
- Using the **Smooth Transition** option instead of uniform layers
- Adding local sizing at corner edges

**Negative volume cells**: Boundary layers overlap in narrow channels. Fix by:
- Reducing the number of layers
- Reducing the first layer height
- Using the **Blend Surface** option to smooth the boundary layer

## Step 7: Generate the Volume Mesh

1. Click **Volume Mesh** in the workflow.
2. Select mesh type:
   - **Poly-Hexcore**: Recommended for most applications — good quality, efficient
   - **Polyhedra**: Good for complex geometry — robust but more elements
   - **Hexcore**: Good for simple geometry — efficient but less robust
   - **Tetrahedra**: Fallback for very complex geometry — lowest quality
3. Click **Generate**.
4. Review the volume mesh quality:
   - **Orthogonal Quality**: > 0.2 (minimum), > 0.5 (average)
   - **Skewness**: < 0.9 (maximum), < 0.5 (average)
   - **Cell count**: Check against available computational resources

### Cell Count Guidelines

- **2D simulation**: < 100,000 cells — runs in minutes
- **Simple 3D**: 1-5 million cells — runs in hours
- **Complex 3D**: 5-20 million cells — runs in hours to days
- **Industrial 3D**: 20-100 million cells — requires HPC

## Step 8: Check and Improve Mesh Quality

After generating the volume mesh:

1. Go to **Mesh** → **Check** → **Quality**.
2. Review quality metrics:
   - **Orthogonal Quality**: Distribution histogram
   - **Skewness**: Distribution histogram
   - **Aspect Ratio**: Distribution histogram
   - **Cell Volume**: Check for negative volumes
3. Identify problematic elements:
   - **Worst cells**: Note the location and cause
   - **Negative volumes**: Must be fixed — simulation will diverge
4. Use **Mesh** → **Improve** to automatically improve quality:
   - **Smoothing**: Node movement to improve quality
   - **Swapping**: Edge/face swapping to improve connectivity

### Quality Improvement Strategy

1. **Run auto-improve** — fixes most minor quality issues
2. **Check worst cells** — identify if they're in critical regions
3. **Add local sizing** — if poor quality is in a specific region
4. **Remesh** — if quality is still poor after improvement

## Step 9: Export to Fluent Solver

1. In Fluent Meshing, go to **File** → **Export** → **Case**.
2. Select the Fluent case format.
3. The mesh is exported with all boundary conditions and zones.
4. Open the case in Fluent Solver to set up physics and run.

### Pre-Solver Checks

Before starting the simulation:
1. **Check mesh statistics** — cell count, face count, zone definitions
2. **Verify boundary conditions** — all zones correctly identified
3. **Check for negative volumes** — must be zero
4. **Scale the mesh** — verify units match your geometry (mm vs m)
5. **Check domain extents** — verify the mesh covers the expected volume

## Common Meshing Problems and Fixes

### "Mesh generation failed — geometry not watertight"

The geometry has gaps or holes. Fix:
1. Return to geometry cleanup.
2. Use **Fill Holes** in Fluent Meshing.
3. Or use **Fault Tolerant Meshing** workflow instead.

### "Poor quality elements in corner regions"

Sharp corners create skewed elements. Fix:
1. Add local edge sizing at corner edges.
2. Use **Smooth Transition** for boundary layers.
3. Reduce growth rate near corners.

### "Boundary layer collapse in narrow channels"

Layers overlap in tight spaces. Fix:
1. Reduce the number of boundary layers.
2. Reduce first layer height.
3. Use **Blend Surface** option.

### "Cell count too high — simulation too slow"

Mesh is over-refined. Fix:
1. Increase the target element size in non-critical regions.
2. Reduce the number of boundary layers (use wall functions instead).
3. Use local sizing only in critical regions, not globally.

### "y+ too high after simulation"

First layer height was too large. Fix:
1. Calculate the correct first layer height for your target y+.
2. Reduce the first layer height.
3. Regenerate the boundary layers.
4. Re-run the simulation.

## Best Practices

- **Clean geometry before meshing** — the Watertight workflow requires closed solids
- **Use local sizing strategically** — refine only where needed
- **Target y+ determines boundary layer settings** — calculate before meshing
- **Use Poly-Hexcore for most applications** — best balance of quality and efficiency
- **Check quality after every step** — don't wait until the volume mesh to find issues
- **Run auto-improve before exporting** — fixes most minor quality issues
- **Verify mesh in Fluent Solver before running** — check negative volumes and scaling
- **Start coarse and refine** — run a coarse mesh first, then refine based on results
