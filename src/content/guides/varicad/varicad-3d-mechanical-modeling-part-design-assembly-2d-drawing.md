---
title: "VariCAD 3D Mechanical Modeling: Part Design, Assembly, and 2D Drawing Generation"
excerpt: "A comprehensive guide to 3D mechanical modeling in VariCAD covering sketch-based part design, profile extrusion and revolution, assembly creation, and automatic 2D drawing generation from 3D models."
category: "workflow"
softwareSlug: "varicad"
keyword: "varicad 3d mechanical modeling"
slug: "varicad-3d-mechanical-modeling-part-design-assembly-2d-drawing"
author: "CADGuide Tools Editorial Team"
readTime: "13 min read"
date: "2026-06-30"
sources:
  - "https://www.varicad.com/en/home/"
  - "https://www.youtube.com/@VariCADSystem"
---

# VariCAD 3D Mechanical Modeling: Part Design, Assembly, and 2D Drawing Generation

VariCAD is a 3D mechanical CAD application developed in the Czech Republic, optimized for mechanical engineering and product design. It provides parametric 3D modeling, assembly design, and automatic 2D drawing generation at a competitive price. This guide covers the complete workflow from sketch to finished drawing.

## Interface Overview

VariCAD's interface is task-oriented:

- **Menu bar**: File, Edit, View, Tools, 3D, 2D, Assembly, Sheet Metal, etc.
- **Toolbar**: Left side, context-sensitive tool buttons
- **Command line**: Bottom, accepts typed commands and shows prompts
- **Tree view**: Right side, shows assembly structure and feature history
- **Status bar**: Cursor coordinates, snap settings

### Key Concepts

VariCAD uses a hybrid approach:
- **3D Mode**: Create and edit 3D solids and assemblies
- **2D Mode**: Create 2D drawings (either from 3D or standalone)
- **You switch between modes** using the tabs at the bottom of the screen

## Sketch-Based Part Design

### Creating a Sketch

1. Select a plane (XY, XZ, or YZ) or a planar face on existing geometry
2. Tools > Sketch > New Sketch
3. Draw 2D geometry on the sketch plane:
   - Lines, arcs, circles, rectangles, polygons
   - Use snapping to existing geometry
4. Apply dimensions and constraints to fully define the sketch

### Sketch Constraints

VariCAD supports sketch constraints:
- **Horizontal/Vertical**: Constrain line direction
- **Parallel/Perpendicular**: Constrain line relationships
- **Tangent**: Constrain line-to-arc or arc-to-arc
- **Concentric**: Constrain circle/arc centers
- **Equal**: Constrain equal lengths or radii
- **Symmetric**: Constrain symmetry about a line
- **Dimensional**: Driving dimensions (linear, angular, radial)

### Fully Defining Sketches

A sketch is fully defined when all geometry is constrained and dimensioned. VariCAD shows:
- **Green**: Fully constrained
- **White/Black**: Under-constrained (can be dragged)
- **Red**: Over-constrained or conflicting

## Creating 3D Solids from Sketches

### Extrusion

1. Create a closed sketch profile
2. Tools > 3D > Extrude
3. Select the profile
4. Specify:
   - **Distance**: Extrusion depth
   - **Direction**: Normal to sketch or custom
   - **Draft angle**: 0 for straight, or angle for tapered walls
   - **Symmetric**: Extrude both directions from sketch plane

### Revolution

1. Create a sketch profile (cross-section)
2. Draw or select a revolution axis
3. Tools > 3D > Revolve
4. Select profile and axis
5. Specify angle (360° for full, or partial)

### Sweep

1. Create a sketch profile (cross-section)
2. Create a path (sketch or 3D curve)
3. Tools > 3D > Sweep
4. Select profile and path
5. The profile is swept along the path

### Loft

1. Create multiple sketch profiles on different planes
2. Tools > 3D > Loft
3. Select profiles in order
4. The solid transitions between profiles

## Boolean Operations

### Adding Material (Union)

1. Tools > 3D > Boolean > Add
2. Select the base solid
3. Select the solid to add
4. They merge into one solid

### Removing Material (Subtract)

1. Tools > 3D > Boolean > Cut
2. Select the base solid
3. Select the tool solid (cutter)
4. The tool volume is removed

### Intersection

