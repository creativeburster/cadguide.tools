// scripts/enrich_tools_data.js
/**
 * 自动抓取工具官网信息并写回 src/lib/data.ts
 * 依赖: cheerio, prettier
 */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const prettier = require('prettier');

const DATA_TS_PATH = path.resolve(__dirname, '..', 'src', 'lib', 'data.ts');
const LOG_PATH = path.resolve(__dirname, 'enrich_log.json');
const FETCH_TIMEOUT = 20000;
const PRICE_KEYWORDS = ['price','pricing','subscription','perpetual','license','cost','$','€','£'];
const CAPABILITY_KEYWORDS = ['feature','capability','key capability','优势','功能','特点','key feature'];
const DETAIL_KEYWORDS = ['detail','detailed feature','specification','specs','spec','技术特点'];

async function fetchWithTimeout(url){
  const controller = new AbortController();
  const timeout = setTimeout(()=>controller.abort(), FETCH_TIMEOUT);
  try{ const res = await fetch(url,{signal:controller.signal}); clearTimeout(timeout); if(!res.ok) throw new Error(`HTTP ${res.status}`); return await res.text(); }
  catch(e){ clearTimeout(timeout); throw e; }
}
function extractPricing($){
  const candidates=[];
  $('*').filter((_,el)=>PRICE_KEYWORDS.some(k=>$(el).text().toLowerCase().includes(k))).each((_,el)=>{ const txt=$(el).text().trim(); if(txt) candidates.push(txt);} );
  $('*').filter((_,el)=>/[\$€£]\s*\d/.test($(el).text())).each((_,el)=>{ const txt=$(el).text().trim(); if(txt) candidates.push(txt);} );
  return [...new Set(candidates)].filter(t=>t.length<200);
}
function extractCapabilities($){
  const caps=[];
  $('h2,h3,h4').filter((_,el)=>CAPABILITY_KEYWORDS.some(k=>$(el).text().toLowerCase().includes(k))).each((_,heading)=>{
    const next=$(heading).next();
    if(next.is('ul,ol')) next.find('li').each((_,li)=>caps.push($(li).text().trim()));
    else if(next.is('p')){ const split=next.text().split(/[·●\-–]/).map(s=>s.trim()); split.forEach(s=>{if(s) caps.push(s);}); }
  });
  if(caps.length===0){ $('li').filter((_,li)=>CAPABILITY_KEYWORDS.some(k=>$(li).text().toLowerCase().includes(k))).each((_,li)=>caps.push($(li).text().trim())); }
  return [...new Set(caps)];
}
function extractDetails($){
  const details=[];
  $('h2,h3,h4').filter((_,el)=>DETAIL_KEYWORDS.some(k=>$(el).text().toLowerCase().includes(k))).each((_,heading)=>{
    const next=$(heading).next();
    if(next.is('ul,ol')) next.find('li').each((_,li)=>details.push($(li).text().trim()));
    else if(next.is('p')){ const parts=next.text().split(/[·●\-–]/).map(s=>s.trim()); parts.forEach(p=>{if(p) details.push(p);}); }
  });
  if(details.length===0){ $('li').filter((_,li)=>/engine|core|feature|spec/.test($(li).text().toLowerCase())).each((_,li)=>details.push($(li).text().trim())); }
  return [...new Set(details)];
}
function writeBackToDataTs(tool,enriched){
  const raw=fs.readFileSync(DATA_TS_PATH,'utf8');
  const slugPattern=`slug:\\s*["']${tool.slug}["']`;
  const objStartIdx=raw.search(new RegExp(slugPattern));
  if(objStartIdx===-1) throw new Error(`Cannot locate tool slug ${tool.slug}`);
  const afterSlug=raw.slice(objStartIdx);
  const objEndIdx=afterSlug.search(/},\s*$/m);
  if(objEndIdx===-1) throw new Error(`Cannot find object end for slug ${tool.slug}`);
  const objBlock=afterSlug.slice(0,objEndIdx+1);
  const lines=objBlock.split('\n');
  let insertIdx=lines.length-1;
  for(let i=lines.length-1;i>=0;i--){ if(/^\s*\w+:/.test(lines[i])){ insertIdx=i+1; break; } }
  const indent='  ';
  const newFields=[];
  if(enriched.pricing_breakdown && enriched.pricing_breakdown.length){
    const pricingArr=enriched.pricing_breakdown.map(p=>`${indent}  { tier: "${p.tier}", price: "${p.price}", notes: "${p.notes}" }`).join(',\n');
    newFields.push(`${indent}pricing_breakdown: [\n${pricingArr}\n${indent}],`);
  }
  if(enriched.key_capabilities && enriched.key_capabilities.length){
    const capsArr=enriched.key_capabilities.map(c=>`${indent}  "${c}"`).join(',\n');
    newFields.push(`${indent}key_capabilities: [\n${capsArr}\n${indent}],`);
  }
  if(enriched.detailed_features && enriched.detailed_features.length){
    const detArr=enriched.detailed_features.map(d=>`${indent}  "${d}"`).join(',\n');
    newFields.push(`${indent}detailed_features: [\n${detArr}\n${indent}],`);
  }
  lines.splice(insertIdx,0,...newFields);
  const newObjBlock=lines.join('\n');
  const newRaw=raw.slice(0,objStartIdx)+newObjBlock+raw.slice(objStartIdx+objBlock.length);
  fs.writeFileSync(DATA_TS_PATH,newRaw,'utf8');
}
(async()=>{
  console.log('=== Start enriching tool data ===');
  const rawData=fs.readFileSync(DATA_TS_PATH,'utf8');
  const match=rawData.match(/export\s+const\s+tools\s*=\s*\[(.*)\];/s);
  if(!match){ console.error('tools array not found'); process.exit(1); }
  const arrayStr=match[1].replace(/,\s*]/g,']').replace(/,\s*$/gm,'');
  const tools=new Function(`return [${arrayStr}];`)();
  const log={};
  for(const tool of tools){
    console.log(`Processing ${tool.name}`);
    const entry={status:'pending'}; log[tool.slug]=entry;
    if(!tool.official_url){ entry.status='skipped'; entry.reason='no official_url'; continue; }
    try{ const html=await fetchWithTimeout(tool.official_url); const $=cheerio.load(html);
      const priceRaw=extractPricing($); const pricing_breakdown=priceRaw.map((txt,idx)=>({tier: idx===0?'Primary':`Option ${idx+1}`,price: txt.replace(/\s+/g,' ').trim(),notes:''}));
      const key_capabilities=extractCapabilities($);
      const detailed_features=extractDetails($);
      writeBackToDataTs(tool,{pricing_breakdown,key_capabilities,detailed_features});
      entry.status='success'; entry.fetched={pricing:pricing_breakdown.length,capabilities:key_capabilities.length,details:detailed_features.length};
    }catch(e){ entry.status='error'; entry.error=e.message; }
    await new Promise(r=>setTimeout(r,1500));
  }
  fs.writeFileSync(LOG_PATH,JSON.stringify(log,null,2),'utf8');
  try{ const prettierConfig=await prettier.resolveConfig(DATA_TS_PATH); const formatted=prettier.format(fs.readFileSync(DATA_TS_PATH,'utf8'),{...prettierConfig,parser:'typescript'}); fs.writeFileSync(DATA_TS_PATH,formatted,'utf8'); console.log('Formatted data.ts'); }catch(e){ console.warn('Prettier failed',e.message); }
  console.log('=== Enrichment completed, log at',LOG_PATH,'===');
})();
