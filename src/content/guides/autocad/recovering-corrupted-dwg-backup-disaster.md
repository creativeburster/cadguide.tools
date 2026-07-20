---
title: "Recovering Corrupted DWG Files: A Complete Disaster Recovery Workflow"
excerpt: "Step-by-step methods to recover damaged or unreadable AutoCAD DWG files using built-in tools, backup files, and third-party repair utilities."
category: "troubleshooting"
softwareSlug: "autocad"
keyword: "recover corrupted dwg"
slug: "recovering-corrupted-dwg-backup-disaster"
author: "CADGuide Tools Editorial Team"
readTime: "14 min read"
date: "2026-06-25"
sources:
  - "https://knowledge.autodesk.com/support/autocad/troubleshooting/caas/sfdcarticles/sfdcarticles/AutoCAD-File-Corruption.html"
  - "https://knowledge.autodesk.com/support/autocad/learn-explore/caas/sfdcarticles/sfdcarticles/how-to-recover-lost-work-due-to-a-crash-in-autocad.html"
---

# Recovering Corrupted DWG Files: A Complete Disaster Recovery Workflow

There's nothing quite like the feeling of trying to open a DWG file you spent 40 hours on and getting a "drawing file is not valid" message. I've been there — heart pounding, deadline looming. Over the years I've developed a recovery workflow that starts with the least invasive methods and escalates from there. Not every method works every time, but I've recovered probably 90% of the corrupted files I've encountered using this sequence.

## Understanding DWG File Corruption

DWG files use a proprietary binary format with a structured header, class section, object map, and data section. Corruption can occur in any of these areas:

- **Header corruption**: The file signature or version marker is damaged. AutoCAD refuses to open the file entirely, reporting "Drawing file is not valid."
- **Object map corruption**: The index linking entity handles to their physical offsets is damaged. AutoCAD may open the file but display missing entities or crash during regeneration.
- **Data section corruption**: Individual entity data is damaged. The drawing opens but specific objects display incorrectly or cause crashes when selected.

The recovery strategy depends on which type of corruption has occurred and whether AutoCAD can partially read the file.

## Method 1: Use the .BAK Backup File

Every time AutoCAD saves a drawing, it creates a `.bak` backup of the previous version in the same directory. This is the fastest and most reliable recovery method.

1. Close AutoCAD.
2. Open File Explorer and navigate to the folder containing the corrupted `.dwg` file.
3. Locate the `.bak` file with the same name (e.g., `floor_plan.bak` for `floor_plan.dwg`).
4. Copy the `.bak` file to a safe location (do not move it — keep the original in place).
5. Rename the copied file's extension from `.bak` to `.dwg`.
6. Open the renamed file in AutoCAD.

If File Explorer does not show `.bak` files, enable file extensions: View > Show > File name extensions.

**Limitation**: The `.bak` file represents the state before the last save. Any work done in the final session before corruption will be lost. However, recovering a drawing that is one save behind is vastly preferable to losing everything.

## Method 2: Use the Automatic Save File (.SV$)

AutoCAD creates automatic save files at regular intervals (default: every 10 minutes). These files have the `.sv$` extension and are stored in a temporary directory.

### Locate the .SV$ Files

1. In AutoCAD (or a new instance if the original crashed), type:
   ```
   OPTIONS
   ```
