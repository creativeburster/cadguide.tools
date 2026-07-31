---
title: "GstarCAD LISP Compatibility and DWG PDF Export Errors: AutoCAD LISP Not Loading from Unicode Encoding Mismatch Requiring LISPSYS System Variable, DWG to PDF Export Missing Plot Style Table Requiring Monochrome CTB Configuration, Custom Hatch Patterns Not Found from Search Path Misconfiguration Requiring Options File Locations, Command Aliases Not Working from gacd.pgp File Not Migrated Requiring Settings Import, and Batch Plot to PDF Not Merging Multiple Drawings Requiring Individual Plot and External Merge"
excerpt: "GstarCAD fails for 5 distinct reasons: AutoCAD LISP not loading from Unicode encoding mismatch requiring LISPSYS system variable switch, DWG to PDF export missing plot style table requiring monochrome CTB configuration in Plot dialog, custom hatch patterns not found from search path misconfiguration requiring Options File Locations setup, command aliases not working from gacd.pgp file not migrated requiring Settings Import from AutoCAD, and Batch Plot to PDF not merging multiple drawings requiring individual plot and external merge. We cover each with fixes from GstarCAD User Guide and CADTutor Forum."
category: "lisp-compatibility-and-pdf-export-errors"
softwareSlug: "gstar-cad"
keyword: "GstarCAD AutoCAD LISP not loading Unicode encoding LISPSYS system variable DWG to PDF export plot style table monochrome CTB custom hatch patterns search path Options File Locations command aliases gacd.pgp not migrated Settings Import Batch Plot PDF not merging individual plot external merge"
slug: "gstar-cad-lisp-compatibility-dwg-pdf-export-errors-lisp-not-loading-unicode-lispsys-dwg-pdf-plot-style-monochrome-ctb-hatch-patterns-search-path-command-aliases-gacd-pgp-migrated-settings-import-batch-plot-not-merging"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://www.cadtutor.net/forum/topic/78569-help-me-to-fix-an-autocad-lisp-to-work-with-gstarcad/"
  - "https://blog.gstarcad.net/how-to-convert-dwg-to-pdf-with-gstarcad-2026-and-other-methods/"
  - "https://cdn-sg-gw.gstarcad.net/gstarsoft_pdf/GstarCAD_2027_User_Guide.pdf"
---

# GstarCAD LISP Compatibility and DWG PDF Export Errors: AutoCAD LISP Not Loading from Unicode Encoding Mismatch Requiring LISPSYS System Variable, DWG to PDF Export Missing Plot Style Table Requiring Monochrome CTB Configuration, Custom Hatch Patterns Not Found from Search Path Misconfiguration Requiring Options File Locations, Command Aliases Not Working from gacd.pgp File Not Migrated Requiring Settings Import, and Batch Plot to PDF Not Merging Multiple Drawings Requiring Individual Plot and External Merge

GstarCAD's LISP compatibility, PDF export, hatch patterns, and command aliases produce errors from encoding mismatches, missing plot styles, and unmigrated settings. This guide covers the 5 most common GstarCAD problems with diagnostic steps and community-verified fixes from GstarCAD User Guide and CADTutor Forum.

## 1. AutoCAD LISP Not Loading from Unicode Encoding Mismatch

### Symptom

AutoCAD LISP files (.lsp) work in AutoCAD but fail to load in GstarCAD. The LISP program contains strings with non-ASCII characters (Chinese, Japanese, accented characters). Loading fails silently or with encoding errors. DCL dialog files also fail to load, causing GstarCAD to get stuck.

### Root Cause

GstarCAD's LISP engine historically used ASCII (MBCS) character encoding, while AutoCAD LISP files may use Unicode (UTF-8 or UTF-16). When GstarCAD tries to load a Unicode-encoded LISP file with the ASCII engine, string parsing fails. DCL files with non-ASCII characters also fail. GstarCAD 2024+ improved Unicode support but requires the LISPSYS system variable to be set correctly.

### Fix

1. **Set LISPSYS system variable**:
   - GstarCAD 2024+ has a LISPSYS system variable
   - "Supports switching between using ASCII (MBCS) or Unicode character sets when saving or compiling LSP files"
   - Set LISPSYS to 1 for full Unicode support
   - LISPSYS = 0: ASCII (MBCS), VS Code as editor, GstarLisp doesn't fully support Unicode
   - LISPSYS = 1: Full Unicode support, VS Code as editor

