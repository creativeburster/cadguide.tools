---
title: "ArchiCAD IFC Import Geometry Errors and Publisher PDF Hang: IFC General Import Produces Incorrect Geometry from Parametric Construction Elements Translator Requiring Objects Conversion, BREP Geometry in IFC Can Only Import as Morphs or Objects Not Native Construction Elements, Publisher Hangs on Section Elevation Sheets from Vector Fill Overload and Image Textures, IFC Property Mapping Limitations for Complex Data Transformations Requiring Hybrid Property Manager Approach, and Hotlink Module IFC Geometry Errors from Missing Translator Settings"
excerpt: "ArchiCAD fails for 5 distinct reasons: IFC General Import produces incorrect geometry from Parametric Construction and MEP Elements translator requiring Objects conversion, BREP geometry in IFC can only import as Morphs or Objects not native Construction Elements, Publisher hangs on section/elevation sheets from vector fill overload and image textures requiring one-by-one publishing, IFC Property Mapping lacks complex data transformations requiring hybrid Property Manager and Classification Manager approach, and Hotlink Module IFC geometry errors from missing translator settings and BREP export from Revit. We cover each with fixes from Graphisoft Community."
category: "troubleshooting"
softwareSlug: "archicad"
keyword: "ArchiCAD IFC General Import incorrect geometry Parametric Construction MEP Elements translator Objects conversion BREP geometry Morphs native Construction Elements Publisher hangs section elevation vector fill image textures Property Mapping complex data transformations Property Manager Classification Manager Hotlink Module translator settings Revit"
slug: "archicad-ifc-import-geometry-errors-publisher-pdf-hang-general-import-parametric-construction-brep-morphs-objects-vector-fill-overload-property-mapping-hybrid-hotlink-module-revit"
author: "CADGuide Tools Editorial Team"
readTime: "13 min"
date: "2025-07-31"
sources:
  - "https://community.graphisoft.com/t5/Documentation/PDF-Purgatory/td-p/690440"
  - "https://community.graphisoft.com/t5/Collaboration-with-other/Ifc-placed-with-hotlink-has-errors-in-geometry/td-p/368435"
  - "https://community.graphisoft.com/t5/Collaboration-with-other/My-Experience-with-Archicad-IFC-Mapping-Methods/td-p/653254"
---

# ArchiCAD IFC Import Geometry Errors and Publisher PDF Hang: IFC General Import Produces Incorrect Geometry from Parametric Construction Elements Translator Requiring Objects Conversion, BREP Geometry in IFC Can Only Import as Morphs or Objects Not Native Construction Elements, Publisher Hangs on Section Elevation Sheets from Vector Fill Overload and Image Textures, IFC Property Mapping Limitations for Complex Data Transformations Requiring Hybrid Property Manager Approach, and Hotlink Module IFC Geometry Errors from Missing Translator Settings

ArchiCAD's IFC import, geometry conversion, and PDF publishing produce errors from translator settings, BREP geometry limitations, vector fill overload, and property mapping constraints. This guide covers the 5 most common ArchiCAD IFC and Publisher problems with diagnostic steps and community-verified fixes from Graphisoft Community.

## 1. IFC General Import Produces Incorrect Geometry from Parametric Construction Elements Translator

### Symptom

Placing an IFC file using the "General Import" translator produces incorrect geometry. Beams, columns, and other structural elements appear distorted or missing. Using the "Exact Geometry" translator produces correct geometry, but the user wants property information visible in the "General Import" mode.

### Root Cause

The "General Import" translator has a geometry conversion option set to "Parametric Construction and MEP Elements." This option attempts to convert IFC elements into native ArchiCAD parametric elements (beams, columns, slabs). However, for certain IFC files (especially from structural software like StruBIM Steel), this conversion produces incorrect geometry. The parametric conversion algorithm doesn't handle all IFC geometry representations correctly.

### Fix

1. **Switch geometry conversion to "Objects"**:
   - In the IFC Translator settings for "General Import"
   - Change "Building elements for conversion" from "Parametric Construction and MEP Elements" to "Objects"
   - "If you switch this one to 'Objects' you should get correct geometry conversion"
   - This matches the "Exact Geometry" translator settings

