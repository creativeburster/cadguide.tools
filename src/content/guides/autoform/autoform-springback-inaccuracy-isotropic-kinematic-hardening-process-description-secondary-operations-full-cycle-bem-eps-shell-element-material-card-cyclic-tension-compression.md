---
title: "AutoForm Springback Inaccuracy from Isotropic Hardening Model, Process Description Influencing Springback from Missing Secondary Operations, Element Type Selection BEM vs EPS for Springback Accuracy, Material Card Default vs Experimentally Calibrated Parameters, and Backdraft from Geometric Springback Compensation: Kinematic Hardening, Full Cycle Simulation, EPS-11 Shell Element, Cyclic Tension-Compression Test, and Coining with TS-11 Thick Shell"
excerpt: "AutoForm fails for 5 distinct reasons: springback inaccuracy from isotropic hardening model requiring kinematic hardening with calibrated parameters, process description influencing springback from missing secondary operation tool closure requiring full cycle simulation, element type BEM vs EPS selection affecting springback accuracy requiring EPS-11 shell elements, material card default parameters underestimating springback requiring cyclic tension-compression test calibration, and backdraft from geometric springback compensation requiring coining with TS-11 thick shell element. We cover each with fixes from AutoForm documentation and research."
category: "springback-and-simulation-accuracy-errors"
softwareSlug: "autoform"
keyword: "AutoForm springback inaccuracy isotropic hardening kinematic hardening process description secondary operations full cycle simulation BEM EPS shell element material card default parameters cyclic tension-compression test backdraft geometric compensation coining TS-11 thick shell"
slug: "autoform-springback-inaccuracy-isotropic-kinematic-hardening-process-description-secondary-operations-full-cycle-bem-eps-shell-element-material-card-cyclic-tension-compression"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://www.autoform.com/en/how-the-process-description-influences-springback-results/"
  - "https://formingworld.com/numisheet-2025-industrial-benchmark/"
  - "https://formingworld.com/early-evaluation-springback-steps/"
---

# AutoForm Springback Inaccuracy from Isotropic Hardening Model, Process Description Influencing Springback from Missing Secondary Operations, Element Type Selection BEM vs EPS for Springback Accuracy, Material Card Default vs Experimentally Calibrated Parameters, and Backdraft from Geometric Springback Compensation: Kinematic Hardening, Full Cycle Simulation, EPS-11 Shell Element, Cyclic Tension-Compression Test, and Coining with TS-11 Thick Shell

AutoForm produces errors from springback inaccuracy, process description gaps, element type selection, material parameter calibration, and backdraft from compensation. This guide covers the 5 most common AutoForm problems with diagnostic steps and community-verified fixes from AutoForm documentation and research.

## 1. Springback Inaccuracy from Isotropic Hardening Model

### Symptom

Springback simulation results don't match physical measurements. The simulated springback is significantly less than the actual springback observed in tryout. The material is high-strength steel or aluminum, which is more affected by springback than conventional deep-drawn steel. Using AutoForm's default material card doesn't improve accuracy.

### Root Cause

"Standard isotropic and generic kinematic models underestimate elastic recovery, whereas the experimentally derived parameters have a significant influence on both the magnitude and directional response of springback." The isotropic hardening model doesn't account for the Bauschinger effect (early re-yielding during reverse loading). During forming, the material undergoes cyclic loading (tension followed by compression in bending), which the isotropic model can't capture. This leads to underestimation of elastic recovery and inaccurate springback prediction.

### Fix

1. **Use kinematic hardening with calibrated parameters**:
   - "Experimentally derived parameters have a significant influence"
   - "On both the magnitude and directional response of springback"
   - Switch from isotropic to kinematic hardening
   - In the material model settings

2. **Perform cyclic tension-compression tests**:
   - "Cyclic tension-compression tests conducted at two natural aging times"
   - Test the actual material under cyclic loading
   - To obtain the kinematic hardening parameters
   - Including Young's modulus reduction factor (gamma), reduction rate (chi), and transient softening rate (K)

