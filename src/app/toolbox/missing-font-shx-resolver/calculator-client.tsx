'use client';

import { useState } from 'react';
import { NewsletterSubscribe } from '@/components/newsletter-subscribe';

interface FontMapping {
  name: string;
  source: string;
  type: 'SHX 中文大字体' | 'SHX 西文普通字体' | 'SHX 符号及钢筋字体' | 'TrueType 操作系统字体';
  suggestedAlt: string;
  explanation: string;
  command: string; // FONTALT assignment command
  fmpEntry: string; // Mapping entry for acad.fmp
}

const FONTS_REGISTRY: FontMapping[] = [
  {
    name: 'HZTXT',
    source: '国内最经典的单线中文仿宋大字体',
    type: 'SHX 中文大字体',
    suggestedAlt: 'hztxt.shx 或 gbcbig.shx',
    explanation: 'HZTXT 是早期国内各大设计院广泛流通的中文字体, 常用于多行文字及单线表格填写. 若本地缺失, 在没有特殊符号的情况下, 用 AutoCAD 默认自带的国标大字体 (gbcbig.shx) 替代可以 100% 避免乱码. ',
    command: '(setvar "FONTALT" "gbcbig.shx")',
    fmpEntry: 'hztxt;gbcbig.shx',
  },
  {
    name: 'TSSDENG',
    source: '探索者结构设计软件 (TSSD) 西文符号字体',
    type: 'SHX 符号及钢筋字体',
    suggestedAlt: 'tssdeng.shx (建议从旧版探索者复制或使用标准符号库)',
    explanation: '探索者系列字体中内置了大量的钢筋级别特殊符号 (如一级钢, 二级钢, 三级钢符号, 对应字符为 %%130 - %%133) . 如果直接使用 simplex.shx 替代, 钢筋符号会变成空白或问号. 必须使用支持对应编码的 tssdeng.shx 替代. ',
    command: '(setvar "FONTALT" "tssdeng.shx")',
    fmpEntry: 'tssdeng;gbcbig.shx', // fall back if tssdeng is not installed
  },
  {
    name: 'TSSDCHN',
    source: '探索者结构设计软件 (TSSD) 中文大字体',
    type: 'SHX 中文大字体',
    suggestedAlt: 'gbcbig.shx 或 tssdchn.shx',
    explanation: '这是探索者软件的结构排版中文字体. 如果本地未安装探索者, 可以将备用大字体直接指向国标大字体 gbcbig.shx, 字体宽度和高矮非常接近, 几乎不会发生排版溢出. ',
    command: '(setvar "FONTALT" "gbcbig.shx")',
    fmpEntry: 'tssdchn;gbcbig.shx',
  },
  {
    name: 'TCH',
    source: '天正建筑 (Tangent) 早期中文字体',
    type: 'SHX 中文大字体',
    suggestedAlt: 'gbcbig.shx 或 ttxt2.shx',
    explanation: '天正建筑导出的老旧图纸中常带有此大字体. 在天正软件中运行会正常代换, 但在普通 AutoCAD 中开图会报缺失. 可直接映射为 gbcbig.shx, 字符对齐精度良好. ',
    command: '(setvar "FONTALT" "gbcbig.shx")',
    fmpEntry: 'tch;gbcbig.shx',
  },
  {
    name: 'CHINA',
    source: '早期建筑设计院定制版中文仿宋大字体',
    type: 'SHX 中文大字体',
    suggestedAlt: 'gbcbig.shx',
    explanation: '这是上世纪 90 年代至 2000 年初不少省建院自定义的 CAD 字体. 现已基本被 gbcbig.shx 统一合并. 直接在配置文件或备用字体选项中将其指向 gbcbig.shx 即可. ',
    command: '(setvar "FONTALT" "gbcbig.shx")',
    fmpEntry: 'china;gbcbig.shx',
  },
  {
    name: 'CASS',
    source: '南方测绘 CASS 地形地物符号大字体',
    type: 'SHX 符号及钢筋字体',
    suggestedAlt: 'cass.shx 或 simplex.shx',
    explanation: '用于地理信息及工程测量地形等高线标注. 包含特定的指南针, 水深点, 控制标高符号. 若本地未安装 CASS, 可直接映射到普通的 simplex.shx 以查看主要文字, 但部分测绘图元符号可能会显示异常. ',
    command: '(setvar "FONTALT" "simplex.shx")',
    fmpEntry: 'cass;simplex.shx',
  },
  {
    name: 'HZDX',
    source: '国内早期拼音首字母中文大字体',
    type: 'SHX 中文大字体',
    suggestedAlt: 'hztxt.shx 或 gbcbig.shx',
    explanation: '国内最早期的单线体汉字大字体之一, 笔画简单, 渲染迅速. 直接映射为现代大字体 hztxt.shx 即可重现完美轮廓. ',
    command: '(setvar "FONTALT" "hztxt.shx")',
    fmpEntry: 'hzdx;hztxt.shx',
  },
  {
    name: 'BIGFONT',
    source: '通用中文字体虚拟大占位符',
    type: 'SHX 中文大字体',
    suggestedAlt: 'gbcbig.shx',
    explanation: '在部分外企或合资项目图纸中, 由于制图规范差异, 直接将中文字体大分类命名为 BIGFONT. 直接代换为 AutoCAD 默认的国标字体 gbcbig.shx 即可. ',
    command: '(setvar "FONTALT" "gbcbig.shx")',
    fmpEntry: 'bigfont;gbcbig.shx',
  },
  {
    name: 'TXT',
    source: 'AutoCAD 原生最简单线西文字体',
    type: 'SHX 西文普通字体',
    suggestedAlt: 'txt.shx 或 gbenor.shx',
    explanation: 'AutoCAD 诞生之初就自带的西文单线体. 由于缺少圆弧拟合, 全部由折线拼接 (渲染极快, 但略显生硬) . 所有 CAD 平台均默认自带, 如果提示缺失, 通常是当前 CAD 安装路径的 Fonts 目录被清理了, 拷回 txt.shx 即可. ',
    command: '(setvar "FONTALT" "txt.shx")',
    fmpEntry: 'txt;txt.shx',
  },
  {
    name: 'SIMPLEX',
    source: 'AutoCAD 标准圆弧拟合单线西文字体',
    type: 'SHX 西文普通字体',
    suggestedAlt: 'simplex.shx 或 gbenor.shx',
    explanation: '相比 txt.shx, simplex 优化了圆弧渲染, 外观更圆滑美观, 是目前国内二维工程制图中推荐的西文与数字标注字体. 本地缺失时, 可一键代换为 AutoCAD 默认备用西文. ',
    command: '(setvar "FONTALT" "simplex.shx")',
    fmpEntry: 'simplex;simplex.shx',
  },
  {
    name: 'ROMANS',
    source: '罗马体单线精细西文字体',
    type: 'SHX 西文普通字体',
    suggestedAlt: 'romans.shx 或 simplex.shx',
    explanation: '主要用于精密机械制造图纸及总平面图的高清字母标注. 相比 simplex 线宽更均匀, 映射为 simplex.shx 可保证排版宽度不变. ',
    command: '(setvar "FONTALT" "simplex.shx")',
    fmpEntry: 'romans;simplex.shx',
  },
  {
    name: 'COMPLEX',
    source: 'AutoCAD 早期双线体西文字体',
    type: 'SHX 西文普通字体',
    suggestedAlt: 'complex.shx 或 romans.shx',
    explanation: '笔画带有一定粗细厚度的双线西文. 用于图纸大标题, 可降级替代为普通单线体以提高系统缩放渲染帧率. ',
    command: '(setvar "FONTALT" "romans.shx")',
    fmpEntry: 'complex;romans.shx',
  },
  {
    name: 'FS',
    source: 'Windows 操作系统自带 TrueType 仿宋体',
    type: 'SHX 中文大字体',
    suggestedAlt: '仿宋_GB2312 (Windows TTF)',
    explanation: '部分设计师直接引用了 Windows 系统自带的仿宋体 (仿宋.ttf) . 这在部分脱网或精简版 Windows 专业服务器上会因为缺少该系统字体而报错. 建议在控制面板中拷回对应的仿宋_GB2312 字体包. ',
    command: 'N/A (建议将系统字体拷入 C:\\Windows\\Fonts)',
    fmpEntry: 'fs;仿宋_GB2312',
  }
];

