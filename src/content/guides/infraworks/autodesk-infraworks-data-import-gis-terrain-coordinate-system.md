---
title: "Autodesk InfraWorks Data Import and Model Setup: GIS, Terrain, and Coordinate Systems"
excerpt: "InfraWorks models start with importing the right data: terrain models, GIS shapefiles, aerial imagery, and Civil 3D drawings. I cover the data import workflow, coordinate system configuration, managing large datasets, and optimizing model performance for infrastructure projects."
category: "workflow"
softwareSlug: "infraworks"
keyword: "Autodesk InfraWorks data import GIS terrain coordinate system model setup performance"
slug: "autodesk-infraworks-data-import-gis-terrain-coordinate-system"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://knowledge.autodesk.com/support/infraworks/learn-explore/caas/CloudHelp/cloudhelp/ENU/InfraWorks-DataExchange/files/InTheCollection/InfraWorks-DataExchange-InTheCollection-CivilStructuresWorkflows-html-html.html"
  - "https://www.autodesk.com/learn/ondemand/curated/roadway-and-bridge-modeling-in-civil-3d-and-infraworks"
---

# Autodesk InfraWorks Data Import and Model Setup: GIS, Terrain, and Coordinate Systems

I've set up InfraWorks models for projects ranging from small intersections to 50-kilometer highway corridors. The quality of the model depends entirely on the data you import — accurate terrain, current imagery, and complete GIS data make the difference between a useful preliminary design tool and a misleading visualization. Getting the data setup right at the beginning saves hours of rework later.

## Creating a New Model

### Model Builder (Cloud-Based)

1. File → New Model → Model Builder
2. Define the area of interest by:
   - Drawing a polygon on the map
   - Entering coordinates
   - Selecting a city or address
3. InfraWorks connects to Autodesk's cloud data services
4. It automatically downloads:
   - **Terrain**: DEM data for the specified area
   - **Imagery**: Bing Maps aerial photography
   - **Roads**: OpenStreetMap road networks
   - **Buildings**: 3D building footprints (where available)
   - **Water bodies**: Rivers, lakes, and coastlines
5. The model is generated in the cloud and downloaded

### Manual Model Creation

1. File → New Model
2. Set the **Model Extent** (the geographic area)
3. Select the **Coordinate System** (critical for accurate georeferencing)
4. Create an empty model
5. Import data sources manually

## Coordinate Systems

### Selecting the Right Coordinate System

1. When creating a model, InfraWorks asks for the coordinate system
2. Choose the appropriate system for your project location:
   - **US State Plane**: For US projects (e.g., NAD83 State Plane California Zone III)
   - **UTM zones**: For international projects
   - **National grid systems**: For UK (OSGB), Australia (MGA), etc.
3. The coordinate system affects all data imports — mismatched systems cause data to appear in wrong locations

### Verifying Coordinate Systems

1. After import, check that all data appears in the correct location
2. If data appears offset or in the wrong place:
   - Check the data source's coordinate system
   - Use **Reproject** option during import to convert to the model's coordinate system
   - Verify the coordinate system definition matches the project requirements

## Data Sources

### Terrain Data

1. **Data Sources** → **Terrain** → **Raster**
2. Supported formats: DEM, GeoTIFF, TIN, ASCII grid
3. Configure:
   - **Coordinate system**: Must match or be reprojected
   - **Resolution**: Higher resolution = more detail but slower performance
4. Click **Refresh** to import the terrain

### Imagery

1. **Data Sources** → **Image** → **Raster**
2. Supported formats: GeoTIFF, MrSID, ECW, JPEG2000
3. Or use built-in Bing Maps imagery (no import needed)
4. For high-resolution orthophotography:
   - Import the orthophoto as a raster data source
   - Configure resolution and coordinate system
   - The imagery drapes over the terrain

### GIS Vector Data (Shapefiles)

1. **Data Sources** → **Vector** → **Shapefile**
2. Supported formats: SHP, GeoJSON, KML, GML
3. Configure:
   - **Coordinate system**: Must match or be reprojected
   - **Feature mapping**: Map shapefile attributes to InfraWorks features
   - **Style**: Assign 3D styles (buildings, roads, pipes, etc.)
