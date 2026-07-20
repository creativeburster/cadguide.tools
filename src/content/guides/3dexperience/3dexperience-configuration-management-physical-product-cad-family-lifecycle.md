---
title: "3DEXPERIENCE Configuration Management: Physical Products, CAD Families, and Lifecycle"
excerpt: "How to manage configurations in 3DEXPERIENCE when working with SOLIDWORKS — covering Physical Product vs CAD Family mapping, configuration strategy planning, avoiding unwanted linked products, and lifecycle management for released data."
category: "standards"
softwareSlug: "3dexperience"
keyword: "3dexperience configuration management physical product cad family lifecycle"
slug: "3dexperience-configuration-management-physical-product-cad-family-lifecycle"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-09"
sources:
  - "https://3dswym.3dexperience.3ds.com/wiki/solidworks-news-info/solidworks-set-up-and-configuration_sgwEMtCYRO29HZQz8bGpbA"
  - "https://3dswym.3dexperience.3ds.com/wiki/solidworks-news-info/implementing-3dexperience-for-solidworks-users-solidpractices_HRtgRGasQ96Ppz_SfpikRw"
---

# 3DEXPERIENCE Configuration Management: Physical Products, CAD Families, and Lifecycle

Configuration management is the most misunderstood aspect of 3DEXPERIENCE for SOLIDWORKS users. In SOLIDWORKS, configurations are simple — you create multiple configurations in one part file. In 3DEXPERIENCE, each SOLIDWORKS configuration creates a separate Physical Product on the platform. Get this wrong and you end up with dozens of unwanted linked Physical Products that are impossible to manage. I've cleaned up this mess for two companies. Here's how to avoid it.

## The Core Concept: Physical Product vs CAD Family

When you save a SOLIDWORKS part to 3DEXPERIENCE, the platform creates two types of objects:

### CAD Family
- Represents the SOLIDWORKS **file** (the .sldprt file)
- Contains the geometry definition and feature tree
- One CAD Family per SOLIDWORKS file
- Properties on the **Summary tab** map to the CAD Family

### Physical Product
- Represents each **configuration** in the SOLIDWORKS part
- Contains the instance-specific properties (dimensions, mass, material)
- One Physical Product per configuration
- Properties on the **Configuration Specific tab** map to the Physical Product
- This is what other platform users see and search for

### Example

A SOLIDWORKS part "Bracket.sldprt" with 3 configurations:
- **Default**: Standard bracket
- **Long**: Extended bracket
- **Reinforced**: Thicker bracket

On the platform:
- **1 CAD Family**: "Bracket" (the file)
- **3 Physical Products**: "Bracket Default", "Bracket Long", "Bracket Reinforced"

Each Physical Product has its own properties, lifecycle state, and can be independently searched and referenced.

## Step 1: Plan Your Configuration Strategy

Before saving any SOLIDWORKS files to the platform, decide how you'll use configurations:

### Strategy A: Minimal Configurations (Recommended)

- **One configuration per part** — the Default configuration only
- **Different sizes = different parts** — don't use configurations for size variants
- **Result**: One Physical Product per part — clean and simple

**When to use**: New projects, simple products, teams new to 3DEXPERIENCE

### Strategy B: Controlled Configurations

- **Configurations for legitimate variants** — e.g., left-hand and right-hand versions
- **Limit the number of configurations** — 2-3 per part maximum
- **Document the configuration purpose** — add a property describing each configuration
- **Result**: 2-3 Physical Products per part — manageable

**When to use**: Products with genuine variants, established 3DEXPERIENCE teams

### Strategy C: Configuration-Heavy (Not Recommended)

- **Many configurations per part** — like traditional SOLIDWORKS practice
- **Configurations for every size, material, and option**
- **Result**: Dozens of Physical Products per part — unmanageable on the platform

**When to use**: Never, if you can avoid it. This creates a mess.

## Step 2: Avoid Unwanted Linked Physical Products

The most common problem: saving a SOLIDWORKS assembly with configurations creates linked Physical Products that you didn't intend.

### How It Happens

1. You have an assembly with 4 configurations (e.g., Open, Closed, Service, Transport).
2. You save the assembly to the platform.
3. The platform creates 4 Physical Products for the assembly.
4. Each Physical Product references the same components but in different states.
5. If you modify a component in one configuration, it may affect all configurations.

### Prevention

1. **Use minimal configurations in assemblies** — one configuration per assembly
2. **Use display states instead of configurations** — for different views (open, closed, etc.)
3. **Use flexibility** — set sub-assemblies to "Flexible" instead of creating configurations
4. **Plan before saving** — review configurations before the first save to the platform

### Cleanup

If you already have unwanted linked Physical Products:

1. **Identify the unwanted configurations** in the SOLIDWORKS file
2. **Delete the configurations** in SOLIDWORKS
3. **Save to the platform** — the platform removes the corresponding Physical Products
4. **Verify** — check that the remaining Physical Products are correct

