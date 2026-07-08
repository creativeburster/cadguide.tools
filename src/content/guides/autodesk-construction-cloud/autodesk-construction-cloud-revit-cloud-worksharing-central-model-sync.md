---
title: "ACC Revit Cloud Worksharing: Central Model Workflow and Sync Troubleshooting"
excerpt: "How to set up Revit cloud worksharing in Autodesk Construction Cloud — covering central model creation, local model sync, worksets management, and troubleshooting sync failures, stuck elements, and permission errors."
category: "workflow"
softwareSlug: "autodesk-construction-cloud"
keyword: "autodesk construction cloud revit cloud worksharing central model sync"
slug: "autodesk-construction-cloud-revit-cloud-worksharing-central-model-sync"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-07-08"
sources:
  - "https://forums.autodesk.com/t5/bim-360-support-forum/central-model-cloud-workflow/td-p/9105361"
  - "https://forums.autodesk.com/t5/bim-360-support-forum/autodesk-construction-cloud-bridge-project-revit-files-cannot-be/td-p/11307560"
---

# ACC Revit Cloud Worksharing: Central Model Workflow and Sync Troubleshooting

Moving Revit worksharing to the cloud via ACC is a game-changer for distributed teams. But the transition from network-based worksharing to cloud worksharing breaks things in new and confusing ways. I've helped teams migrate from Revit Server to BIM 360 to ACC, and each migration has its own gotchas. Here's what I've learned.

## How Cloud Worksharing Differs from Network Worksharing

In traditional network worksharing:
- Central model is on a network drive
- Users create local copies on their workstations
- Sync writes changes back to the central model over the network

In ACC cloud worksharing:
- Central model is stored in ACC (cloud)
- Desktop Connector caches files locally
- Revit uses a cloud worksharing protocol (different from network worksharing)
- Models are published to ACC for sharing with other teams

The key difference: cloud worksharing uses a **publish-consume** model. You don't just sync — you publish your model to the shared folder, and other teams consume it.

## Step 1: Enable Worksharing in Revit

1. Open the Revit model.
2. Go to **Collaborate** tab → **Manage Cloud Models**.
3. Select the ACC project and folder.
4. Click **Relocate** to move the central model to ACC.
5. Configure worksets before sharing.

### Workset Strategy for Cloud Models

Worksets are critical for cloud performance. Each workset is synced independently, so users only download the worksets they need.

Recommended worksets:
- **Shell and Core** — building envelope, structural elements
- **Interiors** — interior walls, doors, furniture
- **MEP** — mechanical, electrical, plumbing
- **Site** — site elements, landscaping
- **Shared Levels and Grids** — reference elements shared by all disciplines
- **Working** — temporary work-in-progress elements

### Workset Rules

- **Close worksets you don't need** — this reduces the data transferred during sync
- **Keep worksets discipline-specific** — don't mix architecture and MEP in the same workset
- **Don't create too many worksets** — 5-10 is optimal; 50+ causes performance issues

## Step 2: Sync with Central

Cloud worksharing sync works differently from network sync:

1. Go to **Collaborate** → **Sync with Central**.
2. Choose what to sync:
   - **All changes** — sync everything
   - **Selected worksets** — sync only specific worksets
3. Add a sync comment (recommended for audit trail).
4. Click **Synchronize**.

### Sync vs Publish

This is the most confusing part of cloud worksharing:

- **Sync**: Saves your changes to the cloud central model. Other users on your team can see your changes when they sync.
- **Publish**: Makes your model available to other teams (Architecture, Structural, MEP) in Design Collaboration. Other teams consume the published version.

You need to do both. Sync keeps your team in sync. Publish keeps other teams in sync.

### When to Publish

- **After major milestones** — design reviews, coordination meetings
- **Weekly at minimum** — even if no major changes, publish so other teams have the latest
- **Before clash detection runs** — Model Coordination uses published models, not synced models

## Step 3: Manage Local Caches

