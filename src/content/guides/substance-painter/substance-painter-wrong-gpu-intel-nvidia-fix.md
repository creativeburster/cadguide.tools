---
title: "Substance Painter GPU Selection: Wrong GPU, Intel Override, and NVIDIA Control Panel Configuration"
excerpt: "Substance Painter runs on the Intel integrated GPU instead of the dedicated NVIDIA card, causing poor performance and GPU error messages. We cover the NVIDIA Control Panel configuration, Windows Graphics settings, and the log file analysis we use to verify GPU selection."
category: "deployment"
softwareSlug: "substance-painter"
keyword: "Substance Painter wrong GPU Intel NVIDIA control panel fix"
slug: "substance-painter-wrong-gpu-intel-nvidia-fix"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-06-22"
sources:
  - "https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/technical-support/performance-guidelines/gpu-drivers"
  - "https://community.adobe.com/questions-59/gpu-error-message-626830"
---

# Substance Painter GPU Selection: Wrong GPU, Intel Override, and NVIDIA Control Panel Configuration

We see this issue on almost every laptop and many desktop workstations: Substance Painter runs on the Intel integrated GPU instead of the dedicated NVIDIA card. The symptoms are obvious — poor performance, GPU error messages on launch, and VRAM readings that don't match the dedicated GPU's specifications. The fix requires configuration in multiple places because Windows, NVIDIA, and Adobe each have their own GPU selection mechanisms.

## Symptom: GPU Error Message on Launch

When Substance Painter launches, it shows a warning: "Your operating system may automatically shut down Substance 3D Painter during long computations because your GPU doesn't support preemption."

This message appears when Painter detects it's running on a GPU that doesn't support GPU preemption — typically an Intel integrated GPU. The warning is telling you that Windows might crash Painter during heavy operations because the Intel GPU can't handle long-running GPU tasks.

**The root cause**: Windows has routed Substance Painter to the Intel integrated GPU instead of the dedicated NVIDIA GPU. This happens on systems with switchable graphics (Optimus technology).

## Fix 1: NVIDIA Control Panel Configuration

This is the primary fix and should be applied first:

1. Open **NVIDIA Control Panel** (right-click desktop → NVIDIA Control Panel)
2. Go to **Manage 3D settings → Program Settings** tab
3. Click **Add** and browse to the Substance Painter executable:
   - Default path: `C:\Program Files\Adobe\Adobe Substance 3D Painter.exe`
   - Or find it via Windows Start menu → right-click → Open file location
4. Set the **Preferred graphics processor** to **High-performance NVIDIA processor**
5. Click **Apply**

**Also configure these NVIDIA settings** (recommended by Adobe):
- **Threaded Optimization**: Off
- **Vertical Synchronization**: Off

These settings prevent NVIDIA's driver-level optimizations from interfering with Painter's GPU operations.

## Fix 2: Windows Graphics Settings

Windows 10/11 has its own GPU selection mechanism that can override NVIDIA Control Panel:

1. Open **Windows Settings → System → Display → Graphics**
2. Click **Browse** and add `Adobe Substance 3D Painter.exe`
3. Click on the added application → **Options**
4. Select **High performance** (this forces the dedicated NVIDIA GPU)
5. Click **Save**

**Important**: The Windows Graphics setting takes precedence over NVIDIA Control Panel in some Windows versions. Configure both to ensure Painter always uses the dedicated GPU.

## Fix 3: Verify GPU Selection in Painter's Log

After configuring the GPU settings, verify that Substance Painter is actually using the NVIDIA GPU:

1. Launch Substance Painter
2. Go to **Help → Open Log Folder**
3. Open the latest log file in a text editor
4. Search for "GPU" or "OpenGL" — the log should show the NVIDIA GPU name
5. If it shows "Intel" — the configuration didn't take effect, restart the computer and try again

**What the log should show**:
```
GPU 0: NVIDIA GeForce RTX 4070
GPU 1: Intel(R) UHD Graphics 630
Selected GPU: NVIDIA GeForce RTX 4070
```

If "Selected GPU" shows Intel, the NVIDIA Control Panel and Windows Graphics settings aren't being respected.

## Fix 4: Launch with NVIDIA GPU Explicitly

If the configuration changes don't take effect, you can force Painter to launch on the NVIDIA GPU:

