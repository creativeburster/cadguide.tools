---
title: "KISSsoft Bearing Warning 'Minimum Load Not Reached': Causes and Fixes"
excerpt: "KISSsoft warns 'The minimum load of the bearing is not reached!' when bearing load P is less than 0.01×C0. Here's what this means and how to resolve it — based on CAD3D.it forum discussion and KISSsoft documentation."
category: "troubleshooting"
softwareSlug: "kisssoft"
keyword: "kisssoft bearing warning minimum load not reached fix"
slug: "kisssoft-bearing-warning-minimum-load-fix"
author: "CADGuide Technical Editorial"
readTime: "6 min read"
date: "2026-07-12"
sources:
  - "https://www.cad3d.it/forum1/discussione/problema-cuscinetto-kisssoft.60136/"
  - "https://www.kisssoft.com/en/products/product-overview/kisssoftr-elements/brochures/shafts-bearings"
---

# KISSsoft Bearing Warning "Minimum Load Not Reached": Causes and Fixes

A user on the CAD3D.it forum (in Italian) reported that KISSsoft keeps giving warnings about bearings: "Il carico minimo del cuscinetto non è raggiunto!" — "The minimum load of the bearing is not reached!" The user tried everything they could think of but the warning persisted.

## The Warning

**Warning message**: "The minimum load of the bearing is not reached!"

**Meaning**: The bearing's equivalent dynamic load P is less than the minimum required load specified by the bearing manufacturer. When P < 0.01 × C0 (static load rating), the bearing may not operate correctly.

## Why This Warning Matters

When a bearing's minimum load is not reached:
- **Rolling elements may skid**: Instead of rolling, the balls/rollers slide between the raceways. This causes wear and heat generation.
- ** Cage damage**: Skidding can damage the cage (separator) due to uneven forces
- **Premature failure**: Bearings operating below minimum load can fail prematurely despite having adequate rated life

A forum respondent explained: "In this case there could be skidding between balls and rings. The bearing should be preloaded with a spring."

## Causes

1. **Light load application**: The bearing is oversized for the actual load
2. **Low-speed operation**: At low speeds, dynamic load is minimal
3. **Intermittent load**: The bearing sees load only part of the time
4. **Oversized bearing selection**: A bearing with too high a static load rating (C0) was selected

## Fixes

### Fix 1: Use "General Bearing" Instead of Specific Bearing

The CAD3D.it forum user found a workaround: "I removed the warning by using a 'general bearing' instead of a 'bearing'." However, this introduced a new problem — the Goodman-Smith diagram was no longer calculated.

**How to do it**:
1. In the bearing selection, change the bearing type from a specific manufacturer bearing to "General Bearing"
2. The minimum load check is not performed for general bearings
3. Note: Some analysis features (like Goodman-Smith diagrams) may not be available with general bearings

### Fix 2: Add Spring Preload

A forum respondent recommended preloading the bearing with a spring. This increases the effective load on the bearing above the minimum threshold.

1. In the shaft calculation, add a **spring preload** to the bearing
2. Set the spring force to bring the equivalent load P above 0.01 × C0
3. Recalculate — the warning should disappear
4. Verify that the preload doesn't cause excessive stress or reduce bearing life

### Fix 3: Select a Smaller Bearing

If the bearing is oversized:
1. Check the required bearing life (L10h) — you may have selected a bearing with much higher capacity than needed
2. Select a smaller bearing with a lower C0 rating
3. The minimum load threshold (0.01 × C0) decreases with a smaller bearing
4. Verify the smaller bearing still meets the required life

### Fix 4: Increase the Applied Load

If possible, increase the actual load on the bearing:
- Increase the transmitted power
- Add external loads (preload, gravitational loads)
- Use a different gear ratio that increases torque at the bearing

This is often not practical in real applications but may be relevant in design optimization.

### Fix 5: Accept the Warning

If the bearing operates above the minimum load during actual service (even if the calculation shows below minimum for the rated condition):
1. Document that the warning is acknowledged
2. Verify with the bearing manufacturer that the application is acceptable
3. Consider monitoring the bearing temperature in operation — skidding typically causes temperature rise

## KISSsoft Bearing Calculation Features

According to KISSsoft's shafts and bearings documentation:

- **ISO TS 16281 life calculations**: KISSsoft performs advanced bearing life calculations using ISO TS 16281, giving more accurate results than basic ISO 281
- **2D and 3D visualization**: Bearing stress can be visualized in various displays
- **Bearing inner geometry**: For detailed analysis, KISSsoft can retrieve bearing inner geometry from manufacturer databases (e.g., Timken cloud service)
- **Multiple bearing types**: Deep groove ball, angular contact, cylindrical roller, tapered roller, spherical roller, and more

## Related Bearing Warnings in KISSsoft

### "Bearing life is insufficient"
The calculated L10h life is less than the required life. Fix: Select a larger bearing or improve lubrication.

### "Static load capacity not sufficient"
The equivalent static load exceeds the static load rating. Fix: Select a bearing with higher C0.

### "Speed exceeds limiting speed"
The operating speed is above the bearing's speed limit. Fix: Select a high-speed bearing or reduce speed.

## Best Practices

1. **Right-size bearings**: Don't overspecify bearings "just to be safe" — oversized bearings trigger minimum load warnings
2. **Check minimum load early**: Review the minimum load warning during initial sizing, not at final design
3. **Consider preload for light-load applications**: Spring preload is a standard solution for bearings that operate below minimum load
4. **Use manufacturer-specific bearings for final design**: General bearings skip the minimum load check but lose analysis features
5. **Consult bearing manufacturers**: SKF, Schaeffler, Timken, and NSK all have application engineering support for minimum load questions
