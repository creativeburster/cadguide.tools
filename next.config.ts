import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  async redirects() {
    const isProd = process.env.NODE_ENV === 'production';
    return [
      // 生产环境拦截所有对 /guides 的直接访问并重定向至 404
      ...(isProd ? [
        {
          source: '/guides',
          destination: '/404',
          permanent: false,
        },
        {
          source: '/guides/:path*',
          destination: '/404',
          permanent: false,
        }
      ] : []),
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
};

export default nextConfig;
