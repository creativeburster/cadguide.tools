---
title: "ANSYS Mechanical Meshing Problems: Fixing Poor Mesh Quality, Stuck Mesher, and Convergence Failures"
excerpt: "A troubleshooting guide for ANSYS Mechanical meshing issues, covering mesh quality diagnostics, small edge cleanup, convergence problems, and practical strategies for complex geometry."
category: "troubleshooting"
softwareSlug: "ansys-mechanical"
keyword: "ansys mechanical meshing problems"
slug: "ansys-mechanical-meshing-problems-poor-quality-stuck-convergence"
author: "CADGuide Technical Editorial"
readTime: "14 min read"
date: "2026-06-30"
sources:
  - "https://www.reddit.com/r/CFD/comments/1oc3b4v/so_why_did_ansys_do_this_to_my_mesh/"
  - "https://www.reddit.com/r/fea/comments/17ziy4c/ansys_fea_not_converging_with_finer_mesh_size/"
  - "https://www.reddit.com/r/ANSYS/comments/1gpsot9/meshing/"
  - "https://www.reddit.com/r/fea/comments/jhlfxz/ansys_meshing_stuck_what_can_be_done/"
---

# ANSYS Mechanical Meshing Problems: Fixing Poor Mesh Quality, Stuck Mesher, and Convergence Failures

I've spent days fighting ANSYS Mechanical's mesher on complex geometry — and the community discussions show I'm far from alone. On Reddit's r/CFD, a user posted a mesh disaster with 216 upvotes, asking "So why did Ansys do this to my mesh?" The response pointed to a knife-edge trailing edge causing high aspect ratio cells and bad convergence. On r/fea, a user reported that their "ANSYS FEA not converging with finer mesh size" — a counterintuitive problem where refining the mesh made things worse. On r/ANSYS, a beginner asked for mesh quality feedback and was told they need "3 elements through the thickness" and should "look into adding a mesh convergence." And on r/fea, a user with a stuck mesher was advised to "investigate the model and remove/clean-up small edges" because "really small edges will throw Ansys mesher."

These four issues — poor mesh quality, stuck mesher, convergence failures, and mesh refinement paradoxes — are the most common meshing problems in ANSYS Mechanical. This guide covers the diagnostic and fix strategies I've developed through years of working with complex CAD geometry.

## Problem 1: Mesher Stuck or Failing to Generate

### Symptoms

- Mesher runs indefinitely without progress
- Mesher fails with "mesh generation failed" error
- Mesher gets stuck at a specific percentage

### Root Cause

On Reddit, a user with a stuck mesher received this advice: "Investigate the model and remove/clean-up small edges. Really small edges will throw Ansys mesher. It's really hard to create elements on small edges. Ensure there's no overlapping geometry."

Small edges, sliver faces, and overlapping geometry are the most common causes of meshing failure. The mesher struggles to create elements on geometric features smaller than the target element size.

### Fix

1. **Use the Geometry Repair Tools**: In SpaceClaim or DesignModeler, use the repair tools to find and fix small edges, sliver faces, and gaps. In SpaceClaim: Repair > Small Faces, Repair > Edges, Repair > Gaps.

2. **Merge small faces**: Use the Merge Faces tool in SpaceClaim to combine adjacent small faces into larger ones.

3. **Simplify the geometry**: Remove unnecessary features like fillets, chamfers, and small holes that don't affect the analysis results. Use the Share Topology feature to ensure shared edges between parts are properly connected.

4. **Use Virtual Topology**: In ANSYS Mechanical, right-click the geometry and insert Virtual Topology. This lets you combine small faces into virtual faces without modifying the CAD geometry. The mesher treats virtual faces as single faces, avoiding small edge problems.

5. **Check for overlapping geometry**: Ensure parts don't overlap. If parts share a face, use the Share Topology feature to properly connect them rather than leaving them overlapping.

## Problem 2: Poor Mesh Quality

### Symptoms

- Mesh generates but has poor quality metrics (low orthogonal quality, high skewness)
- Elements with high aspect ratios
- Mesh looks distorted or irregular in specific regions

### Root Cause