3. **Calibrate material parameters**:
   - "Key kinematic hardening parameters derived from cyclic tension-compression tests"
   - "Including the Young's modulus reduction factor (gamma)"
   - "Young's modulus reduction rate (chi), and transient softening rate (K)"
   - Use point-by-point fitting to identify these parameters

4. **Use experimentally calibrated material card**:
   - "AutoForm's default material card" underestimates springback
   - Replace the default material card
   - With one calibrated from actual test data
   - For the specific material and temper

5. **Account for natural aging time**:
   - "The natural aging time strongly affects constitutive model performance"
   - For aluminum alloys, the aging time
   - Affects the material parameters
   - Test at the correct aging condition

6. **Use AutoForm's material calibration tools**:
   - AutoForm provides tools for material parameter identification
   - Use the cyclic test data
   - To generate a calibrated material card
   - That captures the Bauschinger effect

7. **Validate against benchmark geometries**:
   - "Numisheet 2022 benchmark related to the springback prediction"
   - Validate the calibrated material model
   - Against known benchmark cases
   - Before applying to production parts

### Community Report

> "Standard isotropic and generic kinematic models underestimate elastic recovery, whereas the experimentally derived parameters have a significant influence on both the magnitude and directional response of springback. The findings highlight the importance of accurate cyclic material characterization and demonstrate that the natural aging time strongly affects constitutive model performance."

## 2. Process Description Influencing Springback from Missing Secondary Operations

### Symptom

Springback simulation results differ significantly depending on the process setup. Setup A (simple trimming) gives different springback than Setup B (full cycle with segmented trimming). The difference is unexpected because the trimming operation shouldn't affect springback. The part is a high-strength steel or aluminum panel with flanging operations.

### Root Cause

"The main difference between setups A and B is the tool kinematics of the secondary operations. A potential cause for different results could be a certain amount of plastic deformation during tool closure in the trimming operations T30 and T40." In Setup A, tool closure at secondary operations is not simulated — only the cutting is performed. In Setup B (full cycle simulation), the tool closure is simulated, which introduces slight bending deformation at the radii. This bending deformation causes additional springback that doesn't appear in Setup A. "Elastic-plastic bending deformations result in distinguishable geometry deviation due to springback."

### Fix

1. **Use full cycle simulation**:
   - "This precise representation of the complete process is called a full cycle simulation"
   - Include all secondary operations
   - With proper tool kinematics
   - Don't simplify by skipping tool closure

2. **Simulate tool closure at secondary operations**:
   - "Plastic deformation occurs during tool closure"
   - "The plastic strain rate is analyzed at closing of pad and post"
   - Include pad and post closure
   - In trimming and flanging operations

3. **Use segmented trimming**:
   - "The trimming and piercing process is split up"
   - "Segmented trimming T30, T40"
   - Simulate each trimming stage separately
   - With proper tool kinematics

4. **Activate Locating/Gravity for secondary operations**:
   - "Activating Locating/Gravity, Free Springback at End of Operation"
   - "And using Cutting with Tools to all secondary trimming and forming operations"
   - "Is essential to getting the most accurate result possible"
   - These settings relax stresses between operations

5. **Analyze plastic strain rate at tool closure**:
   - "The plastic strain rate is not only analyzed at the middle layer"
   - "But also at the top and bottom layers of the sheet"
   - Check if plastic deformation occurs
   - During tool closure at secondary operations

6. **Use consistent process setup**:
   - "In order to obtain reliable springback results"
   - "The correct process conditions must be considered"
   - "The process setup must be studied carefully and described correctly"
   - Don't mix simplified and full cycle setups

7. **Match simulation to press shop process**:
   - "Setup B is similar to the process setup in a press shop"
   - "The five images represent drawing, segmented trimming T30, T40, flanging and springback"
   - Model the actual press shop process
   - Including all tool movements

### Community Report

> "Springback results show differences based on their simulation setups. The main difference between setups A and B is the tool kinematics of the secondary operations. A certain amount of plastic deformation during tool closure in the trimming operations T30 and T40. In order to obtain reliable springback results, the correct process conditions must be considered, i.e., the process setup must be studied carefully and described correctly in the simulation."

