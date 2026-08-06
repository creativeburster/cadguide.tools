---
title: "SpaceDesign SketchUp Plugin Report and PDF Errors"
excerpt: "SpaceDesign SketchUp Plugin Report and PDF Errors: symptoms, root causes, and step-by-step fixes, verified against Render Plus Forum."
category: "troubleshooting"
softwareSlug: "sketchup"
keyword: "SpaceDesign SketchUp plugin bug splats attribute window version incompatibility SketchUp update 3D PDF creation crash IFXCOMInitialize error Acrobat reinstall system memory request failed large model U3D export model simplification Win32 API load error 64-bit mismatch correct version install SketchUp 2015 migration error module name change manual Ruby fix"
slug: "spacedesign-sketchup-plugin-report-and-pdf-errors"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-08-03"
sources:
  - "https://forum.irendernxt.com/forum/topics/bug-splats-in-spacedesign"
  - "https://forum.irendernxt.com/forum/topics/SpaceDesign++3D+PDF"
  - "https://renderplus.com/wk/Attributes_and_Reports.htm/"
---

# SpaceDesign SketchUp Plugin Report and PDF Errors: Bug Splats on Attribute Window from Version Incompatibility Requiring SketchUp Update, 3D PDF Creation Crash from IFXCOMInitialize Error Requiring Acrobat Reinstall, System Memory Request Failed from Large Model U3D Export Requiring Model Simplification, Win32 API Load Error from 64-Bit Mismatch Requiring Correct Version Install, and SketchUp 2015 Migration Error from Module Name Change Requiring Manual Ruby Fix

SpaceDesign's SketchUp integration, 3D PDF generation, U3D model export, 64-bit library loading, and version migration produce errors from version incompatibilities, COM initialization failures, memory exhaustion, architecture mismatches, and module name changes. This guide covers the 5 most common SpaceDesign problems with diagnostic steps and community-verified fixes from Render Plus Forum.

## 1. Bug Splats on Attribute Window from Version Incompatibility

### Symptom

After downloading and installing a new version of SpaceDesign, immediately getting 4 bug splats in a row as soon as clicking on the "SpaceDesign Attribute window." Using SketchUp Pro 7.1. The new version was built for SketchUp 8. Previous version had few bug splats. The attribute window is unusable.

### Root Cause

The new SpaceDesign version was built for a newer version of SketchUp than the one installed. The Ruby API calls and UI framework in the new SpaceDesign version use features not available in SketchUp 7.1. When SpaceDesign tries to call these unavailable APIs, SketchUp crashes with a bug splat. The attribute window uses WebDialog (SketchUp 7) or HtmlDialog (SketchUp 8+) — if the version mismatch is in the dialog framework, the crash is immediate.

### Fix

1. **Update SketchUp to the compatible version**:
   - Check SpaceDesign's compatibility requirements
   - Update SketchUp to the required version
   - SpaceDesign 2025 supports SketchUp 2021-2025

2. **Reinstall the previous SpaceDesign version**:
   - Download the version that worked
   - Uninstall the new version
   - Install the older compatible version

3. **Check version compatibility**:
   - Verify your SketchUp version is supported
   - Check the Extension Warehouse for compatibility info
   - Don't install versions for newer SketchUp

4. **Use SketchUp Extension Manager**:
   - Window > Extension Manager
   - Disable SpaceDesign
   - Re-enable after updating SketchUp
   - Or install a compatible version

5. **Contact Render Plus support**:
   - Report the bug splats
   - Include SketchUp version and SpaceDesign version
   - Ask for a compatible version
   - Render Plus may provide a legacy build

6. **Check the Ruby console**:
   - Window > Ruby Console
   - Open the attribute window
   - Check for error messages
   - The console shows the failing API call

### Community Report

> "Today I downloaded and installed space design JI28sd. I immediately got 4 'Bugsplats' in a row as soon as I clicked on the 'Space design Attribute window'. I'm still using Sketchup Pro 7.1. I'm curious if JI28sd was built just for sketchup 8? I've had a few bugsplats in version JI20sd but not at all like this new version. I will reinstall JI20sd if that is the only upgrade."

