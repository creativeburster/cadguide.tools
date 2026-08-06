---
title: "PV Elite 2026 Saddle Error Check Warning from Out-of-Order Placement"
excerpt: "PV Elite 2026 Saddle Error Check Warning from Out-of-Order Placement: symptoms, root causes, and step-by-step fixes, verified against Hexagon help."
category: "troubleshooting"
softwareSlug: "pv-elite"
keyword: "PV Elite 2026 saddle error check warning out-of-order placement nozzle UG-45 calculation manway access opening external pressure thickness EN 13445 lobes out of bounds MAWP small ASME vessel UG-37 error check only before analysis preventing execution"
slug: "pv-elite-2026-saddle-error-check-warning-from-out-of-order-placement"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://docs.hexagonali.com/r/en-US/PV-Elite-Help/26/1406163?contentId=vByagUcP2TDZfqvjPpGJ3A"
  - "https://docs.hexagonali.com/r/en-US/PV-Elite-Help/27/1447265?contentId=GsUJbbxjJqfyGvaohBd35Q"
  - "https://docs.hexagonppm.com/r/en-US/PV-Elite-Help/Version-25/304296?contentId=v_i6%7EHv9hNse6OUdZPoM1Q"
---

# PV Elite 2026 Saddle Error Check Warning from Out-of-Order Placement, Nozzle UG-45 Calculation Error for Manway and Access Openings, External Pressure Thickness Calculation EN 13445 Lobes Out of Bounds, MAWP Small ASME Vessel Only UG-45 Not UG-37, and Error Check Only Before Analysis Preventing Execution: Saddle Reorder, Nozzle Report Fix, Lobe Value Correction, UG-37 Reinforcement Check, and Error Correction

PV Elite produces errors from saddle placement, nozzle calculations, external pressure lobes, MAWP limitations, and error check blocking. This guide covers the 5 most common PV Elite problems with diagnostic steps and community-verified fixes from Hexagon help.

## 1. Saddle Error Check Warning from Out-of-Order Placement

### Symptom

A saddle error check warning appears when saddles are not placed in order from left to right in the model. The warning prevents or complicates the analysis. The issue occurs when saddle positions are defined out of sequence.

### Root Cause

"Added a saddle error check warning when saddles are not placed in order from left to right in the model." PV Elite expects saddles to be placed sequentially from left to right. When saddles are placed out of order, the saddle calculation algorithm can't properly determine the support reactions and bending moments, triggering the error check warning.

### Fix

1. **Reorder saddles left to right**:
   - Reorder saddles
   - Left to right

2. **Check saddle positions**:
   - Verify saddle positions
   - Are in ascending order
   - From left to right
   - In the model

3. **Use saddle renumbering**:
   - If available
   - Use the saddle
   - Renumbering function
   - To fix order

4. **Delete and re-add saddles**:
   - Delete saddles
   - And re-add them
   - In correct
   - Left-to-right order

5. **Verify saddle dimensions**:
   - After reordering
   - Verify saddle
   - Dimensions and positions
   - Are correct

6. **Run Error Check Only**:
   - Run error check after fix

7. **Check saddle report**:
   - After analysis
   - Check the Saddle
   - Calculations report
   - For correct results

### Community Report

> "Added a saddle error check warning when saddles are not placed in order from left to right in the model. Use the Error Check Only option immediately after any questionable data is entered. Analyze automatically performs an error check before the analysis starts."

## 2. Nozzle UG-45 Calculation Error for Manway and Access Openings

### Symptom

For nozzles specified as Manway or Access Openings, the required thickness calculation in the Nozzle Calculations report doesn't follow ASME Sec VIII Div 1, UG-45 correctly. The nozzle input/analysis status field shows Area passed/failed and UG-45 passed/failed. The report may have incorrect or misleading nozzle calculations.

### Root Cause

"For a nozzle that is specified as a Manway or Access Opening, the software prints the required thickness calculation in the Nozzle Calculations report according to ASME Sec VIII Div 1, UG-45. Added a Nozzle Input/Analysis status field message displaying Area passed/failed and UG-45 passed/failed." The nozzle calculation for Manway and Access Openings has specific UG-45 requirements that differ from standard nozzles. The software may not properly handle these special cases in all versions.

### Fix

1. **Verify nozzle type**:
   - Check nozzle is
   - Correctly specified
   - As Manway or
   - Access Opening

2. **Check UG-45 status**:
   - Check the UG-45
   - Status field
   - For pass/fail

