---
title: "exocad Implant Restoration Design: Abutment, Screw-Retained Crown, and Hybrid Prosthesis"
excerpt: "exocad's implant module designs custom abutments, screw-retained crowns, and full-arch hybrid prostheses. I cover implant library selection, abutment parameter configuration, screw channel design, and the hybrid prosthesis workflow with multi-unit abutments."
category: "workflow"
softwareSlug: "exocad"
keyword: "exocad implant restoration abutment screw-retained crown hybrid prosthesis design workflow"
slug: "exocad-implant-restoration-abutment-screw-retained-hybrid"
author: "CAD IT Admin"
readTime: "12 min"
date: "2025-06-29"
sources:
  - "https://exocad.com/products/dentalcad"
  - "https://docs.exocad.com/docs_dentalcad_3.0/2302.html"
---

# exocad Implant Restoration Design: Abutment, Screw-Retained Crown, and Hybrid Prosthesis

I've designed implant restorations in exocad ranging from single-tooth custom abutments to full-arch All-on-4 hybrid prostheses. exocad's implant module is one of its strongest features — it supports virtually every implant system through its open library architecture. Understanding the implant workflow is essential for any dental lab doing implant work, as it differs significantly from conventional crown and bridge design.

## Implant Module Overview

exocad's implant module supports:
- **Custom abutments**: Titanium or zirconia abutments for cement-retained crowns
- **Screw-retained crowns**: Crowns with screw access channels
- **Hybrid prostheses**: Full-arch fixed restorations on multi-unit abutments
- **Bar overdentures**: Bars for removable implant overdentures
- **Telescopic crowns**: Double crown systems for removable prostheses

## Setting Up an Implant Case

### Step 1: Import Scans

1. Import the implant scan body scan (the scan with scan bodies attached to the implants)
2. Import the antagonist scan
3. Import the soft tissue scan (for hybrid prostheses, the scan of the gums)
4. The scan bodies are geometric markers that tell the software exactly where each implant is positioned

### Step 2: Define Implant Positions

1. Go to the **Implant** step
2. For each implant position:
   - Select the tooth number
   - Choose the implant system (e.g., Nobel Biocare, Straumann, Dentsply Sirona, Zimmer)
   - Choose the implant model and size
   - exocad matches the scan body to the implant library
3. The implant position is defined by:
   - **Position**: X, Y, Z coordinates
   - **Angle**: Buccal-lingual and mesial-distal angulation
   - **Depth**: How deep the implant platform sits

### Step 3: Implant Library Selection

exocad includes implant libraries for most major systems:
- **Nobel Biocare**: NobelActive, NobelReplace, Brånemark
- **Straumann**: Bone Level, Tissue Level, BLT
- **Dentsply Sirona**: Astra Tech, Ankylos, Xive
- **Zimmer**: Tapered Screw Vent, Trabecular Metal
- **BioHorizons**: Tapered Internal, External Hex
- **MIS**: C1, V3, Seven
- **Neodent**: Drive, Grand Morse, Alvim
- Custom libraries can be imported for unsupported systems

## Custom Abutment Design

### Step 1: Abutment Type Selection

1. Select **Custom Abutment** as the restoration type
2. Choose the abutment material:
   - **Titanium**: Most common, strong, biocompatible
   - **Zirconia**: Aesthetic for anterior teeth, requires titanium base
   - **PEEK**: Temporary abutments
   - **Chrome Cobalt**: Metal abutments for high strength

### Step 2: Abutment Parameters

1. Set the abutment parameters:
   - **Gingiva height**: Distance from implant platform to gingival margin (0.5-5mm)
   - **Abutment angle**: Adjust if the implant is angled (up to 25° correction)
   - **Emergence profile**: The shape of the abutment as it emerges from the implant
   - **Margin position**: Where the crown margin will sit
2. The abutment should have:
   - A smooth transition from the implant platform
   - Proper emergence profile matching the natural tooth root
   - Sufficient retention form for the cemented crown
   - Anti-rotation features where possible

### Step 3: Design the Abutment

1. exocad generates a proposed abutment based on the implant position and surrounding teeth
2. Adjust the abutment shape:
   - Use the Form tool for local adjustments
   - Check the emergence profile in the cross-section view
   - Verify the abutment doesn't interfere with adjacent teeth
3. Set the cement gap for the overlying crown
4. Design the crown on top of the abutment (same workflow as conventional crowns)

### Step 4: Titanium Base Selection

For zirconia abutments, a titanium base (Ti base) connects the zirconia to the implant:
1. Select the appropriate Ti base from the library
2. The Ti base has a pre-defined geometry that matches the implant connection
3. The zirconia abutment is designed to cement onto the Ti base
4. Set the cement gap between zirconia and Ti base

## Screw-Retained Crown Design

### Step 1: Select Screw-Retained Option

