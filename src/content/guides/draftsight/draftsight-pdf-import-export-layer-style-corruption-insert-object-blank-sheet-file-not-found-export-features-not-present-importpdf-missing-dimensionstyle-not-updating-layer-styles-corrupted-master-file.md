---
title: "DraftSight PDF Import Export and Layer Style Corruption: PDF Import Inconsistent from INSERT OBJECT Showing Blank White Sheet or File Not Found, PDF Export Shows Features Not Present in Drawing from Layer Recollection and Blocking, ImportPDF Command Missing from Ribbon in DraftSight Professional, DimensionStyle Not Updating Without Switching Away and Back, and Layer Styles Corrupted on Export Requiring Master File Workaround"
excerpt: "DraftSight fails for 5 distinct reasons: PDF import via INSERT OBJECT is inconsistent showing blank sheets or file not found errors, PDF export shows features not present in the drawing from layer recollection and blocking artifacts, ImportPDF command missing from the ribbon in DraftSight Professional, DimensionStyle not updating without switching to a different style and back, and layer styles corrupted on export requiring a master file with layer states workaround. We cover each with fixes from Dassault DraftSight Community and Eng-Tips."
category: "pdf-import-export-and-layer-style-errors"
softwareSlug: "draftsight"
keyword: "DraftSight PDF import INSERT OBJECT blank white sheet file not found PDF export features not present layer recollection blocking ImportPDF command missing ribbon Professional DimensionStyle not updating switching layer styles corrupted export master file layer states"
slug: "draftsight-pdf-import-export-layer-style-corruption-insert-object-blank-sheet-file-not-found-export-features-not-present-importpdf-missing-dimensionstyle-not-updating-layer-styles-corrupted-master-file"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-07-31"
sources:
  - "https://3dswym.3dexperience.3ds.com/question/draftsight-user-community/importing-pdf-issues_9035"
  - "https://3dswym.3dexperience.3ds.com/question/draftsight-user-community/resulting-output-files-from-pdf-export-shows-features-not-present-in-draftsight-model-or-layout_10474"
  - "https://www.eng-tips.com/threads/draftsight-vba-dimensionstyle-not-updating.480200/"
---

# DraftSight PDF Import Export and Layer Style Corruption: PDF Import Inconsistent from INSERT OBJECT Showing Blank White Sheet or File Not Found, PDF Export Shows Features Not Present in Drawing from Layer Recollection and Blocking, ImportPDF Command Missing from Ribbon in DraftSight Professional, DimensionStyle Not Updating Without Switching Away and Back, and Layer Styles Corrupted on Export Requiring Master File Workaround

DraftSight's PDF import, PDF export, dimension styles, and layer management produce errors from inconsistent object insertion, layer state issues, and style corruption. This guide covers the 5 most common DraftSight problems with diagnostic steps and community-verified fixes from Dassault DraftSight Community and Eng-Tips.

## 1. PDF Import via INSERT OBJECT Inconsistent

### Symptom

Importing PDFs into DraftSight via INSERT OBJECT produces inconsistent results:
- Sometimes: PDF is visible and can be scaled
- Sometimes: just a white blank sheet
- Sometimes: just an outline
- Sometimes: "path/filename.pdf does not exist" even though the file exists and can be opened in Adobe

Saving as PNG and using INSERT REFERENCE IMAGE produces similar inconsistent results.

### Root Cause

DraftSight's INSERT OBJECT command uses OLE (Object Linking and Embedding) to insert PDFs. OLE relies on the system's PDF viewer (typically Adobe Acrobat) to render the PDF. If the PDF viewer is not properly registered, or if the PDF contains features the viewer can't render in OLE mode, the insertion fails silently. The "file not found" error occurs when the OLE system can't resolve the file path, even though the file exists.

### Fix

