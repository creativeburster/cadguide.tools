---
title: "MeshLab Mesh Processing and Export Errors: FBX and GLB Import Crash from Format Incompatibility Requiring Format Conversion, Export Crash After Quadric Edge Collapse Decimation from Version Bug Requiring 2020.05 or Mesh Size Reduction, Non-Manifold Edge Repair Not Persisting in STL from Format Limitation Requiring PLY or OBJ Save, Duplicate Faces After Repair from STL Vertex Duplication Requiring PLY Format, and Large Model 20-30M Face Crash from Memory Exhaustion Requiring Mesh Reduction or Older Version"
excerpt: "MeshLab fails for 5 distinct reasons: FBX and GLB import crash from format incompatibility requiring format conversion, export crash after Quadric Edge Collapse Decimation from version bug requiring 2020.05 or mesh size reduction, non-manifold edge repair not persisting in STL from format limitation requiring PLY or OBJ save, duplicate faces after repair from STL vertex duplication requiring PLY format, and large model 20-30M face crash from memory exhaustion requiring mesh reduction or older version. We cover each with fixes from MeshLab GitHub Issues."
category: "mesh-processing-and-export-errors"
softwareSlug: "meshlab"
keyword: "MeshLab FBX GLB import crash format incompatibility conversion export crash Quadric Edge Collapse Decimation version bug 2020.05 non-manifold edge repair not persisting STL format limitation PLY OBJ save duplicate faces STL vertex duplication large model 20-30M face crash memory exhaustion mesh reduction older version"
slug: "meshlab-mesh-processing-export-errors-fbx-glb-import-crash-export-crash-quadric-edge-collapse-decimation-non-manifold-edge-repair-not-persisting-stl-duplicate-faces-vertex"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-08-03"
sources:
  - "https://github.com/cnr-isti-vclab/meshlab/issues/1485"
  - "https://github.com/cnr-isti-vclab/meshlab/issues/1486"
  - "https://github.com/cnr-isti-vclab/meshlab/issues/1533"
---

# MeshLab Mesh Processing and Export Errors: FBX and GLB Import Crash from Format Incompatibility Requiring Format Conversion, Export Crash After Quadric Edge Collapse Decimation from Version Bug Requiring 2020.05 or Mesh Size Reduction, Non-Manifold Edge Repair Not Persisting in STL from Format Limitation Requiring PLY or OBJ Save, Duplicate Faces After Repair from STL Vertex Duplication Requiring PLY Format, and Large Model 20-30M Face Crash from Memory Exhaustion Requiring Mesh Reduction or Older Version

MeshLab's FBX/GLB import, mesh export, non-manifold repair, STL format handling, and large mesh processing produce errors from format incompatibility, version bugs, format limitations, vertex duplication, and memory exhaustion. This guide covers the 5 most common MeshLab problems with diagnostic steps and community-verified fixes from MeshLab GitHub Issues.

## 1. FBX and GLB Import Crash from Format Incompatibility

### Symptom

Importing .fbx files (exported from Gravity Sketch) or .glb files causes MeshLab to crash immediately. No error message is shown — MeshLab simply closes. The same files load fine in Blender, Rhino, and 3D Viewer. Windows Event Viewer shows an application fault.

### Root Cause

MeshLab's FBX and GLB import filters have compatibility issues with certain file variations. The FBX files from Gravity Sketch use features or encoding that MeshLab's FBX parser doesn't handle. The GLB files produced by AssImp Library may use features that MeshLab's GLTF/GLB parser doesn't support. The crash is a null reference or access violation in the import filter code.

### Fix

1. **Convert FBX to OBJ or PLY before import**:
   - "FBX files exported from Gravity Sketch consistently crash Meshlab but seem to work fine in other apps (Blender and Rhino)"
   - Open the FBX in Blender
   - Export as OBJ or PLY
   - Import the OBJ or PLY into MeshLab

2. **Convert GLB to GLTF or PLY**:
   - "The .GLB file loads as expected in 3D Viewer"
   - "At an attempt to load the file in MeshLab the app quits w/o any error messages"
   - Use an online GLB to GLTF converter
   - Or open in Blender and export as PLY

3. **Use older MeshLab version**:
   - "Meshlab 2020.05 work well on Windows 11 Pro 23H2. All other versions crashed"
   - Try MeshLab 2020.05 for FBX import
   - The older FBX parser may be more compatible
   - Keep multiple versions installed

