---
title: "MicroStation Large File Performance: Reference Files, Raster Manager, and Display Settings"
excerpt: "MicroStation files with large raster attachments and complex references slow to a crawl. We cover the Raster Manager memory settings, reference display optimization, and the level management strategy that keeps large files responsive."
category: "performance"
softwareSlug: "microstation"
keyword: "MicroStation large file performance slow raster reference display"
slug: "microstation-large-file-performance-raster-reference-fix"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-06-21"
sources:
  - "https://community.spiceworks.com/t/microstation-slow-or-errors-out-with-large-raster-images/1006948"
  - "https://www.bentley.com/software/microstation/"
  - "https://www.bentley.com/en/products/product-line/microstation"
---

# MicroStation Large File Performance: Reference Files, Raster Manager, and Display Settings

Users on the Spiceworks community forum reported that MicroStation with large raster image files attached through Raster Manager would error out or become extremely slow. Axiom Int., a Bentley third-party support provider, published a list of "10 MicroStation Problems" that includes performance complaints, file corruption, and display issues. Bentley's own MicroStation 2024 release notes list numerous performance-related defects that were fixed, confirming that performance is an ongoing concern.

MicroStation is used for some of the largest infrastructure projects in the world — highway systems, rail networks, plant facilities — and the files can reach hundreds of megabytes or even gigabytes. Performance optimization in MicroStation requires a different approach than in mechanical CAD systems because the files are primarily 2D/3D vector data with raster attachments, not parametric feature trees.

## Fix 1: Optimize Raster Manager Settings

Large raster images (aerial photos, satellite imagery, scanned drawings) are the #1 cause of MicroStation performance problems. The Spiceworks forum post identified the fix:

### Change Raster Manager Memory Settings

1. Open MicroStation
2. Go to **Workspace → Preferences → Raster Manager → Memory** tab
3. Change the memory setting:
   - **Default**: MicroStation loads rasters into system memory
   - **Tile-based**: MicroStation loads only the visible portion of the raster
   - Set to **Tile-based** for large rasters (over 50MB)
4. Set **Maximum memory per raster**: Lower this to 256MB or 512MB
5. Set **Tile size**: 256x256 or 512x512 pixels
6. Click **OK** and restart MicroStation

### Additional Raster Optimizations

1. **Compress raster files**: Use JPEG2000 or ECW format instead of uncompressed TIFF
2. **Create pyramids**: Enable pyramid generation for large rasters — this creates lower-resolution versions for fast display at zoomed-out views
3. **Limit raster resolution**: Don't attach 1-inch resolution aerials when 6-inch resolution is sufficient
4. **Use multiple smaller rasters**: Instead of one 1GB raster, use four 250MB rasters covering different areas

## Fix 2: Optimize Reference Files

Reference files (similar to XREFs in AutoCAD) are external files attached to the current design file. Each reference adds to the display processing load:

### Use Nested References Efficiently

1. Go to **References dialog** (File → References)
2. Check the nesting depth of each reference
3. Deep nesting (reference of a reference of a reference) is very slow
4. Limit nesting depth to 2 levels maximum
5. If deeper nesting is needed, use **Live Nesting** with a depth limit:
   - Right-click the reference → **Settings → Nesting**
   - Set **Nesting Depth** to 2

### Use Display Off for Unneeded References

1. In the References dialog, uncheck **Display** for references not currently needed
2. Undisplayed references are not rendered, saving processing time
3. You can still snap to undisplayed references if **Snap** is checked
4. Toggle display on only when you need to see the reference

### Use Reference Attachments with Clip Boundaries

1. Instead of attaching an entire large reference file, clip it to show only the relevant area
2. Right-click the reference → **Clip**
3. Draw a boundary polygon around the area you need
4. Only the clipped portion is processed for display

## Fix 3: Manage Levels Effectively

MicroStation files can have hundreds of levels. Each visible level adds to the display processing:

### Turn Off Unused Levels

1. Open the **Level Manager** (Settings → Level → Level Manager)
2. Turn off display for levels not currently needed
3. Use **Level Filters** to quickly turn off groups of levels:
   - Create a filter for "Survey Data" and turn it off when doing design work
   - Create a filter for "Existing Conditions" and turn it off when doing proposed design
4. Use **Global Display** to turn off a level across all references

### Use Level Symbology Overrides

1. In the Level Manager, set **Symbology** overrides
2. Override all levels to use a single color (e.g., gray) for background context
3. This simplifies the display and reduces rendering overhead
4. Turn off symbology overrides only for final presentation

## Fix 4: Optimize Display Settings

### Disable Unnecessary Display Features

