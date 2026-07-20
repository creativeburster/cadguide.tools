---
title: "Autodesk Netfabb Hollowing and Lattice Generation: Lightweighting for Additive Manufacturing"
excerpt: "Netfabb's hollowing and lattice tools reduce part weight and material usage while maintaining structural integrity. We cover the hollowing workflow with drain holes, lattice type selection, the Optimization Engine for load-driven lattice design, and export considerations for SLS and metal AM."
category: "workflow"
softwareSlug: "autodesk-netfabb"
keyword: "Autodesk Netfabb hollowing lattice generation lightweighting additive manufacturing optimization"
slug: "autodesk-netfabb-hollowing-lattice-generation-lightweighting"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://www.autodesk.com/products/netfabb/overview"
  - "https://www.tpm.com/blog/autodesk-netfabb-the-complete-solution-for-3d-printing-preparation/"
  - "https://www.autodesk.com/products/netfabb/overview"
---

# Autodesk Netfabb Hollowing and Lattice Generation: Lightweighting for Additive Manufacturing

We've used Netfabb's hollowing and lattice tools to reduce part weight by 40-70% on aerospace and medical components destined for SLS and metal additive manufacturing. These features, available in Netfabb Premium and Ultimate, are among the most powerful lightweighting tools in the AM industry. Understanding how to configure hollowing and lattice structures correctly is essential for producing parts that are both lightweight and structurally sound.

## Why Lightweighting Matters

In additive manufacturing, reducing material usage provides multiple benefits:
- **Faster print times**: Less material means less laser exposure time (SLS) or deposition time (FDM)
- **Lower cost**: Material is often the most expensive part of AM
- **Reduced weight**: Critical for aerospace, automotive, and medical applications
- **Improved performance**: Lattice structures can absorb energy better than solid material
- **Better print quality**: Hollowed parts have less thermal mass, reducing warping

## Hollowing

### Basic Hollowing Workflow

1. Import and repair the mesh
2. Select the part
3. Go to **Hollow** → **Create Hollow**
4. Configure settings:
   - **Wall Thickness**: Typically 1-3mm depending on part size and material
   - **Inner Offset**: Distance the hollow shell is offset from the outer surface
   - **Opening**: Whether to add drain holes (essential for SLS/SLA)
5. Click **Apply** to create the hollow shell

### Drain Holes

For SLS and SLA printing, trapped powder or resin inside a hollow part must be able to drain out:

1. After hollowing, go to **Hollow** → **Add Drain Hole**
2. Click on the part surface where you want the hole
3. Set the hole diameter (typically 3-10mm depending on part size)
4. Add multiple drain holes for better drainage
5. Position holes on surfaces that won't be visible in the final part

**Critical**: Without drain holes, trapped material inside a hollow SLS part adds weight and can cause the part to fail during post-processing. For SLA, trapped resin causes the part to crack during curing.

### Hollowing Considerations

- **Minimum wall thickness**: Must be at least 2x the layer height for structural integrity
- **Wall uniformity**: Check that walls are uniform thickness — thin spots can fail
- **Internal geometry**: Complex internal shapes may trap material even with drain holes
- **Structural impact**: Hollowing reduces strength — verify the part still meets load requirements

## Lattice Generation

### What Are Lattice Structures?

Lattice structures are repeating 3D patterns that replace solid material with a framework of struts or cells. They provide:
- High strength-to-weight ratio
- Energy absorption (crumple zones)
- Thermal management (heat exchangers)
- Bone ingrowth surfaces (medical implants)

### Creating Lattice Structures

1. Select the part
2. Go to **Lattice** → **Create Lattice**
3. Choose the lattice type:
   - **Tetrahedral**: Triangular pyramid cells — strong, isotropic
   - **Hexagonal**: Honeycomb-like cells — good for flat structures
   - **Stochastic**: Random-looking cells — biomimetic, good for medical
   - **Gyroid**: Smooth curved surfaces — excellent for fluid flow
   - **Octet**: Star-shaped cells — high stiffness-to-weight ratio
