---
title: "Corona to V-Ray Migration: Material Conversion, Light Mapping, and Render Settings Translation"
excerpt: "Migrating from Corona to V-Ray requires converting Physical Materials to VRayMtl, Corona Lights to V-Ray Lights, and translating GI settings. We cover the Chaos Cosmos workflow, the material conversion script, and the settings that produce equivalent results."
category: "migration"
softwareSlug: "corona-renderer"
keyword: "Corona V-Ray migration material conversion render settings"
slug: "corona-vray-migration-material-conversion"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-24"
sources:
  - "https://docs-chaos.atlassian.net/wiki/spaces/CRMAX/pages/124759580"
  - "https://support.chaos.com/hc/en-us/articles/4528588388113-How-to-use-denoising-in-Corona-for-3ds-Max"
  - "https://support.chaos.com/hc/en-us/articles/4528466192273-What-is-the-Adaptive-light-solver-option-3ds-Max"
---

# Corona to V-Ray Migration: Material Conversion, Light Mapping, and Render Settings Translation

We've migrated several studios from Corona Renderer to V-Ray (and a few from V-Ray to Corona). Both are Chaos products, so the migration is smoother than between unrelated renderers, but there are specific conversion steps that need attention. The most common migration scenario we handle is studios that need V-Ray for specific features like GPU rendering, V-Ray Cloud, or compatibility with pipeline tools.

## Why Migrate from Corona to V-Ray?

Common reasons we see:
- **GPU rendering**: V-Ray GPU supports CUDA and RTX acceleration; Corona is CPU-only (though Corona GPU is in development)
- **V-Ray Cloud / Chaos Cloud**: Cloud rendering integration
- **Pipeline compatibility**: V-Ray is the standard at many large studios
- **Specific features**: V-Ray Fur, V-Ray Mesh Export, V-Ray Proxy with LOD
- **Real-time integration**: V-Ray has tighter integration with Unreal Engine via V-Ray for Unreal

## Step 1: Scene Conversion with Chaos Tools

Chaos provides built-in conversion tools in 3ds Max:

1. Install both Corona and V-Ray on the same 3ds Max installation
2. Go to **V-Ray menu → Scene Converter**
3. Select the **Corona to V-Ray** preset
4. Check the conversion options:
   - **Materials**: Convert Corona Physical Material to VRayMtl
   - **Lights**: Convert Corona Lights to V-Ray Lights
   - **Environment**: Convert Corona Sky/Environment to V-Ray Sky/Environment
   - **Camera**: Convert Corona Camera to V-Ray Physical Camera
5. Click **Convert**

**What converts correctly**:
- Corona Physical Material → VRayMtl (base color, roughness, metalness, normal map)
- Corona Light (Area) → V-Ray Area light
- Corona Light (Dome) → V-Ray Dome Light
- Corona Sun → V-Ray Sun
- Corona Sky → V-Ray Sky

**What needs manual adjustment**:
- **Corona SSS**: Converts to VRayMtl with SSS, but parameters don't map 1:1 — adjust scatter radius and amount manually
- **Corona Displacement**: Converts to V-Ray Displacement modifier, but amount and edge length values need recalibration
- **Corona Light Portals**: Convert to V-Ray Light portals, but verify orientation and size
- **Corona Material presets**: Some Corona-specific material features (like the clearcoat layer) need manual recreation in VRayMtl

## Step 2: Material Conversion Details

### Corona Physical Material → VRayMtl

| Corona Parameter | V-Ray Parameter | Notes |
|-----------------|----------------|-------|
| Base Color | Diffuse | Direct mapping |
| Roughness | Reflection Glossiness | Invert: V-Ray uses glossiness (1=smooth), Corona uses roughness (1=rough) |
| Metalness | Metalness | Direct mapping (both use 0-1) |
| IOR | IOR | Direct mapping |
| Bump/Normal | Bump/Normal | Direct mapping |
| SSS Amount | Refraction/Translucency | Manual adjustment needed |
| Clearcoat | Coat layer (VRayMtl 7+) | Manual setup if using older V-Ray |

**Critical: Roughness → Glossiness inversion**: This is the most common conversion error. Corona Roughness 0.3 = V-Ray Glossiness 0.7. The scene converter handles this automatically, but if you manually recreate materials, you must invert the roughness map using a Color Correction node with Invert enabled.

### Glass Materials

Corona glass converts to V-Ray glass with these adjustments:
1. **Thin shell** in Corona → enable **Thin-walled** in V-Ray's refraction settings
2. **Absorption** in Corona → **Fog color** and **Fog multiplier** in V-Ray
3. **Frosted glass** (roughness) → set **Refraction glossiness** in V-Ray (invert the roughness value)

### SSS Materials

SSS requires the most manual adjustment:
1. In VRayMtl, enable **Translucency** → **Volumetric SSS**
2. **Scatter color**: Direct mapping from Corona
3. **Scatter radius**: Corona uses millimeters, V-Ray uses scene units — verify the scale
4. **Amount**: Start at 0.5 and adjust — Corona and V-Ray calculate SSS differently

