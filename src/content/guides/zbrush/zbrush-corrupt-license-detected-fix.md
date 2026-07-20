---
title: "ZBrush 'A Corrupt License Has Been Detected' Error: Fix Guide"
excerpt: "ZBrush says your license is corrupt after a reinstall or OS update? I cover the Pixologic License Manager reset, Maxon App reactivation, remote deactivation via My Licenses, and clean reinstall steps to get ZBrush running again."
category: "troubleshooting"
softwareSlug: "zbrush"
keyword: "zbrush corrupt license has been detected"
slug: "zbrush-corrupt-license-detected-fix"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-03"
sources:
  - "https://support.maxon.net/hc/en-us/articles/7945130553372--Legacy-Licenses-Error-A-Corrupt-License-Has-Been-Detected"
  - "https://support.maxon.net/hc/en-us/articles/7943960959388-How-to-Do-a-Full-Reinstallation"
  - "https://support.maxon.net/hc/en-us/articles/7945095081884--Legacy-Deactivation"
  - "https://support.maxon.net/hc/en-us/articles/7296940284316-Using-ZBrush-and-Moving-to-Maxon-App"
---

# ZBrush 'A Corrupt License Has Been Detected' Error: Fix Guide

Seeing "A corrupt license has been detected" when you launch ZBrush is alarming, but it's a known issue with a straightforward fix. This error occurs when your computer's digital thumbprint changes — typically after reinstalling the software, updating your operating system, or replacing hardware components. ZBrush thinks it's running on a different machine, even though it's physically the same computer.

The fix depends on which licensing system you're using: legacy Pixologic licensing (ZBrush 2018-2022 with a serial number) or Maxon App licensing (subscription or Maxon-purchased perpetual). I'll cover both paths.

## Determine Your License Type

Before starting, figure out which licensing system you're on:

- **Legacy Pixologic license:** You purchased ZBrush from Pixologic before the Maxon acquisition, have a serial number, and use ZBrush 2022 or earlier. You activate through the Pixologic License Manager.
- **Maxon App license:** You purchased ZBrush from Maxon.net, use a subscription, or have a perpetual license bought directly from Maxon. You activate through the Maxon App and sign in with your Maxon account.

If you're not sure, check: if you have the **Maxon App** installed and sign in with a Maxon account, you're on Maxon licensing. If you enter a serial number during activation, you're on legacy Pixologic licensing.

## Fix for Legacy Pixologic Licenses (ZBrush 2018-2022)

### Step 1: Close ZBrush

Don't try to fix the license while ZBrush is running. Close it completely.

### Step 2: Navigate to the ZBrush Installation Folder

Open File Explorer and go to your ZBrush installation directory. The default location is:

```
C:\Program Files\Pixologic\ZBrush 2022
```

Adjust the version number if you're running an older version (2021, 2020, 2019, etc.).

### Step 3: Run the Pixologic License Manager

Find and run the **Pixologic License Manager** application in that folder.

- If you're using ZBrush 2019.1 or later, it's called **Pixologic License Manager**
- If you're using a version earlier than 2019.1, it's called **Pixologic Deactivation Manager**

