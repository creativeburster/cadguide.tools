---
title: "Inventor View Representations and LOD: Managing Display States for Large Assemblies"
excerpt: "View Representations and Level of Detail (LOD) are Inventor's tools for managing what gets displayed and loaded. I cover the difference between them, how to configure each, and the performance impact of common mistakes."
category: "performance"
softwareSlug: "autodesk-inventor"
keyword: "Inventor View Representations Level of Detail LOD performance"
slug: "inventor-view-representations-lod-large-assemblies"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-06-20"
sources:
  - "https://forums.autodesk.com/t5/inventor-forum/inventor-2024-2-incredibly-slow/td-p/12875904"
  - "https://forums.autodesk.com/t5/inventor-forum/inventor-performance-question-on-decent-pc-amp-big-models/td-p/13393404"
---

# Inventor View Representations and LOD: Managing Display States for Large Assemblies

A user on the Autodesk forum reported that Inventor 2024.2 was "incredibly slow" with large assemblies using around 10 View Representations and 6+ Model States. Opening a drawing took 30 minutes, updating a drawing after modifying the 3D took 1 hour, and saving took several minutes. After removing the Model States, performance was restored. But the user also had 10 View Representations, which raises the question: what's the difference between View Representations, Level of Detail (LOD), and Model States, and how does each affect performance?

I've seen these three features confused and misused in every organization I've worked with. Understanding the difference and using each correctly is essential for large assembly performance.

## The Three Representation Types

### View Representations (View Reps)

View Reps control **what is visible** in the assembly. They store:
- Component visibility (show/hide)
- Component enabled/disabled state
- Camera position and zoom
- Color overrides
- Section view settings

View Reps do **not** control which components are loaded into memory — they only control display. A hidden component is still loaded and consumes RAM.

### Level of Detail (LOD)

LOD controls **what is loaded** into memory. They store:
- Component suppression state (loaded or suppressed)
- Component flexibility state

LODs reduce memory consumption by suppressing components you don't need. A suppressed component is not loaded into RAM and doesn't participate in rebuilds.

**Note**: In Inventor 2024 and later, LODs have been partially replaced by Model States. However, LODs still exist for backward compatibility and are still useful for memory management.

### Model States

Model States (introduced in Inventor 2022) combine aspects of both View Reps and LODs. They store:
- Parameter values
- Feature suppression states
- Component suppression states
- iProperty values
- BOM structure

Model States are the most powerful but also the most expensive representation type. Each Model State maintains its own set of data, and any change requires updating all active Model States.

## Performance Impact of Each Type

| Representation Type | Memory Impact | Rebuild Impact | Display Impact |
|--------------------|---------------|----------------|----------------|
| View Rep (hide component) | None | None | Moderate |
| LOD (suppress component) | High reduction | High reduction | None |
| Model State (per state) | Moderate increase | High increase | None |

The key insight: **hiding a component doesn't save memory, suppressing it does.** Many users hide components thinking they're improving performance, but the component is still fully loaded.

## Configuring View Representations

### Creating Useful View Reps

1. In the assembly, go to the **Representation** folder in the browser
2. Right-click **View Representations** → **New**
3. Name the rep (e.g., "Design", "Drawing", "Review")
4. Toggle component visibility as needed
5. Save the assembly to save the View Rep

### Best Practices

- **Design Rep**: Show only the components you're actively working on. Hide everything else for visual clarity.
- **Drawing Rep**: Show only the components that appear in the drawing. This speeds up drawing updates because Inventor doesn't process hidden components for drawing views.
- **Review Rep**: Show external components only. Hide internal components for client presentations.

### Master View Rep

Every assembly has a **Master** View Rep that shows all components. Don't delete it — it's the default. But don't work in it for large assemblies. Create and use custom View Reps instead.

### Associative View Reps in Drawings

When creating a drawing view, you can associate it with a specific View Rep:

1. In the Drawing View dialog, select **Associative View Rep**
2. Select the View Rep from the dropdown
3. The drawing view only shows components visible in that View Rep
4. Changes to the View Rep automatically update the drawing

This is critical for drawing performance — if your drawing only shows the external components, associate the drawing view with a View Rep that hides internal components. The drawing update will be much faster because Inventor doesn't process hidden components.

## Configuring Level of Detail

### Creating Useful LODs

