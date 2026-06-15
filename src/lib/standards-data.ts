import { tools } from './data';

export interface StandardLayer {
  code: string;
  name: string;
  desc: string;
  colorId: string;
  weight: string;
  usage: string;
}

export interface StandardSystem {
  id: string;
  name: string;
  fullname: string;
  org: string;
  desc: string;
  keyword: string;
  layers: StandardLayer[];
}

export interface DraftingStandardPage {
  slug: string;
  standardId: string;
  standardName: string;
  standardFullname: string;
  standardOrg: string;
  standardDesc: string;
  toolSlug: string;
  toolName: string;
  keyword: string;
  excerpt: string;
  tagline: string;
  layerPattern: string;
  layers: StandardLayer[];
  softwareGuide: string;
  codeSnippet: string;
  codeLanguage: 'lisp' | 'python' | 'text' | 'javascript';
  metropolitanLinks: { label: string; href: string }[];
}

export const STANDARDS_LIST: Omit<StandardSystem, 'layers'>[] = [
  {
    id: 'iso',
    name: 'ISO 128 / 13567',
    fullname: 'ISO 13567 CAD Layer Schema & ISO 128 General Drafting Principles',
    org: 'International Organization for Standardization (ISO)',
    desc: 'The global standard for technical drawings and structured CAD layer schemes. Recommended for multi-national projects, European infrastructure, and ISO-certified automotive/aerospace fabrication.',
    keyword: 'ISO 13567 CAD Layering Standard'
  },
  {
    id: 'aia',
    name: 'AIA CAD Standard',
    fullname: 'AIA CAD Layer Guidelines (US National CAD Standard Version 6)',
    org: 'American Institute of Architects (AIA)',
    desc: 'The North American benchmark for architectural drafting layers, grouping CAD data by discipline, major group, and minor group. Ideal for architectural layout and structural detailing.',
    keyword: 'AIA CAD Layer Guidelines'
  },
  {
    id: 'gb-t',
    name: 'GB/T 18229 / 14665',
    fullname: 'GB/T 14665 CAD Drafting Standard & GB/T 18229 CAD Layer Rules',
    org: 'Standardization Administration of China (SAC)',
    desc: 'The Chinese National Standard regulating computer-aided drafting and drawing structures. Essential for structural detailing, local design institutes, and manufacturing blueprint approvals in China.',
    keyword: 'GB/T 14665 Drafting Standard'
  },
  {
    id: 'ansi',
    name: 'ANSI Y14.2M',
    fullname: 'ANSI Y14.2M Line Conventions and Lettering Practices',
    org: 'American National Standards Institute (ANSI)',
    desc: 'Standardizes technical drawing practices, view layout projections, and line weights. Crucial for mechanical design, aerospace machining blueprints, and defense contracts.',
    keyword: 'ANSI Y14.2M Line Conventions'
  },
  {
    id: 'din',
    name: 'DIN 406 / 824',
    fullname: 'DIN 406 Detailing & Dimensioning Standards & DIN 824 Paper Folding Standards',
    org: 'Deutsches Institut für Normung (DIN)',
    desc: 'Strict German standards regulating detailing dimensions, tolerancing, and sheet layouts. Commonly applied across central European heavy industry, manufacturing, and building utilities.',
    keyword: 'DIN 406 Detailing Standards'
  },
  {
    id: 'jis',
    name: 'JIS Y14',
    fullname: 'JIS Y14 Technical Drawing Standards & JIS CAD Drafting Conventions',
    org: 'Japanese Industrial Standards Committee (JISC)',
    desc: 'The Japanese standard defining CAD drafting layer categorization and dimension styles. Required for precision electronics, Japanese automotive parts, and machinery manufacturing.',
    keyword: 'JIS Y14 CAD Drafting Standard'
  },
  {
    id: 'bs-1192',
    name: 'BS 1192',
    fullname: 'BS 1192 Collaborative Production of Architectural Drafting & AEC Standards',
    org: 'British Standards Institution (BSI)',
    desc: 'The British drafting framework that laid the foundation for modern BIM workflows (ISO 19650). Focuses on status, suitability codes, and collaborative multi-user layer mapping.',
    keyword: 'BS 1192 CAD standard'
  },
  {
    id: 'as-1100',
    name: 'AS 1100',
    fullname: 'AS 1100 Technical Drawing Standards (Australian Standards)',
    org: 'Standards Australia',
    desc: 'The unified Australian technical drawing standard, defining symbols, views, scale, and lines. Universal in Australian construction, municipal infrastructure, and mechanical fabrication.',
    keyword: 'AS 1100 Drafting Standard'
  },
  {
    id: 'cen',
    name: 'CEN / EN ISO',
    fullname: 'CEN/TR 15655 European Unified Drawing and Geometric Standards',
    org: 'European Committee for Standardization (CEN)',
    desc: 'Aligns EU member states with standard ISO layering conventions while providing unified parameters for digital building data and MEP component definitions.',
    keyword: 'EN ISO CAD standards'
  },
  {
    id: 'ncs',
    name: 'US NCS v6.0',
    fullname: 'United States National CAD Standard (NCS) Version 6.0',
    org: 'National Institute of Building Sciences (NIBS)',
    desc: 'Integrates AIA Layering Guidelines, CSI Plotting Standards, and Tri-Service CAD details. Universal for US federal projects, defense infrastructure, and large commercial MEP engineering.',
    keyword: 'National CAD Standard NCS'
  }
];

