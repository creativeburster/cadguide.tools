---
title: "Cimatron Mold Design: QuickSplit Parting, Core/Cavity Separation, and Active Part Workflow"
excerpt: "How to use Cimatron Mold Design for core/cavity separation — covering QuickSplit for draft angle analysis, parting line and parting surface creation, solid-based analysis, and active part generation for mold manufacturing."
category: "workflow"
softwareSlug: "cimatron"
keyword: "cimatron mold design quicksplit parting core cavity active part"
slug: "cimatron-mold-design-quicksplit-parting-core-cavity-active-part"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-07-09"
sources:
  - "https://help.cimatron.com/en/2026/quick_split.htm"
  - "https://help.cimatron.com/en/2026/Tips_and_Tricks.htm"
---

# Cimatron Mold Design: QuickSplit Parting, Core/Cavity Separation, and Active Part Workflow

Cimatron Mold Design is purpose-built for injection mold tooling. We've used it for consumer electronics, automotive trim, and medical device molds. The QuickSplit tool is the heart of the workflow — it automatically separates part faces into core and cavity directions based on draft angles. When it works, it's fast. When the part has complex geometry, you need to know how to guide it. Here's our complete mold design workflow.

## Understanding Cimatron Mold Design

Cimatron Mold Design is an integrated environment for:
- **Part analysis**: Draft angle checking, undercut detection
- **Parting**: Core/cavity separation using QuickSplit
- **Parting surfaces**: Creating surfaces that separate mold halves
- **Active parts**: Generating solid core and cavity inserts
- **Mold assembly**: Adding ejectors, cooling, sliders, and standard components
- **Electrode design**: Creating EDM electrodes for deep features

## Step 1: Import the Part

1. Open Cimatron and create a new Mold Design project.
2. Import the plastic part:
   - **STEP, IGES, Parasolid, or native Cimatron** format
3. Position the part:
   - **Z-axis**: Typically the mold opening direction
   - **Part orientation**: Align the parting line perpendicular to Z
4. Set the **Mold UCS**:
   - The Mold UCS defines the coordinate system for the mold
   - Z-axis is the opening direction
   - If the UCS is wrong, use the **Work CS** function to reorient

### Part Preparation

Before parting:
1. **Check for draft angles** — all faces should have adequate draft (typically 1-3°)
2. **Check for undercuts** — faces that can't be molded in the primary opening direction
3. **Check for sharp corners** — add fillets where needed for mold manufacturing
4. **Check wall thickness** — ensure uniform thickness to prevent warping

## Step 2: Run QuickSplit

QuickSplit is the core parting tool. It analyzes the part geometry and assigns each face to a split direction (core, cavity, or slider).

1. Go to **Parting** → **QuickSplit**.
2. Configure split directions:
   - **Primary direction**: Z-up (cavity side)
   - **Secondary direction**: Z-down (core side)
   - **Additional directions**: For sliders and lifters (if needed)
3. Set the **Draft Angle**:
   - Default: 1° (faces with < 1° draft are flagged as undercut)
   - Adjust based on part requirements (0.5° for precision, 3° for textured parts)
4. Click **Execute**.
5. QuickSplit assigns faces to split direction sets:
   - **Cavity set**: Faces visible from the cavity direction
   - **Core set**: Faces visible from the core direction
   - **Unassigned**: Faces that can't be assigned (undercuts)

### Solid-Based Analysis

Cimatron supports **solid-based analysis** which uses topology information from both closed and open solids:

1. In QuickSplit, select **Solid-Based Analysis** mode.
2. Benefits:
   - **Handles open solids** — doesn't require watertight geometry
   - **Uses adjacent surface information** — more accurate assignment
   - **Identifies faults** — detects gaps and mismatches in the solid
   - **Faster parting** — reduces manual face assignment

### Analyzing Unassigned Faces

After QuickSplit, check unassigned faces:

1. **Undercuts**: Faces that require a slider or lifter
   - Add a new split direction for the slider
   - Re-run QuickSplit with the additional direction
2. **Vertical faces**: Faces with exactly 0° draft
   - Add draft to the part (if possible)
   - Or manually assign to core or cavity
3. **Problematic geometry**: Gaps, self-intersections, or non-manifold edges
   - Fix the geometry in the part
   - Or use manual face assignment

## Step 3: Create the Parting Line

The parting line separates core and cavity faces:

1. After QuickSplit, the parting line appears at the boundary between core and cavity sets.
2. Review the parting line:
   - **Is it planar?** — a planar parting line is simplest
   - **Are there steps?** — stepped parting lines need parting surfaces
   - **Are there free-form sections?** — may require complex parting surfaces
3. Edit the parting line if needed:
   - **Add segments**: Manually add parting line segments
   - **Remove segments**: Remove unwanted segments
   - **Smooth**: Smooth the parting line for better parting surfaces

### Parting Line Best Practices

- **Keep it as simple as possible** — planar parting lines are easiest to manufacture
- **Avoid complex 3D parting lines** — increases mold cost and maintenance
- **Position at the largest cross-section** — ensures the part releases from the mold
- **Consider part appearance** — the parting line leaves a visible mark on the part

## Step 4: Create Parting Surfaces

Parting surfaces extend from the parting line to the mold boundary:

