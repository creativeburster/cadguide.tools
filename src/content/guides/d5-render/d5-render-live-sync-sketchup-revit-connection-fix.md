---
title: "D5 Render Live Sync: SketchUp, Revit, and 3ds Max Connection Issues and Workflow"
excerpt: "D5 Render's Live Sync fails to connect, stops updating, or imports models with missing materials. I cover the plugin installation for each CAD application, the sync connection troubleshooting, and the material and geometry transfer workflow."
category: "troubleshooting"
softwareSlug: "d5-render"
keyword: "D5 Render Live Sync SketchUp Revit connection fix"
slug: "d5-render-live-sync-sketchup-revit-connection-fix"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://www.d5render.com/posts/d5-render-nvidia-dlss-3-real-time-interactive-3d-rendering"
  - "https://docs.d5render.com/user-guide/hardware/how-to-view-and-optimize-graphics-card-usage"
---

# D5 Render Live Sync: SketchUp, Revit, and 3ds Max Connection Issues and Workflow

I set up D5 Render Live Sync for architecture firms that use SketchUp, Revit, and 3ds Max. Live Sync is D5's real-time connection feature — you modify the model in the CAD application and it updates in D5 Render automatically. When it works, it's transformative for the design iteration workflow. When it fails, which happens regularly, the connection drops silently and updates stop flowing.

## D5 Live Sync Supported Applications

D5 Render supports Live Sync with:
- **SketchUp** (via D5 Converter for SketchUp)
- **Revit** (via D5 Converter for Revit)
- **3ds Max** (via D5 Converter for 3ds Max)
- **ArchiCAD** (via D5 Converter for ArchiCAD)
- **Rhino** (via D5 Converter for Rhino)
- **Blender** (via D5 Converter for Blender)
- **C4D** (via D5 Converter for C4D)

Each application requires its own D5 Converter plugin, installed separately from D5 Render.

## Setup: D5 Converter for SketchUp

1. Download the **D5 Converter for SketchUp** from the D5 Render website
2. Ensure SketchUp is closed
3. Run the converter installer
4. Open SketchUp — a **D5 Render** menu or toolbar should appear
5. Open D5 Render
6. In SketchUp, click **D5 Render → Live Sync** (or the sync icon)
7. D5 Render should connect and load the SketchUp model

**Common issue — toolbar not appearing**:
1. Go to **Extensions → Extension Manager**
2. Check if "D5 Converter" is listed and enabled
3. If not listed, the installation failed — reinstall with SketchUp closed
4. If listed but disabled, enable it and restart SketchUp

**Common issue — version incompatibility**:
1. Check that your SketchUp version is supported by the D5 Converter version
2. D5 Converter typically supports SketchUp 2020-2024
3. For SketchUp 2025, check the D5 website for an updated converter

## Setup: D5 Converter for Revit

1. Download the **D5 Converter for Revit** from the D5 Render website
2. Ensure Revit is closed
3. Run the converter installer
4. Open Revit — a **D5 Render** tab should appear in the ribbon
5. Open D5 Render
6. In Revit, click the **D5 Render tab → Live Sync**
7. D5 Render should connect and load the Revit model

