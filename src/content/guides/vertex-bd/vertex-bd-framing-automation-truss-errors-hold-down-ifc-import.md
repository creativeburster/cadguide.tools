---
title: "Vertex BD Framing Automation: Truss Engineering Error Codes, Hold Down Placement, IFC Import Cleanup, and Panel Break Workflow"
excerpt: "Vertex BD automates wood and cold-formed steel framing from BIM models, but truss engineering produces 10+ distinct error and warning types that halt production. We cover each error message with fixes, the new automatic hold down controls, IFC import cleanup workflow, and the panel break point of no return."
category: "framing-automation"
softwareSlug: "vertex-bd"
keyword: "Vertex BD framing automation truss engineering error hold down IFC import panel break wall framing"
slug: "vertex-bd-framing-automation-truss-errors-hold-down-ifc-import"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://kben.vertex.fi/bd/truss-engineering-errors-and-warnings"
  - "https://kben.vertex.fi/bd/usa-environment-bd-2026"
  - "https://kben.vertex.fi/bd/import-an-ifc-model-as-an-object-model"
---

# Vertex BD Framing Automation: Truss Engineering Error Codes, Hold Down Placement, IFC Import Cleanup, and Panel Break Workflow

Vertex BD automates wood and cold-formed steel framing generation from architectural BIM models. The truss engineering module validates structural integrity but produces specific error and warning messages that halt production if unresolved. This guide covers every documented error type, the framing automation features, and the IFC import-to-framing workflow.

## Truss Engineering Warnings (Non-Blocking)

Warnings serve as calculation notes to the engineer. They should be carefully examined but do **not block** truss engineering.

### "Hole or notch not included in design!"

The truss model contains a hole or notch that the engineering calculation did not account for. Review the truss geometry and either remove the hole/notch or account for it manually in the structural verification.

### "Horizontal loads are not transferred between structures! Use bracing and battens to carry horizontal loads."

Only vertical loads are considered in the truss engineering. The effect of horizontal loads (e.g., loads transferred between hip trusses) is not automatically analyzed. Add bracing and battens to carry horizontal loads explicitly.

### "Possible truss triangulation problem detected. Chord may be subject to extra bending moment."

The truss triangulation may be incomplete or incorrect, causing a chord to experience bending moments it wasn't designed for. Review the truss web configuration and triangulation.

### "Grounded member detected. Reactions are not transferred to objects below."

A member is grounded (fixed) but its reactions are not being transferred to the supporting structure below. Check the support conditions and load path.

### "Truss members end connection is missing. Check member end connections!"

Two truss members lack a proper end connection. The truss can still be analyzed with the missing connection, but the member is likely insufficiently supported. Add the missing connection.

### "The selected structure is not in the load path. The structure is not analyzed."

A structure is outside the load path and won't be analyzed. Either add a support beneath it or add another structure on top to bring it into the load path.

## Truss Engineering Errors (Blocking)

Errors indicate major issues that **prevent** truss engineering from completing. If they appear before the Design Criteria dialogue, the truss model is not ready. If they appear after engineering, the structure failed capacity check.

### "The product is not strong enough for this application; change either the application or the product or both."

The target structure failed truss engineering. The latter half specifies the failure nature. Investigate and troubleshoot using the **Single truss engineering tool**.

**Fix options**:
- Change the product (use a stronger lumber grade, larger dimension, or different truss plate)
- Change the application (reduce loads, modify span, add intermediate support)
- Change both

### "Area load is not completely inside the boundary."

The area load extends outside the master plane boundary.

**Fix**: Move the area load back inside the master plane boundary.

### "Member is not adequately supported or is in an indeterminate structure."

The structure lacks sufficient support. All trusses must have at least **two point supports** or **one continuous support**. Check that all supports are in contact with the member.

### "Problem with piece orientation! Check piece location compared to structure!"

The load path from the architecture roof to the truss framing members is incomplete. Often means the **top chord is not aligned correctly** with the roof plane.

**Fix**: Realign the top chord with the roof plane. Check piece orientation in the truss layout.

### "Area load should be in same drawing model pair with horizontal structure."

Area loads are not properly supported by truss structures. Often accompanied by "Unsupported object found" error.

**Fix**: Ensure added loads are in contact with valid loading planes and truss members. Verify the loads are in the same drawing-model pair as the horizontal structure they support.

### "Structure is mechanism"

From FEA analysis — the boundary conditions are not correctly defined and analysis cannot be performed. In truss engineering, this normally indicates a **roof panel is not sufficiently supported**.

**Fix**: Add supports to the unsupported roof panel. Check all panel connections.

### "Crossing pieces detected! Delete or move one of the crossing pieces."

