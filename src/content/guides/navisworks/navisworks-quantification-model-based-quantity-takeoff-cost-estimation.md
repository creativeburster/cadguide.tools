---
title: "Navisworks Quantification: Model-Based Quantity Takeoff and Cost Estimation"
excerpt: "A guide to model-based quantity takeoff in Navisworks Quantification covering model element mapping, quantity catalog setup, material extraction, cost resource assignment, and export to Excel for cost estimation."
category: "workflow"
softwareSlug: "navisworks"
keyword: "navisworks quantification takeoff"
slug: "navisworks-quantification-model-based-quantity-takeoff-cost-estimation"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://help.autodesk.com/view/NAV/2024/ENU/?guid=GUID-QUANTIFICATION"
  - "https://www.autodesk.com/products/navisworks/overview"
---

# Navisworks Quantification: Model-Based Quantity Takeoff and Cost Estimation

Navisworks Quantification extracts material quantities directly from BIM models and links them to cost resources for estimation. Unlike manual takeoff from 2D drawings, model-based quantification is automatic, accurate, and updates when the model changes. This guide covers the complete quantification workflow.

## Setting Up Quantification

### Opening Quantification

1. Home > Quantification
2. The Quantification panel opens with:
   - **Item Catalog**: Hierarchical list of quantity items
   - **Resource Catalog**: Cost resources (labor, material, equipment)
   - **Takeoff**: Extracted quantities from the model
   - **Workbook**: Cost summary by item and resource

### Model Element Mapping

Before extracting quantities, map model elements to quantity categories:

1. Quantification > Model Mapping
2. For each element type (wall, slab, column, etc.):
   - Map to a quantity item in the Item Catalog
   - Specify which properties to extract (length, area, volume, count)
3. Example mapping:
   - IfcWall → "Concrete Walls" item → extract Volume
   - IfcSlab → "Concrete Slabs" item → extract Volume
   - IfcColumn → "Concrete Columns" item → extract Volume + Count
   - IfcDoor → "Doors" item → extract Count

## Item Catalog Setup

### Creating the Item Catalog

1. Quantification > Item Catalog > New
2. Create a hierarchical structure:
   ```
   Project
   ├── Substructure
   │   ├── Excavation
   │   ├── Foundations
   │   └── Basement Walls
   ├── Superstructure
   │   ├── Concrete Walls
   │   ├── Concrete Slabs
   │   ├── Concrete Columns
   │   ├── Concrete Beams
   │   └── Steel Elements
   ├── Envelope
   │   ├── Exterior Walls
   │   ├── Windows
   │   ├── Doors
   │   └── Roof
   ├── Interior
   │   ├── Partition Walls
   │   ├── Floor Finishes
   │   ├── Ceiling
   │   └── Paint
   └── MEP
       ├── HVAC
       ├── Plumbing
       └── Electrical
   ```

3. For each item, set:
   - **Unit**: m³, m², m, ea (each)
   - **Formula**: How to calculate from model properties
   - **Description**: Item description for the estimate

### Importing a Catalog

1. Quantification > Item Catalog > Import
2. Import from:
   - **CSV**: Custom catalog
   - **RSMeans**: Standard cost data (if available)
   - **Company standard**: Reusable catalog from previous projects

## Resource Catalog Setup

### Creating Resources

1. Quantification > Resource Catalog > New
2. Create cost resources:
   - **Material resources**: Concrete ($150/m³), Steel ($2,500/ton), Brick ($0.50/ea)
   - **Labor resources**: Carpenter ($45/hr), Mason ($55/hr), Laborer ($35/hr)
   - **Equipment resources**: Crane ($200/hr), Mixer ($75/hr)

### Assigning Resources to Items

1. Select an item in the Item Catalog
2. Click "Assign Resource"
3. Choose resource(s) and set quantity per unit:
   - Example: "Concrete Walls" (m³) → Concrete (1 m³ per m³) + Labor (2 hrs per m³) + Equipment (0.5 hrs per m³)
4. The cost per unit is calculated automatically

## Running the Takeoff

### Automatic Takeoff

1. Quantification > Takeoff > Auto Takeoff
2. Navisworks scans the model and extracts quantities based on the mapping:
   - Counts each element type
   - Calculates length, area, volume from geometry
   - Assigns to the corresponding Item Catalog entry
