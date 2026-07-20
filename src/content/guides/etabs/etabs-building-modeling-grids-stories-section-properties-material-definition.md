---
title: "ETABS Building Modeling: Grids, Stories, Section Properties, and Material Definition"
excerpt: "ETABS building modeling tools create structural models with grids, story levels, section properties, and material definitions. We cover the grid system setup, story definition, frame section assignment, slab and wall properties, and material specification for building analysis."
category: "workflow"
softwareSlug: "etabs"
keyword: "ETABS building modeling grids stories section properties material definition frame slab wall structural analysis"
slug: "etabs-building-modeling-grids-stories-section-properties-material-definition"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-29"
sources:
  - "https://www.csiamerica.com/products/etabs"
  - "https://www.csiamerica.com/support/learn"

---

# ETABS Building Modeling: Grids, Story Levels, Section Properties, and Material Definition

We've modeled hundreds of buildings in ETABS for structural design — from low-rise concrete buildings to high-rise steel towers. ETABS (Extended Three-Dimensional Analysis of Building Systems) is the industry standard for building structural analysis, used by most structural engineering firms worldwide. Getting the model setup right — grids, stories, sections, and materials — is the foundation of accurate analysis and design.

## ETABS Overview

ETABS is specialized for building structures:
- **Grid system**: Orthogonal or non-orthogonal grids define the building layout
- **Story-based**: Buildings are defined by story levels (floors)
- **Frame elements**: Beams and columns with section properties
- **Area elements**: Slabs and walls with thickness and material
- **Loads**: Dead, live, wind, seismic, and temperature loads
- **Analysis**: Static, dynamic (modal, response spectrum, time history)
- **Design**: Concrete, steel, and composite member design

## Grid System Setup

### Creating Grids

1. File → New Model
2. The **Grid System** dialog opens
3. Set grid dimensions:
   - **X grids**: Number and spacing in the X direction (e.g., 6 grids at 6m each)
   - **Y grids**: Number and spacing in the Y direction (e.g., 4 grids at 5m each)
   - **Z grids (stories)**: Number and height of story levels
4. Grid options:
   - **Uniform spacing**: All bays the same size
   - **Custom spacing**: Different bay sizes (enter each spacing)
   - **Cylindrical grids**: For circular buildings
5. Set the origin location (bottom-left corner by default)
6. Click **OK**

### Modifying Grids

1. Go to **Edit** → **Edit Grid Data** → **Grids**
2. Modify:
   - **Grid coordinates**: Change X or Y grid positions
   - **Add grids**: Insert new grid lines
   - **Delete grids**: Remove grid lines
   - **Grid labels**: Rename grids (e.g., A, B, C for X; 1, 2, 3 for Y)
3. For non-orthogonal grids:
   - Use **Reference Planes** for angled grids
   - Define multiple grid systems for complex layouts
4. Click **OK**

### Story Definition

1. Go to **Edit** → **Story Data** → **Edit Story Data**
2. The story table shows:
   - **Story name**: e.g., Base, Story 1, Story 2, Roof
   - **Height**: Height of each story (e.g., 3.5m, 3.0m)
   - **Similar to**: Copy properties from another story
   - **Master story**: Changes propagate to similar stories
3. Set story properties:
   - **Base story**: Ground level (elevation 0)
   - **Typical stories**: Repeated floor levels
   - **Roof**: Top level
4. Click **OK**

### Story Height Best Practices

- **Residential**: 3.0-3.5m typical
- **Commercial/Office**: 3.5-4.5m typical
- **Industrial**: 4.0-6.0m or more
- **Ground floor**: Often taller than upper floors (lobby, retail)
- **Total height**: Sum of all story heights

## Material Definition

### Concrete

