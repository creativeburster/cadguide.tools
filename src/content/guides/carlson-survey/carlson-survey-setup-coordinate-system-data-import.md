---
title: "Carlson Survey Setup: Coordinate Systems, Data Import, and Project Configuration"
excerpt: "How to set up a Carlson Survey project from scratch — covering coordinate system selection, raw data import from total stations and GPS, point database management, and project settings."
category: "deployment"
softwareSlug: "carlson-survey"
keyword: "carlson survey setup coordinate system data import"
slug: "carlson-survey-setup-coordinate-system-data-import"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://files.carlsonsw.com/mirror/manuals/Carlson_2022/source/Tutorials/Geodetic_Reports/Geodetic_Report.html"
  - "https://www.cadapult-software.com/wp-content/uploads/2021/01/Carlson_Survey_2021_TOC_Sample.pdf"
---

# Carlson Survey Setup: Coordinate Systems, Data Import, and Project Configuration

Carlson Survey runs on top of AutoCAD or IntelliCAD and handles field-to-finish survey workflows. I've used it for boundary surveys, topographic surveys, and construction staking. The setup is critical — get the coordinate system wrong and every point will be off. Here's the complete setup process.

## Step 1: Create a New Project

1. Open Carlson Survey (within AutoCAD or IntelliCAD).
2. **Settings** → **Project** → **New Project**.
3. Enter:
   - **Project name**: e.g., "Smith_Boundary_2026"
   - **Project folder**: Where all project files will be stored
   - **Template**: Select a project template with standard settings

