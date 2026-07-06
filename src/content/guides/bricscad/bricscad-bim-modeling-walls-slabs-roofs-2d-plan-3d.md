---
title: "BricsCAD BIM Modeling: Walls, Slabs, and Roof Tools from 2D Plans"
excerpt: "A step-by-step BIM modeling workflow in BricsCAD that converts 2D floor plans into intelligent 3D building models with parametric walls, slabs, and roofs. Covers classification, quantity takeoff, and IFC export."
category: "workflow"
softwareSlug: "bricscad"
keyword: "bricscad bim modeling"
slug: "bricscad-bim-modeling-walls-slabs-roofs-2d-plan-3d"
author: "CADGuide Technical Editorial"
readTime: "14 min read"
date: "2026-06-30"
sources:
  - "https://www.bricsys.com/bricscad/bim"

---

# BricsCAD BIM Modeling: Walls, Slabs, and Roof Tools from 2D Plans

BricsCAD BIM provides a unique approach to building information modeling: start with 2D drawings and let the software generate the 3D model automatically. Unlike Revit, which requires you to model in 3D from the start, BricsCAD BIM can take a cleaned-up 2D floor plan and convert linework into parametric BIM elements in minutes. This guide walks through the complete workflow from 2D plan to classified BIM model with quantity takeoff.

## Preparing the 2D Floor Plan

Before any 3D conversion, the 2D drawing must be cleaned up and organized. The `BIMCLASSIFY` command works best when linework is on clearly named layers and drawn with consistent geometry.

### Layer Preparation

Create or verify the following layer structure:

- `A-WALL-EXT` — exterior walls (drawn as closed polylines or double lines)
- `A-WALL-INT` — interior walls
- `A-FLOR-SLAB` — floor slabs (closed polylines)
- `A-ROOF` — roof outlines (closed polylines)
- `A-DOOR` — door openings (arcs or blocks)
- `A-WIND` — window openings (rectangles or blocks)

### Geometry Cleanup

Run `CLEANUP` (or `OVERKILL` if you imported from AutoCAD) to remove duplicate lines and gaps. Use `JOIN` to connect fragmented wall segments into continuous polylines. The `BIMCLASSIFY` command needs closed boundaries to generate wall solids, so any gaps in the linework will cause classification failures.

## Automatic Classification with BIMCLASSIFY

The `BIMCLASSIFY` command is the core of BricsCAD's 2D-to-3D workflow. It analyzes the drawing and assigns BIM classifications based on layer names, geometry patterns, and spatial relationships.

To run automatic classification:

1. Type `BIMCLASSIFY` and select `Automatic`
2. The command scans all entities and attempts to classify them as walls, slabs, doors, windows, or roofs
3. Review the classification report in the Mechanical Browser panel
4. Manually reclassify any misidentified elements using `BIMCLASSIFY` > `Manual`

### Wall Height Assignment

After classification, walls are assigned a default height (typically 3000mm). To set project-specific heights:

1. Select all exterior walls and open the Properties panel
2. Set `Bottom elevation` to 0 and `Top elevation` to your plate height (e.g., 2700mm)
3. For interior walls, set the same top elevation
4. If you have multi-story walls, use `BIMDRAG` to adjust wall tops at floor boundaries

## Generating Slabs and Floors

Slabs are generated from closed polyline outlines on the slab layer. After classification:

1. Select the slab entities
2. In the Properties panel, set `Thickness` (e.g., 150mm for concrete, 25mm for wood subfloor)
3. Set `Bottom elevation` to the correct level (0 for ground floor, 3000 for second floor, etc.)
4. Use `BIMSUBTRACT` to cut openings for stairs and shafts

For multi-layer floor assemblies (e.g., concrete slab + insulation + finish floor), use `BIMCOMPOSE` to create a compound slab. Each layer can have its own material assignment and thickness.

## Roof Creation Tools

