---
title: "KeyShot GPU Mode Setup and NVLink Multi-GPU: CUDA Errors, Driver Versions, and Memory Scaling"
excerpt: "KeyShot GPU mode fails with CUDA errors after updates, or doesn't utilize all available VRAM. I cover the driver version requirements, NVLink multi-GPU memory scaling setup, and the OpenGL error resolution for remote and VM environments."
category: "deployment"
softwareSlug: "keyshot"
keyword: "KeyShot GPU mode CUDA error NVLink multi-GPU setup"
slug: "keyshot-gpu-mode-cuda-nvlink-setup-fix"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-06-23"
sources:
  - "https://support.keyshot.com/en/knowledge-base/knowledge/when-trying-to-use-keyshot-gpu"
  - "https://support.keyshot.com/en/knowledge-base/gpu-mode-fails-to-launch-after-upgrading-to-2025.2"
  - "https://manuals.keyshot.com/kss2026/en-us/manual/Nvidia-Requirements.htm"
---

# KeyShot GPU Mode Setup and NVLink Multi-GPU: CUDA Errors, Driver Versions, and Memory Scaling

I configure KeyShot GPU rendering for product design teams, and the GPU mode setup is straightforward when you know the requirements — but it fails silently when you don't. The most common issues are CUDA errors after updates, disabled GPU icons due to outdated drivers, and single-GPU VRAM limits on large scenes.

## GPU Mode Hardware Requirements

KeyShot's GPU mode uses NVIDIA CUDA for ray tracing. The requirements from KeyShot's official documentation:

- **Minimum**: NVIDIA GPU with CUDA Compute Capability 5.2 (Maxwell architecture — GTX 980, Quadro M6000)
- **Recommended**: NVIDIA RTX platform with minimum 8GB VRAM
- **Driver**: Version 545.84 minimum, 576.52 recommended (as of KeyShot 2026)

**AMD GPUs**: KeyShot GPU mode does not support AMD GPUs. GPU mode is NVIDIA-only. AMD users must use CPU rendering.

**If the GPU icon is disabled**: This means your driver version is below the minimum requirement. Update your NVIDIA driver to enable GPU mode.

## Setting Up GPU Mode

1. Ensure your NVIDIA driver is up to date (see requirements above)
2. In **NVIDIA Control Panel → Manage 3D settings → Program Settings**, add `KeyShot.exe` and set to **High-performance NVIDIA processor**
3. Launch KeyShot
4. Click the **GPU icon** in the ribbon
5. KeyShot switches to GPU rendering — the real-time view should update faster

**If GPU mode won't activate**: See the CUDA error troubleshooting section below.

## CUDA Errors After KeyShot Updates

After updating KeyShot (especially to version 2025.2), GPU mode may throw CUDA errors and fail to activate. KeyShot's support documentation provides the official fix:

**Step 1 — Clean driver installation**:
1. Download the latest NVIDIA driver
2. Run the installer and select **Custom (Advanced)** installation
3. Check **Perform a clean installation** — this removes all old driver components
4. Complete the installation and restart

**Step 2 — Complete KeyShot reinstallation**:
1. Uninstall KeyShot via Windows Settings
2. Delete all KeyShot data folders:
   - `C:\Users\[username]\Documents\KeyShot`
   - `C:\Users\Public\Documents\KeyShot`
   - `C:\ProgramData\Luxion\KeyShot`
   - `C:\Users\[username]\AppData\Local\Luxion\KeyShot`
3. Restart the computer
4. Download and install the latest KeyShot version from the KeyShot website
5. Launch KeyShot and enable GPU mode

**Important**: Back up your custom materials and environments from the Documents\KeyShot folder before deleting it. You'll lose all custom resources if you don't back them up.

## Known Problematic Driver Versions

KeyShot's knowledge base identifies specific driver versions to avoid:

- **537.58 and below**: Known issues — too old for modern KeyShot
- **565.09**: Memory leak with KeyShot
- **566.03**: Memory leak with KeyShot
- **566.14**: Memory leak with KeyShot
- **566.36**: Memory leak with KeyShot

If you're using any of these versions, update to 576.52 or later. The memory leak in the 565-566 range causes KeyShot to consume increasing VRAM over time, eventually crashing when VRAM is exhausted.

