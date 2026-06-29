---
title: "MatrixGold Gem Setting Techniques: Prong, Pave, Channel, Bezel, and Flush Setting"
excerpt: "MatrixGold's gem setting tools automate prong placement, pave patterns, channel cutting, and bezel creation. I cover each setting type with step-by-step workflows, parameter tuning, and production considerations for castable jewelry models."
category: "workflow"
softwareSlug: "matrixgold"
keyword: "MatrixGold gem setting prong pave channel bezel flush setting techniques jewelry"
slug: "matrixgold-gem-setting-prong-pave-channel-bezel-flush"
author: "CAD IT Admin"
readTime: "11 min"
date: "2025-06-22"
sources:
  - "https://matrixgoldbook.com/product/designing-jewelry-with-matrixgold/"
  - "https://www.udemy.com/course/matrixgold-essentials-for-jewelers-video-training-course/"
  - "https://www.coursehero.com/file/161703770/MatrixGold2019TrainingGuidepdf/"
---

# MatrixGold Gem Setting Techniques: Prong, Pave, Channel, Bezel, and Flush Setting

I've designed jewelry with every major gem setting type in MatrixGold, and each setting requires specific tools and workflows. MatrixGold automates much of the tedious work — prong placement, channel cutting, pave patterns — but understanding the technical requirements of each setting type ensures your models are not just visually correct but also castable and settable in production.

## Prong Setting

### Standard Prong Setting

1. Place a gem using **Gem on Curve** or **Gem on Ring Rail**
2. Click **Prong Placer**
3. Select the gem
4. Configure prong parameters:
   - **Prong Type**: Round, V-shape, or peg
   - **Number of Prongs**: 4, 6, or 8 (depends on gem size)
   - **Prong Diameter**: Typically 0.8-1.5mm for rings
   - **Prong Height**: Must cover 15-25% of the gem's crown height
   - **Base Width**: Wider base for stability
5. Click to generate prongs
6. Use **Gem Cutter** to cut seats into the prongs

### Prong Sizing Guidelines

| Gem Size | Prongs | Prong Diameter | Prong Height |
|----------|--------|---------------|-------------|
| 1-2mm | 4 | 0.5-0.7mm | 0.8-1.0mm |
| 2-4mm | 4-6 | 0.7-1.0mm | 1.0-1.5mm |
| 4-6mm | 6 | 1.0-1.2mm | 1.5-2.0mm |
| 6-8mm | 6-8 | 1.2-1.5mm | 2.0-2.5mm |
| 8mm+ | 8+ | 1.5mm+ | 2.5mm+ |

### V-Prongs for Marquise and Pear

Marquise and pear-shaped gems need V-prongs at the points:
1. Place the marquise or pear gem
2. Use **Prong Placer** with V-prong type
3. V-prongs automatically position at the gem's points
4. Add round prongs along the curved sides
5. The V-prongs prevent the pointed gem corners from chipping

## Pave Setting

### Creating Pave Patterns

1. Select the surface where pave will be placed
2. Click **Gem on Surface**
3. Choose gem type (round brilliant for pave)
4. Set gem size (typically 1-2.5mm for pave)
5. Choose pattern:
   - **Grid**: Regular rows and columns
   - **Hexagonal**: Offset rows for tighter packing
   - **Staggered**: Alternating offset for natural look
6. Set spacing between gems (typically 0.3-0.8mm between stones)
7. Click to generate the pave pattern

### Pave Prong Placement

For pave-set stones, each gem needs small prongs or beads:
1. After placing pave gems, click **Prong Placer**
2. Select all pave gems
3. Choose **Bead** type (small rounded prongs)
4. Set bead size (typically 0.3-0.5mm)
5. Set 3-4 beads per gem
6. MatrixGold generates beads between adjacent gems
7. Use **Gem Cutter** to cut seats

### Pave Considerations

- **Gem size**: 1-2mm is standard for pave; smaller stones are harder to set
- **Spacing**: Minimum 0.3mm between gems for metal strength
- **Metal thickness**: The surface must be at least 0.8mm thick for pave
- **Bead size**: Beads must be large enough to hold the gem but not cover it
- **Casting**: Pave designs require investment casting with fine detail

### Multi-Row Pave

For rings with multiple rows of pave:
1. Create the first row using Gem on Surface with a grid pattern
2. Offset the second row for hexagonal packing
3. Use 3-4 beads per gem, shared between adjacent gems
4. The MatrixGold training guide describes: "Introduction to 'pave Setting'" as a key technique

## Channel Setting

### Creating a Channel

1. Place gems in a row using **Gem on Curve**
2. Ensure gems are the same size and properly spaced
3. Click **Channel Cutter**
4. Select the gems
5. Select the metal body
6. MatrixGold cuts a channel into the metal
7. The channel walls are the correct height to hold the gems

### Channel Parameters

