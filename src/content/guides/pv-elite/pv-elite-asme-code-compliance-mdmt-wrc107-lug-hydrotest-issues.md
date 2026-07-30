---
title: "PV Elite ASME Code Compliance: MDMT Calculation Bug, WRC 107 Nozzle Stress, Lug Support Limitations, and Hydrotest Head Pressure Fixes"
excerpt: "PV Elite users face code compliance pitfalls: a confirmed MDMT calculation error in PV Elite 2017 for UCS-68(c) PWHT reduction, WRC 107 stress indices options, single-set lug support limitation, and hydrotest head pressure for skirt-filled vessels. We cover each with code references and SP1 fixes."
category: "code-compliance"
softwareSlug: "pv-elite"
keyword: "PV Elite ASME MDMT calculation error UCS-68 WRC 107 nozzle stress lug support hydrotest code compliance"
slug: "pv-elite-asme-code-compliance-mdmt-wrc107-lug-hydrotest-issues"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://www.ecedesign.com/2015/07/20/pv-elite-top-questions-from-the-industry/"
  - "https://thietbiaplucblog.wordpress.com/2017/08/04/potential-issue-with-pv-elite-2017-mdmt-calculation/"
  - "https://www.ecedesign.com/2017/04/03/pv-elite-2017-service-pack-1-released/"
---

# PV Elite ASME Code Compliance: MDMT Calculation Bug, WRC 107 Nozzle Stress, Lug Support Limitations, and Hydrotest Head Pressure Fixes

PV Elite performs pressure vessel design calculations per ASME Section VIII Divisions 1/2 and PD 5500. Several code compliance issues have been identified by users and confirmed by Intergraph (now Hexagon PPM), ranging from a MDMT calculation error to limitations in lug support analysis. This guide covers the most significant issues, their code references, and available fixes.

## Issue 1: MDMT Calculation Error for UCS-68(c) PWHT Reduction (PV Elite 2017)

### The Bug

PV Elite 2017 does **not correctly apply** the 30°F (17°C) reduction in impact testing exemption temperature when Post-Weld Heat Treatment (PWHT) is **not** an ASME Code requirement, per paragraph UCS-68(c).

### Two Key Errors

**Error 1**: The rated Minimum Design Metal Temperature (MDMT) of a vessel is allowed to drop below **-55°F (-48°C)** even though the coincident ratio (per Figure UCS-66.1) is greater than 0.35. Per Code, this should not be allowed.

**Error 2**: When the required MDMT is less than -55°F, PWHT becomes a Code requirement per UCS-68(b). However, PV Elite 2017 **still applies the 30°F reduction** even though PWHT is now mandatory (not optional), which invalidates the conditions for the reduction.

### Code Background

ASME Section VIII Division 1, UCS-68(c) states:

> "If postweld heat treating of a pressure-retaining weld is performed when it is not otherwise a requirement of this Division, a 30°F reduction in impact testing exemption temperature may be given to the minimum permissible temperature from Figure UCS-66 for P-No. 1 materials."

The reduction only applies when PWHT is **voluntary** — not when it's a Code requirement. Two constraints apply:

1. The final rated MDMT **cannot be colder than -55°F** unless the component is impact tested or has a coincident ratio less than 0.35
2. If the required MDMT is colder than -55°F, PWHT becomes a **Code requirement** per UCS-68(b) — and the 30°F reduction no longer applies

### Verification

Testing with a sample vessel in both PV Elite 2017 and COMPRESS 2017 (Build 7700) across three design conditions confirmed the discrepancy. While both programs agreed on required thickness, MAWP, MAP, and coincident stress ratio, the MDMT reduction was applied incorrectly in PV Elite.

### Impact

Vessels designed with PV Elite 2017 may have an MDMT that is **incorrectly lower** than Code permits, potentially leading to unsafe designs in low-temperature service where brittle fracture is a risk.

### Fix

Update to PV Elite 2017 Service Pack 1 or later, which addresses MDMT-related calculation issues. Always verify MDMT results against Code requirements manually for vessels with PWHT and low MDMT.

## Issue 2: WRC 107 Nozzle Stress Analysis Limitations

### What PV Elite Provides

WRC 107 (now WRC 537) calculates local stresses at nozzle-to-shell junctions from external loads and moments. PV Elite's implementation includes:

- **Stress indices** as an alternative to WRC 107
- **Kn and Kb factors** for stress concentration adjustments
- **Pressure thrust** as an optional inclusion
- **Equivalent spherical diameter** method for elliptical heads (based on head diameter)

### What's Not Available

- **Cannot directly modify** the membrane stress factor in WRC 107 calculations
- Workaround: Use stress indices or Kn/Kb factors instead of direct factor modification

### CodeCalc Import Bug (Fixed in SP1)

Previously, importing nozzle data from PV Elite into the WRC 107/537 and WRC 297 modules in CodeCalc caused the software to **crash**. This was fixed in PV Elite 2017 SP1.

Additionally, the Loads tab in CodeCalc's WRC modules did not correctly update labels when FEA was selected as the Analysis Type. The "Expansion" section is now renamed to "Operating" when performing FEA analysis.

## Issue 3: Lug Support Limitations

### Single Set of Lugs Only

PV Elite only solves for loads on the **first set of lugs**. If a vessel has two sets of lugs (upper and lower), the upper lug calculations **do not appear** in the output.

**Reason**: Two sets of lugs create a **statically indeterminate problem** — the load distribution depends on the stiffness of the supports and vessel, which PV Elite's simplified analysis cannot resolve.

**Workaround**:
1. Analyze each set of lugs separately as a single set
2. Use engineering judgment to distribute loads between upper and lower lugs
3. For critical applications, use FEA software for the complete support analysis

