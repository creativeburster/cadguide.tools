const fs = require('fs');
const path = require('path');

// 1. Database of Cheatsheets
const cheatsheets = [
  {
    slug: 'rhino-shortcuts-sheet',
    title: 'Rhino 3D',
    seoTitle: 'Rhino 3D Shortcut Keys & Command Aliases Guide',
    seoDesc: 'Search all Rhino 3D hotkeys, mouse modifiers, and custom command aliases. Download custom Rhino .txt shortcuts to optimize your industrial design workflow.',
    tagline: '工业设计与曲面建模效率利器。精选 Rhino 键盘热键、视图切换指令，支持快速搜索及 PDF 打印备忘录。',
    categories: [
      { id: 'draw', name: '✏️ 曲线绘制' },
      { id: 'modeling', name: '⚙️ 三维建模' },
      { id: 'modify', name: '🛠️ 实体编辑' },
      { id: 'system', name: '💻 系统控制' }
    ],
    shortcuts: [
      { keys: 'L', command: 'Line', category: 'draw', description: '绘制单条直线段。' },
      { keys: 'PL', command: 'Polyline', category: 'draw', description: '绘制连续的多重折线。' },
      { keys: 'C', command: 'Circle', category: 'draw', description: '通过指定圆心和半径绘制圆。' },
      { keys: 'EL', command: 'Ellipse', category: 'draw', description: '绘制椭圆曲线。' },
      { keys: 'E', command: 'ExtrudeCrv', category: 'modeling', description: '沿直线方向挤出曲线生成实体表面。' },
      { keys: 'LOFT', command: 'Loft', category: 'modeling', description: '通过多段断面曲线放样生成过渡曲面。' },
      { keys: 'M', command: 'Move', category: 'modify', description: '移动选定的曲面或物件。' },
      { keys: 'CO / CP', command: 'Copy', category: 'modify', description: '克隆并复制选中物件。' },
      { keys: 'RO', command: 'Rotate', category: 'modify', description: '围绕指定原点和基准角旋转物件。' },
      { keys: 'TR', command: 'Trim', category: 'modify', description: '用剪切物体修剪多余的部分。' },
      { keys: 'S', command: 'Scale', category: 'modify', description: '等比例缩放三维模型体积。' },
      { keys: 'F', command: 'FilletEdge', category: 'modify', description: '对实体倒角倒圆角。' },
      { keys: 'Ctrl + G', command: 'Group', category: 'system', description: '将多个物件组合为一个整体组。' },
      { keys: 'Ctrl + H', command: 'Hide', category: 'system', description: '在视口中隐藏当前选择的所有物件。' },
      { keys: 'Ctrl + Alt + H', command: 'Show', category: 'system', description: '使所有被隐藏的物件重新浮现。' }
    ],
    tips: [
      { title: '右键与空格快速重复上次命令', content: 'Rhino 设计的精髓在于右手不离开鼠标。每一次命令结束后，轻点鼠标右键或敲击键盘空格键即可快速重复执行上一次命令。' },
      { title: '自定义命令别名实现 CAD 迁移', content: '在“首选项 ➔ 别名”设置中，您可以加载自定义的 `.txt` 别名配置，将常用的挤出拉伸等映射为单字母热键，极大缩短击键次数。' }
    ]
  },
  {
    slug: 'revit-shortcuts-sheet',
    title: 'Revit BIM',
    seoTitle: 'Revit Keyboard Shortcuts & Command Codes Table',
    seoDesc: 'Lookup Revit keyboard shortcut keys and double-character codes for architecture, structure, and MEP workflows. Speed up your BIM modeling.',
    tagline: 'BIM 三维协同建模效率表。精选 Revit 建筑、结构、机电（MEP）双字母常用快捷代码，支持一键搜索与 A4 打印。',
    categories: [
      { id: 'arch', name: '🏠 建筑与墙体' },
      { id: 'struct', name: '🏗️ 结构构件' },
      { id: 'view', name: '👁️ 视图控制' },
      { id: 'modify', name: '🛠️ 修改与编辑' }
    ],
    shortcuts: [
      { keys: 'WA', command: 'Wall (墙体)', category: 'arch', description: '在平面图中绘制建筑墙体。' },
      { keys: 'DR', command: 'Door (门)', category: 'arch', description: '在墙体上放置门构件。' },
      { keys: 'WN', command: 'Window (窗)', category: 'arch', description: '在墙体上快速开窗。' },
      { keys: 'CL', command: 'Column (结构柱)', category: 'struct', description: '放置承重结构柱构件。' },
      { keys: 'BM', command: 'Beam (结构梁)', category: 'struct', description: '绘制水平梁承重框架。' },
      { keys: 'VG / VV', command: 'Visibility/Graphics', category: 'view', description: '调出视图可见性控制面板，管理图元类别过滤器。' },
      { keys: 'WT', command: 'Tile Windows', category: 'view', description: '将所有已打开的视图平铺平铺在当前屏幕中，方便协同核对。' },
      { keys: 'ZA', command: 'Zoom All', category: 'view', description: '将所有平铺视口中的模型居中对齐全屏显示。' },
      { keys: 'MV', command: 'Move', category: 'modify', description: '移动选定的墙体或模型图元。' },
      { keys: 'CO', command: 'Copy', category: 'modify', description: '克隆选取的构件。' },
      { keys: 'RO', command: 'Rotate', category: 'modify', description: '旋转模型图元。' },
      { keys: 'AL', command: 'Align', category: 'modify', description: '将一个或多个图元对齐到参考边界，BIM 排版必用。' },
      { keys: 'TR', command: 'Trim/Extend', category: 'modify', description: '修剪或延伸多段管线及墙体边界。' }
    ],
    tips: [
      { title: 'Revit 快捷键输入无需按回车', content: '与 AutoCAD 规则不同，Revit 中的命令大多是双字母组合（如 WA, CO）。键入两个字母后命令会立即执行，千万不要敲击 Enter 键，否则会多出一个无意义的换行操作。' },
      { title: '平铺视口 WT 与平铺收拢', content: '处理大型项目时，多视口联跑容易卡顿。用 WT平铺检查完毕后，使用 `Ctrl + Tab` 可以快速循环，使用 `Tab` 可在单个窗口最大化模式下浏览。' }
    ]
  },
  {
    slug: 'sketchup-shortcuts-sheet',
    title: 'SketchUp Pro',
    seoTitle: 'SketchUp Pro Quick Reference Hotkeys Cheat Sheet',
    seoDesc: 'Quick reference guide for SketchUp Pro keyboard shortcuts, drawing tools, and view controls. Print optimizing for A4 layout.',
    tagline: '草图大师极速方案。包含 SketchUp 常用绘图笔刷、群组设置与相机环绕快捷键，支持在线过滤及 A4 Landscape 打印。',
    categories: [
      { id: 'tools', name: '✏️ 绘图工具' },
      { id: 'camera', name: '🎥 相机与视图' },
      { id: 'system', name: '💻 组与系统' }
    ],
    shortcuts: [
      { keys: 'Space', command: 'Select (选择)', category: 'tools', description: '激活普通指针框选工具，退出其它编辑指令。' },
      { keys: 'L', command: 'Line (直线)', category: 'tools', description: '在坐标平面内绘制一段直线。' },
      { keys: 'C', command: 'Circle (圆)', category: 'tools', description: '绘制正多边形逼近的圆形。' },
      { keys: 'R', command: 'Rectangle (矩形)', category: 'tools', description: '通过对角线两点绘制矩形。' },
      { keys: 'P', command: 'Push/Pull (推拉)', category: 'tools', description: '草图大师精髓，将二维面拉伸为三维实体。' },
      { keys: 'M', command: 'Move (移动)', category: 'tools', description: '移动所选几何体，配合 Ctrl 键可激活阵列复制。' },
      { keys: 'Q', command: 'Rotate (旋转)', category: 'tools', description: '旋转选定的平面或实体。' },
      { keys: 'S', command: 'Scale (缩放)', category: 'tools', description: '对选定几何体进行拉伸缩放。' },
      { keys: 'O', command: 'Orbit (环绕)', category: 'camera', description: '三维环绕旋转视口，按住鼠标中键同样可触发。' },
      { keys: 'H', command: 'Pan (手掌平移)', category: 'camera', description: '水平平移视口视图。' },
      { keys: 'Z', command: 'Zoom (缩放)', category: 'camera', description: '实时前后拖动鼠标缩放视口焦距。' },
      { keys: 'G', command: 'Make Component (建组件)', category: 'system', description: '将选中的几何体归纳为可以关联克隆的“组件”。' },
      { keys: 'Ctrl + G', command: 'Make Group (建群组)', category: 'system', description: '将选中的独立线面打组，防止相互粘连变形。' }
    ],
    tips: [
      { title: '按住 Ctrl 拖动进行阵列复制', content: '在使用“移动 (M)”工具时，按一下键盘 `Ctrl` 键，鼠标旁会多出一个加号。此时拖动构件即可复制。输入 `*5` 或 `/5` 并回车，能实现等距克隆 5 个物体或在区间内等距平分。' },
      { title: '三维轴向锁定技巧', content: '在绘制线段或移动物体时，按键盘的 `↑`（锁定蓝轴）、`←`（锁定绿轴）、`→`（锁定红轴），可强制在三维空间中绝对正交移动，绝对不会飘线。' }
    ]
  },
  {
    slug: 'inventor-shortcuts-sheet',
    title: 'Autodesk Inventor',
    seoTitle: 'Autodesk Inventor Keyboard Shortcuts Reference',
    seoDesc: 'Find default keyboard shortcuts for Autodesk Inventor assembly, drawing, and sheet metal design. Optimize your industrial designs.',
    tagline: '三维机械装配建模速查。整理 Inventor 草图约束、零件特征与大型装配体约束快捷键，支持搜索和 A4 打印。',
    categories: [
      { id: 'sketch', name: '📐 草图绘制' },
      { id: 'part', name: '⚙️ 零件建模' },
      { id: 'assembly', name: '🔗 装配约束' }
    ],
    shortcuts: [
      { keys: 'L', command: 'Line (直线)', category: 'sketch', description: '创建二维或三维草图直线。' },
      { keys: 'C', command: 'Center Point Circle', category: 'sketch', description: '绘制以指定点为圆心的圆。' },
      { keys: 'D', command: 'Dimension (尺寸)', category: 'sketch', description: '对草图几何体进行尺寸驱动标注约束。' },
      { keys: 'F', command: 'Fillet (圆角)', category: 'sketch', description: '在草图两相交线之间创建圆角.。' },
      { keys: 'E', command: 'Extrude (拉伸)', category: 'part', description: '将封闭草图轮廓挤出为特征实体。' },
      { keys: 'R', command: 'Revolve (旋转)', category: 'part', description: '通过将二维草图围绕某轴旋转生成特征。' },
      { keys: 'H', command: 'Hole (打孔)', category: 'part', description: '在实体面上以指定点快速创建螺纹孔、沉头孔等。' },
      { keys: 'F3', command: 'Toggle Visibility', category: 'part', description: '快速切换当前鼠标悬浮构件的可见性状态。' },
      { keys: 'C', command: 'Constraint (约束)', category: 'assembly', description: '在装配体环境调出面贴合、同轴心等约束面板。' },
      { keys: 'P', command: 'Place Component', category: 'assembly', description: '从本地硬盘或库中插入现有的三维零件。' }
    ],
    tips: [
      { title: '草图标注快捷键 D 的魔力', content: '键入 D 命令可以快速开始尺寸标注。如果是标注圆弧，它会自动默认为半径标注；如果是两个圆，它会自动默认为中心距标注，极度智能化。' }
    ]
  },
  {
    slug: 'microstation-shortcuts-sheet',
    title: 'Bentley MicroStation',
    seoTitle: 'Bentley MicroStation V8i Keyboard Shortcuts Guide',
    seoDesc: 'Quick reference reference table for Bentley MicroStation key-ins and keyboard shortcuts. Speed up civil design.',
    tagline: '基建与路桥设计速查指南。提供 MicroStation 常用键盘 Key-in 指令、AccuDraw 轴锁定快捷键及视口管理，支持 A4 打印。',
    categories: [
      { id: 'accudraw', name: '🎯 AccuDraw 辅助' },
      { id: 'draw', name: '✏️ 图元绘制' },
      { id: 'view', name: '👁️ 视口控制' }
    ],
    shortcuts: [
      { keys: 'Enter', command: 'SmartLock', category: 'accudraw', description: 'AccuDraw 极速精髓，锁定当前光标所在的 X 轴或 Y 轴。' },
      { keys: 'X', command: 'Lock X Axis', category: 'accudraw', description: '单轴锁定 X 轴方向。' },
      { keys: 'Y', command: 'Lock Y Axis', category: 'accudraw', description: '单轴锁定 Y 轴方向。' },
      { keys: 'Space', command: 'Toggle Compass', category: 'accudraw', description: '在直角坐标系与极坐标系圆盘罗盘之间快速切换。' },
      { keys: 'Q', command: 'Quit Command', category: 'draw', description: '退出当前正激活的绘图工具，返回默认选择状态。' },
      { keys: 'W', command: 'Toggle Element Selection', category: 'draw', description: '激活或取消激活元素元素选择工具。' },
      { keys: 'Ctrl + B', command: 'View Attributes', category: 'view', description: '调出视口属性面板，显示/隐藏图层填充或线重。' },
      { keys: 'Ctrl + F', command: 'Save Settings', category: 'view', description: '保存当前所有的视口视角属性，防止关闭软件后视口重置。' }
    ],
    tips: [
      { title: 'AccuDraw 与回车锁定机制', content: '在画线时，一旦线型捕捉到正交的对齐虚线上，立刻按一下 `Enter`（回车），此时你的鼠标可以在任意位置点击，线条方向也会死死地锁在刚才的方向，非常好用。' }
    ]
  },
  {
    slug: 'archicad-shortcuts-sheet',
    title: 'Graphisoft ArchiCAD',
    seoTitle: 'Graphisoft ArchiCAD Keyboard Shortcuts Chart',
    seoDesc: 'Lookup Graphisoft ArchiCAD keyboard shortcut hotkeys for floor plans, elevation, and 3D drafting. Download custom sheets.',
    tagline: '建筑大厂 BIM 方案。收录 ArchiCAD 平面图绘制、智能魔术棒捕捉、多重墙体切换及 3D 编辑热键。',
    categories: [
      { id: 'tools', name: '🧱 建筑构件' },
      { id: 'edit', name: '🛠️ 编辑修改' },
      { id: 'view', name: '👁️ 视图查看' }
    ],
    shortcuts: [
      { keys: 'W', command: 'Wall (墙工具)', category: 'tools', description: '激活墙体三维建模绘制工具。' },
      { keys: 'D', command: 'Door (门工具)', category: 'tools', description: '激活门构建放置工具。' },
      { keys: 'Space', command: 'Magic Wand (魔术棒)', category: 'tools', description: '按住空格键激活魔术棒，可根据已有线段边界自动拟合生成闭合墙体或板。' },
      { keys: 'Ctrl + D', command: 'Drag (移动)', category: 'edit', description: '移动选定的建筑图元。' },
      { keys: 'Ctrl + E', command: 'Rotate (旋转)', category: 'edit', description: '对选定构件进行旋转度数对齐。' },
      { keys: 'Ctrl + M', command: 'Mirror (镜像)', category: 'edit', description: '镜像翻转图元结构。' },
      { keys: 'Ctrl + Alt + D', command: 'Drag a Copy', category: 'edit', description: '移动的同时克隆一个新实体。' },
      { keys: 'F3', command: '3D Window', category: 'view', description: '瞬间将全图或当前选定范围切换到 3D 轴测透视窗口浏览。' },
      { keys: 'F2', command: '2D Floor Plan', category: 'view', description: '从 3D 或立面图切换回 2D 平面图视图。' }
    ],
    tips: [
      { title: '活用魔术棒（空格键）快捷拟合', content: '在 ArchiCAD 中，如果您画好了一条复杂的封闭曲线，只需要激活墙体或板工具，按住 `空格键` 并点击这条曲线，ArchiCAD 就会自动将墙体或板沿着该曲线轮廓一键绘制完毕，免去手动描摹。' }
    ]
  },
  {
    slug: 'catia-shortcuts-sheet',
    title: 'Dassault CATIA',
    seoTitle: 'Dassault CATIA V5/V6 Key Shortcuts Table',
    seoDesc: 'Benchmark and view Dassault CATIA V5/V6 essential shortcut keys for Part Design, Sketcher, and Assembly workbenches.',
    tagline: '航空与高端制造机械装配。整理 CATIA 零件草图设计、轴心约束与三维视口拖拽，打印优化。',
    categories: [
      { id: 'mouse', name: '🖱️ 鼠标与视口' },
      { id: 'sketch', name: '📐 草图设计' },
      { id: 'system', name: '💻 系统操控' }
    ],
    shortcuts: [
      { keys: 'MB2 (鼠标中键)', command: 'Pan (平移)', category: 'mouse', description: '按住鼠标中键并拖动，可在视口中平移整个图纸模型。' },
      { keys: 'MB2 + MB1 (或 MB3)', command: 'Rotate (旋转)', category: 'mouse', description: '按住鼠标中键的同时按住左键（或右键）进行拖动，即可触发三维环绕视角。' },
      { keys: 'MB2 + Click MB1', command: 'Zoom (缩放)', category: 'mouse', description: '按住中键，点击一下左键，然后上下拖动鼠标，可实现无极焦距平滑缩放。' },
      { keys: 'C', command: 'Constraint (约束)', category: 'sketch', description: '激活几何约束标注工具。' },
      { keys: 'P', command: 'Point (画点)', category: 'sketch', description: '在平面草图中插入定位点。' },
      { keys: 'Alt + Enter', command: 'Properties (属性)', category: 'system', description: '查看当前选定的实体特征或几何线段的物理属性。' },
      { keys: 'Ctrl + U', command: 'Update (更新模型)', category: 'system', description: '当修改草图参数后，一键重构更新实体装配。' }
    ],
    tips: [
      { title: 'CATIA 三键鼠标的缩放神操作', content: 'CATIA 的视角缩放与普通 CAD 用轮子滚动不同：先按住 `中键` 不松，然后快速按一下 `左键`，接着上下移动鼠标，即可实现极高灵敏度的微距焦距缩放，省去频繁滚轮带来的卡顿。' }
    ]
  },
  {
    slug: 'creo-shortcuts-sheet',
    title: 'PTC Creo',
    seoTitle: 'PTC Creo Parametric Shortcut Keys Reference',
    seoDesc: 'Search keyboard shortcut codes and mouse gestures configurations for PTC Creo Parametric. Optimize your 3D modeling workflow.',
    tagline: '精密结构设计与参数化建模。提供 Creo 草图绘制、实体剪裁及装配约束常用代码，支持一键过滤搜索。',
    categories: [
      { id: 'sketch', name: '📐 草图常用' },
      { id: 'modeling', name: '⚙️ 建模修改' },
      { id: 'view', name: '👁️ 视图对齐' }
    ],
    shortcuts: [
      { keys: 'L', command: 'Line (直线)', category: 'sketch', description: '在平面草图中绘制连续直线段。' },
      { keys: 'C', command: 'Circle (圆)', category: 'sketch', description: '绘制以指定位置为中心的圆。' },
      { keys: 'R', command: 'Rectangle (矩形)', category: 'sketch', description: '通过边界对角线指定矩形。' },
      { keys: 'Ctrl + G', command: 'Regenerate', category: 'modeling', description: '重构并更新三维特征树模型，防止显示异常。' },
      { keys: 'Ctrl + D', command: 'Default View (默认视角)', category: 'view', description: '瞬间将三维工作视口对正并重置回标准等轴测默认视角。' },
      { keys: 'Ctrl + R', command: 'Repaint', category: 'view', description: '强制刷新当前工作屏幕，消除绘图垃圾像素虚影。' },
      { keys: 'Shift + 中键', command: 'Pan View', category: 'view', description: '按住键盘 Shift 键配合鼠标中键拖动，平移视口。' }
    ],
    tips: [
      { title: '一键重置默认三维视角 (Ctrl+D)', content: '当在三维装配体内旋转得晕头转向时，直接按下 `Ctrl + D`，Creo 会一秒将视角对齐并归位到标准的立体轴测图，方便重新定位。' }
    ]
  },
  {
    slug: 'freecad-shortcuts-sheet',
    title: 'FreeCAD',
    seoTitle: 'FreeCAD Open-Source CAD Hotkeys & Mouse Navigation',
    seoDesc: 'Searchable database of FreeCAD shortcut keys for PartDesign and Draft workbenches. Print optimized cheatsheet.',
    tagline: '开源三维建模极客速查。收录 FreeCAD 零部件、草图约束与视图导航键盘热键，完美适配 A4 纸张打印。',
    categories: [
      { id: 'navigation', name: '🖱️ 鼠标导航 preset' },
      { id: 'part', name: '⚙️ PartDesign 建模' },
      { id: 'view', name: '👁️ 视角切换' }
    ],
    shortcuts: [
      { keys: 'Shift + 右键', command: 'Rotate View (CAD 模式)', category: 'navigation', description: '在默认 CAD 鼠标风格下，按住 Shift 配合右键拖动可旋转视口。' },
      { keys: '中键 + 右键', command: 'Rotate View (Alternative)', category: 'navigation', description: '在部分 Linux 或单手模式下使用的旋转中继组合。' },
      { keys: 'Space', command: 'Toggle Visibility', category: 'part', description: '极高频按键！一键显示或隐藏当前所选实体或草图。' },
      { keys: 'Ctrl + R', command: 'Refine Shape', category: 'part', description: '优化几何形体，清除布尔运算产生的冗余线面。' },
      { keys: 'F5', command: 'Recompute', category: 'part', description: '重新计算几何模型，将未应用的约束参数强制重绘生效。' },
      { keys: '0', command: 'Isometric View', category: 'view', description: '切换到三维等轴测透视。' },
      { keys: '1', command: 'Front View', category: 'view', description: '切换到正前平视图。' },
      { keys: '2', command: 'Top View', category: 'view', description: '切换到正顶平视图。' }
    ],
    tips: [
      { title: '巧用空格键（Space）控制图层显示', content: 'FreeCAD 是通过树状特征进行管理的。在左侧树状视图中，选中任意零件或草图并按下 `空格键`，即可快速在显示/隐藏状态之间切换，无需右键选择。' }
    ]
  },
  {
    slug: 'fusion360-shortcuts-sheet',
    title: 'Autodesk Fusion 360',
    seoTitle: 'Autodesk Fusion 360 Keyboard Hotkeys Reference',
    seoDesc: 'Complete reference table for Fusion 360 sculpting, assembly, and CAM path planning keyboard shortcut keys.',
    tagline: '云端协作设计轻量三维方案。提供 Fusion 360 雕刻面、三维拉伸与 CAM 制造刀路快捷代码，A4 打印优化。',
    categories: [
      { id: 'sketch', name: '📐 草图设计' },
      { id: 'modeling', name: '⚙️ 特征实体' },
      { id: 'system', name: '💻 视口与系统' }
    ],
    shortcuts: [
      { keys: 'L', command: 'Line (直线)', category: 'sketch', description: '启动草图并绘制折线段。' },
      { keys: 'C', command: 'Center Diameter Circle', category: 'sketch', description: '绘制指定心半径圆。' },
      { keys: 'R', command: '2-Point Rectangle', category: 'sketch', description: '绘制标准对角矩形。' },
      { keys: 'D', command: 'Sketch Dimension', category: 'sketch', description: '对草图曲线标注物理尺寸约束。' },
      { keys: 'X', command: 'Construction Line Toggle', category: 'sketch', description: '高频键！将当前绘制线一键转换为虚线构造辅助线。' },
      { keys: 'E', command: 'Extrude (拉伸)', category: 'modeling', description: '将二维多边形拉伸成立体特征。' },
      { keys: 'F', command: 'Fillet (倒圆角)', category: 'modeling', description: '对实体边界边缘进行光滑倒圆角。' },
      { keys: 'M', command: 'Move/Copy', category: 'modeling', description: '移动或原位克隆复制实体模型。' },
      { keys: 'Shift + S', command: 'Scripts and Add-Ins', category: 'system', description: '调出 Python 或 API 插件管理窗口。' },
      { keys: 'Ctrl + Shift + R', command: 'Compute All', category: 'system', description: '当大量装配链改变后，重构重算所有关联的配合。' }
    ],
    tips: [
      { title: '构造辅助线切换键 X', content: '在草图中绘制几何线时，如果不需要它作为拉伸分界面，只需选中该线条并按一下 `X` 键，线条即可转换为辅助虚线，再次按 `X` 复原，非常快捷。' }
    ]
  },
  {
    slug: 'draftsight-shortcuts-sheet',
    title: 'Dassault DraftSight',
    seoTitle: 'DraftSight Keyboard Shortcuts & Command Aliases',
    seoDesc: 'Lookup DraftSight keyboard shortcuts and default command aliases. Transition smoothly from AutoCAD using this reference table.',
    tagline: 'AutoCAD 平替高性价比方案。整理 DraftSight 2D 绘图快捷别名、层表管理命令与视口配置。',
    categories: [
      { id: 'draw', name: '✏️ 二维绘图' },
      { id: 'modify', name: '🛠️ 修改命令' },
      { id: 'view', name: '👁️ 视口查看' }
    ],
    shortcuts: [
      { keys: 'L', command: 'LINE', category: 'draw', description: '绘制二维直线。' },
      { keys: 'C', command: 'CIRCLE', category: 'draw', description: '绘制指定心半径圆。' },
      { keys: 'PL', command: 'POLYLINE', category: 'draw', description: '绘制连续的多段线。' },
      { keys: 'REC', command: 'RECTANGLE', category: 'draw', description: '绘制闭合矩形折线。' },
      { keys: 'H', command: 'HATCH', category: 'draw', description: '为闭合区域填充自定义图案。' },
      { keys: 'M', command: 'MOVE', category: 'modify', description: '移动图纸中的实体。' },
      { keys: 'CO', command: 'COPY', category: 'modify', description: '复制选中图元。' },
      { keys: 'RO', command: 'ROTATE', category: 'modify', description: '旋转实体。' },
      { keys: 'TR', command: 'TRIM', category: 'modify', description: '修剪多余线段。' },
      { keys: 'O', command: 'OFFSET', category: 'modify', description: '等距偏移复制线段。' },
      { keys: 'Z', command: 'ZOOM', category: 'view', description: '缩放视口图纸。' },
      { keys: 'P', command: 'PAN', category: 'view', description: '平移移动当前视口。' }
    ],
    tips: [
      { title: '完全对标 AutoCAD 的快捷别名', content: 'DraftSight 的底层逻辑与 AutoCAD 完全吻合。它完全兼容外部加载的 `acad.pgp` 别名配置，可实现肌肉记忆的无缝过渡。' }
    ]
  },
  {
    slug: 'bricscad-shortcuts-sheet',
    title: 'Hexagon BricsCAD',
    seoTitle: 'BricsCAD Hotkeys & Command Customization Guide',
    seoDesc: 'Interactive index of BricsCAD Lite, Pro, and BIM keyboard commands and quad cursor controls. Print optimized cheatsheet.',
    tagline: '高性能专业 2D/3D CAD。收录 BricsCAD 智能 Quad 快捷工具盘命令、多段线和三维轴侧速查。',
    categories: [
      { id: 'quad', name: '🌀 Quad 智能光标' },
      { id: 'draw', name: '✏️ 绘图命令' },
      { id: 'modify', name: '🛠️ 修改与编辑' }
    ],
    shortcuts: [
      { keys: 'Ctrl', command: 'Toggle Quad Display', category: 'quad', description: 'BricsCAD 核心特色，显示或隐藏悬浮智能工具盘。' },
      { keys: 'L', command: 'LINE', category: 'draw', description: '绘制直线段。' },
      { keys: 'C', command: 'CIRCLE', category: 'draw', description: '绘制指定心圆。' },
      { keys: 'PL', command: 'PLINE', category: 'draw', description: '绘制平面多段线。' },
      { keys: 'REC', command: 'RECTANGLE', category: 'draw', description: '绘制矩形闭合曲线。' },
      { keys: 'M', command: 'MOVE', category: 'modify', description: '移动选定的图元实体。' },
      { keys: 'CO', command: 'COPY', category: 'modify', description: '克隆复制图形。' },
      { keys: 'RO', command: 'ROTATE', category: 'modify', description: '旋转物体对齐。' },
      { keys: 'TR', command: 'TRIM', category: 'modify', description: '修剪相交几何线条。' },
      { keys: 'X', command: 'EXPLODE', category: 'modify', description: '打散块或复合折线为单条几何线。' }
    ],
    tips: [
      { title: '使用 Quad 智能轮盘提效 2 倍', content: 'BricsCAD 特有的 Quad 智能浮动工具盘，会根据您当前光标所悬停的图元类型，自动计算并推荐最可能需要的 5 个工具（如修剪、倒角、图层属性），彻底减少把手移向顶部菜单的次数。' }
    ]
  },
  {
    slug: 'vectorworks-shortcuts-sheet',
    title: 'Vectorworks Pro',
    seoTitle: 'Vectorworks Keyboard Shortcuts Reference Chart',
    seoDesc: 'Find keyboard shortcuts for Vectorworks Landmark, Spotlight, and Architect design suites. Speed up your vector drafting.',
    tagline: '舞美、景观与高端建筑设计利器。提供 Vectorworks 智能吸附、绘图坐标变换与图层组合快捷键。',
    categories: [
      { id: 'snapping', name: '🎯 Snapping 捕捉' },
      { id: 'tools', name: '✏️ 经典绘图' },
      { id: 'system', name: '💻 视图操控' }
    ],
    shortcuts: [
      { keys: 'Q', command: 'Toggle Snapping Grid', category: 'snapping', description: '一键开关网格捕捉。' },
      { keys: 'A', command: 'Toggle Snapping Objects', category: 'snapping', description: '一键开关几何实体边界捕捉。' },
      { keys: 'X', command: 'Selection Tool', category: 'tools', description: '激活通用鼠标选择工具。' },
      { keys: '2', command: 'Line Tool (画线)', category: 'tools', description: '激活标准线段绘制命令。' },
      { keys: '4', command: 'Rectangle Tool (画矩形)', category: 'tools', description: '激活矩形绘图命令。' },
      { keys: '6', command: 'Circle Tool (画圆)', category: 'tools', description: '激活圆形绘图命令。' },
      { keys: 'Ctrl + H', command: 'Send to Back (移至底层)', category: 'system', description: '更改图元叠放次序，将其移到底层。' },
      { keys: 'Ctrl + F', command: 'Bring to Front (移至顶层)', category: 'system', description: '将图元叠放次序移到最顶层显示。' },
      { keys: 'Ctrl + Alt + C', command: 'Zoom to Objects', category: 'system', description: '缩放视口以将所选实体完全居中居中呈现。' }
    ],
    tips: [
      { title: '经典单键工具切换系统', content: '在 Vectorworks 中，数字和单字母很多被直接赋予了绘图工具（如 2 代表线，4 代表矩形，X 代表选择）。在使用绘图命令时，多指轻按键盘即可实现无鼠标点击的瞬间切笔。' }
    ]
  }
];

