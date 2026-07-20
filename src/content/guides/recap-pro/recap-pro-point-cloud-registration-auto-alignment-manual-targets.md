---
title: "ReCap Pro Point Cloud Registration: Auto-Alignment, Manual Targets, and Survey Point Workflow"
excerpt: "How to register laser scans in Autodesk ReCap Pro — covering auto-alignment workflow, manual registration with target points, survey point integration for georeferencing, and troubleshooting common registration failures and Z-axis drift."
category: "workflow"
softwareSlug: "recap-pro"
keyword: "recap pro point cloud registration auto alignment manual targets survey points"
slug: "recap-pro-point-cloud-registration-auto-alignment-manual-targets"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-07-09"
sources:
  - "https://forums.autodesk.com/t5/recap-forum/trouble-aligning-scans-in-recap-pro-any-tips/td-p/13645821"
  - "https://forums.autodesk.com/t5/recap-forum/requirements-for-point-cloud-registration-in-recap/td-p/8296167"
---

# ReCap Pro Point Cloud Registration: Auto-Alignment, Manual Targets, and Survey Point Workflow

Point cloud registration is the foundation of every laser scanning project. Get it wrong and everything downstream — Revit modeling, clash detection, as-built documentation — inherits the error. I've registered hundreds of scan projects in ReCap Pro, from small single-room scans to 1200-scan building exteriors. The workflow is straightforward when it works. When it doesn't, you need to know why. Here's my complete registration guide.

## Understanding Registration

Registration is the process of aligning multiple scans into a single coordinate system. Each scan is captured from a different position. Registration calculates the rotation and translation that aligns each scan to a common reference.

### Registration Methods in ReCap Pro

1. **Auto-alignment**: Software automatically finds matching features between scans
2. **Manual registration**: User selects matching points between scans
3. **Target-based registration**: Uses surveyed targets (spheres, checkerboards) placed in the scan area
4. **Survey point registration**: Uses known coordinate points from a total station or GPS

### What ReCap Pro Needs for Auto-Alignment

- **Structured scan data**: Scans from laser scanners (FARO, Leica, Trimble) with panoramic images
- **Overlap between scans**: At least 20-30% overlap for reliable auto-alignment
- **Visual features**: Scans need identifiable features (walls, corners, objects) — featureless surfaces (blank walls, uniform floors) cause failures
- **Intensity or RGB data**: Auto-alignment uses intensity images or RGB values — pure XYZ data without intensity or color won't auto-align

## Step 1: Import Scans

1. Open ReCap Pro.
2. Click **New Project** → **Scan Project**.
3. Import scan files:
   - **FARO**: .fls, .fws
   - **Leica**: .e57, .pts, .ptx
   - **Trimble**: .rwp, .rwp2
   - **Universal**: .e57, .las, .ply
4. ReCap Pro indexes each scan (creates a preview and extracts features).
5. Indexing time depends on scan size — typically 1-5 minutes per scan.

### Import Tips

- **Group scans by location** — e.g., "Floor 1", "Floor 2", "Exterior"
- **Check scan quality** — preview each scan for noise, missing data, or misalignment
- **Remove bad scans** — don't include scans with excessive noise or incomplete data

## Step 2: Auto-Alignment

1. After all scans are indexed, click **Register**.
2. Select **Auto-Register**.
3. ReCap Pro analyzes each scan pair for matching features.
4. The software creates a registration network:
   - **Node scans**: Scans that other scans align to
   - **Leaf scans**: Scans that align to one other scan
   - **Isolated scans**: Scans that don't align to any other scan
5. Review the registration results:
   - **Registered scans**: Green checkmark
   - **Unregistered scans**: Red X
   - **Error values**: Overlap percentage and point distance error

### Auto-Alignment Success Factors

- **Overlap**: More overlap = better alignment (aim for 30%+)
- **Feature richness**: Rooms with furniture, equipment, and structural elements align better than empty spaces
- **Scan spacing**: Closer scans align better (but more scans = more processing time)
- **Lighting consistency**: Similar lighting between scans improves feature matching

### When Auto-Alignment Fails

Auto-alignment may fail when:
- **Insufficient overlap**: Scans too far apart
- **Featureless surfaces**: Long corridors, blank walls, uniform floors
- **Homogeneous environments**: Underground mines, parking garages with repetitive structure
- **No intensity/RGB data**: Pure XYZ point clouds without visual data
- **Non-Autodesk scanner formats**: Some third-party scanner exports lack the metadata needed for auto-alignment

## Step 3: Manual Registration

When auto-alignment fails for specific scans, use manual registration:

1. Click **Register** → **Manual Registration**.
2. Select two scans to register:
   - **Reference scan**: A registered scan
   - **Unregistered scan**: The scan to align
3. Both scans appear side-by-side in split view.
4. Identify matching points:
   - **Click on a point in the reference scan** — a marker appears
   - **Click the same point in the unregistered scan** — a second marker appears
5. Select at least 3 matching points (more is better — aim for 5-7).
6. Click **Register** to align the unregistered scan to the reference.
7. Review the alignment:
   - **Visual check**: The two scans should overlap correctly in 3D view
   - **Error value**: Point distance error should be < 5mm for building scans, < 2mm for industrial scans

### Manual Registration Tips

- **Choose well-defined points**: Corners, edges, target centers — not vague surfaces
- **Spread points across the overlap area**: Don't cluster all points in one region
- **Use panoramic images**: Click points in the photos for more precise selection
- **Check alignment from multiple views**: Don't rely on one viewing angle