If you get a "side-by-side configuration is incorrect" error when trying to run it, you need to install the Microsoft Visual C++ Redistributable. Download it from [Microsoft's website](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist), install it, and try again.

### Step 4: Click the Reset Button

This is the critical step. In the lower-left corner of the License Manager window, click the **Reset** button.

**You MUST click "Reset" — not any other button.** Clicking other buttons like "Deactivate" will not clear the corrupt license information, and the error will persist when you relaunch ZBrush.

When warned that you should only do this at the instruction of Support, confirm and proceed. This article counts as that instruction.

### Step 5: Close the License Manager

After the reset completes, close the License Manager.

### Step 6: Deactivate via My Licenses (Recommended)

Even though you've reset the local license, the activation may still be counted on the server side. To free up your activation:

1. Go to [pixologic.com/my-licenses/login.php](https://pixologic.com/my-licenses/login.php)
2. Log in with your Pixologic ID
3. Find your license key and view its activation history
4. Active installations are shown in green
5. Select the activation you want to remove
6. Click **Request Deactivation**
7. Confirm the deactivation

This credits the activation back to your account immediately, so you can reactivate without issues.

### Step 7: Launch ZBrush and Reactivate

1. Open ZBrush
2. You'll be prompted to activate
3. Enter your serial number or sign in with your Pixologic ID
4. Complete the activation process

If the web page says no activations are available, click the **Deactivate** button on that page to remove your previous activation. This frees up the slot and lets you activate successfully.

## Fix for Maxon App Licenses (Subscription or Maxon Perpetual)

If you're using the Maxon App for licensing, the process is different.

### Step 1: Sign Out of the Maxon App

1. Open the **Maxon App**
2. Click your profile icon in the top-right corner
3. Select **Sign Out**
4. Close the Maxon App

### Step 2: Reset the Maxon App Configuration

1. Press `Win + R` and type: `%APPDATA%\Maxon`
2. Rename the **Maxon** folder to **Maxon_backup**
3. Reopen the Maxon App
4. Sign back in with your Maxon account

This clears any cached license data that may be causing the corruption error.

### Step 3: Check License Status

1. In the Maxon App, look for ZBrush in the **Installed** section
2. If it shows as licensed, try launching ZBrush
3. If it shows an error or no license, click **Activate** or **Assign License**

### Step 4: If Still Failing, Do a Clean Reinstall

If resetting the Maxon App configuration doesn't work, a clean reinstall is the next step:

1. Open the Maxon App
2. Find ZBrush in the Installed section
3. Click **Uninstall**
4. After uninstall completes, navigate to the remaining folder and delete it:
   ```
   C:\Program Files\Maxon\ZBrush
   ```
5. Delete user configuration:
   - Press `Win + R` → type `%APPDATA%\Maxon` → delete the ZBrush folder
   - Press `Win + R` → type `%LOCALAPPDATA%\Maxon` → delete the ZBrush folder
6. **Restart your computer** — this clears any locked files or background processes
7. **Temporarily disable antivirus** — some antivirus programs interfere with the installation or activation process
8. Reopen the Maxon App and reinstall ZBrush
9. Launch ZBrush and sign in with your Maxon account
10. Re-enable your antivirus after confirming ZBrush works

There's no need to deactivate before reinstalling on the same machine when using Maxon App licensing.

## Common Causes and How to Prevent Recurrence

### OS Updates

Windows major updates (like going from Windows 10 to 11, or major feature updates) can change your machine's digital thumbprint. If you know a major update is coming:

1. Deactivate ZBrush before the update (via License Manager or My Licenses portal)
2. Run the OS update
3. Reactivate ZBrush after the update completes

### Hardware Changes

Replacing a motherboard, CPU, or hard drive can trigger the corrupt license error because these components contribute to your machine's hardware fingerprint. The fix is the same — reset and reactivate.

### Antivirus Interference

Some antivirus programs quarantine ZBrush's license files, causing corruption. To prevent this:

1. Add the entire ZBrush installation folder to your antivirus exclusions
2. Specifically exclude the Pixologic License Manager executable
3. If using Maxon App, exclude the Maxon App folder as well

### Multiple ZBrush Versions

Having multiple versions of ZBrush installed simultaneously (e.g., 2021 and 2022) can sometimes cause license conflicts. If you don't need the older version, uninstall it and keep only the latest.

## Quick Reference

| Your Situation | Fix Path |
|:--|:--|
| Legacy Pixologic license, corrupt after OS update | Legacy Fix: Steps 1-7 |
| Legacy Pixologic license, corrupt after reinstall | Legacy Fix: Steps 1-7 |
| Maxon App subscription license | Maxon Fix: Steps 1-3 |
| Maxon App license, still failing after reset | Maxon Fix: Step 4 (clean reinstall) |
| "No activations available" during reactivation | Deactivate via My Licenses portal, then reactivate |
| Side-by-side configuration error when running License Manager | Install Microsoft Visual C++ Redistributable |

## If Nothing Works

If you've tried all the steps above and ZBrush still shows the corrupt license error:

1. **Contact Maxon Support** at [support.maxon.net](https://support.maxon.net/)
2. Include your ZBrush version, operating system, and a description of what you've already tried
3. For legacy licenses, include your serial number
4. Maxon support can manually reset your activation count on their server

The corrupt license error is always fixable — it's a licensing sync issue, not a permanent ban on your software. The key is resetting the local license data and ensuring the server-side activation is freed up before reactivating.
