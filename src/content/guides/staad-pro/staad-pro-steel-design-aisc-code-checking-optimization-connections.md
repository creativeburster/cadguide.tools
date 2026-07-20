---
title: "STAAD.Pro Steel Design: AISC 360 Code Checking, Optimization, and Connection Design"
excerpt: "A guide to steel structure design in STAAD.Pro covering AISC 360 code checking, member optimization, unbraced length configuration, lateral-torsional buckling analysis, and steel connection design integration."
category: "workflow"
softwareSlug: "staad-pro"
keyword: "staad pro steel design aisc"
slug: "staad-pro-steel-design-aisc-code-checking-optimization-connections"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://docs.bentley.com/LiveContent/web/STAAD.Pro%20Help-v28/en/GUID-STEEL-DESIGN.html"
  - "https://www.bentley.com/software/staad/"
---

# STAAD.Pro Steel Design: AISC 360 Code Checking, Optimization, and Connection Design

Steel design in STAAD.Pro is where we spend a lot of our time on industrial projects. It's not just about picking a section that works — it's about code checking per AISC 360, optimizing for weight, and getting the design data ready for connection design. Let us walk you through the workflow we've refined over years of steel projects.

## AISC 360 Design Code Setup

### Selecting the Code

1. Design > Steel Design
2. Select code: AISC 360-16
3. Choose method:
   - **LRFD** (Load and Resistance Factor Design): φ factors applied to capacity
   - **ASD** (Allowable Strength Design): Ω factors applied to capacity
4. Set default parameters:
   - **FY**: Default yield strength (345 MPa for A992, 250 MPa for A36)
   - **FU**: Ultimate tensile strength (450 MPa for A992, 400 MPa for A36)

### Design Parameters per Member

Each member can have individual design parameters:

1. Select member(s)
2. Design > Steel > Design Parameters
3. Set:

| Parameter | Description | Default | Typical Value |
|-----------|-------------|---------|---------------|
| FY | Yield strength | From material | 345 MPa |
| CB | Lateral-torsional buckling modification factor | Calculated | 1.0 (conservative) |
| UNL | Unbraced length | Member length | Per bracing layout |
| LY | Unbraced length for Y-axis bending | Member length | Per bracing |
| LZ | Unbraced length for Z-axis bending | Member length | Per bracing |
| NSF | Net section factor | 1.0 | 0.85 (with bolt holes) |
| TMAIN | Main tension limit | From code | Per code |
| SST | Seismic detailing type | Non-seismic | SCBF, EBF, SMF |

### Unbraced Length Configuration

Unbraced length is critical for compression and flexural design:

1. Identify bracing points along each member:
   - **Beams**: Braced at beam-column connections, intermediate braces
   - **Columns**: Braced at floor levels, intermediate braces
   - **Braces**: Braced at endpoints only
2. Set UNL (total unbraced length) or:
   - **LY**: Unbraced length for bending about Y-axis
   - **LZ**: Unbraced length for bending about Z-axis
3. Example: A column braced at every floor (3.5m):
   - UNL = 3.5m (if braced in both directions)
   - Or LY = 3.5m, LZ = 7.0m (if braced only in one direction)

## Code Checking

### Running Design Checks

1. Design > Steel > Design All
2. STAAD checks each member for:

#### Axial Tension
- **Yielding**: φ × Fy × Ag (LRFD) or Ag × Fy / Ω (ASD)
- **Rupture**: φ × Fu × Ae (effective net area)
- Check: Unity ratio = Tension demand / Tension capacity

#### Axial Compression
- **Flexural buckling**: Based on slenderness ratio (KL/r)
- **Local buckling**: Based on width-thickness ratios (compact, noncompact, slender)
- Check: Unity ratio = Compression demand / Compression capacity

#### Flexure (Bending)
- **Yielding**: φ × Fy × Zx (plastic moment for compact sections)
- **Lateral-torsional buckling (LTB)**: Based on unbraced length
- **Local buckling**: Flange and web local buckling checks
- Check: Unity ratio = Moment demand / Moment capacity

#### Shear
- **Web yielding**: φ × 0.6 × Fy × Aw (for stocky webs)
- **Web buckling**: For slender webs
- Check: Unity ratio = Shear demand / Shear capacity

#### Combined Loading (Interaction)
- **AISC H1**: Combined axial + bending
- Unity ratio = (Pr/Pc) + (Mrx/Mcx) + (Mry/Mcy) ≤ 1.0
- For high axial: Pr/Pc + 8/9 × (Mrx/Mcx + Mry/Mcy) ≤ 1.0

### Reviewing Results

1. Post-processing > Steel > Unity Ratio
2. View unity ratios for all members:
   - **Green**: UR < 0.85 (adequate)
   - **Yellow**: 0.85 ≤ UR ≤ 1.0 (marginal)
   - **Red**: UR > 1.0 (inadequate — resize required)