// 2. Database of Diff comparative sheets
const diffs = [
  {
    slug: 'autocad-vs-gstarcad-shortcuts',
    primaryApp: 'AutoCAD',
    secondaryApp: 'GstarCAD',
    seoTitle: 'AutoCAD vs. GstarCAD Shortcut Command Diff Table | CADGuide.tools',
    seoDesc: 'Detailed command mapping and alias comparison diff table between AutoCAD and GstarCAD Lite/Pro versions. Fast migration search.',
    tagline: '浩辰 CAD 迁移兼容性速查手册。展示 AutoCAD 与 浩辰CAD 常用绘图别名在各引擎下的指令映射差异。',
    diffData: [
      { shortcut: 'L', primaryCmd: 'LINE', secondaryCmd: 'LINE', isSame: true, diffNote: '', useCase: '绘制普通二维直线图元。' },
      { shortcut: 'C', primaryCmd: 'CIRCLE', secondaryCmd: 'CIRCLE', isSame: true, diffNote: '', useCase: '绘制指定心半径圆。' },
      { shortcut: 'GWS', primaryCmd: 'N/A', secondaryCmd: 'GSTARWORKSPACES', isSame: false, diffNote: '浩辰 CAD 特有的工作空间配置器指令。AutoCAD 对应使用的是 WSCURRENT 命令。', useCase: '切换经典菜单布局与二维草图功能面板区。' },
      { shortcut: 'SPLAT', primaryCmd: 'SPLINE', secondaryCmd: 'SPLINE (SPLAT)', isSame: false, diffNote: '浩辰独有样条曲线特殊别名映射，支持输入更适合拼写记忆的 SPLAT 快捷执行。', useCase: '绘制样条插值曲线。' },
      { shortcut: 'VP', primaryCmd: 'VPOINT', secondaryCmd: 'VPOINT', isSame: true, diffNote: '', useCase: '设置并锁定三维空间的投影视点视角。' },
      { shortcut: 'EXPRINT', primaryCmd: 'EXPORT', secondaryCmd: 'EXPORTLAYOUT', isSame: false, diffNote: '浩辰提供的将当前图纸空间布局实体独立输出为普通模型空间图纸的直达扩展。', useCase: '提取布局视图并输出为独立 DWG 图纸文件。' },
      { shortcut: 'CO', primaryCmd: 'COPY', secondaryCmd: 'COPY', isSame: true, diffNote: '', useCase: '复制选中图元实体。' },
      { shortcut: 'TR', primaryCmd: 'TRIM', secondaryCmd: 'TRIM', isSame: true, diffNote: '', useCase: '修剪相交多余线段。' }
    ]
  },
  {
    slug: 'autocad-vs-zwcad-shortcuts',
    primaryApp: 'AutoCAD',
    secondaryApp: 'ZWCAD',
    seoTitle: 'AutoCAD vs. ZWCAD Command Shortcut Diff Guide | CADGuide.tools',
    seoDesc: 'Compare command alias mappings between AutoCAD and ZWCAD. Verify smart command exceptions for seamless transitions.',
    tagline: '中望 CAD 移植兼容别名速查手册。对比 AutoCAD 与 中望CAD 常用绘图与协同管理命令别名，解决切换习惯出入。',
    diffData: [
      { shortcut: 'L', primaryCmd: 'LINE', secondaryCmd: 'LINE', isSame: true, diffNote: '', useCase: '绘制二维直线。' },
      { shortcut: 'C', primaryCmd: 'CIRCLE', secondaryCmd: 'CIRCLE', isSame: true, diffNote: '', useCase: '绘制圆形。' },
      { shortcut: 'SS', primaryCmd: 'QSELECT', secondaryCmd: 'SMARTSELECT', isSame: false, diffNote: '中望自主研发的智能选择工具（SmartSelect），相较于 CAD 原生 QSELECT，能在独立面板中通过拖动属性进行高频批量图元过滤。', useCase: '根据图元颜色、图层、类型等属性快速全选并过滤实体。' },
      { shortcut: 'FC', primaryCmd: 'N/A', secondaryCmd: 'FILECOMPARE', isSame: false, diffNote: '中望独创图纸比对命令，直接在当前视口将新旧两版图纸重合叠加，用不同高亮色标记改动图元。AutoCAD 中对应需使用 COMPARE 命令。', useCase: '快速对比双版本图纸变更。' },
      { shortcut: 'MX', primaryCmd: 'N/A', secondaryCmd: 'MESSENGER', isSame: false, diffNote: '中望专有机电与协同通讯助手别名，可在图纸内与当前局域网下的其他设计师收发消息与协同备注。', useCase: '设计师在线即时沟通备注。' },
      { shortcut: 'CO', primaryCmd: 'COPY', secondaryCmd: 'COPY', isSame: true, diffNote: '', useCase: '克隆复制。' },
      { shortcut: 'TR', primaryCmd: 'TRIM', secondaryCmd: 'TRIM', isSame: true, diffNote: '', useCase: '修剪几何线段。' }
    ]
  }
];

