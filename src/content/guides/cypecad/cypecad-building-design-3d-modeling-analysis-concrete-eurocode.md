---
title: "CYPECAD Building Design: 3D Modeling, Analysis, and Concrete Design per Eurocode 2"
excerpt: "A guide to CYPECAD for building structural design covering 3D model creation from architectural plans, automatic load generation, finite element analysis, and reinforced concrete design per Eurocode 2 and national annexes."
category: "workflow"
softwareSlug: "cypecad"
keyword: "cypecad building design"
slug: "cypecad-building-design-3d-modeling-analysis-concrete-eurocode"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://info.cype.com/en/software/cypecad/"
  - "https://www.youtube.com/@CYPEIngenieros"
---

# CYPECAD Building Design: 3D Modeling, Analysis, and Concrete Design per Eurocode 2

I started using CYPECAD on a project in Barcelona about five years ago, and it was a bit of a culture shock coming from ETABS. The workflow is very European — tightly integrated with Eurocodes, with a strong emphasis on automatic reinforcement detailing and drawing production. Once I got used to it, I came to appreciate how it handles the full chain from architectural plan import to concrete design per Eurocode 2. Let me walk you through the workflow.

## Project Setup

### Creating a New Project

1. File > New Job
2. Set:
   - **General data**: Project name, location, date
   - **Units**: Metric (kN, m, cm, mm)
   - **Design code**: Eurocode 2 (EN 1992-1-1) with national annex
   - **Concrete grade**: C25/30, C30/37, C35/45
   - **Steel grade**: B500S (fyk = 500 MPa)
   - **Seismic code**: Eurocode 8 (EN 1998-1) if applicable

### Importing Architectural Plans

1. Files > Import > DXF/DWG
2. Select architectural floor plans (one per story)
3. Set:
   - **Scale**: Verify scale matches (1:100 typical)
   - **Origin**: Set coordinate origin
   - **Layer mapping**: Map architectural layers to CYPECAD layers
4. Import one DXF per floor as a background reference

## Modeling

### Grid and Axes

1. Job > Grid > Define Axes
2. Create X and Y grid lines:
   - Based on imported architectural plans
   - Place axes at column centerlines
3. Name axes: A, B, C... (X) and 1, 2, 3... (Y)

### Columns

1. Beams > Columns > Insert
2. Click at grid intersections (on the DXF background)
3. Set:
   - **Section**: Rectangular (b × h), circular (Ø)
   - **Material**: Concrete (grade per project)
   - **Height**: Per story height
4. Columns extend from floor to floor

### Beams

1. Beams > Insert Beam
2. Click between two columns to place a beam
3. Set:
   - **Type**: Simply supported, continuous, cantilever
   - **Section**: Rectangular (b × h), T-beam, L-beam
   - **Material**: Concrete
4. For continuous beams: define spans and support conditions

### Walls

1. Walls > Insert Wall
2. Draw wall outline (click points or trace DXF)
3. Set:
   - **Thickness**: e.g., 200mm, 250mm, 300mm
   - **Material**: Concrete (reinforced)
   - **Height**: Per story

### Slabs

1. Slabs > Insert Slab
2. Draw slab boundary (closed polygon)
3. Set:
   - **Type**: One-way, two-way, waffle, flat slab
   - **Thickness**: e.g., 200mm, 250mm
   - **Material**: Concrete
4. For flat slabs: define drop panels and column capitals

### Foundations

1. Foundations > Insert Footing
2. Click at column base
3. Set:
   - **Type**: Isolated, combined, mat
   - **Dimensions**: Width × length × thickness
   - **Soil bearing capacity**: e.g., 200 kN/m²
   - **Depth**: Below ground level

## Loading

### Automatic Dead Load

1. CYPECAD automatically calculates:
   - **Self-weight**: From element dimensions and material density
   - **Slab weight**: Including beam tributary loads
   - **Wall weight**: Including cladding and partitions

### Live Load

1. Loads > Live Loads
2. Set per Eurocode 1 (EN 1991-1-1):
   - **Residential**: 2.0 kN/m²
   - **Office**: 3.0 kN/m²
   - **Corridor/stairs**: 3.0 kN/m²
   - **Storage**: 5.0 kN/m²
   - **Parking**: 2.5 kN/m²
3. Apply to slabs by area

### Wind Load

1. Loads > Wind Load
2. Set per Eurocode 1 (EN 1991-1-4):
   - **Basic wind speed (vb)**: e.g., 26 m/s
   - **Terrain category**: 0, I, II, III, or IV
   - **Building height**: For pressure variation
3. CYPECAD automatically:
   - Calculates wind pressure at each elevation
   - Applies to building faces
   - Generates wind load cases

### Seismic Load

1. Loads > Seismic Load
2. Set per Eurocode 8 (EN 1998-1):
   - **Reference PGA (agR)**: e.g., 0.25g
   - **Importance factor (γI)**: 1.0 (II), 1.2 (III), 1.4 (IV)
   - **Soil type**: A, B, C, D, or E
   - **Behavior factor (q)**: 3.0 (medium ductility), 5.85 (high ductility)
   - **Damping**: 5%
3. CYPECAD automatically:
   - Calculates seismic mass per story
   - Generates response spectrum
   - Calculates base shear
   - Distributes lateral forces per story

## Analysis

### Finite Element Analysis

