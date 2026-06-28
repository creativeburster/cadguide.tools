---
title: "Tekla Structures Large Model Performance: Work Area, View Filters, and Model History"
excerpt: "Tekla Structures slows down with large steel models — zooming lags, saving takes minutes, and numbering hangs. I cover the work area optimization, model history disabling, and view filter strategy that keep large models responsive."
category: "performance"
softwareSlug: "tekla-structures"
keyword: "Tekla Structures large model performance work area view filter"
slug: "tekla-large-model-performance-work-area-view-filter"
author: "CAD IT Admin"
readTime: "9 min"
date: "2025-06-21"
sources:
  - "https://support.tekla.com/article/tekla-structures-performance-issues"
  - "https://support.tekla.com/doc/tekla-structures/2025/sys_modeling_tips_for_large_models"
  - "https://support.tekla.com/fix/tekla-structures/ttsd-68404"
  - "https://support.tekla.com/fix/tekla-structures/ttsd-59522"
---

# Tekla Structures Large Model Performance: Work Area, View Filters, and Model History

Trimble's official Tekla Structures support documentation addresses performance issues directly: "If you experience performance issues with Tekla Structures, you can try these common ways to improve the performance." Their guidance for large models includes specific tips for work area management, view filters, and model history. A Tekla 2025 service pack fix (TTSD-68404) addressed a regression where "storing, deleting, and modifying large numbers of model objects was slightly slower than in previous versions." Another fix (TTSD-59522) introduced "part geometry instancing to speed up the view opening and navigation" for models with repetitive parts.

Despite these improvements, large Tekla models (10,000+ parts) still require active performance management. The following fixes are based on Trimble's official guidance and field-tested practices.

## Fix 1: Keep the Work Area Small

Trimble's documentation states: "Keep the work area as small as possible." The work area defines the volume of the model that Tekla processes for display and selection:

1. Go to **View → Create View of Part of Model → By Work Area**
2. Or use the **Fit Work Area** command:
   - Select the parts you're currently working on
   - Right-click → **Fit Work Area to Selected Parts**
3. Only parts within the work area are rendered and processed
4. Parts outside the work area are not displayed, reducing rendering load

### Setting Work Area by Bounding Box

1. Select the area of the model you're working on
2. Go to **View → Set Work Area → By Selected Parts**
3. The work area shrinks to encompass only the selected parts
4. This is the fastest way to reduce the work area for a specific task

## Fix 2: Use View Filters to Control Visibility

Trimble recommends: "Show only the required parts in views. Use view filters to control the visibility of parts."

### Create Task-Specific View Filters

1. Go to **View → View Filter**
2. Create filters for each task:
   - **Steel Only**: Show only steel parts (filter by material type)
   - **Bolts Hidden**: Hide all bolts (filter by object type)
   - **Welds Hidden**: Hide all welds
   - **Current Phase**: Show only parts in the current phase
3. Apply filters to views: Right-click a view → **View Properties → Filter**
4. Each view can have a different filter

### Close Unnecessary Views

Trimble's guidance: "Close unnecessary views. Close all views when saving large models."

1. Keep only 1-2 views open at a time
2. Close all views before saving: **View → Close All Views**
3. Reopen views after saving
4. Each open view consumes memory and processing power

## Fix 3: Disable Model History Collection

Trimble's documentation recommends: "To stop the automatic collection of model history, set value of the XS_COLLECT_MODEL_HISTORY advanced option to FALSE."

1. Go to **File → Settings → Advanced Options**
2. Search for `XS_COLLECT_MODEL_HISTORY`
3. Set the value to `FALSE`
4. Restart Tekla Structures
5. Model history is no longer collected, saving memory and processing time

### Impact

- Model history tracks every change (who changed what and when)
- For large models, history collection can consume significant memory
- Disabling it improves performance but removes the ability to see change history
- If you need history for quality assurance, re-enable it periodically

## Fix 4: Optimize Reference Models

Trimble notes: "Remove reference models if there are issues with the views" and "Switch on the Select reference models selection switch only when necessary."

### Disable Reference Model Selection

1. On the selection toolbar, find the **Select Reference Models** switch
2. Turn it off when not actively selecting reference model geometry
3. When this switch is on, Tekla processes all reference models for selection on every mouse move
4. Disabling it can dramatically improve zooming and rotating performance

### Clip Reference Models

1. Right-click a reference model → **Clip**
2. Set a clipping plane to show only the relevant portion
3. Only the clipped portion is processed for display

### Use Lightweight Reference Models

