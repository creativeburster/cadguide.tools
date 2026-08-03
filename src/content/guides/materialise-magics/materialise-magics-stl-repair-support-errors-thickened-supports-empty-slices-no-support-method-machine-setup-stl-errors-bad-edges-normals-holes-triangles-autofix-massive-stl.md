---
title: "Materialise Magics STL Repair and Support Generation Errors: Thickened Supports Create Open Contours and Empty Slices from Non-Solid Support Geometry Requiring 28.03 Update, No Support Generation Method Selected from Incomplete Machine Setup Requiring Machine Properties Configuration, Common STL Errors Bad Edges Inverted Normals Holes Intersecting Triangles Requiring AutoFix Workflow, Massive STL File Sizes Slow Viewport from High Polygon Count Requiring Triangle Reduction, and Support STL Export to Cura for FDM Requires Solid Support Export Format"
excerpt: "Materialise Magics fails for 5 distinct reasons: thickened supports create open contours and empty slices from non-solid support geometry requiring 28.03 update, no support generation method selected from incomplete machine setup requiring Machine Properties configuration, common STL errors bad edges inverted normals holes intersecting triangles requiring AutoFix workflow, massive STL file sizes slow viewport from high polygon count requiring triangle reduction, and support STL export to Cura for FDM requires solid support export format. We cover each with fixes from Materialise Support and We Are 3D Community."
category: "stl-repair-and-support-generation-errors"
softwareSlug: "magics"
keyword: "Materialise Magics thickened supports open contours empty slices non-solid support 28.03 no support generation method selected machine setup Machine Properties STL errors bad edges inverted normals holes intersecting triangles AutoFix massive STL file sizes slow viewport polygon count triangle reduction support STL export Cura FDM solid support"
slug: "materialise-magics-stl-repair-support-errors-thickened-supports-empty-slices-no-support-method-machine-setup-stl-errors-bad-edges-normals-holes-triangles-autofix-massive-stl"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://help.materialise.com/magics-known-issues/thickened-supports-might-create-open-contours-and-empty-slices"
  - "https://wiya3d.com/community/postid/1248/"
  - "https://wiya3d.com/community/postid/1249/"
---

# Materialise Magics STL Repair and Support Generation Errors: Thickened Supports Create Open Contours and Empty Slices from Non-Solid Support Geometry Requiring 28.03 Update, No Support Generation Method Selected from Incomplete Machine Setup Requiring Machine Properties Configuration, Common STL Errors Bad Edges Inverted Normals Holes Intersecting Triangles Requiring AutoFix Workflow, Massive STL File Sizes Slow Viewport from High Polygon Count Requiring Triangle Reduction, and Support STL Export to Cura for FDM Requires Solid Support Export Format

Materialise Magics' support generation, machine setup, STL repair, viewport performance, and cross-platform export produce errors from non-solid support geometry, incomplete configuration, and mesh complexity. This guide covers the 5 most common Materialise Magics problems with diagnostic steps and community-verified fixes from Materialise Support and We Are 3D Community.

## 1. Thickened Supports Create Open Contours and Empty Slices from Non-Solid Support

### Symptom

Using thickened supports in Magics 28.0, 28.01, or 28.02. When slicing with certain Build Processors (Concept Laser 1.2, Sodick 1.0, Additive Industries 2.6), the supports produce empty slices. The thickening of non-solid supports creates open contours for some geometries. The slicing fails or produces supports with missing layers.

### Root Cause

The support thickening algorithm in Magics 28.0-28.02 creates non-solid geometry for certain support shapes. When the Build Processor slices these non-solid supports, the open contours result in empty slices — layers where no support material is deposited. This is a confirmed bug in the support thickening code, fixed in Magics 28.03.

### Fix

1. **Update to Magics 28.03 or later**:
   - "This issue is resolved as of Magics 28.03"
   - Download from the Materialise portal
   - Install Magics 28.03+
   - The thickening algorithm is fixed

2. **Regenerate supports from previous versions**:
   - "If supports are imported from a previous Magics version, it is mandatory to regenerate the supports prior to slicing"
   - "Otherwise the slicing will use the imported, faulty support as input"
   - Delete imported supports
   - Regenerate supports in Magics 28.03

