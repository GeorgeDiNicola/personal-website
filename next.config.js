const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
const normalizedBasePath =
  rawBasePath && rawBasePath !== "/"
    ? `/${rawBasePath.replace(/^\/+|\/+$/g, "")}`
    : "";

const nextConfig = {
  output: "export", // For Github Pages deployment
  trailingSlash: true, // Ensures static route folders like /personal/index.html
  assetPrefix: normalizedBasePath,
  images: {
    qualities: [75, 100],
    unoptimized: true, // Required: GitHub Pages can't process images server-side
  }
};

if (normalizedBasePath) {
  nextConfig.basePath = normalizedBasePath;
}

module.exports = nextConfig;
