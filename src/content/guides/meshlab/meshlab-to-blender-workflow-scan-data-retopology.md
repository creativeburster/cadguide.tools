---
title: "MeshLab to Blender Workflow: Cleaning Scan Data for Retopology"
excerpt: "Documented workflow for processing 3D scan data in MeshLab and exporting to Blender for retopology — based on Meshroom, XROMM, and protocols.io documentation."
category: "workflow"
softwareSlug: "meshlab"
keyword: "meshlab to blender workflow scan data retopology export"
slug: "meshlab-to-blender-workflow-scan-data-retopology"
author: "CADGuide Tools Editorial Team"
readTime: "8 min read"
date: "2026-07-12"
sources:
  - "https://meshroom-manual.readthedocs.io/en/latest/more/view-edit/view-edit.html"
  - "https://gitbook.brown.edu/xromm/model-generation/xromm-cleaning-3d-models-with-meshlab"
  - "https://doi.org/10.17504/protocols.io.j8nlkk59dl5r/v2"
---

# MeshLab to Blender Workflow: Cleaning Scan Data for Retopology

3D scan data (from photogrammetry, structured light, or laser scanners) typically produces dense, noisy meshes with millions of faces, non-manifold errors, and artifacts. The standard workflow is: clean in MeshLab → export to Blender for retopology and final editing. This guide documents the process based on workflows from Meshroom's official manual, Brown University's XROMM spec, and a protocols.io peer-reviewed method.

## Step 1: Import Raw Scan Data into MeshLab

1. **File → Import Mesh**
2. Select the scan file (typically .OBJ, .PLY, or .STL from photogrammetry software like Meshroom or RealityCapture)
3. If MeshLab prompts about duplicate faces or vertices, select "Yes" to clean them on import

## Step 2: Orient and Align

According to the Meshroom manual:

1. Rotate the model to align it with the coordinate system
2. Go to **Filters → Normals, Curvatures and Orientation → Transform: Rotate to Fit a principle Axis**
3. This automatically aligns the mesh to the principal axes
4. Manually adjust if needed using **Transform: Rotate**

## Step 3: Clean the Mesh

Follow the cleaning workflow (detailed in our [MeshLab Non-Manifold Repair guide](/guides/meshlab-non-manifold-mesh-repair-cleaning-workflow)):

1. **Remove Duplicate Vertices**: Filters → Cleaning and Repairing → Remove Duplicate Vertices
2. **Remove Duplicate Faces**: Filters → Cleaning and Repairing → Remove Duplicate Faces
3. **Remove Unreferenced Vertices**: Filters → Cleaning and Repairing → Remove Unreferenced Vertices
4. **Repair Non-Manifold Edges**: Filters → Cleaning and Repairing → Repair non Manifold Edges by Removing Faces (repeat until no faces are removed)
5. **Repair Non-Manifold Vertices**: Filters → Cleaning and Repairing → Repair non Manifold Vertices by splitting (repeat until no changes)

## Step 4: Remove Isolated Components

Scan data often contains small floating fragments that should be removed:

1. **Filters → Selection → Select Smallest Connected Component**
2. This selects the smallest isolated piece
3. Delete it: **Filters → Selection → Delete Selected Faces and Vertices**
4. Repeat until only the main object remains

The XROMM documentation recommends: "Select each separated piece of the mesh and export them individually" if you want to keep multiple components. Otherwise, delete the unwanted pieces.

## Step 5: Decimate (Reduce Face Count)

Scan meshes often have 1-10 million faces — too many for Blender to handle smoothly. Decimate in MeshLab before export:

1. **Filters → Remeshing, Simplification and Construction → Simplification: Quadric Edge Collapse Decimation**
2. Set **Target number of faces**: 50,000–200,000 (depending on detail needed)
3. Check **Preserve Normal**
4. Check **Preserve Topology**
5. Check **Planar Simplification** (preserves flat surfaces)
6. Set **Quality threshold**: 0.3 (rejects low-quality collapses)
7. Click **Apply**

The protocols.io MeshLab workflow recommends this as the standard decimation method, noting that checking Planar Simplification "will preserve flat surfaces best."

## Step 6: Smooth

According to the protocols.io workflow:

1. **Filters → Smoothing, Fairing and Deformation → Taubin Smooth**
   - Apply 2 iterations for a gentle smoothing that preserves volume
   - Taubin smooth is preferred over Laplacian because it doesn't shrink the mesh

2. Alternatively, **Laplacian Smooth** can be used for a more aggressive smoothing effect, but it tends to shrink the mesh slightly

The protocols.io guide shows that "result of 2 times Taubin Smooth shown in Blender" produces good results for further processing.

## Step 7: Remesh (Optional)

For more regular vertex distribution before export:

1. **Filters → Remeshing, Simplification and Construction → Isotropic Remeshing**
2. Apply 1-2 iterations
3. This creates a more uniform triangle distribution, which helps Blender's retopology tools

## Step 8: Export from MeshLab

1. **File → Export Mesh As**
2. Format: **OBJ** (preferred for Blender import) or **PLY**
3. In the export options:
   - Check **Normal** (export vertex normals)
   - Check **Color** if the scan has color data
   - Uncheck **Texture** if you don't need UV coordinates
4. Click **OK**

OBJ is recommended over STL because:
- OBJ preserves vertex normals (STL doesn't)
- OBJ supports color/texture data (STL doesn't)
- OBJ file size is typically smaller than STL for the same mesh

## Step 9: Import into Blender

1. **File → Import → Wavefront OBJ**
2. Select the exported .obj file
3. The mesh appears in Blender's viewport

## Step 10: Retopology in Blender

After import, use Blender's retopology tools to create clean, low-poly geometry:

### Enable 3D Print Toolbox
1. **Edit → Preferences → Add-ons**
2. Search for "3D Print Toolbox"
3. Enable it

### Check Mesh Integrity
1. In the 3D Print Toolbox panel (N-key menu), click **Check All**
2. This reports any remaining issues: non-manifold edges, intersecting faces, zero-area faces

### Recalculate Normals
1. Enter Edit Mode (Tab)
2. Select all (A)
3. **Mesh → Normals → Recalculate Outside** (Ctrl+Shift+N)

### Retopology Methods
- **Manual retopology**: Use the Poly Build tool to draw new topology over the scan mesh
- **Voxel Remesh**: Use the Voxel Remesh modifier for quick, uniform remeshing
- **Decimate modifier**: For further reduction if needed
- **Quad Remesher** (paid add-on): For automatic quad-based retopology

## Common Issues

### Issue: Mesh Appears Too Dark in Blender
This is usually a normals issue. In MeshLab, before exporting:
1. **Filters → Normals, Curvatures and Orientation → Re-Orient all faces coherent**
2. This ensures all face normals point outward consistently

### Issue: Blender Crashes on Import
The mesh is still too large. Return to MeshLab and decimate further (reduce target face count to 50,000 or less).

### Issue: Holes Appear After Decimation
Decimation can create holes where the original mesh had thin structures. Either:
- Reduce the decimation target (keep more faces)
- Fill holes in Blender: Edit Mode → select hole boundary → **Face → Fill** (Alt+F)
- Use MeshLab's surface reconstruction before decimation

## Workflow Summary

```
Raw scan (OBJ/PLY/STL)
    ↓
MeshLab: Clean → Repair → Decimate → Smooth → Export OBJ
    ↓
Blender: Import → Check → Retopology → Final model
```

This workflow leverages MeshLab's strengths (processing large, messy meshes) and Blender's strengths (manual editing, retopology, modeling) in sequence.
