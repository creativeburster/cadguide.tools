---
title: "Tekla Structures Drawing Creation Slow: View Generation, Numbering, and Database Optimization"
excerpt: "Tekla drawing creation takes minutes per sheet and numbering hangs on large models. We cover the drawing view optimization, numbering series management, and database repair that speed up the documentation workflow."
category: "performance"
softwareSlug: "tekla-structures"
keyword: "Tekla Structures drawing creation slow numbering database optimization"
slug: "tekla-drawing-creation-slow-numbering-database-fix"
author: "CADGuide Tools Editorial Team"
readTime: "8 min"
date: "2025-06-23"
sources:
  - "https://support.tekla.com/article/tekla-structures-performance-issues"
  - "https://support.tekla.com/doc/tekla-structures/2025/sys_modeling_tips_for_large_models"
  - "https://support.tekla.com/article/performance-issues-when-working-with-complex-items"
---

# Tekla Structures Drawing Creation Slow: View Generation, Numbering, and Database Optimization

Tekla Structures' drawing creation is one of the most time-consuming operations in the steel detailing workflow. Creating a single assembly drawing can take 30 seconds to several minutes for complex assemblies. Numbering — the process of assigning unique marks to each part — can hang for extended periods on large models. Trimble's performance documentation and large model tips address both issues with specific recommendations.

## Fix 1: Optimize Drawing View Settings

### Reduce View Count Per Drawing

1. In **Drawing Properties → View Creation**, review the number of views
2. For assembly drawings, use:
   - **Front view**: Always needed
   - **Top view**: Only if the assembly has features visible from top
   - **Side view**: Only if the assembly has features visible from side
   - **3D view**: Only for complex assemblies
3. Don't create all possible views by default — add specific views only when needed

### Set View Scale Appropriately

1. Use a smaller scale for overview drawings (1:50, 1:100)
2. Smaller scales generate less detail and are faster to create
3. Use larger scales (1:10, 1:20) only for detail drawings
4. Set the default scale in **Drawing Properties → View Properties → Scale**

### Disable Unnecessary View Content

1. In **View Properties → Object Content**, disable:
   - **Bolts**: If not needed in the view
   - **Welds**: If not needed in the view
   - **Reinforcement**: If not needed in the view
   - **Surface treatment**: If not needed in the view
2. Each disabled object type reduces processing time

## Fix 2: Optimize Numbering

Trimble's documentation states: "Do not number the whole model in one go. Numbering all objects in large models may take a considerable amount of time."

### Number by Phase

1. Go to **Numbering → Number Selected Objects**
2. Select parts in one phase and number them
3. Then select parts in the next phase
4. This prevents Tekla from analyzing the entire model for each numbering run

### Use Numbering Series

1. Assign different numbering series to different part types:
   - Main beams: Series 1
   - Columns: Series 2
   - Bracing: Series 3
   - Plates: Series 4
2. Number one series at a time
3. This prevents cross-series renumbering

### Use Modified Part Numbering

1. Go to **Numbering → Numbering Settings**
2. Set **Type of numbering** to **Modified numbering**
3. This only numbers parts that have been modified since the last numbering
4. Much faster than full numbering

### Clear Numbering When Needed

If numbering becomes inconsistent:

1. Go to **Numbering → Clear Numbers**
2. Select **All Parts** or **Selected Parts**
3. Clearing removes all assigned numbers
4. Re-run numbering from scratch
5. Use this only when necessary — it's time-consuming

## Fix 3: Repair the Model Database

Trimble recommends: "If your model file is getting large, repairing the model database can help to reduce the file size considerably and therefore help with memory problems."

1. Close all views: **View → Close All Views**
2. Go to **File → Tools → Repair Model Database**
3. Tekla repairs:
   - Corrupted database entries
   - Orphaned references
   - Invalid geometry data
   - Unused database tables
4. After repair, file size can decrease by 20-50%
5. Drawing creation and numbering are faster with a clean database

### Regular Database Maintenance