4. **Check file with AssImp**:
   - "The file is produced by AssImp Library version: 5.3.1778959262"
   - If the GLB was produced by AssImp
   - Try re-exporting with a different AssImp version
   - Or use a different GLB exporter

5. **Report the crash on GitHub**:
   - "I have found .fbx files exported from Gravity Sketch consistently crash Meshlab"
   - Create a GitHub issue with the crash details
   - Attach a simple test file that reproduces the crash
   - Include MeshLab version and OS info

6. **Use Blender for FBX/GLB processing**:
   - If MeshLab can't import FBX/GLB
   - Use Blender for initial import and processing
   - Export to OBJ/PLY from Blender
   - Use MeshLab for mesh repair and analysis

### Community Report

> "FBX files exported from Gravity Sketch consistently crash Meshlab but seem to work fine in other apps (Blender and Rhino). Meshlab closes when trying to import, no additional info shown. Meshlab 64 bit v2023.12 on Windows. GLB file loads as expected in 3D Viewer but at attempt to load in MeshLab the app quits w/o any error messages. Same issue with v2025.07."

## 2. Export Crash After Quadric Edge Collapse Decimation from Version Bug

### Symptom

Applying "Quadric Edge Collapse Decimation" on a model, then exporting the new mesh. MeshLab crashes and closes without any warning during the export. The crash happens consistently after decimation and export. MeshLab 2020.05 works fine but newer versions crash.

### Root Cause

"Meshlab 2020.05 work well on Windows 11 Pro 23H2. All other versions crashed." The decimation and export pipeline has a bug in MeshLab versions after 2020.05. The decimation creates mesh data that the export filter can't handle, causing a crash. The bug may be related to memory management or mesh data structure changes between versions.

### Fix

1. **Use MeshLab 2020.05**:
   - "Meshlab 2020.05 work well on Windows 11 Pro 23H2"
   - "All other versions crashed"
   - Download MeshLab 2020.05
   - Use this version for decimation and export

2. **Use MeshLab 2016**:
   - "I use Meshlab 2016 and all work well"
   - MeshLab 2016 is another stable version
   - Try this if 2020.05 doesn't work
   - Keep multiple versions for different tasks

3. **Reduce mesh size before decimation**:
   - "It is very large models about 20-30M faces"
   - Reduce the mesh size before decimation
   - Use a simpler decimation method first
   - Then apply Quadric Edge Collapse on the smaller mesh

4. **Export to different format**:
   - Try exporting to PLY instead of STL
   - Or try OBJ format
   - The crash may be format-specific
   - Test different export formats

5. **Save project before export**:
   - Use File > Save Project before exporting
   - If the export crashes, the project is saved
   - Reopen and try a different export format
   - This prevents losing the decimation work

6. **Use alternative decimation tools**:
   - If MeshLab crashes consistently
   - Use Blender's Decimate modifier
   - Or use Simplygon, Meshmixer, or other tools
   - Import the result back to MeshLab for further processing

### Community Report

> "When I export a new mesh after applying Quadric Edge Collapse Decimation on my model, Meshlab will crash and close without any warning. Meshlab 2020.05 work well on Windows 11 Pro 23H2. All other versions crashed. I use Meshlab 2016 and all work well. It is very large models about 20-30M faces."

## 3. Non-Manifold Edge Repair Not Persisting in STL from Format Limitation

### Symptom

Repairing non-manifold edges in MeshLab using "Repair non manifold edges (option split vertices)." The repair succeeds — "successfully split etc etc." Reorienting faces works after repair. Save and exit. But when reloading the saved file, the same "Mesh has some non 2 manifold faces" error appears again.

### Root Cause

"The STL format is the problem. This is not a bug, is just that STL does not save meshes in indexed mode, and that is the root cause of a lot of other problems." STL format doesn't store indexed mesh data — it stores each triangle as three independent vertices. When MeshLab repairs non-manifold edges by splitting vertices, the STL format can't preserve the vertex sharing information. On reload, the vertices are duplicated again, recreating the non-manifold condition.

### Fix

1. **Save in PLY or OBJ instead of STL**:
   - "If you avoid the STL format (just save in PLY, OBJ, or any other format), you should not get the error again"
   - After repair, save as PLY
   - PLY stores indexed mesh data
   - Vertex sharing is preserved on reload

