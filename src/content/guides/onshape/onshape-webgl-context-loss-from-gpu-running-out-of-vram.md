---
title: "Onshape WebGL Context Loss from GPU Running Out of VRAM"
excerpt: "Onshape WebGL Context Loss from GPU Running Out of VRAM: symptoms, root causes, and step-by-step fixes, verified against Onshape help and forum."
category: "performance"
softwareSlug: "onshape"
keyword: "Onshape WebGL context loss GPU VRAM Part Studio intermittent slowdown heavy derived features browser cache Assembly mate solve time complex part workspaces performance degradation excessive tab count Chrome VRAM throttling large models Firefox"
slug: "onshape-webgl-context-loss-from-gpu-running-out-of-vram"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://cad.onshape.com/help/Content/Home/hardware_and_graphics_performance_recommendations.htm"
  - "https://www.onshape.com/en/resource-center/tech-tips/tech-tip-how-to-use-the-performance-panel-in-onshape"
  - "https://forum.onshape.com/discussion/31316/part-studio-intermittently-becomes-very-slow-when-editing-features"
---

# Onshape WebGL Context Loss from GPU Running Out of VRAM, Part Studio Intermittent Slowdown from Heavy Derived Features and Browser Cache, Assembly Mate Solve Time High from Complex Part Workspaces, Performance Degradation from Excessive Tab Count Over 100, and Chrome VRAM Throttling for Large Models Requiring Firefox Switch: VRAM Upgrade, Cache Clear, Version References, Tab Reduction, and Browser Switch

Onshape produces errors from WebGL context loss, Part Studio slowdown, mate solve time, tab count, and browser VRAM issues. This guide covers the 5 most common Onshape problems with diagnostic steps and community-verified fixes from Onshape help and forum.

## 1. WebGL Context Loss from GPU Running Out of VRAM

### Symptom

Onshape displays the error "Rats! WebGL hit a snag" or "It looks like your browser doesn't have WebGL enabled." The 3D graphics stop rendering. The issue may occur when changing the display connected to the computer. Occasionally the browser takes away the WebGL context and never returns it. The issue is more common with GPUs with less than 1 GB of VRAM.

### Root Cause

"One known cause of this situation is when the GPU runs out of memory. This may occur if the GPU has relatively little video RAM to begin with (less than 1 GB), or if the loaded tab has sufficient complexity to exceed the limits of the GPU's RAM. If context loss issues persist, try loading the document on another device with more video RAM." The WebGL rendering context is lost when the GPU runs out of VRAM. Onshape uses WebGL to display 3D data in the browser. When the loaded model's tessellation data exceeds the GPU's VRAM, the browser terminates the WebGL context.

### Fix

1. **Upgrade to a GPU with more VRAM**:
   - "If the GPU has relatively little video RAM"
   - "(less than 1 GB)"
   - "2GB or more is ideal for large assemblies"
   - Upgrade to 2GB+ VRAM GPU

2. **Lower tessellation quality**:
   - "Video RAM memory usage may be reduced"
   - "By lowering tessellation quality"
   - "For parts contained within the tab"
   - Lower tessellation quality

3. **Use a discrete graphics card**:
   - "A discrete graphics card with dedicated video memory"
   - "Is recommended"
   - "At least 1GB of VRAM for everyday use"
   - Use discrete GPU

4. **Set browser to use discrete GPU**:
   - "Specify that the browser always use"
   - "The discrete graphics card"
   - Set browser to use
   - Discrete GPU

5. **Disable automatic graphics switching**:
   - "Set your browser to always use the discrete graphics card"
   - "Or disable automatic graphics switching"
   - Disable auto-switching
   - On laptops

6. **Update graphics drivers**:
   - "Update your graphics drivers"
   - "To the most recent version"
   - "From the manufacturer"
   - Update GPU drivers

7. **Override GPU blacklist**:
   - "Some graphics cards are blacklisted"
   - "Because of poor WebGL support"
   - Override blacklist
   - In Chrome or Firefox

### Community Report

