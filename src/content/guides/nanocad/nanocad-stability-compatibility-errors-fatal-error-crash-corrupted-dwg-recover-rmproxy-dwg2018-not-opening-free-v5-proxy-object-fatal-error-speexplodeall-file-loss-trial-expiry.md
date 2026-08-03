---
title: "NanoCAD Stability and File Compatibility Errors: Fatal Error Crash from Corrupted DWG Files Requiring RECOVER and RMPROXY, DWG 2018 File Not Opening in Free v5 from Version Limitation Requiring Platform Upgrade, Proxy Object Fatal Errors from nanoCAD Construction Conversion Requiring SPEXPLODEALL, File Loss After Trial Expiry from Pro11 to Free v5 Incompatibility Requiring TrueView Conversion, and Resaved DXF Objects Permanently Converted to Proxy Graphics Requiring DWG-Only Workflow"
excerpt: "NanoCAD fails for 5 distinct reasons: fatal error crash from corrupted DWG files requiring RECOVER and RMPROXY, DWG 2018 file not opening in Free v5 from version limitation requiring platform upgrade, proxy object fatal errors from nanoCAD Construction conversion requiring SPEXPLODEALL, file loss after trial expiry from Pro11 to Free v5 incompatibility requiring TrueView conversion, and resaved DXF objects permanently converted to proxy graphics requiring DWG-only workflow. We cover each with fixes from nanoCAD Support Portal and Community Forums."
category: "stability-and-compatibility-errors"
softwareSlug: "nanocad"
keyword: "NanoCAD fatal error crash corrupted DWG RECOVER RMPROXY DWG 2018 not opening Free v5 version limitation platform upgrade proxy object fatal error nanoCAD Construction SPEXPLODEALL file loss trial expiry Pro11 Free v5 incompatibility TrueView conversion resaved DXF objects permanently converted proxy graphics DWG-only workflow"
slug: "nanocad-stability-compatibility-errors-fatal-error-crash-corrupted-dwg-recover-rmproxy-dwg2018-not-opening-free-v5-proxy-object-fatal-error-speexplodeall-file-loss-trial-expiry"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-08-03"
sources:
  - "https://support.nanocad.com/helpdesk/KB/View/66719854-nanocad-crashes-sends-fatal-error-message"
  - "https://community.nanocad.com/KB/faq/post/nanocad-free-nanocad-v-5-can-t-open-a-dwg-2018-file-6tAEiJmZfqShsoO"
  - "https://supportnanocad.jitbit.com/KB/View/66719772-nanocad-can-t-open-can-t-display-correctly-specific-files"
---

# NanoCAD Stability and File Compatibility Errors: Fatal Error Crash from Corrupted DWG Files Requiring RECOVER and RMPROXY, DWG 2018 File Not Opening in Free v5 from Version Limitation Requiring Platform Upgrade, Proxy Object Fatal Errors from nanoCAD Construction Conversion Requiring SPEXPLODEALL, File Loss After Trial Expiry from Pro11 to Free v5 Incompatibility Requiring TrueView Conversion, and Resaved DXF Objects Permanently Converted to Proxy Graphics Requiring DWG-Only Workflow

NanoCAD's file recovery, DWG version handling, proxy objects, trial compatibility, and format conversion produce errors from file corruption, version limitations, proxy conversion, trial expiry, and DXF resaving. This guide covers the 5 most common NanoCAD problems with diagnostic steps and community-verified fixes from nanoCAD Support Portal and Community Forums.

## 1. Fatal Error Crash from Corrupted DWG Files

### Symptom

NanoCAD crashes and sends a Fatal Error message when working on specific DWG files. The crash occurs on particular drawings, not all. New empty drawings work fine. The crash may happen when opening the file or during editing.

### Root Cause

"Sometimes CAD-programs can damage dwg files, and nanoCAD has fatal errors when working on such files." The DWG file has internal corruption — damaged objects, proxy entities, or invalid data structures. nanoCAD's reader encounters the corrupt data and can't process it, causing a fatal error. The corruption may be from another CAD program that wrote the file, or from a previous nanoCAD crash that left the file in a bad state.

### Fix

1. **Use RECOVER command**:
   - "Run nanoCAD, then call the RECOVER command to open the file"
   - RECOVER attempts to fix errors in the file structure
   - It rebuilds damaged objects and removes invalid data
   - This is the first step for any corrupted file

2. **Remove proxy objects**:
   - "Call the command RMPROXY — Nongraphical proxies to remove proxy objects that do not have a graphic"
   - "You can also use the XPROXY command to explode visible proxy entities"
   - Proxy objects from other CAD systems can cause crashes
   - Remove or explode them

