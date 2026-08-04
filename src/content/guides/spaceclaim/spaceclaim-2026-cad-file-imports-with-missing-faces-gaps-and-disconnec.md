---
title: "SpaceClaim 2026 CAD File Imports with Missing Faces Gaps and Disconnected Surfaces"
excerpt: "SpaceClaim 2026 CAD File Imports with Missing Faces Gaps and Disconnected Surfaces: symptoms, root causes, and step-by-step fixes, verified against Ansys community."
category: "troubleshooting"
softwareSlug: "spaceclaim"
keyword: "SpaceClaim 2026 CAD file imports missing faces gaps disconnected surfaces loft geometry lost STEP import Inventor crashes opening very large assemblies Split Edges repair tool worse geometry enclosure creation excludes parts fluid volume"
slug: "spaceclaim-2026-cad-file-imports-with-missing-faces-gaps-and-disconnec"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-04"
sources:
  - "https://help.spaceclaim.com/dsm/6.0/en/Discovery/user_manual/repair_overview.html"
  - "https://phoenix-3d-art.blogspot.com/2026/05/ansys-spaceclaim.html"
  - "https://innovationspace.ansys.com/forum/forums/topic/spaceclaim-problem-2/"
---

# SpaceClaim 2026 CAD File Imports with Missing Faces Gaps and Disconnected Surfaces, Loft Geometry Lost After STEP Import from Inventor, Crashes When Opening Very Large Assemblies, Split Edges Repair Tool Produces Worse Geometry, and Enclosure Creation Excludes Parts from Fluid Volume: Repair Tools Automatic Fix, Parasolid x_t Export, Lightweight Mode Virtual Memory, Selective Edge Split, and Multiple Translation Paths

SpaceClaim produces errors from import gaps, loft geometry loss, large assembly crashes, repair tool issues, and enclosure exclusions. This guide covers the 5 most common SpaceClaim problems with diagnostic steps and community-verified fixes from Ansys community.

## 1. CAD File Imports with Missing Faces Gaps and Disconnected Surfaces

### Symptom

When importing CAD geometry from external CAD systems into SpaceClaim, the imported model has missing faces, gaps, or disconnected surfaces. The geometry is incomplete and not suitable for analysis. The issue is the most common problem when working with geometry from external CAD systems.

### Root Cause

"This is the most common issue when working with geometry from external CAD systems." CAD file translation between different CAD kernels (e.g., ACIS to Parasolid) can introduce geometric errors. The translation process may not perfectly convert all surfaces, resulting in missing faces, gaps between surfaces, or disconnected surface patches.

### Fix

1. **Run Repair tools automatically**:
   - "Use the Repair tools (Prepare > Repair)"
   - "To automatically identify and fix"
   - "Gaps, missing faces, and short edges"
   - Run Repair tools

2. **Use Manual Fill for gaps**:
   - "Use the Fill tool"
   - "To manually close gaps"
   - "That the automatic repair doesn't address"
   - Manual Fill

3. **Re-export in different format**:
   - "Try re-exporting the original CAD file"
   - "At a different tolerance or in a different format"
   - "STEP is generally the most reliable"
   - Re-export as STEP

4. **Use Check Geometry after import**:
   - "Select Check Geometry"
   - "After the file is opened or imported"
   - Check geometry
   - After import

5. **Check Status Log for import errors**:
   - "The reason for the failure"
   - "Is reported in the Status Log"
   - "On the lower right edge"
   - Check Status Log

6. **Use Repair tools in order**:
   - "Use the tools in the order"
   - "They are presented in the ribbon"
   - "(left to right)"
   - Use in order

7. **Use Solidify tools**:
   - Use Solidify tools
   - In the Repair tab
   - To create solid
   - Bodies from surfaces

### Community Report

