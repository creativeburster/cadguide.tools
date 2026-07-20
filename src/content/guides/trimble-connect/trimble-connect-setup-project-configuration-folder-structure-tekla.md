---
title: "Trimble Connect Setup: Project Configuration, Folder Structure, and Tekla Integration"
excerpt: "How to set up Trimble Connect for BIM collaboration — covering project creation, folder hierarchy, permission configuration, Tekla Structures model sharing, and Desktop Connector sync troubleshooting."
category: "deployment"
softwareSlug: "trimble-connect"
keyword: "trimble connect setup project configuration folder structure tekla"
slug: "trimble-connect-setup-project-configuration-folder-structure-tekla"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-08"
sources:
  - "https://community.trimble.com/discussion/trimble-connect-sync-issues"
  - "https://community.trimble.com/communities/community-homepage/digestviewer/viewquestion?ContributedContentKey=96307765-9a50-4fca-aabd-6975f2e25100&CommunityKey=48f38a6e-5abb-4ba1-8880-972ff53882ff"
---

# Trimble Connect Setup: Project Configuration, Folder Structure, and Tekla Integration

Trimble Connect is Trimble's cloud collaboration platform for BIM projects. We've set it up for steel detailing projects, infrastructure projects, and multi-discipline building projects. It's particularly strong in the Tekla ecosystem, but it works with any BIM tool that can export IFC. Here's how to configure it properly.

## Understanding Trimble Connect's Position

Trimble Connect sits in the same space as Autodesk Construction Cloud and BIMcollab — a cloud-based CDE (Common Data Environment) for BIM projects. Its key differentiators:

- **Native Tekla Structures integration** — direct model sharing without IFC export
- **Trimble ecosystem** — integrates with SketchUp, Tekla, Trimble Survey instruments
- **Free tier available** — basic project functionality at no cost
- **IFC-based coordination** — works with any BIM tool that exports IFC
- **BCF support** — issue management compatible with other BIM tools

## Step 1: Create a Project

1. Log in to Trimble Connect at `app.connect.trimble.com`.
2. Click **New Project**.
3. Configure:
   - **Project Name**: Use company naming convention
   - **Project Type**: Building, Infrastructure, Industrial
   - **Location**: Set project location for coordinate systems
   - **Time Zone**: Match the project's time zone
4. The project is created with default folder structure.

### Project Naming

Follow the same conventions as ACC:
- `[Project Number]-[Project Name]` (e.g., `2026-015-Steel-Bridge`)
- Keep names short and avoid special characters

## Step 2: Design the Folder Hierarchy

Trimble Connect creates default folders, but you should customize them for your project.

### Recommended Structure

```
Project Root/
├── 01-Design/
│   ├── 01-Architecture/
│   ├── 02-Structural/
│   ├── 03-MEP/
│   └── 04-Civil/
├── 02-Shared Models/
│   ├── 01-IFC Models/
│   └── 02-Tekla Models/
├── 03-Coordination/
│   ├── 01-Clash Reports/
│   ├── 02-BCF Issues/
│   └── 03-Coordination Notes/
├── 04-Reference/
│   ├── 01-Drawings/
│   ├── 02-Specifications/
│   └── 03-Codes/
└── 05-Construction/
    ├── 01-Shop Drawings/
    ├── 02-As-Builts/
    └── 03-Photos/
```

### Folder Configuration

1. Right-click the project root → **New Folder**.
2. Set folder properties:
   - **Name**: Use numbered prefixes for sort order
   - **Description**: Document the folder's purpose
   - **Permissions**: Configure per-folder access (see Step 4)

## Step 3: Upload and Organize Models

### Uploading IFC Models

1. Navigate to the target folder.
2. Click **Upload** → select IFC files.
3. Trimble Connect processes the IFC and creates a 3D viewable model.
4. Set model properties:
   - **Discipline**: Architecture, Structural, MEP, Civil
   - **Phase**: Existing, New, Demolition
   - **Version**: Track model versions with naming conventions

### Uploading Tekla Models

Tekla Structures can publish directly to Trimble Connect:

1. In Tekla Structures, go to **File** → **Publish to Trimble Connect**.
2. Select the Trimble Connect project and folder.
3. Choose what to publish:
   - **Model database** — full Tekla model for Tekla users
   - **IFC export** — IFC version for non-Tekla users
   - **Rendered views** — pre-rendered images for review
4. Click **Publish**.

### Model Versioning

Trimble Connect automatically versions uploaded files:
- Each upload creates a new version
- Previous versions are retained and accessible
- Users can compare versions (limited capability compared to Solibri)

## Step 4: Configure Permissions

1. Go to **Project Settings** → **Members**.
2. Invite team members by email.
3. Assign roles:
   - **Project Admin**: Full control
   - **Project Manager**: Manage members and folders
   - **Editor**: Upload and edit files
   - **Reviewer**: View and comment
   - **Viewer**: View only

### Folder-Level Permissions