export default function MissingFontResolverClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'chinese' | 'western' | 'symbol'>('all');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedFmpIndex, setCopiedFmpIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number, isFmp: boolean) => {
    navigator.clipboard.writeText(text);
    if (isFmp) {
      setCopiedFmpIndex(index);
      setTimeout(() => setCopiedFmpIndex(null), 2000);
    } else {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  // Filtering Logic
  const filteredFonts = FONTS_REGISTRY.filter((font) => {
    const matchesSearch = font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      font.source.includes(searchQuery) ||
      font.suggestedAlt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === 'all' ||
      (activeCategory === 'chinese' && font.type === 'SHX 中文大字体') ||
      (activeCategory === 'western' && font.type === 'SHX 西文普通字体') ||
      (activeCategory === 'symbol' && font.type === 'SHX 符号及钢筋字体');

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12">
      
      {/* Search & Filter Section */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6 print:hidden">
        <div className="relative max-w-lg">
          <input
            type="text"
            placeholder="输入缺失的字体文件名 (例如: hztxt, tssdeng, tch)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-6 pr-12 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition duration-300"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 select-none pointer-events-none">
            🔍
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
              activeCategory === 'all'
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            📋 全部字体 ({FONTS_REGISTRY.length})
          </button>
          <button
            onClick={() => setActiveCategory('chinese')}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
              activeCategory === 'chinese'
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            ✏️ 中文大字体 ({FONTS_REGISTRY.filter(f => f.type === 'SHX 中文大字体').length})
          </button>
          <button
            onClick={() => setActiveCategory('western')}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
              activeCategory === 'western'
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            🔤 西文普通体 ({FONTS_REGISTRY.filter(f => f.type === 'SHX 西文普通字体').length})
          </button>
          <button
            onClick={() => setActiveCategory('symbol')}
            className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
              activeCategory === 'symbol'
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            🎯 符号/钢筋体 ({FONTS_REGISTRY.filter(f => f.type === 'SHX 符号及钢筋字体').length})
          </button>
        </div>
      </div>

      {/* Main Grid: Info Area & Steps */}
      <div className="grid md:grid-cols-3 gap-8 items-start">
        
        {/* Results Cards List */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">
              匹配结果列表 ({filteredFonts.length})
            </h3>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-blue-600 font-bold underline hover:text-blue-700"
              >
                清除搜索条件
              </button>
)}
          </div>

          {filteredFonts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center text-slate-500">
              <span className="text-3xl block mb-2">❓</span>
              <p className="text-sm font-bold">没有匹配到相关的字体名. </p>
              <p className="text-xs text-slate-400 mt-1">您可以试着输入字体的主要字母 (例如: 将 hztxt2.shx 简写为 hztxt 搜索) . </p>
            </div>
) : (
            <div className="space-y-6">
              {filteredFonts.map((font, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6 shadow-sm hover:shadow-md transition-all duration-300 print:border-slate-300 print:shadow-none"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="text-lg font-black text-slate-800 tracking-tight">
                          {font.name}.SHX
                        </h4>
                        <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 uppercase tracking-widest">
                          {font.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-bold">
                        背景: {font.source}
                      </p>
                    </div>
                  </div>

                  {/* Body & Alt Suggested */}
                  <div className="grid md:grid-cols-3 gap-6 bg-slate-50/50 border border-slate-100/50 rounded-2xl p-4 print:bg-white print:border-slate-300">
                    <div className="md:col-span-2 space-y-2">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        代换原理与指南
                      </h5>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        {font.explanation}
                      </p>
                    </div>
                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-50/50 print:bg-white print:border-slate-200">
                      <h5 className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1">
                        最优安全代换
                      </h5>
                      <p className="text-xs font-black text-blue-600">
                        {font.suggestedAlt}
                      </p>
                    </div>
                  </div>

                  {/* Copy Commands (hidden during print) */}
                  <div className="grid md:grid-cols-2 gap-4 pt-2 print:hidden">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          AutoLISP 备用指令 (命令行直接执行) 
                        </span>
                        {font.command !== 'N/A' && (
                          <button
                            onClick={() => handleCopy(font.command, idx, false)}
                            className="text-[10px] text-blue-600 font-bold underline hover:text-blue-700"
                          >
                            {copiedIndex === idx ? '✓ 已复制' : '复制命令'}
                          </button>
)}
                      </div>
                      <div className="bg-slate-900 text-slate-300 text-[11px] font-bold font-mono px-3.5 py-2.5 rounded-xl border border-slate-800 overflow-x-auto select-all">
                        {font.command}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          acad.fmp 映射配置项 (写入配置文件) 
                        </span>
                        <button
                          onClick={() => handleCopy(font.fmpEntry, idx, true)}
                          className="text-[10px] text-blue-600 font-bold underline hover:text-blue-700"
                        >
                          {copiedFmpIndex === idx ? '✓ 已复制' : '复制配置'}
                        </button>
                      </div>
                      <div className="bg-slate-900 text-slate-300 text-[11px] font-bold font-mono px-3.5 py-2.5 rounded-xl border border-slate-800 overflow-x-auto select-all">
                        {font.fmpEntry}
                      </div>
                    </div>
                  </div>

                </div>
))}
            </div>
)}
        </div>

        {/* Right Sidebar: Guide & Steps */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800/50 space-y-6 print:bg-white print:border-slate-300 print:text-slate-900">
            <h3 className="text-lg font-black tracking-tight text-white print:text-slate-900">
              💡 极速修复三步法 (How to Fix)
            </h3>
            
            <ol className="space-y-4 text-xs leading-relaxed font-semibold">
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-black flex-shrink-0 text-[10px]">
                  1
                </span>
                <div>
                  <h5 className="font-bold text-slate-100 print:text-slate-800">设置备用默认字体</h5>
                  <p className="text-slate-400 print:text-slate-500 mt-0.5">
                    复制上方左侧的 `(setvar &quot;FONTALT&quot; &quot;gbcbig.shx&quot;)` 命令. 在 CAD 命令行中直接粘贴并按下 Enter 键. 这会将默认缺失字体的备用代换指定为国标大字体. 
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-black flex-shrink-0 text-[10px]">
                  2
                </span>
                <div>
                  <h5 className="font-bold text-slate-100 print:text-slate-800">执行重生成刷新视口</h5>
                  <p className="text-slate-400 print:text-slate-500 mt-0.5">
                    在 CAD 命令行输入 `REGEN` 并回车. 系统会重新编译渲染全图文字, 此时所有的问号 (?) 就会全部被 gbcbig 代换并正常呈现. 
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-black flex-shrink-0 text-[10px]">
                  3
                </span>
                <div>
                  <h5 className="font-bold text-slate-100 print:text-slate-800">永久解决: 配置 acad.fmp</h5>
                  <p className="text-slate-400 print:text-slate-500 mt-0.5">
                    如果您希望一劳永逸地解决特定字体的缺失 (如打开 tssdchn 总是自动映射而不用每次弹窗) , 可复制上方右侧的 acad.fmp 配置项. 通过 CAD `OP` 选项 ➔ 文件 ➔ 文本编辑器 ➔ 字体映射文件 找到对应路径, 编辑该 `.fmp` 文件并把映射关系粘贴写入其底部保存. 
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 print:border-slate-300">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Standard Fonts Package
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              AutoCAD 内置默认包含 `gbcbig.shx` (中文大字体), `hztxt.shx` (经典中文字体) 以及 `simplex.shx` (单线西文字体). 这几款字体具有极高的通用性和安全系数. 
            </p>
          </div>
        </div>

      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900">缺失字体与乱码疑难解答 (SHX Font FAQ)</h3>
        <div className="grid md:grid-cols-2 gap-6 print:grid-cols-1">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 print:border-slate-300">
            <h4 className="font-bold text-slate-800 mb-2 text-sm">问号 (?) 和文字乱码有什么区别? </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              * **问号 (?)** 代表 CAD 引擎在您的 Fonts 文件夹里找不到图纸指定的 SHX 字体, 或者其映射规则无法匹配特殊符号; 
              * **乱码 (Scrambled Text)** 代表图纸内部指定的编码页 (Codepage) 或字体样式 (Style) 解析冲突, 例如用西文字体强制解析双字节中文大字体. 
            </p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 print:border-slate-300">
            <h4 className="font-bold text-slate-800 mb-2 text-sm">我可以随便去网上下字体包导入吗? </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              极不推荐批量从网上下载动辄几个 G 的"CAD全量字体包". 此类合包包含大量重名, 损坏和多余的字体, 容易引发 CAD 启动速度暴跌, 坐标捕捉失效, 甚至捆绑宏木马. 按需针对性地配置 FONTALT 备用映射才是企业 IT 运维的标准规范. 
            </p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 print:border-slate-300">
            <h4 className="font-bold text-slate-800 mb-2 text-sm">大字体 (Big Font) 和西文普通字体在 CAD 中怎么配置? </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              AutoCAD 的文字样式 (STYLE) 允许组合挂载: 左侧的"SHX 字体"框负责英文字母与数字 (如 simplex.shx) ; 勾选"使用大字体"后, 右侧的"大字体"框负责中日韩汉字 (如 gbcbig.shx) . 只有两者配置无缺, 图纸才能正确复原. 
            </p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 print:border-slate-300">
            <h4 className="font-bold text-slate-800 mb-2 text-sm">天正软件或结构探索者为什么可以自动识别? </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              这些定制化 CAD 二次开发套件在安装时会将其专用的 Fonts 文件夹自动添加到 AutoCAD 的"支持文件搜索路径 (Support File Search Path) "中. 若要在裸 CAD 中查看, 只需将它们的 Fonts 路径复制添加到本地 CAD 的选项搜索路径内. 
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter Subscribe */}
      <NewsletterSubscribe
        variant="banner"
        title="保障企业 CAD 系统平稳运行"
        description="订阅获取每月 CAD 故障排查手册, 标准 SHX 字体库合规清单以及 FLEXlm 授权管理最佳实践. "
        buttonText="订阅技术内参"
        placeholder="输入您的工作邮箱"
        className="mt-8 print:hidden"
      />
    </div>
);
}