## 3. Element Type Selection BEM vs EPS for Springback Accuracy

### Symptom

Springback analysis results vary significantly depending on the FE settings. Using Concept Evaluation (CE) with BEM elements gives different springback than Concept Evaluation Plus (CE+) or Final Validation (FV) with EPS elements. The BEM results are less accurate but faster. The EPS results are more accurate but take significantly longer to compute.

### Root Cause

"Method CE uses the Bending Enhanced Membrane elements (BEM), where these are mostly applied for the first tryout simulations. In contrary CE+ and FV methods use Elastic Plastic Shell elements (EPS). Shells (classical or modified) are more accurate however additional time for the computation is required." BEM elements are membrane elements with bending enhancement — they don't capture through-thickness stress distribution accurately. EPS shell elements capture the full shell behavior, including through-thickness stress, which is critical for accurate springback prediction. "It is recommended to use the shell elements (classical or modified) for the springback analysis and for the following compensation."

### Fix

1. **Use EPS shell elements for springback analysis**:
   - "It is recommended to use the shell elements (classical or modified)"
   - "For the springback analysis and for the following compensation"
   - Use CE+ or FV settings
   - For springback-critical simulations

2. **Use BEM for early feasibility only**:
   - "BEM elements are mostly applied for the first tryout simulations"
   - Use CE with BEM for initial feasibility
   - When springback accuracy is not critical
   - Switch to EPS for final validation

3. **Use FV for final springback validation**:
   - "AutoForm Final Validation (FV) or Concept Evaluation Plus (CE+) settings"
   - "Ensure that the sheet and tool mesh are compatible"
   - "And the proper element type is being used for springback evaluation"
   - Use FV for the most accurate results

4. **Balance speed and accuracy**:
   - "For now, we want to focus on a balance of speed, accuracy, and ease of use"
   - "Not the ultimate goal of 100% accuracy"
   - Use CE+ for early evaluation
   - FV for final validation

5. **Check mesh compatibility**:
   - "Ensure that the sheet and tool mesh are compatible"
   - Incompatible meshes cause inaccurate contact
   - And springback prediction
   - Verify mesh compatibility in FV settings

6. **Consider computation time**:
   - "FE settings highly influences the number of finite elements"
   - "Which results into growth of computation time and data consumption"
   - "When a simulation of e.g. side panel is required"
   - "The time needed for the computation is crucial (usually from 2 to 48 h)"
   - Plan for longer computation with EPS elements

7. **Use TS-11 thick shell for coining**:
   - "The TS-11 thick-shell element also takes into account stresses"
   - "In the direction of the sheet thickness"
   - For coining operations with high normal stresses
   - Use TS-11 instead of standard EPS-11

### Community Report

> "Method CE uses the Bending Enhanced Membrane elements (BEM). In contrary CE+ and FV methods use Elastic Plastic Shell elements (EPS). Shells (classical or modified) are more accurate however additional time for the computation is required. It is recommended to use the shell elements for the springback analysis and for the following compensation. AutoForm Final Validation (FV) or Concept Evaluation Plus (CE+) settings ensure that the sheet and tool mesh are compatible, and the proper element type is being used for springback evaluation."

## 4. Material Card Default vs Experimentally Calibrated Parameters

### Symptom

Springback simulation using AutoForm's default material card doesn't match physical tryout results. The default card underestimates springback for high-strength steels and aluminum alloys. The material file is not available for testing early in development. The user needs accurate springback prediction but doesn't have tested material parameters.

### Root Cause

"An inaccurate material definition can lead to under/over-engineering of problems that may not exist in the actual tool. It is always considered best practice to generate a material file from real testing." AutoForm's default material cards use generic parameters that don't capture the specific material's cyclic behavior. For high-strength steels and aluminum, the default card's isotropic hardening parameters underestimate the Bauschinger effect, leading to springback underestimation. Without tested parameters, the simulation can't accurately predict springback.

