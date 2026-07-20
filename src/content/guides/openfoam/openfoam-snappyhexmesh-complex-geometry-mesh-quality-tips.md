---
title: "OpenFOAM Mesh Generation: snappyHexMesh for Complex Geometry and Mesh Quality Tips"
excerpt: "Generate complex meshes in OpenFOAM using snappyHexMesh: prepare STL geometry, configure refinement levels, add boundary layers, resolve features, and diagnose mesh quality issues."
category: "workflow"
softwareSlug: "openfoam"
keyword: "openfoam snappyhexmesh complex geometry mesh quality"
slug: "openfoam-snappyhexmesh-complex-geometry-mesh-quality-tips"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-13"
sources:
  - "https://www.openfoam.com/documentation/tutorial-guide"
  - "https://doc.cfd.direct/openfoam/user-guide-v13/tutorials"
---

# OpenFOAM Mesh Generation: snappyHexMesh for Complex Geometry and Mesh Quality Tips

While `blockMesh` is great for simple geometries, real-world CFD cases involve complex shapes that need `snappyHexMesh`. This is OpenFOAM's workhorse meshing tool — it takes a background hex mesh and refines it around STL geometry surfaces, adding boundary layers and resolving features. It's powerful but has a learning curve. Here's how to use it effectively.

## snappyHexMesh Overview

snappyHexMesh works in three stages:

1. **Castellated mesh** — refines the background mesh near the geometry surface and removes cells outside/inside the flow domain
2. **Snapping** — moves internal mesh points onto the surface geometry
3. **Layer addition** — adds prism layers near walls for boundary layer resolution

Each stage can be enabled or disabled independently, and each has its own quality controls.

## Step 1: Prepare the Geometry

### STL File Preparation

snappyHexMesh requires geometry in STL format:

1. **Export STL from CAD** — most CAD tools can export STL
2. **Ensure the STL is watertight** — no holes or gaps in the surface
3. **Orient normals correctly** — outward-facing normals for external flow
4. **Scale to correct units** — OpenFOAM uses meters by default
5. **Name the STL regions** — each surface patch should have a unique name:
   ```
   solid inlet
   facet normal 1 0 0
   ...
   endsolid inlet
   solid wall
   facet normal 0 1 0
   ...
   endsolid wall
   ```

### Place the STL File

```
myCase/constant/triSurface/geometry.stl
```

## Step 2: Create the Background Mesh

Use `blockMesh` to create a background mesh that encompasses the entire geometry:

Create `system/blockMeshDict`:

```
convertToMeters 1;

vertices
(
    (-5 -5 -5)    // 0
    ( 5 -5 -5)    // 1
    ( 5  5 -5)    // 2
    (-5  5 -5)    // 3
    (-5 -5  5)    // 4
    ( 5 -5  5)    // 5
    ( 5  5  5)    // 6
    (-5  5  5)    // 7
);

blocks
(
    hex (0 1 2 3 4 5 6 7) (40 40 40) simpleGrading (1 1 1)
);

boundary
(
    // All boundaries will be replaced by snappyHexMesh
    defaultFaces
    {
        type patch;
        faces
        (
            (0 1 2 3)
            (4 5 6 7)
            (0 1 5 4)
            (2 3 7 6)
            (1 2 6 5)
            (0 3 7 4)
        );
    }
);
```

Run `blockMesh` to generate the background mesh.

## Step 3: Configure snappyHexMeshDict

Create `system/snappyHexMeshDict`:

### Geometry Section

```
geometry
{
    geometry.stl
    {
        type triSurfaceMesh;
        name geometry;
        regions
        {
            inlet  { name inlet;  }
            outlet { name outlet; }
            wall   { name wall;   }
        }
    }
};
```

### Castellated Mesh Section

```
castellatedMeshControls
{
    maxLocalCells 1000000;    // Max cells per processor
    maxGlobalCells 2000000;   // Max total cells
    minRefinementCells 0;
    maxLoadUnbalance 0.10;
    nCellsBetweenLevels 3;    // Buffer between refinement levels

    features
    (
        { file "geometry.eMesh"; level 2; }
    );

    refinementSurfaces
    {
        geometry
        {
            level (2 3);      // (min max) refinement levels
            regions
            {
                inlet  { level (3 3); patchInfo { type patch; } }
                outlet { level (3 3); patchInfo { type patch; } }
                wall   { level (3 4); patchInfo { type wall; } }
            }
        }
    }

    resolveFeatureCells 2;    // Resolve sharp features

    locationInMesh (0 0 0);   // Point inside the flow domain
    allowFreeStandingMeshFaces true;
};
```

