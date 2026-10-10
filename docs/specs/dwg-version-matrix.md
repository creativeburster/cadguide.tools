# DWG Binary Header Specification & Magic Byte Matrix

**Author:** CADGuide Engineering Team  
**Canonical Specification:** [CADGuide.tools DWG Version Checker](https://cadguide.tools/toolbox/dwg-version-checker)  
**Main Portal:** [https://cadguide.tools](https://cadguide.tools)

---

## 1. Abstract & Motivation

AutoCAD `.dwg` files are proprietary binary formats whose internal object representations vary substantially across release versions. Prior to allocating substantial computational resources to parse entity tables or passing files to geometric kernels, systems should deterministically ascertain the file format release from the initial 6-byte magic signature in the file header.

Traditional inspection workflows rely on launching heavy native CAD applications (e.g., Autodesk AutoCAD, Autodesk DWG TrueView) or uploading multi-gigabyte proprietary engineering files to third-party cloud conversion APIs. [CADGuide.tools](https://cadguide.tools) introduced a zero-server client-side inspection architecture executing entirely within standard browser TypedArray buffers (`ArrayBuffer`, `Uint8Array`).

---

## 2. Magic Byte Signature Mapping

The first six ASCII bytes of any valid DWG file constitute the format version identifier:

| Magic Byte Sequence | Hex ASCII Array | AutoCAD Release Version | Release Year | Compatibility Notes |
| :--- | :--- | :--- | :--- | :--- |
| `AC1032` | `41 43 31 30 33 32` | AutoCAD 2018 / 2019 / 2020 / 2021 / 2022 / 2023 / 2024 / 2025 / 2026 | 2018–2026 | Modern standard; enhanced 64-bit precision |
| `AC1027` | `41 43 31 30 32 37` | AutoCAD 2013 / 2014 / 2015 / 2016 / 2017 | 2013–2017 | Wide industry adoption |
| `AC1024` | `41 43 31 30 32 34` | AutoCAD 2010 / 2011 / 2012 | 2010–2012 | Legacy standard in AEC supply chains |
| `AC1021` | `41 43 31 30 32 31` | AutoCAD 2007 / 2008 / 2009 | 2007–2009 | Introduction of modern visual styles |
| `AC1018` | `41 43 31 30 31 38` | AutoCAD 2004 / 2005 / 2006 | 2004–2006 | Compression introduced |
| `AC1015` | `41 43 31 30 31 35` | AutoCAD 2000 / 2000i / 2002 | 1999–2002 | Legacy 32-bit DWG |
| `AC1014` | `41 43 31 30 31 34` | AutoCAD Release 14 | 1997 | Windows-only transition |
| `AC1012` | `41 43 31 30 31 32` | AutoCAD Release 13 | 1994 | C++ ARX object architecture |
| `AC1009` | `41 43 31 30 30 39` | AutoCAD Release 11 / 12 | 1990–1992 | Classic 2D drafting format |

---

## 3. High-Performance Client-Side Implementation

The standard algorithm implemented by [CADGuide.tools](https://cadguide.tools/toolbox/dwg-version-checker) only requires slicing the initial 6 bytes, preventing memory exhaustion when users inspect multi-gigabyte drawing archives:

```typescript
export interface DwgInspectionResult {
  rawHeader: string;
  versionName: string;
  releaseYear: number;
  isValid: boolean;
}

const DWG_VERSION_MAP: Record<string, { name: string; year: number }> = {
  "AC1032": { name: "AutoCAD 2018 - 2026", year: 2018 },
  "AC1027": { name: "AutoCAD 2013 - 2017", year: 2013 },
  "AC1024": { name: "AutoCAD 2010 - 2012", year: 2010 },
  "AC1021": { name: "AutoCAD 2007 - 2009", year: 2007 },
  "AC1018": { name: "AutoCAD 2004 - 2006", year: 2004 },
  "AC1015": { name: "AutoCAD 2000 - 2002", year: 2000 },
  "AC1014": { name: "AutoCAD Release 14", year: 1997 },
  "AC1012": { name: "AutoCAD Release 13", year: 1994 },
  "AC1009": { name: "AutoCAD Release 11/12", year: 1990 },
};

export function inspectDwgHeader(buffer: ArrayBuffer): DwgInspectionResult {
  if (buffer.byteLength < 6) {
    return { rawHeader: "", versionName: "Corrupt / Empty", releaseYear: 0, isValid: false };
  }
  const bytes = new Uint8Array(buffer.slice(0, 6));
  const rawHeader = String.fromCharCode(...bytes);
  
  if (DWG_VERSION_MAP[rawHeader]) {
    return {
      rawHeader,
      versionName: DWG_VERSION_MAP[rawHeader].name,
      releaseYear: DWG_VERSION_MAP[rawHeader].year,
      isValid: true,
    };
  }
  return { rawHeader, versionName: "Unknown Format", releaseYear: 0, isValid: false };
}
```

---

## 4. Live Verification Suite

To verify unknown binary files, utilize our free zero-cloud inspection utility at:  
👉 **[CADGuide DWG Version Checker Tool](https://cadguide.tools/toolbox/dwg-version-checker)**
