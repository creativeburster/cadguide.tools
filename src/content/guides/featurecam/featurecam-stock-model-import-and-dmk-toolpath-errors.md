---
title: "FeatureCAM Stock Model Import and DMK Toolpath Errors"
excerpt: "FeatureCAM Stock Model Import and DMK Toolpath Errors: symptoms, root causes, and step-by-step fixes, verified against Autodesk Community and Practical Machinist."
category: "manufacturing"
softwareSlug: "featurecam"
keyword: "FeatureCAM 5-axis simulation workpiece repositioned cutter through part add-in toolpath round stock import offset oversized OD STEP orientation DMK toolpath error TPDMK01 feature depth overridden stock solid limits casting stock multibody solid UCCNC post processor Fanuc xBuild"
slug: "featurecam-stock-model-import-and-dmk-toolpath-errors"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://forums.autodesk.com/t5/featurecam-forum/milling-cutter-moves-through-part-in-simulation-but-toolpath/td-p/13163078"
  - "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/DMK-Toolpath-Error-when-using-stock-solid-in-FeatureCAM.html"
  - "https://www.practicalmachinist.com/forum/threads/featurecam-model-stock-question.441158/"
---

# FeatureCAM Stock Model Import and DMK Toolpath Errors: 5-Axis Simulation Workpiece Repositioned Causing Cutter Through Part from Add-In Toolpath Feature, Round Stock Import Gives Offset Oversized OD Never Asking for Sizing from STEP Export Orientation, DMK Toolpath Error TPDMK01 from Feature Depth Overridden Past Stock Solid Limits, Casting as Stock Requires Multibody Solid or Separate Import with Alignment, and UCCNC Post Processor Not Available Requiring Fanuc Base Customization in xBuild

FeatureCAM's stock model import, 5-axis simulation, DMK toolpaths, and post processor availability produce errors from orientation mismatches, stock definition limits, and missing post configurations. This guide covers the 5 most common FeatureCAM problems with diagnostic steps and community-verified fixes from Autodesk Community and Practical Machinist.

## 1. 5-Axis Simulation Workpiece Repositioned Causing Cutter Through Part

### Symptom

A toolpath feature created by an add-in has correct toolpath points (X, Y, Z, I, J, K are correct). But in simulation, the workpiece position suddenly changes at one point, causing the cutter to pass through the workpiece. Five axes are used — instead of rotating the workpiece, it is repositioned around the cutter and then milled correctly.

### Root Cause

The add-in generates toolpath points correctly but doesn't properly handle the 5-axis kinematic transformation. The simulation engine interprets the rotary axis moves differently from the toolpath points. At a specific transition point, the workpiece coordinate system shifts, causing the simulation to show the cutter passing through the part even though the actual toolpath coordinates are correct.

### Fix

1. **Verify toolpath points are truly correct**:
   - Check X, Y, Z, I, J, K values at the transition point
   - Compare with expected values from the add-in documentation
   - The issue is in simulation interpretation, not toolpath generation

2. **Check rotary axis limits**:
   - The repositioning may occur when a rotary axis reaches its limit
   - The controller wraps around, but simulation doesn't handle this
   - Check machine configuration for rotary axis limits
   - Adjust toolpath to avoid axis limit transitions

3. **Use a different simulation mode**:
   - Try machine simulation vs. stock simulation
   - Some simulation modes handle 5-axis kinematics differently
   - Compare results between modes

4. **Contact the add-in developer**:
   - The issue is specific to add-in-generated toolpaths
   - Native FeatureCAM toolpaths may not exhibit this behavior
   - Report the issue with the toolpath point data and simulation screenshots

5. **Manually verify on the machine**:
   - If toolpath points are correct, the actual machining may be fine
   - The simulation issue may be cosmetic
   - Use air cutting to verify on the actual machine
   - Check the posted G-code for correct rotary moves

### Community Report

> "The toolpath points all seem to have been created correctly, but in the simulation the position of the workpiece is suddenly changed at one point, causing the cutter to pass through the workpiece. Five axes are used and instead of rotating the workpiece, it is repositioned around the cutter."

## 2. Round Stock Import Gives Offset Oversized OD

### Symptom

Importing a STEP file from Fusion 360 into FeatureCAM. Choosing round stock, FeatureCAM gives an offset and oversized OD of stock. It never asks for any sizing. The model orientation is wrong — needs to be rotated.

### Root Cause

