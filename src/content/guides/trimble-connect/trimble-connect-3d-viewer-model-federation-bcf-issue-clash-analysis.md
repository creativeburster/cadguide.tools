---
title: "Trimble Connect 3D Viewer: Model Federation, BCF Issue Creation, and Clash Analysis"
excerpt: "How to use Trimble Connect 3D Viewer for BIM coordination — covering model federation, sectioning tools, measurement, BCF issue creation with viewpoints, and running clash analysis between discipline models."
category: "workflow"
softwareSlug: "trimble-connect"
keyword: "trimble connect 3d viewer model federation bcf issue clash analysis"
slug: "trimble-connect-3d-viewer-model-federation-bcf-issue-clash-analysis"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-08"
sources:
  - "https://community.trimble.com/communities/community-homepage/digestviewer/viewthread?GroupId=607&MID=34669&CommunityKey=48f38a6e-5abb-4ba1-8880-972ff53882ff&tab=digestviewer"
  - "https://community.trimble.com/communities/community-homepage/digestviewer/viewthread?GroupId=607&MID=35603&CommunityKey=48f38a6e-5abb-4ba1-8880-972ff53882ff"
---

# Trimble Connect 3D Viewer: Model Federation, BCF Issue Creation, and Clash Analysis

The 3D Viewer is Trimble Connect's primary tool for BIM coordination. It runs in the browser — no desktop installation needed. We've used it for weekly coordination meetings, design reviews, and on-site model checking. It's not as powerful as Solibri or Navisworks, but for cloud-based coordination with distributed teams, it gets the job done. Here's how to use it effectively.

## Accessing the 3D Viewer

1. Log in to Trimble Connect at `app.connect.trimble.com`.
2. Navigate to a folder containing IFC models.
3. Click on an IFC file — it opens in the 3D Viewer automatically.
4. Or click **New View** to create a federated view with multiple models.

The 3D Viewer works in Chrome, Edge, and Firefox. No plugins required.

## Step 1: Federate Multiple Models

To coordinate between disciplines, you need to view multiple models together.

1. In the 3D Viewer, click **Add Model** (or **Add Files**).
2. Select additional IFC models from your Trimble Connect project.
3. Each model loads as a separate layer in the Model Tree panel.
4. Configure model visibility:
   - **Show/Hide**: Toggle each model on/off
   - **Transparency**: Make one model semi-transparent to see through it
   - **Color Override**: Assign a color per discipline (e.g., Structural = gray, MEP = blue)
5. Save the federated view as a **Saved View** for reuse.

### Federation Best Practices

- **Verify shared coordinates** — all models must use the same coordinate system. If models are offset, they won't align correctly.
- **Name saved views clearly** — e.g., "Level 3 Coordination – Structural + MEP"
- **Limit models per view** — more than 5-6 models can slow the viewer
- **Use model transparency** — set the discipline you're reviewing to 100% opaque and others to 50% transparent

## Step 2: Navigate and Section the Model

The 3D Viewer includes standard navigation and sectioning tools:

### Navigation

- **Orbit**: Left-click and drag to rotate around the model
- **Pan**: Right-click and drag to pan
- **Zoom**: Scroll wheel to zoom in/out
- **Walk**: Use the Walk tool for first-person navigation (useful for interior review)

### Sectioning

1. Click **Section** in the toolbar.
2. Choose section type:
   - **Box Section**: Clip the model with a 3D box
   - **Plane Section**: Clip with a single plane
3. Adjust the section box/plane:
   - Drag the handles to resize
   - Rotate the section to any angle
4. Save the sectioned view as a Saved View.

### Measurement

1. Click **Measure** in the toolbar.
2. Click two points to measure distance.
3. Use **Measure Angle** for angular measurements.
4. Measurements display in the model's units (configure in project settings).

## Step 3: Create BCF Issues

Issue creation is the core coordination workflow in the 3D Viewer.

1. Navigate to the area you want to flag.
2. Use sectioning and measurement to identify the problem.
3. Click **Create Issue** (flag icon in the toolbar).
4. Fill in the issue form:
   - **Title**: Be specific (e.g., "Duct conflicts with structural beam at Grid B/Level 2")
   - **Description**: Detailed explanation of the issue
   - **Type**: Clash, Design Review, RFI, Note, Other
   - **Priority**: High, Medium, Low
   - **Assigned To**: Select a project member
   - **Due Date**: When resolution is expected
5. The current viewpoint (camera position, section, visibility) is automatically saved with the issue.
6. Click **Create**.

### Issue Quality Tips

