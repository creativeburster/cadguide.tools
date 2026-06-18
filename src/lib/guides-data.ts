import { Tool } from '@/lib/data';

export interface GuideCategorySection {
  id: string;
  category: 'troubleshooting' | 'performance' | 'printing' | 'standards' | 'deployment' | 'migration' | 'procurement' | 'manufacturing';
  title: string;
  desc: string;
  countLabel: string;
  gradient: string;
  articles: { title: string; slug: string; keyword: string }[];
  tags: string[];
}

export const CATEGORY_SECTIONS: GuideCategorySection[] = [
  {
    id: 'sec-pro',
    category: 'procurement',
    title: 'CAD Procurement & Licensing TCO',
    desc: 'Navigate enterprise CAD budgeting, cost curves, and Perpetual licensing alternatives.',
    countLabel: '1 Active Guide',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-500',
    articles: [
      { title: 'AutoCAD LT vs. AutoCAD Pro: Complete Procurement & TCO Cost Guide (With 100% Compatible Alternatives)', slug: 'autocad-lt-vs-pro-procurement-tco', keyword: 'autocad lt price' }
    ],
    tags: ['#TCO-Analysis', '#CAD-Cost', '#BricsCAD-Alternative']
  },
  {
    id: 'sec-stand',
    category: 'standards',
    title: 'Platform Compatibility & Standards',
    desc: 'Deploy and optimize CAD software across macOS, Linux, and Web environments.',
    countLabel: '1 Active Guide',
    gradient: 'from-blue-500 via-indigo-600 to-violet-500',
    articles: [
      { title: 'How to Run AutoCAD on macOS, Linux, and Web: The Ultimate Cross-Platform Compatibility Guide', slug: 'how-to-run-autocad-on-mac-linux-web', keyword: 'autocad for mac' }
    ],
    tags: ['#Mac-CAD', '#Linux-CAD', '#AutoCAD-Web']
  },
  {
    id: 'sec-perf',
    category: 'performance',
    title: 'Legacy Performance Speed Tuning',
    desc: 'Configure modern heavy CAD platforms to launch and render optimally on low-end hardware.',
    countLabel: '1 Active Guide',
    gradient: 'from-amber-500 via-orange-600 to-yellow-500',
    articles: [
      { title: 'Why Engineers Still Search for AutoCAD 2007: Performance Optimizations for Legacy & Low-End Workstations', slug: 'why-engineers-use-autocad-2007-speed-tuning', keyword: 'autocad 2007' }
    ],
    tags: ['#LegacyTuning', '#RAM-Optimization', '#Speed-Boost']
  },
  {
    id: 'sec-trouble',
    category: 'troubleshooting',
    title: 'Enterprise Troubleshooting & Licensing',
    desc: 'Diagnose fatal address freezes, FLEXlm port server conflicts, and registry socket locks.',
    countLabel: '1 Active Guide',
    gradient: 'from-rose-500 via-pink-600 to-red-500',
    articles: [
      { title: 'Enterprise Troubleshooting Blueprint: Fixing AutoCAD Fatal Errors & FLEXlm Network License Failures', slug: 'fixing-autocad-fatal-errors-flexlm-licensing', keyword: 'flexlm error -15' }
    ],
    tags: ['#FLEXlm-Error-15', '#FatalError-0x0024', '#RegistryTuning']
  }
];

export interface GuideArticleCard {
  id: string;
  category: 'troubleshooting' | 'performance' | 'printing' | 'standards' | 'deployment' | 'migration' | 'procurement' | 'manufacturing';
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  date: string;
  softwareSlug: string;
  keyword: string;
  slug: string;
  contentMarkdown?: string;
}

