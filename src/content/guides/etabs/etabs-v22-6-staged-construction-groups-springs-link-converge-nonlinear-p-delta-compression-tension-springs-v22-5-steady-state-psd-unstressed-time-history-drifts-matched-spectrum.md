---
title: "ETABS v22.6.0 Staged Construction Change Operations Not Applied to Groups Besides All, Point Line Area Springs with Link Properties Fail to Converge in Nonlinear Large Displacements P-Delta, Compression Only Tension Only Area Springs Not Working in Nonlinear v22.5.0, Steady-State and PSD Load Cases Using Unstressed Zero State Stiffness Ignoring P-Delta, and Time History Drifts from Matched Response Spectrum Requiring Base Line Correction: Group All Workaround, Spring Link Convergence Fix, v22.5.1 Reanalysis, P-Delta Stiffness Case Fix, and Base Line Correction"
excerpt: "ETABS fails for 5 distinct reasons: v22.6.0 Staged Construction Change Operations not applied to groups besides All requiring Group All workaround, Point Line Area Springs with link properties fail to converge in nonlinear Large Displacements P-Delta requiring spring link fix, compression only tension only area springs not working in nonlinear v22.5.0 requiring v22.5.1 reanalysis, Steady-State and PSD load cases using unstressed zero state stiffness ignoring P-Delta requiring stiffness case fix, and time history drifts from matched response spectrum requiring base line correction. We cover each with fixes from CSI release notes."
category: "analysis-and-convergence-errors"
softwareSlug: "etabs"
keyword: "ETABS v22.6.0 Staged Construction Change Operations groups besides All Point Line Area Springs link properties fail converge nonlinear Large Displacements P-Delta compression only tension only area springs v22.5.0 Steady-State PSD unstressed zero state stiffness time history drifts matched response spectrum base line correction"
slug: "etabs-v22-6-staged-construction-groups-springs-link-converge-nonlinear-p-delta-compression-tension-springs-v22-5-steady-state-psd-unstressed-time-history-drifts-matched-spectrum"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://www.csiamerica.com/software/ETABS/22/ReleaseNotesETABSv2270plus2260.pdf"
  - "https://www.csiamerica.com/software/ETABS/22/ReleaseNotesETABSv2251plus2250.pdf"
  - "https://www.csiamerica.com/software/ETABS/23/ReleaseNotesETABSv2320.pdf"
---

# ETABS v22.6.0 Staged Construction Change Operations Not Applied to Groups Besides All, Point Line Area Springs with Link Properties Fail to Converge in Nonlinear Large Displacements P-Delta, Compression Only Tension Only Area Springs Not Working in Nonlinear v22.5.0, Steady-State and PSD Load Cases Using Unstressed Zero State Stiffness Ignoring P-Delta, and Time History Drifts from Matched Response Spectrum Requiring Base Line Correction: Group All Workaround, Spring Link Convergence Fix, v22.5.1 Reanalysis, P-Delta Stiffness Case Fix, and Base Line Correction

ETABS produces errors from staged construction group issues, spring link convergence, compression/tension spring bugs, P-Delta stiffness cases, and time history drifts. This guide covers the 5 most common ETABS problems with diagnostic steps and community-verified fixes from CSI release notes.

## 1. v22.6.0 Staged Construction Change Operations Not Applied to Groups Besides All

### Symptom

In ETABS v22.6.0, the "Change Sections", "Change Section & Age", "Change Modifiers", and "Change Releases" operations in Staged Construction load cases do not apply the intended effect when applied to groups besides group All. The operations work correctly when applied to group All but fail when applied to specific user-defined groups. The issue only affected ETABS v22.6.0.

### Root Cause

"An incident was resolved where the 'Change Sections', 'Change Section & Age', 'Change Modifiers', and 'Change Releases' operations in Staged Construction load cases did not apply the intended effect when applied to groups besides group All. This issue only affected ETABS v22.6.0." A bug in v22.6.0 caused the staged construction operations to only work with the default group All. User-defined groups were not properly recognized by the staged construction engine, causing the operations to be silently ignored.

### Fix

1. **Update to ETABS v22.7.0 or later**:
   - "An incident was resolved where the 'Change Sections'"
   - "Operations in Staged Construction load cases did not apply the intended effect"
   - "When applied to groups besides group All"
   - "This issue only affected ETABS v22.6.0"
   - Update to v22.7.0 or later

2. **Use group All as workaround**:
   - If you can't update immediately
   - Use group All instead of specific groups
   - For staged construction operations
   - As a temporary workaround

3. **Verify staged construction results**:
   - After updating to v22.7.0
   - Reanalyze models that used
   - Staged construction with specific groups
   - In v22.6.0

