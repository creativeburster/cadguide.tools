---
title: "Carlson Survey Point Management: Editing, Merging, and Reporting Survey Points"
excerpt: "How to manage survey points in Carlson Survey — covering point editing, coordinate transformations, point merging from multiple crews, duplicate detection, and generating professional point reports."
category: "workflow"
softwareSlug: "carlson-survey"
keyword: "carlson survey point management editing merging reporting"
slug: "carlson-survey-point-management-editing-merging-reporting"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.carlsonsw.com/support/point-management"
  - "https://www.carlsonsw.com/learn/point-tutorials"
---

# Carlson Survey Point Management: Editing, Merging, and Reporting Survey Points

Managing survey points is a daily task for surveyors. On a typical project, I deal with points from multiple crews, multiple days, and multiple instruments. Carlson's point management tools keep everything organized. Here's the workflow.

## The Carlson Point Database (CRD File)

All points in a Carlson project are stored in a CRD (Coordinate) file:
- **File format**: `.crd` — Carlson's proprietary point database
- **Contents**: Point number, Northing, Easting, Elevation, Description
- **One CRD per project**: All points for a project are in one database
- **Linked to the DWG**: Points in the drawing are linked to the CRD database

## Point Editing

### Edit Single Point

1. **Points** → **Edit Points** → **Edit Single Point**.
2. Enter the point number or click a point in the drawing.
3. The edit dialog shows:
   - **Point number**: Can be renumbered
   - **Northing, Easting, Elevation**: Can be modified
   - **Description**: Can be edited
   - **Layer**: Which layer the point is on

4. Changes update both the CRD database and the drawing simultaneously.

### Edit Multiple Points

1. **Points** → **Edit Points** → **Edit Multiple Points**.
2. Select points by:
   - **Window**: Drag a selection box
   - **Point number range**: Enter 100-200
   - **Description**: Enter "EP" to select all edge-of-pavement points
   - **Layer**: Select all points on a specific layer

3. Batch operations:
   - **Elevate**: Add or subtract a constant from all selected elevations
   - **Scale**: Multiply all coordinates by a factor
   - **Rotate**: Rotate all points around a base point
   - **Translate**: Move all points by a constant offset
   - **Renumber**: Renumber selected points

### Use Cases for Batch Editing

- **Elevation adjustment**: Add 0.05 ft to all GPS points to match a benchmark datum shift
- **Coordinate translation**: Shift all points by 2.0 ft North and 1.5 ft East to correct a setup error
- **Renumbering**: Renumber points from crew B (1000-series) to avoid conflicts with crew A (100-series)

## Coordinate Transformation

When combining data from different coordinate systems or datums:

1. **Survey** → **Coordinate Transformation**.
2. Select:
   - **Source coordinate system**: e.g., NAD27 State Plane
   - **Target coordinate system**: e.g., NAD83 State Plane
   - **Transformation method**: 
     - **Grid**: Direct grid transformation (for small areas)
     - **Surface**: Apply scale factor for ground-to-grid conversion
     - **Helmert**: 7-parameter transformation (for datum shifts)

3. Select points to transform.
4. Carlson calculates new coordinates and creates new points (or overwrites existing).

### Ground-to-Grid Conversion

Surveyors measure distances on the ground, but coordinate systems use grid distances. The difference can be significant:

1. **Combined scale factor**: Grid distance = Ground distance × scale factor
2. The scale factor depends on:
   - **Elevation**: Higher elevation = larger scale factor
   - **Location in zone**: Farther from central meridian = larger scale factor

3. Carlson calculates the combined scale factor automatically based on the project's coordinate system and average elevation.

## Merging Points from Multiple Crews

When multiple crews work on the same project:

### Step 1: Import Each Crew's Data

1. Import crew A's data → points 1-500
2. Import crew B's data → points 1000-1500
3. Import crew C's data → points 2000-2500

4. Use non-overlapping point number ranges to avoid conflicts.

### Step 2: Check for Duplicates

