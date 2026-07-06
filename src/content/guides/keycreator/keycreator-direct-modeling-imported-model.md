---
title: "KeyCreator Direct Modeling: Editing Imported Models Without Feature Trees"
excerpt: "How to use KeyCreator's direct modeling tools to modify imported STEP, IGES, and parasolid files — covering face move, face delete, thickness adjustment, and feature recognition."
category: "workflow"
softwareSlug: "keycreator"
keyword: "keycreator direct modeling imported model edit"
slug: "keycreator-direct-modeling-imported-model"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.kubotek3d.com/support/keycreator-direct-modeling"
  - "https://forums.kubotek3d.com/forum/modeling"
---

# KeyCreator Direct Modeling: Editing Imported Models Without Feature Trees

KeyCreator (formerly CADKEY) was built on direct modeling before it was trendy. While SolidWorks and Creo were building parametric feature trees, KeyCreator was pushing and pulling faces directly. I use it specifically for modifying client-supplied STEP files where I don't have the original feature tree. Here's the workflow.

## Why KeyCreator for Imported Models?

Most parametric CAD systems struggle with imported geometry. SolidWorks imports a STEP file as a "dumb solid" — you can't edit individual features without FeatureWorks recognition. KeyCreator treats all geometry the same, whether it was created natively or imported. Every face, edge, and vertex is directly editable.

## Key Direct Modeling Tools

### Face Move

1. Select a planar face.
2. Go to **Edit** → **Move Face**.
3. Define direction: click a normal face or select an axis.
4. Enter distance (positive = outward, negative = inward).
5. KeyCreator moves the face and extends/trim adjacent faces automatically.

This is the most common edit — extending a bracket arm, adjusting a wall position, or changing a part's overall length.

### Face Offset (Thickness Change)

1. Select a cylindrical face (e.g., a hole).
2. Go to **Edit** → **Offset Face**.
3. Enter offset: +2mm to enlarge the hole by 2mm radius, -1mm to shrink it.
4. KeyCreator resizes the hole and updates surrounding faces.

For changing wall thickness:
1. Select the inner face of a wall.
2. Offset inward by the desired amount.
3. The wall thickens — no need to rebuild the extrude feature.

### Face Delete

1. Select a face to remove (e.g., a boss top face).
2. Go to **Edit** → **Delete Face**.
3. KeyCreator removes the face and heals the surrounding geometry.
4. For features that go through the part (like holes), select all faces of the feature and delete them together.

### Edge Blend (Fillet)

1. Select an edge.
2. Go to **Insert** → **Blend** → **Constant Radius**.
3. Enter radius.
4. KeyCreator creates the fillet on any edge — imported or native.

### Edge Chamfer

1. Select an edge.
2. Go to **Insert** → **Chamfer**.
3. Enter distance and angle (or two distances for asymmetric chamfer).

## Feature Recognition

KeyCreator can recognize common features on imported solids:

1. Go to **Inspect** → **Feature Recognition**.
2. KeyCreator scans the model and identifies:
   - Holes (simple, counterbored, countersunk)
   - Pockets (rectangular, circular)
   - Bosses
   - Fillets
   - Patterns
3. Recognized features appear in a feature list.
4. You can edit recognized features by changing their parameters (diameter, depth, pattern count).

Feature recognition isn't perfect — it works best on geometrically simple parts. Organic or complex surfaces may not be recognized. But for typical machined parts (brackets, plates, housings), it identifies 80-90% of features correctly.

## Modifying Imported Assemblies

1. Import the assembly STEP file — KeyCreator preserves the assembly structure.
2. Each part appears as a separate solid body.
3. Select and move parts independently using the **Position** tool.
4. Use **Mating Constraints** to reposition parts precisely:
   - **Coincident**: Align two faces
   - **Concentric**: Align two cylindrical axes
   - **Distance**: Set a gap between two faces

## Common Scenarios

### Scenario 1: Enlarge a Mounting Hole

Client sent a STEP file with M8 holes, but you need M10:

1. Import the STEP file.
2. Select the cylindrical face of the hole.
3. **Edit** → **Offset Face** → +1mm (M10 radius is 5mm, M8 is 4mm).
4. The hole is now M10. Adjacent faces (chamfers, counterbores) update automatically.

### Scenario 2: Add a New Hole to an Imported Part

1. Import the STEP file.
2. Create a sketch on the face where the hole should go.
3. Draw a circle at the desired position and diameter.
4. **Insert** → **Cut** → **Extrude** → Through All.
5. The hole is cut into the imported solid.

### Scenario 3: Remove a Boss from an Imported Part

1. Import the STEP file.
2. Select the top face of the boss.
3. **Edit** → **Delete Face**.
4. If the boss has fillets at its base, select and delete those faces too.
5. KeyCreator heals the gap, leaving a flat surface where the boss was.

### Scenario 4: Change Part Overall Width

1. Import the STEP file.
2. Select the side face of the part.
3. **Edit** → **Move Face** → direction: outward → distance: 10mm.
4. The part widens by 10mm. All features on that face (holes, chamfers) move with it.

## Export After Modification

After editing, export the modified model:

1. **File** → **Export** → **STEP** (AP242 for modern CAM systems).
2. Or **File** → **Export** → **Parasolid** (.x_t) — preserves exact surface definitions, preferred by Siemens NX and CAM systems.
3. Or **File** → **Export** → **STL** for 3D printing.

KeyCreator's direct modeling edits are baked into the exported geometry — the receiving system sees a clean solid with no history of the modifications.
