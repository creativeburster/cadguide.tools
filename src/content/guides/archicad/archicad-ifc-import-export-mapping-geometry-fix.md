---
title: "ArchiCAD IFC Import and Export: Mapping, Geometry Quality, and Coordination Workflow"
excerpt: "IFC files imported into ArchiCAD have wrong geometry, missing properties, or excessive file sizes. I cover the IFC translation setup, geometry simplification, and the BIM coordination workflow that ensures clean IFC exchange."
category: "workflow"
softwareSlug: "archicad"
keyword: "ArchiCAD IFC import export mapping geometry coordination"
slug: "archicad-ifc-import-export-mapping-geometry-fix"
author: "CAD IT Admin"
readTime: "9 min"
date: "2025-06-25"
sources:
  - "https://support.graphisoft.com/hc/en-us/articles/18795669276561-Troubleshooting-speed-issues-in-Archicad"
  - "https://www.graphisoft.com/us/keep-files-running-fast-and-lean"
---

# ArchiCAD IFC Import and Export: Mapping, Geometry Quality, and Coordination Workflow

IFC (Industry Foundation Classes) is the open BIM exchange format used for sharing models between different BIM software. ArchiCAD has native IFC support, but IFC exchange is rarely plug-and-play. Users report that imported IFC files have wrong geometry, missing properties, or excessive file sizes. Exported IFC files may not contain the right level of detail for downstream applications. These issues stem from IFC version mismatches, translation map configuration, and geometry conversion settings.

## Understanding IFC Versions

### IFC2x3 vs IFC4

- **IFC2x3**: The most widely supported version. Use this for maximum compatibility.
- **IFC4**: Newer version with better geometry definition and property sets. Use when all parties support it.
- **IFC4.3**: Latest version with infrastructure extensions. Use for civil/infrastructure projects.

Always confirm which IFC version your collaborators support before exporting.

## Fix 1: Configure IFC Translation Maps

Translation maps control how ArchiCAD elements are converted to IFC entities and vice versa:

### Export Translation Setup

1. Go to **File → Save As → IFC**
2. Click **Translation Setup**
3. In the **Mapping** tab:
   - Map ArchiCAD element types to IFC entities:
     - ArchiCAD Wall → `IfcWall`
     - ArchiCAD Slab → `IfcSlab`
     - ArchiCAD Roof → `IfcRoof`
     - ArchiCAD Door → `IfcDoor`
     - ArchiCAD Window → `IfcWindow`
   - Map ArchiCAD layers to IFC classifications
4. In the **Geometry** tab:
   - Set **Geometry Type**:
     - **Brep**: Exact boundary representation (largest file, most precise)
     - **Extrusion**: Simplified extruded solids (smaller file, good for most uses)
     - **Bounding Box**: Simple box per element (smallest file, for coordination only)
   - Set **Detail Level**:
     - **Coarse**: Minimal detail (for coordination)
     - **Medium**: Standard detail (for most workflows)
     - **Fine**: Full detail (for fabrication)
5. Save the translation setup as a preset

### Import Translation Setup

1. Go to **File → Open → Open IFC**
2. Click **Translation Setup**
3. In the **Mapping** tab:
   - Map IFC entities to ArchiCAD element types
   - Map IFC classifications to ArchiCAD layers
4. In the **Geometry** tab:
   - Set **Simplification**: Enable to reduce complex Brep geometry
   - Set **Merge Coplanar Faces**: Enable to reduce face count
5. Save the translation setup as a preset

## Fix 2: Reduce IFC File Size

Large IFC files are slow to import and export. Common causes:

### Use Extrusion Instead of Brep

1. In the export translation setup, set **Geometry Type** to **Extrusion**
2. Extrusion produces smaller files than Brep
3. Most BIM applications can read extruded solids
4. Use Brep only for complex geometry that can't be represented as extrusions

### Exclude Unnecessary Elements

1. In the IFC export dialog, use the **Filter** tab
2. Exclude elements not needed by the recipient:
   - Furniture (for structural coordination)
   - MEP elements (for architectural coordination)
   - 2D elements (lines, fills, text — not useful in IFC)
3. Use layer combinations to control what's exported

### Export by Story

1. Instead of exporting the entire building, export by story
2. Create separate IFC files for each floor
3. This keeps each file smaller and faster to process
4. The recipient can merge the files in their BIM software

## Fix 3: Fix Imported Geometry Issues

### Missing or Distorted Geometry

1. Check the IFC version: ensure the file is IFC2x3 or IFC4
2. Try a different import translation setup
3. Use **Model Checker** (if available) to validate the IFC file before import
4. If geometry is still wrong, ask the sender to export with **Extrusion** instead of **Brep**

### Excessive Polygon Count

