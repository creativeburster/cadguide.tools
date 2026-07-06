---
title: "Allplan Drawing Production: Layouts, Title Blocks, Views, and Plotting Standards"
excerpt: "A guide to producing professional construction drawings in Allplan covering layout creation, view placement, title block configuration, dimensioning standards, pen and layer management, and batch plotting to PDF."
category: "printing"
softwareSlug: "allplan"
keyword: "allplan drawing production"
slug: "allplan-drawing-production-layouts-title-blocks-views-plotting"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.allplan.com/en/products/allplan-architecture"

---

# Allplan Drawing Production: Layouts, Title Blocks, Views, and Plotting Standards

Drawing production in Allplan is something I've come to appreciate more and more. The fact that views are generated directly from the 3D model means drawings always reflect the current design — no more forgetting to update a section after moving a wall. Let me walk you through how I set up layouts, title blocks, views, and plotting.

## Layout Setup

### Creating a Layout

1. Layouts > New Layout
2. Set paper size:
   - A0 (841 × 1189mm) — large site plans
   - A1 (594 × 841mm) — standard architectural plans
   - A2 (420 × 594mm) — detail drawings
   - A3 (297 × 420mm) — small details, schedules
3. Set orientation: Portrait or Landscape
4. Set print border margins (typically 10mm)

### Layout Structure

Each layout contains:
- **Title block**: Project information, drawing number, scale, date
- **Views**: Floor plans, sections, elevations, details
- **Annotations**: Dimensions, text, leaders, symbols
- **Schedules**: Door/window schedules, area calculations
- **North arrow and scale bar**

## Title Block Configuration

### Creating a Title Block

1. Layouts > Title Block > New
2. Design the title block geometry:
   - Draw the border and internal panels
   - Add text fields for: Project name, Drawing title, Drawing number, Scale, Date, Drawn by, Checked by, Revision
3. Add attribute fields (linked to project data):
   - Right-click a text field > Link to Project Property
   - Select: ProjectName, DrawingNumber, Scale, Date, Author
4. Save the title block as a reusable template

### Title Block Templates

Create standard title blocks for each project type:
- **Architectural**: With design phase, planning authority fields
- **Structural**: With engineer's stamp, calculation reference
- **Detail**: Compact title block for detail sheets
- **As-built**: With "AS BUILT" watermark and verification fields

## Placing Views on Layouts

### Floor Plan Views

1. Layouts > Insert View > Floor Plan
2. Select the floor/story from the dropdown
3. Set display options:
   - **Visible layers**: Select which layers appear (walls, doors, windows, dimensions, etc.)
   - **Visible element types**: Check walls, openings, furniture, annotations
   - **Cut plane**: Set the cut height (e.g., 1.0m above floor for standard floor plan)
4. Set scale: 1:50, 1:100, 1:200
5. Click on the layout to place the view
6. Drag to reposition as needed

### Section Views

1. Layouts > Insert View > Section
2. Select the section marker from the model (or create a new section)
3. Set display options:
   - **Cut elements**: Solid fill for cut walls, slabs, columns
   - **Behind cut**: Visible edges as solid lines
   - **Far behind cut**: Hidden edges as dashed lines (optional)
4. Set scale (typically same as floor plan: 1:50 or 1:100)
5. Place on layout

### Elevation Views

1. Layouts > Insert View > Elevation
2. Select the elevation direction (North, South, East, West, or custom)
3. Set display options:
   - **Visible elements**: Building facade, ground line, sky
   - **Material hatching**: Optional for elevation drawings
4. Set scale (1:100 typical)
5. Place on layout

### Detail Views

1. Layouts > Insert View > Detail
2. Select the parent view (floor plan or section)
3. Draw a boundary around the area to detail
4. Set detail scale (1:5, 1:10, 1:20)
5. Place the detail on the layout
6. Add a detail label (e.g., "Detail 1 — Scale 1:10")

### 3D Views

1. Layouts > Insert View > 3D View
2. Set camera position and target
3. Set visual style: Wireframe, Hidden lines, Shaded, Realistic
4. Set scale (or set to "Fit to page" for perspective views)
5. Place on layout

## Dimensioning

### Dimension Styles