Poor mesh quality usually results from geometry features that force the mesher to create distorted elements. On Reddit's r/CFD, the knife-edge trailing edge was the culprit: "Maybe try squaring it off with a 0.1mm edge. I've seen many convergence and mesh issues because of knife edges. They tend to mess with the mesh, you get high aspect ratio cells, then bad convergence."

### Fix

1. **Check mesh quality metrics**: In the Mesh details, enable Quality > Error Limits and check Orthogonal Quality, Skewness, and Aspect Ratio. Target values:
   - Orthogonal Quality > 0.2 (minimum)
   - Skewness < 0.95 (maximum)
   - Aspect Ratio < 100 (for structural), < 50 (for CFD)

2. **Use mesh sizing controls**: Insert Body Sizing, Face Sizing, or Edge Sizing to control element size in critical regions. Refine the mesh where high stress gradients are expected.

3. **Use inflation layers**: For CFD or thermal analysis, use inflation layers to create structured boundary layer meshes near walls. Set the first layer thickness based on y+ calculations.

4. **Use mesh methods**: Try different mesh methods (Hex Dominant, Tetrahedrons, MultiZone) to see which produces better quality for your geometry. MultiZone often produces high-quality hex meshes for sweepable geometry.

5. **Square off knife edges**: As recommended on Reddit, replace sharp trailing edges with a small flat face (0.1mm). This prevents the mesher from creating degenerate elements at the sharp edge.

## Problem 3: FEA Not Converging with Finer Mesh

### Symptoms

- Analysis converges with coarse mesh but fails with fine mesh
- Stress results increase dramatically with mesh refinement
- Results don't stabilize with mesh refinement

### Root Cause

On Reddit's r/fea, a user reported this exact problem. The most common cause is a stress singularity — a point where stress theoretically goes to infinity, such as a sharp internal corner (re-entrant corner). As the mesh refines, the stress at the singularity increases without bound, preventing convergence.

Other causes include:
- Incompatible element formulations at material interfaces
- Contact elements with excessive penetration
- Nonlinear material models with insufficient substeps

### Fix

1. **Identify stress singularities**: Look for re-entrant corners (internal angles > 180 degrees). Add a small fillet radius (even 0.1mm) to eliminate the singularity. The stress will converge to a finite value.

2. **Use mesh convergence study**: Create a mesh convergence plot with 3-5 mesh sizes. If stress increases linearly with 1/element-size, you have a singularity. If stress stabilizes, the mesh is converging.

3. **Increase substeps**: For nonlinear analyses, increase the number of substeps in Analysis Settings. This helps the solver converge by applying load in smaller increments.

4. **Check contact settings**: If using contact elements, verify the contact stiffness is appropriate. Too high causes convergence difficulty; too low causes excessive penetration. Use the "Update Stiffness" option set to "Each Iteration."

5. **Use appropriate element types**: For thin-walled structures, use shell elements rather than solid elements. Solid elements with poor aspect ratios in thin walls cause convergence issues.

## Problem 4: Mesh Convergence Study

On Reddit's r/ANSYS, a beginner was told to "look into adding a mesh convergence" study. This is the process of refining the mesh until results stabilize.

### How to Perform a Mesh Convergence Study

1. Start with a coarse mesh and record the result of interest (e.g., maximum stress)
2. Refine the mesh (halve the element size) and re-run
3. Repeat 3-5 times
4. Plot result vs. element size
5. The result should asymptotically approach a stable value
6. Choose the mesh size where the result changes by less than 5% between refinements

### Common Mistakes

- **Refining globally instead of locally**: Only refine in regions of high stress gradients. Global refinement wastes computation time.
- **Not enough refinement steps**: 3-5 refinement levels are needed to see the convergence trend.
- **Using the wrong result metric**: Maximum stress is sensitive to singularities. Use a result at a specific point away from singularities for convergence assessment.

## My Take

ANSYS meshing problems almost always trace back to geometry quality. The most effective habit is cleaning up CAD geometry before importing it into ANSYS — remove unnecessary fillets, merge small faces, and square off knife edges. Virtual Topology is the most underused tool in ANSYS Mechanical; it lets you fix geometry issues without going back to CAD, which is invaluable when you don't have access to the original CAD files. For convergence problems, always check for stress singularities first — if your stress keeps increasing with mesh refinement, you have a singularity, not a mesh quality problem. Add a small fillet and the problem disappears.
