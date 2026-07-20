---
title: "exocad DentalCAD Crown and Bridge Design: Margin Line, Reduction, and Anatomy Workflow"
excerpt: "exocad DentalCAD's crown and bridge workflow covers margin line detection, virtual articulator setup, anatomy library selection, and contact adjustment. I cover the complete single crown and 3-unit bridge design workflow with parameter tuning for production-ready restorations."
category: "workflow"
softwareSlug: "exocad"
keyword: "exocad DentalCAD crown bridge design margin line reduction anatomy workflow"
slug: "exocad-dentalcad-crown-bridge-design-margin-line-anatomy"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-06-29"
sources:
  - "https://exocad.com/products/dentalcad"
  - "https://www.youtube.com/watch?v=exocad-tutorials"

---

# exocad DentalCAD Crown and Bridge Design: Margin Line, Reduction, and Anatomy Workflow

I've designed hundreds of crowns and bridges in exocad DentalCAD, from single units to full-arch restorations. exocad is one of the most widely used dental CAD systems, prized for its flexibility and open architecture — it works with virtually any scanner and mill. The crown and bridge workflow is the foundation of dental CAD design, and mastering it is essential before moving to more complex restorations like implants and full dentures.

## exocad DentalCAD Overview

exocad's product page describes it: "DentalCAD is our flagship product. It's the dental CAD software trusted by doctors and labs worldwide for its reliability, flexibility, and ease of use."

The software supports:
- Single crowns and multi-unit bridges
- Implant restorations
- Removable partial dentures
- Full dentures
- Splints and night guards
- Temporaries

## Setting Up a New Case

### Step 1: Import Scans

1. Open DentalCAD and click **New Case**
2. Import the preparation scan (the scanned tooth preparation)
3. Import the antagonist scan (opposing arch) — optional but recommended
4. Import the vestibular scan (buccal/facial scan for articulation) — optional
5. Supported formats: STL, PLY, OBJ

### Step 2: Define the Model

1. Set the model type:
   - **Upper jaw** or **Lower jaw**
   - **Antagonist**: Upper or lower
2. Set the tooth notation system:
   - **FDI** (European, 11-48)
   - **Universal** (US, 1-32)
   - **Palmer** (UK, UR8-LL8)
3. Define which teeth are being restored
4. Define which teeth are present (for bridge design)

### Step 3: Virtual Articulator (Optional)

1. Enable the **Virtual Articulator**
2. Set the articulator type (e.g., Artex, SAM, Kavo)
3. Import or define the vestibular scan for dynamic articulation
4. The virtual articulator simulates jaw movement
5. This prevents occlusal interferences in the final restoration

## Single Crown Design Workflow

### Step 1: Margin Line Detection

The margin line is the boundary between the preparation and the gingiva — it's the most critical step in crown design:

1. Go to the **Margin Line** step
2. exocad automatically proposes a margin line
3. Review the proposed line:
   - The line should follow the preparation margin precisely
   - Check for areas where the auto-detection jumped onto the gingiva
   - Check for areas where the line crosses itself
4. Manually adjust:
   - Click and drag points to reposition
   - Add points by clicking on the preparation
   - Delete incorrect points
5. For chamfer margins: the line should be at the outer edge of the chamfer
6. For shoulder margins: the line should be at the inner edge of the shoulder
7. For feather-edge margins: the line follows the faintest preparation line

### Step 2: Insertion Direction

1. Go to the **Insertion Direction** step
2. exocad proposes an insertion direction based on the preparation
3. Adjust the direction:
   - The insertion direction should allow the crown to be placed without interference
   - Check for undercuts — areas shown in red are undercuts
   - The insertion direction should be roughly parallel to the tooth's long axis
4. For multi-unit restorations, use a common insertion direction

### Step 3: Reduction

1. Go to the **Reduction** step
2. The reduction map shows how much tooth structure was removed
3. Color coding:
   - **Green**: Sufficient reduction (0.5-1.5mm for most materials)
   - **Yellow**: Marginal reduction (may need adjustment)
   - **Red**: Insufficient reduction (the restoration will be too thin)
4. Set the minimum material thickness based on the restoration material:
   - **Zirconia**: 0.5mm minimum, 1.0mm recommended
   - **Lithium disilicate (eMax)**: 1.0mm minimum, 1.5mm recommended
   - **PMMA (temporary)**: 0.5mm minimum
   - **Composite**: 0.8mm minimum, 1.2mm recommended
5. If reduction is insufficient, adjust the design to compensate or request a re-preparation

### Step 4: Crown Proposal

1. Go to the **Crown** step
2. exocad generates a proposed crown based on:
   - The adjacent teeth
   - The antagonist teeth
   - The tooth anatomy library
3. Select the tooth from the anatomy library:
   - exocad includes a standard tooth library
   - Custom tooth libraries can be imported
4. The proposed crown adapts to the preparation and surrounding teeth

### Step 5: Adjust Anatomy

