---
title: "SAP2000 Steel and Concrete Design: AISC, ACI, and Eurocode Code Checking"
excerpt: "A guide to code-based design in SAP2000 covering AISC 360 steel design (LRFD and ASD), ACI 318 concrete design, and Eurocode 3 and 2 design with interaction checking, optimization, and detailed output for structural members."
category: "workflow"
softwareSlug: "sap2000"
keyword: "sap2000 steel concrete design code checking"
slug: "sap2000-steel-concrete-design-aisc-aci-eurocode-code-checking"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://docs.csiamerica.com/help/sap2000/design"
  - "https://www.csiamerica.com/products/sap2000"
---

# SAP2000 Steel and Concrete Design: AISC, ACI, and Eurocode Code Checking

Running the analysis is only half the job — the other half is proving to the code that your members are adequate. I've spent more time on steel and concrete design checks in SAP2000 than I have on the analysis itself. The software supports AISC 360, ACI 318, and Eurocode 2 and 3, and once you know where the buttons are, the workflow is pretty smooth. Let me walk you through it.

## Steel Design (AISC 360)

### Setting Up Steel Design

1. Design > Steel Frame Design > View/Revise Preferences
2. Set design code: AISC 360-16
3. Set design method:
   - **LRFD**: Load and Resistance Factor Design (φ factors)
   - **ASD**: Allowable Strength Design (Ω factors)
4. Set preferences:
   - **FY**: Default yield strength (345 MPa for A992)
   - **FU**: Ultimate tensile strength (450 MPa)
   - **Phi tension**: 0.90
   - **Phi compression**: 0.90
   - **Phi bending**: 0.90
   - **Phi shear**: 0.90

### Overwrite Design Parameters per Member

1. Select frame elements
2. Design > Steel Frame Design > View/Revise Overwrites
3. Set member-specific parameters:

| Parameter | Description | Default | Example |
|-----------|-------------|---------|---------|
| FY | Yield strength | From material | 345 MPa |
| CB | Lateral-torsional buckling factor | Calculated | 1.0 |
| Unbraced Length (L) | Unbraced length | Member length | 3.5m |
| Lb Major | Unbraced for major bending | Member length | 3.5m |
| Lb Minor | Unbraced for minor bending | Member length | 3.5m |
| K Major | Effective length factor (major) | 1.0 | 0.8 |
| K Minor | Effective length factor (minor) | 1.0 | 1.0 |
| Cm Major | Moment gradient factor (major) | Calculated | 0.85 |
| Cm Minor | Moment gradient factor (minor) | Calculated | 0.85 |
| B1 Major | Amplification factor (major) | Calculated | 1.0 |
| B2 | P-Delta amplification | Calculated | 1.05 |
| NSF | Net section factor | 1.0 | 0.85 |
| SLT | Slender element limit | Per code | Per code |

### Running Steel Design

1. Design > Steel Frame Design > Start Design / Check
2. SAP2000 checks each steel member for:

#### Axial Tension
- **Yielding**: φ × Fy × Ag ≥ Pu
- **Rupture**: φ × Fu × Ae ≥ Pu
- Unity ratio = Pu / (φ × Fy × Ag)

#### Axial Compression
- **Flexural buckling**: Based on KL/r and Fcr
- **Local buckling**: Width-thickness ratio check
- Unity ratio = Pu / (φ × Fcr × Ag)

#### Flexure
- **Yielding**: φ × Fy × Zx ≥ Mu (compact sections)
- **Lateral-torsional buckling**: Based on Lb and Mp
- **Local buckling**: Flange and web checks
- Unity ratio = Mu / (φ × Mn)

#### Shear
- **Web yielding**: φ × 0.6 × Fy × Aw ≥ Vu
- Unity ratio = Vu / (φ × Vn)

#### Combined Loading (AISC H1)
- **High axial (Pr/Pc ≥ 0.2)**: Pr/Pc + 8/9 × (Mrx/Mcx + Mry/Mcy) ≤ 1.0
- **Low axial (Pr/Pc < 0.2)**: Pr/(2×Pc) + (Mrx/Mcx + Mry/Mcy) ≤ 1.0

