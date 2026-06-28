---
title: "ArchiCAD File Bloat and Corruption: Compress, Repair, and Audit Workflow"
excerpt: "ArchiCAD project files grow to 500MB+ and slow down every operation. I cover the compress workflow, repair tool, audit and fix process, and the hotlink module strategy that keeps project files lean."
category: "performance"
softwareSlug: "archicad"
keyword: "ArchiCAD file bloat corruption compress repair audit"
slug: "archicad-file-bloat-corruption-compress-repair-fix"
author: "CAD IT Admin"
readTime: "8 min"
date: "2025-06-23"
sources:
  - "https://www.graphisoft.com/us/keep-files-running-fast-and-lean"
  - "https://support.graphisoft.com/hc/en-us/articles/18795669276561-Troubleshooting-speed-issues-in-Archicad"
---

# ArchiCAD File Bloat and Corruption: Compress, Repair, and Audit Workflow

Graphisoft's own performance guide states: "Even the smallest of projects can get bogged down, decreasing the speed of everything from selecting an element to generating the 3D window. While ArchiCAD becoming sluggish is bad in itself, this slowness often raises the potential for file crashes. Even if a project doesn't slow down, an ill-maintained file can become corrupted over time."

This is the core issue: ArchiCAD files accumulate data — deleted elements, unused library definitions, cached geometry — that bloats the file and degrades performance. Without regular maintenance, a 50MB project file can grow to 500MB, with every operation taking 10x longer than necessary.

## Fix 1: Compress the File

File compression removes deleted elements and unused data from the file:

1. Save and close all other projects
2. Go to **File → File Special → Compress**
3. ArchiCAD analyzes the file and removes:
   - Deleted elements still stored in the file
   - Unused library part definitions
   - Cached 3D geometry that can be regenerated
   - Unused pen colors and line types
4. The compression dialog shows the before and after file size
5. Save the compressed file

### When to Compress

- **Weekly**: For active projects
- **Before archiving**: To minimize storage
- **After major changes**: After deleting large amounts of geometry
- **After library changes**: After removing or replacing library parts

### Expected Size Reduction

- Lightly used files: 5-15% reduction
- Heavily edited files: 20-40% reduction
- Files with many deleted elements: 40-60% reduction

## Fix 2: Repair the File

The repair tool checks for and fixes file corruption:

1. Go to **File → File Special → Repair**
2. ArchiCAD checks for:
   - Corrupted element data
   - Broken references between elements
   - Invalid geometry
   - Database inconsistencies
