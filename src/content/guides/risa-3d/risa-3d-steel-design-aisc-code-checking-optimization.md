---
title: "RISA-3D Steel Design: AISC Code Checking and Member Optimization"
excerpt: "How to perform steel member design in RISA-3D per AISC 360 — covering section selection, unbraced length definition, code checking results, and member optimization for efficient steel framing."
category: "standards"
softwareSlug: "risa-3d"
keyword: "risa-3d steel design aisc code checking optimization"
slug: "risa-3d-steel-design-aisc-code-checking-optimization"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://blog.risa.com/post/how-can-i-optimize-my-members-in-risa-3d"
  - "https://help.risa.com/risahelp/risa3d/Content/HotRolled/Hot%20Rolled%20Steel%20-%20Design%20Results.htm"
---

# RISA-3D Steel Design: AISC Code Checking and Member Optimization

Steel design in RISA-3D follows AISC 360 (LRFD or ASD). The code checking is automatic — you define the members and loads, RISA checks every member against the code. We've optimized hundreds of steel frames in RISA. Here's the workflow.

## Step 1: Set Design Code

1. **Model** → **Model Settings** → **Solution** → **Design Code**.
2. Select:
   - **AISC 360-22 LRFD** (for LRFD design)
   - **AISC 360-22 ASD** (for ASD design)
3. Set steel design parameters:
   - **Φ (LRFD)**: 0.90 for bending, 0.90 for compression
   - **Ω (ASD)**: 1.67 for bending, 1.67 for compression

## Step 2: Define Unbraced Lengths

Unbraced length is the most critical parameter for steel design. It determines the buckling capacity of columns and the lateral-torsional buckling capacity of beams.

1. **Model** → **Members** → select member → **Design Properties**.
2. Set unbraced lengths:

### Lbyy (Unbraced length for Y-axis bending)

- The distance between points of lateral support for the compression flange
- For a beam with the top flange continuously braced by a floor deck: Lbyy = 0
- For a beam with discrete bracing at third points: Lbyy = L/3
- For an unbraced beam: Lbyy = full member length

### Lbzz (Unbraced length for Z-axis bending)

- Same concept, for the other axis
- Usually the full member length unless braced

### Lu (Unbraced length for compression)

- For columns: distance between bracing points in each direction
- Luyy = unbraced length for Y-axis buckling
- Luzz = unbraced length for Z-axis buckling

### K-factors (Effective length factor)

- **K = 1.0**: Pinned-pinned (braced frame, sidesway inhibited)
- **K = 0.8**: Fixed-pinned
- **K = 0.65**: Fixed-fixed
- **K = 2.0**: Cantilever (fixed-free)
- **K > 1.0**: Unbraced frames (sidesway uninhibited) — use alignment charts or RISA's auto-calc

RISA can auto-calculate K-factors:
1. **Model** → **Model Settings** → **Steel** → **Auto-calculate K-factors**.
2. RISA analyzes the frame geometry and support conditions to determine K for each member.
3. Verify auto-calculated values — they may not account for all bracing conditions.

## Step 3: Define Cb (Lateral-Torsional Buckling Factor)

Cb accounts for non-uniform moment distribution:

- **Cb = 1.0**: Uniform moment (conservative default)
- **Cb = 1.67**: Moment varies linearly from zero at one end to maximum at other
- **Cb = 2.27**: Reverse curvature with equal end moments
- **Cb > 1.0**: Increases LTB capacity (beneficial)

RISA can auto-calculate Cb:
1. **Model** → **Model Settings** → **Steel** → **Auto-calculate Cb**.
2. RISA calculates Cb based on the moment diagram for each member.
3. This typically increases capacity by 20-30% compared to Cb = 1.0.

## Step 4: Run Code Check

1. **Solve** → **Solve and Code Check**.
2. RISA analyzes the model and checks every steel member:

### Checks Performed

| Check | AISC Equation | Description |
|-------|---------------|-------------|
| Flexural yielding | F2-1 | Moment capacity vs demand |
| Lateral-torsional buckling | F2-2, F2-3 | LTB capacity based on unbraced length |
| Shear yielding | G2-1 | Shear capacity |
| Compression | E3-1, E3-2 | Flexural buckling |
| Tension | D2-1 | Tensile yielding |
| Combined axial + bending | H1-1, H1-2 | Interaction equation |

### Unity Check (UC)

For each member, RISA reports a Unity Check:
- **UC = demand / capacity**
- **UC < 1.0**: Member passes
- **UC > 1.0**: Member fails — increase section size
- **UC 0.85-0.95**: Optimally designed

## Step 5: Review Results

1. **Results** → **Member Code Checks**.
2. The spreadsheet shows:
   - Member ID
   - Governing load combination
   - UC value
   - Governing check (bending, compression, shear, interaction)
   - Capacity vs demand

3. Sort by UC (highest first) to identify critical members.
4. Members with UC > 1.0 are highlighted in red.

### Visual Results

1. **View** → **Code Check Colors**:
   - **Green**: UC < 0.85 (well-designed)
   - **Yellow**: UC 0.85-1.0 (near capacity)
   - **Red**: UC > 1.0 (fails)

2. **View** → **Moment Diagrams**: Review moment distribution to understand why a member fails.

## Step 6: Member Optimization

### Manual Optimization

1. Identify members with UC > 1.0 (fail) or UC < 0.5 (over-designed).
2. For failing members:
   - Try a larger section: W18×35 → W18×40
   - Or a deeper section: W16×31 → W18×35
3. For over-designed members:
   - Try a lighter section: W18×35 → W16×26
4. Re-run the analysis and code check.
5. Iterate until all members have UC between 0.7 and 1.0.

### RISA Optimizer

1. **Design** → **Optimize**.
2. Select members to optimize.
3. Set optimization criteria:
   - **Target UC**: 0.85-0.95
   - **Section database**: AISC W-shapes
   - **Constraints**: Maximum depth, maximum weight
4. Click **Optimize**.
5. RISA iterates through the section database:
   - Starts with the current section
   - Tests lighter sections (if UC < target)
   - Tests heavier sections (if UC > 1.0)
   - Selects the lightest section that achieves UC ≤ target
6. Review the optimized sections and accept or reject.

## Step 7: Detailing and Output

### Member Schedule

1. **Results** → **Member Schedule**.
2. Export to Excel or PDF:
   - Member ID
   - Section
   - Length
   - Maximum forces
   - UC value
   - Governing check

### Design Report

1. **File** → **Report**.
2. Select report contents:
   - Model summary
   - Load cases and combinations
   - Member forces
   - Code check results
   - Reactions
   - Deflections
3. Generate a professional report for submission.

## Common Steel Design Issues

**LTB governs beam design**: If the governing check is lateral-torsional buckling, add lateral bracing to reduce Lb. This is often more economical than increasing the section size. A W18×35 with Lb=0 has 2-3× the moment capacity of the same beam with Lb=20ft.

**K-factor too high for unbraced frames**: Auto-calculated K-factors for moment frames can be 2-3, significantly reducing column capacity. Consider adding bracing to convert to a braced frame (K=1.0).

**Weak-axis bending governs**: If the member has significant minor-axis moment (Mz), consider a square HSS section which has equal capacity in both axes. W-shapes have much lower weak-axis capacity.

**Shear governs for short, heavily loaded beams**: Short beams with high loads may fail in shear before bending. Check the shear UC — if it governs, use a heavier section or add web stiffeners.
