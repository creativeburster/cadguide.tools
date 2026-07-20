---
title: "Enscape Asset Library and Custom Asset Import: Missing Assets, Port Forwarding, and 3D Model Preparation"
excerpt: "Enscape's Asset Library fails to load, custom imported assets look wrong, or assets disappear after updates. We cover the network configuration, asset cache repair, and the custom asset preparation workflow for SketchUp and Revit."
category: "deployment"
softwareSlug: "enscape"
keyword: "Enscape asset library not loading custom asset import fix"
slug: "enscape-asset-library-custom-import-fix"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-06-25"
sources:
  - "https://support.chaos.com/hc/en-us/articles/25269133960209-What-do-I-do-if-Enscape-is-crashing"
  - "https://documentation.chaos.com/space/ESKETCHUP/128031543/Rendering+Quality+in+Enscape"
---

# Enscape Asset Library and Custom Asset Import: Missing Assets, Port Forwarding, and 3D Model Preparation

The Enscape Asset Library is one of the features that makes Enscape so popular — you can drop trees, people, furniture, and vehicles into your scene with a single click. But when the library fails to load, or when custom imported assets look wrong, it blocks the entire workflow. We've dealt with both issues across multiple firms and developed reliable solutions.

## Issue 1: Asset Library Won't Load

The Asset Library panel opens but shows a loading spinner indefinitely, or it displays an empty library with no assets.

**Fix 1 — Check network connectivity**:
The Enscape Asset Library downloads assets from Chaos's servers. If your network blocks the connection, the library can't load.

1. Check if you can access `https://enscape3d.com` in a web browser
2. If the site is blocked by a corporate firewall, ask IT to whitelist the following domains:
   - `*.enscape3d.com`
   - `*.chaas.com`
   - `*.chaosgroup.com`
3. Check proxy settings: **Windows Settings → Network & Internet → Proxy** — if a proxy is configured, ensure Enscape can use it
4. VPN users: disconnect from the VPN temporarily and try loading the library — if it works, the VPN is blocking the connection

**Fix 2 — Clear asset cache**:
1. Close Enscape and the host application
2. Navigate to `C:\Users\[username]\AppData\Local\Enscape\AssetLibrary`
3. Delete the entire `AssetLibrary` folder
4. Restart the host application and open Enscape
5. The Asset Library will re-download its catalog — this may take a few minutes

We clear the asset cache monthly on all workstations. The cache can become corrupted over time, especially after Enscape updates, causing assets to fail to load or display incorrectly.

**Fix 3 — Check Enscape account sign-in**:
Some Enscape versions require you to be signed in to your Chaos account to access the full Asset Library:
1. In Enscape, go to **Settings → Account**
2. Verify you're signed in
3. If not, sign in with your Chaos account credentials
4. Restart Enscape and check the Asset Library

## Issue 2: Assets Appear as White Boxes or Silhouettes

Assets from the library load but appear as white boxes, silhouettes, or low-resolution placeholders instead of the full 3D model.

**Fix — wait for full download**:
Enscape downloads assets on-demand. When you first place an asset, it may appear as a placeholder while the full model downloads. Wait 10-30 seconds for the download to complete. If the asset doesn't resolve:

1. Check your internet connection speed — large assets (vehicles, detailed trees) can be 50MB+
2. Clear the asset cache (see above) and try again
3. If you're on a slow connection, pre-download assets: In the Asset Library, click the **Download** icon on assets you plan to use. This downloads them to your local cache before you need them

## Issue 3: Custom Asset Import — Model Appears Incorrectly

Enscape allows importing custom 3D models as assets. But imported models often appear with incorrect scale, missing materials, or wrong orientation.

**Fix — prepare the model correctly before import**:

### Scale
1. Enscape expects models in **meters** by default
2. If your model was created in inches (SketchUp default) or millimeters (Revit default), scale it accordingly
3. In SketchUp, check the model units: **Window → Model Info → Units**
4. A person model should be approximately 1.7-1.8 meters tall — use this as a reference to verify scale

### Materials
1. Enscape supports materials from the source application — SketchUp materials and Revit materials transfer through
2. Apply materials before importing — don't rely on Enscape's material editor for custom assets
3. Use simple materials (color + texture) — complex multi-layer materials may not transfer correctly
4. Test the model in Enscape after import and adjust materials as needed

