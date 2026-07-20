---
title: "Onshape Export Slow and STL File Problems: Mesh Quality, File Size, and Browser Settings"
excerpt: "Exporting STL or STEP files from Onshape takes minutes or fails entirely. We cover the mesh density settings, browser cache clearing, and the API export method that bypasses UI performance issues."
category: "troubleshooting"
softwareSlug: "onshape"
keyword: "Onshape export slow STL STEP file download problem"
slug: "onshape-export-slow-stl-step-download-fix"
author: "CADGuide Tools Editorial Team"
readTime: "8 min"
date: "2025-06-25"
sources:
  - "https://forum.onshape.com/discussion/19259/lets-solve-the-speed-issue"
  - "https://forum.onshape.com/discussion/26524/slow-performance-in-assemblies-with-a-lot-of-parts"
  - "https://forum.onshape.com/discussion/20347/imported-model-complexity-versus-performance-lag"
---

# Onshape Export Slow and STL File Problems: Mesh Quality, File Size, and Browser Settings

A user on the Onshape forum reported that exporting an STL part took 5 minutes just to open the export dialog. Another user reported that importing parts into an assembly or going through menus took forever. These performance issues are common in Onshape when working with complex models, and they affect the export workflow because the export dialog must load the full model geometry before presenting options.

## Understanding Onshape Export Performance

Onshape exports are processed in the cloud, not locally. When you click **Export**, Onshape's servers:

1. Load the full document from cloud storage
2. Process the geometry (tessellate for STL, convert to STEP/IGES)
3. Package the file
4. Send it to your browser for download

The bottleneck is usually step 2 — processing complex geometry. For a model with 500,000 triangles, the STL export can take several minutes. For STEP exports, the conversion from Onshape's internal format to STEP AP242 format is CPU-intensive.

Additionally, the export dialog itself can be slow because it queries the model for available parts and configurations.

## Fix 1: Reduce STL Mesh Density

The STL export dialog offers mesh quality settings that directly affect file size and export time:

1. **File → Export → STL**
2. In the export dialog, set:
   - **Units**: Millimeters (standard for 3D printing)
   - **Quality**: 
     - **Coarse**: Minimum triangles, fastest export, largest facets
     - **Medium**: Balanced for most 3D printing
     - **Fine**: Small facets, slow export, best surface finish
     - **Custom**: Manual control
3. For **Custom** settings:
   - **Angular tolerance**: 30° (coarse) to 5° (fine)
   - **Chord tolerance**: 0.1mm (coarse) to 0.01mm (fine)
   - **Max facet width**: 1mm (coarse) to 0.1mm (fine)

### Recommended Settings by Use Case

| Use Case | Quality | Angular Tolerance | Chord Tolerance |
|----------|---------|-------------------|-----------------|
| Prototype 3D print | Coarse | 30° | 0.1mm |
| Functional part | Medium | 15° | 0.05mm |
| Visual model | Fine | 5° | 0.01mm |
| FDM printing | Medium | 15° | 0.05mm |
| SLA printing | Fine | 10° | 0.02mm |

### Impact on Export Time

- **Coarse**: 10-30 seconds for most models
- **Medium**: 30-60 seconds
- **Fine**: 1-5 minutes
- **Custom (very fine)**: 5-15 minutes

## Fix 2: Export Individual Parts Instead of Assemblies

1. In the part studio, export individual parts rather than the entire assembly
2. Select only the parts you need: **File → Export → STL → Selected parts only**
3. Fewer parts = less geometry to process = faster export
4. Use a 3D printing slicer to combine multiple STL files if needed

## Fix 3: Clear Browser Cache

Onshape runs in the browser, and cached data can slow down the export dialog:

### Chrome/Edge

1. Press **Ctrl+Shift+Delete**
2. Select **Cached images and files**
3. Set time range to **All time**
4. Click **Clear data**
5. Refresh the Onshape tab (Ctrl+R)

### Firefox

1. Press **Ctrl+Shift+Delete**
2. Select **Cache**
3. Set time range to **Everything**
4. Click **Clear Now**
5. Refresh the Onshape tab

### After Clearing Cache

