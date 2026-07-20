---
title: "Autodesk InfraWorks Bridge Modeling: Parametric Bridges, Revit Integration, and Design Workflow"
excerpt: "InfraWorks parametric bridge modeling creates preliminary bridge designs that publish to Revit and Civil 3D for detailed structural design. I cover the bridge design workflow, component configuration (piers, abutments, decks), and the InfraWorks-to-Revit-to-Civil 3D round-trip workflow."
category: "workflow"
softwareSlug: "infraworks"
keyword: "Autodesk InfraWorks bridge modeling parametric piers abutments deck Revit integration workflow"
slug: "autodesk-infraworks-bridge-modeling-parametric-revit-integration"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-22"
sources:
  - "https://knowledge.autodesk.com/support/infraworks/learn-explore/caas/CloudHelp/cloudhelp/ENU/InfraWorks-DataExchange/files/InTheCollection/InfraWorks-DataExchange-InTheCollection-CivilStructuresWorkflows-html-html.html"
  - "https://www.autodesk.com/autodesk-university/class/Practical-Application-of-InfraWorks-for-Bridge-Modelling-and-Design-2023"
  - "https://www.autodesk.com/autodesk-university/class/New-Workflow-Bridge-Design-InfraWorks-Inventor-Civil-3D-and-Revit-2018"
  - "https://www.autodesk.com/learn/ondemand/curated/roadway-and-bridge-modeling-in-civil-3d-and-infraworks"
---

# Autodesk InfraWorks Bridge Modeling: Parametric Bridges, Revit Integration, and Design Workflow

I've used InfraWorks for preliminary bridge design on highway and rail projects. InfraWorks has become Autodesk's central tool for bridge modeling in a realistic context — you design the bridge geometry parametrically, then publish it to Revit for detailed structural design and to Civil 3D for alignment and grading. The round-trip workflow between these three tools is powerful once you understand how the data flows.

## The InfraWorks Bridge Workflow

Autodesk describes the workflow: "InfraWorks has become the Autodesk center tool for bridge design in realistic contexts."

The typical workflow:
1. **InfraWorks**: Create preliminary bridge geometry over a road or railway
2. **Revit**: Receive the parametric bridge for detailed structural design
3. **Civil 3D**: Receive alignment and grading data
4. **Revit/Civil 3D**: Make detailed design changes
5. **InfraWorks**: Update the model with changes from Revit and Civil 3D

## Creating a Bridge in InfraWorks

### Step 1: Prepare the Road

1. Create or import the road that the bridge will carry
2. Adjust the road profile so it spans the obstacle (river, valley, another road)
3. The bridge will follow the road's alignment and profile

### Step 2: Add the Bridge

1. Select the road segment that needs a bridge
2. Right-click → **Add Bridge**
3. InfraWorks generates a parametric bridge following the road alignment
4. The bridge appears in the 3D model with default components

### Step 3: Configure Bridge Components

Select the bridge and open the Properties panel:

**Deck**:
- **Deck Type**: Slab, box girder, I-beam, etc.
- **Deck Width**: Matches the road width
- **Deck Thickness**: Structural depth of the deck
- **Material**: Concrete, steel, composite

**Piers**:
- **Pier Type**: Column, wall, hammerhead, multi-column
- **Pier Height**: Adjusts to terrain
- **Pier Spacing**: Distance between piers
- **Number of Piers**: Add or remove piers
- **Pier Shape**: Rectangular, circular, oval

**Abutments**:
- **Abutment Type**: Stub, full-height, integral
- **Abutment Height**: Matches the end of the bridge
- **Wing Walls**: Configure wing wall angles and lengths

**Bearings**:
- **Bearing Type**: Elastomeric, pot, spherical
- **Bearing Configuration**: Fixed, expansion, guided

### Step 4: Adjust Bridge Layout

1. Drag pier locations along the bridge length
2. Add or remove piers by clicking the bridge and using the pier tools
3. Adjust span lengths between piers
4. The bridge updates in real-time

### Step 5: Visual Review

1. Orbit the 3D model to inspect the bridge from all angles
2. Check pier heights relative to terrain
3. Verify abutment positions at the bridge ends
4. Review the deck alignment with the road

