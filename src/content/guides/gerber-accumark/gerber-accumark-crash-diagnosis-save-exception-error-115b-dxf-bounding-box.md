---
title: "Gerber AccuMark Crash Diagnosis: Save Button E06D7363 Exception, Error 115b Corrupt Piece, DXF Bounding Box Import, and Database Integrity"
excerpt: "Gerber AccuMark crashes on save with Exception E06D7363, corrupts pattern pieces with Error 115b, imports DXF files with unwanted bounding boxes, and loses network license connectivity. We cover each crash and corruption type with diagnostic steps and fixes from user reports and Gerber support channels."
category: "crash-diagnosis"
softwareSlug: "gerber-accumark"
keyword: "Gerber AccuMark crash save E06D7363 error 115b corrupt piece DXF bounding box database"
slug: "gerber-accumark-crash-diagnosis-save-exception-error-115b-dxf-bounding-box"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://learn.microsoft.com/en-us/answers/questions/3786476/exception-code-e06d7363-using-gerber-accumark"
  - "https://www.congnghemay.info/2017/04/gerber-accumark-v9-fix-error-creating-new-piece-115b/"
  - "https://community.adobe.com/questions-652/removing-the-bounding-box-in-pattern-gerber-accumark-808433"
---

# Gerber AccuMark Crash Diagnosis: Save Button E06D7363 Exception, Error 115b Corrupt Piece, DXF Bounding Box Import, and Database Integrity

Gerber AccuMark (now under Lectra ownership) is the apparel industry standard for pattern design and marker making. Users encounter recurring crashes and data corruption issues across versions 9 through 12. This guide covers the 5 most common crash and corruption scenarios with diagnostic steps and community-verified fixes.

## 1. Exception E06D7363 on Save Button (v12.0)

### Symptom

Every time the user clicks the Save button in AccuMark v12.0, the application crashes with:

```
Exception code: E06D7363
```

### Root Cause

The E06D7363 exception is a Windows C++ runtime exception. It occurs when a program tries to copy or move a **locked file**. The file may be blocked by:
- Windows Defender or third-party antivirus
- Malware scanner
- Corrupted system files
- Another process holding a lock on the AccuMark database files

### Diagnostic Steps

1. **Disable third-party antivirus** temporarily and test saving
2. **Run DISM and SFC** to repair system files:
   ```
   dism.exe /online /cleanup-image /restorehealth
   sfc /scannow
   ```
3. **Check Windows Defender exclusions** — add AccuMark installation and data directories to exclusions
4. **Check file permissions** — ensure the user has full read/write access to the AccuMark data directory

### Fix

1. Add AccuMark executable and data folders to antivirus exclusions
2. Run as Administrator
3. If the issue persists after all system repairs, it indicates a deeper AccuMark database corruption — contact Gerber/Lectra support for database repair tools
4. Check if the AccuMark database (Sybase or SQL Anywhere) is running properly — database service crashes can trigger the same exception

### When Nothing Works

Multiple users report that DISM, SFC, and antivirus exclusions do not resolve the issue. In these cases:
- The AccuMark installation itself may be corrupted
- Try a clean reinstall on a fresh Windows profile
- Check for Windows update conflicts — some updates break the C++ runtime that AccuMark depends on

## 2. Error 115b: "A Data Error 115b Has Been Detected" / "Error Creating New Piece"

### Symptom

When opening or creating a pattern piece, AccuMark displays:

```
A data error 115b has been detected
Error creating new piece
```

The affected pattern piece becomes unusable — it cannot be opened, edited, or included in markers.

### Root Cause

The pattern piece data file is **corrupted**. This affects AccuMark versions 8.4, 8.5, and 9. The corruption typically occurs when:
- The application crashes during a save operation
- Network connectivity drops while saving to a network drive
- The database index becomes inconsistent

### Fix