1. Go to **Parting** → **Parting Surface**.
2. Select the parting line.
3. Choose the extension method:
   - **Planar**: Extend horizontally from the parting line
   - **Stepped**: Create stepped surfaces for non-planar parting lines
   - **Free-form**: Create custom surfaces for complex parting lines
4. Set the extension distance — must extend beyond the mold insert boundary.
5. Generate the parting surfaces.

### Parting Surface Quality Check

Use the **Analyze by Parting Surface Part** mode:
1. This checks that parting faces match their corresponding QuickSplit directions.
2. Identifies places where parting surfaces are incomplete.
3. If the check is successful, the active skin (QuickSplit faces + parting surfaces) is watertight.

### Common Parting Surface Issues

**Gaps in the parting surface**: The surface doesn't fully enclose the part. Fix:
1. Check the parting line for gaps
2. Extend the parting surface further
3. Add manual surfaces to close gaps

**Parting surface intersects the part**: The surface crosses the part geometry. Fix:
1. Adjust the parting line position
2. Use a stepped parting surface instead of planar
3. Modify the part to eliminate the interference

## Step 5: Generate Active Parts (Core and Cavity)

Active parts are the solid mold inserts:

1. Go to **Assembly** → **Active Parts** → **Create**.
2. Cimatron creates solid active parts from:
   - **QuickSplit faces**: Core and cavity face sets
   - **Parting surfaces**: The surfaces separating core and cavity
3. The active skin (joined QuickSplit faces and parting surfaces) must be watertight.
4. If the skin is watertight, Cimatron creates solid inserts automatically.
5. If not watertight, fix the gaps before generating active parts.

### Verifying Active Parts

1. Check the core insert:
   - All core faces are present
   - No missing or extra geometry
   - The parting surface forms the top of the insert
2. Check the cavity insert:
   - All cavity faces are present
   - No missing or extra geometry
   - The parting surface forms the bottom of the insert
3. Check the parting surface contact:
   - Core and cavity inserts meet at the parting surface
   - No gap or overlap between inserts

## Step 6: Add Mold Components

### Ejector Pins

1. Go to **Mold Design** → **Add Mold Component** → **Ejector**.
2. Select the ejector type and size from the catalog.
3. Place ejectors on the part:
   - **Near ribs and bosses** — these shrink onto the core and need ejection
   - **On flat surfaces** — distribute ejection force evenly
   - **Avoid visible surfaces** — ejector marks are visible on the part
4. For different ejector lengths or types, add each type separately using the **Apply** button.

### Cooling Channels

1. Go to **Mold Design** → **Cooling** → **Cooling Channel**.
2. Draw the cooling channel sketch:
   - **Straight channels**: Through the mold plates
   - **3D channels**: Use a composite curve for conformal cooling
3. Configure:
   - **Diameter**: Typically 6-10mm
   - **Drill extension**: Extend beyond the last turn for manufacturing
   - **Drilled/Flat bottom**: Choose based on manufacturing method
4. The cooling channel automatically cuts through the mold plates and inserts.

### Cooling Best Practices

- **Create cooling after ejectors and screws** — use Visual Analysis to check for conflicts
- **Design cooling in one instance only** — channels are created in all instances
- **For different cooling per cavity**, use **Save As** before adding channels
- **Use 3D composite curves** for conformal cooling around complex geometry

### Sliders and Lifters

1. Go to **Mold Design** → **Add Slider/Lifter**.
2. Select the slider type from the catalog.
3. Define the slider direction (the direction the slider moves during mold opening).
4. The slider cuts through the mold plates automatically.

### Pocket Creation

1. Go to **Mold Design** → **Pocket**.
2. Pockets are automatically created for:
   - **Ejector pins**: Through the core insert and plates
   - **Cooling channels**: Through all affected plates
   - **Sliders**: Through the mold plates
3. If pocket creation fails:
   - **"Unknown pocket type"**: Select only horizontal faces that define the insert boundaries
   - **Associative problems**: Go to the assembly cut operation, edit and approve

## Step 7: Multi-Cavity Layouts

For multi-cavity molds:

### Instance Method (Same Parts)
- All cavities use the same data
- Operations done in one cavity automatically apply to all
- Use when all cavities are identical

### Save As Method (Different Parts)
- Each cavity has independent data
- Operations done in one cavity don't affect others
- Use when cavities have different components or cooling

## Step 8: Export for Manufacturing

1. **Export active parts**: Export core and cavity inserts as STEP or Parasolid for CNC machining.
2. **Export electrodes**: Create EDM electrodes for deep features that can't be milled.
3. **Export drawings**: Create mold assembly drawings with BOM.
4. **Export NC code**: Use Cimatron NC for toolpath generation.

## Best Practices

- **Run QuickSplit with solid-based analysis** — faster and more accurate
- **Check draft angles before parting** — insufficient draft causes parting problems
- **Keep the parting line simple** — planar parting lines are cheapest to manufacture
- **Verify the active skin is watertight** — gaps prevent solid active part generation
- **Create cooling after ejectors** — use Visual Analysis to check for conflicts
- **Don't add different ejectors in one step** — use the Apply button for each type
- **Use Instance for identical cavities** — saves time and ensures consistency
- **Check the Mold UCS orientation** — wrong orientation causes export problems
- **Test the parting with a simple part first** — learn the workflow before tackling complex parts
