---
title: "ARES Commander GIS Tools: Importing Shapefiles and Coordinate Transformation"
excerpt: "How to use ARES Commander's built-in GIS tools to import ESRI Shapefiles, transform coordinate systems, and export georeferenced DWG files for surveying and planning workflows."
category: "workflow"
softwareSlug: "ares-commander"
keyword: "ares commander gis shapefile coordinate transformation"
slug: "ares-commander-gis-shapefile-coordinate-transformation"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://www.graebert.com/cad-software/ares-map/"
  - "https://www.esri.com/partners/gr-bert-gmbh-a2T390000003DubEAE/ares-map-a2d3900000049BRAAY"
---

# ARES Commander GIS Tools: Importing Shapefiles and Coordinate Transformation

Most 2D CAD tools treat GIS data as an afterthought. ARES Commander actually ships with proper GIS tools — coordinate system assignment, shapefile import, and georeferenced export. I used it on a site development project where the surveyor delivered shapefiles in a state plane coordinate system and we needed everything in UTM. Here's the workflow.

## What ARES Commander GIS Tools Include

- **Coordinate system library** — 4,000+ predefined CRS definitions (EPSG database)
- **Shapefile import** — Reads .shp, .shx, .dbf files with attribute data
- **Coordinate transformation** — On-the-fly reprojection between CRS
- **GeoTIFF import** — Georeferenced raster images
- **WMS/WFS connection** — Connect to OGC web map/feature services
- **Attribute export** — Export DWG object data back to shapefile format

## Step 1: Assign a Coordinate System to Your Drawing

Before importing GIS data, assign a CRS to the host drawing:

1. Type `GEOGRAPHICLOCATION` or go to **Insert** → **GIS** → **Set Geographic Location**.
2. ARES Commander displays the CRS selection dialog.
3. Search by EPSG code or name (e.g., "EPSG:2276" for Texas Central) or browse by country/region.
4. Select the CRS and click **OK**.
5. ARES Commander inserts a coordinate system marker at the drawing origin.

The drawing is now georeferenced. Any GIS data imported will be transformed to this CRS automatically.

## Step 2: Import a Shapefile

1. Go to **Insert** → **GIS** → **Import Shapefile**.
2. Browse to the .shp file (the .shx and .dbf must be in the same folder).
3. The import dialog shows:
   - **Source CRS** — The coordinate system of the shapefile. Set this to match the shapefile's metadata. If unknown, check the .prj file (a text file in the same folder with the CRS definition).
   - **Target CRS** — Automatically set to the drawing's CRS. If they differ, ARES Commander performs the transformation on import.
   - **Object type** — Choose how to map shapefile geometry:
     - Points → Block references or Points
     - Lines → Polylines
     - Polygons → Closed Polylines or Hatches
   - **Attribute mapping** — Shapefile DBF attributes can be attached as extended entity data (XDATA) or object data tables.

4. Click **Import**.

The shapefile geometry appears in the drawing, positioned correctly relative to the drawing's coordinate system.

## Step 3: Transform Between Coordinate Systems

If you need to change the drawing's CRS (e.g., from State Plane to UTM):

1. Type `GEOGRAPHICLOCATION` → **Modify**.
2. Select a new CRS from the library.
3. ARES Commander asks: "Transform existing geometry to the new coordinate system?"
4. Click **Yes**.

All geometry in the drawing is reprojected to the new CRS. This is a mathematical transformation — not a scale or offset — so accuracy is maintained.

**Important**: Text and annotations are repositioned but not rescaled. If your annotations were sized for a specific map scale, you may need to adjust text heights after transformation.

## Step 4: Import GeoTIFF Imagery

1. Go to **Insert** → **GIS** → **Import GeoTIFF**.
2. Select a .tif file (must have a .tfw world file or embedded GeoTIFF metadata).
3. Set the source CRS if not embedded in the file.
4. Click **OK**.

The image is inserted at the correct geographic position and scale. If the image's CRS differs from the drawing's CRS, ARES Commander reprojects the image on import.

For large GeoTIFFs (>100 MB), set the image quality to **Draft** during editing and switch to **High** for final plotting. This prevents display lag.

## Step 5: Export Georeferenced DWG

When sending the DWG to a GIS user or another CAD system:

1. The CRS information is stored in the DWG file automatically.
2. To verify, type `GEOGRAPHICLOCATION` and check the displayed CRS.
3. To export as a shapefile: **File** → **Export** → **Shapefile**.
4. Select the objects to export (or all objects).
5. Choose the geometry type (Point, Line, Polygon).
6. Map DWG properties to shapefile attributes (e.g., Layer → Attribute field "LAYER").
7. Click **Export**.

The exported shapefile includes a .prj file with the CRS definition, making it directly usable in QGIS, ArcGIS, or any GIS application.

## Common Issues

**Shapefile appears in wrong location**: The source CRS was set incorrectly. Check the .prj file — open it in a text editor and compare the CRS name/code with what you selected in the import dialog.

**Coordinate transformation accuracy**: ARES Commander uses the EPSG database for transformation parameters. For most applications, accuracy is within 1 meter. For surveying-grade work, verify transformation parameters against known control points.

**Large shapefiles slow performance**: Shapefiles with 50,000+ features can slow ARES Commander. Import only the features you need by using the **Filter** option in the import dialog (e.g., filter by attribute value).
