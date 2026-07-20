---
title: "ArchiCAD Layout and Publisher Slow: Book Update, View Recalculation, and PDF Export Optimization"
excerpt: "ArchiCAD's Layout book takes minutes to update and PDF exports freeze during publishing. We cover the auto-update toggle, view simplification, and the publisher set configuration that speed up documentation workflows."
category: "performance"
softwareSlug: "archicad"
keyword: "ArchiCAD layout book slow publisher PDF export update"
slug: "archicad-layout-publisher-slow-pdf-export-fix"
author: "CADGuide Tools Editorial Team"
readTime: "8 min"
date: "2025-06-24"
sources:
  - "https://support.graphisoft.com/hc/en-us/articles/18795669276561-Troubleshooting-speed-issues-in-Archicad"
  - "https://www.graphisoft.com/us/keep-files-running-fast-and-lean"
---

# ArchiCAD Layout and Publisher Slow: Book Update, View Recalculation, and PDF Export Optimization

ArchiCAD's documentation workflow involves the Layout Book (where drawings are placed on sheets) and the Publisher (where layouts are exported to PDF, DWG, or other formats). Both can be extremely slow for large projects. Users report that updating the Layout Book takes 10-30 minutes, and publishing a full drawing set to PDF can take over an hour. Graphisoft's support documentation acknowledges that "even the smallest of projects can get bogged down."

## Understanding Layout Book Performance

### How Layout Book Updates Work

When you update the Layout Book, ArchiCAD:

1. Opens each source view (from the View Map or 3D window)
2. Regenerates the view with current model geometry
3. Calculates 2D projection (for sections, elevations, details)
4. Renders the drawing at the specified scale and pen settings
5. Places the rendered drawing on the layout
6. Repeats for every drawing on every layout

Step 2 and 3 are the bottlenecks. For a section view of a complex building, the 2D projection can take 30+ seconds. With 50 drawings on 20 layouts, the total update time can be 30+ minutes.

### How Publishing Works

When you publish layouts to PDF:

1. ArchiCAD updates each drawing (same process as Layout Book update)
2. Renders each layout at the specified DPI
3. Combines layouts into PDF files
4. Saves the PDFs to the specified location

If drawings are not up to date, publishing includes the update step, doubling the processing time.

## Fix 1: Disable Auto-Update

By default, ArchiCAD automatically updates drawings when the model changes. For large projects, this causes constant lag:

1. Go to **Document → Layout Book → Layout Book Settings**
2. Uncheck **Auto-update drawings**
3. Now drawings only update when you manually trigger an update
4. To manually update: **Document → Layout Book → Update All Drawings**
5. Or right-click a specific drawing → **Update**

### Workflow with Manual Updates

1. Work on the 3D model without waiting for layout updates
2. When ready to check drawings, click **Update All Drawings**
3. Wait for the update to complete (do this at natural break points)
4. Review the updated drawings
5. Make more model changes — drawings stay in their current state until you update again

## Fix 2: Use Manual Drawing Update for Individual Drawings

1. Right-click a drawing on a layout → **Drawing Settings**
2. Set **Update Method** to **Manual**
3. The drawing won't auto-update even if auto-update is globally enabled
4. Use this for drawings that are time-consuming to update (complex 3D views, large sections)
5. Set to **Auto** only for drawings that need to stay current (key plans, schedules)

## Fix 3: Simplify Source Views

The speed of layout updates depends on the complexity of the source views:

### Reduce Visible Layers

1. In the View Map, check each view's layer combination
2. Ensure views show only the layers needed for that drawing type
3. Don't include 3D-only layers in 2D views
4. Don't include furniture layers in structural sections

### Use Simplified Model Display

1. For each source view, go to **View → View Settings**
2. Set **Model View** to **Simplified** (not **Full**)
3. Simplified mode reduces:
   - Curve tessellation
   - Surface hatching
   - Element detail level
4. Use Full only for final presentation drawings

### Reduce Drawing Scale for Working

1. For working drawings, set the scale to 1:200 (or smaller)
2. Smaller scales generate less detail
3. Set to the final scale (e.g., 1:50) only before publishing

