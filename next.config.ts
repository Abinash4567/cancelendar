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
    // turn off the missing-Suspense-with-CSR-bailout build-time error
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
