---
title: "ZW3D Drawing Creation Is Slow: Large Assembly Drawing Performance"
excerpt: "A ZW3D Forum user reports that creating 2D drawing views for a 150-200 piece assembly takes an entire day, with 15-20 second delays per view operation. Here's what ZWSOFT has improved and what settings to check."
category: "performance"
softwareSlug: "zw3d"
keyword: "zw3d drawing creation slow large assembly performance"
slug: "zw3d-drawing-creation-slow-large-assembly-performance"
author: "CADGuide Tools Editorial Team"
readTime: "7 min read"
date: "2026-07-12"
sources:
  - "https://zw3dforum.com/t/slow-creation-of-drawings/247"
  - "https://www.zwsoft.com/news/products/zw3d-2025-has-released"
  - "https://www.zwsoft.com/news/products/zw3d-2026-smarter-more-specialized-fully-integrated/"
---

# ZW3D Drawing Creation Is Slow: Large Assembly Drawing Performance

A user on the ZW3D Forum reported serious performance problems with 2D drawing creation: every new view or view move operation takes 15-20 seconds to complete. For an assembly drawing of 150-200 pieces, the user reports it takes an entire day. The 3D model itself has no performance issues — only the 2D drawing creation is slow.

## The Reported Problem

**Forum post**: ZW3D Forum, "Slow creation of drawings" (topic #247)

**User's description**: "Whenever I have to create a new view or simply move it, I also wait 15/20 seconds before I can see the results. If you have to make an assembly drawing, even if it is small (150/200 pieces), it takes a day!"

**Key detail**: The user creates models as a single object and experiences no problems in 3D. The slowness is isolated to 2D drawing operations.

## What ZWSOFT Has Improved

### ZW3D 2025: Discrete Projection

ZW3D 2025 introduced a new **Discrete Projection** technology that ZWSOFT claims delivers "over 90% faster projection speeds for large files." This directly addresses the type of slowness the forum user reported.

If you're on ZW3D 2024 or earlier, upgrading to 2025 or 2026 is the most impactful change you can make for drawing performance.

### ZW3D 2026: Further Optimization

ZW3D 2026 continues the performance improvements:
- 60% faster 2D drawing projections
- 70% increase in operational efficiency
- Optimized large file opening algorithms

ZWSOFT cites a case where a 150,000-part factory layout project saw drawing view projection time reduced from 5 minutes to 1 minute on ZW3D 2026.

## Settings to Check

### Enable Discrete Projection (ZW3D 2025+)

If you're on ZW3D 2025 or 2026, verify that Discrete Projection is enabled:

1. Go to **Utilities → Configuration → 2D - Drawing Sheet**
2. Verify **Discrete Projection** is checked
3. This should be the default, but if it was turned off (e.g., to fix the Regen issue described in our related guide), re-enable it for maximum drawing performance

Note: Discrete Projection changes the Regen behavior — see our guide on [ZW3D 2025 Drawing View Regen](/guides/zw3d-2025-drawing-view-regen-discrete-projection-fix) for details.

### Lightweight Component Display

For large assemblies, use lightweight display modes:
- ZW3D supports up to 20,000 components with lightweight technology
- Enable lightweight mode for components that don't need full detail in the drawing
- This reduces the geometry that needs to be projected to 2D

### Simplify the Model Before Drawing Creation

Before creating drawing views:
- Suppress cosmetic features (logos, text, fillets that don't affect the drawing)
- Use configurations to show only the components needed in each view
- Hide internal components that won't be visible in the drawing view

### Check Hardware

The forum user who reported the slow drawing issue didn't mention their hardware specs. Based on ZWSOFT's recommendations:
- **RAM**: 8 GB minimum, 16+ GB recommended for large assemblies
- **GPU**: Dedicated GPU with 8 GB VRAM recommended for large assemblies with multiple windows
- **CPU**: Multi-core processor — drawing projection is CPU-intensive

## If Performance Is Still Slow After Upgrading

If you're on ZW3D 2025 or 2026 and drawing creation is still slow:

1. **Check if Discrete Projection is enabled** — this is the single most impactful setting
2. **Report to ZWSOFT support** with your specific assembly size and timing data
3. **Check the ZW3D Forum** for updates — other users may have found workarounds for specific scenarios
4. **Consider breaking large drawings into multiple sheets** — each sheet with fewer views may project faster than a single sheet with many views

## The Broader Context

The forum user's experience reflects a known bottleneck in CAD software: 2D drawing projection from large 3D assemblies is computationally expensive. ZWSOFT has been actively addressing this with the Discrete Projection technology in 2025 and further optimizations in 2026. The 90% speed improvement claim suggests that users on pre-2025 versions will see a dramatic improvement by upgrading.
