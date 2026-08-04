---
title: "Altair Inspire PolyNURBS Fit Crash and Topology Optimization CAD Export"
excerpt: "Altair Inspire PolyNURBS Fit Crash and Topology Optimization CAD Export: symptoms, root causes, and step-by-step fixes, verified against Altair Community and help documentation."
category: "troubleshooting"
softwareSlug: "altair-inspire"
keyword: "Altair Inspire PolyNURBS fit crash nothing produced topology slider smoothing iterations shrinkwrap size gaps non-design contacts lattice structures additive manufacturing export motion analysis over-constrained joints redundant constraints topology optimization contact errors loads design space non-design geometry"
slug: "altair-inspire-polynurbs-fit-crash-and-topology-optimization-cad-expor"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
---

# Altair Inspire PolyNURBS Fit Crash and Topology Optimization CAD Export: PolyNURBS Fit Produces Nothing or Crashes from Insufficient Smoothing Iterations and Topology Slider Position, PolyNURBS Gaps at Non-Design Contacts from Shrinkwrap Size Mismatch Requiring Manual Editing, Lattice Structures Additive Manufacturing Export Errors from Unsupported Unit Cell Types, Motion Analysis Mechanism Simulation Over-Constrained Joints from Redundant Constraints, and Topology Optimization Contact Errors from Loads Applied to Design Space Instead of Non-Design Geometry

Altair Inspire's PolyNURBS fitting, lattice generation, motion analysis, and topology optimization produce errors from smoothing settings, geometry mismatches, and incorrect load application. This guide covers the 5 most common Altair Inspire problems with diagnostic steps and community-verified fixes from Altair Community and help documentation.

## 1. PolyNURBS Fit Produces Nothing or Crashes

### Symptom

After running topology optimization, clicking "Fit PolyNURBS" either produces nothing (no geometry generated) or Inspire crashes. The result appears in the Model Browser but no geometry is visible.

### Root Cause

The PolyNURBS fit algorithm fails when:
- The topology slider is positioned too far right (too much detail, disconnected members)
- Smoothing iterations are insufficient (rough surface, poor shrinkwrap)
- The shrinkwrap size is too small or too large for the geometry
- The topology result has disconnected members or small holes

### Fix

1. **Position the topology slider correctly**:
   - Too far right: disconnected members, small holes
   - Too far left: loss of important geometric detail
   - Ensure all significant members are connected before fitting

2. **Enable Smooth Results before fitting**:
   - Turn on "Smooth Results" option in the Shape Explorer
   - This creates a cleaner surface for the shrinkwrap and PolyNURBS fit

3. **Adjust smoothing parameters**:
   - Smoothing iterations: start with 80 (default varies)
   - Higher iterations = smoother surface but may lose detail
   - Lower iterations = more detail but rougher surface

4. **Adjust PolyNURBS fit parameters**:
   - Number of PolyNURBS Faces: default 2500, reduce to 1200 for smoother geometry
   - Curvature: default 50%, reduce to 40% for smoother results
   - Shrinkwrap Size: use default, adjust if geometry is very large or small

5. **Use the manual multistage process**:
   - Step 1: Shrinkwrap both design and non-design spaces together
   - Step 2: Smooth the wrapped parts
   - Step 3: Fit PolyNURBS to the smoothed wrap
   - This gives more control than the automatic fit

6. **Check Intersect option**:
   - Enable "Intersect" to boolean intersect the PolyNURBS with the original design space
   - This ensures the new part doesn't extend beyond the original volume
   - Disable if you need to preserve overlapping geometry for manual editing

### Community Report

> "When creating PolyNURBS from optimized shape, nothing is created or Inspire crashes. This happens when the topology slider is too far right and smoothing is insufficient."

## 2. PolyNURBS Gaps at Non-Design Contacts from Shrinkwrap Size Mismatch

### Symptom

After fitting PolyNURBS to topology optimization results, gaps appear where the PolyNURBS contacts non-design parts (bosses, mounts, bearing surfaces). The Contacts tool shows gaps at these locations. Subsequent analysis shows high stress concentrations at the gaps.

### Root Cause

The shrinkwrap process creates an isosurface around both design and non-design spaces. The PolyNURBS fit follows this isosurface, which may not perfectly match the non-design geometry at contact points. The shrinkwrap size parameter controls the resolution of this isosurface — if too coarse, gaps appear at contacts.

