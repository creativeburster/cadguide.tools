---
title: "Cabinet Vision Cut List, CNC Output, and Screen-to-Machine (S2M) Workflow"
excerpt: "Cabinet Vision's cut list and CNC output tools generate production-ready part lists and machine code. We cover the cut list report, part optimization, CNC program generation, and the Screen-to-Machine (S2M) workflow for direct CNC integration."
category: "workflow"
softwareSlug: "cabinet-vision"
keyword: "Cabinet Vision cut list CNC output Screen-to-Machine S2M part optimization machine code production"
slug: "cabinet-vision-cut-list-cnc-output-screen-to-machine-s2m"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-29"
sources:
  - "https://www.cabinetvision.com/products"
  - "https://www.cabinetvision.com/learning"
  - "https://www.cabinetvision.com/screen-to-machine"
---

# Cabinet Vision Cut List, CNC Output, and Screen-to-Machine (S2M) Workflow

We've set up Cabinet Vision's Screen-to-Machine (S2M) workflow for cabinet shops transitioning from manual cutting to CNC production. The S2M workflow is what sets Cabinet Vision apart from general CAD tools — it generates not just drawings but actual machine code that drives CNC routers, saws, and edge banders. Understanding the complete workflow from design to machine code is essential for any shop using CNC equipment.

## The Production Output Overview

Cabinet Vision generates several types of production output:

| Output Type | Purpose | Recipient |
|-------------|---------|-----------|
| Cut list | Part list with dimensions | Cut shop / saw operator |
| Part labels | Labels for each part | Assembly area |
| CNC programs | Machine code for CNC router | CNC operator |
| Nesting sheets | Optimized sheet layout | Panel saw operator |
| Assembly drawings | Cabinet assembly instructions | Cabinet assembler |
| Shop drawings | Dimensioned drawings for review | Client / installer |

## Cut List Generation

### Generating a Cut List

1. Go to **Reports** → **Cut List**
2. Select the scope:
   - **All cabinets**: Entire project
   - **Selected cabinets**: Specific cabinets
   - **By room**: One room at a time
3. Choose the cut list format:
   - **Sorted by part type**: All sides together, all bottoms together
   - **Sorted by cabinet**: Parts grouped by cabinet
   - **Sorted by material**: Parts grouped by material type
4. Click **Generate**

### Cut List Contents

Each part in the cut list includes:
- **Part number**: Unique identifier
- **Part name**: e.g., "LEFT SIDE", "BOTTOM", "BACK"
- **Cabinet number**: Which cabinet the part belongs to
- **Material**: Board type and thickness
- **Quantity**: Number of this part
- **Length**: Part length (cut dimension)
- **Width**: Part width (cut dimension)
- **Thickness**: Part thickness
- **Edge banding**: Which edges get banding and what type
- **Notes**: Machining notes (holes, grooves, notches)

### Cut List Optimization

1. Use the **Optimize** function to sort parts for efficient cutting:
   - Group by material type (cut all plywood parts together)
   - Sort by size (largest parts first)
   - Minimize sheet changes
2. The optimizer considers:
   - Standard sheet sizes (4'x8', 5'x8', 4'x10')
   - Saw kerf width
   - Grain direction
   - Edge banding requirements

## Part Labels

### Generating Part Labels

1. Go to **Reports** → **Part Labels**
2. Set label parameters:
   - **Label size**: 2"x4", 3"x5", or custom
   - **Label printer**: Direct to label printer or to PDF
   - **Barcode**: Include barcode for scanning
3. Each label includes:
   - Part number and name
   - Cabinet number
   - Dimensions (length x width)
   - Material
   - Edge banding information
   - Barcode (for CNC scanning)

### Label Workflow

1. Print labels before cutting
2. Apply label to each part after cutting
3. Labels travel with the part through edge banding, machining, and assembly
4. At the CNC machine, scan the barcode to load the correct CNC program
5. At assembly, the label identifies which cabinet the part belongs to

## CNC Program Generation

### Setting Up CNC Output

1. Go to **Settings** → **CNC Configuration**
2. Select the CNC machine:
   - **Brand**: Weeke, Holzher, Morbidelli, Biesse, Komo, Anderson, etc.
3. Configure machine parameters:
   - **Table size**: Working area dimensions
   - **Tooling**: Tool changer capacity and tool definitions
   - **Vacuum zones**: Number and layout of vacuum zones
   - **Spindle**: Speed range and power
   - **Drill block**: Vertical and horizontal drilling configuration
4. Set post-processor:
   - The post-processor converts Cabinet Vision's internal toolpaths to the machine's specific G-code format
   - Each CNC brand has a specific post-processor

### Generating CNC Programs

1. Go to **CNC** → **Generate Programs**
2. Select the parts to process:
   - All parts, or selected cabinets
3. Cabinet Vision generates:
   - **Toolpaths**: Cutting paths for each part
   - **Drilling**: Hole positions for system holes, shelf pins, hinges, dowels
   - **Grooving**: Dado and rabbet cuts
   - **Routing**: Outside profile cuts
   - **Edge banding data**: Which edges need banding (sent to edge bander)
4. Review the toolpaths in the **CNC Preview**
5. Verify:
   - All holes are in the correct positions
   - Toolpaths don't cross part boundaries
   - Tool changes are minimized
   - Vacuum zones are properly utilized

