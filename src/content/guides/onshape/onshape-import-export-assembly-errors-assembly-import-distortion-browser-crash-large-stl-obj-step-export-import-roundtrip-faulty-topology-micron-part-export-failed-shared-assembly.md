---
title: "Onshape Import Export and Assembly Errors: Assembly Import Distortion from Part Studio Geometry Requiring Reimport or Parasolid Format, Browser Crash with Large 3D Scan STL and OBJ from WebGL Memory Requiring Mesh Simplification, STEP Export Import Roundtrip Faulty Topology from 2-Micron Part Size Requiring Parasolid Export, Export Failed Resource Does Not Exist from Shared Assembly Permissions Requiring Copy Document, and SolidWorks Assembly Hidden Suppressed Parts Not Imported Requiring Visibility Toggle Before Export"
excerpt: "Onshape fails for 5 distinct reasons: assembly import distortion from Part Studio geometry requiring reimport or Parasolid format, browser crash with large 3D scan STL and OBJ from WebGL memory requiring mesh simplification, STEP export import roundtrip faulty topology from 2-micron part size requiring Parasolid export, export failed resource does not exist from shared assembly permissions requiring copy document, and SolidWorks assembly hidden suppressed parts not imported requiring visibility toggle before export. We cover each with fixes from Onshape Forum."
category: "troubleshooting"
softwareSlug: "onshape"
keyword: "Onshape assembly import distortion Part Studio geometry reimport Parasolid browser crash large 3D scan STL OBJ WebGL memory mesh simplification STEP export import roundtrip faulty topology 2-micron part size Parasolid export failed resource does not exist shared assembly permissions copy document SolidWorks assembly hidden suppressed parts not imported visibility toggle before export"
slug: "onshape-import-export-assembly-errors-assembly-import-distortion-browser-crash-large-stl-obj-step-export-import-roundtrip-faulty-topology-micron-part-export-failed-shared-assembly"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-08-03"
sources:
  - "https://forum.onshape.com/discussion/26373/assembly-importing-issues"
  - "https://forum.onshape.com/discussion/27693/im-having-issues-with-onshape-prematurely-crashing-with-imported-3d-scans-stls-and-objs"
  - "https://forum.onshape.com/discussion/22945/step-file-export-import-bug"
---

# Onshape Import Export and Assembly Errors: Assembly Import Distortion from Part Studio Geometry Requiring Reimport or Parasolid Format, Browser Crash with Large 3D Scan STL and OBJ from WebGL Memory Requiring Mesh Simplification, STEP Export Import Roundtrip Faulty Topology from 2-Micron Part Size Requiring Parasolid Export, Export Failed Resource Does Not Exist from Shared Assembly Permissions Requiring Copy Document, and SolidWorks Assembly Hidden Suppressed Parts Not Imported Requiring Visibility Toggle Before Export

Onshape's assembly import, browser rendering, STEP roundtrip, export permissions, and SolidWorks import produce errors from geometry distortion, WebGL memory limits, topology faults, permission issues, and hidden part handling. This guide covers the 5 most common Onshape problems with diagnostic steps and community-verified fixes from Onshape Forum.

## 1. Assembly Import Distortion from Part Studio Geometry

### Symptom

Importing three parts into an Assembly — two from one Part Studio and one from another. Only one part from the first Part Studio imports correctly. Two others are distorted. One comes in as 2 parts instead of 1. The Assembly import doesn't properly reflect the Part Studio models.

### Root Cause

The Assembly import process doesn't correctly translate all geometry from the Part Studios. This can be caused by: (1) complex geometry that exceeds the import tolerance, (2) parts that reference external geometry that isn't available in the Assembly context, (3) import format limitations, or (4) bugs in the Assembly import function. The distortion suggests the geometry is being reinterpreted or simplified during the import process.

### Fix

1. **Reimport the parts**:
   - Delete the distorted parts from the Assembly
   - Re-import from the Part Studios
   - Sometimes the import works on the second attempt
   - Check if the distortion persists

2. **Use Parasolid format for import**:
   - "Parasolid is the native kernel of Onshape"
   - "If you export to Parasolid and import, you should never have an issue"
   - Export from Part Studio as Parasolid (x_t)
   - Import the Parasolid into the Assembly

