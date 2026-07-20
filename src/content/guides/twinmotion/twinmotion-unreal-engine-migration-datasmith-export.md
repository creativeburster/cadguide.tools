---
title: "Twinmotion to Unreal Engine Migration: Datasmith Export, Material Conversion, and Scene Setup"
excerpt: "Moving Twinmotion scenes to Unreal Engine for VR, film, or interactive applications requires correct Datasmith export settings, material conversion, and lighting setup. I cover the export workflow, Twinmotion-to-UE material translation, and the collision and navigation mesh configuration."
category: "migration"
softwareSlug: "twinmotion"
keyword: "Twinmotion Unreal Engine migration Datasmith export workflow"
slug: "twinmotion-unreal-engine-migration-datasmith-export"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-24"
sources:
  - "https://dev.epicgames.com/documentation/en-us/twinmotion/path-tracer-requirements-for-twinmotion"
  - "https://dev.epicgames.com/documentation/en-us/twinmotion/optimizing-geometry-with-nanite-in-twinmotion"
  - "https://resources.imaginit.com/support-blog/revit-to-twinmotion-compatibility-guide"
---

# Twinmotion to Unreal Engine Migration: Datasmith Export, Material Conversion, and Scene Setup

I've migrated several architectural visualization projects from Twinmotion to Unreal Engine — typically when a client wants to go beyond static renders into VR walkthroughs, interactive configurators, or film-quality cinematics. Twinmotion is built on Unreal Engine technology, so the migration path is smoother than from other applications, but there are still specific steps and gotchas I've learned through trial and error.

## Why Migrate from Twinmotion to Unreal Engine?

Twinmotion excels at quick architectural visualization, but Unreal Engine offers capabilities Twinmotion doesn't:

