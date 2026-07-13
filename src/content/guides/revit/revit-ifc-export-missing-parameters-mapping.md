---
title: "Fixing Missing Parameters in Revit IFC Exports: Mapping and Configuration Guide"
excerpt: "Complete workflow for configuring IFC export mappings in Revit, resolving missing property sets, and ensuring COBie and IFC4 compliance for BIM deliverables."
category: "standards"
softwareSlug: "revit"
keyword: "revit ifc export"
slug: "revit-ifc-export-missing-parameters-mapping"
author: "CADGuide Technical Editorial"
readTime: "14 min read"
date: "2026-06-25"
sources:
  - "https://knowledge.autodesk.com/support/revit/troubleshooting/caas/sfdcarticles/sfdcarticles/Certain-shared-parameters-not-exportetd-to-IFC-from-Revit.html"
  - "https://forums.autodesk.com/t5/revit-forum/ifc-export-missing-parameters/td-p/4321098"
---

# Fixing Missing Parameters in Revit IFC Exports: Mapping and Configuration Guide

IFC export from Revit is one of those things that should be straightforward but rarely is. I've been on projects where the structural engineer opened our IFC export in Navisworks and half the parameter data was missing — no fire rating, no load-bearing flag, no material properties. The problem wasn't Revit's IFC exporter; it was that nobody had configured the parameter mapping. Let me walk you through how I set up IFC exports so the downstream applications actually get the data they need.

## Understanding IFC Export in Revit

Revit's IFC exporter translates Revit elements into IFC entities:

| Revit Element | IFC Entity |
|---|---|
| Wall | IfcWall |
| Door | IfcDoor |
| Window | IfcWindow |
| Floor | IfcSlab |
| Roof | IfcRoof |
| Space | IfcSpace |
| Duct | IfcDuctSegment |

Each IFC entity can have property sets (Psets) that carry parameter data. The standard property sets are defined by buildingSMART:

- `Pset_WallCommon`: Fire rating, thermal transmittance, load bearing, etc.
- `Pset_DoorCommon`: Fire rating, security rating, glazing, etc.
- `Pset_SpaceCommon`: Interior or exterior, reference, occupancy type, etc.

Revit maps its built-in parameters to these standard Psets automatically. The problem arises when:

1. **Project parameters are not mapped**: Custom shared parameters added to the Revit model are not included in the IFC export by default.
2. **The IFC export mapping file is outdated**: The mapping file does not include the latest parameter definitions.
3. **The IFC version does not support the Pset**: IFC2x3 has fewer standard Psets than IFC4.

## Step 1: Identify Missing Parameters

### Export and Inspect

1. Go to File > Export > IFC.
2. Select IFC2x3 or IFC4 as the format.
3. Export the model.
4. Open the exported `.ifc` file in an IFC viewer (BIMcollab Zoom, Solibri, or the free Autodesk Navisworks Freedom).

5. Select an element and review its properties.
6. Compare the properties shown in the IFC viewer with the parameters in the Revit model.

### Use the IFC Parameter Mapping Report

Revit can generate a report showing which parameters were mapped and which were skipped:

1. Go to File > Export > IFC.
2. Click "Modify Setup" (not the quick export).
3. In the IFC Export Setup dialog, check "Export only elements visible in view" (optional).
4. Click "Export."
5. After export, check the Revit journal file for mapping warnings:
   ```
   %LOCALAPPDATA%\Autodesk\Revit\Autodesk Revit 2026\Journals\
   ```
6. Search for "IFC" and "unmapped" in the journal file.

## Step 2: Configure the IFC Export Mapping File

Revit uses an XML-based mapping file to define parameter-to-Pset mappings. The default file is:

```
C:\ProgramData\Autodesk\Revit\Addins\2026\IFCExport\ExportIFC-Common.txt
```

Or for newer versions:

```
C:\Program Files\Autodesk\Revit 2026\Addins\IFCExporterUI\IFCExportParameterMapping.txt
```

### Understand the Mapping File Format

The mapping file uses a tab-separated format:

```
RevitParameterName	IFCEntity	PsetName	IFCPropertyName
```

For example:

```
Fire Rating	IfcWall	Pset_WallCommon	FireRating
Thermal Transmittance	IfcWall	Pset_WallCommon	ThermalTransmittance
Load Bearing	IfcWall	Pset_WallCommon	LoadBearing
```

### Add Custom Parameter Mappings

1. Make a backup copy of the mapping file.
2. Open the file in a text editor (Notepad++ recommended).
3. Add lines for your custom shared parameters:

```
MyCompany_FireRating	IfcWall	Pset_WallCommon	FireRating
MyCompany_AcousticRating	IfcWall	Pset_WallCommon	AcousticRating
MyCompany_Manufacturer	IfcDoor	Pset_ManufacturerTypeInformation	Manufacturer
MyCompany_ModelReference	IfcDoor	Pset_ManufacturerTypeInformation	ModelReference
```

