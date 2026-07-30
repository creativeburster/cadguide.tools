---
title: "IDEA StatiCa Connection Analysis: Singularity Diagnosis, 0% Analysis Fix, Stop-at-Limit-Strain, GMNA for Hollow Sections, Bolt Gap/Slotted Hole Issues, and Mitre Cut Alignment"
excerpt: "IDEA StatiCa connection analysis fails for 7 distinct reasons: singularities from unconnected members, 0% analysis from material properties set to zero, Stop-at-Limit-Strain halting at partial load, GMNA instability with hollow sections, bolt gap exceeding 1/16\", slotted holes creating directional release, and Mitre cut butt weld misalignment on circular hollow sections. We cover each with diagnostic steps and fixes from official troubleshooting guides."
category: "connection-analysis-diagnostics"
softwareSlug: "idea-statica"
keyword: "IDEA StatiCa connection analysis singularity 0% GMNA hollow section stop limit strain bolt gap slotted hole mitre cut"
slug: "idea-statica-connection-analysis-singularity-gmna-bolt-gap-mitre-cut"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://www.ideastatica.com/blog/troubleshooting-idea-statica-connection-models"
  - "https://www.ideastatica.com/support-center/connection-analysis-0-or-doesn-t-reach-100"
  - "https://www.ideastatica.com/support-center/analysis-convergence"
---

# IDEA StatiCa Connection Analysis: Singularity Diagnosis, 0% Analysis Fix, Stop-at-Limit-Strain, GMNA for Hollow Sections, Bolt Gap/Slotted Hole Issues, and Mitre Cut Alignment

IDEA StatiCa uses CBFEM (Component-Based Finite Element Method) to analyze steel connections. The analysis can fail at multiple points: meshing, singularity detection, load application, and convergence. This guide covers the 7 most common failure modes with diagnostic approaches and fixes from the official IDEA StatiCa troubleshooting guide and support center.

## 1. Singularity: Member Not Connected to Joint

### Symptom

The word "singularity" appears at the top left of the modeling window after clicking Calculate. The analysis can't start because an element is not connected to the joint.

### Root Cause

A singularity occurs when:
- A member is not connected to the joint model
- There is a gap or overlapping of connecting items
- Missing welds at gusset plates
- Bolts are placed in slotted holes with the slot in the load direction (no restraint)

### Diagnosis

1. Go to the **Check tab** for more information
2. The Analysis tab shows which member causes the singularity (e.g., "M3")
3. Activate the **deformed shape** — the singularity cause is moved 1 m from its original position, making it easy to identify
4. Look for items that are free to move or rotate

### Fix

1. **Check for missing welds** — the most common cause. Ensure all connecting plates are welded to their members
2. **Verify bolt connections** — ensure bolts connect the correct plates
3. **Check for gaps** — the maximum allowable gap between plates connected by bolts is **1/16" (1.6mm)**
4. **Slotted holes**: If using slotted holes, the slot direction is released — no restraint in that direction. Add restraints or change to standard holes if the slot isn't needed for the load direction
5. **Check for openings** in the same position as bolts — this creates a disconnection

## 2. Analysis 0%: Material Properties Set to Zero

### Symptom

The analysis stops at 0% — no load is applied at all.

### Root Cause

If any material property is filled with 0 or a non-acceptable value, the finite element model cannot be calculated. This can be:
- Cross-section property set to 0
- Steel material property set to 0
- Bolt grade set to 0
- Any other material parameter

### Fix

1. **Check all material properties** in the project:
   - Cross-sections: verify dimensions are not zero
   - Materials: verify yield strength, ultimate strength, Young's modulus
   - Bolts: verify bolt grade and diameter
2. **Reset Code Setup to defaults** — some code setup modifications can influence analysis and set properties to unexpected values
3. **Verify the Code Setup applies to all project items** — configuration is global, not per-item

## 3. Analysis Stops Before 100%: Stop-at-Limit-Strain

### Symptom

The analysis stops at a percentage below 100% (e.g., 25%). The load is only partially applied.

### Root Cause

The **Stop at limit strain** option in Code Setup is active. When any part of the connection (plate, weld, bolt) reaches its capacity, the analysis halts before the full load is applied. This is a safety feature, not a bug.

### Example

A weld reaches 99% utilization at 25% of the applied load. The analysis stops to indicate the connection is overloaded.

### Fix

1. **Uncheck Stop at limit strain** in Code Setup to see the full picture:
   - The analysis will run to 100% of loads
   - You can observe the failure mode and plastic hinge formation
   - The connection is still overloaded — this just lets you see how it fails

2. **If the connection is genuinely overloaded**: Redesign the connection with:
   - Thicker plates
   - More bolts or larger bolts
   - Stronger welds
   - Additional stiffeners

3. **Reset Code Setup to defaults** — modifications can cause unexpected behavior

## 4. GMNA Instability with Hollow Section Bearing Members

### Symptom

When using a Hollow Structural Section (HSS) as the bearing member, the analysis breaks at a certain percentage. Large deformations are observed.

