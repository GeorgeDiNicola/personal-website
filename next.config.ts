import type { NextConfig } from "next";

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
const normalizedBasePath =
  rawBasePath && rawBasePath !== "/"
    ? `/${rawBasePath.replace(/^\/+|\/+$/g, "")}`
    : undefined;

const nextConfig: NextConfig = {
  output: "export", // For Github Pages deployment
  trailingSlash: true, // Ensures static route folders like /personal/index.html
  basePath: normalizedBasePath,
  assetPrefix: normalizedBasePath,
  images: {
    qualities: [75, 100],
    unoptimized: true, // Required: GitHub Pages can't process images server-side
  }
};

export default nextConfig;
