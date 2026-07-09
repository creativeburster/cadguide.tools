---
title: "ReCap Pro Troubleshooting: Fixing Registration Failures, Import Errors, and Scanner Compatibility"
excerpt: "How to troubleshoot common ReCap Pro problems — covering auto-registration failures with third-party scanners, E57 import issues, missing survey point tools in 2025, Z-axis curvature after indexing, and file format compatibility."
category: "troubleshooting"
softwareSlug: "recap-pro"
keyword: "recap pro troubleshooting registration failure import error scanner compatibility"
slug: "recap-pro-troubleshooting-registration-failure-import-error"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-07-09"
sources:
  - "https://forums.autodesk.com/t5/recap-forum/realsee-galois-3d-scanner-to-autodesk-recap-pro-won-t-auto/td-p/13673186"
  - "https://forums.autodesk.com/t5/recap-forum/cannot-register-survey-points/td-p/13646849"
---

# ReCap Pro Troubleshooting: Fixing Registration Failures, Import Errors, and Scanner Compatibility

ReCap Pro works great with Autodesk-supported scanners and standard file formats. But throw in a non-standard scanner, an E57 file from an unusual source, or a 2025 version upgrade, and things break. I've debugged all of these problems. Here are the most common ReCap Pro issues and their fixes.

## Problem 1: Auto-Registration Fails with Third-Party Scanners

### Symptoms

- Scans from non-Autodesk hardware (Realsee Galois, Matterport, iPhone LiDAR) won't auto-register
- Manual registration point selection doesn't work — can't click points in photos
- Error: "Registration failed" or scans remain unregistered

### Cause

ReCap Pro's auto-registration relies on structured scan data with panoramic images. Some third-party scanners export E57 or PLY files without the necessary metadata:
- **No panoramic images**: Auto-registration uses images for feature matching
- **No scan origin**: Structured scans have a known origin (0,0,0); unstructured data doesn't
- **Incompatible image embedding**: Images may not be embedded in the E57 in a format ReCap Pro can read

### Fix

1. **Check the export format**:
   - Export from the scanner software as **E57** or **PLY** (most compatible)
   - Ensure panoramic images are included in the export
2. **Try CloudCompare as an intermediary**:
   - Import the E57 into CloudCompare (free, open-source)
   - Verify the point cloud is intact
   - Re-export as E57 from CloudCompare
   - Import the re-exported E57 into ReCap Pro
3. **Use manual registration**:
   - If you can't click points in photos, the images aren't embedded correctly
   - Try clicking points in the 3D view instead of the photo view
   - Select at least 5-7 matching points between scans
4. **Import just two scans first**:
   - Test with a small subset
   - If manual registration works with two scans, gradually add more

### Prevention

- **Verify scanner compatibility** before purchasing — check the ReCap Pro supported scanners list
- **Export with images** — always include panoramic images when exporting from scanner software
- **Test the workflow** — import one scan into ReCap Pro before committing to a full project

## Problem 2: "Cannot Register Survey Points" in ReCap Pro 2025

### Symptoms

- The "Register Survey Points" option is missing in ReCap Pro 2025
- Z-elevations are wrong after import
- Tutorial videos show a button that doesn't exist in the current version

### Cause

ReCap Pro 2025 changed the survey point workflow. The old button-based approach was replaced with a new workflow that's less discoverable.

### Fix

1. **Go into Registration mode**:
   - Open the project in ReCap Pro
   - Switch to **Registration** mode (not just indexed view)
2. **Use the three-dot menu**:
   - Select a point in the scan
   - Click the three-dot menu (more options)
   - Look for **"Make Survey Point"** or similar wording
3. **Import from text file**:
   - Format: Point Number, Northing, Easting, Elevation (tab-delimited .txt)
   - Use the import option in the registration panel
4. **Ensure the project is fully registered**:
   - Some survey point options only appear after the project is registered (not just indexed)
   - Complete auto or manual registration first
   - Then add survey points

### Prevention

- **Read the 2025 release notes** — the workflow changed significantly
- **Watch 2025-specific tutorials** — older tutorials show the old workflow
- **Contact Autodesk support** if the option is truly missing — may be a licensing issue

## Problem 3: Z-Axis Curvature After Indexing

### Symptoms

- Registration looks perfect in plan view (X-Y)
- After indexing, the Z-axis is curved — the floor appears to arc
- The curvature gets worse toward the edges of the project
- Re-registering with more points doesn't fix it

### Cause

Cloud-to-cloud registration calculates rotation and translation for each scan pair. Small rotational errors in the Z-axis accumulate over many scans, creating a "curved earth" effect. This is especially common in:
- **Long corridors**: Featureless surfaces with minimal constraint
- **Shiny or translucent floors**: Marble, polished concrete — poor point returns
- **Large projects**: 100+ scans with accumulated error
- **No Z-axis constraint**: ReCap Pro doesn't lock the Z-axis during registration

### Fix 1: Add Survey Points

1. Import survey points at regular intervals (every 10-20 scans).
2. Survey points constrain the Z-axis, preventing drift.
3. Re-register with the survey points as constraints.
4. This is the most reliable fix.

