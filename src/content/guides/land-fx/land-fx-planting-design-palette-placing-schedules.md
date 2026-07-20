---
title: "Land F/X Planting Design: Building Palettes, Placing Plants, and Generating Schedules"
excerpt: "Create planting plans with Land F/X in AutoCAD: build a plant palette from the 24,000+ plant database, place and label plants, error-check quantities, and generate plant schedules automatically."
category: "workflow"
softwareSlug: "land-fx"
keyword: "land f/x planting design palette schedule autoCAD"
slug: "land-fx-planting-design-palette-placing-schedules"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://www.landfx.com/docs/planting.html"
  - "https://www.landfx.com/docs/planting/planting-getting-started/210-adding-plants-to-a-project.html"
---

# Land F/X Planting Design: Building Palettes, Placing Plants, and Generating Schedules

Land F/X is a specialized plugin for AutoCAD (and Revit, Rhino, SketchUp) designed specifically for landscape architecture and irrigation design. Its planting tools automate the most tedious parts of landscape design — building plant palettes, placing symbols, labeling, counting, and generating schedules. I'll walk through the complete planting workflow.

## Land F/X Project Setup

### Create a Project

Every Land F/X design starts with a project — the central database that stores all plant information, irrigation equipment, and specifications:

1. Open AutoCAD and go to the **F/X Admin** ribbon
2. Click **Project Manager**
3. Click **New Project**
4. Enter project details:
   - Project name
   - Project number
   - Client information
   - Date
5. The project appears in the Project Manager list

### Set Units and Plot Scale

Before placing any plants:

1. Go to **F/X Admin > Scale**
2. Set **Drawing Units** — Imperial (inches/feet) or Metric (mm/m)
3. Set **Plot Scale** — the scale at which the drawing will be plotted (e.g., 1"=20', 1:200)
4. Land F/X uses the plot scale to size plant symbols, text, and labels correctly

### Load Layers

1. Go to **F/X Admin > Layers**
2. Select your office's layer standard or use the Land F/X default
3. Land F/X creates all necessary layers for planting, irrigation, and details

## Building the Plant Palette

### Open the Plant Manager

1. Go to the **F/X Planting** ribbon
2. Click **Plant Manager**
3. The Plant Manager shows four categories:
   - **Trees** — shade trees, conifers, palms
   - **Shrubs** — individual shrub species
   - **Shrub Areas** — mass planting areas
   - **Ground Covers** — low-growing spreading plants

### Add Plants to the Project

1. Click **New** in the Plant Manager
2. The **Add Plants** dialog opens
3. Search for plants:
   - **By genus** — scroll or type the first letter to jump
   - **By common name** — type in the search field
   - **By keyword** — search for characteristics (e.g., "drought tolerant")
   - **By data filters** — filter by water use, bloom season, height, etc.
4. Select the genus, then species, then variety
5. Click **Add to Project**
6. The plant appears in the Plant Manager list

### Configure Plant Properties

After adding a plant, configure its properties:

1. Click the plant in the Plant Manager
2. Set:
   - **Symbol** — choose from the Land F/X symbol library or assign a custom block
   - **Container/Caliper size** — e.g., 15-gal, 24" box, 2" caliper
   - **Spacing** — for shrubs and ground covers (e.g., 24" o.c.)
   - **Plant cost** — for cost estimating
   - **Notes** — installation or maintenance notes
3. The plant data is stored in the project database

### Build a Complete Palette

A typical planting palette includes:
- **3-5 tree species** — shade, ornamental, evergreen
- **8-15 shrub species** — foundation, accent, screening
- **3-5 ground cover species** — mass planting, erosion control
- **2-3 shrub area species** — large mass plantings

## Placing Plants in the Drawing

### Place Individual Plants

1. Go to **F/X Planting > Place Plant**
2. Select a plant from the palette
3. Click in the drawing to place the plant
4. The plant symbol appears at the click point
5. Continue clicking to place more of the same plant
6. Press Enter to finish and select a different plant

### Place Plants Along a Line

1. Go to **F/X Planting > Plant Line**
2. Select a plant
3. Click to define a line or polyline
4. Set the spacing (e.g., 10' o.c.)
5. Land F/X places plants at equal intervals along the line

### Place Shrub Areas

1. Go to **F/X Planting > Shrub Area**
2. Select a shrub area plant
3. Click to define a boundary (or select an existing polyline)
4. Land F/X fills the area with the shrub area hatch pattern
5. The area is calculated automatically for the schedule

### Place Ground Covers

1. Go to **F/X Planting > Ground Cover**
2. Select a ground cover
3. Define the boundary area
4. Set the spacing (e.g., 18" o.c.)
5. Land F/X fills the area with the ground cover pattern

## Labeling Plants

### Auto-Label

1. Go to **F/X Planting > Auto Label**
2. Select the labeling style:
   - **Individual labels** — one label per plant
   - **Group labels** — one label for a group of the same plant
   - **Callout labels** — leader line pointing to the plant
3. Land F/X automatically labels all plants in the drawing
4. Labels include the plant code (genus abbreviation + species abbreviation)

### Manual Label

1. Go to **F/X Planting > Label Plant**
2. Click on a plant to label
3. Position the label
4. The label includes the plant code and quantity (for groups)

## Error Checking

Before generating schedules, run error checks:

1. Go to **F/X Planting > Check Plants**
2. Land F/X checks for:
   - **Duplicate plants** — the same plant placed too close together
   - **Missing labels** — plants without labels
   - **Overlapping plants** — plants whose symbols overlap
   - **Quantity mismatches** — label quantity doesn't match placed quantity
3. Review and fix any reported errors

## Generating Plant Schedules

1. Go to **F/X Planting > Schedule**
2. Configure the schedule:
   - **Schedule type** — Plant Schedule, Shrub Area Schedule, or Combined
   - **Columns** — select which data columns to include (Code, Botanical Name, Common Name, Size, Quantity, Spacing, Cost)
   - **Sort order** — by category, by botanical name, or by common name
   - **Placement** — Model Space or Paper Space (Layout)
3. Click **OK**
4. Click in the drawing to place the schedule
5. The schedule is a live AutoCAD table — it updates when plants are added or removed

### Schedule Contents

A typical plant schedule includes:
- **Category** — Trees, Shrubs, Ground Covers
- **Code** — short identifier (e.g., QURU for Quercus rubra)
- **Botanical name** — genus and species
- **Common name** — common name of the plant
- **Size** — container or caliper size
- **Quantity** — number of plants (auto-calculated)
- **Spacing** — for shrubs and ground covers
- **Cost** — total cost per species (if cost data entered)

## Common Issues

### Plants Not Appearing in Schedule

- The plant wasn't placed in the drawing (only in the palette)
- The plant is on a frozen or locked layer
- Run **Check Plants** to identify issues

### Symbol Size Wrong

- The plot scale is incorrect — go to F/X Admin > Scale and verify
- The symbol size override is set — check the plant properties

### Labels Overlapping

- Use **Group Labels** instead of individual labels
- Adjust the label leader length
- Use the **Verify Labels** tool to detect overlaps

## Best Practices

- **Set the plot scale first** — before placing any plants
- **Build the complete palette before placing** — saves switching between tools
- **Use concept planting first** — sketch the design, then convert to specific species
- **Run Check Plants before scheduling** — catch errors early
- **Use project templates** — save the palette and settings as a template for similar projects
- **Customize symbols** — assign office-standard symbols to each plant
- **Keep the project database organized** — one project per design, don't reuse across projects