// 3. Helpers
const toPascalCase = (str) => {
  return str
    .replace(/[\s.-]+/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
};

const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Generate Cheatsheets
cheatsheets.forEach((item) => {
  const folder = path.join(__dirname, '..', 'src', 'app', 'toolbox', item.slug);
  createDir(folder);

  const componentName = toPascalCase(item.title) + 'Client';

  // Write page.tsx
  const pageCode = `import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ${componentName} from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: '${item.seoTitle} | CADGuide.tools',
  description: '${item.seoDesc}',
  path: '/toolbox/${item.slug}',
});

export default function ${toPascalCase(item.title)}Page() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: '${item.title} Shortcuts', path: '/toolbox/${item.slug}' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden print:hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              Keyboard Shortcuts Cheatsheet
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              ${item.title} <span className="text-blue-400">键盘快捷键与命令</span> 速查表
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              ${item.tagline}
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <${componentName} />
        </section>
      </main>
    </>
  );
}
`;

  // Write calculator-client.tsx
  let aliasDownloadText = '';
  if (item.slug === 'rhino-shortcuts-sheet') {
    aliasDownloadText = `; Rhino Command Aliases\n` + item.shortcuts.map(s => `${s.keys}=${s.command}`).join('\n');
  }

  const clientCode = `'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = ${JSON.stringify(item.categories, null, 2)};
const SHORTCUTS = ${JSON.stringify(item.shortcuts, null, 2)};
const TIPS = ${JSON.stringify(item.tips, null, 2)};

export default function ${componentName}() {
  return (
    <ShortcutCheatsheetClient
      title="${item.title}"
      subtitle="${item.tagline}"
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      ${aliasDownloadText ? `downloadAliasText={\`${aliasDownloadText}\`} downloadAliasFileName="rhino_aliases.txt"` : ''}
    />
  );
}
`;

  fs.writeFileSync(path.join(folder, 'page.tsx'), pageCode, 'utf8');
  fs.writeFileSync(path.join(folder, 'calculator-client.tsx'), clientCode, 'utf8');
  console.log(`Successfully generated files for: ${item.slug}`);
});

// Generate Diff Sheets
diffs.forEach((item) => {
  const folder = path.join(__dirname, '..', 'src', 'app', 'toolbox', item.slug);
  createDir(folder);

  const componentName = toPascalCase(item.slug) + 'Client';

  // Write page.tsx
  const pageCode = `import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ${componentName} from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: '${item.seoTitle}',
  description: '${item.seoDesc}',
  path: '/toolbox/${item.slug}',
});

