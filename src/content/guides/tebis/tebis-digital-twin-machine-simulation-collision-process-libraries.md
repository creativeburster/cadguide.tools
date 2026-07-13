---
title: "Tebis Digital Twin: Machine Simulation, Collision Checking, and Process Libraries"
excerpt: "Set up Tebis digital twins for CNC machines: virtual machine models, collision checking during NC calculation, process libraries for automated programming, and manufacturing environment digitalization."
category: "deployment"
softwareSlug: "tebis"
keyword: "tebis digital twin machine simulation collision checking process library"
slug: "tebis-digital-twin-machine-simulation-collision-process-libraries"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://www.tebis.com/en/sectors/mold-manufacturing"
  - "https://www.tebis.com/en/sectors/automotive"
---

# Tebis Digital Twin: Machine Simulation, Collision Checking, and Process Libraries

Tebis's digital twin concept is central to its approach to safe, automated manufacturing. The system creates exact virtual models of your manufacturing environment — machines, tools, fixtures, and clamping — and uses them during NC calculation to prevent collisions before they happen. This is essential for multi-machine operation and reduced-personnel manufacturing.

## What Is a Tebis Digital Twin?

A digital twin in Tebis is a complete virtual representation of the manufacturing environment:

- **Machine model** — the CNC machine with all axes, spindles, and tables
- **Tool assemblies** — tools with holders, extensions, and cutting geometry
- **Fixtures and clamping** — vises, clamps, tombstones, and workholding
- **Control system** — the machine's controller behavior and limits

The digital twin is used during NC calculation, not just for post-simulation. This means collisions are detected and avoided during toolpath generation, not after.

## Machine Model Setup

### Creating the Machine Model

Tebis consultants typically create the machine model during implementation:

1. **Import machine geometry** — from manufacturer CAD data or Tebis's machine library
2. **Define kinematics** — axis configurations, travel limits, rotation ranges
3. **Set collision pairs** — which components can collide with which
4. **Define the control model** — controller-specific behavior (look-ahead, axis transformations)

The machine model includes:
- **Linear axes** — X, Y, Z with travel limits
- **Rotary axes** — A, B, C with rotation limits and speed limits
- **Spindle** — nose cone, taper, and mounting
- **Table** — worktable dimensions and T-slot or bolt pattern
- **Axis interdependencies** — e.g., Z travel limited by B-axis position

### Machine Library

Tebis maintains a library of common CNC machine models. If your machine is in the library, the setup is faster — you only need to verify and customize it. For custom or unusual machines, Tebis creates the model from your machine specifications.

## Collision Checking During Calculation

Unlike systems that only check for collisions after toolpath generation, Tebis checks during calculation:

1. **Tool vs. part** — the cutting tool is checked against the part geometry
2. **Tool holder vs. part** — the holder and extensions are checked against the part
3. **Tool assembly vs. fixtures** — the entire tool assembly is checked against clamps and vises
4. **Spindle vs. table** — the spindle and machine head are checked against the table and workpiece
5. **Axis limits** — the calculation ensures no axis exceeds its travel or rotation limit

When a potential collision is detected:
- The toolpath is automatically modified to avoid the collision (e.g., tool tilts to avoid holder collision)
- If avoidance isn't possible, the area is flagged for manual review
- The collision is logged with details for the programmer to investigate

This approach means that by the time the NC program is posted, it's already collision-checked. Only collision-free programs are sent to the machine.

## Process Libraries

Tebis process libraries store manufacturing knowledge in a reusable form:

### Tool Library

1. **Define tools** with complete assemblies — cutter, holder, extension, gauge length
2. **Organize by category** — roughing, finishing, drilling, etc.
3. **Store cutting parameters** — speeds, feeds, depth of cut for each material
4. **Include tool life data** — for tool management integration

### Technology Library

1. **Store machining strategies** — complete operation sequences for specific feature types
2. **Include parameter sets** — proven parameters for different material/tool combinations
3. **Link to templates** — process libraries work with template technology

### Manufacturing Library

1. **Store machine configurations** — digital twins for each machine
2. **Store fixture definitions** — standard workholding setups
3. **Store proven setups** — complete job setups for repeat parts

## Template Technology

Templates combine process library elements into complete machining sequences:

1. **Create a template** from a proven machining job
2. The template references tools, strategies, and parameters from the libraries
3. **Apply the template** to a new part — Tebis adapts it to the new geometry
4. The digital twin ensures the adapted toolpath is collision-free

For a shop producing 50 similar injection molds per year, templates can reduce programming time from 4 hours to 30 minutes per mold.

## Shop Floor Benefits

The digital twin approach enables:

- **Multi-machine operation** — one programmer can support multiple machines because programs are collision-free
- **Reduced-personnel manufacturing** — operators can run machines with confidence because the programs are verified
- **Lights-out machining** — unattended operation is safer when all collisions have been checked
- **Faster setup** — standard fixtures and setups are stored in the library
- **Consistent quality** — proven parameters from the library ensure repeatable results

## Implementation Process

Implementing Tebis digital twins typically follows this process:

1. **Machine survey** — Tebis consultants document each machine's geometry and kinematics
2. **Machine model creation** — the digital twin is built and verified
3. **Tool library setup** — existing tools are digitized and entered
4. **Process library creation** — proven machining strategies are documented and stored
5. **Template creation** — templates are built for common part types
6. **Training** — programmers and operators learn the system
7. **Pilot project** — a real part is programmed and machined to validate the setup

This process typically takes 2-4 weeks per machine, depending on complexity.

## Common Issues

### Machine Model Inaccuracies

If the digital twin doesn't match the physical machine, collision checking may miss real collisions or flag false ones. Verify the machine model against the actual machine after any maintenance or modification.

### Outdated Tool Dimensions

If tools in the library don't match the actual tools (wrong holder, different gauge length), collisions may occur. Keep the tool library updated and verify tool assemblies before each job.

### Missing Fixtures

If fixtures aren't included in the digital twin, collisions with clamps won't be detected. Always model the complete workholding setup, including clamps, vises, and support blocks.

## Best Practices

- **Keep the digital twin current** — update after any machine modification
- **Model all fixtures** — incomplete fixture models lead to missed collisions
- **Use proven parameters** — store and reuse parameters from the process library
- **Create templates for repeat part types** — this is where the biggest time savings are
- **Train operators** — they should understand the simulation and verification process
- **Review collision logs** — even avoided collisions indicate areas where the setup could be improved
