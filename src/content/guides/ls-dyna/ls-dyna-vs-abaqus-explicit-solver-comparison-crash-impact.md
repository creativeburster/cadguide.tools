---
title: "LS-DYNA vs Abaqus/Explicit: Explicit Dynamics Solver Comparison for Crash and Impact"
excerpt: "A practical comparison of LS-DYNA and Abaqus/Explicit for explicit dynamics covering solver architecture, element formulations, material models, contact, parallel performance, automotive adoption, and recommendations for choosing the right explicit solver."
category: "comparison"
softwareSlug: "ls-dyna"
keyword: "ls-dyna vs abaqus explicit comparison"
slug: "ls-dyna-vs-abaqus-explicit-solver-comparison-crash-impact"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://www.3ds.com/products/simulia/abaqus"
  - "https://en.wikipedia.org/wiki/LS-DYNA"

---

# LS-DYNA vs Abaqus/Explicit: Explicit Dynamics Solver Comparison for Crash and Impact

I've used both LS-DYNA and Abaqus/Explicit enough to have real opinions about them. LS-DYNA was my first explicit solver, so I'm probably a bit biased, but I've come to appreciate Abaqus/Explicit for different reasons. If you're trying to decide which one to use, let me break down the differences I've actually experienced.

## History and Market

| | LS-DYNA | Abaqus/Explicit |
|---|---|---|
| **Developer** | LSTC (Livermore Software, now ANSYS) | Dassault Systèmes SIMULIA |
| **Origin** | Lawrence Livermore National Lab (1980s) | Hibbitt, Karlsson & Sorensen (1980s) |
| **Primary industry** | Automotive crash, defense, manufacturing | Aerospace, defense, general nonlinear |
| **Market share (crash)** | ~70% (automotive industry standard) | ~20% |
| **Market share (forming)** | ~60% | ~25% |

## Solver Architecture

| Feature | LS-DYNA | Abaqus/Explicit |
|---------|---------|-----------------|
| **Time integration** | Central difference | Central difference |
| **Mass matrix** | Lumped (diagonal) | Lumped (diagonal) |
| **Element library** | Extensive (200+ element types) | Comprehensive |
| **Material models** | 250+ material models | 50+ built-in + UMAT/VUMAT |
| **Contact** | 30+ contact types | General contact (auto-detect) |
| **Parallel** | SMP + MPP (domain decomposition) | MPI + OpenMP |
| **GPU** | Yes (CUDA) | Yes (CUDA) |
| **Keyword/Input** | Text keyword file (.k) | Input file (.inp) or CAE |

## Element Formulation

| Element | LS-DYNA | Abaqus/Explicit |
|---------|---------|-----------------|
| **Shell (default)** | Belytschko-Tsay (ELFORM 2) | S4R (similar to B-T) |
| **Shell (enhanced)** | ELFORM 16 (fully integrated) | S4 (enhanced strain) |
| **Solid (default)** | ELFORM 1 (1-point hex) | C3D8R (reduced integration) |
| **Solid (improved)** | ELFORM 2 (S/R full) | C3D8 (full integration) |
| **Tetrahedron** | ELFORM 10, 13 | C3D10M (modified, good) |
| **Beam** | ELFORM 1 (Hughes-Liu) | B31 (similar) |
| **Truss** | ELFORM 3 | T3D2 |
| **Hourglass** | Multiple types (IHQ 1-6) | Enhanced (default) |

**Key difference**: LS-DYNA offers more element formulation choices (ELFORM parameter), allowing fine-tuning for specific problems. Abaqus has fewer but well-validated options.

## Material Models

