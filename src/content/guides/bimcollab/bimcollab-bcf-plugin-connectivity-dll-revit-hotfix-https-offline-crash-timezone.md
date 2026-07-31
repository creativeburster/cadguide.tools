---
title: "BIMcollab BCF Plugin Connectivity: BCF Manager Won't Start from Missing DLL or Graphics Card, Revit External Application Error from Outdated Hotfix, Solibri Live Connector Sync Failure from Missing HTTPS, Offline Mode Crash in Family Environment, and Timezone Deadline Bug"
excerpt: "BIMcollab BCF Manager fails for 5 distinct reasons: plugin won't start due to missing BIMcollab_csx.dll or incompatible graphics card, Revit reports 'cannot run external application' from outdated Revit hotfix, Solibri BCF Live Connector can't sync because HTTPS is missing from server URL, offline mode crashes in Revit family environment, and deadline field timezone handling causes incorrect due dates. We cover each with fixes from BIMcollab help center and community forums."
category: "bcf-plugin-connectivity"
softwareSlug: "bimcollab"
keyword: "BIMcollab BCF Manager won't start missing DLL graphics card Revit external application error Solibri Live Connector sync HTTPS offline mode crash timezone deadline"
slug: "bimcollab-bcf-plugin-connectivity-dll-revit-hotfix-https-offline-crash-timezone"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://helpcenter.bimcollab.com/en/articles/351660-bcf-manager-does-not-start"
  - "https://helpcenter.bimcollab.com/en/articles/351665-latest-solutions-revit-cannot-run-external-application"
  - "https://society.solibri.com/topic/1731/bcf-live-connector-can-t-sync-with-bimcollab"
---

# BIMcollab BCF Plugin Connectivity: BCF Manager Won't Start from Missing DLL or Graphics Card, Revit External Application Error from Outdated Hotfix, Solibri Live Connector Sync Failure from Missing HTTPS, Offline Mode Crash in Family Environment, and Timezone Deadline Bug

BIMcollab's BCF Manager plugins for Revit, Archicad, and Solibri enable BIM coordination through issue tracking. However, plugin startup failures, sync errors, and connectivity issues prevent teams from collaborating. This guide covers the 5 most common BCF plugin connectivity problems with diagnostic steps and community-verified fixes.

## 1. BCF Manager Won't Start in Revit

### Symptom

The BCF Manager plugin doesn't start when launching Revit. No BCF Manager tab appears in the Revit ribbon.

### Diagnosis

1. **Check graphics card**:
   - Open Task Manager (Ctrl+Alt+Delete) → Performance tab → GPU
   - Note the graphics card name in the top right
   - Incompatible or outdated graphics cards can prevent the plugin from loading

2. **Check file location**:
   - Navigate to: `C:\Program Files\Autodesk\Revit 2021\AddIns\BCF Manager`
   - Verify all files are present, especially `BIMcollab_csx.dll`
   - If the DLL is missing, the plugin cannot load

3. **Check proxy server**:
   - Does your company use a proxy server?
   - Is there a firewall or antivirus blocking access to BIMcollab files?
   - Have IT check firewall rules for BIMcollab domains

### Fix

1. **Reinstall the BCF Manager plugin** — ensures all DLLs are present
2. **Update graphics driver** — from manufacturer website
3. **Configure proxy/firewall** — IT department must whitelist BIMcollab domains
4. **Check Revit version compatibility** — ensure the BCF Manager version matches the Revit version
5. **Verify installation path** — the plugin must be in the correct AddIns folder for the specific Revit version

### Information to Send to Support

If the issue persists, send to BIMcollab support:
- Software version and BCF Manager version
- Hardware configuration: Run `dxdiag` → Save All Information
- Graphics card details
- Operating system version

## 2. Revit "Cannot Run External Application" Error

### Error Message

```
Revit cannot run the external application...
```

### Root Cause

Revit is not up to date. The BCF Manager requires a specific Revit hotfix to function correctly.

### Fix

1. **Update Revit to the latest hotfix**:
   - Revit 2021: Install hotfix 2021.1.8 or later
   - Check Autodesk knowledge base for the latest hotfix for your version
   - Download and install the hotfix

2. **Reinstall BCF Manager after Revit update**:
   - Uninstall the BCF Manager
   - Install the latest version from BIMcollab
   - Restart Revit

3. **Check Revit add-in manager**:
   - Some Revit versions have an Add-In Manager
   - Verify BCF Manager is listed and enabled

