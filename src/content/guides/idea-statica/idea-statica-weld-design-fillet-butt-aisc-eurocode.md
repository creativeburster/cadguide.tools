---
title: "IDEA StatiCa Weld Design: Fillet, Butt, and Plug Welds per AISC and Eurocode"
excerpt: "How to design and verify welds in IDEA StatiCa — covering fillet weld sizing, butt weld preparation, weld capacity calculations, and common weld failure modes in steel connections."
category: "standards"
softwareSlug: "idea-statica"
keyword: "idea statica weld design fillet butt aisc eurocode"
slug: "idea-statica-weld-design-fillet-butt-aisc-eurocode"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.ideastatica.com/support-center/weld-welds-in-idea-statica"
  - "https://www.ideastatica.com/support-center/catalog-of-aisc-limit-states-and-design-requirements"
---

# IDEA StatiCa Weld Design: Fillet, Butt, and Plug Welds per AISC and Eurocode

Welds are critical in steel connections — a weld failure can be catastrophic. IDEA StatiCa checks welds using CBFEM, which models the actual stress distribution in the weld. This is more accurate than the traditional elastic method. Here's how to configure and verify welds.

## Weld Types in IDEA StatiCa

### Fillet Welds

The most common weld type. Triangular cross-section joining two surfaces at an angle.

- **Throat thickness (a)**: The effective weld dimension = 0.707 × leg size (z)
- **Leg size (z)**: The weld leg dimension specified on drawings
- **Minimum leg size**: Per AISC Table J2.4 or Eurocode, based on thinner part thickness
- **Maximum leg size**: For material ≤ 6mm thick, max leg = material thickness; for > 6mm, max leg = thickness - 1.5mm

### Butt Welds (Complete Joint Penetration)

Full-penetration welds where the weld metal fills the entire joint.

- **Capacity**: Equal to the base metal capacity (if weld filler matches base metal)
- **No throat calculation needed** — the weld is as strong as the base metal
- **Requires proper joint preparation**: V-groove, J-groove, or U-groove

### Partial Penetration Welds

Welds that penetrate only part of the thickness.

- **Effective throat**: The depth of penetration minus 3mm
- **Used for**: Thick sections where full penetration is impractical

## Fillet Weld Design

### Step 1: Define the Weld

1. In the Connection editor, click on the welded connection between two members.
2. Select **Weld** → **Type: Fillet**.
3. Set parameters:
   - **Leg size (z)**: Enter in mm (typical: 6-12mm for structural connections)
   - **Weld length**: Auto-calculated from the connection geometry
   - **Weld position**: Flat, horizontal, vertical, overhead (affects capacity in some codes)

4. For double-sided fillet welds (both sides of a plate):
   - Define weld on both sides
   - IDEA StatiCa calculates the combined capacity

### Step 2: Weld Capacity per AISC

AISC 360-22 fillet weld capacity:

- **Shear capacity per unit length**: Rn = 0.6 × FEXX × a × (1.0 + 0.5 × sin^1.5(θ))
  - FEXX = weld filler metal strength (e.g., 70 ksi for E70XX)
  - a = throat thickness = 0.707 × z
  - θ = angle of loading relative to weld axis (0° = longitudinal, 90° = transverse)

- **LRFD**: φRn = 0.75 × Rn
- **ASD**: Rn/Ω = Rn / 2.0

Example: 8mm fillet weld, E70XX (482 MPa), loaded longitudinally:
- a = 0.707 × 8 = 5.66mm
- Rn = 0.6 × 482 × 5.66 = 1635 N/mm
- φRn = 0.75 × 1635 = 1226 N/mm = 1.23 kN/mm

### Step 3: Weld Capacity per Eurocode

Eurocode 3 fillet weld capacity:

- **Design shear strength**: fw = fu / (√3 × βw)
  - fu = ultimate tensile strength of base metal
  - βw = correlation factor (0.9 for S235, 0.85 for S275, 0.80 for S355)

