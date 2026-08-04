---
title: "DipTrace Gerber Export and Autorouter"
excerpt: "DipTrace Gerber Export and Autorouter: symptoms, root causes, and step-by-step fixes, verified against DipTrace forums."
category: "troubleshooting"
softwareSlug: "diptrace"
keyword: "DipTrace Gerber export TrueType font Vector autorouter not executing 8.89mm trace width 4-layer plane net unrouted copper pour panelized errant trace custom mask paste renew schematic"
slug: "diptrace-gerber-export-and-autorouter"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://diptrace.com/forum/viewtopic.php?t=12649"
  - "https://diptrace.com/forum/viewtopic.php?t=13908"
  - "https://diptrace.com/forum/viewtopic.php?t=15606"
---

# DipTrace Gerber Export and Autorouter: TrueType Font Gerber Export Failure, Autorouter Not Executing from Default 8.89mm Trace Width, 4-Layer Plane Net Autorouter Leaving Power/Ground Unrouted, Panelized PCB Errant Cross-Board Trace Bug, and Custom Mask/Paste Settings Not Renewing from Schematic

DipTrace is a popular PCB design tool, but Gerber export failures, autorouter malfunctions, and panelization bugs block manufacturing output. TrueType fonts prevent Gerber export, default trace widths are too wide for the autorouter, 4-layer plane nets require specific copper pour workflows, and panelized boards produce errant traces. This guide covers the 5 most common Gerber and autorouter problems with diagnostic steps and community-verified fixes from DipTrace forums.

## 1. TrueType Font Gerber Export Failure

### Symptom

Cannot export to Gerber — choosing Export → Gerber → Export All highlights the Top Silk layer but doesn't prompt for a filename. The export silently fails.

### Root Cause

TrueType font text on the board causes the Gerber export to fail. The Gerber exporter cannot process TrueType font geometry. This is reproducible in DipTrace 2.4 but fixed in version 3.3+.

### Fix

1. **Change all text to Vector font**:
   - Select all text: Edit → Edit Selection → Text
   - Right-click on any selected text → choose **Font Type → Vector** from submenu
   - May need to adjust position of some text after changing font
   - Gerber export should now work

2. **Update to DipTrace 3.3 or later** — the TrueType font Gerber export issue is fixed in newer versions

3. **Check for TrueType text in all layers** — silk, copper, and assembly layers may all contain TrueType text

4. **Verify export after font change** — export all layers and verify each Gerber file is created

## 2. Autorouter Not Executing: Default 8.89mm Trace Width

### Symptom

The autorouter appears to think about routing paths but never produces a result. All ratlines remain after pressing the autoroute button. No traces are generated.

### Root Cause

The default Net Class trace width is **8.89mm** — this is far too wide for most PCB designs. The autorouter cannot find any path that accommodates an 8.89mm trace, so it gives up without routing anything.

### Fix

1. **Check and reduce Net Class trace width**:
   - Open the board in PCB Layout
   - Route → Net Classes from main menu
   - Check the trace width of the default class
   - If it's 8.89mm (the default), change it to **0.2mm** or appropriate value
   - The autorouter should now route most traces

2. **Verify clearance settings** — ensure clearance is appropriate (0.33mm or less for dense boards)

3. **Check for installation issues** — if adjusting trace width doesn't fix the problem:
   - The DipTrace installation may be corrupted
   - Uninstall DipTrace completely
   - Reinstall from a fresh download
   - The Shape Autorouter should work after a clean install

4. **Windows 11 compatibility** — some users report autorouter not working on Windows 11:
   - Add `router.dll` and `RouteLayer.dll` to antivirus exception list (McAfee, Windows Defender)
   - The antivirus may be blocking the autorouter DLLs
   - Reinstall after adding exceptions

5. **Check antivirus exclusions** — antivirus software can block the autorouter engine:
   - Add DipTrace installation folder to antivirus exclusions
   - Specifically exclude `router.dll` and `RouteLayer.dll`

## 3. 4-Layer Plane Net Autorouter: Power/Ground Left Unrouted

### Symptom

A 4-layer PCB with Top (Signal), Inner 1 (Plane = +5V), Inner 2 (Plane = GND), Bottom (Signal). The autorouter only routes signal ratlines — all +5V and GND ratlines are left unrouted.

### Root Cause

Plane layer connections are not routed by the autorouter — they're established by **copper pours** on the plane layers. If copper pours are not defined or are outdated, the plane nets appear unrouted.

### Fix

1. **Create copper pours on plane layers**:
   - Inner 1: Create copper pour assigned to +5V net
   - Inner 2: Create copper pour assigned to GND net
   - The copper pour automatically connects all pads on that net to the plane

2. **Redo copper pours after any changes**:
   - After modifying the layout, copper pours must be regenerated
   - **Not redoing copper pours is the #1 cause of net connectivity errors**
   - Run copper pour update before checking net connectivity

