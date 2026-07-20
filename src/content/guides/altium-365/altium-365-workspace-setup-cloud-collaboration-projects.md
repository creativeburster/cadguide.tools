---
title: "Altium 365 Workspace Setup: Cloud Collaboration, Project Sharing, and Version Control"
excerpt: "A guide to setting up Altium 365 Workspace for team collaboration, including project sharing, Git-based version control, managed components, and access control configuration."
category: "deployment"
softwareSlug: "altium-365"
keyword: "altium 365 workspace setup collaboration"
slug: "altium-365-workspace-setup-cloud-collaboration-projects"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://www.altium.com/documentation/altium-365/workspace"
  - "https://www.altium.com/documentation/altium-365/workspace-projects?version=5"
---

# Altium 365 Workspace Setup: Cloud Collaboration, Project Sharing, and Version Control

We've set up Altium 365 Workspaces for several teams ranging from two-person startups to fifty-engineer enterprises. The Workspace is the central hub that connects Altium Designer to the cloud, enabling version control, component management, and real-time collaboration. Let us walk you through the setup process and the key decisions you need to make.

## What the Workspace Actually Does

The Altium 365 Workspace is a dedicated server that hosts and manages all your design content. It provides:

- **Version-controlled project storage** using a built-in Git repository
- **Managed components** with centralized lifecycle tracking
- **Web-based design viewing** from any browser or mobile device
- **Concurrent design** so multiple engineers can work on the same project
- **Manufacturing portal** for releasing production data

The Workspace sits between Altium Designer on the desktop and the Altium 365 cloud platform, handling data synchronization, access control, and release management.

## Initial Workspace Configuration

When you first activate your Altium 365 subscription, you get a Workspace provisioned in the cloud. The initial setup involves:

1. **Sign in to Altium 365** at altium365.com using your AltiumLive account
2. **Create or confirm your Workspace** — each subscription includes one cloud Workspace
3. **Invite team members** from the Workspace members page
4. **Configure access roles** — Reader, Commenter, Editor, or Administrator

The Workspace uses role-based access control. By default, workspace members get access to all current and future projects, but you can restrict this at the project level.

## Making Projects Available Online

To share a local project to the Workspace, right-click the project in the Projects panel and select **Make Project Available Online**. The dialog asks for:

- **Project Name** — auto-populated from the local project
- **Description** — a meaningful summary for team members
- **Version Control** — enable this to allow concurrent editing and full history tracking

Once uploaded, a green checkmark appears next to files in the Projects panel, indicating synchronization with the Workspace revision. The project is now viewable from any web browser.

## Git-Based Version Control

All projects in the Workspace are stored in a Git repository called Versioned Storage. This means:

- Every save creates a new revision — previous data is never overwritten
- You can compare revisions to see exactly what changed
- The History page in the browser interface shows a timeline of all modifications
- You can branch and merge if needed (though most teams use the linear workflow)

If your project was previously under external VCS (SVN or external Git), you can migrate it to the Workspace's native Git. This simplifies setup because the Workspace handles all VCS operations automatically — no need for team members to install Git or configure external repositories.

## Access Control and Sharing

Altium 365 supports three sharing methods:

1. **Workspace members** — add users to the Workspace for access to all projects
2. **Individual project sharing** — share a specific project with someone outside the Workspace
3. **Static snapshot sharing** — share a read-only copy via a temporary link (48 hours) or with specific people

For external collaborators like contract manufacturers, the snapshot method works well. They get view-only access without needing an Altium license.

## Common Setup Issues

### Portal Connection Errors

If you see "Error from portal365.altium.com" when launching Altium Designer, the usual causes are:

- Corporate firewall blocking required ports and URLs
- Antivirus intercepting SSL certificates
- TLS 1.2 not enabled on the machine
- Proxy server misconfiguration

Have your IT team whitelist the Altium 365 URLs and ports listed in the Altium knowledge base. You can also use the offline installer if the machine has no internet access.

### ERR_TOO_MANY_REDIRECTS

This browser error when connecting to the Workspace is typically resolved by removing the user from the Workspace and re-inviting them. Alternatively, clearing the server cache in Preferences > Data Management > Servers can help.

### Lost Connection During Work

If you lose connection to Altium 365 while working, you can continue editing checked-out projects locally. The distributed Git architecture means your changes sync when the connection is restored. However, managed components won't be accessible while offline — only cached components on your workstation are available.

## Best Practices

- **Use managed components from day one** — migrating later is painful
- **Enable version control on every project** — it's free and provides full history
- **Set up lifecycle states** (Draft, Released, Obsolete) for components and projects
- **Use the Manufacturing Portal** for sharing release data with fabricators
- **Configure Design Rule Checks** in the Workspace to enforce standards across the team
