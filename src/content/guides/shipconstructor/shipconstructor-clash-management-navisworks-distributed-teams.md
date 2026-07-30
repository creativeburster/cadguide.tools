---
title: "ShipConstructor Clash Management: Multi-CAD Interference Detection with Navisworks for Distributed Shipbuilding Teams"
excerpt: "Shipbuilding projects involve multiple CAD authoring tools across distributed teams, making clash detection a cross-platform challenge. We cover SSI's recommended strategy using Navisworks Manage for multi-CAD clash management, EnterprisePlatform for shipyard integration, and the incremental 2D-to-3D transition model used by Robert Allan Ltd."
category: "workflow"
softwareSlug: "shipconstructor"
keyword: "ShipConstructor clash detection Navisworks distributed team multi-CAD shipbuilding workflow"
slug: "shipconstructor-clash-management-navisworks-distributed-teams"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-07-30"
sources:
  - "https://www.ssi-corporate.com/blog-waveform/shipconstructor-tips-tricks-clash-management/"
  - "https://www.ssi-corporate.com/content/robert-allan-ship-design-shipconstructor/"
  - "https://www.ssi-corporate.com/blog-waveform/todays-challenge-distributed-teams-using-unique-cad-authoring-tools/"
---

# ShipConstructor Clash Management: Multi-CAD Interference Detection with Navisworks for Distributed Shipbuilding Teams

Interferences found on the production floor are among the most costly and schedule-disrupting issues in shipbuilding. While ShipConstructor has native clash detection, the real challenge is managing clashes **across multiple CAD authoring tools** — when one subcontractor uses ShipConstructor, another uses a different CAD system, and a previous design exists in yet another format. SSI's recommended strategy uses Autodesk Navisworks Manage as the neutral clash management hub.

## The Multi-CAD Clash Problem

Modern shipbuilding projects frequently involve distributed teams using different CAD tools:

- **Structure, piping, outfitting**: ShipConstructor
- **Subcontracted portions**: May use different CAD systems
- **Previous designs**: Often in legacy formats from other tools

When teams pass files back and forth between sites, multiple problems arise:

1. Files are large and slow to transfer
2. The model is actively being worked on, requiring frequent updates
3. Shared formats often lack non-geometric information needed for production review
4. Manual clash detection has no way to manage or communicate findings
5. With frequent file exchanges, tracking the latest version becomes difficult
6. Proper design or production reviews are nearly impossible

## The Navisworks Strategy

SSI recommends Navisworks Manage as the central clash management tool for multi-CAD environments. The benefits address each problem above:

### 1. Universal CAD Format Support

Navisworks reads virtually any CAD system's data. No other tool matches its breadth of format support. This means the same clash detection strategy works regardless of which CAD tools each team uses.

### 2. Fast, Accurate Clash Detection

An entire ship (~80m) can be clash-checked in **under a minute**. This speed enables frequent checks throughout the design process rather than waiting until detail design is complete.

### 3. Rich Visualization

After identifying clashes, Navisworks provides multiple options for viewing the interference — section cuts, transparency, isolation, and color coding — making it easy to understand the nature of each conflict.

### 4. Mobile and Browser Access

Clashes can be viewed, commented on, and managed from a **mobile device or web browser**. This is critical for distributed teams where not everyone has access to the authoring CAD tool.

### 5. No Authoring CAD License Required

Users can initiate, view, comment, and manage clashes without either authoring CAD tool. The clashes and attributes are stored within the Navisworks file. Only the user who needs to make corrective changes needs the source CAD application.

### 6. Automatic Source File Updates

Navisworks maintains reference links to source CAD files. When a source file is modified and saved, Navisworks automatically updates on refresh — ensuring clash detection always runs against the latest design data.

## Implementing the Strategy

### Step 1: Export from ShipConstructor

Export the ShipConstructor model in a Navisworks-compatible format (NWC or NWD). ShipConstructor's AutoCAD-based architecture supports this natively.

### Step 2: Import Foreign CAD Data

Import CAD files from other authoring tools into the same Navisworks project. Navisworks reads native formats from CATIA, NX, SolidWorks, Inventor, Revit, and many others.

### Step 3: Run Clash Detection

1. Define clash test sets (e.g., ShipConstructor structure vs. subcontractor piping)
2. Run automated clash detection
3. Review results in the clash detection report
4. Each clash includes location, participating objects, and clearance distance

### Step 4: Manage and Resolve

1. Assign clashes to team members for resolution
2. Add comments and status updates
3. The assigned user opens the source CAD tool, makes corrections, and saves
4. Refresh Navisworks — the resolved clash disappears automatically
5. Re-run clash detection to confirm no new interferences were introduced

## EnterprisePlatform for Shipyards

Beyond clash detection, ShipConstructor's EnterprisePlatform enables structured information sharing with shipyards:

### Optimized Purchasing BOM

- Generate purchasing BOMs directly from the ShipConstructor model
- Use BOMs for cost estimation during the validation phase, before formal design
- Materials are procured more accurately, reducing waste and shortages

### Profile Cutting Optimization

Instead of shipyard workers reading assembly drawings and manually adding up profiles:

- Combine report data and profile plots into a single printable A4 sheet
- Each profile is a line item rather than a drawing — the cutting department can filter by assembly
- Results in: more accurate pricing, precise material stocking, less production time on counting, and agile cutting operations

## Incremental 2D-to-3D Transition

Robert Allan Ltd.'s 35-year partnership with SSI demonstrates a practical transition model for shipyards moving from 2D to 3D:

### The Challenge

- Increasing vessel complexity
- Tighter delivery timelines
- 2D document-centric workflows limiting constructability assessment
- Risk of disrupting proven shipbuilding practices

### The Solution

Rather than forcing a complete workflow revolution:

1. **Embed 3D incrementally**: Introduce model-based design into existing processes without replacing them overnight
2. **Single source of truth**: Shared 3D models replace ambiguous 2D drawings for coordination
3. **Earlier interference detection**: Catch clashes in detail design, not on the production floor
4. **Access reviews**: 3D models enable virtual walk-throughs for access and maintainability checks
5. **Cleaner deliverables**: Assembly and spool drawings generated directly from the model

### Results

- Shorter production timelines (structural design phases reduced significantly depending on vessel size)
- Improved constructability through earlier visibility into interferences
- Stronger shipyard collaboration through shared models and structured reviews
- Foundation for future AI-driven capabilities through improved data structuring

## Integrating Early-Stage Engineering

A common pitfall is assuming one engineering tool must handle everything from concept to production. In practice:

- **Initial design**: Tools like NAPA Steel, ExpressMarine, or Seanaptic for rapid basic structural design
- **Basic design**: Models created for classification society review — but lack manufacturing detail
- **Detail design**: ShipConstructor recreates the model with production-level detail

SSI's approach uses **Open APIs** to bridge this gap — when basic design wasn't started in ShipConstructor, the API enables beginning detail design where basic design left off, reducing rework.

### PLM Integration

A PLM system centralizes information across all design phases:
- Requirements capture and management
- Product decomposition (ship work breakdown structures)
- Centralized storage for CAD and CAE data under revision control
- Project drawings, documents, and BOMs management
- Knowledge capture from previous projects for reuse

This addresses the fundamental challenge: the multiplicity of tools across design phases makes data handling and sharing between departments, phases, and partners a complex task that PLM systems are designed to solve.
