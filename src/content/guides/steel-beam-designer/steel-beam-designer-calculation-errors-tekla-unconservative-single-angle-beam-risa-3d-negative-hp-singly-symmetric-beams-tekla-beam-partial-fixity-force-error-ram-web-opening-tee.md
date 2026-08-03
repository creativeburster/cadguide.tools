---
title: "Steel Beam Designer Calculation Errors: Tekla Structural Designer Unconservative Single Angle Beam Error to AISC 360 Requiring Bulletin PBTSD-2504-3 Patch, RISA-3D Negative hp for Singly-Symmetric Beams from PNA in Compression Flange Requiring Manual Verification, Tekla Structural Designer Beam Partial Fixity Force Error Requiring Bulletin PBTSD-2408-1 Patch, RAM Structural System Web Opening Tee Buckling Display Error Requiring Design Report Verification, and STAAD.Pro CHS Shear Area Underestimation from AS 4100 Formula Error Requiring Update"
excerpt: "Steel beam design software fails for 5 distinct reasons: Tekla Structural Designer unconservative single angle beam error to AISC 360 requiring bulletin PBTSD-2504-3 patch, RISA-3D negative hp for singly-symmetric beams from PNA in compression flange requiring manual verification, Tekla Structural Designer beam partial fixity force error requiring bulletin PBTSD-2408-1 patch, RAM Structural System web opening tee buckling display error requiring design report verification, and STAAD.Pro CHS shear area underestimation from AS 4100 formula error requiring update. We cover each with fixes from Tekla, RISA, Bentley, and Eng-Tips."
category: "calculation-errors"
softwareSlug: "steel-beam-designer"
keyword: "Tekla Structural Designer unconservative single angle beam AISC 360 bulletin PBTSD-2504-3 RISA-3D negative hp singly-symmetric beams PNA compression flange manual verification Tekla Structural Designer beam partial fixity force error bulletin PBTSD-2408-1 RAM Structural System web opening tee buckling display error design report verification STAAD.Pro CHS shear area underestimation AS 4100 formula error update"
slug: "steel-beam-designer-calculation-errors-tekla-unconservative-single-angle-beam-risa-3d-negative-hp-singly-symmetric-beams-tekla-beam-partial-fixity-force-error-ram-web-opening-tee"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://support.tekla.com/bulletin/tekla-structural-designer-product-bulletin-april-2025-pbtsd-2504-3"
  - "https://www.eng-tips.com/threads/risa-3d-confirmed-error-with-calculation-of-hp-for-singly-symmetric-beams-aisc-360-16-sect-f4.524327/"
  - "https://docs.bentley.com/LiveContent/web/STAAD.Pro-v2025.0.1/ReadMe/en/topics/ReadMe/c-stpst_Revision_History_240002.html"
---

# Steel Beam Designer Calculation Errors: Tekla Structural Designer Unconservative Single Angle Beam Error to AISC 360 Requiring Bulletin PBTSD-2504-3 Patch, RISA-3D Negative hp for Singly-Symmetric Beams from PNA in Compression Flange Requiring Manual Verification, Tekla Structural Designer Beam Partial Fixity Force Error Requiring Bulletin PBTSD-2408-1 Patch, RAM Structural System Web Opening Tee Buckling Display Error Requiring Design Report Verification, and STAAD.Pro CHS Shear Area Underestimation from AS 4100 Formula Error Requiring Update

Steel beam design software's angle beam calculations, singly-symmetric beam properties, partial fixity force distribution, web opening display, and CHS shear area formulas produce errors from unconservative design assumptions, negative variable computation, force calculation bugs, display inconsistencies, and formula implementation errors. This guide covers the 5 most common steel beam designer problems with diagnostic steps and community-verified fixes from Tekla, RISA, Bentley, and Eng-Tips.

## 1. Tekla Structural Designer Unconservative Single Angle Beam Error to AISC 360

### Symptom

Tekla Structural Designer has a potentially unconservative error in the design of steel single angle beams to AISC 360. The error was identified in product bulletin PBTSD-2504-3 (April 2025). Single angle beam designs may have lower capacity than calculated, potentially leading to unsafe designs.