3. **Check Area status**:
   - Check the Area
   - Status field
   - For pass/fail

4. **Review Nozzle Calculations report**:
   - Review the report

5. **Verify against ASME Sec VIII Div 1**:
   - Verify calculations
   - Against ASME
   - Section VIII Div 1
   - UG-45 requirements

6. **Update to latest PV Elite version**:
   - Update for fixes

7. **Check nozzle reinforcement**:
   - Verify nozzle
   - Reinforcement calculations
   - Are correct
   - For manway/access

### Community Report

> "For a nozzle that is specified as a Manway or Access Opening, the software prints the required thickness calculation in the Nozzle Calculations report according to ASME Sec VIII Div 1, UG-45. Added a Nozzle Input/Analysis status field message displaying Area passed/failed and UG-45 passed/failed. Updated the note for openings and made cosmetic changes to warning and error messages for the Nozzle Calculations report."

## 3. External Pressure Thickness Calculation EN 13445 Lobes Out of Bounds

### Symptom

When performing external pressure thickness calculation for EN 13445-3, the number of lobes (deformations), n, can be greater than 20. A warning displays that the n value is out of bounds according to external pressure Figure 8.5-4. The calculation may produce incorrect results with high n values.

### Root Cause

"Corrected the external pressure thickness calculation for EN 13445-3. The number of lobes (deformations), n, can now be greater than 20 and a warning displays that the n value is out of bounds according to external pressure Figure 8.5-4." The EN 13445-3 external pressure calculation allows n values greater than 20, but these values are outside the valid range of Figure 8.5-4. The calculation may produce inaccurate results when n exceeds the figure's range.

### Fix

1. **Check n value against Figure 8.5-4**:
   - Check n value

2. **Keep n value within bounds**:
   - Keep n value
   - Within the valid range
   - Of Figure 8.5-4
   - To avoid warning

3. **Adjust vessel geometry**:
   - Adjust vessel geometry
   - To reduce n value
   - Below the out-of-bounds
   - Threshold

4. **Add stiffening rings**:
   - Add stiffening rings
   - To reduce the
   - Effective length
   - And n value

5. **Update to latest PV Elite version**:
   - Update for
   - Corrected calculation

6. **Verify external pressure results**:
   - After calculation
   - Verify external pressure
   - Results against
   - EN 13445-3 requirements

7. **Use Quick Calculation for testing**:
   - Use Quick Calculation

### Community Report

> "Corrected the external pressure thickness calculation for EN 13445-3. The number of lobes (deformations), n, can now be greater than 20 and a warning displays that the n value is out of bounds according to external pressure Figure 8.5-4. Added a Quick Calculation option to Tubesheet Analysis for testing design changes without running a full analysis."

## 4. MAWP Small ASME Vessel Only UG-45 Not UG-37

### Symptom

The MAWP (Maximum Allowable Working Pressure) of a small ASME vessel is only the function of the UG-45 calculation and not the UG-37 nozzle reinforcement calculation. The MAWP may be higher than expected because UG-37 reinforcement is not considered. The issue affects small ASME vessels with nozzles.

### Root Cause

"The MAWP of a small ASME vessel is only the function of the UG-45 calculation and not UG-37 nozzle reinforcement calculation." For small ASME vessels, PV Elite calculates MAWP based only on UG-45 (nozzle neck thickness) and doesn't include UG-37 (nozzle reinforcement area) in the calculation. This can result in a MAWP that doesn't account for nozzle reinforcement limitations.

### Fix

1. **Check MAWP calculation basis**:
   - Check calculation basis

2. **Manually check UG-37 reinforcement**:
   - Manually verify
   - UG-37 nozzle
   - Reinforcement calculations
   - For the vessel

3. **Use UG-37 for nozzle reinforcement**:
   - Verify UG-37
   - Nozzle reinforcement
   - Is adequate
   - For the MAWP

4. **Compare MAWP with UG-37 limit**:
   - Compare the MAWP
   - With the UG-37
   - Reinforcement limit
   - To ensure safety

5. **Update to latest PV Elite version**:
   - Check for updates
   - That may include
   - UG-37 in MAWP
   - For small vessels

6. **Check nozzle reinforcement report**:
   - Review the nozzle
   - Reinforcement calculations
   - In the report
   - For UG-37 compliance

7. **Contact Hexagon support**:
   - If MAWP calculation
   - Doesn't include UG-37
   - Contact Hexagon support
   - For clarification

### Community Report

