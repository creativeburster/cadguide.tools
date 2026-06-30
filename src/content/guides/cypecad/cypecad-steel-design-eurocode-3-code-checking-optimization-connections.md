---
title: "CYPECAD Steel Design: Eurocode 3 Code Checking, Member Optimization, and Connection Design"
excerpt: "A guide to steel structure design in CYPECAD covering Eurocode 3 code checking for beams, columns, and braces, section optimization, fire design per EN 1993-1-2, and steel connection design with CYPE Connect."
category: "workflow"
softwareSlug: "cypecad"
keyword: "cypecad steel design eurocode"
slug: "cypecad-steel-design-eurocode-3-code-checking-optimization-connections"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://manual.cype.com/cypecad/steel/"
  - "https://www.cype.com/en/cypecad/"
---

# CYPECAD Steel Design: Eurocode 3 Code Checking, Member Optimization, and Connection Design

Steel design in CYPECAD per Eurocode 3 is straightforward once you've done it a few times. The code checking, section optimization, and connection design through CYPE Connect cover most of what I need for steel building projects in Europe. Let me walk you through the workflow I use.

## Steel Section Database

### Available Sections

1. Beams > Steel Sections
2. Select from database:
   - **IPE**: European I-beams (IPE 80 to IPE 600)
   - **HEA/HEB/HEM**: European H-sections (HEA 100 to HEM 1000)
   - **UPN**: European channels (UPN 80 to UPN 400)
   - **L-sections**: Equal and unequal angles
   - **Tubular**: Square (SHS), rectangular (RHS), circular (CHS)
   - **Custom**: User-defined sections
3. Set material:
   - **S235**: fy = 235 MPa
   - **S275**: fy = 275 MPa
   - **S355**: fy = 355 MPa
   - **S420**: fy = 420 MPa
   - **S460**: fy = 460 MPa

## Section Classification

### Eurocode 3 Classification

CYPECAD automatically classifies sections per EN 1993-1-1 Table 5.2:

| Class | Description | Design Method |
|-------|-------------|---------------|
| Class 1 | Compact (can form plastic hinge) | Plastic design |
| Class 2 | Compact (can develop plastic moment) | Plastic design |
| Class 3 | Semi-compact (can reach yield) | Elastic design |
| Class 4 | Slender (local buckling before yield) | Effective section |

### Classification Parameters

1. CYPECAD checks:
   - **Flange slenderness**: c/tf ≤ limit (per Table 5.2)
   - **Web slenderness**: d/tw ≤ limit (per Table 5.2)
   - **Depends on**: Section type, material grade, stress distribution
2. Example:
   - IPE 300, S355: Class 1 (flange c/tf = 5.5 < 9ε = 7.6)
   - HEA 200, S355: Class 2 (flange c/tf = 7.0 < 10ε = 8.4)

## Code Checking per EN 1993-1-1

### Tension Members

1. **Plastic resistance**: Npl,Rd = A × fy / γM0
2. **Ultimate resistance at net section**: Nu,Rd = 0.9 × A_net × fu / γM2
3. **Check**: NEd ≤ min(Npl,Rd, Nu,Rd)
4. γM0 = 1.0, γM2 = 1.25

### Compression Members

1. **Cross-section resistance**: Nc,Rd = A × fy / γM0
2. **Buckling resistance**: Nb,Rd = χ × A × fy / γM1
   - χ: Reduction factor based on slenderness ratio λ̄
   - λ̄ = √(A × fy / Ncr) where Ncr = π²EI / (KL)²
   - χ from buckling curves (a, b, c, d) per section type
3. **Check**: NEd ≤ Nb,Rd

### Bending Members

1. **Class 1-2 (plastic)**: Mc,Rd = Wpl × fy / γM0
2. **Class 3 (elastic)**: Mc,Rd = Wel × fy / γM0
3. **Class 4 (effective)**: Mc,Rd = Weff × fy / γM0
4. **Lateral-torsional buckling**: Mb,Rd = χLT × Wy × fy / γM1
   - χLT: Reduction factor based on λ̄LT
   - λ̄LT = √(Wy × fy / Mcr) where Mcr = elastic critical moment
5. **Check**: MEd ≤ Mb,Rd

### Shear

1. **Plastic shear resistance**: Vpl,Rd = Av × fy / (√3 × γM0)
2. **Shear buckling** (for slender webs): Per EN 1993-1-5
3. **Check**: VEd ≤ Vpl,Rd

### Combined Loading (Interaction)

1. **Bending + axial (EN 1993-1-1 6.3.3)**:
   - For Class 1-2 sections:
   - NEd/Npl,Rd + MEd,y/Mpl,y,Rd + MEd,z/Mpl,z,Rd ≤ 1.0
   - With buckling modifiers per 6.3.3(4)
2. **Shear + bending**:
   - If VEd ≤ 0.5 × Vpl,Rd: No reduction in moment capacity
   - If VEd > 0.5 × Vpl,Rd: Reduced moment capacity per 6.2.8

## Section Optimization

### Running Optimization

1. Results > Steel > Optimize
2. Set:
   - **Section list**: Available sections for each member group
   - **Optimization target**: Minimum weight
   - **Constraints**: Maximum depth, maximum width
