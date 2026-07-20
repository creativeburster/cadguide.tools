---
title: "Trimble Connect Sync Issues: Troubleshooting Desktop Connector and File Conflicts"
excerpt: "How to diagnose and fix Trimble Connect Desktop sync problems — covering stuck sync queues, file conflicts, large IFC file failures, cache corruption, and permission errors that prevent file uploads."
category: "troubleshooting"
softwareSlug: "trimble-connect"
keyword: "trimble connect sync issues desktop connector troubleshooting file conflicts"
slug: "trimble-connect-sync-issues-desktop-connector-troubleshooting"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-08"
sources:
  - "https://community.trimble.com/discussion/trimble-connect-sync-issues"
  - "https://community.trimble.com/communities/community-homepage/digestviewer/viewquestion?ContributedContentKey=96307765-9a50-4fca-aabd-6975f2e25100&CommunityKey=48f38a6e-5abb-4ba1-8880-972ff53882ff"
---

# Trimble Connect Sync Issues: Troubleshooting Desktop Connector and File Conflicts

Sync issues are the #1 support ticket for Trimble Connect. I've dealt with stuck sync queues, mysterious file conflicts, and IFC files that refuse to upload. The good news is that most sync problems have predictable root causes. Here's my troubleshooting guide based on real-world experience.

## Understanding How Trimble Connect Sync Works

Trimble Connect Desktop sync uses a local cache folder that mirrors your Trimble Connect project. When you add, modify, or delete a file locally, the sync engine queues the change and uploads it to Trimble Connect's cloud storage. When other users make changes, those changes download to your local cache.

The sync engine runs as a background service. If the service stops or the cache becomes corrupted, sync breaks silently — you won't know until you notice files are missing or outdated.

## Issue #1: Sync Queue Stuck

**Symptoms**: The sync icon shows a pending count that never decreases. Files appear to upload but never complete.

### Diagnosis

1. Right-click the Trimble Connect system tray icon → **View Sync Queue**.
2. Check which files are stuck.
3. Look for error messages next to stuck files.

### Fix

1. **Pause and resume sync**: Right-click the system tray icon → **Pause Sync** → wait 10 seconds → **Resume Sync**.
2. **Restart the service**: Open Task Manager → find `TrimbleConnectSync.exe` → End Task → reopen Trimble Connect Desktop.
3. **Clear the sync queue**: If individual files are stuck, right-click each → **Cancel Sync** → re-upload manually.
4. **Check file locks**: If the file is open in another application (Revit, Tekla, Excel), sync can't upload it. Close the application and retry.

## Issue #2: File Conflicts

**Symptoms**: A file appears with a `.conflict` extension, or Trimble Connect shows a conflict warning.

### Cause

Two users edited the same file simultaneously. Trimble Connect can't merge changes, so it preserves both versions.

### Fix

1. Open both versions of the file (the original and the `.conflict` copy).
2. Compare the changes and determine which version is correct.
3. Keep the correct version and delete the other.
4. Rename the file if necessary (remove the `.conflict` extension).
5. Sync the resolved file.

### Preventing Conflicts

- **Communicate with your team** — don't edit the same file simultaneously
- **Use check-out if available** — some file types support explicit check-out
- **Sync before editing** — always sync to get the latest version before making changes
- **Assign file ownership** — designate one person per file as the editor

## Issue #3: Large IFC Files Won't Upload

**Symptoms**: IFC files over 500 MB fail to upload or take extremely long.

### Fix

1. **Use web upload instead of desktop sync**: The web upload at `app.connect.trimble.com` handles large files better than the desktop sync engine.
2. **Split the IFC by level or area**: In your BIM tool, export IFC by building level or area rather than the entire model.
3. **Compress the IFC**: Use IFC compression (`.ifc.zip`) if your BIM tool supports it.
4. **Increase timeout settings**: In Trimble Connect Desktop → **Settings** → **Sync** → increase the upload timeout.
5. **Check available disk space**: The local cache needs free disk space proportional to the file size.

## Issue #4: Cache Corruption

