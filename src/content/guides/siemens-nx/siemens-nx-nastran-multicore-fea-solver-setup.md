---
title: "NX Nastran Multi-Core FEA Solver Settings: Allocating Parallel CPU Core Pools"
excerpt: "Configure Nastran solver settings to allocate multiple cores, optimize memory settings, and speed up solver iterations."
category: "performance"
softwareSlug: "siemens-nx"
keyword: "nx nastran"
slug: "siemens-nx-nastran-multicore-fea-solver-setup"
author: "Will P. (Enterprise CAD Auditor)"
readTime: "8 min read"
date: "June 2026"
---

# NX Nastran Multi-Core FEA Solver Settings: Allocating Parallel CPU Core Pools

Managing **NX Nastran Multi-Core FEA Solver Settings: Allocating Parallel CPU Core Pools** is key to minimizing pipeline bottlenecks. This technical directive details the parameters, validated commands, and verified configurations necessary to resolve this specific CAD block.

### System Performance Diagnostics
Heavy graphics redraw and high calculations loads cause system stutters. Viewport lags occur due to graphic driver mismatching or unoptimized memory caching rules.

### Nastran Solver execution parameters (rc file)
Optimize virtual allocation bounds inside Nastran simulation solvers:

```ini
# memory.rc setup
memory=0.85*physical
scratch=D:\NXNastranScratch
parallel=8
```

### Siemens NX Viewport Acceleration Playbook
1. **Select Workstation App Driver**: Configure your NVIDIA Quadro driver to the "Workstation App - Advanced 3D" profile.
2. **Set Lightweight Representations**: Go to Assemblies Preferences, change component representation loading to "Lightweight" to load cached tessellation facets instead of parametric solid models.
3. **Adjust Windows Page File**: Define a fixed paging size (min/max 64GB) on local SSD drives.

---

> [!IMPORTANT]
> **Source Verification Links:**
> This blueprint is based on verified procedures and troubleshooting cases documented in the official forums:
> - **Official Support Forum Reference:** [SIEMENS-NX Source & Forum Thread](https://community.sw.siemens.com)