4. **Check if models were affected**:
   - If you used staged construction
   - With specific groups in v22.6.0
   - Your results may be incorrect
   - Reanalyze in v22.7.0+

5. **Report persistent issues**:
   - If the issue persists after updating
   - Report to CSI support
   - With the model file
   - And group definitions

6. **Document group usage in staged construction**:
   - Document which groups
   - Are used in staged construction
   - To track which models
   - Need reanalysis

7. **Test staged construction after update**:
   - After updating to v22.7.0
   - Test staged construction
   - With specific groups
   - To verify the fix works

### Community Report

> "An incident was resolved where the 'Change Sections', 'Change Section & Age', 'Change Modifiers', and 'Change Releases' operations in Staged Construction load cases did not apply the intended effect when applied to groups besides group All. This issue only affected ETABS v22.6.0."

## 2. Point Line Area Springs with Link Properties Fail to Converge in Nonlinear Large Displacements P-Delta

### Symptom

Point, Line, or Area springs that use a link property fail to converge in nonlinear static, staged-construction, and direct-integration time-history load cases when the geometric nonlinearity is set to Large Displacements and P-Delta. The analysis stops with a convergence failure message. The issue occurs when springs reference link properties rather than simple spring constants.

### Root Cause

"An incident was resolved where Point, Line or Area springs that used a link property could fail to converge in nonlinear static, staged-construction, and direct-integration time-history load cases when the geometric nonlinearity was set to Large Displacements and P-Delta. This issue affected ETABS v22.4.0 to v22.6.0." The nonlinear solver had a convergence issue when springs with link properties were combined with Large Displacements and P-Delta geometric nonlinearity. The link property's nonlinear behavior interacted poorly with the large displacement formulation, causing the Newton-Raphson iterations to diverge.

### Fix

1. **Update to ETABS v22.7.0 or later**:
   - "An incident was resolved where Point, Line or Area springs"
   - "That used a link property could fail to converge"
   - "When the geometric nonlinearity was set to Large Displacements and P-Delta"
   - "This issue affected ETABS v22.4.0 to v22.6.0"
   - Update to v22.7.0+

2. **Use simple spring constants instead of link properties**:
   - If you can't update immediately
   - Replace link property springs
   - With simple spring constants
   - To avoid the convergence issue

3. **Use P-Delta only without Large Displacements**:
   - If simple springs aren't possible
   - Change geometric nonlinearity
   - From Large Displacements + P-Delta
   - To P-Delta only

4. **Reanalyze affected models**:
   - Models analyzed in v22.4.0 to v22.6.0
   - With springs using link properties
   - And Large Displacements + P-Delta
   - Should be reanalyzed in v22.7.0+

5. **Check convergence logs**:
   - Review the analysis log
   - For convergence failure messages
   - Related to spring link properties
   - In nonlinear load cases

6. **Use event-to-event analysis**:
   - "Event-to-event analysis method"
   - Try event-to-event analysis
   - Instead of Newton-Raphson
   - For better convergence with nonlinear springs

7. **Contact CSI support**:
   - If convergence issues persist after updating
   - Contact CSI support
   - With the model file
   - And convergence log

### Community Report

> "An incident was resolved where Point, Line or Area springs that used a link property could fail to converge in nonlinear static, staged-construction, and direct-integration time-history load cases when the geometric nonlinearity was set to Large Displacements and P-Delta. This issue affected ETABS v22.4.0 to v22.6.0."

## 3. Compression Only Tension Only Area Springs Not Working in Nonlinear v22.5.0

### Symptom

Compression-only or tension-only area springs are not working correctly in nonlinear analysis in ETABS v22.5.0. The springs don't properly switch between active and inactive states during the nonlinear iterations. The issue causes incorrect results for models that rely on compression-only or tension-only area springs (e.g., soil-structure interaction models). The bug was introduced in v22.5.0 only.

### Root Cause

"An incident was resolved where compression only or tension only area springs were not working correctly in nonlinear analysis. This was a bug inadvertently introduced in v22.5.0 only. Models run in v22.5.0 need to be reanalyzed in v22.5.1 or later." A regression bug in v22.5.0 broke the compression-only and tension-only area spring behavior in nonlinear analysis. The springs' state-switching logic was corrupted, causing them to behave as either always active or always inactive, rather than switching based on the force direction.

### Fix

1. **Update to ETABS v22.5.1 or later**:
   - "An incident was resolved where compression only or tension only area springs"
   - "Were not working correctly in nonlinear analysis"
   - "This was a bug inadvertently introduced in v22.5.0 only"
   - "Models run in v22.5.0 need to be reanalyzed in v22.5.1 or later"
   - Update immediately

