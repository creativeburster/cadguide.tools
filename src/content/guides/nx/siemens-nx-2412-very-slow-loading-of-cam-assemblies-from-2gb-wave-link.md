---
title: "Siemens NX 2412 Very Slow Loading of CAM Assemblies from 2GB Wave Link Geometry"
excerpt: "Siemens NX 2412 Very Slow Loading of CAM Assemblies from 2GB Wave Link Geometry: symptoms, root causes, and step-by-step fixes, verified against Siemens community."
category: "performance"
softwareSlug: "siemens-nx"
keyword: "Siemens NX 2412 slow loading CAM assemblies 2GB wave link geometry toolpath calculation 4 SMP threads operation-specific multi-threading Journal execution error mySelectedObject nothing NumPy crashes second execution nx:threaded signal 11 toolpath display dots UGII_CAM_TP_DISP_ENDPOINTS"
slug: "siemens-nx-2412-very-slow-loading-of-cam-assemblies-from-2gb-wave-link"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://community.sw.siemens.com/s/question/0D5Vb000014O4vhKAC/tc2506-nx2412-very-slow-loading-of-nxcam-assemblies"
  - "https://community.sw.siemens.com/s/question/0D5Vb000017KwZdKAK/is-there-a-way-to-increase-the-number-of-processor-threads-nx-uses-for-toolpath-calculation"
  - "https://community.sw.siemens.com/s/question/0D5Vb00000pdtSYKAY/numpy-crashes-on-second-execution-despite-nx-threaded-external-python-environment"
---

# Siemens NX 2412 Very Slow Loading of CAM Assemblies from 2GB Wave Link Geometry, Toolpath Calculation Limited to 4 SMP Threads from Operation-Specific Multi-Threading, Journal Execution Error from mySelectedObject Nothing Reference, NumPy Crashes on Second Execution from nx:threaded Signal 11, and Toolpath Display Dots Slowing NX from UGII_CAM_TP_DISP_ENDPOINTS: Wave Link Cleanup, Thread Limit Understanding, Object Reference Debug, nx:main-interpreter Workaround, and Endpoint Variable Disable

Siemens NX produces errors from slow CAM assembly loading, thread limitations, journal errors, NumPy crashes, and toolpath display issues. This guide covers the 5 most common NX problems with diagnostic steps and community-verified fixes from Siemens community.

## 1. Very Slow Loading of CAM Assemblies from 2GB Wave Link Geometry

### Symptom

NX-CAM assemblies (type NC Machining Operation) take up to 30 minutes to open. Even loading with Structure Only enabled takes more than 5 minutes. The assembly part file is over 2 GB, but the individual parts contained in the assembly total only about 92 MB. The gap between the assembly file size and the sum of contained parts is unexplained. Other large assemblies open at normal speed.

### Root Cause

"You might have a wave link geometry in the CAM-assembly part. These can make the file big." Wave link geometry in the CAM assembly part stores linked geometry data within the assembly file itself. This wave link data can significantly inflate the assembly file size beyond the sum of contained parts. The 2 GB assembly file contains wave link geometry that must be loaded when the assembly is opened, causing the extremely slow loading times.

### Fix

1. **Check for wave link geometry**:
   - "You might have a wave link geometry"
   - "In the CAM-assembly part"
   - "These can make the file big"
   - Check for wave link geometry in the assembly

2. **Remove unnecessary wave links**:
   - Remove wave link geometry
   - That is no longer needed
   - To reduce the
   - Assembly file size

3. **Use Structure Only loading**:
   - "Loading the assembly with Structure Only enabled"
   - "Takes more than 5 minutes"
   - Use Structure Only
   - For faster initial loading

4. **Check assembly file size vs part sum**:
   - "When I sum up the file sizes"
   - "Of all parts contained in this assembly"
   - "The total is only about 92 MB"
   - Compare assembly size to part sum

5. **Clean up CAM data**:
   - Remove old toolpaths
   - And CAM data
   - That may be
   - Inflating the file

6. **Use Reference Set to reduce loaded data**:
   - Use Reference Sets
   - To limit the data
   - Loaded with
   - The assembly

7. **Defragment the assembly**:
   - Use NX defragment
   - To optimize
   - The assembly file
   - And reduce size

### Community Report

> "We are experiencing serious performance issues with NX-CAM assemblies. Opening such an assembly takes up to 30 minutes. Even loading the assembly with Structure Only enabled takes more than 5 minutes. The corresponding part file is very large (over 2 GB). When I sum up the file sizes of all parts contained in this assembly, the total is only about 92 MB. This gap is confusing to me. You might have a wave link geometry in the CAM-assembly part. These can make the file big."

