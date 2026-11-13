# 🧰 Toolbox Calculator Expansion Roadmap

> 本文件追踪 `/toolbox` 计算器的扩张计划。当前状态：**307 个计算器**（257 原有 + 50 本轮新增）。

---

## 📊 当前计算器统计 (2026-07-20)

| 分类 | 数量 |
| :--- | :---: |
| Calculator | 307 |
| Cheatsheet | 48 |
| Converter | 44 |
| Troubleshoot | 19 |
| **Total** | **418** |

### 计算器领域分布

| 领域 | 数量 | 覆盖状况 |
| :--- | :---: | :--- |
| 机械传动 | 40 | ✅ 充分覆盖 |
| 结构/土木 | 57 | ✅ 充分覆盖 |
| 制造加工 | 34 | ✅ 充分覆盖 |
| 流体力学 | 21 | ✅ 充分覆盖 |
| 电气 | 20 | ✅ 基本覆盖 |
| HVAC/热工 | 14 | ✅ 基本覆盖 |
| AEC/建筑 | 21 | ✅ 本轮新增 12 |
| MEP/消防 | 10 | ✅ 本轮新增 10 |
| 交通/道路 | 8 | ✅ 本轮新增 8 |
| 水利/环境 | 12 | ✅ 本轮新增 7 |
| BIM | 7 | ✅ 基本覆盖 |
| 测量 | 5 | ✅ 基本覆盖 |
| 材料 | 9 | ✅ 基本覆盖 |
| 给排水 | 8 | ✅ 本轮扩充 |
| 声学 | 2 | ✅ 本轮新增 |

---

## 🚀 短期已完成 (Phase 7 — 2026-07-20)

**新增 50 个高频计算器：**

### AEC/建筑 (12)
- [x] rebar-development-length-calculator — 钢筋锚固长度 (ACI 318)
- [x] ada-ramp-slope-calculator — 无障碍坡道坡度 (ADA / IBC)
- [x] parking-capacity-calculator — 停车场容量与车位计算
- [x] window-floor-ratio-calculator — 窗地面积比
- [x] sound-transmission-class-calculator — 隔声等级 STC 计算
- [x] elevator-traffic-calculator — 电梯交通流量分析
- [x] plumbing-fixture-count-calculator — 卫生器具数量 (IPC / IBC)
- [x] roof-drain-size-calculator — 屋面排水口尺寸 (IBC)
- [x] fire-resistance-rating-calculator — 耐火极限计算
- [x] ceiling-grid-calculator — 吊顶龙骨网格
- [x] door-schedule-quantity-calculator — 门表数量统计
- [x] wall-insulation-u-value-calculator — 墙体传热系数 U 值

### 结构/岩土 (8)
- [x] pile-group-efficiency-calculator — 群桩效率系数
- [x] retaining-wall-sliding-calculator — 挡土墙抗滑移稳定
- [x] mat-foundation-stress-calculator — 筏板基础基底应力
- [x] soil-compaction-calculator — 土方压实与最优含水率
- [x] ground-anchor-capacity-calculator — 地锚承载力
- [x] liquefaction-potential-calculator — 砂土液化判定 (SPT)
- [x] pile-lateral-capacity-calculator — 桩基水平承载力
- [x] slope-circular-stability-calculator — 圆弧滑动稳定 (Bishop)

### MEP/消防 (10)
- [x] cable-tray-fill-calculator — 电缆桥架填充率 (NEC)
- [x] lightning-protection-calculator — 防雷保护范围 (NFPA 780)
- [x] fire-hydrant-flow-calculator — 消防栓流量与水压
- [x] smoke-exhaust-calculator — 机械排烟量计算
- [x] gas-pipe-sizing-calculator — 燃气管道流量选型
- [x] hot-water-circulation-calculator — 热水循环管径
- [x] cooling-tower-sizing-calculator — 冷却塔选型
- [x] domestic-water-demand-calculator — 生活给水设计流量
- [x] sump-pump-sizing-calculator — 集水坑排水泵选型
- [x] grease-trap-sizing-calculator — 隔油池选型

### 交通/道路 (8)
- [x] rigid-pavement-calculator — 刚性路面厚度 (PCA)
- [x] stopping-sight-distance-calculator — 停车视距 (AASHTO)
- [x] vertical-curve-calculator — 竖曲线要素 (AASHTO)
- [x] superelevation-calculator — 平曲线超高 (AASHTO)
- [x] horizontal-curve-calculator — 平曲线要素
- [x] traffic-flow-calculator — 交通流量与通行能力
- [x] roundabout-capacity-calculator — 环形交叉口通行能力
- [x] passing-sight-distance-calculator — 超车视距 (AASHTO)