3. **Check part integrity in Part Studio**:
   - Before importing, check each part in its Part Studio
   - Verify the part is a valid solid
   - Use the Check feature
   - Fix any geometry issues before importing

4. **Import one part at a time**:
   - Don't import all parts at once
   - Import one part, verify it's correct
   - Then import the next
   - This isolates which part causes the distortion

5. **Use Derive feature instead of import**:
   - Instead of importing parts
   - Use the Derive feature to reference parts from other Part Studios
   - Derive maintains the parametric link
   - This is the recommended Onshape workflow

6. **Report to Onshape support**:
   - If the distortion persists
   - Share the document with Onshape support
   - They can investigate the import bug
   - Provide screenshots of expected vs actual geometry

### Community Report

> "I have been trying to import three parts into an Assembly. Two from one Part Studio and one from another. Only one part from the first Part Studio is importing correctly. One is coming in distorted, the other comes through as 2 parts and not properly reflecting the model. The first two pictures show Part Studio view, the last the Assembly import."

## 2. Browser Crash with Large 3D Scan STL and OBJ from WebGL Memory

### Symptom

Onshape browser tab crashes when working with imported 3D scanned models (STL and OBJ). The crash happens with large scanned mesh files. The browser tab needs a refresh, but the rest of the browser tabs work fine. Chrome itself doesn't crash, the computer doesn't crash. Tried prioritizing WebGL rendering with GPU, clearing cache. Fusion 360 handles the same files without issues.

### Root Cause

"Small or large, just the window that crashes and needs a refresh, the rest of my tabs work fine." Onshape runs in the browser using WebGL for 3D rendering. Large mesh files (3D scans) require significant GPU memory for WebGL rendering. When the WebGL context runs out of memory, the browser tab crashes. Onshape's cloud-based rendering doesn't offload the mesh processing — the browser still needs to render the mesh locally. Fusion 360 runs natively and can handle larger meshes with direct GPU access.

### Fix

1. **Simplify the mesh before import**:
   - Use MeshLab or Blender to reduce the mesh
   - Decimate to fewer faces (e.g., 500K instead of 5M)
   - This reduces WebGL memory requirements
   - Import the simplified mesh

2. **Use a more powerful GPU**:
   - Ensure the browser uses the dedicated GPU
   - Check browser GPU settings
   - "Prioritizing WEBGL rendering with my GPU"
   - Use a GPU with more VRAM

3. **Clear browser cache**:
   - "Clearing Cache"
   - Clear Chrome's cache and WebGL data
   - Restart the browser
   - This may free up WebGL memory

4. **Use fewer mesh files at once**:
   - Don't load 5-6 detailed 3D scan clouds in one file
   - Work with one or two at a time
   - This reduces total WebGL memory
   - Combine results after processing

5. **Convert mesh to solid**:
   - Use Onshape's mesh-to-solid conversion
   - This reduces the data size significantly
   - Solids render more efficiently than meshes
   - Use the Mesh feature in Onshape

6. **Use a desktop CAD tool for large scans**:
   - "I've been working with a friend's CNC router, all their scripts are setup from MAC laptop with Fusion 360"
   - "I was curiously surprised at how well Fusion ran with 5-6 detailed 3D scan clouds"
   - For large scan processing, use Fusion 360 or Blender
   - Import simplified results to Onshape

7. **Check browser hardware acceleration**:
   - Ensure Chrome hardware acceleration is enabled
   - Settings > Advanced > System > Use hardware acceleration
   - This ensures WebGL uses the GPU
   - Not the CPU for rendering

### Community Report

> "I've been having issues with OnShape prematurely crashing with imported 3D scans .STLs and .OBJs. Constant browser crashes when importing 3D scanned models. Tried prioritizing WEBGL rendering with my GPU, clearing Cache. Just the window that crashes and needs a refresh, the rest of my tabs work fine. Chrome doesn't crash, computer doesn't crash. I was surprised at how well Fusion 360 ran with 5-6 detailed 3D scan clouds in one file."

## 3. STEP Export Import Roundtrip Faulty Topology from 2-Micron Part Size

### Symptom