- **Zoom in close** — the viewpoint should clearly show the problem area
- **Use sectioning** — section the model to isolate the issue from surrounding geometry
- **Highlight components** — click on the conflicting components before creating the issue; they're automatically referenced
- **Be specific in the title** — "Pipe P-08 clashes with cable tray at Grid C/Level 3" is actionable; "Clash" is not
- **Assign to one person** — shared assignment means no one takes responsibility

## Step 4: Review and Manage Issues

1. Click **Issues** in the left panel to see all project issues.
2. Filter by:
   - **Status**: Active, Resolved, Closed
   - **Assigned To**: Issues assigned to you
   - **Type**: Clash, Design Review, RFI
   - **Priority**: High, Medium, Low
3. Click an issue to navigate to its viewpoint.
4. Update issue status:
   - **Active**: Issue is open, needs resolution
   - **Resolved**: Fix has been implemented
   - **Closed**: Resolution verified
5. Add comments to provide updates or ask questions.

### Issue Workflow

1. **Coordinator creates issue** — assigned to the responsible discipline
2. **Resolver receives notification** — email notification with issue link
3. **Resolver opens issue** — clicks the link to open the 3D Viewer at the issue viewpoint
4. **Resolver fixes in their BIM tool** — updates the model in Revit, Tekla, etc.
5. **Resolver marks issue as Resolved** — adds a comment describing the fix
6. **Coordinator verifies** — checks the updated model and closes the issue

## Step 5: Run Clash Analysis (Desktop Only)

Clash analysis is available in Trimble Connect Desktop, not the web 3D Viewer.

1. Open **Trimble Connect Desktop**.
2. Load the federated model (multiple IFC files).
3. Go to **Clash Analysis** → **New Clash Set**.
4. Configure:
   - **Name**: e.g., "Structural vs MEP – Level 3"
   - **Model A**: Select one model (e.g., Structural)
   - **Model B**: Select another model (e.g., MEP)
   - **Tolerance**: Clash tolerance in mm (typically 5mm)
   - **Ignore**: Select component types to exclude (spaces, openings)
5. Click **Run**.
6. Results appear in the Clash Analysis panel.

### Working with Clash Results

1. Each clash shows:
   - **Clash ID**: Unique identifier
   - **Component A**: Element from Model A (with properties)
   - **Component B**: Element from Model B (with properties)
   - **Location**: Coordinates
2. Click a clash to navigate to it in the 3D view.
3. Right-click → **Create Issue** to create a BCF issue from the clash.
4. Select multiple clashes → **Batch Create Issues** for efficiency.

### Clash Analysis Limitations

- **No ruleset system** — unlike Solibri, you can't define complex checking rules
- **No clearance checks** — only hard clash detection, not minimum distance checks
- **No clash matrix** — can't define a matrix of discipline pairs to check
- **Basic filtering** — limited component filtering compared to Solibri
- **Desktop only** — not available in the web 3D Viewer

For advanced clash detection, use Solibri or Navisworks alongside Trimble Connect.

## Step 6: Export BCF Issues

1. In the Issues panel, select the issues to export.
2. Click **Export BCF**.
3. Choose BCF 2.1 format.
4. The BCF file can be imported into:
   - Revit (via BIMcollab or native BCF support in 2024+)
   - Tekla Structures (native BCF support)
   - Solibri (native BCF support)
   - Navisworks (native BCF support)
   - Archicad (native BCF support)

### BCF Import

1. Click **Import BCF** in the Issues panel.
2. Select a BCF file from another tool.
3. Issues are imported with their viewpoints and component references.
4. Note: If the BCF was created with a different coordinate system, viewpoints may not align correctly.

## Step 7: Create and Share Views

Saved views are useful for coordination meetings and design reviews:

1. Navigate to the desired view (set visibility, section, zoom).
2. Click **Save View**.
3. Name the view (e.g., "Level 3 – MEP Coordination Review").
4. The view is saved to the project and accessible by all team members.
5. Share the view link via email or chat — recipients click the link to open the exact view.

### Using Views in Coordination Meetings

1. **Pre-meeting**: Create saved views for each agenda item.
2. **During meeting**: Open each view in sequence to guide the discussion.
3. **Post-meeting**: Create issues from the views discussed and assign actions.

## Best Practices

- **Federate models weekly** — keep the coordination view up to date
- **Create issues from close-up viewpoints** — distant viewpoints are useless to resolvers
- **Use sectioning to isolate issues** — don't create issues from a full model view
- **Export BCF for non-Trimble users** — not everyone has Trimble Connect access
- **Archive resolved issues** — keep a record for audit and dispute resolution
- **Use Saved Views for meetings** — more efficient than navigating live during a meeting
- **Consider BIMcollab Zoom for advanced issue management** — if Trimble Connect's issue management is too basic for your needs
