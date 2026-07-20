---
title: "BIMcollab BCF Manager for Revit: Live Issue Sync Without File Export"
excerpt: "How to use the BIMcollab BCF Manager plugin for Revit — covering installation, project connection, issue filtering, viewpoint navigation, status updates, and troubleshooting component highlighting and viewpoint alignment issues."
category: "workflow"
softwareSlug: "bimcollab"
keyword: "bimcollab bcf manager revit plugin live issue sync viewpoint"
slug: "bimcollab-bcf-manager-revit-plugin-live-issue-sync-viewpoint"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-08"
sources:
  - "https://helpcenter.bimcollab.com/en/articles/342140-set-up-the-bcf-managers"
  - "https://helpcenter.bimcollab.com/en/articles/351310-create-a-new-issue-in-bimcollab"
---

# BIMcollab BCF Manager for Revit: Live Issue Sync Without File Export

The BIMcollab BCF Manager for Revit is the plugin that connects Revit to BIMcollab Cloud. Without it, Revit users have to import and export BCF files manually — which is slow, error-prone, and leads to outdated issue data. With it, issues sync live. We've installed this plugin for hundreds of Revit users. Here's how to set it up and use it effectively.

## Why the BCF Manager Plugin Matters

Without the plugin, the BCF workflow is:
1. Coordinator exports BCF from Solibri
2. Emails the BCF file to the Revit user
3. Revit user imports BCF (requires Revit 2024+ or another plugin)
4. Revit user fixes the issue
5. Revit user exports updated BCF
6. Emails the BCF back to the coordinator
7. Coordinator imports BCF to Solibri

With the plugin, the workflow is:
1. Coordinator creates issue in Solibri → auto-syncs to BIMcollab
2. Revit user sees the issue in the BCF Manager panel → clicks to navigate
3. Revit user fixes the issue → updates status in BCF Manager → auto-syncs to BIMcollab
4. Coordinator sees the status update in Solibri → verifies and closes

No file transfer. No email. No outdated data.

## Step 1: Install the BCF Manager for Revit

1. Download the BCF Manager from `bimcollab.com/downloads`.
2. Select your Revit version (2019-2026 supported).
3. Close Revit.
4. Run the installer.
5. Open Revit — the **BIMcollab** tab appears in the ribbon.

### Installation Troubleshooting

**Tab doesn't appear**: Check that the installer matched your Revit version. Each Revit version needs its own installer. Verify in `Add-Ins` tab → `BIMcollab BCF Manager` may be listed there instead.

**Installer fails**: Run as administrator. Check that Revit is fully closed (check Task Manager for `Revit.exe`).

## Step 2: Connect to a BIMcollab Project

1. Go to the **BIMcollab** tab → **BCF Manager**.
2. The BCF Manager panel opens on the side.
3. Click **Connect** (gear icon or connection button).
4. Enter your BIMcollab credentials:
   - **Server**: `bimcollab.com` (or your enterprise server URL)
   - **Username**: Your BIMcollab email
   - **Password**: Your BIMcollab password
5. Select the project from the dropdown.
6. Click **OK**.

The BCF Manager loads all issues from the project. Issues appear in the panel with their title, status, priority, and assignment.

### Connection Issues

**Can't connect to server**: Check your internet connection. Verify the server URL is correct. If your company uses BIMcollab Nexus (on-premise), use the Nexus server URL, not `bimcollab.com`.

**Authentication failed**: Verify your BIMcollab credentials. If you use SSO (Single Sign-On), you may need an API key instead of a password. Contact your BIMcollab admin.

**Project not listed**: You may not have access to the project. Ask the BIMcollab Project Leader to invite you.

## Step 3: Filter and Find Issues

The BCF Manager panel includes filtering tools:

1. **Status Filter**: Show Active, Resolved, Closed, or All
2. **Assignment Filter**: Show issues assigned to you, to your team, or all
3. **Priority Filter**: High, Medium, Low, or All
4. **Type Filter**: Clash, Design Review, RFI, Note, or All
5. **Custom Field Filter**: Filter by discipline, floor, building (if configured in BIMcollab)
6. **Search**: Full-text search of issue titles and descriptions

### Recommended Filter Setup

For daily work, set:
- **Status**: Active
- **Assigned To**: Me
- This shows only issues you need to work on

For coordination meetings, set:
- **Status**: All
- **Assigned To**: All
- This shows the full issue list for discussion

## Step 4: Navigate to Issue Viewpoints

1. Click an issue in the BCF Manager panel.
2. Click **Show** (or double-click the issue).
3. Revit navigates to the issue's viewpoint:
   - Camera position adjusts to match the saved viewpoint
   - Relevant components are highlighted
   - Section box may be applied (if the issue was created with a section)
4. The issue details panel shows:
   - Title and description
   - Comments thread
   - Component references (linked Revit elements)
   - Viewpoint thumbnail

### Viewpoint Navigation Issues

**Viewpoint is in the wrong location**: The coordinate systems don't match. The issue was created in Solibri or Navisworks using IFC coordinates, but the Revit model uses different coordinates. Fix:

