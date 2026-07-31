---
title: "MEDUSA4 Properties Window and 3D Export Errors: Properties Window Not Displayed from Too Many Elements Causing Element Positioning Problems Requiring Element Reduction, STEP Export Not Available in MEDUSA4 Personal Requiring Advanced Package Upgrade, 3D Model Export to FE Software Requires STEP Interface Module, 2D Sheet Metal and Parametrics Available in Personal but 3D Limited, and Element Insertion Causes Massive Positioning Problems Requiring Drawing Simplification"
excerpt: "MEDUSA4 fails for 5 distinct reasons: properties window not displayed from too many elements causing element positioning problems requiring element reduction, STEP export not available in MEDUSA4 Personal requiring Advanced package upgrade, 3D model export to FE software requires STEP interface module, 2D sheet metal and parametrics available in Personal but 3D limited, and element insertion causes massive positioning problems requiring drawing simplification. We cover each with fixes from CAD.de Forum and CAD Schroer docs."
category: "properties-and-export-errors"
softwareSlug: "medusa"
keyword: "MEDUSA4 properties window not displayed too many elements element positioning problems STEP export not available Personal Advanced package upgrade 3D model export FE software STEP interface module 2D sheet metal parametrics Personal 3D limited element insertion positioning problems drawing simplification"
slug: "medusa4-properties-window-3d-export-errors-properties-not-displayed-too-many-elements-positioning-step-export-personal-advanced-upgrade-3d-model-fe-software-step-interface-sheet-metal-parametrics-element-insertion-drawing-simplification"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-07-31"
sources:
  - "https://ww3.cad.de/foren/ubb/Forum16/HTML/000150.shtml"
  - "https://ww3.cad.de/foren/ubb/Forum16/HTML/000159.shtml"
  - "https://en.wikipedia.org/wiki/MEDUSA4"
---

# MEDUSA4 Properties Window and 3D Export Errors: Properties Window Not Displayed from Too Many Elements Causing Element Positioning Problems Requiring Element Reduction, STEP Export Not Available in MEDUSA4 Personal Requiring Advanced Package Upgrade, 3D Model Export to FE Software Requires STEP Interface Module, 2D Sheet Metal and Parametrics Available in Personal but 3D Limited, and Element Insertion Causes Massive Positioning Problems Requiring Drawing Simplification

MEDUSA4's element management, STEP export, 3D model exchange, package limitations, and drawing complexity produce errors from element overload, module licensing, and interface availability. This guide covers the 5 most common MEDUSA4 problems with diagnostic steps and community-verified fixes from CAD.de Forum and CAD Schroer docs.

## 1. Properties Window Not Displayed from Too Many Elements Causing Element Positioning Problems

### Symptom

Working on a drawing in MEDUSA4 5.0.1 on Windows 7. Everything works fine until inserting some elements. After insertion, a warning appears: "Properties window will not be displayed: too many elements." Massive problems with element positioning follow. The drawing is not yet complete, and the user needs a way out of this situation.

### Root Cause

MEDUSA4 has a limit on the number of elements it can handle in the properties window. When a drawing contains too many elements, the properties window can't display all of them, and the system disables it. The element positioning problems occur because the system is overwhelmed by the number of elements, causing rendering and interaction delays.

### Fix

1. **Reduce the number of elements in the drawing**:
   - "Properties window will not be displayed: too many elements"
   - Simplify the drawing by removing unnecessary elements
   - Group related elements into symbols or cells
   - Use layers to manage element visibility

2. **Split the drawing into multiple sheets**:
   - Divide the drawing across multiple sheets
   - Each sheet has fewer elements
   - Use sheet references to link related content
   - This reduces the element count per sheet

3. **Use symbols instead of individual elements**:
   - Create symbols for repeated elements
   - A symbol counts as one element
   - This dramatically reduces the element count
   - Use the symbol library for common components

