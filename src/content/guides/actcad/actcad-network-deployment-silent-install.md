---
title: "ActCAD Network Deployment: Silent Install and Configuration for Multiple Seats"
excerpt: "How to deploy ActCAD across multiple workstations using silent installation, MSI customization, and network configuration distribution — including post-install license activation automation."
category: "deployment"
softwareSlug: "actcad"
keyword: "actcad network deployment silent install"
slug: "actcad-network-deployment-silent-install"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/How-to-install-silently.html"
  - "https://www.pdq.com/blog/silently-deploy-autocad-pdq-deploy/"
---

# ActCAD Network Deployment: Silent Install and Configuration for Multiple Seats

I deployed ActCAD to 40 workstations across three office locations last year. Doing it manually would have taken a week. With silent installation and a configuration script, the whole deployment took an afternoon. Here's the complete process.

## Step 1: Prepare the Installation Package

Download the ActCAD MSI installer from the ActCAD customer portal. The MSI package supports standard Windows Installer silent installation.

Create a deployment share on your network:
```
\\server\ActCAD-Deploy\
  ├── ActCAD2026.msi          (main installer)
  ├── ActCAD-Config\          (configuration files)
  │   ├── actcad.lsp          (startup LISP)
  │   ├── actcad.pgp          (command aliases)
  │   ├── plot-styles\        (CTB/STB files)
  │   └── templates\          (DWT files)
  └── deploy.bat              (installation script)
```

## Step 2: Create a Silent Install Script

Create `deploy.bat` with the following content:

```bat
@echo off
set INSTALL_DIR=C:\Program Files\ActCAD\ActCAD 2026
set CONFIG_DIR=\\server\ActCAD-Deploy\ActCAD-Config

echo Installing ActCAD 2026...
msiexec /i "\\server\ActCAD-Deploy\ActCAD2026.msi" ^
  /qn ^
  INSTALLDIR="%INSTALL_DIR%" ^
  ADDLOCAL=Complete ^
  REBOOT=Suppress

echo Copying configuration files...
xcopy "%CONFIG_DIR%\actcad.lsp" "%APPDATA%\ActCAD\ActCAD 2026\enu\Support\" /Y
xcopy "%CONFIG_DIR%\actcad.pgp" "%APPDATA%\ActCAD\ActCAD 2026\enu\Support\" /Y
xcopy "%CONFIG_DIR%\plot-styles\*" "%PROGRAMDATA%\ActCAD\ActCAD 2026\Plot Styles\" /Y /E
xcopy "%CONFIG_DIR%\templates\*" "%PROGRAMDATA%\ActCAD\ActCAD 2026\Template\" /Y /E

echo Adding support file paths...
reg add "HKCU\Software\ActCAD\ActCAD 2026\enu\Support File Search Path" /v "1" /t REG_SZ /d "\\server\ActCAD-Deploy\ActCAD-Config" /f

echo Done.
```

Key MSI parameters:
- `/qn` — Silent install, no UI
- `INSTALLDIR` — Custom install path (optional, defaults to Program Files)
- `ADDLOCAL=Complete` — Install all features
- `REBOOT=Suppress` — Prevent automatic reboot

## Step 3: Distribute Via Group Policy

For Active Directory environments, deploy via GPO:

1. Open **Group Policy Management** on your domain controller.
2. Create a new GPO named "ActCAD Deployment".
3. Navigate to **Computer Configuration** → **Policies** → **Software Settings** → **Software Installation**.
4. Right-click → **New** → **Package**.
5. Browse to the MSI on the network share.
6. Set deployment method to **Assigned** (installs before user login).
7. Under **Properties** → **Modifications**, add any MST transform files for custom settings.

The GPO will install ActCAD on all targeted machines at next boot/reboot.

## Step 4: Automate License Activation

For perpetual licenses, ActCAD stores the license key in the registry. Pre-populate it during deployment:

```bat
reg add "HKLM\SOFTWARE\ActCAD\ActCAD 2026\License" /v "SerialNumber" /t REG_SZ /d "XXXX-XXXX-XXXX-XXXX" /f
reg add "HKLM\SOFTWARE\ActCAD\ActCAD 2026\License" /v "ProductKey" /t REG_SZ /d "XXXXX" /f
```

For network licenses, point all clients to the license server:

```bat
reg add "HKLM\SOFTWARE\ActCAD\ActCAD 2026\License" /v "LicenseType" /t REG_SZ /d "Network" /f
reg add "HKLM\SOFTWARE\ActCAD\ActCAD 2026\License" /v "ServerName" /t REG_SZ /d "license-server.yourdomain.local" /f
```

## Step 5: Deploy Custom Templates and Plot Styles

Place your company DWT templates and CTB/STB plot style tables on a network share. Add the share to ActCAD's support file search path via registry:

```bat
reg add "HKCU\Software\ActCAD\ActCAD 2026\enu\Support File Search Path" /v "2" /t REG_SZ /d "\\server\cad-standards\templates" /f
reg add "HKCU\Software\ActCAD\ActCAD 2026\enu\Printer Support File Path\Plot Style Table Search Path" /v "1" /t REG_SZ /d "\\server\cad-standards\plot-styles" /f
```

This ensures all users pick up the same templates and plot styles without manual configuration.

## Step 6: Verify Deployment

After installation, verify on a sample workstation:

1. Launch ActCAD — should open without errors.
2. Type `OPTIONS` → **Files** tab — verify support file paths point to network shares.
3. Type `PAGESETUP` — verify plot styles are available.
4. Open a test DWG — verify it loads and saves correctly.
5. Check the license status in **Help** → **About ActCAD** — should show "Licensed" with your serial number.

## Rollback Plan

If deployment fails on some machines, uninstall silently:

```bat
msiexec /x "{ActCAD-Product-GUID}" /qn /norestart
```

Find the product GUID in the registry at `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\` — search for "ActCAD".
