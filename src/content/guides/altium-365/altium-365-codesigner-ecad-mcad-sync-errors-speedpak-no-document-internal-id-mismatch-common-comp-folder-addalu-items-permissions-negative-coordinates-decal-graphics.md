---
title: "Altium 365 CoDesigner ECAD-MCAD SolidWorks Sync Errors: SpeedPak Configuration Deletes CoDesigner Link Properties Causing No Document Opened, Internal ID Does Not Match from Multiple Boards Without Common Component Folder, AddALU_items Failed from Insufficient Workspace Permissions, Components Shifted from Negative Coordinates in SolidWorks, and SOLIDWORKS Decal Rendering Issues from Graphics Card Compatibility and Enhanced Graphics Performance"
excerpt: "Altium 365 CoDesigner fails for 5 distinct reasons: SpeedPak configuration deletes CoDesigner link properties in PCB assembly causing 'no document opened' error, Internal ID Does Not Match from multiple boards with same components without Common Comp Folder, AddALU_items Failed error from insufficient workspace permissions, components shifted or positioned incorrectly from negative coordinates in SolidWorks, and SOLIDWORKS decal rendering issues from graphics card incompatibility and Enhanced Graphics Performance setting. We cover each with fixes from Altium Knowledge Base and EEVblog forums."
category: "codesigner-ecad-mcad-sync-errors"
softwareSlug: "altium-365"
keyword: "Altium 365 CoDesigner SpeedPak no document opened Internal ID does not match Common Comp Folder AddALU_items failed workspace permissions components shifted negative coordinates SolidWorks decal rendering graphics card Enhanced Graphics Performance"
slug: "altium-365-codesigner-ecad-mcad-sync-errors-speedpak-no-document-internal-id-mismatch-common-comp-folder-addalu-items-permissions-negative-coordinates-decal-graphics"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://www.altium.com/documentation/knowledge-base/altium-designer/mcad-codesigner-troubleshooting-guide"
  - "https://www.altium.com/documentation/knowledge-base/altium-designer/troubleshoot-solidworks-codesigner-panel-error--there-is-no-document-opened"
  - "https://www.altium.com/documentation/knowledge-base/altium-designer/troubleshoot-the-internal-id-does-not-match-issue-with-solidworks-mcad"
---

# Altium 365 CoDesigner ECAD-MCAD SolidWorks Sync Errors: SpeedPak Configuration Deletes CoDesigner Link Properties Causing No Document Opened, Internal ID Does Not Match from Multiple Boards Without Common Component Folder, AddALU_items Failed from Insufficient Workspace Permissions, Components Shifted from Negative Coordinates in SolidWorks, and SOLIDWORKS Decal Rendering Issues from Graphics Card Compatibility and Enhanced Graphics Performance

Altium 365 CoDesigner's ECAD-MCAD synchronization with SolidWorks produces errors from SpeedPak configurations, component folder mismatches, permission issues, coordinate systems, and graphics rendering. This guide covers the 5 most common CoDesigner problems with diagnostic steps and community-verified fixes from Altium Knowledge Base and EEVblog forums.

## 1. SpeedPak Configuration Deletes CoDesigner Link Properties

### Error Message

"There is no document opened or the active document is not linked with PCB design."

### Symptom

After creating a SpeedPak configuration in SolidWorks to improve performance, the CoDesigner panel shows "no document opened" error. The PCB assembly that was previously linked to Altium Designer is no longer recognized. This happens specifically after adding a SpeedPak configuration.

### Root Cause

CoDesigner stores the link to Altium's PCB Project (and other properties) in the PCB assembly properties in SolidWorks. When SolidWorks creates a SpeedPak, it deletes those properties. Without the link properties, CoDesigner can't identify the assembly as linked to a PCB design.

### Fix

1. **Pull the board into a new folder**:
   - From Altium, pull the board into a new local folder
   - This creates a healthy temporary PCB assembly with correct properties
   - Copy the properties from this healthy assembly

2. **Copy properties to the unlinked assembly**:
   - Open the healthy temporary PCB Assembly in SolidWorks
   - Copy the CoDesigner link properties from the temporary assembly
   - Paste them to the properties of the unlinked assembly
   - This restores the link between SolidWorks and Altium

3. **Prevent the issue in the future**:
   - "To avoid this situation in the future, simply add one more configuration together with adding the SpeedPak"
   - That additional configuration will keep Altium's properties alive
   - The SpeedPak configuration won't delete properties from other configurations

4. **Avoid SpeedPak on CoDesigner-linked assemblies**:
   - If possible, don't use SpeedPak on assemblies linked to Altium CoDesigner
   - Use other performance optimization methods (Lightweight mode, Large Design Review)
   - If SpeedPak is necessary, always add an extra configuration first

### Community Report

> "CoDesigner stores the link to Altium's PCB Project in the PCB assembly properties in SolidWorks. When SOLIDWORKS creates the SpeedPak, it deletes those properties. The simplest solution is to pull the board from Altium into a local folder, copy the properties, then paste them to the unlinked assembly."

