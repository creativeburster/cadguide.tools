---
title: "Allegro PCB HDI Layout: Via Types, Microvias, and Blind/Buried Via Stackup Strategy"
excerpt: "Design high-density interconnect (HDI) PCBs in Allegro PCB Editor with proper via stackup planning, microvia definitions, layer assignment, and DFM rule configuration for advanced packaging."
category: "workflow"
softwareSlug: "allegro-pcb"
keyword: "allegro pcb hdi layout microvia blind buried via"
slug: "allegro-pcb-hdi-layout-microvia-blind-buried-via-stackup"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://www.cadence.com/en_US/home/tools/pcb-design-and-analysis/allegro-x-design-platform.html#allegro-x-pcb-designer"
  - "https://www.ema-eda.com/products/cadence-allegro/allegro-x-overview/"
---

# Allegro PCB HDI Layout: Via Types, Microvias, and Blind/Buried Via Stackup Strategy

High-Density Interconnect (HDI) design in Allegro requires careful planning of via types and layer assignments before you place a single component. Getting the via stackup wrong means you'll hit a wall during routing and have to start over — a common trap on BGA fanout designs for 0.4mm pitch packages.

## Via Types in Allegro

Allegro supports several via types for HDI designs:

- **Through-hole vias** — connect all layers, largest footprint
- **Blind vias** — start from an outer layer and end at an inner layer
- **Buried vias** — connect only inner layers, not visible from outside
- **Microvias** — laser-drilled, typically 0.1mm diameter, connect only one layer pair

For HDI, the combination of microvias and blind/buried vias is what enables the tight routing density needed for fine-pitch BGAs.

## Defining Via Stackups in Allegro

Before routing, define your via stackup in Setup > Constraints > Physical Constraint Set > Vias:

1. **Create via definitions** in the library with specific layer ranges (e.g., VIA1-3 for layers 1 to 3)
2. **Assign via lists** to the Physical Constraint Set — Allegro will use the smallest via that satisfies the connection
3. **Set via spacing rules** in the Spacing Constraint Set to ensure manufacturability

The key decision is the HDI structure type:

- **Type we** — through-hole + blind vias (one microvia layer on each side)
- **Type II** — through-hole + blind + buried vias
- **Type III** — multiple microvia layers + buried vias
- **Type IV-VI** — increasingly complex structures with stacked microvias

## BGA Fanout Strategy

For a 0.4mm pitch BGA, through-hole vias won't fit between pads. The standard approach:

1. **Use microvias** for the outer two rows of the BGA, connecting layer 1 to layer 2
2. **Use blind vias** (1-3) for the next two rows, skipping to the first signal layer
3. **Use blind vias** (1-4) for inner rows, reaching deeper signal layers
4. **Reserve through-hole vias** for power and ground connections only

In Allegro, set up the fanout with Route > Create Fanout, and configure the via list for each BGA region separately using different Physical Constraint Sets.

## Stacked vs. Staggered Microvias

**Stacked microvias** (directly on top of each other) save space but require filled vias and are more expensive to manufacture. **Staggered microvias** (offset) are cheaper but use more routing space.

In Allegro, define both types in the via library and assign them to different regions of the board as needed. The DRC checker will flag any stacking violations.

## DFM Considerations

### Aspect Ratio

Microvia aspect ratio (depth-to-diameter) should be kept at or below 1:1 for reliable plating. For a 0.1mm dielectric, use 0.1mm or larger microvias.

### Copper Filling

Stacked microvias require copper filling to create a solid base for the next via. Specify this in the fabrication notes and ensure your fabricator supports it.

### Annular Ring

HDI vias have smaller annular rings than standard vias. Check your fabricator's minimum annular ring capability and set the spacing rules accordingly.

## Common Pitfalls

### Via-in-Pad Without Filling

Via-in-pad saves space on fine-pitch BGAs but requires filling and capping. Without filling, solder wicks into the via during assembly, causing opens. Specify filled and capped vias in the fabrication notes.

### Not Defining Via Lists Per Region

If you assign the same via list to the entire board, Allegro may use through-hole vias where microvias are needed. Create separate Physical Constraint Sets for BGA regions and non-BGA regions.

### Ignoring Current Capacity

Microvias have lower current capacity than through-hole vias due to smaller cross-section. For power nets, use multiple microvias in parallel or larger blind vias.
