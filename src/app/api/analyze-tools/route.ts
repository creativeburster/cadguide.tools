
import { NextResponse } from 'next/server';
import { tools } from '@/lib/data';

// 定义我们认为完整的工具应该有的重要字段
const importantFields = [
  'name',
  'slug',
  'description',
  'short_desc',
  'pricing_tiers',
  'detailed_features',
  'alternatives',
  'external_ratings',
  'faqs',
  'pros',
  'cons',
  'expert_verdict',
  'file_formats_in',
  'file_formats_out',
  'integrations',
  'support_channels',
  'deployment_options',
  'license_types',
  'languages',
];

export async function GET() {
  // 为每个工具计算缺失的字段数量
  const analyzed = tools.map(tool =&gt; {
    const missingFields = importantFields.filter(field =&gt; {
      const value = (tool as any)[field];
      if (Array.isArray(value)) {
        return value.length === 0;
      }
      return !value;
    });

    return {
      id: tool.id,
      name: tool.name,
      slug: tool.slug,
      missingCount: missingFields.length,
      missingFields,
      totalImportantFields: importantFields.length,
    };
  });

  // 按缺失字段数量排序（最多的在前）
  analyzed.sort((a, b) =&gt; b.missingCount - a.missingCount);

  // 返回前10个
  return NextResponse.json({
    top10Missing: analyzed.slice(0, 10),
    totalTools: tools.length,
  });
}

