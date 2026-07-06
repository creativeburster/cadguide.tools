---
title: "IJCAD Printing and Plotting: Configuring Japanese Paper Sizes and Plot Styles"
excerpt: "Complete guide to plotting from IJCAD — covering JIS paper size setup, CTB configuration, plot stamp customization, and batch plotting for multi-sheet projects."
category: "printing"
softwareSlug: "ijcad"
keyword: "ijcad printing plotting japanese paper sizes"
slug: "ijcad-printing-plotting-japanese-paper-sizes"
author: "CADGuide Technical Editorial"
readTime: "9 min read"
date: "2026-07-06"
sources:
  - "https://blog.nobledesktop.com/learn/autocad/plotting-printing"
  - "https://docs.fileformat.com/settings/pmp/"
---

# IJCAD Printing and Plotting: Configuring Japanese Paper Sizes and Plot Styles

Plotting from IJCAD is nearly identical to AutoCAD, but the Japanese market defaults and paper size handling have some quirks. I set up plotting for a firm that needed both JIS and ISO output — here's the configuration that worked.

## Step 1: Configure Printer Drivers

IJCAD uses Windows system printers for plotting (no HDI/PC3 drivers). This is simpler than AutoCAD's plotter configuration but means you're limited to what Windows knows about your printer.

1. Install the printer driver in Windows (use the manufacturer's driver, not the Microsoft generic one).
2. In IJCAD, type `PAGESETUP`.
3. Click **New** and name the page setup.
4. In the **Printer/Plotter** dropdown, select your Windows printer.
5. Set paper size, orientation, and plot area.

For PDF output, use "Microsoft Print to PDF" (built into Windows 10/11) or a third-party PDF printer like Bullzip. IJCAD doesn't include a built-in PDF plotter like AutoCAD's "DWG To PDF.pc3".

## Step 2: Set Up JIS Paper Sizes

JIS A-series paper sizes are identical to ISO A-series, so they should appear in the Windows printer's paper size list automatically. If they don't:

1. Open **Printers & Scanners** in Windows Settings.
2. Select your printer → **Printing Preferences**.
3. Check the paper size list — if A1, A2, A3 are missing, install the manufacturer's full driver package.
4. For large-format plotters (HP DesignJet, Canon imagePROGRAF), the driver includes all JIS sizes.

For custom paper sizes (e.g., non-standard drawing sheets):
1. In the printer's **Printing Preferences**, create a custom form.
2. In IJCAD's PAGESETUP, select the custom form from the paper size list.

## Step 3: Configure CTB Plot Style Tables

IJCAD uses CTB (color-dependent) and STB (named) plot style tables — identical format to AutoCAD.

To create a company CTB file:

1. Type `STYLESMANAGER` or navigate to `%PROGRAMDATA%\IJCAD\IJCAD 2026\Plot Styles\`.
2. Copy `IJCAD.ctb` and rename it (e.g., `company-styles.ctb`).
3. Double-click to open the Plot Style Table Editor.
4. Configure each color:
   - **Color 1 (Red)**: Lineweight 0.35 mm — for structural elements
   - **Color 2 (Yellow)**: Lineweight 0.25 mm — for hidden lines
   - **Color 3 (Green)**: Lineweight 0.15 mm — for dimensions
   - **Color 4 (Cyan)**: Lineweight 0.50 mm — for borders and title blocks
   - **Color 7 (White/Black)**: Lineweight 0.18 mm — for general geometry
5. Set **Screening** to 100% for all colors (no dithering).
6. Enable **Line end style: Butt** and **Line join style: Miter** for clean corners.

Save the CTB file to the network plot styles directory and add it to IJCAD's plot style path.

## Step 4: Add a Plot Stamp

Plot stamps add information to the printed sheet (date, filename, scale). IJCAD supports plot stamps:

1. In PAGESETUP or the PLOT dialog, click **Plot Stamp**.
2. Enable **Turn on plot stamp**.
3. Select fields to include:
   - **Drawing name**: Full path of the DWG file
   - **Layout name**: Current layout tab name
   - **Date and time**: Print timestamp
   - **Scale**: Plot scale
   - **Paper size**: Selected sheet size
4. Set **Position**: Lower-left or lower-right corner.
5. Set **Font size**: 2.0 mm.
6. Set **Units**: Millimeters.

For Japanese projects, add custom text in the plot stamp:
- **作成日**: Date
- **尺度**: Scale
- **図番**: Drawing number

## Step 5: Batch Plotting

IJCAD includes a batch plot tool for multi-sheet projects:

1. Type `BATCHPLOT` or go to **File** → **Batch Plot**.
2. Click **Add Drawings** and select multiple DWG files, or add layouts from the current drawing.
3. For each entry, set:
   - **Page setup**: Select the pre-configured page setup
   - **Plot style table**: Select your company CTB
   - **Output**: Printer or PDF file
4. Set **Output folder** for PDF batch output.
5. Click **Plot** to process all sheets.

For recurring batch plots (e.g., weekly issue sets), save the batch list:
1. Configure all sheets in the Batch Plot dialog.
2. Click **Save List** → save as a `.bp` file.
3. Next time, click **Open List** and load the saved configuration.

## Step 6: Plot to Scale

Japanese construction drawings typically use these scales:

| Scale | Use |
|-------|-----|
| 1:1 | Detail drawings |
| 1:5 | Component details |
| 1:50 | Floor plans, sections |
| 1:100 | General arrangement plans |
| 1:200 | Site plans |
| 1:500 | Master plans |
| 1:1000 | Location plans |

To set plot scale:
1. In PLOT dialog, set **Plot scale** to **Custom**.
2. Enter the ratio (e.g., 1 mm = 100 units for 1:100 scale).
3. Verify with the **Preview** button — measure a known dimension on screen to confirm.

## Common Plotting Issues

**Lineweights not showing in PDF**: The PDF printer may be flattening lineweights. In the PDF printer properties, set "Raster/Vector" to **Vector** (not Raster). Vector mode preserves lineweight data.

**Plot stamp overlaps drawing**: Adjust the plot stamp offset in the Plot Stamp settings — increase the X/Y offset to move it away from the drawing border.

**Paper size not available**: The Windows printer driver doesn't know about the paper size. Create a custom form in Windows Server Properties (for server-shared printers) or in the printer's Printing Preferences.
