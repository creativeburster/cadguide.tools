---
title: "IDEA StatiCa Member Design: Steel Beams, Columns, and Bracing per Eurocode"
excerpt: "How to use IDEA StatiCa Member for steel member design — covering section classification, buckling resistance, lateral-torsional buckling, and code checking per Eurocode 3 and AISC."
category: "standards"
softwareSlug: "idea-statica"
keyword: "idea statica member design steel beam column eurocode"
slug: "idea-statica-member-design-steel-beam-column-eurocode"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.ideastatica.com/support-center/steel-frame-en"
  - "https://www.ideastatica.com/support-center/simple-steel-beam-member-en"
---

# IDEA StatiCa Member Design: Steel Beams, Columns, and Bracing per Eurocode

IDEA StatiCa Member is the companion to the Connection module. While Connection designs joints, Member designs the steel members themselves — beams, columns, and bracing. I use it for code checking and optimization. Here's the workflow.

## What IDEA StatiCa Member Does

- **Section classification**: Determines if a section is Class 1-4 per Eurocode or Compact/Non-Compact/Slender per AISC
- **Cross-section resistance**: Checks yielding, local buckling
- **Member buckling resistance**: Checks flexural buckling, lateral-torsional buckling
- **Shear resistance**: Checks shear yielding and shear buckling
- **Combined loading**: Checks interaction equations for axial + bending + shear
- **Optimization**: Suggests the lightest section that passes all checks

## Step 1: Define the Member

1. Open IDEA StatiCa → **Member** → **New Project**.
2. Select design code:
   - **Eurocode 3 (EN 1993-1-1)** (EU)
   - **AISC 360-22** (US)

3. Define member type:
   - **Beam**: Primarily bending
   - **Column**: Primarily axial + bending
   - **Bracing**: Primarily axial (tension/compression)

4. Define member geometry:
   - **Length**: Clear span between supports
   - **Support conditions**: Pinned, fixed, cantilever
   - **Lateral bracing points**: Locations where lateral support is provided

## Step 2: Select Section and Material

1. **Section**:
   - Select from section database: IPE, HEA, HEB, W-shapes, HSS, angles
   - Or define a custom section (built-up welded section)

2. **Material**:
   - Eurocode: S235, S275, S355, S420, S460
   - AISC: A36, A572 Gr 50, A992

3. IDEA StatiCa automatically classifies the section:
   - **Class 1**: Plastic design allowed (compact, can form plastic hinge)
   - **Class 2**: Plastic moment capacity, but no rotation capacity
   - **Class 3**: Elastic stress distribution only
   - **Class 4**: Local buckling reduces capacity (effective section required)

## Step 3: Define Internal Forces

### Import from Structural Model

1. **File** → **Import** → select source:
   - **Autodesk Robot**: Direct import of member forces
   - **ETABS/SAP2000**: Via spreadsheet export/import
   - **SCIA Engineer**: Direct import

2. The import brings in:
   - Axial force (NEd)
   - Major axis moment (My,Ed)
   - Minor axis moment (Mz,Ed)
   - Major axis shear (Vz,Ed)
   - Minor axis shear (Vy,Ed)
   - Torsion (TEd)

3. Multiple load combinations are imported automatically.

### Manual Entry

1. Enter forces for each load combination:
   - **Comb 1 (1.35G + 1.5Q)**: NEd = -200 kN, My,Ed = 150 kN·m, Vz,Ed = 80 kN
   - **Comb 2 (1.0G + 1.5W)**: NEd = -100 kN, My,Ed = 120 kN·m, Vz,Ed = 60 kN
   - **Comb 3 (1.0G + 1.0E)**: NEd = -150 kN, My,Ed = 180 kN·m, Vz,Ed = 90 kN

## Step 4: Define Buckling Parameters

### Flexural Buckling (Columns)

1. **Buckling length (Lcr)**:
   - **Pinned-pinned**: Lcr = L (actual length)
   - **Fixed-pinned**: Lcr = 0.7L
   - **Fixed-fixed**: Lcr = 0.5L
   - **Cantilever**: Lcr = 2.0L

