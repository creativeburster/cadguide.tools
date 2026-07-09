---
title: "ReCap Pro to Revit Workflow: Point Cloud Underlay Setup, Sectioning, and Modeling Best Practices"
excerpt: "How to use ReCap Pro point clouds in Revit — covering point cloud insertion, coordinate alignment, visibility and sectioning settings, snap-to-point modeling techniques, and performance optimization for large point clouds."
category: "workflow"
softwareSlug: "recap-pro"
keyword: "recap pro revit point cloud underlay sectioning modeling workflow"
slug: "recap-pro-revit-point-cloud-underlay-sectioning-modeling"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-07-09"
sources:
  - "https://forums.autodesk.com/t5/recap-forum/trouble-aligning-scans-in-recap-pro-any-tips/td-p/13645821"
  - "https://forums.autodesk.com/t5/recap-forum/cannot-register-survey-points/td-p/13646849"
---

# ReCap Pro to Revit Workflow: Point Cloud Underlay Setup, Sectioning, and Modeling Best Practices

The point cloud is your reality. The Revit model is your interpretation. Getting the point cloud into Revit correctly — aligned, visible, and performant — is the difference between accurate as-built modeling and guesswork. I've set up dozens of point cloud underlays in Revit. Here's my workflow for getting it right.

## Why Use Point Clouds in Revit

Point clouds from laser scans provide:
- **As-built conditions**: Exact geometry of existing buildings
- **Verification**: Check new design against existing conditions
- **Clash detection**: Identify conflicts between new and existing
- **Documentation**: Create accurate as-built models
- **Renovation**: Model existing conditions before designing changes

## Step 1: Prepare the Point Cloud in ReCap Pro

Before importing into Revit:

1. **Register all scans** — ensure the point cloud is fully registered with low error
2. **Clean the point cloud**:
   - Remove noise (stray points, reflections)
   - Remove unwanted objects (people, vehicles, temporary items)
   - Use **ReCap Pro's selection tools** to delete unwanted points
3. **Set the origin**:
   - **Project base point**: Align the point cloud origin to the Revit project base point
   - **Survey point**: If georeferenced, the survey point coordinates transfer to Revit
4. **Decimate if needed**:
   - Large point clouds (> 10GB) can slow Revit significantly
   - Use **ReCap Pro's decimation** to reduce point density
   - Balance: enough density for modeling accuracy, not so much that Revit slows down
5. **Export as .rcs**:
   - .rcs files are optimized for Revit
   - .rcp files are larger but contain more data

### Point Cloud Size Guidelines for Revit

| File Size | Revit Performance | Recommendation |
|---|---|---|
| < 1 GB | Good | Use directly |
| 1-5 GB | Moderate | Consider decimation |
| 5-10 GB | Slow | Decimate or split |
| > 10 GB | Very slow | Split into regions |

## Step 2: Insert the Point Cloud in Revit

1. Open the Revit project.
2. Go to **Insert** → **Point Cloud**.
3. Browse to the .rcs or .rcp file.
4. **Positioning**:
   - **Auto - Origin to Origin**: Aligns the point cloud origin to the Revit origin
   - **Auto - Shared Coordinates**: Uses shared coordinates for alignment
   - **Manual**: Place the point cloud manually
5. Click **Open**.
6. The point cloud appears in the Revit view.

### Coordinate Alignment

For correct alignment between the point cloud and Revit model:

1. **If the point cloud is georeferenced** (has survey points):
   - Use **Shared Coordinates** positioning
   - Ensure the Revit survey point matches the point cloud coordinate system
2. **If the point cloud is not georeferenced**:
   - Use **Origin to Origin** positioning
   - Manually align the point cloud to the Revit model
   - Use the **Move** and **Rotate** tools to align visible features

### Verifying Alignment

After insertion:
1. Check the point cloud position in a **plan view** — walls should align with Revit grid lines
2. Check in an **elevation view** — floor levels should match the point cloud floor
3. Check in a **3D view** — the point cloud should sit on the Revit ground plane
4. If misaligned, use **Move** to correct the position

## Step 3: Configure Point Cloud Visibility

### Visibility/Graphics Overrides

1. Go to **View** → **Visibility/Graphics** (or type **VG**).
2. Find the **Point Clouds** category.
3. Configure:
   - **Visibility**: Check to show the point cloud
   - **Point Density**: Low, Medium, High — controls how many points are displayed
     - **Low**: Fastest performance, fewest points
     - **Medium**: Balanced (recommended for modeling)
     - **High**: Most points, slowest performance
4. Per-point-cloud overrides:
   - Click the point cloud name to expand
   - Override **Surface Pattern** and **Cut Pattern**
   - Override **Halftone** to dim the point cloud

### Workset Assignment

For large point clouds:
1. Create a **Workset** called "Point Cloud"
2. Assign the point cloud to this workset
3. Close the workset when not modeling from the point cloud
4. This improves performance by not loading the point cloud when not needed

### View Filters

Create view filters to control point cloud visibility:
1. Go to **View** → **Filters** → **Add Filter**.
2. Create a filter for "Point Cloud Visible".
3. Apply to specific views where you need the point cloud.
4. Leave the filter off in views where you don't need it.