4. Carlson creates the project folder structure:
   - `\Data\` — Raw data files
   - `\Drawings\` — DWG files
   - `\Points\` — Point database
   - `\Reports\` — Output reports
   - `\Coordinates\` — Coordinate files

## Step 2: Set the Coordinate System

This is the most critical step. An incorrect coordinate system means all points are in the wrong location.

1. **Settings** → **Coordinate System**.
2. Select the coordinate system:
   - **US State Plane**: Select the state and zone (e.g., "Texas North Central Zone (NAD83)")
   - **UTM**: Select the UTM zone (e.g., "UTM Zone 14N")
   - **Local**: Custom local coordinate system (for small sites not tied to a national grid)

3. Set the datum:
   - **NAD83** (North American Datum 1983) — standard for US surveys
   - **NAD27** (older datum — rarely used for new surveys)
   - **WGS84** (World Geodetic System — used for GPS)

4. Set the geoid model:
   - **GEOID18** (latest US geoid model)
   - This is used for orthometric height (elevation) calculations from GPS ellipsoid heights

5. Set the units:
   - **US Survey Feet** (standard for most US surveys)
   - **International Feet** (used in some states)
   - **Meters** (standard outside the US)

6. Verify the coordinate system:
   - Carlson displays the zone parameters (central meridian, false easting, false northing, scale factor)
   - Verify these match your project location

## Step 3: Configure Point Database

Carlson stores all survey points in a project database (CRD file).

1. **Settings** → **Point Defaults**.
2. Set:
   - **Point numbering**: Start at 1, increment by 1
   - **Description format**: Set the description key file (maps raw descriptions to coded descriptions)
   - **Coordinate precision**: 3 decimal places (0.001 ft)
   - **Elevation precision**: 2 decimal places (0.01 ft)

3. **Settings** → **Description Keys**:
   - Create description keys that map field codes to full descriptions:
     - `UP` → "Utility Pole"
     - `EP` → "Edge of Pavement"
     - `CL` → "Centerline"
     - `MON` → "Monument"
     - `TREE` → "Tree"

   - Each description key can also specify:
     - **Layer**: Which layer the point is placed on
     - **Symbol**: Which block/symbol is used for the point
     - **Text**: How the description is displayed

## Step 4: Import Raw Field Data

### From Total Station (Raw Data File)

1. **Survey** → **Field to Finish** → **Import Raw Data**.
2. Select the raw data file format:
   - **Carlson RW5**: Carlson's raw data format
   - **TDS CR5**: TDS raw data format
   - **Sokkia RAW**: Sokkia raw data format
   - **Leica GSI**: Leica raw data format
   - **Trimble RAW**: Trimble raw data format

3. Set import options:
   - **Process traverses**: Automatically compute traverse adjustments
   - **Apply description keys**: Map field codes to descriptions
   - **Create drawing entities**: Automatically draw lines, curves, and symbols based on field codes

4. Click **Import**.
5. Carlson processes the raw data:
   - Reads each observation (angle, distance, elevation)
   - Computes coordinates from the raw observations
   - Applies description keys
   - Creates points in the CRD database
   - Draws entities in the DWG

### From GPS/GNSS (Coordinate File)

1. **Survey** → **Import Coordinates**.
2. Select the coordinate file format:
   - **CSV**: Comma-separated values (Northing, Easting, Elevation, Description)
   - **TXT**: Space or tab-separated
   - **Carlson CRD**: Carlson point database

3. Set column mapping:
   - **Point number**: Column 1
   - **Easting**: Column 2
   - **Northing**: Column 3
   - **Elevation**: Column 4
   - **Description**: Column 5

4. Click **Import**.
5. Carlson creates points in the database and draws them in the DWG.

### From Data Collector

1. **Survey** → **Data Collector Transfer**.
2. Select the data collector type:
   - **Carlson Explorer**: Direct connection
   - **Trimble TSC7**: Via Trimble Business Center export
   - **Sokkia SHC5000**: Via Sokkia software export

3. Connect the data collector via USB or Bluetooth.
4. Transfer the raw data file.
5. Process with Field to Finish (same as Step 4 above).

## Step 5: Traverse Adjustment

After importing raw traverse data:

1. **Survey** → **Traverse Adjustment**.
2. Select the traverse:
   - **Starting point**: Known point (benchmark or control point)
   - **Ending point**: Known point (closing point)
   - **Traverse legs**: List of points in the traverse

3. Select adjustment method:
   - **Compass Rule**: Distributes angular and linear error proportionally (most common)
   - **Transit Rule**: Similar to Compass but weights differently
   - **Crandall's Rule**: Preserves distances, adjusts angles (for traverses with high angular precision)
   - **Least Squares**: Statistical adjustment (most rigorous — requires redundant observations)

4. Set closure tolerance:
   - **Angular**: 30 seconds × √(number of stations)
   - **Linear**: 1:10,000 (ratio of traverse length to closure error)

5. Click **Adjust**.
6. Carlson computes the adjustment:
   - Displays the closure error (angular and linear)
   - Applies the correction to each point
   - Updates the point coordinates in the database

7. Review the adjustment report:
   - **Closure ratio**: Should be better than the specified tolerance
   - **Per-point corrections**: How much each point moved
   - If the closure is poor, check for data entry errors or bad observations

## Step 6: Create Drawing Entities

After points are imported and adjusted:

1. **Survey** → **Field to Finish** → **Process**.
2. Carlson processes the field codes and creates drawing entities:
   - **Lines**: Connected by point codes (e.g., "EP1" to "EP2" draws a line)
   - **Curves**: Created from three-point curve codes
   - **Symbols**: Placed at point locations based on description keys
   - **Text**: Point number, elevation, and description placed at each point

3. Review the drawing:
   - Check that all field-coded features are drawn
   - Verify symbols match the description keys
   - Check for missing connections (uncoded points)

## Step 7: Generate Reports

1. **Report** → **Survey Reports**.
2. Select reports to generate:
   - **Point list**: All points with coordinates and descriptions
   - **Traverse report**: Closure and adjustment details
   - **Raw data report**: All field observations
   - **Coordinate report**: Final adjusted coordinates

3. Set output format: PDF, Excel, or text file.
4. Click **Generate**.

5. These reports are part of the survey deliverable and should be archived with the project.

## Common Setup Issues

**Points appear in wrong location**: The coordinate system is wrong. Verify the state plane zone or UTM zone matches the project location. Check the datum (NAD83 vs NAD27).

**Description keys don't apply**: The description key file path is wrong or the field codes don't match. Verify that the field codes in the raw data match the description key definitions.

**Traverse doesn't close**: Check for:
- Incorrect backsight bearing
- Data entry errors in angles or distances
- Missing observations
- Wrong starting or closing coordinates

**Import fails**: The file format is wrong or the file is corrupted. Try exporting from the data collector in a different format (e.g., CSV instead of proprietary format).
