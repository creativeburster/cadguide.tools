---
title: "FeatureCAM Automatic Feature Recognition: From Solid Model to NC Program Workflow"
excerpt: "Use FeatureCAM Automatic Feature Recognition (AFR) to automatically identify faces, holes, pockets, and side features from 3D CAD models, then generate toolpaths and NC code."
category: "workflow"
softwareSlug: "featurecam"
keyword: "featurecam automatic feature recognition AFR solid model"
slug: "featurecam-automatic-feature-recognition-solid-model-nc-workflow"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://help.autodesk.com/cloudhelp/2018/CHS/FCAM/files/GUID-C2FF3B8A-5B9B-4DBC-BED0-B37C26B0C318.htm"
  - "https://www.autodesk.com/learn/ondemand/module/featurecam-getting-started-standard-milling"
---

# FeatureCAM Automatic Feature Recognition: From Solid Model to NC Program Workflow

FeatureCAM's standout feature is Automatic Feature Recognition (AFR) — the ability to analyze a 3D solid model and automatically identify machinable features like faces, holes, pockets, and sides. This dramatically reduces programming time compared to manually selecting geometry for each operation. Let us walk through the complete workflow.

## The FeatureCAM Workflow

The standard workflow in FeatureCAM follows these steps:

1. **Import the CAD model** (STEP, IGES, or native CAD format)
2. **Define stock** — the raw material dimensions
3. **Set the coordinate system** — origin and orientation
4. **Run Automatic Feature Recognition** — identify all machinable features
5. **Review and adjust features** — modify, add, or remove as needed
6. **Generate toolpaths** — FeatureCAM automatically selects tools and strategies
7. **Simulate** — verify the machining process
8. **Post process** — generate NC code

## Step 1: Import the CAD Model

1. Go to **File > Open** and select your CAD file
2. FeatureCAM supports STEP, IGES, Parasolid, and SolidWorks files
3. Verify the model orientation — Z-up is standard for milling
4. Check that the model is a solid (not just surfaces) for best AFR results

## Step 2: Define Stock

1. Go to **Setup > Stock**
2. Choose stock type:
   - **Rectangular** — standard block
   - **Cylindrical** — for lathe parts
   - **From model** — auto-sized to the part bounding box
3. Add 3-5mm (0.125-0.25 inch) extra on each side
4. Set the stock origin to match your machine setup

## Step 3: Set the Coordinate System

1. Go to **Setup > Coordinate System**
2. Define the origin location — typically the top center or top-left corner
3. Set the orientation — X, Y, Z directions
4. This coordinate system determines where the tool starts and how the part is positioned on the machine

## Step 4: Run Automatic Feature Recognition

1. Go to **Home tab > Part Program panel > AFR**
2. The AFR wizard opens
3. Select the solid model to analyze
4. Choose which feature types to recognize:
   - **Faces** — flat surfaces to machine
   - **Holes** — circular holes (drilling, boring, tapping)
   - **Pockets** — enclosed recessed areas
   - **Sides** — vertical walls and profiles
   - **Steps** — rectangular shoulders
5. Click **Next** and AFR analyzes the model
6. Review the recognized features — they appear in the feature tree

### What AFR Detects

For a typical prismatic part, AFR will identify:
- **Face features** — top surface, flat areas
- **Hole features** — through holes, blind holes, tapped holes
- **Pocket features** — rectangular and circular pockets
- **Side features** — outer profile, stepped sides

Each feature is automatically assigned:
- **Tooling** — appropriate tools from the tool library
- **Operations** — roughing, finishing, drilling cycles
- **Speeds and feeds** — based on material and tool data

## Step 5: Review and Adjust Features

AFR is good but not perfect. After recognition:

1. **Check the feature tree** — all recognized features are listed
2. **Verify feature dimensions** — click each feature to see its parameters
3. **Modify features** — change hole depths, pocket widths, or face heights
4. **Add missing features** — use Interactive Feature Recognition (IFR) for features AFR missed
5. **Delete unwanted features** — remove features you don't want to machine
6. **Reorder operations** — drag features in the tree to change machining order

### Handling Clamps and Fixtures

FeatureCAM can distinguish between the part and clamping fixtures:

1. Import the clamp/fixture models alongside the part
2. Right-click each fixture solid and select **"Use as clamp"**
3. When AFR runs, it ignores the clamp solids
4. During simulation, the clamps are visible for collision detection

This feature prevents AFR from creating toolpaths that would hit clamps or vises.

## Step 6: Generate and Review Toolpaths

1. Click **Generate** in the feature tree
2. FeatureCAM creates toolpaths for all features automatically
3. Review each operation:
   - **Tool selection** — verify the right tool is used
   - **Speeds and feeds** — check against your material recommendations
   - **Operation order** — ensure roughing happens before finishing
4. Adjust any operations that need changes

## Step 7: Simulation

1. Go to **Simulate > 3D Simulation**
2. The simulation shows material removal in real-time
3. Check for:
   - **Gouges** — tool cutting into finished surfaces
   - **Collisions** — tool hitting clamps or stock
   - **Rapid moves through material** — dangerous and should be corrected
4. Use the step-by-step mode to examine specific operations

## Step 8: Post Process

1. Go to **Home > NC Code**
2. Select the post processor for your machine
3. Choose the output file location
4. Click **Generate** to create the NC code
5. Review the G-code before sending to the machine

## Interactive Feature Recognition (IFR)

When AFR doesn't recognize a feature correctly, use IFR:

1. Go to **Home > IFR**
2. Select the faces or edges that define the feature
3. Choose the feature type (hole, pocket, side, etc.)
4. IFR creates the feature from the selected geometry

IFR gives you more control than AFR but requires manual selection. It's useful for:
- Features that AFR missed
- Features with non-standard geometry
- Features that need specific machining strategies

## Best Practices

- **Use AFR first, then IFR** — let AFR do the bulk work, then add missed features manually
- **Mark clamps as fixtures** — prevents AFR from creating toolpaths into clamping areas
- **Review all features** — don't trust AFR blindly; verify dimensions and operations
- **Set up the tool library** — AFR uses the tool library to select tools; ensure it's complete
- **Save feature templates** — for similar parts, save the feature setup as a template
- **Use the Step Through mode** in simulation to verify each operation individually
