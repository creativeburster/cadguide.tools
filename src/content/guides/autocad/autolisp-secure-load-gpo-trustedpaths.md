### 1. Executive Summary & Objective
This system security directive defines the enterprise deployment method to enforce AutoLISP secure loading using the `TRUSTEDPATHS` variable. This ensures CAD managers can load custom dynamic menus (`.cuix`) and LISP macros (`.lsp`) across thousands of workstations without triggering security warnings or requiring manual user confirmation.

### 2. SECURELOAD Configuration Parameters
AutoCAD controls custom code security levels using the `SECURELOAD` system variable.
- **Value 0**: Loads custom code from any directory without warning (not recommended due to malware risks).
- **Value 1 (Recommended)**: Auto-loads files only if they reside in folders specified in `TRUSTEDPATHS`. Files loaded from other folders display a security warning.
- **Value 2**: Restricts and prevents loading files from folders not listed in `TRUSTEDPATHS`.

### 3. Active Directory GPO Registry Distribution
To prevent security warnings for central LISP scripts, configure the target directories using Windows Group Policy Objects (GPO):
1. Open your Active Directory Group Policy Management Editor.
2. Navigate to **User Configuration > Preferences > Windows Settings > Registry**.
3. Create a Registry Preference item pointing to the target AutoCAD profile:
   * **Action**: Update
   * **Hive**: `HKEY_CURRENT_USER`
   * **Key Path**: `Software\Autodesk\AutoCAD\R24.3\ACAD-8001:409\Profiles\<YOUR_PROFILE_NAME>\Variables`
   * **Value Name**: `TRUSTEDPATHS`
   * **Value Type**: `REG_SZ`
   * **Value Data**: Define your shared network paths (e.g. `\\server\cad\support;\\server\cad\lisp`)
4. Link this GPO to the workstations Organization Unit (OU) to enforce centralized trust path variables.
