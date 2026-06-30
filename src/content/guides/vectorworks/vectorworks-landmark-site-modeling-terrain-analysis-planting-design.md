---
title: "Vectorworks Landmark: Site Modeling, Terrain Analysis, and Planting Design"
excerpt: "A guide to Vectorworks Landmark for landscape architecture covering site model creation from survey data, terrain analysis, planting plans with plant databases, irrigation design, and site amenity layout."
category: "workflow"
softwareSlug: "vectorworks"
keyword: "vectorworks landmark landscape"
slug: "vectorworks-landmark-site-modeling-terrain-analysis-planting-design"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://app-help.vectorworks.net/landmark/"
  - "https://www.vectorworks.net/en-US/products/landmark"
---

# Vectorworks Landmark: Site Modeling, Terrain Analysis, and Planting Design

Vectorworks Landmark is the landscape architecture module of Vectorworks, providing tools for site modeling, terrain analysis, planting design, irrigation, and site amenities. It is widely used by landscape architects, urban planners, and site designers. This guide covers the complete landscape design workflow.

## Site Model Creation

### Importing Survey Data

#### From DWG/DXF

1. File > Import > Import DWG/DXF
2. Select the survey file
3. Set import options:
   - Map survey layers to Vectorworks classes
   - Set coordinate origin to match survey
4. Verify imported contours and spot elevations

#### From 3D Points (CSV/TXT)

1. File > Import > Import ASCII
2. Select a CSV/TXT file with X, Y, Z coordinates
3. Set column mapping (X=easting, Y=northing, Z=elevation)
4. Vectorworks imports the points as 3D loci

#### From GIS Data

1. File > Import > Import Shapefile (SHP)
2. Select the shapefile
3. Map attribute fields to Vectorworks records
4. GIS data includes contours, parcels, and infrastructure

### Generating the Site Model

1. Site > Site Model from Source Data
2. Select the source data (3D points, contours, or both)
3. Set:
   - **Existing site**: Generate the existing terrain
   - **Proposed site**: Generate the proposed terrain (after grading)
4. Vectorworks creates a 3D triangulated surface (TIN model)
5. The site model displays as:
   - **2D contours**: Plan view with contour lines at specified interval
   - **3D mesh**: 3D terrain surface
   - **Both**: Toggle between 2D and 3D display

### Site Model Settings

1. Select the site model
2. Object Info palette > Settings:
   - **Contour interval**: e.g., 0.5m or 1.0m
   - **Major contour**: Every 5th contour shown thicker
   - **Contour smoothing**: Adjust for smoother or more accurate lines
   - **Display mode**: 2D contours, 3D mesh, or both
   - **Exaggeration**: Vertical exaggeration for visualization (default 1.0)

## Terrain Analysis

### Slope Analysis

1. Select the site model
2. Object Info palette > Analysis > Slope
3. Set slope ranges with color coding:
   - 0-5%: Green (gentle, suitable for most uses)
   - 5-10%: Yellow (moderate)
   - 10-15%: Orange (steep, limited use)
   - 15%+: Red (very steep, restricted)
4. Vectorworks generates a color-coded slope map

### Aspect Analysis

1. Select the site model
2. Object Info palette > Analysis > Aspect
3. Set direction categories:
   - N, NE, E, SE, S, SW, W, NW
4. Color-coded map shows slope orientation
5. Useful for solar analysis and planting suitability

### Cut/Fill Analysis

1. Site > Cut and Fill
2. Select existing site model and proposed site model
3. Vectorworks calculates:
   - **Cut volume**: Material to remove
   - **Fill volume**: Material to add
   - **Net volume**: Cut minus fill (positive = export, negative = import)
4. Generate a cut/fill map showing areas of cut (red) and fill (blue)

## Grading Design

### Contour Modification

1. Site > Grade Tool
2. Draw new contour lines for the proposed terrain
3. Connect to existing contours at the boundary
4. Vectorworks updates the proposed site model

### Pad Creation

1. Site > Pad Tool
2. Draw a closed polygon for the building pad or terrace
3. Set:
   - **Elevation**: Finished floor elevation
   - **Slope**: Drainage slope (e.g., 2% away from building)
4. The pad modifies the proposed terrain

### Retaining Walls

1. Site > Retaining Wall Tool
2. Draw the wall path
3. Set:
   - **Top elevation**: High side
   - **Base elevation**: Low side
   - **Wall height**: Height difference
4. The wall modifies the terrain on both sides

### Path and Road

