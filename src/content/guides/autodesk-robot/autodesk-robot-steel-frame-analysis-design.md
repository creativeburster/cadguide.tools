---
title: "Autodesk Robot Structural Analysis: Steel Frame Design Workflow"
excerpt: "How to model and analyze steel frame structures in Autodesk Robot — covering section assignment, load definition, load combinations, code checking, and result interpretation."
category: "workflow"
softwareSlug: "autodesk-robot"
keyword: "autodesk robot steel frame analysis design"
slug: "autodesk-robot-steel-frame-analysis-design"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://www.autodesk.com/learn/ondemand/module/analysis-and-design-for-steel-structures"
  - "https://dezignark.com/blog/design-a-complete-steel-frame-in-robot-structural-analysis-professional/"
---

# Autodesk Robot Structural Analysis: Steel Frame Design Workflow

We use Autodesk Robot for steel frame analysis on industrial projects. It handles wind loading, seismic loading, and steel code checking (AISC, Eurocode) in one workflow. Here's our complete process from model to code check.

## Step 1: Model Geometry

### Define the Grid

1. **Geometry** → **Levels and Grids**.
2. Set grid spacing:
   - X-axis: Column spacing (e.g., 6m bays)
   - Y-axis: Column spacing (e.g., 6m bays)
   - Z-axis: Floor levels (e.g., 0, 4m, 8m, 12m)

### Create Columns and Beams

1. **Geometry** → **Bars**.
2. Draw bars by clicking grid intersections:
   - **Columns**: Vertical bars from level to level
   - **Beams**: Horizontal bars at each level
   - **Bracing**: Diagonal bars between nodes

3. Assign bar sections:
   - Select bars → right-click → **Section** → select from section database
   - Columns: W14×90 (AISC) or HEA 240 (Eurocode)
   - Beams: W18×35 (AISC) or IPE 300 (Eurocode)
   - Bracing: L4×4×3/8 (AISC) or L 60×60×6 (Eurocode)

4. Assign material:
   - Select all bars → right-click → **Material** → Steel (A992 or S355)

## Step 2: Supports and Boundary Conditions

1. Select the base nodes (bottom of columns).
2. Right-click → **Supports**.
3. Set support type:
   - **Pinned**: Fixed in X, Y, Z translation; free rotation (typical for steel frames)
   - **Fixed**: Fixed in all 6 DOF (for moment-resisting frames)
   - **Roller**: Fixed in Y (vertical) only (for expansion joints)

4. For foundation modeling:
   - Use **Elastic Foundation** supports with soil stiffness values
   - Or use **Nodal Springs** with calculated spring constants

## Step 3: Load Definition

### Dead Loads

1. **Loads** → **Load Cases** → **New**.
2. Name: "Dead Load" → Type: **Dead**.
3. Apply loads:
   - **Beam self-weight**: Robot auto-calculates based on section properties.
   - **Floor load**: **Loads** → **Uniform Load on Bars** → select beams → enter value (e.g., 2.5 kN/m² × 6m span = 15 kN/m)
   - **Cladding load**: Apply as line load on perimeter beams

### Live Loads

1. Create new load case: "Live Load" → Type: **Live**.
2. Apply floor live load:
   - Office: 2.5 kN/m²
   - Storage: 5.0 kN/m²
   - Roof: 1.0 kN/m²

### Wind Loads

1. Create new load case: "Wind X" and "Wind Y" → Type: **Wind**.
2. **Loads** → **Wind Load Generation**:
   - Set building dimensions (height, width, depth)
   - Set wind speed (e.g., 38 m/s for typical location)
   - Set exposure category (B for urban, C for open terrain)
   - Select code: ASCE 7 or Eurocode 1
3. Robot generates wind pressure on building faces automatically.
4. Review the generated pressure distribution and adjust if needed.

### Seismic Loads

1. Create new load case: "Seismic X" and "Seismic Y" → Type: **Seismic**.
2. **Loads** → **Seismic Load Generation**:
   - Set seismic coefficient (e.g., Ss=0.2, S1=0.1 for low seismicity)
   - Set site class (A through F)
   - Set response modification factor (R=3 for OCBF, R=8 for SCBF)
   - Select code: ASCE 7 or Eurocode 8
3. Robot calculates equivalent lateral forces and applies them at each level.

## Step 4: Load Combinations

1. **Loads** → **Load Combinations**.
2. Robot auto-generates combinations based on the selected design code:
   - **LRFD (AISC)**: 1.2D + 1.6L, 1.2D + 1.0W + 0.5L, 0.9D + 1.0W
   - **ASD (AISC)**: D + L, D + 0.75(L + W), 0.6D + W
   - **Eurocode**: 1.35G + 1.5Q, 1.0G + 1.5W, 1.0G + 1.0E

3. Review and customize combinations as needed.

## Step 5: Analysis

1. **Analysis** → **Calculation Model**.
2. Robot generates the finite element model:
   - Bars become beam elements
   - Nodes become joints
   - Supports and loads are mapped

3. **Analysis** → **Run Analysis**.
4. Robot solves the model and displays results:
   - **Deformed shape**: Shows deflection under each load case
   - **Internal forces**: Axial, shear, moment diagrams for each bar
   - **Reactions**: Support reactions for each load case

5. Check for warnings:
   - **Instability warnings**: A joint has insufficient restraint — add supports or bracing
   - **Large displacement warnings**: Deflection exceeds expected values — check load magnitudes

## Step 6: Steel Code Checking

1. **Design** → **Steel Design** → **Steel Member Design**.
2. Select design code:
   - **AISC 360-22** (US)
   - **Eurocode 3** (EU)
   - **BS 5950** (UK)

3. Set design parameters:
   - **Effective length factors (K)**: 
     - K=1.0 for braced frames (sidesway inhibited)
     - K=1.2-2.0 for unbraced frames (sidesway uninhibited)
   - **Unbraced length**: Distance between bracing points
   - **Cb factor**: Lateral-torsional buckling modification factor

4. Click **Design**.
5. Robot checks each member for:
   - **Axial compression**: Column buckling (flexural, torsional)
   - **Axial tension**: Tensile yielding
   - **Bending**: Flexural yielding, lateral-torsional buckling
   - **Shear**: Shear yielding
   - **Combined loading**: Interaction equations (AISC Eq. H1-1, H1-2)

6. Results display as **Unity Check (UC)** values:
   - UC < 1.0: Member passes
   - UC > 1.0: Member fails — increase section size
   - UC 0.85-0.95: Optimally designed (efficient but safe)

## Step 7: Results Interpretation

### Deflection Check

1. **Results** → **Displacements**.
2. Check maximum deflections:
   - **Beams**: L/360 for live load (floor), L/240 for total load
   - **Columns**: Story drift < h/300 for wind, h/50 for seismic
3. If deflection exceeds limits, increase beam depth or add bracing.

### Member Capacity

1. **Results** → **Steel Design Results**.
2. Review the UC table:
   - Sort by UC value (highest first)
   - Members with UC > 1.0 are highlighted in red
   - Members with UC < 0.5 are over-designed — consider reducing section size

3. Optimize: For members with UC < 0.5, try a smaller section. Re-run analysis and design to verify.

### Connection Forces

1. **Results** → **Bar Forces**.
2. Note the maximum forces at each joint:
   - Axial force (for base plate design)
   - Shear force (for shear connection design)
   - Moment (for moment connection design)
3. Export these forces to a connection design tool (IDEA StatiCa or manual calculation).
