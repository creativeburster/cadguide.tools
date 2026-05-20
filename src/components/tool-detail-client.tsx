"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolLogo } from "@/components/tool-logo";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Globe,
  Cpu,
  Layers,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Zap,
  ArrowRight,
  HelpCircle,
  BarChart3,
  Search,
  Mail,
  Scale,
  Sparkles,
  TrendingUp,
  Plug,
  Award,
  FileText,
  Calendar,
  Tag,
  Languages,
  Cloud,
  Code2,
  Lock,
  Star,
} from "lucide-react";
import { Tool, Category, tools as allTools } from "@/lib/data";
import { linkifyToolNames } from "@/lib/linkify";

interface Props {
  tool: Tool;
  category?: Category;
  alternativeTools: (Tool | undefined)[];
}

export function ToolDetailClient({ tool, category, alternativeTools }: Props) {
  const [activeSection, setActiveSection] = useState("overview");

  // Surface Compatibility / Trust sub-nav entries only when at least
  // one of the underlying fields is populated. Avoids dead anchors on
  // tools that haven't been hand-enriched yet.
  const hasCompatibility = Boolean(
    tool.file_formats_in?.length ||
    tool.file_formats_out?.length ||
    tool.integrations?.length ||
    tool.api_sdk ||
    tool.deployment_options?.length ||
    tool.languages?.length,
  );
  const hasTrust = Boolean(
    tool.external_ratings?.length ||
    tool.support_channels?.length ||
    tool.security_compliance?.length ||
    tool.license_types?.length,
  );

  const menuItems = [
    { id: "overview", label: "Overview", icon: <Layers className="w-3.5 h-3.5" /> },
    {
      id: "pricing",
      label: "Pricing Plans",
      icon: <CreditCard className="w-3.5 h-3.5" />,
    },
    {
      id: "features",
      label: "Key Features",
      icon: <Zap className="w-3.5 h-3.5" />,
    },
    {
      id: "specs",
      label: "Tech Specs",
      icon: <BarChart3 className="w-3.5 h-3.5" />,
    },
    ...(hasCompatibility
      ? [
          {
            id: "compatibility",
            label: "Compatibility",
            icon: <Plug className="w-3.5 h-3.5" />,
          },
        ]
      : []),
    ...(hasTrust
      ? [{ id: "trust", label: "Trust", icon: <Award className="w-3.5 h-3.5" /> }]
      : []),
    {
      id: "reviews",
      label: "Pros & Cons",
      icon: <MessageSquare className="w-3.5 h-3.5" />,
    },
    { id: "faq", label: "FAQ", icon: <HelpCircle className="w-3.5 h-3.5" /> },
    {
      id: "alternatives",
      label: "Alternatives",
      icon: <Search className="w-3.5 h-3.5" />,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map((m) => m.id);
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 250 && rect.bottom >= 250;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // offsetTop is relative to offsetParent (not always the body),
      // which made the previous window.scrollTo no-op when sections were
      // nested inside positioned containers. scrollIntoView walks the
      // ancestor chain correctly, and `scroll-mt-36` on each section
      // already accounts for the sticky sub-nav.
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Build ID string for mass comparison (current + alts)
  const allRelatedIds = [
    tool.id,
    ...alternativeTools.filter(Boolean).map((a) => a!.id),
  ].join(",");

  // Get trending tools for the same category
  const trendingTools = allTools
    .filter((t) => t.category_id === tool.category_id && t.id !== tool.id)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="bg-[#fcfdfe] min-h-screen pb-20">
      {/* Top Header - Standardized Width */}
      <div className="bg-white border-b py-4 md:py-6">
        <div className="w-full max-w-[1360px] mx-auto px-3 md:px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 min-w-0">
            <div className="flex items-center text-sm font-bold text-slate-400 min-w-0 flex-1">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 opacity-30" />
              <Link
                href="/tools"
                className="hover:text-blue-600 transition-colors"
              >
                Tools
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 opacity-30 shrink-0" />
              <span className="text-slate-900 font-black truncate">{tool.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1360px] mx-auto px-4 py-6 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-start w-full">
          {/* Main Content Area (Two Column Layout) */}
          <main className="flex-1 space-y-12 md:space-y-20 min-w-0">
            {/* Hero Section */}
            <section
              id="overview"
              className="bg-white rounded-[24px] md:rounded-[48px] p-5 md:p-14 border border-slate-100 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-blue-600/5 rounded-full blur-[120px] -mr-24 -mt-24 md:-mr-48 md:-mt-48 hidden sm:block"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10 mb-8 md:mb-12">
                  <ToolLogo
                    slug={tool.slug} src={tool.logo_url}
                    websiteUrl={tool.official_url}
                    name={tool.name}
                    className="w-20 h-20 md:w-40 md:h-40 rounded-[24px] md:rounded-[40px] shadow-2xl border-2 md:border-4 border-white shrink-0 bg-white"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <Badge className="bg-blue-600 text-white border-none font-black px-4 py-1.5 uppercase tracking-[0.2em] text-[10px]">
                        {category?.name}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-slate-50 text-slate-500 border-slate-100 font-bold px-4"
                      >
                        {tool.pricing_type}
                      </Badge>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight leading-tight break-words">
                      {tool.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 md:gap-8">
                      <div className="flex items-center gap-2 bg-yellow-50 px-5 py-2 rounded-2xl border border-yellow-100">
                        <span className="text-yellow-600 font-black text-2xl">
                          ★ {tool.score}
                        </span>
                        <span className="text-yellow-700/50 text-[10px] font-black tracking-widest uppercase">
                          Expert Score
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 font-bold">
                        <Globe className="w-5 h-5 text-blue-500" />
                        <span className="text-sm">
                          Origin:{" "}
                          <span className="text-slate-900">{tool.country}</span>
                        </span>
                      </div>
                      {tool.version && (
                        <div className="flex items-center gap-3 text-slate-500 font-bold">
                          <Tag className="w-5 h-5 text-indigo-500" />
                          <span className="text-sm">
                            Version:{" "}
                            <span className="text-slate-900">
                              {tool.version}
                            </span>
                          </span>
                        </div>
                      )}
                      {tool.last_updated && (
                        <div className="flex items-center gap-3 text-slate-500 font-bold">
                          <Calendar className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm">
                            Updated:{" "}
                            <span className="text-slate-900">
                              {tool.last_updated}
                            </span>
                          </span>
                        </div>
                      )}
                      {typeof tool.free_trial_days === "number" &&
                        tool.free_trial_days > 0 && (
                          <Badge className="bg-green-600 text-white border-none font-black px-4 py-1.5 rounded-2xl uppercase tracking-widest text-[10px]">
                            {tool.free_trial_days}-day free trial
                          </Badge>
                        )}
                    </div>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-base md:text-2xl text-slate-600 leading-relaxed font-medium mb-6 md:mb-10">
                    {linkifyToolNames(tool.description, allTools, {
                      currentSlug: tool.slug,
                      className:
                        "text-blue-600 hover:text-blue-700 underline decoration-blue-200 hover:decoration-blue-500 transition-colors",
                    })}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mb-10">
                    <Button
                      asChild
                      className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black h-12 md:h-14 px-6 md:px-10 shadow-xl shadow-blue-200"
                    >
                      <a
                        href={tool.affiliate_url || tool.official_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 md:gap-3 text-base md:text-lg"
                      >
                        Go to Website <ExternalLink className="w-5 h-5" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-2xl border-blue-100 text-blue-600 hover:bg-blue-50 font-black h-12 md:h-14 px-5 md:px-8 text-base md:text-lg"
                    >
                      <Link
                        href={`/compare?ids=${tool.id}`}
                        className="flex items-center gap-3"
                      >
                        <Scale className="w-5 h-5" /> Compare with another tool
                      </Link>
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {tool.core_features?.map((feat, i) => (
                      <span
                        key={i}
                        className="bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-sm font-black border border-slate-100"
                      >
                        #{feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Sub-nav (Horizontal Sticky)
                Strategy:
                - On narrow viewports: icon-only buttons, horizontally
                  scrollable with edge fade gradients so users can tell
                  there's more content off-screen.
                - On md+: icon + label inline, labels visible.
                - On lg+: gap widens so the bar fills the column.
                The label still has `sr-only` on narrow widths so screen
                readers and the title= tooltip both expose the full name. */}
            <div className="sticky top-20 z-40 py-2 bg-[#fcfdfe]/80 backdrop-blur-md">
              <div className="relative">
                {/* Left & right fade gradients telegraph horizontal scroll. */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-6 z-10 bg-gradient-to-r from-white to-transparent rounded-l-[20px]" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-6 z-10 bg-gradient-to-l from-white to-transparent rounded-r-[20px]" />
                <nav
                  aria-label="Section navigation"
                  className="scrollbar-none flex items-center gap-0.5 md:gap-1 lg:gap-1.5 bg-white border border-slate-100 rounded-[20px] p-1 shadow-xl shadow-slate-200/20 overflow-x-auto whitespace-nowrap"
                >
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollTo(item.id)}
                      title={item.label}
                      aria-label={item.label}
                      className={`shrink-0 inline-flex items-center gap-1 px-1.5 md:px-2 py-1.5 rounded-[12px] text-[9px] lg:text-[10px] font-black uppercase tracking-wider transition-all ${
                        activeSection === item.id
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                          : "text-slate-400 hover:text-slate-900"
                      }`}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      <span className="hidden md:inline">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {[
                {
                  icon: <Cpu className="w-6 h-6" />,
                  label: "Geometry Kernel",
                  value: tool.tech_specs?.engine,
                },
                {
                  icon: <Layers className="w-6 h-6" />,
                  label: "Industry Standards",
                  value: tool.tech_specs?.standards?.slice(0, 2).join(", "),
                },
                {
                  icon: <ShieldCheck className="w-6 h-6" />,
                  label: "Market Seg.",
                  value: tool.user_scales?.[0],
                },
                {
                  icon: <CreditCard className="w-6 h-6" />,
                  label: "Starting At",
                  value: `$${tool.starting_price}`,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white p-5 md:p-8 rounded-[20px] md:rounded-[36px] border border-slate-100 shadow-sm flex flex-col items-center text-center transition-all hover:border-blue-200 hover:-translate-y-1"
                >
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-400 mb-3 md:mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                    {stat.label}
                  </div>
                  <div className="font-black text-slate-900 text-base">
                    {stat.value || "N/A"}
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Section */}
            <section id="pricing" className="scroll-mt-36 space-y-6 md:space-y-10">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 shadow-sm">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                  Full Pricing Breakdown
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {tool.pricing_tiers?.map((tier, i) => (
                  <Card
                    key={i}
                    className={`rounded-[24px] md:rounded-[44px] overflow-hidden border-2 transition-all hover:shadow-2xl ${tier.is_popular ? "border-blue-600 shadow-xl md:scale-[1.03]" : "border-slate-100"}`}
                  >
                    {tier.is_popular && (
                      <div className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] text-center py-3">
                        Recommended
                      </div>
                    )}
                    <CardHeader className="text-center p-6 md:p-10 pb-4 md:pb-6">
                      <div className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-4">
                        {tier.name}
                      </div>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl md:text-5xl font-black text-slate-900">
                          ${tier.price}
                        </span>
                        <span className="text-slate-400 font-bold text-sm tracking-tight">
                          {tier.period}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-10 pt-4">
                      <Separator className="mb-8 opacity-40" />
                      <ul className="space-y-5 mb-10">
                        {tier.features?.map((f, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-4 text-sm font-bold text-slate-600 leading-tight"
                          >
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Button
                        asChild
                        className={`w-full rounded-[20px] font-black h-14 text-base transition-all active:scale-95 text-white ${tier.is_popular ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200" : "bg-slate-900 hover:bg-slate-800"}`}
                      >
                        <Link href={tool.official_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                          Choose {tier.name}
                          <ExternalLink className="w-4 h-4 opacity-70" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="scroll-mt-36 space-y-6 md:space-y-10">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                  <Zap className="w-6 h-6" />
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                  Key Capabilities
                </h2>
              </div>

              <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden divide-y divide-slate-100 shadow-sm">
                {tool.detailed_features?.map((cat, i) => (
                  <div key={i} className="p-6 md:p-8">
                    <h3 className="font-black text-slate-900 mb-4 uppercase text-[10px] tracking-[0.2em] text-slate-400 flex items-center gap-4">
                      {cat.category}{" "}
                      <div className="h-px bg-slate-100 flex-1"></div>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3">
                      {cat.items?.map((item, j) => (
                        <div key={j} className="flex items-center gap-2 group">
                          {item.status ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-slate-200 shrink-0" />
                          )}
                          <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors leading-tight">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tech Specs Section */}
            <section id="specs" className="scroll-mt-36 space-y-6 md:space-y-10">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                  Technical Audit
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="rounded-[24px] md:rounded-[40px] p-6 md:p-10 border-slate-100 shadow-sm">
                  <h4 className="font-black text-slate-900 mb-8 uppercase text-[10px] tracking-widest text-slate-400">
                    Environment Support
                  </h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center text-base">
                      <span className="font-bold text-slate-500">
                        Certified OS
                      </span>
                      <span className="font-black text-slate-900">
                        {tool.platforms.join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-base">
                      <span className="font-bold text-slate-500">
                        Multi-threading
                      </span>
                      <span className="font-black text-slate-900">
                        {tool.tech_specs?.multicore}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-base">
                      <span className="font-bold text-slate-500">
                        GPU Optimization
                      </span>
                      <span className="font-black text-slate-900">
                        {tool.tech_specs?.gpu_optimization}
                      </span>
                    </div>
                  </div>
                </Card>
                <Card className="rounded-[24px] md:rounded-[40px] p-6 md:p-10 border-slate-100 shadow-sm">
                  <h4 className="font-black text-slate-900 mb-8 uppercase text-[10px] tracking-widest text-slate-400">
                    Industry Standards
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {tool.tech_specs?.standards.map((s) => (
                      <Badge
                        key={s}
                        className="bg-slate-50 text-slate-600 border-slate-100 font-black px-4 py-2 rounded-xl"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            </section>

            {/* Compatibility Section (only when we have enrichment data) */}
            {hasCompatibility && (
              <section id="compatibility" className="scroll-mt-36 space-y-6 md:space-y-10">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Plug className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                    Compatibility & Interoperability
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {(tool.file_formats_in?.length ||
                    tool.file_formats_out?.length) && (
                    <Card className="rounded-[24px] md:rounded-[40px] p-6 md:p-10 border-slate-100 shadow-sm">
                      <h4 className="font-black text-slate-900 mb-8 flex items-center gap-3 uppercase text-[10px] tracking-widest text-slate-400">
                        <FileText className="w-4 h-4" /> File Format Support
                      </h4>
                      {tool.file_formats_in &&
                        tool.file_formats_in.length > 0 && (
                          <div className="mb-6">
                            <div className="text-xs font-black text-slate-500 mb-3 uppercase tracking-wider">
                              Import
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {tool.file_formats_in.map((f) => (
                                <Badge
                                  key={f}
                                  className="bg-blue-50 text-blue-700 border-blue-100 font-black px-3 py-1 rounded-lg"
                                >
                                  {f}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      {tool.file_formats_out &&
                        tool.file_formats_out.length > 0 && (
                          <div>
                            <div className="text-xs font-black text-slate-500 mb-3 uppercase tracking-wider">
                              Export
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {tool.file_formats_out.map((f) => (
                                <Badge
                                  key={f}
                                  className="bg-purple-50 text-purple-700 border-purple-100 font-black px-3 py-1 rounded-lg"
                                >
                                  {f}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                    </Card>
                  )}
                  {tool.integrations && tool.integrations.length > 0 && (
                    <Card className="rounded-[24px] md:rounded-[40px] p-6 md:p-10 border-slate-100 shadow-sm">
                      <h4 className="font-black text-slate-900 mb-8 flex items-center gap-3 uppercase text-[10px] tracking-widest text-slate-400">
                        <Plug className="w-4 h-4" /> Native Integrations
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {tool.integrations.map((int) => (
                          <Badge
                            key={int}
                            className="bg-slate-50 text-slate-700 border-slate-100 font-black px-3 py-1.5 rounded-lg"
                          >
                            {int}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  )}
                  {tool.deployment_options &&
                    tool.deployment_options.length > 0 && (
                      <Card className="rounded-[24px] md:rounded-[40px] p-6 md:p-10 border-slate-100 shadow-sm">
                        <h4 className="font-black text-slate-900 mb-8 flex items-center gap-3 uppercase text-[10px] tracking-widest text-slate-400">
                          <Cloud className="w-4 h-4" /> Deployment Options
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {tool.deployment_options.map((d) => (
                            <Badge
                              key={d}
                              className="bg-emerald-50 text-emerald-700 border-emerald-100 font-black px-3 py-1.5 rounded-lg"
                            >
                              {d}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    )}
                  {tool.languages && tool.languages.length > 0 && (
                    <Card className="rounded-[24px] md:rounded-[40px] p-6 md:p-10 border-slate-100 shadow-sm">
                      <h4 className="font-black text-slate-900 mb-8 flex items-center gap-3 uppercase text-[10px] tracking-widest text-slate-400">
                        <Languages className="w-4 h-4" /> Interface Languages
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {tool.languages.map((l) => (
                          <Badge
                            key={l}
                            className="bg-slate-50 text-slate-700 border-slate-100 font-black px-3 py-1.5 rounded-lg"
                          >
                            {l}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  )}
                  {tool.api_sdk &&
                    (tool.api_sdk.has_api || tool.api_sdk.has_sdk) && (
                      <Card className="rounded-[24px] md:rounded-[40px] p-6 md:p-10 border-slate-100 shadow-sm md:col-span-2">
                        <h4 className="font-black text-slate-900 mb-8 flex items-center gap-3 uppercase text-[10px] tracking-widest text-slate-400">
                          <Code2 className="w-4 h-4" /> API & Developer Access
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-8">
                          {tool.api_sdk.has_api && (
                            <div>
                              <div className="text-xs font-black text-slate-500 mb-2 uppercase tracking-wider">
                                API
                              </div>
                              <div className="text-base font-black text-slate-900">
                                {tool.api_sdk.api_type || "Available"}
                              </div>
                            </div>
                          )}
                          {tool.api_sdk.has_sdk &&
                            tool.api_sdk.sdk_languages?.length && (
                              <div>
                                <div className="text-xs font-black text-slate-500 mb-2 uppercase tracking-wider">
                                  SDK Languages
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {tool.api_sdk.sdk_languages.map((l) => (
                                    <Badge
                                      key={l}
                                      className="bg-slate-50 text-slate-700 border-slate-100 font-black px-3 py-1 rounded-lg text-xs"
                                    >
                                      {l}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          {tool.api_sdk.docs_url && (
                            <a
                              href={tool.api_sdk.docs_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 font-black text-sm inline-flex items-center gap-2 sm:col-span-2"
                            >
                              View API Documentation{" "}
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </Card>
                    )}
                </div>
              </section>
            )}

            {/* Trust & Support Section (only when we have enrichment data) */}
            {hasTrust && (
              <section id="trust" className="scroll-mt-36 space-y-6 md:space-y-10">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                    <Award className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                    Trust & Support
                  </h2>
                </div>
                {tool.external_ratings && tool.external_ratings.length > 0 && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tool.external_ratings.map((r, i) => (
                      <Card
                        key={i}
                        className="rounded-[32px] p-8 border-slate-100 shadow-sm bg-white"
                      >
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                          {r.source}
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                          <span className="text-4xl font-black text-slate-900">
                            {r.score.toFixed(1)}
                          </span>
                          <span className="text-slate-400 font-bold text-lg">
                            / {r.max}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-500">
                          Based on {r.count.toLocaleString()} reviews
                        </div>
                        {r.url && (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-4 text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-wider"
                          >
                            Read reviews <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-8">
                  {tool.support_channels &&
                    tool.support_channels.length > 0 && (
                      <Card className="rounded-[24px] md:rounded-[40px] p-6 md:p-10 border-slate-100 shadow-sm">
                        <h4 className="font-black text-slate-900 mb-8 flex items-center gap-3 uppercase text-[10px] tracking-widest text-slate-400">
                          <MessageSquare className="w-4 h-4" /> Support Channels
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {tool.support_channels.map((c) => (
                            <Badge
                              key={c}
                              className="bg-blue-50 text-blue-700 border-blue-100 font-black px-3 py-1.5 rounded-lg"
                            >
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    )}
                  {tool.security_compliance &&
                    tool.security_compliance.length > 0 && (
                      <Card className="rounded-[24px] md:rounded-[40px] p-6 md:p-10 border-slate-100 shadow-sm">
                        <h4 className="font-black text-slate-900 mb-8 flex items-center gap-3 uppercase text-[10px] tracking-widest text-slate-400">
                          <Lock className="w-4 h-4" /> Security & Compliance
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {tool.security_compliance.map((c) => (
                            <Badge
                              key={c}
                              className="bg-emerald-50 text-emerald-700 border-emerald-100 font-black px-3 py-1.5 rounded-lg"
                            >
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    )}
                  {tool.license_types && tool.license_types.length > 0 && (
                    <Card className="rounded-[24px] md:rounded-[40px] p-6 md:p-10 border-slate-100 shadow-sm md:col-span-2">
                      <h4 className="font-black text-slate-900 mb-8 flex items-center gap-3 uppercase text-[10px] tracking-widest text-slate-400">
                        <Tag className="w-4 h-4" /> License Types
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {tool.license_types.map((l) => (
                          <Badge
                            key={l}
                            className="bg-slate-50 text-slate-700 border-slate-100 font-black px-3 py-1.5 rounded-lg"
                          >
                            {l}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              </section>
            )}

            {/* Pros & Cons Section */}
            <section id="reviews" className="scroll-mt-36 space-y-6 md:space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 md:p-12 rounded-[24px] md:rounded-[48px] border-4 border-green-50 shadow-sm">
                  <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" /> The Pros
                  </h3>
                  <ul className="space-y-5">
                    {tool.pros.map((pro, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-5 p-5 bg-green-50/40 rounded-[24px] text-base font-black text-slate-700 leading-snug"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2.5 shrink-0"></div>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-6 md:p-12 rounded-[24px] md:rounded-[48px] border-4 border-red-50 shadow-sm">
                  <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
                    <XCircle className="w-8 h-8 text-red-500" /> The Cons
                  </h3>
                  <ul className="space-y-5">
                    {tool.cons.map((con, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-5 p-5 bg-red-50/40 rounded-[24px] text-base font-black text-slate-700 leading-snug"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2.5 shrink-0"></div>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Verdict Highlight */}
              <div className="bg-slate-900 text-white rounded-[28px] md:rounded-[56px] p-6 md:p-16 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-[150px] -mt-[150px] md:-mr-[250px] md:-mt-[250px] hidden sm:block"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 md:gap-5 mb-8 md:mb-12">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 shrink-0">
                      <ShieldCheck className="w-6 h-6 md:w-9 md:h-9 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-3xl font-black tracking-tight">
                        CADGuide Verdict
                      </h3>
                      <p className="text-blue-400 font-black uppercase text-[10px] tracking-[0.4em] mt-1">
                        Final Professional Conclusion
                      </p>
                    </div>
                  </div>
                  <p className="text-lg md:text-3xl lg:text-4xl text-blue-50 font-black leading-tight italic mb-8 md:mb-12">
                    "{tool.expert_verdict}"
                  </p>
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-white/5 pt-6 md:pt-12 gap-6 md:gap-8">
                    <div className="flex items-center gap-4">
                      <ToolLogo
                        slug={tool.slug} src={tool.logo_url}
                        websiteUrl={tool.official_url}
                        name={tool.name}
                        className="w-14 h-14 rounded-2xl bg-white p-1"
                      />
                      <div>
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                          Editor Score
                        </div>
                        <div className="text-3xl font-black">
                          {tool.score}{" "}
                          <span className="text-blue-400">/ 5.0</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-blue-600 text-white font-black px-6 py-2 rounded-xl text-sm">
                      Highly Recommended
                    </Badge>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="scroll-mt-36 space-y-6 md:space-y-10">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                  Expert Q&A
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {tool.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm group hover:border-blue-200 transition-all"
                  >
                    <h4 className="font-black text-slate-900 mb-6 text-lg flex items-start gap-4">
                      <span className="text-blue-600 opacity-20 text-4xl leading-none">
                        ?
                      </span>
                      {faq.q}
                    </h4>
                    <p className="text-slate-600 text-base leading-relaxed font-medium pl-8">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Alternatives Section */}
            <section id="alternatives" className="scroll-mt-36 space-y-6 md:space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
                    <Search className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                    Compare Alternatives
                  </h2>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-2xl border-blue-100 text-blue-600 font-black h-12 px-8 hover:bg-blue-50"
                >
                  <Link
                    href={`/compare?ids=${allRelatedIds}`}
                    className="flex items-center gap-2"
                  >
                    <Scale className="w-4 h-4" /> Compare All{" "}
                    {alternativeTools.length + 1} Tools
                  </Link>
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {alternativeTools.map(
                  (alt) =>
                    alt && (
                      <Card
                        key={alt.id}
                        className="p-6 md:p-10 text-center rounded-[24px] md:rounded-[48px] border-slate-100 hover:border-blue-600 transition-all group shadow-sm hover:shadow-2xl"
                      >
                        <ToolLogo
                          slug={alt.slug} src={alt.logo_url}
                          websiteUrl={alt.official_url}
                          name={alt.name}
                          className="w-20 h-20 mx-auto mb-8 rounded-3xl shadow-sm border border-slate-50 group-hover:scale-110 transition-all duration-500"
                        />
                        <h5 className="font-black text-xl mb-2">{alt.name}</h5>
                        <div className="text-yellow-500 font-black text-sm mb-8">
                          ★ {alt.score}{" "}
                          <span className="text-slate-300">/ 5.0</span>
                        </div>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full rounded-[20px] font-black h-14 hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <Link href={`/tools/${alt.slug}`}>Read Analysis</Link>
                        </Button>
                      </Card>
                    ),
                )}
              </div>
              <div className="text-center pt-2">
                <Link
                  href={`/alternatives/${tool.slug}`}
                  className="inline-flex items-center gap-2 text-blue-600 font-black hover:underline"
                >
                  See the full {tool.name} alternatives guide →
                </Link>
              </div>
            </section>
          </main>

          {/* Right Sidebar - Conversion & Tools */}
          <aside className="w-full lg:w-[400px] space-y-6 md:space-y-10">
            <div className="lg:sticky lg:top-28 space-y-6 md:space-y-10">
              {/* Primary Purchase Card */}
              <Card className="rounded-[24px] md:rounded-[40px] border-2 border-blue-600 shadow-2xl shadow-blue-900/10 overflow-hidden flex flex-col group bg-[#0f172a]">
                <div className="bg-[#0f172a] text-white p-6 md:p-10 pb-6 md:pb-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/20 transition-colors"></div>
                  <div className="relative z-10">
                    <div className="text-blue-400 font-black uppercase text-[10px] tracking-[0.3em] mb-4">
                      Official Release
                    </div>
                    <div className="text-2xl md:text-4xl font-black leading-tight">
                      Get Licensed <br />
                      {tool.name}
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 md:p-10 flex-1 bg-white relative z-10">
                  <div className="flex items-baseline gap-2 mb-6 md:mb-10">
                    <span className="text-slate-400 text-base md:text-lg font-bold">
                      From
                    </span>
                    <span className="text-4xl md:text-5xl font-black text-slate-900">
                      ${tool.starting_price}
                    </span>
                    <span className="text-slate-400 font-bold text-sm">
                      /year
                    </span>
                  </div>

                  <ul className="space-y-6 mb-12">
                    <li className="flex items-center gap-4 text-sm font-black text-slate-600">
                      <div className="w-7 h-7 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                      100% Genuine License
                    </li>
                    <li className="flex items-center gap-4 text-sm font-black text-slate-600">
                      <div className="w-7 h-7 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                      Official Support & Updates
                    </li>
                  </ul>

                  <Button
                    asChild
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-16 md:h-20 rounded-[24px] shadow-2xl shadow-blue-200 text-lg md:text-xl transition-all active:scale-95"
                  >
                    <a
                      href={tool.affiliate_url || tool.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Buy Now
                    </a>
                  </Button>
                  <p className="text-center text-[10px] text-slate-300 mt-8 font-black uppercase tracking-[0.2em]">
                    Verified Vendor Link
                  </p>
                </CardContent>
              </Card>

              {/* AI Matchmaker Sidebar Card (Restored) */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 md:p-10 rounded-[24px] md:rounded-[48px] text-white relative overflow-hidden shadow-xl shadow-blue-200 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <Sparkles className="w-10 h-10 mb-6 text-blue-200" />
                  <h4 className="text-2xl font-black mb-4 leading-tight">
                    Need a better match?
                  </h4>
                  <p className="text-blue-100 text-sm font-medium mb-8 leading-relaxed">
                    Our AI-powered Matchmaker can find you a more efficient tool
                    in under 60 seconds.
                  </p>
                  <Button
                    asChild
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 font-black rounded-2xl h-14 shadow-lg shadow-blue-900/20"
                  >
                    <Link href="/matchmaker">Launch Matchmaker</Link>
                  </Button>
                </div>
              </div>

              {/* Newsletter Subscription */}
              <div className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[48px] border border-slate-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[24px] flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-3">
                  CAD Insider
                </h4>
                <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed px-4">
                  Join 15,000+ professionals. Get weekly license deals and
                  software updates.
                </p>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your work email"
                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                  />
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl h-14 shadow-lg shadow-slate-200">
                    Subscribe Free
                  </Button>
                </div>
              </div>

              {/* Trending in Category (Restored) */}
              <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">
                    Trending AEC Tools
                  </h4>
                </div>
                <div className="space-y-6">
                  {trendingTools.map((t) => (
                    <Link
                      key={t.id}
                      href={`/tools/${t.slug}`}
                      className="flex items-center gap-4 group"
                    >
                      <ToolLogo
                        slug={t.slug} src={t.logo_url}
                        websiteUrl={t.official_url}
                        name={t.name}
                        className="w-12 h-12 rounded-xl border border-slate-50 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                          {t.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          {t.pricing_type}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                    </Link>
                  ))}
                </div>
                <Separator className="my-8 opacity-40" />
                <Button
                  asChild
                  variant="link"
                  className="w-full text-blue-600 font-black text-xs uppercase tracking-widest p-0 h-auto"
                >
                  <Link href="/tools">View Full Directory →</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
