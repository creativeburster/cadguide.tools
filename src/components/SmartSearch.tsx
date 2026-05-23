'use client';

import { useState, useMemo, useEffect } from 'react';
import { tools } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ToolLogo } from '@/components/tool-logo';
import { FileText, Sparkles } from 'lucide-react';
import { 
  searchArticles, 
  determineSearchMode, 
  type ArticleSearchItem 
} from '@/lib/seo-content';

// 工具匹配函数 (复制自 tools-client.tsx)
function fuzzyMatchTool(tool: any, query: string) {
  if (!query) return true;
  const q = query.toLowerCase().trim();
  
  // 精确名称匹配
  if (tool.name.toLowerCase().includes(q)) return true;
  
  // 别名匹配
  if (tool.aliases) {
    for (const alias of tool.aliases) {
      if (alias.toLowerCase().includes(q)) return true;
    }
  }
  
  // 描述匹配
  if (tool.short_desc && tool.short_desc.toLowerCase().includes(q)) return true;
  
  // 分类匹配
  if (tool.category_name && tool.category_name.toLowerCase().includes(q)) return true;
  
  // 行业匹配
  if (tool.industries) {
    for (const industry of tool.industries) {
      if (industry.toLowerCase().includes(q)) return true;
    }
  }
  
  // 功能匹配
  if (tool.features) {
    for (const feature of tool.features) {
      if (feature.toLowerCase().includes(q)) return true;
    }
  }
  
  // 平台匹配
  if (tool.platforms) {
    for (const platform of tool.platforms) {
      if (platform.toLowerCase().includes(q)) return true;
    }
  }
  
  return false;
}

// 字符串标准化函数 (复制自 tools-client.tsx)
function normalizeString(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function getArticleTypeLabel(type: string): string {
  switch (type) {
    case 'best': return 'Top List';
    case 'compare': return 'Comparison';
    case 'alternatives': return 'Alternatives';
    case 'platform': return 'Platform Guide';
    case 'file-format': return 'File Format';
    case 'persona': return 'Use Case';
    case 'sector': return 'Industry';
    default: return 'Article';
  }
}

export function SmartSearch() {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const toolNames = useMemo(() => tools.map((t) => t.name), []);

  const searchSuggestions = useMemo(() => {
    if (!inputValue.trim()) {
      return { tools: [], articles: [], mode: 'both' as const };
    }

    const mode = determineSearchMode(inputValue, toolNames);

    // Search for tools - with better sorting
    const matchingTools = tools
      .filter((tool) => fuzzyMatchTool(tool, inputValue))
      .sort((a, b) => {
        // Exact name match first
        const aExactName = normalizeString(a.name) === normalizeString(inputValue);
        const bExactName = normalizeString(b.name) === normalizeString(inputValue);
        if (aExactName && !bExactName) return -1;
        if (!aExactName && bExactName) return 1;
        
        // Then name starts with query
        const aStartsWith = normalizeString(a.name).startsWith(normalizeString(inputValue));
        const bStartsWith = normalizeString(b.name).startsWith(normalizeString(inputValue));
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        // Then higher score
        return b.score - a.score;
      })
      .slice(0, 6);

    // Search for articles
    const matchingArticles = searchArticles(inputValue, 6);

    return { tools: matchingTools, articles: matchingArticles, mode };
  }, [inputValue, toolNames]);

  return (
    <div className="relative w-full">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="e.g. Free 2D CAD for Mac or Electrical..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full px-5 py-4 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-base"
          />
          
          {/* Search Suggestions Dropdown */}
          {showSuggestions && inputValue.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-[450px] overflow-y-auto">
              {/* Articles section - show first if mode is articles */}
              {searchSuggestions.articles.length > 0 && searchSuggestions.mode === 'articles' && (
                <div className="p-2">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Articles
                  </div>
                  {searchSuggestions.articles.map((article) => (
                    <Link
                      key={`${article.type}-${article.slug}`}
                      href={article.url}
                      className="block px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                      onClick={() => {
                        setShowSuggestions(false);
                        setInputValue('');
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-slate-100 border-slate-200 text-slate-600 text-[9px] uppercase tracking-widest font-bold px-2 py-0.5">
                          {getArticleTypeLabel(article.type)}
                        </Badge>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">
                        {article.title}
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-2">
                        {article.description}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              
              {/* Tools section */}
              {searchSuggestions.tools.length > 0 && searchSuggestions.mode === 'tools' && (
                <div className="p-2">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Tools
                  </div>
                  {searchSuggestions.tools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                      onClick={() => {
                        setShowSuggestions(false);
                        setInputValue('');
                      }}
                    >
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                        <ToolLogo
                          slug={tool.slug}
                          src={tool.logo_url}
                          websiteUrl={tool.official_url}
                          name={tool.name}
                          className="w-5 h-5"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate">
                          {tool.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {tool.short_desc}
                        </div>
                      </div>
                      <div className="text-xs font-bold text-blue-600">
                        {tool.score}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* No results */}
              {searchSuggestions.tools.length === 0 && searchSuggestions.articles.length === 0 && (
                <div className="px-3 py-6 text-center">
                  <div className="text-sm text-slate-500">No results found</div>
                  <div className="text-xs text-slate-400 mt-1">Try a different search term</div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <Button asChild className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-7 px-10 rounded-xl transition-all text-lg shadow-lg shadow-blue-200">
          <Link href={inputValue.trim() ? `/tools?q=${encodeURIComponent(inputValue)}` : '/tools'}>
            Search
          </Link>
        </Button>
      </div>
    </div>
  );
}
