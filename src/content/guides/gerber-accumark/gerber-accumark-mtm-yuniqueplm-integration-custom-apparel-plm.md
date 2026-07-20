---
title: "Gerber AccuMark MTM and YuniquePLM Integration: Custom Apparel and Product Lifecycle Management"
excerpt: "AccuMark MTM generates custom-sized patterns from body measurements, while YuniquePLM manages the full product lifecycle from design to production. I cover the MTM workflow, body measurement integration, PLM style management, and how the two systems integrate for custom apparel production."
category: "workflow"
softwareSlug: "gerber-accumark"
keyword: "Gerber AccuMark MTM made-to-measure YuniquePLM integration custom apparel product lifecycle management"
slug: "gerber-accumark-mtm-yuniqueplm-integration-custom-apparel-plm"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-29"
sources:
  - "https://www.gerbertechnology.com/accumark/"
  - "https://www.gerbertechnology.com/accumark-mtm/"

---

# Gerber AccuMark MTM and YuniquePLM Integration: Custom Apparel and Product Lifecycle Management

I've implemented AccuMark MTM and YuniquePLM for uniform programs and custom apparel services. The combination of made-to-measure pattern generation and product lifecycle management creates a complete system for personalized apparel production — from individual body measurements through pattern generation, tech pack creation, and production tracking.

## AccuMark MTM Overview

Gerber's MTM module generates custom-sized patterns from individual body measurements. It uses a base pattern with defined adjustment rules that automatically modify the pattern based on customer measurements.

### MTM Setup

1. **Create the base pattern**: Design the base pattern in PDS at a standard size
2. **Define measurement points**: Specify which body measurements drive pattern adjustments
3. **Set adjustment rules**: Define how each measurement modifies the pattern
4. **Set adjustment limits**: Define minimum and maximum adjustments to prevent distortion

### MTM Measurements

The standard measurements that drive pattern adjustments:
- **Chest circumference**: Drives chest width
- **Waist circumference**: Drives waist width
- **Hip circumference**: Drives hip width
- **Shoulder width**: Drives shoulder measurement
- **Arm length**: Drives sleeve length
- **Body length**: Drives garment length
- **Neck circumference**: Drives neckline size
- **Bicep circumference**: Drives sleeve width
- **Wrist circumference**: Drives cuff size
- **Inseam length**: Drives pant leg length (for bottoms)

### MTM Order Workflow

1. Open the **MTM Order** module
2. Enter customer measurements:
   - Manual entry: Type each measurement
   - Body scanner import: Import from 3D body scan
   - CSV import: Batch import for multiple customers
3. Click **Generate Pattern**
4. AccuMark applies adjustment rules to the base pattern
5. The custom pattern is generated in seconds
6. Review the generated pattern for distortion

### 3D Fit Validation for MTM

1. Create a custom avatar from the customer's measurements
2. Simulate the MTM garment on the custom avatar in AccuMark 3D
3. Check the tension map for fit issues
4. Adjust measurement rules if needed
5. Regenerate and re-validate

### MTM Production

1. Generate a marker for the custom pattern
2. For single garments: Single-piece marker
3. For batch MTM orders: Combine multiple custom sizes on one marker
4. Export as GER or DXF-AAMA for cutting
5. The custom garment is cut and sewn like any other

### Body Scanner Integration

AccuMark MTM integrates with body scanning systems:
- **[TC]2**: Retail body scanners
- **SizeStream**: Mobile body scanning
- **Styku**: Retail body scanning
- **3DLook**: Mobile measurement from photos

The scanner workflow:
1. Customer is scanned (30 seconds to 2 minutes)
2. Measurements are imported into AccuMark MTM
3. Custom pattern is generated automatically
4. Pattern is sent to production

## YuniquePLM Overview

Gerber's product page describes YuniquePLM: "YuniquePLM is a product lifecycle management solution that manages styles, BOMs, tech packs, and production tracking from design to delivery."

### PLM Core Functions

- **Style management**: Create and manage style records
- **BOM (Bill of Materials)**: Track fabrics, trims, and components
- **Tech pack generation**: Create production-ready tech packs
- **Colorway management**: Manage color variants
- **Costing**: Track material and production costs
- **Sample tracking**: Track sample iterations and approvals
- **Production tracking**: Monitor production status
- **Supplier management**: Manage vendor relationships

### Style Management in YuniquePLM

1. Create a new style record:
   - Style number and name
   - Season and collection
   - Category (tops, bottoms, dresses, etc.)
   - Designer and developer
   - Target price and cost
