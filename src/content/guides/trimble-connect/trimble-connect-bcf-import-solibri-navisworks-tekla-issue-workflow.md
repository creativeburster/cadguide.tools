---
title: "Trimble Connect BCF Workflow: Importing Issues from Solibri and Navisworks for Tekla Teams"
excerpt: "How to set up a BCF issue workflow between Trimble Connect and coordination tools — covering BCF import from Solibri and Navisworks, issue resolution in Tekla Structures, and status sync back to the coordination platform."
category: "workflow"
softwareSlug: "trimble-connect"
keyword: "trimble connect bcf import solibri navisworks tekla issue workflow"
slug: "trimble-connect-bcf-import-solibri-navisworks-tekla-issue-workflow"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-08"
sources:
  - "https://community.trimble.com/communities/community-homepage/digestviewer/viewthread?GroupId=607&MID=35603&CommunityKey=48f38a6e-5abb-4ba1-8880-972ff53882ff"
  - "https://community.trimble.com/communities/community-homepage/digestviewer/viewthread?GroupId=607&MID=34669&CommunityKey=48f38a6e-5abb-4ba1-8880-972ff53882ff&tab=digestviewer"
---

# Trimble Connect BCF Workflow: Importing Issues from Solibri and Navisworks for Tekla Teams

On most BIM projects, the coordinator runs clash detection in Solibri or Navisworks, but the steel team works in Tekla Structures. Without a BCF workflow, issues found in coordination never reach the Tekla team — or they reach them as screenshots in an email, which is useless. I've set up BCF workflows specifically for Tekla teams using Trimble Connect as the bridge. Here's how.

## The BCF Bridge Concept

The workflow looks like this:

1. **Coordinator** runs clash detection in Solibri or Navisworks
2. **Coordinator** exports BCF issues
3. **Coordinator** imports BCF into Trimble Connect
4. **Tekla team** sees issues in Trimble Connect (web or desktop)
5. **Tekla team** resolves issues in Tekla Structures
6. **Tekla team** updates issue status in Trimble Connect
7. **Coordinator** exports updated BCF back to Solibri/Navisworks
8. **Coordinator** verifies and closes issues

Trimble Connect acts as the BCF hub — accessible by both the coordination team and the Tekla team.

## Step 1: Export BCF from Solibri

1. In Solibri, select the issues to export.
2. Go to **File** → **Export** → **BCF**.
3. Choose **BCF 2.1** format.
4. Configure export options:
   - **Include viewpoints**: Yes (essential)
   - **Include component references**: Yes (links issues to IFC elements)
   - **Include comments**: Yes
5. Save as `.bcfzip` file.

### Solibri BCF Export Tips

- **Filter before exporting** — only export Active issues, not Closed ones
- **Group by discipline** — export separate BCF files per discipline for easier assignment
- **Verify viewpoints** — open a few issues in Solibri before exporting to confirm viewpoints are clear

## Step 2: Export BCF from Navisworks

1. In Navisworks, open the Clash Detective results.
2. Select the clashes to export.
3. Go to **Output** → **Export BCF**.
4. Choose BCF 2.1 format.
5. Configure:
   - **Include viewpoints**: Yes
   - **Include clash details**: Yes
6. Save the BCF file.

### Navisworks BCF Export Tips

- **Group clashes by discipline** — export separate BCF files for structural vs MEP issues
- **Filter resolved clashes** — only export Active clashes
- **Add descriptions** — Navisworks clash descriptions are minimal; add context before exporting

## Step 3: Import BCF into Trimble Connect

1. Log in to Trimble Connect at `app.connect.trimble.com`.
2. Open the project and navigate to the Issues panel.
3. Click **Import BCF**.
4. Select the BCF file from Solibri or Navisworks.
5. Trimble Connect processes the BCF and creates issues.
6. Each issue includes:
   - Title, description, and priority from the source tool
   - Viewpoint (camera position and component highlights)
   - Component references (IFC global IDs)
   - Comments from the source tool

### Common Import Issues

**Viewpoints show wrong location**: The coordinate systems don't match. Ensure the IFC models in Trimble Connect use the same coordinates as the models in Solibri/Navisworks.

**Snapshots missing**: Some BCF implementations don't include bitmap snapshots. Trimble Connect will still show the 3D viewpoint, but without a thumbnail image. This is a known limitation when importing from certain tools.

**Component references don't highlight**: The IFC global IDs in the BCF don't match the IFC models in Trimble Connect. This happens when models are re-exported with different IFC settings. Re-export with consistent IFC settings.

## Step 4: Assign Issues to Tekla Team Members

1. In the Trimble Connect Issues panel, review imported issues.
2. For each issue:
   - **Verify the viewpoint** — click the issue to open the 3D Viewer at the issue location
   - **Assign to the responsible person** — select a Tekla team member
   - **Set priority** — adjust if the coordinator's priority doesn't match your project's criteria
   - **Set due date** — based on the coordination schedule
