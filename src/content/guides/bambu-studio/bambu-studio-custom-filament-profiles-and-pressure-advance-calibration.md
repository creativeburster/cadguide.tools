---
title: "Bambu Studio Custom Filament Profiles and Pressure Advance Calibration Errors"
excerpt: "Bambu Studio Custom Filament Profiles and Pressure Advance Calibration Errors: symptoms, root causes, and step-by-step fixes, verified against Bambu Lab Community Forum and GitHub Issues."
category: "printing"
softwareSlug: "bambu-studio"
keyword: "Bambu Studio custom filament profiles disappearing second X1C AMS sync conflict firmware update Pressure Advance Default 0.20 calibration data not syncing Manage Result PA values messed up custom name power cycle automatic PA calibration A1 P2S incorrect K values extruder motor Flow Dynamics Calibration overrides filament profile Device Tab"
slug: "bambu-studio-custom-filament-profiles-and-pressure-advance-calibration"
author: "CADGuide Tools Editorial Team"
readTime: "13 min"
date: "2025-07-31"
sources:
  - "https://forum.bambulab.com/t/added-second-x1c-and-all-profiles-pa-start-crashing/83651"
  - "https://forum.bambulab.com/t/factor-k-pressure-advance-slicers-and-g-code/154298"
  - "https://github.com/bambulab/BambuStudio/issues/8196"
---

# Bambu Studio Custom Filament Profiles and Pressure Advance Calibration Errors: Custom Profiles Disappearing After Adding Second Printer from AMS Sync Conflict, Pressure Advance Always Default 0.20 from Calibration Data Not Syncing Without Manage Result Trigger, PA Values All Messed Up After One Calibration from Custom Name Not Surviving Power Cycle, Automatic PA Calibration Produces Incorrect K Values on A1 vs P2S from Different Extruder Motor Types, and Flow Dynamics Calibration Overrides All Filament Profile and Device Tab K Values

Bambu Studio's custom filament profiles and Pressure Advance calibration suffer from sync conflicts, calibration data loss, and K value inconsistencies across printer models. This guide covers the 5 most common Bambu Studio calibration problems with diagnostic steps and community-verified fixes from Bambu Lab Community Forum and GitHub Issues.

## 1. Custom Profiles Disappearing After Adding Second Printer

### Symptom

After purchasing a second X1C printer, all previously fixed custom filament profile issues return:
- Custom profiles not showing in AMS device tab
- Custom profile calibration profiles are gone from Bambu Studio (still visible on management page but not selectable from software, only from AMS)
- Firmware updates brick AMS on both X1C printers
- Cannot set any custom profile despite clean restore on both units

### Root Cause

Bambu Studio stores calibration information in the printer/AMS (or Bambu cloud) rather than in local user profiles. When a second printer is added, the sync mechanism conflicts between the two printers' calibration databases. Firmware updates can corrupt the AMS calibration storage, making custom profiles inaccessible. The lock on firmware prevents downgrading to fix the issue.

### Fix

1. **Use OrcaSlicer as an alternative**:
   - OrcaSlicer's filament preset editor can enable pressure advance and store a K value
   - Bambu Studio's editor cannot do this directly
   - Both slicers can coexist on the same machine

2. **Delete configuration folder and set up from scratch**:
   - This sometimes fixes the automatic PA value selection
   - Access via Help menu > Configuration Folder
   - Warning: this removes all presets and settings

3. **Disable preset Auto Sync**:
   - If preferences allow preset Auto Sync through Bambu cloud
   - Both slicers use the same User presets
   - Disabling Auto Sync prevents cross-printer conflicts
   - But also prevents cloud-based preset sharing

4. **Back up local profiles**:
   - Regularly back up the configuration folder
   - Restore from backup when profiles disappear

5. **Do NOT downgrade firmware**:
   - Some users report being able to downgrade via Handy app
   - But this may not work for all firmware versions
   - Wait for Bambu to fix the issue in a future update

6. **Contact Bambu support for bricked AMS**:
   - If firmware update bricks the AMS
   - Contact Bambu support for replacement or fix
   - This is a hardware-level issue that software workarounds can't solve

### Community Report

> "After purchasing second X1C, all issues are back! Custom profiles not showing in AMS device tab. Custom profile's calibration profiles are gone. Unfortunately seems that latest FW update bricked both AMS on both X1C."

## 2. Pressure Advance Always Shows Default 0.20

### Symptom

Pressure Advance setting in Bambu Studio is always on "Default" (0.20) even though calibration has been performed. The manual calibration values for corresponding filaments in AMS should be selected automatically, but they're not. The K values only appear after manually navigating to Calibration > Manage Result.

### Root Cause

Bambu Studio's synchronization of calibration data from the printer to the software is broken. The calibration data exists on the printer but is not automatically loaded into Bambu Studio's Device tab. The sync only triggers when the user opens "Calibration > Manage Result," which forces a data refresh. This is a known bug that was partially fixed but recurred.

