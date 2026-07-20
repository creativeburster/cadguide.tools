---
title: "ARES Commander Cloud Sync: Setting Up Graebert Cloud for Team Collaboration"
excerpt: "How to configure ARES Commander's cloud sync for multi-office teams — covering workspace setup, file sharing permissions, version history, and offline workflow reconnection."
category: "deployment"
softwareSlug: "ares-commander"
keyword: "ares commander cloud sync graebert setup"
slug: "ares-commander-cloud-sync-graebert-setup"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.graebert.com/blog/product-news/cloud-ares-cad-software-enables-easy-collaboration-for-dwg-drawings/"
  - "https://www.graebert.academy/courses/1844444/lectures/42123926"
---

# ARES Commander Cloud Sync: Setting Up Graebert Cloud for Team Collaboration

Setting up Graebert Cloud for a multi-office firm promises real-time collaboration on DWG files without emailing attachments. The reality is close — with some configuration gotchas you need to know about.

## How Graebert Cloud Works

ARES Commander integrates with Graebert Cloud (powered by ARES Kudo) at the file system level. When you save a DWG to a cloud workspace, it's stored on Graebert's servers and automatically synced to all team members who have access to that workspace.

Key concepts:
- **Workspace** — A shared folder in Graebert Cloud (like a Google Drive shared folder)
- **Cloud file** — A DWG stored in the workspace, accessible from desktop, browser, and mobile
- **Local cache** — A synchronized copy on your hard drive for offline work
- **Lock** — When someone is editing a cloud file, others get read-only access

## Step 1: Create a Team Workspace

1. Log in to Graebert Cloud at `https://kudo.graebert.com` using your ARES account.
2. Click **New Workspace**.
3. Name it (e.g., "Office Drawings" or "Project Alpha").
4. Set the workspace type: **Private** (invite only) or **Team** (all organization members).
5. Click **Create**.

For multi-office teams, create separate workspaces per project, not per office. This keeps project files together regardless of which office is working on them.

## Step 2: Invite Team Members

1. In the workspace, click **Share**.
2. Enter email addresses of team members.
3. Set permissions per user:
   - **Editor** — Full read/write access
   - **Reviewer** — Can view and add markups, cannot edit geometry
   - **Viewer** — Read-only
4. Click **Send Invitations**.

Team members receive an email with a link to accept. They must create a Graebert account (free) if they don't have one.

## Step 3: Connect ARES Commander Desktop to Cloud

On each workstation:

1. Launch ARES Commander.
2. Go to **File** → **Cloud Storage** → **Sign In to Graebert Cloud**.
3. Enter your ARES account credentials.
4. After authentication, the Cloud panel appears in the left sidebar.
5. All workspaces you have access to appear in the panel.

To open a cloud file, simply double-click it in the Cloud panel. ARES downloads the file to its local cache and opens it. When you save, the file is automatically uploaded to the cloud.

## Step 4: Configure Offline Workflow

Cloud files are cached locally, so you can work offline. When you reconnect, changes sync automatically.

To configure offline behavior:

1. Go to **Tools** → **Options** → **Cloud**.
2. Set **Cache size limit** to 5 GB (or appropriate for your storage).
3. Enable **Pre-cache all files in workspace** — downloads all files for offline access (useful for laptops before travel).
4. Set **Conflict resolution** to **Prompt** — when the same file was edited by two people offline, ARES will ask which version to keep.

**Important**: If two users edit the same file offline simultaneously, the first to reconnect uploads their version. The second user gets a conflict warning and must choose: keep their version (overwriting the other), keep the cloud version (losing their changes), or save their version as a new file.

## Step 5: Set Up File Locking

To prevent conflicts, enable automatic file locking:

1. Go to **Tools** → **Options** → **Cloud** → **File Locking**.
2. Set **Auto-lock on open** to **Yes**.
3. Set **Auto-unlock on close** to **Yes**.

With this configuration, when you open a cloud file, other users see a lock icon and can only open it read-only. When you close the file, the lock releases automatically.

If a user's computer crashes with a file locked, the lock persists for 4 hours before auto-expiring. You can manually release a lock from the Graebert Cloud web interface.

## Step 6: Share Files With External Clients

To share a drawing with someone outside your team:

1. Right-click the cloud file in ARES Commander.
2. Select **Share Link**.
3. Set permissions: **View only** or **Comment** (markups).
4. Set expiry: 7 days, 30 days, or custom.
5. Copy the generated link and send it to the client.

The client opens the link in a browser — no ARES installation needed. They can view, measure, and add markups directly in the browser via ARES Kudo.

## Troubleshooting Sync Issues

**File not syncing**: Check the Cloud panel for a sync error icon. Right-click → **Retry Sync**. If it persists, check your internet connection and firewall — Graebert Cloud uses HTTPS on port 443.

**"File locked by another user" but no one is editing**: The lock is stale from a crashed session. Go to `https://kudo.graebert.com`, find the file, and click **Release Lock**.