### Root Cause

GMNA (Geometrically Materially Nonlinear Analysis) is automatically used when the bearing member has a hollow section. When the connection is overloaded, hollow sections lose stability (local buckling), causing the analysis to break.

### Fix

1. **Disable GMNA** in Code Setup:
   - The analysis will finish to 100%
   - Reveals the failure mode of the hollow section and other parts
   - Results are less precise for hollow sections but show the overall behavior

2. **Redesign the connection** if the hollow section is failing:
   - Increase wall thickness
   - Add stiffeners
   - Change bearing member to a non-hollow section
   - Reduce load on the connection

3. **Keep GMNA enabled for final design** — it provides more precise results for hollow section connections

## 5. Bolt Gap Exceeding 1/16"

### Symptom

Meshing error or singularity related to bolted connection.

### Root Cause

The maximum allowable gap between plates connected by bolts is **1/16" (1.6mm)**. If the gap exceeds this, the bolt cannot properly transfer force between plates, creating a singularity.

### Fix

1. **Check plate alignment** — ensure plates are in contact or within 1/16" gap
2. **Add a filler plate** if the gap is intentional (shims)
3. **Adjust plate positions** in the model to eliminate the gap
4. **Verify bolt positions** — bolts must pass through both plates at the same location

## 6. Friction Connection: Praying Shear Force Not Transferred

### Symptom

Analysis fails for a clamp connection using preloaded bolts where force is transferred via friction/contact.

### Root Cause

CBFEM cannot directly calculate friction between plates. When only tension/compression is applied and transferred via contact (compression-only), a small prying shear force is generated. Since friction is not accounted for, this shear force is not transferred, making the model unstable.

### Fix

1. **Add a "utility" weld** to handle the small shear force:
   - Use a **Partial weld with Offset**
   - The weld handles the prying shear
   - Impact on model behavior is negligible
2. The analysis can then complete successfully

## 7. Mitre Cut Butt Weld Misalignment on Circular Hollow Sections

### Symptom

When using the Cut operation with Mitre cut method on circular hollow sections, the analysis results in 0%.

### Root Cause

The 1D elements of connected members are not aligned. Different angles or sizes prevent the operation from creating the butt weld needed for analysis.

### Diagnosis

Switch the 3D screen to **transparent mode** — the butt weld is represented by a **yellow line**. If the yellow line is missing, the butt weld wasn't created.

### Fix

1. **Change the α (Rotation) value** for one of the connected members
2. Adjust until the elements are aligned and the butt weld is created
3. Verify the yellow line appears in transparent mode
4. For circular hollow sections defined as polygons: the aspect ratio of finite shell elements in arc segments can cause 0% analysis — increase the number of polygon segments

## 8. Complex Connections: Split Into Multiple Analysis Items

### Symptom

A complex ridge connection with purlins (M1-M6) fails when all members are included. Removing M3-M6 allows analysis of M1 and M2.

### Fix

1. **Split the connection into multiple analysis items**:
   - Connection 1: Ridge connection (M1 and M2 only)
   - Connection 2: Purlin-to-rafter connection (worst reaction purlin with rafter)
2. **Don't model all connections in one item** — CBFEM has complexity limits
3. **Check purlin flange contact** — the purlin bottom flange may not have proper contact with the rafter top flange. Add a contact operation between them.
4. **Use N, Vx, Vy member type** for purlin end connections instead of moment connections

## 9. Increasing Analysis Capacity for Complex Models

### Symptom

Analysis returns 0% for very complex joint models. The default FE analysis capacity is insufficient.

### Fix

In Code Setup, increase:
- **Number of analysis iterations**: from default 25 to 50 (or higher)
- **Divergent iterations count**: from default 3 to 5 (or higher)

**Trade-off**: Higher values increase calculation time but allow more complex models to converge.

## 10. Circular Hollow Section Polygon Division

### Symptom

Analysis 0% when modeling circular hollow sections defined as polygons.

### Root Cause

The aspect ratio of finite shell elements in arc segments of the polygonal hollow member is too extreme.

### Fix

In Project Settings, increase the **Number of divisions for circular hollow sections** — this refines the polygon approximation and improves element aspect ratios.

## Best Practices

1. **Always check the deformed shape** when analysis fails — singularities are shown as 1m displacements
2. **Reset Code Setup to defaults** before debugging — modifications can cause unexpected behavior
3. **Split complex connections** into multiple analysis items — don't model everything in one item
4. **Verify butt welds in transparent mode** — yellow line = weld created, no line = misalignment
5. **Check material properties for zeros** — a single zero property stops the entire analysis
6. **Uncheck Stop-at-Limit-Strain** to see full failure mode, then redesign
7. **Add utility welds for friction connections** — CBFEM can't handle friction directly
8. **Keep bolt gaps under 1/16"** — larger gaps cause singularities
9. **Increase iterations for complex models** — 25→50 iterations, 3→5 divergent
10. **Start with simple connections** to build understanding before tackling complex joints