1. Go to **Define** → **Materials** → **Add New Material**
2. Select material type: **Concrete**
3. Set properties:
   - **Material name**: e.g., "C30" or "4000psi"
   - **Weight per unit volume**: 24 kN/m³ (normal weight) or 25 kN/m³ (reinforced)
   - **Mass per unit volume**: Auto-calculated from weight
   - **Modulus of elasticity (E)**:
     - C25: 25,000 MPa
     - C30: 30,000 MPa
     - C40: 40,000 MPa
     - 4000 psi: 3,605 ksi
     - 5000 psi: 4,031 ksi
   - **Poisson's ratio**: 0.2 for concrete
   - **Coefficient of thermal expansion**: 10×10⁻⁶ /°C
   - **Specified concrete compressive strength (f'c)**:
     - C25: 25 MPa
     - C30: 30 MPa
     - 4000 psi: 27.6 MPa
   - **Concrete tensile strength**: Auto-calculated or specified
4. Click **OK**

### Steel

1. Go to **Define** → **Materials** → **Add New Material**
2. Select material type: **Steel**
3. Set properties:
   - **Material name**: e.g., "A36" or "A992"
   - **Weight per unit volume**: 77 kN/m³ (steel)
   - **Modulus of elasticity (E)**: 200,000 MPa (29,000 ksi)
   - **Poisson's ratio**: 0.3
   - **Coefficient of thermal expansion**: 12×10⁻⁶ /°C
   - **Yield strength (Fy)**:
     - A36: 250 MPa (36 ksi)
     - A992: 345 MPa (50 ksi)
     - A572 Gr 50: 345 MPa (50 ksi)
   - **Ultimate strength (Fu)**:
     - A36: 400 MPa (58 ksi)
     - A992: 450 MPa (65 ksi)
4. Click **OK**

### Rebar

1. Go to **Define** → **Materials** → **Add New Material**
2. Select material type: **Rebar**
3. Set properties:
   - **Material name**: e.g., "Grade60" or "B500"
   - **Modulus of elasticity**: 200,000 MPa
   - **Yield strength (Fy)**:
     - Grade 60: 420 MPa (60 ksi)
     - Grade 80: 550 MPa (80 ksi)
     - B500: 500 MPa
   - **Ultimate strength**: 620+ MPa
4. Click **OK**

## Section Properties

### Frame Sections (Beams and Columns)

1. Go to **Define** → **Section Properties** → **Frame Sections**
2. Click **Add New Property**
3. Select section type:
   - **Rectangular**: Concrete beam or column (width × depth)
   - **Circular**: Concrete column (diameter)
   - **Steel we-section**: W-shapes, S-shapes, M-shapes
   - **Steel tube**: HSS (hollow structural section)
   - **Steel channel**: C-shapes, MC-shapes
   - **Steel angle**: L-shapes (single or double)
   - **Built-up**: Custom welded sections
   - **Composite**: Steel section with concrete slab
4. For concrete rectangular:
   - **Section name**: e.g., "B300x500" (300mm wide × 500mm deep)
   - **Width**: 300mm
   - **Depth**: 500mm
   - **Material**: C30 (concrete material)
   - **Rebar**: Configure longitudinal bars and ties
5. For steel sections:
   - **Section name**: e.g., "W14x90"
   - Select from steel section database (AISC, European, British, etc.)
   - **Material**: A992 (steel material)
6. Click **OK**

### Steel Section Databases

ETABS includes standard section databases:
- **AISC (American)**: W, M, S, HP, C, MC, L, HSS, WT, MT, ST
- **European (Eurocode)**: IPE, IPN, HEA, HEB, HEC, UPE, UPN, L
- **British**: UB, UC, PFC, RSA, SHS, RHS, CHS
- **Japanese**: JIS sections
- **Australian**: Universal beams and columns
- **Custom**: User-defined sections

### Wall Sections

1. Go to **Define** → **Section Properties** → **Wall Sections**
2. Click **Add New Property**
3. Set:
   - **Wall name**: e.g., "W200" (200mm thick wall)
   - **Thickness**: 200mm
   - **Material**: C30 (concrete)
   - **Modulus of elasticity**: From material
   - **Poisson's ratio**: From material
4. For steel walls:
   - **Plate thickness**: Steel plate thickness
   - **Stiffeners**: Optional stiffener configuration
5. Click **OK**

### Slab Sections

1. Go to **Define** → **Section Properties** → **Slab Sections**
2. Click **Add New Property**
3. Set:
   - **Slab name**: e.g., "S150" (150mm thick slab)
   - **Thickness**: 150mm
   - **Material**: C30 (concrete)
   - **Type**: Floor or Drop panel or Mat
4. For composite slabs:
   - **Deck type**: Steel deck profile
   - **Concrete thickness above deck**: e.g., 65mm
   - **Deck thickness**: e.g., 1.0mm
5. Click **OK**

## Drawing Elements

### Drawing Columns

1. Go to **Draw** → **Draw Joint Objects** (or click the column icon)
2. Select the frame section (e.g., "C400x400")
3. Click on grid intersections to place columns
4. Columns are placed at the current story level
5. To place columns at all stories:
   - Select the column
   - **Edit** → **Replicate** → **Linear** (in Z direction)

### Drawing Beams

1. Go to **Draw** → **Draw Frame Objects** (or click the beam icon)
2. Select the frame section (e.g., "B300x500")
3. Click on grid lines to draw beams between columns
4. Beams connect the grid intersections
5. For continuous beams:
   - Click multiple grid points in sequence
   - ETABS creates a continuous beam through the points

### Drawing Walls

1. Go to **Draw** → **Draw Area Objects** → **Wall** (or click the wall icon)
2. Select the wall section (e.g., "W200")
3. Click grid intersections to draw wall segments
4. Walls are drawn as area elements between grid lines

### Drawing Slabs

1. Go to **Draw** → **Draw Area Objects** → **Floor** (or click the slab icon)
2. Select the slab section (e.g., "S150")
3. Options:
   - **Click in region**: Click inside a closed beam/wall boundary to auto-create the slab
   - **Draw polygon**: Click corners to define the slab boundary
4. The slab is created at the current story level

## Modifying Elements

### Assigning Sections

1. Select elements (beams, columns, walls, slabs)
2. **Assign** → **Frame** → **Frame Sections** (for beams and columns)
3. Select the section to assign
4. Click **OK**
5. The selected elements update to the new section

### Modifying Properties

1. Select elements
2. Right-click → **Properties**
3. Modify:
   - **Section**: Change the section property
   - **Material**: Change the material
   - **Orientation**: Rotate the section
   - **End releases**: Pin or fix the ends
   - **Modifiers**: Adjust stiffness (cracked section factors)

### End Releases

1. Select a beam
2. **Assign** → **Frame** → **Releases/Partial Fixity**
3. Release moments or forces at either end:
   - **Moment 3-3 (major axis)**: Release bending about the strong axis
   - **Moment 2-2 (minor axis)**: Release bending about the weak axis
   - **Axial**: Release axial force
   - **Shear**: Release shear force
4. Use for: Simple connections (pin-ended beams), shear connections

## Stiffness Modifiers

### Cracked Section Factors

1. Select elements
2. **Assign** → **Frame** → **Property Modifiers**
3. Set modification factors:
   - **Moment of inertia (we)**: 0.35-0.70 for concrete beams (cracked)
   - **Moment of inertia (we)**: 0.50-0.80 for concrete columns
   - **Axial area (A)**: 1.0 (usually not modified)
   - **Shear area**: 1.0 (usually not modified)
4. These factors account for concrete cracking under service loads
5. ACI 318 recommends:
   - Beams: We = 0.35 × Igross
   - Columns: We = 0.70 × Igross
   - Walls: We = 0.70 × Igross (uncracked) or 0.35 × Igross (cracked)

## Common Issues

### Grids Don't Match the Architectural Plan

- Import a DXF/DWG background plan for reference
- Adjust grid positions to match the architectural layout
- Use non-orthogonal grids for irregular building shapes
- Add reference planes for angled grid lines

### Story Heights Are Wrong

- Check the story data table for correct heights
- Verify the base elevation (usually 0)
- Check for mezzanine levels or split levels
- Ensure the total height matches the building height

### Section Properties Are Missing

- Define all materials before defining sections
- Create all section properties before drawing elements
- Check that sections are assigned to elements (select and verify)
- Use the **Model Definition** report to verify all sections

### Columns Are Not Connected to Beams

- Verify that columns and beams are at the same grid intersections
- Check story alignment (columns should be continuous between stories)
- Use **Merge joints** to connect nearby joints
- Check for duplicate joints at the same location

## Summary

ETABS building modeling starts with grid and story setup. Create orthogonal or non-orthogonal grids matching the architectural plan, and define story levels with correct heights. Define materials (concrete, steel, rebar) with correct properties (E, density, f'c, Fy). Create frame sections (rectangular, circular, steel W-shapes, HSS) for beams and columns, wall sections for shear walls, and slab sections for floors. Draw columns at grid intersections, beams between columns, walls along grid lines, and slabs within beam boundaries. Assign sections to elements and configure end releases for pinned connections. Apply stiffness modifiers (0.35-0.70 for cracked concrete) per ACI 318. The most common issues — grid mismatches, wrong story heights, missing sections, and disconnected elements — are addressed by importing a DXF background, checking the story table, defining all sections before drawing, and merging joints. A correctly set up model is the foundation of accurate structural analysis and design in ETABS.