2. Upload design files:
   - Sketches and tech flats
   - 3D images from AccuMark 3D
   - Colorway images
3. The style record is the central hub for all product data

### BOM Management

1. Create the Bill of Materials:
   - **Main fabric**: Type, composition, weight, supplier, cost
   - **Lining fabric**: If applicable
   - **Trims**: Buttons, zippers, snaps, hooks
   - **Thread**: Type and color
   - **Labels**: Brand, size, care labels
   - **Packaging**: Bags, boxes, hangers
2. The BOM drives material ordering and cost calculation
3. Changes to the BOM are tracked with version control

### Tech Pack Generation

1. Generate a tech pack from the style record:
   - **Flat sketches**: Front and back technical drawings
   - **POM spec sheet**: Measurements with tolerances
   - **Size run**: Graded measurements for all sizes
   - **BOM**: Complete material list
   - **Construction details**: Seam types, stitch specifications
   - **Colorway information**: Color variants
   - **3D images**: From AccuMark 3D (if available)
2. Export as PDF for manufacturers
3. The tech pack is the primary communication document with factories

## AccuMark and YuniquePLM Integration

### Data Flow

1. **Pattern in AccuMark**: Design the pattern in PDS
2. **3D in AccuMark 3D**: Simulate and validate fit
3. **Style in YuniquePLM**: Create the style record
4. **Link pattern to style**: Connect the AccuMark pattern to the PLM style
5. **BOM in PLM**: Define materials and costs
6. **Tech pack in PLM**: Generate with pattern data and 3D images
7. **Production in PLM**: Track production status
8. **Marker in AccuMark**: Create the marker for cutting
9. **Cut file to cutter**: Send to Gerber or third-party cutter

### Integration Benefits

- **Single source of truth**: All product data in one system
- **Version control**: Track all changes to patterns, BOMs, and tech packs
- **3D in tech packs**: Include 3D images for better factory communication
- **Cost tracking**: Real-time cost calculation from BOM changes
- **Sample tracking**: Track sample iterations and approval status
- **Production visibility**: Monitor production status across all styles

## MTM with YuniquePLM

### Custom Apparel Workflow

1. **Customer measurement**: Body scan or manual measurement
2. **MTM pattern generation**: AccuMark MTM generates custom pattern
3. **3D validation**: AccuMark 3D validates fit on custom avatar
4. **PLM style creation**: YuniquePLM creates a custom style record
5. **BOM for custom garment**: Materials and trims specified
6. **Tech pack generation**: Custom tech pack with measurements
7. **Marker creation**: Single or batch marker for MTM orders
8. **Cutting and sewing**: Production of the custom garment
9. **Delivery tracking**: PLM tracks the order to delivery

### Uniform Program Management

For uniform programs (military, corporate, school):
1. Set up base patterns for each uniform style
2. Measure each individual (body scanner or manual)
3. Generate custom patterns for each person
4. Store measurements in YuniquePLM for re-ordering
5. Track production status for each uniform order
6. Manage alterations and re-orders

## Common Issues

### MTM Pattern Distortion at Extreme Sizes

- Set realistic adjustment limits
- Create multiple base patterns for different size ranges
- Use conditional rules to switch base patterns at thresholds
- Test the extremes of the measurement range

### PLM and AccuMark Not Synchronizing

- Verify the integration is properly configured
- Check that the style number matches between systems
- Ensure the pattern is saved in the correct storage area
- Re-link the pattern to the PLM style

### Tech Pack Missing 3D Images

- Verify AccuMark 3D images are exported to the correct location
- Check that the PLM style has 3D images attached
- Re-generate the tech pack after adding 3D images

### BOM Costs Don't Match Supplier Quotes

- Update supplier pricing in the PLM material library
- Verify BOM quantities match the marker consumption
- Check for outdated material costs
- Re-calculate the style cost after BOM updates

## Summary

AccuMark MTM and YuniquePLM together create a complete system for custom apparel production and product lifecycle management. MTM generates custom-sized patterns from body measurements with automated adjustment rules. YuniquePLM manages styles, BOMs, tech packs, and production tracking. The integration connects pattern data, 3D images, and production information in a single system. For MTM operations, the workflow flows from body scan to pattern generation, 3D validation, PLM style creation, tech pack generation, marker making, and cutting. For uniform programs, measurements are stored in PLM for re-ordering. The most common issues — pattern distortion, synchronization failures, and missing data — are addressed by setting adjustment limits, verifying integration configuration, and ensuring proper data linking between systems.
