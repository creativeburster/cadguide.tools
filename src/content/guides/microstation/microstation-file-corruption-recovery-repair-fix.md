---
title: "MicroStation File Corruption: Recovery, Compress, and Axiom FileFixer Workflow"
excerpt: "MicroStation files won't open, crash on save, or show missing elements due to corruption. I cover the built-in file repair, compress options, and the manual recovery workflow that saves corrupted design files."
category: "troubleshooting"
softwareSlug: "microstation"
keyword: "MicroStation file corruption recovery crash won't open repair"
slug: "microstation-file-corruption-recovery-repair-fix"
author: "CAD IT Admin"
readTime: "8 min"
date: "2025-06-22"
sources:
  - "https://docs.bentley.com/LiveContent/web/MicroStation-v2024.2/ReadMe/en/html5/topics/369286/GUID-CC5461A6-5F9E-412F-B22C-A89884C8A992.html"
  - "https://www.bentley.com/en/support"
  - "https://www.bentley.com/en/products/product-line/microstation"
---

# MicroStation File Corruption: Recovery, Compress, and Axiom FileFixer Workflow

Axiom Int., a Bentley third-party support provider, describes file corruption as one of the top 10 MicroStation problems: "Problems that cause MicroStation to crash or prevent design files from opening can lead to late nights and working on weekends." Their FileFixer tool is specifically designed to repair corruption that MicroStation's built-in tools can't handle. Bentley's MicroStation 2024 release notes also list multiple defect fixes related to file corruption and stability.

File corruption in MicroStation can manifest as:
- File won't open (MicroStation crashes or hangs during loading)
- File opens but elements are missing
- File opens but crashes when saving
- File opens but displays error messages about invalid elements
- File size is unexpectedly large (bloat from corrupted data)

## Fix 1: Use MicroStation's Built-in File Repair

MicroStation has a built-in file checking and repair tool:

1. Close all files in MicroStation
2. Go to **File → Check File**
3. Select the corrupted file
4. Choose **Repair** mode (not just **Check**)
5. MicroStation scans the file for:
   - Corrupted element headers
   - Invalid geometry data
   - Broken level references
   - Corrupted cell definitions
   - Invalid font references