FeatureCAM's stock wizard auto-detects stock from the imported model's bounding box. When the STEP file's coordinate system doesn't match the expected orientation, the bounding box is calculated incorrectly, producing oversized stock. The round stock option calculates from the model's maximum diameter, but if the model is oriented sideways, the diameter is wrong.

### Fix

1. **Orient the model correctly before import**:
   - In Fusion 360, ensure the Z-axis aligns with the part's rotational axis
   - Export the STEP file with the correct orientation
   - Re-export with proper orientation

2. **Use manual stock definition after import**:
   - Import the model without auto-stock
   - After import, manually define stock:
   - Stock type: Round
   - Length: 5" (or desired)
   - Diameter: same as full end of model
   - This overrides the auto-detected stock

3. **Use the Transform tool to reorient**:
   - After import, use Transform > Rotate to orient the model
   - Rotate to match the desired machining orientation
   - Then define stock manually

4. **Import as a multibody solid**:
   - In Fusion 360, create a multibody solid with the part and stock
   - Export both as a single STEP file
   - Import into FeatureCAM
   - Use one body as the part, the other as stock

5. **Check STEP export settings**:
   - In Fusion 360 STEP export options:
   - Set structure: Single body per file
   - Set units to match FeatureCAM expectations
   - Ensure the origin is at the desired stock center

### Community Report

> "Trying to import this and choose round stock, and FC just cannot figure out what to do. It gives me an offset and oversized OD of stock, never asks me for any sizing. Model was drawn in F360 and exported as a step."

## 3. DMK Toolpath Error TPDMK01 from Feature Depth Overridden Past Stock Solid

### Error Message

"Error: TPDMK01: DMK toolpath error"

### Symptom

When using a user-defined stock solid with a DMK toolpath (3D strategies: NT Spiral, NT Zig-Zag, NT Continuous Spiral, Vortex), the toolpath fails with TPDMK01 error. The error occurs when the feature's depth is overridden past the limits of the stock solid.

### Root Cause

DMK toolpaths require the tool tip to be in contact with the material for adding a rough pass. If the feature depth extends beyond the stock solid boundaries, the DMK algorithm can't calculate the rough pass and fails. This only happens with user-defined stock solids — block/round/N-sided stock types don't have this limitation.

### Fix

1. **Use a non-DMK strategy**:
   - Switch from NT Spiral/Zig-Zag to standard Spiral or Zig-Zag
   - These don't have the DMK limitation with stock solids

2. **Alter the stock solid to encompass the feature**:
   - Extend the stock solid in the Z-direction
   - Ensure the stock covers the full feature depth
   - Re-import the modified stock solid

3. **Alter the feature dimensions**:
   - Reduce the feature depth to stay within the stock solid
   - Machine the remaining depth in a separate operation

4. **Change stock type from User Defined to Block/Round/N-Sided**:
   - These stock types don't have the DMK limitation
   - Trade-off: less precise stock definition

5. **Uncheck Equal Depth of Cut**:
   - In the feature's Misc tab, uncheck "Equal depth of cut"
   - This allows the toolpath to calculate with variable depth cuts

### Community Report

> "Error: TPDMK01: DMK toolpath error. Conditions: feature's depth is overridden past the limits of that stock solid, DMK toolpath is used, project uses a User-defined stock. The tool tip needs to be in contact with the material for adding a rough pass."

## 4. Casting as Stock Requires Multibody Solid or Separate Import

### Symptom

Have a model of a casting and a model of the finished part. Need to bring in the casting model as stock when programming the part. Unclear how to define the casting as the starting stock for all machining operations.

### Root Cause

FeatureCAM has two stock concepts: "Stock definition" (applies to all features) and "Stock model" (applies to individual features). The user needs the casting as the stock definition for all features, not a per-feature stock model. Importing two separate solids requires aligning them correctly, which FeatureCAM's tools handle less well than a dedicated CAD program.

### Fix

1. **Combine casting and part in one multibody solid**:
   - In CAD software (Fusion 360, SolidWorks, etc.):
   - Create the casting and part as separate bodies in one file
   - Align them properly in the CAD software
   - Export as a single STEP file with both bodies

2. **Import and align in FeatureCAM**:
   - Import the multibody STEP file

3. **Import separately and align individually**:
   - Import the part STEP file
   - Import the casting STEP file
   - Use FeatureCAM's alignment tools to position both
   - Define the casting as stock