Revit caches cloud models locally. Over time, the cache can grow large or become corrupted.

### Cache Location

Revit cloud model cache is at:
`%LOCALAPPDATA%\Autodesk\Revit\Autodesk Revit [version]\CollaborationCache`

### Clearing the Cache

If you experience sync issues or Revit crashes:

1. Close Revit.
2. Delete the contents of the CollaborationCache folder.
3. Reopen Revit and re-download the model from ACC.

This forces a fresh download from the cloud and fixes most cache corruption issues.

### Cache Size Management

The cache can grow to several GB per project. If you work on multiple ACC projects:

1. Periodically clear caches for projects you're no longer active on.
2. Use the **Close Worksets** feature to avoid downloading unnecessary data.
3. Use **Detach from Central** for read-only access (doesn't create a cache).

## Step 4: Troubleshoot Sync Failures

Sync failures are the most common cloud worksharing issue. Here's my diagnostic process:

### "Sync Failed — Try Again Later"

This usually means a network connectivity issue or ACC service outage.

1. Check your internet connection.
2. Check Autodesk Health Dashboard at `health.autodesk.com`.
3. Wait 5 minutes and retry.
4. If it persists, restart Desktop Connector.

### "Element Cannot Be Synced — Owned by Another User"

Another user has borrowed the element. You can't sync your changes to that element until they release it.

1. Ask the other user to sync and release their borrowed elements.
2. If the user is unavailable, ask a Project Admin to force-release their elements.
3. In rare cases, the element may be stuck — see "Stuck Elements" below.

### "Model Out of Date — Reload Latest"

Your local copy is behind the central model. You need to reload before syncing.

1. Go to **Collaborate** → **Reload Latest**.
2. Select which worksets to reload.
3. After reloading, sync your changes.

### "Disk Full — Cannot Save Local Copy"

Your local drive is full. The cloud model cache requires free disk space.

1. Clear the CollaborationCache folder.
2. Free up disk space (at least 10 GB for Revit cloud models).
3. Close worksets you don't need to reduce cache size.

## Step 5: Handle Stuck Elements

Sometimes an element gets stuck in a borrowed state — the user who borrowed it can't release it, and no one else can edit it.

### Fix #1: Ask the Borrower to Sync

The simplest fix. The borrower syncs with central, which releases all borrowed elements.

### Fix #2: Force Relinquish

If the borrower is unavailable:

1. Go to **Collaborate** → **Manage Cloud Models**.
2. Select the model.
3. Click **Relinquish All** (Project Admin only).
4. This force-releases all borrowed elements.

### Fix #3: Create a New Central

If force relinquish doesn't work:

1. Have everyone close the model.
2. A Project Admin opens the model with **Detach from Central**.
3. Save the detached model as a new central model in ACC.
4. All users re-link to the new central model.

This is the nuclear option. You lose the change history, but it fixes stuck elements.

## Step 6: ACC Bridge for Cross-Account Collaboration

When collaborating with another company that has their own ACC account, use ACC Bridge.

1. In your ACC project, go to **Bridge** module.
2. Set up a bridge connection to the other company's ACC account.
3. Configure **Auto-Sync** to automatically share model updates.
4. The other company consumes the shared models in their ACC project.

### Bridge Issues

**Models not syncing across bridge**: Check that both accounts have the bridge connection configured. The sending account needs "Automatically sync updates to target project" enabled.

**Linked models show as not found**: When linking bridge models in Revit, use the Desktop Connector path, not a local path. If the Desktop Connector isn't running, the link will fail.

## Best Practices

- **Sync frequently** — every 30-60 minutes, not just at end of day
- **Publish weekly** — keep other teams updated
- **Use worksets effectively** — close worksets you don't need
- **Add sync comments** — maintain an audit trail of changes
- **Monitor cache size** — clear caches periodically
- **Train the team** — cloud worksharing is different from network worksharing; ensure everyone understands sync vs publish
