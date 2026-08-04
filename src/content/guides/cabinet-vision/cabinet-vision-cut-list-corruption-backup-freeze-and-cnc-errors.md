---
title: "Cabinet Vision Cut List Corruption, Backup Freeze, and CNC Errors"
excerpt: "Cabinet Vision Cut List Corruption, Backup Freeze, and CNC Errors: symptoms, root causes, and step-by-step fixes, verified against Thermwood and WOODWEB forums."
category: "manufacturing"
softwareSlug: "cabinet-vision"
keyword: "Cabinet Vision cut list negative sheet count corrupted cabinet file backup freeze system parameters update error 3704 Windows update THM.exe crash nesting corrupt database jobs over 30 sheets full hard drive"
slug: "cabinet-vision-cut-list-corruption-backup-freeze-and-cnc-errors"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
---

# Cabinet Vision Cut List Corruption, Backup Freeze, and CNC Errors: Negative Sheet Count from Corrupted Cabinet File, Backup Freeze from System Parameters, Update Error #3704 from Windows Update, THM.exe Crash on Nesting from Corrupt Database, and THM Software Crash on Jobs Over 30 Sheets from Full Hard Drive

Cabinet Vision and its Thermwood CNC integration (THM/Control Nesting) suffer from file corruption, backup failures, update errors, and nesting crashes. This guide covers the 5 most common Cabinet Vision and THM problems with diagnostic steps and community-verified fixes from Thermwood and WOODWEB forums.

## 1. Cut List Shows Negative Sheet Count (-2147483647) from Corrupted Cabinet File

### Symptom

The cut list displays an impossible negative number of sheets: -2147483647 sheets of melamine. The issue can be narrowed down to one specific cabinet in the job.

### Root Cause

The cabinet file has internal corruption. The value -2147483647 is the minimum value of a 32-bit signed integer, indicating an integer overflow caused by corrupted part data in the cabinet file. Part Editor cuts may have become corrupted even if they're not visible.

### Fix

1. **Remove Part Editor Cuts from the entire cabinet**:
   - Open the problematic cabinet in the Cabinet Editor
   - Right-click and choose "Remove Part Editor Cuts from the entire cabinet"
   - This regenerates the cabinet from scratch
   - The cut list should return to normal

2. **Re-apply Part Editor cuts if needed**:
   - After regeneration, re-create any necessary Part Editor cuts
   - Test the cut list after each cut to ensure it doesn't corrupt again

3. **Identify the corrupted cabinet**:
   - Remove cabinets from the job one by one
   - Check the cut list after each removal
   - When the cut list returns to normal, the last removed cabinet is the culprit

### Community Report

> "It looks like something got corrupted in the cabinet file. Open the cabinet in the cab editor, right click and choose to Remove Part Editor Cuts from the entire cabinet. This will regenerate the cabinet and that seemed to fix the cut list."

## 2. Backup Freeze from System Parameters

### Symptom

Cabinet Vision freezes when attempting to back up. The backup process starts but Cabinet Vision stops responding. Reinstalling Cabinet Vision doesn't fix the issue.

### Root Cause

The "System Parameters" option in the backup list causes the freeze. Additionally, user permissions to the backup destination folder can cause the backup to hang.

### Fix

1. **Untick "System Parameters" in the backup list**:
   - Open the backup dialog
   - Uncheck "System Parameters" from the backup options
   - Try the backup again

2. **Check user permissions**:
   - Ensure the user has full read/write access to the backup destination folder
   - Try backing up to a different location (e.g., Desktop)
   - If backing up to a network drive, check network permissions

3. **Remove items from catalog**:
   - If the catalog is very large, remove unused items
   - A bloated catalog can cause the backup to hang

4. **Clean reinstall** — if the above doesn't work:
   - Uninstall Cabinet Vision completely
   - Delete remaining files in the installation directory
   - Reinstall from a fresh download
   - Don't restore the old backup — start fresh

### Community Report

> "Untick the 'system parameters' in the backup list. Failing that, check your user permissions to access/write to the folder where the backup is going."

## 3. Update Error #3704 from Windows Update

### Symptom

Error #3704 — "Operation is not allowed when the object is closed" — occurs during the Cabinet Vision update process. Reinstalling Cabinet Vision doesn't fix it. The error recurs after each Windows update.

### Root Cause

Windows updates can break the database connection that Cabinet Vision relies on. The error is a database connectivity issue — the ADODB connection object is closed when the update process tries to use it.

### Fix

1. **Check if a recent Windows update caused the issue**:
   - Go to Settings → Update & History → View update history
   - Note the most recent updates
   - Try uninstalling the most recent update and running Cabinet Vision

2. **Reinstall Windows** — multiple users report this as the only permanent fix:
   - This is drastic but may be necessary if the database components are deeply corrupted

3. **Repair Windows database components**:
   - Run `sfc /scannow` in Command Prompt (Admin)
   - Run `DISM /Online /Cleanup-Image /RestoreHealth`
   - Reinstall MDAC (Microsoft Data Access Components)