1. Right-click the Substance Painter shortcut or executable
2. In Windows 11: **Show more options → Run with graphics processor → High-performance NVIDIA processor**
3. In Windows 10: **Run with graphics processor → High-performance NVIDIA processor**

This is a per-launch override — it doesn't persist between sessions. Use it as a temporary workaround while troubleshooting the persistent configuration.

## Fix 5: Disable Intel GPU in Device Manager

If none of the above works, you can disable the Intel integrated GPU entirely:

1. Open **Device Manager → Display Adapters**
2. Right-click the **Intel integrated GPU** → **Disable device**
3. Restart the computer
4. Now all applications must use the NVIDIA GPU

**Warning**: Disabling the Intel GPU may cause issues if your monitors are connected to the Intel GPU's outputs (common on laptops where the Intel GPU drives the built-in display). Test this carefully — if your screen goes black, restart in Safe Mode and re-enable the Intel GPU.

**When to use this**: Only on desktop workstations where the Intel GPU is not connected to any display. On laptops, this often causes display issues.

## Fix 6: Check for GPU Preemption Support

Adobe's documentation mentions that some GPUs don't support preemption, which causes the warning message. To check:

1. The warning message itself indicates the GPU doesn't support preemption
2. If you've configured Painter to use the NVIDIA GPU and the warning disappears, the issue was GPU selection
3. If the warning persists even with the NVIDIA GPU, your NVIDIA GPU may be too old — preemption support started with Maxwell (GTX 900) series

## Fix 7: Update GPU Drivers

Outdated drivers can cause incorrect GPU selection behavior:

1. For NVIDIA: Download and install the latest **Studio Driver** using a clean installation
2. For Intel: Update the Intel GPU driver from the manufacturer's website (Dell, HP, Lenovo) — not directly from Intel, as OEM drivers are customized
3. Restart the computer after updating both drivers
4. Reconfigure NVIDIA Control Panel and Windows Graphics settings after the update

## Fix 8: Adobe's TDR Recommendation

If the GPU error message persists even after selecting the correct GPU, Adobe recommends increasing the TDR delay:

1. Open **Registry Editor**
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\GraphicsDrivers`
3. Create or modify **TdrDelay** (DWORD 32-bit): Set to **10** (decimal)
4. Create or modify **TdrDdiDelay** (DWORD 32-bit): Set to **10** (decimal)
5. Restart the computer

This gives the GPU more time to complete long computations before Windows triggers a timeout recovery, which would crash Painter.

## Monitoring GPU Usage

After configuring the correct GPU, monitor usage to confirm Painter is using it:

1. Open **Task Manager → Performance → GPU**
2. You should see two GPU entries (Intel and NVIDIA) if you have switchable graphics
3. While Substance Painter is running, the **NVIDIA GPU** should show significant usage (30-80%)
4. The Intel GPU should show minimal usage (0-5%)

If the Intel GPU shows high usage while Painter is running, the GPU selection configuration didn't take effect.

**Better monitoring tool**: Use **GPU-Z** or **HWiNFO64** for more detailed GPU monitoring, including VRAM usage per GPU. This helps confirm that Painter is using the NVIDIA GPU's VRAM, not the Intel GPU's shared memory.

## Preventive Measures

1. **Configure GPU settings before first launch**: Set NVIDIA Control Panel and Windows Graphics settings before opening Substance Painter for the first time
2. **Verify in the log**: Always check the log file after installation to confirm the correct GPU is selected
3. **Keep drivers updated**: Update NVIDIA Studio Drivers monthly
4. **Don't rely on automatic selection**: Windows' automatic GPU selection is unreliable for professional applications — always set it manually
5. **Document the configuration**: Keep a record of the NVIDIA Control Panel and Windows Graphics settings for each workstation, so IT can quickly reconfigure after a Windows reset or driver update

## Summary

Substance Painter running on the wrong GPU is the most common cause of performance issues on laptops and dual-GPU workstations. Our fix order: configure NVIDIA Control Panel for High-performance NVIDIA processor → configure Windows Graphics settings → verify in Painter's log file → update GPU drivers → increase TDR delay if warning persists → disable Intel GPU as last resort (desktop only). The NVIDIA Control Panel and Windows Graphics settings together resolve the wrong GPU issue in about 95% of cases we encounter.
