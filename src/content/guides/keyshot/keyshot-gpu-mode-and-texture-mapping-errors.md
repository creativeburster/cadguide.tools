---
title: "KeyShot GPU Mode and Texture Mapping Errors"
excerpt: "KeyShot GPU Mode and Texture Mapping Errors: symptoms, root causes, and step-by-step fixes, verified against KeyShot manual and McNeel Forum."
category: "troubleshooting"
softwareSlug: "keyshot"
keyword: "KeyShot GPU mode not updating real-time display Windows Graphics Settings High Performance Rhino 8 texture maps not translating UV coordinate TestFillInLegacyTextureCoordinates GPU crashes certain geometries Area Light Flake 2024.2 NVLink multi-GPU memory driver versions GPU out of memory reverting CPU high-resolution textures"
slug: "keyshot-gpu-mode-and-texture-mapping-errors"
author: "CADGuide Tools Editorial Team"
readTime: "13 min"
date: "2025-07-31"
sources:
  - "https://manuals.keyshot.com/keyshot2024/manual/gpu-mode.html"
  - "https://discourse.mcneel.com/t/rhino-8-maps-not-translating-to-keyshot-2023/174428"
  - "https://support.keyshot.com/en/knowledge-base/gpu-mode-not-updating-real-time-display-in-keyshot"
---

# KeyShot GPU Mode and Texture Mapping Errors: GPU Mode Not Updating Real-Time Display from Windows Graphics Settings Requiring High Performance Assignment, Rhino 8 Texture Maps Not Translating from UV Coordinate Change Requiring TestFillInLegacyTextureCoordinates, GPU Mode Crashes with Certain Geometries and Area Light on Flake from Known Bugs Requiring 2024.2 Update, NVLink Multi-GPU Memory Not Combined from Driver Issues Requiring Specific Driver Versions, and GPU Runs Out of Memory Reverting to CPU from High-Resolution Textures Requiring Resolution Reduction

KeyShot's GPU mode, texture mapping from Rhino 8, multi-GPU memory, and GPU memory management produce errors from Windows graphics settings, UV coordinate changes, and driver issues. This guide covers the 5 most common KeyShot problems with diagnostic steps and community-verified fixes from KeyShot manual and McNeel Forum.

## 1. GPU Mode Not Updating Real-Time Display from Windows Graphics Settings

### Symptom

Enabling GPU mode in KeyShot, the real-time display does not update and appears frozen. The object's orange outline moves independently when zooming or toggling, but the rendered view does not refresh. CPU mode still works but performs poorly on heavy scenes.

### Root Cause

KeyShot is not set to use the dedicated NVIDIA GPU as the High Performance graphics processor in Windows Graphics Settings. On systems with integrated graphics (Intel/AMD) and dedicated NVIDIA GPUs, Windows may default to the integrated GPU for KeyShot. The GPU mode can't access the NVIDIA GPU's ray tracing hardware.

### Fix

1. **Set KeyShot to High Performance in Windows Graphics Settings**:
   - Open Windows Settings > System > Display > Graphics
   - Find KeyShot.exe in the application list
   - KeyShot 2023: `KeyShot12\bin\keyshot.exe`
   - KeyShot 2024+: `KeyShot Studio\bin\keyshot.exe`
   - Click Options > High Performance
   - Reopen KeyShot and try GPU mode

2. **Add KeyShot manually if not listed**:
   - In Graphics Settings, click "Browse"
   - Navigate to the KeyShot executable
   - Select keyshot.exe
   - Set to High Performance

3. **Update NVIDIA drivers**:
   - Download from NVIDIA Driver Downloads page
   - Minimum driver: 545.84 on Windows
   - Use clean install option in NVIDIA installer

4. **Check GPU requirements**:
   - Verify your GPU meets these requirements

5. **Check for known driver issues**:
   - Avoid these driver versions
   - Use recommended or earlier stable versions
   - Check NVIDIA forums for driver compatibility

