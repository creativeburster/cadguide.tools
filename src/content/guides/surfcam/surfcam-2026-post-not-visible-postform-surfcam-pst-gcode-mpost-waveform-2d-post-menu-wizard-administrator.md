---
title: "SurfCAM 2026 Post Processor Not Visible in Menu from Manual postform.m Edit Without surfcam.pst Registration, Post Added to Library But Not Visible in Menu from Registry Parity Failure, G-Code Errors from Unsupported Commands in M-Post Output, Waveform 2D Toolpath Calculation Speed and Internal External Contour Issues, and Post Menu Wizard Permission Error from Lack of Administrator Rights: Post Menu Wizard Use, surfcam.pst Registration, G-Code Command Removal, CAMENGINE Update, and Administrator Rights"
excerpt: "SurfCAM fails for 5 distinct reasons: post processor not visible in menu from manual postform.m edit without surfcam.pst registration requiring Post Menu Wizard use, post added to library but not visible in menu from registry parity failure requiring surfcam.pst registration, G-code errors from unsupported commands in M-Post output requiring G-code command removal, Waveform 2D toolpath calculation speed and internal external contour issues requiring CAMENGINE update, and Post Menu Wizard permission error from lack of administrator rights requiring administrator rights. We cover each with fixes from SurfCAM community."
category: "manufacturing"
softwareSlug: "surfcam"
keyword: "SurfCAM 2026 post processor not visible menu manual postform.m edit surfcam.pst registration post added library not visible registry parity failure G-code errors unsupported commands M-Post output Waveform 2D toolpath calculation speed internal external contour Post Menu Wizard permission error administrator rights"
slug: "surfcam-2026-post-not-visible-postform-surfcam-pst-gcode-mpost-waveform-2d-post-menu-wizard-administrator"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-04"
sources:
  - "https://industrialmonitordirect.com/blogs/knowledgebase/adding-custom-posts-in-surfcam-velocity-step-by-step-guide"
  - "https://hexagon.com/products/surfcam-post-processors"
  - "https://pmtechnologies.com/blog/surfcam-2025-1-workflow-and-toolpath-improvements/"
---

# SurfCAM 2026 Post Processor Not Visible in Menu from Manual postform.m Edit Without surfcam.pst Registration, Post Added to Library But Not Visible in Menu from Registry Parity Failure, G-Code Errors from Unsupported Commands in M-Post Output, Waveform 2D Toolpath Calculation Speed and Internal External Contour Issues, and Post Menu Wizard Permission Error from Lack of Administrator Rights: Post Menu Wizard Use, surfcam.pst Registration, G-Code Command Removal, CAMENGINE Update, and Administrator Rights

SurfCAM produces errors from post processor visibility, registry parity, G-code compatibility, toolpath calculation, and permission issues. This guide covers the 5 most common SurfCAM problems with diagnostic steps and community-verified fixes from SurfCAM community.

## 1. Post Processor Not Visible in Menu from Manual postform.m Edit Without surfcam.pst Registration

### Symptom

A post processor added manually to postform.m doesn't appear in the post selector menu. The post exists in the library but can't be selected from the menu. The user manually edited postform.m to add the post but didn't update surfcam.pst. SURFCAM fails to bind the post even if the user types the name manually.

### Root Cause

"Manual editing of postform.m skips the registration step and is the single most common cause of post added to library but not visible in menu symptoms observed in field deployments. If only postform.m is updated: Post exists in the library but does not appear in the post selector menu. SURFCAM will fail to bind the post if the user types the name manually." The SurfCAM post system requires both postform.m (library) and surfcam.pst (registry) to be updated. Manual editing of postform.m only updates the library, not the registry. Without surfcam.pst registration, the post doesn't appear in the menu.

### Fix

1. **Use Post Menu Wizard instead of manual edit**:
   - "The Post Menu Wizard"
   - "Exists specifically to maintain"
   - "Parity between these two stores"
   - Use Wizard

2. **Register post in surfcam.pst manually**:
   - "Register the post manually"
   - "By editing \Surfcam\Velocity\surfcam.pst"
   - "And appending the post name"
   - "On a new line"
   - Register in surfcam.pst

3. **Use one post name per line format**:
   - "The format is one post name"
   - "Per line, matching the entry's"
   - "Display string in postform.m"
   - "Do not add a file extension"
   - One name per line

