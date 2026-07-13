---
title: "Allplan Reinforcement Detailing: 3D Rebar Modeling, Schedules, and CNC Export"
excerpt: "A comprehensive guide to 3D reinforcement detailing in Allplan Engineering covering rebar placement in concrete elements, bar shapes, bending schedules, couplers, and BVBS CNC data export for fabrication."
category: "workflow"
softwareSlug: "allplan"
keyword: "allplan reinforcement detailing"
slug: "allplan-reinforcement-detailing-3d-rebar-modeling-schedules-cnc-export"
author: "CADGuide Technical Editorial"
readTime: "13 min read"
date: "2026-06-30"
sources:
  - "https://www.allplan.com/en/products/allplan-engineering"
  - "https://www.allplan.com/ap_en/products/allplan-architecture/"

---

# Allplan Reinforcement Detailing: 3D Rebar Modeling, Schedules, and CNC Export

Allplan's reinforcement detailing tools are, in my opinion, some of the best in the BIM market. Unlike Revit, where rebar tools feel like an add-on, Allplan was built from the ground up for structural engineers working with European and international rebar standards. I've used it on projects where the 3D rebar model was sent directly to CNC bending machines — no manual interpretation required. Let me walk you through the workflow.

## Prerequisites

### Concrete Element Setup

Before adding reinforcement, the concrete element (slab, wall, beam, column) must exist as a 3D solid in the Allplan model. The element must have:
- **Defined geometry** (thickness, length, height)
- **Assigned material** (concrete grade: C25/30, C30/37, etc.)
- **Correct elevation** (bottom and top surfaces defined)

### Cover Settings

1. Design > Reinforcement > Cover
2. Set concrete cover per element:
   - **Bottom cover**: typically 30mm (slabs), 40mm (foundations)
   - **Top cover**: typically 25mm (slabs), 30mm (beams)
   - **Side cover**: typically 40mm (beams), 30mm (walls)
   - **End cover**: typically 30mm
3. Cover can vary by exposure class (XC1, XC4, XD1, etc.)

## Bar Placement Methods

### Method 1: Manual Bar Placement

1. Design > Reinforcement > Bar
2. Select the concrete element (slab, wall, beam)
3. Choose bar shape:
   - **Straight**: Single straight bar
   - **L-shape**: 90° bend at one end
   - **U-shape**: 180° hook or U-bar
   - **Stirrup**: Rectangular or circular stirrup
   - **Cranked**: Bar with a bend in the middle (for lap splices)
   - **Custom**: Draw the bar shape manually
4. Specify diameter (8, 10, 12, 14, 16, 20, 25, 32mm)
5. Place the bar in the element:
   - Click start point (snaps to cover boundary)
   - Click end point or specify length
6. Allplan generates the 3D bar within the concrete

### Method 2: Area Reinforcement

1. Design > Reinforcement > Area Reinforcement
2. Select a slab or wall
3. Define reinforcement direction (bottom, top, or both)
4. Specify:
   - **Bar diameter**: e.g., 12mm
   - **Spacing**: e.g., 200mm center-to-center
   - **Direction**: Primary (X) and secondary (Y)
   - **Edge bars**: Additional bars at edges
5. Allplan automatically generates all bars in the defined area
6. Bars are placed at the correct cover distance from the concrete surface

### Method 3: Structural Reinforcement (Auto-Generated)

1. Design > Reinforcement > Structural Reinforcement
2. Select a concrete element that has analysis results loaded
3. Allplan reads the required reinforcement area from the analysis
4. Automatically calculates bar diameter and spacing to meet the requirement
5. Generates the reinforcement layout
6. You can override individual bars if needed

## Bar Shapes and Standards

### European Shapes (Eurocode 2)

Allplan includes the full library of European bar shapes:

| Shape | Description | Use Case |
|-------|-------------|----------|
| Shape 1 | Straight bar | Main reinforcement in slabs |
| Shape 2 | L-bar (one bend) | Edge reinforcement, starter bars |
| Shape 3 | U-bar | Beam stirrups, wall edge reinforcement |
| Shape 4 | Stirrup (rectangular) | Beam and column stirrups |
| Shape 5 | Stirrup (circular) | Circular columns |
| Shape 6 | Cranked bar | Lap splices, changes in level |
| Shape 7 | Two- bend bar | Complex shapes |
| Shape 99 | Custom shape | Non-standard requirements |

### Bending Dimensions

For each bar, Allplan calculates:
- **Total length**: Including all bends
- **Straight length**: Before bending
- **Bend angles**: Per bend point
- **Hook length**: Standard hooks (5d, 10d, or per code)
- **Bend radius**: Minimum per bar diameter (typically 4d for bars ≤ 16mm, 7d for bars > 16mm)

## Stirrup Placement

### Rectangular Stirrups (Beams)

1. Design > Reinforcement > Stirrup
2. Select the beam
3. Choose rectangular shape
4. Specify:
   - **Diameter**: 8mm or 10mm (typical)
   - **Spacing**: 150mm at supports, 250mm at midspan (or uniform)
   - **Hook type**: 135° seismic hook or 90° standard hook