export default function ${toPascalCase(item.slug)}Page() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: '${item.primaryApp} vs ${item.secondaryApp} Diff Matrix', path: '/toolbox/${item.slug}' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden print:hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              CAD Platforms Command Comparison Matrix
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              ${item.primaryApp} <span className="text-blue-400">vs. ${item.secondaryApp}</span> 命令别名差异表
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              ${item.tagline}
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1200px] mx-auto px-6 md:px-12 print:p-0">
          <${componentName} />
        </section>
      </main>
    </>
  );
}
`;

  // Write calculator-client.tsx
  const clientCode = `'use client';

import ShortcutDiffClient from '@/components/shortcut-diff-client';

const DIFF_DATA = ${JSON.stringify(item.diffData, null, 2)};

export default function ${componentName}() {
  return (
    <ShortcutDiffClient
      primaryApp="${item.primaryApp}"
      secondaryApp="${item.secondaryApp}"
      diffData={DIFF_DATA}
    />
  );
}
`;

  fs.writeFileSync(path.join(folder, 'page.tsx'), pageCode, 'utf8');
  fs.writeFileSync(path.join(folder, 'calculator-client.tsx'), clientCode, 'utf8');
  console.log(`Successfully generated files for: ${item.slug}`);
});

console.log('All files generated successfully!');
