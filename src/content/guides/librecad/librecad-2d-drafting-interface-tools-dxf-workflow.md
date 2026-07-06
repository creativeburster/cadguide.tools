---
title: "LibreCAD 2D Drafting: Interface, Tools, and DXF Workflow for Technical Drawings"
excerpt: "A beginner guide to using LibreCAD for 2D technical drafting, covering interface navigation, drawing and modification tools, layer management, and DXF file compatibility with professional CAD systems."
category: "workflow"
softwareSlug: "librecad"
keyword: "librecad 2d drafting"
slug: "librecad-2d-drafting-interface-tools-dxf-workflow"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://librecad.readthedocs.io/en/latest/"
  - "https://wiki.librecad.org/index.php/Main_Page"
---

# LibreCAD 2D Drafting: Interface, Tools, and DXF Workflow for Technical Drawings

LibreCAD is a free, open-source 2D CAD application for Windows, macOS, and Linux. It uses DXF as its native format and is suitable for technical drawings, schematics, and 2D drafting where DWG compatibility is not required. This guide covers the complete workflow from interface setup to drawing production.

## Interface Overview

LibreCAD's interface is minimal and efficient:

- **Menu bar**: File, Edit, View, Select, Draw, Dimension, Modify, Snap, Layer, Block, Options, Help
- **Tool bars**: Left side and top, categorized by function
- **Layer list**: Right side, manage layers and their properties
- **Block list**: Right side, below layers, manage reusable blocks
- **Command line**: Bottom, accepts limited typed input
- **Status bar**: Bottom, shows coordinates and snap status

### Customizing the Interface

1. **Toolbars**: Right-click toolbar area > select which toolbars to show
2. **Background color**: Options > Current Drawing Preferences > Appearance > Background Color
3. **Grid**: Options > Current Drawing Preferences > Grid > toggle and set spacing
4. **Crosshair**: Options > Application Preferences > Appearance > Crosshair Color

## Drawing Tools

### Lines

- **2-Point Line**: Click start and end points
- **Point to Point**: Constrained line between two points
- **Horizontal/Vertical**: Constrained to H/V direction
- **Parallel**: Offset from an existing line
- **Angle**: At a specified angle from a point
- **Bisector**: Bisects the angle between two lines
- **Tangent from Point**: Tangent to a circle from a point
- **Tangent to Circle**: Tangent between two circles
- **Orthogonal**: Perpendicular to an existing line

### Circles and Arcs

- **Center + Radius**: Standard circle
- **Center + Diameter**: Circle by diameter
- **3-Point**: Circle through three points
- **2-Point**: Circle with two points as diameter
- **Tangent**: Circle tangent to two entities
- **Arc**: Center + start + end angle, or 3-point

### Polygons and Polylines

- **Regular Polygon**: Center + radius + number of sides
- **Polyline**: Connected line segments

### Other Entities

- **Ellipse**: Center + major + minor axis
- **Spline**: Control points
- **Text**: Single-line text at a point
- **Hatch**: Fill a closed boundary with a pattern

## Modification Tools

- **Move**: Select entities, specify base and destination
- **Copy**: Same as move, keeps original
- **Rotate**: Select, specify center and angle
- **Scale**: Select, specify base point and factor
- **Mirror**: Select, specify mirror line
- **Offset**: Create parallel at specified distance
- **Trim**: Trim to cutting edge
- **Extend**: Extend to boundary
- **Fillet**: Round corner
- **Chamfer**: Bevel corner
- **Divide**: Split at a point
- **Stretch**: Stretch selected portion
- **Bevel**: Create beveled corner

## Snapping

LibreCAD provides snapping tools accessible from the snap toolbar:

- **Free**: No snapping
- **Endpoint**: Snap to entity endpoints
- **Center**: Snap to circle/arc center
- **Middle**: Snap to midpoint
- **Intersection**: Snap to entity intersections
- **Perpendicular**: Snap perpendicular to entity
- **On Entity**: Snap anywhere on entity
- **Grid**: Snap to grid points
- **Coordinate**: Enter exact coordinates

