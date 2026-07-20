---
title: "CADWorx Equipment and Vessel Modeling: Nozzles, Platforms, and Ladders"
excerpt: "How to model equipment in CADWorx Plant Professional — covering parametric vessel creation, nozzle placement and orientation, platform and ladder modeling, and connecting piping to equipment nozzles with correct end types."
category: "workflow"
softwareSlug: "cadworx"
keyword: "cadworx equipment vessel modeling nozzles platforms ladders"
slug: "cadworx-equipment-vessel-modeling-nozzles-platforms-ladders"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-08"
sources:
  - "https://aliresources.hexagon.com/cadworx-design/cadworx-frequently-asked-questions"
  - "https://aliresources.hexagon.com/cadworx-analysis-solutions/creating-project-specific-pipe-support-libraries"
---

# CADWorx Equipment and Vessel Modeling: Nozzles, Platforms, and Ladders

Equipment modeling in CADWorx is more capable than most people realize. I've modeled everything from simple pumps to complex distillation columns with platforms and ladders. The Equipment module is parametric — you define dimensions and it generates the 3D model. But getting nozzles right is critical, because if the nozzles are wrong, the piping connections will fail. Here's my complete equipment modeling guide.

## Understanding CADWorx Equipment

CADWorx Equipment is a parametric equipment modeling tool. It creates:

- **Vertical vessels** — columns, tanks, reactors
- **Horizontal vessels** — heat exchangers, separators, drums
- **Pumps** — centrifugal pumps with suction and discharge nozzles
- **Heat exchangers** — shell and tube exchangers
- **Custom equipment** — from imported 3D solids

Each equipment type has parametric dimensions — change a dimension and the model updates automatically.

## Step 1: Create a Vertical Vessel

1. Go to **CADWorx Plant** → **Equipment** → **Vertical Vessel**.
2. Configure parameters in the dialog:
   - **Diameter**: Vessel diameter
   - **Height**: Overall vessel height
   - **Head type**: Elliptical, hemispherical, flat, or conical
   - **Head dimensions**: Top and bottom head parameters
   - **Shell thickness**: For visual representation
   - **Material**: For BOM and properties
3. Click **Place** to insert the vessel in the model.
4. The vessel appears as a 3D solid with parametric dimensions.

### Vessel Configuration Tips

- **Match vendor datasheets** — use actual equipment dimensions, not estimates
- **Set head types correctly** — elliptical heads are most common for pressure vessels
- **Consider skirt vs. legs** — specify the support type (skirt, legs, or base plate)
- **Add insulation** — if the vessel has insulation, specify the thickness for accurate external dimensions

## Step 2: Add Nozzles to Equipment

Nozzles are the connection points between equipment and piping. Getting them right is critical.

