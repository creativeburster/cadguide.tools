---
title: "BobCAD-CAM Post Processor and Posting Errors: V36 Post Processor Not Posting Tool List from output_tool_list Commented Out Requiring Uncomment, Posting Window Blank from Unmounted Window or Missing C++ Redistributable Requiring Remount or vcredist Install, CL File Not Found from Old Version NC Path Requiring Current Settings Update, Grooving G71 Canned Cycle Rapids Along Profile with No Clearance Requiring G01 Move Fix, and Exception Raised in Calculation Routine from Machine Tolerance or Step Over Requiring Parameter Adjustment"
excerpt: "BobCAD-CAM fails for 5 distinct reasons: V36 post processor not posting tool list from output_tool_list commented out requiring uncomment, posting window blank from unmounted window or missing C++ redistributable requiring remount or vcredist install, CL file not found from old version NC path requiring current settings update, grooving G71 canned cycle rapids along profile with no clearance requiring G01 move fix, and exception raised in calculation routine from machine tolerance or step over requiring parameter adjustment. We cover each with fixes from Practical Machinist and BobCAD Support."
category: "post-processor-and-posting-errors"
softwareSlug: "bobcad-cam"
keyword: "BobCAD-CAM V36 post processor not posting tool list output_tool_list commented out uncomment posting window blank unmounted C++ redistributable vcredist CL file not found old version NC path current settings grooving G71 canned cycle rapids profile no clearance G01 exception raised calculation routine machine tolerance step over parameter adjustment"
slug: "bobcad-cam-post-processor-posting-errors-v36-tool-list-commented-posting-window-blank-unmounted-cpp-redistributable-cl-file-not-found-old-version-grooving-g71-rapids-profile-g01-exception-calculation-routine-tolerance-step-over"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-07-31"
sources:
  - "https://www.practicalmachinist.com/forum/threads/bobcad-v36-post-processor-not-posting-tool-list.418295/"
  - "https://bobcad.com/editing-a-post-processor-in-bobcad-cam/"
  - "https://bobcadsupport.com/knowledgebase/posting-window-is-blank-no-g-code-showing/"
---

# BobCAD-CAM Post Processor and Posting Errors: V36 Post Processor Not Posting Tool List from output_tool_list Commented Out Requiring Uncomment, Posting Window Blank from Unmounted Window or Missing C++ Redistributable Requiring Remount or vcredist Install, CL File Not Found from Old Version NC Path Requiring Current Settings Update, Grooving G71 Canned Cycle Rapids Along Profile with No Clearance Requiring G01 Move Fix, and Exception Raised in Calculation Routine from Machine Tolerance or Step Over Requiring Parameter Adjustment

BobCAD-CAM's post processor configuration, posting window, file paths, canned cycles, and calculation routines produce errors from commented-out commands, missing dependencies, version migrations, and parameter issues. This guide covers the 5 most common BobCAD-CAM problems with diagnostic steps and community-verified fixes from Practical Machinist and BobCAD Support.

## 1. V36 Post Processor Not Posting Tool List from output_tool_list Commented Out

### Symptom

BobCAD-CAM V36 post processor doesn't output a tool list in the posted G-code. The V34 post processor works fine with the same job. Even the original unmodified V36 post processor doesn't show a tool list. No tool list appears anywhere in the post output.

### Root Cause

The V36 post processor has the `output_tool_list` command commented out with `//`. The line reads `//output_tool_list` instead of `output_tool_list`. This is a default setting in the V36 post processor. The V34 post processor had this line uncommented.

### Fix

1. **Uncomment the output_tool_list line**:
   - "In block 0 (zero) add or copy paste this on its own line: output_tool_list"
   - Open the post processor file (.BCPst) in a text editor
   - Find the line `//output_tool_list`
   - Remove the `//` to uncomment it
   - Save the file

2. **Verify in the post output**:
   - After uncommenting, post a job
   - The tool list should appear at the top:
   - `O100 (2HOLE MANDREL.NC)`
   - `(MACHINE SETUP - 1)`
   - `(T5 - 50.8 DIA. ENDMILL ROUGH)`
   - `(T8 - 12.7 DIA. ENDMILL ROUGH)`

3. **Check the original post processor**:
   - "The original post processor shows the line as: //output_tool_list"
   - "I went in and removed the block delete line // so it now reads: output_tool_list"
   - Always compare with a known working post processor
   - Keep backup copies

4. **Use V34 post as reference**:
   - "If I post the program using the older V34 post processor, it posts just fine"
   - Compare V34 and V36 post files
   - Identify all differences
   - Apply V34 settings to V36

### Community Report

> "BobCAD V36 post processor not posting tool list. Even using the original post, no tool list. In block 0 add: output_tool_list. The original post processor shows the line as //output_tool_list. I removed the // and now it posts the tool list. Why would you NOT want the tool list posting in your program?"

## 2. Posting Window Blank from Unmounted Window or Missing C++ Redistributable

### Symptom