3. CYPECAD iterates:
   - Analyzes with current sections
   - Identifies over-designed members (utilization < 0.5)
   - Selects lighter section
   - Re-analyzes
   - Repeats until all members optimized

### Group Optimization

1. Group members by type:
   - **Columns**: Group all columns on same grid line
   - **Beams**: Group all beams with same span and load
   - **Braces**: Group all braces on same face
2. Assign same section to each group
3. Reduces fabrication complexity and cost

## Fire Design (EN 1993-1-2)

### Fire Resistance

1. Results > Steel > Fire Design
2. Set:
   - **Fire resistance**: R30, R60, R90, R120 (minutes)
   - **Fire protection**: None, boards, intumescent coating, concrete encasement
   - **Critical temperature**: θcr = 0.7 × fy (typical)
3. CYPECAD calculates:
   - **Critical temperature**: Per EN 1993-1-2
   - **Section factor (Am/V)**: Exposed area per unit volume
   - **Time to critical temperature**: With or without protection
   - **Required protection thickness**: For specified fire rating
4. Check:
   - **Without protection**: Time to θcr ≥ required fire rating
   - **With protection**: Protection thickness sufficient for required rating

### Fire Protection Output

| Section | Fire Rating | Protection | Thickness |
|---------|------------|------------|-----------|
| IPE 300 | R60 | Boards | 15mm |
| HEA 200 | R90 | Intumescent | 1.2mm |
| SHS 100 | R30 | None | - |

## Connection Design (CYPE Connect)

### Launching CYPE Connect

1. Results > Connections > Launch CYPE Connect
2. Or: Open CYPE Connect as standalone
3. Import member forces from CYPECAD

### Connection Types

1. **Beam-to-column**: 
   - Fin plate (single plate shear connection)
   - End plate (bolted or welded)
   - Double angle cleat
   - Seated connection
2. **Column base**:
   - Pinned base plate
   - Fixed base plate
   - Grouted base plate
3. **Splices**:
   - Bolted cover plate splice
   - Welded splice
   - End plate splice

### Bolt Checks

1. CYPE Connect checks per EN 1993-1-8:
   - **Shear resistance**: Fv,Rd = αv × fub × A / γM2
   - **Tension resistance**: Ft,Rd = k2 × fub × As / γM2
   - **Combined shear + tension**: Fv,Ed/Fv,Rd + Ft,Ed/(1.4 × Ft,Rd) ≤ 1.0
   - **Bearing resistance**: Fb,Rd = k1 × αb × fu × d × t / γM2
2. Bolt grades:
   - Class 4.6: fub = 400 MPa
   - Class 5.6: fub = 500 MPa
   - Class 8.8: fub = 800 MPa
   - Class 10.9: fub = 1000 MPa

### Weld Checks

1. CYPE Connect checks per EN 1993-1-8:
   - **Fillet weld**: Fw,Rd = fu × a × βw / (√3 × γM2)
     - a: Throat thickness
     - βw: Correlation factor (0.85 for S355)
   - **Butt weld**: Full penetration = parent metal strength
2. Check: Fw,Ed ≤ Fw,Rd

### Connection Output

1. **Connection drawing**: Detailed drawing with dimensions
2. **Bolt layout**: Number, diameter, grade, spacing
3. **Weld sizes**: Throat thickness, weld length
4. **Plate dimensions**: Thickness, width, height
5. **Capacity ratios**: For each check (bolts, welds, plates)

## Seismic Design (EN 1998-1)

### Ductility Classes

1. Set behavior factor (q):
   - **DCL (Low)**: q = 1.5-2.0, limited ductility
   - **DCM (Medium)**: q = 3.0-4.0, moderate ductility
   - **DCH (High)**: q = 5.5-6.5, high ductility
2. Higher q → lower seismic forces but stricter detailing

### Seismic Detailing

1. For DCM and DCH:
   - **Section compactness**: Class 1 only (for high ductility)
   - **Overstrength**: Design columns for 1.3 × beam moment capacity
   - **Panel zone**: Check column web shear in beam-column connection
   - **Brace slenderness**: KL/r ≤ limit (per EN 1998-1)
   - **Concentric bracing**: Tension-only design for X-bracing

## Common Steel Design Issues

### Lateral-Torsional Buckling Controls

**Cause**: Long unbraced length for compression flange.
**Fix**: Add lateral bracing, increase section size, or use section with larger flange width.

### Excessive Deflection

**Cause**: Section too flexible for the span.
**Fix**: Increase section depth (most effective for deflection), add camber, or reduce span.

### Connection Fails

**Cause**: Insufficient bolts, welds, or plate thickness.
**Fix**: Add more bolts, increase bolt diameter, thicken plates, or increase weld size.

### Fire Protection Required

**Cause**: Steel reaches critical temperature before fire rating.
**Fix**: Add fire protection (boards, intumescent coating), increase section size (lower section factor), or encase in concrete.

## Wrapping Up

Steel design in CYPECAD per Eurocode 3 covers most of what I need for building projects. The section classification and buckling checks are reliable, and the CYPE Connect integration for joints is handy. My tip: pay attention to section classification — it determines which design method applies, and getting it wrong can lead to either unsafe or overly conservative designs. And don't forget fire design — it's often required by building regulations and CYPECAD handles it per EN 1993-1-2.
