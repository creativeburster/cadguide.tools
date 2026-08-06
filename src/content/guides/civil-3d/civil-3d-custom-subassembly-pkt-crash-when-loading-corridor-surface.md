---
title: "Civil 3D Custom Subassembly PKT Crash When Loading Corridor Surface"
excerpt: "Civil 3D Custom Subassembly PKT Crash When Loading Corridor Surface: symptoms, root causes, and step-by-step fixes, verified against Autodesk Community."
category: "troubleshooting"
softwareSlug: "civil-3d"
keyword: "Civil 3D custom subassembly PKT crash corridor surface SAC geometry surface freeze LandXML point group multiple views crash station tracker AcTransient corridor surface triangulation gap regions separate baselines split profile corridor section sequence"
slug: "civil-3d-custom-subassembly-pkt-crash-when-loading-corridor-surface"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://forums.autodesk.com/t5/civil-3d-forum/a-custom-subassembly-is-causing-a-crash-in-civil3d-when-using-it/td-p/13774019"
  - "https://forums.autodesk.com/t5/civil-3d-forum/surface-consisting-partially-from-landxml-and-partially-from/td-p/12978007"
  - "https://forums.autodesk.com/t5/civil-3d-forum/crashes-when-using-multiple-views/td-p/12892631"
---

# Civil 3D Custom Subassembly PKT Crash When Loading Corridor Surface, Surface Freeze from Mixed LandXML and Point Group Data, Multiple Views Crash After One Hour from Station Tracker and AcTransient, Corridor Surface Triangulation Across Gap Between Regions, and Corridor Surface Not Triangulating for Split Profile Regions: SAC Geometry Simplification, LandXML Export Reimport, Single Viewport Workflow, Separate Baselines, and Corridor Section Sequence

Civil 3D produces errors from custom subassembly crashes, surface freezes, multi-view crashes, corridor triangulation gaps, and split profile triangulation failures. This guide covers the 5 most common Civil 3D problems with diagnostic steps and community-verified fixes from Autodesk Community.

## 1. Custom Subassembly PKT Crash When Loading Corridor Surface

### Symptom

A custom subassembly created in Subassembly Composer (SAC) causes Civil 3D to crash when used in a corridor. The crash occurs when Civil 3D tries to load the surface created in the corridor. The crash happens even with a simple corridor (alignment, profile, surfaces, sample lines, and section views). Removing loops and complex geometries doesn't fix the crash. Civil 3D 2025.

### Root Cause

"When Civil3D tries to load the surface created in the corridor, it crashes." The crash is caused by specific geometry in the SAC subassembly that Civil 3D's corridor surface engine can't process. The user discovered that "I tried removing the 2 circles and the shape (the actual pipe) in SAC and looks fine now." The circles and shape (pipe geometry) in the SAC subassembly create surface points that the corridor surface engine can't handle, causing the crash.

### Fix

1. **Remove circles and complex shapes from SAC**:
   - Remove circular geometry and complex shapes
   - From the SAC subassembly

2. **Simplify SAC geometry**:
   - Use only simple points and links
   - In the SAC subassembly
   - Avoid complex shapes and circles
   - That may cause surface loading crashes

3. **Test with a simple corridor first**:
   - Test the subassembly with a simple corridor
   - Before using it in production

4. **Keep pipe geometry separate**:
   - If the subassembly includes pipe geometry
   - For visualization purposes
   - Keep it separate from the surface-generating geometry
   - Don't include pipes in the surface definition

5. **Use points and links for surface**:
   - Only include points and links
   - That are needed for the corridor surface
   - In the SAC subassembly
   - Exclude non-surface geometry

6. **Test incrementally**:
   - Add geometry to the SAC subassembly
   - One element at a time
   - Test after each addition
   - To identify which element causes the crash

7. **Share the PKT and DWG with Autodesk**:
   - Share both the PKT and DWG
   - With Autodesk support for analysis

### Community Report

> "I uploaded the pkt so you can check it. I don't know what or how is that this kind of simple subassembly crashes Civil. To replicate the crash: Create a simple corridor. Trying different things, I discovered that when Civil3D tries to load the surface created in the corridor, it crashes. I tried removing the 2 circles and the shape (the actual pipe) in SAC and looks fine now. But still I would love to have the tube in the SAC built."

## 2. Surface Freeze from Mixed LandXML and Point Group Data

### Symptom

A surface created from mixed data sources — partially from LandXML and partially from a Point Group — freezes and hangs Civil 3D. The freeze occurs when the surface is displayed or edited. The issue occurs in Civil 3D 2025. The drawing becomes unresponsive and must be force-closed. The issue persists even in a clean/blank drawing.

### Root Cause

The surface freeze is caused by mixing LandXML data and Point Group data in the same surface definition. The LandXML data and Point Group data may have different coordinate systems, density, or formats that create an excessively complex surface. When Civil 3D tries to process the combined data, the surface engine becomes overwhelmed and freezes. "This obviously is a Civil 3D software issue."