### Orientation
1. Enscape expects the model's "up" direction to be the **Z-axis** (for SketchUp) or **Y-axis** (for Revit)
2. If the model appears sideways or upside down, rotate it in the source application before exporting
3. For SketchUp models: ensure the model is upright in the SketchUp viewport before exporting
4. For FBX/OBJ imports: check the **Up Axis** setting in the export dialog

### Polygon Count
1. Keep custom assets under **50,000 polygons** for performance
2. High-poly assets (100K+ polygons) will slow down Enscape significantly
3. Use the **Simplify** plugin in SketchUp or **PolyReduce** in other applications to reduce polygon count
4. For trees and vegetation, use alpha-card textures instead of geometry for leaves

## Issue 4: Custom Asset Import Workflow

Here's the workflow we use for importing custom assets into Enscape:

### From SketchUp
1. Create or download the model in SketchUp
2. Apply materials and ensure correct scale
3. Select the model geometry
4. Right-click → **Make Component**
5. Name the component descriptively
6. In Enscape, use the **Import** function to bring the component into the Asset Library
7. Assign a category and tags for easy searching

### From Revit
1. Create or import the model as a Revit family
2. Ensure materials are applied in the family editor
3. Load the family into the project
4. In Enscape, the family should appear automatically
5. For custom Enscape assets: export the family as FBX, then import through Enscape's asset import tool

### From External 3D Files (FBX, OBJ)
1. Enscape supports importing FBX and OBJ files as custom assets
2. Prepare the model in your 3D application (3ds Max, Blender, etc.)
3. Export as FBX with embedded textures
4. In Enscape, go to **Asset Library → Custom Assets → Import**
5. Select the FBX file
6. Verify scale, materials, and orientation after import
7. Adjust as needed using Enscape's asset editing tools

## Issue 5: Assets Disappear After Enscape Update

After updating Enscape to a new version, previously placed custom assets disappear from the project.

**Fix**:
1. Custom assets are stored in the Enscape cache directory
2. Updates can reset this directory
3. Before updating Enscape, back up the custom assets folder:
   `C:\Users\[username]\AppData\Local\Enscape\AssetLibrary\Custom`
4. After the update, restore the backed-up folder
5. Re-import any assets that still don't appear

**Prevention**: We maintain a shared network folder of all custom assets. After any Enscape update, we re-import from this shared folder, which takes about 10 minutes and ensures all custom assets are available.

## Issue 6: Asset Library Performance Impact

Placing too many assets from the library can cause performance issues, especially with high-poly assets like trees and vehicles.

**Our guidelines**:
- **Trees**: Limit to 50-100 per scene. Use 2D billboard trees for distant areas
- **People**: Limit to 20-30 per scene. Use low-poly versions for background figures
- **Vehicles**: Limit to 10-15 per scene. Each vehicle can be 20,000+ polygons
- **Furniture**: Limit to what's visible in the render. Don't populate rooms that aren't in view

**Optimization**: Enscape's assets come in different LOD (Level of Detail) versions in some cases. Use the low-poly version for distant assets and the high-poly version for foreground assets.

## Best Practices for Asset Management

1. **Pre-download assets**: Download all assets you plan to use before starting a project session
2. **Organize custom assets**: Use descriptive names and categories for custom assets
3. **Back up custom assets**: Keep a separate backup of all custom asset files
4. **Monitor polygon count**: Keep track of total asset polygon count in the scene
5. **Use Enscape's asset categories**: Tag assets correctly so team members can find them
6. **Clear cache quarterly**: Delete the asset cache folder every 3-4 months to prevent corruption
7. **Test after updates**: After any Enscape update, verify that both library assets and custom assets still work

## Summary

Enscape Asset Library issues are usually caused by network restrictions, cache corruption, or incorrect custom asset preparation. Our fix order: check network connectivity and firewall → clear asset cache → verify account sign-in → prepare custom assets with correct scale, materials, and orientation → back up custom assets before updates. For custom imports, always prepare the model in the source application (correct units, applied materials, reasonable polygon count) before bringing it into Enscape.