3. **Convert solid support to STL**:
   - "When using thickened support, set the parameters in Machine properties to convert solid support to .stl"
   - Go to Build Preparation > Machine Properties
   - Enable "Convert solid support to .stl"
   - This forces solid geometry output

4. **Check for planar holes after SG mode**:
   - "On exit from SG mode, check the 'planar holes' in the Part fixing info and run the fixing"
   - After generating supports, exit SG mode
   - Open Part Fixing Info
   - Check for planar holes
   - Run the fixing tool to repair

5. **Use non-thickened supports as workaround**:
   - If you can't update to 28.03
   - Use standard (non-thickened) supports
   - Standard supports don't have the open contour issue
   - Trade-off: less structural support

6. **Verify slices before printing**:
   - After slicing, preview the slices
   - Check for empty layers in the support structure
   - If empty slices are found, regenerate supports
   - Don't proceed with printing if supports have empty slices

### Community Report

> "Thickening of the non-solid support might create open contours for some geometries. This can create empty slices for supports while slicing with some Build Processors (Concept Laser 1.2, Sodick 1.0, Additive Industries 2.6). This issue is resolved as of Magics 28.03. If supports are imported from a previous Magics version, it is mandatory to regenerate the supports prior to slicing."

## 2. No Support Generation Method Selected from Incomplete Machine Setup

### Symptom

New to Materialise Magics, using an SLS machine. After importing an STL model to the platform, trying to generate support. Error message: "There is no support generation method selected. See machine setup." Cannot proceed with support generation.

### Root Cause

The machine and platform settings are not fully defined. Magics requires a support generation method to be selected in the Machine Properties before support generation can proceed. Without a complete machine setup, Magics doesn't know which support type to generate. This is a configuration issue, not a bug.

### Fix

1. **Configure Machine Properties for support generation**:
   - "Go to Build Preparation and click Machine Properties"
   - "In pop up window go to support generation parameters"
   - "There you have the option support type selection to select support types"
   - Select the appropriate support type for your machine

2. **Complete the machine setup**:
   - "It seems still you haven't fully defined the machine, platform setting"
   - Go to Build Preparation > Machine Properties
   - Complete all required fields:
     - Machine type
     - Build platform dimensions
     - Support generation parameters
     - Slicing parameters

3. **Select the correct support type**:
   - For metal AM: select SG+ (Support Generator+)
   - For resin: select e-Stage for Resin
   - For SLS: typically no supports needed (powder bed supports the part)
   - Verify the support type matches your machine

4. **Verify platform settings**:
   - Go to Build Preparation > Platform Setup
   - Set the platform dimensions
   - Set the build orientation
   - Ensure the platform matches the physical machine

5. **Save machine configuration**:
   - After completing setup, save the machine configuration
   - File > Save Machine Configuration
   - This prevents the error in future sessions
   - Share the configuration with other users

6. **Import a pre-configured machine profile**:
   - Materialise provides pre-configured machine profiles
   - Download from the Materialise portal
   - Import via Build Preparation > Import Machine
   - This sets all parameters including support generation

### Community Report

> "When I try to generate the support after importing the STL model to the platform, the error message arises: 'There is no support generation method selected. See machine setup.' Go to Build Preparation and click Machine Properties. In the pop up window go to support generation parameters. There you have the option support type selection to select support types. I have changed and now supports are generating."

## 3. Common STL Errors: Bad Edges, Inverted Normals, Holes, Intersecting Triangles

### Symptom

Importing an STL file from CAD into Magics. The Part Fixing Info shows multiple errors: bad edges, near bad edges, inverted normals, holes, bad contours, intersecting triangles, overlapping triangles, noise shells, and intersecting shells. These errors can cause slicing problems, poor quality, or failed builds.

### Root Cause

"Even clean CAD models can generate STL issues" during the CAD-to-STL conversion. The tessellation process can produce: bad edges (edges shared by more or fewer than 2 triangles), inverted normals (triangle faces pointing inward), holes (gaps in the mesh), intersecting triangles (triangles crossing through each other), overlapping triangles (duplicate geometry), and noise shells (small disconnected mesh fragments).

### Fix

1. **Check errors in Part Fixing Info (Diagnostics)**:
   - "Check errors in Part Fixing Info (Diagnostics)"
   - Select the part
   - Go to Fixing tab > Part Fixing Info
   - Review all detected errors
   - Note the count and type of each error

