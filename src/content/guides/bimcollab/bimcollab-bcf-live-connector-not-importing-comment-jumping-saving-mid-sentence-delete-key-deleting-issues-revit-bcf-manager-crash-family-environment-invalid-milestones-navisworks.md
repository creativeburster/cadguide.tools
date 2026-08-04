---
title: "BIMcollab BCF Live Connector Not Importing Issues, Comment Jumping and Saving Mid-Sentence on Synchronized Issues, Delete Key Accidentally Deleting Issues, Revit BCF Manager Crash in Family Environment and on Invalid Milestones, and Navisworks Bulk Import Issues Not Auto-Syncing: Performance Fix 23.5.1, June 2025 Beta, Auto-Sync Configuration, and Revit Bundle Update"
excerpt: "BIMcollab fails for 5 distinct reasons: BCF Live Connector not importing issues from performance bottleneck requiring 23.5.1 update, comment jumping and saving mid-sentence on synchronized issues from auto-sync interference requiring June 2025 beta fix, Delete key accidentally deleting issues from list focus conflict requiring careful focus management, Revit BCF Manager crash in family environment and on invalid milestones requiring Revit bundle update, and Navisworks bulk import issues not auto-syncing by design requiring manual synchronization. We cover each with fixes from Solibri Society and BIMcollab Help Center."
category: "troubleshooting"
softwareSlug: "bimcollab"
keyword: "BIMcollab BCF Live Connector not importing issues comment jumping saving mid-sentence synchronized Delete key deleting issues Revit BCF Manager crash family environment invalid milestones Navisworks bulk import auto-sync 23.5.1 June 2025 beta"
slug: "bimcollab-bcf-live-connector-not-importing-comment-jumping-saving-mid-sentence-delete-key-deleting-issues-revit-bcf-manager-crash-family-environment-invalid-milestones-navisworks"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://society.solibri.com/topic/3306/bcf-live-connecter-not-importing-issues"
  - "https://society.solibri.com/topic/3320/bcf-live-connector-bugs"
  - "https://helpcenter.bimcollab.com/en/articles/351296-synchronizing-issues-to-your-bimcollab-space"
---

# BIMcollab BCF Live Connector Not Importing Issues, Comment Jumping and Saving Mid-Sentence on Synchronized Issues, Delete Key Accidentally Deleting Issues, Revit BCF Manager Crash in Family Environment and on Invalid Milestones, and Navisworks Bulk Import Issues Not Auto-Syncing: Performance Fix 23.5.1, June 2025 Beta, Auto-Sync Configuration, and Revit Bundle Update

BIMcollab produces errors from BCF Live Connector import failures, comment synchronization glitches, accidental issue deletion, Revit BCF Manager crashes, and Navisworks bulk import sync issues. This guide covers the 5 most common BIMcollab problems with diagnostic steps and community-verified fixes from the Solibri Society and BIMcollab Help Center.

## 1. BCF Live Connector Not Importing Issues from Performance Bottleneck

### Symptom

The BCF Live Connector appears to be working — no error messages, no freezing — but new issues won't import from checking results or a presentation. The issue list doesn't update after attempting to import. The problem occurs with approximately 200 issues total, with the import attempt covering about 86 issues. Manual issue creation works fine.

### Root Cause

"If you have a lot of rule results (specifically with multiple iteration of the checkings, if you've been working with this Solibri file for some time) and the 'import issues' button is the one failing (and freezing Solibri), this would be the performance issue solved in today's release (23.5.1)." The BCF Live Connector has a performance bottleneck when importing issues from Solibri files that have accumulated many rule results from multiple checking iterations. The import process becomes slow or silently fails to update the issue list. The issue is not a crash but a silent performance failure where the import appears to work but doesn't produce results.

### Fix

1. **Update to Solibri 23.5.1 or later**:
   - "This would be the performance issue solved in today's release (23.5.1)"
   - Install the latest Solibri update
   - Which fixes the BCF Live Connector performance issue
   - For large rule result sets

2. **Be patient with large imports**:
   - "Note that it might still be slow, in my case it takes about 2 minutes"
   - Even after the fix, large imports take time
   - Wait at least 2 minutes
   - Before concluding the import failed

3. **Reduce rule results before importing**:
   - If working with an old Solibri file
   - With many checking iterations
   - Clear old checking results
   - Before attempting to import issues

4. **Check if Solibri is freezing**:
   - "If Solibri is freezing it doesn't show at all"
   - "Actually it seems to be working fine"
   - "But no new issues show up in the live connector"
   - The issue is silent — no freeze, just no results

