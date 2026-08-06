---
title: "Autodesk Forma Spacemaker Import and Revit Integration Errors"
excerpt: "Autodesk Forma Spacemaker Import and Revit Integration Errors: symptoms, root causes, and step-by-step fixes, verified against Autodesk Community Forums."
category: "troubleshooting"
softwareSlug: "spacemaker"
keyword: "Autodesk Forma Spacemaker georeferenced DXF wrong position AutoCAD GEO command manual coordinate transform Revit connectivity failure side-by-side add-in installation 0.7.7 update weird terrain results NextGen missing building pads Classic workflow project north true north misalignment add-in unlink before rotation geolocation missing Revit add-in v0.9.17 bug rollback v0.9.15"
slug: "autodesk-forma-spacemaker-import-and-revit-integration-errors"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-03"
sources:
  - "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Georeferenced-DXF-is-imported-in-the-wrong-position-in-Spacemaker.html"
  - "https://forums.autodesk.com/t5/forma-for-design-forum/autodesk-forma-revit-connectivity/td-p/11856522"
  - "https://forums.autodesk.com/t5/forma-for-design-forum/weird-terrain-results/td-p/11856225"
---

# Autodesk Forma Spacemaker Import and Revit Integration Errors: Georeferenced DXF Imported in Wrong Position from AutoCAD GEO Command Limitation Requiring Manual Coordinate Transform, Revit Connectivity Failure from Side-by-Side Add-in Installation Requiring 0.7.7 Update, Weird Terrain Results in NextGen from Missing Building Pads Requiring Classic Workflow, Project North vs True North Misalignment from Add-in Not Checking Project North Requiring Unlink Before Rotation, and Geolocation Missing from Revit Add-in v0.9.17 Bug Requiring Rollback to v0.9.15

Spacemaker's DXF import, Revit add-in connectivity, terrain generation, project north alignment, and geolocation handling produce errors from AutoCAD GEO limitations, side-by-side add-in conflicts, missing terrain modification, project north issues, and add-in version bugs. This guide covers the 5 most common Autodesk Forma/Spacemaker problems with diagnostic steps and community-verified fixes from Autodesk Community Forums.

## 1. Georeferenced DXF Imported in Wrong Position from AutoCAD GEO Command Limitation

### Symptom

When importing a DXF file in Spacemaker, the position is incorrect. The DXF file has been assigned a geographic location using the GEO command in AutoCAD or AutoCAD Architecture. The imported DXF appears at the wrong location on the Spacemaker site. There is no option to georeference the DXF file so that the referenced coordinates become actual world coordinates.

### Root Cause

"The AutoCAD GEO (GEOLOCATION) command doesn't store information related to the coordinate system for the entire drawing." The GEO command in AutoCAD inserts a geographic marker but doesn't embed the coordinate system transformation in the DXF file. When Spacemaker imports the DXF, it reads the drawing coordinates (XY) but has no way to know which coordinate system those coordinates belong to. Without the coordinate system information, Spacemaker can't transform the drawing coordinates to world coordinates, resulting in incorrect positioning.

### Fix

1. **Manually transform coordinates**:
   - Use epsg.io or similar coordinate converter
   - Input/source: EPSG:4326 WGS 84
   - Output/target: your local coordinate system

2. **Use AutoCAD Map 3D or Civil 3D**:
   - AutoCAD Map 3D properly stores coordinate system info
   - Export from Map 3D with georeferencing
   - Import the georeferenced file into Spacemaker

3. **Set the coordinate system in Spacemaker**:
   - When creating a new Spacemaker project
   - Select the correct coordinate system
   - Import the DXF with matching coordinates
   - The DXF coordinates should match the project's CRS

4. **Use the GEO command with coordinate system**:
   - In AutoCAD, use GEO command
   - Select "Set Location" > "From GIS Data"
   - Choose the coordinate system
   - Save the drawing with the coordinate system embedded

5. **Check the DXF file for coordinate data**:
   - Open the DXF in a text editor
   - Look for coordinate system information
   - If missing, the GEO command didn't embed it
   - Use Map 3D to add the coordinate system

6. **Use OBJ import instead**:
   - Export from AutoCAD as OBJ
   - Import OBJ into Spacemaker
   - Place manually on the site
   - Adjust position and height