3. Click a member to see:
   - **Critical load combination**: Which combo governs
   - **Critical check**: Which failure mode controls
   - **Demand vs. capacity**: Detailed values

## Member Optimization

### Running Optimization

1. Design > Steel > Optimize
2. Set optimization parameters:
   - **Section database**: Select available sections (W-shapes, HSS, etc.)
   - **Optimization target**: Minimum weight
   - **Constraints**:
     - Maximum depth (architectural limits)
     - Maximum width
     - Minimum section (for serviceability)
3. STAAD iterates:
   - Analyzes with current sections
   - Identifies over-designed members (UR < 0.5)
   - Selects lighter section
   - Re-analyzes
   - Repeats until all members are optimized

### Optimization Strategy

1. **Group members by type**: Columns, beams, braces
2. **Set section ranges per group**:
   - Columns: W12×45 to W12×120
   - Beams: W16×26 to W24×76
   - Braces: HSS 4×4 to HSS 8×8
3. **Optimize by group** (not individually):
   - All columns get the same section
   - Reduces fabrication complexity
4. **Re-run analysis after optimization**:
   - Changed sections change stiffness
   - Load distribution may shift
   - Verify unity ratios after optimization

## Seismic Design (AISC 341)

### Seismic Detailing Requirements

For seismic force-resisting systems:

1. Design > Steel > Seismic Parameters
2. Set system type:
   - **SMF** (Special Moment Frame): R=8, strict detailing
   - **IMF** (Intermediate Moment Frame): R=4.5
   - **OMF** (Ordinary Moment Frame): R=3.5
   - **SCBF** (Special Concentrically Braced Frame): R=6
   - **EBF** (Eccentrically Braced Frame): R=8
3. STAAD applies AISC 341 requirements:
   - **Compactness**: More restrictive width-thickness ratios
   - **Strong column / weak beam**: Column-to-beam strength ratio ≥ 1.0
   - **Panel zone**: Shear capacity of beam-column connection
   - **Brace slenderness**: KL/r limits for braces

### Overstrength Factor (Ω₀)

1. For seismic load combinations, apply overstrength:
   - **Combo**: 1.2 DL + Ω₀ × QE + 0.5 LL
   - **Ω₀ values**: 3.0 (SMF), 2.0 (SCBF), 2.5 (EBF)
2. Use overstrength combinations for:
   - Column design
   - Brace connections
   - Collector elements
   - Foundation design

## Connection Design Integration

### Exporting to STAAD Foundation Advanced

1. After analysis, export reactions:
  . File > Export > Foundation Reactions
2. Import into STAAD Foundation Advanced for:
   - Spread footing design
   - Pile cap design
   - Mat foundation design

### Exporting to RAM Connection

1. Design > Steel > Connection Design
2. STAAD exports member forces to RAM Connection
3. RAM Connection designs:
   - **Shear connections**: Single-plate, double-angle, end-plate
   - **Moment connections**: Flange-plate, extended end-plate
   - **Base plates**: Column base plate design
4. Select connection type per joint
5. RAM Connection checks:
   - Bolt shear and tension
   - Plate yielding and buckling
   - Weld capacity
   - Block shear

## Serviceability Checks

### Deflection Limits

1. Post-processing > Beam > Displacement
2. Check deflection against limits:

| Element | Load Case | Limit |
|---------|----------|-------|
| Floor beams | Live load | L/360 |
| Floor beams | Total load | L/240 |
| Roof beams | Live load | L/180 |
| Cantilever beams | Live load | L/180 |
| Columns drift | Wind/seismic | h/400 (typical) |

3. If deflection exceeds limits:
   - Increase section depth (most effective for deflection)
   - Increase moment of inertia
   - Add camber (for long-span beams)

### Vibration

1. For floor vibration analysis:
  . Analysis > Dynamic > Natural Frequencies
2. Check fundamental frequency:
   - **Offices**: ≥ 5 Hz
   - **Residential**: ≥ 8 Hz
   - **Walking bridges**: ≥ 5 Hz
3. If frequency is too low:
   - Increase beam stiffness
   - Add damping
   - Reduce span

## Best Practices

1. **Use correct unbraced lengths** — the most common source of over/under-design
2. **Group members for optimization** — reduces fabrication costs
3. **Check both LRFD and ASD** — some owners require ASD
4. **Verify serviceability** — strength is not enough; deflection and vibration matter
5. **Apply seismic detailing** — for structures in seismic zones
6. **Export to connection design** — member design is only half the job
7. **Review critical load combinations** — understand which loads govern
8. **Document design assumptions** — unbraced lengths, support conditions, load paths

## Wrapping Up

Steel design in STAAD is where we spend a lot of time on industrial projects, and the workflow works well once you get the hang of it. The two things we always emphasize: get unbraced lengths right (they make or break your capacity calculations), and use grouping for optimization — it reduces the number of different sections on your project, which saves fabrication cost. Don't forget to export to RAM Connection for the joint design — member design is only half the job.
