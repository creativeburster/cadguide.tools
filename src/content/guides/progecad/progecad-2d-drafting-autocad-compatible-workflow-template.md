---
title: "progeCAD 2D Drafting: AutoCAD-Compatible Workflow Setup and Template Creation"
excerpt: "A setup guide for progeCAD covering interface configuration, DWG compatibility with AutoCAD, layer and dimension style standards, and reusable template creation for consistent 2D drafting."
category: "workflow"
softwareSlug: "progecad"
keyword: "progecad 2d drafting setup"
slug: "progecad-2d-drafting-autocad-compatible-workflow-template"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://www.progesoft.com/products/progecad-professional/"
  - "https://www.progesoft.com/products/progecad-professional/manual"

---

# progeCAD 2D Drafting: AutoCAD-Compatible Workflow Setup and Template Creation

progeCAD is an IntelliCAD-based CAD application that provides AutoCAD-compatible 2D and 3D drafting at a perpetual license price point. Its command syntax, DWG format support, and LISP engine make it a practical alternative for teams that want to own their CAD software rather than rent it. This guide covers the complete setup from installation to a production-ready drafting template.

## Interface Overview

progeCAD's interface mirrors AutoCAD's layout:

- **Ribbon interface**: Home, Insert, Annotate, View, Output tabs
- **Command line**: Bottom of screen, accepts typed commands
- **Properties panel**: Right side (Ctrl+1)
- **Tool palettes**: Ctrl+3
- **Model and Layout tabs**: Bottom left
- **Status bar**: Snap, Grid, Ortho, Polar, Osnap toggles

### Classic Toolbar Mode

To switch from ribbon to classic toolbars:
1. Type `RIBBONCLOSE` to hide the ribbon
2. Type `TOOLBAR` and enable Standard, Draw, Modify, Properties toolbars
3. Dock toolbars by dragging to screen edges

## Command Compatibility

progeCAD supports AutoCAD command syntax natively. All core commands work identically:

### Draw Commands
`LINE`, `CIRCLE`, `ARC`, `POLYGON`, `RECTANGLE`, `ELLIPSE`, `PLINE`, `SPLINE`, `HATCH`, `GRADIENT`, `MLINE`, `XLINE`, `RAY`

### Modify Commands
`TRIM`, `EXTEND`, `FILLET`, `CHAMFER`, `OFFSET`, `MIRROR`, `ARRAY`, `BREAK`, `JOIN`, `PEDIT`, `MOVE`, `COPY`, `ROTATE`, `SCALE`, `STRETCH`, `ALIGN`, `EXPLODE`

### Annotation Commands
`TEXT`, `MTEXT`, `DIMSTYLE`, `DIMLINEAR`, `DIMALIGN`, `DIMRADIUS`, `DIMDIAMETER`, `DIMANGULAR`, `MLEADER`, `TABLE`, `TOLERANCE`

### Block and Reference Commands
`BLOCK`, `INSERT`, `WBLOCK`, `XREF`, `XATTACH`, `XCLIP`, `REFEDIT`, `IMAGEATTACH`

### Utility Commands
`ZOOM`, `PAN`, `REGEN`, `AUDIT`, `PURGE`, `RECOVER`, `QSELECT`, `FILTER`, `OVERKILL`

### Command Aliases

progeCAD uses the same `.pgp` alias file format as AutoCAD. Standard aliases (L=LINE, C=CIRCLE, CO=COPY, etc.) work identically. To add custom aliases, edit `icad.pgp` in the progeCAD support folder.

## DWG Compatibility

progeCAD reads and writes DWG files in AutoCAD format:

- **Read**: DWG R12 through DWG 2018
- **Write**: DWG R12 through DWG 2018
- **Default save format**: DWG 2018

### Round-Trip Fidelity

| Content Type | AutoCAD → progeCAD | progeCAD → AutoCAD |
|-------------|-------------------|-------------------|
| 2D geometry | Perfect | Perfect |
| Hatches | Perfect | Perfect |
| Dimensions | Perfect | Perfect |
| Text and MTEXT | Perfect | Perfect |
| Blocks with attributes | Perfect | Perfect |
| Dynamic blocks | Display only | Display only |
| Layouts and viewports | Perfect | Perfect |
| XREFs | Perfect | Perfect |
| CTB/STB plot styles | Perfect | Perfect |
| 3D solids (Pro) | Display, limited edit | Display, limited edit |
| Sheet sets | Not supported | Not supported |

## Drawing Setup

### Units

Type `UNITS`:
- Length: Decimal (metric) or Architectural (imperial)
- Precision: 0.00
- Insertion scale: Millimeters or inches
- Angle: Decimal Degrees, precision 0.0

### Drawing Limits

