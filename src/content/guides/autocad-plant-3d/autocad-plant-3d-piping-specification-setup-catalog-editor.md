---
title: "AutoCAD Plant 3D Piping Specification Setup: Building Custom Specs in the Catalog Editor"
excerpt: "How to create and configure piping specifications in AutoCAD Plant 3D using the Spec Editor and Catalog — covering spec creation, component selection, end type matching, and common errors when valves and flanges won't connect."
category: "deployment"
softwareSlug: "autocad-plant-3d"
keyword: "autocad plant 3d piping specification setup catalog editor"
slug: "autocad-plant-3d-piping-specification-setup-catalog-editor"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-07-08"
sources:
  - "https://forums.autodesk.com/t5/autocad-plant-3d-forum/flange-connection-not-appearing-when-valve-inserted/td-p/12301564"
  - "https://forums.autodesk.com/t5/autocad-plant-3d-forum/how-to-add-missing-specs-for-pipes/td-p/12298010"
---

# AutoCAD Plant 3D Piping Specification Setup: Building Custom Specs in the Catalog Editor

I've set up Plant 3D specs for oil and gas projects, water treatment plants, and chemical facilities. The Spec Editor is powerful but unforgiving — one missing gasket or bolt set and your entire spec refuses to connect parts. I've spent days debugging specs that looked correct but had hidden end type mismatches. Here's my complete setup guide.

## Understanding the Spec and Catalog Relationship

Plant 3D uses a two-tier system:

- **Catalog**: A database of all available components (pipes, fittings, valves, flanges, gaskets, bolt sets) organized by pressure class and end type
- **Spec**: A subset of catalog components selected for a specific project or service

When you insert a component in the model, Plant 3D looks up the spec, finds the matching component in the catalog, and places it. If any required component is missing from the spec, you get a connection error.

## Step 1: Open the Spec Editor

1. From Plant 3D, go to **Project Manager** → right-click **Pipe Specs** → **New Spec**.
2. Or launch the Spec Editor directly from the Windows Start Menu.
3. Create a new spec file (`.spec` extension) in your project's `PipeSpec` folder.

## Step 2: Configure the Spec Header

Set the following in the Spec Properties:

- **Spec Name**: Use a clear naming convention (e.g., `SS0` for Stainless Steel Schedule 10S)
- **Spec Description**: Full description for documentation
- **Pressure Class**: Must match catalog components (150#, 300#, etc.)
- **Default Units**: Metric or Imperial — must match your project

## Step 3: Add Components from the Catalog

This is where most people get into trouble. You need to add **all** required components, not just the obvious ones.

### Required Components for a Complete Spec

For each pipe size in your spec, you need:

1. **Pipe** — the base pipe with correct end types
2. **Fittings** — elbows (90°, 45°), tees (straight, reducing), reducers (concentric, eccentric), caps
3. **Flanges** — weld neck, slip-on, blind, as required
4. **Valves** — gate, globe, check, ball, as required
5. **Gaskets** — matching pressure class and facing (RF, FF, RTJ)
6. **Bolt Sets** — matching pressure class and facing

The gaskets and bolt sets are the most commonly forgotten items. Without them, flanged connections fail silently.

### Adding Components

1. In the Spec Editor, go to the **Spec Sheet** tab.
2. Right-click → **Add from Catalog**.
3. Browse the catalog and select components.
4. Filter by pressure class to ensure compatibility.

## Step 4: Configure End Types and Connections

End type mismatches are the #1 cause of connection errors in Plant 3D. I've seen specs where everything looks correct but valves won't insert because the end types don't match the pipe.

### Common End Types

- **BW** — Butt Weld
- **SW** — Socket Weld
- **FL** — Flanged (requires gasket + bolt set)
- **TH** — Threaded
- **PSW** — Plain Socket Weld (plastic piping)
- **PPL** — Plain Plain (plastic piping, adhesive connection)

### Checking End Type Compatibility

For a flanged valve connection to work, you need:

1. Valve with `FL` end type on both ends
2. Flange with matching `FL` end type and pressure class
3. Gasket with matching pressure class and facing
4. Bolt set with matching pressure class and facing

If any of these is missing or mismatched, you'll see: *"Cannot connect parts. Cannot find Gasket in the [spec name] spec. NominalDiameter='4"' AND Facing='RF' AND PressureClass='300'."*

### Fixing End Type Mismatches

1. Open the Spec Editor.
2. Check each component's end types in the **End Types** column.
3. Ensure complementary components exist for each end type combination.
4. For compound joints (flanged connections), verify gasket and bolt set entries.

## Step 5: Configure Piping Connection Settings

This is an advanced step that many users skip, leading to connection failures with non-standard end type combinations.

1. In Project Setup → **Piping Connection Settings**.
2. **Simple Joints**: Define which end type pairs connect directly (e.g., `BW-BW`, `SW-SW`, `PSW-PSW`).
3. **Compound Joints**: Define which end type pairs require additional components (e.g., `FL-FL` requires gasket + bolt set + flange).

For adhesive connections (like RTRP piping), add a simple joint for `PSW-PSW` if your components use socket adhesive bonding.

## Step 6: Test the Spec

Before deploying to production:

1. Create a test drawing.
2. Insert pipe and try each component type (elbow, tee, valve, flange).
3. Verify all connections work without errors.
4. Check the BOM table generates correctly with all components listed.

## Common Errors and Fixes

### "Cannot find Gasket in spec"

The spec is missing a gasket with the correct pressure class and facing. Add the gasket from the catalog, ensuring the `PressureClass` and `Facing` fields match the flange.

### "Cannot find Bolt Set in spec"

Same issue as gaskets. Add the bolt set with matching pressure class and facing.

### Components Insert as Custom Parts

When importing PCF files from CADWorx, components may insert as custom parts instead of spec components. This happens when the end codes don't match between CADWorx and Plant 3D. You need to customize the Plant 3D spec to include matching end codes.

### Spec Not Available in Model

If a spec doesn't appear in the Assign Tag dropdown:

1. Open Project Manager → right-click **Pipe Specs** → **Copy Specs to Project**.
2. Browse to the `.spec` file and add it.
3. The spec should now appear in the model.

## Best Practices

- **Name specs consistently** — use a standard like `[Material]-[Service]-[PressureClass]` (e.g., `CS-FW-150`)
- **Document spec contents** — maintain a spreadsheet listing all components in each spec
- **Test before deployment** — never push a new spec to production without testing all connection types
- **Keep catalog and spec files in version control** — track changes to prevent regression
- **Create project-specific catalogs** — don't modify the default AutoCAD catalog; create a copy
