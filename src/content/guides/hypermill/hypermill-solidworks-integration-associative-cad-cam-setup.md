---
title: "hyperMILL for SOLIDWORKS: Associative CAD-CAM Integration Setup"
excerpt: "hyperMILL for SOLIDWORKS provides a single-database CAD/CAM solution where design changes automatically update toolpaths. Here's the setup, workflow, and best practices based on OPEN MIND and SolidWorks partner documentation."
category: "workflow"
softwareSlug: "hypermill"
keyword: "hypermill solidworks integration associative cad cam setup"
slug: "hypermill-solidworks-integration-associative-cad-cam-setup"
author: "CADGuide Technical Editorial"
readTime: "8 min read"
date: "2026-07-12"
sources:
  - "https://www.openmind-tech.com/en-us/cam/cad-integrations/solidworks/"
  - "https://files.solidworks.com/partners/pdfs/bro-solidworks-cad-integration-hypermill-en.pdf"
  - "https://www.openmind-tech.com/en-us/cam/cad-integrations/"
---

# hyperMILL for SOLIDWORKS: Associative CAD-CAM Integration Setup

hyperMILL for SOLIDWORKS is an integrated CAM solution that runs directly inside SolidWorks. According to OPEN MIND: "Integration facilitates continuous processes with a single database. Both the CAD and CAM systems access the same data model. This prevents data import problems as well as read/write errors."

## How the Integration Works

Unlike standalone CAM systems that import CAD files, hyperMILL for SOLIDWORKS operates within the SolidWorks environment:
- The CAD model and CAM toolpaths share the same SolidWorks file
- No data translation between CAD and CAM
- Design changes in SolidWorks automatically propagate to hyperMILL toolpaths
- The user works in the familiar SolidWorks interface

## CAD Integration Options

hyperMILL is available with three CAD integrations:
1. **hyperMILL CAD (formerly hyperCAD-S)**: OPEN MIND's own CAD system
2. **hyperMILL for SOLIDWORKS**: Integrated within SolidWorks
3. **hyperMILL for Autodesk Inventor**: Integrated within Inventor

According to OPEN MIND: "hyperMILL is always used in combination with a powerful CAD system. Depending upon customer requirements, this could be the CAD software in hyperMILL, SOLIDWORKS or Autodesk Inventor."

## Installation and Setup

### Prerequisites
1. SolidWorks must be installed and licensed (2018 or later, check compatibility with your hyperMILL version)
2. hyperMILL for SOLIDWORKS license from OPEN MIND
3. Administrator rights for installation

### Installation Steps
1. Install SolidWorks first (if not already installed)
2. Run the hyperMILL for SOLIDWORKS installer
3. The installer adds hyperMILL as a SolidWorks add-in
4. Launch SolidWorks
5. Enable the hyperMILL add-in in SolidWorks (Tools → Add-Ins)
6. Activate your hyperMILL license

### License Activation
1. Start SolidWorks with the hyperMILL add-in enabled
2. The license manager appears on first launch
3. Enter your hyperMILL license key
4. Select the licensed modules (2.5D, 3D, 5-axis, etc.)
5. Complete activation

## Workflow: From Design to CNC Program

### Step 1: Design or Import the Part in SolidWorks
1. Create the part in SolidWorks using standard modeling tools
2. Or import an existing CAD file (STEP, IGES, Parasolid) into SolidWorks
3. The part is a standard SolidWorks part file (.sldprt)

### Step 2: Switch to hyperMILL
1. In SolidWorks, switch to the hyperMILL tab/ribbon
2. The hyperMILL CAM interface appears within SolidWorks
3. The part geometry is immediately available — no import needed

### Step 3: Define the Stock
1. Create a stock model (raw material block)
2. Options:
   - Box stock (automatic bounding box)
   - Cylinder stock
   - Custom stock (modeled in SolidWorks)
3. The stock is associative — if the part changes, the stock updates

### Step 4: Define the Machine
1. Select or create a machine definition
2. Specify:
   - Machine type (3-axis, 4-axis, 5-axis)
   - Controller type (Fanuc, Siemens, Heidenhain, etc.)
   - Axis travel limits
   - Kinematics configuration
