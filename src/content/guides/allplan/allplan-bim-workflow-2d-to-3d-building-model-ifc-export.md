---
title: "Allplan BIM Workflow: From 2D Drawings to 3D Building Models and IFC Export"
excerpt: "A practical guide to Allplan's BIM workflow covering 2D-to-3D conversion, parametric building elements, reinforcement modeling, quantity takeoff, and IFC export for cross-platform collaboration."
category: "workflow"
softwareSlug: "allplan"
keyword: "allplan bim workflow"
slug: "allplan-bim-workflow-2d-to-3d-building-model-ifc-export"
author: "CADGuide Technical Editorial"
readTime: "13 min read"
date: "2026-06-30"
sources:
  - "https://www.allplan.com/en/help"
  - "https://www.allplan.com/en/products/allplan-architecture"
---

# Allplan BIM Workflow: From 2D Drawings to 3D Building Models and IFC Export

Allplan is Nemetschek's flagship BIM and CAD platform, widely used in Europe for architecture, engineering, and construction. Its strength lies in the seamless transition between 2D drafting and 3D BIM modeling — you can start with 2D plans and progressively build a full BIM model without switching software. This guide covers the complete workflow from 2D drawings to IFC export.

## Project Setup

### Creating a New Project

1. File > New > Project
2. Set project name and location
3. Configure coordinate system:
   - **Local**: For standalone projects
   - **Global/Gauss-Krueger**: For surveying integration
4. Set units: millimeters (metric) or feet/inches (imperial)
5. Set floor structure:
   - Define building stories (e.g., Basement, Ground Floor, Floor 1, Floor 2, Roof)
   - Set elevation for each story (e.g., Basement: -3.000m, Ground: 0.000m, Floor 1: +3.500m)

### Layer and Pen Setup

Allplan uses a pen-based system combined with layers:

1. Format > Pen Settings
2. Configure standard pens:
   - Pen 1: 0.35mm (walls, structure)
   - Pen 3: 0.25mm (secondary elements)
   - Pen 5: 0.15mm (annotations, dimensions)
   - Pen 7: 0.10mm (hatching, details)
3. Format > Layer Settings
4. Create standard layers following a naming convention (e.g., A-WALL, A-DOOR, A-WIND)

## 2D Drawing Preparation

### Importing Existing DWG/DXF

1. File > Import > DWG/DXF
2. Select the file
3. Set import options:
   - **Layers**: Map to Allplan layers
   - **Pens**: Map to Allplan pen numbers
   - **Scale**: Verify 1:1 import
4. Clean up imported geometry:
   - Use Modify > Clean Up to remove duplicates
   - Join fragmented lines with Modify > Join
   - Verify all walls are closed polylines

### Drawing 2D Plans from Scratch

1. Set the current floor (e.g., Ground Floor)
2. Draw walls using Design > Wall:
   - Click start point and end point
   - Or trace over imported 2D geometry
3. Add doors and windows using Design > Opening
4. Add columns, beams, and slabs as needed

## 3D Building Model Creation

### Converting 2D to 3D

Allplan's 2D-to-3D workflow is straightforward:

1. **Walls**: Select 2D wall lines > Design > Wall > Convert to 3D Wall
   - Specify wall thickness, height, and material
   - Allplan generates the 3D wall solid
2. **Slabs**: Select 2D slab outline > Design > Slab > Create
   - Specify thickness and elevation
3. **Openings**: Already placed doors/windows in 2D automatically cut 3D wall geometry

### Parametric Building Elements

Allplan building elements are parametric:

- **Walls**: Adjust thickness, height, material, layer composition after creation
- **Slabs**: Adjust thickness, elevation, openings
- **Columns**: Rectangular, circular, or custom cross-section
- **Beams**: Rectangular or custom profile
- **Roofs**: Pitched, flat, or custom with parametric adjustment

### Editing 3D Elements

1. Select the element in 3D view
2. The Properties palette shows all parameters
3. Change any value (height, thickness, material) and the element updates
4. Use Modify > Stretch to adjust multiple elements simultaneously

## Reinforcement Modeling (Allplan Engineering)

### Adding Reinforcement to Concrete Elements

