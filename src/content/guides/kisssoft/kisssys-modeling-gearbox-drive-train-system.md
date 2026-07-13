---
title: "KISSsys: Modeling Complete Gearboxes and Drive Trains"
excerpt: "KISSsys extends KISSsoft with system-level modeling of complete gearboxes, drive trains, and multi-stage transmissions — calculating all gears, shafts, and bearings simultaneously. Based on KISSsoft documentation and INSA Toulouse tutorials."
category: "workflow"
softwareSlug: "kisssoft"
keyword: "kisssys system modeling gearbox drive train multi-stage"
slug: "kisssys-modeling-gearbox-drive-train-system"
author: "CADGuide Technical Editorial"
readTime: "9 min read"
date: "2026-07-12"
sources:
  - "https://www.kisssoft.com/en/products/product-overview/kisssoft-system-module"
  - "https://moodle.insa-toulouse.fr/pluginfile.php/92317/mod_resource/content/1/Kisssys-Tutorial-2-Modeling-a-one-stage-planetary-gearbox.pdf"
  - "https://globasengineering.com/kisssoft/"
---

# KISSsys: Modeling Complete Gearboxes and Drive Trains

KISSsys is the system module that extends KISSsoft from individual component calculation to complete system modeling. According to GloBAS Engineering: "KISSsys is an add-on system to KISSsoft that can be used to model complete gearboxes and drive trains. The analysis is performed simultaneously for all gears, shafts and bearings."

## What KISSsys Does

KISSsys enables:
- **System-level modeling**: Model entire gearboxes including all gears, shafts, bearings, and couplings
- **Kinematic analysis**: Power flow through the system, speed and torque at each stage
- **Simultaneous calculation**: All components are calculated together, with loads propagated through the system
- **Template-based modeling**: Use pre-built templates for common gearbox configurations
- **Custom models**: Build any configuration from scratch using the tree structure and sketcher

## KISSsys vs. KISSsoft

| Feature | KISSsoft | KISSsys |
|---|---|---|
| Scope | Single component (one gear pair, one shaft) | Complete system (multi-stage gearbox) |
| Load propagation | Manual — user inputs loads | Automatic — loads flow through the system |
| Kinematics | Not calculated | Calculated automatically |
| Templates | Not available | Pre-built gearbox templates |
| System deformation | Not available | Available (shaft + bearing + housing) |
| Shifting transmissions | Not available | Available |

## Modeling Workflow

### Step 1: Create a New KISSsys Model

1. Open KISSsys (separate from KISSsoft, or as a module within KISSsoft)
2. **File → New System**
3. The system tree appears on the left side of the interface

### Step 2: Build the System Tree

The system tree represents the hierarchical structure of the gearbox:

1. **Add elements to the tree**: Drag and drop elements from the template library:
   - Shafts
   - Gears (cylindrical, bevel, planetary)
   - Bearings
   - Couplings
   - Planetary carriers
   - Synchronizers / shifting elements

2. **Alternative: Use the sketcher**: Draw the system layout in the 2D sketcher
   - Define shafts as lines
   - Place gears at positions on the shafts
   - Connect gears with mesh definitions
   - Both methods can be mixed

3. **Define connections**: 
   - Gear meshes (which gear meshes with which)
   - Couplings (which shafts are connected)
   - Fixed connections (components fixed to shafts)

### Step 3: Define the Input Power

1. Select the input shaft
2. Define:
   - **Power** (kW) or **Torque** (Nm)
   - **Speed** (rpm)
   - **Input direction**
3. KISSsys propagates the power through the system automatically

### Step 4: Configure Each Component

For each element in the tree:
1. **Double-click** to open the KISSsoft calculation module
2. Define geometry, material, and calculation settings
3. Close the module — settings are saved in the KISSsys model
4. Repeat for all gears, shafts, and bearings

### Step 5: Define Coupling Constraints

For planetary gearboxes, coupling constraints are critical. From the INSA Toulouse tutorial:

1. **Planet carrier couplings**: Define how the planet carrier connects to the shafts
2. **Planet pin shaft**: The coupling between the planet pin and the carrier
3. **Sun and ring gear**: Define which is fixed, which is input, which is output

