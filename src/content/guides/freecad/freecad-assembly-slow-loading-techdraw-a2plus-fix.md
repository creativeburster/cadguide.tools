---
title: "FreeCAD Assembly Slow Loading: TechDraw Bloat, A2plus Optimization, and File Splitting"
excerpt: "FreeCAD assemblies take minutes to load and every component change triggers long recalculation. I cover the TechDraw page bloat fix, A2plus optimization, and the file splitting strategy that keeps assemblies responsive."
category: "performance"
softwareSlug: "freecad"
keyword: "FreeCAD assembly slow loading A2plus TechDraw performance"
slug: "freecad-assembly-slow-loading-techdraw-a2plus-fix"
author: "CAD IT Admin"
readTime: "9 min"
date: "2025-06-23"
sources:
  - "https://github.com/FreeCAD/FreeCAD/issues/18735"
  - "https://github.com/FreeCAD/FreeCAD/issues/20157"

---

# FreeCAD Assembly Slow Loading: TechDraw Bloat, A2plus Optimization, and File Splitting

A user on the FreeCAD Developer Forum reported that opening an assembly file with about 10 attachments took minutes to load, and any changes or addition of components also took minutes. They were using A2plus v0.4.52. Another user reported that FreeCAD assemblies with converted STEP files were especially slow. The forum investigation revealed an unexpected culprit: TechDraw pages embedded in the assembly file were causing the majority of the slowdown.

## Understanding FreeCAD Assembly Performance

FreeCAD's assembly capabilities come from add-on workbenches — primarily A2plus and the newer Assembly3 and Assembly4 workbenches. Unlike commercial CAD systems with built-in assembly managers, these workbenches store assembly data in the FreeCAD document alongside the geometry. This means every time the document is opened, all data — including TechDraw pages, spreadsheets, and geometry — must be loaded and recalculated.

### The Three Performance Killers

1. **TechDraw page recalculation**: Each TechDraw page recalculates its views when the document opens, which is computationally expensive
2. **STEP-converted components**: Components converted from STEP files carry complex OCCT geometry that takes longer to process
3. **A2plus solver recalculation**: The A2plus constraint solver recalculates all constraints on every load

## Fix 1: Remove TechDraw Pages from Assembly Files

This was the solution identified in the forum thread. A user reported: "I deleted the TechDraw files and saved the file as a revision. Opened it up and it loaded in a few seconds."

### The Problem

TechDraw pages contain 2D projections of 3D geometry. When an assembly file contains TechDraw pages, FreeCAD must:
1. Load all assembly components
2. Recalculate all assembly constraints
3. Recalculate all TechDraw views (which requires projecting 3D geometry to 2D)
4. Render all TechDraw pages

Step 3 is the bottleneck. Each TechDraw view processes the entire 3D model to generate a 2D projection. With 10+ views, this can take minutes.

### The Fix

1. Open the assembly file
2. In the Model tree, find all **TechDraw Pages**
3. Right-click each page → **Delete** (or deactivate)
4. Save the file as a new revision
5. Open the new file — it should load in seconds instead of minutes
6. Create separate files for TechDraw pages:
   - Create a new FreeCAD document
   - Use **File → Import** to bring in the assembly file as a reference
   - Create TechDraw pages in the new document
   - This separates the drawing data from the assembly data

### Alternative: Set Keep Updated to False

If you don't want to delete TechDraw pages:

1. Select each TechDraw page in the Model tree
2. In the **Property** panel, find **Keep Updated**
3. Set it to **false**
4. This prevents recalculation on open
5. Manually update pages when needed: right-click → **Update Page**

## Fix 2: Optimize A2plus Assembly Performance

### Use Simplified Components

1. Don't use full-detail STEP files as assembly components
2. Create simplified versions of each component:
   - Remove fillets, chamfers, and decorative features
   - Replace complex geometry with simple boxes and cylinders
   - Keep only the mating surfaces and critical dimensions
3. Use the simplified versions in the assembly
4. Keep the detailed versions in separate files for drawings and manufacturing

### Reduce Constraint Count

1. Minimize the number of constraints in the assembly
2. Use the minimum constraints needed to fully define each component's position
3. Typically, you need:
   - One constraint to align a face (planar contact)
   - One constraint to align an edge or axis (concentric)
   - One constraint to control rotation (angle or parallel)