- **Channel Wall Thickness**: Minimum 0.5mm for structural integrity
- **Channel Depth**: 60-70% of the gem's total depth
- **Gem Spacing**: 0.1-0.3mm between gems (tight for channel setting)
- **Gem Size**: All gems in a channel should be the same size
- **Channel Width**: Matches the gem diameter plus wall thickness

### Channel Setting Types

- **Straight Channel**: Gems in a straight line (classic eternity ring)
- **Curved Channel**: Gems following a curve (around a center stone)
- **Tapered Channel**: Gems decrease in size along the channel

### Channel Setting Workflow

1. Create the ring or band
2. Draw a curve along the center of where the channel will be
3. Place gems using Gem on Curve with tight spacing
4. Use Channel Cutter to cut the channel
5. Verify that channel walls are thick enough
6. Boolean Union the channel walls with the ring body

## Bezel Setting

### Creating a Bezel

1. Place a gem on the model
2. Create a cylinder or extrusion around the gem
3. The bezel wall should be 0.5-1.0mm thick
4. The bezel should be 0.2-0.5mm taller than the gem's girdle
5. Use **Boolean Difference** to cut the gem seat from the bezel
6. The bezel wall will be pushed over the gem's crown during setting

### Bezel Parameters

- **Wall Thickness**: 0.5-1.0mm (thinner for small gems, thicker for large)
- **Wall Height**: 0.2-0.5mm above the gem girdle
- **Inner Diameter**: Gem diameter + 0.1-0.2mm clearance
- **Bezel Angle**: Slight inward angle for better gem retention

### Bezel Setting Considerations

- Bezel setting is the most secure setting type
- It covers the gem's edge, reducing brilliance slightly
- Best for cabochon gems and soft stones (opal, turquoise)
- The bezel is pushed over the gem during setting — leave enough metal
- Bezel setting is simpler to model than prong setting

## Flush Setting (Gypsy Setting)

### Creating Flush Settings

1. Select the surface for flush setting
2. Place gems using **Gem on Surface**
3. For each gem, create a hole slightly smaller than the gem diameter
4. The gem sits flush with the surface
5. A burnished edge of metal holds the gem in place

### Flush Setting Workflow

1. Create the ring or jewelry body
2. Place gems on the surface using Gem on Surface
3. Use **Gem Cutter** to cut seats into the metal
4. The seat should be slightly smaller than the gem diameter
5. The gem is pressed into the seat during setting
6. The surrounding metal is burnished over the gem edge

### Flush Setting Considerations

- **Metal thickness**: Must be at least 1.5mm for flush setting
- **Gem size**: Typically 1-3mm for flush setting
- **Hole size**: 0.1-0.2mm smaller than the gem diameter
- **Setting technique**: The setter uses a burnisher to push metal over the gem
- **Best for**: Small stones on ring bands, men's jewelry

## Gem Library

MatrixGold includes a gem library with accurate gemstone models:

1. Open the **Gem Library**
2. Choose gem type:
   - **Round Brilliant**: Most common, 57-58 facets
   - **Princess**: Square cut, 50-58 facets
   - **Marquise**: Elongated with pointed ends
   - **Pear**: Teardrop shape
   - **Oval**: Elongated round
   - **Emerald**: Step cut with truncated corners
   - **Cushion**: Square with rounded corners
   - **Heart**: Heart shape
3. Set carat weight or millimeter size
4. The gem model includes proper proportions and facet geometry

## Production Reports

### Metal Weight Report

1. Select the metal body (without gems)
2. Click **Metal Weights**
3. Choose metal type (gold 14k, 18k, platinum, silver)
4. MatrixGold calculates the metal weight
5. This is essential for cost estimation and casting

### Gem Report

1. Click **Gem Report**
2. MatrixGold lists all gems in the model:
   - Gem type and shape
   - Carat weight or mm size
   - Quantity
   - Total carat weight
3. This report goes to the gem supplier for stone ordering

### Tech Report

1. Click **Tech Report**
2. Generates a technical drawing with:
   - Front, top, and side views
   - Dimensions
   - Gem positions
   - Metal weight
3. This goes to the caster and setter

## Summary

MatrixGold supports all major gem setting types through its automated tools. For prong setting, use Prong Placer with appropriate prong count and size based on gem diameter. For pave, use Gem on Surface with a grid or hexagonal pattern, then add small beads with Prong Placer. For channel setting, place gems in a row and use Channel Cutter to cut the channel walls. For bezel setting, create a wall around the gem and cut the seat with Boolean Difference. For flush setting, cut seats slightly smaller than the gems. Always verify metal thickness, spacing, and prong dimensions against production requirements. Generate metal weight and gem reports for cost estimation and supplier communication. The key to castable models is ensuring all walls are thick enough, all seats are properly cut, and the final Boolean Union produces a single solid with no naked edges.