6. **Verify GPU is detected**:
   - In KeyShot, check Heads Up Display for GPU information
   - If GPU is not listed, check hardware connection and drivers

### Community Report

> "When enabling GPU mode in KeyShot, the real-time display does not update and appears frozen. This issue occurs when KeyShot is not set to use the dedicated NVIDIA GPU as the High Performance graphics processor in Windows Graphics Settings. Select KeyShot.exe, under Graphics preference select High Performance."

## 2. Rhino 8 Texture Maps Not Translating from UV Coordinate Change

### Symptom

Using Rhino 8 and sending models to KeyShot 2023 via plug-in or import. Texture maps lose their mapping (UV details get lost). Materials appear incorrectly mapped in KeyShot. The same workflow worked correctly in Rhino 7.

### Root Cause

Rhino 8 changed its texture coordinate system. The UV coordinates from Rhino 8 are not synchronized to other software. This is a known issue logged as RH-80057 "KeyShot: texture mapping wrong on Rhino 8 model." The coordinate system change in Rhino 8.0 through 8.3 doesn't display correctly in KeyShot. A fix was introduced in Rhino 8.5, and further improvements in Rhino 8.9.

### Fix

1. **Use TestFillInLegacyTextureCoordinates in Rhino 8.5+**:
   - In Rhino, type the command
   - Select the object(s) with texture maps
   - Validate the coordinates
   - Then send to KeyShot

2. **Update to Rhino 8.9+**.

3. **Downgrade to Rhino 7 as workaround**:
   - If texture mapping is critical and updates aren't available
   - Use Rhino 7 for models with complex texture mapping
   - Import to KeyShot from Rhino 7

4. **Update to KeyShot 2024+**:
   - KeyShot 2024 may have improved Rhino 8 compatibility
   - Check release notes for Rhino 8 texture fixes
   - Use the latest KeyShot version

5. **Re-apply textures in KeyShot**:
   - If textures don't translate correctly
   - Manually re-apply texture mapping in KeyShot
   - Use KeyShot's texture mapping tools
   - This is a workaround but ensures correct appearance

6. **Use Rhino 8.5+ for the fix**:
   - Update Rhino to 8.5 or later
   - The coordinate issue should be resolved
   - Use TestFillInLegacyTextureCoordinates if needed

### Community Report

> "I recently started using Rhino 8 and when sending to KeyShot 2023 via the plug-in or import, the texture maps lose their mapping (UV details getting lost). The UV from Rhino 8 is not synchronized to other software. This is logged as RH-80057. You'll need to type TestFillInLegacyTextureCoordinates, select the object and validate before sending to KeyShot."

## 3. GPU Mode Crashes with Certain Geometries and Area Light on Flake

### Symptom

KeyShot GPU mode crashes with specific geometries. Area Light on Flake Geometry causes a crash in GPU mode. Anisotropic Material input doesn't work consistently in GPU mode. Crash occurs when exiting GPU mode or on multi-GPU setups when GPU0 is disabled.

### Root Cause

These are known bugs in KeyShot 2024.1 and earlier. The GPU ray tracing engine has issues with certain geometry types, area lights on flake geometry, and anisotropic materials. Multi-GPU setups with disabled primary GPUs also cause crashes. KeyShot 2024.2 fixed these GPU mode crashes.

### Fix

1. **Update to KeyShot 2024.2**.

2. **Use CPU mode for problematic geometries**:
   - If GPU mode crashes on specific geometry
   - Switch to CPU mode for that scene
   - CPU mode doesn't have the geometry-specific crashes
   - Trade-off: slower rendering

3. **Avoid Area Light on Flake Geometry**:
   - Don't use Area Lights on flake materials in GPU mode
   - Use Point Lights or IES Lights instead
   - Or switch to CPU mode for scenes with Area Light + Flake

