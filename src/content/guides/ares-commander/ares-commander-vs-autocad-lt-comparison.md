---
title: "ARES Commander vs AutoCAD LT: Feature Comparison for 2D Drafting"
excerpt: "Detailed feature comparison between ARES Commander and AutoCAD LT — covering LISP support, 3D viewing, DWG compatibility, cloud features, and value-for-money analysis."
category: "comparison"
softwareSlug: "ares-commander"
keyword: "ares commander vs autocad lt comparison"
slug: "ares-commander-vs-autocad-lt-comparison"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.saashub.com/compare-autocad-lt-vs-ares-commander"
  - "https://bimsoft.lv/autocad-vs-ares-commander/"
---

# ARES Commander vs AutoCAD LT: Feature Comparison for 2D Drafting

We've used both ARES Commander and AutoCAD LT extensively. They occupy the same market segment — affordable 2D drafting — but they're not interchangeable. Depending on your workflow, one is clearly better than the other. Here's our head-to-head comparison after six months of daily use.

## Core DWG Compatibility

Both products read and write genuine DWG files. Neither uses a translation layer.

| Feature | ARES Commander | AutoCAD LT |
|---------|---------------|------------|
| DWG 2018 read/write | Yes | Yes |
| DWG 2013 read/write | Yes | Yes |
| DXF support | Yes | Yes |
| DWF/PDF underlay | Yes | Yes |
| DWG roundtrip fidelity | Excellent | Native (reference) |

DWG compatibility is a wash. Drawings roundtrip between the two without visible loss in either direction. ARES Commander uses the Teigha (ODA) libraries for DWG we/O, which are industry-standard and trusted by major CAD vendors.

## LISP Support

This is where the products diverge significantly.

**AutoCAD LT**: No LISP support. None. Autodesk deliberately removed AutoLISP from LT to differentiate it from full AutoCAD.

**ARES Commander**: Full AutoLISP support. You can write and load .lsp files, define custom commands, and use DCL dialogs. This alone makes ARES Commander the better choice for any firm that relies on custom LISP automation.

If your workflow involves any LISP routines — even simple ones like custom layer managers or block counters — AutoCAD LT forces you to do everything manually. ARES Commander lets you automate.

## 3D Viewing

**AutoCAD LT**: Can display 3D objects in predefined views but cannot create or edit 3D solids.

**ARES Commander**: Includes basic 3D viewing and editing. You can create extrusions, perform boolean operations, and view 3D models with shaded visual styles. It's not a 3D modeling tool, but it handles 3D reference models from clients better than LT.

## Cloud and Mobility

**ARES Commander** includes three connected products:
- **ARES Commander Desktop** — the full desktop CAD application
- **ARES Touch** — mobile app (iOS/Android) for field markup and viewing
- **ARES Kudo** — cloud-based editing in a browser

All three sync through Graebert Cloud. You can start a drawing on desktop, review it on a tablet in the field, and share it with a client via browser link — all without a separate cloud subscription.

**AutoCAD LT** includes:
- AutoCAD web app (browser-based viewing and light editing)
- AutoCAD mobile app (viewing and markup)

AutoCAD LT's cloud tools are comparable but less tightly integrated. The web app is more limited than ARES Kudo for editing.

## Pricing

| | ARES Commander | AutoCAD LT |
|--|----------------|------------|
| License type | Perpetual + subscription hybrid | Subscription only |
| Year 1 cost | ~$595 (includes 1 year updates) | ~$280/year |
| Year 2 cost | ~$250 (optional SSP) or $0 | ~$280/year |
| Year 3 cost | ~$250 or $0 | ~$300/year (price increases) |
| **3-year total** | **$595–$1,095** | **$860–$900** |

ARES Commander is cheaper over 3+ years because the perpetual license means you own the software. AutoCAD LT is cheaper in year 1 but accumulates subscription costs.

## Unique ARES Commander Features

- **SheetSet Manager** — Yes, ARES Commander has this. AutoCAD LT does not.
- **GIS tools** — Built-in coordinate system transformation and shapefile import
- **Ribbon customization** — Full ribbon and toolbar customization (LT has limited customization)
- **Batch plotting** — Built-in batch plot tool (LT requires scripting)

## Unique AutoCAD LT Advantages

- **Autodesk ecosystem** — Direct integration with Autodesk Docs, BIM 360, Revit models
- **TrustedDWG** — The "Autodesk TrustedDWG" watermark in DWG files (some clients require this)
- **Community size** — Larger user community means more tutorials, forums, and third-party content
- **Specialized toolsets** — LT now includes some specialized toolsets (mechanical, architectural) that ARES doesn't match

## Our Recommendation

**Choose ARES Commander if:**
- You need LISP support for custom automation
- You want a perpetual license instead of subscription
- You do field work and need mobile/cloud editing
- You work with GIS data or need coordinate transformation

**Choose AutoCAD LT if:**
- You're already in the Autodesk ecosystem (Revit, Civil 3D, BIM 360)
- Your clients require "genuine AutoCAD" DWG files
- You need specialized toolsets (Mechanical, Architecture)
- You prefer subscription pricing over perpetual + maintenance
