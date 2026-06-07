const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. Data mapping for translating 25 third-party descriptions in `toolbox-data.ts`
const dataTranslations = {
  'online-pdf-to-dwg-converter': 'Benchmark and access: Convert vector PDF files back to layered DWG/DXF drawings online without losing vector details.',
  'online-dwg-to-pdf-cloud-printer': 'Benchmark and access: Batch print and plot DWG files to vector PDF documents in high fidelity online.',
  'online-dwg-version-downgrader-cloud': 'Benchmark and access: Downgrade AutoCAD drawings from latest format down to legacy compatible releases online.',
  'cloud-dwg-to-step-iges-converter': 'Benchmark and access: Translate 3D solid models inside DWG files to watertight STEP/IGES format for manufacturing.',
  'cloud-bim-rvt-to-ifc-converter': 'Benchmark and access: Convert proprietary Revit RVT models to openBIM IFC standard format online.',
  'online-dgn-to-dwg-converter': 'Benchmark and access: Convert Bentley MicroStation DGN drawings to standard layered DWG/DXF format.',
  'cloud-dwg-drawing-recovery-service': 'Benchmark and access: Recover and repair corrupted DWG files that display file format invalid errors.',
  'online-3d-cad-viewer-collaborator': 'Benchmark and access: View, markup, and collaborate on 3D CAD and Revit models in browser without active licenses.',
  'online-point-cloud-to-mesh-converter': 'Benchmark and access: Convert raw LiDAR point cloud data (LAS/PTS) to watertight CAD mesh shapes.',
  'cloud-dxf-to-gcode-laser-converter': 'Benchmark and access: Convert 2D DXF boundary contours to CNC G-code toolpath commands online.',
  'online-step-to-stl-slicer-helper': 'Benchmark and access: Convert 3D parametric STEP files to optimized watertight STL print meshes.',
  'online-dwg-to-dxf-batch-converter': 'Benchmark and access: Convert between DWG and DXF file formats in batch queues online.',
  'cloud-cad-telemetry-blocker-wizard': 'Benchmark and access: Restrict CAD software from making silent outbound telemetry calls online.',
  'online-lisp-script-compiler-protector': 'Benchmark and access: Encrypt and compile AutoLISP source LSP scripts to FAS/VLX binary bytecode.',
  'online-revit-family-checker-audit': 'Benchmark and access: Audit Revit Family (RFA) parameters, size bloat, and shared configurations online.',
  'online-ifc-viewer-validator': 'Benchmark and access: Validate and view openBIM IFC files online to check buildingsmart metadata.',
  'online-point-cloud-las-to-dxf-contour': 'Benchmark and access: Extract terrain elevations from raw LAS files to dxf contour lines online.',
  'online-solidworks-e-drawings-cloud-viewer': 'Benchmark and access: View and inspect SolidWorks SLDPRT/SLDASM files inside web browsers.',
  'online-dwg-compare-diff-viewer': 'Benchmark and access: Compare drawing revisions and overlay diff entities online in color.',
  'online-image-jpg-to-dxf-vectorizer': 'Benchmark and access: Trace raster blueprints (JPG/PNG) to vector DXF line drawings online.',
  'online-step-to-obj-gltf-converter': 'Benchmark and access: Convert CAD STEP files to light OBJ/glTF rendering mesh online.',
  'online-cad-license-audit-shield': 'Benchmark and access: Navigate corporate CAD software compliance reviews and anti-piracy audits.',
  'online-dwg-layer-splitter-cloud': 'Benchmark and access: Split multi-layer CAD drawings into separate DWG layout files online.',
  'online-dxf-text-translator-cloud': 'Benchmark and access: Translate CAD text and attributes inside DXF drawings in batch online.',
  'online-skp-to-fbx-cloud-converter': 'Benchmark and access: Convert SketchUp SKP models to textured FBX assets for rendering online.'
};