2. **Use the delete option instead of split**:
   - "If I use the repair option by deleting (not split option) the bad faces, it deletes them, and saves correctly with the deletions"
   - Instead of "Repair non manifold edges (split vertices)"
   - Use "Repair non manifold edges (delete faces)"
   - Deletions persist in STL format

3. **Convert to PLY for repair workflow**:
   - "I load my STL, save it to PLY, reload the PLY"
   - "I correct the error in PLY, save back to PLY and the error is gone"
   - Load STL → Save as PLY → Reload PLY → Repair → Save PLY
   - Convert to STL only for final 3D printing

4. **Understand STL limitations**:
   - "STL does not allow the file because two faces of seven are repeated"
   - "Creating the PLY file, it declares wrong too, but repairing it reorders the vertices"
   - "But keeps the duplicate faces"
   - "Basically PLY allows the overlapping of equal faces"
   - STL is for final output, not for repair workflows

5. **Check for duplicate faces**:
   - "Thanks, I isolated the problem in the STL file on only 7 faces"
   - "Two faces of seven are repeated"
   - Use MeshLab's "Remove Duplicate Faces" filter
   - This may fix the issue before saving

6. **Use OBJ as alternative to PLY**:
   - OBJ also stores indexed mesh data
   - OBJ is widely supported
   - Use OBJ if PLY is not available
   - Both preserve vertex sharing

### Community Report

> "Repair non-manifold edges does not work when saving the file. I apply 'Repair non manifold edges (option split vertices)' — successfully split. I save and exit. But if I reload the saved file, I have AGAIN the non-manifold faces. The STL format is the problem — STL does not save meshes in indexed mode. If you avoid the STL format (save in PLY, OBJ, or any other format), you should not get the error again. If I use the repair option by deleting (not split option) the bad faces, it saves correctly."

## 4. Duplicate Faces After Repair from STL Vertex Duplication

### Symptom

After repairing non-manifold edges and saving to PLY, the repair seems to work. But the PLY file still has duplicate faces. The duplicate faces are the same faces repeated. This is unacceptable for 3D printing — duplicate faces cause slicing issues.

### Root Cause

"PLY allows the overlapping of equal faces. Unfortunately this concept is unacceptable for a correct 3D print." Both STL and PLY can have duplicate faces. The repair function splits vertices but doesn't remove duplicate faces. PLY preserves the vertex sharing but keeps the duplicate face entries. For 3D printing, duplicate faces must be removed.

### Fix

1. **Remove duplicate faces**:
   - Use MeshLab's "Remove Duplicate Faces" filter
   - Filter > Cleaning and Repairing > Remove Duplicate Faces
   - This removes the repeated face entries
   - Verify with the mesh info

2. **Use delete option for non-manifold repair**:
   - "If I use the repair option by deleting (not split option) the bad faces"
   - "It deletes them, and saves correctly with the deletions"
   - This removes the problematic faces entirely
   - No duplicates to worry about

3. **Check mesh statistics**:
   - After repair, check mesh statistics
   - Render > Show Stats
   - Compare face count before and after
   - If face count is higher than expected, duplicates may remain

4. **Use Boolean operations to clean**:
   - Import the mesh into Blender
   - Use Boolean Union with a copy of itself
   - This removes duplicate faces
   - Export back to PLY or STL

5. **Manual inspection**:
   - "I isolated the problem in the STL file on only 7 faces"
   - "Two faces of seven are repeated"
   - Use MeshLab's selection tools
   - Manually select and delete duplicate faces

6. **Final STL for 3D printing**:
   - Do all repair work in PLY
   - Only convert to STL for final 3D printing
   - The STL conversion from clean PLY should be correct
   - Verify in the slicer before printing

### Community Report

> "I isolated the problem in the STL file on only 7 faces. STL does not allow the file because two faces of seven are repeated. Creating the PLY file, it declares wrong too, but repairing it reorders the vertices, but keeps the duplicate faces. Basically PLY allows the overlapping of equal faces. Unfortunately this concept is unacceptable for a correct 3D print."

## 5. Large Model 20-30M Face Crash from Memory Exhaustion

### Symptom

Working with very large models — 20-30 million faces. MeshLab crashes when applying filters, exporting, or sometimes even loading the mesh. The crash occurs without warning. Smaller models work fine. The system has adequate RAM but MeshLab still crashes.