| Material | LS-DYNA | Abaqus/Explicit |
|----------|---------|-----------------|
| **Elastic** | MAT_001 | Built-in |
| **Plastic kinematic** | MAT_003 | Built-in |
| **Johnson-Cook** | MAT_015 | Built-in |
| **Piecewise linear** | MAT_024 | Built-in (tabular) |
| **Concrete damage** | MAT_159 (RHT) | Concrete damaged plasticity |
| **Composite (Hashin)** | MAT_022, MAT_054/055 | Built-in (Hashin) |
| **Rubber (hyperelastic)** | MAT_027, MAT_077 | Ogden, Mooney-Rivlin |
| **Foam** | MAT_057, MAT_083 | Built-in (crushable foam) |
| **Strain rate** | Cowper-Symonds, Johnson-Cook | Johnson-Cook, rate-dependent |
| **Failure/erosion** | *MAT_ADD_EROSION | Damage evolution + deletion |
| **User material** | User-defined (Fortran) | VUMAT (Fortran) |
| **Total material models** | 250+ | 50+ built-in |

**Key difference**: LS-DYNA has significantly more built-in material models (250+ vs 50+). For special materials (foams, honeycomb, soil, concrete), LS-DYNA likely has a pre-built model. Abaqus relies more on VUMAT user subroutines.

## Contact

| Feature | LS-DYNA | Abaqus/Explicit |
|---------|---------|-----------------|
| **General contact** | *CONTACT_AUTOMATIC_SINGLE_SURFACE | General Contact (auto-detect) |
| **Surface-to-surface** | *CONTACT_AUTOMATIC_SURFACE_TO_SURFACE | Surface-to-surface |
| **Node-to-surface** | *CONTACT_AUTOMATIC_NODES_TO_SURFACE | Node-to-surface |
| **Eroding contact** | *CONTACT_ERODING_SURFACE_TO_SURFACE | Built-in (with element deletion) |
| **Forming contact** | *CONTACT_FORMING_SURFACE_TO_SURFACE | Surface-to-surface (forming) |
| **Self-contact** | Automatic (in single surface) | Automatic (in general contact) |
| **Friction** | Static + dynamic (FS, FD) | Coulomb (μ) |
| **Contact damping** | DC parameter | Contact damping |
| **Penalty scaling** | SFS, SFM | Scale factor |

**Key difference**: LS-DYNA offers more contact types (30+), including specialized types for forming, erosion, and tied interfaces. Abaqus general contact is simpler to set up (auto-detect) but less customizable.

## Parallel Performance

| Feature | LS-DYNA | Abaqus/Explicit |
|---------|---------|-----------------|
| **SMP** | Up to 16 cores | Up to 8-16 cores |
| **MPP** | Up to 1000+ cores | Up to 1000+ cores (MPI) |
| **Domain decomposition** | Automatic (recursive) | Automatic |
| **GPU acceleration** | Yes (single GPU, multi-GPU) | Yes (single GPU) |
| **Scaling efficiency** | Excellent (MPP) | Very good (MPI) |
| **Large models** | 10M+ elements (MPP) | 10M+ elements (MPI) |

**Key difference**: LS-DYNA has slightly better MPP scaling for very large models (10M+ elements), but both are comparable for most applications.

## Automotive Crash

| Feature | LS-DYNA | Abaqus/Explicit |
|---------|---------|-----------------|
| **Industry adoption** | ~70% of automotive OEMs | ~20% of automotive OEMs |
| **Dummy models** | LSTC dummy models (free) | SIMULIA dummy models |
| **Barrier models** | Standard (NCAC, free) | Standard |
| **Airbag** | *AIRBAG_PARTICLE (advanced) | Built-in (fluid cavity) |
| **Spot weld** | *CONSTRAINED_SPOTWELD | Fastener (connector) |
| **Seatbelt** | *MAT_SEATBELT | Built-in (seatbelt element) |
| **Pedestrian impact** | Standard | Standard |
| **Regulatory compliance** | FMVSS, EuroNCAP (validated) | FMVSS, EuroNCAP |

**Key difference**: LS-DYNA is the automotive crash industry standard. Most OEMs (Toyota, Honda, Ford, GM, BMW, VW) use LS-DYNA for crash. Dummy and barrier models are widely available and validated.

## Metal Forming