4. **Contact CAD Schroer support for TeamViewer session**:
   - "Call me and I will help you in a TeamViewer session"
   - CAD Schroer offers direct support sessions
   - They can diagnose and fix the specific drawing
   - Contact: 02131 3860985 (Gerd Korhammer)

5. **Simplify complex hatching and patterns**:
   - Complex hatching creates many individual elements
   - Use simpler hatch patterns
   - Reduce hatch density
   - Convert hatching to raster images for large areas

6. **Use MEDUSA4 SMART Edit**:
   - "MEDUSA4 Personal includes SMART Edit"
   - SMART Edit can help manage complex drawings
   - Use parametric editing to reduce manual element placement
   - This reduces the total element count

### Community Report

> "Everything worked fine until I inserted some elements. Then I got a warning: 'Properties window will not be displayed: too many elements' and had massive problems with element positioning. Since the drawing is not yet finished, I would be very grateful for any advice to get out of this situation."

## 2. STEP Export Not Available in MEDUSA4 Personal Requiring Advanced Package Upgrade

### Symptom**

Need to export a 3D model from MEDUSA4 to STEP format for finite element analysis. The 3D manual lists interfaces for VRML, VDA, STL, IGES, STEP, DXF, and Google Earth export. However, the STEP export button described in the manual doesn't exist in the downloaded MEDUSA4 Personal version. The STEP interface is not available.

### Root Cause**

"The STEP interface is not available in MEDUSA4 Personal." MEDUSA4 Personal is the free version for private use. It includes many features of the ADVANCED package but not all. The STEP interface is part of the ADVANCED or higher package. The manual covers all packages, but Personal doesn't include all described features.

### Fix

1. **Upgrade to MEDUSA4 ADVANCED or higher**:
   - "Which version of the software is required to use the STEP interface feature?"
   - "The STEP interface is not available in MEDUSA4 Personal per the package overview"
   - Contact CAD Schroer for a commercial license
   - The ADVANCED package includes STEP export

2. **Use STL export as alternative**:
   - MEDUSA4 Personal includes STL export
   - Export the 3D model as STL
   - Import the STL into the FE software
   - Most FE software accepts STL (with mesh conversion)

3. **Use IGES export if available**:
   - Check if IGES is available in Personal
   - IGES is another common 3D exchange format
   - FE software typically accepts IGES
   - IGES preserves surface data better than STL

4. **Use VRML export for visualization**:
   - VRML is available in Personal
   - Export as VRML for visualization purposes
   - Not suitable for FE analysis (mesh-based)
   - But useful for model verification

5. **Use DXF for 2D surface export**:
   - "Is it possible to export pure 2D surfaces, similar to sheet metal, so only surface information is available?"
   - DXF can export 2D geometry
   - For flat or developable surfaces, use DXF
   - FE software can import 2D DXF for shell analysis

6. **Contact CAD Schroer for evaluation license**:
   - Request a temporary ADVANCED license
   - Use it for the STEP export
   - Evaluate if the full package is needed
   - CAD Schroer offers evaluation licenses

### Community Report

> "The 3D manual describes interfaces for VRML, VDA, STL, IGES, STEP, DXF, and Google Earth export. However, the STEP export button described in the manual doesn't exist in the downloaded Personal version. The STEP interface is not available in MEDUSA4 Personal per the package overview. Which version is required to use the STEP interface?"

## 3. 3D Model Export to FE Software Requires STEP Interface Module

### Symptom

Need to export a 3D model created in MEDUSA4 to finite element analysis (FEA) software. Need to export both solid 3D models and pure 2D surfaces (similar to sheet metal, with only surface information). Both flat and curved surfaces need to be exported.

### Root Cause

FEA software typically requires STEP or IGES format for 3D model import. MEDUSA4 Personal doesn't include the STEP interface. The 3D model in MEDUSA4 is stored in a proprietary format that needs the STEP interface module to convert to STEP. Without the STEP module, the 3D model can only be exported as STL (mesh) or VRML (visualization).

### Fix

