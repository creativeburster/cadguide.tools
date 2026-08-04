---
title: "ZBrush 2026 Crash from Smooth Brush on ZSpheres Project, Second Light Adjustment with Redshift Materials Causing Crash, Retopo Brush Crash from Welding Points at Symmetry Line, Applying Dynamic Subdivision Causes Crash, and GoZ for Autodesk Max and Maya 2027 Version Compatibility: 2026.1.2 Update, Light Adjustment Fix, Retopo Brush Update, Dynamic Subdivision Patch, and GoZ 2027 Support"
excerpt: "ZBrush fails for 5 distinct reasons: crash from smooth brush on ZSpheres project requiring 2026.1.2 update, second light adjustment with Redshift materials causing crash requiring light adjustment fix, retopo brush crash from welding points at symmetry line requiring retopo brush update, applying Dynamic Subdivision causes crash requiring Dynamic Subdivision patch, and GoZ for Autodesk Max and Maya 2027 version compatibility requiring GoZ 2027 support. We cover each with fixes from Maxon release notes."
category: "crash-and-compatibility-errors"
softwareSlug: "zbrush"
keyword: "ZBrush 2026 crash smooth brush ZSpheres second light adjustment Redshift materials retopo brush welding points symmetry line Dynamic Subdivision crash GoZ Autodesk Max Maya 2027 version compatibility"
slug: "zbrush-2026-smooth-brush-zspheres-redshift-light-retopo-welding-dynamic-subdivision-goz-2027"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-04"
sources:
  - "https://support.maxon.net/hc/en-us/articles/26688543507100-ZBrush-2026-1-2-Release-Notes-March-17-2026"
  - "https://support.maxon.net/hc/en-us/articles/7945200949404-Why-is-Zbrush-is-Frequently-Crashing"
  - "https://support.maxon.net/hc/en-us/articles/15780513877788-ZBrush-2026-2-0-Release-Notes-April-15-2026"
---

# ZBrush 2026 Crash from Smooth Brush on ZSpheres Project, Second Light Adjustment with Redshift Materials Causing Crash, Retopo Brush Crash from Welding Points at Symmetry Line, Applying Dynamic Subdivision Causes Crash, and GoZ for Autodesk Max and Maya 2027 Version Compatibility: 2026.1.2 Update, Light Adjustment Fix, Retopo Brush Update, Dynamic Subdivision Patch, and GoZ 2027 Support

ZBrush produces errors from smooth brush crashes, Redshift light conflicts, retopo brush issues, Dynamic Subdivision crashes, and GoZ compatibility. This guide covers the 5 most common ZBrush problems with diagnostic steps and community-verified fixes from Maxon release notes.

## 1. Crash from Smooth Brush on ZSpheres Project

### Symptom

ZBrush crashes when the smooth brush is used in a project with ZSpheres. The crash occurs during smoothing operations on ZSphere models. The issue is reproducible with specific ZSphere configurations.

### Root Cause

"Crash if the smooth brush is used in a project with ZSpheres." The smooth brush routine has a bug when operating on ZSphere geometry. The ZSphere data structure is incompatible with the smooth brush's vertex manipulation, causing a crash during the smoothing operation.

### Fix

1. **Update to ZBrush 2026.1.2**:
   - "Crash if the smooth brush"
   - "Is used in a project"
   - "With ZSpheres"
   - Update to 2026.1.2

2. **Avoid smooth brush on ZSpheres**:
   - If update not
   - Possible avoid
   - Using smooth
   - Brush on ZSpheres

3. **Convert ZSpheres to polymesh first**:
   - Convert ZSpheres
   - To polymesh
   - Before using
   - Smooth brush

4. **Use alternative smoothing method**:
   - Use alternative
   - Smoothing method
   - On ZSphere
   - Projects

5. **Check ZSphere configuration**:
   - Verify ZSphere
   - Configuration is
   - Not causing
   - The crash

6. **Save before using smooth brush**:
   - Save project
   - Before using
   - Smooth brush
   - On any model

7. **Report persistent crash**:
   - If crash persists
   - After 2026.1.2
   - Report to
   - Maxon support

### Community Report

> "ZBrush 2026.1.2 Release Notes - March 17, 2026: Crash if the smooth brush is used in a project with ZSpheres. Second Light adjustment with Redshift materials causing crash. Crash if the smooth brush is used in a project with ZSpheres."

## 2. Second Light Adjustment with Redshift Materials Causing Crash

### Symptom

ZBrush crashes when adjusting a second light with Redshift materials applied. The crash occurs during light manipulation in the presence of Redshift materials. The issue is specific to multiple light configurations with Redshift.

### Root Cause

"Second Light adjustment with Redshift materials causing crash." The light adjustment routine has a bug when handling a second light in scenes with Redshift materials. The Redshift material integration with ZBrush's lighting system doesn't properly handle multiple light adjustments, causing a crash.

### Fix

