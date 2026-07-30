---
title: "MSC Patran Imported Geometry Cleanup: Free Edge Detection, Composite Surfaces, Congruency Repair, and Solid Mesh Failure Recovery"
excerpt: "CAD geometry imported into MSC Patran frequently has topological gaps, non-congruent surfaces, and collapsed elements that cause solid mesh failure. We cover the geometry cleaning workflow: tolerance adjustment, free edge detection, composite surface creation, and manual repair of collapsed elements."
category: "geometry-preparation"
softwareSlug: "msc-patran"
keyword: "MSC Patran imported geometry cleanup free edges composite surfaces congruency solid mesh failure"
slug: "msc-patran-imported-geometry-cleanup-congruency-mesh-repair"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://www.scc.kit.edu/scc/sw/msc/Pat302/Exercise_06_import_geo_cleaning.pdf"
  - "https://www.scc.kit.edu/scc/sw/msc/N4w101/WS2_Repair.pdf"
  - "https://pdfcoffee.com/msc-patran-reference-manual-femmodeling-pdf-free.html"
---

# MSC Patran Imported Geometry Cleanup: Free Edge Detection, Composite Surfaces, Congruency Repair, and Solid Mesh Failure Recovery

CAD geometry imported into MSC Patran rarely arrives clean. The STEP/EXPRESS translation process introduces topological gaps, non-manifold edges, and tolerance mismatches that prevent successful meshing. Without geometry cleanup, the solid mesher will abort, leaving incomplete surface meshes that must be manually repaired. This guide covers the complete geometry preparation workflow.

## Why CAD Geometry Fails in Patran

CAD systems create geometry that "looks" correct but may not represent a true continuum. Surfaces may have:
- **Gaps between edges** that exceed the model tolerance
- **Non-manifold edges** (edges shared by more than two surfaces)
- **Sliver surfaces** too small for practical meshing
- **Missing faces** in B-Rep solids

These issues don't matter for design visualization but prevent Patran from creating congruent meshes needed for FEA.

## Step 1: Import and Tolerance Adjustment

### The Import Warning

When importing a CAD file (`.bxp`, `.step`, `.iges`), Patran may display:

> "Unresolved topological and/or geometrical gaps in the B-Rep solid"

This indicates the geometry has gaps that exceed the current model tolerance. Patran suggests an alternative tolerance value.

### Tolerance Strategy

1. **Apply the first suggested tolerance** — this is usually within a reasonable range
2. If subsequent warning messages indicate a convergence problem (infinite loop), **press Cancel** at the second warning
3. The command window will show: "A gap between two of the faces in the Body" — this may be due to edges not matching or a missing face

### Resetting Tolerances After Cleanup

After initial cleanup, **reset tolerances to the default (small) value**. This ensures that:
- All remaining gaps are visible individually
- Patran doesn't automatically close gaps that might be intentional
- Each gap closure is a deliberate, intentional action

## Step 2: Identify Non-Congruent Surfaces

### Free Edge Detection

1. Change render style to show wireframe
2. Run the geometry checker — a warning appears: "Free Edges and/or Non-manifold Edges exist"
3. Display edge markers with color coding:

| Color | Meaning |
|-------|---------|
| **Dark Blue** | Free edges within the current selection (boundary edges) |
| **Light Blue** | Edges shared by exactly two surfaces (normal internal edges) |
| **Red** | Non-manifold edges (shared by more than two surfaces) |
| **White** | Interior gaps that exceed tolerance |

4. Interior markers (red, white) indicate non-congruency problems that will affect meshing

### Shrink View for Element Inspection

When examining mesh problems:
1. Use **View Style → Shrink** — all elements shrink toward their centroids
2. This makes collapsed elements (where a node references the same point twice) visible
3. Turn off geometry display to see only the finite element model
4. Collapsed elements appear as lines or points rather than proper shapes

## Step 3: Create Composite Surfaces

When surfaces are disjointed (gaps between them), create **composite surfaces** to bridge the gaps:

### Procedure

1. **Break large surfaces** into quarters for manageable processing
   - Start with one break point and continue using generated points for subsequent breaks
   - This ensures surfaces remain connected at generated points