1. Select the equipment in the model.
2. Right-click → **Add Nozzle** (or use the Equipment ribbon).
3. Configure the nozzle:
   - **Nozzle Tag**: e.g., N1, N2, INLET, OUTLET
   - **Nominal Size**: Must match the connecting pipe size
   - **End Type**: Typically FL (flanged) for equipment nozzles
   - **Pressure Class**: Must match the pipe spec (150#, 300#, etc.)
   - **Facing**: RF (Raised Face), FF (Flat Face), or RTJ (Ring Type Joint)
4. Specify the nozzle location:
   - **On shell**: Click on the vessel shell surface
   - **On head**: Click on the top or bottom head
   - **On bottom**: Click on the base
5. Set the nozzle orientation:
   - **Direction**: The nozzle should point away from the equipment
   - **Angle**: Rotate around the vessel axis
   - **Elevation**: Height on the vessel

### Nozzle Orientation

Nozzle direction is critical. The nozzle direction vector determines where the pipe will connect:

1. After placing the nozzle, check the direction arrow.
2. The arrow should point **outward** from the equipment surface.
3. Use the rotation grip to adjust the nozzle direction if needed.
4. For nozzles on the vessel top head, the direction should be upward.
5. For side nozzles, the direction should be horizontal, perpendicular to the vessel axis.

### Common Nozzle Errors

**Nozzle pointing inward**: The direction vector is reversed. The pipe will try to route into the vessel. Fix by rotating the nozzle 180°.

**Wrong nozzle size**: The nozzle size doesn't match the pipe. Fix by editing the nozzle and changing the nominal size.

**Wrong pressure class**: The nozzle class doesn't match the pipe spec. Fix by editing the nozzle and changing the pressure class. If the gasket and bolt set don't match, the connection will fail.

## Step 3: Create a Horizontal Vessel

1. Go to **CADWorx Plant** → **Equipment** → **Horizontal Vessel**.
2. Configure:
   - **Diameter**: Vessel diameter
   - **Length**: Tangent-to-tangent length
   - **Head type**: Elliptical, hemispherical, or flat
   - **Saddle supports**: Number, position, and dimensions
3. Click **Place** to insert.
4. Add nozzles on the top, sides, or ends of the vessel.

### Horizontal Vessel Tips

- **Saddle position matters** — one saddle is typically fixed, the other sliding. Model accordingly.
- **Nozzles on top** — for vents, relief valves, and instruments
- **Nozzles on sides** — for inlet/outlet connections
- **Nozzles on ends** — for dished head connections (less common)

## Step 4: Model a Pump

1. Go to **CADWorx Plant** → **Equipment** → **Pump**.
2. Select pump type:
   - **Centrifugal pump**: Most common
   - **Positive displacement pump**: For special applications
3. Configure:
   - **Casing dimensions**: Pump body size
   - **Baseplate dimensions**: Foundation mounting plate
   - **Suction nozzle**: Size, end type, position, direction
   - **Discharge nozzle**: Size, end type, position, direction
4. Click **Place** to insert.

### Pump Modeling Tips

- **Match the vendor pump curve** — use the actual pump model dimensions
- **Orient nozzles correctly** — suction typically horizontal, discharge typically vertical or top
- **Include the baseplate** — needed for foundation design
- **Add coupling guard** — for safety compliance visualization

## Step 5: Add Platforms and Ladders

For elevated vessels, platforms and ladders are essential for access and safety.

### Platforms

1. Select the vessel.
2. Right-click → **Add Platform** (or use the Equipment ribbon).
3. Configure:
   - **Elevation**: Height of the platform
   - **Type**: Circular (for vertical vessels) or rectangular
   - **Width**: Platform width (typically 900mm-1200mm)
   - **Shape**: Full circle, three-quarter, or half platform
   - **Orientation**: Which side of the vessel the platform faces
4. The platform is added to the vessel model.

### Ladders

1. Select the vessel.
2. Right-click → **Add Ladder**.
3. Configure:
   - **Start elevation**: Bottom of the ladder
   - **End elevation**: Top of the ladder (typically at a platform)
   - **Type**: Straight, with cages (for heights > 2m), or spiral
   - **Orientation**: Which side of the vessel the ladder is on
4. The ladder connects between platforms or from grade to the first platform.

### Platform and Ladder Tips

- **Space platforms at logical elevations** — at each nozzle that requires operator access
- **Include toe rails and handrails** — for safety compliance
- **Orient ladders away from pipe routing** — avoid conflicts between ladders and piping
- **Check OSHA requirements** — platform width, handrail height, ladder angle

## Step 6: Connect Piping to Equipment Nozzles

Once equipment with nozzles is in place:

1. Go to **CADWorx Plant** → **Pipe** → **Route**.
2. Start the route at the equipment nozzle.
3. Click on the nozzle — CADWorx matches:
   - **Pipe size** to nozzle size
   - **End type** to nozzle end type (typically FL)
   - **Pressure class** to nozzle class
4. CADWorx auto-inserts:
   - **Flange** — matching the nozzle flange
   - **Gasket** — matching pressure class and facing
   - **Bolt set** — matching pressure class and facing
5. Route the pipe from the nozzle.

### Connection Troubleshooting

**Pipe won't connect to nozzle**: Check:
1. The nozzle was created with CADWorx Equipment (not just drawn as geometry)
2. The nozzle size matches the pipe size
3. The nozzle end type is compatible with the pipe end type
4. The spec has the required flange, gasket, and bolt set

**Flange doesn't appear**: The spec is missing the flange, gasket, or bolt set. Add them in the Specification Editor.

**Wrong direction**: The nozzle direction is pointing the wrong way. Edit the nozzle and correct the direction.

## Step 7: Import Custom Equipment

For equipment that CADWorx can't create parametrically (compressors, packaged units):

1. Import a 3D solid model (STEP, IGES, SAT) into the drawing.
2. Go to **CADWorx Plant** → **Equipment** → **Convert to Equipment**.
3. Select the imported solid.
4. CADWorx creates an equipment object from the geometry.
5. Add nozzles at the pipe connection points.

### Custom Equipment Tips

- **Simplify the imported model** — remove internal components
- **Check units and scale** — imported models often come in different units
- **Add nozzles at flange faces** — not at pipe ends
- **Verify nozzle directions** — ensure all nozzles point outward

## Step 8: Generate Equipment Reports

1. Go to **Reports** → **Equipment List**.
2. Configure report format:
   - Equipment tag, type, dimensions
   - Nozzle list with sizes, ratings, and orientations
   - Platform and ladder list
3. Export to Excel or PDF.

### Nozzle Schedule

A nozzle schedule is essential for piping design:

1. Go to **Reports** → **Nozzle Schedule**.
2. The schedule lists:
   - Equipment tag
   - Nozzle tag (N1, N2, etc.)
   - Size, end type, pressure class
   - Orientation (angle and elevation)
   - Service (inlet, outlet, vent, drain)
3. Distribute to the piping team for routing reference.

## Best Practices

- **Model equipment before piping** — nozzles must exist before pipe routes can connect
- **Use vendor datasheets** — match actual equipment dimensions
- **Tag nozzles consistently** — N1, N2, N3 and document each nozzle's purpose
- **Include platforms and ladders** — for access and safety compliance
- **Generate a nozzle schedule** — distribute to the piping team
- **Check nozzle directions** — wrong directions cause pipe routing errors
- **Test pipe-to-nozzle connections early** — don't wait until the model is complete
- **Export IFC for coordination** — equipment models should be included in clash detection
