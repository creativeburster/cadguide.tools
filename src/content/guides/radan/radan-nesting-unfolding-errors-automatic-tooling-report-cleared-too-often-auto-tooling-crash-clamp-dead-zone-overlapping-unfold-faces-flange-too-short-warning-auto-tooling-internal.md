---
title: "RADAN Nesting and Unfolding Errors: Automatic Tooling Report Cleared Too Often from Multi-Part Nesting Clearing Bug Requiring Update to 2024.1, Auto Tooling Crash from Cut Features in Clamp Dead Zone Requiring Dead Zone Clearance, Overlapping Unfold Faces from 3D Model Unfold Collision Requiring Graphic Feedback and Geometry Fix, Flange Too Short Warning from Designer Validation Requiring Flange Length Check, and Auto Tooling Selecting Internal Profile as Start Profile from Common Cut Bug Requiring Profile Order Verification"
excerpt: "RADAN fails for 5 distinct reasons: automatic tooling report cleared too often from multi-part nesting clearing bug requiring update to 2024.1, auto tooling crash from cut features in clamp dead zone requiring dead zone clearance, overlapping unfold faces from 3D model unfold collision requiring graphic feedback and geometry fix, flange too short warning from Designer validation requiring flange length check, and auto tooling selecting internal profile as start profile from common cut bug requiring profile order verification. We cover each with fixes from RADAN Release Notes and Hexagon Product History."
category: "nesting-and-unfolding-errors"
softwareSlug: "radan"
keyword: "RADAN automatic tooling report cleared too often multi-part nesting clearing bug auto tooling crash cut features clamp dead zone dead zone clearance overlapping unfold faces 3D model unfold collision graphic feedback geometry fix flange too short warning Designer validation flange length check auto tooling selecting internal profile start profile common cut bug profile order verification"
slug: "radan-nesting-unfolding-errors-automatic-tooling-report-cleared-too-often-auto-tooling-crash-clamp-dead-zone-overlapping-unfold-faces-flange-too-short-warning-auto-tooling-internal"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-03"
sources:
  - "https://sncsolutions.com.au/whats-new-in-radan-2024-1/"
  - "https://hexagon.com/products/product-groups/computer-aided-manufacturing-cad-cam-software/radan/release-history"
  - "https://www.stillam.com/radan-2025-1/"
---

# RADAN Nesting and Unfolding Errors: Automatic Tooling Report Cleared Too Often from Multi-Part Nesting Clearing Bug Requiring Update to 2024.1, Auto Tooling Crash from Cut Features in Clamp Dead Zone Requiring Dead Zone Clearance, Overlapping Unfold Faces from 3D Model Unfold Collision Requiring Graphic Feedback and Geometry Fix, Flange Too Short Warning from Designer Validation Requiring Flange Length Check, and Auto Tooling Selecting Internal Profile as Start Profile from Common Cut Bug Requiring Profile Order Verification

RADAN's automatic tooling, nesting reports, unfold validation, flange checking, and common cut tooling produce errors from report clearing bugs, clamp zone conflicts, unfold collisions, short flange validation, and profile selection issues. This guide covers the 5 most common RADAN problems with diagnostic steps and community-verified fixes from RADAN Release Notes and Hexagon Product History.

## 1. Automatic Tooling Report Cleared Too Often from Multi-Part Nesting Clearing Bug

### Symptom

When running Multi-Part Nesting or Finish Project Nesting, the automatic tooling report is cleared too often. After each nest is tooled, the report is cleared, making it difficult to determine which nest contains an error. The error list doesn't accumulate — it resets between nests, losing track of which nest had tooling errors.

### Root Cause

"Previously, the automatic tooling reports are cleared too often making it difficult to determine which nest contains an error." The automatic tooling report clearing logic was too aggressive. The report was cleared before each nest's tooling operation, not just before the first nest. This meant that errors from nest 1 were lost when nest 2 was tooled. The user couldn't review all errors at once — only the last nest's errors were visible. This made troubleshooting multi-nest projects very difficult.

### Fix

1. **Update to RADAN 2024.1**:
   - "The automatic tooling report is now only cleared prior to auto tooling the first nest when running the Multi-Part Nesting or Finish Project Nesting"
   - "This makes it clearer which errors occur on which nest"
   - Update to RADAN 2024.1 or later
   - This is the primary fix

2. **Tool nests individually**:
   - Until the update is installed
   - Tool each nest individually
   - Record errors after each nest
   - This preserves the error list per nest