1. Calculate > Analyze
2. CYPECAD performs:
   - **Mesh generation**: For slabs and walls (plate elements)
   - **Stiffness matrix assembly**: For all elements
   - **Load vector generation**: For all load cases
   - **Displacement calculation**: Nodal displacements
   - **Force calculation**: Member and plate forces
3. Analysis includes:
   - Linear static analysis
   - Modal analysis (if seismic)
   - Response spectrum analysis (if seismic)

### P-Delta

1. Calculate > Analysis Options > P-Delta
2. Enable P-Delta for:
   - Buildings taller than 5 stories
   - High seismic zones
   - Flexible structures

## Concrete Design (Eurocode 2)

### Beam Design

1. Results > Beams
2. For each beam, CYPECAD calculates:
   - **Design moment (MEd)**: From critical load combination
   - **Required reinforcement (As1, As2)**: Top and bottom
   - **Minimum reinforcement**: As,min = 0.26 × fctm/fyk × b × d
   - **Maximum reinforcement**: As,max = 0.04 × Ac
   - **Shear reinforcement (Asw/s)**: Stirrup area per unit spacing
3. Design per EN 1992-1-1:
   - **Flexure**: MEd ≤ MRd = As × fyd × (d - λx/2)
   - **Shear**: VEd ≤ VRd,c + VRd,s (concrete + stirrup contribution)
   - **Minimum stirrups**: ρw,min = 0.08 × √fck/fyk
4. Output:
   - **Top bars**: e.g., 4 Ø20
   - **Bottom bars**: e.g., 3 Ø16
   - **Stirrups**: Ø8 @ 150mm (critical), Ø8 @ 250mm (general)

### Column Design

1. Results > Columns
2. For each column, CYPECAD calculates:
   - **Design loads (NEd, MEd,y, MEd,z)**: From critical combination
   - **Interaction diagram**: N-M curve for the section
   - **Required reinforcement**: Total As and bar arrangement
   - **Minimum reinforcement**: ρmin = 0.10 × NEd/fcd (but ≥ 0.002 × Ac)
   - **Maximum reinforcement**: ρmax = 0.04 × Ac
3. Design per EN 1992-1-1:
   - **Axial + bending**: Check (NEd, MEd) within interaction diagram
   - **Shear**: VEd ≤ VRd,c (usually no stirrup design needed for columns)
   - **Buckling**: Check slenderness ratio λ ≤ λlim
4. Output:
   - **Section**: 400 × 400mm
   - **Reinforcement**: 8 Ø20 (1.57%)
   - **Ties**: Ø8 @ 200mm (general), Ø8 @ 100mm (confinement)

### Wall Design

1. Results > Walls
2. For each wall, CYPECAD calculates:
   - **In-plane forces**: N (axial), V (shear), M (moment)
   - **Out-of-plane forces**: M (bending), V (shear)
   - **Required reinforcement**: Vertical and horizontal, each face
3. Design per EN 1992-1-1:
   - **Vertical reinforcement**: ρv ≥ 0.002 (minimum)
   - **Horizontal reinforcement**: ρh ≥ 0.002 (minimum)
   - **Shear**: VEd ≤ VRd,c + VRd,s
4. Output:
   - **Vertical bars**: Ø12 @ 200mm each face
   - **Horizontal bars**: Ø10 @ 200mm each face
   - **Boundary elements**: If required (per EN 1998-1 for seismic)

### Slab Design

1. Results > Slabs
2. For each slab, CYPECAD calculates:
   - **Moments (Mxx, Myy, Mxy)**: From FEM analysis
   - **Shear (Vx, Vy)**: From FEM analysis
   - **Required reinforcement**: Per unit width (mm²/m)
3. Design per EN 1992-1-1:
   - **Flexure**: As = MEd / (fyd × z), z ≈ 0.9d
   - **Shear**: VEd ≤ VRd,c (usually no shear reinforcement for slabs)
   - **Minimum reinforcement**: As,min = 0.26 × fctm/fyk × b × d
   - **Maximum spacing**: smax = 3h or 400mm
4. Output:
   - **Top reinforcement**: Ø12 @ 200mm (support zone), Ø10 @ 200mm (general)
   - **Bottom reinforcement**: Ø10 @ 200mm (general)

## Construction Drawings

### Automatic Drawing Generation

1. Drawings > Generate Drawings
2. CYPECAD generates:
   - **Floor plans**: Column, beam, and wall layouts
   - **Foundation plan**: Footing layout and dimensions
   - **Reinforcement plans**: Bar layouts for beams, columns, slabs
   - **Sections**: Typical cross-sections with reinforcement
   - **Details**: Standard hook, lap splice, and anchorage details
3. Export to DXF/DWG for CAD integration

### Reinforcement Detailing

1. Drawings > Reinforcement Detailing
2. View detailed reinforcement for each element:
   - **Beam sections**: With bar arrangement, stirrups, hooks
   - **Column sections**: With longitudinal bars, ties, confinement
   - **Slab mesh**: With bar sizes, spacing, and extent
3. Automatic bar scheduling:
   - Bar mark, shape, diameter, length, quantity
   - Total steel weight per element and per floor

## Wrapping Up

CYPECAD's integrated workflow is what makes it special — from architectural plans to concrete design to reinforcement drawings, all in one package. The automatic load generation per Eurocode saves me hours, and the reinforcement drawings are good enough to issue with minimal cleanup. If you're working in a Eurocode jurisdiction, especially in Spain or Latin America, CYPECAD is hard to beat for efficiency.
