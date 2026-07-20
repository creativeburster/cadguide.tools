---
title: "CrownCAD Part Design: Sketching, Features, and Assembly Modeling in the Cloud"
excerpt: "Create 3D parts and assemblies in CrownCAD: sketch with constraints, use parametric features (extrude, revolve, sweep, loft), build assemblies with mates, and manage design data in the cloud."
category: "workflow"
softwareSlug: "crowncad"
keyword: "crowncad part design sketch features assembly cloud CAD"
slug: "crowncad-part-design-sketching-features-assembly-modeling"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-13"
sources:
  - "https://www.crowncad.com/english/guide/part.html"
  - "https://www.crowncad.com/english/guide/navigation.html"
---

# CrownCAD Part Design: Sketching, Features, and Assembly Modeling in the Cloud

CrownCAD provides a full parametric 3D CAD modeling environment that runs in a web browser. Despite being cloud-based, it offers the same modeling capabilities as desktop CAD: sketching with constraints, feature-based design, assembly modeling with mates, and 2D drawing creation. I'll walk through the complete part and assembly design workflow.

## CrownCAD Architecture

### Cloud-Based CAD

CrownCAD runs entirely in the browser:
- **No installation** — works in Chrome, Safari, and Edge
- **Cloud computation** — geometric calculations on high-performance servers
- **Cloud storage** — all data on secure cloud servers
- **Any device** — access from desktop, laptop, tablet, or any device with a browser
- **Deployment options** — public cloud, private cloud, or hybrid cloud

### Project Structure

1. **Log in** to CrownCAD
2. The **Project Management Interface** provides:
   - **Create new project** — first step for part documentation
   - Within projects, create: **Part, Assembly, Drawing, Folder**
   - **Data conversion** — import/export STEP, IGES, and mainstream CAD formats
   - **Collaborative design** — share and co-edit models

## Part Design

### Creating a New Part

1. In the Project Management Interface, click **New Project**
2. Within the project, click **New > Part**
3. The part modeling environment opens
4. Three default planes appear: XY (Front), XZ (Top), YZ (Right)

### Sketching

Sketching is the foundation of 3D modeling in CrownCAD:

1. **Select a plane** — click on XY, XZ, or YZ
2. **Enter sketch mode** — click the Sketch button
3. **Draw using sketch tools:**
   - **Line** — straight segments
   - **Rectangle** — by corner or center
   - **Circle** — by center and radius
   - **Arc** — by center, start, end, or 3-point
   - **Polygon** — regular polygons
   - **Spline** — smooth curves through points
   - **Fillet** — round sketch corners
   - **Offset** — offset curves inward or outward
   - **Mirror** — mirror sketch entities
   - **Trim** — trim unwanted segments

4. **Add constraints:**
   - **Coincident** — points share the same location
   - **Horizontal/Vertical** — lines constrained to horizontal or vertical
   - **Parallel/Perpendicular** — line relationships
   - **Tangent** — line tangent to arc/circle
   - **Equal** — equal length or radius
   - **Concentric** — arcs/circles share the same center
   - **Midpoint** — point at the midpoint of a line

5. **Add dimensions:**
   - **Linear** — horizontal, vertical, or aligned
   - **Angular** — angle between two lines
   - **Radial/Diametric** — circle or arc size
   - Type the dimension value and press Enter

6. **Exit sketch** — the sketch is saved and can be used for features

### Sketch Best Practices

- **Use constraints before dimensions** — geometric constraints reduce the number of dimensions needed
- **Fully define sketches** — all lines should be black (defined), not blue (under-defined)
- **Keep sketches simple** — one feature per sketch is easier to manage
- **Use construction geometry** — construction lines for reference, not for creating features

### Creating Features

From sketches, create 3D features:

#### Extrude

1. **Select a sketch** (or a face of an existing solid)
2. **Click Extrude**
3. Set parameters:
   - **Distance** — extrusion depth
   - **Direction** — one direction, symmetric, or two directions
   - **Operation** — New Body, Add, Subtract, or Intersect
   - **Draft angle** — taper the extrusion
4. Click **OK** to create the feature

#### Revolve

1. **Select a sketch profile**
2. **Select an axis** — a line in the sketch or an edge
3. **Click Revolve**
4. Set the angle (360 degrees for full, or partial)
5. Choose the operation (New, Add, Subtract, Intersect)

#### Sweep

1. **Create a profile sketch** — the cross-section
2. **Create a path sketch** — the trajectory (on a different plane)
3. **Click Sweep**
4. Select the profile and path
5. Set options (guide curves, twist)

