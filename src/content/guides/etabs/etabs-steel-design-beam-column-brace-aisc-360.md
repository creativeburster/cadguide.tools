---
title: "ETABS Steel Design: Beam, Column, and Brace Design per AISC 360"
excerpt: "ETABS steel design tools design steel beams, columns, and braces per AISC 360. I cover design preferences, beam flexural and shear capacity, column interaction, brace design, seismic provisions for special steel systems, and design output interpretation."
category: "workflow"
softwareSlug: "etabs"
keyword: "ETABS steel design beam column brace AISC 360 flexural shear capacity interaction seismic provisions special steel systems output"
slug: "etabs-steel-design-beam-column-brace-aisc-360"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-29"
sources:
  - "https://www.csiamerica.com/products/etabs"
  - "https://www.csiamerica.com/support/learn"

---

# ETABS Steel Design: Beam, Column, and Brace Design per AISC 360

I've designed steel buildings in ETABS for office towers, industrial facilities, and seismic retrofit projects. ETABS's steel design module automates member design per AISC 360 (LRFD and ASD), including the seismic provisions for special steel systems. Understanding the design preferences, capacity checks, and output interpretation is essential for producing safe and economical steel building designs.

## Steel Design Overview

ETABS steel design includes:
- **Beam design**: Flexural capacity (bending), shear capacity, deflection checks
- **Column design**: Axial-flexural interaction (combined compression and bending)
- **Brace design**: Axial capacity (tension and compression), slenderness checks
- **Seismic provisions**: Special moment frames, concentrically braced frames, eccentrically braced frames

## Design Preferences

### Setting Up AISC 360 Design

1. Go to **Design** → **Steel Frame Design** → **View/Revise Preferences**
2. Set design code:
   - **Design code**: AISC 360-22 (or AISC 360-16, AISC 360-10)
   - **Design method**: LRFD (Load and Resistance Factor Design) or ASD (Allowable Stress Design)
3. Set parameters:
   - **Steel yield strength (Fy)**: From material definition (e.g., 345 MPa / 50 ksi for A992)
   - **Steel ultimate strength (Fu)**: e.g., 450 MPa / 65 ksi for A992
   - **Shear strength factor**: Cv per AISC 360
   - **Unbraced length factors**: K (effective length), Lb (unbraced length)
   - **Lateral-torsional buckling modification factor (Cb)**: 1.0 default or calculated
4. Set design options:
   - **Consider P-Delta**: If P-Delta analysis was run
   - **Use moment magnification**: For columns (Chapter C)
   - **Design for biaxial bending**: For columns
5. Click **OK**

### Unbraced Length Settings

1. Select frame elements
2. **Assign** → **Frame** → **Unbraced Length**
3. Set:
   - **Lb (major)**: Unbraced length for bending about the major axis
   - **Lb (minor)**: Unbraced length for bending about the minor axis
   - **Ltb (torsional)**: Unbraced length for torsional buckling
   - **LT (top)**: Distance between lateral supports on the top flange
   - **LB (bottom)**: Distance between lateral supports on the bottom flange
4. For typical floor beams:
   - **Lb = 0** if the slab is continuously connected (composite)
   - **Lb = beam length** if no lateral support
   - **Lb = distance between braces** for partially braced beams

## Beam Design

### Running Steel Design

1. Go to **Design** → **Steel Frame Design** → **Start Design/Check**
2. ETABS designs all steel members for the selected load combinations
3. Results are displayed:
   - **Green**: Design passes (capacity > demand)
   - **Red**: Design fails (demand > capacity) — increase section
   - **Yellow**: Warning or marginal

### Beam Flexural Design

1. Select a beam
2. Right-click → **Steel Beam Design**
3. The design output shows:
   - **Design moment (Mu)**: Factored moment at each station
   - **Flexural capacity (φMn)**: Design flexural strength
     - **Compact section, fully braced**: φMn = φ × Mp = 0.9 × Fy × Zx
     - **Compact section, partially braced**: φMn = φ × Fcr × Sx (lateral-torsional buckling)
     - **Non-compact section**: φMn per AISC 360 Chapter F
   - **Capacity ratio**: Mu / φMn (should be < 1.0)
   - **Cb factor**: Lateral-torsional buckling modification
4. Check:
   - **Compactness**: Is the section compact (flange and web slenderness within limits)?
   - **Unbraced length**: Is Lb within the plastic limit?
   - **Capacity ratio**: < 1.0 for all load combinations

### Beam Shear Design

