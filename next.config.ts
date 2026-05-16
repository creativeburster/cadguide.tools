import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  // 移除 static export 限制，充分利用 Vercel 环境
  // 可以在此加入之前 js 文件中的其他配置，比如 PWA 配置
};

export default nextConfig;