2. **Trade-off: elements become Objects instead of native**:
   - "Beams, columns are now objects"
   - Properties are still accessible in the element dialog
   - But hovering over an element won't show the IFC type popup
   - Users need to open the dialog to consult properties

3. **Suspend groups to select individual elements**:
   - When imported as Objects, all elements may be grouped as one object
   - "Maybe you only have to suspend groups, then you can select each element"
   - Use Edit > Suspend Groups to select individual elements

4. **Use "Exact Geometry (object based)" translator**:
   - This translator imports elements as library parts (objects)
   - Geometry is correct and properties are preserved
   - Elements are individually selectable after suspending groups

5. **Link IFC into an empty PLN first**:
   - "We usually link IFCs into an empty PLN started from our template, troubleshoot there, save, and then link into the master file as a Module"
   - This allows troubleshooting in isolation
   - Save the cleaned file and link it into the master model

### Community Report

> "In the 'General Import' translator, the 'Parametric Construction and MEP Elements' option produced geometry errors. If you switch this one to 'Objects' you should get correct geometry conversion. This way you get the same settings as the 'Exact geometry' translator."

## 2. BREP Geometry in IFC Can Only Import as Morphs or Objects

### Symptom

When importing an IFC file with "Construction elements, otherwise Morphs" or "Construction elements, otherwise Objects" setting, all elements import as Morphs or Objects. No native ArchiCAD Construction Elements (beams, columns, walls) are created, even though IFC types are correctly set and recognized in Solibri.

### Root Cause

The IFC file was exported with BREP (Boundary Representation) geometry. ArchiCAD's IFC translator can only convert BREP geometry into Morphs or Objects, not into native Construction Elements. Native element conversion requires the IFC file to contain extruded solid geometry (SweptSolid), not BREP.

### Fix

1. **Understand BREP vs. SweptSolid geometry**:
   - BREP: defines geometry by its boundary surfaces — generic but complex
   - SweptSolid: defines geometry by a profile extruded along a path — simple and parametric
   - ArchiCAD can only create native Construction Elements from SweptSolid
   - BREP geometry can only become Morphs or Objects

2. **Request SweptSolid export from the source software**:
   - Ask the exporting software (Revit, Tekla, etc.) to use SweptSolid geometry representation
   - Revit's IFC export settings have a "Geometry Representation" option
   - Select "SweptSolid" or "Extrusion" instead of "BREP"

3. **Accept Morphs/Objects for BREP IFC files**:
   - If SweptSolid export is not possible, accept Morphs or Objects
   - "With BREP geometry in IFC, you can only get either Morphs or Objects after import in ArchiCAD"
   - Properties and classification data are still preserved
   - Use schedules and classification systems to manage the data

4. **Use Solibri for model checking**:
   - "In Solibri Anywhere the model looks OK"
   - Solibri handles BREP geometry natively
   - Use Solibri for clash detection and model checking
   - Use ArchiCAD for documentation and detailing

5. **Convert Morphs to native elements manually**:
   - After import, manually recreate key elements as native ArchiCAD elements
   - Use the Morph geometry as a reference
   - This is labor-intensive but may be necessary for documentation

### Community Report

> "The geometry in the IFC was exported as BREPS, so the conversion into Archicad does not work if you want to have 'Elements.' With BREP geometry in IFC, you can only get either Morphs or Objects after import in ArchiCAD."

## 3. Publisher Hangs on Section/Elevation Sheets from Vector Fill Overload

### Symptom

Publishing drawing sets in ArchiCAD 29 hangs when reaching section/elevation sheets. The publication process gets a spinning beach ball and never completes. Individual sheets can be published one by one, but publishing a set hangs. A3 sheet with 4 sections of a small project produces a 26MB PDF that Preview and Nitro PDF Pro struggle to open.

### Root Cause

ArchiCAD's PDF output contains unoptimized vector fills and image textures. Sections and elevations contain many vector fills (cut fills, surface fills) that create extremely complex PDF content. Image textures add embedded raster data that inflates file size. The PDF driver ArchiCAD uses doesn't flatten or optimize these elements efficiently.

### Fix

1. **Publish sheets individually**:
   - "We can, painstakingly, publish them one sheet at a time"
   - This works but is very time-consuming
   - Use batch publishing for plans and 3D views (which work fine)

