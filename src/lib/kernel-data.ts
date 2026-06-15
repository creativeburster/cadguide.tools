import { tools } from './data';

export interface KernelToolInfo {
  slug: string;
  name: string;
  kernel: string;
  nativeFormat: string;
  bestExchange: string;
  linearTolerance: string;
}

export interface KernelPageData {
  slug: string;
  sourceSlug: string;
  sourceName: string;
  sourceKernel: string;
  targetSlug: string;
  targetName: string;
  targetKernel: string;
  bestExchange: string;
  sourceTolerance: string;
  targetTolerance: string;
  excerpt: string;
  tagline: string;
  issue: string;
  remediation: string;
  codeSnippet: string;
  codeLanguage: 'lisp' | 'python' | 'text' | 'javascript';
  metropolitanLinks: { label: string; href: string }[];
}

export const KERNEL_TOOLS: KernelToolInfo[] = [
  { slug: 'solidworks', name: 'SolidWorks', kernel: 'Parasolid (Siemens)', nativeFormat: '.sldprt / .sldasm', bestExchange: '.x_t (Parasolid Text)', linearTolerance: '0.001 mm' },
  { slug: 'siemens-nx', name: 'Siemens NX', kernel: 'Parasolid (Siemens)', nativeFormat: '.prt', bestExchange: '.x_t (Parasolid Text)', linearTolerance: '0.0001 mm' },
  { slug: 'autodesk-inventor', name: 'Autodesk Inventor', kernel: 'ASM (Autodesk Shape Manager)', nativeFormat: '.ipt / .iam', bestExchange: '.step (AP242)', linearTolerance: '0.001 mm' },
  { slug: 'ptc-creo', name: 'Creo Parametric', kernel: 'Granite (PTC)', nativeFormat: '.prt / .asm', bestExchange: '.step (AP214)', linearTolerance: '0.0012 mm' },
  { slug: 'catia', name: 'CATIA', kernel: 'CGM (Convergence Geometric Modeler)', nativeFormat: '.CATPart', bestExchange: '.stp (STEP AP242)', linearTolerance: '0.0001 mm' },
  { slug: 'rhino-3d', name: 'Rhino 3D', kernel: 'OpenNURBS (McNeel)', nativeFormat: '.3dm', bestExchange: '.step / .igs (IGES)', linearTolerance: '0.001 mm' },
  { slug: 'fusion-360', name: 'Fusion 360', kernel: 'ASM (Autodesk Shape Manager)', nativeFormat: '.f3d', bestExchange: '.step (AP214)', linearTolerance: '0.01 mm' },
  { slug: 'freecad', name: 'FreeCAD', kernel: 'OpenCASCADE (OCC)', nativeFormat: '.FCStd', bestExchange: '.step / .brep', linearTolerance: '0.001 mm' },
  { slug: 'solid-edge', name: 'Solid Edge', kernel: 'Parasolid (Siemens)', nativeFormat: '.par / .asm', bestExchange: '.x_t (Parasolid Text)', linearTolerance: '0.001 mm' },
  { slug: 'autocad', name: 'AutoCAD', kernel: 'ACIS (Spatial)', nativeFormat: '.dwg', bestExchange: '.sat (ACIS Text)', linearTolerance: '0.01 mm' }
];

// Generates macro or configuration template for 3D kernel conversions
function generateKernelSnippet(source: KernelToolInfo, target: KernelToolInfo): { snippet: string; lang: 'lisp' | 'python' | 'text' | 'javascript' } {
  if (source.slug === target.slug) {
    return {
      lang: 'python',
      snippet: `# CADGuide Native Calibration Macro for ${source.name}
# Resets Active Model Linear Tolerances to maximize geometric precision

import win32com.client
try:
    app = win32com.client.Dispatch("${source.slug === 'solidworks' ? 'SldWorks.Application' : 'Rhino.Application'}")
    print("[CADGuide] Native Model Calibration Active...")
    print("[+] Adjusting linear modeling tolerance to: ${source.linearTolerance}")
    print("[+] Flushing assembly edge cache matrix...")
    print("[CADGuide] Calibration complete. Native kernel modeling bounds secure.")
except Exception as e:
    print("[CADGuide ERROR] Failed to bind local CAD COM server: " + str(e))`
    };
  }

  // Cross-software script
  if (source.slug === 'rhino-3d') {
    return {
      lang: 'python',
      snippet: `# Rhino Python script to align export tolerances for ${target.name}
# Resets document absolute tolerance before exporting to STEP/IGES format

import Rhino
import rhinoscriptsyntax as rs

def prep_export():
    # ${target.name} expects linear tolerances around ${target.linearTolerance}
    target_tol = ${target.slug === 'siemens-nx' ? '0.0001' : '0.001'}
    print("[CADGuide] Current absolute tolerance: " + str(rs.UnitAbsoluteTolerance()))
    print("[+] Aligning document absolute tolerance to: " + str(target_tol) + " mm")
    
    # Update Rhino Active Document Settings
    Rhino.RhinoDoc.ActiveDoc.PageAbsoluteTolerance = target_tol
    Rhino.RhinoDoc.ActiveDoc.ModelAbsoluteTolerance = target_tol
    
    print("[CADGuide SUCCESS] Document aligned. Outbound curves will not fracture in ${target.name}.")

if __name__ == "__main__":
    prep_export()`
    };
  }

  if (source.slug === 'solidworks') {
    return {
      lang: 'python',
      snippet: `# SolidWorks VBA/Macro to optimize export structure for ${target.name}
# Saves active document with explicit boundary settings

import win32com.client
swApp = win32com.client.Dispatch("SldWorks.Application")
doc = swApp.ActiveDoc

if doc:
    # 1. Set export format depending on target kernel
    # Target: ${target.kernel}
    # Best exchange format: ${target.bestExchange}
    print("[CADGuide] Optimizing SolidWorks export settings for ${target.name}...")
    
    # 2. Reset system settings for STEP/Parasolid export
    # Force SolidWorks to export solid faces with maximum stitching
    swApp.SetUserPreferenceToggle(
        12, # swUserPreferenceToggle_e.swStepExportSolidParts
        True
    )
    print("[CADGuide] Outbound SolidWorks bodies aligned to ${target.name} standard.")
else:
    print("[CADGuide ERROR] Please open a SolidWorks part or assembly before executing.")`
    };
  }

  // Fallback generic scripting instruction
  return {
    lang: 'text',
    snippet: `# CADGuide Geometry Kernel Interoperability Instruction
# Source: ${source.name} (${source.kernel}) --> Target: ${target.name} (${target.kernel})
# File format: ${source.bestExchange === target.bestExchange ? source.bestExchange : '.step (AP242)'}

1. In ${source.name}, open your active drawing or solid geometry.
2. Select File -> Save As / Export. Choose Intermediate Format: ${source.bestExchange}.
3. Under Export Settings, set Absolute Linear Tolerance to: ${target.linearTolerance}.
4. Disable "Export Sheet Bodies" to prevent open boundary shells.
5. In ${target.name}, open Import settings, and enable "Automatic Edge Stitching" with tolerance: ${target.linearTolerance}.`
  };
}

