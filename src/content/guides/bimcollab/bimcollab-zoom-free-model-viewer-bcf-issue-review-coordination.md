---
title: "BIMcollab Zoom: Free Model Viewer for BCF Issue Review and Coordination Meetings"
excerpt: "How to use BIMcollab Zoom for BIM model viewing and BCF issue review — covering IFC model loading, sectioning tools, issue creation and status updates, and using Zoom for weekly coordination meetings without desktop BIM tools."
category: "workflow"
softwareSlug: "bimcollab"
keyword: "bimcollab zoom free model viewer bcf issue review coordination"
slug: "bimcollab-zoom-free-model-viewer-bcf-issue-review-coordination"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-08"
sources:
  - "https://helpcenter.bimcollab.com/en/articles/356171-good-issue-management"
  - "https://www.bimcollab.com/en/products/bimcollab-nexus/bcf-managers/workflow/"
---

# BIMcollab Zoom: Free Model Viewer for BCF Issue Review and Coordination Meetings

BIMcollab Zoom is a free desktop model viewer that loads IFC files and connects to BIMcollab for BCF issue management. I use it in every coordination meeting — it's faster than opening Revit, handles large IFC models well, and lets anyone review issues without a BIM authoring tool license. Here's how to get the most out of it.

## What BIMcollab Zoom Is (and Isn't)

**Is**: A free IFC model viewer with BCF issue management capabilities. Connects to BIMcollab Cloud for live issue sync.

**Isn't**: A BIM authoring tool. You can't edit models in Zoom. You can view, measure, section, and create/review BCF issues.

**Price**: Free. No license required. Download from `bimcollab.com/zoom`.

## Step 1: Install and Set Up BIMcollab Zoom

1. Download BIMcollab Zoom from `bimcollab.com/zoom`.
2. Run the installer (Windows only).
3. Launch Zoom.
4. Go to **Settings** → **BIMcollab** → sign in with your BIMcollab account.
5. Select your project.

### System Requirements

- **OS**: Windows 10/11 (64-bit)
- **RAM**: 8 GB minimum, 16 GB recommended for large models
- **Graphics**: DirectX 11 compatible GPU with 2 GB+ VRAM
- **Disk**: 2 GB free for installation, plus space for IFC cache

## Step 2: Load IFC Models

1. Go to **File** → **Open** → select IFC files.
2. Or drag and drop IFC files into the Zoom window.
3. Each model loads as a separate layer in the Model Tree.
4. Configure model display:
   - **Visibility**: Show/hide each model
   - **Transparency**: Set per-model transparency
   - **Color Override**: Assign colors per discipline
   - **Wireframe/Solid**: Toggle display mode per model

### Loading Large Models

Zoom handles large IFC files better than most web-based viewers:

- **Use IFC 2x3 or IFC 4** — both are supported
- **Split very large models** — if a single IFC exceeds 1 GB, split by level or building
- **Close unused models** — unload models you don't need for the current review
- **Use the cache** — Zoom caches loaded models, so reopening is faster

## Step 3: Navigate and Section

### Navigation Controls

- **Orbit**: Left-click and drag
- **Pan**: Middle-click and drag (or Shift + left-click)
- **Zoom**: Scroll wheel
- **Walk**: Ctrl + W for first-person navigation

### Sectioning Tools

1. Click **Section** in the toolbar.
2. Choose:
   - **Box Section**: 3D clipping box
   - **Plane Section**: Single-plane clip
3. Adjust section handles to isolate the area of interest.
4. Save the sectioned view as a **Saved View**.

### Measurement Tools

1. Click **Measure** in the toolbar.
2. Click two points for distance measurement.
3. Use **Measure Angle** for angular measurements.
4. Measurements display in the model's units.

## Step 4: Connect to BIMcollab Issues

1. Go to **BIMcollab** tab → **Connect**.
2. Sign in with your BIMcollab account.
3. Select the project.
4. Issues from BIMcollab load into the Issues panel.
5. Filter issues by:
   - **Status**: Active, Resolved, Closed
   - **Assigned To**: Issues assigned to you
   - **Priority**: High, Medium, Low
   - **Type**: Clash, Design Review, RFI
   - **Custom Fields**: Filter by discipline, floor, building