For a simple planetary gearbox:
- Sun gear: Input
- Ring gear: Fixed
- Planet carrier: Output
- Planets: Mounted on the carrier via planet pins

### Step 6: Run the System Calculation

1. Click **Calculate System**
2. KISSsys:
   - Performs kinematic analysis (speeds at all points)
   - Propagates loads through all gear meshes
   - Calculates each gear, shaft, and bearing
   - Reports warnings and errors for all components
3. Review the system report

### Step 7: Review Results

1. **System overview**: Speeds, torques, and power at each stage
2. **Individual components**: Open any component to see detailed results
3. **Warnings and errors**: Check the message list for all components
4. **System deformation**: View shaft deflection and bearing displacement

## Planetary Gearbox Modeling (Tutorial Example)

Based on the INSA Toulouse KISSsys Tutorial 2:

### Structure
1. **Sun gear**: Connected to the input shaft
2. **Planet gears** (3): Mounted on the planet carrier via planet pins
3. **Ring gear**: Fixed to the housing
4. **Planet carrier**: Connected to the output shaft

### Key Steps
1. Add the sun shaft, planet carrier shaft, and output shaft to the tree
2. Add the sun gear on the sun shaft
3. Add the planet gears on planet pin shafts
4. Add the ring gear (fixed)
5. Define coupling constraints:
   - Planet pin shafts coupled to the planet carrier
   - Planet gears can rotate on the planet pins (via bearings)
6. Add roller bearings connecting planet pins to planet gears
7. Define the input power on the sun shaft
8. Calculate the system

### Bearing Placement
In the KISSsys system, the roller bearings that connect the planet pin to the planet gear are added to the same level as the shafts themselves, similar to how they are defined in the KISSsoft shaft calculation.

## Shifting Transmissions

According to KISSsoft's system module documentation: "Shifting transmissions are also very easy to create with KISSsoft System Module. The user can just drop the elements needed in the tree, draw them in the sketcher or even mix both methods."

1. Add shifting elements (synchronizers, clutches) to the tree
2. Connect the shifting elements to the gears
3. Define which gears are engaged for each shift position
4. The load analysis automatically considers only the engaged gears

## Templates

KISSsys includes templates for common gearbox configurations:
- Single-stage cylindrical gearboxes
- Two-stage cylindrical gearboxes
- Planetary gearboxes (single and multi-stage)
- Bevel-helical gearboxes
- Worm gearboxes

Using templates:
1. **File → New from Template**
2. Select the template that matches your configuration
3. Modify the parameters (gear ratios, powers, dimensions)
4. Calculate

## Common Issues

### Issue: Power Flow Doesn't Reach All Components
- Check coupling definitions — missing couplings break the power flow
- Verify gear mesh connections are defined
- Ensure the input power is on the correct shaft

### Issue: Planetary Gear Calculation Fails
- Check coupling constraints — all three components (sun, ring, carrier) must be properly constrained
- Verify that one component is fixed (typically the ring gear)
- Check planet bearing definitions

### Issue: System Calculation Is Slow
- Reduce the number of slices in contact analysis
- Simplify bearing models (use standard bearings instead of detailed models)
- Use the "Faster" calculation speed setting for initial runs

### Issue: Inconsistent Shaft Calculation
The KISSsoft training notes mention "Problems of consistency in the shaft calculation" in system models. This occurs when:
- Shaft boundary conditions differ between the system model and individual calculation
- Fix: Ensure shaft supports in KISSsys match the individual shaft calculation
- Use "Treated as defined in shaft calculation" for consistent results

## Best Practices

1. **Start with a template**: If a template matches your configuration, start from it and modify
2. **Build incrementally**: Add one stage at a time, calculate, verify, then add the next
3. **Check kinematics first**: Before detailed strength calculation, verify speeds and torques are correct
4. **Use consistent units**: Ensure all components use the same unit system (SI or Imperial)
5. **Document the system**: Name components meaningfully in the tree (e.g., "Input Shaft", "Stage 1 Pinion")
6. **Save versions**: Save model versions as you build — system models can become complex and hard to debug
