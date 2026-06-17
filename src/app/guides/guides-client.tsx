'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { tools } from '@/lib/data';
import { cn } from '@/lib/utils';
import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Network,
  Info,
  Eye,
  BookOpen,
  HelpCircle,
  FolderOpen,
  LayoutGrid,
  Search,
  ChevronRight
} from 'lucide-react';

import {
  CATEGORY_SECTIONS,
  ARTICLES_LIST,
  DIRECTORY_FOLDERS,
  getArchetypeMetadata,
  getLocalizedTitleAndExcerpt,
  getLocalizedTitle,
  isArticleCompatibleWithTool
} from '@/lib/guides-data';
import graphData from '@/lib/data/graph-data.json';

const cheatsheetRedirects: Record<string, string> = {
  'cross-platform cad shortcuts matrix': '/toolbox/shortcuts',
  'solidworks essential keyboard shortcuts list': '/toolbox/solidworks-shortcuts-sheet',
  'rhino 3d shortcut keys & command aliases guide': '/toolbox/rhino-shortcuts-sheet',
  'revit keyboard shortcuts & command codes table': '/toolbox/revit-shortcuts-sheet',
  'sketchup pro quick reference hotkeys cheat sheet': '/toolbox/sketchup-shortcuts-sheet',
  'autodesk inventor keyboard shortcuts reference': '/toolbox/inventor-shortcuts-sheet',
  'bentley microstation v8i keyboard shortcuts guide': '/toolbox/microstation-shortcuts-sheet',
  'graphisoft archicad keyboard shortcuts chart': '/toolbox/archicad-shortcuts-sheet',
  'dassault catia v5/v6 key shortcuts table': '/toolbox/catia-shortcuts-sheet',
  'ptc creo parametric shortcut keys reference': '/toolbox/creo-shortcuts-sheet',
  'freecad open-source cad hotkeys & mouse navigation': '/toolbox/freecad-shortcuts-sheet',
  'autodesk fusion 360 keyboard hotkeys reference': '/toolbox/fusion360-shortcuts-sheet',
  'draftsight keyboard shortcuts & command aliases': '/toolbox/draftsight-shortcuts-sheet',
  'bricscad hotkeys & command customization guide': '/toolbox/bricscad-shortcuts-sheet',
  'vectorworks keyboard shortcuts reference chart': '/toolbox/vectorworks-shortcuts-sheet',
  'autocad vs. gstarcad shortcut command diff table': '/toolbox/autocad-vs-gstarcad-shortcuts',
  'autocad vs. zwcad command shortcut diff guide': '/toolbox/autocad-vs-zwcad-shortcuts'
};

export const getProgrammaticLink = (title: string, forcedToolSlug?: string): string => {
  const titleLower = title.toLowerCase().trim();
  if (cheatsheetRedirects[titleLower]) {
    return cheatsheetRedirects[titleLower];
  }
  
  const art = ARTICLES_LIST.find(a => {
    const artTitleLower = a.title.toLowerCase().trim();
    return artTitleLower === titleLower ||
           titleLower.includes(artTitleLower) ||
           artTitleLower.includes(titleLower) ||
           a.title.toLowerCase().split(' ').some(word => word.length > 4 && titleLower.includes(word));
  });

  if (art) {
    const artIndex = art.id.split('-').pop();
    
    if (forcedToolSlug && forcedToolSlug !== 'all') {
      const forcedTool = tools.find(t => t.slug === forcedToolSlug);
      if (forcedTool) {
        const allCompatible = ARTICLES_LIST.filter(g =>
          isArticleCompatibleWithTool(g.title, g.category, forcedTool)
        );
        let safe = allCompatible.slice(0, 20);
        if (safe.length < 4) {
          const fallbackPool = ARTICLES_LIST.filter(
            g => !safe.some(existing => existing.id === g.id) &&
                 !g.title.toLowerCase().includes("license") &&
                 !g.title.toLowerCase().includes("flexlm") &&
                 !g.title.toLowerCase().includes("ssot") &&
                 !g.title.toLowerCase().includes("procurement")
          );
          safe = [...safe, ...fallbackPool].slice(0, 20);
        }
        
        const isAvailable = safe.some(g => g.id === art.id);
        if (isAvailable) {
          return `/guides/${forcedToolSlug}-${art.category}-${artIndex}`;
        }
      }
    }
    
    const matchedTool = [...tools]
      .sort((a, b) => b.slug.length - a.slug.length)
      .find(t => isArticleCompatibleWithTool(art.title, art.category, t));
      
      const fallbackSlug = matchedTool ? matchedTool.slug : (art.category === 'troubleshooting' ? 'autocad' : 'solidworks');
      return `/guides/${fallbackSlug}-${art.category}-${artIndex}`;
  }
  
  return `/guides`;
};

// D3 types
interface GraphNode {
  id: string;
  name: string;
  type: 'Tool' | 'Concept' | 'Format';
  val: number;
  color: string;
  desc?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  source: string;
  target: string;
  value: number;
}

