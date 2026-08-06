---
title: "MoI3D NURBS Import and Export Errors"
excerpt: "MoI3D NURBS Import and Export Errors: symptoms, root causes, and step-by-step fixes, verified against MoI3D Forum."
category: "troubleshooting"
softwareSlug: "moi3d"
keyword: "MoI3D STEP export incompatibility tube bender sweep surface structure Split Closed Surfaces STEP import trim boundary errors seam crossing V5 beta CAD Exchanger solid import naked edges Alibre export quality manual repair SAT format FBX import not available polygon-only SubD import STP bevel corner errors trim boundary closed surface file analysis improvement"
slug: "moi3d-nurbs-import-and-export-errors"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-03"
sources:
  - "https://moi3d.com/forum/lmessages.php?msg=11678.1&webtag=MOI"
  - "https://moi3d.com/forum/lmessages.php?msg=11381.1&webtag=MOI"
  - "https://moi3d.com/forum/lmessages.php?msg=11653.1&webtag=MOI"
---

# MoI3D NURBS Import and Export Errors: STEP Export Incompatibility with Tube Bender Software from Sweep Surface Structure Requiring Split Closed Surfaces Setting, STEP Import Trim Boundary Errors from Seam Crossing Requiring V5 Beta or CAD Exchanger Conversion, Solid Import Naked Edges from Alibre Export Quality Requiring Manual Repair or SAT Format, FBX Import Not Available from Polygon-Only Format Requiring SubD Import or Alternative Workflow, and STP Bevel Corner Errors from Trim Boundary on Closed Surface Requiring File Analysis and Improvement

MoI3D's STEP export, STEP import, solid import, FBX handling, and trim boundary processing produce errors from surface structure differences, seam crossing calculations, export quality, polygon format limitations, and trim boundary handling. This guide covers the 5 most common MoI3D problems with diagnostic steps and community-verified fixes from MoI3D Forum.

## 1. STEP Export Incompatibility with Tube Bender Software from Sweep Surface Structure

### Symptom

Using MoI to create parts files for a tube bender. 95% of files go through without problems. Sometimes STEP files don't import into the tube bender software. The same DXF path imported into SolidWorks and exported as STEP imports fine. Both STEP files look identical when overlaid. The error is usually about the tube bender software not being able to read the ends of the shape.

### Root Cause

"SolidWorks generates parts of the sweep using a trimmed torus or cylinder analytic surface when it's possible to do so, while MOI's sweep always makes a fitted surface using the general purpose sweep refinement process." MoI3D's sweep creates a general NURBS surface, while SolidWorks creates analytic surfaces (torus, cylinder) where possible. The STEP file from MoI contains general NURBS surface entities, while SolidWorks STEP contains torus surface entities. The tube bender software expects analytic surfaces and can't handle general NURBS surfaces at the tube ends.

### Fix

1. **Set ExportSplitClosedSurfaces in moi.ini**:
   - This splits closed surfaces (like tube ends) into separate faces
   - Similar to SolidWorks "Split periodic faces" setting

2. **Use Sweep 2 Rail with analytic options**:
   - Instead of the PIPE script
   - Use Sweep 2 Rail with circle profiles
   - This may produce more analytic-like surfaces
   - Test if the tube bender accepts the result

3. **Draw circle at start of curve for Sweep**:
   - Create a circle profile at the path start
   - Use Sweep command instead of PIPE script
   - This may produce different surface structure

4. **Export as SAT instead of STEP**:
   - SAT (ACIS) format may preserve analytic surfaces better
   - Try exporting as SAT from MoI
   - Import SAT into the tube bender software
   - If accepted, use SAT as the export format

5. **Process through SolidWorks**:
   - Export DXF path from MoI
   - Import DXF into SolidWorks
   - Create the tube solid in SolidWorks
   - Export STEP from SolidWorks
   - This produces analytic surfaces

6. **Check curve direction consistency**:
   - Ensure all path curves have consistent direction
   - This may affect how the sweep generates end surfaces
   - Use Dir command to check and fix curve directions

### Community Report

> "I use MOI to create parts files for the tube bender. 95% of files go through without problems, sometimes they don't import. If I import the dxf path into SolidWorks and export the same file, the STEP imports no problem. SolidWorks generates parts of the sweep using a trimmed torus or cylinder analytic surface, while MOI's sweep always makes a fitted surface. The moi.ini setting [STEP] ExportSplitClosedSurfaces=y will treat closed surfaces similar to SolidWorks."

## 2. STEP Import Trim Boundary Errors from Seam Crossing

### Symptom

Importing STEP files into MoI. Some geometries look very different from what is expected. The imported model has distorted or incorrect surfaces. The same STEP file imported into Cinema4D shows the correct geometry. The issue occurs with specific STEP files, not all.

### Root Cause

"STEP translation is a difficult process because different CAD programs can represent trim boundaries in pretty different ways. When MoI imports a STEP file, one of the tricky parts is it has to cut trim curves where they cross over the seam of a closed surface like a cylinder or torus. That can be a sensitive calculation." Some CAD systems allow edge curves to cross over the seam edge of a closed surface. MoI's geometry kernel doesn't allow this and needs to cut edges at the seam crossing. This cutting process can fail or produce incorrect results.

