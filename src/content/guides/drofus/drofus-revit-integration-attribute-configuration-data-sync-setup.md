---
title: "dRofus Revit Integration: Attribute Configuration and Data Sync Setup"
excerpt: "How to configure dRofus attribute configurations for Revit — covering room and item synchronization, key attribute selection, link direction settings, model options setup, and troubleshooting sync failures between dRofus and Revit."
category: "deployment"
softwareSlug: "drofus"
keyword: "drofus revit integration attribute configuration data sync setup"
slug: "drofus-revit-integration-attribute-configuration-data-sync-setup"
author: "CADGuide Technical Editorial"
readTime: "13 min read"
date: "2026-07-08"
sources:
  - "https://help.drofus.com/en/English/Learning/limitations-of-revit-attribute-configurations"
  - "https://help.drofus.com/en/English/Learning/synchronize-with-revit"
---

# dRofus Revit Integration: Attribute Configuration and Data Sync Setup

dRofus is a BIM data management platform that sits alongside Revit and manages room data, equipment, and program requirements. I've set up dRofus for hospitals, universities, and government buildings. The attribute configuration is the heart of the dRofus-Revit integration — get it wrong and your data sync will be a mess. Get it right and dRofus becomes the single source of truth for your project data.

## Understanding the dRofus-Revit Relationship

dRofus and Revit serve different purposes:

- **Revit**: BIM authoring tool — manages geometry and model elements
- **dRofus**: Data management platform — manages room programs, equipment data, requirements, and project data

The integration syncs data between the two:
- **dRofus → Revit**: Push room data (names, numbers, functions) into Revit rooms
- **Revit → dRofus**: Pull model data (areas, levels, geometry) into dRofus

The **Attribute Configuration** defines which data flows in which direction and how elements are matched between the two systems.

## Step 1: Install the dRofus Revit Add-In

1. Download the dRofus Revit Add-In from `drofus.com/download`.
2. Close Revit.
3. Run the installer.
4. Open Revit — the dRofus tab appears in the ribbon.
5. Sign in with your dRofus account credentials.

### Supported Revit Versions

dRofus supports Revit 2019-2026. Ensure you download the correct add-in version for your Revit version.

## Step 2: Configure Model Options

Model Options define how the Revit model connects to the dRofus project.

1. In Revit, go to the **dRofus** tab → **Settings** → **Model Options**.
2. Configure:
   - **dRofus Server**: Your dRofus server URL
   - **Project**: Select the dRofus project
   - **Model Name**: Give this Revit model a unique name (critical for multi-model projects)
   - **Room Configuration**: Select the attribute configuration for rooms
   - **Item Configuration**: Select the attribute configuration for items
3. Click **Save**.

### Model Name Importance

The Model Name is critical. dRofus uses it to identify which Revit model owns which rooms. If you have multiple Revit models (one per building or discipline), each must have a unique Model Name.

**Rule**: All models that sync with dRofus must have Model Name configured. Without it, dRofus can't distinguish between models and may delete rooms from the wrong model.

## Step 3: Create Attribute Configurations

Attribute configurations map dRofus fields to Revit parameters.

1. In Revit, go to **dRofus** tab → **Settings** → **Attribute Configurations**.
2. Click **New** to create a configuration.
3. Name it (e.g., "Room Sync – Standard").
4. Select the configuration type:
   - **Rooms ↔ Revit Rooms**: Sync dRofus rooms with Revit rooms
   - **Items ↔ Revit Families**: Sync dRofus items with Revit families
   - **Room Templates ↔ Revit Rooms**: Sync dRofus room templates
   - **Functions ↔ Revit Spaces**: Sync dRofus functions with Revit spaces

### Configuring Room Attributes

For a Room configuration:

1. **Key Attribute**: Select the field used to match rooms between dRofus and Revit.
   - Recommended: **dRofus Room Number** ↔ **Revit Room Number**
   - The key attribute must be unique and should not be a calculated field
2. **Data Mapping**: Map dRofus fields to Revit parameters:
   - dRofus `Room Name` → Revit `Name` (Link →: dRofus pushes to Revit)
   - dRofus `Room Number` → Revit `Number` (Link ==: Key attribute, bidirectional match)
   - Revit `Area` → dRofus `Designed Area` (Link ←: Revit pushes to dRofus)
   - Revit `Level` → dRofus `Level` (Link ←: Revit pushes to dRofus)
   - dRofus `Function` → Revit `Function` (Link →: dRofus pushes to Revit)

### Understanding Link Directions

Each attribute mapping has a direction:

- **Link ==**: Key attribute — used for matching. Bidirectional, but typically not written to.
- **Link →**: dRofus writes to Revit. dRofus is the source of truth.
- **Link ←**: Revit writes to dRofus. Revit is the source of truth.
- **No link**: Attribute is not synced.

### Rules for Attribute Selection

Not all attributes can be linked in both directions:

- **dRofus System Attributes** (e.g., "Last synchronized date"): Cannot be written to. Link ← is not available.
- **dRofus Calculated Attributes** (e.g., "Designed - Programmed"): Cannot be written to. Link ← is not available. Cannot be used as Key attribute.
- **Revit System Parameters** (e.g., "Model Name (dRofus)"): Cannot be written to. Link → and Link == are not available.
- **Revit Calculated Parameters** (e.g., "Volume"): Cannot be written to. Link → is not available. Cannot be used as Key attribute.
- **User Permissions**: Users with Level 2 permissions for Rooms cannot write to Room Properties. Ensure users have Full Room rights for sync.

