---
title: "OpenFOAM snappyHexMesh Parallel Errors: Face Area Mismatch from Cyclic Patches, Different Meshes from Different Decompose Methods, 2D Mesh-Motion Failure from Empty Patches, snappyHexMesh Cannot Handle 2D Empty Patches Requiring extrudeMesh, and Cell Count Differences Between Hierarchical and Scotch Decomposition"
excerpt: "OpenFOAM snappyHexMesh fails for 5 distinct reasons: parallel face area mismatch from cyclic patches requiring patch type change before sHM, different decompose methods (hierarchical vs scotch) produce different meshes and results, 2D mesh-motion fails in parallel from empty patches causing normal vector error, snappyHexMesh cannot handle 2D empty patches requiring symmetryPlane then extrudeMesh workflow, and cell count differences between decomposition methods affect simulation results. We cover each with fixes from CFD Online forums."
category: "troubleshooting"
softwareSlug: "openfoam"
keyword: "OpenFOAM snappyHexMesh parallel face area mismatch cyclic patches different decompose methods hierarchical scotch 2D mesh-motion empty patches normal vector extrudeMesh changeDictionary cell count"
slug: "openfoam-snappyhexmesh-parallel-errors-face-area-mismatch-cyclic-patches-decompose-methods-2d-mesh-motion-empty-patches-extrudemesh"
author: "CADGuide Tools Editorial Team"
readTime: "14 min"
date: "2025-07-31"
sources:
  - "https://www.cfd-online.com/Forums/openfoam-meshing/100269-snappyhexmesh-parallel-problem.html"
  - "https://www.cfd-online.com/Forums/openfoam-meshing/239985-shm-parallel-different-decompose-methods-different-meshes-results.html"
  - "https://www.cfd-online.com/Forums/openfoam-meshing/178909-snappyhexmesh-parallel-run-face-ordering-problem.html"
---

# OpenFOAM snappyHexMesh Parallel Errors: Face Area Mismatch from Cyclic Patches, Different Meshes from Different Decompose Methods, 2D Mesh-Motion Failure from Empty Patches, snappyHexMesh Cannot Handle 2D Empty Patches Requiring extrudeMesh, and Cell Count Differences Between Hierarchical and Scotch Decomposition

OpenFOAM's snappyHexMesh is powerful for complex geometry meshing but parallel execution produces face matching errors, mesh inconsistencies, and 2D mesh failures. This guide covers the 5 most common snappyHexMesh parallel problems with diagnostic steps and community-verified fixes from CFD Online Discussion Forums.

## 1. Face Area Mismatch from Cyclic Patches

### Error Message

```
FOAM FATAL ERROR:
face 597 area does not match neighbour by 0.103929% -- possible face ordering problem.
patch procBoundary1to0 my area:1.33687e-05 neighbour area:1.33549e-05 matching tolerance:6.7218e-10
```

### Symptom

snappyHexMesh runs fine in serial but fails in parallel with face area mismatch errors on processor boundaries. The error occurs with both scotch/ptscotch and hierarchical decomposition methods.

### Root Cause

Cyclic patches in the mesh cause face ordering problems during parallel decomposition. snappyHexMesh's octree refinement doesn't maintain consistent face matching across cyclic boundaries when the mesh is decomposed into multiple processor domains.

### Fix

1. **Change cyclic patches to plain patches before snappyHexMesh**:
   - Before running sHM, change cyclic patch types to "patch" in the boundary file
   - Run snappyHexMesh in parallel
   - After sHM, change the patches back to cyclic using `changeDictionary` or `createPatch`

2. **Remove cyclic cell zones from sHM dictionary**:
   - Take cyclic cell zones out of the snappyHexMeshDict
   - sHM treats the boundary as a plain patch
   - This avoids the face matching issue

3. **Run sHM in serial, then decompose for the solver**:
   - If parallel sHM continues to fail, run sHM in serial
   - Then use `decomposePar` to split the mesh for parallel solver execution
   - This is the most reliable approach: "If snappyHexMesh runs in serial, what is the need to run it in parallel? Use decomposePar and proceed with solver."

4. **Increase matchTolerance** — if you're certain the mesh is correct:
   - Increase the `matchTolerance` setting in the patch dictionary in the boundary file
   - This allows larger face area mismatches
   - Use cautiously — large tolerances can mask real mesh problems

5. **Delete cell decomposition fields before decomposePar**:
   - Delete `ccx ccy ccz cellLevel pointLevel` from the 0 folder
   - Add `structured yes;` to the decomposeParDict
   - This helps with decomposition issues after sHM

### Community Report

> "Typically the face matching error, as far as I have seen, usually are with the cyclic patch, which can be circumvented by changing the patch type to patch before running snappyHexMesh. You can later change it back to cyclic using changeDictionary or createPatch."

## 2. Different Meshes from Different Decompose Methods

### Symptom

Running snappyHexMesh in parallel with different decomposition methods (hierarchical vs scotch) produces different meshes with different cell counts. This leads to significantly different simulation results — up to 25.8% deviation in forces.

