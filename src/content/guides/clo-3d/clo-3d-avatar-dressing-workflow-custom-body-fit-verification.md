---
title: "CLO 3D Avatar and Dressing Workflow: Custom Bodies, Arrangement Points, and Fit Verification"
excerpt: "CLO 3D's avatar system supports custom body scans, standard fashion avatars, and MetaHuman characters. We cover importing custom avatars, configuring arrangement points, using the Avatar Editor for body measurements, and the fit verification workflow with tension maps and measurement checks."
category: "workflow"
softwareSlug: "clo-3d"
keyword: "CLO 3D avatar setup custom body dressing arrangement points fit verification"
slug: "clo-3d-avatar-dressing-workflow-custom-body-fit-verification"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://www.zealousxr.com/blog/clo3d-beginners-guide-fashion-designers"
  - "https://www.zealousxr.com/blog/clo3d-vs-marvelous-designer"
  - "https://learn3dfashion.com/pattern-making-with-clo-3d-a-beginners-guide"
---

# CLO 3D Avatar and Dressing Workflow: Custom Bodies, Arrangement Points, and Fit Verification

We've set up avatars in CLO 3D ranging from standard fashion mannequins to 3D body scans of real models and MetaHuman characters for virtual fashion shows. The avatar is the foundation of every garment in CLO — if the body is wrong, the fit will be wrong, and no amount of pattern adjustment will compensate.

## Avatar Types in CLO 3D

### Standard Avatars

CLO 3D includes a library of standard fashion avatars:
- **Male and female bodies** in various standard sizes (US, EU, Asian sizing)
- **Pose variations**: A-pose, T-pose, relaxed, walking
- **Body types**: Slim, regular, plus size

To add a standard avatar:
1. Open the Avatar Library (Window → Avatar Library)
2. Browse by gender, size, and pose
3. Double-click to load the avatar into the scene

### Custom Avatars

For production work, we typically import a custom avatar that matches the target body exactly:

1. File → Import → Avatar (or drag and drop)
2. Supported formats: FBX, OBJ, GLB
3. Configure import settings:
   - Scale: Centimeters (most common)
   - Coordinate system: Y-up or Z-up
   - Units: Real-world scale is critical

### MetaHuman Avatars

CLO 3D supports MetaHuman characters from Epic Games:
1. Export the MetaHuman from Unreal Engine as FBX
2. Import into CLO 3D as an avatar
3. The MetaHuman's skeletal structure is preserved
4. Garments can be simulated on the MetaHuman and sent back to Unreal Engine via LiveSync

## Avatar Editor

CLO 3D's Avatar Editor allows body customization without importing a new mesh:

### Body Size Adjustment
- Overall height
- Body proportions (shoulder width, chest depth, etc.)

### Measurement Adjustment
- Chest circumference
- Waist circumference
- Hip circumference
- Neck circumference
- Arm length
- Leg length
- Inseam
- Shoulder width

These measurements update the avatar mesh in real-time, allowing you to create a custom body that matches specific model measurements without needing a 3D body scan.

### Arrangement Points

Arrangement points are predefined positions on the avatar where pattern pieces snap before simulation. They're essential for efficient garment assembly.

To use arrangement points:
1. Select a pattern piece in the 2D window
2. Click **Show Arrangement Points** in the 3D toolbar
3. Blue dots appear on the avatar
4. Click a point to snap the pattern piece to that position

Standard arrangement points include:
- Shoulder (left/right) — for shirts, jackets, sleeves
- Chest — for tops
- Waist (front/back) — for pants, skirts
- Hip — for lower garments
- Neck — for collars, hoods

### Customizing Arrangement Points

For custom avatars, arrangement points may need adjustment:
1. Open the Avatar Editor
2. Go to the Arrangement tab
3. Select an arrangement point
4. Adjust its X, Y, Z position
5. Add new points if needed

## Dressing Workflow

### Step 1: Prepare the Avatar

1. Load or import the correct avatar
2. Verify body measurements match the target size
3. Check that the avatar is in the correct pose
4. Ensure arrangement points are correctly positioned

