---
title: "dRofus Revit Sync and Room Data Management Errors"
excerpt: "dRofus Revit Sync and Room Data Management Errors: symptoms, root causes, and step-by-step fixes, verified against official documentation and community reports."
category: "troubleshooting"
softwareSlug: "drofus"
keyword: "dRofus duplicate ID primary key Group options Revit parameter mapping Room sync Link Status unlinked Show in Model Revit property update Room Data Status Template Derived From tracking deleted Revit Rooms Update dRofus large project sync without filter clears wrong models"
slug: "drofus-revit-sync-and-room-data-management-errors"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
---

# dRofus Revit Sync and Room Data Management Errors: Duplicate ID Primary Key from Multiple Group Options Conflicting on Revit Parameter Mapping, Room Sync Link Status Issues with Unlinked Rooms Requiring Show in Model Navigation, Revit Property Update Changes Room Data Status from Template to Derived From Automatically, Tracking Deleted Revit Rooms with Update dRofus Option, and Large Project Sync Without Filter Clears Data from Wrong Revit Models

dRofus's Revit synchronization, room data management, and tracking features produce errors from duplicate group options, link status issues, and filter misconfiguration. This guide covers the 5 most common dRofus problems with diagnostic steps and community-verified fixes from dRofus Help and Support.

## 1. Duplicate ID Primary Key from Multiple Group Options

### Error Message

"The value you tried to insert has an ID (number/primary key) which already exists in the database. Please try using another ID."

### Symptom

When synchronizing Revit rooms with dRofus, the error appears. The sync fails for specific rooms. The error is related to a Revit parameter being mapped to a dRofus field that doesn't exist or has conflicting options.

### Root Cause

A Revit parameter is mapped to a dRofus field that uses Group options. The same group option (e.g., "Example") has been created in multiple formats or locations in the dRofus database. For example, "Example" exists as both a Group type and a group name, or the same option exists in multiple drop-down menus. When Revit sends a value that matches multiple database entries, the database can't determine which entry to link to, causing the primary key conflict.

### Fix

1. **Identify the conflicting field mapping**:
   - Check the Attribute Configuration in dRofus
   - Find which Revit parameter is mapped to the dRofus field
   - Look for fields that use drop-down menus (Groups, Room Data fields, Item Data fields)

2. **Remove duplicate options in dRofus**:
   - Check Groups: ensure each group name is unique
   - Check Room Data drop-down menus: ensure no duplicate values
   - Check Item Data drop-down menus: ensure no duplicate values

3. **Check for case variations**:
   - "Example" and "example" may be treated as different entries
   - But "Example" in Groups and "Example" in Room Data fields conflict
   - Standardize naming conventions across all option lists

4. **Fix the specific conflict**:
   - In the example, "zone_pkey" refers to a group
   - "Example" was created three different ways in the database
   - Delete duplicate entries, keeping only one
   - Re-run the synchronization

5. **Verify the Attribute Configuration**:
   - Ensure each Revit parameter maps to exactly one dRofus field
   - Remove any orphaned or incorrect mappings
   - Test with a single room before syncing all rooms

### Community Report

> "You are trying to map a field in Revit to a field in dRofus that does not exist or the database is confused to which field you are trying to map to since the options are running into a conflict. We found three ways that 'Example' has been created. This is the source of the error."

## 2. Room Sync Link Status Issues with Unlinked Rooms

### Symptom

After synchronizing dRofus Rooms with Revit Rooms, some rooms show as "Not Linked in Revit." The user needs to find these unlinked rooms in the Revit model to troubleshoot the sync issue. The Link Status dialog shows a list of unlinked rooms but doesn't indicate their location in the model.

### Root Cause

Rooms may become unlinked during sync due to:
- Room number changes in Revit that don't match dRofus
- Rooms deleted in Revit but still active in dRofus
- Key attribute mismatch between Revit and dRofus
- Rooms placed in Revit but not yet linked to dRofus

### Fix

1. **Use Link Status dialog**:
   - Click "Link status" in the Synchronize dialog
   - This shows rooms that are not linked
   - Use the Search field and dRofus filter to narrow down

2. **Use "Show in Model" to navigate**:
   - This automatically navigates to the room in the Revit model
   - Use this to find and fix each unlinked room