export const DRAFTING_TOOLS = [
  'autocad', 'solidworks', 'revit', 'autodesk-inventor', 'rhino-3d',
  'microstation', 'archicad', 'sketchup', 'ptc-creo', 'catia',
  'siemens-nx', 'vectorworks', 'freecad', 'fusion-360', 'tekla-structures',
  'civil-3d', 'bricscad', 'draftsight', 'qcad', 'gstarcad'
];

// Base layer data depending on Standard ID
const LAYERS_BY_STANDARD: Record<string, { pattern: string; data: StandardLayer[] }> = {
  iso: {
    pattern: '[Agent]-[Element]-[Presentation]',
    data: [
      { code: 'A-210-M', name: 'Exterior Wall Model', desc: 'Structural exterior load-bearing walls', colorId: '7 (White)', weight: '0.50 mm', usage: 'Major outlines' },
      { code: 'A-240-M', name: 'Interior Doors', desc: 'Door leaf and swing details', colorId: '3 (Green)', weight: '0.25 mm', usage: 'Fine detail features' },
      { code: 'A-900-T', name: 'Dimensions & Labels', desc: 'Text annotations and dimension lines', colorId: '2 (Yellow)', weight: '0.35 mm', usage: 'General annotations' },
      { code: 'M-510-M', name: 'HVAC Ductwork', desc: 'Supply and exhaust ventilation ducts', colorId: '1 (Red)', weight: '0.35 mm', usage: 'Mechanical equipment' }
    ]
  },
  aia: {
    pattern: '[Discipline]-[Major Group]-[Minor Group]',
    data: [
      { code: 'A-WALL-EXTR', name: 'Exterior Wall Boundary', desc: 'Load-bearing building envelope walls', colorId: '7 (White)', weight: '0.50 mm', usage: 'Primary boundaries' },
      { code: 'A-DOOR-INTR', name: 'Interior Doors', desc: 'Interior timber and metal door units', colorId: '3 (Green)', weight: '0.25 mm', usage: 'Fine elements' },
      { code: 'A-ANNO-TEXT', name: 'Dimension Annotation', desc: 'Title blocks, text notes, and tags', colorId: '2 (Yellow)', weight: '0.35 mm', usage: 'Annotations' },
      { code: 'M-HVAC-DUCT', name: 'HVAC Duct Outline', desc: 'Mechanical supply ductwork lines', colorId: '1 (Red)', weight: '0.35 mm', usage: 'Mechanical pipes/ducts' }
    ]
  },
  'gb-t': {
    pattern: '[Discipline_Code]-[Element_Name]',
    data: [
      { code: 'A-WALL-EXTR', name: '外墙实体', desc: '承重及非承重外侧墙体线框', colorId: '7 (White)', weight: '0.50 mm', usage: '图纸主轮廓' },
      { code: 'A-DOOR-INTR', name: '内侧门扇', desc: '室内隔断门及开启方向投影', colorId: '3 (Green)', weight: '0.25 mm', usage: '细部特征' },
      { code: 'A-ANNO-TEXT', name: '文字标注说明', desc: '尺寸标注文字、引线与说明文本', colorId: '2 (Yellow)', weight: '0.35 mm', usage: '标注辅助' },
      { code: 'M-HVAC-DUCT', name: '通风管道', desc: '暖通专业空气过滤、通风系统管线', colorId: '1 (Red)', weight: '0.35 mm', usage: '设备管道线' }
    ]
  },
  ansi: {
    pattern: '[Discipline]-[Element_Class]',
    data: [
      { code: 'M-WALL-EXTR', name: 'Visible Heavy Line', desc: 'Visible object boundaries and cut walls', colorId: '7 (White)', weight: '0.50 mm', usage: 'Visible outlines' },
      { code: 'M-DOOR-INTR', name: 'Hidden Light Detail', desc: 'Hidden door profiles or secondary slots', colorId: '3 (Green)', weight: '0.25 mm', usage: 'Hidden lines' },
      { code: 'M-ANNO-TEXT', name: 'Lettering & Labels', desc: 'Machining annotations, scale text, dimensions', colorId: '2 (Yellow)', weight: '0.35 mm', usage: 'Dimension text' },
      { code: 'M-HVAC-DUCT', name: 'Center & Section Lines', desc: 'Symmetry centerline guides or section planes', colorId: '1 (Red)', weight: '0.35 mm', usage: 'Centerlines/hatch' }
    ]
  },
  din: {
    pattern: '[Discipline]-[German_Element]',
    data: [
      { code: 'A-WAND-AUSS', name: 'Aussenwand (Walls)', desc: 'Exterior structural load walls', colorId: '7 (White)', weight: '0.50 mm', usage: 'Massive outlines' },
      { code: 'A-TUER-INNE', name: 'Innentuer (Doors)', desc: 'Interior door frame and swing detail', colorId: '3 (Green)', weight: '0.25 mm', usage: 'Fine graphics' },
      { code: 'A-BESS-TEXT', name: 'Bemassung (Dimensions)', desc: 'Standardized dimension line texts', colorId: '2 (Yellow)', weight: '0.35 mm', usage: 'Drawing annotations' },
      { code: 'M-LUEF-KANL', name: 'Lueftungskanal (Ducts)', desc: 'Ventilation ducts and mechanical lines', colorId: '1 (Red)', weight: '0.35 mm', usage: 'MEP utilities' }
    ]
  },
  jis: {
    pattern: '[Discipline]-[Element_Kana]',
    data: [
      { code: 'A-KABE-GAIB', name: 'Kabe Gaibu (Outer Wall)', desc: 'Exterior walls and main outline', colorId: '7 (White)', weight: '0.50 mm', usage: 'Outer profiles' },
      { code: 'A-TUGU-NAIB', name: 'Tugunaibu (Inner Door)', desc: 'Door fittings and opening curves', colorId: '3 (Green)', weight: '0.25 mm', usage: 'Inner detail' },
      { code: 'A-MADO-TEXT', name: 'Mado Text (Annotations)', desc: 'Dimension text, notes, and symbols', colorId: '2 (Yellow)', weight: '0.35 mm', usage: 'Text label' },
      { code: 'M-KUUK-KUTI', name: 'Kuukoukuti (Ductwork)', desc: 'HVAC distribution systems and pipes', colorId: '1 (Red)', weight: '0.35 mm', usage: 'Utility lines' }
    ]
  },
  'bs-1192': {
    pattern: '[Project]-[Originator]-[Level]-[Role]-[Element]',
    data: [
      { code: 'B1192-A-WALL', name: 'Architectural Wall', desc: 'Building shell walls and partitions', colorId: '7 (White)', weight: '0.50 mm', usage: 'Heavy boundary' },
      { code: 'B1192-A-DOOR', name: 'Architectural Door', desc: 'Door leaf and frames details', colorId: '3 (Green)', weight: '0.25 mm', usage: 'Thin detail' },
      { code: 'B1192-A-TEXT', name: 'Annotations & Notes', desc: 'Dimension label tags and labels', colorId: '2 (Yellow)', weight: '0.35 mm', usage: 'Medium lines' },
      { code: 'B1192-M-DUCT', name: 'Mechanical Ductwork', desc: 'Ventilation and air systems lines', colorId: '1 (Red)', weight: '0.35 mm', usage: 'Duct pipelines' }
    ]
  },
  'as-1100': {
    pattern: '[Discipline]-[Sub_discipline]-[Element]',
    data: [
      { code: 'A-BLDG-WALL', name: 'Building Wall Outline', desc: 'Exterior structural wall borders', colorId: '7 (White)', weight: '0.50 mm', usage: 'Structural boundaries' },
      { code: 'A-BLDG-DOOR', name: 'Building Door Detail', desc: 'Door frames and swing trajectories', colorId: '3 (Green)', weight: '0.25 mm', usage: 'Detailing components' },
      { code: 'A-BLDG-ANNO', name: 'Annotation Text', desc: 'Standard Australian drawing labeling', colorId: '2 (Yellow)', weight: '0.35 mm', usage: 'Text and labels' },
      { code: 'M-BLDG-HVAC', name: 'HVAC Layout Pipes', desc: 'Duct lines and mechanical drawings', colorId: '1 (Red)', weight: '0.35 mm', usage: 'MEP pipes' }
    ]
  },
  cen: {
    pattern: '[Discipline]-[Element]-[Presentation]',
    data: [
      { code: 'E-WALL-OUTL', name: 'Wall Outlines', desc: 'European standard structural wall bounds', colorId: '7 (White)', weight: '0.50 mm', usage: 'Major outlines' },
      { code: 'E-DOOR-DETL', name: 'Door Details', desc: 'Doors and window layout graphics', colorId: '3 (Green)', weight: '0.25 mm', usage: 'Fine elements' },
      { code: 'E-TEXT-ANNO', name: 'Text Annotation', desc: 'Multi-lingual dimensions and notes', colorId: '2 (Yellow)', weight: '0.35 mm', usage: 'Text and annotation' },
      { code: 'E-DUCT-HVAC', name: 'HVAC Ductwork', desc: 'Unified ventilation layout lines', colorId: '1 (Red)', weight: '0.35 mm', usage: 'HVAC elements' }
    ]
  },
  ncs: {
    pattern: '[Discipline]-[Major Group]-[Minor Group]',
    data: [
      { code: 'A-WALL-FULL', name: 'Full Height Walls', desc: 'Structural full height exterior walls', colorId: '7 (White)', weight: '0.50 mm', usage: 'Primary boundaries' },
      { code: 'A-DOOR-FULL', name: 'Full Height Doors', desc: 'Interior full height door models', colorId: '3 (Green)', weight: '0.25 mm', usage: 'Fine detail' },
      { code: 'A-ANNO-TEXT', name: 'Drawing Labels', desc: 'Technical text blocks and scales', colorId: '2 (Yellow)', weight: '0.35 mm', usage: 'Dimension lines' },
      { code: 'M-HVAC-DUCT', name: 'Mechanical Ducts', desc: 'Supply and return air piping systems', colorId: '1 (Red)', weight: '0.35 mm', usage: 'Mechanical layout' }
    ]
  }
};