## Publishing to Revit

### Step 1: Publish from InfraWorks

1. Select the bridge
2. Right-click → **Publish to Revit**
3. Choose the Revit version and template
4. InfraWorks exports the parametric bridge data

### Step 2: Open in Revit

1. Open Revit with the appropriate bridge template
2. The bridge model appears with all components
3. Bridge attributes are preserved

Autodesk's documentation states: "You'll notice that the bridge attributes for selected components, shown in Revit Properties, match the attributes for this bridge in Civil 3D and InfraWorks."

### Step 3: Detailed Design in Revit

In Revit, you can:
- Modify reinforcement layouts
- Add detailed structural connections
- Create shop drawings
- Perform structural analysis
- Add architectural details (railings, lighting, drainage)

### Step 4: Update InfraWorks from Revit

1. After making changes in Revit
2. Save and sync the Revit model
3. In InfraWorks, right-click the bridge → **Update from Revit**
4. The InfraWorks model reflects the Revit changes

## Publishing to Civil 3D

### Step 1: Publish from InfraWorks

1. Select the bridge or road
2. Right-click → **Publish to Civil 3D**
3. The alignment, profile, and bridge data are exported

### Step 2: Open in Civil 3D

1. Open Civil 3D
2. The alignment and profile appear
3. The bridge components are visible as reference objects
4. Use Civil 3D for:
   - Detailed grading around abutments
   - Earthwork calculations
   - Drainage design
   - Construction staking data

### Step 3: Update InfraWorks from Civil 3D

1. After making changes in Civil 3D
2. Save the DWG file
3. In InfraWorks, refresh the data source
4. The InfraWorks model updates with Civil 3D changes

## Bridge Types in InfraWorks

### Girder Bridges

- **I-Beam**: Common for highway bridges, steel or concrete
- **Box Girder**: Used for longer spans, concrete
- **Slab**: Simple span bridges for short distances

### Arch Bridges

- Configure arch shape and rise
- Suitable for aesthetic bridges over rivers

### Cable-Stayed and Suspension

- Available in newer InfraWorks versions
- Configure tower height and cable arrangement
- For long-span signature bridges

## Practical Design Considerations

### Span Lengths

- **Short spans (10-25m)**: Slab or I-beam bridges
- **Medium spans (25-50m)**: Box girder or precast girders
- **Long spans (50-200m)**: Segmental box girders
- **Very long spans (200m+)**: Cable-stayed or suspension

### Pier Placement

- Avoid placing piers in river channels when possible
- Consider scour depth for piers in water
- Match pier spacing to span capacity of the deck type
- Consider constructability — shorter spans are easier to build

### Clearance

- Verify vertical clearance over the obstacle (road, river, railway)
- Minimum clearance: 4.5m over roads, 1.0m over 100-year flood level
- Check horizontal clearance for navigation channels

## Common Issues

### Bridge Doesn't Follow Road Profile

- Verify the road profile is properly defined
- Check that the bridge is associated with the correct road
- Re-create the bridge if the association is broken

### Piers Don't Reach the Ground

- Check terrain data accuracy in the bridge area
- Adjust pier heights manually
- Verify the coordinate system is consistent

### Revit Import Fails

- Ensure both InfraWorks and Revit are the same version year
- Check that the Revit bridge template is installed
- Verify the bridge has all required components defined

### Attributes Don't Match Between Tools

- Ensure you're using the latest versions of all three tools
- Run the publish/update cycle again
- Check for custom parameters that may not transfer

## Summary

InfraWorks parametric bridge modeling creates preliminary bridge designs that integrate with Revit and Civil 3D. Start by creating the road, then add a bridge to the road segment. Configure deck, pier, abutment, and bearing components in the Properties panel. Publish to Revit for detailed structural design and to Civil 3D for grading and earthwork. The round-trip workflow preserves bridge attributes across all three tools. Choose bridge type based on span length — slabs for short spans, box girders for medium, cable-stayed for long spans. Always verify clearance, pier placement, and terrain interaction before publishing to Revit. This workflow allows bridge designers to work in Revit, civil engineers in Civil 3D, and both to see their changes reflected in the InfraWorks context model.
