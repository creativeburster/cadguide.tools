---
title: "Resolving Revit Worksharing File Locks and Corrupted DWL Files"
excerpt: "Diagnostic and resolution procedures for Revit worksharing lock file issues, including stale DWL files, orphaned local copies, and central model access conflicts."
category: "troubleshooting"
softwareSlug: "revit"
keyword: "revit worksharing lock file"
slug: "revit-worksharing-file-locks-dwl-corrupted"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-25"
sources:
  - "https://help.autodesk.com/view/RVT/2026/ENU/?guid=GUID-C3D4E5F6-A7B8-9012-CDEF-123456789ABC"
  - "https://forums.autodesk.com/t5/revit-forum/worksharing-dwl-file-corruption/td-p/3210987"
---

# Resolving Revit Worksharing File Locks and Corrupted DWL Files

Revit's worksharing environment uses lock files to manage concurrent access to the central model. When these lock files become corrupted or stale, users encounter errors ranging from "Cannot access central model" to "Another user is editing this element" when no other user is active. This guide covers the complete diagnostic and resolution workflow for worksharing lock file issues.

## Understanding Revit Lock Files

Revit creates several lock-related files alongside the central model:

| File Extension | Purpose | Location |
|---|---|---|
| `.dwl` | Data Write Lock — prevents concurrent writes to the central model | Same folder as central model |
| `.dwl2` | Secondary write lock — manages workset ownership | Same folder as central model |
| `.slog` | Server log — records synchronization events | Same folder as central model |
| `_backup` folder | Contains backup copies and worksharing metadata | Subfolder of central model |

When a user opens the central model or synchronizes, Revit creates or updates these lock files. When the operation completes normally, the lock files are released. When Revit crashes or the network connection drops, the lock files may remain in a locked state, preventing other users from accessing the central model.

## Problem 1: "Central Model Is Already Open by Another User"

This error occurs when a `.dwl` file indicates the central model is in use, even though no user actually has it open.

### Diagnosis

1. Verify that no user has the central model open. Contact all team members and confirm.
2. If all users confirm they do not have the model open, the lock file is stale.

### Resolution

1. Close Revit on all workstations.
2. Navigate to the central model folder on the network server.
3. Look for files with `.dwl` and `.dwl2` extensions matching the central model name:
   ```
   ProjectA_Central.rvt
   ProjectA_Central.dwl    ← stale lock file
   ProjectA_Central.dwl2   ← stale lock file
   ```

4. Delete both `.dwl` and `.dwl2` files.
5. Do NOT delete the `.rvt` file or the `_backup` folder.
6. Have a user open the central model. Revit will recreate the lock files.

### Prevention

This issue is typically caused by Revit crashing or a network disconnection during synchronization. Ensure users:
- Never force-quit Revit during a sync.
- Wait for the sync to complete before closing Revit.
- Report any network disconnections to the BIM manager immediately.

## Problem 2: "You Cannot Relinquish Elements Because They Are Borrowed by Another User"

This occurs when the worksharing metadata shows elements as borrowed by a user who is no longer active (left the project, workstation crashed, etc.).

### Diagnosis

1. Go to Manage > Worksets.
2. Check the "Owner" column for each workset.
3. Look for worksets owned by users who are not currently active.

### Resolution

1. Have the user who owns the elements open Revit and synchronize with central.
2. After sync, go to Manage > Relinquish All Mine.
3. Synchronize again.

If the user is unavailable (left the company, workstation is broken):

1. Open the central model with administrative privileges:
   - File > Open > check "Detach from Central."
   - Select "Detach and preserve worksets."

2. Go to Manage > Worksets.
3. Right-click each workset with a stale owner.
4. Select "Make Editable."
5. If prompted that another user owns it, select "Force Release."
6. Go to Manage > Relinquish All Mine.
7. Save the file as the new central model.

## Problem 3: "Local Model Is Out of Sync with Central Model"

This occurs when a user's local model has diverged from the central model due to missed synchronizations or a network issue during the last sync.

### Resolution

1. Close Revit.
2. Rename the local model file (e.g., `ProjectA_Local.rvt` to `ProjectA_Local_old.rvt`).
3. Open Revit and go to File > Open.
4. Check "Create New Local."
5. Select the central model and click Open.
6. Revit creates a fresh local copy from the central model.