4. **Close SURFCAM before editing**:
   - "SURFCAM Velocity must be closed"
   - "Before any manual edit"
   - "To postform.m or surfcam.pst"
   - Close SURFCAM

5. **Backup postform.m before editing**:
   - "Create a backup copy"
   - "Of postform.m in a safe location"
   - "Before any manual edit"
   - Backup first

6. **Check for read-only attribute**:
   - "Confirm the file is not marked read-only"
   - "A read-only attribute silently drops"
   - "Manual edits on the next launch"
   - Check read-only

7. **Verify menu visibility after restart**:
   - "Launch SURFCAM Velocity"
   - "Click the post selector"
   - "The new post should appear"
   - Verify visibility

### Community Report

> "Manual editing of postform.m skips the registration step and is the single most common cause of post added to library but not visible in menu symptoms. If only postform.m is updated: Post exists in the library but does not appear in the post selector menu. SURFCAM will fail to bind the post if the user types the name manually. Register the post manually by editing surfcam.pst and appending the post name on a new line."

## 2. Post Added to Library But Not Visible in Menu from Registry Parity Failure

### Symptom

The post exists in the postform.m library but doesn't appear in the post selector menu. Alternatively, the menu entry is visible but selecting it returns "post not found" or loads a default empty post stub. The two stores (library and registry) are out of sync.

### Root Cause

"Updated File: postform.m only - Post exists in the library but does not appear in the post selector menu. SURFCAM will fail to bind the post. Updated File: surfcam.pst only - Menu entry is visible, but selecting it returns post not found or loads a default empty post stub." The SurfCAM post system requires parity between postform.m (library) and surfcam.pst (registry). When only one file is updated, the stores are out of sync, causing either the post to not appear in the menu or to return an error when selected.

### Fix

1. **Use Post Menu Wizard for automatic parity**:
   - "The Post Menu Wizard"
   - "Handles both the Postlib library update"
   - "And the surfcam.pst registry update"
   - "In a single transaction"
   - Use Wizard

2. **Update both files manually**:
   - Update both
   - postform.m and
   - surfcam.pst to
   - Maintain parity

3. **Verify parity after manual edit**:
   - "A failed verification"
   - "Indicates a registry/library"
   - "Parity problem"
   - Verify parity

4. **Check menu visibility**:
   - "Menu visibility check"
   - "The new post should appear"
   - "In the drop-down list"
   - Check menu

5. **Check post-bind**:
   - "Post-bind check"
   - "Select the new post"
   - "And open the post configuration dialog"
   - Check post-bind

6. **Restore from backup if corrupted**:
   - "A corrupted library"
   - "Is not recoverable without"
   - "A backup or full reinstall"
   - Restore backup

7. **Don't modify byte offsets of existing records**:
   - "Do not modify the byte offsets"
   - "Of existing records"
   - "Corrupting an existing entry"
   - "Invalidates that post"
   - Don't modify offsets

### Community Report

> "If only postform.m is updated: Post exists in the library but does not appear in the post selector menu. If only surfcam.pst is updated: Menu entry is visible, but selecting it returns post not found or loads a default empty post stub. The Post Menu Wizard handles both the Postlib library update and the surfcam.pst registry update in a single transaction, eliminating the parity problem."

## 3. G-Code Errors from Unsupported Commands in M-Post Output

### Symptom

When using M-Post to generate G-code for Grbl or other controllers, the output contains unsupported commands. Errors include "grbl error 26 or 32" for missing xyz words, "Unsupported G Code" for commands like G70, and "Multiple Motion Modes" for duplicate G00. Arc moves fail with "bad arc format, No I/J."

### Root Cause

The M-Post processor generates G-code with commands that are not supported by all CNC controllers. Commands like G70 (inch units), G40 (cutter compensation cancel), and G80 (canned cycle cancel) are not supported by Grbl. Multiple motion modes in a single block (e.g., G00 G90 G00) cause errors. Arc moves without I/J parameters are rejected by some controllers.

### Fix

1. **Remove unsupported G-code commands**:
   - "Removed G70"
   - "After removing G70 G40 and G80"
   - "This error went away"
   - Remove unsupported