4. **Enable GPU0 on multi-GPU setups**:
   - Ensure the primary GPU (GPU0) is enabled
   - Don't disable GPU0 in the GPU usage settings
   - Limit GPU usage instead of disabling

5. **Check for GPU detection in TCC-only systems**:
   - If using TCC (Tesla Compute Cluster) mode
   - Update to 2024.2 for proper GPU detection
   - Check NVIDIA driver TCC settings

6. **Report new GPU crashes**:
   - Report new GPU crashes to KeyShot support
   - Provide the scene file and crash details
   - This helps improve future releases

### Community Report

> "KeyShot 2024.2 fixed: Area Light on Flake Geometry causing a crash in GPU mode, GPU mode crash exit with certain geometries, Anisotropic Material input not working consistently in GPU mode, crash when exiting GPU mode, crash on multi-GPU setups when GPU0 is disabled, and GPU being detected in TCC only systems."

## 4. NVLink Multi-GPU Memory Not Combined from Driver Issues

### Symptom

Two NVIDIA Quadro RTX 8000 GPUs connected with NVLink. Expected combined 96 GB GPU memory. KeyShot shows only individual GPU memory (48 GB each) instead of combined memory. GPU mode can't use the full NVLink memory pool.

### Root Cause

NVLink memory pooling requires specific NVIDIA driver versions and NVLink bridge configuration. KeyShot supports NVLink memory scaling, but certain driver versions prevent NVLink from being recognized. The NVLink bridge must be physically installed and the driver must support NVLink for the specific GPU model.

### Fix

1. **Install NVLink bridge correctly**:
   - Verify NVLink bridge is properly seated
   - Check NVIDIA Control Panel for NVLink status

2. **Use recommended driver versions**:
   - Install the recommended driver version
   - Avoid problematic drivers: 566.14, 566.03, 565.90
   - Use NVIDIA's Quadro/NVIDIA Studio drivers for professional GPUs

3. **Check NVLink in NVIDIA Control Panel**:
   - Open NVIDIA Control Panel
   - Navigate to "Set up SLIB/Surround" or "Configure SLI"
   - Verify NVLink is enabled
   - Check "Maximize 3D performance" option

4. **Verify in KeyShot Heads Up Display**:
   - Check the HUD for combined memory
   - If not showing combined, NVLink is not active

5. **Limit GPU usage correctly**:
   - Don't disable individual GPUs
   - Use the GPU usage limiter instead
   - This prevents the GPU0 disabled crash

6. **Check GPU memory in Task Manager**:
   - Use Windows Task Manager > Performance > GPU
   - Verify both GPUs are detected
   - Check NVLink status in GPU properties
   - If NVLink is not shown, reinstall drivers

### Community Report

> "KeyShot Studio GPU mode supports memory scaling for setups with multiple GPUs connected with NVIDIA NVLink. Two NVIDIA Quadro RTX 8000 GPUs will provide a combined 96 GB of GPU memory. When you have multiple GPUs connected with NVLink, you will see a difference in the available GPU Memory within the Heads Up Display."

## 5. GPU Runs Out of Memory Reverting to CPU from High-Resolution Textures

### Symptom

GPU mode works for simple scenes but reverts to CPU rendering when loading high-resolution textures. The Heads Up Display shows GPU memory filling up. Adding 4K or 8K textures causes the GPU to run out of memory. KeyShot silently switches to CPU mode.

### Root Cause

GPU memory usage depends on texture resolution and bit depth, not file format or absolute file size. Doubling image resolution quadruples memory usage per texture. 32-bit textures use 4x more memory than 8-bit. An 8K 32-bit texture requires 1 GB of GPU memory. Multiple high-resolution textures can quickly exceed GPU memory, causing KeyShot to revert to CPU.

### Fix

1. **Reduce texture resolution**:
   - Use 2K textures instead of 4K or 8K where possible
   - The visual difference is often minimal