### Root Cause

The error is in Tekla Structural Designer's implementation of the AISC 360 design code for single angle beams. The software incorrectly calculates the design capacity for certain single angle configurations, resulting in potentially unconservative results. This means the software may report a higher capacity than the angle beam actually has, which is a safety concern. The error was identified by Trimble and documented in product bulletin PBTSD-2504-3.

### Fix

1. **Apply product bulletin PBTSD-2504-3**:
   - "Tekla Structural Designer product bulletin April 2025 (PBTSD-2504-3)"
   - "A potentially unconservative error in the design of steel single angle beams to AISC 360"
   - Check the bulletin for specific conditions
   - Apply the patch or update

2. **Update Tekla Structural Designer**:
   - Update to the latest version
   - The fix is included in the update
   - Verify the version includes PBTSD-2504-3
   - Re-run all single angle beam designs

3. **Manually verify single angle beam designs**:
   - For existing designs
   - Manually check the capacity calculations
   - Compare with AISC 360 manual calculations
   - Redesign if the capacity is overestimated

4. **Check which angle configurations are affected**:
   - Review the bulletin for specific conditions
   - Not all single angle beams may be affected
   - Focus on the configurations described in the bulletin
   - Verify those designs first

5. **Use the design procedure documentation**:
   - "Design procedure for single angles (Angles and tees: AISC 360)"
   - Follow the Tekla documentation
   - Cross-check with AISC 360 specification
   - Ensure compliance

6. **Report additional issues**:
   - If you find additional discrepancies
   - Contact Tekla support
   - Provide test cases
   - Request verification

7. **Review geometric vs principal axis design**:
   - "Single angles with continuous lateral-torsional restraint are permitted to be designed on the basis of geometric axis"
   - "Single angles without continuous lateral-torsional restraint are designed using principal axis bending"
   - Verify the correct design method is used
   - Check if the error affects one or both methods

### Community Report

> "Tekla Structural Designer product bulletin April 2025 (PBTSD-2504-3). A potentially unconservative error in the design of steel single angle beams to AISC 360. Single angles with continuous lateral-torsional restraint along the length are permitted to be designed on the basis of geometric axis (x, y) bending. Single angles without continuous lateral-torsional restraint are designed using the provision for principal axis (w, z) bending."

## 2. RISA-3D Negative hp for Singly-Symmetric Beams from PNA in Compression Flange

### Symptom

RISA-3D (v22.0 and earlier) calculates hp as a negative number when the plastic neutral axis (PNA) is within the compression flange of a singly-symmetric I-shaped beam cross-section. This causes the web to be classified as noncompact, messing up flexure Section F4 equations and reducing the calculated bending strength. The error affects beams with unequal flanges designed per AISC 360-16 or AISC 360-22.

### Root Cause

"Risa-3D calculates hp as a negative number anytime the PNA is within the compression flange of a singly symmetric beam cross-section." The variable hp is defined in AISC 360 as "Twice the distance from the plastic neutral axis to the inside face of the compression flange." When the PNA is within the compression flange, the distance should be zero or positive, but RISA-3D computes it as negative. This causes λpw (the limiting width-to-thickness ratio) to become a large negative number, automatically classifying the web as noncompact. The negative λpw also causes issues in flexure Section F4 equations (F4-9b), (F4-13), and (F4-16b). The AISC commentary states: "In extreme cases where the plastic neutral axis is located in the compression flange, hp = 0 and the web is considered to be compact."

### Fix

1. **Update RISA-3D**:
   - "Risa support confirmed that the below issue is an error in the program, and they have a ticket out to fix it"
   - Check for the latest RISA-3D version
   - The fix may be in a newer version
   - Contact RISA support for the fix status

2. **Manually verify with Mathcad or Excel**:
   - "I compared a hypothetical test beam in both Risa-3D and a comprehensive Mathcad worksheet"
   - RISA-3D: hp = -0.181", LRFD strength = 151.4 kip-ft
   - Mathcad: hp = +0.181", LRFD strength = 183.2 kip-ft
   - The difference is significant (17% conservative)

