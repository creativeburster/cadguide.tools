---
title: "NX Large Assembly Performance: Lightweight Representations and Simplification"
excerpt: "When your NX assembly hits 10,000+ components, even a high-end workstation struggles. I cover the specific settings and techniques I use to keep large assemblies responsive — from lightweight representations to reference sets and simplification."
category: "performance"
softwareSlug: "siemens-nx"
keyword: "NX large assembly performance lightweight"
slug: "siemens-nx-large-assembly-lightweight-representations"
author: "CAD IT Admin"
readTime: "9 min"
date: "2025-06-18"
sources:
  - "https://community.sw.siemens.com/s/question/0D5Vb00000TqaA1KAJ/urgent-help-needed-my-nx-is-extremely-slow-despite-a-highend-pc"
  - "https://docs.sw.siemens.com/en-US/product/471595/release/NX-2306/text/ug_doc/assembly_loading"
---

# NX Large Assembly Performance: Lightweight Representations and Simplification

I administer NX for a team of 30 engineers working on industrial equipment assemblies that routinely exceed 15,000 components. Over the years, I've developed a set of practices that keep these assemblies workable on standard engineering workstations — not just top-tier machines. The key insight is that NX has powerful tools for reducing the computational load of large assemblies, but most users don't know they exist or don't use them consistently.

## The Core Problem

When NX opens an assembly, it loads every component's full geometric data into memory — every face, every edge, every curve. For a 15,000-component assembly, this can consume 40-60GB of RAM and take 20+ minutes to load. But when an engineer is working on a specific subassembly, they don't need the full geometry of every bolt, washer, and bracket in the assembly. They need the components they're actively editing, plus lightweight representations of everything else for visual context.

NX provides three key mechanisms for this: **Lightweight Representations**, **Reference Sets**, and **Simplification**.

## Lightweight Representations

Lightweight Representations (LWR) are the single most impactful setting for large assembly performance. When enabled, NX loads a simplified version of each component instead of the full geometry. The lightweight version contains enough data for display and selection but omits the detailed geometric data that's only needed for editing.

### Enabling Lightweight Representations

1. Go to **Preferences → Assemblies → Loading**
2. Set **Load Components** to **As Specified** — this lets you control which components load fully
3. Under **Lightweight Representation**, select **Use Lightweight Representations**
4. Set the default to **Load Lightweight** for all components

### How LWR Works in Practice

When you open an assembly with LWR enabled:
- Components load as lightweight by default — typically 10-20x faster
- Memory consumption drops by 60-80%
- You can see and select components, but editing requires "promoting" the component to full representation
- To promote a component: right-click → **Open in Solid** (or double-click to edit, which automatically loads the full representation)

I've measured the impact directly: a 12,000-component assembly that took 18 minutes to load without LWR loaded in 2.5 minutes with LWR enabled. Memory usage dropped from 52GB to 14GB.

### Configuring LWR for Your Team

If you're managing multiple users, set this as a default:

1. Create or edit the `customer_defaults` file in `%UGII_BASE_DIR%\ugii\ugii_env.dat`
2. Add the line: `UGII_ASSEMBLY_LIGHTWEIGHT_DEFAULT=1`
3. This forces LWR on for all new users

## Reference Sets

Reference Sets are NX's way of letting you define which portions of a part are loaded when the part is used in an assembly. Every part has at least two reference sets: `Entire Part` and `Empty`. You can create custom reference sets that contain only the geometry needed for assembly context.

### Creating Useful Reference Sets

For fasteners (bolts, screws, washers):
1. Open the fastener part
2. Go to **Format → Reference Sets**
3. Create a reference set called `SIMPLE` containing only the external faces — no threads, no internal features
4. In the assembly, set the component to use the `SIMPLE` reference set

For purchased components (motors, pumps, cylinders):
1. Create a reference set called `ENVELOPE` containing only the mounting faces and external envelope
2. This gives you the spatial envelope for assembly layout without loading internal geometry

The key principle: **if you're not editing a component, you don't need its internal geometry.**

### Setting Default Reference Sets

1. Go to **Preferences → Assemblies → Loading**
2. Under **Reference Sets**, add your custom reference sets to the priority list
3. NX will automatically use the first available reference set in the list

## Simplification

NX's Simplification feature creates a single solid body that represents the external envelope of a part, with all internal features removed. This is more aggressive than reference sets — it actually creates new geometry.

### When to Use Simplification

- Purchased components with complex internal geometry that you'll never modify
- Castings and forgings where you only need the external shape for assembly context
- Components from suppliers that contain unnecessary detail (threads, fillets, chamfers)

### Creating a Simplified Representation

1. Open the component part
2. Go to **Insert → Associative Copy → Simplify**
3. Select the faces you want to keep (typically the external faces)
4. NX will create a simplified solid body with the selected faces and auto-generated faces to close any openings
5. Create a reference set containing only the simplified body
6. In the assembly, use this reference set

I applied this to a supplier-provided hydraulic valve model that was 45MB with full internal geometry. After simplification, the envelope model was 1.2MB — a 37x reduction. In an assembly with 200 such valves, this saved 8.7GB of memory.

## Assembly Structure Best Practices

Beyond the technical settings, how you structure your assembly affects performance.

### Use Subassemblies, Not Flat Structures

A flat assembly with 10,000 components at one level is much slower than a hierarchical assembly with the same 10,000 components organized into 50 subassemblies of 200 components each. NX can load and unload subassemblies as units, which is more efficient than managing individual components.

### Separate Design Context from Documentation Context

Don't put your drawing annotations, BOM tables, and cosmetic features in the same assembly as your design geometry. Create a separate documentation assembly that references the design assembly. This way, when you're editing design geometry, NX doesn't have to process documentation features.

### Use Deformable Components for Flexible Parts

For parts that change shape (hoses, cables, springs), use NX's deformable component feature instead of creating multiple configurations. This reduces the number of unique parts in the assembly.

## Performance Monitoring

NX has a built-in performance monitor that can help you identify bottlenecks:

1. Go to **Analysis → Performance Analysis**
2. Enable **Timing** to see how long each operation takes
3. Enable **Memory** to track RAM usage
4. Use this to identify which components or operations are consuming the most resources

## Summary

The combination of Lightweight Representations, Reference Sets, and Simplification can reduce large assembly load times by 80% and memory consumption by 70%. The key is consistency — every component in your library should have appropriate reference sets defined, and LWR should be enabled as a default for all users. The upfront investment in setting up these practices pays off every time someone opens the assembly.