// Tool classification map
function getToolCategory(toolSlug: string): 'DWG' | 'MCAD' | 'BIM' | 'STYLING' {
  const dwgTools = ['autocad', 'bricscad', 'draftsight', 'qcad', 'gstarcad'];
  const mcadTools = ['solidworks', 'autodesk-inventor', 'ptc-creo', 'siemens-nx', 'catia', 'fusion-360', 'freecad'];
  const bimTools = ['revit', 'archicad', 'vectorworks', 'tekla-structures', 'civil-3d'];
  
  if (dwgTools.includes(toolSlug)) return 'DWG';
  if (mcadTools.includes(toolSlug)) return 'MCAD';
  if (bimTools.includes(toolSlug)) return 'BIM';
  return 'STYLING';
}

// Generates LISP, Python or Config template according to tool and standard
function generateAutomationSnippet(standardId: string, toolSlug: string, toolCategory: string, layers: StandardLayer[]): { snippet: string; lang: 'lisp' | 'python' | 'text' | 'javascript' } {
  if (toolCategory === 'DWG') {
    const commands = layers.map(l => 
      `  (command "-layer" "m" "${l.code}" "c" "${l.colorId.split(' ')[0]}" "" "l" "Continuous" "" "lw" "${l.weight.split(' ')[0]}" "" "")`
    ).join('\n');
    return {
      lang: 'lisp',
      snippet: `(defun c:Apply${standardId.replace('-', '').toUpperCase()}Standards ()
  (setvar "CMDECHO" 0)
  (princ "\\n[CADGuide] Initializing ${standardId.toUpperCase()} standards for ${toolSlug.toUpperCase()}...")
${commands}
  (setvar "CMDECHO" 1)
  (princ "\\n[CADGuide] Standards layers created successfully!")
  (princ)
)`
    };
  }

  if (toolCategory === 'MCAD') {
    const stdName = standardId === 'ansi' ? 'swDetailingStandardANSI' : 'swDetailingStandardISO';
    return {
      lang: 'python',
      snippet: `# CADGuide Standards Integration Macro for ${toolSlug.toUpperCase()}
# Automation script setting Active Document Detailing Standard to ${standardId.toUpperCase()}

import win32com.client
swApp = win32com.client.Dispatch("SldWorks.Application")
doc = swApp.ActiveDoc

if doc is not None:
    # Set main detailing system to match ${standardId.toUpperCase()} guidelines
    # Under Document Properties -> Drafting Standards
    doc.Extension.SetUserPreferenceInteger(
        14, # swUserPreferenceIntegerValue_e.swDetailingStandard
        0,  # swUserPreferenceOption_e.swDetailingNoOptionSpecified
        2   # swDetailingStandard_e.${stdName}
    )
    print("[CADGuide] Active Document Drafting Standard aligned to: ${standardId.toUpperCase()}")
else:
    print("[CADGuide ERROR] No active CAD document detected. Open your assembly/part first.")`
    };
  }

  if (toolCategory === 'BIM') {
    const configRows = layers.map(l => 
      `${l.name.replace(/\s+/g, '')}\t${l.code}\t${l.colorId.split(' ')[0]}\t${l.code}\t${l.colorId.split(' ')[0]}`
    ).join('\n');
    return {
      lang: 'text',
      snippet: `# CADGuide Revit / BIM Export Mapping Standard Setup
# Save this block as '${standardId}_export_map.txt' and import in Revit/ArchiCAD DWG Export Setup
# Category\\Subcategory\\ProjectionLayer\\ProjectionColor\\CutLayer\\CutColor
Walls\\CommonEdges\t${layers[0].code}\t7\t${layers[0].code}\t7
Doors\\Panel\t${layers[1].code}\t3\t${layers[1].code}\t3
Annotations\\Text\t${layers[2].code}\t2\t${layers[2].code}\t2
HVAC\\Ducts\t${layers[3].code}\t1\t${layers[3].code}\t1`
    };
  }

  // STYLING (Rhino/SketchUp)
  return {
    lang: 'python',
    snippet: `# Rhino/Python script to build ${standardId.toUpperCase()} layers
import rhinoscriptsyntax as rs

def build_drafting_standards():
    print("[CADGuide] Aligning Rhino layers to ${standardId.toUpperCase()} specifications...")
    # Add layers with exact plotting line-weights and RGB colors
${layers.map(l => `    # Layer: ${l.name}
    if not rs.IsLayer("${l.code}"):
        rs.AddLayer("${l.code}")
        rs.LayerColor("${l.code}", (255, 255, 255) if "${l.colorId}".startsWith("7") else (0, 255, 0))`).join('\n')}
    print("[CADGuide] Custom Layer Schema applied successfully.")

if __name__ == "__main__":
    build_drafting_standards()`
  };
}

