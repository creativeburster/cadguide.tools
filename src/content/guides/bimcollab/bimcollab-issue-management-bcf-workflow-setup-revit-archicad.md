---
title: "BIMcollab Issue Management: Setting Up BCF Workflows for Multi-Discipline BIM Coordination"
excerpt: "How to set up BIMcollab for cloud-based BCF issue management — covering project setup, BCF Manager plugin installation for Revit and Archicad, issue creation workflow, approval processes, and team onboarding best practices."
category: "deployment"
softwareSlug: "bimcollab"
keyword: "bimcollab issue management bcf workflow setup revit archicad"
slug: "bimcollab-issue-management-bcf-workflow-setup-revit-archicad"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-07-08"
sources:
  - "https://helpcenter.bimcollab.com/en/articles/356171-good-issue-management"
  - "https://helpcenter.bimcollab.com/en/articles/342140-set-up-the-bcf-managers"
---

# BIMcollab Issue Management: Setting Up BCF Workflows for Multi-Discipline BIM Coordination

BIMcollab is the most widely used cloud platform for BCF issue management. I've set it up for projects with 50+ team members across 5 disciplines. When configured correctly, it creates a seamless issue workflow between Solibri, Revit, Archicad, and Navisworks. When configured poorly, it creates chaos. Here's how to do it right.

## Understanding BIMcollab's Role

BIMcollab is not a BIM authoring tool or a clash detection tool. It's a **BCF issue management platform** that sits between your BIM tools:

- **Solibri** finds clashes → creates issues → syncs to BIMcollab
- **BIMcollab** stores issues → notifies assignees → tracks status
- **Revit** receives issues via BCF Manager → designer fixes → updates status → syncs back to BIMcollab
- **Solibri** receives status updates → coordinator verifies → closes issues

BIMcollab is the hub. All BIM tools connect to it via BCF (BIM Collaboration Format).

## BIMcollab Products

BIMcollab offers several products:

- **BIMcollab Cloud**: Cloud-hosted BCF issue management platform
- **BIMcollab Nexus**: On-premise BCF server for enterprise
- **BIMcollab Zoom**: Free model viewer with BCF issue management
- **BCF Managers**: Free plugins for Revit, Archicad, Navisworks, and other BIM tools

For most projects, BIMcollab Cloud + BCF Managers is the right combination.

## Step 1: Create a BIMcollab Project

1. Sign up at `bimcollab.com`.
2. Create a new project:
   - **Project Name**: Match your BIM project name
   - **Project Number**: For reference
   - **Project Type**: Building, Infrastructure, Industrial
3. Configure project settings:
   - **Time Zone**: Match the project time zone
   - **Issue Numbering**: Auto-incrementing (recommended)
   - **Custom Fields**: Add project-specific fields (e.g., Building Area, Floor, Discipline)

### Custom Fields Configuration

Custom fields help filter and sort issues:

1. Go to **Project Settings** → **Issue Fields**.
2. Add custom fields:
   - **Discipline**: Dropdown (Architecture, Structural, MEP, Civil)
   - **Building**: Dropdown (Building A, Building B, etc.)
   - **Floor**: Dropdown (B1, L1, L2, L3, Roof)
   - **Meeting Date**: Date field (when the issue will be discussed)
3. Set field requirements:
   - **Mandatory**: Must be filled when creating an issue
   - **Optional**: Can be left empty

## Step 2: Invite Team Members

1. Go to **Project Settings** → **Members**.
2. Invite team members by email.
3. Assign roles:
   - **Project Leader**: Full project management, can configure settings and close issues
   - **Editor**: Can create, edit, and resolve issues
   - **Reviewer**: Can view and comment on issues, can't edit
   - **Viewer**: Can view issues only

### Role Assignment Strategy

- **BIM Coordinator**: Project Leader
- **Discipline Leads**: Editor
- **Designers**: Editor
- **Client Representatives**: Reviewer
- **Contractors**: Editor (for construction issues) or Reviewer (for design issues)

## Step 3: Install BCF Managers

BCF Managers are free plugins that connect BIM tools to BIMcollab.

### Revit BCF Manager

1. Download from `bimcollab.com/downloads`.
2. Close Revit.
3. Run the installer (select your Revit version).
4. Open Revit — the BIMcollab tab appears.
5. Go to **BIMcollab** tab → **BCF Manager**.
6. Click **Connect** → enter your BIMcollab credentials.
7. Select the project.

### Archicad BCF Manager

1. Download from `bimcollab.com/downloads`.
2. Close Archicad.
3. Run the installer.
4. Open Archicad — the BIMcollab palette appears.
5. Connect to your BIMcollab project.

### Navisworks BCF Manager

1. Download from `bimcollab.com/downloads`.
2. Close Navisworks.
3. Run the installer.
4. Open Navisworks — the BIMcollab tab appears.
5. Connect to your BIMcollab project.

### Solibri Direct Connection

Solibri connects to BIMcollab natively (no plugin needed):