### Root Cause

MeshLab loads the entire mesh into memory. For 20-30M face meshes, this requires significant RAM for vertex data, face data, and auxiliary data structures (normals, colors, texture coordinates). Additionally, filters like Quadric Edge Collapse Decimation create temporary data that multiplies memory usage. When the total exceeds available memory, MeshLab crashes.

### Fix

1. **Use MeshLab 2020.05 or 2016**:
   - "I use Meshlab 2016 and all work well. It is very large models about 20-30M faces"
   - "Meshlab 2020.05 work well on Windows 11 Pro 23H2"
   - Older versions may have lower memory overhead
   - Try different versions for large models

2. **Reduce mesh before processing**:
   - Use a simpler decimation method first
   - Reduce to 10-15M faces
   - Then apply Quadric Edge Collapse
   - This reduces peak memory usage

3. **Close other applications**:
   - Close all other applications
   - Free up RAM
   - Close browser, other CAD tools
   - Give MeshLab maximum available memory

4. **Increase virtual memory**:
   - Increase Windows page file size
   - System > Advanced > Performance > Virtual Memory
   - Set to 2-3x physical RAM
   - This provides overflow memory

5. **Use 64-bit MeshLab**:
   - "Meshlab 64 bit v2023.12"
   - Ensure using 64-bit version
   - 32-bit version is limited to ~4GB RAM
   - 64-bit can use all available RAM

6. **Split the mesh**:
   - Split the large mesh into smaller parts
   - Process each part separately
   - Use MeshLab's "Split" filter
   - Recombine after processing

7. **Use alternative tools for large meshes**:
   - Use Blender for large mesh processing
   - Blender handles large meshes better
   - Use MeshLab for smaller, focused tasks
   - Or use CloudCompare for large point clouds

8. **Simplify before importing**:
   - Reduce mesh complexity in the source application
   - Export a lower-resolution mesh
   - Then import to MeshLab
   - This avoids the memory issue entirely

### Community Report

> "When I export a new mesh after applying Quadric Edge Collapse Decimation, Meshlab crashes. It is very large models about 20-30M faces. Meshlab 2020.05 work well on Windows 11 Pro 23H2. All other versions crashed. I use Meshlab 2016 and all work well."

## 6. Additional MeshLab Issues

### GLB Import Quits Without Error

**Issue**: "MeshLab quits (crashes?) at attempt to open a .GLB file."
**Fix**: Convert GLB to GLTF or PLY in Blender. Import the converted file. Report on GitHub with the GLB file. Use 3D Viewer as alternative for GLB viewing.

### Scan Data Retopology Workflow

**Issue**: Need to repair and improve 3D scans of humans for retopology.
**Fix**: Use MeshLab for initial cleaning (remove noise shells, fill holes). Use Blender's Sculpt tools for surface smoothing. Use Blender's retopology tools for new mesh. Bake textures from old to new mesh.

### Seaweed Surface from 3D Scans

**Issue**: 3D scan surfaces look like "seaweed" — floating parts and rough surface.
**Fix**: Use MeshLab's smoothing filters. Remove disconnected components. Use Poisson reconstruction for surface reconstruction. Or use Blender's Remesh modifier.

### Combining Multiple Scans

**Issue**: Need to combine multiple partial 3D scans into one mesh.
**Fix**: Use MeshLab's Align tool to register scans. Use ICP (Iterative Closest Point) for fine alignment. Merge aligned meshes. Fill holes in the merged result.

## Best Practices

1. **Convert FBX and GLB to OBJ or PLY before importing** — avoids import crash
2. **Use PLY or OBJ for repair workflows, not STL** — preserves vertex sharing
3. **Use delete option for non-manifold repair if saving to STL** — deletions persist
4. **Keep MeshLab 2020.05 and 2016 for large meshes** — more stable for 20-30M faces
5. **Reduce mesh size before Quadric Edge Collapse Decimation** — prevents export crash
6. **Remove duplicate faces after non-manifold repair** — prevents 3D printing issues
7. **Close other applications when working with large meshes** — frees memory
8. **Use 64-bit MeshLab version** — access all available RAM
9. **Split very large meshes for processing** — reduces peak memory usage
10. **Use Blender for initial FBX/GLB import and processing** — more format compatible