3. **Use absolute value of hp**:
   - "In my personal opinion, I think it's okay if hp is a positive, absolute value instead of 0"
   - "It just can't be negative"
   - Manually calculate hp as the absolute value
   - Verify the web classification

4. **Check if the result is conservative**:
   - "Thankfully, the issue in Risa-3D reduces bending strength per Section F4, so it should be conservative"
   - The negative hp makes the design conservative
   - The beam is over-designed, not under-designed
   - But it's still an error that wastes material

5. **Avoid singly-symmetric beams in RISA-3D**:
   - If possible, use doubly-symmetric beams
   - These don't trigger the PNA-in-flange scenario
   - Or use a different software for singly-symmetric beams
   - Verify with manual calculations

6. **Check RisaSection imported properties**:
   - "Risa-3D does not use the section properties that were calculated in RisaSection!"
   - "If you import a RisaSection file to analyze in Risa-3D, open up the shape and compare"
   - "If the shape has any additional elements besides 1 web and 2 flanges, the properties will likely be different"
   - Verify section properties manually

7. **Report the issue to RISA**:
   - "Risa support confirmed that the below issue is an error"
   - If you encounter this issue
   - Report it to RISA support
   - Provide your test case

### Community Report

> "Risa-3D calculates hp as a negative number anytime the PNA is within the compression flange of a singly symmetric beam cross-section. This causes a noncompact web and messes up flexure Section F4 equations, reducing bending strength. Risa support confirmed that the below issue is an error in the program, and they have a ticket out to fix it. RISA-3D: hp = -0.181", LRFD design bending strength = 151.4 kip-ft. Mathcad: hp = +0.181", LRFD design bending strength = 183.2 kip-ft."

## 3. Tekla Structural Designer Beam Partial Fixity Force Error

### Symptom

Tekla Structural Designer has a potentially unconservative error in calculations to determine forces in a beam that supports another beam which has partially fixity defined. The error was identified in product bulletin PBTSD-2408-1 (August 2024). Beam force calculations may be incorrect when partial fixity is involved.

### Root Cause

The error is in Tekla Structural Designer's calculation of forces in beams that support other beams with partial fixity. When a supported beam has partial fixity (not fully pinned or fully fixed), the force transfer to the supporting beam is calculated incorrectly. The partial fixity changes the moment distribution, and the software doesn't properly account for this in the force calculation. This can lead to unconservative design forces for the supporting beam.

### Fix

1. **Apply product bulletin PBTSD-2408-1**:
   - "Tekla Structural Designer product bulletin August 2024 (PBTSD-2408-1)"
   - "A potentially unconservative error in calculations to determine forces in a beam that supports another beam which has partially fixity defined"
   - Check the bulletin for specific conditions
   - Apply the patch or update

2. **Update Tekla Structural Designer**:
   - Update to the latest version
   - The fix is included in the update
   - Verify the version includes PBTSD-2408-1
   - Re-run all affected beam designs

3. **Manually verify beam forces**:
   - For existing designs with partial fixity
   - Manually calculate the forces
   - Compare with Tekla output
   - Redesign if forces are underestimated

4. **Use full fixity or full pin as workaround**:
   - Instead of partial fixity
   - Use full pin (conservative for moment)
   - Or full fixity (conservative for shear)
   - This avoids the partial fixity calculation error

5. **Check all beams supporting partially-fixed beams**:
   - Identify all beams in the model
   - That support beams with partial fixity
   - Verify their design forces
   - Redesign if necessary

6. **Report additional issues**:
   - If you find additional discrepancies
   - Contact Tekla support
   - Provide test cases
   - Request verification

### Community Report

> "Tekla Structural Designer product bulletin August 2024 (PBTSD-2408-01) which highlights a potentially unconservative error in calculations to determine forces in a beam that supports another beam which has partially fixity defined."

## 4. RAM Structural System Web Opening Tee Buckling Display Error

### Symptom

In the design of beams with web openings per AISC Design Guide #2, the program incorrectly and unnecessarily calculated the demand/capacity ratio for the tee buckling capacity check. It potentially listed a demand/capacity ratio greater than 1.0 as the controlling value for the opening, even though the opening passed all necessary design checks. The design report listed the correct value, but the on-screen display showed an incorrect value.