## 2. 3D PDF Creation Crash from IFXCOMInitialize Error

### Symptom

Using the trial version of RPS 3D PDF in SpaceDesign. Every time trying to create a PDF, the application closes with an error window. The error message is: "IFXCOMInitialize Error (0x80000003), Please try Again." SketchUp closes immediately after the error. The installation had one blue screen but succeeded on the second try.

### Root Cause

The IFXCOMInitialize error (0x80000003) indicates that the 3D PDF component cannot initialize the Adobe Acrobat COM interface. This happens when: (1) Adobe Acrobat is not installed or is an incompatible version, (2) Acrobat's COM components are not registered properly, (3) Acrobat was updated and the COM interface changed, (4) the 3D PDF library is looking for a specific Acrobat version that's not present. The 0x80000003 code is a breakpoint exception, meaning the COM initialization hit a debug breakpoint or assertion failure.

### Fix

1. **Reinstall Adobe Acrobat Pro**:
   - Uninstall Acrobat completely
   - Reinstall the latest version
   - Ensure 64-bit Acrobat if using 64-bit SketchUp

2. **Register Acrobat COM components**:
   - Run Command Prompt as Administrator
   - `regsvr32 "C:\Program Files\Adobe\Acrobat\Acrobat.exe"`
   - Or use Acrobat's repair function
   - Restart SketchUp after registering

3. **Check Acrobat version compatibility**:
   - SpaceDesign 3D PDF requires specific Acrobat versions
   - Check Render Plus documentation for compatible versions
   - Acrobat Reader may not be sufficient
   - Acrobat Pro may be required

4. **Run SketchUp as Administrator**:
   - Right-click SketchUp shortcut
   - This gives SpaceDesign permission to access COM
   - Test if the PDF creation works

5. **Update SpaceDesign to latest version**:
   - Download the latest SpaceDesign version
   - Check for 3D PDF component updates
   - The COM initialization may be fixed
   - Install the latest build

6. **Check Windows COM settings**:
   - Component Services > Computers > My Computer > DCOM Config
   - Find Adobe Acrobat COM component
   - Check permissions
   - Ensure the current user has access

7. **Use alternative PDF export**:
   - If 3D PDF continues to fail
   - Export the model as OBJ or DAE
   - Use Acrobat 3D Toolkit to create the 3D PDF
   - Or use a different 3D PDF tool

### Community Report

> "I downloaded the trial version of RPS 3D PDF. I had only one blue screen, but the installation was ok on the next try. I've opened SketchUp successfully, but every time I try to create a PDF, the app closes with that error window. IFXCOMInitialize Error (0x80000003), Please try Again. I have Adobe Acrobat Pro X."

## 3. System Memory Request Failed from Large Model U3D Export

### Symptom

While running RPS 3D PDF, the error appears: "Cannot save U3D model file for 3D PDF. Error returned: System memory request failed." The error occurs when trying to create a 3D PDF from a large SketchUp model. The U3D export process fails because it can't allocate enough memory for the model data.

### Root Cause

The U3D model export requires significant memory to convert the SketchUp geometry into the U3D format. Large models with many faces, textures, and components exceed available memory. The 32-bit SketchUp has a ~4GB memory limit. Even 64-bit SketchUp may run out of memory if the model is very large. The U3D exporter tries to load the entire model into memory for conversion, which fails for large models.

### Fix

1. **Simplify the model**:
   - Reduce the number of faces
   - Simplify geometry
   - Remove unnecessary details
   - Use simpler component representations

2. **Reduce texture sizes**:
   - Large textures consume significant memory
   - Reduce texture resolution
   - Remove unused textures
   - Purge unused materials

3. **Purge unused components**:
   - Window > Model Info > Statistics > Purge Unused
   - Remove unused component definitions
   - Remove unused materials and layers
   - This reduces memory usage

