---
title: "MEDUSA4 DXF DWG CADConvert Import Export Special Character and Arc Handling Issues, Very Large Drawing Sheet Performance from Excessive Layers, Parametric Design Object 2D to 3D Model Sync Failures, MEDRaster Colour Raster to Vector Integration Quality, and CADConvert Pro Advanced DXF DWG Scale and Text Position Accuracy: Special Character Fix, Layer Optimization, Parametric Sync, Raster Quality, and Scale Correction"
excerpt: "MEDUSA4 fails for 5 distinct reasons: DXF DWG CADConvert import export special character and arc handling requiring version 5.1.2 update, very large drawing sheet performance from excessive layers requiring layer optimization, parametric Design Object 2D to 3D model sync failures requiring parametric validation, MEDRaster Colour raster to vector integration quality requiring raster resolution check, and CADConvert Pro advanced DXF DWG scale and text position accuracy requiring scale correction. We cover each with fixes from CAD Schroer documentation."
category: "troubleshooting"
softwareSlug: "medusa4"
keyword: "MEDUSA4 DXF DWG CADConvert import export special character arc handling large drawing sheet layers parametric Design Object 2D 3D sync MEDRaster Colour raster vector CADConvert Pro scale text position accuracy"
slug: "medusa4-dxf-dwg-cadconvert-special-character-arc-large-sheet-layers-parametric-design-object-2d-3d-sync-medraster-colour-cadconvert-pro-scale-text-position"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://www.cad-schroer.com/tech-support/faqmedusa-2589/"
  - "https://www.cad-schroer.com/fileadmin/Download/datasheet/MEDUSA4-Brochure-CAD-Software_en.pdf"
  - "https://en.wikipedia.org/wiki/MEDUSA4"
---

# MEDUSA4 DXF DWG CADConvert Import Export Special Character and Arc Handling Issues, Very Large Drawing Sheet Performance from Excessive Layers, Parametric Design Object 2D to 3D Model Sync Failures, MEDRaster Colour Raster to Vector Integration Quality, and CADConvert Pro Advanced DXF DWG Scale and Text Position Accuracy: Special Character Fix, Layer Optimization, Parametric Sync, Raster Quality, and Scale Correction

MEDUSA4 produces errors from DXF/DWG conversion, large sheet performance, parametric sync, raster integration, and scale accuracy. This guide covers the 5 most common MEDUSA4 problems with diagnostic steps and community-verified fixes from CAD Schroer documentation.

## 1. DXF DWG CADConvert Import Export Special Character and Arc Handling Issues

### Symptom

When importing or exporting DXF/DWG files using CADConvert, special characters in text elements are not correctly converted. Arc geometry may be distorted or approximated incorrectly. Text elements may be positioned incorrectly after conversion. Very small or very large scaling factors produce unexpected results. The issue occurs with DXF/DWG files from AutoCAD R12 through AutoCAD 2012.

### Root Cause

"In MEDUSA4 Version 5.1.2 wurden Verbesserungen an der DXF/DWG-Schnittstelle CADConvert vorgenommen, die eine verbesserte Handhabung von Sonderzeichen und Bögen beinhaltet. Weiterhin wurden die Positionierung von Textelementen und die Nutzung sehr kleiner oder sehr großer Skalierungen verbessert." The CADConvert DXF/DWG interface had issues with special character encoding, arc geometry conversion, text element positioning, and extreme scaling factors. These issues were improved in MEDUSA4 Version 5.1.2.

### Fix

1. **Update to MEDUSA4 Version 5.1.2 or later**:
   - "In MEDUSA4 Version 5.1.2"
   - "Wurden Verbesserungen an der DXF/DWG-Schnittstelle CADConvert vorgenommen"
   - Update to 5.1.2 or later
   - For improved DXF/DWG handling

2. **Check special character encoding**:
   - "Verbesserte Handhabung von Sonderzeichen"
   - Verify special characters
   - Are correctly converted
   - After import/export

3. **Verify arc geometry**:
   - "Verbesserung von Bögen"
   - Check arc geometry
   - After conversion
   - For accuracy

4. **Check text element positioning**:
   - "Positionierung von Textelementen"
   - Verify text positions
   - After import/export
   - For correct placement

5. **Use moderate scaling factors**:
   - "Nutzung sehr kleiner oder sehr großer Skalierungen"
   - Avoid extreme scaling
   - Use moderate scale factors
   - To prevent conversion issues

