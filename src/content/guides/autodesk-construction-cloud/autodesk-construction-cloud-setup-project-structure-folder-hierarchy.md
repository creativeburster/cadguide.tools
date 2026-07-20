---
title: "Autodesk Construction Cloud Setup: Project Structure and Folder Hierarchy Best Practices"
excerpt: "How to set up Autodesk Construction Cloud (ACC) projects for BIM collaboration — covering project templates, folder hierarchy, permission models, Docs vs Design Collaboration vs Model Coordination modules, and avoiding common setup mistakes."
category: "deployment"
softwareSlug: "autodesk-construction-cloud"
keyword: "autodesk construction cloud setup project structure folder hierarchy"
slug: "autodesk-construction-cloud-setup-project-structure-folder-hierarchy"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-07-08"
sources:
  - "https://forums.autodesk.com/t5/bim-360-support-forum/bim360-best-practice-setups/td-p/10806318"
  - "https://forums.autodesk.com/t5/bim-360-support-forum/central-model-cloud-workflow/td-p/9105361"
---

# Autodesk Construction Cloud Setup: Project Structure and Folder Hierarchy Best Practices

We've set up ACC (formerly BIM 360) for projects ranging from small office buildings to large infrastructure projects. The setup you choose on day one determines whether your team collaborates smoothly or fights the system for the next two years. We've seen projects where the folder structure was so bad that teams stopped using ACC entirely and went back to network drives. Here's how to do it right.

## Understanding ACC Modules

ACC is not a single tool — it's a platform with multiple modules:

- **Docs**: Document management, version control, and sharing
- **Design Collaboration**: Revit model sharing between teams
- **Model Coordination**: Clash detection and issue tracking
- **Build**: Construction management (RFIs, submittals, daily reports)
- **Takeoff**: Quantity takeoff from models
- **Cost Management**: Budget tracking

For BIM collaboration, the three critical modules are Docs, Design Collaboration, and Model Coordination. Most setup mistakes happen here.

## Step 1: Create the Project

1. Log in to ACC at `construction.autodesk.com`.
2. Click **New Project**.
3. Choose a project template (if your company has one) or start from scratch.
4. Set the project name, location, and timezone.

### Project Naming

Use a consistent naming convention across your company:
- `[Project Number]-[Project Name]` (e.g., `2026-001-Downtown-Office`)
- Avoid special characters and spaces in project names
- Keep it short — long names make navigation painful

## Step 2: Design the Folder Hierarchy

The folder structure is the backbone of your ACC project. A bad structure causes confusion, permission issues, and lost files.

### Recommended Structure

```
Project Files/
├── 00-Project Management/
│   ├── 01-Contracts/
│   ├── 02-Schedules/
│   └── 03-Meeting Minutes/
├── 01-Design/
│   ├── 01-Architecture/
│   │   ├── 01-Revit Models/
│   │   ├── 02-CAD Files/
│   │   └── 03-Reference/
│   ├── 02-Structural/
│   │   ├── 01-Revit Models/
│   │   └── 02-CAD Files/
│   ├── 03-MEP/
│   │   ├── 01-Mechanical/
│   │   ├── 02-Electrical/
│   │   └── 03-Plumbing/
│   └── 04-Civil/
├── 02-Shared Models/
│   ├── 01-Architecture/
│   ├── 02-Structural/
│   └── 03-MEP/
├── 03-Coordination/
│   ├── 01-NWD Models/
│   ├── 02-Clash Reports/
│   └── 03-BCF Issues/
└── 04-Construction/
    ├── 01-Shop Drawings/
    ├── 02-As-Builts/
    └── 03-O&M Manuals/
```

### Folder Structure Principles

- **Number prefixes** — forces sort order and makes navigation predictable
- **Discipline separation** — each discipline has its own folder tree
- **Shared Models folder** — for published models consumed by other teams
- **Coordination folder** — for Navisworks models and clash reports
- **Keep it shallow** — don't go more than 4 levels deep

## Step 3: Configure Permissions