2. **Re-save LISP files with correct encoding**:
   - Open the LISP file in VS Code
   - Save with UTF-8 encoding (without BOM)
   - Or save with the encoding matching LISPSYS setting
   - "The compatibility of the LISP engine with Unicode encoding has been improved"

3. **Check DCL file encoding**:
   - "The compatibility of DCL with Unicode encoding has also been improved"
   - "Resolving the issue of software stuck caused by failed dialog calls"
   - Re-save DCL files with UTF-8 encoding
   - Ensure Chinese support in DCL code is fixed

4. **Use FAS5 protocol for compiled files**:
   - "Supports the FAS5 protocol type in LISP binary compiled files"
   - "Supports the parsing of Unicode characters in file paths and file names"
   - Compile LISP files to FAS5 format for better Unicode compatibility

5. **Check for unsupported AutoCAD LISP functions**:
   - Some AutoCAD-specific LISP functions may not be implemented in GstarCAD
   - Check GstarCAD's LISP documentation for supported functions
   - Use GRX, .NET, or VBA alternatives for unsupported functions
   - "GstarCAD offers friendly development interfaces such as GRX, .NET, VBA, LISP, and COM"

6. **Use the LISP Debugger**:
   - GstarCAD includes a LISP Debugger (Chapter 15.4 in User Guide)
   - Use it to step through LISP code and identify failures
   - Check variable values and function returns

### Community Report

> "The compatibility of the LISP engine with Unicode encoding has been improved, supporting UTF-8 and UTF-16 for writing LISP programs. This resolves the issue of loading failure caused by strings containing multiple languages. DCL compatibility with Unicode has also been improved, resolving software stuck from failed dialog calls."

## 2. DWG to PDF Export Missing Plot Style Table

### Symptom

Exporting DWG to PDF in GstarCAD produces color output instead of black and white. The monochrome plot style table (monochrome.ctb) is not available in the plot dialog. Need to produce B&W PDFs for construction documents.

### Root Cause

GstarCAD's default installation may not include monochrome.ctb in the plot style search path, or the plot style search path in Options is not configured correctly. The Plot dialog requires selecting a CTB file from the plot style table dropdown. Without the CTB file in the search path, only "None" is available.

### Fix

1. **Use the Plot command with DWG to PDF.pc3**:
   - "Click File in the top menu bar, then select Plot"
   - "Printer/Plotter: From the dropdown, select 'DWG To PDF.pc3'"
   - This is GstarCAD's built-in virtual PDF printer

2. **Configure plot style table**:
   - In the Plot dialog, select "Use Plot Style" checkbox
   - Select monochrome.ctb from the plot style table dropdown
   - If monochrome.ctb is not listed, check the search path

