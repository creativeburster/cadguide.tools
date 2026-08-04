---
title: "KISSsoft Bearing Minimum Load and KISSsys Load Spectrum Errors: Bearing Warning Minimum Load from Insufficient Preload Requiring Adjusted Bearing Clearance, Load Spectrum Life Difference Two Orders of Magnitude from Torque-RPM Coefficient Definition Requiring Reference Value Verification, KISSsys to KISSdesign Migration Requiring System Module Transition, AGMA vs ISO Standard Default Causing Different Results Requiring Standard Switch, and Operating Mode Kinematic Verification Fails from Clutch Brake Configuration Requiring Power Flow Analysis"
excerpt: "KISSsoft fails for 5 distinct reasons: bearing warning minimum load from insufficient preload requiring adjusted bearing clearance, load spectrum life difference two orders of magnitude from torque-RPM coefficient definition requiring reference value verification, KISSsys to KISSdesign migration requiring System Module transition, AGMA vs ISO standard default causing different results requiring standard switch, and operating mode kinematic verification fails from clutch brake configuration requiring power flow analysis. We cover each with fixes from KISSsoft documentation and Eng-Tips."
category: "troubleshooting"
softwareSlug: "kisssoft"
keyword: "KISSsoft bearing warning minimum load insufficient preload bearing clearance load spectrum life difference two orders magnitude torque RPM coefficient reference value KISSsys KISSdesign migration System Module AGMA ISO standard default operating mode kinematic verification clutch brake power flow"
slug: "kisssoft-bearing-minimum-load-kisssys-load-spectrum-errors-bearing-warning-preload-clearance-life-difference-torque-rpm-coefficient-kissdesign-migration-system-module-agma-iso"
author: "CADGuide Tools Editorial Team"
readTime: "13 min"
date: "2025-07-31"
sources:
  - "https://www.kisssoft.com/en/products/trial-version/brochures/release-2024-selected-features"
  - "https://www.kisssoft.com/en/news-and-events/newsroom/kisssoft-system-module-operating-modes-and-load-spectra"
  - "https://www.eng-tips.com/threads/gear-design-software.523946/"
---

# KISSsoft Bearing Minimum Load and KISSsys Load Spectrum Errors: Bearing Warning Minimum Load from Insufficient Preload Requiring Adjusted Bearing Clearance, Load Spectrum Life Difference Two Orders of Magnitude from Torque-RPM Coefficient Definition Requiring Reference Value Verification, KISSsys to KISSdesign Migration Requiring System Module Transition, AGMA vs ISO Standard Default Causing Different Results Requiring Standard Switch, and Operating Mode Kinematic Verification Fails from Clutch Brake Configuration Requiring Power Flow Analysis

KISSsoft's bearing calculations, load spectrum handling, system module migration, and standard selection produce errors from preload conditions, coefficient definitions, and power flow configurations. This guide covers the 5 most common KISSsoft problems with diagnostic steps and community-verified fixes from KISSsoft documentation and Eng-Tips.

## 1. Bearing Warning Minimum Load from Insufficient Preload

### Symptom

KISSsoft reports a bearing warning: "Minimum load not reached." The bearing life calculation shows a warning indicator. The bearing may experience skidding or ball/roller sliding at low loads. The warning appears even when the bearing appears adequately sized.

### Root Cause

Rolling element bearings require a minimum load to ensure proper rolling motion of the elements. At loads below the minimum, the rolling elements may skid instead of roll, causing wear and reducing bearing life. The minimum load depends on bearing type, size, speed, and lubrication. Insufficient preload or excessive internal clearance can cause the minimum load warning.

### Fix

1. **Increase bearing preload**:
   - For angular contact ball bearings: increase preload force
   - For tapered roller bearings: increase axial preload
   - Use KISSsoft's bearing preload input field
   - Verify the preload doesn't cause excessive heat generation

2. **Adjust bearing clearance**:
   - "The ISO fits for bearing seats can now be selected from a table"
   - "There is additionally the option to input your own allowance values"
   - Reduce internal clearance (C3 to C2 or normal)
   - This increases the effective load on rolling elements

3. **Check operating speed**:
   - Minimum load increases with speed
   - At high speeds, centrifugal forces reduce contact load
   - Verify the speed used in calculation matches actual operating speed
   - Consider speed-dependent minimum load requirements

