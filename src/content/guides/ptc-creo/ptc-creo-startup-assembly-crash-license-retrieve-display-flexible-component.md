---
title: "PTC Creo Startup and Assembly Crash: License Request Failure on Every Boot, Large Assembly Fatal Error, retrieve_display foreground Fix for Flexible Component Crash, and Student License Terminal Services Lock"
excerpt: "PTC Creo fails to start and crashes on assemblies for 5 distinct reasons: lmadmin_ptc service doesn't auto-start after reboot requiring manual restart, large assemblies crash with fatal error on open, flexible components with User Defined simplified reps crash unless retrieve_display foreground is set, student licenses can't be used in Terminal Services sessions, and circular references cause silent regeneration failures. We cover each with fixes from PTC community forums."
category: "startup-and-assembly-crash"
softwareSlug: "ptc-creo"
keyword: "PTC Creo license request failed startup crash large assembly fatal error retrieve_display foreground flexible component student license terminal services"
slug: "ptc-creo-startup-assembly-crash-license-retrieve-display-flexible-component"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://community.ptc.com/t5/System-Administration/License-Request-Failure-on-Startup/td-p/1029641"
  - "https://community.ptc.com/t5/System-Administration/Creo-8-0-6-0-crashes-on-model-open/td-p/889868"
  - "https://community.ptc.com/3d-part-assembly-design-327/creo-10-0-2-crashes-while-opening-large-assembly-148913"
---

# PTC Creo Startup and Assembly Crash: License Request Failure on Every Boot, Large Assembly Fatal Error, retrieve_display foreground Fix for Flexible Component Crash, and Student License Terminal Services Lock

PTC Creo users encounter two recurring problem classes: license server connectivity failures that prevent startup, and assembly crashes that destroy work. The license issue requires manually restarting the lmadmin_ptc service after every reboot. Assembly crashes stem from flexible components, User Defined simplified reps, and circular references. This guide covers each failure mode with diagnostic steps and community-verified fixes.

## 1. License Request Failure on Every Startup

### Symptom

Every time a PC is turned on and Creo 11.0.4.0 is launched, a "License Warning" dialog appears with the message "License request failed for feature". Creo cannot start.

### Workaround

Go to Windows Services and manually restart **lmadmin_ptc**. This must be done after every computer restart or shutdown.

### Root Cause

The PTC license server service (lmadmin_ptc) does not automatically start in time for Creo to check out a license. The service may be set to Automatic (Delayed Start), but the delay is too long, or the service depends on another service that isn't ready.

### Fix

1. **Set lmadmin_ptc to Automatic** (not Delayed Start):
   - Open Services (services.msc)
   - Find lmadmin_ptc
   - Set Startup type to **Automatic**
   - Also set Recovery to **Restart the Service** on first and second failure

2. **Add a startup delay script**:
   - Create a batch file that waits 30 seconds after boot, then starts lmadmin_ptc
   - Or use Task Scheduler to start the service 30 seconds after logon

3. **Reconfigure the license server**:
   - Run the PTC License Server setup again
   - Ensure the license file is correctly configured
   - Verify the port number matches between server and client

4. **Check firewall rules** — ensure the license port (typically 7788) is open between clients and server

5. **Verify license file integrity** — re-download from PTC support portal if corrupted

## 2. Creo Crashes While Opening Large Assembly

### Symptom

After creating and modifying a large assembly file, reopening it for further modifications causes Creo to crash with:

```
Fatal error encountered. A traceback has been written to...
Please send it to Technical Support.
```

### Diagnostic Approach

1. **Open sub-assemblies individually** — identify if specific sub-assemblies or parts cause the crash
2. **Open with Simplified Rep — No Components**:
   - Open the top-level assembly using a simplified rep with no components
   - Gradually add components to the rep to identify the crashing component
3. **Monitor RAM usage** in Task Manager while opening — if RAM maxes out, the assembly is too large for available memory
4. **Check for regeneration problems** — reference errors and model problems affect performance and can cause crashes

### Fix

1. **Fix all regeneration problems and reference errors** before opening the full assembly
2. **Use Simplified Reps** to reduce memory load:
   - Create reps that exclude non-visible components
   - Use "Graphics Only" rep for components that don't need geometry
3. **Ensure workstation-class hardware**:
   - Sufficient RAM (32GB+ for large assemblies)
   - Workstation GPU with certified drivers
4. **Clean up the model**:
   - Remove unused features and components
   - Simplify complex geometry
   - Fix all circular references

## 3. retrieve_display foreground: Flexible Component Crash Fix

### Symptom

A Creo assembly crashes on open. PTC Tech Support cannot reproduce the crash with the same files. The assembly can only be opened via "Open Subset" and then activating the Master Rep.

### Root Cause

