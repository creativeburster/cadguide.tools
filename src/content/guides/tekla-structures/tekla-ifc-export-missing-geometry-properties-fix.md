---
title: "Tekla Structures IFC Export Problems: Missing Geometry, Wrong Properties, and File Size Optimization"
excerpt: "IFC exports from Tekla Structures have missing parts, incorrect property sets, or excessively large file sizes. I cover the IFC export settings, property mapping, and the model organizer workflow that ensure clean IFC delivery."
category: "troubleshooting"
softwareSlug: "tekla-structures"
keyword: "Tekla Structures IFC export missing geometry properties file size"
slug: "tekla-ifc-export-missing-geometry-properties-fix"
author: "CADGuide Tools Editorial Team"
readTime: "8 min"
date: "2025-06-25"
sources:
  - "https://support.tekla.com/article/tekla-structures-performance-issues"
  - "https://support.tekla.com/doc/tekla-structures/2025/sys_modeling_tips_for_large_models"
---

# Tekla Structures IFC Export Problems: Missing Geometry, Wrong Properties, and File Size Optimization

Tekla Structures is widely used for steel and precast concrete detailing, and IFC is the primary format for exchanging Tekla models with architects, MEP engineers, and construction managers. However, IFC exports from Tekla can have missing geometry, incomplete property sets, or file sizes that are too large for practical use. These issues stem from export filter settings, property mapping configuration, and geometry conversion options.

## Problem 1: Missing Parts in IFC Export

### Cause: Export Filter Excludes Parts

1. Go to **File → Export → IFC Export**
2. Check the **Export Filter** settings
3. The filter determines which parts are included in the export
4. Common filter issues:
   - **Phase filter**: Only parts in the selected phase are exported
   - **Object type filter**: Certain object types may be excluded
   - **Status filter**: Parts with certain statuses may be excluded

### Fix: Review and Adjust Export Filter

1. In the IFC Export dialog, click **Filter**
2. Set **All phases** if you want all parts exported
3. Set **All object types** if you want all types exported
4. Set **All statuses** if you want all parts regardless of status
5. Or create a specific filter for the export (e.g., "Export to Architect" filter that excludes bolts and welds)

### Cause: Parts Not Numbered

Some IFC export settings require parts to be numbered before export:

1. Go to **Numbering → Number All Objects**
2. Wait for numbering to complete
3. Re-run the IFC export
4. Unnumbered parts may be excluded from the export depending on settings

## Problem 2: Excessive IFC File Size

### Fix: Use the Right Geometry Representation

1. In the IFC Export dialog, go to **Export Settings**
2. Set **Geometry representation**:
   - **Brep**: Exact geometry, largest file size (use for fabrication)
   - **Extrusion**: Simplified extruded solids, smaller file (use for coordination)
   - **Bounding box**: Simple boxes, smallest file (use for clash detection only)
3. For most coordination purposes, **Extrusion** is the best balance

### Fix: Exclude Unnecessary Objects

1. In the IFC Export dialog, go to **Object Content**
2. Exclude objects not needed by the recipient:
   - **Bolts**: Not needed by architects — exclude
   - **Welds**: Not needed by architects — exclude
   - **Reinforcement**: Not needed by architects — exclude for architectural coordination
   - **Surface treatment**: Exclude unless specifically requested
3. Each excluded object type reduces file size

### Fix: Export by Phase or Area

1. Instead of exporting the entire model, export by phase
2. In the export filter, select one phase at a time
3. Create separate IFC files for each phase
4. The recipient can merge them or work with them separately
5. Each file is smaller and faster to process

## Problem 3: Missing or Incorrect Properties

### Cause: Property Mapping Not Configured

1. Go to **File → Export → IFC Export → Property Mapping**
2. Check which properties are mapped to IFC property sets
3. Default mapping may not include all relevant properties

### Fix: Configure Property Mapping

1. In the Property Mapping dialog, add properties:
   - **Part mark**: Map to `IfcLabel`
   - **Material**: Map to `Pset_MaterialCommon`
   - **Profile**: Map to `Pset_ProfileCommon`
   - **Phase**: Map to custom property set
   - **Numbering series**: Map to custom property set
2. Save the property mapping as a preset
3. Use the preset for all exports to ensure consistency

### Cause: User-Defined Attributes Not Exported