### Reviewing Steel Design Results

1. Design > Steel Frame Design > Display Design Info
2. View:
   - **P-M Ratio**: Demand/capacity for axial + bending
   - **Shear Ratio**: Demand/capacity for shear
   - **Governing load combo**: Which combination controls
   - **Critical action**: Which check governs (flexure, compression, etc.)
3. Color-coded display:
   - **Green**: Ratio < 0.85 (adequate)
   - **Yellow**: 0.85 ≤ Ratio ≤ 1.0 (marginal)
   - **Red**: Ratio > 1.0 (inadequate — resize)

### Steel Optimization

1. Design > Steel Frame Design > Select Design Groups
2. Group members that should have the same section:
   - All exterior columns: Group "Ext-Columns"
   - All interior columns: Group "Int-Columns"
   - All floor beams: Group "Floor-Beams"
3. Design > Steel Frame Design > Auto Select Sections
4. Assign auto-select list to each group:
   - Ext-Columns: W12×45 to W12×96
   - Int-Columns: W14×48 to W14×120
   - Floor-Beams: W16×26 to W24×62
5. Design > Steel Frame Design > Start Design / Check
6. SAP2000 selects the lightest section from each list that satisfies all checks
7. Re-run analysis with selected sections (stiffness changes)
8. Re-design to verify (may need 2-3 iterations)

## Concrete Design (ACI 318)

### Setting Up Concrete Design

1. Design > Concrete Frame Design > View/Revise Preferences
2. Set design code: ACI 318-19
3. Set preferences:
   - **FC**: Default concrete strength (30 MPa)
   - **FY**: Rebar yield strength (420 MPa)
   - **FYH**: Stirrup yield strength (420 MPa)
   - **Clear cover**: 40mm (beams), 40mm (columns)
   - **Max aggregate size**: 20mm
   - **Seismic detailing**: Per ACI 318 Chapter 18 (if in seismic zone)

### Running Concrete Design

1. Design > Concrete Frame Design > Start Design / Check
2. SAP2000 designs each concrete member:

#### Beam Design