### Fix 2: Register in Small Batches

1. Divide the project into groups of 10-20 scans.
2. Register each group separately.
3. Merge groups using manual registration or survey points.
4. This limits error accumulation within each batch.

### Fix 3: Use Targets at Known Elevations

1. Place checkerboard targets or spheres at known elevations during scanning.
2. Use target-based registration to constrain the Z-axis.
3. Targets at known elevations prevent vertical drift.

### Fix 4: Use Alternative Software

If Z-axis drift is persistent:
- **Leica Cyclone Register 360**: Has Z-axis locking capability
- **Trimble RealWorks**: Also has Z-axis locking
- Register in Cyclone or RealWorks, then import the result into ReCap Pro

### Prevention

- **Place targets at known elevations** during scanning
- **Scan in small loops** — close the loop to distribute error
- **Add survey points every 10-20 scans**
- **Avoid long featureless corridors** — add intermediate scans with features

## Problem 4: Unstructured Point Clouds Won't Register

### Symptoms

- Point clouds from simulation, drone photogrammetry, or mobile mapping won't register
- The "Registration" option is disabled
- Error: "Unstructured data cannot be registered"

### Cause

ReCap Pro registration requires structured scan data (from laser scanners with known origin and panoramic images). Unstructured point clouds (from photogrammetry, simulation, or mobile mapping) don't have the necessary metadata.

### Fix

1. **Don't use ReCap Pro for registration** — unstructured data can't be registered
2. **Register in the source software**:
   - **Drone photogrammetry**: Register in Pix4D, Agisoft Metashape, or ContextCapture
   - **Mobile mapping**: Register in the mobile mapping software
   - **Simulation**: No registration needed — already in a single coordinate system
3. **Import the registered result into ReCap Pro**:
   - Export as .e57 or .las from the source software
   - Import into ReCap Pro as a single point cloud (no registration needed)
4. **Add unstructured data to structured scans**:
   - You can add unstructured data to a project with structured scans
   - The unstructured data aligns to the registered structured scans
   - But you need at least some structured scans for the registration to work

### Prevention

- **Know your data type** — structured (laser scanner) vs unstructured (photogrammetry)
- **Register in the appropriate software** — don't try to register photogrammetry in ReCap Pro

## Problem 5: ReCap Pro Crashes or Freezes on Large Projects

### Symptoms

- ReCap Pro crashes during indexing or registration
- Freezes when displaying large point clouds
- Out of memory errors

### Cause

Large projects (100+ scans, > 50GB) exceed available memory or GPU resources.

### Fix

1. **Increase virtual memory**:
   - Set Windows virtual memory to 1.5x physical RAM
   - Ensure sufficient free disk space on the virtual memory drive
2. **Process in batches**:
   - Split the project into smaller groups
   - Register each group separately
   - Merge the groups
3. **Use cloud processing** (if available):
   - ReCap Pro with cloud processing offloads indexing to Autodesk servers
4. **Upgrade hardware**:
   - **RAM**: 32GB minimum for large projects, 64GB recommended
   - **GPU**: Dedicated GPU with 4GB+ VRAM
   - **Storage**: SSD for faster I/O
5. **Decimate before registration**:
   - Reduce point density in each scan before registration
   - This reduces memory usage during registration

### Prevention

- **Check system requirements** before starting large projects
- **Close other applications** when processing large projects
- **Process overnight** for very large projects
- **Split projects by floor or building section**

## Problem 6: Point Cloud Doesn't Align in Revit

### Symptoms

- Point cloud inserted in Revit is offset from the model
- Coordinates don't match despite using Shared Coordinates
- The point cloud appears at the wrong elevation

### Fix

1. **Check the coordinate system in ReCap Pro**:
   - Verify the survey points are correctly set
   - Check the coordinate system matches the Revit project
2. **Check the Revit insertion method**:
   - Use **Shared Coordinates** if the point cloud is georeferenced
   - Use **Origin to Origin** if not georeferenced
3. **Manually align**:
   - Use the **Move** tool to shift the point cloud
   - Use **Rotate** to correct orientation
   - Verify alignment in plan, elevation, and 3D views
4. **Check units**:
   - ReCap Pro: meters (default)
   - Revit: may be feet or millimeters
   - Ensure the unit conversion is correct

### Prevention

- **Set up shared coordinates in Revit before importing**
- **Verify the ReCap Pro coordinate system matches the Revit survey point**
- **Document the coordinate system** for both ReCap Pro and Revit

## Best Practices

- **Verify scanner compatibility before purchasing** — check ReCap Pro's supported list
- **Export with panoramic images** — required for auto-registration
- **Use CloudCompare as an intermediary** for problematic file formats
- **Add survey points every 10-20 scans** — prevents Z-axis drift
- **Register in small batches for large projects** — limits error accumulation
- **Keep raw scan data** — never overwrite originals
- **Upgrade hardware for large projects** — 32GB+ RAM, dedicated GPU, SSD
- **Test the full workflow before committing** — import one scan, register, export to Revit
- **Document all troubleshooting steps** — helps the team avoid repeated issues