4. Avoid redundant constraints — they add solver time without adding information

### Use Rigid Subassemblies

1. Group components into rigid subassemblies
2. Constrain the subassembly as a single unit
3. This reduces the number of constraints the solver needs to process
4. In A2plus, use **Create Rigid Body** to group components

## Fix 3: Use Assembly3 or Assembly4 Instead of A2plus

A2plus is the oldest assembly workbench and has known performance limitations. Newer alternatives:

### Assembly3

1. Install Assembly3 from the Add-on Manager
2. Assembly3 uses a more efficient constraint solver
3. It stores assembly data in a separate container, not mixed with geometry
4. Loading is faster because assembly data is loaded independently

### Assembly4

1. Install Assembly4 from the Add-on Manager
2. Assembly4 uses datum-based attachment instead of a constraint solver
3. Components are positioned by attachment to datum planes/axes
4. No solver recalculation is needed on open — positions are deterministic
5. This is the fastest option for large assemblies

## Fix 4: Split Large Assemblies into Multiple Files

### The Linked File Approach

1. Create each component as a separate FreeCAD file (.FCStd)
2. Create a master assembly file
3. In the master file, use **File → Link to External File** to reference each component
4. FreeCAD loads only the metadata of linked files, not the full geometry
5. Full geometry is loaded on-demand when you select or edit a component

### Benefits

- Faster file opening (only metadata is loaded)
- Lower memory usage (geometry is loaded on-demand)
- Multiple users can work on different components simultaneously
- Component files can be version-controlled independently

### Limitations

- All linked files must be accessible (no broken links)
- Changes to component files require manual update in the assembly
- Some operations may be slower due to on-demand loading

## Fix 5: Disable Auto-Solve

A2plus automatically solves all constraints whenever a component is moved or a constraint is added. For large assemblies, this can cause significant lag:

1. In A2plus, go to **A2plus → Settings**
2. Uncheck **Auto-solve**
3. Now constraints are only solved when you manually click **Solve**
4. This allows you to make multiple changes and solve once, instead of solving after each change

## Fix 6: Use the Expression Engine for Parametric Positions

Instead of using constraints, position components using expressions:

1. Create a spreadsheet with position parameters (X, Y, Z, rotation)
2. In each component's Placement property, use expressions:
   ```
   <<Spreadsheet>>.x_position
   ```
3. Change the spreadsheet values to move components
4. No solver is needed — positions are calculated directly
5. This is the fastest method for repetitive assemblies (e.g., shelving units, truss structures)

## Fix 7: Optimize Component Geometry

### Reduce Tessellation

1. For each component, go to **View → Tessellation**
2. Reduce the tessellation density
3. Lower tessellation = fewer triangles = faster rendering and selection
4. This doesn't affect the actual geometry, only the display

### Use Coarse View

1. In the Model tree, right-click a component → **Toggle Coarse View**
2. Coarse view uses simplified geometry for display
3. Full geometry is used for operations and export
4. This can significantly improve orbiting and selection performance

## Fix 8: Hardware Considerations

- **RAM**: 16GB minimum, 32GB recommended for assemblies with 50+ components
- **CPU**: Single-core performance matters most for FreeCAD (OCCT is largely single-threaded)
- **Storage**: NVMe SSD significantly improves file loading times
- **GPU**: Less important for FreeCAD — it uses software rendering for most operations

## Summary

| Fix | Impact | Difficulty |
|-----|--------|------------|
| Remove TechDraw pages | Very high — eliminates biggest bottleneck | Easy |
| Set Keep Updated to false | High — prevents auto-recalculation | Easy |
| Use Assembly4 instead of A2plus | High — no solver needed | Medium |
| Split into multiple files | High — on-demand loading | Medium |
| Disable auto-solve | Medium — reduces lag during editing | Easy |
| Use expressions for positions | High for repetitive assemblies | Medium |
| Reduce tessellation | Medium — faster rendering | Easy |
| Use coarse view | Medium — faster orbiting | Easy |

The most impactful fix is removing TechDraw pages from assembly files. The forum user confirmed this reduced load time from minutes to seconds. If you need drawings, create them in separate files that reference the assembly. Combined with Assembly4 for constraint-free positioning, this approach keeps even large assemblies responsive.
