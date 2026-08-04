---
title: "MoI3D STL Export and Boolean Operation Errors"
excerpt: "MoI3D STL Export and Boolean Operation Errors: symptoms, root causes, and step-by-step fixes, verified against MoI3D forums."
category: "printing"
softwareSlug: "moi3d"
keyword: "MoI3D STL export open edges stray fillet surfaces false faces non-planar union BSOD crash Intel graphics driver mesh artifacts CentroidTriangulation moi.ini non-manifold edges grazing cylinders boolean"
slug: "moi3d-stl-export-and-boolean-operation-errors"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
---

# MoI3D STL Export and Boolean Operation Errors: Open Edges from Stray Fillet Surfaces, False Faces from Non-Planar Union, BSOD Crash on Export from Intel Graphics Driver, Mesh Export Artifacts from Fillet Gaps Requiring CentroidTriangulation, and Non-Manifold Edges from Barely Grazing Cylinders

MoI3D produces excellent NURBS models but STL export, boolean operations, and mesh generation can fail from stray surfaces, non-planar unions, driver crashes, and non-manifold geometry. This guide covers the 5 most common MoI3D problems with diagnostic steps and community-verified fixes from the MoI3D discussion forums.

## 1. Open Edges from Stray Fillet Surfaces

### Symptom

Exported STL files have open edges, flagged by Prusa Slicer. The model contains a combination of default circular fillets and 'const distance' fillets where circular fillets wouldn't work. Exporting without fillets produces no open edges.

### Root Cause

Some fillet operations fail to properly attach to the main solid body. These "stray" fillet surfaces remain as separate objects but are visually indistinguishable from attached fillets. When exported, these separate surfaces create open edges in the STL.

### Fix

1. **Check for stray objects before export**:
   - Select the main object
   - Check if any surfaces are separate from the solid
   - Look inside the model — stray fillets may be hidden inside
   - Use Edit → Separate to break the solid, then rejoin

2. **Use "Divide larger than" mesh setting**:
   - In the STL export dialog, enable "Divide larger than"
   - Set a value to dice large triangles into smaller pieces
   - This helps avoid skinny triangles that span large areas

3. **Verify fillet attachment**:
   - After applying fillets, check the object type
   - It should be a "solid" not a "joined surface"
   - If it's a joined surface, some fillets didn't attach properly

4. **Use 3D Builder or Meshmixer for STL repair**:
   - Microsoft 3D Builder (free, built on Netfabb engine) repairs STL files
   - Meshmixer has Analyze → Repair function
   - These tools fix open edges automatically
   - Use as a safety net before printing

5. **Avoid mixing fillet types**:
   - Mixing circular and const-distance fillets can cause attachment issues
   - Try using only one fillet type per edge
   - If circular doesn't work, try a smaller radius before switching to const-distance

### Community Report

> "There are a couple of stray separate surface objects inside of it, are these possibly also getting written to the STL? These two strays somehow remained associated with the object when I selected it for export."

> "I don't recall seeing any MoI3D failure warnings re these two stray fillets."

## 2. False Faces from Non-Planar Union

### Symptom

After a boolean union of an extrusion with a solid cylinder, the STL export produces false faces — faces inside the solid object. The slicer doesn't recognize the false faces but creates wrong layers (partly missing layers), causing failed prints.

### Root Cause

The unioned piece didn't share the same plane as the existing piece, creating a very small sliver of extra geometry. This tiny misalignment (as small as 0.001mm) causes the boolean operation to produce a non-manifold result with internal faces.

### Fix

1. **Check for planar alignment before boolean**:
   - Zoom in very close to the intersection
   - Verify both pieces share the exact same plane
   - Even 0.001mm misalignment can cause false faces

2. **Fix the alignment**:
   - Cut the protruding geometry with a simple cut operation
   - Re-export the STL — the false faces should be gone

3. **Use precise snapping**:
   - MoI3D's snapping can sometimes be imprecise
   - Drawing a circle "exactly on the middle" may have 0.001mm difference
   - Use object snaps (endpoint, midpoint, center) for precision

4. **Check for small differences after operations**:
   - Mirroring, copy, and other operations can produce small differences
   - Drawing symmetrical objects from a fixed center can create a "cloud" of center points within 0.01mm
   - Be aware of this when precise alignment is needed

