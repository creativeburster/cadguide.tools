---
title: "SketchUp 2024 2025 Memory Leak and Crash Errors: MacOS RAM Usage Increases with 3D SpaceMouse from Memory Leak Requiring Driver Update and Periodic Restart, RAM Maxed Out and Crash When Exporting Images from New Render Engine Requiring Classic Engine Switch, Profile Builder 4 Startup Crash from Ruby Garbage Collection Conflict Requiring GC Disable or PB4 4.0.3 Update, Memory Not Freed After Deleting Groups from DefinitionList Retention Requiring Purge Definitions, and Multiple Documents Memory Leak from Non-Closing Documents Requiring Single Document Workflow"
excerpt: "SketchUp fails for 5 distinct reasons: MacOS RAM usage increases with 3D SpaceMouse from memory leak requiring driver update and periodic restart, RAM maxed out and crash when exporting images from new render engine requiring classic engine switch, Profile Builder 4 startup crash from Ruby garbage collection conflict requiring GC disable or PB4 4.0.3 update, memory not freed after deleting groups from DefinitionList retention requiring purge definitions, and multiple documents memory leak from non-closing documents requiring single document workflow. We cover each with fixes from SketchUp Community Forums."
category: "memory-leak-and-crash-errors"
softwareSlug: "sketchup"
keyword: "SketchUp 2024 2025 MacOS RAM usage increases 3D SpaceMouse memory leak driver update periodic restart RAM maxed out crash exporting images new render engine classic engine switch Profile Builder 4 startup crash Ruby garbage collection GC disable PB4 4.0.3 memory not freed deleting groups DefinitionList retention purge definitions multiple documents memory leak non-closing documents single document workflow"
slug: "sketchup-2024-2025-memory-leak-crash-errors-macos-ram-usage-3d-spacemouse-memory-leak-ram-maxed-out-crash-exporting-images-new-render-engine-profile-builder-4-startup-crash-memory"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://forums.sketchup.com/t/su-2025-macos-ram-usage-increases-just-by-moving-around-my-model-using-3d-mouse-then-crashes/325710"
  - "https://forums.sketchup.com/t/sketchup-2024-ram-maxed-out-crashes-when-exporting-images/277583"
  - "https://forums.sketchup.com/t/disabling-garbage-collection-while-loading-an-extension-fix-for-su2024-startup-crashes/274297"
---

# SketchUp 2024 2025 Memory Leak and Crash Errors: MacOS RAM Usage Increases with 3D SpaceMouse from Memory Leak Requiring Driver Update and Periodic Restart, RAM Maxed Out and Crash When Exporting Images from New Render Engine Requiring Classic Engine Switch, Profile Builder 4 Startup Crash from Ruby Garbage Collection Conflict Requiring GC Disable or PB4 4.0.3 Update, Memory Not Freed After Deleting Groups from DefinitionList Retention Requiring Purge Definitions, and Multiple Documents Memory Leak from Non-Closing Documents Requiring Single Document Workflow

SketchUp's 3D SpaceMouse integration, render engine, Ruby extension loading, group definition management, and multi-document handling produce errors from memory leaks, render engine RAM overload, GC conflicts, definition retention, and document accumulation. This guide covers the 5 most common SketchUp 2024/2025 problems with diagnostic steps and community-verified fixes from SketchUp Community Forums.

## 1. MacOS RAM Usage Increases with 3D SpaceMouse from Memory Leak

### Symptom

After updating from SU 2021 Pro to SU 2025 on MacOS Sequoia, SU lockups occur after about 45 minutes. Activity Monitor reports SU RAM usage ballooning to 20+ GB from an initial 1.2 GB. RAM usage grows by 0.25 GB for every 20 seconds of 3D SpaceMouse movement. RAM grows even when SU is idle with no interaction. The SpaceMouse Pro worked fine under SU 2021 with the same model. Eventually SU reaches 12-20 GB and must be force quit.

### Root Cause

