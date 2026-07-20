---
title: "dRofus Item Management: Equipment Lists, Procurement Tracking, and Family Connections"
excerpt: "How to manage equipment and furniture items in dRofus — covering item creation, article databases, family connections to Revit, procurement status tracking, and generating equipment schedules for construction."
category: "workflow"
softwareSlug: "drofus"
keyword: "drofus item management equipment procurement tracking revit family"
slug: "drofus-item-management-equipment-procurement-tracking-revit-family"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-07-08"
sources:
  - "https://support.drofus.com/en/support/solutions/articles/16000080527-link-items-between-revit-and-drofus"
  - "https://help.drofus.com/en/English/Learning/limitations-of-revit-attribute-configurations"
---

# dRofus Item Management: Equipment Lists, Procurement Tracking, and Family Connections

Items in dRofus represent physical objects that go into a building — medical equipment, furniture, fixtures, AV equipment, IT hardware. We've managed equipment lists with 5,000+ items on hospital projects. dRofus keeps this data organized, connected to Revit families, and tracked through procurement. Here's how to set it up.

## Understanding dRofus Items

An item in dRofus is more than a line in a schedule. Each item contains:

- **Article ID**: Unique identifier that never changes
- **Article Name**: Descriptive name
- **Manufacturer**: Who makes it
- **Model Number**: Product model
- **Specifications**: Technical details
- **Procurement Status**: Ordered, Delivered, Installed
- **Room Assignment**: Which room it belongs to
- **Revit Family Connection**: Link to the corresponding Revit family

This data flows between dRofus and Revit, ensuring the model and the equipment list stay in sync.

## Step 1: Set Up the Article Database

The article database is the master catalog of all equipment available for the project.

1. Go to **Articles** module in dRofus.
2. Import articles from:
   - **Manufacturer catalogs** — many manufacturers provide dRofus-compatible catalogs
   - **Excel spreadsheets** — import from vendor equipment lists
   - **Manual entry** — create articles one by one
3. For each article, define:
   - **Article ID**: Unique code (auto-generated or manual)
   - **Article Name**: Clear descriptive name
   - **Category**: Equipment type (Medical, Furniture, AV, IT, Fixture)
   - **Manufacturer**: Company name
   - **Model Number**: Product model
   - **Dimensions**: Width, depth, height
   - **Power Requirements**: Electrical load, voltage
   - **Weight**: For structural loading
   - **Cost**: Unit cost for budget tracking

### Article Database Best Practices

- **Use manufacturer catalogs when available** — saves data entry and ensures accuracy
- **Establish naming conventions** — e.g., `[Manufacturer]-[Model]-[Category]`
- **Don't duplicate articles** — check for existing articles before creating new ones
- **Keep the database project-specific** — don't import every product catalog; only what's needed

## Step 2: Create Items from Articles

Items are instances of articles placed in specific rooms.

1. Go to **Items** module.
2. Click **New Item**.
3. Select an article from the database.
4. Assign the item to a room.
5. Set the item status:
   - **To be modeled**: Item needs to be placed in the Revit model
   - **Modeled**: Item has a corresponding Revit family
   - **Ordered**: Purchase order issued
   - **Delivered**: Item received on site
   - **Installed**: Item installed in the room

### Bulk Item Creation

For projects with many items:

1. Prepare an Excel spreadsheet with:
   - Room Number
   - Article ID (from the article database)
   - Quantity
2. Go to **Items** → **Import from Excel**.
3. Map the spreadsheet columns to dRofus fields.
4. Import — dRofus creates items and assigns them to rooms.

## Step 3: Connect Items to Revit Families

This is where the dRofus-Revit integration becomes powerful. Each item in dRofus can be linked to a Revit family instance.

### Prerequisites

1. **Attribute Configuration for Items** must be set up (see the dRofus Revit Integration guide).
2. **Key Attribute** must be configured — typically dRofus Article ID ↔ Revit shared parameter.
3. **Revit shared parameter** must exist in the relevant family categories.

### Linking Process

#### For items that exist in dRofus but not in Revit:

1. In dRofus, mark the item as "To be modeled".
2. In Revit, create or load the corresponding family.
3. Ensure the family's shared parameter (e.g., "dRofus ID") matches the item's Article ID.
4. Run synchronization — dRofus detects the matching ID and links them.

