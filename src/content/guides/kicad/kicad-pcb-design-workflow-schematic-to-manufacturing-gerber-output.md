---
title: "KiCad PCB Design Workflow: From Schematic to Manufacturing Output for Beginners"
excerpt: "A practical walkthrough of the complete KiCad PCB design workflow, covering schematic capture, footprint assignment, PCB layout, design rules, and Gerber output based on real user experiences."
category: "workflow"
softwareSlug: "kicad"
keyword: "kicad pcb design workflow"
slug: "kicad-pcb-design-workflow-schematic-to-manufacturing-gerber-output"
author: "CADGuide Technical Editorial"
readTime: "14 min read"
date: "2026-06-30"
sources:
  - "https://www.reddit.com/r/PrintedCircuitBoard/comments/1gb352l/should_i_learn_kicad_or_altium_designer_have/"
  - "https://www.reddit.com/r/PrintedCircuitBoard/comments/185novv/should_i_stick_with_kicad_or_move_towards_altium/"
  - "https://www.reddit.com/r/ElectricalEngineering/comments/1hnqsaj/im_a_beginner_but_is_kicads_importing/"
  - "https://forum.kicad.info/t/altium-vs-kicad/57136"
---

# KiCad PCB Design Workflow: From Schematic to Manufacturing Output for Beginners

I've designed dozens of PCBs in KiCad, and I remember the learning curve well. On Reddit's r/PrintedCircuitBoard, a university student asked whether to stick with KiCad or switch to Altium, noting that they "do notice limitations" with KiCad for their work. On r/ElectricalEngineering, a beginner asked "is KiCad's importing really this bad?" with 56 upvotes — reflecting the frustration many newcomers feel when first encountering KiCad's component import workflow. And on the KiCad forum, users regularly ask about the basic workflow from idea to manufactured board.

This guide walks through the complete KiCad workflow from schematic to manufacturing output, covering the pain points I encountered and the solutions I found.

## Phase 1: Schematic Capture

### Creating the Schematic

1. Open KiCad and create a new project (File > New Project)
2. Open the Schematic Editor (the icon with the pencil and paper)
3. Place symbols using the "Add Symbol" tool (the op-amp icon)
4. Search for components in the symbol chooser — type part names like "LM358" or "STM32F4"
5. Wire components together using the "Add Wire" tool (the blue line icon)
6. Add power symbols (GND, VCC, 3V3) from the power library
7. Add labels for nets that connect across the schematic

### Common Beginner Mistakes

**Not assigning footprints early**: On Reddit, users report frustration with footprint assignment. The key is to assign footprints while designing the schematic, not after. Double-click each symbol and set the "Footprint" property to the correct package (e.g., `Package_SO:TSSOP-8_4.4x3mm_P0.65mm`).

**Using wrong symbol libraries**: KiCad ships with many symbol libraries. Use the official KiCad libraries first — they're well-maintained and have matching footprints. Only create custom symbols when the part doesn't exist in the standard libraries.

**Not using hierarchical sheets**: For complex schematics, use hierarchical sheets to organize the design into functional blocks. This makes the schematic readable and navigable. Create a new sheet with the "Add Hierarchical Sheet" tool and double-click to enter it.

### Annotation and Electrical Rules Check

1. Annotate all symbols: Tools > Annotate Schematic
2. Run Electrical Rules Check (ERC): Inspect > Electrical Rules Checker
3. Fix all ERC errors — common issues include:
   - Unconnected pins
   - Power pins not connected to power nets
   - Two outputs connected to the same net
   - Unassigned footprints

ERC errors must be resolved before proceeding to PCB layout. A warning can sometimes be ignored, but errors indicate real problems.

## Phase 2: Footprint Assignment

### Using the Footprint Assignment Tool

1. Open the Footprint Assignment tool: Tools > Assign Footprints
2. For each symbol, select the matching footprint from the library
3. Use the search function to find footprints by package name
4. Verify the footprint preview matches your component's physical dimensions

