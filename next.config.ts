import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Трейс зависимостей для Docker: один `node server.js`, без полного node_modules. */
  output: "standalone",
  poweredByHeader: false,
  serverExternalPackages: ["@prisma/client", "prisma"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
