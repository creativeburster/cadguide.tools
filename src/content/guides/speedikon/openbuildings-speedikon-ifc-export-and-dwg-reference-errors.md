---
title: "OpenBuildings Speedikon IFC Export and DWG Reference Errors"
excerpt: "OpenBuildings Speedikon IFC Export and DWG Reference Errors: symptoms, root causes, and step-by-step fixes, verified against Bentley Documentation and Community."
category: "troubleshooting"
softwareSlug: "speedikon"
keyword: "OpenBuildings Speedikon IFC export errors missing property mapping PCF PropertySet configuration DWG reference line style scale global LTSCALE not applied per-element scaling DWG font substitution missing SHX files TrueType fonts DGN to DWG line style drop incompatible styles Drop Unsupported option DWG units warning uninferable units manual units setting"
slug: "openbuildings-speedikon-ifc-export-and-dwg-reference-errors"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-03"
sources:
  - "https://docs.bentley.com/LiveContent/web/OpenBuildings%20Speedikon%20Help-v5/en/GUID-5BEA51DC-F2B2-77FD-2588-30B61403120B.html"
  - "https://bentleysystems.service-now.com/community?id=community_question&sys_id=47c9572c472186109091861f536d43fe"
  - "https://docs.bentley.com/LiveContent/web/OpenBuildings%20Speedikon%20Help-v4/en/GUID-610971AE-03F8-D5B8-A3E8-7C9B3D0E9377.html"
---

# OpenBuildings Speedikon IFC Export and DWG Reference Errors: IFC Export Full of Errors from Missing Property Mapping Requiring PCF and PropertySet Configuration, DWG Reference Line Style Scale from Global LTSCALE Not Applied Requiring Per-Element Scaling, DWG File Font Substitution from Missing SHX Files Requiring TrueType Fonts, DGN to DWG Line Style Drop from Incompatible Styles Requiring Drop Unsupported Option, and DWG Units Warning from Uninferable Units Requiring Manual Units Setting

OpenBuildings Speedikon's IFC export, DWG reference handling, font management, DGN-to-DWG conversion, and units inference produce errors from missing property mappings, global scale limitations, missing SHX files, incompatible line styles, and uninferable units. This guide covers the 5 most common Speedikon problems with diagnostic steps and community-verified fixes from Bentley Documentation and Community.

## 1. IFC Export Full of Errors from Missing Property Mapping

### Symptom

After exporting a DGN file to IFC format from OpenBuildings Speedikon, some parameters are not shown when linking the IFC file in Revit. The IFC export is full of errors. Element names, IDs, and other property data are missing from the exported IFC file. The Element Information tool does not show data from the Attributes tab.

### Root Cause

The IFC export is missing property mapping configuration. Speedikon requires two configuration files to properly export properties: (1) the `.pcf` (Project Configuration File) which defines the IFC export settings, and (2) `IFC_PropertyMapping.set` which maps Speedikon properties to IFC properties. If these files are not configured, or if the default `untitled.pcf` is used instead of the AECOsim-specific project files, properties are not exported. The `untitled.pcf` is for plain MicroStation, not AECOsim/Speedikon, and lacks the building-specific property mappings.

### Fix

1. **Use the correct PCF file**:
   - Don't use `untitled.pcf`
   - Use the BuildingExamples PCF for AECOsim/Speedikon
   - This includes building-specific data

2. **Configure IFC_PropertyMapping.set**:
   - This file maps Speedikon properties to IFC properties
   - Ensure all required properties are mapped
   - Follow the Bentley wiki for property mapping

3. **Enable required properties**:
   - Follow the Bentley wiki article
   - Enable properties in the PCF file
   - Set `IFC_Project=1` in the PCF

4. **Check Element Information**:
   - Use the Element Information tool
   - Check the Attributes tab
   - If data is missing, the property mapping is incomplete
   - Add missing mappings to the PropertyMapping.set

5. **Raise a Service Request**:
   - Bentley support can analyze the export
   - Provide the DGN and IFC files

6. **Use the step-by-step export process**:
   - File > Export > IFC
   - Select the correct PCF
   - Choose the appropriate IFC version (2x3 or 4)
   - Check the property mapping settings
   - Export and verify in Revit

