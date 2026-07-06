---
title: "Optitex Made-to-Measure (MTM): Custom Sizing, Body Measurement Integration, and Personalized Fit"
excerpt: "Optitex's MTM module generates custom-sized patterns from individual body measurements. I cover the measurement input workflow, grade rule adaptation for custom sizes, 3D fit validation for MTM garments, and production workflow for personalized apparel."
category: "workflow"
softwareSlug: "optitex"
keyword: "Optitex made-to-measure MTM custom sizing body measurement personalized fit production workflow"
slug: "optitex-made-to-measure-custom-sizing-body-measurement-personalized-fit"
author: "CAD IT Admin"
readTime: "10 min"
date: "2025-06-29"
sources:
  - "https://help.optitex.com/"
  - "https://www.optitex.com/made-to-measure/"
---

# Optitex Made-to-Measure (MTM): Custom Sizing, Body Measurement Integration, and Personalized Fit

I've implemented Optitex MTM workflows for uniform programs and custom apparel services. Made-to-measure (MTM) is one of the fastest-growing segments in apparel — customers increasingly expect personalized fit, and Optitex's MTM module enables pattern generation from individual body measurements without manual pattern adjustment for each order.

## What Is Made-to-Measure?

Made-to-measure differs from both ready-to-wear (RTW) and bespoke:

- **Ready-to-wear (RTW)**: Standard sizes (S, M, L, XL) — no customization
- **Made-to-measure (MTM)**: Base pattern adjusted to individual measurements — automated pattern generation
- **Bespoke**: Fully custom pattern drafted from scratch — manual, time-intensive

MTM sits between RTW and bespoke — it uses a base pattern and automatically adjusts it to individual measurements, providing near-bespoke fit at near-RTW cost.

## Optitex MTM Overview

Optitex's MTM capabilities include:
- **Measurement-driven pattern generation**: Input body measurements, get a custom pattern
- **Base pattern setup**: Define which measurements drive which pattern adjustments
- **3D fit validation**: Simulate the MTM garment on a custom avatar
- **Batch processing**: Generate patterns for multiple customers simultaneously
- **Integration with body scanners**: Import 3D body scan measurements directly

## Setting Up MTM

### Step 1: Create the Base Pattern

1. Design the base pattern in Optitex Pattern Design
2. The base pattern is typically drafted in a standard size (e.g., M or size 40)
3. The base pattern should be production-ready with all seams, darts, and details

### Step 2: Define MTM Measurement Points

1. Go to **MTM Setup** (Tools → MTM Setup)
2. Define the body measurements that drive pattern adjustments:
   - **Chest circumference**: Drives the chest width on the pattern
   - **Waist circumference**: Drives the waist width
   - **Hip circumference**: Drives the hip width
   - **Shoulder width**: Drives the shoulder measurement
   - **Arm length**: Drives the sleeve length
   - **Body length**: Drives the garment length
   - **Neck circumference**: Drives the neckline size
   - **Bicep circumference**: Drives the sleeve width
3. Each measurement is linked to specific pattern points and edges

### Step 3: Define Adjustment Rules

1. For each measurement, define how the pattern adjusts:
   - **Linear adjustment**: The pattern grows or shrinks proportionally
   - **Non-linear adjustment**: The pattern adjusts with curve modifications
   - **Conditional rules**: If measurement > threshold, apply specific adjustment
2. Example rules:
   - **Chest +5cm**: Add 2.5cm to each side of the front and back body
   - **Waist -3cm**: Reduce 1.5cm from each side at the waistline
   - **Arm length +2cm**: Extend the sleeve pattern by 2cm at the cuff
3. Set adjustment limits:
   - **Minimum adjustment**: How much the pattern can shrink
   - **Maximum adjustment**: How much the pattern can grow
   - Beyond these limits, the base pattern may not work (too much distortion)

### Step 4: Define Measurement Constraints

1. Set constraints to prevent impossible measurements:
   - Waist cannot be larger than chest (for most garments)
   - Arm length must be within anatomical range
   - Hip must be within a range relative to waist
2. These constraints prevent pattern distortion from invalid measurements

## MTM Order Workflow

### Step 1: Input Customer Measurements

1. Open the **MTM Order** module
2. Enter the customer's measurements:
   - Manual entry: Type in each measurement value
   - Body scanner import: Import measurements from a 3D body scan
   - CSV import: Batch import measurements for multiple customers