## 2. Toolpath Calculation Limited to 4 SMP Threads from Operation-Specific Multi-Threading

### Symptom

NX uses only 4 threads for toolpath calculation despite having 32 processors available. The log file shows "Enabling SMP using 4 threads on 32 processors." Setting environment variables like UGII_SMP_ENABLE=1, MT_MAX_THREADS=8, UGII_CAM_TPG_THREAD_COUNT=8, and OMP_NUM_THREADS=8 doesn't change the thread count. Users want to increase threads to 8 or 16 for faster calculation.

### Root Cause

"Multi-threading is operation specific. We have done work in recent years to introduce new operations that utilize this such as 3D Adaptive Roughing and Quick Roughing. We have also gone back to improve performance of other operations such as Flow Mill. Other operations such as Face Mill ZigZag or Spiral and 2D Wall Mill generate fast regardless of number of threads. Siemens (in the past) did some work on the speed vs. # processors, and found that beyond 4 processors the overhead of multiprocessing ate up any time savings the extra threads produced." NX's multi-threading is operation-specific — not all operations benefit from more threads. Siemens found that beyond 4 processors, the multiprocessing overhead exceeds the time savings. The 4-thread limit is intentional for most operations.

### Fix

1. **Understand operation-specific threading**:
   - "Multi-threading is operation specific"
   - "3D Adaptive Roughing and Quick Roughing"
   - "Utilize multi-threading"
   - Understand which operations benefit from threading

2. **Use multi-threaded operations**:
   - Use 3D Adaptive Roughing
   - Quick Roughing
   - And Flow Mill
   - For multi-threaded performance

3. **Use Parallel Tool Path Generation**:
   - "Check customer defaults for Parallel Tool Path Generation"
   - Use Parallel Generation
   - For multiple operations
   - To utilize more cores

4. **Set Maximum Concurrent Processes to 8**:
   - "Maximum Concurrent Processes"
   - "The setting has maxed at 8"
   - Set to 8 for
   - Parallel generation

5. **Don't set unnecessary environment variables**:
   - "I tried the followings commands"
   - "UGII_SMP_ENABLE=1, MT_MAX_THREADS=8"
   - "Nothing changed"
   - Don't set variables that don't affect CAM

6. **Use Background Generate**:
   - "Background Generate"
   - For parallel processing
   - But verify it works
   - In your NX version

7. **Accept 4-thread limit for most operations**:
   - "Beyond 4 processors"
   - "The overhead of multiprocessing"
   - "Ate up any time savings"
   - Accept the 4-thread limit

### Community Report

> "Inside the log file I can see that NX is using only 4 threads: 'Enabling SMP using 4 threads on 32 processors.' I tried UGII_SMP_ENABLE=1, MT_MAX_THREADS=8, UGII_CAM_TPG_THREAD_COUNT=8, OMP_NUM_THREADS=8 but nothing changed. Multi-threading is operation specific. We have done work in recent years to introduce new operations that utilize this such as 3D Adaptive Roughing and Quick Roughing. Siemens found that beyond 4 processors the overhead of multiprocessing ate up any time savings the extra threads produced."

## 3. Journal Execution Error from mySelectedObject Nothing Reference

### Symptom

A custom NX journal macro fails with a Journal Execution Error. The error references line 130 (or other lines) in the journal code. The macro has worked previously but starts failing without code changes. The error may be intermittent — the first run fails, and subsequent runs produce different errors. The NXJournalsXXXXX temporary folder may not contain journal0.vb.

### Root Cause

"mySelectedObject does not refer to anything. Now you need to track down where mySelectedObject is defined and why it has no valid reference. Errors beget more errors, 1/2 the battle is finding the original error." The journal code references mySelectedObject which is set by a custom SelectAnObj subroutine. If the selection fails (e.g., user cancels selection, or no object is selected), mySelectedObject is Nothing (null reference). Subsequent code that uses mySelectedObject fails with a journal execution error.

### Fix

1. **Find the original error**:
   - "Errors beget more errors"
   - "1/2 the battle is finding the original error"
   - Find the first error
   - Not subsequent cascade errors

2. **Check if mySelectedObject is Nothing**:
   - "mySelectedObject does not refer to anything"
   - Add debug code:
   - "echo(mySelectedObject is nothing: "
   - "& isNothing(mySelectedObject).ToString)"
   - Check if the object is Nothing

