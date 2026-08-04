---
title: "Enscape Custom Asset Library and HDRI Skybox Errors: Custom Assets Not Showing from SourceDirectory Does Not Exist Requiring Local Folder Configuration, Assets Not Showing Up Post Upgrade from 4.10 to 4.11 Requiring Save As in New Folder, Custom Asset Import Scale Too Large Requiring Metric FBX Export, HDRI Skybox Cannot Be Scaled Requiring Model Scale Instead, and Custom Asset Location Not Recognized After Update from Cloud or Network Path"
excerpt: "Enscape fails for 5 distinct reasons: custom assets not showing from SourceDirectory does not exist requiring local folder configuration, assets not showing up post upgrade from 4.10 to 4.11 requiring Save As in new folder workaround, custom asset import scale too large requiring metric FBX export from source software, HDRI Skybox cannot be scaled because 360 sphere covers entire view requiring model scale instead, and custom asset location not recognized after update from cloud or network path. We cover each with fixes from Chaos Forums."
category: "troubleshooting"
softwareSlug: "enscape"
keyword: "Enscape custom assets not showing SourceDirectory does not exist local folder configuration assets not showing post upgrade 4.10 4.11 Save As new folder custom asset import scale too large metric FBX export HDRI Skybox cannot be scaled 360 sphere model scale custom asset location not recognized cloud network path"
slug: "enscape-custom-asset-library-hdri-skybox-errors-sourcedirectory-not-exist-local-folder-assets-not-showing-post-upgrade-save-as-new-folder-import-scale-metric-fbx-hdri-cannot-scale"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://forums.chaos.com/t/custom-assets-not-showing-in-custom-asset-library/179213"
  - "https://forums.chaos.com/t/version-4-11-0-162-enscape-assets-not-showing-up-post-upgrade/180421"
  - "https://forums.chaos.com/t/skybox-hdri-images-scale-and-position/179798"
---

# Enscape Custom Asset Library and HDRI Skybox Errors: Custom Assets Not Showing from SourceDirectory Does Not Exist Requiring Local Folder Configuration, Assets Not Showing Up Post Upgrade from 4.10 to 4.11 Requiring Save As in New Folder, Custom Asset Import Scale Too Large Requiring Metric FBX Export, HDRI Skybox Cannot Be Scaled Requiring Model Scale Instead, and Custom Asset Location Not Recognized After Update from Cloud or Network Path

Enscape's custom asset library, upgrade compatibility, and HDRI skybox produce errors from directory configuration, version migration, and scale issues. This guide covers the 5 most common Enscape problems with diagnostic steps and community-verified fixes from Chaos Forums.

## 1. Custom Assets Not Showing from SourceDirectory Does Not Exist

### Error Message

"SourceDirectory does not exist"

### Symptom

Creating a new custom asset in Enscape. The export process states it is successful, but the asset doesn't show in the custom asset library. When opening the asset library, the error "SourceDirectory does not exist" appears. The source and output directory configuration may be incorrect.

### Root Cause

The Custom Asset Editor requires a local folder as the source directory. If the directory is on a cloud-synced folder (OneDrive, Google Drive), a network path, or doesn't exist, Enscape can't find the exported asset files. The Custom Asset Editor configuration must point to an existing local folder with proper read/write permissions.

### Fix

