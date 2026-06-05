'use client';

import { useState, useMemo } from 'react';
import { NewsletterSubscribe } from '@/components/newsletter-subscribe';
import {
  Search,
  Printer,
  MousePointer,
  Keyboard,
  Info,
  Maximize2,
  Compass,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ShortcutItem {
  keys: string;
  command: string;
  category: 'system' | 'sketch' | 'part' | 'assembly' | 'drawing';
  description: string;
}

const SHORTCUTS_DATA: ShortcutItem[] = [
  // System shortcuts
  { keys: 'Ctrl + N', command: '新建文件', category: 'system', description: '新建零件, 装配体或工程图文件. ' },
  { keys: 'Ctrl + O', command: '打开文件', category: 'system', description: '浏览并打开已有的模型. ' },
  { keys: 'Ctrl + S', command: '保存文件', category: 'system', description: '快速保存当前文档. ' },
  { keys: 'Ctrl + Q', command: '强行重建模型 (Force Rebuild)', category: 'system', description: '最硬核快捷键, 强制彻底重建特征树所有实体, 解决模型显示异常错误. ' },
  { keys: 'Ctrl + B', command: '重建模型 (Rebuild)', category: 'system', description: '重构当前已更改的特征及装配. ' },
  { keys: 'S', command: '快捷弹窗菜单', category: 'system', description: 'SolidWorks 效率精髓, 在鼠标处弹出高度自定义快捷栏 (草图, 特征, 装配各不同) . ' },
  { keys: 'D', command: '确定角落选项 (Confirmation Corner)', category: 'system', description: '直接将确认/取消对勾移至鼠标光标处, 快速退出当前草图或特征编辑. ' },
  { keys: 'F', command: '整页显示 (Zoom to Fit)', category: 'system', description: '将所有视图内实体居中缩放全屏显示. ' },
  { keys: 'G', command: '局部放大镜 (Magnifier)', category: 'system', description: '在鼠标位置弹出局部放大镜, 无需缩放视口即可选取精细面和边缘. ' },
  { keys: 'Space (空格键)', command: '视图定向菜单 (Orientation)', category: 'system', description: '调出视图定向立方体面板, 双击快速切面. ' },
  
  // Views
  { keys: 'Ctrl + 1', command: '前视 (Front View)', category: 'part', description: '切换至正前投影方向. ' },
  { keys: 'Ctrl + 2', command: '后视 (Back View)', category: 'part', description: '切换至正后投影方向. ' },
  { keys: 'Ctrl + 3', command: '左视 (Left View)', category: 'part', description: '切换至正左投影方向. ' },
  { keys: 'Ctrl + 4', command: '右视 (Right View)', category: 'part', description: '切换至正右投影方向' },
  { keys: 'Ctrl + 5', command: '上视 (Top View)', category: 'part', description: '切换至正上平视方向. ' },
  { keys: 'Ctrl + 6', command: '下视 (Bottom View)', category: 'part', description: '切换至正底平视方向. ' },
  { keys: 'Ctrl + 7', command: '等轴测 (Isometric View)', category: 'part', description: '切换至标准等轴三维三面倾斜投影. ' },
  { keys: 'Ctrl + 8', command: '正视于 (Normal To)', category: 'part', description: '将当前选定的草图基准面或实体平面对正于屏幕. ' },
  
  // Sketching shortcuts
  { keys: 'Esc', command: '取消选择 / 退出工具', category: 'sketch', description: '退出当前的绘图工具, 返回普通框选鼠标. ' },
  { keys: 'Enter', command: '重复上次命令', category: 'sketch', description: '重新激活上一轮使用过的草图或绘图指令. ' },
  { keys: 'L', command: '绘制直线 (Line)', category: 'sketch', description: '在当前激活的草图面绘制一段线. ' },
  { keys: 'Ctrl + Drag', command: '等距复制实体', category: 'sketch', description: '框选草图对象后按住 Ctrl 拖动即可原样克隆实体. ' },
  
  // Assembly shortcuts
  { keys: 'Tab', command: '隐藏悬停组件 (Hide)', category: 'assembly', description: '鼠标在装配体任意零件上悬停时按 Tab, 能瞬间静默隐藏它, 露出内部零件. ' },
  { keys: 'Shift + Tab', command: '显示隐藏组件 (Show)', category: 'assembly', description: '鼠标移动到零件被隐藏的空白处, 按住 Shift+Tab 即可重新浮现. ' },
  { keys: 'Alt + Drag', command: '智能配合 (Smart Mates)', category: 'assembly', description: '按住 Alt 键拖动零件轴孔到另一个零件上, 会自动创建同轴心/重合配合, 极其高效! ' },
  { keys: 'Ctrl + Drag (组件)', command: '快速复制零件', category: 'assembly', description: '拖动装配体内的零件并按住 Ctrl, 可直接拖出复制品. ' },
  
  // Drawing shortcuts
  { keys: 'R', command: '最近文档列表', category: 'system', description: '在主界面调出最近使用过的历史工程文档列表. ' },
  { keys: 'C', command: '折叠特征树 (Collapse)', category: 'system', description: '一键将 FeatureManager 左侧复杂的装配特征树收拢折叠起来. ' },
  { keys: 'Alt + Click', command: '解除尺寸对齐锁定', category: 'drawing', description: '在工程图中标注尺寸时, 按住 Alt 移动可绕过自动网格对齐附着. ' },
  { keys: 'Shift + Click', command: '尺寸标注切点锁定', category: 'drawing', description: '标注圆弧和圆时按住 Shift, 可以锁定标注最大/最小切线间距. ' }
];

// Mouse Gesture Definition (4-direction and 8-direction presets for SW)
const GESTURE_PRESETS = {
  4: {
    sketch: [
      { dir: 'up', command: '智能尺寸', symbol: '📏' },
      { dir: 'right', command: '圆', symbol: '⚪' },
      { dir: 'down', command: '矩形', symbol: '⬜' },
      { dir: 'left', command: '直线', symbol: '➖' }
    ],
    part: [
      { dir: 'up', command: '上视', symbol: '⬆️' },
      { dir: 'right', command: '右视', symbol: '➡️' },
      { dir: 'down', command: '前视', symbol: '⬇️' },
      { dir: 'left', command: '左视', symbol: '⬅️' }
    ],
    assembly: [
      { dir: 'up', command: '上视', symbol: '⬆️' },
      { dir: 'right', command: '右视', symbol: '➡️' },
      { dir: 'down', command: '前视', symbol: '⬇️' },
      { dir: 'left', command: '左视', symbol: '⬅️' }
    ],
    drawing: [
      { dir: 'up', command: '智能尺寸', symbol: '📏' },
      { dir: 'right', command: '投影视图', symbol: '🖼️' },
      { dir: 'down', command: '剖面线', symbol: '📐' },
      { dir: 'left', command: '注释/文本', symbol: '📝' }
    ]
  },
  8: {
    sketch: [
      { dir: 'up', command: '智能尺寸', symbol: '📏' },
      { dir: 'ur', command: '切线弧', symbol: '↩️' },
      { dir: 'right', command: '圆', symbol: '⚪' },
      { dir: 'dr', command: '三点圆弧', symbol: '↪️' },
      { dir: 'down', command: '边角矩形', symbol: '⬜' },
      { dir: 'dl', command: '构造线', symbol: '📇' },
      { dir: 'left', command: '绘制直线', symbol: '➖' },
      { dir: 'ul', command: '等距实体', symbol: '⛓️' }
    ],
    part: [
      { dir: 'up', command: '上视', symbol: '⬆️' },
      { dir: 'ur', command: '等轴测', symbol: '💎' },
      { dir: 'right', command: '右视', symbol: '➡️' },
      { dir: 'dr', command: '右下斜视', symbol: '📐' },
      { dir: 'down', command: '前视', symbol: '⬇️' },
      { dir: 'dl', command: '左下斜视', symbol: '📏' },
      { dir: 'left', command: '左视', symbol: '⬅️' },
      { dir: 'ul', command: '正视于', symbol: '🎯' }
    ],
    assembly: [
      { dir: 'up', command: '上视', symbol: '⬆️' },
      { dir: 'ur', command: '等轴测', symbol: '💎' },
      { dir: 'right', command: '右视', symbol: '➡️' },
      { dir: 'dr', command: '移动零部件', symbol: '🚗' },
      { dir: 'down', command: '前视', symbol: '⬇️' },
      { dir: 'dl', command: '旋转零部件', symbol: '🔄' },
      { dir: 'left', command: '左视', symbol: '⬅️' },
      { dir: 'ul', command: '添加配合', symbol: '🔗' }
    ],
    drawing: [
      { dir: 'up', command: '智能尺寸', symbol: '📏' },
      { dir: 'ur', command: '剖面视图', symbol: '✂️' },
      { dir: 'right', command: '投影视图', symbol: '🖼️' },
      { dir: 'dr', command: '局部放大图', symbol: '🔍' },
      { dir: 'down', command: '中心线', symbol: '🎯' },
      { dir: 'dl', command: '中心标记', symbol: '🔘' },
      { dir: 'left', command: '文本注释', symbol: '📝' },
      { dir: 'ul', command: '表格/BOM', symbol: '📊' }
    ]
  }
};

export default function SolidWorksShortcutsClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'system' | 'sketch' | 'part' | 'assembly' | 'drawing'>('all');
  
  // Mouse gesture configurations
  const [gestureMode, setGestureMode] = useState<4 | 8>(8);
  const [gestureEnv, setGestureEnv] = useState<'sketch' | 'part' | 'assembly' | 'drawing'>('sketch');
  const [hoveredGesture, setHoveredGesture] = useState<string | null>(null);

  // Search filter implementation
  const filteredShortcuts = useMemo(() => {
    return SHORTCUTS_DATA.filter((item) => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch =
        item.keys.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [searchQuery, activeCategory]);

  const activeGestures = useMemo(() => {
    return GESTURE_PRESETS[gestureMode][gestureEnv];
  }, [gestureMode, gestureEnv]);

  // Active hover info retrieval
  const activeHoverInfo = useMemo(() => {
    if (!hoveredGesture) return null;
    return activeGestures.find((g) => g.dir === hoveredGesture);
  }, [hoveredGesture, activeGestures]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* 顶部交互式 SVG 鼠标手势轮盘 */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden print:hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/50 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 z-10 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
              <h2 className="text-white font-black text-lg tracking-tight">SolidWorks 鼠标手势动态轮盘</h2>
            </div>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
              Interactive Mouse Gestures Wheel Map
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setGestureMode(4)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                gestureMode === 4
                  ? 'bg-blue-500 border-blue-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              4 方向手势
            </button>
            <button
              onClick={() => setGestureMode(8)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                gestureMode === 8
                  ? 'bg-blue-500 border-blue-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              8 方向手势
            </button>
          </div>
        </div>

        {/* 轮盘主图与控制布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* 左侧: 轮盘环境切换 */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">选择手势工作环境</span>
            <div className="grid grid-cols-2 gap-3">
              {(['sketch', 'part', 'assembly', 'drawing'] as const).map((env) => {
                const label = env === 'sketch' ? '📐 草图环境' : env === 'part' ? '⚙️ 零件建模' : env === 'assembly' ? '🔗 装配体' : '📝 工程图';
                return (
                  <button
                    key={env}
                    onClick={() => {
                      setGestureEnv(env);
                      setHoveredGesture(null);
                    }}
                    className={`py-3 px-4 rounded-2xl border text-sm font-bold text-left transition-all ${
                      gestureEnv === env
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                    }`}
                  >
                    {label}
                  </button>
);
              })}
            </div>

            <div className="bg-slate-950/60 rounded-2xl border border-slate-800/80 p-5 mt-2 flex gap-3 text-xs leading-relaxed text-slate-400">
              <Compass className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-300">什么是鼠标手势? </p>
                <p className="mt-1">在 SolidWorks 中, 按住<b>鼠标右键并朝特定方向拖动</b>, 即可快速激活对应指令. 将鼠标悬停在右侧的 SVG 轮盘上即可探索配置. </p>
              </div>
            </div>
          </div>

          {/* 右侧: SVG 动态手势轮盘 */}
          <div className="flex flex-col items-center justify-center min-h-[220px]">
            <div className="w-[200px] h-[200px] relative">
              <svg viewBox="0 0 200 200" className="w-full h-full select-none">
                <defs>
                  <radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0c1017" />
                  </radialGradient>
                </defs>

                {/* Background Ring */}
                <circle cx="100" cy="100" r="90" fill="url(#wheelGlow)" stroke="#334155" strokeWidth="2" />
                <circle cx="100" cy="100" r="45" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

                {/* 4-direction Sector Triggers */}
                {gestureMode === 4 && (
                  <>
                    {/* Up */}
                    <path
                      d="M 68.3 68.3 A 45 45 0 0 1 131.7 68.3 L 163.6 36.4 A 90 90 0 0 0 36.4 36.4 Z"
                      fill={hoveredGesture === 'up' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'up' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="1"
                      onMouseEnter={() => setHoveredGesture('up')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* Right */}
                    <path
                      d="M 131.7 68.3 A 45 45 0 0 1 131.7 131.7 L 163.6 163.6 A 90 90 0 0 0 163.6 36.4 Z"
                      fill={hoveredGesture === 'right' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'right' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="1"
                      onMouseEnter={() => setHoveredGesture('right')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* Down */}
                    <path
                      d="M 131.7 131.7 A 45 45 0 0 1 68.3 131.7 L 36.4 163.6 A 90 90 0 0 0 163.6 163.6 Z"
                      fill={hoveredGesture === 'down' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'down' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="1"
                      onMouseEnter={() => setHoveredGesture('down')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* Left */}
                    <path
                      d="M 68.3 131.7 A 45 45 0 0 1 68.3 68.3 L 36.4 36.4 A 90 90 0 0 0 36.4 163.6 Z"
                      fill={hoveredGesture === 'left' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'left' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="1"
                      onMouseEnter={() => setHoveredGesture('left')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                  </>
)}

                {/* 8-direction Sector Triggers (using standard octant polygon approximate bounds for performance) */}
                {gestureMode === 8 && (
                  <>
                    {/* Up: -22.5 to 22.5 deg */}
                    <path
                      d="M 100 10 L A 90 90 0 0 1 134.4 20.6 L 117.2 60.3 A 45 45 0 0 0 100 55 Z"
                      transform="rotate(-22.5, 100, 100)"
                      fill={hoveredGesture === 'up' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'up' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="0.8"
                      onMouseEnter={() => setHoveredGesture('up')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* UR */}
                    <path
                      d="M 100 10 L A 90 90 0 0 1 134.4 20.6 L 117.2 60.3 A 45 45 0 0 0 100 55 Z"
                      transform="rotate(22.5, 100, 100)"
                      fill={hoveredGesture === 'ur' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'ur' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="0.8"
                      onMouseEnter={() => setHoveredGesture('ur')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* Right */}
                    <path
                      d="M 100 10 L A 90 90 0 0 1 134.4 20.6 L 117.2 60.3 A 45 45 0 0 0 100 55 Z"
                      transform="rotate(67.5, 100, 100)"
                      fill={hoveredGesture === 'right' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'right' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="0.8"
                      onMouseEnter={() => setHoveredGesture('right')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* DR */}
                    <path
                      d="M 100 10 L A 90 90 0 0 1 134.4 20.6 L 117.2 60.3 A 45 45 0 0 0 100 55 Z"
                      transform="rotate(112.5, 100, 100)"
                      fill={hoveredGesture === 'dr' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'dr' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="0.8"
                      onMouseEnter={() => setHoveredGesture('dr')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* Down */}
                    <path
                      d="M 100 10 L A 90 90 0 0 1 134.4 20.6 L 117.2 60.3 A 45 45 0 0 0 100 55 Z"
                      transform="rotate(157.5, 100, 100)"
                      fill={hoveredGesture === 'down' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'down' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="0.8"
                      onMouseEnter={() => setHoveredGesture('down')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* DL */}
                    <path
                      d="M 100 10 L A 90 90 0 0 1 134.4 20.6 L 117.2 60.3 A 45 45 0 0 0 100 55 Z"
                      transform="rotate(202.5, 100, 100)"
                      fill={hoveredGesture === 'dl' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'dl' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="0.8"
                      onMouseEnter={() => setHoveredGesture('dl')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* Left */}
                    <path
                      d="M 100 10 L A 90 90 0 0 1 134.4 20.6 L 117.2 60.3 A 45 45 0 0 0 100 55 Z"
                      transform="rotate(247.5, 100, 100)"
                      fill={hoveredGesture === 'left' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'left' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="0.8"
                      onMouseEnter={() => setHoveredGesture('left')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                    {/* UL */}
                    <path
                      d="M 100 10 L A 90 90 0 0 1 134.4 20.6 L 117.2 60.3 A 45 45 0 0 0 100 55 Z"
                      transform="rotate(292.5, 100, 100)"
                      fill={hoveredGesture === 'ul' ? '#3b82f6' : 'transparent'}
                      opacity={hoveredGesture === 'ul' ? 0.35 : 1}
                      stroke="#334155"
                      strokeWidth="0.8"
                      onMouseEnter={() => setHoveredGesture('ul')}
                      onMouseLeave={() => setHoveredGesture(null)}
                      className="cursor-pointer transition-colors duration-150"
                    />
                  </>
)}

                {/* Symbols overlay */}
                {activeGestures.map((gesture) => {
                  let x = 100;
                  let y = 100;
                  const d = 70; // radius offset for symbol
                  
                  if (gesture.dir === 'up') y = 100 - d;
                  else if (gesture.dir === 'down') y = 100 + d;
                  else if (gesture.dir === 'left') x = 100 - d;
                  else if (gesture.dir === 'right') x = 100 + d;
                  else if (gesture.dir === 'ur') { x = 100 + d * 0.7; y = 100 - d * 0.7; }
                  else if (gesture.dir === 'dr') { x = 100 + d * 0.7; y = 100 + d * 0.7; }
                  else if (gesture.dir === 'dl') { x = 100 - d * 0.7; y = 100 + d * 0.7; }
                  else if (gesture.dir === 'ul') { x = 100 - d * 0.7; y = 100 - d * 0.7; }

                  return (
                    <text
                      key={gesture.dir}
                      x={x}
                      y={y + 3}
                      fontSize="9"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {gesture.symbol}
                    </text>
);
                })}
              </svg>

              {/* Center Overlay Display */}
              <div className="absolute inset-0 m-auto w-[82px] h-[82px] rounded-full flex flex-col items-center justify-center text-center p-2 pointer-events-none">
                {activeHoverInfo ? (
                  <>
                    <span className="text-[14px] leading-none mb-1">{activeHoverInfo.symbol}</span>
                    <span className="text-[9px] font-black text-blue-400 tracking-tight leading-tight w-full truncate">
                      {activeHoverInfo.command}
                    </span>
                  </>
) : (
                  <>
                    <MousePointer className="w-3.5 h-3.5 text-slate-500 mb-0.5" />
                    <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                      Hover me
                    </span>
                  </>
)}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 快捷键搜索与多 Tab 筛选列表 */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm print:shadow-none print:border-none print:p-0">
        
        {/* 控制排版: 搜索与打印按钮 */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-6 print:hidden">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索按键或命令 (如: Ctrl, Rebuild, Line)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800 bg-slate-50/50"
            />
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            打印快捷键表 (A4)
          </button>
        </div>

        {/* 过滤分类标签 */}
        <div className="flex flex-wrap gap-2 mb-6 print:hidden">
          {(['all', 'system', 'sketch', 'part', 'assembly', 'drawing'] as const).map((cat) => {
            const label = cat === 'all' ? '全部' : cat === 'system' ? '💻 系统' : cat === 'sketch' ? '📐 草图' : cat === 'part' ? '⚙️ 零件' : cat === 'assembly' ? '🔗 装配体' : '📝 工程图';
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-slate-900 border-slate-950 text-white font-bold'
                    : 'bg-slate-50/80 border-slate-100 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
);
          })}
        </div>

        {/* 快捷键呈现表格 */}
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
            <thead>
              <tr className="border-b-2 border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 w-[180px]">快捷热键</th>
                <th className="py-3 px-4 w-[200px]">触发指令</th>
                <th className="py-3 px-4">使用功能描述</th>
              </tr>
            </thead>
            <tbody>
              {filteredShortcuts.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/40 print:hover:bg-transparent">
                  <td className="py-3 px-4">
                    <span className="font-mono bg-slate-900 text-white px-2.5 py-1 rounded-lg font-black tracking-tight text-[10px] shadow-sm select-all">
                      {item.keys}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-900 font-black text-sm">{item.command}</td>
                  <td className="py-3 px-4 text-slate-500 font-medium leading-relaxed">{item.description}</td>
                </tr>
))}
              {filteredShortcuts.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400">
                    未找到匹配该关键字的快捷键, 请尝试其他词汇. 
                  </td>
                </tr>
)}
            </tbody>
          </table>
        </div>

        {/* @media print 打印专用 CSS 规则 */}
        <style jsx global>{`
          @media print {
            body {
              background-color: white !important;
              color: black !important;
            }
            main {
              padding: 0 !important;
              margin: 0 !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            .print\\:p-0 {
              padding: 0 !important;
            }
            .print\\:border-none {
              border: none !important;
            }
            .print\\:shadow-none {
              box-shadow: none !important;
            }
            /* A4 Landscape setting */
            @page {
              size: A4 landscape;
              margin: 1.5cm 1cm 1.5cm 1cm;
            }
            table {
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
          }
        `}</style>

      </div>

      {/* 极客效率指南卡片 */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6 print:hidden">
        <div>
          <h3 className="text-slate-900 font-black text-base tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
            SolidWorks 高级效率进阶秘籍
          </h3>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
            SolidWorks Advanced Productivity Strategies Guide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-slate-500">
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1.5">1. 鼠标手势与快捷工具栏的黄金配合</h4>
            <p>
              在 SolidWorks 中, 强烈建议将鼠标手势配置为 8 方向, 并把最频繁的"绘制直线", "圆", "智能尺寸", "裁剪"和"正视于"放在其中. 将不太频繁但关键的建构工具 (如拉伸, 切除, 放样, 基准面) 放入 <b>`S 键快捷面板`</b> 中. 这样你在设计时, 右手用鼠标右键拖动完成草图, 左手只需按一下 S 键即可一键生成三维体, 实现"双手均不离开键盘鼠标重心"的极速体验. 
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1.5">2. 强制重建 (Ctrl+Q) 与普通重建 (Ctrl+B) 的差异</h4>
            <p>
              常规的重建模型 (Ctrl+B) 仅仅在当前发生修改的草图特征上重新构建生成实体, 虽然计算速度快, 但当装配关系非常多时, 容易引起配合报错或部分草图关系无法更新. 而<b>强制重建 (Ctrl+Q) </b>是直接清空内存缓存, 从 FeatureManager 特征树的最顶层基准面开始, 对所有装配图元和几何约束进行逐行反编译与底盘重建. 凡是遇到尺寸改了但实体不变, 或者装配体出图缺失的情况, 按 Ctrl+Q 是最直接彻底的自我修复命令. 
            </p>
          </div>
        </div>
      </div>

      <NewsletterSubscribe />
    </div>
);
}
