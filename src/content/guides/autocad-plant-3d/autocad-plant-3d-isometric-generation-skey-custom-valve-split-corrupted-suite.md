---
title: "AutoCAD Plant 3D Isometric Generation: SKEY Configuration Errors, Custom Valve ISO Splitting, Fixed-Length Pipe Continuation Bugs, Corrupted ISO Suite Recovery, and ACC Cross-Region Template Failures"
excerpt: "Plant 3D isometric generation fails for 5 distinct reasons: incorrect SKEY/symbol type mappings cause disconnected graphics, custom valves with wrong Content Iso Symbol types split ISOs into isolated drawings, TYPE=PIPE-FIXED breaks continuation split marks, corrupted isometric suites produce phantom ISOs from previous routing, and ACC projects fail to generate ISOs in some regions despite identical settings. We cover each with fixes from Autodesk community forums."
category: "isometric-generation"
softwareSlug: "autocad-plant-3d"
keyword: "AutoCAD Plant 3D isometric generation SKEY custom valve split fixed length pipe corrupted suite ACC template"
slug: "autocad-plant-3d-isometric-generation-skey-custom-valve-split-corrupted-suite"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://forums.autodesk.com/t5/autocad-plant-3d-forum/isometric-issues/td-p/10735328"
  - "https://forums.autodesk.com/t5/autocad-plant-3d-forum/isometric-drawings-being-split-too-often-when-using-custom/td-p/13706563"
  - "https://forums.autodesk.com/t5/autocad-plant-3d-forum/production-iso-generation-produces-multiples-includes-previous/td-p/12944547"
---

# AutoCAD Plant 3D Isometric Generation: SKEY Configuration Errors, Custom Valve ISO Splitting, Fixed-Length Pipe Continuation Bugs, Corrupted ISO Suite Recovery, and ACC Cross-Region Template Failures

AutoCAD Plant 3D's isometric generation system converts 3D pipe models into fabrication drawings via PCF (Piping Component File) intermediate format. The process depends on correct SKEY (Symbol Key) mappings, Content Iso Symbol definitions, and a non-corrupted isometric suite. This guide covers the 5 most common isometric generation failures with diagnostic steps and community-verified fixes.

## 1. SKEY and Symbol Type Errors: Disconnected Graphics

### Symptom

After creating a new piping spec and testing isometrics:
- **Blind flange** displays angled relative to its connecting flange, with an unexplained white angled line through the middle
- **Wye component** graphics appear offset/disconnected both within the part and relative to connecting components
- The offset doesn't exist in the 3D model — no leaks or disconnects

### Root Cause

Incorrect **Symbol Type** and **SKEY** assignments in the spec catalog. The SKEY determines how the isometric generator draws each component. Wrong SKEY = wrong graphics.

### Fix

1. **Check connection points** of the parts — there may be an error in the connection point definition
2. **Verify Symbol Type and SKEY** in the spec catalog:
   - Open the Spec Editor
   - Navigate to the affected component
   - Check the SKEY mapping matches the component geometry
   - Common SKEYs: `BLFL` (blind flange), `WYE` (wye fitting)
3. **Amend the Symbol Type and SKEYs** — this resolved the blind flange and wye issues

### Persistent Disconnection on 45-Degree Routing

If elbows still disconnect on isometrics after SKEY verification:
- Check that the line is routed at exactly 45 degrees to the UCS
- Verify the elbow SKEY matches the angle
- Try re-routing the line on clean axis alignment
- Upload a test drawing to the Autodesk forum for community review

## 2. Custom Valves: ISO Drawings Split Too Often

### Symptom

When using custom valves from a custom spec, the isometric generator splits the ISO — the valve is drawn in an isolated ISO drawing by itself. Default P3D spec valves work fine on the same settings.

### Root Cause

Two issues in the custom valve definition:

1. **Connector anchored in wrong class**: The connector for the valve is anchored in the `ELBOW` class, which cannot work this way.

2. **Non-existent SKEY**: The Content Iso Symbol Definition uses type `DIN`, which doesn't exist as a valid SKEY. The isometric generator can't interpret it and splits the drawing.

### Fix

1. **Fix the connector class**: Change the connector from `ELBOW` to the correct valve class
2. **Change the Content Iso Symbol**: Replace `DIN` with a valid SKEY (e.g., `GLOBE`, `GATE`, `CHECK`)
3. **Verify in the ISO Symbol Style**: Ensure the SKEY is configured in `IsoSkeyAcadBlockMap.xml`

### Verification

After changing the Content Iso Symbol, the problem should be resolved. Generate a test ISO with the custom valve to confirm it no longer splits.

## 3. TYPE=PIPE-FIXED: Continuation Split Marks Misaligned

### Symptom

When using Fixed Length piping with Content Iso Symbol set as `TYPE=PIPE-FIXED`, isometric continuation Split Marks are not aligned correctly.