1. Switch to Engineering module (if licensed)
2. Select a concrete element (slab, wall, beam, column)
3. Design > Reinforcement > Bar
4. Specify:
   - **Bar diameter**: 8mm, 10mm, 12mm, 16mm, 20mm, 25mm
   - **Bar shape**: Straight, L-shaped, U-shaped, stirrup, custom
   - **Cover**: Concrete cover (typically 25-40mm)
   - **Spacing**: Center-to-center distance
5. Allplan generates 3D reinforcement bars within the concrete element

### Reinforcement Schedules

1. Design > Reinforcement > Schedule
2. Select all reinforcement in an element or area
3. Allplan generates a bending schedule with:
   - Bar mark number
   - Shape code
   - Diameter
   - Length
   - Quantity
   - Bending dimensions
4. Export to CSV or PDF for the rebar fabricator

## Quantity Takeoff

### Generating Quantities

1. Tools > Quantity Takeoff
2. Select elements to include (or entire building)
3. Allplan calculates:
   - **Concrete volume**: Per element type (walls, slabs, columns, beams)
   - **Formwork area**: Surface area of concrete elements
   - **Reinforcement weight**: Total steel weight by diameter
   - **Wall area**: By material and thickness
   - **Door/window count**: By type and size
4. Export to Excel or PDF

### Quantity by Layer

For cost estimation by building section:
1. Assign elements to building sections (e.g., Wing A, Wing B)
2. Run quantity takeoff per section
3. Compare costs across sections

## IFC Export

### Configuring IFC Export

1. File > Export > IFC
2. Set IFC version:
   - **IFC 2x3**: Maximum compatibility (recommended)
   - **IFC 4**: Advanced features (for modern BIM tools)
3. Set Model View Definition (MVD):
   - **Coordination View**: Standard for clash detection and coordination
   - **Reference View**: For visual reference in other tools
   - **Design Transfer View**: Full model transfer with properties
4. Select elements to export (all or filtered by layer/type)
5. Set property sets:
   - **Pset_WallCommon**: Fire rating, thermal transmittance, load-bearing
   - **Pset_DoorCommon**: Fire rating, security rating, glazing
   - Custom property sets as needed

### IFC Export Checklist

Before exporting, verify:
- [ ] All building elements are classified (wall, slab, column, etc.)
- [ ] Materials are assigned to all elements
- [ ] Building stories are correctly defined with elevations
- [ ] Coordinates match the project survey point
- [ ] Property sets are populated with relevant data
- [ ] No duplicate or overlapping elements
- [ ] File size is reasonable (< 500MB for coordination)

### Importing IFC into Revit

1. In Revit: Insert > Link IFC
2. Select the Allplan-exported IFC file
3. The model appears with element classifications preserved
4. Use Revit's Coordination Settings to map IFC categories to Revit categories

## Views and Drawing Generation

### Creating Floor Plans

1. Views > Floor Plan
2. Select the floor/story
3. Set display options:
   - **Visible elements**: Walls, doors, windows, dimensions, annotations
   - **Hidden elements**: 3D-only elements like roof structure
4. The floor plan is generated from the 3D model
5. Add dimensions, annotations, and text

### Creating Sections

1. Views > Section
2. Draw the section line on a floor plan
3. Specify viewing direction and depth
4. Allplan generates the section view from the 3D model
5. Add section annotations and dimensions

### Creating Elevations

1. Views > Elevation
2. Select the building face (North, South, East, West, or custom)
3. Allplan generates the elevation from the 3D model
4. Add elevation annotations

### Layout and Plotting

1. Layouts > New Layout
2. Set paper size (A3, A2, A1, A0)
3. Insert views: drag floor plans, sections, elevations onto the layout
4. Set scale for each view (1:50, 1:100, etc.)
5. Add title block and north arrow
6. File > Plot to print or export to PDF

## Conclusion

Allplan's BIM workflow from 2D to 3D is one of the most efficient in the industry, particularly for teams transitioning from traditional 2D drafting to BIM. The ability to convert 2D plans into parametric 3D building elements, add reinforcement, generate quantity takeoffs, and export to IFC for cross-platform collaboration covers the complete AEC workflow. By following this guide — set up the project, prepare 2D drawings, convert to 3D, add reinforcement, generate quantities, export to IFC, and produce drawing sets — you can leverage Allplan's full BIM capabilities for professional building projects.
