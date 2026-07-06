---
title: "Autodesk Robot Concrete Slab Design: FEM Analysis and Reinforcement"
excerpt: "How to model and analyze concrete slabs in Autodesk Robot using finite elements — covering mesh generation, load application, reinforcement design, and deflection checking."
category: "workflow"
softwareSlug: "autodesk-robot"
keyword: "autodesk robot concrete slab fem reinforcement"
slug: "autodesk-robot-concrete-slab-fem-reinforcement"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://help.autodesk.com/view/RSAPRO/2026/ENU/slab-design"
  - "https://forums.autodesk.com/t5/robot-structural-analysis-forum/slab"
---

# Autodesk Robot Concrete Slab Design: FEM Analysis and Reinforcement

Concrete slab design in Robot uses finite element analysis to calculate moments, shears, and deflections. The reinforcement design module then determines the required bar sizes and spacing. I design flat slabs, one-way slabs, and two-way slabs in Robot regularly. Here's the workflow.

## Step 1: Define Slab Geometry

1. **Geometry** → **Slabs** → **New Panel**.
2. Draw the slab outline:
   - Click nodes to define corners
   - Close the polygon to complete the slab
3. Set slab thickness:
   - **One-way slab**: L/20 to L/24 (span/depth ratio)
   - **Two-way slab**: L/30 to L/36
   - **Flat slab (no beams)**: L/30 to L/33
   - Typical: 150-250mm for residential, 200-300mm for commercial

4. Assign material:
   - Concrete: C25/30 (Eurocode) or f'c = 4000 psi (ACI)
   - Set Young's modulus, Poisson's ratio, and unit weight

## Step 2: Define Supports

### Beam Supports

If the slab is supported by beams:
1. The beams are already modeled as bar elements.
2. The slab panel edges align with the beam centerlines.
3. Robot automatically connects the slab to the beams at shared nodes.

### Column Supports (Flat Slab)

For flat slabs supported directly on columns:
1. Define column locations as nodes.
2. At each column node, define a support:
   - **Pinned**: Fixed in Z (vertical) translation
   - **Spring**: Use soil or column stiffness for more accurate modeling

3. For drop panels or column capitals:
   - Model as a thicker slab region around the column
   - Or define a sub-panel with increased thickness

### Wall Supports

For slabs supported on walls:
1. Model walls as line supports or wall panels.
2. Line support: Fixed in Z along the wall length.
3. Wall panel: Robot connects the slab to the wall automatically.

## Step 3: Mesh Generation

1. **Analysis** → **Meshing** → **Meshing Parameters**.
2. Set mesh parameters:
   - **Element type**: Quadrilateral (preferred) or Triangular
   - **Element size**: 0.3-0.5m for typical slabs (smaller = more accurate but slower)
   - **Refinement**: Enable refinement at supports and load concentrations
   - **Mesh quality**: Check for distorted elements (aspect ratio < 4)

3. Click **Generate Mesh**.
4. Robot creates the finite element mesh and displays it.
5. Verify:
   - Elements are mostly quadrilateral (triangular elements are less accurate)
   - Element sizes are relatively uniform
   - No extremely small or distorted elements

## Step 4: Apply Loads

### Dead Load

1. Create load case: "Slab Dead Load" → Type: **Dead**.
2. Robot auto-calculates slab self-weight based on thickness and unit weight.
3. Additional dead load (finishes, partitions):
   - **Loads** → **Uniform Load on Panels** → select slab → enter value
   - Typical: 1.5-2.5 kN/m² (floor finishes, ceiling, partitions)

### Live Load

1. Create load case: "Slab Live Load" → Type: **Live**.
2. Apply:
   - Residential: 2.0 kN/m²
   - Office: 2.5-3.0 kN/m²
   - Storage: 5.0 kN/m²
   - Corridors: 4.0 kN/m²

### Line Loads (Walls on Slab)

1. **Loads** → **Line Load on Panels**.
2. Draw the line load path on the slab.
3. Enter load magnitude (kN/m) — typically from wall self-weight.

### Point Loads (Equipment)

1. **Loads** → **Point Load on Panels**.
2. Click the location on the slab.
3. Enter force (kN) and location.

## Step 5: Load Combinations

1. **Loads** → **Load Combinations**.
2. Robot auto-generates combinations:
   - **ULS (Ultimate Limit State)**: 1.35D + 1.5L (Eurocode) or 1.2D + 1.6L (ACI)
   - **SLS (Serviceability Limit State)**: 1.0D + 1.0L (for deflection check)

## Step 6: Analysis

1. **Analysis** → **Run Analysis**.
2. Robot solves the FEM model and calculates:
   - **Displacements**: Z-deflection at each node
   - **Moments**: Mx, My, Mxy at each element
   - **Shears**: Vx, Vy at each element
   - **Reactions**: Support reactions at beams, columns, walls

## Step 7: Reinforcement Design

1. **Design** → **Reinforcement Design** → **Slab Reinforcement**.
2. Select design code:
   - **ACI 318-19** (US)
   - **Eurocode 2 (EN 1992-1-1)** (EU)

3. Set reinforcement parameters:
   - **Concrete cover**: 25mm (interior) or 40mm (exterior/exposure)
   - **Bar size**: #4 (12mm) to #6 (16mm) typical
   - **Yield strength**: 420 MPa (Grade 60) or 500 MPa (B500)
   - **Minimum reinforcement**: ACI requires 0.0018 × b × h for Grade 60 steel
   - **Maximum spacing**: min(2h, 450mm) per ACI

4. Click **Design**.
5. Robot calculates required reinforcement:
   - **Top reinforcement**: Required over supports (negative moment regions)
   - **Bottom reinforcement**: Required at midspan (positive moment regions)
   - **Additional reinforcement**: For high shear or moment concentrations

6. Results display as:
   - **Required area (As,req)**: mm²/m of slab width
   - **Provided area (As,prov)**: Based on selected bar size and spacing
   - **Utilization ratio**: As,req / As,prov (should be < 1.0)

## Step 8: Interpret Results

### Moment Maps

1. **Results** → **Maps** → **Moments**.
2. View Mx, My, and Mxy contour maps:
   - **Red areas**: High positive moment (tension at bottom) — need bottom reinforcement
   - **Blue areas**: High negative moment (tension at top) — need top reinforcement
   - **Mxy (torsion)**: High at corners and re-entrant — need additional reinforcement

### Deflection Check

1. **Results** → **Maps** → **Displacements**.
2. Check maximum deflection:
   - **ACI limit**: L/360 for live load, L/240 for total load (sensitive elements)
   - **Eurocode limit**: L/250 for total load, L/500 for incremental deflection
3. If deflection exceeds limits:
   - Increase slab thickness
   - Add beams to reduce span
   - Use higher strength concrete

### Reinforcement Drawings

1. **Results** → **Reinforcement Drawings**.
2. Robot generates reinforcement layouts:
   - **Top mesh**: Bar size, spacing, and extent of top reinforcement
   - **Bottom mesh**: Bar size, spacing, and extent of bottom reinforcement
   - **Additional bars**: Extra reinforcement at high-moment areas
3. Export to CAD for detailing.

## Common Slab Analysis Issues

**Mesh too coarse**: Results are inaccurate with large elements. Reduce mesh size to 0.2-0.3m for accurate moment distribution, especially near supports.

**Punching shear not checked**: Robot's slab module doesn't automatically check punching shear at column locations. Use the **Punching Shear** design module separately for flat slabs.

**Excessive deflection at cantilevers**: Cantilever slabs have high deflection. Check the deflection at the cantilever tip — it should be less than L/125 (ACI) or L/250 (Eurocode).
