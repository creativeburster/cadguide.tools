---
title: "Quadcept PCB Design Flow: ERC/DRC Verification, Gerber Export, and Cross-Tool Netlist Integration with Xpedition"
excerpt: "Quadcept's PCB design workflow covers schematic capture, ERC/DRC/MRC verification, Gerber/NC drill export, and netlist-based integration with external PCB tools like Xpedition. We cover the full flow plus known limitations: DXF polygon fill gaps, CR5000 conversion issues, and back-annotation constraints."
category: "workflow"
softwareSlug: "quadcept"
keyword: "Quadcept PCB design ERC DRC Gerber export netlist Xpedition back-annotation workflow"
slug: "quadcept-pcb-design-verification-gerber-export-netlist-integration"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-07-30"
sources:
  - "https://support.quadcept.com/en/basic-flow/"
  - "https://support.quadcept.com/en/quadcept-11-1-0-released/"
  - "https://forum.quadcept.com/questions/739"
---

# Quadcept PCB Design Flow: ERC/DRC Verification, Gerber Export, and Cross-Tool Netlist Integration with Xpedition

Quadcept is a cloud-based EDA tool for schematic capture and PCB layout. Its design flow follows a structured path from schematic to manufacturing output, with verification gates at each stage. The tool also supports netlist-based integration with external PCB editors like Xpedition, though with documented limitations.

## Stage 1: Schematic Capture

### Component Creation

Components in Quadcept require:
- **Symbol** (schematic representation)
- **Footprint** (PCB representation) — must be linked before transferring to PCB
- **Attributes** (manufacturer, part number, value, etc.) — used for BOM export

Use consistent attribute names across all components to simplify BOM export column mapping.

### ERC (Electrical Rule Checking)

After schematic completion, run ERC to check for connection violations:

1. Go to **Completion tab → ERC/DRC → Run ERC/DRC**
2. ERC checks for: unconnected pins, duplicate references, power/ground conflicts
3. Configure rules in **ERC/DRC → ERC/DRC Settings**
4. Fix all ERC errors before proceeding

### BOM Generation

Generate the BOM from the schematic:
- Export columns map to component attributes
- Use the same attributes consistently to avoid mapping errors
- BOM is ready for part procurement

## Stage 2: Transfer to PCB

Use the **Transfer to PCB** command in the Completion tab.

**Critical requirement**: All schematic components must have linked footprint models. The transfer command will fail if any component lacks a footprint.

## Stage 3: PCB Layout

### DRC (Design Rule Checking)

DRC checks for physical layout violations:
- Short circuits between traces
- Clearance violations between any two objects (pads, traces, planes)
- Define clearance rules for each object pair in **DRC/MRC Settings**

### MRC (Manufacturing Rule Checking)

MRC checks for manufacturing feasibility:
- Mismatched text angles
- Other manufacturing-specific constraints

DRC and MRC can be run separately or together via **Run ERC/DRC**.

### Working with Planes

When DRC errors are difficult to fix due to plane visibility:
- Press **K** key to display only plane outlines — makes it easier to work on errors
- Use **Rebuild Plane** command to rebuild dynamic planes after placing objects within their area — this avoids short circuits

### Keepout Areas

Quadcept 11.1+ added an option for keepout areas: **"Apply only to planes"** — this excludes pads and traces from error checking within the keepout, useful for defining plane-only exclusion zones.

## Stage 4: Manufacturing Output

### Gerber Export

Gerber files contain all layer details for PCB manufacturing:
- Export each layer separately
- Pay close attention to layer mapping and aperture settings
- Any mistakes at this stage lead to costly manufacturing errors

### NC Drill File

The NC drill file specifies:
- Location of each drill hole
- Size of each drill hole
- Required alongside Gerber files for complete manufacturing data

### Known Export Issues

#### DXF Polygon Fill Limitation

Objects drawn as polygons in Quadcept are exported to DXF as **outline line data only** — the interior is not filled. This is by design, not a bug:

- **Pads**: Exported as filled objects (exception)
- **Custom Pads**: Exported as outline only (internally managed as polygon objects)
- **Planes**: Appear filled but are composed of multiple lines — imported as multiple lines
- **Mesh planes**: Exported as outline only

If you need filled polygon objects in DXF format, this is **not supported in Quadcept**. The support team has acknowledged this as a feature request for future development.

#### Gerber Import with Macro Apertures

An issue was fixed in v11.1.0 where importing Gerber data containing certain macro apertures caused an error. Ensure you're on the latest version if working with complex aperture definitions.

#### DXF Export from Inner Layers

Quadcept 11.1+ supports DXF export when keepout areas are defined on inner layers. Earlier versions had issues with this combination.

## Cross-Tool Integration: Xpedition PCB

### Netlist-Based Workflow

Quadcept supports importing netlists from external PCB tools via the free **NETCHANGER** conversion tool:

1. Design the schematic in Quadcept
2. Export the netlist
3. Import the netlist into Xpedition PCB (or Altium, OrCAD, Eagle, etc.)
4. Perform PCB layout in Xpedition
5. Renumber components on the PCB in Xpedition
6. Generate a "was-is" file from Xpedition

### Back-Annotation Constraint

**Direct back-annotation from external PCB tools to Quadcept schematic is not supported.**

The back-annotation feature (PCB → schematic synchronization) only works when both schematic and PCB are designed within Quadcept. If the PCB is designed in Xpedition, you cannot directly import the "was-is" file back to the Quadcept schematic.

### Workaround: Hybrid Quadcept PCB Approach

To enable back-annotation with an external PCB tool:

1. Design the schematic in Quadcept
2. Create footprints for all components in Quadcept
3. Create a new PCB project in Quadcept
4. Import the netlist output from Xpedition into the Quadcept PCB sheet
5. Perform back-annotation from the Quadcept PCB to the Quadcept schematic

This creates a Quadcept PCB as an intermediary, enabling the back-annotation path. It requires maintaining footprints in Quadcept even if the actual layout is done in Xpedition.

## CR5000 File Conversion

Quadcept supports importing CR5000 schematic and board files, with known issues fixed in recent versions:

### Fixed Issues (v10.4.0+)

- Symbols not converting correctly from CR5000 schematics with certain data
- Pads not importing properly from CR5000 board files
- CR5000-BD inner layer deletion errors
- CR5000-BD converter now imports via names and board outline as line objects

### Fixed Issues (v11.1.0)

- Pin assignment inconsistencies during component updates
- Prohibited characters in component/symbol/footprint names from UL/Samacsys data
- CCM-CAD and CPM-CAD integration improvements
- Certain project data that couldn't be opened

## DRC/MRC Improvements (v11.1.0)

Recent DRC/MRC enhancements include:

- **Resizable settings dialog** for better visibility of complex rule sets
- **Same-net clearance DRC fix**: Pseudo-error where same-net clearance was triggered for objects spanning multiple design rule regions — fixed
- **Dynamic plane and custom pad clearance**: Fixed issue where clearance was less than specified value in certain cases
- **Connectivity check**: Improved accuracy and performance
- **Net class ordering**: Users can now change the order of net class settings

## Best Practices

1. **Always run ERC before transferring to PCB** — catching schematic errors early prevents layout rework
2. **Link all footprints before transfer** — the transfer command will fail without them
3. **Run DRC/MRC after layout completion** — fix all errors before generating manufacturing files
4. **Use the K key** when working with plane-related DRC errors — outlines make errors visible
5. **Rebuild planes** after placing objects within dynamic plane areas
6. **Verify Gerber output** — check layer mapping and aperture settings against your manufacturer's requirements
7. **Keep Quadcept updated** — many conversion and DRC bugs are fixed in each release
8. **For Xpedition integration**: Maintain Quadcept footprints to enable the back-annotation workaround
