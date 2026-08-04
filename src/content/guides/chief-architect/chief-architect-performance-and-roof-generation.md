---
title: "Chief Architect Performance and Roof Generation"
excerpt: "Chief Architect Performance and Roof Generation: symptoms, root causes, and step-by-step fixes, verified against Chief Architect support and ChiefTalk forums."
category: "performance"
softwareSlug: "chief-architect"
keyword: "Chief Architect network drive slowness corruption multi-monitor 3D camera redraw Auto Roof Return errant plane Library Material crash X14 automatic truss overlap elevation slowness"
slug: "chief-architect-performance-and-roof-generation"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://www.chiefarchitect.com/support/article/KB-00521/troubleshooting-slowness-in-chief-architect-projects.html"
  - "https://chieftalk.chiefarchitect.com/topic/46404-x14-crashes-every-time-i-select-material-from-library/"
  - "https://cloud.chiefarchitect.com/1/pdf/documentation/chief-architect-x17-update-notes.pdf"
---

# Chief Architect Performance and Roof Generation: Network Drive File Corruption and Slowness, Multi-Monitor 3D Camera Redraw Overhead, Auto Roof Return Errant Plane Generation, Library Material Selection Crash in X14, and Automatic Truss Overlap Causing Elevation Slowness

Chief Architect is optimized for residential home design but encounters performance degradation and roof generation errors on complex plans. Working from network drives causes file corruption, multiple monitors tax the GPU, Auto Roof Returns generate errant planes, and library operations crash. This guide covers the 5 most common performance and roof generation problems with diagnostic steps and verified fixes from Chief Architect support and ChiefTalk forums.

## 1. Network Drive Slowness and File Corruption

### Symptom

Chief Architect is slow when working on files stored on network servers, external hard drives, or USB flash drives. Operations like zooming, panning, and saving take excessive time. Files may become corrupted.

### Root Cause

Chief Architect is designed to work with files on the **local hard drive only**. Network latency affects every file read/write operation. The software's file I/O pattern (frequent small reads/writes) is incompatible with network drive latency. Working in this unsupported fashion is hazardous — it can lead to file corruption and data loss.

### Fix

1. **Always work on local hard drive**:
   - Copy the file from network/external/USB to local hard drive before opening
   - Make changes locally
   - Save the file locally
   - Exit Chief Architect
   - Copy the file back to the network/external/USB location

2. **Never open files directly from network locations** — this is the #1 cause of slowness and corruption

3. **Use version control** — maintain backup copies on the network, but work locally

## 2. Multi-Monitor 3D Camera Redraw Overhead

### Symptom

3D camera views are slow, particularly when using multiple monitors. Library and dialog previews are also slow. The GPU is taxed by 3+ monitors plus the 3D rendering.

### Fix

1. **Test with single monitor**:
   - Shut down the system
   - Disconnect extra monitors
   - Restart and test Chief Architect on a single screen
   - If speed improves, the GPU cannot handle the multi-monitor load

2. **Upgrade GPU** — ensure the video card fully supports multiple monitors with 3D rendering
3. **Reduce open 3D camera views** — every open 3D view redraws the entire model on each plan change:
   - Check Window menu for open view windows
   - Close unnecessary 3D views
   - Work with one 3D view at a time

4. **Disable Generated Sky** — if using Generated Sky with sun following camera, it regenerates on every camera movement:
   - Turn off "Sun follows camera" setting
   - Or disable Generated Sky entirely

5. **Manage displayed layers in 3D** — turn off layers not needed for the current task:
   - Turn off fixtures, furnishings, landscaping layers when working on roofs
   - Use layer sets to quickly switch between discipline-specific views

6. **Reduce 3D surface count** — avoid importing high-poly 3D objects from outside sources

## 3. Auto Roof Return: Errant Roof Plane Generation

### Symptom

Auto Roof Returns generate errant roof planes — unexpected roof planes appear that don't match the design intent.

### Fix

1. **Update to latest version** — this is a documented bug fixed in Chief Architect X17:
   - "Fixed a specific case in which Auto Roof Returns caused errant roof planes to be generated"

2. **Delete errant roof planes manually** — select and delete the incorrect planes
3. **Check roof return settings** — verify the roof return parameters are set correctly for each wall
4. **Use manual roof returns** — if Auto Roof Returns continue to misbehave, create returns manually

### Additional Roof Issues Fixed in X17

