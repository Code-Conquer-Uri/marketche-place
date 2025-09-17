import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,

  experimental: {
    ppr: "incremental",
    globalNotFound: true,
    // turbopackPersistentCaching: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