#### Loft

1. **Create multiple sketch profiles** on different planes
2. **Click Loft**
3. Select profiles in order
4. Set options (guide curves, start/end conditions)

### Additional Features

- **Hole** — create standard holes (simple, tapered, counterbore, countersink)
- **Fillet** — round edges with constant or variable radius
- **Chamfer** — create angled edges
- **Shell** — hollow out a solid, leaving specified wall thickness
- **Rib** — create reinforcing ribs
- **Pattern** — rectangular, circular, or curve pattern of features
- **Mirror** — mirror features or bodies

### Feature Tree

The feature tree shows all operations in order:
1. Each feature is listed with its name and type
2. **Edit a feature** — double-click to modify parameters
3. **Reorder features** — drag to change order (may cause errors if dependencies break)
4. **Suppress features** — temporarily disable without deleting
5. **Roll back** — move the rollback bar to see the model at any point in the history

## Assembly Modeling

### Creating a New Assembly

1. In a project, click **New > Assembly**
2. The assembly environment opens
3. **Insert components** — browse to parts or sub-assemblies and insert them

### Inserting Components

1. **Click Insert Component**
2. Browse the project for parts
3. Select a part and click to place it in the assembly
4. The first component is typically **fixed** (anchored in place)
5. Additional components are **floating** until constrained

### Mates (Assembly Constraints)

Mates define how components relate to each other:

1. **Click Mate**
2. Select mate type:
   - **Coincident** — two faces or planes become flush
   - **Concentric** — two cylindrical faces share the same axis
   - **Distance** — faces/planes separated by a specified distance
   - **Angle** — faces/planes at a specified angle
   - **Parallel** — faces/planes are parallel
   - **Perpendicular** — faces/planes are perpendicular
   - **Tangent** — cylindrical face tangent to planar face
   - **Width** — center a component between two faces
3. Select the faces/edges on each component
4. The mate is applied and the component moves accordingly

### Standard Mate Combinations

- **Hole and shaft** — Concentric (axes aligned) + Coincident (faces flush)
- **Hinge** — Concentric (pin axis) + Coincident (faces) + limits (rotation angle)
- **Slider** — Coincident (faces) + Parallel (edges) + limits (travel distance)

### Assembly Tools

- **Move Component** — drag unconstrained components
- **Rotate Component** — rotate unconstrained components
- **Collision Detection** — check for interferences during movement
- **Measure** — measure distances and angles between components
- **Section View** — cut the assembly to see internal components

### Bill of Materials (BOM)

1. **Insert BOM** — generates a parts list from the assembly
2. The BOM includes:
   - Item number
   - Part name
   - Quantity
   - Part number
   - Description
3. The BOM updates automatically when components are added or removed

## 2D Drawings

### Creating a Drawing

1. In a project, click **New > Drawing**
2. Select a sheet size and template
3. **Insert views:**
   - **Standard views** — Front, Top, Right, Isometric
   - **Projected views** — project from an existing view
   - **Section view** — cut through the model
   - **Detail view** — zoom into a specific area
4. **Add dimensions** — auto-dimension or manual
5. **Add annotations** — notes, symbols, GD&T
6. **Add title block** — fills with part metadata

### Drawing Best Practices

- Use consistent view orientations
- Dimension from a datum or baseline
- Use section views for internal features
- Add GD&T for critical tolerances
- Keep the drawing clean and readable

## Common Issues

### Sketch Won't Solve

- Over-constrained sketch — remove a constraint or dimension
- Conflicting constraints — check for contradictory relationships
- Under-constrained — add constraints until fully defined

### Feature Fails

- Sketch not closed — ensure the profile is a closed loop
- References missing — a referenced edge or face was deleted
- Reorder the feature — move it earlier in the tree

### Assembly Mates Conflict

- Over-constrained component — too many mates remove all freedom
- Conflicting mates — two mates require contradictory positions
- Use the mate diagnostic tool to identify problems

## Best Practices

- **Plan the feature tree** — think about the order of operations before starting
- **Name features meaningfully** — "Base Extrude" not "Extrude 1"
- **Use configurations** — create different versions of a part (sizes, options)
- **Fully define sketches** — prevents unexpected changes
- **Use standard mates** — avoid complex mate combinations
- **Check for interferences** — run collision detection in assemblies
- **Create 2D drawings** — even in a 3D world, drawings are needed for manufacturing
- **Leverage collaboration** — use CrownCAD's real-time co-editing for team projects
- **Save versions** — use the version control to track design milestones
