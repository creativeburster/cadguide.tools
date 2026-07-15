---
title: "Solibri BCF Workflow: Exporting Issues to Revit, Archicad, and BIMcollab"
excerpt: "How to set up a BCF issue workflow between Solibri and BIM authoring tools — covering BCF export from Solibri, importing to Revit and Archicad, using BIMcollab for live sync, and tracking issue resolution status across platforms."
category: "workflow"
softwareSlug: "solibri"
keyword: "solibri bcf workflow export revit archicad bimcollab issue tracking"
slug: "solibri-bcf-workflow-export-revit-archicad-bimcollab"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-07-08"
sources:
  - "https://www.solibri.com/articles/leveraging-bim-solibri-model-checker"
  - "https://helpcenter.bimcollab.com/en/articles/356171-good-issue-management"
---

# Solibri BCF Workflow: Exporting Issues to Revit, Archicad, and BIMcollab

BCF (BIM Collaboration Format) is the bridge between Solibri and BIM authoring tools. Without a proper BCF workflow, issues found in Solibri sit in isolation — the design team never sees them, and clashes go unresolved. I've set up BCF workflows for dozens of projects, and the difference between a good workflow and a bad one is the difference between issues getting resolved and issues getting ignored.

## Understanding BCF

BCF is an open file format for exchanging BIM issues between different software. A BCF file contains:

- **Issue metadata**: Title, description, priority, status, assignee
- **Viewpoint**: Camera position, component references, visibility settings
- **Comments**: Discussion thread for each issue
- **Component references**: IFC global IDs linking issues to specific model elements

BCF 2.1 is the current standard, supported by Solibri, Revit (2024+), Archicad, Navisworks, BIMcollab, and many other BIM tools.

## BCF Workflow Options

There are three main BCF workflow patterns:

1. **File-based**: Export BCF from Solibri, import to Revit/Archicad, resolve, export back, import to Solibri
2. **BIMcollab-mediated**: Connect Solibri and Revit/Archicad to BIMcollab cloud platform for live issue sync
3. **ACC-mediated**: Export BCF from Solibri, import to ACC Model Coordination, sync with Revit via ACC

Each has trade-offs. File-based is simplest but manual. BIMcollab is most seamless but requires a subscription. ACC-mediated works if you're already in the Autodesk ecosystem.

## Option 1: File-Based BCF Workflow

### Step 1: Export BCF from Solibri

1. In Solibri, go to the **Results** view.
2. Select the issues to export (use Ctrl+click or Shift+click for multiple).
3. Right-click → **Export** → **BCF**.
4. Choose:
   - **Format**: BCF 2.1 (recommended for maximum compatibility)
   - **Export scope**: All issues, selected issues, or issues by status
   - **Include viewpoints**: Always yes — viewpoints are essential for the resolver to find the issue
5. Save the `.bcf` or `.bcfzip` file.

### Step 2: Import BCF to Revit

Revit 2024+ has native BCF support. For older versions, use a plugin.

#### Revit 2024+ (Native BCF)

1. Go to **Add-Ins** → **BIM Collaboration Format** → **Import BCF**.
2. Select the `.bcf` file from Solibri.
3. Issues appear in the BCF Issues panel.
4. Each issue shows:
   - Title and description
   - Viewpoint (click to navigate to the issue location in the model)
   - Status and assignee
   - Comments thread

#### Revit 2019-2023 (Plugin Required)

Use BIMcollab BCF Manager or BCFier:

1. Install the BCF Manager plugin (BIMcollab is free for basic use).
2. Go to **Add-Ins** → **BIMcollab BCF Manager**.
3. Click **Import BCF** and select the file.
4. Issues appear in the BCF Manager panel.

### Step 3: Resolve Issues in Revit

1. Select an issue in the BCF panel.
2. Click **Show** to navigate to the issue location.
3. Fix the issue in the Revit model (move a duct, resize a pipe, adjust a wall).
4. Update the issue status:
   - **Resolved**: You've fixed the issue in the model
   - **Won't Fix**: The issue is intentional or out of scope (add a comment explaining why)
5. Add a comment describing the resolution.
6. Save the Revit model.

### Step 4: Export Updated BCF from Revit

1. In the BCF panel, select the updated issues.
2. Click **Export BCF**.
3. Save the updated `.bcf` file.

### Step 5: Import Updated BCF to Solibri

1. In Solibri, go to **File** → **Import** → **BCF**.
2. Select the updated BCF file from Revit.
3. Solibri updates the issue statuses and comments.
4. Verify that resolved issues are actually fixed by re-running the check.

### File-Based Workflow Limitations

- **Manual file transfer**: Someone has to email or upload BCF files
- **Version confusion**: Multiple versions of the BCF file can circulate
- **No real-time updates**: Team members don't know about new issues until the file is shared
- **Status sync delays**: Resolution status may be outdated between exchanges

