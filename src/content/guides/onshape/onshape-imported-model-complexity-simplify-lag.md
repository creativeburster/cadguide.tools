---
title: "Onshape Imported Model Complexity: Reducing Triangle Count and Lag from Manufacturer Files"
excerpt: "Imported manufacturer models with excessive detail cause Onshape to lag during assembly operations. I cover the simplify feature, bounding box replacement, and the configuration strategy that eliminates imported model lag."
category: "performance"
softwareSlug: "onshape"
keyword: "Onshape imported model complexity performance lag simplify"
slug: "onshape-imported-model-complexity-simplify-lag"
author: "CAD IT Admin"
readTime: "8 min"
date: "2025-06-23"
sources:
  - "https://forum.onshape.com/discussion/20347/imported-model-complexity-versus-performance-lag"
  - "https://forum.onshape.com/discussion/19259/lets-solve-the-speed-issue"
  - "https://forum.onshape.com/discussion/26524/slow-performance-in-assemblies-with-a-lot-of-parts"
---

# Onshape Imported Model Complexity: Reducing Triangle Count and Lag from Manufacturer Files

A user on the Onshape forum described a common scenario: they created a plant floor layout with 8 pieces of manufacturing equipment for a project at work. They needed to create multiple iterations by rearranging the equipment. The problem: they didn't create any of the 8 models — they came from the equipment manufacturers. Even though the models weren't full detail, they were still complex enough to cause significant performance lag when moving or rotating them in the assembly.

Another user reported that importing parts into an assembly or going through menus took forever — exporting an STL took 5 minutes just to open the export dialog. These problems are caused by the same issue: manufacturer-provided CAD models contain far more geometric detail than needed for assembly-level work.

## Why Manufacturer Models Cause Performance Problems

Manufacturer CAD models are typically created for manufacturing documentation, not for assembly context. They include:

- **Internal geometry**: Gears, springs, bearings — invisible from outside but fully modeled
- **Threaded fasteners**: Full helical threads with correct profiles
- **Fillets and chamfers**: Every edge is filleted, adding thousands of faces
- **Decals and textures**: Logos, labels, and warning labels as image files
- **Cast features**: Draft angles, parting lines, and casting details

Each of these adds triangles to the rendering pipeline. A single manufacturer model of a motor can contain 50,000+ triangles. With 8 motors in an assembly, that's 400,000+ triangles just for the motors — before adding any of your own geometry.

## Fix 1: Use Onshape's Simplify Feature

Onshape has a built-in simplify feature for imported geometry:

1. Open the part studio containing the imported model
2. Select the imported part
3. Use **Feature → Simplify**
4. Choose simplification options:
   - **Remove fillets and chamfers**: Eliminates all rounded edges
   - **Remove small holes**: Fills holes below a specified diameter
   - **Remove internal geometry**: Removes faces not visible from outside
5. Click **OK** to create a simplified version
6. The simplified part is stored alongside the original
7. Use the simplified part in assemblies; keep the original for reference

### Expected Triangle Reduction

| Simplification Option | Triangle Reduction |
|----------------------|-------------------|
| Remove fillets/chamfers | 30-50% |
| Remove small holes | 10-20% |
| Remove internal geometry | 40-70% |
| All options combined | 60-90% |

## Fix 2: Replace with Bounding Box

For layout and clearance checking, a simple bounding box is sufficient:

1. Measure the imported model's overall dimensions (X, Y, Z)
2. Create a new part: **Sketch → Rectangle** with the X and Y dimensions
3. **Extrude** by the Z dimension
4. Add **Mate connectors** at the same locations as the original model
5. Use the bounding box in the assembly instead of the original
6. Hide the original model

### When to Use Bounding Boxes

- Floor layout and equipment positioning
- Clearance and interference checking
- Space allocation in enclosure design
- Initial assembly layout before detailed design

### When NOT to Use Bounding Boxes

