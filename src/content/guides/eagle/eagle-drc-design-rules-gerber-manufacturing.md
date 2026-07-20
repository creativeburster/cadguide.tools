---
title: "Eagle DRC and Manufacturing Output: Setting Up Design Rules for Your PCB Fab"
excerpt: "How to configure Eagle's Design Rule Check for different PCB manufacturers — covering trace width, clearance, via sizing, solder mask expansion, and generating clean Gerber files."
category: "standards"
softwareSlug: "eagle"
keyword: "eagle drc design rules gerber manufacturing output"
slug: "eagle-drc-design-rules-gerber-manufacturing"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://docs.oshpark.com/design-tools/eagle/design-rules-files/"
  - "https://www.raypcb.com/eagle-drc-and-gerber-files-a-complete-guide/"
---

# Eagle DRC and Manufacturing Output: Setting Up Design Rules for Your PCB Fab

DRC errors are the #1 cause of PCB manufacturing rejections. I've sent boards to JLCPCB, PCBWay, and Advanced Circuits — each has slightly different capabilities. Eagle's DRC is your last check before generating manufacturing files. Here's how to configure it for your specific fab house.

## Step 1: Get Your Manufacturer's Design Rules

Every PCB manufacturer publishes their design rules. Find them on the manufacturer's website:

| Manufacturer | Min Trace | Min Clearance | Min Drill | Min Annular |
|-------------|-----------|--------------|-----------|-------------|
| JLCPCB (standard) | 0.127mm (5mil) | 0.127mm (5mil) | 0.3mm | 0.15mm |
| PCBWay (standard) | 0.127mm (5mil) | 0.127mm (5mil) | 0.3mm | 0.15mm |
| Advanced Circuits | 0.152mm (6mil) | 0.152mm (6mil) | 0.3mm | 0.15mm |
| OSH Park | 0.152mm (6mil) | 0.152mm (6mil) | 0.356mm | 0.178mm |

Always use the standard rules unless you're paying for premium capabilities. If your DRC passes with standard rules, any manufacturer can produce your board.

## Step 2: Configure Eagle DRC

1. In the Board Editor: **Tools** → **DRC**.
2. The DRC dialog has multiple tabs:

### Clearance Tab

Set minimum clearances between different copper objects:

- **All**: 0.15mm (6mil) — minimum clearance between any copper objects
- **Same signal**: 0mm — traces on the same net can touch
- **Different signals**: 0.15mm — minimum gap between different nets
- **Copper/pad**: 0.15mm — gap between copper pours and adjacent pads

### Distance Tab

- **Copper/dimension**: 0.3mm — distance between copper and board edge
- **Copper/drill**: 0.3mm — distance between copper and non-plated holes

### Sizes Tab

- **Min width**: 0.15mm (6mil) — minimum trace width
- **Min drill**: 0.3mm — minimum via drill diameter
- **Min annular**: 0.15mm — minimum copper ring around via drill

### Masks Tab

- **Min mask**: 0.25mm — minimum solder mask web between pads
- **Max mask**: 0.6mm — maximum solder mask expansion beyond pad

### Restring Tab

- **Via restring**: 0.15mm — copper ring around via
- **Pad restring**: 0.15mm — copper ring around through-hole pad

## Step 3: Run DRC and Fix Errors

1. Click **Check** in the DRC dialog.
2. Eagle reports errors in a list:
   - **Clearance errors**: Two copper objects are too close. Fix by moving one object or reducing trace width.
   - **Width errors**: A trace is narrower than the minimum. Fix by editing the trace width.
   - **Drill errors**: A via or pad drill is smaller than minimum. Fix by increasing the drill size.
   - **Overlap errors**: Two pads overlap. Fix by moving the component.

3. Common fixes:
   - **Reroute traces**: Use the **Route** tool to reroute traces that violate clearance.
   - **Change via size**: Select a via → right-click → **Properties** → change drill and diameter.
   - **Move components**: Select and drag components to resolve placement conflicts.
   - **Adjust copper pour clearance**: In the polygon properties, increase the **Isolate** value.

## Step 4: Configure Gerber Output

Eagle uses a CAM processor to generate Gerber files. Each manufacturer requires a specific set of layers:

### Standard 2-Layer Board Gerber Set

1. Go to **File** → **CAM Processor**.
2. Load a CAM job: **File** → **Open** → **Job** → select `gerb274x-2layer.cam` (Eagle's default 2-layer job).
3. Or configure manually:

| File | Eagle Layers | Description |
|------|-------------|-------------|
| .GTL | Top, Pads, Vias | Top copper |
| .GBL | Bottom, Pads, Vias | Bottom copper |
| .GTS | tStop | Top solder mask |
| .GBS | bStop | Bottom solder mask |
| .GTO | tPlace, tNames | Top silkscreen |
| .GBO | bPlace, bNames | Bottom silkscreen |
| .GTP | tCream | Top solder paste |
| .GBP | bCream | Bottom solder paste |
| .GKO | Dimension | Board outline |
| .TXT | Drills | Drill file (Excellon format) |

4. Click **Process Job** to generate all Gerber files.

### For 4-Layer Boards

Add inner copper layers:
- .G1L — Inner layer 1 (GND)
- .G2L — Inner layer 2 (PWR)

## Step 5: Verify Gerber Files

Before sending to the manufacturer, verify the Gerber files:

1. Open a Gerber viewer (Gerbv, KiCad GerberViewer, or online viewer like gerber-viewer.com).
2. Load all Gerber files.
3. Check:
   - **Board outline**: Matches your design
   - **Copper layers**: All traces and pads are present
   - **Solder mask**: Covers the board except on pads
   - **Silkscreen**: Component references and outlines are visible
   - **Drill file**: Holes are in the correct positions and sizes
4. Compare the Gerber view with your Eagle board layout — any discrepancies indicate a CAM job configuration error.

## Step 6: Generate Additional Manufacturing Files

### BOM (Bill of Materials)

1. In the Schematic Editor: **File** → **Export** → **BOM**.
2. Select output format: CSV or HTML.
3. Include columns: Part, Value, Quantity, Manufacturer, MPN.
4. The BOM lists all components with their values and quantities.

### Pick-and-Place File

1. In the Board Editor: **File** → **CAM Processor**.
2. Create a new CAM job for pick-and-place:
   - Output: CSV file
   - Data: Component reference, X position, Y position, rotation, layer (top/bottom)
3. This file is used by the PCB assembler's pick-and-place machine.

## Common Manufacturing Issues

**Solder mask web too thin**: If the gap between pads is smaller than the manufacturer's minimum solder mask web (typically 0.1mm), the mask may bridge across pads. Increase pad spacing or reduce pad size.

**Copper too close to board edge**: If copper is within 0.3mm of the board edge, it may delaminate during routing. Move copper at least 0.3mm from the edge.

**Drill file format mismatch**: Some manufacturers expect metric drill files, others imperial. Check the manufacturer's requirements and set the CAM processor's drill units accordingly.

**Silkscreen on pads**: If silkscreen overlaps pads, the ink may interfere with soldering. Remove silkscreen text or outlines that overlap pads in the Eagle board layout.