> "Occasionally a browser may take away the WebGL context and never return it. One known cause of this situation is when the GPU runs out of memory. This may occur if the GPU has relatively little video RAM to begin with (less than 1 GB), or if the loaded tab has sufficient complexity to exceed the limits of the GPU's RAM. If context loss issues persist, try loading the document on another device with more video RAM. Video RAM memory usage may be reduced by lowering tessellation quality."

## 2. Part Studio Intermittent Slowdown from Heavy Derived Features and Browser Cache

### Symptom

A Part Studio with about 147 features becomes intermittently very slow when editing features. Selecting an edge, changing a dimension, or any click causes several seconds of pause. The slowdown happens between nearly every click or parameter change. The issue is intermittent — the same Part Studio can be very slow, then become completely smooth a few minutes later. Panning, rotating, and zooming are smooth. The Onshape performance check reports good GPU/WebGL performance.

### Root Cause

"The slowdown happens while creating or modifying features. Could be due to heavy Derived features slowing rebuild." Heavy derived features cause the Part Studio to rebuild slowly when features are edited. Each edit triggers a rebuild of the feature tree, and derived features add significant computation time. The intermittent nature may be related to browser cache — when the cache is full, the browser slows down, and when it clears space, performance improves.

### Fix

1. **Clear browser cache**:
   - "You could try clearing your browser cache"
   - Clear the browser cache
   - To resolve intermittent
   - Slowdown issues

2. **Avoid daisy-chaining derived features**:
   - "Be sure to not derive a part"
   - "Into multiple Part Studios"
   - "Using the method known as daisy-chaining"
   - Avoid daisy-chaining

3. **Always derive from the original part**:
   - "When deriving a part"
   - "Always derive from the original part instance"
   - Derive from original
   - Not from another derived part

4. **Derive from versions instead of workspaces**:
   - "Derive parts from a version"
   - "Instead of workspace"
   - "To reduce the amount of regeneration"
   - Use version references

5. **Disable apply per instance in patterns**:
   - "Not enabling 'apply per instance' in a pattern"
   - "This option will calculate each pattern instance"
   - "Instead of calculating the first instance"
   - Disable apply per instance

6. **Reduce feature count**:
   - "Keep the number of features in a Part Studio low"
   - "We recommend 250 or fewer"
   - Reduce features
   - To below 250

7. **Use Performance Panel to identify slow features**:
   - "Feature Regeneration Time"
   - "Warns you that a specific feature"
   - "Takes longer than 10 seconds to generate"
   - Use Performance Panel

### Community Report

> "I'm working on a Part Studio with about 147 features, and feature editing sometimes becomes extremely slow. The slowdown happens while creating or modifying features. For example, when creating a chamfer, I select one edge, and Onshape pauses for several seconds. The problem is intermittent. You could try clearing your browser cache. Could be due to heavy Derived features slowing rebuild."

## 3. Assembly Mate Solve Time High from Complex Part Workspaces

### Symptom

The Onshape Performance Panel warns that the Assembly Solve Time is high. The amount of time needed to solve all applied mates is excessive. Opening and working with the assembly is sluggish. The issue occurs with assemblies containing complex parts referenced from workspaces.

### Root Cause

"Assembly Solve Time: This message warns that the amount of time needed to solve all the applied mates is high. You should consider inserting a version of a complex part instead of the workspace and make use of subassemblies. Subassemblies create a hierarchy for mates to load, which improves mate solve times." When complex parts are referenced from workspaces (not versions), any change to the workspace triggers a rebuild of the assembly's mate solver. Using subassemblies creates a hierarchy that limits the mates that need to be solved at each level.

### Fix

1. **Insert versions instead of workspaces**:
   - "Consider inserting a version of a complex part"
   - "Instead of the workspace"
   - Insert versions
   - For complex parts

2. **Use subassemblies**:
   - "Make use of subassemblies"
   - "Subassemblies create a hierarchy"
   - "For mates to load"
   - Use subassemblies

3. **Use mates with fewer degrees of freedom**:
   - "Using mates with fewer degrees of freedom"
   - "Speeds up the mate solve times"
   - Use simpler mates
   - With fewer DOF