## Option 2: BIMcollab-Mediated Workflow

BIMcollab is a cloud platform for BCF issue management. It eliminates file transfer by syncing issues in real-time.

### Step 1: Set Up BIMcollab

1. Create a BIMcollab account at `bimcollab.com`.
2. Create a project in BIMcollab.
3. Invite team members.

### Step 2: Connect Solibri to BIMcollab

1. In Solibri, go to **File** → **Settings** → **BCF**.
2. Enter the BIMcollab server URL and project credentials.
3. Solibri connects to the BIMcollab project.
4. Issues created in Solibri are automatically synced to BIMcollab.

### Step 3: Connect Revit to BIMcollab

1. Install the BIMcollab BCF Manager plugin for Revit.
2. In the BCF Manager, click **Connect to BIMcollab**.
3. Enter the same project credentials.
4. Issues from Solibri appear in Revit automatically.

### Step 4: Resolve Issues in Real-Time

1. A clash is found in Solibri → issue appears in BIMcollab → issue appears in Revit.
2. The resolver fixes the issue in Revit → updates status in BCF Manager → status syncs to BIMcollab → status updates in Solibri.
3. The coordinator verifies the fix in Solibri → closes the issue → closure syncs back to Revit.

### BIMcollab Workflow Benefits

- **Real-time sync**: No file transfer needed
- **Single source of truth**: All issues live on BIMcollab server
- **Audit trail**: All changes are logged with timestamps and user info
- **Email notifications**: Team members get notified when issues are assigned or updated
- **Approval workflow**: Optional approval step before issues are closed

### BIMcollab Workflow Limitations

- **Subscription cost**: BIMcollab requires a paid subscription for larger teams
- **Internet dependency**: Requires constant internet connection
- **Plugin maintenance**: BCF Manager plugins need to be kept up to date

## Option 3: ACC-Mediated Workflow

If you're using Autodesk Construction Cloud, you can use ACC Model Coordination as the BCF hub.

1. Export BCF from Solibri.
2. Import BCF into ACC Model Coordination.
3. ACC Model Coordination syncs issues with Revit via Desktop Connector.
4. Resolvers fix issues in Revit and update status in ACC.
5. Export updated BCF from ACC and re-import to Solibri.

This is a hybrid approach — not as seamless as BIMcollab, but works if you're already invested in ACC.

## BCF Issue Quality Best Practices

A BCF issue is only useful if the resolver can understand and act on it. Here's what makes a good BCF issue:

### Issue Title
Be specific: "Duct D-12 conflicts with beam B-07 at Grid C/Level 3" — not "Clash found."

### Issue Description
Include: what the clash is, which disciplines are involved, what the expected resolution is.

### Viewpoint
The viewpoint should zoom directly to the clash location with the conflicting components highlighted. Don't create issues from a distant view — zoom in close.

### Component References
Ensure the BCF file includes IFC global IDs for the conflicting components. This allows the resolver to click and find the exact elements in their BIM tool.

### Priority
Use priority consistently:
- **Critical**: Structural safety, code violation
- **High**: Major coordination issue (duct through beam)
- **Medium**: Minor coordination issue (clearance violation)
- **Low**: Cosmetic or non-critical issue

### Assignment
Assign to a specific person, not a team. "Assigned to John Smith" is actionable. "Assigned to MEP Team" is not.

## Common BCF Issues and Fixes

### Issues Don't Appear in Revit

1. Check BCF version — Revit 2024+ supports BCF 2.1 natively. Older versions need a plugin.
2. Verify the BCF file isn't corrupted — try opening it in a BCF viewer.
3. Check that component references use IFC global IDs, not internal IDs.

### Viewpoints Show Wrong Location

1. Verify all models share the same coordinate system.
2. Check that the IFC export from Revit preserves coordinates correctly.
3. Use shared coordinates in Revit, not project coordinates.

### Status Updates Don't Sync

1. In file-based workflow: ensure you're importing the latest BCF file, not an old version.
2. In BIMcollab workflow: check internet connection and BIMcollab server status.
3. Verify that the BCF file includes status updates, not just new issues.

## Best Practices

- **Use BCF 2.1** — it's the most widely supported version
- **Create issues from close-up viewpoints** — distant viewpoints are useless to the resolver
- **Include component references** — link issues to specific IFC elements
- **Assign to specific people** — not teams
- **Add descriptive comments** — explain what needs to be done
- **Close issues promptly** — don't leave resolved issues open for weeks
- **Use BIMcollab for large teams** — file-based workflow doesn't scale beyond 5-6 people
- **Archive BCF files** — keep a record of all issues for post-construction disputes
