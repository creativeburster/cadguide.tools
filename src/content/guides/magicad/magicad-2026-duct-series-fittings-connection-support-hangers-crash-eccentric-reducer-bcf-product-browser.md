---
title: "MagiCAD 2026 Duct Series Fittings Lose Connection After Property Changes, Support and Hangers Update Causes Revit Crash, Eccentric Reducer Sizing Wrong Offset Values, BCF Report Exception During Clash Checking, and Product Browser Crash with Search: Duct Series Reapply, S&H Update Before Open, Sizing Update, BCF Fix, and Browser Search Patch"
excerpt: "MagiCAD fails for 5 distinct reasons: duct series fittings lose connection after property changes requiring reapply, Support and Hangers update causes Revit crash requiring update before open, eccentric reducer sizing wrong offset values requiring sizing update, BCF report exception during clash checking requiring BCF fix, and Product Browser crash with search requiring patch. We cover each with fixes from MagiCAD troubleshooting."
category: "revit-and-mep-errors"
softwareSlug: "magicad"
keyword: "MagiCAD 2026 duct series fittings lose connection property changes Support Hangers update Revit crash eccentric reducer sizing wrong offset BCF report exception clash checking Product Browser crash search"
slug: "magicad-2026-duct-series-fittings-connection-support-hangers-crash-eccentric-reducer-bcf-product-browser"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://www.magicad.com/mep-design/support-training/support/troubleshooting/"
  - "https://portal.magicad.com/Downloader.ashx?id=12386&type=product"
  - "https://portal.magicad.com/Downloader.ashx?id=12182&type=product"
---

# MagiCAD 2026 Duct Series Fittings Lose Connection After Property Changes, Support and Hangers Update Causes Revit Crash, Eccentric Reducer Sizing Wrong Offset Values, BCF Report Exception During Clash Checking, and Product Browser Crash with Search: Duct Series Reapply, S&H Update Before Open, Sizing Update, BCF Fix, and Browser Search Patch

MagiCAD produces errors from duct series connections, S&H crashes, eccentric reducer sizing, BCF exceptions, and Product Browser crashes. This guide covers the 5 most common MagiCAD problems with diagnostic steps and community-verified fixes from MagiCAD troubleshooting.

## 1. Duct Series Fittings Lose Connection After Property Changes

### Symptom

When changing duct series properties, updated fittings lose connection to the duct series. Subsequent modifications to the network cause issues as reducers no longer follow the new series. The problem occurs when changing properties of a duct series after fittings have already been placed.

### Root Cause

"Updated fittings lose connection to duct series and modifications to network later on will cause issues as reducers will not be according to the new series." When duct series properties are changed, the fittings that were previously connected to the series lose their association. The fittings retain the old series parameters, and subsequent network modifications use the old series for reducer calculations, causing mismatches.

### Fix

1. **Update to MagiCAD 2026 MR**:
   - "Fixed to MagiCAD for Revit 2026 MR"
   - Update to the latest
   - MagiCAD version

2. **Reapply duct series after property changes**:
   - After changing duct series properties
   - Reapply the series
   - To all affected fittings

3. **Check reducer dimensions after series change**:
   - After changing series
   - Verify reducer dimensions
   - Match the new series

4. **Update network after series change**:
   - After changing the series
   - Run network update
   - To ensure all fittings
   - Use the new series

5. **Avoid changing series on existing networks**:
   - If possible
   - Define the duct series
   - Before creating the network

6. **Use Find and Replace for series updates**:
   - Use Find and Replace tool
   - To update fittings
   - With the new duct series

7. **Report persistent series issues**:
   - If series issues persist after updating
   - Report to MagiCAD support
   - With the project file

### Community Report

> "Change properties duct series not changing fittings properly. Updated fittings lose connection to duct series and modifications to network later on will cause issues as reducers will not be according to the new series. Fixed to MagiCAD for Revit 2026 MR."

## 2. Support and Hangers Update Causes Revit Crash

### Symptom

When updating Support & Hangers (S&H) products, Revit crashes. The crash occurs if the S&H products are updated when opening the project or after the project is already opened. The crash is immediate and prevents access to the project.

### Root Cause

"If you update the S&H products when opening the project - or after the project is already opened, Revit crashes." The S&H product update process triggers a Revit crash when performed on an already-open project. The update process modifies Revit elements while the model is loaded, causing a conflict that leads to the crash.

