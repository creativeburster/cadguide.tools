---
title: "Marvelous Designer USD Export and Unreal Engine Errors"
excerpt: "Marvelous Designer USD Export and Unreal Engine Errors: symptoms, root causes, and step-by-step fixes, verified against Epic Developer Community Forums and CLO-SET Community."
category: "troubleshooting"
softwareSlug: "marvelous-designer"
keyword: "Marvelous Designer USD export Unreal Engine Invalid Input LOD 0 Chaos Cloth Asset Static Mesh workflow materials translucent USDImportTranslucentMaterial material parent change shadow artifacts Chaos Cloth Opaque blend mode cloth falls down physics asset export splits mesh merge import"
slug: "marvelous-designer-usd-export-and-unreal-engine-errors"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-03"
sources:
---

# Marvelous Designer USD Export and Unreal Engine Errors: Invalid Input LOD 0 from USD Import to Chaos Cloth Asset Requiring Static Mesh Workflow, Materials Appear Translucent from USDImportTranslucentMaterial Requiring Material Parent Change, Strange Shadow Artifacts on Chaos Cloth from Normal or Material Issues Requiring Opaque Blend Mode, Cloth Falls Down from Missing Physics Asset Setup Requiring Physics Asset Configuration, and Export Splits Everything Up Requiring Mesh Merge Before Import

Marvelous Designer's USD export, Chaos Cloth integration, material handling, physics setup, and mesh organization produce errors from LOD incompatibility, translucent material assignment, normal issues, missing physics assets, and split exports. This guide covers the 5 most common Marvelous Designer problems with diagnostic steps and community-verified fixes from Epic Developer Community Forums and CLO-SET Community.

## 1. Invalid Input LOD 0 from USD Import to Chaos Cloth Asset

### Symptom

Creating a Cloth Asset in UE5.4, importing a USD exported from Marvelous Designer. Error: "ClothAssetTerminal: Invalid input LOD 0. Invalid or empty input LOD for LOD 0. LOD 0 cannot be empty in order to construct a valid Cloth Asset. ClothAssetTerminal: Invalid LOD. LOD 0 has no valid data." Viewports are blank. The USD does bring in static mesh, materials, and textures — they're visible in Content Browser, but the Cloth Asset has nothing.

### Root Cause

"The USDImport feature is definitely not able to work with the Cloth Asset in UE5.4 Preview 1." The USDImport node in the Chaos Cloth Asset doesn't properly parse the USD file's LOD data. The USD file from Marvelous Designer contains the mesh data, but the Cloth Asset's USDImport node can't extract LOD 0 from it. The mesh data exists (visible in Content Browser) but the Cloth Asset can't read it through the USDImport node.

### Fix

1. **Use Static Mesh Import instead of USDImport**:
   - Import the USD file into Content Browser as Static Mesh
   - In the Cloth Asset, use StaticMeshImport node instead of USDImport
   - Link the imported static mesh to the StaticMeshImport node

2. **Merge mesh parts before import**:
   - In MD, use the Merge option to combine all garment parts
   - Export as a single mesh

3. **Set correct export options in Marvelous Designer**:
   - Use Thin export (not Thick)
   - Exclude avatar from export
   - Use millimeter scale

4. **Import and merge in Unreal**:
   - Use Merge Actors tool in UE

5. **Check scale and position**:
   - Verify the merged mesh matches the character body
   - Adjust scale if needed
   - Ensure proper alignment

6. **Import to Chaos Cloth as Static Mesh**:
   - Use the Chaos Cloth Component
   - Set the merged static mesh as the cloth mesh
   - Configure cloth properties

### Community Report

> "When I create a Cloth Asset in UE5.4 and import a USD from Marvelous Designer: 'ClothAssetTerminal: Invalid input LOD 0. Invalid or empty input LOD for LOD 0.' The USDImport feature is not able to work with the Cloth Asset in UE5.4 Preview 1. Solved by importing USD into content browser, then replacing USDImport with StaticMeshImport by linking meshes from USD. In MD use quadrangulate option, export as USD Thin, no avatar, default scale mm."

## 2. Materials Appear Translucent from USDImportTranslucentMaterial

### Symptom

Exporting a garment from Marvelous Designer to USD, uploading to UE 5.5 Chaos Cloth Asset. All materials appear messed up — clothing is see-through or has wrong shading. The materials look translucent when they should be opaque. The issue occurs with all garments and export options.

### Root Cause

"It looks like the older version sets the parent material for my garment as USDImportMaterial instead of USDImportTranslucentMaterial." Marvelous Designer 2024.2+ changed the USD export to assign USDImportTranslucentMaterial as the parent material instead of USDImportMaterial. This causes the materials to render as translucent in Unreal Engine. The translucent material shows through the clothing incorrectly.

### Fix

1. **Change material parent from Translucent to Opaque**.

2. **Change Blend Mode to Opaque**:
   - Open the material instance
   - Change Blend Mode from Translucent to Opaque
   - Save and apply

