---
title: "EPLAN Electric P8 Migration and Parts Database Export Errors"
excerpt: "EPLAN Electric P8 Migration and Parts Database Export Errors: symptoms, root causes, and step-by-step fixes, verified against Autodesk Community."
category: "migration"
softwareSlug: "eplan-electric-p8"
keyword: "EPLAN Electric P8 parts database migration AutoCAD Electrical Excel export column mapping DWG export embedded images XRefs fixed paths image folder copy macro library EDZ MDB EMA DWG conversion old DWG editing electrical logic exploded blocks project files Apply Project Defaults"
slug: "eplan-electric-p8-migration-and-parts-database-export-errors"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://forums.autodesk.com/t5/autocad-electrical-forum/eplan-parts-database-to-autocad-electrical/td-p/13821300"
  - "https://forums.autodesk.com/t5/autocad-electrical-forum/problem-with-exporting-eplan-project-to-autocad/td-p/9803368"
  - "https://forums.autodesk.com/t5/autocad-electrical-forum/arguments-to-keep-using-autocad-instead-of-eplan-when-editing/td-p/13953980"
---

# EPLAN Electric P8 Migration and Parts Database Export Errors: Parts Database Migration to AutoCAD Electrical Requires Multiple Excel Exports with Column Mapping, DWG Export Converts Embedded Images to XRefs with Fixed Paths Requiring Manual Image Folder Copy, EPLAN Macro Library Cannot Be Directly Imported to AutoCAD Electrical Requiring EDZ to MDB Conversion, Old DWG Editing in EPLAN Loses Electrical Logic and Explodes Blocks, and AutoCAD Electrical DWG Without Project Files Requires New Project Creation and Apply Project Defaults

EPLAN Electric P8's migration to AutoCAD Electrical, DWG export, and macro library conversion produce errors from database structure differences, image handling, and project file dependencies. This guide covers the 5 most common EPLAN migration problems with diagnostic steps and community-verified fixes from Autodesk Community.

## 1. Parts Database Migration Requires Multiple Excel Exports

### Symptom

Company has a built database in EPLAN with tons of part numbers, each with descriptions, ratings, etc. Migrating to AutoCAD Electrical. Need to transfer all part numbers from EPLAN's database to AutoCAD Electrical's catalog database. Each database uses a different structure.

### Root Cause

EPLAN and AutoCAD Electrical use completely different database structures. EPLAN stores parts in a relational database with product grouping. AutoCAD Electrical uses `default_cat.mdb` with separate tables per component category (CB, relay, wire, etc.). There is no direct import path. Each category must be exported separately with the correct column mapping.

### Fix

1. **Export EPLAN parts to Excel**:
   - "You can easily export your EPLAN parts database to Excel, with just the columns you have available in AcadE"
   - In EPLAN: Parts Management > Extras > Edit Externally
   - Select columns that match AutoCAD Electrical's catalog database fields
   - Export to Excel

2. **Perform multiple exports per category**:
   - "You'll have to do several exports, as the product grouping is different in AcadE"
   - Export circuit breakers separately with CB table columns
   - Export relays separately with relay table columns
   - Map each EPLAN category to the corresponding AcadE table

3. **Open default_cat.mdb in Microsoft Access**:
   - "You can open the default_cat.mdb in Microsoft Access and look at the table names"
   - Check table structures: CB, CR, R, wire, etc.
   - "Copy the relevant columns of data for example, circuit breakers to CB table"

4. **Map manufacturer pin details**:
   - "Each manufacturer has _PINLIST table and relevant pin details can be added there"
   - Export pin data from EPLAN separately
   - Import to the corresponding _PINLIST table in AcadE

5. **Refer to AcadE help documentation**:
   - "About the Catalog Database Structure" in AutoCAD Electrical Help
   - "To Work With Editing the Catalog Database Records"
   - "Best Practices for Customizing the Catalog Database"
   - These provide table structures and field mappings

6. **Accept that some data won't transfer**:
   - "With ACADE parts are deemed unimportant hence the quality of what's delivered with ACADE is variable at best"
   - Some EPLAN-specific fields have no equivalent in AcadE
   - Prioritize manufacturer, part number, description, and ratings