2. **Reanalyze all models from v22.5.0**:
   - "Models run in v22.5.0 need to be reanalyzed"
   - "In v22.5.1 or later"
   - Any model using compression-only or tension-only area springs
   - Run in v22.5.0 must be reanalyzed

3. **Verify spring behavior after reanalysis**:
   - After reanalyzing in v22.5.1+
   - Verify that compression-only springs
   - Only resist compression
   - And tension-only springs only resist tension

4. **Check soil-structure interaction models**:
   - Soil-structure interaction models
   - Often use compression-only area springs
   - These models are particularly affected
   - And must be reanalyzed

5. **Compare results between versions**:
   - Compare v22.5.0 results
   - With v22.5.1+ results
   - To identify if the bug
   - Significantly affected your models

6. **Document affected models**:
   - Document which models
   - Used compression-only or tension-only area springs
   - And were analyzed in v22.5.0
   - For reanalysis tracking

7. **Report persistent spring issues**:
   - If springs still don't work correctly
   - After updating to v22.5.1+
   - Report to CSI support
   - With the model file

### Community Report

> "An incident was resolved where compression only or tension only area springs were not working correctly in nonlinear analysis. This was a bug inadvertently introduced in v22.5.0 only. Models run in v22.5.0 need to be reanalyzed in v22.5.1 or later."

## 4. Steady-State and PSD Load Cases Using Unstressed Zero State Stiffness Ignoring P-Delta

### Symptom

Steady-state and PSD load cases in ETABS v23.2.0 always use the stiffness from the unstressed (zero) state, regardless of any specified P-delta case. This can be verified by reviewing the analysis .LOG file. Results could be affected, depending on the significance of the P-delta effects. The issue means that P-delta effects are not considered in steady-state and PSD analyses.

### Root Cause

"An incident was resolved that addressed three issues: (1) Steady-state and PSD load cases always used the stiffness from the unstressed (zero) state regardless of any specified P-delta case. This could be seen by reviewing the analysis .LOG file. Results could be affected, depending on the significance of the P-delta effects." The steady-state and PSD analysis routines didn't use the stiffness matrix from the P-delta load case. Instead, they used the unstressed stiffness matrix, ignoring the geometric stiffness modifications from P-delta effects. This could lead to incorrect results for structures where P-delta effects are significant.

### Fix

1. **Update to ETABS v23.2.0 update or later**:
   - "An incident was resolved that addressed three issues"
   - "(1) Steady-state and PSD load cases always used the stiffness"
   - "From the unstressed (zero) state regardless of any specified P-delta case"
   - Update to the latest version

2. **Check the analysis .LOG file**:
   - "This could be seen by reviewing the analysis .LOG file"
   - Review the .LOG file
   - To verify which stiffness matrix
   - Was used for steady-state and PSD cases

3. **Specify P-delta case correctly**:
   - After updating
   - Verify the P-delta case
   - Is properly specified
   - For steady-state and PSD load cases

4. **Reanalyze affected models**:
   - Models with steady-state or PSD load cases
   - That were analyzed in previous versions
   - Should be reanalyzed
   - After updating

5. **Assess result significance**:
   - "Results could be affected, depending on the significance of the P-delta effects"
   - Evaluate how significant
   - P-delta effects are for your structure
   - To determine if results changed meaningfully

6. **Check modal load case ordering**:
   - "(2) Modal load cases used for time history damping"
   - "Were not always run before load cases referencing them"
   - "Requiring the user to run the analysis for a second time"
   - Also fixed in the same update

7. **Check nonlinear static modal loading**:
   - "(3) Modal load cases used for loading in nonlinear static load cases"
   - "Were not always run before load cases referencing them"
   - "Resulting in the zero contribution from the applied mode shapes"
   - Also fixed in the same update

### Community Report

> "An incident was resolved that addressed three issues: (1) Steady-state and PSD load cases always used the stiffness from the unstressed (zero) state regardless of any specified P-delta case. This could be seen by reviewing the analysis .LOG file. Results could be affected, depending on the significance of the P-delta effects. (2) Modal load cases used for time history damping or steady-state/PSD output frequencies were not always run before load cases referencing them, requiring the user to run the analysis for a second time. (3) Modal load cases used for loading in nonlinear static load cases were not always run before load cases referencing them."

## 5. Time History Drifts from Matched Response Spectrum Requiring Base Line Correction

### Symptom

When using a time history matched to a response spectrum for time history analyses, drifts appear in the velocity and displacement time histories. The drifts accumulate over time, causing unrealistic displacement and velocity values. The issue occurs when the time history is matched to a response spectrum using the matching feature in ETABS.

### Root Cause

"An enhancement has been made that addresses drifts in the velocity and displacement time histories, obtained from time history analyses, when a time history matched to a response spectrum was used for the time history analyses. Base line correction has been applied to the matched time histories as part of the matching process to prevent the drifts." The spectrum matching process introduced low-frequency content that caused drifts in the integrated velocity and displacement time histories. Without base line correction, these drifts accumulated, producing unrealistic results.