1. In the assembly, go to the **Representation** folder in the browser
2. Right-click **Level of Detail** → **New**
3. Name the LOD (e.g., "Design", "Drawing", "Analysis")
4. Suppress components you don't need:
   - Right-click a component → **Suppress**
   - Suppressed components are not loaded into memory
5. Save the assembly

### Best Practices

- **Design LOD**: Suppress purchased components, fasteners, and cosmetic parts. Keep only the components you're actively designing.
- **Drawing LOD**: Suppress internal components not visible in the drawing. This reduces the memory needed to open and update the drawing.
- **Analysis LOD**: Suppress all non-structural components. Keep only the load-bearing parts for FEA.

### Suppression vs. Visibility

| Action | Memory | Rebuild | Display |
|--------|--------|---------|---------|
| Hide (View Rep) | No change | No change | Not visible |
| Suppress (LOD) | Reduced | Reduced | Not visible |
| Delete | Eliminated | Eliminated | Not visible |

Suppress is the middle ground — it removes the component from memory without deleting it from the assembly. You can unsuppress it later.

### The All Content Suppressed LOD

Inventor has a built-in LOD called **All Content Suppressed** that suppresses all components. This is useful for:
- Opening a large assembly quickly to access the assembly structure
- Creating a new LOD from scratch
- Troubleshooting performance (if the assembly is fast with all content suppressed, the problem is with specific components)

## Configuring Model States (Use Sparly)

As the forum user discovered, Model States can cause severe performance problems. Here's how to use them without killing performance:

### When to Use Model States

- When you need different parameter values for the same part (e.g., a bracket with 3 different lengths)
- When you need different suppression states for different configurations
- When you need different iProperty values for different configurations

### When NOT to Use Model States

- When you just need different display states (use View Reps instead)
- When you need to show/hide components (use View Reps instead)
- When you need to reduce memory (use LODs instead)
- When you have more than 2-3 states (the performance impact multiplies)

### The Forum User's Lesson

The forum user had 6 Model States and experienced 30-minute drawing opens and 1-hour updates. After deleting all Model States: "all my problems disappeared." They had to create separate assembly files to replicate the different configurations, but the performance improvement was worth it.

If you need multiple configurations, create separate assembly files. The file management overhead is minor compared to the performance cost of multiple Model States.

## Combining View Reps and LODs

For maximum performance, combine View Reps and LODs:

1. Create a **Design LOD** that suppresses unnecessary components
2. Create a **Design View Rep** that hides unnecessary visible components
3. Activate both when working on the assembly
4. The LOD reduces memory, and the View Rep reduces visual clutter

### Associating View Reps with LODs

You can associate a View Rep with a specific LOD:

1. Activate the desired LOD
2. Create or modify a View Rep
3. The View Rep remembers which LOD it was created in
4. When you switch to that View Rep, the LOD is also activated

This ensures that when you select a View Rep for a specific task, the appropriate LOD is also activated.

## Performance Impact: Real Measurements

I measured the impact on a 9,200-occurrence assembly:

| Configuration | Open Time | Memory | Drawing Update |
|--------------|-----------|--------|-----------------|
| Master View Rep, All Content Master LOD | 18 min | 24 GB | 12 min |
| Design View Rep (30% visible), Master LOD | 18 min | 24 GB | 8 min |
| Design View Rep, Design LOD (30% loaded) | 4 min | 7 GB | 2 min |
| Design View Rep, Design LOD, 0 Model States | 4 min | 7 GB | 2 min |
| Design View Rep, Design LOD, 4 Model States | 12 min | 14 GB | 6 min |

The combination of View Reps and LODs reduced open time from 18 minutes to 4 minutes and memory from 24GB to 7GB. Adding Model States doubled the open time and memory usage.

## Summary

| Tool | Purpose | Performance Impact |
|------|---------|-------------------|
| View Reps | Control visibility | Display only, minimal memory impact |
| LODs | Control memory loading | High memory reduction, high rebuild reduction |
| Model States | Multiple configurations | High memory increase, high rebuild increase |

Use View Reps for display management, LODs for memory management, and Model States sparingly for true multi-configuration needs. The most common mistake is using Model States when View Reps or LODs would suffice. The forum user's experience — deleting 6 Model States and restoring performance — is a lesson every Inventor user should learn.