1. **Upgrade to MEDUSA4 with STEP interface**:
   - "The STEP interface would be optimal for my application"
   - Contact CAD Schroer for the appropriate package
   - STEP preserves solid and surface geometry
   - Most FEA software prefers STEP

2. **Use STL for mesh-based FEA**:
   - Export as STL from MEDUSA4 Personal
   - Import STL into FEA software
   - FEA software converts STL to mesh
   - Trade-off: STL is faceted, not smooth

3. **Use IGES for surface export**:
   - If IGES is available in the package
   - IGES preserves NURBS surfaces
   - Better for curved surfaces than STL
   - FEA software can import IGES surfaces for shell analysis

4. **Export 2D surfaces via DXF**:
   - For flat surfaces (sheet metal)
   - Export the 2D profile as DXF
   - Import into FEA software as 2D shell
   - This works for flat plates and developed surfaces

5. **Use MEDUSA4 SMD Sheet Metal Design**:
   - "MEDUSA4 Personal includes SMD Sheet Metal Design"
   - Use SMD to create and flatten sheet metal
   - Export the flattened profile as DXF
   - Import into FEA for shell analysis

6. **Use a third-party converter**:
   - Export from MEDUSA4 in available format (STL, VRML)
   - Use FreeCAD or other converter to convert to STEP
   - Import the STEP into FEA software
   - This is a workaround but may lose precision

### Community Report

> "Is it possible to export a 3D model created in MEDUSA4 to FE software for FEA? Would it also be possible to export pure 2D surfaces, similar to sheet metal, so only surface information is available? Ideally for both flat and curved surfaces? The STEP interface would be optimal but is not available in Personal."

## 4. 2D Sheet Metal and Parametrics Available in Personal but 3D Limited

### Symptom**

Using MEDUSA4 Personal for 2D design. Need to know what 3D capabilities are available. The user is primarily working in 2D but may need basic 3D modeling. Not sure which features are included in the free Personal version vs. paid versions.

### Root Cause**

"MEDUSA4 Personal is a fully functional version which includes many features of the MEDUSA4 ADVANCED package (e.g. SMART Edit, basic 3D) as well as some additional add-on modules, such as the MEDRaster Colour image editing module, SMD Sheet Metal Design, and Parametrics." However, the 3D capabilities are basic — advanced 3D modeling and STEP/IGES interfaces require the ADVANCED or higher package.

### Fix

1. **Use included 2D features**:
   - MEDUSA4 Personal includes full 2D drafting
   - DRAFTING PLUS with all standard 2D design functionality
   - BACIS1 and BACIS2 customization tools
   - This is sufficient for most 2D work

2. **Use SMD Sheet Metal Design**:
   - "SMD Sheet Metal Design is included in Personal"
   - Create sheet metal parts in 2D
   - Flatten and develop sheet metal
   - Export as DXF for manufacturing

3. **Use Parametrics for 2D**:
   - "Parametrics is included in Personal"
   - Create parametric 2D drawings
   - Use parameters to control geometry
   - Update drawings by changing parameters

4. **Use basic 3D for visualization**:
   - "Basic 3D is included in Personal"
   - Create simple 3D models from 2D profiles
   - Use for visualization and verification
   - Not suitable for complex 3D assembly modeling

5. **Use MEDRaster Colour for image editing**:
   - "MEDRaster Colour image editing module is included"
   - Edit raster images within MEDUSA4
   - Combine raster and vector data
   - Useful for site plans and hybrid drawings

6. **Upgrade for advanced 3D**:
   - For complex 3D modeling, upgrade to ADVANCED
   - ADVANCED includes full 3D PLUS modeling
   - Includes STEP, IGES interfaces
   - Includes Digital Terrain Modeller

### Community Report

> "MEDUSA4 Personal is a fully functional version which includes many features of the ADVANCED package (e.g. SMART Edit, basic 3D) as well as additional add-on modules, such as MEDRaster Colour, SMD Sheet Metal Design, and Parametrics. It is free for private use. Prints bear the watermark 'Not for commercial use'."