## Step 4: Section the Point Cloud

Sectioning is critical for modeling — you need to see the point cloud in cross-section to trace walls, doors, and windows.

### Use a Section Box

1. In a **3D view**, click **Section Box** (in the View Properties).
2. Drag the section box to isolate the area you're modeling.
3. The point cloud is clipped to the section box — only points inside are displayed.
4. This dramatically improves performance and visibility.

### Use Plan Views with Crop Region

1. In a **plan view**, enable the **Crop Region**.
2. Set the **Bottom** and **Top** clip planes to a narrow band (e.g., 1m thick).
3. Only points within the clip range are displayed.
4. This creates a "slice" of the point cloud at a specific elevation.

### Use Elevation Views

1. In an **elevation view**, set the **Far Clip Offset** to a narrow depth (e.g., 0.5m).
2. Only points within the clip depth are displayed.
3. This creates a "slice" of the point cloud at a specific wall.

### Sectioning Tips

- **Section narrowly** — only show the points you need for the current modeling task
- **Move the section as you model** — keep the visible area focused on the current work
- **Use multiple views** — one plan view for tracing walls, one 3D view for checking heights
- **Disable point clouds in views where not needed** — improves performance

## Step 5: Model from the Point Cloud

### Snap to Point Cloud

Revit can snap to points in the point cloud:
1. Go to **Manage** → **Snap Settings**.
2. Ensure **Point Clouds** is enabled in the snap settings.
3. When drawing walls, lines, or other elements, Revit snaps to nearby points.
4. Use **Tab** to cycle through snap points.

### Modeling Walls

1. Set the point cloud to **Medium density** in the plan view.
2. Use the **Wall** tool.
3. Trace the wall in the point cloud:
   - Click on the wall edge in the point cloud
   - Use the point cloud snap to align the wall
4. Set the wall height based on the point cloud:
   - Check the wall height in an elevation view
   - Adjust the wall's top constraint

### Modeling Doors and Windows

1. In an **elevation view** with the point cloud sectioned narrowly:
2. Identify the door or window opening in the point cloud.
3. Use the **Door** or **Window** tool.
4. Place the element aligned with the point cloud opening.
5. Adjust the sill height and head height based on the point cloud.

### Modeling Floors and Ceilings

1. In a **plan view** with the point cloud sectioned at floor level:
2. Trace the floor outline using the **Floor** tool.
3. Set the floor elevation based on the point cloud.
4. For ceilings, section the point cloud at ceiling level and trace.

### Modeling Tips

- **Model in small sections** — don't try to model the entire building at once
- **Check alignment in 3D** — periodically switch to 3D view to verify alignment
- **Use reference planes** — create reference planes at key locations for consistent alignment
- **Don't over-model** — only model what you need; not every pipe and conduit needs modeling
- **Verify with measurements** — compare Revit dimensions with field measurements

## Step 6: Optimize Performance

Large point clouds can make Revit sluggish. Tips:

1. **Use .rcs instead of .rcp** — .rcs is optimized for Revit
2. **Decimate the point cloud in ReCap Pro** — reduce density before importing
3. **Use section boxes and crop regions** — only display the points you need
4. **Set density to Low when navigating** — increase to Medium when modeling
5. **Close the point cloud workset** when not modeling from it
6. **Split large point clouds** — divide into regions (e.g., per floor) and link separately
7. **Use linked Revit models** — model each floor in a separate Revit file and link them

### Performance Troubleshooting

**Revit is slow when navigating**:
- Reduce point density to Low
- Enable section box to limit visible points
- Close other applications using GPU memory

**Point cloud doesn't display**:
- Check Visibility/Graphics → Point Clouds is enabled
- Check the point cloud is within the view range
- Check the section box includes the point cloud

**Point cloud is misaligned**:
- Check the coordinate system (Shared Coordinates vs Origin to Origin)
- Verify the ReCap Pro survey points match the Revit survey point
- Use Move and Rotate to manually correct alignment

## Step 7: Export and Deliver

After modeling from the point cloud:

1. **Export the Revit model** — to IFC, DWG, or NWD for coordination
2. **Keep the point cloud linked** — for verification and future reference
3. **Document the workflow** — record the ReCap Pro project, coordinate system, and any manual adjustments
4. **Create as-built drawings** — use the Revit model to generate 2D as-built plans

## Best Practices

- **Prepare the point cloud in ReCap Pro first** — clean, decimate, and set the origin
- **Use .rcs format for Revit** — optimized for performance
- **Section narrowly when modeling** — only show the points you need
- **Set density to Low for navigation, Medium for modeling** — balance performance and visibility
- **Snap to the point cloud** — use point cloud snaps for accurate tracing
- **Model in small sections** — don't try to model everything at once
- **Verify alignment in 3D** — periodically check that the model matches the point cloud
- **Use worksets for point clouds** — close when not needed to improve performance
- **Split large point clouds by floor** — link each floor separately for better performance
- **Document the coordinate system** — ensure the point cloud and Revit model use the same coordinates