- **Weekly**: Repair database for active models
- **Before numbering**: Repair if numbering is slow
- **Before drawing creation**: Repair if drawings are slow to create
- **After importing reference models**: Repair to clean up imported data

## Fix 4: Optimize Drawing Creation Settings

### Use Fast Drawing Creation

1. Go to **File → Settings → Advanced Options**
2. Search for `XS_DRAWING_FAST_CREATION`
3. Set to `TRUE`
4. This skips some non-essential processing during drawing creation
5. Drawings may look slightly different but are created faster

### Disable Automatic Drawing Updates

1. Go to **File → Settings → Advanced Options**
2. Search for `XS_DRAWING_UPDATE_AUTO`
3. Set to `FALSE`
4. Drawings won't auto-update when the model changes
5. Manually update drawings: **Drawing → Update Drawings**

### Pre-Create Drawing Views

1. Create drawing views before creating the drawing
2. Save view settings as a template
3. Use the template when creating new drawings
4. This skips the view calculation step during drawing creation

## Fix 5: Optimize Firm and Project Folders

Trimble notes: "Save Firm and Project folders locally on the hard drive of your computer instead of a network drive. This saves time if network speed is slow."

1. Copy firm and project folders from the network to a local drive
2. Go to **File → Settings → Advanced Options**
3. Search for `XS_FIRM` and `XS_PROJECT`
4. Change the paths to local directories
5. Drawing creation accesses templates and properties from the local drive, which is faster
6. For multi-user mode, synchronize the local folders with the network master

## Fix 6: Use Drawing Types Efficiently

### Use GA Drawings for Overview

1. Create General Arrangement (GA) drawings for overall layouts
2. GA drawings process less detail than assembly drawings
3. Use GA drawings for planning and coordination
4. Create assembly drawings only for fabrication

### Batch Create Assembly Drawings

1. Don't create assembly drawings one at a time
2. Select multiple assemblies: **Drawing → Create Assembly Drawing → From Selected Parts**
3. Tekla creates all selected drawings in one operation
4. This is more efficient than individual creation because it batches the processing

### Use Master Drawing Catalog

1. Create a Master Drawing Catalog with predefined drawing templates
2. Use **Drawing → Create Drawing → From Master Drawing**
3. The template pre-configures all view settings, scales, and object content
4. This skips the calculation of default settings for each drawing

## Fix 7: Optimize Dimensioning in Drawings

Dimensioning is one of the slowest parts of drawing creation:

### Use Automatic Dimensioning Sparingly

1. Don't apply automatic dimensioning to all views
2. Apply automatic dimensioning only to the front view
3. Manually dimension other views as needed

### Use Dimension Lines Instead of Individual Dimensions

1. Use **Dimension Line** tool to create multiple dimensions in one operation
2. This is faster than placing individual dimensions
3. Tekla processes dimension lines more efficiently

## Fix 8: Hardware for Drawing Creation

- **CPU**: High single-core clock speed — drawing creation is largely single-threaded
- **RAM**: 32GB for models with 1000+ drawings, 64GB for very large projects
- **Storage**: NVMe SSD for fast database access during numbering and drawing creation
- **GPU**: Less important for drawing creation than for 3D modeling

## Summary

| Fix | Impact | Difficulty |
|-----|--------|------------|
| Reduce view count per drawing | High | Easy |
| Number by phase and series | Very high | Easy |
| Use modified numbering | High | Easy |
| Repair model database | Very high | Easy |
| Enable fast drawing creation | Medium | Easy |
| Disable auto-drawing updates | High | Easy |
| Local firm/project folders | Medium | Easy |
| Use GA drawings for overview | Medium | Easy |
| Batch create assembly drawings | High | Easy |
| Use master drawing templates | High | Medium |
| Optimize dimensioning | Medium | Easy |

The most impactful combination is: repair the database regularly, number by phase using modified numbering, and reduce the view count per drawing. These three changes can reduce drawing creation time from minutes to seconds. For large projects, using master drawing templates ensures consistent settings and eliminates the per-drawing calculation overhead.