## Step 3: Light Conversion Details

### Corona Dome Light → V-Ray Dome Light
- **HDRI map**: Direct transfer
- **Multiplier**: May need adjustment — V-Ray and Corona use different light intensity scales
- **Resolution**: Set V-Ray Dome Light **Dome resolution** to 1024 (matching Corona's default)

### Corona Sun → V-Ray Sun
- **Intensity**: V-Ray Sun uses different intensity units — typically needs 2-5x higher multiplier
- **Size multiplier**: Direct mapping (controls shadow softness)
- **Turbidity**: Direct mapping

### Light Portals
- **Corona Portal** → **V-Ray Light** with **Portal** type enabled
- Verify the portal is facing the correct direction (into the room)
- V-Ray portals work with the V-Ray Dome Light — ensure the Dome Light is present

## Step 4: GI Settings Translation

Corona and V-Ray use different GI systems:

| Corona Setting | V-Ray Equivalent | Notes |
|---------------|-----------------|-------|
| UHD Cache | Light Cache | Similar concept — precomputed GI cache |
| Path Tracing (primary) | Brute Force (primary) | Direct mapping |
| Force Path Tracing | Brute Force for both primary and secondary | Disable Light Cache |
| Adaptive Light Solver | V-Ray Light Eval | Different algorithms, similar purpose |

**Our V-Ray GI setup for migrated scenes**:
1. **Primary GI**: Brute Force
2. **Secondary GI**: Light Cache
3. **Light Cache subdivs**: 2000-4000 (equivalent to UHD Cache precision)
4. **Light Cache sample size**: 0.02 (default)
5. **Brute Force subdivs**: 16-32 (equivalent to Corona's GI vs AA balance)

## Step 5: Render Settings Translation

| Corona Setting | V-Ray Equivalent | Notes |
|---------------|-----------------|-------|
| Noise Limit | Noise threshold | V-Ray uses 0.001-0.01; Corona uses 1-5% |
| Max passes | Max subdivs | V-Ray uses total subdivs, not passes |
| Denoiser | V-Ray Denoiser | Both support NVIDIA AI and Intel AI |
| MSI | Max ray intensity | Similar concept — clamps bright samples |

**Noise limit conversion**: Corona Noise Limit 3% ≈ V-Ray Noise threshold 0.005. This is an approximation — you'll need to fine-tune based on visual results.

**Denoiser**: Both Corona and V-Ray support the NVIDIA GPU AI Denoiser and Intel AI Denoiser. The denoiser settings (amount, radius) translate directly.

## Step 6: Camera and Exposure

Corona Camera → V-Ray Physical Camera:
- **Exposure (EV)**: Direct mapping
- **ISO**: Direct mapping
- **Shutter speed**: Direct mapping
- **Aperture (f-stop)**: Direct mapping
- **White balance**: Direct mapping (both use Kelvin temperature)

If the scene uses 3ds Max's standard camera (not a Corona Camera), no camera conversion is needed — V-Ray works with standard cameras.

## Step 7: Post-Conversion Verification

After running the scene converter:

1. **Render at low quality**: Set V-Ray to low quality settings and render — check for obvious issues (black materials, missing lights, wrong colors)
2. **Compare side-by-side**: Render the same view in Corona (before conversion) and V-Ray (after conversion) — compare lighting, materials, and overall appearance
3. **Check glass and SSS**: These are the most likely to need manual adjustment
4. **Verify light portals**: Ensure portals are correctly positioned and oriented
5. **Check displacement**: Compare displacement results — V-Ray and Corona use different displacement algorithms

## Common Migration Issues

**Issue: Scene is much darker in V-Ray**
**Fix**: V-Ray and Corona use different light intensity scales. Increase light multipliers by 2-5x, or adjust the camera exposure.

**Issue: Materials look different (roughness inverted)**
**Fix**: The scene converter should handle the roughness-to-glossiness inversion, but if materials look wrong, manually check the VRayMtl reflection glossiness values.

**Issue: SSS looks melted or wrong**
**Fix**: SSS parameters don't convert 1:1. Manually adjust the scatter radius and amount in VRayMtl's translucency settings.

**Issue: Render times are very different**
**Fix**: V-Ray and Corona optimize differently. V-Ray with Light Cache may be faster for interiors, while Corona's UHD Cache may be faster for exteriors. Adjust GI settings based on scene type.

## Summary

Corona to V-Ray migration uses the built-in Scene Converter for automatic conversion, followed by manual adjustment of SSS, displacement, and light intensities. Our migration process: run Scene Converter with Corona to V-Ray preset → verify materials (especially roughness-to-glossiness inversion) → adjust SSS parameters manually → verify light portal orientation → tune GI settings (Brute Force + Light Cache) → compare renders side-by-side → adjust light intensities for V-Ray's scale. The automatic converter handles 80-90% of the work; the remaining 10-20% is manual SSS, displacement, and light intensity calibration.
