---
title: "Bluebeam Revu Quantity Takeoff: Measurements, Count Tools, and Excel Export"
excerpt: "A guide to performing quantity takeoff from PDF drawings in Bluebeam Revu covering scale calibration, length/area/volume measurements, count tools for fixtures, dynamic fill for irregular areas, and export to Excel for estimating."
category: "workflow"
softwareSlug: "bluebeam-revu"
keyword: "bluebeam revu quantity takeoff"
slug: "bluebeam-revu-quantity-takeoff-measurements-count-tools-excel-export"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://support.bluebeam.com/articles/category/revu-measurements/"
  - "https://www.bluebeam.com/product/revu/"
---

# Bluebeam Revu Quantity Takeoff: Measurements, Count Tools, and Excel Export

Bluebeam Revu's measurement tools turn PDF drawings into a quantity takeoff platform. Without needing the original CAD files, estimators can measure lengths, areas, volumes, and counts directly from PDF plans. This guide covers the complete takeoff workflow from scale calibration to Excel export.

## Scale Calibration

### Setting the Drawing Scale

Before any measurement, calibrate the scale:

1. Tools > Measurement > Calibrate
2. Click two points on a known dimension (e.g., a dimension line showing 5000mm)
3. Enter the actual distance: 5000
4. Set the unit: millimeters, meters, feet, inches
5. Click OK
6. Revu now knows the scale of the drawing

### Multiple Scales (Detail Drawings)

If a PDF contains drawings at different scales:
1. Calibrate the main drawing scale
2. For detail drawings at a different scale:
   - Navigate to the detail page
   - Tools > Measurement > Calibrate
   - Set a separate scale for that page
3. Revu stores per-page scales

### Verifying Scale

After calibration:
1. Use the Length tool to measure a known dimension
2. Verify the measurement matches the dimension text
3. If it doesn't match, recalibrate — the PDF may have been printed at a non-standard scale

## Length Measurements

### Basic Length

1. Tools > Measurement > Length
2. Click start point and end point
3. Revu displays:
   - **Length**: Total distance
   - **Delta X, Delta Y**: Component distances
   - **Angle**: Direction angle
4. The measurement appears in the Markups List

### Polylength (Multi-Segment)

1. Tools > Measurement > Polylength
2. Click multiple points to create a multi-segment line
3. Press Enter to finish
4. Revu displays:
   - **Total length**: Sum of all segments
   - **Segment lengths**: Each individual segment

### Use Cases for Length Takeoff

- **Pipe runs**: Measure total pipe length from plans
- **Cable/conduit**: Measure electrical runs
- **Baseboards/trims**: Measure perimeter lengths
- **Ductwork**: Measure duct runs
- **Fencing**: Measure fence lines
- **Road markings**: Measure line painting

## Area Measurements

### Area Tool

1. Tools > Measurement > Area
2. Click points to define a closed polygon
3. Press Enter to close
4. Revu displays:
   - **Area**: Enclosed area (m² or ft²)
   - **Perimeter**: Boundary length
   - **Point count**: Number of vertices

### Dynamic Fill (Irregular Areas)

For irregular shapes (landscape areas, curved walls):
1. Tools > Measurement > Dynamic Fill
2. Click inside the area to measure
3. Revu automatically detects the boundary and fills the area
4. Adjust the boundary by dragging points if needed
5. The area is calculated automatically

### Area from Existing Polygon

1. If the PDF has a closed shape (e.g., a room outline):
2. Tools > Measurement > Area
3. Click on each corner of the shape
4. Close the polygon
5. Area and perimeter are calculated

### Use Cases for Area Takeoff

- **Floor finishes**: Tile, carpet, wood flooring areas
- **Wall areas**: Length × height for painting, tiling, cladding
- **Roof areas**: Plan area with slope adjustment
- **Paving/landscape**: Outdoor surface areas
- **Excavation footprint**: Area to be excavated
- **Waterproofing**: Area of waterproofing application

## Volume Measurements

### Volume Tool

1. Tools > Measurement > Volume
2. Draw an area polygon (same as Area tool)
3. Specify the depth (height)
4. Revu calculates: Volume = Area × Depth

### Use Cases for Volume Takeoff

- **Concrete**: Slab volume = area × thickness
- **Excavation**: Volume = area × dig depth
- **Fill material**: Volume = area × fill height
- **Asphalt**: Volume = road area × pavement thickness

## Count Tools

### Basic Count

1. Tools > Measurement > Count
2. Click on each item to count (e.g., doors, light fixtures, outlets)
3. Each click places a count symbol and increments the counter
4. The Markups List shows the total count

### Count with Symbol

1. Tools > Measurement > Count
2. In the Properties panel, set:
   - **Symbol**: Choose from the symbol library (door, window, light, outlet, etc.)
   - **Color**: Set symbol color
   - **Size**: Set symbol size
