---
title: "Navisworks Model Aggregation: Multi-Discipline BIM Coordination from Revit, Tekla, and IFC"
excerpt: "A guide to aggregating multi-discipline BIM models in Navisworks covering file format selection, NWC export from source applications, model positioning and alignment, file set management, and performance optimization."
category: "workflow"
softwareSlug: "navisworks"
keyword: "navisworks model aggregation"
slug: "navisworks-model-aggregation-multi-discipline-bim-coordination-revit-tekla-ifc"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://help.autodesk.com/view/NAV/2024/ENU/"
  - "https://www.autodesk.com/products/navisworks/overview"
---

# Navisworks Model Aggregation: Multi-Discipline BIM Coordination from Revit, Tekla, and IFC

Model aggregation is the foundation of Navisworks coordination. Before you can run clash detection, create walkthroughs, or generate 4D simulations, you need to bring all discipline models into a single Navisworks environment with correct positioning and manageable file sizes. This guide covers the complete aggregation workflow.

## File Format Strategy

### Format Comparison

| Format | Source | Load Speed | Fidelity | File Size | Recommendation |
|--------|--------|-----------|----------|-----------|---------------|
| NWD | Navisworks native | Fastest | Full | Small | Best for published models |
| NWC | Any CAD via exporter | Fast | Full | Small | Best for regular updates |
| RVT | Revit | Medium | Full | N/A | Good for direct Revit models |
| IFC | Any BIM tool | Slow | Good | Large | Use when NWC not available |
| DWG | AutoCAD | Medium | 2D/3D | Medium | Use for 2D reference |
| DGN | MicroStation | Medium | Full | Medium | Use for Bentley models |
| FBX | Any 3D tool | Fast | Visual only | Small | Use for visualization only |

### Recommended Workflow

1. **Export to NWC from each source application** — fastest, smallest, most reliable
2. **Append NWC files into Navisworks** — build the federated model
3. **Save as NWD** — for distribution to reviewers who don't have source applications
4. **Refresh NWC files** when source models are updated

## NWC Export from Source Applications

### Revit to NWC

1. In Revit: File > Export > NWC
2. Set:
   - **Views**: Select the 3D view to export (use a coordination view, not a detail view)
   - **Convert element IDs**: Yes (enables element identification in Navisworks)
   - **Convert linked models**: Yes if the Revit model contains links
   - **Coordinates**: Shared coordinates (critical for multi-model alignment)
3. The NWC file is created in the specified location

### AutoCAD to NWC

1. In AutoCAD: Navisworks ribbon > Export to NWC
2. Set:
   - **Selection**: All or selected objects
   - **Coordinates**: Use WCS for correct positioning
3. The NWC file includes 3D solids and surfaces

### Tekla to NWC

1. In Tekla: File > Export > Navisworks
2. Set:
   - **Include rebars**: Optional (increases file size significantly)
   - **Include bolts**: Yes
   - **Coordinates**: Use model origin
3. Tekla exports directly to NWC format

### ArchiCAD to NWC

1. In ArchiCAD: File > Save As > NWC (requires Navisworks exporter plugin)
2. Set:
   - **3D view**: Use the 3D window (not a 2D floor plan)
   - **All stories**: Yes (export the full building)
3. The NWC file is created

### IFC to NWC (Fallback)

If no NWC exporter is available:
1. Export IFC 2x3 from the source application
2. In Navisworks: Append the IFC file directly
3. Navisworks converts IFC to internal format on load
4. Note: IFC files load slower than NWC and may lose some properties

## Model Positioning and Alignment

### Shared Coordinates

All models must use the same coordinate system:

1. **Establish a project base point** — agree on coordinates with all teams
2. **In Revit**: Manage > Coordinates > Acquire Coordinates from a survey DWG
3. **In Tekla**: Set model base point to match project coordinates
4. **In ArchiCAD**: Set survey point to match project coordinates
5. **In Allplan**: Set project origin to match project coordinates

### Verifying Alignment

1. Append all models into Navisworks
2. Switch to a top-down (plan) view
3. Check that building outlines align across all discipline models
4. Switch to an isometric view
5. Check that floor elevations match across models
6. If models are misaligned:
   - Check the source application's coordinate settings
   - Use Navisworks > Transform > Move to manually adjust (last resort)
   - Fix the issue in the source application (preferred)

