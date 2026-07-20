---
title: "Autodesk InfraWorks Roadway Design: Corridors, Intersections, and Coverage Areas"
excerpt: "InfraWorks roadway design tools create preliminary road corridors, intersections, and roundabouts in a real-world geographic context. I cover the road design workflow, adding roads from scratch or importing alignments, intersection modeling, and adjusting road profiles and cross-sections."
category: "workflow"
softwareSlug: "infraworks"
keyword: "Autodesk InfraWorks roadway design corridors intersections roundabouts coverage areas"
slug: "autodesk-infraworks-roadway-design-corridors-intersections"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-22"
sources:
  - "https://knowledge.autodesk.com/support/infraworks/learn-explore/caas/CloudHelp/cloudhelp/ENU/InfraWorks-DataExchange/files/InTheCollection/InfraWorks-DataExchange-InTheCollection-CivilStructuresWorkflows-html-html.html"
  - "https://www.autodesk.com/learn/ondemand/curated/roadway-and-bridge-modeling-in-civil-3d-and-infraworks"
  - "https://www.autodesk.com/autodesk-university/class/Practical-Application-of-InfraWorks-for-Bridge-Modelling-and-Design-2023"
---

# Autodesk InfraWorks Roadway Design: Corridors, Intersections, and Coverage Areas

I've used InfraWorks for preliminary roadway design on highway, urban, and rural projects. InfraWorks excels at creating realistic infrastructure models in their geographic context — you can design roads, bridges, and site features on real terrain with satellite imagery, then share the model with stakeholders for visual review before detailed design in Civil 3D.

## InfraWorks in the Infrastructure Workflow

InfraWorks sits at the preliminary design stage of the infrastructure workflow:

1. **Data collection**: Import GIS data, terrain models, and existing conditions
2. **InfraWorks**: Create preliminary road, bridge, and site designs in context
3. **Civil 3D**: Detailed alignment, profile, and corridor design
4. **Revit**: Detailed structural design for bridges and structures
5. **InfraWorks**: Updated model for visualization and stakeholder review

Autodesk's documentation describes the workflow: "Use the publish civil structures command in Autodesk InfraWorks to send parametric bridges or tunnels to Autodesk Civil 3D or Autodesk Revit."

## Setting Up the Model

### Creating a New Model

1. File → New Model
2. Define the model extent (area of interest)
3. Set the coordinate system
4. InfraWorks downloads terrain and imagery data for the specified area

### Importing Data

1. **Terrain**: Import DEM, TIN, or point cloud data
2. **Imagery**: Connect to Bing Maps or import aerial photography
3. **GIS Data**: Import Shapefiles for existing roads, buildings, property boundaries
4. **Civil 3D Data**: Import DWG files with alignments, surfaces, and pipe networks

## Road Design

### Adding Roads from Scratch

1. Click **Road** in the InfraWorks toolbar
2. Click points on the terrain to define the road centerline
3. The road is created with a default cross-section
4. Continue clicking to extend the road
5. Double-click or press Enter to finish

### Selecting Road Style

1. After drawing the road, select it
2. Right-click → **Properties**
3. In the **Style** dropdown, choose the road type:
   - **Street**: Urban road with sidewalks
   - **Road**: Rural road with shoulders
   - **Highway**: Multi-lane divided highway
   - **Freeway**: High-speed highway with ramps
   - **Roundabout**: Circular intersection
4. The cross-section updates to match the selected style

### Importing Alignments from Civil 3D

1. Import the Civil 3D DWG file
2. InfraWorks recognizes alignments and profiles
3. Right-click the alignment → **Create Road from Alignment**
4. Select the road style
5. The road follows the exact alignment and profile from Civil 3D

### Adjusting Road Profiles

1. Select the road
2. Right-click → **Profile**
3. The profile view shows the existing ground and the proposed road profile
4. Adjust the profile:
   - Add PVI (Point of Vertical Intersection)
   - Modify vertical curve lengths
   - Adjust elevations
5. The 3D model updates in real-time

### Adjusting Cross-Sections

