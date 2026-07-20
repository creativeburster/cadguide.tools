---
title: "Marvelous Designer to Unreal Engine: USD Export, Chaos Cloth, and LiveSync Workflow"
excerpt: "Exporting garments from Marvelous Designer to Unreal Engine requires choosing between static mesh (FBX), geometry cache (Alembic), and real-time simulation (USD + Chaos Cloth). We cover each workflow, the LiveSync plugin, and the specific export settings needed for MetaHuman clothing."
category: "workflow"
softwareSlug: "marvelous-designer"
keyword: "Marvelous Designer export Unreal Engine USD Chaos Cloth LiveSync"
slug: "marvelous-designer-export-unreal-engine-usd-chaos-cloth"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-06-22"
sources:
  - "https://support.marvelousdesigner.com/hc/en-us/articles/47358311524249-9-USD-to-Unreal-Engine-Chaos-Cloth-Workflow"
  - "https://support.marvelousdesigner.com/hc/en-us/articles/47358334956953-USD-Export-Garment-Simulation-Data-Option-2024-0-173"
  - "https://support.marvelousdesigner.com/hc/en-us/articles/41062062862745--Tips-Tricks-Discover-Better-Workflow-with-Marvelous-Designer-and-Unreal-Engine"
  - "https://virtualfilmer.com/new-ue5-4-process-for-marvelous-designer-export-to-unreal-then-realtime-cloth-simulation/"
  - "https://subobject.co/marvelous-designer-unreal-engine-cloth-simulation/"
---

# Marvelous Designer to Unreal Engine: USD Export, Chaos Cloth, and LiveSync Workflow

We've built complete clothing pipelines from Marvelous Designer to Unreal Engine for MetaHuman projects, and the export workflow has evolved significantly with Unreal Engine 5.4's Chaos Cloth system and Marvelous Designer's USD export support. There are three distinct workflows depending on whether you need static garments, baked animations, or real-time cloth simulation.

## Three Export Workflows

### 1. Static Mesh (FBX) — For Posed Characters and Still Renders

This is the simplest workflow. You simulate the garment on a posed avatar in Marvelous Designer, then export the result as a static mesh.

**When to use**: Still images, posed MetaHumans, architectural visualization, any case where the character doesn't need to move.

**Export settings**:
1. File → Export → FBX
2. Select **OBJ** as the 3D mesh type
3. Enable **Thin** (single-sided) or **Thick** (double-sided) depending on your needs
4. Enable **Unified UV Coordinates** if you want a single UV set
5. Select the garments to export (deselect avatars)
6. Scale: Centimeters

**In Unreal Engine**:
- Import the FBX as a Static Mesh
- Materials import automatically if you used Marvelous Designer's material slots
- Assign the mesh to your character as a static mesh component

As one practitioner notes: "Since these were still images, the workflow was simple. The MetaHumans aren't animated, they're posed and frozen in place. All I needed was to simulate the clothing on that one pose and export a Static Mesh."

### 2. Geometry Cache (Alembic/MDD) — For Animated Characters with Baked Simulation

This workflow exports the simulated clothing animation as a geometry cache that plays back frame-by-frame in Unreal Engine.

**When to use**: Cinematic sequences, pre-rendered animations, any case where the character moves but you don't need real-time cloth physics.

**Export settings**:
1. Simulate the garment on an animated avatar in Marvelous Designer
2. File → Export → Alembic (ABC) or MDD
3. For Alembic: enable thick option and unified UV coordinates
4. For MDD: exports an OBJ (mesh) + MDD (animation data)

**The material slot problem**: Alembic exports from Marvelous Designer typically lose material slot information, giving the entire mesh a single material. The workaround, documented by a practitioner at SubObject.co:

1. Export the static mesh as FBX from Marvelous Designer (preserves material slots)
2. Import the FBX into Blender
3. In Sculpt mode, create Face Sets based on materials
4. Apply the MDD animation cache via Mesh Cache modifier
5. Export from Blender as Alembic — the Face Sets are preserved as material groups
6. Import the Alembic into Unreal Engine with material slots intact

This is a complex pipeline, but it's currently the most reliable way to get animated Marvelous Designer garments into Unreal Engine with multiple materials.

### 3. USD + Chaos Cloth — For Real-Time Cloth Simulation

This is the newest and most powerful workflow, introduced with Marvelous Designer 2024 and Unreal Engine 5.4.

**When to use**: Games, interactive experiences, real-time cinematics where cloth needs to respond to character movement dynamically.

Marvelous Designer's documentation states: "USD Export Simulation Data is specifically designed to work with Unreal Engine 5.4's updated Chaos Cloth feature, this tool enables real-time simulation effects, translating complex clothing physics from Marvelous Designer directly into Unreal Engine."

#### Step 1: Prepare the Garment in Marvelous Designer

1. Create your garment with different fabrics and set their physical properties
2. Simulate on an avatar that matches your Unreal Engine character's body type
3. Ensure the garment fits properly before export

#### Step 2: Export USD with Simulation Data