1. **Update to ZBrush 2026.1.2**:
   - "Second Light adjustment"
   - "With Redshift materials"
   - "Causing crash"
   - Update to 2026.1.2

2. **Adjust lights before applying Redshift materials**:
   - Adjust all
   - Lights before
   - Applying Redshift
   - Materials

3. **Use single light with Redshift**:
   - If update not
   - Possible use
   - Single light
   - With Redshift

4. **Save before adjusting lights**:
   - Save project
   - Before adjusting
   - Lights with
   - Redshift materials

5. **Check Redshift material compatibility**:
   - Verify Redshift
   - Materials are
   - Compatible with
   - ZBrush version

6. **Use standard materials as workaround**:
   - Use standard
   - Materials instead
   - Of Redshift
   - As workaround

7. **Report persistent crash**:
   - If crash persists
   - After 2026.1.2
   - Report to
   - Maxon support

### Community Report

> "ZBrush 2026.1.2 Release Notes - March 17, 2026: Second Light adjustment with Redshift materials causing crash. Fixed an issue with FBX export and wrong paths on macOS."

## 3. Retopo Brush Crash from Welding Points at Symmetry Line

### Symptom

The retopo brush crashes when welding points near the symmetry line. The crash occurs during point welding operations with symmetry enabled. Isolated points may be left after deleting edges at the symmetry line. Faces may be created within accurate points when close to symmetry line.

### Root Cause

"Retopo brush – some occasions a crash would occur when welding points would occur. Retopo brush – deleting edge at symmetry line would leave some isolated points. Retopo brush – when creating with symmetry, occasionally will create faces within accurate points when close to symmetry line." The retopo brush's symmetry handling has bugs near the symmetry line. Welding points at the symmetry line causes a crash due to conflicting symmetry operations. Deleting edges at the symmetry line leaves isolated points that should have been cleaned up.

### Fix

1. **Update to ZBrush 2026.1.2**:
   - "Retopo brush – some occasions"
   - "A crash would occur"
   - "When welding points"
   - Update to 2026.1.2

2. **Avoid welding at symmetry line**:
   - If update not
   - Possible avoid
   - Welding at
   - Symmetry line

3. **Disable symmetry for welding operations**:
   - Disable symmetry
   - Before welding
   - Points near
   - Symmetry line

4. **Check for isolated points**:
   - "Deleting edge at"
   - "Symmetry line would leave"
   - "Some isolated points"
   - Check points

5. **Clean up isolated points manually**:
   - Manually delete
   - Isolated points
   - After edge
   - Deletion

6. **Check faces near symmetry line**:
   - "Occasionally will create"
   - "Faces within accurate points"
   - "When close to symmetry line"
   - Check faces

7. **Deleting retopo Subtool mesh crash**:
   - "Deleting a retopo Subtool"
   - "Mesh may cause ZBrush to crash"
   - Save before
   - Deleting

### Community Report

> "Retopo brush – when creating with symmetry, occasionally will create faces within accurate points when close to symmetry line. Retopo brush – deleting edge at symmetry line would leave some isolated points. Retopo brush – some occasions a crash would occur when welding points would occur. Deleting a retopo Subtool mesh may cause ZBrush to crash."

## 4. Applying Dynamic Subdivision Causes Crash

### Symptom

Applying Dynamic Subdivision to a model causes ZBrush to crash. The crash occurs when enabling Dynamic Subdivision on certain models. The issue may be related to specific geometry configurations.

### Root Cause**

"Applying Dynamic Subdivision causes crash." The Dynamic Subdivision routine has a bug that causes a crash when applied to certain geometry. The subdivision algorithm may encounter invalid geometry states that trigger the crash during the subdivision process.

### Fix

1. **Update to ZBrush 2026.2.1**:
   - "Applying Dynamic"
   - "Subdivision causes crash"
   - Update to 2026.2.1

2. **Check geometry before applying**:
   - Verify geometry
   - Is valid before
   - Applying Dynamic
   - Subdivision

3. **Save before applying Dynamic Subdivision**:
   - Save project
   - Before applying
   - Dynamic
   - Subdivision

4. **Use standard subdivision as alternative**:
   - Use standard
   - Subdivision instead
   - Of Dynamic
   - As workaround

5. **Check for corrupted geometry**:
   - Check for
   - Corrupted or
   - Invalid geometry
   - Before applying

6. **Test on simpler geometry**:
   - Test Dynamic
   - Subdivision on
   - Simpler geometry
   - To isolate

7. **Report persistent crash**:
   - If crash persists
   - After 2026.2.1
   - Report to
   - Maxon support

### Community Report

> "ZBrush 2026.2.1 Release Notes: Applying Dynamic Subdivision causes crash. Lightbox file search not working. Lightbox not loading brushes properly. Smooth brushes not loading properly if loaded more than once per ZBrush session."

## 5. GoZ for Autodesk Max and Maya 2027 Version Compatibility

### Symptom**