4. **Understand Stock Definition vs. Stock Model**:
   - Use Stock Definition for the casting — applies to all features
   - Don't use Stock Model for this purpose

5. **Use Stock Model for per-feature stock**.

### Community Report

> "The best method I found is to combine the casting and the part in one model using multibody solids, and then bring that into FC. Do your part alignment to your finished part, accept the defaults for the stock, and when all is done in the STOCK definition, change to the casting as the stock."

## 5. UCCNC Post Processor Not Available Requiring Fanuc Base

### Symptom

Using FeatureCAM for CAM on a Stepcraft m700 machine with UCCNC controller. No post processor is available for UCCNC. Need to create or customize a post processor but don't have experience with post editing.

### Root Cause

FeatureCAM doesn't include a UCCNC-specific post processor. UCCNC is a CNC controller software used on various DIY and entry-level machines. FeatureCAM includes post processors for common controllers (Fanuc, Haas, Siemens, etc.) but not for UCCNC. UCCNC's G-code format is similar to Fanuc, so a Fanuc post can be used as a base.

### Fix

1. **Start with a Fanuc post processor**:
   - Look in: `(install drive):\Program Files\Autodesk\FeatureCAM 2025\Posts\Mill\3-Axis`
   - Find a Fanuc 3-axis post processor
   - Copy and rename it for UCCNC

2. **Edit the post in xBuild**:
   - Open xBuild from FeatureCAM

3. **Key modifications for UCCNC**:
   - Check line numbering format (UCCNC may use N-word or no line numbers)
   - Verify arc format (G2/G3 with R or I/J)
   - Check feed rate format (F-word)
   - Verify spindle speed format (S-word)
   - Check tool change format (M6, T-word)
   - Remove unsupported G-codes

4. **Test with simple toolpaths**:
   - Create a simple rectangular pocket
   - Post process with the modified post
   - Run in UCCNC simulation mode first
   - Verify all G-code is accepted

5. **Contact FeatureCAM support**:
   - FeatureCAM support may have unofficial UCCNC posts
   - Check the FeatureCAM forum for user-contributed posts
   - Post a request on the Autodesk FeatureCAM Forum

6. **Use a generic G-code post as alternative**:
   - If Fanuc base doesn't work
   - Try a generic G-code post (G-Code Output)
   - This produces minimal G-code without controller-specific features
   - May require manual editing of the posted file

### Community Report

> "We got our hands on a Stepcraft m700. We do all our CAM on FeatureCAM and I am unable to find a post processor for UCCNC. UCCNC should be close to a Fanuc post processor. Editing a post can be done using xBuild."

## 6. Additional FeatureCAM Issues

### Feature Recognition on Complex Parts

**Issue**: Feature recognition doesn't correctly identify all features on complex parts.
**Fix**: Use manual feature creation for complex geometry. Break the part into simpler sub-parts. Check feature recognition settings (tolerance, minimum feature size).

### Vortex Toolpath on Small Features

**Issue**: Vortex (high-efficiency roughing) fails or takes too long on small features.
**Fix**: Vortex is a DMK strategy — check for TPDMK01 error conditions. Use standard spiral for small features. Ensure stock solid encompasses the feature depth.

### Post Processor for Custom Machines

**Issue**: No post processor available for a specific machine/controller.
**Fix**: Find the closest matching post in the Posts folder. Use xBuild to customize. Test with simple toolpaths first. Contact FeatureCAM support for assistance.

### Stock Model from Previous Operations

**Issue**: Need to use remaining stock from a previous operation as stock for the next operation.
**Fix**: "Create a stock model from an operation or multiple operations." Use this as the stock model for the next feature. This is per-feature stock, not global stock definition.

## Best Practices

1. **Orient STEP files correctly before import** — prevents stock detection errors
2. **Use multibody solids for casting + part** — easiest stock definition workflow
3. **Define casting as Stock Definition, not Stock Model** — applies to all features
4. **Check feature depth vs. stock solid limits** — prevents DMK TPDMK01 error
5. **Uncheck Equal Depth of Cut for DMK errors** — quick fix for TPDMK01
6. **Use non-DMK strategies as fallback** — Spiral/Zig-Zag don't have DMK limitations
7. **Start with Fanuc post for UCCNC** — closest match in the Posts folder
8. **Test custom posts with simple toolpaths** — verify before production use
9. **Verify 5-axis simulation against actual G-code** — simulation may show false collisions
10. **Contact support for missing post processors** — they may have unofficial versions