This occurs on:
- Custom built specs
- Plant 3D default SS150 spec on a fresh install in Default Project
- Both Plant 3D 2024 and 2026

### Root Cause

The `TYPE=PIPE-FIXED` Content Iso Symbol type has a bug in how it handles continuation marks between ISO sheets. Unlike `TYPE=PIPE`, which correctly aligns split marks at sheet boundaries, `TYPE=PIPE-FIXED` misaligns them.

### Fix

1. **Use `TYPE=PIPE` instead of `TYPE=PIPE-FIXED`** if fixed-length continuation marks aren't critical
2. **Manually adjust split marks** in the generated ISO if `TYPE=PIPE-FIXED` is required
3. **Report to Autodesk** — this appears to be a universal bug, not a configuration issue
4. **Check for updates** — no fix has been announced as of Plant 3D 2026

## 4. Corrupted Isometric Suite: Phantom ISOs from Previous Routing

### Symptom

Production ISO generation produces multiple ISOs simultaneously, including:
- Previous pipe routing that has since been changed
- Old line numbers with split/break suffixes (`-1`, `-2`) that no longer exist in the model
- ISOs from before line number updates

The model has no split/start/break points, yet the generator produces phantom ISOs.

### Root Cause

The **isometric suite is corrupted**. Previous ISO generation runs left remnants in the project database that cause the generator to produce drawings for routing that no longer exists.

### Diagnostic Steps

1. Check for `#` suffix files in the ISO output directory — these indicate duplicate generation attempts
2. Look for line numbers with `-1` and `-2` suffixes that don't match current model
3. Try generating ISOs on a different machine with the same project — if it works there, the issue is local

### Fix

1. **Remove all DWGs through Plant 3D** project tools
2. **Delete remaining files** from the file structure
3. **If problem persists**: The isometric suite is corrupted — follow the re-install guide:
   - Reinstall the isometric suite
   - Copy salvageable parts to a new project
   - Reconfigure ISO generation settings

4. **Test with PCF-to-pipe**: To identify corrupt inline assets, try importing the PCF into another drawing — parts that cause errors are likely responsible

5. **Check for custom parts**: Custom inline instruments may cause issues even if they appear to behave correctly in the model and ISO

### Prevention

- Don't generate a second ISO too quickly — allow P3D to finish generating and checking in before starting the same line again
- When changing line numbers, verify all old references are removed from both local working files and ACC

## 5. ACC Cross-Region ISO Generation Failure

### Symptom

A single straight pipe is drawn and an isometric is attempted, but generation fails with:

```
[FTL] Object reference not set to an instance of an object.
```

The error occurs in one region but not in others. The project uses ACC (Autodesk Construction Cloud), and the isometric template generates successfully on machines in Japan but fails in other locations with identical settings.

### Diagnostic Clues

The ISO generation log shows:
```
Iso Creation start time : 1/1/0001 12:00:00 AM
Iso Creation finish time: 1/1/0001 12:00:00 AM
Duration : 00:00:00
```

The zero-duration timestamp indicates the generator never actually started — it failed before processing.

### Root Cause

The `[FTL] Object reference not set to an instance of an object` error is a .NET null reference exception. Possible causes:
- ISO template is defective on the specific machine
- SKEY or IsoType assignments are not resolving correctly on the failing machine
- ACC sync issue — the project files may not be fully synced on the failing machine
- Regional Windows settings affecting file paths or number formats

### Fix

1. **Try a different ISO template** — if it works, the original template is defective on that machine
2. **Verify SKEY assignments** — check that SKEYs resolve correctly in the failing environment
3. **Check ACC sync status** — ensure all project files are fully downloaded and synced
4. **Compare regional settings** — check Windows regional formats (decimal separator, date format) between working and failing machines
5. **Check for negative coordinates** — the error log may show the line has negative coordinates, which can cause issues in some configurations
6. **Verify ISO output path** — ensure the output folder is accessible and writable
7. **Reinstall ISO components** — if the template works on other machines, the local ISO installation may be corrupted

## Best Practices for Plant 3D Isometric Generation

1. **Verify SKEY mappings** when creating custom specs — wrong SKEYs cause disconnected graphics
2. **Use valid SKEY types** for custom valves — don't use non-existent types like `DIN`
3. **Avoid TYPE=PIPE-FIXED** if continuation mark alignment is critical — use TYPE=PIPE
4. **Don't generate ISOs too quickly in succession** — allow check-in to complete
5. **Reinstall the isometric suite** if phantom ISOs appear from previous routing
6. **Test PCF import** to identify corrupt inline assets
7. **Verify ACC sync** before generating ISOs — incomplete sync causes null reference errors
8. **Compare regional settings** when ISOs work in one location but not another
9. **Check ISO templates** on each machine — a template can be defective locally
10. **Upload test drawings** to the Autodesk forum for community diagnosis when SKEY fixes don't resolve disconnections