### Root Cause

snappyHexMesh uses an octree structure for mesh refinement. Different decomposition methods split the domain differently, causing sHM to make different refinement decisions on each processor. The result is mesh-dependent solutions that vary with the decomposition method.

### Fix

1. **Run sHM in serial, decompose only for the solver**:
   - Run blockMesh → snappyHexMesh in serial
   - Then decomposePar for parallel solver execution
   - This produces a consistent mesh regardless of decomposition method
   - The solver results will be mesh-independent

2. **Compare meshes thoroughly** — if you must run sHM in parallel:
   - `checkMesh` reporting "ok" doesn't mean meshes are identical
   - Use ParaView to create histograms of mesh quality parameters (nonOrtho, skewness)
   - Compare cell counts — even a 42-cell difference can affect results

3. **Document the decomposition method used**:
   - Different decompose methods lead to different meshes
   - Always document which method was used for reproducibility
   - Don't change decomposition methods between runs of the same case

4. **Use the same decomposition for sHM and solver**:
   - If sHM runs in parallel with scotch, use scotch for the solver too
   - Don't mix methods between meshing and solving

5. **Accept mesh variation as a source of uncertainty**:
   - The variation from decomposition methods is a known limitation
   - Include it in uncertainty quantification
   - Consider mesh sensitivity studies with different methods

### Cell Count Comparison

| Method | Cells | Deviation from Reference |
|--------|-------|------------------------|
| Serial (reference) | ~356K | 0% |
| Hierarchical (2 CPU, order 1 2 1) | ~356K | ~7% force deviation |
| Hierarchical (2 CPU, order 1 1 2) | ~356K | ~13.8% |
| Hierarchical (4 CPU, order 1 2 2) | ~356K | ~25.8% |
| Scotch (4 CPU) | ~356K | ~16.3% |

When sHM runs in serial and only the solver runs in parallel, deviations drop to <0.001%.

### Community Report

> "Different decompose methods lead to different meshes and thus significantly different results. Only sHM in parallel leads to different meshes. When sHM runs without parallel run, interFoam in parallel produces approximately the same results."

> "157956 cells running on hierarchical. 157998 cells running on scotch. The difference of 42 cells already leads to noticeable deviations on all other mesh parameters."

## 3. 2D Mesh-Motion Failure from Empty Patches

### Error Message

```
FOAM Warning: From function motionSmootherAlgo::modifyMotionPoints
2D mesh-motion probably not correct in parallel

FOAM FATAL ERROR:
Cannot determine normal vector from patches.
From function twoDPointCorrector::calcAddressing()
```

### Symptom

Running snappyHexMesh in parallel for a 2D case with mesh-motion. The error "2D mesh-motion probably not correct in parallel" appears, followed by "Cannot determine normal vector from patches." The case uses empty patches for front and back.

### Root Cause

The 2D point corrector in OpenFOAM can't determine the normal vector from empty patches during parallel execution. The empty patch type has no faces, so the normal vector calculation fails. This is a fundamental issue with 2D mesh-motion in parallel.

### Fix

1. **Don't use "empty" type patches for 2D parallel sHM**:
   - The empty patch type causes the normal vector calculation to fail
   - Use "symmetryPlane" or "slip" boundary conditions instead

2. **Use slip boundary conditions for front and back**:
   - Assign slip BC to the front and back patches
   - This allows sHM to run in parallel without the normal vector error
   - The slip BC behaves similarly to empty for 2D cases

3. **Change patch types after meshing**:
   - Use symmetryPlane for front and back during sHM
   - After sHM, use `changeDictionary` to change to empty:
     ```
     changeDictionary -dict changeDictionaryDict
     ```
   - For v2112, use the correct syntax for changeDictionary

4. **Use extrudeMesh for clean 2D mesh**:
   - Don't use empty patches in blockMeshDict
   - Run sHM with symmetryPlane for front and back
   - After sHM, run `extrudeMesh` to create a one-cell-thickness mesh
   - Use `changeDictionary` to update front and back to empty

### Community Report

> "So far the solution seems to be that one should not have 'empty' type for the faces. The only other option is to assign slip boundary conditions to those faces."

## 4. snappyHexMesh Cannot Handle 2D Empty Patches

### Symptom

Trying to use snappyHexMesh to locally refine a 2D mesh with empty patches in blockMesh. snappyHexMesh hangs or never completes. Changing to symmetryPlane fixes sHM but breaks the overset mesh functionality.

### Root Cause

snappyHexMesh uses an octree structure to split the mesh during refinement. The octree structure is inherently 3D and cannot handle 2D meshes with empty patches. When empty patches are present, sHM tries to refine in 3D, creating multiple cells in the third direction.

### Fix

1. **Use symmetryPlane in blockMesh, not empty**:
   - Define front and back as symmetryPlane in blockMeshDict
   - Run snappyHexMesh — it will complete successfully
   - The mesh will have multiple cells in the Z direction

2. **Run extrudeMesh after sHM**:
   - After sHM, use `extrudeMesh` to extrude a one-layer mesh
   - This creates a clean 2D mesh with one cell in the 3rd direction
   - Extrude from one of the front or back patches

