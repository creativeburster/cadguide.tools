---
title: "ZBrush to 3ds Max and Blender Export: GoZ, FBX, and Displacement Map Workflow"
excerpt: "Moving sculpts from ZBrush to 3ds Max or Blender requires correct export settings, UV preparation, and displacement map configuration. I cover the GoZ setup, manual FBX export, and the displacement map pipeline that preserves every detail."
category: "migration"
softwareSlug: "zbrush"
keyword: "ZBrush export 3ds Max Blender GoZ FBX displacement map"
slug: "zbrush-export-3dsmax-blender-goz-displacement"
author: "CAD IT Admin"
readTime: "10 min"
date: "2025-06-24"
sources:
  - "https://support.maxon.net/hc/en-us/sections/7945420814748-ZBrush-Troubleshooting-Topics"
  - "https://vagon.io/blog/most-common-zbrush-problems-how-to-fix-them-for-a-smoother-sculpting-experience"
---

# ZBrush to 3ds Max and Blender Export: GoZ, FBX, and Displacement Map Workflow

The handoff between ZBrush and the rendering application is where I see the most pipeline failures. A sculpt looks perfect in ZBrush, but after export to 3ds Max or Blender, the detail is gone, the UVs are mangled, or the displacement maps don't line up. I've spent years refining this workflow, and I'm going to share the exact process I use for every character and prop that goes through our pipeline.

## Method 1: GoZ (Fastest, Best for Iteration)

GoZ is ZBrush's one-click export system. When configured correctly, it sends your model directly to 3ds Max, Maya, Blender, or other supported applications with UVs, materials, and textures intact.

**Setting up GoZ for 3ds Max**:
1. In ZBrush, go to **Preferences → GoZ → Path to 3ds Max**
2. Browse to your 3ds Max executable: `C:\Program Files\Autodesk\3ds Max 202x\3dsmax.exe`
3. Click **Automatic Update** to register GoZ with 3ds Max
4. In 3ds Max, you should see a "GoZ" menu or ribbon appear after registration

**Using GoZ**:
1. Select the SubTool you want to export
2. Click **GoZ** in the Tool palette
3. Choose 3ds Max from the application list
4. The model appears in 3ds Max as an editable poly with materials applied

**GoZ limitations**: GoZ exports the current subdivision level, not the highest. If you're at subdivision level 1, you get a low-poly model. Always step up to your highest subdivision level (using **D** key) before clicking GoZ if you want full detail.

GoZ is best for quick iteration — sending a model back and forth between ZBrush and 3ds Max to check proportions, lighting, or composition. For final asset delivery, I use the manual export method with displacement maps.

## Method 2: Manual FBX/OBJ Export with Displacement Maps

This is the production workflow I use for final asset delivery. It produces a low-poly mesh with displacement and normal maps that recreate the full ZBrush detail at render time.

### Step 1: UV Unwrap at a Low Subdivision Level

UVs must be created before baking maps. I unwrap at subdivision level 2 or 3 — high enough that the UV seams are in good positions, low enough that the unwrap operation is fast.

1. Step down to subdivision level 2 or 3 (**Shift+D**)
2. Use **Tool → UV Map → Create** for automatic UVs, or
3. Use **ZPlugin → UV Master** for more control (enable **Symmetry** if the model is symmetrical)
4. Check the UV map by clicking **Tool → UV Map → Check UV** — look for overlapping UVs and fix them

### Step 2: Bake Displacement Map

1. Step up to the highest subdivision level (**D** repeatedly)
2. Go to **Tool → Displacement Map**
3. Set **DPSubPix** to 2 (higher values give sharper detail but larger maps)
4. Set **Map Size** to 4096 (or 8192 for hero assets)
5. Set **Adaptive Size** to 50 (adjusts the map resolution to the UV island size)
6. Click **Create DisplacementMap**
7. The displacement map appears in the **Alpha** palette — export it as a TIFF or EXR

