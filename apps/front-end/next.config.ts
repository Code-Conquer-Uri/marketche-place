import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,

  experimental: {
    ppr: "incremental",
    globalNotFound: true,
    // turbopackPersistentCaching: true,
  },
};

export default nextConfig;