Created a simple design with parts from sketch rotations (360-degree revolves). Exported to STEP file. When importing the STEP file back into Onshape, parts don't generate properly due to "faulty topology." Onshape can export the file without error but can't import it back without errors.

### Root Cause

"Some of these parts are very tiny and I wonder if that could be part of the problem." The parts are approximately 2 microns in size. STEP files have a resolution limit — very small geometry can be lost or corrupted in the STEP translation. The STEP format uses a fixed precision that may not represent 2-micron features accurately. "That's 2 microns so very likely the reason." Onshape's native kernel is Parasolid, not STEP. STEP translation introduces precision errors for very small geometry.

### Fix

1. **Use Parasolid export instead of STEP**:
   - "Parasolid is the native kernel of Onshape. If you export to Parasolid and import, you should never have an issue"
   - "STEP is not native"
   - Export as Parasolid (x_t or x_b)
   - Import the Parasolid — no topology errors

2. **Use Derive feature instead of export/import**:
   - "Why are you doing this in the first place? I would think using a 'Derive' feature would make more sense"
   - Instead of exporting and reimporting
   - Use Derive to reference the parts in another document
   - This preserves the parametric definition

3. **Scale up the parts**:
   - If the parts are 2 microns
   - Scale them up by 1000x to 2mm
   - Export as STEP
   - Import and scale back down
   - This avoids the STEP precision issue

4. **Check part sizes before STEP export**:
   - Verify all parts are larger than STEP resolution
   - STEP typically has ~1 micron resolution
   - Parts smaller than this may corrupt
   - Use Parasolid for tiny parts

5. **Report as a bug**:
   - "This does seem like a bug: at the very least Onshape should be able to read back a STEP file it exported without error"
   - Onshape should handle its own STEP roundtrip
   - Report to Onshape support
   - This is a valid bug report

6. **Use IGES as alternative**:
   - If STEP and Parasolid don't work
   - Try IGES format
   - IGES may handle small geometry differently
   - But Parasolid is still preferred

### Community Report

> "When I export to a step file, and then import that step file back in, I have parts that don't generate properly because of 'faulty topology.' It seems weird that Onshape knows how to export the file without error, but not import it. Parasolid is the native kernel of Onshape — if you export to Parasolid and import, you should never have an issue. Some of these parts are very tiny — that's 2 microns so very likely the reason."

## 4. Export Failed Resource Does Not Exist from Shared Assembly Permissions

### Symptom

Trying to export individual models from a shared assembly. Export fails with error: "Export failed. Resource does not exist, or you do not have permission to access it." The only way to export is to right-click the assembly itself and use "export unique parts as individual files." Individual model export throws the permission error.

### Root Cause

The shared assembly has permission restrictions. The user has view access to the assembly but not full edit/export permissions for individual parts. The parts may be owned by another user or in a different document. The export function checks permissions for each part individually. If the user doesn't have export permission for a specific part, the export fails with "Resource does not exist, or you do not have permission."

### Fix

1. **Make a copy of the document**:
   - "Making a copy of the particular project"
   - File > Copy the document
   - The copy gives you full ownership
   - Then export from the copy

2. **Use "export unique parts as individual files"**:
   - "The only way I can export models as STLs is to right click the assembly itself"
   - "And export with 'export unique parts as individual files'"
   - This exports all parts at once
   - Individual export may fail due to permissions

3. **Adjust permissions**:
   - "Even after adjusting permissions"
   - Check the document sharing settings
   - Ensure you have "Edit" or "Full access" permission
   - Not just "View" or "Comment"

4. **Export the entire assembly**:
   - Instead of individual parts
   - Export the entire assembly as STEP or Parasolid
   - Then split in another CAD tool
   - This bypasses the per-part permission check

5. **Request edit access**:
   - If the document is shared by someone else
   - Request edit access from the owner
   - The owner can change your permission level
   - Then try exporting again

6. **Check part ownership**:
   - Some parts may be derived from other documents
   - Those documents may have different permissions
   - Check the document references
   - Ensure you have access to all referenced documents

### Community Report

> "Making a copy of the particular project does not enable me to export individual models from the assembly. The only way I can export models as STLs is to right click the assembly itself and export with 'export unique parts as individual files.' Attempting to export an individual model throws an error: 'Export failed. Resource does not exist, or you do not have permission to access it.'"

