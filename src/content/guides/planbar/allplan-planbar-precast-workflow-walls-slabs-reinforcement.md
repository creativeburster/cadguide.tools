---
title: "Allplan Planbar Precast Workflow: Modeling Walls, Slabs, and Automated Reinforcement"
excerpt: "Model precast concrete elements in Allplan Planbar: create walls and slabs from architectural models, automated wall and slab divisions, one-click reinforcement generation, and shop drawing output."
category: "workflow"
softwareSlug: "planbar"
keyword: "allplan planbar precast workflow wall slab reinforcement"
slug: "allplan-planbar-precast-workflow-walls-slabs-reinforcement"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-07-13"
sources:
  - "https://help.allplan.com/Allplan/2025-0/1034/Allplan/352053.htm"
  - "https://www.allplan.com/products/allplan-precast/"
---

# Allplan Planbar Precast Workflow: Modeling Walls, Slabs, and Automated Reinforcement

Allplan Planbar is a specialized BIM application for the precast concrete industry. It automates the design and detailing of precast elements — walls, slabs, columns, beams, and staircases — with plant-specific production data. The workflow from architectural model to production-ready precast elements is highly automated, saving significant time compared to manual detailing.

## Planbar's Position in the Workflow

Planbar sits between the architectural design and the precast factory:

1. **Architect provides the BIM model** (IFC or Allplan format)
2. **Planbar converts architectural elements to precast elements**
3. **Planbar divides elements for production** (plant-specific constraints)
4. **Planbar generates reinforcement** (automated and manual)
5. **Planbar produces shop drawings** (automatic)
6. **Planbar exports production data** (for factory automation systems)

## Importing the Architectural Model

### Import IFC or Allplan File

1. **File > Import > IFC** or **Allplan File**
2. The architectural model appears with walls, slabs, and columns
3. Verify the model:
   - Check units (mm or inches)
   - Verify floor levels and heights
   - Check for missing elements
4. The imported elements are architectural (non-precast) elements

### Convert to Precast Elements

1. Use the **Precast Element** tool (Create > Precast > Precast Element)
2. Select architectural elements to convert
3. Define the precast element type:
   - **Solid wall** — single-layer solid concrete wall
   - **Double wall** — two layers with insulation cavity
   - **Sandwich wall** — concrete + insulation + concrete
   - **Brick wall** — concrete + brick facing
   - **Thermal wall** — concrete with integrated insulation
4. Set the layer composition in the catalog
5. Planbar converts the architectural element to a precast element with defined layers

## Automated Wall Divisions

### Why Division Is Needed

Architectural walls are often too large for a single precast panel. Planbar divides them based on:

- **Maximum panel dimensions** — limited by factory production capacity
- **Transportation limits** — truck width, height, and weight restrictions
- **Crane capacity** — site crane lifting limits
- **Joint requirements** — minimum joint width between panels

### Running Automated Division

1. Go to **Precast > Wall > Automated Division**
2. Configure division parameters:
   - **Maximum width** — e.g., 3.5m (factory limit)
   - **Maximum height** — e.g., 3.6m
   - **Maximum weight** — e.g., 5 tons
   - **Joint width** — e.g., 20mm between panels
   - **Division strategy** — equal panels, optimize for weight, or manual
3. Planbar automatically divides the wall into producible panels
4. Each panel gets a unique label and production number
5. Review and adjust divisions manually if needed

### Manual Division Adjustments

1. Select a panel boundary
2. Drag to adjust the division point
3. Or use the **Add Division** tool to create a new cut
4. The panel labels and quantities update automatically

## Automated Slab Divisions

Similar to walls, slabs are divided for production:

1. Go to **Precast > Slab > Automated Division**
2. Set parameters:
   - **Maximum slab width** — e.g., 2.4m (hollow core width)
   - **Maximum length** — e.g., 12m
   - **Joint width** — e.g., 30mm
3. Planbar divides the slab into individual precast pieces
4. For hollow core slabs, the division follows the core pattern

## Automated Reinforcement

### One-Click Reinforcement