3. **Run "Update Layout from Schematic" (By RefDes)** after changes:
   - This clears up net assignment issues
   - Must be done before re-running copper pours and autorouter

4. **Check net connectivity after copper pour**:
   - Run net connectivity check
   - If "merged nets" errors appear, copper pours were not redone after changes
   - Redo copper pours → Update from Schematic → Re-check

5. **Use Plane layer type** (not Signal) for power/ground layers:
   - Set Inner 1 and Inner 2 layer type to "Plane"
   - Assign the appropriate net to each plane layer
   - The autorouter skips plane nets — they're handled by copper pours

### Workflow for 4-Layer Boards

1. Set up 4 layers: Top (Signal), Inner 1 (Plane/+5V), Inner 2 (Plane/GND), Bottom (Signal)
2. Route signal traces with autorouter or manually
3. Create copper pours on Inner 1 (+5V) and Inner 2 (GND)
4. Update Layout from Schematic (By RefDes)
5. Redo copper pours
6. Run net connectivity check
7. If errors: redo copper pours again → recheck

## 4. Panelized PCB: Errant Cross-Board Trace Bug

### Symptom

A simple 2-layer board has correct Gerber output. When panelized, the top layer Gerber contains an **errant trace** running from a connector pin on one board to a different connector pin on a **neighboring board** in the panel. This pattern repeats across every board in the panel.

### Root Cause

This is a **confirmed DipTrace bug** in panelization. The panelization feature incorrectly creates connections between adjacent boards in the panel. The original single-board Gerber is correct — the error only appears in the panelized version.

### Fix

1. **Update DipTrace** — the bug has been fixed in source code and will be included in future versions:
   - "We have already fixed the bug in our source codes. The fix will be included in the next version"
   - Check if the latest version includes this fix

2. **Manually verify panelized Gerber** — before sending to manufacturing:
   - Open each Gerber layer in a viewer (Gerbv, KiCad GerberViewer)
   - Check for traces between neighboring boards
   - Manually delete errant traces if found

3. **Use single-board Gerber and panelize externally** — as a workaround:
   - Export single-board Gerber files
   - Use a separate panelization tool (e.g., GerbMerge, Panelizer)
   - This avoids the DipTrace panelization bug

4. **Report to DipTrace support** with files — they confirm and investigate:
   - Send the .dip file and panelized Gerber to support
   - Include screenshots of the errant traces

5. **Run DRC on the panel** — Design Rule Check may identify the unexpected connections

## 5. Custom Mask/Paste Settings Not Renewing from Schematic

### Symptom

Custom solder mask/paste settings defined in the component footprint don't appear in the PCB after renewing the board from schematic. The Gerber export uses default mask settings instead of the custom ones.

### Root Cause

**PCB Layout mask/paste settings have higher priority than library settings**. When renewing board from schematic, DipTrace does NOT override existing mask/paste settings in the PCB Layout. This is by design — if someone modified mask/paste settings in PCB Layout, renewing from schematic would lose those modifications.

However, this means if a footprint in the library has custom mask/paste settings, and the component already exists in the PCB with default settings, the renewal won't update the mask/paste settings.

### Fix

1. **Delete components before renewing**:
   - Delete the components that should have custom mask/paste settings from the PCB
   - Then renew board from schematic
   - The components will be re-created with the library's custom mask/paste settings

2. **Manually update mask/paste in PCB Layout**:
   - Select the component in PCB Layout
   - Modify the mask/paste settings manually
   - These settings will persist through future renewals

3. **Understand the priority system**:
   - PCB Layout settings > Library settings (for existing components)
   - Library settings apply only when components are first placed or after deletion + renewal
   - Gerber export uses PCB Layout settings, not library settings

4. **Use custom shrink/swell in Settings** — the Settings area controls Gerber output for Solder Mask Swell for all components:
   - Custom mask/paste settings in individual components have higher priority than Settings
   - But only if the components have the custom settings in PCB Layout

5. **Uncheck "pads" under Objects in Gerber Export** — if custom mask shapes are drawn manually:
   - Uncheck "pads" to prevent default pad mask generation
   - **Warning**: This ignores ALL pads, not just the custom ones
   - Use with caution

## Best Practices

1. **Use Vector font for all board text** — TrueType prevents Gerber export
2. **Check default Net Class trace width** — 8.89mm default is too wide for autorouter
3. **Set trace width to 0.2mm** in Net Classes before running autorouter
4. **Redo copper pours after any layout change** — #1 cause of net connectivity errors
5. **Use Plane layer type for power/ground** — autorouter skips plane nets
6. **Update Layout from Schematic before copper pours** — clears net assignments
7. **Verify panelized Gerber in external viewer** — DipTrace panelization has a cross-board trace bug
8. **Panelize externally** if the bug persists — use GerbMerge or similar tool
9. **Delete components before renewing** to get custom mask/paste from library
10. **Add router.dll to antivirus exclusions** — especially on Windows 11
