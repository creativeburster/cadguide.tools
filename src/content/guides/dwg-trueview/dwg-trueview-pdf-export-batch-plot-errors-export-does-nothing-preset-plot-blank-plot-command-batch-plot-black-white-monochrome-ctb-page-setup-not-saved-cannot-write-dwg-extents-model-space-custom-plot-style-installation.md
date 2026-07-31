---
title: "DWG TrueView PDF Export and Batch Plot Errors: Export to PDF Does Nothing from Preset Plot Settings Pointing to Blank Area Requiring Plot Command Instead, Batch Plot Black and White Requires Monochrome CTB Page Setup Not Available by Default, Page Setup Not Saved Between Drawings Because TrueView Cannot Write to DWG Files, Batch Plot Extents Not Available for Model Space Requiring Paper Space Layouts, and Custom Plot Style Tables and Page Sizes Must Be Copied to TrueView Installation Directory"
excerpt: "DWG TrueView fails for 5 distinct reasons: Export to PDF does nothing because preset plot settings point to a blank area requiring Plot command instead, Batch Plot black and white requires monochrome CTB page setup not available by default in TrueView, Page Setup is not saved between drawings because TrueView cannot write to DWG files, Batch Plot Extents option not available for Model Space requiring Paper Space layouts, and custom plot style tables and page sizes must be manually copied to TrueView installation directory. We cover each with fixes from Autodesk Community."
category: "pdf-export-and-batch-plot-errors"
softwareSlug: "dwg-trueview"
keyword: "DWG TrueView Export to PDF does nothing preset plot settings blank area Plot command Batch Plot black and white monochrome CTB page setup Page Setup not saved cannot write DWG Batch Plot Extents Model Space Paper Space layouts custom plot style table page sizes installation directory"
slug: "dwg-trueview-pdf-export-batch-plot-errors-export-does-nothing-preset-plot-blank-plot-command-batch-plot-black-white-monochrome-ctb-page-setup-not-saved-cannot-write-dwg-extents-model-space-custom-plot-style-installation"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-07-31"
sources:
  - "https://forums.autodesk.com/t5/dwg-trueview-forum/trueview-doesn-t-remember-default-plot-settings/td-p/12501523"
  - "https://forums.autodesk.com/t5/dwg-trueview-forum/trueview-printing-black-and-white-in-batch-plotting/td-p/8976501"
  - "https://forums.autodesk.com/t5/dwg-trueview/dwg-trueview-wont-export-to-pdf/td-p/5441134"
---

# DWG TrueView PDF Export and Batch Plot Errors: Export to PDF Does Nothing from Preset Plot Settings Pointing to Blank Area Requiring Plot Command Instead, Batch Plot Black and White Requires Monochrome CTB Page Setup Not Available by Default, Page Setup Not Saved Between Drawings Because TrueView Cannot Write to DWG Files, Batch Plot Extents Not Available for Model Space Requiring Paper Space Layouts, and Custom Plot Style Tables and Page Sizes Must Be Copied to TrueView Installation Directory

DWG TrueView's PDF export, batch plotting, and page setup management produce errors from preset plot settings, missing monochrome configurations, and file write limitations. This guide covers the 5 most common DWG TrueView problems with diagnostic steps and community-verified fixes from Autodesk Community.

## 1. Export to PDF Does Nothing from Preset Plot Settings

### Symptom

Using Big Green D icon > Export > PDF, the Save As PDF dialog appears, the user clicks Save, "Export to PDF" is displayed above the command bar, then nothing happens. No warning, no error, no file in the specified location. This previously worked in older TrueView versions.

### Root Cause

The Export command uses preset plot settings stored in the DWG file. If the page setup in the DWG file points to a blank area of the drawing (no visible geometry in the configured plot window), the export produces an empty or non-existent PDF. The Export command doesn't prompt for plot settings — it silently uses whatever is stored in the file.

### Fix

1. **Use Plot command instead of Export**:
   - "'Export' uses preset plot settings in your file: if that is set to a blank spot in your file you get nothing"
   - "Plot to PDF instead, and actively select what you want to plot and final output size"
   - Use Big Green D icon > Print > Plot
   - Select the area to plot, paper size, and plot style manually

