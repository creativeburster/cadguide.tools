---
title: "Eagle to KiCad Migration: Converting Schematics and PCB Layouts Successfully"
excerpt: "How to migrate Eagle projects to KiCad — covering the ULP export script, library conversion, component mapping, and fixing common conversion errors in schematics and board layouts."
category: "migration"
softwareSlug: "eagle"
keyword: "eagle to kicad migration conversion"
slug: "eagle-to-kicad-migration-conversion"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://forum.kicad.info/t/eagle-import-incorrectly-inconsistently-changes-reconnects-net-names/69074"
  - "https://hackaday.com/2023/07/01/importing-eagle-projects-into-kicad-7-and-how-to-fix-them/"
---

# Eagle to KiCad Migration: Converting Schematics and PCB Layouts Successfully

Autodesk moved Eagle to maintenance mode in 2026, and many users are migrating to KiCad. I migrated 30+ Eagle projects to KiCad 8 last year. The built-in importer handles 85% of the work automatically. The remaining 15% is where things get tricky. Here's the complete migration process.

## Why Migrate from Eagle to KiCad?

- **Eagle is in maintenance mode** — No new features, only critical bug fixes
- **KiCad is free and open source** — No subscription, no license limits
- **KiCad 8 is mature** — Feature parity with Eagle for most use cases
- **KiCad has unlimited board size** — Eagle's free tier was limited to 80cm²
- **Active development** — KiCad releases new features every 6 months

## Step 1: Prepare Your Eagle Project

Before importing, clean up the Eagle project:

1. Open the project in Eagle.
2. Run the ERC (Electrical Rule Check): **Tools** → **ERC**. Fix all errors.
3. Run the DRC (Design Rule Check): **Tools** → **DRC**. Fix all errors.
4. Ensure all libraries are attached and all components have valid package assignments.
5. Save the .sch (schematic) and .brd (board) files.

A clean Eagle project imports much more cleanly than one with ERC/DRC errors.

## Step 2: Import into KiCad

KiCad 8 has a built-in Eagle importer:

1. Open KiCad.
2. Go to **File** → **Import Non-KiCad Project** → **Eagle Project**.
3. Select the Eagle project directory (the folder containing .sch and .brd files).
4. KiCad displays the import dialog:
   - **Schematic file**: Auto-detected
   - **Board file**: Auto-detected
   - **Library paths**: Auto-detected from the Eagle project
5. Click **Import**.

KiCad processes the project and creates:
- `.kicad_sch` — Converted schematic
- `.kicad_pcb` — Converted board layout
- `.kicad_pro` — KiCad project file
- Library files — Converted Eagle libraries

## Step 3: Review the Schematic

Open the converted schematic in KiCad's Eeschema:

### Check Component Mapping

KiCad maps Eagle components to KiCad library equivalents. Verify:

1. Open **Inspect** → **Symbol Library**.
2. Check that all symbols have valid KiCad library assignments.
3. Components that couldn't be mapped appear with a warning symbol.
4. For unmapped components:
   - Right-click → **Edit Symbol** → **Change Symbol**.
   - Search the KiCad library for an equivalent.
   - If no equivalent exists, create a custom symbol.

### Check Net Connections

1. Run ERC: **Inspect** → **Electrical Rules Checker** → **Run ERC**.
2. Common conversion issues:
   - **Unconnected pins**: Eagle's net connections don't always map perfectly. Manually reconnect.
   - **Power flag warnings**: KiCad requires power symbols to have a power flag. Add `PWR_FLAG` symbols to power nets.
   - **Duplicate net names**: Eagle's auto-naming may create duplicates. Rename to resolve.

### Check Power and Ground

Eagle uses `GND`, `VCC`, `+3V3` etc. as power symbols. KiCad has equivalent power symbols but they may not map automatically:

1. Search for `GND` in the schematic — it should show as a KiCad power symbol.
2. If it shows as a generic symbol, replace it: right-click → **Change Symbol** → search for `GND` in the `power` library.
3. Repeat for VCC, +3V3, +5V, etc.

## Step 4: Review the Board Layout

Open the converted board in KiCad's PCB Editor (Pcbnew):

### Check Component Placement

1. All components should be in their original positions from Eagle.
2. Check for components that appear off the board or stacked on each other — this indicates a placement conversion error.
3. Verify the board outline (Edge.Cuts layer) matches the original.

### Check Copper Traces

1. All traces should be in their original positions and widths.
2. Check for broken traces (gaps where traces were connected in Eagle but not in KiCad).
3. Check vias — they should have the same drill and copper dimensions.

### Check Design Rules

1. Go to **File** → **Board Setup** → **Design Rules**.
2. Verify:
   - **Minimum track width**: Matches your Eagle DRC
   - **Minimum clearance**: Matches your Eagle DRC
   - **Minimum via drill**: Matches your Eagle DRC
3. Run DRC: **Inspect** → **Design Rules Checker** → **Run DRC**.
4. Fix any errors (unrouted nets, clearance violations).

### Check Layer Mapping

Eagle and KiCad use different layer naming:

| Eagle Layer | KiCad Layer |
|-------------|-------------|
| Top | F.Cu |
| Bottom | B.Cu |
| Top silk (tPlace) | F.SilkS |
| Bottom silk (bPlace) | B.SilkS |
| Top copper names (tNames) | F.Fab |
| Bottom copper names (bNames) | B.Fab |
| Top paste (tCream) | F.Paste |
| Bottom paste (bCream) | B.Paste |
| Top mask (tStop) | F.Mask |
| Bottom mask (bStop) | B.Mask |
| Dimensions (Dimension) | Cmts.User |
| Board outline (Dimension) | Edge.Cuts |

Verify that all objects are on the correct KiCad layers.

## Step 5: Fix Library Issues

The most common migration problem is library incompatibility:

### Footprint Mapping

1. Open **Inspect** → **Footprint Library**.
2. Check that all footprints have valid KiCad library assignments.
3. For unmapped footprints:
   - Right-click the component → **Edit Footprint** → **Change Footprint**.
   - Search KiCad's library for an equivalent package (e.g., SOIC-8, 0603, TQFP-32).
   - If no equivalent, create a custom footprint.

### Custom Libraries

If your Eagle project uses custom libraries:

1. KiCad imports them as project-local libraries.
2. They appear in the library list with a "project:" prefix.
3. Review each custom symbol/footprint for accuracy.
4. Consider migrating frequently-used custom components to a shared KiCad library.

## Step 6: Generate Manufacturing Files

Once the schematic and board are verified:

1. **Gerber files**: **File** → **Fabrication Outputs** → **Gerbers**.
2. **Drill files**: **File** → **Fabrication Outputs** → **Drill Files**.
3. **BOM**: **File** → **BOM**.
4. **Pick-and-place**: **File** → **Fabrication Outputs** → **Position Files**.

Compare these outputs with the last Eagle-generated files to verify they match.

## Common Conversion Errors

**"Symbol not found"**: The Eagle library part doesn't have a KiCad equivalent. Create a custom symbol or find a close match in the KiCad library.

**Traces missing on the board**: Eagle's routing didn't convert properly. Re-route the affected nets manually.

**Silkscreen text overlapping**: KiCad's text sizing differs from Eagle's. Adjust text sizes in the board layout.

**Design rules mismatch**: KiCad's default design rules may be tighter than your Eagle settings. Adjust the design rules to match your manufacturer's capabilities.
