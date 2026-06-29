---
title: "Autodesk Netfabb STL Mesh Repair: Fixing Holes, Inverted Normals, and Non-Manifold Edges"
excerpt: "Netfabb's mesh repair tools fix the most common STL errors: holes, inverted normals, non-manifold edges, and self-intersections. I cover the automated repair workflow, manual repair tools, and the specific checks needed to ensure a mesh is 3D-print-ready."
category: "troubleshooting"
softwareSlug: "autodesk-netfabb"
keyword: "Autodesk Netfabb STL mesh repair holes inverted normals non-manifold edges fix"
slug: "autodesk-netfabb-stl-mesh-repair-holes-normals-non-manifold"
author: "CAD IT Admin"
readTime: "11 min"
date: "2025-06-22"
sources:
  - "https://knowledge.autodesk.com/support/netfabb/learn-explore/caas/CloudHelp/cloudhelp/2021/ENU/NETF/files/GUID-E8674B22-008F-4FE1-A1C1-FD32CB375713-htm.html"
  - "https://formlabs.com/blog/best-stl-file-repair-software-tools/"
  - "https://www.datanumen.com/stl-repair/guides/repair-stl-files/"
  - "https://omnvert.com/en/tutorials/fix-non-manifold-stl"
---

# Autodesk Netfabb STL Mesh Repair: Fixing Holes, Inverted Normals, and Non-Manifold Edges

I've repaired thousands of STL files in Netfabb for 3D printing, and the mesh errors I encounter fall into a predictable set of categories. Netfabb is one of the most capable mesh repair tools available — its automated repair function is even embedded in other software like Formlabs PreForm. Understanding the repair workflow and the specific error types ensures your models are print-ready before they reach the slicer.

## Common Mesh Errors

Autodesk's documentation defines the key mesh errors that prevent successful 3D printing:

### Holes and Gaps

Missing triangles in the mesh create holes where the surface is not closed. A 3D printable mesh must be watertight (manifold) — any holes cause the slicer to misinterpret the model's boundaries.

### Inverted Normals

Each triangle in a mesh has a normal vector pointing outward. Autodesk's documentation states: "Normals of neighboring triangles must all, without exception, point either away from, or towards, the volume enclosed by those triangles." Inverted normals cause the slicer to think the inside of the model is the outside.

### Non-Manifold Edges

A manifold edge is shared by exactly two triangles. Non-manifold edges are shared by three or more triangles, creating ambiguous topology that slicers can't interpret correctly.

### Self-Intersections

Part of the mesh intersects another part, creating overlapping geometry. This often happens when Boolean operations in CAD software produce incorrect results.

### Floating Shells

Small disconnected pieces of mesh floating near the main model. These are usually artifacts from CAD export and should be removed before printing.

## Netfabb's Repair Workflow

### Step 1: Import and Analyze

1. File → Open (or drag and drop STL/OBJ file)
2. Netfabb automatically analyzes the mesh on import
3. Red triangles indicate errors in the mesh
4. The part tree shows a warning icon if errors are detected
5. Check the **Status** column — it shows the number of bad edges, holes, and shells

### Step 2: Open the Repair Tools

1. Right-click the part → **Repair**
2. Or select the part and click the **Repair** icon in the toolbar
3. The repair workspace opens with the mesh highlighted
4. Red areas show errors; green areas are clean

### Step 3: Automated Repair

1. Click **Automatic Repair** in the repair toolbar
2. Choose **Default Repair** (recommended for most models)
3. Netfabb applies a series of automated fixes:
   - Closes holes
   - Fixes inverted normals
   - Removes non-manifold edges
   - Merges close vertices
   - Removes self-intersections
4. Click **Apply Repair** to accept the changes

### Step 4: Manual Repair (If Needed)

If automated repair doesn't fix all issues:

**Fixing Holes**:
1. Select **Close Holes** in the repair toolbar
2. Netfabb highlights all detected holes
3. Click on a hole to close it
4. Large holes may need manual triangulation

**Fixing Inverted Normals**:
1. Select **Invert Normals**
2. Click on triangles with incorrect normal direction
3. Or use **Unify Normals** to make all normals consistent

**Fixing Non-Manifold Edges**:
1. Select **Remove Non-Manifold Edges**
2. Netfabb identifies and removes edges shared by more than two triangles
3. The surrounding area may need additional hole repair after removal

**Fixing Self-Intersections**:
1. Under **Self Intersections**, choose **Detect**
2. Options include:
   - **Trivial**: Default hole repair
   - **Stitch Triangles**: Merges overlapping triangles
   - **Remove Double Triangles**: Deletes duplicate faces
   - **Remove Degenerate Faces**: Removes zero-area triangles
   - **Split Off and Remove**: Separates and deletes intersecting regions
   - **Wrap Part Surface**: Creates a new clean surface over the entire part (similar to voxelization)

### Step 5: Verify

1. After repair, check the Status column — it should show 0 bad edges, 0 holes
2. Use **Analysis → Check Part** for a final validation
3. The part tree icon should no longer show a warning

## Advanced Repair Tools

### Separate Shells

1. Right-click part → **Separate Shells**
2. Netfabb splits the mesh into individual shell objects
3. Delete unwanted floating shells
4. Keep only the main model shell

### Boolean Operations

For meshes that need combining or cutting:
1. Import both meshes
2. Use **Insert → Boolean Operations**
3. Choose Union, Subtract, or Intersect
4. The result is a new combined mesh that may need repair

### Smoothing

For rough or faceted surfaces:
1. Select the part
2. Use **Surface → Smooth**
3. Adjust smoothing iterations and strength
4. Be careful — excessive smoothing can distort geometry

## Exporting the Repaired Mesh

1. Right-click the repaired part → **Export Part**
2. Choose STL or 3MF format
3. Select **Binary STL** for smaller file size
4. The exported file is now watertight and ready for slicing

## When to Use Wrap Part Surface

The **Wrap Part Surface** function is the most aggressive repair method. It creates an entirely new surface over the part, similar to voxelization. Use it when:

- The mesh has extensive errors that automated repair can't fix
- The model has complex self-intersections
- You need a guaranteed watertight result
- Minor geometric distortion is acceptable

The trade-off: Wrap Part Surface can lose fine details and slightly alter the model's dimensions. Always compare the wrapped model to the original before printing.

## Best Practices for Clean STL Exports

To minimize the need for repair:

1. **Export at high resolution** from CAD — use fine tessellation settings
2. **Check for open edges** in CAD before exporting
3. **Avoid Boolean operations** that create complex intersections
4. **Use 3MF format** instead of STL when possible — it preserves more information
5. **Validate in CAD** using mesh analysis tools before export
6. **Simplify geometry** — remove unnecessary features that create mesh errors

## Netfabb Versions

- **Standard (free)**: Basic mesh repair, slicing, part orientation
- **Premium**: Lattice generation, hollowing, advanced repair, simulation
- **Ultimate**: Full feature set including optimization engine and powder bed simulation

The mesh repair tools described in this guide are available in all versions, including the free Standard edition.

## Summary

Netfabb's mesh repair workflow is straightforward: import the STL, open the Repair workspace, run Automatic Repair, then manually fix any remaining issues. The most common errors are holes (closed with the Close Holes tool), inverted normals (fixed with Unify Normals), non-manifold edges (removed with Remove Non-Manifold Edges), and self-intersections (fixed with Detect and Remove). For severely damaged meshes, the Wrap Part Surface function creates a clean new surface over the entire part. Always verify the repaired mesh shows 0 errors in the Status column before exporting. The free Standard version includes all essential repair tools — no paid license is needed for basic STL repair.