### Fix

1. **Open Calibration > Manage Result to trigger sync**:
   - This forces Bambu Studio to sync calibration data from the printer
   - Must be done every time Bambu Studio is opened

2. **Delete configuration folder and reinstall**:
   - This is a nuclear option but has worked for some users
   - Back up any important presets first

3. **Check if Flow Dynamics Calibration is enabled**:
   - If "Flow Dynamics Calibration" is enabled in print settings
   - The printer ignores both filament profile K values and Device Tab K values
   - The printer calibrates flow rate during printing preparation
   - Disable Flow Dynamics Calibration to use stored K values

4. **Ensure printers are in online mode**:
   - Printers in local mode may not sync properly
   - Online mode enables instant sync

5. **Wait for the fix**:
   - The fix was released but some users report it regressed

6. **Use OrcaSlicer to force PA from filament settings**:
   - OrcaSlicer allows enabling pressure advance in filament properties
   - The K value in the filament profile overrides the printer's stored value
   - This bypasses the sync issue entirely

### Community Report

> "Pressure advance setting is always on 'Default.' I can open BS, immediately go to device and manage result and then the device tab shows the pressure advance, but until I do that, every single time I open BS, it doesn't show the PA."

## 3. PA Values All Messed Up After One Calibration from Custom Name

### Symptom

After calibrating Pressure Advance (K) for Bambu's translucent PETG, all other filament K values become incorrect. PLA K values change from their calibrated values. Print quality degrades. K values don't persist after printer power cycle.

### Root Cause

Custom calibration profiles with custom names (not the original filament name) don't survive power cycles. "The custom automatic flow calibration presets with custom names cannot be saved when powered off." Only calibrations saved with the original name (e.g., "Bambu PLA Basic") persist after power cycling. After power on, the profile is still there but not selected — the user must manually re-select it for each filament in each AMS.

### Fix

1. **Save calibration with the original filament name**:
   - Use the exact original name when saving calibration results

2. **Manually re-select profiles after power on**:
   - The profile is still there, just not selected
   - Use the touch screen or Bambu Studio to re-select
   - This is tedious but works

3. **Use Bambu Handy app**:
   - Recent versions may have removed this capability
   - Check if the current Handy app version supports profile selection

4. **Keep printer powered on**:
   - If the printer stays powered on, calibration profiles persist
   - Sleep mode may also preserve profiles
   - Full power off is what causes the loss

5. **Use OrcaSlicer for persistent K values**:
   - OrcaSlicer stores K values in the filament profile
   - These are local files that don't depend on printer memory
   - This completely bypasses the printer's calibration storage

6. **Workaround: manual K value in g-code**:
   - Add `; pressure_advance = 0.035` in the filament's custom g-code
   - The printer uses this value instead of the stored calibration
   - This is a manual workaround but reliable

### Community Report

> "I calibrated K for Bambu PLA but it won't store value after printer has been turned off. If I store a calibration with the original name, it will be there after a power cycle. But if I call it anything else, it will not."

## 4. Automatic PA Calibration Produces Incorrect K Values on A1 vs P2S

### Symptom

A1 printer calculates K=0.059 during automatic PA calibration for standard PLA. This seems too high. Manual calibration on the same A1 produces K=0.035-0.040. The same filament on a P2S produces K=0.032 via automatic calibration. The A1's automatic calibration consistently overestimates K values.

### Root Cause

The A1 and P2S have different extruder motor designs. The A1 uses a different extruder motor type than the P2S's servo-based extruder. The automatic calibration algorithm (using eddy current sensor) measures extrusion response differently on each motor type. The A1's extruder response may not be accurately captured by the automatic calibration, leading to overestimated K values.

### Fix

1. **Use manual calibration instead of automatic**:
   - Manual calibration is more accurate for the A1
   - Print a manual PA calibration pattern
   - Visually inspect the results and choose the best K value

2. **Don't compare K values directly between printers**:
   - Each printer has its own optimal K value
   - The same filament may need different K values on different printers

3. **Understand what affects K value**:
   - The extruder motor type also affects how the automatic calibration interprets results
   - Manual calibration accounts for all factors visually

4. **Use default K values as a starting point**:
   - Default K=0.02 is a reasonable starting point
   - Fine-tune with manual calibration if needed

5. **Match calibration to print settings**:
   - Manual calibration uses the same motion parameters as actual printing
   - Automatic calibration only measures extrusion output via eddy current sensor
   - This may not capture all motion-related factors

6. **Consider filament moisture**:
   - Wet filament produces inconsistent extrusion
   - This can cause the automatic calibration to produce incorrect K values
   - Dry filament before calibrating
   - Store filament with desiccant

### Community Report

> "My A1 calculates K=0.059 during automatic calibration, which seems too high. Manual calibration gives 0.035-0.04. The P2S gives 0.032 for the same filament. The A1's auto calibration doesn't work properly for many users."