3. **Purge waste objects**:
   - "Use the Purge command to clear waste objects"
   - "We also recommend to use the -PURGE command (works in the command line, without dialog)"
   - "Using its different options, especially ANnotscales and sorTTable"
   - Remove unused annotation scales and sortable objects

4. **Flatten and Audit**:
   - "Select all, then call the Flatten command. You can do it twice because some objects can be flattened only the second time"
   - "Use the Audit command"
   - "Use the Audit Geometry command twice: first audit z-coordinates, then hatches"
   - These commands fix geometry and hatch errors

5. **Repeat the process**:
   - "Sometimes it is necessary to repeat steps 3-6 several times to fix the file"
   - Recovery may not work on the first pass
   - Repeat RECOVER, RMPROXY, Purge, Flatten, Audit
   - Until the file is stable

6. **Create crash report**:
   - "Open nanoCAD Platform, click on the nanoCAD icon, select Utilities, click on Problem Report"
   - "After system collects data, click Select All, Save report"
   - Send the report to nanoCAD support
   - This helps them investigate the crash

### Community Report

> "NanoCAD crashes / sends Fatal error message. Sometimes CAD-programs can damage dwg files, and nanoCAD has fatal errors when working on such files. Run nanoCAD, call the RECOVER command. Call RMPROXY to remove proxy objects. Use Purge, Flatten, Audit, and Audit Geometry. Sometimes it is necessary to repeat steps several times to fix the file."

## 2. DWG 2018 File Not Opening in Free v5 from Version Limitation

### Symptom

nanoCAD Free (v5) cannot open a DWG 2018 file. The file was created or saved in a newer CAD program. nanoCAD Free shows an error or simply doesn't open the file. The file code is "AC1032" indicating DWG 2018 format.

### Root Cause

"nanoCAD Free supports DWG file versions up to 2013 only." nanoCAD Free v5 is limited to DWG 2013 and earlier formats. DWG 2018 (AC1032) is a newer format that nanoCAD Free can't read. This is a version limitation of the free edition, not a bug.

### Fix

1. **Upgrade to nanoCAD Platform**:
   - "To work with DWG files of this format, upgrade to the nanoCAD Platform"
   - nanoCAD Platform supports DWG 2018 and later
   - This is the official solution
   - Purchase a nanoCAD Platform license

2. **Convert file to DWG 2013 using TrueView**:
   - Use Autodesk DWG TrueView (free)
   - Open the DWG 2018 file
   - Save as DWG 2013 format
   - Then open in nanoCAD Free

3. **Use RECOVER in nanoCAD 24**:
   - "If your file is version 2013 or earlier and you still encounter issues"
   - "Run nanoCAD 24, then call the RECOVER command to open the file"
   - nanoCAD 24 is a newer version that may handle the file better
   - Use the trial version if needed

4. **Check file version before sharing**:
   - Before sharing files with nanoCAD Free users
   - Save as DWG 2013 or earlier
   - Use Save As > DWG 2013 in the source CAD program
   - This prevents compatibility issues

5. **Use nanoCAD Plus trial**:
   - "Prova a farla con la versione di prova di nanoCAD Plus"
   - Download nanoCAD Plus trial
   - It supports newer DWG formats
   - Convert the file and save as DWG 2013

### Community Report

> "nanoCAD Free (nanoCAD v.5) can't open a DWG-2018 file. nanoCAD Free supports DWG file versions up to 2013 only. The code AC1032 indicates DWG 2018 format. To work with DWG files of this format, upgrade to the nanoCAD Platform. If your file is version 2013 or earlier, run nanoCAD 24, call the RECOVER command."

## 3. Proxy Object Fatal Errors from nanoCAD Construction Conversion

### Symptom

Files created with nanoCAD Construction contain custom objects. When opened in standard nanoCAD or shared with users without nanoCAD Construction, the objects appear as proxy graphics. Editing or saving the file causes fatal errors. The objects can't be edited in standard nanoCAD.

### Root Cause

"Drawings must be saved only in *.dwg format. When resaving in other formats (for example, *.dxf), objects nanoCAD Construction will be permanently converted to proxy graphics and will not be able to be edited." nanoCAD Construction creates custom intelligent objects (walls, doors, windows). These objects are only editable with nanoCAD Construction installed. Without it, they become proxy graphics. Resaving in DXF permanently converts them to non-editable proxy graphics.

### Fix