3. **Inspect the SelectAnObj subroutine**:
   - "SelectAnObj is not an NXOpen command"
   - "It is likely a subroutine created by someone"
   - "At your organization"
   - Inspect the custom selection subroutine

4. **Add logging after selection**:
   - "Right after the call to SelectAnObj"
   - Add logging to verify
   - The selection returned
   - A valid object

5. **Check NXJournals temporary folder**:
   - "NX takes the original journal code"
   - "And copies/compiles it before it is run"
   - Don't look for journal0.vb
   - In the temp folder

6. **Inspect the save as function**:
   - "What arguments are you passing"
   - "To the save as function?"
   - "Are these arguments correct?"
   - Verify save as arguments

7. **Add comprehensive logging**:
   - "Add a few lines of code to log"
   - "What the current work part is"
   - "And what is being passed into the save as function"
   - Add logging for debugging

### Community Report

> "This error message has popped up for several users of a custom macro. The code base has not changed. mySelectedObject does not refer to anything. You need to track down where mySelectedObject is defined and why it has no valid reference. Errors beget more errors, 1/2 the battle is finding the original error. I suggest adding a few lines of code to log what the current work part is and what is being passed into the save as function."

## 4. NumPy Crashes on Second Execution from nx:threaded Signal 11

### Symptom

When using NumPy in NX external Python environment, the first execution works perfectly. Clicking the same button a second time in the same NX session results in a crash with "Journal execution error" and "EXCEPTION: O/S ERROR: signal 11." Adding # nx: threaded as the first line doesn't fix the issue. Users must restart NX after each NumPy-based operation.

### Root Cause

"This issue has been reported in PR's 11218311 & 11369605 and has been fixed for NX 2512. As a workaround in NX 2506 only, replace # nx: threaded with # nx: main-interpreter. Note that this change was removed from NX 2512. NX 2512 will again require # nx: threaded." The NumPy crash on second execution is a known bug in NX 2506's Python integration. The nx:threaded flag causes a signal 11 (segmentation fault) when NumPy is imported a second time in the same session. The fix is to use nx:main-interpreter as a workaround in NX 2506.

### Fix

1. **Use # nx: main-interpreter in NX 2506**:
   - "As a workaround in NX 2506 only"
   - "Replace # nx: threaded"
   - "With # nx: main-interpreter"
   - Use main-interpreter in 2506

2. **Update to NX 2512**:
   - "This issue has been fixed for NX 2512"
   - "NX 2512 will again require # nx: threaded"
   - Update to NX 2512
   - For the permanent fix

3. **Use # nx: threaded in NX 2512**:
   - "This change was removed from NX 2512"
   - "NX 2512 will again require # nx: threaded"
   - Use nx:threaded
   - In NX 2512 and later

4. **Restart NX after each NumPy execution**:
   - "Users need to click buttons multiple times"
   - "But currently must restart NX"
   - "After each NumPy-based operation"
   - Restart as workaround

5. **Use subprocess for NumPy operations**:
   - "Subprocess approach"
   - "Attempted to run NumPy tests in a subprocess"
   - Use subprocess
   - As alternative workaround

6. **Preload NumPy at NX startup**:
   - "Is preloading NumPy at NX startup a viable solution?"
   - Consider preloading
   - NumPy at startup
   - To avoid reimport issues

7. **Check Python version compatibility**:
   - "Python 3.12.9, NumPy 1.26.4"
   - Verify Python and NumPy
   - Version compatibility
   - With your NX version

### Community Report

> "When I run a journal that imports NumPy, it works perfectly on the first execution. However, clicking the same button a second time results in a crash: EXCEPTION: O/S ERROR: signal 11. This issue has been reported in PR's 11218311 & 11369605 and has been fixed for NX 2512. As a workaround in NX 2506 only, replace # nx: threaded with # nx: main-interpreter. Note that this change was removed from NX 2512. NX 2512 will again require # nx: threaded."

## 5. Toolpath Display Dots Slowing NX from UGII_CAM_TP_DISP_ENDPOINTS

### Symptom

When generating or playing toolpaths in NX CAM, the display shows toolpath lines with countless dots. The dots represent points where the tool changes dimension. The dots slow down the entire software, making it challenging to rotate the screen to check toolpaths. Turning off the 'End Point' button in the Display window doesn't remove the dots.

### Root Cause

"Check whether you have an environment variable set called UGII_CAM_TP_DISP_ENDPOINTS. This was used in old versions of NX to turn on the end point display (e.g. Display Tool Path Point Distribution). If it's set it should be visible in the NX log file." The UGII_CAM_TP_DISP_ENDPOINTS environment variable controls the display of endpoint dots on toolpaths. When set to a non-zero value, NX displays dots at every toolpath endpoint. This was used in old NX versions and may be set in the environment from a previous installation.

