---
title: "FORAN Interoperability: CAD Data Exchange with PLM Systems, JT Format Integration, 3D Model Import Limitations, and Performance Optimization for Large Ship Models"
excerpt: "FORAN's shipbuilding database stores minimal geometry but must exchange full models with PLM systems (Windchill, Teamcenter) and import third-party equipment. We cover the JT format integration via CAD Exchanger, LOD support for large model performance, parallel computation speedups, and user-reported import/export limitations."
category: "interoperability"
softwareSlug: "foran"
keyword: "FORAN CAD data exchange PLM JT format CAD Exchanger import export interoperability shipbuilding"
slug: "foran-interoperability-cad-data-exchange-plm-jt-large-model-performance"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://cadexchanger.com/customers/sener-marine-embraces-cad-exchanger-competencies-to-deliver-state-of-the-art-shipbuilding-expertise/"
  - "https://www.cadinterop.com/en/our-products/cad-exchanger-software/sener.html"
  - "https://www.boatdesign.net/threads/nupas-cadmaric-and-foran.7610/"
---

# FORAN Interoperability: CAD Data Exchange with PLM Systems, JT Format Integration, 3D Model Import Limitations, and Performance Optimization for Large Ship Models

FORAN (developed by SENER Marine, acquired by Siemens in 2021) is a CAD/CAM/CAE system for ship design that has been continuously developed since 1965. Its database stores minimal geometry — a cylinder is defined by start point, radius, length, and axis orientation rather than full B-Rep representation. This efficient storage approach creates challenges when exchanging data with PLM systems and importing third-party equipment models. This guide covers the interoperability landscape, performance optimization, and real user-reported limitations.

## The Data Exchange Challenge

### FORAN's Minimalist Database

FORAN stores only the necessary minimum of information:
- Geometry is defined parametrically (e.g., cylinder = start point + radius + length + axis)
- Attributes include simulation, fabrication, stock management, and material definition data
- This approach is efficient for storage but insufficient for direct exchange with systems expecting full B-Rep or tessellated representations

### Two-Way Exchange Requirements

FORAN must both:
- **Import** external data: machinery and equipment designed by third parties (engines, pumps, valves) in SolidWorks, CATIA, Pro/E, Inventor, etc.
- **Export** to downstream applications: manufacturing and assembly steps require data extraction depending on production methods and tools

### The PLM Integration Imperative (2012)

In 2012, FORAN aimed to integrate with two leading PLM systems: **Windchill** and **Teamcenter**. The preferred exchange format for PLM connection was **JT** — the standard format across the Siemens ecosystem.

SENER evaluated two options:
1. **Develop in-house**: Would require recruiting new employees with JT format expertise
2. **Outsource to CAD Exchanger**: Already had expertise in multiple CAD formats and geometric kernel interoperability

SENER chose CAD Exchanger, which became an integral part of FORAN's data exchange infrastructure.

## CAD Exchanger Integration in FORAN

### Format Support Added

Through CAD Exchanger, FORAN gained support for:
- **JT** (primary PLM exchange format)
- **STEP**
- **IGES**
- **DXF**
- **IFC**

### User-Defined Properties

CAD Exchanger tailored JT implementation to meet FORAN's specific needs, including **user-defined properties support** — allowing FORAN to pass custom attributes (material specs, stock codes, fabrication attributes) through the JT format alongside geometry.

## Performance Optimization for Large Ship Models

### The Large Model Problem

FORAN regularly deals with huge models:
- Parts range from ship hulls to tiny screws
- Models may load too slowly — engineers open a model just to take a quick look and end up waiting several minutes
- Moving models in a 3D scene is another performance problem

### Levels of Detail (LOD)

CAD Exchanger added **multiple LOD** support to FORAN:
- Multiple polygonal representations from coarse to fine
- Coarse LOD for quick preview and navigation
- Fine LOD for detailed inspection and measurement
- LODs are native to JT format; for other formats, CAD Exchanger implemented LOD representations in format-native ways

**Result**: Engineers can quickly preview large models without loading full-resolution geometry, then switch to fine LOD only where needed.

### Parallel Computation Speedup

SENER's clients noticed slowness in geometric algorithms used for:
- Weld search
- Plates and profiles modeling
- Other geometric operations

CAD Exchanger's solution:
1. **Profiled FORAN's code** to find exact causes of sluggishness
2. **Identified data race causes** and thread contention issues
3. **Implemented computational parallelism** — non-trivial in complex code with numerous lurking problems (data races, thread contention)
4. **Result**: Some algorithms accelerated **10×** for medium-sized models, up to **60×** for larger models