3. Click on each item in the drawing
4. Symbols are placed at each click point

### Count with Measurement

1. After placing count symbols
2. Select all count markups of the same type
3. The Markups List shows:
   - **Count**: Total number
   - **Total measurement**: If each item has an associated length or area

### Use Cases for Count Takeoff

- **Doors**: Count by type (single, double, fire-rated)
- **Windows**: Count by size and type
- **Light fixtures**: Count by type (LED, fluorescent, emergency)
- **Electrical outlets**: Count by type (standard, GFCI, USB)
- **Plumbing fixtures**: Toilets, sinks, faucets
- **HVAC diffusers**: Supply, return, exhaust
- **Structural elements**: Columns, beams, bolts

## Dynamic Fill for Complex Shapes

### How Dynamic Fill Works

1. Tools > Measurement > Dynamic Fill
2. Click inside a closed boundary on the PDF
3. Revu analyzes the surrounding lines and fills the enclosed area
4. The fill color and transparency are adjustable
5. The area is calculated automatically

### Adjusting Dynamic Fill Results

1. If the fill bleeds outside the boundary:
   - Reduce the "Gap" tolerance in Properties
   - Add boundary lines manually to close gaps
2. If the fill doesn't cover the full area:
   - Increase the "Gap" tolerance
   - Click additional points inside the area
3. After adjustment, the area updates automatically

## Organizing Takeoff Data

### Using Layers

1. View > Tabs > Layers
2. Create layers for each trade:
   - **Architectural**: Floor finishes, wall areas
   - **Structural**: Concrete volumes, rebar counts
   - **MEP**: Pipe lengths, duct areas, fixture counts
3. Assign markups to layers
4. Toggle layer visibility to focus on one trade at a time

### Using Spaces

1. Tools > Spaces > Rectangle or Polygon
2. Draw spaces to define rooms or areas
3. Name each space (e.g., "Room 101 — Office", "Corridor A")
4. Assign markups to spaces
5. Generate reports by space

### Using the Markups List for Takeoff

1. Open the Markups List
2. Add custom columns:
   - **Type**: Material category (e.g., "Tile", "Carpet", "Concrete")
   - **Location**: Floor or room
   - **Unit Cost**: Cost per unit
   - **Total Cost**: Quantity × Unit Cost
3. Right-click column header > Add Column
4. Set column type: Text, Number, or Calculated
5. For Calculated columns: set formula (e.g., Quantity × Unit Cost)

## Export to Excel

### CSV Export

1. Markups List > Export > CSV
2. Select columns to include:
   - Page, Subject, Author, Date
   - Measurement (length, area, volume, count)
   - Custom columns (Type, Location, Unit Cost, Total Cost)
3. Save the CSV file
4. Open in Excel for further analysis

### Excel Report Template

Create an Excel template that:
1. Imports the CSV data
2. Groups by Type or Location
3. Calculates subtotals per category
4. Applies unit costs
5. Generates a summary with:
   - Total quantity by type
   - Total cost by trade
   - Cost per square meter of building area

### Summary Report

1. Markups List > Summary
2. Revu generates a summary report:
   - Total measurements by type
   - Count of each markup type
   - Pages with markups
3. Export as PDF for project records

## Batch Takeoff

For multi-sheet drawing sets:
1. File > Batch > Markup Summary
2. Select all PDF files in the drawing set
3. Revu compiles all measurements from all sheets
4. Export as a single CSV with all takeoff data
5. Use for project-wide quantity summary

## Best Practices

1. **Always calibrate scale first** — incorrect scale means incorrect quantities
2. **Verify scale with a known dimension** — don't trust the PDF blindly
3. **Use consistent markup subjects** — "Door-Interior", "Door-Exterior" not just "Door"
4. **Organize by layers and spaces** — enables filtering and reporting by trade/area
5. **Use Dynamic Fill for irregular shapes** — faster than manual polygon tracing
6. **Export to Excel for cost calculation** — Revu is for takeoff, Excel is for estimating
7. **Save takeoff sessions** — use Studio Projects to store and version takeoff PDFs
8. **Double-check counts** — it's easy to miss or double-click items
9. **Use the Count symbol library** — visual verification that all items are marked
10. **Take off by discipline** — do architectural, then structural, then MEP separately

## Conclusion

Bluebeam Revu's measurement tools provide a practical quantity takeoff workflow directly from PDF drawings — no CAD files needed. By calibrating the scale, using length/area/volume/count tools, organizing with layers and spaces, and exporting to Excel, estimators can produce accurate quantity takeoffs efficiently. The Dynamic Fill tool is particularly valuable for irregular areas that would be tedious to trace manually. For construction firms that receive drawings as PDFs, Revu is the most efficient takeoff tool available — combining measurement, markup, and collaboration in one application.