## 2. Internal ID Does Not Match from Multiple Boards Without Common Component Folder

### Error Message

"The Internal ID Does Not Match"

### Symptom

When opening a device assembly in SolidWorks containing several boards with the same set of components, the error "The Internal ID Does Not Match" appears. Components may be mismatched between boards.

### Root Cause

When multiple boards with the same components are used in a device assembly, and there is no common component folder set up in CoDesigner's settings, SolidWorks generates identical internal IDs for components across boards. This causes ID conflicts when the assembly is opened.

### Fix

1. **Set up a Common Comp Folder in CoDesigner settings**:
   - Open CoDesigner settings in SolidWorks
   - Set the "Common Comp Folder" to a shared directory
   - All boards will use the same component models from this folder
   - This prevents internal ID conflicts

2. **Choose "Accept this file anyway" as a workaround**:
   - When the error dialog appears, choose "Accept this file anyway"
   - This allows the assembly to open with potentially mismatched components
   - Verify component positions after opening
   - This is a temporary workaround, not a permanent fix

3. **Restore the dialog if dismissed**:
   - If the dialog was previously dismissed with "Don't show again"
   - It can be restored in SolidWorks settings
   - Navigate to Tools > Options > and reset the suppressed dialogs

4. **Use unique component folders per board**:
   - If a Common Comp Folder is not feasible
   - Use separate component folders for each board
   - This prevents ID conflicts but requires more storage

### Community Report

> "This happens when several boards with the same set of components are used in a device assembly AND IF there is no common component folder set up in CoDesigner's settings. The solution is to choose 'Accept this file anyway' or to set the Common Comp Folder in CoDesigner's settings."

## 3. AddALU_items Failed from Insufficient Workspace Permissions

### Error Message

"AddALU_items Failed"

### Symptom

When an MCAD user tries to push changes from SolidWorks to Altium Designer, the operation fails with "AddALU_items Failed." The MCAD user can pull designs from Altium but cannot push changes back.

### Root Cause

The MCAD user does not have the required workspace permissions. The Workspace Administrator must invite the MCAD user to the workspace and grant appropriate permissions. Without write permissions, the MCAD user can only pull (read) but not push (write) changes.

### Fix

1. **Verify workspace membership**:
   - The Workspace Administrator must invite the MCAD user to the workspace
   - Check that the MCAD user's email is correct in the workspace member list
   - Ensure the MCAD user has accepted the invitation

2. **Grant appropriate permissions**:
   - The Workspace Administrator grants permissions from the workspace admin panel
   - The MCAD user needs "Edit" or "Author" permissions, not just "Read"
   - Check the specific CoDesigner permissions in the admin panel

3. **Verify subscription features**:
   - Confirm that MCAD CoDesigner features are included in the subscription
   - Check the Altium 365 subscription plan supports MCAD collaboration
   - Some features require higher subscription tiers:
     - Advanced Copper Geometry
     - Rigid-Flex Synchronization
     - MCAD-Driven Component Placement
     - Enclosure Exchange
     - Multiboard Assembly Synchronization

4. **Check compatibility matrix**:
   - Verify that Altium Designer, MCAD software, and MCAD CoDesigner versions are compatible
   - Check the compatibility matrix on Altium's website
   - Download the correct plugin version if needed

5. **Verify plugin installation**:
   - Check that the correct MCAD CoDesigner plugin version is installed
   - Download from the Altium Downloads page if a different version is needed
   - Verify plugin settings are configured correctly

### Community Report

> "This error commonly indicates that the user does not have the required workspace permissions. The Workspace Administrator must invite the MCAD user to the workspace and grant the appropriate permissions."

## 4. Components Shifted from Negative Coordinates in SolidWorks

### Symptom

After pulling a PCB design from Altium into SolidWorks via CoDesigner, components are shifted or positioned incorrectly. The assembly doesn't match the layout in Altium Designer.

### Root Cause

SolidWorks allows negative coordinates, but Altium Designer cannot place components in negative coordinates. If the MCAD user moves the board or components into negative coordinates in SolidWorks, the positions become invalid when pushed back to Altium. CoDesigner uses the absolute Origin to place components.

### Fix

1. **Work in positive coordinates in MCAD**:
   - "It is important to work in positive co-ordinates in MCAD because Altium Designer cannot place in negative co-ordinates"
   - Keep the board origin at (0,0,0) or in positive space
   - Don't move the board or components into negative coordinates

2. **Use the absolute Origin for placement**:
   - "MCAD CoDesigner uses the absolute Origin to place components"
   - Don't change the origin in SolidWorks after pulling the design
   - If the origin must be changed, regenerate the assembly from Altium

3. **Regenerate the assembly if shifted**:
   - If components are already shifted, the assembly needs to be regenerated
   - "This can cause issues and the assembly will need to be generated again"
   - Delete the current assembly in SolidWorks
   - Pull the design from Altium into a new folder