Key parameters:
- **level (min max)** — min level for surface proximity, max level for direct surface cells
- **nCellsBetweenLevels** — transition cells between refinement levels (prevents sudden jumps)
- **locationInMesh** — a point inside the flow domain (cells outside are removed)

### Snapping Section

```
snapControls
{
    nSmoothPatch 3;           // Smoothing iterations on patch
    tolerance 2.0;            // Point movement tolerance
    nSolveIter 300;           // Mesh smoothing iterations
    nRelaxIter 5;             // Relaxation iterations
    nFeatureSnapIter 10;      // Feature snapping iterations
    implicitFeatureSnap false;
    multiRegionFeatureSnap true;
};
```

### Layer Addition Section

```
addLayersControls
{
    relativeSizes true;       // Layer thickness relative to near-wall cell
    finalLayerThickness 0.5;  // Last layer thickness (relative)
    minThickness 0.1;         // Minimum layer thickness
    layers
    {
        wall
        {
            nSurfaceLayers 5; // Number of prism layers
        }
    }
    nSmoothSurfaceNormals 1;
    nSmoothThickness 10;
    maxFaceThicknessRatio 0.5;
    maxThicknessToMedialRatio 0.3;
    minMedianAxisAngle 90;
    nBufferCellsNoExtrude 0;
    nLayerIter 50;
    nRelaxedIter 20;
};
```

### Mesh Quality Section

```
meshQualityControls
{
    maxNonOrtho 65;           // Max non-orthogonality (degrees)
    maxBoundarySkewness 20;
    maxInternalSkewness 4;
    maxConcave 80;
    minFlatness 0.5;
    minDeterminant 0.001;
    minFaceWeight 0.02;
    minFaceAreaRatio 0.01;
    minVolRatio 0.01;
    minTriangleTwist 0.01;
    nSmoothScale 4;
    errorReduction 0.75;
};
```

## Step 4: Extract Features

Before running snappyHexMesh, extract geometric features:

```bash
surfaceFeatureExtract
```

This creates the `.eMesh` feature file referenced in the dictionary. Features are sharp edges and curves that the mesher should resolve.

## Step 5: Run snappyHexMesh

```bash
snappyHexMesh -overwrite
```

The `-overwrite` flag overwrites the background mesh with the final mesh. Without it, intermediate meshes are kept in time directories.

## Step 6: Check Mesh Quality

```bash
checkMesh
```

Key metrics to review:
- **Non-orthogonality** — should be < 70° (max), < 20° (average)
- **Skewness** — should be < 4
- **Aspect ratio** — should be < 1000
- **Cell determinant** — should be > 0.001
- **Total cells** — should be within your computational budget

## Common Issues

### Mesh Not Refining Near Surface

- Check that the STL file is correctly referenced in the geometry section
- Verify `locationInMesh` is inside the flow domain
- Check refinement levels are high enough

### Poor Boundary Layers

- The wall surface must be named correctly in the STL
- Check that `nSurfaceLayers` is set for the wall region
- Reduce `finalLayerThickness` if layers are too thick
- Increase `nSmoothThickness` for better layer quality

### High Non-Orthogonality

- Reduce `maxNonOrtho` in meshQualityControls (forces the mesher to improve)
- Increase `nSmoothPatch` in snapControls
- Use more refinement levels near complex geometry

### Mesh Too Large

- Reduce refinement levels
- Increase `nCellsBetweenLevels` (reduces transition cells)
- Use `refinementRegions` with distance-based refinement instead of surface refinement

## Best Practices

- **Start with coarse mesh** — verify the mesh generates correctly, then refine
- **Use feature extraction** — resolves sharp edges that surface refinement alone misses
- **Check mesh quality after each stage** — run `checkMesh` after castellated, snap, and layer stages
- **Use parallel meshing** — `snappyHexMesh -parallel` for large cases
- **Name STL regions clearly** — each boundary patch needs a unique name
- **Validate the mesh visually** — use ParaView to inspect the mesh before running the solver
- **Iterate** — mesh generation is iterative; adjust parameters and re-run until quality is acceptable