### 水利/环境 (7)
- [x] culvert-sizing-calculator — 涵洞水文选型 (FHWA)
- [x] stormwater-detention-calculator — 雨水调蓄池容积
- [x] sedimentation-tank-calculator — 沉淀池设计
- [x] aeration-tank-calculator — 曝气池需氧量
- [x] chlorine-dose-calculator — 加氯消毒剂量
- [x] pump-station-design-calculator — 泵站设计流量
- [x] reservoir-flood-routing-calculator — 水库调洪演算

### 电气 (5)
- [x] short-circuit-current-calculator — 短路电流计算
- [x] grounding-grid-calculator — 接地网电阻 (IEEE 80)
- [x] arc-flash-calculator — 电弧危害能量 (NFPA 70E)
- [x] motor-efficiency-calculator — 电机效率与损耗
- [x] cable-pull-tension-calculator — 电缆牵引力计算

---

## 📋 中期计划 (Phase 8 — 目标 350 个计算器)

**预估新增 40-50 个，聚焦以下领域：**

### 深化 AEC/建筑 (10)
- [ ] glazing-wind-load-calculator — 幕墙风压计算
- [ ] stair-egress-capacity-calculator — 楼梯疏散能力
- [ ] roof-snow-drift-calculator — 屋面积雪漂移荷载
- [ ] balcony-rail-load-calculator — 阳台栏杆荷载
- [ ] partition-wall-acoustic-calculator — 隔墙隔声量
- [ ] daylight-autonomy-calculator — 采光自主度
- [ ] solar-heat-gain-calculator — 太阳辐射得热
- [ ] building-infiltration-calculator — 建筑渗透风量
- [ ] concrete-curing-time-calculator — 混凝土养护时间
- [ ] rebar-splice-length-calculator — 钢筋搭接长度

### 深化制造/工艺 (8)
- [ ] powder-metallurgy-calculator — 粉末冶金压制力
- [ ] heat-treatment-hardening-calculator — 淬火硬度预测
- [ ] welding-residual-stress-calculator — 焊接残余应力
- [ ] thread-rolling-calculator — 滚螺纹力计算
- [ ] shot-peening-calculator — 喷丸强度计算
- [ ] deep-drawing-calculator — 深冲拉延力
- [ ] ironing-calculator — 变薄拉延计算
- [ ] bend-radius-minimum-calculator — 最小弯曲半径

### 深化电气/自动化 (8)
- [ ] relay-coordination-calculator — 继电保护配合
- [ ] harmonic-distortion-calculator — 谐波畸变率
- [ ] pv-inverter-sizing-calculator — 光伏逆变器选型
- [ ] battery-energy-storage-calculator — 储能系统容量
- [ ] power-quality-calculator — 电能质量指标
- [ ] voltage-sag-calculator — 电压暂降分析
- [ ] transformer-impedance-calculator — 变压器阻抗
- [ ] capacitor-bank-calculator — 电容器组容量

### 深化化工/材料 (6)
- [ ] concrete-durability-calculator — 混凝土耐久性
- [ ] asphalt-mix-design-calculator — 沥青混合料配合比
- [ ] composite-laminate-calculator — 复合材料层合板
- [ ] creep-rate-calculator — 蠕变应变速率
- [ ] fatigue-sn-curve-calculator — 疲劳 S-N 曲线
- [ ] corrosion-allowance-calculator — 腐蚀裕量

### 深化交通/道路 (5)
- [ ] intersection-capacity-calculator — 交叉口通行能力
- [ ] grade-sight-distance-calculator — 坡度视距
- [ ] road-subgrade-cbr-calculator — 路基 CBR 值
- [ ] traffic-signal-timing-calculator — 信号灯配时
- [ ] road-shoulder-width-calculator — 路肩宽度

### 深化水利/环境 (5)
- [ ] water-treatment-dose-calculator — 水处理药剂投加
- [ ] sewer-pipe-capacity-calculator — 排水管渠能力
- [ ] dam-break-analysis-calculator — 溃坝分析
- [ ] groundwater-flow-calculator — 地下水渗流 (Darcy)
- [ ] biogas-production-calculator — 沼气产量估算

---