3. **Use the Workflow Status page**:
   - "This behaviour can now be controlled in the Machine Configuration Editor on the Workflow Status page"
   - Configure how tooling errors and warnings are handled
   - Set whether failed corner fillets stop automation
   - Control whether short un-tooled features are permissible

4. **Document errors manually**:
   - After each nest is tooled
   - Screenshot or note the errors
   - Before proceeding to the next nest
   - This preserves the error information

5. **Check error list after each nest**:
   - Don't wait until all nests are done
   - Check the error list immediately after each nest
   - Record the errors
   - Then proceed to the next nest

### Community Report

> "Previously, the automatic tooling reports are cleared too often making it difficult to determine which nest contains an error. The automatic tooling report is now only cleared prior to auto tooling the first nest when running the Multi-Part Nesting or Finish Project Nesting. This makes it clearer which errors occur on which nest. To improve automation, the user can now be more specific about how to handle automatic tooling errors and warnings."

## 2. Auto Tooling Crash from Cut Features in Clamp Dead Zone

### Symptom

Auto Order crashes when there are cut features in the clamp dead zone. The crash occurs during the automatic ordering of tool paths. The clamp dead zone is the area on the sheet where clamps hold the material — cutting features in this area can cause collisions with the clamps.

### Root Cause

"A condition where the presence of cut features in the clamp dead zone could cause Auto Order to crash has been identified and resolved." The Auto Order function tries to optimize the tool path order. When it encounters cut features in the clamp dead zone, it attempts to calculate a path that avoids the clamps. The calculation encounters an edge case where the cut feature geometry conflicts with the clamp zone geometry, causing a null reference or infinite loop, leading to the crash.

### Fix

1. **Update to RADAN 2021.0 or later**:
   - "A condition where the presence of cut features in the clamp dead zone could cause Auto Order to crash has been identified and resolved"
   - The fix is included in RADAN 2021.0
   - Update to the latest version
   - This is the primary fix

2. **Move cut features out of clamp dead zone**:
   - Until the update is installed
   - Check for cut features in the clamp dead zone
   - Move them outside the dead zone
   - Or remove them temporarily

3. **Adjust clamp positions**:
   - Move clamps away from cut features
   - Adjust the clamp dead zone definition
   - Ensure no overlap between cut features and clamps
   - This prevents the crash

4. **Manually order tool paths**:
   - Instead of using Auto Order
   - Manually order the tool paths
   - This bypasses the Auto Order crash
   - But requires more time

5. **Use the tooling error handling**:
   - "In many cases, a failed corner fillet is not a cause to stop automation"
   - "In some cases, leaving a very short feature un-tooled is equally permissible"
   - Configure the Workflow Status page
   - Allow automation to continue despite warnings

6. **Check for clamp dead zone conflicts**:
   - Before running Auto Order
   - Visually check for cut features in the clamp zone
   - Use RADAN's visualization tools
   - Resolve conflicts before ordering

### Community Report

> "A condition where the presence of cut features in the clamp dead zone could cause Auto Order to crash has been identified and resolved. RDFT-10149. In many cases, a failed corner fillet is not a cause to stop automation. In some cases, leaving a very short feature un-tooled is equally permissible, but not always. This behaviour can now be controlled in the Machine Configuration Editor on the Workflow Status page."

## 3. Overlapping Unfold Faces from 3D Model Unfold Collision

### Symptom

When unfolding a 3D sheet metal model, the unfold doesn't work correctly. Faces clash on top of each other — the unfolded flat pattern has overlapping geometry. The user is not notified of the issue, or the notification is unclear. The flat pattern is unusable for nesting or cutting.

### Root Cause

"Sometimes, when a 3D model is unfolded, it doesn't work — faces clash on top of each other. The user is now notified of this and shown the issue graphically." The unfold algorithm calculates the flat pattern by rotating faces around bend lines. If the 3D model has complex geometry or incorrect bend definitions, the unfolded faces can overlap. This happens when: (1) bend angles are incorrect, (2) bend radii don't match the actual geometry, (3) the model has conflicting features, or (4) the unfold calculation method produces overlapping results for complex shapes.

### Fix

1. **Update to RADAN 2024.1 or later**:
   - "Feedback is now provided on overlapping unfolds"
   - "The user is now notified of this and shown the issue graphically"
   - Update to RADAN 2024.1
   - The graphic feedback shows exactly where faces overlap

2. **Check bend definitions**:
   - Verify all bend angles are correct
   - Check bend radii match the actual geometry
   - Use RADAN Designer to correct bend parameters
   - "RADAN Designer now indicates bends where the design radius differs from the expected result radius"

