---
title: "Moment of Inspiration v5 Fillet Mesh Export Gaps and Thin Triangle Artifacts from"
excerpt: "Moment of Inspiration v5 Fillet Mesh Export Gaps and Thin Triangle Artifacts from: symptoms, root causes, and step-by-step fixes, verified against MoI forum."
category: "troubleshooting"
softwareSlug: "moi3d"
keyword: "Moment of Inspiration MoI v5 fillet mesh export gaps thin triangle CentroidTriangulation OBJ export cracks unjoined surfaces 0.005 tolerance large scale FBX vertex normal DCC import N-Gon output triangles trimming boundaries"
slug: "moment-of-inspiration-v5-fillet-mesh-export-gaps-and-thin-triangle-art"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
---

# Moment of Inspiration v5 Fillet Mesh Export Gaps and Thin Triangle Artifacts from CentroidTriangulation, OBJ Export Cracks from Unjoined Separate Surfaces, Large Scale Model Joining Failure from 0.005 Tolerance, FBX Vertex Normal Loss from DCC Import Settings, and N-Gon Output Misunderstanding with Triangles from Trimming Boundaries: CentroidTriangulation Fix, Join Before Export, Scale Down, Normal Settings, and N-Gon Explanation

Moment of Inspiration produces errors from fillet mesh gaps, OBJ export cracks, joining tolerance failures, FBX normal loss, and N-Gon output confusion. This guide covers the 5 most common MoI problems with diagnostic steps and community-verified fixes from MoI forum.

## 1. v5 Fillet Mesh Export Gaps and Thin Triangle Artifacts from CentroidTriangulation

### Symptom

When exporting meshes from MoI v5, fillet surfaces produce gaps and thin triangle artifacts. The thin triangles are rotated approximately 70-90 degrees relative to surrounding faces. The artifacts appear in FBX, OBJ, and other mesh export formats. The issue is particularly noticeable on fillets created in v5. The mesh looks poor in DCC applications like 3ds Max, Houdini, and V-Ray.

### Root Cause

"It looks like it might be more of a problem with fillets made in v5 where there is an unexpectedly large gap between the fillet surface and the cylinder surface. If you set CentroidTriangulation=y inside moi.ini it should fix the mesh export for now." The v5 fillet creation algorithm produces fillet surfaces with unexpected gaps relative to the adjacent surfaces. The default mesh export triangulation doesn't handle these gaps well, producing thin triangle artifacts. The CentroidTriangulation setting in moi.ini changes the triangulation method to use the centroid of n-gons, which produces better results for fillet surfaces.

### Fix

1. **Set CentroidTriangulation=y in moi.ini**:
   - Add CentroidTriangulation=y to moi.ini

2. **Increase mesh density for fillets**:
   - Increase angle and divide settings

3. **Set default angle in moi.ini**:
   - Set Angle=6 for better default quality

4. **Check for v5 fillet gaps**:
   - Check for gaps
   - In v5 fillet surfaces

5. **Use higher poly count for curved areas**:
   - Increase subdivisions for curved areas

6. **Verify in MoI export preview**:
   - Verify the export preview
   - Matches the DCC viewport

7. **Report persistent fillet issues**:
   - If fillet gaps persist after CentroidTriangulation
   - Report to MoI support
   - With the fillet model
   - And export settings

### Community Report

> "It looks like it might be more of a problem with fillets made in v5 where there is an unexpectedly large gap between the fillet surface and the cylinder surface. If you set CentroidTriangulation=y inside moi.ini it should fix the mesh export for now. For this case put in angle = 8 and divide larger than = 4 and that will make a much higher quality mesh for rendering at just 25k polygons. If you want a higher quality result for the default, you can set Angle=6 in moi.ini."

## 2. OBJ Export Cracks from Unjoined Separate Surfaces

### Symptom

When exporting OBJ files from MoI, cracks appear between mesh pieces. The cracks are visible in the DCC application as gaps between surfaces. The issue occurs when surfaces are separate (not joined) in MoI. IGES files imported from other CAD systems often contain separate surfaces that produce cracks when exported as mesh.

### Root Cause

"Those kinds of cracks can happen when you only have individual separate surfaces that just happen to be sitting next to each other instead of joined surfaces that are actually topologically connected to one another with a shared common edge. When you have a connected joined edge, MoI will do extra work in those spots to make sure that the generated meshes have the same vertex structure along that edge to make a 'watertight' mesh without cracks." When surfaces are not joined, MoI meshes each surface independently without knowledge of adjacent surfaces. This means mesh vertices on adjacent surfaces may not align, creating cracks between the mesh pieces.

### Fix

1. **Join surfaces before export**:
   - Use Edit > Join before exporting

2. **Enable Join surfaces on IGES import**:
   - Enable Join surfaces on import

3. **Check for naked edges**:
   - Use the naked edges script
   - To identify edges
   - That are not joined
   - And need joining

4. **Scale down large models before joining**:
   - Scale down to fix joining

