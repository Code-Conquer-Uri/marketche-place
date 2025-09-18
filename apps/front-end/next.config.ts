import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,

  experimental: {
    ppr: "incremental",
    globalNotFound: true,
    // turbopackPersistentCaching: true,
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "pub-2a82de7327c54a5aae15dd2b462bbe32.r2.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
