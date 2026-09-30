# cadguide-cli

> **Zero-upload, client-side AutoCAD DWG binary header inspector, sheet metal K-factor calculator, and engineering toolbox.**

[![PyPI version](https://img.shields.io/pypi/v/cadguide-cli.svg)](https://pypi.org/project/cadguide-cli/)
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

## 📦 Installation

```bash
pip install cadguide-cli
```

---

## 🚀 Quick Start

### 1. Inspect AutoCAD DWG Header Version
```bash
# Check a local DWG file
cadguide dwg sample_drawing.dwg

# Or using the dedicated shortcut command
dwg-check sample_drawing.dwg
```

**Output:**
```text
============================================================
  🔍 CADGuide DWG Binary Header Inspector
============================================================
File: sample_drawing.dwg
Header Code: AC1032
Release Year: 2018+
Compatible CAD: AutoCAD 2018, 2021, 2024, 2026
Format Status: Modern 64-bit Object Streams (Supported)
============================================================
```

### 2. Sheet Metal K-Factor Calculation
```bash
# Calculate bend allowance for thickness=2.0mm, radius=2.0mm, angle=90, K-Factor=0.44
cadguide kfactor --thickness 2.0 --radius 2.0 --angle 90 --k 0.44
```

### 3. Quick CAD Alternative Comparison
```bash
cadguide compare autocad gstarcad
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
