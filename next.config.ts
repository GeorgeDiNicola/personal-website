import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // For Github Pages deployment
  images: {
    unoptimized: true, // Required: GitHub Pages can't process images server-side
  },
};

export default nextConfig;
