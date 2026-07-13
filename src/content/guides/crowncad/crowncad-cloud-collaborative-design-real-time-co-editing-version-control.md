---
title: "CrownCAD Cloud Collaborative Design: Real-Time Co-Editing, Version Control, and Review"
excerpt: "Use CrownCAD's cloud collaboration features: real-time co-editing with parallel edit mode, co-follow mode for reviews, version control with branching, and online markup annotations for team design."
category: "deployment"
softwareSlug: "crowncad"
keyword: "crowncad cloud collaborative design real-time co-editing version control"
slug: "crowncad-cloud-collaborative-design-real-time-co-editing-version-control"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://www.crowncad.com/english/guide/cooperative.html"
  - "https://www.crowncad.com/english/guide/versions.html"
---

# CrownCAD Cloud Collaborative Design: Real-Time Co-Editing, Version Control, and Review

CrownCAD is a cloud-based 3D CAD platform that runs entirely in a web browser. Its defining feature is collaboration — multiple engineers can work on the same model simultaneously, with real-time updates and no file conflicts. This eliminates the traditional CAD workflow of sending files back and forth, dealing with version conflicts, and managing local PDM systems.

## What Makes CrownCAD Different

Traditional desktop CAD:
- Each engineer works on local files
- Files are shared via email, shared drives, or PDM systems
- Version conflicts are common ("V1", "V2", "Final", "Final_v2")
- Remote work requires VPN or remote desktop
- High-performance workstations required

CrownCAD cloud CAD:
- All data stored on cloud servers
- Multiple users edit the same model in real-time
- No files to send or sync — everyone sees the latest version
- Access from any device with a web browser (Chrome, Safari, Edge)
- Cloud servers handle the computational load

## Getting Started

### Accessing CrownCAD

1. Open a web browser (Chrome, Safari, or Edge)
2. Navigate to **www.crowncad.com**
3. Register or log in
4. The Project Management Interface appears

### Project Management Interface

From the main interface you can:
- **Create new projects** — for each part or assembly
- **Create documents** within projects: Part, Assembly, Drawing, Folder
- **Import existing CAD** — STEP, IGES, and mainstream CAD formats
- **Share models** — with users, teams, or via links
- **Access collaborative features** — co-editing, review, version control

## Collaboration Modes

### 1. Co-Follow Mode

Co-follow mode synchronizes views between users in real-time:

- **What one user sees, all connected users see**
- When one user rotates, zooms, or selects an element, all followers see the same view
- Ideal for:
  - **Teaching demonstrations** — instructor shows, students follow
  - **Live design reviews** — presenter walks through the model, reviewers follow
  - **Client presentations** — show the design in real-time without screen sharing

**Starting Co-Follow:**
1. Open a model
2. Click **Share** and invite users
3. Select **Co-Follow Mode**
4. Invited users join and follow the presenter's view

### 2. Parallel Edit Mode

Parallel edit mode is the most powerful collaboration feature:

- **Multiple users edit the same model simultaneously**
- Each user sees the other's changes in real-time
- No conflicts — CrownCAD manages concurrent edits
- Changes appear instantly without page reload or file reopening

**Example:** A structural engineer designs the frame system while a mechatronics engineer arranges sensor mounting positions on the same model. Each sees the other's modifications instantly.

**Starting Parallel Edit:**
1. Open a model
2. Click **Share** and invite users with edit permissions
3. Select **Parallel Edit Mode**
4. All users with edit access can work on the model simultaneously
5. Each user's cursor and selections are visible to others

### 3. Review Annotation Tools

For design reviews without editing:

1. **Open a model in review mode**
2. Use annotation tools:
   - **Highlight** — mark areas requiring modification
   - **Comment** — add comments attached to specific geometry
   - **Tag** — tag responsible engineers for follow-up
   - **Approve** — approve the design directly in the browser
3. Annotations are visible to all shared users
4. Engineers can address comments and mark them resolved

## Version Control

CrownCAD includes built-in version control that eliminates file conflicts.

### Revision History

1. Open the **Revision History Panel**
2. View all recorded operations:
   - Who made the change
   - When the change was made
   - What was changed
3. Click any checkpoint to inspect the model state at that historical stage
4. The model displays as it was at that point in time

### Creating Branches

1. Right-click a checkpoint in the revision history
2. Select **"Create Branch"**
3. The branch creates a parallel version from that point
4. Each branch supports independent modifications
5. Branches can be merged back or kept separate

### Branching Benefits

- **Maintain parallel design versions** within a single document
- **Explore alternatives** without losing the original design
- **Select any branch during assembly configuration** — use different branch versions in different assembly configurations
- **Compare versions** — see differences between branches

### Restoring Previous Versions

1. Open the Revision History
2. Navigate to the desired checkpoint
3. Click **Restore**
4. The model reverts to that version
5. The restore action itself is recorded in the history (no data is lost)

## Team Workspaces

### Team Setup

1. **Create a team** in the Project Management Interface
2. **Add team members** with email invitations
3. **Assign roles and permissions:**
   - **Admin** — full access, can manage members and settings
   - **Editor** — can create and modify designs
   - **Reviewer** — can view and annotate but not edit
   - **Viewer** — read-only access

### Team Project Governance

1. **Project Browser > Select team** — view all shared projects
2. **Project permissions** — control who can access each project
3. **Shared resources** — materials, features, and libraries shared across the team
4. **Activity tracking** — see who worked on what and when

## Permissions and Security

### Permission Levels

CrownCAD enables administrators to define detailed permissions:

- **Per-project permissions** — different access levels for different projects
- **Per-user permissions** — individual access control
- **Per-team permissions** — team-level access management
- **Document-level permissions** — control who can edit specific documents

### Data Security

- All data stored on cloud servers with encryption
- No local files to lose or steal
- Access controlled by authentication
- Audit trail of all actions
- Supports private cloud, public cloud, and hybrid cloud deployments

## Part Design in CrownCAD

### Sketching

1. Create a new Part document
2. Select a plane and enter sketch mode
3. Use sketch tools: line, arc, circle, rectangle, spline
4. Add constraints and dimensions
5. Exit sketch and use features (extrude, revolve, sweep, loft)

### Parametric and Direct Modeling

CrownCAD supports both:
- **Parametric modeling** — feature-based with history
- **Direct modeling** — modify geometry without history
- **Curve and surface geometry** — for complex shapes

## Common Issues

### Browser Performance

- Use Chrome or Edge for best performance
- Ensure hardware acceleration is enabled in browser settings
- Close unnecessary browser tabs
- For large assemblies, use a computer with adequate RAM

### Collaboration Conflicts

- CrownCAD manages concurrent edits, but avoid editing the exact same feature simultaneously
- Communicate with team members about who is working on what section
- Use review mode for discussion, edit mode for changes

### Internet Connection

- Cloud CAD requires a stable internet connection
- Work is saved automatically to the cloud
- If connection drops, CrownCAD reconnects when internet is restored

## Best Practices

- **Use co-follow for reviews** — more efficient than screen sharing
- **Use parallel edit for large assemblies** — assign sections to different engineers
- **Create branches for alternatives** — explore options without losing the main design
- **Set up team permissions early** — control access before sharing designs
- **Use review annotations** — more efficient than email for design feedback
- **Check revision history regularly** — understand what changes were made and by whom
- **Use the cloud advantage** — access from any device, collaborate with remote teams
- **Train the team** — cloud CAD workflow is different from desktop CAD
