---
title: "ReCap Pro Scan-to-BIM: Cleaning, Clipping, and Preparing Point Clouds for As-Built Modeling"
excerpt: "How to clean and prepare point clouds in ReCap Pro before Scan-to-BIM modeling — covering noise removal, unwanted object deletion, region splitting, decimation for performance, and export settings for Revit and Navisworks."
category: "workflow"
softwareSlug: "recap-pro"
keyword: "recap pro scan to bim point cloud cleaning clipping decimation export"
slug: "recap-pro-scan-to-bim-cleaning-clipping-point-cloud-preparation"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-09"
sources:
  - "https://forums.autodesk.com/t5/recap-forum/the-registration-looks-good-in-x-and-y-axis-but-z-axis-is-curved/td-p/12498780"
  - "https://forums.autodesk.com/t5/recap-forum/realsee-galois-3d-scanner-to-autodesk-recap-pro-won-t-auto/td-p/13673186"
---

# ReCap Pro Scan-to-BIM: Cleaning, Clipping, and Preparing Point Clouds for As-Built Modeling

The quality of your Scan-to-BIM model depends on the quality of the point cloud you start with. We've seen modelers spend hours trying to trace walls from a noisy, cluttered point cloud. Thirty minutes of cleaning in ReCap Pro saves hours of modeling frustration. Here's our preparation workflow.

## Why Point Cloud Cleaning Matters

Raw laser scans contain:
- **Noise**: Stray points from reflections, glass, and moving objects
- **Unwanted objects**: People walking through the scan, vehicles, temporary equipment
- **Vegetation**: Trees and bushes that obscure building facades
- **Redundant data**: Overlapping points from multiple scans
- **Excessive density**: More points than needed for modeling

Cleaning the point cloud:
- **Improves visibility** — removes clutter that obscures building surfaces
- **Improves accuracy** — noise creates false surfaces that lead to modeling errors
- **Improves performance** — fewer points = faster loading in Revit
- **Improves modeling speed** — clean surfaces are easier to trace

## Step 1: Open the Registered Project

1. Open ReCap Pro.
2. Open the registered .rcp project.
3. The full point cloud is displayed in the 3D view.
4. Navigate using:
   - **Orbit**: Drag to rotate around the point cloud
   - **Pan**: Shift-drag to move the view
   - **Zoom**: Scroll to zoom in and out
   - **Walk**: Use the walk tool for first-person navigation

## Step 2: Remove Noise

Noise appears as scattered points that don't belong to any surface:

### Automatic Noise Removal

1. Go to **Edit** → **Decimation** (or **Simplify**).
2. Set the target point spacing:
   - **0.01m (10mm)**: For detailed modeling (doors, windows)
   - **0.02m (20mm)**: For general building modeling
   - **0.05m (50mm)**: For exterior/site modeling
3. ReCap Pro removes redundant points and reduces density.
4. This also removes some noise (isolated points are removed first).

### Manual Noise Removal

1. Go to **Edit** → **Selection** → **Window**.
2. Draw a selection window around noise areas:
   - **Isolated points**: Small clusters of points floating in space
   - **Reflection artifacts**: Points appearing inside or behind reflective surfaces
   - **Scan noise**: Scattered points around the scanner position
3. Press **Delete** to remove the selected points.
4. Repeat for each noise area.

### Common Noise Sources

- **Glass**: Laser passes through or reflects off glass — creates false points behind the glass
- **Mirrors**: Reflection creates a duplicate of the room behind the mirror
- **Polished surfaces**: Specular reflections create stray points
- **Moving objects**: People, doors, vehicles captured during scanning
- **Vegetation**: Trees and bushes — dense, irregular point clusters

## Step 3: Remove Unwanted Objects

### People

People captured in scans appear as point clouds in the shape of a person. Remove them:

1. Use **Selection** → **Window** or **Fence** to select the person.
2. Delete the selected points.
3. If the person appears in multiple scans, check each scan and remove.

### Vehicles

Cars and trucks in parking lots or driveways:
1. Select the vehicle using a window or fence.
2. Delete the points.
3. The ground surface behind the vehicle may be missing — this is expected.

### Temporary Objects

Scaffolding, ladders, tools, and equipment:
1. Identify temporary objects in the scan.
2. Select and delete.
3. Document what was removed — the client may need to know.

### Vegetation

Trees and bushes obscuring building facades:
1. Select the vegetation.
2. Delete — but be careful not to remove building points behind the vegetation.
3. The building facade behind the vegetation may be incomplete — note this for the modeler.

## Step 4: Clip to the Project Area

If the scan covers more area than needed:

1. Go to **Edit** → **Clip** → **Box**.
2. Draw a clipping box around the project area.
3. Points outside the box are hidden (not deleted).
4. To permanently remove points outside the project area:
   - Invert the selection (select everything outside the box)
   - Delete the inverted selection

