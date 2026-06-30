---
title: "CYPECAD Reinforcement Detailing: Bar Scheduling, Drawings, and 3D Visualization"
excerpt: "A guide to reinforcement detailing in CYPECAD covering automatic bar scheduling, reinforcement plan generation, section details with bar arrangements, 3D reinforcement visualization, and steel quantity reporting for construction."
category: "workflow"
softwareSlug: "cypecad"
keyword: "cypecad reinforcement detailing"
slug: "cypecad-reinforcement-detailing-bar-scheduling-drawings-3d-visualization"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://manual.cype.com/cypecad/reinforcement/"
  - "https://www.cype.com/en/cypecad/"
---

# CYPECAD Reinforcement Detailing: Bar Scheduling, Drawings, and 3D Visualization

What sold me on CYPECAD was the reinforcement detailing. I used to spend hours in AutoCAD drawing rebar layouts by hand after running the design in ETABS. With CYPECAD, the reinforcement plans, bar schedules, and 3D rebar models are all generated automatically from the design. It's not perfect — you still need to review and adjust — but it saves me days of work on a typical project. Let me walk you through it.

## Reinforcement Design Output

### Beam Reinforcement

1. Results > Beams > Reinforcement
2. For each beam, CYPECAD provides:
   - **Top reinforcement**: Bars at supports (negative moment)
   - **Bottom reinforcement**: Bars at midspan (positive moment)
   - **Stirrups**: Size, spacing, and extent
   - **Additional bars**: At laps, curtailment points, and anchors

#### Beam Detailing Output

| Parameter | Support Left | Midspan | Support Right |
|-----------|-------------|---------|---------------|
| Top bars | 4 Ø20 | 2 Ø16 | 4 Ø20 |
| Bottom bars | 3 Ø16 | 4 Ø16 | 3 Ø16 |
| Stirrups | Ø8 @ 100mm | Ø8 @ 200mm | Ø8 @ 100mm |
| Stirrup extent | 0.5m from support | Full span | 0.5m from support |
| Lap length | 40 Ø = 800mm | - | 40 Ø = 800mm |

### Column Reinforcement

1. Results > Columns > Reinforcement
2. For each column:
   - **Longitudinal bars**: Number, diameter, and arrangement
   - **Ties**: Size, spacing, and arrangement
   - **Confinement**: Closely spaced ties in critical regions
   - **Lap splices**: Location and length

#### Column Detailing Output

| Parameter | Value |
|-----------|-------|
| Section | 400 × 400mm |
| Longitudinal bars | 8 Ø20 (2 per face) |
| Tie type | Closed stirrup with 135° hooks |
| Tie spacing (general) | Ø8 @ 200mm |
| Tie spacing (confinement) | Ø8 @ 100mm |
| Confinement height | 600mm from floor and ceiling |
| Lap splice | 50 Ø = 1000mm at floor level |
| Reinforcement ratio | 1.57% |

### Slab Reinforcement

1. Results > Slabs > Reinforcement
2. For each slab panel:
   - **Top reinforcement**: At supports (negative moment)
   - **Bottom reinforcement**: At midspan (positive moment)
   - **Additional bars**: At concentrated loads or openings
   - **Mesh**: Standard mesh or individual bars

#### Slab Detailing Output

| Parameter | Support Zone | Midspan |
|-----------|-------------|---------|
| Top bars | Ø12 @ 150mm | Ø10 @ 200mm |
| Bottom bars | Ø10 @ 200mm | Ø10 @ 200mm |
| Extent of top bars | L/4 from support | - |
| Mesh type | Individual bars | Individual bars |
| Cover | 25mm | 25mm |

### Wall Reinforcement

1. Results > Walls > Reinforcement
2. For each wall:
   - **Vertical reinforcement**: Each face
   - **Horizontal reinforcement**: Each face
   - **Boundary elements**: If required (seismic)
   - **Additional bars**: At openings and edges

## Bar Scheduling

### Automatic Bar Schedule

1. Drawings > Bar Schedule
2. CYPECAD compiles all reinforcement into a schedule:

| Mark | Element | Shape | Dia (mm) | Length (mm) | Qty | Total (m) | Weight (kg) |
|------|---------|-------|----------|-------------|-----|-----------|-------------|
| B1 | Beam-101 | Straight | 20 | 6000 | 8 | 48.0 | 118.6 |
| B2 | Beam-101 | L-shape | 16 | 2400 | 6 | 14.4 | 22.7 |
| B3 | Beam-101 | Stirrup | 8 | 1400 | 40 | 56.0 | 22.1 |
| C1 | Col-201 | Straight | 20 | 3500 | 8 | 28.0 | 69.2 |
| C2 | Col-201 | Stirrup | 8 | 1300 | 24 | 31.2 | 12.3 |
| S1 | Slab-301 | Straight | 12 | 5000 | 35 | 175.0 | 155.2 |
| S2 | Slab-301 | Straight | 10 | 5000 | 35 | 175.0 | 107.8 |

3. Schedule includes:
   - **Bar mark**: Unique identifier
   - **Element**: Which beam/column/slab
   - **Shape**: Straight, L-shape, U-shape, stirrup, etc.
   - **Diameter**: Bar diameter
   - **Length**: Total bar length including bends
   - **Quantity**: Number of bars
   - **Total length**: Sum of all bars
   - **Weight**: Calculated from diameter and length

### Steel Quantity Summary