1. In the beam design output, check shear:
   - **Design shear (Vu)**: Factored shear at each station
   - **Shear capacity (φVn)**: Design shear strength
     - **Webs with h/tw ≤ 2.24√(E/Fy)**: φVn = 0.9 × 0.6 × Fy × Aw × Cv1
     - **Cv1 = 1.0** for stocky webs (most W-shapes)
   - **Capacity ratio**: Vu / φVn (should be < 1.0)
2. For most standard W-shapes, shear capacity is not critical
3. Shear may govern for:
   - Short, heavily loaded beams
   - Beams with large concentrated loads
   - Coped or modified sections

### Beam Deflection

1. ETABS does not automatically check deflection in steel design
2. Check deflection manually:
   - Display → Show Deformed Shape
   - Select the service load combination (e.g., 1.0D + 1.0L)
   - Read the maximum deflection
3. Typical deflection limits:
   - **Live load deflection**: L/360 for floors
   - **Total deflection**: L/240 for floors
   - **Roof deflection**: L/180 (live), L/240 (total)
   - **Sensitive equipment**: L/500 or stricter
4. If deflection exceeds limits:
   - Increase the beam depth (most effective)
   - Use a heavier section
   - Add intermediate supports
   - Use camber

## Column Design

### Column Interaction Check

1. Select a column
2. Right-click → **Steel Column Design**
3. The design output shows:
   - **Design axial force (Pu)**: Factored axial (compression or tension)
   - **Design moments (Mux, Muy)**: Factored moments about both axes
   - **Axial capacity (φcPn)**: Design compressive strength
     - **Flexural buckling**: φcPn = 0.9 × Fcr × Ag
     - **Fcr**: Based on slenderness ratio (KL/r)
   - **Flexural capacity (φbMn)**: Design flexural strength about each axis
   - **Interaction ratio**: Per AISC 360 Chapter H
4. AISC 360 interaction equations:
   - **For Pu/φcPn ≥ 0.2**: (Pu/φcPn) + (8/9) × [(Mux/φbMnx) + (Muy/φbMny)] ≤ 1.0
   - **For Pu/φcPn < 0.2**: (Pu/(2×φcPn)) + (Mux/φbMnx) + (Muy/φbMny) ≤ 1.0
5. Check:
   - **Interaction ratio < 1.0**: Column is adequate
   - **Interaction ratio > 1.0**: Column is overstressed — increase section

### Column Effective Length

1. The effective length factor (K) determines the column capacity:
   - **K = 1.0**: Sidesway uninhibited, pinned ends (typical default)
   - **K < 1.0**: Sidesway inhibited (braced frame) or moment frame
   - **K > 1.0**: Sidesway uninhibited with flexible ends
2. ETABS can calculate K automatically:
   - **Auto K**: Based on the stiffness of connecting members
   - Or set K manually
3. For braced frames: K typically 0.7-1.0
4. For moment frames: K typically 1.2-2.0 (depends on column/beam stiffness ratio)

### Column Slenderness

1. Check the slenderness ratio KL/r:
   - **KL/r ≤ 200**: Recommended for compression members (AISC)
   - **KL/r > 200**: Column is too slender — increase section or reduce unbraced length
2. For tension members: KL/r ≤ 300 (recommended)

## Brace Design

### Running Brace Design

1. Braces are designed as axial members (tension and compression)
2. Select a brace
3. Right-click → **Steel Brace Design**
4. The design output shows:
   - **Design axial force (Pu)**: Factored axial (tension or compression)
   - **Tension capacity (φtPn)**: Design tensile strength
     - **Yielding**: φtPn = 0.9 × Fy × Ag
     - **Rupture**: φtPn = 0.75 × Fu × Ae (effective net area)
   - **Compression capacity (φcPn)**: Design compressive strength
     - **Flexural buckling**: φcPn = 0.9 × Fcr × Ag
   - **Capacity ratio**: Pu / φPn (should be < 1.0)
5. Check:
   - **Tension governs**: For slender braces (high KL/r)
   - **Compression governs**: For stocky braces
   - **Slenderness limit**: KL/r ≤ 200 for compression braces

### Seismic Brace Design (SCBF)

For Special Concentrically Braced Frames (SCBF) per AISC 341:

1. **Tension capacity**: φtPn = 0.9 × Fy × Ag (no rupture reduction)
2. **Compression capacity**: Reduced for buckling:
   - φcPn = 0.9 × Fcr × Ag × β (β < 1.0 for SCBF)
3. **Expected yield strength**: Ry × Fy (for capacity-based design)
4. **Brace slenderness**: KL/r ≤ 4√(E/Fy) (approximately 120 for A992)
5. **Compactness**: Brace section must be compact per AISC 341