5. **Repair the STL externally**:
   - Use Microsoft 3D Builder to repair the STL
   - Or use Meshmixer's Analyze → Repair function
   - These tools remove false faces and fix non-manifold geometry

### Community Report

> "The piece that you unioned on did not share the same plane as the existing piece, making some extra area with a very small width. That is what is causing the problem."

> "With one simple cut operation (cutting the protruding cylinders) the STL export is OK."

## 3. BSOD Crash on Export from Intel Graphics Driver

### Symptom

MoI3D crashes the entire computer (blue screen / BSOD) when attempting to export a file. The crash is replicable. The user has Intel integrated graphics.

### Root Cause

The crash is caused by a bug in the Intel graphics driver (igxpdx32.DLL). Normal user-mode programs like MoI3D can't crash the entire system — only drivers operating at kernel privilege level can cause a BSOD. The Intel integrated graphics driver has a bug that corrupts kernel memory during OpenGL operations.

### Fix

1. **Update the video driver**:
   - Download the latest driver directly from the Intel website
   - Don't rely on Windows Update — it often has older drivers
   - If the latest driver still crashes, try a slightly older driver version

2. **Use a dedicated graphics card**:
   - Intel integrated video is "way far at the bottom of the heap" for 3D processing
   - Even the least expensive NVIDIA or AMD dedicated card is much more capable
   - A dedicated GPU avoids the Intel driver issue entirely

3. **Generate a crash dump**:
   - Configure Windows to create a crash dump on BSOD:
     - Control Panel → System → Advanced tab
     - "Startup and Recovery" settings
     - Under "System failure" → "Write debugging information"
     - Set to "Small memory dump (64 KB)"
     - Set dump directory to `%SystemRoot%\Minidump`
   - The .dmp file identifies which driver caused the crash
   - Send the .dmp file to MoI3D support for analysis

4. **Check for multiple display adapters**:
   - Device Manager may show 2 Display Adapters
   - This is normal for cards with multiple outputs
   - Not necessarily the culprit, but check if one is Intel integrated

5. **Try software rendering mode**:
   - If MoI3D has a software rendering option, use it
   - This bypasses the graphics driver entirely
   - Performance will be slower but crashes should stop

### Community Report

> "I was able to load the .DMP file into a debugging tool which pinpoints the crash as occurring in igxpdx32.DLL, which belongs to the Intel video driver."

> "If you're seeing a blue screen problem, try updating your video driver. It's the most common driver to have problems since it is by far the most complex driver on the system."

## 4. Mesh Export Artifacts from Fillet Gaps

### Symptom

Mesh export (STL/FBX) produces artifacts — long thin triangles that fail to maintain fillet curvature. The default export settings generate too few polygons for tightly curved fillets, resulting in visible faceting.

### Root Cause

MoI3D's default mesh export settings generate low-polygon meshes (e.g., 3K polygons for an entire object). For objects with tightly curved fillets, this isn't enough density. Additionally, fillet surfaces in V5 can have unexpectedly large gaps between the fillet and the cylinder surface.

### Fix

1. **Set CentroidTriangulation=y in moi.ini**:
   - Open `moi.ini` in a text editor
   - Add or change: `CentroidTriangulation=y`
   - This fixes mesh export artifacts from fillet gaps
   - This is a temporary fix while the fillet bug is being investigated

2. **Increase polygon density**:
   - In the export dialog, move the slider towards the right
   - More subdivisions in curved areas
   - For rendering quality: use Angle=8 and Divide larger than=4
   - This generates ~25K polygons for better curvature representation

3. **Set Angle=6 in moi.ini for better defaults**:
   - The default angle may be too large for curved surfaces
   - Set `Angle=6` in moi.ini to change the default
   - This improves default export quality without manual adjustment

4. **Check fillet surface gaps**:
   - In V5, fillets can have unexpectedly large gaps
   - Inspect fillet-to-surface connections closely
   - If there's a gap, the fillet needs to be recreated
   - Report fillet gap bugs to MoI3D support

5. **Use higher poly count for rendering**:
   - Don't try to restrict polygon count for rendering
   - Higher poly count better represents curvature
   - For 3D printing, balance polygon count with printer resolution

