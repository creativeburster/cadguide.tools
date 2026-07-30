---
title: "3DEXPERIENCE SOLIDWORKS Integration: On-the-Fly Conversion Performance Degradation, MySession Refresh Freezes, Connection Errors, Multi-Configuration Save Delays, and 2026 Regression"
excerpt: "3DEXPERIENCE integration with SOLIDWORKS has 5 documented performance problems: platform-native Physical Products trigger on-the-fly conversion causing system hangs, MySession refreshes freeze SOLIDWORKS during editing, connection errors prevent login despite active subscription, multi-configuration files with mapped attributes slow saves dramatically, and the 2026 update decreased the assembly opening threshold. We cover each with fixes from Dassault and SOLIDWORKS community forums."
category: "platform-integration-performance"
softwareSlug: "3dexperience"
keyword: "3DEXPERIENCE SOLIDWORKS integration performance conversion MySession refresh connection error multi-configuration 2026 regression"
slug: "3dexperience-solidworks-integration-conversion-mysession-refresh-connection-2026"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://3dswym.3dexperience.3ds.com/question/enovia-user-community/performance-degradation-and-system-hangs-when-loading-3dexperience-native-physical-products-in-solidworks_c0Lf9S0pTf-GIE_PfwL9RA"
  - "https://forum.solidworks.com/forum-solidworks/0optq2nhSkONQ--U_S3N_A/very-bad-performance-3d-experience-r2025-hotfix-07"
  - "https://forum.solidworks.com/wiki/AuBbVpupRJyJbisAHr8rCw/understanding-solidworks-my-session-architecture-and-optimizing-performance"
---

# 3DEXPERIENCE SOLIDWORKS Integration: On-the-Fly Conversion Performance Degradation, MySession Refresh Freezes, Connection Errors, Multi-Configuration Save Delays, and 2026 Regression

The 3DEXPERIENCE platform integrates with SOLIDWORKS through the 3DEXPERIENCE task pane tab, which uses a Chromium Embedded Framework (CEF) browser to communicate with platform web services. This architecture creates specific performance bottlenecks when loading platform-native components, refreshing MySession, handling multi-configuration files, and maintaining connectivity. This guide covers the 5 most common integration performance problems with fixes from the SOLIDWORKS and Dassault community forums.

## 1. On-the-Fly Conversion: Platform-Native Physical Products Cause System Hangs

### Symptom

Opening assemblies in SOLIDWORKS that contain Physical Products created directly within the 3DEXPERIENCE platform (including Duplicates and those created using SOLIDWORKS templates) causes:
1. **Severe latency**: Opening speeds significantly degraded compared to SOLIDWORKS-native parts
2. **System instability**: SOLIDWORKS enters "Not Responding" during the conversion process
3. **Project blockage**: Top-level assemblies can no longer be opened once a threshold is reached

### Critical Finding

The threshold for assembly opening failure **decreased significantly following the 2026 update** — assemblies that previously opened now fail.

### Root Cause

SOLIDWORKS triggers an **"on-the-fly" conversion process** when loading platform-native Physical Products. Even in Lightweight or Large Assembly Mode, the conversion runs, consuming significant CPU and memory.

### Why This Workflow Exists

Users add non-geometric components (e.g., internal electrical connector pins) directly in 3DEXPERIENCE to maintain BOM integrity without CAD modeling overhead. This is a "platform-first" efficiency workflow.

### Conflict with VAR Guidance

VARs suggest all Physical Products should be created and initialized within SOLIDWORKS. Users find this unacceptable — it forces CAD tasks on non-CAD users and contradicts the platform-first approach.

### Fix

1. **Request "Metadata-only" or "Virtual" item handling** from Dassault — allow SOLIDWORKS to handle platform-native products without triggering conversion
2. **Create Physical Products in SOLIDWORKS** when possible — avoids the conversion process entirely
3. **Minimize platform-native components in assemblies** — use SOLIDWORKS-native parts for geometric components
4. **Use Representations for multi-configuration files** — creates fewer 3DEXPERIENCE objects on the platform
5. **Report the 2026 regression to Dassault** — the decreased threshold is a bug, not a design change

## 2. MySession Refresh Freezes SOLIDWORKS

### Symptom

SOLIDWORKS becomes temporarily frozen or unusable during MySession refresh operations. The freeze duration increases with the number of components (rows) in MySession.

### Root Cause

MySession refreshes to show the content of the active SOLIDWORKS document window. The refresh process:
1. Queries 3DEXPERIENCE platform web services for metadata
2. Updates the CEF browser display
3. Synchronizes component states between SOLIDWORKS and the platform

With many components, this process takes significant time, freezing SOLIDWORKS.

### Performance Improvement (2024x GA)

The MySession refresh behavior was changed in 2024x General Availability to **reduce the amount of time SOLIDWORKS is frozen** during refresh.

### Fix

1. **Reduce MySession rows**: Use the option to display fewer rows for very large assembly structures
2. **Use Representations for multi-configuration files**: Creates fewer 3DEXPERIENCE objects, reducing refresh time
3. **Minimize mapped bidirectional attributes**: Each mapped attribute adds a query per component per save/open
4. **Update to latest 3DEXPERIENCE release**: Refresh behavior improvements are included in newer versions
5. **Check browser performance**: If the 3DEXPERIENCE tab is slow, the same slowness appears in Chrome/Edge (both use Chromium) — the issue may be client/server communication, not SOLIDWORKS

## 3. Unable to Connect to 3DEXPERIENCE

