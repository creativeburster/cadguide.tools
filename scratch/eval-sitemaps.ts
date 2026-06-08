import {
  bestOfPaths,
  comparisonPairs,
  platformPagePaths,
  formatPagePaths,
  personaPagePaths,
  sectorPagePaths,
  alternativesPagePaths,
} from '../src/lib/seo-content';
import { tools } from '../src/lib/data';
import { ARTICLES_LIST } from '../src/lib/guides-data';
import { PRICING_PAGES } from '../src/lib/pricing-licensing-content';
import { featureCategories } from '../src/lib/data/featureCategories';
import { TOOLBOX_DATA } from '../src/lib/toolbox-data';

const mainPagesCount = 20; // from sitemap-main (basic static pages)
const toolsCount = tools.length;
const alternativesCount = alternativesPagePaths().length;

const comparePairs = comparisonPairs().length;
const bestOf = bestOfPaths().length;
const features = featureCategories.length;
const platforms = platformPagePaths().length;
const formats = formatPagePaths().length;
const personas = personaPagePaths().length;
const sectors = sectorPagePaths().length;
const pricing = Object.keys(PRICING_PAGES).filter((slug) => slug !== 'free' && slug !== 'open-source').length;

const compareSitemapCount = comparePairs + bestOf + features + platforms + formats + personas + sectors + pricing;

const categoryKeys = ['troubleshooting', 'performance', 'printing', 'standards', 'deployment', 'migration', 'procurement', 'manufacturing'];
const guidesCount = categoryKeys.length + tools.length * 10;

// New Toolbox Sitemap Evaluation
const activeToolboxCount = TOOLBOX_DATA.filter((t) => t.status === 'released').length;
const toolboxSitemapCount = 1 + activeToolboxCount; // 1 (main /toolbox) + released tools

console.log("=== SITEMAP SIZE ANALYSIS ===");
console.log(`sitemap-main.xml: ${mainPagesCount}`);
console.log(`sitemap-tools.xml: ${toolsCount}`);
console.log(`sitemap-toolbox.xml: ${toolboxSitemapCount} (1 main /toolbox + ${activeToolboxCount} active tools)`);
console.log(`sitemap-alternatives.xml: ${alternativesCount}`);
console.log(`sitemap-compare.xml: ${compareSitemapCount} (comparePairs: ${comparePairs}, bestOf: ${bestOf}, features: ${features}, platforms: ${platforms}, formats: ${formats}, personas: ${personas}, sectors: ${sectors}, pricing: ${pricing})`);
console.log(`sitemap-guides.xml: ${guidesCount}`);

const totalSitemapUrls = mainPagesCount + toolsCount + toolboxSitemapCount + alternativesCount + compareSitemapCount + guidesCount;
console.log(`TOTAL URLS IN ALL SUB-SITEMAPS: ${totalSitemapUrls}`);