7. **Import site from Spacemaker first**:
   - Export the site polygon from Spacemaker
   - Note the coordinate system used
   - Import into AutoCAD
   - Align your drawing to the site polygon
   - Export and import back to Spacemaker

### Community Report

> "When importing a DXF file in Spacemaker, the position is incorrect. The DXF file has been assigned a geographic location using the GEO command in AutoCAD. The AutoCAD GEO command doesn't store information related to the coordinate system for the entire drawing. Transform the latitude and longitude of the point to XY coordinates using an online tool, for example, epsg.io."

## 2. Revit Connectivity Failure from Side-by-Side Add-in Installation

### Symptom

Using Autodesk Forma and trying to import the model to Revit 2023. Following the instructions for Revit interoperability but unsuccessful. Most of the time, an error message appears in Revit saying it hasn't worked and the team has been notified. On rare occasions when it "works," no geometry is imported into Revit. All categories and worksets are turned on, but no geometry can be found.

### Root Cause

"Yes, there is an issue we have found in the addin and the team is working on a solution." The Revit add-in has a bug when both the Spacemaker "Classic" and "Next-Gen" add-ins are installed side-by-side. The two add-ins conflict with each other, causing the import to fail. The Classic add-in installs in a "Spacemaker" tab, while the Next-Gen add-in installs in the "Massing & Site" tab. The conflict prevents geometry from being imported even when the process appears to succeed.

### Fix

1. **Update to add-in version 0.7.7**:
   - Download from `https://app.spacemaker.ai/api/revit/installer/latest`
   - Install the updated add-in
   - Restart Revit

2. **Uninstall the Classic add-in**:
   - If you only use Next-Gen
   - Uninstall the Classic Spacemaker add-in
   - Keep only the Next-Gen add-in
   - This avoids the side-by-side conflict

3. **Check the correct tab**:
   - Look in the correct tab for the import function
   - The Classic tab may not be visible in newer Revit versions

4. **Turn on all categories**:
   - In the Load Forma Proposal dialog
   - Check all element categories
   - Check all worksets

5. **Check for error messages**:
   - Note the exact error message
   - Report to Autodesk Forma team
   - Check the Forma forum for known issues

6. **Use a new empty Revit project**:
   - Create a new Revit project
   - Load the Forma proposal into it
   - Then link the new project into your existing project

7. **Verify Revit version compatibility**:
   - Ensure your Revit version is supported
   - Update Revit if necessary
   - Use the matching add-in version

### Community Report

> "I have been using Autodesk Forma and trying to import the model to Revit. I am using Revit 2023 and followed the instructions but have so far been unsuccessful. Most of the time I get an error message in revit saying it has not worked. On the rare occasion that it works, no geometry is imported. Yes, there is an issue we have found in the addin. Do you have both the Spacemaker Classic and Next-Gen addin installed? We have a 0.7.7 update that should unblock you."

## 3. Weird Terrain Results in NextGen from Missing Building Pads

### Symptom

Developing a model in Toronto, Canada. In Spacemaker Classic, the terrain looks OK — similar to terrain generated in InfraWorks with ArcGIS. But in Spacemaker NextGen, there are massive hills all over the place. The terrain is unusable for design work. There's no way to make everything level in NextGen.

### Root Cause

"Building pads are only available in Spacemaker Classic. Spacemaker does not have yet support to terrain modification in the Next-Gen version." The NextGen version of Spacemaker doesn't support terrain modification. Without building pads, the raw terrain data from GIS sources is displayed as-is, including natural elevation changes that appear as "massive hills." In Classic, building pads could flatten areas for building placement, creating usable terrain. NextGen's lack of this feature makes the terrain appear incorrect for urban design purposes.

### Fix

1. **Use Spacemaker Classic for terrain**:
   - Use Classic for terrain modification
   - Add building pads to flatten areas
   - Then switch to NextGen for analysis

2. **Use building pads in Classic**:
   - In Classic, add building pads to flatten terrain
   - Set the pad elevation to the desired level
   - This creates level areas for buildings

3. **Import terrain from external source**:
   - Use InfraWorks to generate terrain
   - Export as OBJ or DXF
   - Import into Spacemaker
   - This provides controlled terrain data