1. **Use PDFIMPORT command instead of INSERT OBJECT**:
   - DraftSight Professional has a PDFIMPORT command
   - This converts PDF geometry to native DraftSight entities (lines, arcs, text)
   - More reliable than OLE insertion
   - Check if the command is available: type PDFIMPORT at the command line

2. **Use INSERT REFERENCE IMAGE with PNG/TIFF**:
   - Convert PDF to high-resolution PNG or TIFF in Adobe Acrobat
   - Use INSERT > REFERENCE IMAGE to insert the raster image
   - Scale the image to match the drawing dimensions
   - Draw on top of the image

3. **Ensure Adobe Acrobat is the default PDF viewer**:
   - OLE relies on the default PDF viewer
   - Set Adobe Acrobat as the default application for .pdf files
   - Other PDF viewers may not support OLE properly

4. **Check file path for special characters**:
   - Avoid spaces, special characters, and very long paths
   - Move the PDF to a simple path like C:\temp\drawing.pdf
   - Network paths (UNC paths) may cause "file not found" errors

5. **Use PDF Underlay if available**:
   - Some DraftSight versions support PDF Underlay (like AutoCAD)
   - Check Insert > Reference > PDF Underlay
   - This is more reliable than INSERT OBJECT

6. **Reinstall or repair DraftSight**:
   - If ImportPDF command is missing from the ribbon
   - "My DraftSight Professional is no longer showing the option to import a PDF"
   - Run the DraftSight installer in Repair mode
   - Check that the Professional license is active

### Community Report

> "I'm having mixed results when I try to use the INSERT OBJECT option. Sometimes I get a PDF that I can see and scale. Sometimes I get just a white blank sheet. Sometimes I get 'path/filename.pdf does not exist' even though I can see it in the preview pane."

## 2. PDF Export Shows Features Not Present in Drawing

### Symptom

After exporting drawings to PDF from DraftSight, the PDF shows features not present in the DraftSight Model or Layout. Certain features are not colored in completely. The PDF seems to keep a "recollection" of transformations and movements made to features in the drawing. When opening the PDF in Adobe Illustrator, each feature appears correct when isolated, but something blocks features from appearing as they should.

### Root Cause

DraftSight's PDF export retains layer state history — previous positions and states of features are embedded in the PDF. The "Use layers in PDF file" option creates PDF layers that may overlap or block each other. Hatched or filled features create overlapping regions in the PDF that obscure each other. The 600 DPI bitmap resolution setting may cause rendering issues with complex hatches.

### Fix

1. **Disable "Use layers in PDF file"**:
   - In the PDF export dialog, uncheck "Use layers in PDF file"
   - This flattens the PDF, removing layer history
   - Features will appear as they do in the DraftSight layout

2. **Reduce bitmap resolution**:
   - "Custom Bitmap Resolution" at 600 DPI may cause issues
   - Try 300 DPI or 150 DPI
   - Higher DPI can cause rendering artifacts with complex hatches

3. **Use embedded TrueType fonts with optimization**:
   - Keep "embedded" for TrueType fonts
   - Check "optimized" box
   - This ensures text renders correctly in the PDF

4. **Clean the drawing before export**:
   - Use PURGE to remove unused layers, blocks, and styles
   - Use AUDIT to fix drawing errors
   - Remove any hidden or frozen layers that might export unexpectedly

5. **Check hatch patterns**:
   - Complex hatch patterns may not export correctly
   - Simplify hatches or use solid fills
   - Ensure hatch boundaries are closed and clean

6. **Export to DWG and use another program for PDF**:
   - If DraftSight's PDF export continues to produce artifacts
   - Export to DWG and open in AutoCAD or BricsCAD
   - Use their PDF export, which may handle layers and hatches better

7. **Flatten in Adobe Illustrator**:
   - "I opened one of the PDFs in Adobe Illustrator and when selecting each feature, while isolated, appeared as it did in DraftSight"
   - Use Illustrator to clean up the PDF
   - Remove blocking objects and re-export

### Community Report

