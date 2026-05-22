'use client';

import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, AlertTriangle, ChevronDown, Cpu, Zap, Layers, Network, Database, Shield, LayoutGrid, FileText } from 'lucide-react';

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
  archetype: 'drafting' | 'mcad' | 'bim' | 'simulation' | 'creative';
}

interface MetricItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  aDetail: string;
  bDetail: string;
  comparison: string;
}

export function CompareWidget({ a, b, archetype }: CompareWidgetProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getWidgetData = (): { title: string; subtitle: string; metrics: MetricItem[] } => {
    switch (archetype) {
      case 'drafting':
        return {
          title: 'Drafting & 2D Compatibility Assessment',
          subtitle: 'Evaluating legacy CAD commands, automation, and drafting file fidelity.',
          metrics: [
            {
              id: 'pgp-aliases',
              name: 'AutoCAD Command Aliases (.PGP)',
              icon: LayoutGrid,
              description: 'Compatibility of standard command shortcuts (e.g., L for Line, C for Circle) and legacy custom script triggers.',
              aDetail: a.slug === 'autocad' ? 'Native industry standard.' : `${a.name} offers highly compatible shortcut mapping, supporting most default PGP commands.`,
              bDetail: b.slug === 'autocad' ? 'Native industry standard.' : `${b.name} offers highly compatible shortcut mapping, supporting most default PGP commands.`,
              comparison: 'Direct shortcut matching enables drafting velocity without operator retraining.'
            },
            {
              id: 'lisp-api',
              name: 'LISP & Automation APIs',
              icon: CodeIcon,
              description: 'Support for Visual LISP, standard AutoLISP, DCL (Dialog Control Language), and ActiveX automation.',
              aDetail: a.slug === 'bricscad' ? 'High-performance LISP engine with full support for Visual LISP, ActiveX, and LISP encryption.' : a.api_sdk?.has_api ? `Supported (${a.api_sdk.api_type || 'LISP/API'}).` : 'No native LISP solver.',
              bDetail: b.slug === 'bricscad' ? 'High-performance LISP engine with full support for Visual LISP, ActiveX, and LISP encryption.' : b.api_sdk?.has_api ? `Supported (${b.api_sdk.api_type || 'LISP/API'}).` : 'No native LISP solver.',
              comparison: 'BricsCAD and AutoCAD support advanced visual scripting, whereas lightweight drafting alternatives support only basic commands.'
            },
            {
              id: 'dynamic-blocks',
              name: 'Dynamic Blocks Manipulation',
              icon: Layers,
              description: 'Capacity to read, evaluate, and author dynamic parametric elements containing stretch, polar, and visibility states.',
              aDetail: a.slug === 'autocad' ? 'Full dynamic blocks creation and editing.' : a.slug === 'bricscad' ? 'Native editing of AutoCAD dynamic blocks + robust Parametric Blocks creation.' : 'Displays dynamic blocks as static references.',
              bDetail: b.slug === 'autocad' ? 'Full dynamic blocks creation and editing.' : b.slug === 'bricscad' ? 'Native editing of AutoCAD dynamic blocks + robust Parametric Blocks creation.' : 'Displays dynamic blocks as static references.',
              comparison: 'AutoCAD and BricsCAD offer true dynamic block manipulation; other tools convert them to rigid blocks.'
            },
            {
              id: 'dwg-integrity',
              name: 'DWG Read/Write Fidelity',
              icon: FileText,
              description: 'Native file compliance, layer style integrity, and metadata safety during drawing exchange.',
              aDetail: a.slug === 'autocad' ? 'Autodesk TrustedDWG native format.' : 'Native DWG engine based on OpenDesign Alliance (ODA) libraries.',
              bDetail: b.slug === 'autocad' ? 'Autodesk TrustedDWG native format.' : 'Native DWG engine based on OpenDesign Alliance (ODA) libraries.',
              comparison: 'Both tools offer 100% layer fidelity, though Autodesk uses TrustedDWG verification warnings for non-Autodesk files.'
            }
          ]
        };

      case 'mcad':
        return {
          title: 'Mechanical CAD Assembly & Modeling Kernel Analysis',
          subtitle: 'Direct breakdown of mathematical modeling kernels, assembly solvers, and G-code integration.',
          metrics: [
            {
              id: 'geometric-kernel',
              name: 'Geometric Modeling Kernel',
              icon: Database,
              description: 'The solid-modeling engine (e.g., Parasolid, ShapeManager, OpenCascade) handling B-Rep boundary math and fillets.',
              aDetail: a.slug === 'solidworks' || a.slug === 'onshape' ? 'Siemens Parasolid kernel (outstanding stability, industry-standard precision).' : a.slug === 'fusion-360' ? 'Autodesk ShapeManager kernel (excellent for direct editing and modern surfaces).' : a.slug === 'freecad' ? 'OpenCascade open-source kernel (flexible boundary representation).' : 'Proprietary modeling engine.',
              bDetail: b.slug === 'solidworks' || b.slug === 'onshape' ? 'Siemens Parasolid kernel (outstanding stability, industry-standard precision).' : b.slug === 'fusion-360' ? 'Autodesk ShapeManager kernel (excellent for direct editing and modern surfaces).' : b.slug === 'freecad' ? 'OpenCascade open-source kernel (flexible boundary representation).' : 'Proprietary modeling engine.',
              comparison: 'Parasolid-based systems exchange native parts with zero translation errors. OpenCascade is highly capable but less standardized.'
            },
            {
              id: 'assembly-mates',
              name: 'Parametric Assembly Constraints',
              icon: Network,
              description: 'Method for solving multi-component assembly relations, degree-of-freedom limits, and dynamic mates.',
              aDetail: a.slug === 'solidworks' ? 'Feature-rich Mate solver with mechanical, magnetic, and coordinate constraints.' : a.slug === 'fusion-360' ? 'Joint-centric assembly (combines relative position and degrees of freedom directly).' : a.slug === 'onshape' ? 'Advanced cloud-based Mate Connectors (extremely fast assembly setups).' : 'Standard constraint solver.',
              bDetail: b.slug === 'solidworks' ? 'Feature-rich Mate solver with mechanical, magnetic, and coordinate constraints.' : b.slug === 'fusion-360' ? 'Joint-centric assembly (combines relative position and degrees of freedom directly).' : b.slug === 'onshape' ? 'Advanced cloud-based Mate Connectors (extremely fast assembly setups).' : 'Standard constraint solver.',
              comparison: 'Fusion 360 joint system requires fewer mates than SolidWorks, but SolidWorks handles massive complex mechanical linkages with traditional precision.'
            },
            {
              id: 'cam-integration',
              name: 'CAM & Post-Processor Engines',
              icon: Zap,
              description: 'Availability of integrated CNC machining toolpath solvers and customized G-code post-processor configurations.',
              aDetail: a.slug === 'mastercam' ? 'World-class industry CAM standard (unrivaled toolpath control and machine simulation).' : a.slug === 'fusion-360' ? 'Built-in high-performance HSM CAM with a massive free, editable library of post-processors.' : 'Requires third-party CAM add-ons.',
              bDetail: b.slug === 'mastercam' ? 'World-class industry CAM standard (unrivaled toolpath control and machine simulation).' : b.slug === 'fusion-360' ? 'Built-in high-performance HSM CAM with a massive free, editable library of post-processors.' : 'Requires third-party CAM add-ons.',
              comparison: 'Fusion 360 offers superior integrated out-of-the-box multi-axis CAM for mid-range jobs, while Mastercam dominates high-end custom post machining.'
            },
            {
              id: 'large-assemblies',
              name: 'Large Assembly Handling',
              icon: Cpu,
              description: 'Engine performance when viewing, editing, and loading assemblies with thousands of components.',
              aDetail: a.slug === 'solidworks' ? 'Highly mature local graphics optimization (Large Assembly Mode, lightweight states).' : a.slug === 'onshape' ? 'Cloud-native database structure (rendering workload shifted off local GPU).' : 'Performs best on small-to-medium sub-assemblies.',
              bDetail: b.slug === 'solidworks' ? 'Highly mature local graphics optimization (Large Assembly Mode, lightweight states).' : b.slug === 'onshape' ? 'Cloud-native database structure (rendering workload shifted off local GPU).' : 'Performs best on small-to-medium sub-assemblies.',
              comparison: 'Onshape leverages cloud parallelization, which keeps low-spec laptops responsive, while SolidWorks utilizes enterprise desktop GPUs.'
            }
          ]
        };

      case 'bim':
        return {
          title: 'BIM Interoperability & Coordination Matrix',
          subtitle: 'Evaluating industry foundation class (IFC) standards, smart building entities, and team cloud collaboration.',
          metrics: [
            {
              id: 'ifc-compliance',
              name: 'IFC Compliance & openBIM Certification',
              icon: Shield,
              description: 'Fidelity of IFC4 and IFC2x3 architectural model data transfer across different platforms.',
              aDetail: a.slug === 'archicad' ? 'Gold-standard openBIM certified export/import (industry pioneer in IFC mapping).' : 'Certified IFC4 import/export with customizable mapping templates.',
              bDetail: b.slug === 'archicad' ? 'Gold-standard openBIM certified export/import (industry pioneer in IFC mapping).' : 'Certified IFC4 import/export with customizable mapping templates.',
              comparison: 'ArchiCAD is designed with openBIM at its core, offering cleaner IFC coordinate mappings, whereas Revit relies on dedicated translator plugins.'
            },
            {
              id: 'parametric-elements',
              name: 'Smart Architectural Objects',
              icon: Layers,
              description: 'Intelligence of building materials, wall assemblies, structural grids, and smart scheduling arrays.',
              aDetail: a.slug === 'revit' ? 'Complex family-based (.RFA) parametric templates with deep database properties.' : a.slug === 'archicad' ? 'Intuitive GDL-based objects with beautiful default styling and instant parametric handles.' : 'Standard 3D solid blocks with manual attributes.',
              bDetail: b.slug === 'revit' ? 'Complex family-based (.RFA) parametric templates with deep database properties.' : b.slug === 'archicad' ? 'Intuitive GDL-based objects with beautiful default styling and instant parametric handles.' : 'Standard 3D solid blocks with manual attributes.',
              comparison: 'Revit families are deeply customizable but require steep training; ArchiCAD GDL library parts are highly elegant right out of the box.'
            },
            {
              id: 'cloud-collaboration',
              name: 'Real-Time Sync & Collaboration',
              icon: Network,
              description: 'Ability for multiple team members to draft simultaneously in the same model file without locking constraints.',
              aDetail: a.slug === 'revit' ? 'Enterprise-focused Autodesk Construction Cloud (BIM 360) cloud sync.' : a.slug === 'archicad' ? 'High-performance BIMcloud delta sharing (runs smoothly on low bandwidths).' : 'File-based check-in / check-out syncing.',
              bDetail: b.slug === 'revit' ? 'Enterprise-focused Autodesk Construction Cloud (BIM 360) cloud sync.' : b.slug === 'archicad' ? 'High-performance BIMcloud delta sharing (runs smoothly on low bandwidths).' : 'File-based check-in / check-out syncing.',
              comparison: 'ArchiCAD BIMcloud is exceptionally fast over standard networks, while Autodesk Construction Cloud offers wider corporate toolsets.'
            },
            {
              id: 'mep-coordination',
              name: 'MEP & Structural Integration',
              icon: Cpu,
              description: 'Native capability to coordinate mechanical, electrical, plumbing, and structural engineering within the architectural layout.',
              aDetail: a.slug === 'revit' ? 'Fully native MEP and structural suites sharing the same workspace.' : a.slug === 'archicad' ? 'Built-in MEP Modeler toolset + collaborative structural analytical model.' : 'Requires external file imports.',
              bDetail: b.slug === 'revit' ? 'Fully native MEP and structural suites sharing the same workspace.' : b.slug === 'archicad' ? 'Built-in MEP Modeler toolset + collaborative structural analytical model.' : 'Requires external file imports.',
              comparison: 'Revit remains the benchmark for multi-disciplinary HVAC/MEP coordination due to its unified suite format.'
            }
          ]
        };

      case 'simulation':
        return {
          title: 'Simulation Power & High-Speed EDA Analysis',
          subtitle: 'Comparing multi-core solver parallelization, schematic-to-PCB synchronizations, and physics coupling solvers.',
          metrics: [
            {
              id: 'solver-scaling',
              name: 'Solver Parallelization & CPU/GPU Scaling',
              icon: Cpu,
              description: 'Computational performance scaling across high-performance CPU cores, cluster systems, and double-precision FP64 hardware.',
              aDetail: a.slug === 'ansys-fluent' ? 'Highly scalable HPC solver, offering near-linear acceleration across 1000+ cluster CPU nodes.' : 'Multi-core threaded local solver engine.',
              bDetail: b.slug === 'ansys-fluent' ? 'Highly scalable HPC solver, offering near-linear acceleration across 1000+ cluster CPU nodes.' : 'Multi-core threaded local solver engine.',
              comparison: 'Fluent excels in enterprise supercomputer simulation, whereas COMSOL is optimized for highly detailed workstation solves.'
            },
            {
              id: 'multiphysics',
              name: 'Multiphysics Interface Coupling',
              icon: Network,
              description: 'Capacity to solve simultaneous coupled equations (e.g., thermal stress, electromagnetics, fluid-structure interaction).',
              aDetail: a.slug === 'comsol-multiphysics' ? 'Monolithic fully-coupled multiphysics solving (users can couple any mathematical parameters).' : 'Segregated solver with Workbench integration coupling.',
              bDetail: b.slug === 'comsol-multiphysics' ? 'Monolithic fully-coupled multiphysics solving (users can couple any mathematical parameters).' : 'Segregated solver with Workbench integration coupling.',
              comparison: 'COMSOL is the absolute leader in highly customizable coupled physics, while Ansys provides raw computational power for individual domains.'
            },
            {
              id: 'schematic-sync',
              name: 'Schematic & PCB Sync Integrity',
              icon: Zap,
              description: 'Bi-directional forward and backward annotation between schematic captures and PCB layout footprints.',
              aDetail: a.slug === 'altium-designer' ? 'Seamless ECO (Engineering Change Order) bi-directional link with absolute integrity.' : a.slug === 'kicad' ? 'Highly robust netlist and footprint synchronization with customizable manual overrides.' : 'Varies depending on translator scripts.',
              bDetail: b.slug === 'altium-designer' ? 'Seamless ECO (Engineering Change Order) bi-directional link with absolute integrity.' : b.slug === 'kicad' ? 'Highly robust netlist and footprint synchronization with customizable manual overrides.' : 'Varies depending on translator scripts.',
              comparison: 'Altium is extremely streamlined for real-time trace updates, while KiCad offers highly robust manual mapping controls.'
            },
            {
              id: 'drc-latency',
              name: 'Design Rule Check (DRC) Engine',
              icon: Shield,
              description: 'Speed and detail of electrical clearance, thermal relief, and manufacturing tolerance validations.',
              aDetail: a.slug === 'altium-designer' ? 'Real-time online 3D DRC running on custom GPU shaders.' : a.slug === 'kicad' ? 'Highly thorough offline DRC report system.' : 'Standard rule matrix.',
              bDetail: b.slug === 'altium-designer' ? 'Real-time online 3D DRC running on custom GPU shaders.' : b.slug === 'kicad' ? 'Highly thorough offline DRC report system.' : 'Standard rule matrix.',
              comparison: 'Altium Designer flags clearance violations instantly as you route, whereas KiCad requires compiling an offline analysis report.'
            }
          ]
        };

      default:
        return {
          title: 'Visual Rendering & Pipeline Performance',
          subtitle: 'Auditing path-tracing engine physics, modeling structures, and 3D ecosystem workflows.',
          metrics: [
            {
              id: 'render-engine',
              name: 'Rendering & Ray-Tracing Engines',
              icon: Zap,
              description: 'Physics architecture of the rendering pipeline (e.g., real-time rasterizing vs GPU path-tracing vs offline global illumination).',
              aDetail: a.slug === 'blender' ? 'Cycles (high-end GPU ray-tracer) + Eevee (fast real-time graphics rasterizer).' : a.slug === 'twinmotion' ? 'Unreal Engine Lumen real-time global illumination and high-fidelity rendering.' : a.slug === 'lumion' ? 'Proprietary fast ray-tracing engine (immediate visualization).' : 'High-fidelity engine.',
              bDetail: b.slug === 'blender' ? 'Cycles (high-end GPU ray-tracer) + Eevee (fast real-time graphics rasterizer).' : b.slug === 'twinmotion' ? 'Unreal Engine Lumen real-time global illumination and high-fidelity rendering.' : b.slug === 'lumion' ? 'Proprietary fast ray-tracing engine (immediate visualization).' : 'High-fidelity engine.',
              comparison: 'Twinmotion harnesses gaming-engine speed for interactive walk-throughs; Blender Cycles is excellent for cinematic assets.'
            },
            {
              id: 'modeling-tech',
              name: 'Mesh vs Mathematical NURBS Precision',
              icon: Layers,
              description: 'Modeling technology used: organic polygon subdivision vs absolute mathematical NURBS curve control.',
              aDetail: a.slug === 'rhino-3d' ? 'Unrivaled precision NURBS surfaces (essential for high-end automotive design and architecture).' : a.slug === 'blender' || a.slug === 'maya' ? 'Organic subdivision mesh modeling + powerful sculpting brushes.' : 'Standard modeling block format.',
              bDetail: b.slug === 'rhino-3d' ? 'Unrivaled precision NURBS surfaces (essential for high-end automotive design and architecture).' : b.slug === 'blender' || b.slug === 'maya' ? 'Organic subdivision mesh modeling + powerful sculpting brushes.' : 'Standard modeling block format.',
              comparison: 'Rhino is built for physical manufacturing accuracy (NURBS); Blender and Maya are optimized for visual and organic screen animation.'
            },
            {
              id: 'ecosystem',
              name: 'Ecosystem & Plugin Library',
              icon: LayoutGrid,
              description: 'Availability of pre-built asset libraries, materials, community scripts, and pipeline tools.',
              aDetail: a.slug === 'blender' ? 'Massive, unparalleled open-source add-on community (mostly free).' : a.slug === 'lumion' ? 'Huge, built-in, commercial-grade plant, car, and character asset libraries.' : 'Standard plugin store.',
              bDetail: b.slug === 'blender' ? 'Massive, unparalleled open-source add-on community (mostly free).' : b.slug === 'lumion' ? 'Huge, built-in, commercial-grade plant, car, and character asset libraries.' : 'Standard plugin store.',
              comparison: 'Lumion excels in ready-made landscaping assets, whereas Blender benefits from a limitless global developer community.'
            },
            {
              id: 'pipeline-interop',
              name: 'Pipeline Interoperability (USD, FBX)',
              icon: FileText,
              description: 'Data fidelity when exporting elements using Pixar USD, FBX, glTF, or OBJ formats.',
              aDetail: a.slug === 'maya' || a.slug === 'blender' ? 'Industry-grade USD/FBX asset pipeline with character skeletons and animations.' : a.slug === 'prusaslicer' || a.slug === 'bambu-studio' ? 'Native STL/3MF slicer translation engines.' : 'Standard 3D exports.',
              bDetail: b.slug === 'maya' || b.slug === 'blender' ? 'Industry-grade USD/FBX asset pipeline with character skeletons and animations.' : b.slug === 'prusaslicer' || b.slug === 'bambu-studio' ? 'Native STL/3MF slicer translation engines.' : 'Standard 3D exports.',
              comparison: 'Slicers are specialized for geometric layer pathings; artistic modelers focus on skeleton transformations.'
            }
          ]
        };
    }
  };

  const widgetData = getWidgetData();

  const getArchetypeStyles = () => {
    switch (archetype) {
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
      case 'simulation':
        return {
          border: 'border-indigo-200 hover:border-indigo-400',
          badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-200',
          badgeText: 'text-indigo-900',
          glowShadow: 'hover:shadow-[0_0_20px_rgba(79,70,229,0.08)]',
          gradientBg: 'from-indigo-600 to-violet-900',
          cardBg: 'bg-indigo-50/20'
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
function CodeIcon(props: any) {
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