1. Format > Dimension Style > New
2. Configure:
   - **Text height**: 2.5mm (at 1:50 scale = 125mm in model)
   - **Arrow type**: Architectural tick or closed arrow
   - **Arrow size**: 2.5mm
   - **Extension line offset**: 1mm
   - **Extension line extension**: 2mm
   - **Precision**: 0.0 (metric) or 0'-0 1/16" (imperial)
   - **Tolerance**: None, ± symmetric, or limits

### Placing Dimensions

1. Design > Dimension
2. Select dimension type (linear, angular, radial)
3. Click on geometry in the view (snaps to endpoints, centers)
4. Place the dimension line
5. Dimensions are **associative** — they update when the 3D model changes

### Chain and Baseline Dimensions

- **Chain**: Continuous dimensions from one point to the next
- **Baseline**: All dimensions start from a common origin
- Use Design > Dimension > Chain or Design > Dimension > Baseline

## Annotations and Text

### Text Styles

1. Format > Text Style > New
2. Set font, height, width factor, oblique angle
3. Standard styles:
   - **Body text**: 2.5mm, Arial or Helvetica
   - **Heading**: 5mm, Bold
   - **Title block**: 3mm, Bold
   - **Dimensions**: 2.5mm, Simplex or Arial

### Placing Text

1. Design > Text
2. Click insertion point
3. Enter text
4. Set style and height
5. For multi-line text, use Design > Text > MText

### Leaders and Annotations

1. Design > Leader
2. Click the feature to annotate
3. Draw the leader line
4. Enter the annotation text
5. The leader is linked to the geometry — if the model moves, the leader updates

## Pen and Layer Management

### Pen System

Allplan uses numbered pens (1-99) with assigned lineweights:

| Pen | Lineweight | Use |
|-----|-----------|-----|
| 1 | 0.50mm | Walls (cut), structure |
| 2 | 0.35mm | Secondary walls, columns |
| 3 | 0.25mm | Doors, windows |
| 4 | 0.18mm | Annotations, text |
| 5 | 0.13mm | Dimensions, grid lines |
| 6 | 0.10mm | Hatching, details |
| 7 | 0.00mm | Construction lines (no plot) |

### Layer Management

1. Format > Layer Structure
2. Create layers following a naming convention:
   - A-WALL-EXT, A-WALL-INT, A-DOOR, A-WIND
   - A-ANNO-DIMS, A-ANNO-NOTE, A-ANNO-TTLB
3. Assign pen numbers to layers
4. Set visibility per layout (some layers show only on floor plans, others only on sections)

## Batch Plotting to PDF

### Setting Up Batch Plot

1. File > Plot > Batch Plot
2. Select layouts to plot (check multiple layouts)
3. For each layout, verify:
   - Printer: PDF driver (e.g., "Allplan PDF Export")
   - Paper size: matches layout size
   - Scale: 1:1 (layout is already scaled)
   - Plot style: pen table
4. Set output folder
5. Choose: individual PDFs or combined multi-page PDF
6. Click "Plot"

### PDF Quality Settings

1. In the PDF export dialog, click "Settings"
2. Set:
   - **Resolution**: 300 DPI for drawings, 600 DPI for presentations
   - **Vector output**: Yes (crisper lines, smaller files)
   - **Text as text**: Yes (searchable PDF)
   - **Layer preservation**: Optional (creates PDF layers matching Allplan layers)

## Drawing Standards Checklist

Before issuing drawings, verify:

- [ ] All views are up to date (Tools > Update All Views)
- [ ] Dimensions are placed and legible at the plot scale
- [ ] Text heights are correct for the scale
- [ ] Title block is complete (project, drawing number, scale, date, author)
- [ ] North arrow is present on floor plans
- [ ] Scale bar is present
- [ ] Section and detail markers are consistent across sheets
- [ ] No overlapping views or annotations
- [ ] Lineweights display correctly (check in print preview)
- [ ] All layers set to "no-plot" are correctly configured
- [ ] Revision history is updated

## Wrapping Up

Allplan's drawing production system is solid once you get your templates set up. The associative link between 3D model and 2D views means you never have to worry about a section being out of date. My advice: invest time in configuring your pen system, layer structure, and title blocks in a project template before you start your first real project. That upfront work pays off every time you issue a drawing set.
