---
title: "IronCAD STEP Import Failures and Catalog Crashes: Parts Scattered from ACIS Kernel and PMI Import, Solid Kernel Selection Missing from Registry, Catalog Crash When Opening Too Many Catalogs, TriBall Pattern Drop Missing Sizebox Update, and STEP AP242 Format Not Available in Older Versions"
excerpt: "IronCAD fails for 5 distinct reasons: STEP import scatters parts from ACIS kernel bug with PMI import enabled, solid kernel selection disappears from registry requiring .reg fix, IC2024 crashes when opening too many catalogs at once, TriBall pattern catalog items don't update sizebox after first drop, and STEP AP242 format is only in newer versions. We cover each with fixes from IronCAD forums and Solidmakarna support."
category: "import-and-catalog-errors"
softwareSlug: "ironcad"
keyword: "IronCAD STEP import scattered parts ACIS kernel PMI solid kernel registry fix catalog crash TriBall pattern sizebox STEP AP242"
slug: "ironcad-step-import-catalog-errors-scattered-parts-acis-pmi-registry-triball-sizebox-ap242"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://en.solidmakarna.se/supportblogg/kan-inte-importera-step-filer-i-ironcad-dcs-2023-sp1"
  - "https://en.solidmakarna.se/supportblogg/utspridda-parter-vid-import-av-step-filer-v2022-sp1"
  - "https://www.ironcad.com/product-update/2023pu1sp1/"
---

# IronCAD STEP Import Failures and Catalog Crashes: Parts Scattered from ACIS Kernel and PMI Import, Solid Kernel Selection Missing from Registry, Catalog Crash When Opening Too Many Catalogs, TriBall Pattern Drop Missing Sizebox Update, and STEP AP242 Format Not Available in Older Versions

IronCAD's STEP import, catalog system, and TriBall tools suffer from kernel bugs, registry issues, and catalog crashes. This guide covers the 5 most common IronCAD problems with diagnostic steps and community-verified fixes from IronCAD forums and Solidmakarna support.

## 1. STEP Import Scatters Parts from ACIS Kernel and PMI Import

### Symptom

When importing STEP files, the constituent parts are scattered or in the wrong place in the scene. This occurs in IronCAD DCS 2022 SP1, 2023, and 2024.

### Root Cause

This is a bug in the ACIS solid kernel combined with the Import PMI function. When Import PMI is enabled and the ACIS kernel is active, multi-body STEP files import with parts in incorrect positions.

### Fix

1. **Switch to Parasolid kernel**:
   - Tools → Options → change the solid kernel from ACIS to Parasolid
   - Press OK and close the dialog
   - Try importing the STEP file again

2. **Disable Import PMI**:
   - Go to Import Geometry → Menu → Import Options
   - Uncheck "Import PMI"
   - Press OK
   - Try importing again

3. **Disable "If multi-body import as Structure Part"**:
   - Go to Import Options (bottom right of the import dialog)
   - Turn off "If multi-body import as Structure Part"
   - This setting was accidentally enabled by default in v2023.00
   - Fixed in PU1 (v2023.01) — update to the latest product update

4. **Use the correct Source for Part Name**:
   - In Import Options, try different "Source for Part Name" settings:
     - Default — pulls from Definition for SolidWorks files, Instance for others
     - Instance — pulls from instance data regardless of filetype
     - Definition — pulls from definition data regardless of filetype
   - If Default doesn't give correct part names, try Definition

### Community Report

> "When importing STEP files, parts may be 'scattered' in the scene. This is a bug in the ACIS kernel as well as linked to the Import PMI function."

> "This setting was accidentally enabled by default with v2023.00, but from PU1 (v2023.01) it should be disabled directly."

## 2. Solid Kernel Selection Missing from Registry

### Symptom

When trying to import STEP files, neither the ACIS nor Parasolid solid kernel can be selected in IronCAD. The kernel selection options are missing or greyed out.

### Root Cause

Some registry entries that handle the solid state cores are missing. This can happen after a Windows update, a corrupted installation, or an upgrade from an older version.

### Fix

1. **Close IronCAD completely**

2. **Download the registry fix file**:
   - For IronCAD DCS 2024: download the 2024 .reg fix
   - For IronCAD DCS 2023: download the 2023 .reg fix
   - These are available from IronCAD support or reseller websites

3. **Apply the registry fix**:
   - Double-click the .reg file
   - Click "Run" when the security dialog appears
   - Click "Yes" for User Account Control
   - Click "Yes" on the registry editor warning
   - Click "OK" when the change is confirmed

4. **Restart IronCAD** and test STEP import

5. **Be careful with registry files**:
   - A .reg file is plain text — open it in Notepad first to verify contents
   - Only use registry files from trusted sources (IronCAD official or authorized resellers)
   - Back up the registry before making changes

### Community Report

> "Download this registry file that restores some missing lines in the registry that handles the solid state cores. Be careful what registry files you find online — a .reg file is a plain text file and it is therefore relatively easy to figure out if it contains the 'wrong kind' of changes."

## 3. IC2024 Crashes When Opening Too Many Catalogs

### Symptom

IronCAD 2024 crashes when opening catalogs. After copying custom catalogs to the IC2024 catalog location and trying to open them, IC closes with no warning or error message. Opening a few catalogs at a time seems to work, but opening too many causes a crash.

### Root Cause

There appears to be a limit on how many catalogs can be open simultaneously in IC2024. When too many catalogs are loaded at once, the application crashes silently.

