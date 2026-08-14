import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  compress: true,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'clsx',
      'tailwind-merge',
      '@radix-ui/react-slot',
      'class-variance-authority',
      '@base-ui/react'
    ],
  },
  allowedDevOrigins: ['127.0.0.1'],
  // redirects is not supported with output: export.
  // We migrated these redirect rules to public/_redirects.
  /*
  async redirects() {
    return [
      // 1. Redirect standards-iso-128-* to standards-iso-*
      {
        source: '/guides/standards-iso-128-:tool',
        destination: '/guides/standards-iso-:tool',
        permanent: true, // 301 redirect to transfer GSC SEO weights
      },
      // 2. Redirect industry-high-frequency-pcb-design to industry-pcb-design
      {
        source: '/guides/industry-high-frequency-pcb-design',
        destination: '/guides/industry-pcb-design',
        permanent: true,
      },
      // 3. Redirect haochen-cad to gstarcad (tool renaming)
      {
        source: '/tools/haochen-cad',
        destination: '/tools/gstarcad',
        permanent: true,
      },
      {
        source: '/alternatives/haochen-cad',
        destination: '/alternatives/gstarcad',
        permanent: true,
      },
      // 4. Redirect root-level legacy pricing paths
      {
        source: '/forever',
        destination: '/pricing/perpetual',
        permanent: true,
      },
      {
        source: '/3yr',
        destination: '/pricing/subscription',
        permanent: true,
      },
      {
        source: '/mo',
        destination: '/pricing/subscription',
        permanent: true,
      }
    ];
  },
  */
};

export default nextConfig;