// 2. Client translation dictionaries
const clientTranslations = {
  // 1. Duct Sizing
  'duct-size-friction-loss-calculator/calculator-client.tsx': {
    'Galvanized Steel (镀锌钢板)': 'Galvanized Steel',
    'Aluminum (铝板)': 'Aluminum',
    'PVC / Plastic (塑料/聚氯乙烯)': 'PVC / Plastic',
    'Flexible Duct (软管/金属波纹管)': 'Flexible Metallic / Ribbed Duct',
    '输入参数 (Parameters)': 'Design Inputs & Parameters',
    '风管截面形状 (Duct Shape)': 'Duct Shape Profile',
    '圆形风管 (Round)': 'Round Duct',
    '矩形风管 (Rectangular)': 'Rectangular Duct',
    '风管类型: 圆形风管': 'Profile: Round Duct',
    '风管类型: 矩形风管': 'Profile: Rectangular Duct',
    '2. 设计风量 (Airflow Q)': '2. Design Airflow Rate (Q)',
    '3. 风管物理规格 (Duct Dimensions)': '3. Physical Dimensions',
    '直径 (Diameter D)': 'Diameter (D)',
    '宽度 (Width a)': 'Width (a)',
    '高度 (Height b)': 'Height (b)',
    '4. 材质绝对粗糙度 (Roughness)': '4. Material Absolute Roughness',
    'Custom (自定义数值)': 'Custom Value',
    '管壁粗糙度:': 'Material Roughness:',
    '计算结果 (Flow Physics Report)': 'Calculation Verdict (Flow Physics)',
    '已复制': 'Copied',
    '复制报告': 'Copy Report',
    '流速 (Velocity)': 'Flow Velocity (V)',
    '限制参考值: <': 'Target limit: <',
    '单位摩擦阻力 (Head Loss)': 'Friction Head Loss (Δp/L)',
    '推荐上限: 1.0 Pa/m': 'Recommended limit: 1.0 Pa/m',
    '等效水力直径 (Hydraulic Diam.)': 'Hydraulic Diameter (Dh)',
    '截面积:': 'Cross Section Area:',
    '警告：实际风速超出推荐限制！': 'WARNING: Air velocity exceeds recommended target!',
    '当前风速': 'The current velocity of',
    '超过了设定的': 'exceeds the specified limit of',
    '阈值。这会导致严重的管道风噪和高静压损失。建议增大风管截面尺寸。': 'm/s. This will trigger high static pressure losses and acoustic noise. Consider enlarging the duct size.',
    '风管物理气流截面预览 (Dynamic Flow Visualizer)': 'Duct Cross Section & Flow Line Simulation',
    '高静压端': 'High Static Pressure',
    '高摩擦阻力损失端': 'High Frictional Loss',
    '流阻正常端': 'Safe Velocity Zone',
    '* 动画展示的是风管中心气流线的流速模拟。流线由蓝转红暗示管道内的压力损失加大（红为高损失区）。使用 Haaland 方程和 Colebrook 管道阻力流体动力学进行精确解算。': '* Simulation represents center flow line velocity. The gradient from blue to red indicates static pressure drop. Calculated precisely using Haaland approximation of the Colebrook-White equation.',
    '宽度 (Width a)': 'Width (a)',
    '高度 (Height b)': 'Height (b)'
  },
  // 2. Hatch
  'cad-hatch-scale-optimizer/calculator-client.tsx': {
    'Metric: Millimeters (公制: 毫米)': 'Metric: Millimeters (mm)',
    'Metric: Meters (公制: 米)': 'Metric: Meters (m)',
    'Imperial: Inches (英制: 英寸)': 'Imperial: Inches (in)',
    'ANSI31 (斜平行线 / Iron-Steel)': 'ANSI31 (Slanted / Iron-Steel)',
    '标准金属、剖面线': 'Standard metal and cross sections line pattern',
    'NET (网格线 / Grid-Tile)': 'NET (Crossed grid / Tile-Mosaic)',
    '瓷砖、防滑网格': 'Tile joints and industrial slip grids',
    'AR-CONC (混凝土 / Concrete)': 'AR-CONC (Concrete Aggregate)',
    '粗集料、水泥沙浆': 'Coarse aggregate and concrete cement layout',
    'GRAVEL (碎石 / Pebbles)': 'GRAVEL (Pebbles / Stones)',
    '鹅卵石填料、散水': 'Pebble ballast and drainage fill paths',
    '输入参数 (Parameters)': 'Design Inputs & Parameters',
    '1. 图纸当前绘图单位 (Drawing Unit)': '1. Drawing Unit Scale',
    '绘图单位:': 'Drawing Unit:',
    '2. 目标打印比例分母 (Scale 1:X)': '2. Target Plot Scale Ratio (1:X)',
    '3. CAD 图案填充样式 (Pattern)': '3. CAD Hatch Pattern Select',
    '填充样式:': 'Hatch Pattern:',
    '4. 调试 HATCH 比例因子 (Scale Input)': '4. Adjust HATCH Scale Factor',
    '应用推荐值': 'Apply Recommended',
    '最佳填充比例计算 (CAD Hatch Scale Verdict)': 'Hatch Scale Optimization Verdict',
    '已复制': 'Copied',
    '复制数据': 'Copy Report',
    '最佳推荐填充比例 (Optimal HATCH Scale)': 'Optimal HATCH Scale Factor',
    '在 CAD 填充对话框的 &quot;Scale&quot; 中输入该值': 'Input this value directly into the CAD Hatch dialog Scale field',
    '安全比例区间 (Safety Scale Range)': 'Safety Scale Range Limits',
    '如果低于最小安全比例，极易导致图纸卡顿崩溃！': 'Setting a scale below the minimum will lead to viewport lag and application crashes.',
    '实时图案渲染视口 (Live Hatch Canvas Viewport)': 'Live Hatch Canvas Viewport Preview',
    'MAXHATCH 崩溃危险 (Too Dense)': 'MAXHATCH Crash Danger (Too Dense)',
    '线段密度极大！容易触发 AutoCAD MAXHATCH 限制（默认 100,000 条线），这会导致图纸保存卡死、视口闪退或强制转换为 Solid 填充。': 'Hatch lines count is extremely high! This triggers the AutoCAD MAXHATCH limit, causing viewport freezing, file bloat, or automated solid fill conversion.',
    '密度过大 (Relatively Dense)': 'Relatively Dense (High Line Count)',
    '填充较密，在打印或视口缩放时会导致严重的 CPU 渲染卡顿，文件体积会有所膨胀。建议适当调大比例。': 'Densely populated hatch. May cause plotting lag and file size expansion. Consider raising the scale factor.',
    '图案过稀或空白 (Too Sparse)': 'Empty or Invisible (Too Sparse)',
    '填充图案比例过大，填充线之间间距过宽，在视口中可能呈现为空白（看不见填充线条），让人误以为填充丢失。': 'Spacing between lines is wider than viewport. The pattern will appear blank, making it look as if the hatch is missing.',
    '完美匹配 (Optimal Density)': 'Optimal Balance (Safe Density)',
    '当前比例符合该图纸打印比例，出图线条宽度及渲染性能达到最优状态。': 'Excellent match. Maintains standard line spacing and offers optimal rendering performance.',
    '崩溃原理提示：': 'System Note: ',
    '在 AutoCAD 中，如果 Hatch 比例太小，软件会自动触发 `HPMAXLINES` (默认 100000) 警报。为了防止崩溃，CAD 会将填充强行渲染为 solid (纯色)，或引发长达数分钟的运算死锁。请务必使用优化器提供的安全范围！': 'In AutoCAD, setting a hatch scale too low triggers the HPMAXLINES safety warning. To prevent crashes, CAD will convert it to a solid fill or lock up CPU threads. Use the recommended safety range.'
  },
  // 3. Limits
  'cad-limits-checker/calculator-client.tsx': {
    '页面与比例设置': 'Sheet & Plot Scale Setup',
    '1. 标准图纸规格 (Paper Size)': '1. Standard Sheet Size',
    '图纸规格:': 'Sheet Specification:',
    '2. 纸张摆放 (Orientation)': '2. Page Orientation',
    '横向': 'Landscape',
    '纵向': 'Portrait',
    '纸张摆放:': 'Page Orientation:',
    '3. 绘图单位 (CAD Unit)': '3. Active CAD Units',
    '毫米 (mm)': 'Millimeters (mm)',
    '米 (m)': 'Meters (m)',
    '绘图单位:': 'CAD Units:',
    '4. 打印输出比例 (Output Scale)': '4. Target Output Scale',
    '打印比例:': 'Target Scale:',
    'LIMITS 与网格参数报告': 'LIMITS & GRID Configuration Report',
    '界限范围 (LIMITS Coordinate)': 'Drawing Limits Bounds',
    '模型空间总尺寸:': 'Model Space Total Area:',
    '推荐网格步长 (GRID / SNAP)': 'Recommended GRID & SNAP',
    '建议按 5:1 的子步长设置捕捉对齐': 'It is recommended to align snap spacing at a 5:1 ratio.',
    'AutoCAD 命令行一键生成配置': 'AutoCAD Console Macro Script Generator',
    '已复制': 'Copied',
    '复制命令': 'Copy Commands',
    '模型空间图纸纸张边界与 Grid 预览': 'Model Space Sheet Boundary & Grid Layout',
    '宽度 (Width)': 'Width',
    '高度 (Height)': 'Height',
    'LIMITS 核心提示：': 'LIMITS System Notice: ',
    '配置图纸界限的目的是限制超出图纸范围的误绘，并使得 AutoCAD 的 `GRID` (网格) 只在图纸打印区内呈现。当在布局视口（Viewport）内对齐模型空间时，确保 `LIMITS` 比例与视口 XP 比例倒数一致，可避免“网格超出屏幕”或“网格过密不显示”的现象。': 'Setting limits prevents drafting errors outside bounds and confines the visible GRID to the plot page. In Layout Viewports, aligning LIMITS scale with the viewport XP scale prevents grid density warnings.'
  },
  // 4. Pipe Flow
  'pipe-friction-head-loss/calculator-client.tsx': {
    'PVC / Plastic (塑料/聚氯乙烯)': 'PVC / Plastic Pipe',
    '内壁极光滑，抗腐蚀性好': 'Extremely smooth interior, highly corrosion resistant',
    'Copper / Stainless Steel (铜管/不锈钢管)': 'Copper / Stainless Steel',
    '流体阻力极低，常用于冷热水管': 'Very low friction resistance, ideal for domestic water supply',
    'Welded Steel (普通焊接钢管)': 'Carbon Welded Steel',
    '工业循环水、采暖常备': 'Standard choice for industrial loop circulation and HVAC lines',
    'New Cast Iron (新铸铁管)': 'New Ductile Cast Iron',
    '市政供水主管道常见': 'Commonly used in municipal water distribution mains',
    'Old Corroded Cast Iron (旧锈蚀铸铁管)': 'Corroded / Old Cast Iron',
    '管道结垢、内壁阻力大': 'Severe scaling and interior corrosion, high resistance',
    '输入参数 (Parameters)': 'Design Inputs & Parameters',
    '1. 管道材质参数 (Pipe Material & C-Value)': '1. Piping Material & Hazen-Williams Coefficient (C)',
    '* C 因子（Hazen-Williams 常数）越大代表管壁越光滑。': '* Higher C-factor denotes a smoother interior surface and lower friction.',
    '材质:': 'Material:',
    '2. 设计流量 (Flow Rate Q)': '2. Design Flow Rate (Q)',
    '3. 管道实际内径 (Inner Diameter d)': '3. Pipe Internal Diameter (d)',
    '4. 管道总物理长度 (Length L)': '4. Pipe Total Length (L)',
    '水力学阻力计算报告 (Hydraulics Report)': 'Hydraulics Pressure Drop Report',
    '已复制': 'Copied',
    '复制报告': 'Copy Report',
    '流体流速 (Flow Velocity)': 'Fluid Velocity (V)',
    '重力供水推荐: 0.8 - 1.5 m/s': 'Gravity water supply recommended: 0.8 - 1.5 m/s',
    '摩擦水头损失 (Static Head Loss)': 'Friction Head Loss (hf)',
    '对应总压力损失:': 'Total Static Pressure Drop:',
    '单位水阻梯度 (Unit Loss)': 'Friction Loss Gradient (ΔP/L)',
    '舒适界限: < 0.35 kPa/m': 'Recommended limit: < 0.35 kPa/m',
    '警告：管线压力损失过大或风噪异常！': 'WARNING: Excessive pressure drop or high velocity detected!',
    '单位摩擦梯度为': 'The unit pressure drop is',
    'kPa/m，大幅超越推荐规范界限（0.35 kPa/m），泵站选型需要较大扬程扬程冗余。': 'kPa/m, exceeding standard limits. This will require massive pump sizing head headroom.',
    ' 另外流体流速': ' Additionally, fluid velocity of',
    'm/s 偏高，这极易引发管道水击及磨损噪音。建议增加管道内径。': 'm/s is too high, which can cause water hammer and pipe erosion noise. Consider increasing the ID.',
    '流体阻力与剪切梯度模拟器': 'Pipe Pressure Gradient & Shear Stress Simulator',
    '高静压端': 'High Pressure Inlet',
    '高摩擦阻力损失端': 'High Frictional Drop Outlet',
    '流阻正常端': 'Safe Pressure Drop',
    '管道直径 (d):': 'Pipe Diameter (d):',
    '流动物理提示：': 'Hydraulic Note: ',
    '* 动画展示的是风管中心气流线的流速模拟。流线由蓝转红暗示管道内的压力损失加大（红为高损失区）。使用 Haaland 方程和 Colebrook 管道阻力流体动力学进行精确解算。': '', // bypass
    '流动动画通过管道内流线的移动展示流体的动能变化。管道材质的 C 因子决定管道阻力系数；当管内表面生锈或结垢（如 C 从 150 下滑到 80），管壁边界阻力大幅提升，同流量下的单位摩擦水头损失会以指数倍上涨。': 'Flow line animations simulate fluid kinetic energy. The C-factor determines boundary friction; when pipes corrode or accumulate scale (C drops from 150 to 80), friction increases, causing pressure drop to spike exponentially.'
  },
  // 5. Bolt Torque
  'screw-torque-preload-calculator/calculator-client.tsx': {
    'Grade 4.8 (普通碳钢)': 'Grade 4.8 (Low Carbon Steel)',
    'Grade 5.8 (低碳合金钢)': 'Grade 5.8 (Medium Carbon Steel)',
    'Grade 8.8 (高强中碳钢)': 'Grade 8.8 (High Tensile Quenched & Tempered)',
    'Grade 10.9 (合金钢调质)': 'Grade 10.9 (Alloy Steel Quenched & Tempered)',
    'Grade 12.9 (超高强度合金钢)': 'Grade 12.9 (Super High Tensile Alloy Steel)',
    'Dry Steel (干燥无润滑钢表面)': 'Dry Unlubricated Steel Flange',
    'Lubricated Oil (机油润滑)': 'Medium Machine Oil Lubricated',
    'Zinc Plated (镀锌防腐表面)': 'Zinc Plated (Electroplated)',
    'PTFE / MoS2 (特氟龙/二硫化钼干膜润滑)': 'PTFE / MoS2 Dry Film Lubricated',
    '紧固参数设计 (Inputs)': 'Fastener Design Inputs',
    '1. 螺栓规格 (Bolt Size)': '1. Bolt Thread Specification',
    '公称直径:': 'Nominal Diam:',
    '应力面积:': 'Stress Area:',
    '螺栓规格:': 'Bolt Size:',
    '2. 螺栓强度等级 (Bolt Grade)': '2. Fastener Strength Class',
    '屈服强度:': 'Yield Limit:',
    '强度等级:': 'Thread Grade:',
    '3. 装配表面摩擦状态 (Friction Condition)': '3. Surface Lubrication (Friction K)',
    '摩擦系数 (K):': 'Friction Coefficient (K):',
    '4. 设定张紧力比例 (Preload Rate)': '4. Target Yield Load Ratio',
    '屈服极限': 'of Yield Limit',
    '* 机械工程行业标准安装推荐值为 70% 至 85% 屈服极限。': '* VDI 2230 recommends targeting 70% to 85% of yield strength for assembly preloads.',
    '螺栓防脱紧固力学报告': 'Fastener Clamping & Torque Verdict',
    '已复制': 'Copied',
    '复制数据': 'Copy Report',
    '目标拧紧扭矩 (Torque T)': 'Target Tightening Torque (T)',
    '扭矩扳手设定目标值': 'Target setting for torque wrenches',
    '所需预紧力 (Preload Force F)': 'Target Preload Tension (F)',
    '螺栓受拉拉伸拉力': 'Induced tensile force in bolt shaft',
    '极限屈服承载能力': 'Fastener Yield Capacity Limit',
    '材料拉力屈服阈值': 'Tensile yield load limit of material',
    '屈服断裂警报 (Bolt Yield Danger)！': 'WARNING: Bolt Yielding & Tensile Failure Risk!',
    '张拉预紧力已高达': 'Target preload is set to',
    '。在承受工作外界动载荷（振动或拉力）时，螺栓极易产生永久性塑性伸长（颈缩）导致预紧力崩溃，或者直接剪切/抗拉拉断。': '%. Under active work loads or vibrations, the bolt will plastic yield (necking) and snap.',
    '临界过载警告 (Overload Risk)': 'Warning: High Overload Risk',
    '预紧力偏高（已在屈服限的': 'Fastener is preloaded to',
    '% 处）。装配时如果扭矩控制精度较差，易局部屈服，建议下调装配预紧力百分比。': '% of yield. Small overtorquing will cause local yielding. Consider lowering target ratio.',
    '紧固副受力拉伸模拟器': 'Fastener Joint Tension & Strain Visualizer',
    '张紧力': 'Tension Force',
    '预紧力': 'Preload Force',
    '螺栓颈缩变形': 'Bolt Necking (Yielded)',
    '微量弹性拉伸': 'Elastic Elongation',
    '仿真说明：张力箭线代表螺栓内部的拉力预紧。螺栓中间蓝色/橙色杆件随滑块变化模拟真实的金属受拉伸长。当进入 90% 以上的极限区，杆件被绘制为明显的变细收缩（颈缩模拟）以警示塑性损坏风险。': 'Simulation Note: Blue/orange bar models elastic elongation under tension. When ratio exceeds 90%, localized diameter narrowing (necking) is animated to warn of imminent mechanical shear.'
  },
  // 6. Weld
  'weld-strength-calculator/calculator-client.tsx': {
    'GB E43 / Q235 (中国国标级)': 'GB E43 / Q235 (Carbon Steel Standard)',
    '常用于普通 Q235 碳素结构钢搭接': 'Allowable stress limit under GB 50017 steel structures',
    'GB E50 / Q345 (低合金高强钢)': 'GB E50 / Q345 (Low-Alloy High Strength)',
    '适用于 Q345 (Q355) 等低合金高强度钢结构': 'Allowable stress for high load structural structural layouts',
    'AISC E60XX (美标级)': 'AISC E60XX (USA ASD Standard)',
    'AISC 标准下 E60 焊丝设计容许剪切应力': 'Allowable shear stress limit for E60 electrodes',
    'AISC E70XX (美标高强级)': 'AISC E70XX (USA High-Tensile ASD)',
    '美标最广泛使用的重载钢结构角焊条': 'Allowable shear stress limit for E70 electrodes',
    '角焊缝尺寸与荷载设定': 'Weld Size & Mechanical Load Settings',
    '1. 焊条与结构钢规范强度 (Weld Electrode)': '1. Welding Electrode Specification',
    '焊缝设计强度:': 'Allowable Shear Limit:',
    '2. 焊脚尺寸 (Leg Size hf)': '2. Weld Leg Size (hf)',
    '3. 焊缝设计长度 (Weld Length L)': '3. Weld Physical Length (L)',
    '扣除起落弧弧坑边界缺陷 (扣除 2×hf)': 'Exclude起/落弧 crater deficits (Subtract 2×hf)',
    '4. 剪切/拉伸外载荷 (Load P)': '4. Shear / Tensile Work Load (P)',
    '结构接头承载力评估': 'Weld Joint Load Capacity Verdict',
    '已复制': 'Copied',
    '复制报告': 'Copy Report',
    '设计抗拉极限 (Allowable Load)': 'Allowable Shear Load Limit',
    '焊缝最大安全承载力': 'Maximum safe load capacity of weld',
    '有效喉厚 (Throat Size a)': 'Effective Throat Size (a)',
    '最小承载面计算厚度': 'Minimum structural thickness area',
    '焊缝应力强度利用率': 'Weld Stress Utilization Rate',
    '实际设计负荷比': 'Work load safety ratio percentage',
    '焊缝超载剪切破坏警告！': 'WARNING: Joint Overloaded / Weld Shear Failure!',
    '当前外力荷载为': 'The applied load of',
    'kN，已超越焊缝设计承载限值': 'kN exceeds the weld capacity of',
    'kN (负荷比': 'kN (utilization',
    '%)。焊缝容易发生剪切断裂。建议增大焊脚尺寸或加长焊缝。': '%). Weld is highly susceptible to shear failure. Consider enlarging leg size or length.',
    '高负荷预警 (Weld Highly Stressed)': 'Warning: Weld Highly Stressed',
    '负荷应力比已处于': 'The joint stress utilization has reached',
    '% 的高负荷运转带，建议增大安全冗余。': '%, leaving minimal safety margin. Consider enlarging leg size.',
    '焊缝受力喉厚与破坏带受剪截面模拟': 'Fillet Weld Throat Section & Shear Surface Model',
    '有效喉厚': 'Effective Throat',
    '拉伸载荷 P': 'Tensile Load (P)',
    '物理图示：角焊缝的承载剪切断面是其 45 度角平分线处的“有效喉厚面”（即图中绿/红色虚线）。当外载荷过高，这层截面会因应力剪切而开裂。使用 GB 50017 和 AISC 极限承载规范精确估算安全冗余。': 'Visual Model: Fillet weld shear occurs along the 45-degree bisector, known as the effective throat (dashed line). Under high shear, this plane splits. Solved via AISC/GB allowable structural joint limits.'
  },
  // 7. Spring
  'spring-force-rate-calculator/calculator-client.tsx': {
    'Music Wire / ASTM A228 (高频弹簧钢琴线)': 'Music Wire / ASTM A228 (High Precision)',
    '制造小直径高精密弹簧的最佳之选，拉伸强度极高': 'Optimal for small diameter high-precision mechanical layouts',
    'Carbon Steel / ASTM A229 (碳素弹簧钢线)': 'Carbon Steel / ASTM A229',
    '最普遍的工业用弹簧钢材料': 'Most widely utilized general carbon spring steel wire',
    'Stainless 302 / ASTM A313 (不锈钢弹簧线)': 'Stainless 302 / ASTM A313 (Corrosion Resistant)',
    '耐酸碱、抗腐蚀，在潮湿工况下表现稳定': 'Acid and alkali resistant, stable performance in wet settings',
    'Phosphor Bronze / ASTM B159 (磷青铜线)': 'Phosphor Bronze / ASTM B159 (Conductive)',
    '常用于导电性能要求的电子仪器弹簧片': 'Excellent conductivity, widely used in electrical switch components',
    '弹簧设计尺寸设定': 'Helical Spring Dimensions Setup',
    '1. 弹簧丝材质模量 (Wire Material)': '1. Spring Material Shear Modulus (G)',
    '线材材质:': 'Material:',
    '2. 钢丝线径 (Wire Diam. d)': '2. Wire Diameter (d)',
    '3. 弹簧外径 (Outer Diam. D_out)': '3. Spring Outer Diameter (D_out)',
    '4. 弹簧有效圈数 (Coils n)': '4. Active Coil Count (n)',
    '5. 弹簧自由高度 (Free Height Hf)': '5. Spring Free Height (Hf)',
    '6. 装配压缩位移 (Deflection s)': '6. Compression Deflection (s)',
    '压缩弹簧力学报告 (Mechanical Verdict)': 'Helical Spring Mechanical Performance Verdict',
    '已复制': 'Copied',
    '复制报告': 'Copy Report',
    '压缩弹力回复 (Load Force)': 'Reactive Spring Force (F)',
    '等效于:': 'Equivalent to:',
    'kg 重力': 'kg of mass load',
    '弹簧刚度系数 (Stiffness)': 'Spring Constant / Rate (k)',
    '每压下 1mm 所需作用力': 'Force required per 1mm of axial travel',
    '并紧高度界限 (Solid Height)': 'Solid Height Limit (Hs)',
    '极限位移:': 'Max Deflection Travel:',
    '弹簧完全压实失效 (Solid Height Reached)！': 'WARNING: Solid Height Reached (Spring Bottomed Out)!',
    '当前压缩行程已达到极限位移（': 'Current deflection has reached maximum travel of',
    ' mm）。弹簧圈与圈已紧密贴合，丧失了所有的弹性行程缓冲能力，继续施压将作为钢柱刚性受力。': ' mm. Coils are in solid contact, losing all cushioning capacity and acting as a rigid block.',
    '弹簧旋绕比不佳 (Spring Index Warning)': 'Warning: Unfavorable Spring Index',
    '当前旋绕比 (D/d) 为': 'The current spring index (D/d) is',
    '。机械工程标准规定旋绕比应在 4 至 12 之间。': '. Standard codes recommend keeping it between 4.0 and 12.0.',
    ' 旋绕比过小代表弹簧圈太紧，钢丝弯曲应力过大，极其难卷制制造。': ' An index below 4 indicates too tight coils, causing excessive stress and high manufacturing difficulty.',
    ' 旋绕比过大代表圈径太松，弹簧工作易倾斜，压紧时极易产生失稳扭曲。': ' An index above 12 suggests too loose coils, causing buckling instability during travel.',
    '物理弹簧压缩几何截面预览 (Deflection Simulator)': 'Interactive Deflection Simulator & Stress Visualizer',
    '压缩行程:': 'Travel:',
    '剪切应力:': 'Shear Stress:',
    '物理仿真：弹簧螺线基于自由高度与实际位移的关系实时重算。圈距的物理聚拢生动展示了刚度反力与应力的富集。应力超过极限时，钢丝螺线呈红色（安全隐患区）。': 'Simulation Note: Helix geometry redraws dynamically based on deflection. Visual coil compaction demonstrates stiffness and shear stress buildup. Orange/red wires indicate overstressed zones.'
  }
};