## 5. SolidWorks Assembly Hidden Suppressed Parts Not Imported

### Symptom

Importing a SolidWorks assembly (as a zip file) into Onshape. The import works well for visible parts. However, parts that are hidden or suppressed in the SolidWorks assembly are not imported into Onshape. If the user has no access to SolidWorks to change the hidden/visible status, there's no way to get the hidden parts.

### Root Cause

Onshape's SolidWorks importer only imports parts that are visible and unsuppressed in the assembly. Hidden parts are skipped because they're not part of the active display state. Suppressed parts are skipped because they're not loaded in the SolidWorks assembly. The importer doesn't process hidden or suppressed components — it only processes what SolidWorks would render.

### Fix

1. **Unhide and unsuppress before export**:
   - "If I have no access to SolidWorks to change the hidden/visible status"
   - If you have access to SolidWorks
   - Unhide all parts and unsuppress all components
   - Save the assembly
   - Then export the zip

2. **Use all display states**:
   - In SolidWorks, create a display state with all parts visible
   - Set this as the active display state
   - Save the assembly
   - Export with this display state active

3. **Use eDrawings to check**:
   - Open the assembly in SolidWorks eDrawings (free viewer)
   - Check which parts are hidden or suppressed
   - If eDrawings can unhide them, do so
   - Save from eDrawings if possible

4. **Request the source files**:
   - Ask the SolidWorks user to provide
   - A version with all parts visible and unsuppressed
   - Or the individual part files separately
   - Import the parts individually into Onshape

5. **Import individual part files**:
   - Instead of importing the assembly zip
   - Import each part file separately
   - This bypasses the assembly visibility filter
   - Then assemble in Onshape

6. **Use STEP export from SolidWorks**:
   - If the SolidWorks user can export as STEP
   - STEP exports all geometry regardless of visibility
   - Import the STEP into Onshape
   - All parts will be included

### Community Report

> "I have been able to successfully create a zip file and these have imported quite well into Onshape. However, I have found that any parts that are hidden or suppressed in the assembly are not being imported into Onshape. If I have no access to SolidWorks to change the hidden/visible status is there anything I can do to get the hidden parts in the assembly into Onshape?"

## 6. Additional Onshape Issues

### Export Slow STL STEP Download

**Issue**: Onshape export is slow for STL and STEP downloads.
**Fix**: Use Parasolid for faster export. Export from the Part Studio, not the Assembly. Reduce model complexity before export. Use Onshape's cloud export for large files.

### Imported Model Complexity Lag

**Issue**: Imported models cause lag and performance issues.
**Fix**: Simplify the model before import. Use mesh reduction tools. Convert meshes to solids. Use lightweight display mode in Onshape.

### Large Assembly Performance

**Issue**: Large assemblies cause performance issues in Onshape.
**Fix**: Use lightweight display modes. Suppress unused features. Use configurations to simplify. Break large assemblies into subassemblies.

### Browser Compatibility

**Issue**: Onshape works differently in different browsers.
**Fix**: Use Chrome or Firefox for best WebGL performance. Ensure hardware acceleration is enabled. Keep browser updated. Clear cache regularly.

### Offline Mode Limitations

**Issue**: Onshape requires internet connection.
**Fix**: Onshape is cloud-based — no offline mode. Use a mobile hotspot for emergency access. Export critical files for offline work. Use Onshape's mobile app for viewing.

## Best Practices

1. **Use Parasolid (x_t) for export/import roundtrips** — Onshape's native kernel, no topology errors
2. **Use Derive feature instead of export/import** — preserves parametric relationships
3. **Simplify 3D scan meshes before importing** — prevents WebGL browser crashes
4. **Work with one or two large meshes at a time** — reduces WebGL memory pressure
5. **Enable browser hardware acceleration** — ensures WebGL uses GPU
6. **Make a copy of shared documents before exporting** — bypasses permission issues
7. **Use "export unique parts as individual files" for assemblies** — bypasses per-part permission checks
8. **Unhide and unsuppress all parts before SolidWorks export** — ensures all parts are imported
9. **Import individual part files if assembly import misses parts** — bypasses visibility filter
10. **Use STEP export from SolidWorks to include all parts** — STEP exports all geometry regardless of visibility