3. Verify measurements are within the defined constraints

### Step 2: Generate the Custom Pattern

1. Click **Generate Pattern**
2. Optitex applies the adjustment rules to the base pattern
3. The custom pattern is generated in seconds
4. Review the generated pattern:
   - Check that all adjustments were applied correctly
   - Verify seam lengths still match
   - Check for pattern distortion

### Step 3: 3D Fit Validation

1. Create a custom avatar from the customer's measurements:
   - Input the body measurements into the avatar generator
   - Optitex creates a 3D body matching the customer's dimensions
2. Simulate the MTM garment on the custom avatar
3. Check the tension map:
   - Red areas: Too tight — adjust the measurement rules
   - Blue areas: Too loose — adjust the measurement rules
4. Verify measurements match the spec
5. If fit issues are found, adjust the rules and regenerate

### Step 4: Generate the Marker

1. The MTM pattern is a single size (custom)
2. Create a marker for the custom pattern:
   - If cutting one garment: Single-piece marker
   - If cutting multiple MTM orders: Combine multiple custom sizes on one marker
3. Optimize marker efficiency for the custom sizes

### Step 5: Export for Cutting

1. Export the custom pattern as DXF-AAMA
2. Send to the cutting machine
3. The custom garment is cut and sewn like any other

## Body Scanner Integration

### Supported Body Scanners

Optitex integrates with major 3D body scanning systems:
- **[TC]2**: Retail body scanners
- **SizeStream**: Mobile body scanning
- **Styku**: Retail body scanning
- **3DLook**: Mobile body measurement from photos

### Scanner Integration Workflow

1. Customer is scanned by the body scanner
2. The scanner outputs body measurements
3. Measurements are imported into Optitex MTM
4. The custom pattern is generated automatically
5. The garment is produced and shipped to the customer

This enables a fully automated MTM process:
1. Customer walks into a store or uses a mobile app
2. Body is scanned (30 seconds to 2 minutes)
3. Customer selects a style and fabric
4. Pattern is generated and sent to production
5. Garment is delivered in 1-2 weeks

## MTM Business Models

### Uniform Programs

1. Set up base patterns for uniform styles (military, corporate, school)
2. Measure each individual (body scanner or manual)
3. Generate custom patterns for each person
4. Produce uniforms with individualized fit
5. Store measurements for re-ordering

### Online MTM Retail

1. Customer enters measurements on a website (or uses mobile scanning)
2. Measurements are sent to Optitex MTM via API
3. Custom pattern is generated
4. Pattern is sent to production
5. Custom-fit garment is shipped

### In-Store MTM

1. Store has a body scanner or measuring station
2. Customer is measured
3. Sales associate selects style and fabric
4. Pattern is generated in-store
5. Order is sent to production

## Common MTM Issues

### Pattern Distortion at Extreme Sizes

- Set realistic adjustment limits
- Create multiple base patterns for different size ranges (small, medium, large base)
- Use conditional rules to switch base patterns at size thresholds
- Test the extremes of the measurement range

### Seam Lengths Don't Match After MTM Adjustment

- Check that adjustment rules maintain seam length relationships
- Add seam matching constraints to the MTM rules
- Test with various measurement combinations

### Fit Issues in 3D Simulation

- Adjust the measurement rules based on 3D analysis
- Add more measurement points for better fit control
- Consider adding posture measurements (shoulder angle, forward shoulder)
- Iterate the rules based on physical fitting feedback

### Customer Measurements Are Inaccurate

- Use body scanners instead of manual measurement
- Add measurement validation (check for anatomically impossible values)
- Provide clear measurement instructions for self-measurement
- Offer in-store measurement as an alternative

## Summary

Optitex's MTM module generates custom-sized patterns from individual body measurements. Set up the base pattern, define which measurements drive which adjustments, and set adjustment rules with limits. The MTM order workflow is: input measurements (manual, scanner, or CSV), generate the custom pattern, validate fit on a custom 3D avatar, create a marker, and export for cutting. Body scanner integration enables a fully automated MTM process from scan to production. The most common issues — pattern distortion, seam mismatches, and fit problems — are addressed by setting realistic adjustment limits, adding seam matching constraints, and iterating rules based on 3D and physical fitting feedback. MTM is ideal for uniform programs, online custom apparel, and in-store made-to-measure services.