### Fix

1. **Generate material file from real testing**:
   - "It is always considered best practice to generate a material file from real testing"
   - Perform uniaxial and cyclic tests
   - On the actual material
   - To generate a calibrated material card

2. **Use material from same project**:
   - "A material file tested from the same material used in a different project"
   - If the exact material isn't available
   - Use a material file from the same alloy
   - From a previous project

3. **Use supplier-provided properties**:
   - "Properties provided by the material supplier"
   - Material suppliers can provide
   - Stress-strain curves and material parameters
   - For their specific materials

4. **Use OEM-provided properties**:
   - "Properties provided by the OEM"
   - If working for an OEM
   - They may have material databases
   - With tested parameters

5. **Calibrate from cyclic tension-compression tests**:
   - "Cyclic tension-compression tests conducted at two natural aging times"
   - "Reverse stress-strain relationships were analyzed using a point-by-point fitting approach"
   - "Enabling the identification of critical parameters"
   - "Including the Young's modulus reduction factor (gamma), reduction rate (chi), and transient softening rate (K)"

6. **Account for natural aging in aluminum**:
   - "The natural aging time strongly affects constitutive model performance"
   - For aluminum alloys
   - Test at the correct natural aging condition
   - That matches the production timeline

7. **Update material card as material becomes available**:
   - "Early in development, the material is typically not available for testing"
   - "So alternatives need to be considered"
   - Start with default or supplier properties
   - Update with tested parameters when available

### Community Report

> "An inaccurate material definition can lead to under/over-engineering of problems that may not exist in the actual tool. It is always considered best practice to generate a material file from real testing. Early in development, the material is typically not available for testing so alternatives need to be considered, including: a material file tested from the same material used in a different project; properties provided by the material supplier; or properties provided by the OEM."

## 5. Backdraft from Geometric Springback Compensation

### Symptom

After applying geometric springback compensation to the tool, the part develops backdraft in two opposite walls. The backdraft makes the part unreleasable — there's no tipping direction that releases both sides simultaneously. A purely geometric compensation creates this new issue, making the tool unusable. The part is formed from high-strength steel or stainless steel with significant springback.

### Root Cause

"When two opposite walls become backdraft and remain parallel, there is no tipping direction that releases both sides at the same time. In other words: this backdraft cannot be fixed by tipping—so a purely geometric compensation is not feasible here." Geometric springback compensation adjusts the tool geometry to counteract springback. However, when the springback is large, the compensation can overcorrect, creating backdraft (negative draft angle) in the tool. This makes the part impossible to remove from the tool, as both walls grip the part.

### Fix

1. **Use coining to reduce springback**:
   - "To reduce springback—and keep the part releasable despite backdraft risk—we used coining"
   - "The radii are pressed with an offset smaller than the sheet thickness"
   - "This introduces high normal stresses, which reduce the bending moment through the thickness"
   - "And therefore reduce springback"

2. **Use TS-11 thick shell element for coining simulation**:
   - "To capture these normal-stress effects in the simulation"
   - "We used the TS-11 thick-shell element"
   - "Unlike the standard EPS-11 AutoForm shell element"
   - "The Thick Shell Element (TS-11) also takes into account stresses in the direction of the sheet thickness"

3. **Run RSPI study for process robustness**:
   - "We ran an RSPI (Robust Sigma Process Improvement) study in AutoForm Sigma"
   - "Where key inputs can be systematically varied"
   - "By sweeping uncontrollable factors (thickness, yield stress, blank position, etc.)"
   - "We quantified process robustness and then tuned the controllable levers"

4. **Optimize coining radii**:
   - "Tuned the controllable levers—here, the Coining Radii—towards a more stable window"
   - "The RSPI study defines the process window for the optimized coining radii"
   - "Within this window, the process stays robust"
   - "And springback remains geometrically compensatable"

5. **Use AutoForm Compensator for iterative compensation**:
   - "We used AutoForm Compensator to compensate the crash-forming tool"
   - "Based on the deviation between the target geometry and the springback result"
   - "Compensation is inherently iterative: simulate with the updated tools"
   - "Reassess the remaining deviation, and repeat until the gap to the STL is closed"

