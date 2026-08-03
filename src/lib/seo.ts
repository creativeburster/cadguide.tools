// Shared helpers for per-tool SEO: titles, descriptions, canonical URLs,
// keywords, and Schema.org JSON-LD payloads. Keeping these in one module
// makes them easy to unit-test and easy to reuse from both `page.tsx`
// (generateMetadata) and `opengraph-image.tsx`.
import type { Metadata } from "next";
import type { Tool, Category } from "./data";
import preservedIndexedSlugs from "./preserved-indexed-slugs.json";

export const SITE_URL = "https://cadguide.tools";
export const SITE_NAME = "CADGuide.tools";

const MAX_DESC = 160;

/** Pricing summary suitable for titles ("Free", "from $235", "Quote"). */
export function pricingSummary(tool: Tool): string {
  if (tool.pricing_type === "Free") return "Free";
  if (tool.pricing_type === "Freemium") return "Freemium";
  if (tool.quote_only) return "Quote";
  if (tool.starting_price > 0) return `from $${tool.starting_price}`;
  return tool.pricing_type;
}

/** Compact description suitable for `<meta name="description">` (≤160 chars). */
export function toolDescription(tool: Tool, category?: Category): string {
  const categoryName = category?.name ?? "CAD";
  const base = (tool.short_desc || tool.description || "").trim();
  const platforms = tool.platforms.join("/");
  const price = pricingSummary(tool);
  const score = tool.score?.toFixed(1);
  const suffix = ` Expert review (${score}/5), ${price}, ${platforms}.`;
  const budget = MAX_DESC - suffix.length;

  // Prefer the curated short_desc / description, trimmed to fit, with the
  // pricing + platforms suffix appended so the meta description always
  // surfaces the buyer's two biggest questions.
  let prefix = base;
  if (!prefix) {
    prefix = `${tool.name} ${categoryName} software review.`;
  }
  if (prefix.length > budget) {
    prefix = prefix.slice(0, budget - 1).replace(/\s+\S*$/, "") + "…";
  }
  return (prefix + suffix).trim();
}

// Sourced from src/lib/preserved-indexed-slugs.json. Edit that file (not this
// array) to add or remove slugs as more tools get indexed by Google.
const PRESERVED_INDEXED_SLUGS: readonly string[] = preservedIndexedSlugs.slugs;

const MAX_TITLE = 60;

/** Truncate a title to ≤60 chars, breaking at word boundary when possible. */
export function clampTitle(title: string): string {
  if (title.length <= MAX_TITLE) return title;
  const truncated = title.slice(0, MAX_TITLE - 3);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > MAX_TITLE * 0.6) {
    return truncated.slice(0, lastSpace) + "...";
  }
  return truncated + "...";
}

/** Title for both the `<title>` tag and Open Graph. */
export function toolTitle(tool: Tool, category?: Category): string {
  const categoryName = category?.name ?? "CAD";
  const price = pricingSummary(tool);
  const currentYear = new Date().getFullYear();

  // If the tool is already indexed (in our whitelist), preserve its exact title pattern containing price to guarantee zero rank volatility
  if (PRESERVED_INDEXED_SLUGS.includes(tool.slug)) {
    const full = `${tool.name} Review ${currentYear}: ${categoryName} Software (${price}) | ${SITE_NAME}`;
    if (full.length <= MAX_TITLE) return full;
    // Progressively shorten: drop site name, then price, then category
    const noSite = `${tool.name} Review ${currentYear}: ${categoryName} Software (${price})`;
    if (noSite.length <= MAX_TITLE) return noSite;
    const noPrice = `${tool.name} Review ${currentYear}: ${categoryName} | ${SITE_NAME}`;
    if (noPrice.length <= MAX_TITLE) return noPrice;
    const compact = `${tool.name} Review ${currentYear} | ${SITE_NAME}`;
    if (compact.length <= MAX_TITLE) return compact;
    return clampTitle(compact);
  }

  // For the unindexed, longer tail tools, we avoid repetitive templated price brackets 
  // (which Google's quality classifier flags as auto-generated thin content).
  // Instead, we use a distinct, highly compact specs-oriented title layout (conforming to Google's 50-60 character limit)
  // to establish high-quality authority and boost rapid indexing.
  const full = `${tool.name} Review ${currentYear}: ${categoryName} Tech Specs | ${SITE_NAME}`;
  if (full.length <= MAX_TITLE) return full;
  const noSite = `${tool.name} Review ${currentYear}: ${categoryName} Tech Specs`;
  if (noSite.length <= MAX_TITLE) return noSite;
  const compact = `${tool.name} Review ${currentYear} | ${SITE_NAME}`;
  if (compact.length <= MAX_TITLE) return compact;
  return clampTitle(compact);
}

