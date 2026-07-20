---
title: "Altair Inspire: Fitting PolyNURBS to Topology Optimization Results for CAD Export"
excerpt: "Step-by-step guide to converting topology optimization results into editable CAD geometry using Inspire's PolyNURBS fitting workflow — based on Altair's official tutorial documentation."
category: "workflow"
softwareSlug: "altair-inspire"
keyword: "altair inspire polynurbs fit topology optimization cad export"
slug: "altair-inspire-polynurbs-fit-topology-optimization-cad-export"
author: "CADGuide Tools Editorial Team"
readTime: "9 min read"
date: "2026-07-12"
sources:
  - "https://help.altair.com/inspire/en_us/topics/inspire/structure/fit_polynurbs_c.htm"
  - "https://help.altair.com/inspire/en_us/topics/inspire/tutorials/tut_analyzingshape_c.htm"
---

# Altair Inspire: Fitting PolyNURBS to Topology Optimization Results for CAD Export

Topology optimization produces an organic, voxel-based shape that isn't directly usable as CAD geometry. Altair Inspire's PolyNURBS fitting tool converts this shape into editable NURBS surfaces that can be exported to any CAD system. This guide documents the workflow based on Altair's official tutorial "Generating CAD from Optimization Results."

## Prerequisites

- A completed topology optimization result loaded in Inspire
- The Shape Explorer visible (click Show Optimization Results on the Optimize tool group)

## Step 1: Smooth the Optimization Results

Before fitting PolyNURBS, smooth the raw optimization result:

1. In the **Shape Explorer**, click **Smooth Results**
2. The smoothing dialog appears with adjustable parameters
3. Set **Smoothing iterations**: 80 (higher = smoother, removes voxel artifacts)
4. Click **Apply**

Smoothing is critical — the raw optimization result has a voxelized, stepped appearance. Attempting to fit PolyNURBS directly to unsmoothed results produces irregular geometry.

## Step 2: Fit PolyNURBS

### Automated Approach
1. In the Shape Explorer, click **Fit PolyNURBS**
2. The Fit PolyNURBS dialog appears with these parameters:

| Parameter | Default | Recommendation |
|---|---|---|
| Number of PolyNURBS Faces | 2500 | Start with 1200 for smoother geometry, increase for more detail |
| Curvature | 50% | 40% for smoother results, higher for more feature capture |
| Shrinkwrap Size | Auto | Use default; manually adjust if fit doesn't capture shape |
| Auto Creasing | Enabled | Keep enabled to sharpen edges automatically |
| Intersect | Enabled | Keep enabled to constrain geometry to original design space |

3. Click **Fit**
4. If successful, the result appears in the Model Browser as "PolyNURBS Fit"
5. You're automatically placed in PolyNURBS editing mode
6. **Exit the PolyNURBS tool** to generate the final geometry (this can take up to a minute)

### Understanding the Intersect Option

- **Intersect enabled**: Creates a Boolean intersection between the PolyNURBS geometry and the original design space. This ensures the new part doesn't extend beyond the original volume and aligns with non-design regions. However, it can create sharp features where the Boolean cut occurs.

- **Intersect disabled**: The PolyNURBS geometry is preserved as-is, which may overlap non-design regions. This produces smoother geometry but requires manual cleanup of overlapping areas.

## Step 3: Refine the Fit (If Needed)

If the initial fit has irregular geometry or too much detail:

1. Return to the Shape Explorer
2. Adjust parameters:
   - **Smoothing iterations**: 80
   - **Number of PolyNURBS Faces**: 1200 (reduced from default)
   - **Curvature**: 40% (reduced from default)
   - **Shrinkwrap size**: Manually set (e.g., 2.42 for the tutorial example)
   - **Intersect**: Disabled (to avoid sharp Boolean features)
3. Click **Fit PolyNURBS** again

Reducing the number of faces and curvature percentage essentially smooths over smaller details, producing cleaner geometry that's easier to manufacture.

## Step 4: Handle Non-Design Geometry Overlap

When Intersect is disabled, the PolyNURBS geometry may overlap with non-design regions. To clean this up:

### Method A: Boolean Subtract
1. On the **Geometry ribbon**, select **Boolean → Subtract**
2. Select the PolyNURBS geometry as the target
3. Select the non-design geometry as the tool
4. The Boolean operation removes the overlapping portion

### Method B: Convert and Separate
1. Right-click the PolyNURBS part
2. Select **Isolate**
3. Select **Convert Bodies to Parts**
4. The PolyNURBS is converted into multiple separate parts
5. Delete the parts that overlap with non-design geometry
6. The remaining PolyNURBS geometry should contact the non-design geometry cleanly

## Step 5: Validate with Analysis

After fitting PolyNURBS, run a validation analysis:

1. On the **Structure ribbon**, click **Run Analysis**
2. Settings:
   - Rename the run (e.g., "concept1")
   - Select **OptiStruct** as the solver
   - Set **Element Size**: 3.0 mm (or appropriate for your part size)
   - Set **Speed**: Faster (for initial validation)
3. Click **Run**
4. Compare stress and displacement results with the original optimization targets

## Step 6: Detail the Connection

The final step is detailing the connection between the PolyNURBS concept geometry and the non-design geometry:

1. Combine the PolyNURBS geometry with the non-design geometry
2. Add fillets, chamfers, and mounting features as needed
3. Run a final analysis to validate the detailed design

## Step 7: Export to CAD

Once the PolyNURBS geometry is finalized:

1. **File → Export**
2. Select format:
   - **STEP**: Universal CAD format, preserves surface geometry
   - ** Parasolid**: For NX or SolidWorks import
   - **STL**: For 3D printing (not recommended for CAD editing)
3. The exported file can be opened in SolidWorks, NX, Creo, CATIA, or any other CAD system

According to Altair's documentation: "This geometry can be exported to most CAD systems."

## Alternative: PolyMesh Shrinkwrap Workflow

If the direct PolyNURBS fit doesn't produce satisfactory results, use the PolyMesh workflow:

1. On the **PolyMesh ribbon**, select the **Shrinkwrap** tool
2. Select both design and non-design parts to wrap them in a single isosurface
3. On the **PolyMesh ribbon**, select the **Smooth** tool
4. Smooth the shrinkwrapped mesh
5. On the **PolyNURBS ribbon**, select the **Fit** tool
6. Fit PolyNURBS to the smoothed shrinkwrap

This two-stage approach (shrinkwrap → smooth → fit) can produce better results for complex optimization shapes where direct PolyNURBS fitting struggles.

## Common Issues

### Issue: PolyNURBS Fit Takes Very Long
- Reduce the number of PolyNURBS faces
- Increase smoothing iterations (smoother input = faster fitting)
- Ensure your computer has sufficient RAM (16+ GB recommended)

### Issue: Fit Result Doesn't Match Optimization Shape
- Increase curvature percentage
- Increase number of PolyNURBS faces
- Check that smoothing iterations aren't too high (over-smoothing can remove important features)

### Issue: Sharp Features from Intersect
- Disable Intersect and use the Boolean Subtract method instead (Step 4, Method A)
- Or reduce curvature and face count for a smoother base geometry before intersecting
