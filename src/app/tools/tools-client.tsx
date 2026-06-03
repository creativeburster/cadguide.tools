'use client';

import { useState, useMemo, Suspense, useEffect, useCallback, useDeferredValue } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { tools, categories } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ToolLogo } from '@/components/tool-logo';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Items per page on the directory grid. Mirrors `ITEMS_PER_PAGE` in
// src/app/tools/page.tsx so canonical URLs and client pagination agree.
const ITEMS_PER_PAGE = 24;

/**
 * Normalizes a string by converting it to lowercase, stripping diacritics,
 * and removing all non-alphanumeric characters.
 * E.g., "V-NAS" -> "vnas", "vnas" -> "vnas", "3D CAD" -> "3dcad"
 */
function normalizeString(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9]/g, '');      // keep only letters and numbers
}

// Levenshtein Distance for Typo-Tolerant Fuzzy Matching
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

// Check if a query word fuzzy matches a target word with typo tolerance
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

/**
 * Checks if a tool matches a search query using robust fuzzy logic.
 * E.g., searching "vnas" matches "V-NAS", and searching "v-nas" matches "vnas".
 * Supports multi-term space-separated AND matching with typo tolerance and stop-words filtering.
 */
function fuzzyMatchTool(tool: any, query: string): boolean {
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

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="px-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full font-black mb-3.5 uppercase text-xs sm:text-[11px] tracking-[0.18em] text-slate-700 flex items-center justify-between hover:text-blue-600 transition-colors text-left group/btn"
      >
        <span className="flex items-center gap-2">
          <span className={cn(
            "transform transition-transform text-[10px] text-slate-400 group-hover/btn:text-blue-500 font-black",
            isOpen ? "rotate-90 text-blue-500" : ""
          )}>
            ▶
          </span>
          {title}
        </span>
        <span className="w-8 h-px bg-slate-200 flex-1 ml-3 group-hover/btn:bg-blue-200 transition-colors"></span>
      </button>
      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-h-[1000px] opacity-100 mt-2 pb-2 visible" : "max-h-0 opacity-0 pointer-events-none invisible"
        )}
      >
        <div className="space-y-2.5">
          {children}
        </div>
      </div>
    </div>
  );
}