2. Go to the "Files" tab.
3. Expand "Automatic Save File Location."
4. Note the directory path (typically `%TEMP%\` or a custom path).

Alternatively, check the system variable directly:

```
SAVEFILEPATH
```

### Recover from .SV$

1. Navigate to the automatic save directory in File Explorer.
2. Look for `.sv$` files with timestamps matching your last editing session.
3. Copy the `.sv$` file to a safe location.
4. Rename the extension from `.sv$` to `.dwg`.
5. Open in AutoCAD.

The `.sv$` file may be more recent than the `.bak` file, potentially recovering work that was done after the last manual save but before the crash.

### Configure More Frequent AutoSaves

To minimize future data loss, reduce the automatic save interval:

```
SAVETIME
```

Set the value from `10` (default) to `5` or `3` minutes. The tradeoff is a brief pause every few minutes during saves, which is negligible compared to the risk of losing 10 minutes of work.

## Method 3: Use the RECOVER Command

AutoCAD includes a built-in drawing recovery tool that can repair damaged files that still have a recognizable header.

1. Open AutoCAD (do not open the corrupted file directly).
2. Type `RECOVER` in the command line.
3. In the file selection dialog, navigate to and select the corrupted `.dwg` file.
4. AutoCAD will analyze the file, attempt to repair the header, rebuild the object map, and recover as many entities as possible.
5. Review the recovery log in the text window. It will report:
   - Number of objects recovered
   - Number of errors found and fixed
   - Number of objects that could not be recovered

If RECOVER reports "0 objects recovered," the file header is severely damaged. Proceed to Method 4.

## Method 4: Use DRAWINGRECOVERY Manager

After a crash, AutoCAD's Drawing Recovery Manager automatically lists files that were open during the crash:

1. Relaunch AutoCAD after the crash.
2. The Drawing Recovery Manager palette should appear automatically. If not, type:
   ```
   DRAWINGRECOVERY
   ```
3. The palette displays three categories:
   - **Backup Files**: `.bak` files from the crashed session
   - **AutoSave Files**: `.sv$` files from the crashed session
   - **Original Drawing Files**: The last manually saved versions

4. Expand each category to find the most recent version of your drawing.
5. Right-click the file and select "Open" to load it directly, or "Save As" to preserve it as a new DWG.

## Method 5: Insert the Corrupted Drawing into a New File

When AutoCAD cannot open a file directly, it can sometimes read the file's entities by inserting it as a block into a clean drawing:

1. Create a new drawing (`NEW` command).
2. Type `INSERT` in the command line.
3. In the Insert dialog, click "Browse" and select the corrupted `.dwg` file.
4. Uncheck "Insert as block" — instead, use the `-INSERT` command (command-line version):
   ```
   -INSERT
   ```
5. When prompted for a block name, type `*` followed by the full path to the corrupted file:
   ```
   *C:\Projects\Floor_Plan_Corrupted.dwg
   ```
   The `*` prefix tells AutoCAD to explode the drawing on insertion rather than creating a block definition.

6. If successful, the entities from the corrupted file will appear in the new drawing. Save immediately.

This method bypasses some header validation and can recover entities from files that RECOVER cannot process.

## Method 6: Use the WBLOCK Command on a Partially Openable File

If AutoCAD can open the file but crashes during specific operations, extract healthy portions using WBLOCK:

1. Open the corrupted drawing (if possible).
2. Type `WBLOCK`.
3. In the Write Block dialog, select "Objects."
4. Click the "Select Objects" button and window-select the entities you want to extract.
5. Specify a destination file and click OK.
6. Repeat for different sections of the drawing.

This method allows you to salvage the undamaged portions of a partially corrupted file.

## Method 7: Repair with Third-Party Tools

If all AutoCAD-native methods fail, specialized DWG repair tools can sometimes recover files that AutoCAD itself cannot read.

### Autodesk DWG TrueView

Download DWG TrueView (free) from Autodesk:

```
https://www.autodesk.com/viewers/dwg-trueview
```

DWG TrueView uses the same Teigha file reader as AutoCAD but with a different error-handling path. It can sometimes open files that AutoCAD rejects. If it opens the file, use the "Save As" function to save a clean copy in the current DWG version.

### ODA File Converter

The Open Design Alliance provides a free file converter that reads and rewrites DWG files:

```
https://www.opendesign.com/guestfiles/oda_file_converter
```

Select the directory containing the corrupted file, choose an output directory, and specify the target DWG version. The converter reads the file using the ODA SDK, which has its own corruption recovery logic, and writes a fresh file with a valid header.

### Professional Recovery Services

For critical project files where all other methods have failed, professional DWG recovery services exist:

- **Autodesk Subscription Support**: Available to subscribers on active maintenance plans. Submit the file through the Autodesk Account portal.
- **Recoveronix (formerly OfficeRecovery)**: A commercial service specializing in DWG repair at `https://www.officerecovery.com/autocad/dwg_repair.htm`
- **DataNumen DWG Repair**: Another commercial tool at `https://www.datanumen.com/dwg-repair/`

These services typically charge per file but can recover data from severely corrupted files that no desktop tool can read.

## Preventing Future Corruption

### Enable Incremental Saves

```
ISAVEPERCENT
```

Set this to `50` (default is `0`). This instructs AutoCAD to perform incremental saves, writing only changed portions of the drawing rather than rewriting the entire file. Incremental saves reduce disk I/O and lower the probability of corruption during a save operation.

### Use DWG Version Control

Maintain sequential versions of important drawings:

```
floor_plan_v01.dwg
floor_plan_v02.dwg
floor_plan_v03.dwg
```

Use the `SAVEAS` command at key milestones rather than overwriting a single file. If the current version becomes corrupted, you can always fall back to the previous version.

### Verify Network Storage Reliability

DWG corruption frequently occurs when saving to network drives (SMB/NFS) with unreliable connections. Symptoms include:

- Files that grow to abnormally large sizes
- Save operations that take significantly longer than usual
- "Disk full" errors when the drive has ample free space

If you experience these symptoms, save locally and copy to the network drive using Windows Explorer rather than AutoCAD's native save-to-network function.

### Run AUDIT Regularly

Incorporate `AUDIT` into your workflow:

```
AUDIT
```

Run this command at the end of each editing session, before saving. Answer `Y` to the "Fix any detected errors?" prompt. This catches minor database inconsistencies before they escalate into corruption that prevents file opening.
