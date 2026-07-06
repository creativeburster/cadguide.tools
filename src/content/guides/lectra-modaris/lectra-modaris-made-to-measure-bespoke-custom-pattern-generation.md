---
title: "Lectra Modaris Made-to-Measure: Custom Pattern Generation for Bespoke and Luxury Apparel"
excerpt: "Modaris Expert's MTM module generates bespoke patterns from individual body measurements with the most advanced custom sizing tools in the industry. I cover the MTM setup, measurement-driven pattern adaptation, morphing grading, and the bespoke production workflow."
category: "workflow"
softwareSlug: "lectra-modaris"
keyword: "Lectra Modaris made-to-measure MTM bespoke custom pattern generation morphing grading luxury apparel"
slug: "lectra-modaris-made-to-measure-bespoke-custom-pattern-generation"
author: "CAD IT Admin"
readTime: "10 min"
date: "2025-06-29"
sources:
  - "https://www.lectra.com/en/products/modaris"
  - "https://www.lectra.com/en/fashion"
---

# Lectra Modaris Made-to-Measure: Custom Pattern Generation for Bespoke and Luxury Apparel

I've implemented MTM workflows in Lectra Modaris for luxury menswear and bespoke womenswear brands. Lectra's MTM capabilities are the most advanced in the apparel CAD industry — the combination of measurement-driven pattern adaptation, morphing grading, and variant management creates a system that can handle everything from semi-custom uniforms to fully bespoke garments. For luxury brands where individualized fit is the core value proposition, Modaris MTM is the tool of choice.

## Modaris Expert MTM Overview

Modaris Expert includes MTM features that go beyond standard grading:
- **Measurement-driven adaptation**: Pattern adjusts based on individual body measurements
- **Morphing grading**: Non-linear grading for different body types (regular, petite, tall, plus)
- **Posture adjustment**: Adjust patterns for posture variations (forward shoulder, rounded back)
- **Style variants within MTM**: Different style options (lapel width, pocket style, vent type) within the same MTM system
- **Batch MTM processing**: Generate patterns for multiple customers simultaneously

## MTM Setup

### Step 1: Create the Base Pattern

1. Design the base pattern in Modaris at a standard size
2. The base pattern must be fully parameterized:
   - All dimensions defined as variables
   - All construction points linked to body measurements
   - All style elements (lapels, pockets, vents) defined as options
3. The base pattern is the template that MTM modifies

### Step 2: Define Measurement Points

1. Go to **MTM Setup** (Tools → MTM Configuration)
2. Define the body measurements that drive pattern adjustments:
   - **Chest circumference**: Drives chest width
   - **Waist circumference**: Drives waist width
   - **Hip circumference**: Drives hip width
   - **Shoulder width**: Drives shoulder measurement
   - **Arm length**: Drives sleeve length
   - **Body length**: Drives garment length (nape to waist, waist to hem)
   - **Neck circumference**: Drives neckline
   - **Bicep circumference**: Drives sleeve width
   - **Wrist circumference**: Drives cuff size
   - **Back width**: Drives back panel width
   - **Crotch depth**: Drives pants rise (for bottoms)
   - **Inseam length**: Drives pants leg length

### Step 3: Define Adjustment Rules

1. For each measurement, define how the pattern adjusts:
   - **Linear adjustment**: Proportional growth/shrinkage
   - **Non-linear adjustment**: Curve modifications based on measurement
   - **Conditional rules**: If measurement exceeds threshold, apply specific adjustment
2. Example rules for a men's jacket:
   - **Chest +4cm**: Add 2cm to each side of front and back body
   - **Drop (chest-waist) adjustment**: If drop > 12cm, suppress waist more
   - **Shoulder +1cm**: Extend shoulder line by 1cm
   - **Sleeve +2cm**: Extend sleeve at the cuff
3. Set adjustment limits:
   - **Minimum**: How much the pattern can shrink
   - **Maximum**: How much the pattern can grow
   - Beyond limits, use a different base pattern (e.g., switch from regular to plus-size base)

### Step 4: Define Morphing Groups

Morphing grading is Lectra's advanced feature for handling different body types:

1. Define morphing groups:
   - **Regular**: Standard proportions
   - **Petite**: Shorter stature, adjusted proportions
   - **Tall**: Taller stature, adjusted proportions
   - **Plus**: Larger sizes with different proportion ratios
2. Each morphing group has its own grade rules
3. The system automatically selects the appropriate morphing group based on measurements
4. Example:
   - Height < 160cm → Petite morphing
   - Height 160-180cm → Regular morphing
   - Height > 180cm → Tall morphing
   - Chest > 120cm → Plus morphing

### Step 5: Define Posture Adjustments

1. Posture variations affect garment fit significantly:
   - **Forward shoulder**: Shoulder point moves forward
   - **Rounded back**: Back length increases, front length decreases
   - **Sway back**: Back length decreases, front length increases
   - **Erect posture**: Shoulder point moves backward