### Step 2: Position Pattern Pieces

1. Turn off simulation
2. Use arrangement points to snap each pattern piece to its approximate position
3. Manually adjust positions in the 3D window as needed
4. Ensure pattern pieces are oriented correctly (not inside the body)

### Step 3: Sew

1. Use Segment Sewing (N) to connect pattern pieces
2. Check that directional notches are aligned
3. Verify all seams are correct before simulating

### Step 4: Simulate

1. Turn on simulation at low resolution (particle distance 15-20)
2. Let the garment settle on the avatar
3. Watch for clipping, floating, or misaligned seams
4. Turn off simulation to adjust pattern positions if needed

### Step 5: Refine Fit

1. Increase simulation resolution (particle distance 5-8)
2. Use the **Tension Map** view to identify strain points
   - Red areas: fabric is stretched (too tight)
   - Blue areas: fabric is compressed (too loose)
   - Green/white: normal tension
3. Adjust pattern dimensions based on tension map feedback
4. Re-simulate after each adjustment

## Fit Verification

### Tension Map Analysis

The tension map is CLO 3D's most powerful fit verification tool. It shows where the garment is under stress:

- **Red/yellow areas**: The fabric is being stretched beyond its natural state. The garment is too tight in these areas. Add ease or increase the pattern dimension.
- **Blue areas**: The fabric is compressed or floating. The garment is too loose. Reduce ease or decrease the pattern dimension.
- **Green/white areas**: Normal tension. The garment fits correctly.

We check the tension map at these key areas:
- Armhole/sleeve cap
- Chest/bust
- Waist
- Hip
- Shoulder seam
- Crotch seam

### Measurement Verification

After simulation, verify key measurements:
1. Create POM (Point of Measurement) points on the garment
2. Compare simulated measurements against the spec sheet
3. Check that ease allowances are correct:
   - Blouse/shirt: 5-10 cm ease at chest
   - Fitted dress: 3-5 cm ease at chest
   - Pants: 2-4 cm ease at waist, 4-6 cm at hip
   - Coat: 10-15 cm ease at chest

### Layer Fit Check

For multi-layer garments:
1. Simulate the base layer (e.g., shirt)
2. Freeze or lock the base layer
3. Add the next layer (e.g., jacket)
4. Enable layer collision
5. Simulate the outer layer
6. Check that layers don't clip through each other
7. Verify the outer layer has enough ease to accommodate the inner layer

## Common Fit Issues

### Garment Clips Through Body

- Increase the avatar's collision offset
- Reduce fabric stretch
- Increase simulation quality (lower particle distance)
- Check that the pattern isn't too small for the body

### Garment Floats Away from Body

- Increase fabric density (heavier fabric falls closer)
- Reduce bending stiffness (softer fabric conforms better)
- Check arrangement points — garment may be starting too far from body
- Verify the pattern has appropriate ease

### Sleeves Are Too Tight

- Check the sleeve cap ease (should be 2-4 cm larger than the armhole)
- Increase the sleeve width at the bicep
- Reduce fabric bending stiffness
- Check that the armhole isn't too small

### Pants Pull at Crotch

- Increase crotch depth in the pattern
- Add more ease at the hip
- Check that the inseam and outseam lengths match
- Verify the crotch curve shape follows the body

### Collar Doesn't Sit Flat

- Check the collar pattern dimensions against the neck circumference
- Adjust the collar stand height
- Verify the collar fall weight (heavier fabric falls more naturally)
- Increase collar curve to match the neckline curve

## Summary

The avatar is the foundation of garment fitting in CLO 3D. For production work, use a custom avatar that matches the target body exactly — either a 3D body scan or a standard avatar adjusted to the correct measurements. Use arrangement points for efficient pattern positioning, then simulate iteratively from low to high resolution. The tension map is the most valuable fit verification tool — red areas need more ease, blue areas need less. Always verify POM measurements against the spec sheet after simulation. For multi-layer garments, simulate each layer sequentially with collision enabled. The combination of correct avatar setup, arrangement point positioning, tension map analysis, and POM verification ensures production-accurate fit.
