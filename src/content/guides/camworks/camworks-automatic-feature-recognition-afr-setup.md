---
title: "CAMWorks Automatic Feature Recognition: Setup and Tuning for Production"
excerpt: "How to configure CAMWorks AFR (Automatic Feature Recognition) for reliable pocket, hole, and profile detection — covering recognition rules, tolerance settings, and handling ambiguous geometry."
category: "workflow"
softwareSlug: "camworks"
keyword: "camworks automatic feature recognition afr setup"
slug: "camworks-automatic-feature-recognition-afr-setup"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://camworks.com/why-camworks/"
  - "https://www.goengineer.com/videos/camworks-and-solidworks-cam-using-feature-recognition"
---

# CAMWorks Automatic Feature Recognition: Setup and Tuning for Production

CAMWorks' AFR (Automatic Feature Recognition) is the reason most shops buy it. Click one button and every pocket, hole, and profile on the part is detected and assigned a machining operation. In practice, AFR is 80% automatic and 20% manual cleanup. Here's how to get that 80% reliable.

## How AFR Works

AFR analyzes the solid model's topology — faces, edges, and vertices — and identifies geometric patterns that match machinable features:

- **Cylindrical depressions** → Holes (with sub-types: simple, counterbore, countersink, tapped)
- **Rectangular depressions** → Pockets (with or without islands)
- **Outer edges** → Profiles
- **Planar recessed faces** → Face features (for facing operations)

AFR then assigns a default machining operation to each feature based on your Technology Database settings.

## Step 1: Configure the Technology Database

The Tech DB is where AFR gets its machining parameters. Before running AFR for the first time:

1. Go to **CAMWorks** → **Technology Database**.
2. Set up the following sections:

### Stock Definition
- Default stock type: Rectangular block
- Default stock allowance: 2mm per side

### Machine Definition
- Select your machine (mill, lathe, mill-turn)
- Set spindle speed range, feed rate range, and tool change time

### Tool crib
- Populate with your actual shop tools (diameter, flute length, holder)
- Organize by tool type (end mills, drills, taps, reamers)

### Operation Parameters
For each feature type, define default parameters:

**Holes:**
| Hole Type | Operation | Default Tool | Speed | Feed |
|-----------|-----------|-------------|-------|------|
| Simple ≤ 6mm | Drilling | Center drill + twist drill | 3000 RPM | 100 mm/min |
| Simple > 6mm | Drilling + Boring | Drill + boring bar | 2000 RPM | 80 mm/min |
| Counterbore | Drilling + Counterbore | Drill + counterbore tool | 2500 RPM | 120 mm/min |
| Tapped M6 | Drilling + Tapping | #5 drill + M6 tap | 500 RPM | 500 mm/min |

**Pockets:**
| Pocket Type | Operation | Default Tool | Stepover | Stepdown |
|-------------|-----------|-------------|----------|----------|
| Rectangular | Rough Mill | 10mm end mill | 50% | 2mm |
| Circular | Rough Mill | 10mm end mill | 50% | 2mm |
| With islands | Rough Mill + Finish | 8mm end mill | 40% | 1mm |

### Material Parameters
For each material you machine:
- Cutting speed (SFM or m/min)
- Feed per tooth (mm/tooth)
- Depth of cut recommendations

These parameters auto-populate when AFR assigns operations, eliminating manual parameter entry.

## Step 2: Run AFR

1. Open the solid model in CAMWorks (within SolidWorks or as a standalone STEP import).
2. Click **AFR** (Automatic Feature Recognition) on the CAMWorks tab.
3. AFR scans the model and displays found features in the CAMWorks feature tree.
4. Review the features:

### What AFR Detects Correctly (90%+ accuracy)
- Simple through holes
- Blind holes with flat bottoms
- Standard counterbored holes
- Rectangular pockets with flat bottoms
- Outer profiles (closed loops)

### What AFR Struggles With (50-80% accuracy)
- Non-standard hole shapes (hexagonal, square)
- Pockets with curved bottoms
- Tapered pockets (draft angles)
- Partial features (open pockets that don't fully enclose)
- Very small features (< 0.5mm)

## Step 3: Review and Clean Up

After AFR runs, go through the feature tree:

### Delete Unwanted Features
- Cosmetic features (text engravings, logos) that you don't need to machine
- Features that AFR detected incorrectly (e.g., a fillet detected as a pocket)

### Add Missing Features Manually
1. Right-click **Features** → **Insert Feature**.
2. Select the feature type (pocket, hole, profile).
3. Select the geometry (edges, faces) that define the feature.
4. Assign a machining operation.

### Adjust Feature Parameters
Right-click a feature → **Edit Parameters**:
- **Depth**: Verify AFR detected the correct depth
- **Stock allowance**: Adjust if different from default
- **Chamfer/fillet**: Add if AFR missed them

## Step 4: Generate Toolpaths

1. Click **Generate Operation Plan** — CAMWorks creates operations for all features.
2. Click **Generate Toolpath** — CAMWorks calculates toolpaths for all operations.
3. Review each operation in the simulation.

## Step 5: Auto-Sequence

CAMWorks can optimize the machining order:

1. Right-click **Machining** → **Reorder Operations**.
2. Set rules:
   - **Minimize tool changes**: Group operations by tool
   - **Top-down**: Machine from highest Z to lowest
   - **Rough before finish**: All roughing operations before all finishing
3. Click **Apply**.

## Tuning AFR for Better Results

### Tolerance Settings

In AFR settings → **Tolerances**:
- **Hole diameter tolerance**: 0.01mm (default). Increase to 0.05mm if AFR misses holes that are slightly non-circular.
- **Pocket depth tolerance**: 0.1mm. Increase if AFR detects very shallow pockets you don't want to machine.
- **Minimum feature size**: 0.5mm. Set higher (2mm) to ignore small features that aren't worth machining.

### Recognition Rules

In AFR settings → **Rules**:
- **Detect tapped holes**: Enable if your models include thread definitions. AFR assigns drilling + tapping operations.
- **Detect counterbores**: Enable. AFR assigns drilling + counterboring.
- **Merge adjacent pockets**: Enable if your model has pockets separated by thin walls that should be machined as one.
- **Detect open profiles**: Disable if you only want closed profiles (prevents false positives on partial edges).

### Handling Ambiguous Geometry

Some features are ambiguous — AFR may interpret them differently than intended:

**A slot that could be a pocket or a profile**: If AFR detects it as a pocket but you want to machine it as a profile (open on one end):
1. Delete the pocket feature.
2. Insert a profile feature manually.
3. Select the slot edges as the profile geometry.

**A counterbored hole detected as two separate holes**: AFR sometimes detects the counterbore and the through-hole as separate features. Merge them:
1. Select both hole features.
2. Right-click → **Merge**.
3. The merged feature is treated as a counterbored hole.

## Best Practices for AFR-Ready Models

If you control the CAD model creation:
- Use standard hole features (SolidWorks Hole Wizard) — AFR recognizes these perfectly
- Avoid cosmetic fillets on pocket edges — they confuse AFR
- Use simple rectangular pockets when possible — complex pocket shapes reduce AFR accuracy
- Define threads in the CAD model — AFR can detect thread size and assign the correct tap