/** Canonical URL for the tool detail page. */
export function toolCanonical(tool: Tool): string {
  return `${SITE_URL}/tools/${tool.slug}`;
}

/** Keywords array, kept short — used for `meta[name=keywords]` (legacy). */
export function toolKeywords(tool: Tool, category?: Category): string[] {
  const categoryName = category?.name ?? "CAD";
  return [
    tool.name,
    `${tool.name} review`,
    `${tool.name} pricing`,
    `${tool.name} alternatives`,
    `${tool.name} vs`,
    `${categoryName} software`,
    ...tool.industries.slice(0, 3).map((i) => `${tool.name} for ${i}`),
  ];
}

// ------- JSON-LD --------------------------------------------------------

/** Map our pricing_type strings to Schema.org price-spec values. */
function offerForTool(tool: Tool) {
  if (tool.pricing_type === "Free") {
    return {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: tool.official_url,
    };
  }
  if (tool.starting_price > 0) {
    return {
      "@type": "Offer",
      price: tool.starting_price.toString(),
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: tool.starting_price.toString(),
        priceCurrency: "USD",
        unitText:
          tool.pricing_type === "Subscription" ||
          tool.pricing_type === "Subscription / Perpetual"
            ? "MONTH"
            : "ANNUAL",
      },
      availability: "https://schema.org/InStock",
      url: tool.official_url,
    };
  }
  // Pricing is "Subscription" or "Perpetual" but the starting price is
  // not exposed — omit price so Google doesn't surface "0" rich-result.
  return {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    url: tool.official_url,
  };
}

/**
 * Build the aggregateRating payload from real external review counts
 * (G2 / Capterra / TrustRadius). If no verifiable ratings are present we
 * omit aggregateRating entirely — we never emit a placeholder or
 * synthesised count, since fake review structured data risks a Google
 * manual action.
 */
function aggregateRatingFor(tool: Tool) {
  const ratings = tool.external_ratings ?? [];
  if (ratings.length > 0) {
    // Normalise each source onto a 0-5 scale, weight by review count.
    const weighted = ratings.reduce(
      (acc, r) => {
        const norm = (r.score / r.max) * 5;
        acc.weightedSum += norm * r.count;
        acc.totalCount += r.count;
        return acc;
      },
      { weightedSum: 0, totalCount: 0 },
    );
    if (weighted.totalCount > 0) {
      const ratingValue = (weighted.weightedSum / weighted.totalCount).toFixed(
        1,
      );
      return {
        "@type": "AggregateRating",
        ratingValue,
        bestRating: "5",
        worstRating: "0",
        ratingCount: String(weighted.totalCount),
        reviewCount: String(weighted.totalCount),
      };
    }
  }
  // No real external review data: do NOT fabricate a rating count. Emitting a
  // placeholder reviewCount (e.g. 24) on tools that have no actual user reviews
  // is exactly the kind of fake structured data that risks a Google manual
  // action. Omit aggregateRating entirely until real external_ratings exist.
  return undefined;
}

// Custom official association metadata for Gstarsoft/DWG FastView (EEAT booster)
export const GSTARSOFT_PUBLISHER = {
  "@type": "Organization",
  "name": "Gstarsoft Co., Ltd.",
  "url": "https://www.gstarcad.net/",
  "sameAs": [
    "https://en.wikipedia.org/wiki/Gstarsoft",
    "https://twitter.com/gstarcad",
    "https://github.com/gstar-byte"
  ]
};