> "The MAWP of a small ASME vessel is only the function of the UG-45 calculation and not UG-37 nozzle reinforcement calculation. Added a Nozzle Input/Analysis status field message displaying Area passed/failed and UG-45 passed/failed."

## 5. Error Check Only Before Analysis Preventing Execution

### Symptom

When running analysis, PV Elite performs an error check first. If errors are found, the analysis stops and doesn't proceed. The user must correct all errors before the analysis can run. Some errors may be difficult to identify or fix.

### Root Cause

"Errors must be corrected before the analysis can proceed. Analyze automatically performs an error check before the analysis starts. Comments from an error check can be examined using Review Reports. If any of the input errors prevents the software from running, execution stops here. Check the output to determine the exact error discovered by the program." PV Elite requires all errors to be corrected before analysis. The error check identifies input errors that would prevent valid calculations. The analysis won't proceed until all errors are resolved.

### Fix

1. **Use Error Check Only first**:
   - Run error check first

2. **Review error reports**:
   - Review error
   - Reports

3. **Correct all errors before analysis**:
   - Fix all errors
   - Before running analysis

4. **Check output for exact error**:
   - Check output

5. **Use Error Check Only for validation**:
   - Use Error Check Only
   - To validate input
   - Before running
   - Full analysis

6. **Address warnings**:
   - Address warnings
   - As well as errors

7. **Check input data carefully**:
   - Check input data

### Community Report

> "Errors must be corrected before the analysis can proceed. Analyze automatically performs an error check before the analysis starts. Comments from an error check can be examined using Review Reports. The input program will have already caught most of the errors that are easily made. However, there are some errors that can only be discovered after the analysis begins. If any of the input errors prevents the software from running, execution stops here. Check the output to determine the exact error discovered by the program."

## 6. Additional PV Elite Issues

### Horizontal Vessel Bolt Shear Stress

**Issue**: "Added horizontal vessel bolt shear stress due to thermal friction growth in the Saddle Calculations report."
**Fix**: Update to latest PV Elite version. Check Saddle Calculations report for bolt shear stress. Verify thermal friction growth calculations.

### Fatigue Life Assessment EN 13445

**Issue**: "A detailed assessment of fatigue life is now available for EN 13445, Section 18."
**Fix**: Use the fatigue life assessment for EN 13445 Section 18. Verify fatigue calculations against standard requirements.

### Design Modification Reset

**Issue**: "If any Design Modification (Design Constraints Tab) were set, PV Elite resets the thickness to the necessary value and exports these increased thicknesses to all output reports."
**Fix**: Use Design Modification tab for automatic thickness adjustment. Verify increased thicknesses in output reports. Original model data is not changed.

### Increase Thickness for Internal Pressure

**Issue**: "If you checked the Increase Thickness For Internal Pressure design flag and any element is too thin for the given pressure, the program will automatically increase the thickness."
**Fix**: Enable Increase Thickness design flag. Program automatically increases thickness. Use Utilities for rounding to nominal size.

### External Pressure with Stiffening Rings

**Issue**: "If the element is not thick enough for the external pressure, the program will allow you to increase the thickness and/or add stiffening rings."
**Fix**: Add stiffening rings for external pressure. Increase element thickness if needed. Program recalculates with new geometry.

### PD 5500 External Pressure

**Issue**: "When performing the PD 5500 external pressure calculations, the program first computes the length of section for the given geometry."
**Fix**: Verify length of section for PD 5500. Check Method A and Method B calculations. Verify Pn and Fn values.

### Hydrotest Pressure Calculation

**Issue**: "The program uses this information to calculate the maximum allowed hydrotest pressure and required thickness at the given pressure for each element."
**Fix**: Verify hydrotest type and pressure settings. Check maximum allowed hydrotest pressure. Verify required thickness at hydrotest pressure.

## Best Practices

1. **Place saddles in order from left to right** — prevents saddle error check warning
2. **Use Error Check Only before full analysis** — catches errors early
3. **Review error reports before analysis** — use Review Reports for error comments
4. **Check UG-45 and Area status for nozzles** — verify pass/fail status
5. **Keep EN 13445 n value within Figure 8.5-4 bounds** — prevents out-of-bounds warning
6. **Manually verify UG-37 for small ASME vessel MAWP** — MAWP only uses UG-45
7. **Use Quick Calculation for Tubesheet testing** — test design changes without full analysis
8. **Enable Design Modification for automatic thickness adjustment** — program increases thickness as needed
9. **Add stiffening rings for external pressure** — reduces effective length and n value
10. **Verify hydrotest pressure and required thickness** — check against each element