### Fix

1. **Use the Contacts tool to identify gaps**:
   - On the Structure ribbon, use the Contacts tool
   - This locates and reviews gaps between PolyNURBS and non-design parts
   - Focus on areas where loads and constraints are applied

2. **Manually close gaps with PolyNURBS editing tools**:
   - After fitting, use PolyNURBS editing tools to close gaps
   - Move control points, add faces, or reshape the PolyNURBS cage

3. **Adjust shrinkwrap size**:
   - A smaller shrinkwrap size captures more detail but may create rougher surfaces
   - A larger shrinkwrap size is smoother but may create larger gaps
   - Find the balance that minimizes gaps while maintaining smoothness

4. **Disable Intersect for overlapping geometry**:
   - This eliminates gaps but requires manual trimming
   - Use when gaps at contacts are too large to fix manually

5. **Re-run analysis after fixing gaps**:
   - After closing gaps, run a new analysis
   - Verify that stress concentrations at contacts are reduced

6. **Use the hybrid approach**:
   - Fit PolyNURBS with Intersect ON for the main body
   - Manually extend PolyNURBS at contact points
   - This gives clean geometry at contacts while maintaining design space compliance

### Community Report

> "Notice that the PolyNURBS part has gaps near these non-design spaces. Use the Contacts tool to locate and review these gaps. Fix them using PolyNURBS editing tools so that high stress concentration areas are not found in the subsequent analysis."

## 3. Lattice Structures Additive Manufacturing Export Errors

### Symptom

Creating lattice structures for additive manufacturing produces errors during export. The lattice unit cell type is not supported by the 3D printing slicer, or the exported file has non-manifold geometry.

### Root Cause

Inspire's lattice structure generation creates complex unit cell geometries that may not export cleanly to STL/3MF format. Some unit cell types create non-manifold edges or self-intersections that slicers can't process.

### Fix

1. **Choose supported unit cell types**:
   - Use simple unit cells (gyroid, strut, grid) for better printability
   - Avoid complex unit cells with thin struts or self-intersections
   - Test export with a single unit cell before generating the full lattice

2. **Check lattice parameters**:
   - Ensure strut thickness is sufficient for the printing process
   - Verify unit cell size is appropriate for the part dimensions
   - Too small struts may not export cleanly

3. **Export as STL and verify**:
   - Export the lattice as STL
   - Open in a mesh repair tool (Meshmixer, Netfabb, Magics)
   - Check for non-manifold edges, holes, and self-intersections
   - Repair before sending to the slicer

4. **Use the PolyMesh ribbon tools**:
   - Before exporting, use PolyMesh tools to clean the lattice
   - Smooth the lattice surface
   - Check for and repair non-manifold geometry

5. **Consider solid lattice instead of shell**:
   - Solid lattices are more likely to export cleanly
   - Shell lattices with thin walls may create non-manifold geometry
   - Test both types and compare export quality

## 4. Motion Analysis Over-Constrained Joints from Redundant Constraints

### Symptom

Running motion analysis on a mechanism with multiple joints produces solver errors. The mechanism is over-constrained — redundant joints create conflicting constraints that the solver can't resolve.

### Root Cause

When multiple joints constrain the same degree of freedom, the system is over-constrained. For example, a door with both a revolute joint and a fixed joint at the same location has redundant constraints. The motion solver can't determine which constraint to enforce.

### Fix

1. **Identify redundant constraints**:
   - List all joints in the mechanism
   - For each joint, identify which DOFs are constrained
   - Look for DOFs constrained by multiple joints
   - Remove redundant joints

2. **Use the correct joint types**:
   - Revolute joint: constrains 5 DOFs, allows rotation about 1 axis
   - Prismatic joint: constrains 5 DOFs, allows translation along 1 axis
   - Cylindrical joint: constrains 4 DOFs, allows rotation and translation
   - Spherical joint: constrains 3 DOFs, allows rotation about all 3 axes
   - Fixed joint: constrains all 6 DOFs

3. **Check for ground constraints**:
   - A part grounded by a fixed joint doesn't need additional joints
   - Remove joints that connect grounded parts to other grounded parts