BricsCAD BIM offers three roof creation methods:

### Method 1: BIMROOF from Outline

Draw a closed polyline for the roof footprint, then run `BIMROOF`. The command prompts for:

- **Roof type**: Gable, Hip, Shed, or Mansard
- **Pitch angle**: Enter in degrees or as a ratio (e.g., 6:12 = 26.57°)
- **Overhang distance**: How far the roof extends beyond the walls
- **Direction**: For gable and shed roofs, specify the ridge direction

### Method 2: BIMROOF from Faces

If you have existing 3D roof faces (e.g., imported from SketchUp), select the faces and run `BIMCLASSIFY` > `Roof`. This assigns roof properties and enables parametric editing.

### Method 3: Manual Solid Modeling

For complex roof geometries (dormers, valleys, hips with varying pitches), model the roof as a solid using `EXTRUDE`, `SLICE`, and `UNION`, then classify it as a roof element with `BIMCLASSIFY` > `Manual` > `Roof`.

## Door and Window Insertion

After walls are classified and have 3D geometry, use `BIMINSERT` to place doors and windows:

1. Run `BIMINSERT` and select a door or window from the library
2. Click on a wall face — the opening is automatically cut
3. The inserted element is parametric: adjust width, height, sill height, and swing direction in the Properties panel
4. Use `BIMCOPY` to duplicate elements along a wall with consistent spacing

The BricsCAD BIM library includes standard door and window types. To add custom types, create a block with `BIMINSERT` parameters and save it to the library folder.

## IFC Export for Collaboration

To share the BIM model with Revit, ArchiCAD, or other BIM software:

1. Run `IFCEXPORT` and select the entities to export (or type `ALL`)
2. Choose the IFC version (IFC 2x3 for maximum compatibility, IFC 4 for advanced features)
3. Select the Model View Definition (MVD):
   - `Coordination View` — standard for architectural and structural coordination
   - `Reference View` — includes geometric references for overlay
   - `Design Transfer View` — full model transfer with property sets
4. Assign building storeys using `BIMSTORY` before export to ensure proper level hierarchy

### Property Set Mapping

BricsCAD BIM classification data maps to IFC property sets automatically:

- Wall classification → `IfcWall` with `Pset_WallCommon`
- Slab classification → `IfcSlab` with `Pset_SlabCommon`
- Roof classification → `IfcRoof` with `Pset_RoofCommon`

Custom properties can be added through the `BIMPROPSET` command and will export as `Pset_Custom` entries.

## Quantity Takeoff with BIMQUANTITY

Once the model is classified, generate a quantity takeoff:

1. Run `BIMQUANTITY` to open the Quantity Takeoff panel
2. Select the elements to include (or `ALL` for the entire model)
3. The report includes: count, length, area, volume, and weight by element type
4. Export to CSV or XLSX for cost estimation

The takeoff respects BIM classifications, so walls, slabs, and roofs are grouped separately with material-specific calculations.

## Common Issues and Solutions

- **Walls not generating**: Check that the 2D linework is closed. Use `PEDIT` > `Join` to close gaps, then reclassify
- **Door openings not cutting**: Ensure the wall has 3D height before inserting doors. `BIMINSERT` requires solid wall geometry
- **IFC export missing elements**: Verify all elements are classified. Unclassified solids are excluded from IFC export
- **Roof pitch not matching**: Check drawing units. If the drawing is in inches, the pitch ratio must use inch-based measurements

## Conclusion

BricsCAD BIM's 2D-to-3D workflow is one of the fastest paths from existing CAD drawings to a BIM model. The `BIMCLASSIFY` command eliminates manual modeling time, and the IFC export ensures interoperability with other BIM platforms. By following this workflow — clean the 2D plan, classify automatically, adjust heights and properties, insert openings, and export to IFC — you can produce a coordinated BIM model from legacy 2D drawings in a fraction of the time required by traditional BIM tools.