"There was a known memory leak issue with the 3D connexion." The 3Dconnexion SpaceMouse driver has a memory leak in its integration with SketchUp 2024/2025. Each 3D mouse movement event allocates memory that is not freed. The leak is in the driver's event handling code, not in SketchUp itself. The issue was not present in SU 2021 because the driver integration was different. On MacOS Sequoia, the memory management changes may exacerbate the leak.

### Fix

1. **Update 3Dconnexion driver**:
   - "There was a known memory leak issue with the 3d connexion. Have you installed the latest drivers for it?"
   - Download the latest 3Dconnexion driver for Mac
   - "3DxMacCore version 1.3.7.529 and 3DxWare version 10.8.7"
   - Install and restart

2. **Update SpaceMouse firmware**:
   - "My SpaceMouse Pro Wireless firmware = 4.39"
   - Check for firmware updates in 3DxWare
   - Update to the latest firmware
   - This may fix the memory leak

3. **Use regular mouse instead of SpaceMouse**:
   - "If I have the SM connected, but only use my Logi MX Master 3S or Apple Magic Mouse 2, the memory usage remains pretty stable"
   - Stop using the SpaceMouse
   - Use a regular mouse for navigation
   - This avoids the memory leak entirely

4. **Restart SketchUp periodically**:
   - "When SU-2025 eventually lockups with the spinning beachball the RAM used has grown to 12-20 GB"
   - Save your work
   - Restart SketchUp every 30-45 minutes
   - This clears the leaked memory

5. **Use memory clean tools**:
   - "The solution was to manually purge RAM using solutions like memory clean"
   - Use MacOS memory management tools
   - Purge RAM when SU usage gets high
   - This is a temporary fix

6. **Downgrade to SU 2023**:
   - "Working fine with 2023"
   - If the leak is unbearable
   - Downgrade to SketchUp 2023
   - The 3D mouse leak is not present in 2023

7. **Report to SketchUp and 3Dconnexion**:
   - Report the memory leak to both SketchUp and 3Dconnexion
   - Include Activity Monitor screenshots
   - Include the driver and firmware versions
   - This is a known issue being investigated

### Community Report

> "After updating from SU-2021-pro to SU2025, MacOS Activity Monitor shows SU RAM usage has increased to 20+ GB from an initial 1.2 GB. RAM usage grows by 1/4 GB if I move around the model for 20 seconds using a 3D mouse. RAM memory usage grows when leaving the SU window open without working. I used the 3D SpaceMouse-pro extensively under SU-2021 and it never crashed. There was a known memory leak issue with the 3d connexion."

## 2. RAM Maxed Out and Crash When Exporting Images from New Render Engine

### Symptom

SketchUp 2024 with a 180 MB file containing large texture imagery with topography. When using the new render engine with ambient occlusion and selecting the graphics card, RAM usage shoots to almost 90% on file open. When attempting to export an image, RAM gets maxed out and SketchUp crashes with a bug splat. The splat says to reinstall SketchUp. Toggling off the new render engine and switching to classic, then restarting, resolves all problems.

### Root Cause

The new render engine in SketchUp 2024 uses significantly more RAM than the classic engine. With large texture files, the render engine loads all textures into GPU and system RAM. The ambient occlusion calculation requires additional memory buffers. When exporting an image, the render engine creates a full-resolution render buffer, which combined with the already high RAM usage, exceeds available memory. The crash occurs because the render engine can't allocate enough memory for the export buffer.

### Fix

1. **Switch to classic render engine**:
   - "I toggle off the new render engine and move to classic, restart Sketchup, and all the above problems go away"
   - View > Face Style > uncheck "Enable ambient occlusion"
   - Or disable the new render engine in Preferences
   - Restart SketchUp

2. **Reduce texture sizes**:
   - Large texture imagery consumes significant RAM
   - Reduce texture resolution
   - Use smaller texture files
   - Purge unused textures

3. **Use a more powerful graphics card**:
   - "I can't use the new engine because it gobbles up enough ram on my rtx2070 that it prevents me from rendering using Enscape"
   - The new render engine needs a GPU with more VRAM
   - Use a card with 8GB+ VRAM
   - Or use the classic engine

