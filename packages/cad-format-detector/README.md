# @willsunagency/cad-format-detector

> Pure zero-dependency JavaScript/TypeScript utility for detecting computer-aided design (CAD) file formats, binary signatures, and version magic bytes.
> Engineered for browser file pickers, client-side zero-upload security filters, and Node.js ingestion microservices.

[![npm version](https://img.shields.io/npm/v/@willsunagency/cad-format-detector.svg)](https://www.npmjs.com/package/@willsunagency/cad-format-detector)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## 🛠️ Why This Library?

In security-conscious engineering, aerospace, and defense environments, engineers cannot upload proprietary blueprints to cloud-based converter servers. 

`@willsunagency/cad-format-detector` inspects only the first few bytes (the file signature and schema header) to reliably detect the file family without reading the full geometry payload or executing arbitrary code.

Interactive implementation running on the web:
- **[AutoCAD DWG Version Checker](https://cadguide.tools/toolbox/dwg-version-checker)** (Runs 100% locally in browser memory)
- **[Sheet Metal K-Factor Calculator](https://cadguide.tools/toolbox/k-factor-calculator)** (Calculate neutral axis and press brake bend deduction)
- **[CAD Software Comparison Database](https://cadguide.tools/compare)** (Side-by-side technical benchmarks of 170+ CAD suites)
- **[CADGuide.tools](https://cadguide.tools/)** (Open engineering resource)

---

## 📦 Supported Formats & Magic Bytes

| Format Family | Header Magic / Schema Marker | Supported Releases |
| :--- | :--- | :--- |
| **DWG** | `AC1009` ~ `AC1032` | AutoCAD R11 through AutoCAD 2026 |
| **DXF** | `AutoCAD Binary DXF` / `SECTION HEADER $ACADVER` | ASCII and Binary variations |
| **STEP** | `ISO-10303-21` / `STEP-FILE` | AP203, AP214, AP242 solid models |
| **IGES** | Standard 80-column ASCII card with `S1` marker | Initial Graphics Exchange Spec |
| **IFC** | `IFC2X3` / `IFC4` / `IFC4X3` | Industry Foundation Classes BIM |

---

## 🚀 Installation

```bash
npm install @willsunagency/cad-format-detector
```

---

## 💻 Usage

### 1. Browser (Zero-Upload Client File Picker)

```javascript
import { detectCADFormat } from '@willsunagency/cad-format-detector';

const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  // Read only the first 128 bytes - zero memory overhead
  const slice = await file.slice(0, 128).arrayBuffer();
  const result = detectCADFormat(new Uint8Array(slice));
  
  console.log(result);
  // {
  //   detected: true,
  //   format: 'DWG',
  //   magic: 'AC1032',
  //   version: '2018-2026',
  //   description: 'AutoCAD 2018/2021/2024/2026',
  //   isBinary: true
  // }
});
```

### 2. Node.js

```javascript
const fs = require('fs');
const { detectCADFormat } = require('@willsunagency/cad-format-detector');

const buffer = fs.readFileSync('part_assembly.step');
const result = detectCADFormat(buffer);

if (result.detected) {
  console.log(`Detected ${result.format}: ${result.description}`);
}
```

---

## 📄 License

MIT © [CADGuide.tools](https://cadguide.tools/) & Will Sun
