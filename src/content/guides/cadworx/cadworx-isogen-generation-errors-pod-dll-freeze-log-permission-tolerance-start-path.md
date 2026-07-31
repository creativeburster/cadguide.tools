---
title: "CADWorx ISOGEN Generation Errors: Error 32 from Outdated pod.dll, ISO Generation Freeze on Line Output, Isogen.log Write Permission Error, Node Coordinate Tolerance Below 1/256 Inch, and I-Configure Start Path Blank"
excerpt: "CADWorx ISOGEN fails for 5 distinct reasons: Error 32 from outdated pod.dll in I-Configure core components, ISO generation freezes CADWorx when attempting to ISO a line, 'Error opening file for write' for isogen.log in system32, isometric generation errors from node coordinates off by less than 1/256 inch, and I-Configure Option Start In path blank causing write errors. We cover each with fixes from Eng-Tips and AutoCAD forums."
category: "isogen-generation-errors"
softwareSlug: "cadworx"
keyword: "CADWorx ISOGEN Error 32 pod.dll I-Configure freeze isogen.log write permission node coordinate tolerance 1/256 inch Start In path blank"
slug: "cadworx-isogen-generation-errors-pod-dll-freeze-log-permission-tolerance-start-path"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://www.eng-tips.com/threads/cadworx2019-personal-isogen-error-32.583789/"
  - "https://www.cadtutor.net/forum/topic/42179-isogen-freezing-cadworx-when-i-attempt-to-iso-a-line/"
  - "https://www.eng-tips.com/threads/error-isogen-of-cadworx.488904/"
---

# CADWorx ISOGEN Generation Errors: Error 32 from Outdated pod.dll, ISO Generation Freeze on Line Output, Isogen.log Write Permission Error, Node Coordinate Tolerance Below 1/256 Inch, and I-Configure Start Path Blank

CADWorx Plant uses ISOGEN (now part of Hexagon PPM) to generate isometric drawings from piping models. However, ISOGEN failures are common: Error 32 from outdated DLLs, freezes during line output, log file write permission errors, impossible coordinate tolerances, and configuration path issues. This guide covers the 5 most common ISOGEN failure modes with diagnostic steps and community-verified fixes.

## 1. Error 32: Outdated pod.dll

### Error Message

```
Personal ISOGEN Error 32
```

### Symptom

Attempting to generate isometrics in CADWorx Plant 2019 produces Error 32. The isometric cannot be generated.

### Root Cause

The `pod.dll` file in the I-Configure core components folder is outdated. This DLL is responsible for processing ISOGEN output data, and version mismatches between CADWorx and ISOGEN components cause Error 32.

### Fix