3. **Check key attribute**:
   - The key attribute links Revit rooms to dRofus rooms
   - Verify the key attribute (e.g., Room Number, IFC GUID) matches
   - If using custom parameter (like Room ID), ensure it exists in both systems

4. **Use IFC GUID as key**:
   - This is the most reliable key attribute
   - No need for custom shared parameters or project parameters

5. **Add unplaced rooms to schedule**:
   - Set Revit filter to "All in schedule"
   - This adds rooms that exist in dRofus but not in Revit

6. **Remove or clear unmatched rooms**:
   - Use carefully — these operations delete data

### Community Report

> "Link status brings up the dialog. Under 'Not Linked in Revit Only,' right click to 'Show in Model' to automatically navigate to the room having an issue syncing with dRofus."

## 3. Revit Property Update Changes Room Data Status Automatically

### Symptom

When sending data from Revit Room parameters to dRofus Room Data attributes, the Room Data Status changes automatically. Rooms with "Not Created" status change to "Unique." Rooms with "From" (Room Template) status change to "Derived From." This happens without explicit user action.

### Root Cause

dRofus's automatic status management:
- If a dRofus Room has no Room Data Status ("Not Created") and a Revit parameter is mapped to write to a Room Data attribute, the status automatically changes to "Unique"
- If a Room has "From" (Room Template) status and a Revit parameter writes a different value than the template's value, the status changes to "Derived From"
- This is by design — it tracks which rooms have been modified from their template

### Fix

1. **Understand the automatic status changes**:
   - "Not Created" → "Unique": when Revit writes to an unmapped attribute
   - "From" (Template) → "Derived From": when Revit writes a value different from the template
   - These changes are intentional and track data provenance

2. **Use the same rules as Excel updates**:
   - Be aware that any data write changes the status
   - This is consistent across update methods

3. **Don't write to template-derived attributes**:
   - If you want rooms to stay as "From" (Template)
   - Don't map Revit parameters to those attributes
   - Only map parameters that should override template values

4. **Use "Unique" status for custom data**:
   - Rooms with "Unique" status have their own data
   - Not derived from any template
   - This is appropriate for project-specific room data

5. **Review status changes after sync**:
   - After synchronization, check Room Data Status for unexpected changes
   - If rooms changed from "From" to "Derived From" unexpectedly
   - Check which Revit parameters triggered the change
   - Adjust mappings to prevent unwanted overrides

6. **Use the "placed in Revit" tracking attribute**:
   - Map this to a logic (Yes/No) attribute in Room Data
   - After sync, dRofus shows which rooms are placed in Revit

### Community Report

> "If a dRofus Room does not have a Room Data Status and a dRofus attribute is mapped to be written from a Revit Room parameter, it will automatically change the Room's status to 'Unique.' If a Room has 'From' (Room Template) and the value is different to the template, it will change to 'Derived From.'"

## 4. Tracking Deleted Revit Rooms with Update dRofus

### Symptom

When "Start tracking" is activated and a Revit Room is deleted, the user is asked whether to leave the Room in the Revit schedule and update dRofus. If "Update dRofus" is chosen, the room data in dRofus is updated with the latest design information. But the room may still appear in dRofus as active.

### Root Cause

The tracking feature is designed to handle room deletions gracefully. When a Revit Room is deleted:
1. The user is prompted with options
2. "Leave in schedule + Update dRofus": keeps the room in Revit's schedule and updates dRofus with final data
3. The room in dRofus is not deleted — it remains as an unplaced room
4. The "placed in Revit" logic attribute is unchecked

### Fix

1. **Choose the right deletion option**:
   - This preserves the room data in dRofus for reference
   - The room remains in Revit's schedule as unplaced

2. **Check the "placed in Revit" attribute**:
   - After deletion, the logic attribute for "placed in Revit" is unchecked
   - Use this to filter for unplaced rooms in dRofus
   - Rooms with unchecked attribute are deleted from the model

3. **Use "Clear unmatched in dRofus"**:
   - If you want to remove dRofus data for deleted rooms
   - Set Revit filter to "All in schedule" or "All placed"
   - This removes outdated data from dRofus

4. **Don't combine "Clear unmatched" with "Add unplaced"**:
   - Choose one operation per sync
   - Run separate sync operations for different actions

