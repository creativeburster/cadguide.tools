---
title: "Lumion LiveSync Setup and Troubleshooting: Revit, SketchUp, and ArchiCAD Connection Issues"
excerpt: "Lumion LiveSync drops connection, fails to sync materials, or won't appear in the host application's ribbon. We cover the plugin installation order, version matching, and the log file analysis we use to diagnose sync failures."
category: "troubleshooting"
softwareSlug: "lumion"
keyword: "Lumion LiveSync not working Revit SketchUp connection fix"
slug: "lumion-livesync-connection-revit-sketchup-fix"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-06-23"
sources:
  - "https://support.lumion.com/hc/en-us/articles/360008179854-Why-are-your-Lumion-materials-missing-after-re-importing-your-model"
  - "https://support.lumion.com/knowledge-base/api/v2/help_center/en-us/articles/360007787973.json"
  - "https://support.lumion.com/knowledge-base/api/v2/help_center/en-us/articles/360007745233.json"
---

# Lumion LiveSync Setup and Troubleshooting: Revit, SketchUp, and ArchiCAD Connection Issues

LiveSync is one of Lumion's best features — you change something in Revit or SketchUp, and it appears in Lumion in real-time. But when it stops working, it's incredibly frustrating. We've supported multiple firms through LiveSync setup issues, and the problems almost always come down to version mismatches, installation order, or plugin conflicts.

## Problem 1: LiveSync Plugin Not Showing in Revit Ribbon

The most common issue we encounter: the architect installs the Lumion LiveSync plugin, but it doesn't appear in Revit's ribbon tab.

**Fix — check installation order**:
1. **Install Revit first**, then install Lumion, then install the LiveSync plugin. If Lumion was installed before Revit, the plugin registration doesn't happen correctly.
2. If the order was wrong: uninstall the LiveSync plugin, then reinstall it after confirming Revit is installed.
3. In Revit, go to **Add-Ins tab → Manage Add-Ins** and check if Lumion LiveSync is listed. If it's listed but not loaded, there's a conflict with another add-in.
4. Disable all other add-ins temporarily and restart Revit. If the Lumion tab appears, re-enable add-ins one at a time to find the conflict.

**Common conflicts we've seen**:
- **Enscape** and Lumion LiveSync running simultaneously — both hook into Revit's rendering pipeline. We recommend using only one at a time.
- **Older versions of Navisworks Timeliner** — can block add-in loading.
- **Custom company add-ins** that load at startup — these can interfere with LiveSync's initialization.

## Problem 2: LiveSync Connection Drops Repeatedly

The LiveSync connection establishes but drops after a few minutes or when making changes to the model.

**Fix — check firewall and network**:
1. LiveSync uses local network ports for communication between Revit/SketchUp and Lumion. Add **Lumion.exe** and the **LiveSync plugin** to your Windows Firewall exclusion list.
2. If you're on a corporate network with strict firewall rules, ask IT to allow local loopback communication for Lumion.
3. Disable any VPN software temporarily — VPNs can interfere with local inter-process communication.

