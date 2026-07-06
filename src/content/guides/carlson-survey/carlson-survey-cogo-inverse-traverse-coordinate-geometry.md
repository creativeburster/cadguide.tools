---
title: "Carlson Survey COGO: Inverse, Traverse, and Coordinate Geometry Calculations"
excerpt: "How to use Carlson Survey's COGO tools for coordinate geometry calculations — covering inverse traverses, intersection calculations, area by coordinates, and curve calculations for boundary surveys."
category: "workflow"
softwareSlug: "carlson-survey"
keyword: "carlson survey cogo inverse traverse coordinate geometry"
slug: "carlson-survey-cogo-inverse-traverse-coordinate-geometry"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://files.carlsonsw.com/mirror/manuals/Carlson_2015/source/Survey/COGO/Inverse/Inverse.htm"
  - "http://files.carlsonsw.com/mirror/manuals/Carlson_2017/source/Survey/COGO/Traverse/Traverse.htm"
---

# Carlson Survey COGO: Inverse, Traverse, and Coordinate Geometry Calculations

COGO (Coordinate Geometry) is the mathematical backbone of surveying. Carlson's COGO tools handle all the calculations surveyors need — inverses, intersections, areas, and curves. I use these daily for boundary work. Here's the complete guide.

## Inverse (Inverse Calculation)

An inverse calculates the bearing and distance between two known points.

1. **Survey** → **COGO** → **Inverse**.
2. Enter:
   - **From point**: Point number (e.g., 101)
   - **To point**: Point number (e.g., 102)

3. Carlson displays:
   - **Bearing**: N 45°23'15" E
   - **Distance**: 125.432 ft
   - **Delta N (ΔN)**: 88.234 ft
   - **Delta E (ΔE)**: 88.890 ft
   - **Slope distance**: If elevations are known
   - **Grade**: If elevations are known

4. Use cases:
   - Check the distance between two monuments
   - Verify a property line bearing
   - Calculate the direction of a traverse leg

### Inverse by Direction

For a series of points along a line:

1. **Survey** → **COGO** → **Inverse by Direction**.
2. Enter a series of point numbers: 101, 102, 103, 104.
3. Carlson displays a table:
   - Each leg's bearing and distance
   - Cumulative distance
   - Total distance

This is useful for calculating the total length of a property boundary or road centerline.

## Traverse (Coordinate Calculation)

A traverse calculates a new point's coordinates from a known point, bearing, and distance.

1. **Survey** → **COGO** → **Traverse**.
2. Enter:
   - **From point**: Known point (e.g., 101)
   - **Bearing**: N 45°23'15" E (or select by clicking two points in the drawing)
   - **Distance**: 125.432 ft
   - **To point**: New point number (e.g., 105)

3. Carlson calculates:
   - **Northing**: N101 + ΔN
   - **Easting**: E101 + ΔE
   - **Elevation**: Optional (if slope and vertical angle are entered)

4. The new point is created in the database and drawn in the DWG.

### Use Cases
- Set a point on a property line at a specific distance from a monument
- Calculate the location of a corner from a deed description
- Extend a centerline to a new point

## Intersection Calculations

### Bearing-Bearing Intersection

Finds the intersection point of two lines defined by bearings from known points.

1. **Survey** → **COGO** → **Intersect** → **Bearing-Bearing**.
2. Enter:
   - **Point 1**: Starting point of first line (e.g., 101)
   - **Bearing 1**: N 45° E
   - **Point 2**: Starting point of second line (e.g., 102)
   - **Bearing 2**: S 30° E

3. Carlson calculates the intersection point and creates it in the database.

### Use Cases
- Find a property corner where two deed lines intersect
- Calculate the intersection of two road centerlines
- Determine the location where a fence line crosses a property line

### Distance-Distance Intersection

Finds the intersection point(s) of two circles centered on known points.

1. **Survey** → **COGO** → **Intersect** → **Distance-Distance**.
2. Enter:
   - **Point 1**: Center of first circle (e.g., 101)
   - **Distance 1**: Radius of first circle (e.g., 100 ft)
   - **Point 2**: Center of second circle (e.g., 102)
   - **Distance 2**: Radius of second circle (e.g., 80 ft)

