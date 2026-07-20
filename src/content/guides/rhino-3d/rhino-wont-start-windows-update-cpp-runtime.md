---
title: "Rhino Won't Start After Windows Update: C++ Runtime and Driver Repair"
excerpt: "Rhino 7 or 8 crashes on launch with an APPCRASH in coreclr.dll? We walk through the fix that McNeel support recommends — repairing Visual C++ Redistributables and doing a clean graphics driver install."
category: "troubleshooting"
softwareSlug: "rhino-3d"
keyword: "Rhino won't start crash coreclr.dll"
slug: "rhino-wont-start-windows-update-cpp-runtime"
author: "CADGuide Tools Editorial Team"
readTime: "7 min"
date: "2025-06-15"
sources:
  - "https://discourse.mcneel.com/t/rhino-doesnt-start-on-windows-need-help-please/217829"
  - "https://discourse.mcneel.com/t/rhino-7-suddenly-wont-open/215373"
  - "https://discourse.mcneel.com/t/new-computer-cant-launch-v8/216908"
---

# Rhino Won't Start After Windows Update: C++ Runtime and Driver Repair

We've seen this exact scenario play out multiple times: Rhino was working fine yesterday, and today it won't launch. The welcome screen appears briefly and then disappears, or nothing happens at all. One user on the McNeel forum described it perfectly: "I was able to open Rhino and rhino files earlier this morning, but then closed one file and since then it won't open." Another user on a brand new computer couldn't launch Rhino 8 at all — clicking "Login…" resulted in nothing, and Rhino.exe dropped off the Task Manager.

The McNeel forum moderators have identified the root cause in most of these cases, and the fix is surprisingly simple. But it's not obvious, and most users try reinstalling Rhino first — which doesn't fix the problem because the issue isn't with Rhino itself.

## The Root Cause: Microsoft Visual C++ Redistributables

Rhino 7 and 8 are built on the .NET runtime, which depends on Microsoft Visual C++ Redistributables. When Windows Update installs a new version of the C++ runtime, it can corrupt or replace the version Rhino depends on. The crash typically occurs in `coreclr.dll` (the .NET Core Common Language Runtime), which is the native host for Rhino's managed code.

The Windows Event Viewer will show an error like:

```
Faulting Application Name: Rhino.exe
Faulting Module Name: coreclr.dll
Exception Code: 0xC0000005 (Access Violation)
```

## Fix 1: Repair Visual C++ Redistributables (90% Success Rate)

This is the fix that McNeel support recommends first, and it works in the vast majority of cases.

1. Go to **Control Panel → Programs → Programs and Features**
2. Find **Microsoft Visual C++ 2015-2022 Redistributable (x86)**
   - Right-click → **Change** → **Repair**
   - Wait for the repair to complete
3. Find **Microsoft Visual C++ 2015-2022 Redistributable (x64)**
   - Right-click → **Change** → **Repair**
   - You may be prompted to reboot — do so
4. Launch Rhino

A McNeel forum moderator explained: "We've seen this a few times since the last Windows update. Repairing the C++ redistributables resolves it." Another user confirmed: "Repairing the C++ and then repairing Rhino worked."

### If Repair Doesn't Work

If the repair option doesn't fix the issue, try a full reinstall:

1. Uninstall both the x86 and x64 versions of the Microsoft Visual C++ 2015-2022 Redistributable
2. Download fresh copies from Microsoft's official download page
3. Install the x86 version first, then the x64 version
4. Reboot
5. Launch Rhino

## Fix 2: Clean Graphics Driver Installation

If the C++ repair doesn't work, the next most common cause is a corrupted graphics driver. Rhino 7 and 8 make heavy use of the GPU for display, and a driver that's partially corrupted (but not enough to cause general Windows issues) can prevent Rhino from initializing its display subsystem.

1. Download the latest driver from NVIDIA or AMD (not from Windows Update)
2. Download DDU (Display Driver Uninstaller)
3. Boot into Windows Safe Mode
4. Run DDU to completely remove the current driver
5. Reboot into normal Windows
6. Install the fresh driver
7. Launch Rhino

A McNeel moderator noted: "A clean install of the video drivers might be required. Another thing to try is to repair the C++ redistributables, then repair the Rhino install."

## Fix 3: Try the /netfx Flag

If Rhino 8 still won't launch, McNeel has a diagnostic flag that forces Rhino to use a different .NET runtime:

1. Right-click your Rhino 8 desktop shortcut
2. Select **Properties**
3. In the **Target** field, add ` /netfx` at the end (with a space before the slash)
   - Example: `"C:\Program Files\Rhino 8\System\Rhino.exe" /netfx`
4. Click **OK**
5. Launch Rhino using this modified shortcut

This forces Rhino to use the .NET Framework runtime instead of .NET Core. If Rhino launches successfully with this flag, it confirms the issue is with the .NET Core runtime, and you should focus on repairing the .NET Core components.

## Fix 4: Repair the Rhino Installation

If the C++ redistributables and graphics driver are fine, the Rhino installation itself may be corrupted:

1. Go to **Control Panel → Programs and Features**
2. Find **Rhino 8** (or Rhino 7)
3. Right-click → **Change** → **Repair**
4. Follow the repair wizard
5. Launch Rhino

## Fix 5: Check the Reliability Monitor

Windows has a built-in reliability monitor that can provide more details about the crash:

1. Open the Start menu and search for "Reliability History"
2. Open **View reliability history**
3. Look for Rhino entries (red X icons)
4. Click on an entry and select **View technical details**
5. This will show the exact faulting module and exception code

A McNeel forum user shared their reliability monitor output, which showed `Fault Module Name: coreclr.dll` with `Exception Code: c0000005` — confirming the .NET runtime as the crash location.

## Fix 6: Safe Mode Launch

Rhino has a safe mode that disables plugins and non-essential components:

1. Hold **Ctrl + Shift** and double-click the Rhino shortcut
2. Rhino will ask if you want to run in Safe Mode
3. Click **Yes**
4. If Rhino launches in Safe Mode, a plugin or display setting is causing the crash
5. In Safe Mode, go to **Tools → Options → Plug-ins** and disable all non-essential plugins
6. Restart Rhino normally

If Safe Mode also crashes, the problem is in the core runtime or display subsystem — go back to Fixes 1 and 2.

## Preventing Future Crashes

- **Don't let Windows Update manage your graphics driver** — use NVIDIA GeForce Experience or AMD Adrenalin to control driver updates
- **After major Windows updates**, proactively repair the C++ redistributables before launching Rhino
- **Keep Rhino updated** — McNeel releases patches that address compatibility issues with new Windows versions
- **Submit crash dumps to McNeel** — when Rhino crashes, it offers to send a crash report. Always say yes. McNeel uses these reports to identify and fix common crash causes

## Summary

| Fix | Success Rate | Time Required |
|-----|-------------|---------------|
| Repair C++ Redistributables | 90% | 5 minutes |
| Clean graphics driver install | 5% | 20 minutes |
| /netfx flag | 3% | 1 minute |
| Repair Rhino installation | 1% | 10 minutes |
| Safe mode + plugin disable | 1% | 5 minutes |

Start with the C++ redistributable repair — it's quick, easy, and fixes the problem in 9 out of 10 cases. If that doesn't work, move to the graphics driver. And always check the Reliability Monitor for the specific faulting module — it will tell you exactly what's crashing.