4. **Close other applications**:
   - Free up system RAM
   - Close browsers, other CAD software
   - Check Task Manager for RAM usage
   - Ensure at least 4GB free before opening large files

5. **Export at lower resolution**:
   - Instead of full-resolution export
   - Reduce the export resolution
   - This reduces the render buffer size
   - May prevent the crash

6. **Don't use new render engine for large files**:
   - "If they decide to ditch the classic engine in 2025 it's going to cause a lot of problems for users without powerful graphics cards"
   - For files with large textures
   - Use the classic engine
   - Reserve the new engine for smaller models

7. **Purge unused components and materials**:
   - Window > Model Info > Statistics > Purge Unused
   - Remove unused components, materials, and layers
   - This reduces file size and RAM usage
   - Do this before opening in the new render engine

### Community Report

> "I have a 180MB file with large texture imagery. When utilizing the new render engine and selecting my graphics card, upon opening my RAM usage shoots up to almost 90%. When attempting to export an image, the RAM gets maxed out and the program crashes with a bug splat. I toggle off the new render engine and move to classic, restart Sketchup, and all the above problems go away. I can't use the new engine because it gobbles up enough ram on my rtx2070 that it prevents me from rendering using Enscape."

## 3. Profile Builder 4 Startup Crash from Ruby Garbage Collection Conflict

### Symptom

SketchUp 2024 crashes during startup. The crash occurs while extensions are loading, typically while loading Profile Builder 4. No bug splat reports are generated. Examining the SketchUp log file in the temp folder shows the crash occurs during PB4 loading. The crash is not systematic — out of 5 starts, 2 crash. Updating to PB4 4.0.2 didn't fix it. Deactivating all other extensions didn't help.

### Root Cause

"The crashes are related to our use of Ruby Encoder and I believe it is the Ruby Encoder library implementation that is causing the GC issues, not our own code." Profile Builder 4 uses Ruby Encoder to protect its source code. The Ruby Encoder library generates code snippets that conflict with Ruby's garbage collector in SketchUp 2024's Ruby 3.2 environment. The GC tries to collect local variables in the Ruby Encoder snippet while it's being loaded, causing a crash. The `while true` loop in the snippet also has potential for stack overflow.

### Fix

1. **Update to Profile Builder 4.0.3**:
   - "The problem is fixed by PB4 version 4.0.3, Fix for SketchUp crashing on startup when Profile Builder 4 is installed"
   - Download PB4 4.0.3 from mind.sight.studios
   - Install the latest version
   - This is the primary fix

2. **Disable garbage collection during load**:
   - "I found a solution to these crashes by disabling Ruby garbage collection while Profile Builder 4 is being loaded"
   - "Once the extension is loaded, I then re-enable GC"
   - This is implemented in PB4 4.0.3
   - If using an older version, contact mind.sight.studios

3. **Remove PB4 temporarily**:
   - If SketchUp won't start at all
   - Remove PB4 from the Plugins folder
   - Start SketchUp
   - Then reinstall PB4 4.0.3

4. **Use Extension Manager**:
   - "Use the extension manager to remove it under the management tab"
   - Open Extension Manager
   - Disable PB4
   - Restart SketchUp
   - Then install PB4 4.0.3

5. **Check SketchUp log file**:
   - "I found a log in my temp directory which put me on the trail"
   - Check the temp folder for SketchUp logs
   - The log shows which extension caused the crash
   - This helps identify the culprit

6. **Don't use Ruby 3.2.2**:
   - "You might try Ruby 3.2.4 on Windows SU"
   - "Some of the changes between 3.2.2 and 3.2.4 might affect the issue"
   - The GC issue may be Ruby version specific
   - Check if SketchUp update changes Ruby version

7. **Wrap code in a module**:
   - For extension developers
   - "All code should be inside a namespace module to prevent defining anything at the top level"
   - Wrap Ruby Encoder snippets in a module
   - This prevents GC from collecting local variables