2. **Buckling curve** (Eurocode):
   - Curve a: Low residual stress (hot-rolled I-sections, h/b > 1.2)
   - Curve b: Moderate residual stress (most I-sections)
   - Curve c: High residual stress (welded sections, angles)
   - Curve d: Very high residual stress (thick welded sections)

3. **Slenderness ratio**: λ̄ = √(Af_y / Ncr)
   - λ̄ < 0.2: No buckling check needed (stocky column)
   - λ̄ 0.2-0.3: Low slenderness, high capacity
   - λ̄ 0.3-1.0: Medium slenderness, moderate reduction
   - λ̄ > 1.0: High slenderness, significant reduction

### Lateral-Torsional Buckling (Beams)

1. **Unbraced length (Llt)**: Distance between lateral support points
   - For beams with continuous lateral support: Llt = 0 (no LTB check needed)
   - For beams with discrete bracing: Llt = distance between braces

2. **Buckling curve** (Eurocode):
   - Curve a: Rolled I-sections, h/b > 2
   - Curve b: Rolled I-sections, h/b ≤ 2
   - Curve c: Welded sections, angles

3. **LTB slenderness**: λLT = √(Wpl,y × fy / Mcr)
   - Mcr = elastic critical moment for LTB (IDEA StatiCa calculates automatically)

## Step 5: Calculate and Check

1. Click **Calculate**.
2. IDEA StatiCa checks each load combination:

### Eurocode 3 Checks

| Check | Formula | Result |
|-------|---------|--------|
| Section class | c/t ≤ ε limits | Class 1-4 |
| Tension resistance | NEd / Npl,Rd ≤ 1.0 | Pass/Fail |
| Compression resistance | NEd / Nb,Rd ≤ 1.0 | Pass/Fail |
| Bending resistance | My,Ed / Mc,Rd ≤ 1.0 | Pass/Fail |
| Shear resistance | VEd / Vc,Rd ≤ 1.0 | Pass/Fail |
| Combined axial + bending | NEd/Nc,Rd + My,Ed/Mc,Rd ≤ 1.0 | Pass/Fail |
| LTB resistance | My,Ed / Mb,Rd ≤ 1.0 | Pass/Fail |
| Shear buckling | VEd / Vb,Rd ≤ 1.0 (if applicable) | Pass/Fail |

### AISC Checks

| Check | Formula | Result |
|-------|---------|--------|
| Flexural yielding | Mn = Mp | Pass/Fail |
| LTB | Mn based on unbraced length | Pass/Fail |
| Compression | Pn = Fcr × A | Pass/Fail |
| Shear yielding | Vn = 0.6 × Fy × Aw | Pass/Fail |
| Interaction (H1-1) | Pr/Pc + 8/9(Mr/Mc) ≤ 1.0 | Pass/Fail |

3. Results display as utilization ratios:
   - **< 0.85**: Efficient design
   - **0.85-1.0**: Near capacity — acceptable but consider larger section
   - **> 1.0**: Fails — increase section size

## Step 6: Optimize

1. Click **Optimize**.
2. IDEA StatiCa searches the section database for the lightest section that passes all checks.
3. It tests sections in order of weight:
   - Current section: IPE 300 → utilization 1.15 (fails)
   - IPE 330 → utilization 0.95 (passes, but heavy)
   - IPE 360 → utilization 0.78 (passes, heavier)
   - HEA 280 → utilization 0.88 (passes, lighter than IPE 330)
   - Recommended: HEA 280 (lightest passing section)

4. Review the optimization results and select the recommended section.

## Common Member Design Issues

**LTB governs beam design**: If lateral-torsional buckling is the controlling check, add lateral bracing to reduce the unbraced length. This is often more economical than increasing the section size.

**Column buckling governs**: For slender columns, reducing the buckling length (by adding intermediate bracing) is more effective than increasing the section size.

**Section classification limits capacity**: A Class 3 or 4 section has significantly reduced capacity compared to Class 1 or 2. Consider a section with thicker flanges and web to achieve Class 1 or 2.

**Minor axis bending is significant**: If Mz,Ed is large, consider a square or circular hollow section (HSS) which has equal capacity in both axes.