2. **Check the Page Setup in the DWG file**:
   - Open Page Setup Manager
   - Check what area is defined for plotting
   - If the plot area is set to "Window" and the window is in a blank area, change it to "Extents" or "Display"
   - Note: TrueView cannot save changes to the DWG file

3. **Use Plot with explicit settings**:
   - Select printer: DWG to PDF.pc3
   - Select paper size
   - Select plot area: Extents or Window
   - Select plot style: monochrome.ctb for B&W
   - Check "Fit to paper" or set scale
   - Click OK to plot

4. **For 3D DWG files**:
   - TrueView's PDF export produces poor results for 3D models
   - "You need full AutoCAD for the full expanded offerings under the SHADE PLOT pulldown menu"
   - Use Plot command and select shaded viewport options
   - Consider eDrawings Viewer for 3D model PDF export

### Community Report

> "'Export' uses preset plot settings in your file: if that is set to a blank spot in your file you get nothing. 'Plot' to PDF instead, and actively select what you want to plot and final output size."

## 2. Batch Plot Black and White Requires Monochrome CTB

### Symptom

Batch plotting multiple drawings to a single PDF. When publishing to "PDF," there is no option for black and white. When publishing to "Plotter named in page setup" with Adobe PDF, each model saves as an individual PDF instead of a single merged file.

### Root Cause

DWG TrueView's Batch Plot (Publish) doesn't have a built-in black and white option. B&W output requires a monochrome plot style table (.ctb file) applied through a Page Setup. TrueView doesn't include preset B&W page setups — they must be created in AutoCAD and imported. The built-in PDF publisher can merge to a single PDF but doesn't support plot style tables. The "Plotter named in page setup" option respects CTB files but produces individual PDFs.

### Fix

1. **Create a monochrome page setup in AutoCAD**:
   - In AutoCAD, create a Page Setup using monochrome.ctb
   - Save the page setup in a template file (.dwt)
   - In TrueView's Batch Plot, import this page setup as an override

2. **Use the built-in PDF publisher for merged output**:
   - In Batch Plot, select "Publish to PDF"
   - This merges all sheets into a single PDF
   - But doesn't apply B&W plot styles
   - Accept color output or post-process to grayscale

3. **Use Adobe PDF with individual files, then merge**:
   - Select "Plotter named in page setup"
   - Use Adobe PDF with monochrome.ctb
   - Each sheet saves as individual PDF
   - Merge using free tools like PDFMerge.com or Adobe Acrobat

4. **Import page setup from template**:
   - In Batch Plot dialog, click "Import"
   - Select a .dwt or .dwg file with B&W page setup
   - Apply the imported page setup to all sheets
   - This applies monochrome plot style to all drawings

5. **Copy monochrome.ctb to TrueView directory**:
   - Copy monochrome.ctb from AutoCAD installation
   - Paste to TrueView's plot style directory
   - The CTB file will be available in Plot and Page Setup dialogs

### Community Report

> "If I choose publish to 'PDF,' I do not get an option to print in black and white. If I choose 'Plotter named in page setup' then I can print to Adobe PDF which allows B&W, however it saves each model as an individual page. You need a B&W pagesetup from a template."

## 3. Page Setup Not Saved Between Drawings

### Symptom

In DWG TrueView 2021, going to Page Setup Manager and configuring plot settings works for the current drawing. But when opening the next drawing, the settings are gone. Each drawing requires reconfiguring page setup from scratch, which is extremely time-consuming for 20+ drawings.

### Root Cause

DWG TrueView is a viewer — it cannot write to DWG files. Any page setup changes made in TrueView are temporary and exist only in the current session. When the drawing is closed, the page setup is lost. Unlike AutoCAD, which saves page setups in the DWG file, TrueView has no persistence mechanism.

### Fix

1. **Understand TrueView's limitations**:
   - "TrueView is all about one-off functionality: nothing is saved for reuse"
   - "It has no ability to write anything to the DWG file for reuse"
   - Page setups must be recreated for each drawing

