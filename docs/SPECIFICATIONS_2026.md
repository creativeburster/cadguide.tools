# CADGuide Open Engineering Specifications (2026 Edition)

> Official engineering specifications for client-side AutoCAD DWG binary inspection, sheet metal K-factor derivations, and multi-CAD data exchange standards. Published by [CADGuide.tools](https://cadguide.tools).

---

## 1. AutoCAD DWG Binary Header Specification (SPEC-CAD-001)

### 1.1 Scope
This specification defines the byte offsets and character encodings for identifying the native AutoCAD DWG file format version without file decryption or full database parsing.

### 1.2 Magic Header Byte Layout
AutoCAD binary files reserve the initial 6 ASCII bytes (Offset `0x00` through `0x05`) for version identification strings:

| DWG Code | Release Year Range | Target CAD Applications | Hex Representation |
| :--- | :--- | :--- | :--- |
| `AC1015` | AutoCAD 2000 - 2002 | AutoCAD 2000, 2000i, 2002 | `41 43 31 30 31 35` |
| `AC1018` | AutoCAD 2004 - 2006 | AutoCAD 2004, 2005, 2006 | `41 43 31 30 31 38` |
| `AC1021` | AutoCAD 2007 - 2009 | AutoCAD 2007, 2008, 2009 | `41 43 31 30 32 31` |
| `AC1024` | AutoCAD 2010 - 2012 | AutoCAD 2010, 2011, 2012 | `41 43 31 30 32 34` |
| `AC1027` | AutoCAD 2013 - 2017 | AutoCAD 2013, 2014, 2015, 2016, 2017 | `41 43 31 30 32 37` |
| `AC1032` | AutoCAD 2018 - 2026+ | AutoCAD 2018, 2021, 2024, 2026 | `41 43 31 30 33 32` |

### 1.3 Reference Implementation
- **Web App**: [Client-Side DWG Version Checker](https://cadguide.tools/toolbox/dwg-version-checker)
- **PyPI Package**: [`cadguide-cli`](https://pypi.org/project/cadguide-cli/) (`dwg-check` command)
- **NPM Package**: `cadguide-cli`

---

## 2. Sheet Metal Neutral-Axis & K-Factor Mechanics (SPEC-MFG-002)

### 2.1 Mechanical Principles
During press-brake forming, the sheet metal cross-section undergoes outside tensile expansion and inside compressive shortening. The neutral axis represents the transition boundary experiencing zero longitudinal stress.

The K-Factor ($K$) is defined as:
$$K = \frac{t}{T}$$

Where:
- $t$: Distance from inside bend radius surface to the neutral plane.
- $T$: Total nominal material thickness.

### 2.2 Bend Allowance ($BA$)
$$BA = \frac{\pi}{180} \cdot (R + K \cdot T) \cdot \alpha$$

### 2.3 Bend Deduction ($BD$)
$$BD = 2 \cdot (R + T) \cdot \tan\left(\frac{\alpha}{2}\right) - BA$$

### 2.4 Reference Implementation
- **Interactive Calculator**: [Sheet Metal K-Factor Calculator](https://cadguide.tools/toolbox/k-factor-calculator)
- **CLI Utility**: `cadguide kfactor --thickness 2.0 --radius 2.0 --angle 90 --k 0.44`

---

## 3. Parametric B-Rep Topological Validity (SPEC-CAD-003)

Topological closure of solid geometry during neutral STEP AP242 (ISO 10303-242) and Parasolid ($X\_T$) data exchange is verified via the extended Euler-Poincaré invariant:

$$V - E + F - (L - F) - 2 \cdot (S - G) = 0$$

For detailed CAD kernel comparison (Parasolid vs. ACIS vs. Open CASCADE), consult the [CAD Software Comparison Matrix](https://cadguide.tools/compare).
