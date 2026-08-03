---
title: "VELUX Daylight Visualizer DWG Import Missing Layers, OBJ Import Without Materials, Open Geometry Extremely Light Results, Scale Units Mismatch After Import, and SketchUp Triangulation Requirements: Layer Assignment, Material Export, Geometry Closure, Scale Factor Correction, and Face Triangulation"
excerpt: "VELUX Daylight Visualizer fails for 5 distinct reasons: DWG import missing surface materials from incorrect layer assignment requiring AutoCAD layer configuration, OBJ import without layers from missing material export options requiring Rhino naming page settings, open geometry causing extremely light simulation results from missing ceiling requiring geometry closure, scale units mismatch after import requiring scale factor correction, and SketchUp import requiring triangulated faces for proper import. We cover each with fixes from VELUX documentation and McNeel Forum."
category: "import-and-simulation-errors"
softwareSlug: "velux-daylight-visualizer"
keyword: "VELUX Daylight Visualizer DWG import missing layers surface materials OBJ import without layers Rhino naming page open geometry extremely light simulation missing ceiling scale units mismatch scale factor SketchUp triangulation faces AutoCAD layer configuration material export"
slug: "velux-daylight-visualizer-dwg-import-missing-layers-obj-import-no-materials-open-geometry-extremely-light-scale-units-mismatch-sketchup-triangulation-layer-assignment-material-export-geometry-closure-scale-factor-face-triangulation"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-03"
sources:
  - "https://skylightoffers.com/assets/vms/downloads/daylight-visualizer/userguide-daylight-visualizer-2.pdf"
  - "https://discourse.mcneel.com/t/rhino-export-to-velux-daylight-visualizer/60916"
  - "https://www.velux.com/healthy-buildings/research-and-knowledge/deic-basic-book/daylight/daylight-simulation-tools"
---

# VELUX Daylight Visualizer DWG Import Missing Layers, OBJ Import Without Materials, Open Geometry Extremely Light Results, Scale Units Mismatch After Import, and SketchUp Triangulation Requirements: Layer Assignment, Material Export, Geometry Closure, Scale Factor Correction, and Face Triangulation

VELUX Daylight Visualizer's DWG import, OBJ import, geometry validation, scale handling, and SketchUp import produce errors from incorrect layer assignment, missing material export, open geometry, unit mismatches, and non-triangulated faces. This guide covers the 5 most common VELUX Daylight Visualizer problems with diagnostic steps and community-verified fixes from VELUX documentation and McNeel Forum.

## 1. DWG Import Missing Surface Materials from Incorrect Layer Assignment

### Symptom

When importing a DWG file from AutoCAD into VELUX Daylight Visualizer, surface materials can't be defined correctly. The surfaces all appear as the same material. Layer-based material assignment doesn't work. The simulation uses incorrect surface reflectance values.

### Root Cause

"When creating 3D models in AutoCAD the user has to be aware that lines, polylines and rectangles drawn by the 'Rectangle' function will not be imported into the Daylight Visualizer. Valid solutions could be to use the 'Region' function on a set of lines, 3D Faces or to create 3D solids." The DWG importer in VELUX Daylight Visualizer maps AutoCAD layers to surface materials. If the AutoCAD model doesn't use layers to group building elements (walls, floor, ceiling, windows), the importer can't distinguish between different surface types. Additionally, 2D elements (lines, polylines, rectangles) are not imported — only 3D solids, regions, and 3D faces are recognized.

### Fix

1. **Use AutoCAD layers for surface grouping**:
   - "It is highly recommended to assign several layers to the model"
   - "Each layer representing a group of building elements"
   - Create separate layers for: inner walls, ceiling, floor, window glass
   - Assign each building element to the correct layer

2. **Name the layers descriptively**:
   - "Optionally, name the layers to distinguish better between elements"
   - "As the layer names are also imported"
   - Use names like "Inner_Walls", "Ceiling", "Floor", "Window_Glass"
   - This makes material assignment easier in Daylight Visualizer

3. **Use 3D solids, regions, or 3D faces**:
   - "Lines, polylines and rectangles drawn by the 'Rectangle' function will not be imported"
   - Use the "Region" function on lines
   - Use 3D Faces
   - Or create 3D solids

4. **Assign materials in AutoCAD before export**:
   - "Use the same material on elements with identical surface properties"
   - "All inner walls could share one material while the ceiling had another"
   - This transfers to Daylight Visualizer via DWG layers
   - And simplifies material setup

5. **Check the DWG file before import**:
   - Open the DWG in AutoCAD
   - Verify all elements are 3D solids or regions
   - Verify layers are correctly assigned
   - Remove any 2D elements that won't import

6. **Use the DWG format for layer-based workflow**:
   - DWG preserves layers and layer names
   - OBJ doesn't preserve layers (see Problem 2)
   - For layer-based material assignment, use DWG
   - For material-based assignment, use OBJ