3. **Use changeDictionary to update patch types**:
   - After extrudeMesh, use `changeDictionary` to set front and back to empty:
     ```
     changeDictionary -dict changeDictionaryDict -overwrite
     ```
   - For OpenFOAM v2112, check the correct syntax

4. **Workflow for 2D sHM with overset**:
   - Step 1: Define front and back as symmetryPlane in blockMesh
   - Step 2: Run snappyHexMesh (completes successfully)
   - Step 3: Run extrudeMesh to create one-cell-thickness mesh
   - Step 4: Use changeDictionary to update front and back to empty
   - Step 5: Proceed with overset simulation

5. **Alternative: refine in blockMeshDict**:
   - If sHM is too problematic for 2D, refine manually in blockMeshDict
   - Use graded mesh grading toward refinement areas
   - This limits flexibility but avoids sHM issues

### Community Report

> "Snappy uses octree structure to split the mesh when refining and AFAIK it cannot deal with 2D meshes. This means the resulting mesh will have several cells in the 3rd direction. Use extrudeMesh to extrude a one layer thickness mesh."

> "Do not use empty patch in your blockMeshDict. Use symmetryPlane, run sHM, then extrudeMesh, then changeDictionary to update to empty."

## 5. Cell Count Differences Between Hierarchical and Scotch

### Symptom

Running the same snappyHexMeshDict with different decomposition methods produces different cell counts. Example: hierarchical produces 157,956 cells, scotch produces 157,998 cells — a difference of 42 cells. This affects mesh quality and simulation results.

### Root Cause

Each decomposition method splits the domain differently, causing snappyHexMesh to make slightly different refinement decisions on each processor. The octree refinement is sensitive to processor boundaries — cells near processor boundaries may be refined differently depending on how the domain is split.

### Fix

1. **Run sHM in serial for consistent meshes**:
   - Serial sHM produces a single, consistent mesh
   - Decompose only for the parallel solver run
   - This eliminates decomposition-dependent mesh variation

2. **Use hierarchical with consistent ordering**:
   - If parallel sHM is necessary, use hierarchical decomposition
   - Keep the decomposition order consistent between runs
   - Document the order used (e.g., order 1 2 1)

3. **Compare mesh quality parameters**:
   - Use ParaView to create histograms of nonOrtho, skewness, aspect ratio
   - Compare between decomposition methods
   - Even if checkMesh reports "ok," the meshes are not identical

4. **Perform mesh sensitivity study**:
   - Run the same case with different decomposition methods
   - Compare key results (forces, pressures, velocities)
   - If results vary significantly, use serial sHM

5. **Accept cell count variation as inherent to parallel sHM**:
   - The variation is a known behavior of snappyHexMesh
   - There is no setting or flag to avoid it completely
   - The only way to avoid it is serial meshing

### Community Report

> "Just the fact that different cell counts (+/- 300 cells) come out between the different decompose methods makes it clear that different decompose methods interpret slightly different meshes from the same snappyHexMeshDict."

> "This observation can be made for everyone, for example, on the motorBike tutorial. 157956 cells running on hierarchical. 157998 cells running on scotch."

## 6. Additional OpenFOAM Issues

### snappyHexMesh Never Ends with Empty Patches

**Issue**: sHM hangs indefinitely when empty patches are present.
**Fix**: Change empty patches to symmetryPlane before running sHM. Use extrudeMesh and changeDictionary afterward.

### Cyclic Patches with STL Geometry

**Issue**: After changing cyclic to patch for sHM, STL geometry inside the cyclic boundary doesn't generate.
**Fix**: Keep the STL geometry in a separate cell zone. Use createPatch after sHM to restore cyclic boundaries.

### Overset Mesh with symmetryPlane

**Issue**: Using symmetryPlane for front and back breaks overset mesh functionality — moving meshes become independent of background mesh.
**Fix**: Use the extrudeMesh workflow: symmetryPlane → sHM → extrudeMesh → changeDictionary to empty.

### renumberMesh Before snappyHexMesh

**Issue**: Running renumberMesh before sHM doesn't fix face matching errors.
**Fix**: renumberMesh doesn't address the cyclic patch issue. Use the patch type change method instead.

## Best Practices

1. **Run sHM in serial, decompose for solver only** — most reliable approach
2. **Change cyclic to patch before parallel sHM** — change back with createPatch after
3. **Don't use empty patches with sHM** — use symmetryPlane, then extrudeMesh
4. **Use extrudeMesh for 2D meshes** — sHM can't handle 2D directly
5. **Document decomposition method** — for reproducibility
6. **Compare meshes with ParaView histograms** — checkMesh "ok" doesn't mean identical
7. **Use slip BC as alternative to empty** — for 2D parallel mesh-motion
8. **Delete cellLevel/pointLevel before decomposePar** — helps with decomposition
9. **Add structured yes to decomposeParDict** — improves decomposition after sHM
10. **Perform mesh sensitivity studies** — if parallel sHM is required