5. Allplan generates stirrups along the beam length
6. For variable spacing, define stirrup regions:

### Stirrup Regions

1. Select the stirrup group
2. Define regions:
   - Region 1 (0-1.5d from support): 150mm spacing
   - Region 2 (midspan): 250mm spacing
   - Region 3 (1.5d from far support): 150mm spacing
3. Allplan adjusts spacing per region

### Circular Stirrups (Columns)

1. Design > Reinforcement > Stirrup
2. Select circular column
3. Choose circular shape
4. Specify diameter and spacing
5. Add spiral reinforcement if needed (continuous helix)

## Lap Splices and Splicing

### Lap Splice Placement

1. Design > Reinforcement > Lap Splice
2. Select the bar to splice
3. Specify lap length:
   - **Tension lap**: 1.4 × anchorage length (typical)
   - **Compression lap**: 1.0 × anchorage length
   - Or enter explicit value (e.g., 500mm for 16mm bars)
4. Allplan generates the overlapping bar with correct crank

### Couplers

1. Design > Reinforcement > Coupler
2. Select two bars to connect
3. Choose coupler type:
   - **Mechanical coupler**: Threaded or grouted
   - **Welded splice**: For specific applications
4. Allplan marks the coupler location in the model and schedule

## Bending Schedules

### Generating Schedules

1. Design > Reinforcement > Schedule
2. Select elements to include (or entire floor/project)
3. Allplan compiles all reinforcement into a schedule:

| Mark | Shape | Dia (mm) | Length (mm) | Qty | Total Length (m) | Weight (kg) |
|------|-------|----------|-------------|-----|-----------------|-------------|
| 1 | Straight | 12 | 3000 | 24 | 72.0 | 63.9 |
| 2 | L-shape | 16 | 2400 | 12 | 28.8 | 45.4 |
| 3 | Stirrup | 8 | 1400 | 48 | 67.2 | 26.5 |
| 4 | U-bar | 10 | 1800 | 16 | 28.8 | 17.8 |

### Schedule Formats

- **European format**: Per EN 10080 / EN 1992-1-1
- **German format**: Per DIN 488 / DBV-Merkblatt
- **British format**: Per BS 8666
- **American format**: Per ACI 315 (with appropriate bar shape library)

### Exporting Schedules

1. In the schedule view, File > Export
2. Choose format:
   - **PDF**: For drawing inclusion
   - **CSV/XLSX**: For spreadsheet processing
   - **BVBS**: For CNC bending machine (see below)
   - **XML**: For ERP system integration

## BVBS CNC Export

BVBS (Bundesverband Biegetechnik) is the standard CNC data format for rebar bending machines in Europe.

### Exporting BVBS Data

1. Design > Reinforcement > CNC Export > BVBS
2. Select elements or entire project
3. Configure:
   - **Machine type**: Schnell, EVG, Prensoland, etc.
   - **Bar cutting tolerance**: ±5mm (typical)
   - **Bundle size**: Number of bars per bundle
   - **Delivery mark**: Project-specific marking
4. Allplan generates a `.bvbs` file for each delivery
5. Transfer to the bending machine via network or USB

### BVBS File Structure

The BVBS file contains:
- Project information (name, drawing number)
- For each bar mark: shape code, diameter, dimensions, quantity
- Bending machine instructions (bend angles, sequence)
- Bundle and delivery information

## Reinforcement Drawing Generation

### Rebar Plans

1. Views > Rebar Plan
2. Select the element (slab, beam, column)
3. Allplan generates a 2D drawing showing:
   - Concrete outline (dashed)
   - Reinforcement bars (solid lines)
   - Bar marks and dimensions
   - Spacing annotations
4. Add the rebar plan to a layout sheet

### Section Views with Rebar

1. Create a section through the reinforced element
2. Allplan shows both concrete and reinforcement in section
3. Add bar mark annotations
4. Include stirrup spacing in the section annotation

## Common Reinforcement Issues

### Issue: Bars Overlap in 3D

**Cause**: Bar spacing is too tight or cover is incorrect.
**Fix**: Verify cover settings. Increase spacing. Use Allplan's Clash Detection for reinforcement to identify overlaps.

### Issue: Bending Schedule Shows Wrong Lengths

**Cause**: Bar shape dimensions are incorrect or bend radius is wrong.
**Fix**: Verify the bar shape in 3D. Check that bend radius meets code minimum. Regenerate the schedule.

### Issue: BVBS File Rejected by Bending Machine

**Cause**: Machine-specific parameters not configured correctly.
**Fix**: Verify the machine type in BVBS export settings. Check bar diameter compatibility. Ensure all bars have valid shape codes.

## Wrapping Up

Allplan's reinforcement tools are, in my opinion, the best in the BIM market for structural engineers. The 3D rebar modeling is precise, the bar schedule generation is automatic, and the BVBS CNC export works flawlessly with modern bending machines. I've sent rebar data directly from Allplan to the fabricator with no manual interpretation in between — that's a workflow that saves time and eliminates errors. If you do a lot of reinforced concrete work, Allplan is worth serious consideration for the reinforcement tools alone.