**Fix — check Lumion version consistency**:
1. Ensure all team members are using the **same version of Lumion** and the **same version of the LiveSync plugin**.
2. A mismatch between Lumion 2024 and the LiveSync plugin for Lumion 2023 will cause connection drops.
3. Check the Lumion log file: `C:\Users\[username]\AppData\Local\Lumion\Lumion 202x\Logs\` — look for connection error messages.

## Problem 3: Materials Not Syncing Through LiveSync

The model geometry syncs through LiveSync, but materials appear as default gray in Lumion.

**Fix for Revit**:
1. Set the Revit 3D view's **Visual Style to Realistic** before starting LiveSync. If the view is set to Wireframe or Hidden Line, materials don't sync.
2. Ensure materials are actually applied to elements, not just to categories. In Revit, **Object Styles** assignments don't always transfer through LiveSync — apply materials directly to elements or families.
3. Check that material textures have valid file paths. Materials with missing texture files show as gray in Lumion.

**Fix for SketchUp**:
1. Ensure materials are applied to faces, not just to groups/components. LiveSync syncs face-level materials, not group-level overrides.
2. Check that texture image files are accessible — if SketchUp shows a material as "missing texture," Lumion will also show it as missing.

## Problem 4: Section Box Causes Materials to Disappear

A specific issue documented in Lumion's knowledge base: when using a Section Box in Revit with LiveSync active, materials can disappear from the synced model in Lumion.

**Fix**: This is a known issue with the Revit Section Box and LiveSync interaction. Autodesk has a troubleshooting article for this:
1. Turn off the Section Box before starting LiveSync
2. Start LiveSync and let the model sync
3. Turn the Section Box back on after the initial sync is complete
4. If materials still disappear, try adjusting the Section Box boundaries slightly — sometimes the issue is triggered by specific clipping planes

## Problem 5: LiveSync Extremely Slow or Laggy

LiveSync is syncing, but every change in Revit causes a 30-second freeze in both applications.

**Fix — reduce sync complexity**:
1. **Hide unnecessary elements** in the Revit 3D view before starting LiveSync. Only sync what you need to see in Lumion.
2. **Use a simplified 3D view**: Create a dedicated 3D view for LiveSync with minimal visible categories. We create a view called "3D-Lumion" that only shows walls, floors, roofs, doors, windows, and furniture — no electrical, plumbing, or structural details.
3. **Reduce Surface Smoothing** in the LiveSync settings — lower values produce fewer polygons and faster sync times.
4. **Disable Geometry Optimization** if sync is slow — it adds processing time during export.

## Problem 6: LiveSync Not Available for ArchiCAD

ArchiCAD users sometimes find that the LiveSync plugin doesn't appear or doesn't connect.

**Fix**:
1. Ensure you're using **ArchiCAD 22 or later** — older versions aren't supported.
2. Install the LiveSync plugin from Lumion's website, not from ArchiCAD's add-on manager.
3. In ArchiCAD, go to **Options → Add-On Manager** and verify the Lumion LiveSync add-on is listed and loaded.
4. If the add-on is listed but not loading, check ArchiCAD's error log in `C:\Users\[username]\AppData\Local\Graphisoft\ArchiCAD [version]\Logs\`

## Problem 7: Revit LT Limitations

Revit LT has limited API access, which affects LiveSync functionality.

**Known limitations with Revit LT**:
- Textures are not transferred correctly from Revit LT to Lumion due to Autodesk API limitations in the exported DWG file
- Different materials may be combined for certain building elements
- LiveSync may be slower with Revit LT due to limited API performance

**Workaround**: If you're using Revit LT, assign a unique color to each material in Revit before exporting. This way, even if textures don't transfer, you can identify materials in Lumion by their color and reassign textures manually.

## Best Practices for LiveSync Workflow

1. **Create a dedicated 3D view**: Name it "3D-Lumion" with only necessary categories visible. This keeps sync fast and clean.
2. **Set Visual Style to Realistic**: Materials only sync when the Revit view is in Realistic mode.
3. **Name materials consistently**: Material names are the link between Revit and Lumion. Never rename materials mid-project.
4. **Use LiveSync for iteration, export for finals**: LiveSync is great for real-time preview. For final renders, export the model manually with maximum quality settings.
5. **Close other heavy add-ins**: Disable Enscape, Navisworks, or other GPU-intensive add-ins while using LiveSync to avoid resource conflicts.
6. **Keep versions aligned**: All team members must use the same Lumion version and the same LiveSync plugin version.

## Summary

LiveSync issues are most commonly caused by installation order problems, version mismatches, or Revit view settings. Our fix order: verify installation order (Revit → Lumion → LiveSync plugin) → check for add-in conflicts → set Revit view to Realistic → add firewall exclusions → create a dedicated simplified 3D view for syncing. When LiveSync works, it's transformative for the design workflow — when it doesn't, these steps will get it back on track.