### Clipping by Elevation

For multi-story buildings:
1. Use **Clip** → **Plane** to set upper and lower elevation limits.
2. Remove points below the ground floor (underground, sub-basement noise).
3. Remove points above the roof (sky noise, drone artifacts).
4. This reduces file size and improves Revit performance.

### Clipping by Distance

For exterior scans with large site areas:
1. Use **Clip** → **Box** to limit the point cloud to the building footprint plus a margin.
2. Remove distant terrain, neighboring buildings, and sky points.
3. Keep a margin of 5-10m around the building for context.

## Step 5: Split Large Point Clouds

For very large projects (buildings with many floors, large industrial facilities):

1. Go to **Edit** → **Split** → **Region**.
2. Create separate regions for:
   - **Each floor**: Split by elevation
   - **Exterior vs Interior**: Split by location
   - **Building sections**: Split by wing or section
3. Export each region as a separate .rcs file.
4. In Revit, link each .rcs file separately:
   - Only load the floor you're currently modeling
   - Unload or close worksets for other floors
   - This dramatically improves Revit performance

### Splitting Strategy

- **By floor**: Most common — each floor is a separate .rcs file
- **By building wing**: For large buildings — each wing is separate
- **Interior vs exterior**: Separate interior and exterior scans
- **By discipline**: Separate architectural, structural, and MEP areas

## Step 6: Decimate for Performance

Decimation reduces point density:

1. Go to **Edit** → **Decimation**.
2. Choose the decimation method:
   - **Uniform**: Reduces all points equally
   - **Adaptive**: Preserves more points in high-detail areas, fewer in flat areas
3. Set the target:
   - **Point spacing**: Distance between points (e.g., 0.01m, 0.02m, 0.05m)
   - **Percentage**: Keep a percentage of original points (e.g., 50%, 25%)
4. Preview the result.
5. Apply the decimation.

### Decimation Guidelines

| Application | Recommended Spacing | File Size Reduction |
|---|---|---|
| Detailed interior modeling | 0.01m (10mm) | ~50% |
| General building modeling | 0.02m (20mm) | ~75% |
| Exterior facade modeling | 0.02m (20mm) | ~70% |
| Site/terrain modeling | 0.05m (50mm) | ~90% |
| Clash detection only | 0.03m (30mm) | ~80% |

### When Not to Decimate

- **High-accuracy modeling**: If you need millimeter accuracy, don't decimate
- **Small projects**: If the file size is manageable (< 1GB), don't decimate
- **Feature extraction**: If you need to identify small features (cracks, defects), keep full density

## Step 7: Set Up Views and Saved Views

Create saved views for the modeling team:

1. Navigate to a useful view (e.g., plan view of Floor 1).
2. Go to **View** → **Save View**.
3. Name the view (e.g., "Floor 1 Plan", "North Elevation", "Section A").
4. Create views for:
   - **Plan views**: One per floor
   - **Elevation views**: One per building face
   - **Section views**: At key cross-sections
   - **3D overview**: Full building 3D view
5. Export the saved views with the project.

### Why Saved Views Help

- **Modelers start immediately** — don't need to navigate to find the right view
- **Consistent orientation** — everyone starts from the same view
- **Quality control** — saved views provide a standard for checking model accuracy

## Step 8: Export for Downstream Use

### Export for Revit

1. Go to **File** → **Export** → **Point Cloud**.
2. Select **.rcs** format (optimized for Revit).
3. Set the coordinate system:
   - **Internal coordinates**: Use if the point cloud is not georeferenced
   - **Survey coordinates**: Use if georeferenced with survey points
4. Export.

### Export for Navisworks

1. Export as **.rcs** or **.nwd**:
   - **.rcs**: Link into Navisworks as a point cloud
   - **.nwd**: Publish directly for Navisworks review
2. Set the coordinate system to match the Navisworks project.

### Export for Other Software

1. **.e57**: Universal point cloud format — works with CloudCompare, Faro Scene, etc.
2. **.las**: LiDAR format — works with GIS and terrain software
3. **.ply**: Polygon format — works with mesh software
4. **.pts**: Text-based point cloud — works with many tools but large file size

## Best Practices

- **Clean before decimating** — remove noise and unwanted objects first, then reduce density
- **Remove people and vehicles** — they clutter the point cloud and confuse modelers
- **Clip to the project area** — don't include unnecessary data
- **Split large projects by floor** — improves Revit performance dramatically
- **Decimate based on modeling needs** — 10mm for detailed, 20mm for general, 50mm for site
- **Create saved views** — helps the modeling team start quickly
- **Export as .rcs for Revit** — optimized format
- **Document the cleaning process** — record what was removed and why
- **Keep the original raw data** — don't overwrite the original scan files
- **Verify the cleaned point cloud** — check that no important features were removed
