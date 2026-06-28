---
title: "Tekla Structures Complex Items Performance: Shape Cleaner, DirectX, and Dashed Hidden Lines"
excerpt: "Tekla Structures lags when working with complex items imported from DWG, SKP, or IFC files. I cover the Shape Cleaner extension, DirectX rendering setup, and the XS_USE_DASHED_HIDDEN_LINES setting that fix item performance."
category: "performance"
softwareSlug: "tekla-structures"
keyword: "Tekla Structures complex items performance shape cleaner DirectX"
slug: "tekla-complex-items-performance-shape-cleaner-directx"
author: "CAD IT Admin"
readTime: "8 min"
date: "2025-06-22"
sources:
  - "https://support.tekla.com/article/performance-issues-when-working-with-complex-items"
  - "https://support.tekla.com/article/tekla-structures-performance-issues"
  - "https://support.tekla.com/fix/tekla-structures/ttsd-59522"
---

# Tekla Structures Complex Items Performance: Shape Cleaner, DirectX, and Dashed Hidden Lines

Trimble's support documentation addresses complex item performance directly: "Performance of items is directly related to the complexity of the shapes the items use. The main driving factor to increase complexity is a high number of faces a shape has. Items with high complexity can affect performance in many ways: opening of models, zooming and panning, inserting, copying and moving items, snapping to item geometries, item previews, creation and opening of drawings, interaction inside the drawings."

Complex items are typically imported geometry — architectural components from DWG files, equipment models from SKP (SketchUp), or building elements from IFC files. These imported shapes can have thousands or tens of thousands of faces, and when used in large quantities, they bring Tekla to a standstill.

## Fix 1: Re-import Shapes Using Tekla 2018i or Newer

Trimble's first recommendation: "Make sure you re-import all shapes using Tekla Structures 2018i or a newer version. The newer the better."

### Why Re-Import Is Necessary

Older versions of Tekla imported shapes in a format that was not optimized for performance. Starting with Tekla 2018i, the import function was improved to:
- Create lighter items with fewer faces
- Generate smaller `.tez` files (found in the `ShapeGeometries` model folder)
- Optimize the shape data structure for faster rendering

### Re-Import Process

1. Locate the original geometry files (`.dwg`, `.skp`, `.ifc`, etc.)
2. Don't re-import from `.tsc` files — these are just zipped versions of the old shape format
3. In Tekla, go to **Applications & Components → Items**
4. Delete the existing item
5. Re-import the original geometry file
6. The new import creates an optimized shape

## Fix 2: Use the Shape Cleaner Extension

If you don't have the original geometry files, use the Shape Cleaner extension:

1. Open the **Applications & Components** catalog
2. Search for **Shape Cleaner**
3. The Shape Cleaner is available in Tekla Structures 2019 and newer
4. Run the Shape Cleaner on all items in the model
5. The extension mimics the re-import process, optimizing existing shapes
6. It converts old shape formats to the new optimized format

### Running Shape Cleaner

1. Launch the Shape Cleaner extension
2. Select all items or specific items to clean
3. Click **Clean**
4. The process may take several minutes for models with many items
5. After completion, save and reopen the model
6. Check if performance has improved

## Fix 3: Enable DirectX Rendering

Trimble recommends: "On the modeling side, turn on DirectX rendering and re-open the views. DirectX rendering has been optimized to work with complex geometry."

### Enable DirectX

1. Go to **File → Settings → Advanced Options**
2. Search for `XS_USE_DIRECTX`
3. Set the value to `TRUE`
4. Restart Tekla Structures
5. Reopen all views — they now use DirectX rendering

### If DirectX Makes Performance Worse

Trimble notes: "If using DirectX rendering makes performance worse, you either do not have a powerful enough graphics card, or you do, but you have not instructed the graphics card to be used with Tekla Structures."

### Configure NVIDIA GPU

1. Open **NVIDIA Control Panel**
2. Go to **Manage 3D Settings → Program Settings**
3. Add `TeklaStructures.exe` (typically at `C:\Program Files\Trimble\Tekla Structures\2025\bin\TeklaStructures.exe`)
4. Set **Preferred graphics processor** to **High-performance NVIDIA processor**
5. Click **Apply**
6. Restart Tekla Structures

### Configure AMD GPU

