### 1. Executive Summary & Objective
This systems administrator playbook provides the technical steps for silently deploying the **Autodesk Desktop Licensing Service (AdskLicensing)** across corporate active directory domains using Windows **Group Policy Objects (GPO)** and automated batch scripts.

### 2. Silent Command Line Arguments
The modern Autodesk deployment bootstrapper relies on the Licensing Service Installer to register active product licenses. The standard setup file `AdskLicensing-installer.exe` can be executed silently in unattended mode to avoid user interaction:

```cmd
"AdskLicensing-installer.exe" --unattendedmodeui none
```

### 3. Step-by-Step GPO Computer Startup Script Deployment Playbook

#### Step 1: Create a Shared Network Installation Asset
1. Extract the Autodesk licensing binaries from your Revit installation image or download the latest update pack.
2. Place `AdskLicensing-installer.exe` into a shared network folder accessible by Domain Computers (e.g., `\\YourServer\DeploymentShare\Licensing\`).
3. Set network permissions: grant **Read & Execute** permissions to the **Domain Computers** security group.

#### Step 2: Code the Installation Verification Script
Create a new file named `InstallAdskLicensing.bat` to verify if the target service is already active, preventing redundant installation loops on every boot:

```batch
@echo off
:: Check for the presence of the licensing service executable
if exist "C:\Program Files (x86)\Common Files\Autodesk Shared\AdskLicensing\Current\AdskLicensingService\AdskLicensingService.exe" (
    echo Autodesk Desktop Licensing Service is already installed. Exiting...
    exit /b 0
)

:: Execute unattended silent installation
pushd "\\YourServer\DeploymentShare\Licensing\"
"AdskLicensing-installer.exe" --unattendedmodeui none
popd

exit /b %ERRORLEVEL%
```

#### Step 3: Configure GPO in Active Directory
1. Log in to your Domain Controller and open the **Group Policy Management Console (`gpmc.msc`)**.
2. Right-click your target Organization Unit (OU) containing the engineering workstation computer objects, and select **Create a GPO in this domain, and Link it here...**.
3. Name the GPO **"Autodesk Licensing Service Silent Deploy"**.
4. Right-click the new GPO and select **Edit**.
5. In the Group Policy Management Editor, navigate to:
   `Computer Configuration` > `Policies` > `Windows Settings` > `Scripts (Startup/Shutdown)`
6. Double-click **Startup**, click **Add...**, and browse to place the `InstallAdskLicensing.bat` script.
7. Click **Apply** and close the editor. Run `gpupdate /force` on target clients to test the deployment.

### 4. Official References & Source Links
*   **Autodesk Support Article**: [How to Install Autodesk Desktop Licensing Service Silently](https://knowledge.autodesk.com/)
*   **Microsoft TechNet**: [Deploying Windows Startup Scripts via GPO](https://learn.microsoft.com/)