## Step 5: Review Issues in Zoom

1. Click an issue in the Issues panel.
2. Zoom navigates to the issue's viewpoint.
3. The viewpoint shows:
   - Camera position and angle
   - Component highlights (the elements involved in the issue)
   - Section (if the issue was created with a sectioned view)
4. Review the issue:
   - Read the title and description
   - Check the comments thread
   - Verify the component highlights match the actual model
5. Add a comment if needed.
6. Update the issue status:
   - **Active**: Still needs work
   - **Resolved**: Fix has been implemented (for resolvers)
   - **Closed**: Verified (for coordinators/approvers)

## Step 6: Create New Issues in Zoom

1. Navigate to the problem area in the model.
2. Use sectioning to isolate the issue.
3. Click **New Issue** in the BIMcollab panel.
4. Fill in:
   - **Title**: Clear, specific description
   - **Description**: Detailed explanation
   - **Type**: Clash, Design Review, RFI, Note
   - **Assigned To**: Responsible person
   - **Priority**: High, Medium, Low
   - **Custom Fields**: Discipline, floor, building
5. The current viewpoint (camera, section, highlights) is saved with the issue.
6. Click **Create** — the issue syncs to BIMcollab immediately.

### Issue Creation Tips

- **Click on components before creating** — selected components are automatically referenced in the issue
- **Use sectioning** — isolate the issue from surrounding geometry for a clear viewpoint
- **Zoom in close** — the viewpoint should clearly show the problem
- **Be specific** — "Duct D-15 conflicts with beam B-08 at Grid C/Level 3" is actionable

## Step 7: Use Zoom for Coordination Meetings

BIMcollab Zoom is ideal for weekly coordination meetings:

### Pre-Meeting Setup

1. Load the latest IFC models from all disciplines.
2. Connect to BIMcollab and filter issues by Active status.
3. Create saved views for each agenda item (e.g., "Level 3 MEP Coordination", "Building A Clash Review").
4. Export the issue list for reference.

### During the Meeting

1. Share your screen with Zoom running.
2. Walk through each issue:
   - Open the issue viewpoint
   - Discuss the problem
   - Assign or reassign if needed
   - Update priority if circumstances changed
3. Create new issues for problems identified during the meeting.
4. Take notes in issue comments.

### Post-Meeting

1. Sync all issue updates to BIMcollab.
2. Export the updated issue list.
3. Send meeting minutes with issue assignments and due dates.

### Why Zoom Is Better Than Revit for Meetings

- **Faster to open** — Zoom loads in seconds; Revit takes minutes
- **Handles multiple IFC models** — no need to link models in Revit
- **No license required** — anyone can run Zoom, even non-Revit users
- **BCF integration** — issues are live, no file import/export needed
- **Lighter on resources** — Zoom uses less RAM than Revit with linked models

## Step 8: Export and Share

### Export Issues

1. In the Issues panel, select issues to export.
2. Click **Export BCF**.
3. Choose BCF 2.1 format.
4. Share with team members who don't have BIMcollab access.

### Export Views

1. Navigate to the desired view.
2. Click **Export Image** (screenshot).
3. Or use **Export 3D View** to create a standalone 3D view file.

### Export Model Data

1. Go to **File** → **Export** → **Component Data**.
2. Export component properties to Excel for quantity takeoff or data validation.

## Best Practices

- **Use Zoom for all coordination meetings** — it's faster and lighter than Revit
- **Load the latest IFC models before each meeting** — ensure you're reviewing current data
- **Create issues from close-up, sectioned viewpoints** — distant viewpoints are useless
- **Connect to BIMcollab before the meeting** — issues should be live, not stale
- **Use saved views for meeting agendas** — keeps the meeting organized
- **Train non-BIM users on Zoom** — clients and contractors can review issues without Revit
- **Keep Zoom updated** — updates often include IFC compatibility improvements
- **Use Zoom alongside Solibri** — Solibri for clash detection, Zoom for issue review and meetings