4. **Check MCAD templates**:
   - "This can also be caused by incompatible templates in MCAD"
   - Verify that the SolidWorks template used for CoDesigner is correct
   - Check template paths in CoDesigner settings
   - Use the recommended template from Altium documentation

5. **Verify template paths**:
   - "Verify that the MCAD template paths are configured correctly"
   - Pull the design into a new folder to test
   - If successful, replace the previous assembly generated with incorrect templates

### Community Report

> "It is important to work in positive co-ordinates in MCAD because Altium Designer cannot place in negative co-ordinates. MCAD CoDesigner uses the absolute Origin to place components. If a region is shifted to negative coordinates in MCAD then this can cause issues."

## 5. SOLIDWORKS Decal Rendering Issues from Graphics Card Compatibility

### Symptom

Decals on components in SolidWorks don't display correctly after pulling from Altium CoDesigner. Decals may appear blank, distorted, or missing.

### Root Cause

Decal rendering in SolidWorks depends on graphics card and driver compatibility. The Enhanced Graphics Performance setting in SolidWorks can also affect decal rendering. Additionally, the "Store appearance, decal and scene data in model" document property may not be enabled.

### Fix

1. **Verify graphics card and driver compatibility**:
   - "Verify that your graphics card and driver are supported by SOLIDWORKS"
   - Check the SolidWorks certified graphics card list
   - Update to the latest certified driver
   - Use SolidWorks Rx to check graphics system status

2. **Adjust Enhanced Graphics Performance**:
   - "Enable or disable the Enhanced Graphics Performance under System > Performance"
   - Try toggling this setting and restart SolidWorks
   - One state may fix decal rendering while the other breaks it

3. **Enable Use Software OpenGL**:
   - If hardware OpenGL is causing issues, enable Software OpenGL
   - "Enable Use Software OpenGL" in SolidWorks settings
   - This bypasses the graphics driver for rendering
   - Performance will be slower but decals should display correctly

4. **Enable Store appearance, decal and scene data**:
   - In SolidWorks: Settings > Document Properties > Model Display
   - Enable "Store appearance, decal and scene data in model"
   - This ensures decal data is saved with the model file
   - Without this, decals may not transfer through CoDesigner

5. **Disable conflicting third-party plugins**:
   - "Another third-party plugin may be interfering with operation"
   - Temporarily disable other add-ins in SolidWorks
   - Tools > Add-Ins > clear checkboxes under Active Add-ins
   - Re-enable add-ins one by one to identify conflicts

### Community Report

> "If decals do not display correctly, it may be a rendering issue in SOLIDWORKS. Verify that your graphics card and driver are supported. Adjust Enhanced Graphics Performance under System > Performance, then restart SOLIDWORKS. If the issue persists, enable Use Software OpenGL."

## 6. Additional CoDesigner Issues

### Board Part is Missing, Local Design is Invalid

**Issue**: CoDesigner reports "Board Part is missing, local design is invalid."
**Fix**: Pull the design from Altium into a new folder. The local cache may be corrupted. Delete the local assembly and re-pull.

### Unable to Import Model of Component XXX

**Issue**: "Unable to import model of component XXX. The model is replaced with a bounding box."
**Fix**: The 3D model file for the component is missing or corrupted. Verify the model exists in the Altium workspace. Re-link the model in Altium Designer.

### SOLIDWORKS Feature Creation Restrictions

**Issue**: Creating multiple features in a single sketch (e.g., 4 mounting holes in one sketch) causes errors when pushing back to Altium.
**Fix**: "You have to create each feature separately — 4 separate sketches/extruded cuts. This isn't necessarily a big deal but it's definitely contrary to the way any SOLIDWORKS user would naturally create these features."

### Licensing Difficulties

**Issue**: CoDesigner requires a network license even when Altium Designer uses a standalone license.
**Fix**: "I had to get a network licence for MCAD collaboration. I dread having to do a rebuild of my PC." Contact Altium support for licensing assistance. Document the setup process for future reinstalls.

### 3DExperience PLM Services Conflict

**Issue**: CoDesigner with SolidWorks 2024 and 3DExperience PLM Services creates assemblies but doesn't create the board.
**Fix**: 3DExperience PLM Services may interfere with CoDesigner's assembly creation. Test without 3DExperience integration. Contact Altium support for compatibility updates.

## Best Practices

1. **Add an extra configuration before SpeedPak** — preserves CoDesigner link properties
2. **Set up Common Comp Folder for multi-board assemblies** — prevents Internal ID mismatch
3. **Grant MCAD users Edit permissions** — prevents AddALU_items Failed
4. **Work in positive coordinates in SolidWorks** — prevents component shifting
5. **Use the absolute Origin for component placement** — don't change origin after pulling
6. **Verify SolidWorks template paths** — incompatible templates cause positioning errors
7. **Enable Store appearance, decal and scene data** — ensures decals transfer through CoDesigner
8. **Disable conflicting SolidWorks add-ins** — identifies plugin conflicts
9. **Create features separately (one sketch per feature)** — prevents push-back errors
10. **Document the licensing setup process** — simplifies future reinstalls