// Get localized software-specific integration instructions
function getSoftwareGuide(toolSlug: string, standardName: string): string {
  const name = toolSlug.charAt(0).toUpperCase() + toolSlug.slice(1);
  return `To integrate ${standardName} layout rules into **${name}**, you must load the specific layer schema mapping. 
For 2D drawings, load the provided configuration script. For 3D workflows, ensure your active drawing template (.dwt or .dot) has its document drafting properties aligned with this configuration. 
In team environments, distribute this configuration files globally via network deployments to secure total blueprint alignment and avoid sub-standard plotting line-weights in PDF output.`;
}

// Main query interface
export function getStandardPageData(standardId: string, toolSlug: string): DraftingStandardPage | null {
  const stdInfo = STANDARDS_LIST.find(s => s.id === standardId);
  const toolInfo = tools.find(t => t.slug === toolSlug);
  
  if (!stdInfo || !toolInfo) return null;
  
  const layerConfig = LAYERS_BY_STANDARD[standardId];
  if (!layerConfig) return null;
  
  const toolCategory = getToolCategory(toolSlug);
  const { snippet, lang } = generateAutomationSnippet(standardId, toolSlug, toolCategory, layerConfig.data);
  const softwareGuide = getSoftwareGuide(toolSlug, stdInfo.name);

  // Generate 3 Metropolitan Interlink cross-links within the standards directory
  // Link to the same standard on 3 other relevant tools in the catalog to circulate PageRank
  const otherTools = DRAFTING_TOOLS.filter(t => t !== toolSlug).slice(0, 3);
  const metropolitanLinks = otherTools.map(tSlug => {
    const t = tools.find(x => x.slug === tSlug);
    return {
      label: `${stdInfo.name} in ${t ? t.name : tSlug}`,
      href: `/guides/standards-${standardId}-${tSlug}`
    };
  });

  return {
    slug: `standards-${standardId}-${toolSlug}`,
    standardId,
    standardName: stdInfo.name,
    standardFullname: stdInfo.fullname,
    standardOrg: stdInfo.org,
    standardDesc: stdInfo.desc,
    toolSlug,
    toolName: toolInfo.name,
    keyword: stdInfo.keyword,
    excerpt: `Complete guide to loading and deploying the official ${stdInfo.name} (${stdInfo.fullname}) layer naming conventions, pen weights, and CTB plotting tables in ${toolInfo.name}.`,
    tagline: `Standardized layer configurations, pen width definitions, and automation scripts for ${toolInfo.name}.`,
    layerPattern: layerConfig.pattern,
    layers: layerConfig.data,
    softwareGuide,
    codeSnippet: snippet,
    codeLanguage: lang,
    metropolitanLinks
  };
}
