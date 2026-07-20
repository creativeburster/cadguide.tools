---
title: "Marvelous Designer Avatar Setup and Garment Fitting: Custom Characters, Arrangement Points, and Auto-Fitting"
excerpt: "Fitting clothing to custom characters in Marvelous Designer requires proper avatar setup, arrangement point configuration, and understanding the auto-fitting system. We cover importing custom avatars, adjusting body measurements, using arrangement points for garment placement, and troubleshooting common fitting issues."
category: "workflow"
softwareSlug: "marvelous-designer"
keyword: "Marvelous Designer avatar setup custom character garment fitting arrangement points"
slug: "marvelous-designer-avatar-setup-garment-fitting-custom-characters"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://support.marvelousdesigner.com/hc/en-us/articles/47358128221337-Avatar-Editor-ver-2025-0"
  - "https://support.marvelousdesigner.com/hc/en-us/articles/47358335130649-Auto-Fitting"
  - "https://www.reddit.com/r/MarvelousDesigner/comments/1crjg0i/fitting_help/"

---

# Marvelous Designer Avatar Setup and Garment Fitting: Custom Characters, Arrangement Points, and Auto-Fitting

We've fitted hundreds of garments on characters ranging from standard Marvelous Designer avatars to custom MetaHumans and stylized game characters. The fitting process is where most users struggle — garments that look perfect on the default avatar often don't translate to custom characters without proper avatar setup and arrangement point configuration.

## Avatar Types in Marvelous Designer

Marvelous Designer includes several built-in avatar types:
- **Standard avatars**: Male and female bodies in various sizes
- **MetaHuman avatars**: Pre-configured for Epic Games' MetaHuman framework
- **Custom avatars**: Imported from FBX, OBJ, or GLB files

For most production work, we import a custom avatar that matches the target character's body proportions exactly.

## Importing a Custom Avatar

1. File → Import → Avatar (or drag and drop an FBX/OBJ file)
2. Select the file format:
   - **FBX**: Best for avatars with skeletons (for animation)
   - **OBJ**: Best for static pose avatars
   - **GLB**: Best for avatars with materials
3. In the import dialog, configure:
   - **Scale**: Usually centimeters
   - **Coordinate system**: Y-up or Z-up depending on your source application
   - **Units**: Real-world scale is critical for accurate simulation

## Avatar Editor (2025.0)

Marvelous Designer 2025 includes an updated Avatar Editor with tabs for:
- **Avatar Size**: Adjust overall height and proportions
- **Measure**: Set specific body measurements (chest, waist, hip, etc.)
- **Arrangement**: Configure arrangement points for garment placement
- **Fitting Suit**: Set up the collision surface
- **IK**: Configure inverse kinematics for posing

### Body Measurement Adjustment

For custom characters that don't match standard avatars:
1. Open the Avatar Editor (right-click avatar → Edit)
2. Go to the **Measure** tab
3. Adjust individual measurements:
   - Chest circumference
   - Waist circumference
   - Hip circumference
   - Neck circumference
   - Arm length
   - Leg length
   - Shoulder width
4. The avatar updates in real-time as you adjust measurements

This is useful when you need to simulate clothing for a specific actor or character with non-standard proportions.

## Arrangement Points

Arrangement points are predefined positions on the avatar where pattern pieces can be snapped. They're essential for quickly positioning garment pieces before simulation.

### Using Arrangement Points

1. Select a pattern piece in the 2D window
2. Click **Show Arrangement Points** in the 3D toolbar
3. Blue dots appear on the avatar at predefined positions
4. Click an arrangement point to snap the selected pattern to that position

Common arrangement points include:
- Shoulder points (for shirts, jackets)
- Chest points (for tops)
- Waist points (for pants, skirts)
- Hip points (for lower garments)
- Neck point (for collars, scarves)

### Customizing Arrangement Points

For custom avatars, the default arrangement points may not be in the right positions:
1. Open the Avatar Editor → **Arrangement** tab
2. Select an arrangement point to edit
3. Adjust its position in X, Y, Z
4. Add new arrangement points if needed

