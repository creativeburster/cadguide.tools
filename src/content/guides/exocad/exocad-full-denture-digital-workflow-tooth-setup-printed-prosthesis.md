---
title: "exocad Full Denture Design: Digital Workflow from Scan to Printed Prosthesis"
excerpt: "exocad's full denture module designs complete digital dentures with tooth setup, gingiva modeling, and try-in prostheses. I cover the complete workflow from impression scans to final printed dentures, including tooth arrangement, occlusion adjustment, and export for 3D printing."
category: "workflow"
softwareSlug: "exocad"
keyword: "exocad full denture design digital workflow tooth setup gingiva printed prosthesis"
slug: "exocad-full-denture-digital-workflow-tooth-setup-printed-prosthesis"
author: "CAD IT Admin"
readTime: "11 min"
date: "2025-06-29"
sources:
  - "https://exocad.com/products/dentalcad"

---

# exocad Full Denture Design: Digital Workflow from Scan to Printed Prosthesis

I've designed complete digital dentures in exocad for edentulous patients, including immediate dentures and final prostheses. The full denture module represents one of the most significant digital transformations in dental technology — replacing the traditional wax-rim, wax-setup, and flasking process with a fully digital workflow that produces try-in prostheses and final dentures via 3D printing.

## Full Denture Module Overview

exocad's denture module supports:
- **Complete upper and lower dentures**: Full arch tooth replacement
- **Immediate dentures**: Dentures designed with extraction sockets
- **Try-in dentures**: PMMA try-in prostheses for clinical verification
- **Final dentures**: Printed or milled definitive prostheses
- **Denture bases**: The gingival/pink portion of the denture
- **Denture teeth**: The white tooth portion, from tooth libraries

## Setting Up a Full Denture Case

### Step 1: Import Scans

1. Import the edentulous ridge scan (upper and/or lower)
2. Import the opposing arch scan
3. For immediate dentures, import the pre-extraction scan (with teeth) for tooth positioning reference
4. For dentures with existing denture scans, import the existing denture as a reference

### Step 2: Define the Case

1. Select **Denture** as the case type
2. Define the arch (upper, lower, or both)
3. Define the opposing arch type:
   - **Natural dentition**: Opposing arch has natural teeth
   - **Denture**: Opposing arch is also a denture
4. Set the tooth notation system

### Step 3: Define the Boundary

1. Draw the denture boundary on the ridge scan:
   - **Upper**: From the vestibule to the pterygomaxillary seal (posterior palatal seal)
   - **Lower**: From the vestibule to the retromolar pad
2. The boundary defines the extent of the denture base
3. Ensure the boundary covers the functional vestibule
4. For the upper, include the posterior palatal seal area

## Tooth Setup

### Step 1: Select Tooth Library

1. Go to the **Tooth Setup** step
2. Select a denture tooth library:
   - **exocad standard library**: Generic denture teeth
   - **Premium libraries**: Ivoclar Vivadent, Dentsply, Vita, and others
   - Custom libraries can be imported
3. Choose tooth mold:
   - **Anterior molds**: Ovoid, tapered, square (based on patient facial form)
   - **Posterior molds**: Anatomic, semi-anatomic, zero-degree (based on occlusal scheme)

### Step 2: Anterior Tooth Arrangement

1. Position the central incisors:
   - Align the midline with the facial midline
   - Set the incisal edge at the lip line (1-2mm below the upper lip at rest)
   - Set the labial inclination for proper lip support
2. Position the lateral incisors:
   - Slightly lingual to the centrals
   - Incisal edge 0.5-1mm above the centrals
3. Position the canines:
   - At the corner of the arch
   - Incisal edge level with the centrals
   - Slight labial inclination for canine eminence
4. Check the smile line:
   - The incisal edges should follow the lower lip curve
   - No reverse smile line
5. Check the vertical dimension:
   - Verify adequate inter-arch space
   - Check the rest vertical dimension and occlusal vertical dimension

### Step 3: Posterior Tooth Arrangement

1. Position the first premolars:
   - Aligned with the canine
   - Occlusal plane at the correct height
2. Position the second premolars and first molars:
   - Follow the occlusal plane (Wilson curve and Spee curve)
   - Set the buccal cusps to contact the opposing central fossa
   - Set the lingual cusps (upper) or buccal cusps (lower) for proper occlusion
3. Position the second molars:
   - At the end of the arch
   - Slightly lower than the first molars (curve of Spee)
4. Verify the occlusal plane:
   - Use the occlusal plane tool to check alignment
   - The plane should be level from premolar to molar

### Step 4: Occlusion Adjustment

1. Check static occlusion (centric relation):
   - All posterior teeth should have even bilateral contact
   - No premature contacts
   - Anterior teeth should have slight clearance (0.5mm)
2. Check dynamic occlusion:
   - **Protrusive**: Anterior guidance with posterior disclusion
   - **Working side**: Group function or canine guidance
   - **Balancing side**: Balancing contacts for denture stability (for complete dentures)
