---
title: "exocad Removable Partial Denture (RPD) Design: Survey Line, Clasp, and Connector Workflow"
excerpt: "exocad's RPD module designs removable partial dentures with survey analysis, clasp placement, and connector design. We cover the survey line workflow, clasp type selection, rest seat design, major connector configuration, and export for 3D printing or casting."
category: "workflow"
softwareSlug: "exocad"
keyword: "exocad removable partial denture RPD survey line clasp connector design workflow"
slug: "exocad-removable-partial-denture-rpd-survey-clasp-connector"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-29"
sources:
  - "https://exocad.com/products/dentalcad"
  - "https://wiki.exocad.com/wiki/index.php/DentalCAD_Documentation_-_Index_of_topics"

---

# exocad Removable Partial Denture (RPD) Design: Survey Line, Clasp, and Connector Workflow

We've designed removable partial dentures (RPDs) in exocad for Kennedy Class we through IV cases. The RPD module in exocad brings digital precision to a traditionally analog process — survey analysis, clasp design, and connector layout that were once done by hand on a physical model can now be done digitally with exact control over undercut amounts and clasp positions.

## RPD Module Overview

exocad's RPD module supports:
- **Survey analysis**: Digital surveying of the cast to determine undercut areas
- **Clasp design**: Akers, back-action, we-bar, and combination clasps
- **Rest seats**: Occlusal, cingulum, and lingual rests
- **Major connectors**: Palatal strap, palatal plate, lingual bar, lingual plate
- **Minor connectors**: Connecting clasps to the major connector
- **Mesh/saddle areas**: For acrylic denture teeth and gingiva
- **Full digital workflow**: Export for 3D printing the framework or the complete RPD

## Setting Up an RPD Case

### Step 1: Import the Model

1. Import the scanned dental cast (upper or lower)
2. The scan should include:
   - All remaining teeth
   - The edentulous ridges
   - The vestibular areas (for connector design)
   - The palate (for upper RPDs)
3. Verify scan quality — the cast must be complete with no missing areas

### Step 2: Define the Case

1. Select **RPD** as the case type
2. Define which teeth are present and which are missing
3. Define the Kennedy classification:
   - **Class we**: Bilateral free-end saddles
   - **Class II**: Unilateral free-end saddle
   - **Class III**: Unilateral bounded saddle
   - **Class IV**: Anterior bounded saddle
4. The classification helps determine the appropriate RPD design

## Survey Analysis

### Step 1: Digital Surveying

1. Go to the **Survey** step
2. exocad analyzes the cast and proposes a survey line
3. The survey line is the equator of the teeth as seen from the insertion direction
4. Areas above the survey line are retentive (undercuts)
5. Areas below the survey line are non-retentive

### Step 2: Adjust the Insertion Path

1. Adjust the insertion direction to optimize the survey line:
   - The goal is to have retentive undercuts on the clasped teeth
   - Avoid interferences (areas where the RPD would hit tooth undercuts during insertion)
   - The insertion path should be near-vertical for patient ease
2. Use the 3D view to check the survey line from all angles
3. The survey line should be:
   - Below the clasp tip position on clasped teeth (for retention)
   - Above the connector path (for no interference)

### Step 3: Undercut Analysis

1. View the undercut map:
   - **Red**: 0.25mm undercut (typical for cast gold clasps)
   - **Orange**: 0.50mm undercut (typical for cobalt-chromium clasps)
   - **Yellow**: 0.75mm undercut (for wrought wire clasps)
2. Verify that each clasped tooth has appropriate undercut at the clasp tip position
3. If undercuts are insufficient, adjust the insertion path or consider a different clasp design

## Clasp Design

### Clasp Types

1. **Akers Clasp (Circumferential)**:
   - Most common clasp for premolars and molars
   - Engages the buccal undercut
   - Rest on the occlusal surface
   - Reciprocal arm on the lingual surface

2. **Back-Action Clasp**:
   - For anterior teeth or premolars
   - Engages mesial or distal undercut
   - No separate reciprocal arm needed

3. **we-Bar (RPI/RPA)**:
   - For free-end saddle cases (Kennedy we/II)
   - we-bar engages the mesial undercut
   - Rest on the mesial occlusal
   - Plate (RPA) or we-bar (RPI) on the distal

4. **Combination Clasp**:
   - Cast clasp body with wrought wire retentive arm
   - For teeth with excessive undercut or poor periodontal support

### Designing a Clasp

1. Go to the **Clasp** step
2. Select the tooth for the clasp
3. Choose the clasp type
4. Set clasp parameters:
   - **Clasp material**: Cobalt-chromium, gold, or wrought wire
   - **Retention amount**: 0.25mm (Co-Cr), 0.50mm (gold), 0.75mm (wrought wire)
   - **Clasp arm thickness**: 1.0-1.5mm
   - **Clasp arm width**: 2.0-3.0mm at the base, tapering to 1.0mm at the tip
   - **Clasp position**: Where the clasp engages the tooth
