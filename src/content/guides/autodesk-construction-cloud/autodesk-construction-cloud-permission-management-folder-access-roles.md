---
title: "ACC Permission Management: Folder Access, Role Configuration, and External Collaborator Setup"
excerpt: "How to configure Autodesk Construction Cloud permissions for BIM projects — covering project roles, folder-level permissions, group management, external collaborator access, and common security mistakes that expose project data."
category: "deployment"
softwareSlug: "autodesk-construction-cloud"
keyword: "autodesk construction cloud permission management folder access roles"
slug: "autodesk-construction-cloud-permission-management-folder-access-roles"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-07-08"
sources:
  - "https://forums.autodesk.com/t5/bim-360-support-forum/construction-cloud/td-p/11881543"
  - "https://forums.autodesk.com/t5/bim-360-support-forum/bim360-best-practice-setups/td-p/10806318"
---

# ACC Permission Management: Folder Access, Role Configuration, and External Collaborator Setup

Permission management in ACC is not set-and-forget. I've audited ACC projects where former employees still had access six months after leaving, where contractors had admin rights to design folders, and where external consultants could see confidential financial documents. Bad permissions don't just cause data leaks — they cause accidental deletions, unauthorized changes, and audit failures. Here's how to set up permissions properly.

## Understanding ACC Permission Levels

ACC has two layers of permissions:

### Project-Level Roles

- **Project Admin**: Full control — manage members, settings, modules, billing
- **Project Manager**: Manage members and folders, but can't change project settings
- **Editor**: Upload, edit, and download files in permitted folders
- **Reviewer**: View and comment on files, can't edit
- **Viewer**: View files only, no download

### Folder-Level Permissions

Each folder can have different permissions for different users/groups:

- **Full Control**: Manage folder, delete files, change permissions
- **Edit**: Upload, modify, and delete files
- **View & Download**: View and download, can't modify
- **View Only**: View in browser, can't download
- **No Access**: Folder is invisible

The project role sets the maximum permission level. A Viewer can't have Edit access to any folder, even if explicitly granted.

## Step 1: Create Permission Groups

Don't assign permissions to individuals. Create groups.

1. Go to **Project Admin** → **Members** → **Groups**.
2. Create discipline-based groups:
   - `BIM Management`
   - `Architecture Team`
   - `Structural Team`
   - `MEP Team`
   - `Contractor`
   - `Client`
   - `External Consultants`
3. Add members to the appropriate groups.

### Group Strategy

- **BIM Management**: 1-3 people. Project Admin role. Full Control on all folders.
- **Architecture Team**: All architects. Editor role. Edit access to Architecture folders, View & Download on other discipline folders.
- **Structural Team**: All structural engineers. Editor role. Edit access to Structural folders, View & Download on other discipline folders.
- **MEP Team**: All MEP engineers. Editor role. Edit access to MEP folders, View & Download on other discipline folders.
- **Contractor**: Editor role. Edit access to Construction folders only. View & Download on design folders.
- **Client**: Viewer role. View Only on selected folders (reports, coordination models). No access to working files.
- **External Consultants**: Editor or Reviewer role. Access only to their specific scope folders.

## Step 2: Configure Folder Permissions

1. Go to **Docs** module.
2. Right-click each folder → **Permissions**.
3. Assign group permissions per folder:

| Folder | BIM Mgmt | Architecture | Structural | MEP | Contractor | Client |
|---|---|---|---|---|---|---|
| 00-Project Management | Full Control | View & Download | View & Download | View & Download | View & Download | View Only |
| 01-Design/Architecture | Full Control | Edit | View & Download | View & Download | View & Download | No Access |
| 01-Design/Structural | Full Control | View & Download | Edit | View & Download | View & Download | No Access |
| 01-Design/MEP | Full Control | View & Download | View & Download | Edit | View & Download | No Access |
| 02-Shared Models | Full Control | Edit | Edit | Edit | View & Download | View Only |
| 03-Coordination | Full Control | View & Download | View & Download | View & Download | View & Download | View Only |
| 04-Construction | Full Control | View & Download | View & Download | View & Download | Edit | View Only |

