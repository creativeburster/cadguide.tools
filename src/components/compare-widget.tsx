'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Cpu, Zap, Layers, Network, Database, Shield, LayoutGrid, FileText } from 'lucide-react';

interface Tool {
  name: string;
  slug: string;
  category_id: string;
  score: number;
  pricing_type: string;
  starting_price: number;
  platforms: string[];
  deployment_options?: string[];
  file_formats_in?: string[];
  api_sdk?: {
    has_api: boolean;
    api_type?: string;
  };
  pros?: string[];
  cons?: string[];
  description?: string;
  short_desc?: string;
}

interface CompareWidgetProps {
  a: Tool;
  b: Tool;
  archetype: 'drafting' | 'mcad' | 'bim' | 'cae' | 'eda' | 'simulation' | 'creative';
}

interface MetricItem {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  aDetail: string;
  bDetail: string;
  comparison: string;
}

export function CompareWidget({ a, b, archetype }: CompareWidgetProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Normalize legacy 'simulation' archetype into either 'eda' or 'cae'
  const resolvedArchetype: 'drafting' | 'mcad' | 'bim' | 'cae' | 'eda' | 'creative' = (() => {
    if (archetype === 'simulation') {
      return (a.category_id === 'c6' || b.category_id === 'c6') ? 'eda' : 'cae';
    }
    return archetype;
  })();

  const getWidgetData = (): { title: string; subtitle: string; metrics: MetricItem[] } => {
    switch (resolvedArchetype) {
      case 'drafting':
        return {
          title: 'Drafting & 2D Compatibility Assessment',
          subtitle: `Evaluating CAD commands, script automation, and drafting file fidelity between ${a.name} and ${b.name}.`,
          metrics: [
            {
              id: 'pgp-aliases',
              name: 'Command Shortcuts & Alias Mapping (.PGP)',
              icon: LayoutGrid,
              description: 'Compatibility of standard command shortcuts (e.g. L for Line, C for Circle) and custom alias triggers.',
              aDetail: a.slug === 'autocad' ? 'Native industry standard defining default PGP syntax.' : `${a.name} offers customizable shortcut mapping compatible with standard drafting command patterns.`,
              bDetail: b.slug === 'autocad' ? 'Native industry standard defining default PGP syntax.' : `${b.name} offers customizable shortcut mapping compatible with standard drafting command patterns.`,
              comparison: `Direct shortcut mapping between ${a.name} and ${b.name} enables drafting velocity without operator retraining.`
            },
            {
              id: 'lisp-api',
              name: 'LISP & Automation Scripting APIs',
              icon: CodeIcon,
              description: 'Support for Visual LISP, standard AutoLISP, DCL dialogs, and external API automation bindings.',
              aDetail: a.slug === 'bricscad' ? 'High-performance LISP engine with full support for Visual LISP, ActiveX, and encryption.' : a.api_sdk?.has_api ? `Supported (${a.api_sdk.api_type || 'Automation API'}).` : 'Standard menu-based macros without full LISP solver.',
              bDetail: b.slug === 'bricscad' ? 'High-performance LISP engine with full support for Visual LISP, ActiveX, and encryption.' : b.api_sdk?.has_api ? `Supported (${b.api_sdk.api_type || 'Automation API'}).` : 'Standard menu-based macros without full LISP solver.',
              comparison: `${a.name} and ${b.name} approach automation differently: verify whether your legacy routines rely on dedicated LISP engines or modern REST/C++ APIs.`
            },
            {
              id: 'dynamic-blocks',
              name: 'Dynamic & Parametric Block Manipulation',
              icon: Layers,
              description: 'Capacity to read, evaluate, and author dynamic parametric elements with stretch, flip, and visibility states.',
              aDetail: a.slug === 'autocad' ? 'Full dynamic blocks authoring and multi-state editing.' : a.slug === 'bricscad' ? 'Native editing of dynamic blocks with parametric 2D/3D blocks.' : `${a.name} displays complex dynamic blocks with preserved visual fidelity.`,
              bDetail: b.slug === 'autocad' ? 'Full dynamic blocks authoring and multi-state editing.' : b.slug === 'bricscad' ? 'Native editing of dynamic blocks with parametric 2D/3D blocks.' : `${b.name} displays complex dynamic blocks with preserved visual fidelity.`,
              comparison: `Parametric and dynamic block handling determines how seamlessly ${a.name} and ${b.name} can exchange intelligent symbol libraries.`
            },
            {
              id: 'dwg-integrity',
              name: 'DWG / DXF Read-Write Fidelity',
              icon: FileText,
              description: 'Drawing compliance, layer management, linetype scaling, and metadata safety during drawing exchange.',
              aDetail: a.slug === 'autocad' ? 'Autodesk TrustedDWG native format reference engine.' : `${a.name} uses verified ODA (OpenDesign Alliance) libraries for DWG/DXF read-write compatibility.`,
              bDetail: b.slug === 'autocad' ? 'Autodesk TrustedDWG native format reference engine.' : `${b.name} uses verified ODA (OpenDesign Alliance) libraries for DWG/DXF read-write compatibility.`,
              comparison: `Both ${a.name} and ${b.name} maintain drawing layer hierarchies, lineweights, and text styles across modern DWG versions.`
            }
          ]
        };

      case 'mcad':
        return {
          title: 'Mechanical Assembly & Modeling Kernel Analysis',
          subtitle: `Comparing geometric kernels, parametric mate solvers, and manufacturing handoffs between ${a.name} and ${b.name}.`,
          metrics: [
            {
              id: 'geometric-kernel',
              name: 'Geometric Modeling Kernel Architecture',
              icon: Database,
              description: 'The solid-modeling engine handling B-Rep boundary math, complex blend fillets, and surface continuity.',
              aDetail: (a.slug === 'solidworks' || a.slug === 'onshape' || a.slug === 'solid-edge') ? 'Siemens Parasolid kernel (industry standard for mechanical precision and topology healing).' : a.slug === 'fusion-360' || a.slug === 'autodesk-inventor' ? 'Autodesk ShapeManager (optimized for direct modeling and rapid organic surfaces).' : a.slug === 'freecad' ? 'OpenCASCADE Technology (modular open-source boundary representation).' : `${a.name} geometric modeling engine.`,
              bDetail: (b.slug === 'solidworks' || b.slug === 'onshape' || b.slug === 'solid-edge') ? 'Siemens Parasolid kernel (industry standard for mechanical precision and topology healing).' : b.slug === 'fusion-360' || b.slug === 'autodesk-inventor' ? 'Autodesk ShapeManager (optimized for direct modeling and rapid organic surfaces).' : b.slug === 'freecad' ? 'OpenCASCADE Technology (modular open-source boundary representation).' : `${b.name} geometric modeling engine.`,
              comparison: `Kernel architecture determines how ${a.name} and ${b.name} resolve non-manifold topology, complex draft angles, and neutral STEP/IGES translation.`
            },
            {
              id: 'assembly-mates',
              name: 'Parametric Assembly & Degree-of-Freedom Constraints',
              icon: Network,
              description: 'Method for solving multi-part assembly relations, mechanical linkages, and kinematic motion limits.',
              aDetail: `${a.name} provides parametric assembly solving with kinematic degree-of-freedom limits and collision detection.`,
              bDetail: `${b.name} provides parametric assembly solving with kinematic degree-of-freedom limits and collision detection.`,
              comparison: `${a.name} and ${b.name} organize part relations with different philosophies; evaluate whether you prefer relational joint constraints or multi-mate hierarchy.`
            },
            {
              id: 'cam-integration',
              name: 'CAM & CNC Toolpath Generation',
              icon: Zap,
              description: 'Integrated 2.5D to 5-axis CNC machining strategies and customizable post-processor support.',
              aDetail: a.slug === 'fusion-360' ? 'Built-in multi-axis HSM CAM with extensive cloud post-processor library.' : a.slug === 'mastercam' ? 'Enterprise benchmark for multi-axis milling, turning, and machine simulation.' : `${a.name} supports CNC data export via STEP/IGES or integrated manufacturing add-ons.`,
              bDetail: b.slug === 'fusion-360' ? 'Built-in multi-axis HSM CAM with extensive cloud post-processor library.' : b.slug === 'mastercam' ? 'Enterprise benchmark for multi-axis milling, turning, and machine simulation.' : `${b.name} supports CNC data export via STEP/IGES or integrated manufacturing add-ons.`,
              comparison: `When taking designs from screen to shop floor, assess whether ${a.name}'s integrated workflow or ${b.name}'s tooling ecosystem fits your CNC pipeline.`
            },
            {
              id: 'large-assemblies',
              name: 'Large Assembly Graphics & Memory Optimization',
              icon: Cpu,
              description: 'Viewport framerate and memory consumption when loading assemblies containing thousands of unique sub-components.',
              aDetail: a.deployment_options?.includes('Cloud') ? `${a.name} offloads rendering compute to distributed servers, minimizing local memory strain.` : `${a.name} utilizes workstation GPU hardware acceleration and lightweight representation states.`,
              bDetail: b.deployment_options?.includes('Cloud') ? `${b.name} offloads rendering compute to distributed servers, minimizing local memory strain.` : `${b.name} utilizes workstation GPU hardware acceleration and lightweight representation states.`,
              comparison: `For assemblies with 5,000+ components, compare how ${a.name} and ${b.name} optimize GPU draw calls and background data streaming.`
            }
          ]
        };

      case 'bim':
        return {
          title: 'BIM Interoperability & Multi-Discipline Coordination',
          subtitle: `Evaluating openBIM certifications, intelligent architectural entities, and project sync between ${a.name} and ${b.name}.`,
          metrics: [
            {
              id: 'ifc-compliance',
              name: 'openBIM & IFC Schema Compliance',
              icon: Shield,
              description: 'Fidelity of IFC4 and IFC2x3 architectural/structural model data exchange without information loss.',
              aDetail: a.slug === 'archicad' ? 'Gold-standard openBIM certification with native IFC mapping algorithms.' : `${a.name} certified for IFC export/import with customizable Property Set (Pset) configurations.`,
              bDetail: b.slug === 'archicad' ? 'Gold-standard openBIM certification with native IFC mapping algorithms.' : `${b.name} certified for IFC export/import with customizable Property Set (Pset) configurations.`,
              comparison: `Both ${a.name} and ${b.name} support openBIM collaboration; ensure required project IFC property sets map smoothly between platforms.`
            },
            {
              id: 'parametric-elements',
              name: 'Smart Building Elements & Schedule Generation',
              icon: Layers,
              description: 'Parametric intelligence of structural walls, curtain facades, doors, and automatic quantity takeoff schedules.',
              aDetail: a.slug === 'revit' ? 'Deep parametric family (.RFA) architecture linked to unified project databases.' : a.slug === 'archicad' ? 'GDL-powered architectural objects with instant interactive 2D/3D parametric handles.' : `${a.name} smart architectural component system with real-time schedule linking.`,
              bDetail: b.slug === 'revit' ? 'Deep parametric family (.RFA) architecture linked to unified project databases.' : b.slug === 'archicad' ? 'GDL-powered architectural objects with instant interactive 2D/3D parametric handles.' : `${b.name} smart architectural component system with real-time schedule linking.`,
              comparison: `${a.name} and ${b.name} structure building elements differently: consider whether your practice prioritizes flexible parametric families or fast out-of-the-box drafting objects.`
            },
            {
              id: 'cloud-collaboration',
              name: 'Real-Time Team Sync & Worksharing',
              icon: Network,
              description: 'Capacity for multi-disciplinary teams to edit the central project model simultaneously without work locking.',
              aDetail: `${a.name} supports multi-user worksharing and team project synchronization.`,
              bDetail: `${b.name} supports multi-user worksharing and team project synchronization.`,
              comparison: `Collaborative throughput between ${a.name} and ${b.name} depends on local network bandwidth and project worksharing permissions.`
            },
            {
              id: 'mep-coordination',
              name: 'MEP & Structural Clash Detection',
              icon: Cpu,
              description: 'Coordination between architectural spatial envelopes, HVAC/piping runs, and structural steel framing.',
              aDetail: `${a.name} provides integrated coordination tools or export workflows for multi-disciplinary clearance checks.`,
              bDetail: `${b.name} provides integrated coordination tools or export workflows for multi-disciplinary clearance checks.`,
              comparison: `Interdisciplinary spatial coordination is streamlined when ${a.name} and ${b.name} exchange clean analytical models and MEP route geometry.`
            }
          ]
        };

      case 'cae':
        return {
          title: 'CAE Engineering Simulation & Physics Solver Analysis',
          subtitle: `Evaluating finite element (FEA), computational fluid dynamics (CFD), and mesh convergence between ${a.name} and ${b.name}.`,
          metrics: [
            {
              id: 'solver-scaling',
              name: 'Solver Parallelization & HPC Scaling',
              icon: Cpu,
              description: 'Computational scaling across high-performance CPU cores, GPU accelerators, and distributed cluster nodes.',
              aDetail: `${a.name} features multi-threaded mathematical solvers with support for parallelized matrix factorization.`,
              bDetail: `${b.name} features multi-threaded mathematical solvers with support for parallelized matrix factorization.`,
              comparison: `${a.name} and ${b.name} leverage compute hardware differently: evaluate whether your simulations benefit from local workstation acceleration or enterprise cluster scaling.`
            },
            {
              id: 'adaptive-meshing',
              name: 'Meshing Engine & Boundary Layer Control',
              icon: Layers,
              description: 'Automated mesh generation, inflation layers, polyhedral/tetrahedral elements, and adaptive mesh refinement (AMR).',
              aDetail: `${a.name} incorporates robust meshing algorithms with local curvature refinement and quality metrics auditing.`,
              bDetail: `${b.name} incorporates robust meshing algorithms with local curvature refinement and quality metrics auditing.`,
              comparison: `Discretization accuracy in ${a.name} versus ${b.name} directly influences solution convergence and singularity prevention.`
            },
            {
              id: 'multiphysics-coupling',
              name: 'Multiphysics Field Coupling',
              icon: Network,
              description: 'Capability to solve simultaneous coupled equations (e.g. thermal-stress, fluid-structure interaction, conjugate heat transfer).',
              aDetail: a.slug === 'comsol-multiphysics' ? 'Monolithic fully-coupled multiphysics solving allowing arbitrary user PDE coupling.' : `${a.name} provides coupled or sequential multi-domain physics solving.`,
              bDetail: b.slug === 'comsol-multiphysics' ? 'Monolithic fully-coupled multiphysics solving allowing arbitrary user PDE coupling.' : `${b.name} provides coupled or sequential multi-domain physics solving.`,
              comparison: `Decide whether your engineering problem requires the unified coupled formulation of ${a.name} or the specialized modular solvers of ${b.name}.`
            },
            {
              id: 'post-processing',
              name: 'Post-Processing & Compliance Visualization',
              icon: FileText,
              description: 'Contour plots, vector flowlines, safety factor calculations, and automated engineering report generation.',
              aDetail: `${a.name} generates detailed stress/flow contour plots and automated engineering validation summaries.`,
              bDetail: `${b.name} generates detailed stress/flow contour plots and automated engineering validation summaries.`,
              comparison: `Both ${a.name} and ${b.name} provide comprehensive visual post-processing for design verification and client presentations.`
            }
          ]
        };

      case 'eda':
        return {
          title: 'EDA Schematic & PCB Layout Verification',
          subtitle: `Comparing schematic synchronization, high-speed routing, design rule checks, and manufacturing outputs between ${a.name} and ${b.name}.`,
          metrics: [
            {
              id: 'schematic-sync',
              name: 'Schematic to PCB ECO Synchronization',
              icon: Zap,
              description: 'Bi-directional forward and backward annotation between schematic captures and PCB layout footprints.',
              aDetail: a.slug === 'altium-designer' ? 'Seamless real-time ECO (Engineering Change Order) bi-directional link with absolute footprint integrity.' : `${a.name} provides structured netlist synchronization and pin-to-pad forward annotation.`,
              bDetail: b.slug === 'altium-designer' ? 'Seamless real-time ECO (Engineering Change Order) bi-directional link with absolute footprint integrity.' : `${b.name} provides structured netlist synchronization and pin-to-pad forward annotation.`,
              comparison: `${a.name} and ${b.name} maintain netlist integrity through ECO cycles, minimizing discrepancies between logic schematics and physical traces.`
            },
            {
              id: 'high-speed-routing',
              name: 'High-Speed Routing & Differential Pair Tuning',
              icon: Network,
              description: 'Interactive trace routing, length matching, impedance-controlled differential pairs, and return path grounding.',
              aDetail: `${a.name} supports interactive push-and-shove routing with differential pair length tuning tools.`,
              bDetail: `${b.name} supports interactive push-and-shove routing with differential pair length tuning tools.`,
              comparison: `When routing high-frequency signals, compare how ${a.name} and ${b.name} handle trace impedance formulas and snake length tuning.`
            },
            {
              id: 'drc-engine',
              name: 'Real-Time Design Rule Check (DRC)',
              icon: Shield,
              description: 'Speed and granularity of clearance checking, trace width constraints, and manufacturing tolerance validation.',
              aDetail: a.slug === 'altium-designer' ? 'Real-time online 3D DRC running on GPU hardware shaders.' : `${a.name} offers comprehensive rule auditing with detailed violation reports.`,
              bDetail: b.slug === 'altium-designer' ? 'Real-time online 3D DRC running on GPU hardware shaders.' : `${b.name} offers comprehensive rule auditing with detailed violation reports.`,
              comparison: `${a.name} and ${b.name} protect boards from fabrication respins by validating clearance and stackup rules before release.`
            },
            {
              id: 'manufacturing-exports',
              name: 'Fabrication Outputs (Gerber, ODB++, IPC-2581)',
              icon: FileText,
              description: 'Standardized CAM generation, drill charts, BOM spreadsheets, and pick-and-place centroid files.',
              aDetail: `${a.name} exports industry-standard Gerber RS-274X, Excellon drill files, and BOM data.`,
              bDetail: `${b.name} exports industry-standard Gerber RS-274X, Excellon drill files, and BOM data.`,
              comparison: `Seamless handoff to PCB board houses is supported by both ${a.name} and ${b.name} across standard CAM packaging formats.`
            }
          ]
        };

      default: // creative
        return {
          title: '3D Visualization & Creative Pipeline Assessment',
          subtitle: `Auditing rendering engines, modeling topology, asset ecosystems, and format interchange between ${a.name} and ${b.name}.`,
          metrics: [
            {
              id: 'render-engine',
              name: 'Rendering & Ray-Tracing Pipeline',
              icon: Zap,
              description: 'Architecture of the rendering engine: real-time rasterization, interactive path-tracing, or unbiased ray-tracing.',
              aDetail: a.slug === 'blender' ? 'Cycles (physically-based GPU path-tracer) + Eevee (real-time rasterization engine).' : `${a.name} high-fidelity rendering pipeline with physical material shaders.`,
              bDetail: b.slug === 'blender' ? 'Cycles (physically-based GPU path-tracer) + Eevee (real-time rasterization engine).' : `${b.name} high-fidelity rendering pipeline with physical material shaders.`,
              comparison: `Choosing between ${a.name} and ${b.name} depends on whether your project prioritizes instant real-time viewport feedback or cinematic path-tracing.`
            },
            {
              id: 'modeling-tech',
              name: 'Polygonal SubD vs Mathematical Surface Modeling',
              icon: Layers,
              description: 'Underlying modeling topology: organic subdivision polygons vs mathematically exact NURBS curves.',
              aDetail: a.slug === 'rhino-3d' ? 'Unrivaled precision NURBS curve and surface modeling (standard for industrial and yacht design).' : `${a.name} geometric sculpting and polygonal modeling toolkit.`,
              bDetail: b.slug === 'rhino-3d' ? 'Unrivaled precision NURBS curve and surface modeling (standard for industrial and yacht design).' : `${b.name} geometric sculpting and polygonal modeling toolkit.`,
              comparison: `${a.name} and ${b.name} employ distinct modeling primitives; verify whether you need manufacturing-ready NURBS tolerances or organic artistic flexibility.`
            },
            {
              id: 'ecosystem',
              name: 'Asset Ecosystem & Plugin Extensibility',
              icon: LayoutGrid,
              description: 'Breadth of material presets, pre-rigged asset libraries, procedural shaders, and third-party script communities.',
              aDetail: a.slug === 'blender' ? 'Vast global open-source community providing thousands of add-ons, scripts, and asset packs.' : `${a.name} curated commercial library of ready-to-render assets and materials.`,
              bDetail: b.slug === 'blender' ? 'Vast global open-source community providing thousands of add-ons, scripts, and asset packs.' : `${b.name} curated commercial library of ready-to-render assets and materials.`,
              comparison: `Scene composition velocity is directly boosted by the material libraries and plugin ecosystems available in ${a.name} and ${b.name}.`
            },
            {
              id: 'pipeline-interop',
              name: 'Pipeline Interoperability (USD, FBX, glTF)',
              icon: FileText,
              description: 'Data fidelity when exchanging geometry, camera rigs, and PBR textures across DCC and game engine pipelines.',
              aDetail: `${a.name} supports universal 3D asset interchange formats including USD, glTF, and FBX.`,
              bDetail: `${b.name} supports universal 3D asset interchange formats including USD, glTF, and FBX.`,
              comparison: `Multi-software workflows run smoothly when ${a.name} and ${b.name} export clean UV maps and scene hierarchy data.`
            }
          ]
        };
    }
  };

  const widgetData = getWidgetData();

  const getArchetypeStyles = () => {
    switch (resolvedArchetype) {
      case 'drafting':
        return {
          border: 'border-slate-200 hover:border-slate-400',
          badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
          badgeText: 'text-slate-800',
          glowShadow: 'hover:shadow-[0_0_20px_rgba(71,85,105,0.08)]',
          gradientBg: 'from-slate-700 to-zinc-900',
          cardBg: 'bg-slate-50/50'
        };
      case 'mcad':
        return {
          border: 'border-amber-200 hover:border-amber-400',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
          badgeText: 'text-amber-900',
          glowShadow: 'hover:shadow-[0_0_20px_rgba(217,119,6,0.08)]',
          gradientBg: 'from-amber-600 to-stone-900',
          cardBg: 'bg-stone-50/50'
        };
      case 'bim':
        return {
          border: 'border-emerald-200 hover:border-emerald-400',
          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
          badgeText: 'text-emerald-900',
          glowShadow: 'hover:shadow-[0_0_20px_rgba(5,150,105,0.08)]',
          gradientBg: 'from-emerald-600 to-zinc-900',
          cardBg: 'bg-zinc-50/50'
        };
      case 'cae':
        return {
          border: 'border-indigo-200 hover:border-indigo-400',
          badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-200',
          badgeText: 'text-indigo-900',
          glowShadow: 'hover:shadow-[0_0_20px_rgba(79,70,229,0.08)]',
          gradientBg: 'from-indigo-600 to-violet-900',
          cardBg: 'bg-indigo-50/20'
        };
      case 'eda':
        return {
          border: 'border-cyan-200 hover:border-cyan-400',
          badgeBg: 'bg-cyan-100 text-cyan-900 border-cyan-200',
          badgeText: 'text-cyan-900',
          glowShadow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]',
          gradientBg: 'from-cyan-700 to-teal-950',
          cardBg: 'bg-cyan-50/20'
        };
      default:
        return {
          border: 'border-blue-200 hover:border-blue-400',
          badgeBg: 'bg-blue-100 text-blue-900 border-blue-200',
          badgeText: 'text-blue-900',
          glowShadow: 'hover:shadow-[0_0_20px_rgba(37,99,235,0.08)]',
          gradientBg: 'from-blue-600 to-slate-900',
          cardBg: 'bg-slate-50/50'
        };
    }
  };

  const styles = getArchetypeStyles();

  return (
    <div className={`mt-10 rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 ${styles.border} ${styles.glowShadow}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles.badgeBg}`}>
            Advanced Engineering Analysis
          </span>
          <h3 className="mt-2 text-xl font-bold text-slate-900 tracking-tight">{widgetData.title}</h3>
          <p className="text-sm text-slate-500 mt-1">{widgetData.subtitle}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {widgetData.metrics.map((metric) => {
          const IconComponent = metric.icon;
          const isExpanded = expandedId === metric.id;
          return (
            <div
              key={metric.id}
              className={`rounded-xl border transition-all duration-300 ${
                isExpanded ? 'border-slate-300 bg-slate-50/50 shadow-sm' : 'border-slate-100 bg-white hover:bg-slate-50/30'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : metric.id)}
                className="w-full flex items-start gap-4 p-4 text-left focus:outline-none"
              >
                <div className={`p-2.5 rounded-lg border bg-white shadow-xs shrink-0 text-slate-600`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="grow pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm md:text-base">{metric.name}</span>
                    <span className="text-xs text-slate-400 font-normal hidden sm:inline">(Click to contrast)</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 mt-1 line-clamp-1">{metric.description}</p>
                </div>
                <div className={`shrink-0 transition-transform duration-300 mt-1 ${isExpanded ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                </div>
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isExpanded ? 'max-h-[500px] border-t border-slate-100 p-4 bg-white rounded-b-xl' : 'max-h-0'
                }`}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/30">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{a.name}</div>
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">{metric.aDetail}</p>
                  </div>
                  <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/30">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{b.name}</div>
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">{metric.bDetail}</p>
                  </div>
                </div>
                <div className="mt-3.5 p-3 rounded-lg border border-blue-50 bg-blue-50/20 flex gap-2 items-start">
                  <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-700 leading-relaxed">
                    <strong className="font-semibold">Verdict: </strong>
                    {metric.comparison}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Simple local subcomponent to prevent import problems
function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
