---
title: "MIDAS Civil PSC Bridge Design: Prestress Loss, Tendon Profiling, and Stress Checks"
excerpt: "A guide to prestressed concrete bridge design in MIDAS Civil covering tendon profiling, prestress loss calculation (elastic shortening, creep, shrinkage, relaxation), stress checks at transfer and service, and ultimate strength design per AASHTO LRFD."
category: "workflow"
softwareSlug: "midas-civil"
keyword: "midas civil psc bridge design"
slug: "midas-civil-psc-bridge-design-prestress-loss-tendon-profiling-stress-checks"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://globalsupport.midasuser.com/"
  - "https://academy.midasuser.com/"
---

# MIDAS Civil PSC Bridge Design: Prestress Loss, Tendon Profiling, and Stress Checks

Prestressed concrete bridge design is one of our favorite topics — there's something satisfying about profiling tendons and watching the stress checks come out green. MIDAS Civil handles the full PSC workflow: tendon profiling, prestress loss calculation, and stress checks per AASHTO LRFD. Let us walk you through how we set up a PSC bridge design.

## PSC Section Definition

### Box Girder Section

1. Model > Section > PSC Section
2. Define box girder:
   - **Top slab width**: 12.0m
   - **Top slab thickness**: 250mm
   - **Bottom slab width**: 6.0m
   - **Bottom slab thickness**: 200mm (variable)
   - **Web thickness**: 400mm (two webs)
   - **Total depth**: 2.0m
   - **Fillets**: 300×300mm at web-slab junctions
3. Calculate section properties:
   - Area (A), Centroid (yc), Moment of inertia (Iy, Iz)
   - Section modulus (St = we/yc, Sb = we/(h-yc))

### we-Girder Section

1. Model > Section > PSC Section > we-Beam
2. Define:
   - **Top flange width**: 500mm
   - **Top flange thickness**: 200mm
   - **Web thickness**: 200mm
   - **Bottom flange width**: 600mm
   - **Bottom flange thickness**: 300mm
   - **Total height**: 1800mm

### Material Properties

1. Model > Material
2. Set:
   - **Concrete (girder)**: f'c = 40 MPa, f'ci = 35 MPa (at transfer)
   - **Concrete (deck)**: f'c = 30 MPa
   - **Prestressing strand**: fpu = 1860 MPa, fpy = 1674 MPa (0.9 × fpu)
   - **Eps**: 195,000 MPa
   - **Rebar**: fy = 420 MPa

## Tendon Profiling

### Tendon Layout

1. Load > Prestress > Tendon Profile
2. Define tendon profile:
   - **Tendon type**: Internal (bonded or unbonded) or external
   - **Number of tendons**: e.g., 12 tendons
   - **Strands per tendon**: e.g., 19 strands of 15.2mm diameter
   - **Tendon area**: Ap = 19 × 140 = 2660 mm² per tendon

### Tendon Geometry

1. Define tendon path along the girder:
   - **Harparabolic profile**: Most common for continuous girders
   - **Straight + harped**: For simply supported girders
2. Set control points:
   - **At supports**: Tendon near top of section (negative moment region)
   - **At midspan**: Tendon near bottom of section (positive moment region)
3. Set eccentricity at each control point:
   - **At support**: e = +800mm (above centroid)
   - **At midspan**: e = -800mm (below centroid)
4. MIDAS Civil generates smooth tendon profile

### Tendon Stressing

1. Load > Prestress > Stressing
2. Set:
   - **Jacking stress**: fpj = 0.75 × fpu = 1395 MPa
   - **Stressing method**: Pre-tensioned or post-tensioned
   - **Stressing sequence**: Both ends or one end
   - **Anchorage set**: Slip = 6mm (typical for post-tensioned)

## Prestress Loss Calculation

### Immediate Losses

#### Elastic Shortening (ES)

1. MIDAS Civil calculates:
   - ΔfpES = Ep × Δfc/Eci
   - Δfc: Change in concrete stress at tendon centroid due to prestress
   - Eci: Modulus at transfer (lower than final Ec)
2. For sequential stressing:
   - First tendon: Full elastic shortening loss
   - Last tendon: Zero elastic shortening loss
   - Average: 50% of full loss

#### Anchorage Set Loss

1. For post-tensioned tendons:
   - ΔfpAS = (ΔL × Ep) / L
   - ΔL: Anchorage slip (6mm typical)
   - L: Tendon length
2. Loss is highest at jacking end and decreases with distance

#### Friction Loss

1. For post-tensioned tendons:
   - ΔfpF = fpj × (1 - e^(-(μα + KL)))
   - μ: Curvature friction coefficient (0.25 for steel ducts)
   - α: Cumulative angle change (radians)
   - K: Wobble friction coefficient (0.0017 per meter)
   - L: Tendon length from jacking end

### Long-Term Losses

#### Creep Loss (CR)

1. MIDAS Civil calculates:
   - ΔfpCR = Ep × εcreep = Ep × (φ(t,ta) × Δfc/Ec)
   - φ(t,ta): Creep coefficient per ACI 209 or CEB-FIP
   - Δfc: Sustained concrete stress at tendon level
2. Creep loss develops over years (50% in 1 year, 100% in 30 years)

#### Shrinkage Loss (SH)

1. MIDAS Civil calculates:
   - ΔfpSH = Ep × εshrinkage
   - εshrinkage: Per ACI 209 or CEB-FIP model
   - Typical: 200-400 × 10⁻⁶