4. **Use flat terrain option**:
   - In some versions, you can disable terrain
   - Use a flat site for conceptual design
   - Add terrain later in Revit

5. **Wait for NextGen terrain support**:
   - Terrain modification may be added in future updates
   - Check the release notes for new features
   - Use Classic in the meantime

6. **Adjust terrain in Revit**:
   - Import the Forma proposal to Revit
   - Modify the toposolid in Revit
   - Use Revit's grading tools
   - This gives you full terrain control

7. **Use site limits**:
   - In NextGen, use site limits to define the project area
   - This doesn't flatten terrain but focuses the analysis
   - Combine with building placement at correct elevations
   - Ignore the terrain hills for conceptual work

### Community Report

> "I'm trying to develop a model in Toronto, Canada. In SM Classic the terrain looks OK, but in SM NextGen there are massive hills all over the place. Is there a way to make everything level? Just found out about building pads, problem solved. Note that building pads are only available in Spacemaker Classic. Spacemaker does not have yet support to terrain modification in the Next-Gen version."

## 4. Project North vs True North Misalignment from Add-in Not Checking Project North

### Symptom

Importing a Forma proposal into Revit. The toposolid is not aligned with true north — it's based on project north instead. After setting up project north based on a CAD survey, the Forma proposal doesn't align with the existing topography. If project north is changed after loading Forma data, the satellite image on the terrain is no longer properly aligned.

### Root Cause

"The add-in doesn't really do anything with project north at this point." The Forma Revit add-in doesn't check if project north is different from true north when loading geometry. If project north is already set differently from true north, the Forma geometry is aligned with project north instead of true north. If project north is changed after loading, the Forma data is transformed, causing the satellite image to misalign. The add-in also converts everything to meshes that are rotated compared to true north when updating.

### Fix

1. **Load Forma data before setting project north**:
   - Load the Forma proposal first
   - Then set project north
   - This avoids the misalignment

2. **Unlink the proposal before rotating**:
   - Load Forma data
   - Unlink the proposal from Forma
   - Then rotate project north
   - This prevents update issues

3. **Fix satellite image rotation**:
   - Edit the toposolid material
   - Adjust the rotation of the satellite image
   - Align it with the terrain

4. **Use a new empty Revit project**:
   - Create a new Revit project
   - Load Forma data into it
   - Link the new project into your existing project

5. **Don't update after changing project north**:
   - After changing project north
   - Don't use Update to send data back to Forma
   - This would corrupt the geometry

6. **The Forma import should always align with True North**:
   - This is a known limitation
   - Vote for the feature request
   - Use the workaround above

7. **Use true north for GIS data**:
   - Always align GIS data with true north
   - Use project north only for sheet layout
   - Don't mix the two

### Community Report

> "I've recently started up a project using a CAD survey and set up project north based on that. Now when I try to import the forma proposal, the toposolid is not aligned with true north. The add-in doesn't really do anything with project north at this point. If you Load the Forma data and then change project north, the satellite image on the terrain is no longer properly aligned. Load the Forma data, Unlink the proposal, and then rotate project north."

## 5. Geolocation Missing from Revit Add-in v0.9.17 Bug

### Symptom

After a recent add-in update, Forma imports to Revit no longer include any CRS (Coordinate Reference System) information. The origin is just at 0,0,0, removing the ability to reconcile proposals with other models or data sets. This makes Forma not viable unless used in isolation. The issue appeared after updating to add-in v0.9.17.

### Root Cause

"We released a new version of that recently, v. 0.9.17, however it turned out this contained an error." The v0.9.17 update of the Forma Revit add-in introduced a bug that removed geolocation information from imported proposals. The CRS data that was previously embedded in the import is no longer included, placing everything at 0,0,0. This is a regression bug in the add-in, not an intentional change.

### Fix

1. **Roll back to add-in v0.9.15**:
   - Open Forma
   - Go to the Extensions panel
   - Download v0.9.15 from the in-app appstore
   - Install the older version

2. **Confirm the fix**:
   - After installing v0.9.15
   - Re-import the Forma proposal
   - Verify geolocation data is present

3. **Don't update to v0.9.17**:
   - Until a fixed version is released
   - Don't update to v0.9.17
   - Stay on v0.9.15
   - Watch for v0.9.18 or later

