'use client';

import { useState, useMemo } from 'react';
import tools from '@/lib/search-index.json';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ToolLogo } from '@/components/tool-logo';
import { FileText, Sparkles } from 'lucide-react';
import { 
  searchArticles, 
  determineSearchMode
} from '@/lib/seo-content';

// 1. Levenshtein Distance for Typo-Tolerant Fuzzy Matching
function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1) // substitution
      );
    }
  }
  return matrix[a.length][b.length];
}

// 2. Determine if a query word fuzzy matches a target word with typo tolerance
function isFuzzyMatch(queryWord: string, targetWord: string): boolean {
  if (queryWord.length < 3) return targetWord.startsWith(queryWord);
  
  // Direct substring check
  if (targetWord.includes(queryWord)) return true;
  
  // Check edit distance for typos
  const distance = getLevenshteinDistance(queryWord, targetWord);
  if (queryWord.length <= 4) return distance <= 1; // 1 typo max for short words
  if (queryWord.length <= 7) return distance <= 2; // 2 typos max for medium words
  return distance <= 3; // 3 typos max for longer words
}

const STOP_WORDS = new Set(['best', 'software', 'cad', 'tool', 'tools', 'top', 'for', 'vs', 'program', 'programs']);

interface SearchTool {
  id: string;
  name: string;
  slug: string;
  short_desc: string;
  score: number;
  logo_url: string;
  official_url: string;
  category_id: string;
  category_name?: string;
  aliases?: string[];
  industries?: string[];
  features?: string[];
  country?: string;
}

// Upgraded robust fuzzy match for tools with stop-words filtering
function fuzzyMatchTool(tool: SearchTool, query: string): boolean {
  if (!query) return true;
  const normalizedQuery = normalizeString(query);
  if (!normalizedQuery) return true;

  const toolNameNormalized = normalizeString(tool.name);
  
  // 1. Direct name match (starts with or includes)
  if (toolNameNormalized.includes(normalizedQuery)) return true;
  
  // 2. Fuzzy match on name (handling typos like "autoad" -> "autocad")
  if (isFuzzyMatch(normalizedQuery, toolNameNormalized)) return true;

  // Check aliases
  if (tool.aliases) {
    for (const alias of tool.aliases) {
      const aliasNorm = normalizeString(alias);
      if (aliasNorm.includes(normalizedQuery) || isFuzzyMatch(normalizedQuery, aliasNorm)) {
        return true;
      }
    }
  }

  // 3. For multi-word queries (e.g. "solid woks" -> "solidworks"), check if removing spaces matches
  const queryWords = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (queryWords.length > 1) {
    const concatQuery = queryWords.join('');
    if (toolNameNormalized.includes(concatQuery) || isFuzzyMatch(concatQuery, toolNameNormalized)) {
      return true;
    }
  }

  // 4. Tokenized AND matching with typo tolerance and stop-words filtering
  let tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  
  // Filter out common search noise words (stop words) if there are other terms to search
  const filteredTokens = tokens.filter(t => !STOP_WORDS.has(t));
  if (filteredTokens.length > 0) {
    tokens = filteredTokens;
  }

  if (tokens.length > 0) {
    const fieldsToMatch = [
      toolNameNormalized,
      normalizeString(tool.short_desc || ''),
      normalizeString(tool.category_name || ''),
      normalizeString(tool.country || ''),
      ...(tool.industries || []).map(normalizeString),
      ...(tool.features || []).map(normalizeString),
    ];
    
    // Check if every token matches at least one field (either as substring or fuzzy match)
    return tokens.every(token => {
      const normToken = normalizeString(token);
      if (!normToken) return true;
      return fieldsToMatch.some(field => field.includes(normToken) || isFuzzyMatch(normToken, field));
    });
  }

  return false;
}

// String normalization helper
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
  const router = useRouter();

  const toolNames = useMemo(() => tools.map((t) => t.name), []);

  const searchSuggestions = useMemo(() => {
    if (!inputValue.trim()) {
      return { tools: [], articles: [], mode: 'both' as const };
    }

    const mode = determineSearchMode(inputValue, toolNames);

    // Search for tools - with Levenshtein fuzzy matching and scoring
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
      .slice(0, 5);

    // Search for articles matching query
    const matchingArticles = searchArticles(inputValue, 5);

    return { tools: matchingTools, articles: matchingArticles, mode };
  }, [inputValue, toolNames]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // If there is a highly matching article at the top in article mode, redirect directly to it!
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
    <form onSubmit={handleSubmit} className="bg-white p-3 sm:p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-3 max-w-3xl mx-auto w-full relative">
      <div className="flex-1 relative flex items-center">
        <input 
          type="text" 
          placeholder="e.g. Free 2D CAD for Mac or Electrical..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
          className="w-full px-5 py-4 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-base"
        />
        
        {/* Search Suggestions Dropdown */}
        {showSuggestions && inputValue.trim() && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[480px] overflow-y-auto">
            {searchSuggestions.mode === 'articles' ? (
              // 1. Long-tail article search mode: Show articles first, then matching products
              <>
                {/* Articles Section */}
                {searchSuggestions.articles.length > 0 && (
                  <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-blue-600 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Matching Guides & Comparisons
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {searchSuggestions.articles.map((article) => (
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
                      Related Guides & Comparisons
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {searchSuggestions.articles.map((article) => (
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
            {searchSuggestions.tools.length === 0 && searchSuggestions.articles.length === 0 && (
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
