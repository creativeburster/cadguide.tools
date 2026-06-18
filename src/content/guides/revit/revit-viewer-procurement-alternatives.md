### 1. Executive Summary & Objective
This procurement playbook details licensing-free viewer alternatives for project stakeholders. By deploying the built-in Revit Viewer command-line execution mode, organizations can eliminate unnecessary SaaS seat subscription expenses for non-drafting stakeholders (e.g., project managers, client leads, and estimators).

### 2. The Revit.exe "/viewer" Command-Line Switch
Every full Revit installation includes a licensing-free viewer mode. This mode allows users to open, explore, and print project models without consuming an active Autodesk license token.

#### Features and Limitations:
*   **Permitted Actions**: Multi-view 3D camera pan/zoom navigation, property inspection, schedule viewing, and sheets plotting/printing.
*   **Prohibited Actions**: Saving changes, exporting to CAD formats (DXF/DWG/DGN), publishing central sync data, and running custom API command add-ins.

### 3. Step-by-Step Desktop Shortcut Configuration Playbook
To deploy a dedicated Revit Viewer icon on workstations without requiring Autodesk credentials:

#### Step 1: Create a Desktop Shortcut Link
1. Right-click on the client workstation desktop, select **New**, and choose **Shortcut**.
2. Browse to find the target `Revit.exe` path. The default system location is:
   `"C:\Program Files\Autodesk\Revit <Version>\Revit.exe"`

#### Step 2: Append the Viewer Execution Parameter
1. Right-click the newly created desktop shortcut, and select **Properties**.
2. Locate the **Target** field. Append the `/viewer` switch to the end of the executable path (outside of the double quotation marks, separated by a space).
   *   *Example Target String*:
       `"C:\Program Files\Autodesk\Revit 2026\Revit.exe" /viewer`
3. Rename the shortcut to **"Revit 2026 Viewer (Free)"** and click **Apply**.

#### Step 3: Verify Silent Launch Mode
Disconnect the workstation from active intranet networks (or log out of your Autodesk Desktop App profile) and launch the shortcut. Revit will boot directly into viewer mode without prompting for license allocation, serial entry, or network server sockets.

### 4. Official References & Source Links
*   **Autodesk Knowledge Network (AKN)**: [How to Run Revit in Free Viewer Mode](https://knowledge.autodesk.com/)
*   **Autodesk Help**: [Command-Line Options for Revit Installations](https://help.autodesk.com/)