3. Carlson calculates two possible intersection points (circles intersect at two points).
4. Select the correct one based on the field situation.

### Use Cases
- Find a monument from two distance measurements (e.g., "100 ft from corner 1, 80 ft from corner 2")
- Set out a point from two reference marks

### Bearing-Distance Intersection

Finds the intersection of a line (from a point with a bearing) and a circle (from a point with a radius).

1. **Survey** → **COGO** → **Intersect** → **Bearing-Distance**.
2. Enter the line and circle parameters.
3. Carlson calculates the intersection point(s).

## Area Calculation

### Area by Coordinates

1. **Survey** → **COGO** → **Area by Coordinates**.
2. Enter the point numbers defining the polygon: 101, 102, 103, 104, 101 (close).
3. Carlson calculates:
   - **Area**: 12,345.67 sq ft (or acres, hectares, sq m)
   - **Perimeter**: 567.89 ft
   - **Number of sides**: 4

### Area by Lines

1. **Survey** → **COGO** → **Area by Lines**.
2. Select lines in the drawing that form a closed polygon.
3. Carlson calculates the area enclosed by the selected lines.

### Use Cases
- Calculate the area of a parcel for a deed description
- Determine the acreage of a surveyed boundary
- Calculate the area of a subdivision lot

## Curve Calculations

### Curve from PC, PI, Radius

1. **Survey** → **COGO** → **Curve**.
2. Enter:
   - **PC (Point of Curve)**: Starting point
   - **PI (Point of Intersection)**: Intersection of tangents
   - **Radius**: Curve radius (e.g., 100 ft)

3. Carlson calculates:
   - **PT (Point of Tangent)**: End of curve
   - **Delta angle**: Central angle of the curve
   - **Arc length**: Length along the curve
   - **Chord length**: Straight-line distance from PC to PT
   - **Tangent length**: Distance from PC to PI
   - **External distance**: Distance from PI to curve midpoint

### Curve from PC, PT, Radius

1. Enter PC and PT point numbers and the radius.
2. Carlson calculates all curve parameters and the curve direction (left or right).

### Use Cases
- Calculate road curve geometry from field data
- Set out curve points for construction staking
- Verify curve data on a plat or deed

## Lot and Parcel Calculations

### Lot by Area

1. **Survey** → **COGO** → **Lot by Area**.
2. Define a lot by:
   - **Front line**: Along a road (select two points)
   - **Side lines**: Perpendicular or at a specified angle to the front line
   - **Target area**: e.g., 0.5 acres

3. Carlson calculates the lot dimensions that achieve the target area.
4. This is useful for subdivision design where lot sizes are specified.

### Lot by Frontage

1. Define a lot by:
   - **Front line**: Along a road
   - **Frontage width**: e.g., 50 ft
   - **Depth**: e.g., 120 ft

2. Carlson creates the lot corners and calculates the area.

## Station-Offset Calculations

1. **Survey** → **COGO** → **Station-Offset**.
2. Define a baseline (centerline) by selecting two points or a polyline.
3. Enter:
   - **Station**: Distance along the baseline (e.g., 5+00 for 500 ft)
   - **Offset**: Distance perpendicular to the baseline (e.g., 25 ft right)

4. Carlson calculates the coordinate of the station-offset point.

### Use Cases
- Set out construction stakes along a road centerline
- Calculate the position of a utility line at a specific station and offset
- Report the station and offset of a surveyed point relative to a baseline

## Best Practices

1. **Always verify calculations**: After a COGO calculation, inverse between the new point and known points to verify the distances match the deed or plan.

2. **Document all calculations**: Keep a COGO report listing every calculation, the input values, and the results. This is part of the survey record.

3. **Use point descriptions**: When creating new points via COGO, add a description (e.g., "CALC-INT", "SET-PROP-CORNER") to distinguish calculated points from field-measured points.

4. **Check for blunders**: If a COGO result seems unreasonable (wrong direction, unexpected distance), check the input values. A transposed number or wrong bearing direction is the most common error.

5. **Save intermediate points**: Don't delete intermediate calculation points — they document how the final coordinates were derived.