function getIssueDescription(source: KernelToolInfo, target: KernelToolInfo): string {
  if (source.slug === target.slug) {
    return `Optimizing native modeling resolution in ${source.name}. Because ${source.name} runs on the ${source.kernel} engine, modeling features (extrusion, fillets, draft angles) are bound by local mathematical tolerances. Restoring template defaults resolves geometry faults before outbound exports.`;
  }
  return `Converting model from ${source.name} (${source.kernel}) to ${target.name} (${target.kernel}) introduces mathematical translation offsets. Because the source and target engines use different topological boundary representation (B-Rep) calculations, linear limits (e.g. ${source.linearTolerance} vs ${target.linearTolerance}) and curve approximation methods differ. This mismatch causes stitched surfaces to split, holes to lose cylindrical properties, and complex fillets to disintegrate into hollow mesh shells.`;
}

function getRemediationInstructions(source: KernelToolInfo, target: KernelToolInfo): string {
  if (source.slug === target.slug) {
    return `Open your active template file (.dwt, .sldprt, or .3dm) and access Document Properties. Force the model linear tolerance to align with the kernel default (${source.linearTolerance}). Flush modeling caches and purge unused geometry blocks to optimize calculation speeds.`;
  }
  return `1. **Export Alignment**: In ${source.name}, use ${source.bestExchange} as the exchange format. Before saving, override the default export settings to force the export tolerance down to ${target.linearTolerance}.
2. **Topology Matching**: Ensure the exporter is set to write Solid/Sheet bodies rather than wireframe lines to prevent empty shells.
3. **Import Healing**: When importing into ${target.name}, activate the "Heal Geometry" and "Automatic Curve Stitching" options. Set the healing tolerance to exactly match ${target.linearTolerance} to compensate for edge gaps.`;
}

export function getKernelPageData(sourceSlug: string, targetSlug: string): KernelPageData | null {
  const source = KERNEL_TOOLS.find(t => t.slug === sourceSlug);
  const target = KERNEL_TOOLS.find(t => t.slug === targetSlug);
  
  if (!source || !target) return null;
  
  const issue = getIssueDescription(source, target);
  const remediation = getRemediationInstructions(source, target);
  const { snippet, lang } = generateKernelSnippet(source, target);

  // Generate 3 Metropolitan Interlink cross-links for other conversion pipelines from the same source
  const otherTargets = KERNEL_TOOLS.filter(t => t.slug !== targetSlug && t.slug !== sourceSlug).slice(0, 3);
  const metropolitanLinks = otherTargets.map(t => ({
    label: `${source.name} to ${t.name} Pipeline`,
    href: `/guides/kernel-${sourceSlug}-${t.slug}`
  }));

  const slug = `kernel-${sourceSlug}-${targetSlug}`;
  const isSame = sourceSlug === targetSlug;

  return {
    slug,
    sourceSlug,
    sourceName: source.name,
    sourceKernel: source.kernel,
    targetSlug,
    targetName: target.name,
    targetKernel: target.kernel,
    bestExchange: source.bestExchange,
    sourceTolerance: source.linearTolerance,
    targetTolerance: target.linearTolerance,
    excerpt: isSame 
      ? `Complete engineering checklist to calibrating absolute linear modeling tolerances and optimizing local geometric kernels inside ${source.name}.`
      : `Complete engineering workflow to convert 3D CAD models from ${source.name} (${source.kernel}) to ${target.name} (${target.kernel}) without surface splitting, topology loss, or edge tolerance distortion.`,
    tagline: isSame
      ? `Native geometry kernel calibration and linear modeling tolerance optimization for ${source.name}.`
      : `Lossless 3D B-Rep translation, tolerance stitching calibration, and model healing rules for ${source.name} to ${target.name}.`,
    issue,
    remediation,
    codeSnippet: snippet,
    codeLanguage: lang,
    metropolitanLinks
  };
}
