---
title: "Onshape Version History and Restore: Recovering Deleted Features Without Losing Progress"
excerpt: "You deleted a feature by mistake and want to restore it — but restoring a version reverts your entire design. We cover the selective restore workflow, branch creation, and the copy-from-history method that saves your progress."
category: "troubleshooting"
softwareSlug: "onshape"
keyword: "Onshape version history restore deleted feature without losing progress"
slug: "onshape-version-history-restore-deleted-feature"
author: "CADGuide Tools Editorial Team"
readTime: "8 min"
date: "2025-06-22"
sources:
  - "https://forum.onshape.com/discussion/5153/restoring-versions-and-history"
  - "https://www.onshape.com/en/resource-center/tech-tips/restore-cad-model-design-version-after-unwanted-changes"
  - "https://cad.onshape.com/help/Content/Document/restoring.htm"
  - "https://forum.onshape.com/discussion/6118/deleting-by-mistake"
---

# Onshape Version History and Restore: Recovering Deleted Features Without Losing Progress

A user on the Onshape forum described a common problem: "I am having trouble restoring a part that was deleted by mistake, however when I put restore, everything including the parts and assemblies that have evolved after the deleting that part all go back in time. How do I restore something but not lose progress of everything else?"

This is the fundamental tension in Onshape's version history system: restoring a version reverts the entire document to that point in time, discarding all subsequent work. Onshape's official tech tip acknowledges: "Parts may be hidden, features deleted, or edits made that don't work out. Suddenly, the design doesn't look the way you expected."

## Understanding Onshape's Version History

### How Version History Works

Onshape automatically records every change to your document. The version history panel shows a timeline of all edits, with each entry representing a state of the document. When you restore a version, the entire document reverts to that state — all parts, assemblies, and features return to their condition at that point in time.

### Versions vs. Workspaces

- **Workspace**: The current editable state of the document
- **Version**: A named, immutable snapshot of the document at a point in time
- **Microversion**: An auto-saved state between versions — Onshape tracks every edit

You can create explicit versions at any time, but Onshape also tracks microversions that allow you to restore to any point in the edit history.

## Fix 1: Selective Restore via Branch Creation

This is the recommended approach when you want to recover a deleted feature without losing subsequent work:

### Step-by-Step

1. Open the **Versions and history** panel (clock icon in the top-left)
2. Find the version or microversion just before the feature was deleted
3. Right-click that version → **Branch from here**
4. Onshape creates a new branch starting from that point in time
5. The new branch contains the deleted feature
6. Your original workspace is unchanged — all subsequent work is preserved
7. Open the branched workspace and copy the deleted feature
8. Switch back to your main workspace
9. Use **Edit → Paste** to insert the recovered feature

### Benefits

- No work is lost — the main workspace remains intact
- The branch gives you access to the deleted feature
- You can cherry-pick specific features from the branch

## Fix 2: Copy Features Between Documents

If you can't use branching (e.g., you're on the free tier):

1. Open the **Versions and history** panel
2. Find the version before the deletion
3. Right-click → **Restore** — this reverts the document
4. Note the features you want to recover
5. Create a new document: **File → New → Document**
6. Copy the features from the restored document to the new document
7. Restore the latest version to get your recent work back
8. Copy the features from the new document back into the main document

### Limitations

- This method requires two restores (one to get the old state, one to get back to the current state)
- Copying features between documents may lose some references
- In-context references may not survive the copy

## Fix 3: Use the Feature List to Find Deleted Features

Sometimes a feature isn't actually deleted — it's just suppressed or hidden:

1. Open the **Feature list** (the timeline at the bottom)
2. Scroll through all features looking for the "missing" one
3. If you find it with a gray icon, it's suppressed — right-click → **Unsuppress**
4. If you find it with a red error icon, it failed — right-click → **Edit** and fix the error
5. If it's truly not in the list, it was deleted

## Fix 4: Recover from the Trash

Onshape has a trash for deleted items:

1. In the feature list, look for the **Trash** icon at the bottom
2. Click the trash to see deleted features
3. Find the deleted feature
4. Right-click → **Restore**
5. The feature is restored to its original position in the timeline

## Fix 5: Create Regular Versions as Checkpoints

The best recovery strategy is prevention:

1. Before making major changes, create a version:
   - Click the **+** icon next to the version name
   - Name the version (e.g., "Before redesign", "Pre-assembly cleanup")
2. If something goes wrong, you can restore to the named version
3. Create versions at natural milestones:
   - After completing each major feature
   - Before and after assembly insertion
   - Before sharing the document with collaborators

### Version Naming Convention

Use descriptive names:
- `v1.0 - Initial design`
- `v1.1 - Added mounting bosses`
- `v1.2 - Client review changes`
- `v2.0 - Redesign for manufacturing`

## Fix 6: Use Collaborative Editing Safely

Onshape's real-time collaboration means other users can delete features:

1. **Lock the document**: **File → Lock** — prevents others from editing
2. **Use permissions**: Only give edit access to trusted collaborators
3. **Create separate workspaces**: Each collaborator works in their own workspace
4. **Review changes**: Use the version history to review what each collaborator changed
5. **Comment before deleting**: Use comments to communicate before major changes

## Fix 7: Compare Versions

Before restoring, compare versions to understand what changed:

1. Open the **Versions and history** panel
2. Right-click a version → **Compare**
3. Select another version to compare against
4. Onshape shows a visual diff:
   - **Green**: Features added in the newer version
   - **Red**: Features removed in the newer version
   - **Yellow**: Features modified in the newer version
5. Use this to identify exactly when the feature was deleted and by whom

## Fix 8: Export as Backup

For critical designs, create local backups:

1. **File → Export → STEP** — exports the current 3D geometry
2. **File → Export → Parasolid** — exports with full parametric data
3. Save the exported file locally
4. If the cloud document is corrupted or accidentally deleted, you can import the backup

## Summary

| Fix | Type | When to Use |
|-----|------|-------------|
| Branch creation | Recovery | Best method — preserves all work |
| Copy between documents | Recovery | When branching is unavailable |
| Check feature list | Diagnostic | Feature may be suppressed, not deleted |
| Check trash | Recovery | Feature was recently deleted |
| Create regular versions | Preventive | Before major changes |
| Lock document | Preventive | When working with collaborators |
| Compare versions | Diagnostic | To understand what changed |
| Export as backup | Preventive | For critical designs |

The branch creation method is the most powerful — it gives you access to the deleted feature without losing any subsequent work. Make it a habit to create named versions before major changes, so you always have a clean restore point. And always check the trash first — recently deleted features can be restored with one click.