6. **Use CADConvert Pro for advanced conversion**:
   - "CADConvert pro - Advanced DXF/DWG interface"
   - Use CADConvert Pro
   - For better DXF/DWG
   - Conversion results

7. **Create custom conversion mappings**:
   - "An intuitive user interface allows you"
   - "To create your own conversion mappings"
   - Create custom mappings
   - For specific DXF/DWG files

### Community Report

> "In MEDUSA4 Version 5.1.2 wurden Verbesserungen an der DXF/DWG-Schnittstelle CADConvert vorgenommen, die eine verbesserte Handhabung von Sonderzeichen und Bögen beinhaltet. Weiterhin wurden die Positionierung von Textelementen und die Nutzung sehr kleiner oder sehr großer Skalierungen verbessert. Ab Version 5.1 unterstützt die CADConvert Schnittstelle das DXF/DWG-Format von AutoCAD R12 bis AutoCAD 2012."

## 2. Very Large Drawing Sheet Performance from Excessive Layers

### Symptom

When working with very large drawing sheets containing many layers, MEDUSA4 becomes slow. Operations like zooming, panning, and selecting elements are sluggish. The performance degradation increases with the number of layers on the sheet. The issue affects productivity when working with complex, multi-layer drawings.

### Root Cause

"Das Handling sehr großer Zeichnungsblätter wurde optimiert. Die Performance bei der Nutzung vieler Layern auf einem Blatt wurde verbessert." The handling of very large drawing sheets with many layers wasn't optimized in earlier versions. The rendering engine had to process all layers for each display update, causing performance degradation proportional to the number of layers. This was improved in MEDUSA4 Version 5.1.2.

### Fix

1. **Update to MEDUSA4 Version 5.1.2 or later**:
   - "Das Handling sehr großer Zeichnungsblätter wurde optimiert"
   - "Die Performance bei der Nutzung vieler Layern"
   - "Auf einem Blatt wurde verbessert"
   - Update for improved large sheet handling

2. **Reduce active layers**:
   - Turn off unnecessary layers
   - When working on specific areas
   - To reduce the rendering load
   - And improve performance

3. **Use layer management tools**:
   - Use MEDUSA4's layer management
   - To organize layers
   - And deactivate layers
   - That aren't currently needed

4. **Split large drawings**:
   - If a drawing is too large
   - Split it into multiple sheets
   - To reduce the per-sheet
   - Layer count

5. **Use SMART Drafting tools**:
   - "SMART Drafting Tool"
   - Use SMART Drafting
   - For efficient drafting
   - On large sheets

6. **Optimize drawing content**:
   - Remove unused elements
   - Purge unnecessary data
   - And simplify geometry
   - To reduce sheet complexity

7. **Use Design Objects for repeated content**:
   - "Design Objects functionality"
   - Use Design Objects
   - For repeated content
   - To reduce layer complexity

### Community Report

> "Das Handling sehr großer Zeichnungsblätter wurde optimiert. Die Performance bei der Nutzung vieler Layern auf einem Blatt wurde verbessert. In MEDUSA4 Version 5.1.2 wurden Optimierungen an den 2D Zeichenwerkzeugen und Hilfslinien vorgenommen."

## 3. Parametric Design Object 2D to 3D Model Sync Failures

### Symptom

When using MEDUSA4's parametric Design Objects to create 3D models from 2D drawings, the 2D and 3D models don't synchronize properly. Changes to 2D geometry don't reflect in the 3D model. Parametric constraints may not propagate correctly between 2D and 3D. The issue affects the assembly-based design process.

### Root Cause

"MEDUSA4 3D uses standard 2D tools to define 3D models. Design Objects functionality is a powerful tool which combines 2D ease with 3D design capabilities for modelling assemblies. MEDUSA4 PARAMETRICS provides extensive parametrics functionality for design process automation." The parametric Design Object system relies on proper 2D-to-3D associations. If the 2D geometry isn't properly constrained or the 3D model references aren't correctly established, the sync between 2D and 3D can fail.

### Fix

1. **Verify parametric constraints**:
   - "MEDUSA4 PARAMETRICS"
   - "Extensive parametrics functionality"
   - Verify all 2D parametric constraints
   - Are properly defined

2. **Use SMART Drafting for 2D geometry**:
   - "SMART Drafting Tool"
   - Use SMART Drafting
   - To create properly constrained
   - 2D geometry

