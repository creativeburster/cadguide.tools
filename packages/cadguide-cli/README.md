# cadguide-cli

> **Zero-upload, client-side AutoCAD DWG binary header inspector, sheet metal K-factor calculator, and engineering toolbox.**

[![NPM Version](https://img.shields.io/npm/v/cadguide-cli.svg)](https://www.npmjs.com/package/cadguide-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Website](https://img.shields.io/badge/Website-cadguide.tools-brightgreen.svg)](https://cadguide.tools)

Developed by the [CADGuide.tools](https://cadguide.tools) engineering team.

---

## ⚡ Key Features

- 🔍 **Instant DWG Version Check**: Read the first 6 bytes of binary header in `< 3ms` without uploading confidential IP to third-party servers.
- 📐 **Sheet Metal K-Factor Calculator**: Calculate Bend Allowance ($BA$) and Bend Deduction ($BD$) for precision air bending and bottoming dies.
- 🧭 **Cross-CAD Shortcut Matcher**: Quick lookup for AutoCAD, GstarCAD, ZWCAD, BricsCAD, FreeCAD, and Rhino command mappings.
- 🛡️ **100% Private & Offline**: Operates purely on local file streams without telemetry or cloud uploads.

---

## 📦 Installation & Usage

### Use via `npx` (No installation needed)
```bash
# Inspect a local DWG drawing
npx cadguide-cli dwg ./drawing.dwg

# Calculate sheet metal K-Factor
npx cadguide-cli kfactor 2.0 2.0 90 0.44
```

### Global Installation
```bash
npm install -g cadguide-cli

# Run anywhere
cadguide dwg ./sample.dwg
cadguide kfactor 3.0 3.0
```

---

## 💻 Programmatic Node.js API

```javascript
const { parseDWGHeader, calculateKFactor } = require('cadguide-cli');
const fs = require('fs');

// 1. Inspect DWG buffer (only first 6 bytes required)
const buffer = fs.readFileSync('sample.dwg');
const header = parseDWGHeader(buffer);
console.log(header.releases); // e.g. "AutoCAD 2018 - 2026"

// 2. Sheet metal calculation
const result = calculateKFactor(2.0, 2.0, 90, 0.44);
console.log(`Bend Allowance: ${result.bendAllowance} mm`);
```

---

## 🔗 Official Links & Web Tools

- 🌐 **Interactive Web Version**: [https://cadguide.tools](https://cadguide.tools)
- 🧮 **DWG Version Web Checker**: [https://cadguide.tools/toolbox/dwg-version-checker](https://cadguide.tools/toolbox/dwg-version-checker)
- 📏 **K-Factor Calculator**: [https://cadguide.tools/toolbox/k-factor-calculator](https://cadguide.tools/toolbox/k-factor-calculator)
- 📚 **CAD Administrator Guides**: [https://cadguide.tools/guides](https://cadguide.tools/guides)

---

## 📄 License

MIT License © 2026 [CADGuide.tools](https://cadguide.tools)