4. Common GIS imports:
   - **Roads**: Map to InfraWorks road features
   - **Buildings**: Map to building features with height attributes
   - **Property boundaries**: Map to coverage areas
   - **Utilities**: Map to pipe or cable features

### Civil 3D Drawings

1. **Data Sources** → **AutoCAD DWG**
2. Import Civil 3D DWG files with:
   - Alignments
   - Profiles
   - Surfaces
   - Pipe networks
   - Corridors (as 3D solids)
3. Configure:
   - **Coordinate system**: Usually matches the model
   - **Layers**: Select which layers to import
   - **Feature mapping**: Map Civil 3D objects to InfraWorks features

### Point Clouds

1. **Data Sources** → **Point Cloud**
2. Supported formats: LAS, LAZ, RCP, RCS
3. Point clouds provide high-resolution existing conditions
4. Configure:
   - **Density**: Reduce density for better performance
   - **Classification**: Filter by ground, vegetation, buildings
5. Point clouds can be used to generate terrain surfaces

### 3D Models

1. **Data Sources** → **3D Model**
2. Supported formats: FBX, OBJ, DAE, SKP
3. Import existing 3D models of buildings, bridges, or structures
4. Position the model geographically

## Managing Data Sources

### The Data Sources Panel

1. Window → Data Sources
2. All imported data sources are listed
3. Each source can be:
   - **Enabled/Disabled**: Toggle visibility
   - **Configured**: Change settings
   - **Refreshed**: Reload from the source file
   - **Removed**: Delete from the model

### Performance Optimization

For large models with many data sources:

1. **Reduce model extent**: Only include the area you need
2. **Disable unused data sources**: Turn off layers not currently needed
3. **Reduce imagery resolution**: Lower resolution imagery loads faster
4. **Simplify terrain**: Use coarser DEM data for overview models
5. **Limit point cloud density**: Reduce point count for better performance
6. **Use clip areas**: Restrict data display to specific areas

### Refreshing Data

When source data changes:
1. Right-click the data source → **Refresh**
2. InfraWorks reloads the data from the source file
3. Any changes in the source file appear in the model
4. This is useful for collaborative workflows where GIS data is updated

## Common Import Issues

### Data Appears in Wrong Location

- Check coordinate system of the data source
- Use the **Reproject** option during import
- Verify the model's coordinate system is correct
- Check for datum mismatches (NAD27 vs. NAD83)

### Terrain Has Incorrect Elevations

- Verify the DEM file's vertical units (meters vs. feet)
- Check the coordinate system's vertical datum
- Compare imported elevations against known benchmark points

### Shapefile Attributes Don't Map Correctly

- Review the feature mapping during import
- Ensure attribute names match InfraWorks expectations
- Manually map fields if automatic mapping fails

### Model Is Slow After Import

- Disable unnecessary data sources
- Reduce terrain resolution
- Reduce imagery resolution
- Limit point cloud density
- Reduce model extent

### Civil 3D Data Missing Features

- Check that Civil 3D objects are on visible layers
- Verify the DWG coordinate system matches the InfraWorks model
- Ensure Civil 3D objects are properly defined (not just AutoCAD entities)
- Try importing as a different data source type

## Best Practices

1. **Start with Model Builder** for quick context, then refine with detailed data
2. **Always verify coordinate systems** before importing data
3. **Use the highest resolution terrain** available for the area of interest
4. **Import current imagery** — Bing Maps imagery may be several years old
5. **Organize data sources** by category (terrain, imagery, roads, utilities)
6. **Document data sources** — keep track of where each dataset came from
7. **Refresh data regularly** if source data is updated during the project
8. **Clip data to the area of interest** to improve performance

## Summary

InfraWorks models start with data import. Use Model Builder for quick context (terrain, imagery, roads, buildings), then refine with detailed data sources. Always set the correct coordinate system when creating the model — mismatched coordinate systems are the most common import issue. Import terrain as DEM or TIN, imagery as GeoTIFF or use built-in Bing Maps, GIS data as shapefiles, and Civil 3D data as DWG files. Manage data sources through the Data Sources panel, where you can enable, disable, configure, and refresh each source. For large models, optimize performance by reducing terrain resolution, limiting point cloud density, and disabling unused data sources. Always verify that imported data appears in the correct geographic location after each import.
