---
title: "EPLAN Electric P8 Project Setup: Page Types, Macro Technology, and Article Data"
excerpt: "Set up EPLAN Electric P8 projects: configure page types and structures, use macro technology for reusable circuits, manage article data and device tags, and establish project templates."
category: "deployment"
softwareSlug: "eplan-electric-p8"
keyword: "eplan electric p8 project setup page macro article data"
slug: "eplan-electric-p8-project-setup-page-macro-article-data"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-13"
sources:
  - "https://www.eplan.com/de-en/products/eplan-electric-p8/"
  - "https://www.eplan.com.tr/fileadmin/eplan_content_international/tr/data/Student_Handbook.pdf"
---

# EPLAN Electric P8 Project Setup: Page Types, Macro Technology, and Article Data

EPLAN Electric P8 is the industry standard for electrical engineering design in Europe and increasingly worldwide. Its object-oriented approach — where every symbol is connected to a device, article, and data record — sets it apart from simple drawing tools. Getting the project setup right from the start determines how smoothly the entire design process goes.

## EPLAN's Object-Oriented Philosophy

Unlike AutoCAD where you draw lines and symbols, EPLAN uses intelligent objects:

- **Symbols** — graphical representations that carry data
- **Devices** — logical entities (a motor, a switch, a sensor)
- **Article data** — manufacturer part numbers with technical specifications
- **Device tags** — unique identifiers (e.g., -K1, -M1, -S1)
- **Connections** — logical wire connections that auto-generate wire numbers

When you place a symbol, EPLAN creates a device, assigns a device tag, and links it to article data. This data flows automatically to terminal diagrams, BOMs, and cable lists.

## Project Structure

### Page Types

EPLAN organizes projects into pages, each with a specific type:

| Page Type | Description | Use Case |
|---|---|---|
| Schematic (multi-line) | Full schematic with all wires | Main circuit diagrams |
| Schematic (single-line) | Simplified single-line | Power distribution overview |
| Overview | Block diagram of system structure | System overview, location assignments |
| Installation layout | Building/layout drawing | Physical placement of equipment |
| Fluid power schematic | Pneumatic/hydraulic circuits | Combined electrical/fluid systems |
| P&ID | Process and instrumentation diagram | Process control systems |
| Parts list | Bill of materials | Automatic BOM generation |
| Terminal diagram | Terminal strip layout | Panel wiring |
| Cable list | Cable connections | Inter-panel cabling |

### Page Structure Identifiers

EPLAN uses a hierarchical structure to organize pages:

- **Higher-level function** = (e.g., =L1 for Line 1)
- **Higher-level location** + (e.g., +A1 for Cabinet A1)
- **Document type** & (e.g., &FS for flow schematic)
- **Document number** / (e.g., /01, /02)

Example: `=L1+A1&FS/01` means Line 1, Cabinet A1, Flow Schematic, Page 01

### Creating a New Project

1. **File > New**
2. Select a **project template** (.ept file):
   - Templates define default settings, page structures, and standards
   - Use IEC or JIC templates based on your region
3. Enter project properties:
   - Project name
   - Project number
   - Creation date
   - Client information
4. Set **structure identifiers** — define the naming convention for your project
5. Configure **numbering settings** — how device tags are auto-assigned

## Macro Technology

Macros are pre-built circuit modules that you can insert into any project. They're the key to efficient EPLAN design.

### Macro Types

1. **Window macros** — standard macros with a fixed insertion point
2. **Symbol macros** — collection of symbols without a fixed base point
3. **Page macros** — complete pages that can be inserted into a project
4. **3D macros** — for EPLAN Pro Panel (3D panel layout)

### Creating a Window Macro

1. Design the circuit in a schematic page
2. Select all elements of the circuit
3. **Edit > Create macro**
4. Choose the macro type (window macro)
5. Set the insertion base point
6. Save to the macro library

### Using Macros