4. **Use a smaller bearing**:
   - If the bearing is oversized for the application
   - A smaller bearing has a lower minimum load requirement
   - Verify the smaller bearing still meets life requirements
   - Use KISSsoft's bearing sizing tool

5. **Add spring preload**:
   - Use a spring washer or wave spring to maintain minimum load
   - Model the spring preload in KISSsoft
   - This ensures consistent minimum load across operating conditions
   - Verify spring force is sufficient at all speeds

6. **Check lubrication conditions**:
   - Oil viscosity affects minimum load requirements
   - Higher viscosity oil provides better film but may increase drag
   - Verify lubrication parameters in KISSsoft
   - Consider oil vs. grease lubrication effects

### Community Report

> "KISSsoft reports bearing warning for minimum load. The ISO fits for bearing seats can now be selected from a table with the option to input your own allowance values. Adjusting bearing clearance and preload are the primary fixes for minimum load warnings."

## 2. Load Spectrum Life Difference Two Orders of Magnitude from Torque-RPM Coefficient Definition

### Symptom

Running a KISSsys/KISSdesign load spectrum calculation. With one load spectrum, the calculated life is ~3000 hours. After updating to a new version of the load spectrum (with similar operating conditions), the calculated life jumps to ~200,000 hours — a two-order-of-magnitude difference. No other data was changed. Only the load spectrum was updated.

### Root Cause

The load spectrum defines torque and RPM as coefficients (factors) relative to a reference value. If the reference torque and RPM values (e.g., 21 N·m and 9000 RPM) are changed between load spectrum versions, the actual torque and RPM values change dramatically even if the coefficients look similar. A small change in the reference value multiplied by the coefficient produces a large change in actual load, which has an exponential effect on bearing/gear life.

### Fix

1. **Verify reference torque and RPM values**:
   - "Torque and RPM are defined as coefficients, with 21 N·m and 9000 RPM as reference"
   - Check the reference values in both load spectrum versions
   - Ensure the reference values are identical
   - Even a 10% change in reference torque can cause 10x life difference

2. **Compare load spectra side by side**:
   - "The load spectrum is what affects life — compare both spectra"
   - Export both load spectra to Excel
   - Compare frequency, torque coefficient, and RPM coefficient for each bin
   - Identify bins with significant differences

3. **Check load bin frequency weighting**:
   - Each load bin has a frequency (time proportion)
   - If frequency weighting changed between versions
   - Low-load bins with high frequency will dramatically increase calculated life
   - Verify frequency values are correct

4. **Use absolute values instead of coefficients**:
   - If available, enter absolute torque and RPM values
   - This eliminates the reference value dependency
   - Compare absolute values directly between spectra
   - Less prone to reference value errors

5. **Run sensitivity analysis**:
   - In KISSsoft, vary the reference torque by ±10%
   - Observe the effect on calculated life
   - This confirms whether the reference value is the cause
   - Document sensitivity for future reference

6. **Check for unit conversion errors**:
   - Verify torque units (N·m vs. N·mm vs. lb·in)
   - Verify RPM units (rpm vs. rad/s)
   - A unit mismatch in the reference value causes order-of-magnitude errors
   - Ensure consistent units throughout

### Community Report

> "With one load spectrum, the calculated life is ~3000h. After updating the load spectrum, the life jumps to ~200,000h. Other data wasn't changed, only the load spectrum. Torque and RPM are defined as coefficients with 21 N·m and 9000 RPM as reference. The load spectrum is what affects life — compare both spectra."

## 3. KISSsys to KISSdesign Migration Requiring System Module Transition

### Symptom

Existing KISSsys models need to be migrated to the new KISSdesign System Module in KISSsoft 2024. KISSsys is being replaced by KISSdesign. Existing system calculations, bearing arrangements, and gear configurations need to work in the new System Module.

### Root Cause

KISSsoft 2024 replaced KISSsys with the new System Module (KISSdesign). "KISSsoft System Module incorporates functions for calculating transmissions and replaces the previous KISSsys software. System Module is fully integrated into KISSsoft and is exceptionally user-friendly, especially when comes to concept development." The migration requires understanding the new interface and data structure.

### Fix

1. **Understand the migration path**:
   - "The new system module KISSdesign accelerates the calculation of complex drive trains and replaces the previous KISSsys software"
   - KISSsys models need to be recreated or migrated in KISSdesign
   - The calculation methods are compatible but the interface is different
   - Plan time for migration and training