Onshape will re-download the model geometry, which may take a few seconds on first load. But subsequent operations, including export, should be faster.

## Fix 4: Use a Different Browser

1. **Chrome**: Generally the best performance with Onshape
2. **Edge**: Also Chromium-based, similar performance to Chrome
3. **Firefox**: Works but may be slower for export operations
4. **Safari**: Known to have WebGL and performance issues with Onshape

If you're using Safari or Firefox and experiencing slow exports, switch to Chrome or Edge.

## Fix 5: Check Network Speed

Export operations require downloading the processed file from Onshape's servers:

1. Run a speed test (speedtest.net)
2. **Minimum**: 10 Mbps download for STL files under 50MB
3. **Recommended**: 50+ Mbps for large STL or STEP files
4. If on Wi-Fi, try a wired connection
5. If using a VPN, disconnect during export
6. Try a different network (mobile hotspot) to rule out network-specific issues

## Fix 6: Use Onshape API for Automated Export

For repeated exports, use the Onshape API to bypass the UI entirely:

```python
import requests

api_key = "your_api_key"
document_id = "your_document_id"
workspace_id = "your_workspace_id"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Accept": "application/json"
}

# Export part as STL
url = f"https://cad.onshape.com/api/v6/partstudios/d/{document_id}/w/{workspace_id}/stl"
params = {
    "mode": "text",
    "units": "millimeter",
    "angularTolerance": 15,
    "chordTolerance": 0.05
}

response = requests.get(url, headers=headers, params=params)
with open("export.stl", "wb") as f:
    f.write(response.content)
```

### Benefits

- No UI overhead — the export runs directly on Onshape's servers
- Can be scripted for batch exports
- Faster than the UI export for large models
- Can be scheduled to run during off-hours

### Getting an API Key

1. Go to **Onshape → Account → API Keys**
2. Click **Create API key**
3. Copy the key (it's shown only once)
4. Store it securely — don't commit it to version control

## Fix 7: Export as STEP Instead of STL for CAD Interchange

If you need to transfer geometry to another CAD system:

1. **File → Export → STEP**
2. STEP files preserve exact geometry (NURBS surfaces), not tessellated meshes
3. STEP file size is typically smaller than STL for the same model
4. STEP export is often faster than STL because no tessellation is needed
5. Use STEP for CAD-to-CAD transfer
6. Use STL only for 3D printing

## Fix 8: Split Large Models Before Export

If the model is too complex for a single export:

1. Create a **Configuration** that splits the model into sections
2. Export each section separately
3. Combine the exported files in your target application
4. For STL files, use a slicer to merge multiple STLs
5. For STEP files, import each STEP into the target CAD system and assemble

## Fix 9: Export from a Simplified Configuration

1. Create a "Simplified" configuration with suppressed features
2. Switch to the Simplified configuration before exporting
3. The export processes less geometry, so it's faster
4. For STL exports, simplified geometry produces smaller files
5. For STEP exports, simplified geometry has fewer surfaces, which imports faster into other CAD systems

## Fix 10: Use Onshape's App Store for Specialized Export

Onshape's App Store has third-party apps for specialized export:

1. Go to **App Store** in Onshape
2. Search for export tools:
   - **MBD**: For model-based definition exports
   - **KeyShot**: For rendering exports
   - **SimScale**: For simulation mesh exports
3. These apps handle the export on their own servers, offloading processing from Onshape

## Summary

| Fix | Impact | Difficulty |
|-----|--------|------------|
| Reduce STL mesh density | Very high | Easy |
| Export individual parts | High | Easy |
| Clear browser cache | Medium | Easy |
| Use Chrome/Edge | Medium | Easy |
| Check network speed | Medium | Easy |
| Use Onshape API | Very high | Hard |
| Export as STEP | High | Easy |
| Split large models | High | Medium |
| Export from simplified config | High | Easy |

The most impactful fix is reducing STL mesh density — use Coarse or Medium quality for most 3D printing applications. If the export dialog itself is slow (not the export process), clearing the browser cache and using Chrome or Edge will help. For frequent exports, the Onshape API is the fastest method, bypassing the UI entirely.