3. Results appear in the Takeoff tab

### Manual Takeoff

For elements not captured by automatic mapping:
1. Select elements in the 3D view
2. Quantification > Takeoff > Add to Item
3. Select the Item Catalog entry
4. The quantity is added manually

### Virtual Takeoff (For Missing Elements)

For elements not in the model (e.g., formwork, finishes not modeled):
1. Select the parent item (e.g., "Concrete Walls")
2. Click "Add Virtual Item"
3. Enter the quantity manually (e.g., formwork area = 2 × wall height × wall length)
4. Virtual items appear in the takeoff with a "virtual" flag

## Reviewing Quantities

### Takeoff Tab

1. Quantification > Takeoff
2. View extracted quantities:
   - **Item**: Catalog item name
   - **Quantity**: Extracted amount
   - **Unit**: m³, m², m, ea
   - **Source**: Model (automatic) or Manual
   - **Elements**: Number of model elements contributing
3. Sort by item, quantity, or source
4. Filter by building section, floor, or discipline

### Verifying Quantities

1. Select an item in the Takeoff tab
2. The corresponding model elements are highlighted in 3D
3. Verify:
   - All expected elements are included
   - Quantities match manual spot checks
   - No duplicate elements
4. If quantities are wrong:
   - Check the Model Mapping settings
   - Verify element properties in the source model
   - Adjust the formula if needed

## Workbook (Cost Summary)

### Viewing the Workbook

1. Quantification > Workbook
2. The workbook shows:
   - **Item**: Catalog item
   - **Quantity**: Total quantity
   - **Unit**: Unit of measure
   - **Resources**: Assigned resources with costs
   - **Total Cost**: Quantity × Cost per unit
   - **Subtotal**: By category (Substructure, Superstructure, etc.)
   - **Grand Total**: Total project cost

### Cost Breakdown

The workbook provides multiple cost views:
- **By category**: Substructure, Superstructure, Envelope, Interior, MEP
- **By resource type**: Material, Labor, Equipment
- **By floor**: Cost per building level
- **By discipline**: Architectural, Structural, MEP

## Export

### Excel Export

1. Quantification > Export > Excel
2. The workbook is exported with:
   - All items, quantities, and costs
   - Category subtotals
   - Grand total
3. Use Excel for further analysis, reporting, or integration with estimating software

### CSV Export

1. Quantification > Export > CSV
2. Raw data export for import into other systems
3. Suitable for ERP or cost database integration

### PDF Report

1. Quantification > Export > PDF
2. Formatted report with:
   - Project summary
   - Cost breakdown by category
   - Detailed item list
   - Resource summary
3. Suitable for client presentations

## Updating Quantities After Model Changes

1. When the BIM model is updated:
2. Quantification > Takeoff > Refresh
3. Navisworks re-extracts quantities from the updated model
4. Items linked to model elements update automatically
5. Manual and virtual items remain unchanged
6. The workbook recalculates costs
7. Compare before/after to see cost impact of design changes

## Best Practices

1. **Set up mapping before the model is complete** — start with a few element types and expand
2. **Use standard catalogs** — company-specific or industry-standard (RSMeans)
3. **Verify with manual spot checks** — compare model quantities with manual calculations for 5-10 items
4. **Include virtual items for unmodeled elements** — formwork, finishes, temporary works
5. **Update regularly** — refresh quantities after each model revision
6. **Track cost changes** — compare workbook versions to show cost impact of design decisions
7. **Export to Excel for reporting** — Navisworks is for extraction; Excel is for analysis
8. **Coordinate with estimators** — ensure the catalog structure matches the estimating workflow

## Conclusion

Navisworks Quantification provides a direct path from BIM model to cost estimate. By mapping model elements to quantity items, setting up cost resources, running automatic takeoff, and exporting to Excel, you can produce model-based estimates that are more accurate and faster than manual 2D takeoff. The ability to refresh quantities when the model changes enables real-time cost feedback during design — a powerful tool for value engineering and budget control. By following this workflow, estimators and project managers can leverage the BIM model for data-driven cost decisions throughout the project lifecycle.