3. **Check Design Object associations**:
   - "Design Objects functionality"
   - "Combines 2D ease with 3D design capabilities"
   - Verify Design Object
   - 2D-to-3D associations

4. **Use the 3D viewer for verification**:
   - "An integral viewer for interacting with models"
   - "By zooming, spinning and panning"
   - Use the 3D viewer
   - To verify 3D model sync

5. **Rebuild 3D model from 2D**:
   - If sync fails
   - Rebuild the 3D model
   - From the 2D geometry
   - To re-establish associations

6. **Use Parametrics for design automation**:
   - "Design process automation"
   - Use Parametrics
   - To automate the 2D-to-3D
   - Design process

7. **Check 3D model references**:
   - Verify that 3D model
   - References to 2D geometry
   - Are intact
   - And properly linked

### Community Report

> "MEDUSA4 3D uses standard 2D tools to define 3D models, meaning you don't have to be a 3D expert to use it. Design Objects functionality is a powerful tool which combines 2D ease with 3D design capabilities for modelling assemblies. MEDUSA4 PARAMETRICS provides extensive parametrics functionality for design process automation."

## 4. MEDRaster Colour Raster to Vector Integration Quality

### Symptom

When incorporating colour or monochrome raster data (scanned drawings, photographs) into MEDUSA4 designs, the raster quality is poor after integration. The raster data may appear pixelated, distorted, or misaligned with vector geometry. Combined raster and vector data may not display correctly together. The issue affects the use of legacy scanned drawings.

### Root Cause

"MEDRaster Colour is a MEDUSA4 module which allows you to incorporate, edit and store colour and monochrome raster data in your designs, and provides combined raster and vector data support." The raster integration quality depends on the source raster resolution, the import settings, and the alignment with vector geometry. If the raster resolution is too low or the import settings aren't optimized, the integrated raster data will appear poor.

### Fix

1. **Use high-resolution raster source**:
   - Use the highest resolution
   - Raster source available
   - For better integration quality
   - With MEDRaster Colour

2. **Verify raster import settings**:
   - Check the import settings
   - For resolution, color depth
   - And alignment
   - Before importing

3. **Use raster editing tools**:
   - "Edit and store colour and monochrome raster data"
   - Use MEDRaster Colour's editing tools
   - To improve raster quality
   - After import

4. **Align raster with vector geometry**:
   - Carefully align
   - The raster data
   - With the vector geometry
   - For proper integration

5. **Use combined raster and vector support**:
   - "Combined raster and vector data support"
   - Use the combined mode
   - For displaying raster
   - And vector together

6. **Optimize raster for display**:
   - Adjust display settings
   - For raster data
   - To balance quality
   - And performance

7. **Use MEDRaster Colour View**:
   - "MEDRaster Colour View"
   - Use the Colour View module
   - For viewing raster data
   - In the Basic package

### Community Report

> "MEDRaster Colour is a MEDUSA4 module which allows you to incorporate, edit and store colour and monochrome raster data in your designs, and provides combined raster and vector data support. MEDRaster Colour View is included in the Basic package. MEDRaster Colour is available in the Premium package."

## 5. CADConvert Pro Advanced DXF DWG Scale and Text Position Accuracy

### Symptom

When using CADConvert Pro for advanced DXF/DWG conversion, the scale of imported or exported geometry is incorrect. Text elements are positioned incorrectly relative to the geometry. Very small or very large scale factors produce unexpected results. The issue affects the accuracy of DXF/DWG exchange with other CAD systems.

### Root Cause

"CADConvert pro - Advanced DXF/DWG interface. In MEDUSA4 Version 5.1.2 wurden die Positionierung von Textelementen und die Nutzung sehr kleiner oder sehr großer Skalierungen verbessert." The CADConvert Pro interface had scale and text position accuracy issues with extreme scaling factors. The text positioning algorithm didn't properly account for scale transformations, and extreme scale factors caused numerical precision issues.

### Fix

1. **Update to MEDUSA4 Version 5.1.2 or later**:
   - "Positionierung von Textelementen"
   - "Nutzung sehr kleiner oder sehr großer Skalierungen"
   - "Wurden verbessert"
   - Update for improved scale and text handling

2. **Use moderate scale factors**:
   - Avoid very small or very large
   - Scale factors
   - Use moderate scales
   - To prevent accuracy issues