function ToolsList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);
  const urlQuery = searchParams.get('q') ?? '';
  
  // Decoupled local search query state for 100% smooth, non-blocking typing
  const [localSearchQuery, setLocalSearchQuery] = useState(urlQuery);
  const deferredSearchQuery = useDeferredValue(localSearchQuery);
  
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // State to control A-Z flat HTML sitemap directory (collapsed by default, but always resident in DOM)
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);

  // Group all tools by starting letter alphabetically (statically pre-rendered in HTML DOM for 100% crawl-friendliness)
  const toolsGroupedByLetter = useMemo(() => {
    const groups: Record<string, typeof tools> = {};
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(char => {
      groups[char] = [];
    });
    
    // Sort tools alphabetically by name
    const sortedTools = [...tools].sort((a, b) => a.name.localeCompare(b.name));
    
    sortedTools.forEach(tool => {
      const firstLetter = tool.name.trim().charAt(0).toUpperCase();
      if (groups[firstLetter]) {
        groups[firstLetter].push(tool);
      } else {
        if (!groups['#']) groups['#'] = [];
        groups['#'].push(tool);
      }
    });
    
    return groups;
  }, []);

  // Sync state if search query parameter changes externally (e.g. back/forward navigation)
  useEffect(() => {
    setLocalSearchQuery(urlQuery);
  }, [urlQuery]);

  // Lock body scroll while the mobile filters drawer is open.
  useEffect(() => {
    if (isFiltersOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isFiltersOpen]);

  // Push search/page state into the URL. Uses `replace` so the user can
  // navigate back out of /tools in one click instead of stepping through
  // every intermediate page/query keystroke.
  const syncUrl = useCallback((next: { page?: number; query?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.query !== undefined) {
      if (next.query) params.set('q', next.query);
      else params.delete('q');
    }
    if (next.page !== undefined) {
      if (next.page > 1) params.set('page', String(next.page));
      else params.delete('page');
    }
    const qs = params.toString();
    router.replace(qs ? `/tools?${qs}` : '/tools', { scroll: false });
  }, [searchParams, router]);

  // Debounce syncing the local search query to the URL.
  // This completely prevents Next.js router transitions from blocking or lag-freezing active typing!
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentUrlQuery = searchParams.get('q') ?? '';
      if (localSearchQuery !== currentUrlQuery) {
        syncUrl({ query: localSearchQuery });
      }
    }, 1200); // 1.2 seconds of typing quietness before URL synchronization

    return () => clearTimeout(timer);
  }, [localSearchQuery, searchParams, syncUrl]);

  const handleSearchQuerySubmit = useCallback((q: string) => {
    setLocalSearchQuery(q);
    syncUrl({ page: 1, query: q });
    setIsFiltersOpen(false);
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 80);
    }
  }, [syncUrl, setIsFiltersOpen]);
  const [filters, setFilters] = useState({
    pricing: [] as string[],
    os: [] as string[],
    industry: [] as string[],
    category: [] as string[],
    userScale: [] as string[],
    kernel: [] as string[],
    minRating: 0,
  });

  const toggleFilter = (type: keyof typeof filters, value: string) => {
    if (type === 'minRating') return; // Handled separately
    syncUrl({ page: 1 });
    setFilters(prev => ({
      ...prev,
      [type]: (prev[type] as string[]).includes(value)
        ? (prev[type] as string[]).filter(v => v !== value)
        : [...(prev[type] as string[]), value]
    }));
    // Smooth scroll to top on filter change so user can see immediate matched outcomes
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 80);
    }
  };

  const setRating = (rating: number) => {
    syncUrl({ page: 1 });
    setFilters(prev => ({ ...prev, minRating: prev.minRating === rating ? 0 : rating }));
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 80);
    }
  };

  // Extract unique filter options from data
  const allIndustries = useMemo(() => Array.from(new Set(tools.flatMap(t => t.industries))).sort(), []);
  const allKernels = useMemo(() => Array.from(new Set(tools.filter(t => t.tech_specs?.engine).map(t => t.tech_specs!.engine))).sort(), []);
  const allUserScales = useMemo(() => Array.from(new Set(tools.flatMap(t => t.user_scales))).sort(), []);

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchQuery = fuzzyMatchTool(tool, deferredSearchQuery);

      const matchPricing = filters.pricing.length === 0 || filters.pricing.includes(tool.pricing_type);
      const matchOS = filters.os.length === 0 || tool.platforms.some(p => filters.os.includes(p));
      const matchIndustry = filters.industry.length === 0 || tool.industries.some(i => filters.industry.includes(i));
      const matchCategory = filters.category.length === 0 || filters.category.includes(tool.category_id);
      const matchUserScale = filters.userScale.length === 0 || tool.user_scales.some(s => filters.userScale.includes(s));
      const matchKernel = filters.kernel.length === 0 || (tool.tech_specs?.engine && filters.kernel.includes(tool.tech_specs.engine));
      const matchRating = tool.score >= filters.minRating;

      return matchQuery && matchPricing && matchOS && matchIndustry && matchCategory && matchUserScale && matchKernel && matchRating;
    });
  }, [deferredSearchQuery, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredTools.length / ITEMS_PER_PAGE));
  // Clamp the current page in case filters shrank the result set under us.
  const effectivePage = Math.min(currentPage, totalPages);
  const paginatedTools = filteredTools.slice(
    (effectivePage - 1) * ITEMS_PER_PAGE,
    effectivePage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    syncUrl({ page });
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 80);
    }
  };

  // ---------- Active filter chips (mobile + desktop) ----------
  type ActiveFilter = { key: string; label: string; onClear: () => void };
  const activeFilters: ActiveFilter[] = [
    ...filters.category.map(id => ({
      key: `cat-${id}`,
      label: categories.find(c => c.id === id)?.name ?? id,
      onClear: () => toggleFilter('category', id),
    })),
    ...filters.industry.map(v => ({
      key: `ind-${v}`,
      label: v,
      onClear: () => toggleFilter('industry', v),
    })),
    ...filters.pricing.map(v => ({
      key: `price-${v}`,
      label: v,
      onClear: () => toggleFilter('pricing', v),
    })),
    ...filters.os.map(v => ({
      key: `os-${v}`,
      label: v,
      onClear: () => toggleFilter('os', v),
    })),
    ...filters.kernel.map(v => ({
      key: `kernel-${v}`,
      label: v,
      onClear: () => toggleFilter('kernel', v),
    })),
    ...filters.userScale.map(v => ({
      key: `scale-${v}`,
      label: v,
      onClear: () => toggleFilter('userScale', v),
    })),
    ...(filters.minRating > 0
      ? [{
          key: `rating-${filters.minRating}`,
          label: `${filters.minRating}★ & up`,
          onClear: () => setRating(filters.minRating),
        }]
      : []),
    ...(localSearchQuery
      ? [{
          key: 'query',
          label: `“${localSearchQuery}”`,
          onClear: () => handleSearchQuerySubmit(''),
        }]
      : []),
  ];
  const activeFilterCount = activeFilters.length;

  const resetAll = () => {
    setFilters({ pricing: [], os: [], industry: [], category: [], userScale: [], kernel: [], minRating: 0 });
    syncUrl({ page: 1, query: '' });
    setIsFiltersOpen(false);
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 80);
    }
  };

  return (
    <>
      {/* Mobile-only filter toggle bar.
          Below `lg`, the sidebar is hidden behind a slide-in drawer to free
          vertical space for the tool grid. The button surfaces the count of
          currently-active filters so the affordance is discoverable. */}
      <div className="lg:hidden mb-4 flex items-center gap-3">
        <Button
          type="button"
          onClick={() => setIsFiltersOpen(true)}
          className="rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[11px] h-11 px-4 flex items-center gap-2 shadow-lg shadow-slate-900/10"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center bg-blue-600 text-white rounded-full text-[10px] font-black w-5 h-5">
              {activeFilterCount}
            </span>
          )}
        </Button>
        <div className="text-sm font-bold text-slate-500">
          <span className="text-slate-900 font-black">{filteredTools.length}</span> tools
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Backdrop overlay shown when the mobile drawer is open. */}
      {isFiltersOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setIsFiltersOpen(false)}
          aria-hidden="true"
        />
      )}
      {/* Sidebar Filters - Premium Sticky Design (lg+) /
          Slide-in Drawer (below lg).
          The same DOM is used in both modes; the wrapper toggles between
          a static sticky column on lg+ and a fixed translate-x drawer on
          mobile. Body scroll is locked while the drawer is open (see
          useEffect above). */}
      <aside
        className={`shrink-0 lg:w-72 lg:sticky lg:top-24 lg:h-fit lg:translate-x-0 lg:bg-transparent lg:p-0 lg:overflow-visible lg:transition-none fixed top-0 left-0 z-50 h-screen w-[88%] max-w-sm bg-[#fcfdfe] overflow-y-auto p-5 transition-transform duration-300 ease-out ${
          isFiltersOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Filters"
      >
        {/* Drawer header (mobile only) */}
        <div className="lg:hidden flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
          <h2 className="text-xl font-black tracking-tight">Filters</h2>
          <button
            type="button"
            onClick={() => setIsFiltersOpen(false)}
            aria-label="Close filters"
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="space-y-6">
        <SmartSearchBox 
          searchQuery={localSearchQuery} 
          onSearchChange={(q) => setLocalSearchQuery(q)}
          onSearchSubmit={handleSearchQuerySubmit} 
        />

        <div className="space-y-6">
          <FilterSection title="Main Category">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center group">
                <Checkbox 
                  id={`cat-${cat.id}`} 
                  checked={filters.category.includes(cat.id)}
                  onCheckedChange={() => toggleFilter('category', cat.id)}
                  className="rounded-md border-slate-200 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all"
                />
                <label htmlFor={`cat-${cat.id}`} className="text-sm font-semibold text-slate-600 ml-3 cursor-pointer group-hover:text-blue-600 transition-colors flex-1">{cat.name}</label>
              </div>
            ))}
          </FilterSection>

          <Separator className="bg-slate-100" />

          <FilterSection title="Target Industry">
            <div className="grid grid-cols-1 gap-2">
              {allIndustries.map(ind => (
                <div key={ind} className="flex items-center group">
                  <Checkbox 
                    id={`ind-${ind}`} 
                    checked={filters.industry.includes(ind)}
                    onCheckedChange={() => toggleFilter('industry', ind)}
                    className="rounded-md border-slate-200 data-[state=checked]:bg-blue-600 transition-all"
                  />
                  <label htmlFor={`ind-${ind}`} className="text-[13px] font-semibold text-slate-600 ml-3 cursor-pointer group-hover:text-blue-600 transition-colors">{ind}</label>
                </div>
              ))}
            </div>
          </FilterSection>

          <Separator className="bg-slate-100" />

          <FilterSection title="Minimum Rating" defaultOpen={false}>
            <div className="flex gap-2">
              {[4.5, 4.0, 3.5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setRating(rating)}
                  className={`flex-1 py-2 px-1 rounded-xl text-[10px] font-black border transition-all ${
                    filters.minRating === rating 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                      : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'
                  }`}
                >
                  {rating}★
                </button>
              ))}
            </div>
          </FilterSection>

          <Separator className="bg-slate-100" />

          <FilterSection title="Pricing Model" defaultOpen={true}>
            {['Free', 'Open Source', 'Freemium', 'Subscription', 'Perpetual'].map(type => (
              <div key={type} className="flex items-center group">
                <Checkbox 
                  id={`price-${type}`} 
                  checked={filters.pricing.includes(type)}
                  onCheckedChange={() => toggleFilter('pricing', type)}
                  className="rounded-md border-slate-200"
                />
                <label htmlFor={`price-${type}`} className="text-sm font-semibold text-slate-600 ml-3 cursor-pointer group-hover:text-blue-600 transition-colors">{type}</label>
              </div>
            ))}
          </FilterSection>

          <Separator className="bg-slate-100" />

          <FilterSection title="Operating System" defaultOpen={false}>
            <div className="flex flex-wrap gap-2">
              {['Windows', 'macOS', 'Linux', 'Web', 'Android', 'iOS'].map(os => (
                <button
                  key={os}
                  onClick={() => toggleFilter('os', os)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                    filters.os.includes(os)
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {os}
                </button>
              ))}
            </div>
          </FilterSection>

          <Separator className="bg-slate-100" />

          <FilterSection title="Geometry Kernel" defaultOpen={false}>
            <div className="space-y-2">
              {allKernels.map(k => (
                <div key={k} className="flex items-center group">
                  <Checkbox 
                    id={`kernel-${k}`} 
                    checked={filters.kernel.includes(k)}
                    onCheckedChange={() => toggleFilter('kernel', k)}
                    className="rounded-md border-slate-200"
                  />
                  <label htmlFor={`kernel-${k}`} className="text-[13px] font-semibold text-slate-600 ml-3 cursor-pointer group-hover:text-blue-600 transition-colors">{k}</label>
                </div>
              ))}
            </div>
          </FilterSection>

          <Separator className="bg-slate-100" />

          <FilterSection title="Organization Size" defaultOpen={false}>
            {allUserScales.map(scale => (
              <div key={scale} className="flex items-center group">
                <Checkbox 
                  id={`scale-${scale}`} 
                  checked={filters.userScale.includes(scale)}
                  onCheckedChange={() => toggleFilter('userScale', scale)}
                  className="rounded-md border-slate-200"
                />
                <label htmlFor={`scale-${scale}`} className="text-sm font-semibold text-slate-600 ml-3 cursor-pointer group-hover:text-blue-600 transition-colors">{scale}</label>
              </div>
            ))}
          </FilterSection>
        </div>
        </div>

        {/* Drawer footer (mobile only) — primary "show results" CTA */}
        <div className="lg:hidden mt-8 pt-6 border-t border-slate-100 flex items-center gap-3 sticky bottom-0 bg-[#fcfdfe] pb-2">
          <Button
            type="button"
            variant="ghost"
            onClick={resetAll}
            className="rounded-2xl text-slate-500 hover:text-red-600 hover:bg-red-50 font-black text-[11px] uppercase tracking-widest h-12 px-4"
          >
            Reset
          </Button>
          <Button
            type="button"
            onClick={() => setIsFiltersOpen(false)}
            className="flex-1 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[11px] h-12"
          >
            Show {filteredTools.length} tools
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Active-filter chip row — visible when at least one filter or
            search query is active. Each chip toggles its source filter off
            on click; gives users a one-tap escape from any narrowed view. */}
        {activeFilters.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-1">
              Active:
            </span>
            {activeFilters.map(f => (
              <button
                key={f.key}
                type="button"
                onClick={f.onClear}
                className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 rounded-full px-3 py-1 text-xs font-bold transition-colors"
              >
                {f.label}
                <X className="w-3 h-3" />
              </button>
            ))}
            <button
              type="button"
              onClick={resetAll}
              className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-6 bg-white p-4 md:p-5 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-blue-600 text-white w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-base md:text-lg shadow-lg shadow-blue-100">
              {filteredTools.length}
            </div>
            <div>
              <div className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-widest">Tools Matched</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight hidden sm:block">Based on your preferences</div>
            </div>
          </div>
          {(Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f > 0) || localSearchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetAll}
              className="text-slate-400 hover:text-red-600 font-bold text-[10px] uppercase tracking-widest gap-2 hover:bg-red-50 px-3 md:px-4 rounded-xl"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              <span className="hidden sm:inline">Reset All</span>
              <span className="sm:hidden">Reset</span>
            </Button>
          )}
        </div>

        <div className="grid gap-6">
          {paginatedTools.map(tool => (
            <Card key={tool.id} className="p-6 hover:shadow-2xl transition-all duration-500 border-slate-100 rounded-[40px] group relative overflow-hidden bg-white hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              
              <div className="flex flex-col xl:flex-row items-start gap-6">
                <div className="flex flex-col items-center gap-4 shrink-0 w-full xl:w-32">
                  <div className="w-24 h-24 bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-100 group-hover:scale-105 transition-transform duration-500 relative">
                    <ToolLogo slug={tool.slug} src={tool.logo_url} websiteUrl={tool.official_url} name={tool.name} className="w-full h-full" />
                    <div className="absolute -top-1 -right-1 bg-white border border-slate-100 shadow-lg rounded-xl px-2.5 py-1 text-[10px] font-black text-blue-600 z-10">
                      {tool.score}
                    </div>
                  </div>
                  <div className="text-center w-full">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${tool.score * 10}%` }}></div>
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Product Rating</div>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className="flex flex-col 2xl:flex-row justify-between items-start gap-6 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Link href={`/tools/${tool.slug}`} className="text-3xl font-black text-slate-900 hover:text-blue-600 transition-colors tracking-tight">
                          {tool.name}
                        </Link>
                        <Badge variant="outline" className="bg-blue-50/50 text-blue-700 border-blue-100 font-bold text-[9px] uppercase tracking-widest px-3">
                          {categories.find(c => c.id === tool.category_id)?.name}
                        </Badge>
                      </div>
                      <p className="text-slate-500 leading-relaxed text-[15px] font-medium line-clamp-2 max-w-2xl">{tool.short_desc}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest border border-slate-200">
                          🌍 {tool.country || 'USA'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-900 px-6 py-4 rounded-[24px] text-right shrink-0 w-full 2xl:w-auto shadow-xl shadow-slate-200 group-hover:bg-blue-600 transition-colors duration-500">
                      <div className="text-[10px] text-blue-400 group-hover:text-blue-100 uppercase font-black tracking-widest mb-1 transition-colors">Starting at</div>
                      <div className="text-2xl font-black text-white">
                        {tool.starting_price === 0 ? 'FREE' : `$${tool.starting_price.toLocaleString()}`}
                      </div>
                      <div className="text-[9px] text-slate-500 group-hover:text-blue-200 font-bold uppercase mt-1 transition-colors">Per Year / Seat</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-4 h-px bg-slate-200"></span>
                        Key Strengths
                      </h4>
                      <div className="space-y-2.5">
                        {tool.core_features.slice(0, 3).map(feature => (
                          <div key={feature} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-4 h-px bg-slate-200"></span>
                        Best For
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {tool.industries.map(ind => (
                          <span key={ind} className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-slate-100">{ind}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-slate-50">
                    <div className="flex flex-wrap gap-3">
                      {tool.platforms.map(p => (
                        <div key={p} className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                          {p}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-4">
                      <Button asChild variant="outline" className="rounded-2xl border-slate-200 hover:bg-slate-50 font-black px-6 h-12 text-xs uppercase tracking-widest transition-all">
                        <Link href={`/tools/${tool.slug}`}>Review Details</Link>
                      </Button>
                      <Button asChild className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black px-8 h-12 text-xs uppercase tracking-widest shadow-xl shadow-blue-100 transition-all hover:scale-105">
                        <a href={tool.affiliate_url || tool.official_url} target="_blank" rel="nofollow noopener noreferrer">Try Now</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {filteredTools.length === 0 && (
            <div className="text-center py-32 bg-slate-50 rounded-[60px] border-2 border-dashed border-slate-200 px-8">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-slate-200">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Zero Matches Found</h2>
              <p className="text-slate-500 font-medium mb-10 max-w-md mx-auto leading-relaxed">We couldn't find any tools matching your specific combination of filters. Try broadening your criteria.</p>
              <Button
                variant="outline"
                className="rounded-[20px] font-black px-10 h-14 text-xs uppercase tracking-widest border-slate-200 hover:bg-white"
                onClick={resetAll}
              >
                Clear All Filter Criteria
              </Button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-slate-100">
              <div className="text-xs md:text-sm font-bold text-slate-600 order-2 sm:order-1 text-center sm:text-left">
                Showing {((effectivePage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(effectivePage * ITEMS_PER_PAGE, filteredTools.length)} of {filteredTools.length} tools
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(effectivePage - 1)}
                  disabled={effectivePage === 1}
                  className="rounded-xl border-slate-200 hover:bg-slate-50 font-black text-[10px] md:text-xs uppercase tracking-widest px-3 md:px-4 h-9 md:h-10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (effectivePage <= 3) {
                      pageNum = i + 1;
                    } else if (effectivePage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = effectivePage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-xl text-[11px] md:text-xs font-black uppercase tracking-widest transition-all ${
                          effectivePage === pageNum
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(effectivePage + 1)}
                  disabled={effectivePage === totalPages}
                  className="rounded-xl border-slate-200 hover:bg-slate-50 font-black text-[10px] md:text-xs uppercase tracking-widest px-3 md:px-4 h-9 md:h-10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* --- CRITICAL: THE 235+ TOOL HTML DOM FLAT SITEMAP INTERLINKING DIRECTORY --- */}
          {/* Statically renders 100% of leaf node tool links in the DOM to bypass dynamic pagination index gaps! */}
          {/* Googlebot can instantly traverse and crawl all 235+ tools in a single fetch, collapsing crawl depth from 4 to 2. */}
          <div className="mt-16 pt-8 border-t border-slate-100">
            <Card className="border-none shadow-[0_16px_32px_-12px_rgba(0,0,0,0.03)] rounded-[24px] bg-slate-50/50 overflow-hidden border border-slate-100/50">
              <button
                type="button"
                onClick={() => setIsSitemapOpen(!isSitemapOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50/70 transition-colors gap-4"
              >
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight uppercase tracking-widest">
                    📁 Complete CAD & BIM Software Sitemap Directory (A-Z)
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mt-1.5">
                    Bypass pagination indexes. Flat crawling directory containing all 235+ tool pathways.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100/50 px-2.5 py-1 rounded-xl">
                    {tools.length} Tools
                  </span>
                  <span className={cn(
                    "transform transition-transform text-slate-500 text-sm font-black shrink-0",
                    isSitemapOpen ? "rotate-90" : ""
                  )}>
                    ▶
                  </span>
                </div>
              </button>

              <div
                className={cn(
                  "transition-all duration-300 ease-in-out overflow-hidden border-t border-slate-100/40 bg-white",
                  isSitemapOpen ? "max-h-[2500px] p-6 opacity-100" : "max-h-0 p-0 opacity-0 pointer-events-none"
                )}
              >
                <div className="space-y-6">
                  {Object.entries(toolsGroupedByLetter).map(([letter, letterTools]) => {
                    if (letterTools.length === 0) return null;
                    return (
                      <div key={letter} className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 pb-4 border-b border-slate-50 last:border-none">
                        <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-black text-sm flex items-center justify-center shrink-0 shadow-sm border border-blue-100/40">
                          {letter}
                        </span>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm pt-1.5">
                          {letterTools.map(t => (
                            <Link
                              key={t.id}
                              href={`/tools/${t.slug}`}
                              className="font-bold text-slate-600 hover:text-blue-600 hover:underline transition-colors block"
                            >
                              {t.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default function ToolsDirectoryPage() {
  return (
    <main className="max-w-[1360px] mx-auto px-4 py-12 min-h-screen">
      <div className="mb-10 text-center">
        <Badge className="bg-blue-600/10 text-blue-700 border-none px-4 py-1 mb-4 font-bold uppercase tracking-widest text-[10px]">
          CAD Directory
        </Badge>
        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">Professional CAD Software</h1>
        <p className="text-slate-500 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
          Deep-dive into 235+ tools with technical specs, expert verdicts, and community reviews.
        </p>
      </div>

      <Suspense fallback={<div>Loading tools...</div>}>
        <ToolsList />
      </Suspense>
    </main>
  );
}

interface SmartSearchBoxProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
}

function SmartSearchBox({ searchQuery, onSearchChange, onSearchSubmit }: SmartSearchBoxProps) {
  const [inputValue, setInputValue] = useState(searchQuery);

  // Sync state if searchQuery prop changes externally (e.g., when clicking active filter chips or resetting)
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onSearchChange(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(inputValue);
  };

  const handleClear = () => {
    setInputValue('');
    onSearchChange('');
    onSearchSubmit('');
  };

  return (
    <div className="bg-slate-900 p-6 rounded-[32px] shadow-2xl shadow-blue-900/10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/20 transition-colors duration-500"></div>
      <h3 className="font-bold mb-4 uppercase text-[10px] tracking-widest text-blue-400 relative z-10">Smart Search</h3>
      <div className="relative z-10">
        <form onSubmit={handleSubmit} className="relative">
          <Input
            placeholder="Find a specific tool..."
            value={inputValue}
            onChange={handleChange}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:ring-blue-600 focus:border-blue-600 pr-14 pl-4 h-11 transition-all"
          />
          {inputValue ? (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-9 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors"
            aria-label="Search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