4. **Reduce mate limits**:
   - "Reducing the use of mate limits"
   - "Speeds up the mate solve times"
   - Reduce mate limits
   - For faster solving

5. **Suppress mates when not needed**:
   - "Suppressing the mate until it's needed"
   - "When working in the Assembly"
   - Suppress unused mates
   - To speed up solving

6. **Keep feature count below 250**:
   - "Keep the number of features in a Part Studio low"
   - "We recommend 250 or fewer"
   - Reduce features
   - To speed up mates

7. **Use Performance Panel to diagnose**:
   - "The Performance Panel can answer those questions"
   - "What your Assembly mate solve time is"
   - Use the Performance Panel
   - To identify slow mates

### Community Report

> "Assembly Solve Time: This message warns that the amount of time needed to solve all the applied mates is high. You should consider inserting a version of a complex part instead of the workspace and make use of subassemblies. Subassemblies create a hierarchy for mates to load, which improves mate solve times. Additionally, using mates with fewer degrees of freedom and reducing the use of mate limits speeds up the mate solve times."

## 4. Performance Degradation from Excessive Tab Count Over 100

### Symptom

Documents with a high number of tabs become slow. The performance degradation affects all tabs in the document. Opening, switching between, and working in tabs is sluggish. The issue becomes noticeable when tab count exceeds 40-100 tabs.

### Root Cause

"Documents with higher tab counts can slow down the performance of the Document, it is advisable to keep Documents to a tab count below 100. Utilize modeling in-context and move tabs to other documents. Having tabs in other documents can also provide greater control over how and when you share a design." Each tab in a document consumes server resources. The server resources allocated to a document don't scale with the number of tabs. Excessive tabs spread the resources too thin, causing performance degradation.

### Fix

1. **Keep tab count below 40**:
   - "We recommend 40 or fewer"
   - "But it depends on complexity"
   - Keep tabs
   - Below 40

2. **Move tabs to other documents**:
   - "Move tabs to other documents"
   - "Having tabs in other documents"
   - "Can provide greater control"
   - Move tabs to other documents

3. **Use in-context modeling**:
   - "Utilize modeling in-context"
   - Use in-context modeling
   - To reduce the need
   - For multiple tabs

4. **Split large documents**:
   - Split large documents
   - Into smaller documents
   - With fewer tabs
   - Each

5. **Use versions for references**:
   - "Use versions"
   - "Using version references for Parts"
   - "Will speed up an assembly's overall load time"
   - Use version references

6. **Check Performance Panel for tab warnings**:
   - "Amount of Tabs in a Document"
   - "Documents with higher tab counts"
   - "Can slow down performance"
   - Check Performance Panel

7. **Archive unused tabs**:
   - Archive tabs
   - That are no longer needed
   - To reduce the active
   - Tab count

### Community Report

> "Amount of Tabs in a Document: Documents with higher tab counts can slow down the performance of the Document, it is advisable to keep Documents to a tab count below 100. Utilize modeling in-context and move tabs to other documents. Having tabs in other documents can also provide greater control over how and when you share a design."

## 5. Chrome VRAM Throttling for Large Models Requiring Firefox Switch

### Symptom

Chrome performs well for small-to-mid-sized models but slows down with large models. Chrome throttles RAM and VRAM usage after a certain point. Large assemblies that work in Firefox become sluggish in Chrome. The issue occurs when working with large models across multiple tabs in Chrome.

### Root Cause

"Chrome is typically the fastest browser on new machines with up-to-date drivers and a dedicated graphics card. Chrome works well if users need to switch between many tabs consisting of small-to-mid-sized models. However, Chrome tends to throttle RAM and VRAM usage after a certain point. Firefox can handle more memory when compared to Chrome and is preferred when dealing with large models across fewer tabs." Chrome implements memory throttling to manage system resources. When Onshape's 3D rendering exceeds Chrome's memory limits, Chrome throttles the VRAM allocation, causing performance degradation. Firefox doesn't implement the same throttling and can handle more memory.

### Fix

1. **Switch to Firefox for large models**:
   - "Firefox can handle more memory"
   - "When compared to Chrome"
   - "And is preferred when dealing with large models"
   - Switch to Firefox

