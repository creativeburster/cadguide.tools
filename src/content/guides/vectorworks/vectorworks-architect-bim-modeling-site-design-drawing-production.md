---
title: "Vectorworks Architect: BIM Modeling, Site Design, and Drawing Production Workflow"
excerpt: "A comprehensive guide to Vectorworks Architect covering BIM modeling tools, site terrain design, parametric building elements, Heliodon analysis, and construction drawing production with worksheets and schedules."
category: "workflow"
softwareSlug: "vectorworks"
keyword: "vectorworks architect bim workflow"
slug: "vectorworks-architect-bim-modeling-site-design-drawing-production"
author: "CADGuide Technical Editorial"
readTime: "13 min read"
date: "2026-06-30"
sources:
  - "https://app-help.vectorworks.net/architect/"
  - "https://www.vectorworks.net/en-US/architect"

---

# Vectorworks Architect: BIM Modeling, Site Design, and Drawing Production Workflow

Vectorworks Architect is a BIM and CAD platform popular in landscape architecture, interior design, and architectural practices — particularly in the entertainment and event design sectors. Its flexible modeling approach combines 2D drafting, 3D BIM, and site design tools in one application. This guide covers the complete architectural workflow.

## Project Setup

### Creating a New Project

1. File > New
2. Select a template (e.g., "Architectural Metric" or "Architectural Imperial")
3. Set drawing units: Format > Units > set to millimeters or feet/inches
4. Set drawing area size to accommodate the site scale

### Layer and Class System

Vectorworks uses a dual organization system:
- **Layers**: Control Z-elevation and visibility (similar to AutoCAD layers but with height)
- **Classes**: Control appearance (color, lineweight, pen style) across all layers

#### Standard Layer Setup

| Layer | Z-Elevation | Purpose |
|-------|------------|---------|
| Site-Existing | 0 | Existing site conditions |
| Site-Proposed | 0 | Proposed site modifications |
| Floor-1 | 0 | Ground floor |
| Floor-2 | +3500 | Second floor |
| Roof | +7000 | Roof elements |
| Annotations | +7000 | Text, dimensions, notes |

#### Standard Class Setup

| Class | Color | Lineweight | Purpose |
|-------|-------|-----------|---------|
| A-Wall | Red | 0.35mm | Walls |
| A-Door | Green | 0.25mm | Doors |
| A-Wind | Green | 0.25mm | Windows |
| A-Slab | Blue | 0.25mm | Slabs |
| A-Roof | Magenta | 0.25mm | Roof |
| A-Anno | Yellow | 0.15mm | Annotations |
| A-Dims | White | 0.15mm | Dimensions |

## BIM Modeling

### Walls

1. Building > Wall Tool
2. Select wall style from the Resource Manager (or create custom)
3. Wall styles include:
   - **Exterior wall**: Multiple layers (finish, insulation, structure)
   - **Interior wall**: Single layer (drywall + studs)
   - **Concrete wall**: Solid concrete with reinforcement options
4. Click start point and end point to draw the wall
5. Walls are parametric — adjust height, thickness, and style in the Object Info palette

### Doors and Windows

1. Building > Door Tool / Window Tool
2. Select style from Resource Manager
3. Click on a wall to insert
4. The opening is automatically cut
5. Adjust parameters in Object Info palette:
   - Width, height, sill height
   - Swing direction (doors)
   - Glazing type, mullion layout (windows)

### Slabs

1. Building > Slab Tool
2. Draw the slab outline (closed polygon)
3. Set:
   - Thickness: e.g., 200mm
   - Top elevation: e.g., 0
   - Components: Multi-layer (finish, insulation, structural)
4. Add slab drainage (slope) for outdoor slabs

### Roofs

1. Building > Roof Face Tool (single slope) or Roof Tool (multi-slope)
2. Draw the roof outline
3. Specify:
   - Pitch: e.g., 6:12 or 30°
   - Overhang: e.g., 600mm
   - Roof components: shingles, underlayment, sheathing, framing
4. For complex roofs, use the Roof Tool to create hip, gable, or mansard automatically

### Columns and Beams

1. Building > Column Tool
2. Select column style (rectangular, circular, custom)
3. Set dimensions and material
4. Place at grid intersections or custom locations

1. Building > Beam Tool
2. Draw the beam path
3. Set cross-section dimensions and material

## Site Design

### Site Model Creation

1. Site > Site Model Tool
2. Import or draw 3D spot elevations (points with Z values)
3. Vectorworks generates a 3D terrain surface from the points
4. Set:
   - **Existing site**: Current terrain before construction
   - **Proposed site**: Modified terrain after grading

