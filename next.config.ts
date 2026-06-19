import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mui/joy"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