- When you need to check specific mating surfaces
- When cable routing requires precise geometry
- When the visual appearance matters for client review

## Fix 3: Create Configurations for Detail Levels

1. Open the part studio with the imported model
2. Create a **Configuration** with three options:
   - **Full**: The original imported model
   - **Simplified**: Fillets removed, internal geometry removed
   - **Bounding box**: Simple box with correct dimensions
3. In the assembly, use the **Configuration** dropdown to select the detail level
4. Use **Bounding box** for layout work
5. Use **Simplified** for general assembly work
6. Use **Full** only for final rendering and close-up detail

### Benefits

- One part definition serves all needs
- Switch between detail levels instantly
- No need to maintain separate files
- The assembly automatically updates when you change the configuration

## Fix 4: Use Derived Parts for Simplification

1. Create a new part studio called "Simplified Components"
2. Use **Derive** to bring in the imported model
3. In the derived part studio, add features to simplify:
   - Use **Delete face** to remove internal faces
   - Use **Replace face** to simplify complex surfaces
   - Use **Fill** to close holes
4. Use the derived (simplified) part in assemblies
5. The derived part updates automatically if the original is modified

## Fix 5: Clean Up Imported Geometry Before Using

### Remove Threads

Threaded fasteners are the #1 cause of imported model bloat:

1. Open the imported model in the part studio
2. Identify threaded features (they look like spiral geometry)
3. Use **Delete face** to remove the thread geometry
4. Use **Hole** feature to create a simple cylindrical hole instead
5. Add a note in the drawing specifying the thread specification

### Remove Decals and Textures

1. Select the imported part
2. In the **Appearance** panel, check for applied textures
3. Remove all textures and decals
4. Replace with a simple color if needed for identification

### Merge Coplanar Faces

1. Use **Feature → Merge faces** (if available in your Onshape tier)
2. This combines adjacent coplanar faces into a single face
3. Reduces triangle count without changing the visual appearance

## Fix 6: Use Onshape's Performance Assessment Tool

1. Click **? → Performance meter**
2. Import the manufacturer model and check the triangle count
3. If the triangle count exceeds 10,000 per model, simplification is needed
4. Set a target: keep total assembly triangles below 500,000 for smooth performance
5. Use the triangle count to prioritize which models to simplify first

## Fix 7: Request Simplified Models from Manufacturers

Many manufacturers provide both full-detail and simplified versions of their CAD models:

1. Check the manufacturer's website for a "simplified" or "lightweight" version
2. Look for STEP files labeled "envelope" or "installation model"
3. If only one version is available, contact the manufacturer and request a simplified version
4. Many manufacturers have simplified models for layout purposes that they don't publicly list

## Fix 8: Use Onshape's Partner Content

Onshape has a library of pre-simplified manufacturer components:

1. Go to **Insert → Partner content**
2. Search for the manufacturer (e.g., Misumi, McMaster-Carr)
3. These components are pre-optimized for Onshape performance
4. They typically have lower triangle counts than direct STEP imports
5. Use Partner content instead of importing manufacturer STEP files when possible

## Summary

| Fix | Triangle Reduction | Difficulty |
|-----|-------------------|------------|
| Use Simplify feature | 60-90% | Easy |
| Replace with bounding box | 95-99% | Easy |
| Create detail level configurations | Varies | Medium |
| Use derived parts | 40-70% | Medium |
| Remove threads manually | 20-40% | Medium |
| Remove decals and textures | 5-10% | Easy |
| Request simplified models | Varies | Easy |
| Use Partner content | 50-80% | Easy |

The most effective strategy is creating configurations with three detail levels (Full, Simplified, Bounding box). This gives you the flexibility to work in Bounding box mode for layout, switch to Simplified for assembly work, and use Full only for final renders. Combined with the Simplify feature for initial geometry cleanup, this approach can reduce triangle count by 90%+ while preserving all the detail you need for documentation.
