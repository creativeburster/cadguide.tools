
const fs = require('fs');
const path = require('path');

console.log('=== 内容最不齐全的10个工具页面 ===\n');

// 我们手动数一下或者快速看一下有多少个文件
const files = [
  'c1.ts',
  'c2.ts',
  'c3.ts',
  'c4.ts',
  'c5.ts',
  'c6.ts',
  'c7.ts'
];

const importantFields = [
  'description',
  'detailed_features',
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

const tools = [];

// 简单的方法：读取每个文件，然后用正则匹配工具数据
files.forEach(file =&gt; {
  const filePath = path.join(__dirname, 'src/lib/data', file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 简单地匹配每个工具对象
  const toolMatches = content.match(/\{[^}]*id:[^}]*slug:[^}]*name:[^}]*\}/g) || [];
  
  toolMatches.forEach(match =&gt; {
    // 提取 name 和 slug
    const nameMatch = match.match(/name:\s*"([^"]+)"/);
    const slugMatch = match.match(/slug:\s*"([^"]+)"/);
    
    if (nameMatch &amp;&amp; slugMatch) {
      const name = nameMatch[1];
      const slug = slugMatch[1];
      
      // 快速计数缺失的字段
      let missingCount = 0;
      const missingFields = [];
      
      importantFields.forEach(field =&gt; {
        if (!match.includes(field + ':')) {
          missingCount++;
          missingFields.push(field);
        }
      });
      
      tools.push({
        name,
        slug,
        missingCount,
        missingFields
      });
    }
  });
});

// 排序
tools.sort((a, b) =&gt; b.missingCount - a.missingCount);

// 输出前10个
tools.slice(0, 10).forEach((tool, index) =&gt; {
  console.log(`${index + 1}. ${tool.name} (${tool.slug})`);
  console.log(`   缺失约 ${tool.missingCount} 个重要字段`);
  console.log('');
});

console.log(`总共 ${tools.length} 个工具`);

