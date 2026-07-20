---
title: "CADWorx to CAESAR II: Exporting Pipe Stress Analysis Models and Interpreting Results"
excerpt: "How to export CADWorx piping models to CAESAR II for stress analysis — covering export configuration, support placement, load case setup, interpreting stress results, and fixing common export errors that cause analysis failures."
category: "workflow"
softwareSlug: "cadworx"
keyword: "cadworx caesar ii export pipe stress analysis model results"
slug: "cadworx-caesar-ii-export-pipe-stress-analysis-model-results"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-07-08"
sources:
  - "https://aliresources.hexagon.com/cadworx-design/cadworx-frequently-asked-questions"
  - "https://aliresources.hexagon.com/cadworx-analysis-solutions/creating-project-specific-pipe-support-libraries"
---

# CADWorx to CAESAR II: Exporting Pipe Stress Analysis Models and Interpreting Results

CADWorx and CAESAR II are both Hexagon products, and the integration between them is one of the strongest reasons to choose the Hexagon ecosystem. I've exported hundreds of lines from CADWorx to CAESAR II for stress analysis. The export is usually smooth, but there are specific configuration steps and common pitfalls. Here's the complete workflow.

## Why Pipe Stress Analysis Matters

Every piping system must be analyzed for thermal expansion, weight, pressure, and other loads. CAESAR II performs:

- **Thermal stress analysis** — calculates stresses from thermal expansion/contraction
- **Weight analysis** — checks if supports can carry the pipe weight
- **Pressure analysis** — verifies pipe wall thickness is adequate
- **Seismic analysis** — evaluates response to earthquake loads
- **Wind analysis** — evaluates response to wind loads
- **Support loading** — calculates loads at each support point

Without stress analysis, a piping system may fail in service — causing leaks, ruptures, or equipment damage.

## Step 1: Prepare the CADWorx Model

Before exporting, the model must be properly configured:

### Add Pipe Supports

Stress analysis requires support points. Without supports, CAESAR II can't calculate loads.

1. Go to **CADWorx Plant** → **Support** → **Insert Support**.
2. Select support type:
   - **Rest**: Vertical support (prevents downward movement)
   - **Guide**: Lateral restraint (prevents horizontal movement)
   - **Anchor**: Fixed point (prevents all movement)
   - **Spring**: Variable spring hanger (allows vertical movement with resistance)
3. Place supports at:
   - **Equipment nozzles** — typically modeled as anchors or limited-displacement supports
   - **Regular intervals** — typically every 3-5 meters for horizontal pipe
   - **Direction changes** — near elbows and tees
   - **Valves and heavy components** — additional support for concentrated loads

### Configure Support Properties

For each support:

1. **Support type**: Rest, guide, anchor, spring
2. **Gap values**: For guides, specify the gap (typically 2-3mm)
3. **Spring settings**: For spring supports, select the spring type and hanger variety
4. **Stiffness**: For realistic analysis, specify support stiffness in each direction

### Verify Pipe Properties

1. Check pipe material — must be in the CAESAR II material database
2. Check pipe schedule — determines wall thickness for stress calculation
3. Check design temperature — critical for thermal expansion calculation
4. Check design pressure — used for pressure stress calculation

## Step 2: Configure the Export

1. Go to **CADWorx Plant** → **Analysis** → **Export to CAESAR II**.
2. The export dialog shows:
   - **Line selection**: Choose which pipe lines to export
   - **Model units**: Must match CAESAR II project units
   - **Coordinate system**: Verify coordinates are correct
   - **Support export**: Include supports in the export
   - **Equipment export**: Include equipment as rigid elements
3. Configure export options:
   - **Include insulation**: If present, insulation weight is included
   - **Include fluid weight**: The operating fluid's weight is added
   - **Include valves as rigid**: Valves are modeled as rigid elements with weight
   - **Include flanges as rigid**: Flanges are modeled as rigid elements

### Export Configuration Tips

- **Export one line at a time** — for complex systems, export each line separately for cleaner analysis
- **Match units** — CADWorx metric must match CAESAR II metric
- **Include all supports** — missing supports cause unrealistic analysis results
- **Verify material mapping** — ensure CADWorx materials map to CAESAR II materials

## Step 3: Export the Model

1. Select the line(s) to export.
2. Click **Export**.
3. CADWorx creates a CAESAR II input file (`.dat` or `.k` file).
4. The file contains:
   - **Geometry**: Node points and pipe segments
   - **Properties**: Pipe diameter, wall thickness, material
   - **Supports**: Support types and locations
   - **Loads**: Temperature, pressure, weight
   - **Equipment**: Rigid elements for equipment connections

### Common Export Errors

**Material not found in CAESAR II**: The CADWorx material doesn't exist in the CAESAR II database. Fix:

1. Check the material mapping in CADWorx.
2. Add the material to the CAESAR II material database.
3. Or substitute with an equivalent material in CAESAR II.

**Missing supports**: Supports weren't included in the export. Fix:

1. Verify supports were placed in CADWorx before exporting.
2. Check the export settings — ensure "Include supports" is enabled.
3. Add supports manually in CAESAR II if needed.