## Layer Management

### Creating Layers

1. Right-click in the Layer list > Add Layer
2. Enter layer name
3. Click color swatch to set color
4. Click linetype to set linetype
5. Click lineweight to set weight

### Layer Properties

- **Visibility**: Toggle eye icon
- **Lock**: Prevent editing
- **Print**: Toggle printer icon
- **Construction**: Mark as non-printing reference layer

### Standard Layer Setup

| Layer | Color | Lineweight | Purpose |
|-------|-------|-----------|---------|
| A-WALL | Red | 0.35mm | Walls |
| A-DOOR | Green | 0.25mm | Doors |
| A-WIND | Green | 0.25mm | Windows |
| A-ANNO-DIMS | White | 0.15mm | Dimensions |
| A-ANNO-NOTE | Yellow | 0.15mm | Notes |
| A-ANNO-TTLB | White | 0.35mm | Title block |

## DXF File Workflow

### Native Format

LibreCAD uses DXF as its native format:
- **Read**: DXF R12 through R15 (2000), can read R18+ with limitations
- **Write**: DXF R12 and R15 (2000)
- **Recommended save format**: R15 (DXF 2000) for compatibility

### DXF Round-Trip with AutoCAD

| Content Type | AutoCAD → LibreCAD | LibreCAD → AutoCAD |
|-------------|-------------------|-------------------|
| Lines, arcs, circles | Perfect | Perfect |
| Polylines | Perfect | Perfect |
| Dimensions | Perfect | Perfect |
| Text | Perfect | Perfect |
| Blocks | Perfect | Perfect |
| Layers | Perfect | Perfect |
| Hatches | Limited (simple patterns) | Limited |
| Layouts/Paper space | Not supported | Not supported |

### DWG Support

LibreCAD does not support DWG files natively. To work with DWG files:
1. Use a free converter (ODA File Converter, LibreDWG) to convert DWG to DXF
2. Open the DXF in LibreCAD
3. After editing, save as DXF
4. Convert back to DWG if needed

## Printing and PDF Export

### Printing

1. File > Print
2. Select printer and paper size
3. Set scale (e.g., 1:50)
4. Set print area (window, drawing, or extents)
5. Click Print

### PDF Export

1. File > Export > PDF
2. Set paper size, orientation, and scale
3. Set print area
4. Click Export

### Scale Considerations

LibreCAD is model-space only (no paper space layouts). Set the print scale directly in the print dialog. For 1:50 scale, set print scale to 1:50.

## Blocks

### Creating Blocks

1. Draw the geometry
2. Select all entities
3. Edit > Block > Create Block
4. Name the block and set base point

### Inserting Blocks

1. Drag from Block list to drawing area
2. Specify insertion point, scale, and rotation

### Block Library

LibreCAD does not ship with pre-built block libraries. To create your own:
1. Save blocks as individual `.dxf` files in a folder
2. Use File > Import > Block to import them into drawings

## Dimensioning

### Dimension Types

- **Linear**: Horizontal, vertical, aligned
- **Angular**: Between two lines
- **Radius/Diameter**: For circles and arcs
- **Leader**: Arrow with text annotation

### Dimension Settings

1. Options > Current Drawing Preferences > Dimensions
2. Configure:
   - Text height: 2.5mm
   - Arrow size: 2.5mm
   - Arrow type: Architectural tick or closed arrow
   - Extension line offset: 1mm
   - Extension line extension: 2mm
   - Precision: 0.0

## Conclusion

LibreCAD is a capable free 2D CAD tool for technical drawings and schematics that do not require DWG compatibility or paper space layouts. Its minimal interface, DXF-native workflow, and cross-platform availability make it suitable for education, small projects, and users who need basic 2D drafting without licensing costs. The main limitations are lack of DWG support, no paper space layouts, limited hatching, and no scripting capabilities. For more advanced needs (DWG, scripting, block libraries), QCAD Professional is the natural upgrade path.