4. **Check for the fixed version**:
   - Autodesk is working on a fix
   - Check the Forma forum for updates
   - Look for v0.9.18 or later
   - Install when the fix is available

5. **Report the issue**:
   - Confirm the issue on the forum
   - Provide your workflow details
   - Autodesk prioritizes based on user impact

6. **Use the Classic add-in as workaround**:
   - If the Next-Gen add-in doesn't work
   - Try the Classic Spacemaker add-in
   - It may not have the v0.9.17 bug
   - But has fewer features

7. **Manually set geolocation in Revit**:
   - If geolocation data is missing
   - Manually set the project base point
   - Use the survey point to align
   - This is a manual workaround

### Community Report

> "In the last week or so, the imports do not include any CRS information and the origin is just at 0,0,0 which has removed our ability to reconcile the proposals with anything else. This is a bit of a deal breaker for us. We released a new version recently, v. 0.9.17, however it turned out this contained an error. We have rolled it back, and you can download the former version, 0.9.15. That solved it — I got the plugin rolled back to 0.9.15 and managed to re-import with geolocation information."

## 6. Additional Spacemaker/Forma Issues

### Rhino to Spacemaker OBJ Import

**Issue**: "I exported in OBJ format, but I am not able to import it in Spacemaker."
**Fix**: Select "Polygon mesh objects" not "NURBS objects" in OBJ export. Georeference volumes in Rhino. Clean up overlapping geometries. Check units on import.

### Z Elevation Not Proper on Revit Import

**Issue**: "The Spacemaker exported site came into the coordinately located file located accurately in the xy. However, it didn't come into Revit at the proper elevation."
**Fix**: "We are still ironing out some of the details, and one of them is Z location." The add-in uses heuristics for Z. Adjust manually after import. Use building bottom or terrain bottom as reference.

### Project North Auto-Rotate Feature Removed

**Issue**: "Optionally, the site can also be automatically rotated (with Revit Project North) to orient the longest wall to the X or Y axis. I don't see this option available."
**Fix**: "We apologize for the inconvenience but that feature has been removed. We did not see enough use of the feature, and had several issues with it." Rotate manually after import.

### Multiple Loads Not Supported

**Issue**: "Although you can update Forma projects from Revit many times, multiple Loads from Forma to Revit are not supported."
**Fix**: Load once. Use Update for subsequent changes. Create separate Revit projects for different proposals. Link projects together.

### Design Options Conflict

**Issue**: "If there are Design Options in the Revit File you're loading into, you may need to 'accept primary' in order for Update functionality to work."
**Fix**: Accept primary design option before using Update. Hide other design options. Work in the primary option. Contact support if issues persist.

### Smooth Shading Toposolid Issue in Revit 2025

**Issue**: "Revit 2025 introduces a new smooth shading option for Toposolids. There is a difference in the handling of the placement of the image on the Toposolid face between the two modes."
**Fix**: Use smooth shading mode. The latest add-in handles this. Check satellite image alignment. Edit material rotation if needed.

### Revit Edits Not Updated to Forma

**Issue**: "Revit edits to Terrain, Roads, and Site Limits are not updated to Forma."
**Fix**: Don't edit these in Revit if you need to update Forma. Edit in Forma directly. Use Revit for buildings only. Export terrain changes separately.

## Best Practices

1. **Use AutoCAD Map 3D for georeferenced DXF** — GEO command alone doesn't embed CRS
2. **Update to add-in v0.9.15 or later (not v0.9.17)** — v0.9.17 has geolocation bug
3. **Use Spacemaker Classic for terrain modification** — NextGen lacks building pads
4. **Load Forma data before setting project north** — prevents misalignment
5. **Unlink Forma proposal before rotating project north** — prevents satellite image issues
6. **Use a new empty Revit project for Forma imports** — then link into existing project
7. **Don't install both Classic and Next-Gen add-ins** — causes side-by-side conflicts
8. **Select Polygon mesh not NURBS for OBJ export from Rhino** — Spacemaker requires meshes
9. **Don't use multiple Loads from Forma to Revit** — only Update is supported
10. **Accept primary design option before Update** — prevents update functionality issues