**Common issue — Revit addin not loading**:
1. Check `C:\ProgramData\Autodesk\Revit\Addins\20XX\` for the D5 Converter files
2. The folder should contain the D5 Converter addin file and folder
3. If missing, reinstall the converter
4. If present but not loading, check the Revit journal file for error messages

**Common issue — materials not transferring from Revit**:
1. Ensure the Revit 3D view's **Visual Style** is set to **Realistic**
2. Check that materials are assigned to elements, not just to categories
3. Some Revit materials (especially custom materials with procedural textures) may not transfer correctly — assign them manually in D5 Render

## Setup: D5 Converter for 3ds Max

1. Download the **D5 Converter for 3ds Max** from the D5 Render website
2. Ensure 3ds Max is closed
3. Run the converter installer
4. Open 3ds Max — a **D5 Render** menu or toolbar should appear
5. Open D5 Render
6. In 3ds Max, click **D5 Render → Live Sync**
7. D5 Render should connect and load the 3ds Max model

**Common issue — V-Ray materials not transferring**:
1. The D5 Converter for 3ds Max supports V-Ray materials, but some complex V-Ray material features (SSS, complex blends) may not transfer
2. Convert complex materials to standard materials before syncing, or apply D5 Render materials after import
3. Check that the converter version supports your V-Ray version

## Live Sync Connection Troubleshooting

### Issue: Live Sync Won't Connect

**Fix 1 — Check application order**:
1. Open D5 Render first
2. Then open the CAD application (SketchUp, Revit, 3ds Max)
3. Click Live Sync in the CAD application
4. If you opened the CAD application first, close it, open D5, then reopen the CAD application

**Fix 2 — Check firewall**:
1. D5 Live Sync uses local network communication
2. Windows Firewall may block the connection
3. Add D5 Render and the CAD application to the firewall exception list
4. Go to **Windows Settings → Privacy & Security → Windows Security → Firewall & network protection → Allow an app through firewall**
5. Find D5 Render and the CAD application — check both Private and Public networks

**Fix 3 — Run as administrator**:
1. Right-click both D5 Render and the CAD application
2. Select **Run as administrator**
3. Live Sync may need elevated permissions to establish the local connection

### Issue: Live Sync Stops Updating

The connection was working but updates no longer appear in D5 Render.

**Fix 1 — Re-establish connection**:
1. In the CAD application, click the **Live Sync** button again (toggle off, then on)
2. If that doesn't work, click **Stop Sync**, then **Start Sync**
3. In D5 Render, check if the connection indicator shows "Connected"

**Fix 2 — Check for model errors**:
1. If the CAD model has errors (corrupted geometry, missing references), the sync may fail silently
2. In SketchUp: use **Window → Model Info → Statistics → Check for problems**
3. In Revit: use **Manage → Purge Unused** and audit the model
4. In 3ds Max: check for missing XRefs and bitmap paths

**Fix 3 — Restart both applications**:
1. Close both D5 Render and the CAD application
2. Check Task Manager for any lingering processes
3. Open D5 Render first, then the CAD application
4. Re-establish the Live Sync connection

### Issue: Model Appears at Wrong Scale

**Fix**:
1. Check the CAD application's units:
   - SketchUp: Window → Model Info → Units
   - Revit: Manage → Project Units
   - 3ds Max: Customize → Units Setup
2. D5 Render expects meters by default
3. If your model is in inches or millimeters, the D5 Converter should handle the conversion
4. If the scale is wrong, check the converter's settings for unit conversion options
5. As a workaround, scale the model in D5 Render after import

### Issue: Geometry Missing After Sync

**Fix**:
1. Check if the missing geometry is on a hidden layer in the CAD application
2. In SketchUp: check Tags/Layers visibility
3. In Revit: check Worksets and View Filters
4. In 3ds Max: check Layer visibility and Hide by Category
5. The D5 Converter only syncs visible geometry — hidden elements are not transferred
6. Unhide the required elements and re-sync

### Issue: Materials Show as Default Gray

**Fix**:
1. For SketchUp: ensure materials are applied to faces, not just groups
2. For Revit: ensure the visual style is Realistic and materials are assigned
3. For 3ds Max: ensure materials are applied to objects, not just to modifiers
4. After sync, apply D5 Render's PBR materials for better quality than the transferred CAD materials
5. D5's material system is more advanced than CAD application materials — use transferred materials as a guide for where to apply D5 materials

## Best Practices for Live Sync Workflow

1. **Open D5 Render first**: Always launch D5 before the CAD application
2. **Create a dedicated 3D view**: In Revit, create a "3D-D5" view with only the necessary elements visible
3. **Simplify before sync**: Hide unnecessary geometry, turn off unnecessary layers — only sync what you need
4. **Use D5 materials for final quality**: CAD-transferred materials are placeholders — apply D5's PBR materials for production quality
5. **Save before syncing**: Always save the CAD model before starting Live Sync — if the sync causes a crash, you won't lose work
6. **Update periodically, not continuously**: For large models, disable auto-sync and update manually when you reach a milestone — continuous syncing of large models can slow down both applications
7. **Keep both applications on the same machine**: Live Sync uses local communication — it doesn't work across network drives or remote desktops

## Summary

D5 Render Live Sync issues are most often caused by plugin installation problems, firewall blocking, or model errors. My fix order: verify the D5 Converter plugin is installed and enabled → open D5 Render before the CAD application → check firewall exceptions → run as administrator → re-establish connection by toggling sync → check for model errors in the CAD application → restart both applications. For material issues, always apply D5's PBR materials after sync rather than relying on CAD-transferred materials.