// 4 篇真实的、硬编码的文章数据库，包含官网深度学习和重新结构化输出的正文内容
export const ARTICLES_LIST: GuideArticleCard[] = [
  {
    id: 'art-proc-tco',
    category: 'procurement',
    title: 'AutoCAD LT vs. AutoCAD Pro: Complete Procurement & TCO Cost Guide (With 100% Compatible Alternatives)',
    excerpt: 'An expert procurement guide comparing AutoCAD LT vs. Pro pricing, EULA licenses, 3-year TCO cost metrics, and recommending high-compatibility perpetual alternatives like BricsCAD and GstarCAD.',
    author: 'Will P. (Enterprise CAD Auditor)',
    readTime: '6 min read',
    date: 'June 2026',
    softwareSlug: 'autocad',
    keyword: 'autocad lt price',
    slug: 'autocad-lt-vs-pro-procurement-tco',
    contentMarkdown: `### 1. Cost Overview: The Subscription Pricing Gap
AutoCAD Pro is currently priced at approximately **$1,950 per year** (or $245 monthly) for a single named-user subscription. Conversely, AutoCAD LT (Lightweight) is offered at roughly **$490 per year** ($60 monthly). For B-End procurement managers, this represents a massive **400% price premium** to deploy the Pro version across engineering teams.

### 2. Feature Comparison & Technical Limitations
While AutoCAD LT shares the identical drawing editor and produces native .DWG formats, Autodesk enforces strict feature lockouts on the LT version to protect Pro seats:
- **No 3D Modeling/Editing**: LT can only read and view 3D solids; it cannot model extrusions, boundary surfaces, or boolean solids.
- **AutoLISP Restrictions (Pre-2024)**: Legacy versions of AutoCAD LT completely blocked AutoLISP (\`.lsp\`) automation. *Note: Starting with AutoCAD LT 2024, basic LISP is supported, but advanced VLA/VLX compiled routines remain limited.*
- **FLEXlm Concurrent Licensing**: AutoCAD LT does not support floating network license pools, forcing organizations to manage complex individual Autodesk SSO named-user logins for every casual draftsman.

### 3. Three-Year Cumulative Total Cost of Ownership (TCO)
When forecasting budgets for an architectural or engineering office of 25 designers, the subscription compounding effect creates huge financial overheads:

| Metric | AutoCAD Pro Subscription | AutoCAD LT Subscription | Perpetual Alternative (e.g., GstarCAD/BricsCAD) |
| :--- | :--- | :--- | :--- |
| **Year 1 Cost** | $48,750 | $12,250 | $22,500 (Initial buyout) |
| **Year 2 Cost** | $48,750 | $12,250 | $4,500 (Maintenance upgrade optional) |
| **Year 3 Cost** | $48,750 | $12,250 | $4,500 (Maintenance upgrade optional) |
| **3-Year TCO** | **$146,250** | **$36,750** | **$31,500 (Fully Owned)** |

### 4. High-Compatibility Alternatives Evaluation (BricsCAD & GstarCAD)
To mitigate these SaaS subscription burdens, procurement officers can strategically deploy high-compatibility perpetual alternatives for general drafting slots:
- **GstarCAD Pro**: Available as a perpetual buyout (typically under $900). It supports 100% native AutoLISP/VLA APIs, identical command shortcuts (PGP), and loads drawing templates (DWT) with zero retraining.
- **BricsCAD Pro**: A premium powerhouse featuring advanced BIM and mechanical parametric modeling. It executes AutoLISP routines up to 1.5x faster than AutoCAD and integrates seamlessly with existing LISP workflows.

### 5. Transition Recommendation
1. Audit your team's software usage: restrict AutoCAD Pro licenses solely to 3D designers and specialists.
2. Reclaim underutilized AutoCAD Pro seats and replace them with AutoCAD LT for pure 2D annotators.
3. For general-purpose layout, site planning, and LISP-driven drafting teams, migrate to GstarCAD or BricsCAD. This hybrid strategy reduces corporate CAD licensing overheads by **50% to 70%** without sacrificing drawing quality.`
  },
  {
    id: 'art-compat-cross',
    category: 'standards',
    title: 'How to Run AutoCAD on macOS, Linux, and Web: The Ultimate Cross-Platform Compatibility Guide',
    excerpt: 'Learn how to deploy and optimize AutoCAD on macOS (M1/M2/M3 Apple Silicon), run AutoCAD on Linux workstations using Wine, and leverage the cloud-based AutoCAD Web app.',
    author: 'Will P. (BIM Architect)',
    readTime: '7 min read',
    date: 'June 2026',
    softwareSlug: 'autocad',
    keyword: 'autocad for mac',
    slug: 'how-to-run-autocad-on-mac-linux-web',
    contentMarkdown: `### 1. macOS Deployment: Tuning for Apple Silicon (M1/M2/M3)
Autodesk offers a native version of AutoCAD for Mac, redesigned to run natively on Apple Silicon. To optimize performance on Apple Silicon workstations:
- **VRAM Allocation**: In Apple Silicon's unified memory architecture, system RAM is shared with the GPU. For large building blueprints, a minimum of 16GB unified memory is recommended to prevent system swapping.
- **Shortcut Key Translation**: The Mac version maps standard Windows control binds to CMD (e.g., \`Cmd+C\` instead of \`Ctrl+C\`). If you prefer the classic layout, navigate to *Preferences > User Preferences > Keyboard* and check "Use Windows Shortcut Keys".

### 2. Linux Workstations: Running AutoCAD via Wine Emulator
Autodesk does not publish a native Linux build of AutoCAD. However, Linux sysadmins can run AutoCAD (specifically stable legacy versions like 2020) utilizing Wine/Proton compatibility layers:
- **Prerequisites**: Install Wine-Staging and configure a clean 64-bit Wine prefix:
  \`\`\`bash
  export WINEPREFIX=~/.autocad64
  winecfg
  \`\`\`
- **Winetricks Dependencies**: AutoCAD requires specific Windows libraries to load the interface and handle database blocks:
  \`\`\`bash
  winetricks dotnet48 gdiplus msxml6 vcrun2017 corefonts
  \`\`\`
- **Graphics Override**: Force Wine to bind to Vulkan or OpenGL via the registry to eliminate viewport redraw stutters.

### 3. AutoCAD Web App: Cloud-Based View & Collaboration
For engineers in the field who cannot install heavy desktop applications, the AutoCAD Web App offers a lightweight, browser-based DWG editor:
- **Browser Acceleration**: Ensure WebGL is fully enabled in your browser settings (Chrome/Edge are recommended).
- **File Limits**: Keep DWG file sizes below **50MB** to ensure smooth pan and zoom performance within the browser's sandbox memory bounds.
- **External References (XREFs)**: Store XREF folders in linked cloud services (OneDrive, Google Drive, Autodesk Docs) to preserve cross-drawing link integrity.`
  },
  {
    id: 'art-legacy-2007',
    category: 'performance',
    title: 'Why Engineers Still Search for AutoCAD 2007: Performance Optimizations for Legacy & Low-End Workstations',
    excerpt: 'Deconstruct the lightning-fast launch speed of AutoCAD 2007 and configure modern AutoCAD (2024+) to run optimally on low-end hardware by disabling ribbon bloat and telemetry.',
    author: 'Will P. (Hardware Specialist)',
    readTime: '5 min read',
    date: 'June 2026',
    softwareSlug: 'autocad',
    keyword: 'autocad 2007',
    slug: 'why-engineers-use-autocad-2007-speed-tuning',
    contentMarkdown: `### 1. The AutoCAD 2007 Secret: Zero Overhead
AutoCAD 2007 is legendary in the CAD community for starting in **under 1 second** and handling massive drawings smoothly on hardware from two decades ago. The reason is simple: it was written using native Win32 GDI graphics calls, with zero dependency on heavy .NET Frameworks, Chromium Embedded Framework (CEF) viewport wrappers, or background licensing telemetry services.

### 2. Tuning Modern AutoCAD (2024+) for Legacy Performance
If you are forced to run modern AutoCAD builds on mid-range or low-end office laptops, you can modify specific internal system variables to strip out visual bloat and recover 2007-level responsiveness:

- **Disable the Ribbon Interface**: The Ribbon interface consumes significant memory. Close it and return to classic toolbar layouts:
  \`\`\`text
  Command: RIBBONCLOSE
  \`\`\`
- **Disable Viewport Animations**: Prevent AutoCAD from smoothly fading or animating zooms, which strains older graphics chips:
  \`\`\`text
  Command: VTENABLE -> Set to 0
  \`\`\`
- **Turn Off Selection Previewing**: Stops the engine from constantly calculating object boundaries when the cursor hovers over lines:
  \`\`\`text
  Command: SELECTIONPREVIEW -> Set to 0
  \`\`\`
- **Turn Off Quick Properties**: Prevents pop-up inspector boxes from freezing the cursor:
  \`\`\`text
  Command: QPMODE -> Set to 0
  \`\`\`

### 3. Enterprise Telemetry Opt-Out (Eliminating Licensing Lag)
Modern Autodesk applications launch slowly because they check named-user cloud licenses and send usage telemetry. IT administrators can block these background pings in the local hosts file (\`C:\\Windows\\System32\\drivers\\etc\\hosts\`) to force offline mode and accelerate application launch:
\`\`\`text
127.0.0.1 genuine-software.autodesk.com
127.0.0.1 ipm-aem.autodesk.com
127.0.0.1 telemetry.autodesk.com
\`\`\``
  },
  {
    id: 'art-trouble-blueprint',
    category: 'troubleshooting',
    title: 'Enterprise Troubleshooting Blueprint: Fixing AutoCAD Fatal Errors & FLEXlm Network License Failures',
    excerpt: 'An industrial troubleshooting playbook for resolving AutoCAD licensing failed notifications, FLEXlm network server port bindings, and Fatal Error 0x0024 viewport crashes.',
    author: 'Will P. (Enterprise IT Lead)',
    readTime: '8 min read',
    date: 'June 2026',
    softwareSlug: 'autocad',
    keyword: 'flexlm error -15',
    slug: 'fixing-autocad-fatal-errors-flexlm-licensing',
    contentMarkdown: `### 1. Resolving FLEXlm License Server Manager Errors (-15,10)
FLEXlm concurrent network seat deployment is highly prone to network port blockages. The classic error **-15,10** indicates the client machine cannot reach the server manager port.

- **Check Server Status via lmutil**: Run the diagnostic command in the server installation directory:
  \`\`\`text
  lmutil lmstat -a -c @YOUR_SERVER_IP
  \`\`\`
- **Firewall Rules**: Open both required ports in the Windows Server firewall:
  - **Lmgrd Port**: Standard default port ranges are \`27000\` through \`27009\` (TCP).
  - **Vendor Daemon Port (adskflex)**: Typically binds dynamically. Force bind it to port \`2080\` in the license file to allow firewalls to lock it:
    \`\`\`text
    SERVER server_hostname 001122334455 27000
    VENDOR adskflex port=2080
    \`\`\`
- **Client Configuration**: Configure the system environment variable \`ADSKFLEX_LICENSE_FILE\` to \`@YOUR_SERVER_IP\` on client workstations.

### 2. Windows Registry Ephemeral Port Leak (Viewport Freezes)
Under high-volume multi-user drawing environments, AutoCAD can leak sockets, exhausting Windows temporary TCP ports. This results in sudden application freezes during drawing opens.
- **Remediation**: Expand the ephemeral port limits in the Windows Registry:
  1. Open Registry Editor (\`regedit\`) and locate the parameters pathway:
     \`\`\`text
     HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters
     \`\`\`
  2. Create a new DWORD (32-bit) Value named **\`MaxUserPort\`** and set it to **\`65534\`** (Decimal).
  3. Create another DWORD named **\`TcpTimedWaitDelay\`** and set it to **\`30\`** (Decimal).
  4. Reboot the machine to flush socket tables.

### 3. Hatch Pattern Viewport Memory Leak
Highly complex drawing imports containing overlapping or dense hatch boundaries often freeze AutoCAD viewport redraws:
- **Solution**: Open the problematic drawing and restrict hatch generation limits:
  \`\`\`text
  Command: HPMAXLINES -> Set to 100000 (limits maximum visible line redraws)
  Command: HPMAXAREAS -> Set to 500 (restricts boundary analysis area)
  \`\`\`
- Use the classic \`RECOVER\` command to clean and rebuild database blocks before reloading.`
  }
];