1. Select the road
2. Right-click → **Cross-Section**
3. View the cross-section at any station
4. Modify:
   - Lane width
   - Shoulder width
   - Sidewalk width
   - Median width
   - Slopes and ditches
5. Changes can apply to the entire road or specific stations

## Intersections

### Creating Intersections

1. Draw two roads that cross
2. InfraWorks automatically creates an intersection at the crossing point
3. Select the intersection
4. Right-click → **Properties**
5. Configure intersection type:
   - **At-Grade Intersection**: Standard crossing
   - **Interchange**: Grade-separated with ramps
6. Adjust turning movements, lane configurations, and curb returns

### Roundabouts

1. Click **Roundabout** in the toolbar
2. Click at the intersection location
3. InfraWorks generates a roundabout with:
   - Central island
   - Circulating roadway
   - Entry and exit lanes
   - Splitter islands
4. Adjust the inscribed circle diameter and lane widths
5. Approach roads connect automatically

### Interchanges

For highway interchanges:
1. Draw the main highway
2. Draw ramp roads connecting to local roads
3. InfraWorks generates ramp connections
4. Select the interchange area
5. Choose interchange type (diamond, cloverleaf, directional)

## Coverage Areas

Coverage areas define land use and surface materials:

1. Click **Coverage Area** in the toolbar
2. Draw a polygon on the terrain
3. Select the coverage type:
   - **Pavement**: For parking lots and paved areas
   - **Grass**: For parks and landscaping
   - **Gravel**: For unpaved surfaces
   - **Water**: For ponds and water features
   - **Forest**: For wooded areas
4. The coverage area applies the selected material to the terrain

## Site Design

### Buildings

1. Click **Building** in the toolbar
2. Draw a footprint or select from GIS data
3. Set building height and style
4. Useful for visual context in urban road projects

### Pipe Networks

1. Click **Pipe** in the toolbar
2. Draw pipe runs along the road
3. Add manholes and structures
4. Connect to existing utility data from GIS

### Earthworks

InfraWorks calculates cut and fill volumes:
1. Select the road or coverage area
2. Right-click → **Earthworks**
3. View cut and fill volumes
4. Adjust profiles to balance earthwork

## Sharing and Collaboration

### Publishing to Civil 3D

1. Select the road or bridge
2. Right-click → **Publish to Civil 3D**
3. The alignment, profile, and corridor data are sent to Civil 3D
4. In Civil 3D, the data appears for detailed design

### Publishing to Revit

1. Select a bridge or structure
2. Right-click → **Publish to Revit**
3. The parametric bridge model is sent to Revit
4. Bridge attributes match between InfraWorks, Civil 3D, and Revit

Autodesk's documentation notes: "You'll notice that the bridge attributes for selected components, shown in Revit Properties, match the attributes for this bridge in Civil 3D and InfraWorks."

### Cloud Sharing

1. File → Share → Cloud
2. Upload the model to Autodesk Docs
3. Team members can view the model in a web browser
4. Stakeholders can explore the 3D model without InfraWorks

## Common Issues

### Road Doesn't Follow Terrain

- Check that terrain data is properly imported
- Verify the road's **Follow Terrain** setting is enabled
- Adjust the profile to match the ground line

### Intersection Geometry Looks Wrong

- Verify road widths are compatible
- Check that road styles match at the intersection
- Manually adjust curb return radii

### Model Performance Is Slow

- Reduce the model extent to the area of interest
- Turn off unnecessary data sources
- Reduce imagery resolution
- Use **Model Builder** to generate a smaller, focused model

## Summary

InfraWorks roadway design starts with importing terrain and GIS data, then drawing roads on the real-world context. Select road styles (street, highway, freeway) to define cross-sections. Adjust profiles and cross-sections in the Properties panel. InfraWorks automatically creates intersections at road crossings and supports roundabouts and interchanges. Use coverage areas to define land use and surface materials. Publish roads to Civil 3D for detailed design and bridges to Revit for structural design. The key advantage of InfraWorks is designing infrastructure in its real-world geographic context with terrain, imagery, and GIS data — providing stakeholders with a realistic visual model before detailed design begins.