## User-Reported Interoperability Limitations

### 3D Model Import Challenges

Users on boat design forums report significant issues with FORAN's 3D model import:

> "Foran is hard to use. It's not really Windows interface. All menus are very special because Foran is able to work on Unix platform. Logic of the interface is very special. Usually you have to buy training. To learn it without training practically impossible due to poor documentation."

> "Foran is waaaay harder to use (too much steps in between your idea and the pipe on the definitive place)"

### The Geometric Kernel Problem

Shipbuilding software historically originated in 2D (to serve cutting machines) and has poor geometric kernels compared to mainstream CAD:

| Software | Geometric Kernel |
|----------|-----------------|
| Unigraphics/NX, SolidWorks | Parasolid |
| Inventor, AutoCAD, Mechanical Desktop | ACIS |
| FORAN | Custom (not Parasolid or ACIS) |
| ShipConstructor | ACIS (via AutoCAD) |

### Import/Export Chain

For importing 3D models from mainstream CAD into FORAN, users report the exchange chain is not straightforward:
- Standard exchange formats: Parasolid (.x_t), ACIS (.sat), STEP (.stp)
- FORAN should have STEP import, but users report never seeing successful results
- The lack of Parasolid or ACIS kernel means direct native format import is not possible

### Resource Requirements

> "It's very heavy to use. You need a lot of computer resources, additional software like Oracle, and additionally it takes a lot of time to learn."

FORAN requires:
- Significant hardware resources
- Oracle database (additional licensing and administration)
- Extensive training (self-learning is "practically impossible" due to poor documentation)
- Windows-only (no macOS or Linux client, though historically Unix-compatible)

## Comparison with Other Shipbuilding Software

| Software | Kernel | Ease of Use | 3D Import | Cost |
|----------|--------|-------------|-----------|------|
| FORAN | Custom | Difficult, requires training | Via STEP/JT (CAD Exchanger) | High |
| ShipConstructor | ACIS (AutoCAD) | Moderate (AutoCAD-based) | Native ACIS/Parasolid via AutoCAD | Moderate |
| NUPAS-Cadmatic | Custom | Easy, graphical | Via ACIS → DWG chain | High |
| CADMATIC | Custom | Easier than FORAN | Problems with 3D import/export | High |

### ShipConstructor Advantage

ShipConstructor is based on AutoCAD and the ACIS kernel, making it:
- Completely compatible with solids from Mechanical Desktop, Inventor, and other ACIS-based systems
- Able to import Parasolid files through AutoCAD's translation
- More familiar interface for AutoCAD users
- Generally considered easier to learn than FORAN

## FORAN Learning Curve and ROI

SENER presented a study at the COMPIT conference analyzing:
- **Learning curve**: Based on data from shipyards that recently started using FORAN, collected over 2 years
- **Labor mobility impact**: Key factor affecting implementation — high turnover extends the learning curve
- **ROI**: Results were "very positive" once the learning curve was overcome
- **50th anniversary**: In 2015, FORAN celebrated 50 years — the longest-standing product of its kind

### Key Implementation Factors

1. **Training is mandatory** — self-learning is not practical
2. **Labor mobility** is the biggest risk to ROI — when trained drafters leave, the investment is lost
3. **Shipyard commitment** to the implementation process is essential
4. **2-year data** showed positive ROI once teams reached proficiency

## Best Practices for FORAN Interoperability

1. **Use JT format for PLM exchange** — it's the Siemens ecosystem standard and best supported via CAD Exchanger
2. **Leverage LOD for large model navigation** — use coarse LOD for preview, fine LOD for detail work
3. **Invest in training** — the learning curve is steep and documentation is insufficient for self-learning
4. **Plan for Oracle database administration** — it's a required component that adds IT overhead
5. **For third-party equipment import**: Export from source CAD to STEP, then import via CAD Exchanger
6. **Consider ShipConstructor** if ACIS/Parasolid compatibility is critical for your supply chain
7. **Budget for hardware** — FORAN is resource-intensive, especially with large ship models
8. **Retain trained staff** — labor mobility is the biggest threat to FORAN ROI
9. **Use parallel computation** where available — 10-60× speedup on geometric algorithms
10. **For machinery/outfitting**: Evaluate whether a mainstream CAD (SolidWorks, Inventor) with shipbuilding add-ons might be more interoperable than FORAN for sub-supplier model exchange
