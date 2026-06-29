---
title: "KeyShot Import from SolidWorks, Rhino, and Creo: LiveLinking, Geometry Quality, and Material Transfer"
excerpt: "Importing CAD models into KeyShot produces missing faces, incorrect materials, or broken LiveLinking. I cover the import format selection, LiveLinking setup for each CAD application, and the geometry repair workflow for problematic imports."
category: "migration"
softwareSlug: "keyshot"
keyword: "KeyShot import SolidWorks Rhino Creo LiveLinking geometry fix"
slug: "keyshot-import-solidworks-rhino-creo-livelinking-fix"
author: "CAD IT Admin"
readTime: "10 min"
date: "2025-06-24"
sources:
  - "https://support.keyshot.com/en/knowledge-base/slow-real-time-rendering"
  - "https://support.keyshot.com/en/knowledge-base/keyshot-lags-or-is-unresponsive"
  - "https://manuals.keyshot.com/kss2026/en-us/manual/Nvidia-Requirements.htm"
---

# KeyShot Import from SolidWorks, Rhino, and Creo: LiveLinking, Geometry Quality, and Material Transfer

I work with industrial designers who use SolidWorks, Rhino, and Creo alongside KeyShot. The import process seems simple — just export a file and open it in KeyShot — but the details determine whether you get a clean model with materials or a broken mess with missing faces and default gray surfaces. I've refined this workflow across hundreds of product visualization projects.

## Import Format Selection

KeyShot supports many import formats, but they're not all equal:

### Native CAD Formats (Best Quality)
- **SolidWorks (.sldprt, .sldasm)**: Direct import via KeyShot's SolidWorks importer — preserves materials, assembly structure, and configurations
- **Rhino (.3dm)**: Native import — preserves materials and layers
- **Creo (.prt, .asm)**: Native import via KeyShot's Creo importer — preserves materials and assembly structure
- **IGES (.igs, .iges)**: Good for surface geometry but loses materials
- **STEP (.stp, .step)**: Good for solid geometry but loses materials

### Interchange Formats (Fallback)
- **FBX (.fbx)**: Preserves materials and geometry but may lose CAD-precision surfaces
- **OBJ (.obj)**: Preserves geometry and basic materials but loses advanced material properties
- **STL (.stl)**: Geometry only, no materials — triangulated mesh, not recommended for rendering

**My recommendation**: Always use the native format first. Only fall back to STEP/IGES if the native format fails, and use FBX/OBJ only as a last resort.

## LiveLinking Setup

LiveLinking is KeyShot's real-time sync feature — you change the model in the CAD application and it updates in KeyShot without re-importing. This is transformative for the design iteration workflow.

### SolidWorks LiveLinking
1. Install the **KeyShot for SolidWorks** plugin
2. In SolidWorks, go to the **KeyShot tab** in the ribbon
3. Click **Render** to send the model to KeyShot
4. Click **Update** after making changes in SolidWorks — KeyShot updates automatically
5. Materials assigned in KeyShot are preserved across updates (matched by part name)

**Common issue — LiveLinking stops updating**:
1. Check that both SolidWorks and KeyShot are running
2. In SolidWorks, go to **KeyShot tab → Settings** and verify the connection
3. If the connection is lost, click **Render** again to re-establish it
4. Ensure the SolidWorks model is saved before clicking Update

### Rhino LiveLinking
1. Install the **KeyShot for Rhino** plugin
2. In Rhino, go to the **KeyShot menu**
3. Click **Render** to send the model to KeyShot
4. Click **Update** after changes

**Common issue — materials not transferring from Rhino**:
1. In Rhino, ensure materials are assigned to layers, not individual objects
2. Check that material names in Rhino don't contain special characters
3. If materials still don't transfer, assign them manually in KeyShot after import

### Creo LiveLinking
1. Install the **KeyShot for Creo** plugin
2. In Creo, go to the **KeyShot tab**
3. Click **Render** to send the model
4. Click **Update** after changes

**Common issue — assembly structure not preserved**:
1. Ensure the Creo assembly is fully resolved (not simplified)
2. Check that all components are active, not suppressed
3. If the structure is still wrong, export as STEP and import manually

## Common Import Issue 1: Missing Faces or Holes

The model imports with missing faces, holes, or gaps in the geometry.

**Root cause**: The CAD model has surface errors — non-manifold edges, self-intersecting surfaces, or gaps between surfaces. KeyShot's tessellation process exposes these errors.