// Independent platform publisher with implicit Gstarsoft developer background sameAs links
export const SITE_PUBLISHER = {
  "@type": "Organization",
  "name": "CADGuide Tools Editorial Team",
  "url": SITE_URL,
  "logo": {
    "@type": "ImageObject",
    "url": `${SITE_URL}/favicon.svg`
  },
  "sameAs": [
    "https://github.com/gstar-byte/cadguide.tools",
    "https://x.com/cadguidetools"
  ]
};

/** Schema.org SoftwareApplication payload. */
export function softwareApplicationLd(tool: Tool, category?: Category) {
  const categoryName = category?.name ?? "CAD";
  const isGstarProduct = tool.slug === 'gstarcad' || tool.slug === 'dwg-fastview';

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${toolCanonical(tool)}#software`,
    name: tool.name,
    description:
      tool.description ||
      tool.short_desc ||
      `${tool.name} ${categoryName} software.`,
    url: toolCanonical(tool),
    applicationCategory: "DesignApplication",
    applicationSubCategory: categoryName,
    operatingSystem: tool.platforms.join(", "),
    image: tool.logo_url || undefined,
    softwareVersion: tool.version || undefined,
    dateModified: tool.last_updated || undefined,
    offers: offerForTool(tool),
    aggregateRating: aggregateRatingFor(tool),
    author: isGstarProduct ? GSTARSOFT_PUBLISHER : undefined,
    brand: isGstarProduct ? {
      "@type": "Brand",
      "name": "Gstarsoft"
    } : undefined,
    publisher: SITE_PUBLISHER,
  };
}

/** Schema.org BreadcrumbList payload. */
export function breadcrumbLd(tool: Tool, category?: Category) {
  const items: {
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Tools",
      item: `${SITE_URL}/tools`,
    },
  ];
  if (category) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: category.name,
      item: `${SITE_URL}/tools?category=${category.id}`,
    });
    items.push({
      "@type": "ListItem",
      position: 3,
      name: tool.name,
      item: toolCanonical(tool),
    });
  } else {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: tool.name,
      item: toolCanonical(tool),
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

// ------- Site-level page helpers ---------------------------------------

/**
 * Build a `Metadata` object for a static / index page. Includes title,
 * description, canonical URL, openGraph, and Twitter card so we don't
 * duplicate the same boilerplate on every page.
 */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string; // path beginning with '/', e.g. '/about'
  ogType?: "website" | "article";
}): Metadata {
  const url = `${SITE_URL}${opts.path}`;
  
  // Format title to satisfy Google's 50-60 character display limit
  let fullTitle = opts.title.trim();
  if (!fullTitle.includes(SITE_NAME)) {
    if (fullTitle.length + 3 + SITE_NAME.length <= 60) {
      fullTitle = `${fullTitle} | ${SITE_NAME}`;
    } else if (fullTitle.length + 3 + 8 <= 60) {
      fullTitle = `${fullTitle} | CADGuide`;
    } else if (fullTitle.length > 60) {
      fullTitle = fullTitle.slice(0, 57) + "...";
    }
  } else {
    if (fullTitle.length > 60) {
      fullTitle = fullTitle.slice(0, 57) + "...";
    }
  }

  return {
    title: fullTitle,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      type: opts.ogType ?? "website",
      url,
      title: fullTitle,
      description: opts.description,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: opts.description,
    },
    robots: { index: true, follow: true },
  };
}

/** Generic `WebSite` payload — useful as a homepage JSON-LD. */
export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Compare professional CAD, BIM, CAE/CAM, and EDA tools side by side. Unbiased reviews, real pricing, and deep technical specs.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/tools?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** `CollectionPage` payload — used on `/tools`, etc. */
export function collectionPageLd(opts: {
  name: string;
  description: string;
  path: string;
  numItems: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.numItems,
    },
  };
}