### Fix

1. **Set UGII_CAM_TP_DISP_ENDPOINTS to 0**:
   - "I put number 0 for the ENV Variable"
   - "It may have turned off the end point"
   - "And it worked"
   - Set the variable to 0

2. **Remove the environment variable**:
   - "Removing the environment variable"
   - "From wherever it is being set"
   - "Would also be an option"
   - Remove the variable entirely

3. **Check NX log file**:
   - "If it's set it should be visible"
   - "In the NX log file"
   - Check the log file
   - For the variable

4. **Check environment in cam_env.dat**:
   - Check cam_env.dat
   - For UGII_CAM_TP_DISP_ENDPOINTS
   - And remove or set to 0
   - If found

5. **Check ugii_env.dat**:
   - Check ugii_env.dat
   - For the variable
   - And remove or set to 0
   - If found

6. **Use toolpath verification without dots**:
   - "I have another tool path verifying button"
   - "That allows me to inspect tool paths without dots"
   - Use the alternative
   - Verification method

7. **Restart NX after changing variable**:
   - After changing the environment variable
   - Restart NX
   - For the change
   - To take effect

### Community Report

> "Whenever I generate/play tool paths in each CAM, it shows me tool path lines with countless dots. It just slows down the entire software therefore it is even challenging to rotate the screen. I turned off the 'End Point' button on the Display window and it didn't remove the dots. Check whether you have an environment variable set called UGII_CAM_TP_DISP_ENDPOINTS. I put number 0 for the ENV Variable and it worked."

## 6. Additional NX Issues

### Background Generate Not Working in 2512

**Issue**: "I tried the same test with 2512.5000 but it will not execute Background Generate at all; my cpu load remained flat."
**Fix**: Verify Background Generate is working in your 2512 installation. If not, stay on 2412 for production. Report the issue to Siemens support.

### Parallel Generate with IPW

**Issue**: "The concurrent processes I have set to 8 but it seems to generate one process at a time even though there is no IPW to be updated."
**Fix**: Verify IPW settings when using Parallel Generate. Check if IPW processing is blocking parallel generation. Test without IPW for pure parallel processing.

### PyQt5 Crash on Second Run

**Issue**: "For the PyQt5 script, it will only run if I include # nx: threaded, but then only once. The second run crashes NX."
**Fix**: Use # nx: main-interpreter in NX 2506 as workaround. Update to NX 2512 for permanent fix. Consider using subprocess for PyQt5 scripts.

### NX 2312 nx:main-interpreter Incompatibility

**Issue**: "I am seeing the similar behavior using NX2312. The use of # nx: main-interpreter instead of # nx: threaded does not work."
**Fix**: For NX 2312, try different approaches. Check Siemens documentation for NX 2312-specific Python integration. Consider upgrading to NX 2506 or 2512.

### CAM Data Inflating File Size

**Issue**: "Are there known factors (e.g. CAM data, toolpaths, history, attributes, caches, etc.) that can significantly increase the size of an assembly file?"
**Fix**: CAM data, toolpaths, history, and caches can inflate assembly files. Regularly clean up old CAM data. Use NX file optimization tools to reduce file size.

### Thread Count in Log File

**Issue**: "The info in the log file refers more to modeling. Only certain things in NX [modeling] are multi-threaded."
**Fix**: The SMP thread count in the log file refers to modeling, not CAM. Don't expect CAM to use the same thread count. Check CAM-specific multi-threading documentation.

## Best Practices

1. **Check for wave link geometry in slow-loading CAM assemblies** — primary cause of 2GB+ file sizes
2. **Use multi-threaded operations (3D Adaptive Roughing, Quick Roughing)** — benefit from SMP threading
3. **Set Maximum Concurrent Processes to 8 for Parallel Generate** — utilizes more cores for multiple operations
4. **Accept 4-thread limit for most operations** — overhead exceeds savings beyond 4 threads
5. **Find the original error in journal debugging** — errors cascade and mask the root cause
6. **Add logging to check if objects are Nothing** — debug null references in journal code
7. **Use # nx: main-interpreter in NX 2506 for NumPy** — workaround for signal 11 crash
8. **Update to NX 2512 for permanent NumPy fix** — requires # nx: threaded
9. **Set UGII_CAM_TP_DISP_ENDPOINTS to 0** — removes toolpath display dots
10. **Check environment variables in cam_env.dat and ugii_env.dat** — old settings can cause issues