2. **Use AutoFix for quick repair**:
   - "Use AutoFix for quick repair"
   - In the Fixing tab, click AutoFix
   - AutoFix automatically closes planar holes, flips inverted normals, and stitches bad edges
   - Review the results after AutoFix

3. **Apply stitching, hole filling, and normals correction**:
   - "Apply stitching, hole filling, and normals correction"
   - Use the Stitching tool for bad edges
   - Use the Fill Holes tool for gaps
   - Use the Fix Normals tool for inverted normals
   - Check Part Fixing Info after each fix

4. **Use manual tools for complex geometry**:
   - "Use manual tools for complex geometry issues"
   - Use the Triangle Fix tool for individual triangles
   - Use the Move Part Points tool for vertex adjustment
   - Use the Filter Triangles tool for small/sharp triangles

5. **Fix intersecting triangles**:
   - "Navigate to the Part Fixing Info tab, select the Triangle Fix tool"
   - "Mark the overlapping geometries"
   - "Use the Move Part Points tool to manually separate the vertices"
   - "Until the collision error clears from the diagnostic screen"

6. **Fix inverted normals**:
   - "If a triangle's internal face points outward, the printer cannot distinguish the inside from the outside"
   - "Run the AutoFix command in the Fix ribbon"
   - "Or manually orient the normals so all internal geometries display as solid red"
   - "And external faces point uniformly outward"

7. **Verify after fixing**:
   - Run Part Fixing Info again
   - Ensure all error counts are zero
   - The part should be watertight and manifold
   - Proceed to slicing only after all errors are fixed

### Community Report

> "Even clean CAD models can generate STL issues like: bad edges/near bad edges, inverted normals, holes/bad contours, intersecting triangles, overlapping triangles, shells/noise shells & intersecting shells. Fixing workflow: 1. Check errors in Part Fixing Info (Diagnostics). 2. Use AutoFix for quick repair. 3. Apply stitching, hole filling, and normals correction. 4. Use manual tools for complex geometry issues."

## 4. Massive STL File Sizes Slow Viewport from High Polygon Count

### Symptom

Importing a highly detailed native CAD file into Magics. The resulting STL has millions of polygons. The Magics viewport lags severely during orientation, support generation, and other operations. The software becomes unresponsive or very slow.

### Root Cause

"Highly detailed native CAD imports can generate millions of polygons, causing the software interface to lag severely during orientation and support generation." The STL file size is proportional to the polygon count. Magics renders all triangles in the viewport, so high polygon counts overwhelm the GPU and CPU. The issue is worse with complex organic geometry or assemblies.

### Fix

1. **Use triangle reduction (mesh decimation)**:
   - "Utilize the triangle reduction or mesh decimation tools to lower the overall polygon count"
   - "Retaining the necessary dimensional accuracy while making the file manageable"
   - Go to Tools > Reduce Triangles
   - Set the target polygon count or tolerance

2. **Reduce STL resolution during CAD export**:
   - In the CAD software, when exporting to STL
   - Use a coarser tessellation setting (larger deviation tolerance)
   - This produces fewer polygons
   - Balance accuracy vs. file size

3. **Use Magics' Smoothing tool**:
   - After reducing triangles
   - Use Tools > Smoothing
   - This improves the appearance of reduced meshes
   - Without adding polygons

4. **Use the Wrap tool for complex geometry**:
   - Tools > Wrap
   - Creates a watertight shell around the geometry
   - Can simplify complex internal structures
   - Reduces effective polygon count

5. **Split large assemblies**:
   - If the STL is an assembly
   - Split into individual parts
   - Process each part separately
   - Merge after processing

6. **Use Magics' Lumen feature (if available)**:
   - Magics 2026+ includes implicit geometry support
   - "Implicit geometry support" handles complex geometry more efficiently
   - Reduces memory usage for complex parts
   - Update to the latest Magics version

7. **Optimize Magics performance settings**:
   - Edit > Preferences > Performance
   - Reduce the viewport quality
   - Enable level of detail (LOD) rendering
   - Increase the LOD distance

### Community Report

> "Massive file sizes slowing down viewport performance. Highly detailed native CAD imports can generate millions of polygons, causing the software interface to lag severely during orientation and support generation. Utilize the triangle reduction or mesh decimation tools to lower the overall polygon count, retaining the necessary dimensional accuracy while making the file manageable."

