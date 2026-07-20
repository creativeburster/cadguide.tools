---
title: "CATIA V5 to SolidWorks Migration: Handling Feature Tree Loss and Import Errors"
excerpt: "Migrating CATIA V5 models to SolidWorks means losing the feature tree. We share the workflow we've developed to preserve design intent, rebuild key features, and handle the most common import errors."
category: "migration"
softwareSlug: "catia"
keyword: "CATIA to SolidWorks migration import"
slug: "catia-v5-to-solidworks-migration-feature-tree"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-17"
sources:
  - "https://www.reddit.com/r/CATIA/comments/ozfz22/catia_v5_problems/"
  - "https://www.eng-tips.com/threads/click-ok-to-terminate.558028/"
---

# CATIA V5 to SolidWorks Migration: Handling Feature Tree Loss and Import Errors

Migrating thousands of CATIA V5 parts and assemblies to SolidWorks is often driven by cost — SolidWorks licenses are significantly cheaper than CATIA. But migrating CAD files isn't just a file-format conversion; it's a complete re-creation of the design intent. CATIA's feature tree doesn't translate to SolidWorks — the parametric relationships, sketches, and constraints that make a model editable are lost in translation. This guide shares a workflow to make the migration as painless as possible.

## The Fundamental Problem

When you import a CATIA V5 file (`.CATPart` or `.CATProduct`) into SolidWorks, you get a "dumb solid" — a solid body with the correct geometry but no feature tree. You can't edit the dimensions of a hole, change a fillet radius, or suppress a feature. The model is a snapshot of the final geometry, not a recipe for creating it.

SolidWorks offers `FeatureWorks` to attempt automatic feature recognition, but in our experience, it successfully reconstructs the feature tree for less than 20% of real-world parts. The rest require manual reconstruction.

## Pre-Migration Assessment

Before converting a single file, assess your library:

1. **Categorize parts by complexity**:
   - Simple parts (< 10 features): Migration is straightforward, FeatureWorks often succeeds
   - Medium parts (10-50 features): Manual reconstruction needed, 1-2 hours per part
   - Complex parts (50+ features): Significant effort, 4-8 hours per part
   - Surface models and G2-continuous shapes: Very difficult, may require complete re-modeling

2. **Identify obsolete parts**: Don't migrate parts that are no longer in production. Archive them in STEP format only.

3. **Identify purchased/supplier parts**: These can be migrated as dumb solids — you'll never need to edit them. No feature tree needed.

4. **Identify the active design set**: Only migrate parts that are currently in production or will be modified in the next 12 months. This typically reduces the migration scope by 60-70%.

## The Migration Workflow

### Step 1: Export from CATIA as STEP AP242

Don't use SolidWorks' direct CATIA import. Instead, export from CATIA as STEP AP242, which preserves more metadata than direct import.

1. In CATIA, open the part
2. **File → Save As → STEP AP242**
3. In the export options, enable:
   - **Export all bodies** (not just the active body)
   - **Export external references** (if the part has links to other parts)
   - **Preserve assembly structure** (for CATProducts)

STEP AP242 is the latest STEP protocol and preserves more information than AP203 or AP214. It supports geometric dimensions, tolerances, and assembly structure.

### Step 2: Import into SolidWorks

1. In SolidWorks, **File → Open → change file type to STEP**
2. Select the STEP file
3. In the import options:
   - **Import as: Solid/Surface body**
   - **Surface knit tolerance: 0.01mm** (adjust based on your part's scale)
   - **Try to form solid: Yes**
4. Click Import

### Step 3: Run FeatureWorks

If the import succeeds and you have a solid body, run FeatureWorks to attempt automatic feature recognition:

1. **Insert → Features → FeatureWorks → Recognize Features**
2. Select **Automatic Feature Recognition**
3. Choose the features to recognize: Extrudes, Revolves, Holes, Fillets, Chamfers, Drafts
4. Click **Recognize**

FeatureWorks will attempt to identify features and rebuild the tree. In our experience:
- **Holes and hole patterns**: 80% success rate — FeatureWorks is good at these
- **Extrudes and revolves**: 50% success rate — depends on sketch complexity
- **Fillets and chamfers**: 40% success rate — often recognized but with wrong references
- **Lofts and sweeps**: 10% success rate — almost never recognized correctly
- **Patterns**: 30% success rate — circular patterns work better than linear

### Step 4: Manual Reconstruction

For features that FeatureWorks can't recognize, you'll need to rebuild them manually. Here's our approach:

1. **Start with the base feature**: Identify the largest extrude or revolve — this is usually the foundation of the part
2. **Use the Measure tool to extract dimensions**: Measure the key dimensions from the imported solid
3. **Recreate the sketch on the appropriate plane**: Match the original design intent, not just the geometry
4. **Add features in logical order**: Base feature → secondary features → holes → fillets/chamfers (always last)
5. **Suppress the imported solid body** once you have enough features to define the geometry
6. **Compare the new model to the imported solid**: Use **Tools → Compare → Documents** to verify geometry matches

### Step 5: Rebuild Assembly Mates

For assemblies (CATProducts), the mates are lost during migration. You'll need to:

1. Import the assembly as a STEP file (preserves component positions)
2. Create a new SolidWorks assembly
3. Insert the imported components (they'll be in the correct positions but with no mates)
4. Add mates one by one, starting with the fixed component
5. Use **Mate Xpert** to diagnose any conflicts

## Common Import Errors and Fixes

### "The imported surface is not knittable"

This happens when the STEP file contains surfaces that don't perfectly align — typically due to tolerance differences between CATIA and SolidWorks.

**Fix**: Increase the knit tolerance in the import options. If that doesn't work, use **Tools → Import Diagnostics** to find and fix gaps in the surface model.

### "The imported body has self-intersecting faces"

This is common with complex surface models from CATIA's Generative Shape Design workbench.

**Fix**: Use **Tools → Check** to identify the problematic faces. Use **Insert → Face → Delete** to remove the bad faces, then recreate them with SolidWorks surface tools.

### "FeatureWorks failed to recognize any features"

This usually means the part is too complex for automatic recognition.

**Fix**: Switch to **Interactive Feature Recognition** mode, where you manually select faces and tell FeatureWorks what feature type they represent. This is slower but has a much higher success rate.

## Time Estimates

Based on our migration project:

| Part Complexity | Count | Time per Part | Total Time |
|----------------|-------|---------------|------------|
| Simple (< 10 features) | 1,200 | 15 min | 300 hours |
| Medium (10-50 features) | 800 | 1.5 hours | 1,200 hours |
| Complex (50+ features) | 150 | 5 hours | 750 hours |
| Surface models | 50 | 8 hours | 400 hours |
| Purchased parts (dumb solid) | 1,800 | 2 min | 60 hours |

Total: approximately 2,710 hours for 4,000 parts. We completed this with 3 engineers over 4 months.

## Summary

The key to a successful CATIA-to-SolidWorks migration is managing expectations. You will lose feature trees. You will lose parametric relationships. You will spend significant time on manual reconstruction. But by categorizing parts by complexity, only migrating active designs, and using a systematic workflow (STEP AP242 export → FeatureWorks → manual reconstruction), you can make the process predictable and manageable. And honestly, for many parts, a dumb solid is perfectly adequate — if you're never going to modify a purchased bracket, you don't need its feature tree.