### Symptom

SOLIDWORKS displays a connection error every time it launches, despite an active subscription. Deleting %temp% folders doesn't help. Support doesn't respond.

### Root Cause

Possible causes:
- 3DEXPERIENCE platform web services are unreachable (network/firewall)
- 3DPassport authentication failure
- Corrupted local credential cache
- DNS resolution issues for 3DEXPERIENCE servers
- Proxy server blocking 3DEXPERIENCE traffic

### Fix

1. **Check network connectivity** to 3DEXPERIENCE servers:
   - Test access to 3DPassport login page in a browser
   - If browser also fails, it's a network issue
   - If browser works but SOLIDWORKS doesn't, it's a local cache issue

2. **Clear credential cache**:
   - Delete `%temp%` folders
   - Clear browser cache and cookies for 3DEXPERIENCE domains
   - Check Windows Credential Manager for stored 3DEXPERIENCE credentials

3. **Check firewall and proxy**:
   - Ensure 3DEXPERIENCE domains are whitelisted
   - Check proxy settings — 3DEXPERIENCE uses HTTPS on standard ports
   - Temporarily disable firewall to test

4. **Check DNS resolution**:
   - Verify 3DEXPERIENCE server names resolve correctly
   - Try using a different DNS server (e.g., 8.8.8.8)

5. **Contact support through multiple channels**:
   - Submit ticket through 3DEXPERIENCE platform
   - Contact VAR directly
   - Use SOLIDWORKS forum for community help

## 4. Multi-Configuration File Save Delays

### Symptom

Save times are extremely slow for SOLIDWORKS part files with many configurations and mapped bidirectional attributes.

### Root Cause

Each configuration creates a separate 3DEXPERIENCE object. With mapped attributes, each object requires a separate platform query:
- 10 mapped attributes × 100 configurations = 1,000 platform operations
- Each operation involves network communication with 3DEXPERIENCE web services
- Save time increases multiplicatively

### Fix

1. **Use Representations instead of configurations**:
   - Representations create fewer 3DEXPERIENCE objects
   - Performance improvement is significant for multi-configuration files
   - Convert legacy multi-configuration files to Representations

2. **Reduce mapped bidirectional attributes**:
   - Only map attributes that are genuinely needed bidirectionally
   - Remove unnecessary attribute mappings
   - Use one-way mappings where possible

3. **MySession Save options**:
   - **Save related drawings**: Turn off if you have many drawings in local work folder — causes delays traversing drawing files
   - **Enable save optimization**: Optimizes which SOLIDWORKS files to traverse when building the Save dialog
   - **Component-level appearances**: Can slow save performance for assemblies with many appearances

4. **Split multi-configuration files**:
   - Create separate part files for each configuration
   - Reduces platform objects per save operation
   - May require assembly structure changes

## 5. R2025x Hotfix 0.7: Severe Input Lag

### Symptom

After updating to SOLIDWORKS Connected 2025 SP0.0 / 3DEXPERIENCE R2025x HOTFIX 0.7, users experience significant lag when typing in parameter fields. Hardware: AMD Ryzen 7 7800X3D, 32GB RAM, RTX 4070 SUPER — all drivers up to date.

### Root Cause

A regression introduced in the R2025x HOTFIX 0.7 update affecting the CEF browser interaction with SOLIDWORKS parameter input fields.

### Fix

1. **Check for newer hotfixes** — Dassault may have released a follow-up fix
2. **Roll back to previous version** if the lag is unbearable
3. **Report to VAR** — include system specs and specific lag scenarios
4. **Check if lag occurs in browser too** — if Chrome/Edge also lag on 3DEXPERIENCE, the issue is platform-side

## 6. PDM Standard: Slow Login and File Opening

### Symptom

One client PC takes ~2 minutes to login to PDM (vs 2 seconds on other PCs). Opening any file from PDM takes another ~2 minutes, during which SOLIDWORKS hangs completely. Once one file is open, speed returns to normal.

### Diagnosis

- Same installation works on 6 other PCs
- Reinstalled Windows 7 / SOLIDWORKS — no change
- Firewall disabled — no change
- All drivers updated — no change
- Different network cables and WiFi — no change
- IPv6 disabled — no change

### Root Cause

Likely a **hardware issue** despite HP's claim that it's software. The same installation works on other PCs, pointing to a hardware-specific problem (network adapter, motherboard, storage controller).

### Fix

1. **Test with a different network adapter** (USB Ethernet dongle)
2. **Check storage controller** — slow disk I/O can cause PDM cache delays
3. **Check motherboard firmware** — BIOS updates may resolve chipset issues
4. **Test with a Linux live USB** — if network and disk are slow in Linux too, it's hardware
5. **Replace the PC** if hardware diagnosis confirms the issue

## Best Practices

1. **Create Physical Products in SOLIDWORKS** when possible — avoids on-the-fly conversion
2. **Use Representations instead of configurations** — fewer platform objects, faster saves
3. **Minimize mapped bidirectional attributes** — each adds a platform query per component
4. **Turn off "Save related drawings"** if you have many local drawings
5. **Enable save optimization** in MySession options
6. **Reduce MySession rows** for large assemblies
7. **Check browser performance** — if Chrome/Edge are also slow, it's platform-side
8. **Clear credential cache** for connection errors
9. **Report regressions to VAR** — the 2026 threshold decrease and R2025x lag are bugs
10. **Test on multiple machines** — if only one PC is slow, it's likely hardware