### Fix

1. **Use MoI v5 beta**:
   - Download from https://moi3d.com/beta.htm
   - The STEP import is improved in v5

2. **Use CAD Exchanger for conversion**:
   - CAD Exchanger handles seam crossing differently
   - The .3DM format preserves MoI's expected structure

3. **Convert STEP to IGES first**:
   - Import the STEP into another CAD tool (FreeCAD, Rhino)
   - Export as IGES
   - Import the IGES into MoI
   - IGES may handle trim boundaries differently

4. **Identify problematic surfaces**:
   - After import, identify which surfaces are distorted
   - Delete the distorted surfaces
   - Rebuild them manually in MoI
   - Use the correct geometry as reference

5. **Request file analysis from MoI developer**:
   - Send the problematic STEP file
   - The developer can analyze and improve the import
   - But NDA restrictions may prevent this

6. **Check STEP file version**:
   - Check if the file is AP203, AP214, or AP242
   - Different versions may import differently
   - Convert to a different STEP version if possible

### Community Report

> "We are using MoI for importing STEP files. From time to time we have issues with geometries that look very different to what we expect. STEP translation is difficult because different CAD programs can represent trim boundaries in different ways. MoI has to cut trim curves where they cross over the seam of a closed surface. There have been improvements in v5 for that. Another option: use CAD Exchanger to convert from STEP to .3DM and then import the .3DM into MoI."

## 3. Solid Import Naked Edges from Alibre Export Quality

### Symptom

Created a design in Alibre as a solid. When importing into MoI as SAT or IGES, the result has a lot of naked edges and isn't a solid. Can't do Boolean operations on the part. Unable to correct the naked edges — nothing seems to work. The STEP file is also messed up in SolidWorks eDrawings viewer, CAD Assistant, and OnShape.

### Root Cause

"Getting your model out of Alibre is creating fairly bad geometry. A lot of little slivers and bad surfaces." The issue is with Alibre's export quality, not MoI's import. Alibre is generating poor geometry with sliver surfaces, bad surface joins, and naked edges. The exported SAT, IGES, and STEP files all contain these defects. "The step file is a mess in Rhino8 as well" — confirming the export quality issue.

### Fix

1. **Check Alibre export options**:
   - Check Alibre's export tolerance settings
   - Tighten the tolerance for better geometry

2. **Export as SAT from Alibre**:
   - Use SAT format instead of STEP or IGES
   - SAT is Alibre's native kernel format
   - This should preserve geometry better

3. **Separate and re-export from Alibre**:
   - Join the surfaces in MoI or Rhino

4. **Fix naked edges in MoI**:
   - Use MoI's Join command to close naked edges
   - Reconstruct areas with micro edges

5. **Fix in Rhino first**:
   - Import the file into Rhino
   - Use Rhino's repair tools
   - Fix naked edges and bad surfaces
   - Export as 3DM
   - Import the 3DM into MoI

6. **Use a different CAD format**:
   - Try exporting as 3DM from Alibre (if supported)
   - Or export as Parasolid (XT) format
   - These may preserve geometry better than STEP/IGES
   - Import the alternative format into MoI

### Community Report

> "I created this design in Alibre. It's a solid, or should be. When I import it into MOI as SAT or IGES, I get a lot of naked edges and it isn't a solid. The STEP file is a mess in Rhino8 as well. Getting your model out of Alibre is creating fairly bad geometry — a lot of little slivers and bad surfaces. Since Alibre is ACIS based, the best export out should be the SAT format. Try separating everything in Alibre and exporting all separate surfaces."

## 4. FBX Import Not Available from Polygon-Only Format

### Symptom

Trying to import an FBX file into MoI3D. The FBX import option is missing or doesn't work. FBX files exported from other applications can't be loaded. The V5 beta doesn't have FBX import.

### Root Cause

"Since FBX files contain polygon mesh data and not CAD data, you can write out to an FBX file but not import it in to MoI." MoI3D is a NURBS-based CAD tool. FBX is a polygon mesh format. MoI can export to FBX (converting NURBS to polygons) but can't import FBX because it would need to convert polygons back to NURBS, which is not a standard operation. The exception is SubD (subdivision surface) conversion.

### Fix

1. **Use SubD import for FBX**:
   - If the FBX contains subdivision surface control cages
   - Use SubD > Create > From file

2. **Convert FBX to STEP or IGES**:
   - Use CAD Exchanger or similar tool
   - Convert FBX to STEP or IGES
   - Import the STEP or IGES into MoI
   - This converts polygons to NURBS

3. **Use OBJ import via SubD**:
   - Same as FBX — OBJ is polygon format
   - But SubD import can process OBJ with sub-d control cages
   - Use SubD > Create > From file for OBJ

4. **Use SVG import (V5)**:
   - V5 adds SVG import/export
   - For 2D vector graphics, use SVG
   - This is a vector format, not polygon