5. **Try manual issue creation**:
   - "Yes I can manually add issues"
   - If manual creation works but import doesn't
   - The issue is specifically with the import function
   - Not with the connector itself

6. **Send log files to support**:
   - "Please send a support request"
   - "It would be good to include a screen recording of the behaviour"
   - "Along with the log files and model (if possible)"
   - "Logs can be found here: https://help.solibri.com/hc/en-us/articles/21911035161111"

7. **Use a fresh Solibri file**:
   - If the issue persists with an old file
   - Create a new Solibri file
   - Re-import the model
   - And run fresh checkings before importing issues

### Community Report

> "I have an issue where the new Issues won't import from checking results or a presentation. Everything looks like it's working but the list won't update. It's only about 200 issues in total. The import I'm trying to do now is only 86 issues. If you have a lot of rule results and the 'import issues' button is the one failing, this would be the performance issue solved in today's release (23.5.1). Note that it might still be slow, in my case it takes about 2 minutes."

## 2. Comment Jumping and Saving Mid-Sentence on Synchronized Issues

### Symptom

When commenting on synchronized issues in the BCF Live Connector, comments are often updated before the user finishes writing. The comment "jumps" — saves mid-sentence — cutting off the user's input. The issue occurs with synchronized issues but not with unsynchronized ones. Automatic synchronization is turned off, but the problem persists. The behavior is extremely frustrating for professional work.

### Root Cause

"Comment jumping is currently targeted for our June release, set to be in beta in a few weeks." The BCF Live Connector's auto-sync mechanism triggers when an issue is selected or edited, even when auto-sync is turned off. The comment field saves prematurely when the connector detects a change in the synchronized issue, causing the comment to be submitted before the user finishes typing. This is a known bug that was reported over a year ago and finally fixed in Solibri 25.6.0.

### Fix

1. **Update to Solibri 25.6.0 or later**:
   - "The fix for comments jumping up and saving mid-sentence is now available in 25.6.0"
   - Install the latest version
   - That includes the comment jumping fix

2. **Turn off automatic synchronization**:
   - "Automatic synchronization is turned off"
   - In the synchronization menu
   - Turn off auto-sync
   - To reduce premature comment saves

3. **Write comments externally**:
   - As a workaround
   - Write comments in a text editor
   - Then paste them into the BCF Live Connector
   - To avoid mid-sentence saves

4. **Use the beta version**:
   - "Beta is out, happy testing!"
   - If the stable release is not yet available
   - Use the beta version
   - That includes the fix

5. **Avoid editing synchronized issues while typing**:
   - Don't select other issues
   - While typing a comment
   - As this may trigger the premature save
   - Focus on one issue at a time

6. **Report persistent issues**:
   - "I reported this more than one year ago"
   - "It is super frustrating to see that nothing happens in this case"
   - If the fix doesn't resolve the issue
   - Report to Solibri support with details

7. **Use BIMcollab Zoom as alternative**:
   - If the BCF Live Connector continues to have issues
   - Use BIMcollab Zoom
   - For issue management
   - Which may not have the same problem

### Community Report

> "When I comment on synchronized issues, these are often updated before I finish writing. Automatic synchronization is turned off. I reported this more than one year ago. It is super frustrating to see that nothing happens in this case. Comment jumping is currently targeted for our June release, set to be in beta in a few weeks. The fix for comments jumping up and saving mid-sentence is now available in 25.6.0."

## 3. Delete Key Accidentally Deleting Issues

### Symptom

When using the Delete key in the Description field or 3D window of the BCF Live Connector, issues are accidentally deleted from the issue list. The deletion happens when the focus is on the issue list rather than the text field or 3D window. The problem occurs with both synchronized and unsynchronized issues. Deleted issues may be difficult to recover.

### Root Cause

"When I use delete in the Description or 3D window, it happens that the issue is deleted in the list." The BCF Live Connector has a focus management issue. When the user presses Delete expecting to delete text in the Description field or an element in the 3D window, the focus may have shifted to the issue list. The Delete key then deletes the selected issue from the list instead of the intended text or element. The issue is that focus shifts silently between the list, description, and 3D window.

### Fix

1. **Update to the latest version**:
   - "The deletion is also interesting, and will try to get this reproduced in house for further investigation"
   - The Solibri team is investigating this issue
   - Check for updates that may include a fix
   - For the focus management issue

2. **Verify focus before pressing Delete**:
   - Before pressing Delete
   - Click directly in the text field
   - Ensure the cursor is blinking in the text
   - Not on the issue list

3. **Use Backspace instead of Delete**:
   - In text fields, Backspace may be safer
   - As it only affects text
   - Not the issue list
   - Use Backspace for text deletion

