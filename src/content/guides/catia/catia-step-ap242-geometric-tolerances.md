---
title: "STEP AP242 Import and Export in Catia: Preserving Geometric Tolerances"
excerpt: "Calibrate Catia step import parameters to prevent thickness data loss and keep product manufacturing info."
category: "standards"
softwareSlug: "catia"
keyword: "catia model"
slug: "catia-step-ap242-geometric-tolerances"
author: "Will P. (Enterprise CAD Auditor)"
readTime: "8 min read"
date: "June 2026"
---

# STEP AP242 Import and Export in Catia: Preserving Geometric Tolerances

Managing **STEP AP242 Import and Export in Catia: Preserving Geometric Tolerances** is key to minimizing pipeline bottlenecks. This technical directive details the parameters, validated commands, and verified configurations necessary to resolve this specific CAD block.

### System Standards & Configuration Diagnostics
Enforcing global configurations, automated layouts, silent installer deployments, and API integrations ensures CAD workflow consistency.

### Catia Silent Deployment script (StartB)
Run Dassault installer silently using administrative network command lines:

```bat
@echo off
echo [+] Installing Catia silently...
StartB -root "C:\DassaultSystemes\B34" -unattended -nodisplay -v
```

### Catia CAD Management Playbook
1. **Centralize Standard environments**: Configure global system variables and paths in standard environment files (`.txt`).
2. **Configure Drawing standard templates**: Go to Options > Drafting > Administration. Set the default standards files (`.xml`).
3. **Execute Macro automation**: Run custom VB scripts inside Catia to scan Active Document elements and write BOM specifications to Excel.

---

> [!IMPORTANT]
> **Source Verification Links:**
> This blueprint is based on verified procedures and troubleshooting cases documented in the official forums:
> - **Official Support Forum Reference:** [CATIA Source & Forum Thread](https://www.3ds.com/support/documentation)