7. **Verify export with IFC viewer**:
   - Use an IFC viewer (BIMcollab, Solibri)
   - Check if properties are present
   - Compare with the original DGN
   - Identify missing properties

### Community Report

> "After export the IFC file some of the parameters not shown after linking in the Revit Interface. I would request you to kindly raise a Service Request for this issue. As this needs detail investigations, please attach the IFC files so that we can test it out at our end. Instead, navigate one folder more into \BuildingExamples where you should find the PCF files for the delivered AECOsim projects/datasets."

## 2. DWG Reference Line Style Scale from Global LTSCALE Not Applied

### Symptom

When opening a DWG file directly, it looks fine. But when opening the same DWG as a reference, all line styles are scaled incorrectly. The line styles appear at the wrong scale in the reference attachment. The global line style scale (LTSCALE) is set correctly in the DWG file.

### Root Cause

"Neither AutoCAD nor OpenBuildings Speedikon applies this scale factor when a file is attached as a reference." The global line style scale factor (LTSCALE in AutoCAD, ACTIVE LINESTYLESCALE in Speedikon) is not applied to reference attachments. This is a limitation in both AutoCAD and Speedikon. The global scale only affects the active file, not references. When a DWG with global LTSCALE is attached as a reference, the line styles are displayed at their base scale without the global multiplier.

### Fix

1. **Set line style scale per element**:
   - Open the DWG in AutoCAD
   - Set line style scale on each element individually
   - Don't rely on global LTSCALE

2. **Create line styles at correct size**:
   - Define line styles at the desired display size
   - Don't use a global scale factor
   - The line style definition itself should be the correct size
   - This ensures correct display in references

3. **Use the Scale Line Styles reference setting**:
   - Preferences > Reference Category
   - Enable this option
   - This scales line styles by the reference scale factor

4. **Set True Scale for references**:
   - Enable True Scale
   - This ensures real-world scaling
   - Line styles will scale with the reference

5. **Adjust the active file's LTSCALE**:
   - Set `ACTIVE LINESTYLESCALE` in the active file
   - This affects the active file's line styles
   - It does not affect references
   - But it can help match the reference appearance

6. **Use the MS_DWGREF_ALLOWMASTERCOLORS variable**:
   - This allows DWG references to use master colors
   - May help with line style display
   - Set in the configuration file

### Community Report

> "When I open a DWG file directly it looks fine, but when I open it as a reference, all of the line styles are scaled incorrectly. Neither AutoCAD nor OpenBuildings Speedikon applies this scale factor when a file is attached as a reference. For this reason, you should not use the global line style scale in files that are used as references. Instead, create line styles at an appropriate size or set the line style scale of the individual elements."

## 3. DWG File Font Substitution from Missing SHX Files

### Symptom

A DWG file looks fine on a computer with AutoCAD installed, but when moved to a computer without AutoCAD, the text appears in a different font. The text uses SHX font files that are not present on the second computer. Line style symbols may also be missing.

### Root Cause

"Text in DWG files may use fonts that are defined in separate SHX files. If the SHX file does not exist, OpenBuildings Speedikon displays the text in a default font." DWG files reference SHX font files externally. The SHX files are not embedded in the DWG. When the DWG is moved to a computer without the SHX files, Speedikon substitutes a default font. Similarly, "the symbols used in a DWG line style are stored in separate SHX files" — if these are missing, line styles appear incomplete.

### Fix

1. **Use TrueType fonts instead of SHX**:
   - Replace SHX fonts with TrueType in AutoCAD
   - TrueType fonts are embedded in the DWG
   - They display correctly on all computers

2. **Include SHX files when sharing DWGs**:
   - Copy all SHX files referenced by the DWG
   - Send them with the DWG file
   - Place them in the Speedikon font directory

3. **Copy SHX files to Speedikon font directory**:
   - Find the SHX files on the AutoCAD computer
   - Typically in `C:\Program Files\Autodesk\AutoCAD\Fonts`
   - Copy to the Speedikon symbology directory
   - Restart Speedikon