3. **Revert to older Marvelous Designer version**:
   - The older version uses USDImportMaterial as parent
   - This avoids the translucent issue

4. **Check for flipped normals**:
   - Check normals on the garment mesh
   - Flip normals if needed
   - This may fix the see-through appearance

5. **Create custom materials in Unreal**:
   - Instead of using USD-imported materials
   - Create new materials in Unreal Engine
   - Apply them to the cloth mesh
   - This gives full control over material properties

6. **Use Marvelous Designer 2024.0.173+ for garment simulation data**:
   - "Include Garment Simulation Data" in USD export
   - This provides simulation setup data for UE 5.4
   - May improve material handling

### Community Report

> "Whenever I export a garment from Marvelous Designer to USD, then upload to UE 5.5 Chaos Cloth Asset, all my materials are messed up. The older version sets the parent material as USDImportMaterial instead of USDImportTranslucentMaterial. Fix: Open the material instance, change USDImportTranslucentMaterial to USDImportMaterial, click save. Or turn the Blend Mode to Opaque. Reverting to MD v2024.0.191 also fixes it."

## 3. Strange Shadow Artifacts on Chaos Cloth

### Symptom

Importing clothes from Marvelous Designer creates strange shading/shadow artifacts on USD clothes in Unreal Engine. The clothes look wrong in the viewport with dark patches or strange shadows. Tried importing with LiveSync, using Thick and Thin options, optimizing the mesh, creating new materials — nothing works. Enabling Nanite doesn't fix the problem.

### Root Cause

The shadow artifacts are caused by either: (1) incorrect normals from the Marvelous Designer export, (2) the USD material assignment creating incorrect shading, or (3) the Chaos Cloth mesh not having proper tangent space. The Thin export option creates single-layer geometry which can have normal issues. The Thick export option creates double-layer geometry but may still have tangent space issues.

### Fix

1. **Check and fix normals**:
   - In Marvelous Designer, check normals before export
   - Use "Correct Normals" option in MD
   - In Unreal, use the mesh editor to check normals
   - Flip normals if they're inverted

2. **Use Thick export instead of Thin**:
   - Thin creates single-layer geometry — more prone to normal issues
   - Thick creates double-layer geometry — more stable normals
   - Try both options and compare
   - Use Thick if shadow artifacts appear with Thin

3. **Create new materials in Unreal**:
   - But try creating a simple opaque material
   - Apply it to the cloth mesh
   - If artifacts disappear, the issue is material-related

4. **Check mesh for duplicate faces**:
   - Marvelous Designer may export duplicate faces
   - In Unreal mesh editor, check for overlapping geometry
   - Remove duplicate faces
   - This can cause shadow artifacts

5. **Disable Nanite on cloth meshes**:
   - Nanite may actually cause issues with cloth
   - Disable Nanite on the cloth mesh
   - Use standard rendering for cloth

6. **Use quadrangulated mesh**:
   - Quadrangulated meshes have better normal continuity
   - Avoid triangle-only meshes
   - Use a reasonable point distance (10)

7. **Check UV mapping**:
   - Bad UVs can cause shading artifacts
   - Check UV layout in MD before export
   - Ensure no overlapping UVs
   - Use proper UV unwrapping

### Community Report

> "Importing clothes from Marvelous Designer creates some strange shading on USD clothes. I've tried importing with LiveSync, using the Thick and Thin options, optimizing the mesh, creating new materials in Unreal, nothing works. Enabling Nanite doesn't fix the problem. This is how the clothes look in the Cloth Asset window — the viewport looks wrong."

## 4. Cloth Falls Down from Missing Physics Asset Setup

### Symptom

After importing Marvelous Designer clothing into Chaos Cloth in Unreal Engine, the cloth immediately falls down off the character. The cloth doesn't stay on the body. Setting cloth distance at neck points to 0 doesn't help. Disabling physics asset makes the cloth just fall through everything.

### Root Cause

"You need to set up the physics asset." The Chaos Cloth system requires a physics asset to define collision bodies for the character. Without proper physics asset configuration, the cloth has no collision object to interact with, so it falls through the character. "They did promise that the cloth will work directly through geometry and no need for physics assets, but in this module you need to set up the physics asset."

### Fix

1. **Set up physics asset for character**:
   - Create or assign a physics asset to the character's skeletal mesh
   - Add collision bodies for torso, arms, legs
   - Adjust body sizes to match character

2. **Configure Chaos Cloth collision**:
   - In the Chaos Cloth Component
   - Enable collision with physics asset
   - Set "Collide with Character" to true
   - Assign the character's physics asset

3. **Use Anim Dynamics or Kinematic bodies**:
   - Set the character's physics bodies to Kinematic
   - This prevents the character from being affected by cloth
   - But allows cloth to collide with the bodies
   - The character drives the collision

4. **Set cloth attachment points**:
   - Use the Chaos Cloth's "Max Distances" feature
   - Set max distance to 0 at attachment points (neck, waist, cuffs)
   - This pins the cloth to the character

