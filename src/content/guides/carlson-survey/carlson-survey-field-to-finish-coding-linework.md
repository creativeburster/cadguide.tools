---
title: "Carlson Survey Field to Finish: Automating Drawing Creation from Field Codes"
excerpt: "How to configure Carlson Survey's Field to Finish feature to automatically generate linework, symbols, and annotations from field-collected point codes — covering code structure, feature coding, and template setup."
category: "workflow"
softwareSlug: "carlson-survey"
keyword: "carlson survey field to finish coding linework automation"
slug: "carlson-survey-field-to-finish-coding-linework"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://web.carlsonsw.com/files/knowledgebase/kbase_attach/812/Lesson%203-Field%20to%20Finish%20for%20Faster%20Drafting.pdf"
  - "https://web.carlsonsw.com/knowledgebase/kbase05.php?action=display_topic&topic_id=1136"
---

# Carlson Survey Field to Finish: Automating Drawing Creation from Field Codes

Field to Finish (F2F) is the most powerful feature in Carlson Survey. It converts field-collected point codes into complete drawing entities — lines, curves, symbols, and annotations — automatically. I've configured F2F for dozens of survey crews. When set up correctly, the drawing is 90% complete when the data is downloaded. Here's how.

## How Field to Finish Works

1. **In the field**: The surveyor codes each point with a description (e.g., "EP", "CL", "TREE").
2. **In the office**: F2F reads the codes and creates drawing entities based on rules defined in the F2F file.
3. **Result**: Lines connect point-to-point, symbols appear at feature locations, and text annotations are placed automatically.

## Understanding the Code Structure

A field code consists of several parts:

```
[Feature Code][Suffix][Modifiers]
```

### Feature Code
The base code identifying the feature type:
- `EP` — Edge of Pavement
- `CL` — Centerline
- `MON` — Monument
- `TREE` — Tree
- `FH` — Fire Hydrant
- `CB` — Catch Basin

### Suffix
A number or letter that distinguishes multiple instances of the same feature:
- `EP1`, `EP2`, `EP3` — Three edge-of-pavement points that should be connected with a line
- `TREE1`, `TREE2` — Individual trees (not connected)

### Modifiers
Additional information appended with special characters:
- `/` — Begin a new line (e.g., "EP1/B" starts a new EP line called B)
- `..` — Connect to the previous point of the same code (e.g., "EP1..EP2" connects EP2 to EP1)
- `+` — Continue the current line (e.g., "EP1+EP2+EP3" connects all three in sequence)
- `@` — Include a dimension (e.g., "TREE@12" for a 12-inch diameter tree)

## Step 1: Create the Field to Finish File

1. **Survey** → **Field to Finish** → **New**.
2. Name the F2F file (e.g., "company-standards.f2f").
3. The F2F file contains all the rules for converting codes to drawing entities.

## Step 2: Define Feature Codes

For each code, define how it should be drawn:

### Line Features (Connected Points)

1. Click **Add Feature** → **Line**.
2. Set:
   - **Code**: "EP" (edge of pavement)
   - **Layer**: "EDGE-PAVEMENT"
   - **Linetype**: Continuous
   - **Color**: Red
   - **Line weight**: 0.30mm
   - **Connect method**: Sequential (connect points in order: EP1→EP2→EP3)
   - **Close**: No (open polyline) or Yes (closed polygon)

3. Repeat for other line features:
   - `CL` → Centerline (centerline layer, dashed linetype)
   - `ROW` → Right of Way (property layer, continuous)
   - `FENCE` → Fence line (fence layer, phantom linetype)
   - `WALL` → Retaining wall (wall layer, continuous)

### Point Features (Symbols)

1. Click **Add Feature** → **Point**.
2. Set:
   - **Code**: "MON" (monument)
   - **Layer**: "MONUMENTS"
   - **Symbol**: Select a block (e.g., "MON-SQUARE" — a square symbol)
   - **Symbol size**: 2.0mm (plotted size)
   - **Text**: Point number and description
   - **Text position**: Right of symbol

3. Repeat for other point features:
   - `TREE` → Tree symbol (circle with trunk)
   - `FH` → Fire hydrant symbol
   - `CB` → Catch basin symbol
   - `UP` → Utility pole symbol
   - `HYD` → Hydrant

### Curve Features

1. Click **Add Feature** → **Curve**.
2. Set:
   - **Code**: "CURB" (curb line)
   - **Layer**: "CURB"
   - **Curve type**: Three-point arc (requires three points to define the curve)
   - **Connect method**: Sequential

3. For curved features, the field crew must collect three points per curve segment:
   - `CURB1` (PC — point of curve)
   - `CURB2` (midpoint of curve)
   - `CURB3` (PT — point of tangent)