1. **Update pod.dll**:
   - Locate the I-Configure core components folder (typically `C:\CADWorx 2019\I-Configure\CoreComponents\`)
   - Replace the old `pod.dll` with the updated version
   - The updated DLL must match the CADWorx version

2. **Version-specific DLLs**:
   - CADWorx 2018 and 2019: Use the DLL package labeled "CADWorx 2018 and 2019"
   - CADWorx 2017 and earlier: Use the DLL package labeled "CADWorx 2017 and earlier"
   - CADWorx 2013: Uses a different DLL version

3. **Contact Hexagon PPM support** for the correct pod.dll if not available from colleagues
4. **Reinstall I-Configure** — a full reinstall may restore the correct DLL versions
5. **Check for Windows updates** — some DLL dependencies require specific Visual C++ redistributables

### Community Reports

Multiple users report this issue across CADWorx versions 2013 through 2019. The fix is consistently replacing pod.dll with the correct version. Users frequently share the DLL on forums since Hexagon's distribution can be difficult to access.

## 2. ISO Generation Freeze: CADWorx Hangs on Line Output

### Symptom

When attempting to generate an isometric for a specific line, CADWorx freezes. The ISOGEN process starts but never completes. AutoCAD/CADWorx becomes unresponsive.

### Diagnosis

1. **Check if the issue is line-specific**:
   - Try generating ISOs for other lines — if they work, the problem is in the specific line
   - Try generating a Quick ISO vs Production ISO

2. **Check the model for connectivity issues**:
   - Verify all components are properly connected
   - Look for teardrops (indicate connection problems)
   - Check for duplicate or overlapping components

3. **Check ISOGEN configuration**:
   - Verify the ISOGEN style is correctly configured
   - Check the I-Configure settings for the line number

### Fix

1. **Simplify the line** — remove complex components and retry
2. **Check for invalid components** — some component types may not have ISOGEN symbols defined
3. **Verify spec compatibility** — ensure all components in the line have valid ISOGEN symbol mappings
4. **Update ISOGEN/I-Configure** — older versions have bugs that cause freezes on certain configurations
5. **Check the isogen.log file** for error codes — may indicate the specific component causing the freeze
6. **Run AUDIT on the DWG** — fix any drawing corruption that may affect ISOGEN

## 3. Isogen.log Write Permission Error

### Error Message

```
Error opening file for write (1)
File: C:\WINDOWS\system32\isogen.log
```

### Symptom

When executing the IGO or IGB command to generate isometrics, the error appears. The isometric cannot be generated.

### Root Cause

ISOGEN tries to write its log file to `C:\WINDOWS\system32\`, which requires administrator privileges. If the user doesn't have write access to this directory, the log file creation fails and ISOGEN aborts.

### Fix

1. **Set the I-Configure Option "Start In" path**:
   - Open I-Configure
   - Navigate to the Option settings
   - Set the "Start In" field to a writable path, e.g., `C:\CADWorx 2018\`
   - This must NOT be blank — a blank Start In path causes ISOGEN to default to the system directory

2. **Run CADWorx as Administrator** — provides write access to system32 (not recommended as a permanent fix)

3. **Create a dedicated ISOGEN output folder**:
   - Create a folder like `C:\CADWorx\IsogenOutput\`
   - Set this as the Start In path in I-Configure
   - Ensure all users have write access to this folder

4. **Check folder permissions** — ensure the user account has write access to the configured output path

## 4. Node Coordinate Tolerance: Errors Below 1/256 Inch

### Symptom

Isometric generation fails with ISOGEN errors. The model shows all components connected — welds and gaskets appear, no teardrops indicate problems. But ISOGEN reports errors.

### Diagnosis

1. **Check node coordinates**:
   - After ISOGEN fails, go back to the model
   - Check distances between connected nodes in X, Y, and Z
   - Look for discrepancies of less than 1/256" (0.0005 in decimal units, or 0.006mm)

2. **The tolerance threshold**:
   - ISOGEN errors when node coordinates differ by more than ~0.000177091"
   - This is far more precise than the 1/16" or even 1/32" that would be reasonable
   - The model shows connections correctly because AutoCAD's offset tolerance is more lenient

### Root Cause

ISOGEN's internal tolerance for node alignment is extremely tight — much tighter than AutoCAD's modeling tolerance. Components that appear connected in the model may have microscopic coordinate differences that ISOGEN rejects.

### Fix

1. **Correct the node coordinates**:
   - Identify the nodes with coordinate discrepancies
   - Adjust X, Y, and Z values so they read exactly 0.000000000
   - The ISO will generate after correction

2. **Use node snaps** — always connect components using node snaps, not approximate clicks
3. **Check the DefaultConnectorsConfig.xml**:
   - Offset tolerance and slope tolerance can be set per joint type
   - Located in each project's configuration files
4. **Note**: There is **no ISOGEN tolerance setting** that can be adjusted to be less severe. The tolerance is hardcoded.
5. **Weld gap settings** — check Project Setup → Iso Settings → weld gaps (typically 0.125)

### Community Frustration

> "Having an iso generate errors because there is a discrepancy of .006 in the X, Y or Z is ridiculous especially since the model shows the piping connected to the adjacent fitting and shows in the model a weld, or a gasket for a flange set, and there are no tear drops shown anywhere on the model to indicate any errors."

This is a known limitation of ISOGEN — the modeling tolerance and ISOGEN tolerance are mismatched. There is no user-adjustable ISOGEN tolerance setting.

## 5. I-Configure Start Path Blank

### Symptom

ISOGEN produces errors when generating isometrics. The I-Configure Option "Start In" field is blank.

### Root Cause

When the "Start In" path is blank, ISOGEN doesn't know where to write temporary files and logs. It defaults to the working directory, which may be the system directory or a read-only location.

### Fix

1. **Set the Start In path in I-Configure**:
   - Open I-Configure
   - Find the Option settings
   - Set "Start In" to the CADWorx installation path, e.g., `C:\CADWorx 2018\`
   - This path must be writable by all users

2. **Verify the path exists** — don't use a path that doesn't exist
3. **Use a dedicated folder** — create a specific folder for ISOGEN output
4. **Check network paths** — if using a network drive, ensure all users have read/write access

## 6. Additional ISOGEN Issues

### Missing ISOGEN Symbols

**Issue**: Components in the model don't have corresponding ISOGEN symbols in the spec.
**Fix**: Verify that all component types have SKEY (Symbol Key) mappings in the ISOGEN symbol library.

### Custom Spec ISOGEN Errors

**Issue**: Custom pipe specs may not have complete ISOGEN configurations.
**Fix**: Compare custom spec ISOGEN settings with out-of-the-box specs to identify missing configurations.

### Large Model ISOGEN Performance

**Issue**: Generating ISOs for a large model with many line numbers takes excessive time.
**Fix**: Generate ISOs line by line rather than for the entire model at once.

### ISOGEN Style Backup

**Issue**: ISOGEN style files become corrupted or misconfigured.
**Fix**: Always maintain a backup of the ISOGEN Style files. When sending support requests, include:
- The CAD model drawing (DWG) files
- Any isometrics generated by ISOGEN
- The ISOGEN style files
- The specific line numbers having issues

## Best Practices

1. **Update pod.dll** to match your CADWorx version — the most common fix for Error 32
2. **Set I-Configure Start In path** — must not be blank, must be writable
3. **Use node snaps for all connections** — prevents coordinate tolerance errors
4. **Check node coordinates after ISOGEN errors** — look for discrepancies < 1/256"
5. **Correct coordinates to exactly 0.000000000** — the only fix for tolerance errors
6. **Run AUDIT on the DWG** before generating ISOs — fixes drawing corruption
7. **Generate ISOs line by line** — don't process the entire model at once
8. **Maintain ISOGEN style backups** — include in support requests
9. **Verify SKEY mappings** for all custom components in the spec
10. **Create a dedicated ISOGEN output folder** — with write access for all users