> "The PDF seemed to keep a recollection of some of the transformations and movements made of features in the drawing. Certain features were not colored in completely. In Adobe Illustrator, each feature appeared correct when isolated, but something was blocking each feature from appearing as it should."

## 3. ImportPDF Command Missing from Ribbon

### Symptom

DraftSight Professional no longer shows the option to import a PDF from the Import tab. The ImportPDF command is not recognized at the command line. This previously worked but stopped after an update or license change.

### Root Cause

The ImportPDF feature requires a DraftSight Professional or Enterprise license. If the license expires, changes type, or the installation is corrupted, the ImportPDF command becomes unavailable. An update may have reset the ribbon configuration, hiding the Import PDF button.

### Fix

1. **Verify license type**:
   - Check Help > About DraftSight to verify the license type
   - ImportPDF requires Professional or Enterprise
   - DraftSight Standard does not include PDF import

2. **Type the command directly**:
   - Even if the ribbon button is missing, the command may still work
   - Type `ImportPDF` or `PDFIMPORT` at the command line
   - If the command works, the ribbon just needs to be reset

3. **Reset the ribbon**:
   - Right-click on the ribbon area
   - Select "Reset Ribbon" or "Restore Default Ribbon"
   - This restores all default tabs and buttons

4. **Repair the installation**:
   - Run the DraftSight installer
   - Select "Repair" option
   - This restores missing files and registry entries

5. **Check for updates**:
   - An update may have removed or relocated the ImportPDF feature
   - Check for the latest DraftSight service pack
   - Install the latest version

6. **Reinstall DraftSight**:
   - If repair doesn't work, uninstall completely
   - Delete the DraftSight folder in AppData
   - Reinstall the latest version
   - Activate with the correct license

### Community Report

> "My DraftSight Professional is no longer showing the option to import a PDF from the Import tab, and doesn't recognise the ImportPDF command."

## 4. DimensionStyle Not Updating Without Switching

### Symptom

After modifying a DimensionStyle in DraftSight, existing dimensions don't update to reflect the new style. The dimensions only update after switching to a different DimensionStyle and then back to the desired one. This happens both in the VBA API and in the DraftSight GUI.

### Root Cause

DraftSight's DimensionStyle update mechanism has a bug where style changes don't trigger a redraw of existing dimensions. The dimensions retain the old style properties until a style switch forces a refresh. This is a known issue in both the GUI and the API.

### Fix

1. **Switch to a different DimensionStyle and back**:
   - "You need to change to different DimensionStyle, and then back to the one you want and then it gets updated"
   - In the DimensionStyle Manager, select a different style
   - Set it as current
   - Then switch back to the desired style
   - Existing dimensions will update

2. **Use DIMUPDATE command**:
   - Select the dimensions that need updating
   - Run DIMUPDATE or -DIMSTYLE > Apply
   - This forces the selected dimensions to adopt the current style

3. **Force redraw**:
   - After changing the DimensionStyle, run REGEN or REGENALL
   - This forces a full drawing regeneration
   - May trigger the dimension update

4. **VBA workaround**:
   - In VBA, after modifying the DimensionStyle:
   - Set the active DimensionStyle to a different style
   - Then set it back to the modified style
   - This triggers the update programmatically

5. **Save and reopen**:
   - Save the drawing
   - Close and reopen
   - Dimensions should display with the updated style

6. **Report the bug to Dassault**:
   - This is a confirmed bug in both GUI and API
   - Submit a support ticket to Dassault Systèmes
   - Track for fixes in future service packs

### Community Report

> "DimensionStyle is not updating. It's the same problem within DraftSight GUI. You need to change to different DimensionStyle, and then back to the one you want and then it gets updated."

## 5. Layer Styles Corrupted on Export

### Symptom

Layer styles in DraftSight Standard 2020 become corrupted. When saving and re-exporting layer styles, the exported file is reported as corrupted when imported into a new drawing. Default colors save properly, and at least 1 custom color saves properly, but additional custom colors cause corruption. The issue occurs even with freshly created layer styles in a new blank drawing.