4. **Use bushings instead of rigid joints**:
   - Bushings have compliance (flexibility) that prevents over-constraint
   - Use bushings where slight flexibility is acceptable
   - This is especially useful for mechanisms with multiple mounting points

5. **Run a DOF check**:
   - Calculate the Gruebler number: DOF = 6(n-1) - sum(constraints)
   - If DOF < 0, the mechanism is over-constrained
   - Remove joints until DOF >= 0

6. **Use the Inspire motion analysis diagnostics**:
   - Check the motion analysis output for warning messages
   - Look for "redundant constraint" or "over-constrained" warnings
   - Address each warning before proceeding

## 5. Topology Optimization Contact Errors from Loads on Design Space

### Symptom

Running topology optimization produces errors related to contacts or boundary conditions. The optimization result doesn't make sense — material is removed from areas that should be solid, or the result is disconnected.

### Root Cause

Loads and constraints must be applied to non-design geometry, not to the design space. If loads are applied to the design space (the volume being optimized), the optimizer removes material from load-bearing areas, creating disconnected or nonsensical results.

### Fix

1. **Apply loads and constraints to non-design parts only**:
   - Create non-design parts at load application points (bosses, mounts, bearing surfaces)
   - Apply forces, pressures, and displacements to these non-design parts

2. **Define design and non-design spaces clearly**:
   - Use the "Design Space" tool to mark the volume to be optimized
   - Use the "Non-Design Space" tool to preserve critical features
   - Non-design spaces include: mounting holes, bearing surfaces, contact areas, threaded regions

3. **Check contact definitions**:
   - Verify that contacts between design and non-design parts are properly defined
   - Use "Bonded" contact for rigid connections
   - Use "Sliding" or "Separating" contact for interfaces that may separate

4. **Suppress unnecessary parts**:
   - Suppress parts that are not relevant to the optimization
   - This reduces computation time and avoids interference

5. **Verify the optimization setup**:
   - Objective: maximize stiffness, minimize mass, or target mass fraction
   - Constraints: mass fraction, displacement limits, stress limits
   - Manufacturing constraints: draw direction, symmetry, extrusion

6. **Run a reanalysis after optimization**:
   - Use the "Analyze" button in the Shape Explorer
   - Verify that the optimized shape can carry the required loads

### Community Report

> "Important: Loads and constraints must all be applied to nondesign geometry. Suppressing a part prevents it from being included in analysis."

## 6. Additional Altair Inspire Issues

### PolyNURBS Export to CAD Systems

**Issue**: PolyNURBS geometry doesn't export correctly to certain CAD systems.
**Fix**: "Exit the PolyNURBS tool to generate the PolyNURBS geometry, which can take up to a minute. This geometry can be exported to most CAD systems." Wait for geometry generation to complete before exporting.

### Topology Slider Position Affects Results

**Issue**: Different topology slider positions produce very different PolyNURBS fits.
**Fix**: "Your analysis results and CAD conversion will vary depending on where you position the slider." Test multiple slider positions and compare results. Choose the position where all significant members are connected.

### Auto Creasing Creates Sharp Features

**Issue**: Auto Creasing creates overly sharp edges on PolyNURBS geometry.
**Fix**: Disable Auto Creasing for smoother geometry. Manually apply creasing to specific edges that need to be sharp.

### Intersect Creates Sharp Features

**Issue**: The Intersect option creates sharp features at the Boolean intersection.
**Fix**: "Intersect can result in sharp features. When Intersect is not selected, the original PolyNURBS geometry is preserved, overlapping the nondesign regions. Some subsequent editing will be required."

## Best Practices

1. **Position topology slider 2 ticks from far right** — ensures connected members
2. **Enable Smooth Results before PolyNURBS fit** — cleaner surface for fitting
3. **Use 1200 faces and 40% curvature for smoother geometry** — fewer sharp features
4. **Apply loads to non-design geometry only** — prevents nonsensical optimization
5. **Use Contacts tool to find PolyNURBS gaps** — fix before reanalysis
6. **Choose simple lattice unit cells for printability** — gyroid, strut, grid
7. **Check for redundant joints in motion analysis** — calculate Gruebler DOF
8. **Use bushings instead of rigid joints for multi-mount mechanisms** — prevents over-constraint
9. **Wait for PolyNURBS geometry generation before export** — can take up to a minute
10. **Run reanalysis after optimization** — verifies feasible topology concept
