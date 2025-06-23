/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // (Optional) also skip ESLint errors during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // @ts-expect-error this flag isn’t yet in the NextConfig types
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