1. After import, select all imported elements
2. Use **Design → Modify Morph → Simplify** to reduce polygon count
3. Or use **Edit → Reshape → Simplify Geometry** (if available)
4. For imported objects, replace high-poly versions with ArchiCAD library equivalents

### Elements at Wrong Elevation

1. Check the IFC file's coordinate system
2. In the import settings, set the **Survey Point** to match the project's survey point
3. If the IFC file uses a different coordinate system, set up a coordinate transformation
4. Use **Options → Project Preferences → Survey Point** to align coordinates

## Fix 4: Preserve Properties During Exchange

### Export Properties

1. In the export translation setup, go to the **Properties** tab
2. Select which property sets to export:
   - **Pset_WallCommon**: Common wall properties (fire rating, thermal, acoustic)
   - **Pset_ManufacturerTypeInformation**: Manufacturer and model information
   - Custom property sets: Any project-specific properties
3. Ensure ArchiCAD classification system is mapped to IFC classification
4. Properties without classification mapping won't be exported

### Import Properties

1. In the import translation setup, go to the **Properties** tab
2. Enable **Import Property Sets**
3. Map IFC property sets to ArchiCAD properties
4. Imported properties appear in the Element Settings dialog under the **Properties** section

## Fix 5: Use the BIM Collaboration Workflow

### Reference IFC Files Instead of Importing

1. Go to **File → External Content → Attach IFC as Reference**
2. The IFC file is referenced, not imported
3. The ArchiCAD file stays small
4. When the IFC file is updated, the reference can be reloaded
5. Use this for coordination with other disciplines

### Use Model Synchronization

1. If using BIMcloud or BIMcloud Basic:
   - Store the IFC file on BIMcloud
   - All team members see the same version
   - Updates are automatically distributed
2. If not using BIMcloud:
   - Store IFC files in a shared folder
   - Use **File → External Content → Reload** to update references

## Fix 6: Use the IFC Model Checker

Before importing or exporting IFC files, validate them:

1. Use **buildingSMART IFC Model Checker** (free, online)
2. Or use **Solibri Model Checker** (paid, more comprehensive)
3. The checker identifies:
   - Invalid geometry
   - Missing required properties
   - Classification errors
   - File structure issues
4. Fix issues in the source BIM software before exchanging

## Fix 7: Coordinate with Specific Software

### Revit to ArchiCAD

1. Ask the Revit user to export as IFC2x3 with **Extrusion** geometry
2. Use the **Revit to ArchiCAD** translation preset (included in ArchiCAD)
3. Common issues:
   - Revit walls import as morphs instead of walls → check mapping
   - Revit levels don't match ArchiCAD stories → adjust story elevation after import
   - Revit families import as generic objects → map to ArchiCAD library parts

### Tekla to ArchiCAD

1. Ask the Tekla user to export as IFC2x3 with **Brep** geometry (steel sections need Brep)
2. Use the **Tekla to ArchiCAD** translation preset
3. Common issues:
   - Steel sections import as morphs → expected, use for reference only
   - Bolts and welds import as separate elements → hide or filter by layer

### ArchiCAD to Navisworks

1. Export as IFC2x3 with **Extrusion** geometry
2. Set detail level to **Medium**
3. Include all disciplines (architecture, structure, MEP)
4. Navisworks reads IFC natively — no translation needed

## Fix 8: IFC Export Best Practices

1. **Classify all elements**: Use ArchiCAD's classification system to ensure elements map to correct IFC entities
2. **Fill in properties**: Complete fire rating, thermal, and acoustic properties in Element Settings
3. **Set correct zones**: Assign elements to zones for spatial coordination
4. **Clean the model**: Compress and audit before exporting
5. **Test the export**: Import the IFC file back into a blank ArchiCAD file to verify

## Summary

| Fix | Type | Impact |
|-----|------|--------|
| Configure translation maps | Preventive | Ensures correct entity mapping |
| Use Extrusion instead of Brep | Export | Reduces file size by 50-80% |
| Exclude unnecessary elements | Export | Reduces file size by 20-50% |
| Simplify imported geometry | Import | Reduces polygon count by 50-90% |
| Preserve properties | Exchange | Maintains data for coordination |
| Reference IFC instead of importing | Workflow | Keeps ArchiCAD file small |
| Use IFC Model Checker | Preventive | Catches errors before exchange |
| Software-specific presets | Coordination | Improves cross-platform exchange |

The most important practice is configuring translation maps before your first IFC exchange. Create presets for each collaborator type (structural engineer, MEP consultant, client) with the appropriate geometry type, detail level, and property sets. Always reference IFC files instead of importing them to keep your ArchiCAD file lean. And always validate IFC files with a model checker before sharing them with the project team.