1. When importing reference models (IFC, DWG), use the **Reference Model Properties**
2. Set **Visibility** to **Outline** or **Wireframe** (not **Solid**)
3. Lightweight display modes process less geometry

## Fix 5: Optimize Model Location

Trimble's documentation warns: "Do not place the model far away from the origin. The further away from the origin you model, the less precise all the computations become."

### Use Base Points

1. Go to **File → Settings → Base Points**
2. Create a base point at the model's working location
3. Use the base point coordinate system for modeling
4. This keeps internal coordinates small while maintaining site coordinates for export

### Drop Leading Digits

Trimble suggests: "If you need to use building site coordinates, drop the first digits if they are always the same. For example, instead of coordinate 758 375 6800, use 375 6800."

1. If all site coordinates start with the same digits (e.g., 758xxx), drop those digits
2. Model with the shortened coordinates
3. Add the digits back when exporting (use base points for automatic conversion)

## Fix 6: Optimize Round Objects

Trimble provides specific guidance for round objects:

### Use Bolts Instead of Part Cuts for Holes

1. Use **Create Bolts** command to create holes
2. Don't use part cuts with round beams to create holes
3. Bolt holes are optimized for performance; part cuts are not

### Use Studs for Small Round Objects

1. Use **Studs** to model small straight round objects
2. Don't use small round beams for studs
3. Studs are lightweight and optimized for large quantities

### Use Reinforcement Bars for Embeds

1. Model lifting hooks and embeds with **Reinforcement Bars**
2. Don't use round polybeams for these elements
3. Reinforcement bars are more efficient for curved geometry

## Fix 7: Optimize Custom Components

Trimble warns: "Do not create overly complex custom components. When used in great numbers they consume a lot of memory."

1. Keep custom components as simple as possible
2. Avoid nested custom components (custom components within custom components)
3. Use standard components where possible
4. If a custom component is used 100+ times, optimize its definition:
   - Remove unnecessary rules and calculations
   - Simplify the geometry creation steps
   - Use direct geometry instead of parametric rules where possible

## Fix 8: Optimize Numbering

Trimble advises: "Do not number the whole model in one go. Numbering all objects in large models may take a considerable amount of time."

1. Number by phase: **Numbering → Number Selected Objects**
2. Select parts in one phase and number them
3. Then select parts in the next phase and number them
4. This is faster than numbering the entire model at once

### Use Numbering Series

1. Assign numbering series to different part types
2. Number one series at a time
3. This prevents Tekla from renumbering unrelated parts

## Fix 9: Repair the Model Database

Trimble notes: "If your model file is getting large, repairing the model database can help to reduce the file size considerably."

1. Close all views
2. Go to **File → Tools → Repair Model Database**
3. Tekla repairs the database and removes corrupted or unused data
4. File size can decrease by 20-50%
5. Run this monthly for large projects

## Fix 10: Use DirectX Rendering

For complex items and large models:

1. Go to **File → Settings → Advanced Options**
2. Search for `XS_USE_DIRECTX`
3. Set to `TRUE`
4. Restart Tekla Structures
5. DirectX rendering is optimized for complex geometry

### Check Graphics Card Assignment

1. If DirectX makes performance worse, your graphics card may not be powerful enough
2. Or the wrong GPU is being used (integrated instead of discrete)
3. For NVIDIA: Open NVIDIA Control Panel → Manage 3D Settings → Program Settings
4. Add `TeklaStructures.exe` and set to **High-performance NVIDIA processor**
5. For AMD: Open AMD Adrenalin → Graphics → Tekla Structures → Set to **High Performance**

## Fix 11: Keep Tekla Updated

1. Install the latest service pack: **Help → Check for Updates**
2. Tekla 2025 SP1 fixed a performance regression for large object counts
3. Tekla 2024 introduced geometry instancing for faster view opening
4. Always check the fixlist for each service pack to see if your issue is addressed

## Summary

| Fix | Impact | Difficulty |
|-----|--------|------------|
| Keep work area small | Very high | Easy |
| Use view filters | Very high | Easy |
| Disable model history | High | Easy |
| Disable reference model selection | High | Easy |
| Use base points | Medium | Medium |
| Optimize round objects | Medium | Easy |
| Simplify custom components | Medium | Medium |
| Number by phase | High | Easy |
| Repair model database | High | Easy |
| Enable DirectX rendering | High | Easy |
| Keep Tekla updated | Medium | Easy |

The most impactful combination is: keep the work area small, use view filters to show only needed parts, disable reference model selection when not needed, and disable model history collection. These four changes can transform a laggy 10,000-part model into a responsive working environment. Regular database repair and keeping Tekla updated with the latest service packs ensures ongoing performance.
