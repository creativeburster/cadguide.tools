---
title: "QCAD 2D Drafting: Interface, Tools, and DXF/DWG Workflow for Technical Drawings"
excerpt: "A practical guide to using QCAD for 2D technical drafting, covering interface navigation, drawing tools, layer management, block libraries, and DXF/DWG file compatibility with professional CAD systems."
category: "workflow"
softwareSlug: "qcad"
keyword: "qcad 2d drafting"
slug: "qcad-2d-drafting-interface-tools-dxf-dwg-workflow"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://qcad.org/en/qcad-documentation"
  - "https://www.qcad.org/en/tutorial-layers-blocks-and-attributes"

---

# QCAD 2D Drafting: Interface, Tools, and DXF/DWG Workflow for Technical Drawings

QCAD is an open-source 2D CAD application available for Windows, macOS, and Linux. It uses DXF as its native format and supports DWG through an optional plugin. While not as feature-rich as AutoCAD or BricsCAD, QCAD is a capable tool for technical drawings, schematics, and 2D drafting — especially for users who need a lightweight, cross-platform solution without licensing costs.

## Interface Overview

QCAD's interface differs from AutoCAD-style applications:

- **Menu bar**: Top of screen with File, Edit, View, Select, Draw, Dimension, Modify, Snap, Layer, Block, View, and Tools menus
- **Tool matrix**: Left side, categorized tool buttons (Draw, Modify, Dimension, Snap, etc.)
- **Property editor**: Right side, shows and edits selected entity properties
- **Layer list**: Right side, below property editor
- **Block list**: Right side, shows block library
- **Command line**: Bottom, accepts some typed commands (limited compared to AutoCAD)
- **Status bar**: Bottom, shows cursor coordinates and snap settings

### Key Interface Differences from AutoCAD

QCAD does not use AutoCAD command syntax. Instead, tools are selected from the tool matrix or menus. There is no `LINE` command — you click the Line tool, then click points on the drawing. This is more intuitive for new users but requires adjustment for experienced AutoCAD users.

## Drawing Tools

### Basic Entities

- **Line**: Click two points, or use keyboard for precise coordinates
- **Circle**: Center + radius, or 3-point, or 2-point (diameter)
- **Arc**: Center + start + end angle, or 3-point
- **Polyline**: Connected line segments (can be open or closed)
- **Rectangle**: Two diagonal corners
- **Polygon**: Regular polygon by center + radius + number of sides
- **Ellipse**: Center + major + minor axis
- **Spline**: Control points or fit points

### Modifying Entities

- **Move**: Select entities, specify base point and destination
- **Copy**: Same as move but keeps original
- **Rotate**: Select entities, specify center and angle
- **Scale**: Select entities, specify base point and factor
- **Mirror**: Select entities, specify mirror line
- **Offset**: Create parallel copy at specified distance
- **Trim**: Trim entities to a cutting edge
- **Extend**: Extend entities to a boundary
- **Fillet**: Round corner between two entities
- **Chamfer**: Bevel corner between two entities
- **Divide**: Split an entity at a point
- **Break**: Remove a segment between two points

### Snapping

QCAD provides comprehensive snapping tools:

- **Endpoint**: Snap to entity endpoints
- **Center**: Snap to circle/arc center
- **Middle**: Snap to entity midpoint
- **Intersection**: Snap to intersection of two entities
- **Perpendicular**: Snap perpendicular to an entity
- **Tangent**: Snap tangent to a circle/arc
- **On Entity**: Snap anywhere on an entity
- **Grid**: Snap to grid points
- **Coordinate**: Enter exact coordinates

## Layer Management

### Creating Layers

1. Right-click in the Layer list > Add Layer
2. Name the layer
3. Set color by clicking the color swatch
4. Set linetype by clicking the linetype dropdown
5. Set lineweight by clicking the lineweight dropdown

### Layer Properties

Each layer has:
- **Visibility**: Toggle on/off
- **Lock**: Prevent editing
- **Print**: Toggle whether layer prints
- **Construction**: Mark as construction layer (non-printing reference)