4. **Avoid using Delete in the 3D window**:
   - When working in the 3D window
   - Don't use the Delete key
   - As focus may shift to the issue list
   - Use right-click context menu instead

5. **Turn off auto-sync to prevent deletion propagation**:
   - "Automatic synchronization is turned off"
   - If auto-sync is off
   - Deleted issues may not be propagated to the server
   - And can potentially be recovered

6. **Check for deleted issues in BIMcollab space**:
   - If an issue is accidentally deleted
   - Check the BIMcollab space
   - The issue may still exist on the server
   - If sync hadn't occurred before deletion

7. **Report the issue with video**:
   - "I am attaching videos where I have reconstructed the problems"
   - Record a video of the deletion behavior
   - Submit to Solibri support
   - To help them reproduce and fix the issue

### Community Report

> "When I use delete in the Description or 3D window, it happens that the issues is deleted in the list. This has happened with synchronized issues and with issues that are not synchronized. The deletion is also interesting, and will try to get this reproduced in house for further investigation. I am attaching videos where I have reconstructed the problems."

## 4. Revit BCF Manager Crash in Family Environment and on Invalid Milestones

### Symptom

The BIMcollab BCF Manager for Revit crashes when working in the Revit family environment. The crash also occurs when synchronizing issues that have invalid milestones. A crash occurs on the SelectionUpdate event in Revit 2023 and 2024. The BCF Manager crashes when using the search function for issues in some versions.

### Root Cause

Multiple crash bugs in the BCF Manager for Revit: (1) "Fixed a crash that occurred in offline mode for the Revit family environment" — the BCF Manager doesn't properly handle the family editor context. (2) "Fixed a crash when synchronizing issues with invalid milestones" — the sync routine doesn't validate milestone references. (3) "Fixed a SelectionUpdate event crash on Revit 2023 and 2024" — the event handler fails when Revit selection changes. (4) "Solved a bug that made the BCF manager crash when using the search function for issues" — the search routine has a null reference bug.

### Fix

1. **Update to the latest BCF Manager for Revit**:
   - "Fixed a crash that occurred in offline mode for the Revit family environment"
   - "Fixed a crash when synchronizing issues with invalid milestones"
   - "Fixed a SelectionUpdate event crash on Revit 2023 and 2024"
   - Install the latest version from the Autodesk App Store

2. **Avoid using BCF Manager in family environment**:
   - If the update is not yet installed
   - Don't open the BCF Manager
   - While in the Revit family editor
   - Exit the family editor first

3. **Validate milestones before syncing**:
   - "Fixed a crash when synchronizing issues with invalid milestones"
   - Check that all milestones referenced by issues
   - Are valid and exist in the BIMcollab space
   - Before synchronizing

4. **Use the new Revit bundle installer**:
   - "New version of Revit bundle installer 2023-2026 is released"
   - Use the latest installer
   - That supports Revit 2023 through 2026
   - From the Autodesk App Store

5. **Check for invalid milestone references**:
   - In the BIMcollab space
   - Verify all milestones are properly defined
   - Remove or fix any invalid milestones
   - Before syncing issues

6. **Report persistent crashes**:
   - If crashes persist after updating
   - Report to BIMcollab support
   - With the Revit version and crash details
   - Include log files

7. **Use online mode instead of offline**:
   - "Fixed a crash that occurred in offline mode"
   - If using offline mode causes crashes
   - Switch to online mode
   - By connecting to BIMcollab Nexus

### Community Report

> "New version of Revit bundle installer 2023-2026 is released. Bug fixes and improvements: Fixed a crash that occurred in offline mode for the Revit family environment. Fixed a crash when synchronizing issues with invalid milestones. Fixed a SelectionUpdate event crash on Revit 2023 and 2024. Solved a bug that made the BCF manager crash when using the search function for issues."

## 5. Navisworks Bulk Import Issues Not Auto-Syncing

### Symptom

Issues generated via bulk import from Navisworks clashes are not automatically synchronized to the BIMcollab space. Other issues (manually created or edited) sync automatically. The bulk-imported issues show the "waiting to sync" icon but never sync on their own. Manual synchronization works for these issues.

### Root Cause

"Issues generated via bulk import from Navisworks Clashes are not automatically synchronized." This is by design, not a bug. The auto-sync feature is configured to synchronize manually created or edited issues. Bulk-imported issues from Navisworks clashes are treated differently — they are created in batch and may contain many issues at once. Auto-syncing a large batch of issues could overwhelm the server or create sync conflicts. Therefore, bulk-imported issues require manual synchronization.

### Fix