7. **Verify import in Daylight Visualizer**:
   - After importing the DWG
   - Check the surface materials list
   - Verify each layer maps to a surface material
   - Adjust reflectance values as needed

### Community Report

> "When creating 3D models in AutoCAD the user has to be aware that lines, polylines and rectangles drawn by the 'Rectangle' function will not be imported into the Daylight Visualizer. Valid solutions could be to use the 'Region' function on a set of lines, 3D Faces or to create 3D solids. It is highly recommended to assign several layers to the model, each layer representing a group of building elements."

## 2. OBJ Import Without Layers from Rhino

### Symptom

When exporting a Rhino file to OBJ format and importing into VELUX Daylight Visualizer, the model imports without layers. Surface materials can't be assigned by layer. The OBJ file format is the recommended export format from Rhino, but layers are missing.

### Root Cause

"I tried with both DWG- and OBJ-file format. Both file formats can be imported in Velux Daylight Visualizer. However with the DWG-files, I can't define surface materials correctly, and OBJ-files get imported without layers." The OBJ format doesn't natively support layers in the same way as DWG. Rhino's OBJ exporter has options on the "Naming" page that control how objects are named and grouped in the OBJ file. If these options aren't configured correctly, the layer information is lost during export. "According to the Velux Daylight Visualizer manual, OBJ-file format is the correct export format from Rhino."

### Fix

1. **Configure Rhino OBJ export naming options**:
   - "There are options in OBJ export that may help on the Naming page"
   - In Rhino, use File > Export Selected
   - Choose OBJ format
   - In the OBJ export dialog, go to the Naming page
   - Set the naming to include layer names

2. **Use DWG as alternative for layer-based workflow**:
   - "With the DWG-files, I can't define surface materials correctly"
   - But DWG preserves layers
   - If OBJ doesn't work, try DWG
   - And assign materials by layer in Daylight Visualizer

3. **Assign materials in Rhino before export**:
   - "When exporting the OBJ format, ensure that the materials assigned to the model are also exported"
   - "There should be an option in the respective programs to ensure this"
   - In Rhino, assign materials to objects
   - Enable material export in OBJ options

4. **Use the OBJ format for material-based workflow**:
   - OBJ preserves material assignments
   - But not layers
   - If your workflow is material-based, use OBJ
   - If your workflow is layer-based, use DWG

5. **Check the OBJ file for material definitions**:
   - Open the .obj file in a text editor
   - Look for `usemtl` statements
   - These define material assignments
   - If absent, materials weren't exported

6. **Also export the .mtl file**:
   - OBJ files reference .mtl (material template library) files
   - Ensure the .mtl file is exported alongside the .obj file
   - Both files must be in the same directory
   - The .mtl file contains material definitions

7. **Use SketchUp format as alternative**:
   - VELUX Daylight Visualizer supports SKP format
   - Export from Rhino to SKP (if plugin available)
   - Or use an intermediate conversion
   - SKP may preserve both layers and materials

### Community Report

> "I tried with both DWG- and OBJ-file format. Both file formats can be imported in Velux Daylight Visualizer. However with the DWG-files, I can't define surface materials correctly, and OBJ-files get imported without layers. According to the Velux Daylight Visualizer manual, OBJ-file format is the correct export format from Rhino. There are options in OBJ export that may help on the Naming page."

## 3. Open Geometry Causing Extremely Light Simulation Results

### Symptom

After importing a model into VELUX Daylight Visualizer and running a daylight simulation, the results show extremely high daylight levels. The room appears far too bright. The simulation doesn't match expected daylight performance. The model was imported from Rhino via DWG.

### Root Cause

"I found out the solution myself. The problem was that I had not made any ceiling in my geometry, which caused the Velux Daylight Visualizer to calculate the room as extremely light. After closing the geometry with a ceiling, the DWG-export worked just fine." VELUX Daylight Visualizer requires fully closed geometry for accurate daylight simulation. If the geometry is open (e.g., missing ceiling, walls, or floor), daylight enters the space from all directions, resulting in extremely high and unrealistic daylight levels. The simulation engine assumes open faces are windows that let in daylight.

### Fix

1. **Close all geometry before export**:
   - "The problem was that I had not made any ceiling in my geometry"
   - "Which caused the Velux Daylight Visualizer to calculate the room as extremely light"
   - Ensure the model has: floor, ceiling, all walls
   - No open faces except for windows

2. **Check for missing surfaces**:
   - Before exporting, inspect the model
   - Look for missing walls, ceiling, or floor
   - Fill any gaps in the geometry
   - Ensure all surfaces are present

3. **Model windows as separate surfaces**:
   - Windows should be modeled as separate surfaces
   - "Window panes should be modelled as a single layer of polygons"
   - "Also if using multiple panes"
   - Don't leave window openings as holes in walls