### Root Cause

"It is not required to perform the buckling capacity check of tees with an aspect ratio less than 4.0. However, the program incorrectly and unnecessarily calculated the demand/capacity ratio for that check." The RAM Structural System performs an unnecessary tee buckling check for tees with aspect ratio < 4.0, which AISC Design Guide #2 doesn't require. The program correctly doesn't flag the opening as failing, but it displays the unnecessary D/C ratio, which can be greater than 1.0. This creates confusion — the display shows a failing ratio, but the opening actually passes.

### Fix

1. **Check the design report, not the display**:
   - "The design report listed the correct value"
   - "In View/Update and on-screen, an incorrect demand/capacity ratio greater than 1.0 was listed"
   - Always verify with the design report
   - Don't rely on the on-screen display

2. **Update RAM Structural System**:
   - The display error may be fixed in newer versions
   - Update to the latest version
   - Check the release notes for fixes
   - Verify the display after update

3. **Check tee aspect ratio**:
   - "It is not required to perform the buckling capacity check of tees with an aspect ratio less than 4.0"
   - Calculate the tee aspect ratio manually
   - If < 4.0, the buckling check is not required
   - Ignore the displayed D/C ratio for this check

4. **Verify opening passes all required checks**:
   - Check all required design checks
   - Verify the opening passes
   - The unnecessary check doesn't affect the design
   - The opening is safe if required checks pass

5. **Report to Bentley**:
   - If the display error persists
   - Report to Bentley support
   - Provide the beam and opening data
   - Request a display fix

6. **Use the design report for documentation**:
   - When submitting designs
   - Use the design report, not screenshots
   - The report has the correct values
   - This avoids confusion from the display error

### Community Report

> "In the design of beams with web openings per AISC Design Guide #2, it is not required to perform the buckling capacity check of tees with an aspect ratio less than 4.0. However, the program incorrectly and unnecessarily calculated the demand/capacity ratio for that check and potentially listed that value as the controlling demand/capacity ratio for the opening, but correctly did not flag the opening as failing. The design report listed the correct value."

## 5. STAAD.Pro CHS Shear Area Underestimation from AS 4100 Formula Error

### Symptom

In STAAD.Pro, the AS 4100 1998 and 2020 design codes for HSS round (CHS) profiles incorrectly used only half the cross section area for the shear area calculation. This resulted in underestimating the shear capacity of CHS profiles. The error affects all CHS members designed to AS 4100.

### Root Cause

"The formula used to determine the shear area incorrectly used only half the cross section area resulting in underestimating the shear capacity of these profiles." The AS 4100 standard specifies a different shear area formula for CHS (Circular Hollow Sections) than what STAAD.Pro implemented. The software used half the cross-section area instead of the correct shear area formula, resulting in a conservative but incorrect shear capacity. This means CHS members may have been over-designed for shear.

### Fix

1. **Update STAAD.Pro to 2024 (24.00.02) or later**:
   - "The AS 4100 1998 and 2020 design codes have been updated for the design of HSS round (CHS) profiles"
   - "The formula used to determine the shear area incorrectly used only half the cross section area"
   - Update to STAAD.Pro 2024 (24.00.02) or later
   - The fix is included in this version

2. **Re-run CHS member designs**:
   - After updating
   - Re-run all CHS member designs
   - The shear capacity will be correctly calculated
   - Members may now pass that previously failed

3. **Manually verify shear capacity**:
   - For critical CHS members
   - Calculate the shear capacity manually per AS 4100
   - Compare with STAAD.Pro output
   - Verify the correct formula is used

4. **Check the revision history**:
   - "STAAD.Pro 2024 (24.00.02) Revision History"
   - "1482280 - The AS 4100 1998 and 2020 design codes have been updated"
   - Verify your version includes this fix
   - Check the build number

5. **Review other AS 4100 fixes in the update**:
   - "1482296 - The Australian steel design routines for designing physical members to AS 4100 1998 and 2020 have been updated"
   - "Have a larger slenderness ratio"
   - Check for other AS 4100 fixes
   - Re-run all Australian steel designs

