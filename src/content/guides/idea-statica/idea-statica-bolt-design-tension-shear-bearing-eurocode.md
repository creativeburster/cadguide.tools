---
title: "IDEA StatiCa Bolt Design: Tension, Shear, and Bearing Capacity per Eurocode 3"
excerpt: "How to design and verify bolted connections in IDEA StatiCa — covering bolt tension, shear, bearing, block shear, and prying force calculations per Eurocode 3 and AISC."
category: "standards"
softwareSlug: "idea-statica"
keyword: "idea statica bolt design tension shear bearing eurocode"
slug: "idea-statica-bolt-design-tension-shear-bearing-eurocode"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.ideastatica.com/support-center/check-of-bolts-and-preloaded-bolts-according-to-eurocode"
  - "https://www.ideastatica.com/support-center/steel-connection-design-according-to-eurocode"
---

# IDEA StatiCa Bolt Design: Tension, Shear, and Bearing Capacity per Eurocode 3

Bolts are the most common fastener in steel connections. IDEA StatiCa's CBFEM method models each bolt individually — including prying forces, bearing, and block shear. Here's how to configure and verify bolted connections.

## Bolt Types and Grades

### Eurocode Bolt Grades

| Grade | fu (MPa) | fy (MPa) | Use Case |
|-------|----------|----------|----------|
| 4.6 | 400 | 240 | General purpose, non-structural |
| 5.6 | 500 | 300 | General structural |
| 6.8 | 600 | 480 | High-strength structural |
| 8.8 | 800 | 640 | Most common for structural connections |
| 10.9 | 1000 | 900 | High-strength, preloaded connections |

### AISC Bolt Grades

| Grade | fu (ksi) | fy (ksi) | Use Case |
|-------|----------|----------|----------|
| A307 | 60 | — | General purpose (low strength) |
| A325 | 120 | 92 | Most common structural bolt |
| A490 | 150 | 130 | High-strength, preloaded |
| F1852 | 120 | 92 | A325 equivalent (twist-off bolt) |

## Bolt Capacity per Eurocode 3

### Tension Capacity

Ft,Rd = k2 × fub × A_s / γM2

- k2 = 0.9 (for standard bolt heads)
- fub = bolt ultimate tensile strength
- A_s = tensile stress area (not the shank area)
- γM2 = 1.25 (partial safety factor)

Example: M20 bolt, grade 8.8:
- A_s = 245 mm²
- Ft,Rd = 0.9 × 800 × 245 / 1.25 = 141 kN

### Shear Capacity

Fv,Rd = αv × fub × A_s / γM2

- αv = 0.6 (for threads excluded from shear plane) or 0.5 (threads included)
- For typical structural connections: threads are usually in the shear plane → αv = 0.5

Example: M20 bolt, grade 8.8, threads in shear plane:
- Fv,Rd = 0.5 × 800 × 245 / 1.25 = 78.4 kN

### Combined Tension and Shear

Eurocode 3 interaction equation:
- (Ft,Ed / Ft,Rd)² + (Fv,Ed / Fv,Rd)² ≤ 1.0

### Bearing Capacity

Fb,Rd = k1 × αb × fu × d × t / γM2

- k1 = min(2.5 × fub/fu, 2.5) (edge distance factor)
- αb = min(αd, fub/fu, 1.0) (pitch and edge factor)
- d = bolt diameter
- t = plate thickness
- fu = ultimate strength of the plate (not the bolt)

Example: M20 bolt in 10mm S355 plate:
- d = 20mm, t = 10mm, fu = 470 MPa
- k1 = 2.5 (adequate edge distance)
- αb = 1.0 (adequate pitch)
- Fb,Rd = 2.5 × 1.0 × 470 × 20 × 10 / 1.25 = 188 kN

## Bolt Capacity per AISC

### Tension Capacity (LRFD)

φRn = φ × Fnt × A_b

- φ = 0.75
- Fnt = nominal tensile stress = 0.75 × Fub
- A_b = nominal bolt area (shank diameter)

Example: 3/4" A325 bolt:
- A_b = 285 mm² (0.442 in²)
- Fnt = 0.75 × 827 = 620 MPa (90 ksi)
- φRn = 0.75 × 620 × 285 = 132 kN (29.8 kips)