6. **Form as double part to maximize material utilization**:
   - "Because the T-Node is used as both a left- and right-hand part"
   - "We formed it as a double part to maximize sheet usage"
   - Forming as a double part
   - Can reduce springback asymmetry

7. **Use AutoForm Trimline Optimization**:
   - "The form blank was defined with AutoForm Trimline Optimization"
   - "After crash forming, the two parts were separated"
   - Optimize the trim line
   - To minimize material waste while achieving target geometry

### Community Report

> "Straightforward geometric compensation created a new issue: backdraft in two opposite walls. When two opposite walls become backdraft and remain parallel, there is no tipping direction that releases both sides at the same time. To reduce springback—and keep the part releasable despite backdraft risk—we used coining. The radii are pressed with an offset smaller than the sheet thickness. This introduces high normal stresses, which reduce the bending moment through the thickness—and therefore reduce springback. To capture these normal-stress effects, we used the TS-11 thick-shell element."

## 6. Additional AutoForm Issues

### Gap-Controlled vs Force-Controlled Binder

**Issue**: How to manage clearance and binder gaps in the draw die.
**Fix**: "If spacing is used on the blank holder, it's best to incorporate a gap-controlled binder, using extra gap as needed. If no spacing will be used in die tryout, instead use a force-controlled binder with the appropriate tool stiffness value."

### Tool Surface Modeling

**Issue**: "Areas that this may refer to include: Pad contact near break lines and trim lines; Radii that are not forming the sheet, escaped or adjusted before try-out."
**Fix**: Model all tool surfaces that contact the sheet in simulation. Include pad contact, trim line radii, and adjusted radii. Don't simplify the tool geometry.

### Early Springback Evaluation

**Issue**: "Traditionally, springback compensation is performed at the very end of the stamping simulation process."
**Fix**: "This risk can be mitigated early on by taking a more thorough approach to springback evaluation and checking the process window." Evaluate springback early in development to avoid costly late changes.

### AutoForm Sigma for Robustness

**Issue**: How to ensure process robustness in production.
**Fix**: "We ran an RSPI (Robust Sigma Process Improvement) study in AutoForm Sigma, where key inputs can be systematically varied. By sweeping uncontrollable factors, we quantified process robustness and then tuned the controllable levers towards a more stable window."

### Numisheet Benchmark Validation

**Issue**: How to validate springback prediction accuracy.
**Fix**: "The experimentally calibrated parameters were implemented in forming simulations of the Numisheet 2022 benchmark related to the springback prediction of a twist die panel." Use Numisheet benchmarks to validate material models and simulation settings.

### Crash Forming for Material Utilization

**Issue**: "Material utilization is a key scoring criterion in this benchmark."
**Fix**: "We built the process around crash forming. Because the T-Node is used as both a left- and right-hand part in the vehicle, we formed it as a double part to maximize sheet usage."

### AutoForm ProcessDesigner for Tool Creation

**Issue**: How to incorporate optimized coining radii into the tool.
**Fix**: "We incorporated the optimized coining radii into the upper tool using AutoForm ProcessDesigner." Use ProcessDesigner to create tool geometry from simulation results.

## Best Practices

1. **Use kinematic hardening with calibrated parameters** — isotropic model underestimates springback
2. **Perform cyclic tension-compression tests** — obtain gamma, chi, and K parameters
3. **Use full cycle simulation** — include all secondary operations with tool closure
4. **Use EPS shell elements for springback** — BEM is for early feasibility only
5. **Use FV settings for final validation** — ensures mesh compatibility and proper element type
6. **Generate material file from real testing** — default card underestimates springback
7. **Use coining to reduce springback before compensation** — prevents backdraft
8. **Use TS-11 thick shell for coining simulation** — captures through-thickness stresses
9. **Run RSPI study for process robustness** — defines the process window
10. **Evaluate springback early in development** — avoids costly late changes
