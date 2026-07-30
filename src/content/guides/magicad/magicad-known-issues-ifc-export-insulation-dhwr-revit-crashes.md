---
title: "MagiCAD Known Issues: IFC Export Elevation Errors, Insulation Visibility Bugs, DHWR Closed-Loop Conflicts, and Version-Specific Fixes (2022-2027)"
excerpt: "MagiCAD for Revit and AutoCAD has documented bugs across versions: IFC export doubling elevations, insulation visibility failures on duct fittings, DHWR circulation point blocked by Revit hydronic setting, and Support & Hangers crashing Revit. We cover each known issue with workarounds and version-specific fix status."
category: "known-issues"
softwareSlug: "magicad"
keyword: "MagiCAD known issues IFC export elevation insulation DHWR Revit crash bug fix workaround"
slug: "magicad-known-issues-ifc-export-insulation-dhwr-revit-crashes"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://www.magicad.com/mep-design/support-training/support/troubleshooting/"
  - "https://www.magicad.com/magicad-2022-1-patch-revit-autocad/"
  - "https://portal.magicad.com/Downloader.ashx?id=11193&type=product"
---

# MagiCAD Known Issues: IFC Export Elevation Errors, Insulation Visibility Bugs, DHWR Closed-Loop Conflicts, and Version-Specific Fixes (2022-2027)

MagiCAD is a MEP design tool for Revit and AutoCAD with modules for Ventilation, Piping, Electrical, Schematics, and Support & Hangers. Across versions 2022 through 2027, specific bugs have been documented by MagiCAD Group with workarounds and fix timelines. This guide covers the most impactful known issues, their workarounds, and which versions fix them.

## IFC Export Issues

### Elevation Calculated Twice (Fixed in 2022.1)

**Affected versions**: MagiCAD 2022 for Revit (Ventilation, Piping, Electrical)

**Bug**: When any Origin option other than "Internal coordinates" was selected for IFC export, elevation was calculated twice. If elevation was set to 25 meters in the project, the IFC file wrote 50 meters.

**Fix**: Updated to MagiCAD 2022.1.

### Project Base Point and Survey Point Elevation (Fixed in later versions)

**Bug**: IFC models exported with MagiCAD's IFC Export ended up at different locations than expected when using Project base point or Survey point.

**Fix**: MagiCAD IFC Export now exports the same elevations as Revit IFC Export.

### IFC Batch Export from Detached ACC/BIM360 Models (Fixed)

**Bug**: IFC Export threw an exception when exporting unsaved detached projects, or if Batch IFC Export contained an unsaved detached ACC/BIM360 project.

**Fix**: Corrected to work with detached projects.

### Fittings Not Exported with GeographicElementType (Fixed in 2022.1)

**Bug**: Fittings were not exported to IFC if their IFC type was set as GeographicElementType. Unlikely selection, but possible.

**Fix**: Updated to MagiCAD 2022.1.

### IFC4 Certification Improvements (2022.1)

- New 'degrees' angle unit support added
- Port connections and naming correctly set in IFC files
- Relations between IFC types for electrical circuits and systems defined
- Space geometry export supports slanting walls, roofs, and floors
- Empty floors exported if selected as storeys

### Clearance Geometry Export in IFC2x3 (Fixed)

**Bug**: Option to export clearance geometry was not available in IFC2x3 in MagiCAD 2024 UR-1.

**Fix**: Clearance geometry export is now available again in IFC2x3.

## Insulation Visibility Issues (2025-2027)

**Affected versions**: MagiCAD 2025, 2025 UR-1, 2025 UR-2, 2026, 2026 UR-1, 2026 UR-2, 2027

**Bug**: In some cases, the insulation of duct fittings is not visible. These faulty fittings will also not get exported to IFC.

**Module**: MagiCAD for CAD UR-1, Ventilation

**Workaround**:
1. Open **Project settings**
2. Go to **Model drawings**
3. Change the **LOD level to 350**
4. Close the project — this fixes the visibility problem
5. Change LOD level back to previous value
6. **Important**: This must be done to all drawings before IFC export

**Fix status**: Under investigation, fix planned for future release.

## Support & Hangers Crashing Revit (2024)

**Affected versions**: MagiCAD 2024

**Bug**: Updating Support & Hangers in older projects causes Revit to crash.

**Fix**: Update to the latest version/release.

**Note**: Due to incompatibility issues with Revit 2025, the S&H module was **excluded from the Revit 2025 version** entirely.

## DHWR Circulation Point Blocked by Revit Setting (2024)

**Affected versions**: MagiCAD 2024

**Bug**: It is not possible to install the DHWR (domestic hot water return) circulation point when Revit's "Enable analysis for closed loop hydronic piping network" setting is turned ON.

**Fix**: Turn OFF the setting:
- **Manage → MEP Settings → Mechanical Settings → Pipe Settings → Hydronic Networks**
- Disable "Enable analysis for closed loop hydronic piping network"

## Workset Issues in Pipe/Duct/Cable Tray Dialogs (2024)

**Bug**: It is not possible to change the active workset in pipe/duct/cable tray dialogs.

**Related fix**: In some scenarios, the selected workset was not used when using pipe, duct, or cable tray drawing tools. This has been corrected in later versions.

## Sizing Problems in Eccentric Reducers (2024)

**Bug**: Sizing causes problems in eccentric reducers.

**Fix**: Update to the latest version.

## Sprinkler Calculation Error in BricsCAD (2024)