### Shear Capacity (LRFD)

φRn = φ × Fnv × A_b

- φ = 0.75 (threads included) or 0.75 with Fn = 0.40×Fub (threads excluded)
- Fnv = 0.40 × Fub (threads in shear plane) or 0.50 × Fub (excluded)

### Combined Tension and Shear (AISC)

Rn = Fnt' × A_b

Where Fnt' is modified for combined loading:
- Fnt' = 1.3 × Fnt - Fnt/(φ×Fnv) × Fu × Ab × (V/Ab) ≤ Fnt

## IDEA StatiCa Bolt Check

### Step 1: Define Bolts

1. In the Connection editor, click **Bolts**.
2. Set:
   - **Bolt grade**: 8.8 (Eurocode) or A325 (AISC)
   - **Diameter**: 16, 20, 22, or 24mm (common sizes)
   - **Hole type**: Standard, oversized, or slotted
   - **Preload**: For slip-critical connections, enter preload force
   - **Threads in shear plane**: Yes/No (affects shear capacity)

3. Define bolt layout:
   - **Number of rows**: 1-4
   - **Number of columns**: 1-4
   - **Spacing**: 3× diameter minimum (e.g., 60mm for M20)
   - **Edge distance**: 1.5× diameter minimum (e.g., 30mm for M20)
   - **End distance**: 1.5× diameter minimum

### Step 2: Calculate

1. Click **Calculate**.
2. IDEA StatiCa performs CBFEM analysis:
   - Each bolt is modeled as a spring with axial and shear stiffness
   - The plate is meshed and analyzed for bearing and bending
   - Prying forces are automatically calculated

3. Results per bolt:
   - **Tension force**: Per bolt (varies due to prying and plate deformation)
   - **Shear force**: Per bolt (varies due to load distribution)
   - **Bearing stress**: Plate stress at each bolt hole
   - **Utilization**: Max(tension, shear, bearing, combined) / capacity

### Step 3: Check Results

| Check | What to Look For |
|-------|-----------------|
| Bolt tension | All bolts < Ft,Rd (or φRn for AISC) |
| Bolt shear | All bolts < Fv,Rd |
| Combined | Interaction equation < 1.0 |
| Bearing | Plate stress < Fb,Rd at all holes |
| Block shear | Plate doesn't tear out along bolt line |
| Prying force | Additional tension from plate deformation |

### Prying Force

Prying force is an additional tension force in bolts caused by plate bending:

1. When bolts are in tension, the plate between bolts bends.
2. The plate edges press against the mating surface, creating a prying reaction.
3. This prying reaction adds to the bolt tension force.

4. IDEA StatiCa automatically calculates prying force using CBFEM:
   - The plate is modeled with finite elements
   - Plate deformation is captured
   - Prying force is included in the bolt tension results

5. To reduce prying force:
   - **Thicker plate**: Reduces plate bending and prying
   - **Closer bolt spacing**: Reduces the span between bolts
   - **Wider plate**: Increases the prying lever arm

## Block Shear

Block shear is a failure mode where a block of material tears out along the bolt line:

1. IDEA StatiCa checks block shear automatically:
   - **Tension path**: Along the row perpendicular to shear
   - **Shear path**: Along the rows parallel to shear
   - **Capacity**: Ant × Fu + Anv × 0.6 × Fu (AISC) or similar Eurocode formula

2. If block shear fails:
   - Increase edge distance
   - Increase end distance
   - Add more bolts (spreads the load over more material)
   - Use thicker plate

## Common Bolt Design Issues

**Bolts fail in tension due to prying**: The calculated bolt tension exceeds capacity because of prying force. Increase plate thickness or reduce bolt spacing.

**Bearing failure at edge bolts**: Edge bolts have less material around them. Increase edge/end distance or use a thicker plate.

**Slip-critical connection slips**: For slip-critical connections (where bolt slip is not allowed), ensure:
- Correct preload is applied
- Faying surface is prepared (Class A, B, or C surface)
- Hole type is standard (not oversized)
- IDEA StatiCa checks slip resistance per Eurocode 3 or AISC Section J3.8

**Bolts too close together**: Minimum spacing is 2.5× diameter (Eurocode) or 2.67× diameter (AISC). IDEA StatiCa warns if spacing is insufficient.