4. **Set the MS_FONTPATH configuration variable**:
   - Point to a directory containing SHX files
   - Add the AutoCAD font directory to the path
   - Speedikon will find the SHX files
   - Text will display correctly

5. **Check for missing line style symbols**:
   - If line styles are missing symbols
   - Find and copy the SHX files
   - Place in the Speedikon directory

6. **Use the Drop Unsupported Line Styles option**:
   - When saving DGN to DWG
   - Use "Drop Unsupported Line Styles" option
   - This converts complex line styles to geometry
   - Avoids SHX dependency

### Community Report

> "When I open a DWG file on a computer that has AutoCAD installed it looks fine, but when I move the same file to a computer without AutoCAD, the text appears in a different font. Text in DWG files may use fonts that are defined in separate SHX files. If the SHX file does not exist, OpenBuildings Speedikon displays the text in a default font. This is a common problem when exchanging DWG files. If possible, use TrueType fonts."

## 4. DGN to DWG Line Style Drop from Incompatible Styles

### Symptom

When saving a DGN file containing compound OpenBuildings Speedikon line styles to DWG, the lines with special styles change to the Continuous line style. All custom line styles are lost in the DWG export. The DWG file shows continuous lines where there should be custom styles.

### Root Cause

"DGN line styles that are not compatible with (understood by) AutoCAD default to the Continuous style when the file is saved to DWG." Speedikon's compound line styles (point styles, pattern styles) are more complex than AutoCAD linetypes. AutoCAD can't represent Speedikon's custom line styles, so they are converted to Continuous. The line style information is lost in the conversion.

### Fix

1. **Use the Drop Unsupported Line Styles option**:
   - File > Save As > DWG/DXF
   - Open Save As DWG/DXF Options dialog
   - Enable "Drop Unsupported Line Styles"
   - The line styles are converted to geometry

2. **Understand the trade-off**:
   - The visual appearance is preserved
   - But the elements are no longer lines with styles
   - They are individual geometry components

3. **Use AutoCAD-compatible line styles**:
   - Before saving to DWG
   - Replace Speedikon custom line styles with AutoCAD-compatible ones
   - Use standard AutoCAD linetypes
   - These will be preserved in the DWG

4. **Create custom AutoCAD linetypes**:
   - For complex line styles
   - Create equivalent AutoCAD .lin files
   - Load them in AutoCAD
   - Map Speedikon styles to AutoCAD linetypes

5. **Use reference attachments**:
   - Keep the DGN file with custom line styles
   - Attach it as a reference to a DWG file
   - The line styles display correctly in Speedikon
   - But may not in AutoCAD

6. **Check the Save As DWG options**:
   - Review all Save As options
   - Set dimension styles, line styles, and fonts
   - Use a seed/template DWG file
   - This ensures consistent conversion

### Community Report

> "When I save a DGN file containing compound OpenBuildings Speedikon line styles to DWG, the lines that have special styles change to the Continuous line style. DGN line styles that are not compatible with AutoCAD default to the Continuous style. However, if the Drop Unsupported Line Styles option on the Save As DWG/DXF Options dialog is used, complex line styles maintain their appearance in the saved files. Although the elements appear the same, they actually are many small geometry components in series."

## 5. DWG Units Warning from Uninferable Units

### Symptom

When opening a DWG file, a warning appears saying OpenBuildings Speedikon cannot infer the units for the file. The warning dialog displays the units for the DWG file and lets you change the units setting for opening the file. The warning appears when opening, attaching as a reference, or placing as a cell.

### Root Cause

"This warning appears when OpenBuildings Speedikon does not know the units in a DWG file." DWG files may not always store unit information explicitly. AutoCAD drawings can be created without specifying units, or the units may be set to "Unitless." When Speedikon encounters such a file, it can't determine the correct units for the geometry. This is important because incorrect units lead to incorrect scaling of all geometry.

### Fix

1. **Set units in the warning dialog**:
   - Select the correct units in the dialog
   - Choose the units that match the DWG file's intended units
   - Click OK to open with those units

2. **Set units in AutoCAD before saving**:
   - Open the DWG in AutoCAD
   - Use the UNITS command
   - Set the correct drawing units
   - Save the DWG file
   - Speedikon will read the units correctly