After creating toolpath and posting, the posting window is blank — completely white with no G-code or numbers. This occurs in older versions (V33 and older). In newer versions, the posting window may show no output after posting.

### Root Cause

Two potential causes: (1) The posting window has become unmounted from the software UI — a known bug in older versions. (2) The C++ 2010 x86 redistributable is missing — the posting engine requires this specific version to generate G-code.

### Fix

1. **Remount the posting window**:
   - "Move the Posting window by holding left-click on the top bar"
   - "There will be arrows that pop up"
   - "Drag your cursor into one of the arrows and let go"
   - "This will mount it back into the software"

2. **Reset the UI layout**:
   - "Go to File > User Profile"
   - "Right-click on one of the 'Profile Layouts'"
   - "Select 'Load'"
   - This resets all windows to their default positions

3. **Refresh the screen**:
   - "Click on 'File' and then click back to the 'Home' tab"
   - "This refreshes the screen"
   - "You should now see the G-Code in the posting window after posting out"

4. **Install C++ 2010 x86 redistributable**:
   - "You need to make sure you have 2010 x86 installed"
   - "This is what the Posting Engine uses to post out the code"
   - Download from Microsoft: vcredist_x86.exe
   - Restart your computer after installation

5. **Complete reinstall for persistent issues**:
   - "Login to main Admin account and do a complete uninstall/reinstall"
   - This ensures all dependencies are installed
   - Don't install under a standard user account
   - Use the main Admin account

### Community Report

> "If you are having trouble seeing G-Code getting posted out, there are two potential issues. Issue 1: The Posting Window is blanked out — this is a known bug in older versions. Move the posting window by holding left-click and drag into an arrow to mount it. Issue 2: You need to install a C++ Redistributable — 2010 x86 is what the Posting Engine uses."

## 3. CL File Not Found from Old Version NC Path

### Symptom

Posting a toolpath produces: "CL file not found" or "C:\BobCAD-CAM Data\BobCAD-CAM V(old version)\NC\Mill\File_Name.clf NOT FOUND!!!" The NC file path references an old version directory that doesn't exist after upgrading.

### Root Cause

"Error can occur when the NC file path directory folder does not exist. This can happen if you are bringing your post over from an older version and it is still referencing the old file path." The post processor or current settings reference the old version's NC directory. After upgrading BobCAD-CAM, the old version's directory may be removed.

### Fix

1. **Update NC file path in Current Settings**:
   - "Set NC File Path to: C:\BobCAD-CAM Data\BobCAD-CAM V(current version)\NC\(Machine Type)"
   - Right-click CAM Defaults in CAM Tree > Current Settings
   - Go to Posting page
   - Update the NC file path to the current version

2. **Check post processor file paths**:
   - Open the post processor file (.BCPst)
   - Search for old version paths
   - Replace with current version paths
   - Save the file

3. **Create the missing directory**:
   - As a quick workaround
   - Create the old version directory structure
   - C:\BobCAD-CAM Data\BobCAD-CAM V(old version)\NC\Mill\
   - This allows posting to work temporarily

4. **Reassign the post processor**:
   - In Current Settings > Machine Parameters
   - Select the correct machine
   - In Posting page, assign the correct post processor
   - This ensures paths are updated

5. **Migrate settings properly when upgrading**:
   - When upgrading BobCAD-CAM versions
   - Use the migration tool to transfer settings
   - Don't manually copy post processors without updating paths
   - Verify all paths after migration

### Community Report

> "CLF Not Found: C:\BobCAD-CAM Data\BobCAD-CAM V(old version #)\NC\Mill\File_Name.clf NOT FOUND!!! Error can occur when the NC file path directory folder does not exist. This can happen if you are bringing your post over from an older version. Set NC File Path to: C:\BobCAD-CAM Data\BobCAD-CAM V(current version)\NC\(Machine Type)."

## 4. Grooving G71 Canned Cycle Rapids Along Profile with No Clearance

### Symptom

BobCAD V27 lathe with Fanuc 21_TB post. Using G71 canned cycle for grooving. When the main roughing cycle completes, the tool rapids along the cut part back to Z-33 following the profile with no clearance. This should be a G01 move, not rapid. The controller is an Adtech 9620.

### Root Cause

The post processor generates a rapid (G00) move instead of a feed (G01) move for the cleanup pass after the G71 roughing cycle. The post processor's G71 handling doesn't correctly set the feed rate for the profile return move. This is a post processor configuration issue specific to the Fanuc 21_TB post with the Adtech 9620 controller.

### Fix

1. **Edit the G-code manually**:
   - After posting, find the rapid move after the roughing cycle
   - Change G00 to G01 on the problematic line
   - Add the appropriate feed rate (F value)
   - This is a quick workaround

2. **Fix the post processor G71 handling**:
   - Open the post processor file (.BCPst)
   - Find the G71 canned cycle section
   - Enable debug mode: change `debug_off` to `debug_on`
   - Post a job and identify which block generates the rapid move
   - Change the rapid output to feed output in that block