1. Right-click a folder → **Permissions**.
2. Configure per-user or per-group access:
   - **Read**: View files
   - **Write**: Upload and modify files
   - **Delete**: Remove files
   - **Manage**: Change permissions

### Permission Strategy

- **Structural team**: Write access to Structural folders, Read on others
- **Architecture team**: Write access to Architecture folders, Read on others
- **Contractor**: Write access to Construction folders, Read on design folders
- **Client**: Read access to coordination and report folders only

## Step 5: Set Up Tekla Structures Integration

For Tekla users, the integration goes beyond file sharing:

### Direct Model Linking

1. In Tekla Structures, go to **File** → **Link to Trimble Connect**.
2. Select the project and folder.
3. The Tekla model is linked to the Trimble Connect project.
4. Changes can be published directly from Tekla without manual IFC export.

### Reference Model Loading

1. In Tekla, go to **Reference Models** → **Add from Trimble Connect**.
2. Select IFC models from other disciplines.
3. Reference models are loaded directly from Trimble Connect.
4. Use **Reload** to update to the latest version.

### Clash Detection in Tekla

Tekla's built-in Clash Check can use Trimble Connect reference models:

1. Load reference models from Trimble Connect.
2. Go to **Clash Check** → **Check**.
3. Tekla checks the reference models against the native model.
4. Export clash results as BCF for issue management.

## Step 6: Install Trimble Connect Desktop

The desktop application provides faster file access and sync:

1. Download **Trimble Connect Desktop** from `connect.trimble.com`.
2. Sign in with your Trimble account.
3. Map project folders to local directories.
4. Configure sync settings:
   - **Automatic sync**: Files sync immediately on change
   - **Scheduled sync**: Files sync at set intervals
   - **Manual sync**: Files sync only when you click Sync

### Desktop Sync Issues

**Files not syncing**: Check the sync status icon in the system tray. If it shows an error:
1. Right-click the Trimble Connect icon → **Troubleshoot**.
2. Check your internet connection.
3. Verify you have permission to the folder.
4. Restart the Trimble Connect Desktop application.

**Sync conflicts**: When two users edit the same file simultaneously:
1. Trimble Connect creates a conflict file.
2. Compare the two versions and merge manually.
3. Delete the conflict file after resolving.

**Large file sync failures**: IFC files over 500 MB may fail to sync:
1. Split the IFC into smaller files by level or area.
2. Use Trimble Connect's web upload for large files (more reliable than desktop sync).
3. Compress the IFC file before uploading.

## Step 7: Set Up BCF Issue Management

Trimble Connect includes built-in BCF issue management:

1. Open a model in the **3D Viewer** (web or desktop).
2. Navigate to the issue location.
3. Click **Create Issue** (flag icon).
4. Fill in:
   - **Title**: Clear description
   - **Description**: Detailed explanation
   - **Type**: Clash, Design Review, RFI, Note
   - **Assigned To**: Responsible person
   - **Priority**: High, Medium, Low
   - **Status**: Active, Resolved, Closed
5. The issue includes a viewpoint and component references.

### BCF Import/Export

1. **Import BCF**: Go to **Issues** → **Import BCF** — import issues from Solibri, Navisworks, or other BIM tools.
2. **Export BCF**: Select issues → **Export BCF** — share with teams using other BIM tools.

### BCF Workflow with Tekla

1. Create issues in Trimble Connect's 3D Viewer.
2. Issues sync to Tekla Structures via the Trimble Connect integration.
3. Tekla users see issues in the **Task Manager** or **BCF Manager**.
4. Fix the issue in Tekla and update status.
5. Status syncs back to Trimble Connect.

## Step 8: Configure Clash Detection

Trimble Connect Desktop includes a Clash Analysis tool:

1. Open **Trimble Connect Desktop**.
2. Load the federated model (multiple IFC files).
3. Go to **Clash Analysis** → **New Clash Set**.
4. Configure:
   - **Model A vs Model B**: Which models to check against each other
   - **Tolerance**: Clash tolerance (typically 5mm)
   - **Filters**: Exclude certain component types
5. Click **Run Clash Analysis**.
6. Results appear in the Clash Analysis panel.
7. Create BCF issues from clash results.

### Clash Analysis Limitations

- **Desktop only**: Clash analysis is not available in the web viewer
- **IFC only**: Can only check IFC files, not native Tekla models
- **Basic filtering**: Less sophisticated than Solibri's ruleset system
- **No matrix support**: No clash detection matrix like Solibri

## Best Practices

- **Publish Tekla models as both native and IFC** — native for Tekla users, IFC for everyone else
- **Use consistent IFC export settings** — configure Tekla IFC export once and save as a template
- **Set up folder permissions before uploading files** — easier than changing permissions retroactively
- **Train the team on Desktop sync** — most sync issues come from misconfigured desktop settings
- **Use BCF for all issue management** — don't track issues in email or spreadsheets
- **Archive completed projects** — download all project data before archiving in Trimble Connect
- **Compare with BIMcollab Zoom** — if you need more advanced issue management, consider BIMcollab Zoom alongside Trimble Connect