3. **Set plot style search path in Options**:
   - Go to Options > Files > Plot Style Table Search Path
   - "Set the search path to find drawing support files such as text fonts, drawings, linetypes, and hatch patterns"
   - Add the path to the folder containing monochrome.ctb
   - Default: `(install drive):\Program Files\GstarCAD\Plot Styles\`

4. **Copy monochrome.ctb from AutoCAD**:
   - If GstarCAD doesn't include monochrome.ctb
   - Copy it from an AutoCAD installation
   - Place in GstarCAD's Plot Styles folder
   - Restart GstarCAD

5. **Use Export > PDF as alternative**:
   - "Click Export > PDF to export your CAD drawings to PDF"
   - "Click 'Option' button in the popped up dialog box for more options"
   - "There isn't much difference between 'Export to PDF' and 'Plot to PDF'"

6. **Hide layers for selective PDF output**:
   - "For layer-specific conversion, first hide unwanted layers in the DWG"
   - "Then use 'Window' or 'Extents' to define the print area"
   - "Only visible layers will appear in the PDF"

### Community Report

> "The setup of Paper size, Plot area, Scale and Plot style is just like a normal printing setup except that we need to customize some properties for the PDF printing. Select 'DWG To PDF.pc3' as the printer. Check 'Print to File', 'Center the Plot', or 'Fit to Paper' as required."

## 3. Custom Hatch Patterns Not Found from Search Path

### Symptom

Custom hatch patterns (.pat files) work in AutoCAD but not in GstarCAD. When applying hatch patterns, custom patterns don't appear in the pattern list. The hatch command only shows default patterns.

### Root Cause

GstarCAD looks for hatch pattern files (.pat) in the search path defined in Options > Files. If the custom .pat file is not in the configured search path, GstarCAD can't find it. The search path may differ from AutoCAD's, especially after migration.

### Fix

1. **Set hatch pattern search path in Options**:
   - Go to Options > Files tab
   - "Search Path: Set the search path to find drawing support files such as text fonts, drawings, linetypes, and hatch patterns"
   - Add the folder containing custom .pat files
   - Apply and restart GstarCAD

2. **Copy .pat files to GstarCAD's support folder**:
   - Find GstarCAD's default support folder
   - Default: `(install drive):\Program Files\GstarCAD\Support\`
   - Copy custom .pat files to this folder
   - Restart GstarCAD

3. **Import settings from AutoCAD**:
   - "GstarCAD offers several methods to import your customized settings such as CUI, Lisp program, Shortcut settings, Blocks, DWT, Tool palettes, Plotters"
   - Use Settings Import to bring in hatch patterns from AutoCAD
   - "Hatch pattern (*.pat)" is included in the imported settings

4. **Use the Hatch Quick Preview**:
   - "In GstarCAD, hatch preview remains quick and real-time even in complex drawings"
   - Use the preview to verify custom patterns are loaded
   - If preview shows the pattern, it's working correctly

5. **Check .pat file format**:
   - GstarCAD uses the same .pat format as AutoCAD
   - "Hatch Pattern File (PAT) — compatible with ACAD"
   - Ensure the .pat file follows the standard format
   - Open in a text editor to verify format

6. **Use Hatch to Back for proper display**:
   - "Hatch to Back" option sends hatch behind other geometry
   - Use this if hatch patterns appear on top of lines
   - In the hatch dialog, check "Hatch to Back"

### Community Report

> "GstarCAD offers several methods to import your customized settings including Hatch pattern (*.pat). Set the search path in Options to find drawing support files such as hatch patterns. Hatch preview remains quick and real-time even in complex drawings."

## 4. Command Aliases Not Working from gacd.pgp Not Migrated

### Symptom

Custom command aliases (keyboard shortcuts) from AutoCAD don't work in GstarCAD. Typing familiar aliases like "L" for LINE, "C" for CIRCLE, or custom aliases produces "Unknown command." The gacd.pgp file doesn't contain the custom aliases.

### Root Cause

GstarCAD uses its own alias file called gacd.pgp (equivalent to AutoCAD's acad.pgp). When migrating from AutoCAD, the custom aliases in acad.pgp are not automatically transferred to gacd.pgp. The Settings Import feature can migrate aliases, but it must be explicitly selected.

### Fix

1. **Import settings from AutoCAD**:
   - "GstarCAD offers several methods to import your customized settings"
   - Use the Settings Import wizard
   - "Alias file (gacd.pgp)" is included in imported settings
   - "In just a few minutes, you can recreate the interface that you're familiar with"

2. **Manually edit gacd.pgp**:
   - Find gacd.pgp in GstarCAD's support folder
   - Open in a text editor (VS Code, Notepad)
   - Add custom aliases in the same format as acad.pgp
   - Format: `Alias, *FullCommandName`
   - Example: `L, *LINE`

3. **Use the Customize User Interface**:
   - "Customize User Interface: Workspace, toolbars, ribbon customization, command, keyboard and mouse button customizations"
   - Access through the Customize dialog
   - Add or modify command aliases
   - Save and restart GstarCAD

4. **Export/Import settings between GstarCAD versions**:
   - "GstarCAD supports importing and exporting settings"
   - "Importing settings of old version enables users to avoid repeating same settings"
   - Export from old GstarCAD version
   - Import to new version

5. **Check migrated settings list**:
   - Migrated settings include:
   - Options (File locations, Display, User preferences, Drafting, Selection)
   - Customize User Interface (Workspace, toolbars, ribbon, commands, keyboard)
   - Alias file (gacd.pgp)
   - Printer support file
   - Hatch pattern (*.pat)
   - Tool Palettes
   - Template file (*.dwt)
   - Fonts and shapes (*.shx)
   - Line type (*.lin)
   - Font mapping file (gacd.fmp)

6. **Note: migration overwrites current settings**:
   - "After migration from older version, the relevant settings of current version will be overwritten, and can't be restored"
   - Back up current settings before importing
   - Export current settings first as a safety measure

### Community Report

> "GstarCAD offers several methods to import your customized settings including Alias file (gacd.pgp). In just a few minutes, you can recreate the interface that you're familiar with. Note: After migration, the relevant settings of current version will be overwritten and can't be restored."

## 5. Batch Plot to PDF Not Merging Multiple Drawings

### Symptom**

Using GstarCAD's Batch Plot tool to convert multiple DWG files to PDF. The tool creates individual PDF files for each drawing instead of a single merged PDF. Need all drawings in one PDF file for client delivery.

### Root Cause

GstarCAD's Batch Plot tool converts each DWG to a separate PDF file. The "DWG To PDF.pc3" virtual printer creates one file per drawing. Unlike AutoCAD's PUBLISH command, GstarCAD's Batch Plot doesn't have a built-in merge option. Merging must be done with an external tool.

### Fix

1. **Use Batch Plot for individual PDFs**:
   - "Go to File → Batch Plot, select multiple DWG files"
   - "Choose 'DWG To PDF.pc3' as the printer"
   - "Configure settings (paper size, scale)"
   - "Click 'OK' to convert all files at once"
   - Each DWG produces a separate PDF

2. **Merge PDFs with external tool**:
   - Use free PDF merge tools:
   - PDFMerge.com (online)
   - PDFtk Builder (desktop)
   - Adobe Acrobat (Combine Files feature)
   - Ghostscript (command line)

3. **Use Plot command with layout tabs**:
   - If all drawings are layouts in a single DWG file
   - Use Plot and select multiple layouts
   - "In the Print dialog, under Print Range, select Layout to convert a specific layout"
   - Plot each layout to the same PDF file (append)

4. **Print to Adobe PDF with append**:
   - Select Adobe PDF as the printer
   - Plot the first drawing
   - For subsequent drawings, select "Append to existing PDF" in Adobe PDF settings
   - This merges drawings into one PDF

5. **Use third-party batch plot tools**:
   - Some third-party tools can batch plot and merge
   - Check GstarCAD App Store for plugins
   - Or use AutoCAD's PUBLISH command if available

6. **Consider using a single DWG with multiple layouts**:
   - Import all drawings as layouts in a single DWG
   - Use Batch Plot on the single file
   - All layouts plot to a single PDF
   - This is the most reliable merge method

### Community Report

> "GstarCAD supports batch conversion via the Batch Plot tool. Go to File → Batch Plot, select multiple DWG files, choose DWG To PDF.pc3 as the printer, and click OK to convert all files at once. For a single merged PDF, use external merge tools."

## 6. Additional GstarCAD Issues

### DWG Version Compatibility

**Issue**: Older DWG files (DWG 2007) don't convert properly to PDF.
**Fix**: "Most modern converters support older DWG versions. For compatibility issues, first open the DWG in GstarCAD to update it." GstarCAD supports DWG 2.5 to 2024.

### PDF Import and Export

**Issue**: Need to import PDF files into GstarCAD for editing.
**Fix**: "GstarCAD supports importing and exporting PDF." Use File > Import > PDF. PDF geometry is converted to native DWG entities. "PDF Underlay" is also supported.

### Tool Palettes Migration

**Issue**: Custom tool palettes from AutoCAD don't appear in GstarCAD.
**Fix**: Use Settings Import to migrate "Tool Palettes." "Users can also import Tool Palettes from AutoCAD." Ensure tool palette source files are accessible.

### Parametric Constraints for Dynamic Blocks

**Issue**: Dynamic blocks with parametric constraints from AutoCAD don't work.
**Fix**: "GstarCAD 2027 introduces parametric constraints for dynamic blocks." Update to the latest version. Some complex constraints may not be fully supported.

### Auto Input Method Switching

**Issue**: Input method switches unexpectedly during command entry.
**Fix**: "GstarCAD 2027 introduces auto input method switching." Configure in Options > User Preferences. This feature minimizes input method conflicts.

## Best Practices

1. **Set LISPSYS to 1 for Unicode LISP compatibility** — enables full Unicode support
2. **Re-save LISP and DCL files as UTF-8** — prevents encoding-related loading failures
3. **Configure plot style search path in Options** — enables monochrome.ctb
4. **Copy monochrome.ctb from AutoCAD if missing** — enables B&W PDF output
5. **Set hatch pattern search path in Options** — enables custom .pat files
6. **Use Settings Import to migrate from AutoCAD** — transfers aliases, hatch, fonts, CUI
7. **Back up current settings before import** — migration overwrites and can't be restored
8. **Use external tools to merge PDFs from Batch Plot** — GstarCAD doesn't merge natively
9. **Use LISP Debugger for troubleshooting** — step through code to find failures
10. **Update to GstarCAD 2027 for latest features** — parametric constraints, auto input switching