1. Ensure the Revit model uses shared coordinates (not project coordinates).
2. When exporting IFC from Revit, use the shared coordinate system.
3. In Solibri/Navisworks, load the IFC with the same coordinate system.
4. Re-create the issue from the corrected viewpoint.

**Components don't highlight**: The BCF component references don't match Revit elements. This happens when:

1. The IFC was re-exported with different element IDs.
2. The Revit model was modified (elements deleted and recreated).
3. The IFC export settings changed.

Fix: Re-create the issue from within Revit using the BCF Manager, or re-export the IFC with consistent settings.

## Step 5: Create New Issues from Revit

1. Navigate to the problem area in the Revit model.
2. Set up the view:
   - Zoom in close to the problem
   - Apply a section box to isolate the area
   - Select the problematic components (they'll be referenced in the issue)
3. In the BCF Manager, click **New Issue**.
4. Fill in:
   - **Title**: Clear, specific description
   - **Description**: Detailed explanation of the problem
   - **Type**: Clash, Design Review, RFI, Note
   - **Assigned To**: Select a project member
   - **Priority**: High, Medium, Low
   - **Custom Fields**: Discipline, floor, building (if configured)
5. The current Revit view becomes the issue viewpoint.
6. Selected components are automatically referenced.
7. Click **Create** — the issue syncs to BIMcollab immediately.

### Issue Creation Best Practices

- **Select components before creating** — this links the issue to specific Revit elements, making it easy to find later
- **Use a 3D view** — issues created from plan views are harder to understand in 3D viewers
- **Apply a section box** — isolate the problem from surrounding geometry
- **Zoom in close** — the viewpoint should clearly show the issue
- **Be specific in the title** — "Pipe P-08 clashes with duct D-12 at Grid C/Level 3" is actionable

## Step 6: Update Issue Status and Comments

After fixing an issue in Revit:

1. Select the issue in the BCF Manager.
2. Click **Edit** (or right-click → **Edit**).
3. Update:
   - **Status**: Resolved (if you've fixed it) or Active (if more work is needed)
   - **Comment**: Describe what you did to fix the issue
4. Click **Save** — the update syncs to BIMcollab immediately.
5. The coordinator and other team members see the updated status in real-time.

### Comment Best Practices

- **Describe the fix** — "Moved duct D-12 up 150mm to clear beam B-08"
- **Reference the model change** — "Updated duct routing in Level 3 MEP model"
- **Note any side effects** — "Moving the duct required adjusting the cable tray C-15 as well"
- **Ask questions if unclear** — "Is this clash intentional? The pipe appears to be designed to pass through the beam"

## Step 7: Use the IDS Requirements Feature

BIMcollab BCF Managers can display IDS (Information Delivery Specification) requirements for objects:

1. In BIMcollab, configure IDS requirements for the project.
2. In the Revit BCF Manager, enable **Show IDS Requirements**.
3. When you select an element in Revit, the BCF Manager shows the project's IDS requirements for that element type.
4. This helps modelers ensure they're entering the required data before issues are created.

### How IDS Reduces Issues

Instead of finding missing data after the fact (via Solibri checks), IDS shows requirements in real-time:

1. Modeler places a wall in Revit.
2. BCF Manager shows: "Walls require: Fire Rating, Acoustic Rating, Load-Bearing property."
3. Modeler enters the required properties.
4. When the model is checked in Solibri, the wall passes validation.

This dramatically reduces the number of data validation issues found in coordination.

## Step 8: Import Navisworks Clashes

If you use Navisworks for clash detection, the BCF Manager for Navisworks can import clashes in bulk:

1. Run Clash Detective in Navisworks.
2. Select the clashes to import.
3. In the Navisworks BCF Manager, click **Import from Clash Detective**.
4. All selected clashes become BIMcollab issues with:
   - Viewpoints from Navisworks
   - Clash metadata (status, clash point, components)
   - Automatic assignment (if configured)
5. Issues sync to BIMcollab and appear in Revit users' BCF Manager panels.

## Troubleshooting Common Issues

### Issues Not Appearing in Revit

1. Check the connection status (green icon = connected, red = disconnected).
2. Verify the project is correct.
3. Check the filter settings — you may be filtering out the issues.
4. Click **Refresh** to force a sync.

### Sync Delays

BIMcollab syncs in real-time, but network latency can cause delays:

1. Check your internet connection.
2. Click **Refresh** to force sync.
3. If delays persist, contact BIMcollab support — there may be a server issue.

### Revit Crashes When Opening BCF Manager

1. Update the BCF Manager to the latest version.
2. Check that the BCF Manager version matches your Revit version.
3. Try disabling other Revit add-ins to check for conflicts.
4. If the crash persists, contact BIMcollab support with the Revit journal file.

## Best Practices

- **Connect at the start of each Revit session** — issues won't sync if you're not connected
- **Filter to "Assigned To Me" for daily work** — don't get overwhelmed by the full issue list
- **Create issues from 3D views with section boxes** — the best viewpoints for reviewers
- **Select components before creating issues** — links issues to specific Revit elements
- **Update status immediately after fixing** — don't wait until end of day
- **Add descriptive comments** — the coordinator needs to know what you changed
- **Use IDS requirements to prevent issues** — enter required data before checks find it missing
- **Keep the plugin updated** — updates include IFC compatibility and performance fixes