### CNC Machining Operations

Cabinet Vision generates code for these operations:
- **Cut-out**: Routing the part outline from the sheet
- **System holes**: 32mm system holes for adjustable shelves and hardware
- **Shelf pins**: 5mm holes for shelf supports
- **Hinge bores**: 35mm holes for concealed hinges
- **Dowels**: Dowel holes for case assembly
- **Dadoes/grooves**: For back panel insertion and shelf support
- **Confirmat holes**: For confirmat screw assembly
- **Cam lock holes**: For cam lock assembly
- **Line boring**: Continuous row of holes for multiple shelf positions
- **Notches**: For toe kick or special features

### Nesting

For CNC routers that nest parts on full sheets:

1. Go to **CNC** → **Nesting**
2. Set sheet parameters:
   - **Sheet size**: 4'x8', 5'x8', or custom
   - **Material**: Plywood, MDF, particleboard
   - **Thickness**: 3/4", 5/8", 1/2"
3. Cabinet Vision nests all parts on sheets:
   - The nesting algorithm optimizes part placement
   - Minimizes waste between parts
   - Considers grain direction
   - Minimizes tool travel between parts
4. Review the nested sheets:
   - Check for parts that don't fit
   - Verify grain direction compliance
   - Check sheet utilization percentage
5. Generate the nested CNC program

### Nesting Efficiency

- **Typical nesting efficiency**: 80-90% for rectangular parts
- **With hardware holes**: 75-85% (holes reduce usable area slightly)
- **Optimization tips**:
  - Group parts by material thickness
  - Allow part rotation where grain permits
  - Use full sheets (not partial sheets) for maximum efficiency
  - Run the optimizer multiple times for best results

## Screen-to-Machine (S2M) Workflow

### The Complete S2M Process

1. **Design**: Create cabinets in Cabinet Vision
2. **Review**: Check the 3D model and elevations with the client
3. **Generate**: Create cut list, labels, and CNC programs
4. **Nest**: Optimize part placement on sheets
5. **Send to CNC**: Transfer programs to the CNC machine
6. **Cut**: CNC router cuts and machines all parts
7. **Edge band**: Send edge banding data to the edge bander
8. **Sort**: Sort cut parts by label/cabinet number
9. **Assemble**: Assemble cabinets using the assembly drawings
10. **Install**: Install using the shop drawings

### Direct Machine Connection

1. Cabinet Vision connects directly to the CNC machine via:
   - **Network**: Ethernet connection to the machine controller
   - **USB**: Direct USB transfer
   - **File transfer**: Export to USB drive for manual transfer
2. At the CNC machine:
   - Load the nested sheet
   - Scan the barcode or select the program
   - The CNC machine executes the program
   - Parts are cut, drilled, and grooved automatically
3. After cutting:
   - Remove parts from the sheet
   - Apply labels (if not pre-applied)
   - Send parts to edge banding
   - Send parts to assembly

### Edge Bander Integration

1. Cabinet Vision generates edge banding data:
   - Which edges of each part need banding
   - Banding material and thickness
   - Banding sequence
2. Send the data to the edge bander:
   - The edge bander applies banding automatically
   - The operator loads parts in the correct sequence
3. The edge bander reads the barcode and applies the correct banding

### Assembly Drawings

1. Go to **Reports** → **Assembly Drawings**
2. Generate assembly drawings for each cabinet:
   - **Exploded view**: Shows all parts separated
   - **Part labels**: Each part is numbered
   - **Assembly instructions**: Step-by-step assembly
   - **Hardware list**: Screws, dowels, cam locks needed
3. The assembler follows the drawings to build each cabinet

## Common CNC Issues

### Holes Are in Wrong Positions

- Verify the hardware library is correctly configured
- Check the construction method settings (32mm system)
- Verify the CNC configuration matches the actual machine
- Re-generate CNC programs after making changes

### Toolpaths Don't Match the Part

- Check that the part dimensions are correct in the design
- Verify the tool definitions (diameter, length) are correct
- Re-generate the CNC programs
- Check the post-processor settings

### Nesting Efficiency Is Low

- Allow part rotation if grain direction permits
- Group parts by material thickness
- Run the optimizer with different settings
- Use standard sheet sizes
- Check for unusually shaped parts that reduce efficiency

### CNC Machine Doesn't Accept the Program

- Verify the post-processor matches the machine model
- Check the file format (some machines require specific formats)
- Ensure the program is within the machine's working area
- Verify tool numbers match the machine's tool setup

## Summary

Cabinet Vision's production output tools transform designs into manufacturing-ready data. Generate cut lists sorted by part type, cabinet, or material for the cut shop. Print part labels with barcodes for tracking through production. Generate CNC programs with toolpaths for cutting, drilling, grooving, and routing — configured for your specific CNC machine via post-processors. Use nesting to optimize part placement on full sheets (target 80-90% efficiency). The Screen-to-Machine (S2M) workflow connects design to production: design → review → generate → nest → send to CNC → cut → edge band → sort → assemble → install. The most common issues — hole positions, toolpath errors, low nesting efficiency, and machine compatibility — are addressed by verifying hardware libraries, tool definitions, nesting settings, and post-processor configuration. The S2M workflow is what makes Cabinet Vision a complete manufacturing solution, not just a design tool.
