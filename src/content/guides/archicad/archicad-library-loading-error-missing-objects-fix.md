---
title: "ArchiCAD Library Loading Errors: Missing Objects, Duplicate Libraries, and Migration Fixes"
excerpt: "After upgrading ArchiCAD, library objects show as missing or duplicated, causing project files to break. We cover the Library Manager workflow, duplicate library resolution, and the migration strategy that prevents missing object errors."
category: "troubleshooting"
softwareSlug: "archicad"
keyword: "ArchiCAD library loading error missing objects duplicate migration"
slug: "archicad-library-loading-error-missing-objects-fix"
author: "CADGuide Tools Editorial Team"
readTime: "8 min"
date: "2025-06-22"
sources:
  - "https://support.graphisoft.com/hc/en-us/articles/18795669276561-Troubleshooting-speed-issues-in-Archicad"
  - "https://www.graphisoft.com/us/keep-files-running-fast-and-lean"
---

# ArchiCAD Library Loading Errors: Missing Objects, Duplicate Libraries, and Migration Fixes

When you upgrade ArchiCAD to a new version, library objects from the previous version may not load correctly. Objects appear as gray boxes with "Missing Object" labels, or the Library Manager reports duplicate libraries. This is one of the most common issues when migrating ArchiCAD projects between versions, and it affects both the 3D model and 2D documentation.

## Problem 1: Missing Objects After Version Upgrade

### Cause: Library Path Changes

Each ArchiCAD version has its own library folder (e.g., `ArchiCAD 26 Library` vs `ArchiCAD 27 Library`). When you open a project created in an older version, ArchiCAD looks for the old library path, which may not exist in the new installation.

### Fix: Use the Library Manager

1. Go to **File → Libraries and Objects → Library Manager**
2. The Library Manager shows all loaded libraries and their status:
   - **Green**: Library loaded successfully
   - **Yellow**: Library has warnings (duplicate objects, missing dependencies)
   - **Red**: Library not found or failed to load