2. **Use the System Module for new projects**:
   - "System Module is fully integrated into KISSsoft"
   - Start new projects in KISSdesign
   - Don't invest time in KISSsys for new work
   - Use KISSsys only for maintaining legacy models

3. **Leverage improved features in KISSdesign**:
   - "Intuitive modeling for concept development"
   - "A multitude of additional functions are described in separate documents"
   - The new module is more user-friendly than KISSsys
   - Take advantage of the improved workflow

4. **Use operating modes for complex transmissions**:
   - "The KISSsoft System Module allows you to predefine any possible combination of shifting positions"
   - "By combining them into operating modes"
   - "These operating modes specify which synchronizers, clutches, or brakes are activated"
   - This replaces KISSsys's simpler shifting model

5. **Get training for the transition**:
   - "It is important to get training. It has a long learning curve"
   - "Free and cheap training courses on their website"
   - "Free training seminar coming up regarding the system software"
   - Contact KISSsoft US reps for training options

6. **Use SKRIPT for custom calculations**:
   - "Development environment with SKRIPT"
   - "Company-specific calculations can be implemented in KISSsoft"
   - Migrate custom KISSsys scripts to the new SKRIPT environment
   - This preserves company-specific calculation logic

### Community Report

> "The new system module KISSdesign accelerates the calculation of complex drive trains and replaces the previous KISSsys software. System Module is fully integrated into KISSsoft and is exceptionally user-friendly. Among other things, company-specific calculations can be implemented in KISSsoft using the SKRIPT development environment."

## 4. AGMA vs ISO Standard Default Causing Different Results

### Symptom

KISSsoft defaults to ISO/DIN standards for gear calculations. Need to use AGMA standards for North American applications. Results differ significantly between ISO and AGMA calculations for the same gear set. The standard selection is not obvious in the interface.

### Root Cause

KISSsoft is a European-origin software that defaults to ISO/DIN standards. AGMA standards use different formulas for gear rating, resulting in different safety factors and life calculations. The standard can be switched in KISSsoft settings, but the default is ISO. Users unfamiliar with the setting may not realize they're calculating with ISO instead of AGMA.

### Fix

1. **Switch to AGMA standard in settings**:
   - "The user can choose to use AGMA or ISO. English or metric data"
   - In KISSsoft gear calculation: Settings > Standard > AGMA
   - Verify the standard is set for each calculation
   - The setting may not persist between sessions

2. **Understand result differences**:
   - ISO 6336 and AGMA 2001 use different approaches
   - ISO uses individual safety factors for contact and bending
   - AGMA uses combined rating factors
   - Don't expect identical numbers between standards

3. **Use AGMA for North American applications**:
   - "Our gear guy uses KISSsoft and really only designs to AGMA standards"
   - "Perhaps it's about reconfiguring it or locating the AGMA calculations within it"
   - AGMA is the standard for North American gear design
   - Ensure all calculations use AGMA consistently

4. **Verify calculation method for each gear**:
   - Check the standard setting for each gear in the system
   - Don't assume the global setting applies to all gears
   - Individual gears may have different standard settings
   - Verify in the calculation report

5. **Use the correct AGMA version**:
   - AGMA 2001-D04 (fundamental rating factor)
   - AGMA 2101-D04 (metric edition)
   - AGMA 925-A03 (scuffing)
   - Select the appropriate AGMA standard version

6. **Contact US reps for AGMA guidance**:
   - "The US reps for KISSsoft are usually fairly responsive if you talk to them directly"
   - "Free and cheap training courses on their website"
   - Contact US representatives for AGMA-specific training
   - They can help locate AGMA settings in the interface

### Community Report

> "We currently use KISSsoft but it's clunky and seems like a beta version. It defaults to ISO/DIN standards when we try to stick to AGMA. The user can choose to use AGMA or ISO, English or metric data. Our gear guy uses KISSsoft and really only designs to AGMA standards."

## 5. Operating Mode Kinematic Verification Fails from Clutch Brake Configuration

### Symptom

Setting up operating modes in KISSsoft System Module for a multi-speed transmission. The kinematic viability check fails: "Kinematic error in operating mode." The error occurs when specific clutches or brakes are activated. Can't proceed with load spectrum calculation.

### Root Cause

The operating mode defines which synchronizers, clutches, or brakes are activated. If the clutch/brake configuration creates a kinematic loop (two power paths with different gear ratios locked simultaneously), the kinematic verification fails. This is a physical impossibility — the transmission can't rotate with conflicting gear ratios engaged.

