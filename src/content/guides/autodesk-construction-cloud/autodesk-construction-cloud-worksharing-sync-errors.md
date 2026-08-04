---
title: "Autodesk Construction Cloud Worksharing Sync Errors"
excerpt: "Autodesk Construction Cloud Worksharing Sync Errors: symptoms, root causes, and step-by-step fixes, verified against Autodesk community forums."
category: "troubleshooting"
softwareSlug: "autodesk-construction-cloud"
keyword: "Autodesk Construction Cloud ACC BIM 360 sync error model restored previous version orphaned workset lock operation could not be completed element ownership duplicated materials single user sync bottleneck"
slug: "autodesk-construction-cloud-worksharing-sync-errors"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
---

# Autodesk Construction Cloud Worksharing Sync Errors: Model Restored to Previous Version, Orphaned Workset Locks Blocking Sync, Operation Could Not Be Completed Element Ownership Loss, Duplicated Materials Freezing Sync, and Single-User-Only Sync Bottleneck

Autodesk Construction Cloud (ACC) / BIM Collaborate Pro cloud worksharing enables multi-office Revit collaboration, but sync failures can block entire project teams. Models get "restored to previous version," elements become uneditable after sync, and sometimes only one user can sync at a time. This guide covers the 5 most common cloud worksharing failure modes with diagnostic steps and community-verified fixes from Autodesk forums.

## 1. Model Restored to Previous Version After Sync Failure

### Error Message

```
Your Model has been restored to a previous version
```

### Symptom

Users select "Sync Now" or "Sync and Modify Settings > Compact Central Model" — the "Save to Local" process fails and the error message appears. This impacts every user interacting with the model. All users are running the same Revit hotfix version.

### What Doesn't Fix It

- Clearing collaboration cache on each local drive
- Auditing the cloud model
- Detaching and saving the central model offline, then re-initiating collaboration

### Root Cause

The cloud model's sync transaction state has become corrupted. The local cache and the cloud central model are out of sync, and the system reverts to a previous consistent state.

### Fix

1. **Have all users close the model**
2. **One user opens the model from cloud** (not from local cache)
3. **Audit while opening**: File → Open → check "Audit" → select cloud model
4. **Sync immediately after audit completes**
5. **All other users create new local caches**:
   - Delete the collaboration cache folder: `C:\Users\{username}\AppData\Local\Autodesk\Revit\CollaborationCache`
   - Open the model from cloud — creates fresh local cache
6. **If the issue persists**: Contact Autodesk support — this is a cloud-side issue
7. **Save local before closing** — prevents lost progress if the model doesn't recover unsaved work

### Mixed Recovery Behavior

Sometimes Revit recognizes unsaved work when users close and reopen — sometimes it doesn't. This inconsistency makes it unreliable. Always save local before closing.

## 2. Orphaned Workset Locks: Only One User Can Sync at a Time

### Symptom

Only one team member can sync successfully. Others freeze during launch or sync. The issue affects both the project team and the client side — only one person from each organization can sync. The sync bottleneck is not fixed to a specific user.

### Root Cause

A previous sync failed mid-process and left workset elements locked under a user's name, even though that user is no longer in the model. These "orphaned locks" prevent other users from syncing because the system thinks elements are still borrowed.

### Diagnosis

1. **Go to Collaborate tab → Worksets**
2. **Click "Show" next to each workset** and check the Borrowers column
3. **Look for elements borrowed by a user who is NOT currently in the model** — that's the problem
4. **Check for duplicated materials** — install the Duplicated Materials Add-on:
   - Go to Add-ins tab → External Tools → RevitMaterialScanner
   - Duplicated materials can also cause sync freezing

### Fix

1. **Have the user who holds the lock open the model and Relinquish All**:
   - Collaborate → Relinquish All Mine
2. **If that user can't open the model**: An admin can use **"Manage Cloud Models"** tool in ACC to force-release permissions
3. **Clear collaboration cache** on all affected machines:
   - Delete `C:\Users\{username}\AppData\Local\Autodesk\Revit\CollaborationCache`
   - Also clear `PacCache` folder
4. **Verify Desktop Connector version** — update to latest version
5. **Check login IDs are different** for each user — same login ID causes conflicts

## 3. "Operation Could Not Be Completed": Element Ownership Loss After Sync

### Error Message

```
Operation could not be completed
```

### Symptom

User can open cloud projects and add new elements. Can edit elements they just created — but ONLY if they haven't synchronized them yet. Once synchronized, they lose "ownership" and cannot edit, move, or hide any existing elements. The "Relinquish All Mine" button is greyed out or fails to execute.

### Key Finding

The same account works perfectly on a different computer. The user has full Admin/Editor permissions on the ACC project.

### What Doesn't Fix It

- Cleaning CollaborationCache and PacCache folders
- Re-installing Revit and updating Desktop Connector
- Performing an Audit while opening
- Deleting LoginState.xml and clearing Identity Services folder
- Verifying Windows Username has no special/non-English characters

### Root Cause

The local Revit session is failing to maintain "Borrower" status after a sync. This is a token conflict or identity service issue specific to the machine, not the account.

