---
title: "Pulsonix PCB Migration from Altium and KiCad: Import Filters, Feature Gaps, Rigid-Flex Autorouter Limitations, and IDX MCAD Integration"
excerpt: "Migrating to Pulsonix from Altium or KiCad? The free import filters handle schematic, PCB, and library data, but users report missing advanced features after switching. We cover the migration path, rigid-flex autorouter issues, IDX collaboration with SolidWorks, and the 100-pin free edition limit."
category: "migration"
softwareSlug: "pulsonix"
keyword: "Pulsonix migration Altium KiCad import filter rigid-flex autorouter IDX SolidWorks feature gap"
slug: "pulsonix-pcb-migration-altium-kicad-import-filters-feature-gaps"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-07-30"
sources:
  - "https://www.pulsonix.com/pcb-design"
  - "https://www.anypcba.com/pulsonix-pcb/"
  - "https://www.pulsonix.com/forum/topic.asp?TOPIC_ID=315"
---

# Pulsonix PCB Migration from Altium and KiCad: Import Filters, Feature Gaps, Rigid-Flex Autorouter Limitations, and IDX MCAD Integration

Pulsonix offers the largest collection of free import filters in the PCB design industry, making migration from Altium, KiCad, OrCAD, Eagle, and other tools technically straightforward. However, users migrating from Altium report feature gaps in advanced functionality, and the rigid-flex autorouter has known issues. This guide covers what works, what doesn't, and what to expect when switching.

## Import Filters: What's Available

Pulsonix provides free import filters for:

- **Schematic designs** from other PCB tools
- **PCB layouts** from other tools
- **Library data** (components, footprints, symbols)

### When No Import Filter Exists

If an import filter for your current tool isn't available, Pulsonix offers alternative migration paths:

- **Gerber reverse engineering**: Rebuild PCB designs from Gerber data
- **Netlist import**: Import netlists to reconstruct the logical design
- **Contact Pulsonix** to discuss options — filters may be in development

### What Retains After Import

- Component placement and routing (from PCB imports)
- Schematic connectivity (from schematic imports)
- Library definitions (from library imports)
- **Intellectual property is retained** with accuracy and precision

## Feature Gaps After Migrating from Altium

### What Users Report Missing

Users who switched from Altium to Pulsonix report that while the core schematic capture and PCB layout functionality is solid, several advanced features are less capable:

- **Advanced routing features**: Some complex routing scenarios that Altium handles automatically require more manual intervention in Pulsonix
- **Complex project handling**: Pulsonix is better suited for smaller-to-medium designs; very complex projects can become cumbersome
- **Multi-screen mode**: Stability issues reported in multi-monitor configurations

### What Pulsonix Does Well (per user feedback)

- **Copper pour and interactive routing**: Particularly praised by users
- **Stability**: Generally stable in normal operation
- **Customer support**: Fast response to user feedback
- **Price**: Significantly more affordable than Altium, making it attractive for smaller teams
- **Built-in Spice simulation**: Schematic-level simulation without external tools

### User Assessment

> "After switching from Altium to Pulsonix, Pulsonix seems to be lacking in many advanced features. If I had to choose, I'd still favor using Altium, even though Pulsonix has some price advantages."

> "I think Pulsonix is better suited for smaller designs with some basic functionality, but can become very cumbersome when dealing with complex projects."

## Rigid-Flex Autorouter Issues

### The Problem

Users report that the Pulsonix autorouter has significant issues with rigid-flex boards:

### Standard Router Issues

- Routes tracks on **non-flex layers** on the flex side of the board
- Routes **outside the flex outline** — tracks appear beyond the defined flex area
- Does not respect flex layer assignments

### Advanced Router Issues

- **Cannot complete a single route** on flex layers
- Routes every pin with a stub track to a via but cannot route further on flex layers
- This effectively makes the advanced router non-functional for flex designs

### Manual Routing Workaround