- Boxed eave soffit not generating correctly
- Soffit on boxed eave generating at incorrect height
- Snap indicators not appearing along gable roof eaves and fascia in cross section
- Roof subfascia boards not generating
- Roof trim items not displaying in Floor Overviews after switching floors
- Roof plane label Camera View Display setting error in 3D view

## 4. Library Material Selection Crash in X14

### Symptom

Chief Architect X14 crashes every time the user selects "Material from Library" — the application closes without warning.

### Fix

1. **Update to X15 or later** — this crash is fixed in subsequent versions
2. **Clear library cache**:
   - Close Chief Architect
   - Navigate to library cache folder
   - Delete cached library data
   - Restart Chief Architect

3. **Check library catalog downloads** — corrupted catalog downloads can cause crashes:
   - Re-download library catalogs
   - Verify catalog integrity

4. **Use the Material Eyedropper** instead of Library selection — pick materials from existing objects as a workaround

5. **Reset library browser** — if the library browser is corrupted:
   - Close Chief Architect
   - Rename the library configuration file
   - Restart — library will rebuild from default

### Additional Library Issues Fixed in X17

- Online library items listed more than once after declining to download
- Select Library Object dialog not loading with previously selected CAD Block
- Library Browser search results not including some items in Filter Results

## 5. Automatic Truss Overlap Causing Elevation Slowness

### Symptom

Generating elevations and CAD details from views is extremely slow. The plan contains automatic trusses that overlap roof planes with rafters set to retain framing.

### Root Cause

When automatic trusses overlap roof planes with retained rafter framing, Chief Architect must process both the truss geometry and the retained framing for every elevation view. This creates redundant geometry that significantly slows generation.

### Fix

1. **Update to X17** — this issue is fixed:
   - "Fixed an issue in which automatic trusses that overlapped a roof plane with rafters that was set to retain framing caused slowness when generating elevations and CAD details from views"

2. **Don't retain rafter framing** when automatic trusses are present:
   - Uncheck "Retain Framing" for roof planes that overlap with trusses
   - Let the truss define the framing instead of retaining separate rafter framing

3. **Delete redundant framing** — if both trusses and rafter framing exist, delete the redundant rafter framing

4. **Generate elevations without framing** — turn off framing layers before generating elevations, then re-enable

### Additional Performance Fixes in X17

- Railing with wall cap causing slow 3D views — fixed
- Editing CAD Blocks in CAD Details significantly slower in plans with many CAD Blocks — fixed
- Editing in cross section views containing large complex symbols — improved performance
- Boxed eave soffit generation — fixed
- Malformed truss causing rendering error — fixed

## 6. Additional Performance Optimization

### Custom Fill Styles

**Issue**: Custom Fill Styles that require drawing many tiny lines slow down floor plan view for zooming, moving, and placing objects.
**Fix**: Avoid complex fill patterns for wall type definitions, roof planes, closed polylines, rooms, and landscaping features.

### Material Patterns in Vector Views

**Issue**: Complex stone or tile patterns in Vector rendering (Cross Section/Elevations, Orthographic Overviews) slow view generation and working speed.
**Fix**: Use simpler material patterns in Vector views, or use PBR/raytrace rendering instead.

### High Macro Count

**Issue**: High number of macros in displayed text or labels slows panning, zooming, and moving objects in elevation and plan views.
**Fix**: Reduce macro usage in displayed text, or turn off text layers when not needed.

### System Requirements

- Verify hardware meets or exceeds system requirements: https://www.chiefarchitect.com/products/sysreq.html
- Ensure GPU supports multiple monitors if using them
- Use SSD for faster file I/O

## Best Practices

1. **Always work on local hard drive** — never open files from network/USB/external drives
2. **Copy to local, work, copy back** — the safe workflow for network-stored files
3. **Limit open 3D camera views** — each view redraws on every plan change
4. **Disable Generated Sky with sun-follows-camera** — causes constant regeneration
5. **Turn off unnecessary layers in 3D** — use layer sets for discipline-specific work
6. **Update to latest version** — many roof, library, and performance bugs are fixed in X17
7. **Don't retain rafter framing with automatic trusses** — causes elevation generation slowness
8. **Avoid complex fill patterns** — they slow floor plan view operations
9. **Reduce macros in displayed text** — slows panning and zooming
10. **Test with single monitor** — if 3D is slow, the GPU may be overloaded
