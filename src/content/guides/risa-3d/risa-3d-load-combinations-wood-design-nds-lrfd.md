---
title: "RISA-3D Load Combinations and Wood Design: NDS and LRFD Workflow"
excerpt: "How to configure load combinations in RISA-3D for wood design per NDS — covering ASD vs LRFD combinations, load duration factors, and wood member design checks."
category: "standards"
softwareSlug: "risa-3d"
keyword: "risa-3d load combinations wood design nds lrfd"
slug: "risa-3d-load-combinations-wood-design-nds-lrfd"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://help.risa.com/risahelp/risa3d/Content/Loads-2D-3D/Loads-LoadCombinations.htm"
  - "https://help.risa.com/risahelp/risafloor/Content/Common_Design/Wood%20-%20Design.htm"
---

# RISA-3D Load Combinations and Wood Design: NDS and LRFD Workflow

Wood design in RISA-3D follows the NDS (National Design Specification for Wood Construction). The key difference from steel or concrete is the **load duration factor (CD)** — wood is stronger under short-duration loads. I design wood structures in RISA regularly. Here's the complete workflow.

## ASD vs LRFD for Wood

The NDS supports both ASD and LRFD. RISA-3D can do either, but most wood design in the US uses ASD.

### ASD Load Combinations (NDS)

| Combination | CD Factor | Duration |
|------------|-----------|----------|
| D | 0.9 | Permanent |
| D + L | 1.0 | 10 years (occupancy live load) |
| D + Lr (or S or R) | 1.15 | 1 month (roof live, snow, rain) |
| D + 0.75L + 0.75(Lr or S or R) | 1.15 | 1 month |
| D + 0.6W | 1.6 | 10 minutes (wind) |
| D + 0.75L + 0.75(0.6W) | 1.6 | 10 minutes |
| D + 0.7E | 1.6 | 10 minutes (seismic) |
| D + 0.75L + 0.75(0.7E) | 1.6 | 10 minutes |
| 0.6D + 0.6W | 1.6 | 10 minutes (uplift) |
| 0.6D + 0.7E | 1.6 | 10 minutes (uplift) |

The CD factor increases the allowable stress for short-duration loads. Wood can carry more load for a short time because of its viscoelastic properties.

### LRFD Load Combinations

RISA also supports LRFD for wood (NDS Appendix N):

| Combination | Duration Factor (λ) |
|------------|---------------------|
| 1.4D | 0.6 |
| 1.2D + 1.6L | 0.7 |
| 1.2D + 1.6(Lr or S or R) | 0.8 |
| 1.2D + 1.0W + 0.5L | 1.0 |
| 1.2D + 1.0E + 0.5L + 0.2S | 1.0 |
| 0.9D + 1.0W | 1.0 |
| 0.9D + 1.0E | 1.0 |

## Step 1: Define Wood Materials

1. **Model** → **Materials** → **Add**.
2. Select wood species and grade:
   - **Douglas Fir-Larch No.2**: Fb = 900 psi, Fv = 180 psi, Fc⊥ = 625 psi, Fc∥ = 1,350 psi, E = 1,700,000 psi
   - **Southern Pine No.2**: Fb = 1,000 psi, Fv = 175 psi, Fc⊥ = 565 psi, Fc∥ = 1,150 psi, E = 1,400,000 psi
   - **Spruce-Pine-Fir No.2**: Fb = 875 psi, Fv = 135 psi, Fc⊥ = 425 psi, Fc∥ = 1,150 psi, E = 1,400,000 psi

3. For engineered wood:
   - **Glulam (24F-V4)**: Fb = 2,400 psi, Fv = 190 psi, E = 1,800,000 psi
   - **LVL (1.9E)**: Fb = 2,800 psi, Fv = 285 psi, E = 1,900,000 psi

## Step 2: Define Wood Sections

1. **Model** → **Sections** → **Wood**.
2. Select dimensional lumber:
   - 2×4 (1.5"×3.5" actual)
   - 2×6 (1.5"×5.5")
   - 2×8 (1.5"×7.25")
   - 2×10 (1.5"×9.25")
   - 2×12 (1.5"×11.25")
   - 4×4 (3.5"×3.5")
   - 6×6 (5.5"×5.5")

3. For glulam:
   - Enter actual dimensions (e.g., 5.125"×18")
   - Set the grade combination

4. For I-joists:
   - Select from manufacturer database (TJI, BCI, etc.)
   - Or enter custom section properties

## Step 3: Define Load Cases

