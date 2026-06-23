### 1. Linux Workstations: Running AutoCAD via Wine Emulator
Autodesk does not publish a native Linux build of AutoCAD. However, Linux sysadmins can run AutoCAD (specifically stable legacy versions like 2020) utilizing Wine/Proton compatibility layers:
- **Prerequisites**: Install Wine-Staging and configure a clean 64-bit Wine prefix:
  ```bash
  export WINEPREFIX=~/.autocad64
  winecfg
  ```
- **Winetricks Dependencies**: AutoCAD requires specific Windows libraries to load the interface and handle database blocks:
  ```bash
  winetricks dotnet48 gdiplus msxml6 vcrun2017 corefonts
  ```
- **Graphics Override**: Force Wine to bind to Vulkan or OpenGL via the registry to eliminate viewport redraw stutters.

### 2. Desktop Environment Integration
Ensure your window manager does not capture the standard Alt+Drag key combos, which are heavily utilized by AutoCAD for 3D orbital navigation. Map these key overrides in your DE window management setup.