- **Weld resistance per unit length**: Fw,Rd = fw × a × (1/√3 × √(σ⊥² + 3(τ⊥² + τ∥²)))

Simplified method (directional):
- Fw,Rd = fvw,d × a
- fvw,d = fu / (√3 × βw × γM2)

Example: 8mm fillet weld, S355, γM2 = 1.25:
- a = 5.66mm
- fvw,d = 470 / (√3 × 0.80 × 1.25) = 271 N/mm²
- Fw,Rd = 271 × 5.66 = 1534 N/mm = 1.53 kN/mm

### Step 4: IDEA StatiCa Weld Check

1. Click **Calculate**.
2. IDEA StatiCa performs CBFEM analysis of the weld:
   - Meshes the weld and surrounding material
   - Applies the connection loads
   - Calculates stress distribution along the weld length

3. Results:
   - **Stress distribution**: Color map showing stress along the weld
   - **Maximum stress**: Peak stress location and value
   - **Utilization ratio**: Maximum stress / weld capacity
   - **Failure mode**: Which component governs (weld metal, base metal, or HAZ)

4. Common weld failure modes:
   - **Weld metal yielding**: The weld itself yields — increase leg size
   - **Base metal yielding**: The plate near the weld yields — increase plate thickness
   - **Lamellar tearing**: Through-thickness stress in the base metal — use Z-quality steel

## Butt Weld Design

### Step 1: Define Butt Weld

1. In the Connection editor, select the welded connection.
2. Select **Weld** → **Type: Butt (Complete Joint Penetration)**.
3. Set:
   - **Joint preparation**: V-groove, double-V, J-groove, or square
   - **Backing bar**: Yes/No (if used, note that AISC requires backing bars to be removed for seismic connections in some cases)
   - **Weld filler**: Match to base metal strength

4. For butt welds, the capacity equals the base metal capacity:
   - No separate weld check needed (the base metal check covers it)
   - IDEA StatiCa checks the base metal at the weld location

### When to Use Butt Welds

- **Column splices**: Full-penetration butt weld for moment transfer
- **Beam-to-column moment connections**: Flange full-penetration welds
- **Base plate to column**: Full-penetration weld for moment connections
- **Groove welds in tension**: Where fillet welds would be too large

## Common Weld Design Issues

**Weld is oversized**: A weld larger than needed wastes material and time. The optimal weld size is where the weld capacity slightly exceeds the demand. Use IDEA StatiCa's optimization to find the minimum weld size.

**Weld is undersized for fatigue**: For connections subject to cyclic loading (cranes, bridges), fatigue governs. IDEA StatiCa checks fatigue per EN 1993-1-9 or AISC Appendix 3. Fatigue often requires larger welds or improved weld profiles.

**Uneven stress distribution**: Long fillet welds don't distribute stress evenly — the ends carry more load. IDEA StatiCa's CBFEM captures this effect. If the utilization is high at the ends, consider:
- Increasing weld size at the ends
- Using a longer weld to reduce peak stress
- Adding stiffeners to redistribute the load

**Weld deformation**: Large welds shrink during cooling, causing distortion. For thick plates (> 20mm), consider:
- Balanced welding (alternate sides)
- Back-step welding sequence
- Preheat to reduce cooling rate

## Best Practices

1. **Match weld filler to base metal**: Use E70XX for A572/A992 steel, E60XX for A36. Using higher-strength filler on lower-strength steel doesn't increase connection capacity (the base metal fails first).

2. **Use fillet welds when possible**: Fillet welds are simpler, faster, and cheaper than butt welds. Use butt welds only when fillet welds would be too large or when full penetration is required.

3. **Check both weld and base metal**: IDEA StatiCa checks both. A weld can pass while the base metal fails (or vice versa). Review all components.

4. **Consider weld accessibility**: Ensure the welder can access the joint. A perfectly designed weld that can't be executed is useless.