When using manual routing with "avoid obstacle" enabled:
- Traces routed manually **fail to avoid obstacles** — the avoid-obstacle feature doesn't work as expected
- Users must manually check clearances rather than relying on the automated avoidance

### Recommendation

For rigid-flex designs in Pulsonix:
1. **Do not rely on the autorouter** for flex layers — route flex traces manually
2. Verify all flex layer assignments before routing
3. Check that the flex outline is properly defined and that routing rules respect it
4. Report issues to Pulsonix support — they are responsive to user feedback

## IDX MCAD Integration

### What IDX Provides

Pulsonix Version 13.0 introduced the **IDX Collaboration Interface** for ECAD-MCAD data exchange:

- **Bidirectional exchange** of incremental design data between Pulsonix and MCAD tools (e.g., SolidWorks)
- **Event-driven methodology** — control each stage of mechanical integration
- Changes can be tracked and reviewed at each stage
- Seamless exchange means both ECAD and MCAD stay synchronized

### Additional MCAD Output Formats

Beyond IDX, Pulsonix supports:
- **STEP** (bi-directional) — with photo-realistic 3D preview using Ray and Path Tracing
- **IDF** — Industry-standard ECAD-MCAD format
- **DXF** — 2D mechanical drawings
- **Real-time 3D clash detection** — interactively move components and enclosures with real-time violation detection

### 3D STEP Preview

Pulsonix 13's 3D viewer uses GPU-accelerated Ray and Path Tracing algorithms for photo-realistic rendering. This provides:
- Higher quality images representative of the physical design
- Better visualization for design reviews
- Improved enclosure fit verification

## High-Speed Design Features

### Impedance Controlled Routing (v13.0+)

Within the High-Speed Option:
- Define impedance rules with specific impedance values
- Pulsonix calculates the required track width based on:
  - Material properties
  - Thicknesses
  - Layer stack-up

### Other High-Speed Features

- **Differential pair routing** with online length display
- **Dynamic serpentine routing** for length matching
- **Pin package lengths** for accurate total length calculation
- **Intelligent path definition** for routing channels
- **Constraint Manager** for centralized rule definition
- Support for DDR, PCI Express, and USB designs

## Pulsonix Vault: Version Control

The **Pulsonix Vault** provides:
- Full access control with user permissions
- Revision history of all design files
- Saved search capability
- Folder-level permissions (v13.0+) for granular access control
- Audited environment for regulated industries

## Free Edition Limitation

Pulsonix offers a free edition with **all features of the full edition** but limited to **100 component pins**. This is suitable for:
- Learning the tool
- Small prototype boards
- Evaluating migration from another tool
- Simple hobby projects

For production designs exceeding 100 pins, a full license is required.

## New ERC Checks in v13.0

Version 13.0 added 12 new Electrical Rule Checks in schematics:

1. Perform ERC inside a named area
2. Delete locked errors
3. Net on no-connect pin
4. Report schematic-only components
5. Pins not on a net (excluding mounting holes/ancillary pads)
6. Split net — if net name not shown on all sub-nets
7. Split net — if split nets are on a different page
8. Split net — unless pin type is no-connect
9. Power nets on non-power pins
10. New pin type — single pin net
11. Single pin net check
12. Check for 2-pin components

These checks catch errors at the schematic stage, eliminating costly mistakes before PCB layout begins.

## Migration Decision Guide

| Scenario | Recommendation |
|----------|---------------|
| Small-to-medium designs, cost-sensitive | Pulsonix is a strong choice |
| Complex multi-board systems with advanced routing | Altium may be more capable |
| Rigid-flex designs | Route flex manually; autorouter has known issues |
| MCAD collaboration with SolidWorks | IDX integration works well in v13+ |
| Budget-constrained teams needing professional features | Pulsonix offers excellent value |
| Coming from KiCad | Import filters handle the migration; feature set is comparable or richer |
| Need built-in simulation | Pulsonix includes Spice; Altium requires separate license |