1. **Insert > Macro** — browse the macro library
2. Select the macro and click to place it
3. EPLAN inserts all symbols, devices, and connections
4. Device tags are auto-assigned based on numbering settings

### Macro Variants

A macro can have multiple variants for different configurations:
- **Variant A** — standard configuration
- **Variant B** — alternative configuration (e.g., with additional protection)
- **Variant C** — another option

When inserting a macro, select the variant that matches your design.

### Macro Project

Create a dedicated macro project to organize all your macros:
1. Create a new project named "Macro Library"
2. Design standard circuits as pages
3. Create macros from each circuit
4. Store the macro project on a network share for team access

## Article Data Management

Article data links device symbols to manufacturer part numbers with full technical specifications.

### Article Data Structure

Each article contains:
- **Part number** — manufacturer's part number
- **Manufacturer** — company name
- **Description** — short and long descriptions
- **Technical data** — voltage, current, power, dimensions
- **Connection data** — pin assignments and connection descriptions
- **Symbol assignment** — which symbols this article can represent
- **Price** — for cost estimation
- **Procurement data** — order number, supplier

### Adding Article Data

1. **Parts > Management**
2. Search for an existing article or create a new one
3. Enter the part number and manufacturer
4. Fill in technical data and connection descriptions
5. Assign symbols — link the article to the symbols it represents

### Using Article Data in Projects

1. Place a symbol in the schematic
2. Right-click the symbol > **Assign part**
3. Search for the article by part number or description
4. Select the article and confirm
5. The article data is now linked to the device

### EPLAN Data Portal

The EPLAN Data Portal provides manufacturer-verified article data:
1. **Parts > Download from Data Portal**
2. Search by manufacturer, part number, or category
3. Download the article data directly into your project
4. No need to manually enter technical data

## Device Tags and Numbering

### Device Tag Format

EPLAN device tags follow this structure:

`=Higher-level function +Higher-level location Device identifier.Counter`

Example: `=L1+A1-K1` means Line 1, Cabinet A1, Contactor number 1

### Numbering Settings

1. **Options > Settings > Projects > [Project] > Devices > Numbering**
2. Configure:
   - **Numbering format** — how counters are formatted (001, 01, 1)
   - **Starting number** — typically 1
   - **Increment** — typically 1
   - **Identifier letters** — based on IEC 81346 (K=contactor, M=motor, S=switch, etc.)

### Offline Numbering

Run offline numbering to assign device tags to all unnumbered devices:
1. **Devices > Numbering (offline)**
2. Select the numbering scope (entire project or selected pages)
3. EPLAN assigns sequential numbers to all devices

## Project Templates

Create project templates to standardize settings across projects:

1. Configure all settings in a base project:
   - Page structure
   - Numbering format
   - Layer settings
   - Plot frame
   - Title block
   - Default article data
2. **File > Backup > Project**
3. Save as a template (.ept file)
4. New projects created from this template inherit all settings

## Common Setup Issues

### Device Tags Not Auto-Numbering

Check the numbering settings:
- Verify numbering is enabled for the device type
- Check the counter range doesn't conflict with existing tags
- Run offline numbering manually

### Article Data Not Linking to Symbols

- Verify the article has the correct symbol assignment
- Check that the symbol type matches (e.g., a contactor article must be assigned to a contactor symbol)
- Re-open the article and verify the symbol assignment tab

### Macros Inserting with Wrong Device Tags

- Check the numbering settings in the current project
- Verify the macro was created with "Number upon insertion" enabled
- Run offline numbering after inserting macros

## Best Practices

- **Use project templates** — standardize settings across all projects
- **Build a macro library** — create macros for all standard circuits
- **Use the EPLAN Data Portal** — don't manually enter article data
- **Follow IEC 81346 naming** — use standard identifier letters
- **Set up structure identifiers early** — changing them later is difficult
- **Create a macro project** — centralize all macros for team access
- **Document your standards** — create a project standards document
- **Use the EPLAN Education Handbook** — comprehensive training resource