3. For each red library:
   - Click the library entry
   - Click **Replace**
   - Browse to the equivalent library in the new ArchiCAD version
   - The new library is typically at: `C:\Program Files\GRAPHISOFT\ArchiCAD 27\Libraries\`
4. Click **Reload** to reload all libraries
5. Check if the missing objects are now found

### Fix: Use the Migration Library

ArchiCAD includes Migration Libraries for each previous version:

1. In the Library Manager, click **Add**
2. Navigate to: `C:\Program Files\GRAPHISOFT\ArchiCAD 27\Libraries\Migration Libraries\`
3. Add the migration library for the version your project was created in (e.g., `ArchiCAD 26 Migration Library`)
4. The migration library contains objects that were renamed or restructured in the new version
5. Reload libraries and check if missing objects are resolved

## Problem 2: Duplicate Libraries

### Cause: Same Library Loaded Twice

When migrating projects, both the old and new library may be loaded, causing duplicate object definitions. This produces warnings in the Library Manager and can cause objects to display incorrectly.

### Fix: Remove Duplicate Libraries

1. Open the Library Manager
2. Look for libraries with yellow warning icons
3. Check for duplicate entries — the same library loaded from different paths
4. Select the older or incorrect duplicate
5. Click **Remove**
6. Keep only the current version's library
7. Click **Reload**

### Fix: Consolidate Embedded Libraries

1. In the Library Manager, check the **Embedded Library** section
2. The Embedded Library contains objects embedded directly in the project file
3. If objects were embedded from an older library version, they may conflict with the new library
4. Select embedded objects that are also in the standard library
5. Click **Remove** to delete the embedded copies
6. The standard library versions will be used instead

## Problem 3: Custom Library Objects Missing

### Cause: Custom Library Not Loaded

If your project uses custom objects (GDL objects from third-party libraries or custom-created objects), these libraries must be loaded separately:

### Fix: Add Custom Libraries

1. Open the Library Manager
2. Click **Add**
3. Browse to the folder containing your custom library
4. Select the folder and click **OK**
5. The custom library is added to the library list
6. Click **Reload**
7. Check if custom objects are now found

### Fix: Embed Custom Objects

If the custom library is no longer available:

1. Open the old project in the old ArchiCAD version
2. Select each custom object
3. Right-click → **Save as Object**
4. Save the object as a `.gsm` file
5. In the new ArchiCAD version, open the Library Manager
6. Add the saved `.gsm` files to the Embedded Library
7. The objects will now be available in the new version

## Problem 4: Library Loading Slow

### Cause: Large Libraries on Network Drives

Libraries stored on network drives are slow to load, especially for large libraries with many objects.

### Fix: Use Local Libraries

1. Copy library folders from the network to a local drive
2. In the Library Manager, replace network paths with local paths
3. Libraries load much faster from local storage
4. Use a library management tool to sync local copies with the network master

### Fix: Use BIMcloud for Library Management

If using BIMcloud:

1. Store libraries on the BIMcloud server
2. BIMcloud caches libraries locally on each client
3. This combines the speed of local libraries with the management of central storage
4. Library updates are automatically distributed to all team members

## Problem 5: GDL Object Script Errors

### Cause: Outdated GDL Scripts

GDL (Geometric Description Language) objects may use commands that have been deprecated or changed in new ArchiCAD versions:

### Fix: Update GDL Objects

1. Open the GDL object: **File → Libraries and Objects → Open Object**
2. Check the GDL script for errors
3. Look for deprecated commands (the GDL editor highlights these)
4. Replace deprecated commands with current equivalents
5. Save the updated object
6. Reload the library

### Fix: Contact the Object Developer

If the object was created by a third-party developer:

1. Check the developer's website for an updated version
2. Contact the developer with the specific error message
3. Many developers provide free updates for compatibility with new ArchiCAD versions

## Problem 6: IFC Import Library Issues

### Cause: IFC Objects Not Mapped to ArchiCAD Library

When importing IFC files, objects may not map to ArchiCAD library parts:

### Fix: Configure IFC Translation

1. Go to **File → Open → Open IFC**
2. In the IFC Import dialog, click **Translation Settings**
3. Map IFC entity types to ArchiCAD library parts:
   - `IfcWall` → ArchiCAD Wall tool
   - `IfcDoor` → ArchiCAD Door tool
   - `IfcWindow` → ArchiCAD Window tool
4. Save the translation map as a preset for future imports
5. Import the IFC file with the correct mapping

## Problem 7: Library Manager Hangs or Crashes

### Fix: Clear Library Cache

1. Close ArchiCAD
2. Navigate to: `%AppData%\GRAPHISOFT\ArchiCAD 27\`
3. Find the **Library Cache** folder
4. Delete the contents of the folder
5. Restart ArchiCAD
6. Open the Library Manager and reload libraries

### Fix: Reset Library Manager Preferences

1. Close ArchiCAD
2. Navigate to: `%AppData%\GRAPHISOFT\ArchiCAD 27\`
3. Find `LibraryManager.xml` and rename it to `LibraryManager.xml.bak`
4. Restart ArchiCAD
5. The Library Manager will use default settings

## Summary

| Problem | Root Cause | Fix |
|---------|-----------|-----|
| Missing objects after upgrade | Library path changed | Replace library path, use Migration Library |
| Duplicate libraries | Old and new library both loaded | Remove duplicate in Library Manager |
| Custom objects missing | Custom library not loaded | Add custom library or embed objects |
| Library loading slow | Libraries on network drive | Copy to local drive or use BIMcloud |
| GDL script errors | Deprecated GDL commands | Update GDL scripts or contact developer |
| IFC import issues | No IFC-to-library mapping | Configure IFC translation settings |
| Library Manager hangs | Corrupted cache | Clear library cache and preferences |

The most important preventive measure is using the Migration Library when upgrading projects. Always check the Library Manager after opening a migrated project — resolve all red and yellow warnings before starting work. For custom objects, embed them in the project file to ensure they're always available regardless of library configuration.