- **VR walkthroughs** with proper collision and navigation
- **Blueprint visual scripting** for interactive elements (doors that open, lights that toggle)
- **Cinematic sequences** with camera animation and object movement
- **Custom shaders** for advanced material effects
- **Pixel Streaming** for web-based real-time presentations
- **Lumen and Nanite** at full Unreal Engine capability (more configurable than Twinmotion's implementation)

## Step 1: Export from Twinmotion

Twinmotion doesn't have a direct "Export to Unreal Engine" button, but since both use Datasmith technology, the workflow is:

1. In Twinmotion, go to **File → Export**
2. Choose **Datasmith (.udatasmith)** as the format
3. Select a destination folder with enough disk space (Datasmith files can be several GB for large scenes)
4. In the export options:
   - **Geometry**: Export all visible geometry
   - **Materials**: Export material assignments (textures are embedded)
   - **Lights**: Export light positions and settings
   - **Camera**: Export current camera position
5. Click Export and wait for the process to complete

**Important**: Twinmotion's PBR materials are exported as texture maps (albedo, normal, roughness), not as Unreal Engine material instances. You'll need to convert them in Unreal Engine.

## Step 2: Import into Unreal Engine

1. Open Unreal Engine 5.4 or later
2. Install the **Datasmith Importer** plugin: Edit → Plugins → search "Datasmith" → enable → restart
3. Go to **File → Import Datasmith**
4. Browse to the `.udatasmith` file exported from Twinmotion
5. In the import options:
   - **Import Material**: Enabled
   - **Import Light**: Enabled
   - **Import Camera**: Enabled
   - **Static Mesh Options**: Set to **Nanite** if you have high-poly geometry
6. Click Import

The Datasmith importer creates a new level with all geometry, materials, and lights from Twinmotion. The scene structure is preserved — objects are organized in folders matching Twinmotion's Scene Graph hierarchy.

## Step 3: Material Conversion

Twinmotion's materials import as Unreal Engine materials with basic texture connections. They work, but they don't take full advantage of UE's material system.

**What imports correctly**:
- Albedo/base color textures
- Normal maps
- Roughness maps
- Metallic values

**What needs manual setup**:
- **Twinmotion weathering effects**: These don't transfer — you need to recreate them using UE material functions
- **Twinmotion decal materials**: Import as standard materials without decal properties — reconfigure as Decal materials in UE
- **Twinmotion glass materials**: Import with basic transparency — add refraction and IOR settings in UE for realistic glass
- **Twinmotion emissive materials**: Import with emissive color but without bloom — enable bloom in UE post-processing

**My material conversion process**:
1. After import, open each material in the Material Editor
2. Check that all texture maps are connected correctly
3. Add a **Tangent Space Normal** node for normal maps
4. For glass: set Blend Mode to **Translucent**, add a **Fresnel** node for edge reflections
5. For metals: verify the Metallic value is 1.0 and Roughness is driven by the texture map
6. Save the material and apply it to the mesh

## Step 4: Lighting Setup

Twinmotion's lights import as Unreal Engine lights, but some adjustments are needed:

1. **Sun light**: Imports as a Directional Light. Verify the light direction matches your intended sun position. In UE, use the **Sun Sky** plugin for more accurate sun positioning.

2. **Interior lights**: Import as Point Lights or Spot Lights. Check the intensity — Twinmotion uses different light intensity units than UE. You may need to adjust intensity values by 2-10x.

3. **HDRI environment**: Twinmotion's environment lighting doesn't directly transfer. In UE:
   - Use a **Sky Light** with an HDRI cubemap
   - Or use the **Sun Sky** plugin for procedural sky

4. **Lumen configuration**: Enable Lumen in **Project Settings → Engine → Global Illumination → Dynamic Global Illumination Method → Lumen**. Twinmotion's Lumen settings don't transfer — configure UE's Lumen settings:
   - **Lumen Scene Quality**: High for final quality
   - **Lumen Final Gather Quality**: 1-2 for production
   - **Lumen Max Bounces**: 2-4 for interiors, 1 for exteriors

## Step 5: Collision and Navigation for VR

If you're building a VR walkthrough, you need collision and navigation:

1. **Collision**: For each mesh that the player can interact with:
   - Open the Static Mesh Editor
   - Go to **Collision → Add Simplified Collision → Box/Sphere/Capsule** (choose based on shape)
   - For complex shapes, use **Convex Decomposition** for accurate collision

2. **Navigation Mesh**: For player movement:
   - Go to **Edit → Project Settings → Navigation System** and enable it
   - Add a **NavMeshBoundsVolume** to the level, scaling it to cover the walkable area
   - Press **P** to visualize the navigation mesh — green areas are walkable
   - Adjust the NavMesh settings for stairs, ramps, and doorways

3. **VR setup**: 
   - Enable the **OpenXR** plugin
   - Set up a VR Pawn with teleportation or smooth locomotion
   - Configure hand controllers for interaction

## Step 6: Post-Processing and Cinematics

Unreal Engine's post-processing is more powerful than Twinmotion's:

1. Add a **Post Process Volume** to the level
2. Enable **Infinite Extent** to apply effects everywhere
3. Configure:
   - **Bloom**: Intensity 0.5-1.0 for subtle glow
   - **Chromatic Aberration**: 0.2-0.5 for cinematic look
   - **Vignette**: 0.3-0.5 for focus
   - **Film Grain**: 0.1-0.2 for texture
   - **LUT**: Apply a color grading LUT for consistent color

4. For cinematics: use the **Sequencer** tool to animate cameras, objects, and lights. Twinmotion's path animations don't transfer — recreate them in Sequencer.

## Common Migration Issues

**Issue: Materials appear black after import**
**Fix**: Check that texture file paths are valid. Datasmith embeds textures, but if the import was interrupted, some textures may be missing. Re-import the Datasmith file.

**Issue: Geometry appears at wrong scale**
**Fix**: Twinmotion uses centimeters by default, same as Unreal Engine. If the scale is off, check the Datasmith export units in Twinmotion's export settings.

**Issue: Lights are too dim**
**Fix**: Twinmotion and UE use different light intensity units. Multiply light intensity by 5-10x in UE, or switch to **Lux** units in UE's light settings.

**Issue: Lumen produces splotchy artifacts**
**Fix**: Increase Lumen's Final Gather Quality and Surface Cache Quality in Project Settings. Also ensure the scene has sufficient light — Lumen struggles in very dark interiors.

## Summary

Migrating from Twinmotion to Unreal Engine uses the Datasmith pipeline: export from Twinmotion as .udatasmith, import into UE with the Datasmith plugin, then manually convert materials, adjust lighting, and set up collision and navigation for VR. The migration is smoother than from other applications because both share Unreal Engine technology, but Twinmotion's PBR materials, weathering effects, and light intensities require manual adjustment in UE.