2. Shrinkage loss develops over years

#### Relaxation Loss (RE)

1. MIDAS Civil calculates:
   - ΔfpRE = fpj × (log(t)/log(1000)) × RE_factor
   - RE_factor: 1.5% for low-relaxation strand (per AASHTO 5.9.5.3.2b)
   - t: Time in hours after stressing
2. Relaxation is relatively small (2-3% of fpj)

### Total Prestress Loss

1. MIDAS Civil reports total loss per tendon:
   - **Immediate**: ES + AS + Friction
   - **Long-term**: CR + SH + RE
   - **Total**: Immediate + Long-term
2. Typical total loss: 15-25% of fpj
3. Effective prestress: fpe = fpj - Total Loss

## Stress Checks

### At Transfer (Initial)

1. Design > PSC Design > Stress Check > Transfer
2. Check concrete stresses immediately after transfer:
   - **Compression (top)**: fc = Pi/Ag - Pi×e/St + Mdl/St
     - Limit: 0.60 × f'ci (per AASHTO 5.9.4.1.1)
   - **Tension (bottom)**: ft = Pi/Ag + Pi×e/Sb - Mdl/Sb
     - Limit: 0.24 × √f'ci (without bonded reinforcement)
     - Limit: 0.58 × √f'ci (with bonded reinforcement)
3. If stresses exceed limits:
   - Increase section size
   - Reduce jacking stress
   - Add temporary support
   - Add reinforcement in tension zone

### At Service (Final)

1. Design > PSC Design > Stress Check > Service
2. Check concrete stresses under full service loads:
   - **Compression (top)**: fc = Pe/Ag - Pe×e/St + (Mdl + Mll)/St
     - Limit: 0.60 × f'c (per AASHTO 5.9.4.2.1)
   - **Tension (bottom)**: ft = Pe/Ag + Pe×e/Sb - (Mdl + Mll)/Sb
     - Limit: 0.50 × √f'c (with bonded reinforcement and severe exposure)
     - Limit: 0.58 × √f'c (with bonded reinforcement and moderate exposure)
3. If stresses exceed limits:
   - Increase prestress force
   - Add more tendons
   - Increase section size
   - Add non-prestressed reinforcement

### Decompression Check

1. For crack control:
   - Verify that tendon stress does not exceed decompression stress
   - Decompression: When concrete stress at tendon level reaches zero
   - fpe + Δfp (due to live load) ≤ fpy (yield stress of strand)

## Ultimate Strength Design

### Flexural Strength

1. Design > PSC Design > Flexural Strength
2. MIDAS Civil calculates:
   - **Nominal moment (Mn)**: 
     - For rectangular section: Mn = Aps × fps × (dp - a/2)
     - fps: Strand stress at ultimate (per AASHTO 5.7.3.1)
     - a: Depth of equivalent stress block
   - **Factored moment (Mu)**: From load combinations
   - **Check**: φMn ≥ Mu
     - φ = 0.90 (tension-controlled)
     - φ = 0.75 (compression-controlled)

### Shear Strength

1. Design > PSC Design > Shear Strength
2. MIDAS Civil calculates:
   - **Concrete shear (Vc)**: Per AASHTO 5.8.3.3
     - Vc = 0.0316 × β × √f'c × bv × dv
     - β: Per AASHTO 5.8.3.4.2
   - **Prestress contribution (Vp)**: Vertical component of tendon force
   - **Stirrup shear (Vs)**: Vs = Av × fy × dv / s
   - **Total**: φVn = φ(Vc + Vp + Vs)
   - **Check**: φVn ≥ Vu

## Tendon Stress Distribution

1. Results > Prestress > Tendon Stress
2. View stress along each tendon:
   - **At jacking end**: fpj (maximum)
   - **Along tendon**: Decreasing due to friction
   - **At anchor end**: fpj - friction loss
   - **After all losses**: fpe (effective prestress)
3. Verify all tendon stresses are within limits:
   - fpj ≤ 0.75 × fpu (jacking)
   - fpe ≥ 0.50 × fpu (after losses, minimum effective)

## Camber and Deflection

### Camber Calculation

1. Results > Prestress > Camber
2. MIDAS Civil calculates:
   - **Immediate camber**: Due to prestress force (upward)
   - **Dead load deflection**: Due to self-weight (downward)
   - **Net camber**: Prestress camber - dead load deflection
   - **Long-term camber**: Including creep multiplier (typically 2.0-3.0)
3. Use camber for:
   - Setting formwork elevation
   - Providing upward camber to compensate for long-term deflection

### Long-Term Deflection

1. Results > Prestress > Long-Term Deflection
2. View deflection over time:
   - **At transfer**: Immediate (elastic)
   - **At 1 year**: Including 50% creep and 70% shrinkage
   - **At 10 years**: Including 90% creep and 95% shrinkage
   - **At 30 years**: Including 100% creep and 100% shrinkage
3. Check:
   - **Total deflection**: ≤ L/240 (typical for PSC bridges)
   - **Live load deflection**: ≤ L/800 (vehicular)

## Wrapping Up

PSC bridge design in MIDAS Civil is comprehensive and well-organized. The thing we always emphasize: get your prestress losses right. The effective prestress after losses determines everything — stress checks, deflection, ultimate capacity. Don't just accept the default loss parameters; check them against your project's specifications. And always check stresses at transfer — that's when the concrete is youngest and weakest, and the prestress force is highest.