## Step 4: Configure Item Attributes

Items in dRofus represent equipment, furniture, and fixtures. The item configuration maps dRofus items to Revit families.

1. Create a new Attribute Configuration for **Items ↔ Revit Families**.
2. **Key Attribute**: Select the unique identifier:
   - Recommended: **dRofus Article ID** ↔ **Revit Shared Parameter** (e.g., "dRofus ID")
   - The Article ID is a unique intrinsic code that won't change
3. **Data Mapping**: Map item fields to Revit family parameters:
   - dRofus `Article ID` → Revit `dRofus ID` (Link ==)
   - dRofus `Article Name` → Revit `Type Name` (Link →)
   - dRofus `Manufacturer` → Revit `Manufacturer` (Link →)
   - Revit `Mark` → dRofus `Item Number` (Link ←)

### Setting Up the Unique Connection Code

For items to sync, both dRofus and Revit must have a matching unique code:

1. **In Revit**: Create a shared parameter (e.g., "dRofus ID") and add it to the relevant family categories.
2. **In dRofus**: Use the Article ID field as the unique code.
3. **In the Attribute Configuration**: Link the Revit shared parameter to the dRofus Article ID using Link ==.

### Linking Existing Items

If items exist in both dRofus and Revit but aren't connected:

1. Ensure the connection code fields are identical in both systems.
2. Or ensure one of the fields is empty (so it gets filled during manual connection).
3. Go to **Items → Items ↔ Families** in dRofus.
4. Select both items and click **↔** to connect them.
5. Once connected, data syncs automatically.

## Step 5: Run the First Synchronization

After configuring attributes and model options:

1. In Revit, go to **dRofus** tab → **Synchronize**.
2. The Synchronize window shows:
   - **Update Revit properties from dRofus**: Pushes dRofus data to Revit (always enabled)
   - **Update dRofus with Revit properties**: Pulls Revit data to dRofus
   - **Add unplaced to schedule**: Adds dRofus rooms to the Revit schedule
   - **Remove unmatched from Revit**: Removes Revit rooms not found in dRofus
   - **Clear unmatched in Revit**: Clears dRofus data from unlinked Revit rooms
3. Choose the appropriate options for your first sync.
4. Click **Synchronize**.

### First Sync Recommendations

- **Start with a small test** — sync one level or one area first
- **Don't enable "Remove unmatched" on first sync** — this can delete Revit rooms if the key attribute doesn't match
- **Review the sync log** — check for errors and warnings after sync completes
- **Verify data in both systems** — spot-check a few rooms to ensure data flowed correctly

## Step 6: Troubleshoot Sync Issues

### "Built-in Attribute Configuration for room not supported"

This error means the default room configuration isn't supported by the AEC Data Sync. Fix:

1. Go back to Revit and change the room configuration.
2. Update the Model Options.
3. Don't use a key that requires writing back to the model.
4. Don't map fields that edit the model.

### "No model options found"

Model Options haven't been set up. Fix:

1. Go to dRofus tab → Settings → Model Options.
2. Configure the model name and attribute configurations.
3. Save and retry sync.

### Rooms Not Matching

Rooms in dRofus and Revit don't link during sync. Causes:

1. **Key attribute mismatch** — the room numbers in dRofus don't match Revit. Check for leading zeros, spaces, or different numbering schemes.
2. **Empty key attribute** — one system has room numbers and the other doesn't. Populate both before syncing.
3. **Duplicate key values** — two rooms with the same number. dRofus can't determine which to link.

### Items Not Syncing

Items in dRofus don't appear in Revit (or vice versa). Causes:

1. **Connection code not matching** — the dRofus Article ID doesn't match the Revit shared parameter value.
2. **Family not loaded** — the Revit family hasn't been loaded into the model.
3. **Item not marked "to be modeled"** — in dRofus, the item must be checked as "to be modeled" for it to sync to Revit.

## Step 7: Set Up AEC Data Sync (Cloud-Based)

For projects using Autodesk Construction Cloud, dRofus offers AEC Data Sync — automated sync without opening Revit:

1. Have an ACC admin install the dRofus AEC Data Sync integration.
2. In dRofus Web, configure the integration:
   - Select the ACC project and model
   - Choose the attribute configuration
   - Set sync options (Add New, Delete Unmatched, Auto-sync on publish)
3. When Revit models are published to ACC, dRofus automatically syncs the data.

### AEC Data Sync Benefits

- **No Revit required** — sync runs in the cloud
- **Automated** — triggers on model publish, no manual sync needed
- **Email notifications** — receive a log when sync completes
- **OAuth authentication** — secure, permission-based access

### AEC Data Sync Limitations

- Requires ACC project with published Revit models
- Model Options must be set up in Revit before using AEC Data Sync
- Default room configurations are not supported — custom configuration required
- Automation settings become read-only once enabled

## Best Practices

- **Use Article ID as the key for items** — it's unique and never changes
- **Use Room Number as the key for rooms** — it's unique and stable
- **Don't use calculated fields as key attributes** — they change and break matching
- **Configure Model Options before first sync** — always set the Model Name
- **Test with a small subset first** — don't sync the entire project on day one
- **Document the attribute configuration** — create a mapping spreadsheet for reference
- **Use dRofus as the source of truth for room data** — push from dRofus to Revit, not the other way
- **Train the team** — ensure everyone understands which system owns which data
