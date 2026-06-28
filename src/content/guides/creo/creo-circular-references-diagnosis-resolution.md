---
title: "Creo Circular References: Diagnosis and Resolution Using .crc Files and Reference Viewer"
excerpt: "Circular references in Creo are silent model killers — they don't break the model immediately but cause unpredictable failures later. I cover the .crc file analysis, Reference Viewer workflow, and modeling practices that prevent them."
category: "troubleshooting"
softwareSlug: "creo"
keyword: "Creo circular references troubleshooting crc file"
slug: "creo-circular-references-diagnosis-resolution"
author: "CAD IT Admin"
readTime: "8 min"
date: "2025-06-16"
sources:
  - "https://community.ptc.com/t5/3D-Part-Assembly-Design/how-to-troubleshoot-circular-references/td-p/866942"
  - "https://support.ptc.com/help/creo/creo_pma/r9.0/usascii/index.html#page/assembly/asm/To_Investigate_Circular_References.html"
---

# Creo Circular References: Diagnosis and Resolution Using .crc Files and Reference Viewer

A user on the PTC Community forum asked a question that resonated with every Creo user who has worked on complex assemblies: "I often encounter circular references problems. Although it can be laid aside because often this problem doesn't have fatal danger to my models, the notification looks uncomfortable to me. But when I take a deep insight into this problem, I always failed to find which dependency relation is the cause."

Troubleshooting circular references requires understanding how Creo's dependency chain works.

The response from experienced users was unequivocal: "Circular references should never be left in a design! They are extreme high risk to cause huge problems." This is advice I've internalized over years of Creo administration. Circular references are time bombs — they don't break your model today, but they will break it at the worst possible moment, usually during a design change or a version upgrade.

## What Is a Circular Reference?

A circular reference occurs when feature A depends on feature B, and feature B depends on feature A (directly or through a chain of dependencies). Creo's regeneration order requires a linear dependency chain — each feature must be regenerated before any feature that depends on it. A circular dependency makes this impossible, so Creo either fails to regenerate or uses a workaround that produces unpredictable results.

### How Circular References Happen

They typically occur when:
1. You create a feature that references geometry from a later feature in the model tree
2. You use assembly-level references (datum planes, axes) that depend on components that in turn depend on the assembly
3. You create cross-part references in an assembly where Part A references Part B and Part B references Part A
4. You reorder features without checking dependency chains

## Diagnosis: The .crc File

When Creo detects a circular reference, it writes a `.crc` (circular reference chain) file to your working directory. This file is the key to diagnosing the problem.

### Finding the .crc File

1. After the circular reference warning appears, note the working directory
2. Open File Explorer and navigate to the working directory
3. Look for a file with a `.crc` extension (e.g., `bracket.prt.crc` or `assembly.asm.crc`)
4. Open it in a text editor (Notepad or Notepad++)

### Reading the .crc File

The file lists the circular dependency chain. It looks something like this:

```
CIRCULAR REFERENCE CHAIN:

Feature #25 (Cut id 142) in BRACKET.PRT
  references
Feature #18 (Round id 89) in BRACKET.PRT
  references
Feature #22 (Datum plane id 110) in BRACKET.PRT
  references
Feature #25 (Cut id 142) in BRACKET.PRT
```

This tells you:
- Feature #25 (a cut) references Feature #18 (a round)
- Feature #18 references Feature #22 (a datum plane)
- Feature #22 references Feature #25 (the cut)
- The chain is: 25 → 18 → 22 → 25 — circular

The forum user who asked the question later confirmed: "I find out that .crc file, open with notepad and it lists the circular features clearly. Thank you very much."

## Resolution: Using the Reference Viewer

Once you've identified the circular chain from the .crc file, use the Reference Viewer to visualize and fix the dependencies.

### Opening the Reference Viewer

1. In Creo, go to **Tools → Reference Viewer** (or **Investigate → Reference Viewer** in newer versions)
2. The Reference Viewer shows a tree of all references in the current model
3. You can also access it by right-clicking a feature in the model tree → **Reference Viewer**