**Important settings**:
- **Mode**: I use **Flip V** for 3ds Max (3ds Max's V-Ray expects flipped V coordinates). For Blender, leave Flip V unchecked.
- **Smooth UV**: Enable this if your UVs have visible seams — it smooths the displacement across seam boundaries

### Step 3: Bake Normal Map

1. Still at the highest subdivision level
2. Go to **Tool → Normal Map**
3. Set **Map Size** to match the displacement map (4096 or 8192)
4. Enable **Tangent** for most rendering applications
5. Enable **Smooth UVs** if you used it for displacement
6. Click **Create NormalMap**
7. Export the normal map from the **Texture** palette

### Step 4: Export the Low-Poly Mesh

1. Step down to the subdivision level where you created UVs (level 2 or 3)
2. Go to **Tool → Export**
3. Choose **OBJ** for 3ds Max or **FBX** for Blender/Unreal
4. Enable **Grp** (preserve polygroups) if you want to maintain organization
5. Disable **Mrg** (merge) if you want separate objects per polygroup

The exported mesh is now your low-poly base — typically 5,000 to 50,000 polygons depending on the asset.

### Step 5: Set Up in 3ds Max with V-Ray

1. Import the OBJ into 3ds Max
2. Apply a **V-Ray Displacement Modifier** to the mesh
3. Load the displacement map (TIFF or EXR) into the displacement slot
4. Set **Amount** to 1.0 initially — adjust based on the result (I typically end up between 0.3 and 2.0)
5. Set **Edge Length** to 4 (lower values give more subdivision at render time but slower renders)
6. Apply the normal map in the material's **Bump** slot with the V-Ray Normal Map node

**Common issue — displacement direction**: If the displacement pushes inward instead of outward, check the **Channel** setting in the V-Ray Displacement Modifier. I set it to **2D (Landscape)** for most character work. If the displacement looks inverted, swap the black and white values in the output curve.

### Step 6: Set Up in Blender

1. Import the OBJ/FBX into Blender
2. Add a **Subdivision Surface** modifier (set to Adaptive or Simple)
3. Add a **Displacement** modifier with the displacement texture
4. In the material, connect the normal map to the **Normal** input via a **Normal Map** node set to **Tangent Space**

**Blender-specific note**: Blender's displacement works differently from V-Ray. For Cycles, you need to enable **Experimental** feature set in the render settings, then set the displacement mode to **Both** (Vertex + Adaptive). For Eevee, displacement is not supported at render time — use only the normal map.

## Method 3: Decimation for 3D Printing

For 3D printing, you need a single solid mesh, not displacement maps. The workflow is different:

1. Merge all visible SubTools: **Tool → SubTool → Merge Visible**
2. Run **ZPlugin → Decimation Master → Pre-process Current**
3. Set the target polygon count based on your printer (typically 500K-1M for resin, 100K-300K for FDM)
4. Click **Decimate Current**
5. Check the model for holes using **Tool → Geometry → Modify Topology → Check Mesh**
6. Export as STL or OBJ

**Common 3D printing export issue**: The model has holes or non-manifold geometry. Run **Tool → Geometry → Modify Topology → Close Holes** before exporting. If the model still fails to print, use a mesh repair tool like Netfabb or Meshmixer to fix remaining issues.

## Troubleshooting Common Export Problems

**Problem**: Displacement map looks blocky or pixelated in render
**Fix**: Increase the map size to 8192x8192, or increase the **Edge Length** subdivision in your renderer. Also check that the displacement map is loaded as a 16-bit or 32-bit image, not 8-bit.

**Problem**: Normal map seams visible on the model
**Fix**: Enable **Smooth UVs** when baking the normal map in ZBrush. In your renderer, enable **Mipmap** filtering on the normal map texture.

**Problem**: Model imports at wrong scale
**Fix**: ZBrush exports in centimeters by default. In 3ds Max, use **Customize → Units Setup** and set the system unit to centimeters. In Blender, set the unit scale to 0.01 in the scene properties.

**Problem**: UVs are mangled after export
**Fix**: Always UV unwrap at a low subdivision level and export at that same level. Exporting at a higher subdivision level can distort UVs because the vertex positions change.

## Summary

The ZBrush-to-renderer pipeline has two modes: GoZ for quick iteration, and manual export with displacement/normal maps for final delivery. The key steps: UV unwrap at low subdivision → bake displacement and normal maps at highest subdivision → export low-poly mesh → configure displacement in your renderer. Get these steps right and your rendered model will match your ZBrush sculpt pixel-for-pixel.
