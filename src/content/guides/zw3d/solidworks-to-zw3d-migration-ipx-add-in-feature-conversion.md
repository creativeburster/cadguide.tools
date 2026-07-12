---
title: "SolidWorks to ZW3D Migration: Using the IPX Add-in for Feature-Level Conversion"
excerpt: "ZW3D's IPX add-in converts SolidWorks parts, assemblies, and drawings to ZW3D format with feature history preserved. ZW3D 2026's IPX 2.0 achieves 90% conversion accuracy for SolidWorks files."
category: "migration"
softwareSlug: "zw3d"
keyword: "solidworks to zw3d migration ipx add-in feature conversion"
slug: "solidworks-to-zw3d-migration-ipx-add-in-feature-conversion"
author: "CADGuide Technical Editorial"
readTime: "9 min read"
date: "2026-07-12"
sources:
  - "https://blog.championxperience.com/from-solidworks-to-zw3d-an-easy-guide-to-sheet-metal-workflows/"
  - "https://www.zwsoft.com/news/products/zw3d-2026-smarter-more-specialized-fully-integrated/"
  - "https://www.zwsoft.com/product/zw3d/whats-new"
---

# SolidWorks to ZW3D Migration: Using the IPX Add-in for Feature-Level Conversion

For engineering teams considering a switch from SolidWorks to ZW3D, the biggest concern is legacy data: years of SolidWorks parts, assemblies, and drawings with feature trees, configurations, and equations. The standard approach — exporting to STEP and importing as dumb solids — loses all parametric history. ZW3D's **IPX add-in** solves this by converting SolidWorks data to ZW3D format with feature history preserved.

## What IPX Does

The IPX (Inter-Parametric eXchange) add-in converts SolidWorks data directly into ZW3D format. According to ZWSOFT and documentation from ChampionXperience (a ZW3D reseller), IPX supports:

- **Parts**: Feature tree history is transferred, including extrudes, cuts, fillets, patterns
- **Assemblies**: Assembly structure and mates are transferred
- **Drawings**: 2D drawing views and annotations are transferred
- **Sheet metal forming tools**: Forming tool library data is optionally translated and saved to the ZW3D library

ZW3D 2026's upgraded **IPX 2.0** engine achieves:
- **90%+ conversion accuracy** for SolidWorks files
- **85% conversion accuracy** for Creo files
- Significantly improved feature translation for parts, assemblies, and drawings

## Prerequisites

- **SolidWorks**: Must be installed and activated (maximum 2024 version supported as of IPX 2.0)
- **ZW3D**: Must be installed and activated (ZW3D 2026 SP2 or later for IPX 2.0)
- Both software must be on the same computer
- IPX add-in must be installed (available from ZWSOFT or your reseller)

## Running IPX

### Launch Options

IPX can be launched in two ways:

**Option A: From within SolidWorks**
1. Open SolidWorks (ensure no documents are open in the SolidWorks window)
2. Launch IPX from the SolidWorks add-in menu
3. Select the SolidWorks files to convert

**Option B: From the IPX application directly**
1. Launch the IPX application standalone
2. Select the SolidWorks files to convert
3. IPX will open SolidWorks in the background to read the files

### The Conversion Process

According to the ChampionXperience documentation, IPX works as follows:

1. IPX opens the selected SolidWorks models via SolidWorks
2. It examines each feature that makes up the model step by step (feature recognition)
3. After feature recognition is complete, IPX automatically launches ZW3D
4. IPX recreates the model in ZW3D step by step, building the feature tree
5. The model is saved in ZW3D format
6. ZW3D closes automatically when conversion is complete
7. IPX displays a conversion quality report (ratings like "Excellent", "Average")

### Forming Tool Library Translation

For sheet metal parts, IPX optionally translates the forming tool libraries used in the SolidWorks model and saves them to the ZW3D library. This means if a SolidWorks sheet metal part has forming operations (louvers, embosses, lances), the forming tool data is available in ZW3D after conversion.

## IPX Limitations

The ChampionXperience documentation notes important limitations:

- **Not all SolidWorks commands can be translated**: IPX may not support every SolidWorks feature type. Contact the ZW3D team for documentation on which commands IPX can and cannot translate.
- **Complex features may not convert perfectly**: Features with complex parametric relationships (equations, design tables, configurations) may require manual adjustment after conversion
- **Conversion quality varies**: The quality report ("Excellent", "Average") indicates how well the conversion went — "Average" results may need manual cleanup

## Alternative: STEP Import with Direct Editing

If IPX isn't available (e.g., you don't have SolidWorks installed), ZW3D's Direct Edit tools provide an alternative workflow for imported STEP files:

### Convert to Sheet Metal
1. Import the STEP file into ZW3D
2. Use **Direct Edit** tools to modify dimensions (Dim Move Face, DE Move, DE Pattern)
3. Use **Convert to Sheet Metal** to turn the dumb solid into a manufacturable sheet metal part
4. The "Collect all bend" option automatically finds all faces containing bends
5. The "Keep punch shape" option preserves emboss, louver, and lance features during conversion

### Direct Editing for Non-Sheet-Metal Parts
1. Import the STEP file
2. Use DE Move to move faces along a direction
3. Use DE Pattern to create linear or circular patterns of features
4. Use Dim Move Face to move faces with reference to a stationary face
5. All direct edits become features in the ZW3D model tree

This workflow doesn't preserve the original feature history, but it does allow editing of imported geometry with ZW3D's direct modeling tools.

## Migration Strategy

### For Small Teams (< 10 engineers)
1. Install IPX on one workstation with both SolidWorks and ZW3D
2. Convert active projects first using IPX
3. Archive inactive projects — convert on demand
4. Train engineers on ZW3D while maintaining SolidWorks access for reference

### For Larger Teams
1. Set up a dedicated conversion workstation with both SolidWorks and ZW3D
2. Batch-convert active projects using IPX
3. Use ZW3D's 25+ import format support for ongoing collaboration with SolidWorks users (native .sldprt/.sldasm import is supported)
4. For new projects, start directly in ZW3D to avoid conversion overhead

## ZW3D's Native SolidWorks File Support

Even without IPX, ZW3D can directly open SolidWorks files (.sldprt, .sldasm) as dumb solids. The Overdrive kernel reads the boundary representation geometry with reliable conversion, but parametric history is lost. This is useful for:
- Viewing and measuring SolidWorks files without a SolidWorks license
- Manufacturing parts from customer-supplied SolidWorks files
- Making direct edits to imported geometry

For full parametric conversion with feature history, IPX is the only option.

## Cost Considerations

- **IPX add-in**: Contact ZWSOFT or your reseller for pricing — it may be included with certain ZW3D license tiers
- **SolidWorks license for conversion**: You need an active SolidWorks license on the conversion workstation. If you're migrating away from SolidWorks, maintain at least one license during the transition period
- **Conversion labor**: Budget time for reviewing and cleaning up converted files, especially those rated "Average" by IPX