1. **Use a local folder, not cloud or network**:
   - "It should be a local folder that's on your computer, so not somewhere in the cloud"
   - "It should exist, so when you open it in Explorer there should be a folder there"
   - Use a path like `C:\EnscapeAssets\` not `C:\Users\OneDrive\EnscapeAssets\`

2. **Follow the Custom Asset Editor configuration**:
   - Follow the "Configuration of Custom Asset Editor" instructions
   - Set Source Directory to a local folder
   - Set Output Directory to a different local folder
   - Ensure both directories exist and have write permissions

3. **Check folder permissions**:
   - "All Enscape knows is that there seems to be no folder at that location, or it's not accessible due to lacking connection or rights"
   - Right-click the folder > Properties > Security
   - Ensure the current user has Full Control
   - Run Enscape as administrator to test

4. **Submit a support request with logs**:
   - "Please submit a dedicated support report (including logs)"
   - Use the "Submit a Request" button in Enscape
   - This sends log files and machine information to Chaos support

5. **Reinstall the Custom Asset Editor**:
   - Download the latest Custom Asset Editor from Chaos
   - Uninstall the old version, install the new version
   - Reconfigure source and output directories

### Community Report

> "Every time I go through the process and export the asset, it states successful, however the asset does not show. I get 'SourceDirectory does not exist.' It should be a local folder on your computer, not somewhere in the cloud."

## 2. Assets Not Showing Up Post Upgrade from 4.10 to 4.11

### Symptom

After updating Enscape from 4.10.0.464 to 4.11.0.162, assets no longer load into existing files. Standard assets (Sofa 009, Sofa 002) cannot be placed in new files either. The placement preview is shown, but when clicking Apply, nothing appears in Enscape (though it appears in the host CAD program). Deleting offline assets and temp folders doesn't help.

### Root Cause

Version 4.11 introduced changes to the asset loading system. Existing project files contain asset references that use the old format. The new version can't resolve these references. The issue was partially addressed in later updates (4.2.1.8). The asset database in `%temp%\Enscape` may be corrupted.

### Fix

1. **Save As the file in a new folder**:
   - "Save the file in a different folder and launch Enscape"
   - "If the issue persists, try enabling some options in General Settings, then use Save As in another folder"
   - "That usually resolves it. Why? I don't know..."
   - This is the most reliable workaround

2. **Enable Ray Traced Artificial Lighting**:
   - "As soon as I enabled the 'Ray traced artificial lighting' option, the error stopped appearing"
   - "Maybe a workaround for some that have the right hardware"
   - Enable in Visual Settings > Lighting

3. **Launch Enscape twice**:
   - "Open the file, launch Enscape, with errors on the first try, but it works on the second try"
   - Close Enscape, relaunch from the same file

4. **Clean reinstall**:
   - Delete: `%temp%\Enscape`, `%appdata%\Enscape`, `%localappdata%\Enscape`
   - Reinstall Enscape from scratch
   - Reconfigure asset library locations

5. **Reinstall Cosmos to latest version**:
   - "Please make sure to follow all steps including reinstalling Cosmos to its latest version"
   - Cosmos is the asset delivery system
   - Download and install the latest Cosmos version

6. **Roll back to previous version**:
   - "I will go back to version 4.9 and stay there until my license runs out"
   - If the issue is critical and no workaround helps
   - Wait for a fixed update before upgrading

### Community Report

> "I updated Enscape from 4.10.0.464 and now assets are no longer loading. The preview is shown but when I hit apply, nothing shows up in Enscape but in Rhino! Save the file in a different folder and launch Enscape — that usually resolves it."

## 3. Custom Asset Import Scale Too Large

### Symptom

When importing a custom 3D model as an Enscape asset, it comes in very large. The user must correct the scale every time the asset is placed. The preview zoomes out so far that geometry cannot be seen.

### Root Cause

The FBX export from the source software uses a different unit system than Enscape expects. If the model is exported in inches but Enscape interprets it as meters, the scale is off by 39x. The Custom Asset Editor doesn't automatically convert units.

### Fix

1. **Use metric units when exporting FBX**:
   - "When it comes to scale, I make sure I use metric when I make the final save to FBX"
   - In SketchUp: export as FBX with meters as the unit
   - In 3ds Max: set system units to meters before FBX export
   - In Blender: set scene units to metric (meters) before export

2. **Set scale during custom asset import**:
   - "You can assign the desired scaling during custom asset import"
   - In the Custom Asset Editor, set the scale factor
   - "This way you don't have to change the scale whenever you're placing the asset"

3. **Check export settings of source software**:
   - "If you'd like to affect the scale of the model even before that, look at the export settings"
   - SketchUp: File > Export > FBX > Options > Units: Meters
   - 3ds Max: FBX Export > Advanced Options > Units > Centimeters
   - Blender: FBX Export > Transform > Scale: 1.0

4. **Use SketchUp as intermediary for asset creation**:
   - "Mainly I am using Sketchup to model my assets, apply materials to specific faces, and convert to FBX"
   - "Then I create the custom asset in Enscape, making sure to map the textures to the correct file"
   - SketchUp has reliable FBX export with unit control

5. **Zoom to fit in preview window**:
   - "In Enscape, you can use 4, 6, 8, 2 on your numpad"
   - These controls adjust the preview camera

### Community Report

> "Every time I import it comes in very large and I have to correct the scale. When it comes to scale, I make sure I use metric when I make the final save to FBX."

## 4. HDRI Skybox Cannot Be Scaled

### Symptom

Imported HDRI skybox images render too large in scale. Buildings in the HDRI background appear gigantic compared to the 3D model. No scale or height adjustment controls are available in Enscape.

### Root Cause

An HDRI skybox maps to a full 360-degree sphere by definition. The sphere covers the entire view — it can't be scaled smaller without creating visible borders and distortion. Enscape currently only offers HDRI rotation and brightness controls, not scale or height.

### Fix

1. **Scale the model, not the HDRI**:
   - "It looks like the best way is to scale the model than the image"
   - If the HDRI looks too large, the model may be too small
   - Check model units and scale the model up

2. **Understand HDRI sphere limitations**:
   - "You can't really scale a 360 background as by definition it needs to cover the entire 360 sphere"
   - "If you scale it down, you'll see a border/edge where it ends and distortion"

3. **Edit HDRI in Photoshop as workaround**:
   - "Make the canvas bigger (try 200%) while keeping the proportion the same"
   - "In Enscape the background will look 'smaller' but you'll see where the image ends"
   - Partial workaround with visible borders

4. **Request HDRI scale and height controls**:
   - "Add two new sliders: HDRI Size (Scale) and HDRI Height"
   - Vote for feature requests on Chaos Forum
   - No current timeline for implementation

5. **Use Enscape Sky instead of HDRI for scale control**:
   - Enscape's built-in Sky system has proper scale
   - Add background buildings as 3D geometry instead of HDRI

6. **Choose HDRI images with distant horizons**:
   - "Less noticeable if it is just a distant horizon"
   - Avoid HDRIs with close-up buildings or objects

### Community Report

> "Most imported HDRI images render too large in scale. You can't really scale a 360 background as by definition it needs to cover the entire 360 sphere. It looks like the best way is to scale the model than the image."

## 5. Custom Asset Location Not Recognized After Update

### Symptom

After an Enscape update, older custom assets are no longer recognized. The saved location isn't being found. Placeholders in project files link to custom assets that are no longer connected.

### Root Cause

Enscape updates may change the default asset library location or the configuration file format. The old location path is stored in the project file but the actual assets may have moved during the update.

### Fix

1. **Reconnect the old custom asset library location**:
   - "Connect an older custom asset library location"
   - In Enscape Settings, navigate to Custom Asset Library
   - Browse to the old folder location and re-link

2. **Delete placeholders and re-place assets**:
   - "Delete that placeholder from the project file and re-place the asset"
   - Remove the broken placeholder from the project
   - Place the asset again from the reconnected library

3. **Relocate material storage folder**:
   - "Click the settings icon in the bottom left corner of the Enscape Material Editor"
   - Change the material storage location to a local folder

4. **Keep assets in a consistent local location**:
   - Don't move the asset library folder after creating assets
   - Use a dedicated folder like `C:\EnscapeAssets\`
   - Back up this folder regularly

5. **Check for cloud sync interference**:
   - "I have 30 some folders on my Documents folder"
   - Documents folder may be synced by OneDrive
   - Move assets to a non-synced folder

6. **Use individual folders for imported materials**:
   - "When importing a new material from the Enscape Material Library, it will be stored in its own individual folder"
   - "This is meant to prevent unwanted duplicates overriding each other"
   - Don't consolidate material folders manually

### Community Report

> "When I try to access older custom assets, the saved location isn't being recognized. This indicates a placeholder linking to a custom asset that is no longer connected. Connect an older custom asset library location, or delete that placeholder and re-place the asset."

## 6. Additional Enscape Issues

### Custom Assets Not Rendering After Update 4.2.0

**Issue**: Custom assets work but standard Enscape assets don't render after update to 4.2.0.
**Fix**: "This was fixed on the latest vEnscape-4.2.1.8 update." Update to the latest version.

### Wireframe Proxies Visible in Host CAD

**Issue**: Enscape assets not visible in Enscape window but wireframe proxies visible in Vectorworks/Rhino.
**Fix**: Use Save As in a new folder. Enable Ray Traced Artificial Lighting. Clean reinstall if needed.

### Licensing Issues After Update

**Issue**: "Sometimes it even doesn't read the licenses" after update.
**Fix**: Sign out and sign back in to Chaos account. Check license status in Enscape Settings.

### Can't Edit Cloud-Saved Custom Assets

**Issue**: "I can create custom assets and save them to the cloud, but I can't edit them anymore."
**Fix**: Edit assets locally, then sync to cloud. Cloud-stored assets may be read-only.

## Best Practices

1. **Use local folders for custom assets** — not cloud or network paths
2. **Follow Custom Asset Editor configuration** — set source and output directories
3. **Save As in a new folder after upgrades** — resolves asset loading issues
4. **Export FBX in metric units** — prevents scale issues on import
5. **Set scale factor during custom asset import** — avoids per-placement scaling
6. **Don't scale HDRI — scale the model instead** — HDRI sphere can't be resized
7. **Use HDRI images with distant horizons** — minimizes scale mismatch
8. **Keep asset library in a consistent location** — don't move after creating
9. **Back up custom asset folders regularly** — prevents loss from updates
10. **Wait for version 4.2.1.8+ before upgrading** — fixes asset loading issues