### Layer Naming Convention

Follow the same convention as AutoCAD for compatibility:

| Layer | Color | Purpose |
|-------|-------|---------|
| A-WALL | Red | Walls |
| A-DOOR | Green | Doors |
| A-WIND | Green | Windows |
| A-ANNO-DIMS | White | Dimensions |
| A-ANNO-NOTE | Yellow | Notes |

## Block Libraries

QCAD includes a block library system for reusable components:

### Creating Blocks

1. Draw the geometry
2. Select all entities
3. Edit > Block > Create Block
4. Name the block and specify a base point
5. The block appears in the Block list

### Inserting Blocks

1. Drag a block from the Block list to the drawing
2. Specify insertion point, scale, and rotation
3. The block is inserted as a reference

### Block Library Folders

QCAD ships with pre-built block libraries (fasteners, symbols, electrical components, etc.). To add custom libraries:

1. Place `.dxf` files in a folder
2. Edit > Application Preferences > Block > Add library path
3. Blocks from the folder appear in the Block list

## DXF and DWG Compatibility

### DXF (Native Format)

QCAD uses DXF as its native format. All entities are stored as DXF by default.

- **DXF versions**: R12, R15 (2000), R18 (2004), R21 (2010), R27 (2013)
- **Recommended**: R15 (DXF 2000) for maximum compatibility

### DWG Support

DWG support requires the QCAD Professional with the DWG plugin:

- **Read**: DWG R12 through DWG 2018
- **Write**: DWG R12 through DWG 2018

### Round-Trip with AutoCAD

| Content Type | AutoCAD → QCAD (DXF) | QCAD → AutoCAD (DXF) |
|-------------|----------------------|---------------------|
| Lines, arcs, circles | Perfect | Perfect |
| Polylines | Perfect | Perfect |
| Hatches | Limited (simple patterns) | Limited |
| Dimensions | Perfect | Perfect |
| Text | Perfect | Perfect |
| Blocks | Perfect | Perfect |
| Layers | Perfect | Perfect |
| Layouts | Not supported (model space only) | Not supported |

**Note**: QCAD is model-space only. It does not support paper space layouts, viewports, or page setups. For plotting, QCAD uses its own print dialog.

## Printing and PDF Export

### Printing

1. File > Print
2. Select printer and paper size
3. Set scale (e.g., 1:50)
4. Set print area (drawing, window, or extents)
5. Click Print

### PDF Export

1. File > Export > PDF
2. Set paper size, orientation, and scale
3. Set print area
4. Choose vector or raster PDF
5. Click Export

### Scale Considerations

Since QCAD lacks viewports, you must set the print scale directly in the print dialog. For a 1:50 scale drawing:
- Print scale: 1:50
- Paper units: mm
- Drawing units: mm

## DXF vs DWG Workflow Considerations

QCAD Professional handles both DXF and DWG files, but there are important workflow differences to understand. DXF is QCAD's native format and has the best round-trip fidelity. When you save a drawing as DXF in QCAD and reopen it, every entity, layer, and block survives perfectly. DWG support is added through the Teigha (now ODA) libraries and is generally reliable but not perfect. Complex DWG files with custom objects, dynamic blocks, or embedded data may not round-trip cleanly. For collaborative work with AutoCAD users, saving to DWG 2018 format is recommended. For internal work where you control both ends of the workflow, DXF is the safer choice. QCAD also supports SVG export for web publishing and PDF export for printing. The SVG export preserves vector geometry and text, making it useful for creating web-ready technical illustrations. When importing files from other CAD systems, always check the scale — QCAD imports at the scale stored in the file, but if the source system used different units, you may need to scale the drawing after import.

## Conclusion

QCAD is a capable open-source 2D CAD tool for technical drawings, schematics, and drafting work that does not require paper space layouts or complex hatching. Its DXF-native approach ensures compatibility with AutoCAD and other CAD systems. The block library system and cross-platform availability make it suitable for small firms, education, and individual users who need professional 2D drafting without licensing costs. The main limitations are the lack of paper space, LISP automation, and limited DWG support in the free version.