### Tracing the Circular Chain

1. Start with the first feature in the .crc chain (e.g., Feature #25)
2. In the Reference Viewer, find this feature
3. Expand its references — you'll see which features it depends on
4. Follow the chain until you find the reference that closes the loop
5. The reference that creates the cycle is the one you need to break

### Breaking the Circular Reference

Once you've identified the problematic reference, you have several options:

**Option 1: Redefine the feature to use a different reference**
1. Right-click the feature → **Edit References**
2. Replace the circular reference with a non-circular one
3. For example, if a cut references a round that references a datum that references the cut, redefine the cut to reference an earlier datum plane

**Option 2: Reorder features**
1. In the model tree, drag the feature to an earlier position
2. This may break the circular chain if the feature was referencing something that comes after it
3. However, reordering may cause other features to fail — check the model tree for errors after reordering

**Option 3: Delete and recreate the feature**
1. If the feature's references are too tangled to fix, delete it
2. Recreate it with clean references that don't create a cycle
3. This is the most reliable fix but requires rework

## Prevention: Modeling Best Practices

Preventing circular references is much easier than fixing them. Here are the practices I enforce with my team:

### 1. Always Reference Earlier Features

When creating a new feature, only reference features that appear earlier in the model tree. Never reference a feature that comes after the current one. This ensures a linear dependency chain.

### 2. Use Skeleton Models for Assembly References

In assemblies, create a skeleton model that contains all the datum planes, axes, and surfaces that components will reference. Components reference the skeleton, not each other. Since the skeleton doesn't reference any component, circular references are impossible.

### 3. Avoid Cross-Part References in Assemblies

If Part A needs geometry from Part B, don't reference Part B directly. Instead:
1. Create the shared geometry in the skeleton model
2. Both Part A and Part B reference the skeleton
3. This breaks the cross-part dependency

### 4. Use Publish Geometry and Copy Geometry

For cross-part references that are unavoidable:
1. In the source part, create a **Publish Geometry** feature
2. In the target part, use **Copy Geometry** to import the published geometry
3. This creates a one-way dependency (target depends on source) that can't become circular

### 5. Check for Circular References After Every Major Change

After reordering features, adding new features, or changing references:
1. Regenerate the model
2. Check for circular reference warnings in the message log
3. If a warning appears, check the .crc file immediately
4. Fix the circular reference before continuing — don't save the model with a known circular reference

## Common Circular Reference Scenarios

### Scenario 1: Assembly Datum Referencing a Component

You create a datum plane in the assembly that is offset from a face in Component A. Then you add Component B, which references the assembly datum. If Component A is later modified to reference Component B, you have a cycle: Assembly Datum → Component A → Component B → Assembly Datum.

**Fix**: Create the datum in a skeleton model instead of the assembly.

### Scenario 2: Pattern Referencing a Feature Inside the Pattern

You create a hole pattern, then add a fillet that references one of the patterned holes. If the fillet is placed before the pattern in the model tree, the pattern can't regenerate because it depends on the fillet, which depends on the pattern.

**Fix**: Place the fillet after the pattern in the model tree, or apply the fillet to the pattern leader before patterning.

### Scenario 3: Mirrored Feature Referencing Its Mirror

You mirror a feature, then create a new feature that references the mirrored geometry. If you then try to make the original feature depend on the new feature, you have a cycle.

**Fix**: Don't create dependencies from the original to features that reference the mirror.

## Summary

Circular references in Creo are preventable with good modeling practices and fixable with the .crc file and Reference Viewer. The key points:

1. **Always check the .crc file** when a circular reference warning appears
2. **Use the Reference Viewer** to trace and break the dependency chain
3. **Use skeleton models** for assembly-level references to prevent cross-part cycles
4. **Always reference earlier features** — never create a dependency on a later feature
5. **Fix circular references immediately** — don't save a model with a known cycle

As the experienced forum user said: "Circular references should never be left in a design." They may not break your model today, but they will cause unpredictable failures during future design changes, version upgrades, or when another engineer tries to modify your model.