1. File → Export → USD
2. **Crucial**: Enable **"Include Garment Simulation Data"**
3. Uncheck **"Select All Avatars"** — export only the garment, not the avatar
4. Enable **"Thick"** option and **Unified UV Coordinates**
5. Set scale to **Centimeters**
6. Click OK — export may take several minutes

The simulation data export preserves all physical properties (bending, shear, stretch, density, shrinkage, collision settings) so Unreal Engine's Chaos Cloth can use them for real-time simulation.

#### Step 3: Set Up Unreal Engine 5.4

1. Create a new Unreal project (Film & TV template recommended)
2. Enable Chaos Cloth plugins:
   - Chaos Cloth
   - Chaos Cloth Asset
   - Chaos Cloth Asset Editor
   - Chaos Cloth Editor
   - Chaos Cloth Generator
3. Restart Unreal Engine
4. Import your MetaHuman or skeletal mesh character
5. Zero out location and rotation

#### Step 4: Create the Cloth Asset

1. Right-click in Content Browser → Physics → Cloth Asset
2. Name the asset (e.g., "TestGarment01")
3. Double-click to open the Cloth Asset editor
4. In the Dataflow graph, click the USD Import node
5. Browse for the USD file exported from Marvelous Designer
6. Select the skeletal mesh (imported via LiveSync or FBX) for skinning
7. The clothing is skinned to the character's skeleton

#### Step 5: Apply to Character

1. In the preview scene, select the same skeletal mesh
2. The cloth asset is applied as a clothing component
3. Play the scene to see real-time cloth simulation

## LiveSync Plugin

The LiveSync plugin streamlines the Marvelous Designer → Unreal Engine pipeline by enabling one-click import/export of meshes, materials, skeletal animations, and geometry caches.

Marvelous Designer's documentation describes it: "The LiveSync plugin is primarily aimed at simplifying the tedious import and export process. Mesh, materials, skeletal animations, and geometry caches can all be imported and exported with just one click."

### Setting Up LiveSync

1. Install the LiveSync plugin for Unreal Engine from the Epic Marketplace
2. Ensure Marvelous Designer is running
3. Open the LiveSync Editor in Unreal Engine
4. Click the "Update" button to sync current scene state

### LiveSync Capabilities

- **Real-time updates**: Changes in Marvelous Designer appear in Unreal Engine
- **Material transfer**: Fabric materials are automatically created based on Marvelous Designer's fabric settings
- **Skeletal animation**: Character animations can be sent bidirectionally
- **Geometry cache**: Baked cloth simulations transfer as geometry caches
- **Not limited to MetaHumans**: Works with any skeletal mesh

### LiveSync vs USD Export

- **LiveSync**: Best for iterative workflow — make changes in Marvelous Designer and see them immediately in Unreal Engine. Ideal for rendering animations and cinematics
- **USD Export**: Best for real-time cloth simulation via Chaos Cloth. The simulation data in the USD file enables physics-based cloth behavior in-game

## Tips for MetaHuman Clothing

1. **Match the avatar**: Use a Marvelous Designer avatar that matches your MetaHuman's body type. MetaHumans come in standard sizes — find the closest match
2. **Test fit before export**: Simulate the garment on the posed/animated avatar in Marvelous Designer and verify the fit
3. **Use multiple fabrics**: Assign different fabrics to different garment parts (e.g., silk lining vs. wool shell) — these properties transfer to Chaos Cloth
4. **Optimize mesh density**: High mesh counts from Marvelous Designer can overwhelm Chaos Cloth. Use Marvelous Designer's remeshing tools to reduce polygon count before export
5. **Set collision properly**: In Unreal Engine, configure the Chaos Cloth collision settings to match your character's body collision

## Common Issues

### USD Import Fails in Unreal Engine

- Ensure you're using Unreal Engine 5.4 or later
- Check that all Chaos Cloth plugins are enabled
- Verify the USD file was exported with "Include Garment Simulation Data" enabled
- Try re-exporting with simplified geometry

### Cloth Doesn't Simulate in Real-Time

- Check that the Cloth Asset is properly assigned to the skeletal mesh
- Verify Chaos Cloth collision settings are configured
- Ensure the character's skeletal mesh has appropriate physics assets
- Reduce cloth mesh density if performance is an issue

### Materials Missing After Import

- For FBX: material slots should import automatically
- For Alembic: use the Blender Face Sets workaround described above
- For USD: materials are created based on Marvelous Designer fabric settings via LiveSync

## Summary

Three workflows cover all Marvelous Designer to Unreal Engine needs: FBX for static garments, Alembic/MDD for baked animation caches, and USD with simulation data for real-time Chaos Cloth simulation. The LiveSync plugin enables iterative workflows between the two applications. For MetaHuman clothing, the USD + Chaos Cloth pipeline in Unreal Engine 5.4 is the most powerful option, preserving physical fabric properties for in-engine cloth physics. Always test garment fit in Marvelous Designer before export, and optimize mesh density for real-time performance.
