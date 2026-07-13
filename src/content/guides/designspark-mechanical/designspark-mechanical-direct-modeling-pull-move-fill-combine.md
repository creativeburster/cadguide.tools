---
title: "DesignSpark Mechanical Direct Modeling: Pull, Move, Fill, and Combine Tools"
excerpt: "Learn DesignSpark Mechanical's direct modeling approach: use the Pull tool to create and modify geometry, Move to reposition faces, Fill to remove features, and Combine for Boolean operations."
category: "deployment"
softwareSlug: "designspark-mechanical"
keyword: "designspark mechanical direct modeling pull move fill combine"
slug: "designspark-mechanical-direct-modeling-pull-move-fill-combine"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://www.rs-online.com/designspark/first-steps-to-direct-modelling-part-1-look-at-the-sketch-select-and-pull-tools"
  - "https://www.rs-online.com/designspark/learn-designspark-mechanical"
---

# DesignSpark Mechanical Direct Modeling: Pull, Move, Fill, and Combine Tools

DesignSpark Mechanical is a free 3D CAD tool based on SpaceClaim's direct modeling technology. Unlike parametric CAD (SolidWorks, Fusion 360) where you build a feature tree, direct modeling lets you interact with geometry directly — pull faces, move edges, fill holes, and combine solids. It's like modeling with clay: you shape the geometry without worrying about history or constraints.

## Direct Modeling Philosophy

### What Is Direct Modeling?

Direct modeling means:
- **No feature tree** — you don't build a history of operations
- **No constraints** — no sketch dimensions or relationships to manage
- **Geometry-driven** — you directly manipulate faces, edges, and surfaces
- **Flexible** — easy to modify imported geometry from any CAD system
- **Intuitive** — what you see is what you get

### When to Use Direct Modeling

- **Concept modeling** — quickly explore shapes without setting up parameters
- **Editing imported models** — modify STEP/IGES files from other CAD systems
- **Preparing models for 3D printing** — clean up and simplify geometry
- **Sheet metal design** — flatten and modify sheet metal parts
- **Reverse engineering** — modify scanned or imported geometry

## The Four Core Tools

DesignSpark Mechanical's workflow revolves around four tools: **Pull**, **Move**, **Fill**, and **Combine**.

### 1. Pull Tool

The Pull tool is the primary creation and modification tool. It extrudes, revolves, fillets, and offsets geometry.

#### Creating Geometry with Pull

1. **Sketch a profile** — use the Sketch tools to draw a 2D shape
2. **Select the sketch** — click on the sketch curve
3. **Activate Pull** — click the Pull tool (or press P)
4. **Drag the profile** — pull it into 3D
5. **Enter a distance** — type the exact extrusion depth

#### Modifying Geometry with Pull

1. **Select a face** — click on any face of a solid
2. **Activate Pull** — press P
3. **Drag the face** — pull to extrude or press to cut
4. **Options:**
   - **Pull normal to face** — default, extrudes along the face normal
   - **Pull along an edge** — extrude along a selected edge direction
   - **Pull to a point** — extrude to a specific point in space
   - **Extrude or cut** — pull outward to add, pull inward to remove
   - **Copy** — hold Ctrl while pulling to create a copy

#### Fillet with Pull

1. **Select an edge** — click on a sharp edge
2. **Activate Pull** — press P
3. **Drag the edge** — rounds the edge into a fillet
4. **Enter a radius** — type the exact fillet radius

#### Revolve with Pull

1. **Select a sketch profile** — the 2D shape to revolve
2. **Select an axis** — click on a line or edge to use as the revolution axis
3. **Activate Pull** — press P
4. **Drag to revolve** — the profile rotates around the axis
5. **Enter an angle** — 360° for full revolve, or partial

### 2. Move Tool

The Move tool repositions faces, edges, and entire solids.

#### Moving a Face

1. **Select a face** — click on the face to move
2. **Activate Move** — press M
3. **Choose the move direction:**
   - **Along an axis** — click an axis handle and drag
   - **Along an edge** — select an edge as the direction
   - **Free move** — use the triad to move in any direction
4. **Enter a distance** — type the exact move distance

#### Moving an Entire Solid

1. **Select the solid** — click on the solid body
2. **Activate Move** — press M
3. **Use the triad** — drag axis handles to move in specific directions
4. **Rotate** — use the rotation arcs on the triad

#### Moving with Patterns