2. **Create composite surfaces** for each quarter:
   - Select the surfaces to combine
   - Patran will attempt to merge them, removing internal edges
   - If gaps exceed tolerance, Patran will flag them

3. **Handle gap errors**:
   - If "gap is too big" error appears, adjust the tolerance upward
   - Remove internal edges that form gaps exceeding tolerance
   - The outer loop of the composite surface must be closed

4. **Verify**: After composite creation, check for congruency — red lines should surround each composite surface with no interior markers

## Step 4: Repair Collapsed Elements and Free Edges

When the solid mesher aborts ("Mesher Aborted..."), the surface mesh has defects that prevent solid mesh generation.

### Find Free Edges

1. Under **Model Style**, select **Free Edges** display
2. A small line appears showing all free edges that prevent enclosed volume formation
3. **Box Zoom** around the free edge to examine closely

### Identify the Collapsed Element

1. Switch to **wireframe** view
2. Enable **Shrink** view style
3. Turn off geometry, show only finite elements
4. Look for elements that reference the same node twice — these are "collapsed" elements created by the surface mesher on bad CAD data

### Delete and Clean Up

1. **Delete the collapsed element**: Use Delete/Model/Element, pick the erroneous element
2. **Delete orphaned nodes**: Attempt to delete all extra nodes — Patran will skip nodes still used by elements ("NonDeletatable Nodes Skipped"). This removes nodes that aren't coincident with any other node and were missed by the coincident node check
3. **Refresh display** with CTRL-G or View/Regenerate

### Remesh the Solid

1. Return to the original model viewport
2. The mesher defaults to **TET10** (10-node tetrahedral) elements — midside nodes "pop" to the geometry for better surface definition
3. Set **TET Growth Rate** to 2.25 — elements at the center of the enclosed volume are 2.25× larger than surface elements, reducing model size while keeping fine mesh on surfaces
4. Generate the solid mesh

## Step 5: Mesh Seeding and Transitions

### Mesh Seeds

Mesh seeds control element count along edges. When opposing edges of a surface have different seed counts, a **mesh transition** occurs.

### Transition Rules

- **IsoMesh** (default for solids): Uses smoothing parameters for transition meshes — usually no manual adjustment needed
- **Paver** (for surfaces): Requires an **even number** of elements around the perimeter for all-quad meshes. If odd, Paver asks if triangles are acceptable. For quad-only meshes, readjust seeds to an even number before remeshing

### Solid Transition Limitation

Transitions for solids can only occur in **two of three directions**. If a transition is needed in all three directions:
1. Break one solid into two sub-solids
2. Perform the transition in each sub-solid separately
3. If seeds create a 3-direction transition, Patran will issue an error and refuse to mesh

### Mesh Path Constraints

If more than one mesh seed is defined within a single mesh path (topologically parallel edges for a set of solids):
- All seeds must belong to the **same solid face**
- Otherwise, Patran will issue an error and not mesh the specified solids
- Additional mesh seeds will be required in the mesh path to further define the transition

## Avoiding Triangular Elements

| Condition | Result |
|-----------|--------|
| Even number of elements around perimeter | All quad (or hex) elements |
| Odd number of elements around perimeter | One triangle (or wedge) element per surface |
| Triangular/wedge-shaped surface with triangular pattern | Triangle/wedge elements regardless of count |

For quad-only meshes, always ensure the perimeter seed count is **even**.

## Best Practices Summary

1. **Always check geometry after import** — run the congruency checker before attempting to mesh
2. **Apply suggested tolerances** but reset to default after initial cleanup to catch all gaps
3. **Use composite surfaces** to bridge disjointed surface sets
4. **Break large surfaces into quarters** before creating composites — manageable processing
5. **Use Shrink view** to find collapsed elements that the mesher created on bad data
6. **Delete collapsed elements and orphaned nodes** before attempting solid mesh
7. **Set TET Growth Rate to 2.25** for efficient solid meshes — fine on surfaces, coarse in the interior
8. **Ensure even perimeter seed counts** for all-quad surface meshes
9. **Don't attempt 3-direction solid transitions** — break the solid into sub-solids first
10. **Verify congruency after each repair step** — don't wait until the end to check
