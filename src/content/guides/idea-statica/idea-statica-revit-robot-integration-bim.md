---
title: "IDEA StatiCa Integration with Revit and Robot: BIM Workflow for Steel Connections"
excerpt: "How to integrate IDEA StatiCa with Autodesk Revit and Robot Structural Analysis — covering force import, connection geometry sync, BIM model updates, and clash detection."
category: "deployment"
softwareSlug: "idea-statica"
keyword: "idea statica revit robot integration bim workflow"
slug: "idea-statica-revit-robot-integration-bim"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.ideastatica.com/support-center/autodesk-revit-bim-link-for-connection-design-en"
  - "https://www.ideastatica.com/support-center/robot-structural-analysis-bim-link-for-connection-design-aisc"
---

# IDEA StatiCa Integration with Revit and Robot: BIM Workflow for Steel Connections

The BIM workflow for steel connections involves three tools: Revit (modeling), Robot (analysis), and IDEA StatiCa (connection design). We've set up this workflow on multiple projects and it eliminates manual data transfer. Here's how to configure it.

## The BIM Workflow Overview

1. **Revit**: Create the structural model (columns, beams, braces) with connection placeholders
2. **Robot**: Analyze the structure and calculate member forces
3. **IDEA StatiCa**: Design connections using forces from Robot and geometry from Revit
4. **Revit**: Update the model with designed connection details (plates, bolts, welds)

This round-trip workflow ensures the BIM model reflects the actual connection designs.

## Step 1: Revit Model Setup

### Install IDEA StatiCa Revit Plugin

1. Download the IDEA StatiCa Revit plugin from the IDEA StatiCa website.
2. Run the installer (requires Revit 2022 or later).
3. In Revit: **Add-Ins** → **IDEA StatiCa** tab appears.

### Model the Structure

1. Create the structural frame in Revit:
   - Columns, beams, braces using Revit structural framing families
   - Place connections using Revit's structural connection tool (or leave as simple intersections)

2. Add connection markers:
   - Use Revit's **Structural Connections** tool to mark connection locations
   - Each connection marker identifies the connected members and connection type

3. Set up analytical model:
   - Revit generates the analytical model automatically
   - Verify the analytical model: **View** → **Analytical Model**
   - Check that all members are connected at the correct nodes

## Step 2: Export to Robot

1. In Revit: **Analyze** → **Robot Structural Analysis**.
2. Revit exports the analytical model to Robot:
   - Member geometry (nodes, bars, sections)
   - Materials
   - Supports
   - Load cases (if defined in Revit)

3. In Robot:
   - Verify the imported model
   - Add or modify loads as needed
   - Run the structural analysis
   - Review results (forces, deflections, code checks)

## Step 3: Export Forces from Robot

1. In Robot: **Results** → **Connection Forces**.
2. Select the connections to export:
   - Choose specific joints or all joints
   - Robot calculates the forces at each connection for all load combinations

3. Export format:
   - **IDEA StatiCa format**: Direct export (.ideaCon file)
   - **Excel**: Spreadsheet with connection forces (manual import to IDEA StatiCa)

4. The exported data includes:
   - Connection ID (matches Revit connection marker)
   - Member forces: N, Vy, Vz, Our, Mz, Mx for each connected member
   - All load combinations

## Step 4: Design Connections in IDEA StatiCa

### Import Forces

1. Open IDEA StatiCa → **Connection**.
2. **File** → **Import** → **Robot Forces** (or Excel).
3. Select the exported file.
4. IDEA StatiCa loads the connection forces for all selected connections.

### Import Geometry from Revit

1. In Revit: **Add-Ins** → **IDEA StatiCa** → **Export Connection**.
2. Select the connection to export.
3. Revit exports the connection geometry (member sections, positions, orientations).
4. In IDEA StatiCa: **File** → **Import** → **Revit Connection**.
5. The connection appears in IDEA StatiCa with correct member geometry.

### Design the Connection

1. Add connection components (end plate, bolts, welds, stiffeners).
2. Apply the imported forces.
3. Click **Calculate** — IDEA StatiCa performs CBFEM analysis.
4. Review results and optimize as needed.
5. Save the connection design.

## Step 5: Update Revit Model

1. In IDEA StatiCa: **File** → **Export** → **Revit Connection**.
2. IDEA StatiCa exports the designed connection (plates, bolts, welds) as a 3D model.
3. In Revit: **Add-Ins** → **IDEA StatiCa** → **Import Connection**.
4. Select the exported file.
5. Revit updates the model:
   - Connection components appear as 3D objects (plates, bolts)
   - The connection is marked as "Designed" in the connection schedule
   - Clash detection runs automatically against other building elements

6. Review the updated model:
   - Check for clashes with MEP elements (ducts, pipes, conduits)
   - Verify connection doesn't interfere with architectural finishes
   - Confirm the connection is constructible (access for welding and bolting)

## Step 6: Connection Schedule

1. In Revit: **View** → **Schedules** → **Structural Connection Schedule**.
2. The schedule lists all connections with:
   - Connection ID
   - Type (end plate, base plate, moment, shear)
   - Status (Designed / Not Designed)
   - Design code (AISC, Eurocode)
   - Utilization ratio (from IDEA StatiCa)

3. Use the schedule to track design progress:
   - Filter by "Not Designed" to see remaining work
   - Filter by "Utilization > 0.9" to identify connections near capacity

## Batch Connection Design

For projects with many similar connections:

1. **IDEA StatiCa Batch**:
   - Import all connection forces from Robot at once
   - Design multiple connections in sequence
   - Apply a template connection to similar joints
   - Export all designed connections back to Revit

2. **Template connections**:
   - Design one connection of a type (e.g., typical beam-to-column moment connection)
   - Save as a template
   - Apply to all similar connections
   - IDEA StatiCa checks each instance with its specific forces
   - Only connections that fail the template need individual design

## Common Integration Issues

**Forces don't match**: The connection forces from Robot don't match the IDEA StatiCa results. This is usually because:
- The load combinations differ between Robot and IDEA StatiCa
- The connection ID doesn't match between Revit and Robot
- The member orientation differs (check local axes)

**Revit connection doesn't update**: The IDEA StatiCa export file isn't compatible with the Revit plugin version. Ensure both tools are updated to compatible versions.

**Clash detection shows false positives**: The connection 3D model may include simplified geometry that clashes with nearby elements. Review clashes manually — some are false positives from simplified bolt/weld representations.

**Analytical model mismatch**: The Revit analytical model may have nodes at different positions than the Robot model. Verify that the analytical model is consistent before exporting forces.
