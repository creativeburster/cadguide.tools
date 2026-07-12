---
title: "KISSsoft Contact Analysis: Gear Tooth Modification Optimization Guide"
excerpt: "Guide to using KISSsoft's loaded tooth contact analysis (LTCA) for optimizing profile and lead modifications — covering transmission error, contact patterns, and modification sizing — based on KISSsoft training programs."
category: "workflow"
softwareSlug: "kisssoft"
keyword: "kisssoft contact analysis gear tooth modification optimization"
slug: "kisssoft-contact-analysis-tooth-modification-optimization"
author: "CADGuide Technical Editorial"
readTime: "9 min read"
date: "2026-07-12"
sources:
  - "https://www.kisssoft.com/en/news-and-events/newsroom/loaded-tooth-contact-analysis-1"
  - "https://www.kisssoft.com/files/HGIM5B/Live_Stream_Special_Contact_Analysis_Program.pdf"
  - "https://www.kisssoft.com/files/AwxJug/TRA_Program_Stream_Contact_Analysis_Cylindrical_Planetary_Gears-en-vs2300-al-public.pdf"
---

# KISSsoft Contact Analysis: Gear Tooth Modification Optimization Guide

Loaded tooth contact analysis (LTCA) is KISSsoft's most powerful tool for gear micro-geometry optimization. According to KISSsoft: "LTCA forms the foundation for a robust micro-geometric gear design, including lead and profile modifications." This guide documents the workflow based on KISSsoft's official training programs.

## What LTCA Does

The contact analysis calculates tooth contact under specific torque and speed levels, assessing:
- **Transmission error**: The main driver of gear noise (NVH)
- **Contact patterns**: Where and how teeth contact under load
- **Contact shocks**: Entry and exit impacts during meshing
- **Torque variations**: Smoothness of power transmission
- **Hertzian pressure**: Contact stress distribution
- **Load distribution**: Load sharing across the face width and between teeth

## Types of Contact Analysis in KISSsoft

### Standard Contact Analysis (Z32)
- Calculates contact under a single load condition
- Shows transmission error, contact pattern, and load distribution
- Suitable for single operating point analysis

### Contact Analysis under Load (Z33)
- Extended analysis with system deformation (shafts, bearings, housing)
- More realistic — accounts for actual misalignment under load
- Required for accurate lead modification sizing

### Optimization of Modifications with Contact Analysis (Z7o, Z33)
- Automated sizing of profile and lead modifications
- Optimizes for load spectra (multiple operating conditions)
- Can optimize for NVH, efficiency, contact temperature, and strength simultaneously

## Step 1: Set Up the Gear Pair

1. Define the gear geometry (module, teeth, pressure angle, helix angle, face width)
2. Select the calculation method (ISO 6336, DIN 3990, AGMA, etc.)
3. Assign materials and lubrication
4. Define the operating conditions (power, speed, torque)
5. For load spectra: define multiple load cases with different torques and speeds

## Step 2: Define the System Deformation

For accurate contact analysis, the system deformation must be considered:

1. **Shaft deformation**: Define shaft geometry and bearing positions
   - The shaft calculation provides bending and torsion deformation
   - These deformations affect the misalignment at the gear mesh
2. **Bearing stiffness**: Define bearing types and stiffness
   - Bearing deflection contributes to misalignment
3. **Gear body deformation**: Use the gear body deformation module
   - Calculates deformation due to line load on the operating pitch diameter
   - Provides a reduced stiffness matrix for LTCA
4. **Housing deformation** (if available): Import housing stiffness from FE analysis

## Step 3: Run the Initial Contact Analysis

1. Open the **Contact Analysis** tab in the gear calculation
2. Set the **shaft calculation** option:
   - "Treated as defined in shaft calculation" — uses shaft deformation results
   - Uncheck the shaft checkbox to use misalignments directly
3. Click **Calculate**
4. Review the initial results:
   - **Transmission error curve**: Look for peaks and amplitude
   - **Contact pattern**: Check if it's centered or biased to one side
   - **Hertzian pressure**: Check for stress concentrations
   - **Load distribution**: Check if load is evenly distributed across face width

## Step 4: Identify Issues