### Community Report

> "You can easily export your EPLAN parts database to Excel with just the columns you have available in AcadE, and then copy/paste. You'll have to do several exports, as the product grouping is different in AcadE. Open default_cat.mdb in Microsoft Access and look at the table names."

## 2. DWG Export Converts Embedded Images to XRefs with Fixed Paths

### Symptom

Exporting an EPLAN project to DWG format. When sharing individual pages with someone else, all image references are lost. Opening the exported DWG in AutoCAD shows missing images. Manually copying the image folder and re-referencing images takes forever.

### Root Cause

EPLAN handles embedded images differently from AutoCAD. When EPLAN exports to DWG, embedded images are converted to external references (XRefs) with fixed file paths. The image files are stored in a separate folder. When the DWG is moved or shared without the image folder, all XRef paths break.

### Fix

1. **Copy the image folder with the DWG files**:
   - "Manually copy images used in EPLAN schematic to folder with exported .dwg files"
   - "When .dwg is opened it should automatically load graphics from main folder"
   - "If you want to share .dwg files, you have to always attach graphics"

2. **Use relative paths instead of absolute**:
   - After exporting from EPLAN, open each DWG in AutoCAD
   - Use XREF command to re-path images to relative paths
   - This allows the DWG to find images when moved to a different folder
   - Use "Relative Path" option in XREF Manager

3. **Use ETRANSMIT to package DWG with images**:
   - In AutoCAD, use ETRANSMIT command
   - This creates a package with the DWG and all referenced files
   - Share the transmittal package instead of individual DWG files
   - Recipients get everything in one package

4. **Embed images in the DWG instead of XRef**:
   - In AutoCAD, use IMAGEATTACH with "Embed" option
   - Or use OLE insert to embed images directly
   - This increases file size but eliminates external dependencies
   - Images travel with the DWG file

5. **Keep EPLAN and AutoCAD image folders synchronized**:
   - "There's no easy way to do this. Mainly because of how differently EPLAN and AutoCAD handles images"
   - Maintain a shared image folder on the network
   - Use the same folder structure in both systems
   - Document the image folder location for all users

6. **Use PDF export for sharing instead of DWG**:
   - If the recipient only needs to view the drawings
   - Export from EPLAN as PDF instead of DWG
   - PDFs embed all images
   - No external references to break

### Community Report

> "Every time I export a project from EPLAN to DWG and share a page, I lose the reference from my images. I did solve it by copying the image folder and referencing the images all over again but this takes FOREVER. There's no easy way — mainly because of how differently EPLAN and AutoCAD handles images."

## 3. EPLAN Macro Library Cannot Be Directly Imported to AutoCAD Electrical

### Symptom

Need to add EPLAN macro (symbol library + catalog) to AutoCAD Electrical 2015 library. No direct import path exists. EPLAN uses .EDZ files for parts data and .EMA files for macro/symbol libraries.

### Root Cause

EPLAN and AutoCAD Electrical use completely different library formats. EPLAN macros (.EMA) contain symbol and macro data in a proprietary format. EPLAN parts data (.EDZ) uses a different database structure than AcadE's .MDB. There is no built-in conversion tool in either software.

### Fix

1. **Convert EDZ to MDB format**:
   - "You need an application to convert the EPLAN EDZ file into MDB or SQL for the parts data"
   - No direct converter exists
   - Export from EPLAN to Excel, then import to Access MDB
   - Use the Excel export method described in Problem 1

2. **Convert EMA to DWG block**:
   - "You need another application to map the EMA file into a DWG block"
   - Open the macro in EPLAN
   - Export the macro as DWG
   - Import the DWG as a block in AutoCAD Electrical

3. **Recreate symbols manually in AcadE**:
   - "Simple answer: no" direct import
   - Recreate EPLAN symbols as AutoCAD Electrical blocks
   - Use the Symbol Builder in AcadE
   - Add attribute definitions for tag, wire numbers, etc.