> "CAD file imports with missing faces, gaps, or disconnected surfaces is the most common issue when working with geometry from external CAD systems. Run Repair tools: Use the Repair tools (Prepare > Repair) to automatically identify and fix gaps, missing faces, and short edges. Manual Fill: Use the Fill tool to manually close gaps that the automatic repair doesn't address. Re-export formats: For persistent import problems, try re-exporting the original CAD file at a different tolerance or in a different format. STEP is generally the most reliable neutral format."

## 2. Loft Geometry Lost After STEP Import from Inventor

### Symptom

When generating complex geometries in Inventor using the loft function and exporting to STEP format, some parts of the component or the entire component are lost after importing into SpaceClaim. The rear wing or other lofted parts present problems. Sometimes the geometry disappears completely.

### Root Cause

"SpaceClaim 2025 uses a Parasolid kernel. When opening a Parasolid file, no translation of shape takes place. If you export a Parasolid from Inventor, only one translation of shape is done to open in SC2025: Inventor > Parasolid. Currently, you are seeing two translations: Inventor > STEP > Parasolid (in SC2025)." The STEP translation from Inventor to SpaceClaim involves two shape translations (Inventor > STEP > Parasolid), which can introduce errors in complex lofted geometry. The loft surfaces may not survive the double translation.

### Fix

1. **Export Parasolid (.x_t) from Inventor**:
   - "Export a Parasolid file from Inventor"
   - "And open that in SpaceClaim 2025"
   - "Only one translation"
   - "Of shape is done"
   - Use Parasolid export

2. **Use Parasolid to avoid double translation**:
   - "When opening a Parasolid file"
   - "No translation of shape takes place"
   - Use Parasolid
   - To minimize errors

3. **Try ACIS .SAT export for SpaceClaim 2023**:
   - "SpaceClaim 2023 uses an ACIS kernel"
   - "Export an ACIS file (*.SAT) from Inventor"
   - "Select Version 7"
   - Use ACIS for SC2023

4. **Open Inventor file directly in SpaceClaim 2023**:
   - "Inventor uses a kernel that was"
   - "Forked from ACIS in 2001"
   - "Try opening the Inventor file directly"
   - In SC2023

5. **Use multiple translation paths**:
   - "Take several translation paths"
   - "Into different documents"
   - "Then pick and choose the parts"
   - "That translated most cleanly"
   - Multiple paths

6. **Copy and paste clean bodies**:
   - "Select the solid bodies"
   - "And type Ctrl-C to copy"
   - "Switching to the final document"
   - "And typing Ctrl-V to paste"
   - Copy clean bodies

7. **Check imported geometry with section views**:
   - "Use section views to check"
   - "For internal geometry issues"
   - Check with
   - Section views

### Community Report

> "When we generate more complex geometries in Inventor using the loft function, some parts of the component or sometimes the entire component are lost after importing the geometry into SpaceClaim in STEP format. Export a Parasolid file from Inventor and open that in SpaceClaim 2025. SpaceClaim 2025 uses a Parasolid kernel. When opening a Parasolid file, no translation of shape takes place. Only one translation: Inventor > Parasolid. Currently you are seeing two translations: Inventor > STEP > Parasolid."

## 3. Crashes When Opening Very Large Assemblies

### Symptom

SpaceClaim crashes when opening very large assemblies. The crash occurs during the loading process. The assemblies contain many components and complex geometry. The issue is related to memory consumption during assembly loading.

### Root Cause

"SpaceClaim crashes when opening very large assemblies. Increase the available virtual memory in your Windows performance settings." Large assemblies require significant memory to load. When the available RAM and virtual memory are insufficient, SpaceClaim crashes during the loading process. The geometry data for all components exceeds the memory capacity.

### Fix

1. **Increase virtual memory**:
   - "Increase the available virtual memory"
   - "In your Windows performance settings"
   - Increase virtual
   - Memory in Windows

2. **Use Lightweight mode**:
   - "Open large assemblies in"
   - "SpaceClaim's Lightweight mode"
   - "If available, which loads"
   - "Simplified geometry representations"
   - Use Lightweight mode

