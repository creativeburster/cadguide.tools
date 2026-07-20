---
title: "Autodesk Netfabb 3D Print Preparation: Orientation, Packing, and Slicing Workflow"
excerpt: "Netfabb's print preparation tools handle part orientation, build plate packing, slicing, and G-code generation for industrial 3D printers. We cover the orientation optimization workflow, arranging multiple parts on the build plate, and exporting print-ready files for SLS, SLA, and FDM systems."
category: "workflow"
softwareSlug: "autodesk-netfabb"
keyword: "Autodesk Netfabb 3D print preparation orientation packing slicing workflow"
slug: "autodesk-netfabb-3d-print-preparation-orientation-packing-slicing"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://www.autodesk.com/products/netfabb/overview"
  - "https://www.tpm.com/blog/autodesk-netfabb-the-complete-solution-for-3d-printing-preparation/"
  - "https://formlabs.com/blog/best-stl-file-repair-software-tools/"
---

# Autodesk Netfabb 3D Print Preparation: Orientation, Packing, and Slicing Workflow

We've prepared hundreds of parts for 3D printing through Netfabb, from single prototypes to full build plates of nested SLS parts. Netfabb's print preparation pipeline covers everything from part orientation to build plate packing to final slicing — and understanding each step ensures efficient, successful prints across FDM, SLA, and SLS technologies.

## The Print Preparation Pipeline

Netfabb's workflow follows a logical sequence:
1. **Import and repair** the mesh
2. **Orient** the part for optimal printing
3. **Add features** (labels, supports, lattice structures)
4. **Pack** multiple parts on the build plate
5. **Slice** and generate print files
6. **Export** to the printer

## Part Orientation

### Why Orientation Matters

Part orientation affects:
- **Surface quality**: Overhangs and layer lines are visible on certain faces
- **Print speed**: Taller prints take longer; wider prints may need more supports
- **Mechanical strength**: Layer adhesion is weakest along the Z-axis
- **Support material**: Optimal orientation minimizes support requirements
- **Build capacity**: Orienting diagonally can fit parts that wouldn't fit flat

### Manual Orientation

1. Select the part in the 3D view
2. Use the **Rotate** tool (or right-click → Transform)
3. Rotate around X, Y, or Z axes
4. Enter exact angles for precise control
5. Use **Place on Face** to automatically orient a selected face flat on the build plate

### Automatic Orientation

1. Select the part
2. Go to **Orient** in the toolbar
3. Netfabb analyzes the geometry and suggests optimal orientations
4. Choose from multiple suggested orientations
5. The software evaluates each orientation for:
   - Minimum support volume
   - Minimum contact area
   - Optimal surface quality

### Orientation Best Practices by Technology

**FDM**:
- Flat surfaces down (minimize supports)
- Minimize overhangs >45°
- Orient critical surfaces facing up (away from support material)
- Consider layer line direction for aesthetic purposes

**SLA/DLP**:
- Orient at 30-45° angle for optimal drain
- Large flat surfaces should not face directly down (suction forces)
- Hollow parts need drain holes oriented downward

**SLS**:
- Pack as many parts as possible (no supports needed)
- Orient large flat surfaces vertically to minimize warping
- Stagger parts vertically to avoid heat concentration zones

## Build Plate Packing

### Single Part Placement

1. After orientation, use **Place on Build Platform**
2. Netfabb positions the part at the origin
3. Adjust position by dragging or entering coordinates
4. Ensure the part is within the build volume boundaries

### Multi-Part Packing

For production runs with multiple parts:

1. Import all parts into Netfabb
2. Go to **Build** → **Pack**
3. Configure packing settings:
   - **Part spacing**: Minimum distance between parts (typically 5-10mm for SLS)
   - **Build volume**: Matches your printer's build area
   - **Nesting depth**: How aggressively to nest parts (higher = more parts but slower calculation)
4. Click **Pack** to run the packing algorithm
5. Netfabb arranges all parts within the build volume
6. Review the arrangement and adjust if needed

### Packing Optimization

- **SLS**: Pack densely — no supports needed, so parts can be nested closely
- **FDM**: Leave space for support material between parts
- **SLA**: Leave space for resin flow and drain
- **Metal AM**: Leave significant space for thermal management

## Adding Features Before Slicing

### Labels and Engraving

1. Select the part
2. Go to **Insert → Text**
3. Enter text and choose font/size
4. Position the text on the part surface
5. Choose embossed (raised) or engraved (recessed)

### Lattice Structures (Premium)

1. Select the part
2. Go to **Lattice** → **Create Lattice**
3. Choose lattice type (tetrahedral, hexagonal, stochastic)
4. Set cell size and density
5. Netfabb replaces solid material with lattice structure
6. This reduces weight and material usage while maintaining structural integrity

### Hollowing (Premium)

1. Select the part
2. Go to **Hollow** → **Create Hollow**
3. Set wall thickness
4. Netfabb removes internal material, creating a shell
5. Add drain holes for SLS/SLA printing

## Slicing

### Configuring Slices

1. Go to **Slicing** in the toolbar
2. Set **Layer Height** (typically 0.05-0.3mm depending on technology)
3. Choose slicing strategy:
   - **Standard**: Uniform layer height
   - **Adaptive**: Variable layer height based on geometry
4. Click **Slice** to generate layers

### Exporting Print Files

1. After slicing, go to **File → Export**
2. Choose the appropriate format for your printer:
   - **CLI**: Common for SLS and metal AM
   - **SLC**: For SLA systems
   - **G-code**: For FDM printers
   - **3MF**: For systems that support it
3. Configure export settings (units, coordinate system)
4. Save the file and transfer to the printer

## Connecting to Printers

Netfabb supports direct connections to several 3D printer brands:
1. Go to **Machine → Add Machine**
2. Select your printer model
3. Configure connection settings (IP, port, protocol)
4. Send print jobs directly from Netfabb

## Common Issues

### Part Exceeds Build Volume

- Rotate or scale the part to fit
- Split the part into multiple pieces (use cutting tools)
- Use a different printer with a larger build volume

### Packing Algorithm Doesn't Fit All Parts

- Reduce part spacing
- Rotate parts to different orientations
- Run packing with higher nesting depth
- Split into multiple build jobs

### Slices Show Errors

- Run mesh repair before slicing
- Check for non-manifold edges that weren't fixed
- Verify the mesh is watertight
- Reduce layer height for complex geometry

## Summary

Netfabb's print preparation workflow covers the complete pipeline from mesh to print-ready file. Start by repairing the mesh, then orient the part for optimal surface quality and minimal supports. Use automatic orientation for quick suggestions, or manually orient for precise control. For production runs, use the Pack function to arrange multiple parts efficiently on the build plate. Add features like labels, lattice structures, or hollowing before slicing. Finally, slice the model and export in the format your printer requires. The key considerations differ by technology: FDM needs support-minimizing orientation, SLA needs angled orientation for resin drain, and SLS allows dense packing without supports.

The print preparation process in Netfabb is designed to be linear and iterative — you can always go back to a previous step and adjust orientation, packing, or features before re-slicing. For production environments running multiple print jobs per day, the packing algorithm alone can save significant time and material by maximizing build plate utilization. Always verify the sliced output in Netfabb's layer preview before sending to the printer, and run a final mesh check to ensure no errors were introduced during feature addition.