2. **Reduce image compression settings**:
   - In Publisher settings, change image compression from "Lossless" to compressed
   - "Change image compression from lossless will make for much smaller files"
   - Warning: previous attempts at compression produced "psychedelic art" textures
   - Test with a single sheet first

3. **Limit image DPI**:
   - Set images and curves to 150 DPI instead of higher resolutions
   - Deselect "layers & project info" in PDF export settings
   - These reduce PDF complexity and file size

4. **Flatten PDF after export**:
   - "Open the file in Pixelmator Pro (Mac) and export as flattened PDF"
   - "File size drops from 36MB to less than 10MB and opens instantly"
   - This is a post-processing workaround but effective
   - Other tools: Adobe Acrobat Pro, PDF Optimizer

5. **Use JPEG/TIFF/PNG output instead of PDF**:
   - "Attempts to output in jpeg, tiff, or png format reduces the size"
   - Warning: output has 2-3cm empty border making drawings out of scale
   - Not a viable workaround for scaled drawings

6. **Cull non-visible elements**:
   - "AC views need to be able to cull non-visible elements"
   - "You open a PDF in Acrobat, delete a fill, and find a million lines underneath it"
   - Use the "Cut Fill" display options to reduce visible fills
   - Use "Solid" or "Empty" cut fills instead of "Vector" patterns

7. **Request "flattened" PDF option from Graphisoft**:
   - "Graphisoft: Please add the option to publish 'flattened' PDF files to a user defined resolution"
   - This would resolve the issue at the source
   - Vote for feature requests on Graphisoft Community

### Community Report

> "Every time the publication process hangs as soon as it reaches the first sheet of sections/elevations. A3 sheet with 4 sections gives a 26MB file that both Preview and Nitro PDF Pro struggle to open. We open the file in Pixelmator Pro and export as flattened PDF — file size drops from 36MB to less than 10MB."

## 4. IFC Property Mapping Limitations for Complex Data Transformations

### Symptom

The IFC Translator's Property Mapping can't perform complex data transformations. Basic concatenation for text values works, but mathematical operations or conditional logic based on element parameters are not possible. Mappings must be repeatedly reconfigured across different export scenarios.

### Root Cause

The IFC Translator's Property Mapping is designed for simple one-to-one property mappings. It lacks advanced capabilities for mathematical operations, conditional logic, or parameter-based transformations. Mappings only exist in export settings, not in the model itself, so they can't be reused for other purposes.

### Fix

1. **Use a hybrid approach**:
   - "Using Property/Classification Managers for data serving multiple purposes in our workflow, while using the IFC Translator for export-specific mappings"
   - Property Manager expressions for complex calculations
   - Classification Manager for consistent classification
   - IFC Translator for final export mapping

2. **Use Property Manager expressions**:
   - "Property Manager expressions with Classification Manager offers significantly more control"
   - Create sophisticated conditional expressions
   - Use mathematical operations on element parameters
   - Data lives in the model, available for schedules and quantity takeoffs

3. **Create classification-based properties**:
   - Use Classification Manager to classify elements
   - Create properties that depend on classification
   - These properties are available for IFC export mapping
   - Also available for schedules and visualizations

4. **Accept increased model complexity**:
   - "The downside is increased model complexity"
   - More properties = larger model file size
   - Balance between data richness and model performance
   - Only create properties that serve multiple purposes

5. **Pre-process data outside ArchiCAD**:
   - For very complex transformations, export data to Excel
   - Process in Excel with formulas
   - Import back as properties
   - This is manual but handles any transformation

6. **Follow best practices for property placement**:
   - Properties serving multiple purposes → Property Manager
   - Export-specific properties → IFC Translator
   - Classification data → Classification Manager
   - "Has anyone developed best practices for deciding which properties belong in which system?"

### Community Report

> "The IFC Translator's Property Mapping excels at maintaining IFC schema compliance but lacks advanced capabilities for mathematical operations or conditional logic. I've settled on a hybrid approach: Property/Classification Managers for data serving multiple purposes, IFC Translator for export-specific mappings."

## 5. Hotlink Module IFC Geometry Errors from Missing Translator Settings

### Symptom

Importing an IFC file from Revit to ArchiCAD 25 as a hotlink module produces geometry errors. In Solibri, the model looks correct. In ArchiCAD, geometry is distorted or missing. The IFC translator settings don't seem to help.