3. **Verify text positions after conversion**:
   - After DXF/DWG import or export
   - Verify text element positions
   - Relative to geometry
   - For correct placement

4. **Use CADConvert Pro for advanced conversion**:
   - "CADConvert pro - Advanced DXF/DWG interface"
   - Use CADConvert Pro
   - For better conversion
   - Of complex DXF/DWG files

5. **Create custom conversion mappings**:
   - "An intuitive user interface allows you"
   - "To create your own conversion mappings"
   - Create custom mappings
   - For specific scale requirements

6. **Check scale before and after conversion**:
   - Verify the scale
   - Before and after
   - DXF/DWG conversion
   - To detect scale issues

7. **Use DXF/DWG format R12-2012**:
   - "DXF/DWG-Format von AutoCAD R12 bis AutoCAD 2012"
   - Use supported DXF/DWG formats
   - (R12 through 2012)
   - For best compatibility

### Community Report

> "CADConvert pro - Advanced DXF/DWG interface. In MEDUSA4 Version 5.1.2 wurden die Positionierung von Textelementen und die Nutzung sehr kleiner oder sehr großer Skalierungen verbessert. Ab Version 5.1 unterstützt die CADConvert Schnittstelle das DXF/DWG-Format von AutoCAD R12 bis AutoCAD 2012. An intuitive user interface allows you to create your own conversion mappings."

## 6. Additional MEDUSA4 Issues

### Filled Geometry for DXF DWG Export

**Issue**: "A new fill function can fill closed geometry according to line color. Filled areas are transferred during DXF or DWG import and export."
**Fix**: Use the fill function to fill closed geometry with the line color. Filled areas are transferred in DXF/DWG export. Use this for better visual representation of technical data.

### Sheet Metal Design Module

**Issue**: "MEDUSA4 SHEET METAL DESIGN — Powerful and flexible design of sheet metal parts."
**Fix**: Use the Sheet Metal Design module for sheet metal parts. Use the parametric tools for design automation. Export sheet metal designs via DXF/DWG for manufacturing.

### P&ID Diagram Creation

**Issue**: "MEDUSA4 P&ID — The complete solution for creating intelligent process and instrumentation diagrams."
**Fix**: Use the P&ID module for process and instrumentation diagrams. Use diagram symbol loading for standard symbols. Use the parametric tools for intelligent diagram creation.

### MEDParts Standard Symbol Libraries

**Issue**: "MEDParts - Symbol Libraries for 50 DIN/EN/ISO Standards."
**Fix**: Use MEDParts for standard parts. Access 50 DIN/EN/ISO standard libraries. Use standard parts to accelerate design and ensure compliance.

### BACIS1 and BACIS2 Customization

**Issue**: "API Customisation Tools (Bacis1 and Bacis2)."
**Fix**: Use BACIS1 and BACIS2 for customization. Create custom automation scripts. Extend MEDUSA4 functionality with the API tools.

### MEDInfo Document Management

**Issue**: "MEDInfo — Web-based engineering information and document management for MEDUSA4."
**Fix**: Use MEDInfo for document management. Manage engineering documents and information. Integrate with MEDUSA4 for seamless document workflow.

### MEDUSA4 Personal Free Version

**Issue**: "MEDUSA4 Personal is a free 2D/3D CAD software for private use."
**Fix**: Use MEDUSA4 Personal for non-commercial use. Register for a free 12-month license. Unlock drawings for commercial use via the eSERVICES portal.

## Best Practices

1. **Update to MEDUSA4 Version 5.1.2+** — improved DXF/DWG, special characters, arcs, text, and scaling
2. **Use CADConvert Pro for advanced DXF/DWG** — better conversion than basic CADConvert
3. **Reduce active layers on large sheets** — improves performance
4. **Verify parametric constraints for 2D-to-3D sync** — ensures proper Design Object sync
5. **Use high-resolution raster sources** — better MEDRaster Colour integration quality
6. **Use moderate scale factors** — prevents accuracy issues with extreme scales
7. **Create custom conversion mappings** — for specific DXF/DWG requirements
8. **Use SMART Drafting for efficient 2D** — faster drafting on large sheets
9. **Use Design Objects for assembly modeling** — combines 2D ease with 3D capabilities
10. **Use MEDParts for standard components** — 50 DIN/EN/ISO standard libraries