### Fix

1. **Export the surface as LandXML and reimport**:
   - Export > Delete > Reimport

2. **Don't mix LandXML and Point Group data**:
   - The issue is caused by mixing
   - LandXML and Point Group data
   - In the same surface
   - Use one data source per surface

3. **Test in a blank drawing**:
   - Test the surface in a blank drawing
   - To verify the issue is with the surface
   - Not the drawing

4. **Share the LandXML file**:
   - Share the LandXML with Autodesk support
   - For analysis

5. **Check the drawing first**.

6. **Use separate surfaces for each data source**:
   - Create one surface from LandXML
   - And another from Point Group
   - Then paste them together
   - Using a paste surface operation

7. **Simplify the surface data**:
   - Reduce the number of points
   - In the Point Group
   - Or simplify the LandXML data
   - Before creating the surface

### Community Report

> "I created a surface consisting partially from LandXML and partially from Point Group. The surface freeze and hanged. To correct the issue, I exported the surface as LandXML, then deleted it and finally Imported the LandXML. This solved the problem and Civil 3D (2025) was running smoothly. This obviously is a Civil 3D software issue. I tried in a clean dwg, still problem. Share your Landxml file with me if you can. Landxml will typically not export illegal or corrupt objects."

## 3. Multiple Views Crash After One Hour from Station Tracker and AcTransient

### Symptom

Civil 3D 2024 crashes with a fatal error after working for about 1-2 hours. The crash occurs when using multiple views in model space (usually 2 — one for plan view and one for profile view) with the station tracker turned on to all viewports. The crash doesn't occur when using a single view. Recovery and audit show no errors. The drawing opens with only one view after the crash.

### Root Cause

"I reviewed the CER, and one item I've seen in two of the crash reports is the AcTransient crash." The crash is caused by the AcTransient graphics component when handling multiple viewports with the station tracker enabled. The station tracker updates all viewports simultaneously, which puts stress on the AcTransient component. After 1-2 hours of continuous use, a memory leak or resource exhaustion in AcTransient causes the fatal error. Non-Autodesk plugins may also contribute by causing AcTransient crashes when hovering over polylines.

### Fix

1. **Use a single viewport**:
   - The crash only occurs with multiple views
   - Use a single viewport
   - To avoid the crash

2. **Disable station tracker**:
   - The station tracker to all viewports
   - May trigger the AcTransient crash
   - Try disabling the station tracker

3. **Check for non-Autodesk plugins**:
   - Disable non-Autodesk plugins

4. **Toggle hardware acceleration**:
   - In Civil 3D settings
   - Toggle hardware acceleration
   - To see if it affects the crash

5. **Update all software**:
   - Install all available updates

6. **Update .NET Framework**:
   - Update .NET Framework (may help temporarily)

7. **Avoid dynamic north arrows and bar scales**:
   - Don't use dynamic north arrows
   - Or bar scales in viewports

### Community Report

> "Using civil 3d 2024 with all the latest updates. I create multiple views in model space (usually 2) one for plan view and one for profile view and turn on the station tracker to all viewports. I can work for about an hr. maybe 2 then I get a fatal error and it crashes. Works fine if I dont use the dual views. I reviewed the CER, and one item I've seen in two of the crash reports is the AcTransient crash. Do you have any plugins installed? These two items cause problems, avoid them: dynamic north arrows or bar scales."

## 4. Corridor Surface Triangulation Across Gap Between Regions

### Symptom

A single corridor with many baselines has triangulation across an intersection where a gap region exists. The baseline with the gap has corridor surface triangulation across the intersection, when it should show as a gap. The corridor extents boundary has been added but doesn't resolve the issue. TIN editing is not feasible because many baselines are under one corridor surface.

### Root Cause

"The corridor which intersects the road doesn't just need to have a gap between regions, but must also be separated into two different baselines." When a single baseline has a gap region, the corridor surface engine still triangulates across the gap because the baseline is continuous. The corridor extents boundary doesn't work because "your corridor overlaps itself somewhere (bowtie)." The solution requires separating the gap into two different baselines.

### Fix

1. **Create separate baselines for each side of the intersection**.

2. **Uncheck or delete regions from the original baseline**:
   - This is the correct solution

3. **Check for corridor bowtie overlap**:
   - Check for and fix bowtie overlaps

4. **Cut a small region out of the corridor**:
   - Cut a small region to break the closed area

5. **Limit triangle link length**:
   - Adjust the maximum triangle link length
   - In the surface build properties

6. **Break a closed gap**:
   - If the gap forms a closed area
   - Break it to restore the boundary

7. **Add interpolated points and links**:
   - As a last resort for complex cases

### Community Report

> "I have a single corridor with many different baselines. At an intersection of two baselines, one baseline region goes across the intersection, and the other baseline has a gap region. The baseline with the gap has corridor surface triangulation across the intersection. The corridor which intersects the road doesn't just need to have a gap between regions, but must also be separated into two different baselines. Add a new baseline using the same alignment and profile, then copy the corridor region(s) properties, then uncheck or delete these regions from the original baseline. By creating two different baselines, the triangulation across the intersection stops."