**Bug**: Calculating Sprinkler network causes error in MagiCAD for BricsCAD.

**Fix**: Update to the latest version.

## Piping and Ventilation Fixes (2022.1)

### Radiator Valves Could Not Be Added to Dataset

**Bug**: Radiator valves could not be added to the dataset by right-clicking and selecting New in the radiator valve list in the Valve tool. Stop valve selection worked correctly.

**Fix**: MagiCAD 2022.1.

### Heating Load Copy Did Not Work

**Bug**: The "Pick reference space from the project to copy the design heating load" option in radiator selection did not copy the heat load value.

**Fix**: MagiCAD 2022.1.

### DHW Return System Definition Failed

**Bug**: Defining domestic hot water return system by placing a DHW circulation point did not work — the system remained a hot water flow system.

**Fix**: MagiCAD 2022.1.

### Drainage Connection Tool: Horizontal to Vertical Pipe

**Bug**: Drainage connection tool could not find suggested solutions to connect a horizontal pipe to a vertical pipe.

**Fix**: MagiCAD 2022.1.

### Underfloor Heating Rectangle Option Error

**Bug**: Drawing underfloor heating loops with the Rectangle option caused an unexpected error in some situations.

**Fix**: MagiCAD 2022.1.

## Ventilation and Piping Fixes (Later Versions)

### "System Not Found" Error

**Bug**: "System not found" was given if domestic water system was connected to a heating and cooling plant, and a hydronic system was also connected to the same plant.

**Fix**: Corrected in later versions.

### Generic AHU Connector Direction

**Bug**: "Generic AHU" tool created connectors in wrong direction.

**Fix**: Corrected.

### "Product Not Available" for Duct Series Plugs

**Bug**: "Product not available" was given for duct series plugs when a rectangular plug was connected to a T-branch that connects to a flexible duct or round duct.

**Fix**: Corrected.

### VAV Schedule Air Flow Reset

**Bug**: In Zone Schedules, air flow changed from minimum to boost if dialog was closed and then reopened.

**Fix**: Corrected.

### Pipe Connection Tool Error

**Bug**: "Pipe Connection" tool gave error if "Apply for" was used for water device single pipe installation.

**Fix**: Corrected.

### High Pressure Drop Warning in Sprinkler

**Bug**: If pressure drop exceeded 1,000,000 mBar somewhere in a sprinkler network, MagiCAD gave a "high pressure drop" warning, cancelled the calculation, and generated a warning report. It was difficult to locate the problem if the warning only pointed to the root.

**Fix**: Calculation no longer cancels when pressure drop exceeds 1,000,000 mBar. The full report can be inspected.

## AutoCAD-Specific Fixes (2022.1)

### Revision Cloud Not Shown During Drawing

**Bug**: The Revision cloud was not shown while being drawn on AutoCAD 2022 — only after it was ready. This made the function unusable.

**Fix**: MagiCAD 2022.1.

### Feeder Blocks Creating Duplicate References

**Bug**: Feeder blocks in switchboard schematic drawings created duplicate plan drawing references when edited. The Edit References function mixed up circuit references in switchboard schematic drawings containing feeder blocks.

**Fix**: MagiCAD 2022.1.

### Unnecessary Column Selection Saves

**Bug**: Column selections were saved into the project more frequently than necessary — even when no changes were made to visible columns (e.g., toggling between product categories). This caused unnecessary read/write errors and long waiting times.

**Fix**: MagiCAD 2022.1.

## Graphics Acceleration Problems in AutoCAD 2027

**Affected versions**: MagiCAD 2027

**Bug**: Problems with graphics acceleration in AutoCAD 2027.

**Status**: Under investigation.

## Clash Detection: Hard vs Soft Clashes

MagiCAD for Revit includes real-time clash detection during modelling:

### Hard Clashes
- Physical overlap between two or more elements
- Clear modelling error that prevents construction
- Identified immediately as modelling progresses

### Soft Clashes
- Placement violates required clearance to other elements
- User-defined distances (not fixed clearance settings)
- Affects accessibility, safety, and lifecycle performance
- Designer remains responsible for compliance with standards

### BCF Export
- Clash findings exported in **BIM Collaboration Format**
- Each BCF issue includes relevant view, location, and comments
- Supports model-based collaboration without separate drawing mark-ups

## New Features That Help Avoid Issues

### Errors and Warnings Tool
Lists all objects marked with errors or warnings during sizing or balancing, with additional information and suggested corrections.

### Component Sizing
Efficiently resize ventilation and piping components to match connected segment size — useful when segment sizes are changed manually.

### Print All Systems
Ventilation and piping calculation reports can now print all connected systems into the same file — previously had to be printed separately.

### Close Dampers from Report
Flow dampers can be closed/restored directly in the extended flow calculation report, allowing network simulation with and without extensions.

## Best Practices

1. **Always update to the latest UR (Update Release)** — many bugs are fixed between URs
2. **Check the troubleshooting page** before contacting support — workarounds are documented
3. **Use LOD 350 workaround** for insulation visibility before IFC export
4. **Disable Revit hydronic analysis** when installing DHWR circulation points
5. **Don't use S&H module with Revit 2025** — it's excluded due to incompatibility
6. **Verify IFC export elevations** — especially when using Project base point or Survey point
7. **Use Automatic processing interval** for GNSS processing
8. **Run clash detection during modelling** — not as a post-processing check
9. **Export BCF for coordination** — not separate mark-ups
10. **Check calculation reports for warnings** before exporting to IFC
