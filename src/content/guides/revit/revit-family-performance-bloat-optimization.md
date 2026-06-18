### 1. Executive Summary & Objective
This graphics and model health directive outlines the performance standards for creating and auditing Autodesk Revit Families (`.rfa`). It provides the engineering rules to eliminate viewport lag, minimize file size, and remove legacy CAD imports that corrupt project databases.

### 2. Purging CAD Imports and Redundant Geometry
Imported DWG or DXF files inside Revit families cause serious rendering performance degradation and introduce foreign layer definitions.
1. Open the family (`.rfa`) file in the Family Editor.
2. Open the **Visibility/Graphics Overrides** panel (shortcut `VG`) and click on the **Imported Categories** tab.
3. Locate any listed CAD files, close the dialog, select the CAD geometry in the viewport, and click **Delete**. Never use "Import CAD" in families; if a DWG reference is needed, only trace it and delete it immediately.
4. Run the **Purge Unused** tool from the **Manage** tab. Run it at least three times consecutively until the number of items to purge drops to zero.

### 3. Detail Level and Visibility Rules
To reduce the GPU rasterization load in large projects:
1. Select complex 3D geometry inside the family.
2. Click **Visibility Settings** in the Properties panel.
3. Uncheck **Fine** and **Medium** options if the geometry is complex. Set the 3D element to display only in **Fine** views.
4. Draw lightweight 2D **Symbolic Lines** in the Ref Level plan view, and configure them to display in **Coarse** and **Medium** views. This forces Revit to bypass drawing complex 3D meshes in standard floor plans.