4. Save the file.
5. Restart Revit and re-export to IFC.
6. Verify the parameters now appear in the IFC export.

### Mapping File Location for Custom Projects

For project-specific mappings, create a custom mapping file and reference it:

1. Copy the default mapping file to your project directory.
2. Rename it (e.g., `ProjectA_IFC_Mapping.txt`).
3. Edit the file with project-specific parameter mappings.
4. In Revit, go to File > Export > IFC > Modify Setup.
5. In the "Parameter Mapping Table" field, browse to your custom file.
6. Export with the custom mapping.

## Step 3: Use the Revit IFC Export UI Add-In

The open-source IFC Export UI add-in (developed by Autodesk on GitHub) provides more control over the export process than the built-in exporter.

### Install the IFC Export UI

1. Download the latest release from:
   ```
   https://github.com/Autodesk/revit-ifc/releases
   ```
2. Run the installer and select your Revit version.
3. Restart Revit.

### Configure Advanced Export Options

1. Go to Add-Ins > IFC Export (the add-in tab).
2. Click "Modify Setup."
3. The advanced dialog provides options not available in the built-in exporter:
   - **Export only elements with specific property sets**: Filter the export to include only elements with mapped parameters.
   - **Include COBie data**: Export COBie-specific Psets for facility management deliverables.
   - **Export internal property sets**: Include Revit-specific Psets in addition to standard IFC Psets.
   - **Tessellation level**: Control the geometric detail of exported solids.

4. Configure the options for your deliverable requirements.
5. Click "Export."

## Step 4: Map Shared Parameters to IFC Psets

Shared parameters are the mechanism for adding custom data to Revit elements. To include them in IFC exports:

### Create a Shared Parameter File

1. Go to Manage > Project Parameters.
2. Click "Shared Parameters."
3. Create a shared parameter file (`.txt`) if one does not exist.
4. Add parameter groups (e.g., "IFC Properties").
5. Add parameters with the following naming convention:
   - Use the IFC property name as the Revit parameter name (e.g., "FireRating" instead of "Fire Rating").
   - This makes the mapping file simpler and reduces naming mismatches.

### Assign Shared Parameters to Categories

1. Go to Manage > Project Parameters.
2. Click "Add."
3. Select "Shared Parameter."
4. Select the parameter from the shared parameter file.
5. Assign it to the appropriate category (e.g., Walls, Doors, Windows).
6. Set the parameter as a Type or Instance parameter based on the IFC requirement.

### Map in the Export File

Add the shared parameter to the mapping file:

```
FireRating	IfcWall	Pset_WallCommon	FireRating
```

If the Revit parameter name matches the IFC property name exactly, the mapping is automatic and no mapping file entry is needed.

## Step 5: Choose the Correct IFC Version

### IFC2x3 (CV 2.0)

The most widely supported IFC version. Use for:
- Coordination with Navisworks
- Clash detection workflows
- Projects with older downstream applications

IFC2x3 has a limited set of standard Psets. Custom parameters must be mapped to custom Psets (e.g., `Pset_MyCompany_Custom`).

### IFC4 (Add2)

The latest officially released IFC version. Use for:
- Facility management deliverables (COBie)
- Projects requiring IFC4 certification
- Downstream applications that support IFC4

IFC4 includes more standard Psets and better support for alignment, structural analysis, and building services data.

### IFC4.3

For infrastructure projects (roads, bridges, rails). Use when the project deliverable specification requires IFC4.3.

## Step 6: Validate the IFC Export

### Use Solibri Model Checker

1. Open the exported IFC file in Solibri Model Checker.
2. Run the "Information Takeoff" report.
3. Verify that all required parameters are present for each element type.
4. Run the "Classification" rule set to verify IFC entity mapping.

### Use BIMcollab Zoom (Free)

1. Download BIMcollab Zoom from `https://www.bimcollab.com/products/bimcollab-zoom`.
2. Open the IFC file.
3. Click on elements and verify properties in the Properties panel.
4. Use the BCF (BIM Collaboration Format) to report missing parameters back to the Revit team.

### Use the IFC Validator

buildingSMART provides an online IFC validator:

```
https://validate.buildingsmart.org
```

Upload the IFC file and run validation. The validator checks:
- Schema compliance (IFC2x3 or IFC4)
- Required property set presence
- Geometry validity
- Reference integrity

## Step 7: Automate IFC Export with Dynamo

For projects that require frequent IFC exports with consistent settings:

1. Open Dynamo for Revit.
2. Use the "Export IFC" node from the Revit IFC Dynamo package.
3. Configure the export settings in the node:
   - IFC version
   - Mapping file path
   - Export scope (entire model or specific views)

4. Save the Dynamo script and run it via Dynamo Player for repeatable, consistent exports.

This ensures every export uses the same mapping file and settings, eliminating the risk of a user forgetting to select the custom mapping file.