2. Define posture adjustment rules:
   - Each posture type modifies specific pattern areas
   - Adjustments are applied on top of the size-based adjustments
3. Posture is typically assessed by the fitter during measurement

## MTM Order Workflow

### Step 1: Input Customer Measurements

1. Open the **MTM Order** module
2. Enter the customer's measurements:
   - Manual entry: Type each measurement
   - Body scanner import: Import from 3D body scan
   - CSV import: Batch import for multiple customers
3. Enter posture assessment:
   - Forward shoulder: Yes/No, degree
   - Rounded back: Yes/No, degree
   - Other posture notes
4. Enter style options:
   - Lapel width: Standard, narrow, wide
   - Pocket style: Flap, patch, jetted
   - Vent type: Single, double, none
   - Button count: 2-button, 3-button, double-breasted

### Step 2: Generate the Custom Pattern

1. Click **Generate Pattern**
2. Modaris applies:
   - Size-based adjustments from body measurements
   - Morphing group selection based on height/chest
   - Posture adjustments
   - Style variant selection
3. The custom pattern is generated in seconds
4. Review the generated pattern:
   - Check that all adjustments were applied
   - Verify seam lengths match
   - Check for pattern distortion
   - Verify style options are correctly applied

### Step 3: 3D Fit Validation

1. Create a custom avatar from the customer's measurements
2. Simulate the MTM garment in 3D Prototyping
3. Check the tension map for fit issues
4. Verify measurements match the spec
5. If fit issues are found:
   - Adjust the measurement rules
   - Consider posture adjustments
   - Regenerate and re-validate

### Step 4: Generate the Marker

1. The MTM pattern is a single custom size
2. Create a marker for the custom pattern
3. For batch MTM orders, combine multiple custom sizes on one marker
4. Optimize marker efficiency for the custom sizes

### Step 5: Export for Cutting

1. Export the custom pattern as DXF-AAMA
2. Or send directly to Lectra Vector/Mosaic cutters
3. The custom garment is cut and sewn

## Bespoke vs. Semi-Bespoke MTM

### Semi-Bespoke (MTM)

- Uses a base pattern with measurement-driven adjustments
- Style options are predefined (lapel, pocket, vent options)
- Faster turnaround (1-2 weeks)
- Lower cost than full bespoke
- Fit is very good but not perfect
- Most MTM operations are semi-bespoke

### Full Bespoke

- Base pattern is modified more extensively
- Personal fitter makes manual adjustments to the generated pattern
- Multiple fittings during production
- Longer turnaround (4-8 weeks)
- Higher cost
- Fit is perfect
- Modaris supports this with manual override of MTM-generated patterns

## MTM for Different Garment Types

### Men's Tailored Clothing

- Jackets, suits, trousers, vests
- Measurements: chest, waist, hip, shoulder, arm length, neck, bicep, wrist, back length, drop
- Posture: forward shoulder, rounded back, erect
- Style options: lapel, pocket, vent, button count, lining

### Women's Tailored Clothing

- Jackets, dresses, skirts, trousers
- Measurements: bust, waist, hip, shoulder, arm length, bicep, back length, apex-to-apex
- Posture: forward shoulder, rounded back, sway back
- Style options: neckline, sleeve length, silhouette, closure

### Shirts and Blouses

- Measurements: neck, chest, waist, arm length, wrist, back length, shoulder
- Style options: collar style, cuff style, placket, pocket

## Common MTM Issues

### Pattern Distortion at Extreme Measurements

- Set realistic adjustment limits
- Create multiple base patterns for different size ranges
- Use morphing groups to handle different body types
- Test the extremes of the measurement range

### Posture Adjustment Causes New Fit Issues

- Apply posture adjustments carefully — small changes have big effects
- Always validate with 3D simulation
- Consider physical fitting for extreme posture cases
- Iterate the posture rules based on fitting feedback

### Seam Lengths Don't Match After MTM

- Check that adjustment rules maintain seam relationships
- Add seam matching constraints to MTM rules
- Test with various measurement combinations

### Customer Measurements Are Inaccurate

- Train fitters on proper measurement techniques
- Use body scanners for consistent measurement
- Add measurement validation (anatomical range checks)
- Offer re-measurement if fit issues suggest incorrect measurements

## Summary

Lectra Modaris Expert's MTM module is the most advanced custom pattern generation system in apparel CAD. Set up the base pattern with parameterized dimensions, define measurement-driven adjustment rules, configure morphing groups for different body types (regular, petite, tall, plus), and define posture adjustments. The MTM order workflow: input measurements and posture assessment, generate the custom pattern, validate in 3D Prototyping, create a marker, and export for cutting. For luxury brands, Modaris MTM supports both semi-bespoke (measurement-driven with predefined options) and full bespoke (manual override of generated patterns). The most common issues — distortion, posture complications, and seam mismatches — are addressed by setting adjustment limits, validating with 3D simulation, and adding seam matching constraints. Modaris MTM is ideal for luxury menswear, bespoke womenswear, and any brand where individualized fit is the core value.