5. **Configure self-collision**:
   - Enable self-collision on the Chaos Cloth
   - This prevents the cloth from intersecting itself
   - Set appropriate self-collision distance
   - Test and adjust

6. **Use Animation Driven collision**:
   - Instead of physics asset collision
   - Use the character's animation for collision
   - Enable "Use Animation Driven Collisions"
   - This uses the skeletal mesh's animation for cloth collision

7. **Check wind and gravity settings**:
   - Ensure gravity is set correctly
   - Check for wind forces that might push the cloth
   - Reduce gravity for testing
   - Verify cloth doesn't fall through the floor

### Community Report

> "The final simulation looks weird but at least it works. They did promise that the cloth will work directly through geometry and no need for physics assets, but in this module you need to set up the physics asset. But looks like it doesn't work. Setting 0 for the cloth distance at neck points doesn't help to make the cloth stay at the object. It still falls down. And if we disable physics asset — the cloth just falls down."

## 5. Export Splits Everything Up Requiring Mesh Merge

### Symptom

Exporting a garment from Marvelous Designer as USD. The export splits the garment into multiple separate mesh parts. Each pattern piece becomes a separate mesh. When importing to Unreal Engine, there are many separate meshes instead of one unified garment mesh. This causes issues with Chaos Cloth import and material assignment.

### Root Cause

Marvelous Designer exports each pattern piece as a separate mesh by default. This is because each pattern piece has its own material, UV mapping, and simulation properties. The USD format preserves this separation. When imported to Unreal Engine, each mesh needs to be merged into one for Chaos Cloth to work properly.

### Fix

1. **Merge in Marvelous Designer before export**:
   - In MD, select all pattern pieces
   - Use the Merge function
   - Export the merged mesh as USD

2. **Merge in Unreal Engine after import**:
   - Use Unreal's Merge Actors tool

3. **Set correct coordinates**:
   - After importing all parts
   - Set all parts to 0, 0, 0 coordinates
   - This ensures they align correctly
   - Before merging

4. **Check scale after merge**:
   - Verify the merged mesh matches the character
   - Adjust scale if the export scale was wrong
   - MD default scale is mm, UE uses cm

5. **Use a single material after merge**:
   - After merging, assign a single material
   - Or use material IDs to preserve different materials
   - This simplifies the Chaos Cloth setup
   - One material is easier to manage

6. **Use Marvelous Designer's USD export options**:
   - "Include Garment Simulation Data" option (2024.0.173+)
   - This exports simulation setup data
   - May help with UE 5.4 integration
   - Check "Thin" vs "Thick" export options

7. **Test with simple garment first**:
   - Before exporting complex garments
   - Test with a simple garment (e.g., a t-shirt)
   - Verify the merge and import workflow
   - Then apply to complex garments

### Community Report

> "When I export on Marvelous Designer, it splits everything up — how do I fuse everything together first? I followed Marvelous Designer tips on how to merge everything into one. Now I am at the step where I am importing it as Static Mesh Import. Import in UE the USD file as a SM, transfer all mesh parts into the scene, set 0 0 0 coordinates, merge this parts in one Static Mesh, check the scale and position with MTH body asset."

## 6. Additional Marvelous Designer Issues

### Fabric Simulation Bending Stiffness

**Issue**: Fabric doesn't drape or fold correctly in simulation.
**Fix**: Adjust bending stiffness in fabric properties. Lower stiffness = more flowy fabric. Higher stiffness = stiffer fabric. Test with different values. Use preset fabric types as starting points.

### Cloth Weights Not Transferred

**Issue**: "When I choose the skeletal mesh it doesn't transfer any weights."
**Fix**: Use the Static Mesh import workflow instead of USDImport. Weights may need to be re-assigned in UE. Use Chaos Cloth's weight painting tools. Check if the mesh has proper vertex colors for weight data.

### LiveSync Issues

**Issue**: LiveSync doesn't update properly or causes artifacts.
**Fix**: Check network connection between MD and UE. Ensure both applications use the same units. Restart LiveSync connection. Use USD export as alternative to LiveSync.

### Performance with Complex Garments

**Issue**: Simulation is slow with complex multi-layer garments.
**Fix**: Reduce mesh density (increase point distance). Simplify collision geometry. Use lower simulation quality for preview. Increase quality for final render.

## Best Practices

1. **Use StaticMeshImport instead of USDImport for Chaos Cloth** — avoids LOD 0 error
2. **Merge all garment parts before or after export** — single mesh for Chaos Cloth
3. **Change USDImportTranslucentMaterial to USDImportMaterial** — fixes see-through materials
4. **Set Blend Mode to Opaque for clothing materials** — prevents translucency
5. **Set up physics asset for character collision** — prevents cloth falling through
6. **Use Thick export for better normals** — reduces shadow artifacts
7. **Quadrangulate mesh in MD before export** — better normal continuity
8. **Check and fix normals in both MD and UE** — prevents shading artifacts
9. **Use mm scale in MD export, adjust in UE** — ensures correct proportions
10. **Include Garment Simulation Data in USD export (2024.0.173+)** — enables UE 5.4 simulation setup