5. **Use STEP instead of IGES**:
   - Use STEP for better import

6. **Verify watertight mesh after join**:
   - After joining
   - Verify the mesh
   - Is watertight
   - Without cracks

7. **Use N-Gon output for better topology**:
   - Use N-Gon output for better results

### Community Report

> "Those kinds of cracks can happen when you only have individual separate surfaces that just happen to be sitting next to each other instead of joined surfaces that are actually topologically connected to one another with a shared common edge. When you have a connected joined edge, MoI will do extra work in those spots to make sure that the generated meshes have the same vertex structure along that edge to make a 'watertight' mesh without cracks. IGS files most often contain all separate surfaces, so those need to get joined together."

## 3. Large Scale Model Joining Failure from 0.005 Tolerance

### Symptom

When importing large-scale models (several thousand units in size), MoI fails to join surfaces automatically. The Join command doesn't connect surfaces that appear to be adjacent. The issue occurs because the gaps between surfaces at large scale are larger than MoI's joining tolerance. The unjoined surfaces produce mesh cracks when exported.

### Root Cause

"MoI's joining process will join edges that are within 0.005 units apart from one another. If you have models created at a large numeric size, like several thousand units in size or something like that, it's possible that the gaps between the pieces are also at a larger scale than 0.005 units and that can prevent joining from working." MoI uses a fixed joining tolerance of 0.005 units. At large model scales, the gaps between surfaces may exceed this tolerance, preventing the Join command from connecting the surfaces.

### Fix

1. **Scale the model down before joining**:
   - Scale down, join, then scale back up

2. **Use Ctrl+A to select all**:
   - Select all before scaling

3. **Set origin to 0,0,0**:
   - Use 0,0,0 as the scale origin

4. **Scale factor of 0.01**:
   - Use 0.01 scale factor

5. **Join after scaling**:
   - After scaling down
   - Use Edit > Join
   - To join the surfaces
   - Then scale back up

6. **Use STEP format for import**:
   - Use STEP to avoid joining issues

7. **Check naked edges after joining**:
   - Use the naked edges script
   - To verify all edges
   - Are properly joined
   - After the join operation

### Community Report

> "MoI's joining process will join edges that are within 0.005 units apart from one another. If you have models created at a large numeric size, like several thousand units in size or something like that, it's possible that the gaps between the pieces are also at a larger scale than 0.005 units and that can prevent joining from working. If that's the case, then you'll want to try scaling the model down in MoI and then using the Join command on the surfaces to get them joined together."

## 4. FBX Vertex Normal Loss from DCC Import Settings

### Symptom

When importing FBX files exported from MoI into DCC applications (3ds Max, Houdini, Blender), the shading appears wrong. Dark shading areas and ugly sharp triangles appear in the viewport. The mesh looks correct in MoI's export preview but wrong in the DCC application. The issue is caused by vertex normal data being lost or modified during import.

### Root Cause

"Looks again like a vertex normal data problem on your side. The mesh MoI display at export time should look exactly the same in your DCC viewport. If you see a difference, like dark shading area or ugly sharp triangle, it's a good indication that something is lost in the import process, or something get mess-up after the import (vertex merging, attempt to reduce/edit the geometry, normals re-computing using an average method etc.)" MoI exports vertex normals with the FBX file. If the DCC application's import settings modify the vertex normals (e.g., recompute normals, create smoothing groups, merge vertices), the shading will appear wrong because the original normals from MoI are lost.

### Fix

1. **Preserve vertex normals in DCC import**:
   - Disable normal recomputation in DCC import settings

2. **Disable vertex merging**:
   - Disable vertex merging
   - In the DCC import settings

3. **Disable smoothing group creation**:
   - Disable smoothing group creation
   - In the FBX import dialog
   - Of your DCC application

4. **Verify MoI export preview matches DCC**:
   - Verify the preview
   - Matches the DCC viewport

5. **Use generic display mode in DCC**:
   - Use generic display mode
   - To check for import issues
   - Without DCC-specific shading

6. **Check for geometry modification**:
   - Check if the DCC application
   - Modified the geometry during import

7. **Use OBJ as alternative format**:
   - If FBX import has persistent issues
   - Try OBJ format
   - Which may preserve
   - Vertex normals better

### Community Report

> "Looks again like a vertex normal data problem on your side. The mesh MoI display at export time should look exactly the same in your DCC viewport. If you see a difference, like dark shading area or ugly sharp triangle, it's a good indication that something is lost in the import process, or something get mess-up after the import (vertex merging, attempt to reduce/edit the geometry, normals re-computing using an average method etc). There must be something about recomputing vertex normals, or creating Smoothing Groups that need to be disabled."

## 5. N-Gon Output Misunderstanding with Triangles from Trimming Boundaries

### Symptom

When using the N-Gon output option in MoI, some triangles still appear in the mesh. Users expect N-Gon output to produce only quads and n-gons, but triangles are present. The issue causes confusion about whether the N-Gon option is working correctly. Some users spend significant time trying to eliminate all triangles from the output.