5. **Use Auto Sync for automatic updates**:
   - Auto Sync handles wall moves, room name changes, and area updates
   - Ensure both Design Area and Room Name are configured for sync

6. **Verify key attribute has data**:
   - Ensure key attributes are populated before sync

### Community Report

> "When tracking is activated and you delete a Revit Room, you will be asked whether you'd like to leave the Room in the Revit schedule and update dRofus with the latest design information."

## 5. Large Project Sync Without Filter Clears Wrong Revit Models

### Symptom

In a large project with multiple Revit models (shell, fit-out, MEP), running synchronization without a dRofus filter clears data from Revit models that shouldn't be affected. Rooms in linked models are incorrectly cleared or removed.

### Root Cause

Without a dRofus filter, the sync operation applies to all rooms in the active Revit model. If the active model is a shell model and the sync is meant for the fit-out model, running without a filter can clear room data in the wrong model. The "Clear unmatched" and "Remove unmatched" operations are particularly dangerous without filters.

### Fix

1. **Always use a dRofus filter for large projects**:
   - Apply a filter using dRofus Properties attributes
   - Narrow down to only the rooms in the current Revit model

2. **Set the correct Revit filter**:
   - "All in schedule": includes all rooms in the Revit schedule
   - "All placed": includes only placed rooms
   - Choose the appropriate filter for the operation

3. **Use Model Name to distinguish models**:
   - Each Revit model has a unique Model Name in dRofus
   - Filter by Model Name to sync only the current model's rooms
   - This prevents cross-model data clearing

4. **Link rooms in the "Rooms Model" first**:
   - Then link the Rooms Model into other models (Instances Model)
   - Import or sync rooms as if they were in your model

5. **Use linked model rooms**:
   - This allows working with rooms from linked models
   - No need to copy rooms into linked models (required in v2.14 and earlier)

6. **Test with a single room first**:
   - Before running a full sync
   - Test with one room to verify the filter and operations
   - Verify the results in both Revit and dRofus
   - Only proceed with full sync if the test is successful

7. **Back up before clearing operations**:
   - Before running "Clear unmatched" or "Remove unmatched"
   - Export the current dRofus data to Excel
   - Create a backup of the Revit model
   - These operations are destructive and can't be undone

### Community Report

> "If you have a large project and you do not have all the Revit Rooms in one model, using this without a dRofus filter could result in the clearing of data from the wrong models."

## 6. Additional dRofus Issues

### Room Template Synchronization

**Issue**: Need to sync Room Templates before room list is populated.
**Fix**: "Synchronization against Room Templates enables you to work with standard data before a Room list has been populated." Use the Synchronize dialog and select "Room Templates" instead of "Rooms."

### Functions Synchronization

**Issue**: Need to sync dRofus Functions with Revit Spaces or Areas.
**Fix**: Use the Synchronize dialog and select "Functions" against "Revit Spaces" or "Revit Areas." The fundamentals are the same as Room synchronization.

### Revit Spaces from Linked Models

**Issue**: Need to create Revit Spaces from linked model rooms.
**Fix**: "In previous versions (2.14 and earlier), it was required to copy rooms into linked models. This is no longer necessary." Use "Create or Update Revit Spaces from Linked Revit Model."

### Configuration for Auto Sync

**Issue**: Auto Sync doesn't update Room Name when wall moves change Design Area.
**Fix**: "Design Area is configured in Revit to update dRofus" AND "Room Name is configured to update the Revit Room Name from dRofus." Both configurations must be active for Auto Sync to work.

## Best Practices

1. **Avoid duplicate options in Groups and drop-down menus** — prevents primary key errors
2. **Use IFC GUID as key attribute** — no custom parameters needed
3. **Use "Show in Model" for unlinked rooms** — navigates directly to problem rooms
4. **Apply dRofus filter for large projects** — prevents clearing wrong models
5. **Don't map Revit parameters to template-derived attributes** — prevents unwanted status changes
6. **Use "placed in Revit" logic attribute** — tracks room placement status
7. **Back up before "Clear unmatched" operations** — these are destructive
8. **Test with a single room before full sync** — verifies filter and operations
9. **Link rooms in Rooms Model first, then link to other models** — proper workflow
10. **Don't combine "Clear unmatched" with "Add unplaced"** — run separately