/** Simple breadcrumb payload for non-tool pages. */
export function siteBreadcrumbLd(items: { name: string; path: string }[]) {
  const filtered = items.filter((it) => it.path !== "/" && it.path !== "");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: filtered.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

/** Schema.org FAQPage payload — only emit when we have at least 1 FAQ. */
export function faqLd(tool: Tool) {
  if (!tool.faqs || tool.faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

/** Schema.org Organization payload for brand entity. */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CADGuide Tools Editorial Team",
    url: SITE_URL,
    description:
      "Compare professional CAD, BIM, CAE/CAM, and EDA tools side by side. Unbiased reviews, real pricing, and deep technical specs.",
    logo: `${SITE_URL}/favicon.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@cadguide.tools",
      contactType: "customer service",
      availableLanguage: "English",
    },
    sameAs: [
      'https://en.wikipedia.org/wiki/Gstarsoft',
      'https://twitter.com/gstarcad',
      'https://github.com/gstar-byte/cadguide.tools',
      'https://x.com/cadguidetools',
    ],
  };
}

/** Schema.org HowTo payload for Matchmaker page. */
export function howToLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Find Your Perfect CAD Software in 60 Seconds",
    description:
      "Answer 6 quick questions about your industry, platform, budget, team size, workflow, and CAD experience to get a personalised shortlist of CAD tools.",
    step: [
      {
        "@type": "HowToStep",
        name: "Select Your Industry",
        text: "Choose your primary industry (Architecture, Manufacturing, Civil Engineering, Electrical Engineering, etc.)",
      },
      {
        "@type": "HowToStep",
        name: "Choose Your Platform",
        text: "Select your operating system (Windows, macOS, Linux, or Web-based)",
      },
      {
        "@type": "HowToStep",
        name: "Set Your Budget",
        text: "Indicate your pricing preference (Free, Freemium, Subscription, Perpetual, or Enterprise)",
      },
      {
        "@type": "HowToStep",
        name: "Specify Team Size",
        text: "Select your team size (Individual, Small Team, or Enterprise)",
      },
      {
        "@type": "HowToStep",
        name: "Describe Your Workflow",
        text: "Choose your primary workflow (Design, Drafting, Analysis, Manufacturing, etc.)",
      },
      {
        "@type": "HowToStep",
        name: "Indicate CAD Experience",
        text: "Select your experience level (Beginner, Intermediate, or Expert)",
      },
    ],
    tool: [
      {
        "@type": "HowToTool",
        name: "Smart Matchmaker Algorithm",
      },
    ],
    totalTime: "PT1M",
  };
}

// ------- Guide article helpers -------------------------------------------

/** Schema.org TechArticle payload for Guide pages. */
export function guideArticleLd(opts: {
  title: string;
  excerpt: string;
  slug: string;
  author: string;
  date: string;
  category: string;
  softwareSlug: string;
  wordCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: opts.title,
    description: opts.excerpt,
    url: `${SITE_URL}/guides/${opts.slug}`,
    datePublished: opts.date,
    dateModified: opts.date,
    author: SITE_PUBLISHER,
    publisher: SITE_PUBLISHER,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/guides/${opts.slug}`,
    },
    articleSection: opts.category,
    about: {
      "@type": "SoftwareApplication",
      name: opts.softwareSlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    },
    ...(opts.wordCount ? { wordCount: opts.wordCount } : {}),
    inLanguage: "en",
    isAccessibleForFree: true,
  };
}

/** Schema.org BreadcrumbList payload for Guide pages. */
export function guideBreadcrumbLd(opts: {
  toolDisplayName: string;
  category: string;
  title: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: `${SITE_URL}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: opts.toolDisplayName,
        item: `${SITE_URL}/guides?software=${opts.toolDisplayName.toLowerCase().replace(/\s+/g, "-")}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: opts.title,
        item: `${SITE_URL}/guides/${opts.slug}`,
      },
    ],
  };
}

/** Schema.org Review payload from external ratings. Returns null if no external ratings. */
export function reviewLd(tool: Tool) {
  if (!tool.external_ratings || tool.external_ratings.length === 0) return null;
  
  return tool.external_ratings.map((rating) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: tool.name,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: (rating.score / rating.max * 5).toFixed(1),
      bestRating: "5",
      worstRating: "0",
    },
    author: {
      "@type": "Organization",
      name: rating.source,
    },
    reviewCount: rating.count,
    publisher: {
      "@type": "Organization",
      name: rating.source,
    },
  }));
}