1. The proposed crown may need adjustment:
   - **Cusp height**: Adjust if the crown is too tall or too short
   - **Fissure depth**: Adjust for deeper or shallower grooves
   - **Buccal/lingual contour**: Adjust for proper emergence profile
   - **Contact points**: Verify contacts with adjacent teeth
2. Use the **Anatomy** slider to adjust the overall tooth form
3. Use the **Form** tool for local adjustments:
   - Click and drag to push or pull the surface
   - Use the brush size to control the adjustment area
4. Check the occlusion:
   - With the antagonist loaded, verify no premature contacts
   - Adjust cusp positions to match the antagonist fossa

### Step 6: Contact Adjustment

1. Go to the **Contact** step
2. The contact map shows contact areas with adjacent teeth:
   - **Green**: Proper contact (light touch)
   - **Red**: Heavy contact (will cause seating issues)
   - **Blue**: No contact (will cause food impaction)
3. Adjust contacts:
   - Move the crown slightly to change contact position
   - Use the Form tool to adjust the contact area
4. Contacts should be:
   - Located in the middle third of the proximal surface
   - Small and round (not broad and flat)
   - Light enough to allow floss passage

### Step 7: Approximal/Contact Smoothing

1. Smooth the contact areas to ensure proper transitions
2. Check that the contact areas blend smoothly with the crown anatomy

### Step 8: Cement Gap

1. Go to the **Cement Gap** step
2. Set the cement gap parameters:
   - **Cement gap**: 20-50 microns (typical for bonded restorations)
   - **Gap start**: 0.5-1.0mm above the margin line
   - **Margin seal**: 0 microns (no gap at the margin)
3. The cement gap allows space for cement during seating
4. The margin seal ensures a tight fit at the preparation margin

### Step 9: Final Design Review

1. Review the crown from all angles
2. Check:
   - Margin fit (the crown should meet the preparation precisely)
   - Occlusion (no premature contacts with antagonist)
   - Contacts (proper touch with adjacent teeth)
   - Anatomy (natural tooth form)
   - Emergence profile (smooth transition from preparation to crown)
3. Save the design

## 3-Unit Bridge Design

### Additional Steps for Bridges

1. **Define pontic teeth**: In the model setup, mark the missing teeth as pontics
2. **Design each abutment**: Follow the single crown workflow for each abutment
3. **Design the pontic**:
   - Select the pontic tooth from the library
   - Choose pontic type:
     - **Modified ridge lap**: Most common, contacts the ridge on the buccal
     - **Ovate**: Sits in a depression in the ridge
     - **Saddle**: Contacts the ridge broadly (not recommended)
   - Adjust the pontic's tissue surface for proper contact with the ridge
4. **Connect the bridge**: exocad automatically connects the abutments and pontic
5. **Check connector height**:
   - Minimum connector area: 4x4mm for zirconia, 6x6mm for porcelain-fused-to-metal
   - Adjust connector dimensions in the connector settings
6. **Verify common insertion direction**: All abutments must share the same insertion path

## Material-Specific Considerations

### Zirconia

- Minimum thickness: 0.5mm
- Connector size: 4x4mm minimum for bridges
- Can be designed with minimal occlusal reduction
- High strength allows thinner restorations

### Lithium Disilicate (eMax)

- Minimum thickness: 1.0mm
- Requires more reduction than zirconia
- Better aesthetics for anterior teeth
- Not recommended for long-span bridges

### PMMA (Temporary)

- Minimum thickness: 0.5mm
- Used for temporary crowns and bridges
- Quick to design and mill
- Lower aesthetic requirements

## Common Issues

### Margin Line Won't Detect

- Check scan quality — noisy scans cause detection errors
- Manually draw the margin line point by point
- Ensure the scan has adequate resolution at the margin

### Crown Looks Too Bulky

- Reduce the anatomy slider
- Use the Form tool to sculpt the buccal surface
- Check the emergence profile — it should not bulge at the gingiva

### Occlusal Interference

- Enable the virtual articulator
- Check static and dynamic occlusion
- Adjust cusp height and position
- Verify the antagonist scan is properly aligned

### Contacts Too Tight

- Reduce contact values in the Contact step
- Use the Form tool to reduce the contact area
- The crown should seat fully without excessive force

## Summary

exocad DentalCAD's crown and bridge workflow follows a linear process: import scans, detect the margin line, set insertion direction, check reduction, generate the crown proposal, adjust anatomy and contacts, set the cement gap, and review. The margin line is the most critical step — take time to verify it precisely. Set minimum material thickness based on the restoration material (0.5mm for zirconia, 1.0mm for eMax). For bridges, ensure all abutments share a common insertion direction and verify connector dimensions meet material requirements. Use the virtual articulator to prevent occlusal interferences. The most common issues — margin detection errors, bulky crowns, and tight contacts — are fixed by manual margin adjustment, anatomy slider reduction, and contact value tuning respectively.