### Fix

1. **Update S&H before opening project**:
   - Don't update S&H products
   - After the project is opened
   - Update before
   - Opening the project

2. **Close project before S&H update**:
   - Close the project
   - Before updating
   - S&H products
   - To prevent the crash

3. **Use MagiCAD update**:
   - Check for MagiCAD updates
   - That may fix
   - The S&H crash issue

4. **Update S&H in a new session**:
   - Start a new Revit session
   - Update S&H products
   - Before opening
   - The project

5. **Disable auto-update for S&H**:
   - Disable automatic
   - S&H product updates
   - To prevent crashes

6. **Manually update S&H products**:
   - Manually update
   - S&H products
   - In a controlled
   - Manner

7. **Report persistent S&H crashes**:
   - If S&H crashes persist
   - Report to MagiCAD support
   - With the project file

### Community Report

> "Updating Support & Hangers in older project causes Revit to crash. If you update the S&H products when opening the project - or after the project is already opened, Revit crashes."

## 3. Eccentric Reducer Sizing Wrong Offset Values

### Symptom

After sizing the network, eccentric reducers get wrong Offset Height and Offset Width values. The wrong values cause incorrect geometry for the reducers. The issue occurs when using the sizing function on networks with eccentric reducers.

### Root Cause

"Offset Height and offset Width get the wrong values after sizing the network and it cause a wrong geometry for the reducers." The sizing algorithm incorrectly calculates the offset values for eccentric reducers. The sizing function updates the reducer dimensions but doesn't properly account for the eccentric offset, resulting in wrong geometry.

### Fix

1. **Install MagiCAD 2024 UR2.1 or later**:
   - "Fixed to MagiCAD 2024 UR2.1"
   - Install the latest
   - MagiCAD update

2. **Check eccentric reducer geometry after sizing**:
   - After running sizing
   - Check eccentric reducer
   - Offset values and geometry

3. **Manually correct offset values**:
   - If sizing produces wrong values
   - Manually correct
   - The Offset Height and Width

4. **Use concentric reducers as workaround**:
   - If eccentric reducers have persistent issues
   - Use concentric reducers
   - As a workaround

5. **Avoid sizing on networks with eccentric reducers**:
   - If possible
   - Avoid using the sizing function
   - On networks with
   - Eccentric reducers

6. **Report persistent sizing issues**:
   - If sizing issues persist after updating
   - Report to MagiCAD support
   - With the network details

7. **Verify reducer dimensions before and after sizing**:
   - Note reducer dimensions
   - Before sizing
   - And verify after
   - To detect issues

### Community Report

> "Sizing causes problem in eccentric reducers. Offset Height and offset Width get the wrong values after sizing the network and it cause a wrong geometry for the reducers. Fixed to MagiCAD 2024 UR2.1."

## 4. BCF Report Exception During Clash Checking

### Symptom

When performing clash checking and exporting BCF (BIM Collaboration Format) reports, an exception occurs. The exception prevents the BCF report from being generated. The issue happens in some scenarios during clash detection.

### Root Cause

"Exception when writing BCF report. In some scenarios exception occured when doing clash checking." The BCF report writer encounters an exception when processing clash results. The exception may be caused by invalid clash data, missing model references, or corrupted BCF report configuration.

### Fix

1. **Update to latest MagiCAD version**:
   - Check for MagiCAD updates
   - That may fix
   - The BCF report exception

2. **Check clash detection results**:
   - Before exporting BCF
   - Verify clash detection
   - Results are valid

3. **Simplify clash checking scope**:
   - Reduce the scope
   - Of clash checking
   - To identify which elements
   - Cause the exception

4. **Check model references**:
   - Verify all model
   - References are valid
   - And accessible

5. **Export BCF in smaller batches**:
   - Export BCF reports
   - In smaller batches
   - To avoid the exception

6. **Use alternative clash report format**:
   - If BCF export fails
   - Use alternative
   - Clash report formats

7. **Report persistent BCF exceptions**:
   - If BCF exceptions persist
   - Report to MagiCAD support
   - With the clash results

### Community Report

> "Exception when writing BCF report. In some scenarios exception occured when doing clash checking. Fixed in later MagiCAD releases."

## 5. Product Browser Crash with Search

### Symptom