### Contact Pattern Issues
- **Toe-side concentration**: Contact biased toward one end of the tooth
- **Heel-side concentration**: Contact biased toward the other end
- **Edge contact**: Contact at tooth tip or root (high stress)
- **Narrow contact band**: Load concentrated in a small area

### Transmission Error Issues
- **High amplitude**: Indicates high noise potential
- **Sharp peaks**: Entry/exit impacts
- **Non-monotonic**: Irregular meshing behavior

## Step 5: Add Tooth Modifications

### Profile Modifications (in the profile direction)
1. Open the **Modifications** tab
2. Add **profile crowning** (diameter-centered):
   - Recommendation: HB = 0.005 × normal module
   - Example: For mn = 7.5 mm, HB = 0.005 × 7.5 = 38 μm
3. Add **tip relief** or **root relief** if needed
4. Profile modifications affect:
   - Entry/exit impacts
   - Transmission error amplitude
   - Contact stress distribution

### Lead Modifications (in the face width direction)
1. Add **lengthwise crowning**:
   - Recommendation: LB = b² / 1000 (b = face width in mm)
   - Example: For b = 72 mm, LB = 72² / 1000 = 5.18 mm... no, LB = b / 1000 = 72 / 1000 = 0.072 mm = 72 μm
2. Add **helix angle modification** if the contact pattern is offset
3. Add **end relief** if edge contact occurs
4. Lead modifications affect:
   - Contact pattern position
   - Face load distribution
   - KHβ (face load factor)

## Step 6: Optimize Modifications

### Manual Optimization
1. Run contact analysis with initial modifications
2. Check contact pattern and transmission error
3. Adjust modification magnitudes:
   - If contact is too narrow: increase crowning
   - If contact is offset: adjust helix angle modification
   - If transmission error is high: adjust profile modifications
4. Re-run and iterate

### Automated Optimization (Z7o/Z33)
1. Use the **Sizing** function for modifications
2. Define the optimization target:
   - Minimum transmission error
   - Optimal contact pattern
   - Maximum strength
   - Combined objectives
3. For load spectra: optimize across all load cases
4. KISSsoft automatically finds the optimal modification magnitudes

### Optimization for Load Spectra
According to KISSsoft training: "Sizing and optimizing modifications for load spectra" allows you to:
1. Define multiple operating conditions (torque, speed)
2. The optimizer finds modifications that perform well across ALL conditions
3. This is critical for gearboxes with variable loads (e.g., automotive transmissions)

## Step 7: Validate and Document

1. Run the final contact analysis with optimized modifications
2. Check all results:
   - Transmission error within acceptable range
   - Contact pattern centered and adequate width
   - Hertzian pressure below allowable limits
   - No edge contact
3. Generate the report
4. Export contact analysis data (module K05w) for documentation or further analysis in Excel/MATLAB

## Contact Pattern Under Light Load

For quality control purposes:
1. Calculate the contact pattern at **1% of full load** — this represents the "light load" contact pattern
2. Also check the **load-free contact pattern**
3. These are used to verify manufacturing quality:
   - Compare the actual contact pattern (from blue compound test) with the calculated light-load pattern
   - Report to the manufacturing department or supplier

## Planetary Gear Contact Analysis

For planetary gears, additional considerations apply:
1. **Individual planet results**: Results are determined for each planet separately
2. **Axis alignment**: Correct configuration of axis alignment is critical
3. **Iterative load distribution**: The load distribution between planets is calculated iteratively
4. **Slice count**: A new dialog allows defining the number of slices for load distribution calculation — fewer slices = faster calculation for planetary systems

## Common Issues

### Issue: Contact Analysis Doesn't Converge
- Check for numerical problems (identified in KISSsoft training)
- Increase the number of slices
- Check for extreme modifications (too much crowning can cause numerical issues)
- Verify gear geometry is valid (no undercut, no pointed teeth)

### Issue: Contact Pattern on Wrong Side
- Adjust helix angle modification
- Check shaft deformation direction — may need to reverse the lead correction direction
- Verify bearing stiffness and positions

### Issue: Transmission Error Still High After Optimization
- Check if profile modifications are adequate
- Consider non-standard modifications (parabolic tip relief instead of linear)
- Check if the issue is at entry/exit (profile) or during meshing (lead)
- Consider changing the gear macro-geometry (number of teeth, helix angle, pressure angle)