1. **Load** → **Load Cases**.
2. Create load cases:
   - **Dead (D)**: Self-weight + permanent loads
   - **Live (L)**: Occupancy live load
   - **Roof Live (Lr)**: Roof live load
   - **Snow (S)**: Snow load
   - **Wind (W)**: Wind load
   - **Seismic (E)**: Seismic load

3. For each load case, set the **Load Duration**:
   - Dead: Permanent
   - Live: 10 years
   - Roof Live / Snow: 1 month
   - Wind / Seismic: 10 minutes

4. RISA uses this to automatically apply the correct CD factor in combinations.

## Step 4: Create Load Combinations

1. **Load** → **Load Combinations**.
2. RISA auto-generates NDS combinations:
   - Select **Wood (NDS)** as the design code
   - Select **ASD** or **LRFD**
   - Click **Generate**

3. Review the generated combinations:
   - Each combination has the correct CD factor applied
   - Verify the factors match NDS requirements

4. For custom combinations:
   - Click **Add** → enter the combination manually
   - Set the CD factor explicitly

## Step 5: Apply Loads

### Distributed Loads on Beams

1. **Load** → **Distributed Loads**.
2. Select the member → enter load value:
   - Dead: 10 lb/ft (framing) + 15 lb/ft (floor finish) = 25 lb/ft
   - Live: 40 lb/ft² × 1.33 ft spacing = 53 lb/ft

### Point Loads

1. **Load** → **Point Loads**.
2. Select a node → enter force value and direction.

### Area Loads (for framing)

1. **Load** → **Area Loads**.
2. Draw the area → enter load magnitude (psf).
3. RISA distributes the area load to supporting members based on tributary width.

## Step 6: Analysis

1. **Solve** → **Solve Single Combination** (for checking one combination) or **Solve All** (for all combinations).
2. RISA solves the model and displays results.

## Step 7: Wood Design Checks

1. **Design** → **Member Design** → select wood members.
2. Set design parameters:
   - **Code**: NDS 2018 or NDS 2024
   - **Design method**: ASD or LRFD
   - **Repetitive member factor (Cr)**: 1.15 (for closely spaced members, 16" o.c. or less)
   - **Incising factor (Ci)**: 1.0 (for non-incised lumber)
   - **Temperature factor (Ct)**: 1.0 (for normal temperature)
   - **Wet service factor (CM)**: 1.0 (for dry conditions)

3. RISA checks each member:

### Bending Check

- **Actual bending stress**: fb = M / S
- **Allowable bending**: Fb' = Fb × CD × CM × Ct × CF × Ci × Cr
  - CF = size factor (reduces capacity for larger members)
  - Cr = repetitive member factor (1.15 for 3+ closely spaced members)
- **Unity check**: fb / Fb' ≤ 1.0

### Shear Check

- **Actual shear stress**: fv = 1.5V / (b×d)
- **Allowable shear**: Fv' = Fv × CD × CM × Ct × Ci
- **Unity check**: fv / Fv' ≤ 1.0

### Compression Check (Columns)

- **Compression parallel to grain**: fc = P / A
- **Allowable compression**: Fc' = Fc × CD × CM × Ct × CF × Ci × CP
  - CP = column stability factor (accounts for buckling)
- **Unity check**: fc / Fc' ≤ 1.0

### Deflection Check

- **Actual deflection**: From analysis results
- **Allowable deflection**:
  - Floor: L/360 (live), L/240 (total)
  - Roof: L/180 (live, no ceiling), L/240 (live, with ceiling)

### Combined Bending and Axial (Beam-Columns)

For members with both bending and axial load:
- (fc / Fc')² + (fb / Fb')² ≤ 1.0 (simplified)
- RISA uses the full NDS interaction equation (Eq. 3.9-3 for ASD)

## Common Wood Design Issues

**Deflection governs**: Wood is flexible — deflection often governs before strength. If the unity check for bending is < 0.7 but deflection exceeds limits, increase the member depth (more effective than width for deflection).

**Size factor reduces capacity**: Larger wood members have lower allowable stresses due to the size effect (probability of defects increases with size). A 2×12 has a lower Fb' per unit stress than a 2×8.

**Buckling in tall walls**: Wood stud walls under high axial load may buckle. Check the column stability factor (CP) — if CP < 0.5, the stud is buckling-critical. Add bracing or increase stud size.

**Moisture content**: If wood is exposed to moisture (treated lumber, exterior use), the wet service factor (CM) reduces capacity by 20-30%. Always check the service conditions.
