---
title: "IronCAD Catalog System: Building Reusable Smart Components and Block Libraries"
excerpt: "How to create and manage IronCAD catalogs of reusable 3D components — covering smart parameters, drag-and-drop insertion, catalog sharing across teams, and auto-sizing configuration."
category: "workflow"
softwareSlug: "ironcad"
keyword: "ironcad catalog smart components block library"
slug: "ironcad-catalog-smart-components-block-library"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.ironcad.com/products/ironcad"
  - "https://www.ironcad.academy/tutorial/triball"
---

# IronCAD Catalog System: Building Reusable Smart Components and Block Libraries

IronCAD's catalog system is one of its most underrated features. Instead of importing block files one at a time, you build a visual library of drag-and-drop components that auto-size and auto-position. I built a catalog of 200+ standard parts for our shop — now a designer can insert a correctly-sized bearing housing in 3 clicks. Here's how to set it up.

## What Is an IronCAD Catalog?

A catalog is a visual library of 3D parts, assemblies, and 2D shapes stored in `.iccat` files. Each catalog entry can have:

- **A preview image** — 3D rendered thumbnail
- **Smart parameters** — Dimensions that auto-adjust when dropped into a scene
- **Attachment points** — Snap positions for automatic positioning
- **Configuration options** — Multiple sizes/variants from a single entry

Catalogs appear in the left panel of the IronCAD interface. You drag a component from the catalog into the scene — it inserts at the clicked position with the selected configuration.

## Step 1: Create a Catalog

1. Go to **Catalog** → **New Catalog**.
2. Name it (e.g., "Company Standard Parts").
3. Choose a storage location:
   - **Local**: `%APPDATA%\IronCAD\Catalogs\` (single user)
   - **Network**: `\\server\ironcad-catalogs\` (team shared)
4. Create sub-catalogs (tabs) for organization:
   - Fasteners
   - Bearings
   - Motors
   - Structural
   - Pneumatics

## Step 2: Add Parts to a Catalog

1. Open a part file in IronCAD.
2. Go to **Catalog** → **Add to Catalog**.
3. Select the target catalog and tab.
4. IronCAD generates a preview image and adds the entry.
5. Right-click the entry → **Properties** to configure smart parameters.

## Step 3: Configure Smart Parameters

Smart parameters let the part auto-size when dropped. For a bolt:

1. Right-click the catalog entry → **Smart Parameters**.
2. Add parameters:
   - **Diameter**: List of standard sizes (M6, M8, M10, M12, M16)
   - **Length**: Range (20mm–100mm, step 5mm)
   - **Thread type**: Coarse, Fine
3. When a user drags the bolt into a scene, IronCAD prompts for diameter and length — the part resizes automatically.

For a bearing housing:
1. Add parameter: **Bearing OD** (list: 47, 52, 62, 72, 80, 90)
2. Add parameter: **Pilot holes** (Yes/No)
3. The housing body, bolt pattern, and bore all resize based on the bearing OD.

## Step 4: Set Up Attachment Points

Attachment points let components auto-position when dropped onto other geometry:

1. Open the part in IronCAD.
2. Go to **Tools** → **Attachment Points**.
3. Click faces or edges to define snap points:
   - **Bottom face** — Snaps to the top of a mounting surface
   - **Bolt circle** — Snaps to a hole pattern
4. Save the part and update the catalog entry.

When a user drags the part onto an assembly, IronCAD snaps it to the nearest attachment point — no manual positioning needed.

## Step 5: Share Catalogs Across a Team

For team-wide access:

1. Store the `.iccat` file on a network share.
2. On each workstation: **Catalog** → **Add Existing Catalog** → browse to the network path.
3. The catalog appears in all users' panels with the same content.

For version control:
1. Use a naming convention: `company-standards-v2026.iccat`.
2. When updating, save as a new version and notify the team.
3. Users remove the old catalog and add the new one.

IronCAD doesn't have built-in catalog versioning — you manage it manually through file naming and network folder organization.

## Step 6: Create Assembly Templates

Catalogs can store entire assemblies, not just parts:

1. Build a standard subassembly (e.g., motor + coupling + mounting plate).
2. Add to catalog with smart parameters:
   - **Motor power** (0.5kW, 1kW, 2kW, 5kW)
   - **Mounting style** (Foot-mounted, flange-mounted)
3. When dropped, the entire subassembly inserts with all components correctly positioned.

This is particularly useful for:
- Standard gearbox + motor packages
- Pneumatic valve manifolds
- Sensor mounting brackets with hardware

## Best Practices for Catalog Organization

**Naming convention**: Use descriptive names with key dimensions:
- `Bearing-Housing-OD52-ID25`
- `Bolt-M8x40-Grade8.8`
- `Motor-1kW-4pole-IE3`

**Thumbnail quality**: IronCAD auto-generates thumbnails, but you can improve them:
1. Right-click entry → **Regenerate Thumbnail**.
2. Set the view angle to isometric (most informative).
3. Set background to white (cleaner appearance).

**Tab organization**: Group by function, not by part number:
- **Fasteners** (bolts, nuts, washers)
- **Power Transmission** (bearings, couplings, belts)
- **Structural** (profiles, brackets, plates)
- **Pneumatics** (valves, cylinders, fittings)
- **Electrical** (motors, sensors, enclosures)

## Common Issues

**Catalog not appearing**: Verify the network path is accessible. IronCAD silently fails to load catalogs from unreachable network paths — no error message.

**Smart parameters not resizing**: The part must have parametric features that reference the smart parameter. If the part was imported (no feature tree), smart parameters can't resize it — use Triball to resize manually instead.

**Attachment points not snapping**: Ensure the target geometry has a compatible snap type. A bolt circle attachment point only snaps to a hole pattern, not a flat face.