**My driver management protocol**: I check the KeyShot support page before installing any NVIDIA driver update. If the driver version is listed as problematic, I skip it and wait for the next release. I test new drivers on one workstation before rolling out to the team.

## NVLink Multi-GPU Memory Scaling

KeyShot Studio's GPU mode supports memory scaling across multiple GPUs connected with NVIDIA NVLink. This is critical for large scenes that exceed a single GPU's VRAM.

**How it works**: Two GPUs connected via NVLink share their VRAM. For example, two RTX 8000 GPUs with 48GB each provide a combined 96GB of GPU memory. KeyShot sees this as a single pool of VRAM.

**Setup**:
1. Ensure both GPUs are the same model and support NVLink
   - **Consumer GPUs**: RTX 3090 and RTX 4090 support NVLink (via NVLink bridge)
   - **Professional GPUs**: Quadro/RTX A-series with NVLink support
2. Connect the GPUs with an **NVIDIA NVLink bridge**
3. Enable SLI/NVLink in **NVIDIA Control Panel → 3D Settings → Configure SLI**
4. Launch KeyShot — it should detect the combined VRAM
5. Verify in the **Heads Up Display** in the real-time view — it should show the combined GPU memory

**Performance note**: NVLink provides memory scaling but not proportional performance scaling. Two GPUs with NVLink render approximately 1.5-2x faster than one GPU, not 2x. The main benefit is the increased VRAM, not raw speed.

**Without NVLink**: If you have multiple GPUs without NVLink (e.g., two different GPU models), KeyShot can still use them for rendering, but each GPU renders a portion of the image independently. The VRAM is not combined — each GPU is limited to its own memory.

## OpenGL Errors in Remote and VM Environments

KeyShot requires OpenGL 2.0+ for rendering. In certain environments, OpenGL is not available:

**Windows Remote Desktop**: RDP doesn't support OpenGL 2.0. When you connect via RDP and launch KeyShot, you get: "KeyShot requires OpenGL 2.0 but (1.1.0) was found!"

**Fix**: Use a different remote desktop tool that supports OpenGL:
- **TeamViewer**: Supports OpenGL passthrough
- **Microsoft Teams screen sharing**: Works for viewing but not for GPU rendering
- **Parsec**: Designed for GPU-accelerated remote access — best option for KeyShot

**Virtual Machines**: Most VM software doesn't support OpenGL 2.0 without special configuration:
- **VMware**: Requires hardware-accelerated 3D support enabled in VM settings
- **Hyper-V**: Doesn't support GPU passthrough for OpenGL — use RemoteFX if available
- **Citrix**: Requires NVIDIA GRID vGPU for OpenGL support

**Docking stations**: Some docking stations use their own GPU (typically a basic display adapter) that doesn't support OpenGL 2.0. When KeyShot runs on the docking station's GPU, it fails.

**Fix**: Connect monitors directly to the laptop's HDMI/DisplayPort outputs, bypassing the docking station. Or configure the laptop to always use the dedicated GPU for KeyShot in NVIDIA Control Panel.

## Monitoring GPU Performance in KeyShot

KeyShot's **Heads Up Display** (HUD) shows real-time GPU statistics:

1. Enable the HUD: **View → Heads Up Display** (or Ctrl+H)
2. Key metrics:
   - **GPU Memory**: Shows VRAM usage — if this approaches your GPU's maximum, you need to optimize the scene or use NVLink
   - **Render Time**: Time per frame update
   - **Samples**: Current sample count
   - **FPS**: Real-time view framerate

I monitor the GPU Memory value constantly. If it exceeds 80% of VRAM, I know I'm at risk of an out-of-memory crash and need to reduce scene complexity.

## Summary

KeyShot GPU mode requires specific NVIDIA driver versions, proper installation order, and correct GPU configuration. My setup process: install NVIDIA Studio Driver 576.52+ → configure NVIDIA Control Panel for KeyShot → enable GPU mode in KeyShot → verify with HUD. For CUDA errors after updates: clean driver install + complete KeyShot reinstall. For large scenes: use NVLink multi-GPU for combined VRAM. For remote/VM environments: use Parsec or TeamViewer instead of RDP, and bypass docking stations that don't support OpenGL 2.0.