5. exocad generates the clasp following the tooth contour
6. Adjust the clasp path:
   - The clasp should emerge from the connector, sweep around the tooth, and engage the undercut
   - The retentive tip should be in the undercut area
   - The reciprocal arm should be above the survey line

### Rest Seat Design

1. For each clasp, design a rest seat:
   - **Occlusal rest**: On the occlusal surface of posterior teeth
   - **Cingulum rest**: On the cingulum of anterior teeth
   - **Lingual rest**: On the lingual surface of anterior teeth
2. Rest seat dimensions:
   - **Depth**: 1.0-1.5mm
   - **Width**: 2.0-2.5mm
   - **Shape**: Spoon-shaped, with rounded internal angles
3. The rest prevents the RPD from sinking apically

## Major Connector Design

### Upper RPD Connectors

1. **Palatal Strap**: A narrow band across the palate
   - Minimum width: 8mm
   - Used for Kennedy Class we and II
   - Less palatal coverage than a plate

2. **Palatal Plate**: Covers the entire palate
   - Used for Kennedy Class we with extensive saddles
   - Provides maximum support
   - May affect phonetics and taste

3. **Anterior-Posterior Strap**: A-p palatal bar
   - Two straps connected anteriorly and posteriorly
   - Rigid and comfortable
   - Good for Kennedy Class III and IV

### Lower RPD Connectors

1. **Lingual Bar**: A bar below the gingiva
   - Most common lower connector
   - Minimum distance from gingiva: 3-4mm
   - Cross-section: half-pear shape, 4-6mm tall, 2-3mm thick

2. **Lingual Plate**: Covers the lingual gingiva
   - Used when the lingual bar can't be placed (short floor of mouth)
   - Less comfortable than a lingual bar
   - Covers the gingiva, which may cause periodontal issues

### Designing the Major Connector

1. Go to the **Connector** step
2. Choose the connector type
3. Set the connector parameters:
   - **Width/thickness**: Based on the type
   - **Position**: Distance from gingiva, palatal coverage
   - **Rigidity**: The connector must be rigid enough to prevent flexure
4. exocad generates the connector following the anatomy
5. Adjust the connector path to avoid interferences

## Saddle and Mesh Design

### Saddle Areas

1. Go to the **Saddle** step
2. For each edentulous area, define the saddle:
   - The saddle covers the ridge where denture teeth will be placed
   - The saddle has a mesh pattern for acrylic retention
3. Set the saddle extension:
   - **Buccal**: To the vestibule
   - **Lingual**: To the functional lingual depth
   - **Distal**: To the retromolar pad (lower) or pterygomaxillary seal (upper)

### Denture Tooth Setup

1. Go to the **Tooth Setup** step
2. Select denture teeth from the library
3. Position each tooth:
   - Align with the opposing dentition
   - Check occlusion in centric relation
   - Verify aesthetics
4. For posterior teeth, ensure proper occlusal contacts
5. For anterior teeth, verify the smile line and lip support

## Export and Production

### Framework Export

1. Export the metal framework as STL
2. The framework is then:
   - **Cast**: Traditional lost-wax casting in cobalt-chromium
   - **Milled**: CAD/CAM milling of Co-Cr or titanium
   - **3D Printed**: Direct metal laser sintering (DMLS) of Co-Cr

### Complete RPD Export

1. Export the complete RPD design (framework + teeth + gingiva)
2. For 3D printing:
   - Print the framework in castable resin for investment casting
   - Or print directly in Co-Cr via DMLS
3. For the acrylic portion:
   - Print the denture base in denture resin
   - Set denture teeth manually or print them

## Common Issues

### Clasp Doesn't Engage Undercut

- Check the survey line position
- Adjust the insertion path to create more undercut
- Increase the clasp retention amount
- Consider a different clasp type

### Connector Interferes with Teeth

- Check the survey line for interferences
- Adjust the insertion path
- Modify the connector path to avoid tooth undercuts
- Use a blockout on interfering tooth surfaces

### RPD Rocks or Doesn't Seat

- Verify the rest seats are properly positioned
- Check for interferences on the major connector
- Ensure the clasps aren't too tight
- Re-check the insertion path for parallelism

## Summary

exocad's RPD module brings digital precision to removable partial denture design. Start with survey analysis — adjust the insertion path to create appropriate undercuts on clasped teeth. Design clasps based on the clasp type (Akers for posterior, we-bar for free-end saddles) with correct retention amounts (0.25mm for Co-Cr). Design rest seats with 1.0-1.5mm depth. Choose the major connector based on the arch (palatal strap/plate for upper, lingual bar for lower). Design saddle areas with mesh for acrylic retention. Set up denture teeth with proper occlusion. Export the framework as STL for casting, milling, or DMLS. The most common issues — clasp not engaging, connector interference, and RPD rocking — are fixed by adjusting the insertion path, modifying the connector path, and verifying rest seat positions.