### Grid Alignment

1. Verify that grid lines align across all models
2. Grids are the primary reference for multi-discipline coordination
3. If grids don't align, structural and MEP models will have systematic offsets

## File Set Management

### Creating a File Set

1. In Navisworks: Home > File Options > File Sets
2. A File Set (.nwf) references multiple NWC/NWD files without embedding them
3. Advantages of File Sets:
   - Small file size (only references, not geometry)
   - Auto-refresh when source NWC files are updated
   - Multiple users can reference the same NWC files

### Saving as NWD

1. File > Save As NWD
2. NWD embeds all geometry into a single file
3. Advantages of NWD:
   - Self-contained (no external dependencies)
   - Can be opened by Navisworks Freedom (free viewer)
   - Suitable for distribution to non-CAD users
4. Disadvantages:
   - Large file size
   - Not auto-refreshed when source models change

### Refreshing Models

When a source model is updated:
1. Export a new NWC file from the source application
2. Overwrite the existing NWC file (same name and location)
3. In Navisworks: Home > Refresh > select files to refresh
4. Navisworks reloads the updated NWC file
5. Clash detection results are updated automatically

## Performance Optimization

### Model File Size Management

1. **Limit detail**: Export only the 3D coordination view, not all views
2. **Exclude non-3D elements**: Don't export 2D annotations, text, dimensions
3. **Simplify geometry**: In Revit, use "Coarse" detail level for export
4. **Compress NWC**: The NWC exporter compresses geometry by default
5. **Split large models**: Export by floor or building section if files exceed 200MB

### Navisworks Performance Settings

1. Home > Options > Display
2. Set:
   - **FPS counter**: On (monitor performance)
   - **Anti-aliasing**: Off during navigation, On for screenshots
   - **Backface cull**: On (don't render hidden faces)
   - **Maximum texture size**: 1024 (balance quality and memory)

### Level of Detail (LOD) Management

1. Use the Selection Tree to hide unnecessary elements
2. Create Saved Viewpoints with different visibility settings:
   - "Structure only" — hide MEP and architectural
   - "MEP only" — hide structure and architectural
   - "All disciplines" — everything visible
3. Hide furniture, small fittings, and non-coordination elements during clash detection

## Selection Sets and Search

### Creating Selection Sets

1. Select elements in the model
2. Right-click in the Selection Sets panel > Save Selection Set
3. Name the set (e.g., "Level 1 - MEP", "Structural Columns")
4. Selection Sets persist in the NWF/NWD file

### Find Items (Search)

1. Home > Find Items
2. Search by properties:
   - **Category**: e.g., Walls, Pipes, Ducts
   - **Property**: e.g., Fire Rating, Material, Level
   - **Condition**: equals, contains, greater than, less than
3. Example: Find all walls with Fire Rating = "2HR"
4. Save search results as a Selection Set

### Using Selection Sets for Clash Detection

1. In Clash Detective, use Selection Sets as Selection A and B
2. Example: "Structural Columns" vs "MEP Pipes" — test only these elements
3. This narrows clash tests and reduces processing time

## Best Practices for Model Aggregation

1. **Agree on coordinates before modeling starts** — fixing alignment later is painful
2. **Use NWC format** — faster, smaller, more reliable than IFC or native formats
3. **Export from a dedicated 3D coordination view** — not from a working view with 2D elements
4. **Name files consistently** — `Discipline_Project_Revision_Date.nwc`
5. **Use File Sets (.nwf) for working** — auto-refresh keeps models current
6. **Publish NWD for distribution** — self-contained for reviewers
7. **Refresh weekly** — keep the federated model in sync with source models
8. **Create Selection Sets by discipline and floor** — essential for efficient clash detection
9. **Monitor file sizes** — if a model exceeds 300MB, consider splitting by floor
10. **Document the aggregation process** — so any team member can rebuild the federated model

## Conclusion

Model aggregation is the critical first step in Navisworks coordination. By using NWC exports from each source application, establishing shared coordinates before modeling begins, managing files through NWF File Sets with auto-refresh, and optimizing performance through LOD management and Selection Sets, you create a reliable federated model that serves as the single source of truth for coordination. The key to success is standardization — consistent file naming, coordinate systems, and export settings ensure that the aggregation process is repeatable and reliable throughout the project lifecycle.
