### 1. Executive Summary & Objective
This IT deployment playbook provides the validated command-line switches and system setup parameters for running a silent deployment of AutoCAD using the new **Autodesk On-Demand Installation Service (ODIS)** engine. It also provides the official troubleshooting workflow to resolve Windows Installer **Error 1603** failures during enterprise mass installations.

### 2. ODIS Silent Installation Command-Line Protocol
Autodesk ODIS installations no longer use legacy MSI switches (`/qb`, `/qn`) directly on the main setup binary. You must invoke the ODIS bootstrapper:
1. Open Administrative Command Prompt or deployment console.
2. Navigate to your custom deployment image directory.
3. Execute the silent install command pointing to your ODIS setup parameters:
   ```cmd
   Setup.exe --silent --offline_mode -q --config ".\\image\\Collection.xml"
   ```
   * `--silent`: Disables all user interaction and progress windows.
   * `--offline_mode`: Instructs the installer to bypass internet registration steps.
   * `-q`: Launches the process quietly.

### 3. Autopsy & Solution for Installation Error 1603
Windows Installer Error 1603 is a general failure indicating that the setup engine aborted. To resolve this in Autodesk ODIS environments:
1. **Clear Locked Installer Cache**: Navigate to `C:\ProgramData\Autodesk\ODIS` and delete the contents of the ODIS local installation cache directories. Re-run `AdODIS-installer.exe` from the installer payload to repair the installer service.
2. **Purge Residual Registry Blocks**: If a previous partial install exists, run the Microsoft Install/Uninstall Troubleshooter or clean registry keys under `HKLM\Software\Autodesk\UPI2\` matching your AutoCAD product GUID.
3. **Assert System Temp Permissions**: Ensure the `SYSTEM` account has Full Control permissions on the Windows temp directory `%SystemRoot%\Temp` to prevent file access blocks during runtime extraction.