4. **Use Windows System Restore**:
   - Restore to a point before the Windows update
   - Disable automatic Windows updates
   - Manually install updates one at a time, testing Cabinet Vision after each

5. **Contact Cabinet Vision support** — they may have a patch for specific Windows update compatibility issues

### Community Report

> "Looks that cause windows update. I need to reinstall windows to fix that error, and it happens again and again after windows update."

## 4. THM.exe Crash on Nesting from Corrupt Database

### Symptom

THM.exe crashes when trying to nest cabinets. The error message says "THM.exe has generated errors and will be closed by windows." The crash occurs specifically when clicking "Load" to open a .twd file in the nesting menu. Files can still be opened from the "Load File" menu and run, but nesting is impossible.

### Root Cause

The Control Nesting database is corrupt. The installer can replace some databases, but a proper uninstall/reinstall sequence is required to fully clear the corruption.

### Fix

Follow this exact sequence (skipping steps will not work):

1. **Close THM completely** — THM must be closed for installers to work properly
2. **Run the installer for 5.59** — choose **Remove**
3. **Run the installer for 5.59** — let it **install**
4. **Run the installer for 5.59 Patch 3** — choose **Remove**
5. **Run the installer for 5.59 Patch 3** — let it **install**
6. **Restart THM** and test nesting

If this doesn't work, additional steps:

7. **Delete database files manually**:
   - Find the Control Nesting database folder
   - Delete all database files
   - Control Nesting recreates them automatically on launch

8. **Check for Windows file corruption**:
   - The previous owner may have cloned the HDD multiple times
   - Some Windows files may be corrupt
   - Consider a fresh Windows install using the machine's restore disk

### Community Report

> "Make sure to follow the below steps for proper uninstall and reinstall: 1. Close down THM. 2. Run the installer for 5.59, choose Remove. 3. Run the installer for 5.59 and let it install. 4. Run the installer for 5.59 Patch 3, choose Remove. 5. Run the installer for 5.59 Patch 3 let it install. 6. Restart THM and see if that corrects the issue."

> "I just followed those steps and it's working again!"

## 5. THM Software Crash on Jobs Over 30 Sheets from Full Hard Drive

### Symptom

THM crashes when clicking "Write CNC" on a large job with about 36 sheets of cabinets. The software loads for a few seconds then crashes with "THM has generated errors and was closed by windows." Reinstalling Control Nesting and rebooting doesn't help.

### Root Cause

The hard drive is nearly full. When generating CNC code for large jobs, THM needs significant temporary disk space. If the drive is too full, the write operation fails and THM crashes.

### Fix

1. **Free up hard drive space**:
   - Remove old job files and backups
   - Run Disk Cleanup
   - Defragment the hard drive
   - Target at least 20% free space on the drive

2. **Split the job** — if you can't free enough space:
   - Split the 36-sheet job into two 18-sheet jobs
   - Nest and write CNC for each half separately
   - Combine the output files if needed

3. **Check the 999 parts limit** — Control Nesting has a limit of 999 parts:
   - If the job exceeds 999 parts, you'll get a "too many parts" error
   - Split the job to stay under the limit

4. **Move temporary files to a different drive**:
   - If THM allows changing the temp directory, point it to a drive with more space
   - Or move other files off the THM drive to free space

### Community Report

> "Your hard drive might be full. You could try removing all older files and then doing a cleanup and defrag."

> "Hi, sorry I totally forgot to reply before. You were right, the hard drive was pretty close to full so I ran defrag and cleared out some old files. It's running well again now."

## 6. Additional Cabinet Vision Issues

### Cabinet Vision Freezing on First Open After Install

**Issue**: Cabinet Vision freezes when opening for the first time after installation, during the backup process.
**Fix**: Untick system parameters in backup, check permissions, and ensure the catalog is not bloated.

### Windows XP/2000 Activation for Older Machines

**Issue**: Restoring an older Thermwood controller with Windows XP/2000 — Microsoft no longer activates these versions.
**Fix**: Use a disk image from a working machine. Microsoft may still reactivate by phone. Consider a controller upgrade.

### Corrupt Database After Windows Update

**Issue**: Database corruption recurs after every Windows update.
**Fix**: Disable automatic updates, manually install updates one at a time, test CV after each.

## Best Practices

1. **Remove Part Editor Cuts to fix cut list corruption** — regenerates the cabinet file
2. **Untick System Parameters in backup** — prevents backup freeze
3. **Check backup folder permissions** — ensure full read/write access
4. **Be cautious with Windows updates** — they can break CV database connections
5. **Follow the exact 6-step uninstall/reinstall sequence for THM** — skipping steps won't work
6. **Keep at least 20% free hard drive space** — prevents THM crash on large jobs
7. **Split jobs over 30 sheets** — reduces memory and disk space requirements
8. **Run Disk Cleanup and Defrag regularly** — especially on older Windows 2000/XP machines
9. **Keep old job files cleaned up** — frees disk space and prevents corruption
10. **Consider a fresh Windows install for persistent issues** — if corruption recurs