4. **Verify geometry after import**:
   - After importing into Daylight Visualizer
   - Use the Plan and Section views
   - Check that all surfaces are present
   - Look for unexpected openings

5. **Use the measure tool to verify**:
   - "After importing a 3D model it is advised to check if the scale is correct"
   - "Use the measure tool in the Plan or Section view"
   - Verify room dimensions
   - Check that surfaces are at expected positions

6. **Check surface orientations**:
   - Surface normals should point inward (into the room)
   - If normals point outward, daylight calculation may be wrong
   - Check the surface orientation in the source CAD
   - Flip normals if needed

7. **Compare with a simple model**:
   - Create a simple room model in Daylight Visualizer
   - Run the simulation
   - Compare results with the imported model
   - If the simple model gives reasonable results, the import has issues

### Community Report

> "I found out the solution myself. The problem was that I had not made any ceiling in my geometry, which caused the Velux Daylight Visualizer to calculate the room as extremely light. After closing the geometry with a ceiling, the DWG-export worked just fine."

## 4. Scale Units Mismatch After Import

### Symptom

After importing a 3D model into VELUX Daylight Visualizer, the scale is incorrect. Room dimensions don't match the original model. The model appears too large or too small. Window sizes are wrong. The simulation results are inaccurate because the geometry is at the wrong scale.

### Root Cause

"After importing a 3D model it is advised to check if the scale is correct as it may differ from project to project." Different CAD programs use different default units. If the source CAD uses meters and Daylight Visualizer expects feet (or vice versa), the imported model will be at the wrong scale. The DWG, DXF, SKP, and OBJ formats may not always preserve unit information, causing the importer to use incorrect conversion factors.

### Fix

1. **Check scale after import**:
   - "After importing a 3D model it is advised to check if the scale is correct"
   - "Use the measure tool in the Plan or Section view"
   - "To make sure that the dimensions are correct"
   - Measure known dimensions (e.g., room width)

2. **Use the Units drop-down list**:
   - "The Units' drop-down list enables the user to choose from SI units and American units"
   - Switch between SI and American units
   - See if the dimensions make sense in either system
   - This helps identify the unit mismatch

3. **Use the scale factor to correct**:
   - "Should the model be out of scale, it is possible to correct this by using the scale factor"
   - Calculate the required scale factor
   - If the model is 100x too large, use scale factor 0.01
   - If the model is 100x too small, use scale factor 100

4. **Set correct units in source CAD before export**:
   - In the source CAD program
   - Set the project units to match what Daylight Visualizer expects
   - Use meters for SI or feet for American units
   - This prevents unit conversion issues

5. **Use the fit function**:
   - "Use the fit function to zoom in/out on the complete model, if needed"
   - This helps visualize the entire model
   - And identify if the scale is obviously wrong
   - Before running the simulation

6. **Verify window dimensions**:
   - Check that window sizes are correct
   - Windows that are too large or too small
   - Will give incorrect daylight results
   - Measure window dimensions after import

7. **Check common unit mismatches**:
   - Meters to feet: multiply by 3.28084
   - Feet to meters: multiply by 0.3048
   - Millimeters to meters: multiply by 0.001
   - Inches to meters: multiply by 0.0254

8. **Re-import with correct units**:
   - If the scale factor doesn't fully fix the issue
   - Re-export from the source CAD with correct units
   - Re-import into Daylight Visualizer
   - Verify the scale is correct

### Community Report

> "After importing a 3D model it is advised to check if the scale is correct as it may differ from project to project. Use the measure tool in the Plan or Section view to make sure that the dimensions are correct. The Units' drop-down list enables the user to choose from SI units and American units for the measure tool. Should the model be out of scale, it is possible to correct this by using the scale factor."

## 5. SketchUp Import Requiring Triangulated Faces

### Symptom

When importing a SketchUp model into VELUX Daylight Visualizer, some surfaces are missing or incorrectly imported. The model has gaps or holes that weren't in the original SketchUp model. Curved surfaces appear as incomplete or faceted.

### Root Cause

"To avoid conflicts when using 3D models from other CAD programs, make sure that the faces are triangulated. Singular lines will not be imported." VELUX Daylight Visualizer requires all faces to be triangulated for proper import. SketchUp automatically triangulates faces when "3 or more lines together" are closed. However, if the SketchUp model contains non-triangulated polygons or singular lines, these elements won't be imported. Curved surfaces in SketchUp are already faceted, but the facet count may need adjustment.

### Fix

1. **Ensure all faces are triangulated**:
   - "Make sure that the faces are triangulated"
   - "Closing 3 or more lines together in Sketch-Up will automatically create triangulated faces"
   - Check the SketchUp model for non-triangulated faces
   - Triangulate any non-triangulated polygons