**Symptoms**: Files appear in Trimble Connect web but not in Desktop. Or Desktop shows files that don't exist on the web.

### Fix

1. **Clear the local cache**:
   - Close Trimble Connect Desktop.
   - Navigate to the cache folder: `%LOCALAPPDATA%\Trimble\TrimbleConnect\Cache`
   - Delete all contents.
   - Reopen Trimble Connect Desktop.
   - The cache re-downloads from the cloud.
2. **Re-link the project**: Remove the project from Desktop and re-add it.

### Warning

Clearing the cache re-downloads all project files. For large projects, this can take hours. Only clear the cache when other fixes don't work.

## Issue #5: Permission Errors

**Symptoms**: "Access Denied" when trying to upload or modify a file.

### Diagnosis

1. Check your project role in **Project Settings** → **Members**.
2. Check folder permissions: right-click the folder → **Permissions**.
3. Verify you have **Write** permission for the target folder.

### Fix

1. Ask a Project Admin to grant the necessary permissions.
2. If you recently joined the project, permissions may not have propagated — wait 15 minutes and retry.
3. Check that you're signed in with the correct Trimble account (not a personal account when you should use a company account).

## Issue #6: BCF Issues Not Showing Snapshots

**Symptoms**: BCF issues imported from other tools (Solibri, Navisworks) don't display snapshots or viewpoints in Trimble Connect.

### Cause

The BCF file was created with a different coordinate system or the snapshot format is not fully compatible.

### Fix

1. Verify all models in the project share the same coordinate system.
2. Check the BCF version — Trimble Connect supports BCF 2.1. Older BCF 1.0 files may have limited snapshot support.
3. Re-create the BCF issues directly in Trimble Connect's 3D Viewer if snapshots are critical.
4. If importing from Solibri, ensure Solibri's IFC export coordinates match the Trimble Connect model coordinates.

## Issue #7: Tekla Model Not Appearing in Trimble Connect

**Symptoms**: Published a Tekla model to Trimble Connect, but it doesn't appear in the project.

### Fix

1. **Check the publish destination**: In Tekla, verify the project and folder path are correct.
2. **Check publish status**: In Tekla, go to **Publish Status** to see if the publish completed or failed.
3. **Check permissions**: Ensure your Tekla-linked Trimble account has Write permission to the target folder.
4. **Re-publish**: Try publishing again. Sometimes the first publish fails due to authentication timeout.
5. **Check file format**: If publishing as IFC, verify the IFC export settings in Tekla are correct.

## Issue #8: Desktop Connector High CPU Usage

**Symptoms**: Trimble Connect Desktop consumes 30-50% CPU continuously.

### Cause

The sync engine is constantly scanning for changes, usually because:
- The local cache folder is very large
- Many files are being synced simultaneously
- The sync engine is stuck in a loop

### Fix

1. **Reduce sync scope**: Only sync folders you actively work in. Right-click unused folders → **Stop Syncing**.
2. **Change sync mode**: Switch from automatic to scheduled sync (every 30 minutes instead of real-time).
3. **Exclude large folders**: If you have large reference folders that don't change often, exclude them from sync.
4. **Restart the service**: Kill `TrimbleConnectSync.exe` in Task Manager and restart.

## Preventive Maintenance

- **Clear cache quarterly** — prevents corruption buildup
- **Monitor sync queue** — check the system tray icon daily for stuck items
- **Keep Desktop updated** — install updates promptly for sync engine fixes
- **Don't work offline** — Trimble Connect Desktop is designed for online use; offline work causes sync conflicts
- **Close files before syncing** — don't sync files that are open in other applications
- **Use web upload for large files** — more reliable than desktop sync for files over 100 MB

## When to Contact Trimble Support

If you've tried all the above and sync still doesn't work, collect the following before contacting support:

1. **Sync log**: From `%LOCALAPPDATA%\Trimble\TrimbleConnect\Logs`
2. **System information**: OS version, RAM, disk space
3. **Trimble Connect Desktop version**: Help → About
4. **Project details**: Project name, folder path, file names involved
5. **Error messages**: Screenshots of any error dialogs