1. User-defined attributes (UDAs) are custom properties added to parts
2. By default, UDAs are not included in IFC export
3. Go to **File → Export → IFC Export → Advanced**
4. Check **Export user-defined attributes**
5. Map each UDA to an IFC property:
   - UDA name → IFC property name
   - UDA value type → IFC property type (text, number, boolean)

## Problem 4: Wrong Coordinate System

### Cause: Model Coordinates Don't Match Site Coordinates

1. Tekla models are typically modeled near the origin
2. Site coordinates may be large numbers (e.g., 758375, 6800)
3. IFC export with wrong coordinate system causes the model to appear at the wrong location in the recipient's software

### Fix: Use Base Points

1. Go to **File → Settings → Base Points**
2. Create a base point with the site coordinates
3. In the IFC Export dialog, select the base point as the **Coordinate system**
4. The exported IFC file uses the site coordinates
5. The recipient's software positions the model at the correct location

## Problem 5: IFC Export Slow

### Fix: Reduce Export Scope

1. Export by phase or area instead of the entire model
2. Use the extrusion geometry representation (faster than Brep)
3. Exclude unnecessary objects
4. Close all views before exporting
5. Disable model history collection during export

### Fix: Optimize Model Before Export

1. Repair the model database: **File → Tools → Repair Model Database**
2. Number all parts before export
3. Delete unused shapes: **File → Tools → Delete Unused Shapes**
4. Compress the model: save with all views closed

## Problem 6: Model Organizer Not Set Up

The Model Organizer is Tekla's tool for organizing parts into logical hierarchies for IFC export:

### Fix: Set Up Model Organizer

1. Go to **Modeling → Model Organizer**
2. Create a hierarchy:
   - **Site** → **Building** → **Floor** → **Zone** → **Part**
3. Assign parts to the appropriate locations in the hierarchy
4. In the IFC Export dialog, enable **Use Model Organizer hierarchy**
5. The exported IFC file has the correct spatial hierarchy
6. This is essential for BIM coordination and facility management

### Benefits of Model Organizer

- Parts are organized by building, floor, and zone in the IFC file
- Recipients can filter by location in their BIM software
- Required for COBie-compliant exports (facility management)
- Makes the IFC file more useful for construction scheduling

## Problem 7: IFC Export Version Compatibility

### Fix: Use the Right IFC Version

1. In the IFC Export dialog, set **IFC version**:
   - **IFC2x3**: Most widely compatible (use for most exchanges)
   - **IFC4**: Newer, better geometry (use if recipient supports it)
2. Set **IFC format**:
   - **Step**: Standard text format (most compatible)
   - **XML**: XML-based (rarely used, larger files)
   - **ZIP**: Compressed (smaller files, same content)
3. Confirm the recipient's IFC version support before exporting

## Problem 8: Clash Detection Export

For exporting to Navisworks or Solibri for clash detection:

### Fix: Configure Clash Detection Export

1. Use **Extrusion** geometry representation (sufficient for clash detection)
2. Include all parts that could be involved in clashes:
   - Steel parts
   - Concrete parts
3. Exclude non-clash objects:
   - Bolts and welds (too small for meaningful clash detection)
   - Surface treatments
   - Reinforcement (unless specifically checking rebar clashes)
4. Set **Coordinate system** to match the master coordination model
5. Export as IFC2x3 (Navisworks and Solibri both support this)

## Summary

| Problem | Root Cause | Fix |
|---------|-----------|-----|
| Missing parts | Export filter excludes parts | Review and adjust filter |
| Excessive file size | Brep geometry, all objects included | Use Extrusion, exclude unnecessary objects |
| Missing properties | Property mapping not configured | Configure property mapping, export UDAs |
| Wrong coordinates | No base point set | Create and select base point |
| Slow export | Large model, Brep geometry | Reduce scope, optimize model first |
| No spatial hierarchy | Model Organizer not set up | Create hierarchy in Model Organizer |
| Version compatibility | Wrong IFC version | Use IFC2x3 for maximum compatibility |
| Clash detection export | Wrong settings for clash detection | Use Extrusion, include structural parts only |

The most important practice is setting up the Model Organizer before your first IFC export — it provides the spatial hierarchy that makes the IFC file useful for BIM coordination. Combine this with the Extrusion geometry representation and a well-configured export filter to produce IFC files that are complete, correctly organized, and reasonably sized. Always confirm the recipient's IFC version support and coordinate system requirements before exporting.
