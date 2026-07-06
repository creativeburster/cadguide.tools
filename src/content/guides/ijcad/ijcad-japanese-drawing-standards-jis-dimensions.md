---
title: "IJCAD Japanese Imperial Units and Drawing Standards Configuration"
excerpt: "How to configure IJCAD for Japanese drafting standards — covering JIS dimension styles, imperial/metric unit settings, shaku-based measurements, and Japanese title block automation."
category: "standards"
softwareSlug: "ijcad"
keyword: "ijcad japanese drawing standards jis dimensions"
slug: "ijcad-japanese-drawing-standards-jis-dimensions"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.ijcad.co.jp/en/support/standards"
  - "https://www.jisc.go.jp/eng/jis-drafts/dimension-standards"
---

# IJCAD Japanese Imperial Units and Drawing Standards Configuration

IJCAD was built for the Japanese market, and it includes features for JIS (Japanese Industrial Standards) compliance that other IntelliCAD variants don't have. I configured IJCAD for a firm that does both domestic Japanese projects and international work — here's how to set it up properly.

## Unit System Configuration

Japanese construction drawings traditionally use the **shaku** system (1 shaku = 303mm) alongside metric. IJCAD supports both.

### Setting Up Dual Units

1. Type `UNITS`.
2. Set **Length type** to **Decimal**.
3. Set **Precision** to 0.0 (for metric) or 0 (for shaku).
4. Set **Insertion scale** to **Millimeters** (this is the base unit for the drawing database).
5. For dual-unit display in dimensions, see the JIS dimension style section below.

### Shaku Conversion

To display measurements in shaku:

1. Type `DIMLFAC` and set to 0.0033 (1 mm × 0.0033 = shaku).
2. Type `DIMPOST` and set to `" shaku"`.
3. Dimensions now display in shaku units.

For dual display (metric + shaku):
1. Type `DIMSTYLE` → **Modify** → **Alternate Units** tab.
2. Enable **Display alternate units**.
3. Set **Multiplier** to 0.0033.
4. Set **Suffix** to `" shaku"`.
5. Primary units show mm, alternate units show shaku.

## JIS Dimension Style Setup

JIS dimensioning has specific requirements that differ from ANSI or ISO:

### Arrowheads

JIS uses **architectural tick marks** (oblique strokes) for most dimensions, not filled arrows.

1. Type `DIMSTYLE` → **New** → name it "JIS-Standard".
2. **Symbols and Arrows** tab:
   - **Arrow first**: **Oblique** (tick mark)
   - **Arrow second**: **Oblique**
   - **Arrow size**: 2.5 mm (JIS standard)
   - **Center mark**: **None** (JIS doesn't use center marks on dimension lines)

### Text

JIS specifies particular text placement:

1. **Text** tab:
   - **Text style**: Use a JIS-compatible font (gothic.shx or Arial).
   - **Text height**: 2.5 mm (JIS B 0001 standard for A1/A2 sheets).
   - **Text position vertical**: **Above** (text sits above the dimension line).
   - **Text position horizontal**: **Centered**.
   - **Text alignment**: **Aligned with dimension line**.
   - **Text gap from dimension line**: 1.0 mm.

### Extension Lines

1. **Lines** tab:
   - **Extension beyond dim line**: 2.5 mm.
   - **Offset from origin**: 1.0 mm (JIS specifies minimal gap).
   - **Fixed length extension**: Enable, set to 5.0 mm.

## JIS Paper Sizes and Title Blocks

JIS paper sizes differ from ISO:

| JIS Size | Dimensions | Equivalent |
|----------|-----------|------------|
| A0 | 841 × 1189 mm | ISO A0 (same) |
| A1 | 594 × 841 mm | ISO A1 (same) |
| A2 | 420 × 594 mm | ISO A2 (same) |
| A3 | 297 × 420 mm | ISO A3 (same) |
| A4 | 210 × 297 mm | ISO A4 (same) |

JIS and ISO A-series are actually identical in size. The difference is in title block conventions:

- **JIS title blocks** place the title block in the **lower-right** corner (same as ISO).
- **JIS title block fields**: 図名 (drawing title), 図番 (drawing number), 尺度 (scale), 作成日 (date), 作成者 (author), 検査 (inspection).
- **JIS border margin**: 10 mm on all sides for A0–A2, 5 mm for A3–A4.

### Creating a JIS Title Block Template

1. Create a new DWG with the correct paper size.
2. Draw the border at the correct margin.
3. Create the title block in the lower-right corner with JIS field labels.
4. Add attribute definitions for each field (drawing title, number, scale, date, author).
5. Save as a DWT template: `File` → `Save As` → `.dwt` → save to IJCAD's template directory.

## Layer Naming Convention

JIS doesn't mandate a specific layer naming convention, but the Japanese construction industry commonly uses:

```
[Discipline]-[Element]-[Status]
```

Examples:
- `A-WALL-NEW` — Architectural, Wall, New construction
- `S-BEAM-EXIST` — Structural, Beam, Existing
- `M-PIPE-DEMO` — Mechanical, Pipe, Demolition

This is similar to the AIA layer standard but with Japanese discipline codes:
- A = Architecture (建築)
- S = Structural (構造)
- M = Mechanical (機械)
- E = Electrical (電気)
- C = Civil (土木)

## Deployment Across a Team

Save all standards (dimension styles, templates, layer standards, plot styles) to a network share and add it to IJCAD's support file search path:

1. Type `OPTIONS` → **Files** tab.
2. Expand **Support File Search Path**.
3. Add the network path (e.g., `\\server\cad-standards\jis\`).
4. Move it to the top of the list.

All users will automatically pick up the shared templates, plot styles, and font files.