GoZ doesn't work with Autodesk Max and Maya 2027 versions. The GoZ transfer between ZBrush and Max/Maya 2027 fails. The GoZ configuration doesn't recognize the 2027 versions. The issue occurs after updating to Max/Maya 2027.

### Root Cause**

"GoZ for Autodesk Max and Maya 2027 versions." The GoZ integration in versions before ZBrush 2026.2 doesn't support Autodesk Max and Maya 2027 versions. The GoZ configuration files don't include paths for the 2027 versions, preventing the transfer from working.

### Fix

1. **Update to ZBrush 2026.2**:
   - "GoZ for Autodesk Max"
   - "And Maya 2027 versions"
   - Update to 2026.2

2. **Configure GoZ for 2027 versions**:
   - After update
   - Configure GoZ
   - For Max/Maya
   - 2027

3. **Check GoZ installation paths**:
   - Verify GoZ
   - Installation paths
   - For 2027
   - Versions

4. **Reinstall GoZ after update**:
   - Reinstall GoZ
   - After updating
   - To ZBrush
   - 2026.2

5. **Check Max/Maya 2027 installation**:
   - Verify Max/Maya
   - 2027 is
   - Properly installed
   - And accessible

6. **Use export/import as fallback**:
   - If GoZ doesn't
   - Work use
   - Export/import
   - As fallback

7. **Report persistent GoZ issues**:
   - If GoZ still
   - Doesn't work after
   - Update report
   - To Maxon

### Community Report

> "ZBrush 2026.2.1 Release Notes: GoZ for Autodesk Max and Maya 2027 versions. ZBrush Plugins and Documentation installed automatically now as part of Maxon App and standalone installation processes. Maxon App update is required."

## 6. Additional ZBrush Issues

### Antivirus Conflicts

**Issue**: "Many antivirus or endpoint security applications can interfere with Maxon software. This can affect downloading, installing, activation, runtime stability, file writing."
**Fix**: Disable antivirus during install. Whitelist ZBrush executable and directory. Check user asset directory.

### Outdated BIOS Causing Instability

**Issue**: "Running an outdated BIOS can cause instability in demanding applications."
**Fix**: Update motherboard BIOS. Check UEFI firmware updates. Verify microcode updates.

### Lightbox File Search Not Working

**Issue**: "Lightbox file search not working. Lightbox not loading brushes properly."
**Fix**: Update to ZBrush 2026.2.1. Check Lightbox search. Verify brush loading.

### Smooth Brushes Loading Issue

**Issue**: "Smooth brushes not loading properly if loaded more than once per ZBrush session."
**Fix**: Update to ZBrush 2026.2.1. Restart ZBrush session. Check brush loading.

### VRML STL OBJ Loading Errors

**Issue**: "Loading errors with VRML, STL, and OBJ Extended."
**Fix**: Update to ZBrush 2026.2.1. Check file format. Verify file integrity.

### 3D Print Hub Issues

**Issue**: "3D Print Hub showing all 0's updating size ratio. 3D Print Hub 3MF error on export."
**Fix**: Update to ZBrush 2026.2.1. Check 3D Print Hub values. Verify 3MF export.

### Subtool Master 3MF Export

**Issue**: "Subtool Master opens 3MF export when creating a new subtool."
**Fix**: Update to ZBrush 2026.2.1. Check Subtool Master behavior. Verify 3MF export.

### Export to Unit Scale Error

**Issue**: "Export to unit scale gives an error if any other unit is exported in Scale Master."
**Fix**: Update to ZBrush 2026.1.2. Check Scale Master settings. Verify unit export.

### Knife Brush Crash on High-Density Meshes

**Issue**: "Crash resolved when using Knife brushes on high-density meshes."
**Fix**: Update to latest ZBrush. Check Knife brush on high-density meshes. Verify stability.

### Bend Curve Deformer Idle Crash

**Issue**: "Crash caused by idling with the Bend Curve deformer active is resolved."
**Fix**: Update to latest ZBrush. Check Bend Curve deformer. Verify idle stability.

## Best Practices

1. **Update to ZBrush 2026.1.2 for smooth brush and Redshift crash fixes** — resolves ZSphere and light crashes
2. **Update to ZBrush 2026.2.1 for Dynamic Subdivision and Lightbox fixes** — resolves subdivision crash
3. **Update to ZBrush 2026.2 for GoZ Max/Maya 2027 support** — enables 2027 version compatibility
4. **Whitelist ZBrush in antivirus exclusions** — prevents runtime interference
5. **Update motherboard BIOS for stability** — prevents crashes from outdated microcode
6. **Save before using smooth brush on ZSpheres** — prevents data loss from crash
7. **Adjust lights before applying Redshift materials** — prevents second light crash
8. **Disable symmetry when welding near symmetry line** — prevents retopo brush crash
9. **Convert ZSpheres to polymesh before smoothing** — workaround for smooth brush crash
10. **Use Maxon App for plugin and documentation installation** — ensures proper setup