#### For items that exist in Revit but not in dRofus:

1. In dRofus, create a new item.
2. Set the Article ID to match the Revit family's shared parameter value.
3. Run synchronization — the item and family link automatically.

#### For items in both systems that aren't connected:

1. Ensure the connection code fields are identical in both systems.
2. Or ensure one field is empty (so it gets filled during connection).
3. Go to **Items → Items ↔ Families** in dRofus.
4. Select both the item and the family.
5. Click **↔** to connect them.
6. The connection is established and data syncs in both directions.

### Troubleshooting Family Connections

**Family doesn't appear in the Items ↔ Families list**: The family may not have the shared parameter, or the parameter value is empty. Check the Revit family's shared parameter value.

**Multiple items link to the same family**: This happens when multiple items have the same Article ID. Ensure each item has a unique Article ID.

**Connection breaks after re-syncing**: The key attribute value changed in one system. Check that the Article ID and shared parameter values still match.

## Step 4: Track Procurement Status

dRofus tracks equipment through the procurement lifecycle:

1. **Planned**: Item is in the program but not yet specified
2. **Specified**: Article selected and assigned to the item
3. **Approved**: Owner approved the selection
4. **Ordered**: Purchase order issued
5. **Delivered**: Item received on site
6. **Installed**: Item placed and connected in the room

### Procurement Workflow

1. **Designer selects articles** — assigns articles from the database to items
2. **Owner reviews and approves** — dRofus generates approval packages with specs and costs
3. **Procurement team orders** — updates status to "Ordered" with PO number and delivery date
4. **Site team receives** — updates status to "Delivered" with delivery confirmation
5. **Contractor installs** — updates status to "Installed" with installation date

### Procurement Reporting

1. Go to **Reports** → **Procurement Status**.
2. Filter by:
   - Status (all items not yet ordered)
   - Department (clinical equipment only)
   - Delivery date (items due in the next 30 days)
3. Export for procurement team meetings.

## Step 5: Generate Equipment Schedules

Equipment schedules from dRofus are more detailed than Revit schedules:

### Room Equipment Schedule

1. Go to **Reports** → **Room Equipment Schedule**.
2. Select rooms or filter by department.
3. The schedule includes:
   - Room number and name
   - Item name and article ID
   - Manufacturer and model
   - Quantity
   - Dimensions
   - Power requirements
   - Procurement status
4. Export to Excel or PDF.

### Master Equipment List

1. Go to **Reports** → **Master Equipment List**.
2. Shows all items across the project.
3. Group by:
   - Department
   - Room
   - Article category
   - Procurement status
4. Used for:
   - Budget verification
   - Procurement planning
   - Construction coordination
   - Commissioning checklists

### Equipment Cost Report

1. Go to **Reports** → **Cost Report**.
2. Shows total equipment cost by department, by room, by category.
3. Compare to budget to identify overruns.

## Step 6: Manage Equipment Changes

Equipment changes are inevitable. dRofus manages the change process:

### When an Article is Substituted

1. Find the item in dRofus.
2. Change the article assignment to the new article.
3. The Revit family connection may break if the new article has a different ID.
4. Update the Revit family's shared parameter to match the new Article ID.
5. Re-sync to re-establish the connection.

### When Equipment is Added

1. Create a new item in dRofus.
2. Assign it to the appropriate room.
3. Set status to "To be modeled".
4. The designer adds the family in Revit with the matching Article ID.
5. Sync to connect.

### When Equipment is Removed

1. Find the item in dRofus.
2. Update status to "Cancelled" (don't delete — keep for audit trail).
3. The Revit family should be removed from the model.
4. Sync — dRofus detects the missing family and flags it.

## Best Practices

- **Use the Article ID as the unique key** — it's intrinsic and never changes
- **Maintain a clean article database** — don't let duplicates accumulate
- **Mark items "To be modeled" before sending to the design team** — this is their work list
- **Track procurement status religiously** — outdated status causes site delays
- **Generate equipment schedules for every design milestone** — they're essential for review meetings
- **Don't delete cancelled items** — keep them for audit trail and change management
- **Use the Items ↔ Families view for bulk operations** — connect or disconnect multiple items at once
- **Train the procurement team on dRofus** — they need to update status, not just the BIM team