2. **Use Chrome for small-to-mid-sized models**:
   - "Chrome works well if users need"
   - "To switch between many tabs"
   - "Consisting of small-to-mid-sized models"
   - Use Chrome for smaller models

3. **Use 64-bit browser**:
   - "Use the 64-bit version"
   - "Of a preferred browser"
   - "If their system supports it"
   - Use 64-bit browser

4. **Reduce open tabs in Chrome**:
   - Reduce the number
   - Of open tabs
   - To avoid Chrome's
   - Memory throttling

5. **Use Firefox for fewer tabs with large models**:
   - "Firefox is preferred"
   - "When dealing with large models"
   - "Across fewer tabs"
   - Use Firefox for large models

6. **Ensure hardware acceleration is enabled**:
   - "Ensure your preferred browser"
   - "Has WebGL enabled"
   - "And uses hardware acceleration"
   - Enable hardware acceleration

7. **Update browser to latest version**:
   - "Onshape supports the latest stable versions"
   - "Of several browsers"
   - Update to the
   - Latest browser version

### Community Report

> "Chrome is typically the fastest browser on new machines with up-to-date drivers and a dedicated graphics card. Chrome works well if users need to switch between many tabs consisting of small-to-mid-sized models. However, Chrome tends to throttle RAM and VRAM usage after a certain point. Firefox can handle more memory when compared to Chrome and is preferred when dealing with large models across fewer tabs."

## 6. Additional Onshape Issues

### Internet Connection Consistency

**Issue**: "While speed matters, consistency is even more crucial. An intermittent connection can disrupt your workflow, so prioritize stability."
**Fix**: Use a stable, consistent internet connection. Prioritize connection stability over speed. Use wired connection for best stability.

### RAM Requirements

**Issue**: "A baseline of 8GB is recommended, but 16GB or more can provide a smoother experience for power users."
**Fix**: Use 8GB RAM minimum. Use 16GB+ for power users. More RAM helps when juggling multiple tabs or running analysis.

### Tessellation Refinement

**Issue**: "Onshape progressively pulls down finer tessellation for part data in Part Studios and Assemblies, when finer tessellation exists."
**Fix**: Let tessellation refine automatically. The refinement may be hindered if FPS drops below 20 or data exceeds memory limit.

### FPS Threshold for Tessellation

**Issue**: "The interactive frame rate becomes too slow (the current threshold is 20 FPS)."
**Fix**: Maintain FPS above 20 for automatic tessellation refinement. If FPS drops, Onshape stops requesting finer tessellation.

### Memory Limit Exceeded

**Issue**: "The amount of data exceeds the memory limit. Onshape compensates by swapping out older, unused body representations."
**Fix**: Reduce model complexity to stay within memory limits. Onshape automatically swaps out unused representations when memory is exceeded.

### Performance Check

**Issue**: "The performance check was not executed due to a low refresh rate (less than 60hz)."
**Fix**: Use a monitor with 60Hz+ refresh rate for performance check. The performance check requires at least 60Hz to run properly.

### WebGL Extensions

**Issue**: "If your system doesn't have all the GL extensions, this should be addressed for best graphics and 3D rendering."
**Fix**: Update GPU drivers to get all WebGL extensions. Check the Performance Panel System section for GL extension information.

## Best Practices

1. **Use GPU with 2GB+ VRAM for large assemblies** — prevents WebGL context loss
2. **Set browser to use discrete GPU** — prevents integrated GPU performance issues
3. **Clear browser cache for intermittent slowdown** — resolves cache-related performance issues
4. **Derive from versions, not workspaces** — reduces regeneration time
5. **Avoid daisy-chaining derived features** — always derive from original part
6. **Use subassemblies for mate hierarchy** — improves mate solve times
7. **Keep tab count below 40** — prevents document performance degradation
8. **Use Firefox for large models** — handles more memory than Chrome
9. **Use Chrome for many small-to-mid-sized tabs** — faster for smaller models
10. **Use Performance Panel to diagnose issues** — identifies slow features and mates