1. **Use SPEXPLODEALL before sharing**:
   - "To dismember all objects nanoCAD Construction, use the command SPEXPLODEALL"
   - "This command automatically selects all objects nanoCAD Construction in the drawing and explodes them into primitives"
   - Run SPEXPLODEALL before sharing with non-Construction users
   - This converts custom objects to standard primitives

2. **Use EXPLODE for individual objects**:
   - "To dismember individual objects nanoCAD Construction, use the standard command EXPLODE"
   - Select specific objects and explode them
   - This preserves other objects as intelligent
   - Use for selective sharing

3. **Save only in DWG format**:
   - "Drawings must be saved only in *.dwg format"
   - Never save nanoCAD Construction files as DXF
   - DXF permanently converts objects to proxy graphics
   - Always use DWG

4. **Install nanoCAD Construction Enabler**:
   - "When transferring files to a user or customer drawings that do not have nanoCAD Construction"
   - "And not having the ability or desire to use nanoCAD Construction Enabler"
   - The Enabler allows viewing and basic editing of Construction objects
   - Without the full Construction license

5. **Convert to standard primitives before resaving**:
   - "You need to convert all the objects nanoCAD Construction in the standard system primitives"
   - Before resaving to a different DWG version
   - Use SPEXPLODEALL first
   - Then save as the target version

6. **Avoid resaving with proxy objects**:
   - "When resaving a drawing that has proxy objects without an installed nanoCAD Construction"
   - "To other versions of the *.dwg format, the objects will be converted to proxy graphics"
   - Don't resave files with proxy objects
   - Explode them first or install Construction

### Community Report

> "Drawings must be saved only in *.dwg format. When resaving in other formats (for example *.dxf), objects nanoCAD Construction will be permanently converted to proxy graphics and will not be able to be edited. To dismember all objects nanoCAD Construction, use the command SPEXPLODEALL. To dismember individual objects, use the standard command EXPLODE."

## 4. File Loss After Trial Expiry from Pro11 to Free v5 Incompatibility

### Symptom

User downloaded nanoCAD Pro11 trial. After the trial expired, downloaded and activated the free version 5. Files created in Pro11 cannot be opened in Free v5. No way to convert the files to a compatible format.

### Root Cause

"NanoCAD Pro salva in una versione dwg più recente." nanoCAD Pro11 saves in a newer DWG format than nanoCAD Free v5 supports. When the Pro11 trial expires, the user can't open Pro11 to resave the files. nanoCAD Free v5 only supports DWG 2013 and earlier. The files are trapped in a format that Free v5 can't read.

### Fix

1. **Convert with Autodesk TrueView**:
   - "Ho provato a convertire i file ad una versione meno recente con True view di autodesk"
   - Use Autodesk DWG TrueView (free download)
   - Open the Pro11 DWG file
   - Save as DWG 2013 or earlier
   - Then open in nanoCAD Free v5

2. **Use nanoCAD Plus trial**:
   - "Prova a farla con la versione di prova di nanoCAD Plus"
   - Download nanoCAD Plus trial
   - It supports newer DWG formats
   - Open the Pro11 files and save as DWG 2013

3. **Check for crash after conversion**:
   - "Così facendo Nanocad 5 me li apre e li visualizzo ma non posso fare niente"
   - "Appena tocco qualsiasi comando va in crash ed esce messaggio fatal error"
   - If the converted file opens but crashes on any command
   - The conversion may not be perfect
   - Use RECOVER command in nanoCAD to fix

4. **Use RECOVER after conversion**:
   - After converting with TrueView
   - Open nanoCAD Free v5
   - Use RECOVER command to open the converted file
   - This may fix conversion artifacts

5. **Prevent by saving in compatible format during trial**:
   - Before the trial expires
   - Save all files as DWG 2013 format
   - This ensures compatibility with Free v5
   - Don't wait until the trial expires

6. **Purchase nanoCAD Platform**:
   - If files are critical and can't be converted
   - Purchase nanoCAD Platform license
   - It supports all DWG formats
   - Open and resave the Pro11 files

### Community Report

> "Tempo fa ho scaricato la versione di prova nanocad pro11 la quale dopo qualche tempo ha giustamente smesso di funzionare. Ora ho scaricato e attivato la versione gratuita 5 e non si possono aprire i file che avevo creato sulla versione pro11. NanoCAD Pro salva in una versione dwg più recente. Provato a convertire i file con True view di autodesk, Nanocad 5 me li apre ma appena tocco qualsiasi comando va in crash con fatal error."