4. Configure cell parameters:
   - **Cell Size**: Smaller cells = finer structure but longer print time
   - **Cell Thickness**: Strut diameter — thicker = stronger but heavier
   - **Density**: Percentage of solid material replaced by lattice
5. Click **Apply** to generate the lattice

### Lattice Types and Applications

| Lattice Type | Best For | Characteristics |
|-------------|----------|----------------|
| Tetrahedral | General lightweighting | Isotropic strength, easy to print |
| Hexagonal | Flat panels, brackets | Strong in one direction |
| Stochastic | Medical implants | Biomimetic, bone ingrowth |
| Gyroid | Heat exchangers, fluid flow | Self-supporting, smooth surfaces |
| Octet | Aerospace structures | Maximum stiffness-to-weight |

### Lattice with Skin

For parts that need a solid outer surface with internal lattice:
1. Create the lattice structure
2. Enable **Skin** option in the lattice settings
3. Set skin thickness (typically 0.5-2mm)
4. Netfabb generates a solid outer shell with lattice infill
5. This combines the surface quality of a solid part with the weight savings of lattice

## The Optimization Engine (Ultimate)

Netfabb Ultimate includes an Optimization Engine that automatically designs lattice structures based on load requirements:

1. Define the part's load conditions:
   - Fixed points (where the part is mounted)
   - Force vectors (direction and magnitude of applied loads)
   - Material properties (yield strength, Young's modulus)
2. Run the Optimization Engine
3. Netfabb performs finite element analysis (FEA)
4. The engine adjusts lattice density and strut thickness based on stress distribution
5. High-stress areas get denser lattice; low-stress areas get sparse lattice
6. The result is a part that meets load requirements with minimum weight

As TPM's blog describes: "Autodesk Netfabb also includes an Optimization Engine that can automatically verify and optimize lattice and skin elements to meet load requirements and reduce weight."

### Optimization Workflow

1. Import the solid part
2. Define boundary conditions (constraints and loads)
3. Set target weight reduction (e.g., 50%)
4. Set minimum safety factor (e.g., 1.5)
5. Run optimization — this can take minutes to hours depending on complexity
6. Review the optimized lattice structure
7. Verify with a final FEA simulation
8. Export for printing

## Export Considerations

### File Size

Lattice structures dramatically increase mesh complexity:
- A simple solid part might be 50,000 triangles
- The same part with lattice can be 500,000-5,000,000 triangles
- Use **Binary STL** format for smaller file size
- Consider **3MF** format for even better compression

### Print Technology Compatibility

**SLS**: Lattice structures print well — no supports needed, powder drains through open cells
**SLA**: Fine lattice details may be lost with low-resolution printers; drain holes essential
**Metal AM**: Lattice structures are excellent for metal AM but require careful thermal management
**FDM**: Lattice structures are difficult — overhangs within the lattice need supports that can't be removed

## Common Issues

### Lattice Too Dense

- Increase cell size
- Reduce cell thickness
- Lower the density percentage
- Use the Optimization Engine to remove material from low-stress areas

### Lattice Too Weak

- Decrease cell size (more struts per volume)
- Increase cell thickness
- Use a stronger lattice type (tetrahedral or octet)
- Add skin for outer surface strength

### Print Failures with Lattice

- Ensure the lattice cells are large enough for the print technology
- For SLS: cells must be larger than the powder particle size
- For SLA: cells must be larger than the laser spot size
- For FDM: lattice structures are generally not recommended

### Hollowed Part Fails

- Increase wall thickness
- Check for thin spots in the hollow shell
- Add internal ribs for structural support
- Verify the part still meets load requirements after hollowing

## Summary

Netfabb's hollowing and lattice tools are powerful lightweighting features for additive manufacturing. Hollowing removes internal material — always add drain holes for SLS and SLA parts. Lattice structures replace solid material with repeating patterns — choose the lattice type based on your application (tetrahedral for general use, gyroid for fluid flow, stochastic for medical). The Optimization Engine (Ultimate) automatically designs load-driven lattice structures using FEA. Always verify that lightweighted parts still meet structural requirements, and consider the print technology — SLS handles lattice best, FDM struggles with internal supports. Export as Binary STL or 3MF to manage the large file sizes that lattice structures generate.