### Special Features

1. **Building**: Define as a closed polygon
   - Code: "BLDG"
   - Connect: Sequential, Close = Yes
   - Layer: "BUILDINGS"
   - Hatch: Solid (optional)

2. **Sidewalk**: Define as a double line
   - Code: "SW"
   - Connect: Sequential, Offset = 1.5m (draws two parallel lines 1.5m apart)

3. **Tree with canopy**: Define as a circle
   - Code: "TREE"
   - Symbol: Circle
   - Radius: From field measurement (use modifier: "TREE@0.5" for 0.5m radius)

## Step 3: Define Description Keys

Description keys map field codes to standardized descriptions and control point display:

1. **Settings** → **Description Keys** → **New**.
2. For each code:

| Code | Full Description | Layer | Symbol | Text |
|------|-----------------|-------|--------|------|
| EP | Edge of Pavement | EDGE-PAVEMENT | None | EP + point number |
| CL | Centerline | CENTERLINE | None | CL + point number |
| MON | Iron Monument | MONUMENTS | MON-SQUARE | MON + point number |
| TREE | Tree | VEGETATION | TREE-CIRCLE | TREE + diameter |
| FH | Fire Hydrant | UTILITIES | FH-SYMBOL | FH + point number |

3. The description key is applied during import — each point gets the correct layer, symbol, and text automatically.

## Step 4: Field Coding Standards

Train the field crew on consistent coding:

### Standard Code List

Provide each crew member with a laminated code card:

```
BOUNDARY: MON, IP (iron pin), NAIL, PK
PAVEMENT: EP (edge), CL (centerline), CURB, SW (sidewalk)
UTILITIES: FH (hydrant), CB (catch basin), UP (pole), WM (water meter)
VEGETATION: TREE, BUSH, HEDGE
STRUCTURES: BLDG (building), WALL, FENCE, GATE
TOPOGRAPHY: TOPO (spot elevation), DITCH, BERM
```

### Coding Rules

1. **Sequential numbering for lines**: EP1, EP2, EP3 — F2F connects them in order.
2. **Break lines with "/":** EP1, EP2, EP3/B, EP4, EP5 — EP1-2-3 is one line, EP4-5 starts a new line.
3. **Close polygons with "C":** BLDG1, BLDG2, BLDG3, BLDG4C — the "C" closes the polygon back to BLDG1.
4. **Add dimensions with "@":** TREE@12 — 12-inch diameter tree, PIPE@6 — 6-inch pipe.

### Field Crew Tips

- **Code every point**: Uncoded points create gaps in the linework.
- **Use consistent codes**: Don't use "HYD" one day and "FH" the next for fire hydrants.
- **Number sequentially**: EP1, EP2, EP3 — not EP1, EP5, EP2. F2F connects in numerical order.
- **Close polygons**: Always add "C" suffix to close building outlines and property boundaries.
- **Note special features**: If a tree has a unusual shape, add a note in the raw data.

## Step 5: Process and Review

1. **Survey** → **Field to Finish** → **Process**.
2. Carlson processes all points with F2F rules:
   - Creates lines between sequential points
   - Places symbols at point features
   - Draws curves from three-point sequences
   - Places text annotations
   - Applies layers and linetypes

3. Review the drawing:
   - **Missing lines**: Check if points were uncoded or codes don't match F2F definitions
   - **Wrong symbols**: Check description key mapping
   - **Crossed lines**: Check point numbering — F2F connects in numerical order, not collection order
   - **Unclosed polygons**: Check for missing "C" suffix

4. Fix issues:
   - Edit point descriptions: **Points** → **Edit Points** → change description
   - Re-process F2F: **Survey** → **Field to Finish** → **Process**

## Step 6: Finalize the Drawing

After F2F processing:

1. Add the title block and border.
2. Add the north arrow and scale bar.
3. Add the legend ( Carlson can generate this automatically from the F2F codes).
4. Add notes and annotations.
5. Plot to PDF or paper.

## Common F2F Issues

**Lines connect in wrong order**: F2F connects points in numerical order by point number, not by the order they were collected. If the crew collected EP1, then EP3, then EP2, F2F draws EP1→EP2→EP3 (numerical), not EP1→EP3→EP2 (collection order). Train crews to number points in the order they should be connected.

**Symbols don't appear**: The symbol block isn't in the drawing's block library. Add the symbol blocks to the template drawing or define the block path in the F2F settings.

**Curves don't draw**: Curve features require exactly three points per curve segment. If the crew only collected two points, F2F can't draw a curve. Train crews to always collect PC, midpoint, and PT for curves.