3. **Use a seed file with correct units**:
   - When creating new DWG files
   - Use a seed/template with correct units
   - The units are stored in the template
   - Speedikon reads them on open

4. **Check the DWG file's INSUNITS variable**:
   - In AutoCAD, check the INSUNITS system variable
   - Set it to the correct unit (e.g., 6 for meters, 1 for inches)
   - Save the DWG
   - Speedikon reads INSUNITS

5. **Set the MS_DWG_UNITS configuration variable**:
   - Set a default unit for DWG files without units
   - Add to the configuration file
   - This avoids the warning
   - All DWGs without units use this default

6. **Verify units after opening**:
   - After opening the DWG
   - Check the model units
   - Verify a known dimension
   - If incorrect, reopen with different units

7. **Use True Scale for references**:
   - When attaching DWG as reference
   - Enable True Scale
   - This uses the units to calculate correct scaling
   - Ensures real-world dimensions

### Community Report

> "When I open a DWG file, I get a warning saying OpenBuildings Speedikon cannot infer the units for the file. This warning appears when OpenBuildings Speedikon does not know the units in a DWG file that you are opening, attaching as a reference, or placing as a cell. The warning dialog displays the units for the DWG file, and lets you change the units setting for opening the file."

## 6. Additional Speedikon Issues

### Program Exception and Crash Logging

**Issue**: "When a program exception occurs, OpenBuildings Speedikon appends technical details to the Exception.log file and writes a binary MiniDump.dmp file."
**Fix**: Check Exception.log for crash details. Set `MS_MiniDumpType` to 7 for full dump. Send logs to Bentley support. Use ManageExceptionLogs.vbs for custom processing.

### DWG 3D Data Flattened to 2D

**Issue**: "When I open a DWG file, the contents appears flattened. The model contains 3D data and you have selected Create 2D Models for Model Space."
**Fix**: Don't use "Create 2D Models for Model Space" for 3D DWG files. Use the default 3D model option. Check the DWG Open Options dialog.

### Proxy Elements Inaccessible

**Issue**: "When I open a DWG file with many proxy elements, I cannot access the data inside them."
**Fix**: "Proxy elements cannot be understood unless the add-on software is loaded." Drop proxy elements to components. Edit the contents. But they will no longer be recognized by their native program.

### Reference Level Overrides Not Saved

**Issue**: "When I save a DGN or DWG file, changes to references are not being saved."
**Fix**: "Set DWG VISRETAIN to 1 or SET REFLEVELOVERRIDES ON." This retains reference level changes when the file is closed. Check the setting in Preferences.

### Layers 0 and Defpoints Not Listed for References

**Issue**: "When I open a DWG file, the levels 0 and defpoints are not listed for references."
**Fix**: "The defpoints and 0 levels cannot be controlled separately between the active file and references." Objects on these levels from all references are on the master file's levels. Turning off one affects all references.

### ProjectWise Compatibility

**Issue**: "OpenBuildings Speedikon 2024 is compatible with ProjectWise 2023 and ProjectWise CONNECT Edition Update 3.4."
**Fix**: Verify ProjectWise version compatibility. Check the ProjectWise Version Support Matrix. Update ProjectWise if needed. Use the correct Speedikon version.

## Best Practices

1. **Use BuildingExamples PCF files for IFC export** — not untitled.pcf
2. **Configure IFC_PropertyMapping.set for complete property export** — ensures all data is exported
3. **Set line style scale per element, not globally** — global LTSCALE doesn't apply to references
4. **Use TrueType fonts instead of SHX** — more portable across computers
5. **Include SHX files when sharing DWGs** — prevents font substitution
6. **Enable Drop Unsupported Line Styles when saving to DWG** — preserves visual appearance
7. **Set INSUNITS in AutoCAD before sharing DWGs** — prevents units warning
8. **Use True Scale for DWG references** — ensures correct real-world scaling
9. **Check Exception.log and MiniDump.dmp after crashes** — provides diagnostic data
10. **Verify ProjectWise compatibility before upgrading** — check the Version Support Matrix