// Execute translations and updates
const translateFiles = () => {
  // 1. First rewrite `src/lib/toolbox-data.ts` third-party descriptions to English
  const toolboxDataPath = path.join(rootDir, 'src', 'lib', 'toolbox-data.ts');
  if (fs.existsSync(toolboxDataPath)) {
    let content = fs.readFileSync(toolboxDataPath, 'utf8');

    // Also update limits checker and ctb visualizer title/desc to explicitly contain ANSI and Print keywords
    content = content.replace(
      /slug:\s*'cad-limits-checker',[\s\S]*?title:\s*'[\s\S]*?',[\s\S]*?description:\s*'[\s\S]*?',[\s\S]*?detailDesc:\s*'[\s\S]*?'/,
      `slug: 'cad-limits-checker',
    title: 'AutoCAD Limits & Grid Boundary (ANSI/ISO Paper Size) Calculator',
    description: 'Quickly configure standard drawing limits, grids, and snap coordinates for standard ANSI, Arch, and ISO paper sizes in model space.',
    detailDesc: 'Input target standard paper size (ANSI A-E, Arch E, ISO A0-A4) and output plotting scale to generate the exact CAD commands for LIMITS and GRID setup.'`
    );

    content = content.replace(
      /slug:\s*'ctb-plot-style-pen-visualizer',[\s\S]*?title:\s*'[\s\S]*?',[\s\S]*?description:\s*'[\s\S]*?'/,
      `slug: 'ctb-plot-style-pen-visualizer',
    title: 'CAD CTB Plot Style (Print Line Weight) Pen Visualizer',
    description: 'Load and inspect color-dependent plot style (CTB) files online to visualize and export pen weights and line thickness calibration print settings.'`
    );

    // Apply 25 third-party descriptions translation
    Object.entries(dataTranslations).forEach(([slug, enDesc]) => {
      const regex = new RegExp(`(slug:\\s*'${slug}',[\\s\\S]*?description:\\s*')[^']+(')`);
      if (regex.test(content)) {
        content = content.replace(regex, `$1${enDesc}$2`);
        console.log(`Translated description in config for: ${slug}`);
      }
    });

    fs.writeFileSync(toolboxDataPath, content, 'utf8');
    console.log('Successfully translated toolbox-data.ts descriptions to English.');
  }

  // 2. Loop through 7 client files, translate Chinese phrases, and update newsletter variant
  Object.entries(clientTranslations).forEach(([filePath, dict]) => {
    const fullPath = path.join(rootDir, 'src', 'app', 'toolbox', filePath);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Update NewsletterSubscribe component to have variant="sidebar" (to prevent background/text styling conflicts)
      content = content.replace('<NewsletterSubscribe />', '<NewsletterSubscribe variant="sidebar" />');

      // Replace Chinese strings with English translations
      Object.entries(dict).forEach(([zhText, enText]) => {
        // Safe string escape for replace
        const escaped = zhText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(escaped, 'g');
        content = content.replace(regex, enText);
      });

      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Translated all Chinese strings and updated newsletter in: ${filePath}`);
    } else {
      console.log(`File not found: ${filePath}`);
    }
  });
};

translateFiles();
console.log('Translation script execution finished successfully!');