3. **Use V-width unfolding method**:
   - "RADAN Designer now indicates bends where the design radius differs from the expected result radius when using V-width as the unfolding method"
   - Switch to V-width unfolding
   - This uses the actual die V-width for calculation
   - More accurate for production tooling

4. **Check for conflicting features**:
   - Look for features that conflict with bends
   - Remove or adjust conflicting features
   - Simplify the model before unfolding
   - Add complex features after unfolding

5. **Use Unfold Preparation tools**:
   - "Several powerful sheet metal functions are available to prepare a part for unfolding"
   - "RADAN Designer has functionality to correct the thickness, change bend radii and make changes to flange angles and lengths"
   - Use these tools to fix the model before unfolding

6. **Check material library**:
   - Verify the material is correctly defined
   - Check bend allowance calculations
   - Use the correct material for the unfolding method
   - "Unfolding parameters, such as bend allowances, can be controlled independently of the geometry"

7. **Use setback or k-factor method**:
   - Try different unfolding methods
   - "Available are unfolding using a setback at 90 degrees, a k-factor, DIN correction, or using only the V-width"
   - Different methods may produce different results
   - Choose the method that matches your production process

### Community Report

> "Feedback is now provided on overlapping unfolds. Sometimes, when a 3D model is unfolded, it doesn't work — faces clash on top of each other. The user is now notified of this and shown the issue graphically. RADAN Designer now indicates bends where the design radius differs from the expected result radius when using V-width as the unfolding method. This is important for the unfolding process, and the finished look of the component."

## 4. Flange Too Short Warning from Designer Validation

### Symptom

RADAN Designer warns that flanges are too short to be produced. The warning appears during unfold or validation. Parts with errors need to be singled out for inspection. The user needs to identify which flanges are too short and fix them before production.

### Root Cause

"DESIGNER now automatically warns users about flanges that are too short to be produced — any parts with errors can easily be singled out for inspection, significantly reducing the time spent by the user." The flange length validation checks whether each flange is long enough to be formed by the available tooling. Flanges that are shorter than the minimum formable length can't be produced — the tooling can't grip and bend such short flanges. The validation uses the tooling database to determine minimum flange lengths based on V-width, die, and punch specifications.

### Fix

1. **Update to RADAN 2024.1**:
   - "DESIGNER now automatically warns users about flanges that are too short to be produced"
   - "Any parts with errors can easily be singled out for inspection"
   - Update to RADAN 2024.1
   - The validation is automatic

2. **Check flange lengths**:
   - Review all flanges in the model
   - Compare with minimum formable length
   - Minimum length depends on V-width and material thickness
   - Typically: flange length >= 4x material thickness + bend radius

3. **Increase flange length**:
   - If a flange is too short, increase its length
   - Modify the 3D model in RADAN Designer
   - Use the flange editing tools
   - Ensure the new length meets minimum requirements

4. **Use different tooling**:
   - If the flange can't be made longer
   - Check if different tooling can form shorter flanges
   - Use a smaller V-width die
   - Update the tooling database

5. **Use Unfold Preparation**:
   - "RADAN Designer has functionality to correct the thickness, change bend radii and make changes to flange angles and lengths"
   - Use Unfold Preparation to adjust flanges
   - Correct flange lengths before unfolding
   - This prevents production issues

6. **Inspect flagged parts**:
   - "Any parts with errors can easily be singled out for inspection"
   - Use the validation report to identify problem parts
   - Inspect each flagged part
   - Fix or exclude from production

7. **Check bend radius**:
   - Sometimes the bend radius is too large for the flange
   - Reduce the bend radius
   - This may allow a shorter flange
   - But check if the smaller radius is formable

### Community Report

> "DESIGNER now automatically warns users about flanges that are too short to be produced — any parts with errors can easily be singled out for inspection, significantly reducing the time spent by the user. RADAN Designer has functionality to correct the thickness, change bend radii and make changes to flange angles and lengths. Unfolding parameters, such as bend allowances, can be controlled independently of the geometry, enabling an accurate development based on actual bending machines and tooling."

## 5. Auto Tooling Selecting Internal Profile as Start Profile from Common Cut Bug

### Symptom

When adding common cut profile tooling to a group of profiles, auto tooling sometimes selects an internal profile as the start profile. The tooling starts from the wrong profile, causing incorrect cut paths. The common cut sequence is wrong — internal profiles should be cut after external profiles to maintain material stability.

### Root Cause

"When adding common cut profile tooling to a group of profiles, auto tooling sometimes selected an internal profile as the start profile. This bug has now been fixed." The auto tooling algorithm for common cut profiles doesn't always correctly identify the external (outer) profile as the start profile. It sometimes picks an internal profile (a hole or cutout) as the starting point. This is incorrect for common cutting — the outer profile should be cut first to establish the common cut line, then internal features are cut. Starting from an internal profile can cause the material to shift, affecting cut quality.