- **Factored moment (Mu)**: From critical load combination
- **Required steel (As)**: As = Mu / (φ × fy × (d - a/2))
  - φ = 0.90 (tension controlled)
  - d = effective depth
  - a = As × fy / (0.85 × f'c × b)
- **Minimum steel**: As,min = max(1.4/fy, 0.25√f'c/fy) × b × d
- **Maximum steel**: ρ ≤ 0.025 (seismic) or ρ ≤ ρb (non-seismic)
- **Shear design**:
  - Vu = factored shear
  - φVc = φ × 0.17 × √f'c × b × d
  - If Vu > φVc: stirrups required
  - Av = (Vu - φVc) / (φ × fy × d)
  - Spacing: s = Av × fy × d / (Vu - φVc)

#### Column Design

- **Factored loads**: Pu, Mux, Muy from critical combination
- **Interaction diagram**: P-M curve for the section
- **Capacity check**: Plot (Pu, Mu) on interaction surface
- **Capacity ratio**: Demand/capacity based on interaction
- **Longitudinal reinforcement**: ρ = As/Ag (1% to 8%)
- **Tie spacing**: Per ACI 25.7.2
- **Confinement**: Per ACI 18.7.5 (seismic)

### Reviewing Concrete Design Results

1. Design > Concrete Frame Design > Display Design Info
2. View:
   - **Required As (top)**: mm² for top reinforcement
   - **Required As (bottom)**: mm² for bottom reinforcement
   - **Required Av/s**: Stirrup area per unit spacing
   - **Capacity ratio**: Demand/capacity for columns
   - **Reinforcement ratio**: ρ = As/Ag
3. Select a member to see detailed design output:
   - **Section**: 300 × 600mm
   - **Mu (top)**: 250 kN·m
   - **As required (top)**: 1450 mm² → 4 #22
   - **As required (bottom)**: 980 mm² → 3 #20
   - **Vu**: 180 kN
   - **Stirrup**: #10 @ 150mm
   - **Capacity ratio**: 0.85

### Concrete Detailing Output

1. Design > Concrete Frame Design > Display Detailing
2. SAP2000 generates a detailing sketch showing:
   - **Cross-section**: With bar arrangement
   - **Bar sizes and counts**: Top, bottom, sides
   - **Stirrup size and spacing**: With confinement zones
   - **Development lengths**: For bar anchorage
3. Export detailing to DXF for drawing incorporation

## Eurocode Design

### Steel Design (EN 1993-1-1)

1. Design > Steel Frame Design > Preferences > EN 1993-1-1
2. Set:
   - **Partial safety factor γM0**: 1.0 (cross-section)
   - **Partial safety factor γM1**: 1.0 (member buckling)
   - **Partial safety factor γM2**: 1.25 (net section)
3. Design checks:
   - **Section classification**: Class 1-4 (compact to slender)
   - **Tension**: Nt,Rd = fy × A / γM0
   - **Compression**: Nb,Rd based on buckling curves
   - **Bending**: Mc,Rd = fy × Wpl / γM0 (Class 1-2)
   - **Shear**: Vpl,Rd = Av × fy / (√3 × γM0)
   - **Combined**: Per EN 1993-1-1 6.3.3 (interaction)

### Concrete Design (EN 1992-1-1)

1. Design > Concrete Frame Design > Preferences > EN 1992-1-1
2. Set:
   - **Partial safety factor γc**: 1.5 (concrete)
   - **Partial safety factor γs**: 1.15 (steel)
   - **αcc**: 1.0 (concrete strength coefficient)
3. Design checks:
   - **Flexure**: As = Mu / (fyd × z) where z ≈ 0.9d
   - **Shear**: VRd,c = 0.18/γc × ξ × (100 × ρl × fck)^(1/3) × b × d
   - **Minimum reinforcement**: As,min = 0.26 × fctm/fyk × b × d
   - **Maximum reinforcement**: As,max = 0.04 × Ac

## Design Optimization Workflow

1. **Initial analysis**: Run with assumed section sizes
2. **Review ratios**: Identify over-designed (ratio < 0.5) and under-designed (ratio > 1.0) members
3. **Group members**: Create design groups by member type
4. **Auto-select**: Assign auto-select lists to groups
5. **Optimize**: Run design with auto-select
6. **Re-analyze**: Changed sections change stiffness → re-run analysis
7. **Re-design**: Verify ratios with new sections
8. **Iterate**: Repeat steps 5-7 until convergence (usually 2-3 cycles)
9. **Final check**: Run final design check with selected sections
10. **Document**: Export design results for calculations package

## Common Design Issues

### High Unity Ratios in Columns

**Cause**: High axial load or biaxial moments.
**Fix**: Increase column size, increase reinforcement ratio, use higher strength concrete, or redistribute loads through bracing.

### Beams Failing in Shear

**Cause**: Heavy loads or long spans with insufficient depth.
**Fix**: Increase beam depth (most effective for shear), add stirrups at closer spacing, or use higher strength concrete.

### Lateral-Torsional Buckling Controls

**Cause**: Long unbraced length for beam compression flange.
**Fix**: Reduce unbraced length (add bracing), increase section size, or use a section with larger flange width.

### Over-Designed Members

**Cause**: Initial section sizes were too conservative.
**Fix**: Use auto-select optimization to find lighter sections. Group members to reduce section variety.

## Wrapping Up

The design modules in SAP2000 are solid once you get the parameters right. The thing I see junior engineers struggle with most is unbraced length — get that wrong and your capacity calculations are off, sometimes dramatically. Take the time to set K factors and unbraced lengths properly for each member. The auto-select optimization is great for steel — let the software iterate and find the lightest section that works, then do a manual review.
