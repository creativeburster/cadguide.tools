### 1. Executive Summary & Objective
This operations playbook details governance workflows for configuring, distributing, and locking down company-wide **Revit Shared Parameter** text (.txt) files. It prevents standards drift, duplicate GUID conflicts, and broken schedules in collaborative BIM project workspaces.

### 2. The Risk of GUID Mismatch & Shared Parameter Vulnerabilities
Revit shared parameters rely on standard, tab-delimited text files.
*   **The GUID Anchor**: Revit tracks shared parameters using Global Unique Identifiers (GUIDs). The parameter name is secondary; if two files contain the same parameter name but different GUIDs, Revit will treat them as completely separate entities.
*   **Data Integrity Failure**: If a user creates a local parameter with a conflicting GUID or modifies the shared text file, scheduling, tagging, and cross-project family integration will break.

### 3. Step-by-Step Security and Lockdown Playbook

#### Step 1: Centralize on a Read-Only Network Share
Do not allow users to copy the shared parameter file locally or edit the master file.
1. Place your company master shared parameter file (e.g., `CompanySharedParameters.txt`) on a secure centralized network drive or a managed cloud directory.
2. Configure NTFS/Share permissions:
   *   **BIM Management Group**: Grant **Read & Write** permissions.
   *   **Drafting & Engineering Staff**: Grant **Read-Only** permissions.
3. In Revit, point your parameter settings to this path: go to the **Manage** tab > **Settings** panel > **Shared Parameters**, and click **Browse** to target the read-only network path.

#### Step 2: Implement Strict Schema Change Protocol
*   **No Modifications**: Never rename, edit, or delete parameters that are already in use in active projects or family libraries. Changing a parameter type (e.g., from Text to Length) inside the text file will break data bindings.
*   **Additions Only**: If a new parameter is required, it must be requested through a standards coordinator. The coordinator will append the parameter to the bottom of the text file.

#### Step 3: Transition to the Autodesk Parameter Service (Cloud Governance)
For modern projects utilizing Autodesk Construction Cloud (ACC):
1. Navigate to your ACC account administration settings.
2. Enable the **Parameter Service** to upload, tag, and organize parameters in a secure cloud environment.
3. Manage user permissions directly in the web browser, eliminating the risks associated with text file distribution.

#### Step 4: Isolate System-Driven Technical Parameters
If your families require background technical parameters for calculation formulas:
*   Maintain a separate `HiddenParameters.txt` file accessible only to your family creation team. Keep it segregated from the primary file used by general project teams to prevent user interface clutter.

### 4. Official References & Source Links
*   **Autodesk Help**: [Shared Parameters in Revit](https://help.autodesk.com/)
*   **Autodesk BIM Manager Guide**: [Managing Shared Parameters Across Multiple Projects](https://knowledge.autodesk.com/)
