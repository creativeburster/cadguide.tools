---
title: "AutoCAD Plant 3D Equipment Modeling: Creating Nozzles and Connecting Pipe to Vessels"
excerpt: "How to model equipment and nozzles in Plant 3D — covering equipment creation from blocks and parametric templates, nozzle placement and orientation, and connecting pipe routes to equipment nozzles with correct end types."
category: "workflow"
softwareSlug: "autocad-plant-3d"
keyword: "autocad plant 3d equipment modeling nozzles connecting pipe"
slug: "autocad-plant-3d-equipment-modeling-nozzles-connecting-pipe"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-07-08"
sources:
  - "https://forums.autodesk.com/t5/autocad-plant-3d-forum/flange-connection-not-appearing-when-valve-inserted/td-p/12301564"
  - "https://forums.autodesk.com/t5/autocad-plant-3d-forum/piping-connection-settings-for-simple-joints-and-compound-joints/td-p/13375047"
---

# AutoCAD Plant 3D Equipment Modeling: Creating Nozzles and Connecting Pipe to Vessels

Equipment modeling is the bridge between structural design and piping in Plant 3D. I've seen projects where equipment was modeled as plain 3D solids with no nozzles, making it impossible to connect pipe. Then the piping team had to remodel everything. Getting equipment right from the start saves weeks of rework.

## Equipment Modeling Approaches in Plant 3D

Plant 3D offers three ways to model equipment:

1. **Parametric Equipment** — built-in templates for common vessels (tanks, heat exchangers, pumps)
2. **AutoCAD Blocks** — convert existing 3D blocks into Plant 3D equipment with nozzles
3. **Solid Models** — import STEP, IGES, or SAT files and add nozzles

Each approach has trade-offs. Parametric equipment is fastest but least flexible. Blocks are good for vendor-provided models. Solid imports give the most accurate geometry but require manual nozzle addition.

## Step 1: Create Parametric Equipment

For standard vessels, use Plant 3D's parametric templates.

1. Go to **Home** tab → **Equipment** → **Create Equipment**.
2. Select a template:
   - **Vertical Vessel** — tanks, columns, reactors
   - **Horizontal Vessel** — heat exchangers, separators
   - **Pump** — centrifugal pumps with suction and discharge nozzles
3. Configure parameters:
   - **Dimensions** — diameter, height, length
   - **Nozzle count and positions** — specify number and location of nozzles
   - **Nozzle sizes and ratings** — match the piping spec
4. Click **Place** to insert the equipment in the model.

### Parametric Equipment Tips

- **Set nozzle sizes before placing** — changing nozzle sizes after placement can break pipe connections
- **Use the vendor datasheet** — match dimensions to actual equipment specifications
- **Add custom nozzles after placement** — for nozzles not in the template

## Step 2: Convert AutoCAD Blocks to Equipment

If you have a 3D block from a vendor, you can convert it to Plant 3D equipment.

1. Insert the block into the Plant 3D drawing using `INSERT`.
2. Explode the block if it's a nested block reference.
3. Go to **Home** tab → **Equipment** → **Convert to Equipment**.
4. Select the block geometry.
5. Plant 3D creates an equipment object from the geometry.

### Adding Nozzles to Converted Equipment

After conversion, you need to add nozzles manually:

1. Select the equipment object.
2. Right-click → **Add Nozzle**.
3. Specify the nozzle location on the equipment surface.
4. Configure the nozzle:
   - **Nozzle Tag** — e.g., `N1`, `N2`, `INLET`, `OUTLET`
   - **Nominal Size** — must match the pipe size that will connect
   - **End Type** — typically `FL` (flanged) for equipment nozzles
   - **Pressure Class** — must match the pipe spec
   - **Orientation** — set the nozzle direction vector

### Nozzle Orientation

Nozzle orientation is critical. The nozzle direction vector determines which way the pipe will connect. I've seen nozzles pointing inward into the vessel because the direction was set wrong.

1. After placing the nozzle, check the direction arrow.
2. The arrow should point **away** from the equipment surface.
3. Use the **Rotate** grip to adjust orientation if needed.

## Step 3: Import Solid Models as Equipment

For complex equipment (compressors, packaged units), import a solid model from the vendor.

1. Go to **Insert** tab → **Import** → select STEP, IGES, or SAT file.
2. Position the imported solid in the model.
3. Go to **Home** tab → **Equipment** → **Convert to Equipment**.
4. Select the imported solid.
5. Add nozzles at the pipe connection points.

### Tips for Imported Models

- **Simplify the model first** — remove internal components that aren't visible
- **Check units** — imported models often come in different units
- **Verify scale** — measure key dimensions against the vendor drawing
- **Add nozzles at flange faces** — not at pipe ends, but at the actual flange face

## Step 4: Connect Pipe to Equipment Nozzles

Once equipment with nozzles is in place, connecting pipe is straightforward — but only if the nozzle and pipe specs match.

1. Go to **Home** tab → **Pipe**.
2. Start the pipe route at the equipment nozzle.
3. Select the nozzle as the start point.
4. Plant 3D automatically:
   - Matches the pipe size to the nozzle size
   - Selects the correct end type (usually flanged)
   - Inserts a gasket and bolt set if the connection is flanged

### Connection Errors

If you get a connection error when connecting pipe to a nozzle:

1. **Check nozzle end type** — it should be `FL` for flanged connections
2. **Check nozzle pressure class** — it must match the pipe spec
3. **Check spec contents** — the spec must have gaskets and bolt sets matching the nozzle's pressure class and facing
4. **Check nozzle size** — the pipe spec must include the nozzle's nominal size

### Nozzle Not Appearing in Pipe Connection

If the nozzle doesn't show up as a valid connection point:

1. Verify the nozzle was added to the equipment (not just drawn as geometry).
2. Check that the nozzle direction is pointing outward.
3. Try selecting the nozzle directly instead of using auto-connect.

## Step 5: Create Equipment Lists and Tags

Equipment in Plant 3D can be tagged and scheduled like pipe components.

1. Go to **Annotate** tab → **Equipment Tag**.
2. Select the equipment and place the tag.
3. Configure tag format in **Project Setup** → **Equipment** → **Tag Format**.
4. Generate equipment lists from **Data Manager** → **Equipment** table.

## Best Practices

- **Model equipment early** — place equipment before routing pipe so connections are available
- **Use vendor datasheets** — match nozzle sizes, ratings, and positions to actual equipment
- **Tag nozzles consistently** — use standard naming (N1, N2, N3...) and document each nozzle's purpose
- **Create a nozzle schedule** — list all nozzles with size, rating, and service for each equipment item
- **Verify connections** — after connecting pipe, check that the connection type is correct (flanged, welded) in the pipe properties
