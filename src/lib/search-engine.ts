import { searchArticles, determineSearchMode, ArticleSearchItem, SearchMode } from '@/lib/seo-content';
import toolsData from '@/lib/search-index.json';
import { TOOLBOX_DATA, ToolboxItem } from '@/lib/toolbox-data';
import { getAllConversionSlugs } from '@/lib/converter-data';

export interface SearchTool {
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

export interface SearchToolboxItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  url: string;
}

export interface SearchResult {
  tools: SearchTool[];
  articles: ArticleSearchItem[];
  toolbox: SearchToolboxItem[];
  mode: SearchMode | 'toolbox';
}

const tools = toolsData as SearchTool[];
const toolNames = tools.map((t) => t.name);
const conversionSlugsSet = new Set(getAllConversionSlugs());

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
  
  if (targetWord.includes(queryWord)) return true;
  
  const distance = getLevenshteinDistance(queryWord, targetWord);
  if (queryWord.length <= 4) return distance <= 1;
  if (queryWord.length <= 7) return distance <= 2;
  return distance <= 3;
}

const STOP_WORDS = new Set(['best', 'software', 'cad', 'tool', 'tools', 'top', 'for', 'vs', 'program', 'programs']);

function normalizeString(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function fuzzyMatchTool(tool: SearchTool, query: string): boolean {
  if (!query) return true;
  const normalizedQuery = normalizeString(query);
  if (!normalizedQuery) return true;

  const toolNameNormalized = normalizeString(tool.name);
  
  if (toolNameNormalized.includes(normalizedQuery)) return true;
  if (isFuzzyMatch(normalizedQuery, toolNameNormalized)) return true;

  if (tool.aliases) {
    for (const alias of tool.aliases) {
      const aliasNorm = normalizeString(alias);
      if (aliasNorm.includes(normalizedQuery) || isFuzzyMatch(normalizedQuery, aliasNorm)) {
        return true;
      }
    }
  }

  const queryWords = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (queryWords.length > 1) {
    const concatQuery = queryWords.join('');
    if (toolNameNormalized.includes(concatQuery) || isFuzzyMatch(concatQuery, toolNameNormalized)) {
      return true;
    }
  }

  let tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
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
    
    return tokens.every(token => {
      const normToken = normalizeString(token);
      if (!normToken) return true;
      return fieldsToMatch.some(field => field.includes(normToken) || isFuzzyMatch(normToken, field));
    });
  }

  return false;
}

function fuzzyMatchToolbox(item: ToolboxItem, query: string): boolean {
  if (!query) return true;
  const normalizedQuery = normalizeString(query);
  if (!normalizedQuery) return true;

  const titleNorm = normalizeString(item.title);
  const slugNorm = normalizeString(item.slug);

  if (titleNorm.includes(normalizedQuery) || isFuzzyMatch(normalizedQuery, titleNorm)) return true;
  if (slugNorm.includes(normalizedQuery)) return true;

  for (const kw of item.keywords || []) {
    const kwNorm = normalizeString(kw);
    if (kwNorm.includes(normalizedQuery) || isFuzzyMatch(normalizedQuery, kwNorm)) {
      return true;
    }
  }

  let tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const filteredTokens = tokens.filter(t => !STOP_WORDS.has(t));
  if (filteredTokens.length > 0) {
    tokens = filteredTokens;
  }

  if (tokens.length > 0) {
    const fieldsToMatch = [
      titleNorm,
      slugNorm,
      normalizeString(item.description || ''),
      normalizeString(item.category || ''),
      ...(item.keywords || []).map(normalizeString)
    ];

    return tokens.every(token => {
      const normToken = normalizeString(token);
      if (!normToken) return true;
      return fieldsToMatch.some(field => field.includes(normToken) || isFuzzyMatch(normToken, field));
    });
  }

  return false;
}

export function performSearch(inputValue: string): SearchResult {
  if (!inputValue.trim()) {
    return { tools: [], articles: [], toolbox: [], mode: 'both' };
  }

  const mode = determineSearchMode(inputValue, toolNames);

  const matchingTools = tools
    .filter((tool) => fuzzyMatchTool(tool, inputValue))
    .sort((a, b) => {
      const aExactName = normalizeString(a.name) === normalizeString(inputValue);
      const bExactName = normalizeString(b.name) === normalizeString(inputValue);
      if (aExactName && !bExactName) return -1;
      if (!aExactName && bExactName) return 1;
      
      const aStartsWith = normalizeString(a.name).startsWith(normalizeString(inputValue));
      const bStartsWith = normalizeString(b.name).startsWith(normalizeString(inputValue));
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      return b.score - a.score;
    })
    .slice(0, 5);

  const matchingArticles = searchArticles(inputValue, 5);

  const matchingToolbox = TOOLBOX_DATA
    .filter((item) => item.status === 'released' && fuzzyMatchToolbox(item, inputValue))
    .sort((a, b) => {
      const aExact = normalizeString(a.title) === normalizeString(inputValue);
      const bExact = normalizeString(b.title) === normalizeString(inputValue);
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aStarts = normalizeString(a.title).startsWith(normalizeString(inputValue));
      const bStarts = normalizeString(b.title).startsWith(normalizeString(inputValue));
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return 0;
    })
    .slice(0, 5)
    .map((item) => {
      const is3DConverter = item.category === '3d-converter' || conversionSlugsSet.has(item.slug);
      return {
        slug: item.slug,
        title: item.title,
        description: item.description,
        category: item.category.replace('-', ' '),
        url: is3DConverter ? `/convert/${item.slug}` : `/toolbox/${item.slug}`
      };
    });

  return { tools: matchingTools, articles: matchingArticles, toolbox: matchingToolbox, mode };
}