## 5. Resaved DXF Objects Permanently Converted to Proxy Graphics

### Symptom

A drawing created with nanoCAD Construction is resaved in DXF format. After resaving, the nanoCAD Construction objects (walls, doors, windows) are permanently converted to proxy graphics. The objects can no longer be edited even when reopened in nanoCAD Construction.

### Root Cause

"When resaving in other formats (for example, *.dxf), objects nanoCAD Construction will be permanently converted to proxy graphics and will not be able to be edited." DXF format doesn't support nanoCAD Construction's custom object definitions. When saving to DXF, the custom objects are converted to simple proxy graphics (lines, arcs, text). This conversion is one-way — the intelligence is lost permanently. Even reopening in nanoCAD Construction can't restore the custom objects.

### Fix

1. **Always save in DWG format**:
   - "Drawings must be saved only in *.dwg format"
   - Never use DXF for nanoCAD Construction files
   - DWG preserves custom object definitions
   - DXF permanently destroys them

2. **Explode before DXF export**:
   - If DXF is required for sharing
   - Run SPEXPLODEALL first
   - This converts custom objects to standard primitives
   - Then save as DXF — no proxy graphics

3. **Use DWG for all nanoCAD Construction work**:
   - Keep all working files in DWG format
   - Only export to DXF as a final step
   - After exploding custom objects
   - Never resave the working file as DXF

4. **Keep a DWG backup**:
   - Before any DXF export
   - Keep a DWG backup of the file
   - The DWG retains the intelligent objects
   - If DXF causes issues, restore from DWG

5. **Use nanoCAD Construction Enabler for sharing**:
   - Instead of sharing DXF files
   - Share DWG files
   - Recipients install nanoCAD Construction Enabler (free)
   - This allows viewing without losing object intelligence

6. **Educate users on format limitations**:
   - Ensure all users understand
   - DXF = one-way conversion to proxy graphics
   - DWG = preserves intelligent objects
   - Never resave Construction files as DXF

### Community Report

> "Important! Drawings must be saved only in *.dwg format. When resaving in other formats (for example *.dxf), objects nanoCAD Construction will be permanently converted to proxy graphics and will not be able to be edited. When resaving a drawing that has proxy objects without an installed nanoCAD Construction, to other versions of the *.dwg format, the objects will be converted to proxy graphics."

## 6. Additional NanoCAD Issues

### Double-Click Opens New Instance

**Issue**: "Ad ogni doppio clic su un file DWG, viene avviata una nuova istanza di NanoCAD."
**Fix**: Associate DWG files with nanoCAD in Windows. Right-click DWG > Open With > Choose nanoCAD. Check "Always use this app." Or use SDI (Single Document Interface) mode.

### File Settings Lost

**Issue**: "Il mio file perde le impostazioni che gli do."
**Fix**: Save settings in a template file (DWT). Use PAGESETUP to save plot settings. Use LAYER states for layer configurations. Don't rely on drawing-level settings.

### True Color Solid Hatches

**Issue**: "Problema retini solidi colorati True color."
**Fix**: Check color settings in hatch dialog. Use ACI colors instead of True Color for compatibility. Verify plot style table supports True Color. Update to latest nanoCAD version.

### Crash Report Generation

**Issue**: Need to generate crash report for support.
**Fix**: "Open nanoCAD Platform, click on the nanoCAD icon on the top left, select Utilities, click on Problem Report. After system collects data, click Select All, Save report. Send us this saved file."

### Network Storage Files

**Issue**: Crashes when working with files on network storage.
**Fix**: Copy files to local PC before editing. Work on local copy. Save changes locally first. Then copy back to network. Network latency can cause file corruption.

## Best Practices

1. **Use RECOVER command for corrupted DWG files** — first step for any file crash
2. **Run RMPROXY and XPROXY to remove proxy objects** — prevents crashes from foreign objects
3. **Use -PURGE with ANnotscales and sorTTable options** — removes waste that causes crashes
4. **Run Flatten and Audit twice** — some objects need two passes to fix
5. **Save nanoCAD Construction files only in DWG format** — DXF permanently destroys intelligent objects
6. **Use SPEXPLODEALL before sharing with non-Construction users** — converts to standard primitives
7. **Save files as DWG 2013 before trial expiry** — ensures Free v5 compatibility
8. **Use Autodesk TrueView for DWG version conversion** — free tool for downgrading DWG format
9. **Keep DWG backups before any format conversion** — preserves intelligent objects
10. **Generate crash reports with Problem Report tool** — essential for support investigation