### Fix

1. **Update to ETABS v22.7.0 or later**:
   - "An enhancement has been made that addresses drifts"
   - "In the velocity and displacement time histories"
   - "When a time history matched to a response spectrum was used"
   - "Base line correction has been applied to the matched time histories"
   - Update to v22.7.0+

2. **Reapply spectrum matching**:
   - After updating
   - Reapply the spectrum matching
   - To existing time history functions
   - To get the base line correction

3. **Verify time history results**:
   - After reapplying the matching
   - Verify that velocity and displacement
   - Time histories no longer drift
   - Over the analysis duration

4. **Check displacement at end of analysis**:
   - The displacement at the end
   - Of the time history
   - Should return to near zero
   - If base line correction is working

5. **Use external base line correction**:
   - If you can't update immediately
   - Apply base line correction
   - Using external tools
   - Before importing the time history

6. **Compare matched vs original**:
   - Compare the matched time history
   - With the original
   - To verify the matching
   - Didn't introduce artifacts

7. **Report persistent drifts**:
   - If drifts persist after updating
   - And reapplying the matching
   - Report to CSI support
   - With the time history file

### Community Report

> "An enhancement has been made that addresses drifts in the velocity and displacement time histories, obtained from time history analyses, when a time history matched to a response spectrum was used for the time history analyses. Base line correction has been applied to the matched time histories as part of the matching process to prevent the drifts."

## 6. Additional ETABS Issues

### Wall Hinge Force Reporting in Nonlinear Levels

**Issue**: "Pier and Spandrel force results including wall objects, wall hinges may be incorrectly reported in levels of ETABS which do not include ability to analyze wall hinges (e.g. Nonlinear level)."
**Fix**: Update to the latest version. This was a reporting issue that only affected the response of the wall object and did not affect other analysis results. Verify wall hinge forces after updating.

### Nonlinear Energy by Group Excessively Large Numbers

**Issue**: "Nonlinear energy by group results viewed through Plot Functions and database tables showed excessively larger or illegal numbers."
**Fix**: Update to the latest version. This was a reporting issue for element energy results. Affected ETABS v22.5.0 to v22.5.1 only. Recheck energy results after updating.

### Staged Construction Base Reaction Reporting Error

**Issue**: "Staged Construction load cases with both Instantaneous Load and Time Dependent Items in the same stage may report incorrect base reaction and joint reaction results."
**Fix**: Update to the latest version. This was a reporting error for reactions that did not affect other analysis results. Affected v22.2.0 to v22.5.1. Recheck reactions after updating.

### CMU Wall Design Results Not Available

**Issue**: "CMU wall design results were not available on screen."
**Fix**: Update to the latest version. This affected v22.5.0 only. CMU wall design results should display correctly after updating.

### NBCC 2025 Auto-Seismic and Response Spectrum

**Issue**: "Auto-wind loading, auto-seismic loading, and response-spectrum functions based on NBCC 2025 have been added."
**Fix**: Use ETABS v23.2.0+ for NBCC 2025 compliance. Configure auto-seismic and response spectrum functions according to NBCC 2025 parameters.

### KDS 41 17 00:2024 Korean Seismic Code

**Issue**: "Auto-seismic loading and response spectrum functions according to KDS 41 17 00:2024 have been added."
**Fix**: Use ETABS v23.2.0+ for KDS 41 17 00:2024 compliance. Configure auto-seismic loads according to the Korean building code.

### AS 1170.4-2024 Australian Seismic Code

**Issue**: "Auto seismic loading and response spectrum function according to AS 1170.4-2024 has been added."
**Fix**: Use ETABS v22.5.0+ for AS 1170.4-2024 compliance. Configure auto-seismic loads according to the Australian standard.

## Best Practices

1. **Update to the latest ETABS version** — many analysis bugs are version-specific
2. **Reanalyze models after version updates** — especially for staged construction and nonlinear
3. **Use group All for staged construction in v22.6.0** — workaround for group-specific operations
4. **Use simple spring constants instead of link properties for nonlinear** — avoids convergence issues
5. **Check analysis .LOG file for stiffness matrix used** — verifies P-delta is considered
6. **Reapply spectrum matching after updating** — gets base line correction for time histories
7. **Verify compression/tension spring behavior after v22.5.1 update** — ensures correct results
8. **Use event-to-event analysis for convergence issues** — alternative to Newton-Raphson
9. **Document which models need reanalysis** — tracks models affected by version-specific bugs
10. **Check for new code support (NBCC 2025, KDS 2024, AS 2024)** — ensures compliance