3. Found issues are repaired automatically
4. Save the repaired file with a new name (don't overwrite the original)

### When to Repair

- After a crash (always repair the file after an unexpected shutdown)
- When elements display incorrectly
- When the file won't save properly
- When 3D geometry appears corrupted
- Monthly as preventive maintenance

## Fix 3: Audit and Fix

The audit tool performs a deeper analysis than repair:

1. Go to **File → File Special → Audit and Fix**
2. ArchiCAD performs a comprehensive check:
   - Element integrity (each element's data structure)
   - Reference integrity (links between elements)
   - Database integrity (the file's internal database)
   - Library reference integrity
3. A report is generated showing all found issues
4. Click **Fix All** to repair all issues
5. Save the audited file

### When to Audit

- After importing IFC files
- After merging XREF files
- After receiving files from external consultants
- When experiencing unexplained crashes
- Monthly for large projects

## Fix 4: Use Hotlink Modules

Hotlink modules are reusable building blocks that are referenced into the main project. They keep the main file smaller and improve performance:

### Creating Hotlink Modules

1. Create a separate ArchiCAD file for repeated elements (e.g., a typical apartment unit)
2. In the main project, go to **File → Hotlinks → Manage Hotlinks**
3. Click **New Hotlink**
4. Select the separate file as the hotlink source
5. Place instances of the hotlink in the main project
6. Each instance is a reference, not a full copy of the geometry

### Benefits

- Main project file stays small (only references are stored)
- Changes to the hotlink file update all instances automatically
- Each instance shares one geometry definition, reducing memory usage
- 3D rendering is faster because repeated geometry is cached

### When to Use Hotlinks

- Repeated floor plans (apartment units, hotel rooms, classrooms)
- Repeated building sections (townhouse units)
- Standard details used across multiple projects
- Furniture layouts that are repeated

## Fix 5: Reduce Embedded Library Size

The Embedded Library stores library parts directly in the project file. Over time, it can grow large with unused objects:

1. Go to **File → Libraries and Objects → Library Manager**
2. Check the **Embedded Library** section
3. Sort objects by size (click the Size column header)
4. Identify large objects that are no longer used
5. Select unused objects → **Remove**
6. For objects also in the standard library, remove the embedded copy
7. Reload libraries

## Fix 6: Clean Up Unused Attributes

ArchiCAD stores attributes (pen colors, line types, fill patterns, surfaces, building materials) even when they're no longer used:

1. Go to **Options → Element Attributes → Attribute Manager**
2. For each attribute type (Pens, Lines, Fills, Surfaces, Materials):
   - Click **Purge**
   - ArchiCAD removes all unused attributes
   - Review the list of attributes to be removed
   - Click **OK**
3. Save the file
4. File size can decrease by 5-10% from attribute cleanup alone

## Fix 7: Split Large Projects

If the file is still too large after all maintenance:

### Use Teamwork (BIMcloud)

1. Store the project on a BIMcloud server
2. Each team member works on their assigned layers/elements
3. The local working file is smaller — only the reserved elements are loaded fully
4. Other elements are loaded as lightweight references

### Split by Building/Wing

1. Create separate ArchiCAD files for each building or wing
2. Use **File → Hotlinks** to reference the buildings together
3. Each file is smaller and faster to work with
4. Use a master site file that references all building files

### Split by Discipline

1. Create separate files for architecture, structure, and MEP
2. Use IFC or hotlinks to coordinate between disciplines
3. Each discipline works in their own file without the overhead of other disciplines' geometry

## Fix 8: Optimize Survey Point Clouds

Point cloud data (from laser scanning) can massively bloat ArchiCAD files:

1. Don't embed point clouds in the ArchiCAD file
2. Use **File → External Content → Attach Point Cloud** to reference the point cloud externally
3. The point cloud is loaded on-demand, not stored in the project file
4. Use clipping to show only the relevant portion of the point cloud
5. Reduce point cloud density if possible (use a decimated version for working)

## Fix 9: Regular Maintenance Schedule

| Task | Frequency | Time Required |
|------|-----------|---------------|
| Compress | Weekly | 2-5 minutes |
| Repair | Monthly or after crash | 5-10 minutes |
| Audit and Fix | Monthly | 10-20 minutes |
| Purge attributes | Monthly | 5 minutes |
| Clean Embedded Library | Monthly | 10 minutes |
| Check for unused views | Monthly | 10 minutes |
| Check for unused layer combinations | Monthly | 5 minutes |

## Summary

| Fix | File Size Reduction | Difficulty |
|-----|-------------------|------------|
| Compress | 20-60% | Easy |
| Repair | Prevents corruption | Easy |
| Audit and Fix | Prevents corruption | Easy |
| Use hotlink modules | 30-70% for repeated elements | Medium |
| Reduce embedded library | 5-20% | Easy |
| Purge unused attributes | 5-10% | Easy |
| Split large projects | Varies | Medium |
| External point clouds | 50-90% for point cloud projects | Easy |

The most important maintenance task is weekly compression. A 5-minute compression can prevent hours of slowdown over the course of a week. Combine this with monthly audit and fix, and you'll keep your ArchiCAD files lean and responsive throughout the project lifecycle. For projects with repeated elements, hotlink modules are the single most effective file size reduction strategy.