## Fix 4: Optimize Publisher Sets

### Create Separate Publisher Sets

1. Go to **File → Publish**
2. Create separate publisher sets:
   - **Working Set**: Only key plans and schedules (fast to publish)
   - **Review Set**: All layouts at medium quality
   - **Final Set**: All layouts at high quality
3. Use the Working Set for quick reviews during design
4. Use the Final Set only for client deliverables

### Set Publishing Quality

1. In the Publisher, select a publisher set
2. Click **Settings**
3. For PDF output:
   - **Resolution**: 150 DPI for working, 300 DPI for final
   - **Quality**: Medium for working, High for final
   - **Compress PDF**: Enable to reduce file size
4. For DWG output:
   - Set the correct DWG version
   - Use **Merge to single file** for faster processing

### Publish Individual Layouts

1. Instead of publishing the entire book, select specific layouts
2. Right-click a layout → **Publish Selected**
3. This is much faster than publishing the full book
4. Use for updating individual sheets during review cycles

## Fix 5: Use Drawing Subsets

1. In the Layout Book, organize layouts into subsets:
   - **Architectural Plans**
   - **Sections**
   - **Elevations**
   - **Details**
   - **Schedules**
2. Publish one subset at a time
3. This is faster than publishing the entire book
4. Subsets can be published in parallel on different machines (using Teamwork)

## Fix 6: Optimize 3D Document Drawings

3D Documents (axonometric views, perspective views placed on layouts) are the slowest to update:

### Reduce 3D Document Complexity

1. Use 3D Cutaway to show only part of the model
2. Use a separate layer combination that hides non-essential elements
3. Set the 3D document to **Wireframe** or **Hidden Line** (not **Shaded**)
4. Shaded 3D documents are 5-10x slower to update than wireframe

### Use Saved 3D Views

1. Save specific 3D views in the View Map
2. Use these saved views as the source for 3D documents
3. Don't use the current 3D window as the source — it may have extra geometry visible

## Fix 7: Optimize Schedules

Schedules (door, window, material schedules) can be slow to update:

### Reduce Schedule Fields

1. Go to **Document → Schedules → Schedule Settings**
2. Review the fields included in each schedule
3. Remove fields that aren't needed in the current phase
4. Add them back only for final documentation

### Use Simplified Schedules for Working

1. Create a simplified schedule with only key fields (e.g., ID, count, type)
2. Use this during design development
3. Create a detailed schedule with all fields for final documentation
4. Switch between them as needed

## Fix 8: Pre-Update Before Publishing

1. Before publishing, manually update all drawings: **Document → Layout Book → Update All Drawings**
2. Wait for the update to complete
3. Then publish — the publisher won't need to update drawings, only render them
4. This is faster than publishing with stale drawings (which triggers both update and render)

## Fix 9: Hardware for Publishing

Publishing is CPU-intensive (rendering) and RAM-intensive (holding all drawings in memory):

- **CPU**: High clock speed for rendering; multi-core helps with parallel publishing
- **RAM**: 32GB for projects with 50+ layouts, 64GB for 100+ layouts
- **Storage**: NVMe SSD for fast PDF writing
- **GPU**: Less important for publishing than for 3D modeling

## Summary

| Fix | Impact | Difficulty |
|-----|--------|------------|
| Disable auto-update | Very high | Easy |
| Manual update for individual drawings | High | Easy |
| Simplify source views | High | Easy |
| Create separate publisher sets | High | Easy |
| Publish individual layouts | High | Easy |
| Use drawing subsets | Medium | Easy |
| Optimize 3D documents | High | Medium |
| Reduce schedule fields | Medium | Easy |
| Pre-update before publishing | High | Easy |

The most effective strategy is disabling auto-update and switching to a manual update workflow. This eliminates the constant background recalculation that slows down modeling work. When ready to publish, update all drawings first, then publish — this separates the two most CPU-intensive operations and prevents them from running simultaneously. For large projects, create separate publisher sets for working vs. final output to avoid publishing at high quality during design development.