### Lug Assumptions

- Lugs are assumed to be **bolted** to the attaching structure
- Default parameters for lifting lugs are **hard-coded** into the software
- During earthquake analysis, the vessel accelerates **around the supports** — the support point is the pivot

### Vortex Shedding Screening

The vibration possibility from vortex shedding is a function of:
- Weight of the vessel
- Height of the vessel
- Diameter of the vessel

PV Elite provides screening criteria but does not perform detailed vortex shedding analysis. For vessels flagged as susceptible, a more detailed vibration analysis may be needed.

## Issue 4: Hydrotest Head Pressure for Skirt-Filled Vessels (Fixed in SP1)

### The Bug

PV Elite did not calculate the **hydrostatic head pressure** for the last element of a model with a skirt that was **completely filled with liquid**. This meant the hydrotest pressure for the bottom element was underestimated.

### Why It Matters

Hydrostatic head adds pressure at the bottom of a vessel filled with liquid. For tall vessels with skirts, the bottom element experiences the highest pressure during hydrotest. Missing this head pressure can lead to under-thickness or non-compliant hydrotest.

### Fix

PV Elite 2017 SP1 resolves this issue — the software now correctly calculates hydrostatic head pressure for all elements, including the last element of skirt-supported vessels filled with liquid.

## Issue 5: Tubesheet Analysis Method Reset (Fixed in SP1)

### The Bug

When selecting **PD5500** as the Tubesheet Analysis Method and then closing and reopening the Heat Exchanger Tubesheet Input dialog, PV Elite reset the method to **ASME** without user action.

### Fix

PV Elite 2017 SP1 retains the user's selection for Tubesheet Analysis Method across dialog close/reopen cycles.

## Issue 6: Nozzle Groove Weld Depth Limit (Fixed in SP1)

### The Bug

For child nozzles attached to parent nozzles, the Nozzle to Shell Groove Weld Depth was limited to the **thickness of the shell**, even if the parent nozzle was thicker than the shell.

### Fix

PV Elite 2017 SP1 determines the weld depth limit based on the **thickness of the element/detail to which the nozzle is attached** — not just the shell thickness.

## Issue 7: API 579 Analysis Issues (Fixed in SP1)

Multiple API 579 (Fitness for Service) issues were fixed in SP1:

- **CrateRD field**: Was incorrectly active for MAWP Approach — now only active for Thickness Approach (Part 5)
- **tam_prev field**: Now allows override of calculated value in remaining life calculations
- **Supplemental load values**: Now correctly progress through the analysis
- **PTR data sum**: Now correctly calculates the sum of points
- **Rerated MAWP Circumferential**: Uses the correct tam value

## Issue 8: External Pressure Chart Reference (Fixed in SP1)

PV Elite did not correctly reference External Pressure Chart **NFC-3** for material **SB-466 H55**. This could lead to incorrect external pressure calculations for this specific material.

## Issue 9: Saddle Data Import (Fixed in SP1)

Importing saddle data from a customized `SaddleData.xls` file failed because the software did not use the correct conversion factor. SP1 fixes the import to use correct conversions.

Additionally, the Saddle Dialog diagram displayed an incorrect designation for "Height of Web at Center" — the diagram has been corrected.

## Issue 10: ANSI Metric Nozzle Flange Calculation (Fixed in SP1)

PV Elite displayed flange small end hub thickness calculations for nozzles from the ANSI metric nozzle database when using **Imperial units** but did not display them when using **metric units**. SP1 fixes this so calculations display correctly in both unit systems.

## Longitudinal Allowable Stress: Understanding UG-23(d)

### User Question

When reviewing PV Elite output, the longitudinal allowable stresses may appear inconsistent with ASME Section VIII Division 1, UG-23(d):

- **Tensile (operating)**: 1.2 × allowable stress at design temperature (per UG-23(d) for wind/earthquake combinations)
- **Hydrotest tensile**: 1.2 × hydrotest allowable stress — but this may **exceed yield strength**, which raises the question: is this allowed?

### Analysis

UG-23(d) allows 1.2× the maximum allowable stress for combinations of earthquake or wind loading with other loadings. However, the hydrotest tensile allowable (1.2 × 198 MPa = 237.6 MPa) exceeding the yield strength (220 MPa) is questionable — the vessel would yield past 220 MPa.

**Recommendation**: Verify hydrotest longitudinal stresses against yield strength in addition to the UG-23(d) allowable. Consult with your Authorized Inspector (AI) for cases where hydrotest stresses approach or exceed yield.

### Compressive Stress

The compressive allowable is per UG-23(b), determined from ASME II Part D charts. Users have reported difficulty matching PV Elite's compressive allowable to the chart values — verify manually for critical applications.

## PV Elite Analysis Workflow

PV Elite's analysis follows a structured sequence:

1. **Input validation**: Catches most input errors before analysis begins
2. **Internal pressure calculation**: Required thickness and MAWP for each element per ASME VIII Div. 1/2 or PD 5500
3. **Auto-thickness increase**: If enabled, increases thickness for under-thickness elements (exactly to required or rounded to nominal)
4. **MDMT calculation**: Minimum design metal temperatures for each element
5. **External pressure calculation**: Computes section length, Pmax, and stiffener requirements
6. **Hydrotest calculation**: Maximum allowed hydrotest pressure and required thickness
7. **Longitudinal stresses**: Wind, earthquake, and combined loading per UG-23
8. **WRC nozzle analysis**: Local stresses at nozzle junctions
9. **Lifting lug analysis**: Loads and stresses on lifting lugs
10. **Vibration screening**: Vortex shedding possibility

Each step's output includes formulas and substitutions for verification against Code requirements.
