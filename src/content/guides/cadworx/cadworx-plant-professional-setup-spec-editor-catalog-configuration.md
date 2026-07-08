---
title: "CADWorx Plant Professional Setup: Spec Editor, Catalogs, and Project Configuration"
excerpt: "How to set up CADWorx Plant Professional for a new project — covering spec editor configuration, catalog development, BricsCAD vs AutoCAD platform setup, and common pitfalls when creating custom piping specifications."
category: "deployment"
softwareSlug: "cadworx"
keyword: "cadworx plant professional setup spec editor catalog configuration"
slug: "cadworx-plant-professional-setup-spec-editor-catalog-configuration"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-07-08"
sources:
  - "https://aliresources.hexagon.com/cadworx-design/cadworx-frequently-asked-questions"
  - "https://aliresources.hexagon.com/cadworx-analysis-solutions/best-practices-for-developing-catalogs"
---

# CADWorx Plant Professional Setup: Spec Editor, Catalogs, and Project Configuration

I've set up CADWorx for chemical plants, oil and gas facilities, and food and beverage projects. CADWorx is faster to set up than Plant 3D — you can start laying pipe within hours of installing the software. But "fast to start" doesn't mean "fast to get right." A poorly configured spec or catalog will haunt you through the entire project. Here's how to set up CADWorx properly from day one.

## Understanding CADWorx's Architecture

CADWorx Plant Professional consists of:

- **CADWorx Plant**: 3D piping and equipment modeling
- **CADWorx P&ID**: Process and instrumentation diagrams
- **CADWorx Specification Editor**: Create and manage piping specs
- **ISOGEN**: Isometric drawing generation
- **I-Configure**: ISOGEN configuration interface
- **BricsCAD Platinum**: Included with CADWorx license (no separate AutoCAD license needed)

CADWorx runs on either AutoCAD or BricsCAD. Since Hexagon includes BricsCAD Platinum with the license, most new setups use BricsCAD.

## Step 1: Install CADWorx and BricsCAD

1. Install **BricsCAD Platinum** first (included with CADWorx license).
2. Install **CADWorx Plant Professional**.
3. During installation, select the CAD platform (BricsCAD or AutoCAD).
4. Install the **License Manager** and activate your license.
5. Launch CADWorx from the desktop shortcut.

### Installation Order Matters

- **BricsCAD first, then CADWorx** — CADWorx needs the CAD platform to be present
- **Don't install CADWorx before BricsCAD** — the installer won't find the CAD platform
- **Check version compatibility** — each CADWorx version supports specific BricsCAD/AutoCAD versions. Check the compatibility matrix from your reseller.

## Step 2: Configure Project Settings

1. Launch CADWorx.
2. Go to **CADWorx Plant** → **Project Setup**.
3. Configure:
   - **Project Name**: Unique project identifier
   - **Project Path**: Where project files will be stored
   - **Spec Path**: Where spec files are located
   - **Catalog Path**: Where catalog databases are stored
   - **Units**: Imperial or Metric
   - **Coordinate System**: Set for equipment and pipe routing

### Project Folder Structure

Create a standardized folder structure:

```
Project/
├── 01-Specs/
│   ├── Piping/
│   ├── Equipment/
│   └── Support/
├── 02-Catalogs/
│   ├── Master/
│   └── Project-Specific/
├── 03-Models/
│   ├── 01-Piping/
│   ├── 02-Equipment/
│   └── 03-Structural/
├── 04-Isometrics/
│   ├── Style-1/
│   └── Style-2/
├── 05-PID/
└── 06-Reports/
```

## Step 3: Set Up the Catalog

The catalog is the master database of all available components. CADWorx ships with extensive default catalogs, but most projects need customization.

1. Open the **Specification Editor** (separate application or from CADWorx ribbon).
2. Go to **Catalog** → **Open** → select the master catalog.
3. Review the default catalog contents:
   - **Pipe sizes**: Available nominal pipe sizes
   - **Fittings**: Elbows, tees, reducers, caps
   - **Flanges**: Weld neck, slip-on, blind
   - **Valves**: Gate, globe, check, ball
   - **Gaskets and bolt sets**: For flanged connections
4. Create a project-specific catalog:
   - **File** → **New Catalog** → base it on the master
   - Name it with the project identifier
   - Remove components not used in the project
   - Add custom components if needed

### Catalog Best Practices

- **Don't modify the master catalog** — always create a project-specific copy
- **Use consistent naming** — component names should follow a standard convention
- **Include all required components** — missing gaskets or bolt sets cause connection failures
- **Document catalog changes** — maintain a change log for audit purposes
- **Test the catalog before deployment** — create a test spec and verify all components connect

## Step 4: Create Piping Specifications

