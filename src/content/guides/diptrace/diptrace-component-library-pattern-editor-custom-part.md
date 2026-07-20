---
title: "DipTrace Component Library: Creating Custom Parts with Pattern Editor"
excerpt: "How to create custom components in DipTrace using the Pattern Editor and Component Editor — covering pad design, silk screen, courtyard, and linking schematic symbols to PCB footprints."
category: "workflow"
softwareSlug: "diptrace"
keyword: "diptrace component library pattern editor custom part"
slug: "diptrace-component-library-pattern-editor-custom-part"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://diptrace.com/diptrace-software/library-creation/"
  - "https://diptrace.com/forum/viewtopic.php?t=11762"
---

# DipTrace Component Library: Creating Custom Parts with Pattern Editor

DipTrace's Pattern Editor and Component Editor make custom part creation straightforward. I've created 200+ custom parts in DipTrace for components not in the standard library. Here's the complete process.

## DipTrace Library Structure

DipTrace separates components into three linked elements:

1. **Pattern (Footprint)** — Physical PCB layout (pads, silk, outline) — created in Pattern Editor
2. **Component (Symbol)** — Schematic representation (pins, graphics) — created in Component Editor
3. **Library** — Collection of patterns and components — managed in Library Editor

A component (symbol) links to one or more patterns (footprints). This allows one schematic symbol to map to different package options (e.g., SOIC-8 vs DIP-8).

## Step 1: Create the PCB Pattern (Footprint)

1. Open **DipTrace Pattern Editor**.
2. **File** → **New Pattern**.
3. Set the grid:
   - **View** → **Grid**: 0.5mm (metric) for SMD, 0.025" (imperial) for through-hole.

4. Place pads:
   - Click **Pad** tool (for through-hole) or **SMD Pad** tool (for surface mount).
   - For SMD pads:
     - Click on the grid to place.
     - Double-click the pad to edit:
       - **Shape**: Rounded Rectangle (standard for SMD)
       - **Width**: 0.6mm (for SOIC-8)
       - **Height**: 1.5mm
       - **Layer**: Top (or Bottom)
     - Set pad number (1, 2, 3, ...)
   - For through-hole pads:
     - **Shape**: Round or Octagonal
     - **Outer diameter**: 1.6mm (for 0.6mm drill)
     - **Inner diameter (drill)**: 0.6mm

5. Position pads according to the datasheet:
   - Use **Edit** → **Move** to position precisely.
   - Or enter X/Y coordinates in the pad properties.
   - Verify pad spacing matches the datasheet pitch.

6. Draw the silk screen outline:
   - Layer: **Top Silk** (or Bottom Silk).
   - Click **Line** tool → draw the package outline.
   - Line width: 0.15mm (minimum for most manufacturers).
   - Add a pin 1 indicator: **Arc** or **Circle** near pad 1.

7. Draw the courtyard (keep-out area):
   - Layer: **Top Courtyard**.
   - Draw a rectangle around the pattern with 0.5mm clearance from pads.

8. Add designators:
   - **Text** tool → add `**RefDes**` (auto-fills with reference designator).
   - Place above the pattern on the Top Silk layer.

9. Save the pattern:
   - **File** → **Save As** → name it (e.g., `SOIC-8-1.27-3.9x4.9`).
   - Save to your custom library file.

## Step 2: Create the Schematic Component (Symbol)

1. Open **DipTrace Component Editor**.
2. **File** → **New Component**.
3. Draw the symbol body:
   - Click **Rectangle** tool → draw the IC body.
   - Standard size: 0.4" × 0.6" for an 8-pin IC.

4. Add pins:
   - Click **Pin** tool.
   - Place pins around the body:
     - Left side: Input pins
     - Right side: Output pins
     - Top: Power pins (VCC)
     - Bottom: Ground pins (GND)
   - Double-click each pin to set:
     - **Pin number**: Must match the physical pin number (1, 2, 3, ...)
     - **Pin name**: From the datasheet (e.g., "VCC", "SDA", "SCL")
     - **Pin type**: Input, Output, Bidirectional, Power

5. Add reference designator:
   - **Text** tool → `**RefDes**` → place above the symbol.

6. Add value:
   - **Text** tool → `**Value**` → place below the symbol.

7. Link the pattern:
   - **Component** → **Attached Patterns** → **Add**.
   - Select the pattern created in Step 1.
   - Verify pin-to-pad mapping:
     - The dialog shows pin numbers on the left and pad numbers on the right.
     - Ensure each pin maps to the correct pad.
     - If mapping is wrong, click and drag to correct.

8. Save the component:
   - **File** → **Save As** → name it (e.g., `MCP23017-E/SO`).
   - Save to your custom library file.

## Step 3: Add to Your Library

1. Open **DipTrace Library Editor** (or use the library within Schematic/PCB).
2. **Library** → **New Library** → name it (e.g., `company-parts.lib`).
3. Import the pattern and component:
   - **Library** → **Import Pattern** → select the .pat file.
   - **Library** → **Import Component** → select the .eli file.
4. The part is now available in DipTrace Schematic and PCB Layout.

## Common Pattern Design Guidelines

### SMD Pad Dimensions

Use IPC-7351 standard pad calculations:

| Package | Pad Width | Pad Height | Pitch |
|---------|-----------|------------|-------|
| 0402 | 0.56mm | 0.50mm | 0.5mm |
| 0603 | 0.85mm | 0.85mm | 0.8mm |
| 0805 | 1.05mm | 1.25mm | 0.8mm |
| SOIC-8 | 0.60mm | 1.55mm | 1.27mm |
| TSSOP-20 | 0.40mm | 1.35mm | 0.65mm |
| QFP-32 (0.8mm) | 0.42mm | 1.50mm | 0.8mm |
| QFN-24 (0.5mm) | 0.30mm | 0.55mm | 0.5mm |

### Through-Hole Pad Dimensions

| Lead Diameter | Drill | Pad Diameter |
|--------------|-------|-------------|
| 0.4mm | 0.7mm | 1.8mm |
| 0.6mm | 0.9mm | 2.0mm |
| 0.8mm | 1.1mm | 2.2mm |
| 1.0mm | 1.3mm | 2.5mm |

### Silk Screen Rules

- **Min line width**: 0.15mm
- **Min text height**: 0.8mm
- **Don't overlap pads**: Keep silk 0.2mm from any pad
- **Pin 1 indicator**: Always include (dot, circle, or beveled corner)

## Verification

Before using a custom part in a design:

1. **Print the pattern at 1:1 scale**: **File** → **Print** → set scale to 100%.
2. Place the physical component on the printout.
3. Verify all leads align with the printed pads.
4. Check pad spacing against the datasheet.
5. Create a test schematic with the part → run ERC.
6. Export to PCB → verify the footprint appears correctly on the board.
7. Run DRC → verify no footprint-related errors.

## Managing Custom Libraries

1. **One library file per category**: `company-passives.lib`, `company-ics.lib`, `company-connectors.lib`.
2. **Version control**: Store library files in Git or SVN for change tracking.
3. **Backup**: Copy library files to cloud storage weekly.
4. **Naming convention**: Use `[PackageType]-[Size]-[Pitch]` for patterns, `[ManufacturerPartNumber]` for components.
5. **Documentation**: Maintain a spreadsheet listing all custom parts with creation date, datasheet URL, and verification status.
