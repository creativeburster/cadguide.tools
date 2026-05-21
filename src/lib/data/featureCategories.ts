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
];