### Manual Registration with Targets

If you placed targets (spheres or checkerboards) in the scan area:

1. ReCap Pro can automatically detect targets in each scan.
2. Use target-to-target matching for more reliable registration.
3. Target registration is typically more accurate than feature-based registration.

## Step 4: Add Survey Points for Georeferencing

To place the point cloud in a real-world coordinate system:

1. Click **Register** → **Survey Points**.
2. Import survey points from a text file:
   - **Format**: Point Number, Northing, Easting, Elevation (tab-delimited .txt)
   - **Coordinate system**: Match the surveyor's coordinate system
3. For each survey point:
   - **Identify the corresponding point in the scan** — click on the target or feature
   - **Assign the survey coordinates** — enter the Northing, Easting, and Elevation
4. Add at least 3 well-spaced survey points (not in a straight line).
5. Click **Apply** to georeference the entire project.

### ReCap Pro 2025 Survey Point Changes

In ReCap Pro 2025, the survey point workflow changed:
1. Go to **Registration mode**.
2. Use the three-dot menu on a selected point.
3. Look for **"Make Survey Point"** or similar wording.
4. You can also import survey points from a text file.
5. Some options only appear after the project is fully registered (not just indexed).

### Common Survey Point Problems

**Z-elevation is wrong**: 
- Check the survey file — ensure elevations are in the correct units (meters vs feet)
- Verify the coordinate system matches
- Re-register using the new control points

**Survey points in a straight line**:
- Three points in a line cause tilting — spread them in a triangle pattern
- Add a fourth point for redundancy

## Step 5: Fix Z-Axis Drift

Z-axis drift is the most common registration problem in long scan projects. The floor appears curved or tilted when viewed from the side.

### Cause

Cloud-to-cloud registration calculates rotation and translation. Over many scans, small rotational errors accumulate, causing the Z-axis to drift. This is especially common in:
- **Long corridors**: Featureless surfaces with minimal constraint
- **Shiny or translucent floors**: Marble, polished concrete — poor point returns
- **Large projects**: 100+ scans with accumulated error

### Fix 1: Use Survey Points

1. Add survey points at regular intervals (every 10-20 scans).
2. Survey points constrain the Z-axis, preventing drift.
3. This is the most reliable fix.

### Fix 2: Register in Small Batches

1. Divide the project into small groups (10-20 scans).
2. Register each group separately.
3. Merge the groups using manual registration or survey points.
4. This limits error accumulation within each batch.

### Fix 3: Lock Z-Axis (Not Available in ReCap Pro)

Some competing software (Trimble RealWorks, Cyclone Register 360) allows locking the Z-axis during cloud-to-cloud registration. ReCap Pro does not have this feature. If Z-axis drift is a persistent problem, consider using Cyclone Register 360 for registration and importing the result into ReCap Pro.

### Fix 4: Use Targets

1. Place checkerboard targets or spheres at known elevations.
2. Use target-based registration to constrain the Z-axis.
3. Targets at known elevations prevent vertical drift.

## Step 6: Review and Optimize Registration

After registration:

1. Check the **registration error report**:
   - **Mean error**: Average point distance error (target: < 5mm for buildings, < 2mm for industrial)
   - **Maximum error**: Worst-case error (investigate scans with high error)
   - **Overlap percentage**: Should be > 20% for each scan pair
2. Visual inspection:
   - **Plan view**: Check alignment in top view — walls and edges should be crisp
   - **Elevation view**: Check for Z-axis drift — floors should be flat
   - **Cross-section**: Cut a section and check for double walls (misalignment)
3. Optimize:
   - **Re-register problematic scans**: Use manual registration for scans with high error
   - **Remove isolated scans**: Scans that couldn't be registered — re-scan if needed
   - **Add constraints**: Survey points or targets for areas with drift

## Step 7: Index and Export

1. Click **Index** to finalize the registration.
2. ReCap Pro creates a single .rcp or .rcs file:
   - **.rcp**: ReCap project file — contains all scans and registration data
   - **.rcs**: ReCap scan file — single indexed point cloud for use in Revit, Navisworks, etc.
3. Export options:
   - **Export to Revit**: Insert as a point cloud underlay
   - **Export to Navisworks**: Use for clash detection
   - **Export to AutoCAD**: Use as a reference for 2D drawings
   - **Export to .e57 or .las**: For use in other software

### Export Tips

- **Use .rcs for Revit** — smaller file size, faster loading
- **Use .rcp for ReCap** — preserves all scan data and registration
- **Decimate if needed** — reduce point density for faster loading in Revit (trades accuracy for performance)
- **Set the insertion point** — match the Revit project base point for correct coordination

## Best Practices

- **Ensure 30%+ overlap between scans** — critical for auto-alignment
- **Use structured scan data** — ReCap needs panoramic images for auto-alignment
- **Place targets in featureless areas** — corridors, parking garages, open spaces
- **Add survey points every 10-20 scans** — prevents Z-axis drift
- **Register in small batches for large projects** — limits error accumulation
- **Check registration in elevation view** — catches Z-axis drift that plan view hides
- **Review error reports** — don't accept registrations with high mean error
- **Use manual registration for failed scans** — don't leave scans unregistered
- **Export as .rcs for Revit** — optimized for Revit performance
- **Document the registration workflow** — record scan order, targets used, and survey points for project records
