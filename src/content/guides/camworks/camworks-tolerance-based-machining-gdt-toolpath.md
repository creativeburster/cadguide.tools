---
title: "CAMWorks Tolerance-Based Machining: Linking GD&T to Toolpath Accuracy"
excerpt: "How to use CAMWorks Tolerance-Based Machining to automatically adjust toolpath strategies based on GD&T tolerances — covering tolerance analysis, machining strategy selection, and inspection point generation."
category: "standards"
softwareSlug: "camworks"
keyword: "camworks tolerance based machining gdt toolpath"
slug: "camworks-tolerance-based-machining-gdt-toolpath"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://camworks.com/tolerance-based-machining/"
  - "https://camworks.com/blog/machining-accuracy-in-cam-automation-with-tbm/"
---

# CAMWorks Tolerance-Based Machining: Linking GD&T to Toolpath Accuracy

CAMWorks Tolerance-Based Machining (TBM) reads GD&T tolerances from the SolidWorks model and adjusts toolpath strategies accordingly. Tight tolerance holes get boring operations instead of drilling. Flatness-toleranced surfaces get multiple finishing passes. We've been using TBM for a year and it eliminates the manual step of "looking at the drawing to decide what needs to be precise." Here's how it works.

## What TBM Does

Without TBM, AFR assigns the same default operation to all holes of the same size — regardless of tolerance. A ±0.1mm hole and a ±0.01mm hole both get a standard drilling operation.

With TBM:
- The ±0.1mm hole gets drilling (sufficient accuracy)
- The ±0.01mm hole gets drilling + boring (higher accuracy)
- The decision is automatic, based on the GD&T tolerance in the model

## Step 1: Ensure GD&T Is in the Model

TBM only works if tolerances are defined in the SolidWorks model:

1. In SolidWorks, use **DimXpert** or **MBD (Model-Based Definition)** to apply GD&T:
   - Hole tolerances (diameter ±)
   - Surface tolerances (flatness, cylindricity)
   - Position tolerances (true position)
   - Profile tolerances

2. For each tolerance, define the tolerance zone and datum references.

3. Without GD&T in the model, TBM has nothing to read — it falls back to default operations.

## Step 2: Configure Tolerance Rules

In the Tech DB → **Tolerance-Based Machining**:

### Hole Tolerance Rules

| Tolerance Range | Operation Strategy |
|----------------|-------------------|
| ±0.5mm or looser | Drilling only |
| ±0.1mm to ±0.5mm | Drilling + reaming |
| ±0.05mm to ±0.1mm | Drilling + boring |
| ±0.01mm or tighter | Drilling + fine boring |

### Surface Tolerance Rules

| Flatness Tolerance | Finishing Strategy |
|--------------------|--------------------|
| 0.5mm or looser | Single finish pass |
| 0.1mm to 0.5mm | Two finish passes (semi + finish) |
| 0.05mm to 0.1mm | Three passes (rough + semi + finish) |
| 0.01mm or tighter | Three passes + spring pass |

### Position Tolerance Rules

| True Position | Strategy |
|---------------|----------|
| ±0.5mm or looser | Standard drilling |
| ±0.1mm to ±0.5mm | Spot drill + drilling |
| ±0.05mm or tighter | Spot drill + boring (boring positions more accurately than drilling) |

## Step 3: Run AFR with TBM

1. Click **AFR** — CAMWorks detects features as usual.
2. AFR reads GD&T tolerances from each feature.
3. TBM applies the tolerance rules to select operations:
   - A hole with ±0.02mm tolerance → drilling + boring (not just drilling)
   - A surface with 0.02mm flatness → three finishing passes
4. The operation plan reflects tolerance-aware strategies.

## Step 4: Review TBM Decisions

In the CAMWorks feature tree, each operation shows the tolerance that drove the strategy:

- **Hole 1**: Ø10 ±0.1 → Drilling + Reaming (tolerance-driven)
- **Hole 2**: Ø10 ±0.02 → Drilling + Boring (tolerance-driven)
- **Surface 1**: Flatness 0.05 → 3-pass finishing (tolerance-driven)

If you disagree with a TBM decision, override it:
1. Right-click the operation → **Edit**.
2. Change the operation type (e.g., from boring back to reaming).
3. The override is preserved — TBM won't change it on regeneration.

## Step 5: Inspection Point Generation

TBM can generate inspection points for CMM (Coordinate Measuring Machine):

1. Go to **Output** → **Inspection Report**.
2. TBM identifies features with GD&T and generates:
   - **Inspection coordinates**: X, Y, Z positions to probe
   - **Tolerance values**: The acceptable range for each measurement
   - **Datum references**: Which surfaces to use as measurement datums
3. Export as DMIS (CMM programming language) or PDF inspection report.

This links the CAD model → CAM → CMM inspection in a single tolerance-driven pipeline.

## Benefits of TBM

### Reduced Scrap

Before TBM, programmers might miss a tight tolerance on a hole and just drill it. The part passes visual inspection but fails CMM. With TBM, the tight tolerance is automatically detected and the correct operation is assigned.

### Consistent Quality

Every programmer gets the same result for the same tolerance — the Tech DB rules are standardized. No more "Programmer A bored the hole but Programmer B just drilled it."

### Faster Programming

No need to manually cross-reference the drawing for tolerances. TBM reads them from the model and applies the right strategy automatically.

### Audit Trail

TBM documents which tolerance drove which operation. If a part fails inspection, you can trace back: "The hole was ±0.02mm, TBM assigned drilling + boring, the boring operation was run at 2000 RPM with a 0.05mm feed — the issue was tool wear, not programming."

## Limitations of TBM

**Requires GD&T in the model**: If your customers send models without GD&T (just nominal dimensions), TBM has nothing to work with. You'll need to add tolerances manually or fall back to default operations.

**Only works with SolidWorks MBD/DimXpert**: TBM reads GD&T from SolidWorks' native tolerance annotation. Imported STEP files don't carry GD&T (even with STEP AP242 PMI — support varies).

**Doesn't handle all GD&T types**: TBM supports size tolerances (±), position, and flatness. It doesn't yet handle:
- Runout tolerances
- Profile of a surface
- Concentricity

For unsupported GD&T types, TBM falls back to default operations.

## Best Practices

1. **Standardize GD&T in your models**: Use consistent tolerance annotation so TBM can read it reliably.
2. **Review TBM rules quarterly**: As your tooling and machines improve, you may be able to achieve tighter tolerances with simpler operations.
3. **Train your CAD team**: TBM only works if the model has GD&T. Educate your designers on the importance of adding tolerances to the model, not just the drawing.
4. **Use overrides sparingly**: If you frequently override TBM decisions, the rules need adjustment. Update the Tech DB rules rather than overriding on every part.