### Community Report

> "Since Profile Builder 4 has been released and especially after SU2024 was released, we have received several reports of SketchUp crashing during startup. These crashes occur while extensions are loading and typically no bugsplat reports are generated. The crash would occur while loading Profile Builder 4. I found a solution by disabling Ruby garbage collection while PB4 is being loaded. The crashes are related to our use of Ruby Encoder. The problem is fixed by PB4 version 4.0.3."

## 4. Memory Not Freed After Deleting Groups from DefinitionList Retention

### Symptom

After creating many groups in SketchUp (e.g., via a plugin like SketchFramer), RAM usage increases. Even after deleting the groups from the scene, memory doesn't decrease. The RAM only resets when SketchUp is closed and reopened. Mac users report SketchUp eating their memory. After a few visualization changes, RAM is only increasing.

### Root Cause

"SketchUp does not recycle memory to the system until it closes. It 'high water mark's. There is no way to force memory release from within SketchUp." SketchUp uses a high-water-mark memory management strategy. Once memory is allocated, it's not returned to the OS until SketchUp closes. Additionally, "Groups are really 'special' component instances. If your code does not also purge the DefinitionList collection, when you delete the group instances, then the group geometry will still be held within the model database." The group definitions remain in the DefinitionList even after all instances are deleted.

### Fix

1. **Purge unused definitions**:
   - "If your code does not also purge the DefinitionList collection, the group geometry will still be held"
   - Window > Model Info > Statistics > Purge Unused
   - This removes unused component and group definitions
   - Frees the memory within SketchUp

2. **Use `GC.start` in Ruby**:
   - "You can also execute GC.start to have Ruby do a round of garbage collection"
   - For extension developers
   - Call `GC.start` after deleting groups
   - This forces Ruby garbage collection

3. **Purge definitions in code**:
   - For extension developers
   - After deleting group instances
   - Also purge the definition from the DefinitionList
   - `model.definitions.purge_unused`

4. **Close and reopen SketchUp**:
   - "Only working way which I know is to close/open Sketchup"
   - Save the model
   - Close SketchUp
   - Reopen the model
   - This resets the memory

5. **Save, open empty, reopen**:
   - "Save the model, open a new empty model, then reopen the working model"
   - On Mac, close the working document window
   - Open a new empty model
   - Then reopen the working model
   - This may free some memory

6. **Check "show nested components"**:
   - "Check the 'show nested components' box in model info"
   - "The model might have a lot more content than you realize"
   - Hidden nested components consume memory
   - Purge them if unused

7. **Use components instead of groups**:
   - Groups create unique definitions
   - Components share definitions
   - Using components reduces definition count
   - And reduces memory usage

8. **Monitor definition count**:
   - "Be aware of the component definition count as your extension does its thing"
   - For extension developers
   - Track the number of definitions
   - Purge unused definitions regularly

### Community Report

> "After few visualization changes, the RAM is only increasing. Even if I delete the groups from the scene, the memory doesn't decrease. SketchUp does not recycle memory to the system until it closes. It high water marks. If your code does not also purge the DefinitionList collection, when you delete the group instances, then the group geometry will still be held within the model database. Only working way which I know is to close/open Sketchup."

## 5. Multiple Documents Memory Leak from Non-Closing Documents

### Symptom

Mac users experience SketchUp eating memory over time. RAM usage grows continuously. The issue is especially common with Mac users who rarely close SketchUp and have multiple documents open simultaneously. Some users have 15 SketchUp documents open at the same time.

### Root Cause

"One experience that is super common with troubleshooting mac users is that they rarely close SketchUp and they have multiple documents open simultaneously because they never close the application. I've seen similar things where it turned out they actually have 15 sketchup documents open." Each open SketchUp document consumes its own memory allocation. SketchUp's high-water-mark memory management means each document's memory is never returned. With 15 documents open, the total memory usage is the sum of all documents' peak usage. On Mac, the document windows stay open even when not in use.

### Fix