2. **Remove singular lines**:
   - "Singular lines will not be imported"
   - Remove any standalone lines from the SketchUp model
   - Only faces (surfaces) are imported
   - Lines that don't form part of a face are ignored

3. **Use the polygon and extrude functions**:
   - "Using the polygon functions and extruding them is also possible"
   - These create properly triangulated faces
   - Avoid using just lines without creating faces
   - Ensure all geometry has surface faces

4. **Assign materials in SketchUp**:
   - "Use the paint bucket function to assign materials to the surfaces"
   - "Use the same material on elements with identical surface properties"
   - "All inner walls could share one material while the ceiling had another"
   - Material names are imported into Daylight Visualizer

5. **Name materials descriptively**:
   - "Optionally, name the material to distinguish better between elements"
   - "As the material names are also imported"
   - Use names like "InnerWall", "Ceiling", "Floor", "WindowGlass"
   - This helps with material assignment in Daylight Visualizer

6. **Check curved surfaces**:
   - Curved surfaces in SketchUp are faceted
   - Increase the segment count for smoother curves
   - But not too high (affects import and simulation performance)
   - 24-48 segments per circle is usually sufficient

7. **Export as SKP format**:
   - VELUX Daylight Visualizer supports SKP format
   - Export the SketchUp file directly
   - This preserves materials and triangulation
   - Without intermediate conversion

8. **Verify import**:
   - After importing the SKP file
   - Check that all surfaces are present
   - Use Plan and Section views
   - Verify no surfaces are missing

### Community Report

> "To avoid conflicts when using 3D models from other CAD programs, make sure that the faces are triangulated. Singular lines will not be imported. Closing 3 or more lines together in Sketch-Up will automatically create triangulated faces. Using the polygon functions and extruding them is also possible. When the model is built, use the paint bucket function to assign materials to the surfaces."

## 6. Additional VELUX Daylight Visualizer Issues

### Copy and Paste Not Available for Imported Models

**Issue**: "Copy Ctrl+C (Not usable for imported models), Paste Ctrl+V (Not usable for imported models)"
**Fix**: Copy and paste are only available for models created within Daylight Visualizer's built-in modeller. For imported models, make changes in the source CAD and re-import.

### Grid Spacing Not Available for Imported Models

**Issue**: "Grid spacing Ctrl+G (Not usable for imported models)"
**Fix**: Grid spacing is only for the built-in modeller. Imported models use the geometry as-is from the source CAD file.

### Supported Import Formats

**Issue**: Which formats are supported for import?
**Fix**: "Supported 3D file formats: DWG, DXF, SKP and OBJ." Import from Revit, Archicad, AutoCAD, SketchUp, Rhino, and more. Use the format that best preserves your model's layers and materials.

### EN 17037 Compliance

**Issue**: Does Daylight Visualizer comply with daylight standards?
**Fix**: "High-fidelity daylight simulations are ideal for evaluating compliance with the European Standard for Daylight in Buildings EN 17037." The simulations are validated against CIE 171:2006. "Maximal error lower than 5.13% and average error lower than 1.29%."

### Project Properties

**Issue**: How to get information about the imported model?
**Fix**: "File menu also contains Project properties in which it is possible to get information about the model." Use Project Properties to check model details, surface count, and other metadata.

### Preferences Configuration

**Issue**: How to configure Daylight Visualizer preferences?
**Fix**: "Preferences Ctrl+P" in the File menu. Configure simulation parameters, display settings, and default values. Set preferences before running simulations.

### Window Pane Modelling

**Issue**: How should window panes be modelled?
**Fix**: "Window panes should be modelled as a single layer of polygons, also if using multiple panes." Don't model individual glass layers. The simulation handles multiple panes through material properties, not geometry.

### BIM/CAD Compatibility

**Issue**: Which BIM/CAD programs are compatible?
**Fix**: "Import 3D models from Revit, Archicad, Autocad, SketchUp, Rhino and more." Export from these programs to DWG, DXF, SKP, or OBJ. Import the exported file into Daylight Visualizer.

## Best Practices

1. **Assign layers in AutoCAD for DWG export** — enables layer-based material assignment
2. **Configure Rhino OBJ naming page** — preserves layer/material information
3. **Close all geometry before export** — missing ceiling causes extremely light results
4. **Check scale after import** — use measure tool to verify dimensions
5. **Use scale factor for unit correction** — corrects mismatched units
6. **Triangulate all faces for SketchUp** — singular lines won't import
7. **Assign materials in source CAD** — material names transfer to Daylight Visualizer
8. **Use SKP format for SketchUp** — preserves materials and triangulation
9. **Model window panes as single polygons** — don't model individual glass layers
10. **Verify simulation against EN 17037** — validated with <5.13% maximal error