ACC uses role-based permissions. Getting this wrong is the most common cause of ACC problems.

### Permission Roles

- **Project Admin**: Full access to all settings and files
- **Project Manager**: Manage files and folders, invite members
- **Editor**: Upload and edit files in assigned folders
- **Reviewer**: View and comment on files
- **Viewer**: View files only

### Permission Strategy

1. **Set folder-level permissions** — not project-level. Different teams need access to different folders.
2. **Use groups** — create groups for each discipline (Architecture, Structural, MEP, Contractor)
3. **Assign group permissions per folder** — e.g., Architecture group has Editor access to Architecture folders, Viewer access to Structural folders
4. **Restrict Shared Models** — only the BIM Manager should have Editor access to the Shared Models folder

### Common Permission Mistakes

**Everyone is Project Admin**: This is the most dangerous mistake. Anyone can delete folders, change settings, or revoke access. Limit Project Admin to 1-2 people.

**Contractors have edit access to design folders**: Contractors should have Viewer access to design models, not Editor. They should only edit their own shop drawing folders.

**No group management**: Assigning permissions to individuals instead of groups makes management a nightmare as the team grows.

## Step 4: Set Up Design Collaboration

Design Collaboration is where Revit models are shared between teams.

1. Go to **Design Collaboration** module.
2. Create **Workspaces** for each discipline:
   - Architecture Workspace
   - Structural Workspace
   - MEP Workspace
3. Each workspace has:
   - **Shared folder**: Where the team publishes their model for others to consume
   - **Consumed folder**: Where other teams' models are cached for linking

### Setting Up Model Sharing

1. In each workspace, configure the **Share Settings**:
   - Which models to share (usually the latest published Revit model)
   - Sharing frequency (automatic on publish, or manual)
2. Configure **Consumption Settings**:
   - Which other workspaces' models to consume
   - Auto-update when new versions are published

### Common Design Collaboration Issues

**Revit models won't link**: The model hasn't been published to the Shared folder. The team needs to use **Collaborate → Publish Model** in Revit.

**Outdated linked models**: The consuming team hasn't refreshed. Use **Manage Cloud Models → Refresh** in Revit.

**Bridge project sync issues**: When using ACC Bridge to share models between different ACC accounts, automatic sync may fail. Check the Bridge settings and ensure both accounts have the correct permissions.

## Step 5: Set Up Model Coordination

Model Coordination is for clash detection and issue tracking.

1. Go to **Model Coordination** module.
2. Upload or federate models from Design Collaboration.
3. Set up **Clash Detection**:
   - Configure clash tests (e.g., Structural vs MEP, Architecture vs MEP)
   - Set tolerance values
   - Run automated clash detection on model updates
4. Configure **Issue Management**:
   - Create issue types (Clash, Design Review, RFIs)
   - Assign issues to team members
   - Track issue status (Open, In Progress, Resolved, Closed)

## Step 6: Configure Desktop Connector

Desktop Connector allows local access to ACC files from Windows Explorer and Revit.

1. Download and install **Autodesk Desktop Connector**.
2. Sign in with your ACC account.
3. Map the ACC project folders to local drive letters.
4. Configure **sync settings**:
   - Automatic sync (recommended for active projects)
   - Manual sync (for large projects with bandwidth concerns)

### Desktop Connector Issues

**Files not syncing**: Check the Desktop Connector icon in the system tray. If it shows errors, right-click → **Troubleshoot**.

**Revit can't find linked models**: Ensure Desktop Connector is running and the mapped drive is accessible. Revit linked models from ACC require Desktop Connector to be active.

## Best Practices

- **Create a project template** — save your folder structure, permissions, and module settings as a template for future projects
- **Document the setup** — create a project BIM manual explaining the folder structure and workflow
- **Train the team** — don't assume everyone knows ACC. Run a kickoff session explaining the workflow
- **Review permissions monthly** — remove access for team members who left the project
- **Monitor storage usage** — ACC has storage limits depending on your subscription tier
- **Use the ACC API for automation** — automate model publishing, clash detection, and reporting