1. Open **AMD Adrenalin Software**
2. Go to **Graphics → Applications**
3. Add `TeklaStructures.exe`
4. Set **Graphics Profile** to **High Performance**
5. Restart Tekla Structures

### Check Which GPU Tekla Is Using

1. In Tekla, go to **Help → About Tekla Structures**
2. Look for the graphics card information
3. If it shows an integrated GPU (Intel UHD, AMD Radeon Graphics), the discrete GPU is not being used
4. Follow the NVIDIA or AMD configuration steps above

## Fix 4: Adjust XS_USE_DASHED_HIDDEN_LINES

Trimble's guidance: "Check what is your setting for XS_USE_DASHED_HIDDEN_LINES from advanced option. Setting this to TRUE generally improves performance, but in some special cases such as using certain very complex shapes, it might in fact decrease performance significantly."

1. Go to **File → Settings → Advanced Options**
2. Search for `XS_USE_DASHED_HIDDEN_LINES`
3. If set to `TRUE` and you have complex items:
   - Change to `FALSE`
   - Restart Tekla Structures
   - Test performance
4. If set to `FALSE` and you don't have complex items:
   - Change to `TRUE`
   - Restart Tekla Structures
   - Test performance
5. The optimal setting depends on your specific model content

## Fix 5: Reduce Item Face Count

If Shape Cleaner doesn't sufficiently optimize the items:

### Simplify Source Geometry

1. Open the original geometry file in its source application (AutoCAD, SketchUp, etc.)
2. Reduce the polygon/face count:
   - In SketchUp: Use **Extensions → Simplify**
   - In AutoCAD: Use **Modify → Simplify**
   - In Rhino: Use **Mesh → Reduce**
3. Re-import the simplified geometry into Tekla

### Replace Complex Items with Simple Representations

1. Create a simple Tekla part (beam, plate, polybeam) that represents the item's envelope
2. Use this simple part for modeling and detailing
3. Keep the complex item in a separate reference model for visualization only
4. This is the most effective approach for items used in large quantities

## Fix 6: Optimize Drawing Performance with Complex Items

Trimble notes that complex items also affect "creation and opening of drawings, interaction inside the drawings."

### Use Drawing-Level Item Simplification

1. In the drawing properties, go to **Object Representation**
2. Set complex items to **Outline** or **Bounding Box** representation
3. This reduces the geometry processed for drawing views
4. Use **Exact** representation only for final drawing output

### Exclude Items from Drawings

1. In the drawing properties, use **Object Group** filters
2. Exclude complex items that aren't needed in the drawing
3. For example, exclude architectural items from structural drawings
4. This reduces drawing processing time significantly

## Fix 7: Use Item Prototypes

1. Create an optimized item and save it as a prototype
2. Use the prototype for all instances of that item type
3. All instances share the same optimized shape definition
4. This is more memory-efficient than having multiple shape definitions for the same item

## Fix 8: Monitor Shape Database Size

1. Check the `ShapeGeometries` folder in the model directory
2. This folder contains `.tez` files for all item shapes
3. If the folder is very large (over 1GB), it indicates many complex shapes
4. Run Shape Cleaner to optimize the shape database
5. Delete unused shapes: **File → Tools → Delete Unused Shapes**

## Summary

| Fix | Impact | Difficulty |
|-----|--------|------------|
| Re-import shapes with Tekla 2018i+ | Very high | Medium |
| Run Shape Cleaner extension | Very high | Easy |
| Enable DirectX rendering | High | Easy |
| Configure discrete GPU | High | Medium |
| Adjust XS_USE_DASHED_HIDDEN_LINES | Medium | Easy |
| Simplify source geometry | Very high | Medium |
| Replace with simple parts | Very high | Medium |
| Use drawing-level simplification | High | Easy |
| Use item prototypes | Medium | Easy |
| Monitor shape database | Medium | Easy |

The most effective fix is re-importing shapes using the original geometry files in a recent Tekla version. If original files aren't available, the Shape Cleaner extension is the next best option. Combined with DirectX rendering and proper GPU configuration, these fixes can reduce item-related performance issues by 80%+. For items used in large quantities (100+ instances), replacing them with simple Tekla parts is the ultimate solution — it eliminates the complex shape processing entirely.