2. **Remove duplicate motion modes**:
   - "Error on Line 8: Multiple Motion Modes"
   - "G00 G90 G00 X0.3509"
   - "Removed the second G00"
   - Remove duplicates

3. **Fix arc format with I/J parameters**:
   - "Error in line 13: bad arc format"
   - "No I/J"
   - "G03 X0.2936 Y-0.5977"
   - Add I/J parameters

4. **Remove program number line**:
   - "Error in line 2: Syntax Error"
   - "O0001(INCAAA)"
   - Remove program
   - Number line

5. **Use Mach3 post as starting point**:
   - "There is supposed to be"
   - "A Mach 3 post-processor"
   - Use Mach3 post
   - As base

6. **Edit M-Post header and footer**:
   - "MPost from SurfCAM"
   - "Lets me edit the header"
   - "And footer of the gcode"
   - Edit header/footer

7. **Contact SURFCAM support for custom post**:
   - "Their support told me"
   - "They have to make the post"
   - "If it affects the motion"
   - Contact support

### Community Report

> "I am mostly getting grbl error 26 or 32. Error in line 5: Unsupported G Code 5 G00 G17 G70 G40 G80 G90. After removing G70 G40 and G80, this error went away. Error on Line 8: Multiple Motion Modes 8 G00 G90 G00 X0.3509. Removed the second G00. Error in line 13: bad arc format, No I/J. Their support told me they have to make the post if it affects the motion of the tool."

## 4. Waveform 2D Toolpath Calculation Speed and Internal External Contour Issues

### Symptom

The Waveform 2D toolpath calculation is slow. The ability to machine both internal and external contours in a single toolpath is missing. Users need multiple operations for internal and external roughing. The toolpath generation doesn't use the latest CAMENGINE interface.

### Root Cause

"The Waveform 2D command has been updated using the latest Hexagon CAMENGINE interface, significantly improving calculation speed. It also restores the ability to machine both internal and external contours in a single toolpath." The Waveform 2D toolpath in versions before 2025.1 used an older CAMENGINE interface that was slower and didn't support combined internal/external contour machining. The 2025.1 update addresses both issues.

### Fix

1. **Update to SURFCAM 2025.1 or later**:
   - "The Waveform 2D command"
   - "Has been updated using"
   - "The latest Hexagon CAMENGINE interface"
   - Update SURFCAM

2. **Use updated Waveform 2D for speed**:
   - "Significantly improving"
   - "Calculation speed"
   - Use updated
   - Waveform 2D

3. **Machine internal and external in single toolpath**:
   - "Restores the ability to machine"
   - "Both internal and external contours"
   - "In a single toolpath"
   - Single toolpath

4. **Eliminate multiple roughing operations**:
   - "You get faster toolpath generation"
   - "And more efficient roughing strategies"
   - "Without needing multiple operations"
   - Eliminate multiple ops

5. **Install via Hexagon Customer Portal**:
   - "SURFCAM 2025.1 can be installed"
   - "Through the Hexagon Customer Portal"
   - Or Universal Updater
   - Install update

6. **Regenerate toolpaths after update**:
   - "Toolpaths must be regenerated"
   - "After changes to reflect updates"
   - Regenerate
   - Toolpaths

7. **Check toolpath comments in SQL database**:
   - "Toolpath comments are now stored"
   - "In the SURFCAM SQL database"
   - Check SQL
   - Comments

### Community Report

> "The Waveform 2D command has been updated using the latest Hexagon CAMENGINE interface, significantly improving calculation speed. It also restores the ability to machine both internal and external contours in a single toolpath. You get faster toolpath generation and more efficient roughing strategies without needing multiple operations. SURFCAM 2025.1 can be installed through the Hexagon Customer Portal or the Universal Updater app."

## 5. Post Menu Wizard Permission Error from Lack of Administrator Rights

### Symptom

The Post Menu Wizard fails with a permission error. The wizard silently drops the additions without completing. The post is not added to either the library or the registry. The user doesn't have local administrator rights.

### Root Cause

"Local administrator rights on the workstation. The Post Menu Wizard writes to Program Files-equivalent locations and to the protected surfcam.pst registry. Without write access, the wizard fails with a permission error and silently drops the additions." The Post Menu Wizard requires write access to Program Files locations and the protected surfcam.pst registry file. Without administrator rights, the wizard can't write to these locations, causing a silent failure.