Planbar's automated reinforcement generates basic reinforcement for walls and slabs:

1. Select a precast element (wall or slab)
2. Go to **Reinforcement > Automated Reinforcement**
3. Planbar generates:
   - **Mesh reinforcement** — top and bottom layers
   - **Edge reinforcement** — additional bars around openings
   - **Lifting anchors** — for crane lifting (calculated based on weight)
   - **Connection reinforcement** — for panel-to-panel connections
4. The reinforcement is based on:
   - Element dimensions
   - Concrete cover requirements
   - Bar size and spacing defaults
   - Plant-specific reinforcement preferences

### Reinforcement Configuration

1. Go to **Reinforcement > Settings**
2. Configure:
   - **Concrete cover** — typical 25-40mm
   - **Bar sizes** — default diameters for mesh, edge, and lifting
   - **Mesh type** — welded wire mesh or individual bars
   - **Lifting anchor type** — from the plant's anchor catalog
3. These settings apply to all automated reinforcement

### Manual Reinforcement

For elements that need more than basic reinforcement:

1. Use the **Secondary Reinforcement** tools:
   - **Bar reinforcement** — place individual bars
   - **Stirrups** — place stirrups for beams and columns
   - **Mesh** — place custom mesh patterns
   - **Trimming reinforcement** — around openings
2. Use **Reinforcement for Trimming** for openings
3. Use **Joint Reinforcement** for panel connections

## Shop Drawing Generation

### Automatic Shop Drawings

1. Go to **Output > Shop Drawing > Automatic**
2. Select the elements to document
3. Planbar generates shop drawings including:
   - **Element geometry** — plan, section, and 3D views
   - **Reinforcement layout** — all bars, meshes, and anchors
   - **Dimensions** — automatic dimensioning
   - **Labels** — element number, type, weight, concrete volume
   - **Bar bending schedule** — list of all bars with shapes and dimensions
   - **Lifting plan** — anchor positions and lifting instructions

### Customizing Shop Drawings

1. Configure the drawing template:
   - **Title block** — company logo and project information
   - **Views** — which views to include (plan, section, 3D)
   - **Scale** — automatic or manual
   - **Dimension style** — office standards
2. Save the template for reuse across projects

## Production Data Export

### TIM (Technical Information Manager)

Planbar exports production data through TIM:

1. Go to **Export > TIM**
2. Select the elements to export
3. TIM generates production data including:
   - **Element geometry** — 3D model of each piece
   - **Reinforcement data** — all bars, meshes, and anchors
   - **Production parameters** — concrete type, curing time
   - **Lifting data** — anchor positions and weight
4. The data is sent to the factory's production control system

### IFC Export

For BIM coordination:

1. Go to **Export > IFC**
2. Select the precast elements
3. Choose the IFC view (coordination view or fabrication view)
4. The IFC file includes all precast elements with their reinforcement and properties

## Common Issues

### Automated Division Creates Too Many Small Panels

- Increase the maximum panel dimensions
- Change the division strategy from "equal" to "optimize"
- Manually adjust division points

### Reinforcement Doesn't Generate

- Check that the element is defined as a precast element (not architectural)
- Verify the concrete cover settings
- Check that the reinforcement settings have valid bar sizes
- Ensure the element has a defined layer structure

### Shop Drawings Are Missing Information

- Verify all reinforcement is placed (automated + manual)
- Check the drawing template includes all required views
- Ensure element labels and production numbers are assigned

## Best Practices

- **Import IFC models early** — start with the architectural model, don't model from scratch
- **Configure plant-specific settings** — every factory has different capabilities
- **Use automated division first** — then adjust manually
- **Run automated reinforcement before manual** — the basic reinforcement provides a starting point
- **Generate shop drawings after all reinforcement is complete** — avoid regenerating
- **Use intelligent templates** — save element types, reinforcement patterns, and drawing templates
- **Work in 3D** — Planbar's 2D and 3D are always consistent; working in 3D ensures accuracy
- **Export to TIM for production** — don't rely on drawings alone; production data ensures factory accuracy