| Feature | LS-DYNA | Abaqus/Explicit |
|---------|---------|-----------------|
| **Adaptive meshing** | *CONTROL_ADAPTIVE (refinement) | ALE adaptive meshing |
| **Forming contact** | *CONTACT_FORMING (specialized) | Surface-to-surface |
| **Springback (implicit)** | *CONTROL_IMPLICIT (switch) | Abaqus/Standard import |
| **FLD** | Built-in FLD evaluation | Custom (field output) |
| **Industry adoption** | ~60% | ~25% |
| **Tool compensation** | *CONTROL_SPRINGBACK_COMPENSATION | Custom workflow |

**Key difference**: LS-DYNA has better adaptive meshing (element splitting) and built-in FLD evaluation. Abaqus uses ALE for adaptive meshing (different approach). LS-DYNA's springback transition to implicit is smoother (same solver).

## User Experience

| Feature | LS-DYNA | Abaqus/Explicit |
|---------|---------|-----------------|
| **Pre-processor** | LS-PrePost (free), HyperMesh, ANSA | Abaqus/CAE, HyperMesh, ANSA |
| **Post-processor** | LS-PrePost (free) | Abaqus/CAE, LS-PrePost |
| **Input format** | Keyword file (.k, text) | Input file (.inp, text) |
| **GUI workflow** | Limited (LS-PrePost basic) | Full GUI (Abaqus/CAE) |
| **Documentation** | Manual + dynasupport.com | Manual (comprehensive) |
| **Community** | Large (dynasupport, forums) | Large (SIMULIA community) |
| **Training** | LSTC training, YouTube | SIMULIA training, courses |

**Key difference**: Abaqus/CAE provides a better integrated GUI workflow (model setup, mesh, submit, post-process in one tool). LS-DYNA workflow is more text-file oriented, with external pre/post-processors.

## Pricing

| | LS-DYNA | Abaqus/Explicit |
|---|---|---|
| **License type** | Annual lease | Annual lease (in Abaqus suite) |
| **Single solver** | ~$15,000-25,000/year | ~$20,000-30,000/year (with Standard) |
| **MPP add-on** | Additional cost | Included |
| **Dummy models** | Free (LSTC) | Additional cost (SIMULIA) |
| **Total (with dummies)** | ~$20,000-30,000/year | ~$30,000-40,000/year |

**Key difference**: LS-DYNA is generally cheaper, especially with free dummy models. Abaqus includes both Standard and Explicit in one license (value if both are needed).

## When to Choose LS-DYNA

- You work in automotive crash (industry standard)
- You need many specialized material models (250+)
- You need specialized contact types (forming, eroding)
- You work with metal forming (adaptive meshing, FLD)
- You need blast and ballistic simulation
- Your company/partners use LS-DYNA (file compatibility)
- You need free dummy and barrier models
- You prefer keyword file control (full parameter access)
- You need MPP for very large models

## When to Choose Abaqus/Explicit

- You need both implicit and explicit in one workflow (smooth transition)
- You need general contact (auto-detect, simpler setup)
- You need VUMAT user subroutines (larger community)
- You need Python scripting for automation
- You work in aerospace or defense (SIMULIA adoption)
- You prefer GUI workflow (Abaqus/CAE)
- Your company already uses SIMULIA products
- You need submodeling (global-local analysis)
- You need CEL (coupled Eulerian-Lagrangian) for fluid-structure

## Can You Use Both?

Some companies use both:
- **LS-DYNA** for crash and forming (industry standard)
- **Abaqus/Explicit** for nonlinear drop test and impact (when Abaqus/Standard is also used)

The keyword/input files are not compatible. Models must be rebuilt in the other tool.

## My Take

Here's how I decide: if I'm doing automotive crash or metal forming, LS-DYNA is the obvious choice — it's what the industry uses, the dummy models are free, and the material library is unmatched. If I'm already using Abaqus/Standard for a project and need to run an explicit drop test or impact analysis, Abaqus/Explicit makes more sense because I can import the model directly. Switching between the two isn't practical — the file formats are completely different. So pick the one that fits your industry and stick with it.