1. Choose **Screw-Retained Crown** as the restoration type
2. The crown will have a screw access channel from the occlusal surface to the implant

### Step 2: Screw Channel Design

1. The screw channel follows the implant axis
2. If the implant is angled, the screw channel may exit through the buccal or lingual surface
3. Check the screw channel exit point:
   - **Ideal**: Exit through the central fossa (occlusal)
   - **Acceptable**: Exit through the cingulum (anterior teeth)
   - **Problematic**: Exit through the buccal or lingual surface (compromises aesthetics)
4. For angled channels, use a **screw channel correction** (up to 25°) to redirect the channel
5. Set the screw channel diameter (typically 2.5-3.0mm for the screw access)

### Step 3: Design the Crown

1. Design the crown following the conventional crown workflow
2. The screw channel creates a hole in the crown:
   - The hole should be as small as possible while allowing screw access
   - The hole will be filled with composite after seating
3. Check that the screw channel doesn't compromise the crown's structural integrity
4. For zirconia screw-retained crowns, ensure minimum material thickness around the channel

### Step 4: Verify Fit

1. Check the crown fits on the implant platform
2. Verify the screw channel is clear
3. Check occlusion with the antagonist
4. Verify contacts with adjacent teeth

## Full-Arch Hybrid Prosthesis (All-on-4/All-on-6)

### Step 1: Setup

1. Import the scan with all implant scan bodies
2. Define each implant position and system
3. Import the soft tissue scan
4. Set up the virtual articulator for proper occlusion

### Step 2: Multi-Unit Abutment Selection

1. For each implant, select a **multi-unit abutment (MUA)**:
   - Choose the correct gingiva height (1-4mm)
   - Choose the correct angle (0° or 17° or 30° for angled implants)
   - All MUAs should be parallelized for a common insertion direction
2. For All-on-4 with angled distal implants:
   - Use 30° angled MUAs on the distal implants
   - Use 0° MUAs on the anterior implants
   - The angled MUAs redirect the screw access to a more favorable position

### Step 3: Framework Design

1. Design the metal or zirconia framework:
   - The framework connects all implant positions
   - Minimum framework thickness: 3-4mm for titanium, 4-5mm for zirconia
   - The framework should follow the arch shape
   - Verify the framework doesn't interfere with the soft tissue
2. Set the screw access channels for each implant
3. Check that all screws can be accessed through the prosthesis

### Step 4: Tooth Setup

1. Design the teeth on top of the framework:
   - Use the tooth library for each tooth position
   - Arrange teeth for proper occlusion and aesthetics
   - Consider the patient's smile line and lip support
2. For a hybrid prosthesis, the teeth and gingiva are designed as one unit:
   - Pink acrylic or composite for the gingival portion
   - White teeth for the visible portions
3. Adjust the occlusion:
   - Check static occlusion (centric relation)
   - Check dynamic occlusion (excursive movements)
   - Adjust for canine guidance or group function

### Step 5: Try-In Design

1. Design a try-in prosthesis (PMMA) for the clinical try-in appointment
2. The try-in verifies:
   - Fit on the implants
   - Occlusion
   - Aesthetics
   - Phonetics
   - Lip support
3. After try-in adjustments, finalize the definitive prosthesis

## Common Implant Design Issues

### Screw Channel Exits Through Buccal Surface

- Use angled multi-unit abutments to redirect the channel
- Use a screw channel correction of up to 25°
- Consider a cement-retained restoration instead
- Accept the buccal exit if aesthetics allow (posterior teeth)

### Abutment Emergence Profile Is Wrong

- Check the gingiva height setting
- Adjust the emergence profile in the cross-section view
- The abutment should emerge naturally from the gingiva, not bulge or pinch

### Framework Doesn't Fit

- Verify all implant positions are correctly defined
- Check scan body alignment
- Ensure the correct implant library is selected
- Verify the scan quality at each implant site

### Occlusal Interference on Hybrid

- Enable the virtual articulator
- Check all excursive movements
- Adjust cusp height and fossa depth
- Consider canine guidance for prosthetic occlusion

## Summary

exocad's implant module handles custom abutments, screw-retained crowns, and full-arch hybrid prostheses. Start by importing the scan body scan and defining each implant position with the correct implant system and model. For custom abutments, set gingiva height and emergence profile, then design the overlying crown. For screw-retained crowns, verify the screw channel exits in a favorable position — use angled abutments or channel correction for angled implants. For hybrid prostheses, select multi-unit abutments (0° or 30°), design the framework with minimum 3-4mm thickness, and arrange teeth for proper occlusion and aesthetics. Always design a PMMA try-in prosthesis for clinical verification before the definitive restoration. The most common issues — buccal screw exits, emergence profile errors, and framework misfit — are addressed with angled abutments, cross-section adjustment, and implant position verification respectively.