**Fix in the CAD application**:
- **SolidWorks**: Run **Import Diagnostics** (Tools → Import Diagnostics) to find and fix surface errors
- **Rhino**: Use **ShowEdges** (Analyze → Edge Tools → ShowEdges) to identify naked edges and non-manifold edges, then fix with **MergeEdge** or **JoinEdge**
- **Creo**: Use **Geometry Checks** in the model tree to identify and fix surface errors

**Fix in KeyShot**: If the CAD model can't be fixed, KeyShot's tessellation settings can sometimes hide the issue:
1. Select the imported model in the Scene tab
2. Go to **Properties → Mesh**
3. Increase **Tessellation Quality** to High
4. Enable **Merge Vertices** to close small gaps
5. Re-import the model with these settings

## Common Import Issue 2: Materials Missing or Gray

The model imports with default gray materials instead of the colors assigned in the CAD application.

**Fix**:
1. Check the import format — native formats preserve materials, STEP/IGES do not
2. For SolidWorks: ensure materials are assigned in the SolidWorks part/assembly, not just in the display state
3. For Rhino: ensure materials are assigned to layers
4. For Creo: ensure materials are assigned to parts, not just appearances

**If materials are still missing after using native format**:
1. In KeyShot, go to **Edit → Preferences → Import**
2. Check **Import Materials** is enabled
3. Re-import the model

**Manual material assignment**: If materials simply won't transfer, assign them manually in KeyShot. Use the **Material Wizard** to quickly apply PBR materials that match the intended appearance. This is more work but gives better results than CAD-transferred materials, since KeyShot's PBR materials are more advanced than CAD application materials.

## Common Import Issue 3: Model at Wrong Scale

The model imports at the wrong size — either too large or too small.

**Fix**:
1. Check the CAD application's units: SolidWorks (Tools → Options → Document Properties → Units), Rhino (File → Properties → Units), Creo (File → Prepare → Model Properties → Units)
2. In KeyShot's import dialog, check **Scene Units** — set it to match the CAD application's units
3. If the model is still wrong scale after import, use **Scene tab → Model → Scale** to adjust

**Common scale issue**: SolidWorks uses inches by default in the US, while KeyShot defaults to millimeters. A 10-inch part imports as 10mm — 25.4x too small. Always verify the scale after import by measuring a known dimension.

## Common Import Issue 4: Excessive Polygon Count

The model imports with too many polygons, making KeyShot slow and unresponsive.

**Fix**:
1. In KeyShot's import dialog, adjust **Tessellation Quality**:
   - **Low**: Fewer polygons, faster but less smooth curves
   - **Medium**: Balanced (default)
   - **High**: More polygons, smoother but slower
2. For most product renders, **Medium** is sufficient — only use High for close-up detail shots
3. After import, check the polygon count in **Scene tab → Model → Properties** — if it's above 2 million, reduce tessellation quality

**For SolidWorks specifically**: In the SolidWorks KeyShot plugin settings, set **Image Quality** to **Draft** for test renders and **High** only for final renders. Draft quality produces fewer polygons and imports faster.

## Common Import Issue 5: Assembly Structure Lost

The model imports as a single object instead of an assembly with individual parts.

**Fix**:
1. Use native format import (.sldasm, .3dm, .asm) — these preserve assembly structure
2. In KeyShot's import dialog, check **Import as Assembly** (not as single mesh)
3. For STEP files: the assembly structure may be lost — use native format instead

**Why this matters**: Without assembly structure, you can't assign different materials to different parts, and you can't hide individual components. Always preserve the assembly structure for product visualization.

## Best Practices for CAD-to-KeyShot Workflow

1. **Use native formats**: Always import directly from SolidWorks, Rhino, or Creo using native formats
2. **Set up LiveLinking**: Install the appropriate KeyShot plugin for your CAD application and use LiveLinking for iteration
3. **Clean the CAD model first**: Run geometry diagnostics in the CAD application before importing
4. **Assign materials in CAD for transfer**: Use simple color materials in CAD as placeholders, then apply PBR materials in KeyShot
5. **Verify scale after import**: Measure a known dimension to confirm correct scale
6. **Use Medium tessellation**: For most renders, Medium quality gives the best balance of geometry quality and performance
7. **Keep the assembly structure**: Import as assembly, not as single mesh — you need individual parts for material assignment and visibility control
8. **Save KeyShot materials to library**: Once you've applied PBR materials in KeyShot, save them to your material library for reuse on future projects

## Summary

KeyShot import quality depends on format selection and CAD model preparation. My workflow: use native format import → set up LiveLinking for iteration → run geometry diagnostics in CAD before export → verify scale after import → use Medium tessellation for balance → preserve assembly structure → apply PBR materials in KeyShot → save to material library. The native format import and LiveLinking setup together eliminate 90% of import issues I encounter.