## Seismic Provisions for Steel Structures

### Special Moment Frames (SMF)

1. Go to **Design** → **Steel Frame Design** → **View/Revise Preferences**
2. Set seismic design:
   - **Seismic provision**: AISC 341
   - **System type**: Special Moment Frame (SMF)
3. SMF requirements:
   - **Strong column-weak beam**: ΣMpc* ≥ 1.0 × ΣMpb* at each joint
     - Mpc* = 1.0 × Ry × Fy × Zc (column probable moment)
     - Mpb* = 1.0 × Ry × Fy × Zb (beam probable moment)
   - **Panel zone**: Shear capacity per AISC 341
   - **Continuity plates**: Required at beam-column joints
   - **Beam bracing**: Lateral bracing within L/6 of plastic hinges
4. ETABS checks the strong column-weak beam ratio automatically

### Concentrically Braced Frames (SCBF)

1. Set system type: SCBF
2. SCBF requirements:
   - **Brace capacity**: Based on expected yield strength
   - **Column design**: For axial forces including brace forces
   - **Beam design**: For unbalanced brace forces (tension-only after buckling)
   - **Connection design**: For expected brace capacity (not design force)

### Eccentrically Braced Frames (EBF)

1. Set system type: EBF
2. EBF requirements:
   - **Link beam**: Design for shear, moment, and axial
   - **Link length**: Determines yielding mode (shear, flexural, or combined)
   - **Link rotation angle**: Per AISC 341 (0.08 rad for shear links, 0.02 rad for flexural)
   - **Brace and column design**: For forces amplified by link overstrength

## Design Output and Reporting

### Design Summary Tables

1. Display → Show Tables → Steel Design
2. Available tables:
   - **Steel Beam Design Summary**: Section, moments, capacity, ratio
   - **Steel Column Design Summary**: Axial, moments, interaction ratio
   - **Steel Brace Design Summary**: Axial, tension/compression capacity, ratio
3. Export to Excel for review and drawing preparation

### Graphical Display

1. Display → Show Design Output
2. Options:
   - **P-M ratio**: Color-coded capacity ratio for each member
   - **Stress ratio**: Demand/capacity ratio
   - **Governing combination**: Which load combination governs each member
3. Identify:
   - **Critical members**: Highest capacity ratios
   - **Over-designed members**: Very low ratios (consider downsizing)
   - **Failed members**: Ratio > 1.0 (increase section)

## Common Issues

### Beam Fails in Flexure

- Increase the beam depth (W18 → W24)
- Use a heavier section (W18x40 → W18x50)
- Reduce the unbraced length (add lateral braces)
- Use a higher strength steel (A992 instead of A36)
- Check Cb factor (may be conservative at 1.0)

### Column Fails Interaction Check

- Increase the column section (W14 → W16 or heavier)
- Reduce the effective length (add bracing or moment frames)
- Check K factor (may be too conservative)
- Use a column with higher major-axis capacity

### Brace Fails in Compression

- Increase the brace section
- Reduce the unbraced length (add intermediate bracing)
- Use a section with higher radius of gyration (HSS instead of W-shape)
- Check KL/r (should be < 200, or < 120 for SCBF)

### Strong Column-Weak Beam Fails (SMF)

- Increase the column section (heavier column)
- Reduce the beam section (lighter beam)
- Use a higher strength column (A992 with higher Fy)
- Check the joint configuration

### Deflection Exceeds Limits

- Increase the beam depth
- Use a heavier section
- Add camber (for dead load deflection)
- Add intermediate supports
- Consider composite action (if slab is present)

## Summary

ETABS steel design automates beam, column, and brace design per AISC 360. Set design preferences (code, LRFD/ASD, unbraced lengths, K factors) and verify design combinations. Run beam design to check flexural capacity (φMn vs Mu) and shear capacity (φVn vs Vu) — check compactness, unbraced length, and Cb factor. Run column design to check the interaction equation (AISC Chapter H) — verify the axial-flexural interaction ratio is < 1.0. Run brace design to check tension and compression capacity — verify slenderness (KL/r < 200). For seismic design, set the system type (SMF, SCBF, EBF) and check special provisions (strong column-weak beam, brace slenderness, link design). Review design summary tables and graphical output to identify critical and over-designed members. The most common issues — flexural failure, interaction failure, brace buckling, and SCWB failure — are addressed by increasing sections, reducing unbraced lengths, adjusting K factors, and verifying seismic provisions. ETABS's steel design module provides comprehensive output for producing safe and economical steel building designs per AISC 360 and AISC 341.