// Stub exports to maintain compatibility with other pages
export const DIRECTORY_FOLDERS = [
  {
    id: 'fol-autocad',
    title: 'AutoCAD Troubleshooting & Procurement',
    countLabel: '4 Guides',
    icon: '🔧',
    links: ARTICLES_LIST.map(a => ({ title: a.title, href: `/guides/${a.slug}` }))
  }
];

export const RENDER_VISUAL_SLUGS = ['blender', 'keyshot', 'v-ray'];
export const SIMULATION_ANALYSIS_SLUGS = ['ansys-fluent'];

export function getArchetypeMetadata(category_id: string, tool?: Tool) {
  return {
    id: 'drafting-aec' as string,
    name: 'AEC & Drafting',
    theme: {
      accentText: 'text-slate-700',
      badgeBg: 'bg-slate-50 border-slate-200 text-slate-800',
      buttonBg: 'bg-slate-700 hover:bg-slate-800 border-slate-700',
      gradientHeader: 'from-slate-700 via-slate-800 to-zinc-900',
      cardBorder: 'hover:border-slate-300'
    },
    categoryOrder: ['troubleshooting', 'performance', 'standards', 'procurement'],
    jargonMap: {}
  };
}

export function getLocalizedTitleAndExcerpt(title: string, excerpt: string, keyword: string, category: string, tool: Tool) {
  return { title, excerpt, keyword };
}

export function getLocalizedTitle(title: string, category: string, tool: Tool): string {
  return title;
}

export function isArticleCompatibleWithTool(articleTitle: string, articleCategory: string, tool: Tool): boolean {
  // Only allow our AutoCAD guides for the autocad tool to avoid cross-product pollution
  if (tool.slug !== 'autocad') {
    return false;
  }
  return true;
}
