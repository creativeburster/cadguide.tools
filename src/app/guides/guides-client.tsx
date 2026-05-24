'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToolLogo } from '@/components/tool-logo';
import { tools } from '@/lib/data';
import { cn } from '@/lib/utils';
import React from 'react';

// Guide Categories Data (representing the 8 core commercial cards in the "All" view)
interface GuideCategorySection {
  id: string;
  category: 'troubleshooting' | 'performance' | 'printing' | 'standards' | 'deployment' | 'migration' | 'procurement' | 'manufacturing';
  title: string;
  desc: string;
  countLabel: string;
  gradient: string;
  articles: { title: string; slug: string; keyword: string }[];
}

const CATEGORY_SECTIONS: GuideCategorySection[] = [
  {
    id: 'sec-trouble',
    category: 'troubleshooting',
    title: 'CAD Software Troubleshooting',
    desc: 'Diagnose and resolve fatal runtime locks, active memory leaks, registry socket deadlocks, and licensing activation crashes. Recover corrupt engineering DWG/BIM assets and restore unsaved temporary drawing sessions without data loss.',
    countLabel: '450+ Active Guides',
    gradient: 'from-rose-500 via-pink-600 to-red-500',
    articles: [
      { title: 'Fix AutoCAD License Activation Failed (Registry Socket Patch)', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad license' },
      { title: 'Why Autodesk AutoCAD Freezes on Windows 11 Large DWG Files', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad' },
      { title: 'Resolve SolidWorks Price Seat Allocation & EULA Compliance Warnings', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'solidworks price' },
      { title: 'AutoCAD Architecture Fatal Error 0x0024 Recovery Workflow', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad architecture' },
      { title: 'Revit Crash on Launch: Repairing Damaged Local BIM Models', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'revit crash' },
      { title: 'How to Fix FLEXlm Server Socket Binding Error 10048', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'flexlm error' }
    ]
  },
  {
    id: 'sec-perf',
    category: 'performance',
    title: 'Hardware & Performance Optimization',
    desc: 'Calibrate graphic pipeline buffers, override Windows virtualization limits, allocate workstation multi-threading processors, and eliminate graphic rendering stuttering. Optimize geometry cache response on low-end hardware assemblies.',
    countLabel: '380+ Active Guides',
    gradient: 'from-amber-500 via-orange-600 to-yellow-500',
    articles: [
      { title: 'Tuning SolidWorks Free & Pro Suites on Low-End Laptops', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'solidworks free' },
      { title: 'Best GPU Drivers & Hardware Acceleration Settings for Autodesk Inventor', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autodesk inventor' },
      { title: 'Fix Solid Edge Graphics Stuttering & Loading Delays', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'solid edge' },
      { title: 'FreeCAD Custom Settings Migration for Multi-Core Workstations', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'freecad' },
      { title: 'Optimize Catia V6 3D Assembly Loading Cache Protocols', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'catia v6' },
      { title: 'Laptop RAM Allocation Rules for Complex Rhino 3D NURBS Modeling', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'rhino 3d' }
    ]
  },
  {
    id: 'sec-print',
    category: 'printing',
    title: 'Print & PDF Plotting Standards',
    desc: 'Enforce uniform enterprise CTB pen tables, synchronize model and layout spaces, configure high-definition print margins, and fix vector conversion line weight bugs. Automate server-side batch plotting pipelines natively.',
    countLabel: '320+ Active Guides',
    gradient: 'from-teal-500 via-emerald-600 to-cyan-500',
    articles: [
      { title: 'ISO Standard Paper Setups for AutoCAD Online Plotting', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad online' },
      { title: 'How to Batch Print Multiple Drawing Formats in DraftSight', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'draftsight' },
      { title: 'CTB Custom Pen Table Setup for AutoCAD Electrical Blueprints', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad electrical' },
      { title: 'Fix PDF Missing Line Weights and Scrambled Fonts After CAD Export', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'cad software' },
      { title: 'Standardizing Plot Styles: CTB vs STB Pen Tables for Architects', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'plot styles' },
      { title: 'Automating High-Volume Blueprints PDF Plotting on Network Servers', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'batch plotting' }
    ]
  },
  {
    id: 'sec-stand',
    category: 'standards',
    title: 'CAD Industry Standards & Best Practices',
    desc: 'Establish standardized AIA/ANSI layer naming conventions, map mechanical ISO scale parameters, write robust BIM execution plans (BEP), and configure IEC electrical schematics. Build unified design standard frameworks.',
    countLabel: '420+ Active Guides',
    gradient: 'from-blue-500 via-indigo-600 to-violet-500',
    articles: [
      { title: 'ANSI Standard Layer Naming for Commercial CAD Building Designs', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'cad design' },
      { title: 'ISO Standard Dimension Scales for Mechanical Production Drafting', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autodesk autocad' },
      { title: 'IEC Electrical Schematic CAD Drawing Best Practices', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad electrical' },
      { title: 'Enterprise CAD File Archiving & Version Naming Convention Standard', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'cad programs' },
      { title: 'BIM Execution Plan (BEP) Modeling Standards for Public Tenders', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'bim standards' },
      { title: 'AIA CAD Layering Standards for Multi-Disciplinary Coordination', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'layer standards' }
    ]
  },
  {
    id: 'sec-deploy',
    category: 'deployment',
    title: 'Enterprise IT Mass Deployment',
    desc: 'Mass deploy customized CAD MSIs quietly across corporate subnets. Exclude cloud-telemetry checks, map network licensing concurrent daemons on FLEXlm Options, and configure secure SAML 2.0 SSO identity pings.',
    countLabel: '280+ Active Guides',
    gradient: 'from-purple-500 via-violet-600 to-fuchsia-500',
    articles: [
      { title: 'Mass Offline Silent Installation of AutoCAD LT for Corporate Teams', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad lt' },
      { title: 'AutoCAD for Mac: Cross-Platform License Server Deployment Guide', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad for mac' },
      { title: 'How to Budget and Buy AutoCAD Seats: Multi-Version Corporate Domain Setup', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'buy autocad' },
      { title: 'Managing Enterprise Single Sign-On (SSO) for Named CAD Subscriptions', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad license' },
      { title: 'FLEXlm Options File Custom Setup for Group-Based Seat Restrictions', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'flexlm options' },
      { title: 'Silent Deployment Checklists for Autodesk Network License Manager', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'network licensing' }
    ]
  },
  {
    id: 'sec-mig',
    category: 'migration',
    title: 'CAD Software Crossover Migration',
    desc: 'Plan crossover migrations from legacy systems to cost-effective alternatives. Reclaim identical AutoLISP runtimes, import custom PGP aliases and CUIX menus, and translate coordinate databases without losing assembly constraints.',
    countLabel: '250+ Active Guides',
    gradient: 'from-indigo-600 via-purple-600 to-pink-600',
    articles: [
      { title: 'Complete CAD Migration Guide: AutoCAD to BricsCAD Pro Crossover', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'bricscad' },
      { title: 'AutoCAD to GstarCAD Transition Guide: Setting & Command Import', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'bricscad' },
      { title: 'SolidWorks to Inventor Migration: Reclaiming 3D Parametric CAD Integrity', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autodesk inventor' },
      { title: 'Migrating Legacy AutoCAD Drawings to Online Cloud CAD Natively', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'online cad' },
      { title: 'DraftSight to BricsCAD Pro Migration: AutoLISP Command Compatibility', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'draftsight alternative' },
      { title: 'Legacy MicroStation DGN to DWG CAD Translation Standards', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'dwg translation' }
    ]
  },
  {
    id: 'sec-pro',
    category: 'procurement',
    title: 'CAD Procurement & SAM Compliance',
    desc: 'Navigate corporate named-user license budgeting, SAM compliance sweeps, EULA watermarks audit rules, and accumulative SaaS vs Perpetual break-even cost analysis. Reclaim underutilized named-user tokens to optimize corporate budgets.',
    countLabel: '180+ Active Guides',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-500',
    articles: [
      { title: '3-Year Cumulative Cost Analysis: Subscription vs Perpetual CAD', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'buy autocad' },
      { title: 'Named User License Audits: Excluded Non-Commercial Watermarks', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad license' },
      { title: 'AutoCAD LT vs Pro: Optimizing Team Seat Budget Allocations', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad lt' },
      { title: 'Enterprise Software Asset Management (SAM) Compliance Checklists', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'cad software' },
      { title: 'Understanding EULA Seat Allocations for Named Subscriptions', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'autocad license' },
      { title: 'B-End Procurement Guidelines: Reclaiming Idle Named User Tokens', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'buy autocad' }
    ]
  },
  {
    id: 'sec-man',
    category: 'manufacturing',
    title: 'CAM & 3D Printing Production',
    desc: 'Align CAD to CNC G-code conversions, evaluate STL/3MF solid kernel export tolerances, calculate sheet metal folding bend allowances, and optimize 3D slicing standards. Calibrate watertight parametric solid geometries.',
    countLabel: '220+ Active Guides',
    gradient: 'from-orange-500 via-amber-600 to-yellow-600',
    articles: [
      { title: 'Optimizing STEP/IGES Coordinate Translations for CNC Machining', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'cad design' },
      { title: 'STL & 3MF Export Tolerances: Preventing Print Facet Distortion', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'freecad' },
      { title: 'Sheet Metal Bending Allowances: Precision K-Factor Calculations', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'solidworks free' },
      { title: 'CAD/CAM Integration: Enforcing Standard G-Code Feed Rates', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'solid edge' },
      { title: '3D Printing Solid Modeling: Exporting Watertight B-Rep Assemblies', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'freecad' },
      { title: 'CNC Milling Tolerances: Calibrating CAD Geometry Kernels for Mills', slug: 'autocad-fatal-error-0x0024-fix', keyword: 'solidworks free' }
    ]
  }
];

// Flat lists of specific articles to populate filtered view (shows 6 high-density cards for active tabs)
interface GuideArticleCard {
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
}

const ARTICLES_LIST: GuideArticleCard[] = [
  ...CATEGORY_SECTIONS.flatMap(sec => 
    sec.articles.map((art, aIdx) => ({
      id: `${sec.id}-art-${aIdx}`,
      category: sec.category,
      title: art.title,
      excerpt: `Detailed expert blueprint for ${art.title}. Learn active-registry configuration parameters, troubleshooting, and enterprise optimization protocols mapping real search intent.`,
      author: 'Will P. (BIM Architect)',
      readTime: `${5 + (aIdx % 3) * 2} min read`,
      date: 'May 2026',
      softwareSlug: sec.category === 'troubleshooting' ? 'autocad' : 'solidworks',
      keyword: art.keyword,
      slug: art.slug
    }))
  )
];

// Folders database for the collapsible index directory (96 links total, 12 per folder)
interface DirectoryFolder {
  id: string;
  title: string;
  countLabel: string;
  icon: string;
  links: { title: string; href: string }[];
}

const DIRECTORY_FOLDERS: DirectoryFolder[] = [
  {
    id: 'fol-trouble',
    title: 'AutoCAD & 二维制图故障排查 (AutoCAD & 2D Troubleshooting)',
    countLabel: '450+ 篇指南',
    icon: '🔧',
    links: [
      { title: 'AutoCAD 致命错误 0x0024 完整企业级修复流程', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD 注册表激活失败与 Socket 端口死锁解决', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD LT 离线静默安装与企业大批量 silent 部署参数', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD for Mac 跨平台许可证服务器连接与端口绑定配置', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD Online 网页版图纸打印与笔宽 Pen Weights 配置', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD Architecture 命令行丢失与自定义菜单 CUIX 恢复', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD Electrical 继电器元件库与 IEC 图幅模版设置', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '购买 AutoCAD 攻略：单用户订阅与并发网络版席位预算计算', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD 外部参照 (XREF) 路径失效与相对路径批量修复', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD Hatch 填充图案比例过密导致系统卡死解决方法', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD LT 与 Pro 版本功能深度对比及选型指南', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '恢复 AutoCAD 临时自动保存文件 (.sv$ / .ac$) 终极指南', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-perf',
    title: 'SolidWorks & 三维参数化造型优化 (SolidWorks & 3D Performance)',
    countLabel: '380+ 篇指南',
    icon: '🚀',
    links: [
      { title: 'SolidWorks Free 免费版与 Pro 专业版在低配笔记本上的性能优化', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks 价格与 Named User 席位分配 EULA 合规审计避坑', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks 大型装配体卡顿、轻量化加载与显卡硬件加速优化', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '解决 SolidWorks 运行时水滴水印提示与非商业版水印警告', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks 零件建模几何约束 (Constraints) 丢失快速修复', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks Sheet Metal 钣金折弯系数与 K-Factor 算法计算', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks 导出 STEP 文件装配体干涉与破面破线修复', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks PDM 客户端局域网同步延迟与本地缓存清理', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks 焊件结构件属性库与型材切割清单自定义配置', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks 图纸工程图 pen style weights 打印边距微调', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks 与 Autodesk Inventor 协同设计数据无损双向转换', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks 运行内存不足 (Resource Monitor) 警告解决策略', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-standards',
    title: 'BIM 建筑规范与图层制图标准 (BIM & Layer Standards)',
    countLabel: '420+ 篇指南',
    icon: '📐',
    links: [
      { title: 'Revit 启动时崩溃 (Crash on Launch) 本地 BIM 模型快速同步修复', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'BIM 协同设计 Execution Plan (BEP) 模版与 LOD 300/400 规范', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AIA 美国建筑师学会 CAD 图层命名标准与前缀分类过滤规则', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'ANSI 商业建筑制图图层分配标准与企业内部规范模版定制', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'ISO 机械制图标注比例与图幅字体大小标准规范', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Civil 3D 地形曲面与路线道路 Corridor 建模三维最佳实践', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Archicad Teamwork 协同服务器网络映射与多用户连接端口配置', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Navisworks 碰撞检测 (Clash Detection) 规则配置与冲突报告优化', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'BIM 协同格式 BCF 在不同设计软件间的导入导出接口标准', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SketchUp Pro 导入大型 DWG 矢量图卡死与孤立网格清理', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Rhino 3D 复杂 NURBS 曲面转 parametric 实体模型精度控制', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Geotechnical 三维地质分层在 Civil 3D 中的层序可视化配置', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-deploy',
    title: '企业 IT 许可证授权与 Mass 部署 (IT Licensing & Deploy)',
    countLabel: '280+ 篇指南',
    icon: '🖥️',
    links: [
      { title: 'FLEXlm 并发许可证服务器 TCP 27000/2080 端口占用冲突修复', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'FLEXlm Options 文件配置：按用户组 reserve 与 restrict 席位', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '企业单点登录 (SSO) SAML 2.0 在 Named User 订阅中的部署', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Autodesk Desktop Licensing Service background 挂起无法启动解决', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '企业 CAD 席位预算核算：并发与 named 混合授权成本模型', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Windows 11 后台内存虚拟化导致 CAD 授权失效 (EULA 报错) 修复', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '老版本 USB 加密狗 Dongle 驱动冲突导致工程系统闪退排查', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'CAD 软件网络安装包 MSI 封装与 Active Directory 静默部署', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '企业 CAD 网络防火墙设置：关闭遥测上传与保护隐私文件安全', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'LMTools 并发服务器状态查询与多套 vendor daemon 服务配置', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'Named User 离线使用宽限期 (Grace Period) 企业域策略统一配置', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '防止商业违规审计：企业 named 账户实名合规配置指南', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-printing',
    title: '图纸打印、PDF 转换与笔宽 Pen Tables (Printing & PDF Options)',
    countLabel: '320+ 篇指南',
    icon: '🖨️',
    links: [
      { title: 'ISO 标准图纸边距与 pen styles pen weights 绘图机配置规格', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'DraftSight 2D 图纸多排版 layout 空间批量打印 (Batch Plot)', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '自定义 CTB 笔宽颜色映射表与 STB 命名颜色打印配置区别', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '修复 CAD 导出 PDF 格式后矢量文字乱码与线型中断 BUG', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '自动高清晰度 PDF 导出：命令行 LISP 脚本与文件系统自动生成', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '企业出图图纸数字章管理：矢量背景印章与电子签名绑定', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '解决巨幅图纸 PDF 导出因线型文件过大导致打印后台挂起', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'CAD 布局 model space 与 layout space 视口比例快速对齐校正', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '线条粗细比例失调：PDF 线宽在不同矢量查看器中的平滑配置', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '黑白工程图与彩色效果图快速出图：多配置 CTB 文件的灵活绑定', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'DGN 格式与 DWG 格式线型对照 pen weights 转换表配置', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '制图机自动裁纸与边距自动对齐配置：解决图纸边缘缺失 BUG', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-migration',
    title: 'CAD 软件无缝迁移与二开兼容性平移 (Crossover & API Mig)',
    countLabel: '250+ 篇指南',
    icon: '🔄',
    links: [
      { title: '从传统 AutoCAD 完美迁移至 BricsCAD Pro 的全套 checklist', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD 迁移至 GstarCAD：导入自定义 CUIX 菜单与 Hatch 填充', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'SolidWorks 转 Inventor：无缝重建 3D 参数化装配体装配关系', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'DraftSight 与 BricsCAD Pro 的 AutoLISP LISP 二次开发接口兼容性表', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '遗留 DGN 图纸完美转换 DWG 格式：解决层映射与符号转换偏差', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '国产 CAD 替代选型剖析：底层内核、API 接口与大型图纸运行对比', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '免费开源 FreeCAD 与商业 CAD 几何约束逻辑与二次开发对比', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '老旧 AutoCAD LISP 代码移植到廉价替代 CAD 的语法改写补丁', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'GstarCAD 快捷键 PGP 文件与自定义线型文件导入路径对照', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '网页云端 CAD 跨平台兼容性评估：性能瓶颈与网络要求', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'ZWCAD command alias 命令别名及 AutoLISP 运行速度优化', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '从三维 Catia V5 降级导出为二维 DWG 剖面图的映射规范', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-procurement',
    title: '企业采购、许可合规与成本分析 (Procurement & Compliance)',
    countLabel: '180+ 篇指南',
    icon: '💰',
    links: [
      { title: '企业级 CAD 3 年持有累计成本分析：SaaS 租赁与 Perpetual 终身买断对比', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '商业 EULA 合规审计风险排查：严防非商业水印与网络扫描处罚', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'AutoCAD LT 与 Pro 选型配比：精准定制团队席位优化采购预算', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '软件资产管理 (SAM) 合规审核指引：防范不合规浮动授权配置', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '解析单用户命名订阅与 Flex 灵活代币席位购买价值契合点', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '大客户采购攻略：回收闲置 named 用户许可凭证以削减支出', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '海外项目 CAD/BIM 异地合规与全球使用权 (Global Travel Rights) 采购', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '评测主流商业 CAD 的维护合同 (Maintenance Subscription) 升级政策', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '企业二次开发插件的知识产权法律保护与商业分发合规', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '中小企业低预算 CAD 批量采购谈判话术与返利通道拆解', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '多分支机构 Named 席位统一集中化控制与账单管理规范', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '解密 Autodesk 与 SolidWorks 官方合规函处理的最佳实践', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  },
  {
    id: 'fol-manufacturing',
    title: 'CAM 制造、3D 打印与数控精度规范 (CAM & 3D Printing)',
    countLabel: '220+ 篇指南',
    icon: '⚙️',
    links: [
      { title: '优化 STEP & IGES 空间拓扑精度转换：保障数控机床精细切削', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'STL 与 3MF 实体现模导出偏差校准：防范 3D 打印表面多面体失真', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '钣金折弯精准算法规范：K-Factor 折弯系数与展开长度计算', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'CAD/CAM 集成工艺：批量建立与验证标准 CNC G代码进给率', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '3D 打印实体建模技巧：如何从 CAD 导出 100% 密闭无缝的 B-Rep 零件', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '精密数控铣削公差配合：优化 CAD 三维几何内核导出配合参数', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '数控切割路径 (CAM Paths) 尖角过渡减速配置以防工件破损', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '从参数化 CAD 提取装配体防错干涉分析与自动化出图规范', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '激光与水射流切割图纸：闭合曲线扫描与多余重叠线段清理', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '三维打印 3MF 相比 STL 格式在保留材质信息与色彩坐标上的优势', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: 'CAD 模型尺寸与实际注塑成型收缩率配合的逆向调整公式', href: '/guides/autocad-fatal-error-0x0024-fix' },
      { title: '数控车削三维多阶螺纹配合面在 CAD 中的参数化精细刻画', href: '/guides/autocad-fatal-error-0x0024-fix' }
    ]
  }
];

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const mockDirectoryLinks: Record<string, string[]> = {
  'A': [
    'AutoCAD Fatal Error 0x0024 Fix',
    'AutoCAD License Activation Registry Patch',
    'ANSI Layer Naming Standards',
    'Autodesk Inventor Performance Settings',
    'AutoCAD LT Silent Deployments',
    'AutoCAD for Mac Licensing Solutions'
  ],
  'B': [
    'BricsCAD Pro Crossover Migration Guide',
    'Batch Plotting Multi-Sheet Configurations',
    'BIM Collaboration Format (BCF) Standards',
    'BricsCAD LISP API Compatibility Matrix',
    'Budgeting CAD Software Named User Seats'
  ],
  'C': [
    'Crash on Launch troubleshooting for Revit',
    'CTB Custom Pen tables and Line Weights',
    'Concurrent FLEXlm License Server Setup',
    'Corporate Named-User License Compliance',
    'Civil 3D Corridor Modeling Best Practices'
  ],
  'D': [
    'DraftSight High-Speed Printing Setup',
    'DWG File Recovery and Audit Pathways',
    'Drawing Scale Coefficients and Sheet Layouts',
    'Deploying Quiet Network MSIs for Enterprise'
  ],
  'E': [
    'Educational Watermark Removal Legal Policy',
    'Enterprise CAD Identity Provisioning (SAML 2.0)',
    'Electrical Schematic Drafting Guidelines (IEC)',
    'EDA Software Licensing and Server Configuration'
  ],
  'F': [
    'FLEXlm Server Daemon Ports Configuration',
    'FreeCAD Custom Workstation Settings',
    'Freemium CAD Hidden Commercial Liabilities',
    'Fusion 360 Cloud Storage Offline Sync'
  ],
  'G': [
    'GstarCAD Custom Menu and Hatch Import',
    'GPL Compliance for Open Source CAD Kernels',
    'GPU Hardware Acceleration Optimization',
    'Graphics Stuttering and Driver Tuning'
  ],
  'H': [
    'Hardware Specifications for Large Assemblies',
    'Hatch Pattern Scale Custom Settings',
    'High-Density Batch Plotting Servers',
    'Hobbyist vs Professional CAD Feature Matrix'
  ],
  'I': [
    'ISO Standard Dimension Scale Guidelines',
    'IT Deployment Offline Silent Installers',
    'Inventor Parametric Assembly Migration',
    'Identity-Based Licensing Offline Grace Periods'
  ],
  'J': [
    'Jewelry Design CAD Software Selection',
    'Joint Parametric Constraints in FreeCAD',
    'JSON-LD Structured Schemas for CAD Pages',
    'Jobsite BIM Cloud Viewer Deployments'
  ],
  'K': [
    'Kernel Independence for Open Cascade (OCCT)',
    'Keyboard Shortcuts and Command Aliases Reclaim',
    'K-Factor Calculations for Sheet Metal CAD'
  ],
  'L': [
    'License Borrowing Max Durations (FLEXlm)',
    'Line Weight Calibration for PDF Export',
    'LISP Runtime Optimization in Alternatives',
    'Laptop Graphics Tuning for SolidWorks Free'
  ],
  'M': [
    'Migration Checklist: AutoCAD to BricsCAD Pro',
    'Multi-Core Workstation Thread Allocations',
    'Multi-Version Corporate Domain Licensing',
    'MicroStation to AutoCAD Command Translation'
  ],
  'N': [
    'Network Floating License Server Sockets',
    'Named-User Subscription Compliance Sweeps',
    'Net Stop AdskLicensingService Recovery',
    'Native Parametric Constraint Rebuilds'
  ],
  'O': [
    'Open CASCADE Technology (OCCT) Kernel Parameters',
    'Offline Silent Installation of AutoCAD LT',
    'Open-Source CAD GPL License Compliance',
    'Onshape Free Document Privacy Legal Risks'
  ],
  'P': [
    'Perpetual Buyout vs SaaS Rental Cost Analysis',
    'Plotting Pen Weight Standards (ANSI/ISO)',
    'Parametric Model Integrity and STEP Export',
    'Performance Settings for Low-End Laptops'
  ],
  'Q': [
    'Quiet Deployment Parameters for CAD MSIs',
    'Quick Recovery of Unsaved AutoCAD Autosaves',
    'Quality Assurance Guidelines for Drafting Teams'
  ],
  'R': [
    'Registry Port Conflict Troubleshooting (2080)',
    'Revit Crash on Launch Recovery Manual',
    'Restoring Unsaved Temporary Drawing Backups',
    'Reclaiming Custom LISP Menus and Command Aliases'
  ],
  'S': [
    'SolidWorks Seat Allocation and compliance',
    'SSO SAML 2.0 Named User Account Setup',
    'Silent Command Directives for Silent Deployments',
    'STEP File Translation Constraint Preservation'
  ],
  'T': [
    'Tuning Hardware Accel for Solid Edge',
    'Telemetry Control and Cloud Check-In Disables',
    'Temporary sv$ and ac$ File Conversions',
    'TCP Ports 27000 and 2080 Bind Fixes'
  ],
  'U': [
    'Unsaved Drawing Backup Recovery Pathways',
    'User Provisioning SAML Enterprise Identity',
    'USB Dongle Licensing Driver Troubleshooting'
  ],
  'V': [
    'Version Compatibility of DWG Formats',
    'Vector Weight and Pen Priority Tables',
    'Virtualization of Memory on Windows 11 CAD'
  ],
  'W': [
    'Watermark Removal Compliance in Student Files',
    'Windows 11 Background Memory Virtualization Fix',
    'Workstation Graphics Card Configuration Guides'
  ],
  'X': [
    'XML Drawing Schemata Custom Configs',
    'XREF (External Reference) File Path Management',
    'XServer Configuration for CAD Virtual Desktop'
  ],
  'Y': [
    'Yearly CAD Software Cost Projections',
    'Yield Strength Calculations for Sheet Metal',
    'Y-Axis Orientation in CNC Modeling Exports'
  ],
  'Z': [
    'Zero-Match Recommendation Scoring Systems',
    'Z-Buffer Optimization in Real-Time 3D Rendering',
    'ZWCAD command alias and LISP compatibility'
  ]
};

export default function GuidesClient() {
  const [activeTab, setActiveTab] = useState<'all' | 'troubleshooting' | 'performance' | 'printing' | 'standards' | 'deployment' | 'migration' | 'procurement' | 'manufacturing' | 'calculators'>('all');
  
  // State to control collapsible drawer in All Category cards at top
  const [openCardAccordions, setOpenCardAccordions] = useState<Record<string, boolean>>({});
  
  // State to control sitemap folder accordions at bottom (collapsed by default for cleanliness)
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [activeLetter, setActiveLetter] = useState<string>('A');
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

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

  const toggleAccordion = (idx: number) => {
    setOpenAccordion(openAccordion === idx ? null : idx);
  };

  const isAll = activeTab === 'all';
  
  const displayArticles = ARTICLES_LIST.filter(a => a.category === activeTab).slice(0, 6);

  const accordionFaqs = [
    {
      q: 'How can our enterprise reduce annual CAD seat licensing costs safely?',
      a: 'Corporate offices can systematically audit named user logs to reclaim underutilized seats. Migrating general drawing groups from high-priced legacy solutions to modern, high-compatibility alternatives like BricsCAD Pro or GstarCAD can reduce licensing overhead by 50-70% while fully preserving legacy AutoLISP APIs, drawing templates, and key command shortcuts with zero retraining.'
    },
    {
      q: 'What are the compliance and security risks of deploying free CAD platforms?',
      a: 'Free cloud-based CAD engines typically require all user document repositories to remain public under their free tier plans, posing extreme security risks for proprietary engineering designs. Furthermore, using educational licenses for commercial drafting constitutes a direct EULA violation, making companies highly vulnerable to vendor network telemetry audits and sudden legal watermark infections.'
    },
    {
      q: 'How does the named-user subscription offline grace period work for isolated job sites?',
      a: 'Modern named-user subscriptions require local CAD licensing agents to periodically ping licensing servers to verify active entitlements. If engineers work completely offline at isolated project sites, software typically grants a strict 14-day to 30-day offline grace window. Once this period expires, drawing edits are disabled until the computer establishes a secure network connection.'
    },
    {
      q: 'Can we run legacy AutoLISP scripts and custom command menus in cheaper alternatives?',
      a: 'Yes. Premium alternatives (including BricsCAD Pro, ZWCAD, and GstarCAD) feature highly robust LISP runtime environments. You can import your custom enterprise menus (CUIX), hatch patterns, line weights, and command aliases (PGP) directly into the new interface, maintaining complete team productivity from day one.'
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Decorative Visual Header Accent Line */}
      <div className="w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      {/* Header Area */}
      <header className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-12 lg:pt-16 pb-6 text-center">
        <Badge className="bg-blue-600/10 text-blue-700 border-none px-4 py-1 mb-6 font-bold uppercase tracking-widest text-[10px] rounded-full">
          CAD Professional Library
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-none">
          Professional CAD Guides
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed max-w-3xl mx-auto font-medium">
          Zero entry-level tutorials. Pure, B-End engineering blueprints, troubleshooting steps, and hardware tunings, curated by industry architects and IT administrators.
        </p>
      </header>

      {/* Main Grid Container */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 mt-8">
        
        {/* --- CRITICAL: THE 10 HORIZONTAL TOP NAVIGATION TABS (Tab 1 to Tab 10) --- */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-12 border-b border-slate-200 pb-6 w-full">
          {[
            { id: 'all', label: 'All Guides' },
            { id: 'troubleshooting', label: 'Troubleshooting' },
            { id: 'performance', label: 'Performance' },
            { id: 'printing', label: 'Print & PDF' },
            { id: 'standards', label: 'Standards' },
            { id: 'deployment', label: 'IT Deployment' },
            { id: 'migration', label: 'Crossover' },
            { id: 'procurement', label: 'Procurement' },
            { id: 'manufacturing', label: 'CAM & 3D Print' },
            { id: 'calculators', label: 'Calculators' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100 scale-[1.02]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- CRITICAL: 2-COLUMN GRID CONTAINING EIGHT CORE SECTION CARDS WITH INTERNAL ACCORDIONS --- */}
        {isAll ? (
          /* STATE A: "All Guides" displaying 8 Category Cards (Symmetric grid of 4 rows and 2 columns!) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
            {CATEGORY_SECTIONS.map((p, idx) => {
              const isCardOpen = !!openCardAccordions[p.id];
              return (
                <Card
                  key={p.id}
                  className="border-none shadow-[0_24px_48px_-15px_rgba(0,0,0,0.05)] rounded-[32px] p-6 sm:p-8 bg-white relative overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 group animate-in fade-in"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none opacity-40" />

                  <div className="relative z-10 space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Section {idx + 1} Category
                        </span>
                        <Badge variant="outline" className="bg-slate-50 text-slate-500 text-[9px] font-bold border-slate-100 uppercase tracking-wide">
                          {p.countLabel}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                        <span className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${p.gradient}`} />
                        {p.title}
                      </h3>
                      
                      <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                        {p.desc}
                      </p>
                    </div>

                    {/* Collapsible Accordion Container inside Category Card (unfolds all 6 articles!) */}
                    <div
                      className={cn(
                        "transition-all duration-300 ease-in-out overflow-hidden space-y-4",
                        isCardOpen ? "max-h-[700px] pt-4 border-t border-slate-100 opacity-100" : "max-h-0 p-0 opacity-0 pointer-events-none"
                      )}
                    >
                      <ul className="space-y-3 text-xs sm:text-sm">
                        {p.articles.map((art) => (
                          <li key={art.title} className="group/item flex items-start gap-2">
                            <span className="text-blue-600 font-bold shrink-0 mt-0.5">→</span>
                            <div className="flex-1 min-w-0">
                              <Link 
                                href={`/guides/${art.slug}`} 
                                className="font-bold text-slate-800 hover:text-blue-600 transition-colors group-hover/item:underline block leading-snug"
                              >
                                {art.title}
                              </Link>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                                Keyword Mapped: {art.keyword}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-blue-600 hover:underline cursor-pointer">
                        <span onClick={() => setActiveTab(p.category)}>查看该板块全量指南 (450+ 篇) →</span>
                      </div>
                    </div>
                  </div>

                  {/* Accordion Toggle Trigger inside Card */}
                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between w-full">
                    <button
                      onClick={() => toggleCardAccordion(p.id)}
                      className="text-xs font-black text-blue-600 flex items-center gap-1.5 hover:text-blue-500 transition-colors relative z-10"
                    >
                      {/* Rotating Small Triangle Indicator (▶ to ▼) */}
                      <span className={cn(
                        "transform transition-transform text-[8px] font-black shrink-0",
                        isCardOpen ? "rotate-90" : ""
                      )}>
                        ▶
                      </span>
                      <span>{isCardOpen ? '收起热门指南' : `展开热门指南 (${p.articles.length} 篇)`}</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab(p.category)}
                      className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-wider relative z-10"
                    >
                      进入板块 →
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* STATE B: "Category Filtered" displaying 6 Popular Article/Calculators Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {activeTab === 'calculators' ? (
              /* Sub-Calculators View */
              [
                { name: 'CAD Scale & Plot Ratio Calculator', desc: 'Calculate exact scale ratios to prevent print size clipping errors.', slug: 'scale-calculator' },
                { name: 'FLEXlm Concurrency Licensing Tool', desc: 'Verify server sockets and estimate named-user floating allocations.', slug: 'license-calculator' },
                { name: 'ISO Standard Drawing Paper Setup Tool', desc: 'Calibrate paper width and margins for multi-sheet layouts.', slug: 'paper-calculator' },
                { name: 'B-Rep Solid Kernel Tolerances Tool', desc: 'Evaluate coordinate gap thresholds for SolidWorks model exports.', slug: 'tolerance-calculator' },
                { name: 'Enterprise CAD Seat Optimization Matcher', desc: 'Drip budget parameters to find cost-saving AutoCAD alternatives.', slug: 'seat-calculator' },
                { name: 'DWG/STEP Cross-Compatibility Checker', desc: 'Scan and flag read/write file compatibility vectors per version.', slug: 'compatibility-calculator' }
              ].map((calc, idx) => (
                <Card
                  key={idx}
                  className="border-none shadow-[0_24px_48px_-15px_rgba(0,0,0,0.05)] rounded-[32px] p-6 bg-white flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase text-slate-400">
                      <span>Section {idx + 1} Calculator</span>
                      <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">Pure JS</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2 hover:text-blue-600 transition-colors">
                      {calc.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{calc.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold">Category: CAD Practical Tools</span>
                    <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-4 rounded-lg">
                      <Link href="/matchmaker">Launch Calculator →</Link>
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              /* Specific Category Article Cards (Always showing exactly 6 high-density cards) */
              displayArticles.map((art, idx) => {
                const targetTool = tools.find(t => t.slug === art.softwareSlug);
                return (
                  <Card
                    key={art.id}
                    className="border-none shadow-[0_24px_48px_-15px_rgba(0,0,0,0.05)] rounded-[32px] p-6 sm:p-8 bg-white flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 px-2 py-0.5 rounded">
                          Section {idx + 1}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">{art.readTime}</span>
                      </div>
                      
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-3 group-hover:text-blue-600 transition-colors">
                        <Link href={`/guides/${art.slug}`}>{art.title}</Link>
                      </h3>
                      
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium line-clamp-3 mb-6">
                        {art.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-4">
                      {/* Target Software & Author info */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-[9px] flex items-center justify-center">WP</span>
                          <span className="font-semibold text-slate-700">{art.author}</span>
                        </div>
                        {targetTool && (
                          <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100 text-[10px]">
                            <span className="font-bold text-slate-500">Target: {targetTool.name}</span>
                            <span className="text-amber-500 font-bold">★ {targetTool.score.toFixed(1)}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          Keyword: {art.keyword}
                        </span>
                        <Link href={`/guides/${art.slug}`} className="text-xs font-black text-blue-600 hover:underline">
                          Read Guide →
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* --- CRITICAL: THE 2,500-PAGE SEO ALPHABETICAL DIRECTORY (RESTORED & OPTIMIZED FOR 100% CRAWLABILITY) --- */}
        {/* We statically render all letters' content in the DOM and toggle display using class bindings. */}
        {/* This makes 100% of sitemap pathways immediately crawlable by search engine bots in a single fetch! */}
        <section className="mt-24 pt-16 border-t border-slate-200 space-y-8 max-w-4xl mx-auto">
          <div className="text-center">
            <Badge className="bg-emerald-600/10 text-emerald-700 border-none px-4 py-1 mb-4 font-bold uppercase tracking-widest text-[9px] rounded-full">
              SEO Site Index
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              2,500+ Guides Complete A-Z Alphabetical Directory
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
              To secure a flat crawl architecture, search crawlers and design managers can navigate all programmatic listings by title initial.
            </p>
          </div>

          {/* Alphabet bar */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => setActiveLetter(letter)}
                className={`w-8 h-8 rounded-lg text-xs font-black flex items-center justify-center transition-all ${
                  activeLetter === letter
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Alphabet Directory Index Results Card */}
          <div className="space-y-4">
            {alphabet.map((letter) => {
              const activeAlphabetList = mockDirectoryLinks[letter] || ['Additional Guides loading...', 'See Sitemap Index...'];
              const isSelected = activeLetter === letter;

              return (
                <Card 
                  key={letter} 
                  className={cn(
                    "p-6 rounded-[24px] border-none shadow-[0_16px_32px_-10px_rgba(0,0,0,0.03)] bg-white space-y-4 transition-all duration-300",
                    isSelected ? "block animate-in fade-in" : "hidden"
                  )}
                >
                  <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Active Index: Letter &ldquo;{letter}&rdquo;
                    </span>
                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                      Flat Crawl Paths
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    {activeAlphabetList.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-xl transition-all group">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        <Link href="/guides/autocad-fatal-error-0x0024-fix" className="font-bold text-slate-800 group-hover:text-blue-600 hover:underline">
                          {item}
                        </Link>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* --- CRITICAL: THE 2,500-PAGE COLLAPSIBLE SITEMAP DIRECTORY (COLLAPSIBLE FOLDER ACCORDIONS WITH LITTLE TRIANGLES) --- */}
        {/* Render folders in DOM to guarantee 100% crawl-friendliness for search engine indexing. */}
        {/* All folders are collapsed by default to ensure maximum layout spaciousness and elegance. */}
        <section className="mt-24 pt-16 border-t border-slate-200 space-y-8 max-w-4xl mx-auto">
          <div className="text-center">
            <Badge className="bg-emerald-600/10 text-emerald-700 border-none px-4 py-1 mb-4 font-bold uppercase tracking-widest text-[9px] rounded-full">
              Sitemap Folders
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              2,500+ Guides Collapsible Directory Sitemap
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
              点击文件夹右侧的小三角 `▶` 展开高密度专业指南链接网格。全站索引在 DOM 中静态就绪，完美兼容搜索引擎（Googlebot）全量抓取。
            </p>
          </div>

          {/* Collapsible Folders Grid */}
          <div className="space-y-4">
            {DIRECTORY_FOLDERS.map((folder) => {
              const isOpen = !!openFolders[folder.id];

              return (
                <Card 
                  key={folder.id} 
                  className="border-none shadow-[0_16px_32px_-12px_rgba(0,0,0,0.03)] rounded-[24px] bg-white overflow-hidden transition-all duration-300 border border-slate-100/50"
                >
                  {/* Folder Accordion Trigger Header */}
                  <button
                    onClick={() => toggleFolder(folder.id)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-slate-50/50 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl sm:text-2xl shrink-0">{folder.icon}</span>
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                          {folder.title}
                        </h3>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                          Pillar Category Directory
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant="outline" className="bg-slate-50 text-slate-500 text-[8px] font-bold border-slate-100 uppercase tracking-wide">
                        {folder.countLabel}
                      </Badge>
                      {/* Rotating Small Triangle Indicator (折叠为 ▶, 展开旋转 90 度为 ▼) */}
                      <span className={cn(
                        "transform transition-transform text-blue-600 text-xs font-black shrink-0",
                        isOpen ? "rotate-90" : ""
                      )}>
                        ▶
                      </span>
                    </div>
                  </button>

                  {/* Collapsed/Expanded high-density link list container */}
                  <div
                    className={cn(
                      "transition-all duration-300 ease-in-out overflow-hidden border-t border-slate-50 bg-slate-50/20",
                      isOpen ? "max-h-[1200px] p-5 sm:p-6 opacity-100" : "max-h-0 p-0 opacity-0 pointer-events-none"
                    )}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                      {folder.links.map((link, lIdx) => (
                        <div key={lIdx} className="flex items-start gap-2 p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all group">
                          <span className="text-blue-600 font-bold shrink-0 mt-0.5">→</span>
                          <Link 
                            href={link.href} 
                            className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors hover:underline block leading-snug"
                          >
                            {link.title}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Directory Pagination Grid */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-400 text-xs font-black flex items-center justify-center hover:border-slate-300">◀</button>
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-black flex items-center justify-center">1</span>
            <span className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 text-xs font-black flex items-center justify-center hover:border-slate-300 cursor-pointer">2</span>
            <span className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 text-xs font-black flex items-center justify-center hover:border-slate-300 cursor-pointer">3</span>
            <span className="text-slate-400 text-xs px-1 font-bold">...</span>
            <span className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 text-xs font-black flex items-center justify-center hover:border-slate-300 cursor-pointer">50</span>
            <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 text-xs font-black flex items-center justify-center hover:border-slate-300">▶</button>
          </div>
        </section>

        {/* --- CRITICAL: ENTERPRISE FAQ ACCORDION MENU SYSTEM --- */}
        {/* Interactive drawer drawers showing expert B-End procurement and legal advice */}
        <section className="mt-24 max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <Badge className="bg-indigo-600/10 text-indigo-700 border-none px-4 py-1 mb-4 font-bold uppercase tracking-widest text-[9px] rounded-full">
              Q&A Interactive Board
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Enterprise CAD Operations Q&A Board
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
              Select an operational issue below to review detailed deployment recommendations and legal frameworks.
            </p>
          </div>

          <div className="space-y-4">
            {accordionFaqs.map((faq, idx) => {
              const isOpen = openAccordion === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all duration-300"
                >
                  {/* Accordion Trigger Header */}
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-black text-slate-900 hover:bg-slate-50 transition-colors gap-4"
                  >
                    <span>{faq.q}</span>
                    <span className={cn(
                      "transform transition-transform text-blue-600 text-sm font-bold shrink-0",
                      isOpen ? "rotate-180" : ""
                    )}>
                      ▼
                    </span>
                  </button>

                  {/* Accordion Collapsible Content panel */}
                  <div
                    className={cn(
                      "transition-all duration-300 ease-in-out overflow-hidden border-t border-slate-100 bg-slate-50/50",
                      isOpen ? "max-h-96 p-5 opacity-100" : "max-h-0 p-0 opacity-0 pointer-events-none"
                    )}
                  >
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* High Conversion Matchmaker CTA */}
        <section className="mt-24 rounded-[40px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent)] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Evaluate your enterprise CAD requirements dynamically
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              Specify your company&apos;s custom budgets, team sizes, local operating systems, and drafting standard workflows to calculate the ultimate high-precision CAD shortlist.
            </p>
            <div className="pt-2">
              <Button asChild className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest px-10 shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95">
                <Link href="/matchmaker">Launch CAD Matchmaker</Link>
              </Button>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