Specs are subsets of the catalog selected for specific services.

1. In the Specification Editor, go to **Spec** → **New**.
2. Name the spec (e.g., `CS150` for Carbon Steel 150#).
3. Add components from the catalog:
   - Select the catalog as the source
   - Drag components into the spec
   - Filter by size, pressure class, and end type
4. For each component, verify:
   - **End types** match the connection requirements
   - **Pressure class** is consistent across the spec
   - **Sizes** cover the full range needed
5. Save the spec file (`.spec` extension).

### Essential Spec Components

For a complete spec, include:

- **Pipe** — all required sizes and schedules
- **Elbows** — 90° long radius, 90° short radius, 45°
- **Tees** — straight and reducing
- **Reducers** — concentric and eccentric
- **Flanges** — weld neck, slip-on, blind
- **Gaskets** — matching pressure class and facing
- **Bolt sets** — matching pressure class and facing
- **Valves** — all required types and sizes

### Common Spec Errors

**Missing gaskets**: Flanged connections fail without gaskets. Always include gaskets matching the flange pressure class and facing.

**End type mismatches**: A flanged valve (FL) won't connect to a butt-weld pipe (BW) without a flange adapter. Ensure end types are compatible across the spec.

**Pressure class inconsistency**: Don't mix 150# and 300# components in the same spec unless you have transition components.

## Step 5: Configure ISOGEN Settings

ISOGEN generates isometric drawings from the 3D model. Configuration is done through I-Configure.

1. Open **I-Configure** (from the CADWorx ribbon or standalone).
2. The Home screen shows key configuration areas:
   - **Style**: Visual appearance of isometrics
   - **Symbol**: Component symbols on isometrics
   - **Annotation**: Text labels and dimensions
   - **Report**: BOM and material reports
3. Configure each area:

### Style Configuration

- **Drawing size**: A1, A2, A3, or custom
- **Border**: Title block template
- **Units**: Metric or Imperial
- **Line types**: Pipe, fitting, and annotation line weights

### Symbol Configuration

- **Component symbols**: How each fitting and valve appears
- **Symbol libraries**: Map spec components to ISOGEN symbols
- **Custom symbols**: Create symbols for non-standard components

### Annotation Configuration

- **Component tags**: What text appears on each component
- **Dimensioning**: How pipe lengths are dimensioned
- **Weld numbers**: Automatic or manual weld numbering
- **Continuation labels**: How drawing breaks are labeled

### Report Configuration

- **BOM format**: Bill of materials layout
- **Material reports**: Summary by component type
- **Cut lists**: Pipe cut lengths for fabrication

## Step 6: Set Up Pipe Support Libraries

CADWorx includes pipe support capabilities. For project-specific supports:

1. Open the **Specification Editor**.
2. Go to **Support** → **Support Library**.
3. Create support types:
   - **Rest supports**: Simple resting supports
   - **Guide supports**: Lateral restraint
   - **Anchor supports**: Fixed point
   - **Spring supports**: Variable spring hangers
4. Define support dimensions and materials.
5. Save the support library with the project specs.

## Step 7: Configure Data Output

CADWorx can export model data to various formats:

1. **BOM Export**: Go to **Reports** → **BOM** → configure format and export to Excel.
2. **PCF Export**: For ISOGEN or importing to other systems.
3. **IFC Export**: For BIM coordination with Revit, Navisworks, or Solibri.
4. **Database Export**: Export model data to an external database for reporting.

### IFC Export Configuration

For BIM coordination:

1. Go to **CADWorx** → **Export** → **IFC**.
2. Configure:
   - **IFC version**: IFC 2x3 or IFC 4
   - **Coordinate system**: Match the project coordinate system
   - **Property sets**: Select which properties to include
3. Export the model and verify in Solibri or Navisworks.

## Step 8: Test the Setup

Before starting production modeling:

1. **Create a test drawing** with a simple pipe route.
2. **Insert each component type** — elbow, tee, valve, flange.
3. **Verify all connections work** — no errors or missing components.
4. **Generate an isometric** — confirm ISOGEN produces correct output.
5. **Export a BOM** — verify all components are listed correctly.
6. **Export IFC** — verify the model opens in coordination tools.

## Best Practices

- **Create project-specific catalogs** — don't modify the master catalog
- **Test specs before deployment** — a bad spec causes days of rework
- **Use consistent naming conventions** — specs, catalogs, and models
- **Document all configurations** — create a project setup guide for reference
- **Back up specs and catalogs** — version control your spec files
- **Train the team on the Specification Editor** — don't rely on one person for spec management
- **Keep ISOGEN styles consistent** — use the same style across all projects for consistency
- **Configure IFC export early** — test coordination before the model is complete