6. **Check Canadian steel code fixes**:
   - "1496086 - The designs of cantilever members to the Canadian steel code CSA S16-19 have been updated"
   - "To correct the calculation of the Critical Elastic Moment"
   - If using Canadian codes, verify cantilever designs
   - Re-run after updating

7. **Check AISC 360 angle profile fixes**:
   - "1500567 - The AISC 360 2016 design of equal angle profiles has been updated"
   - "To address an issue in determining the value of clause H2"
   - If using AISC 360 with angles, verify designs
   - Re-run after updating

### Community Report

> "1482280 - The AS 4100 1998 and 2020 design codes have been updated for the design of HSS round (CHS) profiles. The formula used to determine the shear area incorrectly used only half the cross section area resulting in underestimating the shear capacity of these profiles. 1496086 - The designs of cantilever members to the Canadian steel code CSA S16-19 have been updated to correct the calculation of the Critical Elastic Moment. 1500567 - The AISC 360 2016 design of equal angle profiles has been updated."

## 6. Additional Steel Beam Designer Issues

### STAAD.Pro Memory Leak in AISC 360

**Issue**: "1480504 - The general AISC 360 design processing routine has been updated to address an identified memory leak which reduced performance on larger models."
**Fix**: Update to STAAD.Pro 2024 (24.00.02). The memory leak is fixed. Performance on large models improves.

### STAAD.Pro UPT File Crash

**Issue**: "1480399 - Reading external UPT files type GENERAL with multiple entries with profile points would cause the program to crash."
**Fix**: Update to STAAD.Pro 2024. The crash is fixed. UPT files with multiple entries are handled correctly.

### STAAD.Pro Insufficient Memory Error

**Issue**: "496342 - The threshold for 'significant mass' was set as 1.0e-8, now lowered to 1.0e-12. Previously reported as 'Insufficient Memory', now reports as 'No Mass Found'."
**Fix**: Update to latest version. The error message is now more accurate. Check mass assignment if "No Mass Found" appears.

### STAAD.Pro Support Displacement and Inclined Load Crash

**Issue**: "1532490 - The combination of support displacement loads and inclined node loads was conflicting and resulted in the analysis crashing."
**Fix**: Update to STAAD.Pro 2024. Both loading types can now exist in the same model. The crash is fixed.

### STAAD.Pro Steel Takeoff Unit Label Error

**Issue**: "1481437 - The unit label was incorrectly being printed for STEEL TAKEOFF with Canadian steel code S16-19, although the value is correct."
**Fix**: Update to STAAD.Pro 2024. The unit label is now correct. The value was always correct.

### STAAD.Pro Cantilever Shear Capacity Report Error

**Issue**: "1507931 - For Australian steel code AS 4100 1998, the shear capacity is incorrectly reported for cantilever members with no applied moment."
**Fix**: "Internally calculated and used correctly." Update to latest version. Check the design report, not the display.

### RAM Castellated Beam Freezing

**Issue**: "While optimizing castellated beam sizes for a range of opening spacing, the program may have failed to correctly determine an e-max."
**Fix**: "The optimization process for certain castellated beam designs stalled during a Design All." Manually specify opening spacing. Run design individually. Update to latest version.

## Best Practices

1. **Apply all product bulletins from Tekla** — PBTSD-2504-3 and PBTSD-2408-1 fix critical errors
2. **Manually verify singly-symmetric beam designs in RISA-3D** — check hp for negative values
3. **Use the design report, not the on-screen display** — RAM display may show incorrect D/C ratios
4. **Update STAAD.Pro to 2024 (24.00.02) or later** — fixes CHS shear area and many other issues
5. **Re-run all designs after applying bulletins or updates** — previous designs may be affected
6. **Cross-check critical designs with manual calculations** — verify software output
7. **Check section properties when importing from RisaSection to RISA-3D** — properties may differ
8. **Avoid partial fixity in Tekla if possible** — use full pin or full fixity as workaround
9. **Verify CHS shear capacity after STAAD.Pro update** — previous designs may be over-conservative
10. **Review revision history for all steel design software** — stay informed about calculation errors