## Step 3: Manage Properties Correctly

### Configuration-Specific Properties

Properties that should vary per configuration (and thus per Physical Product) must be on the **Configuration Specific** tab:

- **PartNumber**: Unique per configuration
- **Description**: Configuration-specific description
- **Material**: May vary per configuration
- **Mass**: Calculated per configuration
- **Project**: May vary if different configurations are for different projects

### Summary Tab Properties

Properties that are the same for all configurations go on the **Summary** tab (mapped to CAD Family):

- **Author**: Same for all configurations
- **CreationDate**: Same for all configurations
- **Company**: Same for all configurations

### Critical Rule

**If a property needs to be searchable or visible in platform web apps, it must be on the Configuration Specific tab.** Properties on the Summary tab are only visible in the CAD Family context, not in the Physical Product context.

## Step 4: Manage Lifecycle States

3DEXPERIENCE uses maturity states to manage the lifecycle of data:

### Standard Maturity States

- **In Work**: Being actively designed — visible only to Collaborative Space members
- **Released**: Approved and frozen — visible to all platform users (in Protected spaces)
- **Obsolete**: No longer current — retained for reference

### Releasing Data

1. In MySession or the platform web app, select the component.
2. Click **Maturity** → **Release**.
3. The component changes from "In Work" to "Released".
4. Released components are:
   - **Frozen** — geometry cannot be modified
   - **Visible** to all platform users (in Protected spaces)
   - **Available** for reference by other designs

### Revising Released Data

When you need to modify a Released component:

1. Select the Released component.
2. Click **Maturity** → **Revise**.
3. A new revision is created (e.g., A → B).
4. The new revision starts in "In Work" state.
5. Modify the component.
6. Release the new revision.
7. The old revision remains as "Released" or can be set to "Obsolete".

### Lifecycle Best Practices

- **Release library parts immediately** — don't leave library parts in "In Work"
- **Release at milestones** — release at design reviews, not randomly
- **Use revision for changes** — don't modify Released data; create a new revision
- **Set old revisions to Obsolete** — when a new revision is Released, obsolete the old one
- **Limit who can release** — only Leaders/Owners should release data

## Step 5: Use Protected Collaborative Spaces

Protected spaces control visibility based on maturity state:

- **In Work content**: Visible only to space members
- **Released content**: Visible to all platform users
- **Obsolete content**: Visible to all platform users

### Why This Matters

- **Designers** work in "In Work" state — their work is private to the design team
- **Released designs** are visible to the entire company — manufacturing, purchasing, project management
- **Obsolete designs** are retained for reference but clearly marked as no longer current

### Setup

1. When creating a Collaborative Space, set visibility to **Protected**.
2. Add design team members as space members (Author or Leader role).
3. Non-members can see Released content but can't modify it.
4. Promote content from "In Work" to "Released" when it's ready for broader access.

## Step 6: Manage Change with ECO

When a Released component needs to change:

1. **Create an Engineering Change Order (ECO)** in the platform.
2. The ECO identifies:
   - **What changes**: Which components are affected
   - **Why**: Reason for the change
   - **Who**: Who requested and who approves
3. **Revise the affected components** — creates new revisions in "In Work" state.
4. **Make the changes** in SOLIDWORKS or xDesign.
5. **Release the new revisions** — through the ECO approval process.
6. **Obsolete the old revisions** — mark them as no longer current.

## Common Configuration Mistakes

### Creating Too Many Configurations

A SOLIDWORKS part with 20 configurations creates 20 Physical Products on the platform. Each needs its own properties, lifecycle management, and can be independently referenced. This is unmanageable.

**Fix**: Reduce to 1-3 configurations per part. Use separate parts for size variants.

### Properties on the Wrong Tab

Properties on the Summary tab are invisible in platform web apps. Users can't search for parts by part number or material.

**Fix**: Move all project-relevant properties to the Configuration Specific tab.

### Not Releasing Library Parts

Library parts left in "In Work" state can be accidentally modified by any team member. Released parts are frozen and safe.

**Fix**: Release all library parts immediately after upload.

### Modifying Released Data

Directly modifying Released data bypasses the change management process and creates audit trail gaps.

**Fix**: Always revise first, then modify the new revision.

## Best Practices

- **Plan configuration strategy before saving to the platform** — don't figure it out after
- **Use minimal configurations** — one per part is ideal
- **Store properties on Configuration Specific tab** — ensures platform visibility
- **Release library parts immediately** — prevents accidental modification
- **Use Protected Collaborative Spaces** — controls visibility by maturity state
- **Revise, don't modify Released data** — maintains change history
- **Limit who can release** — only authorized users should release data
- **Document the configuration strategy** — include it in your BIM/CAD Execution Plan
- **Train the team on Physical Product vs CAD Family** — this concept is fundamental