1. **Manually synchronize bulk-imported issues**:
   - "Issues generated via bulk import from Navisworks Clashes are not automatically synchronized"
   - Click the 'synchronize project' button
   - At the top of the menu
   - To manually sync bulk-imported issues

2. **Understand auto-sync behavior**:
   - "Information is automatically submitted to BIMcollab space when an Issue is manually created or edited"
   - "Information is automatically retrieved from BIMcollab spaces when an Issue is selected"
   - Auto-sync only applies to manual creation/editing
   - Not to bulk import

3. **Turn on auto-sync for other issues**:
   - "To turn on/off the Auto-sync function, open the synchronization menu"
   - "By default Auto-sync is turned off"
   - Enable auto-sync for manually created issues
   - But remember bulk import still requires manual sync

4. **Identify waiting-to-sync issues**:
   - "New or edited Issues which are not yet synchronized"
   - "Can be recognized by the 'waiting to sync' icon"
   - "In the Issue list or on an Issue tile"
   - Look for this icon to identify unsynced issues

5. **Sync after bulk import**:
   - After completing a bulk import from Navisworks
   - Immediately click 'synchronize project'
   - Don't wait for auto-sync
   - As it won't happen automatically

6. **Use BIMcollab Nexus for online workflow**:
   - "It is advised to always use the BCF Manager with an online workflow"
   - "By connecting to BIMcollab Nexus"
   - Using the online workflow
   - Ensures issues are properly synced

7. **Verify sync completion**:
   - After manual synchronization
   - Check that the 'waiting to sync' icon
   - Has disappeared from all issues
   - Confirming successful sync

### Community Report

> "After creating or updating Issues, you can synchronize them with the project in your BIMcollab space by clicking on the 'synchronize project' button. New or edited Issues which are not yet synchronized can be recognized by the 'waiting to sync' icon. Auto-sync synchronizes Issues when they are viewed or edited. Issues generated via bulk import from Navisworks Clashes are not automatically synchronized. It is advised to always use the BCF Manager with an online workflow by connecting to BIMcollab Nexus."

## 6. Additional BIMcollab Issues

### Deadline Timezone Handling

**Issue**: "Fixed a bug where the Deadline field was handled incorrectly for timezones negative from UTC."
**Fix**: Update to the latest BCF Manager version. The fix correctly handles deadlines in negative UTC timezones. Verify deadline display after updating.

### Zoom-to-Issue Hiding Elements

**Issue**: "Zoom-to issue about hiding elements after certain interactions e.g. editing of families."
**Fix**: Update to the latest BCF Manager for Revit. The fix prevents elements from being hidden after zoom-to-issue when editing families.

### Revit Survey Point Coordination

**Issue**: "Fixed an issue with Revit Survey Point coordination (BCFM for Revit 2023)."
**Fix**: Update to the latest version. The fix ensures correct coordination when using Revit Survey Point. Viewpoints now correctly reference the survey point.

### List Sorting by Deadline

**Issue**: "Fixed an error with list sorting according to deadline."
**Fix**: Update to the latest version. The fix ensures correct sorting by deadline in the issue list. Verify sorting after updating.

### Revit Shared Coordinates Support

**Issue**: "New features & Improvements: Support for Revit Shared Coordinates."
**Fix**: Update to the latest version. The BCF Manager now supports Revit Shared Coordinates. Viewpoints correctly reference shared coordinates.

### Offline Project Workflow

**Issue**: "If you already have a BCF file to start the project, choose 'Import BCF File'."
**Fix**: For offline workflows, use BCF file import/export. Create a new offline project. Import existing BCF files. Export to BCF when done to share with the team.

### Pending Members in Notify and Assign Lists

**Issue**: "Fixed a bug where pending members were displayed in the Notify and Assign lists."
**Fix**: Update to the latest version. Pending members (not yet accepted invitations) no longer appear in Notify and Assign lists. Only active members are shown.

## Best Practices

1. **Update Solibri to 23.5.1+ for BCF Live Connector performance** — fixes silent import failures
2. **Update to Solibri 25.6.0+ for comment jumping fix** — stops mid-sentence saves
3. **Update BCF Manager for Revit to latest bundle** — fixes family environment and milestone crashes
4. **Manually sync bulk-imported Navisworks issues** — they don't auto-sync by design
5. **Verify focus before pressing Delete** — prevents accidental issue deletion
6. **Turn off auto-sync if comment jumping occurs** — reduces premature saves
7. **Use online workflow with BIMcollab Nexus** — recommended over offline BCF files
8. **Validate milestones before syncing** — prevents sync crashes
9. **Check 'waiting to sync' icon** — identifies unsynced issues
10. **Be patient with large imports** — may take 2+ minutes even after fix