5. **Workflow alternative**:
   - Import FBX into Blender
   - Convert to NURBS in Blender (using add-ons)
   - Export as STEP or OBJ (SubD)
   - Import into MoI

6. **Understand MoI's format philosophy**:
   - MoI works with NURBS surfaces, not polygons
   - Import supports: STEP, IGES, SAT, 3DM
   - Export supports: STEP, IGES, SAT, 3DM, OBJ, FBX, STL, SVG
   - Import is for CAD formats, export includes polygon formats

### Community Report

> "The .fbx import is missing on this version. Since FBX files contain polygon mesh data and not CAD data, you can write out to an FBX file but not import it in to MoI. The exception is if you are doing a sub-d surface conversion. The sub-d importer is on the side pane under SubD > Create > 'From file'. That can process .obj or .fbx files that contain sub-d control cages."

## 5. STP Bevel Corner Errors from Trim Boundary on Closed Surface

### Symptom

Using MoI to convert STP files to FBX. Occasionally run into errors on models — bevel corner errors. The errors appear as distorted or incorrect geometry at corners of beveled edges. The original STP files come from SolidWorks or CATIA.

### Root Cause

"Usually that's a messed up trim boundary on a closed surface where it was tricky doing the 'split at seams' processing. Different CAD programs can represent trimming boundaries fairly differently and one of the big differences is that some systems allow an edge curve to cross over the 'seam edge' of a closed surface. Some systems, like the one that MoI is based on, do not allow an edge to cross a seam and so some edges may need to be cut at the seam crossing location. This seam-crossing cutting process can sometimes be a tricky operation."

### Fix

1. **Send the file to MoI developer**:
   - The developer actively works on improving STEP import
   - Send the problematic STP file

2. **Use MoI v5 beta**:
   - V5 has improved seam-crossing processing
   - Download from https://moi3d.com/beta.htm
   - Test if the bevel corner error is fixed
   - Report if it persists

3. **Check STEP file version**:
   - Check if AP203, AP214, or AP242
   - Convert to a different version if possible

4. **Convert via CAD Exchanger**:
   - Import STP into CAD Exchanger
   - Export as 3DM
   - Import 3DM into MoI
   - This may handle seams differently

5. **Fix corners manually**:
   - After import, identify the distorted corners
   - Delete the bad surfaces
   - Rebuild the corners using MoI's tools
   - Use Fillet or Chamfer to recreate bevels

6. **Process through Rhino**:
   - Import STP into Rhino
   - Check for bad surfaces
   - Fix in Rhino
   - Export as 3DM
   - Import 3DM into MoI

### Community Report

> "I use MoI to convert STPs to FBX and occasionally run into errors like this on models. Usually that's a messed up trim boundary on a closed surface where it was tricky doing the 'split at seams' processing. Some systems allow an edge curve to cross over the seam edge of a closed surface. MoI does not allow this and edges may need to be cut at the seam crossing location. This seam-crossing cutting process can sometimes be tricky. E-mail the .stp file at moi@moi3d.com — it's something I want to try and improve."

## 6. Additional MoI3D Issues

### V5 Beta Expiration

**Issue**: "V5 beta expires on Nov-28-2025."
**Fix**: "Beta builds are designed to expire. Once the beta test period is complete there will be a non-beta full release made and the full release versions do not expire." Wait for the full V5 release.

### SVG Import/Export (V5)

**Issue**: Need SVG import/export for vector graphics workflow.
**Fix**: V5 adds SVG import/export. Use SVG for 2D vector graphics. No need for intermediary formats like PDF. Preserves data and detail.

### File Upload to Forum

**Issue**: "500 - Internal server error" when attaching files to forum.
**Fix**: "The file is too large. Please try zipping the file. Go to Options > Attachments and remove large ones to free up space."

### EDU Discount

**Issue**: "Is there a hobbyist discount version?"
**Fix**: "There isn't any hobbyist discount version. There is an EDU discount version available for students or teachers. Contact moi@moi3d.com for ordering."

### SubD Conversion Workflow

**Issue**: Need to convert subdivision surfaces to NURBS.
**Fix**: Use SubD > Create > From file for OBJ/FBX with sub-d control cages. MoI converts the sub-d cage to NURBS surfaces. This is the only way to import polygon data.

## Best Practices

1. **Set ExportSplitClosedSurfaces=y in moi.ini for STEP export** — matches SolidWorks behavior
2. **Use V5 beta for improved STEP import** — better seam-crossing processing
3. **Use CAD Exchanger to convert STEP to 3DM** — alternative import path
4. **Export as SAT from ACIS-based CAD (Alibre)** — preserves geometry better
5. **Check export tolerance settings in source CAD** — prevents bad geometry
6. **Use SubD > Create > From file for FBX/OBJ import** — only way to import polygons
7. **Send problematic files to moi@moi3d.com** — developer actively improves import
8. **Fix naked edges in Rhino before importing to MoI** — Rhino has better repair tools
9. **Use SVG for 2D vector import/export (V5)** — preserves data without intermediary formats
10. **Check curve direction consistency before sweep** — affects end surface structure