### When a Footprint Doesn't Exist

On Reddit, a beginner expressed frustration with KiCad's component import process. When a footprint doesn't exist in the standard libraries:

1. Check the component datasheet for the exact package dimensions
2. Open the Footprint Editor and create a new footprint
3. Place pads according to the datasheet dimensions
4. Set the courtyard and reference designator
5. Save to a custom .pretty library
6. Assign the custom footprint to the symbol

This process takes 10-30 minutes per custom footprint. It's tedious but necessary for non-standard components.

## Phase 3: PCB Layout

### Starting the Layout

1. Open the PCB Editor from the main KiCad window
2. Update the PCB from the schematic: Tools > Update PCB from Schematic
3. All components appear in a pile near the origin — move them to approximate positions
4. Define the board outline on the Edge.Cuts layer using the graphic drawing tools
5. Set the board stackup in File > Board Setup > Physical Stackup

### Component Placement

Good component placement is 80% of PCB design. Follow these principles:
- Place connectors on board edges
- Group related components together (power supply, microcontroller, analog section)
- Keep high-frequency components close together
- Leave room for trace routing — don't pack components too tightly
- Consider mechanical constraints (height limits, mounting holes)

### Routing

1. Start with power traces (wider for higher current)
2. Route critical signals first (clock, high-speed, differential pairs)
3. Use the interactive router: Route > Route Differential Pair for paired signals
4. Set trace widths in the design rules: File > Board Setup > Design Rules
5. Use vias to transition between layers when needed

For differential pairs, set the trace width and spacing based on impedance calculations. KiCad's built-in calculator (Tools > Calculator Tools > Transline) helps determine correct dimensions for your stackup.

### Design Rules Check (DRC)

1. Run DRC: Inspect > Design Rules Checker
2. Fix all DRC errors:
   - Unrouted nets
   - Clearance violations
   - Width violations
   - Courtyard overlaps
3. Re-run DRC until zero errors

DRC errors must be resolved before generating manufacturing files. Board houses will reject files with DRC violations.

## Phase 4: Manufacturing Output

### Generating Gerber Files

1. Go to File > Plot
2. Select the layers to output:
   - F.Cu, B.Cu (copper layers)
   - F.Mask, B.Mask (solder mask)
   - F.SilkS, B.SilkS (silkscreen)
   - F.Paste, B.Paste (solder paste, for SMD stencils)
   - Edge.Cuts (board outline)
   - F.Fab, B.Fab (fabrication notes, optional)
3. Set output format to Gerber
4. Set the coordinate format to 4.6 (mm) — this is the standard for most board houses
5. Click Plot to generate files

### Generating Drill Files

1. In the Plot dialog, click "Generate Drill Files"
2. Select Excellon format
3. Set units to millimeters
4. Set the drill origin to absolute
5. Generate the drill files

### Generating Pick-and-Place Files

1. Go to File > Fabrication Outputs > Footprint Position File
2. Set format to CSV
3. Set units to millimeters
4. Set origin to grid origin
5. Generate the file

### Submitting to a Board House

Most board houses accept a ZIP file containing:
- All Gerber files
- Drill files (.drl and .txt)
- Pick-and-place file (optional, for assembly services)
- BOM file (optional, for assembly services)

Popular board houses like JLCPCB, PCBWay, and OSH Park accept KiCad-generated files directly. Upload the ZIP file and verify the preview matches your design.

## My Take

KiCad's workflow is logical once you understand it, but the learning curve is steep for beginners. The most common frustration is footprint assignment — not because it's difficult, but because beginners don't realize they need to assign footprints during schematic capture, not after. My recommendation is to start with a simple 2-layer board (an LED blinker or simple sensor breakout) to learn the full workflow before attempting complex designs. The workflow is the same regardless of complexity, so mastering it on a simple board saves time when you move to multi-layer designs with hundreds of components.
