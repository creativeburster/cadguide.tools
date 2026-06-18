### 1. Executive Summary & Objective
This technical directive defines the official troubleshooting workflow to resolve Autodesk Revit shared coordinate system drift and the fatal **"Acquire Coordinates Failed"** error when linking external CAD/BIM models. It outlines the precise steps to purge redundant local sites and successfully align reference coordinate origins.

### 2. Resolution for "Acquire Coordinates Failed"
Revit blocks coordinate acquisition if the linked reference model (.rvt or .dwg) has multiple active site locations or corrupted site parameters.
1. Open the linked reference model in a separate session of Revit.
2. Navigate to the **Manage** tab > **Project Location** panel > click **Location**.
3. In the Location Weather and Site dialog, switch to the **Site** tab.
4. Review the list of sites. If multiple sites exist, select the unused or obsolete site names and click **Delete**, leaving only the single correct active site coordinate.
5. Save and close the linked file.
6. Open your host model, go to **Manage > Links**, reload the link, and re-run **Coordinates > Acquire Coordinates** by clicking on the linked instance.

### 3. Verification of 3D Coordinate Alignment
To guarantee coordinates are aligned and prevent model drift:
1. Temporarily unload and then reload the linked file using the positioning option: **Auto - By Shared Coordinates**.
2. If the linked model inserts exactly at the designated target point without coordinate mismatch warnings, the shared coordinate binding is successful.
3. Lock the Survey Point and Project Base Point by selecting them in the view and clicking the **Pin** tool (shortcut `PN`).