## 5. Element Insertion Causes Massive Positioning Problems Requiring Drawing Simplification

### Symptom**

Working on a house drawing in MEDUSA4 with wood frame construction. After inserting some elements, massive positioning problems occur. Elements don't appear at the correct position. The properties window stops displaying. The drawing becomes difficult to work with.

### Root Cause**

MEDUSA4's element handling has limits. When too many elements are inserted at once, the positioning system becomes overwhelmed. The properties window is disabled to prevent further issues. Elements may be placed at incorrect positions due to the system's inability to process all elements simultaneously. This is particularly problematic with complex architectural drawings.

### Fix

1. **Insert elements in smaller batches**:
   - Don't insert many elements at once
   - Insert a few elements at a time
   - Verify positioning after each batch
   - Save after each successful batch

2. **Use symbols for repeated elements**:
   - Create symbols for repeated components (studs, panels)
   - Insert symbols instead of individual elements
   - Symbols count as single elements
   - This reduces the total element count

3. **Use layers to organize elements**:
   - Place different element types on different layers
   - Turn off layers not currently being edited
   - This reduces the active element count
   - Improves positioning performance

4. **Simplify the drawing**:
   - Remove unnecessary detail
   - Use simplified representations for construction details
   - Don't model every nail and screw
   - Focus on the overall structure

5. **Use parametrics for repetitive patterns**:
   - "Parametrics is included in Personal"
   - Create parametric patterns for repetitive elements
   - Use array or pattern tools
   - This generates elements more efficiently

6. **Contact CAD Schroer for direct support**:
   - "Call me and I will help you in a TeamViewer session"
   - Direct support is available from CAD Schroer
   - They can diagnose the specific drawing issues
   - They may provide custom solutions

### Community Report

> "Everything worked fine until I inserted some elements. Then I got massive problems with element positioning. The properties window will not be displayed due to too many elements. I would be grateful for any advice to get out of this situation."

## 6. Additional MEDUSA4 Issues

### Free License Renewal

**Issue**: MEDUSA4 Personal requires annual license renewal.
**Fix**: "Request your free license renewable every 12 months." Go to the CAD Schroer website, request a new license key, and apply it. The license can be extended in perpetuity for private use.

### Watermark on Prints

**Issue**: "The prints bear the watermark 'Not for commercial use'."
**Fix**: This is by design for the free Personal version. Upgrade to a commercial license to remove the watermark. The watermark doesn't appear on screen, only on printed output.

### Multi-Platform Support

**Issue**: Is MEDUSA4 available on Linux?
**Fix**: "It is a multi-platform system available for Windows and several Linux distributions." Download the Linux version from the CAD Schroer website. Features are the same across platforms.

### BACIS Customization

**Issue**: Need to customize MEDUSA4 for specific workflows.
**Fix**: "MEDUSA4 DRAFTING PLUS includes BACIS1 and BACIS2 customization tools." Use BACIS to create custom commands and macros. Refer to the BACIS documentation for programming details.

### Tutorial Resources

**Issue**: New user needs tutorials for MEDUSA4.
**Fix**: "There are tutorials on the CAD Schroer website, and you can download the demo." YouTube channel "Medusa4" has video tutorials. The MEDUSER Association community provides user support.

## Best Practices

1. **Reduce element count by using symbols** — prevents "too many elements" error
2. **Split complex drawings across multiple sheets** — reduces element count per sheet
3. **Use layers to manage element visibility** — reduces active element processing
4. **Upgrade to ADVANCED for STEP export** — Personal doesn't include STEP interface
5. **Use STL export as workaround for FEA** — available in Personal
6. **Use SMD Sheet Metal Design for 2D sheet metal** — included in Personal
7. **Use Parametrics for repetitive patterns** — reduces manual element placement
8. **Insert elements in small batches** — prevents positioning problems
9. **Renew free Personal license annually** — 12-month renewal cycle
10. **Contact CAD Schroer for TeamViewer support** — direct help available