### Grading and Earthworks

1. Site > Grade Tool
2. Draw proposed contour lines
3. Vectorworks calculates cut/fill volumes between existing and proposed
4. Generate a cut/fill report:
   - Total cut volume (m³)
   - Total fill volume (m³)
   - Net import/export volume

### Site Modifiers

1. Site > Pad Tool — create a flat building pad
2. Site > Retaining Wall Tool — create a retaining wall that modifies terrain
3. Site > Path Tool — create a path or road that adjusts terrain
4. Each modifier updates the proposed site model automatically

### Heliodon (Sun Analysis)

1. View > Heliodon
2. Set:
   - **Location**: Latitude/longitude or city selection
   - **Date**: Month and day
   - **Time**: Hour of day
3. Vectorworks shows sun position and shadows on the 3D model
4. Animate shadows throughout the day for shadow study
5. Export shadow study as animation (MOV or sequence of images)

## Drawing Production

### Viewports

Vectorworks uses viewports to display 3D model views on 2D sheet layers:

1. View > Create Viewport
2. Set:
   - **View type**: Plan, section, elevation, isometric, perspective
   - **Scale**: 1:50, 1:100, etc.
   - **Layer visibility**: Which layers are visible
   - **Class visibility**: Which classes are visible
3. The viewport is placed on a sheet layer
4. Double-click the viewport to edit annotations (dimensions, text, leaders)

### Sheet Layers

1. Tools > Organization > Sheet Layers
2. Create sheet layers for each drawing:
   - A-001: Title sheet
   - A-100: Ground floor plan
   - A-101: Second floor plan
   - A-200: Elevations
   - A-300: Sections
   - A-400: Details
3. Set paper size (A1, A2, A3) and orientation

### Title Blocks

1. Resource Manager > Import Title Block
2. Select a standard title block symbol
3. Link fields to project data (project name, drawing number, scale, date)
4. Place the title block on each sheet layer

### Dimensions

1. Dims/Notes > Dimension Tool
2. Select dimension type (linear, angular, radial, ordinate)
3. Click on geometry in the viewport
4. Set dimension standard (ISO, ANSI, or custom)
5. Dimensions are associative to the viewport geometry

## Worksheets and Schedules

### Door/Window Schedule

1. Tools > Reports > Create Report
2. Select object type: Doors (or Windows)
3. Choose fields:
   - ID, Width, Height, Sill Height, Type, Material, Fire Rating
4. Vectorworks generates a worksheet with all doors/windows
5. Place the worksheet on a sheet layer as a schedule

### Area Calculations

1. Tools > Reports > Create Report
2. Select: Spaces (or Rooms)
3. Choose fields:
   - Room name, Area (m²), Floor finish, Occupancy
4. The worksheet auto-calculates areas from the 3D model
5. Update the model and the worksheet refreshes

### Material Takeoff

1. Tools > Reports > Create Report
2. Select: Walls (or Slabs, Roofs)
3. Choose fields:
   - Type, Length, Area, Volume, Material
4. Generate a material quantity takeoff worksheet

## IFC Export

1. File > Export > IFC
2. Set IFC version: IFC 2x3 (recommended)
3. Set MVD: Coordination View
4. Select which objects to export
5. Configure property sets
6. Export

## Rendering

### Built-in Rendering

1. View > Rendering > Renderworks (if licensed)
2. Select render mode:
   - **Fast Renderworks**: Quick preview
   - **Final Quality Renderworks**: Presentation quality
   - **Custom Renderworks**: Full control over all settings
3. Set:
   - **Lighting**: Heliodon, ambient, or custom lights
   - **Background**: Sky gradient, solid color, or image
   - **Shadows**: On/Off, softness

### Panoramic Render

1. View > Rendering > Panoramic Render
2. Set camera position in the 3D model
3. Vectorworks generates a 360° panoramic image
4. Export as equirectangular image for VR viewing

## Conclusion

Vectorworks Architect provides a flexible BIM workflow that combines 2D drafting, 3D modeling, site design, and drawing production in one application. Its strengths in site modeling, landscape design, and entertainment-industry workflows differentiate it from Revit and ArchiCAD. The dual layer/class system, viewport-based drawing production, and integrated Renderworks provide a complete design-to-documentation workflow. By following this guide — set up layers and classes, model building elements, design the site, create viewports and sheets, generate schedules, and export to IFC — you can leverage Vectorworks Architect for professional architectural projects.
