---
title: "Chief Architect Roof and Terrain Design: Automatic Roofs, Dormers, and Site Grading"
excerpt: "A guide to roof and terrain design in Chief Architect covering automatic roof generation (gable, hip, gambrel, mansard), manual roof editing, dormer placement, skylights, terrain modeling with elevation data, and site grading for residential lots."
category: "workflow"
softwareSlug: "chief-architect"
keyword: "chief architect roof terrain design"
slug: "chief-architect-roof-terrain-design-automatic-roofs-dormers-site-grading"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://www.chiefarchitect.com/support/article/KB-01049/"
  - "https://www.chiefarchitect.com/products/premier/"
---

# Chief Architect Roof and Terrain Design: Automatic Roofs, Dormers, and Site Grading

Roof and terrain design in Chief Architect is one of my favorite parts of the software. The automatic roof generation from wall outlines is almost magical — you draw the exterior walls, tell it what roof style you want, and it builds it. For complex roofs with dormers and valleys, there's manual editing available too. And the terrain tools handle site grading and elevation data well. Let me walk you through both.

## Automatic Roof Generation

### Building a Roof

1. Build > Roof > Build Roof
2. Set general parameters:
   - **Pitch**: 6:12 (typical), 4:12 (low), 12:12 (steep)
   - **Overhang (eave)**: 12" (standard), 24" (deep), 6" (minimal)
   - **Overhang (rake)**: 12" (standard)
   - **Framing**: Stick framing (rafters) or trusses
   - **Roof material**: Asphalt shingles, metal, tile, slate
   - **Gutter type**: Standard (5" K-style), half-round, none
3. Click "Build"
4. Chief Architect generates roof planes for all exterior walls

### Roof Types

#### Gable Roof
- Two sloping planes meeting at a ridge
- Triangular gable ends
- Set: Pitch, overhang, gable vent

#### Hip Roof
- All sides slope to the walls
- No gable ends
- Set: Pitch, overhang

#### Shed Roof
- Single sloping plane
- Used for additions, porches, modern designs
- Set: Pitch (lower than main roof), direction

#### Gambrel Roof
- Two pitches per side (steep lower, shallow upper)
- Barn-style appearance
- Set: Lower pitch, upper pitch, knee wall location

#### Mansard Roof
- Steep lower section (nearly vertical)
- Flat or shallow upper section
- Set: Lower pitch (typically 24:12), upper pitch (1:12)

### Per-Wall Roof Settings

1. Select a wall > Roof > Roof Options
2. Set per wall:
   - **Roof type over this wall**: Gable, hip, shed, or none
   - **Pitch**: Different pitch per wall
   - **Overhang**: Different overhang per wall
3. This allows mixed roof types:
   - Front: Gable
   - Sides: Hip
   - Rear: Shed (for porch)

## Manual Roof Editing

### Editing Roof Planes

1. Select a roof plane
2. Edit:
   - **Pitch**: Change individual plane pitch
   - **Direction**: Change slope direction
   - **Height**: Adjust ridge or eave height
   - **Baseline**: Move the wall line for the roof plane
3. Use the edit handles to:
   - **Move edge**: Drag edge to resize
   - **Rotate**: Rotate the plane
   - **Extend**: Extend to meet another plane

### Creating Valleys and Hips

1. When two roof planes meet:
   - **Hip**: Outside corner (planes slope toward each other)
   - **Valley**: Inside corner (planes slope away from each other)
2. Chief Architect automatically generates:
   - **Hip rafters**: At outside corners
   - **Valley rafters**: At inside corners
   - **Ridge board**: At the top where planes meet

### Roof Intersections

For complex roof intersections (L-shaped houses, additions):
1. Build the main roof first
2. Build the addition roof
3. Chief Architect automatically:
   - Creates valley where roofs intersect
   - Adjusts ridge heights
   - Creates cricket or saddle if needed

## Dormers

### Adding a Dormer

1. Build > Dormer > Automatic Dormer
2. Set:
   - **Dormer type**: Shed, gable, hip, eyebrow
   - **Width**: 4'-0" to 8'-0" (typical)
   - **Height**: 4'-0" to 6'-0" (typical)
   - **Roof pitch**: 6:12 (matching main roof) or different
   - **Window**: Size and style
3. Click on the roof plane where the dormer should go
4. Chief Architect:
   - Cuts the main roof
   - Creates dormer walls
   - Creates dormer roof
   - Places window in dormer

### Manual Dormer

1. Draw dormer walls on the floor below the roof
2. Build > Roof > Build Roof (for dormer only)
3. Connect dormer roof to main roof
4. More control but more work

### Dormer Types

- **Shed dormer**: Single-slope roof (flat-looking)
- **Gable dormer**: Triangular gable end with window
- **Hip dormer**: Hipped roof on dormer
- **Eyebrow dormer**: Curved roof (decorative)

## Skylights

### Adding a Skylight

1. Build > Skylight
2. Click on a roof plane
3. Set:
   - **Type**: Fixed, venting, tubular
   - **Width**: 2'-0" to 4'-0" (typical)
   - **Length**: 3'-0" to 6'-0" (typical)
   - **Curb height**: 4" (typical for deck-mounted)
   - **Glass**: Clear, low-E, tempered
4. Chief Architect:
   - Cuts the roof opening
   - Creates skylight frame
   - Creates interior light well

## Roof Framing

### Automatic Framing

1. Build > Framing > Build Roof Framing
2. Set:
   - **Rafter size**: 2×8, 2×10, 2×12
   - **Rafter spacing**: 16" or 24" O.C.
   - **Ridge board**: 2×10 or 2×12
   - **Collar ties**: Yes/No, height
   - **Ceiling joists**: 2×8 or 2×10, 16" or 24" O.C.
3. Chief Architect generates:
   - **Rafter layout**: Each rafter with length and angle
   - **Ridge board**: Length and location
   - **Hip/valley rafters**: Length and angle
   - **Ceiling joists**: Layout and sizes
   - **Framing plan**: 2D drawing showing all framing

### Truss Roof

1. Build > Framing > Build Roof Trusses
2. Set:
   - **Truss type**: Fink, Howe, scissors, attic
   - **Span**: Auto-calculated from wall spacing
   - **Pitch**: Matching roof pitch
   - **Overhang**: Matching roof overhang
   - **Spacing**: 24" O.C. (typical)
3. Chief Architect generates truss layout

## Terrain Modeling

### Creating Terrain

1. Terrain > Create Terrain
2. Set:
   - **Terrain size**: Larger than the lot (e.g., 200' × 200')
   - **Subdivision density**: 50 × 50 (grid resolution)
3. Chief Architect creates a flat terrain by default

### Elevation Data

1. Terrain > Elevation Data
2. Enter elevation points:
   - **Point 1**: (0, 0) at elevation 100.0
   - **Point 2**: (50, 0) at elevation 98.0
   - **Point 3**: (100, 0) at elevation 96.0
   - **Point 4**: (0, 50) at elevation 101.0
   - **Point 5**: (50, 50) at elevation 99.0
3. Chief Architect:
   - Interpolates between points
   - Generates contour lines
   - Creates 3D terrain surface

### Contour Lines

1. Terrain > Contour Lines
2. Set:
   - **Interval**: 1' or 2' (typical for residential)
   - **Minor interval**: 0.5' (for detailed grading)
   - **Major interval**: 5' or 10' (for overview)
3. Display:
   - **Major contours**: Heavier line weight
   - **Minor contours**: Lighter line weight
   - **Labels**: Elevation at each major contour

### Property Boundary

1. Terrain > Property Line
2. Draw property boundary:
   - Enter bearing and distance: N 45° E, 100'
   - Or click points on the terrain
3. Set:
   - **Setbacks**: Front (25'), Side (5'), Rear (20')
   - **Building envelope**: Auto-calculated from setbacks
4. Display:
   - **Property line**: Heavy dashed line
   - **Setbacks**: Dashed line
   - **Building envelope**: Light dashed line

### Site Features

1. **Driveway**: Terrain > Driveway
   - Draw path from street to garage
   - Set width: 10' (single), 20' (double)
   - Set material: Asphalt, concrete, gravel, pavers

2. **Walkway**: Terrain > Walkway
   - Draw path from driveway to front door
   - Set width: 4' (standard)
   - Set material: Concrete, pavers, stone

3. **Patio**: Terrain > Patio
   - Draw patio area
   - Set material: Concrete, pavers, stone, wood

4. **Deck**: Build > Deck
   - Draw deck outline
   - Set height: 12" to 36" (above grade)
   - Set material: Composite, wood, PVC
   - Add railings: If height > 30"

5. **Retaining Wall**: Terrain > Retaining Wall
   - Draw wall path
   - Set height: 1' to 6'
   - Set material: Concrete, stone, timber, block

### Landscaping

1. Library > Plants
2. Place plants:
   - **Trees**: Deciduous (oak, maple), evergreen (pine, spruce)
   - **Shrubs**: Foundation plantings, hedges
   - **Flowers**: Annual, perennial
   - **Ground cover**: Grass, ivy, mulch
3. Set:
   - **Plant size**: Mature height and spread
   - **Quantity**: Number of plants
   - **Spacing**: Per plant type

## Grading and Earthwork

### Grading

1. Terrain > Grading
2. Set building floor elevation:
   - **First floor**: At grade (e.g., 100.0)
   - **Basement**: Below grade (e.g., 92.0)
3. Set site grading:
   - **High point**: At building (e.g., 100.0)
   - **Slope away**: 2% minimum (1/4" per foot)
   - **Low point**: At drainage area (e.g., 97.0)
4. Chief Architect:
   - Adjusts terrain to match grading
   - Shows cut/fill areas
   - Calculates earthwork volumes

### Cut and Fill

1. Terrain > Earthwork
2. Set:
   - **Existing grade**: From elevation data
   - **Proposed grade**: From grading plan
3. Chief Architect calculates:
   - **Cut volume**: Soil to be removed (cubic yards)
   - **Fill volume**: Soil to be added (cubic yards)
   - **Net volume**: Cut - Fill (positive = export, negative = import)
4. Use for:
   - Construction cost estimation
   - Drainage planning
   - Permit applications

## Site Plan Production

### Creating a Site Plan

1. Layout > Send to Layout > Site Plan
2. Include:
   - **Property boundary**: With bearings and distances
   - **Setbacks**: Front, side, rear
   - **Building footprint**: With dimensions
   - **Driveway and walkway**: With dimensions
   - **Contour lines**: With elevation labels
   - **North arrow**: With north direction
   - **Scale bar**: Graphic scale
3. Set scale: 1" = 20' (typical for site plans)

## Wrapping Up

The roof and terrain tools in Chief Architect are two of my favorite features. The automatic roof generation is almost magical — draw the walls, pick a style, and there's your roof. For complex roofs, the manual editing tools give you full control. And the terrain modeling with cut/fill calculations is great for site plans. My tip: always check the roof in 3D after generating it — sometimes the automatic dormer placement needs a bit of manual adjustment to look right.