1. **Select a face or feature**
2. **Activate Move** — press M
3. **Check "Create patterns"** in the Move options
4. **Set the count** — number of copies
5. **Drag to create a linear or circular pattern**

### 3. Fill Tool

The Fill tool removes features by filling them in. It's the "undo" of direct modeling — remove holes, fillets, cutouts, and other features.

#### Removing a Hole

1. **Activate Fill** — press F
2. **Click on the hole's surface** — the interior cylindrical face
3. **DesignSpark fills the hole** — the geometry is removed and the surface is healed

#### Removing a Fillet

1. **Activate Fill** — press F
2. **Click on the fillet face** — the rounded surface
3. **The fillet is removed** — the edge returns to sharp

#### Removing a Cutout

1. **Activate Fill** — press F
2. **Click on all faces of the cutout** — select the interior faces
3. **The cutout is filled** — the solid is restored

#### Fill Tips

- **Fill works on single faces or groups of faces**
- **Fill detects and heals tangent edges** — maintains surface continuity
- **Use Fill to simplify imported models** — remove features before 3D printing
- **Fill can remove embossed text** — select the text faces and fill

### 4. Combine Tool

The Combine tool performs Boolean operations between solids.

#### Boolean Union

1. **Create two overlapping solids**
2. **Activate Combine** — press I
3. **Select the target body** — the body to keep
4. **Select the tool body** — the body to merge with the target
5. **Choose "Union"** — the two solids merge into one

#### Boolean Subtract

1. **Create two overlapping solids**
2. **Activate Combine** — press I
3. **Select the target body** — the body to cut from
4. **Select the tool body** — the body to subtract
5. **Choose "Subtract"** — the tool body is removed from the target

#### Boolean Intersect

1. **Create two overlapping solids**
2. **Activate Combine** — press I
3. **Select the target body**
4. **Select the tool body**
5. **Choose "Intersect"** — only the overlapping volume remains

## Sketch Tools

While DesignSpark is direct modeling-focused, you still need sketches to create initial profiles:

### Drawing a Sketch

1. **Select a plane** — click on a face or datum plane
2. **Activate Sketch** — press S
3. **Draw using sketch tools:**
   - **Line** — straight segments
   - **Rectangle** — by corner or center
   - **Circle** — by center and radius
   - **Arc** — by center, start, end
   - **Polygon** — regular polygons
   - **Spline** — smooth curves through points
4. **Add dimensions** — click a line and type the length
5. **Exit sketch** — press Esc or click Exit Sketch

### Sketch Tips

- **Sketches are not parametric** — changing a dimension after exiting the sketch doesn't update the 3D model
- **Use sketches for initial creation** — then use Pull and Move for modifications
- **Import DXF/DWG** — use existing 2D drawings as sketch profiles

## Importing and Editing Foreign CAD

DesignSpark excels at editing imported geometry:

1. **File > Import** — load STEP, IGES, or Parasolid files
2. The imported model appears as a solid
3. **Use Fill** to remove unwanted features
4. **Use Pull** to modify faces
5. **Use Move** to reposition features
6. **Export** — save as STEP, IGES, STL, or 3D PDF

This is particularly useful for:
- Simplifying models for 3D printing
- Removing proprietary features from supplier models
- Modifying old CAD files without the original feature tree

## Common Issues

### Pull Doesn't Work on a Face

- The face may be part of a complex surface that can't be simply extruded
- Try selecting a different face or use the Move tool instead
- Check for geometry errors — use the Repair tool

### Fill Leaves a Gap

- The selected faces may not form a closed boundary
- Select all faces of the feature to fill
- Use the Repair tool to fix geometry issues first

### Imported Model Has Errors

- Use **Repair > Check Geometry** to identify issues
- Use **Repair > Stitch** to connect separate surfaces
- Use **Repair > Missing Faces** to fill gaps

## Best Practices

- **Learn the four core tools first** — Pull, Move, Fill, Combine cover 90% of modeling tasks
- **Use direct modeling for speed** — don't try to replicate parametric workflows
- **Sketch simply** — draw basic profiles, then refine with Pull and Move
- **Use Fill to simplify** — remove unnecessary features before exporting
- **Import and modify** — DesignSpark is excellent for editing foreign CAD
- **Save frequently** — no history means no undo beyond the current session
- **Use the tutorials** — RS Online provides step-by-step DesignSpark tutorials
- **Export to STL for 3D printing** — DesignSpark produces clean STL files
- **Combine with other tools** — use DesignSpark for quick edits, parametric CAD for complex designs