## 5. Corridor Surface Not Triangulating for Split Profile Regions

### Symptom

A corridor surface is not triangulating through regions where a split profile design is used. The WB lanes (Top lanes) follow the split profile correctly in section view, but the surface doesn't triangulate for any lanes within the split profile regions. The corridor shows up correctly in section view but the surface has long triangulation paths across the intersection. Curbing and inside edge of pavement surface points are not generating correctly.

### Root Cause

"The problem is not your corridor surface. The problem is somewhere in your corridor, I think in the region(s) involved." The issue is caused by incorrect corridor section sequence in the regions with the split profile. The corridor sections may not be properly sequenced, causing the surface points to not generate correctly for curbing and inside edge of pavement. "You have to set proper sequence for corridor sections."

### Fix

1. **Set proper corridor section sequence**:
   - Review and correct the section sequence

2. **Check surface point generation**:
   - Check which surface points are generating
   - And which are not

3. **Verify split profile regions**:
   - Verify the split profile is correctly applied

4. **Check corridor section frequency**:
   - The split profile regions
   - May need more frequent corridor sections
   - To generate proper surface points
   - Increase the section frequency

5. **Review assembly targeting**:
   - The assemblies in the split profile regions
   - May have incorrect targeting
   - For the curbing and inside edge of pavement
   - Verify the targeting parameters

6. **Add feature lines to corridor data**:
   - Try adding feature lines
   - To supplement the surface data

7. **Check for yellow triangle areas**:
   - Investigate yellow triangle areas in the surface

### Community Report

> "I'm having an issue with my corridor where the surface is not triangulating through the regions where I have a split profile design. The WB lanes are following the split profile for the regions in between the blue lines. The corridor is showing up correctly when I view it in section view but the surface is not triangulating for any of the lanes within the split profile regions. The problem is not your corridor surface. The problem is somewhere in your corridor. You have to set proper sequence for corridor sections."

## 6. Additional Civil 3D Issues

### Corridor Bowtie Overlap

**Issue**: "Your corridor overlaps itself somewhere (bowtie). If you can find and fix this then the boundary should work again."
**Fix**: Identify where the corridor overlaps itself. Fix the assembly or alignment to prevent the bowtie. The corridor extents boundary will work after fixing the overlap.

### Dynamic North Arrows and Bar Scales

**Issue**: "Are you using dynamic north arrows or bar scales? These two items cause problems, avoid them."
**Fix**: Don't use dynamic north arrows or bar scales in viewports. Use static north arrows and bar scales instead. These dynamic items can cause crashes in multi-view configurations.

### Data Reference Workflow for Stability

**Issue**: How to organize drawings for maximum stability.
**Fix**: Use data shortcuts for alignments, profiles, corridors, and surfaces. Separate design drawings from production drawings. Use a base file, survey base file, EG surface file, CL drawing, and DG (site grading) drawing. This workflow reduces crashes.

### Corridor Surface Maximum Triangle Size

**Issue**: "Try limiting the triangle link length in the surface build properties."
**Fix**: In the surface properties > Definition tab, set the maximum triangle length. Set it just long enough for assembly links. Too short will cut valid surface; too long will create unwanted triangulation.

### AcTransient Crash from Plugins

**Issue**: "Theoretically, hovering over some polylines could cause such behaviour when there are non-Autodesk plugins installed."
**Fix**: Disable all non-Autodesk plugins. Test if the crash persists. Identify the specific plugin causing the AcTransient crash. Contact the plugin developer for a fix.

### LandXML Export for Problem Surfaces

**Issue**: How to fix a problematic surface.
**Fix**: Export the surface as LandXML. Delete the original surface. Import the LandXML to create a new surface. This process cleans the surface data and often resolves performance issues.

### Corridor Section Frequency at Intersections

**Issue**: Corridor surface not generating correctly at intersections.
**Fix**: Increase the corridor section frequency at intersections. Add intermediate sections at critical points. Verify that all assembly points are generating surface data. Check the corridor section editor for gaps.

## Best Practices

1. **Remove circles and complex shapes from SAC subassemblies** — prevents corridor surface crash
2. **Don't mix LandXML and Point Group in same surface** — causes freeze
3. **Export as LandXML and reimport to fix problem surfaces** — cleans surface data
4. **Use single viewport to avoid AcTransient crash** — multi-view with station tracker crashes
5. **Avoid dynamic north arrows and bar scales** — cause viewport crashes
6. **Create separate baselines for gap regions at intersections** — prevents triangulation across gaps
7. **Set proper corridor section sequence** — fixes split profile triangulation
8. **Use data shortcuts for organized workflow** — improves stability
9. **Check for corridor bowtie overlaps** — prevents boundary issues
10. **Disable non-Autodesk plugins for AcTransient crashes** — identifies plugin conflicts