3. The assigned team member receives an email notification.

### Assignment Best Practices

- **Assign to specific people** — not "Structural Team"
- **Set realistic due dates** — typically 1 week for resolution
- **Group by area** — assign all issues in one area to the same person for efficiency
- **Add context comments** — the coordinator's description may not be clear to the Tekla team; add clarification

## Step 5: Resolve Issues in Tekla Structures

Tekla Structures has native BCF support, but the workflow depends on your Tekla version and setup.

### Option A: Direct BCF Import to Tekla

1. In Tekla Structures, go to **Window** → **BCF Manager** (or **Side Pane** → **BCF**).
2. Click **Import BCF**.
3. Select the BCF file exported from Trimble Connect.
4. Issues appear in the BCF Manager panel.
5. Click an issue to navigate to its location in the Tekla model.
6. Fix the issue in Tekla (modify the steel member, adjust connections, move bolts).
7. Update the issue status in the BCF Manager:
   - **Resolved**: Fix implemented
   - **Won't Fix**: Issue is intentional (add comment explaining why)
8. Add a comment describing the resolution.
9. Export the updated BCF from Tekla.

### Option B: Use Trimble Connect Desktop

1. Open Trimble Connect Desktop.
2. View issues in the Issues panel.
3. Click an issue to navigate to the model location.
4. Switch to Tekla Structures and fix the issue.
5. Return to Trimble Connect Desktop and update the issue status.

### Option C: Use Trimble Connect Web

1. Open Trimble Connect in a browser.
2. Go to the Issues panel.
3. Click an issue to open the 3D Viewer.
4. Review the issue in the 3D Viewer.
5. Switch to Tekla Structures and fix the issue.
6. Return to the web browser and update the issue status.

### Which Option to Use

- **Option A (Direct BCF)**: Best for Tekla users who want issues inside Tekla. Requires manual BCF file transfer.
- **Option B (Desktop)**: Best for Tekla users who also use Trimble Connect Desktop. No BCF file transfer needed.
- **Option C (Web)**: Best for occasional users who don't need Tekla integration. Simplest but requires switching between applications.

## Step 6: Sync Status Back to Coordination Tool

After Tekla team resolves issues, the coordinator needs to verify:

### File-Based Sync

1. Export updated BCF from Trimble Connect (Issues → Export BCF).
2. Import the BCF into Solibri or Navisworks.
3. The coordinator sees updated statuses and comments.
4. Coordinator verifies fixes in the coordination model.
5. Coordinator closes verified issues.

### Using BIMcollab as a Live Sync Alternative

If file-based BCF exchange is too slow:

1. Connect Trimble Connect to BIMcollab (if supported in your version).
2. Connect Solibri to the same BIMcollab project.
3. Issues sync in real-time between all platforms.
4. No BCF file transfer needed.

This requires a BIMcollab subscription but eliminates the manual file exchange.

## Step 7: Verify and Close

The coordinator's verification step is critical:

1. **Re-run clash detection** in Solibri/Navisworks with the updated Tekla model.
2. **Check if the clash is actually resolved** — sometimes the Tekla team marks an issue as resolved but the clash still exists.
3. **Close the issue** if the fix is confirmed.
4. **Reopen the issue** if the fix is insufficient — add a comment explaining what's still wrong.

## Common Workflow Issues

### Tekla Team Ignores BCF Issues

This is a process problem, not a technical one. Solutions:
- **Include BCF review in weekly meetings** — make issue resolution a standing agenda item
- **Track resolution metrics** — publish weekly reports showing open issues by team
- **Escalate to project management** — if a team consistently ignores issues, escalate

### BCF Files Get Lost in Email

Don't send BCF files via email. Use Trimble Connect as the single source of truth:
- Import BCF to Trimble Connect
- Notify team members via Trimble Connect's assignment system
- All status updates happen in Trimble Connect
- Export BCF only for the coordinator's verification step

### Coordinate Systems Don't Match

If viewpoints are in the wrong location:
1. Check the IFC export coordinate system in Tekla — use the same survey point as other disciplines
2. Verify the IFC models in Trimble Connect are using the same coordinate system
3. In Solibri/Navisworks, ensure models are loaded with the same coordinates

## Best Practices

- **Use Trimble Connect as the BCF hub** — not email, not shared drives
- **Assign issues to specific Tekla team members** — not to the team
- **Set weekly resolution targets** — don't let issues accumulate
- **Verify before closing** — always re-run clash detection to confirm fixes
- **Archive BCF files** — keep records for post-construction disputes
- **Train the Tekla team on BCF Manager** — don't assume they know how to use it
- **Use BIMcollab for large teams** — file-based BCF doesn't scale beyond 5-6 people