## 🎯 长期计划 (Phase 9 — 目标 400+ 个计算器)

**预估新增 50-80 个，聚焦新兴与交叉领域：**

### 建筑能耗与碳足迹 (10)
- [ ] building-energy-modeling-calculator — 建筑能耗模拟
- [ ] carbon-footprint-concrete-calculator — 混凝土碳足迹
- [ ] carbon-footprint-steel-calculator — 钢材碳足迹
- [ ] embodied-carbon-calculator — 隐含碳排放
- [ ] operational-carbon-calculator — 运营碳排放
- [ ] leed-daylight-calculator — LEED 采光得分
- [ ] leed-water-calculator — LEED 节水得分
- [ ] hvac-energy-savings-calculator — HVAC 节能率
- [ ] lighting-power-density-calculator — 照明功率密度
- [ ] envelope-u-value-calculator — 围护结构传热

### BIM 数字化 (5)
- [ ] bim-level-of-development-calculator — BIM LOD 等级
- [ ] bim-clash-priority-calculator — 碰撞优先级排序
- [ ] ifc-spatial-structure-validator — IFC 空间结构验证
- [ ] revit-parameter-formula-calculator — Revit 参数公式
- [ ] model-based-quantity-takeoff-calculator — 模型算量

### 智能制造 (8)
- [ ] robot-reach-calculator — 机械臂工作空间
- [ ] robot-payload-calculator — 机械臂负载
- [ ] plc-scan-time-calculator — PLC 扫描周期
- [ ] oee-calculator — 设备综合效率
- [ ] cycle-time-optimization-calculator — 节拍优化
- [ ] predictive-maintenance-calculator — 预测性维护
- [ ] cmm-measurement-calculator — 三坐标测量
- [ ] surface-profile-3d-calculator — 三维表面轮廓

### 新能源 (7)
- [ ] wind-turbine-power-calculator — 风力发电功率
- [ ] wind-turbine-siting-calculator — 风机选址
- [ ] ev-charging-load-calculator — 电动车充电负荷
- [ ] heat-cop-sizing-calculator — 热泵 COP 选型
- [ ] geothermal-loop-calculator — 地源热泵埋管
- [ ] hydrogen-flow-calculator — 氢气管道流量
- [ ] biomass-energy-calculator — 生物质能产量

### 3D 打印/增材制造 (5)
- [ ] sla-cure-time-calculator — SLA 固化时间
- [ ] slm-build-time-calculator — SLM 打印时间
- [ ] support-structure-calculator — 支撑结构用量
- [ ] powder-bed-fusion-calculator — 粉末床熔融参数
- [ ] additive-cost-calculator — 增材制造成本

### 勘察/检测 (5)
- [ ] cbr-test-calculator — CBR 试验计算
- [ ] spt-n-value-calculator — SPT 标贯击数
- [ ] pile-integrity-test-calculator — 桩身完整性检测
- [ ] concrete-strength-rebound-calculator — 回弹法测强
- [ ] ultrasonic-thickness-calculator — 超声测厚

### 其他交叉 (10)
- [ ] lean-six-sigma-sigma-calculator — 六西格玛水平
- [ ] project-network-cpm-calculator — 关键路径法
- [ ] earned-value-calculator — 挣值分析
- [ ] risk-matrix-calculator — 风险矩阵
- [ ] lcca-calculator — 全寿命周期成本
- [ ] construction-schedule-calculator — 施工进度
- [ ] scaffolding-load-calculator — 脚手架荷载
- [ ] crane-lift-plan-calculator — 吊装方案
- [ ] excavation-volume-calculator — 基坑土方
- [ ] concrete-takeoff-calculator — 混凝土算量

---

## 📈 增长预测

| 阶段 | 计算器数量 | 时间节点 | 说明 |
| :--- | :---: | :--- | :--- |
| Phase 7 (已完成) | 307 | 2026-07 | 本轮新增 50 个高频计算器 |
| Phase 8 (中期) | 350-360 | 2026-Q4 | 深化各领域，补 40-50 个 |
| Phase 9 (长期) | 400-430 | 2027-Q1~Q2 | 新兴领域 + 交叉学科 |
| 饱和点 | ~450 | 2027-Q3 | 超过后边际收益递减 |

> **策略建议**：到达 350 后，重心应从"扩量"转向"提质"——增加可视化输出、CSV 导出、单位切换、规范引用等交互功能，提升用户停留时间与页面价值。
