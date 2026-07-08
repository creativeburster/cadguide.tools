---
title: "dRofus AEC Data Sync: Automated Revit Data Synchronization via Autodesk Construction Cloud"
excerpt: "How to set up dRofus AEC Data Sync for automated Revit-to-dRofus data synchronization through Autodesk Construction Cloud — covering integration setup, attribute configuration, sync triggers, troubleshooting, and comparison with desktop plugin sync."
category: "deployment"
softwareSlug: "drofus"
keyword: "drofus aec data sync automated revit autodesk construction cloud"
slug: "drofus-aec-data-sync-automated-revit-autodesk-construction-cloud"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-07-08"
sources:
  - "https://help.drofus.com/en/English/Learning/drofus-aec-data-sync"
  - "https://help.drofus.com/en/English/Learning/copy-working-with-multiple-revit-models"
---

# dRofus AEC Data Sync: Automated Revit Data Synchronization via Autodesk Construction Cloud

AEC Data Sync is dRofus's cloud-based integration with Revit via Autodesk Construction Cloud. Instead of opening Revit and manually running the dRofus plugin to sync data, AEC Data Sync automatically syncs when models are published to ACC. I've set this up on two hospital projects, and it eliminates the manual sync bottleneck. But the setup has specific requirements and limitations that aren't obvious. Here's what you need to know.

## How AEC Data Sync Works

The traditional dRofus-Revit sync requires:
1. Open Revit
2. Open the model
3. Run the dRofus plugin sync
4. Close Revit

AEC Data Sync changes this to:
1. Designer publishes the Revit model to ACC
2. AEC Data Sync automatically triggers
3. Data syncs from the published model to dRofus
4. dRofus sends an email log when complete

No one needs to open Revit just to sync data. The sync runs in the cloud.

## Prerequisites

Before setting up AEC Data Sync:

1. **ACC project** — an Autodesk Construction Cloud project with the Revit model hosted
2. **Published Revit model** — the model must be published to ACC Docs
3. **dRofus project** — an active dRofus project with rooms and/or items configured
4. **Model Options configured in Revit** — the Revit model must have dRofus Model Options set up (Model Name, attribute configurations)
5. **ACC admin access** — you need ACC admin rights to install the integration
6. **dRofus admin rights** — Full Room and Full Model Server rights in dRofus

## Step 1: Install the Integration in ACC

1. Log in to Autodesk Construction Cloud as a Project Admin.
2. Go to **Project Admin** → **Integrations** → **App Store**.
3. Search for "dRofus AEC Data Sync".
4. Click **Install**.
5. Grant the integration access to your ACC project data.
6. The integration is now available in your ACC project.

## Step 2: Configure the Integration in dRofus

1. Log in to dRofus Web (not the desktop client).
2. Go to **Project Settings** → **Integrations** → **AEC Data Sync**.
3. Connect to your ACC project:
   - Authenticate with your ACC credentials (OAuth)
   - Select the ACC project
   - Select the published Revit model
4. Configure sync settings:
   - **Attribute Configuration**: Select the room configuration (must be a custom configuration, not the default)
   - **Add New**: When enabled, new rooms in the Revit model are created in dRofus
   - **Delete Unmatched**: When enabled, rooms removed from Revit are deleted in dRofus (requires dRofus admin rights)
   - **Automatically sync on model publish**: When enabled, sync triggers automatically when a new model version is published to ACC

### Configuration Requirements

The attribute configuration used for AEC Data Sync must meet specific requirements:

- **Cannot use the default room configuration** — you must define a custom room configuration in Revit Model Options
- **Key attribute must not require writing back to the model** — the key attribute should be read-only from Revit's perspective
- **No mapping of fields that edit the model** — AEC Data Sync only reads from the published model, it can't write back to Revit

If you see "Built-in Attribute Configuration for room not supported. Please update the model options," it means the default configuration is being used. Go back to Revit and create a custom configuration.

## Step 3: Publish the Revit Model to ACC

For AEC Data Sync to work, the Revit model must be published to ACC:

1. In Revit, go to **Collaborate** → **Manage Cloud Models**.
2. Select the ACC project and folder.
3. Click **Publish Model**.
4. Wait for the publish to complete.
5. If "Automatically sync on model publish" is enabled, the sync triggers immediately.

### What Gets Synced

AEC Data Sync syncs the following from the published Revit model:
- **Room data**: Room number, name, area, level, perimeter
- **Room boundaries**: Spatial geometry from the published model
- **Room parameters**: Any mapped shared parameters

AEC Data Sync does NOT sync:
- **Items/Families**: Item sync still requires the desktop plugin
- **Room templates**: Template sync still requires the desktop plugin
- **Custom Revit parameters not in the attribute configuration**: Only mapped parameters sync

