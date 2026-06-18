---
title: "MicroStation Large DGN Assembly Loading: Setting Up Raster Cache Directories"
excerpt: "Speed up DGN drawing load rates by setting up dedicated SSD directories for image and reference caches."
category: "performance"
softwareSlug: "microstation"
keyword: "microstation lag"
slug: "bentley-microstation-large-dgn-loading-raster-cache"
author: "Will P. (Enterprise CAD Auditor)"
readTime: "8 min read"
date: "June 2026"
---

# MicroStation Large DGN Assembly Loading: Setting Up Raster Cache Directories

Managing **MicroStation Large DGN Assembly Loading: Setting Up Raster Cache Directories** is key to minimizing pipeline bottlenecks. This technical directive details the parameters, validated commands, and verified configurations necessary to resolve this specific CAD block.

### System Performance Diagnostics
Heavy graphics redraw and high calculations loads cause system stutters. Viewport lags occur due to graphic driver mismatching or unoptimized memory caching rules.

### MicroStation Local Cache Configuration
Define local paths for raster image loading and temporary file allocation inside Bentley configuration vars:

```text
MS_RASTER_LOADMODE = 2
MS_SCR = D:\MicroStationTemp\
MS_IMAGE_CACHE_DIR = D:\MicroStationRasterCache\
```

### MicroStation CONNECT Viewport Speed Playbook
1. **Enable Local Raster Caching**: Configure `MS_RASTER_LOADMODE = 2` to cache orthophoto raster datasets on local high-speed SSDs.
2. **Clip Reference Files**: Crop reference boundaries using the "Clip Reference" tool to limit drawing redraw loads.
3. **Clean UPF Files**: If tool stutters occur, delete the corrupt `.upf` preferences file from your AppData directory.

---

> [!IMPORTANT]
> **Source Verification Links:**
> This blueprint is based on verified procedures and troubleshooting cases documented in the official forums:
> - **Official Support Forum Reference:** [MICROSTATION Source & Forum Thread](https://communities.bentley.com)