We always verify arrangement points after importing a custom avatar — they're often slightly off, which causes garments to start simulation in the wrong position.

## Auto-Fitting

Marvelous Designer 9.5+ includes an Auto-Fitting feature that automatically adjusts garments to fit different avatar body types.

Marvelous Designer's documentation describes it: "The garment simulated on the avatar provided by Marvelous Designer" can be auto-fitted to a different avatar.

### Using Auto-Fitting

1. Open a garment file that was designed for a different avatar
2. Load your target avatar
3. Select the garment pieces
4. Use the Auto-Fitting tool (right-click garment → Auto-Fitting)
5. Marvelous Designer adjusts the pattern dimensions to fit the new avatar's measurements
6. Re-simulate to see the result

### Limitations of Auto-Fitting

Auto-fitting works well for size differences (e.g., fitting a medium garment on a large avatar) but has limitations:
- **Pose differences**: If the original garment was designed for a T-pose and your avatar is in an A-pose, auto-fitting won't adjust for the arm position
- **Proportion changes**: Extreme proportion differences (e.g., child to adult) produce poor results
- **Complex garments**: Multi-layer garments with many panels may not auto-fit cleanly

## Manual Fitting Workflow

When auto-fitting doesn't produce good results, we use this manual workflow:

### Step 1: Position Pattern Pieces

1. Turn off simulation (click the simulation toggle)
2. Use arrangement points to roughly position each pattern piece
3. Manually adjust positions in the 3D window by dragging

A Reddit user helping with a fitting issue advises: "With clothes simulation off, move the pieces of garment individually to fit to the arms and legs."

### Step 2: Adjust Pattern Dimensions

1. In the 2D window, select pattern pieces
2. Use the Edit Pattern tool (Z) to resize and reshape pieces
3. Compare measurements against the avatar's body dimensions
4. Add or remove ease (extra fabric allowance) as needed

### Step 3: Gradual Simulation

1. Turn on simulation at low resolution (1-2)
2. Let the garment settle on the avatar
3. Identify areas where the garment clips through the body or floats away
4. Turn off simulation, adjust pattern positions and dimensions
5. Re-simulate and iterate

### Step 4: Layer Management

For multi-layer garments:
1. Simulate the base layer first (e.g., shirt)
2. Freeze or lock the base layer
3. Add the next layer (e.g., jacket) and simulate
4. Enable layer collision so the jacket rests on the shirt, not the body
5. Continue adding layers

## Common Fitting Issues

### Garment Clips Through Body

- Increase the avatar's collision offset (Avatar Editor → Fitting Suit)
- Reduce fabric stretch
- Increase simulation quality
- Check that the avatar's collision mesh is properly configured

### Garment Floats Away from Body

- Increase fabric density (heavier fabric falls closer to body)
- Reduce bending stiffness (softer fabric conforms better)
- Check arrangement points — if the garment starts too far from the body, it may not settle correctly

### Sleeves or Pant Legs Don't Align

- Check that the original garment's pose matches the avatar's pose
- Manually reposition sleeves/pant legs with simulation off
- Adjust pattern dimensions to accommodate different limb proportions

### Collar Doesn't Fit Neck

- Adjust the neck arrangement point position
- Redraft the collar pattern piece to match the avatar's neck circumference
- Use the Edit Pattern tool to reshape the collar curve

## Fitting Suit Configuration

The fitting suit is the collision surface that garments interact with during simulation. For custom avatars:
1. Open Avatar Editor → **Fitting Suit** tab
2. Verify the fitting suit mesh covers the entire body
3. Adjust collision offset (typically 2-5 mm)
4. For characters with unusual proportions, you may need to regenerate the fitting suit

## Summary

Successful garment fitting in Marvelous Designer requires proper avatar setup, correct arrangement point configuration, and an iterative simulation workflow. For custom characters, import the exact body mesh as an avatar, verify arrangement points are correctly positioned, and use the manual fitting workflow (position with simulation off, simulate at low resolution, adjust, re-simulate). Auto-fitting works for minor size adjustments but fails with significant proportion or pose differences. Always fit garments layer by layer, starting with the base layer and adding layers sequentially with collision enabled.