1. Tools > 3D > Boolean > Intersect
2. Select two or more solids
3. Only the overlapping volume remains

## Feature Editing

### Fillet

1. Tools > 3D > Fillet
2. Select edges (or faces to fillet all edges)
3. Specify radius
4. Constant or variable radius

### Chamfer

1. Tools > 3D > Chamfer
2. Select edges
3. Specify distance and angle (or two distances)

### Hole Features

1. Tools > 3D > Hole
2. Select a planar face
3. Specify:
   - **Hole type**: Simple, counterbore, countersink, tapped
   - **Diameter**: Hole diameter
   - **Depth**: Through or blind
   - **Position**: Click or use sketch dimensions

### Shell

1. Tools > 3D > Shell
2. Select the solid
3. Specify wall thickness
4. Select faces to remove (open faces)

### Rib

1. Tools > 3D > Rib
2. Select a reference plane
3. Draw the rib profile (sketch)
4. Specify thickness and direction
5. The rib is created and merged with the base solid

## Assembly Design

### Creating an Assembly

1. Tools > Assembly > New Assembly
2. Insert parts:
   - File > Insert Part from File
   - Or select existing parts in the current document
3. Each part appears in the Assembly Tree

### Assembly Constraints

VariCAD supports assembly constraints:

- **Coincident**: Two points or axes are coincident
- **Concentric**: Two cylindrical faces are concentric
- **Planar**: Two planar faces are coplanar (with optional offset)
- **Parallel**: Two faces or edges are parallel
- **Perpendicular**: Two faces or edges are perpendicular
- **Tangent**: Two faces are tangent
- **Distance**: Maintain a specific distance between faces
- **Angle**: Maintain a specific angle between faces

### Applying Constraints

1. Tools > Assembly > Constraints
2. Select constraint type
3. Select the first face/edge on part A
4. Select the second face/edge on part B
5. Specify offset or angle if needed
6. The parts move to satisfy the constraint

### Checking Interference

1. Tools > Assembly > Interference Check
2. Select all parts or specific pairs
3. VariCAD reports interfering volumes
4. Interfering solids are highlighted in red

### Exploded View

1. Tools > Assembly > Exploded View
2. Select parts to explode
3. Specify explosion direction and distance
4. The assembly shows separated components
5. Save the exploded view for drawing generation

## 2D Drawing Generation

### Creating Views from 3D

1. Switch to 2D mode
2. Tools > 2D > Views from 3D
3. Select the 3D part or assembly
4. Choose view types:
   - **Standard**: Front, Top, Right, Isometric
   - **Section**: Full, half, offset section
   - **Detail**: Enlarged view of a specific area
   - **Exploded**: From saved exploded view
5. Place views on the 2D sheet
6. Views are linked to the 3D model — updating the 3D model updates the views

### Section View Creation

1. Tools > 2D > Section View
2. Select the parent view
3. Draw the section line (cutting plane)
4. Specify viewing direction
5. The section view is generated with hatching

### Dimensioning 2D Views

1. Tools > 2D > Dimension
2. Select dimension type (linear, angular, radial, etc.)
3. Click on geometry in the view
4. Place the dimension
5. Dimensions are associative — they update if the 3D model changes

### Bill of Materials (BOM)

1. Tools > 2D > BOM
2. Select the assembly
3. VariCAD generates a parts list with:
   - Item number
   - Part name
   - Quantity
   - Material
   - Custom properties
4. Place the BOM table on the drawing
5. Balloon numbers are automatically linked to the BOM

## Export

### STEP (AP203/AP214)
File > Export > STEP — for CAM, FEA, and other CAD systems

### STL
File > Export > STL — for 3D printing

### DWG/DXF
File > Export > DWG/DXF — for 2D drawing exchange with AutoCAD

### IGES
File > Export > IGES — legacy CAD exchange

## Conclusion

VariCAD provides a complete 3D mechanical design workflow: sketch-based part design, boolean operations, feature editing, assembly design with constraints, and automatic 2D drawing generation with BOM. The parametric link between 3D models and 2D drawings ensures consistency — change the 3D model and the drawings update automatically. While not as feature-rich as SolidWorks or Inventor, VariCAD covers the essential mechanical design workflow at a significantly lower price point, making it a practical choice for small to medium engineering firms.