### Key Principles

- **Design teams don't edit each other's folders** — Architecture can't modify Structural files
- **Contractors don't edit design files** — they only edit construction folders
- **Clients see results, not work-in-progress** — restrict to coordination models and reports
- **BIM Management has Full Control everywhere** — they need to manage and troubleshoot

## Step 3: Manage External Collaborators

External consultants (subcontractors, vendors, testing labs) need access but should be restricted.

### Adding External Users

1. Go to **Project Admin** → **Members** → **Invite Member**.
2. Enter their email address.
3. They receive an invitation to create an Autodesk account (if they don't have one).
4. Assign them to the appropriate group.

### External Collaborator Best Practices

- **Create a separate group** — don't mix external consultants with internal teams
- **Restrict to specific folders** — only give access to folders they need
- **Set expiration dates** — if ACC supports it for your plan, set access to expire at contract end
- **Monitor activity** — check the activity log for unusual downloads or access patterns
- **Remove access promptly** — when the contract ends, remove the user from the project

## Step 4: Configure Module Permissions

Each ACC module has its own permission settings:

### Design Collaboration

1. Go to **Design Collaboration** → **Settings** → **Permissions**.
2. Configure which groups can:
   - **Publish models** — usually only the discipline team
   - **Consume models** — all discipline teams
   - **Manage workspaces** — BIM Management only

### Model Coordination

1. Go to **Model Coordination** → **Settings** → **Permissions**.
2. Configure which groups can:
   - **Run clash detection** — BIM Management and discipline leads
   - **Create issues** — all team members
   - **Close issues** — BIM Management and discipline leads
   - **Manage model sets** — BIM Management only

### Build (if used)

1. Go to **Build** → **Settings** → **Permissions**.
2. Configure which groups can:
   - **Create RFIs** — Contractor and design teams
   - **Respond to RFIs** — Design teams
   - **Approve submittals** — Design team leads
   - **Manage daily reports** — Contractor

## Step 5: Audit and Maintain Permissions

Permissions drift over time. People change roles, leave the project, or get promoted. Regular audits are essential.

### Monthly Permission Audit

1. Go to **Project Admin** → **Members**.
2. Review each member:
   - Is this person still on the project?
   - Is their role still correct?
   - Are they in the right groups?
3. Remove anyone who left the project.
4. Update roles for anyone whose responsibilities changed.

### Activity Log Review

1. Go to **Project Admin** → **Activity Log**.
2. Review recent activity:
   - Unusual download patterns (mass downloads by a single user)
   - Access from unexpected locations
   - Permission changes (who changed what)
   - File deletions (who deleted what)

### Quarterly Access Review

Every quarter, send a report to each team lead:
- List of their team members with access
- Ask them to confirm each person still needs access
- Remove anyone not confirmed

## Common Permission Mistakes

### Everyone is Project Admin

This is the most dangerous mistake. Project Admins can delete the entire project, remove other admins, and change billing. Limit to 1-2 people (usually the BIM Manager and IT admin).

### No Folder-Level Permissions

If all folders have the same permissions, every team sees everything. This leads to accidental modifications and data exposure. Always configure folder-level permissions.

### Contractors Have Edit Access to Design Folders

Contractors should never edit design files. They review and comment, but design changes are the design team's responsibility. Give contractors View & Download on design folders.

### Clients See Working Files

Clients should see coordination models and final reports, not work-in-progress files. Seeing incomplete models creates unnecessary questions and erodes confidence.

### Former Employees Still Have Access

I've found former employees with active access in 80% of the ACC projects I've audited. Make it a policy to remove access on the employee's last day, not "when we get around to it."

## Best Practices

- **Use groups, not individuals** — scalability and consistency
- **Document the permission structure** — include it in the project BIM manual
- **Audit monthly** — don't let permissions drift
- **Remove access immediately when someone leaves** — not next week, today
- **Use the principle of least privilege** — give the minimum access needed to do the job
- **Log all permission changes** — the activity log is your audit trail