### Root Cause

DraftSight's layer style export has a bug where multiple custom colors in a layer style create an invalid file format. The exported file appears correct when viewed in a text editor (Notepad++), but DraftSight's import routine can't parse it. The corruption is in the interpretation, not the file content.

### Fix

1. **Use the master file workaround**:
   - "I made a master file with all my layer styles drawn out in a row of lines on a blank file"
   - "I copied and pasted the drawing to another file, opened the layer states manager, and added a layer state"
   - "I was then able to import my layer styles on that file, but only if they matched the layer names"

2. **Use Layer States instead of Layer Style export**:
   - Create Layer States in the Layer States Manager
   - Layer States include all layer properties (color, linetype, lineweight)
   - Export and import Layer States instead of individual layer styles

3. **Limit to one custom color per style**:
   - "At least 1 custom color will also save and export properly"
   - Multiple custom colors trigger the corruption
   - Use default colors for additional layers
   - Manually change colors after import

4. **Copy and paste between files**:
   - Instead of exporting/importing layer styles
   - Open both files simultaneously
   - Copy objects from the source file
   - Paste into the target file
   - Layer properties come with the pasted objects

5. **Use Design Explorer for layer management**:
   - DraftSight's Design Explorer can manage layers across files
   - Use it to synchronize layer properties
   - More reliable than export/import

6. **Check file with Notepad++**:
   - "I opened the Layer files with Notepad++ and compared with functional files — they all look fine"
   - The file content is correct but DraftSight's parser fails
   - This confirms it's a DraftSight bug, not a file issue

### Community Report

> "I recreated the layer style manually on a brand new blank drawing, re-exported it, opened another new file and imported it — and was told the style was corrupted. Through experimentation, I found a temporary workaround: I made a master file with all my layer styles drawn out as lines, then used Layer States Manager."

## 6. Additional DraftSight Issues

### PDF Import for Historical Drawings

**Issue**: Need to import PDF scans of hand-drawn prints from 1947 for redrawing.
**Fix**: Convert PDF to high-resolution PNG (600 DPI) in Acrobat. Use INSERT REFERENCE IMAGE in DraftSight. Scale the image to match known dimensions. Draw on top of the image.

### PDF Export Paper Size

**Issue**: PDF export doesn't match the specified paper size (17x11 inches).
**Fix**: Verify paper size in Page Setup Manager. Check that the layout's page setup matches the export settings. Use custom paper size if standard sizes don't match.

### TrueType Font Embedding

**Issue**: Fonts don't display correctly in exported PDF.
**Fix**: In PDF export options, select "embedded" for TrueType fonts. Check "optimized" box. Verify fonts are installed on the system. Use standard fonts (Arial, Times New Roman) for maximum compatibility.

### Multiple Drawings with Shared Layers

**Issue**: Managing layers across multiple clipped drawings from a larger geographical area.
**Fix**: Use a master template file with all layers defined. Use Layer States to import/export layer configurations. Copy and paste between files to transfer layer properties.

## Best Practices

1. **Use PDFIMPORT command instead of INSERT OBJECT** — more reliable
2. **Disable "Use layers in PDF file" for clean PDF export** — prevents artifacts
3. **Reduce bitmap resolution to 300 DPI** — avoids rendering issues
4. **Verify Professional license for ImportPDF** — Standard doesn't include it
5. **Switch DimensionStyle away and back to force update** — known bug workaround
6. **Use DIMUPDATE to force dimension updates** — alternative to style switching
7. **Use Layer States instead of Layer Style export** — avoids corruption
8. **Limit to one custom color per layer style** — prevents export corruption
9. **Copy and paste between files for layer transfer** — more reliable than export/import
10. **Run PURGE and AUDIT before PDF export** — cleans the drawing