The load path is unclear due to crossing pieces. If the error points at roof panels, check "Roof Panels" in truss engineering settings — ensure panels don't overlap or cross.

## Automatic Hold Down Controls (BD 2026)

### New "Extra Stud w/Hold Downs" Macro

A new framing macro in the Wall Panel Layout Accessories browser adds **both stud packs and hold downs simultaneously**:
- Hold downs can be added to bottom and/or top
- Hold downs can be added to left, right, or both sides of the stud pack
- Available for both wood and steel framing
- **Not available** with Classic Wall Framing

### Automatic Hold Down During Panel Generation

Service pack 32.0.04+ adds controls to **automatically add hold downs** when generating wall panel parts:
- Hold downs added to panel end studs automatically
- Hold downs added to studs at specified minimum spacing
- Hold downs remain connected to studs if studs are moved within the panel

**Important**: Walls added to buildings **before this update** will not have the necessary new wall framing tool database fields. To add the new fields, **reselect a framing tool** from the wall framing tool library.

**Custom environments**: If the environment already contains a `wp_common` file, an additional update is required. Contact technical support.

### Expanded Hold Down Library

Additional commonly used hold downs were added to the `Holddown_Sys` library in the default installation. Hold down anchor bolt and bolt hole locations were also corrected.

### Preset Saving for Wood Framing

Selections for extra stud and extra backer macros can now be **saved as presets** to a library and loaded as needed. This feature was previously only available for steel framing.

## IFC Import Workflow

### Pre-Import Review

1. Open the IFC file in a free viewer (Solibri Anywhere, BIMvision) first
2. Review content and setup
3. Use a template that supports **3D-Levels functionality** (e.g., `PL-PARAMETRIC`)

### Import Settings

- Select levels and object types to import
- Check "Adjust 3D levels automatically" — maps IFC levels to Vertex BD drawing-model pairs
- Control 2D geometry creation by object type:
  - **Recommended for 2D**: Doors, Openings, Slabs, Walls, Windows
  - More 2D visibility = longer import time
- Choose model type:
  - **Facet Model**: Lighter, ignores true curves (suitable for pipes)
  - **Solid Model**: Heavier, shows true curves

### Post-Import Cleanup

After import, **additional cleanup is required** before generating framing:

1. **Merge extra wall splices**: The architectural model may have wall splices that should be merged
2. **Separate tall walls**: Very tall walls may need to be separated into individual building levels
3. **Check origin alignment**: If the layout is far from the green origin marker, note the coordinate offset

### Object Conversion

After import, all objects are IFC objects. Use **part conversion** to convert them to Vertex BD native objects that can be framed using the framing tools.

## Panel Breaks: The Point of No Return

### Critical Rule

**Once panel breaks have been generated, changes made to the wall, floor, ceiling, or roof are no longer transferred to the panel.**

After panel breaks:
- Framing tool changes must be made **on the panel and its layers** directly
- Changes to the architectural model won't propagate to panels
- Panel drawings must be manually updated

### Before Panel Breaks

Before generating panel breaks:
- Framing tool parameters can be changed by editing the properties of the wall or horizontal structure
- Changes propagate to the framing model automatically

### Editing Framing Tools for Multiple Structures

To edit framing tools for multiple structures simultaneously:
1. Select structures with the **same parameters** (walls, horizontal structures, or panels)
2. For panels: select panels of the **same type** — click panel labels in the floor plan or object tree
3. Right-click in the Layers list → select **Framing Tools**
4. Edit the tool parameters
5. **Regenerate parts** and update panel drawings after changes
6. The program prompts to update panel drawings when opened

### Error: "Layers have different framing tools. Differences in layers detected. Cannot edit properties."

This occurs when selected panels don't match. Ensure all selected panels have the same framing tool configuration before attempting batch edits.

## Continuous Wall Panel Details (BD 2026)

New continuous wall panel details automatically **lap sheathing 1-1/2" or 3" across panel breaks**:
- Selected during the Generate Panels function
- Can be saved as the default selection
- Ensures proper sheathing continuity at panel joints

## Implementation Best Practices

1. **Start with Vertex BD Basics** — watch the YouTube playlist before attempting production work
2. **Use template projects** — save time on project setup
3. **Import IFC with automatic level adjustment** — map levels correctly the first time
4. **Clean up architectural models** — merge splices, separate tall walls before framing
5. **Resolve all truss engineering errors** before generating production drawings
6. **Set up hold downs before panel breaks** — after breaks, changes require manual panel editing
7. **Save framing tool presets** — reuse configurations across projects
8. **Test round-trip workflows** — verify IFC import → framing → export works for your project type
9. **Reselect framing tools for existing walls** — after updating to BD 2026, existing walls need new database fields
10. **Contact support for custom environment updates** — the `wp_common` file may need manual updating