4. **Use 64-bit SketchUp**:
   - If using 32-bit SketchUp
   - Upgrade to 64-bit version
   - 64-bit can access more memory
   - This may resolve the memory limit

5. **Export in sections**:
   - Split the model into smaller sections
   - Export each section separately
   - Combine the U3D files in Acrobat
   - This avoids the memory limit

6. **Close other applications**:
   - Free up system memory
   - Close browsers and other applications
   - Check Task Manager for memory usage
   - Ensure maximum available memory

7. **Reduce polygon count**:
   - Use the Simplify Contours extension
   - Reduce polygon count in components
   - Use proxy objects for complex geometry
   - This reduces U3D export memory

8. **Update SpaceDesign**:
   - Check for SpaceDesign updates
   - The U3D exporter may be optimized
   - Newer versions may handle large models better
   - Install the latest build

### Community Report

> "I received this Error message while running RPS 3D PDF Version: NJ15p 3.0. Error: Cannot save U3D model file for 3D PDF. Error returned: System memory request failed."

## 4. Win32 API Load Error from 64-Bit Mismatch

### Symptom

After downloading SpaceDesign to test it, the error message appears: "Load Error loading: - no such file to load - win32API." Using 64-bit SketchUp on a 64-bit Windows system. The plugin fails to load entirely.

### Root Cause

The error occurs because the SpaceDesign version being used is a 32-bit build, but SketchUp is running as 64-bit. The 32-bit Ruby library `win32API` is not available in 64-bit SketchUp. The Ruby `win32API` module was deprecated in newer Ruby versions used by 64-bit SketchUp. The plugin's code references `win32API` which doesn't exist in the 64-bit Ruby environment.

### Fix

1. **Install the 64-bit SpaceDesign version**:
   - Download the 64-bit version of SpaceDesign
   - Don't use the 32-bit version with 64-bit SketchUp
   - Check the download page for 64-bit option

2. **Update to latest SpaceDesign**:
   - Newer versions use `Fiddle` instead of `win32API`
   - `Fiddle` is the modern Ruby library for native calls
   - Update to the latest SpaceDesign build
   - This should resolve the load error

3. **Check SketchUp Ruby version**:
   - SketchUp 2023+ uses Ruby 3.x
   - `win32API` was removed in Ruby 3.x
   - Use a SpaceDesign version compatible with Ruby 3.x
   - Check the Extension Warehouse for compatibility

4. **Manually replace win32API with Fiddle**:
   - For advanced users
   - Edit the Ruby file that requires `win32API`
   - Replace `require 'win32API'` with `require 'fiddle'`
   - Update the API calls accordingly

5. **Use an older SketchUp version**:
   - If you need the 32-bit SpaceDesign
   - Use SketchUp 2017 (32-bit)
   - Or SketchUp 8 (32-bit)
   - This supports the `win32API` module

6. **Contact Render Plus support**:
   - Report the `win32API` load error
   - Include SketchUp version and bitness
   - Ask for a compatible version
   - Render Plus provides version-specific builds

### Community Report

> "I have the version NB21spd downloaded to test it. Now I get the error message 'Load Error loading: - no such file to load - win32API.' I have 64bit installed."

## 5. SketchUp 2015 Migration Error from Module Name Change

### Symptom

After upgrading from SketchUp 8 to SketchUp 2015 and installing the new version of SpaceDesign (NK05), an error appears on startup. The error is related to a module name mismatch. The plugin doesn't load properly. The error message indicates a text error with `MD_RPS_Ruby` vs `MD_SpaceDesign_Ruby`.

### Root Cause

"It seems to be a simple text error, replacing MD_RPS_Ruby with MD_SpaceDesign_Ruby allowed me to load and use the plugin mostly normal again." The SpaceDesign plugin's module name was changed from `MD_RPS_Ruby` to `MD_SpaceDesign_Ruby` in the NK05 version. However, some internal references still use the old module name. When SketchUp 2015 loads the plugin, it encounters the mismatch and fails to load. This is a packaging bug in the SpaceDesign installer.