4. **Check for installed manufacturer libraries**:
   - "Check to see if they are installed: Start > Control Panel > Programs > [ACE version] Change/Uninstall"
   - "Select Add or Remove Features to see what has been loaded"
   - Some manufacturer libraries may already be available
   - Install additional libraries from the AcadE installation media

5. **Search for manufacturer-specific content**:
   - "I didn't find blocks or catalog for some manufacturers like Mitsubishi Electric, nor blocks for VFD and SSD"
   - Search manufacturer websites for AutoCAD Electrical content
   - Some manufacturers provide AcadE-compatible libraries
   - Check the Autodesk App Store for third-party libraries

6. **Use EPLAN's DWG export as intermediary**:
   - Export EPLAN macros/pages as DWG
   - Open in AutoCAD Electrical
   - Use Symbol Builder to convert geometry to intelligent AcadE symbols
   - Add catalog data manually or via Excel import

### Community Report

> "Is there a solution to add an EPLAN macro to my library on AutoCAD Electrical? Simple answer: no. You need an application to convert the EDZ file into MDB for parts data, and another application to map the EMA file into a DWG block."

## 4. Old DWG Editing in EPLAN Loses Electrical Logic and Explodes Blocks

### Symptom

Editing old DWG files (originating from AutoCAD or ELSA) that no longer contain electrical logic. Using EPLAN to edit these files is time-efficient for the user but blocks get exploded when exporting back to DWG. EPLAN's smart features can't be used on non-intelligent DWG files.

### Root Cause

EPLAN converts DWG geometry to its internal format on import. On export back to DWG, complex blocks may be exploded because EPLAN's block structure differs from AutoCAD's. EPLAN can't add electrical logic to geometry that doesn't have it — the DWG must be redrawn with EPLAN's intelligent symbols to gain logic.

### Fix

1. **Keep one AutoCAD license for editing old DWG files**:
   - "As a general rule, when switching systems, I recommend keeping one license of the old tool to edit old projects, for a while"
   - Use AutoCAD for simple edits to old DWG files
   - Use EPLAN for new projects
   - Gradually migrate old projects when major changes are needed

2. **Be aware of image conversion**:
   - "EPLAN will turn embedded images to XRefs with fixed paths"
   - "Being aware of this limitation will be important"
   - Copy image folders when sharing exported DWGs
   - See Problem 2 for detailed fixes

3. **Redraw old projects in EPLAN for full value**:
   - "If you edit old drawings a LOT, I would redraw everything in the new tool, to get the full value"
   - "Eplan have a group of people redrawing old projects as a service. The result is excellent!"
   - Contact EPLAN about their project conversion service
   - This gives old projects full EPLAN intelligence

4. **Accept that conversion is never 100%**:
   - "Different tools use different logic, so there will never be a 100% conversion when switching between systems"
   - Plan for manual cleanup after any conversion
   - Budget time for verifying converted data

5. **Use AutoCAD Electrical for DWG with remaining logic**:
   - If DWG files were created in AutoCAD Electrical and still have electrical symbols
   - "Create a new project and add all DWG files to the new project"
   - "You would be right away able to use functions like wire numbers, component tags, reports"
   - Don't use EPLAN for these files — use AutoCAD Electrical

6. **Weigh the time investment**:
   - "If all you're doing is adding a sensor on one random page, there would be no value to recreate a project"
   - "But if you need to modify many pages, add/remove devices, update wire numbers — definitely worth adding drawings to project"
   - Choose the tool based on the scope of changes

### Community Report

> "We sometimes get tasked with editing old pages where the native format is DWG. I know EPLAN best. Some blocks will be exploded when exporting back to DWG. There will never be a 100% conversion when switching between systems. I recommend keeping one license of the old tool to edit old projects."

## 5. AutoCAD Electrical DWG Without Project Files Requires New Project

### Symptom

Old DWG files created in AutoCAD Electrical but the original project files (.wdp) are lost. The DWG files contain electrical symbols (blocks with AcadE attributes) and wires on correct layers, but without the project file, project-level features like cross-referencing and wire numbering don't work.

### Root Cause