### Root Cause

The IFC file from Revit may use geometry representations that ArchiCAD's translator doesn't handle well. The Revit IFC export settings (particularly geometry conversion options) affect how ArchiCAD interprets the file. Without knowing the Revit export settings, it's difficult to configure the correct ArchiCAD import translator.

### Fix

1. **Try different IFC import translators**:
   - "Try to use different IFC import parameters from Archicad which will undoubtedly be able to correct the model"
   - Test "Exact Geometry" vs. "General Import" translators
   - Test with different geometry conversion options (Objects, Morphs, Parametric)

2. **Check Revit IFC export settings**:
   - "What were the IFC export settings from Revit? What were the geometry conversion options?"
   - Request the Revit user to use specific export settings
   - Ask for "SweptSolid" geometry representation if possible
   - Ask for IFC2x3 or IFC4 coordination view

3. **Link IFC into an empty PLN first**:
   - "We usually link IFCs into an empty PLN started from our template, troubleshoot there, save, and then link into the master file as a Module"
   - This isolates the IFC import from the master model
   - Troubleshoot geometry in the empty PLN
   - Save and link the cleaned file as a Module

4. **Remove unnecessary elements before linking**:
   - In the empty PLN, remove rivets, nuts, bolts, and washers
   - "Quite necessary on a 24,000m² distribution facility"
   - These small elements bloat the model and cause performance issues
   - Use layer combos to manage visibility

5. **Set up LOD reference MVOs**:
   - Use Model View Options (MVOs) to control element display
   - Create LOD-specific MVOs for different detail levels
   - Apply MVOs to the hotlink module
   - This controls how much detail is shown in different views

6. **Use the IFC translator's import settings**:
   - Check "Convert elements to" options
   - Try "Construction elements, otherwise Morphs" first
   - If that fails, try "Objects" or "Morphs"
   - The key is matching the translator to the IFC file's geometry representation

### Community Report

> "I import IFC file from Revit to Archicad 25 by hotlink module. It has some geometry errors. In Solibri, it's very nice. In Archicad 25, it has an error. Try to use different IFC import parameters from Archicad which will undoubtedly be able to correct the model."

## 6. Additional ArchiCAD IFC and Publisher Issues

### PDF Output Size Border Issue

**Issue**: JPEG/TIFF/PNG output has 2-3cm empty border making drawings out of scale.
**Fix**: This is a known ArchiCAD issue. Use PDF output instead. If raster output is needed, crop the border in image editing software.

### Revision ID "00" Showing "01" on Layouts

**Issue**: Revision ID "00" shows as "01" on Layouts and Publisher.
**Fix**: Check the Revision Setup in the Layout Book. Verify the revision numbering sequence. This may be a display bug — check if the correct ID is stored in the database.

### IFC Translator for Import Doesn't Recognize IFC Type

**Issue**: IFC Type is correctly set in the IFC file and shown in Solibri, but ArchiCAD's translator doesn't recognize it for native element conversion.
**Fix**: The IFC file likely uses BREP geometry. ArchiCAD can only convert SweptSolid geometry to native elements. BREP geometry imports as Morphs or Objects regardless of IFC Type.

### Large IFC Model Performance

**Issue**: Large IFC hotlink modules slow down the master model significantly.
**Fix**: Link IFC into an empty PLN, clean it (remove small elements, simplify geometry), save, and link the cleaned file as a Module. Use MVOs and layer combos to control visibility.

## Best Practices

1. **Use "Objects" conversion in General Import translator** — fixes geometry errors
2. **Request SweptSolid geometry from source software** — enables native element conversion
3. **Link IFC into empty PLN first, then link to master as Module** — isolates troubleshooting
4. **Remove small elements (rivets, bolts, washers)** — prevents model bloat
5. **Publish section/elevation sheets individually** — avoids Publisher hang
6. **Flatten PDFs in Pixelmator Pro or Acrobat** — reduces 36MB to 10MB
7. **Use compressed image settings with 150 DPI** — reduces PDF complexity
8. **Use "Solid" or "Empty" cut fills instead of "Vector"** — reduces PDF vector overload
9. **Use hybrid Property Manager + IFC Translator approach** — handles complex data
10. **Create LOD-specific MVOs for hotlink modules** — controls detail display