3. For complete dentures, **balanced occlusion** is critical:
   - Both working and balancing sides should have contacts during excursions
   - This prevents the denture from tipping during function
4. Adjust tooth positions and cusp heights to achieve balanced occlusion

## Gingiva Design

### Step 1: Denture Base Design

1. Go to the **Denture Base** step
2. exocad generates the denture base (pink gingiva) around the teeth
3. Adjust the gingival parameters:
   - **Gingival contour**: The shape of the gums around each tooth
   - **Gingival height**: How high the gums come on each tooth
   - **Palatal thickness**: 2-3mm for the upper denture palate
   - **Border thickness**: 2-4mm at the vestibular border
4. The gingiva should have:
   - Natural-looking stippling texture
   - Proper embrasure form between teeth
   - Realistic gingival margins (not too high or too low)
   - Smooth transition from tooth to gingiva

### Step 2: Gingival Sculpting

1. Use the Form tool for local adjustments:
   - Build up the gingiva where the ridge is resorbed
   - Create canine eminences for natural appearance
   - Adjust the vestibular depth for proper seal
2. Check the intaglio (tissue) surface:
   - The intaglio should match the ridge scan exactly
   - No gaps or compressions
   - The posterior palatal seal should have slight compression (0.5mm) for seal

## Try-In Prosthesis

### Designing the Try-In

1. Before the final denture, design a try-in prosthesis:
   - **Material**: PMMA (clear or tooth-colored)
   - **Purpose**: Clinical verification of tooth position, occlusion, aesthetics, and phonetics
2. Export the try-in as STL for 3D printing
3. The try-in is printed in:
   - **Clear PMMA**: To verify fit and adaptation
   - **Tooth-colored PMMA**: To verify aesthetics with the patient

### Try-In Appointment

The dentist checks at the try-in appointment:
- **Vertical dimension**: Correct lower face height
- **Centric relation**: Proper jaw relationship
- **Aesthetics**: Tooth color, shape, and arrangement
- **Phonetics**: "F" and "S" sounds for proper tooth position
- **Lip support**: Adequate fullness of the lips
- **Occlusion**: Even bilateral contacts

### Post-Try-In Adjustments

1. After the try-in, the dentist may request changes:
   - Tooth position adjustments
   - Occlusal adjustments
   - Aesthetic modifications
2. Import the adjusted try-in scan (if changes were made clinically)
3. Update the digital design
4. Proceed to final denture production

## Final Denture Production

### Export for 3D Printing

1. Export the final denture design as STL
2. Two production methods:

**Method 1: Printed Base + Commercial Teeth**
1. Print the denture base in denture resin (e.g., Ivoclar Print Denture, NextDent Denture 3D+)
2. After printing and post-curing, manually set commercial denture teeth into the printed base
3. This combines digital precision with traditional tooth quality

**Method 2: Fully Printed Denture**
1. Print the complete denture (base + teeth) in one piece
2. Use multi-material printing for pink base and white teeth (e.g., Stratasys or Asiga)
3. Post-cure and polish
4. Faster production but lower tooth quality than commercial teeth

**Method 3: Milled Denture**
1. Mill the denture base from a pre-polymerized PMMA block
2. Set commercial teeth into the milled base
3. Highest precision and material quality
4. Requires a 5-axis milling machine

### Print Settings

- **Layer height**: 50-100 microns for denture bases
- **Support material**: Minimal supports on the intaglio surface
- **Orientation**: Teeth down or at an angle to minimize support marks
- **Post-processing**: Remove supports, cure per resin manufacturer instructions, polish

## Common Issues

### Teeth Don't Fit in Printed Base

- Verify the tooth dimensions in the library match the commercial teeth
- Adjust the tooth sockets in the denture base
- Print a test fit before final production

### Occlusion Is Off After Printing

- Check the print orientation — angled printing can cause dimensional changes
- Verify the STL export is correct
- Adjust occlusion on the printed try-in and update the digital design

### Denture Base Doesn't Fit the Ridge

- Verify the ridge scan is accurate
- Check the intaglio surface for gaps or compressions
- Ensure the posterior palatal seal is properly designed
- Print a try-in to verify fit before the final denture

### Aesthetics Not Matching Patient Expectations

- Use a tooth-colored try-in for the patient to see
- Adjust tooth color, shape, and arrangement
- Consider taking a facial scan for digital facebow recording
- Use the pre-extraction scan as a reference for tooth position

## Summary

exocad's full denture module enables a complete digital workflow from scan to printed prosthesis. Start by importing the edentulous ridge scan and defining the denture boundary. Set up anterior teeth first (midline, smile line, lip support), then posterior teeth (occlusal plane, balanced occlusion). Design the gingiva with natural contours and proper intaglio fit. Always produce a try-in prosthesis (PMMA) for clinical verification before the final denture. For production, either print the base and set commercial teeth (best quality) or fully print the denture (fastest). The most common issues — tooth fit, occlusion, and base adaptation — are prevented by verifying tooth library dimensions, checking print orientation, and using a try-in prosthesis for clinical verification.