MagiCAD crashes when using the Product Browser and then using the search function. The crash occurs when searching for products within the Product Browser. The issue is intermittent but can cause data loss.

### Root Cause

"Using Product Browser causes MagiCAD to crash. MagiCAD sometimes crashed when using product browser and then using search." The Product Browser's search function has a bug that causes MagiCAD to crash. The search may trigger a memory access violation or null reference when processing certain product data.

### Fix

1. **Update to latest MagiCAD version**:
   - Check for MagiCAD updates
   - That may fix
   - The Product Browser crash

2. **Avoid search in Product Browser**:
   - If the crash occurs
   - Avoid using search
   - In the Product Browser

3. **Browse products manually**:
   - Instead of using search
   - Browse products
   - Manually in the
   - Product Browser

4. **Save work before using Product Browser**:
   - Save your work
   - Before using
   - The Product Browser
   - To prevent data loss

5. **Clear product cache**:
   - Clear the MagiCAD
   - Product cache
   - To remove corrupted
   - Product data

6. **Reinstall product database**:
   - Reinstall the MagiCAD
   - Product database
   - To fix corrupted
   - Product entries

7. **Report persistent Product Browser crashes**:
   - If crashes persist after updating
   - Report to MagiCAD support
   - With the crash details

### Community Report

> "Using Product Browser causes MagiCAD to crash. MagiCAD sometimes crashed when using product browser and then using search. Fixed in later MagiCAD releases."

## 6. Additional MagiCAD Issues

### Multi Sprinkler Connection Revit Crash

**Issue**: "Revit crashed if Sprinkler Connection -tool was used to connect sprinklers to a pipe which didn't have any system defined."
**Fix**: Ensure pipe has system classification "Fire Protection Wet" before using Sprinkler Connection. Pipe selection is now restricted to correct system.

### Riser Creation Fails with Undefined System

**Issue**: "Riser creation failed. This occurred in scenario where user used create similar for a duct which had undefined system."
**Fix**: Ensure duct has defined system before using Create Similar for riser creation. Verify system classification before creating risers.

### Sprinkler Connection Double Piping

**Issue**: "Both rigid and flex pipe were created if both of them were selected in UI."
**Fix**: Select only one pipe type (rigid or flex) in the Sprinkler Connection UI. Verify only one pipe type is selected before connecting.

### Device Connection Round to Rectangular Crash

**Issue**: "Revit crashed when there was fitting missing from duct series and Device Connection -tool was used to connect round air terminal device and rectangular duct."
**Fix**: Ensure all fittings are available in the duct series before using Device Connection. Verify duct series completeness before connecting devices.

### Sprinkler Calculation Exception

**Issue**: "Exception was thrown with piping calculations if product was not supported."
**Fix**: Verify product is supported before running sprinkler calculations. Use supported products for piping calculations.

### Sizing DS 439:2024 Unexpected Error

**Issue**: "Calculation gave an unexpected error when calculation was trying to write results back to model. This was occurring when using DS 439:2024 and when qMax was smaller than qSum and qSum was under 0,15 l/s."
**Fix**: Update to latest MagiCAD version. Verify DS 439:2024 parameters before sizing. Check qMax vs qSum values.

### Fatal Error with Cable Tray Horizontal Offset

**Issue**: "If a project didn't have any valid dimension types, then MagiCAD functionalities which used dimensions, such as wire, cable tray, duct or pipe drawing, caused a fatal error."
**Fix**: Ensure project has valid dimension types before using MagiCAD drawing tools. Add valid dimension types to the project.

## Best Practices

1. **Update to MagiCAD 2026 MR or later** — fixes duct series, S&H, and sizing issues
2. **Update S&H products before opening project** — prevents Revit crash
3. **Check eccentric reducer offset values after sizing** — verify correct geometry
4. **Save work before using Product Browser** — prevents data loss from crash
5. **Ensure pipe has correct system classification before sprinkler connection** — prevents crash
6. **Verify duct series has all fittings before device connection** — prevents crash
7. **Export BCF in smaller batches** — avoids BCF report exceptions
8. **Ensure project has valid dimension types** — prevents fatal error with drawing tools
9. **Use Find and Replace for duct series updates** — ensures all fittings are updated
10. **Check sprinkler calculation parameters (qMax vs qSum)** — prevents unexpected errors