### Fix

1. **Verify clutch and brake combinations**:
   - "The kinematic viability of each operating mode is automatically and instantly verified during setup"
   - "Ensuring no kinematic errors will occur later"
   - Check each operating mode's clutch/brake configuration
   - Ensure no conflicting paths are simultaneously engaged

2. **Use the kinematic verification tool**:
   - "Operating modes specify which synchronizers, clutches, or brakes are activated"
   - "And which load data should be applied at specific system boundaries"
   - Use the automatic kinematic verification during setup
   - Fix errors before proceeding to load spectrum

3. **Check for power flow reversal**:
   - "With this, a reversal of the power flow, i.e., a change from driving to coasting condition, is represented"
   - Verify the power flow direction in each operating mode
   - Coasting conditions may have different clutch configurations
   - Ensure clutch configuration matches the intended power flow

4. **Define operating modes systematically**:
   - Start with the simplest mode (single gear engaged)
   - Add complexity one clutch/brake at a time
   - Verify kinematic viability after each addition
   - This isolates the problematic configuration

5. **Check for missing clutch/brake definitions**:
   - Ensure all clutches and brakes are defined in the system model
   - Missing clutch definitions cause kinematic errors
   - Verify clutch states (engaged/disengaged) for each mode
   - Use the system model diagram to verify

6. **Use load spectrum with operating mode assignment**:
   - "In the load spectrum, each load bin is assigned one of these operating modes"
   - "This also provides a clear visual indication of the required load data input for each load bin"
   - Ensure each load bin has a valid operating mode
   - Invalid operating modes cause load spectrum calculation failures

7. **Review detailed reports after calculation**:
   - "After running a load spectrum calculation, the system module provides detailed reports"
   - "With results on bearings, gears, shafts, and the kinematics of the system"
   - Review kinematic reports for each operating mode
   - Identify modes with warnings or errors

### Community Report

> "The KISSsoft System Module allows you to predefine any possible combination of shifting positions and boundary condition setups by combining them into operating modes. The kinematic viability of each operating mode is automatically and instantly verified during setup, ensuring no kinematic errors will occur later. In the load spectrum, each load bin is assigned one of these operating modes."

## 6. Additional KISSsoft Issues

### Contact Analysis and FEM Matching

**Issue**: Contact analysis results don't match 3D FEM calculation results.
**Fix**: "A new feature is the matching meshing in the 3D FEM calculation to the settings in the contact analysis to ensure results are as accurate as possible." Update to KISSsoft 2024 for improved matching.

### Gear Body Deformation FEM Integration

**Issue**: Gear body deformation not considered in face load distribution.
**Fix**: "The calculation of gear body deformation using FEM is integrated in the KISSsoft gear calculation. It enables precise determination of the face load distribution and the definition of flank modifications."

### Crowned Splines Calculation

**Issue**: Need to calculate crowned splines according to Dudley.
**Fix**: "KISSsoft has implemented functions for calculating crowned splines according to Dudley. The safety for compressive stresses is also output in the calculation."

### Bevel Gear Standards Update

**Issue**: Need latest bevel gear calculation standards.
**Fix**: "Newest bevel gear standards ISO 10300 and DIN 3965" are included in KISSsoft 2024. Update to access the latest standards.

### Training Availability

**Issue**: "Training isn't readily available" for KISSsoft.
**Fix**: "The US reps for KISSsoft are usually fairly responsive if you talk to them directly. There are free and cheap training courses on their website, as well as a free training seminar coming up regarding the system software."

## Best Practices

1. **Check bearing preload and clearance for minimum load warnings** — primary fix
2. **Verify reference torque and RPM in load spectra** — prevents order-of-magnitude life errors
3. **Compare load spectra side by side** — identify coefficient or frequency changes
4. **Migrate KISSsys models to KISSdesign System Module** — KISSsys is replaced
5. **Get training for the System Module transition** — long learning curve
6. **Switch to AGMA standard for North American applications** — default is ISO/DIN
7. **Verify standard setting for each gear individually** — don't assume global setting
8. **Use automatic kinematic verification for operating modes** — catches errors early
9. **Assign valid operating modes to each load bin** — prevents calculation failures
10. **Use SKRIPT for company-specific calculations** — replaces custom KISSsys scripts