3. **Use a different canned cycle**:
   - If G71 doesn't work correctly with this post
   - Use a different roughing strategy (e.g., multiple G01 passes)
   - This avoids the canned cycle post issue
   - Trade-off: more code, but correct feed rates

4. **Contact BobCAD support for post fix**:
   - The Fanuc 21_TB post may need updating
   - Contact BobCAD support with:
     - Post processor file
     - Sample G-code showing the issue
     - Controller model (Adtech 9620)
   - They can provide a corrected post

5. **Check controller compatibility**:
   - The Adtech 9620 may interpret G71 differently
   - Verify the controller's G71 implementation
   - Some controllers require specific G71 format
   - Adjust the post to match the controller's expectations

### Community Report

> "BobCAD V27 lathe with Fanuc 21_TB post. Having a slight issue with the G71 canned cycle. When the main roughing cycle has completed, the tool rapids along the cut part back to z-33 following the profile with no clearance. I think this should be a G01 move not rapid to clean up the part. My controller is an Adtech 9620."

## 5. Exception Raised in Calculation Routine from Machine Tolerance or Step Over

### Symptom

Posting a toolpath produces: "Exception raised in calculation routine (triax::mw3dTrimmerOn)." The toolpath calculation fails with an internal error. The error may reference polyline not found or issues with the toolpath generation.

### Root Cause

The calculation routine encounters an error in the 3D trimming algorithm. This can be caused by: incorrect machine tolerance settings, step over values that are too large or too small, geometry issues in the job, or incompatible feature parameters. The triax library handles 3D toolpath calculation and can fail with certain parameter combinations.

### Fix

1. **Adjust Machine Tolerance**:
   - "Try adjusting Machine Tolerance"
   - In Current Settings > Machine Parameters
   - Increase or decrease the tolerance value
   - Try values between 0.001 and 0.01

2. **Adjust Step Over**:
   - "Try adjusting Step over"
   - In the toolpath parameters
   - Reduce the step over value
   - Try 50% of tool diameter or less

3. **Check Job geometry**:
   - "Try adjusting geometry of Job"
   - Verify the geometry is clean (no self-intersections)
   - Check for duplicate surfaces
   - Simplify complex geometry

4. **Check feature parameters**:
   - Verify all feature parameters are valid
   - Check for zero or negative values
   - Ensure tool diameter is appropriate for the feature
   - Check stock definition

5. **Set non-zero radius for thread milling**:
   - "Can not build orthogonal vector on base, base and direction are colinear"
   - "Set the 'Radius' value on the Leads page to a non-zero number in the Mill Thread Feature"
   - Zero radius causes the vector calculation to fail
   - Set radius to a small non-zero value

6. **Recreate the feature**:
   - If adjusting parameters doesn't work
   - Delete and recreate the feature
   - Use different selection methods
   - Sometimes the feature definition is corrupted

### Community Report

> "Exception raised in calculation routine (triax::mw3dTrimmerOn). Try adjusting Machine Tolerance, Step over, geometry of Job, etc. Can not build orthogonal vector on base — set the 'Radius' value on the Leads page to a non-zero number in the Mill Thread Feature."

## 6. Additional BobCAD-CAM Issues

### Incorrect Cutter Compensation Definition

**Issue**: "Incorrect cutter compensation definition ('MW_CC_STOP' is missing)."
**Fix**: "Issue with Machine Definition of Machine. Go to Current Settings and review Machine Def. Make a new Plasma Virtual Machine and link the existing post processor to it."

### mfc100u.dll Not Found

**Issue**: "The code execution cannot proceed because mfc100u.dll was not found."
**Fix**: "Make sure 2010 x86 — 10.0.30319 or later is installed. Login to main Admin account and do a complete uninstall/reinstall. Manually register the dll on the main Admin account."

### Current Toolpath Not for 3-Axis Machine

**Issue**: "Current toolpath is not for 3-axis machine. Posting process exception."
**Fix**: "Select a machine that can be used for all toolpaths in the job. If the machine is selected correctly, there is a feature that cannot be used for a 3x machine. The Machine Origin Z-Axis should be facing upwards."

### Start Reading Post File Bad

**Issue**: "Start reading post file bad."
**Fix**: Check post processor file for corruption. In Current Settings > EDM Setup, check "Output Start Program." Reinstall the post processor from backup.

## Best Practices

1. **Check for commented-out commands in post processors** — `//output_tool_list` was the V36 default
2. **Keep backup copies of post processors before editing** — always work from backup
3. **Enable debug mode when editing posts** — change `debug_off` to `debug_on`
4. **Install C++ 2010 x86 redistributable** — required by the posting engine
5. **Update NC file paths after version upgrade** — old paths cause CL file not found
6. **Reset UI layout if posting window is blank** — File > User Profile > Load
7. **Adjust Machine Tolerance and Step Over for calculation exceptions** — most common fix
8. **Set non-zero radius on Leads page for thread milling** — prevents vector errors
9. **Use Admin account for installation** — prevents DLL registration issues
10. **Contact BobCAD support with post file and sample G-code** — for post-specific issues