### Root Cause

"When you use 'Output: N-gons' it outputs the underlying n-gons that were created by the refined surface intersected with the trimming boundaries, without doing any further tessellation of them into triangles. The only way that you will get a triangle with that option is if the underlying surface fragment is actually a triangle itself. For example if you create a triangular plane, then that will create a triangle." The N-Gon output option produces n-gons that follow the NURBS topology. Triangles only appear when the original NURBS surface has a triangular trimming boundary. This is correct behavior — the N-Gon option is working as designed.

### Fix

1. **Understand N-Gon output behavior**:
   - Triangles from triangular trimming boundaries
   - Are correct behavior

2. **Check for triangular trimming boundaries**:
   - If triangles appear in N-Gon output
   - Check if the original NURBS model
   - Has triangular trimming boundaries
   - That produce the triangles

3. **Don't expect zero triangles**:
   - This is not accurate as a blanket statement
   - Triangles only appear from triangular surfaces

4. **Use N-Gon output for topology matching**:
   - Use N-Gon for topology-matching output

5. **Accept triangles from triangular surfaces**:
   - Accept triangles
   - From triangular surfaces

6. **Use quads for character animation**:
   - Use all-quad output only
   - For character animation

7. **Don't over-engineer mesh topology**:
   - Don't over-engineer mesh topology

### Community Report

> "When you use 'Output: N-gons' it outputs the underlying n-gons that were created by the refined surface intersected with the trimming boundaries, without doing any further tessellation of them into triangles. The only way that you will get a triangle with that option is if the underlying surface fragment is actually a triangle itself. The n-gon option produces polygons that essentially follow the same topology as the original NURBS model. If you have some utterly bizarre goal of wanting to have no triangles in the output, I would suggest creating such meshes by hand in a polygon modeler."

## 6. Additional MoI Issues

### Centroid Triangulation Algorithm

**Issue**: "For every edge of the n-gon, make a triangle out of the centroid point and the edge points and calculate the signed area of the triangle. If the area is negative it means that triangle is reversed in orientation so don't do a centroid triangulation on that n-gon."
**Fix**: The CentroidTriangulation setting uses signed area to determine if centroid triangulation is safe. If the area is negative, centroid triangulation is skipped for that n-gon.

### Default Angle Setting

**Issue**: "The defaults are generating just 3k polygons for the entire object, it's just not enough density for rendering quality on something that has tightly curved fillets."
**Fix**: Set Angle=6 in moi.ini for better default quality. Use angle=8 and divide larger than=4 for high-quality rendering meshes.

### IGES Auto-Join on Import

**Issue**: "MoI will actually try to automatically join those surfaces together when importing IGES files, unless you have disabled the setting for it which is under Options > Import/Export > IGES options."
**Fix**: Enable Join surfaces on import in IGES options. Verify joining after import using the naked edges script.

### Naked Edges Script

**Issue**: "Naked edges are edges that belong to only 1 surface instead of being joined and shared between 2 surfaces."
**Fix**: Use the naked edges script to identify unjoined edges. Set up a keyboard shortcut (e.g., N key) for the script. Select and join the naked edges.

### Mesh Export Quality vs Poly Count

**Issue**: "Low poly artifacts like that will just generally be what you can expect if you are trying to restrict polygon count."
**Fix**: Increase poly count for better quality. Use angle=8 and divide larger than=4 for 25k polygons. Don't restrict poly count for rendering quality.

### V5 Fillet Gap Investigation

**Issue**: "Has this only happened specifically on fillets created in MoI v5? Do you have any other examples aside from v5 generated fillets?"
**Fix**: The v5 fillet gap issue is being investigated. Report v5 fillet examples to MoI support. Use CentroidTriangulation=y as workaround.

### Quad Output for Sub-D

**Issue**: "Sub-d is to create the kind of curved surfaces that are already in the nurbs model."
**Fix**: Use N-Gon output for NURBS-to-mesh conversion. Sub-D is not needed for NURBS models. Use quads only for character animation skinning.

## Best Practices

1. **Set CentroidTriangulation=y in moi.ini** — fixes v5 fillet mesh export artifacts
2. **Join all surfaces before mesh export** — prevents cracks between mesh pieces
3. **Enable Join surfaces on IGES import** — auto-joins IGES surfaces
4. **Scale down large models before joining** — 0.005 tolerance requires small scale
5. **Use STEP instead of IGES for import** — no joining needed during import
6. **Preserve vertex normals in DCC import** — disable normal recomputation
7. **Set Angle=6 in moi.ini for better defaults** — improves default mesh quality
8. **Use angle=8 and divide=4 for rendering** — 25k polygons for high quality
9. **Understand N-Gon output produces triangles from triangular surfaces** — correct behavior
10. **Don't over-engineer mesh topology** — direct MoI export renders perfectly