1. Drawings > Steel Quantity Report
2. Summary by element type:
   - **Beams**: Total weight (kg) per floor
   - **Columns**: Total weight (kg) per floor
   - **Slabs**: Total weight (kg) per floor
   - **Walls**: Total weight (kg) per floor
   - **Foundations**: Total weight (kg)
3. Summary by bar diameter:
   - Ø8: Total weight
   - Ø10: Total weight
   - Ø12: Total weight
   - Ø16: Total weight
   - Ø20: Total weight
4. Total project steel weight:
   - **Total**: e.g., 45,200 kg
   - **Per m² of floor area**: e.g., 38 kg/m²

## Drawing Generation

### Floor Plans

1. Drawings > Floor Plans
2. CYPECAD generates:
   - **Structural layout**: Columns, beams, walls, slabs
   - **Section markers**: For detail references
   - **Grid lines**: With axis labels
   - **Dimensions**: Overall and bay dimensions
3. Include reinforcement:
   - **Bar marks**: On each element
   - **Bar quantity**: Number of bars per element
   - **Stirrup spacing**: Noted on beams

### Reinforcement Plans

1. Drawings > Reinforcement Plans
2. For each floor:
   - **Beam reinforcement**: Top and bottom bar marks
   - **Column reinforcement**: Bar marks and section reference
   - **Slab reinforcement**: Bar marks, spacing, and extent
   - **Wall reinforcement**: Vertical and horizontal bar marks
3. Drawing includes:
   - **Bar callouts**: "4 Ø20" at each beam
   - **Stirrup callouts**: "Ø8 @ 150" at each beam
   - **Slab mesh**: "Ø12 @ 150" in support zone, "Ø10 @ 200" in midspan

### Section Details

1. Drawings > Section Details
2. For each beam, column, and wall:
   - **Cross-section**: To scale with bar arrangement
   - **Bar positions**: Showing each bar location
   - **Stirrup/tie shape**: With hook details
   - **Cover dimension**: Clear cover noted
   - **Bar dimensions**: For bent bars (L-shape, U-shape)

### Foundation Details

1. Drawings > Foundation Details
2. For each footing:
   - **Plan view**: Dimensions and bar layout
   - **Section view**: Thickness, cover, reinforcement
   - **Bar marks**: For each direction
3. For pile caps:
   - **Plan view**: Pile layout and cap dimensions
   - **Section view**: Reinforcement arrangement

## 3D Reinforcement Visualization

### 3D View

1. View > 3D Reinforcement
2. CYPECAD displays:
   - **3D model**: Building structure in 3D
   - **Reinforcement bars**: All bars shown in 3D
   - **Stirrups and ties**: At correct spacing
   - **Lap splices**: Shown with different color
3. Navigate:
   - **Orbit**: Rotate around the model
   - **Pan**: Move the view
   - **Zoom**: Get close to see individual bars
   - **Section**: Cut through the model to see interior reinforcement

### Clash Detection

1. In 3D reinforcement view:
   - Check for bar clashes (bars occupying same space)
   - Check for adequate spacing between bars
   - Verify congestion at beam-column joints
2. If clashes detected:
   - Adjust bar arrangement
   - Change bar diameter or quantity
   - Modify lap splice location

### Construction Simulation

1. View > Construction Sequence
2. Show reinforcement placement sequence:
   - **Step 1**: Column bars (vertical)
   - **Step 2**: Beam bottom bars
   - **Step 3**: Beam stirrups
   - **Step 4**: Beam top bars
   - **Step 5**: Slab bottom mesh
   - **Step 6**: Slab top mesh (at supports)
3. This helps contractors plan rebar placement

## Export Options

### DXF/DWG Export

1. Drawings > Export > DXF/DWG
2. Export:
   - **Floor plans**: With structural elements and dimensions
   - **Reinforcement plans**: With bar marks and callouts
   - **Section details**: With bar arrangement
   - **Bar schedule**: As table in DXF
3. Set layer mapping:
   - Structural elements: Layer "S-STRUCT"
   - Reinforcement: Layer "S-REBAR"
   - Dimensions: Layer "S-DIMS"
   - Text: Layer "S-TEXT"

### IFC Export

1. File > Export > IFC
2. Export the structural model with reinforcement:
   - **Structural elements**: As IFC objects (IfcBeam, IfcColumn, IfcSlab)
   - **Reinforcement**: As IfcReinforcingBar
   - **Properties**: Bar mark, diameter, grade, length
3. Import into BIM coordination tools (Navisworks, Solibri)

### Bar Schedule Export

1. Drawings > Bar Schedule > Export
2. Export formats:
   - **CSV**: For spreadsheet processing
   - **PDF**: For submission
   - **BSF**: For steel fabrication software

## Best Practices

1. **Verify reinforcement ratios**: Check that all ratios are within code limits
2. **Review bar arrangement**: Use 3D view to check for congestion
3. **Check lap splices**: Ensure laps are staggered and at correct locations
4. **Verify cover**: Check that cover is adequate for exposure class
5. **Review bar schedule**: Cross-check quantities with drawings
6. **Export to DXF**: For final drawing production in CAD
7. **Generate steel quantity report**: For cost estimation
8. **Use 3D visualization**: For client presentations and contractor coordination

## Wrapping Up

The reinforcement detailing in CYPECAD is what sets it apart from other structural design tools in my experience. Going from design ratios to construction-ready drawings without switching software is a huge time saver. The 3D visualization is great for catching clashes — I've found bars colliding in tight column-beam joints that I would have missed on 2D drawings alone. Always review the automatic output, but the software does most of the heavy lifting for you.