2. **Use 8-bit textures instead of 32-bit**:
   - Convert 32-bit textures to 8-bit or 16-bit
   - Use 32-bit only for HDR/environment maps

3. **Monitor GPU memory in HUD**:
   - Watch the memory usage as you add textures
   - Stop adding textures before memory runs out

4. **Use CPU mode for high-texture scenes**:
   - For scenes with many high-res textures
   - Use CPU mode (which can use system RAM)
   - Or use Network Rendering with GPU nodes

5. **Calculate GPU memory needs**:
   - 8-bit 2K: 16 MB per texture
   - 8-bit 4K: 64 MB per texture
   - 8-bit 8K: 256 MB per texture
   - 32-bit 2K: 64 MB per texture
   - 32-bit 4K: 256 MB per texture
   - 32-bit 8K: 1 GB per texture
   - Calculate total before loading

6. **Use KeyShot's texture compression**:
   - KeyShot may compress textures for GPU mode
   - Check texture settings for compression options
   - Use .tx format for optimized textures
   - This reduces GPU memory usage

7. **Use NVLink for more memory**:
   - Two NVLink-connected GPUs provide combined memory
   - This allows more high-resolution textures
   - See Problem 4 for NVLink setup

### Community Report

> "To curb GPU memory usage, it is best to keep an eye on your textures. The amount of GPU memory required depends on resolution and bit depth. Doubling the image resolution quadruples the memory usage per texture. For 32 bit textures, the memory usage is quadrupled. If the GPU runs out of memory, KeyShot Studio will revert to CPU rendering."

## 6. Additional KeyShot Issues

### Denoiser Differences Between Real-Time and Render

**Issue**: "When Denoise is enabled, what you see in the Real-time View and the result of the rendering may have slight variations."
**Fix**: "Normal and diffuse maps are evaluated to produce the best possible result. These are not included in the real-time denoiser, which uses the fastest version of the denoiser." Accept minor differences or disable denoise for exact match.

### Link Materials in Material List

**Issue**: "Link Materials" links to the first selected material instead of right-clicked material.
**Fix**: "Fixed: 'Link Materials' in materials list now links to right-clicked material rather than the first selected." Update to KeyShot 2024.2.

### Cylinder Texture Mapping Depth Parameter

**Issue**: Cylinder texture mapping type lacks depth control.
**Fix**: "Added 'Depth' parameter to Cylinder texture Mapping Type" in KeyShot 2024.2. Update to access this feature.

### New Material Model in 2024.2

**Issue**: Scenes uploaded with KeyShot 2024.2 use a new material model.
**Fix**: "New material model adopted for scenes uploaded with KeyShot Studio 2024.2." Older scenes are automatically converted. Verify material appearance after update.

### Automatic Texture Assignment Script

**Issue**: Need to automatically assign multiple textures to shaders and labels.
**Fix**: "A custom script can assign textures automatically to Shaders and Labels." Download the script from KeyShot support. "Custom Scripts are not supported by KeyShot. Changes performed by scripts cannot be reversed with undo. Save your Scene before running a script."

## Best Practices

1. **Set KeyShot to High Performance in Windows Graphics Settings** — enables GPU mode
2. **Update NVIDIA drivers to 545.84+** — avoids known driver issues
3. **Avoid driver versions 566.14, 566.03, 565.90** — known to cause issues
4. **Use TestFillInLegacyTextureCoordinates for Rhino 8** — fixes UV mapping
5. **Update to Rhino 8.9+ for automatic legacy texture coordinates** — no manual command needed
6. **Update to KeyShot 2024.2 for GPU crash fixes** — Area Light, geometry, anisotropic
7. **Don't disable GPU0 on multi-GPU setups** — causes crash
8. **Install NVLink bridge for combined GPU memory** — enables larger scenes
9. **Reduce texture resolution to fit GPU memory** — 2K instead of 4K/8K
10. **Use 8-bit textures instead of 32-bit** — 4x less GPU memory per texture