1. **Close unused documents**:
   - "They rarely close SketchUp and they have multiple documents open"
   - Close documents you're not actively working on
   - On Mac, close the document window (not just minimize)
   - This frees the document's memory

2. **Work with one document at a time**:
   - Keep only one document open
   - Open and close documents as needed
   - This prevents memory accumulation
   - From multiple documents

3. **Check open documents**:
   - On Mac, check the Window menu
   - See how many documents are open
   - Close all but the current one
   - You may be surprised by the count

4. **Restart SketchUp regularly**:
   - "After open the memory usage reset and it is again low RAM (300-1000MB)"
   - Save all documents
   - Close SketchUp completely
   - Reopen only the document you need

5. **Use GC.start between documents**:
   - For extension developers
   - Call `GC.start` after closing a document
   - This forces garbage collection
   - May free some memory

6. **Monitor Activity Monitor**:
   - On Mac, use Activity Monitor
   - Watch SketchUp's RAM usage
   - If it grows continuously, close documents
   - Don't wait until it crashes

7. **Don't minimize documents**:
   - Minimized documents still consume full memory
   - Close them instead
   - On Mac, Cmd+W closes the document
   - But keeps SketchUp running

8. **Check for background extensions**:
   - Some extensions run in all open documents
   - Disable unnecessary extensions
   - Each extension adds memory per document
   - Reduce extension count

### Community Report

> "One experience that is super common with troubleshooting mac users is that they rarely close SketchUp and they have multiple documents open simultaneously because they never close the application. I've seen similar things where it turned out they actually have 15 sketchup documents open. After open the memory usage reset and it is again low RAM (300-1000MB). The 94GB of memory on the Mac is concerning."

## 6. Additional SketchUp Issues

### Enscape Conflict with New Render Engine

**Issue**: "I can't use the new engine because it gobbles up enough ram on my rtx2070 that it prevents me from rendering using Enscape."
**Fix**: Use classic render engine. Disable ambient occlusion. Close SketchUp render before Enscape. Use more powerful GPU.

### Extension Console Closes on Crash

**Issue**: "The console closes without us having time to see anything."
**Fix**: Check temp folder for log files. Use Extension Manager to disable extensions. Start SketchUp with no extensions. Re-enable one at a time.

### SketchFramer Plugin Memory Issue

**Issue**: "Could it be the sketchframer itself causing an issue?"
**Fix**: Update SketchFramer to latest version (1.5.92). Purge definitions after visualization changes. Restart SketchUp periodically. Contact plugin developer.

### Classic Engine Removal Concern

**Issue**: "If they decide to ditch the classic engine in 2025 it's going to cause a lot of problems."
**Fix**: Use classic engine while available. Reduce texture sizes. Upgrade GPU. Report to SketchUp.

### Ruby Encoder GC Issue

**Issue**: "The Ruby Encoder library implementation is causing the GC issues."
**Fix**: Update extensions using Ruby Encoder. Disable GC during load. Wrap code in modules. Contact extension developers.

### Beachball with Profile Builder 4

**Issue**: "I usually lockup when using Profile Builder 4."
**Fix**: Update PB4 to 4.0.3. Disable PB4 during navigation. Use PB3 if stable. Contact mind.sight.studios.

## Best Practices

1. **Update 3Dconnexion driver and firmware** — fixes SpaceMouse memory leak
2. **Use regular mouse if SpaceMouse leaks memory** — avoids the leak entirely
3. **Switch to classic render engine for large texture files** — prevents RAM max out
4. **Update Profile Builder 4 to 4.0.3** — fixes startup crash from Ruby GC conflict
5. **Purge unused definitions after deleting groups** — frees memory from DefinitionList
6. **Close unused documents on Mac** — prevents memory accumulation from multiple documents
7. **Restart SketchUp every 30-45 minutes** — clears leaked memory
8. **Use `GC.start` in Ruby extensions** — forces garbage collection
9. **Use components instead of groups** — reduces definition count and memory
10. **Monitor Activity Manager for RAM growth** — catch memory leaks before crash