## Step 4: Monitor Sync Status

### Email Notifications

When a sync completes, dRofus sends an email to configured recipients with:
- **Sync timestamp**: When the sync ran
- **Model version**: Which ACC model version was synced
- **Rooms synced**: Number of rooms processed
- **Errors**: Any rooms that failed to sync
- **Warnings**: Rooms with data mismatches

### Sync Log in dRofus Web

1. Go to **Project Settings** → **Integrations** → **AEC Data Sync** → **Sync History**.
2. View past sync runs:
   - Timestamp
   - Trigger (automatic or manual)
   - Status (success, partial, failed)
   - Details (rooms added, updated, deleted, errors)

## Step 5: Troubleshoot AEC Data Sync Issues

### "Built-in Attribute Configuration for room not supported"

**Cause**: The Revit model is using the default room configuration.

**Fix**:
1. Open Revit and the model.
2. Go to dRofus tab → Settings → Attribute Configurations.
3. Create a new custom room configuration.
4. The key attribute should not require writing back to the model.
5. Don't map fields that would edit the model.
6. Update Model Options to use the new configuration.
7. Re-publish the model to ACC.

### "No model options found"

**Cause**: The Revit model doesn't have dRofus Model Options configured.

**Fix**:
1. Open Revit and the model.
2. Go to dRofus tab → Settings → Model Options.
3. Configure the Model Name and attribute configurations.
4. Save and re-publish to ACC.

### Sync Doesn't Trigger After Publish

**Cause**: "Automatically sync on model publish" is not enabled, or the ACC model wasn't actually published (just synced).

**Fix**:
1. Verify the model was published, not just synced. In Revit, "Sync with Central" is different from "Publish Model." AEC Data Sync triggers on publish, not sync.
2. In dRofus Web, check that "Automatically sync on model publish" is enabled.
3. If auto-sync is off, you can trigger a manual sync from dRofus Web.

### Rooms Not Appearing in dRofus After Sync

**Cause**: "Add New" is not enabled, or the room key attributes don't match.

**Fix**:
1. Enable "Add New" in the AEC Data Sync settings.
2. Check that the Revit room numbers match the dRofus room numbers (key attribute).
3. If rooms are new (not in dRofus yet), "Add New" must be enabled to create them.

### Rooms Deleted from dRofus Unexpectedly

**Cause**: "Delete Unmatched" is enabled, and rooms in the Revit model don't match dRofus rooms.

**Fix**:
1. Disable "Delete Unmatched" if you're not sure all rooms are in the Revit model.
2. Only enable "Delete Unmatched" when you're confident the Revit model is complete.
3. Restore deleted rooms from dRofus backup (contact dRofus support if needed).

### Published Files Not Listed in dRofus

**Cause**: ACC permissions issue.

**Fix**:
1. Check your permissions in the ACC project.
2. Have an ACC admin verify your access to the folder containing the published model.
3. The integration can only access what you can view in ACC.

## Step 6: Compare AEC Data Sync vs Desktop Plugin Sync

| Feature | AEC Data Sync | Desktop Plugin |
|---|---|---|
| Trigger | Automatic on publish | Manual (open Revit) |
| Requires Revit | No | Yes |
| Syncs rooms | Yes | Yes |
| Syncs items | No | Yes |
| Syncs room templates | No | Yes |
| Syncs functions | No | Yes |
| Writes to Revit | No | Yes (Link →) |
| Reads from Revit | Yes | Yes |
| Multi-model support | Yes | Yes |
| Automation | Yes | No |

### When to Use AEC Data Sync

- For regular room data updates (areas, names, numbers)
- When the design team publishes models frequently
- When you want automated sync without manual intervention
- For reporting and validation (read-only data from Revit)

### When to Use Desktop Plugin

- For item/family synchronization
- For writing data from dRofus to Revit (Link →)
- For room template synchronization
- For initial setup and configuration
- For troubleshooting sync issues

### Using Both Together

Most projects use both:
1. **Desktop plugin** for initial setup, item sync, and writing data to Revit
2. **AEC Data Sync** for ongoing automated room data sync

This gives you automation for routine data updates and manual control for complex operations.

## Best Practices

- **Set up Model Options in Revit before enabling AEC Data Sync** — the integration depends on correct Model Options
- **Use a custom attribute configuration** — the default configuration is not supported
- **Start with auto-sync disabled** — run a few manual syncs to verify data before enabling automation
- **Monitor email logs** — check sync logs for errors and warnings
- **Don't enable "Delete Unmatched" until the Revit model is complete** — premature deletion causes data loss
- **Keep using the desktop plugin for items** — AEC Data Sync doesn't handle item sync
- **Publish models regularly** — the sync only triggers on publish, not on sync
- **Train the team on publish vs sync** — designers need to know they must publish for data to sync