**Geometry errors**: The pipe route has zero-length segments or overlapping nodes. Fix:

1. Check the CADWorx model for errors — run model validation.
2. Remove any zero-length pipe segments.
3. Re-export after fixing.

**Unit mismatch**: CADWorx is in metric but CAESAR II is in imperial (or vice versa). Fix:

1. Ensure both systems use the same units.
2. Or configure the export to convert units.

## Step 4: Open in CAESAR II

1. Launch CAESAR II.
2. Open the exported file.
3. Review the model:
   - **Geometry**: Verify node points and pipe routing match the CADWorx model
   - **Supports**: Check that all supports are present and correctly typed
   - **Properties**: Verify pipe diameter, wall thickness, and material
   - **Loads**: Confirm temperature and pressure values

### Model Verification

1. **Visual check**: The CAESAR II model should look like the CADWorx model.
2. **Node count**: The number of nodes should match the number of pipe segments and supports.
3. **Support count**: Verify the number of supports matches.
4. **Material check**: Open the material database and verify the material properties.

## Step 5: Configure Load Cases

CAESAR II uses load cases to define analysis scenarios:

1. **Operating case**: Temperature + pressure + weight (the normal operating condition)
2. **Sustain case**: Pressure + weight (cold condition, no thermal expansion)
3. **Expansion case**: Temperature only (thermal expansion stresses)
4. **Hydrotest case**: Hydrotest pressure + water weight (no temperature)
5. **Seismic case**: Operating case + seismic loads
6. **Wind case**: Operating case + wind loads

### Load Case Setup

1. Go to **Load Cases** in CAESAR II.
2. Create each load case:
   - **Operating**: T1 (temperature) + P1 (pressure) + W (weight)
   - **Sustain**: P1 + W (no temperature)
   - **Expansion**: T1 (thermal only, calculated as Operating - Sustain)
   - **Hydrotest**: P2 (hydrotest pressure) + W2 (water weight)
3. Set the analysis type:
   - **Linear**: For simple analysis
   - **Nonlinear**: For systems with gaps, friction, or one-way supports

## Step 6: Run the Analysis

1. Go to **Analysis** → **Run All Load Cases**.
2. CAESAR II processes each load case.
3. Review the results:
   - **Stress ratio**: Percentage of allowable stress (must be < 100%)
   - **Support loads**: Forces and moments at each support
   - **Displacements**: Movement at each node point
   - **Code compliance**: Pass/fail per the applicable piping code (ASME B31.3, etc.)

## Step 7: Interpret Results

### Stress Results

For each load case, CAESAR II reports:

- **Maximum stress**: The highest stress in the system
- **Stress location**: Which pipe segment has the highest stress
- **Stress ratio**: Maximum stress / allowable stress (must be < 100%)
- **Code compliance**: Pass or fail per the piping code

If the stress ratio exceeds 100%:

1. **Add supports** — reduce the span between supports to lower bending stresses
2. **Add expansion loops** — absorb thermal expansion to reduce expansion stresses
3. **Change pipe schedule** — increase wall thickness to reduce stress
4. **Change material** — use a material with higher allowable stress
5. **Modify routing** — add flexibility by changing the pipe route

### Support Load Results

Check support loads against:

- **Support capacity** — can the support structure carry the load?
- **Equipment allowable loads** — are the loads at equipment nozzles within vendor limits?
- **Foundation capacity** — can the foundation carry the support loads?

If support loads are too high:

1. **Add more supports** — distribute the load
2. **Use spring supports** — absorb thermal expansion while supporting weight
3. **Redesign the support structure** — increase capacity

### Displacement Results

Check displacements for:

- **Excessive movement** — pipe moves too far, causing interference or fatigue
- **Lift-off** — pipe lifts off a rest support (indicates a design issue)
- **Equipment overload** — excessive movement at equipment nozzles

If displacements are excessive:

1. **Add guides** — restrain lateral movement
2. **Add anchors** — prevent movement entirely (use sparingly)
3. **Adjust spring supports** — change spring settings

## Step 8: Update the CADWorx Model

After stress analysis, update the CADWorx model with any changes:

1. **Add supports** identified by CAESAR II.
2. **Modify pipe routing** if expansion loops were added.
3. **Update support types** if rest supports were changed to springs.
4. **Re-export and re-analyze** to verify the changes resolved the issues.

### Iterative Process

Stress analysis is iterative:

1. Export to CAESAR II → Analyze → Find issues
2. Fix in CADWorx → Re-export → Re-analyze
3. Repeat until all load cases pass

## Best Practices

- **Place supports in CADWorx before exporting** — saves time in CAESAR II
- **Export one line at a time** — cleaner analysis, easier to troubleshoot
- **Verify material mapping** — wrong materials produce wrong results
- **Run all load cases** — don't skip seismic or wind if they apply
- **Check equipment nozzle loads** — compare to vendor allowable loads
- **Document stress analysis results** — keep records for compliance and audit
- **Update CADWorx after analysis** — keep the model and analysis in sync
- **Use the same units throughout** — unit conversion errors are common and dangerous
