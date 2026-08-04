---
title: "BobCAD-CAM Post Processor and Posting Errors"
excerpt: "BobCAD-CAM Post Processor and Posting Errors: symptoms, root causes, and step-by-step fixes, verified against BobCAD Support and Practical Machinist forums."
category: "manufacturing"
softwareSlug: "bobcad-cam"
keyword: "BobCAD-CAM V36 tool list output_tool_list commented out blank posting window unmounted C++ Redistributable V25 absolute incremental IJ arc block 222 CLF not found MFC140u dll"
slug: "bobcad-cam-post-processor-and-posting-errors-v36-tool-list-not"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
---

# BobCAD-CAM Post Processor and Posting Errors: V36 Tool List Not Posting from Commented-Out output_tool_list, Blank Posting Window from Unmounted UI Panel or Missing C++ Redistributable, V25 Absolute I/J Arc Values Instead of Incremental from Block 222 Setting, CLF Not Found Error from Missing Toolpath Data, and MFC140u.dll Not Found from Incomplete Installation

BobCAD-CAM's post processors and posting engine suffer from missing tool lists, blank windows, arc value errors, and DLL issues. This guide covers the 5 most common BobCAD-CAM problems with diagnostic steps and community-verified fixes from BobCAD Support and Practical Machinist forums.

## 1. V36 Tool List Not Posting from Commented-Out output_tool_list

### Symptom

After upgrading to BobCAD V36, the posted G-code doesn't include a tool list anywhere. The V34 post processor posts the tool list fine, but the V36 post doesn't. Even the original unmodified V36 post has no tool list.

### Root Cause

In the V36 post processor, the `output_tool_list` command in block 0 is commented out with `//`. The line reads `//output_tool_list` instead of `output_tool_list`. This is the default in V36 posts — the tool list output is disabled by default.

### Fix

1. **Edit the post processor block 0**:
   - Open the post processor file
   - Go to block 0 (the first block)
   - Find the line: `//output_tool_list`
   - Remove the `//` comment prefix
   - The line should read: `output_tool_list`
   - Save the post processor and re-post

2. **Always work from a backup copy**:
   - Before editing any post, make a backup copy
   - If the edit causes issues, restore from backup
   - This user confirmed: "I always work off the backup copy I make"

3. **Verify with the original post**:
   - If the tool list was working before, compare with the original post
   - Look for `//` comment prefixes on `output_tool_list`
   - The difference between working and non-working is the `//` prefix

### Community Report

> "In block 0 (zero) add or copy paste this on its own line: output_tool_list"

> "The original post processor shows the line as //output_tool_list. I went in and removed the block delete line // so it now reads output_tool_list and now it posts the tool list."

## 2. Blank Posting Window from Unmounted UI or Missing C++ Redistributable

### Symptom

After creating toolpath and posting, the Posting Window is completely blank (white) with no G-code. No numbers appear in the top-left corner of the window.

### Root Cause

Two potential causes:
1. **Unmounted UI panel** — the Posting Window is detached from the main interface (known bug in older versions)
2. **Missing C++ Redistributable** — the Posting Engine requires Microsoft Visual C++ 2010 x86 Redistributable

### Fix for Unmounted UI Panel

1. **Mount the Posting Window**:
   - Hold left-click on the top bar of the Posting Window
   - Arrows will pop up on the screen
   - Drag your cursor into one of the arrows and release
   - This mounts the window back into the software

2. **Reset the UI layout**:
   - Go to File → User Profile
   - Right-click on one of the "Profile Layouts"
   - Select "Reset" — this restores all windows to their mounted positions

3. **Refresh the screen**:
   - Click on "File" tab
   - Click back to "Home" tab
   - This refreshes the screen and may restore G-code display
   - Post again to verify

### Fix for Missing C++ Redistributable

1. **Download Microsoft Visual C++ 2010 x86**:
   - Go to: https://www.microsoft.com/en-us/download/details.aspx?id=26999
   - Press "Download"
   - Check off "vcredist_x86.exe" (must be x86, not x64)
   - Press "Next"

2. **Install and restart**:
   - Open the downloaded file
   - Run through the install wizard
   - Restart your computer
   - Try posting again

3. **Check BobCAD dependencies**:
   - BobCAD requires specific C++ Redistributable versions
   - See the full dependency list at bobcad.com/bobcad-cam-installer-dependencies/
   - Install all required dependencies

### Community Report

> "This is a known bug in the software that has gotten better in the newer versions. You need to make sure the Posting Window is also 'mounted' into the software."

> "You need to make sure you have 2010 x86 installed as this is what the Posting Engine uses to post out the code."

## 3. V25 Absolute I/J Arc Values Instead of Incremental

### Symptom

BobCAD V25 posts arc movements with absolute I and J values instead of incremental, causing "crop circles" on the machine. V23 with the same post processor posts incremental I/J correctly. The setting in BobCAD is set to "Post Setting" but doesn't affect the output.

### Root Cause

The arc center output mode is set incorrectly in block 222 of the post processor. V25 interprets the block 222 setting differently than V23. The post processor's arc center setting needs to be changed to match the machine controller's expected format.

### V23 vs V25 Output Comparison

**V23 (correct — incremental I/J):**
```
N10 G03 X0. Y1. I.25 J0.
N12 G02 X1. Y.75 I0. J-.25
```

**V25 (incorrect — absolute I/J):**
```
N11 G03 X0. Y1. I.25 J-2.5
N13 G02 X1. Y.75 I-1.5 J-1.75
```

### Fix