### Fix

1. **Run as Administrator**:
   - "Local administrator rights"
   - "On the workstation"
   - Run as
   - Administrator

2. **Verify write access to Program Files**:
   - "The Post Menu Wizard writes"
   - "To Program Files-equivalent locations"
   - Verify write
   - Access

3. **Check surfcam.pst write permissions**:
   - "And to the protected"
   - "surfcam.pst registry"
   - Check write
   - Permissions

4. **Contact IT for administrator rights**:
   - If user doesn't
   - Have admin rights
   - Contact IT
   - Department

5. **Verify successful addition after wizard**:
   - "Menu visibility check"
   - "The new post should appear"
   - "In the drop-down list"
   - Verify addition

6. **Check for silent failure**:
   - "Silently drops the additions"
   - Check if post
   - Was actually
   - Added

7. **Use manual method as fallback**:
   - If wizard fails
   - Use manual
   - File editing
   - Method

### Community Report

> "Local administrator rights on the workstation. The Post Menu Wizard writes to Program Files-equivalent locations and to the protected surfcam.pst registry. Without write access, the wizard fails with a permission error and silently drops the additions. A failed verification indicates a registry/library parity problem, a permission issue, or a corrupt source post."

## 6. Additional SurfCAM Issues

### Toolpath Comment Storage

**Issue**: "Toolpath comments are now stored in the SURFCAM SQL database and can be edited or deleted as needed."
**Fix**: Use SQL database for toolpath comments. Edit or delete comments as needed. Verify comments after update.

### Batch Editing for Fixed Toolpath Descriptions

**Issue**: "You can now apply or remove fixed descriptions across multiple toolpaths at once. This eliminates the need to update each toolpath individually."
**Fix**: Use batch editing for fixed descriptions. Apply or remove across multiple toolpaths. Regenerate toolpaths after changes.

### S-Post Factory Interface Language

**Issue**: "S-POST has an easy-to-use generator module that presents dynamic menus, context sensitive help and a powerful Factory Interface Language (FIL) utility."
**Fix**: Use S-Post for complex machines. Use FIL for external file I/O. Use Option File Generator for custom posts.

### M-Post vs S-Post Selection

**Issue**: "M-POST is an easy post processor that users just simply have to fill in the required information. S-POST supports 2- to 4-axis lathes and mills with up to 15 axes."
**Fix**: Use M-Post for simple 2-3 axis machines. Use S-Post for complex multi-axis machines. Check post processor compatibility.

### Third-Party Post Processors

**Issue**: "OmegaPost and 3DPost are third-party post processors not developed or controlled by SURFCAM, Inc."
**Fix**: Contact third-party vendor for support. Check compatibility with SURFCAM. Verify post before purchase.

### Memory-Mapped Files

**Issue**: "Both files are memory-mapped by the running application; writes from outside the locked handle are dropped on the next launch."
**Fix**: Close SURFCAM before editing postform.m or surfcam.pst. Don't edit while SURFCAM is running. Verify changes after restart.

### Corrupted postform.m Recovery

**Issue**: "The manual workflow overwrites the file in place and a corrupted library is not recoverable without a backup or full reinstall."
**Fix**: Always backup postform.m before editing. Keep backup in safe location. Restore from backup if corrupted.

## Best Practices

1. **Use Post Menu Wizard instead of manual postform.m editing** — maintains library/registry parity
2. **Register post in surfcam.pst if manually editing postform.m** — one post name per line
3. **Close SURFCAM before editing postform.m or surfcam.pst** — files are memory-mapped
4. **Backup postform.m before any manual edit** — corrupted library requires backup or reinstall
5. **Run Post Menu Wizard as Administrator** — requires write access to Program Files and surfcam.pst
6. **Remove unsupported G-code commands for Grbl controllers** — G70, G40, G80 not supported
7. **Fix arc format with I/J parameters** — prevents bad arc format errors
8. **Update to SURFCAM 2025.1 for faster Waveform 2D** — latest CAMENGINE interface
9. **Use batch editing for fixed toolpath descriptions** — eliminates individual updates
10. **Contact SURFCAM support for custom post development** — especially for motion-affecting changes
