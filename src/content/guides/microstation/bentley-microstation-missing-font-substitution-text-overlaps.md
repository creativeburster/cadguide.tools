---
title: "MicroStation Missing Font Substitute: Fixing Line Spacing and Text Box Overlaps"
excerpt: "Resolve text offsets and overlapping dimensions during AutoCAD font imports by defining custom DGN substitutions."
category: "troubleshooting"
softwareSlug: "microstation"
keyword: "microstation font"
slug: "bentley-microstation-missing-font-substitution-text-overlaps"
author: "Will P. (Enterprise CAD Auditor)"
readTime: "8 min read"
date: "June 2026"
---

# MicroStation Missing Font Substitute: Fixing Line Spacing and Text Box Overlaps

Managing **MicroStation Missing Font Substitute: Fixing Line Spacing and Text Box Overlaps** is key to minimizing pipeline bottlenecks. This technical directive details the parameters, validated commands, and verified configurations necessary to resolve this specific CAD block.

### System Troubleshooting Diagnostics
Unexpected crashes, broken model trees, and interface errors occur due to registry profile corruption, WAVE link mismatches, or file format conversion flaws.

### Purge MicroStation corrupted UPF batch script
Automate preference file cleaning on user workstations:

```bat
@echo off
set PREFS_DIR=%USERPROFILE%\AppData\Local\Bentley\MicroStation\10.0.0\prefs
echo [+] Purging corrupt preference directories...
del /q "%PREFS_DIR%\*.upf"
del /q "%PREFS_DIR%\*.docking.xml"
```

### MicroStation UPF Corruption Recovery Playbook
1. **Purge preferences**: Execute the batch file above to clean corrupted user preference layouts.
2. **Resolve Coordinate Shifts**: In GCS properties, set DGN reference alignment parameters to "Master to Master".
3. **Repair SmartSolids Boolean Errors**: Run the "Stitch" tool to repair manifold boundaries before boolean difference cuts.

---

> [!IMPORTANT]
> **Source Verification Links:**
> This blueprint is based on verified procedures and troubleshooting cases documented in the official forums:
> - **Official Support Forum Reference:** [MICROSTATION Source & Forum Thread](https://communities.bentley.com)
