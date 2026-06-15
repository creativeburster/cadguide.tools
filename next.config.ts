import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  // 移除 static export 限制，充分利用 Vercel 环境
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
      }
    ];
  },
};

export default nextConfig;