3. The machine definition is used for simulation and post-processing

### Step 5: Create Toolpaths
1. Select machining operations from the hyperMILL ribbon:
   - 2.5D: Facing, pocketing, contouring, drilling
   - 3D: Roughing, finishing, rest material machining
   - 5-axis: Simultaneous 5-axis, 3+2 indexing, swarf machining
2. Select geometry directly from the SolidWorks model (faces, edges, surfaces)
3. Configure operation parameters (tool, speeds, feeds, stepover)
4. Calculate the toolpath
5. The toolpath is displayed on the SolidWorks model

### Step 6: Simulate
1. Use hyperMILL's simulation to verify toolpaths
2. Material removal simulation shows the machined result
3. Collision checking against the part, stock, and machine

### Step 7: Post-Process
1. Select the post-processor for your machine
2. Generate G-code
3. The G-code is saved to the specified output directory

### Step 8: Design Change — Associative Update
1. Modify the SolidWorks part (change a dimension, add a feature)
2. Switch to the hyperMILL tab
3. hyperMILL detects the design change
4. Affected toolpaths are marked for recalculation
5. Recalculate — toolpaths update to match the new geometry
6. No need to re-import or reprogram from scratch

## Working in Assembly Mode

According to OPEN MIND: "hyperMILL for SOLIDWORKS allows the user to work in both single part mode and assembly mode."

In assembly mode:
1. Open a SolidWorks assembly (.sldasm) containing the part to machine
2. The part is machined in the context of the assembly
3. Fixture components can be included for collision checking
4. Multiple parts in the assembly can be programmed in one session

## Benefits of Single-Database Integration

### No Data Translation
- Traditional CAM: Export CAD to STEP/IGES → Import to CAM → Data loss possible
- hyperMILL for SOLIDWORKS: Direct access to SolidWorks geometry → No translation errors

### Associative Updates
- Traditional CAM: Design change → Re-export → Re-import → Reprogram
- hyperMILL for SOLIDWORKS: Design change → Recalculate → Done

### Single User Interface
- Learn one environment (SolidWorks with hyperMILL add-in)
- No switching between CAD and CAM applications
- Same navigation, selection, and display controls

### Full CAD Functionality
- All SolidWorks modeling tools available during CAM programming
- Can modify the part design while programming toolpaths
- Can add fixture geometry, stock models, or reference geometry as needed

## Common Issues

### Issue: Toolpath Doesn't Update After Design Change
1. Check that the hyperMILL add-in is still active
2. Force a rebuild in SolidWorks (Ctrl+Q)
3. In hyperMILL, right-click the operation → Update
4. If the operation references a deleted face/edge, reselect the geometry

### Issue: hyperMILL Tab Not Visible in SolidWorks
1. Go to Tools → Add-Ins
2. Check the hyperMILL add-in (both active and startup boxes)
3. If not listed, reinstall hyperMILL for SOLIDWORKS
4. Verify SolidWorks version compatibility with your hyperMILL version

### Issue: Performance Is Slow with Complex Parts
1. Use SolidWorks lightweight mode for large assemblies
2. Suppress unnecessary features during CAM programming
3. Simplify the display (turn off real-time rendering)
4. Use hyperMILL's hidden-time calculation for background processing

## Best Practices

1. **Name features meaningfully**: "Pocket_1" is easier to identify in CAM than "Extrude-47"
2. **Use configurations**: Create SolidWorks configurations for different stock sizes or machining stages
3. **Keep the feature tree clean**: A clean, well-organized feature tree makes CAM programming easier
4. **Document machining setups**: Add notes in SolidWorks about which faces are machined in which operation
5. **Use assembly mode for fixtures**: Include fixture models for realistic collision checking
6. **Save frequently**: Although the integration is stable, save both the SolidWorks part and hyperMILL project regularly
7. **Version compatibility**: Verify hyperMILL version compatibility before upgrading SolidWorks (or vice versa)