### Fix

1. **Open catalogs in smaller batches**:
   - Don't select all catalogs at once
   - Open 5-10 catalogs at a time
   - Test after each batch to find the limit

2. **Use a new scene for testing**:
   - Create a new scene (.ics) instead of opening an existing one
   - Open catalogs in the new scene
   - If it works, the existing scene file may have issues

3. **Check for corrupt catalog files**:
   - One or more catalog files may be corrupt
   - Add catalogs one by one to identify the corrupt one
   - Recreate the corrupt catalog from scratch

4. **Send catalogs to IronCAD support**:
   - Zip all catalogs and send to support
   - They can analyze which catalog is causing the crash

5. **Check catalog file format**:
   - Ensure catalogs are in the correct format for IC2024
   - Catalogs from very old versions may need to be migrated
   - Use the catalog migration tool if available

### Community Report

> "I selected one of the catalogs and IC closed with no warning or messages as soon as I clicked on my choice. My solution was to try and open a smaller number of catalogs at a time. It seemed to be working until I opened the last few catalogues. When I hit the enter/ok button IC closed up."

## 4. TriBall Pattern Drop: Missing Sizebox Update

### Symptom

When dropping a TriBall pattern with shapes from a catalog, the sizebox doesn't update after the first time the item is dropped. Subsequent drops use the original sizebox dimensions instead of updated ones.

### Root Cause

This is a confirmed bug (QA 78334) in the catalog item handling for TriBall patterns. The sizebox update mechanism doesn't trigger correctly after the first drop from the catalog.

### Fix

1. **Update to 2023 Product Update #1 Service Pack #1** — this bug was fixed:
   - QA 78334: "Missing update when changing the sizebox after the first time dropped out from the catalog"

2. **Workaround** — if you can't update:
   - After dropping the first item, manually edit the sizebox
   - Delete the dropped item and drop it again
   - The second drop should pick up the updated sizebox

3. **Use "Set as transparent" carefully** — another TriBall bug (QA 77764):
   - The "Set as transparent" function can interfere with TriBall operations
   - Apply transparency after positioning, not before

4. **Check for catalog item pattern issues** (QA 78441):
   - "Drop pattern with shapes from a catalog" can also cause issues
   - Test catalog patterns in a new scene before using in production

### Community Report

> "QA 78334: Missing update when changing the sizebox after the first time dropped out from the catalog."

> "QA 77956: Catalog item for Triball pattern with part or feature."

## 5. STEP AP242 Format Not Available in Older Versions

### Symptom

STEP AP242 format (.stp) is not available for import/export in older IronCAD versions (e.g., V23.0 SP1). Users who can't upgrade need AP242 support for modern CAD interoperability.

### Root Cause

STEP AP242 support was added in newer IronCAD versions. Older versions only support STEP AP203 and AP214. AP242 is the latest STEP application protocol, adding comprehensive model-based definition (MBD) and assembly structure support.

### Fix

1. **Upgrade IronCAD** — AP242 is available in newer versions:
   - Check the latest IronCAD version for AP242 support
   - Contact IronCAD sales for upgrade pricing

2. **Use AP214 as a fallback**:
   - AP214 supports most geometric data
   - It doesn't support MBD/PMI data
   - But it's compatible with most CAD systems

3. **Use a different intermediate format**:
   - Parasolid (.x_t) — if both systems support Parasolid
   - ACIS (.sat) — if both systems support ACIS
   - JT (.jt) — for visualization and lightweight geometry

4. **Request backport from IronCAD**:
   - Some users have requested AP242 backport to older versions
   - IronCAD may consider this based on customer demand

5. **Use a STEP converter**:
   - Convert AP242 files to AP214 using a third-party tool
   - STEP Tools or similar converters can downgrade AP242 to AP214
   - Some data (PMI, MBD) will be lost in conversion

### Community Report

> "Is there a chance that the STEP 242 could be added to older versions (I have V23.0 SP1) for those of us who can't afford to upgrade yet."

## 6. Additional IronCAD Issues

### ACIS Files Remain .sat on Import

**Issue**: ACIS files remain as .sat files even when the default kernel is set to Parasolid.
**Fix**: This is by design. ACIS files are not converted to Parasolid on import. Use STEP or Parasolid format for cross-kernel compatibility.

### Part Name Source Options

**Issue**: Imported parts have wrong or blank names.
**Fix**: Try different "Source for Part Name" settings in Import Options (Default, Instance, Definition). If one is blank, IronCAD falls back to the other source.

### Rendering and Animation Issues

**Issue**: Exploded views or animations don't render correctly.
**Fix**: Check graphics driver, ensure the correct GPU is selected, and update IronCAD to the latest service pack.

## Best Practices

1. **Switch to Parasolid kernel for problematic STEP imports** — ACIS kernel has known bugs
2. **Disable Import PMI for multi-body STEP files** — prevents scattered parts
3. **Disable "If multi-body import as Structure Part"** — was accidentally enabled by default
4. **Apply registry fixes for missing kernel selection** — only from trusted sources
5. **Open catalogs in small batches** — IC2024 has a limit on simultaneous catalogs
6. **Update to latest product update** — many TriBall and catalog bugs are fixed
7. **Use AP214 as fallback for AP242** — compatible with most CAD systems
8. **Back up registry before making changes** — .reg files can be inspected in Notepad
9. **Test catalog patterns in a new scene** — before using in production
10. **Send crash repro files to IronCAD support** — helps them identify catalog corruption