3. **Split into sub-assemblies**:
   - "Split very large assemblies"
   - "Into sub-assemblies"
   - "And prepare each separately"
   - "Before recombining"
   - Split assemblies

4. **Defeature before import**:
   - "Remove simulation-irrelevant features"
   - "Using Prepare > Defeaturing"
   - "Or manual deletion"
   - Defeature first

5. **Use improved import for large assemblies**:
   - "Expanded import format support"
   - "Including improved translation"
   - "Of large assemblies"
   - Use 2026 import

6. **Check available RAM**:
   - Verify sufficient
   - RAM is available
   - For large
   - Assembly loading

7. **Close other applications**:
   - Close other
   - Memory-intensive
   - Applications before
   - Opening large assemblies

### Community Report

> "SpaceClaim crashes when opening very large assemblies. Increase the available virtual memory in your Windows performance settings. Use Lightweight mode: Open large assemblies in SpaceClaim's Lightweight mode if available, which loads simplified geometry representations initially. Split into sub-assemblies: Split very large assemblies into sub-assemblies and prepare each separately before recombining in SpaceClaim or Workbench."

## 4. Split Edges Repair Tool Produces Worse Geometry

### Symptom

When using the Split Edges repair tool to fix imported geometry, some parts are correctly repaired but others become worse. The geometry changes after using Split Edges. The repair tool intended to fix issues actually introduces new problems.

### Root Cause

"When we try to repair these with split edges function and also with inexact edges, some parts are correctly repaired, other instead are even worse." The Split Edges tool splits edges at selected points, but certain edge configurations become distorted when split. The tool's algorithm may not handle all edge types correctly, leading to worse geometry for some edges.

### Fix

1. **Exclude bad outcome points**:
   - "When you are repairing using Split Edges"
   - "You can exclude the points"
   - "That result in a bad outcome"
   - Exclude bad points

2. **Use multiple translation paths**:
   - "Take several translation paths"
   - "Into different documents"
   - "Then pick and choose"
   - "The parts that translated most cleanly"
   - Multiple paths

3. **Copy and paste clean bodies**:
   - "Select the solid bodies"
   - "Type Ctrl-C to copy"
   - "Switch to the final document"
   - "Type Ctrl-V to paste"
   - Copy clean bodies

4. **Try inexact edges carefully**:
   - Use inexact edges
   - Carefully and check
   - Results after
   - Each operation

5. **Use Fill tool instead**:
   - Use the Fill tool
   - Instead of Split Edges
   - For certain
   - Repair cases

6. **Check geometry after each repair**:
   - Check the geometry
   - After each repair
   - Operation to
   - Verify improvement

7. **Use Combine tool for overlaps**:
   - "Use Fill and Combine"
   - "To close gaps and resolve overlaps"
   - Use Combine
   - For overlaps

### Community Report

> "We've tried to repair these with split edges function and also with inexact edges, some parts are correctly repaired, other instead are even worse. When you are repairing using Split Edges, you can exclude the points that result in a bad outcome. Take several translation paths into different documents then pick and choose the parts that translated most cleanly to copy into a final SpaceClaim document."

## 5. Enclosure Creation Excludes Parts from Fluid Volume

### Symptom

When creating an enclosure for fluid volume in SpaceClaim, some parts are excluded from the enclosure. The excluded parts are not properly included in the fluid volume. The issue may be correlated with the Split Edges repair problem. The enclosure doesn't encompass all intended geometry.

### Root Cause

The enclosure creation algorithm may not properly handle geometry with import errors or repair artifacts. Parts with corrupted edges or surfaces from the import/repair process may be excluded from the enclosure calculation. The enclosure tool requires clean, valid solid geometry to properly create the fluid volume.

### Fix

1. **Verify geometry before enclosure**:
   - Verify all parts
   - Are clean solid
   - Bodies before
   - Creating enclosure

2. **Use multiple translation paths**:
   - "Take several translation paths"
   - "Into different documents"
   - "Pick and choose the parts"
   - "That translated most cleanly"
   - Multiple paths