6. Click **Repair** to fix found issues
7. Save the repaired file with a new name (don't overwrite the original)

### When This Works

- Files with minor corruption (a few invalid elements)
- Files that crash occasionally but not consistently
- Files with bloat from deleted elements that weren't properly removed

### When This Doesn't Work

- Files that won't open at all (MicroStation crashes before repair can run)
- Files with severe level table corruption
- Files with corrupted file headers

## Fix 2: Use the Compress Command

File compression removes deleted elements and unused data, which can fix corruption caused by bloat:

1. Open the file (if it opens)
2. Go to **File → Compress → Compress Options**
3. Select all options:
   - **Delete unused levels**
   - **Delete unused attachment levels**
   - **Delete unused definitions** (cells, line styles, text styles)
   - **Delete unused shared cells**
   - **Delete orphaned elements**
4. Click **Compress**
5. Save the compressed file with a new name

### Compress from Command Line

If the file won't open normally, try compressing from the command line:

1. Open a command prompt
2. Navigate to the MicroStation program directory
3. Run: `microstation.exe -w -c "path\to\corrupted.dgn"`
4. The `-w` flag opens the file in a repair/work mode
5. If the file opens, run the compress command
6. Save with a new name

## Fix 3: Recover from Backup Files

MicroStation creates backup files automatically:

1. Look for `.bak` files in the same directory as the corrupted file
2. The `.bak` file is the previous version before the last save
3. Copy the `.bak` file and rename it to `.dgn`
4. Open the renamed file
5. If it opens successfully, you've recovered the pre-corruption version

### Previous Version Recovery

If the `.bak` file is also corrupted:

1. Right-click the corrupted file in Windows File Explorer
2. Select **Properties → Previous Versions**
3. Windows may have shadow copies from System Restore or File History
4. Select a version from before the corruption occurred
5. Copy the previous version to a new location

## Fix 4: Use the Key-in Commands for Recovery

MicroStation key-in commands can sometimes access corrupted files that won't open normally:

1. Open MicroStation with a blank file
2. In the key-in dialog, type:
   ```
   RF=path\to\corrupted.dgn
   ```
   This reads the file as a reference
3. If the file loads as a reference, use:
   ```
   FENCE FILE>path\to\recovered.dgn
   ```
4. This copies all elements from the reference into a new file
5. The new file has a clean file structure, free from corruption

### Alternative Key-in Recovery

1. Open MicroStation with a blank seed file
2. Key-in: `REFERENCE ATTACH path\to\corrupted.dgn`
3. If the reference attaches, key-in: `FENCE CREATE ALL`
4. Key-in: `FENCE FILE>path\to\recovered.dgn`
5. Open the recovered file and verify all elements are present

## Fix 5: Use Axiom FileFixer

For corruption that MicroStation's built-in tools can't fix, Axiom's FileFixer is the industry-standard recovery tool:

1. Purchase and install FileFixer from axiomint.com
2. Run FileFixer on the corrupted file
3. FileFixer performs deep-level analysis:
   - Scans every element in the file
   - Identifies and repairs corrupted element headers
   - Rebuilds the level table
   - Removes orphaned data
   - Repairs cell definitions
4. FileFixer can repair files that won't open in MicroStation at all
5. The repaired file is saved with a new name

### When to Use FileFixer

- When MicroStation's built-in repair fails
- When the file won't open at all
- When the file was corrupted by a crash during save
- When the file was recovered from a damaged drive
- For batch processing of multiple corrupted files

## Fix 6: Prevent Corruption with Best Practices

### Save Regularly

1. Set MicroStation to auto-save: **Workspace → Preferences → Operation**
2. Set **Save interval** to 15 minutes
3. This reduces the amount of work lost if a crash occurs

### Don't Work Over the Network

1. Copy files from network drives to local storage before editing
2. Network interruptions during save can corrupt files
3. Copy the file back to the network after saving locally

### Keep File Sizes Manageable

1. Compress files regularly (see Fix 2)
2. Split large files into multiple smaller files using references
3. Keep individual design files under 100MB when possible
4. Use references for survey data, existing conditions, and background imagery

### Use Seed Files

1. Always start new files from a standard seed file
2. Don't create files by copying and renaming existing files
3. Copying can carry over corruption from the original file
4. Seed files have clean file structures

### Close References Before Closing the Master File

1. Detach all references before closing the master file
2. This prevents reference corruption from affecting the master file
3. Re-attach references when you reopen the file

## Fix 7: Recover Elements from Corrupted Files

If you can open the file but some elements are missing or corrupted:

1. Open the file in MicroStation
2. Go to **Edit → Select All** (Ctrl+A)
3. Copy all elements: **Ctrl+C**
4. Create a new file from a seed file
5. Paste the elements: **Ctrl+V**
6. This copies only valid elements, leaving corrupted ones behind
7. Check which elements are missing and recreate them

## Fix 8: Check for Reference Corruption

Sometimes the master file is fine, but a reference file is corrupted:

1. Open the master file
2. If it's slow or crashes, detach all references
3. Re-attach references one at a time
4. When attaching a specific reference causes problems, that reference is corrupted
5. Repair the reference file using the methods above
6. Re-attach the repaired reference

## Summary

| Fix | Type | When to Use |
|-----|------|-------------|
| Built-in file repair | First step | File opens but has issues |
| Compress command | Maintenance | File opens but is bloated |
| Backup file recovery | Quick recovery | .bak file exists |
| Key-in recovery | Advanced | File won't open normally |
| Axiom FileFixer | Last resort | All other methods fail |
| Prevent corruption | Preventive | Ongoing best practices |
| Element copy to new file | Partial recovery | Some elements missing |
| Check reference corruption | Diagnostic | Master file seems fine |

The most effective recovery strategy is: try the built-in repair first, then try the key-in fence file method, then use FileFixer as a last resort. For prevention, always work on local copies (not network drives), compress files regularly, and use standard seed files for new designs.