1. **Recover from backup**: Restore the affected piece from a previous backup
2. **Recreate the piece**: If no backup exists, the piece must be recreated from scratch
3. **Run database maintenance**: Use AccuMark's built-in database repair tools to check and repair the data directory
4. **Prevent recurrence**:
   - Save frequently
   - Work locally and sync to network drive (don't work directly on network files)
   - Keep regular backups of the AccuMark data directory

### Version-Specific Fix

AccuMark V9 includes improved error handling for this scenario. Upgrading from V8.4/V8.5 to V9 reduces the frequency of Error 115b occurrences.

## 3. DXF Import: Unwanted Bounding Box

### Symptom

A pattern created in Adobe Illustrator is saved as DXF and imported into AccuMark. The imported pattern includes a **bounding box** that becomes the perimeter line of the pattern piece, making it extremely difficult to remove.

### Workflow That Triggers This

1. Create pattern in Adobe Illustrator
2. Save to desktop
3. Convert saved pattern to DXF
4. Import DXF into Gerber AccuMark
5. Open in AccuMark — bounding box appears as the perimeter

### Root Cause

Illustrator's DXF export includes the artboard or bounding box as part of the DXF geometry. AccuMark interprets all DXF entities as pattern geometry, including the bounding box.

### Fix

**Before export from Illustrator**:
1. **Remove the artboard** or set it to exactly match the pattern boundary
2. **Ungroup all objects** and delete any bounding rectangle
3. **Check for hidden layers** — Illustrator may include invisible bounding objects
4. **Use "Export as DXF"** not "Save As DXF" — different export options may exclude the bounding box

**After import into AccuMark**:
1. Open the pattern piece in the Pattern Design window
2. Identify the bounding box entities (typically the outermost rectangle)
3. **Delete the bounding box lines** — but this is difficult because AccuMark treats them as the piece perimeter
4. **Reassign the internal pattern boundary** as the new perimeter

**Better workflow**:
1. In Illustrator, export only the pattern geometry (no artboard)
2. Use a DXF viewer to verify no bounding box exists before importing
3. Consider using AAMA DXF format if available — it separates pattern geometry from metadata

## 4. Network License Connectivity Issues

### Symptom

AccuMark cannot find the network license server. Users get "No license available" or "License server not found" errors.

### Root Cause

- Network license service not running on the server
- Firewall blocking license communication ports
- License server IP address changed
- AccuMark license configuration pointing to wrong server

### Fix

1. **Verify license service**: Check that the Gerber/Lectra license service is running on the license server
2. **Check firewall**: Ensure license communication ports are open between workstations and server
3. **Verify server IP**: Confirm the license server IP address hasn't changed
4. **Reconfigure license client**: Update the workstation's license configuration to point to the correct server
5. **Check license count**: Ensure the number of concurrent users doesn't exceed the licensed count

## 5. Cross-Functional Team Collaboration Data Issues

### Symptom

Pattern data becomes inconsistent when shared between design, marker making, and cutting departments. Different teams see different versions of the same pattern.

### Root Cause

AccuMark's data management relies on a shared database. Without proper version control:
- Multiple users can edit the same pattern simultaneously
- No locking mechanism prevents conflicting changes
- Sync delays between network copies cause version mismatches

### Fix

1. **Implement a check-in/check-out workflow** — only one user edits a pattern at a time
2. **Use AccuMark's built-in data sharing features** — place and plot special directions on pattern pieces
3. **Create a shared library** of common instructions and phrases to standardize communication
4. **Establish clear data flow**: Design → Pattern → Marker → Cut, with formal handoff at each stage
5. **Use pattern notes** following specific paths to communicate modifications
6. **Regular database maintenance** — run consistency checks on the shared data directory

## Best Practices for AccuMark Stability

1. **Work locally, sync to network** — never work directly on network-stored pattern files
2. **Save frequently** — AccuMark crashes are common, especially on save
3. **Keep regular backups** — the data directory should be backed up daily
4. **Add antivirus exclusions** for AccuMark folders — prevents file lock crashes
5. **Run database maintenance regularly** — prevents index corruption that leads to Error 115b
6. **Verify DXF imports** in a viewer before opening in AccuMark — catches bounding box issues early
7. **Upgrade to latest version** — newer versions have improved error handling and crash recovery
8. **Use AAMA DXF format** for pattern exchange — separates geometry from metadata
9. **Implement formal handoff workflows** between departments — prevents data inconsistency
10. **Contact Gerber/Lectra support** for database repair tools when corruption occurs — don't attempt manual database edits