### Fix

1. **Update to RADAN 2021.0 or later**:
   - "When adding common cut profile tooling to a group of profiles, auto tooling sometimes selected an internal profile as the start profile. This bug has now been fixed. RDFT-9354"
   - Update to RADAN 2021.0 or later
   - This is the primary fix

2. **Manually select start profile**:
   - Until the update is installed
   - Don't use auto tooling for common cut profiles
   - Manually select the external profile as the start
   - Then add internal profiles in order

3. **Check profile order after auto tooling**:
   - After running auto tooling
   - Verify the start profile is the external one
   - If an internal profile was selected, reorder manually
   - Don't proceed with incorrect ordering

4. **Use individual profile tooling**:
   - Instead of common cut profile tooling
   - Tool profiles individually
   - This avoids the auto-selection bug
   - But loses the common cut efficiency

5. **Group profiles correctly**:
   - When creating profile groups
   - Ensure the external profile is the first in the group
   - This may help auto tooling select it correctly
   - Order profiles from outside to inside

6. **Verify with simulation**:
   - After tooling, run a simulation
   - Check if the cut order is correct
   - External profiles should be cut first
   - Internal features after

7. **Use tooling hints in RADAN 2025.1**:
   - "Smarter Tooling Hints: click on any item in the error list, and RADAN will instantly zoom in"
   - Update to RADAN 2025.1
   - Use the tooling hints to identify and fix tooling errors
   - The zoom feature helps locate problem profiles

### Community Report

> "When adding common cut profile tooling to a group of profiles, auto tooling sometimes selected an internal profile as the start profile. This bug has now been fixed. RDFT-9354. In RADAN 2025.1, smarter tooling hints: dealing with tooling errors just got easier — simply click on any item in the error list, and RADAN will instantly zoom in, showing you the exact location of the problem."

## 6. Additional RADAN Issues

### Auto Tooling Crash for Punch Machines

**Issue**: "A problem where auto tooling sometimes crashed for punch machines."
**Fix**: Update to RADAN 2021.0 (RDFT-10163). Check punch tooling configuration. Verify tool assignments. Use manual tooling as workaround.

### Sheet Size Units Incorrect from Remnant

**Issue**: "The sheet size units of a new nest created from a remnant sheet drawing were set incorrectly."
**Fix**: Update to RADAN 2021.0 (RDFT-10169). Check units in remnant drawing. Verify nest units settings. Use correct unit template.

### Manual Window Nesting on Remnant Issues

**Issue**: "A problem when manually window nesting on a sheet remnant."
**Fix**: Update to RADAN 2021.0 (RDFT-10174). Use automatic nesting instead. Check remnant definition. Verify remnant boundaries.

### Common Cutting Hazardous Scrap Tagging

**Issue**: "When using common cutting, it is difficult to automatically tag potentially hazardous pieces of scrap."
**Fix**: Update to RADAN 2024.1. Use the hazardous scrap tagging feature. Configure scrap tagging rules. Check common cutting nesting results.

### Structure Tree Confusion from Unfold Features

**Issue**: "The features and workspaces created when a sheet metal part is unfolded can cause confusion in the Structure Tree."
**Fix**: Update to RADAN 2023.3. "Folded and unfolded states are handled better in the structure tree, hiding features irrelevant to the requested state."

### Remnant Import from Multiple Formats

**Issue**: "Importing remnants from various file formats."
**Fix**: Update to RADAN 2025.1. "You can now import remnants from DRG, SYM, DXF, and DWG files." Use the import remnant feature. Check file format compatibility.

## Best Practices

1. **Update to RADAN 2024.1 or 2025.1** — fixes tooling report clearing, unfold feedback, and flange validation
2. **Use the Workflow Status page for error handling** — control how tooling errors and warnings are handled
3. **Check for cut features in clamp dead zone before Auto Order** — prevents crash
4. **Use RADAN Designer to correct bend parameters before unfolding** — prevents overlapping faces
5. **Verify flange lengths meet minimum formable requirements** — prevents production issues
6. **Use V-width unfolding method for production accuracy** — matches actual bending tooling
7. **Manually verify start profile for common cut tooling** — prevents incorrect cut order
8. **Use tooling hints in RADAN 2025.1** — click error list items to zoom to problem location
9. **Check unfold results graphically** — verify no overlapping faces in flat pattern
10. **Use Unfold Preparation tools for complex parts** — correct thickness, radii, and flange lengths before unfolding