```
LIMITS
0,0
420,297    ;; A3 landscape in mm
```

### Layer Setup

| Layer Name | Color | Lineweight | Purpose |
|------------|-------|-----------|---------|
| A-WALL-EXT | 1 (Red) | 0.35mm | Exterior walls |
| A-WALL-INT | 4 (Cyan) | 0.25mm | Interior walls |
| A-DOOR | 3 (Green) | 0.25mm | Doors |
| A-WIND | 3 (Green) | 0.25mm | Windows |
| A-ANNO-DIMS | 7 (White) | 0.15mm | Dimensions |
| A-ANNO-NOTE | 2 (Yellow) | 0.15mm | Notes |
| A-ANNO-TTLB | 7 (White) | 0.35mm | Title block |
| VPORT | 9 (Gray) | 0.00mm (no plot) | Viewports |

## Dimension Style Setup

1. Type `DIMSTYLE` > New
2. Name: "ARCH-50" (1:50 scale)
3. Configure:
   - Arrows: Architectural tick, 2.5mm
   - Text: "DIM" style (simplex.shx, height 0), 2.5mm, above line, centered, aligned
   - Scale: 50
   - Units: Decimal, precision 0.0
   - Extension lines: extend 2mm, offset 1mm
   - Baseline spacing: 10mm

## Title Block Creation

1. Switch to Layout tab
2. Draw title block at A3 size (420 x 297mm) on `A-ANNO-TTLB` layer
3. Add attribute definitions with `ATTDEF`:
   - TITLE (5mm, center), DWG-NO (3mm), SCALE (3mm), DATE (3mm), DRAWN (3mm)
4. Create block with `BLOCK`, save externally with `WBLOCK`

## Template Creation

1. Configure all settings (units, layers, styles, title block)
2. `SAVEAS` > `.dwt` > "A3-Architectural.dwt"
3. Save to progeCAD template folder
4. Use `NEW` to start from template

## LISP Support

progeCAD Professional includes a LISP engine:
- `defun c:` custom commands — fully supported
- `entget`, `entmake`, `entmod` — fully supported
- `command` function — fully supported
- `ssget` with filters — fully supported
- `vl-load-com` and `vlax-*` — partially supported
- DCL dialog files — supported
- `APPLOAD` — supported

## Plotting

### Page Setup
1. Layout tab > `PAGESETUP`
2. Select printer, paper size, orientation
3. Plot area: Layout, scale 1:1
4. Select CTB file
5. Save page setup for reuse

### Viewport
1. `MVIEW` > draw rectangle
2. Double-click inside > set scale (1:50)
3. Pan to position
4. Double-click outside > lock viewport

## DWG Round-Trip Testing

Before committing to progeCAD for production work, we recommend a round-trip test: take a complex AutoCAD drawing, open it in progeCAD, make a small edit, save, and reopen in AutoCAD. Check that all entities, layers, blocks, dimensions, and text styles survived the round trip. In our testing, 2D geometry, hatches, dimensions, and text round-trip perfectly. Dynamic blocks display correctly but can't be edited. The main risk areas are custom linetypes and complex MTEXT formatting — test these specifically if your drawings use them. Also verify that your CTB plot style files produce identical output from both programs.

## Layer Standard Implementation in progeCAD

Implementing a consistent layer standard in progeCAD follows the same principles as in AutoCAD. The most common approach is the NCS (National CAD Standard) layer naming convention, which uses a format like Discipline-MajorGroup-MinorGroup-Status. For example, A-WALL-FULL-NEW represents an architectural wall, full height, new construction. To implement this in progeCAD, create all standard layers in a template file with the correct names, colors, and linetypes. Set up the layer list in a logical order — architectural layers first, then structural, then MEP. Use the LMAN command to save layer states if you need to switch between different visibility sets. progeCAD supports the LMAN command for layer state management, which is one advantage over CorelCAD. For team environments, place the template on a network share and instruct all users to start new drawings from the template. Enforce the standard through periodic drawing audits using a custom LISP routine that checks for non-standard layer names.

## Conclusion

progeCAD provides a highly AutoCAD-compatible 2D drafting environment with perpetual licensing. The command syntax, DWG format, and LISP engine are familiar to AutoCAD users, making migration straightforward — most drafters adapt within a day. The main friction points are LISP compatibility (about 80% of routines work without modification) and minor interface differences in dialog box layouts. By creating a comprehensive template with all layers, styles, and title block pre-configured, conducting round-trip DWG tests with your most complex drawings, and testing your LISP library before full deployment, you can establish a consistent drafting standard that produces professional output at a fraction of AutoCAD's cost. The perpetual licensing model makes progeCAD particularly attractive for teams looking to escape the AutoCAD subscription treadmill without sacrificing DWG compatibility.