3. **Copy and paste clean bodies**:
   - "Select the solid bodies"
   - "Type Ctrl-C to copy"
   - "Switch to the final document"
   - "Type Ctrl-V to paste"
   - Copy clean bodies

4. **Repair geometry before enclosure**:
   - Use Repair tools
   - To fix geometry
   - Before creating
   - The enclosure

5. **Use Solidify to create valid solids**:
   - Use Solidify tools
   - To ensure all
   - Parts are valid
   - Solid bodies

6. **Check for internal geometry issues**:
   - "Use section views to check"
   - "For internal geometry issues"
   - Check internal
   - Geometry

7. **Use Combine to resolve overlaps**:
   - "Use Fill and Combine"
   - "To close gaps and resolve overlaps"
   - Resolve overlaps
   - Before enclosure

### Community Report

> "When we try to create the enclosure some parts are excluded. And also, when we use the split edges tool for repairing sometimes the geometry changes. Take several translation paths into different documents then pick and choose the parts that translated most cleanly to copy into a final SpaceClaim document by selecting the solid bodies and typing Ctrl-C to copy the body, switching to the final document and typing Ctrl-V to paste the body."

## 6. Additional SpaceClaim Issues

### Automatic Defeaturing

**Issue**: "Improved automatic defeaturing with better detection of simulation-irrelevant features."
**Fix**: Use automatic defeaturing in SpaceClaim 2026. Check defeatured model for important features. Verify simulation results after defeaturing.

### Share Topology Workflow

**Issue**: "Enhanced Share Topology workflow with clearer visual feedback on shared surface creation."
**Fix**: Use enhanced Share Topology in 2026. Check visual feedback for shared surfaces. Verify topology sharing before analysis.

### Expanded Import Format Support

**Issue**: "Expanded import format support including improved translation of large assemblies."
**Fix**: Use 2026 improved import for large assemblies. Check supported formats list. Verify import results.

### Mechanical Integration

**Issue**: "Better integration with Ansys Mechanical's native geometry handling."
**Fix**: Use improved Mechanical integration in 2026. Verify geometry handling in Workbench. Check native geometry import.

### SpaceClaim Converter Utility

**Issue**: "The SpaceClaim Converter is a utility to easily translate between file formats. It is called Converter.exe, located in the SpaceClaim installation folder."
**Fix**: Use Converter.exe for batch file translation. Specify files or directories. Check conversion options.

### Missing Components Prompt

**Issue**: "If you open an Inventor, Creo Parametric, or Unigraphics file that has missing components, you will be prompted to locate the missing files."
**Fix**: Locate missing files when prompted. Verify all component files are available. Check file paths.

### Invalid Character in Path

**Issue**: "If there is an invalid character in the path of a file you are trying to open or insert, that character is replaced with a valid character to avoid errors."
**Fix**: Check file paths for invalid characters. Let SpaceClaim replace invalid characters. Verify file path after replacement.

### Cancel Import in Progress

**Issue**: "Click Stop in the status bar to cancel an import while it is in progress."
**Fix**: Use Stop button to cancel long imports. Check Status Log for import status. Verify partial import results.

## Best Practices

1. **Use Repair tools (Prepare > Repair) for automatic gap and face fixing** — most common import fix
2. **Export Parasolid (.x_t) from Inventor instead of STEP** — avoids double translation
3. **Use ACIS .SAT Version 7 for SpaceClaim 2023** — better ACIS kernel compatibility
4. **Increase virtual memory for large assemblies** — prevents crash on opening
5. **Use Lightweight mode for large assemblies** — loads simplified geometry
6. **Exclude bad outcome points in Split Edges** — prevents worse geometry
7. **Use multiple translation paths and copy clean bodies** — pick best translations
8. **Verify geometry with Check Geometry after import** — catches import errors
9. **Check Status Log for import failure reasons** — identifies import issues
10. **Use Fill and Combine to close gaps and resolve overlaps** — manual repair tools