1. In Solibri, go to **File** → **Settings** → **BCF**.
2. Enter the BIMcollab server URL.
3. Authenticate with BIMcollab credentials.
4. Select the project.

## Step 4: Configure Issue Workflow

### Basic Workflow (Default)

1. **Active**: Issue is open, needs resolution
2. **Resolved**: Fix has been implemented
3. **Closed**: Resolution verified by the coordinator

### Approval Workflow (Advanced)

For more formal projects, enable the approval workflow:

1. Go to **Project Settings** → **Approval Workflow**.
2. Enable **Use Approval Workflow**.
3. This adds a **To Approve** status between Resolved and Closed.
4. Workflow becomes:
   - **Active** → designer works on the issue
   - **Resolved** → designer marks as fixed
   - **To Approve** → automatically assigned to approvers for review
   - **Resolved, Approved** → approver confirms the fix
   - **Closed** → coordinator closes the issue

### Approval Workflow Setup

1. When creating an issue, assign:
   - **Assigned To**: The person who will resolve the issue
   - **Approval**: The person(s) who will verify the resolution
2. When the resolver marks the issue as **Resolved**, it automatically changes to **To Approve** for the approver.
3. The approver receives a notification.
4. The approver can:
   - **Approve**: Status changes to **Resolved, Approved**
   - **Reject**: Status changes back to **Active**
5. Only approved issues can be **Closed**.

### Limiting Who Can Close Issues

By default, anyone can close issues. For formal projects:

1. Go to **Project Settings** → **Issue Management**.
2. Enable **Limit Team Members from Closing Issues**.
3. Only Project Leaders can close issues.
4. This ensures the coordinator verifies every resolution.

## Step 5: Create Issues from BIM Tools

### From Solibri

1. Run clash detection in Solibri.
2. Select a clash result.
3. Right-click → **Create Issue**.
4. The issue is created in Solibri with a viewpoint.
5. Solibri syncs the issue to BIMcollab automatically.
6. The assigned team member receives an email notification.

### From Revit (via BCF Manager)

1. In Revit, navigate to the problem area in the model.
2. In the BCF Manager, click **New Issue**.
3. Fill in:
   - **Title**: Clear description
   - **Description**: Detailed explanation
   - **Type**: Clash, Design Review, RFI, Note
   - **Assigned To**: Responsible person
   - **Priority**: High, Medium, Low
4. The current Revit view becomes the issue viewpoint.
5. Click **Create** — the issue syncs to BIMcollab.

### From Navisworks (via BCF Manager)

1. In Navisworks, navigate to the clash location.
2. In the BCF Manager, click **New Issue**.
3. Fill in the issue details.
4. The Navisworks viewpoint becomes the issue viewpoint.
5. Click **Create** — syncs to BIMcollab.

### Importing Navisworks Clashes in Bulk

The BCF Manager for Navisworks supports bulk import:

1. Run Clash Detective in Navisworks.
2. Select multiple clashes.
3. In the BCF Manager, click **Import from Clash Detective**.
4. All selected clashes are imported as BIMcollab issues.
5. Metadata (clash status, clash point, assigned to) is automatically added.

## Step 6: Resolve Issues in BIM Tools

### In Revit

1. Open the BCF Manager in Revit.
2. Filter issues by **Assigned To Me**.
3. Click an issue to navigate to its viewpoint in the Revit model.
4. Fix the issue in Revit (move a duct, resize a pipe, adjust a wall).
5. In the BCF Manager, update the issue:
   - **Status**: Resolved
   - **Comment**: Describe the fix
6. Click **Sync** — the status updates in BIMcollab.

### In Archicad

1. Open the BIMcollab palette in Archicad.
2. Filter issues by assignment.
3. Click an issue to navigate to its viewpoint.
4. Fix the issue in Archicad.
5. Update status and add a comment.
6. Sync to BIMcollab.

## Step 7: Monitor and Report

### Dashboard

BIMcollab's dashboard shows:
- **Total issues by status**: Active, Resolved, Closed
- **Issues by discipline**: Which team has the most open issues
- **Issues by priority**: How many high-priority issues are open
- **Resolution time**: Average time from creation to closure
- **Issue trend**: Are issues being resolved faster than they're created?

### Weekly Coordination Meeting

1. **Before the meeting**: Export the issue list filtered by Active status.
2. **During the meeting**: Review new issues, discuss stuck issues, assign actions.
3. **After the meeting**: Update issue assignments and due dates in BIMcollab.

## Best Practices

- **Create issues from close-up viewpoints** — distant viewpoints are useless to resolvers
- **Assign to specific people** — not teams
- **Use custom fields consistently** — discipline, floor, building for filtering
- **Enable the approval workflow for formal projects** — prevents unverified closures
- **Limit closing to Project Leaders** — ensures coordinator verification
- **Sync regularly** — at least daily, ideally after each fix
- **Use bulk import from Navisworks** — don't create clashes one by one
- **Train the team on BCF Managers** — the workflow only works if everyone uses it
- **Don't use email for issue communication** — all communication should be in BIMcollab comments
- **Archive completed projects** — export all issues before archiving for audit trail
