const fs = require('fs');
let content = fs.readFileSync('src/lib/data.ts', 'utf8');

const newFields = `  pricing_tiers?: {
    name: string;
    price: string;
    period: string;
    features: string[];
    is_popular?: boolean;
  }[];
  detailed_features?: {
    category: string;
    items: { name: string, status: boolean }[];
  }[];
  alternatives?: string[]; // slugs of similar tools
`;

// Use a more flexible regex for line endings
content = content.replace(/country\?: string;\s*}/, `country?: string;\n${newFields}}`);

fs.writeFileSync('src/lib/data.ts', content);
console.log('Interface updated with flexible regex');