The assembly contains a **flexible component** with a **User Defined simplified rep**. When Creo tries to retrieve the display during file open, the flexible component's representation causes a fatal error.

### Diagnostic Trail

1. The crash file is referenced in `std.out` with `ids_gen_simp_rep_db`
2. The crashing component is a flexible component 2 levels down from the top level
3. It has a User Defined simplified rep
4. The file is a "Save As" copy — only the last 2 in the Save As history have this issue

### Fix (From PTC Tech Support)

Add the following line to `config.pro`:
```
retrieve_display foreground
```

This forces Creo to retrieve display geometry in the foreground, preventing the crash when loading flexible components with User Defined reps.

### Trade-off

> "This is not really a solution but a workaround. You have 2 choices:
> - Leave this in your config.pro forever which impacts retrieval times for all models forever
> - Or remember to put it in when you want to open this specific assembly"

### Alternative Diagnostic Steps

If the fix doesn't work, try:
1. **Remove config.pro, config.sup, and startup scripts** — test with default configuration
2. **Set graphics = win32_gdi** in config.pro — disables GPU acceleration to test for graphics issues
3. **Update graphics driver** — if the crash is graphics-related
4. **Trace the std.out file** — narrow down to specific components (flexible models, harness features)
5. **Make a copy and remove components** — delete flexible components and harness features until the assembly opens

## 4. Student License: Terminal Services Lock

### Symptom

Creo 7 student version fails to start with:

```
Cannot checkout an uncounted license within a Windows Terminal Services guest session.
```

After clicking OK, additional messages appear: "AFX failed to load" and "IFX failed to load", then the application closes automatically.

### Root Cause

Student licenses are **node-locked (uncounted)** and cannot be used within Windows Terminal Services / Remote Desktop sessions. The FlexNet license manager detects the Terminal Services environment and rejects uncounted licenses.

### Fix

1. **Run Creo on the local machine** — not through Remote Desktop or Terminal Services
2. **Use a network license** if remote access is required — network licenses are counted and can be used in TS sessions
3. **Reference PTC article CS23456**: "Error 'Terminal Server Remote Client Not Allowed' or '(-103) Cannot checkout an uncounted license within a windows terminal services guest session'"
4. **Student licenses are locked** — they cannot be modified to work in Terminal Services

## 5. Circular References: Silent Regeneration Failures

### Symptom

Models fail to regenerate correctly after modifications. Changes to one part don't propagate to dependent features. Performance degrades over time.

### Root Cause

Circular references occur when Feature A references Feature B, and Feature B references Feature A (directly or through a chain). Creo's regeneration solver cannot determine the correct update order, leading to silent failures or crashes.

### Diagnosis

1. **Check for reference warnings** in the message log
2. **Use Reference Viewer** — Tools → Reference Viewer to trace dependency chains
3. **Look for parent/child cycles** — a feature should never depend on its own child

### Fix

1. **Break circular references** by rerouting dependencies:
   - Create a datum feature that both features reference instead of each other
   - Use independent datums as reference anchors
2. **Resolve all circular references before opening large assemblies** — they compound and cause crashes
3. **Use Skeleton models** for top-down design — skeleton references flow downward only
4. **Avoid cross-part references in assemblies** — these create hidden circular dependencies
5. **Fix references immediately when they break** — don't let them accumulate

## 6. config.pro Best Practices for Stability

### Key Settings for Large Assemblies

```
retrieve_display foreground
```
Fixes flexible component crash (see Section 3).

```
assembly_allow_ref_snapshots yes
```
Creates reference snapshots for faster assembly opening.

```
enable_async_reroute yes
```
Allows asynchronous rerouting of failed references during regeneration.

```
regen_failure_handling resolve_mode
```
Forces Creo to enter resolve mode on regeneration failure instead of crashing.

```
graphics win32_gdi
```
Disables GPU acceleration — use for diagnosing graphics-related crashes.

### Diagnostic Settings

```
traceback yes
```
Enables traceback file generation on crash — essential for PTC support.

```
display yes
```
Forces display during retrieval — can help identify which component is crashing.

## Best Practices

1. **Set lmadmin_ptc to Automatic** — prevents license failure on every startup
2. **Use Simplified Reps with No Components** to diagnose assembly crashes
3. **Add retrieve_display foreground to config.pro** — fixes flexible component crashes
4. **Don't use student licenses in Terminal Services** — they're locked to local use
5. **Break all circular references** — they cause silent regeneration failures and crashes
6. **Open sub-assemblies individually** to isolate crashing components
7. **Monitor RAM usage** during assembly open — insufficient RAM causes crashes
8. **Keep traceback files** — send to PTC support for crash analysis
9. **Test without config.pro** — rules out configuration-related crashes
10. **Use graphics = win32_gdi** to diagnose graphics-related crashes
