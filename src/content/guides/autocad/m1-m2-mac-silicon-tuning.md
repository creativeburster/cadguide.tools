### 1. macOS Deployment: Tuning for Apple Silicon (M1/M2/M3)
Autodesk offers a native version of AutoCAD for Mac, redesigned to run natively on Apple Silicon. To optimize performance on Apple Silicon workstations:
- **VRAM Allocation**: In Apple Silicon's unified memory architecture, system RAM is shared with the GPU. For large building blueprints, a minimum of 16GB unified memory is recommended to prevent system swapping.
- **Shortcut Key Translation**: The Mac version maps standard Windows control binds to CMD (e.g., `Cmd+C` instead of `Ctrl+C`). If you prefer the classic layout, navigate to *Preferences > User Preferences > Keyboard* and check "Use Windows Shortcut Keys".

### 2. Graphics Caching on macOS
To improve viewport redraw frames on Retina displays, adjust the system graphics cache limits in the Command console:
```text
Command: CACHEMAXFILES -> Set to 256 (prevents disk thrashing during zooms)
Command: CACHEMAXTOTALSIZE -> Set to 1024 (allocates up to 1GB storage for redraw cache)
```
Ensure Hardware Acceleration is toggled to ON in the status bar toggle options.