## 3. Solibri BCF Live Connector: Can't Sync to BIMcollab

### Symptom

Using BCF Live Connector in Solibri to sync with BIMcollab:
- Comments made on BIMcollab by other team members appear in Solibri (incoming sync works)
- Comments placed in BCF Live Connector in Solibri don't sync to BIMcollab (outgoing sync fails)
- Cannot upload new issues from Solibri
- Sync status stays stuck

The issue affects every project in BIMcollab, but only for one user. Colleagues can sync normally with the same projects.

### Root Cause

The server URL in the BCF Live Connector is missing the **'s' in 'https'** — using 'http' instead of 'https' prevents outgoing sync while incoming sync may still work.

### Fix

1. **Check the server URL** in BCF Live Connector:
   - Ensure it starts with `https://` not `http://`
   - Delete the server and re-add it with the correct HTTPS URL

2. **Check automatic vs manual synchronization**:
   - Try switching between Automatic and Manual sync
   - If manual works but automatic doesn't, there may be a connection timeout issue

3. **Reinstall Solibri** — if the URL fix doesn't work:
   - Uninstall Solibri completely
   - Install the latest version (9.12.8 or later)
   - Reconfigure BCF Live Connector

4. **Check for user-specific configuration** — since colleagues don't have the issue:
   - Compare BCF Live Connector settings with a colleague who can sync
   - Check for different BIMcollab account permissions

## 4. Offline Mode Crash in Revit Family Environment

### Symptom

BCF Manager crashes when working in the Revit family environment while in offline mode (not connected to a BIMcollab project).

### Fix

1. **Update to the latest BCF Manager version** — this crash is fixed in recent releases:
   - "Fixed a crash that occurred in offline mode for the Revit family environment"
2. **Avoid using BCF Manager while editing families** — exit family editor before using BCF Manager
3. **Use online mode** — connect to a BIMcollab project before using BCF Manager
4. **Use BCF file export** instead of offline mode — export issues as BCF files for exchange

## 5. Timezone Deadline Bug: Incorrect Due Dates

### Symptom

Issue deadlines display incorrectly for users in timezones negative from UTC. A deadline set as "Friday" appears as "Thursday" for users behind UTC.

### Root Cause

The Deadline field was handled incorrectly for timezones negative from UTC. The deadline timestamp was not properly converted between timezones.

### Fix

1. **Update to the latest BCF Manager version** — the timezone handling bug is fixed
2. **Check deadline display in UTC** — compare with other users to verify the correct date
3. **Set deadlines with timezone awareness** — communicate deadline times in UTC to avoid confusion

## 6. Additional Known Issues and Fixes

### Installer Overwriting Previous Versions

**Issue**: The Revit 2021 BCF Manager installer was overriding the Revit 2020 version.
**Fix**: Update to the latest installer — this is fixed in current releases. Install BCF Manager for each Revit version separately.

### Search Function Crash

**Issue**: BCF Manager crashed when using the search function for issues.
**Fix**: Update to the latest version — this crash is fixed.

### Synchronizing Issues with Invalid Milestones

**Issue**: Crash when synchronizing issues with invalid milestones.
**Fix**: Update to the latest version — fixed in recent release.

### IDS Palette Not Syncing

**Issue**: Changes done in IDS on Nexus were not getting synced in the IDS palette.
**Fix**: Update to the latest version — fixed in recent release.

### Pending Members in Notify/Assign Lists

**Issue**: Pending members were displayed in the Notify and Assign lists.
**Fix**: Update to the latest version — fixed in recent release.

## Best Practices

1. **Verify BIMcollab_csx.dll exists** in the AddIns folder — most common startup failure
2. **Update Revit to the latest hotfix** — prevents "cannot run external application" error
3. **Use HTTPS in server URLs** — missing 's' breaks outgoing sync in Solibri
4. **Update BCF Manager to latest version** — many crashes are fixed in recent releases
5. **Don't use BCF Manager in Revit family editor** — offline mode crash
6. **Check firewall/proxy settings** — IT must whitelist BIMcollab domains
7. **Install BCF Manager for each Revit version separately** — avoid installer conflicts
8. **Compare settings with colleagues** — user-specific issues often stem from configuration
9. **Use BCF file export as fallback** — when online sync fails, exchange BCF files manually
10. **Communicate deadlines in UTC** — prevents timezone-related confusion
