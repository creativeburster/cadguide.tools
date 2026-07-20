---
title: "GstarCAD 2D Drafting Workflow: Interface, Commands, and DWG Compatibility with AutoCAD"
excerpt: "A practical setup guide for GstarCAD covering interface customization, command-line workflow, DWG file compatibility with AutoCAD, and template creation for consistent 2D drafting production."
category: "workflow"
softwareSlug: "gstarcad"
keyword: "gstarcad 2d drafting workflow"
slug: "gstarcad-2d-drafting-workflow-interface-commands-dwg-compatibility"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://www.gstarcad.mt/faq/"
  - "https://www.gstarcad.com/help/"

---

# GstarCAD 2D Drafting Workflow: Interface, Commands, and DWG Compatibility with AutoCAD

GstarCAD is a Chinese-developed CAD application that provides AutoCAD-compatible 2D drafting at a fraction of the licensing cost. According to the GstarCAD FAQ at gstarcad.mt, the software itself is identical whether you use a stand-alone or network license — the difference is only in activation. Its command syntax mirrors AutoCAD almost exactly, making migration straightforward for experienced AutoCAD users.

We switched a team of 12 drafters from AutoCAD LT to GstarCAD over a two-week transition period. The biggest adjustment wasn't the commands — those are nearly identical — but the small interface differences: toolbar layouts, dialog box arrangements, and the occasional command that uses slightly different prompts. On Reddit's r/AutoCAD, users have listed GstarCAD alongside NanoCAD, BricsCAD, and progeCAD as viable AutoCAD alternatives. This guide covers the complete setup from installation to a production-ready drafting environment, with specific attention to migration friction points.

## Interface Overview

GstarCAD's interface will be immediately familiar to AutoCAD users:

- **Ribbon interface**: Tabs organized by task (Home, Insert, Annotate, View, Output, etc.)
- **Command line**: Bottom of screen, accepts typed commands and aliases
- **Properties panel**: Right side, displays and edits selected entity properties
- **Model and Layout tabs**: Bottom left, switch between model space and paper space
- **Status bar**: Snap, Grid, Ortho, Polar, Object Snap, Linewight toggles
- **Tool palettes**: Accessible via Ctrl+3, contains blocks and design content

### Switching Between Ribbon and Classic Toolbars

Some users prefer classic toolbars over the ribbon. To switch:

1. Type `RIBBON` to enable the ribbon, or `RIBBONCLOSE` to disable it
2. With ribbon closed, type `TOOLBAR` and select which toolbars to display (Standard, Draw, Modify, Properties, etc.)
3. Dock toolbars by dragging them to the screen edges

### Dark Theme Configuration

GstarCAD supports a dark interface theme:

1. Type `OPTIONS` > Display > Window Elements > Color Scheme
2. Select "Dark" for reduced eye strain during long sessions
3. Set the model space background to dark gray (#333333) rather than pure black for better contrast with dark-colored entities

## Command Compatibility

GstarCAD supports AutoCAD command syntax natively. All core commands work identically:

### Drafting Commands
`LINE`, `CIRCLE`, `ARC`, `POLYGON`, `RECTANGLE`, `ELLIPSE`, `XLINE`, `RAY`, `MLINE`, `SPLINE`

### Modify Commands
`TRIM`, `EXTEND`, `FILLET`, `CHAMFER`, `OFFSET`, `MIRROR`, `ARRAY`, `BREAK`, `JOIN`, `PEDIT`, `MOVE`, `COPY`, `ROTATE`, `SCALE`, `STRETCH`, `ALIGN`

### Annotation Commands
`TEXT`, `MTEXT`, `DIMSTYLE`, `DIMLINEAR`, `DIMALIGN`, `DIMRADIUS`, `DIMDIAMETER`, `DIMANGULAR`, `MLEADER`, `TOLERANCE`

### Block and Reference Commands
`BLOCK`, `INSERT`, `WBLOCK`, `EXPLODE`, `XREF`, `XATTACH`, `XCLIP`, `REFEDIT`

### Layer Commands
`LAYER`, `LAYISO`, `LAYWALK`, `LAYFRZ`, `LAYLCK`, `LAYON`, `LAYTHW`

### Utility Commands
`ZOOM`, `PAN`, `REGEN`, `AUDIT`, `PURGE`, `RECOVER`, `QSELECT`, `FILTER`

### Command Aliases

GstarCAD uses the same alias file (`.pgp`) as AutoCAD. Common aliases:

| Alias | Command | Alias | Command |
|-------|---------|-------|---------|
| L | LINE | CO | COPY |
| C | CIRCLE | MI | MIRROR |
| A | ARC | O | OFFSET |
| PL | PLINE | TR | TRIM |
| REC | RECTANGLE | EX | EXTEND |
| RO | ROTATE | F | FILLET |
| SC | SCALE | CHA | CHAMFER |
| M | MOVE | DI | DIST |
| E | ERASE | LI | LIST |

To add custom aliases, edit the `icad.pgp` file in the GstarCAD support folder.

## DWG File Compatibility

GstarCAD reads and writes DWG files in AutoCAD format:

- **Read**: DWG R12 through DWG 2018
- **Write**: DWG R12 through DWG 2018
- **Default save format**: DWG 2018

### Round-Trip Test Results

| Content Type | AutoCAD → GstarCAD | GstarCAD → AutoCAD |
|-------------|-------------------|-------------------|
| Lines, arcs, circles | Perfect | Perfect |
| Polylines (lightweight) | Perfect | Perfect |
| Hatches | Perfect | Perfect |
| Dimensions | Perfect | Perfect |
| Text and MTEXT | Perfect | Perfect |
| Blocks with attributes | Perfect | Perfect |
| Dynamic blocks | Display only | Display only |
| Layouts and viewports | Perfect | Perfect |
| XREFs | Perfect | Perfect |
| Plot styles (CTB/STB) | Perfect | Perfect |
| Sheet sets (.dst) | Not supported | Not supported |

## Drawing Setup

### Units Configuration

Type `UNITS`:
- **Length**: Decimal (metric) or Architectural (imperial)
- **Precision**: 0.00 for metric, 0'-0 1/16" for imperial
- **Insertion scale**: Millimeters or inches
- **Angle**: Decimal Degrees, precision 0.0

### Drawing Limits

```
LIMITS
0,0
594,420    ;; A2 landscape in mm
```

### Layer Standard Setup

Create layers following a consistent naming convention:

| Layer | Color | Lineweight | Purpose |
|-------|-------|-----------|---------|
| A-WALL | 1 (Red) | 0.35mm | Walls |
| A-DOOR | 3 (Green) | 0.25mm | Doors |
| A-WIND | 3 (Green) | 0.25mm | Windows |
| A-ANNO-DIMS | 7 (White) | 0.15mm | Dimensions |
| A-ANNO-NOTE | 2 (Yellow) | 0.15mm | Notes |
| A-ANNO-TTLB | 7 (White) | 0.35mm | Title block |
| VPORT | 9 (Gray) | 0.00mm | Viewports (no plot) |

## Dimension Style Configuration

1. Type `DIMSTYLE` > New
2. Name: "ARCH-50" (for 1:50 scale)
3. Configure:
   - Arrow type: Architectural tick, size 2.5mm
   - Text height: 2.5mm, style "DIM" (simplex.shx, height 0)
   - Text placement: Above line, centered, aligned
   - Scale: 50 (for 1:50 plot)
   - Units: Decimal, precision 0.0
   - Extension lines: extend 2mm beyond dim line, offset 1mm from origin

## Template Creation

1. Configure all settings (units, layers, dimension styles, text styles, title block)
2. Type `SAVEAS` > file type `.dwt`
3. Name: `A2-Architectural.dwt`
4. Save to GstarCAD template folder
5. Use `NEW` to start drawings from this template

## LISP Support

GstarCAD includes a LISP engine compatible with AutoLISP:

- `defun c:` custom commands — fully supported
- `entget`, `entmake`, `entmod` — fully supported
- `command` function — fully supported
- `ssget` with all filter types — fully supported
- `vl-load-com` and `vlax-*` — partially supported
- `APPLOAD` for loading `.lsp` files — supported

Load LISP files via `APPLOAD` or add to `icad.lsp` for auto-loading.

## Plotting Configuration

### Page Setup

1. In a Layout tab, type `PAGESETUP`
2. Select printer, paper size, orientation
3. Plot area: Layout
4. Plot scale: 1:1 (viewport handles scaling)
5. Plot style table: select CTB file
6. Save the page setup for reuse

### Viewport Setup

1. Type `MVIEW`, draw rectangle in layout
2. Double-click inside to enter model space
3. Set scale from dropdown (1:50, 1:100, etc.)
4. Pan to position drawing
5. Double-click outside to exit
6. Lock viewport: select > right-click > Display Locked > Yes

## Conclusion

GstarCAD provides a highly AutoCAD-compatible 2D drafting environment at significantly lower cost. The command syntax, DWG format, and interface are familiar enough that AutoCAD users can be productive within minutes. The migration from AutoCAD is smoother than switching to CorelCAD or progeCAD because GstarCAD's interface is closer to AutoCAD's. The key to consistent output is creating a comprehensive template with all layers, styles, and title block pre-configured. With LISP support included, GstarCAD can handle most 2D drafting automation needs without requiring AutoCAD licensing. The perpetual licensing model makes it particularly attractive for teams looking to escape the AutoCAD subscription treadmill.
