
import { tools } from './src/lib/data';

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

// 为每个工具计算缺失的字段数量
const analyzeTools = () =&gt; {
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

  return analyzed;
};

const main = () =&gt; {
  const result = analyzeTools();
  
  console.log('=== 内容最不齐全的10个工具页面 ===\n');
  
  result.slice(0, 10).forEach((tool, index) =&gt; {
    console.log(`${index + 1}. ${tool.name} (${tool.slug})`);
    console.log(`   缺失 ${tool.missingCount}/${tool.totalImportantFields} 个重要字段`);
    console.log(`   缺失的字段: ${tool.missingFields.join(', ')}`);
    console.log('');
  });

  console.log(`\n总共 ${tools.length} 个工具`);
};

main();

