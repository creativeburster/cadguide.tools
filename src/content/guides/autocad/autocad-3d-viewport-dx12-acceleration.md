### 1. Executive Summary & Objective
This graphics optimization directive provides the configuration protocols to resolve viewport lag, display anomalies, and memory leakage associated with the **DirectX 12** rendering engine in AutoCAD 2023 through 2026. It details the step-by-step methods to inspect hardware acceleration using the `3DCONFIG` panel and execute a safe rollback to the stable DirectX 11 interface.

### 2. Rollins to DirectX 11 Viewport Engine
AutoCAD defaults to DirectX 12 rendering, which can lead to GDI leaks on legacy graphics cards or dual-GPU workstations.
1. Launch AutoCAD and type `GFXDX12` in the command prompt.
2. Change the value from `1` to `0` to instruct the graphics manager to bypass DirectX 12.
3. Close AutoCAD.
4. Restart your workstation and relaunch AutoCAD.
5. Type `3DCONFIG` and verify the virtual device shows as DirectX 11 (e.g., `Virtual Device: gdi12.dbx` has successfully reverted to `gdi11.dbx`).

### 3. Graphics Options Fine-Tuning
To optimize display rendering speeds over heavy drawings:
1. Run `3DCONFIG` and verify Hardware Acceleration is turned ON.
2. In the options panel, disable **HQGEOM** (High Quality Geometry) by toggling its parameter. This disables anti-aliasing and reduces the rasterization workload on the GPU.
3. Enable **LINEFADING** to fade out lines when zooming out, which reduces the active vertex count in the graphics pipeline memory buffers.