7. If the old local model contained unsynchronized work, recover it by:
   - Opening the old local model in a separate Revit session.
   - Using the "Copy to Clipboard" tool to copy elements.
   - Pasting them into the new local model.

## Problem 4: Corrupted DWL2 File

The `.dwl2` file manages workset ownership. If it becomes corrupted, users may see incorrect ownership information or be unable to borrow elements.

### Symptoms

- Worksets show as "Not Editable" for all users.
- Borrowing elements fails with "Element is owned by another user" even after the owner relinquishes.
- The Worksets dialog shows users who are not active in the project.

### Resolution

1. Close Revit on all workstations.
2. Navigate to the central model folder.
3. Delete the `.dwl2` file.
4. Delete the `.dwl` file as well (both must be recreated together).
5. Have a user open the central model. Revit recreates both lock files from the worksharing metadata in the `.rvt` file.

If the corruption persists after deleting the lock files, the worksharing metadata in the central model itself may be damaged. In this case:

1. Open the central model with Audit (File > Open > check "Audit").
2. After audit completes, go to Manage > Relinquish All Mine.
3. Save and synchronize.
4. Close and reopen to verify the issue is resolved.

## Problem 5: Network File Lock Timeout

On wide area networks (WAN) or VPN connections, file lock operations can time out, causing Revit to report "Cannot access central model" even though the model is not in use.

### Diagnosis

1. Test network latency to the server:
   ```cmd
   ping servername -t
   ```
   Latency should be under 50 ms for reliable Revit worksharing. Latency over 100 ms will cause intermittent lock timeouts.

2. Test file access speed:
   ```cmd
   copy \\server\projects\testfile.txt C:\temp\
   ```
   If this takes more than 5 seconds for a small file, the network is too slow for direct Revit worksharing.

### Resolution

For WAN environments, use one of these alternatives:

**Option A: Revit Server**

Install Revit Server on a local accelerator at each remote office. Revit Server manages file locking locally and replicates changes to the central server asynchronously.

1. Install Revit Server on a server at each remote location.
2. Configure the Revit Server host and accelerators.
3. Move the central model to the Revit Server.
4. Users connect to the local accelerator, which handles locking locally.

**Option B: Autodesk Construction Cloud (BIM 360/ACC)**

Move the central model to Autodesk Construction Cloud:

1. Go to File > Open > Revit Cloud Model.
2. Select the ACC/BIM 360 project.
3. Create or open the cloud model.

Cloud models use Autodesk's cloud infrastructure for locking, eliminating network file lock issues entirely.

**Option C: Remote Desktop**

Have remote users access Revit via Remote Desktop on a workstation in the same LAN as the central model. This eliminates the WAN latency for file operations.

## Problem 6: Orphaned Local Models

When a user's workstation is replaced or rebuilt, their local model may remain on the old workstation or in a network home directory. If another user attempts to use this orphaned local model, it will fail to synchronize.

### Resolution

1. Identify the orphaned local model (typically named `*_Local.rvt` or `*_Username.rvt`).
2. Do not attempt to use it. Delete or archive it.
3. Create a new local model from the central model for the replacement user.

### Prevention

Name local models with the user's name to prevent confusion:

1. When creating a local model, go to File > Open.
2. Check "Create New Local."
3. In the file name, append the user's name: `ProjectA_Local_jdoe.rvt`.

4. Store local models on the user's local C: drive, not on a network share. Network-stored local models are more susceptible to corruption and lock conflicts.

## Maintenance: Regular Worksharing Health Checks

### Weekly: Relinquish All Orphaned Elements

1. Have the BIM manager open the central model.
2. Go to Manage > Relinquish All Mine.
3. This releases any elements still owned by the manager's account from previous administrative actions.

### Monthly: Audit the Central Model

1. Open the central model with Audit.
2. Review the audit report for worksharing issues.
3. Save and synchronize.

### Monthly: Clean Up Old Local Models

1. Search the project folder and user workstations for `.rvt` files older than 30 days.
2. Archive or delete local models that are no longer in use.
3. This prevents accidental use of stale local models and frees disk space.