### Fix

1. **Manually fix the module name**:
   - Open the SpaceDesign Ruby files in a text editor
   - Find references to `MD_RPS_Ruby`
   - Replace with `MD_SpaceDesign_Ruby`
   - Save and restart SketchUp

2. **Update to the latest SpaceDesign version**:
   - The module name bug may be fixed
   - Download the latest version from Render Plus
   - Install over the current version
   - Check if the error is resolved

3. **Clean install**:
   - Uninstall SpaceDesign completely
   - Remove all SpaceDesign files from the Plugins folder
   - Delete SpaceDesign registry entries
   - Reinstall the latest version

4. **Check the Ruby console**:
   - Window > Ruby Console
   - Look for the specific error message
   - Identify which file has the mismatch
   - Fix that specific file

5. **Contact Render Plus**:
   - Report the module name mismatch
   - Include the exact error message
   - Include your SketchUp version
   - Render Plus may provide a fixed build

6. **Use the previous version**:
   - If the new version doesn't work
   - Reinstall the previous SpaceDesign version
   - Wait for a fixed release
   - Check the forum for updates

### Community Report

> "After trying to install the new version of SpaceDesign [NK05] I got this error. It seems to be a simple text error, replacing MD_RPS_Ruby with MD_SpaceDesign_Ruby allowed me to load and use the plugin mostly normal again."

## 6. Additional SpaceDesign Issues

### Transparent Background PDF Issue

**Issue**: "When I select a transparent background from your software dialog box, the finished PDF displays the Adobe worded background."
**Fix**: Check PDF settings. Use Acrobat's transparency settings. Update SpaceDesign. Contact Render Plus support.

### OpenGL Artifacts in Component Placement

**Issue**: "Our Component Placement Wizard leaves artifacts on the SketchUp drawing window."
**Fix**: "Check this box to turn off OpenGL previewing of components." Use the "Use OpenGL for Place Symbol Dialog" option in SpaceDesign settings.

### Trial Expired Before Testing Complete

**Issue**: "Now our Trial has expired but we are not done testing. Is it possible to extend the trail for another 3?"
**Fix**: Contact Render Plus support. Request trial extension. Provide your testing feedback. They typically extend trials.

### Report Format Issues

**Issue**: Report formatting doesn't match expected output.
**Fix**: Use the Report Wizard to define format. Check attribute format settings. Use "Load Format" to load a saved format. Adjust column widths and decimals.

### Dynamic Component Attribute Issues

**Issue**: "Dynamic Component attributes are preceded by DC:. You can report on them, but need to use the Dynamic Component editor to change their values."
**Fix**: Use Dynamic Component editor for DC values. Use SpaceDesign for custom attributes. Report on both types. Use $count, $name, $description for standard fields.

### Extension Warehouse Compatibility

**Issue**: "SketchUp Compatibility: SketchUp 2025, 2024, 2023, 2022, 2021"
**Fix**: Check Extension Warehouse for your SketchUp version. Don't install on unsupported versions. Update SketchUp or use compatible SpaceDesign version.

## Best Practices

1. **Verify SketchUp version compatibility before installing** — prevents bug splats
2. **Use the correct 64-bit or 32-bit SpaceDesign build** — prevents Win32 API errors
3. **Install Adobe Acrobat Pro for 3D PDF functionality** — prevents IFXCOMInitialize errors
4. **Simplify large models before U3D export** — prevents system memory request failures
5. **Purge unused components and textures before reporting** — reduces memory usage
6. **Check the Ruby Console for error messages** — identifies the failing component
7. **Update SpaceDesign to the latest version** — fixes module name and compatibility bugs
8. **Use the Report Wizard for custom report formats** — ensures correct output
9. **Contact Render Plus support for trial extensions** — they accommodate testing needs
10. **Keep both SpaceDesign and SketchUp updated** — ensures ongoing compatibility