1. Go to **Workspace → Preferences → View Options**
2. Disable:
   - **Transparency**: Transparent fills are GPU-intensive
   - **Anti-aliasing**: Set to Off for large files
   - **Shadows**: Disable for 3D files
   - **Fog**: Disable
   - **Constructions**: Turn off construction elements
3. Set **View rendering** to **Wireframe** for working
4. Use **Smooth** or **Hidden Line** only for presentations

### Use the Fast Display Mode

1. In the view window, right-click → **View Attributes**
2. Enable **Fast Display**
3. Fast Display reduces rendering quality for better performance
4. Disable Fast Display for final output

## Fix 5: Compress the Design File

MicroStation files accumulate deleted elements and unused data over time:

1. Go to **File → Compress**
2. Select **Compress Options**:
   - **Delete unused levels**: Removes levels with no elements
   - **Delete unused attachment levels**: Removes reference levels with no elements
   - **Delete unused definitions**: Removes unused cell definitions, line styles, etc.
3. Click **Compress**
4. The file size can decrease by 20-50% after compression

### Regular Compression Schedule

- Compress files weekly for active projects
- Compress before archiving
- Compress after deleting large amounts of geometry
- Use **File → Compress → Compress All** to compress the active file and all open references

## Fix 6: Use Worksets for Large Projects

Worksets organize project files and improve performance by limiting what's loaded:

1. Go to **File → Worksets**
2. Create a workset for each project or project phase
3. Each workset has its own standards (levels, cells, templates)
4. Only files within the workset are accessible, reducing accidental loading of unrelated files
5. Worksets also manage reference paths more efficiently

## Fix 7: Fix File Corruption

Axiom's guide notes that file corruption is a common MicroStation problem. Corrupted files can cause performance degradation and crashes:

### Run File Repair

1. Go to **File → Check File**
2. Select **Repair** mode
3. MicroStation checks for and repairs:
   - Corrupted element headers
   - Invalid geometry
   - Broken references
   - Level table corruption
4. Save the repaired file

### Use Axiom FileFixer

For severe corruption that MicroStation's built-in repair can't fix:

1. Use Axiom's FileFixer tool (third-party, paid)
2. FileFixer can repair corruption that prevents files from opening
3. It also optimizes file structure for better performance
4. Run FileFixer on archived files before reopening them

## Fix 8: Optimize 3D Files

For 3D MicroStation files (common in plant and infrastructure design):

### Use Section Cut Views

1. Instead of displaying the entire 3D model, use section cut views
2. **Tools → Drawing → Section**
3. Create a section cutting plane through the model
4. Only geometry at the cut plane is displayed, dramatically reducing rendering load

### Use Display Sets

1. **Tools → Display → Display Set**
2. Create display sets that show only specific types of elements
3. For example, create a display set showing only structural elements
4. Switch between display sets to focus on different disciplines

### Reduce Solid Complexity

1. For imported solid geometry (STEP, Parasolid), use **Tools → Solid → Simplify**
2. Remove fillets, chamfers, and internal features
3. Replace complex solids with simpler representations for layout work

## Fix 9: Hardware Optimization

- **RAM**: 32GB minimum for files with raster attachments, 64GB for very large infrastructure files
- **GPU**: NVIDIA RTX A-series (professional) with 8GB+ VRAM for 3D files
- **Storage**: NVMe SSD for the design files and raster attachments
- **CPU**: High clock speed for single-threaded operations (MicroStation is largely single-threaded)
- **Display**: Dual monitors for separating design views from tool dialogs

## Fix 10: Keep MicroStation Updated

Bentley's MicroStation 2024 release notes list numerous performance fixes:

1. Check for updates: **Help → Check for Updates**
2. Apply the latest MicroStation update (2024.2 or later)
3. Bentley regularly fixes performance defects in point releases
4. Review the "Defects Resolved" list for each update to see if your specific issue is fixed

## Summary

| Fix | Impact | Difficulty |
|-----|--------|------------|
| Optimize Raster Manager memory | Very high | Easy |
| Use tile-based raster loading | Very high | Easy |
| Limit reference nesting depth | High | Easy |
| Clip reference boundaries | High | Easy |
| Turn off unused levels | High | Easy |
| Disable transparency and anti-aliasing | Medium | Easy |
| Compress design files | High | Easy |
| Use worksets | Medium | Medium |
| Fix file corruption | High | Medium |
| Use section cut views for 3D | High | Easy |
| Keep MicroStation updated | Medium | Easy |

The most impactful fix for files with raster attachments is changing the Raster Manager memory setting to tile-based loading. For files with many references, limiting nesting depth and clipping reference boundaries provides the biggest improvement. Regular file compression should be part of every project's maintenance routine.