1. Site > Path Tool
2. Draw the path centerline
3. Set:
   - **Width**: Path width
   - **Cross slope**: e.g., 2% for drainage
   - **Longitudinal slope**: e.g., 5% maximum
4. The path adjusts the terrain along its route

## Planting Design

### Plant Database

Vectorworks includes a built-in plant database with thousands of species:

1. Window > Plant Database
2. Search by:
   - **Common name**: e.g., "Oak", "Maple"
   - **Botanical name**: e.g., "Quercus", "Acer"
   - **Climate zone**: USDA hardiness zones
   - **Plant type**: Tree, shrub, groundcover, perennial, annual
   - **Sun exposure**: Full sun, partial shade, shade
   - **Water needs**: Low, medium, high
3. Select a plant and click "Add to Plant List"

### Creating Plant Symbols

1. From the Plant List, select a plant
2. Click "Create Plant Symbol"
3. Configure:
   - **2D appearance**: Plan view symbol (top-down canopy)
   - **3D appearance**: 3D tree or shrub model
   - **Canopy size**: Mature spread (e.g., 8m diameter)
   - **Plant height**: Mature height (e.g., 15m)
4. The plant symbol is saved in the Resource Manager

### Placing Plants

1. Site > Plant Tool
2. Select a plant symbol from the Resource Manager
3. Place by clicking:
   - **Single**: Click to place one plant
   - **Line**: Click two points for a row of plants at specified spacing
   - **Area**: Click a polygon boundary for mass planting at specified density
   - **Polyline**: Draw a path for hedging at specified spacing
4. Set spacing and quantity in the Object Info palette

### Plant Schedule

1. Tools > Reports > Create Report
2. Select object type: Plants
3. Choose fields:
   - Botanical name, Common name, Quantity, Size, Spacing, Water needs
4. Generate a planting schedule worksheet
5. Place on a sheet layer

## Irrigation Design

### Pipe Layout

1. Site > Irrigation > Pipe Tool
2. Draw pipe routes from water source to planting areas
3. Set:
   - **Pipe diameter**: 25mm, 32mm, 40mm, 50mm
   - **Pipe material**: PVC, HDPE, polyethylene
   - **Pressure**: Operating pressure (bar)

### Sprinkler Placement

1. Site > Irrigation > Sprinkler Tool
2. Select sprinkler type:
   - **Spray head**: For small areas (radius 3-5m)
   - **Rotor**: For large areas (radius 8-15m)
   - **Drip emitter**: For targeted watering
3. Place sprinklers to cover planting areas
4. Set spray radius and arc (full, half, quarter)

### Zone Calculation

1. Tools > Reports > Irrigation Report
2. Vectorworks calculates:
   - Water demand per zone
   - Required pipe sizes
   - Pressure at each sprinkler
   - Total system flow rate
3. Verify that supply pressure meets demand

## Site Amenities

### Hardscape

1. Site > Hardscape Tool
2. Draw the hardscape area (patio, walkway, plaza)
3. Set:
   - **Material**: Pavers, concrete, gravel, decking
   - **Pattern**: Running bond, herringbone, radial, custom
   - **Thickness**: e.g., 60mm for pavers
   - **Slope**: Drainage slope (2% typical)

### Site Furniture

1. Site > Site Furniture Tool
2. Select from library:
   - Benches, tables, planters, bollards, lighting
3. Click to place
4. Each item includes 2D and 3D representation

### Fences and Walls

1. Site > Fence Tool
2. Draw the fence path
3. Select fence style (wood, metal, masonry)
4. Set height and post spacing

## Drawing Production

### Site Plan Viewport

1. View > Create Viewport
2. Set view type: Plan
3. Set scale: 1:200 or 1:500 for site plans
4. Show: Existing site, proposed grading, planting, hardscape
5. Add dimensions, annotations, and north arrow

### Planting Plan

1. Create a viewport at 1:100 or 1:50
2. Show: Plants, hardscape edges, building outline
3. Add plant labels (botanical name + quantity)
4. Add planting schedule

### Grading Plan

1. Create a viewport at 1:200
2. Show: Existing contours (dashed), proposed contours (solid)
3. Add spot elevations at key points
4. Add cut/fill quantities as text annotation

## Conclusion

Vectorworks Landmark provides a comprehensive landscape architecture workflow: site model creation from survey data, terrain analysis (slope, aspect, cut/fill), grading design with pads and retaining walls, planting design with a built-in plant database, irrigation layout with hydraulic calculations, and site amenity placement. The integrated 2D/3D approach allows seamless transition from site analysis to construction documentation. By following this workflow, landscape architects can produce professional site design packages — from concept to construction drawings — in a single application.