## 5. Flow Dynamics Calibration Overrides All K Values

### Symptom

Understanding how K values interact with Flow Dynamics Calibration is confusing. The user sets a K value in the filament profile and on the Device Tab, but the printed result doesn't match. Enabling Flow Dynamics Calibration seems to ignore all stored K values.

### Root Cause

Flow Dynamics Calibration, when enabled, forces the printer to ignore:
1. K values from the filament profile (g-code)
2. K values stored in the printer (Device Tab)

The printer performs its own flow rate calibration during the printing preparation stage and uses that calibrated K value for the entire print. This overrides all user-set K values.

### How K Values Work in Bambu Studio

1. **Flow Dynamics Calibration OFF**:
   - Printer uses K value stored in the printer (Device Tab selection)
   - G-code contains `; enable_pressure_advance = 0` and `; pressure_advance = 0.02`
   - The default g-code PA is disabled — printer uses its stored K value

2. **Flow Dynamics Calibration ON**:
   - Printer ignores all stored K values
   - Printer calibrates flow rate during printing preparation
   - Uses the calibrated K value for the print

3. **Pressure Advance enabled in filament properties (OrcaSlicer)**:
   - G-code contains `; enable_pressure_advance = 1` and `; pressure_advance = <value>`
   - The printer uses the g-code K value instead of stored values
   - This overrides the Device Tab selection

### Fix

1. **Understand which K value takes priority**:
   - Flow Dynamics Calibration > Filament Profile (g-code) > Device Tab (stored)
   - If Flow Dynamics is ON, it wins
   - If Flow Dynamics is OFF and g-code has PA enabled, g-code wins
   - If Flow Dynamics is OFF and g-code has PA disabled, Device Tab wins

2. **Disable Flow Dynamics Calibration for consistent K values**:
   - If you want to use a specific K value
   - Disable Flow Dynamics Calibration in print settings
   - Set the K value on the Device Tab or in filament profile
   - The printer will use that value consistently

3. **Enable Flow Dynamics Calibration for automatic calibration**:
   - If you want the printer to calibrate automatically for each print
   - Enable Flow Dynamics Calibration
   - The printer will determine the optimal K value
   - This is best for new or unknown filaments

4. **Use OrcaSlicer for filament-level K value control**:
   - Enable pressure advance in OrcaSlicer's filament properties
   - Set the K value in the filament profile
   - This value is written to g-code and used by the printer
   - Overrides Device Tab but not Flow Dynamics Calibration

5. **Selecting filament on Device Tab still matters**:
   - Also used for safety prompts (min/max nozzle temperature)
   - Required for AMS operation
   - Not just for K value selection

### Community Report

> "Factor K is being stored in the printer. Changing Factor K on Device tab doesn't affect g-code. Enabling Flow Dynamics Calibration forces printer to ignore both filament profile and stored K values. The printer will calibrate the flow rate in the printing preparation stage."

## 6. Additional Bambu Studio Issues

### Custom Profiles Not Showing in AMS

**Issue**: Custom filament profiles don't appear in the AMS device tab in Bambu Studio.
**Fix**: Check if the AMS firmware is up to date. Try removing and re-adding the custom profile. If the issue persists, use OrcaSlicer which handles custom profiles differently.

### Firmware Lock Preventing Downgrade

**Issue**: Bambu has locked firmware, preventing downgrade to versions that worked.
**Fix**: "Bambu has put a lock on firmware, you cannot downgrade." Some users report being able to downgrade via the Handy app. Wait for a fixed firmware release.

### OrcaSlicer Crashes More Often

**Issue**: OrcaSlicer crashes more frequently than Bambu Studio.
**Fix**: "A workaround is using Orca, but the latest version crashes on me more often than Bambu Studio." Use the stable version of OrcaSlicer, not the nightly builds. Report crashes to the OrcaSlicer GitHub.

### Bambu Studio and OrcaSlicer Coexistence

**Issue**: Can both slicers be installed simultaneously?
**Fix**: "Both can coexist on the same machine. Both use the same BambuSource.dll. OrcaSlicer's 3MF files are functionally neutral — you may get complaints of values that are ignored, but these are not relevant."

## Best Practices

1. **Save calibration with original filament name** — survives power cycle
2. **Open Calibration > Manage Result to trigger PA sync** — workaround for sync bug
3. **Use manual calibration on A1** — automatic calibration overestimates K values
4. **Disable Flow Dynamics Calibration for consistent K values** — prevents override
5. **Enable Flow Dynamics Calibration for new filaments** — automatic optimization
6. **Back up configuration folder regularly** — prevents profile loss
7. **Keep printers in online mode** — enables instant calibration sync
8. **Use OrcaSlicer for filament-level PA control** — stores K in filament profile
9. **Don't compare K values between A1 and P2S** — different extruder motors
10. **Dry filament before calibrating** — wet filament causes incorrect K values
