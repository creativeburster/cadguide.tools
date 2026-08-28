// Auto-generated 3D Converter Database & Type Interfaces
import rawConverterData from './converter-data.json';

export interface ConverterToolMetric {
  name: string;
  score: number;
}

export interface ConverterTool {
  name: string;
  badge: string;
  rating: number;
  metrics: ConverterToolMetric[];
  pros: string[];
  cons: string[];
  officialUrl: string;
  affiliateUrl: string | null;
  pricing: string;
  verdict: string;
}

export interface FormatSpec {
  ext: string;
  name: string;
  category: string;
  developer: string;
  nature: string;
  colorMaterial: string;
  pmi: string;
  typicalUse: string;
  ecosystem: string;
}

export interface TechnicalGuideItem {
  title: string;
  desc: string;
}

export interface KeyParameter {
  label: string;
  value: string;
  hint: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ConversionPair {
  slug: string;
  title: string;
  h1Title: string;
  metaTitle: string;
  metaDescription: string;
  category: '3d-printing' | 'mcad-interop' | 'web3d' | 'bim-doc';
  categoryLabel: string;
  conversionNature: string;
  difficulty: string;
  fromFormat: FormatSpec;
  toFormat: FormatSpec;
  keyParameters: KeyParameter[];
  painPointDesc: string;
  riskWarning: string;
  technicalGuide: TechnicalGuideItem[];
  recommendedTools: ConverterTool[];
  faqs: FAQItem[];
  relatedSlugs: string[];
}

export interface ConverterCategory {
  id: '3d-printing' | 'mcad-interop' | 'web3d' | 'bim-doc';
  name: string;
  shortName: string;
  description: string;
  icon: string;
  pairs: string[];
}

export const CONVERTER_TOOLS = rawConverterData.tools as Record<string, ConverterTool>;
export const FORMATS_DATABASE = rawConverterData.formats as Record<string, FormatSpec>;
export const CONVERTER_CATEGORIES = rawConverterData.categories as ConverterCategory[];
export const CONVERSION_PAIRS = rawConverterData.pairs as Record<string, ConversionPair>;

export function getConversionPair(slug: string): ConversionPair | undefined {
  return CONVERSION_PAIRS[slug];
}

export function getAllConversionPairs(): ConversionPair[] {
  return Object.values(CONVERSION_PAIRS);
}
export function getAllConversionSlugs(): string[] {
  return Object.keys(CONVERSION_PAIRS);
}

export function getPairsByCategory(categoryId: string): ConversionPair[] {
  return Object.values(CONVERSION_PAIRS).filter((p) => p.category === categoryId);
}