### Fix

1. **Clear Autodesk Identity Services**:
   - Close Revit
   - Delete `C:\Users\{username}\AppData\Local\Autodesk\Identity Services`
   - Also delete `LoginState.xml` in the Revit folder
   - Restart Revit and sign in again

2. **Check for trial license conflicts** — trial licenses can interfere with token management:
   - If using a trial, check if the issue persists after activating a full license
   - Trial license token conflicts are machine-specific

3. **Reset Windows Credential Manager**:
   - Open Credential Manager → Windows Credentials
   - Remove any Autodesk-related credentials
   - Restart Revit and re-authenticate

4. **Check for conflicting Autodesk software** — multiple Autodesk products with different license types on the same machine can cause token conflicts

5. **Create a new Windows user profile** — if the issue is profile-specific, a new user profile may resolve it

6. **Unresolved cases exist** — some users report this issue cannot be fixed even after trying everything. In that case, use a different workstation.

## 4. Duplicated Materials Freezing Sync

### Symptom

Revit freezes during synchronization. Only one person can sync at a time. Autodesk support recommended purging the model, but the client doesn't allow purging.

### Root Cause

Duplicated materials in the Revit model create sync transaction bloat. Each material duplication adds to the sync payload, and the transaction history grows until syncs take excessive time or freeze.

### Diagnosis

1. **Install the Duplicated Materials Add-on** (RevitMaterialScanner)
2. **Go to Add-ins tab → External Tools → RevitMaterialScanner**
3. **Review the dialog** — lists all duplicated materials
4. **Delete duplicates** from the dialog box

### Fix

1. **Run RevitMaterialScanner** and delete all duplicated materials
2. **Sync after cleanup** — the sync should be faster
3. **Prevention**: Avoid importing materials from linked models — use shared parameters instead
4. **If client doesn't allow purging**: Explain that duplicated materials are not design data — they're computational overhead
5. **Save As Cloud Model** — creates a fresh central with clean transaction history:
   - Have the one user who CAN sync open the model
   - File → Save As → Cloud Model
   - This creates a new central with clean transaction history
   - Re-share the new model link with the team
   - Everyone detaches from the old model and creates new local caches

## 5. Single-User-Only Sync: Bloated Transaction History

### Symptom

Only one user can sync at a time — not always the same user. Others freeze during launch or sync. The model has been running for months without maintenance.

### Root Cause

The central model on ACC/BIM 360 has become bloated with sync transactions. The transaction history grows with every sync, and eventually the model can only process one sync at a time. This is NOT just a materials issue — it's a structural problem with the model's worksharing state.

### Fix

1. **Create a fresh central model**:
   - Have the one user who CAN sync open the model
   - File → Save As → Cloud Model (this creates a fresh central with clean transaction history)
   - Re-share the new model link with the team
   - Everyone detaches from the old model and creates new local caches from the fresh central

2. **This is less destructive than purging** — it preserves all elements while clearing the transaction bloat

3. **Collect journal files** for Autodesk support:
   - Journal files are at `C:\Users\{username}\AppData\Local\Autodesk\Revit\{version}\Journals`
   - Format: `journal.0001.txt` or `journal.0001.worker1.log`
   - These help Autodesk diagnose the root cause

4. **Regular maintenance**:
   - Periodically create a fresh central model (every few months)
   - Run RevitMaterialScanner regularly
   - Keep worksets organized and clean

## 6. Permission Errors: "You Do Not Have Permission"

### Error Message

```
You do not have permission to complete this action
```

### Symptom

When trying to open a cloud workshared model in Revit, the user gets a permission error despite having the correct project role.

### Fix

1. **Verify project permissions in ACC**:
   - Check the user's role in the ACC project (Admin, Editor, Viewer)
   - Ensure the user has access to the specific folder containing the model
   - Check folder-level permissions, not just project-level

2. **Check Document Cloud Sharing settings**:
   - In ACC admin panel, verify cloud sharing is enabled for the project
   - Ensure BIM Collaborate Pro or BIM Collaborate is activated

3. **Verify Revit version compatibility**:
   - The model must be created in the same or older Revit version
   - Newer Revit versions cannot open older central models without upgrade

4. **Clear cache and re-authenticate**:
   - Delete CollaborationCache and PacCache
   - Restart Revit and sign in again

## Best Practices

1. **Create fresh central models periodically** — prevents sync transaction bloat
2. **Run RevitMaterialScanner regularly** — duplicated materials freeze sync
3. **Clear CollaborationCache and PacCache** when sync issues appear
4. **Check for orphaned workset locks** — the most common cause of single-user sync bottleneck
5. **Save local before closing** — prevents lost progress from sync recovery failures
6. **Use "Manage Cloud Models" in ACC** to force-release orphaned locks
7. **Collect journal files** for Autodesk support — essential for diagnosis
8. **Keep Desktop Connector updated** — sync issues often stem from outdated versions
9. **Ensure different login IDs** for each user — same IDs cause conflicts
10. **Don't import materials from linked models** — use shared parameters instead