2. **Use Batch Plot with template override**:
   - Create a template file (.dwt) in AutoCAD with the desired page setup
   - In TrueView's Batch Plot, import the template
   - The page setup from the template overrides individual drawing settings
   - This applies consistent settings to all drawings in the batch

3. **Use the same page setup name across drawings**:
   - If drawings already have page setups with the same name
   - TrueView will use the settings from the first drawing's page setup
   - Ensure all drawings use consistent page setup names

4. **Create a script for batch processing**:
   - Write a script (.scr) file that sets page setup and plots
   - Run the script on each drawing using TrueView's command line
   - This automates the repetitive page setup process

5. **Upgrade to AutoCAD LT for batch processing**:
   - If batch plotting is a regular workflow
   - AutoCAD LT can save page setups in DWG files
   - AutoCAD LT has full Batch Plot/Publish functionality
   - "If you need something even faster, you will need to purchase a software solution"

6. **Use third-party DWG viewers with batch capabilities**:
   - Some third-party viewers can save settings
   - Consider DraftSight, nanoCAD, or Bentley View
   - These may offer better batch plotting than TrueView

### Community Report

> "TrueView is all about one-off functionality: nothing is saved for reuse. It has no ability to write anything to the DWG file for reuse. I've been going to page setup manager and setting it up to print, and it doesn't save what you set up on the next set of drawings."

## 4. Batch Plot Extents Not Available for Model Space

### Symptom

Batch plotting ~20 drawings to one PDF. Each drawing is either zoomed in too much or zoomed out too much. Need to use "Extents" option so all 20 pages print to the outer extents of the drawing. But the Extents option is not available in Batch Plot for Model Space drawings.

### Root Cause

DWG TrueView's Batch Plot doesn't support Extents plotting for Model Space. Batch Plot relies on page setups stored in the DWG file. If drawings are in Model Space without predefined page setups, TrueView uses default settings which may not match the drawing extents. Paper Space layouts with predefined page setups work correctly in Batch Plot.

### Fix

1. **Use Paper Space layouts instead of Model Space**:
   - "Paperspace tabs will follow the predefined pagesetup for each of those layouts"
   - If drawings have Paper Space layouts, Batch Plot uses their page setups
   - Model Space drawings need to be converted to Paper Space in AutoCAD

2. **Set page setup in AutoCAD before sharing**:
   - In AutoCAD, create Page Setups with Extents for each layout
   - Save the DWG file with the page setups
   - TrueView will use these page setups in Batch Plot

3. **Plot individually with Extents**:
   - For Model Space drawings, use Plot command (not Batch Plot)
   - Select Extents as the plot area
   - Plot each drawing individually to PDF
   - Merge PDFs using a separate tool

4. **Use template override with Extents**:
   - Create a template (.dwt) in AutoCAD with Extents page setup
   - In TrueView Batch Plot, import the template
   - Apply the Extents page setup as an override to all sheets
   - This only works for Paper Space layouts, not Model Space

5. **Accept that TrueView has limitations for Model Space**:
   - "The free viewer does nothing like that as a built-in tool if you are only using modelspace"
   - For Model Space batch plotting, use AutoCAD or AutoCAD LT
   - TrueView is designed for viewing and one-off plotting, not batch processing

### Community Report

> "I have about 20 pages I'd like to batch plot to one PDF. Each drawing is either zoomed in too much or zoomed out too much. The free viewer does nothing like that as a built-in tool if you are only using modelspace."

## 5. Custom Plot Style Tables and Page Sizes Must Be Copied to Installation Directory

### Symptom

Custom monochrome plot style table (monochrome_custom.ctb) and custom page sizes in a modified DWG to PDF.pc3 work in AutoCAD but not in DWG TrueView. Even when set as defaults in TrueView options, they're not used when opening DWG files. The settings reset to basic defaults each time.

### Root Cause

DWG TrueView looks for plot style tables (.ctb), plotter configuration files (.pc3), and plot model files (.pmp) in its own installation directory. Files placed in AutoCAD's directory are not found by TrueView. Additionally, PAGESETUP settings stored in the DWG file always override TrueView's program defaults — this is by design in all AutoCAD-based products.

### Fix

