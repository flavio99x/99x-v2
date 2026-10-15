import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image (k8s). Vercel ignores it.
  output: "standalone",
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [{ source: "/about-us/contact-us", destination: "/contact", permanent: true }];
  },
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