1. **Edit block 222 in the post processor**:
   - Open the post processor file
   - Find block 222
   - Block 222 controls arc center output mode:
     - `a` = absolute
     - `b` = incremental (default)
     - `d` = unsigned incremental
     - `e` = radius
   - Change from `b` to the correct setting for your machine
   - If `b` (incremental) isn't working, try `a` (absolute) or `d` (unsigned incremental)

2. **Check the machine controller settings**:
   - For Mach3: Config → General Config → check I/J mode setting
   - Match the machine setting to the post processor output
   - Either change the post or change the machine config

3. **Watch the post editing tutorial**:
   - BobCAD provides video tutorials for post processor editing
   - Learn how to navigate to specific blocks
   - Block 222 is the arc center setting block

4. **Try different Absolute/Incremental settings**:
   - In BobCAD, under the Absolute/incremental box, try different options:
     - Post Setting
     - Absolute
     - Incremental
   - If "Post Setting" doesn't work, try "Incremental" explicitly

5. **Use the V23 post as reference**:
   - If V23 works correctly, compare block 222 between V23 and V25 posts
   - The setting may need to be different between versions

### Community Report

> "It appears that Ver.25 wants to post the I and J values as absolute no matter what I try. Block 222 in your post is where you set your arc movement output."

> "On line 222 it is set to b which is the default setting. The posted code from BobCAD isn't correct."

## 4. CLF Not Found Error

### Error Message

"CLF Not Found!!!" or "clf NOT FOUND!!!"

### Symptom

When posting toolpath, the error "CLF Not Found" appears. No G-code is generated.

### Root Cause

The Cutter Location File (CLF) data is missing. The post processor can't find the toolpath data to convert to G-code. This can happen when the toolpath wasn't properly generated or the toolpath data file is corrupted.

### Fix

1. **Regenerate the toolpath**:
   - Delete the existing toolpath
   - Recreate the operation
   - Generate the toolpath again
   - Try posting after regeneration

2. **Check the toolpath status**:
   - Ensure the toolpath shows as "computed" or "generated"
   - If the toolpath shows as invalid or needs update, regenerate it
   - The CLF is created during toolpath computation

3. **Check for incorrect cutter compensation**:
   - Error 20: "Incorrect cutter compensation definition ('MW_CC_STOP' is missing)"
   - Go to Current Settings → review Machine Definition
   - Create a new Virtual Machine and link the existing post processor

4. **Verify the post processor is linked**:
   - Ensure the correct post processor is assigned to the machine
   - Check Machine Setup → Post Processor path
   - If the post file is missing or moved, re-link it

5. **Check for missing MFC DLLs**:
   - Error: "code execution cannot proceed because mfc140u.dll was not found"
   - Reinstall BobCAD-CAM from the main Admin account
   - Perform a complete uninstall/reinstall

### Community Report

> "Common Issues & Solutions: CLF Not Found error, Posting window is blank, Wrong file extension."

## 5. MFC140u.dll Not Found from Incomplete Installation

### Error Message

"code execution cannot proceed because mfc140u.dll was not found"

### Symptom

BobCAD-CAM won't launch or crashes with MFC DLL not found errors. The software was installed but certain DLLs are missing.

### Root Cause

The installation was incomplete — not all Microsoft Foundation Class (MFC) DLLs were installed. This can happen when:
- Installation was run from a non-admin account
- Antivirus blocked DLL installation
- The installer was corrupted or interrupted

### Fix

1. **Uninstall completely**:
   - Uninstall BobCAD-CAM from Control Panel
   - Delete remaining files in the installation directory
   - Delete AppData folders related to BobCAD

2. **Reinstall from the main Admin account**:
   - Log in to the main Administrator account (not a user with admin rights)
   - Run the installer as Administrator
   - This ensures all DLLs are properly registered

3. **Disable antivirus during installation**:
   - Temporarily disable antivirus software
   - Some antivirus programs quarantine DLL files during installation
   - Re-enable antivirus after installation completes

4. **Install all dependencies**:
   - Check the full dependency list at bobcad.com/bobcad-cam-installer-dependencies/
   - Install all required C++ Redistributable versions
   - Install .NET Framework if required

5. **Check for corrupted download**:
   - Re-download the installer from the official BobCAD website
   - Verify the file size matches the expected size
   - A corrupted download can cause missing DLLs

## 6. Additional BobCAD-CAM Issues

### Wrong File Extension on Post Output

**Issue**: Posted file has wrong extension for the machine.
**Fix**: Check the post processor's file extension setting. Edit the post to output the correct extension (.nc, .tap, .gcode, etc.).

### Incorrect Cutter Compensation Definition

**Issue**: Error 20 — "MW_CC_STOP is missing" during simulation.
**Fix**: Go to Current Settings → review Machine Definition. Create a new Virtual Machine and link the existing post processor.

### Tool Change Format Issues

**Issue**: Tool changes don't match the machine's expected format.
**Fix**: Edit the post processor's tool change block. Common formats: Txx M06 (Fanuc), Txx (Haas), M06 Txx (some controls).

## Best Practices

1. **Always work from a backup copy of the post processor** — before making any edits
2. **Check block 0 for output_tool_list** — remove `//` to enable tool list in V36
3. **Install 2010 x86 C++ Redistributable** — required by the Posting Engine
4. **Mount the Posting Window** — drag it into an arrow to reattach
5. **Check block 222 for arc center mode** — a=absolute, b=incremental, d=unsigned inc.
6. **Match post and machine I/J settings** — either change post or change machine config
7. **Regenerate toolpaths before posting** — prevents CLF Not Found errors
8. **Reinstall from main Admin account** — ensures all DLLs are properly registered
9. **Disable antivirus during installation** — prevents DLL quarantining
10. **Watch BobCAD post editing tutorials** — learn block navigation before editing