## 5. Support STL Export to Cura for FDM Requires Solid Support Export Format

### Symptom

Generating supports in Materialise Magics with more powerful and flexible support generation than Cura. Want to export the model with supports as STL and import into Cura for slicing and FDM 3D printing. The support STL doesn't import correctly into Cura or doesn't slice properly.

### Root Cause

Magics generates supports for industrial AM (metal/resin), not for FDM. The support format from Magics may not be compatible with Cura's expectations. Magics supports are generated as separate geometry that needs to be merged with the part STL. Cura expects a single watertight mesh or multiple separate meshes. The export format and structure must be correct for Cura to process.

### Fix

1. **Export supports as solid STL**:
   - In Magics, after generating supports
   - Go to File > Export > Export Parts
   - Select "Solid" as the export type
   - Export both the part and supports as STL

2. **Merge support and part into one STL**:
   - In Magics, merge the support and part into a single part
   - Use Edit > Merge Parts
   - Export the merged part as a single STL
   - Import the single STL into Cura

3. **Export as separate STL files**:
   - Export the part as one STL
   - Export the supports as a separate STL
   - Import both into Cura
   - Cura will treat them as separate objects

4. **Use Magics' support export options**:
   - In the Support Generation module
   - Use File > Export > Export Supports
   - Select STL format
   - Ensure the support geometry is solid (watertight)

5. **Verify STL in Magics before export**:
   - Run Part Fixing Info on the support geometry
   - Fix any errors (holes, bad edges, etc.)
   - The support STL must be watertight
   - Cura will reject non-manifold meshes

6. **Use Cura's support settings instead**:
   - For FDM printing, Cura's built-in support generation may be sufficient
   - "Magics has more powerful & flexible support generating technique"
   - But Cura's supports are optimized for FDM
   - Consider using Cura's supports for FDM, Magics for industrial AM

7. **Use e-Stage for Resin supports**:
   - If printing with resin
   - Use Magics' e-Stage for Resin module
   - Generate supports optimized for resin
   - Export as STL for the resin printer's slicer

### Community Report

> "Does anyone try to import the STL model with support generated on Materialise Magics to Cura and generate the g-code and 3D print? Materialise Magics has more powerful & flexible support generating technique that can generate support which Cura not possible to generate. I'm wondering if it is possible to export the STL model & support from Magics and then slice the model from Cura to 3D print."

## 6. Additional Materialise Magics Issues

### Wall Thickness Errors

**Issue**: "Wall thickness errors leading to fragile physical parts."
**Fix**: Use Magics' Wall Thickness Analysis tool (Analysis > Wall Thickness). Identify thin walls. Reinforce thin areas in CAD before re-exporting STL. Use the Thicken tool in Magics for minor corrections.

### Support Generation for SLS

**Issue**: SLS machines typically don't need supports (powder bed provides support).
**Fix**: For SLS, disable support generation in Machine Properties. Use the powder bed as support. Generate supports only for down-facing surfaces with critical tolerances.

### Build Processor Compatibility

**Issue**: Different Build Processors handle supports differently.
**Fix**: Verify the Build Processor supports the support type you're using. Check Materialise's compatibility matrix. Use the correct Build Processor version for your machine.

### Hollowing and Drain Holes

**Issue**: Hollowed parts need drain holes for resin printing.
**Fix**: Use Magics' Hollow tool (Tools > Hollow). Add drain holes using the Hole tool. Position holes at the lowest points of the hollow cavity. Verify drain hole size is sufficient for resin flow.

## Best Practices

1. **Update to Magics 28.03+ for thickened support fix** — prevents empty slices
2. **Regenerate supports after version update** — don't use imported faulty supports
3. **Complete Machine Properties setup before support generation** — prevents "no method" error
4. **Run Part Fixing Info on every imported STL** — catch errors before slicing
5. **Use AutoFix first, then manual tools** — AutoFix handles most common errors
6. **Reduce polygon count for large STL files** — improves viewport performance
7. **Use coarser STL resolution during CAD export** — fewer polygons, smaller files
8. **Export supports as solid watertight STL for Cura** — ensures compatibility
9. **Verify supports with Part Fixing Info before export** — prevents slicing errors
10. **Use Cura's built-in supports for FDM, Magics for industrial AM** — right tool for the job