1. **Points** → **Check for Duplicates**.
2. Set tolerance:
   - **Position tolerance**: 0.1 ft (points within 0.1 ft of each other are flagged as duplicates)
   - **Elevation tolerance**: 0.05 ft

3. Carlson identifies duplicate points:
   - Displays a list of suspected duplicates
   - Shows point numbers, coordinates, and descriptions
   - Allows you to keep, delete, or merge each duplicate

4. Common duplicate scenarios:
   - Two crews shot the same monument (keep one, delete the other)
   - Same point shot on different days with slightly different coordinates (average them)

### Step 3: Merge Duplicate Points

1. Select two duplicate points.
2. **Points** → **Merge Points**.
3. Choose merge method:
   - **Average**: New coordinates = average of both points
   - **Keep first**: Keep the first point's coordinates
   - **Keep higher precision**: Keep the point with more decimal places
   - **Weighted average**: Weight by the observation quality

4. The merged point replaces both originals.

## Point Grouping

Organize points into groups for easier management:

1. **Points** → **Point Groups** → **New Group**.
2. Name the group (e.g., "Boundary", "Topo", "Control").
3. Define membership:
   - **By point number**: 1-100
   - **By description**: All points with "MON" description
   - **By layer**: All points on the "CONTROL" layer
   - **Manual**: Select specific points

4. Use groups for:
   - Display control: Show only "Control" points
   - Reporting: Generate a report for "Boundary" points only
   - Exporting: Export only "Topo" points to a data collector
   - Editing: Apply batch operations to a group

## Point Reporting

### Standard Reports

1. **Report** → **Point Reports**.
2. Select report type:
   - **Point list**: All points with coordinates and descriptions
   - **Point list by group**: Points in a specific group
   - **Coordinate list**: Northing and Easting only (for stakeout)
   - **Elevation report**: Points with elevations only
   - **Description report**: Points grouped by description

3. Set output format:
   - **PDF**: Professional report with headers and footers
   - **Excel**: Spreadsheet for further analysis
   - **CSV**: For import into other software
   - **Text**: Plain text for archival

### Custom Reports

1. **Report** → **Custom Report Builder**.
2. Select columns to include:
   - Point number, Northing, Easting, Elevation, Description
   - Code, Date surveyed, Survey method, Instrument
   - Standard deviation (if available from GPS)

3. Set sorting:
   - By point number (default)
   - By description (group similar features)
   - By elevation (for topo analysis)
   - By date surveyed (chronological)

4. Add headers:
   - Project name
   - Survey date
   - Surveyor name
   - Coordinate system
   - Units

5. Save the report template for future use.

### Stakeout Report

1. **Survey** → **Stakeout Report**.
2. Select:
   - **Design points**: Points to be staked (from the design)
   - **Control points**: Known reference points
   - **Stakeout method**: Total station or GPS

3. Carlson generates a stakeout report:
   - For each design point: the coordinates and description
   - For total station: angle and distance from the control point
   - For GPS: coordinates for the rover

4. Export to the data collector or print for the field crew.

## Point Export

1. **Points** → **Export Points**.
2. Select export format:
   - **Carlson CRD**: For another Carlson project
   - **CSV**: For spreadsheets or other software
   - **DXF**: For AutoCAD without Carlson
   - **Data collector formats**: For direct upload to instruments

3. Select points to export:
   - All points
   - Point group
   - Point number range
   - Selected points

4. Set coordinate options:
   - **Include elevation**: Yes/No
   - **Include description**: Yes/No
   - **Coordinate precision**: Number of decimal places

## Best Practices

1. **Back up the CRD file daily**: The CRD file is the most important file in the project. Back it up after every import or edit.

2. **Use consistent point numbering**: Assign number ranges to each crew and each day. This prevents conflicts and makes tracking easier.

3. **Document all edits**: Keep a log of all point edits (who, what, when, why). This is essential for legal surveys where point history matters.

4. **Don't delete points**: Instead of deleting unwanted points, move them to a "deleted" point group. This preserves the point history and allows recovery if needed.

5. **Verify after import**: After importing field data, inverse between known control points to verify the coordinates are correct before proceeding with any calculations.