AutoCAD Electrical stores project-level settings (cross-referencing format, wire numbering scheme, tag formatting) in the .wdp project file. Without the .wdp, individual DWG files have electrical intelligence at the drawing level but lack project-level coordination. Creating a new project and adding the DWG files restores project-level functionality.

### Fix

1. **Create a new project and add DWG files**:
   - "If the original drawings were created using AutoCAD Electrical, they would have electrical symbols with acade recognized attributes"
   - "Create a new project and add all the DWG files to the new project"
   - "You would be right away able to use functions like wire numbers, component tags, new components, reports"

2. **Define project-level properties**:
   - "You will have to define project level properties on how you want the cross-referencing, wire numbering, etc to work"
   - Configure cross-referencing format
   - Configure wire numbering scheme
   - Configure tag formatting

3. **Use Apply Project Defaults**:
   - "Select all drawings and click Apply Project Defaults"
   - "This way you can restore the missing project files"
   - This applies the new project settings to all added DWG files
   - Existing drawing-level data is preserved

4. **Don't edit these DWGs in EPLAN**:
   - "If by editing the DWG in EPLAN can ruin this potential link to the native AutoCAD-Electrical project files"
   - EPLAN may strip AcadE attributes and intelligence
   - Keep these files in AutoCAD Electrical
   - Use EPLAN only for new projects

5. **Weigh the effort vs. benefit**:
   - "If all you're doing is adding a sensor on one random page, there would be no value to recreate a project"
   - "But if you need to modify many pages — then it is definitely worth adding the drawings to project"
   - Create the project only for multi-page modifications

6. **Back up project files going forward**:
   - Store .wdp files with the DWG files
   - Use version control or document management
   - Keep project files in a dedicated project folder
   - This prevents future loss of project-level settings

### Community Report

> "If the original drawings were created using AutoCAD Electrical, they would have electrical symbols. Create a new project and add all the DWG files. You would be right away able to use wire numbers, component tags, reports. Define project level properties and click Apply Project Defaults to restore the missing project files."

## 6. Additional EPLAN Migration Issues

### Converting EPLAN Drawings to AutoCAD Electrical

**Issue**: Need to convert EPLAN drawings to AutoCAD Electrical "intelligently" without editing after conversion.
**Fix**: "This issue has been addressed before." There is no intelligent conversion — EPLAN to AcadE requires manual recreation. Use EPLAN's DWG export, then rebuild intelligence in AcadE using Symbol Builder.

### Missing Manufacturer Libraries in AcadE

**Issue**: "I didn't find blocks or catalog for some manufacturers like Mitsubishi Electric, nor blocks for VFD and SSD."
**Fix**: Check AcadE installation features. Search manufacturer websites. Check Autodesk App Store. Some manufacturers provide libraries on their websites.

### EPLAN Support for DWG Export

**Issue**: DWG export from EPLAN has various issues (images, blocks, formatting).
**Fix**: "While you tap EPLAN Support about exporting referenced images." Contact EPLAN support for export configuration. Use EPLAN Community forums for workflow advice.

### Keeping Both Tools During Transition

**Issue**: Company transitioning from EPLAN to AutoCAD Electrical.
**Fix**: "Keep one license of the old tool to edit old projects, for a while." Gradually migrate projects. Train users on the new tool. Use EPLAN's project conversion service for critical projects.

## Best Practices

1. **Export EPLAN parts to Excel per category** — map to AcadE table structure
2. **Open default_cat.mdb in Access** — understand table structures
3. **Copy image folders when sharing exported DWGs** — EPLAN converts images to XRefs
4. **Use ETRANSMIT to package DWG with images** — prevents broken references
5. **Recreate EPLAN macros manually in AcadE** — no direct import exists
6. **Keep one AutoCAD license for old DWG editing** — during transition period
7. **Redraw frequently-edited old projects in the new tool** — for full value
8. **Create new AcadE project for orphan DWG files** — restores project-level features
9. **Use Apply Project Defaults after adding DWGs** — applies settings to all drawings
10. **Don't edit AcadE DWGs in EPLAN** — may strip electrical intelligence