export default function GuidesClient() {
  // Navigation View logic (matching Gstaracademy)
  const [currentView, setCurrentView] = useState<'overview' | 'graph' | 'concepts' | 'faq' | 'sitemap'>('overview');
  
  // Traditional Guide list state
  const [activeTab, setActiveTab] = useState<'all' | 'troubleshooting' | 'performance' | 'printing' | 'standards' | 'deployment' | 'migration' | 'procurement' | 'manufacturing'>('all');
  const [selectedToolSlug, setSelectedToolSlug] = useState<string>('all');
  const [openCardAccordions, setOpenCardAccordions] = useState<Record<string, boolean>>({});
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  
  // Q&A section state
  const [faqTab, setFaqTab] = useState<'all' | 'licensing' | 'performance' | 'standards'>('all');
  const [faqPage, setFaqPage] = useState<number>(1);
  const [openFaqQuestion, setOpenFaqQuestion] = useState<string | null>(null);

  // Search logic for left sidebar
  const [searchQuery, setSearchQuery] = useState('');

  // D3.js references
  const svgRef = useRef<SVGSVGElement | null>(null);
  const graphContainerRef = useRef<HTMLDivElement | null>(null);
  const [d3Loaded, setD3Loaded] = useState(false);
  const [selectedGraphNode, setSelectedGraphNode] = useState<GraphNode | null>(null);
  const [graphStats, setGraphStats] = useState({ nodes: 0, links: 0 });

  const selectedTool = tools.find(t => t.slug === selectedToolSlug) || null;
  const meta = selectedTool ? getArchetypeMetadata(selectedTool.category_id) : null;

  // Deep clone graph data to prevent D3 from mutating read-only imported JSON objects
  const { initialNodes, initialLinks } = React.useMemo(() => {
    const nodes: GraphNode[] = JSON.parse(JSON.stringify(graphData.nodes));
    const links: GraphLink[] = JSON.parse(JSON.stringify(graphData.links));
    return { initialNodes: nodes, initialLinks: links };
  }, []);

  // Sync title
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (selectedTool) {
        const industries = selectedTool.industries || [];
        const isBIM = industries.some((i: string) => /bim|architect|civil|building/i.test(i)) || selectedTool.category_id === 'bim';
        const isMechanical = industries.some((i: string) => /mechanical|mfg|automotive|aerospace/i.test(i)) || selectedTool.category_id === 'mfg';
        const isOpenSource = selectedTool.pricing_type === 'Open Source' || selectedTool.pricing_type === 'Free';

        let customTitle = `${selectedTool.name} CAD Guides & IT Deployment`;
        if (isOpenSource) {
          customTitle = `${selectedTool.name} Free Guides & Custom Configs`;
        } else if (isBIM) {
          customTitle = `${selectedTool.name} BIM Guides & Enterprise Setup`;
        } else if (isMechanical) {
          customTitle = `${selectedTool.name} 3D Specs & Workstation Tuning`;
        }

        document.title = `${customTitle} | CADGuide.tools`;
      } else {
        document.title = 'CAD Professional Guides & IT Deployment | CADGuide.tools';
      }
    }
  }, [selectedTool]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const toolParam = params.get('tool');
      if (toolParam) {
        const matched = tools.find(t => t.slug === toolParam);
        if (matched) {
          setSelectedToolSlug(toolParam);
        }
      }
    }
    setGraphStats({ nodes: initialNodes.length, links: initialLinks.length });
  }, []);



  // D3 Render logic for Tab: 'graph'
  useEffect(() => {
    if (currentView !== 'graph' || !d3Loaded || !svgRef.current || !graphContainerRef.current) return;

    const d3 = (window as any).d3;
    if (!d3) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const width = graphContainerRef.current.clientWidth || 800;
    const height = Math.max(graphContainerRef.current.clientHeight || 550, 500);

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .attr('width', '100%')
      .attr('height', '100%');

    // Add filter defs for neon glow
    const defs = svg.append('defs');
    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-30%')
      .attr('y', '-30%')
      .attr('width', '160%')
      .attr('height', '160%');

    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'blur');

    glowFilter.append('feMerge')
      .selectAll('feMergeNode')
      .data(['blur', 'SourceGraphic'])
      .join('feMergeNode')
      .attr('in', (d: any) => d);

    const g = svg.append('g');

    const zoomBehavior = d3.zoom()
      .scaleExtent([0.3, 4])
      .on('zoom', (event: any) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    const simulation = d3.forceSimulation(initialNodes)
      .force('link', d3.forceLink(initialLinks).id((d: any) => d.id).distance(110).strength(0.12))
      .force('charge', d3.forceManyBody().strength(-200).distanceMax(350))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius((d: any) => d.val + 8).strength(0.85));

    const link = g.append('g')
      .selectAll('line')
      .data(initialLinks)
      .join('line')
      .attr('class', 'graph-link')
      .attr('stroke', 'rgba(148, 163, 184, 0.25)')
      .attr('stroke-width', 1.5);

    const isTouch = typeof window !== 'undefined' && (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));

    const drag = (sim: any) => {
      function dragstarted(event: any) {
        if (!event.active) sim.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      function dragended(event: any) {
        if (!event.active) sim.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    };

    const adjList = new Map<string, Set<string>>();
    initialNodes.forEach(n => adjList.set(n.id, new Set()));
    initialLinks.forEach(e => {
      const s = typeof e.source === 'object' ? (e.source as any).id : e.source;
      const t = typeof e.target === 'object' ? (e.target as any).id : e.target;
      adjList.get(s)?.add(t);
      adjList.get(t)?.add(s);
    });

    const node = g.append('g')
      .selectAll('g')
      .data(initialNodes)
      .join('g')
      .attr('class', 'graph-node')
      .style('cursor', 'pointer');

    if (!isTouch) {
      node.call(drag(simulation));
    }

    // Node circles
    node.append('circle')
      .attr('r', (d: any) => d.val)
      .attr('fill', (d: any) => d.color)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5)
      .attr('filter', 'url(#glow)');

    // Node labels
    node.append('text')
      .text((d: any) => d.name)
      .attr('dy', (d: any) => d.val + 16)
      .attr('text-anchor', 'middle')
      .style('font-size', (d: any) => d.type === 'Tool' ? '12px' : '10px');

    // Tooltip elements
    const tooltipEl = document.getElementById('g-tooltip');
    const titleEl = document.getElementById('g-tooltip-title');
    const typeEl = document.getElementById('g-tooltip-type');
    const descEl = document.getElementById('g-tooltip-desc');

    function showDetails(event: any, d: GraphNode, element: any) {
      const neighbors = adjList.get(d.id) || new Set();
      
      // Enlarge active circle
      d3.select(element).select('circle')
        .transition()
        .duration(200)
        .attr('r', d.val + 5);

      // Fade unrelated nodes
      node.style('opacity', (n: any) => (n.id === d.id || neighbors.has(n.id) ? 1.0 : 0.15));

      // Highlight connections
      link
        .attr('stroke', (l: any) => (l.source.id === d.id || l.target.id === d.id ? '#d946ef' : 'rgba(148, 163, 184, 0.25)'))
        .attr('stroke-opacity', (l: any) => (l.source.id === d.id || l.target.id === d.id ? 0.95 : 0.03))
        .attr('stroke-width', (l: any) => (l.source.id === d.id || l.target.id === d.id ? 2.5 : 1.5))
        .attr('stroke-dasharray', (l: any) => (l.source.id === d.id || l.target.id === d.id ? null : '4,3'));

      // Draw spider web lines and dots
      g.selectAll('.spider-line').remove();
      g.selectAll('.spider-dot').remove();

      initialNodes.forEach((n: any) => {
        if (neighbors.has(n.id)) {
          // Line
          g.append('line')
            .attr('class', 'spider-line')
            .attr('x1', d.x)
            .attr('y1', d.y)
            .attr('x2', n.x)
            .attr('y2', n.y)
            .attr('stroke', n.color)
            .attr('stroke-width', 1.8)
            .attr('stroke-dasharray', '5,3')
            .attr('stroke-opacity', 0.85);

          // Mid point dot
          g.append('circle')
            .attr('class', 'spider-dot')
            .attr('cx', ((d as any).x + n.x) / 2)
            .attr('cy', ((d as any).y + n.y) / 2)
            .attr('r', 3)
            .attr('fill', n.color)
            .attr('filter', 'url(#glow)');
        }
      });

      // Populate & show tooltip
      if (tooltipEl && titleEl && typeEl && descEl) {
        titleEl.textContent = d.name;
        typeEl.textContent = d.type === 'Tool' ? 'Software Core' : d.type === 'Concept' ? 'Architectural Concept' : 'Data Format Specification';
        descEl.textContent = d.desc || '';
        tooltipEl.style.opacity = '1';
      }
    }

    function hideDetails(event: any, d: GraphNode, element: any) {
      d3.select(element).select('circle')
        .transition()
        .duration(200)
        .attr('r', d.val);

      node.style('opacity', 1.0);
      link
        .attr('stroke', 'rgba(148, 163, 184, 0.25)')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', null);

      g.selectAll('.spider-line').remove();
      g.selectAll('.spider-dot').remove();

      if (tooltipEl) {
        tooltipEl.style.opacity = '0';
      }
    }

    node.on('mouseover', (event: any, d: GraphNode) => {
      if (isTouch) return;
      showDetails(event, d, event.currentTarget);
    })
    .on('mousemove', (event: any) => {
      if (isTouch) return;
      if (tooltipEl) {
        tooltipEl.style.left = `${event.offsetX + 15}px`;
        tooltipEl.style.top = `${event.offsetY - 15}px`;
      }
    })
    .on('mouseout', (event: any, d: GraphNode) => {
      if (isTouch) return;
      hideDetails(event, d, event.currentTarget);
    })
    .on('click', (event: any, d: GraphNode) => {
      setSelectedGraphNode(d);
      showDetails(event, d, event.currentTarget);
      
      // If tool node clicked, sync sidebar selection
      if (d.type === 'Tool') {
        setSelectedToolSlug(d.id);
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.set('tool', d.id);
          window.history.pushState({}, '', url.toString());
        }
      }
      
      event.stopPropagation();
    });

    svg.on('click', () => {
      setSelectedGraphNode(null);
      if (tooltipEl) tooltipEl.style.opacity = '0';
      node.style('opacity', 1.0);
      link
        .attr('stroke', 'rgba(148, 163, 184, 0.25)')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', null);
      g.selectAll('.spider-line').remove();
      g.selectAll('.spider-dot').remove();
    });

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
    });

    const zoomIn = () => svg.transition().duration(300).call(zoomBehavior.scaleBy, 1.3);
    const zoomOut = () => svg.transition().duration(300).call(zoomBehavior.scaleBy, 0.7);
    const zoomReset = () => {
      const scale = 0.85;
      const x = width / 2 - (width / 2) * scale;
      const y = height / 2 - (height / 2) * scale;
      svg.transition().duration(600).call(
        zoomBehavior.transform,
        d3.zoomIdentity.translate(x, y).scale(scale)
      );
    };

    const btnIn = document.getElementById('g-zoom-in');
    const btnOut = document.getElementById('g-zoom-out');
    const btnReset = document.getElementById('g-zoom-reset');

    if (btnIn) btnIn.onclick = zoomIn;
    if (btnOut) btnOut.onclick = zoomOut;
    if (btnReset) btnReset.onclick = zoomReset;

    // Auto fit layout in 800ms
    const autoFitTimer = setTimeout(zoomReset, 800);

    // Stop shaking after 3s to save CPU
    const stopTimer = setTimeout(() => {
      simulation.stop();
      initialNodes.forEach((d: any) => {
        d.fx = d.x;
        d.fy = d.y;
        d.vx = 0;
        d.vy = 0;
      });
      setTimeout(() => {
        initialNodes.forEach((d: any) => {
          d.fx = null;
          d.fy = null;
        });
      }, 500);
    }, 3000);

    return () => {
      simulation.stop();
      clearTimeout(autoFitTimer);
      clearTimeout(stopTimer);
    };
  }, [currentView, d3Loaded]);

  const sortedCategorySections = React.useMemo(() => {
    if (!meta) return CATEGORY_SECTIONS;
    return [...CATEGORY_SECTIONS].sort((a, b) => {
      const indexA = meta.categoryOrder.indexOf(a.category);
      const indexB = meta.categoryOrder.indexOf(b.category);
      return indexA - indexB;
    });
  }, [meta]);

  const toggleCardAccordion = (id: string) => {
    setOpenCardAccordions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleFolder = (id: string) => {
    setOpenFolders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleFaqTabChange = (tabId: 'all' | 'licensing' | 'performance' | 'standards') => {
    setFaqTab(tabId);
    setFaqPage(1);
    setOpenFaqQuestion(null);
  };

  const isAll = activeTab === 'all';

  const safeAvailableGuides = React.useMemo(() => {
    if (!selectedTool) return [];
    
    const allCompatible = ARTICLES_LIST.filter((g) =>
      isArticleCompatibleWithTool(g.title, g.category, selectedTool)
    );
    
    let safe = allCompatible.slice(0, 20);
    if (safe.length < 4) {
      const fallbackPool = ARTICLES_LIST.filter(
        (g) =>
          !safe.some((existing) => existing.id === g.id) &&
          !g.title.toLowerCase().includes("license") &&
          !g.title.toLowerCase().includes("flexlm") &&
          !g.title.toLowerCase().includes("ssot") &&
          !g.title.toLowerCase().includes("procurement")
      );
      safe = [...safe, ...fallbackPool].slice(0, 20);
    }
    
    return safe.map((g) => {
      const localized = getLocalizedTitleAndExcerpt(g.title, g.excerpt, g.keyword, g.category, selectedTool);
      return {
        ...g,
        title: localized.title,
        excerpt: localized.excerpt,
        keyword: localized.keyword,
        slug: `${selectedTool.slug}-${g.category}-${g.id.split('-').pop()}`
      };
    });
  }, [selectedTool]);

  const accordionFaqs = [
    {
      category: 'licensing',
      q: 'How to diagnose and resolve FLEXlm Network License Error -15,10?',
      a: 'FLEXlm Error -15,10 occurs when the client machine cannot establish communication with the licensing manager server. To resolve it: 1. Ensure the server host is reachable and both the license manager port (default 27000-27009) and vendor daemon port (adskflex, default 2080) are open in all network firewalls. 2. Verify that the system environment variable ADSKFLEX_LICENSE_FILE is correctly set to @YOUR_SERVER_IP on the client machine. 3. Open the LICPATH.lic file in your AutoCAD install directory and verify the server hostname is correctly resolved to the server IP.'
    },
    {
      category: 'performance',
      q: 'How to resolve AutoCAD viewport freezes caused by Windows Registry port socket leakage?',
      a: 'High-frequency model database rebuilds or external references can cause Windows local port/socket depletion. To fix this: 1. Press Win+R, type regedit, and navigate to HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters. 2. Create a new DWORD (32-bit) Value named MaxUserPort and set its value data to 65534 (decimal) to expand the ephemeral port range. 3. Create another DWORD named TcpTimedWaitDelay and set its value to 30 (decimal) to release closed ports faster. Restart your system for changes to apply.'
    },
    {
      category: 'performance',
      q: 'How to prevent stutters and memory leakage caused by high-density hatch patterns?',
      a: 'Ultra-dense or corruption-prone hatch boundaries force AutoCAD to compute millions of lines, depleting rendering memory. To prevent crashes: 1. Type HPMAXLINES in the command bar and reduce the maximum line rendering limit (e.g., set it to 100000). 2. Use the HPMAXAREAS command to restrict the search space for hatch detection. 3. Always check for closed loop boundaries before applying hatches, and disable associative hatching if the drawing experiences recurring layout stutter.'
    },
    {
      category: 'licensing',
      q: 'How can our enterprise reduce annual CAD seat licensing costs safely?',
      a: 'Corporate offices can systematically audit named user logs to reclaim underutilized seats. Migrating general drawing groups from high-priced legacy solutions to modern, high-compatibility alternatives like BricsCAD Pro or GstarCAD can reduce licensing overhead by 50-70% while fully preserving legacy AutoLISP APIs, drawing templates, and key command shortcuts with zero retraining.'
    },
    {
      category: 'performance',
      q: 'How to debug and resolve AutoCAD Fatal Error 0x0024 crash?',
      a: 'AutoCAD Fatal Error 0x0024 is typically caused by memory block corruptions in the drawing database structure or temporary file locks. To resolve it: 1. Clean your Windows temp files by deleting everything in %TEMP%. 2. Launch AutoCAD and open the drawing using the RECOVER command to audit database blocks. 3. Run the PURGE command to clean unused blocks, registered applications (RegApps), and zero-length geometry. 4. Disable hardware acceleration temporarily via 3DCONFIG if the crash occurs during viewport rendering.'
    },
    {
      category: 'standards',
      q: 'How to fix the Secure Load Warning when running custom AutoLISP scripts?',
      a: 'Starting from AutoCAD 2014, security protocols prevent loading custom LISP routines from non-secure pathways, triggering the Secure Load Warning. To bypass this safely: 1. Type SECURELOAD in the command bar and set it to 1 (warns but loads) or 0 (loads unconditionally, not recommended for untrusted scripts). 2. Add your custom script folders to the TRUSTEDPATHS system variable via Options > Files > Trusted Locations, ensuring all enterprise custom CUIX/LISP repositories load seamlessly.'
    },
    {
      category: 'performance',
      q: 'How to prevent SolidWorks Out of Memory and system resource depletion crashes on large assemblies?',
      a: 'When working with large assemblies, SolidWorks can exhaust Windows commit charge limits even with high physical RAM. Resolve this by: 1. Navigating to Windows System Properties > Performance Settings > Advanced > Virtual Memory. 2. Uncheck \'Automatically manage paging file size for all drives\'. 3. Manually configure a custom Pagefile (Swap) size set to 1.5x to 2x your physical RAM (e.g., Min 49152MB, Max 98304MB for a 64GB RAM workstation) on your fastest NVMe SSD. Restart Windows to prevent GDI leak and memory allocation lockups.'
    },
    {
      category: 'standards',
      q: 'How to repair imported STEP/IGES broken faces and sheet knitting tolerance failures in SolidWorks?',
      a: 'Imported non-native files often contain sheet gaps due to mathematical modeler tolerance drift. To form a solid body: 1. Right-click the imported body in the FeatureManager Tree and launch Import Diagnostics to automatically detect gap boundaries and overlap faces. 2. Adjust the Heal Tolerance slider or manually run the Knit Surface command. 3. Check \'Try to form solid\' and set a custom knitting tolerance of 0.025mm to 0.1mm (do not exceed 0.25mm to avoid geometry distortion). 4. If knitting fails, delete the problematic faces and use Boundary Surface or Filled Surface to manually patch the open loop before re-knitting.'
    },
    {
      category: 'performance',
      q: 'How to eliminate SolidWorks assembly viewport stutter and graphics lag?',
      a: 'SolidWorks viewport lag is usually caused by uncertified graphics drivers or suboptimal performance options. Resolve it by: 1. Navigating to System Options > Performance, and check \'Use Software OpenGL\' to test if the graphics card driver is the bottleneck. 2. Ensure you are using certified ISV Workstation graphics drivers (NVIDIA RTX/Quadro or AMD Radeon Pro) instead of mainstream gaming drivers. 3. Open NVIDIA Control Panel, go to Manage 3D Settings, locate SolidWorks, and set Threaded Optimization to OFF and Power Management to Prefer Maximum Performance.'
    },
    {
      category: 'standards',
      q: 'How do we configure K-Factor sheet metal bend calculations in SolidWorks?',
      a: 'K-Factor is the ratio that represents the location of the neutral sheet in sheet metal bending. In SolidWorks, configuring K-Factor determines the precise flat pattern blank length. Standard reference parameters for common materials: 1. Soft Copper/Brass: K-Factor = 0.35. 2. Mild Steel/Carbon Steel: K-Factor = 0.44 to 0.45. 3. Stainless Steel: K-Factor = 0.40 to 0.42. 4. Aluminum Alloys: K-Factor = 0.50 (hard bend). Use the sheet metal bend table (Excel template) hosted on the shared server to override local calculation deviations automatically.'
    },
    {
      category: 'performance',
      q: 'How do we resolve file local cache conflicts and version lockups in SolidWorks PDM?',
      a: 'SolidWorks PDM cache lockups happen when local file versions drift from the database vault metadata, especially when working offline. To fix this: 1. Right-click the vault directory, choose \'Clear Local Cache\' to remove un-checked-out files. 2. If files remain locked, open PDM Administration, go to User Settings, and select \'Force Get Latest Version\' on drawing open. 3. Kill the PDM service processes (EdmServer.exe, ConisioAdmin.exe) via Task Manager and delete the hidden \'.lock\' metadata files in the local workspace directory.'
    },
    {
      category: 'licensing',
      q: 'What are the compliance and security risks of deploying free CAD platforms?',
      a: 'Free cloud-based CAD engines typically require all user document repositories to remain public under their free tier plans, posing extreme security risks for proprietary engineering designs. Furthermore, using educational licenses for commercial drafting constitutes a direct EULA violation, making companies highly vulnerable to vendor network telemetry audits and sudden legal watermark infections.'
    },
    {
      category: 'licensing',
      q: 'What are the legal EULA risks associated with academic watermarks inside commercial drawings?',
      a: 'Commercial distribution of files containing student watermarks can lead to immediate audit fines. B-End organizations must restrict academic seat usage to certified environments and leverage automated DWG audit scripts to sweep external vendor blocks before database commits.'
    },
    {
      category: 'standards',
      q: 'How do we automate ISO scaling pen weight standards across multi-disciplinary teams?',
      a: 'Enterprise CAD administrators can establish uniform CTB (Color-Dependent) plot styles hosted on shared network directories. Integrating standard startup scripts into the custom CUIX layout ensures drafting scales remain synchronized for every user login.'
    }
  ];

  const searchLower = searchQuery.toLowerCase().trim();
  const filteredFaqs = (faqTab === 'all' 
    ? accordionFaqs 
    : accordionFaqs.filter(f => f.category === faqTab)
  ).filter(f => 
    !searchLower || 
    f.q.toLowerCase().includes(searchLower) || 
    f.a.toLowerCase().includes(searchLower)
  );

  const FAQS_PER_PAGE = 3;
  const totalFaqPages = Math.ceil(filteredFaqs.length / FAQS_PER_PAGE);
  const displayedFaqs = filteredFaqs.slice((faqPage - 1) * FAQS_PER_PAGE, faqPage * FAQS_PER_PAGE);

  // Left Sidebar Filter Logic
  const sidebarNavItems = [
    { id: 'overview', label: 'Overview', icon: '🏛' },
    { id: 'graph', label: 'Knowledge Graph', icon: '🕸️' },
    { id: 'concepts', label: 'Concepts & Terms', icon: '🔮' },
    { id: 'faq', label: 'Technical FAQ', icon: '💬' },
    { id: 'sitemap', label: 'Folder Directory', icon: '📂' }
  ];

  const filteredSidebarItems = sidebarNavItems
    .filter(item => {
      if (process.env.NODE_ENV === 'development') {
        return item.id !== 'sitemap';
      }
      return true;
    })
    .filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <main className="min-h-screen bg-[#f7f5f0] pb-24 text-slate-800">
      <Script
        src="https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"
        strategy="lazyOnload"
        onLoad={() => setD3Loaded(true)}
      />

      {/* Decorative Visual Header Accent Line */}
      <div className={cn(
        "w-full h-1.5 bg-gradient-to-r",
        meta?.id === 'drafting-aec' && "from-slate-500 via-slate-600 to-slate-700",
        meta?.id === 'mechanical-simulation' && "from-amber-500 via-amber-600 to-amber-700",
        meta?.id === 'creative-visual' && "from-indigo-500 via-indigo-600 to-indigo-700",
        meta?.id === 'electronics-hardware' && "from-emerald-500 via-emerald-600 to-emerald-700",
        !meta && "from-blue-500 via-indigo-500 to-purple-500"
      )} />

      {/* Gstaracademy Style Layout Container */}
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 pt-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-5">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span className="text-slate-300 font-normal">/</span>
          <span className="text-slate-600">Guides & Knowledge Base</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6">
        
        {/* --- LEFT SIDEBAR (Gstaracademy Layout matching) --- */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-5">
          {/* Quick Search */}
          <Card className="p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Knowledge Base..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:bg-white transition-all text-slate-700"
              />
            </div>
          </Card>

          {/* Navigation Menu */}
          <Card className="p-2.5 rounded-2xl bg-white border border-slate-200/60 shadow-sm flex flex-col gap-1">
            <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase px-3 py-1.5">
              Knowledge Navigation
            </span>
            {filteredSidebarItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left",
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-sm">{item.icon}</span>
                    {item.label}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              );
            })}
          </Card>

          {/* Sidebar quick Software Filter */}
          <Card className="p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm space-y-2">
            <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase block">
              Active Software Focus
            </span>
            <div className="relative">
              <select
                value={selectedToolSlug}
                onChange={(e) => {
                  setSelectedToolSlug(e.target.value);
                  if (typeof window !== 'undefined') {
                    const url = new URL(window.location.href);
                    if (e.target.value === 'all') {
                      url.searchParams.delete('tool');
                    } else {
                      url.searchParams.set('tool', e.target.value);
                    }
                    window.history.pushState({}, '', url.toString());
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl pl-3 pr-8 py-2.5 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm cursor-pointer hover:bg-slate-100/50"
              >
                <option value="all">⚡ All Software</option>
                {[...tools].sort((a, b) => a.name.localeCompare(b.name)).map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400 text-[9px]">
                ▼
              </div>
            </div>
          </Card>
        </aside>

        {/* --- MAIN DISPLAY PANEL (Gstaracademy Layout matching) --- */}
        <section className="flex-grow min-w-0">
          
          {/* Sub-Navigation Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-4 mb-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'graph', label: 'Interactive Graph' },
              { id: 'concepts', label: 'Concepts & Terms' },
              { id: 'faq', label: 'Technical FAQ' },
              { id: 'sitemap', label: 'Sitemap' }
            ].filter(tab => {
              if (process.env.NODE_ENV === 'development') {
                return tab.id !== 'sitemap';
              }
              return true;
            }).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id as any)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-bold transition-all border",
                  currentView === tab.id
                    ? "bg-[#1e293b] text-white border-[#1e293b] shadow-sm"
                    : "bg-white text-slate-500 border-slate-200/80 hover:border-slate-300 hover:text-slate-800"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* VIEW A: OVERVIEW */}
          {currentView === 'overview' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              {/* Header Box */}
              <Card className="p-8 sm:p-10 rounded-[32px] bg-white border border-slate-200/50 shadow-sm text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
                <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
                  <Badge className="bg-blue-600/10 text-blue-700 border-none px-4 py-1 font-bold uppercase tracking-widest text-[9px] rounded-full">
                    Gstaracademy - Knowledge Center
                  </Badge>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                    Enterprise CAx Knowledge & Operational Center
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                    Zero introductory manuals. Direct, high-precision technical blueprints, memory tuning profiles, registry sockets, and cross-format conversion standards.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100 max-w-xl mx-auto text-center font-bold">
                  <div>
                    <span className="block text-2xl font-black text-slate-900">440+</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">Technical Terms</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-slate-900">240+</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">Software Profiles</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-slate-900">2,500+</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">Linked Guides</span>
                  </div>
                </div>
              </Card>

              {process.env.NODE_ENV === 'development' ? (
                /* Brand New Three-Column Navigation Cards for Local Dev Sandbox */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border border-slate-200/60 shadow-sm rounded-3xl p-6 bg-white hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold">
                        🌐
                      </div>
                      <h3 className="text-base font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                        Knowledge Graph
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        Explore the interactive multi-dimensional network connecting 240+ CAD/BIM software kernels, licensing parameters, and cross-format conversions.
                      </p>
                    </div>
                    <Button
                      onClick={() => setCurrentView('graph')}
                      className="w-full mt-6 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                    >
                      Open Graph
                    </Button>
                  </Card>

                  <Card className="border border-slate-200/60 shadow-sm rounded-3xl p-6 bg-white hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg font-bold">
                        🔮
                      </div>
                      <h3 className="text-base font-black text-slate-900 tracking-tight group-hover:text-purple-600 transition-colors">
                        Concepts & Index
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        Search and index technical terms, geometric cores (like Parasolid, ACIS), file schemas, and customized enterprise menus (CUIX) parameters.
                      </p>
                    </div>
                    <Button
                      onClick={() => setCurrentView('concepts')}
                      className="w-full mt-6 h-9 rounded-xl bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-xs"
                    >
                      View Concepts
                    </Button>
                  </Card>

                  <Card className="border border-slate-200/60 shadow-sm rounded-3xl p-6 bg-white hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-bold">
                        💬
                      </div>
                      <h3 className="text-base font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                        Technical FAQ
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        Quick solutions for advanced concurrent seat queue errors, workstation RAM overrides, and graphics hardware stutters.
                      </p>
                    </div>
                    <Button
                      onClick={() => setCurrentView('faq')}
                      className="w-full mt-6 h-9 rounded-xl bg-slate-100 hover:bg-slate-200/60 text-slate-700 font-bold text-xs border border-slate-200"
                    >
                      Browse FAQ
                    </Button>
                  </Card>
                </div>
              ) : (
                /* Symmetric Grid of Category sections (Production only) */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sortedCategorySections.map((p, idx) => {
                    const isCardOpen = !!openCardAccordions[p.id];
                    return (
                      <Card
                        key={p.id}
                        className="border border-slate-200/50 shadow-sm rounded-3xl p-6 sm:p-7 bg-white relative overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="relative z-10 space-y-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Section {idx + 1}
                            </span>
                            <Badge variant="outline" className="bg-slate-50 text-slate-500 text-[8px] font-bold border-slate-100 uppercase tracking-wide">
                              {p.countLabel}
                            </Badge>
                          </div>
                          
                          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                            <span className={`w-1 h-5 rounded-full bg-gradient-to-b ${p.gradient}`} />
                            {p.title}
                          </h3>
                          
                          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                            {p.desc}
                          </p>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {p.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-[9px] font-bold bg-slate-50 border border-slate-150 text-slate-400 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <button
                              onClick={() => toggleCardAccordion(p.id)}
                              className="text-xs font-black uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              {isCardOpen ? 'Collapse Guides ▲' : 'Unfold Guides ▼'}
                            </button>
                          </div>

                          {/* Unfolded links */}
                          <div className={cn(
                            "transition-all duration-300 ease-in-out overflow-hidden space-y-3",
                            isCardOpen ? "max-h-[500px] pt-4 border-t border-slate-100 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                          )}>
                            {process.env.NODE_ENV === 'development' ? (
                              <div className="text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-center select-none">
                                🔒 Guides hidden in Local Dev (30-Day Plan Sandbox)
                              </div>
                            ) : selectedTool ? (
                              safeAvailableGuides.filter(art => art.category === p.category).length > 0 ? (
                                <ul className="space-y-2.5 text-xs">
                                  {safeAvailableGuides
                                    .filter(art => art.category === p.category)
                                    .map((art) => (
                                      <li key={art.title} className="flex items-start gap-1.5">
                                        <span className="text-blue-500 font-bold shrink-0 mt-0.5">→</span>
                                        <Link href={`/guides/${art.slug}`} className="font-bold text-slate-700 hover:text-blue-600 hover:underline">
                                          {art.title}
                                        </Link>
                                      </li>
                                    ))}
                                </ul>
                              ) : (
                                <span className="text-[10px] text-slate-400 block italic">No specific guides for {selectedTool.name} in this section.</span>
                              )
                            ) : (
                              <ul className="space-y-2.5 text-xs">
                                {ARTICLES_LIST.filter(a => a.category === p.category).slice(0, 4).map((art) => {
                                  const slug = `${art.softwareSlug}-${art.category}-${art.id.split('-').pop()}`;
                                  return (
                                    <li key={art.title} className="flex items-start gap-1.5">
                                      <span className="text-blue-500 font-bold shrink-0">→</span>
                                      <Link href={`/guides/${slug}`} className="font-bold text-slate-700 hover:text-blue-600 hover:underline">
                                        {art.title}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW B: INTERACTIVE GRAPH */}
          {currentView === 'graph' && (
            <div
              ref={graphContainerRef}
              className="relative w-full h-[550px] bg-[#0f172a] border border-slate-800/80 rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in duration-300 flex flex-col md:flex-row"
              style={{
                boxShadow: 'inset 0 0 80px rgba(0, 0, 0, 0.6)'
              }}
            >
              {/* Background Grid Accent */}
              <div
                className="absolute inset-0 pointer-events-none opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #020617 100%)',
                  backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1.2px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Canvas Area */}
              <div className="flex-grow h-full w-full relative z-10">
                {!d3Loaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 z-20 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                      <Network className="w-8 h-8 text-blue-400 animate-pulse" />
                      <span className="text-xs font-bold text-slate-500">Loading Interactive Canvas...</span>
                    </div>
                  </div>
                )}
                
                {/* Graph Floating Stats */}
                <div className="absolute top-4 left-4 z-10 pointer-events-none select-none">
                  <h3 className="text-sm font-black text-slate-200 flex items-center gap-1.5 drop-shadow-md">
                    <Network className="w-4 h-4 text-blue-400 animate-pulse" />
                    Interactive CAx Knowledge Map
                  </h3>
                  <span className="text-[9px] font-mono text-slate-500 block mt-0.5">
                    {graphStats.nodes} nodes · {graphStats.links} dynamic constraints
                  </span>
                </div>

                {/* Canvas zoom console */}
                <div className="absolute top-4 right-4 z-10 flex gap-1.5">
                  <Button
                    id="g-zoom-in"
                    size="icon"
                    variant="outline"
                    className="w-8 h-8 rounded-lg bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/80 hover:text-white backdrop-blur-md transition-all shadow-md"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    id="g-zoom-out"
                    size="icon"
                    variant="outline"
                    className="w-8 h-8 rounded-lg bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/80 hover:text-white backdrop-blur-md transition-all shadow-md"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    id="g-zoom-reset"
                    size="icon"
                    variant="outline"
                    className="w-8 h-8 rounded-lg bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/80 hover:text-white backdrop-blur-md transition-all shadow-md"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <svg ref={svgRef} className="w-full h-full block" />

                {/* Canvas legend */}
                <div className="absolute bottom-4 left-4 z-10 bg-slate-900/70 backdrop-blur-md border border-slate-800/50 rounded-lg p-2.5 shadow-lg space-y-1.5">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#38bdf8] shadow-[0_0_6px_#38bdf8]" /> Tool
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#c084fc] shadow-[0_0_6px_#c084fc]" /> Concept
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#fbbf24] shadow-[0_0_6px_#fbbf24]" /> Format
                    </div>
                  </div>
                </div>

                {/* Interactive Hover Tooltip */}
                <div
                  id="g-tooltip"
                  className="absolute pointer-events-none opacity-0 transition-opacity duration-200 bg-slate-950/90 border border-slate-800 rounded-xl p-3 max-w-[260px] shadow-2xl z-30 backdrop-blur-md text-xs text-slate-300"
                  style={{
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <div id="g-tooltip-title" className="font-black text-sm text-white mb-0.5" />
                  <div id="g-tooltip-type" className="text-[9px] font-black uppercase tracking-wider text-purple-400 mb-2" />
                  <div id="g-tooltip-desc" className="leading-relaxed text-slate-400 font-medium" />
                </div>
              </div>

              {/* Canvas Info Sidebar Drawer */}
              <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-900/40 p-5 shrink-0 z-10 flex flex-col justify-between backdrop-blur-md">
                {selectedGraphNode ? (
                  <div className="flex flex-col h-full justify-between animate-in fade-in duration-300">
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        selectedGraphNode.type === 'Tool' ? 'bg-blue-950/50 text-blue-400 border border-blue-900/50' :
                        selectedGraphNode.type === 'Concept' ? 'bg-purple-950/50 text-purple-400 border border-purple-900/50' :
                        'bg-amber-950/50 text-amber-400 border border-amber-900/50'
                      }`}>
                        {selectedGraphNode.type}
                      </span>
                      <h4 className="text-base font-black text-white mt-2 drop-shadow-md">{selectedGraphNode.name}</h4>
                      <p className="text-xs text-slate-400 mt-3 leading-relaxed font-medium">
                        {selectedGraphNode.desc || 'This node maps standard CAx engineering interconnections. Double click or tap specs button to inspect associated EULA auditing and file formats.'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800 mt-4 space-y-2">
                      {selectedGraphNode.type === 'Tool' ? (
                        <>
                          <Button
                            className="w-full h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-blue-950"
                            onClick={() => {
                              setSelectedToolSlug(selectedGraphNode.id);
                              if (typeof window !== 'undefined') {
                                const url = new URL(window.location.href);
                                url.searchParams.set('tool', selectedGraphNode.id);
                                window.history.pushState({}, '', url.toString());
                              }
                              if (process.env.NODE_ENV !== 'development') {
                                setCurrentView('overview');
                              }
                            }}
                          >
                            <Eye className="w-3.5 h-3.5" /> {process.env.NODE_ENV === 'development' ? 'Focus Software' : 'Filter Guides'}
                          </Button>
                          <Button
                            className="w-full h-9 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs flex items-center justify-center gap-1 border border-slate-700 shadow-sm"
                            onClick={() => {
                              setSearchQuery(selectedGraphNode.name);
                              setFaqTab('all');
                              setFaqPage(1);
                              setCurrentView('faq');
                            }}
                          >
                            <BookOpen className="w-3.5 h-3.5" /> View FAQs
                          </Button>
                        </>
                      ) : (() => {
                        const troubleFaqMap: Record<string, string> = {
                          'error-0024': 'How to debug and resolve AutoCAD Fatal Error 0x0024 crash?',
                          'sw-pdm': 'How do we resolve file local cache conflicts and version lockups in SolidWorks PDM?',
                          'viewport-lag': 'How to eliminate SolidWorks assembly viewport stutter and graphics lag?',
                          'flexlm-15': 'How to diagnose and resolve FLEXlm Network License Error -15,10?',
                          'registry-socket': 'How to resolve AutoCAD viewport freezes caused by Windows Registry port socket leakage?',
                          'hatch-leak': 'How to prevent stutters and memory leakage caused by high-density hatch patterns?',
                          'sw-swap': 'How to prevent SolidWorks Out of Memory and system resource depletion crashes on large assemblies?',
                          'parasolid-knit': 'How to repair imported STEP/IGES broken faces and sheet knitting tolerance failures in SolidWorks?'
                        };
                        const targetFaqQ = troubleFaqMap[selectedGraphNode.id];
                        if (targetFaqQ) {
                          return (
                            <Button
                              className="w-full h-9 rounded-lg bg-red-650 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-red-950 border border-red-800"
                              onClick={() => {
                                setOpenFaqQuestion(targetFaqQ);
                                setSearchQuery('');
                                const matchedFaq = accordionFaqs.find(f => f.q === targetFaqQ);
                                if (matchedFaq) {
                                  setFaqTab(matchedFaq.category as any);
                                }
                                setFaqPage(1);
                                setCurrentView('faq');
                              }}
                            >
                              <HelpCircle className="w-3.5 h-3.5" /> View Solution
                            </Button>
                          );
                        }
                        return (
                          <Button
                            className="w-full h-9 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center gap-1 border border-slate-700 shadow-sm"
                            onClick={() => {
                              setSearchQuery(selectedGraphNode.name);
                              setCurrentView('concepts');
                            }}
                          >
                            <Eye className="w-3.5 h-3.5" /> Search Concept
                          </Button>
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-6 select-none">
                    <div className="w-10 h-10 rounded-xl bg-slate-850/80 border border-slate-800 flex items-center justify-center text-slate-500 mb-3 animate-pulse">
                      <Network className="w-5 h-5 text-blue-400/80" />
                    </div>
                    <h5 className="text-xs font-bold text-slate-300">Inspection Deck</h5>
                    <p className="text-[10px] text-slate-550 mt-1 max-w-[150px] leading-relaxed font-medium">
                      Click any graphical hub to populate technical compatibility, FlexNet OPTIONS restrictions, and licenses.
                    </p>
                  </div>
                )}
              </div>

              {/* Embed CSS style block for graph filters, glow and outlines */}
              <style dangerouslySetInnerHTML={{ __html: `
                .graph-node circle {
                  cursor: pointer;
                  transition: r 0.25s cubic-bezier(0.4, 0, 0.2, 1), stroke-width 0.25s ease;
                }
                .graph-node:hover circle {
                  stroke-width: 2px !important;
                }
                .graph-node text {
                  fill: #f1f5f9;
                  stroke: #090d16;
                  stroke-width: 4px;
                  stroke-linecap: round;
                  stroke-linejoin: round;
                  paint-order: stroke fill;
                  font-family: ui-sans-serif, system-ui, sans-serif;
                  font-weight: 800;
                  letter-spacing: -0.2px;
                  pointer-events: none;
                  user-select: none;
                }
                .graph-link {
                  transition: stroke 0.2s ease, stroke-width 0.2s ease, stroke-opacity 0.2s ease;
                }
              `}} />
            </div>
          )}

          {/* VIEW C: CONCEPTS & TERMS */}
          {currentView === 'concepts' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <Card className="p-6 rounded-2xl bg-white border border-slate-200/50 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-5 rounded bg-emerald-500" />
                  Core Concepts & Standards Index
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {initialNodes.filter(n => n.type !== 'Tool').map((node) => (
                    <div key={node.id} className="p-3 bg-slate-50 hover:bg-emerald-50/30 border border-slate-100 hover:border-emerald-200 rounded-xl transition-all group">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800 group-hover:text-emerald-700">{node.name}</span>
                        <span className="text-[8px] bg-slate-200/50 px-1.5 py-0.5 rounded text-slate-500 font-bold uppercase tracking-wider">
                          {node.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* VIEW D: TECHNICAL FAQ */}
          {currentView === 'faq' && (
            <section className="space-y-6 animate-in fade-in duration-300">
              <Card className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm">
                <div className="flex flex-wrap items-center justify-center gap-1.5 border-b border-slate-200 pb-5 max-w-2xl mx-auto">
                  {[
                    { id: 'all', label: 'All Operations' },
                    { id: 'licensing', label: 'Licensing & SAM' },
                    { id: 'performance', label: 'Workstation Speed' },
                    { id: 'standards', label: 'Standards & API' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleFaqTabChange(tab.id as Parameters<typeof handleFaqTabChange>[0])}
                      className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                        faqTab === tab.id
                          ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-md shadow-slate-100 scale-[1.02]'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-4 mt-6">
                  {displayedFaqs.map((faq) => {
                    const isOpen = openFaqQuestion === faq.q;
                    return (
                      <div key={faq.q} className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-sm">
                        <button
                          onClick={() => setOpenFaqQuestion(isOpen ? null : faq.q)}
                          className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50/50 transition-colors gap-4"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[8px] font-black uppercase tracking-[0.15em] bg-indigo-50 text-indigo-600 border border-indigo-100/50 px-2 py-0.5 rounded-md shrink-0">
                              {faq.category === 'licensing' ? 'Licensing & SAM' : faq.category === 'performance' ? 'Performance' : 'Standards'}
                            </span>
                            <span>{faq.q}</span>
                          </div>
                          <span className={cn("transform transition-transform text-indigo-600 text-xs shrink-0", isOpen ? "rotate-180" : "")}>
                            ▼
                          </span>
                        </button>
                        <div className={cn("transition-all duration-300 ease-in-out overflow-hidden border-t border-slate-100 bg-slate-50/30", isOpen ? "max-h-96 p-4 opacity-100" : "max-h-0 p-0 opacity-0 pointer-events-none")}>
                          <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-medium">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </section>
          )}

          {/* VIEW E: SITEMAP */}
          {currentView === 'sitemap' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <Card className="p-6 rounded-2xl bg-white border border-slate-200/50 shadow-sm space-y-4">
                {DIRECTORY_FOLDERS.map((folder) => {
                  const isOpen = !!openFolders[folder.id];
                  return (
                    <div key={folder.id} className="border border-slate-150 rounded-xl overflow-hidden bg-white shadow-sm">
                      <button
                        onClick={() => toggleFolder(folder.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/50 transition-colors"
                      >
                        <span className="flex items-center gap-2 text-xs font-bold text-slate-800">
                          <span>{folder.icon}</span> {folder.title}
                        </span>
                        <span className="text-xs text-slate-400">▶</span>
                      </button>
                      <div className={cn("overflow-hidden transition-all duration-300", isOpen ? "max-h-[800px] p-4 border-t border-slate-100 bg-slate-55/10" : "max-h-0 p-0")}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {folder.links.map((link, lIdx) => (
                            <Link key={lIdx} href={folder.id === 'fol-cheatsheets' ? link.href : getProgrammaticLink(link.title, selectedTool?.slug)} className="hover:text-blue-600 hover:underline font-bold text-slate-700">
                              → {link.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Card>
            </div>
          )}

        </section>
      </div>
      </div>
    </main>
  );
}
