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
    name: 'AI 辅助 CAD',
    slug: 'ai-assisted',
    description: '使用人工智能进行自动化绘图、智能建议和设计优化的 CAD 软件。',
  },
  {
    id: 'cloud-collaboration',
    name: '云协作 CAD',
    slug: 'cloud-collaboration',
    description: '支持多人实时在线编辑、云端存储和跨平台访问的 CAD 软件。',
  },
  {
    id: 'parametric-modeling',
    name: '参数化建模 CAD',
    slug: 'parametric-modeling',
    description: '通过参数驱动的特征建模实现快速迭代和尺寸变化的 CAD 软件。',
  },
  {
    id: 'rendering',
    name: '渲染功能 CAD',
    slug: 'rendering',
    description: '内置高质量渲染引擎，支持实时光线追踪和材质预览的 CAD 软件。',
  },
];
