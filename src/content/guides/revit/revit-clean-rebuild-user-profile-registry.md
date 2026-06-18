### 1. Executive Summary & Objective
This technical playbook details the step-by-step diagnostic sequence for executing a clean rebuild of the Revit User Profile registry entries and local configurations. This procedure restores Revit to out-of-the-box defaults, resolving user interface freezes, corrupted Project Browser panels, and corrupted Ribbon layout settings without requiring a complete reinstallation.

### 2. File and Registry Directory Dependency Matrix
Before modifying files, identify the specific locations where Revit stores user-specific configurations (replace `####` with your active release year, e.g., `2026`):

*   **Local AppData Cache**:
    `C:\Users\%USERNAME%\AppData\Local\Autodesk\Revit\Autodesk Revit ####`
*   **Roaming AppData Settings**:
    `C:\Users\%USERNAME%\AppData\Roaming\Autodesk\Revit\Autodesk Revit ####`
*   **HKCU Registry Key**:
    `HKEY_CURRENT_USER\Software\Autodesk\Revit\Autodesk Revit ####`

### 3. Step-by-Step Profile Clean Rebuild Playbook

#### Step 1: Backup Custom Configurations
Ensure all Revit processes are completely terminated. Export your custom keyboard shortcut XML configurations:
*   Open Revit, go to **View** > **User Interface** > **Keyboard Shortcuts**, click **Export**, and save the file.

#### Step 2: Clear Local and Roaming Directories
1. Open Windows Explorer (`Win + E`).
2. Navigate to your Roaming directory: `%APPDATA%\Autodesk\Revit`
3. Locate the folder `Autodesk Revit ####` and rename it to `Autodesk Revit ####_OLD`.
4. Navigate to your Local directory: `%LOCALAPPDATA%\Autodesk\Revit`
5. Locate `Autodesk Revit ####` and rename it to `Autodesk Revit ####_OLD`.

#### Step 3: Rename Conflicted UI Layout Files (Non-Registry Reset Alternative)
If you only need to fix panel docking layout bugs, modify these specific UI cache files in `%APPDATA%\Autodesk\Revit\Autodesk Revit ####\ENU\`:
*   Rename **`UIState.dat`** to `UIState.dat.bak` to reset the main ribbon layout.
*   Rename **`RevitUILayout.xml`** to `RevitUILayout.xml.bak` to reset dockable panels (e.g., Properties and Project Browser).

#### Step 4: Rename the Current User Registry Key
1. Open Windows Registry Editor: press `Win + R`, type **`regedit`**, and press Enter.
2. Navigate to the following subkey block:
   `HKEY_CURRENT_USER\Software\Autodesk\Revit\Autodesk Revit ####`
3. Right-click the folder registry key, select **Rename**, and change it to `Autodesk Revit ####_OLD`.
4. Close the Registry Editor.

#### Step 5: Regenerate Default Configuration
Launch Revit. The application will detect the missing configuration files and registry entries and automatically regenerate fresh default values. Import your custom keyboard shortcut XML to restore key bindings.

### 4. Official References & Source Links
*   **Autodesk Knowledge Network (AKN)**: [How to Reset Revit to Installation Defaults](https://knowledge.autodesk.com/)
*   **Autodesk Help**: [Troubleshooting Revit User Interface Settings](https://help.autodesk.com/)
