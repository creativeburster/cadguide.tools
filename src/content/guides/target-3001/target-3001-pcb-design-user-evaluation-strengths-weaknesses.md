---
title: "TARGET 3001! PCB Design: Real User Evaluation — Autorouter Quality, 3D Preview Performance, Update Pricing, and Component Library Evolution"
excerpt: "TARGET 3001! has been developed since 1992 with a single-file project architecture and integrated simulation. But users report the built-in autorouter hasn't been updated in 10 years, 3D preview can take 2 hours for bitmap imports, and paid updates don't fix bugs. We cover the real strengths and weaknesses from user reviews."
category: "evaluation"
softwareSlug: "target-3001"
keyword: "TARGET 3001 PCB design review autorouter 3D preview performance update pricing component library"
slug: "target-3001-pcb-design-user-evaluation-strengths-weaknesses"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-07-30"
sources:
  - "https://server.ibfriedrich.com/wiki/ibfwikien/index.php/Difficulties"
  - "https://pcbshopper.com/target-3001-discover-reviews/"
  - "https://en.wikipedia.org/wiki/TARGET_(CAD_software)"
---

# TARGET 3001! PCB Design: Real User Evaluation — Autorouter Quality, 3D Preview Performance, Update Pricing, and Component Library Evolution

TARGET 3001! is a German PCB design tool developed by Ing.-Büro Friedrich since 1992. Its single-file project architecture and integrated schematic-simulation-layout workflow are genuine differentiators. However, long-term users report persistent issues that prospective buyers should understand before committing.

## Architecture: The Single-File Advantage

TARGET 3001! stores all project data — schematic, layout, simulation, 3D model, component data — in **one central project file**. This eliminates:
- Version conflicts between schematic and layout
- Forward/back annotation issues (renamings, renumberings, pin/gate swaps are automatically synchronized)
- File management complexity

Both schematic and layout can be viewed simultaneously in separate windows, with real-time data integration. This is a real architectural advantage over tools that maintain separate schematic and PCB files.

## The Autorouter Problem

### Built-in Autorouter

Users report that the integrated autorouter is **"so terrible (not updated since maybe 10 years)"**. The gridless shape-based contour autorouter supports:
- Single, double, and multilayer routing
- SMD and component routing
- Pads rotated at any angle
- Copper sharing (connections)
- Design rule maintenance

Despite these claimed capabilities, the actual routing quality is insufficient for production use according to long-term users.

### Electra Autorouter (OEM)

TARGET 3001! includes an OEM version of the **Electra** autorouter, but it's **limited to 250 pins** — making it "almost useless" for users with the full version of TARGET 3001! who need to route larger designs.

### Push and Shove

Manual routing includes push-and-shove functionality — when routing a new track, existing traces are pushed aside as needed while respecting spacing rules. This is a modern feature that helps compensate for the weak autorouter.

### User Recommendation

> "If you are lucky, something works better for you with the next version. For me, nothing ever changed."

Users who need automated routing should consider external autorouters via the **Specctra interface** or plan to route manually.

## 3D Preview Performance

### The Bitmap Import Problem

When importing bitmap graphics (e.g., a company logo for the silkscreen), the 3D preview becomes unusable:

- Rendering a small BMP for the 3D preview can take **30 minutes to 2 hours**
- This occurs regardless of CPU power — even on a 3GHz i7 processor
- The 3D preview feature becomes effectively broken when bitmap elements are present

### Normal 3D View

Without bitmap imports, the 3D view works on button click and supports:
- STEP format export for 3D printer preview dummies
- IDF format export for mechanical CAD data exchange
- Rotation and visualization of the designed PCB

## Update Pricing and Bug Fix Policy

### The Core Complaint

Long-term users (8+ years) report a frustrating update cycle:

> "They never fix just one real issue, but integrate some more or less useful functions with every version. You pay for an update in hope to get the issues fixed, because they do not fix issues within the same version number."

### Update Policy

- **Free updates within the current main version number** (e.g., V18.0 to V18.5)
- **Paid upgrades** between major versions (V17 → V18 → V19)
- Bug fixes are reportedly not provided within a major version — users must pay for the next major version to get fixes
- New features are added with each major version, but existing bugs persist

### User Assessment

> "The software team is only doing a good job with keeping their cash flow going, but not with supporting the software. Target 3001 has many many issues I would allow a free software to have, but as soon it comes to the paid version, it is not acceptable to carry the same super stupid problems from version to version."

## Component Library Evolution

The library system has undergone significant changes across versions:

| Version | Library Change |
|---------|---------------|
| Pre-V15 | All Conrad Electronic components included — cumbersome, bloated, poor search |
| V15 | Parametric searchable offline SQL database |
| V16 | Dual-monitor operation, visual gallery search |
| V17 | Housing generator, Componiverse portal integration |
| V18 | Component toolbar, symbol generator |

### Current State

- **36,000+ components** in the online database (free access for all users)
- **Componiverse** online portal for community-contributed components
- Components stored in SQLite or MySQL database (externally accessible)
- Component data includes: datasheet links, supplier information, simulation models, 3D models
- **CXF format** (Component Interchange Format) supported by Ultra Librarian and Footprint Expert
- Custom component creation is possible but "took a little getting used to"

### Making Components from Scratch

Users report that creating components and packages from scratch has a learning curve. The most efficient approach is to use existing parts as templates and modify them for new components.

## Technical Support: The Bright Spot

Despite software issues, users consistently praise TARGET 3001!'s technical support:

> "All of my emailed questions were answered quickly, patiently and thoroughly. To me that high level of support is as important as any other aspect of a software tool."

Support helped users:
- Find specific components that were causing trouble
- Understand workarounds for software limitations
- Navigate the online documentation gaps

## Documentation Gaps

The online help system has acknowledged gaps:

> "TARGET 3001! Help is entirely online. I found that the online descriptions and tutorials have gaps that really made it difficult for me to figure out how to do certain things."

The **Difficulties** page in the TARGET 3001! wiki addresses common questions:
- Layer concept (why outline layer is 23, etc.)
- "Check project" error explanations
- "Unnamed" title bar issue (refers to schematic page name, not project name)
- Component Server access through proxy servers
- Power input splitting in symbols

## Key Design Rules: The Aura System

TARGET 3001! uses an **aura** system for spacing control:

- Every signal track has an aura (security spacing) of **0.3mm by default** on both sides
- Two different signals whose auras touch trigger a spacing violation alert (if Realtime DRC is active)
- **GND tracks have aura = 0** — they connect directly to ground planes
- **Non-GND signals** use the aura as isolation spacing through ground planes
- Aura can be adjusted per signal via M11 click
- Aura is invisible by default but can be displayed on the deletion layer

With 0.3mm aura, TARGET 3001! expects minimum 0.6mm+ spacing between tracks.

## Free Version Limitations

- **Non-commercial use**: Free, limited to **250 connection pins or pads** on **two copper layers**
- **PCB-Pool/Conrad free version**: Unlimited pins, but output restricted to PCB-Pool/Conrad manufacturing service
- **Commercial versions**: All features unlocked, Gerber output for any PCB fab

## Export Formats

TARGET 3001! supports comprehensive output:
- Gerber RS274-D and RS274-X
- Excellon and Sieb&Meyer drill formats
- DXF, Postscript
- TARGET-ASCII (open interface)
- HPGL and other milling formats
- IDF (3D data to mechanical CAD)
- TGR (Polar Instruments) and DIF (digitaltest) for E-testing
- Native T3001 files accepted directly by some PCB houses

## Migration Path

TARGET 3001! supports import/export from:
- **Eagle**: Schematic files, board files, and library import
- **Mentor and OrCAD**: Netlist import
- **Gerber**: Import for further editing (reverse engineering from Gerber)
- Netlist formats: Protel, OrCAD, Calay

## Who Should Use TARGET 3001!

| Scenario | Recommendation |
|----------|---------------|
| Hobbyist with simple boards (< 250 pins) | Free version is capable |
| Professional needing single-file simplicity | Good choice if you can tolerate autorouter limitations |
| Designs requiring automated routing | Look elsewhere — autorouter is outdated, Electra limited to 250 pins |
| Designs with bitmap logos on silkscreen | 3D preview will be extremely slow |
| Budget-conscious with need for Gerber output | Commercial version is reasonably priced |
| Need for frequent bug fixes | Consider KiCad or CircuitMaker instead — update policy is frustrating |
| Value responsive technical support | TARGET 3001! excels here |

## User Bottom Line

> "My advice to everyone who wants to start with a new software: Do NOT take Target 3001. Go with a far more professional product like KiCad or CircuitMaker. A little harder to learn, but worth the effort."

> "I think Target 3001 is an excellent tool. The fact that it has a Gerber output driver is a big +. [...] Target 3001 really stands out as top of the line [for support]."

The divergence in these reviews reflects different use cases: users with simple boards and manual routing are satisfied; users needing automated routing and reliable 3D preview are frustrated.
