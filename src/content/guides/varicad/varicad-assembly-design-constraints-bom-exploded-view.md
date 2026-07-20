---
title: "VariCAD Assembly Design: Constraints, BOM, and Exploded View Workflow"
excerpt: "A guide to assembly design in VariCAD covering component insertion, assembly constraints (mate, concentric, planar, distance), interference checking, BOM generation, and exploded view creation for documentation."
category: "workflow"
softwareSlug: "varicad"
keyword: "varicad assembly design"
slug: "varicad-assembly-design-constraints-bom-exploded-view"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.varicad.com/en/home/"
  - "https://www.youtube.com/@VariCADSystem"
---

# VariCAD Assembly Design: Constraints, BOM, and Exploded View Workflow

Assembly design is where individual parts come together into a functional product. VariCAD provides assembly constraints, interference checking, BOM generation, and exploded view creation. This guide covers the complete assembly workflow.

## Creating an Assembly

### Starting a New Assembly

1. File > New > Assembly
2. The assembly workspace opens with an empty assembly tree
3. Insert parts using Insert > Component > From File
4. Select `.dwb` (VariCAD part) or STEP/IGES files
5. Each inserted part appears in the assembly tree

### Inserting Multiple Instances

1. Insert the first instance of a part
2. Select the part in the assembly tree
3. Edit > Copy Component
4. Specify a new position
5. Or use Insert > Component > From File again and select the same file

## Assembly Constraints

### Available Constraint Types

- **Coincident**: Two points or axes share the same position
- **Concentric**: Two cylindrical faces share the same axis
- **Planar**: Two planar faces are coplanar (with optional offset)
- **Parallel**: Two faces or edges are parallel
- **Perpendicular**: Two faces or edges are perpendicular
- **Tangent**: Two faces are tangent (e.g., cylinder tangent to plane)
- **Distance**: Specific distance between two faces
- **Angle**: Specific angle between two faces

### Applying Constraints

1. Tools > Assembly > Constraints
2. Select constraint type
3. Select first face/edge on component A
4. Select second face/edge on component B
5. Specify offset or angle if applicable
6. The components move to satisfy the constraint

### Example: Assembling a Bearing onto a Shaft

1. Insert the shaft and bearing into the assembly
2. Apply Concentric constraint:
   - Select the shaft cylindrical face
   - Select the bearing inner bore face
   - The bearing centers on the shaft
3. Apply Planar constraint:
   - Select the shaft shoulder face
   - Select the bearing inner ring face
   - Set offset to 0
   - The bearing positions against the shoulder
4. The bearing is now fully constrained on the shaft

### Constraint Status

VariCAD shows constraint status for each component:
- **Fully Constrained**: All degrees of freedom removed (green)
- **Under-Constrained**: Some movement allowed (yellow)
- **Over-Constrained**: Conflicting constraints (red)

### Editing and Deleting Constraints

1. Right-click a constraint in the assembly tree
2. Edit: modify offset, angle, or type
3. Delete: remove the constraint
4. The component returns to a less-constrained state

## Interference Checking

### Running Interference Check

1. Tools > Assembly > Interference Check
2. Select components to check:
   - **All components**: Check entire assembly
   - **Selected components**: Check specific pairs
3. Click "Check"
4. VariCAD reports:
   - Number of interference pairs found
   - Interference volume for each pair
   - Interfering solids highlighted in red

### Resolving Interferences

1. Identify the interfering components from the report
2. Adjust constraints to move components apart
3. Modify part geometry if the interference is a design error
4. Re-run interference check to verify resolution

## Bill of Materials (BOM)

### Generating BOM

1. Tools > Assembly > BOM
2. VariCAD scans the assembly and generates:
   - Item number
   - Part name
   - Quantity
   - File path
   - Material (if assigned)
   - Custom properties (if defined)
3. The BOM appears in a table view

### Custom BOM Properties

To add custom properties to parts:

1. Open the part file
2. File > Properties > Custom
3. Add properties:
   - **Description**: Part description
   - **Material**: Material specification
   - **Supplier**: Vendor name
   - **Cost**: Unit cost
4. Save the part
5. In the assembly, regenerate the BOM to include custom properties

### Exporting BOM

1. In the BOM table view, File > Export
2. Choose format:
   - **CSV**: For Excel import
   - **TXT**: Plain text
   - **HTML**: Web viewable
3. The BOM is exported with all columns

## Exploded Views

### Creating an Exploded View

1. Tools > Assembly > Exploded View
2. Select components to move apart
3. For each component, specify:
   - **Direction**: Along an axis or custom vector
   - **Distance**: How far to move
4. VariCAD moves the components to their exploded positions
5. Save the exploded view configuration

### Exploded View with Lines

1. After creating the exploded view
2. Tools > Assembly > Explode Lines
3. Draw lines connecting assembly positions to exploded positions
4. These lines show the assembly path in documentation

### Using Exploded Views in Drawings

1. Switch to 2D mode
2. Tools > 2D > Views from 3D
3. Select the assembly
4. Choose "Exploded" as the view type
5. Place the exploded view on the drawing sheet
6. Add balloon numbers and BOM table

## Assembly Best Practices

1. **Use a consistent coordinate system** — align parts with the assembly origin
2. **Constrain fully** — avoid under-constrained parts that can drift
3. **Use standard mate combinations**:
   - Shaft in hole: Concentric + Planar
   - Plate on plate: Planar + Planar + Planar (or Planar + Distance)
   - Bolt in hole: Concentric + Planar (against surface)
4. **Check interference after each major constraint** — catch errors early
5. **Name components descriptively** — use meaningful names in the tree
6. **Organize the tree** — group related components using sub-assemblies
7. **Save frequently** — assemblies can become unstable with many constraints

## Performance Tips for Large Assemblies

1. **Use sub-assemblies** — group parts into sub-assemblies to simplify the tree
2. **Simplify hidden parts** — use Tools > Assembly > Simplify to reduce detail on internal parts
3. **Suppress unused configurations** — if exploring alternatives, suppress inactive components
4. **Use lightweight display** — set visual style to wireframe for editing, switch to realistic for review
5. **Close unused documents** — each open part file consumes memory

## BOM Generation and Customization

VariCAD's bill of materials generation is straightforward but offers limited customization compared to SolidWorks or Inventor. The BOM tool scans the assembly for all unique parts, counts occurrences, and generates a table with part number, description, and quantity. You can customize which properties appear in the BOM by editing the part properties before generating the table. Common properties include part number, description, material, supplier, and cost. The BOM can be exported to CSV for import into Excel or other spreadsheet software for further processing. One limitation is that VariCAD doesn't support BOM templates — you can't save a BOM configuration and apply it to future assemblies. Each BOM is configured from scratch. For exploded views, VariCAD's explode tool offsets parts along a specified direction with a configurable distance. The explode lines (showing the assembly relationship) can be added manually using the leader line tool. While not as automated as SolidWorks' exploded view feature, this manual approach gives you full control over the explosion layout.

## Conclusion

VariCAD's assembly design tools cover the essential workflow: component insertion, constraint-based positioning, interference checking, BOM generation, and exploded view creation. While the constraint types and assembly scale are more limited than SolidWorks, the workflow is logical and sufficient for small to medium assemblies (up to ~500 parts). By following the constraint application patterns, running interference checks regularly, and using exploded views for documentation, you can manage complete product assemblies in VariCAD.
