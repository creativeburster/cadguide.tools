// Feature categories for Best pages
export interface FeatureCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export const featureCategories: FeatureCategory[] = [
  {
    id: 'ai-assisted',
    name: 'AI-Assisted CAD',
    slug: 'ai-assisted',
    description: 'CAD software leveraging artificial intelligence for automated drafting, smart design recommendations, and topology optimization.',
  },
  {
    id: 'cloud-collaboration',
    name: 'Cloud Collaboration CAD',
    slug: 'cloud-collaboration',
    description: 'CAD software supporting real-time multi-user co-authoring, cloud versioning, and zero-install browser access.',
  },
  {
    id: 'parametric-modeling',
    name: 'Parametric Modeling CAD',
    slug: 'parametric-modeling',
    description: 'CAD software using history-based feature trees, dimension-driven constraints, and parent-child geometric relationships.',
  },
  {
    id: 'rendering',
    name: 'High-End Rendering CAD',
    slug: 'rendering',
    description: 'CAD software with built-in GPU ray tracing, physically-based materials (PBR), and photorealistic presentation capabilities.',
  },
  {
    id: 'sheet-metal',
    name: 'Sheet Metal CAD',
    slug: 'sheet-metal',
    description: 'CAD software optimized for folding, unfolding, flat pattern generation, K-factor calculation, and sheet metal fabrication modeling.',
  },
  {
    id: 'generative-design',
    name: 'Generative Design CAD',
    slug: 'generative-design',
    description: 'CAD software leveraging automated optimization algorithms to generate high-performance structural shapes matching material and stress limits.',
  },
  {
    id: 'reverse-engineering',
    name: 'Reverse Engineering CAD',
    slug: 'reverse-engineering',
    description: 'CAD software capable of converting imported high-density 3D scan mesh or point cloud data into precise parametric B-rep solids or surfaces.',
  },
  {
    id: 'integrated-cam',
    name: 'Integrated CAD/CAM',
    slug: 'integrated-cam',
    description: 'CAD/CAM suites with native toolpath generation, CNC machine simulation, and automatic path updates based on geometry modifications.',
  },
  {
    id: 'simulation-fea',
    name: 'Simulation & FEA CAD',
    slug: 'simulation-fea',
    description: 'CAD software equipped with built-in thermal, structural, fluid dynamics, and fatigue simulation engines.',
  },
  {
    id: 'subdivision-modeling',
    name: 'Subdivision Modeling CAD',
    slug: 'subdivision-modeling',
    description: 'CAD software featuring subdivision surface (SubD) modeling tools for creating smooth, organic, and complex ergonomic shapes.',
  },
  {
    id: 'bim-integration',
    name: 'BIM Integrated CAD',
    slug: 'bim-integration',
    description: 'CAD software supporting native Building Information Modeling (BIM) workflows, industry foundation classes (IFC), and multi-disciplinary coordination.',
  },
  {
    id: 'direct-modeling',
    name: 'Direct Modeling CAD',
    slug: 'direct-modeling',
    description: 'CAD software optimized for history-free direct modeling, permitting quick geometry push-pull adjustments without parametric tree constraints.',
  },
];