6. **Verify vertex normals in DCC applications**:
   - If the mesh looks different in another DCC application (3ds Max, Houdini)
   - The issue may be vertex normal recomputation on import
   - Disable normal recomputation or smoothing group creation on import
   - The goal is to read vertex normals that MoI3D created

### Community Report

> "If you set CentroidTriangulation=y inside moi.ini it should fix the mesh export for now."

> "Low poly artifacts will generally be what you can expect if you are trying to restrict polygon count. The main way to make polygons adapt to the fillet's curvature better is to move the slider towards the right."

## 5. Non-Manifold Edges from Barely Grazing Cylinders

### Symptom

Boolean union fails silently — two objects don't join, or the result is a joined surface instead of a solid. The object appears fine visually but has naked edges inside. Later boolean operations fail because the object is no longer a solid.

### Root Cause

Two cylinders barely graze each other along an edge, creating a "non-manifold" edge where 4 surfaces meet at a shared edge. A perfect solid requires only 2 surfaces touching at each edge. The grazing arrangement also creates very skinny thickness, making 3D printing difficult.

### Fix

1. **Avoid barely-grazing geometry**:
   - Don't let two cylinders just barely touch along an edge
   - Either overlap them more significantly or keep them apart
   - The pieces need to be either closer (proper overlap) or further apart (no touch)

2. **Check for non-manifold edges**:
   - After boolean operations, check if the result is a "solid" or "joined surface"
   - MoI3D should warn when operations don't produce expected results
   - Use Show Edges to identify naked/non-manifold edges

3. **Fix naked edges**:
   - Split the object to ~individual faces
   - Join them back together
   - This can sometimes heal naked edges

4. **Boolean union with a solid** — workaround:
   - Even a joined surface with naked edges can sometimes boolean union with a solid
   - This may produce a perfect solid despite the naked edges
   - Not reliable but worth trying

5. **Request verbose feedback from MoI3D**:
   - MoI3D should warn when:
     - A solid changes to a joined surface
     - An object is deleted during boolean
     - A boolean produces unexpected results
   - Currently these happen silently
   - Request this feature for V5

6. **Save frequently and check object type**:
   - Save before every boolean operation
   - After boolean, check if the result is a solid
   - If it's a joined surface, undo and fix the geometry
   - Don't save with a broken solid — you'll lose the undo chain

7. **Avoid skinny thickness**:
   - Non-manifold edges create very skinny thickness areas
   - 3D printer slicers can't get a clean slice in these areas
   - Multiple possible neighbors within a small tolerance create a jumble
   - Redesign to avoid these thin areas

### Community Report

> "You don't want to have this type of arrangement where 2 cylinders just barely graze each other along an edge. It's a 'non-manifold' edge where there are 4 surfaces meeting up at a shared edge."

> "The pieces need to be either a little closer to each other so they don't just barely graze each other, or a little further apart so they don't touch."

## 6. Additional MoI3D Issues

### Snapping Imprecision

**Issue**: Snapping is sometimes not precise — operations like mirroring and copy produce small differences (0.001mm).
**Fix**: Use object snaps for precision. Be aware of cumulative errors in symmetrical designs. Check critical dimensions after operations.

### Boolean Subtract Instead of Union

**Issue**: Boolean union unexpectedly performs a boolean subtract, deleting the second object.
**Fix**: This can happen with non-manifold geometry. Undo, fix the geometry (remove non-manifold edges), and retry.

### Joined Surface Discovers Later

**Issue**: A solid silently becomes a joined surface, discovered only when a later boolean fails.
**Fix**: Check object type after every boolean. Save frequently. If discovered too late (undo chain lost), split to faces and rejoin.

## Best Practices

1. **Check for stray surfaces before export** — separate and rejoin the solid
2. **Verify planar alignment before boolean union** — even 0.001mm matters
3. **Set CentroidTriangulation=y in moi.ini** — fixes mesh export artifacts
4. **Use Angle=6 or higher for better mesh quality** — especially for curved fillets
5. **Update Intel graphics drivers or use dedicated GPU** — prevents BSOD on export
6. **Avoid barely-grazing cylinders** — creates non-manifold edges
7. **Check object type after every boolean** — solid vs joined surface
8. **Save before every boolean operation** — don't lose undo chain
9. **Use 3D Builder or Meshmixer for STL repair** — safety net before printing
10. **Don't restrict polygon count for rendering** — higher poly = better curvature