1. **Copy custom files to TrueView's directory**:
   - Copy .ctb files to TrueView's Plot Styles directory
   - Copy .pc3 files to TrueView's Plotters directory
   - Copy .pmp files to the same Plotters directory
   - "DWG TrueView will fetch the proper .pmp, .ctb and .pc3 files by name"

2. **Use the same file names**:
   - "Names need to be the same"
   - If the DWG file references "monochrome_custom.ctb"
   - TrueView looks for that exact filename in its plot style directory
   - If found, it uses it; if not, it falls back to defaults

3. **Understand that PAGESETUP overrides defaults**:
   - "PAGESETUP settings in the DWG file will ALWAYS override program defaults"
   - "Autodesk for 40+ years now gives the file creator total control inside each DWG file"
   - If the DWG has a page setup, it takes precedence over TrueView's defaults
   - This is not a bug — it's by design

4. **Distribute custom files to all users**:
   - "In order to have 1:1 outcome for each user, I copied those files to their DWG TrueView directory"
   - Each user needs the same .ctb, .pc3, and .pmp files
   - Create an installation script for deployment
   - Verify file names match exactly

5. **Check TrueView version directories**:
   - Different TrueView versions have different installation paths
   - Check: `C:\Program Files\Autodesk\DWG TrueView 20XX\`
   - Plot Styles subfolder: `...\UserDataCache\Plot Styles\`
   - Plotters subfolder: `...\UserDataCache\Plotters\`

6. **Set defaults in TrueView Options**:
   - In TrueView Options, set default plot style table and printer
   - These defaults apply only when the DWG file doesn't have its own page setup
   - "They work just fine except that even though they're set as default, they're not used when opening a DWG"

### Community Report

> "I've created and renamed copies of .pmp, monochrome.ctb and .pc3 files. In order to have 1:1 outcome for each user, I copied those files to their DWG TrueView directory — names need to be the same. DWG TrueView will fetch the proper files by name. PAGESETUP settings in the DWG file will ALWAYS override program defaults."

## 6. Additional DWG TrueView Issues

### 3D DWG PDF Export Quality

**Issue**: PDF export of 3D DWG files produces wireframe with excess lines or poor quality.
**Fix**: "You need full AutoCAD for the SHADE PLOT pulldown menu." TrueView doesn't support shaded viewport plotting. Use eDrawings Viewer for 3D model PDF export, or use SketchUp Pro for high-quality 2D vector export of 3D models.

### Batch Plot Fails to Merge PDFs

**Issue**: Batch Plot to Adobe PDF fails to merge drawings, thinking Adobe is already open.
**Fix**: Close Adobe Acrobat before running Batch Plot. Use the built-in "Publish to PDF" option instead of Adobe PDF for merged output. Or use a free PDF merge tool after individual plotting.

### Drawings Show White Corner with Grey Remainder

**Issue**: In Batch Plot, drawings show a white corner with grey remainder, plotting only the white area.
**Fix**: "White is the sheet size selected in PAGESETUP. 'WHAT TO PLOT' is set to only look at that white sheet." The drawing's page setup defines the plot area. Use Plot command to select the correct area manually.

### Line Width Control in Exported PDF

**Issue**: Need to adjust line widths in exported PDF.
**Fix**: "You can if you have access to a plot style table developed with that particular DWG file." Use a .ctb file with pen settings for line widths. Copy the .ctb to TrueView's plot style directory.

## Best Practices

1. **Use Plot command instead of Export for reliable PDF output** — Export uses silent preset settings
2. **Create monochrome page setups in AutoCAD** — TrueView can't create them
3. **Import page setup template in Batch Plot** — applies consistent settings
4. **Don't expect TrueView to save page setups** — it can't write to DWG files
5. **Use Paper Space layouts for Batch Plot** — Model Space Extents not supported
6. **Copy .ctb, .pc3, .pmp to TrueView directory** — same filenames as in DWG
7. **Distribute custom plot files to all users** — ensures consistent output
8. **Understand PAGESETUP overrides defaults** — by design in all AutoCAD products
9. **Close Adobe Acrobat before Batch Plot** — prevents merge failures
10. **Consider AutoCAD LT for regular batch plotting** — TrueView is for one-off use
