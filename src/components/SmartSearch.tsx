'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ToolLogo } from '@/components/tool-logo';
import { FileText, Sparkles, Loader2 } from 'lucide-react';
import type { SearchTool, SearchResult } from '@/lib/search-engine';
import type { ArticleSearchItem } from '@/lib/seo-content';

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
  const [searchSuggestions, setSearchSuggestions] = useState<SearchResult>({
    tools: [],
    articles: [],
    mode: 'both',
  });
  const [isLoadingEngine, setIsLoadingEngine] = useState(false);
  
  const searchEngineRef = useRef<((query: string) => SearchResult) | null>(null);
  const router = useRouter();

  // Lazy-load the search engine module asynchronously
  const loadSearchEngine = useCallback(async () => {
    if (searchEngineRef.current) return searchEngineRef.current;
    try {
      setIsLoadingEngine(true);
      const mod = await import('@/lib/search-engine');
      searchEngineRef.current = mod.performSearch;
      setIsLoadingEngine(false);
      return mod.performSearch;
    } catch {
      setIsLoadingEngine(false);
      return null;
    }
  }, []);

  // Prewarm search engine in idle time without blocking main thread
  useEffect(() => {
    let idleId: number | NodeJS.Timeout;
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        idleId = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(
          () => {
            loadSearchEngine();
          },
          { timeout: 3000 }
        );
      } else {
        idleId = setTimeout(() => {
          loadSearchEngine();
        }, 2000);
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        if ('cancelIdleCallback' in window && typeof idleId === 'number') {
          (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
        } else {
          clearTimeout(idleId as NodeJS.Timeout);
        }
      }
    };
  }, [loadSearchEngine]);

  // Perform search whenever inputValue changes
  useEffect(() => {
    if (!inputValue.trim()) {
      setSearchSuggestions({ tools: [], articles: [], mode: 'both' });
      return;
    }

    let active = true;
    const runSearch = async () => {
      const searchFn = await loadSearchEngine();
      if (active && searchFn) {
        const results = searchFn(inputValue);
        setSearchSuggestions(results);
      }
    };

    runSearch();
    return () => {
      active = false;
    };
  }, [inputValue, loadSearchEngine]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (searchSuggestions.articles.length > 0 && searchSuggestions.mode === 'articles') {
        router.push(searchSuggestions.articles[0].url);
      } else {
        router.push(`/tools?q=${encodeURIComponent(inputValue.trim())}`);
      }
    } else {
      router.push('/tools');
    }
    setShowSuggestions(false);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      onMouseEnter={() => loadSearchEngine()}
      className="bg-white p-3 sm:p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-3 max-w-3xl mx-auto w-full relative"
    >
      <div className="flex-1 relative flex items-center">
        <input 
          type="text" 
          placeholder="e.g. Free 2D CAD for Mac or Electrical..." 
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            loadSearchEngine();
          }}
          onFocus={() => {
            setShowSuggestions(true);
            loadSearchEngine();
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
          className="w-full px-5 py-4 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-base"
        />
        
        {/* Search Suggestions Dropdown */}
        {showSuggestions && inputValue.trim() && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[480px] overflow-y-auto">
            {isLoadingEngine && searchSuggestions.tools.length === 0 && searchSuggestions.articles.length === 0 ? (
              <div className="p-6 text-center text-slate-400 flex items-center justify-center gap-2 text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Searching directory...</span>
              </div>
            ) : searchSuggestions.mode === 'articles' ? (
              // 1. Long-tail article search mode: Show articles first, then matching products
              <>
                {/* Articles Section */}
                {searchSuggestions.articles.length > 0 && (
                  <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-blue-600 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Matching Lists & Comparisons
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {searchSuggestions.articles.map((article: ArticleSearchItem) => (
                        <Link
                          key={`${article.type}-${article.slug}`}
                          href={article.url}
                          className="block px-3 py-2.5 hover:bg-white hover:shadow-sm hover:border-slate-200 border border-transparent rounded-lg transition-all"
                          onClick={() => {
                            setShowSuggestions(false);
                            setInputValue('');
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-blue-50 border-blue-100 text-blue-700 text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded-sm">
                              {getArticleTypeLabel(article.type)}
                            </Badge>
                          </div>
                          <div className="text-sm font-semibold text-slate-900">
                            {article.title}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {article.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Tools Section */}
                {searchSuggestions.tools.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-amber-600 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      Matching Software Products
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {searchSuggestions.tools.map((tool: SearchTool) => (
                        <Link
                          key={tool.id}
                          href={`/tools/${tool.slug}`}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                          onClick={() => {
                            setShowSuggestions(false);
                            setInputValue('');
                          }}
                        >
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200 shrink-0">
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
                          <div className="text-xs font-bold text-blue-600 shrink-0 bg-blue-50 px-2 py-1 rounded">
                            ★ {tool.score.toFixed(1)}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              // 2. Tool search mode: Show tools first, then relevant guides
              <>
                {/* Tools Section */}
                {searchSuggestions.tools.length > 0 && (
                  <div className="p-2 border-b border-slate-100">
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-amber-600 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      Matching Software Products
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {searchSuggestions.tools.map((tool: SearchTool) => (
                        <Link
                          key={tool.id}
                          href={`/tools/${tool.slug}`}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                          onClick={() => {
                            setShowSuggestions(false);
                            setInputValue('');
                          }}
                        >
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200 shrink-0">
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
                          <div className="text-xs font-bold text-blue-600 shrink-0 bg-blue-50 px-2 py-1 rounded">
                            ★ {tool.score.toFixed(1)}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Articles Section */}
                {searchSuggestions.articles.length > 0 && (
                  <div className="p-2 bg-slate-50/50">
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-blue-600 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Related Lists & Comparisons
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {searchSuggestions.articles.map((article: ArticleSearchItem) => (
                        <Link
                          key={`${article.type}-${article.slug}`}
                          href={article.url}
                          className="block px-3 py-2.5 hover:bg-white hover:shadow-sm hover:border-slate-200 border border-transparent rounded-lg transition-all"
                          onClick={() => {
                            setShowSuggestions(false);
                            setInputValue('');
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-blue-50 border-blue-100 text-blue-700 text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded-sm">
                              {getArticleTypeLabel(article.type)}
                            </Badge>
                          </div>
                          <div className="text-sm font-semibold text-slate-900">
                            {article.title}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {article.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* No results found */}
            {!isLoadingEngine && searchSuggestions.tools.length === 0 && searchSuggestions.articles.length === 0 && (
              <div className="px-4 py-8 text-center bg-slate-50">
                <div className="text-sm font-semibold text-slate-600">No matching tools or articles found</div>
                <div className="text-xs text-slate-400 mt-1">Check spelling or try a broader engineering keyword</div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <Button type="submit" className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-7 px-10 rounded-xl transition-all text-lg shadow-lg shadow-blue-200">
        Search
      </Button>
    </form>
  );
}
