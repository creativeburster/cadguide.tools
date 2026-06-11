const mainRoute = require('../src/app/sitemap-main.xml/route.ts');
const guidesRoute = require('../src/app/sitemap-guides.xml/route.ts');
const toolsRoute = require('../src/app/sitemap-tools.xml/route.ts');
const compareRoute = require('../src/app/sitemap-compare.xml/route.ts');
const altRoute = require('../src/app/sitemap-alternatives.xml/route.ts');

async function count() {
  const main = await mainRoute.GET();
  const guides = await guidesRoute.GET();
  const tools = await toolsRoute.GET();
  const compare = await compareRoute.GET();
  const alt = await altRoute.GET();
  
  const getLocs = async (res) => {
    const text = await res.text();
    const matches = text.match(/<loc>([^<]+)<\/loc>/g);
    return matches ? matches.length : 0;
  };
  
  const cMain = await getLocs(main);
  const cGuides = await getLocs(guides);
  const cTools = await getLocs(tools);
  const cCompare = await getLocs(compare);
  const cAlt = await getLocs(alt);
  
  console.log(JSON.stringify({
    main: cMain,
    guides: cGuides,
    tools: cTools,
    compare: cCompare,
    alternatives: cAlt,
    total: cMain + cGuides + cTools + cCompare + cAlt
  }, null, 2));
}

count().catch(console.error);
